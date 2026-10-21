// QA for the figures on the website: every placement in handoff/placements.json, on a running site.
//
//   source .env.chrome                                          # headless Chrome (see scripts/setup-cloud.sh)
//   node handoff/qa/check-embeds.mjs https://<preview>.vercel.app [--only primary|secondary|all] [--width 390] [--route /path]
//
// For each page it opens the page at phone width (390 px by default), scrolls every figure slot into view
// one by one, and checks that:
//   - the slot exists (`[data-optimal-fig="<slug>"]` or a `.optimal-figure` holding `<optimal-fig-<slug>>`);
//   - the custom element mounted and drew its card in its shadow root (`.opt-figure`), with a non-empty SVG;
//   - the page doesn't scroll sideways;
//   - the console is clean;
//   - figures with a lazy WebGL layer (A2, `hypothalamus`) bring it up: its chunk (hypothalamus-3d.js, next to
//     the embed script) loads and the stage reports data-gl="on". If it stays on its SVG, the reason is printed
//     (svg:load = the chunk isn't deployed next to optimal-fig-hypothalamus.js). Run QA on a machine with WebGL.
// Then, for pages with such a figure, a second pass with WebGL switched off checks the SVG fallback: the card
// still mounts and draws, the stage reports data-gl="svg:no-webgl2", nothing downloads the chunk, and the
// console stays clean.
// It saves a screenshot of each figure to handoff/qa/shots/. Exit code 1 if anything fails.
import { execFileSync } from "node:child_process";
import { mkdirSync, readFileSync, writeFileSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";

const here = dirname(fileURLToPath(import.meta.url));
const root = join(here, "..", "..");
const base = (process.argv[2] || "").replace(/\/$/, "");
if (!/^https?:\/\//.test(base)) {
  console.error("usage: node handoff/qa/check-embeds.mjs <site base URL> [--only primary] [--width 390]");
  process.exit(1);
}
const opt = (name, fallback) => {
  const i = process.argv.indexOf(name);
  return i > 0 ? process.argv[i + 1] : fallback;
};
// default: the placements to ship now ("primary", plus "primary-now" for pages that exist today)
const only = opt("--only", "primary");
const width = Number(opt("--width", "390"));
const onlyRoute = opt("--route", null);
// figures whose embed lazily adds one WebGL layer, and how to read its state
const GL_FIGURES = { hypothalamus: { stage: ".a2-stage", chunk: "hypothalamus-3d.js" } };
const { figures } = JSON.parse(readFileSync(join(here, "..", "placements.json"), "utf8"));
const pages = new Map();
for (const f of figures)
  for (const p of f.placements) {
    if (!p.route.startsWith("/")) continue; // pages that don't exist yet
    if (onlyRoute && p.route !== onlyRoute) continue;
    if (only !== "all" && !p.priority.startsWith(only)) continue;
    if (!pages.has(p.route)) pages.set(p.route, []);
    if (!pages.get(p.route).includes(f.slug)) pages.get(p.route).push(f.slug);
  }
if (!pages.size) {
  console.error(`No placements match${onlyRoute ? ` --route ${onlyRoute}` : ""} (--only ${only}).`);
  process.exit(1);
}
mkdirSync(join(here, "shots"), { recursive: true });
const drive = join(root, ".claude/skills/anatomy/scripts/drive.mjs");
let failed = 0;
for (const [route, slugs] of pages) {
  const probe = `(async () => {
    const out = [];
    const tops = {};
    for (const slug of ${JSON.stringify(slugs)}) {
      const slot = document.querySelector('[data-optimal-fig="' + slug + '"]') || document.querySelector('optimal-fig-' + slug)?.closest('.optimal-figure');
      if (!slot) { out.push(slug + ': NO SLOT'); continue; }
      scrollTo({ top: slot.getBoundingClientRect().top + scrollY - 8, behavior: 'instant' }); // the site sets scroll-behavior: smooth
      let ok = false;
      for (let i = 0; i < 60 && !ok; i++) {
        await new Promise((r) => setTimeout(r, 100));
        const el = slot.querySelector('optimal-fig-' + slug);
        const card = el && el.shadowRoot && el.shadowRoot.querySelector('.opt-figure');
        ok = !!(card && card.querySelector('svg') && card.getBoundingClientRect().height > 200);
      }
      let gl = '';
      const G = ${JSON.stringify(GL_FIGURES)}[slug];
      if (ok && G) {
        // the 3-D layer: wait for it to come up (or say why it stayed on its SVG)
        const el = slot.querySelector('optimal-fig-' + slug);
        for (let i = 0; i < 150; i++) {
          gl = (el.shadowRoot.querySelector(G.stage) || {}).dataset?.gl || '';
          if (gl === 'on' || gl.startsWith('svg:')) break;
          await new Promise((r) => setTimeout(r, 100));
        }
        const chunk = performance.getEntriesByType('resource').some((e) => e.name.includes(G.chunk));
        gl = GL_EXPECT === 'svg' ? (gl === 'svg:no-webgl2' && !chunk ? ' (SVG fallback)' : ' (FALLBACK FAILED: ' + (gl || 'no state') + (chunk ? ', chunk downloaded' : '') + ')') : gl === 'on' ? ' (3-D on)' : ' (3-D FAILED: ' + (gl || 'no state') + ')';
      }
      out.push(slug + ': ' + (ok ? 'ok' : 'DID NOT MOUNT') + gl);
      tops[slug] = Math.round(slot.getBoundingClientRect().top + scrollY);
    }
    const wide = document.documentElement.scrollWidth > innerWidth + 1;
    return out.join(', ') + (wide ? ' | SIDEWAYS SCROLL' : '') + ' @@' + JSON.stringify(tops);
  })()`;
  const run = (actions, flags = []) => {
    const file = join(here, "shots", ".actions.json");
    writeFileSync(file, JSON.stringify(actions));
    try {
      return execFileSync("node", [drive, base + route, "--actions", file, "--width", String(width), "--height", "900", "--theme", "light", ...flags], { encoding: "utf8" });
    } catch (e) {
      return String(e.stdout || e.message);
    }
  };
  const probeFor = (expect) => `(() => { const GL_EXPECT = ${JSON.stringify(expect)}; return ${probe}; })()`;
  // pass 1: every slot mounts, and where each one sits
  const log = run([["wait", 2500], ["eval", probeFor("gl")]]);
  const raw = (log.match(/eval: "(.*)"/) || [])[1] || "no result";
  const [result, topsJson] = raw.split(" @@");
  const consoleLine = (log.match(/console: .*/) || ["console: ?"])[0];
  let bad = /NO SLOT|DID NOT MOUNT|SIDEWAYS|FAILED|no result/.test(result) || !/console: clean/.test(consoleLine);
  // pass 2: a screenshot of the screen at each figure (visible viewport only)
  let tops = {};
  try {
    tops = JSON.parse(topsJson.replace(/\\"/g, '"'));
  } catch {}
  const shots = [["wait", 2500]];
  for (const slug of slugs) {
    if (tops[slug] === undefined) continue;
    const y = Math.max(0, tops[slug] - 8);
    shots.push(["eval", `(scrollTo({ top: ${y}, behavior: 'instant' }), 0)`], ["wait", 1800], ["shot", join(here, "shots", `${route.replace(/\W+/g, "_")}-${slug}-${width}.png`), "html", 1, [0, y, width, 900]]);
  }
  if (shots.length > 1) run(shots);
  console.log(`${bad ? "✗" : "✓"} ${route}  ${result}  ${consoleLine}`);
  // pass 3: no WebGL, for pages with a WebGL-layer figure: the SVG fallback mounts, draws and stays quiet
  if (slugs.some((s) => GL_FIGURES[s])) {
    const log2 = run([["wait", 2500], ["eval", probeFor("svg")]], ["--no-webgl"]);
    const raw2 = ((log2.match(/eval: "(.*)"/) || [])[1] || "no result").split(" @@")[0];
    const console2 = (log2.match(/console: .*/) || ["console: ?"])[0];
    const bad2 = /NO SLOT|DID NOT MOUNT|SIDEWAYS|FAILED|no result/.test(raw2) || !/console: clean/.test(console2);
    bad ||= bad2;
    console.log(`${bad2 ? "✗" : "✓"} ${route}  without WebGL: ${raw2}  ${console2}`);
  }
  if (bad) failed++;
}
console.log(failed ? `\n${failed} page(s) failed` : "\nall pages passed");
process.exit(failed ? 1 : 0);
