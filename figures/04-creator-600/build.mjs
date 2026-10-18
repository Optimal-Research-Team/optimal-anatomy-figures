// Fig 4 · The runner rig.
//
// The Creator 600 as a machine you can read: a commercial deck and belt, the
// upright display on its column with the depth camera under the screen, slim
// uprights to the handrails and a console. On the belt runs the mannequin
// (shared/mannequin.mjs), drawn by the page every frame from the gait model.
// Around it, three instruments: a plumb laser under the pelvis and a landing
// ruler on the near step rail (where the heel lands against the body), a bounce
// gauge on the far rail (the centre of mass, tracked by a laser carriage), and
// the display's own panels (live skeleton, knee load per step, knee-angle trace).
//
//   node build.mjs | --light | --audit
import { mkdirSync, readFileSync, writeFileSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";
import { figkit, k, G, A } from "../../shared/figkit.mjs";
import { plate, page, embed } from "../../shared/page.mjs";
import { MANNEQUIN } from "../../shared/mannequin.mjs";
import * as M from "./model.mjs";

const HERE = dirname(fileURLToPath(import.meta.url));
const ROOT = join(HERE, "../..");
const THEME = process.argv.includes("--light") ? "light" : "dark";
const SLUG = "creator-600";
const W = 600;
const AZIMUTH = 132;
const ELEVATION = 22;

// ---------------------------------------------------------------- layout (cm, z up; the runner faces +x, +y is the runner's left)
const BELT_Z = 24; //        belt surface
const RAIL_Z = 24.6; //      step rails, a little proud of the belt
const RUN_X = -12; //        the pelvis sits over this point on the belt
const BELT = { x: -98, x1: 66, half: 29 }; // 164 cm of visible deck between the rollers, 58 wide
const HOUSING = { x: -95, y: -51, w: 187, d: 102, r: 6 };
const DISPLAY = { x: 100, y: -37, w: 16, d: 74, r: 2.5, z0: 66, z1: 232 };
const SCREEN = { y0: -31, y1: 31, z0: 115, z1: 226 }; // the panel on the display's face (x = 100), facing the runner
const RAIL = { x0: -8, x1: 72, z: 118, h: 6, half: 47.5 }; // handrails at y = ±47.5, over the uprights beside the hood
const GAUGE = { x: -42, y: -42 }; //  bounce gauge post on the far step rail

const B = { ...MANNEQUIN.BODY };
B.pelvis = M.pelvisOf(B);
// the centre of mass's range over the slider, for the gauge's scale
const comRange = (() => {
  let lo = Infinity;
  let hi = -Infinity;
  for (const c of [M.cadenceOf(-10), M.TRUTH.cadence0, M.cadenceOf(10)])
    for (let i = 0; i < 64; i++) {
      const z = M.poseAt(i / 64, c, B).com;
      lo = Math.min(lo, z);
      hi = Math.max(hi, z);
    }
  return [lo + BELT_Z, hi + BELT_Z];
})();

const BOUNDS = [
  ...k.boxCorners({ x: -118, y: -51, w: 240, d: 102 }, 0, 0),
  [DISPLAY.x + DISPLAY.w, DISPLAY.y + DISPLAY.d, DISPLAY.z1],
  [DISPLAY.x, DISPLAY.y, DISPLAY.z1],
  [GAUGE.x - 4, GAUGE.y - 4, 152],
  [RUN_X - 50, 10, BELT_Z + B.H + 6],
];
const probe = k.fitProjection(BOUNDS, W, 2000, { pad: 8, azimuth: AZIMUTH, elevation: ELEVATION });
const flat = BOUNDS.map((p) => k.iso(p, probe));
const H = Math.ceil(Math.max(...flat.map((p) => p[1])) - Math.min(...flat.map((p) => p[1])) + 16);
const P = k.fitProjection(BOUNDS, W, H, { pad: 8, azimuth: AZIMUTH, elevation: ELEVATION });
const F = figkit(P);
const { R, at, S, Ln, Dots, path3, planeMatrix, put, box, cyl, turned, pin, prism } = F;
const KS = G.scaleOf(P);
const back = [];

// ---------------------------------------------------------------- floor shadow, feet, housing, rear caps and roller
back.push(`<path class="iso-halo" d="${k.haloOf({ x: -118, y: -51, w: 240, d: 102, r: 8 }, 0, 0.1, P)}"/>`);
for (const x of [-108, -10, 84]) for (const y of [-44, 44]) cyl("stand.foot", x, y, 3.2, 0, 7, { tone: "lo" }, { steps: 20 });
box("deck", HOUSING, 7, 15, { tone: "mid" }, {
  bevel: 0.6,
  inner: Ln(k.sideSeam(HOUSING, 12, P, 3), { tone: "faint" }),
});
for (const side of [-1, 1]) {
  const cap = { x: -118, y: side > 0 ? 29 : -51, w: 23, d: 22, r: 5 };
  const name = side > 0 ? "deck.capL" : "deck.capR";
  const bolts = side > 0 ? Dots([at([-112, 51, 13]), at([-104, 51, 13])], { size: 0.6 }) + Ln([[-112, 13], [-104, 13]].map(([x, z]) => G.circleOf(G.frameOf([x, 51.02, z], [0, 1, 0], [1, 0, 0], [0, 0, 1]), 0, 1.6, P)).join(""), { tone: "lo" }) : "";
  box(name, cap, 7, RAIL_Z - 7, { tone: "mid" }, { bevel: 0.6, extra: bolts });
}
turned("roller", G.frameOf([-104, -29, 15.5], [0, 1, 0], [1, 0, 0], [0, 0, 1]), [[0, 8.5], [58, 8.5]], { tone: "lo" }, { meta: { seated: true } });

// ---------------------------------------------------------------- belt (slats, landing marks and the plumb spot drawn by the page) and step rails
box("belt", { x: BELT.x, y: -BELT.half, w: BELT.x1 - BELT.x, d: BELT.half * 2, r: 0.5 }, 22, BELT_Z - 22, { tone: "lo" }, {
  steps: 2,
  extra: `<path class="cr-slats iso-line" data-tone="faint" data-part="slats" d=""/><g data-part="marks"></g>`,
});
const TREAD = [33.5, 37.5, 41.5, 45.5];
for (const side of [-1, 1]) {
  const plan = { x: HOUSING.x, y: side > 0 ? BELT.half : -51, w: BELT.x1 - HOUSING.x, d: 51 - BELT.half, r: 1 };
  const treads = TREAD.map((y) => k.lineOnTop([HOUSING.x, side * y], [BELT.x1, side * y], RAIL_Z, P)).join("");
  box(side > 0 ? "deck.railL" : "deck.railR", plan, 22, RAIL_Z - 22, { tone: "mid" }, { steps: 2, extra: Ln(treads, { tone: "lo" }) });
}
// the landing ruler: a strip inlaid along the near rail's inner edge, zero at the plumb point, 2 cm ticks
{
  const strip = { x: RUN_X - 14, y: BELT.half + 1, w: 62, d: 4.6, r: 0.4 };
  back.push(S(k.slabOf(strip, RAIL_Z, 0.3, P, 2), { tone: "hi", crease: "none", className: "cr-strip" }));
  const minor = [];
  const major = [];
  for (let d = -12; d <= 46; d += 2) {
    const x = RUN_X + d;
    (d % 10 === 0 ? major : minor).push(k.lineOnTop([x, strip.y], [x, strip.y + (d % 10 === 0 ? strip.d : 2.2)], RAIL_Z + 0.3, P));
  }
  back.push(Ln(minor.join(""), { tone: "lo" }), Ln(major.join(""), { tone: "mid" }));
  back.push(`<path class="cr-zero" d="${k.planOutline({ x: RUN_X - 0.8, y: strip.y, w: 1.6, d: strip.d, r: 0.2 }, RAIL_Z + 0.3, P, 1)}"/>`);
}

// ---------------------------------------------------------------- front: motor hood, display column and display, depth camera
const hood = box("hood", { x: BELT.x1, y: -43.5, w: 26, d: 87, r: 4 }, 22, 9, { tone: "mid" }, {
  bevel: 0.6,
  extra: Ln([-30, -18, -6, 6, 18, 30].map((y) => k.planOutline({ x: BELT.x1 + 8, y: y - 0.8, w: 12, d: 1.6, r: 0.8 }, 31, P, 2)).join(""), { tone: "lo" }),
});
{
  const plinth = { x: 92, y: -38, w: 30, d: 76, r: 3 };
  const slot = (x, z, half) => path3([[x, -half, z - 0.6], [x, half, z - 0.6], [x, half, z + 0.6], [x, -half, z + 0.6]], true);
  const grille = Ln([12, 18, 24, 30, 36, 42, 48, 54].map((z) => slot(92 - 0.02, z, 26)).join(""), { tone: "lo" });
  box("column", plinth, 0, DISPLAY.z0, { tone: "mid" }, { bevel: 0.6, extra: grille });
}
{
  const o = [DISPLAY.x - 0.04, SCREEN.y0, SCREEN.z1];
  const m = planeMatrix(o, [0, 1, 0], [0, 0, -1]);
  const sw = SCREEN.y1 - SCREEN.y0;
  const sh = SCREEN.z1 - SCREEN.z0;
  const panel = `<g data-part="screen" transform="${m}"><rect class="cr-screen" x="0" y="0" width="${sw}" height="${sh}" rx="1.2"/><g data-part="screen-body"></g><rect class="iso-line" data-tone="mid" fill="none" x="0" y="0" width="${sw}" height="${sh}" rx="1.2"/></g>`;
  const lower = Ln([72, 76, 80].map((z) => path3([[DISPLAY.x - 0.03, -24, z - 0.5], [DISPLAY.x - 0.03, 24, z - 0.5], [DISPLAY.x - 0.03, 24, z + 0.5], [DISPLAY.x - 0.03, -24, z + 0.5]], true)).join(""), { tone: "faint" });
  box("display", DISPLAY, DISPLAY.z0, DISPLAY.z1 - DISPLAY.z0, { tone: "mid" }, { bevel: 0.8, extra: lower + panel });
  // the depth camera: a module under the screen, two apertures and a pilot dot, looking at the runner
  const lens = (y, z, r) => Ln(G.circleOf(G.frameOf([96.97, y, z], [-1, 0, 0], [0, 1, 0], [0, 0, 1]), 0, r, P), { tone: "mid" });
  box("camera", { x: 97, y: -8.5, w: 3, d: 17, r: 1.2 }, 101, 13, { tone: "hi", crease: "lo" }, {
    steps: 2,
    extra: [-4.2, 4.2].map((y) => `<path class="cr-lens" d="${G.circleOf(G.frameOf([96.97, y, 107.5], [-1, 0, 0], [0, 1, 0], [0, 0, 1]), 0, 2.6, P)}"/>${lens(y, 107.5, 2.6)}`).join("") + Dots([at([96.97, 0, 103.6])], { size: 0.8, tone: "lit" }),
  });
}

// ---------------------------------------------------------------- uprights, handrails and the side touch panel
const POST = { foot: 86, top: 64, z0: 22, z1: RAIL.z + 2 };
const deckShape = R.solids.find((x) => x.name === "deck");
for (const side of [-1, 1]) {
  const y = side * RAIL.half;
  const near = side > 0 ? "front." : "";
  const tag = side > 0 ? "L" : "R";
  const railPlan = { x: RAIL.x0, y: y - 3, w: RAIL.x1 - RAIL.x0, d: 6, r: 2.5 };
  const rail = box(`${near}rail${tag}`, railPlan, RAIL.z, RAIL.h, { tone: "mid" }, { bevel: 0.5, inner: Ln(k.sideSeam(railPlan, RAIL.z + 2.2, P, 3), { tone: "faint" }) });
  // a slanted upright from the deck beside the hood up into the rail: its square ends are let into both
  const a = G.unit3([POST.top - POST.foot, 0, POST.z1 - POST.z0]);
  const Fp = G.frameOf([POST.foot, y, POST.z0], a, [0, 1, 0], G.cross3(a, [0, 1, 0]));
  const length = Math.hypot(POST.top - POST.foot, POST.z1 - POST.z0);
  prism(`${near}upright${tag}`, Fp, [[-2.2, -3.2], [2.2, -3.2], [2.2, 3.2], [-2.2, 3.2]], 0, length, { tone: "mid" }, { meta: { seated: true, cut: [rail, deckShape] } });
  const cap = { x: RAIL.x0 - 7, y: y - 3.6, w: 9, d: 7.2, r: 3 };
  box(`${near}railcap${tag}`, cap, RAIL.z - 0.6, RAIL.h + 1.2, { tone: "hi", crease: "lo" }, {
    steps: 3,
    meta: { seated: true, cut: [rail] },
    extra: Dots([at([cap.x + 3, y - 1.4, RAIL.z + RAIL.h + 0.6]), at([cap.x + 3, y + 1.4, RAIL.z + RAIL.h + 0.6])], { size: 0.55, tone: "mid" }),
  });
}
// the side touch panel on a stalk off the far handrail, tilted toward the runner; the cadence counter lives on its screen
const CONSOLE = { x: RAIL.x1 - 8, y: -RAIL.half };
const stalk = cyl("console.stalk", CONSOLE.x, CONSOLE.y, 1.4, RAIL.z + RAIL.h, 14.7, { tone: "lo" }, { steps: 16 });
{
  const tilt = 22 * (Math.PI / 180);
  const n = [-Math.cos(tilt), 0, Math.sin(tilt)]; // face normal, toward the runner and up
  const up = [Math.sin(tilt), 0, Math.cos(tilt)];
  const c = [CONSOLE.x, CONSOLE.y, RAIL.z + RAIL.h + 9.5 + 7.6];
  const Ft = G.frameOf(G.add3(c, G.mul3(n, -1)), n, [0, 1, 0], up); // a: through the slab, u: across, v: up the face
  const corner = G.add3(G.add3(G.add3(c, G.mul3(n, 1.02)), [0, -12, 0]), G.mul3(up, 7.6));
  const m = planeMatrix(corner, [0, 1, 0], G.mul3(up, -1));
  const face = `<g transform="${m}"><rect class="cr-screen" x="0.8" y="0.8" width="22.4" height="13.6" rx="0.8"/><text class="cr-digits" data-part="cadence" x="12" y="10.4" font-size="8" text-anchor="middle">165</text><text class="cr-unit" x="12" y="13.4" font-size="2.2" text-anchor="middle">steps/min</text></g>`;
  prism("console", Ft, [[-12, -8.4], [12, -8.4], [12, 8.4], [-12, 8.4]], 0, 2, { tone: "mid" }, { extra: face, meta: { seated: true, cut: [stalk] } });
}

// ---------------------------------------------------------------- the bounce gauge on the far step rail
{
  const [lo, hi] = comRange;
  const z0 = Math.floor(lo) - 4;
  const z1 = Math.ceil(hi) + 4;
  cyl("gauge.base", GAUGE.x, GAUGE.y, 5, RAIL_Z, 1.6, { tone: "lo" }, { steps: 28 });
  box("gauge.post", { x: GAUGE.x - 2, y: GAUGE.y - 2, w: 4, d: 4, r: 0.8 }, RAIL_Z + 1.6, z1 + 6 - RAIL_Z - 1.6, { tone: "mid" }, { steps: 2 });
  // scale plate on the post's runner side: 1 cm ticks, 5 cm majors
  const plateY = GAUGE.y + 2;
  const plan = { x: GAUGE.x - 4.5, y: plateY, w: 9, d: 0.8, r: 0.2 };
  const ticks = [];
  const majors = [];
  for (let z = z0 + 1; z <= z1 - 1; z++) (z % 5 === 0 ? majors : ticks).push(path3([[GAUGE.x - 4, plateY + 0.82, z], [GAUGE.x - (z % 5 === 0 ? 0.6 : 2), plateY + 0.82, z]]));
  box("gauge.scale", plan, z0, z1 - z0, { tone: "hi", crease: "lo" }, { steps: 1, extra: Ln(ticks.join(""), { tone: "lo" }) + Ln(majors.join(""), { tone: "mid" }) });
  cyl("gauge.cap", GAUGE.x, GAUGE.y, 2.8, z1 + 6, 1.4, { tone: "hi" }, { steps: 20 });
  GAUGE.z0 = z0;
  GAUGE.z1 = z1;
  GAUGE.plateY = plateY + 0.82;
}

// ---------------------------------------------------------------- assemble: back items, page-drawn slots, the runner, then the near uprights and rail
const groups = F.assemble();
const isFront = (g) => /data-name="front\./.test(g);
const svg = k.figureSvg({
  width: W,
  height: H,
  label:
    "A Creator 600 treadmill with a wooden artist's mannequin running on the belt at 10 km/h. Each joint carries a tracking dot, and the tall display at the front draws the live skeleton the camera under it sees, with the knee load of each step and a knee-angle trace. A plumb laser under the pelvis marks the belt below the centre of mass, and a ruler on the step rail shows how far ahead of it each heel lands. A gauge behind the runner tracks how far the centre of mass rises and falls. The console shows the cadence.",
  body: [
    ...back,
    ...groups.filter((g) => !isFront(g)),
    `<g data-part="gauge"></g>`,
    `<g data-part="rider"></g>`,
    `<g data-part="runner"></g>`,
    ...groups.filter(isFront),
  ],
});

const DATA = {
  P,
  B,
  beltZ: BELT_Z,
  railZ: RAIL_Z,
  runX: RUN_X,
  belt: BELT,
  screen: { ...SCREEN, x: DISPLAY.x },
  gauge: GAUGE,
  ruler: { y: BELT.half + 1, d: 4.6 },
};
const strip = (src) => src.replace(/^import .*$/gm, "").replace(/^export /gm, "");
const MODEL_SRC = strip(readFileSync(join(HERE, "model.mjs"), "utf8"));
const MANNEQUIN_SRC = strip(readFileSync(join(ROOT, "shared/mannequin.mjs"), "utf8"));
const VIEW_SRC = readFileSync(join(ROOT, "shared/mannequin-view.js"), "utf8");
const latheSource = strip(readFileSync(join(ROOT, ".claude/skills/anatomy/kit/lathe.mjs"), "utf8"));
const LATHE = `const G = (() => {${latheSource}\nreturn { frameOf, frameAlong, prismOf, pointOf, solidOf, sphereOf, circleOf };})();\n`;
const LIVE = readFileSync(join(HERE, "live.js"), "utf8").replace("__DATA__", JSON.stringify(DATA));
const SCRIPT = `${LATHE}\n${MANNEQUIN_SRC}\n${MODEL_SRC}\n${VIEW_SRC}\n${LIVE}`;
const CSS = readFileSync(join(ROOT, "shared/mannequin.css"), "utf8") + readFileSync(join(HERE, "figure.css"), "utf8");

const pc = (v) => `${Math.round(v * 100)}%`;
const CAPTION = [
  `At a steady 10 km/h, step length is simply speed divided by cadence. Taking 10 % more steps per minute makes each step about 9 % shorter, so the heel lands closer under the body and the body bounces less. In a lab study of 30 healthy runners, modelling showed that a 10 % higher step rate lowered the peak force behind the kneecap by about 14 % per step, and a 10 % lower rate raised it by about 15 %.`,
  `The Creator 600 sees a run the way this drawing does: a depth camera under the screen tracks the joints and reports cadence, step length, bounce and vertical ratio. Its knee and hip load rating is the machine's own estimate from that tracking, not a force measurement.`,
  `<small>Group averages from healthy runners, not a prediction for you. More steps per kilometre partly offsets the lower load per step, and there isn't enough evidence yet that changing cadence prevents injury. At this pace most recreational runners take about 155–175 steps a minute; 180 isn't a target for everyone. Any change starts from your own numbers in the review after your run.</small>`,
]
  .map((p) => `<span class="cr-par">${p}</span>`)
  .join("");
const presets = [["-10", "−10%"], ["0", "Your usual"], ["5", "+5%"], ["10", "+10%"]];
const body = plate({
  fig: "Fig 4",
  title: "The runner rig",
  hint: "Drag or tap to change step rate",
  stats: [
    { key: "spm", label: "Step rate", value: `${M.TRUTH.cadence0}/min` },
    { key: "step", label: "Step", value: `${M.stepOf(M.TRUTH.cadence0).toFixed(2)} m` },
    { key: "ratio", label: "Vertical ratio", value: `${M.ratioOf(M.TRUTH.cadence0).toFixed(1)}%` },
    { key: "knee", label: "Kneecap force", value: pc(1) },
  ],
  controls: [{ name: "preset", label: "Step-rate change", options: presets.map(([value, label]) => ({ value, label, pressed: value === "0" })) }],
  keys: [
    { mark: "lit", label: "Tracking dots on the joints" },
    { mark: "heat", label: "Kneecap force, each landing" },
    { mark: "raised", label: "Plumb, landing ruler and bounce gauge" },
  ],
  caption: CAPTION,
  body: `<div class="iso-stage cr-stage" tabindex="0" role="slider" aria-label="Step rate at 10 km/h. Left and right arrows change it by 1 step per minute, Page Up and Down by 5." aria-valuemin="${Math.round(M.cadenceOf(-10))}" aria-valuemax="${Math.round(M.cadenceOf(10))}" aria-valuenow="${M.TRUTH.cadence0}" aria-valuetext="${M.TRUTH.cadence0} steps per minute">${svg}</div><div class="cr-scrub"><span class="cr-end" aria-hidden="true">${Math.round(M.cadenceOf(-10))}</span><input type="range" class="cr-range" min="${M.cadenceOf(-10).toFixed(1)}" max="${M.cadenceOf(10).toFixed(1)}" step="0.5" value="${M.TRUTH.cadence0}" aria-label="Step rate, steps per minute"><span class="cr-end" aria-hidden="true">${Math.round(M.cadenceOf(10))}</span><button type="button" class="cr-slow" data-slow aria-pressed="false">Slow</button></div><span class="cr-sr" role="status" aria-live="polite" data-status></span>`,
});
const out = THEME === "light" ? `${SLUG}-light.html` : `${SLUG}.html`;
writeFileSync(join(HERE, out), page({ title: "The runner rig", theme: THEME, body, css: CSS, script: SCRIPT }));
if (THEME === "light") {
  mkdirSync(join(HERE, "embed"), { recursive: true });
  writeFileSync(join(HERE, "embed", `optimal-fig-${SLUG}.js`), embed({ tag: `optimal-fig-${SLUG}`, body, script: SCRIPT, css: CSS }));
}
console.log("wrote", out, `${R.items.length} items`, `${R.solids.length} solids`, `scale ${KS.toFixed(3)}`, `H ${H}`, `com ${comRange.map((v) => v.toFixed(1)).join("–")}`);
A.auditOrExit(R, P, {});
void pin;
