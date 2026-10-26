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
  { dir: "05-vo2max", n: 5, title: "The ramp and the mask", line: "A VO₂max ramp on a bike with a wireless mask." },
  { dir: "06-vo2max-treadmill", n: 6, title: "The treadmill ramp", line: "The same VO₂max test on the Creator 600 treadmill." },
  { dir: "a2-hypothalamus", n: "A2", title: "The hot-flash switch", line: "Inside the hypothalamus: why less estrogen leaves the heat-loss centre on a hair trigger." },
  { dir: "a3-finger-skin", n: "A3", title: "The finger's heat valves", line: "Inside the +2.7 °C: tiny shunts in the skin open and warm blood floods the surface." },
  { dir: "a4-heart", n: "A4", title: "The beating heart", line: "Four chambers, four valves: how output climbs from rest to all-out." },
  { dir: "a9-bone-remodelling", n: "A9", title: "Digging and filling", line: "Bone is always being renewed; with less estrogen the digging outpaces the filling." },
  { dir: "a7-knee", n: "A7", title: "The kneecap's load", line: "Inside the knee on each landing, and why a quicker step rate eases the kneecap." },
  { dir: "a8-muscle-water", n: "A8", title: "Water in and around the fibres", line: "Where InBody's ICW and ECW actually sit, and why a high ratio doesn't say why." },
  { dir: "a6-red-cell-cycle", n: "A6", title: "The red cell's 120 days", line: "Why ferritin jumps in days after IV iron but hemoglobin takes weeks." },
  { dir: "a5-alveolus", n: "A5", title: "The air sac and the red cell", line: "A block of lung cut open: a red cell fills with oxygen in a quarter-second; how much time it has to spare." },
  { dir: "a1-gut-cell", n: "A1", title: "The gut cell's gate", line: "A block of gut lining: iron in through the brush border, out through ferroportin, and hepcidin pulling the gates in." },
  // Equipment, taken apart: the clinic's machines built from their published dimensions (reveals/, anatomy-reveal skill),
  // each with an interactive take-apart page and a 12 s film for the reception TV (16:9) and Reels (9:16).
  { dir: "e1-inbody-580", n: "E1", group: "equipment", title: "The InBody 580, taken apart", line: "The body composition analyser, built part by part from its published dimensions." },
  { dir: "e2-creator-600", n: "E2", group: "equipment", title: "The Creator 600, taken apart", line: "The running gait analysis treadmill, built part by part from its published dimensions." },
  { dir: "e3-kickr-bike", n: "E3", group: "equipment", title: "The KICKR Bike, taken apart", line: "The indoor bike, built part by part from its published dimensions." },
  { dir: "e4-grip-dynamometer", n: "E4", group: "equipment", title: "The hand dynamometer, taken apart", line: "How a squeeze becomes a reading on the dial." },
];

rmSync(dist, { recursive: true, force: true });
mkdirSync(dist, { recursive: true });
// The placement review for Peter (where each figure and film goes on beoptimal.ca), copied as it is.
if (existsSync(join(root, "review", "placements"))) cpSync(join(root, "review", "placements"), join(dist, "review", "placements"), { recursive: true });
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
// Each card leads with the figure itself: a 5.5 s seamless loop of its stage in motion (figures/<dir>/assets/
// preview.mp4 + .jpg, recorded from the Cream page) or, for the machines, their 16:9 web film. Loops play only while
// on screen, and with reduced motion the card shows the poster.
const statusHtml = (s) => esc(s).replace(/\S+-\S+/g, (w) => `<span class="nw">${w}</span>`);
const card = (p) => {
  const b = built.get(p.dir);
  const title = b?.title ?? p.title;
  const line = b?.line ?? p.line;
  const status = b?.status ?? (b ? "Draft" : "Planned");
  const light = b?.pages.find((f) => f.endsWith("-light.html"));
  const dark = b?.pages.find((f) => !f.endsWith("-light.html"));
  const machine = p.group === "equipment";
  const slug = p.dir.replace(/^[a-z]?\d+-/, "");
  const media = machine
    ? { poster: `${p.dir}/assets/${slug}-16x9.jpg`, src: `${p.dir}/assets/${slug}-web-16x9.mp4` }
    : { poster: `${p.dir}/assets/preview.jpg`, src: `${p.dir}/assets/preview.mp4` };
  const has = existsSync(join(dist, media.poster));
  const open = light ? `${p.dir}/${light}` : null;
  const films = (b?.films || []).map((f) => `<a href="${p.dir}/${esc(f.href)}">${esc(f.label)}</a>`).join("");
  const links = b
    ? `<div class="links">${open ? `<a class="go" href="${open}">${machine ? "Take it apart" : "Open"} <span aria-hidden="true">→</span></a>` : ""}${dark ? `<a href="${p.dir}/${dark}">Forest night</a>` : ""}${films}</div>`
    : `<span class="soon">Not built yet</span>`;
  const mediaHtml = has
    ? `<video muted loop playsinline preload="none" poster="${media.poster}" data-src="${media.src}" aria-hidden="true" tabindex="-1"></video>`
    : `<div class="placeholder" aria-hidden="true">Fig ${esc(p.n)}</div>`;
  return `<article class="card${machine ? " machine" : ""}">
    ${open ? `<a class="media" href="${open}" tabindex="-1" aria-hidden="true">${mediaHtml}</a>` : `<div class="media">${mediaHtml}</div>`}
    <div class="text">
      <div class="kicker"><span class="n">Fig ${esc(p.n)}</span><span class="status${b ? " is-built" : ""}">${statusHtml(status)}</span></div>
      <h2>${open ? `<a href="${open}">${esc(title)}</a>` : esc(title)}</h2>
      <p>${esc(line)}</p>
      ${links}
    </div>
  </article>`;
};
const figuresHtml = PLAN.filter((p) => !p.group).map(card).join("\n");
const machinesHtml = PLAN.filter((p) => p.group === "equipment").map(card).join("\n");
const nFig = PLAN.filter((p) => !p.group).length, nMach = PLAN.filter((p) => p.group === "equipment").length;

writeFileSync(join(dist, "index.html"), `<!doctype html>
<html lang="en"><head>
<meta charset="utf-8"><meta name="viewport" content="width=device-width, initial-scale=1, viewport-fit=cover">
<title>Optimal Figures</title>
<meta name="description" content="Interactive figures for Optimal Health's services: each one a carefully built machine whose motion is the medical idea.">
<link rel="icon" href="data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 32 32'%3E%3Ccircle cx='16' cy='16' r='11' fill='none' stroke='%232c4e25' stroke-width='4'/%3E%3C/svg%3E">
<link rel="preconnect" href="https://fonts.googleapis.com"><link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
<link rel="stylesheet" href="https://fonts.googleapis.com/css2?family=Castoro:ital@0;1&family=Public+Sans:wght@400;500;600&display=swap">
<style>
:root{--cream:#fffcf7;--page:#fbf6ee;--ink:#252525;--body:#3e3d39;--muted:#716e68;--rule:rgba(44,78,37,.16);--rule-strong:rgba(44,78,37,.42);--forest:#2c4e25;--sage:#5e7a59}
*{box-sizing:border-box}html,body{margin:0;background:var(--page);color:var(--ink);font:400 16px/1.55 "Public Sans",system-ui,sans-serif;-webkit-font-smoothing:antialiased;font-feature-settings:"ss01","tnum" 0}
main{max-width:1200px;margin:0 auto;padding:clamp(40px,7vw,80px) 20px 88px}
.eyebrow{font-size:11px;font-weight:600;letter-spacing:.18em;text-transform:uppercase;color:var(--sage)}
h1{font:400 clamp(42px,7.4vw,76px)/.96 Castoro,Georgia,serif;letter-spacing:-.04em;color:var(--forest);margin:14px 0 18px;text-wrap:balance}
h1 em,h3 em{font-style:italic}
.lede{max-width:600px;color:var(--body);margin:0;font-size:17px}
.facts{display:flex;flex-wrap:wrap;gap:4px 22px;margin:18px 0 0;font-size:13.5px;color:var(--muted)}
.facts b{color:var(--forest);font-weight:600}
.grid{display:grid;grid-template-columns:repeat(3,minmax(0,1fr));grid-auto-flow:dense;gap:44px 28px;margin-top:44px;padding-top:32px;border-top:1px solid var(--forest)}
.card{display:flex;flex-direction:column;gap:16px;min-width:0}
.media{position:relative;display:block;aspect-ratio:4/5;border-radius:18px;overflow:hidden;background:var(--cream);border:1px solid var(--rule);transition:border-color .3s ease;isolation:isolate}
.media video,.media .placeholder{position:absolute;inset:0;width:100%;height:100%;object-fit:cover;display:block;transition:transform .6s cubic-bezier(.2,.7,.2,1)}
.placeholder{display:grid;place-items:center;font:italic 400 22px Castoro,Georgia,serif;color:var(--sage)}
.card:hover .media{border-color:var(--rule-strong)}
.card:hover .media video{transform:scale(1.015)}
.text{display:grid;gap:7px;padding-inline:2px}
.kicker{display:flex;justify-content:space-between;align-items:baseline;gap:12px}
.n{font:italic 400 15px Castoro,Georgia,serif;color:var(--sage);white-space:nowrap}
.status{font-size:10.5px;font-weight:600;letter-spacing:.14em;text-transform:uppercase;color:var(--muted);text-align:right;line-height:1.5}
.status.is-built{color:var(--forest)}
.nw{white-space:nowrap}
h2{font:400 25px/1.1 Castoro,Georgia,serif;letter-spacing:-.02em;color:var(--forest);margin:2px 0 0;text-wrap:balance}
h2 a{color:inherit;text-decoration:none}
h2 a:hover{text-decoration:underline;text-decoration-thickness:1px;text-underline-offset:4px}
p{margin:0;color:var(--body);font-size:14.5px;max-width:62ch}
.links{display:flex;flex-wrap:wrap;gap:0 18px;margin-top:4px}
.links a{display:inline-flex;align-items:center;min-height:44px;color:var(--muted);font-size:14px;font-weight:500;text-decoration:none}
.links a:hover{color:var(--forest);text-decoration:underline;text-underline-offset:4px}
.links a.go{color:var(--forest);font-weight:600}
.links a.go span{display:inline-block;margin-left:6px;transition:transform .25s ease}
.links a.go:hover span{transform:translateX(3px)}
a:focus-visible{outline:2px solid var(--forest);outline-offset:3px;border-radius:6px}
.soon{font-size:13px;color:var(--muted)}
h3.group{font:400 clamp(30px,5vw,44px)/1.02 Castoro,Georgia,serif;letter-spacing:-.03em;color:var(--forest);margin:88px 0 12px;text-wrap:balance}
.grid.machines{grid-template-columns:repeat(2,minmax(0,1fr))}
.machine .media{aspect-ratio:16/9;background:#f4efe6}
.machine .media video{object-fit:cover}
footer{margin-top:64px;padding-top:20px;border-top:1px solid var(--rule);font-size:12.5px;color:var(--muted)}
footer a{color:var(--forest)}
@media (max-width:980px){.grid{grid-template-columns:repeat(2,minmax(0,1fr));gap:40px 22px}}
@media (max-width:640px){.grid,.grid.machines{grid-template-columns:minmax(0,1fr);gap:40px}main{padding-inline:16px}}
@media (prefers-reduced-motion:reduce){.media video{transition:none}.card:hover .media video{transform:none}}
</style></head>
<body><main>
<div class="eyebrow">Optimal Health · Barrie</div>
<h1>How it <em>works</em>, as machines.</h1>
<p class="lede">Interactive figures for Optimal's services. Each one is a real, carefully built machine whose motion is the medical idea, driven by real numbers.</p>
<div class="facts"><span><b>${nFig}</b> figures</span><span><b>${nMach}</b> machines, taken apart</span><span>Cream and Forest night themes</span></div>
<section class="grid" aria-label="Figures">
${figuresHtml}
</section>
<h3 class="group">Equipment, <em>taken apart</em></h3>
<p class="lede">The clinic's machines, built part by part from their published dimensions. Turn each one, take it apart, or play its film.</p>
<section class="grid machines" aria-label="Equipment">
${machinesHtml}
</section>
<footer>Built with <a href="https://github.com/wheresryan22/anatomy">Anatomy</a> (MIT). Explainers only, not medical advice. Your NP interprets your results.</footer>
</main>
<script>
(() => {
  const still = matchMedia('(prefers-reduced-motion: reduce)').matches;
  const videos = [...document.querySelectorAll('.media video[data-src]')];
  if (still || !('IntersectionObserver' in window)) return;
  const io = new IntersectionObserver((entries) => {
    for (const e of entries) {
      const v = e.target;
      if (e.isIntersecting) {
        if (!v.src) { v.src = v.dataset.src; v.preload = 'auto'; }
        v.play().catch(() => {});
      } else if (!v.paused) v.pause();
    }
  }, { threshold: 0.35 });
  videos.forEach((v) => io.observe(v));
})();
</script>
</body></html>
`);
console.log(`gallery → dist/index.html (${built.size}/${PLAN.length} built)`);
