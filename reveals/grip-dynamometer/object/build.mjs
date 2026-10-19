import { readFileSync, writeFileSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";
import * as k from "../kit/iso-kit.mjs";
import { turnScript } from "../scripts/inline-kit.mjs";
import { scene, PAGE_HELPERS } from "./scene.mjs";
import { FILM, FIGURE, FEATURE_KEYS } from "./film.mjs";
import { fontFaceCss } from "../scripts/fonts.mjs";

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
${fontFaceCss()}
${readFileSync(join(HERE, "optimal.css"), "utf8")}
${readFileSync(join(HERE, "figure.css"), "utf8")}
.ar-stage{cursor:grab;outline:none;touch-action:none}
.ar-stage:active{cursor:grabbing}
.ar-stage:focus-visible{box-shadow:0 0 0 1px var(--anatomy-mid)}
.iso-face-text[data-tone="lit"]{fill:var(--anatomy-lit)}
.iso-face-text[data-tone="mid"]{fill:var(--anatomy-mid)}`;
const halo = `<ellipse cx="${W / 2}" cy="${H * 0.72}" rx="${W * 0.17}" ry="${H * 0.022}" class="iso-halo" style="filter:blur(8px)"/>`;
const aria = `${FIGURE.title}: drag to turn it, tap or hover to take it apart; arrow keys turn it, A takes it apart${keySpeech ? `, ${keySpeech}` : ""}`;
const stage = `<div class="iso-stage iso-turn ar-stage" tabindex="0" role="slider" aria-label="${aria}" aria-valuetext="assembled">${k.figureSvg({ width: W, height: H, label: fill(FIGURE.label), body: halo })}${S.out.layerSvg("live", { width: W, height: H })}</div>`;
const head = `<header class="opt-head"><p class="opt-eyebrow">${FILM.fig} · Equipment</p><h1 class="opt-title">Hand <em>dynamometer</em></h1><p class="opt-lead">${FIGURE.lead}</p></header>`;
const keyHelp = `<ul class="opt-keys" aria-label="Keyboard"><li><kbd>Drag</kbd>turn it</li><li><kbd>A</kbd>take it apart</li>${FEATURE_KEYS.map((f) => `<li><kbd>${f.key.toUpperCase()}</kbd>${f.verb}</li>`).join("")}</ul>`;
const note = `<p class="opt-note">${FIGURE.note}</p>`;
const hintHover = `Drag to turn · hover to take apart${keyList ? ` · ${keyList}` : ""}`;
const hintTouch = "Drag to turn · tap to take apart";
// Real buttons under the figure, on every device: take apart (toggles), squeeze (toggles), reset, handle position.
const controls = `<div class="opt-controls" role="group" aria-label="Controls"><button type="button" class="opt-btn" data-act="apart" aria-pressed="false">Take apart</button><button type="button" class="opt-btn" data-act="squeeze" aria-pressed="false">Squeeze</button><button type="button" class="opt-btn" data-act="reset">Reset peak</button><button type="button" class="opt-btn" data-act="handle" aria-label="Handle position, now 2 of 5">Handle position</button></div>`;
const plateRaw = k.plateHtml({
  fig: FILM.fig,
  title: FILM.title,
  hint: hintHover,
  readout: "",
  keys: FIGURE.keys,
  caption: fill(FIGURE.caption),
  body: `<style>${css}</style>${stage}`,
});
const hintAt = plateRaw.indexOf(`>${hintHover}</span>`);
if (hintAt < 0 || !plateRaw.includes("<figcaption")) throw new Error("plate markup changed: hint or figcaption not found");
const plate = plateRaw
  .replace(`>${hintHover}</span>`, `><span class="hint-hover">${hintHover}</span><span class="hint-touch">${hintTouch}</span></span>`)
  .replace("<figcaption", `${controls}<figcaption`);
const body = head + plate + keyHelp + note;
const film = readFileSync(join(HERE, "film.mjs"), "utf8").replace(/^export /gm, "");
const DATA = { turn: S.out.data, explode: S.obj.explode, basis: S.basis, parts: counts.parts };
const LIVE = readFileSync(join(HERE, "live.js"), "utf8")
  .replace("__DATA__", JSON.stringify(DATA))
  .replace("__HELPERS__;", PAGE_HELPERS)
  .replace("__FILM__;", film);
const page = k.pageHtml({ title: FIGURE.pageTitle ?? FIGURE.title, theme, body, script: turnScript() + LIVE, width: 720 });
const name = `figure${theme === "light" ? "-light" : ""}.html`;
writeFileSync(join(HERE, name), page);
console.log(`wrote ${name} · ${(page.length / 1024).toFixed(0)} KB · ${counts.parts} parts · ${counts.assemblies} assemblies · build ${S.seconds.toFixed(1)} s`);
