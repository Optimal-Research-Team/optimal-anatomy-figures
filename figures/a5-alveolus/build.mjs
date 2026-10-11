// A5 · The air sac and the red cell (anatomical series).
//
// One alveolus in a small grape-bunch of neighbours, seen from a little above, wrapped in its
// net of capillaries. One capillary across the front carries red cells in single file from a
// pulmonary arteriole (left) to a venule (right). Each cell's colour comes from the model:
// oxygen pressure rises toward the alveolar value within about a quarter of a second, so at rest
// the cells turn red in the first third of the trip; in hard exercise they pass faster and turn
// red later, but still before they leave. A monitor underneath plots the tracked cell's oxygen
// against its time in the capillary, with the exit marked.
//
//   node build.mjs | --light
import { mkdirSync, readFileSync, writeFileSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";
import { plate, page, embed } from "../../shared/page.mjs";
import * as M from "./model.mjs";

const HERE = dirname(fileURLToPath(import.meta.url));
const THEME = process.argv.includes("--light") ? "light" : "dark";
const SLUG = "alveolus";
const W = 600;
const H = 620;
const RAD = Math.PI / 180;
const E = 25 * RAD; // we look down on the bunch from 25° above
const C = [300, 232];
const R = 150;
const f1 = (v) => v.toFixed(1);

// ---------------------------------------------------------------- sphere geometry
/** A point on a sphere (centre c, radius r) at latitude L, longitude lam (°) → [x, y, depth]. */
function sp(c, r, L, lam) {
  const X = r * Math.cos(L * RAD) * Math.sin(lam * RAD);
  const Y = r * Math.sin(L * RAD);
  const Z = r * Math.cos(L * RAD) * Math.cos(lam * RAD);
  return [c[0] + X, c[1] - (Y * Math.cos(E) - Z * Math.sin(E)), Y * Math.sin(E) + Z * Math.cos(E)];
}
/** A small patch in the sphere's tangent plane at (L, lam): offsets (east, north) → screen. */
function patch(c, r, L, lam, pts) {
  const o = sp(c, r, L, lam);
  const e = [Math.cos(lam * RAD), 0, -Math.sin(lam * RAD)];
  const n = [-Math.sin(L * RAD) * Math.sin(lam * RAD), Math.cos(L * RAD), -Math.sin(L * RAD) * Math.cos(lam * RAD)];
  return pts.map(([a, b]) => {
    const v = [e[0] * a + n[0] * b, e[1] * a + n[1] * b, e[2] * a + n[2] * b];
    return [o[0] + v[0], o[1] - (v[1] * Math.cos(E) - v[2] * Math.sin(E))];
  });
}
function smooth(points, closed = true, k = 1) {
  const n = points.length;
  const at = (i) => points[closed ? (i + n) % n : Math.max(0, Math.min(n - 1, i))];
  let d = `M${f1(points[0][0])} ${f1(points[0][1])}`;
  for (let i = 0; i < (closed ? n : n - 1); i++) {
    const p0 = at(i - 1), p1 = at(i), p2 = at(i + 1), p3 = at(i + 2);
    d += `C${f1(p1[0] + ((p2[0] - p0[0]) / 6) * k)} ${f1(p1[1] + ((p2[1] - p0[1]) / 6) * k)} ${f1(p2[0] - ((p3[0] - p1[0]) / 6) * k)} ${f1(p2[1] - ((p3[1] - p1[1]) / 6) * k)} ${f1(p2[0])} ${f1(p2[1])}`;
  }
  return d + (closed ? "Z" : "");
}
/** Polyline runs of the front-facing samples, as one path. */
function runs(samples) {
  let d = "";
  let open = false;
  for (const p of samples) {
    if (p[2] > 2) {
      d += `${open ? "L" : "M"}${f1(p[0])} ${f1(p[1])}`;
      open = true;
    } else open = false;
  }
  return d;
}
/** A capillary net: latitude rings plus staggered meridian links between them. */
function net(c, r, lats, lons, skip = [], wig = 3) {
  let d = "";
  for (const L of lats) {
    if (skip.includes(L)) continue;
    const s = [];
    for (let lam = -180; lam <= 180; lam += 3) s.push(sp(c, r, L + wig * 0.45 * Math.sin((lam * 5 + L * 7) * RAD), lam));
    d += runs(s);
  }
  for (let i = 0; i < lats.length - 1; i++)
    lons.forEach((lam, j) => {
      if ((i + j) % 2) return;
      const s = [];
      for (let k = 0; k <= 12; k++) s.push(sp(c, r, lats[i] + ((lats[i + 1] - lats[i]) * k) / 12, lam + wig * Math.sin((k / 12) * 2 * Math.PI + i + j)));
      d += runs(s);
    });
  return d;
}
const rng = (() => {
  let s = 7;
  return () => ((s = (s * 16807) % 2147483647) - 1) / 2147483646;
})();

// ---------------------------------------------------------------- the main sac's lining
// pavement cells (type I) as faint outlines from a Fibonacci spread; a few type II cells with
// their surfactant granules; one alveolar macrophage
let pave = "";
let nuclei = "";
const NF = 230;
for (let i = 0; i < NF; i++) {
  const y = 1 - (2 * (i + 0.5)) / NF;
  const L = Math.asin(y) / RAD;
  const lam = ((i * 137.508) % 360) - 180;
  if (L > 74) continue;
  const p = sp(C, R, L, lam);
  if (p[2] < 0.22 * R) continue;
  const rr = 15.5;
  const blob = Array.from({ length: 6 }, (_, k) => {
    const a = (k / 6) * 2 * Math.PI + rng() * 0.5;
    const m = rr * (0.82 + rng() * 0.3);
    return [Math.cos(a) * m, Math.sin(a) * m];
  });
  pave += smooth(patch(C, R, L, lam, blob), true, 0.9);
  const nu = patch(C, R, L, lam, [[rng() * 4 - 2, rng() * 4 - 2]])[0];
  nuclei += `M${f1(nu[0] - 1.6)} ${f1(nu[1])}a1.6 1.1 0 1 0 3.2 0a1.6 1.1 0 1 0-3.2 0Z`;
}
let type2 = "";
let granules = "";
for (const [L, lam] of [[34, -46], [-48, 34], [6, 62]]) {
  const dome = Array.from({ length: 8 }, (_, k) => {
    const a = (k / 8) * 2 * Math.PI;
    return [Math.cos(a) * 12 * (0.9 + rng() * 0.2), Math.sin(a) * 10 * (0.9 + rng() * 0.2)];
  });
  type2 += smooth(patch(C, R, L, lam, dome), true, 0.9);
  for (let g = 0; g < 6; g++) {
    const a = rng() * 2 * Math.PI;
    const m = 4 + rng() * 5;
    const q = patch(C, R, L, lam, [[Math.cos(a) * m, Math.sin(a) * m * 0.8]])[0];
    granules += `M${f1(q[0] - 1.4)} ${f1(q[1])}a1.4 1.4 0 1 0 2.8 0a1.4 1.4 0 1 0-2.8 0Z`;
  }
}
const mac = smooth(
  patch(C, R, 40, 16, Array.from({ length: 11 }, (_, k) => {
    const a = (k / 11) * 2 * Math.PI;
    const m = 15 * (k % 3 === 0 ? 1.35 : 0.8 + rng() * 0.2);
    return [Math.cos(a) * m, Math.sin(a) * m];
  })),
  true,
  0.85,
);
const macNucleus = smooth(patch(C, R, 40, 16, [[-5, -2], [-1, -4.5], [4, -3], [5.5, 1], [2, 3.5], [-2, 1.5], [-5, 3]]), true, 0.9);

// ---------------------------------------------------------------- the nets
const LATS = [-70, -56, -43, -31, -20, -9, 3, 15, 27, 39, 51, 63, 72];
const LONS = [-84, -72, -60, -48, -36, -24, -12, 0, 12, 24, 36, 48, 60, 72, 84];
const mainNet = net(C, R, LATS, LONS, [-20]);
const nbNet = (n) => net(n.c, n.r, [-58, -38, -18, 2, 22, 42, 62], [-75, -55, -35, -15, 5, 25, 45, 65, 85], [], 4);
const NB = [
  { c: [150, 112], r: 78 },
  { c: [458, 104], r: 84 },
  { c: [86, 268], r: 60 },
  { c: [516, 272], r: 62 },
];
const nbSvg = NB.map(
  (n, i) =>
    `<clipPath id="a5-nbclip${i}"><circle cx="${n.c[0]}" cy="${n.c[1]}" r="${n.r}"/></clipPath>` +
    `<circle class="a5-nb" cx="${n.c[0]}" cy="${n.c[1]}" r="${n.r}" fill="url(#a5-nb)"/>` +
    `<g clip-path="url(#a5-nbclip${i})"><path class="a5-nb-net-edge" d="${nbNet(n)}"/><path class="a5-nb-net" d="${nbNet(n)}"/></g>` +
    `<circle class="a5-nb-rim" cx="${n.c[0]}" cy="${n.c[1]}" r="${n.r}"/>`,
).join("");

// ---------------------------------------------------------------- the traced capillary: arteriole → front of the sac → venule
const LAT = -20;
const LAM0 = -80; // the ring meets the sac's outline here, on both sides
const arc = [];
for (let lam = LAM0; lam <= -LAM0 + 1e-9; lam += 1) arc.push(sp(C, R, LAT, lam).slice(0, 2));
const segLen = (pts) => pts.slice(1).reduce((s, p, i) => s + Math.hypot(p[0] - pts[i][0], p[1] - pts[i][1]), 0);
const arcLen = segLen(arc);
const step = arcLen / (arc.length - 1);
const bez = (p0, p1, p2, p3, t) => [0, 1].map((c) => (1 - t) ** 3 * p0[c] + 3 * (1 - t) ** 2 * t * p1[c] + 3 * (1 - t) * t * t * p2[c] + t ** 3 * p3[c]);
/** Resample a cubic at the arc's mean spacing so cells keep one speed along the whole path. */
function resample(p0, p1, p2, p3) {
  const dense = Array.from({ length: 400 }, (_, i) => bez(p0, p1, p2, p3, i / 399));
  const L = segLen(dense);
  const n = Math.max(2, Math.round(L / step));
  const out = [dense[0]];
  let acc = 0;
  let want = L / n;
  for (let i = 1; i < dense.length; i++) {
    acc += Math.hypot(dense[i][0] - dense[i - 1][0], dense[i][1] - dense[i - 1][1]);
    while (acc >= want && out.length < n) {
      out.push(dense[i]);
      want += L / n;
    }
  }
  out.push(dense[dense.length - 1]);
  return out;
}
const A0 = arc[0];
const A1 = arc[arc.length - 1];
const tIn = [A0[0] - arc[1][0], A0[1] - arc[1][1]].map((v) => v / Math.hypot(A0[0] - arc[1][0], A0[1] - arc[1][1]));
const inPath = resample([-30, 196], [58, 200], [A0[0] + tIn[0] * 70, A0[1] + tIn[1] * 70], A0);
const B1 = arc[arc.length - 2];
const tOut = [A1[0] - B1[0], A1[1] - B1[1]].map((v) => v / Math.hypot(A1[0] - B1[0], A1[1] - B1[1]));
const outPath = resample(A1, [A1[0] + tOut[0] * 70, A1[1] + tOut[1] * 70], [542, 200], [630, 196]);
const PATH = [...inPath.slice(0, -1), ...arc, ...outPath.slice(1)].map((p) => [+p[0].toFixed(2), +p[1].toFixed(2)]);
const I0 = inPath.length - 1;
const I1 = I0 + arc.length - 1;

function tube(pts, w0, w1) {
  const L = [];
  const Rr = [];
  pts.forEach((p, i) => {
    const a = pts[Math.max(0, i - 1)];
    const b = pts[Math.min(pts.length - 1, i + 1)];
    let nx = -(b[1] - a[1]);
    let ny = b[0] - a[0];
    const l = Math.hypot(nx, ny) || 1;
    nx /= l;
    ny /= l;
    const w = (w0 + (w1 - w0) * (i / (pts.length - 1))) / 2;
    L.push([p[0] + nx * w, p[1] + ny * w]);
    Rr.push([p[0] - nx * w, p[1] - ny * w]);
  });
  return `M${[...L, ...Rr.reverse()].map((p) => `${f1(p[0])} ${f1(p[1])}`).join("L")}Z`;
}
const arcD = `M${arc.map((p) => `${f1(p[0])} ${f1(p[1])}`).join("L")}`;

// ---------------------------------------------------------------- the alveolar duct and the sac's mouth
const top = sp(C, R, 90, 0);
const duct = [];
for (let i = 0; i <= 24; i++) duct.push(bez([322, -30], [314, 20], [300, 50], [top[0], top[1] + 4], i / 24));
const ductRings = [0.2, 0.38, 0.56, 0.74].map((t) => {
  const p = bez([322, -30], [314, 20], [300, 50], [top[0], top[1] + 4], t);
  return `M${f1(p[0] - 29)} ${f1(p[1] - 3)}Q${f1(p[0])} ${f1(p[1] + 8)} ${f1(p[0] + 29)} ${f1(p[1] - 3)}`;
}).join("");

// ---------------------------------------------------------------- the monitor
const PLOT = { x0: 92, x1: 556, tMax: 0.8, y0: 564, y1: 466, box: [20, 412, 560, 196] };
const xOf = (t) => PLOT.x0 + (t / PLOT.tMax) * (PLOT.x1 - PLOT.x0);
const yOf = (s) => PLOT.y0 - s * (PLOT.y0 - PLOT.y1);
const ticks = [0, 0.25, 0.5, 0.75]
  .map((t, i, a) => `<path class="a5-axis" d="M${f1(xOf(t))} ${PLOT.y0}v6"/><text class="a5-tick" x="${f1(xOf(t))}" y="${PLOT.y0 + 28}" text-anchor="${i === 0 ? "start" : "middle"}">${t === 0 ? "0" : t}${i === a.length - 1 ? " s" : ""}</text>`)
  .join("");
const plotSvg = `<g class="a5-plot">
<rect class="a5-plot-bg" x="${PLOT.box[0]}" y="${PLOT.box[1]}" width="${PLOT.box[2]}" height="${PLOT.box[3]}" rx="12"/>
<text class="a5-plot-title" x="${PLOT.box[0] + 22}" y="${PLOT.box[1] + 32}">Oxygen in the traced cell</text>
<rect class="a5-spare" data-part="spare" x="0" y="${PLOT.y1}" width="0" height="${PLOT.y0 - PLOT.y1}"/>
<text class="a5-spare-txt" data-part="sparetxt" x="0" y="${PLOT.y0 - 12}" text-anchor="middle">to spare</text>
<path class="a5-grid" d="M${PLOT.x0} ${f1(yOf(0.5))}H${PLOT.x1}M${PLOT.x0} ${f1(yOf(1))}H${PLOT.x1}"/>
<path class="a5-axis" d="M${PLOT.x0} ${PLOT.y0}H${PLOT.x1}"/>
<text class="a5-tick" x="${PLOT.x0 - 10}" y="${f1(yOf(1) + 6)}" text-anchor="end">100%</text>
<text class="a5-tick" x="${PLOT.x0 - 10}" y="${f1(yOf(0.5) + 6)}" text-anchor="end">50%</text>
${ticks}
<path class="a5-curve-ghost" data-part="ghost"/>
<path class="a5-curve" data-part="curve"/>
<g data-part="exit"><path class="a5-exit" d="M0 ${PLOT.y0}V${PLOT.y1 - 6}"/><ellipse class="a5-exit-cell" cx="0" cy="${PLOT.y1 - 12}" rx="9" ry="5.6"/></g>
<circle class="a5-start" data-part="start" r="4.5"/>
<circle class="a5-dot" data-part="dot" r="6.5"/>
</g>`;

// ---------------------------------------------------------------- the picture
const svg = `<svg class="iso-svg a5-svg" viewBox="0 0 ${W} ${H}" role="img" aria-label="An air sac in the lung, in a bunch of neighbouring sacs, wrapped in a net of capillaries. One capillary across the front carries red cells in single file from a small artery on the left to a small vein on the right. Oxygen from the air inside the sac crosses into each cell, which turns from blue to red within the first part of its trip; carbon dioxide leaves the other way. A monitor underneath plots the oxygen in one traced cell against its time in the capillary, and marks when it leaves.">
<defs>
  <radialGradient id="a5-sac" cx="42%" cy="36%" r="64%"><stop offset="0" class="a5-s0"/><stop offset="0.74" class="a5-s1"/><stop offset="0.93" class="a5-s2"/><stop offset="1" class="a5-s3"/></radialGradient>
  <radialGradient id="a5-nb" cx="42%" cy="36%" r="64%"><stop offset="0" class="a5-n0"/><stop offset="0.8" class="a5-n1"/><stop offset="1" class="a5-n2"/></radialGradient>
  <radialGradient id="a5-spec" cx="50%" cy="50%" r="50%"><stop offset="0" class="a5-spec0"/><stop offset="1" class="a5-spec1"/></radialGradient>
  <linearGradient id="a5-net" gradientUnits="userSpaceOnUse" x1="${f1(A0[0])}" y1="0" x2="${f1(A1[0])}" y2="0"><stop offset="0" class="a5-ven-stop"/><stop data-part="netA" offset="0.3" class="a5-ven-stop"/><stop data-part="netB" offset="0.42" class="a5-art-stop"/><stop offset="1" class="a5-art-stop"/></linearGradient>
  <linearGradient id="a5-nbnet" x1="0" y1="0" x2="1" y2="0"><stop offset="0" class="a5-ven-stop"/><stop offset="0.32" class="a5-art-stop"/><stop offset="1" class="a5-art-stop"/></linearGradient>
  <clipPath id="a5-clip"><circle cx="${C[0]}" cy="${C[1]}" r="${R}"/></clipPath>
  <clipPath id="a5-air"><circle cx="${C[0]}" cy="${C[1]}" r="${R - 6}"/></clipPath>
</defs>
<g data-part="sac">
${nbSvg}
<path class="a5-duct" d="${tube(duct, 60, 58)}"/>
<path class="a5-duct-ring" d="${ductRings}"/>
<path data-part="ductair" class="a5-duct-air"/>
<path class="a5-ven-tube" d="${tube(inPath, 26, 16)}"/>
<path class="a5-art-tube" d="${tube(outPath, 16, 26)}"/>
<g data-part="cellsBack"></g>
<circle class="a5-sac" cx="${C[0]}" cy="${C[1]}" r="${R}" fill="url(#a5-sac)"/>
<path data-part="air" class="a5-o2" clip-path="url(#a5-air)"/>
<g clip-path="url(#a5-clip)">
  <path class="a5-pave" d="${pave}"/><path class="a5-nuc" d="${nuclei}"/>
  <path class="a5-t2" d="${type2}"/><path class="a5-gran" d="${granules}"/>
  <path class="a5-mac" d="${mac}"/><path class="a5-mac-nuc" d="${macNucleus}"/>
  <ellipse class="a5-mouth" cx="${f1(top[0])}" cy="${f1(top[1] + 3)}" rx="29" ry="${f1(29 * Math.sin(E))}"/>
  <path class="a5-net-edge" d="${mainNet}"/><path class="a5-net" d="${mainNet}"/>
</g>
<path class="a5-cap-edge" d="${arcD}"/><path class="a5-cap" d="${arcD}"/>
<path data-part="fly" class="a5-o2 a5-o2-fly"/>
<g data-part="cellsFront"></g>
<path data-part="co20" class="a5-co2"/><path data-part="co21" class="a5-co2 a5-co2-b"/><path data-part="co22" class="a5-co2 a5-co2-c"/>
<ellipse cx="${C[0] - 58}" cy="${C[1] - 70}" rx="62" ry="36" transform="rotate(-32 ${C[0] - 58} ${C[1] - 70})" fill="url(#a5-spec)" class="a5-specular"/>
<circle class="a5-rim" cx="${C[0]}" cy="${C[1]}" r="${R}"/>
<circle class="a5-track" data-part="track" r="12" cx="-40" cy="-40"/>
</g>
${plotSvg}
</svg>`;

const LINES = [
  "Resting: each red cell spends about three-quarters of a second beside the air sacs, and is full within the first third of it.",
  "Walking: blood flows twice as fast, but more capillaries open, so each cell still has time to spare.",
  "Running: about a third of a second in the capillary, still longer than loading takes.",
  "All out: cells arrive emptier and leave sooner. In healthy lungs they still fill before they go.",
];
const DATA = { C, R, path: PATH, i0: I0, i1: I1, step, plot: { ...PLOT }, lines: LINES, a0x: A0[0], a1x: A1[0], top, lat: LAT, lam0: LAM0, duct: duct.map((p) => [+p[0].toFixed(1), +p[1].toFixed(1)]) };
const strip = (src) => src.replace(/^import .*$/gm, "").replace(/^export /gm, "");
const SCRIPT = `${strip(readFileSync(join(HERE, "model.mjs"), "utf8"))}\n${readFileSync(join(HERE, "live.js"), "utf8").replace("__DATA__", JSON.stringify(DATA))}`;
const CSS = readFileSync(join(HERE, "figure.css"), "utf8");
const rest = M.LUNG.states[0];
const sIn = (s) => Math.round(100 * M.satOf(s.pv));
const sOut = (s) => Math.round(100 * M.satOf(M.po2At(M.transitOf(s.co), s.pv)));
const top4 = M.LUNG.states[3];
const CAPTION = [
  `Every breath refills hundreds of millions of tiny air sacs, each wrapped in a net of capillaries so narrow that red cells pass in single file. Oxygen crosses a wall far thinner than a sheet of paper into each passing cell, and carbon dioxide crosses the other way.`,
  `At rest a cell spends about ${M.transitOf(rest.co).toFixed(2)} s beside the air and is fully loaded within the first quarter-second, so most of its trip is time to spare. All out, the heart pumps nearly five times as much blood; more capillaries open, but each cell still passes in about ${M.transitOf(top4.co).toFixed(2)} s, and it arrives emptier (${sIn(top4)}% instead of ${sIn(rest)}%). In healthy lungs it still leaves about ${sOut(top4)}% full. The lungs are rarely what limits VO₂max; the heart's output usually is.`,
  `<small>Typical healthy adult at sea level, drawn far larger than life: an air sac is about a quarter of a millimetre across. One capillary stands for the several a cell passes. Lung disease, altitude and some very fit athletes at their peak can leave blood short of full; not shown. Blue and red follow the textbook convention.</small>`,
]
  .map((p) => `<span class="a5-par">${p}</span>`)
  .join("");
const body = plate({
  fig: "A5",
  title: "The air sac and the red cell",
  hint: "Pick an effort · watch the time to spare shrink",
  stats: [
    { key: "time", label: "Time in capillary", value: `${M.transitOf(rest.co).toFixed(2)} s` },
    { key: "in", label: "Arrives", value: `${sIn(rest)}% full` },
    { key: "out", label: "Leaves", value: `${sOut(rest)}% full` },
  ],
  controls: [{ name: "effort", label: "Effort", options: M.LUNG.states.map((s, i) => ({ value: s.key, label: s.label, pressed: i === 0 })) }],
  keys: [
    { mark: "heat", label: "Oxygen-rich blood" },
    { mark: "lit", label: "Oxygen in the air" },
    { mark: "raised", label: "Air sac wall" },
  ],
  caption: CAPTION,
  body: `<div class="iso-stage a5-stage">${svg}</div><div class="a5-row"><p class="a5-scene" data-scene>${LINES[0]}</p><button type="button" class="a5-slow" data-slow aria-pressed="true">8× slower</button></div><span class="a5-sr" role="status" aria-live="polite" data-status></span>`,
});
const out = THEME === "light" ? `${SLUG}-light.html` : `${SLUG}.html`;
writeFileSync(join(HERE, out), page({ title: "The air sac and the red cell", theme: THEME, body, css: CSS, script: SCRIPT }));
if (THEME === "light") {
  mkdirSync(join(HERE, "embed"), { recursive: true });
  writeFileSync(join(HERE, "embed", `optimal-fig-${SLUG}.js`), embed({ tag: `optimal-fig-${SLUG}`, body, script: SCRIPT, css: CSS }));
}
console.log("wrote", out, `(${PATH.length} path points, arc ${I0}–${I1}, ${arcLen.toFixed(0)} px)`);
