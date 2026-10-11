// Fig 6 · The treadmill ramp.
//
// The Creator 600 (Fig 4's deck, display, uprights and side touch panel) running
// a VO₂max test: the belt speeds up a little every few seconds while the
// mannequin runs in a mask with a wireless breath analyser on it. The assessor
// stands behind the treadmill with a tablet that plots oxygen uptake against
// speed: a straight line until the ceiling.
//
//   node build.mjs | --light | --audit
import { mkdirSync, readFileSync, writeFileSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";
import { figkit, k, G, A } from "../../shared/figkit.mjs";
import { plate, page, embed } from "../../shared/page.mjs";
import { MANNEQUIN } from "../../shared/mannequin.mjs";
import { assessorSvg } from "../../shared/assessor.mjs";
import * as M from "./model.mjs";

const HERE = dirname(fileURLToPath(import.meta.url));
const ROOT = join(HERE, "../..");
const THEME = process.argv.includes("--light") ? "light" : "dark";
const SLUG = "vo2max-treadmill";
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
const ASSESSOR = { at: [-150, 22], heading: -8 }; // behind the treadmill, watching the runner over the tablet

const B = { ...MANNEQUIN.BODY };
B.pelvis = M.pelvisOf(B);
const BOUNDS = [
  ...k.boxCorners({ x: -118, y: -51, w: 240, d: 102 }, 0, 0),
  [DISPLAY.x + DISPLAY.w, DISPLAY.y + DISPLAY.d, DISPLAY.z1],
  [DISPLAY.x, DISPLAY.y, DISPLAY.z1],
  [RUN_X - 50, 10, BELT_Z + B.H + 6],
];
{
  const J = assessorSvg(k.fitProjection(BOUNDS, W, 600, { azimuth: AZIMUTH, elevation: ELEVATION }), { at: ASSESSOR.at, heading: ASSESSOR.heading }).J;
  for (const v of Object.values(J)) if (Array.isArray(v) && v.length === 3 && typeof v[0] === "number") for (const d of [[9, 0, 0], [-9, 0, 0], [0, 9, 0], [0, -9, 0], [0, 0, 10]]) BOUNDS.push(G.add3(v, d));
}
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
// the side touch panel on a stalk off the far handrail, tilted toward the runner; its screen shows the belt speed
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
  const face = `<g transform="${m}"><rect class="cr-screen" x="0.8" y="0.8" width="22.4" height="13.6" rx="0.8"/><text class="cr-digits" data-part="speed" x="12" y="10.4" font-size="8" text-anchor="middle">9.3</text><text class="cr-unit" x="12" y="13.4" font-size="2.2" text-anchor="middle">km/h</text></g>`;
  prism("console", Ft, [[-12, -8.4], [12, -8.4], [12, 8.4], [-12, 8.4]], 0, 2, { tone: "mid" }, { extra: face, meta: { seated: true, cut: [stalk] } });
}

// ---------------------------------------------------------------- assemble: back items, page-drawn slots, the runner, then the near uprights and rail
const groups = F.assemble();
const isFront = (g) => /data-name="front\./.test(g);
const AS = assessorSvg(P, { at: ASSESSOR.at, heading: ASSESSOR.heading, part: "tablet" });
const svg = k.figureSvg({
  width: W,
  height: H,
  label:
    "A Creator 600 treadmill running a VO2max test: a wooden artist's mannequin runs on the belt in a face mask with a small wireless breath analyser on the front, while the belt speeds up a little every few seconds. Behind the treadmill an assessor stands holding a tablet that plots the oxygen the runner uses against speed: a straight line that flattens at the person's ceiling. The side touch panel shows the belt speed.",
  body: [...back, ...groups.filter((g) => !isFront(g)), `<g data-part="runner"></g>`, ...groups.filter(isFront), AS.svg],
});

const DATA = {
  P,
  B,
  beltZ: BELT_Z,
  runX: RUN_X,
  belt: BELT,
  screen: { ...SCREEN, x: DISPLAY.x },
  tablet: AS.screen,
};
const strip = (src) => src.replace(/^import .*$/gm, "").replace(/^export /gm, "");
const MODEL_SRC = strip(readFileSync(join(HERE, "model.mjs"), "utf8"));
const MANNEQUIN_SRC = strip(readFileSync(join(ROOT, "shared/mannequin.mjs"), "utf8"));
const VIEW_SRC = readFileSync(join(ROOT, "shared/mannequin-view.js"), "utf8") + readFileSync(join(ROOT, "shared/vo2-plot.js"), "utf8");
const latheSource = strip(readFileSync(join(ROOT, ".claude/skills/anatomy/kit/lathe.mjs"), "utf8"));
const LATHE = `const G = (() => {${latheSource}\nreturn { frameOf, frameAlong, prismOf, pointOf, solidOf, sphereOf, circleOf };})();\n`;
const LIVE = readFileSync(join(HERE, "live.js"), "utf8").replace("__DATA__", JSON.stringify(DATA));
const SCRIPT = `${LATHE}\n${MANNEQUIN_SRC}\n${MODEL_SRC}\n${VIEW_SRC}\n${LIVE}`;
const CSS = readFileSync(join(ROOT, "shared/mannequin.css"), "utf8") + readFileSync(join(ROOT, "shared/assessor.css"), "utf8") + readFileSync(join(ROOT, "figures/04-creator-600/figure.css"), "utf8") + readFileSync(join(HERE, "figure.css"), "utf8");

const T45 = M.runTestOf(45);
const CAPTION = [
  `On a treadmill ramp the belt speeds up a little every few seconds while you run. At a 1 % incline each extra 1 km/h costs about 3.5 ml of oxygen per kilogram each minute, the same for everyone, so oxygen use climbs in a straight line, a little behind the speed, until the heart and muscles can't deliver or use any more. That ceiling is VO₂max. A fitter body reaches a higher ceiling and a faster belt, but climbs the same slope.`,
  `The analyser on the mask measures every breath, how much air goes out and how much oxygen it has lost, and sends it wirelessly to the assessor's tablet. You run freely, with nothing tethering you to a cart.`,
  `Running usually gives a higher VO₂max than cycling, because more muscle is working: in a large registry, treadmill values averaged about 22 % above bike values. Compare a treadmill result with treadmill norms.`,
  `<small>A typical pattern for one modelled person (45 years, 75 kg), not a prediction. The oxygen cost of running is the standard equation for a typical runner; yours differs a little with running economy. Many people stop before a clear plateau; their top value is called VO₂peak. Heart rates are typical for age and vary by 10 bpm or more.</small>`,
]
  .map((p) => `<span class="vo-par">${p}</span>`)
  .join("");
const fmt = (min) => `${Math.floor(min)}:${String(Math.round((min % 1) * 60) % 60).padStart(2, "0")}`;
const body = plate({
  fig: "Fig 6",
  title: "The treadmill ramp",
  hint: "Pick a VO₂max ceiling · drag or play",
  stats: [
    { key: "v", label: "Speed", value: `${T45.s0.toFixed(1)} km/h` },
    { key: "hr", label: "Heart rate", value: "133 bpm" },
    { key: "vo2", label: "VO₂", value: "28.8 ml/kg/min" },
  ],
  controls: [{ name: "ceiling", label: "VO₂max ceiling, ml/kg/min", options: M.RUN.ceilings.map((c) => ({ value: String(c), label: `${c}`, pressed: c === 45 })) }],
  keys: [
    { mark: "lit", label: "The mask's analyser, blinking each breath" },
    { mark: "raised", label: "The belt, speeding up" },
    { mark: "heat", label: "Oxygen uptake against speed, on the tablet" },
  ],
  caption: CAPTION,
  body: `<div class="iso-stage vo-stage" tabindex="0" role="slider" aria-label="Minutes into the test. Left and right arrows move 15 seconds, Page Up and Down a minute, Space plays or pauses." aria-valuemin="0" aria-valuemax="${T45.total.toFixed(1)}" aria-valuenow="0" aria-valuetext="0:00, warm-up">${svg}</div><div class="vo-scrub"><button type="button" class="vo-play" data-play aria-label="Play">Play</button><input type="range" class="vo-range" min="0" max="${T45.total.toFixed(2)}" step="0.05" value="0" aria-label="Minutes into the test"><span class="vo-clock" data-clock aria-hidden="true">${fmt(0)}</span></div><span class="vo-sr" role="status" aria-live="polite" data-status></span>`,
});
const out = THEME === "light" ? `${SLUG}-light.html` : `${SLUG}.html`;
writeFileSync(join(HERE, out), page({ title: "The treadmill ramp", theme: THEME, body, css: CSS, script: SCRIPT }));
if (THEME === "light") {
  mkdirSync(join(HERE, "embed"), { recursive: true });
  writeFileSync(join(HERE, "embed", `optimal-fig-${SLUG}.js`), embed({ tag: `optimal-fig-${SLUG}`, body, script: SCRIPT, css: CSS }));
}
console.log("wrote", out, `${R.items.length} items`, `${R.solids.length} solids`, `scale ${KS.toFixed(3)}`, `H ${H}`, `facing away ${AS.facingAway}`);
A.auditOrExit(R, P, {});
void pin;
