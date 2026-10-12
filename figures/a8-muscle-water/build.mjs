// A8 · Water in and around muscle fibres (anatomical series, inset for Fig 2).
//
// A slice across a bundle (fascicle) of muscle fibres in the upper arm: packed fibres with their
// nuclei at the edge and myofibrils inside, capillaries in the corners between them, and fluid
// in the narrow gaps (extracellular water). InBody's current runs along the arm, so in this slice
// it flows toward the viewer (⊙). At 5 kHz it stays in the gaps; at higher frequencies some of
// it passes through the fibres (Fig 2's model). Scenes change the fibres or the fluid between
// them, and the readout gives the whole-body ECW/TBW the change would produce: a high ratio can
// mean smaller fibres or extra fluid, and the number alone doesn't say which.
//
//   node build.mjs | --light
import { mkdirSync, readFileSync, writeFileSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";
import { plate, page, embed } from "../../shared/page.mjs";
import * as M from "./model.mjs";
import { throughShare } from "../02-inbody-580/model.mjs";
import { figkit, k } from "../../shared/figkit.mjs";

const HERE = dirname(fileURLToPath(import.meta.url));
const THEME = process.argv.includes("--light") ? "light" : "dark";
const SLUG = "muscle-water";
const C = [300, 248];
const RX = 238;
const RY = 176;
const rng = (() => {
  let s = 41;
  return () => ((s = (s * 16807) % 2147483647) - 1) / 2147483646;
})();
const r1 = (v) => +v.toFixed(1);

// ---------------------------------------------------------------- Voronoi fibres inside the fascicle
const inEll = (x, y, k = 1) => ((x - C[0]) / (RX * k)) ** 2 + ((y - C[1]) / (RY * k)) ** 2 < 1;
let seeds = [];
while (seeds.length < 44) {
  const x = C[0] + (rng() * 2 - 1) * RX;
  const y = C[1] + (rng() * 2 - 1) * RY;
  if (inEll(x, y, 0.94) && seeds.every((s) => Math.hypot(s[0] - x, s[1] - y) > 40)) seeds.push([x, y]);
}
const BOUND = Array.from({ length: 72 }, (_, i) => [C[0] + Math.cos((i / 72) * 2 * Math.PI) * RX, C[1] + Math.sin((i / 72) * 2 * Math.PI) * RY]);
function clip(poly, a, b) {
  // keep the half-plane closer to seed a than to seed b
  const m = [(a[0] + b[0]) / 2, (a[1] + b[1]) / 2];
  const n = [b[0] - a[0], b[1] - a[1]];
  const side = (p) => (p[0] - m[0]) * n[0] + (p[1] - m[1]) * n[1];
  const out = [];
  for (let i = 0; i < poly.length; i++) {
    const p = poly[i];
    const q = poly[(i + 1) % poly.length];
    const sp = side(p);
    const sq = side(q);
    if (sp <= 0) out.push(p);
    if (sp * sq < 0) {
      const t = sp / (sp - sq);
      out.push([p[0] + (q[0] - p[0]) * t, p[1] + (q[1] - p[1]) * t]);
    }
  }
  return out;
}
const cellOf = (i, S) => S.reduce((poly, s, j) => (j === i ? poly : clip(poly, S[i], s)), BOUND);
const centroidOf = (P) => {
  let a = 0, cx = 0, cy = 0;
  for (let i = 0; i < P.length; i++) {
    const [x0, y0] = P[i];
    const [x1, y1] = P[(i + 1) % P.length];
    const f = x0 * y1 - x1 * y0;
    a += f;
    cx += (x0 + x1) * f;
    cy += (y0 + y1) * f;
  }
  return [cx / (3 * a), cy / (3 * a)];
};
for (let it = 0; it < 4; it++) seeds = seeds.map((_, i) => centroidOf(cellOf(i, seeds))); // Lloyd: even, natural packing
const cells = seeds.map((_, i) => {
  // drop near-duplicate vertices so the rounded outline stays smooth
  const P = cellOf(i, seeds).filter((p, k, A) => Math.hypot(p[0] - A[(k + 1) % A.length][0], p[1] - A[(k + 1) % A.length][1]) > 2.5);
  return { c: centroidOf(P).map(r1), poly: P.map((p) => p.map(r1)) };
});
// gap midlines (all cell edges) and the corners where three fibres meet (capillaries)
const gaps = [];
const corners = [];
for (const { poly } of cells)
  poly.forEach((p, k) => {
    const q = poly[(k + 1) % poly.length];
    const L = Math.hypot(q[0] - p[0], q[1] - p[1]);
    for (let s = 0.15; s < 1; s += 9 / L) gaps.push([r1(p[0] + (q[0] - p[0]) * s), r1(p[1] + (q[1] - p[1]) * s)]);
    if (inEll(p[0], p[1], 0.9) && !corners.some((c) => Math.hypot(c[0] - p[0], c[1] - p[1]) < 18)) corners.push(p.map(r1));
  });
const caps = corners.filter(() => rng() < 0.62);
// inside each fibre: myofibril speckle, one or two nuclei pressed to the membrane, a fibre type
const fibres = cells.map(({ c, poly }) => {
  const dots = [];
  for (let k = 0; k < 30; k++) {
    const v = poly[Math.floor(rng() * poly.length)];
    const w = poly[Math.floor(rng() * poly.length)];
    const r = Math.sqrt(rng()) * 0.78;
    const t = rng();
    dots.push([r1((v[0] - c[0]) * (1 - t) * r + (w[0] - c[0]) * t * r), r1((v[1] - c[1]) * (1 - t) * r + (w[1] - c[1]) * t * r)]);
  }
  const nuclei = Array.from({ length: rng() < 0.5 ? 2 : 1 }, () => Math.floor(rng() * poly.length));
  return { dots, nuclei, type: rng() < 0.42 ? 1 : 2 };
});

// ---------------------------------------------------------------- the 3-D bundle: the slice is the front face of a cylinder
// World units = section px: x along the section, y back into the arm, z up. The browser redraws the
// body as the bundle swells or shrinks (live.js drawBody), so only the projection travels in DATA.
const H = 520;
const D = 240;
const W3 = (sx, y, sy) => [sx, y, H - sy];
const RXM = RX * 1.07 + 9;
const RYM = RY * 1.07 + 9;
const BOUNDS3 = [];
for (const x of [C[0] - RXM, C[0] + RXM]) for (const y of [0, D]) for (const sy of [C[1] - RYM, C[1] + RYM]) BOUNDS3.push(W3(x, y, sy));
const PB = k.fitProjection(BOUNDS3, 600, 436, { pad: 8, azimuth: 62, elevation: 24 });
const FB = figkit(PB);
const o2 = FB.at([0, 0, 0]);
const axis = (w) => FB.at(w).map((v, i) => +(v - o2[i]).toFixed(5));
const [ex, ey, ez] = [axis([1, 0, 0]), axis([0, 1, 0]), axis([0, 0, 1])];
let V = [ey[0] * ez[1] - ez[0] * ey[1], ez[0] * ex[1] - ex[0] * ez[1], ex[0] * ey[1] - ey[0] * ex[1]];
if (V[1] < 0) V = V.map((v) => -v); // toward the viewer: the front face (+y) is the one we see
const seen = (t) => (Math.cos(t) / RX) * V[0] - (Math.sin(t) / RY) * V[2] > 0;
let ta = 0;
for (let i = 0; i < 720; i++) {
  const t = (i / 720) * 2 * Math.PI;
  if (seen(t) && !seen(t - 0.01)) ta = t;
}
let tb = ta;
while (seen(tb + 0.005) && tb < ta + 2 * Math.PI) tb += 0.005;
// fibres that touch the sheath, as angle spans, so they can run back along the body
const norm = (t) => (t < ta ? t + 2 * Math.PI : t);
const spans = [];
cells.forEach(({ poly }, i) => {
  const ts = poly.filter(([x, y]) => ((x - C[0]) / RX) ** 2 + ((y - C[1]) / RY) ** 2 > 0.97).map(([x, y]) => Math.atan2((y - C[1]) / RY, (x - C[0]) / RX));
  if (ts.length < 2) return;
  let a = ts.map((t) => (t + 2 * Math.PI) % (2 * Math.PI));
  if (Math.max(...a) - Math.min(...a) > Math.PI) a = a.map((t) => (t > Math.PI ? t - 2 * Math.PI : t));
  spans.push({ a0: +Math.min(...a).toFixed(4), a1: +Math.max(...a).toFixed(4), type: fibres[i].type });
});
const BODY = { o: o2.map((v) => +v.toFixed(2)), ex, ey, ez, H, D, ta: +ta.toFixed(4), tb: +tb.toFixed(4), spans };
const FRONT = FB.planeMatrix(W3(0, D, 0), [1, 0, 0], [0, 0, -1]);

// ---------------------------------------------------------------- the picture
const svg = `<svg class="iso-svg a8-svg" viewBox="0 0 600 520" role="img" aria-label="A slice across a bundle of muscle fibres from the upper arm. Packed fibres, each with nuclei at its edge and myofibrils inside, are separated by narrow gaps of fluid, with small capillaries in the corners. Symbols show InBody's current flowing along the arm, toward the viewer: at low frequency it flows only in the fluid between the fibres, at higher frequencies some of it passes through the fibres too. Changing the scene makes the fibres bigger or smaller, or adds fluid between them.">
<defs>
  <radialGradient id="a8-fib1" cx="40%" cy="36%" r="75%"><stop offset="0" class="a8-f1a"/><stop offset="1" class="a8-f1b"/></radialGradient>
  <radialGradient id="a8-fib2" cx="40%" cy="36%" r="75%"><stop offset="0" class="a8-f2a"/><stop offset="1" class="a8-f2b"/></radialGradient>
  <radialGradient id="a8-ecw" cx="50%" cy="50%" r="60%"><stop offset="0" class="a8-e0"/><stop offset="1" class="a8-e1"/></radialGradient>
<linearGradient id="a8-cyl" gradientUnits="userSpaceOnUse"><stop offset="0" class="a8-g0"/><stop offset="0.38" class="a8-g1"/><stop offset="1" class="a8-g2"/></linearGradient>
</defs>
<g class="a8-body" aria-hidden="true">
<path class="a8-body-sheath" data-part="bodySheath"/><path class="a8-body-gap" data-part="bodyGap"/>
<path class="a8-body-f1" data-part="bodyF1"/><path class="a8-body-f2" data-part="bodyF2"/>
<path class="a8-body-stri" data-part="bodyStri"/><path class="a8-body-cap" data-part="bodyCap"/>
<path class="a8-body-veil" data-part="bodyVeil"/><path data-part="bodyShade" fill="url(#a8-cyl)"/>
<path class="a8-body-edge" data-part="bodyEdge"/>
</g>
<g class="a8-front" transform="${FRONT}">
<ellipse class="a8-peri" data-part="peri" cx="${C[0]}" cy="${C[1]}" rx="${RX + 9}" ry="${RY + 9}"/>
<ellipse class="a8-ecw" data-part="ecw" cx="${C[0]}" cy="${C[1]}" rx="${RX}" ry="${RY}" fill="url(#a8-ecw)"/>
<path class="a8-cap" data-part="caps"/><path class="a8-cap-lumen" data-part="capl"/>
<path class="a8-fibre a8-fibre1" data-part="fib1" fill="url(#a8-fib1)"/>
<path class="a8-fibre a8-fibre2" data-part="fib2" fill="url(#a8-fib2)"/>
<path class="a8-myo" data-part="myo"/>
<path class="a8-nuc" data-part="nuc"/>
<path class="a8-cur-ring" data-part="curRing"/><path class="a8-cur-dot" data-part="curDot"/>
</g>
<g class="a8-loc" aria-hidden="true" transform="translate(18 444)">
  <path class="a8-loc-arm" d="M4 22C20 8 52 4 84 8C112 12 132 16 148 24L146 50C130 56 108 58 84 58C54 58 24 54 6 44Z"/>
  <ellipse class="a8-loc-cut" cx="78" cy="33" rx="9" ry="25"/>
  <path class="a8-loc-arrow" d="M100 33h30m-6 -5l6 5l-6 5"/>
</g>
</svg>`;

const FREQS = [5, 50, 250, 500];
const SHARE = FREQS.map((f) => +throughShare("arm", f).toFixed(3));
const LINES = [
  "Typical: fibres packed tight, a thin film of fluid between them. Most of the arm's water is inside the fibres.",
  "Bigger fibres, as with strength training: more water inside the cells, so the share outside falls a little.",
  "Smaller fibres, as with muscle loss: less water inside, so the share outside rises.",
  "Extra fluid between the fibres: the share outside rises too. The ratio alone can't tell this from muscle loss.",
];
const DATA = { body: BODY, C, RX, RY, cells, gaps, caps, fibres, share: SHARE, freqs: FREQS, lines: LINES };
const strip = (src) => src.replace(/^import .*$/gm, "").replace(/^export /gm, "");
const SCRIPT = `${strip(readFileSync(join(HERE, "model.mjs"), "utf8"))}\n${readFileSync(join(HERE, "live.js"), "utf8").replace("__DATA__", JSON.stringify(DATA))}`;
const CSS = readFileSync(join(HERE, "figure.css"), "utf8");
const R = M.WATER.scenes.map((s) => M.ratioOf(s).toFixed(3));
const CAPTION = [
  `Most of the body's water sits inside cells, and much of that inside muscle fibres. The rest bathes the cells and fills the blood. InBody's current runs along the arm (toward you in this slice, ⊙). At low frequency, cell membranes block it, so it flows only through the fluid between the fibres; that reading gives extracellular water (ECW). At higher frequencies some current crosses the membranes, adding the water inside (ICW) to give total body water (TBW).`,
  `ECW/TBW is the share outside. It rises if fibres shrink (${R[2]} here) or if fluid collects between them (${R[3]}), so a high number says the balance has shifted, not why. Bigger fibres nudge it down (${R[1]}).`,
  `<small>A teaching model: skeletal muscle is taken to hold about half the body's water, and only the muscle changes in each scene; values are typical, not a measurement of anyone. Bands follow InBody's result sheet: under 0.390 normal, 0.390–0.400 slightly over, above 0.400 over. Fibres drawn far larger than life (a fibre is about the width of a hair).</small>`,
]
  .map((p) => `<span class="a8-par">${p}</span>`)
  .join("");
const body = plate({
  fig: "A8",
  title: "Water in and around the fibres",
  hint: "Change the fibres or the fluid · then the frequency",
  stats: [
    { key: "ratio", label: "ECW / TBW", value: R[0] },
    { key: "band", label: "InBody band", value: M.bandOf(M.ratioOf(M.WATER.scenes[0])) },
    { key: "through", label: "Through cells", value: `${Math.round(SHARE[1] * 100)}%` },
  ],
  controls: [
    { name: "scene", label: "Fibres and fluid", options: M.WATER.scenes.map((s, i) => ({ value: s.key, label: s.label, pressed: i === 0 })) },
    { name: "freq", label: "Frequency", options: FREQS.map((f, i) => ({ value: String(f), label: `${f} kHz`, pressed: i === 1 })) },
  ],
  keys: [
    { mark: "fibre", label: "Muscle fibre (water inside: ICW)" },
    { mark: "ecw", label: "Fluid between fibres (ECW)" },
    { mark: "cur", label: "Current, flowing toward you" },
  ],
  caption: CAPTION,
  body: `<div class="iso-stage a8-stage">${svg}</div><p class="a8-scene" data-scene>${LINES[0]}</p><span class="a8-sr" role="status" aria-live="polite" data-status></span>`,
});
const out = THEME === "light" ? `${SLUG}-light.html` : `${SLUG}.html`;
writeFileSync(join(HERE, out), page({ title: "Water in and around the fibres", theme: THEME, body, css: CSS, script: SCRIPT }));
if (THEME === "light") {
  mkdirSync(join(HERE, "embed"), { recursive: true });
  writeFileSync(join(HERE, "embed", `optimal-fig-${SLUG}.js`), embed({ tag: `optimal-fig-${SLUG}`, body, script: SCRIPT, css: CSS }));
}
console.log("wrote", out, `${cells.length} fibres, ${gaps.length} gap points, ${caps.length} capillaries, ratios ${R.join(" ")}, through ${SHARE.join(" ")}`);
