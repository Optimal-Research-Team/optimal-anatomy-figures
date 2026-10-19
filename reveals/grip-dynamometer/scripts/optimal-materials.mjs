// Optimal Health palette materials for the Anatomy kit (cream paper, forest ink, leaf accent).
// Ramp order: paper, face, top, shade-0..3, lit-top, lit-shade, hi, mid, lo, faint, dot, lit, then tube body, shine, shade, edge.
// Writes them into kit/turn.mjs (idempotent: replaces the block between the markers).
import { readFileSync, writeFileSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";
const KIT = join(dirname(fileURLToPath(import.meta.url)), "..", "kit", "turn.mjs");
const ramp = ([s0, s1, s2, s3, top, litTop, litShade, hi, mid, lo, faint, dot, lit]) => [s2, s3, top, s0, s1, s2, s3, litTop, litShade, hi, mid, lo, faint, dot, lit, s2, top, s0, hi];
const M = {
  alloy: {
    light: ["#8f9985", "#a5ae9b", "#bbc2b1", "#cdd2c4", "#dde0d5", "#e9ebe3", "#c9cebf", "#2C4E25", "#56684f", "#7f8a75", "#a3ab98", "#2C4E25", "#1c3118"],
    dark: ["#1d3119", "#233a1f", "#2a4326", "#324d2d", "#3b5735", "#4a6743", "#2e4829", "#e9e6dc", "#8E9884", "#56684f", "#3a5233", "#e9e6dc", "#fffcf7"],
  },
  satin: {
    light: ["#7f8a76", "#b0b8a6", "#d3d8ca", "#e9ece3", "#f7f8f3", "#ffffff", "#e1e5da", "#2C4E25", "#5c6b55", "#8E9884", "#b5bcab", "#2C4E25", "#1c3118"],
    dark: ["#24381f", "#304629", "#3e5537", "#4e6646", "#617a58", "#758d6b", "#45603e", "#f1efe7", "#a3ab98", "#66785e", "#46593f", "#f1efe7", "#ffffff"],
  },
  forest: {
    light: ["#1c3418", "#22401d", "#2a4b24", "#33582c", "#3f6637", "#4c7543", "#2f5229", "#0d1b0a", "#6f8a67", "#4b6a43", "#3a5933", "#c9cdbf", "#A9D49C"],
    dark: ["#0c170a", "#0f1c0c", "#12220f", "#162912", "#1b3016", "#233b1d", "#142510", "#C9CDBF", "#6d7a63", "#34452e", "#24361f", "#C9CDBF", "#A9D49C"],
  },
  ink: {
    light: ["#10200c", "#152a10", "#1b3315", "#223d1b", "#2C4E25", "#36592e", "#1f3a19", "#0a1507", "#4b6a43", "#2f4a29", "#24391f", "#c9cdbf", "#A9D49C"],
    dark: ["#b9bdaf", "#c9cdbf", "#d8dbcf", "#e6e8de", "#f3f4ee", "#ffffff", "#d4d7cb", "#0b1608", "#6d7a63", "#8E9884", "#a8ae9d", "#0b1608", "#A9D49C"],
  },
  leaf: {
    light: ["#7fae72", "#92c084", "#A9D49C", "#bddfb2", "#d0e9c7", "#e0f1d9", "#b4d9a8", "#2C4E25", "#4f7d44", "#7fae72", "#9fcb92", "#2C4E25", "#1c3118"],
    dark: ["#5d8c51", "#74a466", "#8cbd7f", "#A9D49C", "#c2e3b8", "#d6eccf", "#9cc98f", "#0b1608", "#2f5229", "#4b7a40", "#6e9e62", "#0b1608", "#ffffff"],
  },
  dial: {
    light: ["#e4e0d4", "#ece9df", "#f4f2ea", "#faf8f2", "#FFFCF7", "#ffffff", "#f3f1e9", "#2C4E25", "#6f7d66", "#a3ab98", "#d6d9cc", "#2C4E25", "#1c3118"],
    dark: ["#152511", "#182a14", "#1c3118", "#21371c", "#253821", "#2d4228", "#1f341b", "#FFFCF7", "#A9B39E", "#6d7a63", "#34492F", "#FFFCF7", "#A9D49C"],
  },
  pane: {
    light: ["#c9d3c2", "#d7dfd1", "#e4eadf", "#eff3eb", "#f8faf6", "#ffffff", "#e9eee5", "#2C4E25", "#6f8a67", "#9fae96", "#c9d3c2", "#2C4E25", "#1c3118"],
    dark: ["#1f3a26", "#26452e", "#2d5036", "#355b3e", "#3e6647", "#4a7353", "#30543a", "#C9CDBF", "#6d8a70", "#3e5a44", "#2c4532", "#C9CDBF", "#ffffff"],
  },
  strap: {
    light: ["#5d6a55", "#6f7c66", "#808c76", "#929d87", "#a5af9a", "#b8c0ad", "#889380", "#1c3118", "#3e4f38", "#56664e", "#6c7a64", "#1c3118", "#A9D49C"],
    dark: ["#2b3a27", "#334530", "#3c5038", "#465b41", "#51674b", "#5f7558", "#40553b", "#d9dccf", "#8E9884", "#56664e", "#3d4f38", "#d9dccf", "#A9D49C"],
  },
};
const body = Object.entries(M)
  .map(([name, { light, dark }]) => `  ${name}: {\n    light: ${JSON.stringify(ramp(light))},\n    dark: ${JSON.stringify(ramp(dark))},\n  },`)
  .join("\n");
const block = `  // optimal:start\n${body}\n  // optimal:end\n`;
let src = readFileSync(KIT, "utf8");
if (src.includes("// optimal:start")) src = src.replace(/  \/\/ optimal:start[\s\S]*?\/\/ optimal:end\n/, block);
else src = src.replace(/(const T3_MATERIALS = \{\n)/, `$1${block}`);
writeFileSync(KIT, src);
console.log(`wrote ${Object.keys(M).length} Optimal materials into kit/turn.mjs`);
