// Per-frame layout check for the film page.
//  1. caption zone: while a caption is visible, no scene pixel may fall inside the caption block's
//     bounding box grown by MARGIN px (hint + readout, wherever they are placed for that shot);
//  2. corner labels: while the top-left / top-right labels are visible, no scene pixel may fall inside
//     either label's box grown by CORNER px;
//  3. wide shots (WIDE windows in motion/timeline.mjs): the whole machine sits inside the hairline
//     frame with at least ROOM px of breathing room;
//  4. hero shots (HERO windows: the first and last shot, SERIES-SPEC): inside the hairline frame by at least
//     24 output px, and on 9:16 the whole object above y = 1248 (output px) with room to breathe;
//  5. 9:16 only: every visible label and caption sits inside the Instagram safe area
//     (1080 × 1920 output: top 269, bottom 672, sides 65 px covered by the Reels UI).
//  6. the camera only moves forward: zoom never decreases between consecutive samples (600 Hz) except across
//     a declared hard cut; every cut sits exactly on a frame boundary and no motion-blur sub-frame falls inside
//     its switch window, so a frame never averages the two framings.
// Sampling covers the blur shutter: by default every sub-frame time the renderer will average
// (render.mjs blur --step 4 --most 40) plus the middle of each frame's shutter; --hz N samples a fixed rate instead.
// All margins below are CSS px of the 540-wide film page (1 CSS px = 2 output px).
// Each sample renders the scene alone (paper, vignette and plate hidden, transparent background) and
// counts opaque pixels, so the test is exact rather than a bounding-box estimate.
// usage: node motion/check-frame.mjs [page.html] [--hz N] [--from 0] [--to 12] [--margin 40] [--corner 24] [--room 16]
import { launch } from "../scripts/browser.mjs";
import { dirname, join, resolve } from "node:path";
import { fileURLToPath, pathToFileURL } from "node:url";
const HERE = dirname(fileURLToPath(import.meta.url));
const args = process.argv.slice(2);
const opt = (name, fallback) => {
  const i = args.indexOf(`--${name}`);
  return i >= 0 ? Number(args[i + 1]) : fallback;
};
const file = resolve(args[0] && !args[0].startsWith("--") ? args[0] : join(HERE, "motion.html"));
const HZ = opt("hz", 0);
const MARGIN = opt("margin", 40);
const ROOM = opt("room", 16);
const CORNER = opt("corner", 24);
const HERO_ROOM = 12; // 24 output px
const SAFE_916 = [65 / 2, 269 / 2, 540 - 65 / 2, 1248 / 2]; // x0, y0, x1, y1 in CSS px
const ALPHA = 10; // ignore pixels below 4% coverage (antialiasing dust)
const browser = await launch();
const page = await browser.newPage();
await page.setViewport({ width: 540, height: 960 });
page.on("pageerror", (e) => console.log("pageerror:", e.message));
await page.goto(pathToFileURL(file).href);
await page.waitForFunction(() => window.ready);
const size = await page.evaluate(() => window.SIZE);
await page.setViewport({ width: size.W, height: size.H, deviceScaleFactor: 1 });
await page.evaluate(() => document.fonts.ready);
await page.addStyleTag({
  content: "html,body{background:transparent!important}.mo{background:transparent!important}.mo .mo-bg,.mo .mo-vignette{display:none!important}.mo .mo-plate{visibility:hidden!important}",
});
const duration = await page.evaluate(() => window.DURATION);
const from = opt("from", 0);
const to = opt("to", duration);
// 6. forward-only camera
const cam = await page.evaluate((duration) => {
  const out = { decreases: [], cuts: [], straddles: [], offFrame: [] };
  const N = Math.round(duration * 600);
  let prev = window.at(0).zoom;
  for (let i = 1; i <= N; i++) {
    const t0 = (i - 1) / 600;
    const t1 = i / 600;
    const z = window.at(t1).zoom;
    if (z < prev - 1e-9 && !window.CUTS.some((c) => c > t0 - 1e-9 && c <= t1 + 1e-9)) out.decreases.push([t0, t1, prev, z]);
    prev = z;
  }
  for (const c of window.CUTS) {
    const n = Math.round(c * 30);
    if (Math.abs(c * 30 - n) > 1e-6) out.offFrame.push(c);
    out.cuts.push({ c, frame: n, before: window.at(c - 1 / 30).zoom, last: window.at(c - window.CUT_WINDOW * 1.5).zoom, after: window.at(c).zoom });
    // the renderer's sub-frames for the frame that ends at the cut
    const subs = Math.max(1, Math.min(40, Math.ceil(window.speed((n - 1) / 30, 1 / 30) / 4)));
    for (let j = 0; j < subs; j++) {
      const t = (n - 1 + j / subs) / 30;
      if (t > c - window.CUT_WINDOW - 1e-9 && t < c) out.straddles.push([c, t]);
    }
  }
  return out;
}, duration);
const camBad = [];
for (const [t0, t1, a, b] of cam.decreases) camBad.push(`zoom falls ${a.toFixed(4)} → ${b.toFixed(4)} between ${t0.toFixed(4)} and ${t1.toFixed(4)} s with no cut`);
for (const c of cam.offFrame) camBad.push(`cut at ${c} s is not on a frame boundary`);
for (const [c, t] of cam.straddles) camBad.push(`sub-frame at ${t.toFixed(5)} s falls inside the switch window of the cut at ${c} s`);
console.log(`camera: zoom checked at 600 Hz · ${cam.cuts.length} hard cuts: ${cam.cuts.map((x) => `${x.c.toFixed(3)} s (frame ${x.frame}, zoom ${x.last.toFixed(2)} → ${x.after.toFixed(2)})`).join(", ")}`);
console.log(camBad.length ? `camera FAILS:\n${camBad.join("\n")}` : "camera only moves forward: zoom never decreases except at the hard cuts, each a single-frame jump on a frame boundary with no sub-frame straddling it");
let times = [];
if (HZ) for (let n = Math.round(from * HZ); n <= Math.round(to * HZ); n++) times.push(Math.min(duration, n / HZ));
else
  times = await page.evaluate(
    (from, to, duration) => {
      const out = [];
      for (let n = Math.floor(from * 30); n < Math.min(Math.ceil(to * 30), Math.round(duration * 30)); n++) {
        const subs = Math.max(1, Math.min(40, Math.ceil(window.speed(n / 30, 1 / 30) / 4)));
        for (let j = 0; j < subs; j++) out.push((n + j / subs) / 30);
        out.push((n + 0.5) / 30);
      }
      out.push(duration);
      return [...new Set(out.map((t) => Math.round(t * 1e6) / 1e6))].sort((a, b) => a - b);
    },
    from,
    to,
    duration,
  );
const bad = [];
let checked = 0;
let worstRoom = Infinity;
let worstHero = Infinity;
for (const t of times) {
  const info = await page.evaluate(
    (t, MARGIN, CORNER) => {
      window.frame(t);
      const root = document.querySelector(".mo");
      const r = root.getBoundingClientRect();
      const op = Number(root.style.getPropertyValue("--cap-o") || 0);
      const boxes = [...root.querySelectorAll('.mo-corner[data-c="hint"],.mo-corner[data-c="readout"]')]
        .filter((el) => el.textContent.trim())
        .map((el) => el.getBoundingClientRect());
      let zone = null;
      if (boxes.length && op > 0.01) {
        const x0 = Math.min(...boxes.map((b) => b.left)) - r.left - MARGIN;
        const y0 = Math.min(...boxes.map((b) => b.top)) - r.top - MARGIN;
        const x1 = Math.max(...boxes.map((b) => b.right)) - r.left + MARGIN;
        const y1 = Math.max(...boxes.map((b) => b.bottom)) - r.top + MARGIN;
        zone = [Math.max(0, x0), Math.max(0, y0), Math.min(r.width, x1), Math.min(r.height, y1)].map(Math.round);
      }
      const cop = Number(root.style.getPropertyValue("--corner-o") || 0);
      const corners = cop > 0.01
        ? [...root.querySelectorAll('.mo-corner[data-c="fig"],.mo-corner[data-c="title"]')]
            .filter((el) => el.textContent.trim())
            .map((el) => {
              const b = el.getBoundingClientRect();
              return { name: el.textContent.trim(), box: [Math.max(0, b.left - r.left - CORNER), Math.max(0, b.top - r.top - CORNER), Math.min(r.width, b.right - r.left + CORNER), Math.min(r.height, b.bottom - r.top + CORNER)].map(Math.round) };
            })
        : [];
      const visible = [];
      for (const el of root.querySelectorAll(".mo-corner")) {
        if (!el.textContent.trim()) continue;
        const o = Number(getComputedStyle(el).opacity);
        if (o <= 0.01) continue;
        const b = el.getBoundingClientRect();
        visible.push({ name: el.textContent.trim(), box: [b.left - r.left, b.top - r.top, b.right - r.left, b.bottom - r.top] });
      }
      const p = root.querySelector(".mo-plate").getBoundingClientRect();
      const plate = [p.left - r.left, p.top - r.top, p.right - r.left, p.bottom - r.top].map(Math.round);
      const wide = window.WIDE.some(([a, b]) => t >= a - 1e-6 && t <= b + 1e-6);
      const hero = window.HERO.some(([a, b]) => t >= a - 1e-6 && t <= b + 1e-6);
      return { zone, corners, cop, plate, wide, hero, visible, op, hint: root.querySelector('.mo-corner[data-c="hint"]').textContent };
    },
    t,
    MARGIN,
    CORNER,
  );
  const problems = [];
  if (size.ratio === "9:16")
    for (const v of info.visible) {
      const [x0, y0, x1, y1] = v.box;
      if (x0 < SAFE_916[0] || y0 < SAFE_916[1] || x1 > SAFE_916[2] || y1 > SAFE_916[3])
        problems.push(`"${v.name}" outside the Reels safe area (box ${v.box.map((n) => Math.round(n * 2)).join(",")} output px)`);
    }
  if (!info.zone && !info.wide && !info.hero && !info.corners.length) {
    if (problems.length) bad.push(`t=${t.toFixed(3)}  ${problems.join(" · ")}`);
    continue;
  }
  const b64 = await page.screenshot({ omitBackground: true, encoding: "base64", type: "png" });
  const res = await page.evaluate(
    async (b64, zone, corners, ALPHA) => {
      const img = new Image();
      img.src = "data:image/png;base64," + b64;
      await img.decode();
      const c = document.createElement("canvas");
      c.width = img.width;
      c.height = img.height;
      const g = c.getContext("2d", { willReadFrequently: true });
      g.drawImage(img, 0, 0);
      const d = g.getImageData(0, 0, c.width, c.height).data;
      let hits = 0;
      const cornerHits = corners.map(() => 0);
      let bx0 = Infinity, by0 = Infinity, bx1 = -Infinity, by1 = -Infinity;
      for (let y = 0; y < c.height; y++)
        for (let x = 0; x < c.width; x++) {
          if (d[(y * c.width + x) * 4 + 3] < ALPHA) continue;
          if (x < bx0) bx0 = x;
          if (y < by0) by0 = y;
          if (x > bx1) bx1 = x;
          if (y > by1) by1 = y;
          if (zone && x >= zone[0] && x < zone[2] && y >= zone[1] && y < zone[3]) hits++;
          for (let i = 0; i < corners.length; i++) {
            const z = corners[i].box;
            if (x >= z[0] && x < z[2] && y >= z[1] && y < z[3]) cornerHits[i]++;
          }
        }
      return { hits, cornerHits, bbox: [bx0, by0, bx1 + 1, by1 + 1] };
    },
    b64,
    info.zone,
    info.corners,
    ALPHA,
  );
  checked++;
  if (info.zone && res.hits) problems.push(`caption zone hit by ${res.hits} px (caption "${info.hint}", opacity ${info.op.toFixed(2)})`);
  info.corners.forEach((c, i) => {
    if (res.cornerHits[i]) problems.push(`corner label "${c.name}" zone hit by ${res.cornerHits[i]} px (opacity ${info.cop.toFixed(2)})`);
  });
  if (info.wide) {
    const [x0, y0, x1, y1] = res.bbox;
    const [p0, q0, p1, q1] = info.plate;
    const room = Math.min(x0 - p0, y0 - q0, p1 - x1, q1 - y1);
    worstRoom = Math.min(worstRoom, room);
    if (room < ROOM) problems.push(`wide shot: machine ${room < 0 ? "crosses" : "is"} ${Math.abs(room)} px ${room < 0 ? "past" : "from"} the frame (bbox ${res.bbox.join(",")} vs frame ${info.plate.join(",")})`);
  }
  if (info.hero) {
    const [x0, y0, x1, y1] = res.bbox;
    const [p0, q0, p1, q1] = info.plate;
    const floor = size.ratio === "9:16" ? Math.min(q1, SAFE_916[3]) : q1;
    const room = Math.min(x0 - p0, y0 - q0, p1 - x1, floor - y1);
    worstHero = Math.min(worstHero, room);
    if (room < HERO_ROOM) problems.push(`hero shot: machine only ${room} px (${room * 2} output px) inside the frame${size.ratio === "9:16" ? " / above y 1248" : ""} (bbox ${res.bbox.join(",")})`);
  }
  if (problems.length) bad.push(`t=${t.toFixed(3)}  ${problems.join(" · ")}`);
  if (args.includes("--bbox")) console.log(`  t=${t.toFixed(3)} bbox ${res.bbox.join(",")} (h ${res.bbox[3] - res.bbox[1]}, w ${res.bbox[2] - res.bbox[0]})`);
}
console.log(`${size.ratio}: ${times.length} samples (${HZ ? `${HZ} Hz` : "every blur sub-frame + mid-shutter"}), ${checked} rendered · caption margin ${MARGIN} px · corner-label margin ${CORNER} px · wide-shot room ≥ ${ROOM} px (tightest ${worstRoom}) · hero room ≥ ${HERO_ROOM} px = ${HERO_ROOM * 2} output px (tightest ${worstHero})${size.ratio === "9:16" ? " · labels and captions inside the Reels safe area" : ""} [CSS px; 1 = 2 output px]`);
console.log(bad.length ? `${bad.length} samples fail:\n${bad.join("\n")}` : "every sample clear: caption and corner-label zones empty, wide and hero shots inside the frame" + (size.ratio === "9:16" ? ", all text in the safe area" : ""));
await browser.close();
process.exit(bad.length || camBad.length ? 1 : 0);
