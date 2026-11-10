// optimal-gl3: the real-time 3-D beauty pass of an Optimal figure.
//
// A figure's solids already exist as true 3-D geometry (the kit records every slab, turned body, tube and ball in
// world units). This layer renders those same solids in WebGL, in the figure's own camera (the kit's projection,
// reproduced exactly as an orthographic camera), with physically based materials, studio lighting and soft shadows.
// The figure's SVG stays on top as an ink pass: its solid fills turn white and the SVG is multiplied over this
// canvas, so every dial tick, label, screen and hit target the figure draws still lands on the right surface, and
// nearer solids still hide what is behind them (the SVG's own painter's order). With no WebGL 2 the SVG is the figure.
//
// The figure owns the clock: it moves parts (`move`, `figure`, `set`) and calls `render()` once a frame.
import * as THREE from "three";
import { GTAOPass } from "three-addons/postprocessing/GTAOPass.js";
import { FullScreenQuad } from "three-addons/postprocessing/Pass.js";

export const version = 2;
// Figure-specific scene code (a `build` function, see create) gets three.js from here: one copy for every figure.
// A chosen set, not the whole library: no loaders, so the chunk still holds no network or storage API.
export const T = {
  Vector2: THREE.Vector2,
  Vector3: THREE.Vector3,
  Vector4: THREE.Vector4,
  Matrix3: THREE.Matrix3,
  Matrix4: THREE.Matrix4,
  Quaternion: THREE.Quaternion,
  Euler: THREE.Euler,
  Color: THREE.Color,
  Box3: THREE.Box3,
  Sphere: THREE.Sphere,
  Plane: THREE.Plane,
  MathUtils: THREE.MathUtils,
  Object3D: THREE.Object3D,
  Group: THREE.Group,
  Mesh: THREE.Mesh,
  InstancedMesh: THREE.InstancedMesh,
  Line: THREE.Line,
  LineSegments: THREE.LineSegments,
  Points: THREE.Points,
  BufferGeometry: THREE.BufferGeometry,
  BufferAttribute: THREE.BufferAttribute,
  Float32BufferAttribute: THREE.Float32BufferAttribute,
  Uint16BufferAttribute: THREE.Uint16BufferAttribute,
  Uint32BufferAttribute: THREE.Uint32BufferAttribute,
  InstancedBufferAttribute: THREE.InstancedBufferAttribute,
  SphereGeometry: THREE.SphereGeometry,
  BoxGeometry: THREE.BoxGeometry,
  CylinderGeometry: THREE.CylinderGeometry,
  ConeGeometry: THREE.ConeGeometry,
  TorusGeometry: THREE.TorusGeometry,
  PlaneGeometry: THREE.PlaneGeometry,
  CircleGeometry: THREE.CircleGeometry,
  RingGeometry: THREE.RingGeometry,
  TubeGeometry: THREE.TubeGeometry,
  LatheGeometry: THREE.LatheGeometry,
  ExtrudeGeometry: THREE.ExtrudeGeometry,
  ShapeGeometry: THREE.ShapeGeometry,
  IcosahedronGeometry: THREE.IcosahedronGeometry,
  CapsuleGeometry: THREE.CapsuleGeometry,
  CatmullRomCurve3: THREE.CatmullRomCurve3,
  CubicBezierCurve3: THREE.CubicBezierCurve3,
  QuadraticBezierCurve3: THREE.QuadraticBezierCurve3,
  LineCurve3: THREE.LineCurve3,
  CurvePath: THREE.CurvePath,
  Shape: THREE.Shape,
  Path: THREE.Path,
  ShapeUtils: THREE.ShapeUtils,
  MeshPhysicalMaterial: THREE.MeshPhysicalMaterial,
  MeshStandardMaterial: THREE.MeshStandardMaterial,
  MeshBasicMaterial: THREE.MeshBasicMaterial,
  ShaderMaterial: THREE.ShaderMaterial,
  LineBasicMaterial: THREE.LineBasicMaterial,
  PointsMaterial: THREE.PointsMaterial,
  CanvasTexture: THREE.CanvasTexture,
  DataTexture: THREE.DataTexture,
  PointLight: THREE.PointLight,
  DoubleSide: THREE.DoubleSide,
  FrontSide: THREE.FrontSide,
  BackSide: THREE.BackSide,
  NormalBlending: THREE.NormalBlending,
  AdditiveBlending: THREE.AdditiveBlending,
  MultiplyBlending: THREE.MultiplyBlending,
  RepeatWrapping: THREE.RepeatWrapping,
  ClampToEdgeWrapping: THREE.ClampToEdgeWrapping,
  MirroredRepeatWrapping: THREE.MirroredRepeatWrapping,
  SRGBColorSpace: THREE.SRGBColorSpace,
  LinearSRGBColorSpace: THREE.LinearSRGBColorSpace,
  LinearFilter: THREE.LinearFilter,
  NearestFilter: THREE.NearestFilter,
  LinearMipmapLinearFilter: THREE.LinearMipmapLinearFilter,
  DynamicDrawUsage: THREE.DynamicDrawUsage,
  RGBAFormat: THREE.RGBAFormat,
  UnsignedByteType: THREE.UnsignedByteType,
};

const V = (a) => new THREE.Vector3(a[0], a[1], a[2]);
const clamp = (x, a, b) => Math.max(a, Math.min(b, x));

// ───────────────────────────────────────────────────────────── materials
// One palette for both themes: warm white shells, sage and forest paint, graphite, rubber, steel, maple. The theme
// changes the room (bright studio on Cream, a dark stage with a rim light on Forest night), not the object.
const PRESETS = {
  shell: { color: 0xece8de, roughness: 0.4, clearcoat: 0.35, clearcoatRoughness: 0.32 },
  satin: { color: 0xd9ddd3, roughness: 0.52, metalness: 0.04 },
  bone: { color: 0xe7dfd0, roughness: 0.62 },
  sage: { color: 0xa7b89d, roughness: 0.46, clearcoat: 0.3, clearcoatRoughness: 0.38 },
  forest: { color: 0x2f5227, roughness: 0.4, clearcoat: 0.5, clearcoatRoughness: 0.3 },
  slate: { color: 0x5c675d, roughness: 0.5, metalness: 0.2 },
  graphite: { color: 0x30362f, roughness: 0.5, metalness: 0.25 },
  rubber: { color: 0x22261f, roughness: 0.88 },
  steel: { color: 0xd4d6cf, roughness: 0.3, metalness: 1 },
  nickel: { color: 0xd9d6cb, roughness: 0.44, metalness: 1 },
  alu: { color: 0xd9dbd5, roughness: 0.42, metalness: 0.9 },
  brass: { color: 0xc8a25a, roughness: 0.32, metalness: 1 },
  copper: { color: 0xc77b55, roughness: 0.34, metalness: 1 },
  wood: { color: 0xead6b6, roughness: 0.56, clearcoat: 0.18, clearcoatRoughness: 0.55, map: "wood" },
  woodDark: { color: 0xc9a87e, roughness: 0.58, clearcoat: 0.18, clearcoatRoughness: 0.55, map: "wood" },
  silicone: { color: 0xa9bfc6, roughness: 0.62, sheen: 0.6, sheenRoughness: 0.5, sheenColor: 0xffffff },
glass: { color: 0xf2f7f3, roughness: 0.05, metalness: 0, clearcoat: 1, clearcoatRoughness: 0.04, transparent: true, opacity: 0.22, depthWrite: false, envMapIntensity: 1.6, ghost: true },
  smoke: { color: 0x39423a, roughness: 0.1, clearcoat: 1, clearcoatRoughness: 0.06, transparent: true, opacity: 0.5, depthWrite: false, envMapIntensity: 1.4, ghost: true },
  // liquids and gels inside glass: tinted, a little see-through
  fluid: { color: 0xc9a25a, roughness: 0.15, transparent: true, opacity: 0.78, ghost: true },
  water: { color: 0xa9cfe0, roughness: 0.08, transparent: true, opacity: 0.5, ghost: true },
  blood: { color: 0x8f1f1c, roughness: 0.25, clearcoat: 0.6, clearcoatRoughness: 0.2 },
  // living tissue: soft, a little wet. `sheen` gives the velvet falloff that reads as flesh; clearcoat is the wet film.
  tissue: { color: 0xe7a9a0, roughness: 0.55, sheen: 0.8, sheenRoughness: 0.45, sheenColor: 0xffd9cf, clearcoat: 0.25, clearcoatRoughness: 0.35 },
  mucosa: { color: 0xf0c4b6, roughness: 0.42, sheen: 0.7, sheenRoughness: 0.4, sheenColor: 0xffe6dc, clearcoat: 0.55, clearcoatRoughness: 0.22 },
  muscle: { color: 0xb5514a, roughness: 0.5, sheen: 0.6, sheenRoughness: 0.5, sheenColor: 0xf0b0a4, clearcoat: 0.3, clearcoatRoughness: 0.3 },
  fat: { color: 0xf1dc9c, roughness: 0.48, sheen: 0.5, sheenRoughness: 0.5, sheenColor: 0xfff3cf, clearcoat: 0.4, clearcoatRoughness: 0.3 },
  cartilage: { color: 0xdfe8ee, roughness: 0.3, sheen: 0.5, sheenRoughness: 0.4, sheenColor: 0xffffff, clearcoat: 0.7, clearcoatRoughness: 0.18 },
  marrow: { color: 0xc98a78, roughness: 0.6, sheen: 0.5, sheenRoughness: 0.5, sheenColor: 0xf4c9bb },
  artery: { color: 0xb8322c, roughness: 0.38, clearcoat: 0.6, clearcoatRoughness: 0.2 },
  vein: { color: 0x4d6aa8, roughness: 0.4, clearcoat: 0.6, clearcoatRoughness: 0.2 },
  nerve: { color: 0xe6c86a, roughness: 0.45, clearcoat: 0.4, clearcoatRoughness: 0.3 },
  redcell: { color: 0xb5231f, roughness: 0.34, clearcoat: 0.7, clearcoatRoughness: 0.18, sheen: 0.4, sheenColor: 0xff8a7a },
  membrane: { color: 0xf3cfc4, roughness: 0.25, clearcoat: 0.6, clearcoatRoughness: 0.2, transparent: true, opacity: 0.4, depthWrite: false, ghost: true },
  cytoplasm: { color: 0xf6e6d6, roughness: 0.3, clearcoat: 0.5, clearcoatRoughness: 0.25, transparent: true, opacity: 0.3, depthWrite: false, ghost: true },
  leaf: { color: 0x8fc47f, roughness: 0.42, clearcoat: 0.3 },
  heat: { color: 0xd8663c, roughness: 0.45, clearcoat: 0.3 },
  cool: { color: 0x4f7ea3, roughness: 0.45, clearcoat: 0.3 },
  red: { color: 0xb3402f, roughness: 0.55 },
  green: { color: 0x3f7a35, roughness: 0.55 },
  blue: { color: 0x3e6a8f, roughness: 0.55 },
  // paper: unlit and brighter than white, so it is still white after the tone curve. The SVG multiplies over it, so
  // whatever the figure draws there (a screen, a chart) shows as drawn.
  paper: { basic: true, color: 0xffffff, gain: 8 },
};

function woodTexture() {
  // maple: pale, close-grained. Broad soft bands of tone, fine streaks along the grain (the lathe's axis) and a
  // scatter of short pores. Kept faint: at figure size it should read as wood, not as stripes. Deterministic.
  const c = document.createElement("canvas");
  c.width = 512;
  c.height = 512;
  const g = c.getContext("2d");
  g.fillStyle = "#ffffff";
  g.fillRect(0, 0, 512, 512);
  let seed = 7;
  const rnd = () => ((seed = (seed * 16807) % 2147483647) / 2147483647);
  for (let i = 0; i < 16; i++) {
    const x = rnd() * 512;
    const w = 24 + rnd() * 70;
    const grad = g.createLinearGradient(x - w, 0, x + w, 0);
    const a = 0.035 + rnd() * 0.05;
    grad.addColorStop(0, "rgba(150,104,58,0)");
    grad.addColorStop(0.5, `rgba(150,104,58,${a.toFixed(3)})`);
    grad.addColorStop(1, "rgba(150,104,58,0)");
    g.fillStyle = grad;
    g.fillRect(x - w, 0, w * 2, 512);
    if (x - w < 0) g.fillRect(x - w + 512, 0, w * 2, 512);
    if (x + w > 512) g.fillRect(x - w - 512, 0, w * 2, 512);
  }
  for (let i = 0; i < 520; i++) {
    const x = rnd() * 512;
    g.strokeStyle = `rgba(${118 + ((rnd() * 30) | 0)},${78 + ((rnd() * 22) | 0)},${40 + ((rnd() * 16) | 0)},${(0.018 + rnd() * 0.05).toFixed(3)})`;
    g.lineWidth = 0.5 + rnd() * 1.1;
    g.beginPath();
    const drift = (rnd() - 0.5) * 10;
    g.moveTo(x, 0);
    g.bezierCurveTo(x + drift, 170, x - drift, 340, x, 512);
    g.stroke();
  }
  for (let i = 0; i < 1400; i++) {
    g.fillStyle = `rgba(110,74,40,${(0.03 + rnd() * 0.06).toFixed(3)})`;
    g.fillRect(rnd() * 512, rnd() * 512, 0.8, 2 + rnd() * 7);
  }
  const t = new THREE.CanvasTexture(c);
  t.wrapS = t.wrapT = THREE.RepeatWrapping;
  t.colorSpace = THREE.SRGBColorSpace;
  t.anisotropy = 8;
  return t;
}

function materials() {
  const cache = new Map();
  let wood = null;
  return function get(name) {
    const key = PRESETS[name] ? name : "shell";
    if (cache.has(key)) return cache.get(key);
    const p = { ...PRESETS[key] };
    let m;
    if (p.basic) m = new THREE.MeshBasicMaterial({ color: new THREE.Color(p.color).multiplyScalar(p.gain || 1) });
    else {
      if (p.map === "wood") p.map = wood || (wood = woodTexture());
      const ghost = !!p.ghost;
      delete p.ghost;
      m = new THREE.MeshPhysicalMaterial({ metalness: 0, ...p });
      m.userData.ghost = ghost; // see-through: casts no shadow and takes no part in the occlusion pass
    }
    m.name = key;
    cache.set(key, m);
    return m;
  };
}

// ───────────────────────────────────────────────────────────── geometry (frame-local: x = F.u, y = F.v, z = F.a)
/** A turned body: profile [[s, r, smooth?], …] along the axis. Flats stay flat, corners get a small round. */
function latheGeo(profile, { radial = 48, bevel = 0.22 } = {}) {
  let pts = profile.map((p) => [p[0], Math.max(0, p[1]), !!p[2]]);
  // drop repeats, close both ends onto the axis
  pts = pts.filter((p, i) => i === 0 || Math.hypot(p[0] - pts[i - 1][0], p[1] - pts[i - 1][1]) > 1e-5);
  if (pts[0][1] > 1e-3) pts.unshift([pts[0][0], 0, false]);
  if (pts[pts.length - 1][1] > 1e-3) pts.push([pts[pts.length - 1][0], 0, false]);
  const n = pts.length;
  const segN = (a, b) => {
    const ds = b[0] - a[0];
    const dr = b[1] - a[1];
    const l = Math.hypot(ds, dr) || 1;
    return [-dr / l, ds / l]; // [nS, nR]: outward for a profile running along +s
  };
  // rings: { s, r, ns, nr }. A smooth point takes the mean of its neighbours' normals; a sharp corner is cut back by
  // `bevel` on both sides and the two new rings keep their own flat's normal, so the strip between them rounds over.
  const rings = [];
  const push = (s, r, nrm) => rings.push({ s, r, ns: nrm[0], nr: nrm[1] });
  for (let i = 0; i < n; i++) {
    const p = pts[i];
    const a = pts[i - 1];
    const b = pts[i + 1];
    if (!a) { push(p[0], p[1], segN(p, b)); continue; }
    if (!b) { push(p[0], p[1], segN(a, p)); continue; }
    const na = segN(a, p);
    const nb = segN(p, b);
    const cos = na[0] * nb[0] + na[1] * nb[1];
    if (p[2] || cos > 0.94) {
      const l = Math.hypot(na[0] + nb[0], na[1] + nb[1]) || 1;
      push(p[0], p[1], [(na[0] + nb[0]) / l, (na[1] + nb[1]) / l]);
      continue;
    }
    const la = Math.hypot(p[0] - a[0], p[1] - a[1]);
    const lb = Math.hypot(b[0] - p[0], b[1] - p[1]);
    const e = Math.min(bevel, la * 0.3, lb * 0.3);
    if (e < 0.02 || p[1] < 1e-3) { push(p[0], p[1], na); push(p[0], p[1], nb); continue; }
    push(p[0] - ((p[0] - a[0]) / la) * e, p[1] - ((p[1] - a[1]) / la) * e, na);
    push(p[0] + ((b[0] - p[0]) / lb) * e, p[1] + ((b[1] - p[1]) / lb) * e, nb);
  }
  const maxR = Math.max(...rings.map((r) => r.r));
  const seg = Math.max(12, Math.min(radial, Math.round(14 + maxR * 5)));
  const pos = [];
  const nor = [];
  const uv = [];
  const idx = [];
  const s0 = rings[0].s;
  for (const ring of rings)
    for (let i = 0; i <= seg; i++) {
      const t = (i / seg) * Math.PI * 2;
      const c = Math.cos(t);
      const sn = Math.sin(t);
      pos.push(ring.r * c, ring.r * sn, ring.s);
      nor.push(ring.nr * c, ring.nr * sn, ring.ns);
      uv.push((i / seg) * Math.max(1, Math.round(maxR / 4)), (ring.s - s0) / 42);
    }
  const row = seg + 1;
  for (let j = 0; j < rings.length - 1; j++) {
    const A = rings[j];
    const B = rings[j + 1];
    if (A.r < 1e-4 && B.r < 1e-4) continue;
    if (Math.hypot(A.s - B.s, A.r - B.r) < 1e-6) continue;
    for (let i = 0; i < seg; i++) {
      const a = j * row + i;
      const b = a + 1;
      const c = a + row;
      const d = c + 1;
      idx.push(a, b, d, a, d, c);
    }
  }
  const g = new THREE.BufferGeometry();
  g.setAttribute("position", new THREE.Float32BufferAttribute(pos, 3));
  g.setAttribute("normal", new THREE.Float32BufferAttribute(nor, 3));
  g.setAttribute("uv", new THREE.Float32BufferAttribute(uv, 2));
  g.setIndex(idx);
  return g;
}

/** A convex or concave outline extruded from s0 to s1 along the axis, its top and bottom edges rounded over. */
function prismGeo(poly, s0, s1, { bevel = 0.22 } = {}) {
  let P = poly.map(([x, y]) => [x, y]).filter((p, i, a) => {
    const q = a[(i + a.length - 1) % a.length];
    return Math.hypot(p[0] - q[0], p[1] - q[1]) > 1e-5;
  });
  let area = 0;
  for (let i = 0; i < P.length; i++) {
    const a = P[i];
    const b = P[(i + 1) % P.length];
    area += a[0] * b[1] - b[0] * a[1];
  }
  if (area < 0) P.reverse();
  const n = P.length;
  if (s1 < s0) [s0, s1] = [s1, s0];
  const en = P.map((a, i) => {
    const b = P[(i + 1) % n];
    const dx = b[0] - a[0];
    const dy = b[1] - a[1];
    const l = Math.hypot(dx, dy) || 1;
    return [dy / l, -dx / l, l];
  });
  let minDim = Infinity;
  {
    const xs = P.map((p) => p[0]);
    const ys = P.map((p) => p[1]);
    minDim = Math.min(Math.max(...xs) - Math.min(...xs), Math.max(...ys) - Math.min(...ys), s1 - s0);
  }
  const b = clamp(Math.min(bevel, minDim * 0.22), 0, bevel);
  // vertex normals on the side wall: smooth where the outline bends gently (a rounded corner), split where it is a real corner
  const vn = P.map((_, i) => {
    const a = en[(i + n - 1) % n];
    const c = en[i];
    const cos = a[0] * c[0] + a[1] * c[1];
    if (cos > 0.86) {
      const l = Math.hypot(a[0] + c[0], a[1] + c[1]) || 1;
      return [(a[0] + c[0]) / l, (a[1] + c[1]) / l];
    }
    return null;
  });
  // the outline pulled in by b for the caps (a mitre, held short on sharp corners)
  const inset = P.map((p, i) => {
    const a = en[(i + n - 1) % n];
    const c = en[i];
    const k = 1 / Math.max(0.35, 1 + a[0] * c[0] + a[1] * c[1]);
    return [p[0] - (a[0] + c[0]) * k * b, p[1] - (a[1] + c[1]) * k * b];
  });
  const pos = [];
  const nor = [];
  const uv = [];
  const tri = (p, q, r, np, nq, nr) => {
    pos.push(...p, ...q, ...r);
    nor.push(...np, ...nq, ...nr);
    uv.push(p[0] / 40, p[1] / 40, q[0] / 40, q[1] / 40, r[0] / 40, r[1] / 40);
  };
  const zb = s0 + b;
  const zt = s1 - b;
  for (let i = 0; i < n; i++) {
    const j = (i + 1) % n;
    const e = en[i];
    const ni = vn[i] ? [vn[i][0], vn[i][1], 0] : [e[0], e[1], 0];
    const nj = vn[j] ? [vn[j][0], vn[j][1], 0] : [e[0], e[1], 0];
    const A = [P[i][0], P[i][1], zb];
    const B = [P[j][0], P[j][1], zb];
    const C = [P[j][0], P[j][1], zt];
    const D = [P[i][0], P[i][1], zt];
    tri(A, B, C, ni, nj, nj);
    tri(A, C, D, ni, nj, ni);
    if (b > 1e-4) {
      const Ti = [inset[i][0], inset[i][1], s1];
      const Tj = [inset[j][0], inset[j][1], s1];
      tri(D, C, Tj, ni, nj, [0, 0, 1]);
      tri(D, Tj, Ti, ni, [0, 0, 1], [0, 0, 1]);
      const Bi = [inset[i][0], inset[i][1], s0];
      const Bj = [inset[j][0], inset[j][1], s0];
      tri(B, A, Bi, nj, ni, [0, 0, -1]);
      tri(B, Bi, Bj, nj, [0, 0, -1], [0, 0, -1]);
    }
  }
  const faces = THREE.ShapeUtils.triangulateShape(inset.map(([x, y]) => new THREE.Vector2(x, y)), []);
  for (const [a, c, d] of faces) {
    const pa = inset[a];
    const pc = inset[c];
    const pd = inset[d];
    const ccw = (pc[0] - pa[0]) * (pd[1] - pa[1]) - (pc[1] - pa[1]) * (pd[0] - pa[0]) > 0;
    const [q, r] = ccw ? [pc, pd] : [pd, pc];
    tri([pa[0], pa[1], s1], [q[0], q[1], s1], [r[0], r[1], s1], [0, 0, 1], [0, 0, 1], [0, 0, 1]);
    tri([pa[0], pa[1], s0], [r[0], r[1], s0], [q[0], q[1], s0], [0, 0, -1], [0, 0, -1], [0, 0, -1]);
  }
  const g = new THREE.BufferGeometry();
  g.setAttribute("position", new THREE.Float32BufferAttribute(pos, 3));
  g.setAttribute("normal", new THREE.Float32BufferAttribute(nor, 3));
  g.setAttribute("uv", new THREE.Float32BufferAttribute(uv, 2));
  return g;
}

function tubeGeo(points, r) {
  const curve = new THREE.CatmullRomCurve3(points.map(V), false, "centripetal", 0.5);
  const len = curve.getLength();
  const g = new THREE.TubeGeometry(curve, Math.max(8, Math.round(len / Math.max(0.6, r * 0.7))), r, r > 1.2 ? 16 : 12, false);
  return g;
}

/** Mirror a frame-local geometry through z (for a left-handed frame): flips z, normals and winding. */
function mirrorZ(g) {
  const p = g.attributes.position;
  const nr = g.attributes.normal;
  for (let i = 0; i < p.count; i++) {
    p.setZ(i, -p.getZ(i));
    nr.setZ(i, -nr.getZ(i));
  }
  if (g.index) {
    const a = g.index.array;
    for (let i = 0; i < a.length; i += 3) {
      const t = a[i + 1];
      a[i + 1] = a[i + 2];
      a[i + 2] = t;
    }
  } else {
    for (const attr of [p, nr, g.attributes.uv]) {
      if (!attr) continue;
      const s = attr.itemSize;
      const arr = attr.array;
      for (let i = 0; i < arr.length; i += 3 * s)
        for (let k = 0; k < s; k++) {
          const t = arr[i + s + k];
          arr[i + s + k] = arr[i + 2 * s + k];
          arr[i + 2 * s + k] = t;
        }
    }
  }
  return g;
}

const handed = (F) => {
  const [u, v, a] = [F.u, F.v, F.a];
  return (u[1] * v[2] - u[2] * v[1]) * a[0] + (u[2] * v[0] - u[0] * v[2]) * a[1] + (u[0] * v[1] - u[1] * v[0]) * a[2] >= 0;
};
function frameMatrix(F, right, out) {
  const a = right ? F.a : [-F.a[0], -F.a[1], -F.a[2]];
  out.set(F.u[0], F.v[0], a[0], F.o[0], F.u[1], F.v[1], a[1], F.o[1], F.u[2], F.v[2], a[2], F.o[2], 0, 0, 0, 1);
  return out;
}
const FLOOR = { o: [0, 0, 0], a: [0, 0, 1], u: [1, 0, 0], v: [0, 1, 0] };

/** Geometry + frame for one part descriptor (see shared/gl3-export.mjs for the shapes). */
function buildPart(d) {
  if (d.k === "b") return { geo: new THREE.SphereGeometry(d.r, d.r > 6 ? 48 : 32, d.r > 6 ? 32 : 20), F: { ...FLOOR, o: d.c }, right: true };
  if (d.k === "t") return { geo: tubeGeo(d.pts, d.r), F: FLOOR, right: true };
  const F = d.F || FLOOR;
  const right = handed(F);
  let geo;
  if (d.k === "l") geo = latheGeo(d.prof, { bevel: d.bevel ?? 0.22 });
  else if (d.k === "q") {
    geo = new THREE.PlaneGeometry(d.w, d.h);
    geo.translate(d.w / 2, d.h / 2, 0);
  } else geo = prismGeo(d.poly, d.s0, d.s1, { bevel: d.bevel ?? 0.22 });
  if (!right) mirrorZ(geo);
  return { geo, F, right };
}

// ───────────────────────────────────────────────────────────── the room
function studio(renderer, theme, basis) {
  // A small set built from light panels, baked to an environment map. Positions are given as the camera sees the
  // set (x to screen right, y up, z toward the viewer) and turned into world space by `basis`: a big soft key
  // overhead and to the left, a tall strip at the left for the long highlight down turned parts, a fill from the
  // front right, a thin rim behind. Night dims the walls, so the key and the rim carve the shape.
  const night = theme !== "light";
  const s = new THREE.Scene();
  const wall = new THREE.Mesh(new THREE.BoxGeometry(60, 60, 60), new THREE.MeshBasicMaterial({ color: night ? 0x232c22 : 0xcbc6b9, side: THREE.BackSide }));
  s.add(wall);
  const panel = (w, h, pos, color, k) => {
    const m = new THREE.Mesh(new THREE.PlaneGeometry(w, h), new THREE.MeshBasicMaterial({ color: new THREE.Color(color).multiplyScalar(k), side: THREE.DoubleSide }));
    m.position.copy(new THREE.Vector3(...pos).applyMatrix4(basis));
    m.up.set(0, 0, 1);
    m.lookAt(0, 0, 0);
    s.add(m);
  };
  panel(26, 18, [-8, 20, 9], 0xfff6e8, night ? 6.5 : 8); // key, overhead-left
  panel(5, 26, [-22, 6, 6], 0xfffaf0, night ? 3.2 : 4.5); // strip, left
  panel(14, 16, [18, 6, 12], 0xeaf3ea, night ? 1.3 : 2.8); // fill, front-right
  panel(30, 4, [5, 10, -22], 0xdff3d8, night ? 6 : 3.5); // rim, behind
  panel(44, 44, [0, -24, 0], night ? 0x1f2a1c : 0xf3ecdf, night ? 0.7 : 1.5); // floor bounce
  const pm = new THREE.PMREMGenerator(renderer);
  const env = pm.fromScene(s, 0.03).texture;
  pm.dispose();
  s.traverse((o) => {
    if (o.geometry) o.geometry.dispose();
    if (o.material) o.material.dispose();
  });
  return env;
}

// ───────────────────────────────────────────────────────────── passes
// Whatever lies on the floor (shadow, the night pool) fades out toward the canvas edge, so the canvas never shows as a box.
const EDGE_GLSL = "uniform vec2 uRes; float edgeFade(){ vec2 s = gl_FragCoord.xy / uRes; vec2 e = smoothstep(vec2(0.0), vec2(0.09), s) * smoothstep(vec2(0.0), vec2(0.09), 1.0 - s); return e.x * e.y; }";
const QUAD_VS = "varying vec2 vUv; void main(){ vUv = uv; gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0); }";

/** Final pass: tone curve and sRGB on straight colour (the buffers hold premultiplied colour), a hair of dither. */
function outputMaterial() {
  return new THREE.ShaderMaterial({
    uniforms: { tDiffuse: { value: null }, toneMappingExposure: { value: 1 } },
    vertexShader: QUAD_VS,
    fragmentShader: `
      uniform sampler2D tDiffuse;
      varying vec2 vUv;
      #include <tonemapping_pars_fragment>
      float hash(vec2 p){ return fract(sin(dot(p, vec2(12.9898, 78.233))) * 43758.5453); }
      void main(){
        vec4 t = texture2D(tDiffuse, vUv);
        float a = clamp(t.a, 0.0, 1.0);
        vec3 c = a > 1e-4 ? t.rgb / a : vec3(0.0);
        c = NeutralToneMapping(max(c, 0.0));
        c = sRGBTransferOETF(vec4(c, 1.0)).rgb;
        c += (hash(gl_FragCoord.xy) - 0.5) / 255.0;
        gl_FragColor = vec4(clamp(c, 0.0, 1.0) * a, a);
      }`,
    toneMapped: false,
    depthTest: false,
    depthWrite: false,
    blending: THREE.NoBlending,
  });
}

/**
 * The shadow on the floor, in two layers drawn by one see-through plane:
 *   cast     the figure's silhouette as the key light sees it, blurred wide and laid along the light's direction.
 *            Everything stands above the floor, so anything the light sees shades it: no depth test, so none of a
 *            shadow map's holes or grain. It fades out away from the figure and never ends at the canvas edge.
 *   contact  the scene seen from the floor looking up, nearer = darker, blurred tight: what seats a foot or a base.
 */
function groundShadows({ size, centre, ground, span, lightDir, height, color, cast, contact, res }) {
  const opts = { type: THREE.HalfFloatType, depthBuffer: false, magFilter: THREE.LinearFilter, minFilter: THREE.LinearFilter };
  const mk = () => new THREE.WebGLRenderTarget(size, size, opts);
  const rtContact = mk();
  const rtCast = mk();
  const rtTmp = mk();
  // contact: from the floor, looking up
  const reach = span * 0.75 + 20;
  const camC = new THREE.OrthographicCamera(-reach, reach, reach, -reach, 0, height);
  camC.position.set(centre.x, centre.y, ground);
  camC.up.set(0, 1, 0);
  camC.lookAt(centre.x, centre.y, ground + 1);
  camC.updateMatrixWorld(true);
  // cast: along the key light
  const reachL = span * 0.95 + 30;
  const camL = new THREE.OrthographicCamera(-reachL, reachL, reachL, -reachL, 1, span * 6);
  camL.position.copy(centre).addScaledVector(lightDir, span * 3);
  camL.up.set(0, 0, 1);
  camL.lookAt(centre);
  camL.updateMatrixWorld(true);
  const flat = (frag, max) =>
    new THREE.ShaderMaterial({
      vertexShader: "void main(){ gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0); }",
      fragmentShader: frag,
      side: THREE.DoubleSide,
      depthTest: false,
      depthWrite: false,
      blending: max ? THREE.CustomBlending : THREE.NoBlending,
      blendEquation: THREE.MaxEquation,
      blendSrc: THREE.OneFactor,
      blendDst: THREE.OneFactor,
    });
  const depth = flat("void main(){ float a = 1.0 - gl_FragCoord.z; gl_FragColor = vec4(a * a); }", true);
  const mask = flat("void main(){ gl_FragColor = vec4(1.0); }", false);
  const blur = new THREE.ShaderMaterial({
    uniforms: { t: { value: null }, d: { value: new THREE.Vector2() } },
    vertexShader: QUAD_VS,
    fragmentShader: `
      uniform sampler2D t; uniform vec2 d; varying vec2 vUv;
      void main(){
        float s = texture2D(t, vUv).r * 0.2270270;
        s += (texture2D(t, vUv + d * 1.3846154).r + texture2D(t, vUv - d * 1.3846154).r) * 0.3162162;
        s += (texture2D(t, vUv + d * 3.2307692).r + texture2D(t, vUv - d * 3.2307692).r) * 0.0702703;
        gl_FragColor = vec4(s);
      }`,
    depthTest: false,
    depthWrite: false,
    blending: THREE.NoBlending,
  });
  const quad = new FullScreenQuad(blur);
  const soften = (renderer, rt, steps) => {
    for (const k of steps) {
      blur.uniforms.t.value = rt.texture;
      blur.uniforms.d.value.set(k / size, 0);
      renderer.setRenderTarget(rtTmp);
      quad.render(renderer);
      blur.uniforms.t.value = rtTmp.texture;
      blur.uniforms.d.value.set(0, k / size);
      renderer.setRenderTarget(rt);
      quad.render(renderer);
    }
  };
  const mC = new THREE.Matrix4().multiplyMatrices(camC.projectionMatrix, camC.matrixWorldInverse);
  const mL = new THREE.Matrix4().multiplyMatrices(camL.projectionMatrix, camL.matrixWorldInverse);
  const plane = new THREE.Mesh(
    new THREE.PlaneGeometry(span * 5, span * 5),
    new THREE.ShaderMaterial({
      uniforms: {
        tContact: { value: rtContact.texture },
        tCast: { value: rtCast.texture },
        mC: { value: mC },
        mL: { value: mL },
        color: { value: new THREE.Color(color) },
        k: { value: new THREE.Vector2(cast, contact) },
        fade: { value: new THREE.Vector4(centre.x, centre.y, span * 0.5, span * 1.3) },
        uRes: res,
      },
      vertexShader: "varying vec3 vW; void main(){ vec4 w = modelMatrix * vec4(position, 1.0); vW = w.xyz; gl_Position = projectionMatrix * viewMatrix * w; }",
      fragmentShader: `
        uniform sampler2D tContact; uniform sampler2D tCast; uniform mat4 mC; uniform mat4 mL;
        uniform vec3 color; uniform vec2 k; uniform vec4 fade; varying vec3 vW;
        ${EDGE_GLSL}
        float tap(sampler2D t, mat4 m){
          vec2 uv = (m * vec4(vW, 1.0)).xy * 0.5 + 0.5;
          vec2 e = smoothstep(vec2(0.0), vec2(0.06), uv) * smoothstep(vec2(0.0), vec2(0.06), 1.0 - uv);
          return texture2D(t, clamp(uv, 0.0, 1.0)).r * e.x * e.y;
        }
        void main(){
          float far = 1.0 - smoothstep(fade.z, fade.w, length(vW.xy - fade.xy));
          float a = tap(tCast, mL) * k.x * far;
          float b = smoothstep(0.0, 0.62, tap(tContact, mC)) * k.y;
          gl_FragColor = vec4(color, clamp(1.0 - (1.0 - a) * (1.0 - b), 0.0, 1.0) * edgeFade());
        }`,
      transparent: true,
      depthWrite: false,
    }),
  );
  plane.position.set(centre.x, centre.y, ground - 0.03);
  plane.renderOrder = -1;
  const keep = new THREE.Color();
  return {
    plane,
    update(renderer, world, hide) {
      const vis = hide.map((o) => o.visible);
      hide.forEach((o) => (o.visible = false));
      const prevAuto = renderer.autoClear;
      renderer.getClearColor(keep);
      const prevAlpha = renderer.getClearAlpha();
      renderer.autoClear = true;
      renderer.setClearColor(0x000000, 0);
      world.overrideMaterial = depth;
      renderer.setRenderTarget(rtContact);
      renderer.render(world, camC);
      world.overrideMaterial = mask;
      renderer.setRenderTarget(rtCast);
      renderer.render(world, camL);
      world.overrideMaterial = null;
      hide.forEach((o, i) => (o.visible = vis[i]));
      soften(renderer, rtContact, [1, 2.2, 3.6, 5.2]);
      soften(renderer, rtCast, [1, 2.2, 3.6]);
      renderer.setRenderTarget(null);
      renderer.autoClear = prevAuto;
      renderer.setClearColor(keep, prevAlpha);
    },
    dispose() {
      rtContact.dispose();
      rtCast.dispose();
      rtTmp.dispose();
      depth.dispose();
      mask.dispose();
      blur.dispose();
      quad.dispose();
      plane.geometry.dispose();
      plane.material.dispose();
    },
  };
}

/**
 * create({ canvas, P, W, H, scene, theme, clear, coarse })
 *   P       the kit projection ({ origin, scale, azimuth, elevation }), W × H the SVG's viewBox
 *   scene   { parts: [descriptor…], ground }  from shared/figkit.mjs (gl3Scene)
 *   clear   a CSS colour to paint behind the figure, or null for a see-through canvas
 *   coarse  true on touch devices: lighter shadows and occlusion
 *   build   optional: figure-specific scene code. build(ctx) is called once, after the scene's parts are in, with
 *           ctx = { THREE, root, material(name), add(desc), ghost(mesh), night, coarse, P, W, H }. `root` is a Group
 *           in the kit's own coordinates (cm, z up): add any three.js object to it. Meshes that should shade and
 *           be shaded need castShadow / receiveShadow = true; pass see-through meshes to ghost() so they stay out
 *           of the shadow and occlusion passes. It may return { update(state), dispose() }; the figure then calls
 *           layer.update(state) before render().
 */
export function create({ canvas, P, W, H, scene, theme = "light", clear = null, coarse = false, debug = "", build = null, onLost, onRestored }) {
  let renderer;
  try {
    renderer = new THREE.WebGLRenderer({ canvas, antialias: false, alpha: true, powerPreference: "high-performance", premultipliedAlpha: true });
  } catch (_) {
    return null;
  }
  const night = theme !== "light";
  renderer.outputColorSpace = THREE.SRGBColorSpace;
  renderer.toneMapping = THREE.NoToneMapping; // the tone curve is applied once, in the final pass
  renderer.shadowMap.enabled = true;
  renderer.shadowMap.type = THREE.VSMShadowMap;
  renderer.setClearColor(0x000000, 0);
  renderer.autoClear = true;

  // the kit's camera: screen x = o.x + (p·r)k, screen y = o.y − (p·u)k, depth toward the viewer = p·d
  const A = (P.azimuth * Math.PI) / 180;
  const E = (P.elevation * Math.PI) / 180;
  const k = P.scale * Math.sqrt(1.6); // the kit's cameraOf: its plan unit is √1.6
  const r = new THREE.Vector3(Math.sin(A), -Math.cos(A), 0);
  const u = new THREE.Vector3(-Math.cos(A) * Math.sin(E), -Math.sin(A) * Math.sin(E), Math.cos(E));
  const d = new THREE.Vector3(Math.cos(A) * Math.cos(E), Math.sin(A) * Math.cos(E), Math.sin(E));
  // The kit's world is left-handed (r × u = −d): its picture is a mirror image of a right-handed scene. three.js
  // drops any mirror from a camera, so the camera is a plain rotation (−r, u, d) and the scene hangs under one
  // group that reflects it through the plane across r. A world point p then lands at (p·r, p·u, p·d) in the
  // camera, which is the kit's projection exactly. Lights and the floor live in the same mirrored space.
  const cam = new THREE.OrthographicCamera((0 - P.origin[0]) / k, (W - P.origin[0]) / k, P.origin[1] / k, (P.origin[1] - H) / k, 1, 6000);
  cam.matrixAutoUpdate = false;
  cam.matrix.makeBasis(r.clone().negate(), u, d).setPosition(d.clone().multiplyScalar(3000));
  cam.matrixWorld.copy(cam.matrix);
  cam.matrixWorldInverse.copy(cam.matrix).invert();
  cam.updateProjectionMatrix();
  const mirror = new THREE.Group();
  mirror.matrixAutoUpdate = false;
  mirror.matrix.set(1 - 2 * r.x * r.x, -2 * r.x * r.y, 0, 0, -2 * r.x * r.y, 1 - 2 * r.y * r.y, 0, 0, 0, 0, 1, 0, 0, 0, 0, 1);

  const world = new THREE.Scene();
  // the studio as the camera sees it: x to screen right (−r in the mirrored world), y up, z toward the viewer
  const basis = new THREE.Matrix4().makeBasis(r.clone().negate(), new THREE.Vector3(0, 0, 1), new THREE.Vector3(Math.cos(A), Math.sin(A), 0));
  world.environment = studio(renderer, theme, basis);
  world.environmentIntensity = (night ? 0.8 : 0.62) * (scene.look?.env ?? 1);
  world.add(mirror);

  const mat = materials();
  const root = new THREE.Group();
  mirror.add(root);
  const pieces = new Map(); // piece name → Group (rigid movers)
  const named = new Map(); // part name → Mesh
  const pieceOf = (name) => {
    if (!name || name === "stand") return root;
    let g = pieces.get(name);
    if (!g) {
      g = new THREE.Group();
      g.name = name;
      root.add(g);
      pieces.set(name, g);
    }
    return g;
  };
  const M4 = new THREE.Matrix4();
  const ghosts = []; // see-through meshes: hidden while shadows and occlusion are worked out
  function addPart(desc, parent) {
    const { geo, F, right } = buildPart(desc);
    const mesh = new THREE.Mesh(geo, mat(desc.m));
    mesh.matrixAutoUpdate = false;
    mesh.matrix.copy(frameMatrix(F, right, M4));
    const ghost = !!mesh.material.userData.ghost || desc.shadow === false;
    mesh.castShadow = desc.m !== "paper" && !ghost;
    mesh.receiveShadow = desc.m !== "paper" && !ghost;
    mesh.userData.right = right;
    if (ghost) {
      ghosts.push(mesh);
      mesh.renderOrder = 2;
    }
    (parent || pieceOf(desc.p)).add(mesh);
    if (desc.n) named.set(desc.n, mesh);
    return mesh;
  }
  for (const desc of scene.parts || []) {
    try {
      addPart(desc);
    } catch (err) {
      console.warn("gl3: skipped part", desc.n, err);
    }
  }

  // the figure's own scene code, on the same root, lights and passes
  let custom = null;
  if (build) {
    try {
      custom =
        build({
          THREE: T,
          root,
          material: mat,
          add: (desc) => addPart(desc),
          ghost: (mesh) => {
            mesh.castShadow = false;
            ghosts.push(mesh);
            return mesh;
          },
          night,
          coarse,
          P,
          W,
          H,
        }) || null;
    } catch (err) {
      console.warn("gl3: the figure's scene failed to build", err);
      renderer.dispose();
      return null;
    }
  }

  // bounds → ground, lights, shadow camera (in the kit's own, unmirrored coordinates)
  world.updateMatrixWorld(true); // from the top: the mirror group's own world matrix must be current
  const box = new THREE.Box3();
  const inRoot = new THREE.Matrix4();
  root.traverse((o) => {
    if (!o.isMesh || !o.geometry) return;
    if (!o.geometry.boundingBox) o.geometry.computeBoundingBox();
    // the mesh's box in the kit's coordinates: its world matrix with the mirror taken back off
    inRoot.copy(mirror.matrix).invert().multiply(o.matrixWorld);
    box.union(o.geometry.boundingBox.clone().applyMatrix4(inRoot));
  });
  if (scene.bounds) box.union(new THREE.Box3(V(scene.bounds[0]), V(scene.bounds[1])));
  if (box.isEmpty()) box.set(new THREE.Vector3(-50, -50, 0), new THREE.Vector3(50, 50, 100));
  const centre = box.getCenter(new THREE.Vector3());
  const size = box.getSize(new THREE.Vector3());
  const span = Math.max(size.x, size.y, size.z);
  const groundZ = scene.ground ?? box.min.z;
  const look = scene.look || {};

  const key = new THREE.DirectionalLight(0xfff4e6, night ? 3.3 : 3.0);
  // from above, a little left of the camera and toward it: tops lightest, shadows falling back and to the right
  const keyDir = new THREE.Vector3().addScaledVector(r, -0.5).addScaledVector(d, 0.42).add(new THREE.Vector3(0, 0, 1.45)).normalize();
  key.position.copy(centre).addScaledVector(keyDir, span * 2.2);
  key.target.position.copy(centre);
  key.castShadow = true;
  const sm = coarse ? 768 : 1024;
  key.shadow.mapSize.set(sm, sm);
  const sc = key.shadow.camera;
  const reach = span * 0.85 + 30;
  sc.left = -reach;
  sc.right = reach;
  sc.top = reach;
  sc.bottom = -reach;
  sc.near = 1;
  sc.far = span * 5;
  key.shadow.bias = -0.0005;
  key.shadow.normalBias = 0.6;
  key.shadow.radius = coarse ? 7 : 9; // wide: the key is a big softbox, so its shadow is soft
  key.shadow.blurSamples = coarse ? 10 : 16;
  mirror.add(key, key.target);
  const rim = new THREE.DirectionalLight(0xdcf2d3, night ? 1.5 : 0.5);
  rim.position.copy(centre).addScaledVector(r, span).addScaledVector(d, -span * 1.4).add(new THREE.Vector3(0, 0, span * 0.9));
  rim.target.position.copy(centre);
  mirror.add(rim, rim.target);
  mirror.add(new THREE.HemisphereLight(night ? 0xcfe0c8 : 0xfffaf0, night ? 0x10180f : 0xcfc6b2, night ? 0.35 : 0.42));

  // The floor only takes shadow, so the page shows through around the figure (see groundShadows). It lives in the
  // mirrored world's own coordinates: its cameras must not carry the mirror.
  const res = { value: new THREE.Vector2(1, 1) };
  let pool = null;
  if (night) {
    // a faint lit pool under the figure, so dark-footed machines still stand on something
    pool = new THREE.Mesh(
      new THREE.PlaneGeometry(span * 2.4, span * 2.4),
      new THREE.ShaderMaterial({
        uniforms: { uRes: res, tint: { value: new THREE.Color(0xc4dcb8) }, k: { value: 0.16 * (look.pool ?? 1) } },
        vertexShader: "varying vec2 vUv; void main(){ vUv = uv; gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0); }",
        fragmentShader: `uniform vec3 tint; uniform float k; varying vec2 vUv; ${EDGE_GLSL}
          void main(){ float r = length(vUv - 0.5) * 2.0; float a = pow(1.0 - smoothstep(0.0, 1.0, r), 1.6) * k * edgeFade(); gl_FragColor = vec4(tint, a); }`,
        transparent: true,
        depthWrite: false,
      }),
    );
    pool.position.set(centre.x, centre.y, groundZ - 0.06);
    pool.renderOrder = -2;
    mirror.add(pool);
  }
  const ground = groundShadows({
    size: coarse ? 256 : 512,
    centre: centre.clone().setZ(groundZ + size.z * 0.35).applyMatrix4(mirror.matrix),
    ground: groundZ,
    span,
    lightDir: keyDir.clone().transformDirection(mirror.matrix),
    height: look.contactHeight ?? clamp(span * 0.14, 12, 38),
    color: night ? 0x000000 : 0x3d3320,
    cast: (look.cast ?? 1) * (night ? 0.55 : 0.26),
    contact: (look.contact ?? 1) * (night ? 0.85 : 0.7),
    res,
  });
  world.add(ground.plane);
  const groundOnly = [ground.plane].concat(pool ? [pool] : []);

  // ── dynamic figures (the mannequin): parts keyed by name, geometry built once, frames updated every call
  const figures = new Map();
  function figure(keyName, parts, materialOf) {
    let fig = figures.get(keyName);
    if (!fig) {
      fig = { group: new THREE.Group(), meshes: new Map() };
      root.add(fig.group);
      figures.set(keyName, fig);
    }
    const seen = new Set();
    for (const p of parts) {
      if (p.kind === "line") continue;
      seen.add(p.name);
      let m = fig.meshes.get(p.name);
      if (!m) {
        const desc = p.kind === "ball" ? { k: "b", c: [0, 0, 0], r: p.r } : p.kind === "prism" ? { k: "p", F: p.F, poly: p.poly, s0: p.s0, s1: p.s1, bevel: 0.35 } : { k: "l", F: p.F, prof: p.profile, bevel: 0.35 };
        desc.m = (materialOf && materialOf(p)) || (p.wood ? "wood" : p.kind === "ball" ? "nickel" : "shell");
        m = addPart(desc, fig.group);
        fig.meshes.set(p.name, m);
      }
      m.visible = true;
      if (p.kind === "ball") m.matrix.makeTranslation(p.c[0], p.c[1], p.c[2]);
      else frameMatrix(p.F, m.userData.right, m.matrix);
    }
    for (const [name, m] of fig.meshes) if (!seen.has(name)) m.visible = false;
  }

  // ── buffers: beauty (multisampled, linear) → occlusion blended in → tone curve to the canvas
  let cssW = 0;
  let cssH = 0;
  let dpr = 1;
  let level = coarse ? 1 : 2; // 2: full, 1: lighter occlusion, 0: none
  let beauty = null;
  let mixed = null;
  let gtao = null;
  const out = outputMaterial();
  out.uniforms.toneMappingExposure.value = (night ? 1.0 : 0.98) * (look.exposure ?? 1);
  const outQuad = new FullScreenQuad(out);
  function buffers() {
    const pw = Math.max(2, Math.round(cssW * dpr));
    const ph = Math.max(2, Math.round(cssH * dpr));
    if (!beauty) {
      beauty = new THREE.WebGLRenderTarget(pw, ph, { type: THREE.HalfFloatType, samples: 4, depthBuffer: true });
      mixed = new THREE.WebGLRenderTarget(pw, ph, { type: THREE.HalfFloatType, depthBuffer: false });
    } else {
      beauty.setSize(pw, ph);
      mixed.setSize(pw, ph);
    }
    res.value.set(pw, ph);
    if (level > 0) {
      if (!gtao) {
        gtao = new GTAOPass(world, cam, 16, 16);
        gtao.output = debug === "ao" ? GTAOPass.OUTPUT.Denoise : debug === "normal" ? GTAOPass.OUTPUT.Normal : GTAOPass.OUTPUT.Default;
        gtao.renderToScreen = false;
      }
      const aoScale = level === 2 ? (pw * ph > 2.6e6 ? 0.75 : 1) : 0.5;
      gtao.setSize(Math.max(2, Math.round(pw * aoScale)), Math.max(2, Math.round(ph * aoScale)));
      gtao.blendIntensity = look.ao ?? 1;
      const aoR = look.aoRadius ?? clamp(span * 0.045, 4, 12); // world units (cm); `thickness` is too, so it scales with the radius
      gtao.updateGtaoMaterial({ radius: aoR, distanceExponent: 1.2, thickness: aoR * 2.2, distanceFallOff: 1, scale: 1.7, samples: level === 2 ? 16 : 8, screenSpaceRadius: false });
      gtao.updatePdMaterial({ lumaPhi: 10, depthPhi: 2, normalPhi: 3, radius: level === 2 ? 6 : 4, radiusExponent: 1.4, rings: 2, samples: level === 2 ? 16 : 8 });
    }
  }
  function resize(w, h) {
    if (!w || !h) return;
    let want = Math.min(window.devicePixelRatio || 1, 2);
    if (level === 0) want = Math.min(want, 1.5);
    const cap = coarse ? 2.2e6 : 4.6e6; // device pixels
    if (w * h * want * want > cap) want = Math.sqrt(cap / (w * h));
    if (w === cssW && h === cssH && want === dpr) return;
    cssW = w;
    cssH = h;
    dpr = want;
    renderer.setPixelRatio(dpr);
    renderer.setSize(w, h, false);
    buffers();
  }

  let lost = false;
  canvas.addEventListener("webglcontextlost", (e) => {
    e.preventDefault();
    lost = true;
    if (onLost) onLost();
  });
  canvas.addEventListener("webglcontextrestored", () => {
    lost = false;
    if (onRestored) onRestored();
  });

  let frames = 0;
  const api = {
    version,
    resize,
    render() {
      if (lost || !cssW) return;
      const hidden = groundOnly.concat(ghosts.filter((g) => g.visible));
      ground.update(renderer, world, hidden);
      renderer.setRenderTarget(beauty);
      renderer.setClearColor(0x000000, 0);
      renderer.clear();
      renderer.render(world, cam);
      let src = beauty;
      if (level > 0 && gtao) {
        // occlusion is worked out on the solids alone: the shadow layers on the floor are see-through
        hidden.forEach((o) => (o.visible = false));
        gtao.render(renderer, mixed, beauty, 0, false);
        hidden.forEach((o) => (o.visible = true));
        src = mixed;
      }
      renderer.setRenderTarget(null);
      renderer.setClearColor(0x000000, 0);
      renderer.clear();
      out.uniforms.tDiffuse.value = src.texture;
      outQuad.render(renderer);
      frames++;
    },
    /** 2 full, 1 lighter occlusion, 0 no occlusion and a lower pixel ratio. The host steps down when frames run long. */
    quality(n) {
      if (n === undefined) return level;
      n = clamp(n | 0, 0, 2);
      if (n === level) return level;
      level = n;
      const w = cssW;
      cssW = 0;
      resize(w, cssH);
      return level;
    },
    /** Rigid move of every part recorded with this piece name (world units). */
    move(piece, v) {
      const g = pieces.get(piece);
      if (g) g.position.set(v[0], v[1], v[2]);
    },
    /**
     * Change a named part: its frame ({ o, a, u, v }; the vectors may be scaled, which stretches the part), whether
     * it shows, its preset (m), or its own colour, opacity or glow (emissive + intensity).
     */
    set(name, { F, visible, m, color, opacity, emissive, intensity } = {}) {
      const mesh = named.get(name);
      if (!mesh) return false;
      if (F) frameMatrix(F, mesh.userData.right, mesh.matrix);
      if (visible !== undefined) mesh.visible = visible;
      if (m) {
        mesh.material = mat(m);
        mesh.userData.own = false;
      }
      if (color !== undefined || opacity !== undefined || emissive !== undefined) {
        if (!mesh.userData.own) {
          const ghost = mesh.material.userData.ghost;
          mesh.material = mesh.material.clone(); // this part's own copy; presets are shared
          mesh.material.userData.ghost = ghost;
          mesh.userData.own = true;
        }
        if (color !== undefined) mesh.material.color.set(color);
        if (opacity !== undefined) {
          mesh.material.opacity = opacity;
          mesh.material.transparent = opacity < 1;
        }
        if (emissive !== undefined && mesh.material.emissive) {
          mesh.material.emissive.set(emissive);
          mesh.material.emissiveIntensity = intensity ?? 1;
        }
      }
      return true;
    },
    /** Add a part after mount (a descriptor, as in the scene). */
    add(desc) {
      return !!addPart(desc);
    },
    figure,
    /** Hand the figure's state to its own scene code (the object `build` returned). */
    update(state) {
      if (custom && custom.update) custom.update(state);
    },
    /**
     * Follow a changed viewBox (x, y, w, h in the SVG's own units): the picture then shows that part of the drawing.
     * The canvas must be laid over the SVG's box as before.
     */
    view(x, y, w, h) {
      cam.left = (x - P.origin[0]) / k;
      cam.right = (x + w - P.origin[0]) / k;
      cam.top = (P.origin[1] - y) / k;
      cam.bottom = (P.origin[1] - y - h) / k;
      cam.updateProjectionMatrix();
    },
    has: (name) => named.has(name) || pieces.has(name),
    /** A world point in the SVG's own pixels (QA: must equal the kit's iso()). */
    project(p) {
      const q = V(p).applyMatrix4(mirror.matrix).project(cam);
      return [((q.x + 1) / 2) * W, ((1 - q.y) / 2) * H];
    },
    stats: () => ({ parts: named.size, calls: renderer.info.render.calls, triangles: renderer.info.render.triangles, dpr: +dpr.toFixed(2), cssW, cssH, level, frames }),
    dispose() {
      world.traverse((o) => {
        if (o.geometry) o.geometry.dispose();
      });
      if (world.environment) world.environment.dispose();
      if (custom && custom.dispose) custom.dispose();
      ground.dispose();
      if (gtao) gtao.dispose();
      if (beauty) beauty.dispose();
      if (mixed) mixed.dispose();
      out.dispose();
      outQuad.dispose();
      renderer.dispose();
    },
  };
  return api;
}
