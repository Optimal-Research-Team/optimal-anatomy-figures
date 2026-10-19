// Frame QA for the series spec (SERIES-SPEC.md). For every sample it renders the object alone on a transparent
// background (paper, vignette and plate hidden) and counts object pixels (alpha > 16):
//   caption: inside the visible caption block (Castoro title + spaced-caps sub-line), grown by --margin CSS px
//   labels:  inside each visible corner label, grown by --lmargin CSS px
//   frame:   outside the hairline frame shrunk by --room CSS px, and in 9:16 below y = 1248 (624 CSS px);
//            only for the --hero time ranges (the tumble-in and the hero)
//   safe:    9:16 only, any visible label or caption box outside the Instagram safe area
//            (1080 x 1920: top 269, bottom 672, sides 65 px; reading stops at y = 1248)
// usage: node motion/check-frame.mjs [page] [--rate 60] [--margin 20] [--lmargin 24] [--room 16] [--hero 0-2.1,10.6-12]
import { launch } from "../scripts/browser.mjs";
import { dirname, join, resolve } from "node:path";
import { fileURLToPath, pathToFileURL } from "node:url";
const HERE = dirname(fileURLToPath(import.meta.url));
const args = process.argv.slice(2);
const opt = (name, fallback) => {
  const i = args.indexOf(`--${name}`);
  return i >= 0 ? args[i + 1] : fallback;
};
const pagePath = resolve(args[0] && !args[0].startsWith("--") ? args[0] : join(HERE, "motion.html"));
const rate = Number(opt("rate", 60));
const margin = Number(opt("margin", 20));
const lmargin = Number(opt("lmargin", 24));
const room = Number(opt("room", 16));
const hero = (opt("hero", "") || "").split(",").filter(Boolean).map((r) => r.split("-").map(Number));
const browser = await launch();
const page = await browser.newPage();
await page.setViewport({ width: 540, height: 960, deviceScaleFactor: 1 });
page.on("pageerror", (e) => console.log("pageerror:", e.message));
await page.goto(pathToFileURL(pagePath).href);
await page.waitForFunction(() => window.ready);
const size = await page.evaluate(() => window.SIZE);
await page.setViewport({ width: size.W, height: size.H, deviceScaleFactor: 1 });
await page.evaluate(() => document.fonts.ready);
const tall = size.H > size.W * 1.5;
await page.addStyleTag({
  content: `html.qa,html.qa body,html.qa .iso-page,html.qa .mo{background:transparent!important}html.qa .mo-bg,html.qa .mo-vignette,html.qa .mo-plate{display:none!important}`,
});
const measure = () =>
  page.evaluate(({ cm, lm }) => {
    const root = document.querySelector(".mo");
    const c = (n) => root.querySelector(`.mo-corner[data-c="${n}"]`);
    const seen = (n) => Number(getComputedStyle(c(n)).opacity) > 0.02 && c(n).textContent.trim();
    const rect = (els) => {
      const rs = els.map((e) => e.getBoundingClientRect());
      return { x0: Math.min(...rs.map((r) => r.left)), y0: Math.min(...rs.map((r) => r.top)), x1: Math.max(...rs.map((r) => r.right)), y1: Math.max(...rs.map((r) => r.bottom)) };
    };
    const grow = (b, g) => b && { x0: b.x0 - g, y0: b.y0 - g, x1: b.x1 + g, y1: b.y1 + g };
    const cap = seen("hint") ? rect([c("hint"), c("readout")]) : null;
    const L = seen("fig") ? rect([c("fig")]) : null;
    const Rr = seen("title") ? rect([c("title")]) : null;
    const p = root.querySelector(".mo-plate").getBoundingClientRect();
    return { text: [cap, L, Rr].filter(Boolean), caption: grow(cap, cm), labels: [grow(L, lm), grow(Rr, lm)].filter(Boolean), plate: { x0: p.left, y0: p.top, x1: p.right, y1: p.bottom } };
  }, { cm: margin, lm: lmargin });
const objectPixels = async (M, withFrame) => {
  await page.evaluate(() => document.documentElement.classList.add("qa"));
  const b64 = await page.screenshot({ encoding: "base64", type: "png", omitBackground: true });
  await page.evaluate(() => document.documentElement.classList.remove("qa"));
  return page.evaluate(
    async ({ b64, M, withFrame, room, tall }) => {
      const img = new Image();
      img.src = "data:image/png;base64," + b64;
      await img.decode();
      const cv = document.createElement("canvas");
      cv.width = img.width;
      cv.height = img.height;
      const g = cv.getContext("2d", { willReadFrequently: true });
      g.drawImage(img, 0, 0);
      const d = g.getImageData(0, 0, cv.width, cv.height).data;
      const on = (x, y) => d[(y * cv.width + x) * 4 + 3] > 16;
      const inBox = (b) => {
        if (!b) return 0;
        let n = 0;
        for (let y = Math.max(0, Math.floor(b.y0)); y < Math.min(cv.height, Math.ceil(b.y1)); y++)
          for (let x = Math.max(0, Math.floor(b.x0)); x < Math.min(cv.width, Math.ceil(b.x1)); x++) if (on(x, y)) n++;
        return n;
      };
      const out = { caption: inBox(M.caption), labels: M.labels.reduce((s, b) => s + inBox(b), 0), frame: 0 };
      if (withFrame) {
        const q = { x0: M.plate.x0 + room, y0: M.plate.y0 + room, x1: M.plate.x1 - room, y1: Math.min(M.plate.y1 - room, tall ? 624 : 1e9) };
        for (let y = 0; y < cv.height; y++) for (let x = 0; x < cv.width; x++) if ((x < q.x0 || x >= q.x1 || y < q.y0 || y >= q.y1) && on(x, y)) out.frame++;
      }
      return out;
    },
    { b64, M, withFrame, room, tall },
  );
};
// Instagram Reels safe area in CSS px (the page is 540 x 960; output is 2x)
const SAFE = { x0: 32.5, y0: 134.5, x1: 507.5, y1: 624 };
const duration = await page.evaluate(() => window.DURATION);
const bad = [];
let samples = 0;
for (let n = 0; n <= Math.round(duration * rate); n++) {
  const t = Math.min(duration, n / rate);
  const sp = await page.evaluate((x) => (window.frame(x), window.speed(x, 1 / 30)), t);
  const isHero = hero.some(([a, b]) => t >= a - 1e-6 && t <= b + 1e-6);
  const M = await measure();
  const r = await objectPixels(M, isHero);
  let safe = 0;
  if (tall) for (const b of M.text) if (b.x0 < SAFE.x0 || b.x1 > SAFE.x1 || b.y0 < SAFE.y0 || b.y1 > SAFE.y1) safe++;
  samples++;
  if (r.caption || r.labels || r.frame || safe)
    bad.push(`t=${t.toFixed(3)} speed ${sp.toFixed(0)}  caption ${r.caption}  labels ${r.labels}${isHero ? `  frame ${r.frame}` : ""}${tall ? `  safe ${safe}` : ""}`);
}
console.log(`${size.ratio}: ${samples} samples at ${rate}/s · ${bad.length} with a violation (caption +${margin}px, labels +${lmargin}px, hero room ${room}px${tall ? ", Reels safe area, nothing below y 1248 in hero shots" : ""})`);
if (bad.length) console.log(bad.join("\n"));
await browser.close();
