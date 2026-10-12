// A7 · The kneecap's load (anatomical series, inset for Fig 4).
//
// The knee in side section, front to the right, through one running stride: femur (fixed in
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
const FEMUR = [[258, -12], [316, -12], [322, 100], [338, 196], ...arc(CF, RC, -50, 205, 8), [244, 220], [252, 100]];
const femurCart = arc(CF, RC - 3, -50, 200, 4);
let hatch = "";
for (let i = 0; i < 70; i++) {
  const x = 256 + rng() * 80;
  const y = 130 + rng() * 190;
  const a = rng() * Math.PI;
  const L = 10 + rng() * 12;
  hatch += `M${f1(x)} ${f1(y)}l${f1(Math.cos(a) * L)} ${f1(Math.sin(a) * L)}`;
}
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
  <path class="a7-calf" d="${smooth([[-44, 96], [-84, 160], [-94, 214], [-80, 252], [-38, 252], [-46, 190]], true, 1)}"/>
  <path class="a7-bone" d="${smooth(TIBIA, true, 0.8)}" fill="url(#a7-boneg)"/>
  <path class="a7-hatch" d="${tHatch}"/>
  <path class="a7-cart" d="M-54 69Q0 63 52 69"/>
  <path class="a7-men" d="M56 72L30 68L56 58Z"/><path class="a7-men" d="M-60 72L-34 68L-60 56Z"/>
  <path class="a7-cutcap" d="M36 252Q0 258 -36 252"/>
</g>`;

// ---------------------------------------------------------------- monitor: kneecap force over one stride
const MON = { x0: 88, x1: 552, y0: 676, y1: 586, max: 1.2, box: [24, 540, 552, 170] };
const xOfP = (p) => MON.x0 + p * (MON.x1 - MON.x0);
const yOfF = (v) => MON.y0 - (v / MON.max) * (MON.y0 - MON.y1);
const KD = 0.39;
const monitor = `<g class="a7-mon">
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

const svg = `<svg class="iso-svg a7-svg" viewBox="0 0 600 720" role="img" aria-label="The knee in side section, front to the right, through one running stride. The thigh bone stays still while the shin bone swings beneath it and the kneecap glides up and down in its groove, held by the patellar tendon. Cartilage covers all three bones, with the menisci and the cruciate ligaments between them, the fat pad behind the tendon, and the thigh and calf muscles around. While the foot is on the ground, the contact under the kneecap glows with the force on it; a monitor plots that force over the stride.">
<defs>
  <linearGradient id="a7-boneg" x1="0" y1="0" x2="1" y2="0"><stop offset="0" class="a7-bg0"/><stop offset="1" class="a7-bg1"/></linearGradient>
  <radialGradient id="a7-glowg" cx="50%" cy="50%" r="50%"><stop offset="0" class="a7-gl0"/><stop offset="1" class="a7-gl1"/></radialGradient>
</defs>
<path class="a7-skin" data-part="skin"/>
<path class="a7-ham" d="${smooth([[184, -12], [252, -12], [248, 150], [232, 232], [204, 214], [186, 110]], true, 1)}"/>
<path class="a7-quad" d="${smooth([[322, -12], [392, -12], [398, 90], [384, 176], [360, 212], [340, 150], [330, 60]], true, 1)}"/>
<path class="a7-gastro" data-part="gastro"/>
<path class="a7-hamt" data-part="hamt"/>
${tibiaG}
<path class="a7-bone" d="${smooth(FEMUR, true, 0.7)}" fill="url(#a7-boneg)"/>
<path class="a7-hatch" d="${hatch}"/>
<path class="a7-cart" d="${smooth(femurCart, false, 1)}"/>
<path class="a7-cutcap" d="M258 -12Q287 -5 316 -12"/>
<path class="a7-lig" data-part="acl"/><path class="a7-lig" data-part="pcl"/>
<path class="a7-fat" data-part="fatpad"/>
<path class="a7-pfglow" data-part="pfglow"/>
<path class="a7-tendon" data-part="qtendon"/><path class="a7-tendon" data-part="ptendon"/>
<path class="a7-fibres" data-part="tfibres"/>
<g data-part="patella"><ellipse class="a7-pat-cart" cx="-5" cy="0" rx="12" ry="27"/><ellipse class="a7-pat" cx="5" cy="0" rx="15" ry="31" fill="url(#a7-boneg)"/><path class="a7-hatch" d="M-2 -18l10 8M0 -2l12 -6M-2 12l11 6M4 -24l6 14M2 4l9 12"/></g>
<circle data-part="glow" class="a7-glow" r="44" fill="url(#a7-glowg)" opacity="0"/>
${monitor}
</svg>`;

const LINES = [
  "10 % fewer steps at the same pace: longer strides, a deeper knee bend on landing, and more force under the kneecap.",
  "Your usual step rate at this pace.",
  "5 % more steps at the same pace: shorter strides, a little less bend, a little less force under the kneecap.",
  "10 % more steps at the same pace: on average about 14 % less peak force under the kneecap.",
];
const PCTS = [-10, 0, 5, 10];
const DATA = { CF, RC, PCTS, lines: LINES, mon: MON };
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
