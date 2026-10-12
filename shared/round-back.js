// Round back: the far half of an organ cut open, drawn behind its cut face in the A-series camera.
//
// Browser-side helper, inlined into a figure's page (build.mjs reads this file). The cut face lies
// in the plane the figure places with planeMatrix(S3(0, DEP, 0), [1,0,0], [0,0,-1]): section x is
// world x, section y is −z, and the viewer is on the +y side. `w` is one unit of depth behind the cut
// expressed in the cut face's own coordinates (the figure solves it once in build.mjs).
//
//   const RB = roundBack({ w, A: 62, E: 24, dep: DEP });
//   const quads = [
//     ...RB.rim(RB.sampleClosed(outline), { tones: [lo, hi] }),      // a blob: each outline point rolls back
//     ...RB.chords(leftEdge, rightEdge, { tones: [lo, hi] }),       // a limb or a vessel: paired edges, half-circles
//   ];
//   group.innerHTML = RB.paint(quads);
//
// Facets facing away from the viewer are culled; the rest are shaded by facing (light from the upper
// left front) between two tones and painted back to front.
function roundBack({ w, A = 62, E = 24, dep = 0, light = [-0.35, 0.55, 0.76] }) {
  const RAD = Math.PI / 180;
  const sA = Math.sin(A * RAD), cA = Math.cos(A * RAD), sE = Math.sin(E * RAD), cE = Math.cos(E * RAD);
  const VIEW = [cA * cE, sA * cE, sE];
  const lm = Math.hypot(...light);
  const L = light.map((v) => v / lm);
  const f1 = (v) => v.toFixed(1);
  const key = (cx, cy, d) => (cx * cA + (dep - d) * sA) * cE - cy * sE;
  const shade = (n, tones) => {
    const lit = Math.max(0, n[0] * L[0] + n[1] * L[1] + n[2] * L[2]);
    const t = Math.round(Math.min(1, 0.18 + 0.95 * lit) * 20) / 20; // 21 tones, so facets can be merged by colour
    const [lo, hi] = tones;
    return `rgb(${lo.map((v, i) => Math.round(v + (hi[i] - v) * t)).join(",")})`;
  };
  const facing = (n) => n[0] * VIEW[0] + n[1] * VIEW[1] + n[2] * VIEW[2];
  const quad = (pts) => `M${pts.map((v) => `${f1(v[0])} ${f1(v[1])}`).join("L")}Z`;

  /** Catmull-Rom (as the figures' smooth(), tension k) sampled into points; closed or open. */
  function sample(points, closed, k = 1, steps = 8) {
    const n = points.length;
    const at = (i) => points[closed ? (i + n) % n : Math.max(0, Math.min(n - 1, i))];
    const out = [points[0]];
    for (let i = 0; i < (closed ? n : n - 1); i++) {
      const p0 = at(i - 1), p1 = at(i), p2 = at(i + 1), p3 = at(i + 2);
      const c1 = [p1[0] + ((p2[0] - p0[0]) / 6) * k, p1[1] + ((p2[1] - p0[1]) / 6) * k];
      const c2 = [p2[0] - ((p3[0] - p1[0]) / 6) * k, p2[1] - ((p3[1] - p1[1]) / 6) * k];
      for (let s = 1; s <= steps; s++) {
        const t = s / steps;
        const u = 1 - t;
        out.push([0, 1].map((c) => u * u * u * p1[c] + 3 * u * u * t * c1[c] + 3 * u * t * t * c2[c] + t * t * t * p2[c]));
      }
    }
    if (closed) out.pop();
    return out;
  }
  /** Resample a polyline to n points evenly by length. */
  function byLength(pts, n) {
    const acc = [0];
    for (let i = 1; i < pts.length; i++) acc.push(acc[i - 1] + Math.hypot(pts[i][0] - pts[i - 1][0], pts[i][1] - pts[i - 1][1]));
    const total = acc[acc.length - 1];
    const out = [];
    let j = 0;
    for (let q = 0; q < n; q++) {
      const want = (total * q) / (n - 1);
      while (j < acc.length - 2 && acc[j + 1] < want) j++;
      const t = (want - acc[j]) / (acc[j + 1] - acc[j] || 1);
      out.push([pts[j][0] + (pts[j + 1][0] - pts[j][0]) * t, pts[j][1] + (pts[j + 1][1] - pts[j][1]) * t]);
    }
    return out;
  }

  /** Paired edges (a limb, a vessel): each chord A_i–B_i swept round behind the cut as a half-circle.
   *  caps: [atStart, atEnd] draws a cut end as a half-ring (wall, then lumen of `lumen` × the radius) when it faces the viewer. */
  function chords(Ae, Be, { round = 0.95, nphi = 24, tones, caps = [false, false], capFill, lumenFill, lumen = 0.7 }) {
    const lv = Ae.map((a, i) => {
      const b = Be[i];
      const h = [(b[0] - a[0]) / 2, (b[1] - a[1]) / 2];
      const r = Math.hypot(h[0], h[1]) || 1e-6;
      return { m: [(a[0] + b[0]) / 2, (a[1] + b[1]) / 2], h, r, u: [h[0] / r, h[1] / r] };
    });
    const pt = (l, ph) => {
      const d = Math.sin(ph) * l.r * round;
      return [l.m[0] + Math.cos(ph) * l.h[0] + d * w[0], l.m[1] + Math.cos(ph) * l.h[1] + d * w[1]];
    };
    const out = [];
    for (let i = 0; i < lv.length - 1; i++) {
      const l0 = lv[i];
      const l1 = lv[i + 1];
      const ux = l0.u[0] + l1.u[0];
      const uy = l0.u[1] + l1.u[1];
      const um = Math.hypot(ux, uy) || 1;
      for (let j = 0; j < nphi; j++) {
        const p0 = (j / nphi) * Math.PI;
        const p1 = ((j + 1) / nphi) * Math.PI;
        const pm = (p0 + p1) / 2;
        const n = [(Math.cos(pm) * ux) / um, -Math.sin(pm), (-Math.cos(pm) * uy) / um];
        if (facing(n) <= 0.01) continue;
        const cx = (l0.m[0] + l1.m[0]) / 2 + (Math.cos(pm) * (l0.h[0] + l1.h[0])) / 2;
        const cy = (l0.m[1] + l1.m[1]) / 2 + (Math.cos(pm) * (l0.h[1] + l1.h[1])) / 2;
        const d = Math.sin(pm) * ((l0.r + l1.r) / 2) * round;
        out.push({ key: key(cx, cy, d), d: quad([pt(l0, p0), pt(l1, p0), pt(l1, p1), pt(l0, p1)]), fill: shade(n, tones) });
      }
    }
    [0, lv.length - 1].forEach((i, e) => {
      if (!caps[e] || lv.length < 2) return;
      const l = lv[i];
      const nb = lv[e ? i - 1 : i + 1];
      const t = [l.m[0] - nb.m[0], l.m[1] - nb.m[1]];
      const tl = Math.hypot(t[0], t[1]) || 1;
      if (facing([t[0] / tl, 0, -t[1] / tl]) <= 0.01) return;
      const ring = (k) => {
        const ps = [];
        for (let j = 0; j <= 24; j++) {
          const ph = (j / 24) * Math.PI;
          const d = Math.sin(ph) * l.r * round * k;
          ps.push([l.m[0] + Math.cos(ph) * l.h[0] * k + d * w[0], l.m[1] + Math.cos(ph) * l.h[1] * k + d * w[1]]);
        }
        return quad(ps);
      };
      const kk = key(l.m[0], l.m[1], l.r * round * 0.4) + 0.5;
      out.push({ key: kk, d: ring(1), fill: capFill || shade([t[0] / tl, 0, -t[1] / tl], tones) });
      out.push({ key: kk + 0.01, d: ring(lumen), fill: lumenFill || "#000" });
    });
    return out;
  }

  /** A closed outline (a blob): each point rolls back over a quarter-round of radius rho(i) toward the inside,
   *  so a circle becomes a hemisphere. Points must be evenly spaced (use byLength). */
  function rim(pts, { rho, round = 0.95, nphi = 10, tones }) {
    const n = pts.length;
    let area = 0;
    for (let i = 0; i < n; i++) area += pts[i][0] * pts[(i + 1) % n][1] - pts[(i + 1) % n][0] * pts[i][1];
    const sgn = area > 0 ? 1 : -1; // outward normal side for this winding (section y points down)
    const nrm = pts.map((p, i) => {
      const a = pts[(i - 1 + n) % n];
      const b = pts[(i + 1) % n];
      const l = Math.hypot(b[0] - a[0], b[1] - a[1]) || 1;
      return [(sgn * (b[1] - a[1])) / l, (-sgn * (b[0] - a[0])) / l];
    });
    const R = pts.map((p, i) => (typeof rho === "function" ? rho(p, i) : rho));
    const pt = (i, ph) => {
      const r = R[i];
      const back = Math.sin(ph) * r * round;
      const inn = (1 - Math.cos(ph)) * r;
      return [pts[i][0] - nrm[i][0] * inn + back * w[0], pts[i][1] - nrm[i][1] * inn + back * w[1]];
    };
    const out = [];
    for (let i = 0; i < n; i++) {
      const i1 = (i + 1) % n;
      const nx = nrm[i][0] + nrm[i1][0];
      const ny = nrm[i][1] + nrm[i1][1];
      const nm = Math.hypot(nx, ny) || 1;
      for (let j = 0; j < nphi; j++) {
        const p0 = (j / nphi) * (Math.PI / 2);
        const p1 = ((j + 1) / nphi) * (Math.PI / 2);
        const pm = (p0 + p1) / 2;
        const nn = [(Math.cos(pm) * nx) / nm, -Math.sin(pm), (-Math.cos(pm) * ny) / nm];
        if (facing(nn) <= 0.01) continue;
        const r = (R[i] + R[i1]) / 2;
        const inn = (1 - Math.cos(pm)) * r;
        const cx = (pts[i][0] + pts[i1][0]) / 2 - (nx / nm) * inn;
        const cy = (pts[i][1] + pts[i1][1]) / 2 - (ny / nm) * inn;
        out.push({ key: key(cx, cy, Math.sin(pm) * r * round), d: quad([pt(i, p0), pt(i1, p0), pt(i1, p1), pt(i, p1)]), fill: shade(nn, tones) });
      }
    }
    return out;
  }

  /** All facets back to front, each with a hairline of its own colour so neighbours meet without seams. */
  function paint(quads) {
    quads.sort((a, b) => a.key - b.key);
    return quads.map((v) => `<path d="${v.d}" fill="${v.fill}" stroke="${v.fill}" stroke-width="0.7" stroke-linejoin="round"/>`).join("");
  }
  /** Several objects (each a list of facets): objects back to front by their mean depth, each object's facets
   *  merged into one path per tone. Far fewer nodes per frame; fine because one object's visible facets don't overlap. */
  function paintObjects(objects) {
    const live = objects.filter((o) => o.length).map((o) => ({ o, k: o.reduce((s, q) => s + q.key, 0) / o.length }));
    live.sort((a, b) => a.k - b.k);
    let svg = "";
    for (const { o } of live) {
      const byFill = new Map();
      for (const q of o) byFill.set(q.fill, (byFill.get(q.fill) || "") + q.d);
      for (const [fill, d] of byFill) svg += `<path d="${d}" fill="${fill}" stroke="${fill}" stroke-width="0.7" stroke-linejoin="round"/>`;
    }
    return svg;
  }
  /** Theme colour (#rrggbb custom property) as [r, g, b]. */
  function rgbOf(el, name, fallback) {
    const v = (getComputedStyle(el).getPropertyValue(name) || "").trim();
    const m = /^#?([0-9a-f]{6})$/i.exec(v) || /^#?([0-9a-f]{6})$/i.exec(fallback);
    return [0, 2, 4].map((i) => parseInt(m[1].slice(i, i + 2), 16));
  }
  return { sampleClosed: (p, k, s) => sample(p, true, k, s), sampleOpen: (p, k, s) => sample(p, false, k, s), byLength, chords, rim, paint, paintObjects, rgbOf };
}
