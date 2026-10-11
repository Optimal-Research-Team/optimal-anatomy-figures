// A1 · The gut cell's gate (style test for the anatomical series).
//
// One duodenal lining cell between two neighbours, in section: microvilli on
// top with DMT1 channels (iron in), the cytoplasm with ferritin cages and the
// nucleus, ferroportin channels on the base (iron out), and the capillary
// below with red cells and transferrin. Hepcidin from the blood docks on
// ferroportin and the cell pulls the channel in and breaks it down. The three
// scenes take their gate share from Fig 3's model.
//
//   node build.mjs | --light
import { mkdirSync, readFileSync, writeFileSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";
import { plate, page, embed } from "../../shared/page.mjs";
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
// lumen and capillary beds
parts.push(`<rect class="a1-lumen" x="0" y="0" width="${W}" height="${APICAL - 4}"/>`);
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
for (const [i, n] of NEIGH.entries()) parts.push(`<path class="a1-cell a1-dim" d="${cellPath(n.x0, n.x1, i * 2 + 1)}"/>`);
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
const svg = `<svg class="iso-svg a1-svg" viewBox="0 0 ${W} ${H}" role="img" aria-label="A gut lining cell in section. Iron from food enters through DMT1 channels on the brush border at the top, is held in ferritin cages or leaves through ferroportin channels at the base into the blood, where transferrin carries it away. Hepcidin from the blood docks on ferroportin, and the cell pulls the channel in and breaks it down, so less iron gets out."><defs><linearGradient id="a1-shade" x1="0" y1="0" x2="1" y2="0"><stop offset="0" class="a1-stop-a"/><stop offset="0.5" class="a1-stop-b"/><stop offset="1" class="a1-stop-a"/></linearGradient></defs>${parts.join("")}</svg>`;

const DATA = { W, H, APICAL, BASAL, CELL, FERRITIN, FPN, CAP, DMT1, SLOTS: M.SLOTS, scenes: SCENES.map((s) => ({ key: s.key, gate: s.gate, line: s.line })) };
const strip = (src) => src.replace(/^import .*$/gm, "").replace(/^export /gm, "");
const SCRIPT = `${strip(readFileSync(join(HERE, "model.mjs"), "utf8"))}\n${readFileSync(join(HERE, "live.js"), "utf8").replace("__DATA__", JSON.stringify(DATA))}`;
const CSS = readFileSync(join(HERE, "figure.css"), "utf8");
const pct = (g) => `${Math.round(g * 100)} %`;
const CAPTION = [
  `Iron from food crosses the gut through one layer of lining cells. It comes in at the top, through DMT1 channels on the brush border, and leaves at the base through ferroportin, the only known way out of the cell, into the blood, where transferrin carries it away. Iron that can't leave is held in ferritin and lost when the cell is shed a few days later.`,
  `Hepcidin, a hormone from the liver, is the gatekeeper. It docks on ferroportin, plugs it, and makes the cell pull the channel in and break it down. Hepcidin rises after an iron pill and when stores are full, so fewer gates stay open: about ${pct(SCENES[1].gate)} after a week of daily pills and about ${pct(SCENES[2].gate)} two weeks after an IV infusion, against ${pct(SCENES[0].gate)} when iron-hungry.`,
  `<small>The gate shares come from the model in the IV iron figure (Fig 3). Channel and particle counts are a drawing, not to scale, and time is sped up.</small>`,
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
console.log("wrote", out, SCENES.map((s) => `${s.key} ${s.gate.toFixed(2)}`).join(" · "), `DMT1 ${DMT1.length}`);
