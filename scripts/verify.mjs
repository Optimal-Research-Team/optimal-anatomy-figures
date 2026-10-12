// Verify one figure the way HANDOFF-LOCAL §8 asks, in one command:
//   - builds Forest night and Cream,
//   - line ends on both themes (lines.mjs),
//   - phones at 390 / 360 / 320 in both themes: plate shot + "no sideways scroll" check,
//   - reduced motion at 390 in both themes,
//   - desktop (1280 wide) in both themes,
//   - console clean on every run.
// Shots land in figures/<dir>/shots/. Prints one summary table and exits 1 on any failure.
//
//   source .env.chrome && node scripts/verify.mjs a7-knee [--wait 4000] [--pre steps.json] [--only 320]
//
// --pre: a JSON list of drive.mjs actions run before every shot (click a scene button, wait…).
// --tag: added to shot names (desktop-<tag>-light.png), for a second state of the same figure.
import { execFileSync } from "node:child_process";
import { existsSync, mkdirSync, readFileSync, readdirSync, writeFileSync } from "node:fs";
import { join } from "node:path";
import { fileURLToPath } from "node:url";

const root = fileURLToPath(new URL("..", import.meta.url));
const argv = process.argv.slice(2);
const take = (flag, fallback) => {
  const at = argv.indexOf(flag);
  if (at < 0) return fallback;
  const value = argv[at + 1];
  argv.splice(at, 2);
  return value;
};
const wait = Number(take("--wait", 4000));
const pre = take("--pre", null);
const tag = take("--tag", "");
const only = take("--only", null);
const skipBuild = argv.includes("--no-build");
const dir = argv.find((a) => !a.startsWith("--"));
if (!dir) {
  console.log("usage: node scripts/verify.mjs <figure-dir> [--wait ms] [--pre steps.json] [--tag name] [--only 320|desktop|reduced|lines] [--no-build]");
  process.exit(1);
}
const cwd = join(root, "figures", dir);
const S = join(root, ".claude/skills/anatomy/scripts");
const shots = join(cwd, "shots");
mkdirSync(shots, { recursive: true });
const tmp = join(cwd, "shots", "tmp");
mkdirSync(tmp, { recursive: true });

if (!skipBuild) {
  execFileSync("node", ["build.mjs"], { cwd, stdio: "ignore" });
  execFileSync("node", ["build.mjs", "--light"], { cwd, stdio: "ignore" });
}
const pages = readdirSync(cwd).filter((f) => f.endsWith(".html"));
const page = { light: pages.find((f) => f.endsWith("-light.html")), dark: pages.find((f) => !f.endsWith("-light.html")) };
const preSteps = pre ? JSON.parse(readFileSync(pre, "utf8")) : [];
const t = tag ? `-${tag}` : "";

const rows = [];
let failed = false;
function drive(name, file, steps, flags) {
  const actions = join(tmp, `${name}.json`);
  writeFileSync(actions, JSON.stringify(steps));
  let out = "";
  try {
    out = execFileSync("node", [join(S, "drive.mjs"), join(cwd, file), "--actions", actions, ...flags], { cwd, encoding: "utf8", stdio: ["ignore", "pipe", "pipe"] });
  } catch (err) {
    out = `${err.stdout ?? ""}${err.stderr ?? ""}`;
    if (!/line ends:/.test(out)) out += "\n(drive failed)";
  }
  return out;
}
const want = (what) => !only || only === what;

for (const theme of ["light", "dark"]) {
  if (want("lines")) {
    const out = drive(`lines-${theme}`, page[theme], [["wait", 1500], ...preSteps, ["lines", `shots/tmp/lines-${theme}.png`]], ["--width", "1280", "--height", "1100"]);
    const m = out.match(/line ends: (\d+)/);
    const ok = m && m[1] === "0" && /console: clean/.test(out);
    failed ||= !ok;
    rows.push([`lines ${theme}`, m ? `line ends ${m[1]}` : "did not run", /console: clean/.test(out) ? "clean" : out.split("\n").filter((l) => /^(console|exception)/.test(l)).join(" | ")]);
  }
  for (const w of [390, 360, 320]) {
    if (!want(String(w))) continue;
    const shot = `shots/phone-${w}${t}-${theme}.png`;
    const out = drive(`p${w}-${theme}`, page[theme], [["wait", wait], ...preSteps, ["shot", shot, ".iso-plate", 2], ["eval", "document.documentElement.scrollWidth > innerWidth"]], ["--width", String(w), "--height", "900"]);
    const over = /eval: true/.test(out);
    const clean = /console: clean/.test(out);
    failed ||= over || !clean;
    rows.push([`${w} ${theme}`, over ? "SIDEWAYS SCROLL" : "fits", clean ? "clean" : out.split("\n").filter((l) => /^(console|exception)|failed/.test(l)).join(" | "), shot]);
  }
  if (want("reduced")) {
    const shot = `shots/reduced-390${t}-${theme}.png`;
    const out = drive(`r-${theme}`, page[theme], [["wait", 1500], ...preSteps, ["wait", 400], ["shot", shot, ".iso-plate", 2]], ["--width", "390", "--height", "900", "--reduced"]);
    const clean = /console: clean/.test(out);
    failed ||= !clean;
    rows.push([`reduced ${theme}`, "still", clean ? "clean" : "errors", shot]);
  }
  if (want("desktop")) {
    const shot = `shots/desktop${t}-${theme}.png`;
    const out = drive(`d-${theme}`, page[theme], [["wait", wait], ...preSteps, ["shot", shot, ".iso-plate", 2]], ["--width", "1280", "--height", "1100"]);
    const clean = /console: clean/.test(out);
    failed ||= !clean;
    rows.push([`desktop ${theme}`, "", clean ? "clean" : "errors", shot]);
  }
}
const pad = (s, n) => String(s ?? "").padEnd(n);
console.log(`\n${dir}`);
for (const r of rows) console.log(`  ${pad(r[0], 16)}${pad(r[1], 18)}${pad(r[2], 10)}${r[3] ?? ""}`);
console.log(failed ? "\nverify: FAILED" : "\nverify: passed");
process.exit(failed ? 1 : 0);
