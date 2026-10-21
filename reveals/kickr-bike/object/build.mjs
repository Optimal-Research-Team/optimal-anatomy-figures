import { readFileSync, writeFileSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";
import * as k from "../kit/iso-kit.mjs";
import { turnScript } from "../scripts/inline-kit.mjs";
import { scene, PAGE_HELPERS } from "./scene.mjs";
import { FILM, FIGURE, FEATURE_KEYS } from "./film.mjs";

const HERE = dirname(fileURLToPath(import.meta.url));
const theme = process.argv.includes("--light") ? "light" : "dark";
const W = 640;
const H = 600;
const S = scene({ W, H, radius: FILM.radius, pad: 4 });
const counts = { parts: S.out.report.parts, assemblies: S.obj.explode.length, ...(S.obj.counts ?? {}) };
const fill = (text) => text.replace(/\{(\w+)\}/g, (_, key) => counts[key] ?? `{${key}}`);
const keyList = FEATURE_KEYS.map((f) => f.key.toUpperCase()).join(" · ");
const keySpeech = FEATURE_KEYS.map((f) => `${f.key.toUpperCase()} ${f.verb}`).join(", ");
// E1–E4 share one page chrome (series.css) and keep a number on the same line as its unit ("79 cm", "60 mm")
const SERIES_CSS = readFileSync(join(HERE, "series.css"), "utf8");
const tidy = (text) => text.replace(/(\d) (mm|cm|kg|kHz|Hz|km\/h|%|°)(?![\w/])/g, "$1\u00a0$2").replace(/(\d)–(?=\d)/g, "$1–\u2060");
const FONT_DIR = process.env.FONT_DIR ?? decodeURIComponent(new URL("../fonts/", import.meta.url).pathname); // Castoro + Public Sans (OFL), copied from the TV kit
const fontFace = (family, file, weight, style = "normal") =>
  `@font-face{font-family:"${family}";src:url(data:font/woff2;base64,${readFileSync(join(FONT_DIR, file)).toString("base64")}) format("woff2");font-weight:${weight};font-style:${style};font-display:swap}`;
const BRAND = [
  fontFace("Castoro", "castoro-latin-400-normal.woff2", 400),
  fontFace("Castoro", "castoro-latin-400-italic.woff2", 400, "italic"),
  fontFace("Public Sans", "public-sans-latin-400-normal.woff2", 400),
  fontFace("Public Sans", "public-sans-latin-500-normal.woff2", 500),
  fontFace("Public Sans", "public-sans-latin-600-normal.woff2", 600),
].join("") + `
.iso[data-theme="light"]{--anatomy-page:#fffcf7;--anatomy-card:#fffcf7;--anatomy-text:#2c4e25;--anatomy-strong:#1d3318;--anatomy-muted:#6f7a66;--anatomy-mid:#c9cdbf;--anatomy-halo:#8e9884;--anatomy-halo-opacity:.28}
.iso[data-theme="dark"],.iso:not([data-theme]){--anatomy-page:#152511;--anatomy-card:#1c3118;--anatomy-text:#c9cdbf;--anatomy-strong:#fffcf7;--anatomy-muted:#8e9884;--anatomy-mid:#33412f;--anatomy-halo:#000000;--anatomy-halo-opacity:.6}
body{font-family:"Public Sans",ui-sans-serif,system-ui,sans-serif;font-feature-settings:"tnum" 1}
.iso-page{--anatomy-mono:"Public Sans",ui-sans-serif,system-ui,sans-serif}
`;
const css = `${BRAND}
${S.out.css}
.ar-stage{cursor:grab;outline:none;touch-action:none}
@media (hover:none){.ar-stage{touch-action:pan-y}}
.h-touch{display:none}
@media (hover:none){.h-hover{display:none}.h-touch{display:inline}}
.ar-stage:active{cursor:grabbing}
.ar-stage:focus-visible{box-shadow:0 0 0 1px var(--anatomy-mid)}
.iso-face-text[data-tone="lit"]{fill:var(--anatomy-lit)}
.iso-face-text[data-tone="mid"]{fill:var(--anatomy-mid)}
${SERIES_CSS}`;
const halo = `<ellipse cx="${W / 2}" cy="${H * 0.72}" rx="${W * 0.17}" ry="${H * 0.022}" class="iso-halo" style="filter:blur(8px)"/>`;
const aria = `${FIGURE.title}: drag to turn it, hover to take it apart; arrow keys turn it, A takes it apart${keySpeech ? `, ${keySpeech}` : ""}`;
const stage = `<div class="iso-stage iso-turn ar-stage" tabindex="0" role="slider" aria-label="${aria}" aria-valuetext="assembled">${k.figureSvg({ width: W, height: H, label: fill(FIGURE.label), body: halo })}${S.out.layerSvg("live", { width: W, height: H })}</div>`;
// the series header (E1's pattern); the lead is the gallery's line for this machine
const header = `<header class="ar-head"><p class="ar-eyebrow">${FILM.fig}</p><h1>KICKR Bike, <em>taken apart</em></h1><p class="ar-sub">${counts.parts} parts: a belt-driven flywheel, an electronic brake, and a five-point fit. Grade is simulated; the frame never tilts.</p></header>`;
const body = header + k.plateHtml({
  fig: FILM.fig,
  title: "KICKR BIKE · VO2_SUB max testing",
  hint: `Drag to turn · hover to take apart${keyList ? ` · ${keyList}` : ""}`,
  readout: "",
  keys: FIGURE.keys,
  caption: tidy(fill(FIGURE.caption)),
  body: `<style>${css}</style>${stage}`,
});
const film = readFileSync(join(HERE, "film.mjs"), "utf8").replace(/^export /gm, "");
const DATA = { turn: S.out.data, explode: S.obj.explode, basis: S.basis, parts: counts.parts };
const LIVE = readFileSync(join(HERE, "live.js"), "utf8")
  .replace("__DATA__", JSON.stringify(DATA))
  .replace("__HELPERS__;", PAGE_HELPERS)
  .replace("__FILM__;", film);
const BUTTON_LABEL = { c: "Turn the cranks", o: "Lift the cover", s: "Raise the saddle", p: "Click the paddle" };
const controls = `<div class="ar-controls" role="group" aria-label="Controls"><button type="button" class="ar-btn" data-act="apart" aria-pressed="false">Take apart</button>${FEATURE_KEYS.map((f) => `<button type="button" class="ar-btn" data-act="${f.key}"${f.values ? ' aria-pressed="false"' : ""}>${BUTTON_LABEL[f.key] ?? f.verb}</button>`).join("")}</div>`;
const hoverHint = `Drag to turn · hover to take apart${keyList ? ` · ${keyList}` : ""}`;
const page = k
  .pageHtml({ title: "KICKR Bike, taken apart · Optimal Health", theme, body, script: turnScript() + LIVE, width: 760 })
  .replace("VO2_SUB", "VO<sub>2</sub>")
  .replace(`data-corner="hint">${hoverHint}</span>`, `data-corner="hint"><span class="h-hover">${hoverHint}</span><span class="h-touch">Drag to turn · tap to take apart</span></span>`)
  .replace(`</div><figcaption class="iso-legend">`, `</div>${controls}<figcaption class="iso-legend">`);
if (!page.includes('class="h-touch"') || !page.includes('class="ar-controls"')) throw new Error("figure page: hint or controls not placed");
const name = `figure${theme === "light" ? "-light" : ""}.html`;
// an inline icon, so the gallery doesn't log a /favicon.ico 404 on every page
writeFileSync(join(HERE, name), page.replace("<title>", `<link rel="icon" href="data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 32 32'%3E%3Ccircle cx='16' cy='16' r='11' fill='none' stroke='%232c4e25' stroke-width='4'/%3E%3C/svg%3E"><title>`));
console.log(`wrote ${name} · ${(page.length / 1024).toFixed(0)} KB · ${counts.parts} parts · ${counts.assemblies} assemblies · build ${S.seconds.toFixed(1)} s`);
