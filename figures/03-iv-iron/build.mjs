// Fig 3 · The depot with a gate.
//
// A small rail yard. Iron is ingots. At the back stand the gut dock (pills drop
// into its hopper; a boom gate, ferroportin, lets absorbed iron out to the
// track), the ferritin silo (stores; its own export boom follows the same
// hepcidin) and the marrow press (stamps red discs; a counter shows Hb).
// Transferrin carts, each with two ingot cradles, run a loop in front. The IV
// tanker drives up the back road straight to the silo. A timeline ruler along
// the front edge runs from day 0 to week 8.
//
//   node build.mjs | --light | --audit
import { mkdirSync, readFileSync, writeFileSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";
import { figkit, k, G, A } from "../../shared/figkit.mjs";
import { plate, page, embed } from "../../shared/page.mjs";
import * as M from "./model.mjs";

const HERE = dirname(fileURLToPath(import.meta.url));
const THEME = process.argv.includes("--light") ? "light" : "dark";
const SLUG = "iv-iron";
const W = 600;
const H = 434;
const AZIMUTH = 45;
const ELEVATION = 34;

// ---------------------------------------------------------------- layout (world units, z up)
const PLATE = { x: -106, y: -81, w: 212, d: 134, r: 9 };
const LOOP = { x: -60, y: -28, w: 120, d: 50, r: 23 }; // cart centreline
const DOCK = { x: -100, y: -74, w: 46, d: 24, r: 2 };
const DOCK_H = 20;
const SILO = { x: 2, y: -56, r: 15, h: 42 };
const PRESS = { x: 66, y: -74, w: 34, d: 26, r: 2 };
const RULER = { x: -96, y: 41, w: 192, d: 7, r: 1 };
const BOOM_DOCK = { x: -60, y: -37.8, z: 8 }; // pivot; arm along −x when closed
const BOOM_SILO = { x: 16, y: -34, z: 12 };
const BOOM_LEN = 16;
const DIAL = { x: -88, y: -39.6, r: 7.5 };
const TANKER_Y = -66; // parked
const ROAD_X = 36;

const P = k.fitProjection([...k.boxCorners(PLATE, -13, 0), [SILO.x, SILO.y, SILO.h + 14], [PRESS.x, PRESS.y, 58], [DOCK.x, DOCK.y, DOCK_H + 18]], W, H, { pad: 10, azimuth: AZIMUTH, elevation: ELEVATION });
const F = figkit(P);
const { R, at, S, Ln, Dots, path3, vframe, roundRect, planeMatrix, put, box, cyl, turned, pin, prism, ball, stud } = F;
const KS = G.scaleOf(P);

// ---------------------------------------------------------------- bench and the timeline ruler
const back = F.bench(PLATE, { plateH: 8, footH: 5 });
{
  back.push(S(k.slabOf(RULER, 0, 0.8, P, 3), { tone: "lo", crease: "none" }));
  const perDay = RULER.w / M.DAYS;
  const minor = [];
  const major = [];
  for (let d = 0; d <= M.DAYS; d++) {
    const x = RULER.x + d * perDay;
    (d % 7 === 0 ? major : minor).push(k.lineOnTop([x, RULER.y], [x, RULER.y + (d % 7 === 0 ? 3.4 : 2.0)], 0.8, P));
  }
  // the recheck window (weeks 6–8): an inlaid band on the strip
  const band = { x: RULER.x + M.RECHECK[0] * perDay, y: RULER.y + 4.8, w: (M.RECHECK[1] - M.RECHECK[0]) * perDay, d: 1.6, r: 0.6 };
  back.push(Ln(minor.join(""), { tone: "lo" }), Ln(major.join(""), { tone: "mid" }));
  back.push(`<path class="fe-recheck" d="${k.planOutline(band, 0.8, P, 2)}"/>`, Ln(k.planOutline(band, 0.8, P, 2), { tone: "mid" }));
  back.push(`<g data-part="dosemarks"></g>`);
}

// ---------------------------------------------------------------- the track: ballast bed, two rails, sleepers
{
  const bed = [k.insetPlan(LOOP, -7.5), k.insetPlan(LOOP, 7.5)];
  back.push(`<path class="fe-bed" fill-rule="evenodd" d="${k.planOutline(bed[0], 0.01, P, 10)}${k.planOutline(bed[1], 0.01, P, 10)}"/>`);
  back.push(Ln(k.planOutline(bed[0], 0.01, P, 10) + k.planOutline(bed[1], 0.01, P, 10), { tone: "faint" }));
  const outer = k.insetPlan(LOOP, -3.2);
  const inner = k.insetPlan(LOOP, 3.2);
  // sleepers: short crossings from the inner rail to the outer rail, every ~7 units
  const ringO = k.ringOf(outer, 10);
  const ringI = k.ringOf(inner, 10);
  const sleepers = [];
  for (let i = 0; i < ringO.length; i += 1) {
    if (i % 2) continue;
    sleepers.push(k.lineOnTop(ringI[i], ringO[i], 0.6, P));
  }
  back.push(Ln(sleepers.join(""), { tone: "lo" }));
  back.push(Ln(k.planOutline(outer, 0.6, P, 10) + k.planOutline(inner, 0.6, P, 10), { tone: "mid" }));
}

// ---------------------------------------------------------------- the gut dock: building, hopper, platform, boom gate, hepcidin dial
box("dock", DOCK, 0, DOCK_H, { tone: "mid" }, {
  bevel: 0.6,
  inner: Ln(k.sideSeam(DOCK, 6, P, 3), { tone: "faint" }),
  extra: Dots(k.corners(DOCK, 2.4).map(([x, y]) => at([x, y, DOCK_H])), { size: 0.5 }) + Ln([0.25, 0.5, 0.75].map((f) => k.segment([DOCK.x + DOCK.w * f, DOCK.y + DOCK.d, 0], [DOCK.x + DOCK.w * f, DOCK.y + DOCK.d, DOCK_H], P)).join(""), { tone: "faint" }),
});
{
  const F0 = vframe(DOCK.x + 14, DOCK.y + 12, DOCK_H);
  turned("dock.hopper", F0, [[0, 3.2], [3, 3.2], [3.2, 4], [9, 10], [10, 10]], { tone: "hi", crease: "lo" }, { inner: Ln(G.arcOf(F0, 6, 4 + (2.8 * 6) / 5.8, P, { slope: 6 / 5.8 }), { tone: "faint" }) });
}
const PLATFORM = { x: DOCK.x + 22, y: DOCK.y + DOCK.d, w: 24, d: 10, r: 1 };
box("dock.platform", PLATFORM, 0, 6, { tone: "lo" }, { steps: 2, bevel: 0.4, extra: Dots([at([PLATFORM.x + 2, PLATFORM.y + 8, 6]), at([PLATFORM.x + PLATFORM.w - 2, PLATFORM.y + 8, 6])], { size: 0.45 }) });
function boomPost(name, b, z0 = 0) {
  cyl(`${name}.post`, b.x, b.y, 1.8, z0, b.z - 2.2 - z0, { tone: "mid" }, { steps: 20, extra: Ln(k.sideArc(b.x, b.y, 1.8, z0 + 3, P, 16), { tone: "faint" }) });
  pin(`${name}.hub`, G.frameOf([b.x, b.y - 2.2, b.z], [0, 1, 0], [1, 0, 0], [0, 0, 1]), 0, 4.4, 2.2, { tone: "hi" });
}
boomPost("boom.dock", BOOM_DOCK);
// hepcidin dial: face-up gauge on a short pedestal at the platform's corner
{
  cyl("dial.base", DIAL.x, DIAL.y, DIAL.r + 1.2, 6, 1.4, { tone: "lo" }, { steps: 36 });
  const ticks = k.radialTicks(DIAL.x, DIAL.y, DIAL.r - 1.6, 10, 5, 10, [1, 2], P, -0.75 * Math.PI, 1.5 * Math.PI);
  cyl("dial", DIAL.x, DIAL.y, DIAL.r, 7.4, 2.6, { tone: "hi", crease: "lo" }, {
    steps: 40,
    extra: Ln(k.ring(DIAL.x, DIAL.y, DIAL.r - 1.1, 10, P, 40), { tone: "lo" }) + Ln(ticks.minor, { tone: "lo" }) + Ln(ticks.major, { tone: "mid" }) + Ln(k.ring(DIAL.x, DIAL.y, 1, 10, P, 12), { tone: "mid" }),
  });
}
box("dial.pedestal", { x: DIAL.x - 5, y: DIAL.y - 5, w: 10, d: 10, r: 1.5 }, 0, 6, { tone: "mid" }, { steps: 2 });

// ---------------------------------------------------------------- the ferritin silo: body, bands, roof, sight glass, export boom
{
  const F0 = vframe(SILO.x, SILO.y);
  const bands = [10, 22, 34].map((z) => G.arcOf(F0, z, SILO.r, P)).join("");
  turned("silo.foot", F0, [[0, SILO.r + 2], [3, SILO.r + 2]], { tone: "lo" });
  const siloBody = [[3, SILO.r], [SILO.h, SILO.r]];
  const roof = Array.from({ length: 13 }, (_, i) => {
    const t = i / 12;
    return [SILO.h + t * 12, (SILO.r + 0.8) * (1 - t) ** 0.9 + 0.01, 1];
  });
  roof[0] = [SILO.h, SILO.r + 0.8];
  turned("silo.roof", F0, [...roof, [SILO.h + 12.2, 0]], { tone: "hi", crease: "lo" }, { smooth: false });
  // sight glass: a slot on the silo's face toward the viewer, with a level bar inside (drawn by the page)
  const ang = G.angleToward(F0, G.viewOf(P));
  const SG = { z0: 8, z1: SILO.h - 4, half: 0.16 };
  const corners = [
    G.pointOf(F0, SG.z0, SILO.r + 0.05, ang - SG.half),
    G.pointOf(F0, SG.z0, SILO.r + 0.05, ang + SG.half),
    G.pointOf(F0, SG.z1, SILO.r + 0.05, ang + SG.half),
    G.pointOf(F0, SG.z1, SILO.r + 0.05, ang - SG.half),
  ];
  const levelPts = (f) => {
    const z = SG.z0 + 1 + f * (SG.z1 - SG.z0 - 2);
    return [G.pointOf(F0, SG.z0 + 1, SILO.r + 0.08, ang - SG.half * 0.7), G.pointOf(F0, SG.z0 + 1, SILO.r + 0.08, ang + SG.half * 0.7), G.pointOf(F0, z, SILO.r + 0.08, ang + SG.half * 0.7), G.pointOf(F0, z, SILO.r + 0.08, ang - SG.half * 0.7)];
  };
  const ticks = [];
  for (let i = 0; i <= 10; i++) {
    const z = SG.z0 + 1 + (i / 10) * (SG.z1 - SG.z0 - 2);
    ticks.push(path3([G.pointOf(F0, z, SILO.r + 0.06, ang + SG.half), G.pointOf(F0, z, SILO.r + 0.06, ang + SG.half + (i % 5 === 0 ? 0.1 : 0.06))]));
  }
  SILO.level = { F0: [SILO.x, SILO.y], ang, SG, r: SILO.r };
  SILO.glassSvg = `<path class="fe-glass" d="${path3(corners, true)}"/><path class="fe-level" data-part="level" d="${path3(levelPts(0.02), true)}"/>` + Ln(path3(corners, true), { tone: "mid" }) + Ln(ticks.join(""), { tone: "lo" });
  turned("silo", F0, siloBody, { tone: "mid" }, { inner: Ln(bands, { tone: "faint" }), extra: SILO.glassSvg });
  void levelPts;
}
box("silo.apron", { x: SILO.x - 10, y: SILO.y + 18, w: 30, d: 8, r: 1 }, 0, 4, { tone: "lo" }, { steps: 2, bevel: 0.3 });
boomPost("boom.silo", BOOM_SILO, 4);

// ---------------------------------------------------------------- the marrow press: base, columns, crown, ram, die, chute and tray, Hb counter
const RAM = { x: PRESS.x + 8, y: PRESS.y + 6, w: 18, d: 12, r: 1 };
{
  // the Hb counter: a window on the base's front face (+y), three digit wheels drawn in the plane
  const face = PRESS.y + PRESS.d;
  const m = planeMatrix([PRESS.x + 20, face + 0.05, 9], [1, 0, 0], [0, 0, -1]);
  PRESS.counterSvg = `<g transform="${m}"><rect class="fe-window" x="0" y="0" width="11" height="5.4" rx="0.8"/><text class="fe-digits" data-part="hb" x="5.5" y="4.2" font-size="4.2" text-anchor="middle">105</text><path class="iso-line" data-tone="mid" d="M0.8 0H10.2Q11 0 11 0.8V4.6Q11 5.4 10.2 5.4H0.8Q0 5.4 0 4.6V0.8Q0 0 0.8 0Z"/></g>`;
  box("press.base", PRESS, 0, 12, { tone: "mid" }, { bevel: 0.6, inner: Ln(k.sideSeam(PRESS, 4, P, 3), { tone: "faint" }), extra: Dots(k.corners(PRESS, 2.4).map(([x, y]) => at([x, y, 12])), { size: 0.5 }) + PRESS.counterSvg });
  for (const [cx, cy] of [[PRESS.x + 5, PRESS.y + 5], [PRESS.x + PRESS.w - 5, PRESS.y + 5], [PRESS.x + 5, PRESS.y + 17], [PRESS.x + PRESS.w - 5, PRESS.y + 17]]) cyl("press.column", cx, cy, 1.8, 12, 34, { tone: "mid" }, { steps: 20, extra: Ln(k.sideArc(cx, cy, 1.8, 40, P, 16), { tone: "faint" }) });
  box("press.crown", { x: PRESS.x + 1, y: PRESS.y + 1, w: PRESS.w - 2, d: 20, r: 2 }, 46, 9, { tone: "mid" }, { bevel: 0.6, inner: Ln(k.sideSeam({ x: PRESS.x + 1, y: PRESS.y + 1, w: PRESS.w - 2, d: 20, r: 2 }, 49, P, 3), { tone: "faint" }) });
  box("press.die", { x: RAM.x + 2, y: RAM.y + 1, w: RAM.w - 4, d: RAM.d - 2, r: 1 }, 12, 3, { tone: "hi", crease: "lo" }, { steps: 2 });
  box("press.ram", RAM, 30, 10, { tone: "hi", crease: "lo" }, { steps: 2, bevel: 0.4, piece: "ram", move: [0, 0, -12], attrs: ` data-part="ram"` });
  // a rod from the crown to the ram
  {
    // the ram's rod slides out of a gland in the crown: one rod, clipped at the gland face
    const RF = G.frameOf([RAM.x + RAM.w / 2, RAM.y + RAM.d / 2, 46], [0, 0, -1], [1, 0, 0], [0, -1, 0]);
    const rod = G.rodOut(RF, 0, 46 - 40, 2.4, P, { stroke: 12 });
    put("press.rod", [RAM.x + RAM.w / 2, RAM.y + RAM.d / 2, 43], `<clipPath id="fe-rod"><path data-hold d="${rod.clip}"/></clipPath><g clip-path="url(#fe-rod)">${S(rod.paths, { tone: "lo" })}</g>`, [F.record(A.slide(RF, 0, 6, 2.4, { name: "press.rod" }))], { piece: "ram", move: [0, 0, -12] });
  }
  // chute from the die forward, and the tray where red discs land
  const CH = G.frameOf([PRESS.x + 12, PRESS.y + PRESS.d, 6], [0, 1, 0], [1, 0, 0], [0, 0, 1]);
  prism("press.chute", CH, [[0, 0], [10, 0], [10, 1.2], [0, 1.2]], 0, 8, { tone: "lo" });
  box("press.tray", { x: PRESS.x + 9, y: PRESS.y + PRESS.d + 8, w: 16, d: 9, r: 1.5 }, 0, 4, { tone: "mid" }, { steps: 3, bevel: 0.4, extra: `<g data-part="discs"></g>` });
}

// ---------------------------------------------------------------- the back road and the IV tanker (built parked; the page drives it in and out)
{
  // the back road: an inlaid bed from the plate's back edge to the silo's apron
  const road = { x: ROAD_X - 9, y: PLATE.y + 3, w: 18, d: -38 - (PLATE.y + 3), r: 1.5 };
  back.push(S(k.slabOf(road, 0, 0.2, P, 2), { tone: "lo", crease: "none" }), Ln(k.planOutline(k.insetPlan(road, 1.2), 0.2, P, 2), { tone: "faint" }));
}
{
  const TK = { x: ROAD_X - 6, y: TANKER_Y - 14, w: 12, d: 30 };
  const move = [0, -70, 0];
  const piece = { piece: "tanker", move, attrs: ` data-part="tanker"` };
  box("tanker.chassis", { x: TK.x, y: TK.y, w: TK.w, d: TK.d, r: 1.2 }, 2.5, 2.5, { tone: "lo" }, { steps: 2, ...piece });
  for (const [side, wy] of [[-1, TK.y + 5], [-1, TK.y + 24], [1, TK.y + 5], [1, TK.y + 24]]) pin("tanker.wheel", G.frameOf([side < 0 ? TK.x : TK.x + TK.w, wy, 2.5], [side, 0, 0], [0, 1, 0], [0, 0, 1]), 0, 1.8, 2.5, { tone: "mid" }, { ...piece });
  box("tanker.cab", { x: TK.x + 0.5, y: TK.y + TK.d - 8, w: TK.w - 1, d: 7.5, r: 1.6 }, 5, 8, { tone: "mid" }, { steps: 3, bevel: 0.4, ...piece });
  const FT = G.frameOf([ROAD_X, TK.y + 1, 10.5], [0, 1, 0], [1, 0, 0], [0, 0, 1]);
  const tank = Array.from({ length: 9 }, (_, i) => {
    const t = i / 8;
    return [t * 3, 5.5 * Math.sqrt(1 - (1 - t) ** 2), 1];
  });
  tank[0] = [0, 0.6];
  turned("tanker.tank", FT, [...tank, [17, 5.5], ...tank.slice().reverse().map(([s, r]) => [20 - s, r, 1]).slice(0, -1), [20, 0.6]], { tone: "hi", crease: "lo" }, { inner: Ln([6, 11].map((s) => G.arcOf(FT, s, 5.5, P)).join(""), { tone: "faint" }), ...piece });
}

// ---------------------------------------------------------------- assemble: carts are drawn by the page in a slot after the back row
const groups = F.assemble([0, 0.5, 1]);
const svg = k.figureSvg({
  width: W,
  height: H,
  label:
    "A rail yard for iron. At the back: the gut dock, where pills drop into a hopper and a boom gate (ferroportin) lets absorbed iron out; the ferritin silo, the body's store, with its own export gate and a sight glass showing how full it is; and the marrow press, which stamps red discs and counts haemoglobin. Transferrin carts, each able to carry two iron ingots, run a loop in front. A hepcidin dial beside the dock sets both gates. An IV tanker drives up the back road straight to the silo.",
  body: [...back, ...groups, `<g data-part="booms"></g>`, `<g data-part="carts"></g>`, `<g data-part="pill"></g>`, `<path class="iso-line" data-tone="hi" data-part="needle" data-free="" d="" style="stroke-width:1.1"/>`, `<g data-part="rider"></g>`],
});

const DATA = {
  P,
  loop: LOOP,
  ruler: { ...RULER, perDay: RULER.w / M.DAYS },
  booms: { dock: BOOM_DOCK, silo: BOOM_SILO, len: BOOM_LEN },
  dial: DIAL,
  silo: SILO.level,
  ram: { travel: 12 },
  tanker: { travel: 70 },
  hopper: [DOCK.x + 14, DOCK.y + 12, DOCK_H + 10],
  tray: { x: PRESS.x + 9, y: PRESS.y + PRESS.d + 8, w: 16, d: 9, z: 4 },
};
const MODEL_SRC = readFileSync(join(HERE, "model.mjs"), "utf8").replace(/^export /gm, "");
const latheSource = readFileSync(join(HERE, "../../.claude/skills/anatomy/kit/lathe.mjs"), "utf8").replace(/^import .*$/gm, "").replace(/^export /gm, "");
const LATHE = `const G = (() => {${latheSource}\nreturn { frameOf, prismOf, pointOf };})();\n`;
const LIVE = readFileSync(join(HERE, "live.js"), "utf8").replace("__DATA__", JSON.stringify(DATA));
const SCRIPT = `${LATHE}\n${MODEL_SRC}\n${LIVE}`;
const CSS = readFileSync(join(HERE, "figure.css"), "utf8");

const D = Object.fromEntries(M.MODES.map((m) => [m, M.daily(m)]));
const r0 = (v) => Math.round(v);
const CAPTION = [
  `Hepcidin is the body's iron gatekeeper: it closes the export gates (ferroportin) on gut cells and on the cells that store iron. A pill of 60 mg of iron or more raises hepcidin for about a day, so the next day's pill is absorbed roughly 35–45 % less. That's why some people take pills every other day. Pills still work and are the right first step for many people.`,
  `IV iron skips the gut gate: the infusion is taken up by the storage cells, which then hand iron to transferrin, the body's carts (each carries at most two iron atoms), for the marrow to build red cells. In this model, one 1000 mg infusion lifts ferritin to about ${r0(Math.max(...D.iv.map((d) => d.ferritin)))} µg/L within a week, settling near ${r0(D.iv[49].ferritin)} by week 7, while haemoglobin rises from ${M.PARAMS.hb0} to about ${r0(D.iv[56].hb)} g/L by week 8; on daily pills, haemoglobin also rises but ferritin stays near ${r0(D.daily[56].ferritin)}.`,
  `<small>A typical pattern for one modelled woman (65 kg, starting Hb ${M.PARAMS.hb0} g/L, ferritin ${M.PARAMS.ferritin0} µg/L), not a prediction. Your NP confirms yours with bloodwork, rechecked at 6–8 weeks; ferritin reads high for a few weeks after an infusion. Dose depends on weight and haemoglobin, and some people need a second infusion.</small>`,
]
  .map((p) => `<span class="fe-par">${p}</span>`)
  .join("");
const body = plate({
  fig: "Fig 3",
  title: "The depot with a gate",
  hint: "Pick a route · drag the days · space to play",
  stats: [
    { key: "day", label: "Day", value: "0" },
    { key: "gate", label: "Gut gate", value: "97 % open" },
    { key: "fer", label: "Ferritin", value: `${M.PARAMS.ferritin0} µg/L` },
    { key: "hb", label: "Hb", value: `${M.PARAMS.hb0} g/L` },
  ],
  controls: [{ name: "mode", label: "Route", options: [["daily", "Daily pills"], ["alternate", "Alternate days"], ["iv", "IV infusion"]].map(([value, label], i) => ({ value, label, pressed: i === 0 })) }],
  keys: [
    { mark: "lit", label: "Iron (ingots on transferrin carts)" },
    { mark: "raised", label: "Gates: ferroportin, set by the hepcidin dial" },
    { mark: "red", label: "Red cells from the marrow press" },
  ],
  caption: CAPTION,
  body: `<div class="iso-stage fe-stage" tabindex="0" role="slider" aria-label="Iron over eight weeks. Left and right arrows move a day, Page Up and Down a week, Space plays or pauses." aria-valuemin="0" aria-valuemax="56" aria-valuenow="0" aria-valuetext="Day 0">${svg}</div><div class="fe-scrub"><button type="button" class="fe-play" data-play aria-label="Play">Play</button><input type="range" class="fe-range" min="0" max="${M.DAYS}" step="0.25" value="0" aria-label="Day"><span class="fe-week" data-week aria-hidden="true">Week 0</span></div><span class="fe-sr" role="status" aria-live="polite" data-status></span>`,
});
const out = THEME === "light" ? `${SLUG}-light.html` : `${SLUG}.html`;
writeFileSync(join(HERE, out), page({ title: "The depot with a gate", theme: THEME, body, css: CSS, script: SCRIPT }));
if (THEME === "light") {
  mkdirSync(join(HERE, "embed"), { recursive: true });
  writeFileSync(join(HERE, "embed", `optimal-fig-${SLUG}.js`), embed({ tag: `optimal-fig-${SLUG}`, body, script: SCRIPT, css: CSS }));
}
console.log("wrote", out, `${R.items.length} items`, `${R.solids.length} solids`, `scale ${KS.toFixed(3)}`);
A.auditOrExit(R, P, {});
void ball; void stud; void roundRect;
