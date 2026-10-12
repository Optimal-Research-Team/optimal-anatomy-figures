// A3 · The finger's heat valves (anatomical series, inset for Fig 1).
//
// Fingertip skin in section: friction ridges and the epidermis, dermal papillae with their
// capillary loops, the venous plexus under them, an arteriole below, and three coiled
// arteriovenous shunts (glomus bodies) wrapped in muscle that link the arteriole straight to the
// plexus. A sympathetic nerve keeps the shunts squeezed shut. In a hot flash the heat-loss signal
// lifts that squeeze: the shunts open, warm arterial blood floods the plexus, and heat leaves
// through the skin. The finger's temperature follows Fig 1's flashAt(t): +2.7 °C within a
// minute, still raised half an hour later.
//
//   node build.mjs | --light
import { mkdirSync, readFileSync, writeFileSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";
import { plate, page, embed } from "../../shared/page.mjs";
import { TRUTH, flashAt } from "../01-menopause-thermostat/model.mjs";

const HERE = dirname(fileURLToPath(import.meta.url));
const THEME = process.argv.includes("--light") ? "light" : "dark";
const SLUG = "finger-skin";
const f1 = (v) => v.toFixed(1);
const r1 = (v) => +v.toFixed(1);
const rng = (() => {
  let s = 5;
  return () => ((s = (s * 16807) % 2147483647) - 1) / 2147483646;
})();
const X0 = 24;
const X1 = 576;
const poly = (pts) => `M${pts.map((p) => `${f1(p[0])} ${f1(p[1])}`).join("L")}`;
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
const sample = (fn, a, b, step = 3) => {
  const out = [];
  for (let x = a; x <= b + 1e-9; x += step) out.push([x, fn(x)]);
  return out;
};
const range = (a, b, step) => {
  const out = [];
  for (let x = a; x <= b + 1e-9; x += step) out.push(x);
  return out;
};

// ---------------------------------------------------------------- layers (depth increases downward)
const RIDGE = 44; // friction-ridge spacing on the drawing
const ySurf = (x) => 96 - 6 * Math.cos((2 * Math.PI * (x - 30)) / RIDGE);
const yCorneum = (x) => ySurf(x) + 9;
const yDEJ = (x) => 140 - 14 * Math.max(0, Math.cos((2 * Math.PI * (x - 30)) / (RIDGE / 2))) ** 1.4; // papillae point up
const PAPILLAE = range(30 + RIDGE / 2 - RIDGE / 2, X1, RIDGE / 2).filter((x) => x > X0 + 8 && x < X1 - 8);
const PLEX_Y = 176;
const ART_Y = 312;
const yPlex = (x) => PLEX_Y + 4 * Math.sin((2 * Math.PI * x) / 130);
const yArt = (x) => ART_Y + 3 * Math.sin((2 * Math.PI * x) / 170 + 1);
const surface = sample(ySurf, X0, X1, 2);
const corneum = sample(yCorneum, X0, X1, 2);
const dej = sample(yDEJ, X0, X1, 2);
const skinBlock = `M${X0} ${f1(ySurf(X0))}${surface.map((p) => `L${f1(p[0])} ${f1(p[1])}`).join("")}L${X1} 430L${X0} 430Z`;
const epidermis = `M${X0} ${f1(ySurf(X0))}${surface.map((p) => `L${f1(p[0])} ${f1(p[1])}`).join("")}${[...dej].reverse().map((p) => `L${f1(p[0])} ${f1(p[1])}`).join("")}Z`;
const corneumBand = `M${X0} ${f1(ySurf(X0))}${surface.map((p) => `L${f1(p[0])} ${f1(p[1])}`).join("")}${[...corneum].reverse().map((p) => `L${f1(p[0])} ${f1(p[1])}`).join("")}Z`;
// basal-cell speckle along the junction, keratinocyte dots through the epidermis
let kera = "";
for (let i = 0; i < 260; i++) {
  const x = X0 + 4 + rng() * (X1 - X0 - 8);
  const y = yCorneum(x) + 3 + rng() * (yDEJ(x) - yCorneum(x) - 5);
  kera += dot(x, y, 1 + rng() * 0.7);
}
// capillary loops in the papillae: up as arterial, down as venous, into the plexus
const LOOPS = PAPILLAE.map((x) => {
  const top = yDEJ(x) + 6;
  return { up: [[x - 3.5, yPlex(x) - 2], [x - 3.2, top + 10], [x - 1.5, top + 2]], down: [[x + 1.5, top + 2], [x + 3.2, top + 10], [x + 3.5, yPlex(x) - 2]], x, top };
});
// ascending arterioles from the arteriole up to the loops
const FEEDS = [78, 214, 352, 494].map((x) => smooth([[x, yArt(x) - 4], [x + 6, 270], [x - 4, 230], [x + 3, 200], [x, yPlex(x) + 6]]));
// three arteriovenous shunts: coiled, wrapped in glomus muscle, arteriole → plexus
const AVA_X = [148, 300, 446];
const AVAS = AVA_X.map((x0) => {
  const pts = [];
  const top = yPlex(x0 + 14) + 5;
  const bot = yArt(x0) - 6;
  for (let i = 0; i <= 60; i++) {
    const u = i / 60;
    const y = bot + (top - bot) * u;
    const env = Math.sin(Math.PI * u);
    pts.push([r1(x0 + 14 * u + 13 * env * Math.sin(u * Math.PI * 5)), r1(y)]);
  }
  return pts;
});
// glomus cells: beads along each shunt
let glomus = "";
for (const pts of AVAS)
  pts.forEach((p, i) => {
    if (i % 3 || i < 3 || i > pts.length - 4) return;
    const a = pts[Math.max(0, i - 1)];
    const b = pts[Math.min(pts.length - 1, i + 1)];
    const l = Math.hypot(b[0] - a[0], b[1] - a[1]) || 1;
    const n = [-(b[1] - a[1]) / l, (b[0] - a[0]) / l];
    for (const s of [-1, 1]) glomus += dot(p[0] + n[0] * 7.5 * s, p[1] + n[1] * 7.5 * s, 3.1);
  });
// sweat glands deep in the dermis, ducts spiralling up to pores on the ridge crests
const GLANDS = [[98, 384], [384, 388]].map(([gx, gy]) => {
  let coil = "";
  for (let k = 0; k < 9; k++) coil += dot(gx + Math.cos(k * 1.9) * 9, gy + Math.sin(k * 1.9) * 6, 4.4);
  const pore = 30 + RIDGE * Math.round((gx + 20 - 30) / RIDGE);
  const duct = [];
  for (let i = 0; i <= 50; i++) {
    const u = i / 50;
    const y = gy - 6 + (ySurf(pore) - (gy - 6)) * u;
    const x = gx + (pore - gx) * Math.min(1, u * 1.6) + (y < yDEJ(pore) + 4 ? 4 * Math.sin(u * 60) : 2 * Math.sin(u * 14));
    duct.push([x, y]);
  }
  return { coil, duct: poly(duct), pore: [pore, ySurf(pore)] };
});
// fat lobules under the dermis
let fat = "";
for (let x = X0 + 18; x < X1; x += 34 + rng() * 8) fat += smooth(Array.from({ length: 7 }, (_, k) => {
  const a = (k / 7) * 2 * Math.PI;
  const r = 15 + rng() * 4;
  return [x + Math.cos(a) * r * 1.1, 414 + Math.sin(a) * r * 0.75];
}), true, 1);
// collagen strands in the dermis
let collagen = "";
for (let i = 0; i < 46; i++) {
  const x = X0 + rng() * (X1 - X0);
  const y = 196 + rng() * 190;
  const a = (rng() - 0.5) * 0.7;
  const L = 14 + rng() * 18;
  collagen += `M${f1(x)} ${f1(y)}q${f1(Math.cos(a) * L * 0.5)} ${f1(-6 + rng() * 12)} ${f1(Math.cos(a) * L)} ${f1(Math.sin(a) * L)}`;
}
// the sympathetic nerve that keeps the shunts shut, branching to each one
const NERVE = smooth([[X0 - 4, 262], [90, 256], [170, 266], [250, 258], [330, 266], [410, 258], [500, 264], [X1 + 4, 258]]);
const NERVE_BR = AVA_X.map((x) => [[x - 10, 262], [x - 4, 252], [x + 2, 246]]);
const plexus = sample(yPlex, X0, X1, 4).map((p) => p.map(r1));
const artery = sample(yArt, X0, X1, 4).map((p) => p.map(r1));

// ---------------------------------------------------------------- monitor
const MON = { x0: 86, x1: 548, t0: -1, t1: 30, y0: 586, y1: 512, max: 3, box: [24, 468, 552, 150] };
const xOfT = (t) => MON.x0 + ((t - MON.t0) / (MON.t1 - MON.t0)) * (MON.x1 - MON.x0);
const yOfS = (v) => MON.y0 - (v / MON.max) * (MON.y0 - MON.y1);
let curve = "";
for (let t = MON.t0; t <= MON.t1 + 1e-9; t += 0.1) curve += `${curve ? "L" : "M"}${f1(xOfT(t))} ${f1(yOfS(flashAt(t).skin))}`;
let openBand = "";
{
  const ts = range(0, 6, 0.05).filter((t) => flashAt(t).louvre > 0.05);
  openBand = `<rect class="a3-open-band" x="${f1(xOfT(ts[0]))}" y="${MON.y1 - 4}" width="${f1(xOfT(ts[ts.length - 1]) - xOfT(ts[0]))}" height="${MON.y0 - MON.y1 + 4}"/>`;
}
const monitor = `<g class="a3-mon">
<rect class="a3-mon-bg" x="${MON.box[0]}" y="${MON.box[1]}" width="${MON.box[2]}" height="${MON.box[3]}" rx="12"/>
<text class="a3-mon-title" x="${MON.box[0] + 22}" y="${MON.box[1] + 28}">Finger skin temperature</text>
${openBand}
<text class="a3-mon-band" x="${f1(xOfT(3.9) + 6)}" y="${MON.y0 - 8}">← shunts open</text>
<path class="a3-grid" d="M${MON.x0} ${f1(yOfS(TRUTH.skinRise))}H${MON.x1}"/>
<text class="a3-tick" x="${MON.x0 - 8}" y="${f1(yOfS(TRUTH.skinRise) + 6)}" text-anchor="end">+${TRUTH.skinRise}°</text>
<path class="a3-axis" d="M${MON.x0} ${MON.y0}H${MON.x1}"/>
${[0, 10, 20, 30].map((t, i) => `<path class="a3-axis" d="M${f1(xOfT(t))} ${MON.y0}v5"/><text class="a3-tick" x="${f1(xOfT(t) + (i === 3 ? 10 : 0))}" y="${MON.y0 + 24}" text-anchor="${i === 3 ? "end" : "middle"}">${t}${i === 3 ? " min" : ""}</text>`).join("")}
<path class="a3-curve-ghost" d="${curve}"/>
<path class="a3-curve" data-part="curve"/>
<circle class="a3-dot" data-part="mdot" r="5.5"/>
</g>`;

// ---------------------------------------------------------------- the picture
const svg = `<svg class="iso-svg a3-svg" viewBox="0 0 600 630" role="img" aria-label="Fingertip skin in section. Under the ridged surface and the epidermis, small fingers of dermis hold capillary loops that drain into a network of veins. Below lies a small artery. Three coiled shunts, wrapped in muscle, connect the artery directly to the veins, and a nerve keeps them squeezed shut. During a hot flash the shunts open, warm blood floods the veins under the surface, and heat rises off the skin. A monitor shows the finger's skin temperature rising about 2.7 degrees within a minute and staying raised for half an hour.">
<defs>
  <linearGradient id="a3-derm" x1="0" y1="0" x2="0" y2="1"><stop offset="0" class="a3-d0"/><stop offset="1" class="a3-d1"/></linearGradient>
  <linearGradient id="a3-warm" x1="0" y1="0" x2="0" y2="1"><stop offset="0" class="a3-w0"/><stop offset="1" class="a3-w1"/></linearGradient>
  <clipPath id="a3-skinclip"><path d="${skinBlock}"/></clipPath>
</defs>
<path data-part="heat" class="a3-heat"/>
<path class="a3-derm" d="${skinBlock}" fill="url(#a3-derm)"/>
<g clip-path="url(#a3-skinclip)">
  <path class="a3-collagen" d="${collagen}"/>
  <path class="a3-fat" d="${fat}"/>
  ${GLANDS.map((g) => `<path class="a3-gland" d="${g.coil}"/><path class="a3-duct" d="${g.duct}"/>`).join("")}
  <path class="a3-feed" d="${FEEDS.join("")}"/>
  <path class="a3-art" data-part="art"/>
  <path class="a3-plex" data-part="plex"/>
  <path class="a3-loop-up" d="${LOOPS.map((l) => smooth(l.up)).join("")}"/>
  <path class="a3-loop-dn" d="${LOOPS.map((l) => smooth(l.down)).join("")}"/>
  <path class="a3-loop-cap" d="${LOOPS.map((l) => `M${f1(l.x - 1.6)} ${f1(l.top + 2)}Q${f1(l.x)} ${f1(l.top - 2)} ${f1(l.x + 1.6)} ${f1(l.top + 2)}`).join("")}"/>
  <path class="a3-glomus" d="${glomus}"/>
  <path class="a3-ava-wall" data-part="avaWall"/>
  <path class="a3-ava" data-part="ava"/>
  <path class="a3-nerve" d="${NERVE}${NERVE_BR.map((b) => smooth(b)).join("")}"/>
  <path class="a3-spike" data-part="spikes"/>
  <path class="a3-cells-art" data-part="cellsA"/><path class="a3-cells-ven" data-part="cellsV"/>
  <path class="a3-epi" d="${epidermis}"/>
  <path class="a3-kera" d="${kera}"/>
  <path class="a3-corneum" d="${corneumBand}"/>
  <path data-part="warm" class="a3-warmth" d="${skinBlock}" fill="url(#a3-warm)" opacity="0"/>
</g>
<path class="a3-surface" d="${smooth(surface)}"/>
<path class="a3-pores" d="${GLANDS.map((g) => dot(g.pore[0], g.pore[1] + 1, 2.2)).join("")}"/>
<path class="a3-cut" d="M${X0} ${f1(ySurf(X0))}V430M${X1} ${f1(ySurf(X1))}V430"/>
${monitor}
</svg>`;

const DATA = { loops: LOOPS.map((l) => ({ up: l.up, down: l.down })), avas: AVAS, plexus, artery, feeds: [78, 214, 352, 494], avaX: AVA_X, nerve: [[X0 - 4, 262], [90, 256], [170, 266], [250, 258], [330, 266], [410, 258], [500, 264], [X1 + 4, 258]], branches: NERVE_BR, surface: surface.map((p) => p.map(r1)), mon: MON, plexY: PLEX_Y, artY: ART_Y };
const strip = (src) => src.replace(/^import .*$/gm, "").replace(/^export /gm, "");
const SCRIPT = `${strip(readFileSync(join(HERE, "../01-menopause-thermostat/model.mjs"), "utf8"))}\n${strip(readFileSync(join(HERE, "model.mjs"), "utf8"))}\n${readFileSync(join(HERE, "live.js"), "utf8").replace("__DATA__", JSON.stringify(DATA))}`;
const CSS = readFileSync(join(HERE, "figure.css"), "utf8");
const CAPTION = [
  `Fingertips, palms and toes have a shortcut in their skin: coiled shunts (arteriovenous anastomoses) that join small arteries straight to the veins under the surface, skipping the capillaries. Each is wrapped in muscle, and a nerve keeps it squeezed shut most of the time.`,
  `In a hot flash the brain's heat-loss centre releases that squeeze. The shunts open, warm blood floods the veins just under the skin, and the finger's skin temperature rises about ${TRUTH.skinRise} °C within a minute while the heart beats about ${TRUTH.hrRise} beats a minute faster. The flash itself lasts a few minutes, but the finger stays warm for about half an hour.`,
  `<small>Typical values from laboratory recordings of women with hot flashes; the size of the rise varies widely (1–7 °C). Time runs fast after minute 7. Drawn far larger than life and simplified: real skin has many more shunts and loops.</small>`,
]
  .map((p) => `<span class="a3-par">${p}</span>`)
  .join("");
const body = plate({
  fig: "A3",
  title: "The finger's heat valves",
  hint: "Watch a flash · time speeds up after minute 7",
  stats: [
    { key: "min", label: "Minute", value: "—" },
    { key: "skin", label: "Finger skin", value: "+0.0 °C" },
    { key: "hr", label: "Heart rate", value: "+0 bpm" },
  ],
  controls: [{ name: "mode", label: "Show", options: [["flash", "A hot flash"], ["calm", "Between flashes"]].map(([value, label], i) => ({ value, label, pressed: i === 0 })) }],
  keys: [
    { mark: "ava", label: "Shunt, wrapped in muscle" },
    { mark: "artb", label: "Oxygen-rich blood" },
    { mark: "nerve", label: "Nerve keeping shunts shut" },
  ],
  caption: CAPTION,
  body: `<div class="iso-stage a3-stage">${svg}</div><p class="a3-scene" data-scene></p><span class="a3-sr" role="status" aria-live="polite" data-status></span>`,
});
const out = THEME === "light" ? `${SLUG}-light.html` : `${SLUG}.html`;
writeFileSync(join(HERE, out), page({ title: "The finger's heat valves", theme: THEME, body, css: CSS, script: SCRIPT }));
if (THEME === "light") {
  mkdirSync(join(HERE, "embed"), { recursive: true });
  writeFileSync(join(HERE, "embed", `optimal-fig-${SLUG}.js`), embed({ tag: `optimal-fig-${SLUG}`, body, script: SCRIPT, css: CSS }));
}
console.log("wrote", out, `${LOOPS.length} capillary loops, ${AVAS.length} shunts`);
