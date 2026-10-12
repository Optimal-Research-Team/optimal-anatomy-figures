// A4 live code: the heart cut open front to back, in 3-D, beating at the chosen rate.
//
// Everything is redrawn from the beat model each frame. On the cut face: the cut muscle, the
// chamber openings and the great vessels, all moved by one deformation field (the chambers
// squeeze toward their middles, the walls thicken, the valve plane is pulled toward the apex).
// Behind the cut, in true depth: each chamber is a cavity whose inner wall is shaded by facing
// and ridged with muscle bands, the papillary muscles stand up from the ventricle floors, chordae
// run to 3-D valve leaflets that swing open and shut, blood cells move at their own depths (the
// left ventricle's filling swirls), and the heart's back half keeps its round, vessel-lined
// outer wall. A monitor below runs the ECG, the left ventricle's volume and the valves' timing.
const DATA = __DATA__;

function mount(fig) {
  const svg = fig.querySelector("svg");
  const q = (s) => svg.querySelector(s);
  const still = matchMedia("(prefers-reduced-motion: reduce)");
  const out = Object.fromEntries([...fig.querySelectorAll("[data-r]")].map((n) => [n.dataset.r, n]));
  const status = fig.querySelector("[data-status]");
  const line = fig.querySelector("[data-scene]");
  const buttons = [...fig.querySelectorAll('[data-control="rate"] .opt-seg-btn')];
  const slowBtn = fig.querySelector("[data-slow]");
  const G = DATA.geo;
  const set = (sel, d) => q(sel).setAttribute("d", d);
  const f1 = (v) => v.toFixed(1);
  const clamp = (v, a, b) => Math.min(b, Math.max(a, v));

  // ---------------------------------------------------------------- shapes
  function smooth(points, closed = true, k = 1) {
    const n = points.length;
    const at = (i) => points[closed ? (i + n) % n : Math.max(0, Math.min(n - 1, i))];
    let d = `M${f1(points[0][0])} ${f1(points[0][1])}`;
    for (let i = 0; i < (closed ? n : n - 1); i++) {
      const p0 = at(i - 1), p1 = at(i), p2 = at(i + 1), p3 = at(i + 2);
      d += `C${f1(p1[0] + ((p2[0] - p0[0]) / 6) * k)} ${f1(p1[1] + ((p2[1] - p0[1]) / 6) * k)} ${f1(p2[0] - ((p3[0] - p1[0]) / 6) * k)} ${f1(p2[1] - ((p3[1] - p1[1]) / 6) * k)} ${f1(p2[0])} ${f1(p2[1])}`;
    }
    return d + (closed ? "Z" : "");
  }
  function curve(points, samples = 10) {
    // sampled Catmull-Rom centreline
    const out2 = [];
    const n = points.length;
    for (let i = 0; i < n - 1; i++) {
      const p0 = points[Math.max(0, i - 1)], p1 = points[i], p2 = points[i + 1], p3 = points[Math.min(n - 1, i + 2)];
      for (let s = 0; s < samples; s++) {
        const t = s / samples, t2 = t * t, t3 = t2 * t;
        out2.push([0, 1].map((c) => 0.5 * (2 * p1[c] + (-p0[c] + p2[c]) * t + (2 * p0[c] - 5 * p1[c] + 4 * p2[c] - p3[c]) * t2 + (-p0[c] + 3 * p1[c] - 3 * p2[c] + p3[c]) * t3)));
      }
    }
    out2.push(points[n - 1]);
    return out2;
  }
  function tube(points, w0, w1 = w0, sides = false) {
    // a closed vessel outline round a centreline, tapering w0 → w1 (sides: also its two edges as open lines)
    const c = curve(points);
    const L = [];
    const R = [];
    c.forEach((p, i) => {
      const a = c[Math.max(0, i - 1)];
      const b = c[Math.min(c.length - 1, i + 1)];
      let nx = -(b[1] - a[1]);
      let ny = b[0] - a[0];
      const l = Math.hypot(nx, ny) || 1;
      nx /= l;
      ny /= l;
      const w = (w0 + (w1 - w0) * (i / (c.length - 1))) / 2;
      L.push([p[0] + nx * w, p[1] + ny * w]);
      R.push([p[0] - nx * w, p[1] - ny * w]);
    });
    const ln = (ps) => `M${ps.map((p) => `${f1(p[0])} ${f1(p[1])}`).join("L")}`;
    const closed = `${ln([...L, ...[...R].reverse()])}Z`;
    return sides ? { d: closed, edges: ln(L) + ln(R), L, R } : closed;
  }
  /** A vessel, cut open lengthwise like the heart: a wall band each side, the blood down the middle with the
   *  lit far wall of the half-pipe showing as a soft band. Its back half and cut ends are drawn behind the cut. */
  const tubes = [];
  function vessel(name, list, cls) {
    let h = "";
    for (const [pts, w0, w1, capA, capB] of list) {
      tubes.push({ name, pts, w0, w1, cls, caps: [capA, capB] });
      const t = tube(pts, w0, w1, true);
      const lit = tube(pts, w0 * 0.28, w1 * 0.28, true);
      h += `<path class="a4-${cls} a4-vessel a4-vessel-fill" d="${t.d}"/><path class="a4-lumen a4-lumen-${cls} a4-lumen-cut" d="${tube(pts, w0 * 0.7, w1 * 0.7)}"/><path class="a4-lumen-lit a4-lumen-lit-${cls}" d="${lit.d}" transform="translate(${f1(DATA.far.w[0] * w0 * 0.18)} ${f1(DATA.far.w[1] * w0 * 0.18)})"/><path class="a4-vessel-edge" d="${t.edges}"/>`;
    }
    q(`[data-v="${name}"]`).innerHTML = h;
  }
  const centroid = (pts) => pts.reduce((a, p) => [a[0] + p[0] / pts.length, a[1] + p[1] / pts.length], [0, 0]);
  const C = { RA: centroid(G.RA), LA: centroid(G.LA), RV: centroid(G.RV), LV: centroid(G.LV), V: [320, 392] };
  const FIB = { lv: G.LV.filter((p) => p[1] > G.AVY + 16), rv: G.RV.slice(0, 6) };

  // ---------------------------------------------------------------- the deformation field
  let def = { d: 0, sV: 1, sA: 1, sO: 1 };
  const wOf = (y) => (y <= G.AVY ? 1 : y >= G.APEXY ? 0 : (G.APEXY - y) / (G.APEXY - G.AVY));
  const shift = (p) => [p[0], p[1] + def.d * wOf(p[1])];
  const scaleAbout = (p, c, s) => [c[0] + (p[0] - c[0]) * s, c[1] + (p[1] - c[1]) * s];
  const cav = (pts, c, s) => pts.map((p) => shift(scaleAbout(p, c, s)));
  const outer = () =>
    G.OUT.map((p) => {
      if (p[1] > G.AVY - 4) return shift(scaleAbout(p, C.V, def.sO));
      const c = p[0] < 300 ? C.RA : C.LA;
      return shift(scaleAbout(p, c, 0.94 + 0.06 * def.sA));
    });

  // ---------------------------------------------------------------- 3-D: the camera, light and tones
  // A point (x, y) on the cut face at depth d behind it is drawn at (x, y) + d·w in the cut face's own
  // coordinates. World vectors: x right, y toward the viewer, z up; a section-plus-depth vector
  // (dx, dy, dd) is (dx, −dd, −dy) in world.
  const FAR = DATA.far;
  const RB = roundBack(FAR);
  const W = FAR.w;
  const RAD = Math.PI / 180;
  const sA = Math.sin(FAR.A * RAD), cA = Math.cos(FAR.A * RAD), sE = Math.sin(FAR.E * RAD), cE = Math.cos(FAR.E * RAD);
  const VIEW = [cA * cE, sA * cE, sE];
  const LIGHT = (() => {
    const l = [-0.35, 0.55, 0.76];
    const m = Math.hypot(...l);
    return l.map((v) => v / m);
  })();
  const P3 = (x, y, d) => [x + d * W[0], y + d * W[1]];
  const key3 = (x, y, d) => (x * cA + (FAR.dep - d) * sA) * cE - y * sE;
  const dot3 = (a, b) => a[0] * b[0] + a[1] * b[1] + a[2] * b[2];
  const norm3 = (a) => {
    const m = Math.hypot(a[0], a[1], a[2]) || 1;
    return [a[0] / m, a[1] / m, a[2] / m];
  };
  const cross3 = (a, b) => [a[1] * b[2] - a[2] * b[1], a[2] * b[0] - a[0] * b[2], a[0] * b[1] - a[1] * b[0]];
  const toW = (v) => [v[0], -v[2], -v[1]]; // (dx, dy, dd) → world
  const mixc = (c, to, t) => c.map((v, i) => Math.round(v + (to[i] - v) * t));
  const rgb = (c) => `rgb(${c.join(",")})`;
  const tone = (tones, t, steps = 20) => rgb(mixc(tones[0], tones[1], Math.round(clamp(t, 0, 1) * steps) / steps));
  const lit = (n, two = false) => {
    const l = dot3(n, LIGHT);
    return 0.16 + 0.95 * Math.max(0, two ? Math.abs(l) : l);
  };
  const quad = (pts) => `M${pts.map((v) => `${f1(v[0])} ${f1(v[1])}`).join("L")}Z`;
  const pathOf = (pts) => `M${pts.map((v) => `${f1(v[0])} ${f1(v[1])}`).join("L")}`;
  const cssc = (name, fb) => RB.rgbOf(fig, name, fb);
  const BLACK = [0, 0, 0];
  const WHITE = [255, 255, 255];
  const M_LO = cssc("--a4-m2", "#b0604f");
  const M_HI = cssc("--a4-m0", "#e7a594");
  const VEN = cssc("--a4-ven", "#8892cc");
  const ART = cssc("--a4-art", "#dc6656");
  const T = {
    epi: [mixc(M_LO, BLACK, 0.18), mixc(M_HI, WHITE, 0.05)],
    muscle: [mixc(M_LO, BLACK, 0.12), M_HI],
    ven: [mixc(VEN, BLACK, 0.45), mixc(VEN, WHITE, 0.25)],
    art: [mixc(ART, BLACK, 0.45), mixc(ART, WHITE, 0.25)],
    // a chamber's inner wall: muscle seen through its blood
    cavR: [mixc(mixc(M_LO, VEN, 0.6), BLACK, 0.42), mixc(mixc(M_HI, VEN, 0.55), WHITE, 0.08)],
    cavL: [mixc(mixc(M_LO, ART, 0.55), BLACK, 0.42), mixc(mixc(M_HI, ART, 0.5), WHITE, 0.08)],
    leaf: [cssc("--a4-valve-edge", "#8a6a5e"), cssc("--a4-valve", "#fffaf2")],
  };
  const FAT = rgb(cssc("--a4-fat", "#f2d27a"));
  const COR_ART = rgb(mixc(ART, BLACK, 0.12));
  const COR_VEN = rgb(mixc(VEN, BLACK, 0.18));
  const CHORD = rgb(cssc("--a4-chord", "#8a6a5e"));

  // ---------------------------------------------------------------- the heart's back half, with its surface vessels
  function closedRing(points, n, smoothing = 3) {
    const closed = RB.sampleClosed(points, 1, 6);
    const raw = RB.byLength([...closed, closed[0]], n + 1).slice(0, -1);
    if (!smoothing) return raw;
    return raw.map((_, i) => {
      let x = 0;
      let y = 0;
      for (let k = -smoothing; k <= smoothing; k++) {
        const p = raw[(i + k + n) % n];
        x += p[0] / (2 * smoothing + 1);
        y += p[1] / (2 * smoothing + 1);
      }
      return [x, y];
    });
  }
  function backHalf(outline) {
    const pts = closedRing(outline, 72);
    const n = pts.length;
    let area = 0;
    for (let i = 0; i < n; i++) area += pts[i][0] * pts[(i + 1) % n][1] - pts[(i + 1) % n][0] * pts[i][1];
    const sg = area > 0 ? 1 : -1;
    const nrm = pts.map((p, i) => {
      const a = pts[(i - 1 + n) % n];
      const b = pts[(i + 1) % n];
      const l = Math.hypot(b[0] - a[0], b[1] - a[1]) || 1;
      return [(sg * (b[1] - a[1])) / l, (-sg * (b[0] - a[0])) / l];
    });
    const [cx, cy] = centroid(pts);
    const rho = pts.map((p) => 0.92 * Math.hypot(p[0] - cx, p[1] - cy));
    const at = (i, ph) => {
      const r = rho[i];
      const inn = (1 - Math.cos(ph)) * r;
      return [pts[i][0] - nrm[i][0] * inn, pts[i][1] - nrm[i][1] * inn, Math.sin(ph) * r * 0.85];
    };
    const normal = (i, ph) => norm3([Math.cos(ph) * nrm[i][0], -Math.sin(ph), -Math.cos(ph) * nrm[i][1]]);
    const facets = [];
    const NPH = 9;
    for (let i = 0; i < n; i++) {
      const i1 = (i + 1) % n;
      for (let j = 0; j < NPH; j++) {
        const p0 = (j / NPH) * (Math.PI / 2);
        const p1 = ((j + 1) / NPH) * (Math.PI / 2);
        const nn = normal(i, (p0 + p1) / 2);
        if (dot3(nn, VIEW) <= 0.01) continue;
        const a = at(i, p0), b = at(i1, p0), c = at(i1, p1), d = at(i, p1);
        facets.push({ key: key3((a[0] + c[0]) / 2, (a[1] + c[1]) / 2, (a[2] + c[2]) / 2), d: quad([P3(...a), P3(...b), P3(...c), P3(...d)]), fill: tone(T.epi, lit(nn)) });
      }
    }
    // surface vessels on the left side (viewer's right): the circumflex in the fat of the AV groove,
    // and a marginal branch with its vein running down toward the apex
    const visible = (i, ph) => dot3(normal(i, ph), VIEW) > 0.04;
    const runAlong = (ph, pick) => {
      const segs = [];
      let cur = [];
      for (let i = 0; i < n; i++) {
        if (pick(pts[i], nrm[i]) && visible(i, ph)) cur.push(P3(...at(i, ph)));
        else if (cur.length) (segs.push(cur), (cur = []));
      }
      if (cur.length) segs.push(cur);
      return segs.filter((s) => s.length > 1).map(pathOf).join("");
    };
    const right = (p, nn) => nn[0] > 0.3;
    const groove = (p, nn) => nn[0] > 0.2 && Math.abs(p[1] - (G.AVY + def.d * 0.2)) < 30;
    let fat = "";
    for (let i = 0; i < n; i++) {
      if (!groove(pts[i], nrm[i])) continue;
      const i1 = (i + 1) % n;
      if (!groove(pts[i1], nrm[i1]) || !visible(i, 0.6)) continue;
      fat += quad([P3(...at(i, 0.18)), P3(...at(i1, 0.18)), P3(...at(i1, 1.0)), P3(...at(i, 1.0))]);
    }
    const vein = runAlong(0.78, (p, nn) => right(p, nn) && p[1] > G.AVY - 10);
    const artery = runAlong(0.52, (p, nn) => right(p, nn) && p[1] > G.AVY - 18);
    const surf = `<path class="a4-epi-fat" d="${fat}" fill="${FAT}"/><path class="a4-cor-edge" d="${vein}"/><path class="a4-cor" d="${vein}" stroke="${COR_VEN}"/><path class="a4-cor-edge a4-cor-edge-a" d="${artery}"/><path class="a4-cor a4-cor-a" d="${artery}" stroke="${COR_ART}"/>`;
    return { facets, surf };
  }

  // ---------------------------------------------------------------- a chamber: a cavity behind its opening
  // Its inner wall is a half-ellipsoid behind the outline (a round opening becomes a hemispherical bowl).
  // Through the opening every point of the wall is seen once, so its facets can be merged by tone.
  function chamber(outlinePts, depthK, tones, ridges) {
    const P = closedRing(outlinePts, 72, 1);
    const n = P.length;
    const c = centroid(P);
    const R = P.map((p) => Math.hypot(p[0] - c[0], p[1] - c[1]) || 1);
    const rbar = R.reduce((a, v) => a + v, 0) / n;
    const D = depthK * rbar;
    const U = P.map((p, i) => [(p[0] - c[0]) / R[i], (p[1] - c[1]) / R[i]]);
    const K = 15;
    const at = (i, t) => {
      const th = (t * Math.PI) / 2;
      return [c[0] + U[i][0] * R[i] * Math.cos(th), c[1] + U[i][1] * R[i] * Math.cos(th), Math.sin(th) * D];
    };
    const facets = [];
    for (let i = 0; i < n; i++) {
      const i1 = (i + 1) % n;
      for (let k = 0; k < K; k++) {
        const t0 = k / K, t1 = (k + 1) / K, th = ((t0 + t1) / 2) * (Math.PI / 2);
        const a = Math.cos(th) / ((R[i] + R[i1]) / 2);
        const b = Math.sin(th) / D;
        const ux = (U[i][0] + U[i1][0]) / 2, uy = (U[i][1] + U[i1][1]) / 2;
        const nIn = norm3([-a * ux, b, a * uy]); // the wall's inner side, facing into the cavity
        const q0 = at(i, t0), q1 = at(i1, t0), q2 = at(i1, t1), q3 = at(i, t1);
        facets.push({ key: 0, d: quad([P3(...q0), P3(...q1), P3(...q2), P3(...q3)]), fill: tone(tones, lit(nIn), 64) });
      }
    }
    // muscle ridges on the wall: trabeculae in the ventricles, pectinate bands in the right atrium
    let ridgeD = "";
    for (const r of ridges) {
      const pts = [];
      for (let s = 0; s <= 10; s++) {
        const t = r.t0 + ((r.t1 - r.t0) * s) / 10;
        const fi = r.i + r.wob * Math.sin(s * 0.9 + r.i);
        const i0 = ((Math.floor(fi) % n) + n) % n;
        const fr = fi - Math.floor(fi);
        const a = at(i0, t);
        const b = at((i0 + 1) % n, t);
        pts.push(P3(a[0] + (b[0] - a[0]) * fr, a[1] + (b[1] - a[1]) * fr, a[2] + (b[2] - a[2]) * fr));
      }
      ridgeD += pathOf(pts);
    }
    /** How deep the wall lies behind an in-plane point inside the opening. */
    const depthAt = (x, y) => {
      const ang = Math.atan2(y - c[1], x - c[0]);
      let best = 0;
      let bd = 9;
      U.forEach((u, i) => {
        const dd = Math.abs(Math.atan2(Math.sin(ang - Math.atan2(u[1], u[0])), Math.cos(ang - Math.atan2(u[1], u[0]))));
        if (dd < bd) (bd = dd), (best = i);
      });
      const rr = Math.hypot(x - c[0], y - c[1]) / R[best];
      return Math.sqrt(Math.max(0, 1 - rr * rr)) * D;
    };
    return { facets, ridgeD, depthAt, c, D, outline: smooth(outlinePts) };
  }
  const RIDGE = {
    LV: [14, 21, 28, 35, 42, 49, 56].map((i, k) => ({ i, t0: 0.16, t1: 0.84 + (k % 3) * 0.04, wob: 0.55 })),
    RV: [17, 25, 33, 41, 49].map((i) => ({ i, t0: 0.18, t1: 0.8, wob: 0.5 })),
    RA: [27, 32, 37, 42, 47, 52].map((i) => ({ i, t0: 0.08, t1: 0.66, wob: 0.3 })),
    LA: [],
  };

  // ---------------------------------------------------------------- a papillary muscle: a tapered 3-D column
  function column(base, tip, r0, r1, tones) {
    const S = 6;
    const N = 12;
    const ax = norm3(toW([tip[0] - base[0], tip[1] - base[1], tip[2] - base[2]]));
    let side = norm3(cross3(ax, [0, 0, 1]));
    if (!isFinite(side[0])) side = [1, 0, 0];
    const up = cross3(side, ax);
    const ring = (s) => {
      const p = [base[0] + (tip[0] - base[0]) * s, base[1] + (tip[1] - base[1]) * s, base[2] + (tip[2] - base[2]) * s];
      const r = (r0 + (r1 - r0) * s) * (1 - 0.18 * Math.sin(Math.PI * s * 0.9));
      return Array.from({ length: N }, (_, j) => {
        const a = (j / N) * 2 * Math.PI;
        const v = [side[0] * Math.cos(a) + up[0] * Math.sin(a), side[1] * Math.cos(a) + up[1] * Math.sin(a), side[2] * Math.cos(a) + up[2] * Math.sin(a)];
        // world offset back to section + depth: x, −z, −y
        return { p: [p[0] + v[0] * r, p[1] - v[2] * r, p[2] - v[1] * r], n: v };
      });
    };
    const rows = Array.from({ length: S + 1 }, (_, s) => ring(s / S));
    const facets = [];
    for (let s = 0; s < S; s++)
      for (let j = 0; j < N; j++) {
        const a = rows[s][j], b = rows[s][(j + 1) % N], cc = rows[s + 1][(j + 1) % N], d = rows[s + 1][j];
        const nn = norm3([a.n[0] + b.n[0], a.n[1] + b.n[1], a.n[2] + b.n[2]]);
        if (dot3(nn, VIEW) <= 0) continue;
        facets.push({ key: key3((a.p[0] + cc.p[0]) / 2, (a.p[1] + cc.p[1]) / 2, (a.p[2] + cc.p[2]) / 2), d: quad([P3(...a.p), P3(...b.p), P3(...cc.p), P3(...d.p)]), fill: tone(tones, lit(nn)) });
      }
    return facets;
  }

  // ---------------------------------------------------------------- an AV valve: its annulus and two leaflets in 3-D
  // The annulus crosses the cut at its two ends; behind the cut it is a half-ring. Each leaflet hangs from half
  // of it: open, its free edge drops into the ventricle along the wall; shut, the free edges meet in the middle.
  function avValve(L0, R0, open, toward, len) {
    const L = shift(L0);
    const R = shift(R0);
    const m = [(L[0] + R[0]) / 2, (L[1] + R[1]) / 2];
    const h = [(R[0] - L[0]) / 2, (R[1] - L[1]) / 2];
    const a = Math.hypot(h[0], h[1]);
    const b = a * 0.9;
    let dv = [toward[0] - m[0], toward[1] - m[1]];
    const dl = Math.hypot(dv[0], dv[1]) || 1;
    dv = [dv[0] / dl, dv[1] / dl];
    const ring = (ph) => [m[0] + Math.cos(ph) * h[0], m[1] + Math.cos(ph) * h[1], Math.sin(ph) * b];
    const o = open * open * (3 - 2 * open);
    const edge = (ph) => {
      const r = ring(ph);
      const opened = [r[0] + dv[0] * len + (r[0] - m[0]) * 0.12, r[1] + dv[1] * len + (r[1] - m[1]) * 0.12, r[2] * 1.08];
      const shut = [m[0] + dv[0] * len * 0.22, m[1] + dv[1] * len * 0.22, r[2] * 0.95];
      return [shut[0] + (opened[0] - shut[0]) * o, shut[1] + (opened[1] - shut[1]) * o, shut[2] + (opened[2] - shut[2]) * o];
    };
    const facets = [];
    const tips = [];
    const ROWS = 5;
    const SEG = 9;
    let edgeD = "";
    for (const [ph0, ph1] of [[0.04, Math.PI / 2 - 0.03], [Math.PI / 2 + 0.03, Math.PI - 0.04]]) {
      const grid = [];
      for (let s = 0; s <= ROWS; s++) {
        const rowPts = [];
        for (let k = 0; k <= SEG; k++) {
          const ph = ph0 + ((ph1 - ph0) * k) / SEG;
          const r = ring(ph);
          const e = edge(ph);
          const u = s / ROWS;
          // a little belly: toward the atrium when shut, toward the wall when open
          const belly = Math.sin(Math.PI * u) * len * 0.18;
          const bx = -dv[0] * belly * (1 - o) + (r[0] - m[0]) / Math.max(1, a) * belly * o * 0.6;
          const by = -dv[1] * belly * (1 - o) + (r[1] - m[1]) / Math.max(1, a) * belly * o * 0.6;
          rowPts.push([r[0] + (e[0] - r[0]) * u + bx, r[1] + (e[1] - r[1]) * u + by, r[2] + (e[2] - r[2]) * u]);
        }
        grid.push(rowPts);
      }
      for (let s = 0; s < ROWS; s++)
        for (let k = 0; k < SEG; k++) {
          const p0 = grid[s][k], p1 = grid[s][k + 1], p2 = grid[s + 1][k + 1], p3 = grid[s + 1][k];
          const e1 = toW([p1[0] - p0[0], p1[1] - p0[1], p1[2] - p0[2]]);
          const e2 = toW([p3[0] - p0[0], p3[1] - p0[1], p3[2] - p0[2]]);
          const nn = norm3(cross3(e1, e2));
          facets.push({ key: key3((p0[0] + p2[0]) / 2, (p0[1] + p2[1]) / 2, (p0[2] + p2[2]) / 2), d: quad([P3(...p0), P3(...p1), P3(...p2), P3(...p3)]), fill: tone(T.leaf, 0.35 + 0.65 * lit(nn, true), 32) });
        }
      for (const k of [1, 4, 7]) tips.push(grid[ROWS][k]);
      // the free edge, scalloped where the chordae pull it
      edgeD += pathOf(grid[ROWS].map((p, k) => P3(p[0], p[1] + (k % 3 === 1 ? 1.6 : 0), p[2])));
    }
    const ringPts = [];
    for (let k = 0; k <= 20; k++) ringPts.push(P3(...ring((k / 20) * Math.PI)));
    return { facets, tips, edgeD, ring: pathOf(ringPts), ends: [L, R], neck: [L, R, [R[0] + dv[0] * 16, R[1] + dv[1] * 16], [L[0] + dv[0] * 16, L[1] + dv[1] * 16]], back: [[L[0] - dv[0] * 12, L[1] - dv[1] * 12], [R[0] - dv[0] * 12, R[1] - dv[1] * 12]] };
  }

  // ---------------------------------------------------------------- semilunar valves (on the cut, in the vessel roots)
  function leaflet(hh, ang, Ln, w = 6) {
    const a = (ang * Math.PI) / 180;
    const ux = Math.cos(a), uy = Math.sin(a);
    const nx = -uy, ny = ux;
    const t = [hh[0] + ux * Ln, hh[1] + uy * Ln];
    const m = [hh[0] + ux * Ln * 0.55, hh[1] + uy * Ln * 0.55];
    return smooth([[hh[0] + nx * w * 0.5, hh[1] + ny * w * 0.5], [m[0] + nx * w * 0.42, m[1] + ny * w * 0.42], t, [m[0] - nx * w * 0.42, m[1] - ny * w * 0.42], [hh[0] - nx * w * 0.5, hh[1] - ny * w * 0.5]], true, 0.8);
  }
  const lerp = (a, b, t) => a + (b - a) * t;
  function semilunar(b) {
    let d = "";
    for (const [l, r] of [G.PUL, G.AOR]) {
      const hl = shift(l);
      const hr = shift(r);
      const Ln = (r[0] - l[0]) * 0.58;
      d += leaflet(hl, lerp(28, -78, b.semi), Ln, 5) + leaflet(hr, lerp(152, -102, b.semi), Ln, 5);
    }
    return d;
  }

  // ---------------------------------------------------------------- blood: right side blue, left side red, each cell at its own depth
  const rnd = (a, b) => a + Math.random() * (b - a);
  const cells = [];
  let spawnR = 0;
  let spawnL = 0;
  let cham = null; // this frame's chambers, for depths
  function spawn(side) {
    const d = rnd(0, 8);
    if (side === "R") {
      const fromTop = Math.random() < 0.55;
      cells.push({ side, stage: 0, p: fromTop ? [rnd(165, 188), -6] : [rnd(78, 98), 372], path: fromTop ? [[176, 120]] : [[132, 288]], j: [rnd(-16, 16), rnd(-16, 16)], d, dT: d });
    } else cells.push({ side, stage: 0, p: [560, Math.random() < 0.5 ? 168 : 214], path: [[470, 196]], j: [rnd(-16, 16), rnd(-14, 14)], d, dT: d });
  }
  function moveTo(c, t, v, dt) {
    const dx = t[0] - c.p[0], dy = t[1] - c.p[1];
    const d = Math.hypot(dx, dy);
    if (d <= v * dt) {
      c.p = [t[0], t[1]];
      return true;
    }
    c.p = [c.p[0] + (dx / d) * v * dt, c.p[1] + (dy / d) * v * dt];
    return false;
  }
  const setStage = (c, s, dT) => {
    c.stage = s;
    c.dT = dT;
  };
  function stepCells(b, dt, hr) {
    const v = 70 * (hr / 60);
    for (const c of cells) {
      if (c.a === undefined) (c.a = Math.random() * Math.PI), (c.spin = (Math.random() - 0.5) * 3);
      c.a += c.spin * dt;
      c.d += (c.dT - c.d) * (1 - Math.exp(-dt * 3.5));
    }
    spawnR += dt * 6 * (hr / 60);
    spawnL += dt * 6 * (hr / 60);
    while (spawnR > 1) (spawnR -= 1), spawn("R");
    while (spawnL > 1) (spawnL -= 1), spawn("L");
    const DA = { R: cham ? cham.RA.D : 50, L: cham ? cham.LA.D : 50 };
    const DV = { R: cham ? cham.RV.D : 30, L: cham ? cham.LV.D : 60 };
    for (let i = cells.length - 1; i >= 0; i--) {
      const c = cells[i];
      const R = c.side === "R";
      const atrium = R ? C.RA : C.LA;
      const vent = R ? C.RV : C.LV;
      const ring = R ? G.TRIc : G.MITc;
      const exitV = R ? G.PULc : G.AORc;
      if (c.stage === 0) {
        // vein → atrium
        if (moveTo(c, c.path[0], v * 0.9, dt)) setStage(c, 1, rnd(0.15, 0.7) * DA[c.side]);
      } else if (c.stage === 1) {
        moveTo(c, shift([atrium[0] + c.j[0], atrium[1] + c.j[1]]), v * 0.5, dt);
        if (b.av > 0.5) setStage(c, 2, rnd(0.1, 0.45) * 18);
      } else if (c.stage === 2) {
        // through the open AV valve into the ventricle
        if (moveTo(c, shift(ring), v * 1.3, dt)) {
          setStage(c, 3, 0);
          c.th = Math.atan2(c.j[1], c.j[0]);
          c.rr = 10 + Math.hypot(c.j[0], c.j[1]) * (R ? 0.7 : 1.1);
        }
      } else if (c.stage === 3) {
        // filling swirls: the inflow curls down the free wall and back up the septum (a vortex ring, seen cut)
        c.th += (R ? 1.6 : 2.6) * (hr / 60) * dt * (R ? -1 : 1);
        const cx = vent[0] + (R ? -4 : 6);
        const cy = vent[1] + (R ? 10 : 18);
        moveTo(c, shift([cx + Math.cos(c.th) * c.rr * 0.75, cy + Math.sin(c.th) * c.rr * 1.6]), v * 1.1, dt);
        c.dT = DV[c.side] * (0.38 + 0.26 * Math.sin(c.th));
        if (b.semi > 0.5) setStage(c, 4, rnd(0, 0.3) * 18);
      } else if (c.stage === 4) {
        if (moveTo(c, shift(exitV), v * 2.2, dt)) {
          setStage(c, 5, rnd(0, 7));
          c.out = (R ? G.PULout : G.AORout)[Math.floor(Math.random() * (R ? G.PULout : G.AORout).length)];
        }
      } else if (c.stage === 5) {
        const way = c.out;
        if (moveTo(c, way[c.k ?? 0], v * 1.8, dt)) {
          c.k = (c.k ?? 0) + 1;
          if (c.k >= way.length) cells.splice(i, 1);
        }
      }
    }
  }
  const disc = (x, y, a, rx, ry) => {
    const ux = Math.cos(a);
    const uy = Math.sin(a);
    const ang = ((a * 180) / Math.PI).toFixed(0);
    return `M${f1(x - ux * rx)} ${f1(y - uy * rx)}A${rx} ${ry} ${ang} 1 0 ${f1(x + ux * rx)} ${f1(y + uy * rx)}A${rx} ${ry} ${ang} 1 0 ${f1(x - ux * rx)} ${f1(y - uy * rx)}Z`;
  };

  // ---------------------------------------------------------------- the monitor: ECG, left-ventricle volume, valves
  const MON = DATA.mon;
  const trace = [];
  function monitorDraw(clock, b, hr) {
    trace.push([clock, ecgAt(hr, b.u), b.V, b.av > 0.5 ? 1 : 0, b.semi > 0.5 ? 1 : 0]);
    while (trace.length && clock - trace[0][0] > MON.span) trace.shift();
    const xOf = (t) => MON.x0 + ((t - clock + MON.span) / MON.span) * MON.w;
    let e = "";
    let v = "";
    for (const [t, ecg, V] of trace) {
      e += `${e ? "L" : "M"}${f1(xOf(t))} ${f1(MON.ecg.y - ecg * MON.ecg.h)}`;
      v += `${v ? "L" : "M"}${f1(xOf(t))} ${f1(MON.vol.y - ((V - MON.vol.lo) / (MON.vol.hi - MON.vol.lo)) * MON.vol.h)}`;
    }
    const bars = (idx, row) => {
      let d = "";
      let start = null;
      trace.forEach((s, k) => {
        if (s[idx] && start === null) start = s[0];
        if ((!s[idx] || k === trace.length - 1) && start !== null) {
          const x0 = xOf(start);
          const x1 = xOf(s[0]);
          if (x1 - x0 > 0.5) d += `M${f1(x0)} ${row.y}H${f1(x1)}V${row.y + row.h}H${f1(x0)}Z`;
          start = null;
        }
      });
      return d;
    };
    set('[data-part="ecg"]', e);
    set('[data-part="vol"]', v);
    set('[data-part="barIn"]', bars(3, MON.inR));
    set('[data-part="barOut"]', bars(4, MON.outR));
    const last = trace[trace.length - 1];
    const dot = q('[data-part="ecgdot"]');
    dot.setAttribute("cx", f1(MON.x0 + MON.w));
    dot.setAttribute("cy", f1(MON.ecg.y - last[1] * MON.ecg.h));
    const vd = q('[data-part="voldot"]');
    vd.setAttribute("cx", f1(MON.x0 + MON.w));
    vd.setAttribute("cy", f1(MON.vol.y - ((last[2] - MON.vol.lo) / (MON.vol.hi - MON.vol.lo)) * MON.vol.h));
    q('[data-part="volnow"]').textContent = `${Math.round(last[2])} ml`;
  }

  // ---------------------------------------------------------------- one frame
  function draw(b, hr) {
    const sV = Math.sqrt(b.V / 140);
    const contr = Math.min(1, Math.max(0, (b.edv - b.V) / (b.edv - b.esv)));
    def = { d: 15 * contr, sV, sA: b.A, sO: 1 - 0.22 * (1 - sV) };
    const sAt = 0.78 + 0.22 * b.A;
    tubes.length = 0;
    const outline = outer();
    const outerD = smooth(outline);
    set('[data-part="outer"]', outerD);
    set('[data-part="outerClip"]', outerD);
    // the chambers in this phase
    const shapes = { RA: cav(G.RA, C.RA, sAt), LA: cav(G.LA, C.LA, sAt), RV: cav(G.RV, C.RV, sV), LV: cav(G.LV, C.LV, sV) };
    cham = {
      RA: chamber(shapes.RA, 0.78, T.cavR, RIDGE.RA),
      LA: chamber(shapes.LA, 0.72, T.cavL, RIDGE.LA),
      RV: chamber(shapes.RV, 0.5, T.cavR, RIDGE.RV),
      LV: chamber(shapes.LV, 0.82 * (0.85 + 0.15 * sV), T.cavL, RIDGE.LV),
    };
    for (const k of ["RA", "LA", "RV", "LV"]) set(`[data-part="clip${k}"]`, cham[k].outline);
    // vessels: tops fixed, roots ride the valve plane
    vessel("svc", [[[[158, -12], [166, 60], [176, 120], shift([180, 176])], 38, 46, false, false]], "ven");
    vessel("ivc", [[[[84, 384], [108, 330], shift([142, 276])], 40, 38, true, false]], "ven");
    vessel("desc", [[[[470, 110], [480, 170], [486, 260], [492, 380], [494, 470]], 34, 32, false, true]], "art");
    vessel("aorta", [[[shift(G.AORc), shift([342, 196]), [338, 120], [356, 72], [410, 52], [452, 70], [470, 112]], 40, 36, false, false]], "art");
    vessel("branches", [[[[376, 60], [372, 14]], 16, 14, false, true], [[[408, 52], [412, 8]], 16, 14, false, true], [[[440, 62], [456, 18]], 16, 14, false, true]], "art");
    vessel("pt", [[[shift(G.PULc), shift([276, 186]), [284, 140], [318, 126], [362, 120], [404, 128]], 36, 26, false, true]], "ven");
    vessel("rpa", [[[[284, 142], [244, 124], [196, 116], [150, 120]], 26, 22, false, true]], "ven");
    vessel("pv", [[[[566, 168], [520, 168], shift([466, 176])], 18, 18, true, false], [[[566, 214], [520, 214], shift([464, 212])], 18, 18, true, false]], "art");
    // the back half: round outer wall with its surface vessels, and the vessels' back halves
    const back = backHalf(outline);
    const LUMEN = { ven: rgb(VEN), art: rgb(ART) };
    const WALL = rgb(cssc("--a4-vwall", "#f3d9cf"));
    const backOf = (t) => {
      const c = RB.byLength(curve(t.pts), 14);
      const Ae = [];
      const Be = [];
      c.forEach((p, i) => {
        const a = c[Math.max(0, i - 1)];
        const bb = c[Math.min(c.length - 1, i + 1)];
        const l = Math.hypot(bb[0] - a[0], bb[1] - a[1]) || 1;
        const nn = [-(bb[1] - a[1]) / l, (bb[0] - a[0]) / l];
        const w = (t.w0 + (t.w1 - t.w0) * (i / (c.length - 1))) / 2;
        Ae.push([p[0] + nn[0] * w, p[1] + nn[1] * w]);
        Be.push([p[0] - nn[0] * w, p[1] - nn[1] * w]);
      });
      return RB.chords(Ae, Be, { round: 1, nphi: 10, tones: T[t.cls], caps: t.caps, capFill: WALL, lumenFill: LUMEN[t.cls] });
    };
    // the descending aorta runs behind the heart: its back half (and its cut face) go under the heart's back half
    q('[data-part="behind"]').innerHTML = RB.paintObjects(tubes.filter((t) => t.name === "desc").map(backOf));
    q('[data-part="far"]').innerHTML = RB.paintObjects([back.facets, ...tubes.filter((t) => t.name !== "desc").map(backOf)]) + back.surf;
    // inside the cavities: walls and ridges, valves, papillary muscles, chordae and cells
    const tri = avValve(G.TRI[0], G.TRI[1], b.av, C.RV, 27);
    const mit = avValve(G.MIT[0], G.MIT[1], b.av, C.LV, 31);
    const papBase = (pt, k) => {
      const p = shift(scaleAbout(pt, k === "RV" ? C.RV : C.LV, 0.82 + 0.18 * sV));
      return [p[0], p[1], Math.max(4, cham[k].depthAt(p[0], p[1]) * 0.85)];
    };
    const paps = [
      { base: papBase(G.PAPR, "RV"), toward: [tri.ends[0][0] * 0.5 + tri.ends[1][0] * 0.5, tri.ends[0][1] * 0.5 + tri.ends[1][1] * 0.5], r: [8.5, 4], side: "R" },
      { base: papBase(G.PAPL[0], "LV"), toward: mit.ends[0], r: [11, 4.6], side: "L" },
      { base: papBase(G.PAPL[1], "LV"), toward: mit.ends[1], r: [11, 4.6], side: "L" },
    ].map((pm) => {
      const len = Math.hypot(pm.toward[0] - pm.base[0], pm.toward[1] - pm.base[1]);
      const k = 0.42;
      const tip = [pm.base[0] + (pm.toward[0] - pm.base[0]) * k, pm.base[1] + (pm.toward[1] - pm.base[1]) * k - 4, pm.base[2] * 0.5];
      return { ...pm, tip, len };
    });
    let cavSvg = "";
    for (const k of ["RA", "LA", "RV", "LV"]) {
      const ch = cham[k];
      cavSvg += `<g clip-path="url(#a4-clip${k})">${RB.paintObjects([ch.facets])}${ch.ridgeD ? `<path class="a4-ridge-shade" d="${ch.ridgeD}" transform="translate(1.2 1.2)"/><path class="a4-ridge-lit" d="${ch.ridgeD}"/>` : ""}</g>`;
    }
    // the AV orifices: the dark of the junction behind the leaflets, and the half-ring of each annulus
    const orifice = (v) => smooth([v.back[0], [(v.back[0][0] + v.back[1][0]) / 2, (v.back[0][1] + v.back[1][1]) / 2 - 3], v.back[1], v.neck[2], [(v.neck[2][0] + v.neck[3][0]) / 2, (v.neck[2][1] + v.neck[3][1]) / 2 + 3], v.neck[3]], true, 0.6);
    // the orifice behind the leaflets: the far wall of the junction, in its chamber's own shadow tone
    cavSvg += `<path d="${orifice(tri)}" fill="${tone(T.cavR, 0.3)}"/><path d="${orifice(mit)}" fill="${tone(T.cavL, 0.3)}"/>`;
    // deep cells first, then muscles, leaflets and chordae, then the cells nearer the cut
    const chamberCells = cells.filter((c) => c.stage >= 1 && c.stage <= 4);
    const dMax = (c) => (c.stage === 1 ? cham[c.side === "R" ? "RA" : "LA"].D : cham[c.side === "R" ? "RV" : "LV"].D);
    const cellPath = (list, deep) =>
      list
        .filter((c) => (c.d > dMax(c) * 0.32) === deep)
        .map((c) => {
          const p = P3(c.p[0], c.p[1], Math.min(c.d, dMax(c) * 0.9));
          return disc(p[0], p[1], c.a, 4, 2.7);
        })
        .join("");
    const papFacets = paps.flatMap((pm) => column(pm.base, pm.tip, pm.r[0], pm.r[1], T.muscle));
    const leafFacets = [...tri.facets, ...mit.facets].sort((x, y) => x.key - y.key);
    const chordD = [
      ...tri.tips.map((t) => [t, paps[0].tip]),
      ...mit.tips.slice(0, 3).map((t) => [t, paps[1].tip]),
      ...mit.tips.slice(3).map((t) => [t, paps[2].tip]),
    ]
      .map(([a, p]) => [-2.2, 0, 2.2].map((o) => `M${P3(...a).map(f1).join(" ")}L${P3(p[0] + o, p[1] - 3, p[2]).map(f1).join(" ")}`).join(""))
      .join("");
    const side = (s) => chamberCells.filter((c) => c.side === s);
    cavSvg +=
      `<path class="a4-cell a4-cell-ven a4-cell-deep" d="${cellPath(side("R"), true)}"/><path class="a4-cell a4-cell-art a4-cell-deep" d="${cellPath(side("L"), true)}"/>` +
      `<path class="a4-annulus-ring" d="${tri.ring}${mit.ring}"/>` +
      RB.paint(papFacets) +
      leafFacets.map((f) => `<path d="${f.d}" fill="${f.fill}" stroke="${f.fill}" stroke-width="0.6" class="a4-leaf"/>`).join("") +
      `<path class="a4-leaf-edge" d="${tri.edgeD}${mit.edgeD}"/>` +
      `<path class="a4-chordae" d="${chordD}"/>` +
      `<path class="a4-cell a4-cell-ven" d="${cellPath(side("R"), false)}"/><path class="a4-cell a4-cell-art" d="${cellPath(side("L"), false)}"/>`;
    q('[data-part="cav"]').innerHTML = cavSvg;
    // the cut face: muscle with the chamber openings (and the AV orifices) cut out of it
    set('[data-part="holes"]', ["RA", "LA", "RV", "LV"].map((k) => cham[k].outline).join("") + orifice(tri) + orifice(mit));
    set('[data-part="rims"]', ["RA", "LA", "RV", "LV"].map((k) => cham[k].outline).join(""));
    set('[data-part="annuli"]', [...tri.ends, ...mit.ends].map((p) => `M${f1(p[0] - 4.5)} ${f1(p[1])}a4.5 3.2 0 1 0 9 0a4.5 3.2 0 1 0 -9 0Z`).join(""));
    // muscle fibres in the cut wall wrap the ventricles and squeeze with them
    const fib = (seed, c, k, s) => smooth(seed.map((p) => shift(scaleAbout(p, c, k * s))), false, 1);
    const sMid = (sV + def.sO) / 2;
    set('[data-part="fibres"]', [1.12, 1.24, 1.36, 1.48].map((k) => fib(FIB.lv, C.LV, k, sMid)).join("") + [1.1, 1.2].map((k) => fib(FIB.rv, C.RV, k, sMid)).join(""));
    set('[data-part="valves"]', semilunar(b));
    // cells in the vessels (on the cut, in the open half-pipes)
    const vesselCells = cells.filter((c) => c.stage === 0 || c.stage === 5);
    for (const s of ["R", "L"]) {
      const list = vesselCells.filter((c) => c.side === s);
      set(`[data-part="vcells${s}"]`, list.map((c) => { const p = P3(c.p[0], c.p[1], c.d * 0.6); return disc(p[0], p[1], c.a, 4, 2.7); }).join(""));
    }
  }

  // ---------------------------------------------------------------- state, input, tour
  let rateAt = 0;
  let hr = HEART.rates[0];
  let hrShown = hr;
  let t = 0.6;
  let clock = 0;
  let speed = 1;
  function setRate(i, quiet) {
    rateAt = i;
    hr = HEART.rates[i];
    const v = volumesOf(hr);
    out.hr.textContent = `${hr} bpm`;
    out.sv.textContent = `${Math.round(v.sv)} ml`;
    out.co.textContent = `${v.co.toFixed(1)} L/min`;
    line.textContent = DATA.lines[i];
    buttons.forEach((b, j) => {
      b.setAttribute("aria-checked", j === i ? "true" : "false");
      b.tabIndex = j === i ? 0 : -1;
    });
    if (!quiet) status.textContent = `${hr} beats a minute: each beat pushes out about ${Math.round(v.sv)} millilitres, ${v.co.toFixed(1)} litres a minute.`;
  }
  const takeOver = () => {
    touring = false;
    idle = performance.now();
  };
  buttons.forEach((b, i) =>
    b.addEventListener("click", () => {
      takeOver();
      setRate(i);
      if (still.matches) renderStill();
    }),
  );
  fig.querySelector('[data-control="rate"]').addEventListener("keydown", (e) => {
    const i = buttons.indexOf(document.activeElement);
    if (i < 0) return;
    const j = e.key === "ArrowRight" || e.key === "ArrowDown" ? i + 1 : e.key === "ArrowLeft" || e.key === "ArrowUp" ? i - 1 : null;
    if (j === null) return;
    e.preventDefault();
    const b = buttons[(j + buttons.length) % buttons.length];
    b.focus();
    b.click();
  });
  slowBtn.addEventListener("click", () => {
    speed = speed === 1 ? 0.25 : 1;
    slowBtn.setAttribute("aria-pressed", speed < 1 ? "true" : "false");
    slowBtn.textContent = speed < 1 ? "Real time" : "Slow";
  });
  function renderStill() {
    // mid-ejection: aortic and pulmonary valves open, the base pulled down, the traces filled in
    hrShown = hr;
    const T0 = timingOf(hr);
    const u = T0.ta + HEART.ivc + T0.ts * 0.35;
    trace.length = 0;
    cells.length = 0;
    draw(beatAt(hr, u), hr);
    for (let i = 0; i < 26; i++) spawn(i % 2 ? "R" : "L");
    for (let i = 0; i < 90; i++) stepCells(beatAt(hr, u - 0.9 + i * 0.01), 0.012, hr);
    for (let i = 0; i <= 140; i++) {
      const tt = -MON.span + (i / 140) * MON.span;
      const bb = beatAt(hr, u + tt);
      trace.push([tt, ecgAt(hr, bb.u), bb.V, bb.av > 0.5 ? 1 : 0, bb.semi > 0.5 ? 1 : 0]);
    }
    trace.pop();
    draw(beatAt(hr, u), hr);
    monitorDraw(0, beatAt(hr, u), hr);
  }
  let touring = true;
  let idle = -1e9;
  let tourClock = 0;
  let raf = 0;
  let last = 0;
  let visible = true;
  function tick(now) {
    raf = 0;
    if (!visible || still.matches) return;
    const dt = Math.min(0.05, last ? (now - last) / 1000 : 0.016) * speed;
    last = now;
    if (!touring && now - idle > 9000) touring = true;
    if (touring && (tourClock += dt / speed) > 7) {
      tourClock = 0;
      setRate((rateAt + 1) % HEART.rates.length, true);
    }
    // the rate eases to its new value over a beat or two (phase kept continuous)
    const T0 = 60 / hrShown;
    const phase = (t % T0) / T0;
    hrShown += (hr - hrShown) * (1 - Math.exp(-dt * 2.5));
    const T1 = 60 / hrShown;
    t = phase * T1 + dt;
    clock += dt;
    const b = beatAt(hrShown, t);
    stepCells(b, dt, hrShown);
    draw(b, hrShown);
    monitorDraw(clock, b, hrShown);
    raf = requestAnimationFrame(tick);
  }
  const start = () => {
    if (!raf && visible && !still.matches) {
      last = 0;
      raf = requestAnimationFrame(tick);
    }
  };
  new IntersectionObserver((entries) => {
    visible = entries.some((e) => e.isIntersecting);
    if (visible) start();
  }).observe(svg);
  still.addEventListener("change", () => (still.matches ? renderStill() : start()));
  for (const b of buttons) b.addEventListener("pointerdown", takeOver);
  setRate(0, true);
  if (still.matches) renderStill();
  else {
    draw(beatAt(hr, t), hr);
    for (let i = 0; i < 160; i++) {
      t += 1 / 60;
      stepCells(beatAt(hr, t), 1 / 60, hr);
    }
    draw(beatAt(hr, t), hr);
    start();
  }
}
