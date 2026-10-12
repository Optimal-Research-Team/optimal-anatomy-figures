// A7 · The kneecap's load (anatomical series, inset for Fig 4).
//
// The leg cut in half lengthwise at the knee, in isometric 3-D: the side section is the cut face,
// the far half keeps its round skin (drawn live, so it follows every frame of the stride), and its
// top is the thigh cut straight across. The section, front to the right, runs through one running
// stride: femur (fixed in
// view), tibia swinging about the condyle, the kneecap (patella) gliding in its groove on the
// patellar tendon, cartilage on all three bones, menisci, the cruciate ligaments, the fat pad,
// quadriceps, hamstrings and calf, and the skin around it all. While the foot is on the ground the
// kneecap's contact glows with the patellofemoral force from Fig 4's model: a higher step rate at
// the same pace lowers its peak (−14 % at +10 %, Lenhart 2014).
//
//   node build.mjs | --light
import { mkdirSync, readFileSync, writeFileSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";
import { plate, page, embed } from "../../shared/page.mjs";
import { figkit, k } from "../../shared/figkit.mjs";
import * as F4 from "../04-creator-600/model.mjs";

const HERE = dirname(fileURLToPath(import.meta.url));
const THEME = process.argv.includes("--light") ? "light" : "dark";
const SLUG = "knee";
const f1 = (v) => v.toFixed(1);
const rng = (() => {
  let s = 29;
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
const RAD = Math.PI / 180;
const CF = [300, 276]; // femoral condyle centre; the tibia swings about it
const RC = 64; // condyle radius
const arc = (c, r, a0, a1, step = 4) => {
  const out = [];
  for (let a = a0; a <= a1 + 1e-9; a += step) out.push([c[0] + r * Math.cos(a * RAD), c[1] + r * Math.sin(a * RAD)]);
  return out;
};

// ---------------------------------------------------------------- femur (fixed)
const FEMUR = [[258, -34], [316, -34], [322, 100], [338, 196], ...arc(CF, RC, -50, 205, 8), [244, 220], [252, 100]];
const femurCart = arc(CF, RC - 3, -50, 200, 4);
let hatch = "";
for (let i = 0; i < 70; i++) {
  const x = 256 + rng() * 80;
  const y = 130 + rng() * 190;
  const a = rng() * Math.PI;
  const L = 10 + rng() * 12;
  hatch += `M${f1(x)} ${f1(y)}l${f1(Math.cos(a) * L)} ${f1(Math.sin(a) * L)}`;
}
// muscle fascicles on the cut face, running the length of each muscle (clipped to it)
const QUAD = [[322, -34], [392, -34], [398, 90], [384, 176], [360, 212], [340, 150], [330, 60]];
const HAM = [[184, -34], [252, -34], [248, 150], [232, 232], [204, 214], [186, 110]];
const CALF = [[-44, 96], [-84, 160], [-94, 214], [-80, 252], [-38, 252], [-46, 190]];
const fascicles = (from, to, n, bow) => {
  let d = "";
  for (let i = 0; i <= n; i++) {
    const t = i / n;
    const a = [from[0][0] + (from[1][0] - from[0][0]) * t, from[0][1] + (from[1][1] - from[0][1]) * t];
    const b = [to[0][0] + (to[1][0] - to[0][0]) * t, to[0][1] + (to[1][1] - to[0][1]) * t];
    d += `M${f1(a[0])} ${f1(a[1])}Q${f1((a[0] + b[0]) / 2 + bow * Math.sin(Math.PI * t))} ${f1((a[1] + b[1]) / 2)} ${f1(b[0])} ${f1(b[1])}`;
  }
  return d;
};
const quadFib = fascicles([[326, -14], [394, -14]], [[338, 200], [372, 196]], 9, 8);
const hamFib = fascicles([[186, -14], [252, -14]], [[206, 222], [238, 226]], 9, -6);
const calfFib = fascicles([[-50, 92], [-40, 100]], [[-86, 254], [-40, 254]], 7, -10);

// ---------------------------------------------------------------- tibia (drawn in its own frame: origin CF, x forward, y down its shaft)
const TIBIA = [[-58, 70], [-30, 67], [0, 66], [30, 67], [56, 70], [62, 80], [54, 102], [62, 118], [50, 140], [40, 200], [36, 252], [-36, 252], [-42, 200], [-52, 126], [-62, 88]];
let tHatch = "";
for (let i = 0; i < 60; i++) {
  const x = -46 + rng() * 92;
  const y = 82 + rng() * 110;
  const a = rng() * Math.PI;
  const L = 9 + rng() * 11;
  tHatch += `M${f1(x)} ${f1(y)}l${f1(Math.cos(a) * L)} ${f1(Math.sin(a) * L)}`;
}
const tibiaG = `<g data-part="tibia">
  <clipPath id="a7-calfclip"><path d="${smooth(CALF, true, 1)}"/></clipPath>
  <path class="a7-calf" d="${smooth(CALF, true, 1)}"/><path class="a7-fasc" clip-path="url(#a7-calfclip)" d="${calfFib}"/>
  <path class="a7-bone" d="${smooth(TIBIA, true, 0.8)}" fill="url(#a7-boneg)"/>
  <path class="a7-canal" d="${smooth([[-22, 249], [22, 249], [25, 205], [17, 172], [0, 162], [-17, 172], [-27, 205]], true, 0.9)}"/>
  <path class="a7-hatch" d="${tHatch}"/>
  <path class="a7-cart" d="M-54 69Q0 63 52 69"/>
  <path class="a7-men" d="M56 72L30 68L56 58Z"/><path class="a7-men" d="M-60 72L-34 68L-60 56Z"/>
  <path class="a7-cutcap" d="M36 252Q0 258 -36 252"/>
</g>`;

// ---------------------------------------------------------------- monitor: kneecap force over one stride
let MON = { x0: 88, x1: 552, y0: 676, y1: 586, max: 1.2, box: [24, 540, 552, 170] };
const xOfP = (p) => MON.x0 + p * (MON.x1 - MON.x0);
const yOfF = (v) => MON.y0 - (v / MON.max) * (MON.y0 - MON.y1);
const KD = 0.39;
const monitor = () => `<g class="a7-mon">
<rect class="a7-mon-bg" x="${MON.box[0]}" y="${MON.box[1]}" width="${MON.box[2]}" height="${MON.box[3]}" rx="12"/>
<text class="a7-mon-title" x="${MON.box[0] + 22}" y="${MON.box[1] + 30}">Kneecap force, one stride</text>
<rect class="a7-stance" x="${f1(xOfP(0))}" y="${MON.y1 - 6}" width="${f1(xOfP(KD) - xOfP(0))}" height="${MON.y0 - MON.y1 + 6}"/>
<path class="a7-grid" d="M${MON.x0} ${f1(yOfF(1))}H${MON.x1}"/>
<text class="a7-tick" x="${MON.x0 - 8}" y="${f1(yOfF(1) + 6)}" text-anchor="end">usual</text>
<path class="a7-axis" d="M${MON.x0} ${MON.y0}H${MON.x1}"/>
<text class="a7-tick" x="${f1(xOfP(0))}" y="${MON.y0 + 24}">foot down</text>
<text class="a7-tick" x="${f1(xOfP(KD))}" y="${MON.y0 + 24}" text-anchor="middle">push off</text>
<text class="a7-tick" x="${f1(xOfP(1))}" y="${MON.y0 + 24}" text-anchor="end">next step</text>
<path class="a7-ghost" data-part="ghost"/><path class="a7-curve" data-part="curve"/>
<path class="a7-cursor" data-part="cursor" d="M0 ${MON.y1 - 6}V${MON.y0}"/><circle class="a7-mdot" data-part="mdot" r="5.5"/>
</g>`;

// ---------------------------------------------------------------- the leg cut in half: the section is the cut face, the far half stays round
// Same camera as the other A-series pieces (azimuth 62°, elevation 24°). World: x = section x,
// y = toward the viewer (the cut face is the plane y = DEP), z = up (−section y). The near half of
// the leg is taken away; the far half keeps its round skin (drawn live in live.js, because the shin
// swings), and its top end is the thigh cut straight across.
const DEP = 140;
const S3 = (sx, y, sy) => [sx, y, -sy];
const ROUND = 0.95; // depth of the far half / half the leg's front-to-back width (thigh and calf are near round)
const TOPC = { x: 292, r: 122, y: -14 }; // the thigh's cut across the top: chord 170..414
// the section's reach over a whole stride, from the same control points live.js uses for the skin
const reach = [[170, -14], [414, -14], [418, 110], [404, 200], [214, 302], [182, 180], [172, 70], [434, 100]];
for (let th = 10; th <= 110; th += 5) {
  const c = Math.cos(th * RAD);
  const s2 = Math.sin(th * RAD);
  for (const q of [[84, 128], [70, 200], [62, 256], [-108, 256], [-112, 190], [-92, 118]]) reach.push([CF[0] + q[0] * c - q[1] * s2, CF[1] + q[0] * s2 + q[1] * c]);
}
for (let a = -30; a <= 55; a += 5) reach.push([CF[0] + 120 * Math.cos(a * RAD), CF[1] + 120 * Math.sin(a * RAD)]);
const BOUNDS3 = reach.map(([x, y]) => S3(x, DEP, y));
for (let t = 0; t <= 180; t += 10) BOUNDS3.push(S3(TOPC.x + TOPC.r * Math.cos(t * RAD), DEP - TOPC.r * ROUND * Math.sin(t * RAD), TOPC.y));
const VW = 600;
const PB = k.fitProjection(BOUNDS3, VW, 640, { pad: 10, azimuth: 62, elevation: 24 });
const SLAB_BOTTOM = Math.max(...BOUNDS3.map((p) => k.iso(p, PB)[1]));
const FB = figkit(PB);
const FRONT_M = FB.planeMatrix(S3(0, DEP, 0), [1, 0, 0], [0, 0, -1]);
// one unit of depth behind the cut, as a translation in the cut face's own coordinates
const o2 = k.iso(S3(0, DEP, 0), PB);
const ex = k.iso(S3(1, DEP, 0), PB).map((v, i) => v - o2[i]);
const ey = k.iso(S3(0, DEP, 1), PB).map((v, i) => v - o2[i]);
const back1 = k.iso(S3(0, DEP - 1, 0), PB).map((v, i) => v - o2[i]);
const det = ex[0] * ey[1] - ey[0] * ex[1];
const WD1 = [(back1[0] * ey[1] - ey[0] * back1[1]) / det, (ex[0] * back1[1] - back1[0] * ex[1]) / det];
// the top: the far half of the thigh cut straight across (plane coordinates: x, d = depth behind the cut)
const CAP_M = FB.planeMatrix(S3(0, DEP, TOPC.y), [1, 0, 0], [0, -1, 0]);
const RD = TOPC.r * ROUND;
const half = (r, rd = r * ROUND, cx = TOPC.x, n = 48) => {
  const pts = [];
  for (let q = 0; q <= n; q++) {
    const t = (q / n) * Math.PI;
    pts.push([cx + r * Math.cos(t), rd * Math.sin(t)]);
  }
  return `M${pts.map((p) => `${f1(p[0])} ${f1(p[1])}`).join("L")}Z`;
};
const polar = (deg, f) => [TOPC.x + TOPC.r * f * Math.cos(deg * RAD), RD * f * Math.sin(deg * RAD)];
const ell = (c, rx, ry, rot = 0) => `<ellipse cx="${f1(c[0])}" cy="${f1(c[1])}" rx="${rx}" ry="${ry}" transform="rotate(${rot} ${f1(c[0])} ${f1(c[1])})"/>`;
// intermuscular septa from the femur out to the fat: anterior (quadriceps) | medial (adductors, sartorius, gracilis) | posterior (hamstrings)
const FEM = { x: 287, r: 29 };
const septum = (deg) => {
  const a = [FEM.x + FEM.r * Math.cos(deg * RAD), FEM.r * 0.95 * Math.sin(deg * RAD)];
  const b = polar(deg + 6, 0.86);
  return `M${f1(a[0])} ${f1(a[1])}Q${f1((a[0] + b[0]) / 2 + 6)} ${f1((a[1] + b[1]) / 2 + 4)} ${f1(b[0])} ${f1(b[1])}`;
};
let capDots = "";
for (let q = 0; q < 70; q++) {
  const deg = 4 + rng() * 172;
  const f = 0.3 + rng() * 0.52;
  const p = polar(deg, f);
  if (Math.hypot(p[0] - FEM.x, p[1] / 0.95) < FEM.r + 5) continue;
  capDots += `M${f1(p[0] - 1.1)} ${f1(p[1])}a1.1 0.9 0 1 0 2.2 0a1.1 0.9 0 1 0 -2.2 0Z`;
}
const CAP = `<g class="a7-cap" transform="${CAP_M}">
<path class="a7-cap-skin" d="${half(TOPC.r)}"/>
<path class="a7-cap-fat" d="${half(TOPC.r - 4, RD - 4)}"/>
<path class="a7-cap-muscle" d="${half(TOPC.r - 15, RD - 15)}"/>
<path class="a7-cap-fasc" d="${capDots}"/>
<g class="a7-cap-mus">${ell(polar(22, 0.55), 22, 15, 20)}${ell(polar(92, 0.82), 10, 7, 0)}${ell(polar(122, 0.8), 7, 5, 30)}${ell(polar(150, 0.62), 17, 12, -25)}${ell(polar(166, 0.6), 13, 9, -10)}</g>
<path class="a7-cap-septum" d="${septum(58)}${septum(132)}"/>
<path class="a7-cap-bone" d="${half(FEM.r, FEM.r * 0.95, FEM.x)}"/>
<path class="a7-cap-marrow" d="${half(FEM.r - 8, (FEM.r - 8) * 0.95, FEM.x)}"/>
<g class="a7-cap-art">${ell(polar(76, 0.5), 4.6, 4.2)}</g><g class="a7-cap-vein">${ell([polar(76, 0.5)[0] - 9, polar(76, 0.5)[1] + 2], 5.6, 4.6)}${ell(polar(104, 0.9), 3.4, 3)}</g>
<g class="a7-cap-nerve">${ell(polar(158, 0.34), 6, 4.4)}</g>
<path class="a7-cap-light" d="${half(TOPC.r)}"/>
<path class="a7-cap-edge" d="${half(TOPC.r)}"/>
</g>`;
const PLOT_Y = Math.ceil(SLAB_BOTTOM + 6);
const VH = PLOT_Y + 170 + 6;
MON = { x0: 88, x1: 552, y0: PLOT_Y + 136, y1: PLOT_Y + 46, max: 1.2, box: [24, PLOT_Y, 552, 170] };

const svg = `<svg class="iso-svg a7-svg" viewBox="0 0 ${VW} ${VH}" role="img" aria-label="A leg cut in half lengthwise at the knee and seen in 3-D. The cut face shows the knee in side section, front to the right, through one running stride. The thigh bone stays still while the shin bone swings beneath it and the kneecap glides up and down in its groove, held by the patellar tendon. Cartilage covers all three bones, with the menisci and the cruciate ligaments between them, the fat pad behind the tendon, and the thigh and calf muscles around. While the foot is on the ground, the contact under the kneecap glows with the force on it; a monitor plots that force over the stride.">
<defs>
  <linearGradient id="a7-boneg" x1="0" y1="0" x2="1" y2="0"><stop offset="0" class="a7-bg0"/><stop offset="1" class="a7-bg1"/></linearGradient>
  <radialGradient id="a7-glowg" cx="50%" cy="50%" r="50%"><stop offset="0" class="a7-gl0"/><stop offset="1" class="a7-gl1"/></radialGradient>
</defs>
<g transform="${FRONT_M}"><g class="a7-far" data-part="far"></g></g>
${CAP}
<g class="a7-slab" transform="${FRONT_M}"><g clip-path="url(#a7-cutclip)">
<defs><clipPath id="a7-cutclip"><rect x="-300" y="${TOPC.y}" width="1200" height="1200"/></clipPath><clipPath id="a7-hamclip"><path d="${smooth(HAM, true, 1)}"/></clipPath><clipPath id="a7-quadclip"><path d="${smooth(QUAD, true, 1)}"/></clipPath>
</defs>
<path class="a7-skin" data-part="skin"/>
<path class="a7-ham" d="${smooth(HAM, true, 1)}"/><path class="a7-fasc" clip-path="url(#a7-hamclip)" d="${hamFib}"/>
<path class="a7-quad" d="${smooth(QUAD, true, 1)}"/><path class="a7-fasc" clip-path="url(#a7-quadclip)" d="${quadFib}"/>
<path class="a7-gastro" data-part="gastro"/>
<path class="a7-hamt" data-part="hamt"/>
${tibiaG}
<path class="a7-bone" d="${smooth(FEMUR, true, 0.7)}" fill="url(#a7-boneg)"/>
<path class="a7-canal" d="${smooth([[268, -40], [306, -40], [310, 70], [301, 128], [287, 142], [273, 128], [264, 70]], true, 0.9)}"/>
<path class="a7-hatch" d="${hatch}"/>
<path class="a7-cart" d="${smooth(femurCart, false, 1)}"/>
<path class="a7-lig" data-part="acl"/><path class="a7-lig" data-part="pcl"/>
<path class="a7-fat" data-part="fatpad"/>
<path class="a7-pfglow" data-part="pfglow"/>
<path class="a7-tendon" data-part="qtendon"/><path class="a7-tendon" data-part="ptendon"/>
<path class="a7-fibres" data-part="tfibres"/>
<g data-part="patella"><ellipse class="a7-pat-cart" cx="-5" cy="0" rx="12" ry="27"/><ellipse class="a7-pat" cx="5" cy="0" rx="15" ry="31" fill="url(#a7-boneg)"/><path class="a7-hatch" d="M-2 -18l10 8M0 -2l12 -6M-2 12l11 6M4 -24l6 14M2 4l9 12"/></g>
<circle data-part="glow" class="a7-glow" r="44" fill="url(#a7-glowg)" opacity="0"/>
</g></g>
${monitor()}
</svg>`;

const LINES = [
  "10 % fewer steps at the same pace: longer strides, a deeper knee bend on landing, and more force under the kneecap.",
  "Your usual step rate at this pace.",
  "5 % more steps at the same pace: shorter strides, a little less bend, a little less force under the kneecap.",
  "10 % more steps at the same pace: on average about 14 % less peak force under the kneecap.",
];
const PCTS = [-10, 0, 5, 10];
const DATA = { CF, RC, PCTS, lines: LINES, mon: MON, far: { w: WD1.map((v) => +v.toFixed(4)), A: 62, E: 24, dep: DEP, round: ROUND } };
const strip = (src) => src.replace(/^import .*$/gm, "").replace(/^export /gm, "");
const SCRIPT = `${strip(readFileSync(join(HERE, "../04-creator-600/model.mjs"), "utf8"))}\n${strip(readFileSync(join(HERE, "model.mjs"), "utf8"))}\n${readFileSync(join(HERE, "live.js"), "utf8").replace("__DATA__", JSON.stringify(DATA))}`;
const CSS = readFileSync(join(HERE, "figure.css"), "utf8");
const c0 = F4.TRUTH.cadence0;
const CAPTION = [
  `Each time a running foot lands, the knee bends and the thigh muscles brake it. They pull the kneecap hard into its groove at the front of the thigh bone, where thick cartilage takes the force. The deeper the bend, the harder the press.`,
  `At the same pace, taking more, shorter steps lands the foot closer under the body and bends the knee less. In a lab study of healthy recreational runners, a 10 % higher step rate cut the peak force behind the kneecap by about 14 % on average. That's why the Creator 600 reports cadence and knee angle (Fig 4).`,
  `<small>Group averages from healthy runners on a lab treadmill, not a prediction for any one runner and not a treatment for knee pain. Knee angles are drawn from typical values and never printed. Shown four times slower than life.</small>`,
]
  .map((p) => `<span class="a7-par">${p}</span>`)
  .join("");
const body = plate({
  fig: "A7",
  title: "The kneecap's load",
  hint: "Pick a step rate · shown 4× slower",
  stats: [
    { key: "cad", label: "Step rate", value: `${c0} /min` },
    { key: "step", label: "Step length", value: `${F4.stepOf(c0).toFixed(2)} m` },
    { key: "pf", label: "Peak kneecap force", value: "100%" },
  ],
  controls: [{ name: "rate", label: "Step rate", options: PCTS.map((p, i) => ({ value: String(p), label: p === 0 ? "Usual" : `${p > 0 ? "+" : "−"}${Math.abs(p)}%`, pressed: i === 1 })) }],
  keys: [
    { mark: "cart", label: "Cartilage" },
    { mark: "heat", label: "Force under the kneecap" },
    { mark: "tendon", label: "Quadriceps and patellar tendons" },
  ],
  caption: CAPTION,
  body: `<div class="iso-stage a7-stage">${svg}</div><p class="a7-scene" data-scene>${LINES[1]}</p><span class="a7-sr" role="status" aria-live="polite" data-status></span>`,
});
const out = THEME === "light" ? `${SLUG}-light.html` : `${SLUG}.html`;
writeFileSync(join(HERE, out), page({ title: "The kneecap's load", theme: THEME, body, css: CSS, script: SCRIPT }));
if (THEME === "light") {
  mkdirSync(join(HERE, "embed"), { recursive: true });
  writeFileSync(join(HERE, "embed", `optimal-fig-${SLUG}.js`), embed({ tag: `optimal-fig-${SLUG}`, body, script: SCRIPT, css: CSS }));
}
console.log("wrote", out, PCTS.map((p) => `${p}%: ${F4.cadenceOf(p).toFixed(0)} spm, PF ${(100 * F4.kneeOf(F4.cadenceOf(p))).toFixed(0)}%`).join(" · "));
