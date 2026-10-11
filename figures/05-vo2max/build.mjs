// Fig 5 · The ramp and the mask.
//
// A generic lab-grade bike ergometer (imitating no brand): a T-foot base, seat
// and front columns, a flywheel with a magnet brake that closes on its rim as
// the ramp adds watts, a belt from the chainring. The mannequin pedals at
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
const FLY = { x: 40, y: 12, z: 40, r: 20, t: 3.4 }; // flywheel, near side, outboard of its belt pulley
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
  ...k.boxCorners({ x: -54, y: -30, w: 116, d: 60 }, 0, 0),
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
const { R, at, S, Ln, Dots, path3, vframe, planeMatrix, put, box, cyl, turned, pin, prism } = F;
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

// ---------------------------------------------------------------- floor shadow and the bike's base
back.push(`<path class="iso-halo" d="${k.haloOf({ x: -56, y: -32, w: 120, d: 64, r: 10 }, 0, 0.1, P)}"/>`);
const footR = box("stand.footR", { x: -54, y: -28, w: 10, d: 56, r: 3 }, 0, 5, { tone: "mid" }, { bevel: 0.4 });
const footF = box("stand.footF", { x: 50, y: -26, w: 10, d: 52, r: 3 }, 0, 5, { tone: "mid" }, { bevel: 0.4 });
const beam = box("beam", { x: -50, y: -4, w: 106, d: 8, r: 2 }, 5, 6, { tone: "mid" }, { bevel: 0.4, inner: Ln(k.sideSeam({ x: -50, y: -4, w: 106, d: 8, r: 2 }, 8, P, 2), { tone: "faint" }) });

// ---------------------------------------------------------------- seat column, saddle
const SADDLE_Z = B.hipZ - 9.5; // saddle base; its top sits just under the pelvis
const SEAT = { foot: [-12, 0, 11], top: [-22, 0, SADDLE_Z - 4] };
{
  const { F: Fs, length } = along(SEAT.foot, SEAT.top);
  prism("seat.column", Fs, [[-3, -2.6], [3, -2.6], [3, 2.6], [-3, 2.6]], 0, length, { tone: "mid" }, { meta: { seated: true, cut: [beam] } });
  const z0 = SADDLE_Z;
  cyl("seat.clamp", SEAT.top[0], 0, 3.4, z0 - 4, 4, { tone: "lo" }, { steps: 20, meta: { seated: true, cut: [R.solids.find((s) => s.name === "seat.column")] } });
  // the saddle: a wedge, wide at the back, a narrow nose forward
  const ring = [[-33, -7], [-27, -8], [-18, -5.5], [-4, -2.2], [0, 0], [-4, 2.2], [-18, 5.5], [-27, 8], [-33, 7], [-35, 0]];
  prism("saddle", vframe(0, 0, z0), ring, 0, 3.6, { tone: "hi", crease: "lo" }, { meta: { seated: true, cut: [R.solids.find((s) => s.name === "seat.clamp")] } });
}

// ---------------------------------------------------------------- bottom bracket, chainring, belt; flywheel and its fork
const bbHouse = box("bb.house", { x: -6, y: -6, w: 12, d: 12, r: 2 }, 11, BB[2] - 4 - 11 + 0.6, { tone: "mid" }, { steps: 2, meta: { seated: true, cut: [beam] } });
pin("bb.shell", yF(BB[0], -7, BB[2]), 0, 14, 4.2, { tone: "lo" }, { meta: { seated: true, cut: [bbHouse] } });
turned("chainring", yF(BB[0], 7, BB[2]), [[0, 10.5], [1.2, 10.5]], { tone: "hi", crease: "lo" }, { inner: Ln(G.circleOf(yF(BB[0], 7, BB[2]), 1.2, 7.5, P), { tone: "lo" }), meta: { seated: true } });
const FRONT = { foot: [44, 0, 11], top: [46, 0, 100] };
{
  const { F: Ff, length } = along(FRONT.foot, FRONT.top);
  prism("front.column", Ff, [[-3.2, -2.8], [3.2, -2.8], [3.2, 2.8], [-3.2, 2.8]], 0, length, { tone: "mid" }, { meta: { seated: true, cut: [beam] } });
}
const column = R.solids.find((s) => s.name === "front.column");
const xCol = (z) => FRONT.foot[0] + ((FRONT.top[0] - FRONT.foot[0]) * (z - FRONT.foot[2])) / (FRONT.top[2] - FRONT.foot[2]);
pin("fly.axle", yF(xCol(FLY.z), 2.8, FLY.z), 0, FLY.y - FLY.t / 2 - 2.8, 1.6, { tone: "lo" }, { meta: { seated: true, cut: [column] } });
{
  const Fw = yF(FLY.x, FLY.y - FLY.t / 2, FLY.z);
  const rim = G.circleOf(yF(FLY.x, FLY.y + FLY.t / 2 + 0.01, FLY.z), 0, FLY.r - 3, P);
  turned("flywheel", Fw, [[0, FLY.r], [FLY.t, FLY.r]], { tone: "hi", crease: "lo" }, { inner: Ln(rim, { tone: "lo" }), extra: `<g data-part="flyspin"></g>`, meta: { seated: true, cut: [R.solids.find((s) => s.name === "fly.axle")] } });
  pin("fly.hub", yF(FLY.x, FLY.y + FLY.t / 2, FLY.z), 0, 1.6, 4, { tone: "mid" }, { meta: { seated: true } });
  pin("fly.pulley", yF(FLY.x, 7, FLY.z), 0, 1.2, 4, { tone: "lo" }, { meta: { seated: true, cut: [R.solids.find((s) => s.name === "fly.axle")] } });
}
// the belt: two straight runs from the chainring to the hub pulley, near side
{
  const y = 7.6;
  const r1 = 10.5;
  const r2 = 4;
  const d = Math.hypot(FLY.x - BB[0], FLY.z - BB[2]);
  const base = Math.atan2(FLY.z - BB[2], FLY.x - BB[0]);
  const off = Math.acos((r1 - r2) / d);
  const runs = [1, -1].map((s) => {
    const a = base + s * off;
    return path3([[BB[0] + r1 * Math.cos(a), y, BB[2] + r1 * Math.sin(a)], [FLY.x + r2 * Math.cos(a), y, FLY.z + r2 * Math.sin(a)]]);
  });
  back.push(`<g data-part="belt">${Ln(runs.join(""), { tone: "mid", free: true })}</g>`);
}

// ---------------------------------------------------------------- handlebar, stem, power head; the brake arm (the magnets are drawn by the page)
const stem = cyl("stem", FRONT.top[0], 0, 2.2, FRONT.top[2], M.BIKE.grip[1] - FRONT.top[2] - 1.6, { tone: "lo" }, { steps: 16, meta: { seated: true, cut: [column] } });
{
  const gy = M.BIKE.grip[2];
  const bar = pin("handlebar", yF(M.BIKE.grip[0], -gy + 5, M.BIKE.grip[1]), 0, 2 * gy - 10, 1.6, { tone: "lo" }, { meta: { seated: true, cut: [stem] } });
  for (const s of [-1, 1]) pin(`grip${s > 0 ? "L" : "R"}`, yF(M.BIKE.grip[0], s > 0 ? gy - 5 : -gy - 5, M.BIKE.grip[1]), 0, 10, 2.4, { tone: "hi", crease: "lo" }, { meta: { seated: true, cut: [bar] } });
  // the power head on the stem: its screen faces the rider (the cart shows the same watts)
  box("power.head", { x: FRONT.top[0] - 7, y: -9, w: 10, d: 18, r: 2 }, M.BIKE.grip[1] + 1.4, 7, { tone: "mid" }, { bevel: 0.4, meta: { seated: true, cut: [bar, stem] }, extra: Dots([at([FRONT.top[0] + 3.02, -5, M.BIKE.grip[1] + 6]), at([FRONT.top[0] + 3.02, 5, M.BIKE.grip[1] + 6])], { size: 0.6, tone: "lit" }) });
}
{
  // brake arm from the column to the magnet carriage above the flywheel's rear rim
  const z = FLY.z + FLY.r + 9;
  const x0 = xCol(z);
  const { F: Fa, length } = along([x0, 0, z], [FLY.x - 13, FLY.y, z]);
  prism("brake.arm", Fa, [[-1.4, -1.2], [1.4, -1.2], [1.4, 1.2], [-1.4, 1.2]], 0, length, { tone: "lo" }, { meta: { seated: true, cut: [column] } });
}

// ---------------------------------------------------------------- assemble: the bike, then the rider, then the assessor (nearest, off to the side)
const groups = F.assemble();
const AS = assessorSvg(P, { at: ASSESSOR.at, heading: ASSESSOR.heading, part: "tablet" });
const svg = k.figureSvg({
  width: W,
  height: H,
  label:
    "A generic lab exercise bike with a wooden artist's mannequin pedalling it, wearing a face mask with a small wireless breath analyser on the front. A magnet brake closes on the bike's flywheel as the ramp adds watts. Beside the bike an assessor stands holding a tablet, which plots the oxygen the rider uses against the watts: a straight line that flattens at the person's ceiling, the VO2max.",
  body: [...back, ...groups, `<g data-part="brake"></g>`, `<g data-part="runner"></g>`, AS.svg],
});

const DATA = { P, B, W, H, mask: { base: MASK.base, face: MASK.face, axis: MASK.axis }, bike: { bb: BB, fly: FLY, crank: M.BIKE.crank, hipX: M.BIKE.hip[0] }, screen: AS.screen };
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
  `On a ramp test the bike's brake adds a few watts every couple of seconds while you keep pedalling. Each extra watt costs about 10 ml of oxygen a minute, so oxygen use climbs in a straight line, a little behind the power, until the heart and muscles can't deliver or use any more. That ceiling is VO₂max. A fitter body reaches a higher ceiling and more watts, but climbs the same slope.`,
  `The analyser on the mask measures every breath, how much air goes out and how much oxygen it has lost, and sends it wirelessly to the assessor's tablet. Nothing tethers you to a cart.`,
  `In 122,007 adults who had treadmill exercise tests, the least fit group had about five times the death rate of the fittest 2–3 % over a median of 8.4 years. That's an association between fitness and survival, not a promise that training will change anyone's risk by that much.`,
  `<small>A typical pattern for one modelled person (45 years, 75 kg), not a prediction. Many people stop before a clear plateau; their top value is called VO₂peak. Bike values run about 13–22 % below treadmill values, so compare a bike result with bike norms (in a large registry, the median on a bike was 41.9 ml/kg/min for men in their 20s and 19.5 in their 70s; for women, 31.0 and 14.8). Heart rates are typical for age and vary by 10 bpm or more.</small>`,
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
    { key: "vo2", label: "VO₂", value: `${M.TRUTH.rest.toFixed(1)} ml/kg/min` },
  ],
  controls: [{ name: "ceiling", label: "VO₂max ceiling, ml/kg/min", options: M.TRUTH.ceilings.map((c) => ({ value: String(c), label: `${c}`, pressed: c === 35 })) }],
  keys: [
    { mark: "lit", label: "The mask's analyser, blinking each breath" },
    { mark: "raised", label: "The bike's magnet brake" },
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
