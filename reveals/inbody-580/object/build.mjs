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
// E1–E4 share one page chrome (series.css) and keep a number on the same line as its unit ("1124.4 mm", "500 kHz")
const SERIES_CSS = readFileSync(join(HERE, "series.css"), "utf8");
const tidy = (text) => text.replace(/(\d) (mm|cm|kg|kHz|Hz|km\/h|%|°)(?![\w/])/g, "$1\u00a0$2").replace(/(\d)–(?=\d)/g, "$1–\u2060");
const css = `${S.out.css}
${fontCss()}
${THEME_CSS}
${glowCss()}
body{font-family:'Public Sans',ui-sans-serif,system-ui,sans-serif;font-feature-settings:"tnum" 1,"ss01" 1}
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
.ar-stage:active{cursor:grabbing}
.ar-stage:focus-visible{box-shadow:0 0 0 1px var(--anatomy-mid)}
.iso-face-text[data-tone="lit"]{fill:var(--anatomy-lit)}
.iso-face-text[data-tone="mid"]{fill:var(--anatomy-mid)}
${SERIES_CSS}`;
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
].map(([a, b]) => `<div><dt>${a}</dt><dd>${tidy(b)}</dd></div>`).join("")}</dl><p class="ar-note">Sources: InBody 580 user manual (EN rev B, §9.2) and catalog (rev C). Internals are not published; the load cells, harness, cable bundle and boards shown here are simplified assumptions. No manufacturer marks are drawn.</p>`;
const controlsHtml = `<div class="ar-controls" role="group" aria-label="Controls">${[
  `<button type="button" class="ar-btn" data-act="apart" aria-pressed="false">Take apart</button>`,
  ...FEATURE_KEYS.map((f) => (f.run ? `<button type="button" class="ar-btn" data-act="${f.channel}" aria-disabled="false">${f.button}</button>` : `<button type="button" class="ar-btn" data-act="${f.channel}" aria-pressed="false">${f.button}</button>`)),
].join("")}</div>`;
const body = header + k.plateHtml({
  fig: FILM.fig,
  title: FILM.title,
  hint: "__HINT__",
  readout: "",
  keys: FIGURE.keys,
  caption: tidy(fill(FIGURE.caption)),
  body: `<style>${css}</style>${stage}`,
}).replace("__HINT__", `<span class="ar-hint-hover">Drag to turn · hover to take apart${keyList ? ` · ${keyList}` : ""}</span><span class="ar-hint-touch">Drag to turn · tap to take apart</span>`)
  .replace('<figcaption class="iso-legend">', controlsHtml + '<figcaption class="iso-legend">') + spec;
const film = readFileSync(join(HERE, "film.mjs"), "utf8").replace(/^export /gm, "");
const DATA = { turn: S.out.data, explode: S.obj.explode, basis: S.basis, parts: counts.parts };
const LIVE = readFileSync(join(HERE, "live.js"), "utf8")
  .replace("__DATA__", JSON.stringify(DATA))
  .replace("__HELPERS__;", PAGE_HELPERS)
  .replace("__FILM__;", film);
const page = k.pageHtml({ title: "InBody 580, taken apart · Optimal Health", theme, body, script: turnScript() + LIVE, width: 760 });
const name = `figure${theme === "light" ? "-light" : ""}.html`;
// an inline icon, so the gallery doesn't log a /favicon.ico 404 on every page
writeFileSync(join(HERE, name), page.replace("<title>", `<link rel="icon" href="data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 32 32'%3E%3Ccircle cx='16' cy='16' r='11' fill='none' stroke='%232c4e25' stroke-width='4'/%3E%3C/svg%3E"><title>`));
console.log(`wrote ${name} · ${(page.length / 1024).toFixed(0)} KB · ${counts.parts} parts · ${counts.assemblies} assemblies · build ${S.seconds.toFixed(1)} s`);
