// A8 in real-time 3-D (shared/gl3 `build` hook): the same cut length of a muscle bundle as the drawing, modelled.
//
// World units are the section's own (x across the slice, y back into the arm with the cut face at y = D, z up), so
// every part sits exactly where the drawing has it and the ⊙ current marks the SVG keeps on top land on the right
// fibre or gap.
//   fibres      one prism per fibre: the drawing's own smoothed outline, run the length of the bundle, with a rounded
//               shoulder and a slightly pillowed cut face. Myofibril ends stipple the cut face; cross-striations band
//               the sides. Each is moved and scaled by the scene (fibre size, spacing), never rebuilt.
//   fluid       the water between the fibres: a glossy bed the fibres stand a little proud of on the cut face, and
//               the blue in the grooves along the body.
//   sheath      the perimysium: an opaque cut rim, and a see-through film along the body (the drawing's veil).
//   capillaries cut ends in the corners between fibres (wall and lumen), and fine vessels in the outer grooves.
//   nuclei      pressed to the edge of each fibre's cut face.
// update({ fibre, spread }) is the drawing's own state (live.js `g`), so the two can't disagree.
function a8Scene(ctx, DATA, BASE) {
  const { THREE, root, night, coarse } = ctx;
  const { C, RX, RY, cells, fibres, caps } = DATA;
  const { H, D } = DATA.body;
  const CX = C[0];
  const CZ = H - C[1];
  const TAU = Math.PI * 2;

  // the drawing's palette (figure.css), as lit surfaces
  const PAL = night
    ? { f1: "#a8434a", f2: "#c56a70", sheen1: "#f0a4a8", sheen2: "#ffc9cc", fluid: "#2b6f8e", fluidGlow: 0.2, peri: "#e8dcc6", wall: "#e8b4a8", lumen: "#c43a32", nuc: "#6a5ac0", vessel: "#c43a32" }
    : { f1: "#a23b4b", f2: "#cf7882", sheen1: "#f3b3bc", sheen2: "#ffd5da", fluid: "#8fc5e3", fluidGlow: 0.14, peri: "#f4ead4", wall: "#f6d4cb", lumen: "#b8302a", nuc: "#33287f", vessel: "#b8302a" };

  const group = new THREE.Group();
  group.position.set(CX, 0, CZ); // everything hangs from the bundle's axis, in the drawing's own units
  root.add(group);
  const solid = (mesh) => {
    mesh.castShadow = mesh.receiveShadow = true;
    group.add(mesh);
    return mesh;
  };
  const disposables = [];
  const keep = (x) => (disposables.push(x), x);

  // ---------------------------------------------------------------- geometry helpers
  // Rings of points joined into a skin. Every ring runs clockwise in (x, z) and the rings advance toward +y (or
  // inward across an end face), which gives outward normals in the figure's coordinates.
  function skin(rings, extra) {
    const n = rings[0].length;
    const pos = new Float32Array(rings.length * n * 3);
    rings.forEach((ring, j) => ring.forEach((p, i) => pos.set(p, (j * n + i) * 3)));
    const idx = [];
    for (let j = 0; j < rings.length - 1; j++)
      for (let i = 0; i < n; i++) {
        const a = j * n + i;
        const b = j * n + ((i + 1) % n);
        idx.push(a, b, b + n, a, b + n, a + n);
      }
    const geo = new THREE.BufferGeometry();
    geo.setAttribute("position", new THREE.BufferAttribute(pos, 3));
    if (extra) for (const [name, size, fn] of extra) {
      const arr = new Float32Array(rings.length * n * size);
      rings.forEach((_, j) => { for (let i = 0; i < n; i++) arr.set(fn(j, i), (j * n + i) * size); });
      geo.setAttribute(name, new THREE.BufferAttribute(arr, size));
    }
    geo.setIndex(idx);
    geo.computeVertexNormals();
    return keep(geo);
  }
  const SEG = coarse ? 64 : 112;
  // a ring on the bundle's ellipse: k scales it, pad pushes it out evenly (the sheath's thickness)
  const ell = (k, pad, y) => Array.from({ length: SEG }, (_, i) => {
    const t = (i / SEG) * TAU;
    return [Math.cos(t) * (RX * k + pad), y, -Math.sin(t) * (RY * k + pad)];
  });

  // ---------------------------------------------------------------- materials
  const GLSL_PARS = `
    vec2 a8h2(vec2 p){ vec3 p3 = fract(vec3(p.xyx) * vec3(0.1031, 0.1030, 0.0973)); p3 += dot(p3, p3.yzx + 33.33); return fract((p3.xx + p3.yz) * p3.zy); }
    float a8n2(vec2 p){ vec2 i = floor(p); vec2 f = fract(p); f = f * f * (3.0 - 2.0 * f);
      float a = a8h2(i).x, b = a8h2(i + vec2(1.0, 0.0)).x, c = a8h2(i + vec2(0.0, 1.0)).x, d = a8h2(i + vec2(1.0, 1.0)).x;
      return mix(mix(a, b, f.x), mix(c, d, f.x), f.y); }
    float a8dots(vec2 q){ vec2 c0 = floor(q); float d = 9.0;
      for (int j = -1; j <= 1; j++) for (int i = -1; i <= 1; i++){ vec2 c = c0 + vec2(float(i), float(j)); vec2 p = c + 0.5 + (a8h2(c) - 0.5) * 0.85; d = min(d, length(q - p)); }
      return d; }
    vec3 a8bump(vec3 sp, vec3 sn, vec2 dH, float fd){ vec3 sx = dFdx(sp); vec3 sy = dFdy(sp); vec3 r1 = cross(sy, sn); vec3 r2 = cross(sn, sx);
      float det = dot(sx, r1) * fd; vec3 g = sign(det) * (dH.x * r1 + dH.y * r2); return normalize(abs(det) * sn - g); }`;

  // A muscle fibre: wet, soft, a little velvety. On the cut face the myofibril ends show as a fine stipple and the
  // edge (the sarcolemma) is a shade deeper; along its length the cross-striations band it. All procedural, and
  // each fades out before it gets too fine to resolve (phones), so nothing shimmers.
  function fibreMaterial(color, sheenColor) {
    const m = new THREE.MeshPhysicalMaterial({ color, roughness: 0.52, metalness: 0, sheen: 0.45, sheenRoughness: 0.5, sheenColor, clearcoat: 0.5, clearcoatRoughness: 0.32 });
    const U = {
      uA8a: { value: new THREE.Vector4(coarse ? 5.6 : 4.3, coarse ? 10 : 8, night ? 0.13 : 0.16, night ? 0.065 : 0.085) }, // stipple cell, striation period (units), their tone
      uA8b: { value: new THREE.Vector4(night ? 0.17 : 0.24, night ? 0.11 : 0.16, 0.7, night ? 1.12 : 1.08) }, // stipple relief, striation relief, edge tone, centre tone
      uA8c: { value: new THREE.Vector4(night ? 0.78 : 0.7, 0, 0, 0) }, // the tone of a fibre's side against its cut face (the drawing's deeper bands)
    };
    m.onBeforeCompile = (sh) => {
      Object.assign(sh.uniforms, U);
      sh.vertexShader = sh.vertexShader
        .replace("#include <common>", "#include <common>\nattribute vec2 aA8; varying vec3 vA8P; varying vec3 vA8N; varying vec2 vA8E; varying vec3 vA8Y;")
        .replace("#include <begin_vertex>", "#include <begin_vertex>\nvA8P = position; vA8N = normal; vA8E = aA8; vA8Y = normalize(mat3(modelViewMatrix) * vec3(0.0, 1.0, 0.0));");
      sh.fragmentShader = sh.fragmentShader
        .replace("#include <common>", `#include <common>\nuniform vec4 uA8a; uniform vec4 uA8b; uniform vec4 uA8c; varying vec3 vA8P; varying vec3 vA8N; varying vec2 vA8E; varying vec3 vA8Y;${GLSL_PARS}`)
        .replace(
          "#include <color_fragment>",
          `#include <color_fragment>
          float a8cap = smoothstep(0.3, 0.8, normalize(vA8N).y);
          vec2 a8q = (vA8P.xz + vA8E.y * vec2(41.0, 17.0)) / uA8a.x;
          float a8fq = 1.0 - smoothstep(0.3, 0.75, max(fwidth(a8q.x), fwidth(a8q.y)));
          float a8dot = (1.0 - smoothstep(0.14, 0.42, a8dots(a8q))) * a8fq * a8cap;
          float a8ph = vA8P.y / uA8a.y + vA8E.y * 3.0;
          float a8fs = 1.0 - smoothstep(0.2, 0.5, fwidth(a8ph));
          float a8side = (1.0 - a8cap) * a8fs;
          float a8st = sin(6.2831853 * a8ph) * a8side;
          float a8rim = (1.0 - smoothstep(0.0, 0.2, vA8E.x)) * a8cap;
          diffuseColor.rgb *= (0.955 + 0.09 * vA8E.y) * (1.0 + uA8a.z * (a8dot - 0.3 * a8fq * a8cap) + uA8a.w * a8st);
          diffuseColor.rgb *= mix(1.0, uA8b.z, a8rim) * mix(1.0, uA8b.w, smoothstep(0.25, 1.0, vA8E.x) * a8cap) * mix(uA8c.x, 1.0, a8cap);`,
        )
        .replace(
          "#include <normal_fragment_maps>",
          `#include <normal_fragment_maps>
          { float a8h = uA8b.x * a8dot; normal = a8bump(-vViewPosition, normal, vec2(dFdx(a8h), dFdy(a8h)), faceDirection);
            // the striations' relief, worked out exactly (a slope along the fibre), so it can't alias
            vec3 a8t = vA8Y - normal * dot(vA8Y, normal);
            normal = normalize(normal - a8t * (uA8b.y * 6.2831853 / uA8a.y) * cos(6.2831853 * a8ph) * a8side); }`,
        );
    };
    m.customProgramCacheKey = () => "a8-fibre";
    return keep(m);
  }
  const fibreMat = [null, fibreMaterial(PAL.f1, PAL.sheen1), fibreMaterial(PAL.f2, PAL.sheen2)];

  const fluidMat = keep(new THREE.MeshPhysicalMaterial({ color: PAL.fluid, roughness: 0.22, metalness: 0, clearcoat: 0.7, clearcoatRoughness: 0.1, emissive: PAL.fluid, emissiveIntensity: PAL.fluidGlow }));
  const periMat = keep(new THREE.MeshPhysicalMaterial({ color: PAL.peri, roughness: 0.42, metalness: 0, sheen: 0.5, sheenRoughness: 0.5, sheenColor: "#ffffff", clearcoat: 0.5, clearcoatRoughness: 0.3 }));
  const wallMat = keep(new THREE.MeshPhysicalMaterial({ color: PAL.wall, roughness: 0.4, metalness: 0, sheen: 0.6, sheenRoughness: 0.4, sheenColor: "#ffffff", clearcoat: 0.6, clearcoatRoughness: 0.22 }));
  const lumenMat = keep(new THREE.MeshPhysicalMaterial({ color: PAL.lumen, roughness: 0.3, metalness: 0, clearcoat: 0.8, clearcoatRoughness: 0.15, emissive: PAL.lumen, emissiveIntensity: 0.12 }));
  const nucMat = keep(new THREE.MeshPhysicalMaterial({ color: PAL.nuc, roughness: 0.34, metalness: 0, clearcoat: 0.7, clearcoatRoughness: 0.2 }));
  const vesselMat = keep(new THREE.MeshPhysicalMaterial({ color: PAL.vessel, roughness: 0.36, metalness: 0, clearcoat: 0.6, clearcoatRoughness: 0.2 }));

  // ---------------------------------------------------------------- fibres
  const BEVEL = 3.2; // the rounded shoulder of a cut fibre (units, before the fibre's own scale)
  const DOME = 1.5; //  how far the cut face pillows out
  const STEP = coarse ? 9 : 5; // outline sampling (units)
  function fibreGeometry(cell, seed) {
    // the drawing's own outline: Catmull-Rom through the cell's corners (live.js smooth(), k = 0.9), sampled
    const P = cell.poly;
    const n = P.length;
    const at = (i) => P[(i + n) % n];
    const fine = [];
    for (let i = 0; i < n; i++) {
      const p0 = at(i - 1), p1 = at(i), p2 = at(i + 1), p3 = at(i + 2);
      const c1 = [p1[0] + ((p2[0] - p0[0]) / 6) * 0.9, p1[1] + ((p2[1] - p0[1]) / 6) * 0.9];
      const c2 = [p2[0] - ((p3[0] - p1[0]) / 6) * 0.9, p2[1] - ((p3[1] - p1[1]) / 6) * 0.9];
      for (let k = 0; k < 12; k++) {
        const t = k / 12, u = 1 - t;
        const x = u * u * u * p1[0] + 3 * u * u * t * c1[0] + 3 * u * t * t * c2[0] + t * t * t * p2[0];
        const y = u * u * u * p1[1] + 3 * u * u * t * c1[1] + 3 * u * t * t * c2[1] + t * t * t * p2[1];
        fine.push([x - cell.c[0], -(y - cell.c[1])]); // local (x, z) about the fibre's own centre
      }
    }
    // evenly spaced round the outline (short cell edges would otherwise crowd points and fold the shoulder)
    const seg = fine.map((p, i) => Math.hypot(fine[(i + 1) % fine.length][0] - p[0], fine[(i + 1) % fine.length][1] - p[1]));
    const total = seg.reduce((a, b) => a + b, 0);
    const count = Math.max(16, Math.round(total / STEP));
    let line = [];
    for (let k = 0, i = 0, run = 0; k < count; k++) {
      const want = (k / count) * total;
      while (run + seg[i] < want) run += seg[i++];
      const t = (want - run) / seg[i];
      const p = fine[i], q = fine[(i + 1) % fine.length];
      line.push([p[0] + (q[0] - p[0]) * t, p[1] + (q[1] - p[1]) * t]);
    }
    let area = 0;
    line.forEach((p, i) => { const q = line[(i + 1) % line.length]; area += p[0] * q[1] - q[0] * p[1]; });
    if (area > 0) line.reverse(); // clockwise in (x, z)
    const N = line.length;
    // outward normal at each point (left of travel on a clockwise loop), for the shoulder's inset
    const out = line.map((p, i) => {
      const a = line[(i - 2 + N) % N], b = line[(i + 2) % N];
      const ex = b[0] - a[0], ez = b[1] - a[1];
      const l = Math.hypot(ex, ez) || 1;
      return [-ez / l, ex / l];
    });
    const rings = [];
    const edge = [];
    const ring = (inset, y, t, e) => {
      rings.push(line.map((p, i) => [(p[0] - out[i][0] * inset) * t, y, (p[1] - out[i][1] * inset) * t]));
      edge.push(e);
    };
    ring(0, 0, 1, 0);
    ring(0, D - BEVEL, 1, 0);
    const steps = coarse ? [45, 90] : [22.5, 45, 67.5, 90];
    for (const deg of steps) {
      const a = (deg * Math.PI) / 180;
      ring(BEVEL * (1 - Math.cos(a)), D - BEVEL + BEVEL * Math.sin(a), 1, 0.12 * Math.sin(a));
    }
    // the cut face: a soft rise just inside the shoulder, then flat (a rise all the way to the middle would crease
    // along every corner of the outline)
    for (const [t, h] of coarse ? [[0.86, 0.75], [0.68, 1], [0.3, 1], [0, 1]] : [[0.93, 0.45], [0.85, 0.82], [0.74, 1], [0.45, 1], [0, 1]]) ring(BEVEL, D + DOME * h, t, 0.12 + 0.88 * (1 - t));
    return skin(rings, [["aA8", 2, (j) => [edge[j], seed]]]);
  }
  const fibreMeshes = cells.map((cell, i) => solid(new THREE.Mesh(fibreGeometry(cell, (i * 0.6180339) % 1), fibreMat[fibres[i].type])));

  // ---------------------------------------------------------------- fluid between the fibres
  const FLUID_Y = D - 3.5; // the fluid's surface on the cut face: the fibres stand this far proud of it
  // Along the body the fluid is a bed that follows the outer fibres, a little under their outer faces, so it shows as
  // the blue floor of every groove between them (the drawing's blue between the bands). Each fibre that touches the
  // sheath gives the bed a run of points across its own span; the bed bridges the groove to the next fibre's run.
  const TAU2 = (t) => ((t % TAU) + TAU) % TAU;
  const rim = [];
  cells.forEach((cell) => {
    let ts = cell.poly.filter(([x, y]) => ((x - C[0]) / RX) ** 2 + ((y - C[1]) / RY) ** 2 > 0.97).map(([x, y]) => TAU2(Math.atan2((y - C[1]) / RY, (x - C[0]) / RX)));
    if (ts.length < 2) return;
    if (Math.max(...ts) - Math.min(...ts) > Math.PI) ts = ts.map((t) => (t > Math.PI ? t - TAU : t));
    rim.push({ cell, a0: Math.min(...ts), a1: Math.max(...ts) });
  });
  rim.sort((p, q) => TAU2((p.a0 + p.a1) / 2) - TAU2((q.a0 + q.a1) / 2));
  const bedAt = []; // [cell, angle] round the bundle, in order
  for (const r of rim) {
    const m = Math.max(2, Math.ceil((r.a1 - r.a0) / (coarse ? 0.11 : 0.06)));
    for (let k = 0; k <= m; k++) bedAt.push([r.cell, r.a0 + ((r.a1 - r.a0) * k) / m]);
  }
  const BED = 0.35; // how far under the fibres' outer faces the bed lies (units)
  const NB = bedAt.length;
  const bedGeo = keep(new THREE.BufferGeometry());
  const bedPos = new Float32Array(NB * 2 * 3);
  bedGeo.setAttribute("position", new THREE.BufferAttribute(bedPos, 3));
  {
    const idx = [];
    for (let i = 0; i < NB; i++) {
      const a = i, b = (i + 1) % NB;
      idx.push(a, b, b + NB, a, b + NB, a + NB); // as skin(): the rim runs clockwise in (x, z), the rings toward +y
    }
    bedGeo.setIndex(idx);
  }
  const bedMat = keep(fluidMat.clone());
  bedMat.emissiveIntensity = PAL.fluidGlow * 2.2;
  const core = solid(new THREE.Mesh(bedGeo, bedMat));
  core.frustumCulled = false;
  // a point on a rim fibre's outer face (group coordinates), for the scene's fibre size f and spacing s
  const outerPoint = (cell, t, f, s, drop) => {
    const bx = C[0] + Math.cos(t) * RX, by = C[1] + Math.sin(t) * RY;
    const x = (cell.c[0] - C[0]) * s + (bx - cell.c[0]) * BASE * f;
    const y = (cell.c[1] - C[1]) * s + (by - cell.c[1]) * BASE * f;
    const k = 1 - drop / Math.hypot(x, y);
    return [x * k, -y * k];
  };
  function layBed(f, s) {
    for (let i = 0; i < NB; i++) {
      const [x, z] = outerPoint(bedAt[i][0], bedAt[i][1], f, s, BED);
      bedPos.set([x, 0, z], i * 3);
      bedPos.set([x, FLUID_Y - 1, z], (i + NB) * 3);
    }
    bedGeo.attributes.position.needsUpdate = true;
    bedGeo.computeVertexNormals();
  }
  // on the cut face the fluid reaches the sheath
  const face = solid(new THREE.Mesh(skin([ell(1, 0, FLUID_Y - 2.4), ell(1, 0, FLUID_Y - 0.6), ell(1, -0.6, FLUID_Y), ell(1, -2, FLUID_Y), ell(0.5, 0, FLUID_Y), ell(0, 0, FLUID_Y)]), fluidMat));

  // ---------------------------------------------------------------- the sheath (perimysium)
  const TH = 9; // its thickness, as drawn
  const LIP = 7; // the opaque cut rim reaches this far back along the body
  const lip = solid(
    new THREE.Mesh(
      skin([
        ell(1, TH, D - LIP), ell(1, TH, D - 2.2),
        ell(1, TH - 0.3, D - 1.1), ell(1, TH - 1.1, D - 0.3), ell(1, TH - 2.2, D),
        ell(1, 2.2, D),
        ell(1, 1.1, D - 0.3), ell(1, 0.3, D - 1.1), ell(1, 0, D - 2.2),
        ell(1, 0, FLUID_Y - 1.5),
      ]),
      periMat,
    ),
  );
  // the film along the body: see-through, so the outer fibres, the fluid in their grooves and the vessels show, as in
  // the drawing; denser toward its outline and where it meets the cut rim, with a soft collagen grain
  const filmMat = keep(new THREE.MeshPhysicalMaterial({ color: PAL.peri, roughness: 0.7, metalness: 0, specularIntensity: 0.25, clearcoat: 1, clearcoatRoughness: 0.14, envMapIntensity: night ? 0.3 : 1, transparent: true, depthWrite: false }));
  const filmU = { uA8f: { value: new THREE.Vector4(night ? 0.03 : 0.04, night ? 0.95 : 0.9, D - LIP, 9) }, uA8g: { value: new THREE.Vector2(night ? 0.3 : 0.22, night ? 0.5 : 1.25) } }; // base opacity, rim gain, where the cut rim starts, ramp length
  filmMat.onBeforeCompile = (sh) => {
    Object.assign(sh.uniforms, filmU);
    sh.vertexShader = sh.vertexShader.replace("#include <common>", "#include <common>\nvarying vec3 vA8P;").replace("#include <begin_vertex>", "#include <begin_vertex>\nvA8P = position;");
    sh.fragmentShader = sh.fragmentShader
      .replace("#include <common>", `#include <common>\nuniform vec4 uA8f; uniform vec2 uA8g; varying vec3 vA8P;${GLSL_PARS}`)
      .replace(
        "#include <normal_fragment_maps>",
        `#include <normal_fragment_maps>
        { vec2 a8w = vec2(atan(vA8P.z - vA8P.x, vA8P.x + vA8P.z) * 60.0, vA8P.y * 0.045); // the seam of the angle is on the far side
          float a8h = (a8n2(a8w) * 0.6 + a8n2(a8w * vec2(2.3, 1.7) + 9.0) * 0.4) * 0.22;
          normal = a8bump(-vViewPosition, normal, vec2(dFdx(a8h), dFdy(a8h)), faceDirection); }`,
      )
      .replace(
        "#include <opaque_fragment>",
        `{ // a clear wet film: a faint milky body (denser toward its outline and at the cut rim), and its highlights
          // laid over at full strength, so what lies under it keeps its own colour
          float a8ndv = clamp(abs(normal.z), 0.0, 1.0);
          float a8a = uA8f.x + uA8f.y * pow(1.0 - a8ndv, 6.5);
          a8a = mix(a8a, 1.0, smoothstep(uA8f.z - uA8f.w, uA8f.z, vA8P.y));
          vec3 a8gl = max(outgoingLight - totalDiffuse - uA8g.x, vec3(0.0)) * uA8g.y; // only the bright reflections: no grey veil
          float a8o = clamp(a8a + max(max(a8gl.r, a8gl.g), a8gl.b) * 0.3, 0.0, 1.0);
          outgoingLight = (totalDiffuse * a8a + a8gl * mix(1.0, a8a, 0.15)) / max(a8o, 1e-3);
          diffuseColor.a = a8o; }
        #include <opaque_fragment>`,
      );
  };
  filmMat.customProgramCacheKey = () => "a8-film";
  const film = new THREE.Mesh(skin([ell(1, TH, 0), ell(1, TH, D * 0.5), ell(1, TH, D - LIP)]), filmMat);
  film.receiveShadow = true;
  film.renderOrder = 3;
  group.add(film);
  ctx.ghost(film);

  // ---------------------------------------------------------------- capillaries
  // cut ends in the corners between fibres: a pale wall with a rounded rim, a red lumen
  const CAP_Y = D - 1.4;
  const wallProfile = [[5.2, 0], [5.2, CAP_Y - 1], [4.9, CAP_Y - 0.3], [4.2, CAP_Y], [3.3, CAP_Y], [2.8, CAP_Y - 0.4], [2.6, CAP_Y - 1.4]];
  const TS = coarse ? 12 : 20;
  const wallGeo = skin(wallProfile.map(([r, y]) => Array.from({ length: TS }, (_, i) => [Math.cos((i / TS) * TAU) * r, y, -Math.sin((i / TS) * TAU) * r])));
  const walls = solid(new THREE.InstancedMesh(wallGeo, wallMat, caps.length));
  const lumenGeo = keep(new THREE.SphereGeometry(1, coarse ? 10 : 16, coarse ? 6 : 10));
  const lumens = solid(new THREE.InstancedMesh(lumenGeo, lumenMat, caps.length));
  // fine vessels in the grooves between the outer fibres, running the length of the bundle (all round, not just the
  // side the drawing shows)
  const grooves = rim.map((r, i) => [r, rim[(i + 1) % rim.length]]).filter(([p, q]) => Math.abs(TAU2(q.a0 - p.a1 + Math.PI) - Math.PI) < 0.12);
  const vesselGeo = keep(new THREE.CylinderGeometry(1.2, 1.2, D - 26, coarse ? 6 : 8, 1, true));
  vesselGeo.translate(0, (D - 26) / 2 + 2, 0);
  const vessels = solid(new THREE.InstancedMesh(vesselGeo, vesselMat, grooves.length));
  // nuclei: flattened ovals pressed to the edge of each fibre's cut face
  const nucleiAt = [];
  cells.forEach((cell, i) => fibres[i].nuclei.forEach((k) => nucleiAt.push([cell, k])));
  const nucGeo = keep(new THREE.SphereGeometry(1, coarse ? 10 : 18, coarse ? 6 : 12));
  const nuclei = solid(new THREE.InstancedMesh(nucGeo, nucMat, nucleiAt.length));
  for (const im of [walls, lumens, vessels, nuclei]) im.frustumCulled = false;

  // ---------------------------------------------------------------- the scene's state → transforms
  const M = new THREE.Matrix4();
  const Q = new THREE.Quaternion();
  const UP = new THREE.Vector3(0, 1, 0);
  const V3 = new THREE.Vector3();
  const S3 = new THREE.Vector3();
  let lastF = NaN;
  let lastS = NaN;
  function update(state) {
    const f = state.fibre;
    const s = state.spread;
    if (f === lastF && s === lastS) return;
    lastF = f;
    lastS = s;
    // section point → the group's own coordinates (the live code's spreadPt / fibrePt)
    const spreadX = (px) => (px - C[0]) * s;
    const spreadZ = (py) => -(py - C[1]) * s;
    cells.forEach((cell, i) => {
      const m = fibreMeshes[i];
      m.position.set(spreadX(cell.c[0]), 0, spreadZ(cell.c[1]));
      m.scale.set(BASE * f, 1, BASE * f);
    });
    layBed(f, s);
    face.scale.set(s, 1, s);
    const kx = (RX * s + TH / 2) / (RX + TH / 2);
    const kz = (RY * s + TH / 2) / (RY + TH / 2);
    lip.scale.set(kx, 1, kz);
    film.scale.set(kx, 1, kz);
    caps.forEach((p, i) => {
      M.makeTranslation(spreadX(p[0]), 0, spreadZ(p[1]));
      walls.setMatrixAt(i, M);
      M.compose(V3.set(spreadX(p[0]), CAP_Y - 1.5, spreadZ(p[1])), Q.identity(), S3.set(2.7, 1.1, 2.7));
      lumens.setMatrixAt(i, M);
    });
    grooves.forEach(([p, q], i) => {
      // beside the blue, against one fibre, as drawn
      const a = outerPoint(p.cell, p.a1, f, s, 0.2);
      const b = outerPoint(q.cell, q.a0, f, s, 0.2);
      M.makeTranslation(a[0] * 0.72 + b[0] * 0.28, 0, a[1] * 0.72 + b[1] * 0.28);
      vessels.setMatrixAt(i, M);
    });
    nucleiAt.forEach(([cell, k], i) => {
      const v = cell.poly[k];
      const w = cell.poly[(k + 1) % cell.poly.length];
      const mx = (v[0] + w[0]) / 2;
      const my = (v[1] + w[1]) / 2;
      // live.js: fibrePt(cell, mid-edge, 0.86), turned along the edge
      const px = spreadX(cell.c[0]) + (mx - cell.c[0]) * BASE * f * 0.86;
      const pz = spreadZ(cell.c[1]) - (my - cell.c[1]) * BASE * f * 0.86;
      Q.setFromAxisAngle(UP, Math.atan2(w[1] - v[1], w[0] - v[0]));
      M.compose(V3.set(px, D + 0.9, pz), Q, S3.set(5, 1.5, 2.4));
      nuclei.setMatrixAt(i, M);
    });
    for (const im of [walls, lumens, vessels, nuclei]) im.instanceMatrix.needsUpdate = true;
  }
  update({ fibre: 1, spread: 1 });

  return {
    update,
    dispose() {
      for (const d of disposables) d.dispose();
    },
  };
}
