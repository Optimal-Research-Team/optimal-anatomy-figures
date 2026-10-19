// Castoro + Public Sans, embedded as base64 @font-face so every page and film frame is self-contained.
import { readFileSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";
const DIR = join(dirname(fileURLToPath(import.meta.url)), "..", "assets", "fonts");
const FACES = [
  ["Castoro", "castoro-latin-400-normal.woff2", 400, "normal"],
  ["Castoro", "castoro-latin-400-italic.woff2", 400, "italic"],
  ["Public Sans", "public-sans-latin-400-normal.woff2", 400, "normal"],
  ["Public Sans", "public-sans-latin-500-normal.woff2", 500, "normal"],
  ["Public Sans", "public-sans-latin-600-normal.woff2", 600, "normal"],
  ["Public Sans", "public-sans-latin-700-normal.woff2", 700, "normal"],
];
export function fontFaceCss() {
  return FACES.map(
    ([family, file, weight, style]) =>
      `@font-face{font-family:"${family}";src:url(data:font/woff2;base64,${readFileSync(join(DIR, file)).toString("base64")}) format("woff2");font-weight:${weight};font-style:${style};font-display:block}`,
  ).join("\n");
}
