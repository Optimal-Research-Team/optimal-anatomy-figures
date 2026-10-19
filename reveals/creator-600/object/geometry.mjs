// Visbody Creator600 (Visbody-A600) running gait analysis treadmill, built part by part in millimetres.
//
// Frame: x is the machine's own right (the runner's LEFT, because the runner faces the tower), y runs from the
// tower (-y) to the rear of the deck (+y), z is up. The 50" portrait display faces +y, toward the runner and the
// viewer at yaw 0. Published: 2564 × 1024 × 2290 mm overall, 580 × 1620 mm running area, 50" LG 4K portrait
// display, 13.3" touch console, depth vision sensor under the screen. Everything else is estimated from Visbody's
// renders and the clinic's video against those numbers (see REPORT.md).
import * as G from "../kit/lathe.mjs";
const unit = G.unit3;
const sub = G.sub3;
const mul = G.mul3;
const dot = G.dot3;
const cross = G.cross3;
export const frame = (o, a, u) => {
  const A = unit(a);
  const U = unit(sub(u, mul(A, dot(u, A))));
  return { o, a: A, u: U, v: cross(A, U) };
};
const AX = { x: [1, 0, 0], y: [0, 1, 0], z: [0, 0, 1] };
const NX = [-1, 0, 0];
const NY = [0, -1, 0];
const NZ = [0, 0, -1];
const TAU = Math.PI * 2;

// ---------------------------------------------------------------- dimensions (mm)
export const DIM = {
  length: 2564, // published 2564.2
  width: 1024, // published 1024
  height: 2290, // published 2289.9
  run: [580, 1620], // published running area
  yBack: -1282, // tower back
  yRear: 1282, // deck rear
  deckTop: 252, // step-cover top (estimate)
  belt: [238, 242], // belt slab
  display: { half: 345, face: -1060, back: -1150, z0: 640, z1: 2290 },
  screen: { half: 311.5, z0: 1150, z1: 2257 }, // 50" 16:9 panel stood on end: 622.6 × 1106.8 active
  rail: { inner: 412, outer: 512, z0: 1000, z1: 1075, y0: -130, y1: 1082 },
  pod: { y0: -330, y1: -130, z1: 1160 },
};
const FONT = "'Public Sans',system-ui,sans-serif";
const MONO = "'Public Sans',system-ui,sans-serif";

const rrect = (x0, y0, x1, y1, r) =>
  `M${x0 + r} ${y0}H${x1 - r}A${r} ${r} 0 0 1 ${x1} ${y0 + r}V${y1 - r}A${r} ${r} 0 0 1 ${x1 - r} ${y1}H${x0 + r}A${r} ${r} 0 0 1 ${x0} ${y1 - r}V${y0 + r}A${r} ${r} 0 0 1 ${x0 + r} ${y0}Z`;
const line = (d, tone = "lo") => `<path class="iso-line" data-tone="${tone}" d="${d}"/>`;
const circ = (cx, cy, r) => `M${(cx + r).toFixed(2)} ${cy.toFixed(2)}A${r} ${r} 0 1 0 ${(cx - r).toFixed(2)} ${cy.toFixed(2)}A${r} ${r} 0 1 0 ${(cx + r).toFixed(2)} ${cy.toFixed(2)}Z`;
const txt = (x, y, s, size, style = "", anchor = "middle") =>
  `<text x="${x}" y="${y}" font-size="${size}" text-anchor="${anchor}" style="font-family:${FONT};${style}">${s}</text>`;

function roundedRect(u0, v0, u1, v1, r, steps = 6) {
  const out = [];
  const corner = (cu, cv, a0) => {
    for (let j = 0; j <= steps; j++) {
      const a = a0 + (j / steps) * (Math.PI / 2);
      out.push([cu + r * Math.cos(a), cv + r * Math.sin(a)]);
    }
  };
  corner(u0 + r, v0 + r, Math.PI);
  corner(u1 - r, v0 + r, 1.5 * Math.PI);
  corner(u1 - r, v1 - r, 0);
  corner(u0 + r, v1 - r, 0.5 * Math.PI);
  return out;
}

// ---------------------------------------------------------------- the screen: the depth camera's live view, redrawn every frame by featureDom()
function screenSvg() {
  const { half } = DIM.screen;
  const h = (DIM.screen.z1 - DIM.screen.z0) / 2;
  const ink = "#e9eadf";
  const leaf = "#a9d49c";
  const dim = "#6f8a68";
  const panel = (x0, y0, x1, y1, title) =>
    `<rect x="${x0}" y="${y0}" width="${x1 - x0}" height="${y1 - y0}" rx="6" style="fill:#132416;stroke:#2f4a32;stroke-width:1.2"/>` +
    (title ? txt(x0 + 12, y0 + 22, title, 12.5, `fill:${ink};opacity:.82;letter-spacing:.02em`, "start") : "");
  let s = `<rect x="${-half}" y="${-h}" width="${half * 2}" height="${h * 2}" style="fill:#0c160d"/>`;
  s += `<rect x="${-half}" y="${-h}" width="${half * 2}" height="${h * 2}" style="fill:url(#c6-scr-glow)"/>`;
  // status bar
  s += `<path d="M${-half + 24} ${-h + 52}H${half - 24}" style="stroke:#284028;stroke-width:1"/>`;
  s += txt(-half + 24, -h + 34, "Running form", 14, `fill:${ink};opacity:.9`, "start");
  for (const [i, x] of [half - 70, half - 48, half - 26].entries()) s += `<circle cx="${x}" cy="${-h + 29}" r="${4 - i * 0.6}" style="fill:${dim}"/>`;
  // timer pill
  s += `<rect x="-120" y="${-h + 78}" width="240" height="56" rx="10" style="fill:#132416;stroke:#355a37;stroke-width:1.4"/>`;
  s += `<circle cx="-82" cy="${-h + 106}" r="11" style="fill:none;stroke:${leaf};stroke-width:2"/><path d="M-82 ${-h + 99}V${-h + 106}L-77 ${-h + 109}" style="fill:none;stroke:${leaf};stroke-width:2;stroke-linecap:round"/>`;
  s += `<text data-c6="timer" x="18" y="${-h + 118}" font-size="34" text-anchor="middle" style="font-family:${MONO};fill:${ink};font-variant-numeric:tabular-nums;letter-spacing:.02em">00:00</text>`;
  // top-left: joint bars
  const T0 = -h + 156;
  s += panel(-half + 12, T0, -8, T0 + 196, "Joint load");
  for (const [i, n] of ["Hip L", "Hip R", "Knee L", "Knee R"].entries()) {
    const y = T0 + 58 + i * 36;
    s += txt(-half + 28, y + 4, n, 11.5, `fill:${ink};opacity:.7`, "start");
    s += `<rect x="${-half + 96}" y="${y - 3}" width="170" height="6" rx="3" style="fill:#22362a"/>`;
    s += `<rect data-c6="bar${i}" x="${-half + 96}" y="${y - 3}" width="60" height="6" rx="3" style="fill:${leaf}"/>`;
  }
  // top-right: live 3-D coordinates
  s += panel(8, T0, half - 12, T0 + 196, "3-D joint coordinates");
  for (const [i, n] of ["Hip L", "Hip R", "Knee L", "Knee R", "Ankle L", "Ankle R"].entries()) {
    const y = T0 + 50 + i * 24;
    s += txt(22, y + 4, n, 10.5, `fill:${leaf};opacity:.9`, "start");
    s += `<text data-c6="xyz${i}" x="${half - 26}" y="${y + 4}" font-size="10.5" text-anchor="end" style="font-family:${MONO};fill:${ink};opacity:.8;font-variant-numeric:tabular-nums">( 0, 0, 0 )</text>`;
  }
  // middle row: tilt gauges, the live skeleton view, knee tracks
  const M0 = T0 + 212;
  const M1 = M0 + 442;
  s += panel(-half + 12, M0, -150, M0 + 213, "Tilt L–R");
  s += panel(-half + 12, M0 + 229, -150, M1, "Tilt F–B");
  for (const [i, y] of [M0 + 150, M0 + 379].entries()) {
    s += `<path d="M${-half + 30} ${y}H${-168}" style="stroke:${dim};stroke-width:1;stroke-dasharray:2 4"/>`;
    s += `<path data-c6="tilt${i}" d="M${(-half - 150 + 12) / 2} ${y}l-10 -96h20z" style="fill:${leaf};opacity:.85"/>`;
  }
  s += panel(-136, M0, 136, M1, "");
  s += txt(0, M0 + 24, "Live skeleton · 3-D", 12.5, `fill:${ink};opacity:.82`);
  s += `<svg x="-130" y="${M0 + 34}" width="260" height="${M1 - M0 - 40}" viewBox="-130 -205 260 ${M1 - M0 - 40}" overflow="hidden">`;
  // ground grid in perspective
  let grid = "";
  for (let k = 0; k <= 6; k++) grid += `M${-30 - k * 16} 140L${-110 - k * 3} 200M${30 + k * 16} 140L${110 + k * 3} 200`;
  for (let k = 0; k < 4; k++) grid += `M${-60 - k * 14} ${150 + k * 15}H${60 + k * 14}`;
  s += `<path d="${grid}" style="fill:none;stroke:#26402a;stroke-width:1"/>`;
  s += `<rect data-c6="scan" x="-130" y="-120" width="260" height="3" style="fill:${leaf};opacity:.35"/>`;
  s += `<g data-c6="skel" style="opacity:0"><path data-c6="bones" d="" style="fill:none;stroke:${ink};stroke-width:3.2;stroke-linecap:round;stroke-linejoin:round"/>`;
  for (let j = 0; j < 15; j++) s += `<g data-c6="j${j}"><rect x="-8" y="-8" width="16" height="16" rx="2" style="fill:none;stroke:${leaf};stroke-width:1;opacity:.55"/><circle r="4.6" style="fill:${leaf};stroke:#0c160d;stroke-width:1.4"/></g>`;
  s += `</g></svg>`;
  s += panel(150, M0, half - 12, M0 + 213, "Knee L");
  s += panel(150, M0 + 229, half - 12, M1, "Knee R");
  for (const [i, y] of [M0 + 40, M0 + 269].entries()) {
    const cx = (150 + half - 12) / 2;
    s += `<path d="M${cx} ${y + 6}V${y + 160}" style="stroke:${dim};stroke-width:1;stroke-dasharray:2 4"/>`;
    s += `<rect x="${cx - 20}" y="${y + 6}" width="40" height="156" rx="20" style="fill:none;stroke:#2f4a32;stroke-width:1.2"/>`;
    s += `<circle data-c6="knee${i}" cx="${cx}" cy="${y + 84}" r="12" style="fill:none;stroke:${leaf};stroke-width:2"/>`;
  }
  // bottom row: landing position and vertical motion trace
  const B0 = M1 + 16;
  s += panel(-half + 12, B0, -8, B0 + 196, "Landing position");
  s += `<path d="M${-half + 36} ${B0 + 150}H-32" style="stroke:#2f4a32;stroke-width:5;stroke-linecap:round"/>`;
  s += `<path data-c6="land" d="M${-half + 36} ${B0 + 150}H${-half + 120}" style="stroke:${leaf};stroke-width:5;stroke-linecap:round"/>`;
  for (const [i, v] of ["0", "10", "20", "30"].entries()) s += txt(-half + 36 + i * 87, B0 + 176, v, 10.5, `fill:${ink};opacity:.6`);
  s += `<circle data-c6="landdot" cx="${-half + 120}" cy="${B0 + 100}" r="7" style="fill:${leaf}"/><path d="M${-half + 36} ${B0 + 100}H-32" style="stroke:${dim};stroke-width:1;stroke-dasharray:2 4"/>`;
  s += panel(8, B0, half - 12, B0 + 196, "Vertical motion");
  s += `<svg x="20" y="${B0 + 40}" width="${half - 44}" height="140" viewBox="0 0 ${half - 44} 140" overflow="hidden"><path d="M0 70H${half - 44}" style="stroke:${dim};stroke-width:1;stroke-dasharray:2 4"/><path data-c6="trace" d="" style="fill:none;stroke:${leaf};stroke-width:2.4;stroke-linejoin:round"/></svg>`;
  // bottom metrics
  const F0 = B0 + 226;
  for (const [i, [k, v, u]] of [["Speed", "8.0", "km/h"], ["Cadence", "165", "spm"], ["Distance", "0.00", "km"], ["Incline", "0", "%"]].entries()) {
    const x = -half + 80 + i * 154;
    s += txt(x, F0, k, 13, `fill:${ink};opacity:.7`);
    s += `<text data-c6="m${i}" x="${x - 4}" y="${F0 + 40}" font-size="32" text-anchor="end" style="font-family:${MONO};fill:${ink};font-variant-numeric:tabular-nums">${v}</text>`;
    s += txt(x, F0 + 40, u, 12, `fill:${ink};opacity:.6`, "start");
  }
  const defs = `<defs><radialGradient id="c6-scr-glow" cx=".5" cy=".42" r=".7"><stop offset="0" stop-color="#1c3a1f" stop-opacity=".9"/><stop offset="1" stop-color="#0c160d" stop-opacity="0"/></radialGradient></defs>`;
  return defs + s;
}

export function buildObject(T, { layer }) {
  const parts = {};
  const groups = {};
  const explode = [];
  const anchors = {};
  const features = [];
  const L = layer;
  const root = T.group("root", { free: { origin: [0, -60, 900] } });
  groups.root = root;
  const assembly = (name, dir, travel, delay = 0, parent = root) => {
    const g = T.group(name, { parent, slide: { direction: unit(dir), travel } });
    groups[name] = g;
    explode.push({ name, travel, delay });
    return g;
  };
  const part = (p) => (parts[p.name] = p);
  const prismOn =
    (axis, u) =>
    (name, group, poly, s0, s1, o = {}) =>
      part(
        T.prism({
          name,
          group,
          layer: L,
          F: frame([0, 0, 0], axis, u),
          polygon: poly,
          s0,
          s1,
          steps: 5,
          tone: o.tone ?? "hi",
          crease: o.crease ?? "lo",
          bevel: o.bevel ?? 0,
          material: o.material,
          lit: o.lit,
          details: o.details,
        }),
      );
  const prismX = prismOn(AX.x, AX.y); // polygon [y, z], extruded along x
  const prismY = prismOn(AX.y, AX.z); // polygon [z, x], extruded along y
  const prismZ = prismOn(AX.z, AX.x); // polygon [x, y], extruded along z
  const prismF = (name, group, F, poly, s0, s1, o = {}) =>
    part(T.prism({ name, group, layer: L, F, polygon: poly, s0, s1, steps: 5, tone: o.tone ?? "hi", crease: o.crease ?? "lo", bevel: o.bevel ?? 0, material: o.material, details: o.details }));
  const round = (name, group, F, s0, s1, r, o = {}) =>
    part(T.round({ name, group, layer: L, F, s0, s1, r, ends: o.ends, tone: o.tone ?? "hi", crease: o.crease ?? "lo", material: o.material, lit: o.lit, details: o.details }));
  const plane = (p, o, u, v, svg, normal, fade = [0.04, 0.3]) => T.plane({ part: p, o, u, v, svg, normal, fade });
  const box = (name, group, [x0, x1], [y0, y1], [z0, z1], o = {}) =>
    prismZ(name, group, o.r ? roundedRect(x0, y0, x1, y1, o.r, 6) : [[x0, y0], [x1, y0], [x1, y1], [x0, y1]], z0, z1, o);
  const up = (x, y) => frame([x, y, 0], AX.z, AX.x);
  const alongX = (y, z) => frame([0, y, z], AX.x, AX.y);
  // face drawing frames, seen from outside: u = the drawing's right, v = its down
  const FACE = {
    rear: { u: [-1, 0, 0], v: [0, 0, -1], n: AX.y }, // +y
    front: { u: [1, 0, 0], v: [0, 0, -1], n: NY }, // -y
    left: { u: [0, 1, 0], v: [0, 0, -1], n: AX.x }, // +x
    right: { u: [0, -1, 0], v: [0, 0, -1], n: NX }, // -x
    top: { u: [-1, 0, 0], v: [0, 1, 0], n: AX.z },
  };
  const side = (s) => (s > 0 ? "L" : "R"); // +x is the runner's left
  const D = DIM;

  // ================================================================ tower: base box, pedestal, compute bay
  const tower = assembly("tower", AX.z, 0, 0);
  const baseBox = box("base", tower, [-480, 480], [D.yBack, -1000], [50, 250], { material: "mist", tone: "hi" });
  for (const s of [1, -1]) {
    const x = s * 480.02;
    const f = s > 0 ? FACE.left : FACE.right;
    let svg = "";
    for (let i = 0; i < 3; i++) {
      const c = -1206 + i * 74; // three square inset panels on each side, as on the renders
      const cu = s > 0 ? c + 1141 : -(c + 1141);
      svg += `<rect x="${(cu - 26).toFixed(1)}" y="-74" width="52" height="40" rx="3" style="fill:#3b4636"/><path class="iso-line" data-tone="mid" d="${rrect(cu - 26, -74, cu + 26, -34, 3)}"/>`;
    }
    svg += line(`M-130 -10H130`, "faint");
    plane(baseBox, [x, -1141, 150], f.u, f.v, svg, f.n);
  }
  plane(baseBox, [0, D.yBack - 0.02, 150], FACE.front.u, FACE.front.v, line("M-440 -80H440M-440 70H440", "faint"), FACE.front.n);
  for (const [x, y] of [[-420, -1230], [420, -1230], [-420, -1050], [420, -1050]]) {
    const g = assembly(`foot.${x > 0 ? "L" : "R"}${y < -1100 ? "b" : "f"}`, NZ, 110, 0.3, tower);
    round(`foot.${x > 0 ? "L" : "R"}${y < -1100 ? "b" : "f"}`, g, up(x, y), 0, 50, 26, { material: "graphite", details: { seams: [12] } });
  }
  // pedestal: a hollow box under the display, its back chamfered up to the display's back
  const P = { y0: D.yBack, y1: D.display.face, z0: 250, z1: D.display.z0 };
  const pedFront = box("ped.front", tower, [-330, 330], [P.y1 - 15, P.y1], [P.z0, P.z1 - 2], { material: "sage" });
  plane(pedFront, [0, P.y1 + 0.02, 445], FACE.rear.u, FACE.rear.v, line(rrect(-300, -175, 300, 175, 8), "faint") + line("M-240 150H240", "faint"), FACE.rear.n);
  for (const s of [1, -1]) {
    const g = assembly(`ped.side.${side(s)}`, [s, 0, 0], 330, 0.1, tower);
    const p = prismX(`ped.side.${side(s)}`, g, [[P.y0, P.z0], [P.y1, P.z0], [P.y1, P.z1], [-1150, P.z1], [P.y0, 512]], s > 0 ? 330 : -345, s > 0 ? 345 : -330, { material: "sage" });
    let slots = "";
    for (let k = 0; k < 9; k++) slots += `M${-60 + k * 15} -40V40`;
    const f = s > 0 ? FACE.left : FACE.right;
    plane(p, [s * 345.02, -1170, 420], f.u, f.v, line(slots, "mid"), f.n);
  }
  const pedBackG = assembly("ped.back", NY, 260, 0.1, tower);
  box("ped.back", pedBackG, [-330, 330], [P.y0, P.y0 + 14], [P.z0, 506], { material: "sage" });
  const chamG = assembly("ped.chamfer", [0, -0.6, 0.8], 330, 0.06, tower);
  prismX("ped.chamfer", chamG, [[P.y0, 510], [-1150, 630], [-1137, 630], [P.y0 + 13, 510]], -330, 330, { material: "sage" });
  // compute: an x86 PC (Intel i5, 8 GB, 256 GB SSD per the brochure; its place in the tower is assumed) and its power supply
  const pcG = assembly("pc", AX.z, 420, 0.24, tower);
  const pc = box("pc", pcG, [-300, 120], [-1240, -1110], [262, 380], { material: "iron" });
  plane(pc, [-90, -1175, 380.02], FACE.top.u, FACE.top.v, line(Array.from({ length: 22 }, (_, i) => `M${-200 + i * 18} -50V50`).join(""), "lo"), FACE.top.n);
  const pcb = prismY("pc.board", pcG, roundedRect(270, -280, 372, 100, 3, 3), -1110, -1106, { material: "pcb" });
  plane(pcb, [-90, -1105.98, 321], FACE.rear.u, FACE.rear.v, line("M-150 -30H120M-150 -10H60M-150 10H90M-150 30H40", "lo") + `<rect x="40" y="-34" width="40" height="40" rx="2" style="fill:#2c3a28"/>`, FACE.rear.n);
  round("pc.fan", pcG, frame([-210, -1106, 321], AX.y, AX.z), 0, 14, 40, { material: "alloy", details: { seams: [7] } });
  const psuG = assembly("psu", AX.x, 320, 0.26, tower);
  box("psu", psuG, [150, 310], [-1240, -1110], [262, 360], { material: "iron" });

  // ================================================================ display: 50" portrait panel, depth camera under it
  const DS = D.display;
  const disp = assembly("display", AX.z, 400, 0.02, tower);
  const backG = assembly("display.back", NY, 300, 0.12, disp);
  const dBack = box("display.back", backG, [-DS.half, DS.half], [DS.back, DS.back + 15], [DS.z0, DS.z1], { material: "sage" });
  plane(dBack, [0, DS.back - 0.02, 1465], FACE.front.u, FACE.front.v, line(rrect(-300, -760, 300, 760, 12), "faint") + [-200, 200].flatMap((x) => [-200, 200].map((y) => `<circle cx="${x}" cy="${y}" r="5" style="fill:#5d6755"/>`)).join(""), FACE.front.n);
  for (const s of [1, -1]) {
    const g = assembly(`display.rim.${side(s)}`, [s, 0, 0], 220, 0.12, disp);
    box(`display.rim.${side(s)}`, g, s > 0 ? [330, 345] : [-345, -330], [DS.back + 15, DS.face], [DS.z0, DS.z1], { material: "sage" });
  }
  const rimTopG = assembly("display.rim.top", AX.z, 200, 0.1, disp);
  box("display.rim.top", rimTopG, [-330, 330], [DS.back + 15, DS.face], [2273, DS.z1], { material: "sage" });
  box("display.rim.bottom", disp, [-330, 330], [DS.back + 15, DS.face - 15], [DS.z0, 655], { material: "sage" });
  // LCD module behind the cover glass
  const lcdG = assembly("display.lcd", AX.y, 300, 0.15, disp);
  const lcd = box("display.lcd", lcdG, [-322, 322], [-1124, -1078], [1142, 2268], { material: "iron" });
  plane(lcd, [0, -1077.98, 1705], FACE.rear.u, FACE.rear.v, line(rrect(-310, -555, 310, 555, 4), "mid") + line("M-310 -300H310M-310 0H310M-310 300H310", "lo"), FACE.rear.n);
  // cover glass: the screen is drawn on it
  const glassG = assembly("display.glass", AX.y, 540, 0.06, disp);
  const glass = box("display.glass", glassG, [-330, 330], [DS.face - 15, DS.face], [1135, 2273], { material: "screen" });
  plane(glass, [0, DS.face + 0.02, (D.screen.z0 + D.screen.z1) / 2], FACE.rear.u, FACE.rear.v, screenSvg(), FACE.rear.n, [0.02, 0.12]);
  // chin under the screen, with the camera plate on it
  const chinG = assembly("display.chin", AX.y, 380, 0.08, disp);
  const chin = box("display.chin", chinG, [-330, 330], [DS.face - 15, DS.face], [692, 1133], { material: "sage" });
  plane(chin, [0, DS.face + 0.02, 800], FACE.rear.u, FACE.rear.v, line("M-300 70H300", "faint"), FACE.rear.n);
  const bandG = assembly("display.band", AX.y, 260, 0.1, disp);
  const band = box("display.band", bandG, [-330, 330], [DS.face - 15, DS.face], [641, 690], { material: "graphite" });
  {
    let slots = "";
    for (let k = 0; k < 40; k++) slots += `M${-292 + k * 15} -9V9`;
    plane(band, [0, DS.face + 0.02, 674], FACE.rear.u, FACE.rear.v, line(slots, "mid") + `<path data-c6="led" d="M-318 13H318" style="stroke:#a9d49c;stroke-width:2.2;stroke-linecap:round;opacity:.25"/>`, FACE.rear.n);
  }
  const camPlateG = assembly("camera.plate", AX.y, 700, 0.0, disp);
  const camPlate = box("camera.plate", camPlateG, [-48, 48], [DS.face, DS.face + 8], [905, 1125], { material: "ivory", r: 0 });
  {
    // depth vision sensor behind a dark window: RGB camera, two IR imagers and an IR projector stacked in the portrait slot (layout assumed)
    let svg = `<rect x="-28" y="-103" width="56" height="110" rx="9" style="fill:#0d170e"/>`;
    svg += `<path class="iso-line" data-tone="hi" d="${rrect(-28, -103, 28, 7, 9)}"/>`;
    const ap = (y, r, ring) => `<circle cy="${y}" r="${r}" style="fill:#16271a;stroke:${ring};stroke-width:1.2"/><circle cy="${y}" r="${(r * 0.45).toFixed(1)}" style="fill:#0a110b"/><circle cx="${-r * 0.3}" cy="${y - r * 0.3}" r="${(r * 0.18).toFixed(1)}" style="fill:#e9eadf;opacity:.7"/>`;
    svg += ap(-86, 7, "#5b7a58") + ap(-63, 9.5, "#4a6a48") + `<rect x="-6" y="-46" width="12" height="9" rx="2" style="fill:#1f2f22;stroke:#4a6a48;stroke-width:1"/>` + ap(-20, 9.5, "#4a6a48");
    svg += `<circle data-c6="camled" cy="-2" r="2.6" style="fill:#a9d49c;opacity:.3"/>`;
    for (const [x, y] of [[-38, -100], [38, -100], [-38, 100], [38, 100]]) svg += `<circle cx="${x}" cy="${y}" r="2.2" style="fill:#c9cdbf;stroke:#8e9884;stroke-width:.6"/>`;
    svg += line("M-30 40H30M-30 52H30", "faint");
    plane(camPlate, [0, DS.face + 8.02, 1015], FACE.rear.u, FACE.rear.v, svg, FACE.rear.n, [0.02, 0.2]);
  }
  const camBodyG = assembly("camera.body", AX.y, 220, 0.17, disp);
  const camBody = box("camera.body", camBodyG, [-34, 34], [-1112, -1078], [985, 1118], { material: "iron" });
  plane(camBody, [0, -1077.98, 1052], FACE.rear.u, FACE.rear.v, [-48, -26, 6, 30].map((y, i) => `<circle cy="${y}" r="${i % 2 ? 9 : 6}" style="fill:#0d170e;stroke:#8e9884;stroke-width:.8"/>`).join(""), FACE.rear.n);
  const camBoardG = assembly("camera.board", AX.y, 120, 0.2, disp);
  prismY("camera.board", camBoardG, roundedRect(960, -44, 1122, 44, 3, 3), -1131, -1116, { material: "pcb" });
  // two speakers in the chin (the brochure lists Hi-Fi audio; position assumed)
  for (const s of [1, -1]) {
    const g = assembly(`speaker.${side(s)}`, AX.y, 180, 0.18, disp);
    round(`speaker.${side(s)}`, g, frame([s * 200, -1130, 840], AX.y, AX.z), 0, 46, 52, { material: "iron", details: { seams: [30] } });
  }
  anchors.screen = [0, DS.face, (D.screen.z0 + D.screen.z1) / 2];
  anchors.screenSkel = [0, DS.face, (D.screen.z0 + D.screen.z1) / 2 + 10];
  anchors.camera = [0, DS.face + 8, 1040];
  anchors.display = [0, DS.face, 1500];
  anchors.tower = [0, -1170, 1100];

  // ================================================================ deck: frame, step covers, motor bay, rollers, board, belt
  const deck = assembly("deck", AX.z, 0, 0);
  const pan = box("pan", deck, [-305, 305], [-1000, 1100], [50, 64], { material: "iron" });
  for (const s of [1, -1]) {
    const fg = assembly(`frame.${side(s)}`, [s, 0, 0], 260, 0.3, deck);
    const fr = box(`frame.${side(s)}`, fg, s > 0 ? [305, 480] : [-480, -305], [-1000, 1100], [50, 230], { material: "sage" });
    const f = s > 0 ? FACE.left : FACE.right;
    const bolts = [-900, -200, 500, 1000].map((y) => `<circle cx="${(s > 0 ? y - 50 : -(y - 50)).toFixed(0)}" cy="-50" r="5" style="fill:#5d6755;stroke:#3b4636;stroke-width:.8"/>`).join("");
    plane(fr, [s * 480.02, 50, 140], f.u, f.v, line("M-1040 -60H1040M-1040 70H1040", "faint") + bolts, f.n);
    for (const y of [-160, 760]) {
      const g = assembly(`foot.${side(s)}${y}`, NZ, 110, 0.32, fg);
      round(`foot.${side(s)}${y}`, g, up(s * 420, y), 0, 50, 24, { material: "graphite", details: { seams: [12] } });
    }
    // step cover with a leaf accent strip along the belt edge (the real strip is orange-red)
    const sg = assembly(`step.${side(s)}`, AX.z, 260, 0.42, deck);
    const step = box(`step.${side(s)}`, sg, s > 0 ? [305, 480] : [-480, -305], [-1000, 1100], [230, D.deckTop], { material: "graphite" });
    let treads = "";
    for (let k = 0; k < 5; k++) treads += `M-1080 ${(-60 + k * 26).toFixed(0)}H1080`;
    plane(step, [s * 400, 50, D.deckTop + 0.02], [0, -1, 0], s > 0 ? [-1, 0, 0] : [1, 0, 0], line(treads, "mid"), AX.z);
    const stg = assembly(`stripe.${side(s)}`, AX.z, 150, 0.0, sg);
    box(`stripe.${side(s)}`, stg, s > 0 ? [312, 334] : [-334, -312], [-470, 1092], [D.deckTop, D.deckTop + 2.5], { material: "leaf" });
  }
  // motor bay cover between the tower and the belt
  const hoodG = assembly("hood", AX.z, 560, 0.0, deck);
  const hood = box("hood", hoodG, [-303, 303], [-1000, -514], [205, D.deckTop], { material: "mist" });
  {
    let vents = "";
    for (let k = 0; k < 9; k++) vents += rrect(-250 + k * 56, -40, -214 + k * 56, -32, 4);
    plane(hood, [0, -757, D.deckTop + 0.02], [-1, 0, 0], [0, 1, 0], line(vents, "mid") + line("M-280 100H280", "faint"), AX.z);
  }
  // drive: AC motor, flywheel, inverter (GWP-CP842A1-2.2 per the brochure), incline lift motor
  const motorG = assembly("motor", AX.z, 330, 0.14, deck);
  const MF = alongX(-780, 140);
  round("motor.body", motorG, MF, -150, 130, 60, { material: "iron", details: { ribs: { s0: -140, s1: 120, count: 36, fade: [0.08, 0.55], tone: "lo" } } });
  round("motor.bell.a", motorG, MF, -172, -150, 52, { material: "alloy", details: { bolts: [{ s: -172, r: 40, count: 4, size: 1.2, tone: "mid" }] } });
  round("motor.bell.b", motorG, MF, 130, 152, 52, { material: "alloy" });
  round("motor.shaft", motorG, MF, 152, 196, 10, { material: "alloy" });
  round("motor.flywheel", motorG, MF, 196, 224, 62, { material: "alloy", details: { seams: [204, 216], bolts: [{ s: 224, r: 44, count: 6, size: 1.4, tone: "lo" }] } });
  const invG = assembly("inverter", AX.z, 230, 0.18, deck);
  const inv = box("inverter", invG, [-290, -150], [-990, -860], [64, 186], { material: "iron" });
  plane(inv, [-220, -925, 186.02], FACE.top.u, FACE.top.v, line(Array.from({ length: 9 }, (_, i) => `M-60 ${-55 + i * 13}H60`).join(""), "lo"), FACE.top.n);
  const liftG = assembly("lift", AX.z, 260, 0.18, deck);
  round("lift.motor", liftG, alongX(-930, 118), 10, 170, 46, { material: "iron", details: { seams: [30, 150] } });
  // rollers (the belt wraps them) and the running board on SmartFlex dampers
  const rfG = assembly("roller.front", AX.z, 220, 0.12, deck);
  round("roller.front", rfG, alongX(-470, 200), -290, 290, 38, { material: "graphite", details: { seams: [-270, 270] } });
  const rrG = assembly("roller.rear", AX.y, 300, 0.1, deck);
  round("roller.rear", rrG, alongX(1192, 200), -290, 290, 38, { material: "graphite", details: { seams: [-270, 270] } });
  for (const s of [1, -1]) {
    box(`subframe.${side(s)}`, deck, s > 0 ? [238, 262] : [-262, -238], [-400, 1120], [64, 190], { material: "iron" });
  }
  const dampG = assembly("dampers", AX.z, 140, 0.2, deck);
  for (const s of [1, -1]) for (const y of [-260, 420, 1000]) round(`damper.${side(s)}${y}`, dampG, up(s * 250, y), 190, 211, 16, { material: "graphite" });
  const boardG = assembly("board", AX.z, 300, 0.1, deck);
  box("board", boardG, [-300, 300], [-428, 1150], [212, D.belt[0]], { material: "iron" });
  const beltG = assembly("belt", AX.z, 520, 0.0, deck);
  const belt = box("belt", beltG, [-295, 295], [-470, 1192], D.belt, { material: "graphite" });
  {
    // the belt's surface: a scrolling layer (featureDom moves [data-c6=tex] and [data-c6=seam] as the belt runs)
    const half = (1192 + 470) / 2;
    let tex = "";
    for (let k = -2; k * 16 < 2 * half + 48; k++) {
      const x = -half + k * 16;
      const off = k % 2 ? 12 : 0;
      for (let y = -286 + off; y < 286; y += 24) tex += `M${x} ${y}h7`;
    }
    const svg =
      `<svg x="${-half}" y="-295" width="${2 * half}" height="590" viewBox="${-half} -295 ${2 * half} 590" overflow="hidden">` +
      `<g data-c6="tex"><path class="iso-line" data-tone="mid" d="${tex}"/></g>` +
      `<path data-c6="seam" d="M0 -295V295" style="stroke:#8e9884;stroke-width:3;opacity:.55"/><path data-c6="seam" d="M0 -295V295" style="stroke:#8e9884;stroke-width:3;opacity:.55"/>` +
      `</svg>`;
    plane(belt, [0, (1192 - 470) / 2, D.belt[1] + 0.02], [0, -1, 0], [-1, 0, 0], svg, AX.z);
  }
  // rear end caps with castor wheels
  for (const s of [1, -1]) {
    const cg = assembly(`endcap.${side(s)}`, AX.y, 330, 0.08, deck);
    const cap = prismZ(`endcap.${side(s)}`, cg, s > 0 ? roundedRect(305, 1100, 480, D.yRear, 30) : roundedRect(-480, 1100, -305, D.yRear, 30), 90, D.deckTop, { material: "sage" });
    const f = s > 0 ? FACE.left : FACE.right;
    const holes = [1150, 1225].map((y) => `<circle cx="${s > 0 ? y - 1191 : -(y - 1191)}" cy="-6" r="9" style="fill:#2b3428"/><path class="iso-line" data-tone="hi" d="${circ(s > 0 ? y - 1191 : -(y - 1191), -6, 9)}"/>`).join("");
    plane(cap, [s * 480.02, 1191, 171], f.u, f.v, holes, f.n);
    plane(cap, [s * 392, D.yRear + 0.02, 171], FACE.rear.u, FACE.rear.v, line("M-60 -40H60", "faint"), FACE.rear.n);
    const wg = assembly(`castor.${side(s)}`, NZ, 140, 0.22, cg);
    box(`castor.bracket.${side(s)}`, wg, s > 0 ? [392, 438] : [-438, -392], [1180, 1240], [70, 90], { material: "iron" });
    round(`castor.${side(s)}`, wg, frame([s * 402, 1210, 36], AX.x, AX.y), s > 0 ? 0 : -26, s > 0 ? 26 : 0, 32, { material: "graphite", details: { seams: [s > 0 ? 13 : -13] } });
  }
  anchors.belt = [0, 380, D.belt[1]];
  anchors.beltRear = [0, 1100, D.belt[1]];
  anchors.motor = [0, -780, 140];
  anchors.rear = [-392, D.yRear, 171];

  // ================================================================ sides: slanted panels, handrails, console pods
  const R = D.rail;
  for (const s of [1, -1]) {
    const n = side(s);
    const sideG = assembly(`side.${n}`, [s, 0, 0], 0, 0);
    const shoeG = assembly(`shoe.${n}`, [s, 0, 0], 380, 0.16, sideG);
    box(`shoe.${n}`, shoeG, s > 0 ? [440, 484] : [-484, -440], [-562, 282], [D.deckTop, 330], { material: "sage", r: 0 });
    const panelG = assembly(`panel.${n}`, [s, 0, 0], 520, 0.1, sideG);
    const panel = prismX(`panel.${n}`, panelG, [[-540, 330], [260, 330], [513, 998], [-287, 998]], s > 0 ? 447 : -477, s > 0 ? 477 : -447, { material: "mist", crease: "faint" });
    {
      const f = s > 0 ? FACE.left : FACE.right;
      // drawing frame centred at y = -14, z = 664: u along f.u, v down
      const pt = (y, z) => [s > 0 ? y + 14 : -(y + 14), -(z - 664)];
      const sc = [[-490, 370], [220, 370], [470, 960], [-250, 960]].map(([y, z]) => pt(y, z));
      let svg = sc.map(([u, v]) => `<circle cx="${u}" cy="${v}" r="4.2" style="fill:#a5ab99;stroke:#6f7a66;stroke-width:.8"/>`).join("");
      const edge = [[-500, 350], [230, 350], [478, 978], [-258, 978]].map(([y, z]) => pt(y, z));
      svg += line(`M${edge.map((p) => p.join(" ")).join("L")}Z`, "faint");
      plane(panel, [s * 477.02, -14, 664], f.u, f.v, svg, f.n);
    }
    // handrail and console pod lift off together
    const railG = assembly(`rail.${n}`, AX.z, 450, 0.0, sideG);
    const xr = s > 0 ? [R.inner, R.outer] : [-R.outer, -R.inner];
    const rail = prismZ(`rail.${n}`, railG, s > 0 ? roundedRect(R.inner, R.y0, R.outer, R.y1, 16) : roundedRect(-R.outer, R.y0, -R.inner, R.y1, 16), R.z0, R.z1, { material: "sage" });
    plane(rail, [s * 462, 476, R.z1 + 0.02], [0, -1, 0], s > 0 ? [-1, 0, 0] : [1, 0, 0], line("M-590 -34H590M-590 34H590", "faint"), AX.z);
    const capG = assembly(`railcap.${n}`, AX.y, 110, 0.0, railG);
    prismZ(`railcap.${n}`, capG, s > 0 ? roundedRect(R.inner + 4, R.y1, R.outer - 4, R.y1 + 18, 6) : roundedRect(-R.outer + 4, R.y1, -R.inner - 4, R.y1 + 18, 6), R.z0 + 6, R.z1 - 6, { material: "graphite" });
    // pod: chamfered top, cup trays and three buttons on top, fan grille facing the runner
    const pod = prismX(`pod.${n}`, railG, [[D.pod.y0, R.z0], [D.pod.y1, R.z0], [D.pod.y1, 1140], [D.pod.y1 - 22, D.pod.z1], [D.pod.y0 + 22, D.pod.z1], [D.pod.y0, 1140]], xr[0], xr[1], { material: "sage" });
    {
      // top: two storage trays toward the display, the buttons toward the runner
      const svg =
        `<rect x="-38" y="-78" width="76" height="62" rx="9" style="fill:#2b3428"/><path class="iso-line" data-tone="hi" d="${rrect(-38, -78, 38, -16, 9)}"/>` +
        `<rect x="-38" y="-10" width="76" height="34" rx="7" style="fill:#2b3428"/><path class="iso-line" data-tone="hi" d="${rrect(-38, -10, 38, 24, 7)}"/>`;
      plane(pod, [s * 462, -230, D.pod.z1 + 0.02], [-1, 0, 0], [0, 1, 0], svg, AX.z);
      const f = s > 0 ? FACE.right : FACE.left;
      plane(pod, [s * (R.inner - 0.02), -230, 1095], s > 0 ? [0, -1, 0] : [0, 1, 0], [0, 0, -1], line(circ(s > 0 ? 20 : -20, -9, 24), "mid"), s > 0 ? NX : AX.x);
    }
    const btnG = assembly(`buttons.${n}`, AX.z, 120, 0.0, railG);
    // a dark key bed under the three keys; the keys float 3 mm above it so the "+" can go down
    const bedX = s > 0 ? [R.inner + 6, R.outer - 6] : [-R.outer + 6, -R.inner - 6];
    box(`keybed.${n}`, btnG, bedX, [-186, -148], [D.pod.z1, D.pod.z1 + 1.5], { material: "graphite", r: 4 });
    const icons = { "-": "M-6 0H6", go: "M-4 -6L6 0L-4 6Z", "+": "M-6 0H6M0 -6V6" };
    // as the runner sees them, left to right: − ▶ + (the runner's left is +x)
    for (const [i, key] of ["-", "go", "+"].entries()) {
      const x0 = s > 0 ? R.outer - 33 - i * 29 : -R.inner - 33 - i * 29;
      // the "+" on the runner's left pod is the one pressed in the film (speed up)
      const pressG = key === "+" ? T.group(`press.${n}`, { parent: btnG, slide: { direction: NZ, travel: 2.5 } }) : btnG;
      if (key === "+") groups[`press.${n}`] = pressG;
      const b = prismZ(`button.${n}${i}`, pressG, roundedRect(x0, -182, x0 + 25, -152, 5, 4), D.pod.z1 + 4.5, D.pod.z1 + 11, { material: "mist", bevel: 0.6 });
      plane(b, [x0 + 12.5, -167, D.pod.z1 + 11.02], [-1, 0, 0], [0, 1, 0], `<path d="${icons[key]}" style="fill:${key === "go" ? "#2c4e25" : "none"};stroke:#2c4e25;stroke-width:1.8;stroke-linecap:round;stroke-linejoin:round"/>`, AX.z);
      if (key === "+") anchors[`button.${n}`] = [x0 + 12.5, -167, D.pod.z1 + 11];
    }
    const grG = assembly(`grille.${n}`, AX.y, 130, 0.0, railG);
    const grille = box(`grille.${n}`, grG, s > 0 ? [R.inner + 12, R.outer - 12] : [-R.outer + 12, -R.inner - 12], [D.pod.y1, D.pod.y1 + 6], [1084, 1136], { material: "ivory" });
    {
      let lv = "";
      for (let k = 0; k < 6; k++) lv += `M-34 ${-22 + k * 8.8}H34`;
      plane(grille, [s * 462, D.pod.y1 + 6.02, 1110], FACE.rear.u, FACE.rear.v, line(lv + "M0 -26V26", "mid") + line(rrect(-36, -27, 36, 27, 3), "hi"), FACE.rear.n);
    }
    anchors[`pod.${n}`] = [s * 462, -200, D.pod.z1];
    anchors[`grille.${n}`] = [s * 462, D.pod.y1 + 6, 1110];
    anchors[`panel.${n}`] = [s * 477, -14, 664];
  }

  // ================================================================ front handlebar: hand-grip heart-rate electrodes and a safety switch
  const barG = assembly("handlebar", AX.z, 780, 0.0);
  const BAR = {};
  {
    const zc = 1104;
    const route = [];
    // from the left pod's inner face, straight inboard, then sweeping toward the display and across
    const ctrl = [
      [R.inner, -250, zc],
      [318, -250, zc],
      [230, -286, zc - 6],
      [120, -338, zc - 14],
      [0, -356, zc - 16],
    ];
    const pts = [...ctrl, ...ctrl.slice(0, -1).reverse().map(([x, y, z]) => [-x, y, z])];
    for (let i = 0; i < pts.length - 1; i++) {
      const a = pts[i];
      const b = pts[i + 1];
      const n = Math.max(2, Math.ceil(Math.hypot(b[0] - a[0], b[1] - a[1], b[2] - a[2]) / 12));
      for (let j = i ? 1 : 0; j <= n; j++) route.push([a[0] + ((b[0] - a[0]) * j) / n, a[1] + ((b[1] - a[1]) * j) / n, a[2] + ((b[2] - a[2]) * j) / n]);
    }
    // smooth the corners a little (keep the end segments straight for the electrodes)
    for (let pass = 0; pass < 6; pass++)
      for (let i = 9; i < route.length - 9; i++) route[i] = route[i].map((v, k) => (route[i - 1][k] + 2 * v + route[i + 1][k]) / 4);
    let total = 0;
    for (let i = 1; i < route.length; i++) total += Math.hypot(...route[i].map((v, k) => v - route[i - 1][k]));
    // two gaps on the straight ends hold the electrode sleeves
    const tube = T.tube({ name: "bar", group: barG, layer: L, route, r: 17, chunk: 160, turn: 24, material: "graphite", tone: "hi", gaps: [[8, 82], [total - 82, total - 8]], caps: true });
    for (const c of tube.chunks) parts[c.name] = c;
    const mid = route.reduce((a, b) => (Math.abs(b[0]) < Math.abs(a[0]) ? b : a));
    BAR.mid = mid;
  }
  for (const s of [1, -1]) {
    const g = assembly(`electrode.${side(s)}`, AX.z, 110, 0.0, barG);
    if (s > 0) round(`electrode.${side(s)}`, g, frame([0, -250, 1104], AX.x, AX.y), R.inner - 80, R.inner - 10, 18, { material: "alloy", details: { seams: [R.inner - 45] } });
    else round(`electrode.${side(s)}`, g, frame([0, -250, 1104], AX.x, AX.y), -(R.inner - 10), -(R.inner - 80), 18, { material: "alloy", details: { seams: [-(R.inner - 45)] } });
  }
  const safG = assembly("safety", AX.z, 160, 0.0, barG);
  box("safety", safG, [-20, 20], [BAR.mid[1] - 16, BAR.mid[1] + 16], [BAR.mid[2] + 19, BAR.mid[2] + 40], { material: "leaf", r: 5 });
  anchors.handlebar = [0, BAR.mid[1], BAR.mid[2]];
  anchors.electrode = [R.inner - 45, -250, 1104];

  // ================================================================ 13.3" touch console on a post off the right pod (runner's right)
  const tabG = assembly("tablet", AX.z, 950, 0.0);
  {
    const x = -462;
    round("tablet.post", tabG, up(x, -290), D.pod.z1, 1352, 15, { material: "graphite" });
    box("tablet.head", tabG, [x - 22, x + 22], [-312, -268], [1352, 1392], { material: "graphite", r: 8 });
    const th = (14 * Math.PI) / 180;
    const n = [0, Math.cos(th), Math.sin(th)];
    const upv = [0, -Math.sin(th), Math.cos(th)];
    const bottom = [x - 40, -290, 1396];
    const c = G.add3(bottom, mul(upv, 106));
    const F = { o: c, a: n, u: [1, 0, 0], v: upv };
    const tab = prismF("tablet", tabG, F, roundedRect(-170, -106, 170, 106, 12, 4), -9, 9, { material: "graphite" });
    let svg = `<rect x="-160" y="-94" width="320" height="180" rx="5" style="fill:#0c160d"/>`;
    svg += `<rect x="-148" y="-82" width="296" height="22" rx="4" style="fill:#132416"/>`;
    for (let i = 0; i < 4; i++) svg += `<rect x="${-148 + i * 76}" y="-48" width="68" height="96" rx="6" style="fill:${["#25432a", "#1d3522", "#2c4e25", "#1d3522"][i]};stroke:#355a37;stroke-width:1"/>`;
    svg += `<rect x="-148" y="58" width="296" height="18" rx="4" style="fill:#132416"/><rect x="-148" y="58" width="120" height="18" rx="4" style="fill:#a9d49c;opacity:.5"/>`;
    plane(tab, G.add3(c, mul(n, 9.02)), [-1, 0, 0], mul(upv, -1), svg, n, [0.02, 0.2]);
    anchors.tablet = G.add3(c, mul(n, 9));
  }

  anchors.body = [0, -60, 900];
  anchors.hero = [0, -120, 1000];
  anchors.front = [0, -700, 1200];
  for (let i = 0; i <= 5; i++) features.push({ "press.L": i * 0.5 });
  return { parts, groups, explode, root, anchors, features, counts: {} };
}
export function explodeValues(explode, apart, { stretch = 0.55 } = {}) {
  const out = {};
  for (const { name, travel, delay } of explode) {
    const t = Math.max(0, Math.min(1, (apart - delay * stretch) / (1 - stretch)));
    out[name] = travel * t * t * (3 - 2 * t);
  }
  return out;
}
