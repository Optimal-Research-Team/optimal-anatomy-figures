// Page, card and embed builders shared by every Optimal figure.
//
// The kit's `pageHtml` puts `class="iso"` on <body> and loads no web fonts, and
// its `plateHtml` writes the readout as one escaped string with the hint and
// readout absolutely placed in the bottom corners, which collide at 320 px.
// These builders keep the kit's markup and classes (so `capture.mjs`,
// `drive.mjs` and `lines.mjs` find `.iso-plate`, `.iso-stage` and
// `[data-readout]` as usual) and add:
//   - `class="iso optimal"` and the Castoro / Public Sans fonts,
//   - a structured readout (label + tabular value per stat) the live code fills,
//   - a row of real buttons (≥44 px) under the drawing, so nothing needs hover,
//   - a footer that wraps the hint and readout on phones instead of stacking them,
//   - an embeddable custom element (`<optimal-fig-<slug>>`) in a shadow root.
import { readFileSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";
import { ISO_CSS } from "../.claude/skills/anatomy/kit/iso-kit.mjs";
import { kitScript } from "../.claude/skills/anatomy/scripts/inline-kit.mjs";

const HERE = dirname(fileURLToPath(import.meta.url));
export const THEME_CSS = readFileSync(join(HERE, "optimal-theme.css"), "utf8");

export const FONTS_HREF = "https://fonts.googleapis.com/css2?family=Castoro:ital@0;1&family=Public+Sans:wght@400;500;600;700&display=swap";
// an inline icon (the gallery's forest ring), so a page served on its own doesn't log a /favicon.ico 404
const ICON_LINK = `<link rel="icon" href="data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 32 32'%3E%3Ccircle cx='16' cy='16' r='11' fill='none' stroke='%232c4e25' stroke-width='4'/%3E%3C/svg%3E">`;
const FONT_LINKS = `<link rel="preconnect" href="https://fonts.googleapis.com"><link rel="preconnect" href="https://fonts.gstatic.com" crossorigin><link rel="stylesheet" href="${FONTS_HREF}">`;

export const escape = (text) => String(text ?? "").replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/"/g, "&quot;");

// Typography only (the words don't change): keep a number on the same line as its unit, and both ends of a
// range together, so a phone never shows "13–22" at a line end with "% below" under it, or "(200" then "µA".
const UNIT = String.raw`(?:°C|°|kHz|Hz|[μµ]A|Ω|mg|[μµ]g/L|g/L|mL/kg/min|mL|kg|cm|mm|[μµ]m|nm|km/h|m|%|ms|s|min|h|bpm|spm|W|mmHg)`;
const NUMBER_UNIT = new RegExp(String.raw`(\d) (${UNIT})(?![\w/])`, "g");
export const tidy = (html) => String(html ?? "").replace(NUMBER_UNIT, "$1\u00a0$2").replace(/(\d)–(?=\d)/g, "$1–\u2060");

const swatch = (mark) => {
  if (mark === "raised" || mark === "flat" || mark === "lit") {
    const body = mark === "flat" ? "M2 6.5 8 3.5 14 6.5 8 9.5Z" : "M2 4.5 8 1.5 14 4.5 14 6 8 9 2 6Z";
    const crease = mark === "flat" ? "" : `<path class="iso-swatch-crease" d="M2 4.5 8 7.5 14 4.5"/>`;
    return `<svg class="iso-swatch" data-mark="${mark}" viewBox="0 0 16 10" aria-hidden="true"><path d="${body}"/>${crease}</svg>`;
  }
  if (mark === "heat") return `<svg class="iso-swatch" data-mark="heat" viewBox="0 0 16 10" aria-hidden="true"><path d="M1.5 5h13"/></svg>`;
  return `<svg class="iso-swatch" data-mark="${mark}" viewBox="0 0 16 10" aria-hidden="true"><path d="M1.5 5h13"/></svg>`;
};

/**
 * The card. `stats` is a list of { key, label, value } shown as the live readout;
 * `controls` is a list of groups { name, label, options: [{ value, label, pressed }] }.
 */
export function plate({ fig, title, hint, stats = [], controls = [], keys = [], caption, body, className = "" }) {
  const corner = (name, text) => `<span class="iso-plate-corner" data-corner="${name}">${escape(text)}</span>`;
  const readout = `<dl class="opt-readout" data-readout aria-hidden="true">${stats
    .map((s) => `<div class="opt-stat" data-stat="${s.key}"><dt>${escape(s.label)}</dt><dd data-r="${s.key}">${escape(s.value)}</dd></div>`)
    .join("")}</dl>`;
  const groups = controls
    .map(
      (group) =>
        `<div class="opt-seg" role="radiogroup" aria-label="${escape(group.label)}" data-control="${group.name}">${group.options
          .map(
            (o) =>
              `<button type="button" role="radio" class="opt-seg-btn" data-value="${escape(o.value)}" aria-checked="${o.pressed ? "true" : "false"}" tabindex="${o.pressed ? 0 : -1}">${escape(o.label)}</button>`,
          )
          .join("")}</div>`,
    )
    .join("");
  const legend =
    keys.length || caption
      ? `<figcaption class="iso-legend">${keys.length ? `<span class="iso-keys">${keys.map((key) => `<span class="iso-key">${swatch(key.mark)}${tidy(escape(key.label))}</span>`).join("")}</span>` : ""}${caption ? `<span class="iso-caption">${tidy(caption)}</span>` : ""}</figcaption>`
      : "";
  return `<figure class="iso-figure opt-figure ${className}"><div class="iso-plate opt-plate"><div class="iso-plate-corners" aria-hidden="true">${corner("fig", fig)}${title ? corner("title", title) : ""}</div>${body}${groups ? `<div class="opt-controls">${groups}</div>` : ""}<div class="opt-foot"><span class="opt-hint">${escape(hint)}</span>${readout}</div></div>${legend}</figure>`;
}

const PAGE_CSS = `
*{box-sizing:border-box}
html{color-scheme:dark}
body[data-theme="light"]{color-scheme:light}
body{margin:0;background:var(--anatomy-page);color:var(--anatomy-text);font:15px/1.6 var(--opt-ui);-webkit-font-smoothing:antialiased}
.iso-page{width:min(760px,100% - 32px);margin:48px auto 80px}
@media (max-width:560px){.iso-page{width:calc(100% - 32px);margin:16px auto 48px}}
`;

/** A standalone page. `script` must define `mount(root)`; the page calls it on the figure. */
export function page({ title, theme = "dark", body, script = "", css = "" }) {
  const run = script ? `${kitScript()}\n${script}\nmount(document.querySelector(".opt-figure"));` : "";
  return `<!doctype html><html lang="en"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width, initial-scale=1"><title>${escape(title)}</title>${ICON_LINK}${FONT_LINKS}<style>${ISO_CSS}${THEME_CSS}${PAGE_CSS}${css}</style></head><body class="iso optimal" data-theme="${theme}"><main class="iso-page">${body}</main>${run ? `<script type="module">${run.replace(/<\/(script)/gi, "<\\/$1")}</script>` : ""}</body></html>`;
}

/**
 * An embeddable build: one script that defines <optimal-fig-<slug> theme="light|dark">.
 * The figure renders in a shadow root, so the host page's CSS (Tailwind preflight)
 * can't reach it. The host page loads the two Google fonts itself (see NOTES.md).
 */
export function embed({ tag, body, script, css = "" }) {
  const styles = JSON.stringify(ISO_CSS + THEME_CSS + EMBED_CSS + css);
  const markup = JSON.stringify(body);
  return `/* ${tag}: Optimal Health explainer figure. Built with Anatomy (MIT). Generated; do not edit. */
(() => {
if (customElements.get(${JSON.stringify(tag)})) return;
${kitScript()}
${script}
class Fig extends HTMLElement {
  connectedCallback() {
    if (this.shadowRoot) return;
    const root = this.attachShadow({ mode: "open" });
    const theme = this.getAttribute("theme") === "dark" ? "dark" : "light";
    root.innerHTML = "<style>" + ${styles} + "</style><div class=\\"iso optimal opt-host\\" data-theme=\\"" + theme + "\\">" + ${markup} + "</div>";
    mount(root.querySelector(".opt-figure"));
  }
}
customElements.define(${JSON.stringify(tag)}, Fig);
})();
`;
}

const EMBED_CSS = `
:host{display:block}
.opt-host{background:transparent;color:var(--anatomy-text);font:15px/1.6 var(--opt-ui);-webkit-font-smoothing:antialiased}
.opt-host *{box-sizing:border-box}
.opt-host .iso-figure{margin:0}
`;
