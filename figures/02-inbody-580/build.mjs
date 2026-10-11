// Fig 2 · Five cylinders on a bridge.
//
// An InBody 580 (footplate with four electrode pads, column, tilted screen,
// grips on rods) with a glass body standing on it: five cylinders, cut along
// the body's middle so their insides show, holding the grips. Inside each
// cylinder, long cells sit in fluid; the current is a stream of dots that
// threads round the cells at 5 kHz and increasingly through them at higher
// frequencies. A bridge console beside it carries five panel meters, laid out
// like the InBody result sheet, reading each segment's impedance.
//
//   node build.mjs | --light | --audit
import { mkdirSync, readFileSync, writeFileSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";
import { figkit, k, G, A } from "../../shared/figkit.mjs";
import { plate, page, embed } from "../../shared/page.mjs";
import * as M from "./model.mjs";

const HERE = dirname(fileURLToPath(import.meta.url));
const THEME = process.argv.includes("--light") ? "light" : "dark";
const SLUG = "inbody-580";
const W = 600;
const H = 600;
const AZIMUTH = 58;
const ELEVATION = 26;

// ---------------------------------------------------------------- layout (world units ≈ cm, z up; the body faces −x)
const PLATE = { x: -58, y: -40, w: 148, d: 82, r: 8 };
const FP = { x: -46, y: -26, w: 66, d: 52, r: 7 }; // 580 footplate
const FP_Z = [2.4, 10];
const COL = { x: -44, y: -8, w: 13, d: 16, r: 3 }; // 580 column
const COL_TOP = 100;
const BODY_X = 3; // limb and trunk axes
const LEG = { y: 10.5, r: 7, z0: 12.6, z1: 86 };
const PELVIS = [86, 90];
const TRUNK = { r: 15, z0: 90, z1: 138 };
const YOKE = 140;
const SHOULDER = [BODY_X, 23, 139];
const GRIP = [-14, 33, 88]; // right grip centre (left mirrors in y)
const ARM_R = 4.6;
const CONSOLE = { x0: 36, x1: 84, y0: -14, y1: 16 };
const CONSOLE_POLY = [[-15, 0], [15, 0], [15, 7], [-15, 27]]; // (y, z) section: low front, tall back
const WALL = 0.6;

const fitPoints = [...k.boxCorners(PLATE, -15, 0), [BODY_X, 0, YOKE + 4], [COL.x, 0, COL_TOP + 22], [CONSOLE.x1, CONSOLE.y0, 28]];
const P = k.fitProjection(fitPoints, W, H, { pad: 10, azimuth: AZIMUTH, elevation: ELEVATION });
const F = figkit(P);
const { R, record, at, S, Ln, Dots, path3, vframe, xframe, roundRect, planeMatrix, put, box, cyl, turned, pin, prism, ball, stud, cable } = F;
const V = G.viewOf(P);
const KS = G.scaleOf(P);

// ---------------------------------------------------------------- bench
const back = F.bench(PLATE, { plateH: 8, footH: 5, label: { x: PLATE.x + 8, y: PLATE.y + PLATE.d - 20, w: 24, d: 12, r: 1.2 } });

// ---------------------------------------------------------------- InBody 580: footplate, electrodes, column, head, grips
{
  for (const [x, y] of F.byDepth(k.corners(FP, 7))) cyl("fp.foot", x, y, 3.2, 0, FP_Z[0], { tone: "lo" }, { steps: 20 });
  box("fp.base", FP, FP_Z[0], 3, { tone: "lo" }, { steps: 6, bevel: 0.4 });
  const deck = k.insetPlan(FP, 1.2);
  box("fp.deck", deck, FP_Z[0] + 3, FP_Z[1] - FP_Z[0] - 3, { tone: "mid" }, { steps: 6, bevel: 0.8, inner: Ln(k.sideSeam(deck, FP_Z[0] + 5, P, 6), { tone: "faint" }), extra: Ln(k.planOutline(k.insetPlan(deck, 3), FP_Z[1], P, 6), { tone: "faint" }) });
}
const ELECTRODES = [];
const DOCKS = {};
for (const side of [1, -1]) {
  const y = side * LEG.y;
  // front sole plate (toes toward −x) and heel plate
  for (const [x0, x1, kind] of [[-24, -10, "sole"], [2, 10, "heel"]]) {
    const plan = { x: x0, y: y - 4.6, w: x1 - x0, d: 9.2, r: 1.6 };
    const grooves = [0.3, 0.5, 0.7].map((f) => k.lineOnTop([x0 + (x1 - x0) * f, plan.y + 0.8], [x0 + (x1 - x0) * f, plan.y + plan.d - 0.8], FP_Z[1] + 0.6, P)).join("");
    box(`fp.${kind}`, plan, FP_Z[1], 0.6, { tone: "hi", crease: "lo" }, { steps: 3, extra: Ln(k.planOutline(k.insetPlan(plan, 0.8), FP_Z[1] + 0.6, P, 3), { tone: "lo" }) + Ln(grooves, { tone: "faint" }) });
    ELECTRODES.push({ kind, side, plan });
  }
}
{
  // column: a slab with a front seam strip and a cable channel down its back
  box("col", COL, FP_Z[1], COL_TOP - FP_Z[1], { tone: "mid" }, { steps: 4, bevel: 0.6, inner: Ln(k.sideSeam(COL, FP_Z[1] + 8, P, 4) + k.sideSeam(COL, COL_TOP - 14, P, 4), { tone: "faint" }) });
  const strip = { x: COL.x + COL.w, y: COL.y + 4, w: 0.8, d: COL.d - 8, r: 0.3 };
  box("col.strip", strip, FP_Z[1] + 10, COL_TOP - FP_Z[1] - 26, { tone: "lo" }, { steps: 2 });
  // shoulder docks
  for (const side of [1, -1]) DOCKS[side] = box(`col.dock`, { x: COL.x - 1, y: side > 0 ? COL.y + COL.d : COL.y - 6, w: COL.w + 2, d: 6, r: 2 }, COL_TOP - 12, 9, { tone: "mid" }, { steps: 3, bevel: 0.4 });
}
// The head: a tablet tilted back 35° on a neck, its screen facing the person (+x).
const HEAD = (() => {
  const tilt = (35 * Math.PI) / 180;
  const n = [Math.cos(tilt), 0, Math.sin(tilt)];
  const u = [0, 1, 0];
  const v = [-Math.sin(tilt), 0, Math.cos(tilt)];
  const c = [COL.x + COL.w / 2 + 1.5, 0, COL_TOP + 15];
  return { n, u, v, c, w: 26, h: 18, t: 2.8 };
})();
{
  const { n, u, v, c, w, h, t } = HEAD;
  const JR = 3.5;
  const joint = G.sub3(G.sub3(c, G.mul3(n, t)), G.mul3(n, JR));
  const jointBall = ball("head.joint", joint, JR, { tone: "mid" });
  cyl("col.neck", joint[0], joint[1], 2.6, COL_TOP, joint[2] - Math.sqrt(JR * JR - 2.6 * 2.6) - COL_TOP, { tone: "lo" }, { steps: 24, meta: { seated: true, cut: jointBall } });
  const Fh = G.frameOf(c, n, u, v);
  const poly = roundRect(-w / 2, w / 2, -h / 2, h / 2, 3.2, 5);
  // screen in the face plane: local x along −y, local y down the tablet (non-mirrored)
  const face = G.add3(c, G.mul3(n, 0.05));
  const m = planeMatrix(G.add3(face, G.add3(G.mul3(u, w / 2), G.mul3(v, h / 2))), [0, -1, 0], G.mul3(v, -1));
  const scr = { x0: 2.4, x1: w - 2.4, y0: 2.2, y1: h - 5.6 };
  const keys = Array.from({ length: 10 }, (_, i) => [scr.x0 + 2 + (i % 5) * ((scr.x1 - scr.x0 - 4) / 4), scr.y1 + 1.7 + Math.floor(i / 5) * 1.7]);
  const screen =
    `<g transform="${m}"><path class="ib-bezel" d="M${scr.x0 - 0.8} ${scr.y0 - 0.8}H${scr.x1 + 0.8}V${scr.y1 + 0.8}H${scr.x0 - 0.8}Z"/><path class="ib-screen" d="M${scr.x0} ${scr.y0}H${scr.x1}V${scr.y1}H${scr.x0}Z"/>` +
    `<g data-part="screen" clip-path="url(#ib-scr)"></g><path class="iso-line" data-tone="lo" d="M${scr.x0} ${scr.y0}H${scr.x1}V${scr.y1}H${scr.x0}Z"/>${Dots(keys, { size: 0.5, tone: "mid" })}</g>` +
    `<clipPath id="ib-scr"><path d="M${scr.x0} ${scr.y0}H${scr.x1}V${scr.y1}H${scr.x0}Z"/></clipPath>`;
  prism("head", Fh, poly, -t, 0, { tone: "mid" }, { extra: screen });
  HEAD.screen = { scr };
}
// grips on rods: a rod from each dock to its grip; the grip has palm and thumb electrode bands
const GRIPS = [];
for (const side of [1, -1]) {
  const dock = [COL.x + COL.w / 2, side > 0 ? COL.y + COL.d + 6 : COL.y - 6, COL_TOP - 7.5];
  const grip = [GRIP[0], side * GRIP[1], GRIP[2]];
  const axis = G.unit3(G.sub3(grip, dock));
  const gripLen = 12;
  const rodEnd = G.sub3(grip, G.mul3(axis, gripLen / 2));
  const Fr = G.frameAlong(dock, axis);
  const rodLen = G.len3(G.sub3(rodEnd, dock));
  pin(`grip.rod`, Fr, -1.2, rodLen, 1.2, { tone: "lo" }, { meta: { seated: true, cut: DOCKS[side] } });
  const Fg = G.frameAlong(rodEnd, axis);
  turned(`grip`, Fg, [[0, 2.2], [1, 2.6], [gripLen - 1, 2.6], [gripLen, 2.2]], { tone: "mid" }, {
    inner: Ln([2, 5.2, 7.2, 10.4].map((s) => G.arcOf(Fg, s, 2.6, P)).join(""), { tone: "lo" }),
  });
  GRIPS.push({ side, grip, axis, Fg, gripLen });
}

// ---------------------------------------------------------------- the glass body: five half-cylinders cut along the body's middle
// A segment is a half-cylinder prism (the half nearer the viewer is cut away); its
// flat cut face carries the fluid section, the cells and the current lanes.
const SEGS = [];
function segment(name, o, a, r, len, { side = 1, current = true, host = null } = {}) {
  // A glass tube from o along a: metal caps outside [0, len], glass between.
  // Drawn as one item: the back wall, the section on the mid-plane (fluid,
  // cells, current), then the front glass with its shine.
  const n = G.unit3(G.sub3([0, 1, 0], G.mul3(a, G.dot3([0, 1, 0], a)))); // mid-plane faces +y as nearly as it can
  const u = G.unit3(G.cross3(n, a));
  const Fs = G.frameOf(o, a, u, n);
  const half = Array.from({ length: 25 }, (_, i) => {
    const t = Math.PI + (i / 24) * Math.PI;
    return [(r - WALL) * Math.cos(t), (r - WALL) * Math.sin(t)];
  });
  const rin = r - WALL;
  const m = planeMatrix(G.add3(o, G.mul3(n, 0.03)), a, u);
  const cw = 1.7;
  const pitch = 2.6;
  const cols = Math.max(2, Math.floor((2 * rin - 0.8) / pitch));
  const span = cols * pitch;
  const colY = Array.from({ length: cols }, (_, i) => -span / 2 + pitch / 2 + i * pitch);
  const gapY = Array.from({ length: cols + 1 }, (_, i) => -span / 2 + i * pitch);
  const cells = [];
  const cl = 5.4;
  const rowPitch = cl + 1.1;
  colY.forEach((y, ci) => {
    const off = (ci % 2) * rowPitch * 0.5;
    for (let s = 0.8 - off; s < len - 0.8; s += rowPitch) {
      const s0 = Math.max(0.7, s);
      const s1 = Math.min(len - 0.7, s + cl);
      if (s1 - s0 > 1.6) cells.push(roundRect(s0, s1, y - cw / 2, y + cw / 2, cw / 2, 3));
    }
  });
  const flat = (ring) => `M${ring.map(([x, y]) => `${x.toFixed(2)} ${y.toFixed(2)}`).join("L")}Z`;
  const back = `<g class="ib-wall">${S(G.prismOf(Fs, half, 0, len, P), { tone: "lo", crease: "none" })}</g>`;
  const section =
    `<g transform="${m}">` +
    `<path class="ib-ecw" d="M0 ${-rin}H${len}V${rin}H0Z"/>` +
    `<path class="ib-cell" d="${cells.map(flat).join("")}"/>` +
    `<g class="ib-dots" data-dots="${name}"></g>` +
    `</g>`;
  // shine: a narrow band on the glass toward the light, faded at both ends
  const sa = G.angleToward(Fs, G.lightOf(P)) * 0.5 + G.angleToward(Fs, V) * 0.5;
  const band = [0.1, 0.22].map((d) => sa + d);
  const shine = path3([
    G.pointOf(Fs, len * 0.06, r, band[0]),
    G.pointOf(Fs, len * 0.94, r, band[0]),
    G.pointOf(Fs, len * 0.94, r, band[1]),
    G.pointOf(Fs, len * 0.06, r, band[1]),
  ], true);
  const glass = `<g class="ib-glass">${S(G.disc(0, len, r, Fs, P, { rims: "none" }), { tone: "hi", crease: "none" })}<path class="ib-shine" d="${shine}"/></g>`;
  const seat = host ? { seated: true, cut: host } : {};
  const shape = record(A.disc(Fs, 0, len, r, { name: `body.${name}`, ...seat }));
  put(`body.${name}`, G.add3(o, G.mul3(a, len / 2)), back + section + glass, [shape], { attrs: ` data-seg="${name}"` });
  const capR = r + 0.6;
  const C = 1.6;
  pin(`body.${name}.cap0`, Fs, -C, 0, capR, { tone: "mid" }, { inner: Ln(G.arcOf(Fs, -C / 2, capR, P), { tone: "faint" }) });
  if (!host) pin(`body.${name}.cap1`, Fs, len, len + C, capR, { tone: "mid" }, { inner: Ln(G.arcOf(Fs, len + C / 2, capR, P), { tone: "faint" }) });
  SEGS.push({ name, o, a, u, n, r, rin, len, cap: 0, colY, gapY, m, current, side });
}
const CAP = 1.6;
// legs (from the sole up), trunk (from the pelvis up), arms (from the hand up to the shoulder)
for (const side of [1, -1]) {
  const y = side * LEG.y;
  box(`sole`, { x: -21, y: y - 4.4, w: 29, d: 8.8, r: 2.6 }, FP_Z[1] + 0.6, 2, { tone: "mid" }, { steps: 4, bevel: 0.3 });
  segment(side > 0 ? "legR" : "legL", [BODY_X, y, FP_Z[1] + 2.6 + CAP], [0, 0, 1], LEG.r, LEG.z1 - (FP_Z[1] + 2.6 + CAP) - CAP, { side, current: side > 0 });
}
box("pelvis", { x: BODY_X - 10, y: -LEG.y - 9, w: 20, d: 2 * LEG.y + 18, r: 6 }, LEG.z1, PELVIS[1] - LEG.z1, { tone: "mid" }, { steps: 6, bevel: 0.4, inner: Ln(k.sideSeam({ x: BODY_X - 10, y: -LEG.y - 9, w: 20, d: 2 * LEG.y + 18, r: 6 }, LEG.z1 + (PELVIS[1] - LEG.z1) / 2, P, 6), { tone: "faint" }) });
segment("trunk", [BODY_X, 0, PELVIS[1] + CAP], [0, 0, 1], TRUNK.r, TRUNK.z1 - PELVIS[1] - 2 * CAP);
// shoulder bar across the trunk's top cap, balls at each end
const BR = 6.5;
const BAR_Z = TRUNK.z1 + 2.4;
const barReach = SHOULDER[1] - Math.sqrt(BR * BR - 2.4 * 2.4);
const SHOULDER_BALLS = {};
for (const side of [1, -1]) SHOULDER_BALLS[side] = ball("shoulder", [SHOULDER[0], side * SHOULDER[1], BAR_Z], BR, { tone: "mid" });
pin("shoulder.bar", G.frameOf([BODY_X, -barReach, BAR_Z], [0, 1, 0], [1, 0, 0], [0, 0, 1]), 0, 2 * barReach, 2.4, { tone: "mid" }, { meta: { seated: true, cut: [SHOULDER_BALLS[1], SHOULDER_BALLS[-1]] } });
for (const g of GRIPS) {
  const shoulder = [SHOULDER[0], g.side * SHOULDER[1], BAR_Z];
  // the arm runs from just off the grip (its cap rim on the grip) to its cap rim on the shoulder ball
  const toShoulder = G.unit3(G.sub3(shoulder, g.grip));
  const capR = ARM_R + 0.6;
  const start = G.add3(g.grip, G.mul3(toShoulder, Math.sqrt(Math.max(0, 2.6 * 2.6 - 0)) + 0.4 + CAP));
  const end = G.add3(shoulder, G.mul3(toShoulder, -Math.sqrt(BR * BR - ARM_R * ARM_R)));
  segment(g.side > 0 ? "armR" : "armL", start, toShoulder, ARM_R, G.len3(G.sub3(end, start)), { side: g.side, current: g.side > 0, host: SHOULDER_BALLS[g.side] });
}

// ---------------------------------------------------------------- the bridge: five panel meters in the result-sheet layout, a frequency switch
const FACE = (() => {
  const [a, b] = [CONSOLE_POLY[2], CONSOLE_POLY[3]];
  const dir = G.unit3([0, b[0] - a[0], b[1] - a[1]]); // up the slope, toward −y
  const nrm = G.unit3([0, -dir[2], dir[1]]);
  const lenFace = Math.hypot(b[0] - a[0], b[1] - a[1]);
  const origin = [CONSOLE.x0, (CONSOLE.y0 + CONSOLE.y1) / 2 + a[0], a[1]];
  return { dir: G.mul3(dir, -1), nrm: nrm[1] < 0 ? G.mul3(nrm, -1) : nrm, lenFace, top: G.add3(origin, G.mul3(dir, lenFace)), origin };
})();
const DATA_SWITCH = {};
const METERS = {
  armR: { x: 7, y: 6.5 },
  trunk: { x: 24, y: 6.5 },
  armL: { x: 41, y: 6.5 },
  legR: { x: 15.5, y: 18.5 },
  legL: { x: 32.5, y: 18.5 },
};
const MET = { w: 13.5, h: 10, r: 1.4, piv: 3.2, len: 7.4, from: -50, span: 100, max: 500 };
{
  const Fc = G.frameOf([CONSOLE.x0, (CONSOLE.y0 + CONSOLE.y1) / 2, 0], [1, 0, 0], [0, 1, 0], [0, 0, 1]);
  // the face plane: local x along world x, local y down the slope from the back edge
  const m = planeMatrix(G.add3(FACE.top, G.mul3(FACE.nrm, 0.05)), [1, 0, 0], FACE.dir);
  const arcTicks = (cx, cy) => {
    const out = [];
    const major = [];
    for (let i = 0; i <= 10; i++) {
      const ang = ((MET.from + (i / 10) * MET.span) * Math.PI) / 180;
      const [sx, sy] = [Math.sin(ang), -Math.cos(ang)];
      const r0 = MET.len - (i % 2 === 0 ? 1.6 : 0.9);
      const seg = `M${(cx + sx * r0).toFixed(2)} ${(cy + sy * r0).toFixed(2)}L${(cx + sx * MET.len).toFixed(2)} ${(cy + sy * MET.len).toFixed(2)}`;
      (i % 2 === 0 ? major : out).push(seg);
    }
    return { minor: out.join(""), major: major.join("") };
  };
  let meters = "";
  for (const [name, c] of Object.entries(METERS)) {
    const x0 = c.x - MET.w / 2;
    const y0 = c.y - MET.h / 2;
    const piv = [c.x, y0 + MET.h - 1.6];
    const t = arcTicks(piv[0], piv[1]);
    const arcR = MET.len;
    const a0 = (MET.from * Math.PI) / 180;
    const a1 = ((MET.from + MET.span) * Math.PI) / 180;
    const arc = "M" + Array.from({ length: 41 }, (_, i) => {
      const t = a0 + ((a1 - a0) * i) / 40;
      return `${(piv[0] + Math.sin(t) * arcR).toFixed(2)} ${(piv[1] - Math.cos(t) * arcR).toFixed(2)}`;
    }).join("L");
    meters +=
      `<path class="ib-meter" d="${flatRect(x0, y0, MET.w, MET.h, MET.r)}"/>` +
      `<path class="iso-line" data-tone="mid" d="${flatRect(x0, y0, MET.w, MET.h, MET.r)}"/>` +
      `<path class="iso-line" data-tone="lo" d="${arc}"/>` +
      `<path class="iso-line" data-tone="lo" d="${t.minor}"/><path class="iso-line" data-tone="mid" d="${t.major}"/>` +
      `<path class="iso-line ib-needle" data-tone="hi" data-free="" data-needle="${name}" d="M${piv[0]} ${piv[1] + 1}L${piv[0]} ${piv[1] - MET.len + 0.4}" style="stroke-width:0.9"/>` +
      `<circle class="ib-hub" cx="${piv[0]}" cy="${piv[1]}" r="0.9"/>` +
      `<circle class="ib-screw" cx="${x0 + 1.1}" cy="${y0 + 1.1}" r="0.35"/><circle class="ib-screw" cx="${x0 + MET.w - 1.1}" cy="${y0 + 1.1}" r="0.35"/>`;
  }
  // frequency switch: four detents round a knob at the right of the bottom row
  const sw = { x: 44.5, y: 19 };
  const det = M.TRUTH.freqs.map((_, i) => {
    const ang = ((-60 + i * 40) * Math.PI) / 180;
    return [sw.x + Math.sin(ang) * 3.6, sw.y - Math.cos(ang) * 3.6];
  });
  meters += `<circle class="ib-meter" cx="${sw.x}" cy="${sw.y}" r="2.6"/><circle class="iso-line" data-tone="mid" cx="${sw.x}" cy="${sw.y}" r="2.6" style="fill:none"/>` + det.map(([x, y], i) => `<circle class="ib-detent" data-detent="${i}" cx="${x.toFixed(2)}" cy="${y.toFixed(2)}" r="0.55"/>`).join("") + `<path class="iso-line" data-tone="hi" data-part="switch" data-free="start" d="M${sw.x} ${sw.y}L${sw.x} ${sw.y - 2.2}" style="stroke-width:1.1"/>`;
  const faceSvg = `<g transform="${m}">${meters}</g>`;
  prism("console", Fc, CONSOLE_POLY, 0, CONSOLE.x1 - CONSOLE.x0, { tone: "mid" }, { extra: faceSvg + Dots([at([CONSOLE.x0 + 2, CONSOLE.y1 - 1.6, 7]), at([CONSOLE.x1 - 2, CONSOLE.y1 - 1.6, 7])], { size: 0.5 }) });
  DATA_SWITCH.sw = sw;
}
function flatRect(x, y, w, h, r) {
  return `M${x + r} ${y}H${x + w - r}Q${x + w} ${y} ${x + w} ${y + r}V${y + h - r}Q${x + w} ${y + h} ${x + w - r} ${y + h}H${x + r}Q${x} ${y + h} ${x} ${y + h - r}V${y + r}Q${x} ${y} ${x + r} ${y}Z`;
}

// one cable from the bridge to the column base, along the bench
{
  const a = stud("stud.console", [CONSOLE.x0, -8, 5], [-1, 0, 0]);
  const b = stud("stud.col", [COL.x, 0, FP_Z[1] + 6], [-1, 0, 0]);
  cable("cable.bridge", [a, [a[0] - 4, a[1], 5], [a[0] - 7, a[1], 1.6], [CONSOLE.x0 - 10, PLATE.y + 8, 1.6], [COL.x - 8, PLATE.y + 8, 1.6], [COL.x - 8, 0, 1.6], [b[0] - 5, 0, b[2]], b], 0.9);
}

// ---------------------------------------------------------------- assemble
const groups = F.assemble();
const LABEL_TEXT =
  "An InBody 580 body-composition analyser, with a glass body standing on its footplate and holding its grips. The body is five cylinders cut lengthwise: two thin arms, a wide short trunk and two legs. Inside each, long cells sit in fluid, and the measuring current runs through as a stream of dots: round the cells at low frequency, increasingly through them at high frequency. A console beside it carries five meters, one per segment; the arm and leg meters read several times higher than the trunk's.";
const svg = k.figureSvg({ width: W, height: H, label: LABEL_TEXT, body: [...back, ...groups] });

const DATA = {
  P,
  segs: SEGS.map(({ name, len, cap, colY, gapY, current }) => ({ name, len, cap, colY, gapY, current })),
  meter: MET,
  meters: METERS,
  sw: DATA_SWITCH.sw,
  screen: HEAD.screen.scr,
};
const MODEL_SRC = readFileSync(join(HERE, "model.mjs"), "utf8").replace(/^export /gm, "");
const LIVE = readFileSync(join(HERE, "live.js"), "utf8").replace("__DATA__", JSON.stringify(DATA));
const SCRIPT = `${MODEL_SRC}\n${LIVE}`;
const CSS = readFileSync(join(HERE, "figure.css"), "utf8");
const T = M.TRUTH;
const z50 = (s) => M.impedance(s, 50).Z.toFixed(0);
const CAPTION = [
  `The InBody 580 passes a tiny alternating current (${T.currentUA} µA, too small to feel) between electrodes under your palms and feet, at ${T.freqs.slice(0, 3).join(", ")} and ${T.freqs[3]} kHz, and reads the impedance of each arm, each leg and the trunk: ${T.readings} readings in about ${T.testSeconds} seconds. Water carries the current and fat resists it.`,
  `Cell membranes act like tiny capacitors. At low frequency they block the current, which flows round the cells through the water outside them; at higher frequencies more of it passes through the cells too. Comparing the two gives the share of body water outside cells (ECW/TBW; InBody's normal range is ${T.ecwNormal[0].toFixed(3)}–${T.ecwNormal[1].toFixed(3)}). Phase angle, read at 50 kHz, reflects how much intact cell membrane the current meets.`,
  `Resistance grows with length and falls with thickness, so a thin arm reads about ${z50("arm")} Ω at 50 kHz while the trunk, which holds about half the lean mass, reads about ${z50("trunk")} Ω. <small>Ohms are example values for an adult woman, not a reference range. The current really alternates thousands of times a second; it's drawn as a steady stream. Your report is read with your clinician.</small>`,
]
  .map((p) => `<span class="ib-par">${p}</span>`)
  .join("");
const body = plate({
  fig: "Fig 2",
  title: "Five cylinders on a bridge",
  hint: "Pick a frequency and a segment · or tap the drawing",
  stats: [
    { key: "freq", label: "Frequency", value: "5 kHz" },
    { key: "ohm", label: "Arm", value: "428 Ω" },
    { key: "ecw", label: "ECW/TBW", value: M.ecwTbw().toFixed(3) },
    { key: "pa", label: "Phase 50k", value: `${M.impedance("body", 50).pa.toFixed(1)}°` },
  ],
  controls: [
    { name: "freq", label: "Frequency", options: T.freqs.map((f, i) => ({ value: String(f), label: `${f} kHz`, pressed: i === 0 })) },
    { name: "seg", label: "Segment", options: [["arm", "Arm"], ["trunk", "Trunk"], ["leg", "Leg"], ["body", "Body"]].map(([value, label], i) => ({ value, label, pressed: i === 0 })) },
  ],
  keys: [
    { mark: "lit", label: "The measuring current" },
    { mark: "raised", label: "Cells (water inside) in fluid (water outside)" },
    { mark: "flat", label: "Meters: one per segment, laid out like the result sheet" },
  ],
  caption: CAPTION,
  body: `<div class="iso-stage ib-stage" tabindex="0" role="group" aria-label="InBody 580 with a glass body. Left and right arrows change the frequency, up and down change the segment.">${svg}</div><span class="ib-sr" role="status" aria-live="polite" data-status></span>`,
});
const out = THEME === "light" ? `${SLUG}-light.html` : `${SLUG}.html`;
writeFileSync(join(HERE, out), page({ title: "Five cylinders on a bridge", theme: THEME, body, css: CSS, script: SCRIPT }));
if (THEME === "light") {
  mkdirSync(join(HERE, "embed"), { recursive: true });
  writeFileSync(join(HERE, "embed", `optimal-fig-${SLUG}.js`), embed({ tag: `optimal-fig-${SLUG}`, body, script: SCRIPT, css: CSS }));
}
console.log("wrote", out, `${R.items.length} items`, `${R.solids.length} solids`, `scale ${KS.toFixed(3)}`);
// The arm tubes end with their rim on the shoulder balls; the 4 px² sliver at that rim was checked at 8× (shots/tmp/shoulder8x.png).
A.auditOrExit(R, P, { allow: [["body.armR", "shoulder"], ["body.armL", "shoulder"]] });
void V; void xframe; void vframe; void path3; void record; void cable; void HEAD;
