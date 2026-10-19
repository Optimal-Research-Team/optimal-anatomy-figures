// Wahoo KICKR BIKE SHIFT (2023) smart indoor bike, built part by part in real millimetres.
// Frame: x = the rider's right (drive side), y = forward (toward the bars), z = up; floor at z = 0,
// the crank axis (bottom bracket) at y = 0. Proportions are scaled from Wahoo's owner's manual side
// elevation (about 1.2 mm per pixel, checked against the 135-140 x 78-79 cm footprint, a 265 mm saddle
// and 165-175 mm crank holes). No logos or wordmarks are drawn: the label panel on the drive case is blank.
import * as G from "../kit/lathe.mjs";
const TAU = Math.PI * 2;
const unit = G.unit3;
const add = G.add3;
const mul = G.mul3;
const sub = G.sub3;
const dot = G.dot3;
const cross = G.cross3;
export const frame = (o, a, u) => {
  const A = unit(a);
  const U = unit(sub(u, mul(A, dot(u, A))));
  return { o, a: A, u: U, v: cross(A, U) };
};
const AX = { x: [1, 0, 0], y: [0, 1, 0], z: [0, 0, 1] };
const NX = [-1, 0, 0];
const NY = [0, -1, 0];
const NZ = [0, 0, -1];

// key points (mm)
export const BB = { y: 0, z: 310 }; // crank axis
export const FLY = { y: -380, z: 350, R: 220 }; // flywheel cover centre and outer radius
export const RATIO = 105 / 32; // belt: crank pulley over flywheel pulley (inferred)
const BAR = { y: 536, z: 926 }; // handlebar clamp centre
const SEAT = { y: -150 }; // seat tube centre line
const HEAD = { y: 452 }; // head tube centre line
const BEAM = { z0: 732, z1: 810, y0: -84, y1: 336, w: 27 };
const LEG = { z0: 22, z1: 78, ang: (42 * Math.PI) / 180, len: 520 };

const f = (n) => (Math.abs(n) < 1e-9 ? "0" : n.toFixed(2));
const ring = (r, steps = 72, cx = 0, cy = 0) =>
  Array.from({ length: steps }, (_, j) => {
    const a = (TAU * j) / steps;
    return `${j ? "L" : "M"}${f(cx + r * Math.cos(a))} ${f(cy + r * Math.sin(a))}`;
  }).join("") + "Z";
const line = (d, tone = "lo") => `<path class="iso-line" data-tone="${tone}" d="${d}"/>`;
const polyPath = (pts) => pts.map(([x, y], i) => `${i ? "L" : "M"}${f(x)} ${f(y)}`).join("") + "Z";
const fillPath = (d, fill, extra = "") => `<path d="${d}" style="fill:${fill};stroke:none${extra}"/>`;

// convex hull (monotone chain), counter-clockwise
export function hull2(points) {
  const p = points.map(([x, y]) => [x, y]).sort((a, b) => a[0] - b[0] || a[1] - b[1]);
  const crossZ = (o, a, b) => (a[0] - o[0]) * (b[1] - o[1]) - (a[1] - o[1]) * (b[0] - o[0]);
  const lower = [];
  for (const q of p) {
    while (lower.length >= 2 && crossZ(lower[lower.length - 2], lower[lower.length - 1], q) <= 1e-9) lower.pop();
    lower.push(q);
  }
  const upper = [];
  for (let i = p.length - 1; i >= 0; i--) {
    const q = p[i];
    while (upper.length >= 2 && crossZ(upper[upper.length - 2], upper[upper.length - 1], q) <= 1e-9) upper.pop();
    upper.push(q);
  }
  return lower.slice(0, -1).concat(upper.slice(0, -1));
}
const circ = (cx, cy, r, n = 24, a0 = 0, a1 = TAU) => Array.from({ length: n }, (_, j) => {
  const a = a0 + ((a1 - a0) * j) / (a1 - a0 >= TAU - 1e-9 ? n : n - 1);
  return [cx + r * Math.cos(a), cy + r * Math.sin(a)];
});
const rrect = (u0, v0, u1, v1) => [
  [u0, v0],
  [u1, v0],
  [u1, v1],
  [u0, v1],
];

export function buildObject(T, { layer }) {
  const parts = {};
  const groups = {};
  const explode = [];
  const anchors = {};
  const features = [];
  const L = layer;
  const root = T.group("root", { free: { origin: [0, 20, 500] } });
  groups.root = root;
  const assembly = (name, dir, travel, delay = 0, parent = root) => {
    const g = T.group(name, { parent, slide: { direction: unit(dir), travel } });
    groups[name] = g;
    explode.push({ name, travel, delay });
    return g;
  };
  const slide = (name, parent, dir, travel) => {
    const g = T.group(name, { parent, slide: { direction: unit(dir), travel } });
    groups[name] = g;
    return g;
  };
  const hinge = (name, parent, point, axis, range) => {
    const g = T.group(name, { parent, hinge: { point, axis, range } });
    groups[name] = g;
    return g;
  };
  const part = (p) => (parts[p.name] = p);
  const prism = (name, group, F, poly, s0, s1, o = {}) =>
    part(
      T.prism({
        name,
        group,
        layer: L,
        F,
        polygon: o.hull === false ? poly : hull2(poly),
        s0,
        s1,
        round: o.round ?? 0,
        steps: o.steps ?? 4,
        tone: o.tone ?? "hi",
        crease: o.crease ?? "lo",
        bevel: o.bevel ?? 0,
        material: o.material ?? "ink",
        lit: o.lit,
        details: o.details,
      }),
    );
  // prism along x: polygon in (y, z); along y: polygon in (z, x); along z: polygon in (x, y)
  const FX = frame([0, 0, 0], AX.x, AX.y);
  const FY = frame([0, 0, 0], AX.y, AX.z);
  const FZ = frame([0, 0, 0], AX.z, AX.x);
  const px = (name, group, poly, x0, x1, o) => prism(name, group, FX, poly, x0, x1, o);
  const py = (name, group, poly, y0, y1, o) => prism(name, group, FY, poly, y0, y1, o);
  const pz = (name, group, poly, z0, z1, o) => prism(name, group, FZ, poly, z0, z1, o);
  const round = (name, group, F, s0, s1, r, o = {}) =>
    part(
      T.round({
        name,
        group,
        layer: L,
        F,
        s0,
        s1,
        r,
        ends: o.ends,
        tone: o.tone ?? "hi",
        crease: o.crease ?? "lo",
        material: o.material ?? "ink",
        lit: o.lit,
        details: o.details,
        fixed: o.fixed,
      }),
    );
  const plane = (p, o, u, v, svg, normal, fade = [0.04, 0.3]) => T.plane({ part: p, o, u, v, svg, normal, fade });
  const fx = (x, y, z) => frame([x, y, z], AX.x, AX.y);
  const fnx = (x, y, z) => frame([x, y, z], NX, AX.y);
  const fy = (x, y, z) => frame([x, y, z], AX.y, AX.z);
  const fny = (x, y, z) => frame([x, y, z], NY, AX.z);
  const fz = (x, y, z) => frame([x, y, z], AX.z, AX.x);
  // drawing axes for face planes, seen from outside the face
  const RIGHT = { u: [0, 1, 0], v: [0, 0, -1] }; // +x face: drawing right = forward
  const LEFT = { u: [0, -1, 0], v: [0, 0, -1] }; // -x face
  const TOP = { u: [1, 0, 0], v: [0, -1, 0] }; // +z face, seen from above with the front up
  const FRONT = { u: [-1, 0, 0], v: [0, 0, -1] };
  const BACK = { u: [1, 0, 0], v: [0, 0, -1] };

  // ── core: bottom-bracket housing, left case, base spine and pedestal (they stay put) ──
  const core = assembly("core", AX.z, 0, 0);
  const housing = round("bb.housing", core, fx(-57, BB.y, BB.z), 0, 114, 128, { material: "ink", tone: "hi" });
  {
    const caseL = round("case.L", core, fnx(-57, BB.y, BB.z), 0, 38, [140, 135], { material: "ink", tone: "hi", details: { seams: [8] } });
    plane(caseL, [-95.02, BB.y, BB.z], LEFT.u, LEFT.v, line(ring(124, 96) + ring(116, 96), "lo"), NX);
  }
  // spine of the base, its rear end pointed to take the two splayed stabiliser legs
  const tipY = -250 - 38 * Math.tan(Math.PI / 2 - LEG.ang);
  const spine = pz(
    "base.spine",
    core,
    [
      [-38, 156],
      [38, 156],
      [38, -250],
      [0, tipY],
      [-38, -250],
    ],
    LEG.z0,
    LEG.z1,
    { material: "ink", tone: "hi", hull: false },
  );
  plane(spine, [0, -40, LEG.z1 + 0.02], TOP.u, TOP.v, [-120, 40, 120].map((y) => `<circle cx="-22" cy="${-y}" r="2.6" style="fill:var(--anatomy-shade-0)"/><circle cx="22" cy="${-y}" r="2.6" style="fill:var(--anatomy-shade-0)"/>`).join(""), AX.z);
  pz("base.pedestal", core, rrect(-36, -10, 36, 70), LEG.z1, 181, { material: "ink", tone: "hi", round: 6 });

  // front leg: bolted sleeve, bar, foot pad
  {
    const legF = assembly("leg.front", AX.y, 130, 0.2);
    const sleeve = py("leg.front.sleeve", legF, rrect(LEG.z0 - 3, -41, LEG.z1 + 3, 41), 156, 210, { material: "ink", tone: "hi", round: 6 });
    plane(sleeve, [0, 183, LEG.z1 + 3.02], TOP.u, TOP.v, [-13, 13].flatMap((y) => [-26, 26].map((x) => `<circle cx="${x}" cy="${y}" r="3.2" style="fill:var(--anatomy-lit-top)"/><circle cx="${x}" cy="${y}" r="1.4" style="fill:var(--anatomy-shade-0)"/>`)).join(""), AX.z);
    py("leg.front.bar", legF, rrect(LEG.z0, -35, LEG.z1, 35), 210, 655, { material: "ink", tone: "hi", round: 7, details: { seams: [420] } });
    const padG = assembly("foot.front", AX.y, 60, 0.1, legF);
    const pad = px(
      "foot.front",
      padG,
      [
        [655, 0],
        [726, 0],
        [738, 12],
        [738, 38],
        [712, 88],
        [655, 88],
      ],
      -46,
      46,
      { material: "tape", tone: "hi", bevel: 2 },
    );
    plane(pad, [46.02, 696, 44], RIGHT.u, RIGHT.v, line("M-34 34H34M-34 -38L8 -38", "faint"), AX.x);
    anchors.foot = [0, 700, 50];
  }
  // rear stabiliser legs with levelling feet
  for (const side of [1, -1]) {
    const dir = [side * Math.sin(LEG.ang), -Math.cos(LEG.ang), 0];
    const face = [side * 19, (-250 + tipY) / 2, (LEG.z0 + LEG.z1) / 2];
    const o = add(face, mul(dir, 12));
    const F = frame(o, dir, AX.z);
    const g = assembly(`leg.rear.${side > 0 ? "R" : "L"}`, dir, 110, 0.2);
    const sec = rrect(-28, -33, 28, 33);
    const leg = prism(`leg.rear.${side > 0 ? "R" : "L"}`, g, F, sec, 0, LEG.len, { material: "ink", tone: "hi", round: 8 });
    plane(leg, add(o, [0, 0, 28.02]), dir, mul(F.v, side > 0 ? 1 : 1), line(`M24 ${-20}h0.01M24 20h0.01`, "lo") + `<circle cx="24" cy="-18" r="2.4" style="fill:var(--anatomy-shade-0)"/><circle cx="24" cy="18" r="2.4" style="fill:var(--anatomy-shade-0)"/>`, AX.z);
    prism(`leg.rear.${side > 0 ? "R" : "L"}.cap`, g, F, sec, LEG.len, LEG.len + 16, { material: "tape", tone: "hi", round: 10 });
    const fg = assembly(`foot.rear.${side > 0 ? "R" : "L"}`, NZ, 46, 0.12, g);
    const at = add(o, mul(dir, LEG.len - 30));
    round(`foot.rear.${side > 0 ? "R" : "L"}.stem`, fg, fz(at[0], at[1], 9), 0, LEG.z0 - 9, 7, { material: "frame", tone: "hi" });
    round(`foot.rear.${side > 0 ? "R" : "L"}.pad`, fg, fz(at[0], at[1], 0), 0, 9, [22, 19], { material: "tape", tone: "hi" });
    if (side > 0) anchors["foot.rear"] = [at[0], at[1], 12];
  }

  // ── flywheel: cover (two face plates and a rim band), the flywheel itself, the electronic brake ──
  const C = [0, FLY.y, FLY.z];
  const vents = (sign) => {
    // diagonal slats in the cover's upper rear quarter, clipped to an annular sector
    const R0 = 64;
    const R1 = 196;
    const a0 = (100 * Math.PI) / 180;
    const a1 = (196 * Math.PI) / 180;
    const inside = (u, v) => {
      const r = Math.hypot(u, v);
      let a = Math.atan2(-v, sign * u);
      if (a < 0) a += TAU;
      return r > R0 && r < R1 && a > a0 && a < a1;
    };
    let fills = "";
    let edges = "";
    for (let c = -320; c <= 320; c += 9) {
      const pts = [];
      for (let t = -260; t <= 260; t += 1) {
        const u = c * 0.7071 + t * 0.7071;
        const v = -c * 0.7071 + t * 0.7071;
        if (inside(u, v)) pts.push([u, v]);
      }
      if (pts.length < 6) continue;
      const [p0, p1] = [pts[0], pts[pts.length - 1]];
      const w = 2.6;
      const n = [0.7071 * w, -0.7071 * w];
      fills += fillPath(polyPath([[p0[0] - n[0], p0[1] - n[1]], [p1[0] - n[0], p1[1] - n[1]], [p1[0] + n[0], p1[1] + n[1]], [p0[0] + n[0], p0[1] + n[1]]]), "var(--anatomy-shade-0)");
      edges += `M${f(p0[0] + n[0])} ${f(p0[1] + n[1])}L${f(p1[0] + n[0])} ${f(p1[1] + n[1])}`;
    }
    return fills + line(edges, "faint") + line(ring(208, 120), "lo") + line(ring(60, 60), "faint");
  };
  const plateL = assembly("fly.plate.L", NX, 210, 0.16);
  const coverSlide = slide("fly.cover", plateL, [-0.4, -0.1, 0.91], 480);
  {
    const p = round("fly.plate.L", coverSlide, fnx(-45, FLY.y, FLY.z), 0, 10, [216, 209], { material: "ink", tone: "hi" });
    plane(p, [-55.02, FLY.y, FLY.z], LEFT.u, LEFT.v, vents(-1), NX);
    anchors["fly.plate.L"] = [-55, FLY.y, FLY.z];
  }
  const plateR = assembly("fly.plate.R", AX.x, 112, 0.22);
  {
    const p = round("fly.plate.R", plateR, fx(45, FLY.y, FLY.z), 0, 10, [216, 209], { material: "ink", tone: "hi" });
    plane(p, [55.02, FLY.y, FLY.z], RIGHT.u, RIGHT.v, vents(1), AX.x);
  }
  const BAND = 20;
  for (let i = 0; i < BAND; i++) {
    const a0 = (i / BAND) * TAU;
    const a1 = ((i + 1) / BAND) * TAU;
    const am = (a0 + a1) / 2;
    const g = assembly(`fly.band.${i}`, [0, Math.cos(am), Math.sin(am)], 64 * (1 - 0.62 * Math.max(0, Math.cos(am))), 0.26);
    const pts = [a0, a1].flatMap((a) => [
      [FLY.y + 220 * Math.cos(a), FLY.z + 220 * Math.sin(a)],
      [FLY.y + 203 * Math.cos(a), FLY.z + 203 * Math.sin(a)],
    ]);
    px(`fly.band.${i}`, g, pts, -45, 45, { material: "ink", tone: "mid", crease: "faint" });
  }
  // the flywheel turns on its own hinge; the brake (stator) sits beside it on the drive side
  const fly = hinge("fly", root, C, AX.x, [0, 360]);
  {
    const wheel = round("flywheel", fly, fx(-22, FLY.y, FLY.z), 0, 44, 188, { material: "frame", tone: "hi", details: { seams: [8, 36] } });
    const face = (sign) => {
      let s = line(ring(180, 120) + ring(150, 120) + ring(46, 60), "lo");
      for (let j = 0; j < 6; j++) {
        const a = (j / 6) * TAU;
        const cx = 100 * Math.cos(a);
        const cy = 100 * Math.sin(a);
        s += `<circle cx="${f(cx)}" cy="${f(cy)}" r="26" style="fill:var(--anatomy-shade-0)"/>` + line(ring(26, 40, cx, cy), "mid");
      }
      s += fillPath(`M-4 -178L4 -178L4 -152L-4 -152Z`, "#2c4e25");
      return s;
    };
    plane(wheel, [-22.02, FLY.y, FLY.z], LEFT.u, LEFT.v, face(-1), NX);
    plane(wheel, [22.02, FLY.y, FLY.z], RIGHT.u, RIGHT.v, face(1), AX.x);
    const hub = round("flywheel.hub", fly, fnx(-22, FLY.y, FLY.z), 0, 12, 40, { material: "frame", tone: "hi", details: { bolts: [{ s: 12, r: 28, count: 5, size: 1.6, tone: "hi" }] } });
    plane(hub, [-34.02, FLY.y, FLY.z], LEFT.u, LEFT.v, line(ring(14, 36), "mid"), NX);
    anchors.flywheel = [-34, FLY.y, FLY.z];
  }
  {
    const g = assembly("stator", AX.x, 50, 0.3);
    const st = round("brake.stator", g, fx(24, FLY.y, FLY.z), 0, 18, 140, { material: "leaf", tone: "hi", details: { seams: [9] } });
    let coils = "";
    for (let j = 0; j < 12; j++) {
      const a = (j / 12) * TAU;
      const c = [96 * Math.cos(a), 96 * Math.sin(a)];
      coils += `<circle cx="${f(c[0])}" cy="${f(c[1])}" r="20" style="fill:var(--anatomy-shade-1)"/>` + line(ring(20, 30, c[0], c[1]) + ring(12, 24, c[0], c[1]), "mid");
    }
    plane(st, [23.98, FLY.y, FLY.z], LEFT.u, LEFT.v, coils + line(ring(132, 100) + ring(40, 40), "mid"), NX);
    anchors.stator = [24, FLY.y, FLY.z];
  }

  // ── belt drive on the right: case cover with a blank raised label panel, case wall, belt, pulleys ──
  const A = { y: FLY.y, z: FLY.z, r: 76 };
  const B = { y: BB.y, z: BB.z, r: 140 };
  const outline = hull2([...circ(A.y, A.z, A.r, 72), ...circ(B.y, B.z, B.r, 120)]);
  const caseCover = assembly("case.R.cover", AX.x, 330, 0.06);
  {
    const cover = px("case.R.cover", caseCover, outline, 85, 95, { material: "ink", tone: "hi", bevel: 2.4, hull: false });
    const screws = [...circ(A.y, -A.z, A.r - 16, 5, 1.2), ...circ(B.y, -B.z, B.r - 14, 7, 0.4)]
      .filter(([y, z]) => Math.hypot(y - BB.y, z + BB.z) > 118)
      .map(([y, z]) => `<circle cx="${f(y)}" cy="${f(z)}" r="3.4" style="fill:var(--anatomy-lit-top)"/>` + line(polyPath(circ(y, z, 1.6, 6)), "hi"))
      .join("");
    plane(cover, [95.02, 0, 0], RIGHT.u, RIGHT.v, line(polyPath(hull2([...circ(A.y, -A.z, A.r - 9, 48), ...circ(B.y, -B.z, B.r - 9, 72)])), "faint") + screws, AX.x);
    const panel = [
      [-432, 402],
      [-150, 432],
      [-128, 404],
      [-182, 366],
      [-410, 340],
    ];
    const pn = px("case.R.panel", caseCover, panel, 95, 97.5, { material: "ink", tone: "hi", bevel: 0.6 });
    plane(pn, [97.52, 0, 0], RIGHT.u, RIGHT.v, line(polyPath(hull2(panel.map(([y, z]) => [y, -z])).map(([y, z]) => [y + (y < -300 ? 8 : -8), z])), "faint"), AX.x);
    anchors.case = [97, -280, 390];
  }
  {
    // the case wall: a 5 mm band round the outline, cut into convex pieces at most 64 degrees each
    const n = outline.length;
    const cen = [(A.y + B.y) / 2, (A.z + B.z) / 2];
    const inset = (p, q, r) => {
      const t1 = unit([q[0] - p[0], q[1] - p[1], 0]);
      const t2 = unit([r[0] - q[0], r[1] - q[1], 0]);
      const t = unit(add(t1, t2));
      const nrm = [t[1], -t[0]];
      const s = Math.sign((cen[0] - q[0]) * nrm[0] + (cen[1] - q[1]) * nrm[1]) || 1;
      return [q[0] + nrm[0] * 5 * s, q[1] + nrm[1] * 5 * s];
    };
    const dirs = outline.map((p, i) => Math.atan2(outline[(i + 1) % n][1] - p[1], outline[(i + 1) % n][0] - p[0]));
    const pieces = [];
    let cur = [0];
    let turned = 0;
    for (let i = 1; i <= n; i++) {
      let d = dirs[i % n] - dirs[i - 1];
      while (d > Math.PI) d -= TAU;
      while (d < -Math.PI) d += TAU;
      const len = Math.hypot(outline[i % n][0] - outline[i - 1][0], outline[i % n][1] - outline[i - 1][1]);
      cur.push(i % n);
      turned += Math.abs(d);
      if (turned > (64 * Math.PI) / 180 || len > 120 || i === n) {
        pieces.push(cur);
        cur = [i % n];
        turned = 0;
      }
    }
    const wall = assembly("case.R.wall", AX.x, 250, 0.1);
    pieces.forEach((idx, k2) => {
      if (idx.length < 2) return;
      const outer = idx.map((i) => outline[i]);
      const i0 = idx[0];
      const i1 = idx[idx.length - 1];
      const inner = [inset(outline[(i0 - 1 + n) % n], outline[i0], outline[(i0 + 1) % n]), inset(outline[(i1 - 1 + n) % n], outline[i1], outline[(i1 + 1) % n])];
      px(`case.R.wall.${k2}`, wall, [...outer, ...inner], 57, 85, { material: "ink", tone: "mid", crease: "faint" });
    });
  }
  const crank = hinge("crank", root, [0, BB.y, BB.z], AX.x, [0, 360]);
  {
    const beltG = assembly("belt", AX.x, 175, 0.14);
    // external tangents of the two pulleys (flywheel r 32, crank r 105), offset 1.5 mm for the belt
    const r1 = 32 + 1.5;
    const r2 = 105 + 1.5;
    const d = Math.hypot(BB.y - FLY.y, BB.z - FLY.z);
    const ang = Math.atan2(BB.z - FLY.z, BB.y - FLY.y);
    const phi = Math.acos((r1 - r2) / d);
    for (const [nm, s] of [
      ["top", 1],
      ["bottom", -1],
    ]) {
      const a = ang + s * phi;
      const n2 = [Math.cos(a), Math.sin(a)];
      const p1 = [FLY.y + n2[0] * r1, FLY.z + n2[1] * r1];
      const p2 = [BB.y + n2[0] * r2, BB.z + n2[1] * r2];
      const q1 = [p1[0] + n2[0] * 5, p1[1] + n2[1] * 5];
      const q2 = [p2[0] + n2[0] * 5, p2[1] + n2[1] * 5];
      const b = px(`belt.${nm}`, beltG, [p1, p2, q2, q1], 64, 78, { material: "tape", tone: "hi" });
      void b;
    }
  }
  // pulleys ride with their shafts; they come out with the belt
  {
    const g = T.group("pulley.fly", { parent: fly, slide: { direction: AX.x, travel: 175 } });
    groups["pulley.fly"] = g;
    explode.push({ name: "pulley.fly", travel: 175, delay: 0.14 });
    round("pulley.fly", g, fx(62, FLY.y, FLY.z), 0, 18, 32, { material: "frame", tone: "hi", details: { ribs: { s0: 1, s1: 17, count: 30, tone: "lo" } } });
    const h = T.group("pulley.bb", { parent: crank, slide: { direction: AX.x, travel: 175 } });
    groups["pulley.bb"] = h;
    explode.push({ name: "pulley.bb", travel: 175, delay: 0.14 });
    const pb = round("pulley.bb", h, fx(62, BB.y, BB.z), 0, 18, 105, { material: "frame", tone: "hi", details: { ribs: { s0: 1, s1: 17, count: 110, tone: "lo" } } });
    let spokes = line(ring(92, 96) + ring(30, 40), "lo");
    for (let j = 0; j < 5; j++) {
      const a = (j / 5) * TAU + 0.3;
      spokes += fillPath(polyPath([[38 * Math.cos(a - 0.3), 38 * Math.sin(a - 0.3)], [86 * Math.cos(a - 0.22), 86 * Math.sin(a - 0.22)], [86 * Math.cos(a + 0.22), 86 * Math.sin(a + 0.22)], [38 * Math.cos(a + 0.3), 38 * Math.sin(a + 0.3)]]), "var(--anatomy-shade-1)");
    }
    plane(pb, [80.02, BB.y, BB.z], RIGHT.u, RIGHT.v, spokes, AX.x);
  }

  // ── cranks: five-bolt discs, arms with a five-hole "claw" for 165-175 mm lengths ──
  const holes = [0, 1, 2, 3, 4].map((i) => {
    const r = 165 + 2.5 * i;
    const a = ((-10.6 + 5.3 * i) * Math.PI) / 180;
    return [r * Math.cos(a), r * Math.sin(a)];
  });
  const armPoly = [
    [-24, -22],
    [0, -26],
    [24, -22],
    [146, -14],
    [146, 14],
    [24, 22],
    [0, 26],
    [-24, 22],
  ];
  const clawPoly = hull2([[146, -15], [146, 15], ...holes.flatMap(([u, v]) => circ(u, v, 12, 16))]);
  const discFace = () => {
    let s = line(ring(106, 120) + ring(36, 60), "lo");
    for (let j = 0; j < 5; j++) {
      const a = (j / 5) * TAU + TAU / 10;
      const pts = [];
      for (const [r, da] of [
        [50, -0.42],
        [96, -0.5],
        [96, 0.5],
        [50, 0.42],
      ])
        pts.push([r * Math.cos(a + da), r * Math.sin(a + da)]);
      pts.splice(2, 0, [100 * Math.cos(a), 100 * Math.sin(a)]);
      s += fillPath(polyPath(pts), "var(--anatomy-shade-0)") + line(polyPath(pts), "hi");
    }
    // five chainring-style bolts with hex sockets
    for (let j = 0; j < 5; j++) {
      const a = (j / 5) * TAU + TAU / 10 + Math.PI / 5;
      const c = [44 * Math.cos(a), 44 * Math.sin(a)];
      s += `<circle cx="${f(c[0])}" cy="${f(c[1])}" r="4.6" style="fill:var(--anatomy-lit-top)"/>` + line(ring(4.6, 24, c[0], c[1]), "hi") + line(polyPath(circ(c[0], c[1], 2.1, 6)), "hi");
    }
    return s;
  };
  for (const side of [1, -1]) {
    const sx = side > 0 ? "R" : "L";
    const dg = assembly(`disc.${sx}`, [side, 0, 0], 410, 0.03, crank);
    const disc = round(`disc.${sx}`, dg, frame([side * 95, BB.y, BB.z], [side, 0, 0], AX.y), 0, 8, 112, {
      material: "ink",
      tone: "hi",
    });
    plane(disc, [side * 103.02, BB.y, BB.z], side > 0 ? RIGHT.u : LEFT.u, RIGHT.v, discFace(), [side, 0, 0]);
    const ag = assembly(`arm.${sx}`, [side, 0, 0], 480, 0, crank);
    // the right arm points forward at angle 0, the left arm back
    const flip = side > 0 ? 1 : -1;
    const toYZ = (poly) => poly.map(([u, v]) => [BB.y + flip * u, BB.z + v]);
    const xs = side > 0 ? [104, 117] : [-117, -104];
    px(`arm.${sx}`, ag, toYZ(armPoly), xs[0], xs[1], { material: "ink", tone: "hi", bevel: 1.2 });
    const claw = px(`claw.${sx}`, ag, toYZ(clawPoly), xs[0], xs[1], { material: "ink", tone: "hi", bevel: 1.2 });
    const hx = side > 0 ? xs[1] + 0.02 : xs[0] - 0.02;
    let hs = "";
    for (const [u, v] of holes) {
      const y = flip * u;
      const z = v;
      const du = side > 0 ? y : -y;
      hs += `<circle cx="${f(du)}" cy="${f(-z)}" r="7" style="fill:var(--anatomy-shade-0)"/>` + line(ring(7, 24, du, -z), "mid");
    }
    plane(claw, [hx, BB.y, BB.z], side > 0 ? RIGHT.u : LEFT.u, RIGHT.v, hs, [side, 0, 0]);
    const cap = round(`arm.${sx}.cap`, ag, frame([side * 117, BB.y, BB.z], [side, 0, 0], AX.y), 0, 5, 17, { material: "frame", tone: "hi" });
    plane(cap, [side * 122.02, BB.y, BB.z], side > 0 ? RIGHT.u : LEFT.u, RIGHT.v, line(polyPath(circ(0, 0, 7, 6)), "hi"), [side, 0, 0]);
  }
  anchors.crank = [117, BB.y + 165, BB.z];
  anchors["claw.L"] = [-117, BB.y + 170, BB.z];
  anchors["disc.L"] = [-103, BB.y, BB.z];
  anchors.claw = [117, BB.y + 170, BB.z];
  anchors.disc = [103, BB.y, BB.z];

  // ── upper frame: socket, upright, beam, fillet, collars, the two quick-release levers ──
  const upper = assembly("frame.upper", AX.z, 130, 0.3);
  pz("frame.socket", core, rrect(-38, -62, 38, 50), 440, 510, { material: "ink", tone: "hi", round: 8, details: { seams: [500] } });
  {
    const post = pz("frame.post", upper, rrect(-BEAM.w, -54, BEAM.w, 42), 510, BEAM.z0, { material: "frame", tone: "hi", round: 8 });
    plane(post, [0, 42.02, 600], FRONT.u, FRONT.v, `<rect x="-6" y="-4" width="12" height="7" rx="3.5" style="fill:var(--anatomy-shade-0)"/>`, AX.y);
    const beam = py("frame.beam", upper, rrect(BEAM.z0, -BEAM.w, BEAM.z1, BEAM.w), BEAM.y0, BEAM.y1, { material: "frame", tone: "hi", round: 9 });
    void beam;
    px("frame.fillet", upper, [[42, BEAM.z0], [42, BEAM.z0 - 46], [52, BEAM.z0 - 30], [70, BEAM.z0 - 12], [88, BEAM.z0]], -BEAM.w, BEAM.w, { material: "frame", tone: "hi" });
    py("frame.collar.rear", upper, rrect(BEAM.z0 - 3, -BEAM.w - 3, BEAM.z1 + 3, BEAM.w + 3), BEAM.y0 - 12, BEAM.y0, { material: "ink", tone: "hi", round: 10 });
    py("frame.collar.front", upper, rrect(BEAM.z0 - 3, -BEAM.w - 3, BEAM.z1 + 3, BEAM.w + 3), BEAM.y1, BEAM.y1 + 12, { material: "ink", tone: "hi", round: 10 });
    // standover knob on the back of the upright
    const kg = assembly("knob.standover", NY, 30, 0.12, upper);
    round("knob.standover.stem", kg, fny(0, -54, 570), 0, 10, 9, { material: "ink", tone: "hi" });
    const kb = round("knob.standover", kg, fny(0, -64, 570), 0, 24, [20, 18], { material: "ink", tone: "hi", details: { ribs: { s0: 2, s1: 22, count: 24, tone: "lo" } } });
    plane(kb, [0, -88.02, 570], BACK.u, BACK.v, line(ring(9, 30), "mid"), NY);
    anchors.standover = [0, -88, 570];
    // setback and reach levers: a round base, a wedge handle pointing back, a hex cap
    for (const [nm, y] of [
      ["setback", -34],
      ["reach", 286],
    ]) {
      const lg = assembly(`lever.${nm}`, AX.z, 70, 0.04, upper);
      round(`lever.${nm}.base`, lg, fz(0, y, BEAM.z1), 0, 18, 15, { material: "ink", tone: "hi" });
      pz(`lever.${nm}.handle`, lg, [...circ(0, y, 15, 20), ...circ(0, y - 60, 7, 14)], BEAM.z1 + 18, BEAM.z1 + 32, { material: "ink", tone: "hi", bevel: 1.5 });
      const cap = round(`lever.${nm}.cap`, lg, fz(0, y, BEAM.z1 + 32), 0, 5, 10, { material: "frame", tone: "hi" });
      plane(cap, [0, y, BEAM.z1 + 37.02], TOP.u, TOP.v, line(polyPath(circ(0, 0, 4.2, 6)), "hi"), AX.z);
      anchors[`lever.${nm}`] = [0, y, BEAM.z1 + 30];
    }
  }
  // sliders (black) to the seat tube and the head tube
  const seatG = assembly("seat.tube", NY, 110, 0.9);
  py("slider.setback", seatG, rrect(744, -22, 798, 22), SEAT.y + 21, BEAM.y0 - 12, { material: "ink", tone: "hi", round: 6 });
  {
    // square seat tube as four walls in a pinwheel round a 30 mm square bore; the collar is drawn as a seam
    const y0 = SEAT.y;
    const walls = [
      ["front", [-21, y0 + 15, 15, y0 + 21]],
      ["right", [15, y0 - 15, 21, y0 + 21]],
      ["back", [-15, y0 - 21, 21, y0 - 15]],
      ["left", [-21, y0 - 21, -15, y0 + 15]],
    ];
    for (const [nm, [x0, ya, x1, yb]] of walls) {
      const w = pz(`seat.tube.${nm}`, seatG, rrect(x0, ya, x1, yb), 676, 850, { material: "ink", tone: "hi", round: nm === "front" || nm === "back" ? 0 : 0, details: { seams: [826] } });
      if (nm === "right") {
        let d = "";
        for (let i = 0; i < 8; i++) d += `M${-14 + i * 4} -2V2`;
        plane(w, [21.02, y0, 812], RIGHT.u, RIGHT.v, line(d, "mid"), AX.x);
      }
    }
    const qg = assembly("seat.qr", AX.x, 60, 0.08, seatG);
    px("seat.qr", qg, [[y0 - 10, 832], [y0 + 10, 832], [y0 + 44, 842], [y0 + 46, 848], [y0 - 10, 848]], 21, 27, { material: "frame", tone: "hi", bevel: 0.8 });
    anchors.seatTube = [21, y0, 830];
  }
  const fit = slide("seat.fit", root, AX.z, 60);
  const postG = assembly("seatpost", AX.z, 175, 0, fit);
  {
    const sp = pz("seatpost", postG, rrect(-13, SEAT.y - 13, 13, SEAT.y + 13), 700, 956, { material: "ink", tone: "hi", round: 5 });
    let d = "";
    let t = "";
    for (let i = 0; i <= 16; i++) {
      const z = 956 - 14 - i * 6;
      d += `M${i % 2 ? -3 : -6} ${f(-(z - 860))}H3`;
      if (i % 2 === 0 && i > 0) t += `<text x="6" y="${f(-(z - 860) + 2)}" font-size="5.2" style="fill:var(--anatomy-dot);font-family:'Public Sans',sans-serif">${i / 2}</text>`;
    }
    plane(sp, [13.02, SEAT.y, 860], RIGHT.u, RIGHT.v, line(d, "hi") + t, AX.x);
    plane(sp, [-13.02, SEAT.y, 860], LEFT.u, LEFT.v, line(d, "hi") + t, NX);
    anchors.seatpost = [13, SEAT.y, 900];
  }
  const saddleG = assembly("saddle", AX.z, 130, 0, postG);
  {
    pz("saddle.clamp", saddleG, rrect(-16, SEAT.y - 18, 16, SEAT.y + 18), 956, 966, { material: "ink", tone: "hi", round: 4 });
    pz("saddle.cradle", saddleG, rrect(-28, SEAT.y - 9, 28, SEAT.y + 9), 966, 972, { material: "frame", tone: "hi", round: 3 });
    for (const side of [1, -1]) round(`saddle.rail.${side > 0 ? "R" : "L"}`, saddleG, fy(side * 22, -236, 975.6), 0, 168, 3.5, { material: "frame", tone: "hi" });
    // the saddle as tail, waist and nose pieces: the plan tapers from 140 mm to a 34 mm nose and the
    // top steps down a little toward the nose
    const hw = (y) => 70 + ((y + 246) * (17 - 70)) / 232;
    const tail = hull2([...circ(-46, -246, 24, 16), ...circ(46, -246, 24, 16), ...circ(0, -262, 12, 10), [-hw(-205), -205], [hw(-205), -205]]);
    const waist = [[-hw(-205), -205], [hw(-205), -205], [hw(-118), -118], [-hw(-118), -118]];
    const nose = hull2([[-hw(-118), -118], [hw(-118), -118], [17, -16], [-17, -16], [-11, -8], [11, -8]]);
    pz("saddle.shell.tail", saddleG, tail, 979.6, 989, { material: "ink", tone: "hi", bevel: 2, hull: false });
    pz("saddle.shell.waist", saddleG, waist, 979.6, 989, { material: "ink", tone: "hi", bevel: 2, hull: false });
    pz("saddle.shell.nose", saddleG, nose, 979.6, 989, { material: "ink", tone: "hi", bevel: 2, hull: false });
    const tailC = hull2([...circ(-46, -246, 17, 16), ...circ(46, -246, 17, 16), ...circ(0, -262, 5, 8), [-hw(-205) + 7, -205], [hw(-205) - 7, -205]]);
    const waistC = [[-hw(-205) + 7, -205], [hw(-205) - 7, -205], [hw(-118) - 7, -118], [-hw(-118) + 7, -118]];
    const noseC = hull2([[-hw(-118) + 7, -118], [hw(-118) - 7, -118], [11, -20], [-11, -20], [-6, -14], [6, -14]]);
    const st = pz("saddle.tail", saddleG, tailC, 989, 1010, { material: "tape", tone: "hi", bevel: 6, hull: false });
    pz("saddle.waist", saddleG, waistC, 989, 1006, { material: "tape", tone: "hi", bevel: 5, hull: false });
    const sn = pz("saddle.nose", saddleG, noseC, 989, 1002, { material: "tape", tone: "hi", bevel: 5, hull: false });
    plane(st, [0, 0, 1010.02], TOP.u, TOP.v, line(`M-30 ${205}C-36 225 -30 246 0 250C30 246 36 225 30 ${205}`, "faint") + line(`M-8 205V236`, "mid") + line("M8 205V236", "mid"), AX.z);
    plane(sn, [0, 0, 1002.02], TOP.u, TOP.v, line("M-8 118L-5 40M8 118L5 40", "mid"), AX.z);
    anchors.saddle = [0, -150, 1008];
  }

  // ── front: reach slider, head tube, steer tube, stem, junction box ──
  const headG = assembly("head", AX.y, 120, 0.16);
  py("slider.reach", headG, rrect(744, -22, 798, 22), BEAM.y1 + 12, HEAD.y - 27, { material: "ink", tone: "hi", round: 6 });
  round("head.tube", headG, fz(0, HEAD.y, 700), 0, 136, 27, { material: "ink", tone: "hi", details: { seams: [120] } });
  {
    const cg = assembly("head.collar", AX.z, 50, 0.1, headG);
    round("head.collar", cg, fz(0, HEAD.y, 836), 0, 16, 31, { material: "ink", tone: "hi" });
    px("head.qr", cg, [[HEAD.y - 8, 838], [HEAD.y + 8, 838], [HEAD.y + 40, 846], [HEAD.y + 42, 851], [HEAD.y - 8, 851]], 31, 37, { material: "frame", tone: "hi", bevel: 0.8 });
  }
  const stackG = assembly("steer", AX.z, 90, 0.08);
  {
    const st = round("steer.tube", stackG, fz(0, HEAD.y, 852), 0, 52, 16, { material: "frame", tone: "hi" });
    void st;
  }
  const stemG = assembly("stem", AX.z, 130, 0.05);
  round("stem.clamp", stemG, fz(0, HEAD.y, 904), 0, 42, 22, { material: "ink", tone: "hi", details: { seams: [14, 28] } });
  {
    const tc = round("stem.cap", stemG, fz(0, HEAD.y, 946), 0, 5, 18, { material: "ink", tone: "hi" });
    plane(tc, [0, HEAD.y, 951.02], TOP.u, TOP.v, line(polyPath(circ(0, 0, 5, 6)), "hi") + line(ring(13, 40), "faint"), AX.z);
  }
  py("stem.body", stemG, rrect(912, -17, 940, 17), HEAD.y + 22, BAR.y - 20, { material: "ink", tone: "hi", round: 5 });
  {
    const fp = py("stem.faceplate", stemG, rrect(BAR.z - 18, -26, BAR.z + 18, 26), BAR.y + 20, BAR.y + 27, { material: "ink", tone: "hi", round: 6 });
    plane(fp, [0, BAR.y + 27.02, BAR.z], FRONT.u, FRONT.v, [-18, 18].flatMap((x) => [-10, 10].map((z) => `<circle cx="${x}" cy="${z}" r="3" style="fill:var(--anatomy-lit-top)"/>` + line(polyPath(circ(x, z, 1.4, 6)), "hi"))).join(""), AX.y);
  }
  const jb = assembly("junction", AX.y, 210, 0.02);
  {
    const box = pz("junction.box", jb, rrect(-20, HEAD.y + 18, 20, HEAD.y + 42), 862, 898, { material: "ink", tone: "hi", round: 4 });
    plane(box, [0, HEAD.y + 42.02, 880], FRONT.u, FRONT.v, `<circle cx="-7" cy="-6" r="2.6" style="fill:#a9d49c"/><circle cx="7" cy="-6" r="2.6" style="fill:#fffcf7"/>` + line("M-12 6H12", "faint"), AX.y);
    anchors.junction = [0, HEAD.y + 42, 880];
  }

  // ── handlebars: 31.8 mm clamp area, taped tops and drops, hoods with brake-style levers and shift paddles ──
  const bars = assembly("bars", [0, 0.45, 1], 250, 0);
  round("bar.clamp", stemG, fx(-30, BAR.y, BAR.z), 0, 60, 20, { material: "ink", tone: "hi" });
  for (const side of [1, -1]) {
    const sx = side > 0 ? "R" : "L";
    const F = frame([side * 30, BAR.y, BAR.z], [side, 0, 0], AX.y);
    round(`bar.centre.${sx}`, bars, F, 0, 34, 15.9, { material: "ink", tone: "hi" });
    round(`bar.taper.${sx}`, bars, F, 34, 54, [15.9, 12.4], { material: "ink", tone: "hi" });
    let seams = [];
    for (let s = 64; s < 140; s += 11) seams.push(s);
    round(`bar.top.${sx}`, bars, F, 54, 142, 12.6, { material: "tape", tone: "hi", details: { seams } });
    const route = [
      [172, 0, 0],
      [192, 0, 0],
      [200, 18, -2],
      [204, 46, -9],
      [207, 68, -24],
      [209, 80, -48],
      [210, 77, -78],
      [210, 62, -104],
      [210, 38, -119],
      [210, 8, -125],
      [210, -30, -125],
    ].map(([x, y, z]) => [side * x, BAR.y + y, BAR.z + z]);
    T.tube({ name: `bar.drop.${sx}`, group: bars, layer: L, route, r: 12.6, chunk: 64, turn: 34, material: "tape", tone: "hi", rings: { tone: "lo" } });
    round(`bar.plug.${sx}`, bars, frame([side * 210, BAR.y - 30, BAR.z - 125], NY, AX.z), 0, 7, 12.8, { material: "ink", tone: "hi" });
    const xs = side > 0 ? [192, 220] : [-220, -192];
    const xt = side > 0 ? [195, 217] : [-217, -195];
    // the hood: a full-width body round the bar clamp, a narrower top rising to the horn
    const hood = px(`hood.${sx}`, bars, [[574, 938], [660, 924], [684, 938], [686, 950], [578, 950]], xs[0], xs[1], { material: "tape", tone: "hi", bevel: 2.5 });
    const top = px(`hood.${sx}.top`, bars, [[578, 950], [686, 950], [689, 964], [677, 977], [642, 969], [586, 959]], xt[0], xt[1], { material: "tape", tone: "hi", bevel: 3 });
    plane(top, [xt[side > 0 ? 1 : 0] + side * 0.02, 0, 0], side > 0 ? RIGHT.u : LEFT.u, RIGHT.v, line(side > 0 ? "M596 -956L676 -968M600 -952L680 -962" : "M-596 -956L-676 -968M-600 -952L-680 -962", "lo"), [side, 0, 0]);
    void hood;
    // two inner buttons on each hood
    for (const [j, [y, z]] of [
      [600, 950],
      [628, 954],
    ].entries())
      round(`hood.${sx}.button${j}`, bars, frame([side * 192, y, z], [-side, 0, 0], AX.y), 0, 3, 5, { material: "frame", tone: "hi" });
    const lx = side > 0 ? [200, 212] : [-212, -200];
    px(`lever.${sx}`, bars, [[666, 922], [684, 922], [690, 888], [675, 886]], lx[0], lx[1], { material: "frame", tone: "hi", bevel: 1 });
    px(`lever.${sx}.blade`, bars, [[675, 886], [690, 888], [686, 846], [674, 836]], lx[0], lx[1], { material: "frame", tone: "hi", bevel: 1 });
    const sg = hinge(`shift.${sx}`, bars, [side * 206, 657, 921], AX.y, [-25, 25]);
    px(`paddle.${sx}`, sg, [[652, 920], [662, 921], [664, 870], [656, 866]], side > 0 ? 202 : -210, side > 0 ? 210 : -202, { material: "ink", tone: "hi", bevel: 0.8 });
  }
  anchors.hood = [206, 640, 955];
  anchors.paddle = [206, 660, 890];
  anchors.bars = [0, BAR.y, BAR.z];

  // ── bottle cage on the upright's front ──
  {
    const cg = assembly("cage", [0, 1, 0.25], 130, 0.04, upper);
    px("cage.boss", cg, [[42, 520], [42, 590], [66, 600], [96, 572], [90, 530]], -12, 12, { material: "ink", tone: "hi", bevel: 1 });
    const ax = unit([0, Math.sin((32 * Math.PI) / 180), Math.cos((32 * Math.PI) / 180)]);
    const nrm = unit([0, ax[2], -ax[1]]);
    const o = [0, 97, 548];
    const at = (sA, n, x) => add(add(o, mul(ax, sA)), add(mul(nrm, n), [x, 0, 0]));
    prism("cage.spine", cg, frame(o, ax, AX.x), rrect(-10, 0, 10, 4), 0, 146, { material: "ink", tone: "hi", round: 1.5 });
    // two bent-wire arms round a 74 mm bottle, and a hook at the foot
    for (const side of [1, -1]) {
      const route = [
        [12, 8, side * 12],
        [26, 22, side * 33],
        [56, 40, side * 40],
        [96, 44, side * 37],
        [124, 32, side * 26],
        [138, 14, side * 13],
      ].map(([sA, n, x]) => at(sA, n, x));
      T.tube({ name: `cage.arm.${side > 0 ? "R" : "L"}`, group: cg, layer: L, route, r: 3.2, chunk: 80, turn: 50, material: "ink", tone: "hi" });
    }
    T.tube({ name: "cage.hook", group: cg, layer: L, route: [at(3, 8, 0), at(-6, 22, 0), at(-2, 46, 0)], r: 3.2, chunk: 80, turn: 60, material: "ink", tone: "hi" });
    anchors.cage = [0, 130, 600];
  }

  anchors.body = [0, 20, 500];
  anchors.side = [100, -120, 420];
  anchors.frontView = [0, 300, 700];

  // states the build proves the paint order in: cranks and flywheel turning, the cover off, the saddle up, a shift
  for (let i = 0; i < 12; i++) features.push({ crank: -i * 30, fly: -((i * 30 * RATIO) % 360) });
  for (let i = 0; i <= 6; i++) features.push({ "fly.cover": i * 80, crank: -(90 + i * 60), fly: -(((90 + i * 60) * RATIO) % 360) });
  for (let i = 0; i <= 4; i++) features.push({ "seat.fit": i * 15, "shift.R": i * 4.5 });
  return { parts, groups, explode, root, anchors, features, counts: { legs: 3 } };
}
export function explodeValues(explode, apart, { stretch = 0.55 } = {}) {
  const out = {};
  for (const { name, travel, delay } of explode) {
    const t = Math.max(0, Math.min(1, (apart - delay * stretch) / (1 - stretch)));
    out[name] = travel * t * t * (3 - 2 * t);
  }
  return out;
}
