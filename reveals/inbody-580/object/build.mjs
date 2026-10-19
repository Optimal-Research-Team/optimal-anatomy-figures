import { readFileSync, writeFileSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";
import * as k from "../kit/iso-kit.mjs";
import { turnScript } from "../scripts/inline-kit.mjs";
import { scene, PAGE_HELPERS } from "./scene.mjs";
import { FILM, FIGURE, FEATURE_KEYS } from "./film.mjs";
import { fontCss, THEME_CSS, glowCss } from "./brand.mjs";

const HERE = dirname(fileURLToPath(import.meta.url));
const theme = process.argv.includes("--light") ? "light" : "dark";
const W = 640;
const H = 600;
const S = scene({ W, H, radius: FILM.radius, pad: 4 });
const counts = { parts: S.out.report.parts, assemblies: S.obj.explode.length, ...(S.obj.counts ?? {}) };
const fill = (text) => text.replace(/\{(\w+)\}/g, (_, key) => counts[key] ?? `{${key}}`);
const keyList = FEATURE_KEYS.map((f) => f.key.toUpperCase()).join(" · ");
const keySpeech = FEATURE_KEYS.map((f) => `${f.key.toUpperCase()} ${f.verb}`).join(", ");
const css = `${S.out.css}
${fontCss()}
${THEME_CSS}
${glowCss()}
body{font-family:'Public Sans',ui-sans-serif,system-ui,sans-serif;font-feature-settings:"tnum" 1,"ss01" 1}
.ar-head{margin:0 0 22px}
.ar-eyebrow{margin:0 0 10px;font:600 11px/1 'Public Sans',sans-serif;letter-spacing:.14em;text-transform:uppercase;color:var(--anatomy-muted)}
.ar-head h1{margin:0;font:400 40px/1.08 'Castoro',Georgia,serif;letter-spacing:-.01em;color:var(--anatomy-strong)}
.ar-head h1 em{font-style:italic}
.ar-head p.ar-sub{margin:12px 0 0;max-width:56ch;font-size:15px;line-height:1.55;color:var(--anatomy-text)}
.iso-plate{box-shadow:0 0 0 1px color-mix(in srgb,var(--anatomy-mid) 55%,transparent)}
.iso-plate-corner{font-family:'Public Sans',sans-serif;font-weight:500;letter-spacing:.08em}
.iso-legend{font-size:13.5px}
.iso-caption{max-width:68ch}
@media (max-width:560px){.ar-spec{grid-template-columns:repeat(2,1fr)!important}}
.ar-spec{display:grid;grid-template-columns:repeat(3,1fr);gap:0;margin:26px 0 0;border-top:1px solid color-mix(in srgb,var(--anatomy-mid) 40%,transparent)}
.ar-spec div{padding:12px 14px 12px 0;border-bottom:1px solid color-mix(in srgb,var(--anatomy-mid) 40%,transparent)}
.ar-spec dt{font:600 10.5px/1.3 'Public Sans',sans-serif;letter-spacing:.12em;text-transform:uppercase;color:var(--anatomy-muted)}
.ar-spec dd{margin:4px 0 0;font:400 17px/1.3 'Castoro',Georgia,serif;color:var(--anatomy-strong)}
.ar-note{margin:18px 0 0;font-size:12.5px;line-height:1.55;color:var(--anatomy-muted);max-width:72ch}
.ar-stage{cursor:grab;outline:none;touch-action:none}
@media (hover:none){.ar-stage{touch-action:pan-y}}
.ar-hint-touch{display:none}
@media (hover:none){.ar-hint-hover{display:none}.ar-hint-touch{display:inline}}
.ar-controls{display:grid;grid-template-columns:repeat(4,minmax(0,1fr));gap:8px;margin:12px 0 4px}
@media (max-width:560px){.ar-controls{grid-template-columns:repeat(2,minmax(0,1fr))}}
.ar-btn{appearance:none;-webkit-appearance:none;min-height:44px;margin:0;padding:10px 14px;border:1px solid color-mix(in srgb,var(--anatomy-mid) 60%,transparent);border-radius:0;background:transparent;color:var(--anatomy-strong);font:500 14px/1.2 'Public Sans',ui-sans-serif,system-ui,sans-serif;letter-spacing:.01em;text-align:center;cursor:pointer;touch-action:manipulation;-webkit-tap-highlight-color:transparent;transition:border-color .15s,background-color .15s}
.ar-btn:focus-visible{outline:2px solid var(--anatomy-strong);outline-offset:2px}
.ar-btn[aria-pressed="true"]{border-color:var(--anatomy-strong);background:color-mix(in srgb,var(--anatomy-strong) 8%,transparent)}
.ar-btn[aria-disabled="true"]{cursor:default;color:var(--anatomy-muted)}
.ar-btn:active{background:color-mix(in srgb,var(--anatomy-strong) 12%,transparent)}
@media (hover:hover){.ar-btn:hover{border-color:var(--anatomy-strong)}}
.ar-stage:active{cursor:grabbing}
.ar-stage:focus-visible{box-shadow:0 0 0 1px var(--anatomy-mid)}
.iso-face-text[data-tone="lit"]{fill:var(--anatomy-lit)}
.iso-face-text[data-tone="mid"]{fill:var(--anatomy-mid)}`;
const halo = `<ellipse cx="${W / 2}" cy="${H * 0.72}" rx="${W * 0.17}" ry="${H * 0.022}" class="iso-halo" style="filter:blur(8px)"/>`;
const aria = `${FIGURE.title}: drag to turn it; tap, hover or press A to take it apart; arrow keys turn it${keySpeech ? `, ${keySpeech}` : ""}. The buttons below the figure do the same.`;
const stage = `<div class="iso-stage iso-turn ar-stage" tabindex="0" role="slider" aria-label="${aria}" aria-valuetext="assembled">${k.figureSvg({ width: W, height: H, label: fill(FIGURE.label), body: halo })}${S.out.layerSvg("live", { width: W, height: H })}</div>`;
const header = `<header class="ar-head"><p class="ar-eyebrow">Optimal Health · Barrie</p><h1>InBody 580, <em>taken apart</em></h1><p class="ar-sub">The body-composition analyser every member stands on each quarter, rebuilt part by part from its published dimensions. <span class="ar-hint-hover">Drag to turn it; hover, press A or use the buttons below to take it apart.</span><span class="ar-hint-touch">Drag to turn it; tap it or use the buttons below to take it apart.</span></p></header>`;
const spec = `<dl class="ar-spec">${[
  ["Size", "501.9 × 892.4 × 1124.4 mm"],
  ["Weight", "24.4 kg"],
  ["Electrodes", "8-point tactile"],
  ["Frequencies", "5, 50, 250, 500 kHz"],
  ["Readings", "20 impedances"],
  ["Display", "10.1-inch touchscreen"],
].map(([a, b]) => `<div><dt>${a}</dt><dd>${b}</dd></div>`).join("")}</dl><p class="ar-note">Sources: InBody 580 user manual (EN rev B, §9.2) and catalog (rev C). Internals are not published; the load cells, harness, cable bundle and boards shown here are simplified assumptions. No manufacturer marks are drawn.</p>`;
const controlsHtml = `<div class="ar-controls" role="group" aria-label="Controls">${[
  `<button type="button" class="ar-btn" data-act="apart">Take apart</button>`,
  ...FEATURE_KEYS.map((f) => (f.run ? `<button type="button" class="ar-btn" data-act="${f.channel}" aria-disabled="false">${f.button}</button>` : `<button type="button" class="ar-btn" data-act="${f.channel}" aria-pressed="false">${f.button}</button>`)),
].join("")}</div>`;
const body = header + k.plateHtml({
  fig: "Optimal Health",
  title: FIGURE.title,
  hint: "__HINT__",
  readout: "",
  keys: FIGURE.keys,
  caption: fill(FIGURE.caption),
  body: `<style>${css}</style>${stage}`,
}).replace("__HINT__", `<span class="ar-hint-hover">Drag to turn · hover to take apart${keyList ? ` · ${keyList}` : ""}</span><span class="ar-hint-touch">Drag to turn · tap to take apart</span>`)
  .replace('<figcaption class="iso-legend">', controlsHtml + '<figcaption class="iso-legend">') + spec;
const film = readFileSync(join(HERE, "film.mjs"), "utf8").replace(/^export /gm, "");
const DATA = { turn: S.out.data, explode: S.obj.explode, basis: S.basis, parts: counts.parts };
const LIVE = readFileSync(join(HERE, "live.js"), "utf8")
  .replace("__DATA__", JSON.stringify(DATA))
  .replace("__HELPERS__;", PAGE_HELPERS)
  .replace("__FILM__;", film);
const page = k.pageHtml({ title: "InBody 580 anatomy", theme, body, script: turnScript() + LIVE, width: 760 });
const name = `figure${theme === "light" ? "-light" : ""}.html`;
writeFileSync(join(HERE, name), page);
console.log(`wrote ${name} · ${(page.length / 1024).toFixed(0)} KB · ${counts.parts} parts · ${counts.assemblies} assemblies · build ${S.seconds.toFixed(1)} s`);
