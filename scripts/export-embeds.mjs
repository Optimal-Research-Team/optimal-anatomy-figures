// Copy every figure's embed script into a folder the website serves, with a manifest.
//
//   node scripts/build-all.mjs                                   # build first (writes figures/*/embed/)
//   node scripts/export-embeds.mjs --out ../beoptimal-landing/public/figures
//
// Writes <out>/optimal-fig-<slug>.js for each of the 15 figures and <out>/manifest.json
// ({ slug: { file, bytes, gzipBytes, sha256, title, fig, chunks? } }), and prints a table. It never deletes
// anything in <out> except the files it writes.
//
// Chunks: other .js files in a figure's embed/ folder are files that embed loads lazily from its own URL
// (since Oct 21: A2's 3-D layer, hypothalamus-3d.js). They're copied next to the embeds and listed under
// that figure's `chunks` in the manifest. Serve them from the same folder as the embed scripts.
import { createHash } from "node:crypto";
import { copyFileSync, existsSync, mkdirSync, readFileSync, readdirSync, writeFileSync } from "node:fs";
import { join, resolve } from "node:path";
import { fileURLToPath } from "node:url";
import { gzipSync } from "node:zlib";

const root = fileURLToPath(new URL("..", import.meta.url));
const at = process.argv.indexOf("--out");
if (at < 0 || !process.argv[at + 1]) {
  console.error("usage: node scripts/export-embeds.mjs --out <dir>");
  process.exit(1);
}
const out = resolve(process.argv[at + 1]);
mkdirSync(out, { recursive: true });

const manifest = {};
for (const dir of readdirSync(join(root, "figures")).sort()) {
  const embed = join(root, "figures", dir, "embed");
  if (!existsSync(embed)) continue;
  const meta = existsSync(join(root, "figures", dir, "figure.json")) ? JSON.parse(readFileSync(join(root, "figures", dir, "figure.json"), "utf8")) : {};
  const stat = (file) => {
    const body = readFileSync(join(embed, file));
    copyFileSync(join(embed, file), join(out, file));
    return { file, bytes: body.length, gzipBytes: gzipSync(body, { level: 9 }).length, sha256: createHash("sha256").update(body).digest("hex").slice(0, 16) };
  };
  const files = readdirSync(embed).sort();
  const chunks = files.filter((f) => /\.js$/.test(f) && !/^optimal-fig-.+\.js$/.test(f)).map(stat);
  for (const file of files.filter((f) => /^optimal-fig-.+\.js$/.test(f))) {
    const slug = file.replace(/^optimal-fig-|\.js$/g, "");
    const s = stat(file);
    manifest[slug] = { file, fig: meta.n, title: meta.title, bytes: s.bytes, gzipBytes: s.gzipBytes, sha256: s.sha256, folder: dir, ...(chunks.length ? { chunks } : {}) };
  }
}
writeFileSync(join(out, "manifest.json"), JSON.stringify({ exported: new Date().toISOString(), figures: manifest }, null, 2));
const kb = (n) => `${(n / 1024).toFixed(0)} KB`;
for (const [slug, m] of Object.entries(manifest)) {
  console.log(`${String(m.fig).padEnd(3)} ${slug.padEnd(22)} ${kb(m.bytes).padStart(7)}  ${kb(m.gzipBytes).padStart(6)} gz  ${m.sha256}`);
  for (const c of m.chunks || []) console.log(`    + ${c.file.padEnd(20)} ${kb(c.bytes).padStart(7)}  ${kb(c.gzipBytes).padStart(6)} gz  ${c.sha256}  (loaded lazily by ${m.file})`);
}
const nChunks = Object.values(manifest).reduce((n, m) => n + (m.chunks || []).length, 0);
console.log(`\n${Object.keys(manifest).length} figures${nChunks ? ` + ${nChunks} lazy chunk${nChunks > 1 ? "s" : ""}` : ""} → ${out}`);
