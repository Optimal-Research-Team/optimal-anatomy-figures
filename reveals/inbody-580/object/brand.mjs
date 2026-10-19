// Optimal Health look for the figure page and the film: fonts, theme tokens, the current-path glow.
import { readFileSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";
const HERE = dirname(fileURLToPath(import.meta.url));
const FONTS = join(HERE, "..", "fonts");
const b64 = (f) => readFileSync(join(FONTS, f)).toString("base64");

export const PALETTE = { paper: "#FFFCF7", ink: "#2C4E25", leaf: "#A9D49C", grey1: "#C9CDBF", grey2: "#8E9884", night: "#1C3118" };

export function fontCss() {
  const face = (family, file, weight, style = "normal") =>
    `@font-face{font-family:'${family}';src:url(data:font/woff2;base64,${b64(file)}) format('woff2');font-weight:${weight};font-style:${style};font-display:block}`;
  return [
    face("Castoro", "castoro-latin-400-normal.woff2", 400),
    face("Castoro", "castoro-latin-400-italic.woff2", 400, "italic"),
    face("Public Sans", "public-sans-latin-400-normal.woff2", 400),
    face("Public Sans", "public-sans-latin-500-normal.woff2", 500),
    face("Public Sans", "public-sans-latin-600-normal.woff2", 600),
    face("Public Sans", "public-sans-latin-700-normal.woff2", 700),
  ].join("\n");
}

// page and line tokens, light = cream paper with forest ink, dark = forest night
export const THEME_CSS = `
.iso[data-theme="light"]{
  --anatomy-page:#FEF8F1;--anatomy-card:#FFFCF7;--anatomy-text:#3E3D39;--anatomy-strong:#2C4E25;--anatomy-muted:#8E9884;
  --anatomy-paper:#FFFCF7;--anatomy-face:#ffffff;--anatomy-top:#ffffff;
  --anatomy-shade-0:#dfe2d6;--anatomy-shade-1:#e8eae0;--anatomy-shade-2:#f0f1ea;--anatomy-shade-3:#f7f8f3;
  --anatomy-hi:#2C4E25;--anatomy-mid:#8E9884;--anatomy-lo:#C9CDBF;--anatomy-faint:#e3e6dc;--anatomy-lit:#1C3118;
  --anatomy-halo:#8E9884;--anatomy-halo-opacity:.3;--anatomy-dot:#2C4E25;
  --anatomy-mono:'Public Sans',ui-sans-serif,system-ui,sans-serif;
}
.iso[data-theme="dark"]{
  --anatomy-page:#1C3118;--anatomy-card:#203a1c;--anatomy-text:#C9CDBF;--anatomy-strong:#FFFCF7;--anatomy-muted:#8E9884;
  --anatomy-paper:#203a1c;--anatomy-face:#28452a;--anatomy-top:#28452a;
  --anatomy-shade-0:#16290f;--anatomy-shade-1:#1a2f16;--anatomy-shade-2:#1e351a;--anatomy-shade-3:#223b1e;
  --anatomy-hi:#E7EDE1;--anatomy-mid:#8E9884;--anatomy-lo:#4c6046;--anatomy-faint:#33472f;--anatomy-lit:#ffffff;
  --anatomy-halo:#0c1709;--anatomy-halo-opacity:.8;--anatomy-dot:#E7EDE1;
  --anatomy-mono:'Public Sans',ui-sans-serif,system-ui,sans-serif;
}
.iso-face-text{font-family:'Public Sans',sans-serif}
`;

const KEYS = ["paper", "face", "top", "shade-0", "shade-1", "shade-2", "shade-3", "lit-top", "lit-shade", "hi", "mid", "lo", "faint", "dot", "lit"];
// ramps copied from kit/turn.mjs (light / dark) so the glow can mix from them
const RAMPS = {
  electrode: {
    light: ["#c9cec0", "#d9ddd1", "#eef0e9", "#a2aa98", "#b4baa9", "#c5cabb", "#d6dacd", "#f6f7f2", "#cfd3c6", "#2c4e25", "#6e7966", "#99a18e", "#b8beac", "#33402f", "#000000"],
    dark: ["#3a4336", "#46503f", "#58634f", "#283024", "#2f382b", "#374033", "#414b3c", "#6b775f", "#4a5444", "#dfe5d9", "#7f8a75", "#56604e", "#3f4839", "#e4e9de", "#ffffff"],
  },
  polish: {
    light: ["#8e9884", "#c9cdbf", "#fbfcf7", "#a6ad9c", "#737c69", "#4a5343", "#cdd2c3", "#ffffff", "#bec4b4", "#1f2a1c", "#566050", "#868f7b", "#a9b09f", "#26301f", "#000000"],
    dark: ["#2d3529", "#4b5545", "#6f7a68", "#323b2e", "#262d23", "#1b2119", "#4b5545", "#8a957f", "#3b4536", "#dfe5d9", "#7c8774", "#4e5848", "#384034", "#e4e9de", "#ffffff"],
  },
  ink: {
    light: ["#253024", "#2c382a", "#3e4c3a", "#151c14", "#1b2419", "#222c20", "#2a3527", "#4d5d48", "#2f3b2d", "#0d130c", "#141b13", "#1a2219", "#20291e", "#8e9884", "#000000"],
    dark: ["#0f170e", "#131c12", "#1d2a1b", "#0a0f09", "#0d130c", "#10170f", "#141c13", "#25301f", "#121a11", "#8e9884", "#4a5644", "#2c3529", "#1f271c", "#a9b09f", "#ffffff"],
  },
};
// what the parts turn to when current flows: leaf, lit from within
const GLOW = {
  light: ["#c6e5b9", "#c0e2b2", "#b4dca5", "#86bd74", "#97c787", "#a6d197", "#b1d8a3", "#c8e8bc", "#acd59e", "#2c4e25", "#4f8442", "#7aae6a", "#a9d49c", "#2c4e25", "#000000"],
  dark: ["#5e8f50", "#6f9e62", "#86b877", "#4c7f43", "#5e8f50", "#6f9e62", "#86b877", "#c8e6bd", "#86b877", "#f4fbf0", "#c8e6bd", "#a9d49c", "#86b877", "#f4fbf0", "#ffffff"],
};

export function glowCss({ handCables = 5, bundle = 6 } = {}) {
  const rules = [];
  const inject = ':is([data-name$=".palm"],[data-name$=".fore"])';
  const sense = ':is([data-name$=".thumb"],[data-name$=".heel"])';
  rules.push(`.iso .iso-live ${inject}{--g:var(--g-inject,0)}`);
  rules.push(`.iso .iso-live ${sense}{--g:var(--g-sense,0)}`);
  const cables = [];
  for (let i = 0; i < handCables; i++) {
    const sel = `:is([data-name="hand.R.cable.${i}"],[data-name="hand.L.cable.${i}"])`;
    rules.push(`.iso .iso-live ${sel}{--g:clamp(0,calc((var(--flow,0) - ${(0.06 + i * 0.16).toFixed(2)}) * 6),1)}`);
    cables.push(sel);
  }
  for (let i = 0; i < bundle; i++) {
    const sel = `[data-name="bundle.${i}"]`;
    rules.push(`.iso .iso-live ${sel}{--g:clamp(0,calc((var(--flow,0) - ${((bundle - 1 - i) * 0.12).toFixed(2)}) * 6),1)}`);
    cables.push(sel);
  }
  const lit = `:is(${inject},${sense},${cables.join(",")})`;
  for (const theme of ["light", "dark"]) {
    for (const [mat, ramp] of Object.entries(RAMPS)) {
      const decl = KEYS.map((k, i) => `--anatomy-${k}:color-mix(in srgb,${GLOW[theme][i]} calc(var(--g,0) * 100%),${ramp[theme][i]})`).join(";");
      rules.push(`.iso[data-theme="${theme}"] .iso-live [data-mat="${mat}"]${lit}{${decl}}`);
    }
  }
  // drawn details: thumb dish, LED light guides
  rules.push(`.ar-thumb{fill:color-mix(in srgb,#eef8e8 calc(var(--g-sense,0) * 100%),#e4e7dc)}`);
  rules.push(`.iso[data-theme="dark"] .ar-thumb{fill:color-mix(in srgb,#86b877 calc(var(--g-sense,0) * 100%),#6f7a68)}`);
  rules.push(`.ar-led{fill:color-mix(in srgb,#a9d49c calc(var(--screen,0) * 100%),#3e4b3b)}`);
  return rules.join("\n");
}
