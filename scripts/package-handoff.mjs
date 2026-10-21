// Assemble the engineering handoff package (the zip on a `handoff-*` GitHub release), the same layout as
// the Oct 21 package:
//
//   <tag>/README.md                 handoff/README.md
//   <tag>/ENGINEERING_HANDOFF.md, DEV_TODO.md
//   <tag>/placements.json           handoff/placements.json
//   <tag>/export-embeds.mjs         scripts/export-embeds.mjs
//   <tag>/qa/check-embeds.mjs       handoff/qa/check-embeds.mjs
//   <tag>/site/                     handoff/site/ (drop-in component, loader, reserves)
//   <tag>/embeds/                   the 15 embed scripts, their lazy chunks (A2: hypothalamus-3d.js), manifest.json
//   <tag>/equipment/<e*>/           web films, posters and take-apart pages for E1–E4
//
//   node scripts/package-handoff.mjs --tag handoff-2026-10-21b      # builds everything first
//   → handoff/package/<tag>/ and handoff/package/optimal-figures-<tag>.zip (git-ignored)
//
// The site integration patch is code from the private site repo, so it never goes in this package; it lives in
// the private repo Optimal-Research-Team/optimal-anatomy-figures-site-patch.
import { execFileSync } from "node:child_process";
import { copyFileSync, cpSync, existsSync, mkdirSync, readdirSync, rmSync } from "node:fs";
import { join } from "node:path";
import { fileURLToPath } from "node:url";

const root = fileURLToPath(new URL("..", import.meta.url));
const at = process.argv.indexOf("--tag");
const tag = at > 0 ? process.argv[at + 1] : null;
if (!tag || !/^handoff-[\w.-]+$/.test(tag)) {
  console.error("usage: node scripts/package-handoff.mjs --tag handoff-YYYY-MM-DD[x]");
  process.exit(1);
}
const name = `optimal-figures-${tag}`;
const base = join(root, "handoff", "package");
const out = join(base, name);
rmSync(out, { recursive: true, force: true });
rmSync(join(base, `${name}.zip`), { force: true });
mkdirSync(join(out, "qa"), { recursive: true });

const run = (args) => execFileSync("node", args, { cwd: root, stdio: ["ignore", "ignore", "inherit"] });
run(["scripts/build-all.mjs"]);
run(["scripts/export-embeds.mjs", "--out", join(out, "embeds")]);

copyFileSync(join(root, "handoff", "README.md"), join(out, "README.md"));
for (const f of ["ENGINEERING_HANDOFF.md", "DEV_TODO.md"]) copyFileSync(join(root, f), join(out, f));
copyFileSync(join(root, "handoff", "placements.json"), join(out, "placements.json"));
copyFileSync(join(root, "scripts", "export-embeds.mjs"), join(out, "export-embeds.mjs"));
copyFileSync(join(root, "handoff", "qa", "check-embeds.mjs"), join(out, "qa", "check-embeds.mjs"));
cpSync(join(root, "handoff", "site"), join(out, "site"), { recursive: true });

// equipment: the web encodes and posters (not the 1080p masters) and the built take-apart pages
for (const dir of readdirSync(join(root, "figures")).filter((d) => /^e\d/.test(d)).sort()) {
  const to = join(out, "equipment", dir);
  mkdirSync(to, { recursive: true });
  const assets = join(root, "figures", dir, "assets");
  for (const f of existsSync(assets) ? readdirSync(assets) : []) if (/-web-.*\.mp4$|\.jpg$/.test(f)) copyFileSync(join(assets, f), join(to, f));
  for (const f of readdirSync(join(root, "dist", dir))) if (f.endsWith(".html")) copyFileSync(join(root, "dist", dir, f), join(to, f));
}

execFileSync("zip", ["-qr", `${name}.zip`, name, "-x", "*.DS_Store"], { cwd: base });
console.log(`${out}\n${join(base, `${name}.zip`)}`);
