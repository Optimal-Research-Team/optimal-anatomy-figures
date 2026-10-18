// A6 · The red cell's 120 days (anatomical series, inset for Fig 3).
//
// In isometric 3-D, everything cut in half and seen from the cut: the bone cut lengthwise to show its
// marrow, the spleen cut open, the vessel arc and the transferrin return as half-tubes; behind the
// cut each keeps its round back half.
// Bone marrow (left) makes red cells on erythroblastic islands; they leave through a sinusoid
// and ride an arc that is their life: position = age, 0 to 120 days. At the end they reach the
// spleen, where a macrophage eats them and stores the iron as ferritin or hands it to
// transferrin, which carries it back under the arc to the marrow. After an IV iron dose the
// macrophage's stores fill within days (ferritin), but the arc only fills with new, fuller cells
// at the pace cells are made (hemoglobin): two clocks. Driven by Fig 3's model.
//
//   node build.mjs | --light
import { mkdirSync, readFileSync, writeFileSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";
import { plate, page, embed } from "../../shared/page.mjs";
import { figkit, k } from "../../shared/figkit.mjs";
import * as M from "./model.mjs";
import { simulate, PARAMS } from "../03-iv-iron/model.mjs";

const HERE = dirname(fileURLToPath(import.meta.url));
const THEME = process.argv.includes("--light") ? "light" : "dark";
const SLUG = "red-cell-cycle";
const f1 = (v) => v.toFixed(1);
const rng = (() => {
  let s = 23;
  return () => ((s = (s * 16807) % 2147483647) - 1) / 2147483646;
})();
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
function curve(points, samples = 14) {
  const out = [];
  const n = points.length;
  for (let i = 0; i < n - 1; i++) {
    const p0 = points[Math.max(0, i - 1)], p1 = points[i], p2 = points[i + 1], p3 = points[Math.min(n - 1, i + 2)];
    for (let s = 0; s < samples; s++) {
      const t = s / samples, t2 = t * t, t3 = t2 * t;
      out.push([0, 1].map((c) => 0.5 * (2 * p1[c] + (-p0[c] + p2[c]) * t + (2 * p0[c] - 5 * p1[c] + 4 * p2[c] - p3[c]) * t2 + (-p0[c] + 3 * p1[c] - 3 * p2[c] + p3[c]) * t3)));
    }
  }
  out.push(points[n - 1]);
  return out;
}
function tube(c, w0, w1 = w0) {
  const L = [];
  const R = [];
  c.forEach((p, i) => {
    const a = c[Math.max(0, i - 1)];
    const b = c[Math.min(c.length - 1, i + 1)];
    let nx = -(b[1] - a[1]);
    let ny = b[0] - a[0];
    const l = Math.hypot(nx, ny) || 1;
    nx /= l;
    ny /= l;
    const w = (w0 + (w1 - w0) * (i / (c.length - 1))) / 2;
    L.push([p[0] + nx * w, p[1] + ny * w]);
    R.push([p[0] - nx * w, p[1] - ny * w]);
  });
  return `M${[...L, ...R.reverse()].map((p) => `${f1(p[0])} ${f1(p[1])}`).join("L")}Z`;
}
const dot = (x, y, r) => `M${f1(x - r)} ${f1(y)}a${r} ${r} 0 1 0 ${2 * r} 0a${r} ${r} 0 1 0 ${-2 * r} 0`;
const inPoly = (P, x, y) => {
  let c = false;
  for (let i = 0, j = P.length - 1; i < P.length; j = i++) {
    const [xi, yi] = P[i];
    const [xj, yj] = P[j];
    if (yi > y !== yj > y && x < ((xj - xi) * (y - yi)) / (yj - yi) + xi) c = !c;
  }
  return c;
};
const round = (a, k = 3) => Array.from(a, (v) => +v.toFixed(k));

// ---------------------------------------------------------------- the series from Fig 3's model
const sim = simulate("iv");
const mgPerGL = PARAMS.bw * PARAMS.bvLPerKg * PARAMS.feMgPerGHb; // mg of iron per g/L of Hb
const STEP = 0.25;
const N = Math.round(M.LOOP.after / STEP) + 1;
const hbAt = (d) => sim.hb[Math.max(0, Math.min(sim.hb.length - 1, Math.round(d * 24)))];
const hb = [];
const fer = [];
const iv = [];
const rise = [];
for (let i = 0; i < N; i++) {
  const d = i * STEP;
  const h = Math.min(sim.hb.length - 1, Math.round(d * 24));
  hb.push(sim.hb[h]);
  fer.push(sim.ferritin[h]);
  iv.push(sim.plasmaIv[h]);
  rise.push(Math.max(0, ((hbAt(d + 0.5) - hbAt(d - 0.5)) * mgPerGL) + PARAMS.netLossMgPerD));
}
const cum = [0];
for (let i = 1; i < N; i++) cum.push(cum[i - 1] + ((rise[i] + rise[i - 1]) / 2) * STEP);
const S = { step: STEP, c0: (PARAMS.hb0 * mgPerGL) / M.LOOP.life, cNorm: (PARAMS.hbSet * mgPerGL) / M.LOOP.life, rise: round(rise), cum: round(cum), hb: round(hb, 2), fer: round(fer, 1), iv: round(iv, 1), hb0: PARAMS.hb0, fer0: PARAMS.ferritin0 };

// ---------------------------------------------------------------- the bone and its marrow (left)
const BONE = [[58, 148], [96, 118], [146, 112], [186, 132], [204, 176], [198, 236], [182, 290], [176, 350], [184, 404], [162, 434], [110, 440], [70, 426], [58, 380], [64, 320], [50, 262], [42, 200]];
const ISLANDS = [{ c: [120, 236], r: 30 }, { c: [112, 352], r: 24 }];
let trab = "";
const tp = [];
while (tp.length < 56) {
  const x = 40 + rng() * 170;
  const y = 110 + rng() * 334;
  if (inPoly(BONE, x, y) && ISLANDS.every((I) => Math.hypot(x - I.c[0], y - I.c[1]) > I.r + 22)) tp.push([x, y]);
}
const seen = new Set();
let nodes = "";
for (const [x, y] of tp) nodes += dot(x, y, 2.6 + rng() * 1.6);
tp.forEach((p, i) => {
  const near = tp.map((q, j) => [Math.hypot(q[0] - p[0], q[1] - p[1]), j]).filter(([, j]) => j !== i).sort((a, b) => a[0] - b[0]).slice(0, 3);
  for (const [d, j] of near) {
    const key = [i, j].sort().join("-");
    if (seen.has(key) || d > 52) continue;
    seen.add(key);
    const q = tp[j];
    const m = [(p[0] + q[0]) / 2 + (rng() - 0.5) * 12, (p[1] + q[1]) / 2 + (rng() - 0.5) * 12];
    trab += `M${f1(p[0])} ${f1(p[1])}Q${f1(m[0])} ${f1(m[1])} ${f1(q[0])} ${f1(q[1])}`;
  }
});
let fat = "";
for (let i = 0, n = 0; n < 9 && i < 400; i++) {
  const x = 50 + rng() * 150;
  const y = 120 + rng() * 310;
  const r = 6 + rng() * 5;
  if (inPoly(BONE, x, y) && ISLANDS.every((I) => Math.hypot(x - I.c[0], y - I.c[1]) > I.r + 18)) {
    fat += dot(x, y, r);
    n++;
  }
}
/** An erythroblastic island: a central macrophage ringed by erythroblasts at increasing maturity. */
function island({ c: [cx, cy], r }, n) {
  let svg = `<path class="a6-nurse" d="${smooth(Array.from({ length: 8 }, (_, k) => {
    const a = (k / 8) * 2 * Math.PI;
    const m = r * 0.52 * (0.85 + rng() * 0.3);
    return [cx + Math.cos(a) * m, cy + Math.sin(a) * m];
  }), true, 1)}"/><path class="a6-nurse-nuc" d="${dot(cx - 2, cy + 1, r * 0.2)}"/>`;
  for (let k = 0; k < n; k++) {
    const a = (k / n) * 2 * Math.PI + 0.3;
    const x = cx + Math.cos(a) * r * 0.86;
    const y = cy + Math.sin(a) * r * 0.86;
    const mat = k / (n - 1); // early (big nucleus, blue) → late (small nucleus, red)
    svg += `<g class="a6-eb" data-mat="${mat.toFixed(2)}"><circle class="a6-eb-cyto" cx="${f1(x)}" cy="${f1(y)}" r="${f1(7.2 - mat * 1.6)}" style="--m:${mat.toFixed(2)}"/><circle class="a6-eb-nuc" cx="${f1(x + 0.6)}" cy="${f1(y - 0.4)}" r="${f1(4.6 - mat * 2.8)}"/></g>`;
  }
  return svg;
}
const sinus = curve([ISLANDS[0].c, [150, 206], [176, 172], [190, 156]], 10);

// ---------------------------------------------------------------- the spleen (right)
const SPLEEN = [[446, 168], [494, 146], [550, 156], [580, 204], [586, 286], [574, 364], [536, 418], [480, 430], [436, 404], [424, 356], [442, 304], [424, 254], [428, 206]];
const MAC = { c: [494, 286], r: 46 };
let pulp = "";
for (let i = 0; i < 46; i++) {
  const x = 420 + rng() * 170;
  const y = 140 + rng() * 300;
  if (!inPoly(SPLEEN, x, y) || Math.hypot(x - MAC.c[0], y - MAC.c[1]) < MAC.r + 10) continue;
  const a = rng() * Math.PI;
  const L = 6 + rng() * 10;
  pulp += `M${f1(x - Math.cos(a) * L)} ${f1(y - Math.sin(a) * L)}Q${f1(x + 4)} ${f1(y - 3)} ${f1(x + Math.cos(a) * L)} ${f1(y + Math.sin(a) * L)}`;
}
const WHITE = [[540, 210, 18], [548, 372, 16], [460, 382, 13]];
const whiteSvg = WHITE.map(([x, y, r]) => `<circle class="a6-white" cx="${x}" cy="${y}" r="${r}"/><circle class="a6-art" cx="${x + 3}" cy="${y - 2}" r="3"/>`).join("");
const macBody = smooth(Array.from({ length: 12 }, (_, k) => {
  const a = (k / 12) * 2 * Math.PI;
  const m = MAC.r * (k % 4 === 1 ? 1.12 : 0.92 + rng() * 0.1);
  return [MAC.c[0] + Math.cos(a) * m, MAC.c[1] + Math.sin(a) * m];
}), true, 1);
const macNuc = smooth([[MAC.c[0] + 6, MAC.c[1] + 14], [MAC.c[0] + 20, MAC.c[1] + 8], [MAC.c[0] + 26, MAC.c[1] + 20], [MAC.c[0] + 18, MAC.c[1] + 32], [MAC.c[0] + 4, MAC.c[1] + 30]], true, 1);
// ferritin granule slots inside the macrophage (filled in order by the page)
const GRAN = [];
for (let i = 0; GRAN.length < 46 && i < 4000; i++) {
  const a = rng() * 2 * Math.PI;
  const m = Math.sqrt(rng()) * MAC.r * 0.82;
  const x = MAC.c[0] + Math.cos(a) * m;
  const y = MAC.c[1] + Math.sin(a) * m;
  if (Math.hypot(x - (MAC.c[0] + 16), y - (MAC.c[1] + 20)) < 15 || Math.hypot(x - (MAC.c[0] - 14), y - (MAC.c[1] - 12)) < 14) continue;
  if (GRAN.every((g) => Math.hypot(g[0] - x, g[1] - y) > 6.4)) GRAN.push([+x.toFixed(1), +y.toFixed(1)]);
}
GRAN.sort((p, q) => Math.hypot(p[0] - MAC.c[0], p[1] - MAC.c[1]) - Math.hypot(q[0] - MAC.c[0], q[1] - MAC.c[1]));

// ---------------------------------------------------------------- the 120-day arc and the transferrin return
const ARC = curve([[190, 156], [212, 104], [258, 66], [318, 50], [380, 60], [428, 92], [456, 140], [470, 192]], 16).map((p) => [+p[0].toFixed(1), +p[1].toFixed(1)]);
const RET = curve([[480, 318], [452, 372], [430, 404], [384, 440], [300, 456], [220, 444], [180, 410], [140, 378], [ISLANDS[1].c[0] + 10, ISLANDS[1].c[1] + 6]], 10).map((p) => [+p[0].toFixed(1), +p[1].toFixed(1)]);
const arcLen = ARC.slice(1).reduce((s, p, i) => s + Math.hypot(p[0] - ARC[i][0], p[1] - ARC[i][1]), 0);
// age ticks along the outside of the arc
const acc = [0];
for (let i = 1; i < ARC.length; i++) acc.push(acc[i - 1] + Math.hypot(ARC[i][0] - ARC[i - 1][0], ARC[i][1] - ARC[i - 1][1]));
const arcAt = (u) => {
  const s = u * arcLen;
  let i = 1;
  while (i < acc.length - 1 && acc[i] < s) i++;
  const t = (s - acc[i - 1]) / (acc[i] - acc[i - 1]);
  const a = ARC[i - 1];
  const b = ARC[i];
  const l = Math.hypot(b[0] - a[0], b[1] - a[1]);
  return { p: [a[0] + (b[0] - a[0]) * t, a[1] + (b[1] - a[1]) * t], n: [(b[1] - a[1]) / l, -(b[0] - a[0]) / l] };
};
const ticks = [30, 60, 90, 120]
  .map((d) => {
    const { p, n } = arcAt(d / 120);
    const o = -19; // inside the loop
    const tx = p[0] + n[0] * (o - 20) - (d === 120 ? 16 : 0);
    const ty = p[1] + n[1] * (o - 20) + 6;
    return `<path class="a6-tick" d="M${f1(p[0] + n[0] * o)} ${f1(p[1] + n[1] * o)}L${f1(p[0] + n[0] * (o - 8))} ${f1(p[1] + n[1] * (o - 8))}"/><text class="a6-tick-txt" x="${f1(tx)}" y="${f1(ty)}" text-anchor="${d === 120 ? "end" : "middle"}">${d === 120 ? "120 days" : d}</text>`;
  })
  .join("");

// ---------------------------------------------------------------- the monitor: ferritin and hemoglobin over 8 weeks
// ---------------------------------------------------------------- the camera: the cut face in the A-series view
// World: x = section x, y = toward the viewer (the cut is the plane y = DEP), z = up (−section y).
const DEP = 160;
const RAD = Math.PI / 180;
const S3 = (sx, y, sy) => [sx, y, -sy];
const reachOf = (P) => {
  // an outline plus its round back half rolled 30° and 60°, so the camera fits what will show
  const cx = P.reduce((a, p) => a + p[0] / P.length, 0);
  const cy = P.reduce((a, p) => a + p[1] / P.length, 0);
  const out = [];
  P.forEach((p, i) => {
    const a = P[(i - 1 + P.length) % P.length];
    const b = P[(i + 1) % P.length];
    const l = Math.hypot(b[0] - a[0], b[1] - a[1]) || 1;
    const n = [(b[1] - a[1]) / l, -(b[0] - a[0]) / l];
    const r = 0.9 * Math.hypot(p[0] - cx, p[1] - cy);
    out.push(S3(p[0], DEP, p[1]));
    for (const ph of [30, 60]) out.push(S3(p[0] - n[0] * (1 - Math.cos(ph * RAD)) * r, DEP - Math.sin(ph * RAD) * r * 0.95, p[1] - n[1] * (1 - Math.cos(ph * RAD)) * r));
  });
  return out;
};
const BOUNDS3 = [...reachOf(BONE), ...reachOf(SPLEEN), ...[...ARC, ...RET].flatMap(([x, y]) => [S3(x - 18, DEP, y - 18), S3(x + 18, DEP, y + 18)]), S3(216, DEP, 8)];
const PB = k.fitProjection(BOUNDS3, 600, 470, { pad: 10, azimuth: 62, elevation: 24 });
const DRAW_BOTTOM = Math.max(...BOUNDS3.map((p) => k.iso(p, PB)[1]));
const FB = figkit(PB);
const FRONT_M = FB.planeMatrix(S3(0, DEP, 0), [1, 0, 0], [0, 0, -1]);
const o2 = k.iso(S3(0, DEP, 0), PB);
const ex2 = k.iso(S3(1, DEP, 0), PB).map((v, i) => v - o2[i]);
const ey2 = k.iso(S3(0, DEP, 1), PB).map((v, i) => v - o2[i]);
const b1 = k.iso(S3(0, DEP - 1, 0), PB).map((v, i) => v - o2[i]);
const det = ex2[0] * ey2[1] - ey2[0] * ex2[1];
const WD1 = [(b1[0] * ey2[1] - ey2[0] * b1[1]) / det, (ex2[0] * b1[1] - b1[0] * ex2[1]) / det].map((v) => +v.toFixed(4));
const MT = Math.ceil(DRAW_BOTTOM + 12); // the monitor's top
const MON = { x0: 64, x1: 552, d0: -M.LOOP.before, d1: M.LOOP.after, fer: { y0: MT + 70, y1: MT + 26, max: 500 }, hb: { y0: MT + 134, y1: MT + 90, lo: 100, hi: 135 }, box: [24, MT, 552, 172] };
const VH = MT + 172 + 6;
const xOfDay = (d) => MON.x0 + ((d - MON.d0) / (MON.d1 - MON.d0)) * (MON.x1 - MON.x0);
const weekTicks = [0, 14, 28, 42, 56].map((d, i) => `<path class="a6-axis" d="M${f1(xOfDay(d))} ${MON.hb.y0}v5"/><text class="a6-mtick" x="${f1(xOfDay(d))}" y="${MON.hb.y0 + 26}" text-anchor="middle">${i === 0 ? "dose" : `${i * 2} wk`}</text>`).join("");
const monitor = `<g class="a6-mon">
<rect class="a6-mon-bg" x="${MON.box[0]}" y="${MON.box[1]}" width="${MON.box[2]}" height="${MON.box[3]}" rx="12"/>
<text class="a6-mlabel a6-mlabel-fer" x="${MON.x0}" y="${MON.fer.y1 - 6}">Ferritin (stores)</text>
<text class="a6-mlabel a6-mlabel-hb" x="${MON.x0}" y="${MON.hb.y1 - 6}">Hemoglobin</text>
<path class="a6-axis" d="M${MON.x0} ${MON.fer.y0}H${MON.x1}M${MON.x0} ${MON.hb.y0}H${MON.x1}"/>
${weekTicks}
<path class="a6-trace-ghost a6-fer" data-part="ferGhost"/><path class="a6-trace a6-fer" data-part="ferLine"/>
<path class="a6-trace-ghost a6-hbl" data-part="hbGhost"/><path class="a6-trace a6-hbl" data-part="hbLine"/>
<path class="a6-cursor" data-part="cursor" d="M0 ${MON.fer.y1 - 2}V${MON.hb.y0}"/>
<circle class="a6-cdot a6-cdot-fer" data-part="ferDot" r="5"/><circle class="a6-cdot a6-cdot-hb" data-part="hbDot" r="5"/>
</g>`;

// ---------------------------------------------------------------- the picture
const svg = `<svg class="iso-svg a6-svg" viewBox="0 0 600 ${VH}" role="img" aria-label="The red cell's life as a loop, drawn in 3-D with the bone and the spleen cut open. On the left, bone marrow makes red cells on small islands around a nurse cell. New cells leave and ride an arc across the top that stands for their 120-day life, older cells further along. On the right, in the spleen, a large macrophage eats the oldest cells and stores their iron as ferritin or hands it to transferrin, which carries it back under the arc to the marrow. A monitor underneath plots ferritin and hemoglobin over eight weeks.">
<defs>
  <radialGradient id="a6-marrow" cx="45%" cy="45%" r="70%"><stop offset="0" class="a6-mr0"/><stop offset="1" class="a6-mr1"/></radialGradient>
  <radialGradient id="a6-pulp" cx="55%" cy="45%" r="70%"><stop offset="0" class="a6-sp0"/><stop offset="1" class="a6-sp1"/></radialGradient>
  <radialGradient id="a6-macg" cx="40%" cy="38%" r="70%"><stop offset="0" class="a6-mc0"/><stop offset="1" class="a6-mc1"/></radialGradient>
  <clipPath id="a6-boneclip"><path d="${smooth(BONE, true, 1)}"/></clipPath>
  <clipPath id="a6-spleenclip"><path d="${smooth(SPLEEN, true, 1)}"/></clipPath>
</defs>
<g transform="${FRONT_M}"><g class="a6-far" data-part="far"></g></g>
<g class="a6-front" transform="${FRONT_M}">
<path class="a6-ret" d="${tube(RET, 14, 12)}"/>
<path class="a6-bone" d="${smooth(BONE, true, 1)}" fill="url(#a6-marrow)"/>
<g clip-path="url(#a6-boneclip)">
  <path class="a6-fat" d="${fat}"/>
  <path class="a6-trab" d="${trab}"/><path class="a6-trab-node" d="${nodes}"/>
  <path class="a6-sinus" d="${tube(sinus, 15, 18)}"/>
  ${island(ISLANDS[0], 9)}${island(ISLANDS[1], 7)}
</g>
<path class="a6-cortex" d="${smooth(BONE, true, 1)}"/>
<path class="a6-spleen" d="${smooth(SPLEEN, true, 1)}" fill="url(#a6-pulp)"/>
<g clip-path="url(#a6-spleenclip)"><path class="a6-cords" d="${pulp}"/>${whiteSvg}</g>
<path class="a6-capsule" d="${smooth(SPLEEN, true, 1)}"/>
<path class="a6-arc-edge" d="${tube(ARC, 34, 30)}"/>
<g class="a6-iv" data-part="iv"><path class="a6-iv-line" d="M224 18L246 58"/><path class="a6-iv-hub" d="M216 16l16 -6l10 20l-16 6Z"/></g>
${ticks}
<path class="a6-mac" d="${macBody}" fill="url(#a6-macg)"/>
<circle class="a6-phago" cx="${MAC.c[0] - 14}" cy="${MAC.c[1] - 12}" r="13"/>
<path class="a6-mac-nuc" d="${macNuc}"/>
<path class="a6-gran" data-part="gran"/>
<path class="a6-tf" data-part="tf"/>
<path class="a6-ivp" data-part="ivp"/>
<g data-part="cells"><path class="a6-c a6-c-pale" data-part="cPale"/><path class="a6-c a6-c-full" data-part="cFull"/><path class="a6-c a6-c-young" data-part="cYoung"/><path class="a6-c a6-c-old" data-part="cOld"/><path class="a6-pallor a6-pallor-pale" data-part="pPale"/><path class="a6-pallor a6-pallor-full" data-part="pFull"/><path class="a6-pallor a6-pallor-old" data-part="pOld"/><path class="a6-retic" data-part="retic"/></g>
</g>
${monitor}
</svg>`;

const LINES = [
  "Untreated iron deficiency: the marrow is short of iron, so it makes too little hemoglobin and the cells come out small and pale. The spleen's stores are nearly empty.",
  "After IV iron: macrophages soak up the dose within days and their stores (ferritin) jump. New, fuller cells appear in about a week, but the arc of 120-day-old cells is replaced only as fast as the marrow works, so hemoglobin climbs over weeks.",
];
const DATA = { far: { w: WD1, A: 62, E: 24, dep: DEP, bone: BONE, spleen: SPLEEN }, S, arc: ARC, ret: RET, mac: MAC, gran: GRAN, sinus: sinus.map((p) => [+p[0].toFixed(1), +p[1].toFixed(1)]), mon: MON, lines: LINES, islands: ISLANDS };
const strip = (src) => src.replace(/^import .*$/gm, "").replace(/^export /gm, "");
const SCRIPT = `${strip(readFileSync(join(HERE, "model.mjs"), "utf8"))}\n${readFileSync(join(HERE, "../../shared/round-back.js"), "utf8")}\n${readFileSync(join(HERE, "live.js"), "utf8").replace("__DATA__", JSON.stringify(DATA))}`;
const CSS = readFileSync(join(HERE, "figure.css"), "utf8");
const ferPeak = Math.max(...fer);
const ferPeakDay = fer.indexOf(ferPeak) * STEP;
const CAPTION = [
  `A red cell lives about 120 days. Bone marrow makes about two million a second; when they wear out, macrophages, mostly in the spleen and liver, eat them and recycle the iron, about 20–25 mg a day in a typical adult, far more than the 1–2 mg the gut absorbs. Iron leaves the macrophage on transferrin and goes back to the marrow.`,
  `That's why ferritin and hemoglobin run on different clocks after IV iron. The macrophages take up the dose within days, so ferritin (a measure of stores) jumps, peaking around day ${Math.round(ferPeakDay)} in this model. Hemoglobin rises only as the marrow turns iron into new cells, over the next four to eight weeks, which is why bloodwork is rechecked at 6–8 weeks.`,
  `<small>A typical pattern for one modelled woman (Hb ${PARAMS.hb0} g/L, ferritin ${PARAMS.ferritin0} µg/L, ${PARAMS.ivMg} mg IV), from Fig 3's model; not a prediction for any person. Ferritin reads high for weeks after IV iron, so it isn't a reliable store measure in that window. The cells are drawn far fewer and larger than life; one drawn cell stands for a normal day's output. Time runs at about two days a second.</small>`,
]
  .map((p) => `<span class="a6-par">${p}</span>`)
  .join("");
const body = plate({
  fig: "A6",
  title: "The red cell's 120 days",
  hint: "Pick untreated or IV iron · two days a second",
  stats: [
    { key: "day", label: "Day", value: "—" },
    { key: "fer", label: "Ferritin", value: `${PARAMS.ferritin0} µg/L` },
    { key: "hb", label: "Hemoglobin", value: `${PARAMS.hb0} g/L` },
  ],
  controls: [{ name: "mode", label: "Treatment", options: [["none", "Untreated"], ["iv", "IV iron"]].map(([value, label], i) => ({ value, label, pressed: i === 0 })) }],
  keys: [
    { mark: "cell", label: "Red cells, youngest at left" },
    { mark: "pale", label: "Made short of iron" },
    { mark: "ferritin", label: "Ferritin stores" },
    { mark: "tf", label: "Iron on transferrin" },
  ],
  caption: CAPTION,
  body: `<div class="iso-stage a6-stage">${svg}</div><p class="a6-scene" data-scene>${LINES[0]}</p><span class="a6-sr" role="status" aria-live="polite" data-status></span>`,
});
const out = THEME === "light" ? `${SLUG}-light.html` : `${SLUG}.html`;
writeFileSync(join(HERE, out), page({ title: "The red cell's 120 days", theme: THEME, body, css: CSS, script: SCRIPT }));
if (THEME === "light") {
  mkdirSync(join(HERE, "embed"), { recursive: true });
  writeFileSync(join(HERE, "embed", `optimal-fig-${SLUG}.js`), embed({ tag: `optimal-fig-${SLUG}`, body, script: SCRIPT, css: CSS }));
}
console.log("wrote", out, `c0 ${S.c0.toFixed(1)} mg/d, cNorm ${S.cNorm.toFixed(1)}, ferritin peak ${ferPeak.toFixed(0)} on day ${ferPeakDay}, hb day 56 ${hb[N - 1].toFixed(1)}, arc ${arcLen.toFixed(0)} px, ${GRAN.length} granule slots`);
