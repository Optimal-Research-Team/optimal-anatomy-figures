// Series-spec QA for the reveal film, per frame.
//
//   node motion/qa.mjs <page> [--rate 60] [--from 0] [--to 12] [--hero 0-1.9,10.45-12]
//   node motion/qa.mjs <page> --search '{"base":{…}, "yaw":[…], …, "zoom":[…]}' [--hero-shot]
//
// Each sample renders the machine alone on a transparent background (paper, plate and text hidden) and reads its
// alpha as the scene mask. Assertions, in pixels of the delivered film (film px = 2 css px):
//   1. caption clearance: no scene pixel inside the caption box (title line + sub-line) grown by 40 px, while visible;
//   2. corner-label clearance: no scene pixel inside either corner label's box grown by 24 px, while visible;
//   3. hero in frame: in the first and last shots the whole machine sits inside the hairline frame, 24 px clear of it;
//      in 9:16 also below the header block and above y = 1248, 24 px clear of both;
//   4. 9:16 safe area: every visible label and caption sits inside x 65…1015, y 269…1248;
//   5. forward-only camera: zoom never decreases except at a hard cut on an exact frame start (a single-frame jump).
// Samples run at --rate per second (60 by default), so the motion-blur shutter between frames is covered too.
import { launch } from "../scripts/browser.mjs";
import { decodePng } from "../scripts/png.mjs";
import { dirname, join, resolve } from "node:path";
import { fileURLToPath, pathToFileURL } from "node:url";
const HERE = dirname(fileURLToPath(import.meta.url));
const argv = process.argv.slice(2);
const opt = (name, fallback) => {
  const i = argv.indexOf(`--${name}`);
  return i >= 0 ? argv[i + 1] : fallback;
};
const pageFile = argv[0] && !argv[0].startsWith("--") ? argv[0] : join(HERE, "motion.html");
const OUT = 2;
const CAP = 40 / OUT;
const LABEL = 24 / OUT;
const HERO = 24 / OUT;
const browser = await launch();
const page = await browser.newPage();
await page.setViewport({ width: 540, height: 960, deviceScaleFactor: 1 });
await page.goto(pathToFileURL(resolve(pageFile)).href);
await page.waitForFunction(() => window.ready);
const size = await page.evaluate(() => window.SIZE);
await page.setViewport({ width: size.W, height: size.H, deviceScaleFactor: 1 });
await page.evaluate(() => document.fonts.ready);
await page.addStyleTag({
  content:
    "html.qa,html.qa body,html.qa .iso-page,html.qa .mo{background:transparent!important}html.qa .mo-bg,html.qa .mo-vignette,html.qa .mo-plate{visibility:hidden!important}",
});
const tall = size.H > size.W;
// the Reels safe area in css px (1080 x 1920 film: top 269, bottom 672, sides 65)
const SAFE = { x0: 65 / OUT, y0: 269 / OUT, x1: size.W - 65 / OUT, y1: 1248 / OUT };
const root = await page.$(".mo");
async function sample(apply) {
  const info = await page.evaluate((a) => {
    document.documentElement.classList.remove("qa");
    const mo = document.querySelector(".mo");
    if (a.kind === "t") window.frame(a.t);
    else window.pose(a.o);
    const base = mo.getBoundingClientRect();
    const rect = (el) => {
      const r = el.getBoundingClientRect();
      return { x0: r.left - base.left, y0: r.top - base.top, x1: r.right - base.left, y1: r.bottom - base.top };
    };
    const vis = (el) => el.textContent.trim() && Number(getComputedStyle(el).opacity) > 0.02;
    const corners = Object.fromEntries([...mo.querySelectorAll(".mo-corner")].map((el) => [el.dataset.c, vis(el) ? rect(el) : null]));
    const plate = rect(mo.querySelector(".mo-plate"));
    document.documentElement.classList.add("qa");
    return { corners, plate };
  }, apply);
  const img = decodePng(await root.screenshot({ type: "png", omitBackground: true }));
  await page.evaluate(() => document.documentElement.classList.remove("qa"));
  const { w, h, data } = img;
  const hit = (x, y) => data[(y * w + x) * 4 + 3] > 8;
  const res = { fail: [], near: {} };
  const blocks = [];
  const { fig, title, hint, readout } = info.corners;
  const capParts = [hint, readout].filter(Boolean);
  if (capParts.length) blocks.push({ c: "caption", m: CAP, x0: Math.min(...capParts.map((b) => b.x0)), y0: Math.min(...capParts.map((b) => b.y0)), x1: Math.max(...capParts.map((b) => b.x1)), y1: Math.max(...capParts.map((b) => b.y1)) });
  if (fig) blocks.push({ c: "fig", m: LABEL, ...fig });
  if (title) blocks.push({ c: "title", m: LABEL, ...title });
  for (const b of blocks) {
    let n = 0;
    let best = Infinity;
    const R = 50;
    for (let y = Math.max(0, Math.floor(b.y0 - R)); y < Math.min(h, Math.ceil(b.y1 + R)); y++)
      for (let x = Math.max(0, Math.floor(b.x0 - R)); x < Math.min(w, Math.ceil(b.x1 + R)); x++) {
        if (!hit(x, y)) continue;
        const d = Math.hypot(Math.max(b.x0 - x, 0, x - b.x1), Math.max(b.y0 - y, 0, y - b.y1));
        if (d < best) best = d;
        if (d < b.m) n++;
      }
    res.near[b.c] = best;
    if (n) res.fail.push(`${b.c} ${n}px`);
    if (tall && (b.x0 < SAFE.x0 || b.x1 > SAFE.x1 || b.y0 < SAFE.y0 || b.y1 > SAFE.y1)) res.fail.push(`${b.c} outside safe area`);
  }
  let x0 = w, y0 = h, x1 = -1, y1 = -1;
  for (let y = 0; y < h; y++) for (let x = 0; x < w; x++) if (hit(x, y)) { if (x < x0) x0 = x; if (x > x1) x1 = x; if (y < y0) y0 = y; if (y > y1) y1 = y; }
  res.bbox = x1 >= 0 ? [x0, y0, x1, y1] : null;
  if (apply.hero && res.bbox) {
    const p = info.plate;
    const bottom = tall ? Math.min(p.y1, SAFE.y1) : p.y1;
    // 9:16: the object sits below the header block (labels and caption), not beside it
    const header = tall ? Math.max(p.y0, ...Object.values(info.corners).filter(Boolean).map((b) => b.y1)) : p.y0;
    res.room = [x0 - p.x0, y0 - header, p.x1 - x1, bottom - y1].map((v) => Math.round(v * OUT));
    if (res.room.some((v) => v < HERO * OUT)) res.fail.push(`hero room ${JSON.stringify(res.room)}`);
  }
  return res;
}
const searchArg = opt("search", null);
if (searchArg) {
  const S = JSON.parse(searchArg);
  const keys = ["yaw", "pitch", "roll", "panX", "panY"];
  let combos = [{}];
  for (const k of keys) {
    const vals = S[k] ?? [S.base[k] ?? 0];
    combos = combos.flatMap((c) => vals.map((v) => ({ ...c, [k]: v })));
  }
  const zooms = (S.zoom ?? [S.base.zoom]).slice().sort((x, y) => y - x);
  const hero = argv.includes("--hero-shot");
  const found = [];
  for (const c of combos)
    for (const z of zooms) {
      const r = await sample({ kind: "o", o: { ...S.base, ...c, zoom: z }, hero });
      if (argv.includes("--why")) console.log(JSON.stringify({ ...c, zoom: z }), r.fail.join(" · ") || "clear", JSON.stringify(r.bbox), JSON.stringify(r.room));
      if (!r.fail.length) {
        found.push({ ...c, zoom: z, bbox: r.bbox, room: r.room });
        break;
      }
    }
  found.sort((x, y) => y.zoom - x.zoom);
  console.log(`${found.length}/${combos.length} framings clear`);
  for (const f of found.slice(0, Number(opt("top", 10)))) console.log(JSON.stringify(f));
  await browser.close();
  process.exit(0);
}
// 5. forward-only camera: zoom never decreases between consecutive samples (240/s) except at a hard cut, and each
//    cut sits on an exact frame start and completes in one frame (the frame before is all the old framing).
const zoomCheck = await page.evaluate(() => {
  const cuts = window.CUTS ?? [];
  const N = Math.round(window.DURATION * 240);
  const drops = [];
  let prev = window.at(0).zoom;
  for (let k = 1; k <= N; k++) {
    const t = k / 240;
    const z = window.at(t).zoom;
    if (z < prev * (1 - 1e-9) && !cuts.some((c) => c > (k - 1) / 240 + 1e-12 && c <= t + 1e-12)) drops.push(t.toFixed(4));
    prev = z;
  }
  const report = cuts.map((c) => {
    const n = Math.round(c * 30);
    const lastSub = window.at((n - 1 / 40) / 30).zoom; // the latest sub-frame the renderer takes before the cut
    const before = window.at(c - 1e-6).zoom;
    const after = window.at(c).zoom;
    return { t: +c.toFixed(4), frame: n, onFrameStart: Math.abs(c * 30 - n) < 1e-9, zoom: [+before.toFixed(3), +after.toFixed(3)], singleFrame: Math.abs(lastSub - before) < 1e-6 };
  });
  return { drops, report };
});
const rate = Number(opt("rate", 60));
const duration = await page.evaluate(() => window.DURATION);
const heroSpans = (opt("hero", "") || "").split(",").filter(Boolean).map((s) => s.split("-").map(Number));
const n0 = Math.round(Number(opt("from", 0)) * rate);
const n1 = Math.round(Number(opt("to", duration)) * rate);
const lines = [];
const closest = {};
let heroMin = Infinity;
let bad = 0;
for (let n = n0; n <= n1; n++) {
  const t = Math.min(n / rate, duration);
  const hero = heroSpans.some(([a, b]) => t >= a - 1e-6 && t <= b + 1e-6);
  const r = await sample({ kind: "t", t, hero });
  for (const [k, v] of Object.entries(r.near)) closest[k] = Math.min(closest[k] ?? Infinity, v);
  if (r.room) heroMin = Math.min(heroMin, ...r.room);
  if (r.fail.length) {
    bad++;
    if (bad <= 80) lines.push(`t=${t.toFixed(3)} ${r.fail.join(" · ")}`);
  }
}
lines.push(bad ? `${bad} of ${n1 - n0 + 1} samples fail` : `all ${n1 - n0 + 1} samples pass (${rate}/s): captions and labels clear, hero shots in frame${tall ? ", text inside the Reels safe area" : ""}`);
lines.push(
  "closest scene pixel to each text block, in film px: " +
    ["caption", "fig", "title"].map((k) => `${k} ${closest[k] === undefined || !Number.isFinite(closest[k]) ? "> 100" : Math.round(closest[k] * OUT)}`).join(" · ") +
    ` · tightest hero room ${Number.isFinite(heroMin) ? heroMin : "n/a"} px`,
);
lines.push(
  zoomCheck.drops.length
    ? `zoom decreases outside a cut at ${zoomCheck.drops.slice(0, 12).join(", ")}${zoomCheck.drops.length > 12 ? " …" : ""}`
    : `forward-only camera: zoom never decreases except at the ${zoomCheck.report.length} cuts`,
);
for (const c of zoomCheck.report) lines.push(`  cut at ${c.t.toFixed(3)} s (frame ${c.frame}): zoom ${c.zoom[0]} → ${c.zoom[1]}, ${c.onFrameStart ? "on a frame start" : "NOT ON A FRAME START"}, ${c.singleFrame ? "single-frame jump" : "NOT A SINGLE-FRAME JUMP"}`);
if (zoomCheck.drops.length || zoomCheck.report.some((c) => !c.onFrameStart || !c.singleFrame)) lines.push("forward-only check FAILS");
console.log(lines.join("\n"));
await browser.close();
