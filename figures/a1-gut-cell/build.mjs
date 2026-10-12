// A1 · The gut cell's gate (anatomical series, inset for Fig 3).
//
// A cut-away block of gut lining in isometric 3-D. The front face is one
// duodenal lining cell between two neighbours, in section: microvilli on top
// with DMT1 channels (iron in), the cytoplasm with ferritin cages and the
// nucleus, ferroportin channels on the base (iron out), and the capillary
// below with red cells and transferrin. The top is the brush border seen from
// above, a field of microvilli with the cell borders as grooves; the right end
// shows the cells cut along their length and the capillary as a half-tube.
// Hepcidin from the blood docks on ferroportin and the cell pulls the channel
// in and breaks it down. The three scenes take their gate share from Fig 3's model.
//
//   node build.mjs | --light
import { mkdirSync, readFileSync, writeFileSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";
import { plate, page, embed } from "../../shared/page.mjs";
import { figkit, k } from "../../shared/figkit.mjs";
import * as M3 from "../03-iv-iron/model.mjs";
import * as M from "./model.mjs";

const HERE = dirname(fileURLToPath(import.meta.url));
const THEME = process.argv.includes("--light") ? "light" : "dark";
const SLUG = "gut-cell";
const W = 600;
const H = 640;

// ---------------------------------------------------------------- the scenes, from Fig 3's model (gate = share of ferroportin working)
const daily = M3.simulate("daily");
const iv = M3.simulate("iv");
const SCENES = [
  { key: "hungry", label: "Iron-hungry", gate: daily.gate[0], line: "Low iron, low hepcidin: every gate open." },
  { key: "pills", label: "Daily pills", gate: daily.gate[24 * 7 - 1], line: "A week of daily pills: each dose raises hepcidin for about a day." },
  { key: "full", label: "Stores full", gate: iv.gate[24 * 14], line: "Two weeks after an IV infusion: stores full, hepcidin up." },
];

// ---------------------------------------------------------------- organic outlines: Catmull-Rom through points, as cubic Béziers
const f = (v) => v.toFixed(1);
function smooth(points, closed = true, tension = 1) {
  const n = points.length;
  const at = (i) => points[closed ? (i + n) % n : Math.max(0, Math.min(n - 1, i))];
  let d = `M${f(points[0][0])} ${f(points[0][1])}`;
  for (let i = 0; i < (closed ? n : n - 1); i++) {
    const p0 = at(i - 1), p1 = at(i), p2 = at(i + 1), p3 = at(i + 2);
    const c1 = [p1[0] + ((p2[0] - p0[0]) / 6) * tension, p1[1] + ((p2[1] - p0[1]) / 6) * tension];
    const c2 = [p2[0] - ((p3[0] - p1[0]) / 6) * tension, p2[1] - ((p3[1] - p1[1]) / 6) * tension];
    d += `C${f(c1[0])} ${f(c1[1])} ${f(c2[0])} ${f(c2[1])} ${f(p2[0])} ${f(p2[1])}`;
  }
  return d + (closed ? "Z" : "");
}
const blob = (cx, cy, rx, ry, wob = 0.04, n = 10, seed = 1) =>
  smooth(Array.from({ length: n }, (_, i) => {
    const a = (i / n) * Math.PI * 2;
    const w = 1 + wob * Math.sin(a * 3 + seed) + wob * 0.6 * Math.cos(a * 5 + seed * 2);
    return [cx + rx * w * Math.cos(a), cy + ry * w * Math.sin(a)];
  }));
const pill = (x, y, w, h) => `M${f(x + w / 2)} ${f(y)}h${f(0)}a${f(w / 2)} ${f(w / 2)} 0 0 1 ${f(w / 2)} ${f(w / 2)}v${f(h - w)}a${f(w / 2)} ${f(w / 2)} 0 0 1 ${f(-w)} 0v${f(-(h - w))}a${f(w / 2)} ${f(w / 2)} 0 0 1 ${f(w / 2)} ${f(-w / 2)}Z`;

// ---------------------------------------------------------------- layout
const APICAL = 150; //  top membrane of the cells
const BASAL = 528; //   base membrane
const CELL = { x0: 150, x1: 450 };
const NEIGH = [{ x0: 20, x1: 144 }, { x0: 456, x1: 580 }];
const VILLI = { y0: 108, w: 13, gap: 7 };
const FERRITIN = [[214, 248], [388, 236], [300, 318]];
const FPN = [192, 246, 300, 354, 408]; // ferroportin places on the base
const CAP = { y0: 560, y1: 616 };
const DMT1 = [];

const cellPath = (x0, x1, seed) => {
  const pts = [];
  const n = 6;
  for (let i = 0; i <= n; i++) pts.push([x0 + ((x1 - x0) * i) / n, APICAL + (i % 2 ? 0.8 : -0.6)]);
  for (let i = 1; i <= 7; i++) pts.push([x1 + 3 * Math.sin(i + seed), APICAL + ((BASAL - APICAL) * i) / 8]);
  pts.push([x1 - 8, BASAL + 2]);
  for (let i = n - 1; i >= 1; i--) pts.push([x0 + ((x1 - x0) * i) / n, BASAL + (i % 2 ? 2.5 : 1)]);
  pts.push([x0 + 8, BASAL + 2]);
  for (let i = 7; i >= 1; i--) pts.push([x0 + 3 * Math.sin(i * 1.3 + seed), APICAL + ((BASAL - APICAL) * i) / 8]);
  return smooth(pts);
};

const parts = [];
// the lining is a solid sheet in the block: the space between cells is filled, the lumen above is open
parts.push(`<rect class="b1-lateral" x="${NEIGH[0].x0}" y="${APICAL - 2}" width="${NEIGH[1].x1 - NEIGH[0].x0}" height="${BASAL - APICAL + 6}"/>`);
parts.push(`<rect class="a1-tissue" x="0" y="${BASAL - 2}" width="${W}" height="${H - BASAL + 2}"/>`);
// microvilli across all three cells (drawn first; the cells' tops cover their roots)
const villi = [];
for (let x = 22; x + VILLI.w <= 578; x += VILLI.w + VILLI.gap) {
  if ((x > NEIGH[0].x1 - 8 && x < CELL.x0 + 2) || (x > CELL.x1 - 8 && x < NEIGH[1].x0 + 2)) continue;
  const main = x > CELL.x0 && x + VILLI.w < CELL.x1;
  const h = 44 + 4 * Math.sin(x * 0.37);
  villi.push(`<path class="a1-villus${main ? "" : " a1-dim"}" d="${pill(x, APICAL - h + 4, VILLI.w, h + 6)}"/>`);
  if (main && villi.length % 3 === 1) DMT1.push([x + VILLI.w / 2, APICAL - h + 10]);
}
parts.push(`<g>${villi.join("")}</g>`);
// neighbours, then the cell
for (const [i, n] of NEIGH.entries()) parts.push(`<path class="a1-cell a1-dim" d="${cellPath(i ? n.x0 : n.x0 - 30, i ? n.x1 + 30 : n.x1, i * 2 + 1)}"/>`);
parts.push(`<path class="a1-cell" d="${cellPath(CELL.x0, CELL.x1, 0.4)}"/>`);
// terminal web under the brush border, tight junctions at the top corners
parts.push(`<path class="a1-web" d="${smooth([[CELL.x0 + 10, APICAL + 9], [300, APICAL + 12], [CELL.x1 - 10, APICAL + 9], [CELL.x1 - 10, APICAL + 15], [300, APICAL + 18], [CELL.x0 + 10, APICAL + 15]], true, 0.6)}"/>`);
for (const x of [CELL.x0 - 3, CELL.x1 + 3]) parts.push(`<path class="a1-junction" d="${pill(x - 2.5, APICAL + 2, 5, 18)}"/>`);
// DMT1 channels at the tips of every third villus
parts.push(DMT1.map(([x, y]) => `<g class="a1-dmt1"><path d="${pill(x - 5.4, y - 6, 4.6, 12)}"/><path d="${pill(x + 0.8, y - 6, 4.6, 12)}"/></g>`).join(""));
// organelles: mitochondria, the nucleus with its nucleolus
for (const [x, y, rx, ry, s] of [[196, 380, 22, 9, 1], [404, 372, 20, 9, 2], [250, 196, 18, 8, 3], [362, 300, 19, 8, 4]]) parts.push(`<path class="a1-mito" d="${blob(x, y, rx, ry, 0.05, 10, s)}"/><path class="a1-mito-in" d="${blob(x, y, rx * 0.62, ry * 0.42, 0.12, 10, s + 1)}"/>`);
parts.push(`<path class="a1-nucleus" d="${blob(300, 440, 76, 46, 0.03, 12, 2)}"/><path class="a1-nucleolus" d="${blob(318, 432, 16, 11, 0.06, 9, 5)}"/>`);
// ferritin cages: a shell of 24 subunits round an iron core (the page fills the core)
parts.push(FERRITIN.map(([x, y], i) => {
  const dots = Array.from({ length: 24 }, (_, j) => {
    const a = (j / 24) * Math.PI * 2;
    return `<circle cx="${f(x + 15 * Math.cos(a))}" cy="${f(y + 15 * Math.sin(a))}" r="2.6"/>`;
  }).join("");
  return `<g class="a1-ferritin"><circle class="a1-core" cx="${x}" cy="${y}" r="11"/>${dots}<g data-part="core${i}"></g></g>`;
}).join(""));
// the basement lamina and the capillary
parts.push(`<rect class="a1-lamina" x="0" y="${BASAL + 10}" width="${W}" height="5" rx="2.5"/>`);
parts.push(`<rect class="a1-blood" x="0" y="${CAP.y0}" width="${W}" height="${CAP.y1 - CAP.y0}"/>`);
parts.push(`<rect class="a1-endo" x="0" y="${CAP.y0 - 6}" width="${W}" height="6" rx="3"/><rect class="a1-endo" x="0" y="${CAP.y1}" width="${W}" height="6" rx="3"/>`);
// slots the page fills
parts.push(`<g data-part="vesicles"></g><g data-part="fpn"></g><g data-part="blood"></g><g data-part="iron"></g><g data-part="hep"></g>`);

// ---------------------------------------------------------------- the isometric block: the section above is its front face
// World units = section px: x along the section, y back into the lining (front face at y = D), z up.
const X0 = NEIGH[0].x0;
const X1 = NEIGH[1].x1;
const L = X1 - X0;
const D = 210;
const W3 = (sx, y, sy) => [sx - X0, y, H - sy];
const VTOP = 100; // tallest microvillus tip, as a section y
const BOUNDS3 = [[0, 0, H - VTOP], [L, 0, H - VTOP], [0, D, H], [L, D, H], [0, 0, 0], [L, 0, 0], [0, D, 0], [L, D, 0], W3(170, D, 10), W3(430, D, 10)];
const VIEW_W = 600;
const probe = k.fitProjection(BOUNDS3, VIEW_W, 4000, { pad: 8, azimuth: 62, elevation: 24 });
const ys = BOUNDS3.map((p) => k.iso(p, probe)[1]);
const VIEW_H = Math.ceil(Math.max(...ys) - Math.min(...ys) + 16);
const PB = k.fitProjection(BOUNDS3, VIEW_W, VIEW_H, { pad: 8, azimuth: 62, elevation: 24 });
const FB = figkit(PB);
const at = (p) => k.iso(p, PB);
const p3 = (pts, close = true) => FB.path3(pts, close);
const fx = (v) => v.toFixed(1);
const sinE = Math.sin((24 * Math.PI) / 180);

// the cells seen from above: a loose honeycomb. The front row is cut by the front face, so its borders meet the
// section's cell borders (x = 147, 453); the back row sits half a cell over. (x, v): v is depth from the back.
const HX = 153;
const HV = [D - 93, D - 146]; // side top, apex
const ROWB = D - 199; // back-row centre
const EDGES = [];
for (const x of [CELL.x0 - 3, CELL.x1 + 3]) EDGES.push([[x, D], [x, HV[0]]]);
for (const cx of [CELL.x0 - 3 - HX, 300, CELL.x1 + 3 + HX]) EDGES.push([[cx - HX, HV[0]], [cx, HV[1]]], [[cx, HV[1]], [cx + HX, HV[0]]]);
EDGES.push([[300, HV[1]], [300, 0]]);
const segDist = ([x, v], [[ax, av], [bx, bv]]) => {
  const dx = bx - ax, dv = bv - av;
  const t = Math.max(0, Math.min(1, ((x - ax) * dx + (v - av) * dv) / (dx * dx + dv * dv)));
  return Math.hypot(x - ax - t * dx, v - av - t * dv);
};
const inMain = (x, v) => x > CELL.x0 - 3 && x < CELL.x1 + 3 && v > HV[0] - ((HV[0] - HV[1]) * (HX - Math.abs(x - 300))) / HX;
// top face texture (u = x − X0, v = depth): the apical surface between the microvilli, and the tight-junction belts
const TOP_M = FB.planeMatrix(W3(X0, 0, APICAL), [1, 0, 0], [0, 1, 0]);
const loc = ([x, v]) => `${fx(x - X0)} ${fx(v)}`;
const junctions = EDGES.map(([a, b]) => `M${loc(a)}L${loc(b)}`).join("");
const mainTop = `M${loc([CELL.x0 - 3, D])}L${loc([CELL.x0 - 3, HV[0]])}L${loc([300, HV[1]])}L${loc([CELL.x1 + 3, HV[0]])}L${loc([CELL.x1 + 3, D])}Z`;
const topFace = `<g transform="${TOP_M}"><clipPath id="b1-topclip"><rect width="${L}" height="${D}"/></clipPath><g clip-path="url(#b1-topclip)"><rect class="b1-top" width="${L}" height="${D}"/><path class="b1-top-main" d="${mainTop}"/><path class="b1-junction" d="${junctions}"/></g></g>`;
// the brush border: microvilli standing on the top face, drawn back to front as little capsules
const R_V = VILLI.w / 2;
const villusAt = (x, v, h, main, dmt) => {
  const b = at(W3(x, v, APICAL));
  const t = at(W3(x, v, APICAL - h));
  const rx = R_V * PB.scale;
  const ry = rx * sinE;
  const dome = rx * 0.9;
  const body = `M${fx(b[0] - rx)} ${fx(b[1])}L${fx(t[0] - rx)} ${fx(t[1])}C${fx(t[0] - rx)} ${fx(t[1] - dome * 1.25)} ${fx(t[0] + rx)} ${fx(t[1] - dome * 1.25)} ${fx(t[0] + rx)} ${fx(t[1])}L${fx(b[0] + rx)} ${fx(b[1])}A${fx(rx)} ${fx(ry)} 0 0 1 ${fx(b[0] - rx)} ${fx(b[1])}Z`;
  const tip = `M${fx(t[0] - rx * 0.62)} ${fx(t[1] - dome * 0.5)}a${fx(rx * 0.62)} ${fx(ry * 1.2)} 0 1 0 ${fx(rx * 1.24)} 0a${fx(rx * 0.62)} ${fx(ry * 1.2)} 0 1 0 ${fx(-rx * 1.24)} 0Z`;
  const cap = dmt ? `<path class="b1-dmt1" d="M${fx(t[0] - rx * 0.55)} ${fx(t[1] - dome * 0.62)}a${fx(rx * 0.55)} ${fx(ry * 1.3)} 0 1 0 ${fx(rx * 1.1)} 0a${fx(rx * 0.55)} ${fx(ry * 1.3)} 0 1 0 ${fx(-rx * 1.1)} 0Z"/>` : "";
  return `<path class="b1-villus${main ? "" : " b1-villus-dim"}" d="${body}"/><path class="b1-villus-tip${main ? "" : " b1-villus-dim"}" d="${tip}"/>${cap}`;
};
const forest = [];
for (let row = 0, v = D - 12; v > 6; row++, v -= 16) {
  for (let x = X0 + 10 + (row % 2) * 10; x < X1 - 8; x += 20) {
    if (EDGES.some((e) => segDist([x, v], e) < 12.5)) continue;
    const h = 38 + 4 * Math.sin(x * 0.37 + v * 0.21) + 2 * Math.cos(v * 0.5);
    const main = inMain(x, v);
    forest.push({ x, v, h, main, dmt: main && (Math.round(x / 20) + row) % 3 === 0, depth: k.depthOf(W3(x, v, APICAL), PB) });
  }
}
forest.sort((a, b) => a.depth - b.depth);
const forestSvg = forest.map((f) => villusAt(f.x, f.v, f.h, f.main, f.dmt)).join("");
// right end (x = X1): the cells cut along their length (u = from the front edge back, sy = section y)
const SIDE_M = FB.planeMatrix(W3(X1, D, 0), [0, -1, 0], [0, 0, -1]);
const UB = D - (HV[0] - ((HV[0] - HV[1]) * (CELL.x1 + 3 + HX - X1)) / HX); // where the end face crosses the next cell border
const endCell = (u0, u1, seed, cutFront) => {
  const pts = [];
  const n = 5;
  for (let i = 0; i <= n; i++) pts.push([u0 + ((u1 - u0) * i) / n, APICAL + (i % 2 ? 0.8 : -0.6)]);
  for (let i = 1; i <= 7; i++) pts.push([u1 + 2.5 * Math.sin(i + seed), APICAL + ((BASAL - APICAL) * i) / 8]);
  pts.push([u1 - 7, BASAL + 2]);
  for (let i = n - 1; i >= 1; i--) pts.push([u0 + ((u1 - u0) * i) / n, BASAL + (i % 2 ? 2.5 : 1)]);
  if (cutFront) pts.push([u0, BASAL + 2], [u0, (APICAL + BASAL) / 2]);
  else {
    pts.push([u0 + 7, BASAL + 2]);
    for (let i = 7; i >= 1; i--) pts.push([u0 + 2.5 * Math.sin(i * 1.3 + seed), APICAL + ((BASAL - APICAL) * i) / 8]);
  }
  return smooth(pts, true, cutFront ? 0.85 : 1);
};
let endVilli = "";
for (let u = 4; u + VILLI.w <= D - 2; u += VILLI.w + VILLI.gap) {
  if (Math.abs(u + VILLI.w / 2 - UB) < 12) continue;
  const h = 40 + 4 * Math.sin(u * 0.41 + 2);
  endVilli += pill(u, APICAL - h + 4, VILLI.w, h + 6);
}
const CAPC = (CAP.y0 + CAP.y1) / 2;
let lpSeed = 11;
const lpr = () => ((lpSeed = (lpSeed * 16807) % 2147483647) - 1) / 2147483646;
let lpCollagen = "";
let lpCells = "";
for (let i = 0; i < 26; i++) {
  const u = 44 + lpr() * (D - 50);
  const y = BASAL + 22 + lpr() * (H - BASAL - 30);
  const a = (lpr() - 0.5) * 0.8;
  const len = 12 + lpr() * 16;
  lpCollagen += `M${fx(u)} ${fx(y)}q${fx(Math.cos(a) * len * 0.5)} ${fx(-3 + lpr() * 6)} ${fx(Math.cos(a) * len)} ${fx(Math.sin(a) * len)}`;
}
for (const [u, y] of [[96, 590], [160, 616], [70, 628]]) lpCells += blob(u, y, 11, 3.4, 0.08, 8, u);
const halfDisc = (r) => `M0 ${fx(CAPC - r)}A${r} ${r} 0 0 1 0 ${fx(CAPC + r)}Z`;
const sideFace = `<g transform="${SIDE_M}">
<path class="a1-villus a1-dim b1-end-villus" d="${endVilli}"/>
<rect class="b1-lateral" x="0" y="${APICAL - 2}" width="${D}" height="${BASAL - APICAL + 6}"/>
<rect class="a1-tissue" x="0" y="${BASAL - 2}" width="${D}" height="${H - BASAL + 2}"/>
<path class="a1-cell a1-dim" d="${endCell(0, UB - 3, 1.7, true)}"/>
<path class="a1-cell a1-dim" d="${endCell(UB + 3, D + 12, 2.6, false)}"/>
<path class="a1-web" d="M3 ${APICAL + 9}H${UB - 9}V${APICAL + 15}H3Z"/>
<path class="a1-nucleus a1-dim" d="${blob(UB * 0.5, 446, 44, 40, 0.03, 12, 4)}"/>
<path class="a1-mito a1-dim" d="${blob(UB * 0.36, 300, 16, 7, 0.05, 10, 6)}${blob(UB * 0.7, 230, 15, 7, 0.05, 10, 7)}"/>
<path class="a1-nucleus a1-dim" d="${blob(UB + 40, 462, 26, 34, 0.03, 12, 8)}"/>
<rect class="a1-lamina" x="0" y="${BASAL + 10}" width="${D}" height="5"/>
<path class="b1-collagen" d="${lpCollagen}"/><path class="b1-fibro" d="${lpCells}"/>
<path class="a1-endo" d="${halfDisc(CAPC - CAP.y0 + 6)}"/><path class="a1-blood" d="${halfDisc(CAPC - CAP.y0)}"/>
<path class="b1-rbc-x" d="M0 ${fx(CAPC - 13)}c6 0 9 3 9 6c0 2 -2 3 -2 7c0 4 2 5 2 7c0 3 -3 6 -9 6Z"/>
<rect class="b1-side-shade" x="-1" y="${APICAL - 2}" width="${D + 2}" height="${H - APICAL + 3}"/>
</g>`;
const shadow = `<path class="b1-shadow" d="${p3([[-8, -6, 0], [L + 12, -6, 0], [L + 12, D + 16, 0], [-8, D + 16, 0]])}"/>`;
const backEdges = `<path class="b1-edge" d="${p3([W3(X0, D, APICAL), W3(X0, 0, APICAL), W3(X1, 0, APICAL)], false)}"/>`;
const sideClip = `<clipPath id="b1-sideclip"><path d="${p3([W3(X1, D, VTOP - 20), W3(X1, 0, VTOP - 20), W3(X1, 0, H), W3(X1, D, H)])}"/></clipPath>`;
const edges = `<path class="b1-edge" d="${p3([W3(X1, 0, APICAL), W3(X1, 0, H), W3(X1, D, H)], false)}${p3([W3(X0, D, APICAL), W3(X0, D, H), W3(X1, D, H), W3(X1, D, APICAL)], false)}"/>`;
const FRONT_M = FB.planeMatrix(W3(0, D, 0), [1, 0, 0], [0, 0, -1]);
const svg = `<svg class="iso-svg a1-svg" viewBox="0 0 ${VIEW_W} ${VIEW_H}" role="img" aria-label="A block of gut lining, cut open. On top is the brush border, a carpet of microvilli, with grooves where one cell meets the next. The front face shows one lining cell in section. Iron from food enters through DMT1 channels on the microvilli at the top, is held in ferritin cages or leaves through ferroportin channels at the base into the blood, where transferrin carries it away. Hepcidin from the blood docks on ferroportin, and the cell pulls the channel in and breaks it down, so less iron gets out.">
<defs>
  <linearGradient id="b1-villus" x1="0" y1="0" x2="1" y2="0"><stop offset="0" class="b1-v0"/><stop offset="0.45" class="b1-v1"/><stop offset="1" class="b1-v2"/></linearGradient>
  <linearGradient id="b1-villus-dim" x1="0" y1="0" x2="1" y2="0"><stop offset="0" class="b1-d0"/><stop offset="0.45" class="b1-d1"/><stop offset="1" class="b1-d2"/></linearGradient>
  <clipPath id="b1-frontclip"><rect x="${X0}" y="-40" width="${L}" height="${H + 40}"/></clipPath>
  ${sideClip}
</defs>
${shadow}${topFace}${backEdges}<g class="b1-forest">${forestSvg}</g><g clip-path="url(#b1-sideclip)">${sideFace}</g>${edges}
<g class="b1-front" transform="${FRONT_M}"><g clip-path="url(#b1-frontclip)">${parts.join("")}</g></g>
</svg>`;

const DATA = { W, H, APICAL, BASAL, CELL, FERRITIN, FPN, CAP, DMT1, SLOTS: M.SLOTS, scenes: SCENES.map((s) => ({ key: s.key, gate: s.gate, line: s.line })) };
const strip = (src) => src.replace(/^import .*$/gm, "").replace(/^export /gm, "");
const SCRIPT = `${strip(readFileSync(join(HERE, "model.mjs"), "utf8"))}\n${readFileSync(join(HERE, "live.js"), "utf8").replace("__DATA__", JSON.stringify(DATA))}`;
const CSS = readFileSync(join(HERE, "figure.css"), "utf8") + readFileSync(join(HERE, "block.css"), "utf8");
const pct = (g) => `${Math.round(g * 100)} %`;
const CAPTION = [
  `Iron from food crosses the gut through one layer of lining cells. It comes in at the top, through DMT1 channels on the brush border, and leaves at the base through ferroportin, the only known way out of the cell, into the blood, where transferrin carries it away. Iron that can't leave is held in ferritin and lost when the cell is shed a few days later.`,
  `Hepcidin, a hormone from the liver, is the gatekeeper. It docks on ferroportin, plugs it, and makes the cell pull the channel in and break it down. Hepcidin rises after an iron pill and when stores are full, so fewer gates stay open: about ${pct(SCENES[1].gate)} after a week of daily pills and about ${pct(SCENES[2].gate)} two weeks after an IV infusion, against ${pct(SCENES[0].gate)} when iron-hungry.`,
  `<small>The gate shares come from the model in the IV iron figure (Fig 3). Drawn far larger than life and simplified: a real lining cell carries many more, much finer microvilli, channel and particle counts are a drawing, and time is sped up.</small>`,
]
  .map((p) => `<span class="a1-par">${p}</span>`)
  .join("");
const body = plate({
  fig: "A1",
  title: "The gut cell's gate",
  hint: "Pick a moment · watch the gates",
  stats: [
    { key: "gate", label: "Gut gate", value: pct(SCENES[0].gate) + " open" },
    { key: "fpn", label: "Ferroportin working", value: `${M.activeOf(SCENES[0].gate)} of ${M.SLOTS}` },
  ],
  controls: [{ name: "scene", label: "Moment", options: SCENES.map((s, i) => ({ value: s.key, label: s.label, pressed: i === 0 })) }],
  keys: [
    { mark: "lit", label: "Iron" },
    { mark: "heat", label: "Hepcidin" },
    { mark: "raised", label: "Ferroportin, the way out" },
  ],
  caption: CAPTION,
  body: `<div class="iso-stage a1-stage" tabindex="0">${svg}</div><p class="a1-scene" data-scene>${SCENES[0].line}</p><span class="a1-sr" role="status" aria-live="polite" data-status></span>`,
});
const out = THEME === "light" ? `${SLUG}-light.html` : `${SLUG}.html`;
writeFileSync(join(HERE, out), page({ title: "The gut cell's gate", theme: THEME, body, css: CSS, script: SCRIPT }));
if (THEME === "light") {
  mkdirSync(join(HERE, "embed"), { recursive: true });
  writeFileSync(join(HERE, "embed", `optimal-fig-${SLUG}.js`), embed({ tag: `optimal-fig-${SLUG}`, body, script: SCRIPT, css: CSS }));
}
console.log("wrote", out, SCENES.map((s) => `${s.key} ${s.gate.toFixed(2)}`).join(" · "), `DMT1 ${DMT1.length}`, `${forest.length} microvilli on top`, `view ${VIEW_W}×${VIEW_H}`);
