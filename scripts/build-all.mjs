// Build every figure and assemble the gallery in dist/.
//
// Convention: figures/<nn-slug>/build.mjs writes <slug>.html (Forest night) and,
// with --light, <slug>-light.html (Cream) next to itself. An optional
// figures/<nn-slug>/figure.json ({ n, title, line, status }) feeds the gallery.
import { execFileSync } from "node:child_process";
import { cpSync, existsSync, mkdirSync, readdirSync, readFileSync, rmSync, writeFileSync } from "node:fs";
import { join } from "node:path";
import { fileURLToPath } from "node:url";

const root = fileURLToPath(new URL("..", import.meta.url));
const figuresDir = join(root, "figures");
const dist = join(root, "dist");

const PLAN = [
  { dir: "01-menopause-thermostat", n: 1, title: "The narrowing thermostat", line: "Why a tiny rise in core temperature trips a hot flash after estrogen falls." },
  { dir: "02-inbody-580", n: 2, title: "Five cylinders on a bridge", line: "How the InBody 580 reads water inside and outside your cells." },
  { dir: "03-iv-iron", n: 3, title: "The depot with a gate", line: "Why hepcidin stalls iron pills, and how IV iron goes around the gate." },
  { dir: "04-creator-600", n: 4, title: "The runner rig", line: "How cadence and foot strike change the load on your hips and knees." },
  { dir: "05-vo2max", n: 5, title: "The ramp and the mask", line: "A VO2max ramp on a bike with a wireless mask." },
  { dir: "06-vo2max-treadmill", n: 6, title: "The treadmill ramp", line: "The same VO2max test on the Creator 600 treadmill." },
  { dir: "a2-hypothalamus", n: "A2", title: "The hot-flash switch", line: "Inside the hypothalamus: why less estrogen leaves the heat-loss centre on a hair trigger." },
  { dir: "a3-finger-skin", n: "A3", title: "The finger's heat valves", line: "Inside the +2.7 °C: tiny shunts in the skin open and warm blood floods the surface." },
  { dir: "a4-heart", n: "A4", title: "The beating heart", line: "Four chambers, four valves: how output climbs from rest to all-out." },
  { dir: "a9-bone-remodelling", n: "A9", title: "Digging and filling", line: "Bone is always being renewed; with less estrogen the digging outpaces the filling." },
  { dir: "a7-knee", n: "A7", title: "The kneecap's load", line: "Inside the knee on each landing, and why a quicker step rate eases the kneecap." },
  { dir: "a8-muscle-water", n: "A8", title: "Water in and around the fibres", line: "Where InBody's ICW and ECW actually sit, and why a high ratio doesn't say why." },
  { dir: "a6-red-cell-cycle", n: "A6", title: "The red cell's 120 days", line: "Why ferritin jumps in days after IV iron but haemoglobin takes weeks." },
  { dir: "a5-alveolus", n: "A5", title: "The air sac and the red cell", line: "A red cell fills with oxygen in a quarter-second; how much time it has to spare." },
  { dir: "a1-gut-cell", n: "A1", title: "The gut cell's gate", line: "A block of gut lining: iron in through the brush border, out through ferroportin, and hepcidin pulling the gates in." },
];

rmSync(dist, { recursive: true, force: true });
mkdirSync(dist, { recursive: true });
if (existsSync(join(root, "shared"))) cpSync(join(root, "shared"), join(dist, "shared"), { recursive: true });

const dirs = existsSync(figuresDir) ? readdirSync(figuresDir).filter((d) => existsSync(join(figuresDir, d, "build.mjs"))).sort() : [];
const built = new Map();

for (const dir of dirs) {
  const cwd = join(figuresDir, dir);
  const pages = [];
  try {
    execFileSync("node", ["build.mjs"], { cwd, stdio: "inherit" });
    execFileSync("node", ["build.mjs", "--light"], { cwd, stdio: "inherit" });
  } catch (err) {
    console.error(`✗ ${dir}: build failed`);
    process.exitCode = 1;
    continue;
  }
  mkdirSync(join(dist, dir), { recursive: true });
  for (const f of readdirSync(cwd)) {
    if (f.endsWith(".html")) {
      cpSync(join(cwd, f), join(dist, dir, f));
      pages.push(f);
    }
  }
  for (const extra of ["assets", "embed"]) {
    if (existsSync(join(cwd, extra))) cpSync(join(cwd, extra), join(dist, dir, extra), { recursive: true });
  }
  const meta = existsSync(join(cwd, "figure.json")) ? JSON.parse(readFileSync(join(cwd, "figure.json"), "utf8")) : {};
  built.set(dir, { ...meta, pages });
  console.log(`✓ ${dir}: ${pages.join(", ")}`);
}

const esc = (s) => String(s ?? "").replace(/[&<>"]/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;" })[c]);
const rows = PLAN.map((p) => {
  const b = built.get(p.dir);
  const title = b?.title ?? p.title;
  const line = b?.line ?? p.line;
  const status = b?.status ?? (b ? "Draft" : "Planned");
  const light = b?.pages.find((f) => f.endsWith("-light.html"));
  const dark = b?.pages.find((f) => !f.endsWith("-light.html"));
  const links = b
    ? `${light ? `<a href="${p.dir}/${light}">Cream</a>` : ""}${dark ? `<a href="${p.dir}/${dark}">Forest night</a>` : ""}`
    : `<span class="soon">Not built yet</span>`;
  return `<li class="${b ? "is-built" : ""}">
    <div class="n">Fig ${p.n}</div>
    <div class="body"><h2>${esc(title)}</h2><p>${esc(line)}</p></div>
    <div class="meta"><span class="status">${esc(status)}</span><div class="links">${links}</div></div>
  </li>`;
}).join("\n");

writeFileSync(join(dist, "index.html"), `<!doctype html>
<html lang="en"><head>
<meta charset="utf-8"><meta name="viewport" content="width=device-width, initial-scale=1">
<title>Optimal Figures</title>
<link rel="preconnect" href="https://fonts.googleapis.com"><link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
<link rel="stylesheet" href="https://fonts.googleapis.com/css2?family=Castoro:ital@0;1&family=Public+Sans:wght@400;500;600&display=swap">
<style>
:root{--cream:#fffcf7;--page:#fef8f1;--ink:#252525;--body:#3e3d39;--muted:#76736d;--rule:rgba(44,78,37,.22);--forest:#2c4e25;--sage:#5e7a59}
*{box-sizing:border-box}html,body{margin:0;background:var(--page);color:var(--ink);font:400 16px/1.55 "Public Sans",system-ui,sans-serif;-webkit-font-smoothing:antialiased}
main{max-width:880px;margin:0 auto;padding:56px 16px 80px}
.eyebrow{font-size:11px;font-weight:600;letter-spacing:.18em;text-transform:uppercase;color:var(--sage)}
h1{font:400 clamp(40px,8vw,64px)/.98 Castoro,Georgia,serif;letter-spacing:-.04em;color:var(--forest);margin:14px 0 14px}
h1 em{font-style:italic}
.lede{max-width:560px;color:var(--body);margin:0 0 40px}
ol{list-style:none;margin:0;padding:0;border-top:1px solid var(--forest)}
li{display:grid;grid-template-columns:64px 1fr auto;gap:20px;align-items:start;padding:22px 0;border-bottom:1px solid var(--rule)}
.n{font:italic 400 15px Castoro,Georgia,serif;color:var(--sage);padding-top:4px}
h2{font:400 24px/1.1 Castoro,Georgia,serif;letter-spacing:-.02em;color:var(--forest);margin:0 0 6px}
p{margin:0;color:var(--body);font-size:14.5px}
.meta{text-align:right;display:flex;flex-direction:column;gap:10px;align-items:flex-end}
.status{font-size:10.5px;font-weight:600;letter-spacing:.14em;text-transform:uppercase;color:var(--muted)}
li.is-built .status{color:var(--forest)}
.links{display:flex;gap:8px;flex-wrap:wrap;justify-content:flex-end}
.links a{display:inline-flex;align-items:center;min-height:44px;padding:0 16px;border-radius:999px;border:1px solid var(--forest);color:var(--forest);text-decoration:none;font-size:14px;font-weight:500}
.links a:first-child{background:var(--forest);color:var(--cream)}
.soon{font-size:13px;color:var(--muted)}
footer{margin-top:40px;font-size:12.5px;color:var(--muted)}
footer a{color:var(--forest)}
@media (max-width:640px){li{grid-template-columns:1fr;gap:8px}.meta{text-align:left;align-items:flex-start}.links{justify-content:flex-start}}
</style></head>
<body><main>
<div class="eyebrow">Optimal Health · Barrie</div>
<h1>How it <em>works</em>, as machines.</h1>
<p class="lede">Interactive figures for Optimal's services. Each one is a real, carefully built machine whose motion is the medical idea, driven by real numbers.</p>
<ol>
${rows}
</ol>
<footer>Built with <a href="https://github.com/wheresryan22/anatomy">Anatomy</a> (MIT). Explainers only, not medical advice. Your NP interprets your results.</footer>
</main></body></html>
`);
console.log(`gallery → dist/index.html (${built.size}/${PLAN.length} built)`);
