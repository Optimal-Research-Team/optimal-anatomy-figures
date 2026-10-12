// A4 · The beating heart (anatomical series).
//
// The heart cut open front to back, in isometric 3-D: the front half is taken away, the cut face
// shows the chambers, and the back half keeps its round outer wall (and each great vessel its
// half-tube), redrawn live so it beats with the rest. On the cut face: right atrium and ventricle (oxygen-poor blood, blue),
// left atrium and the thick-walled left ventricle (oxygen-rich, red), the four valves with
// their chordae and papillary muscles, the great vessels and the arch's three branches. The
// page redraws it every frame from the beat model: chambers squeeze, walls thicken, the valve
// plane is pulled toward the apex, valves snap open and shut, blood moves only through open
// valves, and an ECG strip runs underneath.
//
//   node build.mjs | --light
import { mkdirSync, readFileSync, writeFileSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";
import { plate, page, embed } from "../../shared/page.mjs";
import { figkit, k } from "../../shared/figkit.mjs";
import * as M from "./model.mjs";

const HERE = dirname(fileURLToPath(import.meta.url));
const THEME = process.argv.includes("--light") ? "light" : "dark";
const SLUG = "heart";
const W = 600;

// ---------------------------------------------------------------- geometry (front view; the person's right is on the viewer's left)
const geo = {
  AVY: 262,
  APEXY: 522,
  OUT: [[140, 150], [121, 190], [116, 236], [128, 272], [148, 302], [156, 342], [176, 394], [214, 442], [268, 482], [326, 510], [378, 524], [420, 510], [452, 472], [474, 412], [484, 342], [482, 290], [490, 250], [492, 200], [480, 158], [450, 136], [405, 130], [360, 142], [330, 168], [300, 182], [262, 176], [230, 158], [196, 140], [164, 138]],
  RA: [[150, 162], [133, 198], [134, 240], [152, 268], [190, 282], [228, 276], [244, 240], [236, 198], [212, 168], [180, 156]],
  LA: [[352, 172], [376, 150], [420, 144], [458, 156], [468, 190], [458, 226], [428, 246], [384, 250], [356, 234], [346, 202]],
  RV: [[204, 290], [182, 322], [186, 382], [216, 430], [262, 460], [304, 466], [318, 440], [316, 380], [306, 322], [298, 272], [292, 232], [286, 218], [260, 218], [262, 248], [250, 288]],
  LV: [[332, 254], [360, 258], [396, 268], [430, 274], [446, 312], [446, 372], [434, 428], [410, 468], [384, 476], [358, 450], [342, 398], [334, 330], [330, 290]],
  TRI: [[206, 288], [248, 288]],
  MIT: [[374, 266], [428, 274]],
  PUL: [[260, 218], [286, 218]],
  AOR: [[332, 254], [360, 258]],
  TRIc: [227, 292],
  MITc: [400, 272],
  PULc: [273, 214],
  AORc: [346, 252],
  RAin: [186, 214],
  LAin: [412, 196],
  PAPR: [236, 418],
  PAPL: [[376, 432], [422, 424]],
  PULout: [[[284, 142], [404, 128], [440, 132]], [[284, 142], [196, 116], [140, 120]]],
  AORout: [[[338, 120], [356, 72], [410, 52], [452, 70], [470, 112], [478, 160]], [[338, 120], [356, 72], [376, 58], [372, 0]], [[338, 120], [356, 72], [408, 50], [412, -4]]],
};
// ---------------------------------------------------------------- the camera: the cut face in the A-series view
// World: x = section x, y = toward the viewer (the cut is the plane y = DEP), z = up (−section y).
const DEP = 200;
const S3 = (sx, y, sy) => [sx, y, -sy];
const RAD = Math.PI / 180;
const cen = geo.OUT.reduce((a, p) => [a[0] + p[0] / geo.OUT.length, a[1] + p[1] / geo.OUT.length], [0, 0]);
// what the cut face reaches: the heart's outline and every vessel (centrelines ± half their width)
const VESSEL_PTS = [[158, -12], [166, 60], [84, 384], [108, 330], [470, 110], [494, 470], [356, 72], [410, 52], [452, 70], [376, 60], [372, 14], [412, 8], [456, 18], [284, 140], [404, 128], [150, 120], [566, 168], [566, 214]];
const BOUNDS3 = [...geo.OUT, ...VESSEL_PTS.flatMap(([x, y]) => [[x - 20, y - 20], [x + 20, y + 20]])].map(([x, y]) => S3(x, DEP, y));
// the far half's rim can reach beyond the outline: bound it with the outline rolled back 30° and 60°
geo.OUT.forEach((p, i, a) => {
  const pr = a[(i - 1 + a.length) % a.length];
  const nx = a[(i + 1) % a.length];
  const l = Math.hypot(nx[0] - pr[0], nx[1] - pr[1]) || 1;
  const n = [(nx[1] - pr[1]) / l, -(nx[0] - pr[0]) / l];
  const rho = 0.9 * Math.hypot(p[0] - cen[0], p[1] - cen[1]);
  for (const ph of [30, 60]) BOUNDS3.push(S3(p[0] - n[0] * (1 - Math.cos(ph * RAD)) * rho, DEP - Math.sin(ph * RAD) * rho * 0.95, p[1] - n[1] * (1 - Math.cos(ph * RAD)) * rho));
});
const PB = k.fitProjection(BOUNDS3, W, 600, { pad: 10, azimuth: 62, elevation: 24 });
const HEART_BOTTOM = Math.max(...BOUNDS3.map((p) => k.iso(p, PB)[1]));
const FB = figkit(PB);
const FRONT_M = FB.planeMatrix(S3(0, DEP, 0), [1, 0, 0], [0, 0, -1]);
const o2 = k.iso(S3(0, DEP, 0), PB);
const ex = k.iso(S3(1, DEP, 0), PB).map((v, i) => v - o2[i]);
const ey = k.iso(S3(0, DEP, 1), PB).map((v, i) => v - o2[i]);
const b1 = k.iso(S3(0, DEP - 1, 0), PB).map((v, i) => v - o2[i]);
const det = ex[0] * ey[1] - ey[0] * ex[1];
const WD1 = [(b1[0] * ey[1] - ey[0] * b1[1]) / det, (ex[0] * b1[1] - b1[0] * ex[1]) / det].map((v) => +v.toFixed(4));
const ECG = { x0: 40, w: 520, y: Math.ceil(HEART_BOTTOM + 52), h: 34, span: 2.2 };
const VH = ECG.y + 24;
const LINES = [
  "Resting: about one beat a second, most of it spent filling.",
  "Walking briskly: faster beats, and each beat empties more fully.",
  "Running: the filling time shrinks; the squeeze barely does.",
  "All out, about the top rate for a 45-year-old: little time to fill, but each beat is near its biggest.",
];

const svg = `<svg class="iso-svg a4-svg" viewBox="0 0 ${W} ${VH}" role="img" aria-label="The heart cut open front to back and seen in 3-D, beating; the back half keeps its round outer wall. Oxygen-poor blood (blue) comes in through the venae cavae to the right atrium, passes the tricuspid valve into the right ventricle and leaves through the pulmonary valve for the lungs. Oxygen-rich blood (red) returns through the pulmonary veins to the left atrium, passes the mitral valve into the thick-walled left ventricle and leaves through the aortic valve into the aorta. An ECG trace runs underneath.">
<defs>
  <radialGradient id="a4-muscle" cx="38%" cy="34%" r="72%"><stop offset="0" class="a4-m0"/><stop offset="0.65" class="a4-m1"/><stop offset="1" class="a4-m2"/></radialGradient>
  <radialGradient id="a4-glow-g" cx="50%" cy="50%" r="50%"><stop offset="0" class="a4-g0"/><stop offset="1" class="a4-g1"/></radialGradient>
</defs>
<g transform="${FRONT_M}"><g class="a4-far" data-part="far"></g></g>
<g class="a4-front" transform="${FRONT_M}">
<ellipse data-part="glow" class="a4-glow" cx="312" cy="350" rx="230" ry="215" fill="url(#a4-glow-g)"/>
<clipPath id="a4-muscleclip"><path data-part="outerClip"/></clipPath>
<g data-v="rpa"></g><g data-v="pv"></g><g data-v="ivc"></g><g data-v="desc"></g><g data-v="svc"></g>
<path class="a4-muscle" data-part="outer" fill="url(#a4-muscle)"/>
<g clip-path="url(#a4-muscleclip)"><path class="a4-fibre" data-part="fibres"/></g>
<path class="a4-ven a4-pool" data-part="ra"/><path class="a4-ven a4-pool" data-part="rv"/>
<path class="a4-art a4-pool" data-part="la"/><path class="a4-art a4-pool" data-part="lv"/>
<path class="a4-chordae" data-part="chordae"/>
<path class="a4-pap" data-part="pap"/>
<path class="a4-valve" data-part="valves"/>
<g data-v="branches"></g><g data-v="aorta"></g><g data-v="pt"></g>
<path class="a4-cell a4-cell-ven" data-part="cellsR"/><path class="a4-pal a4-pal-ven" data-part="palR"/>
<path class="a4-cell a4-cell-art" data-part="cellsL"/><path class="a4-pal a4-pal-art" data-part="palL"/>
</g>
<rect class="a4-ecg-bg" x="${ECG.x0 - 16}" y="${ECG.y - 44}" width="${ECG.w + 32}" height="60" rx="8"/>
<path class="a4-ecg-base" d="M${ECG.x0} ${ECG.y}H${ECG.x0 + ECG.w}"/>
<path class="a4-ecg" data-part="ecg"/><circle class="a4-ecg-dot" data-part="ecgdot" r="3"/>
</svg>`;

const DATA = { geo, ecg: ECG, lines: LINES, far: { w: WD1, A: 62, E: 24, dep: DEP } };
const strip = (src) => src.replace(/^import .*$/gm, "").replace(/^export /gm, "");
const SCRIPT = `${strip(readFileSync(join(HERE, "model.mjs"), "utf8"))}\n${readFileSync(join(HERE, "../../shared/round-back.js"), "utf8")}\n${readFileSync(join(HERE, "live.js"), "utf8").replace("__DATA__", JSON.stringify(DATA))}`;
const CSS = readFileSync(join(HERE, "figure.css"), "utf8");
const v60 = M.volumesOf(60);
const v176 = M.volumesOf(176);
const CAPTION = [
  `Each beat starts with a small squeeze of the two upper chambers, the atria. Then the two lower chambers, the ventricles, contract together: the valves between upper and lower chambers snap shut, pressure builds, and the outflow valves open. The right side sends oxygen-poor blood (blue) to the lungs; the thick-walled left side sends oxygen-rich blood (red) to the whole body.`,
  `At rest, about ${Math.round(v60.sv)} ml leaves each ventricle per beat, ${v60.co.toFixed(1)} litres a minute. Flat out, the heart beats about three times as often and empties more fully with each beat, so its output rises to roughly ${Math.round(v176.co)} litres a minute. That is the delivery side of VO₂max.`,
  `<small>Typical adult values (end of filling ≈ 120 ml, end of ejection ≈ 50 ml at rest); individual hearts differ. Blue and red follow the textbook convention: venous blood is dark red, not blue. As the ventricles squeeze, the valve plane is pulled toward the tip of the heart, which draws blood into the atria at the same time. The ECG is a drawing timed to the beat.</small>`,
]
  .map((p) => `<span class="a4-par">${p}</span>`)
  .join("");
const body = plate({
  fig: "A4",
  title: "The beating heart",
  hint: "Pick a heart rate · Slow to watch the valves",
  stats: [
    { key: "hr", label: "Heart rate", value: "60 bpm" },
    { key: "sv", label: "Per beat", value: `${Math.round(v60.sv)} ml` },
    { key: "co", label: "Per minute", value: `${v60.co.toFixed(1)} L/min` },
  ],
  controls: [{ name: "rate", label: "Heart rate", options: [["60", "Rest"], ["100", "Walk"], ["140", "Run"], ["176", "All out"]].map(([value, label], i) => ({ value, label, pressed: i === 0 })) }],
  keys: [
    { mark: "lit", label: "Valves" },
    { mark: "heat", label: "Oxygen-rich blood, left side" },
    { mark: "raised", label: "Heart muscle" },
  ],
  caption: CAPTION,
  body: `<div class="iso-stage a4-stage">${svg}</div><div class="a4-row"><p class="a4-scene" data-scene>${LINES[0]}</p><button type="button" class="a4-slow" data-slow aria-pressed="false">Slow</button></div><span class="a4-sr" role="status" aria-live="polite" data-status></span>`,
});
const out = THEME === "light" ? `${SLUG}-light.html` : `${SLUG}.html`;
writeFileSync(join(HERE, out), page({ title: "The beating heart", theme: THEME, body, css: CSS, script: SCRIPT }));
if (THEME === "light") {
  mkdirSync(join(HERE, "embed"), { recursive: true });
  writeFileSync(join(HERE, "embed", `optimal-fig-${SLUG}.js`), embed({ tag: `optimal-fig-${SLUG}`, body, script: SCRIPT, css: CSS }));
}
console.log("wrote", out);
