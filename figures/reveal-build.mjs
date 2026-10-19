// Equipment reveals (figures/e*-*/build.mjs) are built in reveals/<slug>/ with the anatomy-reveal skill: the
// interactive page needs headless Chrome and the films take hours to render, so the built page is committed there
// and this step only copies it next to the figure, like every other figure's build.mjs.
// Rebuild a reveal: see reveals/<slug>/REPORT.md ("Rebuild") and reveals/SERIES-SPEC.md.
import { copyFileSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";

export function copyReveal(metaUrl, slug) {
  const here = dirname(fileURLToPath(metaUrl));
  const light = process.argv.includes("--light");
  const src = join(here, "..", "..", "reveals", slug, "object", light ? "figure-light.html" : "figure.html");
  copyFileSync(src, join(here, `${slug}-apart${light ? "-light" : ""}.html`));
}
