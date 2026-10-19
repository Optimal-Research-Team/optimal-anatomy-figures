// InBody 580 body-composition analyser, built from convex parts.
// Overall envelope from the InBody 580 user manual (EN rev B, §9.2) and catalog rev C:
//   501.9 (W) × 892.4 (L) × 1124.4 (H) mm, 24.4 kg, 10.1" 1280 × 800 touchscreen + keypad,
//   tetrapolar 8-point tactile electrodes, 5 / 50 / 250 / 500 kHz, 200 µA.
// Sub-dimensions (column, head, handles, electrode pads) are estimated from the clinic's reference photos.
// Internals are not public: load cells, harness, cable bundle and boards are simplified assumptions.
//
// Frame: x is the object's own right (viewer's left at yaw 0), y its front (where the user stands), z up.
// Coordinates below are written with X = viewer's right and converted with vx(X) = -X.
import * as G from "../kit/lathe.mjs";
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
const vx = (X) => -X;
const TAU = Math.PI * 2;
const SANS = "'Public Sans', 'Helvetica Neue', Arial, sans-serif";
const f2 = (n) => n.toFixed(2);

// ---------- dimensions (mm) ----------
export const DIM = {
  W: 501.9,
  L: 892.4,
  H: 1124.4,
  plate: { half: 250.95, back: -446.2, front: 446.2, corner: 400, feet: 22, tray: 32, wall: 78, top: 86 },
  column: { yc: -255, front: -180, back: -330, half: 85, hinge: 186, shaft: 812, band: 840, shoulder: 945 },
  tilt: 58,
};
const PL = DIM.plate;
const CO = DIM.column;
const TH = (DIM.tilt * Math.PI) / 180;
const cT = Math.cos(TH);
const sT = Math.sin(TH);
// head frame: n = face normal (out of the glass), vd = down the face, origin on the glass back plane
const HN = [0, cT, sT];
const HVD = [0, sT, -cT];
const HO = [0, -243.5, DIM.H - 135 * cT - 2.5 * sT];
const headPt = (Xh, v, s) => add(add(add(HO, mul([1, 0, 0], vx(Xh))), mul(HVD, v)), mul(HN, s));

// ---------- 2D helpers ----------
const area = (p) => p.reduce((s, a, i) => { const b = p[(i + 1) % p.length]; return s + a[0] * b[1] - b[0] * a[1]; }, 0) / 2;
const ccw = (p) => (area(p) < 0 ? p.slice().reverse() : p.slice());
function fillet(poly, radii, steps = 7) {
  const P = poly;
  const n = P.length;
  const R = Array.isArray(radii) ? radii : P.map(() => radii);
  const out = [];
  for (let i = 0; i < n; i++) {
    const p = P[i];
    const a = P[(i - 1 + n) % n];
    const b = P[(i + 1) % n];
    const r = R[i];
    if (!r) { out.push(p); continue; }
    const d1 = [a[0] - p[0], a[1] - p[1]];
    const d2 = [b[0] - p[0], b[1] - p[1]];
    const l1 = Math.hypot(...d1);
    const l2 = Math.hypot(...d2);
    const u1 = [d1[0] / l1, d1[1] / l1];
    const u2 = [d2[0] / l2, d2[1] / l2];
    const phi = Math.acos(Math.max(-1, Math.min(1, u1[0] * u2[0] + u1[1] * u2[1])));
    let t = r / Math.tan(phi / 2);
    const lim = Math.min(l1, l2) * 0.48;
    const rr = t > lim ? lim * Math.tan(phi / 2) : r;
    t = Math.min(t, lim);
    const bis = [u1[0] + u2[0], u1[1] + u2[1]];
    const bl = Math.hypot(...bis);
    const c = [p[0] + (bis[0] / bl) * (rr / Math.sin(phi / 2)), p[1] + (bis[1] / bl) * (rr / Math.sin(phi / 2))];
    const t1 = [p[0] + u1[0] * t, p[1] + u1[1] * t];
    const t2 = [p[0] + u2[0] * t, p[1] + u2[1] * t];
    let a0 = Math.atan2(t1[1] - c[1], t1[0] - c[0]);
    let a1 = Math.atan2(t2[1] - c[1], t2[0] - c[0]);
    let da = a1 - a0;
    while (da > Math.PI) da -= TAU;
    while (da < -Math.PI) da += TAU;
    for (let j = 0; j <= steps; j++) {
      const ang = a0 + (da * j) / steps;
      out.push([c[0] + rr * Math.cos(ang), c[1] + rr * Math.sin(ang)]);
    }
  }
  return out;
}
// keep the side of line AB that contains point K
function clipLine(poly, A, B, K) {
  const side = (p) => (B[0] - A[0]) * (p[1] - A[1]) - (B[1] - A[1]) * (p[0] - A[0]);
  const sk = Math.sign(side(K));
  const out = [];
  for (let i = 0; i < poly.length; i++) {
    const a = poly[i];
    const b = poly[(i + 1) % poly.length];
    const sa = side(a) * sk;
    const sb = side(b) * sk;
    if (sa >= 0) out.push(a);
    if ((sa > 0 && sb < 0) || (sa < 0 && sb > 0)) {
      const t = sa / (sa - sb);
      out.push([a[0] + (b[0] - a[0]) * t, a[1] + (b[1] - a[1]) * t]);
    }
  }
  // drop near-duplicate points
  return out.filter((p, i) => { const q = out[(i + 1) % out.length]; return Math.hypot(p[0] - q[0], p[1] - q[1]) > 1e-4; });
}
// convex pieces of the ring between a convex outline and a convex cavity
function ringPieces(outline, cavity, targets) {
  const n = cavity.length;
  const cx = cavity.reduce((s, p) => s + p[0], 0) / n;
  const cy = cavity.reduce((s, p) => s + p[1], 0) / n;
  const pieces = [];
  for (let i = 0; i < n; i++) {
    const j = (i + 1) % n;
    const a = cavity[i];
    const b = cavity[j];
    // beyond the edge: the side NOT containing the centroid -> mirror the centroid across the edge
    const ex = b[0] - a[0];
    const ey = b[1] - a[1];
    const t = ((cx - a[0]) * ex + (cy - a[1]) * ey) / (ex * ex + ey * ey);
    const foot = [a[0] + ex * t, a[1] + ey * t];
    const mirror = [2 * foot[0] - cx, 2 * foot[1] - cy];
    let p = clipLine(outline, a, b, mirror);
    p = clipLine(p, a, targets[i], b);
    p = clipLine(p, b, targets[j], a);
    pieces.push(p);
  }
  return pieces;
}
function offsetPoly(poly, d) {
  const P = ccw(poly);
  const n = P.length;
  const lines = P.map((a, i) => {
    const b = P[(i + 1) % n];
    const l = Math.hypot(b[0] - a[0], b[1] - a[1]);
    const nrm = [(b[1] - a[1]) / l, -(b[0] - a[0]) / l];
    return { p: [a[0] + nrm[0] * d, a[1] + nrm[1] * d], dir: [(b[0] - a[0]) / l, (b[1] - a[1]) / l] };
  });
  return lines.map((L1, i) => {
    const L0 = lines[(i - 1 + n) % n];
    const den = L0.dir[0] * L1.dir[1] - L0.dir[1] * L1.dir[0];
    const w = [L1.p[0] - L0.p[0], L1.p[1] - L0.p[1]];
    const t = (w[0] * L1.dir[1] - w[1] * L1.dir[0]) / den;
    return [L0.p[0] + L0.dir[0] * t, L0.p[1] + L0.dir[1] * t];
  });
}
const rrect = (x0, y0, x1, y1, r) =>
  `M${f2(x0 + r)} ${f2(y0)}H${f2(x1 - r)}A${r} ${r} 0 0 1 ${f2(x1)} ${f2(y0 + r)}V${f2(y1 - r)}A${r} ${r} 0 0 1 ${f2(x1 - r)} ${f2(y1)}H${f2(x0 + r)}A${r} ${r} 0 0 1 ${f2(x0)} ${f2(y1 - r)}V${f2(y0 + r)}A${r} ${r} 0 0 1 ${f2(x0 + r)} ${f2(y0)}Z`;
const rect = (X0, y0, X1, y1) => [[X0, y0], [X1, y0], [X1, y1], [X0, y1]];
const line = (d, tone = "lo", extra = "") => `<path class="iso-line" data-tone="${tone}"${extra} d="${d}"/>`;
const text = (x, y, s, size, { fill = "#c9cdbf", anchor = "middle", weight = 500, track = 0.04, cls = "", style = "" } = {}) =>
  `<text${cls ? ` class="${cls}"` : ""} x="${f2(x)}" y="${f2(y)}" font-size="${size}" text-anchor="${anchor}" style="fill:${fill};font-family:${SANS};font-weight:${weight};letter-spacing:${track}em;${style}">${s}</text>`;
const radiiBy = (poly, fn) => poly.map(fn);
const polyPath = (pts) => pts.map(([a, b], i) => `${i ? "L" : "M"}${f2(a)} ${f2(b)}`).join("") + "Z";

export function buildObject(T, { layer }) {
  const parts = {};
  const groups = {};
  const explode = [];
  const anchors = {};
  const features = [];
  const L = layer;
  const root = T.group("root", { free: { origin: [0, -100, 560] } });
  groups.root = root;
  const assembly = (name, dir, travel, delay = 0, parent = root) => {
    const g = T.group(name, { parent, slide: { direction: unit(dir), travel } });
    groups[name] = g;
    explode.push({ name, travel, delay });
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
        polygon: poly,
        s0,
        s1,
        steps: 5,
        tone: o.tone ?? "hi",
        crease: o.crease ?? "lo",
        bevel: o.bevel ?? 0,
        material: o.material,
        lit: o.lit,
        details: o.details,
      }),
    );
  // polygons in viewer coordinates, converted per axis
  const FZ = frame([0, 0, 0], AX.z, AX.x); // polygon (x, y)
  const FY = frame([0, 0, 0], AX.y, AX.z); // polygon (z, x)
  const FX = frame([0, 0, 0], AX.x, AX.y); // polygon (y, z)
  const prismZ = (name, group, polyXy, z0, z1, o) => prism(name, group, FZ, polyXy.map(([X, y]) => [vx(X), y]), z0, z1, o);
  const prismY = (name, group, polyXz, y0, y1, o) => prism(name, group, FY, polyXz.map(([X, z]) => [z, vx(X)]), y0, y1, o);
  const prismX = (name, group, polyYz, X0, X1, o) => prism(name, group, FX, polyYz, Math.min(vx(X0), vx(X1)), Math.max(vx(X0), vx(X1)), o);
  const FH = frame(HO, HN, AX.x); // polygon (x, vd), extruded along n
  const prismH = (name, group, polyXv, s0, s1, o) => prism(name, group, FH, polyXv.map(([Xh, v]) => [vx(Xh), v]), s0, s1, o);
  const round = (name, group, F, s0, s1, r, o = {}) =>
    part(
      T.round({ name, group, layer: L, F, s0, s1, r, ends: o.ends, tone: o.tone ?? "hi", crease: o.crease ?? "lo", material: o.material, lit: o.lit, details: o.details }),
    );
  const plane = (p, o, u, v, svg, normal, fade = [0.04, 0.3]) => T.plane({ part: p, o, u, v, svg, normal, fade });
  const up = (X, y, z = 0) => frame([vx(X), y, z], AX.z, AX.x);
  const FRONT = { u: [-1, 0, 0], v: [0, 0, -1] };
  const TOP = { u: [-1, 0, 0], v: [0, 1, 0] };
  const BACK = { u: [1, 0, 0], v: [0, 0, -1] };
  const HEADFACE = { u: [-1, 0, 0], v: HVD };

  // =====================================================================
  // FOOTPLATE (lower section): feet, tray, walls, load cells, cover, electrodes
  // =====================================================================
  const plateSharp = [[-PL.half, PL.back], [PL.half, PL.back], [PL.half, PL.corner], [0, PL.front], [-PL.half, PL.corner]];
  const plateOutline = fillet(plateSharp, [46, 46, 40, 150, 40]);
  const core = assembly("core", AX.z, 0, 0);
  const tray = prismZ("plate.tray", core, fillet(offsetPoly(plateSharp, -18), [30, 30, 26, 120, 26]), PL.feet, PL.tray, { material: "ink", tone: "mid" });
  void tray;
  // level supporters (adjustable feet): rubber pad, steel disc, threaded stem
  for (const [X, y] of [[-200, -392], [200, -392], [-200, 330], [200, 330]]) {
    const tag = `${X > 0 ? "R" : "L"}${y > 0 ? "f" : "b"}`;
    const g = assembly(`foot.${tag}`, NZ, 38, 0.3);
    round(`leveller.${tag}.pad`, g, up(X, y), 0, 4, 34, { material: "ink", tone: "hi" });
    round(`leveller.${tag}.disc`, g, up(X, y), 4, 15, [37, 35], { material: "polish", tone: "hi", details: { seams: [9] } });
    round(`leveller.${tag}.stem`, g, up(X, y), 15, PL.feet, 13, { material: "alu", tone: "mid", details: { ribs: { s0: 15.5, s1: 21.5, count: 22, tone: "lo" } } });
  }
  // walls of the plate, a ring of five convex pieces round the cavity
  const cavity = [[-239, -434.2], [239, -434.2], [239, 390], [0, 434], [-239, 390]];
  const wallNames = ["back", "R", "front.R", "front.L", "L"];
  const wallDirs = [NY, NX, [-0.18, 0.98, 0], [0.18, 0.98, 0], AX.x];
  ringPieces(ccw(plateOutline), cavity, plateSharp).forEach((poly, i) => {
    const g = assembly(`wall.${wallNames[i]}`, wallDirs[i], 44, 0.26);
    const p = prismZ(`plate.wall.${wallNames[i]}`, g, poly, PL.tray, PL.wall, { material: "ink", tone: "hi", crease: "faint" });
    void p;
  });
  // quad load cells (InBody: "quad load cell system"); bar + load button, positions estimated
  for (const [X, y] of [[-200, -380], [200, -380], [-200, 318], [200, 318]]) {
    const tag = `${X > 0 ? "R" : "L"}${y > 0 ? "f" : "b"}`;
    const lc = prismZ(`loadcell.${tag}`, core, fillet(rect(X - 18, y - 38, X + 18, y + 38), 3), PL.tray, 54, { material: "alu", tone: "hi", details: { seams: [] } });
    plane(lc, [vx(X), y, 54.02], TOP.u, TOP.v, line(`M-10 -26H10M-10 26H10`, "lo") + `<circle cx="0" cy="-26" r="2.2" style="fill:#59644f"/><circle cx="0" cy="26" r="2.2" style="fill:#59644f"/>` + line(rrect(-9, -12, 9, 12, 3), "mid"), AX.z);
    round(`loadcell.${tag}.button`, core, up(X, y), 54, PL.wall, [9, 7], { material: "polish", tone: "hi" });
  }
  anchors.loadcell = [vx(200), 318, 60];

  // cover: the top of the plate, with foot electrodes, level indicator and the electrode harness under it
  const coverG = assembly("cover", AX.z, 64, 0.16);
  const cover = prismZ("plate.cover", coverG, plateOutline, PL.wall, PL.top, { material: "ink", tone: "hi", bevel: 1.2 });
  {
    // tread: chevron ribs between the electrodes, straight ribs at the back
    const slope = (PL.front - PL.corner) / PL.half;
    let d = "";
    for (let y0 = -150; y0 <= 352; y0 += 7) {
      const yy = (X) => y0 + slope * (PL.half - Math.abs(X)) * Math.min(1, Math.max(0, (y0 + 150) / 300));
      d += `M-92 ${f2(yy(-92))}L0 ${f2(yy(0))}L92 ${f2(yy(92))}`;
    }
    let back = "";
    for (let y = -436; y <= -350; y += 7) back += `M-230 ${y}H-100M100 ${y}H230`;
    const zone = `M-98 -160L98 -160L98 ${f2(360 + slope * 153)}L0 ${f2(360 + slope * 251)}L-98 ${f2(360 + slope * 153)}Z`;
    plane(cover, [0, 0, PL.top + 0.02], TOP.u, TOP.v, line(d, "faint") + line(back, "faint") + line(zone, "lo"), AX.z);
  }
  const padsG = assembly("pads", AX.z, 46, 0.1, coverG);
  const pad = (name, X0, X1, y0, y1, r) => {
    const p = prismZ(name, padsG, fillet(rect(X0, y0, X1, y1), r), PL.top, PL.top + 3, { material: "electrode", tone: "hi", bevel: 0.6 });
    let d = "";
    const w = X1 - X0;
    for (let x = -w / 2 + 9; x <= w / 2 - 8.9; x += 6) d += `M${f2(x)} ${f2(-(y1 - y0) / 2 + 7)}V${f2((y1 - y0) / 2 - 7)}`;
    plane(p, [vx((X0 + X1) / 2), (y0 + y1) / 2, PL.top + 3.02], TOP.u, TOP.v, line(d, "mid") + line(rrect(-w / 2 + 3, -(y1 - y0) / 2 + 3, w / 2 - 3, (y1 - y0) / 2 - 3, r - 3), "lo"), AX.z);
    return p;
  };
  for (const s of [1, -1]) {
    const side = s > 0 ? "R" : "L";
    const X0 = s > 0 ? 105 : -195;
    pad(`foot.${side}.fore`, X0, X0 + 90, 110, 235, 18);
    pad(`foot.${side}.heel`, X0, X0 + 90, 272, 327, 16);
  }
  anchors.fore = [vx(150), 172, PL.top + 3];
  anchors.heel = [vx(150), 300, PL.top + 3];
  anchors.pads = [0, 230, PL.top];
  // level indicator (bubble), back-left of the plate
  {
    const g = assembly("level", AX.z, 34, 0.08, coverG);
    const F = up(-190, -300);
    round("level.ring", g, F, PL.top, PL.top + 3, 13, { material: "polish", tone: "hi" });
    part(T.ball({ name: "level.bubble", group: g, layer: L, c: [vx(-190), -300, PL.top], r: 9, flats: [{ n: [0, 0, -1], d: -3 }], material: "electrode", tone: "hi" }));
    anchors.level = [vx(-190), -300, PL.top + 6];
  }
  // electrode harness under the cover: terminals below each pad, cables to the column connector
  const harnessG = assembly("harness", NZ, 0, 0.2, coverG);
  for (const [X, y, n] of [[150, 172, "R.fore"], [150, 300, "R.heel"], [-150, 172, "L.fore"], [-150, 300, "L.heel"]])
    round(`terminal.${n}`, harnessG, up(X, y), 70, PL.wall, 8, { material: "polish", tone: "mid" });
  prismZ("plate.connector", harnessG, fillet(rect(-30, -268, 30, -232), 3), 62, PL.wall, { material: "ink", tone: "hi" });
  for (const s of [1, -1]) {
    const side = s > 0 ? "R" : "L";
    T.tube({
      name: `plate.lead.${side}`,
      group: harnessG,
      layer: L,
      route: [[vx(s * 150), 300, 64], [vx(s * 150), 172, 64], [vx(s * 118), 40, 64], [vx(s * 60), -150, 64], [vx(s * 22), -228, 64]],
      r: 3.4,
      chunk: 90,
      turn: 40,
      material: "ink",
      tone: "hi",
    });
  }

  // =====================================================================
  // COLUMN (upper section): plinth, hinge cover, shell, cable bundle, measurement board
  // =====================================================================
  const colSharp = [[0, CO.front], [70, CO.front - 15], [CO.half, CO.front - 35], [CO.half, CO.back], [-CO.half, CO.back], [-CO.half, CO.front - 35], [-70, CO.front - 15]];
  const colOutline = fillet(colSharp, [5, 4, 5, 16, 16, 5, 4]);
  const column = assembly("column", AX.z, 112, 0.06);
  prismZ("column.plinth", column, fillet(offsetPoly(colSharp, 6), radiiBy(offsetPoly(colSharp, 6), ([, y]) => (y < CO.back + 20 ? 20 : 7))), PL.top, PL.top + 10, { material: "ink", tone: "hi" });
  const hingeCover = prismZ("column.hinge-cover", column, colOutline, PL.top + 10, CO.hinge, { material: "shell", tone: "hi", crease: "faint" });
  void hingeCover;
  const colCavity = [[-78, -217], [78, -217], [78, -323], [-78, -323]];
  const colTargets = [[-CO.half, CO.front - 35], [CO.half, CO.front - 35], [CO.half, CO.back], [-CO.half, CO.back]];
  const shaftNames = ["front", "R", "back", "L"];
  const shaftDirs = [[0, 1, 0.12], [-1, 0, 0.08], [0, -1, 0.12], [1, 0, 0.08]];
  const shaft = {};
  ringPieces(ccw(colOutline), colCavity, colTargets).forEach((poly, i) => {
    const g = assembly(`shaft.${shaftNames[i]}`, shaftDirs[i], i % 2 ? 58 : 66, 0.1, column);
    shaft[shaftNames[i]] = prismZ(`column.shell.${shaftNames[i]}`, g, poly, CO.hinge, CO.shaft, { material: "shell", tone: "hi", crease: "faint" });
  });
  // rear I/O on the back of the column: 2 × RS-232C (9-pin), USB host, LAN, DC inlet (manual §2.4 rear view; placement estimated)
  {
    const zc = 262;
    const yv = (z) => -(z - zc);
    const de9 = (x, z) => `<path class="iso-line" data-tone="hi" d="M${f2(x - 15)} ${f2(yv(z) - 5)}H${f2(x + 15)}L${f2(x + 12)} ${f2(yv(z) + 5)}H${f2(x - 12)}Z"/>` + Array.from({ length: 5 }, (_, j) => `<circle cx="${f2(x - 8 + j * 4)}" cy="${f2(yv(z) - 1.6)}" r=".7" style="fill:#59644f"/>`).join("") + Array.from({ length: 4 }, (_, j) => `<circle cx="${f2(x - 6 + j * 4)}" cy="${f2(yv(z) + 2)}" r=".7" style="fill:#59644f"/>`).join("");
    let svg = `<path class="iso-line" data-tone="mid" d="${rrect(-62, yv(330), 62, yv(196), 6)}"/>`;
    svg += de9(-30, 310) + de9(30, 310);
    svg += `<path class="iso-line" data-tone="hi" d="${rrect(-46, yv(276), -22, yv(266), 1)}"/>` + `<path class="iso-line" data-tone="lo" d="M-43 ${f2(yv(272))}H-25"/>`;
    svg += `<path class="iso-line" data-tone="hi" d="M-6 ${f2(yv(280))}H14V${f2(yv(264))}H10V${f2(yv(261))}H-2V${f2(yv(264))}H-6Z"/>`;
    svg += `<circle cx="38" cy="${f2(yv(270))}" r="7" style="fill:none;stroke:#2c4e25;stroke-width:.6"/><circle cx="38" cy="${f2(yv(270))}" r="2" style="fill:#2c4e25"/>`;
    for (const [x, z, s] of [[-30, 296, "RS-232C"], [30, 296, "RS-232C"], [-34, 256, "USB"], [4, 254, "LAN"], [38, 255, "DC 12 V"]]) svg += text(x, yv(z), s, 3.4, { fill: "#59644f", weight: 600, track: 0.08 });
    for (let i = 0; i < 9; i++) svg += `<path class="iso-line" data-tone="faint" d="M-40 ${f2(yv(226 - i * 3))}H40"/>`;
    plane(shaft.back, [0, CO.back - 0.02, zc], BACK.u, BACK.v, svg, NY);
    anchors.io = [0, CO.back, 270];
  }
  // cable bundle up the column (handles and foot electrodes to the board), split for the current-path glow
  const bundleSeg = 6;
  for (let i = 0; i < bundleSeg; i++) {
    const z0 = CO.hinge + 4 + ((770 - CO.hinge - 4) * i) / bundleSeg;
    const z1 = CO.hinge + 4 + ((770 - CO.hinge - 4) * (i + 1)) / bundleSeg;
    round(`bundle.${i}`, column, up(-45, -272), z0, z1, 8, { material: "ink", tone: "hi", details: { seams: i ? [] : [z0 + 10] } });
  }
  anchors.bundle = [vx(-45), -272, 480];
  // measurement board (simplified BIA front-end + controller), near the back panel
  {
    const g = assembly("board", NY, 34, 0.2, column);
    const pcb = prismY("board.pcb", g, fillet(rect(-62, 598, 62, 784), 4), -321, -319, { material: "pcb", tone: "hi" });
    let d = "";
    for (let i = 0; i < 8; i++) d += `M${-50 + i * 5} 70V20L${-30 + i * 5} 0H${30 + i * 2}`;
    plane(pcb, [0, -318.98, 691], FRONT.u, FRONT.v, line(d, "lo"), AX.y);
    const chip = (n, X, z, w, h, label) => {
      const p = prismY(`board.${n}`, g, fillet(rect(X - w / 2, z - h / 2, X + w / 2, z + h / 2), 1), -319, -316, { material: "ink", tone: "hi", bevel: 0.3 });
      if (label) plane(p, [vx(X), -315.98, z], FRONT.u, FRONT.v, text(0, 1.3, label, 3.6, { fill: "#c9cdbf", weight: 700, track: 0.1 }), AX.y);
    };
    chip("afe", -22, 722, 34, 30, "AFE");
    chip("mcu", 26, 724, 24, 24, "MCU");
    chip("mux", -22, 670, 30, 16, "MUX");
    chip("conn", 26, 640, 34, 10);
    for (const [i, X] of [-44, -34].entries()) round(`board.cap${i}`, g, frame([vx(X), -319, 620], AX.y, AX.z), 0, 12, 4.5, { material: "alu", tone: "hi" });
    anchors.board = [0, -318, 700];
  }

  // =====================================================================
  // UPPER: LED band with smart reader, shoulders, handle holders, neck, head
  // =====================================================================
  const upper = assembly("upper", AX.z, 92, 0.04, column);
  const bandSharp = offsetPoly(colSharp, -4);
  const band = prismZ("band", upper, fillet(bandSharp, radiiBy(bandSharp, ([, y]) => (y < CO.back + 20 ? 13 : 4))), CO.shaft, CO.band, { material: "ink", tone: "hi" });
  {
    // smart reader window and the two LED light guides, drawn on the two front facets
    const ci = bandSharp.reduce((best, p, i) => (p[1] > bandSharp[best][1] ? i : best), 0);
    const P0 = bandSharp[ci];
    const nbrs = [bandSharp[(ci + 1) % bandSharp.length], bandSharp[(ci - 1 + bandSharp.length) % bandSharp.length]];
    for (const s of [1, -1]) {
      const P1 = nbrs.find((p) => Math.sign(p[0]) === s);
      const len = Math.hypot(P1[0] - P0[0], P1[1] - P0[1]);
      const dir = [(P1[0] - P0[0]) / len, (P1[1] - P0[1]) / len]; // in (X, y)
      const outward = unit([vx(-dir[1] * s), dir[0] * s, 0]);
      const o = [vx(P0[0]), P0[1], (CO.shaft + CO.band) / 2];
      const uDir = [vx(dir[0]), dir[1], 0]; // along the facet, away from the crease
      const right = s > 0 ? uDir : mul(uDir, -1); // drawing right = viewer right
      let svg = "";
      // half of the reader window (touches the crease at x = 0)
      const w = 24;
      const xs = s > 0 ? [0, w] : [-w, 0];
      svg += `<path d="M${xs[0]} -8H${xs[1]}V8H${xs[0]}Z" style="fill:#0a0f09;stroke:#59644f;stroke-width:.4"/>`;
      svg += `<path d="M0 -5.2A5.2 5.2 0 0 ${s > 0 ? 1 : 0} 0 5.2Z" style="fill:#3e4b3b"/>`;
      // LED light guide near the outer end of the facet
      const lx = s > 0 ? [len - 26, len - 6] : [-len + 6, -len + 26];
      svg += `<path class="ar-led" d="M${f2(lx[0])} -2.2H${f2(lx[1])}V2.2H${f2(lx[0])}Z"/>`;
      plane(band, add(o, mul(outward, 0.03)), right, [0, 0, -1], svg, outward);
    }
    anchors.reader = [0, CO.front - 4, (CO.shaft + CO.band) / 2];
  }
  // shoulders: the wider top of the column that carries the hand-electrode holders
  const shoulderPoly = fillet(rect(-103, CO.band, 103, CO.shoulder), [14, 14, 38, 38]);
  const shoulder = prismY("shoulder", upper, shoulderPoly, CO.back - 5, -175, { material: "shell", tone: "hi", crease: "faint", bevel: 2.5 });
  void shoulder;
  anchors.shoulder = [0, -175, 900];
  // neck: black wedge under the tilted head (top follows the head's back plane)
  const backZ = (y, s = -46) => {
    const v = (y - HO[1] - s * cT) / sT;
    return HO[2] - cT * v + s * sT;
  };
  prismX("neck", upper, [[-296, CO.shoulder], [-200, CO.shoulder], [-200, backZ(-200) - 0.6], [-258, backZ(-258) - 0.6]], -62, 62, { material: "ink", tone: "hi" });
  // hand-electrode holders on each shoulder, joints and cable ferrules
  const PIVOT = { X: 137, y: -235, z: 815 };
  for (const s of [1, -1]) {
    const side = s > 0 ? "R" : "L";
    const g = assembly(`holder.${side}`, s > 0 ? NX : AX.x, 50, 0.12, upper);
    const podPts = [[108, 930], [158, 926], [152, 848], [141, 836], [127, 838], [112, 858]].map(([X, z]) => [s * X, z]);
    prismY(`holder.${side}`, g, fillet(podPts, [6, 12, 8, 5, 5, 6]), -272, -198, { material: "shell", tone: "hi", bevel: 3 });
    prismY(`holder.${side}.joint`, g, rect(s * 103, 866, s * 108, 922), -262, -208, { material: "ink", tone: "hi" });
    round(`holder.${side}.ferrule`, g, frame([vx(s * PIVOT.X), PIVOT.y, 836], NZ, AX.x), 0, 12, 7.5, { material: "ink", tone: "hi" });
  }

  // ---------- hand electrodes (thumb + palm), hanging at rest, swing forward when held ----------
  const CABLE_SEG = 5;
  for (const s of [1, -1]) {
    const side = s > 0 ? "R" : "L";
    const slideG = assembly(`hand.${side}`, s > 0 ? NX : AX.x, 108, 0.08, upper);
    const piv = [vx(s * PIVOT.X), PIVOT.y, PIVOT.z];
    const sw = hinge(`swing.${side}`, slideG, piv, AX.x, [0, 86]);
    const F = frame(piv, NZ, AX.x);
    part(T.ball({ name: `hand.${side}.joint`, group: sw, layer: L, c: piv, r: 6, material: "ink", tone: "hi" }));
    for (let i = 0; i < CABLE_SEG; i++) round(`hand.${side}.cable.${i}`, sw, F, 6 + i * 40, 6 + (i + 1) * 40, 5.5, { material: "ink", tone: "hi", crease: "faint" });
    round(`hand.${side}.collar`, sw, F, 206, 212, 14, { material: "ink", tone: "hi" });
    const thumb = round(`hand.${side}.thumb`, sw, F, 212, 256, [16.5, 17], { material: "polish", tone: "hi" });
    const palm = round(`hand.${side}.palm`, sw, F, 256, 360, [17, 16], { material: "electrode", tone: "hi", details: { seams: [] } });
    round(`hand.${side}.cap`, sw, F, 360, 363, 16, { material: "ink", tone: "hi", ends: ["flat", "dome"] });
    // thumb electrode: the dished oval on the front of the chrome collar
    plane(
      thumb,
      [piv[0], piv[1] + 17.02, piv[2] - 233],
      FRONT.u,
      FRONT.v,
      `<ellipse class="ar-thumb" cx="0" cy="0" rx="7.4" ry="14.2"/><ellipse cx="0" cy=".8" rx="5.6" ry="11.6" style="fill:#1f2a1c;opacity:.14"/><ellipse cx="0" cy="0" rx="7.4" ry="14.2" style="fill:none;stroke:#1f2a1c;stroke-width:.7"/><path d="M-3.6 -9.8A6 12 0 0 1 3.4 -9.4" style="fill:none;stroke:#ffffff;stroke-width:.9;opacity:.9"/>`,
      AX.y,
    );
    // underside stripe on the palm grip
    plane(palm, [piv[0], piv[1] - 16.52, piv[2] - 308], BACK.u, BACK.v, `<path d="M-4.5 -46H4.5V46H-4.5Z" style="fill:#1b2419"/>`, NY);
    anchors[`thumb.${side}`] = [piv[0], piv[1] + 17, piv[2] - 233];
    anchors[`palm.${side}`] = [piv[0], piv[1] + 16, piv[2] - 308];
    anchors[`hand.${side}`] = [piv[0], piv[1], piv[2] - 280];
    // the same points with the grip held (swing 80°): along (0, sin, -cos) from the pivot
    const held = (d, off = [0, 0, 0]) => add(add(piv, mul([0, Math.sin((80 * Math.PI) / 180), -Math.cos((80 * Math.PI) / 180)], d)), off);
    anchors[`thumb.${side}.held`] = held(233, [0, 0, 17]);
    anchors[`palm.${side}.held`] = held(308, [0, 0, 16]);
    anchors[`hand.${side}.held`] = held(280);
  }

  // ---------- head: back shell, rim, glass, LCD, keypad board, main board ----------
  const head = assembly("head", [0, 0.32, 1], 86, 0.02, upper);
  const headSharp = [[-138, -135], [138, -135], [128, 108], [0, 135], [-128, 108]];
  const headOutline = fillet(headSharp, [30, 30, 22, 90, 22]);
  const backG = assembly("head.back", mul(HN, -1), 40, 0.14, head);
  const headBack = prismH("head.back", backG, headOutline, -46, -30, { material: "shell", tone: "hi", crease: "faint" });
  {
    // speaker grille for the voice guidance (position assumed)
    let dots = "";
    for (let i = -4; i <= 4; i++) for (let j = -2; j <= 2; j++) dots += `<circle cx="${i * 5}" cy="${j * 5}" r="1" style="fill:#8e9884"/>`;
    plane(headBack, headPt(0, 40, -46.02), [1, 0, 0], HVD, dots, mul(HN, -1));
  }
  const headCavity = [[-116, -118], [116, -118], [116, 86], [-116, 86]];
  ringPieces(ccw(headOutline), headCavity, headSharp.filter((_, i) => i !== 3)).forEach((poly, i) => {
    const p = prismH(`head.rim.${["top", "R", "bottom", "L"][i]}`, head, poly, -30, 0, { material: "shell", tone: "hi", crease: "faint" });
    if (i === 2) {
      // chrome trim line along the lower lip
      const lip = `<path d="M-127 9L0 25L127 9" style="fill:none;stroke:#a9b09f;stroke-width:1.1"/>`;
      plane(p, headPt(0, 98, 0.02), HEADFACE.u, HEADFACE.v, lip, HN);
    }
  });
  const lcdG = assembly("head.lcd", HN, 52, 0.08, head);
  prismH("head.lcd", lcdG, rect(-114, -116, 114, 16), -14, 0, { material: "screen", tone: "hi" });
  prismH("head.keypad-board", lcdG, rect(-112, 24, 112, 84), -5, 0, { material: "pcb", tone: "hi" });
  const mbG = assembly("head.mainboard", HN, 22, 0.17, head);
  const mb = prismH("head.mainboard", mbG, fillet(rect(-108, -112, 108, 82), 4), -28, -25, { material: "pcb", tone: "hi" });
  {
    let d = "";
    for (let i = 0; i < 10; i++) d += `M${-80 + i * 5} -60V-20L${-60 + i * 5} 0H${20 + i * 3}`;
    plane(mb, headPt(0, -15, -24.98), HEADFACE.u, HEADFACE.v, line(d, "lo"), HN);
    const chip = (n, X, v, w, h, label) => {
      const p = prismH(`head.${n}`, mbG, fillet(rect(X - w / 2, v - h / 2, X + w / 2, v + h / 2), 1), -25, -22, { material: "ink", tone: "hi", bevel: 0.3 });
      if (label) plane(p, headPt(X, v, -21.98), HEADFACE.u, HEADFACE.v, text(0, 1.3, label, 4, { fill: "#c9cdbf", weight: 700, track: 0.1 }), HN);
    };
    chip("soc", -40, -50, 30, 30, "SoC");
    chip("ram", 8, -50, 26, 14, "RAM");
    chip("flash", 8, -26, 20, 12);
    chip("wifi", 60, -40, 22, 22, "Wi-Fi");
    chip("conn", 50, 50, 40, 9);
  }
  const glassG = assembly("head.glass", HN, 84, 0.0, head);
  const glassPoly = fillet([[-132, -130], [132, -130], [123, 94], [0, 112], [-123, 94]], [26, 26, 16, 70, 16]);
  const glass = prismH("head.glass", glassG, glassPoly, 0, 2.5, { material: "screen", tone: "hi", bevel: 0.6 });
  {
    // screen (217.5 × 136 mm active area of a 10.1" 1280 × 800 panel) and the keypad, drawn on the glass
    const SW = 217.5;
    const SH = 136;
    const top = -124;
    const sx0 = -SW / 2;
    let svg = "";
    svg += `<path d="${rrect(sx0, top, SW / 2, top + SH, 1.5)}" style="fill:#0e150d"/>`;
    svg += `<path d="M${f2(sx0 + 40)} ${top}L${f2(sx0 + 92)} ${top}L${f2(sx0 + 30)} ${top + SH}L${f2(sx0 - 22 < sx0 ? sx0 : sx0 - 22)} ${top + SH}Z" style="fill:#ffffff;opacity:calc(.05 * (1 - var(--screen,0)))"/>`;
    // screen-on content: a measurement view drawn in Optimal's palette (generic, not the maker's UI)
    let on = `<path d="${rrect(sx0, top, SW / 2, top + SH, 1.5)}" style="fill:#fffcf7"/>`;
    on += text(sx0 + 12, top + 17, "Measuring", 9.5, { fill: "#2c4e25", anchor: "start", weight: 600, track: 0, style: "opacity:calc(1 - var(--done,0))" });
    on += text(sx0 + 12, top + 17, "Complete", 9.5, { fill: "#2c4e25", anchor: "start", weight: 600, track: 0, style: "opacity:var(--done,0)" });
    on += text(sx0 + 12, top + 27, "20 impedance readings", 5, { fill: "#8e9884", anchor: "start", weight: 500, track: 0.02 });
    const freqs = ["5", "50", "250", "500"];
    const segs = ["Right arm", "Left arm", "Trunk", "Right leg", "Left leg"];
    const gx0 = sx0 + 60;
    const gw = 34;
    for (let j = 0; j < 4; j++) {
      on += text(gx0 + gw * j + gw / 2, top + 44, `${freqs[j]} kHz`, 5.2, { fill: "#2c4e25", weight: 600, track: 0.02, style: `opacity:calc(.45 + .55 * var(--f${j},0))` });
    }
    for (let i = 0; i < 5; i++) {
      const y = top + 54 + i * 14;
      on += text(sx0 + 12, y + 6, segs[i], 5, { fill: "#3e3d39", anchor: "start", weight: 500, track: 0 });
      for (let j = 0; j < 4; j++) {
        const k = j * 5 + i;
        on += `<path d="${rrect(gx0 + gw * j + 4, y, gx0 + gw * j + gw - 4, y + 8, 2)}" style="fill:#e2eddf"/>`;
        on += `<path d="${rrect(gx0 + gw * j + 4, y, gx0 + gw * j + gw - 4, y + 8, 2)}" style="fill:#2c4e25;opacity:clamp(0,calc(var(--meas,0) * 20 - ${k}),1)"/>`;
      }
    }
    // progress bar
    on += `<path d="${rrect(sx0 + 12, top + SH - 12, SW / 2 - 12, top + SH - 8, 2)}" style="fill:#e2eddf"/>`;
    on += `<path d="M${f2(sx0 + 12)} ${f2(top + SH - 12)}h${f2(SW - 24)}v4h${f2(-(SW - 24))}z" style="fill:#a9d49c;transform-origin:${f2(sx0 + 12)}px 0;transform:scaleX(var(--meas,0))"/>`;
    svg += `<g style="opacity:var(--screen,0)">${on}</g>`;
    svg += `<path d="${rrect(sx0, top, SW / 2, top + SH, 1.5)}" style="fill:none;stroke:#3e4b3b;stroke-width:.5"/>`;
    // keypad: Setup, Function, Print, power (position estimated) · 1–9 . 0 Delete · Male, Female, Enter
    const key = (x0, y0, w, h, label, size = 3.3) =>
      `<path d="${rrect(x0, y0, x0 + w, y0 + h, 1.6)}" style="fill:#18211a;stroke:#5b6553;stroke-width:.45"/>` + (label ? text(x0 + w / 2, y0 + h / 2 + size * 0.36, label, size, { fill: "#c9cdbf", weight: 500, track: 0.03 }) : "");
    const ky = 26;
    const kh = 11;
    const gap = 3.6;
    svg += key(-112, ky, 24, kh, "Setup") + key(-85, ky, 26, kh, "Function") + key(-85, ky + kh + gap, 26, kh, "Print");
    svg += `<path d="${rrect(-112, ky + kh + gap, -88, ky + 2 * kh + gap, 1.6)}" style="fill:#18211a;stroke:#5b6553;stroke-width:.45"/><path d="M-100 ${f2(ky + kh + gap + 3)}V${f2(ky + kh + gap + 5.6)}M-102.4 ${f2(ky + kh + gap + 4)}A3.2 3.2 0 1 0 -97.6 ${f2(ky + kh + gap + 4)}" style="fill:none;stroke:#c9cdbf;stroke-width:.5;stroke-linecap:round"/>`;
    const nums = [["1", "2", "3"], ["4", "5", "6"], ["7", "8", "9"], [".", "0", "Delete"]];
    for (let r = 0; r < 4; r++) for (let c = 0; c < 3; c++) svg += key(-38 + c * 25, ky + r * (kh + gap) * 0.88, 22, kh * 0.86, nums[r][c], nums[r][c].length > 1 ? 2.9 : 4.2);
    svg += key(50, ky, 28, kh, "Male") + key(81, ky, 30, kh, "Female") + key(50, ky + kh + gap, 28, 2 * kh + gap, "Enter");
    plane(glass, headPt(0, 0, 2.52), HEADFACE.u, HEADFACE.v, svg, HN, [0.02, 0.2]);
  }
  anchors.screen = headPt(0, -56, 2.5);
  anchors.keypad = headPt(-20, 50, 2.5);
  anchors.head = headPt(0, -20, 0);

  anchors.body = [0, -60, 560];
  anchors.column = [0, CO.yc, 520];
  anchors.feature = [0, -150, 720];
  anchors.plate = [0, 120, PL.top];
  for (let i = 0; i <= 8; i++) features.push({ "swing.R": i * 10.75, "swing.L": i * 10.75 });
  return { parts, groups, explode, root, anchors, features, counts: { electrodes: 8, frequencies: 4 } };
}
export function explodeValues(explode, apart, { stretch = 0.55 } = {}) {
  const out = {};
  for (const { name, travel, delay } of explode) {
    const t = Math.max(0, Math.min(1, (apart - delay * stretch) / (1 - stretch)));
    out[name] = travel * t * t * (3 - 2 * t);
  }
  return out;
}
