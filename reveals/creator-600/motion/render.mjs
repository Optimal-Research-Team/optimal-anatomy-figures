import { launch } from "../scripts/browser.mjs";
import { closeSync, mkdirSync, openSync, readSync, statSync, writeFileSync } from "node:fs";
import { dirname, join, resolve } from "node:path";
import { fileURLToPath, pathToFileURL } from "node:url";
const HERE = dirname(fileURLToPath(import.meta.url));
const [mode, a, b, ...rest] = process.argv.slice(2);
const opt = (name, fallback) => {
  const i = rest.indexOf(`--${name}`);
  return i >= 0 ? rest[i + 1] : fallback;
};
const page_ = resolve(opt("page", join(HERE, "motion.html")));
const browser = await launch();
const page = await browser.newPage();
const DPR = Number(opt("dpr", 2));
await page.setViewport({ width: 540, height: 960, deviceScaleFactor: DPR });
page.on("pageerror", (e) => console.log("pageerror:", e.message));
page.on("console", (m) => m.type() === "error" && console.log("console:", m.text()));
await page.goto(pathToFileURL(page_).href);
await page.waitForFunction(() => window.ready);
const size = await page.evaluate(() => window.SIZE);
await page.setViewport({ width: size.W, height: size.H, deviceScaleFactor: DPR });
await page.evaluate(() => document.fonts.ready);
const root = await page.$(".mo");
const shoot = async (t, path) => {
  const stats = await page.evaluate((x) => window.frame(x), t);
  if (stats.forced || stats.unseparated)
    console.log(`t=${t.toFixed(3)} forced ${stats.forced} unseparated ${stats.unseparated}`);
  await root.screenshot({ path, type: "png" });
};
if (mode === "poses") {
  mkdirSync(b, { recursive: true });
  const list = JSON.parse(a);
  for (let i = 0; i < list.length; i++) {
    await page.evaluate((o) => window.pose(o), list[i]);
    await root.screenshot({ path: join(b, `p${i}.png`), type: "png" });
  }
} else if (mode === "stills") {
  mkdirSync(b, { recursive: true });
  for (const t of a.split(",").map(Number)) await shoot(t, join(b, `t${t.toFixed(3)}.png`));
} else if (mode === "blur") {
  mkdirSync(a, { recursive: true });
  const step = Number(opt("step", 4));
  const most = Number(opt("most", 40));
  const fps = 30;
  const duration = await page.evaluate(() => window.DURATION);
  const n0 = Math.round(Number(opt("from", 0)) * fps);
  const n1 = Math.round(Number(opt("to", duration)) * fps);
  const plan = await page.evaluate(
    (n02, n12, fps2, step2, most2) => {
      const out = [];
      for (let n = n02; n < n12; n++)
        out.push(Math.max(1, Math.min(most2, Math.ceil(window.speed(n / fps2, 1 / fps2) / step2))));
      return out;
    },
    n0,
    n1,
    fps,
    step,
    most,
  );
  const total = plan.reduce((x, y) => x + y, 0);
  console.log(`${plan.length} frames · ${total} sub-frames · up to ${Math.max(...plan)} per frame`);
  // Resumable: the plan above depends only on the page, so a restart writes the same file names. A sub-frame
  // whose PNG already exists, is non-empty and ends in the PNG IEND chunk is kept; a missing or truncated one is redrawn.
  const complete = (path) => {
    try {
      const size = statSync(path).size;
      if (size < 12) return false;
      const fd = openSync(path, "r");
      const tail = Buffer.alloc(8);
      readSync(fd, tail, 0, 8, size - 8);
      closeSync(fd);
      return tail.toString("latin1", 0, 4) === "IEND";
    } catch {
      return false;
    }
  };
  // the plan is written next to the frames so a resumed run can be compared against it
  writeFileSync(join(a, "plan.json"), JSON.stringify({ page: page_, step, most, n0, n1, total, plan }));
  const t0 = Date.now();
  let done = 0;
  let kept = 0;
  for (let n = n0; n < n1; n++) {
    const subs = plan[n - n0];
    for (let j = 0; j < subs; j++) {
      const path = join(a, `b_${String(n).padStart(4, "0")}_${String(j).padStart(2, "0")}.png`);
      if (complete(path)) kept++;
      else await shoot((n + j / subs) / fps, path);
      done++;
    }
    if ((n - n0) % 15 === 0)
      console.log(`frame ${n} · ${subs} subs · ${done}/${total} (${kept} kept from an earlier run) · ${((Date.now() - t0) / 1e3).toFixed(0)} s`);
  }
  console.log(`done · ${total} sub-frames · ${kept} kept · ${total - kept} drawn`);
} else {
  console.log(
    "usage: node motion/render.mjs stills <t,t,…> <dir> | poses <json> <dir> | blur <dir> [--step 4] [--most 40]",
  );
}
await browser.close();
