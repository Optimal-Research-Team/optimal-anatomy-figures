// A5 · The air sac and the red cell (anatomical series).
//
// A cut-away block of lung tissue in isometric 3-D. The lung is a foam of air sacs (alveoli)
// with thin walls; the front, top and end faces of the block are true sections through one 3-D
// foam (a Voronoi packing), so the air spaces meet across every edge. The front face cuts one air
// sac through its middle: we look into its bowl, lined with its capillary net, and an alveolar
// duct rises from its mouth to the top of the block. One capillary runs in the sac's wall across
// the front, from a pulmonary arteriole (left) to a venule (right). Each red cell's colour comes
// from the model: oxygen pressure rises toward the alveolar value within about a quarter of a
// second, so at rest the cells turn red in the first third of the trip; in hard exercise they pass
// faster and turn red later, but still before they leave. A monitor underneath plots the tracked
// cell's oxygen against its time in the capillary, with the exit marked.
//
//   node build.mjs | --light
import { mkdirSync, readFileSync, writeFileSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";
import { plate, page, embed } from "../../shared/page.mjs";
import { figkit, k } from "../../shared/figkit.mjs";
import * as M from "./model.mjs";

const HERE = dirname(fileURLToPath(import.meta.url));
const THEME = process.argv.includes("--light") ? "light" : "dark";
const SLUG = "alveolus";
const W = 600;
const RAD = Math.PI / 180;
const f1 = (v) => v.toFixed(1);
const rng = (() => {
  let s = 7;
  return () => ((s = (s * 16807) % 2147483647) - 1) / 2147483646;
})();
function smooth(points, closed = true, kk = 1) {
  const n = points.length;
  const at = (i) => points[closed ? (i + n) % n : Math.max(0, Math.min(n - 1, i))];
  let d = `M${f1(points[0][0])} ${f1(points[0][1])}`;
  for (let i = 0; i < (closed ? n : n - 1); i++) {
    const p0 = at(i - 1), p1 = at(i), p2 = at(i + 1), p3 = at(i + 2);
    d += `C${f1(p1[0] + ((p2[0] - p0[0]) / 6) * kk)} ${f1(p1[1] + ((p2[1] - p0[1]) / 6) * kk)} ${f1(p2[0] - ((p3[0] - p1[0]) / 6) * kk)} ${f1(p2[1] - ((p3[1] - p1[1]) / 6) * kk)} ${f1(p2[0])} ${f1(p2[1])}`;
  }
  return d + (closed ? "Z" : "");
}
const dot = (x, y, r) => `M${f1(x - r)} ${f1(y)}a${r} ${r} 0 1 0 ${2 * r} 0a${r} ${r} 0 1 0 ${-2 * r} 0`;

// ---------------------------------------------------------------- the block (section px; x along, y back into the lung, z up)
const X0 = 20;
const X1 = 580;
const YT = 40; //  top of the block, as a section y
const YB = 380; // bottom
const L = X1 - X0;
const HF = YB - YT;
const D = 180;
const W3 = (sx, y, sy) => [sx - X0, y, YB - sy];
const C = [300, 222]; // the opened air sac, centred on the front face
const R = 108;
const RING = 16; //       its wall, mostly capillary
const DUCT = { x: 300, r: 30, sleeve: 12 };

// ---------------------------------------------------------------- the foam: a 3-D Voronoi packing of air sacs
const seeds = [];
{
  const MIN = 78;
  const Cw = W3(C[0], D, C[1]);
  for (let tries = 0; tries < 40000 && seeds.length < 400; tries++) {
    const p = [-70 + rng() * (L + 140), -70 + rng() * (D + 140), -70 + rng() * (HF + 140)];
    if (Math.hypot(p[0] - Cw[0], p[1] - Cw[1], p[2] - Cw[2]) < R + RING + 30) continue;
    if (p[2] > Cw[2] && Math.hypot(p[0] - Cw[0], p[1] - D) < DUCT.r + DUCT.sleeve + 34) continue;
    if (seeds.every((s) => Math.hypot(s[0] - p[0], s[1] - p[1], s[2] - p[2]) > MIN)) seeds.push(p);
  }
}
const SEPT = 4.6; // half a wall
/** The foam cut by a plane p(u, v) = o + u·eu + v·ev, over u0..u1 × v0..v1: one shrunk convex polygon per air sac. */
function sectionOf(o, eu, ev, u0, u1, v0, v1) {
  const dot3 = (a, b) => a[0] * b[0] + a[1] * b[1] + a[2] * b[2];
  const out = [];
  seeds.forEach((si, i) => {
    let poly = [[u0, v0], [u1, v0], [u1, v1], [u0, v1]];
    for (let j = 0; j < seeds.length && poly.length; j++) {
      if (j === i) continue;
      const sj = seeds[j];
      const n = [sj[0] - si[0], sj[1] - si[1], sj[2] - si[2]];
      const nl = Math.hypot(...n);
      const a = 2 * dot3(n, eu);
      const b = 2 * dot3(n, ev);
      const c = dot3(sj, sj) - dot3(si, si) - 2 * SEPT * nl - 2 * dot3(n, o);
      const next = [];
      for (let q = 0; q < poly.length; q++) {
        const P = poly[q];
        const Q = poly[(q + 1) % poly.length];
        const fp = a * P[0] + b * P[1] - c;
        const fq = a * Q[0] + b * Q[1] - c;
        if (fp <= 0) next.push(P);
        if (fp <= 0 !== fq <= 0) {
          const t = fp / (fp - fq);
          next.push([P[0] + (Q[0] - P[0]) * t, P[1] + (Q[1] - P[1]) * t]);
        }
      }
      poly = next;
    }
    if (poly.length < 3) return;
    let area = 0;
    for (let q = 0; q < poly.length; q++) area += poly[q][0] * poly[(q + 1) % poly.length][1] - poly[(q + 1) % poly.length][0] * poly[q][1];
    if (Math.abs(area) / 2 > 140) out.push({ poly, i });
  });
  return out;
}
/** A convex polygon with its corners rounded (the septal junctions thicken there). */
function rounded(poly, rmax = 10) {
  const n = poly.length;
  let d = "";
  for (let q = 0; q < n; q++) {
    const A = poly[(q + n - 1) % n];
    const B = poly[q];
    const Cc = poly[(q + 1) % n];
    const la = Math.hypot(A[0] - B[0], A[1] - B[1]);
    const lc = Math.hypot(Cc[0] - B[0], Cc[1] - B[1]);
    const r = Math.min(rmax, la * 0.42, lc * 0.42);
    const pin = [B[0] + ((A[0] - B[0]) / la) * r, B[1] + ((A[1] - B[1]) / la) * r];
    const pout = [B[0] + ((Cc[0] - B[0]) / lc) * r, B[1] + ((Cc[1] - B[1]) / lc) * r];
    d += `${q ? "L" : "M"}${f1(pin[0])} ${f1(pin[1])}Q${f1(B[0])} ${f1(B[1])} ${f1(pout[0])} ${f1(pout[1])}`;
  }
  return d + "Z";
}
/** Capillaries in the walls: red cells cut across, along each wall's middle line, never two in one spot. */
function capillariesOf(cells, u0, u1, v0, v1, keep = () => true) {
  const pts = [];
  for (const { poly } of cells) {
    const cx = poly.reduce((s, p) => s + p[0], 0) / poly.length;
    const cy = poly.reduce((s, p) => s + p[1], 0) / poly.length;
    for (let q = 0; q < poly.length; q++) {
      const A = poly[q];
      const B = poly[(q + 1) % poly.length];
      const len = Math.hypot(B[0] - A[0], B[1] - A[1]);
      if (len < 14) continue;
      let nx = -(B[1] - A[1]) / len;
      let ny = (B[0] - A[0]) / len;
      if (nx * ((A[0] + B[0]) / 2 - cx) + ny * ((A[1] + B[1]) / 2 - cy) < 0) (nx = -nx), (ny = -ny);
      for (let s = 9; s < len - 6; s += 20) {
        const x = A[0] + ((B[0] - A[0]) * s) / len + nx * SEPT;
        const y = A[1] + ((B[1] - A[1]) * s) / len + ny * SEPT;
        if (x < u0 + 5 || x > u1 - 5 || y < v0 + 5 || y > v1 - 5 || !keep(x, y)) continue;
        if (pts.some((p) => Math.hypot(p[0] - x, p[1] - y) < 13)) continue;
        pts.push([x, y]);
      }
    }
  }
  let art = "";
  let ven = "";
  pts.forEach(([x, y], i) => {
    const r = 2.7 + ((i * 7) % 5) * 0.12;
    if (i % 4 === 1) ven += dot(x, y, r);
    else art += dot(x, y, r);
  });
  return `<path class="b5-cap-a" d="${art}"/><path class="b5-cap-v" d="${ven}"/>`;
}
const foam = (cells) => cells.map((c) => rounded(c.poly)).join("");

// ---------------------------------------------------------------- the camera
const VB = { pad: 10 };
const BOUNDS3 = [[0, 0, 0], [L, 0, 0], [0, D, 0], [L, D, 0], [0, 0, HF], [L, 0, HF], [0, D, HF], [L, D, HF]];
const PB = k.fitProjection(BOUNDS3, W, 1000, { pad: VB.pad, azimuth: 62, elevation: 24 });
const ys = BOUNDS3.map((p) => k.iso(p, PB)[1]);
const shiftY = 14 - Math.min(...ys);
PB.origin = [PB.origin[0], PB.origin[1] + shiftY];
const BLOCK_BOTTOM = Math.max(...ys) + shiftY;
const FB = figkit(PB);
const at = (p) => k.iso(p, PB);
const p3 = (pts, close = true) => FB.path3(pts, close);
const pivot = at(W3((X0 + X1) / 2, D / 2, (YT + YB) / 2)).map((v) => +v.toFixed(1));

// ---------------------------------------------------------------- the traced capillary: arteriole → round the sac's lower wall → venule
const RHO = R + RING / 2;
const TH0 = 160;
const TH1 = 20;
const arc = [];
for (let th = TH0; th >= TH1 - 1e-9; th -= 1) arc.push([C[0] + RHO * Math.cos(th * RAD), C[1] + RHO * Math.sin(th * RAD)]);
const segLen = (pts) => pts.slice(1).reduce((s, p, i) => s + Math.hypot(p[0] - pts[i][0], p[1] - pts[i][1]), 0);
const arcLen = segLen(arc);
const step = arcLen / (arc.length - 1);
const bez = (p0, p1, p2, p3_, t) => [0, 1].map((c) => (1 - t) ** 3 * p0[c] + 3 * (1 - t) ** 2 * t * p1[c] + 3 * (1 - t) * t * t * p2[c] + t ** 3 * p3_[c]);
function resample(p0, p1, p2, p3_) {
  const dense = Array.from({ length: 400 }, (_, i) => bez(p0, p1, p2, p3_, i / 399));
  const Ld = segLen(dense);
  const n = Math.max(2, Math.round(Ld / step));
  const out = [dense[0]];
  let acc = 0;
  let want = Ld / n;
  for (let i = 1; i < dense.length; i++) {
    acc += Math.hypot(dense[i][0] - dense[i - 1][0], dense[i][1] - dense[i - 1][1]);
    while (acc >= want && out.length < n) {
      out.push(dense[i]);
      want += Ld / n;
    }
  }
  out.push(dense[dense.length - 1]);
  return out;
}
const A0 = arc[0];
const A1 = arc[arc.length - 1];
const dir0 = [Math.sin(TH0 * RAD), -Math.cos(TH0 * RAD)];
const dir1 = [Math.sin(TH1 * RAD), -Math.cos(TH1 * RAD)];
const inPath = resample([-30, 150], [70, 150], [A0[0] - dir0[0] * 74, A0[1] - dir0[1] * 74], A0);
const outPath = resample(A1, [A1[0] + dir1[0] * 74, A1[1] + dir1[1] * 74], [530, 150], [630, 150]);
const PATH = [...inPath.slice(0, -1), ...arc, ...outPath.slice(1)].map((p) => [+p[0].toFixed(2), +p[1].toFixed(2)]);
const I0 = inPath.length - 1;
const I1 = I0 + arc.length - 1;
function tube(pts, w0, w1) {
  const Lp = [];
  const Rp = [];
  pts.forEach((p, i) => {
    const a = pts[Math.max(0, i - 1)];
    const b = pts[Math.min(pts.length - 1, i + 1)];
    let nx = -(b[1] - a[1]);
    let ny = b[0] - a[0];
    const l = Math.hypot(nx, ny) || 1;
    nx /= l;
    ny /= l;
    const w = (w0 + (w1 - w0) * (i / (pts.length - 1))) / 2;
    Lp.push([p[0] + nx * w, p[1] + ny * w]);
    Rp.push([p[0] - nx * w, p[1] - ny * w]);
  });
  return `M${[...Lp, ...Rp.reverse()].map((p) => `${f1(p[0])} ${f1(p[1])}`).join("L")}Z`;
}
const line = (pts) => `M${pts.map((p) => `${f1(p[0])} ${f1(p[1])}`).join("L")}`;
const arcD = line(arc);
// where the venule leaves through the right end of the block
const vAtEdge = outPath.reduce((best, p) => (Math.abs(p[0] - X1) < Math.abs(best[0] - X1) ? p : best), outPath[0]);
const vWidth = 16 + 10 * (outPath.indexOf(vAtEdge) / (outPath.length - 1));

// ---------------------------------------------------------------- front face (section coordinates)
const frontCells = sectionOf(W3(0, D, 0), [1, 0, 0], [0, 0, -1], X0, X1, YT, YB);
const inSleeve = (x, y) => Math.abs(x - DUCT.x) < DUCT.r + DUCT.sleeve && y < C[1];
const nearPath = (x, y, pts, w) => pts.some((p) => Math.hypot(p[0] - x, p[1] - y) < w);
const keepFront = (x, y) => Math.hypot(x - C[0], y - C[1]) > R + RING + 4 && !inSleeve(x, y) && !nearPath(x, y, inPath, 25) && !nearPath(x, y, outPath, 25);
const frontMask = `<mask id="b5-frontmask" maskUnits="userSpaceOnUse" x="${X0 - 2}" y="${YT - 2}" width="${L + 4}" height="${HF + 4}">
<rect x="${X0 - 2}" y="${YT - 2}" width="${L + 4}" height="${HF + 4}" fill="#fff"/>
<circle cx="${C[0]}" cy="${C[1]}" r="${R + RING}" fill="#000"/>
<rect x="${DUCT.x - DUCT.r - DUCT.sleeve}" y="${YT - 4}" width="${2 * (DUCT.r + DUCT.sleeve)}" height="${C[1] - YT}" fill="#000"/>
<path d="${line(inPath)}${line(outPath)}" fill="none" stroke="#000" stroke-width="40" stroke-linecap="round"/>
</mask>`;
// the duct: a half-pipe cut lengthwise, rising from the sac's mouth through the top of the block
const ductTop = YT;
const ductBot = C[1] - R + 10;
const ductRings = [];
for (let y = ductTop + 12; y < ductBot - 4; y += 15) ductRings.push(`M${DUCT.x - DUCT.r + 2} ${f1(y)}Q${DUCT.x} ${f1(y + 7)} ${DUCT.x + DUCT.r - 2} ${f1(y)}`);
let knobs = "";
for (let y = ductTop + 9; y < ductBot - 6; y += 17) for (const s of [-1, 1]) knobs += `M${f1(DUCT.x + s * (DUCT.r + 4.5) - 3.4)} ${f1(y)}a3.4 2.4 0 1 0 6.8 0a3.4 2.4 0 1 0 -6.8 0Z`;
const DUCT_PATH = Array.from({ length: 25 }, (_, i) => [DUCT.x, +(ductTop - 6 + ((ductBot + 18 - ductTop) * i) / 24).toFixed(1)]);
// the sac's own wall in section: flattened lining nuclei, a surfactant cell bulging in, the capillary
let rimNuclei = "";
for (const th of [205, 248, 292, 318, 344]) {
  const x = C[0] + (R + 2.5) * Math.cos(th * RAD);
  const y = C[1] + (R + 2.5) * Math.sin(th * RAD);
  rimNuclei += `<ellipse cx="${f1(x)}" cy="${f1(y)}" rx="6.2" ry="1.8" transform="rotate(${f1(th + 90)} ${f1(x)} ${f1(y)})"/>`;
}
const T2 = { th: 232 };
const t2c = [C[0] + (R - 3) * Math.cos(T2.th * RAD), C[1] + (R - 3) * Math.sin(T2.th * RAD)];
const t2Body = smooth(Array.from({ length: 9 }, (_, i) => {
  const a = (i / 9) * 2 * Math.PI;
  const m = i % 2 ? 9.5 : 10.5;
  return [t2c[0] + Math.cos(a) * m, t2c[1] + Math.sin(a) * m * 0.92];
}), true, 0.9);
let t2Gran = "";
for (let g = 0; g < 5; g++) {
  const a = rng() * 2 * Math.PI;
  const m = 2 + rng() * 5;
  t2Gran += dot(t2c[0] + Math.cos(a) * m, t2c[1] + Math.sin(a) * m, 1.4);
}
const FRONT = `<path class="b5-tissue" fill-rule="evenodd" d="M${X0} ${YT}H${X1}V${YB}H${X0}Z${dot(C[0], C[1], R)}M${DUCT.x - DUCT.r} ${YT}H${DUCT.x + DUCT.r}V${f1(ductBot)}H${DUCT.x - DUCT.r}Z"/>
<g mask="url(#b5-frontmask)"><path class="b5-air" d="${foam(frontCells)}" fill="url(#b5-cav)"/></g>
${capillariesOf(frontCells, X0, X1, YT, YB, keepFront)}
<path class="b5-duct" d="M${DUCT.x - DUCT.r} ${YT - 1}H${DUCT.x + DUCT.r}V${f1(ductBot)}H${DUCT.x - DUCT.r}Z" fill="url(#b5-trough)"/>
<path class="a5-duct-ring" d="${ductRings.join("")}"/>
<path class="b5-knob" d="${knobs}"/>
<path class="b5-duct-wall" d="M${DUCT.x - DUCT.r} ${YT}V${f1(ductBot - 6)}M${DUCT.x + DUCT.r} ${YT}V${f1(ductBot - 6)}"/>
<path data-part="ductair" class="a5-duct-air"/>
<path class="b5-sheath" d="${tube(inPath, 40, 32)}"/><path class="b5-sheath" d="${tube(outPath, 32, 42)}"/>
<path class="a5-ven-tube" d="${tube(inPath, 26, 16)}"/>
<path class="a5-art-tube" d="${tube(outPath, 16, 26)}"/>
<g data-part="cellsBack"></g>
<circle class="b5-rim" cx="${C[0]}" cy="${C[1]}" r="${R}"/>
<g class="b5-rim-nuc">${rimNuclei}</g>
<path class="a5-cap-edge" d="${arcD}"/><path class="a5-cap" d="${arcD}"/>
<path class="a5-t2" d="${t2Body}"/><path class="a5-gran" d="${t2Gran}"/>
<path data-part="air" class="a5-o2" clip-path="url(#a5-air)"/>
<path data-part="fly" class="a5-o2 a5-o2-fly"/>
<g data-part="cellsFront"></g>
<path data-part="co20" class="a5-co2"/><path data-part="co21" class="a5-co2 a5-co2-b"/><path data-part="co22" class="a5-co2 a5-co2-c"/>
<circle class="a5-track" data-part="track" r="12" cx="-40" cy="-40"/>`;

// ---------------------------------------------------------------- the bowl: the inside of the opened sac, in true projection
const Cw = W3(C[0], D, C[1]);
const onBowl = (Ld, lam, r = R) => at([Cw[0] + r * Math.cos(Ld * RAD) * Math.sin(lam * RAD), Cw[1] - r * Math.cos(Ld * RAD) * Math.cos(lam * RAD), Cw[2] + r * Math.sin(Ld * RAD)]);
const opening = Array.from({ length: 96 }, (_, i) => at(W3(C[0] + R * Math.cos((i / 96) * 2 * Math.PI), D, C[1] + R * Math.sin((i / 96) * 2 * Math.PI))));
const openingD = `M${opening.map((p) => `${f1(p[0])} ${f1(p[1])}`).join("L")}Z`;
let bowlNet = "";
const NET_LATS = [-70, -54, -38, -22, -6, 10, 26, 42, 58];
const NET_LONS = [-80, -62, -44, -26, -8, 10, 28, 46, 64, 82];
for (const Ld of NET_LATS) {
  const s = [];
  for (let lam = -90; lam <= 90; lam += 3) s.push(onBowl(Ld + 2.2 * Math.sin((lam * 5 + Ld * 7) * RAD), lam));
  bowlNet += line(s);
}
for (let i = 0; i < NET_LATS.length - 1; i++)
  NET_LONS.forEach((lam, j) => {
    if ((i + j) % 2) return;
    const s = [];
    for (let q = 0; q <= 10; q++) s.push(onBowl(NET_LATS[i] + ((NET_LATS[i + 1] - NET_LATS[i]) * q) / 10, lam + 3 * Math.sin((q / 10) * 2 * Math.PI + i + j)));
    bowlNet += line(s);
  });
// lining details on the inner wall: pavement-cell outlines, a surfactant cell, a macrophage, two pores to the neighbours
const tangentPatch = (Ld, lam, pts) => {
  const o = [Cw[0] + R * Math.cos(Ld * RAD) * Math.sin(lam * RAD), Cw[1] - R * Math.cos(Ld * RAD) * Math.cos(lam * RAD), Cw[2] + R * Math.sin(Ld * RAD)];
  const e = [Math.cos(lam * RAD), Math.sin(lam * RAD), 0];
  const n = [-Math.sin(Ld * RAD) * Math.sin(lam * RAD), Math.sin(Ld * RAD) * Math.cos(lam * RAD), Math.cos(Ld * RAD)];
  return pts.map(([a, b]) => at([o[0] + e[0] * a + n[0] * b, o[1] + e[1] * a + n[1] * b, o[2] + e[2] * a + n[2] * b]));
};
let pave = "";
const NF = 150;
for (let i = 0; i < NF; i++) {
  const y = 1 - (2 * (i + 0.5)) / NF;
  const Ld = Math.asin(y) / RAD;
  const lam = ((i * 137.508) % 180) - 90;
  if (Ld > 62 || Math.abs(lam) > 80) continue;
  const blob = Array.from({ length: 6 }, (_, q) => {
    const a = (q / 6) * 2 * Math.PI + rng() * 0.5;
    const m = 12.5 * (0.82 + rng() * 0.3);
    return [Math.cos(a) * m, Math.sin(a) * m];
  });
  pave += smooth(tangentPatch(Ld, lam, blob), true, 0.9);
}
const mac = smooth(tangentPatch(-38, 18, Array.from({ length: 11 }, (_, q) => {
  const a = (q / 11) * 2 * Math.PI;
  const m = 13 * (q % 3 === 0 ? 1.35 : 0.8 + rng() * 0.2);
  return [Math.cos(a) * m, Math.sin(a) * m];
})), true, 0.85);
const macNuc = smooth(tangentPatch(-38, 18, [[-4.5, -2], [-1, -4], [3.6, -2.7], [5, 1], [1.8, 3.2], [-1.8, 1.4], [-4.5, 2.7]]), true, 0.9);
const t2Bowl = smooth(tangentPatch(24, -30, Array.from({ length: 8 }, (_, q) => {
  const a = (q / 8) * 2 * Math.PI;
  return [Math.cos(a) * 10, Math.sin(a) * 8.5];
})), true, 0.9);
let t2BowlGran = "";
for (let g = 0; g < 6; g++) {
  const a = rng() * 2 * Math.PI;
  const m = 2 + rng() * 5;
  const q = tangentPatch(24, -30, [[Math.cos(a) * m, Math.sin(a) * m * 0.8]])[0];
  t2BowlGran += dot(q[0], q[1], 1.3);
}
const pores = [[6, 40], [-20, -52]].map(([Ld, lam]) => smooth(tangentPatch(Ld, lam, Array.from({ length: 8 }, (_, q) => [Math.cos((q / 8) * 2 * Math.PI) * 4.2, Math.sin((q / 8) * 2 * Math.PI) * 3.4])), true, 0.9)).join("");
const a0s = at(W3(A0[0], D, A0[1]))[0];
const a1s = at(W3(A1[0], D, A1[1]))[0];
const BOWL = `<g clip-path="url(#b5-opening)">
<path class="b5-bowl" d="${openingD}" fill="url(#b5-bowl)"/>
<path class="a5-pave" d="${pave}"/>
<path class="a5-net-edge b5-bowl-net" d="${bowlNet}"/><path class="a5-net b5-bowl-net" d="${bowlNet}"/>
<path class="b5-pore" d="${pores}"/>
<path class="a5-t2" d="${t2Bowl}"/><path class="a5-gran" d="${t2BowlGran}"/>
<path class="a5-mac" d="${mac}"/><path class="a5-mac-nuc" d="${macNuc}"/>
<path class="b5-bowl-shade" d="${openingD}"/>
</g>`;

// ---------------------------------------------------------------- top face (u = section x, v = depth from the back)
const topCells = sectionOf(W3(0, 0, YT), [1, 0, 0], [0, 1, 0], X0, X1, 0, D);
const keepTop = (x, v) => Math.hypot(x - DUCT.x, v - D) > DUCT.r + DUCT.sleeve + 3;
let topKnobs = "";
for (let a = 200; a <= 340; a += 23) {
  const x = DUCT.x + (DUCT.r + 4.5) * Math.cos(a * RAD);
  const v = D + (DUCT.r + 4.5) * Math.sin(a * RAD);
  topKnobs += `<ellipse cx="${f1(x)}" cy="${f1(v)}" rx="3.4" ry="2.4" transform="rotate(${f1(a + 90)} ${f1(x)} ${f1(v)})"/>`;
}
const TOP_FACE = `<g transform="${FB.planeMatrix(W3(0, 0, YT), [1, 0, 0], [0, 1, 0])}">
<mask id="b5-topmask" maskUnits="userSpaceOnUse" x="${X0 - 2}" y="-2" width="${L + 4}" height="${D + 4}"><rect x="${X0 - 2}" y="-2" width="${L + 4}" height="${D + 4}" fill="#fff"/><circle cx="${DUCT.x}" cy="${D}" r="${DUCT.r + DUCT.sleeve}" fill="#000"/></mask>
<rect class="b5-tissue" x="${X0}" y="0" width="${L}" height="${D}"/>
<g mask="url(#b5-topmask)"><path class="b5-air" d="${foam(topCells)}" fill="url(#b5-cav)"/></g>
${capillariesOf(topCells, X0, X1, 0, D, keepTop)}
<path class="b5-shaft" d="M${DUCT.x - DUCT.r} ${D}A${DUCT.r} ${DUCT.r} 0 0 1 ${DUCT.x + DUCT.r} ${D}Z" fill="url(#b5-shaft)"/>
<g class="b5-knob">${topKnobs}</g>
<rect class="b5-top-light" x="${X0}" y="0" width="${L}" height="${D}"/>
</g>`;

// ---------------------------------------------------------------- right end (u = depth from the front edge, v = section y)
const endCells = sectionOf(W3(X1, D, 0), [0, -1, 0], [0, 0, -1], 0, D, YT, YB);
const VR = vWidth / 2;
const keepEnd = (u, y) => Math.hypot(u, y - vAtEdge[1]) > VR + 16;
const END_FACE = `<g transform="${FB.planeMatrix(W3(X1, D, 0), [0, -1, 0], [0, 0, -1])}">
<mask id="b5-endmask" maskUnits="userSpaceOnUse" x="-2" y="${YT - 2}" width="${D + 4}" height="${HF + 4}"><rect x="-2" y="${YT - 2}" width="${D + 4}" height="${HF + 4}" fill="#fff"/><circle cx="0" cy="${f1(vAtEdge[1])}" r="${f1(VR + 14)}" fill="#000"/></mask>
<rect class="b5-tissue" x="0" y="${YT}" width="${D}" height="${HF}"/>
<g mask="url(#b5-endmask)"><path class="b5-air" d="${foam(endCells)}" fill="url(#b5-cav)"/></g>
${capillariesOf(endCells, 0, D, YT, YB, keepEnd)}
<path class="a5-art-tube" d="M0 ${f1(vAtEdge[1] - VR)}A${f1(VR)} ${f1(VR)} 0 0 1 0 ${f1(vAtEdge[1] + VR)}Z"/>
<path class="b5-cap-a" d="${dot(4.5, vAtEdge[1] - 3, 3.3)}${dot(7, vAtEdge[1] + 5, 3)}"/>
<rect class="b5-end-shade" x="0" y="${YT}" width="${D}" height="${HF}"/>
</g>`;

const shadow = `<path class="b5-shadow" d="${p3([[-8, -6, 0], [L + 12, -6, 0], [L + 12, D + 16, 0], [-8, D + 16, 0]])}"/>`;
const edges = `<path class="b5-edge" d="${p3([W3(X0, 0, YT), W3(X1, 0, YT), W3(X1, D, YT), W3(X0, D, YT)])}${p3([W3(X1, 0, YT), W3(X1, 0, YB), W3(X1, D, YB)], false)}${p3([W3(X0, D, YT), W3(X0, D, YB), W3(X1, D, YB), W3(X1, D, YT)], false)}"/>`;
const FRONT_M = FB.planeMatrix(W3(0, D, 0), [1, 0, 0], [0, 0, -1]);

// ---------------------------------------------------------------- the monitor (flat, under the block)
const PY = Math.ceil(BLOCK_BOTTOM + 22);
const PLOT = { x0: 92, x1: 556, tMax: 0.8, y0: PY + 152, y1: PY + 54, box: [20, PY, 560, 196] };
const H = PY + 196 + 4;
const xOf = (t) => PLOT.x0 + (t / PLOT.tMax) * (PLOT.x1 - PLOT.x0);
const yOf = (s) => PLOT.y0 - s * (PLOT.y0 - PLOT.y1);
const ticks = [0, 0.25, 0.5, 0.75]
  .map((t, i, a) => `<path class="a5-axis" d="M${f1(xOf(t))} ${PLOT.y0}v6"/><text class="a5-tick" x="${f1(xOf(t))}" y="${PLOT.y0 + 28}" text-anchor="${i === 0 ? "start" : "middle"}">${t === 0 ? "0" : t}${i === a.length - 1 ? " s" : ""}</text>`)
  .join("");
const plotSvg = `<g class="a5-plot">
<rect class="a5-plot-bg" x="${PLOT.box[0]}" y="${PLOT.box[1]}" width="${PLOT.box[2]}" height="${PLOT.box[3]}" rx="12"/>
<text class="a5-plot-title" x="${PLOT.box[0] + 22}" y="${PLOT.box[1] + 32}">Oxygen in the traced cell</text>
<rect class="a5-spare" data-part="spare" x="0" y="${PLOT.y1}" width="0" height="${PLOT.y0 - PLOT.y1}"/>
<text class="a5-spare-txt" data-part="sparetxt" x="0" y="${PLOT.y0 - 12}" text-anchor="middle">to spare</text>
<path class="a5-grid" d="M${PLOT.x0} ${f1(yOf(0.5))}H${PLOT.x1}M${PLOT.x0} ${f1(yOf(1))}H${PLOT.x1}"/>
<path class="a5-axis" d="M${PLOT.x0} ${PLOT.y0}H${PLOT.x1}"/>
<text class="a5-tick" x="${PLOT.x0 - 10}" y="${f1(yOf(1) + 6)}" text-anchor="end">100%</text>
<text class="a5-tick" x="${PLOT.x0 - 10}" y="${f1(yOf(0.5) + 6)}" text-anchor="end">50%</text>
${ticks}
<path class="a5-curve-ghost" data-part="ghost"/>
<path class="a5-curve" data-part="curve"/>
<g data-part="exit"><path class="a5-exit" d="M0 ${PLOT.y0}V${PLOT.y1 - 6}"/><ellipse class="a5-exit-cell" cx="0" cy="${PLOT.y1 - 12}" rx="9" ry="5.6"/></g>
<circle class="a5-start" data-part="start" r="4.5"/>
<circle class="a5-dot" data-part="dot" r="6.5"/>
</g>`;

// ---------------------------------------------------------------- the picture
const svg = `<svg class="iso-svg a5-svg" viewBox="0 0 ${W} ${H}" role="img" aria-label="A block of lung tissue, cut open. The lung is a foam of tiny air sacs with thin walls full of capillaries. The front of the block cuts one air sac in half, so we look into its bowl, lined with a net of capillaries, with a small airway rising from its mouth to the top of the block. One capillary runs in the sac's wall across the front, carrying red cells in single file from a small artery on the left to a small vein on the right. Oxygen from the air inside the sac crosses into each cell, which turns from blue to red within the first part of its trip; carbon dioxide leaves the other way. A monitor underneath plots the oxygen in one traced cell against its time in the capillary, and marks when it leaves.">
<defs>
  <radialGradient id="b5-cav" cx="58%" cy="66%" r="72%"><stop offset="0" class="b5-c0"/><stop offset="0.62" class="b5-c1"/><stop offset="1" class="b5-c2"/></radialGradient>
  <linearGradient id="b5-bowl" x1="0" y1="0" x2="0.25" y2="1"><stop offset="0" class="b5-b0"/><stop offset="0.55" class="b5-b1"/><stop offset="1" class="b5-b2"/></linearGradient>
  <linearGradient id="b5-trough" x1="0" y1="0" x2="1" y2="0"><stop offset="0" class="b5-c2"/><stop offset="0.5" class="b5-c0"/><stop offset="1" class="b5-c2"/></linearGradient>
  <radialGradient id="b5-shaft" cx="50%" cy="100%" r="100%"><stop offset="0" class="b5-sh0"/><stop offset="1" class="b5-c2"/></radialGradient>
  <linearGradient id="a5-net" gradientUnits="userSpaceOnUse" x1="${f1(a0s)}" y1="0" x2="${f1(a1s)}" y2="0"><stop offset="0" class="a5-ven-stop"/><stop data-part="netA" offset="0.3" class="a5-ven-stop"/><stop data-part="netB" offset="0.42" class="a5-art-stop"/><stop offset="1" class="a5-art-stop"/></linearGradient>
  <clipPath id="b5-opening"><path d="${openingD}"/></clipPath>
</defs>
${shadow}
<g data-part="sac">
${TOP_FACE}
${END_FACE}
${BOWL}
<g class="b5-front" transform="${FRONT_M}">
  <defs>${frontMask}<clipPath id="a5-air"><circle cx="${C[0]}" cy="${C[1]}" r="${R - 6}"/></clipPath><clipPath id="b5-frontclip"><rect x="${X0}" y="${YT - 60}" width="${L}" height="${HF + 60}"/></clipPath></defs>
  <g clip-path="url(#b5-frontclip)">${FRONT}</g>
</g>
${edges}
</g>
${plotSvg}
</svg>`;

const LINES = [
  "Resting: each red cell spends about three-quarters of a second beside the air sacs, and is full within the first third of it.",
  "Walking: blood flows twice as fast, but more capillaries open, so each cell still has time to spare.",
  "Running: about a third of a second in the capillary, still longer than loading takes.",
  "All out: cells arrive emptier and leave sooner. In healthy lungs they still fill before they go.",
];
const DATA = { C, R, path: PATH, i0: I0, i1: I1, step, plot: { ...PLOT }, lines: LINES, a0x: A0[0], a1x: A1[0], top: [DUCT.x, C[1] - R + 14], duct: DUCT_PATH, pivot };
const strip = (src) => src.replace(/^import .*$/gm, "").replace(/^export /gm, "");
const SCRIPT = `${strip(readFileSync(join(HERE, "model.mjs"), "utf8"))}\n${readFileSync(join(HERE, "live.js"), "utf8").replace("__DATA__", JSON.stringify(DATA))}`;
const CSS = readFileSync(join(HERE, "figure.css"), "utf8") + readFileSync(join(HERE, "block.css"), "utf8");
const rest = M.LUNG.states[0];
const sIn = (s) => Math.round(100 * M.satOf(s.pv));
const sOut = (s) => Math.round(100 * M.satOf(M.po2At(M.transitOf(s.co), s.pv)));
const top4 = M.LUNG.states[3];
const CAPTION = [
  `Every breath refills hundreds of millions of tiny air sacs, packed like foam, each wrapped in a net of capillaries so narrow that red cells pass in single file. Oxygen crosses a wall far thinner than a sheet of paper into each passing cell, and carbon dioxide crosses the other way.`,
  `At rest a cell spends about ${M.transitOf(rest.co).toFixed(2)} s beside the air and is fully loaded within the first quarter-second, so most of its trip is time to spare. All out, the heart pumps nearly five times as much blood; more capillaries open, but each cell still passes in about ${M.transitOf(top4.co).toFixed(2)} s, and it arrives emptier (${sIn(top4)}% instead of ${sIn(rest)}%). In healthy lungs it still leaves about ${sOut(top4)}% full. The lungs are rarely what limits VO₂max; the heart's output usually is.`,
  `<small>Typical healthy adult at sea level, drawn far larger than life: an air sac is about a quarter of a millimetre across. One capillary stands for the several a cell passes. Lung disease, altitude and some very fit athletes at their peak can leave blood short of full; not shown. Blue and red follow the textbook convention.</small>`,
]
  .map((p) => `<span class="a5-par">${p}</span>`)
  .join("");
const body = plate({
  fig: "A5",
  title: "The air sac and the red cell",
  hint: "Pick an effort · watch the time to spare shrink",
  stats: [
    { key: "time", label: "Time in capillary", value: `${M.transitOf(rest.co).toFixed(2)} s` },
    { key: "in", label: "Arrives", value: `${sIn(rest)}% full` },
    { key: "out", label: "Leaves", value: `${sOut(rest)}% full` },
  ],
  controls: [{ name: "effort", label: "Effort", options: M.LUNG.states.map((s, i) => ({ value: s.key, label: s.label, pressed: i === 0 })) }],
  keys: [
    { mark: "heat", label: "Oxygen-rich blood" },
    { mark: "lit", label: "Oxygen in the air" },
    { mark: "raised", label: "Air sac wall" },
  ],
  caption: CAPTION,
  body: `<div class="iso-stage a5-stage">${svg}</div><div class="a5-row"><p class="a5-scene" data-scene>${LINES[0]}</p><button type="button" class="a5-slow" data-slow aria-pressed="true">8× slower</button></div><span class="a5-sr" role="status" aria-live="polite" data-status></span>`,
});
const out = THEME === "light" ? `${SLUG}-light.html` : `${SLUG}.html`;
writeFileSync(join(HERE, out), page({ title: "The air sac and the red cell", theme: THEME, body, css: CSS, script: SCRIPT }));
if (THEME === "light") {
  mkdirSync(join(HERE, "embed"), { recursive: true });
  writeFileSync(join(HERE, "embed", `optimal-fig-${SLUG}.js`), embed({ tag: `optimal-fig-${SLUG}`, body, script: SCRIPT, css: CSS }));
}
console.log("wrote", out, `(${PATH.length} path points, arc ${I0}–${I1}, ${arcLen.toFixed(0)} px; ${seeds.length} sacs in the foam: ${frontCells.length} front, ${topCells.length} top, ${endCells.length} end; view ${W}×${H})`);
