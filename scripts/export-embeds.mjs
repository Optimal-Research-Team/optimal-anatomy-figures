// Copy every figure's embed script into a folder the website serves, with a manifest.
//
//   node scripts/build-all.mjs                                   # build first (writes figures/*/embed/)
//   node scripts/export-embeds.mjs --out ../beoptimal-landing/public/figures
//
// Writes <out>/optimal-fig-<slug>.js for each of the 15 figures and <out>/manifest.json
// ({ slug: { file, bytes, gzipBytes, sha256, title, fig } }), and prints a table. It never deletes
// anything in <out> except the files it writes.
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
  for (const file of readdirSync(embed).filter((f) => /^optimal-fig-.+\.js$/.test(f))) {
    const src = join(embed, file);
    const body = readFileSync(src);
    copyFileSync(src, join(out, file));
    const slug = file.replace(/^optimal-fig-|\.js$/g, "");
    manifest[slug] = { file, fig: meta.n, title: meta.title, bytes: body.length, gzipBytes: gzipSync(body, { level: 9 }).length, sha256: createHash("sha256").update(body).digest("hex").slice(0, 16), folder: dir };
  }
}
writeFileSync(join(out, "manifest.json"), JSON.stringify({ exported: new Date().toISOString(), figures: manifest }, null, 2));
const kb = (n) => `${(n / 1024).toFixed(0)} KB`;
for (const [slug, m] of Object.entries(manifest)) console.log(`${String(m.fig).padEnd(3)} ${slug.padEnd(22)} ${kb(m.bytes).padStart(7)}  ${kb(m.gzipBytes).padStart(6)} gz  ${m.sha256}`);
console.log(`\n${Object.keys(manifest).length} figures → ${out}`);
