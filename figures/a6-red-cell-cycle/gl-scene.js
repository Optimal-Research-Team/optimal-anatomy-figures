// A6 · the red cell's loop as a real-time 3-D scene (the figure's own scene for shared/gl3; build.mjs inlines this file).
//
// Everything is modelled in the cut face's own coordinates, the ones the drawing uses: x to the right, y down the
// page, z = depth behind the cut (negative z stands proud of the cut, toward the viewer). One group maps that to the
// kit's world (x, DEP − z, −y), so each part sits exactly where the SVG draws it and the ticks stay registered.
//
//   bone      cortical shell (round back half + the cut ring), marrow face, trabecular lattice, fat cells,
//             two erythroblastic islands (a nurse cell ringed by erythroblasts, early violet to late red)
//   vessel    one open half-pipe: the marrow sinusoid flaring into the 120-day arc and ending inside the spleen
//   spleen    capsule (round back half + cut ring), red-pulp face with cords, white-pulp nodules with arterioles,
//             the macrophage (cytoplasm bed, nucleus, phagosome, ferritin granules under a see-through membrane)
//   return    the transferrin half-pipe from the macrophage back to the lower island
//   movers    red cells (four shapes: made short of iron, full, reticulocyte, old), transferrin, IV complex,
//             ferritin granules, the IV line: all placed each frame from the state live.js draws the SVG from
//
// Where a vessel runs through an organ, the organ's surfaces are cut away around it in the shader (a chain of
// capsules along the vessel), so the open half-pipe reads as one continuous channel from marrow to spleen.
function a6Scene(ctx, DATA) {
  const T = ctx.THREE;
  const night = ctx.night;
  const lo = ctx.coarse;
  const G3 = DATA.g3;
  const MAC = DATA.mac;
  const DEP = DATA.far.dep;
  const sec = new T.Group();
  sec.matrixAutoUpdate = false;
  sec.matrix.set(1, 0, 0, 0, 0, 0, -1, DEP, 0, -1, 0, 0, 0, 0, 0, 1);
  ctx.root.add(sec);

  // ---------------------------------------------------------------- palette (the drawing's, figure.css)
  const PAL = {
    cortex: "#f5ecd6", cortexOut: "#e2d2ac", marrow0: "#b63c42", marrow1: "#6e1c22", trab: "#f1e5c6", fat: "#f4dd96",
    nurse: "#f7e4d3", nurseNuc: "#6d588a", ebEarly: "#7f6cc0", ebLate: "#e0584a", ebNuc: "#33246a",
    sinIn: "#6e1c22", sinRim: "#b25349",
    arcIn: "#cf9690", arcRim: "#dc9488", arcOut: "#a8574c",
    retIn: "#ecdcae", retRim: "#cdb272", retOut: "#a8925a",
    pulp0: "#a03a45", pulp1: "#5c1921", spleenOut: "#863036", capsule: "#c48b80", cords: "#c9736e", white: "#d9a3a0", art: "#8a2230",
    mac0: "#fff3e8", mac1: "#e8cfba", macMem: "#f0d2c0", macNuc: "#6d588a", phago: "#bb786e", gran: "#c98a1c",
    full: "#d2382a", fullP: "#ee7f6a", pale: "#e39a8d", paleP: "#f8dcd3", young: "#b4467a", youngP: "#c9689a", retic: "#fbd2e6", old: "#84201a", oldP: "#a93c30",
    tf: "#e6ad24", ivp: "#a8650c", iv: "#8f9ca6",
  };
  if (night) Object.assign(PAL, { tf: "#f2c044", ivp: "#d08a1c", iv: "#b9c2c9" });

  // ---------------------------------------------------------------- small maths
  const hash = (n) => {
    const x = Math.sin(n * 127.1 + 311.7) * 43758.5453;
    return x - Math.floor(x);
  };
  const lerp = (a, b, t) => a + (b - a) * t;
  const sat = (v) => Math.min(1, Math.max(0, v));
  const sstep = (a, b, v) => {
    const t = sat((v - a) / (b - a));
    return t * t * (3 - 2 * t);
  };
  const col = (hex) => new T.Color(hex);
  const rgb = (hex) => {
    const c = col(hex);
    return [c.r, c.g, c.b];
  };
  const mix3 = (a, b, t) => [lerp(a[0], b[0], t), lerp(a[1], b[1], t), lerp(a[2], b[2], t)];
  const inPoly = (P, x, y) => {
    let c = false;
    for (let i = 0, j = P.length - 1; i < P.length; j = i++) {
      const [xi, yi] = P[i];
      const [xj, yj] = P[j];
      if (yi > y !== yj > y && x < ((xj - xi) * (y - yi)) / (yj - yi) + xi) c = !c;
    }
    return c;
  };

  // ---------------------------------------------------------------- curves
  /** The figures' smooth(): a closed uniform Catmull-Rom through pts, sampled. */
  function closedCurve(pts, steps = 10) {
    const n = pts.length;
    const out = [];
    for (let i = 0; i < n; i++) {
      const p0 = pts[(i - 1 + n) % n], p1 = pts[i], p2 = pts[(i + 1) % n], p3 = pts[(i + 2) % n];
      const c1 = [p1[0] + (p2[0] - p0[0]) / 6, p1[1] + (p2[1] - p0[1]) / 6];
      const c2 = [p2[0] - (p3[0] - p1[0]) / 6, p2[1] - (p3[1] - p1[1]) / 6];
      for (let s = 0; s < steps; s++) {
        const t = s / steps;
        const u = 1 - t;
        out.push([0, 1].map((c) => u * u * u * p1[c] + 3 * u * u * t * c1[c] + 3 * u * t * t * c2[c] + t * t * t * p2[c]));
      }
    }
    return out;
  }
  const lengthOf = (P) => P.slice(1).reduce((s, p, i) => s + Math.hypot(p[0] - P[i][0], p[1] - P[i][1]), 0);
  /** n points evenly spaced by length along a polyline (every component is interpolated); closed: round the loop. */
  function evenly(poly, n, closed = false) {
    const P = closed ? [...poly, poly[0]] : poly;
    const acc = [0];
    for (let i = 1; i < P.length; i++) acc.push(acc[i - 1] + Math.hypot(P[i][0] - P[i - 1][0], P[i][1] - P[i - 1][1]));
    const L = acc[acc.length - 1];
    const out = [];
    let j = 0;
    for (let q = 0; q < n; q++) {
      const want = (L * q) / (closed ? n : n - 1);
      while (j < acc.length - 2 && acc[j + 1] < want) j++;
      const t = sat((want - acc[j]) / (acc[j + 1] - acc[j] || 1));
      out.push(P[j].map((v, c) => v + (P[j + 1][c] - v) * t));
    }
    return out;
  }
  /** Outward unit normals of a closed outline (y points down the page). */
  function outward(poly) {
    const n = poly.length;
    let area = 0;
    for (let i = 0; i < n; i++) area += poly[i][0] * poly[(i + 1) % n][1] - poly[(i + 1) % n][0] * poly[i][1];
    const s = area > 0 ? 1 : -1;
    return poly.map((p, i) => {
      const a = poly[(i - 1 + n) % n];
      const b = poly[(i + 1) % n];
      const l = Math.hypot(b[0] - a[0], b[1] - a[1]) || 1;
      return [(s * (b[1] - a[1])) / l, (-s * (b[0] - a[0])) / l];
    });
  }
  const grow = (poly, nrm, d) => poly.map((p, i) => [p[0] + nrm[i][0] * d, p[1] + nrm[i][1] * d]);
  const centreOf = (poly) => [poly.reduce((s, p) => s + p[0], 0) / poly.length, poly.reduce((s, p) => s + p[1], 0) / poly.length];
  const quad = (a, m, b, n) => Array.from({ length: n + 1 }, (_, i) => {
    const t = i / n;
    const u = 1 - t;
    return [u * u * a[0] + 2 * u * t * m[0] + t * t * b[0], u * u * a[1] + 2 * u * t * m[1] + t * t * b[1]];
  });

  // ---------------------------------------------------------------- geometry
  const bag = (colored = false) => ({ pos: [], idx: [], col: colored ? [] : null });
  function finish(b) {
    const g = new T.BufferGeometry();
    g.setAttribute("position", new T.Float32BufferAttribute(b.pos, 3));
    if (b.col) g.setAttribute("color", new T.Float32BufferAttribute(b.col, 3));
    g.setIndex(b.idx);
    g.computeVertexNormals();
    return g;
  }
  /** nu × nv points from fn(i, j), joined as a sheet (wrap closes it in i). out(x, y, z, i, j) is roughly the outward
   *  direction at a facet; the sheet's winding is turned to agree with it. */
  function grid(b, nu, nv, fn, { wrap = false, out = null, color = null } = {}) {
    const base = b.pos.length / 3;
    for (let i = 0; i < nu; i++)
      for (let j = 0; j < nv; j++) {
        const p = fn(i, j);
        b.pos.push(p[0], p[1], p[2]);
        if (b.col) {
          const c = typeof color === "function" ? color(i, j) : color;
          b.col.push(c[0], c[1], c[2]);
        }
      }
    const at = (i, j) => base + (i % nu) * nv + j;
    const start = b.idx.length;
    const ni = wrap ? nu : nu - 1;
    for (let i = 0; i < ni; i++) for (let j = 0; j < nv - 1; j++) b.idx.push(at(i, j), at(i + 1, j), at(i + 1, j + 1), at(i, j), at(i + 1, j + 1), at(i, j + 1));
    if (!out) return;
    let score = 0;
    const P = b.pos;
    for (let t = start; t < b.idx.length; t += 3) {
      const v0 = b.idx[t] - base;
      const a = b.idx[t] * 3, c = b.idx[t + 1] * 3, d = b.idx[t + 2] * 3;
      const ux = P[c] - P[a], uy = P[c + 1] - P[a + 1], uz = P[c + 2] - P[a + 2];
      const vx = P[d] - P[a], vy = P[d + 1] - P[a + 1], vz = P[d + 2] - P[a + 2];
      const o = out((P[a] + P[c] + P[d]) / 3, (P[a + 1] + P[c + 1] + P[d + 1]) / 3, (P[a + 2] + P[c + 2] + P[d + 2]) / 3, Math.floor(v0 / nv), v0 % nv);
      score += (uy * vz - uz * vy) * o[0] + (uz * vx - ux * vz) * o[1] + (ux * vy - uy * vx) * o[2];
    }
    if (score < 0)
      for (let t = start; t < b.idx.length; t += 3) {
        const k = b.idx[t + 1];
        b.idx[t + 1] = b.idx[t + 2];
        b.idx[t + 2] = k;
      }
  }
  /** A flat face at depth z, seen from the cut. */
  function face(b, poly, z, color) {
    const base = b.pos.length / 3;
    for (const p of poly) {
      b.pos.push(p[0], p[1], z);
      if (b.col) b.col.push(color[0], color[1], color[2]);
    }
    for (const [i0, i1, i2] of T.ShapeUtils.triangulateShape(poly.map((p) => new T.Vector2(p[0], p[1])), [])) {
      const a = poly[i0], c = poly[i1], d = poly[i2];
      if ((c[0] - a[0]) * (d[1] - a[1]) - (c[1] - a[1]) * (d[0] - a[0]) < 0) b.idx.push(base + i0, base + i1, base + i2);
      else b.idx.push(base + i0, base + i2, base + i1);
    }
  }
  /** A closed outline swelled into a dome: every point runs to the centre as the surface rises h (h < 0: toward the viewer). */
  function dome(b, ring, c, z0, h, rows, color = null, full = 1) {
    grid(b, ring.length, rows + 1, (i, j) => {
      const ph = ((j / rows) * Math.PI) / 2;
      const k = Math.pow(Math.cos(ph), full);
      return [c[0] + (ring[i][0] - c[0]) * k, c[1] + (ring[i][1] - c[1]) * k, z0 + h * Math.sin(ph)];
    }, { wrap: true, out: (x, y, z) => [x - c[0], y - c[1], (z - z0) * 2], color });
  }
  /** A ball (sz flattens it front to back). */
  function ball(b, c, r, seg, color = null, sz = 1) {
    const nv = Math.max(4, seg >> 1) + 1;
    grid(b, seg, nv, (i, j) => {
      const a = (i / seg) * Math.PI * 2;
      const ph = (j / (nv - 1)) * Math.PI;
      const s = Math.sin(ph) * r;
      return [c[0] + Math.cos(a) * s, c[1] + Math.sin(a) * s, c[2] + Math.cos(ph) * r * sz];
    }, { wrap: true, out: (x, y, z) => [x - c[0], y - c[1], z - c[2]], color });
  }
  /** A round strut along [x, y, z, r] points, with rounded ends. */
  function tube(b, pts, seg, color = null) {
    const n = pts.length;
    const fr = pts.map((p, i) => {
      const a = pts[Math.max(0, i - 1)];
      const c = pts[Math.min(n - 1, i + 1)];
      let t = [c[0] - a[0], c[1] - a[1], c[2] - a[2]];
      const l = Math.hypot(t[0], t[1], t[2]) || 1;
      t = [t[0] / l, t[1] / l, t[2] / l];
      const l1 = Math.hypot(t[0], t[1]) || 1;
      const n1 = [-t[1] / l1, t[0] / l1, 0];
      return { t, n1, n2: [t[1] * n1[2] - t[2] * n1[1], t[2] * n1[0] - t[0] * n1[2], t[0] * n1[1] - t[1] * n1[0]] };
    });
    const rings = [{ i: 0, s: -1, k: 0.03 }, { i: 0, s: -0.6, k: 0.78 }];
    for (let i = 0; i < n; i++) rings.push({ i, s: 0, k: 1 });
    rings.push({ i: n - 1, s: 0.6, k: 0.78 }, { i: n - 1, s: 1, k: 0.03 });
    grid(b, seg, rings.length, (i, j) => {
      const R = rings[j];
      const p = pts[R.i];
      const f = fr[R.i];
      const a = (i / seg) * Math.PI * 2;
      const ca = Math.cos(a) * p[3] * R.k;
      const sa = Math.sin(a) * p[3] * R.k;
      const ax = R.s * p[3];
      return [p[0] + f.t[0] * ax + f.n1[0] * ca + f.n2[0] * sa, p[1] + f.t[1] * ax + f.n1[1] * ca + f.n2[1] * sa, p[2] + f.t[2] * ax + f.n1[2] * ca + f.n2[2] * sa];
    }, { wrap: true, out: (x, y, z, i, j) => [x - pts[rings[j].i][0], y - pts[rings[j].i][1], z - pts[rings[j].i][2]], color });
  }
  /** A path of [x, y, R, w] points resampled every ds, with unit tangents: { x, y, tx, ty, R, w, wall }. */
  function channel(pts, ds) {
    const P = evenly(pts, Math.max(4, Math.round(lengthOf(pts) / ds) + 1));
    return P.map((p, i) => {
      const a = P[Math.max(0, i - 1)];
      const c = P[Math.min(P.length - 1, i + 1)];
      const l = Math.hypot(c[0] - a[0], c[1] - a[1]) || 1;
      return { x: p[0], y: p[1], tx: (c[0] - a[0]) / l, ty: (c[1] - a[1]) / l, R: p[2], w: p[3], wall: 0.5 + 0.045 * p[2] };
    });
  }
  /** An open half-pipe behind the cut along a channel: inner and outer walls, the cut rims, quarter-sphere ends. */
  function halfPipe(b, path, M, tint) {
    const capN = lo ? 4 : 6;
    const ext = (p, dir, m) => {
      const be = ((m / capN) * Math.PI) / 2;
      const Ro = p.R + p.wall;
      const Ri = p.R - p.wall;
      const s = Ro * Math.sin(be);
      return { x: p.x + dir * p.tx * s, y: p.y + dir * p.ty * s, tx: p.tx, ty: p.ty, ro: Math.max(0.03, Ro * Math.cos(be)), ri: Math.sqrt(Math.max(0.0009, Ri * Ri - s * s)), w: p.w };
    };
    const S = [];
    for (let m = capN; m >= 1; m--) S.push(ext(path[0], -1, m));
    for (const p of path) S.push({ x: p.x, y: p.y, tx: p.tx, ty: p.ty, ro: p.R + p.wall, ri: p.R - p.wall, w: p.w });
    for (let m = 1; m <= capN; m++) S.push(ext(path[path.length - 1], 1, m));
    const pt = (s, r, th) => {
      const c = Math.cos(th) * r;
      return [s.x - s.ty * c, s.y + s.tx * c, Math.sin(th) * r];
    };
    grid(b, S.length, M + 1, (i, j) => pt(S[i], S[i].ri, (j / M) * Math.PI), { out: (x, y, z, i) => [S[i].x - x, S[i].y - y, -z], color: (i) => tint.inner(S[i].w) });
    grid(b, S.length, M + 1, (i, j) => pt(S[i], S[i].ro, (j / M) * Math.PI), { out: (x, y, z, i) => [x - S[i].x, y - S[i].y, z], color: (i) => tint.outer(S[i].w) });
    for (const th of [0, Math.PI]) grid(b, S.length, 2, (i, j) => { const p = pt(S[i], j ? S[i].ro : S[i].ri, th); return [p[0], p[1], 0]; }, { out: () => [0, 0, -1], color: (i) => tint.rim(S[i].w) });
  }
  /** The capsules that cut an organ's surfaces away around a channel: [ax, ay, bx, by, ra, rb] for the stretch inside box. */
  function cutsOf(path, box, every) {
    const out = [];
    const step = Math.max(1, Math.round(every));
    for (let i = 0; i < path.length - 1; i += step) {
      const a = path[i];
      const c = path[Math.min(path.length - 1, i + step)];
      const inBox = (p) => p.x > box[0] - p.R - 4 && p.x < box[2] + p.R + 4 && p.y > box[1] - p.R - 4 && p.y < box[3] + p.R + 4;
      if (inBox(a) || inBox(c)) out.push([a.x, a.y, c.x, c.y, a.R, c.R]);
    }
    return out;
  }
  const boxOf = (poly, pad = 0) => [Math.min(...poly.map((p) => p[0])) - pad, Math.min(...poly.map((p) => p[1])) - pad, Math.max(...poly.map((p) => p[0])) + pad, Math.max(...poly.map((p) => p[1])) + pad];

  // ---------------------------------------------------------------- materials
  // One patched physical material: an optional chain of capsules that cuts the surface away (where a vessel runs
  // through an organ), an optional radial tone (the drawing's gradients), procedural mottle and micro-relief, and for
  // see-through cells an opacity that rises toward the silhouette (a membrane) and under highlights.
  const mats = [];
  const FRAG_PARS = `
varying vec3 vSec;
#if A6_NSEG > 0
uniform vec4 uSeg[ A6_NSEG ]; uniform vec2 uSegR[ A6_NSEG ];
#endif
#ifdef A6_GRAD
uniform vec4 uGrad; uniform vec3 uGradCol;
#endif
#ifdef A6_TEX
uniform vec3 uTex;
float a6h( vec3 p ) { p = fract( p * 0.3183099 + 0.1 ); p *= 17.0; return fract( p.x * p.y * p.z * ( p.x + p.y + p.z ) ); }
float a6n( vec3 x ) { vec3 i = floor( x ); vec3 f = fract( x ); f = f * f * ( 3.0 - 2.0 * f );
  return mix( mix( mix( a6h( i ), a6h( i + vec3( 1, 0, 0 ) ), f.x ), mix( a6h( i + vec3( 0, 1, 0 ) ), a6h( i + vec3( 1, 1, 0 ) ), f.x ), f.y ),
              mix( mix( a6h( i + vec3( 0, 0, 1 ) ), a6h( i + vec3( 1, 0, 1 ) ), f.x ), mix( a6h( i + vec3( 0, 1, 1 ) ), a6h( i + vec3( 1, 1, 1 ) ), f.x ), f.y ), f.z ); }
float a6f( vec3 p ) { return 0.55 * a6n( p ) + 0.3 * a6n( p * 2.07 + 1.3 ) + 0.15 * a6n( p * 4.3 + 3.1 ); }
#endif
#ifdef A6_RIM
uniform vec3 uRim;
#endif
#ifdef A6_FADE
uniform vec3 uFade;
#endif
`;
  const FRAG_CUT = `
#if A6_NSEG > 0
for ( int i = 0; i < A6_NSEG; i ++ ) {
  vec2 a6a = uSeg[ i ].xy; vec2 a6pa = vSec.xy - a6a; vec2 a6ba = uSeg[ i ].zw - a6a;
  float a6t = clamp( dot( a6pa, a6ba ) / max( dot( a6ba, a6ba ), 1e-4 ), 0.0, 1.0 );
  float a6r = mix( uSegR[ i ].x, uSegR[ i ].y, a6t );
  vec2 a6q = a6pa - a6ba * a6t;
  if ( dot( a6q, a6q ) + vSec.z * vSec.z < a6r * a6r ) discard;
}
#endif
`;
  const FRAG_COLOR = `
#ifdef A6_GRAD
{ float a6g = clamp( length( ( vSec.xy - uGrad.xy ) * uGrad.zw ), 0.0, 1.0 ); diffuseColor.rgb = mix( diffuseColor.rgb, uGradCol, a6g * a6g * ( 3.0 - 2.0 * a6g ) ); }
#endif
#ifdef A6_TEX
{ float a6m = a6f( vSec * uTex.z * 0.31 + 11.0 ); diffuseColor.rgb *= 1.0 + uTex.x * ( a6m - 0.5 ) * vec3( 0.9, 1.2, 1.2 ); }
#endif
#ifdef A6_FADE
diffuseColor.rgb *= mix( 1.0, uFade.z, smoothstep( uFade.x, uFade.y, vSec.z ) );
#endif
`;
  const FRAG_BUMP = `
#ifdef A6_TEX
if ( uTex.y > 0.0 ) {
  float a6e = a6f( vSec * uTex.z ) * uTex.y;
  vec3 a6sx = dFdx( - vViewPosition ); vec3 a6sy = dFdy( - vViewPosition );
  vec3 a6r1 = cross( a6sy, normal ); vec3 a6r2 = cross( normal, a6sx );
  float a6d = dot( a6sx, a6r1 ) * faceDirection;
  normal = normalize( abs( a6d ) * normal - sign( a6d ) * ( dFdx( a6e ) * a6r1 + dFdy( a6e ) * a6r2 ) );
}
#endif
`;
  const FRAG_RIM = `
#ifdef A6_RIM
{ float a6v = 1.0 - saturate( dot( normal, geometryViewDir ) );
  diffuseColor.a = clamp( mix( diffuseColor.a, uRim.x, pow( a6v, uRim.y ) ) + dot( totalSpecular, vec3( 0.3333 ) ) * uRim.z, 0.0, 1.0 ); }
#endif
`;
  function mat({ cut = null, grad = null, mottle = 0, bump = 0, freq = 0.3, rim = null, fade = null, ...phys }) {
    const m = new T.MeshPhysicalMaterial({ metalness: 0, roughness: 0.5, ...phys });
    const defs = { A6_NSEG: cut ? cut.length : 0 };
    const U = {};
    if (cut && cut.length) {
      U.uSeg = { value: cut.map((s) => new T.Vector4(s[0], s[1], s[2], s[3])) };
      U.uSegR = { value: cut.map((s) => new T.Vector2(s[4], s[5])) };
    }
    if (grad) {
      defs.A6_GRAD = "";
      U.uGrad = { value: new T.Vector4(grad.c[0], grad.c[1], 1 / grad.r[0], 1 / grad.r[1]) };
      U.uGradCol = { value: col(grad.color) };
    }
    if (mottle || bump) {
      defs.A6_TEX = "";
      U.uTex = { value: new T.Vector3(mottle, bump, freq) };
    }
    if (rim) {
      defs.A6_RIM = "";
      U.uRim = { value: new T.Vector3(rim.a, rim.p, rim.s || 0) };
    }
    if (fade) {
      // darker with depth behind the cut: the falloff that makes a round back or an open pipe read as round
      defs.A6_FADE = "";
      U.uFade = { value: new T.Vector3(fade[0], fade[1], fade[2]) };
    }
    m.defines = { ...(m.defines || {}), ...defs };
    m.onBeforeCompile = (sh) => {
      Object.assign(sh.uniforms, U);
      sh.vertexShader = sh.vertexShader.replace("#include <common>", "#include <common>\nvarying vec3 vSec;").replace("#include <begin_vertex>", "#include <begin_vertex>\nvSec = position;");
      sh.fragmentShader = sh.fragmentShader
        .replace("#include <common>", `#include <common>\n${FRAG_PARS}`)
        .replace("#include <clipping_planes_fragment>", `#include <clipping_planes_fragment>\n${FRAG_CUT}`)
        .replace("#include <color_fragment>", `#include <color_fragment>\n${FRAG_COLOR}`)
        .replace("#include <normal_fragment_maps>", `#include <normal_fragment_maps>\n${FRAG_BUMP}`)
        .replace("#include <opaque_fragment>", `${FRAG_RIM}\n#include <opaque_fragment>`);
    };
    m.customProgramCacheKey = () => `a6|${Object.keys(defs).join("|")}|${defs.A6_NSEG}`;
    mats.push(m);
    return m;
  }
  const WET = { sheen: 0.22, sheenRoughness: 0.5, clearcoat: 0.35, clearcoatRoughness: 0.34 };
  const solid = (geo, material, { cast = false, receive = true } = {}) => {
    const mesh = new T.Mesh(geo, material);
    mesh.castShadow = cast;
    mesh.receiveShadow = receive;
    mesh.matrixAutoUpdate = false;
    sec.add(mesh);
    return mesh;
  };
  const glassy = (mesh, order = 1) => {
    mesh.renderOrder = order;
    return ctx.ghost(mesh);
  };

  // ---------------------------------------------------------------- the two channels (vessels)
  const DS = lo ? 5 : 3.2;
  const HALF = lo ? 10 : 16;
  // marrow sinusoid → the 120-day arc → inside the spleen. [x, y, lumen radius, 0 sinusoid … 1 arc]
  const isl0 = DATA.islands[0].c;
  const sinPts = DATA.sinus.filter((p) => Math.hypot(p[0] - isl0[0], p[1] - isl0[1]) >= 13);
  const Ls = lengthOf(sinPts);
  const arcL = lengthOf(DATA.arc);
  let run = 0;
  const loopPts = sinPts.map((p, i) => {
    if (i) run += Math.hypot(p[0] - sinPts[i - 1][0], p[1] - sinPts[i - 1][1]);
    return [p[0], p[1], lerp(lerp(7.5, 9, run / Ls), 17, sstep(Ls - 20, Ls - 1, run)), sstep(Ls - 22, Ls + 6, run)];
  });
  run = 0;
  DATA.arc.forEach((p, i) => {
    if (!i) return;
    run += Math.hypot(p[0] - DATA.arc[i - 1][0], p[1] - DATA.arc[i - 1][1]);
    loopPts.push([p[0], p[1], lerp(17, 15, run / arcL), sstep(Ls - 22, Ls + 6, Ls + run)]);
  });
  const LOOP = channel(loopPts, DS);
  // the transferrin return: from under the macrophage to under the lower island's nurse cell
  const retL = lengthOf(DATA.ret);
  run = 0;
  const retPts = [];
  DATA.ret.forEach((p, i) => {
    if (i) run += Math.hypot(p[0] - DATA.ret[i - 1][0], p[1] - DATA.ret[i - 1][1]);
    if (Math.hypot(p[0] - MAC.c[0], p[1] - MAC.c[1]) >= 34 || i > 6) retPts.push([p[0], p[1], lerp(7, 6, run / retL), 0]);
  });
  const BACK = channel(retPts, DS);

  // ---------------------------------------------------------------- an organ cut in half: round back, cut rim, cut face
  const RINGN = lo ? 84 : 128;
  function organ({ outline, depth, rim, rimProud, faceZ, shell, rimMat, faceMat }) {
    const ring = evenly(closedCurve(outline, 10), RINGN, true);
    const nrm = outward(ring);
    const c = centreOf(ring);
    const outer = grow(ring, nrm, rim[0]);
    const b = bag();
    dome(b, outer, c, 0, depth, lo ? 12 : 18);
    solid(finish(b), shell);
    // the cut rim (cortex / capsule): crowned a little proud of the cut, then its inner wall down to the tissue
    const prof = [[rim[0], 0.8]];
    for (let k = 0; k <= 6; k++) prof.push([rim[0] - 0.15 - (k / 6) * (rim[0] + rim[1] - 0.3), -rimProud * (1 - Math.pow(Math.abs((2 * k) / 6 - 1), 2.6))]);
    prof.push([-rim[1], faceZ + 2.5]);
    const rb = bag();
    grid(rb, RINGN, prof.length, (i, j) => [ring[i][0] + nrm[i][0] * prof[j][0], ring[i][1] + nrm[i][1] * prof[j][0], prof[j][1]], { wrap: true, out: () => [0, 0, -1] });
    solid(finish(rb), rimMat);
    const fb = bag();
    const inner = grow(ring, nrm, -rim[1] + 1);
    face(fb, inner, faceZ, null);
    solid(finish(fb), faceMat);
    return { ring, nrm, c, inner: grow(ring, nrm, -rim[1] + 1.5), box: boxOf(outer) };
  }

  // ---------------------------------------------------------------- bone and marrow (left)
  const boneBox = boxOf(DATA.far.bone, 8);
  const boneCut = [...cutsOf(LOOP, boneBox, 9 / DS), ...cutsOf(BACK, boneBox, 9 / DS)];
  const MZ = 3; // the marrow face sits this far behind the cortex's cut
  const bw = boneBox[2] - boneBox[0];
  const bh = boneBox[3] - boneBox[1];
  const BONE = organ({
    outline: DATA.far.bone,
    depth: 72,
    rim: [7, 6],
    rimProud: 1.7,
    faceZ: MZ,
    shell: mat({ color: PAL.cortexOut, roughness: 0.6, sheen: 0.2, sheenRoughness: 0.6, clearcoat: 0.1, clearcoatRoughness: 0.5, mottle: 0.14, bump: 0.2, freq: 0.16, fade: [1, 62, 0.6], cut: boneCut }),
    rimMat: mat({ color: PAL.cortex, roughness: 0.6, sheen: 0.2, sheenRoughness: 0.6, mottle: 0.08, bump: 0.12, freq: 0.5, cut: boneCut }),
    faceMat: mat({ color: PAL.marrow0, roughness: 0.5, ...WET, sheenColor: "#ffc9bd", cut: boneCut, clearcoat: 0.5, grad: { c: [boneBox[0] + bw * 0.45, boneBox[1] + bh * 0.45], r: [bw * 0.66, bh * 0.66], color: PAL.marrow1 }, mottle: 0.44, bump: 0.7, freq: 0.17 }),
  });
  {
    // trabecular bone: the drawing's lattice as round struts, half sunk in the marrow and running into the cortex
    const b = bag();
    const zOf = (x, y) => 1.3 + 2.7 * hash(x * 0.37 + y * 0.73);
    const seg = lo ? 6 : 8;
    const inside = (p) => inPoly(BONE.inner, p[0], p[1]);
    for (const s of G3.struts) {
      const pts = quad([s[0], s[1]], [s[2], s[3]], [s[4], s[5]], lo ? 5 : 7);
      const z0 = zOf(s[0], s[1]);
      const z1 = zOf(s[4], s[5]);
      let runPts = [];
      const flush = () => {
        if (runPts.length > 1) tube(b, runPts, seg);
        runPts = [];
      };
      pts.forEach((p, i) => {
        const t = i / (pts.length - 1);
        if (inside(p)) runPts.push([p[0], p[1], lerp(z0, z1, t) + 0.5 * Math.sin(t * Math.PI), 2.55 - 0.45 * Math.sin(t * Math.PI)]);
        else flush();
      });
      flush();
    }
    for (const [x, y, r] of G3.nodes) if (inside([x, y])) ball(b, [x, y, zOf(x, y)], r * 0.92, lo ? 8 : 10);
    solid(finish(b), mat({ color: PAL.trab, roughness: 0.6, sheen: 0.3, sheenRoughness: 0.6, clearcoat: 0.1, clearcoatRoughness: 0.5 }), { cast: true });
  }
  // every repeated body is an InstancedMesh hung from a point deep inside the bone: the shared layer's floor-shadow
  // passes draw an instanced mesh once at its own origin, so that origin has to be somewhere already in shadow
  const HOME = [BONE.c[0], BONE.c[1], 30];
  const M4 = new T.Matrix4();
  const Q = new T.Quaternion();
  const QI = new T.Quaternion();
  const V1 = new T.Vector3();
  const V2 = new T.Vector3();
  const YUP = new T.Vector3(0, 1, 0);
  function many(geo, material, n, { cast = true, receive = true } = {}) {
    const m = new T.InstancedMesh(geo, material, n);
    m.instanceMatrix.setUsage(T.DynamicDrawUsage);
    m.position.set(HOME[0], HOME[1], HOME[2]);
    m.frustumCulled = false;
    m.castShadow = cast;
    m.receiveShadow = receive;
    m.count = 0;
    sec.add(m);
    return m;
  }
  const put = (m, i, x, y, z, sx, sy = sx, sz = sx, q = QI) => {
    V1.set(x - HOME[0], y - HOME[1], z - HOME[2]);
    V2.set(sx, sy, sz);
    M4.compose(V1, q, V2);
    m.setMatrixAt(i, M4);
  };
  const SPH = new T.SphereGeometry(1, lo ? 14 : 20, lo ? 10 : 12);
  const SPH_S = new T.SphereGeometry(1, lo ? 8 : 12, lo ? 6 : 8);
  const SPH_T = new T.SphereGeometry(1, lo ? 6 : 8, lo ? 4 : 6); // the smallest beads
  {
    // fat cells: see-through yellow globules sunk in the marrow
    const fat = many(SPH, mat({ color: PAL.fat, roughness: 0.2, clearcoat: 0.9, clearcoatRoughness: 0.12, transparent: true, opacity: 0.5, depthWrite: false, rim: { a: 0.92, p: 2.0, s: 0.8 } }), G3.fat.length, { receive: false });
    fat.renderOrder = 1;
    G3.fat.forEach(([x, y, r], i) => put(fat, i, x, y, MZ + r * 0.1, r, r, r * 0.5));
    fat.count = G3.fat.length;
    // erythroblastic islands: a nurse macrophage ringed by erythroblasts, early (violet, big nucleus) to late (red, small)
    const cells = G3.islands.flatMap((I) => I.cells);
    // (see-through, but left in the shadow and occlusion passes: they are solid bodies sitting on the marrow)
    const cyto = many(SPH, mat({ color: "#ffffff", roughness: 0.28, clearcoat: 0.8, clearcoatRoughness: 0.15, transparent: true, opacity: 0.36, depthWrite: false, rim: { a: 0.97, p: 2.0, s: 0.6 } }), cells.length, { receive: false });
    cyto.renderOrder = 2;
    const nuc = many(SPH, mat({ color: "#ffffff", roughness: 0.35, clearcoat: 0.5, clearcoatRoughness: 0.25, sheen: 0.4, sheenColor: "#8d7fd0" }), cells.length + G3.islands.length);
    const early = col(PAL.ebEarly);
    const late = col(PAL.ebLate);
    const tint = new T.Color();
    cells.forEach(([x, y, m, rc, rn], i) => {
      const z = MZ - rc * 0.72;
      put(cyto, i, x, y, z, rc, rc, rc * 0.92);
      cyto.setColorAt(i, tint.copy(early).lerp(late, m));
      put(nuc, i, x + 0.6, y - 0.4, z - rc * 0.12, rn, rn, rn * 0.9);
      nuc.setColorAt(i, tint.set(PAL.ebNuc));
    });
    cyto.count = cells.length;
    const nb = bag();
    G3.islands.forEach((I, k) => {
      const ring = evenly(closedCurve(I.nurse, 8), lo ? 28 : 40, true);
      dome(nb, ring, I.c, MZ, -I.r * 0.3, lo ? 6 : 9, null, 0.8);
      put(nuc, cells.length + k, I.nuc[0], I.nuc[1], MZ - I.r * 0.13, I.nuc[2], I.nuc[2], I.nuc[2] * 0.7);
      nuc.setColorAt(cells.length + k, tint.set(PAL.nurseNuc));
    });
    nuc.count = cells.length + G3.islands.length;
    cyto.instanceColor.needsUpdate = nuc.instanceColor.needsUpdate = true;
    solid(finish(nb), mat({ color: PAL.nurse, roughness: 0.3, clearcoat: 0.7, clearcoatRoughness: 0.2, transparent: true, opacity: 0.44, depthWrite: false, rim: { a: 0.96, p: 2.0, s: 0.5 } }), { cast: true, receive: false }).renderOrder = 1;
  }

  // ---------------------------------------------------------------- the vessels
  {
    const sIn = rgb(PAL.sinIn), aIn = rgb(PAL.arcIn), sRim = rgb(PAL.sinRim), aRim = rgb(PAL.arcRim), aOut = rgb(PAL.arcOut);
    const b = bag(true);
    halfPipe(b, LOOP, HALF, { inner: (w) => mix3(sIn, aIn, w), rim: (w) => mix3(sRim, aRim, w), outer: (w) => mix3(sRim, aOut, w) });
    solid(finish(b), mat({ color: "#ffffff", vertexColors: true, roughness: 0.4, ...WET, sheenColor: "#ffe3dc", fade: [0, 15, 0.7] }));
    const rb = bag(true);
    const rIn = rgb(PAL.retIn), rRim = rgb(PAL.retRim), rOut = rgb(PAL.retOut);
    halfPipe(rb, BACK, lo ? 8 : 12, { inner: () => rIn, rim: () => rRim, outer: () => rOut });
    solid(finish(rb), mat({ color: "#ffffff", vertexColors: true, roughness: 0.45, sheen: 0.2, sheenRoughness: 0.5, sheenColor: "#fff4d6", clearcoat: 0.3, clearcoatRoughness: 0.35, fade: [0, 6.5, 0.7] }));
  }

  // ---------------------------------------------------------------- spleen (right)
  const spBox = boxOf(DATA.far.spleen, 6);
  const spCut = [...cutsOf(LOOP, spBox, 9 / DS), ...cutsOf(BACK, spBox, 9 / DS)];
  const PZ = 1.8; // the red-pulp face, behind the capsule's cut
  const sw = spBox[2] - spBox[0];
  const sh = spBox[3] - spBox[1];
  const SPLEEN = organ({
    outline: DATA.far.spleen,
    depth: 64,
    rim: [2.6, 2.2],
    rimProud: 0.9,
    faceZ: PZ,
    shell: mat({ color: PAL.spleenOut, roughness: 0.4, ...WET, clearcoat: 0.6, clearcoatRoughness: 0.22, sheenColor: "#f2a8a0", mottle: 0.2, bump: 0.25, freq: 0.12, fade: [1, 56, 0.58], cut: spCut }),
    rimMat: mat({ color: PAL.capsule, roughness: 0.5, ...WET, sheenColor: "#ffd9cf", cut: spCut }),
    faceMat: mat({ color: PAL.pulp0, roughness: 0.5, ...WET, sheenColor: "#ffbdb2", cut: spCut, clearcoat: 0.5, grad: { c: [spBox[0] + sw * 0.55, spBox[1] + sh * 0.45], r: [sw * 0.7, sh * 0.7], color: PAL.pulp1 }, mottle: 0.4, bump: 0.7, freq: 0.19 }),
  });
  const macRing = evenly(closedCurve(G3.macBody, 10), lo ? 56 : 84, true);
  {
    // red-pulp cords: low ridges on the cut face
    const b = bag();
    const inside = (p) => inPoly(SPLEEN.inner, p[0], p[1]) && Math.hypot(p[0] - MAC.c[0], p[1] - MAC.c[1]) > MAC.r + 6;
    for (const s of G3.cords) {
      const pts = quad([s[0], s[1]], [s[2], s[3]], [s[4], s[5]], lo ? 4 : 6);
      let runPts = [];
      const flush = () => {
        if (runPts.length > 1) tube(b, runPts, 6);
        runPts = [];
      };
      pts.forEach((p, i) => {
        const t = i / (pts.length - 1);
        if (inside(p)) runPts.push([p[0], p[1], PZ + 0.35, 1.05 + 0.5 * Math.sin(t * Math.PI)]);
        else flush();
      });
      flush();
    }
    solid(finish(b), mat({ color: PAL.cords, roughness: 0.45, ...WET, sheenColor: "#ffd2c8" }));
    // white pulp: lymphoid nodules, each a low mound studded with its lymphocytes round the central arteriole
    const wp = many(SPH, mat({ color: PAL.white, roughness: 0.6, sheen: 0.25, sheenRoughness: 0.5, sheenColor: "#ffffff", clearcoat: 0.2, clearcoatRoughness: 0.45 }), G3.white.length, { cast: false });
    const art = many(SPH_T, mat({ color: PAL.art, roughness: 0.3, clearcoat: 0.7, clearcoatRoughness: 0.2 }), G3.white.length);
    const perNodule = lo ? 26 : 40;
    const lym = many(SPH_T, mat({ color: "#ffffff", roughness: 0.5, sheen: 0.3, sheenRoughness: 0.5, sheenColor: "#ffffff", clearcoat: 0.3, clearcoatRoughness: 0.35 }), G3.white.length * perNodule);
    const base = col(PAL.white);
    const tone = new T.Color();
    let nl = 0;
    G3.white.forEach(([x, y, r], i) => {
      const h = r * 0.24;
      put(wp, i, x, y, PZ + 0.6, r * 0.97, r * 0.97, h);
      put(art, i, x + 3, y - 2, PZ + 0.6 - h * 0.97, 2.7, 2.7, 1.5);
      for (let k = 0; k < perNodule; k++) {
        const rho = Math.sqrt((k + 0.6) / perNodule) * 0.93;
        const a = k * 2.39996 + i;
        const bx = x + Math.cos(a) * rho * r;
        const by = y + Math.sin(a) * rho * r;
        if (Math.hypot(bx - x - 3, by - y + 2) < 3.4) continue; // the arteriole's place
        const br = r * (lo ? 0.2 : 0.165) * (0.82 + 0.36 * hash(k * 1.7 + i * 9.1));
        put(lym, nl, bx, by, PZ + 0.6 - h * Math.sqrt(Math.max(0, 1 - rho * rho)) + br * 0.25, br, br, br * 0.8);
        lym.setColorAt(nl++, tone.copy(base).multiplyScalar(0.94 + 0.2 * hash(k * 3.3 + i * 5.7)));
      }
    });
    wp.count = art.count = G3.white.length;
    lym.count = nl;
    lym.instanceColor.needsUpdate = true;
  }
  // the macrophage: a bed of cytoplasm on the cut, its nucleus and phagosome on it, a see-through membrane over them
  const MACZ = -2.6;
  const MACH = 13.5;
  const memZ = (x, y) => {
    // the membrane's height over a point of the bed
    const a = Math.atan2(y - MAC.c[1], x - MAC.c[0]);
    const i = Math.round(((a < 0 ? a + Math.PI * 2 : a) / (Math.PI * 2)) * 12) % 12;
    const rr = Math.hypot(G3.macBody[i][0] - MAC.c[0], G3.macBody[i][1] - MAC.c[1]);
    const rho = Math.min(0.999, Math.hypot(x - MAC.c[0], y - MAC.c[1]) / rr);
    return MACH * Math.sqrt(1 - rho * rho);
  };
  {
    const b = bag();
    face(b, macRing, MACZ, null);
    grid(b, macRing.length, 3, (i, j) => { const p = macRing[i]; const k = j === 0 ? 0.985 : 1; return [MAC.c[0] + (p[0] - MAC.c[0]) * k, MAC.c[1] + (p[1] - MAC.c[1]) * k, j === 0 ? MACZ : j === 1 ? MACZ + 0.5 : PZ + 1.5]; }, { wrap: true, out: (x, y) => [x - MAC.c[0], y - MAC.c[1], 0] });
    const mw = MAC.r * 2.2;
    solid(finish(b), mat({ color: PAL.mac0, roughness: 0.55, sheen: 0.25, sheenRoughness: 0.5, sheenColor: "#ffffff", grad: { c: [MAC.c[0] - mw * 0.1, MAC.c[1] - mw * 0.12], r: [mw * 0.62, mw * 0.62], color: PAL.mac1 }, mottle: 0.12, bump: 0.25, freq: 0.4 }), { cast: true });
    const nb = bag();
    const nr = evenly(closedCurve(G3.macNuc, 10), lo ? 28 : 44, true);
    dome(nb, nr, centreOf(nr), MACZ, -7.5, lo ? 6 : 10, null, 0.85);
    solid(finish(nb), mat({ color: PAL.macNuc, roughness: 0.4, ...WET, sheenColor: "#c9b8e6", mottle: 0.2, bump: 0.3, freq: 0.5 }), { cast: true });
    const pb = bag();
    ball(pb, [G3.phago[0], G3.phago[1], MACZ - 5.6], G3.phago[2], lo ? 16 : 24, null, 0.42);
    glassy(solid(finish(pb), mat({ color: PAL.phago, roughness: 0.3, clearcoat: 0.6, clearcoatRoughness: 0.2, transparent: true, opacity: 0.5, depthWrite: false, rim: { a: 0.9, p: 1.4, s: 0.4 } }), { receive: false }), 1);
    const mb = bag();
    dome(mb, macRing, MAC.c, MACZ, -MACH, lo ? 9 : 14);
    solid(finish(mb), mat({ color: PAL.macMem, roughness: 0.16, clearcoat: 1, clearcoatRoughness: 0.1, transparent: true, opacity: 0.2, depthWrite: false, rim: { a: 0.9, p: 1.7, s: 1.6 } }), { receive: false }).renderOrder = 3;
  }
  // ferritin granules: every slot of the drawing, shown in the same order as the store fills
  const gran = many(SPH_S, mat({ color: PAL.gran, roughness: 0.32, metalness: 0.25, clearcoat: 0.6, clearcoatRoughness: 0.2, ...(night ? { emissive: "#5a3a06", emissiveIntensity: 0.35 } : {}) }), DATA.gran.length);
  DATA.gran.forEach(([x, y], i) => {
    const room = Math.max(0, memZ(x, y) - 7.4);
    put(gran, i, x, y, MACZ - 2.75 - room * hash(i * 3.1 + 0.4) * 0.7, 2.75);
  });

  // ---------------------------------------------------------------- red cells
  // A lathe of the real cross-section (after Evans and Fung): half-thickness ∝ √(1−ρ²)·(c0 + c1ρ² + c2ρ⁴). The dimple
  // is paler (thinner cell, less hemoglobin in the light path): the drawing's central pallor.
  function cellGeo(R, [c0, c1, c2], thick, body, pallor, [p0, p1]) {
    const K = lo ? 4 : 6;
    const seg = lo ? 12 : 16;
    const prof = [];
    for (let k = 0; k <= K; k++) prof.push([Math.sin(((k / K) * Math.PI) / 2), 1]);
    for (let k = K - 1; k >= 0; k--) prof.push([Math.sin(((k / K) * Math.PI) / 2), -1]);
    const b = bag(true);
    const cb = rgb(body);
    const cp = rgb(pallor);
    grid(b, seg, prof.length, (i, j) => {
      const [rho, side] = prof[j];
      const a = (i / seg) * Math.PI * 2;
      const h = side * thick * R * 0.5 * Math.sqrt(Math.max(0, 1 - rho * rho)) * (c0 + c1 * rho * rho + c2 * rho * rho * rho * rho);
      return [Math.cos(a) * rho * R, h, Math.sin(a) * rho * R];
    }, { wrap: true, out: (x, y, z) => [x, y * 3, z], color: (i, j) => mix3(cp, cb, sstep(p0, p1, prof[j][0])) });
    return finish(b);
  }
  const cellMat = (o = {}) => mat({ color: "#ffffff", vertexColors: true, roughness: 0.36, clearcoat: 0.55, clearcoatRoughness: 0.2, sheen: 0.4, sheenRoughness: 0.5, sheenColor: "#ffb3a6", ...o });
  const NC = 200;
  const CELLS = [
    many(cellGeo(5.0, [0.06, 1.9, -1.1], 0.95, PAL.pale, PAL.paleP, [0.25, 0.72]), cellMat({ sheen: 0.2, clearcoat: 0.4 }), NC), // made short of iron: small, thin, wide pallor
    many(cellGeo(5.8, [0.24, 2.0, -1.12], 1.3, PAL.full, PAL.fullP, [0.1, 0.5]), cellMat(), NC), // made with enough iron
    many(cellGeo(5.9, [0.62, 1.1, -0.7], 1.45, PAL.young, PAL.youngP, [0.0, 0.5]), cellMat({ sheenColor: "#ffc4e0" }), 24), // reticulocyte: larger, plumper
    many(cellGeo(4.6, [0.95, 0.8, -0.55], 1.5, PAL.old, PAL.oldP, [0.0, 0.45]), cellMat({ sheenColor: "#e08a7c" }), 60), // old: darker, rounder
  ];
  const reticDots = many(SPH_T, mat({ color: PAL.retic, roughness: 0.4 }), 48, { cast: false });
  const tfBeads = many(SPH_S, mat({ color: PAL.tf, roughness: 0.3, clearcoat: 0.6, clearcoatRoughness: 0.2, ...(night ? { emissive: "#6a4a08", emissiveIntensity: 0.3 } : {}) }), 220);
  const ivBeads = many(SPH_T, mat({ color: PAL.ivp, roughness: 0.35, clearcoat: 0.5, clearcoatRoughness: 0.25 }), 80);

  // ---------------------------------------------------------------- the IV line (shown around the dose)
  const ivMat = mat({ color: PAL.iv, roughness: 0.3, clearcoat: 0.7, clearcoatRoughness: 0.2, transparent: true, opacity: 0 });
  const iv = new T.Group();
  {
    const [a, c] = G3.iv.line;
    const l = Math.hypot(c[0] - a[0], c[1] - a[1]);
    const d = [(c[0] - a[0]) / l, (c[1] - a[1]) / l];
    const b = bag();
    tube(b, [[a[0], a[1], 1.2, 1.5], [c[0] + d[0] * 5, c[1] + d[1] * 5, 1.2, 1.5]], lo ? 8 : 12);
    // the hub: the drawn rectangle as a tapered barrel on the same axis
    const hc = centreOf(G3.iv.hub);
    const hub = [-11, -9.6, -3, 4, 9.4, 10.6].map((s, i) => [hc[0] + d[0] * s, hc[1] + d[1] * s, 1.2, [5.2, 7.4, 7.4, 5.6, 4.6, 2.2][i]]);
    tube(b, hub, lo ? 12 : 18);
    const mesh = new T.Mesh(finish(b), ivMat);
    mesh.receiveShadow = true;
    iv.add(ctx.ghost(mesh));
    iv.visible = false;
    sec.add(iv);
  }

  // ---------------------------------------------------------------- every frame: place the movers from the figure's state
  const VIEW = (() => {
    // toward the viewer, in section coordinates
    const A = (ctx.P.azimuth * Math.PI) / 180;
    const E = (ctx.P.elevation * Math.PI) / 180;
    return [Math.cos(A) * Math.cos(E), -Math.sin(E), -Math.sin(A) * Math.cos(E)];
  })();
  const AX = new T.Vector3();
  let ivShown = 0;
  let shownGran = -1;
  // The shared layer's key light stands almost overhead (right for machines on a floor). This scene is a relief on an
  // upright cut face, which that light only rakes: so, once, the key is re-aimed from the upper left in front of the
  // cut, and its shadow map is fitted to the scene so cells and struts drop a short soft shadow on the tissue.
  // (A workaround inside this figure: the layer has no per-figure key direction yet. Without the light it does nothing.)
  let aimed = false;
  function aimKey() {
    aimed = true;
    const stageGroup = ctx.root.parent;
    const key = stageGroup && stageGroup.children.find((o) => o.isDirectionalLight && o.castShadow);
    if (!key || !key.shadow || !key.target) return;
    const L = new T.Vector3(-0.32, -0.56, -0.76).normalize(); // toward the light, in the cut face's coordinates
    const C = [315, 250, 20];
    const far = 1300;
    key.target.position.set(C[0], DEP - C[2], -C[1]);
    key.position.set(C[0] + L.x * far, DEP - (C[2] + L.z * far), -(C[1] + L.y * far));
    stageGroup.updateMatrixWorld(true);
    const eye = new T.Vector3().setFromMatrixPosition(key.matrixWorld);
    const aim = new T.Vector3().setFromMatrixPosition(key.target.matrixWorld);
    const view = new T.Matrix4().lookAt(eye, aim, new T.Vector3(0, 1, 0)).setPosition(eye).invert();
    const lo3 = [Infinity, Infinity, Infinity];
    const hi3 = [-Infinity, -Infinity, -Infinity];
    const v = new T.Vector3();
    for (const x of [26, 606]) for (const y of [10, 480]) for (const z of [-24, 80]) {
      v.set(x, y, z).applyMatrix4(sec.matrixWorld).applyMatrix4(view);
      [v.x, v.y, v.z].forEach((q, i) => {
        lo3[i] = Math.min(lo3[i], q);
        hi3[i] = Math.max(hi3[i], q);
      });
    }
    const cam = key.shadow.camera;
    cam.left = lo3[0] - 4;
    cam.right = hi3[0] + 4;
    cam.bottom = lo3[1] - 4;
    cam.top = hi3[1] + 4;
    cam.near = Math.max(1, -hi3[2] - 30);
    cam.far = -lo3[2] + 30;
    cam.updateProjectionMatrix();
    const size = lo ? 768 : 1024; // fitted to the scene, so this is finer on the tissue than the layer's own map and no dearer
    key.shadow.mapSize.set(size, size);
    key.shadow.radius = lo ? 3 : 4;
    key.shadow.blurSamples = 8;
    key.shadow.normalBias = 0.3;
    if (key.shadow.map) {
      key.shadow.map.dispose();
      key.shadow.map = null;
    }
  }
  function update(s) {
    if (!aimed) aimKey();
    const n = [0, 0, 0, 0];
    let nd = 0;
    for (const c of s.cells) {
      const mesh = CELLS[c.kind];
      if (n[c.kind] >= mesh.instanceMatrix.count) continue;
      const h1 = hash(c.n + 0.25);
      const h2 = hash(c.n + 0.61);
      const h3 = hash(c.n + 0.83);
      let x = c.x;
      let y = c.y;
      let z;
      // depth: the centre lane runs deeper in the pipe than the two beside it
      const R = lerp(17, 15, sat(c.age / 120));
      const lane = Math.abs(c.off) > 4.25 ? 1 : 0;
      const zArc = lane ? 2.0 + 1.5 * h1 : 5.0 + 2.4 * h1;
      if (c.at === 0) {
        // leaving the island: over the nurse cell, then down into the sinusoid
        z = lerp(-7.2, 3.1 + h1, sstep(0.02, 0.4, c.e));
      } else if (c.at === 1) {
        // the two side lanes pulled in a little where the pipe narrows, so no cell cuts through the wall
        const pull = Math.min(1, (R - 0.5 - 0.045 * R - 6.5) / 9.6);
        x = c.px + (c.x - c.px) * pull;
        y = c.py + (c.y - c.py) * pull;
        z = c.age < 3 ? lerp(3.1 + h1, zArc, sstep(0, 3, c.age)) : zArc;
      } else {
        z = lerp(lerp(zArc, -3.2, sstep(0.04, 0.3, c.e)), MACZ - 5, sstep(0.5, 0.95, c.e));
      }
      // facing: a disc seen part edge-on with its long axis along the flow (the drawing's ellipse), each leaning its
      // own way and rolling slowly as it ages. m = across the flow, square to the line of sight.
      const roll = c.age * 0.19;
      const th = 0.3 + 0.72 * h2 + 0.12 * Math.sin(roll + h3 * 6.3);
      const sg = (h3 > 0.5 ? 1 : -1) * Math.sin(th);
      const w = 0.42 * Math.sin(roll * 0.7 + h2 * 6.3);
      let mx = c.ty * VIEW[2], my = -c.tx * VIEW[2], mz = c.tx * VIEW[1] - c.ty * VIEW[0];
      const ml = Math.hypot(mx, my, mz) || 1;
      const ct = Math.cos(th);
      AX.set(VIEW[0] * ct + (mx / ml) * sg + c.tx * w, VIEW[1] * ct + (my / ml) * sg + c.ty * w, VIEW[2] * ct + (mz / ml) * sg).normalize();
      Q.setFromUnitVectors(YUP, AX);
      const k = c.k * (0.96 + 0.08 * h2);
      put(mesh, n[c.kind]++, x, y, z, k, k, k, Q);
      if (c.kind === 2 && nd < 46) {
        // reticulum: two pale specks on the face toward the viewer
        for (const [du, dv] of [[-1.6, 0.5], [2.0, -0.7]]) {
          V1.set(du * k, 1.75 * k, dv * k).applyQuaternion(Q);
          put(reticDots, nd++, x + V1.x, y + V1.y, z + V1.z, 0.85 * k);
        }
      }
    }
    CELLS.forEach((m, i) => {
      m.count = n[i];
      m.instanceMatrix.needsUpdate = true;
    });
    reticDots.count = nd;
    reticDots.instanceMatrix.needsUpdate = true;
    // ferritin
    if (s.gran !== shownGran) {
      shownGran = s.gran;
      gran.count = Math.min(DATA.gran.length, s.gran);
      gran.instanceMatrix.needsUpdate = true;
    }
    // transferrin: out of the macrophage, along the return, into the lower island
    let nt = 0;
    for (const p of s.tf) {
      if (nt >= tfBeads.instanceMatrix.count) break;
      const dm = Math.hypot(p.x - MAC.c[0], p.y - MAC.c[1]);
      put(tfBeads, nt++, p.x, p.y, lerp(MACZ - 3.1, 2.7, sstep(40, 56, dm)), 3);
    }
    tfBeads.count = nt;
    tfBeads.instanceMatrix.needsUpdate = true;
    // the IV complex in the plasma
    let ni = 0;
    for (const p of s.ivp) {
      if (ni >= ivBeads.instanceMatrix.count) break;
      const Ri = lerp(17, 15, p.u) * 0.955 - 0.5 - 2.6;
      const o = Math.max(-Ri + 0.5, Math.min(Ri - 0.5, p.o));
      const zMax = Math.sqrt(Math.max(1, Ri * Ri - o * o));
      const k = p.o ? o / p.o : 1;
      put(ivBeads, ni++, p.px + (p.x - p.px) * k, p.py + (p.y - p.py) * k, 1 + hash(p.i + 0.9) * (zMax - 1), 2.3);
    }
    ivBeads.count = ni;
    ivBeads.instanceMatrix.needsUpdate = true;
    // the IV line fades in and out (0.5 s in the drawing)
    const want = s.iv ? 1 : 0;
    ivShown = s.snap ? want : ivShown + (want - ivShown) * 0.14;
    if (Math.abs(want - ivShown) < 0.01) ivShown = want;
    iv.visible = ivShown > 0.01;
    ivMat.opacity = ivShown;
  }
  return {
    update,
    dispose() {
      for (const m of mats) m.dispose();
    },
  };
}
