import { readFileSync, writeFileSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";
import * as k from "../kit/iso-kit.mjs";
import { turnScript } from "../scripts/inline-kit.mjs";
import { scene, PAGE_HELPERS } from "./scene.mjs";
import { FILM, FIGURE, FEATURE_KEYS } from "./film.mjs";
import { fontCss } from "../scripts/fonts.mjs";

const HERE = dirname(fileURLToPath(import.meta.url));
const theme = process.argv.includes("--light") ? "light" : "dark";
const W = 640;
const H = 600;
const S = scene({ W, H, radius: FILM.radius, pad: 4 });
const counts = { parts: S.out.report.parts, assemblies: S.obj.explode.length, ...(S.obj.counts ?? {}) };
const fill = (text) => text.replace(/\{(\w+)\}/g, (_, key) => counts[key] ?? `{${key}}`);
const keyList = FEATURE_KEYS.map((f) => f.key.toUpperCase()).join(" · ");
const keySpeech = FEATURE_KEYS.map((f) => `${f.key.toUpperCase()} ${f.verb}`).join(", ");
// E1–E4 share one page chrome (series.css) and keep a number on the same line as its unit ("2290 mm", "20 km/h")
const SERIES_CSS = readFileSync(join(HERE, "series.css"), "utf8");
const tidy = (text) => text.replace(/(\d) (mm|cm|kg|kHz|Hz|km\/h|%|°)(?![\w/])/g, "$1\u00a0$2").replace(/(\d)–(?=\d)/g, "$1–\u2060");
// Optimal's two themes: Cream (light, cream paper, forest ink) and Forest night (dark)
const OPTIMAL = `
.iso{--anatomy-page:#152511;--anatomy-card:#1c3118;--anatomy-text:#c9cdbf;--anatomy-strong:#fffcf7;--anatomy-muted:#8e9884;--anatomy-paper:#1c3118;--anatomy-face:#253821;--anatomy-top:#283c24;--anatomy-shade-0:#172812;--anatomy-shade-1:#1a2c16;--anatomy-shade-2:#1e321a;--anatomy-shade-3:#22371e;--anatomy-lit-top:#34492f;--anatomy-lit-shade:#2a3f26;--anatomy-hi:#e9e6dc;--anatomy-mid:#7e8a74;--anatomy-lo:#4d5c46;--anatomy-faint:#33452e;--anatomy-lit:#fffcf7;--anatomy-halo:#0b1508;--anatomy-halo-opacity:.9;--anatomy-dot:#e9e6dc;--anatomy-mono:"Public Sans",system-ui,sans-serif}
.iso[data-theme="light"]{--anatomy-page:#f6f1e7;--anatomy-card:#fffcf7;--anatomy-text:#3e4a3a;--anatomy-strong:#2c4e25;--anatomy-muted:#6f7a66;--anatomy-paper:#fffcf7;--anatomy-face:#fffefb;--anatomy-top:#fffefb;--anatomy-shade-0:#ddd7cc;--anatomy-shade-1:#e7e2d9;--anatomy-shade-2:#f0ede5;--anatomy-shade-3:#f6f3ec;--anatomy-lit-top:#fffefb;--anatomy-lit-shade:#efebe2;--anatomy-hi:#2c4e25;--anatomy-mid:#8e9884;--anatomy-lo:#b4b9a8;--anatomy-faint:#d6d9cc;--anatomy-lit:#2c4e25;--anatomy-halo:#6f7a66;--anatomy-halo-opacity:.28;--anatomy-dot:#2c4e25}
body{font-family:"Public Sans",system-ui,sans-serif;font-feature-settings:"kern","tnum"}
.hint-touch{display:none}
@media (hover:none){.hint-hover{display:none}.hint-touch{display:inline}}
`;
const css = `${S.out.css}
.ar-stage{cursor:grab;outline:none;touch-action:none}
.ar-stage:active{cursor:grabbing}
.ar-stage:focus-visible{box-shadow:0 0 0 1px var(--anatomy-mid)}
.iso-face-text[data-tone="lit"]{fill:var(--anatomy-lit)}
.iso-face-text[data-tone="mid"]{fill:var(--anatomy-mid)}
${OPTIMAL}
${SERIES_CSS}`;
const halo = `<ellipse cx="${W / 2}" cy="${H * 0.72}" rx="${W * 0.17}" ry="${H * 0.022}" class="iso-halo" style="filter:blur(8px)"/>`;
const aria = `${FIGURE.title}: drag to turn it, hover to take it apart; arrow keys turn it, A takes it apart${keySpeech ? `, ${keySpeech}` : ""}`;
const stage = `<div class="iso-stage iso-turn ar-stage" tabindex="0" role="slider" aria-label="${aria}" aria-valuetext="assembled">${k.figureSvg({ width: W, height: H, label: fill(FIGURE.label), body: halo })}${S.out.layerSvg("live", { width: W, height: H })}</div>`;
const body = k.plateHtml({
  fig: FILM.fig,
  title: FILM.title,
  hint: `Drag to turn · hover to take apart${keyList ? ` · ${keyList}` : ""}`,
  readout: "",
  keys: FIGURE.keys,
  caption: tidy(fill(FIGURE.caption)),
  body: `<style>${css}</style>${stage}`,
});
// touch parity: a visible control row under the figure (real buttons, 44 px), and a touch hint
const controls = `<div class="ar-controls" data-controls role="group" aria-label="Controls"><button type="button" class="ar-btn" data-act="apart" aria-pressed="false">Take apart</button>${FEATURE_KEYS.map((f) => `<button type="button" class="ar-btn" data-act="${f.channel}"${f.momentary ? "" : ' aria-pressed="false"'}>${f.button ?? f.name}</button>`).join("")}</div>`;
const hintHover = `Drag to turn · hover to take apart${keyList ? ` · ${keyList}` : ""}`;
const figureHtml = body
  .replace(`>${hintHover}</span>`, `><span class="hint-hover">${hintHover}</span><span class="hint-touch">Drag to turn · tap to take apart</span></span>`)
  .replace('</div><figcaption', `</div>${controls}<figcaption`);
if (figureHtml === body) throw new Error("figure: could not place the controls or the touch hint");
const header = `<header class="ar-head"><p class="ar-eyebrow">${FILM.fig}</p><h1>Creator 600, <em>taken apart</em></h1><p class="ar-sub">${counts.parts} parts: a depth camera under a 50-inch portrait screen that tracks your joints as you run.</p></header>`;
const film = readFileSync(join(HERE, "film.mjs"), "utf8").replace(/^export /gm, "");
const DATA = { turn: S.out.data, explode: S.obj.explode, basis: S.basis, parts: counts.parts };
const LIVE = readFileSync(join(HERE, "live.js"), "utf8")
  .replace("__DATA__", JSON.stringify(DATA))
  .replace("__HELPERS__;", PAGE_HELPERS)
  .replace("__FILM__;", film);
const page = k.pageHtml({ title: "Creator 600, taken apart · Optimal Health", theme, body: `<style>${fontCss()}</style>${header}${figureHtml}`, script: turnScript() + LIVE, width: 760 });
const name = `figure${theme === "light" ? "-light" : ""}.html`;
// an inline icon, so the gallery doesn't log a /favicon.ico 404 on every page
writeFileSync(join(HERE, name), page.replace("<title>", `<link rel="icon" href="data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 32 32'%3E%3Ccircle cx='16' cy='16' r='11' fill='none' stroke='%232c4e25' stroke-width='4'/%3E%3C/svg%3E"><title>`));
console.log(`wrote ${name} · ${(page.length / 1024).toFixed(0)} KB · ${counts.parts} parts · ${counts.assemblies} assemblies · build ${S.seconds.toFixed(1)} s`);
