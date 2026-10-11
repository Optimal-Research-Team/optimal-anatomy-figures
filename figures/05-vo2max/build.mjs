// Fig 5 · The ramp and the cart.
//
// A generic lab-grade bike ergometer (imitating no brand): a T-foot base, seat
// and front columns, a flywheel with a magnet brake that closes on its rim as
// the ramp adds watts, a belt from the chainring. The mannequin pedals at
// 60 rpm, wearing a face mask with a one-way valve and a chest strap. Each
// breath out surges down a clear hose (one WebGL layer) into the open
// metabolic cart's mixing chamber, out through a flow turbine that spins with
// it; a sample line feeds the O₂ and CO₂ cells, and the monitor plots oxygen
// uptake against power: a straight line until the ceiling.
//
//   node build.mjs | --light | --audit
import { mkdirSync, readFileSync, writeFileSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";
import { figkit, k, G, A } from "../../shared/figkit.mjs";
import { plate, page, embed } from "../../shared/page.mjs";
import { MANNEQUIN } from "../../shared/mannequin.mjs";
import { glCamera } from "../../.claude/skills/anatomy/kit/gl.mjs";
import { glScript } from "../../.claude/skills/anatomy/scripts/inline-kit.mjs";
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
const CART = { x: 70, y: -86, w: 42, d: 40, r: 3, z0: 8, z1: 112 };
const CHAMBER = { x: 80, y: -40.5, r: 5, z0: 60, z1: 102 };
const TURBINE = { x0: 80, x1: 92, y: -40.5, z: 54, r: 3.2 };
const MONITOR = { x: 91, y: -66, w: 46, h: 31, z: 148 };

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
const HOSE = [MASK.valve, G.add3(MASK.valve, [5, -1, -4]), [44, -12, 128], [62, -28, 120], [76, -38, 114], [CHAMBER.x, CHAMBER.y, CHAMBER.z1 + 4], [CHAMBER.x, CHAMBER.y, CHAMBER.z1 + 0.6]];

const BOUNDS = [
  ...k.boxCorners({ x: -54, y: -30, w: 116, d: 60 }, 0, 0),
  ...k.boxCorners(CART, 0, CART.z1),
  [MONITOR.x - MONITOR.w / 2, MONITOR.y, MONITOR.z + MONITOR.h / 2 + 2],
  [MONITOR.x + MONITOR.w / 2, MONITOR.y, MONITOR.z + MONITOR.h / 2 + 2],
  [J0.head[0], 0, J0.head[2] + 13],
  [CART.x + CART.w + 10, -66, 0],
];
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
back.push(`<path class="iso-halo" d="${k.haloOf({ x: CART.x - 2, y: CART.y - 2, w: CART.w + 14, d: CART.d + 4, r: 6 }, 0, 0.1, P)}"/>`);
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

// ---------------------------------------------------------------- the cart: cabinet on castors, mixing chamber and turbine, analyser cells, gas cylinder, monitor
const cab = box("cart", { x: CART.x, y: CART.y, w: CART.w, d: CART.d, r: CART.r }, CART.z0, CART.z1 - CART.z0, { tone: "mid" }, {
  bevel: 0.6,
  inner: Ln(k.sideSeam(CART, 40, P, 3), { tone: "faint" }),
  extra: Dots(k.corners(CART, 3).map(([x, y]) => at([x, y, CART.z1])), { size: 0.55 }),
});
for (const [x, y] of [[CART.x + 5, CART.y + 5], [CART.x + CART.w - 5, CART.y + 5], [CART.x + 5, CART.y + CART.d - 5], [CART.x + CART.w - 5, CART.y + CART.d - 5]]) {
  cyl("cart.swivel", x, y, 2.2, 6.8, CART.z0 - 6.8, { tone: "lo" }, { steps: 14, meta: { seated: true, cut: [cab] } });
  pin("stand.castor", yF(x, y - 1.6, 3.4), 0, 3.2, 3.4, { tone: "mid" });
}
{
  // mixing chamber: a clear tube on brackets, baffles inside; the breath enters at the top
  const Fc = vframe(CHAMBER.x, CHAMBER.y, 0);
  const baffles = [70, 78, 86, 94].map((z) => G.arcOf(Fc, z, CHAMBER.r, P)).join("");
  for (const z of [66, 96]) box("chamber.bracket", { x: CHAMBER.x - 1.5, y: CART.y + CART.d - 0.01, w: 3, d: CHAMBER.y - CHAMBER.r - (CART.y + CART.d) + 0.6, r: 0.4 }, z, 2.4, { tone: "lo" }, { steps: 1, meta: { seated: true, cut: [cab] } });
  turned("chamber", Fc, [[CHAMBER.z0, CHAMBER.r], [CHAMBER.z1, CHAMBER.r]], { tone: "mid", className: "vo-glass" }, { inner: Ln(baffles, { tone: "lo" }), meta: { seated: true, cut: R.solids.filter((s) => s.name === "chamber.bracket") } });
  turned("chamber.cap", Fc, [[CHAMBER.z1, CHAMBER.r + 0.6], [CHAMBER.z1 + 1.6, CHAMBER.r + 0.6], [CHAMBER.z1 + 1.6, 2.6], [CHAMBER.z1 + 4.2, 2.6]], { tone: "lo" }, { smooth: false, meta: { seated: true, cut: [R.solids.find((s) => s.name === "chamber")] } });
  turned("chamber.foot", Fc, [[CHAMBER.z0 - 3, 2.4], [CHAMBER.z0 - 1.4, 2.4], [CHAMBER.z0 - 1.4, CHAMBER.r + 0.6], [CHAMBER.z0, CHAMBER.r + 0.6]], { tone: "lo" }, { smooth: false, meta: { seated: true, cut: [R.solids.find((s) => s.name === "chamber")] } });
  // the flow turbine: a clear housing along x below the chamber, its vane spun by the page
  const elbow = cyl("turbine.elbow", CHAMBER.x, CHAMBER.y, 2.6, TURBINE.z - 2.6, CHAMBER.z0 - 3 - (TURBINE.z - 2.6) + 0.01, { tone: "lo" }, { steps: 18, meta: { seated: true } });
  const Ft = G.frameOf([TURBINE.x0, TURBINE.y, TURBINE.z], [1, 0, 0], [0, 1, 0], [0, 0, 1]);
  turned("turbine", Ft, [[0, TURBINE.r], [TURBINE.x1 - TURBINE.x0, TURBINE.r]], { tone: "mid", className: "vo-glass" }, { extra: `<g data-part="vane"></g>`, meta: { seated: true, cut: [elbow] } });
  turned("turbine.sensor", G.frameOf([TURBINE.x1 - 3.4, TURBINE.y, TURBINE.z + TURBINE.r - 0.4], [0, 0, 1], [1, 0, 0], [0, 1, 0]), [[0, 1.6], [2.4, 1.6]], { tone: "hi" }, { meta: { seated: true, cut: [R.solids.find((s) => s.name === "turbine")] } });
}
// analyser cells on the cart's face: O₂ and CO₂, each a window with a level bar (drawn by the page)
const CELLS = [
  { name: "o2", label: "O₂", z: 86 },
  { name: "co2", label: "CO₂", z: 68 },
];
for (const c of CELLS) {
  const plan = { x: 92, y: CART.y + CART.d, w: 17, d: 1.8, r: 0.6 };
  const fy = plan.y + plan.d + 0.02;
  const m = planeMatrix([plan.x + 1.2, fy, c.z + 13.2], [1, 0, 0], [0, 0, -1]);
  const extra = `<g transform="${m}"><text class="vo-cell-label" x="0.4" y="3.2" font-size="3">${c.label}</text><rect class="vo-window" x="0" y="4.6" width="14.6" height="7" rx="0.6"/><g data-part="${c.name}"></g><rect class="iso-line" data-tone="mid" fill="none" x="0" y="4.6" width="14.6" height="7" rx="0.6"/></g>`;
  box(`cell.${c.name}`, plan, c.z, 14.4, { tone: "hi", crease: "lo" }, { steps: 2, bevel: 0.3, extra, meta: { seated: true, cut: [cab] } });
}
// the calibration gas cylinder, strapped to the cart's front end, with its regulator
{
  const gx = CART.x + CART.w + 5.6;
  const gy = -70;
  const Fg = vframe(gx, gy, 0);
  const prof = [[CART.z0, 0.01], [CART.z0 + 0.4, 4.2, 1], [CART.z0 + 3, 5.4, 1], [CART.z0 + 6, 5.6, 1], [70, 5.6, 1], [75, 4.6, 1], [78, 2.4, 1], [79, 2.2]];
  turned("gas", Fg, prof, { tone: "hi", crease: "lo" }, { inner: Ln(G.arcOf(Fg, 50, 5.6, P), { tone: "faint" }), meta: { seated: true } });
  turned("gas.valve", Fg, [[79, 1.6], [84, 1.6], [84, 2.4], [87, 2.4]], { tone: "lo" }, { smooth: false, meta: { seated: true, cut: [R.solids.find((s) => s.name === "gas")] } });
  for (const z of [26, 58]) box("gas.strap", { x: CART.x + CART.w - 0.01, y: gy - 6.2, w: 1.2 + 0.01, d: 12.4, r: 0.4 }, z, 2.6, { tone: "lo" }, { steps: 1, meta: { seated: true, cut: [cab, R.solids.find((s) => s.name === "gas")] } });
}
// monitor on a post: the live plot of oxygen uptake against power
{
  const post = cyl("monitor.post", MONITOR.x, MONITOR.y, 1.8, CART.z1, MONITOR.z - MONITOR.h / 2 - CART.z1 + 0.6, { tone: "lo" }, { steps: 16, meta: { seated: true, cut: [cab] } });
  const plan = { x: MONITOR.x - MONITOR.w / 2, y: MONITOR.y - 2, w: MONITOR.w, d: 4, r: 1.2 };
  const fy = plan.y + plan.d + 0.03;
  const o = [plan.x + 1.6, fy, MONITOR.z + MONITOR.h / 2 - 1.6];
  const m = planeMatrix(o, [1, 0, 0], [0, 0, -1]);
  const SW = MONITOR.w - 3.2;
  const SH = MONITOR.h - 3.2;
  const extra = `<g transform="${m}"><rect class="vo-screen" x="0" y="0" width="${SW}" height="${SH}" rx="0.8"/><g data-part="plot"></g><rect class="iso-line" data-tone="mid" fill="none" x="0" y="0" width="${SW}" height="${SH}" rx="0.8"/></g>`;
  box("monitor", plan, MONITOR.z - MONITOR.h / 2, MONITOR.h, { tone: "mid" }, { bevel: 0.4, extra, meta: { seated: true, cut: [post] } });
  MONITOR.screen = { w: SW, h: SH };
}
// the sample line: a thin tube from a port on the chamber to a port on top of the O₂ cell
{
  const a = F.stud("chamber.port", [CHAMBER.x + CHAMBER.r - 0.3, CHAMBER.y, 97], [1, 0, 0], { r: 0.6, boss: 1.1 });
  const b = F.stud("cell.port", [100, CART.y + CART.d + 0.9, 86 + 14.4 - 0.3], [0, 0, 1], { r: 0.6, boss: 1.1 });
  F.cable("sample", [a, [a[0] + 4, a[1], a[2]], [b[0], b[1], b[2] + 5], b], 0.45, { tone: "lo", bend: 2.4 });
}

// ---------------------------------------------------------------- assemble: the bike and cart, then the rider, then the hose over everything
const groups = F.assemble();
// the hose: clear tubing from the mask valve to the chamber cap, drawn after the rider (nothing passes in front of it)
const hoseRoute = G.fillet(HOSE, 6, 10, { P, tube: 1.8 });
const hosePieces = (await import("../../.claude/skills/anatomy/kit/tube.mjs")).tubePieces(hoseRoute, 1.8, P, { maxLength: 14, spacing: 1.4 });
const { tubeSvg } = await import("../../.claude/skills/anatomy/kit/tube.mjs");
const hoseSvg = `<g class="vo-hose">${hosePieces.map((pc) => tubeSvg(pc, { tone: "mid" })).join("")}</g>`;
const hoseLine = G.resample(hoseRoute, 4);
const fallback = k.lineSvg(k.pathOf(hoseLine.map((p) => k.iso(p, P))), { tone: "lit", flow: true, className: "vo-fallback", free: true });
const svg = k.figureSvg({
  width: W,
  height: H,
  label:
    "A generic lab exercise bike with a wooden artist's mannequin pedalling it, wearing a face mask and a chest strap. A clear hose carries each breath out to an open metabolic cart: into a mixing chamber, out through a flow turbine that spins with each breath, with a sample line to oxygen and carbon dioxide cells. A magnet brake closes on the bike's flywheel as the ramp adds watts. The cart's monitor plots oxygen uptake against power: a straight line that flattens at the person's ceiling, the VO2max.",
  body: [...back, ...groups, `<g data-part="brake"></g>`, `<g data-part="runner"></g>`, hoseSvg, fallback],
});

// the hose's centreline for the shader: projected to the viewBox, with arc length in cm
const HOSE_GL = (() => {
  const pts = G.resample(hoseRoute, G.pathLength(hoseRoute) / 23);
  let s = 0;
  const out = pts.map((p, i) => {
    if (i) s += G.len3(G.sub3(p, pts[i - 1]));
    const v = k.iso(p, P);
    return [v[0], v[1], s];
  });
  return out.slice(0, 24);
})();

const DATA = { P, B, W, H, camera: glCamera(P), mask: { base: MASK.base, face: MASK.face, axis: MASK.axis }, bike: { bb: BB, fly: FLY, crank: M.BIKE.crank, hipX: M.BIKE.hip[0] }, chamber: CHAMBER, turbine: TURBINE, monitor: MONITOR, hose: HOSE_GL, hoseR: 1.8 };
const strip = (src) => src.replace(/^import .*$/gm, "").replace(/^export /gm, "");
const MODEL_SRC = strip(readFileSync(join(HERE, "model.mjs"), "utf8"));
const MANNEQUIN_SRC = strip(readFileSync(join(ROOT, "shared/mannequin.mjs"), "utf8"));
const VIEW_SRC = readFileSync(join(ROOT, "shared/mannequin-view.js"), "utf8");
const latheSource = strip(readFileSync(join(ROOT, ".claude/skills/anatomy/kit/lathe.mjs"), "utf8"));
const LATHE = `const G = (() => {${latheSource}\nreturn { frameOf, frameAlong, prismOf, pointOf, solidOf, sphereOf, circleOf, arcOf };})();\n`;
const LIVE = readFileSync(join(HERE, "live.js"), "utf8").replace("__DATA__", JSON.stringify(DATA));
const SCRIPT = `${glScript()}\n${LATHE}\n${MANNEQUIN_SRC}\n${MODEL_SRC}\n${VIEW_SRC}\n${LIVE}`;
const CSS = readFileSync(join(ROOT, "shared/mannequin.css"), "utf8") + readFileSync(join(HERE, "figure.css"), "utf8");

const T35 = M.testOf(35);
const CAPTION = [
  `On a ramp test the bike's brake adds a few watts every couple of seconds while you keep pedalling. Each extra watt costs about 10 ml of oxygen a minute, so oxygen use climbs in a straight line, a little behind the power, until the heart and muscles can't deliver or use any more. That ceiling is VO₂max. A fitter body reaches a higher ceiling and more watts, but climbs the same slope.`,
  `The cart measures every breath: a turbine counts the air breathed out, and two cells read how much oxygen it lost and carbon dioxide it gained. Near the top, carbon dioxide out overtakes oxygen in, and the ratio of the two (RER) passes 1.0.`,
  `In 122,007 adults who had treadmill exercise tests, the least fit group had about five times the death rate of the fittest 2–3 % over a median of 8.4 years. That's an association between fitness and survival, not a promise that training will change anyone's risk by that much.`,
  `<small>A typical pattern for one modelled person (45 years, 75 kg), not a prediction. Many people stop before a clear plateau; their top value is called VO₂peak. Bike values run about 13–22 % below treadmill values, so compare a bike result with bike norms (in a large registry, the median on a bike was 41.9 ml/kg/min for men in their 20s and 19.5 in their 70s; for women, 31.0 and 14.8). Heart rates are typical for age and vary by 10 bpm or more.</small>`,
]
  .map((p) => `<span class="vo-par">${p}</span>`)
  .join("");
const fmt = (min) => `${Math.floor(min)}:${String(Math.round((min % 1) * 60) % 60).padStart(2, "0")}`;
const body = plate({
  fig: "Fig 5",
  title: "The ramp and the cart",
  hint: "Pick a VO₂max ceiling · drag or play",
  stats: [
    { key: "w", label: "Power", value: "0 W" },
    { key: "hr", label: "Heart rate", value: `${M.TRUTH.hrRest} bpm` },
    { key: "vo2", label: "VO₂", value: `${M.TRUTH.rest.toFixed(1)} ml/kg/min` },
    { key: "rer", label: "RER", value: M.TRUTH.rer.rest.toFixed(2) },
  ],
  controls: [{ name: "ceiling", label: "VO₂max ceiling, ml/kg/min", options: M.TRUTH.ceilings.map((c) => ({ value: String(c), label: `${c}`, pressed: c === 35 })) }],
  keys: [
    { mark: "lit", label: "Each breath out, down the hose" },
    { mark: "raised", label: "Bike brake, turbine and gas cells" },
    { mark: "heat", label: "Oxygen uptake against power" },
  ],
  caption: CAPTION,
  body: `<div class="iso-stage vo-stage" tabindex="0" role="slider" aria-label="Minutes into the test. Left and right arrows move 15 seconds, Page Up and Down a minute, Space plays or pauses." aria-valuemin="0" aria-valuemax="${T35.total.toFixed(1)}" aria-valuenow="0" aria-valuetext="0:00, at rest">${svg}<canvas class="vo-gl" aria-hidden="true"></canvas><svg xmlns="http://www.w3.org/2000/svg" class="iso-svg vo-front" viewBox="0 0 ${W} ${H}" aria-hidden="true"></svg></div><div class="vo-scrub"><button type="button" class="vo-play" data-play aria-label="Play">Play</button><input type="range" class="vo-range" min="0" max="${T35.total.toFixed(2)}" step="0.05" value="0" aria-label="Minutes into the test"><span class="vo-clock" data-clock aria-hidden="true">${fmt(0)}</span></div><span class="vo-sr" role="status" aria-live="polite" data-status></span>`,
});
const out = THEME === "light" ? `${SLUG}-light.html` : `${SLUG}.html`;
writeFileSync(join(HERE, out), page({ title: "The ramp and the cart", theme: THEME, body, css: CSS, script: SCRIPT }));
if (THEME === "light") {
  mkdirSync(join(HERE, "embed"), { recursive: true });
  writeFileSync(join(HERE, "embed", `optimal-fig-${SLUG}.js`), embed({ tag: `optimal-fig-${SLUG}`, body, script: SCRIPT, css: CSS }));
}
console.log("wrote", out, `${R.items.length} items`, `${R.solids.length} solids`, `scale ${KS.toFixed(3)}`, `H ${H}`, `hipZ ${B.hipZ.toFixed(1)}`, `hose ${G.pathLength(hoseRoute).toFixed(0)} cm`);
A.auditOrExit(R, P, {});
void put;
void S;
