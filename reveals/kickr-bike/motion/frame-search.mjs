// Framing search for the caption and hero-frame QA rules.
// For each candidate orientation it renders once at half zoom (plate off), so the picture covers twice the
// field, then scores every pan offset by shifting the caption / label / frame boxes over that picture.
// usage: node motion/frame-search.mjs '<json spec>' [page]
//   spec: { base: {yaw,pitch,roll,zoom,focus,...features}, label: {hint, readout}, yaws: [..], pitches: [..],
//           rolls: [..], extra: [{...}], pan: 240, panStep: 30, hero: false, room: 16, margin: 20,
//           keep: [x0, y0, x1, y1] (subject must land inside, fractions of the frame), top: 8 }
import { launch } from "../scripts/browser.mjs";
import { dirname, join, resolve } from "node:path";
import { fileURLToPath, pathToFileURL } from "node:url";
const HERE = dirname(fileURLToPath(import.meta.url));
const spec = JSON.parse(process.argv[2]);
const pagePath = resolve(process.argv[3] ?? join(HERE, "motion.html"));
const browser = await launch();
const page = await browser.newPage();
await page.setViewport({ width: 540, height: 960, deviceScaleFactor: 1 });
await page.goto(pathToFileURL(pagePath).href);
await page.waitForFunction(() => window.ready);
const size = await page.evaluate(() => window.SIZE);
await page.setViewport({ width: size.W, height: size.H, deviceScaleFactor: 1 });
await page.evaluate(() => document.fonts.ready);
await page.addStyleTag({
  content: `html.qa,html.qa body,html.qa .iso-page,html.qa .mo{background:transparent!important}html.qa .mo-bg,html.qa .mo-vignette,html.qa .mo-plate{display:none!important}`,
});
const tall = size.H > size.W * 1.5;
const margin = spec.margin ?? 20;
const lmargin = spec.lmargin ?? 24;
const useLabels = spec.labels !== false;
const room = spec.room ?? 16;
const keep = spec.keep ?? [0.25, 0.18, 0.85, 0.78];
// caption and label boxes for this beat's text
await page.evaluate((o) => window.pose(o), { ...spec.base, label: spec.label });
const R = await page.evaluate(({ m, lm, useLabels }) => {
  const root = document.querySelector(".mo");
  const c = (n) => root.querySelector(`.mo-corner[data-c="${n}"]`);
  const box = (els, g) => {
    const rs = els.filter((e) => e.textContent.trim()).map((e) => e.getBoundingClientRect());
    if (!rs.length) return null;
    return { x0: Math.min(...rs.map((r) => r.left)) - g, y0: Math.min(...rs.map((r) => r.top)) - g, x1: Math.max(...rs.map((r) => r.right)) + g, y1: Math.max(...rs.map((r) => r.bottom)) + g };
  };
  const cap = box([c("hint"), c("readout")], m);
  const p = root.querySelector(".mo-plate").getBoundingClientRect();
  const labels = useLabels ? [box([c("fig")], lm), box([c("title")], lm)] : [];
  return { boxes: [cap, ...labels].filter(Boolean), plate: { x0: p.left, y0: p.top, x1: p.right, y1: p.bottom } };
}, { m: margin, lm: lmargin, useLabels });
const cands = [];
const yaws = spec.yaws ?? [spec.base.yaw];
const pitches = spec.pitches ?? [spec.base.pitch];
const rolls = spec.rolls ?? [spec.base.roll ?? 0];
const extras = spec.extra ?? [{}];
for (const yaw of yaws)
  for (const pitch of pitches)
    for (const roll of rolls)
      for (const ex of extras) {
        const o = { ...spec.base, ...ex, yaw, pitch, roll, panX: 0, panY: 0, zoom: (ex.zoom ?? spec.base.zoom) / 2 };
        await page.evaluate((x) => {
          window.pose(x);
          document.documentElement.classList.add("qa");
        }, o);
        const b64 = await page.screenshot({ encoding: "base64", type: "png", omitBackground: true });
        await page.evaluate(() => document.documentElement.classList.remove("qa"));
        const res = await page.evaluate(
          async ({ b64, R, pan, panStep, hero, room, W, H, keep, tall }) => {
            const img = new Image();
            img.src = "data:image/png;base64," + b64;
            await img.decode();
            const cv = document.createElement("canvas");
            cv.width = img.width;
            cv.height = img.height;
            const g = cv.getContext("2d", { willReadFrequently: true });
            g.drawImage(img, 0, 0);
            const d = g.getImageData(0, 0, cv.width, cv.height).data;
            // integral image of dark pixels
            const w = cv.width, h = cv.height;
            const S = new Int32Array((w + 1) * (h + 1));
            for (let y = 0; y < h; y++) {
              let row = 0;
              for (let x = 0; x < w; x++) {
                const i = (y * w + x) * 4;
                row += d[i + 3] > 16 ? 1 : 0;
                S[(y + 1) * (w + 1) + x + 1] = S[y * (w + 1) + x + 1] + row;
              }
            }
            const sum = (x0, y0, x1, y1) => {
              x0 = Math.max(0, Math.min(w, Math.floor(x0))); x1 = Math.max(0, Math.min(w, Math.ceil(x1)));
              y0 = Math.max(0, Math.min(h, Math.floor(y0))); y1 = Math.max(0, Math.min(h, Math.ceil(y1)));
              if (x1 <= x0 || y1 <= y0) return 0;
              return S[y1 * (w + 1) + x1] - S[y0 * (w + 1) + x1] - S[y1 * (w + 1) + x0] + S[y0 * (w + 1) + x0];
            };
            const total = sum(0, 0, w, h);
            const out = [];
            for (let px = -pan; px <= pan; px += panStep)
              for (let py = -pan; py <= pan; py += panStep) {
                // the real frame is the half-size window centred at (W/2 + px/2, H/2 + py/2)
                const ox = W / 4 + px / 2, oy = H / 4 + py / 2;
                const map = (b) => [ox + b.x0 / 2, oy + b.y0 / 2, ox + b.x1 / 2, oy + b.y1 / 2];
                let bad = 0;
                for (const b of R.boxes) bad += sum(...map(b)) * 4;
                if (hero) {
                  const q = { x0: R.plate.x0 + room, y0: R.plate.y0 + room, x1: R.plate.x1 - room, y1: Math.min(R.plate.y1 - room, tall ? 624 : 1e9) };
                  const inner = sum(...map(q));
                  bad += (total - inner) * 4; // anything outside the inner room, including off-frame
                }
                // where the subject (frame centre at pan 0) lands in the real frame
                const sx = (W / 2 - px) / W, sy = (H / 2 - py) / H;
                const ok = sx >= keep[0] && sx <= keep[2] && sy >= keep[1] && sy <= keep[3];
                if (ok) out.push({ px, py, bad, sx: +sx.toFixed(2), sy: +sy.toFixed(2) });
              }
            return out;
          },
          { b64, R, pan: spec.pan ?? 240, panStep: spec.panStep ?? 30, hero: !!spec.hero, room, W: size.W, H: size.H, keep, tall },
        );
        for (const r of res) cands.push({ yaw, pitch, roll, ...ex, ...r });
      }
// clear first, then closest to the intended camera: yaw, pitch, roll, zoom and the size of the offset
const B = spec.base;
const cost = (c) => Math.abs(c.yaw - B.yaw) / 10 + Math.abs(c.pitch - B.pitch) / 8 + Math.abs(c.roll - (B.roll ?? 0)) / 5 + Math.abs((c.zoom ?? B.zoom) - B.zoom) * 3 + Math.hypot(c.px, c.py) / 50;
cands.sort((a, b) => a.bad - b.bad || cost(a) - cost(b));
const top = spec.top ?? 10;
console.log(`${size.ratio}: ${cands.length} candidates, ${cands.filter((c) => c.bad === 0).length} clear`);
for (const c of cands.slice(0, top)) console.log(JSON.stringify(c));
await browser.close();
