import { readFileSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";
const DIR = join(dirname(fileURLToPath(import.meta.url)), "..", "assets", "fonts");
const face = (family, file, weight, style = "normal") =>
  `@font-face{font-family:"${family}";src:url(data:font/woff2;base64,${readFileSync(join(DIR, file)).toString("base64")}) format("woff2");font-weight:${weight};font-style:${style};font-display:block}`;
// Optimal's type: Castoro (display serif) and Public Sans (UI), embedded so the pages and the film need no network.
export function fontCss() {
  return [
    face("Castoro", "castoro-latin-400-normal.woff2", 400),
    face("Castoro", "castoro-latin-400-italic.woff2", 400, "italic"),
    face("Public Sans", "public-sans-latin-400-normal.woff2", 400),
    face("Public Sans", "public-sans-latin-500-normal.woff2", 500),
    face("Public Sans", "public-sans-latin-600-normal.woff2", 600),
  ].join("\n");
}
