// A1 · The gut cell's gate as a real-time 3-D scene, on the shared layer (shared/gl3: "A figure with its own 3-D scene").
//
// The same block the drawing shows, modelled where the drawing puts it. World units are the drawing's: x along the
// section (section x − X0), y back into the lining (the cut front face is y = D), z up (H − section y).
//
//   the lining      five tall cells in the drawing's honeycomb, each a thin-walled cup that is open where the block
//                   is cut (front, right end). What you see through a cut is the cell's inside, veiled with distance
//                   by a "gel" term in the materials, so a cell reads as a body of clear jelly with things floating
//                   in it. Nothing is actually see-through (no sorting, no extra pass). The traced cell is clear,
//                   its neighbours milky.
//   inside it       nucleus, four mitochondria, three ferritin cages (24 subunits on the cage's true 4-3-2 form), the
//                   terminal web. Each sits behind the cut along the line of sight from its place in the drawing,
//                   so it projects exactly where the drawing has it (lift()).
//   on top          the brush border: one capsule per drawn microvillus, DMT1 at the tips the drawing marks.
//   underneath      basement lamina, lamina propria with its collagen and fibroblasts, and the capillary cut along
//                   its length, with red cells and transferrin.
//   what moves      iron, ferroportin, hepcidin, the vesicles, the blood: all placed every frame from the page's
//                   own model state (update()), the same numbers the SVG draws from. Nothing here keeps time or
//                   decides anything: the model in live.js does.
function a1Scene(ctx, DATA, pal) {
  const T = ctx.THREE;
  const { root, night, coarse } = ctx;
  const G = DATA.G;
  const { X0, L, D } = G;
  const HH = DATA.H;
  const ZT = HH - DATA.APICAL; // apical surface
  const ZB = HH - DATA.BASAL; // the cells' base
  const CAPZ = HH - (DATA.CAP.y0 + DATA.CAP.y1) / 2; // the capillary's axis: along x, in the cut plane
  const CAPR = (DATA.CAP.y1 - DATA.CAP.y0) / 2;
  const TAU = Math.PI * 2;
  const AZ = (ctx.P.azimuth * Math.PI) / 180;
  const EL = (ctx.P.elevation * Math.PI) / 180;
  const VD = [Math.cos(AZ) * Math.cos(EL), Math.sin(AZ) * Math.cos(EL), Math.sin(EL)]; // toward the viewer
  const clamp = (v, a, b) => Math.max(a, Math.min(b, v));
  const mix = (a, b, t) => a + (b - a) * t;
  const sstep = (a, b, v) => {
    const t = clamp((v - a) / (b - a), 0, 1);
    return t * t * (3 - 2 * t);
  };
  let seed = 7;
  const rnd = () => ((seed = (seed * 16807) % 2147483647) - 1) / 2147483646;
  /** A section point pushed `dep` behind the cut face along the line of sight: it still projects where the drawing has it. */
  const lift = (sx, sy, dep, out = [0, 0, 0]) => {
    const s = dep / VD[1];
    out[0] = sx - X0 - s * VD[0];
    out[1] = D - dep;
    out[2] = HH - sy - s * VD[2];
    return out;
  };

  // ---------------------------------------------------------------- palette: the drawing's own inks (figure.css, block.css)
  const FALL = {
    "a1-cell": "#f6e9d8", "a1-cell-2": "#efdfc9", "a1-membrane": "#8a7f70", "a1-nucleus": "#e4d3bd", "a1-nucleolus": "#cdb69a", "a1-mito": "#ead8c2",
    "a1-tissue": "#f8efe2", "a1-blood": "#f6dcd2", "a1-endo": "#e2cdbd", "a1-iron": "#b8641f", "a1-hep": "#d96a47", "a1-fpn": "#2c4e25", "a1-dmt1": "#4a77ab",
    "a1-tf": "#6f93bd", "a1-rbc": "#c9503a", "a1-rbc-in": "#e07a63", "a1-ferritin": "#8a7f70", "b1-lateral": "#d9c6ad", "b1-cell-dim": "#ede3d5",
    "b1-villus-dim": "#e6dccd", "b1-top": "#e3d0b6", "b1-top-main": "#dcc5a7", "b1-v0": "#fbf2e6", "b1-v1": "#efdfc9", "b1-v2": "#d8c3a6", "b1-tip": "#fff8ee",
  };
  const ink = (k) => {
    const c = new T.Color();
    try {
      c.set(/^#[0-9a-f]{3,8}$/i.test(pal[k] || "") ? pal[k] : FALL[k]);
    } catch (_) {
      c.set(FALL[k]);
    }
    return c;
  };
  const blend = (a, b, t) => a.clone().lerp(b, t);
  const gain = (c, k) => c.clone().multiplyScalar(k);
  const rich = (c, k) => {
    const h = { h: 0, s: 0, l: 0 };
    c.getHSL(h);
    return c.clone().setHSL(h.h, Math.min(1, h.s * k), h.l);
  };
  const K = {};
  for (const k of Object.keys(FALL)) K[k.replace(/^[ab]1-/, "").replace(/-/g, "_")] = ink(k);
  // Rendered surfaces are lit, so the inks sit a little deeper than the flat fills (a lit cream reads as the drawing's cream).
  const TONE = night ? 1.5 : 0.86;
  const C = {
    gel: gain(rich(K.cell, night ? 1 : 1.45), night ? 1.25 : 0.87),
    gelDim: gain(rich(K.cell_dim, night ? 1 : 1.2), night ? 1.25 : 0.84),
    wall: gain(blend(K.cell_2, K.lateral, 0.5), night ? 1.4 : 0.74),
    wallDim: gain(blend(K.cell_dim, K.lateral, 0.6), night ? 1.3 : 0.72),
    rim: gain(blend(K.membrane, K.cell, night ? 0.25 : 0.22), night ? 1.3 : 0.9),
    rimDim: gain(blend(K.membrane, K.cell_dim, night ? 0.4 : 0.36), night ? 1.2 : 0.9),
    lateral: gain(K.lateral, night ? 1.1 : 0.84),
    junction: gain(blend(K.membrane, K.lateral, night ? 0.3 : 0.12), night ? 1.1 : 0.92),
    top: gain(K.top, TONE),
    topMain: gain(K.top_main, TONE),
    web: gain(blend(K.cell_2, K.lateral, night ? 0.45 : 0.75), night ? 1.5 : 0.72),
    webDim: gain(blend(K.cell_dim, K.lateral, night ? 0.5 : 0.7), night ? 1.35 : 0.72),
    villusTip: gain(K.tip, night ? 1.7 : 0.86),
    villus: gain(rich(K.v1, night ? 1 : 1.15), night ? 1.6 : 0.8),
    villusRoot: gain(K.v2, night ? 1.5 : 0.72),
    villusDim: gain(K.villus_dim, night ? 1.5 : 0.8),
    nucleus: gain(rich(K.nucleus, night ? 1 : 1.3), night ? 1.5 : 0.68),
    nucleolus: gain(K.nucleolus, night ? 1.5 : 0.5),
    mito: gain(rich(blend(K.mito, K.nucleolus, night ? 0 : 0.55), night ? 1 : 1.35), night ? 1.55 : 0.68),
    mitoBand: gain(blend(K.mito, K.membrane, 0.6), night ? 1.4 : 0.62),
    ferritin: gain(K.ferritin, night ? 1.15 : 0.8),
    tissue: gain(K.tissue, night ? 1.35 : 0.9),
    lamina: gain(K.endo, night ? 1.3 : 0.86),
    collagen: gain(blend(K.tissue, K.membrane, 0.5), night ? 1.3 : 0.9),
    endo: gain(K.endo, night ? 1.4 : 0.9),
    blood: gain(blend(K.blood, K.rbc, night ? 0.1 : 0.07), night ? 1.5 : 0.92),
    iron: K.iron.clone(),
    hep: K.hep.clone(),
    fpn: K.fpn.clone(),
    dmt1: K.dmt1.clone(),
    tf: K.tf.clone(),
    rbc: K.rbc.clone(),
    rbcIn: K.rbc_in.clone(),
    sheen: night ? new T.Color("#bfe0b4") : new T.Color("#fff1e2"),
  };

  // ---------------------------------------------------------------- materials
  const mats = [];
  const phys = (o) => {
    const m = new T.MeshPhysicalMaterial({ metalness: 0, ...o });
    mats.push(m);
    return m;
  };
  const flesh = (o) => phys({ roughness: 0.58, sheen: 0.55, sheenRoughness: 0.5, sheenColor: C.sheen, clearcoat: 0.2, clearcoatRoughness: 0.42, ...o });
  // The gel: what is seen through a cut is veiled by how far the line of sight ran inside the cell (it left through
  // the front cut or the end cut, whichever comes first). Kit coordinates come from the world position through uKit.
  const U = {
    kit: { value: new T.Matrix4() },
    view: { value: new T.Vector3(VD[0], VD[1], VD[2]) },
    cut: { value: new T.Vector4(D, L, ZB, ZT) },
  };
  let gelN = 0;
  function gel(m, { sigma = 0, color = C.gel, max = 0.94, attr = false, clip = false, fog = true, edge = 0 } = {}) {
    const u = { uA1Kit: U.kit, uA1View: U.view, uA1Cut: U.cut, uA1Gel: { value: new T.Vector4(color.r, color.g, color.b, max) }, uA1Sigma: { value: sigma } };
    m.userData.gel = u;
    m.onBeforeCompile = (sh) => {
      Object.assign(sh.uniforms, u);
      sh.vertexShader = sh.vertexShader
        .replace("#include <common>", `#include <common>\nuniform mat4 uA1Kit;\nvarying vec3 vA1Kit;\n${attr ? "attribute float aFog;\nvarying float vA1Fog;\n" : ""}`)
        .replace(
          "#include <project_vertex>",
          `#include <project_vertex>\n{ vec4 a1p = vec4( transformed, 1.0 );\n#ifdef USE_INSTANCING\na1p = instanceMatrix * a1p;\n#endif\nvA1Kit = ( uA1Kit * ( modelMatrix * a1p ) ).xyz; }\n${attr ? "vA1Fog = aFog;\n" : ""}`,
        );
      sh.fragmentShader = sh.fragmentShader
        .replace("#include <common>", `#include <common>\nuniform vec3 uA1View;\nuniform vec4 uA1Cut;\nuniform vec4 uA1Gel;\nuniform float uA1Sigma;\nvarying vec3 vA1Kit;\n${attr ? "varying float vA1Fog;\n" : ""}`)
        .replace("#include <clipping_planes_fragment>", `${clip ? "if ( vA1Kit.x < 0.0 || vA1Kit.x > uA1Cut.y ) discard;\n" : ""}#include <clipping_planes_fragment>`)
        .replace(
          "#include <opaque_fragment>",
          `#include <opaque_fragment>\n${edge ? `gl_FragColor.rgb *= 1.0 - ${edge.toFixed(3)} * pow( 1.0 - saturate( dot( normal, normalize( vViewPosition ) ) ), 2.0 );\n` : ""}${
            fog
              ? `{ float a1s = max( min( ( uA1Cut.x - vA1Kit.y ) / uA1View.y, ( uA1Cut.y - vA1Kit.x ) / uA1View.x ), 0.0 );
float a1in = step( uA1Cut.z, vA1Kit.z ) * step( vA1Kit.z, uA1Cut.w );
float a1f = ( 1.0 - exp( - ${attr ? "vA1Fog" : "uA1Sigma"} * a1s ) ) * a1in * uA1Gel.a;
vec3 a1e = vA1Kit + uA1View * a1s;
float a1m = sin( a1e.x * 0.023 + a1e.y * 0.031 + 1.7 * sin( a1e.z * 0.017 ) ) * sin( a1e.z * 0.021 + 0.9 * sin( a1e.x * 0.019 + a1e.y * 0.013 ) );
vec3 a1g = uA1Gel.rgb * ( 0.86 + 0.2 * smoothstep( uA1Cut.z, uA1Cut.w, a1e.z ) + 0.035 * a1m );
gl_FragColor.rgb = mix( gl_FragColor.rgb, a1g, a1f ); }`
              : ""
          }`,
        );
    };
    const key = `a1gel${attr ? "a" : ""}${clip ? "c" : ""}${fog ? "f" : ""}${edge ? "e" : ""}${gelN++}`;
    m.customProgramCacheKey = () => key;
    return m;
  }
  const SIG = night ? 0.0075 : 0.0068; // the traced cell: clear
  const SIG_DIM = night ? 0.03 : 0.022; // its neighbours: milky
  // The cells' own inner walls veil faster than what floats in them, so a cut shows a body of gel with a soft edge
  // under the membrane, not the inside of an empty box.
  const SIG_WALL = 0.024;
  const SIG_WALL_DIM = 0.055;

  // ---------------------------------------------------------------- geometry kit
  const SEG = coarse ? 0.6 : 1; // phones: about half the triangles
  const seg = (n, min = 4) => Math.max(min, Math.round(n * SEG));
  const geoOf = (pos, idx) => {
    const g = new T.BufferGeometry();
    g.setAttribute("position", new T.Float32BufferAttribute(pos, 3));
    if (idx) g.setIndex(idx);
    return g;
  };
  const smoothGeo = (pos, idx) => {
    const g = geoOf(pos, idx);
    g.computeVertexNormals();
    return g;
  };
  /** A unit ball with no seam (shared vertices all round, one at each pole). */
  function ballData(nu, nv) {
    const pos = [0, 0, 1];
    const idx = [];
    for (let j = 1; j < nv; j++) {
      const t = (j / nv) * Math.PI;
      for (let i = 0; i < nu; i++) {
        const p = (i / nu) * TAU;
        pos.push(Math.sin(t) * Math.cos(p), Math.sin(t) * Math.sin(p), Math.cos(t));
      }
    }
    pos.push(0, 0, -1);
    const last = pos.length / 3 - 1;
    const at = (j, i) => 1 + (j - 1) * nu + (i % nu);
    for (let i = 0; i < nu; i++) {
      idx.push(0, at(1, i), at(1, i + 1));
      idx.push(last, at(nv - 1, i + 1), at(nv - 1, i));
    }
    for (let j = 1; j < nv - 1; j++)
      for (let i = 0; i < nu; i++) {
        const a = at(j, i);
        const b = at(j, i + 1);
        const c = at(j + 1, i);
        const d = at(j + 1, i + 1);
        idx.push(a, c, d, a, d, b);
      }
    return { pos, idx };
  }
  const ballGeo = (nu, nv, r = 1) => {
    const b = ballData(nu, nv);
    for (let i = 0; i < b.pos.length; i++) b.pos[i] *= r;
    return smoothGeo(b.pos, b.idx);
  };
  /** A body of revolution about z with no seam. profile: [[r, z]…] bottom to top (r = 0 makes a pole). */
  function latheData(profile, nu) {
    const pos = [];
    const idx = [];
    const start = [];
    for (const [r, z] of profile) {
      start.push(pos.length / 3);
      if (r < 1e-6) pos.push(0, 0, z);
      else for (let i = 0; i < nu; i++) pos.push(r * Math.cos((i / nu) * TAU), r * Math.sin((i / nu) * TAU), z);
    }
    for (let j = 0; j < profile.length - 1; j++) {
      const pa = profile[j][0] < 1e-6;
      const pb = profile[j + 1][0] < 1e-6;
      if (pa && pb) continue;
      for (let i = 0; i < nu; i++) {
        const i2 = (i + 1) % nu;
        if (pa) idx.push(start[j], start[j + 1] + i2, start[j + 1] + i);
        else if (pb) idx.push(start[j + 1], start[j] + i, start[j] + i2);
        else {
          const a = start[j] + i;
          const b = start[j] + i2;
          const c = start[j + 1] + i;
          const d = start[j + 1] + i2;
          idx.push(a, b, d, a, d, c);
        }
      }
    }
    return { pos, idx };
  }
  const capsuleProfile = (r, len, n) => {
    const p = [[0, -len / 2]];
    for (let i = 1; i <= n; i++) p.push([r * Math.sin((i / n) * (Math.PI / 2)), -len / 2 + r - r * Math.cos((i / n) * (Math.PI / 2))]);
    for (let i = n; i >= 1; i--) p.push([r * Math.sin((i / n) * (Math.PI / 2)), len / 2 - r + r * Math.cos((i / n) * (Math.PI / 2))]);
    p.push([0, len / 2]);
    return p;
  };
  /** A tube along a spine with its own radius at every step (0 at an end closes it to a point). No seam. */
  function sweepData(points, radius, nu, steps, ease = false) {
    const curve = new T.CatmullRomCurve3(points.map((p) => new T.Vector3(p[0], p[1], p[2])), false, "centripetal");
    const FR = 96;
    const fr = curve.computeFrenetFrames(FR, false);
    const pos = [];
    const idx = [];
    const ts = [];
    const p0 = curve.getPointAt(0);
    pos.push(p0.x, p0.y, p0.z);
    for (let j = 1; j < steps; j++) {
      const t = ease ? 0.5 - 0.5 * Math.cos((Math.PI * j) / steps) : j / steps;
      ts.push(t);
      const c = curve.getPointAt(t);
      const f = Math.round(t * FR);
      const N = fr.normals[f];
      const B = fr.binormals[f];
      const r = radius(t);
      for (let i = 0; i < nu; i++) {
        const a = (i / nu) * TAU;
        const ca = Math.cos(a) * r;
        const sa = Math.sin(a) * r;
        pos.push(c.x + N.x * ca + B.x * sa, c.y + N.y * ca + B.y * sa, c.z + N.z * ca + B.z * sa);
      }
    }
    const p1 = curve.getPointAt(1);
    pos.push(p1.x, p1.y, p1.z);
    const last = pos.length / 3 - 1;
    const at = (j, i) => 1 + (j - 1) * nu + (i % nu);
    for (let i = 0; i < nu; i++) {
      idx.push(0, at(1, i + 1), at(1, i));
      idx.push(last, at(steps - 1, i), at(steps - 1, i + 1));
    }
    for (let j = 1; j < steps - 1; j++)
      for (let i = 0; i < nu; i++) {
        const a = at(j, i);
        const b = at(j, i + 1);
        const c = at(j + 1, i);
        const d = at(j + 1, i + 1);
        idx.push(a, b, d, a, d, c);
      }
    return { pos, idx, ts, nu };
  }
  /** Loose triangles with their own normal, colour and gel strength: everything static merges into a few of these. */
  class Soup {
    constructor() {
      this.p = [];
      this.n = [];
      this.c = [];
      this.f = [];
    }
    tri(a, b, c, n, col, fog = 0) {
      let m = n;
      if (!m) {
        const ux = b[0] - a[0], uy = b[1] - a[1], uz = b[2] - a[2];
        const vx = c[0] - a[0], vy = c[1] - a[1], vz = c[2] - a[2];
        m = [uy * vz - uz * vy, uz * vx - ux * vz, ux * vy - uy * vx];
        const l = Math.hypot(m[0], m[1], m[2]) || 1;
        m = [m[0] / l, m[1] / l, m[2] / l];
      }
      this.p.push(a[0], a[1], a[2], b[0], b[1], b[2], c[0], c[1], c[2]);
      for (let i = 0; i < 3; i++) {
        this.n.push(m[0], m[1], m[2]);
        this.c.push(col.r, col.g, col.b);
        this.f.push(fog);
      }
    }
    /** A flat face that must look along `n`: wound to suit. */
    face(pts, n, col, fog = 0) {
      const a = pts[0], b = pts[1], c = pts[2];
      const ux = b[0] - a[0], uy = b[1] - a[1], uz = b[2] - a[2];
      const vx = c[0] - a[0], vy = c[1] - a[1], vz = c[2] - a[2];
      const flip = (uy * vz - uz * vy) * n[0] + (uz * vx - ux * vz) * n[1] + (ux * vy - uy * vx) * n[2] < 0;
      for (let i = 1; i < pts.length - 1; i++) (flip ? this.tri(pts[0], pts[i + 1], pts[i], n, col, fog) : this.tri(pts[0], pts[i], pts[i + 1], n, col, fog));
    }
    /** An indexed geometry with normals, taken in as it is, in one colour or (col = null) in its own vertex colours. */
    add(g, col, fog = 0) {
      const P = g.attributes.position.array;
      const N = g.attributes.normal.array;
      const I = g.index.array;
      const own = col ? null : g.attributes.color.array;
      for (let k = 0; k < I.length; k++) {
        const i = I[k] * 3;
        this.p.push(P[i], P[i + 1], P[i + 2]);
        this.n.push(N[i], N[i + 1], N[i + 2]);
        if (own) this.c.push(own[i], own[i + 1], own[i + 2]);
        else this.c.push(col.r, col.g, col.b);
        this.f.push(fog);
      }
      g.dispose();
    }
    /** A polygon [[u, v]…] pushed from w0 to w1; `map` turns (u, v, w) into world x, y, z (default: z up). */
    prism(poly, w0, w1, col, fog = 0, map = (u, v, w) => [u, v, w], caps = true) {
      let P = poly;
      let area = 0;
      for (let i = 0; i < P.length; i++) area += P[i][0] * P[(i + 1) % P.length][1] - P[(i + 1) % P.length][0] * P[i][1];
      if (area < 0) P = P.slice().reverse();
      const n = P.length;
      for (let i = 0; i < n; i++) {
        const a = P[i];
        const b = P[(i + 1) % n];
        if (Math.hypot(a[0] - b[0], a[1] - b[1]) < 1e-6) continue;
        const A = map(a[0], a[1], w0), B = map(b[0], b[1], w0), Cc = map(b[0], b[1], w1), Dd = map(a[0], a[1], w1);
        this.tri(A, B, Cc, null, col, fog);
        this.tri(A, Cc, Dd, null, col, fog);
      }
      if (!caps) return;
      const tris = T.ShapeUtils.triangulateShape(P.map((q) => new T.Vector2(q[0], q[1])), []);
      for (const [i, j, k] of tris) {
        const a = P[i], b = P[j], c = P[k];
        const ccw = (b[0] - a[0]) * (c[1] - a[1]) - (b[1] - a[1]) * (c[0] - a[0]) > 0;
        const [q, r] = ccw ? [b, c] : [c, b];
        this.tri(map(a[0], a[1], w1), map(q[0], q[1], w1), map(r[0], r[1], w1), null, col, fog);
        this.tri(map(a[0], a[1], w0), map(r[0], r[1], w0), map(q[0], q[1], w0), null, col, fog);
      }
    }
    geometry() {
      const g = new T.BufferGeometry();
      g.setAttribute("position", new T.Float32BufferAttribute(this.p, 3));
      g.setAttribute("normal", new T.Float32BufferAttribute(this.n, 3));
      g.setAttribute("color", new T.Float32BufferAttribute(this.c, 3));
      g.setAttribute("aFog", new T.Float32BufferAttribute(this.f, 1));
      return g;
    }
  }
  const scene = new T.Group();
  root.add(scene);
  const solid = (g, m, { cast = true, receive = true } = {}) => {
    const mesh = new T.Mesh(g, m);
    mesh.castShadow = cast;
    mesh.receiveShadow = receive;
    scene.add(mesh);
    return mesh;
  };
  // Instanced meshes hang from a point inside the block: the layer's floor-shadow passes draw an instanced mesh once,
  // at its own origin, and there the block itself covers it.
  const PIVOT = [L / 2, D / 2, 48];
  const dummy = new T.Object3D();
  const QI = new T.Quaternion();
  const instanced = (g, m, n, { dynamic = false, cast = true, receive = true, ghost = false } = {}) => {
    const mesh = new T.InstancedMesh(g, m, n);
    if (ghost) ctx.ghost(mesh); // out of the floor-shadow and occlusion passes (coarse on phones: they would shimmer round small movers)
    mesh.position.set(PIVOT[0], PIVOT[1], PIVOT[2]);
    mesh.frustumCulled = false;
    mesh.castShadow = cast;
    mesh.receiveShadow = receive;
    if (dynamic) mesh.instanceMatrix.setUsage(T.DynamicDrawUsage);
    scene.add(mesh);
    return mesh;
  };
  const put = (mesh, i, p, sx = 1, sy = sx, sz = sx, q = QI) => {
    dummy.position.set(p[0] - PIVOT[0], p[1] - PIVOT[1], p[2] - PIVOT[2]);
    dummy.quaternion.copy(q);
    dummy.scale.set(sx, sy, sz);
    dummy.updateMatrix();
    mesh.setMatrixAt(i, dummy.matrix);
  };

  // ---------------------------------------------------------------- the lining: five cells as cups, open where the block is cut
  const GAP = 3; // half the lateral space between two cells
  const WALL = 2.2; // the membrane's thickness at a cut
  const FILLET = 11; // the rounded base corners of the drawing's cells
  const near = (a, b) => Math.abs(a - b) < 1e-6;
  const kindsOf = (P) =>
    P.map((a, i) => {
      const b = P[(i + 1) % P.length];
      if ((near(a[1], D) && near(b[1], D)) || (near(a[0], L) && near(b[0], L))) return "o"; // open: a cut the viewer sees
      if ((near(a[0], 0) && near(b[0], 0)) || (near(a[1], 0) && near(b[1], 0))) return "h"; // a cut that faces away
      return "i"; // the border with another cell
    });
  function roundPoly(P, kinds, cut = 28, steps = seg(6, 3)) {
    const n = P.length;
    const out = [];
    const ks = [];
    for (let i = 0; i < n; i++) {
      const e0 = (i + n - 1) % n;
      const p = P[i];
      const a = P[e0];
      const b = P[(i + 1) % n];
      if (kinds[e0] === "i" && kinds[i] === "i") {
        const la = Math.hypot(a[0] - p[0], a[1] - p[1]);
        const lb = Math.hypot(b[0] - p[0], b[1] - p[1]);
        const ca = Math.min(cut, la * 0.4);
        const cb = Math.min(cut, lb * 0.4);
        const A = [p[0] + ((a[0] - p[0]) / la) * ca, p[1] + ((a[1] - p[1]) / la) * ca];
        const B = [p[0] + ((b[0] - p[0]) / lb) * cb, p[1] + ((b[1] - p[1]) / lb) * cb];
        for (let s = 0; s <= steps; s++) {
          const t = s / steps;
          const u = 1 - t;
          out.push([u * u * A[0] + 2 * u * t * p[0] + t * t * B[0], u * u * A[1] + 2 * u * t * p[1] + t * t * B[1]]);
          ks.push(s < steps ? "i" : kinds[i]);
        }
      } else {
        out.push(p);
        ks.push(kinds[i]);
      }
    }
    return { P: out, kinds: ks };
  }
  /** A counter-clockwise polygon moved inward by its own amount on every edge. */
  function insetPoly(P, deltas) {
    const n = P.length;
    const nrm = P.map((a, i) => {
      const b = P[(i + 1) % n];
      const dx = b[0] - a[0];
      const dy = b[1] - a[1];
      const l = Math.hypot(dx, dy) || 1;
      return [-dy / l, dx / l];
    });
    return P.map((p, i) => {
      const e0 = (i + n - 1) % n;
      const n0 = nrm[e0];
      const n1 = nrm[i];
      const d0 = deltas[e0];
      const d1 = deltas[i];
      const det = n0[0] * n1[1] - n0[1] * n1[0];
      if (Math.abs(d0 - d1) < 1e-9 || Math.abs(det) < 1e-3) {
        const k = (d0 + d1) / 2 / Math.max(0.3, 1 + n0[0] * n1[0] + n0[1] * n1[1]);
        return [p[0] + (n0[0] + n1[0]) * k, p[1] + (n0[1] + n1[1]) * k];
      }
      return [p[0] + (d0 * n1[1] - d1 * n0[1]) / det, p[1] + (n0[0] * d1 - n1[0] * d0) / det];
    });
  }
  // the drawing's honeycomb (build.mjs EDGES), in world x: the front row's borders run straight back to a node, the
  // back row sits half a cell over
  const apexL = [DATA.CELL.x0 - 3 - X0, G.HV[0]];
  const apexR = [DATA.CELL.x1 + 3 - X0, G.HV[0]];
  const apexM = [(apexL[0] + apexR[0]) / 2, G.HV[1]];
  const yEdge = G.HV[0] - ((G.HV[0] - G.HV[1]) * (L - apexR[0])) / G.HX; // where the back border meets either end of the block
  const POLY = {
    FL: [[0, D], [0, yEdge], apexL, [apexL[0], D]],
    M: [[apexL[0], D], apexL, apexM, apexR, [apexR[0], D]],
    FR: [[apexR[0], D], apexR, [L, yEdge], [L, D]],
    BL: [[0, 0], [apexM[0], 0], apexM, apexL, [0, yEdge]],
    BR: [[apexM[0], 0], [L, 0], [L, yEdge], apexR, apexM],
  };
  const CEIL = 3; // the apical membrane, seen at a cut
  const NF = seg(6, 3);
  const NW = seg(8, 4);
  const NT = 3;
  const mainInner = { poly: null, kinds: null };
  function cup(P0, { shell, top, cTop, cRim, cWall, cOut, fog, hollow = true, keep = null, phase = 0 }) {
    const { P, kinds } = roundPoly(P0, kindsOf(P0));
    const n = P.length;
    const base = kinds.map((k) => (k === "i" ? GAP : 0));
    const closed = kinds.map((k) => (k === "o" ? 0 : 1));
    const R = FILLET;
    const rt = 3;
    const zc = ZT - CEIL;
    const wob = (z, u) => 1.5 * Math.sin(z * 0.021 + phase) * Math.sin(Math.PI * u);
    const rings = []; // { zo, fo, zi, fi }
    for (let j = 0; j <= NF; j++) {
      const t = (j / NF) * (Math.PI / 2);
      rings.push({ zo: ZB + R * (1 - Math.cos(t)), fo: R * (1 - Math.sin(t)), zi: ZB + WALL + (R - WALL) * (1 - Math.cos(t)), fi: WALL + (R - WALL) * (1 - Math.sin(t)) });
    }
    for (let j = 1; j <= NW; j++) {
      const u = j / NW;
      const zo = mix(ZB + R, ZT - rt, u);
      const zi = mix(ZB + R, zc - 2, u);
      rings.push({ zo, fo: wob(zo, u), zi, fi: WALL + wob(zi, u) });
    }
    for (let j = 1; j <= NT; j++) {
      const t = (j / NT) * (Math.PI / 2);
      rings.push({ zo: ZT - rt + rt * Math.sin(t), fo: rt * (1 - Math.cos(t)), zi: zc - 2 + 2 * Math.sin(t), fi: WALL + 2 * (1 - Math.cos(t)) });
    }
    const Kn = rings.length;
    const O = rings.map((r) => insetPoly(P, base.map((b, e) => b + closed[e] * r.fo)).map((q) => [q[0], q[1], r.zo]));
    const I = rings.map((r) => insetPoly(P, base.map((b, e) => b + closed[e] * r.fi)).map((q) => [q[0], q[1], r.zi]));
    if (keep) {
      keep.poly = I[NF + 2].map((q) => [q[0], q[1]]);
      keep.kinds = kinds;
    }
    // the outside wall (smooth round the corners), and the top
    const wallOf = (rows, inward) => {
      const pos = [];
      const idx = [];
      for (const row of rows) for (const q of row) pos.push(q[0], q[1], q[2]);
      for (let k = 0; k < Kn - 1; k++)
        for (let i = 0; i < n; i++) {
          if (!closed[i]) continue;
          const j = (i + 1) % n;
          const a = k * n + i, b = k * n + j, c = (k + 1) * n + j, d = (k + 1) * n + i;
          if (inward) idx.push(a, c, b, a, d, c);
          else idx.push(a, b, c, a, c, d);
        }
      return { pos, idx };
    };
    const capOf = (row) => T.ShapeUtils.triangulateShape(row.map((q) => new T.Vector2(q[0], q[1])), []).map(([a, b, c]) => {
      const ccw = (row[b][0] - row[a][0]) * (row[c][1] - row[a][1]) - (row[b][1] - row[a][1]) * (row[c][0] - row[a][0]) > 0;
      return ccw ? [a, b, c] : [a, c, b];
    });
    const ow = wallOf(O, false);
    shell.add(smoothGeo(ow.pos, ow.idx), cOut, 0);
    for (const [a, b, c] of capOf(O[Kn - 1])) top.tri(O[Kn - 1][a], O[Kn - 1][b], O[Kn - 1][c], [0, 0, 1], cTop, 0);
    if (!hollow) return;
    // the inside: floor, fillet and walls as one smooth surface; the ceiling apart
    const iw = wallOf(I, true);
    for (const [a, b, c] of capOf(I[0])) iw.idx.push(a, b, c);
    const inner = smoothGeo(iw.pos, iw.idx);
    const nn = inner.attributes.normal.array;
    for (let q = 0; q < nn.length; q += 3) {
      const x = nn[q] * 0.3 + VD[0] * 0.55, y = nn[q + 1] * 0.3 + VD[1] * 0.55, z = nn[q + 2] * 0.3 + VD[2] * 0.55 + 0.28;
      const l = Math.hypot(x, y, z) || 1;
      nn[q] = x / l;
      nn[q + 1] = y / l;
      nn[q + 2] = z / l;
    }
    shell.add(inner, cWall, fog);
    for (const [a, b, c] of capOf(I[Kn - 1])) shell.tri(I[Kn - 1][a], I[Kn - 1][c], I[Kn - 1][b], [0, 0, -1], cWall, fog);
    // the membrane where the cut crosses it: a frame round every open face
    for (let i = 0; i < n; i++) {
      const e0 = (i + n - 1) % n;
      const j = (i + 1) % n;
      if (kinds[i] === "o") {
        const dx = P[j][0] - P[i][0];
        const dy = P[j][1] - P[i][1];
        const l = Math.hypot(dx, dy);
        const nr = [dy / l, -dx / l, 0];
        shell.face([O[0][i], O[0][j], I[0][j], I[0][i]], nr, cRim, 0);
        shell.face([O[Kn - 1][i], O[Kn - 1][j], I[Kn - 1][j], I[Kn - 1][i]], nr, cRim, 0);
      }
      if ((kinds[e0] === "o") !== (kinds[i] === "o")) {
        const e = kinds[i] === "o" ? i : e0;
        const a = P[e];
        const b = P[(e + 1) % n];
        const l = Math.hypot(b[0] - a[0], b[1] - a[1]);
        const nr = [(b[1] - a[1]) / l, -(b[0] - a[0]) / l, 0];
        for (let k = 0; k < Kn - 1; k++) shell.face([O[k][i], I[k][i], I[k + 1][i], O[k + 1][i]], nr, cRim, 0);
      }
    }
  }
  const soupMain = new Soup();
  const soupDim = new Soup();
  const soupTop = new Soup();
  cup(POLY.M, { shell: soupMain, top: soupTop, cTop: C.topMain, cRim: C.rim, cWall: C.wall, cOut: C.lateral, fog: SIG_WALL, keep: mainInner, phase: 0.4 });
  const dimInner = [{}, {}, {}];
  cup(POLY.FL, { shell: soupDim, top: soupTop, cTop: C.top, cRim: C.rimDim, cWall: C.wallDim, cOut: C.lateral, fog: SIG_WALL_DIM, keep: dimInner[0], phase: 1 });
  cup(POLY.FR, { shell: soupDim, top: soupTop, cTop: C.top, cRim: C.rimDim, cWall: C.wallDim, cOut: C.lateral, fog: SIG_WALL_DIM, keep: dimInner[1], phase: 3 });
  cup(POLY.BR, { shell: soupDim, top: soupTop, cTop: C.top, cRim: C.rimDim, cWall: C.wallDim, cOut: C.lateral, fog: SIG_WALL_DIM, keep: dimInner[2], phase: 2.2 });
  cup(POLY.BL, { shell: soupDim, top: soupTop, cTop: C.top, cRim: C.rimDim, cWall: C.wallDim, cOut: C.lateral, fog: 0, hollow: false, phase: 5 });
  // the terminal web: the dense band under the brush border, across the traced cell
  {
    const web = (inner) => insetPoly(inner.poly, inner.kinds.map((k) => (k === "o" ? 0.6 : 0.4))); // wall to wall: a layer of the cell, not a shelf in it
    soupMain.prism(web(mainInner), HH - G.web[3], HH - G.web[2], C.web, SIG_WALL);
    for (const inner of dimInner) soupDim.prism(web(inner), HH - G.web[3], HH - G.web[2], C.webDim, SIG_WALL_DIM); // every lining cell has one; the drawing shows the neighbour's on the end face
  }
  // between the cells: the lateral space, and the tight-junction belt that closes it under the brush border
  {
    const JZ = ZT - 20;
    const seen = new Set();
    const strip = (a, b, w, z0, z1, col, trim) => {
      const dx = b[0] - a[0];
      const dy = b[1] - a[1];
      const l = Math.hypot(dx, dy);
      const ux = dx / l, uy = dy / l;
      const open = (p) => near(p[1], D) || near(p[0], L);
      const A = open(a) ? [a[0] + ux * trim, a[1] + uy * trim] : a;
      const B = open(b) ? [b[0] - ux * trim, b[1] - uy * trim] : b;
      const px = -uy * (w / 2), py = ux * (w / 2);
      soupDim.prism([[A[0] - px, A[1] - py], [B[0] - px, B[1] - py], [B[0] + px, B[1] + py], [A[0] + px, A[1] + py]], z0, z1, col, 0);
    };
    for (const P0 of Object.values(POLY)) {
      const ks = kindsOf(P0);
      P0.forEach((a, i) => {
        if (ks[i] !== "i") return;
        const b = P0[(i + 1) % P0.length];
        const key = [a, b].map((p) => `${p[0].toFixed(1)},${p[1].toFixed(1)}`).sort().join("|");
        if (seen.has(key)) return;
        seen.add(key);
        strip(a, b, 5.6, ZB - 5, JZ, C.lateral, 0.7);
        strip(a, b, 7.4, JZ, ZT - 0.9, C.junction, 0.35);
      });
    }
    for (const node of [apexL, apexM, apexR]) {
      const ring = (r) => Array.from({ length: 10 }, (_, i) => [node[0] + r * Math.cos((i / 10) * TAU), node[1] + r * Math.sin((i / 10) * TAU)]);
      soupDim.prism(ring(8), ZB - 5, JZ, C.lateral, 0);
      soupDim.prism(ring(9.5), JZ, ZT - 0.9, C.junction, 0);
    }
  }
  // The cups are drawn as they are, but the shadow and occlusion passes see one plain block in their place (ghost +
  // proxy): a cell is a body of gel, so its inside takes no contact shading, and what stands on a cut face (the
  // gates, the front row of microvilli) is still seated on it.
  const cellMat = (color) => gel(flesh({ vertexColors: true }), { attr: true, color, max: 0.97 });
  for (const [soup, color] of [[soupMain, C.gel], [soupDim, C.gelDim]]) {
    const mesh = ctx.ghost(new T.Mesh(soup.geometry(), cellMat(color)));
    mesh.receiveShadow = false;
    scene.add(mesh);
  }
  solid(soupTop.geometry(), flesh({ vertexColors: true, roughness: 0.62 }));
  {
    const pos = [];
    const nor = [];
    const idx = [];
    const NG = seg(10, 6);
    const pane = (o, eu, ev, w, h, nf) => {
      const base = pos.length / 3;
      for (let j = 0; j <= NG; j++)
        for (let i = 0; i <= NG; i++) {
          const u = i / NG, v = j / NG;
          pos.push(o[0] + eu[0] * u * w + ev[0] * v * h + nf[0] * 0.08, o[1] + eu[1] * u * w + ev[1] * v * h + nf[1] * 0.08, o[2] + eu[2] * u * w + ev[2] * v * h + nf[2] * 0.08);
          const tu = 0.3 * (2 * u - 1);
          const tv = 0.62 * sstep(0.5, 1, v) - 0.25 * (1 - sstep(0, 0.25, v));
          const n = [nf[0] + eu[0] * tu + ev[0] * tv, nf[1] + eu[1] * tu + ev[1] * tv, nf[2] + eu[2] * tu + ev[2] * tv];
          const l = Math.hypot(n[0], n[1], n[2]);
          nor.push(n[0] / l, n[1] / l, n[2] / l);
        }
      for (let j = 0; j < NG; j++)
        for (let i = 0; i < NG; i++) {
          const a = base + j * (NG + 1) + i, b = a + 1, c = a + NG + 1, d = c + 1;
          idx.push(a, b, d, a, d, c);
        }
    };
    const z0 = ZB + 3;
    const hgt = ZT - 4 - z0;
    const m = GAP + WALL;
    pane([L - m, D, z0], [-1, 0, 0], [0, 0, 1], L - apexR[0] - 2 * m + m, hgt, [0, 1, 0]); // right neighbour, front
    pane([apexR[0] - m, D, z0], [-1, 0, 0], [0, 0, 1], apexR[0] - apexL[0] - 2 * m, hgt, [0, 1, 0]); // the traced cell
    pane([apexL[0] - m, D, z0], [-1, 0, 0], [0, 0, 1], apexL[0] - m - WALL, hgt, [0, 1, 0]); // left neighbour
    pane([L, yEdge + m, z0], [0, 1, 0], [0, 0, 1], D - yEdge - m, hgt, [1, 0, 0]); // right neighbour, end
    pane([L, WALL, z0], [0, 1, 0], [0, 0, 1], yEdge - m - WALL, hgt, [1, 0, 0]); // back-row cell, end
    const g = geoOf(pos, idx);
    g.setAttribute("normal", new T.Float32BufferAttribute(nor, 3));
    const gloss = phys({ color: 0x000000, roughness: 0.28, clearcoat: 0.6, clearcoatRoughness: 0.2, transparent: true, blending: T.AdditiveBlending, depthWrite: false, envMapIntensity: night ? 0.55 : 1.25, side: T.DoubleSide });
    const mesh = ctx.ghost(new T.Mesh(g, gloss));
    mesh.receiveShadow = false;
    mesh.renderOrder = 4;
    scene.add(mesh);
  }
  {
    const proxy = new Soup();
    proxy.prism([[0, 0], [L - 0.15, 0], [L - 0.15, D - 0.15], [0, D - 0.15]], ZB - 0.3, ZT - 2, C.gel, 0);
    const unseen = new T.MeshBasicMaterial({ colorWrite: false, depthWrite: false });
    mats.push(unseen);
    solid(proxy.geometry(), unseen, { receive: false });
  }

  // ---------------------------------------------------------------- inside the cells
  const organelle = (sig = SIG, color = C.gel, o = {}) => gel(flesh({ vertexColors: true, roughness: 0.5, clearcoat: 0.3, ...o }), { sigma: sig, color, edge: 0.42 });
  const matIn = organelle();
  const matInDim = organelle(SIG_DIM, C.gelDim);
  const withColor = (g, fn) => {
    const P = g.attributes.position.array;
    const N = g.attributes.normal.array;
    const col = new Float32Array(P.length);
    for (let i = 0; i < P.length; i += 3) {
      const c = fn(P[i], P[i + 1], P[i + 2], N[i], N[i + 1], N[i + 2], i / 3);
      col[i] = c.r;
      col[i + 1] = c.g;
      col[i + 2] = c.b;
    }
    g.setAttribute("color", new T.BufferAttribute(col, 3));
    return g;
  };
  /** A nucleus: an egg with a slow wobble in its surface; cut flat where it crosses a cut plane (xMax, yMax). */
  function nucleusGeo(c, r, wobble, ph, xMax = Infinity, yMax = Infinity, fine = 1) {
    const b = ballData(seg(64 * fine, 24), seg(40 * fine, 16));
    for (let i = 0; i < b.pos.length; i += 3) {
      const x = b.pos[i], y = b.pos[i + 1], z = b.pos[i + 2];
      const w = 1 + wobble * (Math.sin(x * 2.6 + ph) * Math.cos(z * 2.1 + ph * 1.7) + 0.6 * Math.sin(y * 3.1 + z * 1.4 + ph * 2.3));
      b.pos[i] = Math.min(xMax, c[0] + x * r[0] * w);
      b.pos[i + 1] = Math.min(yMax, c[1] + y * r[1] * w);
      b.pos[i + 2] = c[2] + z * r[2] * w;
    }
    return smoothGeo(b.pos, b.idx);
  }
  // the traced cell's nucleus, with its nucleolus showing through the envelope where the drawing has it
  {
    const [sx, sy, rx, rz] = G.nucleus;
    const dep = 54;
    const c = lift(sx, sy, dep);
    const g = nucleusGeo(c, [rx, 42, rz], 0.022, 2);
    const [nx, ny, nrx, nrz] = G.nucleolus;
    const o = [nx - sx, 0, -(ny - sy)]; // the nucleolus's offset in the picture, as a world vector in the cut plane
    const od = o[0] * VD[0] + o[2] * VD[2];
    const oq = [o[0] - od * VD[0], -od * VD[1], o[2] - od * VD[2]];
    withColor(g, (x, y, z, nx2, ny2, nz2) => {
      const v = [x - c[0], y - c[1], z - c[2]];
      const vd = v[0] * VD[0] + v[1] * VD[1] + v[2] * VD[2];
      const q = [v[0] - vd * VD[0] - oq[0], v[1] - vd * VD[1] - oq[1], v[2] - vd * VD[2] - oq[2]];
      const facing = nx2 * VD[0] + ny2 * VD[1] + nz2 * VD[2];
      const d = Math.hypot(q[0] / nrx, q[1] / nrx, q[2] / nrz);
      const w = (1 - sstep(0.35, 1.25, d)) * sstep(0.0, 0.3, facing);
      return blend(C.nucleus, C.nucleolus, w * 0.8);
    });
    solid(g, matIn, { receive: false });
  }
  // mitochondria: beans, banded where the folds of the inner membrane show through
  const beanGeo = (c, axis, bow, rx, ry) => {
    const pts = [-1, -0.5, 0, 0.5, 1].map((s) => [0, 1, 2].map((k) => c[k] + axis[k] * s * (rx - 0.01) + bow[k] * (1 - s * s) * rx * 0.2));
    const rad = (t) => {
      const e = rx - Math.abs(2 * t - 1) * rx;
      return e >= ry ? ry : Math.sqrt(Math.max(0, ry * ry - (ry - e) * (ry - e)));
    };
    const d = sweepData(pts, rad, seg(14, 8), seg(30, 16), true);
    const g = smoothGeo(d.pos, d.idx);
    return withColor(g, (x, y, z, a, b, cc, i) => {
      if (i === 0 || i > d.ts.length * d.nu) return C.mito;
      const t = d.ts[Math.floor((i - 1) / d.nu)];
      const band = 0.5 + 0.5 * Math.sin((2 * t - 1) * rx * 0.62);
      return blend(C.mito, C.mitoBand, sstep(0.55, 0.9, band) * 0.7 * sstep(0.02, 0.2, Math.min(t, 1 - t)));
    });
  };
  {
    const deps = [30, 60, 44, 24];
    const axes = [[0.96, -0.2, -0.18], [0.93, 0.22, 0.28], [0.95, 0.12, -0.28], [0.97, -0.16, 0.2]];
    const all = new Soup();
    G.mito.forEach(([sx, sy, rx, ry], i) => {
      const a = axes[i];
      const l = Math.hypot(a[0], a[1], a[2]);
      const ax = a.map((v) => v / l);
      const bow = [0, i % 2 ? 0.5 : -0.5, i % 2 ? -0.86 : 0.86];
      all.add(beanGeo(lift(sx, sy, deps[i]), ax, bow, rx, ry - 0.5), null);
    });
    solid(all.geometry(), matIn, { receive: false });
  }
  // ferritin: 24 subunits on the cage's real 4-3-2 arrangement (a snub cube), a window turned to the viewer
  const FDEP = [26, 40, 18];
  const FCEN = DATA.FERRITIN.map(([sx, sy], j) => lift(sx, sy, FDEP[j]));
  {
    const t = 1.8392867552;
    const pts = [];
    const even = [[0, 1, 2], [1, 2, 0], [2, 0, 1]];
    const odd = [[0, 2, 1], [2, 1, 0], [1, 0, 2]];
    const base = [1, 1 / t, t];
    for (let s = 0; s < 8; s++) {
      const sg = [s & 1 ? -1 : 1, s & 2 ? -1 : 1, s & 4 ? -1 : 1];
      const plus = sg.filter((v) => v > 0).length;
      for (const perm of plus % 2 === 0 ? even : odd) {
        const v = [0, 0, 0];
        perm.forEach((src, k) => (v[k] = base[src] * sg[k]));
        pts.push(v);
      }
    }
    const q = new T.Quaternion().setFromUnitVectors(new T.Vector3(0, 1, 0), new T.Vector3(VD[0], VD[1], VD[2]));
    const turn = new T.Quaternion().setFromAxisAngle(new T.Vector3(VD[0], VD[1], VD[2]), 0.4);
    const RC = 14.6;
    const cage = instanced(ballGeo(seg(12, 8), seg(8, 6)), gel(flesh({ color: C.ferritin, roughness: 0.5 }), { sigma: SIG, edge: 0.25 }), 24 * FCEN.length, { receive: false });
    const v3 = new T.Vector3();
    let k = 0;
    FCEN.forEach((c, j) => {
      for (const p of pts) {
        v3.set(p[0], p[1], p[2]).normalize().multiplyScalar(RC).applyQuaternion(q);
        if (j) v3.applyQuaternion(turn);
        put(cage, k++, [c[0] + v3.x, c[1] + v3.y, c[2] + v3.z], 2.75);
      }
    });
  }
  // the neighbours' own nuclei and mitochondria, veiled; cut flat where the right end of the block crosses them
  {
    const all = new Soup();
    const dimNucleus = (c, r, ph, xMax) => all.add(withColor(nucleusGeo(c, r, 0.02, ph, xMax, D - 3, 0.62), () => C.nucleus), null);
    const [n0, n1] = G.end.nuclei; // on the end face: [u from the front edge, section y, ru, rz]
    dimNucleus([L - 8, D - n0[0], HH - n0[1]], [36, n0[2], n0[3]], 4, L);
    // the back-row cell is narrower at the end than the drawing's end face has it (its border follows the honeycomb on top)
    dimNucleus([L - 6, Math.min(D - n1[0], yEdge - GAP - WALL - n1[2] - 5), HH - n1[1]], [30, n1[2], n1[3]], 8, L);
    dimNucleus([62, D - 56, HH - G.nucleus[1] + 6], [46, 36, 42], 6, Infinity);
    for (const [i, [u, sy, rx, ry]] of G.end.mito.entries()) all.add(beanGeo([L - ry - 3, D - u, HH - sy], [0.25, i ? -0.9 : 0.86, i ? 0.34 : -0.44].map((v, _, a) => v / Math.hypot(...a)), [1, 0, 0], rx, ry), null);
    solid(all.geometry(), matInDim, { receive: false });
  }

  // ---------------------------------------------------------------- the brush border
  const VR = G.VILLI_R;
  {
    const HN = 44;
    const prof = [[VR + 2.6, -2], [VR + 1.5, 0.3], [VR + 0.6, 2.2], [VR + 0.1, 5], [VR, 9], [VR, HN * 0.55], [VR, HN - VR]];
    const nd = seg(5, 3);
    for (let i = 1; i < nd; i++) prof.push([VR * Math.cos((i / nd) * (Math.PI / 2)), HN - VR + VR * Math.sin((i / nd) * (Math.PI / 2))]);
    prof.push([0, HN]);
    const d = latheData(prof, seg(14, 8));
    const g = withColor(smoothGeo(d.pos, d.idx), (x, y, z) => {
      const t = clamp(z / HN, 0, 1);
      return t < 0.5 ? blend(C.villusRoot, C.villus, sstep(0, 0.5, t)) : blend(C.villus, C.villusTip, sstep(0.5, 1, t));
    });
    const list = [];
    for (const [x, h, main] of G.villiFront) list.push({ p: [x - X0, D - VR, ZT], h: h - 4, main, dmt: DATA.DMT1.some((q) => Math.abs(q[0] - x) < 0.5), q: QI });
    for (const [x, v, h, main, dmt] of G.forest) if (v < D - 14) list.push({ p: [x - X0, v, ZT], h: h + 6, main, dmt, q: new T.Quaternion().setFromEuler(new T.Euler((rnd() - 0.5) * 0.11, (rnd() - 0.5) * 0.11, 0)) });
    const villi = instanced(g, flesh({ vertexColors: true, roughness: 0.52, clearcoat: 0.26, clearcoatRoughness: 0.36, sheen: 0.7 }), list.length);
    const dimK = new T.Color(C.villusDim.r / C.villus.r, C.villusDim.g / C.villus.g, C.villusDim.b / C.villus.b).multiplyScalar(night ? 0.8 : 0.97);
    const white = new T.Color(1, 1, 1);
    list.forEach((v, i) => {
      put(villi, i, v.p, 1, 1, v.h / HN, v.q);
      villi.setColorAt(i, v.main ? white : dimK);
    });
    // DMT1, the way in: a pair of small channels in the tip of each microvillus the drawing marks
    const tips = list.filter((v) => v.dmt);
    const cp = latheData(capsuleProfile(2.3, 9.5, seg(4, 3)), seg(10, 6));
    const dmt = instanced(smoothGeo(cp.pos, cp.idx), phys({ color: C.dmt1, roughness: 0.36, clearcoat: 0.6, clearcoatRoughness: 0.25 }), tips.length * 2);
    const v3b = new T.Vector3();
    const lean = [new T.Quaternion().setFromAxisAngle(new T.Vector3(0, 1, 0), -0.22), new T.Quaternion().setFromAxisAngle(new T.Vector3(0, 1, 0), 0.22)];
    tips.forEach((v, i) => {
      for (const s of [0, 1]) {
        v3b.set(s ? 3.1 : -3.1, 1.6, v.h - 1.4).applyQuaternion(v.q);
        put(dmt, i * 2 + s, [v.p[0] + v3b.x, v.p[1] + v3b.y, ZT + v3b.z], 1, 1, 1, lean[s]);
      }
    });
  }

  // ---------------------------------------------------------------- under the cells: lamina, lamina propria, the capillary
  {
    const lp = new Soup();
    const RO = CAPR + 6; // the endothelium's outer face
    const yz = (u, v, w) => [w, u, v]; // a profile in (y, z), pushed along x
    // lamina propria, with the groove the capillary lies in
    const prof = [[0, 0], [D, 0], [D, CAPZ - RO]];
    const na = seg(20, 10);
    for (let i = 1; i < na; i++) {
      const a = -Math.PI / 2 + (i / na) * Math.PI;
      prof.push([D - RO * Math.cos(a), CAPZ + RO * Math.sin(a)]);
    }
    prof.push([D, CAPZ + RO], [D, HH - (DATA.BASAL + 15)], [0, HH - (DATA.BASAL + 15)]);
    lp.prism(prof, 0, L, C.tissue, 0, yz);
    // the basement lamina, and the thin bed the cells sit on
    lp.prism([[0, 0], [L, 0], [L, D], [0, D]], HH - (DATA.BASAL + 15), HH - (DATA.BASAL + 10), C.lamina, 0);
    lp.prism([[0, 0], [L, 0], [L, D], [0, D]], HH - (DATA.BASAL + 10), ZB - 0.3, C.tissue, 0);
    // the capillary: endothelium as a half-tube, cut along its length by the front face
    const nb = seg(28, 12);
    for (let i = 0; i < nb; i++) {
      const a0 = -Math.PI / 2 + (i / nb) * Math.PI;
      const a1 = -Math.PI / 2 + ((i + 1) / nb) * Math.PI;
      const pt = (a, r, x) => [x, D - r * Math.cos(a), CAPZ + r * Math.sin(a)];
      const n0 = [0, Math.cos(a0), -Math.sin(a0)];
      const n1 = [0, Math.cos(a1), -Math.sin(a1)];
      // inner face, smooth
      const A = pt(a0, CAPR, 0), B = pt(a0, CAPR, L), Cc = pt(a1, CAPR, L), Dd = pt(a1, CAPR, 0);
      const push = (p, q, r, np, nq, nr) => {
        lp.p.push(...p, ...q, ...r);
        lp.n.push(...np, ...nq, ...nr);
        for (let k = 0; k < 3; k++) {
          lp.c.push(C.blood.r, C.blood.g, C.blood.b);
          lp.f.push(0);
        }
      };
      // wound to face the axis
      const ux = B[0] - A[0], uy = B[1] - A[1], uz = B[2] - A[2];
      const vx = Cc[0] - A[0], vy = Cc[1] - A[1], vz = Cc[2] - A[2];
      const flip = (uy * vz - uz * vy) * n0[0] + (uz * vx - ux * vz) * n0[1] + (ux * vy - uy * vx) * n0[2] < 0;
      if (flip) {
        push(A, Cc, B, n0, n1, n0);
        push(A, Dd, Cc, n0, n1, n1);
      } else {
        push(A, B, Cc, n0, n0, n1);
        push(A, Cc, Dd, n0, n1, n1);
      }
      lp.face([pt(a0, CAPR, L), pt(a0, RO, L), pt(a1, RO, L), pt(a1, CAPR, L)], [1, 0, 0], C.endo, 0);
    }
    lp.face([[0, D, CAPZ + CAPR], [L, D, CAPZ + CAPR], [L, D, CAPZ + RO], [0, D, CAPZ + RO]], [0, 1, 0], C.endo, 0);
    lp.face([[0, D, CAPZ - RO], [L, D, CAPZ - RO], [L, D, CAPZ - CAPR], [0, D, CAPZ - CAPR]], [0, 1, 0], C.endo, 0);
    solid(lp.geometry(), flesh({ vertexColors: true, roughness: 0.66, clearcoat: 0.12 }));
    // on the end face: collagen strands and fibroblasts of the lamina propria, in low relief
    const deco = new Soup();
    for (const [u, sy, cx, cy, ex, ey] of G.end.collagen) {
      const onEnd = (du, dy) => [L + 0.2, D - (u + du), HH - (sy + dy)];
      const pts = [0, 0.25, 0.5, 0.75, 1].map((t) => onEnd(2 * (1 - t) * t * cx + t * t * ex, 2 * (1 - t) * t * cy + t * t * ey));
      const d = sweepData(pts, (t) => 0.8 * Math.sqrt(Math.max(0.05, 1 - Math.pow(2 * t - 1, 6))), 5, 7);
      deco.add(smoothGeo(d.pos, d.idx), C.collagen, 0);
    }
    for (const [u, sy] of G.end.fibro) {
      const c = [L, D - u, HH - sy];
      const a = 0.25 * Math.sin(u);
      const ax = [0, -Math.cos(a), Math.sin(a)];
      const d = sweepData([-1, -0.5, 0, 0.5, 1].map((s) => [c[0], c[1] + ax[1] * s * 11, c[2] + ax[2] * s * 11]), (t) => 3.6 * Math.pow(Math.max(0, 1 - Math.pow(2 * t - 1, 2)), 0.8), seg(10, 6), seg(12, 8));
      for (let i = 0; i < d.pos.length; i += 3) d.pos[i] = L + (d.pos[i] - L) * 0.45;
      deco.add(smoothGeo(d.pos, d.idx), C.nucleus, 0);
    }
    solid(deco.geometry(), flesh({ vertexColors: true, roughness: 0.8, clearcoat: 0, sheen: 0.2 }), { cast: false });
  }

  // ---------------------------------------------------------------- what the model moves
  // iron: one bead, drawn wherever the model has one (lumen, cell, blood), on transferrin and in the ferritin cores
  const IRON_MAX = 220;
  const irons = instanced(ballGeo(seg(14, 8), seg(9, 6)), gel(phys({ color: C.iron, roughness: 0.32, clearcoat: 0.7, clearcoatRoughness: 0.2, emissive: C.iron, emissiveIntensity: night ? 0.22 : 0.1 }), { sigma: SIG * 0.45, clip: true }), IRON_MAX, { dynamic: true, cast: false, receive: false, ghost: true });
  // the blood: red cells (true biconcave discs) and transferrin, two lobes with an iron site each
  const RBC_R = 12.5;
  const rbcGeo = (() => {
    const n = seg(9, 5);
    const h = (q) => 0.5 * Math.sqrt(Math.max(0, 1 - q * q)) * (0.81 + 7.83 * q * q - 4.39 * q * q * q * q) * 2.5;
    const prof = [];
    for (let i = 0; i < n; i++) {
      const q = Math.sin((i / n) * (Math.PI / 2));
      prof.push([RBC_R * q, -h(q)]);
    }
    prof.push([RBC_R, 0]);
    for (let i = n - 1; i >= 0; i--) {
      const q = Math.sin((i / n) * (Math.PI / 2));
      prof.push([RBC_R * q, h(q)]);
    }
    const d = latheData(prof, seg(22, 12));
    return withColor(smoothGeo(d.pos, d.idx), (x, y) => blend(C.rbc, C.rbcIn, 1 - sstep(0.2, 0.62, Math.hypot(x, y) / RBC_R)));
  })();
  const RBC_N = 6;
  const rbcs = instanced(rbcGeo, gel(phys({ vertexColors: true, roughness: 0.36, clearcoat: 0.6, clearcoatRoughness: 0.22, sheen: 0.4, sheenColor: C.rbcIn, side: T.DoubleSide }), { clip: true, fog: false }), RBC_N, { dynamic: true, ghost: true });
  const rbcTilt = Array.from({ length: RBC_N }, (_, i) => ({ dep: 7 + ((i * 5) % 4) * 1.6, rx: -0.16 + 0.22 * Math.sin(i * 2.1), ry: 0.26 * Math.cos(i * 1.7), ph: i * 1.3 }));
  const TF_N = 3;
  const tfs = instanced(ballGeo(seg(16, 10), seg(10, 6)), gel(phys({ color: C.tf, roughness: 0.42, clearcoat: 0.5, clearcoatRoughness: 0.3, side: T.DoubleSide }), { clip: true, fog: false }), TF_N * 2, { dynamic: true, ghost: true });
  // hepcidin: a small hairpin, as the peptide is
  const hepGeo = (() => {
    const d = sweepData([[-3.5, 0.9, 7.4], [-3.7, 0.5, 3], [-2.6, 0, 0.1], [0, -0.3, -1], [2.6, 0, 0.1], [3.7, 0.5, 3], [3.5, 0.9, 7.4]], (t) => 1.75 * Math.sqrt(Math.max(0, 1 - Math.pow(Math.max(0, (Math.abs(2 * t - 1) - 0.84) / 0.16), 2))), seg(10, 6), seg(26, 14));
    return smoothGeo(d.pos, d.idx);
  })();
  const HEP_MAX = 8;
  const heps = instanced(hepGeo, phys({ color: C.hep, roughness: 0.38, clearcoat: 0.55, clearcoatRoughness: 0.25, emissive: C.hep, emissiveIntensity: night ? 0.25 : 0.08 }), HEP_MAX, { dynamic: true, cast: false, receive: false, ghost: true });
  // ferroportin: two subunits through the base membrane; each gate has its own material so it can fade as it is broken down
  const fpnGeo = (() => {
    const a = latheData(capsuleProfile(3.3, 30, seg(5, 3)), seg(14, 8));
    const pos = [];
    const idx = [];
    for (const dx of [-4.7, 4.7]) {
      const o = pos.length / 3;
      for (let i = 0; i < a.pos.length; i += 3) pos.push(a.pos[i] + dx, a.pos[i + 1], a.pos[i + 2]);
      for (const i of a.idx) idx.push(i + o);
    }
    return smoothGeo(pos, idx);
  })();
  const vesGeo = ballGeo(seg(28, 16), seg(18, 10), 21);
  const gates = DATA.FPN.map(() => {
    // (transparent from the start: the shader's alpha is fixed at compile time, so it cannot be switched on later)
    const pair = solid(fpnGeo, phys({ color: C.fpn, roughness: 0.4, clearcoat: 0.55, clearcoatRoughness: 0.28, sheen: 0.3, sheenColor: C.sheen, transparent: true }), { receive: false });
    const vm = phys({ color: night ? gain(C.gel, 1.5) : new T.Color("#fffaf2"), roughness: 0.2, clearcoat: 0.8, clearcoatRoughness: 0.15, transparent: true, opacity: 0.5, depthWrite: false });
    vm.onBeforeCompile = (sh) => {
      sh.fragmentShader = sh.fragmentShader.replace("#include <opaque_fragment>", "#include <opaque_fragment>\ngl_FragColor.a *= mix( 0.3, 1.0, pow( 1.0 - saturate( dot( normal, normalize( vViewPosition ) ) ), 1.5 ) );");
    };
    vm.customProgramCacheKey = () => "a1vesicle";
    const ves = ctx.ghost(new T.Mesh(vesGeo, vm));
    ves.renderOrder = 3;
    ves.visible = false;
    scene.add(ves);
    return { pair, ves, vm };
  });
  // where a gate has been taken in: an empty seat in the membrane
  const seats = instanced(ballGeo(seg(12, 8), seg(8, 6)), flesh({ color: gain(blend(K.membrane, K.cell, night ? 0.45 : 0.3), night ? 1.2 : 0.9), roughness: 0.6 }), DATA.FPN.length, { dynamic: true, cast: false, receive: false });

  // ---------------------------------------------------------------- one frame, from the model's state
  const depth = new WeakMap();
  const P3 = [0, 0, 0];
  const A3 = [0, 0, 0];
  const B3 = [0, 0, 0];
  const Q = new T.Quaternion();
  const EU = new T.Euler();
  const GOLD = Math.PI * (3 - Math.sqrt(5));
  const coreAt = Array.from({ length: 14 }, (_, i) => {
    const r = i ? 3.3 * Math.cbrt(i) : 0;
    const z = 1 - (2 * (i + 0.5)) / 14;
    const s = Math.sqrt(1 - z * z);
    return [r * s * Math.cos(i * GOLD), r * z * 0.9, r * s * Math.sin(i * GOLD)];
  });
  const TFDEP = 5;
  const hepQ = new T.Quaternion().setFromAxisAngle(new T.Vector3(0, 0, 1), -0.5);
  const { BASAL, CAP: CAPS } = DATA;
  function ironDepth(p, ease) {
    let r = depth.get(p);
    const fresh = !r;
    if (fresh) {
      r = { g: 9 + rnd() * 30, lum: -12 + rnd() * 64, d: 0 };
      depth.set(p, r);
    }
    let tgt = -2;
    let direct = fresh;
    if (p.stage === "lumen") {
      tgt = -2 + (r.lum + 2) * clamp(Math.hypot(p.x - p.d[0], p.y - (p.d[1] - 8)) / 110, 0, 1);
      direct = true;
    } else if (p.stage === "cyto") tgt = r.g;
    else if (p.stage === "exit") tgt = -5 + (r.g + 5) * clamp((Math.hypot(p.x - p.s.x, p.y - (BASAL - 2)) - 14) / 80, 0, 1);
    else if (p.stage === "out") tgt = -5;
    else if (p.stage === "drift") tgt = 1;
    else if (p.stage === "store") tgt = FDEP[p.k];
    r.d = direct ? tgt : r.d + (tgt - r.d) * ease;
    return r.d;
  }
  let lastT = 0;
  function update(S) {
    U.kit.value.copy(root.matrixWorld).invert();
    const now = performance.now();
    const dt = clamp((now - lastT) / 1000, 0, 0.1);
    lastT = now;
    const ease = 1 - Math.exp(-dt * 5);
    // iron
    let n = 0;
    for (const p of S.irons) {
      if (n >= IRON_MAX) break;
      const dep = ironDepth(p, ease);
      lift(p.x + (p.stage === "lumen" ? Math.sin(p.y * 0.08 + p.wob) * 3 : 0), p.y, dep, P3);
      put(irons, n++, P3, 3.4);
    }
    S.fill.forEach((f, j) => {
      const c = FCEN[j];
      const m = Math.min(14, Math.round(f));
      for (let i = 0; i < m && n < IRON_MAX; i++) {
        P3[0] = c[0] + coreAt[i][0];
        P3[1] = c[1] + coreAt[i][1];
        P3[2] = c[2] + coreAt[i][2];
        put(irons, n++, P3, 2.3);
      }
    });
    // transferrin and what it carries
    S.tf.forEach((c, i) => {
      const a = lift(c.x - 4, CAPS.y0 + 20, TFDEP, A3);
      const b = lift(c.x + 5, CAPS.y0 + 21, TFDEP + 1.5, B3);
      put(tfs, i * 2, a, 6.5);
      put(tfs, i * 2 + 1, b, 6.5);
      for (const [q, on] of [[a, c.load > 0], [b, c.load > 1]]) {
        if (!on || n >= IRON_MAX) continue;
        P3[0] = q[0] + VD[0] * 5.6;
        P3[1] = q[1] + VD[1] * 5.6;
        P3[2] = q[2] + VD[2] * 5.6;
        put(irons, n++, P3, 3);
      }
    });
    irons.count = n;
    irons.instanceMatrix.needsUpdate = true;
    tfs.instanceMatrix.needsUpdate = true;
    // red cells, rocking a little as they pass
    S.rbc.forEach((c, i) => {
      const k = rbcTilt[i % RBC_N];
      lift(c.x, c.y, k.dep, P3);
      EU.set(k.rx + 0.16 * Math.sin(c.x * 0.021 + k.ph), k.ry + 0.2 * Math.sin(c.x * 0.016 + k.ph * 2), 0);
      put(rbcs, i, P3, 1, 1, 1, Q.setFromEuler(EU));
    });
    rbcs.instanceMatrix.needsUpdate = true;
    // hepcidin on its way, and the gates
    let h = 0;
    for (const hp of S.heps) {
      const u = clamp((CAPS.y1 - 6 - hp.y) / (CAPS.y1 - 6 - (BASAL + 15)), 0, 1);
      put(heps, h++, lift(hp.x, hp.y, 6 - 12 * u, P3), 1, 1, 1, hepQ);
    }
    S.slots.forEach((s, i) => {
      const g = gates[i];
      let y = BASAL;
      let dep = -1;
      let a = 1;
      let ves = 0;
      let vs = 1;
      let hep = 0;
      if (s.state === "bound") hep = 1;
      else if (s.state === "in") {
        const u = Math.min(1, s.t / 1.8);
        y = BASAL - 70 * u;
        dep = -1 + 6 * u;
        a = u < 0.6 ? 1 : 1 - (u - 0.6) / 0.4;
        ves = a;
        vs = 0.5 + 0.5 * sstep(0, 0.3, u);
        hep = a;
      } else if (s.state === "back") {
        const u = Math.min(1, s.t / 1.3);
        y = BASAL - 60 * (1 - u);
        dep = -1 + 6 * (1 - u);
        ves = 1 - u;
        a = Math.min(1, 0.3 + u);
      }
      const gone = s.state === "gone";
      g.pair.visible = !gone && a > 0.01;
      g.ves.visible = ves > 0.01;
      lift(s.x, y, dep, P3);
      g.pair.position.set(P3[0], P3[1], P3[2]);
      g.pair.material.opacity = a;
      if (g.ves.visible) {
        g.ves.position.set(P3[0], P3[1], P3[2]);
        g.ves.scale.setScalar(vs);
        g.vm.opacity = 0.5 * ves;
      }
      if (hep > 0.01 && h < HEP_MAX) put(heps, h++, lift(s.x, y + 14, dep - 5.5, P3), hep, hep, hep, hepQ);
      put(seats, i, lift(s.x, BASAL + 0.5, -0.4, P3), gone ? 8.5 : 0, gone ? 2.4 : 0, gone ? 3.2 : 0);
    });
    heps.count = h;
    heps.instanceMatrix.needsUpdate = true;
    seats.instanceMatrix.needsUpdate = true;
  }
  return {
    update,
    dispose() {
      for (const m of mats) m.dispose();
    },
  };
}
