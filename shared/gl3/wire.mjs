// Build-side wiring of the shared 3-D layer (shared/gl3). A figure's build.mjs does four things with it:
//
//   import { gl3Wire } from "../../shared/gl3/wire.mjs";
//   const GL3W = gl3Wire();
//   const DATA = { gl3: { ...F.gl3Scene({ ground: 0, materials: [...] }), ...GL3W.chunk }, P, W, H, ... };
//   const SCRIPT = `${GL3W.host}\n...the figure's own modules...`;      // host.js first
//   const CSS = `...the figure's css...${GL3W.css}`;                    // gl3.css last
//   ...and after the embed is written:  GL3W.copyTo(join(HERE, "embed"));
//
// The chunk travels beside the embed script (the TV's sync and scripts/export-embeds.mjs copy every .js in embed/).
import { copyFileSync, mkdirSync, readFileSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";

const HERE = dirname(fileURLToPath(import.meta.url));

export function gl3Wire() {
  const info = JSON.parse(readFileSync(join(HERE, "chunk.json"), "utf8"));
  return {
    /** Spread into DATA.gl3: the chunk's file name and a cache-busting tag. */
    chunk: { file: info.file, v: info.sha256.slice(0, 8) },
    /** host.js: inline it before the figure's own code (it defines gl3Attach). */
    host: readFileSync(join(HERE, "host.js"), "utf8"),
    /** gl3.css: append to the figure's CSS. */
    css: readFileSync(join(HERE, "gl3.css"), "utf8"),
    /** Copy the chunk next to the embed script. */
    copyTo(dir) {
      mkdirSync(dir, { recursive: true });
      copyFileSync(join(HERE, info.file), join(dir, info.file));
    },
  };
}
