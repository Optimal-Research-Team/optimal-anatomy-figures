// The 3-D chunk is built by hand (gl/build-gl.sh, which needs npm) and committed, so the Pages build
// never fetches anything. This stamp ties the committed chunk to the sources it was built from:
// build-gl.sh writes it into gl/chunk.json, and build.mjs refuses to ship a chunk whose sources changed.
import { createHash } from "node:crypto";
import { readFileSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";

const HERE = dirname(fileURLToPath(import.meta.url));
/** Every file esbuild bundles from this repo (three.js is pinned by version in chunk.json). */
export const SOURCES = ["a2-layer.js", "hypo3d-scene.js", "hypo3d-geo.js", "hypo3d-anatomy.js", "hypo3d-model.js", "../model.mjs"];

export function sourcesHash() {
  const h = createHash("sha256");
  for (const f of SOURCES) h.update(`${f}\n`).update(readFileSync(join(HERE, f), "utf8").replace(/\r\n/g, "\n"));
  return h.digest("hex").slice(0, 16);
}

if (process.argv[1] === fileURLToPath(import.meta.url)) console.log(sourcesHash());
