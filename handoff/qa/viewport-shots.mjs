// Screenshots of the visible viewport at given scroll positions, for check-embeds.mjs's screenshot pass.
//
//   node handoff/qa/viewport-shots.mjs <url> <width> '[{"y":1042,"out":"a.png"}, ...]'
//
// A plain capture of what's on screen, unlike drive.mjs's beyond-viewport capture: that one reflows pages sized in
// viewport units (beoptimal.ca's hero) and doesn't capture cross-origin frames (the 3-D machines' sandboxed iframes
// came out blank in it). Phone widths (< 600 px) are emulated as mobile, as in drive.mjs. Needs CHROME_PATH
// (source .env.chrome).
import { spawn } from "node:child_process";
import { mkdtempSync, rmSync, writeFileSync } from "node:fs";
import { tmpdir } from "node:os";
import { join } from "node:path";

const [url, widthArg, listArg] = process.argv.slice(2);
if (!url || !widthArg || !listArg) {
  console.error("usage: node handoff/qa/viewport-shots.mjs <url> <width> '<json list of {y, out}>'");
  process.exit(1);
}
const width = Number(widthArg);
const shots = JSON.parse(listArg);
const sleep = (ms) => new Promise((r) => setTimeout(r, ms));
const profile = mkdtempSync(join(tmpdir(), "viewport-shots-"));
const chrome = spawn(process.env.CHROME_PATH, ["--headless=new", "--remote-debugging-port=0", `--user-data-dir=${profile}`, "--no-first-run", "--no-default-browser-check", "--hide-scrollbars", "--enable-unsafe-swiftshader", "--ignore-gpu-blocklist", "about:blank"]);
try {
  const port = await new Promise((res, rej) => {
    chrome.stderr.on("data", (d) => {
      const m = /DevTools listening on ws:\/\/[^:]+:(\d+)/.exec(String(d));
      if (m) res(m[1]);
    });
    chrome.on("exit", () => rej(new Error("Chrome exited before DevTools came up (is CHROME_PATH set?)")));
  });
  const page = await (await fetch(`http://127.0.0.1:${port}/json/new?about:blank`, { method: "PUT" })).json();
  const ws = new WebSocket(page.webSocketDebuggerUrl);
  await new Promise((r) => ws.addEventListener("open", r));
  let id = 0;
  const pending = new Map();
  ws.addEventListener("message", (e) => {
    const m = JSON.parse(e.data);
    if (m.id && pending.has(m.id)) {
      pending.get(m.id)(m);
      pending.delete(m.id);
    }
  });
  const send = (method, params = {}) =>
    new Promise((r) => {
      const i = ++id;
      pending.set(i, r);
      ws.send(JSON.stringify({ id: i, method, params }));
    });
  await send("Page.enable");
  await send("Emulation.setEmulatedMedia", { features: [{ name: "prefers-color-scheme", value: "light" }] });
  await send("Emulation.setDeviceMetricsOverride", { width, height: 900, deviceScaleFactor: 1, mobile: width < 600 });
  await send("Page.navigate", { url });
  await sleep(3000);
  for (const { y, out } of shots) {
    await send("Runtime.evaluate", { expression: `scrollTo({ top: ${Number(y)}, behavior: "instant" })` });
    await sleep(2500); // a figure or 3-D frame loads when its slot nears the viewport
    const shot = await send("Page.captureScreenshot", { format: "png" });
    writeFileSync(out, Buffer.from(shot.result.data, "base64"));
  }
  ws.close();
} finally {
  chrome.kill();
  try {
    rmSync(profile, { recursive: true, force: true });
  } catch {}
}
