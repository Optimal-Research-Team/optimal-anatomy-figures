// Equipment reveals (figures/e*-*/build.mjs) are built in reveals/<slug>/ with the anatomy-reveal skill: the
// interactive page needs headless Chrome and the films take hours to render, so the built page is committed there
// and this step only copies it next to the figure, like every other figure's build.mjs.
// Rebuild a reveal: see reveals/<slug>/REPORT.md ("Rebuild") and reveals/SERIES-SPEC.md.
//
// The light build also writes embed/<slug>-apart.html: the same page for beoptimal.ca, shown in a sandboxed iframe
// (the site's EquipmentReveal component). It drops the page's own title block (the site section has its heading),
// sits flush in the frame, and posts its height to the parent so the frame always fits:
//   parent.postMessage({ type: "optimal-reveal", slug, height }, "*")   (a number only; nothing else leaves the frame)
import { copyFileSync, mkdirSync, readFileSync, writeFileSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";

// color-scheme: the page sets dark on <html>; a framed document whose scheme differs from the host gets an opaque
// backdrop, so the embed declares light (the site is Cream) and stays transparent.
const EMBED_CSS = `<style data-embed>:root{color-scheme:light!important}.ar-head{display:none!important}html,body{background:transparent!important}.iso-page{width:100%!important;margin:0!important}.iso-figure{margin:0!important}</style><meta name="robots" content="noindex">`;
const embedScript = (slug) =>
  `<script data-embed>(()=>{const slug=${JSON.stringify(slug)};let last=0;const post=()=>{const h=Math.ceil(document.documentElement.getBoundingClientRect().height);if(h&&h!==last){last=h;parent.postMessage({type:"optimal-reveal",slug,height:h},"*")}};new ResizeObserver(post).observe(document.documentElement);addEventListener("load",post);post()})();</script>`;

export function copyReveal(metaUrl, slug) {
  const here = dirname(fileURLToPath(metaUrl));
  const light = process.argv.includes("--light");
  const src = join(here, "..", "..", "reveals", slug, "object", light ? "figure-light.html" : "figure.html");
  copyFileSync(src, join(here, `${slug}-apart${light ? "-light" : ""}.html`));
  if (!light) return;
  const page = readFileSync(src, "utf8");
  if (!page.includes("</head>") || !page.includes("</body>")) throw new Error(`${slug}: the take-apart page has no </head> or </body>`);
  mkdirSync(join(here, "embed"), { recursive: true });
  writeFileSync(join(here, "embed", `${slug}-apart.html`), page.replace("</head>", `${EMBED_CSS}</head>`).replace("</body>", `${embedScript(slug)}</body>`));
}
