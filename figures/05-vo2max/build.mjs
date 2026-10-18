// Fig 5 · The ramp and the mask.
//
// A smart training bike in the proportions of the clinic's (a large covered
// flywheel at the rear under the saddle, a slim raked frame, drop bars; no
// brand's styling). Power shows as an arc growing on the flywheel cover. The mannequin pedals at
// 60 rpm wearing a wireless breath analyser on its mask (it measures each
// breath's flow and oxygen and sends it by Bluetooth); no hose, no cart. The
// assessor stands beside the bike with a tablet that plots oxygen uptake
// against power: a straight line until the ceiling.
//
//   node build.mjs | --light | --audit
import { mkdirSync, readFileSync, writeFileSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";
import { figkit, k, G, A } from "../../shared/figkit.mjs";
import { plate, page, embed } from "../../shared/page.mjs";
import { MANNEQUIN } from "../../shared/mannequin.mjs";
import { assessorSvg } from "../../shared/assessor.mjs";
import * as M from "./model.mjs";

const HERE = dirname(fileURLToPath(import.meta.url));
const ROOT = join(HERE, "../..");
const THEME = process.argv.includes("--light") ? "light" : "dark";
const SLUG = "vo2max";
const W = 600;
const AZIMUTH = 50;
const ELEVATION = 22;

// ---------------------------------------------------------------- layout (cm, z up; the rider faces +x, +y is the rider's left)
const BB = [0, 0, M.BIKE.bb[1]]; // bottom bracket
const FLY = { x: -45, y: 0, z: 33, r: 24, t: 10 }; // flywheel disc low at the back (≈ 48 cm across)
const RAD = Math.PI / 180;
const ASSESSOR = { at: [92, -52], heading: 186 }; // standing beside the bike, turned to read the tablet

const B = { ...MANNEQUIN.BODY };
B.hipZ = M.saddleOf(B);
const pose0 = M.riderAt(0.6, B);
const J0 = MANNEQUIN.skeletonOf({ base: [M.BIKE.hip[0], 0, 0], pelvis: pose0.pelvis, trunk: pose0.trunk, legs: shiftLegs(pose0.legs), arms: pose0.arms });
function shiftLegs(legs) {
  const out = {};
  for (const [k2, L] of Object.entries(legs)) out[k2] = { ...L, hip: [L.hip[0] - M.BIKE.hip[0], L.hip[1]], knee: [L.knee[0] - M.BIKE.hip[0], L.knee[1]], ankle: [L.ankle[0] - M.BIKE.hip[0], L.ankle[1]] };
  return out;
}
// the face and the mask's valve, from the head's own axis
const headAxis = G.unit3(G.sub3(J0.head, J0.chin));
const face = G.unit3(G.sub3([1, 0, 0], G.mul3(headAxis, G.dot3([1, 0, 0], headAxis))));
const MASK = { base: G.add3(G.add3(J0.head, G.mul3(face, 6.4)), G.mul3(headAxis, -4.6)), face, axis: headAxis };
MASK.valve = G.add3(MASK.base, G.mul3(face, 8.4));

const BOUNDS = [
  ...k.boxCorners({ x: -70, y: -32, w: 134, d: 64 }, 0, 0),
  [J0.head[0], 0, J0.head[2] + 13],
  [ASSESSOR.at[0] - 22, ASSESSOR.at[1] - 22, 0],
  [ASSESSOR.at[0] + 22, ASSESSOR.at[1] + 22, 0],
  [ASSESSOR.at[0] - 20, ASSESSOR.at[1] - 20, 178],
  [ASSESSOR.at[0] + 20, ASSESSOR.at[1] + 20, 178],
]
// the assessor's joints are world positions: add them (with a body's margin) to the bounds
{
  const J = assessorSvg(k.fitProjection(BOUNDS, W, 600, { azimuth: AZIMUTH, elevation: ELEVATION }), { at: ASSESSOR.at, heading: ASSESSOR.heading }).J;
  for (const v of Object.values(J)) if (Array.isArray(v) && v.length === 3 && typeof v[0] === "number") for (const d of [[9, 0, 0], [-9, 0, 0], [0, 9, 0], [0, -9, 0], [0, 0, 10]]) BOUNDS.push(G.add3(v, d));
}
const probe = k.fitProjection(BOUNDS, W, 2000, { pad: 8, azimuth: AZIMUTH, elevation: ELEVATION });
const flat = BOUNDS.map((p) => k.iso(p, probe));
const H = Math.ceil(Math.max(...flat.map((p) => p[1])) - Math.min(...flat.map((p) => p[1])) + 16);
const P = k.fitProjection(BOUNDS, W, H, { pad: 8, azimuth: AZIMUTH, elevation: ELEVATION });
const F = figkit(P);
const { R, at, S, Ln, Dots, path3, vframe, planeMatrix, put, box, cyl, turned, pin, prism, cable } = F;
const KS = G.scaleOf(P);
const back = [];
const yF = (x, y, z) => G.frameOf([x, y, z], [0, 1, 0], [1, 0, 0], [0, 0, 1]); // axis along +y
const along = (a, b) => {
  const d = G.sub3(b, a);
  const ax = G.unit3(d);
  const side = Math.abs(ax[1]) > 0.9 ? [1, 0, 0] : [0, 1, 0];
  const u = G.unit3(G.sub3(side, G.mul3(ax, G.dot3(side, ax))));
  return { F: G.frameOf(a, ax, u, G.cross3(ax, u)), length: G.len3(d) };
};

// ---------------------------------------------------------------- a smart training bike in the clinic bike's proportions (no brand's
// styling): a large vented flywheel disc low at the back, a tapered drive case running forward to a
// round crank cover, a post up to a heavy horizontal top beam, the seat post at its back end and
// drop bars off its front, all on a long base bar with crossbar feet. Power shows as an arc on the
// flywheel's face.
back.push(`<path class="iso-halo" d="${k.haloOf({ x: -70, y: -34, w: 136, d: 68, r: 12 }, 0, 0.1, P)}"/>`);
const footR = box("stand.rear", { x: FLY.x - 7, y: -30, w: 14, d: 60, r: 4 }, 0, 5.4, { tone: "lo" }, { bevel: 0.4, inner: Ln(k.sideSeam({ x: FLY.x - 7, y: -30, w: 14, d: 60, r: 4 }, 2.7, P, 1.6), { tone: "faint" }) });
const footF = box("stand.front", { x: 50, y: -28, w: 12, d: 56, r: 4 }, 0, 5.4, { tone: "lo" }, { bevel: 0.4, inner: Ln(k.sideSeam({ x: 50, y: -28, w: 12, d: 56, r: 4 }, 2.7, P, 1.6), { tone: "faint" }) });
box("stand.bar", { x: FLY.x + 7, y: -3.6, w: 50 - (FLY.x + 7), d: 7.2, r: 1.2 }, 0, 4.6, { tone: "lo" }, { bevel: 0.4, inner: Ln(k.sideSeam({ x: FLY.x + 7, y: -3.6, w: 50 - (FLY.x + 7), d: 7.2, r: 1.2 }, 2.3, P, 1.2), { tone: "faint" }) });
const post = cyl("fly.post", FLY.x, 0, 4, 5, FLY.z - FLY.r - 4.4, { tone: "lo" }, { steps: 18, meta: { seated: true, cut: [footR] } });

// the flywheel disc: deep, rounded, vented slats on its upper rear quarter
const ff = FLY.t / 2 + 0.02;
// a vent panel (the disc face minus the drive case's corner) filled with slats that end on its edge
const RV = FLY.r - 5.5;
const inPanel = (x, z) => x < -4 && z > -6;
let panel = Array.from({ length: 144 }, (_, i) => [RV * Math.cos((i / 144) * 2 * Math.PI), RV * Math.sin((i / 144) * 2 * Math.PI)]);
for (const [nx, nz, c] of [[1, 0, -4], [0, -1, 6]]) {
  // keep nx·x + nz·z ≤ c
  const out = [];
  panel.forEach((p0, i) => {
    const p1 = panel[(i + 1) % panel.length];
    const f0 = nx * p0[0] + nz * p0[1] - c;
    const f1 = nx * p1[0] + nz * p1[1] - c;
    if (f0 <= 0) out.push(p0);
    if (f0 * f1 < 0) out.push([p0[0] + ((p1[0] - p0[0]) * f0) / (f0 - f1), p0[1] + ((p1[1] - p0[1]) * f0) / (f0 - f1)]);
  });
  panel = out;
}
const toFace = ([x, z]) => [FLY.x + x, ff, FLY.z + z];
let slats = path3([...panel, panel[0]].map(toFace));
{
  const d = [Math.cos(55 * RAD), Math.sin(55 * RAD)];
  const n = [-d[1], d[0]];
  for (let o = -15.6; o <= 15.6; o += 2.6) {
    // the slat's span: inside the circle and both half-planes, solved exactly so its ends sit on the panel's edge
    const half = Math.sqrt(Math.max(0, RV * RV - o * o));
    let t0 = -half;
    let t1 = half;
    t1 = Math.min(t1, (-4 - n[0] * o) / d[0]);
    t0 = Math.max(t0, (-6 - n[1] * o) / d[1]);
    if (t1 - t0 < 2) continue;
    slats += path3([toFace([n[0] * o + d[0] * t0, n[1] * o + d[1] * t0]), toFace([n[0] * o + d[0] * t1, n[1] * o + d[1] * t1])]);
  }
}
const HOUSING = turned("fly.housing", yF(FLY.x, -FLY.t / 2, FLY.z), [[0, FLY.r - 1.8], [1, FLY.r - 0.2, 1], [2, FLY.r, 1], [FLY.t - 2, FLY.r, 1], [FLY.t - 1, FLY.r - 0.2, 1], [FLY.t, FLY.r - 1.8]], { tone: "lo", crease: "mid" }, {
  steps: 72,
  inner: Ln(slats, { tone: "faint" }),
  meta: { seated: true, cut: [post] },
});

// the drive case: a tapered body from the flywheel's centre to a round end around the bottom bracket
// outline in (forward, up) relative to the bottom bracket: from the flywheel's centre to a round end
const CASE = [[FLY.x - 4, 6], [FLY.x + 6, 11], [-9, 10.5], ...Array.from({ length: 9 }, (_, i) => {
  const a = (110 - i * 27.5) * RAD;
  return [12.5 * Math.cos(a), 12.5 * Math.sin(a)];
}), [-9, -11.5], [FLY.x + 6, -9], [FLY.x - 4, -5]];
const bbHouse = box("bb.house", { x: -11, y: -6, w: 22, d: 11, r: 4 }, BB[2] - 12, 22, { tone: "mid" }, { bevel: 0.4, meta: { seated: true } });
const drive = prism("drive.case", G.frameOf([0, FLY.t / 2, BB[2]], [0, 1, 0], [1, 0, 0], [0, 0, 1]), CASE, 0, 10 - FLY.t / 2, { tone: "mid", crease: "lo" }, { meta: { seated: true } });
pin("bb.stub", yF(BB[0], -12.6, BB[2]), 0, 6.6, 2.6, { tone: "lo" }, { meta: { seated: true, cut: [bbHouse] } });
turned("crank.cover", yF(BB[0], 10, BB[2]), [[0, 11.2], [0.6, 11.6, 1], [1.4, 11.2]], { tone: "hi", crease: "lo" }, { inner: Ln(G.circleOf(yF(BB[0], 11.42, BB[2]), 0, 8, P), { tone: "faint" }), extra: `<g data-part="flyspin"></g>`, meta: { seated: true, cut: [drive] } });

// the post and the top beam, seat post through its back end, two adjuster knobs on top
const BEAM_Z = SADDLE_Z_OF(B) - 17;
function SADDLE_Z_OF(b) {
  return b.hipZ - 9.5;
}
const column = box("frame.post", { x: -9, y: -3.6, w: 9, d: 7.2, r: 1.6 }, BB[2] + 10, BEAM_Z - BB[2] - 10, { tone: "mid" }, { bevel: 0.3, meta: { seated: true } });
const beam = box("frame.beam", { x: -26, y: -3.8, w: 62, d: 7.6, r: 1.8 }, BEAM_Z, 8, { tone: "mid" }, { bevel: 0.4, meta: { seated: true }, inner: Ln(k.sideSeam({ x: -26, y: -3.8, w: 62, d: 7.6, r: 1.8 }, BEAM_Z + 4, P, 2.2), { tone: "faint" }) });
for (const [x, nm] of [[-12, "knobS"], [24, "knobB"]]) cyl(`frame.${nm}`, x, 0, 1.6, BEAM_Z + 7.6, 3.2, { tone: "lo" }, { steps: 14, meta: { seated: true, cut: [beam] } });

// seat post and saddle
const SADDLE_Z = SADDLE_Z_OF(B); // saddle base; its top sits just under the pelvis
const SEAT = { foot: [-21, 0, BEAM_Z - 11], top: [-21, 0, SADDLE_Z - 4] };
{
  cyl("seat.slider", SEAT.foot[0], 0, 2, SEAT.foot[2], BEAM_Z - SEAT.foot[2], { tone: "lo" }, { steps: 16, meta: { seated: true } });
  const sp = cyl("seat.post", SEAT.foot[0], 0, 2, BEAM_Z + 8, SEAT.top[2] - BEAM_Z - 8, { tone: "lo" }, { steps: 16, meta: { seated: true } });
  const z0 = SADDLE_Z;
  cyl("seat.clamp", SEAT.top[0], 0, 2.8, z0 - 4, 4, { tone: "lo" }, { steps: 20, meta: { seated: true, cut: [sp] } });
  const ring = [[-33, -7], [-27, -8], [-18, -5.5], [-4, -2.2], [0, 0], [-4, 2.2], [-18, 5.5], [-27, 8], [-33, 7], [-35, 0]];
  prism("saddle", vframe(0, 0, z0), ring, 0, 3.6, { tone: "lo", crease: "mid" }, { meta: { seated: true, cut: [R.solids.find((s2) => s2.name === "seat.clamp")] } });
}

// the riser from the beam's front end up to the bars; drop bars with hoods
const gx = M.BIKE.grip[0];
const gz = M.BIKE.grip[1];
const gy = M.BIKE.grip[2];
const RISER = { foot: [33, 0, BEAM_Z + 4], top: [gx - 1, 0, gz - 1.2] };
const riser = (() => {
  const { F: Fr, length } = along(RISER.foot, RISER.top);
  return prism("riser", Fr, [[-2.4, -2.2], [2.4, -2.2], [2.4, 2.2], [-2.4, 2.2]], 0, length, { tone: "mid" }, { meta: { seated: true, cut: [beam] } });
})();
{
  const bar = pin("handlebar", yF(gx, -gy - 1, gz), 0, 2 * gy + 2, 1.4, { tone: "lo" }, { meta: { seated: true, cut: [riser] } });
  for (const s2 of [-1, 1]) {
    const y = s2 * (gy + 1);
    box(`hood${s2 > 0 ? "L" : "R"}`, { x: gx + 0.4, y: y - 2.2, w: 5.2, d: 4.4, r: 0.6 }, gz - 1, 4.4, { tone: "lo" }, { bevel: 0.3, meta: { seated: true, cut: [bar] } });
    // the drop: forward off the hood, curling down and back, as one smooth bent tube
    // a bar-end plug closes the drop
    const { F: Fp } = along([gx + 1.4, y, gz - 11.8], [gx - 2, y, gz - 11.8]);
    pin(`plug${s2 > 0 ? "L" : "R"}`, Fp, 0, 1.4, 1.5, { tone: "mid" }, { steps: 14, meta: { seated: true, ground: true } });
    cable(`drop${s2 > 0 ? "L" : "R"}`, [[gx + 5.6, y, gz + 1.2], [gx + 7.4, y, gz + 1.2], [gx + 9.8, y, gz - 2.4], [gx + 9.4, y, gz - 10], [gx + 4.2, y, gz - 11.8], [gx + 1.4, y, gz - 11.8]], 1.3, { tone: "lo", bend: 2.6 });
  }
}

// ---------------------------------------------------------------- assemble: the bike, then the rider, then the assessor (nearest, off to the side)
const groups = F.assemble();
const AS = assessorSvg(P, { at: ASSESSOR.at, heading: ASSESSOR.heading, part: "tablet" });
const svg = k.figureSvg({
  width: W,
  height: H,
  label:
    "A smart training bike with a large covered flywheel at the rear, and a wooden artist's mannequin pedalling it, wearing a face mask with a small wireless breath analyser on the front. A glowing arc on the flywheel cover grows as the ramp adds watts. Beside the bike an assessor stands holding a tablet, which plots the oxygen the rider uses against the watts: a straight line that flattens at the person's ceiling, the VO2max.",
  body: [...back, ...groups, `<g data-part="power"></g>`, `<g data-part="runner"></g>`, AS.svg],
});

const DATA = { P, B, W, H, mask: { base: MASK.base, face: MASK.face, axis: MASK.axis }, bike: { bb: BB, fly: FLY, cover: { x: BB[0], y: 11.43, z: BB[2], r: 6.2 }, crank: M.BIKE.crank, hipX: M.BIKE.hip[0] }, screen: AS.screen };
const strip = (src) => src.replace(/^import .*$/gm, "").replace(/^export /gm, "");
const MODEL_SRC = strip(readFileSync(join(HERE, "model.mjs"), "utf8"));
const MANNEQUIN_SRC = strip(readFileSync(join(ROOT, "shared/mannequin.mjs"), "utf8"));
const VIEW_SRC = readFileSync(join(ROOT, "shared/mannequin-view.js"), "utf8") + readFileSync(join(ROOT, "shared/vo2-plot.js"), "utf8");
const latheSource = strip(readFileSync(join(ROOT, ".claude/skills/anatomy/kit/lathe.mjs"), "utf8"));
const LATHE = `const G = (() => {${latheSource}\nreturn { frameOf, frameAlong, prismOf, pointOf, solidOf, sphereOf, circleOf, arcOf };})();\n`;
const LIVE = readFileSync(join(HERE, "live.js"), "utf8").replace("__DATA__", JSON.stringify(DATA));
const SCRIPT = `${LATHE}\n${MANNEQUIN_SRC}\n${MODEL_SRC}\n${VIEW_SRC}\n${LIVE}`;
const CSS = readFileSync(join(ROOT, "shared/mannequin.css"), "utf8") + readFileSync(join(ROOT, "shared/assessor.css"), "utf8") + readFileSync(join(HERE, "figure.css"), "utf8");

const T35 = M.testOf(35);
const CAPTION = [
  `On a ramp test the smart bike's brake adds a few watts every couple of seconds while you keep pedalling. Each extra watt costs about 10 mL of oxygen a minute, so oxygen use climbs in a straight line, a little behind the power, until the heart and muscles can't deliver or use any more. That ceiling is VO₂max. A fitter body reaches a higher ceiling and more watts, but climbs the same slope.`,
  `The analyser on the mask measures every breath, how much air goes out and how much oxygen it has lost, and sends it wirelessly to the assessor's tablet. Nothing tethers you to a cart.`,
  `In 122,007 adults who had treadmill exercise tests, the least fit group had about five times the death rate of the fittest 2–3 % over a median of 8.4 years. That's an association between fitness and survival, not a promise that training will change anyone's risk by that much.`,
  `<small>A typical pattern for one modelled person (45 years, 75 kg), not a prediction. Many people stop before a clear plateau; their top value is called VO₂peak. Bike values run about 13–22 % below treadmill values, so compare a bike result with bike norms (in a large registry, the median on a bike was 41.9 mL/kg/min for men in their 20s and 19.5 in their 70s; for women, 31.0 and 14.8). Heart rates are typical for age and vary by 10 bpm or more.</small>`,
]
  .map((p) => `<span class="vo-par">${p}</span>`)
  .join("");
const fmt = (min) => `${Math.floor(min)}:${String(Math.round((min % 1) * 60) % 60).padStart(2, "0")}`;
const body = plate({
  fig: "Fig 5",
  title: "The ramp and the mask",
  hint: "Pick a VO₂max ceiling · drag or play",
  stats: [
    { key: "w", label: "Power", value: "0 W" },
    { key: "hr", label: "Heart rate", value: `${M.TRUTH.hrRest} bpm` },
    { key: "vo2", label: "VO₂", value: `${M.TRUTH.rest.toFixed(1)} mL/kg/min` },
  ],
  controls: [{ name: "ceiling", label: "VO₂max ceiling, mL/kg/min", options: M.TRUTH.ceilings.map((c) => ({ value: String(c), label: `${c}`, pressed: c === 35 })) }],
  keys: [
    { mark: "lit", label: "The mask's analyser, blinking each breath" },
    { mark: "raised", label: "Power, as an arc on the flywheel cover" },
    { mark: "heat", label: "Oxygen uptake against power, on the tablet" },
  ],
  caption: CAPTION,
  body: `<div class="iso-stage vo-stage" tabindex="0" role="slider" aria-label="Minutes into the test. Left and right arrows move 15 seconds, Page Up and Down a minute, Space plays or pauses." aria-valuemin="0" aria-valuemax="${T35.total.toFixed(1)}" aria-valuenow="0" aria-valuetext="0:00, at rest">${svg}</div><div class="vo-scrub"><button type="button" class="vo-play" data-play aria-label="Play">Play</button><input type="range" class="vo-range" min="0" max="${T35.total.toFixed(2)}" step="0.05" value="0" aria-label="Minutes into the test"><span class="vo-clock" data-clock aria-hidden="true">${fmt(0)}</span></div><span class="vo-sr" role="status" aria-live="polite" data-status></span>`,
});
const out = THEME === "light" ? `${SLUG}-light.html` : `${SLUG}.html`;
writeFileSync(join(HERE, out), page({ title: "The ramp and the mask", theme: THEME, body, css: CSS, script: SCRIPT }));
if (THEME === "light") {
  mkdirSync(join(HERE, "embed"), { recursive: true });
  writeFileSync(join(HERE, "embed", `optimal-fig-${SLUG}.js`), embed({ tag: `optimal-fig-${SLUG}`, body, script: SCRIPT, css: CSS }));
}
console.log("wrote", out, `${R.items.length} items`, `${R.solids.length} solids`, `scale ${KS.toFixed(3)}`, `H ${H}`, `facing away ${AS.facingAway}`);
A.auditOrExit(R, P, {});
void put;
void S;
