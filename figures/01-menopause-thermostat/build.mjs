// Fig 1 · The narrowing thermostat.
//
// A bench regulator. A sealed capsule (the body's core) pushes a lit column up
// and down past a temperature scale. Two contact jaws ride a lead screw beside
// it: the upper jaw is the sweating threshold, the lower jaw the shivering
// threshold, and the gap between them is the thermoneutral zone. The estrogen
// knob on top turns the screw and closes the jaws. When the column's finger
// touches the upper jaw the circuit closes: the radiator's louvres open (skin
// vasodilation), the skin and heart-rate dials swing up, and the column then
// falls below where it started (the after-chill), which with a narrow zone
// can touch the lower jaw too.
//
//   node build.mjs            -> menopause-thermostat.html (Forest night)
//   node build.mjs --light    -> menopause-thermostat-light.html (Cream)
//   node build.mjs --audit    -> also prove the geometry
import { mkdirSync, readFileSync, writeFileSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";
import * as k from "../../.claude/skills/anatomy/kit/iso-kit.mjs";
import * as G from "../../.claude/skills/anatomy/kit/lathe.mjs";
import * as A from "../../.claude/skills/anatomy/kit/audit.mjs";
import { tubePieces, tubeSvg } from "../../.claude/skills/anatomy/kit/tube.mjs";
import { plate, page, embed } from "../../shared/page.mjs";
import * as M from "./model.mjs";

const HERE = dirname(fileURLToPath(import.meta.url));
const THEME = process.argv.includes("--light") ? "light" : "dark";
const SLUG = "menopause-thermostat";

const W = 600;
const H = 560;
const AZIMUTH = 55;
const ELEVATION = 30;

// ---------------------------------------------------------------- layout (world units, z up)
const PLATE = { x: -160, y: -46, w: 320, d: 96, r: 9 };
const PLATE_H = 10;
const FOOT_H = 5;

// Temperature change from rest to height on the column: KZ units per °C, ZREF at rest.
const KZ = 300;
const ZREF = 100;
const zOf = (t) => ZREF + t * KZ;

const CAN = { x: -98, y: 10 };
const GLAND = 46;
const ROD_R = 2.6;
const T_LOW = M.RANGE.low;
const T_HIGH = M.RANGE.high;
const Z_LOW = zOf(T_LOW);
const Z_HIGH = zOf(T_HIGH);
const TRAVEL = Z_HIGH - Z_LOW;

const UP = { x: -70, w: 52 }; // upright base and bridge span in x
const UP_TOP = 214;
const SCREW = [-44, 2.6];
const JAW_X = -74; // contact buttons and finger pads
const ZONE_PRE = M.zoneOf(1);
const ZONE_POST = M.zoneOf(0);
const JAW_TRAVEL = zOf(ZONE_PRE.sweat) - zOf(ZONE_POST.sweat); // upper jaw moves down by this from pre to post
const JAW_TRAVEL_L = zOf(ZONE_POST.shiver) - zOf(ZONE_PRE.shiver); // lower jaw moves up

const BOARD = { x: -144, y: 4, w: 20, d: 3, r: 0.8 };
const BOARD_Z = [8, 214];

const RAD = { x0: 30, x1: 146, post: 7, y0: -22, y1: 0, top: 128 };
const PIVOT_Y = -8;
const SLATS = Array.from({ length: 8 }, (_, i) => 22 + i * 14);
const SLAT_W = 15.4;
const SLAT_T = 1.4;
const SLAT_OPEN = 60; // degrees at full vasodilation

const RELAY = { x: -18, y: -6, w: 26, d: 24, r: 3 };
const RELAY_H = 16;
const CONSOLE = { x: 40, y: 12, w: 96, d: 26, r: 3 };
const CONSOLE_H = 12;
const DIALS = { skin: [64, 25], hr: [112, 25] };
const DIAL_R = 10;
const DIAL_Z = CONSOLE_H + 5;
const SOL = { x: 152.5, y: -10.5, r: 4.4, z0: 6, h: 14 };
const BAR = { x: 147.6, w: 1.8, y: -14.6, d: 7.2, crank: 5 };

const P = k.fitProjection(
  [...k.boxCorners(PLATE, -PLATE_H - FOOT_H, 0), [UP.x, -8, UP_TOP + 18], [UP.x + UP.w, 20, UP_TOP + 18], [BOARD.x, BOARD.y, BOARD_Z[1]], [RAD.x1, RAD.y0, RAD.top + 8]],
  W,
  H,
  { pad: 10, azimuth: AZIMUTH, elevation: ELEVATION },
);
const V = G.viewOf(P);
const KS = G.scaleOf(P);
const at = (p) => k.iso(p, P);
const S = (paths, style) => k.solidSvg(paths, style);
const Ln = (d, style) => k.lineSvg(d, style);
const Dots = (points, style) => k.dotsSvg(points, style);
const path3 = (points, closed = false) => k.pathOf(points.map(at), closed);
const f2 = (v) => Math.round(v * 100) / 100;
const UPZ = G.frameOf([0, 0, 0], [0, 0, 1], [1, 0, 0], [0, 1, 0]);
const vframe = (x, y, z = 0) => G.frameOf([x, y, z], [0, 0, 1], [1, 0, 0], [0, 1, 0]);
const xframe = (x, y, z) => G.frameOf([x, y, z], [1, 0, 0], [0, 1, 0], [0, 0, 1]);
const yframe = (x, y, z) => G.frameOf([x, y, z], [0, 1, 0], [1, 0, 0], [0, 0, 1]);

// ---------------------------------------------------------------- recorder and helpers
const R = A.recorder(P);
const record = R.solid;
function put(name, ref, svg, shapes = [], { bias = 0, piece = "stand", move, attrs = "" } = {}) {
  return R.put({ name, at: ref, bias, svg, shapes, piece, move, attrs });
}
function box(name, plan, z0, h, style = {}, { steps = 3, bevel = 0, inner = "", extra = "", bias = 0, piece, move, ground = false } = {}) {
  const shape = record(A.slab(plan, z0, h, { name, ground }, steps));
  put(name, [plan.x + plan.w / 2, plan.y + plan.d / 2, z0 + h / 2], S(k.slabOf(plan, z0, h, P, steps, bevel), { tone: "mid", ...style, inner }) + extra, [shape], { bias, piece, move });
  return shape;
}
function cyl(name, cx, cy, r, z0, h, style = {}, { steps = 32, bevel = 0, inner = "", extra = "", bias = 0, piece, move } = {}) {
  const shape = record(A.cylinder(cx, cy, r, z0, h, { name }));
  put(name, [cx, cy, z0 + h / 2], S(k.cylinder(cx, cy, r, z0, h, P, steps, bevel), { tone: "mid", ...style, inner }) + extra, [shape], { bias, piece, move });
  return shape;
}
function turned(name, F, profile, style = {}, { extra = "", inner = "", bias = 0, piece, move, steps, smooth } = {}) {
  const opts = { ...(steps ? { steps } : {}), ...(smooth !== undefined ? { smooth } : {}) };
  const paths = G.solidOf(profile, F, P, opts);
  const mid = (profile[0][0] + profile[profile.length - 1][0]) / 2;
  const shape = record(A.solid(F, profile, { name }));
  put(name, G.add3(F.o, G.mul3(F.a, mid)), S(paths, { tone: "mid", ...style, inner }) + extra, [shape], { bias, piece, move });
  return shape;
}
function pin(name, F, s0, s1, r, style = {}, opts = {}) {
  return turned(name, F, [[s0, r], [s1, r]], style, opts);
}
const roundRect = (u0, u1, v0, v1, r, steps = 4) => k.roundedPlan({ x: u0, y: v0, w: u1 - u0, d: v1 - v0, r }, steps);
// A closed outline on the vertical face y = Y (x along, z up).
const faceY = (Y, ring) => path3(ring.map(([x, z]) => [x, Y, z]), true);
// A closed outline on the vertical face x = X (y along, z up).
const faceX = (X, ring) => path3(ring.map(([y, z]) => [X, y, z]), true);

const CABLES = [];
function cable(name, points, r = 0.9, { tone = "mid", bend = 4, maxLength = 14, bias = 0.05 } = {}) {
  const route = G.fillet(points, Math.max(bend, r * 2.6), 10, { P, tube: r });
  R.route(name, route, r, { limp: true, piece: "stand" });
  CABLES.push(name);
  tubePieces(route, r, P, { maxLength, spacing: Math.max(0.6, Math.min(1.6, r)) }).forEach((piece, index) =>
    put(`${name}:${index}`, piece.mid, tubeSvg(piece, { tone }), [A.tube(piece.points, piece.radii)], { bias, attrs: ` data-route="${name}"` }),
  );
  return route;
}

const back = [];
const byDepth = (points) => [...points].sort((a, b) => k.depthOf([a[0], a[1], 0], P) - k.depthOf([b[0], b[1], 0], P));

// ---------------------------------------------------------------- base plate
back.push(`<path class="iso-halo" d="${k.haloOf(PLATE, -PLATE_H - FOOT_H, PLATE_H, P)}"/>`);
for (const [x, y] of byDepth(k.corners(PLATE, 22))) {
  back.push(S(k.cylinder(x, y, 7, -PLATE_H - FOOT_H, 1.6, P, 28), { tone: "lo" }));
  back.push(S(k.cylinder(x, y, 5.4, -PLATE_H - FOOT_H + 1.6, FOOT_H - 1.6, P, 28), { tone: "mid" }));
}
back.push(S(k.slabOf(PLATE, -PLATE_H, PLATE_H, P, 8, 1.6), { tone: "mid", inner: Ln(k.sideSeam(PLATE, -4, P, 8), { tone: "faint" }) }));
back.push(Ln(k.planOutline(k.insetPlan(PLATE, 5), 0, P), { tone: "lo" }));
const plateScrews = k.corners(PLATE, 10);
back.push(Ln(plateScrews.map(([x, y]) => k.ring(x, y, 2.2, 0, P, 16)).join(""), { tone: "lo" }));
back.push(Dots(plateScrews.map(([x, y]) => at([x, y, 0])), { size: 0.5 }));
record(A.slab(PLATE, -PLATE_H, PLATE_H, { name: "stand.plate", ground: true }, 8));
const LABEL = { x: -150, y: 26, w: 30, d: 13, r: 1.2 };
back.push(S(k.slabOf(LABEL, 0, 0.8, P, 3), { tone: "lo", crease: "none" }));
back.push(Ln(k.planOutline(k.insetPlan(LABEL, 1.4), 0.8, P, 3), { tone: "faint" }));
back.push(Ln([20, 13, 16].map((w, i) => k.lineOnTop([LABEL.x + 4, LABEL.y + 3.4 + i * 3], [LABEL.x + 4 + w, LABEL.y + 3.4 + i * 3], 0.8, P)).join(""), { tone: "lo", free: true }));
back.push(Dots([at([LABEL.x + LABEL.w - 2.6, LABEL.y + 2.4, 0.8]), at([LABEL.x + LABEL.w - 2.6, LABEL.y + LABEL.d - 2.4, 0.8])], { size: 0.45 }));

// ---------------------------------------------------------------- scale board (core temperature)
box("scale.foot", { x: BOARD.x - 4, y: 0, w: BOARD.w + 7, d: 12, r: 2 }, 0, BOARD_Z[0], { tone: "mid" }, { bevel: 0.5, extra: Dots([at([BOARD.x - 1.5, 6, BOARD_Z[0]]), at([BOARD.x + BOARD.w + 1.5, 6, BOARD_Z[0]])], { size: 0.45 }) });
{
  const face = BOARD.y + BOARD.d;
  const edge = BOARD.x + BOARD.w - 1.2;
  const ticks = [];
  const major = [];
  let zero = "";
  for (let i = Math.round(M.SCALE.low * 40); i <= Math.round(M.SCALE.high * 40); i++) {
    const z = zOf(i / 40);
    const big = i % 4 === 0;
    const mid = i % 2 === 0;
    const len = i === 0 ? 9 : big ? 6.5 : mid ? 4.5 : 2.6;
    const d = k.segment([edge, face, z], [edge - len, face, z], P);
    if (i === 0) zero = d;
    else if (big || mid) major.push(d);
    else ticks.push(d);
  }
  const rule = k.segment([edge, face, BOARD_Z[0]], [edge, face, BOARD_Z[1]], P);
  const inner = Ln(rule, { tone: "mid" }) + Ln(ticks.join(""), { tone: "lo" }) + Ln(major.join(""), { tone: "mid" }) + Ln(zero, { tone: "hi" });
  const screws = Dots([at([BOARD.x + 4, face, BOARD_Z[1] - 5]), at([BOARD.x + 4, face, BOARD_Z[0] + 5])], { size: 0.5, tone: "mid" });
  box("scale.board", BOARD, BOARD_Z[0], BOARD_Z[1] - BOARD_Z[0], { tone: "mid" }, { steps: 2, bevel: 0.4, extra: inner + screws });
}

// ---------------------------------------------------------------- capsule (the core) and its gland
{
  const F = vframe(CAN.x, CAN.y);
  turned("can.flange", F, [[0, 19], [3, 19]], { tone: "lo" }, { extra: Dots(G.dotsOf(F, 3, 17, 10, P, { all: false, fade: [0.04, 0.42] }), { size: 0.5, tone: "mid" }) });
  const body = G.solidOf([[3, 16], [36, 16]], F, P);
  const knurl = k.knurl(CAN.x, CAN.y, 16, 14, 28, 44, P, 0.4);
  const seams = [14, 28].map((z) => k.sideArc(CAN.x, CAN.y, 16, z, P, 40)).join("");
  put("can.body", [CAN.x, CAN.y, 20], S(body, { tone: "mid", inner: Ln(seams, { tone: "faint" }) + Ln(knurl, { tone: "faint" }) }), [record(A.solid(F, [[3, 16], [36, 16]], { name: "can.body" }))]);
  turned("can.cap", F, [[36, 16], [37.6, 16], [40, 13, 1], [41, 12]], { tone: "mid" });
  turned("can.gland", F, [[41, 6.2], [GLAND - 1.2, 6.2], [GLAND, 5.4]], { tone: "mid" }, { extra: Ln(G.circleOf(F, GLAND, ROD_R + 0.5, P), { tone: "faint" }) });
  // Common terminal on the capsule's front.
  const TF = G.frameOf([CAN.x + 8.5, CAN.y + 13.6, 24], G.unit3([0.53, 0.85, 0]), [0, 0, 1], G.unit3([-0.85, 0.53, 0]));
  pin("can.boss", TF, -1.2, 2.4, 3.2, { tone: "mid" });
  pin("can.stud", TF, 2.4, 4.4, 1.8, { tone: "hi" });
}

// ---------------------------------------------------------------- the column (lit): rod, collar, finger, index
const ROD_PIECE = { piece: "rod", move: [0, 0, TRAVEL] };
{
  const F = G.frameOf([CAN.x, CAN.y, 0], [0, 0, 1], [1, 0, 0], [0, 1, 0]);
  const tip = Z_LOW - 3.5;
  const rod = G.rodOut(F, GLAND, tip, ROD_R, P, { stroke: TRAVEL });
  const svg = `<clipPath id="mt-rod"><path data-hold d="${rod.clip}"/></clipPath><g clip-path="url(#mt-rod)">${S(rod.paths, { tone: "hi", lit: true })}</g>`;
  put("rod", [CAN.x, CAN.y, (GLAND + tip) / 2], svg, [record(A.slide(F, GLAND, tip, ROD_R, { name: "rod" }))], { ...ROD_PIECE, attrs: ` data-hold-group` });
  const z = Z_LOW;
  cyl("collar", CAN.x, CAN.y, 5.2, z - 3.5, 7, { tone: "hi", lit: true }, { bevel: 0.4, ...ROD_PIECE, extra: Ln(k.sideArc(CAN.x, CAN.y, 5.2, z, P, 24), { tone: "lit" }) });
  box("finger", { x: CAN.x + 4.8, y: CAN.y - 2.5, w: JAW_X + 4 - (CAN.x + 4.8), d: 5, r: 1 }, z - 1.5, 3, { tone: "hi", lit: true }, { steps: 2, bevel: 0.3, ...ROD_PIECE });
  cyl("finger.pad.top", JAW_X, CAN.y, 2.2, z + 1.5, 1.1, { tone: "hi" }, { steps: 20, ...ROD_PIECE });
  cyl("finger.pad.bottom", JAW_X, CAN.y, 2.2, z - 2.6, 1.1, { tone: "hi" }, { steps: 20, ...ROD_PIECE, bias: -0.2 });
  box("index", { x: BOARD.x + BOARD.w - 5, y: CAN.y - 1.5, w: CAN.x - 5.0 - (BOARD.x + BOARD.w - 5), d: 3, r: 0.6 }, z - 0.6, 1.2, { tone: "hi", lit: true }, { steps: 2, ...ROD_PIECE });
}

// ---------------------------------------------------------------- the upright: base, back plate, rails, lead screw, bridge, knob
box("up.base", { x: UP.x, y: -8, w: UP.w, d: 28, r: 3 }, 0, 12, { tone: "mid" }, { bevel: 0.6, inner: Ln(k.sideSeam({ x: UP.x, y: -8, w: UP.w, d: 28, r: 3 }, 4, P, 3), { tone: "faint" }), extra: Dots([at([UP.x + 4, 16, 12]), at([UP.x + UP.w - 4, 16, 12])], { size: 0.5 }) });
box("up.back", { x: UP.x + 2, y: -6, w: UP.w - 4, d: 4, r: 1 }, 12, UP_TOP - 12, { tone: "mid" }, { steps: 2, bevel: 0.4 });
for (const rx of [UP.x + 6, UP.x + UP.w - 10]) box(`up.rail`, { x: rx, y: -2, w: 4, d: 2, r: 0.6 }, 12, UP_TOP - 12, { tone: "hi" }, { steps: 2 });
{
  const F = vframe(SCREW[0], SCREW[1]);
  pin("screw.foot", F, 12, 14, 3.6, { tone: "mid" });
  pin("screw.head", F, UP_TOP - 2, UP_TOP, 3.6, { tone: "mid" });
}
const screwSvg = (phase) => {
  // An opposed-thread screw: right-hand below the middle, left-hand above, so
  // one turn drives both jaws toward the middle.
  const [x, y] = SCREW;
  const mid = (zOf(ZONE_POST.sweat) + zOf(ZONE_POST.shiver)) / 2;
  const pitch = 3;
  const rings = [];
  for (let z = 14 + ((phase * pitch) % pitch + pitch) % pitch; z < mid - 1; z += pitch) rings.push(k.sideArc(x, y, 2.2, z, P, 12));
  for (let z = UP_TOP - 2 - ((phase * pitch) % pitch + pitch) % pitch; z > mid + 1; z -= pitch) rings.push(k.sideArc(x, y, 2.2, z, P, 12));
  return rings.join("");
};
{
  const [x, y] = SCREW;
  const shape = record(A.cylinder(x, y, 2.2, 14, UP_TOP - 16, { name: "screw" }));
  put("screw", [x, y, UP_TOP / 2], S(k.cylinder(x, y, 2.2, 14, UP_TOP - 16, P, 20), { tone: "hi", crease: "none", inner: `<path class="iso-line" data-tone="lo" data-part="thread" d="${screwSvg(0)}"/>` }), [shape]);
}
const BRIDGE = { x: UP.x, y: -8, w: UP.w, d: 28, r: 3 };
box("up.bridge", BRIDGE, UP_TOP, 10, { tone: "mid" }, {
  bevel: 0.6,
  inner: Ln(k.sideSeam(BRIDGE, UP_TOP + 3, P, 3), { tone: "faint" }),
  extra:
    Dots([at([UP.x + 4, -4, UP_TOP + 10]), at([UP.x + 4, 16, UP_TOP + 10]), at([UP.x + UP.w - 4, 16, UP_TOP + 10]), at([UP.x + UP.w - 4, -4, UP_TOP + 10])], { size: 0.5 }) +
    k.faceTextSvg(k.sideMatrix([UP.x + UP.w / 2, 20], UP_TOP + 6.4, P, "left"), "ESTROGEN", { size: 3.6, tone: "mid", anchor: "middle" }),
});
const KNOB = { x: SCREW[0], y: 6, r: 8 };
const DIAL_TOP_Z = UP_TOP + 11.2;
{
  const F = vframe(KNOB.x, KNOB.y);
  const plateTicks = k.radialTicks(KNOB.x, KNOB.y, 12.2, 12, 11, DIAL_TOP_Z, [1.4, 2.6], P, M.KNOB.from, M.KNOB.span);
  turned("knob.plate", F, [[UP_TOP + 10, 13], [DIAL_TOP_Z, 13]], { tone: "lo" }, { extra: Ln(plateTicks.minor, { tone: "lo" }) + Ln(plateTicks.major, { tone: "hi" }) + Ln(k.ring(KNOB.x, KNOB.y, 13 - 0.8, DIAL_TOP_Z, P, 48), { tone: "faint" }) });
  const knurl = k.knurl(KNOB.x, KNOB.y, KNOB.r, DIAL_TOP_Z, DIAL_TOP_Z + 6, 40, P, 0.4);
  turned("knob", F, [[DIAL_TOP_Z, KNOB.r], [DIAL_TOP_Z + 6, KNOB.r]], { tone: "hi", crease: "lo" }, { extra: Ln(knurl, { tone: "lo" }) });
}
const KNOB_TOP = DIAL_TOP_Z + 6;
const pointerAt = (angle) => {
  const [x, y] = [KNOB.x, KNOB.y];
  return k.lineOnTop([x - Math.sin(angle) * 2, y + Math.cos(angle) * 2], [x + Math.sin(angle) * (KNOB.r - 1.2), y - Math.cos(angle) * (KNOB.r - 1.2)], KNOB_TOP, P);
};

// ---------------------------------------------------------------- the jaws (built at the pre-menopause zone; they move toward the middle)
function jaw(which) {
  const upper = which === "upper";
  const t = upper ? ZONE_PRE.sweat : ZONE_PRE.shiver;
  const zt = zOf(t);
  const s = upper ? 1 : -1;
  const piece = upper ? { piece: "jawU", move: [0, 0, -JAW_TRAVEL] } : { piece: "jawL", move: [0, 0, JAW_TRAVEL_L] };
  const cz0 = upper ? zt + 1.9 : zt - 10.9;
  const carriage = { x: UP.x + 4, y: 5.2, w: UP.w - 8, d: 10, r: 2 };
  for (const bx of [UP.x + 4, UP.x + UP.w - 12]) box(`${which}.bushing`, { x: bx, y: 0, w: 8, d: 5.2, r: 0.8 }, cz0 + 1, 7, { tone: "mid" }, { steps: 2, ...piece });
  box(`${which}.carriage`, carriage, cz0, 9, { tone: "hi", crease: "lo" }, {
    bevel: 0.5,
    ...piece,
    inner: Ln(k.sideSeam(carriage, cz0 + 4.5, P, 3), { tone: "faint" }),
    extra: Dots([at([carriage.x + 3, carriage.y + 5, cz0 + 9]), at([carriage.x + carriage.w - 3, carriage.y + 5, cz0 + 9])], { size: 0.5, tone: "mid" }),
  });
  const armZ = upper ? zt + 3.6 : zt - 6.6;
  box(`${which}.arm`, { x: JAW_X - 6, y: CAN.y - 2.5, w: carriage.x - (JAW_X - 6), d: 5, r: 1 }, armZ, 3, { tone: "hi", crease: "lo" }, { steps: 2, bevel: 0.3, ...piece });
  const bz = upper ? zt + 2.6 : zt - 3.6;
  cyl(`${which}.button`, JAW_X, CAN.y, 2.2, bz, 1.0, { tone: "hi" }, { steps: 20, ...piece, bias: upper ? -0.3 : 0.3 });
  void s;
}
jaw("lower");
jaw("upper");

// ---------------------------------------------------------------- relay box on the upright's flank, with the flash and chill lamps
box("relay", RELAY, 0, RELAY_H, { tone: "mid" }, {
  bevel: 0.6,
  inner: Ln(k.sideSeam(RELAY, RELAY_H - 3, P, 3), { tone: "faint" }),
  extra: Dots(k.corners(RELAY, 2.6).map(([x, y]) => at([x, y, RELAY_H])), { size: 0.5 }),
});
const LAMPS = { warm: [RELAY.x + 9, RELAY.y + 15], cool: [RELAY.x + 18.5, RELAY.y + 15] };
for (const [name, [x, y]] of Object.entries(LAMPS)) {
  cyl(`lamp.${name}.bezel`, x, y, 3.6, RELAY_H, 1.4, { tone: "mid" }, { steps: 28, extra: Ln(k.ring(x, y, 2.9, RELAY_H + 1.4, P, 28), { tone: "faint" }) });
  const c = [x, y, RELAY_H + 1.4];
  const shape = record(A.ball(c, 2.6, { name: `lamp.${name}` }));
  put(`lamp.${name}`, c, `<g class="mt-lamp" data-lamp="${name}">${S(G.sphereOf(c, 2.6, P, { steps: 32 }), { tone: "hi" })}</g>`, [shape], { bias: 0.1 });
}

// ---------------------------------------------------------------- radiator: frame, finned core, louvres on pins, linkage bar, solenoid
{
  const { x0, x1, post, y0, y1, top } = RAD;
  box("rad.post.l", { x: x0, y: y0, w: post, d: y1 - y0, r: 1.2 }, 0, top, { tone: "mid" }, { steps: 2, bevel: 0.4 });
  box("rad.rail", { x: x0 + post, y: y0, w: x1 - x0 - 2 * post, d: y1 - y0, r: 0.6 }, 0, 10, { tone: "mid" }, { steps: 2 });
  const core = { x: x0 + post, y: y0, w: x1 - x0 - 2 * post, d: 5, r: 0.4 };
  const fins = [];
  for (let x = core.x + 4; x < core.x + core.w - 3; x += 6) fins.push(faceY(core.y + core.d, roundRect(x, x + 2.2, 13, top - 3, 1.1, 3)));
  const wash = `<path class="mt-heat" data-part="wash" d="${faceY(core.y + core.d + 0.01, roundRect(core.x, core.x + core.w, 10, top, 0, 1))}"/>`;
  box("rad.core", core, 10, top - 10, { tone: "lo" }, { steps: 2, extra: wash + Ln(fins.join(""), { tone: "lo" }) });
  box("rad.post.r", { x: x1 - post, y: y0, w: post, d: y1 - y0, r: 1.2 }, 0, top, { tone: "mid" }, { steps: 2, bevel: 0.4 });
  const header = { x: x0 - 2, y: y0 - 2, w: x1 - x0 + 4, d: y1 - y0 + 4, r: 2 };
  box("rad.header", header, top, 8, { tone: "mid" }, {
    bevel: 0.6,
    inner: Ln(k.sideSeam(header, top + 3, P, 3), { tone: "faint" }),
    extra: Dots([x0 + 3.5, x1 - 3.5].flatMap((x) => [at([x, y0 + 2, top + 8]), at([x, y1 - 2, top + 8])]), { size: 0.5 }),
  });
}
const SLAT_LEN = RAD.x1 - RAD.x0 - 2 * RAD.post;
const slatFrame = (zc, deg) => {
  const a = (deg * Math.PI) / 180;
  return G.frameOf([RAD.x0 + RAD.post, PIVOT_Y, zc], [1, 0, 0], [0, Math.sin(a), Math.cos(a)], [0, -Math.cos(a), Math.sin(a)]);
};
const SLAT_POLY = [[-SLAT_W / 2, -SLAT_T / 2], [SLAT_W / 2, -SLAT_T / 2], [SLAT_W / 2, SLAT_T / 2], [-SLAT_W / 2, SLAT_T / 2]];
SLATS.forEach((zc, i) => {
  const shape = record(A.prism(slatFrame(zc, 0), SLAT_POLY, 0, SLAT_LEN, { name: `slat` }));
  put(`slat`, [(RAD.x0 + RAD.x1) / 2, PIVOT_Y, zc], `<g data-slat="${i}">${S(G.prismOf(slatFrame(zc, 0), SLAT_POLY, 0, SLAT_LEN, P), { tone: "hi", crease: "lo" })}</g>`, [shape], { bias: 0.4 });
  pin(`slat.pin`, xframe(RAD.x1, PIVOT_Y, zc), 0, 1.6, 1.5, { tone: "mid" });
});
// Linkage: a crank on each pin drives a slotted bar; the solenoid lifts the bar.
const crankTip = (zc, deg) => {
  const a = (deg * Math.PI) / 180;
  return [RAD.x1 + 1.6, PIVOT_Y - BAR.crank * Math.cos(a), zc + BAR.crank * Math.sin(a)];
};
const barLift = (deg) => BAR.crank * Math.sin((deg * Math.PI) / 180);
const BAR_Z = [SOL.z0 + SOL.h - 2, SLATS[SLATS.length - 1] + 6];
{
  const bar = { x: BAR.x, y: BAR.y, w: BAR.w, d: BAR.d, r: 0.5 };
  const slots = SLATS.map((zc) => faceX(BAR.x + BAR.w, roundRect(BAR.y + 0.9, BAR.y + BAR.d - 0.9, zc - 0.7, zc + 0.7, 0.7, 3))).join("");
  const barH = BAR_Z[1] - BAR_Z[0];
  const clip = k.pathOf(
    G.hullOf([
      ...k.ringOf(bar, 2).map(([x, y]) => at([x, y, SOL.z0 + SOL.h])),
      ...k.ringOf(bar, 2).map(([x, y]) => at([x, y, BAR_Z[1] + 6])),
    ]),
    true,
  );
  const shape = record(A.slab(bar, SOL.z0 + SOL.h, BAR_Z[1] - SOL.z0 - SOL.h, { name: "bar" }, 2));
  const pinsSvg = `<g data-part="crankpins">${Dots(SLATS.map((zc) => at([BAR.x + BAR.w, crankTip(zc, 0)[1], zc])), { size: 0.8, tone: "hi" })}</g>`;
  put("bar", [BAR.x + BAR.w / 2, BAR.y + BAR.d / 2, (BAR_Z[0] + BAR_Z[1]) / 2], `<clipPath id="mt-bar"><path data-hold d="${clip}"/></clipPath><g clip-path="url(#mt-bar)">${S(k.slabOf(bar, BAR_Z[0], barH, P, 2, 0.3), { tone: "mid", inner: Ln(slots, { tone: "lo" }) })}${pinsSvg}</g>`, [shape], { bias: 0.2, attrs: ` data-part="bar"` });
  // solenoid on a plinth
  box("sol.plinth", { x: SOL.x - 6.4, y: SOL.y - 6.4, w: 12.8, d: 12.8, r: 1.4 }, 0, SOL.z0, { tone: "lo" }, { steps: 2, bevel: 0.4, extra: Dots(k.corners({ x: SOL.x - 6.4, y: SOL.y - 6.4, w: 12.8, d: 12.8 }, 1.8).map(([x, y]) => at([x, y, SOL.z0])), { size: 0.45 }) });
  const F = vframe(SOL.x, SOL.y);
  turned("sol.can", F, [[SOL.z0, SOL.r], [SOL.z0 + SOL.h - 1.2, SOL.r], [SOL.z0 + SOL.h, SOL.r - 0.8]], { tone: "mid" }, { inner: Ln([SOL.z0 + 3, SOL.z0 + SOL.h - 4].map((z) => k.sideArc(SOL.x, SOL.y, SOL.r, z, P, 24)).join(""), { tone: "faint" }) });
}

// ---------------------------------------------------------------- console with the skin and heart-rate dials
box("console", CONSOLE, 0, CONSOLE_H, { tone: "mid" }, {
  bevel: 0.6,
  inner: Ln(k.sideSeam(CONSOLE, 4, P, 3), { tone: "faint" }),
  extra: Dots(k.corners(CONSOLE, 2.8).map(([x, y]) => at([x, y, CONSOLE_H])), { size: 0.5 }),
});
for (const [name, [x, y]] of Object.entries(DIALS)) {
  const dial = M.DIALS[name];
  const ticks = k.radialTicks(x, y, DIAL_R - 2.6, dial.count, dial.every, DIAL_Z, [1.2, 2.4], P, dial.from, dial.span);
  const F = vframe(x, y);
  turned(`dial.${name}`, F, [[CONSOLE_H, DIAL_R], [DIAL_Z, DIAL_R]], { tone: "hi", crease: "lo" }, {
    extra:
      Ln(k.knurl(x, y, DIAL_R, DIAL_Z - 2.2, DIAL_Z, 60, P, 0.3), { tone: "lo" }) +
      Ln(k.sideArc(x, y, DIAL_R, DIAL_Z - 2.2, P, 40), { tone: "faint" }) +
      Ln(k.ring(x, y, DIAL_R - 1.8, DIAL_Z, P, 48), { tone: "lo" }) +
      Ln(ticks.minor, { tone: "lo" }) +
      Ln(ticks.major, { tone: "mid" }) +
      Ln(k.ring(x, y, 1.3, DIAL_Z, P, 16), { tone: "mid" }),
  });
}
const needleAt = (name, angle) => {
  const [x, y] = DIALS[name];
  return k.lineOnTop([x - Math.sin(angle) * 2.6, y + Math.cos(angle) * 2.6], [x + Math.sin(angle) * (DIAL_R - 3.4), y - Math.cos(angle) * (DIAL_R - 3.4)], DIAL_Z + 0.2, P);
};

// ---------------------------------------------------------------- terminals and cables: capsule → relay (common), relay → solenoid, relay → dials
function stud(name, o, a) {
  const F = G.frameAlong(o, a);
  pin(`${name}.boss`, F, 0, 1.2, 2.4, { tone: "mid" });
  pin(name, F, 1.2, 2.6, 1.5, { tone: "hi" });
  return G.add3(o, G.mul3(a, 2.6));
}
const TIP = {
  can: (() => {
    const o = [CAN.x + 8.5, CAN.y + 13.6, 24];
    return G.add3(o, G.mul3(G.unit3([0.53, 0.85, 0]), 4.4));
  })(),
  com: stud("stud.relay.com", [RELAY.x + 6, RELAY.y + RELAY.d, 8], [0, 1, 0]),
  out: stud("stud.relay.out", [RELAY.x + RELAY.w, RELAY.y + 6, 8], [1, 0, 0]),
  hr: stud("stud.relay.hr", [RELAY.x + RELAY.w, RELAY.y + 15, 8], [1, 0, 0]),
  console: stud("stud.console", [CONSOLE.x, CONSOLE.y + 13, 6], [-1, 0, 0]),
  sol: stud("stud.sol", [SOL.x, SOL.y + SOL.r, SOL.z0 + 7], [0, 1, 0]),
};
const lay = 0.9;
{
  const a = G.unit3([0.53, 0.85, 0]);
  const p1 = G.add3(TIP.can, G.mul3(a, 4));
  cable("cable.com", [TIP.can, p1, [p1[0] + 3, p1[1] + 4, lay], [RELAY.x + 6, p1[1] + 4, lay], [RELAY.x + 6, TIP.com[1] + 5, 8], TIP.com]);
}
cable("cable.sol", [TIP.out, [TIP.out[0] + 5, TIP.out[1], 8], [TIP.out[0] + 9, 6, lay], [SOL.x - 10, 6, lay], [SOL.x, 4, lay], [SOL.x, TIP.sol[1] + 4, TIP.sol[2]], TIP.sol]);
cable("cable.hr", [TIP.hr, [TIP.hr[0] + 5, TIP.hr[1], 8], [TIP.hr[0] + 9, TIP.hr[1] + 2, lay], [TIP.console[0] - 8, TIP.console[1], lay], [TIP.console[0] - 4, TIP.console[1], TIP.console[2]], TIP.console]);

// ---------------------------------------------------------------- settle and assemble
const STATES = [];
for (const rod of [0, 0.25, 0.5, 0.75, 1]) for (const jaw of [0, 0.5, 1]) STATES.push({ label: `rod ${rod} jaw ${jaw}`, shares: { rod, jawU: jaw, jawL: jaw } });
A.settle(R, P, { states: STATES });
R.items.sort((a, b) => a.key - b.key);
const groups = R.items.map((item) => `<g class="it" data-name="${item.name}"${item.piece !== "stand" ? ` data-move="${item.piece}"` : ""}${item.attrs ?? ""}>${item.svg}</g>`);

const LABEL_TEXT =
  "A bench regulator drawn as a machine. A sealed capsule pushes a lit column up and down beside a temperature scale. Two contact jaws on a lead screw sit above and below the column's finger: the upper jaw is the sweating threshold, the lower jaw the shivering threshold, and the gap between them is the thermoneutral zone. An estrogen knob on top closes the jaws. When the finger touches the upper jaw, a relay opens the louvres on a radiator and swings the skin-temperature and heart-rate dials; afterwards the column dips, and with a narrow zone it can touch the lower jaw, a chill.";
const E0 = 1;
const svg = k.figureSvg({
  width: W,
  height: H,
  label: LABEL_TEXT,
  body: [
    ...back,
    ...groups,
    `<path class="iso-line" data-tone="hi" data-part="pointer" data-free="start" d="${pointerAt(M.knobAngle(E0))}" style="stroke-width:1.2"/>`,
    ...Object.keys(DIALS).map((name) => `<path class="iso-line" data-tone="hi" data-part="needle-${name}" data-free="start" d="${needleAt(name, M.DIALS[name].angleOf(0))}" style="stroke-width:1"/>`),
  ],
});

const DATA = {
  P,
  KZ,
  zone0: { sweat: zOf(ZONE_PRE.sweat), shiver: zOf(ZONE_PRE.shiver) },
  rod0: Z_LOW,
  ZREF,
  screw: SCREW,
  screwMid: (zOf(ZONE_POST.sweat) + zOf(ZONE_POST.shiver)) / 2,
  screwZ: [14, UP_TOP - 2],
  knob: { x: KNOB.x, y: KNOB.y, r: KNOB.r, top: KNOB_TOP },
  dials: DIALS,
  dialR: DIAL_R,
  dialZ: DIAL_Z,
  slats: SLATS,
  slatOpen: SLAT_OPEN,
  slat: { x: RAD.x0 + RAD.post, y: PIVOT_Y, len: SLAT_LEN, poly: SLAT_POLY },
  bar: { x: BAR.x + BAR.w, crank: BAR.crank, pivotY: PIVOT_Y },
};

const MODEL_SRC = readFileSync(join(HERE, "model.mjs"), "utf8").replace(/^export /gm, "");
const latheSource = readFileSync(join(HERE, "../../.claude/skills/anatomy/kit/lathe.mjs"), "utf8").replace(/^import .*$/gm, "").replace(/^export /gm, "");
const LATHE = `const G = (() => {${latheSource}\nreturn { frameOf, prismOf };})();\n`;
const LIVE = readFileSync(join(HERE, "live.js"), "utf8").replace("__DATA__", JSON.stringify(DATA));
const SCRIPT = `${LATHE}\n${MODEL_SRC}\n${LIVE}`;

const CSS = readFileSync(join(HERE, "figure.css"), "utf8");
const T = M.TRUTH;
const CAPTION = [
  `Your brain keeps core temperature inside a narrow band, the <em>thermoneutral zone</em>: above its top edge you sweat and flush to lose heat, below its bottom edge you shiver to make it. In lab studies the zone measured about ${T.zonePre} °C wide in women without hot flashes and close to ${T.zonePost.toFixed(1)} °C in women with them, mostly because the sweating threshold sits lower. Falling estrogen is thought to narrow it through the brain's KNDy neurons and their neurokinin B signal.`,
  `On a narrow zone, an ordinary rise of about ${T.swing} °C, too small to feel, reaches the top edge and sets off a full heat-loss response: skin vessels open and finger temperature rises by about ${T.skinRise} °C, heart rate rises by about ${T.hrRise} beats a minute, and a typical flash lasts about ${T.flashMin} minutes. Core temperature then dips, and some women feel a chill.`,
  `A typical pattern from small studies, not a test or a diagnosis. Not every woman's zone narrows, and many have no hot flashes. Played at about a minute a second, with the quiet time between rises cut; flashes per hour come from the model. The size of the after-chill is drawn small because it hasn't been measured well.`,
]
  .map((p) => `<span class="mt-par">${p}</span>`)
  .join("");
const body = plate({
  fig: "Fig 1",
  title: "The narrowing thermostat",
  hint: "Pick a stage · drag sideways · space for a small rise",
  stats: [
    { key: "core", label: "Core", value: "+0.00 °C" },
    { key: "zone", label: "Zone", value: `${T.zonePre.toFixed(1)} °C` },
    { key: "rate", label: "Flashes", value: "0 / h" },
    { key: "skin", label: "Skin", value: "+0.0 °C" },
  ],
  controls: [{ name: "stage", label: "Estrogen", options: [{ value: "1", label: "Pre-menopause", pressed: true }, { value: "0", label: "Post-menopause" }] }],
  keys: [
    { mark: "lit", label: "Core temperature, as a change from rest" },
    { mark: "raised", label: "Sweating threshold (upper jaw) and shivering threshold (lower jaw)" },
    { mark: "heat", label: "Heat let out through the skin" },
  ],
  caption: CAPTION,
  body: `<div class="iso-stage mt-stage" tabindex="0" role="slider" aria-label="Estrogen, from pre-menopause to post-menopause. Arrow keys turn the knob, Home and End jump to each end, Space starts a small rise in core temperature." aria-valuemin="0" aria-valuemax="100" aria-valuenow="100" aria-valuetext="Pre-menopause: zone ${T.zonePre} °C, no hot flashes">${svg}</div><span class="mt-sr" role="status" aria-live="polite" data-status></span>`,
});

const out = THEME === "light" ? `${SLUG}-light.html` : `${SLUG}.html`;
writeFileSync(join(HERE, out), page({ title: "The narrowing thermostat", theme: THEME, body, css: CSS, script: SCRIPT }));
if (THEME === "light") {
  mkdirSync(join(HERE, "embed"), { recursive: true });
  writeFileSync(join(HERE, "embed", `optimal-fig-${SLUG}.js`), embed({ tag: `optimal-fig-${SLUG}`, body, script: SCRIPT, css: CSS }));
}
console.log("wrote", out, `${R.items.length} items`, `${R.solids.length} solids`, `${CABLES.length} cables`, `scale ${KS.toFixed(3)}`);
A.auditOrExit(R, P, { frames: STATES });
void f2; void yframe; void UPZ;
