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
  LA: [[378, 170], [398, 150], [430, 144], [460, 156], [470, 190], [460, 226], [432, 246], [400, 250], [380, 234], [372, 202]], // clear of the ascending aorta, which rises in front of it
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
  // cells leave through the vessels' cut ends, never past them
  PULout: [[[284, 142], [362, 120], [398, 127]], [[284, 142], [196, 116], [156, 120]]],
  AORout: [[[338, 120], [356, 72], [410, 52], [452, 70], [470, 112], [478, 160]], [[338, 120], [356, 72], [376, 58], [373, 18]], [[338, 120], [356, 72], [408, 50], [411, 14]]],
};
// ---------------------------------------------------------------- the camera: a three-quarter view, so the heart reads as a solid
// World: x = section x, y = toward the viewer (the cut is the plane y = DEP), z = up (−section y).
// A4 turns further than the series camera (azimuth 40° instead of 62°): the cut face is seen at an angle and
// the heart's round back half shows as a large solid volume (Peter: "the heart needs to be MORE three dimensional").
const AZ = 40;
const EL = 26;
const DEP = 260;
const S3 = (sx, y, sy) => [sx, y, -sy];
const RAD = Math.PI / 180;
const cen = geo.OUT.reduce((a, p) => [a[0] + p[0] / geo.OUT.length, a[1] + p[1] / geo.OUT.length], [0, 0]);
// the great vessels as whole tubes in 3-D: [section x, section y, depth behind the cut]
const V3 = [
  { name: "desc", cls: "art", r: [17, 16], caps: [false, true], behind: true, pts: [[470, 112, 128], [480, 160, 146], [488, 260, 156], [494, 380, 158], [496, 470, 158]] },
  { name: "rpa", cls: "ven", r: [12, 11], caps: [false, true], pts: [[296, 128, 24], [262, 118, 52], [214, 114, 72], [156, 120, 86]] },
  { name: "rspv", cls: "art", r: [9, 9], caps: [true, false], pts: [[568, 168, 74], [520, 170, 68], [466, 178, 60]] },
  { name: "ripv", cls: "art", r: [9, 9], caps: [true, false], pts: [[568, 214, 74], [520, 214, 68], [464, 212, 60]] },
  { name: "ivc", cls: "ven", r: [20, 19], caps: [true, false], pts: [[84, 388, 48], [106, 334, 46], [140, 280, 44]] },
  { name: "aorta", cls: "art", r: [20, 18], caps: [false, false], pts: [[346, 252, 40], [342, 196, 40], [338, 132, 42], [348, 84, 50], [392, 56, 74], [438, 62, 102], [466, 98, 124], [470, 114, 130]] },
  { name: "bca", cls: "art", r: [8, 7], caps: [false, true], pts: [[368, 70, 56], [366, 38, 56], [364, 12, 56]] },
  { name: "lcca", cls: "art", r: [7, 6.5], caps: [false, true], pts: [[404, 60, 80], [406, 32, 80], [408, 8, 80]] },
  { name: "lsca", cls: "art", r: [7, 6.5], caps: [false, true], pts: [[436, 68, 100], [444, 42, 100], [452, 18, 100]] },
  { name: "svc", cls: "ven", r: [19, 21], caps: [true, false], pts: [[160, -12, 34], [166, 60, 36], [174, 120, 40], [180, 176, 42]] },
  { name: "pt", cls: "ven", r: [18, 16], caps: [false, false], pts: [[273, 214, 18], [276, 186, 16], [282, 150, 16], [296, 128, 24]] },
  { name: "lpa", cls: "ven", r: [12, 11], caps: [false, true], pts: [[296, 128, 24], [330, 116, 30], [370, 114, 52], [404, 126, 72]] },
];
const FLOOR_Y = 556;
const BOUNDS3 = [...geo.OUT.map(([x, y]) => S3(x, DEP, y))];
for (const v of V3) for (const [x, y, d] of v.pts) for (const o of [-1, 1]) BOUNDS3.push(S3(x + o * v.r[0], DEP - d, y + o * v.r[0]));
// the back half: the outline rolled back over a quarter-round (as live.js draws it)
const OUT_SIGN = (() => {
  let a = 0;
  geo.OUT.forEach((p, i, arr) => (a += p[0] * arr[(i + 1) % arr.length][1] - arr[(i + 1) % arr.length][0] * p[1]));
  return a > 0 ? 1 : -1; // outward normals for this winding (section y points down), as live.js finds them
})();
geo.OUT.forEach((p, i, a) => {
  const pr = a[(i - 1 + a.length) % a.length];
  const nx = a[(i + 1) % a.length];
  const l = Math.hypot(nx[0] - pr[0], nx[1] - pr[1]) || 1;
  const n = [(OUT_SIGN * (nx[1] - pr[1])) / l, (-OUT_SIGN * (nx[0] - pr[0])) / l];
  const rho = 0.92 * Math.hypot(p[0] - cen[0], p[1] - cen[1]);
  for (const ph of [20, 40, 60, 90]) BOUNDS3.push(S3(p[0] - n[0] * (1 - Math.cos(ph * RAD)) * rho, DEP - Math.sin(ph * RAD) * rho * 0.85, p[1] - n[1] * (1 - Math.cos(ph * RAD)) * rho));
});
const PB = k.fitProjection(BOUNDS3, W, 690, { pad: 6, azimuth: AZ, elevation: EL });
const HEART_BOTTOM = Math.max(...BOUNDS3.map((p) => k.iso(p, PB)[1]));
const FB = figkit(PB);
const FRONT_M = FB.planeMatrix(S3(0, DEP, 0), [1, 0, 0], [0, 0, -1]);
const o2 = k.iso(S3(0, DEP, 0), PB);
const ex = k.iso(S3(1, DEP, 0), PB).map((v, i) => v - o2[i]);
const ey = k.iso(S3(0, DEP, 1), PB).map((v, i) => v - o2[i]);
const b1 = k.iso(S3(0, DEP - 1, 0), PB).map((v, i) => v - o2[i]);
const det = ex[0] * ey[1] - ey[0] * ex[1];
const WD1 = [(b1[0] * ey[1] - ey[0] * b1[1]) / det, (ex[0] * b1[1] - b1[0] * ex[1]) / det].map((v) => +v.toFixed(4));
// the monitor: ECG, the left ventricle's volume, and when the valves are open (all from the beat model)
const MT = Math.ceil(HEART_BOTTOM + 14);
const MON = {
  top: MT, x0: 168, w: 392, span: 2.4,
  ecg: { y: MT + 44, h: 28 },
  vol: { y: MT + 112, h: 48, lo: 15, hi: 145 },
  inR: { y: MT + 128, h: 9 },
  outR: { y: MT + 146, h: 9 },
};
const VH = MT + 170 + 6;
const LINES = [
  "Resting: about one beat a second, most of it spent filling.",
  "Walking briskly: faster beats, and each beat empties more fully.",
  "Running: the filling time shrinks; the squeeze barely does.",
  "All out, about the top rate for a 45-year-old: little time to fill, but each beat is near its biggest.",
];

const svg = `<svg class="iso-svg a4-svg" viewBox="0 0 ${W} ${VH}" role="img" aria-label="The heart cut open front to back and seen in 3-D, beating: deep chambers with ridged walls, papillary muscles and cords holding the valve leaflets, and a round back half lined with its own vessels. Oxygen-poor blood (blue) comes in through the venae cavae to the right atrium, passes the tricuspid valve into the right ventricle and leaves through the pulmonary valve for the lungs. Oxygen-rich blood (red) returns through the pulmonary veins to the left atrium, passes the mitral valve into the thick-walled left ventricle and leaves through the aortic valve into the aorta. A monitor underneath runs the ECG, the left ventricle's volume and when the valves are open.">
<defs>
  <radialGradient id="a4-muscle" cx="38%" cy="34%" r="72%"><stop offset="0" class="a4-m0"/><stop offset="0.65" class="a4-m1"/><stop offset="1" class="a4-m2"/></radialGradient>
  <radialGradient id="a4-glow-g" cx="50%" cy="50%" r="50%"><stop offset="0" class="a4-g0"/><stop offset="1" class="a4-g1"/></radialGradient>
</defs>
<g transform="${FRONT_M}"><path class="a4-floor" data-part="floor"/><g data-part="behind"></g></g>
<g transform="${FRONT_M}"><g class="a4-far" data-part="far"></g></g>
<g transform="${FRONT_M}"><g data-part="vessels"></g></g>
<g class="a4-front" transform="${FRONT_M}">
<defs>
  <mask id="a4-cutmask" maskUnits="userSpaceOnUse" x="-200" y="-200" width="1000" height="1000"><rect x="-200" y="-200" width="1000" height="1000" fill="#fff"/><path data-part="holes" fill="#000"/></mask>
  <clipPath id="a4-muscleclip"><path data-part="outerClip"/></clipPath>
  <clipPath id="a4-clipRA"><path data-part="clipRA"/></clipPath><clipPath id="a4-clipLA"><path data-part="clipLA"/></clipPath>
  <clipPath id="a4-clipRV"><path data-part="clipRV"/></clipPath><clipPath id="a4-clipLV"><path data-part="clipLV"/></clipPath>
  <clipPath id="a4-clipAll"><path data-part="clipAll"/></clipPath>
  <radialGradient id="a4-cutg" gradientUnits="userSpaceOnUse" cx="300" cy="300" r="260"><stop offset="0" class="a4-c0"/><stop offset="1" class="a4-c1"/></radialGradient>
</defs>
<g class="a4-cav" data-part="cav"></g>
<g mask="url(#a4-cutmask)">
  <path class="a4-cut" data-part="outer" fill="url(#a4-cutg)"/>
  <g clip-path="url(#a4-muscleclip)"><path class="a4-fibre" data-part="fibres"/></g>
</g>
<path class="a4-open-rim" data-part="rims"/>
<path class="a4-annulus" data-part="annuli"/>
<g clip-path="url(#a4-clipAll)"><path class="a4-valve" data-part="valves"/></g>
</g>
<g class="a4-mon">
<rect class="a4-ecg-bg" x="24" y="${MON.top}" width="552" height="170" rx="10"/>
<text class="a4-mon-label" x="40" y="${MON.ecg.y - 6}">ECG</text>
<text class="a4-mon-label" x="40" y="${MON.vol.y - 26}">Left ventricle</text>
<text class="a4-mon-num" x="40" y="${MON.vol.y - 4}" data-part="volnow">120 ml</text>
<text class="a4-mon-label" x="40" y="${MON.inR.y + 9}">Valves in</text>
<text class="a4-mon-label" x="40" y="${MON.outR.y + 9}">Valves out</text>
<path class="a4-ecg-base" d="M${MON.x0} ${MON.ecg.y}H${MON.x0 + MON.w}M${MON.x0} ${MON.vol.y}H${MON.x0 + MON.w}M${MON.x0} ${MON.vol.y - MON.vol.h}H${MON.x0 + MON.w}"/>
<path class="a4-bar-track" d="M${MON.x0} ${MON.inR.y}H${MON.x0 + MON.w}V${MON.inR.y + MON.inR.h}H${MON.x0}ZM${MON.x0} ${MON.outR.y}H${MON.x0 + MON.w}V${MON.outR.y + MON.outR.h}H${MON.x0}Z"/>
<path class="a4-bar-in" data-part="barIn"/><path class="a4-bar-out" data-part="barOut"/>
<path class="a4-vol" data-part="vol"/><circle class="a4-vol-dot" data-part="voldot" r="3.2"/>
<path class="a4-ecg" data-part="ecg"/><circle class="a4-ecg-dot" data-part="ecgdot" r="3"/>
</g>
</svg>`;

const DATA = { geo, v3: V3, floorY: FLOOR_Y, mon: MON, lines: LINES, far: { w: WD1, A: AZ, E: EL, dep: DEP } };
const strip = (src) => src.replace(/^import .*$/gm, "").replace(/^export /gm, "");
const SCRIPT = `${strip(readFileSync(join(HERE, "model.mjs"), "utf8"))}\n${readFileSync(join(HERE, "../../shared/round-back.js"), "utf8")}\n${readFileSync(join(HERE, "live.js"), "utf8").replace("__DATA__", JSON.stringify(DATA))}`;
const CSS = readFileSync(join(HERE, "figure.css"), "utf8");
const v60 = M.volumesOf(60);
const v176 = M.volumesOf(176);
const CAPTION = [
  `Each beat starts with a small squeeze of the two upper chambers, the atria. Then the two lower chambers, the ventricles, contract together: the valves between upper and lower chambers snap shut, pressure builds, and the outflow valves open. The right side sends oxygen-poor blood (blue) to the lungs; the thick-walled left side sends oxygen-rich blood (red) to the whole body. Cords inside the ventricles (chordae) tie the valve leaflets to small muscles in the walls, so the valves hold shut instead of blowing back into the atria. The monitor below tracks the ECG, the left ventricle's volume and when each set of valves is open.`,
  `At rest, about ${Math.round(v60.sv)} ml leaves each ventricle per beat, ${v60.co.toFixed(1)} litres a minute. Flat out, the heart beats about three times as often and empties more fully with each beat, so its output rises to roughly ${Math.round(v176.co)} litres a minute. That is the delivery side of VO₂max.`,
  `<small>Typical adult values (end of filling ≈ 120 ml, end of ejection ≈ 50 ml at rest); individual hearts differ. Blue and red follow the textbook convention: venous blood is dark red, not blue. As the ventricles squeeze, the valve plane is pulled toward the tip of the heart, which draws blood into the atria at the same time. The ECG is a drawing timed to the beat. The chambers' depth, the muscle ridges and the swirl of blood as the left ventricle fills are drawn, not measured.</small>`,
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
