// QA: object pixels vs caption boxes and the hairline frame.
// Renders an object-only pass (paper, vignette and plate hidden, transparent background) for each frame or pose,
// records the on-screen boxes of every label (from the DOM, with the plate visible) and the frame rect.
// usage: node scripts/caption-check.mjs <page.html> <outdir> frames [step=1]   |   ... poses '<json list>'
import { launch } from "./browser.mjs";
import { mkdirSync, writeFileSync } from "node:fs";
import { join, resolve } from "node:path";
import { pathToFileURL } from "node:url";
const [pageFile, outDir, mode = "frames", arg] = process.argv.slice(2);
mkdirSync(outDir, { recursive: true });
const browser = await launch();
const page = await browser.newPage();
await page.setViewport({ width: 540, height: 960, deviceScaleFactor: 1 });
await page.goto(pathToFileURL(resolve(pageFile)).href);
await page.waitForFunction(() => window.ready);
const size = await page.evaluate(() => window.SIZE);
await page.setViewport({ width: size.W, height: size.H, deviceScaleFactor: 1 });
await page.evaluate(() => document.fonts.ready);
await page.addStyleTag({ content: `.mo.qa .mo-plate,.mo.qa .mo-bg,.mo.qa .mo-vignette{visibility:hidden!important}html.qa,html.qa body,.mo.qa{background:transparent!important}` });
const root = await page.$(".mo");
const measure = () =>
  page.evaluate(() => {
    const mo = document.querySelector(".mo");
    const o = mo.getBoundingClientRect();
    // only labels that are actually visible count (captions fade on --cap-o, corner labels on --corner-o)
    const box = (el) => {
      const r = el.getBoundingClientRect();
      const visible = Number(getComputedStyle(el).opacity) > 0.01;
      return visible && r.width && r.height && el.textContent !== "" ? [r.left - o.left, r.top - o.top, r.right - o.left, r.bottom - o.top] : null;
    };
    const out = {};
    for (const c of ["fig", "title", "hint", "readout"]) out[c] = box(document.querySelector(`.mo-corner[data-c="${c}"]`));
    const plate = document.querySelector(".mo-plate");
    const dot = document.querySelector(".mo-dot");
    out.dot = dot && getComputedStyle(dot).display !== "none" ? box(dot) || (() => { const r = dot.getBoundingClientRect(); return [r.left - o.left, r.top - o.top, r.right - o.left, r.bottom - o.top]; })() : null;
    const p = plate.getBoundingClientRect();
    out.frame = [p.left - o.left + 1, p.top - o.top + 1, p.right - o.left - 1, p.bottom - o.top - 1];
    return out;
  });
const shoot = async (name) => {
  await page.evaluate(() => { document.documentElement.classList.add("qa"); document.querySelector(".mo").classList.add("qa"); });
  await root.screenshot({ path: join(outDir, `${name}.png`), omitBackground: true });
  await page.evaluate(() => { document.documentElement.classList.remove("qa"); document.querySelector(".mo").classList.remove("qa"); });
};
const meta = [];
if (mode === "poses") {
  const list = JSON.parse(arg);
  for (let i = 0; i < list.length; i++) {
    await page.evaluate((o) => window.pose({ ...o, zoom: o.raw ? o.zoom : window.fitZoom(o.zoom ?? 1) }), list[i]);
    meta.push({ name: `p${i}`, ...(await measure()) });
    await shoot(`p${i}`);
  }
} else {
  // frames: every `step`-th output frame at 30 fps; fine: 60 samples a second (covers the motion-blur shutter).
  const step = Number(arg ?? 1);
  const rate = mode === "fine" ? 60 : 30;
  const n = Math.round((await page.evaluate(() => window.DURATION)) * rate);
  for (let f = 0; f < n; f += step) {
    await page.evaluate((t) => window.frame(t), f / rate);
    meta.push({ name: `f_${String(f).padStart(4, "0")}`, t: f / rate, ...(await measure()) });
    await shoot(`f_${String(f).padStart(4, "0")}`);
  }
}
writeFileSync(join(outDir, "meta.json"), JSON.stringify({ size, meta }));
await browser.close();
console.log(`wrote ${meta.length} object-only frames to ${outDir}`);
