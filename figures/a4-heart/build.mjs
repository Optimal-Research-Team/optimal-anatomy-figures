// A4 · The beating heart (anatomical series).
//
// The heart cut open from the front: right atrium and ventricle (oxygen-poor blood, blue),
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
import * as M from "./model.mjs";

const HERE = dirname(fileURLToPath(import.meta.url));
const THEME = process.argv.includes("--light") ? "light" : "dark";
const SLUG = "heart";
const W = 600;
const H = 640;

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
const ECG = { x0: 40, w: 520, y: 600, h: 34, span: 2.2 };
const LINES = [
  "Resting: about one beat a second, most of it spent filling.",
  "Walking briskly: faster beats, and each beat empties more fully.",
  "Running: the filling time shrinks; the squeeze barely does.",
  "All out, about the top rate for a 45-year-old: little time to fill, but each beat is near its biggest.",
];

const tubeStatic = (pts, w) => {
  // a simple vessel for the parts that never move (built here, drawn behind the heart)
  const L = [];
  const R = [];
  for (let i = 0; i < pts.length; i++) {
    const a = pts[Math.max(0, i - 1)];
    const b = pts[Math.min(pts.length - 1, i + 1)];
    let nx = -(b[1] - a[1]);
    let ny = b[0] - a[0];
    const l = Math.hypot(nx, ny);
    nx /= l;
    ny /= l;
    L.push([pts[i][0] + (nx * w) / 2, pts[i][1] + (ny * w) / 2]);
    R.push([pts[i][0] - (nx * w) / 2, pts[i][1] - (ny * w) / 2]);
  }
  return `M${[...L, ...R.reverse()].map((p) => `${p[0].toFixed(1)} ${p[1].toFixed(1)}`).join("L")}Z`;
};

const svg = `<svg class="iso-svg a4-svg" viewBox="0 0 ${W} ${H}" role="img" aria-label="The heart cut open from the front, beating. Oxygen-poor blood (blue) comes in through the venae cavae to the right atrium, passes the tricuspid valve into the right ventricle and leaves through the pulmonary valve for the lungs. Oxygen-rich blood (red) returns through the pulmonary veins to the left atrium, passes the mitral valve into the thick-walled left ventricle and leaves through the aortic valve into the aorta. An ECG trace runs underneath.">
<defs>
  <radialGradient id="a4-muscle" cx="38%" cy="34%" r="72%"><stop offset="0" class="a4-m0"/><stop offset="0.65" class="a4-m1"/><stop offset="1" class="a4-m2"/></radialGradient>
  <radialGradient id="a4-glow-g" cx="50%" cy="50%" r="50%"><stop offset="0" class="a4-g0"/><stop offset="1" class="a4-g1"/></radialGradient>
</defs>
<ellipse data-part="glow" class="a4-glow" cx="312" cy="350" rx="230" ry="215" fill="url(#a4-glow-g)"/>
<path class="a4-art a4-vessel" d="${tubeStatic([[470, 110], [480, 170], [484, 250]], 34)}"/>
<path class="a4-ven a4-vessel" data-part="rpa"/>
<path class="a4-art a4-vessel" data-part="pv"/>
<path class="a4-ven a4-vessel" data-part="ivc"/>
<path class="a4-muscle" data-part="outer" fill="url(#a4-muscle)"/>
<path class="a4-ven a4-pool" data-part="ra"/><path class="a4-ven a4-pool" data-part="rv"/>
<path class="a4-art a4-pool" data-part="la"/><path class="a4-art a4-pool" data-part="lv"/>
<path class="a4-chordae" data-part="chordae"/>
<path class="a4-pap" data-part="pap"/>
<path class="a4-valve" data-part="valves"/>
<path class="a4-ven a4-vessel" data-part="svc"/>
<path class="a4-art a4-vessel" data-part="branches"/>
<path class="a4-art a4-vessel" data-part="aorta"/>
<path class="a4-ven a4-vessel" data-part="pt"/>
<g class="a4-cells-ven" data-part="cellsR"></g><g class="a4-cells-art" data-part="cellsL"></g>
<rect class="a4-ecg-bg" x="${ECG.x0 - 16}" y="${ECG.y - 44}" width="${ECG.w + 32}" height="60" rx="8"/>
<path class="a4-ecg-base" d="M${ECG.x0} ${ECG.y}H${ECG.x0 + ECG.w}"/>
<path class="a4-ecg" data-part="ecg"/><circle class="a4-ecg-dot" data-part="ecgdot" r="3"/>
</svg>`;

const DATA = { geo, ecg: ECG, lines: LINES };
const strip = (src) => src.replace(/^import .*$/gm, "").replace(/^export /gm, "");
const SCRIPT = `${strip(readFileSync(join(HERE, "model.mjs"), "utf8"))}\n${readFileSync(join(HERE, "live.js"), "utf8").replace("__DATA__", JSON.stringify(DATA))}`;
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
