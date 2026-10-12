// A2 · The hot-flash switch (anatomical series, inset for Fig 1).
//
// A block of brain cut out around the hypothalamus, in isometric 3-D. Its front face is the midline
// cut, its top a horizontal cut at the level of the thalamus (thalamus, fornix, internal capsule,
// lentiform nucleus), its right end a cut across; under it the optic nerve and chiasm, the stalk,
// the pituitary and its bony cup hang free, each cut in half with its back half round.
// The hypothalamus on the front face, front of the head on the left: the anterior commissure,
// the fornix arching down to the mammillary body, the optic chiasm, the stalk and the pituitary
// in its bony cup. At the base, KNDy neurons of the arcuate (infundibular) nucleus send
// neurokinin B up to the heat-loss centre in the median preoptic nucleus (MnPO). Estrogen from
// the blood keeps them small and quiet; take it away and they swell and signal more, until the
// heat-loss centre tips over with small everyday wanders: a hot flash.
//
//   node build.mjs | --light
import { mkdirSync, readFileSync, writeFileSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";
import { plate, page, embed } from "../../shared/page.mjs";
import { figkit, k } from "../../shared/figkit.mjs";
import * as M from "./model.mjs";
import { rateOf } from "../01-menopause-thermostat/model.mjs";

const HERE = dirname(fileURLToPath(import.meta.url));
const THEME = process.argv.includes("--light") ? "light" : "dark";
const SLUG = "hypothalamus";
const f1 = (v) => v.toFixed(1);
const rng = (() => {
  let s = 11;
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
/** Sampled Catmull-Rom centreline. */
function curve(points, samples = 12) {
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
function tube(points, w0, w1 = w0) {
  const c = curve(points);
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
  return { d: `M${[...L, ...R.reverse()].map((p) => `${f1(p[0])} ${f1(p[1])}`).join("L")}Z`, c };
}
const poly = (pts) => `M${pts.map((p) => `${f1(p[0])} ${f1(p[1])}`).join("L")}`;
const dot = (x, y, r) => `M${f1(x - r)} ${f1(y)}a${r} ${r} 0 1 0 ${2 * r} 0a${r} ${r} 0 1 0 ${-2 * r} 0`;

// ---------------------------------------------------------------- the slice (front of the head on the left)
const BRAIN = [[80, 168], [150, 142], [240, 150], [330, 138], [420, 146], [500, 140], [522, 170], [520, 300], [522, 420], [516, 456], [506, 452], [494, 462], [470, 468], [448, 460], [430, 448], [396, 442], [352, 440], [328, 444], [316, 450], [290, 450], [276, 442], [244, 432], [206, 420], [170, 418], [150, 424], [118, 428], [92, 430], [76, 418], [74, 300], [72, 220]];
const SULCUS = [[160, 196], [250, 214], [360, 226], [460, 238], [560, 262], [620, 276]];
const fornix = tube([[262, -24], [246, 50], [222, 128], [214, 186], [232, 246], [292, 312], [378, 376], [446, 424], [468, 444]], 26, 15);
const chiasm = { cx: 124, cy: 418, rx: 40, ry: 17 };
const nerve = tube([[112, 424], [86, 432], [64, 440]], 24, 25);
const AC = { cx: 156, cy: 172, rx: 25, ry: 18 };
const mamm = { cx: 470, cy: 444, r: 24 };
const stalk = smooth([[287, 446], [317, 446], [322, 470], [328, 500], [312, 506], [298, 502], [296, 472]], true, 0.8);
const antLobe = smooth([[256, 520], [272, 502], [300, 498], [318, 512], [318, 536], [300, 550], [274, 550], [258, 540]], true, 1);
const postLobe = smooth([[312, 504], [332, 498], [350, 508], [352, 530], [340, 546], [320, 548], [314, 530]], true, 1);
const sella = smooth([[240, 506], [246, 538], [266, 560], [306, 566], [346, 560], [364, 536], [368, 506], [378, 506], [376, 544], [354, 574], [306, 582], [258, 576], [236, 546], [230, 506]], true, 0.9);
const thalamus = smooth([[180, 30], [330, 10], [500, 26], [600, 70], [600, 250], [470, 230], [330, 218], [230, 204], [190, 160]], true, 0.8);
const adhesion = { cx: 384, cy: 184, rx: 36, ry: 20 };
// fibre striations along the fornix, the nerve and in the commissure
const striae = (c, offs) => offs.map((o) => poly(c.map((p, i) => {
  const a = c[Math.max(0, i - 1)];
  const b = c[Math.min(c.length - 1, i + 1)];
  const l = Math.hypot(b[0] - a[0], b[1] - a[1]) || 1;
  return [p[0] - ((b[1] - a[1]) / l) * o, p[1] + ((b[0] - a[0]) / l) * o];
}))).join("");
const fibres = striae(fornix.c, [-6, -2, 2, 6]) + striae(nerve.c, [-7, -2.5, 2.5, 7]);
let acDots = "";
for (let i = 0; i < 26; i++) {
  const a = rng() * 2 * Math.PI;
  const m = Math.sqrt(rng()) * 0.8;
  acDots += dot(AC.cx + Math.cos(a) * AC.rx * m, AC.cy + Math.sin(a) * AC.ry * m, 1.2);
}
// glial nuclei speckling the grey matter
let speck = "";
const inside = (x, y) => {
  // inside the brain outline, under the top, avoiding the white-matter shapes roughly
  let c = false;
  for (let i = 0, j = BRAIN.length - 1; i < BRAIN.length; j = i++) {
    const [xi, yi] = BRAIN[i];
    const [xj, yj] = BRAIN[j];
    if (yi > y !== yj > y && x < ((xj - xi) * (y - yi)) / (yj - yi) + xi) c = !c;
  }
  return c;
};
for (let i = 0; i < 420; i++) {
  const x = 70 + rng() * 460;
  const y = 130 + rng() * 340;
  if (inside(x, y)) speck += dot(x, y, 0.8 + rng() * 0.9);
}
// small vessels in the tissue (estrogen leaves the blood here)
const VESSELS = [
  [[228, 440], [236, 400], [226, 352], [240, 300], [232, 262]],
  [[372, 448], [366, 404], [384, 352], [372, 300]],
  [[226, 352], [190, 330], [176, 290]],
];
const vesselD = VESSELS.map((v) => tube(v, 3.6, 2.4).d).join("");
// the median eminence's portal loops
const loops = [[284, 452], [300, 455], [316, 452]].map(([x, y]) => `M${x - 5} ${y - 8}C${x - 7} ${y + 6} ${x + 7} ${y + 6} ${x + 5} ${y - 8}`).join("");

// ---------------------------------------------------------------- neurons
/** A neuron drawn at the origin: soma blob, nucleus, tapered dendrites. */
function neuron(r, dendrites, seed) {
  const pts = Array.from({ length: 7 }, (_, k) => {
    const a = (k / 7) * 2 * Math.PI + seed;
    const m = r * (0.86 + rng() * 0.28);
    return [Math.cos(a) * m * 1.1, Math.sin(a) * m * 0.92];
  });
  let den = "";
  for (let k = 0; k < dendrites; k++) {
    const a = seed * 1.7 + (k / dendrites) * 2 * Math.PI + rng() * 0.6;
    const L = r * (1.9 + rng() * 1.3);
    const bend = (rng() - 0.5) * 0.9;
    const tip = [Math.cos(a + bend) * (r + L), Math.sin(a + bend) * (r + L)];
    const mid = [Math.cos(a + bend * 0.4) * (r + L * 0.5), Math.sin(a + bend * 0.4) * (r + L * 0.5)];
    const nx = -Math.sin(a);
    const ny = Math.cos(a);
    const w = r * 0.42;
    den += smooth([[Math.cos(a) * r * 0.7 + nx * w, Math.sin(a) * r * 0.7 + ny * w], [mid[0] + nx * w * 0.35, mid[1] + ny * w * 0.35], tip, [mid[0] - nx * w * 0.35, mid[1] - ny * w * 0.35], [Math.cos(a) * r * 0.7 - nx * w, Math.sin(a) * r * 0.7 - ny * w]], true, 0.7);
  }
  return { soma: smooth(pts, true, 1), den, nuc: dot(rng() * 1.2 - 0.6, rng() * 1.2 - 0.6, r * 0.42), nucleolus: dot(r * 0.08, -r * 0.06, r * 0.12) };
}
const KNDY = [[262, 402], [282, 390], [302, 400], [322, 388], [342, 402], [276, 416], [314, 416], [298, 380]];
const MNPO = [[160, 226], [180, 214], [200, 228], [170, 246], [192, 248], [212, 242]];
const kndySvg = KNDY.map(([x, y], i) => {
  const n = neuron(7.5, 3, i * 1.3);
  return `<g class="a2-kndy" data-k="${i}" transform="translate(${x} ${y})"><circle class="a2-kglow" r="20" fill="url(#a2-kglow)" opacity="0"/><path class="a2-den" d="${n.den}"/><path class="a2-soma" d="${n.soma}"/><path class="a2-nuc" d="${n.nuc}"/><path class="a2-nucleolus" d="${n.nucleolus}"/></g>`;
}).join("");
const mnpoSvg = MNPO.map(([x, y], i) => {
  const n = neuron(6.5, 3, i * 2.1 + 0.4);
  let rec = "";
  for (let k = 0; k < 6; k++) {
    const a = (k / 6) * 2 * Math.PI + i;
    rec += dot(Math.cos(a) * 7.4, Math.sin(a) * 6.4, 1.1);
  }
  return `<g class="a2-mn" transform="translate(${x} ${y})"><path class="a2-mden" d="${n.den}"/><path class="a2-msoma" d="${n.soma}"/><path class="a2-mnuc" d="${n.nuc}"/><path class="a2-rec" d="${rec}"/></g>`;
}).join("");
// KNDy → MnPO axons (sampled for the moving packets), and short ones down to the median eminence
const AXONS = [0, 1, 3, 4].map((ki, j) => {
  const [x, y] = KNDY[ki];
  const [mx, my] = MNPO[[2, 4, 5, 1][j]];
  return curve([[x, y], [x - 20 - j * 6, y - 40], [250 - j * 8, 320 - j * 4], [214 - j * 4, 282 - j * 3], [mx + 4, my + 6]], 10).map((p) => [+p[0].toFixed(1), +p[1].toFixed(1)]);
});
const DOWN = [[2, [286, 448]], [5, [300, 452]], [6, [314, 448]]].map(([ki, end]) => curve([KNDY[ki], [(KNDY[ki][0] + end[0]) / 2 + 4, (KNDY[ki][1] + end[1]) / 2], end], 8).map((p) => [+p[0].toFixed(1), +p[1].toFixed(1)]));
const beads = AXONS.flatMap((a) => a.filter((_, i) => i % 6 === 3).map((p) => dot(p[0], p[1], 1.5))).join("");
const OUT = curve([[206, 240], [252, 262], [340, 296], [440, 324], [500, 336], [540, 344]], 10).map((p) => [+p[0].toFixed(1), +p[1].toFixed(1)]);

// ---------------------------------------------------------------- the locator: where this sits in the head
const LOC = { x: 16, y: 478, w: 150, h: 108 };
const locBrain = smooth([[30, 548], [36, 512], [62, 494], [100, 490], [134, 500], [150, 522], [148, 546], [132, 556], [112, 552], [96, 556], [78, 560], [54, 562]], true, 1);
const locCbm = smooth([[126, 556], [146, 552], [152, 566], [138, 576], [122, 570]], true, 1);
const locStem = smooth([[106, 554], [116, 556], [118, 584], [110, 586]], true, 1);

// ---------------------------------------------------------------- the block: the slice is its front face
// Same camera as the other A-series pieces (azimuth 62°, elevation 24°). World: x = section x,
// y = toward the viewer (the midline cut is the plane y = DEP), z = up (−section y).
const BX0 = 74; //  the block's cut ends (front of the head on the left, back on the right)
const BX1 = 520;
const BY0 = 150; // its top: a horizontal cut through the thalamus
const BD = 160; //  how far the block reaches back from the midline (to the side of the brain)
const DEP = 220;
const RAD = Math.PI / 180;
const S3 = (sx, y, sy) => [sx, y, -sy];
const BOUNDS3 = [...BRAIN, [64, 446], [240, 506], [378, 506], [306, 582], [258, 576], [354, 574]].map(([x, y]) => S3(Math.max(x, 60), DEP, Math.max(y, BY0)));
for (const [x, y] of [[BX0, BY0], [BX1, BY0], [BX1, 420]]) BOUNDS3.push(S3(x, DEP - BD, y));
const VW = 600;
const PB = k.fitProjection(BOUNDS3, VW, 600, { pad: 12, azimuth: 62, elevation: 24 });
const BLOCK_BOTTOM = Math.max(...BOUNDS3.map((p) => k.iso(p, PB)[1]));
const FB = figkit(PB);
const p3 = (pts, close = true) => FB.path3(pts, close);
const FRONT_M = FB.planeMatrix(S3(0, DEP, 0), [1, 0, 0], [0, 0, -1]);
const o2 = k.iso(S3(0, DEP, 0), PB);
const ex2 = k.iso(S3(1, DEP, 0), PB).map((v, i) => v - o2[i]);
const ey2 = k.iso(S3(0, DEP, 1), PB).map((v, i) => v - o2[i]);
const b1 = k.iso(S3(0, DEP - 1, 0), PB).map((v, i) => v - o2[i]);
const det = ex2[0] * ey2[1] - ey2[0] * ex2[1];
const WD1 = [(b1[0] * ey2[1] - ey2[0] * b1[1]) / det, (ex2[0] * b1[1] - b1[0] * ex2[1]) / det].map((v) => +v.toFixed(4));
const VH = Math.ceil(BLOCK_BOTTOM + 14);
// the block's tissue above the base is square-cut; the base (the brain's underside) keeps its own outline
const FACE = `M${BX0} ${BY0}H${BX1}V400H${BX0}Z`;
const speckle = (w, h, n, seed = 3) => {
  let s2 = seed;
  const r2 = () => ((s2 = (s2 * 16807) % 2147483647) - 1) / 2147483646;
  let d = "";
  for (let i = 0; i < n; i++) d += dot(r2() * w, r2() * h, 0.8 + r2() * 0.9);
  return d;
};
// top: a horizontal cut at the thalamus (x along the head, d = depth from the midline)
const TOP_M = FB.planeMatrix(S3(0, DEP, BY0), [1, 0, 0], [0, -1, 0]);
// the internal capsule in its true V: anterior limb, genu (closest to the midline), posterior limb;
// caudate head in front of the genu, thalamus behind it, the lens-shaped lentiform nucleus outside
const capsule = smooth([[BX0 - 6, 112], [150, 82], [196, 62], [250, 70], [360, 104], [BX1 + 10, 138], [BX1 + 10, 160], [356, 124], [248, 92], [204, 84], [156, 102], [BX0 - 6, 134]], true, 0.7);
const lentiform = smooth([[120, 128], [170, 104], [220, 96], [290, 112], [340, 136], [330, BD + 12], [150, BD + 12], [110, 150]], true, 0.9);
const caudate = smooth([[BX0 - 6, 22], [130, 18], [178, 40], [176, 60], [140, 80], [BX0 - 6, 98]], true, 0.9);
let topVessels = "";
for (const [x, d] of [[200, 40], [300, 52], [420, 70], [180, 128], [300, 146], [460, 150], [120, 110]]) topVessels += dot(x, d, 1.6);
const TOP_FACE = `<g transform="${TOP_M}"><clipPath id="a2-topclip"><rect x="${BX0}" y="0" width="${BX1 - BX0}" height="${BD}"/></clipPath><g clip-path="url(#a2-topclip)">
<rect class="a2-brain-top" x="${BX0}" y="0" width="${BX1 - BX0}" height="${BD}" fill="url(#a2-tissue)"/>
<path class="a2-top-thal" d="${smooth([[196, 0], [BX1 + 10, 0], [BX1 + 10, 128], [360, 96], [250, 64], [200, 52]], true, 0.8)}"/>
<path class="a2-top-grey" d="${caudate}"/><path class="a2-top-grey" d="${lentiform}"/>
<path class="a2-top-white" d="${capsule}"/>
<path class="a2-speck" d="${speckle(BX1 - BX0, BD, 260)}" transform="translate(${BX0} 0)"/>
<ellipse class="a2-white" cx="218" cy="11" rx="12" ry="8"/>
<path class="a2-top-vessel" d="${topVessels}"/>
<rect class="a2-top-light" x="${BX0}" y="0" width="${BX1 - BX0}" height="${BD}"/>
</g></g>`;
// right end: a cut across behind the mammillary bodies (u = depth from the midline, v = section y)
const END_M = FB.planeMatrix(S3(BX1, DEP, 0), [0, -1, 0], [0, 0, -1]);
const END_BOT = 420;
const END_FACE = `<g transform="${END_M}"><clipPath id="a2-endclip"><path d="M0 ${BY0}H${BD}V${END_BOT - 6}Q${BD * 0.6} ${END_BOT + 8} 0 ${END_BOT}Z"/></clipPath><g clip-path="url(#a2-endclip)">
<rect x="0" y="${BY0}" width="${BD}" height="${END_BOT - BY0 + 10}" fill="url(#a2-tissue)"/>
<path class="a2-top-thal" d="${smooth([[0, BY0 - 4], [BD + 6, BY0 - 4], [BD + 6, 250], [70, 270], [0, 262]], true, 0.8)}"/>
<path class="a2-top-white" d="${smooth([[96, BY0 - 4], [124, BY0 - 4], [130, 280], [150, 360], [BD + 8, 400], [BD + 8, 430], [128, 400], [104, 320]], true, 0.8)}"/>
<ellipse class="a2-white" cx="70" cy="398" rx="16" ry="9"/>
<path class="a2-speck" d="${speckle(BD, END_BOT - BY0, 110, 9)}" transform="translate(0 ${BY0})"/>
<rect class="a2-end-shade" x="0" y="${BY0}" width="${BD}" height="${END_BOT - BY0 + 10}"/>
</g><path class="a2-block-edge" d="M0 ${BY0}H${BD}V${END_BOT - 6}Q${BD * 0.6} ${END_BOT + 8} 0 ${END_BOT}"/></g>`;
const EDGES = `<path class="a2-block-edge" d="${p3([S3(BX0, DEP, BY0), S3(BX0, DEP - BD, BY0), S3(BX1, DEP - BD, BY0), S3(BX1, DEP, BY0)], false)}"/>`;
// the parts hanging under the block, cut in half: their back halves are drawn round in live.js
const ellipsePts = (cx, cy, rx, ry, n = 16) => Array.from({ length: n }, (_, i) => [cx + rx * Math.cos((i / n) * 2 * Math.PI), cy + ry * Math.sin((i / n) * 2 * Math.PI)]);
const FAR_PARTS = [
  { pts: [[240, 506], [246, 538], [266, 560], [306, 566], [346, 560], [364, 536], [368, 506], [378, 506], [376, 544], [354, 574], [306, 582], [258, 576], [236, 546], [230, 506]], k: 0.9, tone: "--a2-bone", rho: 0.35 },
  { pts: [[256, 520], [272, 502], [300, 498], [318, 512], [318, 536], [300, 550], [274, 550], [258, 540]], k: 1, tone: "--a2-ant", rho: 0.9 },
  { pts: [[312, 504], [332, 498], [350, 508], [352, 530], [340, 546], [320, 548], [314, 530]], k: 1, tone: "--a2-gland", rho: 0.9 },
  { pts: [[287, 446], [317, 446], [322, 470], [328, 500], [312, 506], [298, 502], [296, 472]], k: 0.8, tone: "--a2-gland", rho: 0.8 },
  { pts: ellipsePts(chiasm.cx, chiasm.cy, chiasm.rx, chiasm.ry), k: 1, tone: "--a2-white", rho: 0.6 },
  { pts: ellipsePts(mamm.cx, mamm.cy, mamm.r, mamm.r), k: 1, tone: "--a2-t0", rho: 0.9 },
];
const NERVE_C = nerve.c.map((p) => [+p[0].toFixed(1), +p[1].toFixed(1)]);

const svg = `<svg class="iso-svg a2-svg" viewBox="0 0 ${VW} ${VH}" role="img" aria-label="A block of brain cut out around the hypothalamus and seen in 3-D. Its front face is a midline cut, the front of the head on the left; its top shows the thalamus cut across, and the pituitary hangs underneath in its bony cup. At its base, just above the pituitary stalk, a cluster of KNDy nerve cells sends signals of neurokinin B up to the heat-loss centre near the front. Estrogen from the blood keeps the cluster small and quiet. After menopause the cells are drawn larger and signal more often, and the heat-loss centre periodically tips over, sending a heat-loss burst: a hot flash.">
<defs>
  <radialGradient id="a2-tissue" cx="44%" cy="56%" r="72%"><stop offset="0" class="a2-t0"/><stop offset="1" class="a2-t1"/></radialGradient>
  <radialGradient id="a2-kglow" cx="50%" cy="50%" r="50%"><stop offset="0" class="a2-kg0"/><stop offset="1" class="a2-kg1"/></radialGradient>
  <radialGradient id="a2-mglow" cx="50%" cy="50%" r="50%"><stop offset="0" class="a2-mg0"/><stop offset="1" class="a2-mg1"/></radialGradient>
  <radialGradient id="a2-hglow" cx="50%" cy="50%" r="50%"><stop offset="0" class="a2-hg0"/><stop offset="1" class="a2-hg1"/></radialGradient>
</defs>
<g transform="${FRONT_M}"><g class="a2-far" data-part="far"></g></g>
${TOP_FACE}
${END_FACE}
${EDGES}
<g class="a2-front" transform="${FRONT_M}">
<defs><radialGradient id="a2-tissue-front" gradientUnits="userSpaceOnUse" cx="268" cy="323" r="330"><stop offset="0" class="a2-t0"/><stop offset="1" class="a2-t1"/></radialGradient><clipPath id="a2-brainclip"><path d="${smooth(BRAIN, true, 0.6)}"/><path d="${FACE}"/></clipPath><clipPath id="a2-baseclip"><rect x="${BX0 + 3}" y="396" width="${BX1 - BX0 - 6}" height="120"/></clipPath><clipPath id="a2-cutclip"><rect x="${BX0}" y="${BY0}" width="${BX1 - BX0}" height="600"/><rect x="40" y="400" width="${BX1 - 40}" height="200"/></clipPath></defs>
<g clip-path="url(#a2-cutclip)">
<path class="a2-sella" d="${sella}"/>
<path class="a2-brain a2-brain-fill" d="${FACE}" fill="url(#a2-tissue-front)"/>
<path class="a2-brain a2-brain-fill" d="${smooth(BRAIN, true, 0.6)}" fill="url(#a2-tissue-front)"/>
<path class="a2-base-edge" clip-path="url(#a2-baseclip)" d="${smooth(BRAIN, true, 0.6)}"/>
<g clip-path="url(#a2-brainclip)">
  <path class="a2-thal" d="${thalamus}"/>
  <ellipse class="a2-adh" cx="${adhesion.cx}" cy="${adhesion.cy}" rx="${adhesion.rx}" ry="${adhesion.ry}"/>
  <path class="a2-speck" d="${speck}"/>
  <path class="a2-sulcus" d="${smooth(SULCUS, false, 1)}"/>
  <path class="a2-vessel" d="${vesselD}"/>
  <path class="a2-white" d="${fornix.d}"/>
  <path class="a2-fibre" d="${fibres}"/>
  <circle class="a2-mamm" cx="${mamm.cx}" cy="${mamm.cy}" r="${mamm.r}"/>
</g>
<path class="a2-white" d="${nerve.d}"/>
<path class="a2-fibre" d="${striae(nerve.c, [-7, -2.5, 2.5, 7])}"/>
<ellipse class="a2-white" cx="${chiasm.cx}" cy="${chiasm.cy}" rx="${chiasm.rx}" ry="${chiasm.ry}"/>
<ellipse class="a2-white" cx="${AC.cx}" cy="${AC.cy}" rx="${AC.rx}" ry="${AC.ry}"/>
<path class="a2-acdots" d="${acDots}"/>
<path class="a2-lamina" d="${smooth([[146, 190], [132, 260], [120, 340], [118, 402]], false, 1)}"/>
<path class="a2-stalk" d="${stalk}"/>
<path class="a2-post" d="${postLobe}"/>
<path class="a2-ant" d="${antLobe}"/>
<path class="a2-loops" d="${loops}"/>
<circle data-part="heat" class="a2-heat" cx="186" cy="234" r="120" fill="url(#a2-hglow)" opacity="0" clip-path="url(#a2-brainclip)"/>
<circle data-part="mglow" class="a2-mglow" cx="186" cy="234" r="58" fill="url(#a2-mglow)" opacity="0.2"/>
<path class="a2-axon" d="${AXONS.map(poly).join("")}"/>
<path class="a2-axon a2-axon-down" d="${DOWN.map(poly).join("")}"/>
<path class="a2-bead" d="${beads}"/>
<g clip-path="url(#a2-brainclip)"><path class="a2-out" d="${poly(OUT)}"/><path data-part="outpulse" class="a2-outpulse"/></g>
${mnpoSvg}
${kndySvg}
<path data-part="estro" class="a2-estro"/>
<path data-part="nkb" class="a2-nkb"/>
</g></g>
<g class="a2-loc" aria-hidden="true" transform="translate(${VW - 128} ${VH - 92}) scale(0.72) translate(-16 -478)"><rect class="a2-loc-bg" x="${LOC.x}" y="${LOC.y}" width="${LOC.w}" height="${LOC.h}" rx="10"/><path class="a2-loc-brain" d="${locBrain}"/><path class="a2-loc-brain" d="${locCbm}"/><path class="a2-loc-brain" d="${locStem}"/><rect class="a2-loc-mark" x="76" y="536" width="20" height="16" rx="3"/></g>
</svg>`;

const LINES = [
  "Before menopause: estrogen keeps the KNDy cells small and their signal modest. The heat-loss centre idles, and everyday wanders in body heat pass unnoticed.",
  "After menopause: with little estrogen, the cells swell and send neurokinin B more often. The heat-loss centre runs close to its edge, and a small wander tips it into a hot flash.",
  "Hormone therapy, where it suits: estrogen is replaced, the KNDy cells quieten, and the heat-loss centre moves back from its edge.",
  "A non-hormonal prescription option: the cells still signal, but a neurokinin-receptor blocker stops the heat-loss centre from receiving it.",
];
const DATA = { far: { w: WD1, A: 62, E: 24, dep: DEP, parts: FAR_PARTS, nerve: NERVE_C, nerveW: [24, 25] }, kndy: KNDY, mnpo: MNPO, axons: AXONS, down: DOWN, out: OUT, vessels: VESSELS.map((v) => curve(v, 6).map((p) => [+p[0].toFixed(1), +p[1].toFixed(1)])), lines: LINES, rate: [rateOf(1), rateOf(0)] };
const strip = (src) => src.replace(/^import .*$/gm, "").replace(/^export /gm, "");
const SCRIPT = `${strip(readFileSync(join(HERE, "model.mjs"), "utf8"))}\n${readFileSync(join(HERE, "../../shared/round-back.js"), "utf8")}\n${readFileSync(join(HERE, "live.js"), "utf8").replace("__DATA__", JSON.stringify(DATA))}`;
const CSS = readFileSync(join(HERE, "figure.css"), "utf8");
const CAPTION = [
  `Deep in the brain, just above the pituitary, a small cluster of nerve cells called KNDy neurons (for the kisspeptin, neurokinin B and dynorphin they make) also times the pulses of reproductive hormones, and sends neurokinin B to the brain's heat-loss centre, the median preoptic nucleus. Estrogen keeps these cells in check.`,
  `After menopause they are larger (about twice the cross-section in a post-mortem study) and make more neurokinin B. The heat-loss centre then sits near its tipping point, so a tiny everyday rise in body heat sets off a full heat-loss response: flushing, sweating and a faster heart. In a study, neurokinin B given to women caused flushes.`,
  `Treatment can act at either end. Hormone therapy replaces the estrogen that keeps these cells in check. Non-hormonal neurokinin-receptor blockers leave the cells signalling but stop the heat-loss centre receiving it. Neither is for everyone: each needs a safety review and has its own benefits and risks, and not treating is always an option.`,
  `<small>A typical pattern in women who have hot flashes; many women have few or none. How much a treatment helps varies from person to person; the drawing shows the mechanism, not an expected result. Time is compressed: the drawn bursts come seconds apart, while hot flashes come about an hour apart. Firing rates are drawn, not measured. Cell size from post-mortem studies of postmenopausal women.</small>`,
]
  .map((p) => `<span class="a2-par">${p}</span>`)
  .join("");
const body = plate({
  fig: "A2",
  title: "The hot-flash switch",
  hint: "Before, after, or with a treatment · watch the cells at the base",
  stats: [
    { key: "estro", label: "Estrogen", value: "Cycling" },
    { key: "size", label: "KNDy cell size", value: "100%" },
    { key: "rate", label: "Hot flashes", value: "Rare" },
  ],
  controls: [{ name: "state", label: "Menopause and treatment", options: [["pre", "Before"], ["post", "After"], ["ht", "Hormone therapy"], ["nk", "Non-hormonal"]].map(([value, label], i) => ({ value, label, pressed: i === 0 })) }],
  keys: [
    { mark: "kndy", label: "KNDy cells and neurokinin B" },
    { mark: "mnpo", label: "Heat-loss centre (MnPO)" },
    { mark: "estro", label: "Estrogen" },
  ],
  caption: CAPTION,
  body: `<div class="iso-stage a2-stage">${svg}</div><p class="a2-scene" data-scene>${LINES[0]}</p><span class="a2-sr" role="status" aria-live="polite" data-status></span>`,
});
const out = THEME === "light" ? `${SLUG}-light.html` : `${SLUG}.html`;
writeFileSync(join(HERE, out), page({ title: "The hot-flash switch", theme: THEME, body, css: CSS, script: SCRIPT }));
if (THEME === "light") {
  mkdirSync(join(HERE, "embed"), { recursive: true });
  writeFileSync(join(HERE, "embed", `optimal-fig-${SLUG}.js`), embed({ tag: `optimal-fig-${SLUG}`, body, script: SCRIPT, css: CSS }));
}
console.log("wrote", out, `mean drive pre ${M.meanDrive(1).toFixed(2)}, post ${M.meanDrive(0).toFixed(2)}`);
