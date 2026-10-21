// Camera rule (series): the camera only moves forward. Zoom must never fall between consecutive samples except
// across a hard cut, and every cut must sit on a frame start so no motion-blur sub-frame straddles it
// (render.mjs averages frame n over sub-frames at (n + j/subs)/30, j = 0..subs-1).
// usage: node scripts/camera-check.mjs <motion page.html> [...more pages]
import { launch } from "./browser.mjs";
import { pathToFileURL } from "node:url";
import { resolve } from "node:path";
const browser = await launch();
let failures = 0;
for (const file of process.argv.slice(2)) {
  const page = await browser.newPage();
  await page.goto(pathToFileURL(resolve(file)).href);
  await page.waitForFunction(() => window.ready);
  const r = await page.evaluate(() => {
    const D = window.DURATION;
    const cuts = window.CUTS;
    const z = (t) => window.at(t).zoom;
    const out = { ratio: window.SIZE.ratio, cuts: [], frameDrops: [], fineDrops: [], offFrame: [] };
    for (const c of cuts) {
      const n = c * 30;
      if (Math.abs(n - Math.round(n)) > 1e-9) out.offFrame.push(c);
      const N = Math.round(n);
      // the last sub-frame of frame N-1 at the densest shutter the renderer uses (40) is still before the cut
      const lastSub = (N - 1 + 39 / 40) / 30;
      out.cuts.push({ t: c, frame: N, before: z(c - 1e-6), after: z(c), lastSubBefore: lastSub < c, firstSubAfter: z(N / 30) === z(c) });
    }
    const between = (a, b) => cuts.some((c) => c > a + 1e-12 && c <= b + 1e-12);
    const frames = Math.round(D * 30);
    for (let n = 0; n < frames - 1; n++) {
      const a = n / 30, b = (n + 1) / 30;
      if (z(b) < z(a) - 1e-9 && !between(a, b)) out.frameDrops.push([n, z(a), z(b)]);
    }
    const S = Math.round(D * 300);
    for (let i = 0; i < S - 1; i++) {
      const a = i / 300, b = (i + 1) / 300;
      if (z(b) < z(a) - 1e-9 && !between(a, b)) out.fineDrops.push([a, z(a), z(b)]);
    }
    return out;
  });
  console.log(`== ${r.ratio} (${file})`);
  for (const c of r.cuts)
    console.log(`  cut at ${c.t.toFixed(3)} s = frame ${c.frame}: zoom ${c.before.toFixed(2)} -> ${c.after.toFixed(2)} (${c.after < c.before ? "wider" : "tighter"}); frame ${c.frame - 1} ends before it: ${c.lastSubBefore}; frame ${c.frame} starts on it: ${c.firstSubAfter}`);
  const bad = r.offFrame.length + r.frameDrops.length + r.fineDrops.length + r.cuts.filter((c) => !c.lastSubBefore || !c.firstSubAfter).length;
  if (r.offFrame.length) console.log(`  FAIL cuts off a frame start: ${r.offFrame.join(", ")}`);
  if (r.frameDrops.length) console.log(`  FAIL zoom falls between frames: ${r.frameDrops.slice(0, 8).map(([n, a, b]) => `${n}->${n + 1} ${a.toFixed(3)}>${b.toFixed(3)}`).join("; ")}`);
  if (r.fineDrops.length) console.log(`  FAIL zoom falls within a frame (300/s): ${r.fineDrops.slice(0, 8).map(([t, a, b]) => `${t.toFixed(3)} ${a.toFixed(3)}>${b.toFixed(3)}`).join("; ")}`);
  console.log(bad ? `  ${bad} problem(s)` : `  pass: zoom never falls except at the ${r.cuts.length} cuts; every cut on a frame start (360 frames, 3600 fine samples)`);
  failures += bad;
  await page.close();
}
await browser.close();
process.exit(failures ? 1 : 0);
