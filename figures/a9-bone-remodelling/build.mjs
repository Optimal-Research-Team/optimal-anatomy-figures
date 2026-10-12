// A9 · Bone remodelling and estrogen (anatomical series, Menopause).
//
// One strut of spongy bone (a trabecula) lying in marrow, cut lengthwise: lamellae, osteocytes in
// their lacunae, the scalloped cement lines of old repairs, flat lining cells on the surface.
// Remodelling sites start along the top surface: an osteoclast digs a cavity, then osteoblasts
// lay new bone (pale osteoid first) to refill it, leaving a new cement line. Before menopause
// sites are fewer and each cavity is refilled; around and after menopause more sites start
// and each refill falls a little short, so the strut thins: about 2 % a year in the model,
// in the range SWAN measured around the final period.
//
//   node build.mjs | --light
import { mkdirSync, readFileSync, writeFileSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";
import { plate, page, embed } from "../../shared/page.mjs";
import * as M from "./model.mjs";
import { figkit, k } from "../../shared/figkit.mjs";

const HERE = dirname(fileURLToPath(import.meta.url));
const THEME = process.argv.includes("--light") ? "light" : "dark";
const SLUG = "bone-remodelling";
const f1 = (v) => v.toFixed(1);
const rng = (() => {
  let s = 17;
  return () => ((s = (s * 16807) % 2147483647) - 1) / 2147483646;
})();
const dot = (x, y, r) => `M${f1(x - r)} ${f1(y)}a${r} ${r} 0 1 0 ${2 * r} 0a${r} ${r} 0 1 0 ${-2 * r} 0`;
function smooth(points, closed = false, k = 1) {
  const n = points.length;
  const at = (i) => points[closed ? (i + n) % n : Math.max(0, Math.min(n - 1, i))];
  let d = `M${f1(points[0][0])} ${f1(points[0][1])}`;
  for (let i = 0; i < (closed ? n : n - 1); i++) {
    const p0 = at(i - 1), p1 = at(i), p2 = at(i + 1), p3 = at(i + 2);
    d += `C${f1(p1[0] + ((p2[0] - p0[0]) / 6) * k)} ${f1(p1[1] + ((p2[1] - p0[1]) / 6) * k)} ${f1(p2[0] - ((p3[0] - p1[0]) / 6) * k)} ${f1(p2[1] - ((p3[1] - p1[1]) / 6) * k)} ${f1(p2[0])} ${f1(p2[1])}`;
  }
  return d + (closed ? "Z" : "");
}
const X0 = 20;
const X1 = 580;
const TOP = 168;
const BOT = 318;
const yBot = (x) => BOT + 3 * Math.sin(x / 47);

// ---------------------------------------------------------------- marrow (static)
let fat = "";
const fatPts = [];
for (let i = 0; i < 400 && fatPts.length < 15; i++) {
  const x = 30 + rng() * 540;
  const y = rng() < 0.6 ? 66 + rng() * 76 : 344 + rng() * 54;
  const r = 13 + rng() * 9;
  if (fatPts.every(([a, b, rr]) => Math.hypot(a - x, b - y) > r + rr + 6)) fatPts.push([x, y, r]);
}
for (const [x, y, r] of fatPts) fat += dot(x, y, r);
let hemo = "";
let hemo2 = "";
for (let i = 0; i < 340; i++) {
  const x = 22 + rng() * 556;
  const y = rng() < 0.6 ? 46 + rng() * 112 : 332 + rng() * 80;
  if (fatPts.some(([a, b, r]) => Math.hypot(a - x, b - y) < r + 3)) continue;
  if (rng() < 0.55) hemo += dot(x, y, 1.6 + rng() * 1.2);
  else hemo2 += dot(x, y, 1.4 + rng());
}
const sinus = smooth([[0, 112], [120, 100], [240, 122], [360, 102], [480, 120], [600, 108]]);

// ---------------------------------------------------------------- inside the bone (static, clipped to the live outline)
let lamellae = "";
for (let k = 0; k < 21; k++) {
  const y0 = TOP + 6 + k * 6.8;
  let d = "";
  for (let x = X0; x <= X1; x += 8) d += `${d ? "L" : "M"}${x} ${f1(y0 + 1.6 * Math.sin(x / 31 + k))}`;
  lamellae += d;
}
let cement = "";
for (let i = 0; i < 5; i++) {
  const x0 = 40 + rng() * 480;
  const w = 50 + rng() * 30;
  const yb = TOP + 10 + rng() * 54;
  const dd = 14 + rng() * 12;
  let d = "";
  for (let u = 0; u <= 1.0001; u += 0.05) d += `${d ? "L" : "M"}${f1(x0 + u * w)} ${f1(yb - dd + dd * M.scoop(u) + (u === 0 || u > 0.99 ? 0 : 0))}`;
  cement += d;
}
let lacunae = "";
let canal = "";
for (let i = 0; i < 34; i++) {
  const x = 34 + rng() * 532;
  const y = TOP + 16 + rng() * (BOT - TOP - 26);
  const a = (rng() - 0.5) * 0.4;
  const ux = Math.cos(a) * 5;
  const uy = Math.sin(a) * 5;
  lacunae += `M${f1(x - ux)} ${f1(y - uy)}Q${f1(x)} ${f1(y - 3)} ${f1(x + ux)} ${f1(y + uy)}Q${f1(x)} ${f1(y + 3)} ${f1(x - ux)} ${f1(y - uy)}Z`;
  for (let k = 0; k < 6; k++) {
    const b = rng() * 2 * Math.PI;
    const L = 5 + rng() * 6;
    canal += `M${f1(x + Math.cos(b) * 4)} ${f1(y + Math.sin(b) * 2.5)}l${f1(Math.cos(b) * L)} ${f1(Math.sin(b) * L)}`;
  }
}
let bottomLining = "";
for (let x = X0 + 14; x < X1 - 10; x += 26) bottomLining += `M${f1(x - 9)} ${f1(yBot(x) + 1.4)}q9 3.4 18 0q-9 1 -18 0Z`;

// ---------------------------------------------------------------- the 3-D block: the section is its front face
// World units = section px: x along the strut, y back into the bone, z up. The block runs X0..X1, so
// the strut is cut at both ends of the block. The top and the right end are drawn as flat 2-D
// textures (marrow; marrow + the strut in cross-section) placed on their planes with planeMatrix.
const MT = 36; // top of the marrow
const MB = 420;
const L = X1 - X0;
const DEP = 150;
const W3 = (sx, y, sy) => [sx - X0, y, MB - sy];
const BOUNDS3 = [[0, 0, 0], [L, 0, 0], [0, DEP, 0], [L, DEP, 0], [0, 0, MB - MT], [L, 0, MB - MT], [0, DEP, MB - MT], [L, DEP, MB - MT]];
const PB = k.fitProjection(BOUNDS3, 600, 470, { pad: 10, azimuth: 62, elevation: 24 });
const FB = figkit(PB);
const marrowTexture = (w, h, avoid = () => false) => {
  let fd = "", hd = "", h2 = "";
  const pts = [];
  for (let i = 0; i < 300 && pts.length < Math.round((w * h) / 5200); i++) {
    const x = 10 + rng() * (w - 20);
    const y = 10 + rng() * (h - 20);
    const r = 9 + rng() * 8;
    if (!avoid(y, r) && pts.every(([a, b, rr]) => Math.hypot(a - x, b - y) > r + rr + 5)) pts.push([x, y, r]);
  }
  for (const [x, y, r] of pts) fd += dot(x, y, r);
  for (let i = 0; i < (w * h) / 180; i++) {
    const x = 2 + rng() * (w - 4);
    const y = 2 + rng() * (h - 4);
    if (avoid(y, 2) || pts.some(([a, b, r]) => Math.hypot(a - x, b - y) < r + 3)) continue;
    if (rng() < 0.55) hd += dot(x, y, 1.5 + rng() * 1.1);
    else h2 += dot(x, y, 1.3 + rng());
  }
  return `<rect class="a9-marrow" width="${w}" height="${h}"/><path class="a9-hemo" d="${hd}"/><path class="a9-hemo2" d="${h2}"/><path class="a9-fat" d="${fd}"/>`;
};
// top: marrow seen from above (u along the strut, v from the back edge to the front)
const TOP_M = FB.planeMatrix([0, 0, MB - MT], [1, 0, 0], [0, 1, 0]);
const topFace = `<g transform="${TOP_M}">${marrowTexture(L, DEP)}<rect class="b9-top-light" width="${L}" height="${DEP}"/></g>`;
// right end: marrow above and below, the strut in cross-section (u from the front edge back, v down from the marrow top)
const SIDE_M = FB.planeMatrix([L, DEP, MB - MT], [0, -1, 0], [0, 0, -1]);
const bTop = TOP - MT;
const bBot = yBot(X1) - MT;
let sideLam = "";
for (let k2 = 0; k2 < 21; k2++) {
  const v = bTop + 6 + k2 * 6.8;
  if (v < bBot - 3) sideLam += `M0 ${f1(v)}H${DEP}`;
}
let sideLac = "";
for (let i = 0; i < 9; i++) {
  const u = 8 + rng() * (DEP - 16);
  const v = bTop + 12 + rng() * (bBot - bTop - 22);
  sideLac += `M${f1(u - 4.5)} ${f1(v)}q4.5 -2.6 9 0q-4.5 2.6 -9 0Z`;
}
const sideFace = `<g transform="${SIDE_M}">${marrowTexture(DEP, MB - MT, (y, r) => y + r > bTop - 4 && y - r < bBot + 4)}
<rect class="a9-bone" x="0" y="${f1(bTop)}" width="${DEP}" height="${f1(bBot - bTop)}" fill="url(#a9-bone)"/>
<path class="a9-lamellae" d="${sideLam}"/><path class="a9-lacuna" d="${sideLac}"/>
<rect class="b9-side-shade" width="${DEP}" height="${MB - MT}"/></g>`;
const p3 = (pts, close = true) => FB.path3(pts, close);
const blockShadow = `<path class="b9-shadow" d="${p3([[-6, -6, 0], [L + 10, -6, 0], [L + 10, DEP + 14, 0], [-6, DEP + 14, 0]])}"/>`;
const blockEdges = `<path class="b9-edge" d="${p3([W3(X0, DEP, MT), W3(X0, 0, MT), W3(X1, 0, MT), W3(X1, 0, MB), W3(X1, DEP, MB)], false)}${p3([W3(X1, 0, MT), W3(X1, DEP, MT)], false)}"/>`;
const FRONT_M = FB.planeMatrix(W3(0, DEP, 0), [1, 0, 0], [0, 0, -1]);

const svg = `<svg class="iso-svg a9-svg" viewBox="0 0 600 470" role="img" aria-label="A strut of spongy bone lying in marrow, cut lengthwise. Inside the bone are layered lamellae, osteocytes in small cavities, and the curved lines of old repairs. Along its top surface, remodelling sites come and go: a large osteoclast digs a scooped cavity, then a row of osteoblasts lays new bone to refill it. Before menopause sites are fewer and each cavity is refilled; after menopause more sites start and each refill falls a little short, so the strut thins over the years.">
<defs>
  <linearGradient id="a9-bone" x1="0" y1="0" x2="0" y2="1"><stop offset="0" class="a9-b0"/><stop offset="1" class="a9-b1"/></linearGradient>
  <clipPath id="a9-boneclip"><path data-part="boneClip"/></clipPath>
  <clipPath id="a9-faceclip"><rect x="${X0}" y="${MT}" width="${L}" height="${MB - MT}"/></clipPath>
</defs>
${blockShadow}${topFace}${sideFace}
<g class="a9-front" transform="${FRONT_M}"><g clip-path="url(#a9-faceclip)">
<rect class="a9-marrow" x="0" y="36" width="600" height="384"/>
<path class="a9-sinus" d="${sinus}"/>
<path class="a9-hemo" d="${hemo}"/><path class="a9-hemo2" d="${hemo2}"/>
<path class="a9-fat" d="${fat}"/>
<path class="a9-bone" data-part="bone" fill="url(#a9-bone)"/>
<g clip-path="url(#a9-boneclip)">
  <path class="a9-lamellae" d="${lamellae}"/>
  <path class="a9-cement" d="${cement}"/><path class="a9-cement a9-cement-new" data-part="cementNew"/>
  <path class="a9-canal" d="${canal}"/><path class="a9-lacuna" d="${lacunae}"/>
</g>
<path class="a9-osteoid" data-part="osteoid"/>
<path class="a9-surface" data-part="surface"/>
<path class="a9-lining" data-part="lining"/><path class="a9-lining" d="${bottomLining}"/>
<path class="a9-ob" data-part="ob"/><path class="a9-ob-nuc" data-part="obNuc"/>
<path class="a9-oc" data-part="oc"/><path class="a9-oc-ruffle" data-part="ocRuffle"/><path class="a9-oc-nuc" data-part="ocNuc"/>
<path class="a9-rev" data-part="rev"/>
<path class="a9-estro" data-part="estro"/>
</g></g>
${blockEdges}
</svg>`;

const LINES = [
  "Before menopause: a few repair sites at a time. Each cavity an osteoclast digs is filled back in by osteoblasts, so the strut keeps its thickness.",
  "Around and after menopause: with little estrogen, more sites start at once, and each refill falls a little short. The strut slowly thins.",
];
const DATA = { X0, X1, TOP, BOT, lines: LINES };
const strip = (src) => src.replace(/^import .*$/gm, "").replace(/^export /gm, "");
const SCRIPT = `${strip(readFileSync(join(HERE, "model.mjs"), "utf8"))}\n${readFileSync(join(HERE, "live.js"), "utf8").replace("__DATA__", JSON.stringify(DATA))}`;
const CSS = readFileSync(join(HERE, "figure.css"), "utf8");
const CAPTION = [
  `Bone is renewed all the time. At each repair site an osteoclast digs a small cavity over two or three weeks, and then osteoblasts spend about three months filling it with new bone. Estrogen keeps the diggers in check.`,
  `As estrogen falls around menopause, more sites open at once and the filling falls behind the digging. Bone loss speeds up from about a year before the final period and is fastest until about two years after. In one large study, women lost about 7 % of their spine bone density and about 6 % at the hip in those three years, and about 10 % at the spine over ten years.`,
  `<small>A typical pattern; how much any woman loses varies, and density is one factor among several in fracture risk. This shows the mechanism only: it doesn't estimate anyone's risk or the effect of any treatment. The numbers of sites and the shortfall per site are drawn to match the average rates, not measured. Three years pass in about half a minute.</small>`,
]
  .map((p) => `<span class="a9-par">${p}</span>`)
  .join("");
const body = plate({
  fig: "A9",
  title: "Digging and filling",
  hint: "Pick before or after · three years in half a minute",
  stats: [
    { key: "yr", label: "Years", value: "0.0" },
    { key: "sites", label: "Active sites", value: "0" },
    { key: "bone", label: "Bone in this strut", value: "100%" },
  ],
  controls: [{ name: "state", label: "Menopause", options: [["pre", "Pre-menopause"], ["post", "Post-menopause"]].map(([value, label], i) => ({ value, label, pressed: i === 0 })) }],
  keys: [
    { mark: "oc", label: "Osteoclast (digs)" },
    { mark: "ob", label: "Osteoblasts and new bone (fill)" },
    { mark: "estro", label: "Estrogen" },
  ],
  caption: CAPTION,
  body: `<div class="iso-stage a9-stage">${svg}</div><p class="a9-scene" data-scene>${LINES[0]}</p><span class="a9-sr" role="status" aria-live="polite" data-status></span>`,
});
const out = THEME === "light" ? `${SLUG}-light.html` : `${SLUG}.html`;
writeFileSync(join(HERE, out), page({ title: "Digging and filling", theme: THEME, body, css: CSS, script: SCRIPT }));
if (THEME === "light") {
  mkdirSync(join(HERE, "embed"), { recursive: true });
  writeFileSync(join(HERE, "embed", `optimal-fig-${SLUG}.js`), embed({ tag: `optimal-fig-${SLUG}`, body, script: SCRIPT, css: CSS }));
}
console.log("wrote", out, `pre ${JSON.stringify(M.remodelOf(1))} post ${JSON.stringify(M.remodelOf(0))}`);
