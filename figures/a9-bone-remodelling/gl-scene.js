// A9 in 3-D (the build hook of shared/gl3): the same cut block of spongy bone, modelled and lit.
//
// World units are the section's px, in the kit's own camera: x along the strut (0…L), y from the back of the block
// to the cut face (0…DEP), z up (0…ZT). The cut face of the drawing is the plane y = DEP, so everything the model
// animates lands exactly where the drawing puts it.
//
//   marrow   a soft see-through block: its colour builds up with the depth of marrow a sight line crosses, so
//            things deep inside fade into it. Fat cells, blood-forming cells and a sinusoid float in it.
//   strut    a plate of bone through the block. Its top is a height field: every remodelling site is a round
//            scoop (a Howship's lacuna) cut in half by the cut face, so the face shows the model's own profile
//            (the readout's "bone in this strut") and the scoop carries on behind it. The cut faces carry the
//            drawing's own lamellae, osteocytes and cement lines, painted from the SVG's paths.
//   cells    osteoclast (a domed cell with several nuclei and a ruffled border), reversal cells, a pavement of
//            osteoblasts on pale osteoid, flat lining cells on the quiet surface, estrogen as amber hexagons.
//
// update(state) takes the live code's own state every frame: { y (the profile), sites, scars, cementNew, estro }.
function a9Scene(ctx, env) {
  const T = ctx.THREE;
  const { root, ghost, night, coarse, P } = ctx;
  const { X0, X1, TOP, BOT, MT, MB, DEP, STEP, NX, yBot, svg } = env;
  const L = X1 - X0;
  const ZT = MB - MT;
  const BT = MB - TOP; // the strut's top, about
  const BB = MB - BOT; // and its bottom
  const clamp = (v, a, b) => Math.max(a, Math.min(b, v));
  const stream = (seed) => () => ((seed = (seed * 16807) % 2147483647) - 1) / 2147483646;
  const col = (hex) => new T.Color(hex);
  const disposables = [];
  const keep = (o) => (disposables.push(o), o);

  // ───────────────────────────────────────────────────────── the marrow as a medium
  // A sight line leaves the block through the cut face, the right end or the top. The marrow between a point and
  // that exit tints it: 1 − exp(−k · length). The same rule paints the block's far walls, so the block is densest
  // where it is deepest and thins to nothing at its far edges.
  const A = (P.azimuth * Math.PI) / 180;
  const E = (P.elevation * Math.PI) / 180;
  const view = new T.Vector3(Math.cos(A) * Math.cos(E), Math.sin(A) * Math.cos(E), Math.sin(E)); // toward the viewer
  // `k` is the block's own density; `kIn` is how fast the things inside it fade (slower, so they stay readable);
  // `wall` is the cover the far walls have of their own, so the block keeps a body right up to its silhouette
  // (`floor`: the same for the face it stands on, so the shadow under the block doesn't grey the marrow above it).
  // Cream: the drawing's rose marrow at the block's thin edges (about a third covered), deepening to about 70 %
  // covered through its full depth. Forest night: a dense dark block that thins to nothing at its far edges.
  const GEL = night
    ? { front: 0x4e232b, top: 0x60303a, side: 0x3c1a21, k: 1 / 78, kIn: 1 / 190, wall: 0, floor: 0 }
    : { front: 0xe7a9ab, top: 0xf0bfbe, side: 0xd3949a, k: 1 / 225, kIn: 1 / 215, wall: 0.34, floor: 0.62 };
  const U = {
    uGelMax: { value: new T.Vector3(L, DEP, ZT) },
    uGelDir: { value: view },
    uGelK: { value: new T.Vector2(GEL.k, GEL.kIn) },
    uGelWall: { value: new T.Vector2(GEL.wall, GEL.floor) },
    uGelFront: { value: col(GEL.front) },
    uGelTop: { value: col(GEL.top) },
    uGelSide: { value: col(GEL.side) },
  };
  const GEL_GLSL = `
    uniform vec3 uGelMax; uniform vec3 uGelDir; uniform vec2 uGelK; uniform vec3 uGelFront; uniform vec3 uGelTop; uniform vec3 uGelSide;
    vec4 a9Gel(vec3 p, float k){
      vec3 t3 = (uGelMax - p) / uGelDir;
      float tm = min(t3.x, min(t3.y, t3.z));
      vec3 w = 1.0 - smoothstep(0.0, 2.5, t3 - tm);
      vec3 c = (uGelSide * w.x + uGelFront * w.y + uGelTop * w.z) / (w.x + w.y + w.z);
      return vec4(c, 1.0 - exp(-k * max(0.0, tm)));
    }`;
  /** A lit material that sits in the marrow: its colour fades into the marrow with depth. */
  const inMarrow = (m) => {
    m.onBeforeCompile = (sh) => {
      Object.assign(sh.uniforms, U);
      sh.vertexShader = sh.vertexShader
        .replace("#include <common>", "#include <common>\nvarying vec3 vA9P;")
        .replace("#include <project_vertex>", "#include <project_vertex>\n{ vec4 a9p = vec4(transformed, 1.0);\n#ifdef USE_INSTANCING\na9p = instanceMatrix * a9p;\n#endif\nvA9P = a9p.xyz; }");
      sh.fragmentShader = sh.fragmentShader
        .replace("#include <common>", `#include <common>\nvarying vec3 vA9P;\n${GEL_GLSL}`)
        .replace("#include <dithering_fragment>", "{ vec4 a9g = a9Gel(vA9P, uGelK.y); gl_FragColor.rgb = mix(gl_FragColor.rgb, a9g.rgb, a9g.a); }\n#include <dithering_fragment>");
    };
    m.customProgramCacheKey = () => "a9-in-marrow";
    return keep(m);
  };
  const phys = (o) => inMarrow(new T.MeshPhysicalMaterial({ metalness: 0, ...o }));
  const solid = (mesh) => {
    mesh.castShadow = mesh.receiveShadow = true;
    root.add(mesh);
    return mesh;
  };
  /** Lit and drawn, nothing more: too small to shade anything. Out of the floor, occlusion and shadow passes (with VSM, three.js draws every shadow receiver into the shadow map as well). */
  const speck = (mesh) => {
    mesh.receiveShadow = false;
    return ghost(mesh);
  };

  // the block's far walls, seen through the marrow
  const boxGeo = () => keep(new T.BoxGeometry(L, DEP, ZT).translate(L / 2, DEP / 2, ZT / 2));
  const gelBody = new T.Mesh(
    boxGeo(),
    keep(
      new T.ShaderMaterial({
        uniforms: U,
        vertexShader: "varying vec3 vA9P; void main(){ vA9P = position; gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0); }",
        fragmentShader: `${GEL_GLSL}\nuniform vec2 uGelWall; varying vec3 vA9P; void main(){ vec4 g = a9Gel(vA9P, uGelK.x); float wall = vA9P.z < 0.5 ? uGelWall.y : uGelWall.x; gl_FragColor = vec4(g.rgb, 1.0 - (1.0 - wall) * (1.0 - g.a)); }`,
        side: T.BackSide,
        transparent: true,
        depthWrite: false,
      }),
    ),
  );
  gelBody.renderOrder = 1;
  root.add(ghost(gelBody));

  // the block's near faces: a faint film, a hairline along every edge, a soft sweep of light on the top
  const SHELL = night
    ? { inner: 0xdba6b0, outer: 0x9a5d68, films: [0x2c1218, 0x6a3540, 0x8a4c58], a: [0.5, 0.42, 0.1], v: [0.2, 0.03, 0.2], gloss: 0.08, rim: 7 }
    : { inner: 0xfff6f2, outer: 0xb4767c, films: [0xc4868c, 0xe4a6a8, 0xf4cdca], a: [0.8, 0.85, 0.28], v: [0.26, 0.12, 0.32], gloss: 0.16, rim: 11 };
  const shell = new T.Mesh(
    boxGeo(),
    keep(
      new T.ShaderMaterial({
        uniforms: {
          uGelMax: U.uGelMax,
          uIn: { value: col(SHELL.inner) },
          uOut: { value: col(SHELL.outer) },
          uFilmX: { value: col(SHELL.films[0]) },
          uFilmY: { value: col(SHELL.films[1]) },
          uFilmZ: { value: col(SHELL.films[2]) },
          uA: { value: new T.Vector3(...SHELL.a) }, // inner line, outer line, glow
          uV: { value: new T.Vector3(...SHELL.v) }, // film on the right end, the cut face, the top
          uGloss: { value: SHELL.gloss },
          uRim: { value: SHELL.rim },
          uBand: { value: new T.Vector2(BB - 6, BT + 6) },
        },
        vertexShader: "varying vec3 vA9P; varying vec3 vA9N; void main(){ vA9P = position; vA9N = normal; gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0); }",
        fragmentShader: `
          uniform vec3 uGelMax; uniform vec3 uIn; uniform vec3 uOut; uniform vec3 uFilmX; uniform vec3 uFilmY; uniform vec3 uFilmZ; uniform vec3 uA; uniform vec3 uV; uniform float uGloss; uniform float uRim; uniform vec2 uBand;
          varying vec3 vA9P; varying vec3 vA9N;
          void main(){
            vec3 lo = vA9P; vec3 hi = uGelMax - vA9P; vec3 n = abs(vA9N);
            float eIn; float eOut; float film; vec3 uFilm;
            if (n.x > 0.5) { eIn = min(hi.y, hi.z); eOut = min(lo.y, lo.z); film = uV.x; uFilm = uFilmX; }
            else if (n.y > 0.5) { eIn = min(hi.x, hi.z); eOut = min(lo.x, lo.z); film = uV.y; uFilm = uFilmY; }
            else { eIn = min(hi.x, hi.y); eOut = min(lo.x, lo.y); film = uV.z; uFilm = uFilmZ; }
            float wIn = 1.0 - smoothstep(0.5, 1.7, eIn);
            float wOut = 1.0 - smoothstep(0.4, 1.5, eOut);
            float glow = exp(-min(eIn, eOut) / uRim);
            // the cut bone and the cells working on it stay clear of the film
            float clear = n.z > 0.5 ? 0.0 : smoothstep(uBand.x - 4.0, uBand.x, vA9P.z) * (1.0 - smoothstep(uBand.y + 6.0, uBand.y + 30.0, vA9P.z));
            float gloss = 0.0;
            if (n.z > 0.5) { float s = vA9P.x / uGelMax.x - 0.55 * vA9P.y / uGelMax.y; gloss = uGloss * exp(-pow((s - 0.22) / 0.2, 2.0)); }
            float aF = film * (1.0 - clear);
            float aL = max(wIn * uA.x, wOut * uA.y);
            float aG = glow * uA.z * (1.0 - 0.6 * clear);
            vec3 line = mix(uOut, uIn, wIn);
            float a = 1.0 - (1.0 - aF) * (1.0 - aL) * (1.0 - aG) * (1.0 - gloss);
            vec3 c = (uFilm * aF + line * (aL + aG) + uIn * gloss) / max(1e-4, aF + aL + aG + gloss);
            gl_FragColor = vec4(c, a);
          }`,
        transparent: true,
        depthWrite: false,
      }),
    ),
  );
  shell.renderOrder = 6;
  root.add(ghost(shell));

  // ───────────────────────────────────────────────────────── the strut's shape
  const DEL = [0, 2.5, 5, 8, 11, 14.5, 18, 22, 26, 30, 34, 38, 42, 47, 54, 64, 78, 96, 120, 150]; // rows, as depth behind the cut face
  const NY = DEL.length;
  /** The quiet surface (section y; bigger is lower). At the cut face it is the live code's own yTop0. */
  const top0 = (sx, dl) =>
    TOP + 2.2 * Math.sin(sx / 39 + dl / 47) + 1.4 * Math.sin(sx / 13 + dl / 23) + Math.min(1, dl / 40) * (1.8 * Math.sin(sx / 71 - dl / 29 + 0.7) + 1.2 * Math.sin(dl / 17 + sx / 113));
  /** A scoop seen from above: round, and exactly the model's scoop(u) where the cut face crosses its middle. */
  const bowl = (rho) => (rho >= 1 ? 0 : Math.cos((Math.PI * rho) / 2) ** 1.4);
  const reachOf = (s) => Math.min(s.w / 2, 40) * 0.94; // how far a scoop runs back from the cut face
  const rhoOf = (s, wx, dl) => Math.hypot((wx - (s.x0 - X0 + s.w / 2)) / (s.w / 2), dl / reachOf(s));

  const base = new Float32Array(NX * NY);
  const scar = new Float32Array(NX * NY); // what finished sites left behind
  const Hh = new Float32Array(NX * NY); // the surface now
  const pink = new Float32Array(NX * NY); // osteoid on show
  const bare = new Float32Array(NX * NY); // cleared of lining cells by a working site
  for (let j = 0; j < NY; j++) for (let i = 0; i < NX; i++) base[j * NX + i] = top0(X0 + i * STEP, DEL[j]);
  Hh.set(base);
  const eachIn = (s, i0, i1, fn) => {
    const xc = s.x0 - X0 + s.w / 2;
    const a = Math.max(i0, Math.ceil((xc - s.w / 2) / STEP));
    const b = Math.min(i1, Math.floor((xc + s.w / 2) / STEP));
    const R = reachOf(s);
    for (let j = 0; j < NY && DEL[j] < R; j++)
      for (let i = a; i <= b; i++) {
        const v = bowl(Math.hypot((i * STEP - xc) / (s.w / 2), DEL[j] / R));
        if (v > 0) fn(j * NX + i, v);
      }
  };
  const rowOf = (dl) => {
    let j = 0;
    while (j < NY - 2 && DEL[j + 1] < dl) j++;
    return j;
  };
  const sampleH = (wx, dl) => {
    const fi = clamp(wx / STEP, 0, NX - 1.001);
    const i = fi | 0;
    const a = fi - i;
    const j = rowOf(dl);
    const b = clamp((dl - DEL[j]) / (DEL[j + 1] - DEL[j]), 0, 1);
    const k = j * NX + i;
    return (Hh[k] * (1 - a) + Hh[k + 1] * a) * (1 - b) + (Hh[k + NX] * (1 - a) + Hh[k + NX + 1] * a) * b;
  };

  // ───────────────────────────────────────────────────────── bone: top surface, cut face, right end
  const IVORY = col(0xf2e3c6);
  const OSTEOID = col(0xf3a9b6);
  const HOLLOW = col(0xcfae84); // the floor of a deep pit
  const topGeo = keep(new T.BufferGeometry());
  const topPos = new Float32Array(NX * NY * 3);
  const topNor = new Float32Array(NX * NY * 3);
  const topCol = new Float32Array(NX * NY * 4); // rgb, and in alpha: 1 where lining cells cover the surface, 0 where a site has cleared them
  const topUv = new Float32Array(NX * NY * 2);
  {
    const idx = [];
    for (let j = 0; j < NY; j++)
      for (let i = 0; i < NX; i++) {
        const k = (j * NX + i) * 3;
        topPos[k] = i * STEP;
        topPos[k + 1] = DEP - DEL[j];
        topPos[k + 2] = MB - Hh[j * NX + i];
        topNor[k + 2] = 1;
        const c = (j * NX + i) * 4;
        topCol[c] = IVORY.r;
        topCol[c + 1] = IVORY.g;
        topCol[c + 2] = IVORY.b;
        topCol[c + 3] = 1;
        topUv[(j * NX + i) * 2] = (i * STEP) / L;
        topUv[(j * NX + i) * 2 + 1] = DEL[j] / DEP;
      }
    for (let j = 0; j < NY - 1; j++)
      for (let i = 0; i < NX - 1; i++) {
        const a = j * NX + i;
        idx.push(a, a + NX, a + 1, a + 1, a + NX, a + NX + 1);
      }
    topGeo.setAttribute("position", new T.BufferAttribute(topPos, 3).setUsage(T.DynamicDrawUsage));
    topGeo.setAttribute("normal", new T.BufferAttribute(topNor, 3).setUsage(T.DynamicDrawUsage));
    topGeo.setAttribute("color", new T.BufferAttribute(topCol, 4).setUsage(T.DynamicDrawUsage));
    topGeo.setAttribute("uv", new T.BufferAttribute(topUv, 2));
    topGeo.setIndex(idx);
  }
  // Lining cells: flat cells edge to edge over the quiet surface, painted once as a pavement (cell borders, a
  // nucleus each). A texture, not geometry: at phone size it melts into the surface's tone instead of into grain.
  const paveTex = (() => {
    const rnd = stream(4421);
    const S2 = coarse ? 1.5 : 2;
    const w = Math.round(L * S2);
    const h = Math.round(DEP * S2);
    const c = document.createElement("canvas");
    c.width = w;
    c.height = h;
    const g = c.getContext("2d");
    const img = g.createImageData(w, h);
    const GX = 26;
    const GY = 13.5;
    const SQ = 1.9; // cells are long along the strut
    const cols = Math.ceil(L / GX) + 3;
    const rows = Math.ceil(DEP / GY) + 3;
    const seeds = new Float32Array(cols * rows * 3);
    for (let r = 0; r < rows; r++)
      for (let q = 0; q < cols; q++) {
        const k = (r * cols + q) * 3;
        seeds[k] = (q - 1 + (r % 2 ? 0.5 : 0)) * GX + (rnd() - 0.5) * 12;
        seeds[k + 1] = (r - 1) * GY + (rnd() - 0.5) * 6.5;
        seeds[k + 2] = rnd();
      }
    const ss = (a, b, x) => {
      const t = clamp((x - a) / (b - a), 0, 1);
      return t * t * (3 - 2 * t);
    };
    for (let py = 0; py < h; py++) {
      const Y = (py + 0.5) / S2;
      const r0 = Math.floor(Y / GY) + 1;
      for (let px = 0; px < w; px++) {
        const X = (px + 0.5) / S2;
        const q0 = Math.floor(X / GX) + 1;
        let d1 = 1e9;
        let d2 = 1e9;
        let tone = 0;
        for (let r = Math.max(0, r0 - 2); r <= Math.min(rows - 1, r0 + 2); r++)
          for (let q = Math.max(0, q0 - 2); q <= Math.min(cols - 1, q0 + 2); q++) {
            const k = (r * cols + q) * 3;
            const d = Math.hypot(X - seeds[k], (Y - seeds[k + 1]) * SQ);
            if (d < d1) {
              d2 = d1;
              d1 = d;
              tone = seeds[k + 2];
            } else if (d < d2) d2 = d;
          }
        const border = 1 - ss(0.5, 2.6, d2 - d1);
        const nucleus = 1 - ss(2.2, 4.6, d1);
        const v = 1 - 0.05 * tone - 0.15 * border - 0.09 * nucleus;
        const o = (py * w + px) * 4;
        img.data[o] = 255 * v;
        img.data[o + 1] = 255 * v * (1 - 0.035 * border - 0.03 * nucleus);
        img.data[o + 2] = 255 * v * (1 - 0.09 * border - 0.07 * nucleus);
        img.data[o + 3] = 255;
      }
    }
    g.putImageData(img, 0, 0);
    const t = keep(new T.CanvasTexture(c));
    t.colorSpace = T.SRGBColorSpace;
    t.anisotropy = 8;
    t.flipY = false; // v runs back from the cut face, as the canvas rows do
    return t;
  })();
  const topMat = new T.MeshPhysicalMaterial({ color: 0xffffff, map: paveTex, vertexColors: true, metalness: 0, roughness: 0.62, sheen: 0.35, sheenRoughness: 0.6, sheenColor: 0xfff4dd });
  inMarrow(topMat);
  {
    // …and the pavement stops where a site has cleared the surface (the colour's alpha)
    const fog = topMat.onBeforeCompile;
    topMat.onBeforeCompile = (sh) => {
      fog(sh);
      sh.fragmentShader = sh.fragmentShader.replace("#include <map_fragment>", "#ifdef USE_MAP\n{ vec4 a9t = texture2D( map, vMapUv ); diffuseColor.rgb *= mix( vec3( 1.0 ), a9t.rgb, vColor.a ); }\n#endif");
    };
    topMat.customProgramCacheKey = () => "a9-strut-top";
  }
  const boneTop = solid(new T.Mesh(topGeo, topMat));
  boneTop.frustumCulled = false;

  // the cut faces carry the drawing's own histology (the SVG's paths, painted once onto a canvas)
  const SY0 = TOP - 12;
  const SH = BOT + 6 - SY0;
  const TS = coarse ? 2 : 3; // canvas px per world unit
  const vOf = (sy) => 1 - (sy - SY0) / SH;
  const drawn = Object.fromEntries([...svg.querySelectorAll("[data-a9]")].map((n) => [n.dataset.a9, new Path2D(n.getAttribute("d") || "")]));
  const canvasOf = (w, h) => {
    const c = document.createElement("canvas");
    c.width = Math.round(w * TS);
    c.height = Math.round(h * TS);
    return c;
  };
  const boneGround = (g, x, w) => {
    const grad = g.createLinearGradient(0, TOP - 4, 0, BOT + 3);
    grad.addColorStop(0, "#fdf8ea");
    grad.addColorStop(1, "#eedfbd");
    g.fillStyle = grad;
    g.fillRect(x, SY0, w, SH);
  };
  const textureOf = (c) => {
    const t = keep(new T.CanvasTexture(c));
    t.colorSpace = T.SRGBColorSpace;
    t.anisotropy = 8;
    return t;
  };
  const frontCanvas = canvasOf(L, SH);
  const frontCtx = frontCanvas.getContext("2d");
  const CEMENT = "rgba(108,68,30,0.72)";
  const layerOf = (paint) => {
    const c = canvasOf(L, SH);
    const g = c.getContext("2d");
    g.setTransform(TS, 0, 0, TS, -X0 * TS, -SY0 * TS);
    g.lineJoin = g.lineCap = "round";
    paint(g);
    return c;
  };
  // under the new cement lines: bone, lamellae, the old repairs. Over them: osteocytes and their canaliculi (the drawing's order)
  const under = layerOf((g) => {
    boneGround(g, X0, L);
    g.strokeStyle = "rgba(136,104,56,0.44)";
    g.lineWidth = 1.1;
    g.stroke(drawn.lam);
    g.strokeStyle = CEMENT;
    g.lineWidth = 1.45;
    g.stroke(drawn.cem);
  });
  const over = layerOf((g) => {
    g.strokeStyle = "rgba(116,86,46,0.55)";
    g.lineWidth = 0.75;
    g.stroke(drawn.canal);
    g.fillStyle = "#735730";
    g.fill(drawn.lac);
  });
  function paintFront(cementNew) {
    const g = frontCtx;
    g.setTransform(1, 0, 0, 1, 0, 0);
    g.drawImage(under, 0, 0);
    g.setTransform(TS, 0, 0, TS, -X0 * TS, -SY0 * TS);
    g.lineJoin = g.lineCap = "round";
    g.strokeStyle = CEMENT;
    g.lineWidth = 1.45;
    for (const pts of cementNew) {
      if (pts.length < 2) continue;
      g.beginPath();
      pts.forEach((p, k) => (k ? g.lineTo(p[0], p[1]) : g.moveTo(p[0], p[1])));
      g.stroke();
    }
    g.setTransform(1, 0, 0, 1, 0, 0);
    g.drawImage(over, 0, 0);
  }
  paintFront([]);
  const frontTex = textureOf(frontCanvas);

  // rows down the cut face: the surface and the foot of its drawn edge, the osteoid seam (head, foot), clear bone, and the same edge along the bottom
  const ROWS = 8;
  const EDGE = [0.74, 0.62, 0.45]; // the strut's outline on its cut face (multiplies the painted bone)
  const frontGeo = keep(new T.BufferGeometry());
  const frontPos = new Float32Array(NX * ROWS * 3);
  const frontUv = new Float32Array(NX * ROWS * 2);
  const frontCol = new Float32Array(NX * ROWS * 3).fill(1);
  {
    const nor = new Float32Array(NX * ROWS * 3);
    const idx = [];
    for (let r = 0; r < ROWS; r++)
      for (let i = 0; i < NX; i++) {
        const k = r * NX + i;
        frontPos[k * 3] = i * STEP;
        frontPos[k * 3 + 1] = DEP;
        nor[k * 3 + 1] = 1;
        frontUv[k * 2] = (i * STEP) / L;
      }
    for (let r = 0; r < ROWS - 1; r++)
      for (let i = 0; i < NX - 1; i++) {
        const a = r * NX + i;
        idx.push(a, a + 1, a + NX, a + 1, a + NX + 1, a + NX);
      }
    frontGeo.setAttribute("position", new T.BufferAttribute(frontPos, 3).setUsage(T.DynamicDrawUsage));
    frontGeo.setAttribute("normal", new T.BufferAttribute(nor, 3));
    frontGeo.setAttribute("uv", new T.BufferAttribute(frontUv, 2).setUsage(T.DynamicDrawUsage));
    frontGeo.setAttribute("color", new T.BufferAttribute(frontCol, 3).setUsage(T.DynamicDrawUsage));
    frontGeo.setIndex(idx);
  }
  const cutMat = (map) => keep(new T.MeshPhysicalMaterial({ map, vertexColors: true, metalness: 0, roughness: 0.58, sheen: 0.25, sheenRoughness: 0.5, sheenColor: 0xfff6e2, emissive: 0xffffff, emissiveMap: map, emissiveIntensity: night ? 0.08 : 0.12 }));
  const boneFront = solid(new T.Mesh(frontGeo, cutMat(frontTex)));
  boneFront.frustumCulled = false;

  {
    // the right end: the strut in cross-section (it keeps its starting thickness: pits never reach the block's ends)
    const c = canvasOf(DEP, SH);
    const g = c.getContext("2d");
    g.setTransform(TS, 0, 0, TS, 0, -SY0 * TS);
    boneGround(g, 0, DEP);
    g.translate(0, MT); // the end face's paths are drawn from the top of the marrow
    g.strokeStyle = "rgba(136,104,56,0.44)";
    g.lineWidth = 1.1;
    g.stroke(drawn.sideLam);
    g.fillStyle = "#7a5e34";
    g.fill(drawn.sideLac);
    const pos = [];
    const uv = [];
    const nor = [];
    const idx = [];
    const sx = X1;
    for (let j = 0; j < NY; j++) {
      const yT = top0(sx, DEL[j]);
      const yB = yBot(sx);
      pos.push(L, DEP - DEL[j], MB - yT, L, DEP - DEL[j], MB - yB);
      uv.push(DEL[j] / DEP, vOf(yT), DEL[j] / DEP, vOf(yB));
      nor.push(1, 0, 0, 1, 0, 0);
      if (j < NY - 1) idx.push(j * 2, j * 2 + 2, j * 2 + 1, j * 2 + 2, j * 2 + 3, j * 2 + 1);
    }
    const geo = keep(new T.BufferGeometry());
    geo.setAttribute("position", new T.Float32BufferAttribute(pos, 3));
    geo.setAttribute("normal", new T.Float32BufferAttribute(nor, 3));
    geo.setAttribute("uv", new T.Float32BufferAttribute(uv, 2));
    geo.setAttribute("color", new T.Float32BufferAttribute(new Array(NY * 2 * 3).fill(1), 3));
    geo.setIndex(idx);
    solid(new T.Mesh(geo, cutMat(textureOf(c))));
  }

  /** Bring columns i0…i1 of the strut up to date: heights, normals, the osteoid's tint, the cut face's outline. */
  function shape(i0, i1, st) {
    i0 = Math.max(0, i0);
    i1 = Math.min(NX - 1, i1);
    for (let j = 0; j < NY; j++)
      for (let i = i0; i <= i1; i++) {
        const k = j * NX + i;
        Hh[k] = base[k] + scar[k];
        pink[k] = 0;
        bare[k] = 0;
      }
    const seam = new Float32Array(i1 - i0 + 1);
    for (const s of st.sites) {
      const d = depthAt(s.age, s.fill) * s.depth;
      const forming = s.age >= BONE.resorb + BONE.reverse;
      eachIn(s, i0, i1, (k, v) => {
        Hh[k] += d * v;
        bare[k] = Math.max(bare[k], Math.min(1, v * 14));
        if (forming) pink[k] = Math.max(pink[k], Math.min(1, v * 9));
      });
      if (forming)
        for (let i = i0; i <= i1; i++) {
          const u = (X0 + i * STEP - s.x0) / s.w;
          if (u > 0.05 && u < 0.95) seam[i - i0] = 1;
        }
    }
    for (let i = i0; i <= i1; i++) Hh[i] = st.y[i]; // the cut face is the model's own profile, to the digit
    const a = Math.max(0, i0 - 1);
    const b = Math.min(NX - 1, i1 + 1);
    for (let j = 0; j < NY; j++) {
      const jf = Math.max(0, j - 1);
      const jb = Math.min(NY - 1, j + 1);
      for (let i = a; i <= b; i++) {
        const k = j * NX + i;
        const il = Math.max(0, i - 1);
        const ir = Math.min(NX - 1, i + 1);
        const gx = (Hh[j * NX + ir] - Hh[j * NX + il]) / ((ir - il) * STEP); // dz/dx = −gx
        const gy = (Hh[jf * NX + i] - Hh[jb * NX + i]) / (DEL[jb] - DEL[jf]); // dz/dy = −gy
        const l = Math.hypot(gx, gy, 1);
        topPos[k * 3 + 2] = MB - Hh[k];
        topNor[k * 3] = gx / l;
        topNor[k * 3 + 1] = gy / l;
        topNor[k * 3 + 2] = 1 / l;
        const p = pink[k];
        const h = Math.min(1, Math.max(0, Hh[k] - base[k]) / 36) ** 0.8 * 0.6;
        const cr = IVORY.r + (HOLLOW.r - IVORY.r) * h;
        const cg = IVORY.g + (HOLLOW.g - IVORY.g) * h;
        const cb = IVORY.b + (HOLLOW.b - IVORY.b) * h;
        topCol[k * 4] = cr + (OSTEOID.r * (1 - 0.4 * h) - cr) * p;
        topCol[k * 4 + 1] = cg + (OSTEOID.g * (1 - 0.4 * h) - cg) * p;
        topCol[k * 4 + 2] = cb + (OSTEOID.b * (1 - 0.4 * h) - cb) * p;
        topCol[k * 4 + 3] = 1 - bare[k];
      }
    }
    topGeo.attributes.position.needsUpdate = topGeo.attributes.normal.needsUpdate = topGeo.attributes.color.needsUpdate = true;
    for (let i = i0; i <= i1; i++) {
      const yT = st.y[i];
      const yB = yBot(X0 + i * STEP);
      const rows = [yT, yT + 1.1, yT + 1.5, yT + 5.0, yT + 5.6, yB - 1.5, yB - 1.1, yB];
      const p = seam[i - i0];
      for (let r = 0; r < ROWS; r++) {
        const k = r * NX + i;
        frontPos[k * 3 + 2] = MB - rows[r];
        frontUv[k * 2 + 1] = vOf(rows[r]);
        const edge = r < 2 || r > 5;
        const t = r === 2 || r === 3 ? p : 0;
        frontCol[k * 3] = edge ? EDGE[0] : 1;
        frontCol[k * 3 + 1] = edge ? EDGE[1] : 1 - 0.36 * t;
        frontCol[k * 3 + 2] = edge ? EDGE[2] : 1 - 0.22 * t;
      }
    }
    frontGeo.attributes.position.needsUpdate = frontGeo.attributes.uv.needsUpdate = frontGeo.attributes.color.needsUpdate = true;
  }
  shape(0, NX - 1, { sites: [], y: Array.from({ length: NX }, (_, i) => base[i]) });

  // ───────────────────────────────────────────────────────── what floats in the marrow
  // the sinusoid: the drawing's own curve, a little way behind the cut face
  const sinusPts = (() => {
    const way = [[0, 112, 104], [120, 100, 116], [240, 122, 98], [360, 102, 112], [480, 120, 96], [600, 108, 110]].map(([sx, sy, y]) => new T.Vector3(sx - X0, y, MB - sy));
    const dense = new T.CatmullRomCurve3(way, false, "centripetal", 0.5).getPoints(240);
    const cut = (x) => {
      for (let i = 1; i < dense.length; i++) if ((dense[i - 1].x - x) * (dense[i].x - x) <= 0) return dense[i - 1].clone().lerp(dense[i], (x - dense[i - 1].x) / (dense[i].x - dense[i - 1].x || 1));
      return dense[0];
    };
    return [cut(0), ...dense.filter((p) => p.x > 4 && p.x < L - 4).filter((_, i) => i % 6 === 0), cut(L)];
  })();
  const SIN_R = 5;
  {
    const curve = new T.CatmullRomCurve3(sinusPts, false, "centripetal", 0.5);
    const tube = solid(new T.Mesh(keep(new T.TubeGeometry(curve, coarse ? 80 : 130, SIN_R, coarse ? 10 : 14, false)), phys({ color: 0xd4675f, roughness: 0.42, clearcoat: 0.5, clearcoatRoughness: 0.3, sheen: 0.5, sheenColor: 0xffc2b8, emissive: 0x7a1f1a, emissiveIntensity: 0.18 })));
    tube.receiveShadow = tube.castShadow = false; // as the pearls: no line of shade across the bone
    // where the block's right end cuts it: the wall and the open lumen
    const end = sinusPts[sinusPts.length - 1];
    const wall = new T.Mesh(keep(new T.RingGeometry(SIN_R * 0.62, SIN_R, 24)), phys({ color: 0xe08a82, roughness: 0.5 }));
    const lumen = new T.Mesh(keep(new T.CircleGeometry(SIN_R * 0.62, 24)), phys({ color: 0x8a2a28, roughness: 0.35, clearcoat: 0.6 }));
    for (const m of [wall, lumen]) {
      m.rotation.y = Math.PI / 2;
      m.position.set(L - 0.15, end.y, end.z);
      m.material.side = T.DoubleSide;
      root.add(m);
    }
  }
  const nearSinus = (x, y, z) => {
    let best = 1e9;
    for (const p of sinusPts) best = Math.min(best, Math.hypot(p.x - x, p.y - y, p.z - z));
    return best;
  };

  // fat cells: pearls, set back from every cut face and clear of the working surface
  const fats = [];
  {
    // spread along the strut in strata (no clumps, no bare stretch), free in depth and height
    const rnd = stream(7717);
    const strew = (upper, want) => {
      for (let n = 0; n < want; n++)
        for (let tries = 0; tries < 60; tries++) {
          const r = 10.5 + rnd() * 8.5;
          const x = clamp(((n + 0.15 + rnd() * 0.7) / want) * L, r + 5, L - r - 4);
          const y = r + 5 + rnd() * (DEP - 2 * r - 8);
          const z = upper ? BT + 32 + r + rnd() * Math.max(1, ZT - 5 - r - (BT + 32 + r)) : r + 5 + rnd() * Math.max(1, BB - 9 - 2 * r - 5);
          if (upper && nearSinus(x, y, z) < r + SIN_R + 4) continue;
          if (fats.some((f) => Math.hypot(f.x - x, f.y - y, f.z - z) < f.r + r + 5)) continue;
          fats.push({ x, y, z, r });
          break;
        }
    };
    strew(true, coarse ? 15 : 22);
    strew(false, coarse ? 12 : 17);
  }
  const dummy = new T.Object3D();
  const place = (m, i, x, y, z, sx, sy = sx, sz = sx, q = null) => {
    dummy.position.set(x, y, z);
    dummy.scale.set(sx, sy, sz);
    if (q) dummy.quaternion.copy(q);
    else dummy.quaternion.identity();
    dummy.updateMatrix();
    m.setMatrixAt(i, dummy.matrix);
  };
  const instanced = (geo, mat, n, live = false) => {
    const m = new T.InstancedMesh(keep(geo), mat, n);
    m.frustumCulled = false;
    if (live) {
      m.instanceMatrix.setUsage(T.DynamicDrawUsage);
      m.count = 0;
    }
    return solid(m);
  };
  {
    const rnd = stream(311);
    const m = instanced(new T.SphereGeometry(1, coarse ? 18 : 26, coarse ? 12 : 18), phys({ color: 0xffffff, roughness: 0.34, clearcoat: 0.55, clearcoatRoughness: 0.28, sheen: 0.6, sheenRoughness: 0.5, sheenColor: 0xfff0d6, emissive: 0xf2d9b8, emissiveIntensity: night ? 0.04 : 0.1 }), fats.length);
    const c = new T.Color();
    fats.forEach((f, i) => {
      place(m, i, f.x, f.y, f.z, f.r, f.r * (0.92 + rnd() * 0.12), f.r * (0.9 + rnd() * 0.12));
      m.setColorAt(i, c.setRGB(1, 0.955 + rnd() * 0.03, 0.86 + rnd() * 0.05).multiplyScalar(night ? 0.84 : 1));
    });
    // Pearls in a lit gel: shaded by their own form. They neither take the strut's shadow nor drop one on it:
    // in a figure about pits in bone, a blot of shade on the bone's surface would read as a pit.
    m.receiveShadow = m.castShadow = false;
  }

  // blood-forming cells: a speckle of small red and violet cells all through the marrow
  {
    const rnd = stream(9173);
    const want = coarse ? 340 : 760;
    const cells = [];
    for (let i = 0; i < want * 6 && cells.length < want; i++) {
      const upper = rnd() < 0.58;
      const x = 4 + rnd() * (L - 8);
      const y = 4 + rnd() * (DEP - 8);
      const z = upper ? BT + 8 + rnd() * (ZT - BT - 12) : 4 + rnd() * (BB - 12);
      if (upper && DEP - y < 52 && z < BT + 26) continue; // the working surface stays clear
      if (fats.some((f) => Math.hypot(f.x - x, f.y - y, f.z - z) < f.r + 3.5)) continue;
      if (upper && nearSinus(x, y, z) < SIN_R + 3.5) continue;
      cells.push([x, y, z, 1.4 + rnd() * 1.3, rnd()]);
    }
    const m = instanced(new T.IcosahedronGeometry(1, 1), phys({ color: 0xffffff, roughness: 0.45, sheen: 0.4, sheenColor: 0xffffff, clearcoat: 0.3, clearcoatRoughness: 0.4 }), cells.length);
    const c = new T.Color();
    cells.forEach(([x, y, z, r, k], i) => {
      place(m, i, x, y, z, r);
      const deep = night ? 0 : 0.05;
      if (k < 0.55) c.setHSL(0.965 + rnd() * 0.02, 0.6 + deep, 0.5 - deep + rnd() * 0.08);
      else c.setHSL(0.74 + rnd() * 0.03, 0.38 + deep, 0.52 - deep + rnd() * 0.08);
      m.setColorAt(i, c);
    });
    speck(m);
  }

  // ───────────────────────────────────────────────────────── the cells that do the work
  /**
   * A rounded solid |x|ⁿ+|y|ⁿ+|z|ⁿ = 1 with true normals. `cut` makes it a cut cell: the half that would cross the
   * block's face is pressed flat onto it, and keeps the normals of a shallow cushion (`cut` deep), so the cut face is
   * a true plane (the bone's own face trims it to the pit) that still shades like something soft.
   */
  const roundGeo = (ws, hs, n, cut = 0) => {
    const g = new T.SphereGeometry(1, ws, hs);
    const p = g.attributes.position;
    const nr = g.attributes.normal;
    for (let i = 0; i < p.count; i++) {
      let x = p.getX(i);
      let y = p.getY(i);
      let z = p.getZ(i);
      const m = Math.max(1e-6, (Math.abs(x) ** n + Math.abs(y) ** n + Math.abs(z) ** n) ** (1 / n));
      x /= m;
      y /= m;
      z /= m;
      const press = cut > 0 && y > 0;
      let nx = Math.sign(x) * Math.abs(x) ** (n - 1);
      let ny = (Math.sign(y) * Math.abs(y) ** (n - 1)) / (press ? cut : 1);
      let nz = Math.sign(z) * Math.abs(z) ** (n - 1);
      const l = Math.hypot(nx, ny, nz) || 1;
      p.setXYZ(i, x, press ? 0 : y, z);
      nr.setXYZ(i, nx / l, ny / l, nz / l);
    }
    return g;
  };
  const CAP = coarse ? 8 : 10; // sites on show at once (the model's average is 1 to 3)
  const oc = instanced(roundGeo(coarse ? 24 : 36, coarse ? 16 : 24, 2.6, 0.5), phys({ color: 0x9a6ac8, roughness: 0.4, clearcoat: 0.55, clearcoatRoughness: 0.3, sheen: 0.7, sheenRoughness: 0.4, sheenColor: 0xe9d6ff, emissive: 0x4a2a78, emissiveIntensity: 0.22 }), CAP, true);
  const RUFF = 40; // folds of the ruffled border on show per osteoclast
  const ruffle = instanced(new T.SphereGeometry(1, 8, 6), phys({ color: 0x6f43ad, roughness: 0.45, clearcoat: 0.3, emissive: 0x3c1f6e, emissiveIntensity: 0.3 }), CAP * RUFF, true);
  speck(ruffle);
  const nuc = instanced(new T.SphereGeometry(1, 14, 10), phys({ color: 0xffffff, roughness: 0.3, clearcoat: 0.7, clearcoatRoughness: 0.2 }), CAP * 12, true);
  speck(nuc);
  const NUC_OC = col(0x3f2270);
  const NUC_OB = col(0x134e46);
  for (let i = 0; i < CAP * 12; i++) nuc.setColorAt(i, NUC_OC);
  const ob = instanced(roundGeo(coarse ? 10 : 14, coarse ? 8 : 10, 3.6), phys({ color: 0x43b3a2, roughness: 0.42, clearcoat: 0.5, clearcoatRoughness: 0.3, sheen: 0.6, sheenRoughness: 0.4, sheenColor: 0xc9fff4, emissive: 0x16665a, emissiveIntensity: 0.25 }), CAP * (coarse ? 16 : 26), true);
  const rev = instanced(new T.SphereGeometry(1, 16, 12), phys({ color: 0xc892b0, roughness: 0.45, clearcoat: 0.4, sheen: 0.5, sheenColor: 0xffe0ef, emissive: 0x7a3d5c, emissiveIntensity: 0.2 }), CAP * 4, true);
  const UP = new T.Vector3(0, 0, 1);
  const lean = new T.Quaternion();
  const nrm = new T.Vector3();
  const leanAt = (wx, dl, flat, share = 1) => {
    const gx = (sampleH(wx + 2.5, dl) - sampleH(wx - 2.5, dl)) / 5;
    const gy = flat ? 0 : (sampleH(wx, Math.max(0, dl - 2.5)) - sampleH(wx, dl + 2.5)) / (dl < 2.5 ? dl + 2.5 : 5);
    nrm.set(gx * share, gy * share, 1).normalize();
    return lean.setFromUnitVectors(UP, nrm);
  };

  // flat lining cells in profile: the drawing's own row along the cut edge of the surface, and its twin under the strut
  const LIN = [];
  for (let sx = X0 + 14; sx < X1 - 10; sx += 26) LIN.push({ sx, dl: 3.6, under: false }, { sx, dl: 3.6, under: true });
  const lining = instanced(new T.SphereGeometry(1, coarse ? 8 : 12, 6), phys({ color: 0xffffff, roughness: 0.5, sheen: 0.5, sheenColor: 0xfff0dc, clearcoat: 0.25, clearcoatRoughness: 0.4 }), LIN.length);
  speck(lining); // flat cells this thin only make grain in the occlusion pass
  lining.instanceMatrix.setUsage(T.DynamicDrawUsage);
  {
    const tan = col(0xcdb08f);
    LIN.forEach((_, i) => lining.setColorAt(i, tan));
  }
  function pave(sites) {
    LIN.forEach((c, i) => {
      const wx = c.sx - X0;
      if (c.under) return place(lining, i, wx, DEP - c.dl, MB - yBot(c.sx) - 0.7, 9, 3.5, 1.7);
      if (sites.some((s) => c.sx > s.x0 - 6 && c.sx < s.x0 + s.w + 6)) return place(lining, i, wx, DEP - c.dl, BT, 0); // the drawing's rule
      place(lining, i, wx, DEP - c.dl, MB - sampleH(wx, c.dl) + 0.6, 9, 3.5, 1.7, leanAt(wx, c.dl, false));
    });
    lining.instanceMatrix.needsUpdate = true;
  }
  pave([]);

  // estrogen: amber hexagons adrift in the marrow over the strut, as in A2
  const ESTRO_N = 28;
  const estroMesh = instanced(new T.CylinderGeometry(1, 1, 0.55, 6), keep(new T.MeshPhysicalMaterial({ metalness: 0, color: night ? 0xffb81f : 0xf09a0c, roughness: 0.3, clearcoat: 0.6, clearcoatRoughness: 0.2, emissive: night ? 0xffa510 : 0xc86e00, emissiveIntensity: night ? 0.8 : 0.5 })), ESTRO_N, true);
  speck(estroMesh);
  const face = new T.Quaternion().setFromUnitVectors(new T.Vector3(0, 1, 0), view);
  const spin = new T.Quaternion();
  const turn = new T.Quaternion();
  const adrift = new WeakMap(); // a molecule's place in depth and its turn, given once

  // ───────────────────────────────────────────────────────── a soft shadow under the whole block
  // The marrow is see-through, so the layer's floor shadow would only know the strut. This stand-in is drawn in the
  // floor's cast pass alone (never in the picture or the occlusion pass).
  let renderer = null;
  {
    const foot = night ? 44 : 18; // Forest night: the cast shadow only. Cream: low enough for a soft contact shadow as well
    const proxy = new T.Mesh(keep(new T.BoxGeometry(L, DEP, ZT - foot).translate(L / 2, DEP / 2, foot + (ZT - foot) / 2)), keep(new T.MeshBasicMaterial({ colorWrite: false, depthWrite: false })));
    proxy.onBeforeRender = (r, _s, _c, geo, mat) => {
      renderer = r;
      geo.setDrawRange(0, mat && mat.isShaderMaterial ? Infinity : 0); // the floor passes draw with a flat shader; the picture and the occlusion pass don't
    };
    proxy.frustumCulled = false;
    root.add(proxy);
  }

  // ───────────────────────────────────────────────────────── per frame
  let scarsOf = null;
  let scarsSeen = 0;
  let wasFrom = NX;
  let wasTo = -1;
  let paved = "";
  let cemRef = null;
  let cemN = -1;
  let cemLast = null;
  const colsOf = (s) => [Math.floor((s.x0 - X0) / STEP) - 1, Math.ceil((s.x0 - X0 + s.w) / STEP) + 1];
  function update(st) {
    const { y, sites, scars, cementNew, estro } = st;
    // The layer draws the scene four times a frame (two floor passes, the picture, the occlusion's normals) and
    // three.js would redo the shadow map before each. Once a frame is enough: it is asked for here, when things move.
    if (renderer) {
      renderer.shadowMap.autoUpdate = false;
      renderer.shadowMap.needsUpdate = true;
    }
    // what finished sites left: kept as a field, rebuilt only when the list changes
    let all = false;
    if (scars !== scarsOf || scars.length !== scarsSeen) {
      if (scars !== scarsOf || scars.length < scarsSeen) {
        // a new run (the live code starts a new list on every reset)
        scarsOf = scars;
        scar.fill(0);
        scarsSeen = 0;
      }
      for (; scarsSeen < scars.length; scarsSeen++) eachIn(scars[scarsSeen], 0, NX - 1, (k, v) => (scar[k] += scars[scarsSeen].d * v));
      all = true;
    }
    let from = NX;
    let to = -1;
    for (const s of sites) {
      const [a, b] = colsOf(s);
      from = Math.min(from, a);
      to = Math.max(to, b);
    }
    if (all) shape(0, NX - 1, st);
    else if (Math.min(from, wasFrom) <= Math.max(to, wasTo)) shape(Math.min(from, wasFrom), Math.max(to, wasTo), st);
    wasFrom = from;
    wasTo = to;

    // new cement lines join the drawn ones on the cut face
    const last = cementNew[cementNew.length - 1] || null;
    if (cementNew !== cemRef || cementNew.length !== cemN || last !== cemLast) {
      const blank = cemN <= 0 && !cementNew.length;
      cemRef = cementNew;
      cemN = cementNew.length;
      cemLast = last;
      if (!blank) {
        paintFront(cementNew);
        frontTex.needsUpdate = true;
      }
    }

    // the cells at each site
    let nOc = 0;
    let nRf = 0;
    let nNu = 0;
    let nOb = 0;
    let nRv = 0;
    const at = (s, u) => {
      const x = s.x0 + u * s.w;
      return [x - X0, y[clamp(Math.round((x - X0) / STEP), 0, NX - 1)]];
    };
    for (const s of sites) {
      const ph = s.age < BONE.resorb ? 0 : s.age < BONE.resorb + BONE.reverse ? 1 : 2;
      if (ph === 0 && nOc < CAP) {
        // the osteoclast: a domed cell sealed over its pit, cut through by the block's face
        let rim = 1e9;
        let floor = -1e9;
        for (let u = 0.08; u <= 0.92; u += 0.07) {
          const yy = at(s, u)[1];
          rim = Math.min(rim, yy);
          floor = Math.max(floor, yy);
        }
        const crest = rim - 15;
        const half = (floor + 7 - crest) / 2;
        const deep = 0.36 * s.w;
        place(oc, nOc++, s.x0 - X0 + s.w / 2, DEP - 0.2, MB - (crest + half), 0.45 * s.w, deep, half);
        const out = DEP + 0.9; // just proud of the cut face
        for (let k = 0; k < RUFF && nRf < CAP * RUFF; k++) {
          // folds standing on the pit's floor, shorter toward the cell's thin edges
          const t = k / (RUFF - 1);
          const [wx, yy] = at(s, 0.08 + 0.84 * t);
          const tall = (2.2 + (k % 2) * 0.9) * (0.3 + 0.7 * Math.sin(Math.PI * t) ** 0.6);
          place(ruffle, nRf++, wx, out - 0.7, MB - (yy - 0.4 - tall), 0.62, 0.7, tall);
        }
        for (let k = 0; k < 4 && nNu < CAP * 12; k++) {
          const [wx, yy] = at(s, 0.25 + k * 0.16);
          nuc.setColorAt(nNu, NUC_OC);
          place(nuc, nNu++, wx, out - 0.3, MB - Math.min(yy - 7.5, crest + 9), 3.1, 1.5, 3.1);
        }
      } else if (ph === 1) {
        for (const [u, dl] of [[0.32, 3.2], [0.66, 3.2], [0.44, 13], [0.6, 22]]) {
          if (nRv >= CAP * 4) break;
          const wx = s.x0 - X0 + u * s.w;
          place(rev, nRv++, wx, DEP - dl, MB - (dl < 4 ? at(s, u)[1] : sampleH(wx, dl)) + 3.0, 3.2);
        }
      } else if (ph === 2) {
        // osteoblasts: a pavement of plump cells on the new bone; the front row is the drawing's own row
        const gap = 0.135 * s.w;
        const rows = coarse ? 3 : 4;
        for (let r = 0; r < rows; r++) {
          const dl = 4.2 + r * 9.4;
          for (let k = 0; k < 7; k++) {
            const u = 0.1 + k * 0.135 + (r % 2 ? 0.0675 : 0);
            if (u > 0.9 || nOb >= ob.instanceMatrix.count) continue;
            const wx = s.x0 - X0 + u * s.w;
            if (r && rhoOf(s, wx, dl) > 0.9) continue;
            const q = leanAt(wx, dl, r === 0, 0.5);
            const yy = r === 0 ? at(s, u)[1] : sampleH(wx, dl);
            const w = Math.min(4.5, gap * 0.41);
            place(ob, nOb++, wx + nrm.x * 4.9, DEP - dl + nrm.y * 4.9, MB - yy + nrm.z * 4.9, w, 4.2, 5.4, q);
            if (r === 0 && nNu < CAP * 12) {
              nuc.setColorAt(nNu, NUC_OB);
              place(nuc, nNu++, wx + nrm.x * 6.4, DEP - 0.2, MB - yy + nrm.z * 6.4, 1.9, 1.0, 1.9);
            }
          }
        }
      }
    }
    for (const [m, n] of [[oc, nOc], [ruffle, nRf], [nuc, nNu], [ob, nOb], [rev, nRv]]) {
      m.count = n;
      m.instanceMatrix.needsUpdate = true;
    }
    if (nuc.instanceColor) nuc.instanceColor.needsUpdate = true;

    // lining cells step aside for a working site and come back when it is done
    let key = `${scars.length}`;
    for (const s of sites) key += `|${s.x0.toFixed(1)}`;
    if (key !== paved) {
      paved = key;
      pave(sites);
    }

    // estrogen
    let nE = 0;
    for (const m of estro) {
      if (nE >= ESTRO_N) break;
      const r = 4.3 * Math.min(1, m.age / 0.5, (m.life - m.age) / 0.5);
      if (r <= 0.43) continue;
      let d = adrift.get(m);
      if (!d) adrift.set(m, (d = { back: 6 + Math.random() * 44, phase: Math.random() * 6.28, rate: (Math.random() - 0.5) * 1.6 }));
      spin.setFromAxisAngle(UP.set(0, 1, 0), d.phase + m.age * d.rate);
      UP.set(0, 0, 1);
      turn.copy(face).multiply(spin);
      place(estroMesh, nE++, clamp(m.x - X0, 6, L - 6), DEP - d.back, MB - m.y, r, r, r, turn);
    }
    estroMesh.count = nE;
    estroMesh.instanceMatrix.needsUpdate = true;
  }

  return {
    update,
    dispose() {
      for (const o of disposables) o.dispose();
    },
  };
}
