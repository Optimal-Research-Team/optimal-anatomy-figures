// A3 · the block of fingertip skin as a real-time 3-D scene (shared/gl3, "a figure with its own 3-D scene").
// build.mjs inlines this file into the page script ahead of live.js. Nothing here runs until the shared layer
// has loaded and calls the function a3Scene() returns; with the layer off the SVG block is the whole figure.
//
// The model is the drawing's own anatomy at the drawing's own positions (world units = section px, z up, the cut
// face on y = D): a ridged epidermis slab over a block of see-through dermis, and inside the dermis the deep
// arteriole, the venous plexus under the papillae, a capillary loop in each papilla, four ascending arterioles, the
// three coiled shunts studded with glomus cells, the sympathetic nerve and its twigs, two sweat glands, collagen
// and a bed of fat lobules. What the drawing lays flat on the cut face is given depth here: A3D says how far behind
// the cut face each vessel runs, and live.js uses the same numbers so the blood cells ride inside the tubes.

/** How far behind the cut face each vessel runs (section px). Shared by the scene and by live.js's routes. */
const A3D = {
  art: (sx) => 38 + 7 * Math.sin(sx / 46 + 0.6),
  plex: (sx) => 10.5 + 1.8 * Math.sin(sx / 31 + 2),
  nerve: (sx) => 5.6 + 1 * Math.sin(sx / 37),
  ease: (u) => u * u * (3 - 2 * u),
  /** A coiled shunt: the drawing's zigzag is the front view of a helix. i of n points, from the arteriole at x0 up to the plexus. */
  ava(x0, i, n) {
    const u = i / n;
    return A3D.art(x0) + (A3D.plex(x0 + 14) - A3D.art(x0)) * A3D.ease(u) + 8 * Math.sin(Math.PI * u) * Math.cos(u * Math.PI * 5);
  },
  /** An ascending arteriole: leaves the deep arteriole and comes forward to the loop it feeds. */
  feed: (x, v, lx) => A3D.art(x) + (A3D.plex(lx) - 4.5 - A3D.art(x)) * A3D.ease(v),
  /**
   * A capillary loop: it leans toward the cut face as it climbs, so its top stands just behind the cut in the
   * papilla (deeper in, the epidermis around the papilla would hide it from this camera). Returns [sx, sy, depth].
   */
  loop(p, lx, baseY, topY) {
    const w = Math.max(0, Math.min(1.15, (baseY - p[1]) / (baseY - topY)));
    const side = Math.max(-1, Math.min(1, (p[0] - lx) / 3));
    // at its foot the limb going up stands clear in front of the plexus (its arteriole joins it there); the limb coming down runs into it
    const foot = A3D.plex(lx) - 3 + 1.5 * side;
    return [lx + (p[0] - lx) * 0.85, p[1] + 2.2 * w, foot + (2.4 - foot) * Math.pow(Math.min(1, w), 0.8)];
  },
};

function a3Scene(DATA, LINES) {
  return function build(ctx) {
    const { THREE, root, coarse, night, P } = ctx;
    const V3 = THREE.Vector3;
    const B = DATA.block;
    const X0 = B.x0;
    const L = B.x1 - B.x0;
    const D = B.D;
    const BASE = B.base;
    const TAU = Math.PI * 2;
    const lcg = (seed) => () => ((seed = (seed * 16807) % 2147483647) - 1) / 2147483646;
    const rnd = lcg(29);
    const col = (hex) => new THREE.Color(hex);
    const W3 = (p) => new V3(p[0] - X0, D - p[2], BASE - p[1]); // [sx, sy, depth] → world
    const owned = { geo: [], mat: [], tex: [] };
    const keep = (kind, x) => (owned[kind].push(x), x);

    // ------------------------------------------------------------ palette (the drawing's own, figure.css)
    const PAL = night
      ? {
          gel0: 0x94605c, gel1: 0x653c3e, shell: 0xd9a8a0, edge: 0xf3cfc6, epi: 0xcfa58e, corneum: 0xead6c2, furrow: 0xb98d78, epiInk: "120,62,48",
          fat: 0xd2b87e, gland: 0xb8c0dc, artWall: 0xdc4a3c, artLumen: 0xa82c24, venWall: 0x747bcb, venLumen: 0x474c96, loopA: 0xe2574a, loopV: 0x7b82cf,
          glomus: 0xa987b8, glomusDeep: 0x7a5a8a, nerve: 0xe6c35a, spike: 0xfff2b0, spikeHalo: 0xffd45a, cellA: 0xff8a76, cellV: 0xb2b8f0,
          heat: 0xffa257, warm: 0xff9646, collagen: 0xa8736e, flush: [1.0, 0.84, 0.72],
        }
      : {
          gel0: 0xf8d4cb, gel1: 0xecb3a6, shell: 0xfff1ec, edge: 0xffffff, epi: 0xf6dcc8, corneum: 0xfbeee0, furrow: 0xeecdb6, epiInk: "132,74,52",
          fat: 0xf6e3a8, gland: 0x8f98c8, artWall: 0xc23428, artLumen: 0xa3241b, venWall: 0x545aa6, venLumen: 0x3c4189, loopA: 0xc83a2e, loopV: 0x5257a6,
          glomus: 0xb48ec2, glomusDeep: 0x93699f, nerve: 0xd3a322, spike: 0xfff3ae, spikeHalo: 0xf4a81c, cellA: 0xf06a5a, cellV: 0x7f88e0,
          heat: 0xe07a2a, warm: 0xff8c32, collagen: 0xdca092, flush: [1.0, 0.82, 0.68],
        };

    // ------------------------------------------------------------ the gel: one fog for everything inside the dermis
    // The camera is fixed and orthographic, so the length of dermis between a point and the viewer is known in
    // closed form: the ray leaves through the cut face (y = D) or the end face (x = L). Everything inside mixes
    // toward the gel's colour by that length, which is what makes it read as embedded in tissue.
    const A = (P.azimuth * Math.PI) / 180;
    const E = (P.elevation * Math.PI) / 180;
    const view = new V3(Math.cos(A) * Math.cos(E), Math.sin(A) * Math.cos(E), Math.sin(E)); // toward the viewer
    const right = new V3(Math.sin(A), -Math.cos(A), 0); // screen right
    const GEL0 = col(PAL.gel0);
    const GEL1 = col(PAL.gel1);
    const WARM = col(PAL.warm);
    const U = {
      uUnmirror: { value: new THREE.Matrix4().copy(root.parent.matrix).invert() },
      uGelInv: { value: new V3(1 / view.x, 1 / view.y, view.z) },
      uGelMax: { value: new THREE.Vector2(L, D) },
      uGelK: { value: new THREE.Vector3(24, 1 / (night ? 100 : 112), 0.0007) }, // clear for the first stretch, then the haze builds
      uGelC0: { value: GEL0.clone() },
      uGelC1: { value: GEL1.clone() },
      uGelH: { value: 300 },
    };
    const FOG_PARS = "varying vec3 vGel; uniform vec3 uGelInv; uniform vec2 uGelMax; uniform vec3 uGelK; uniform vec3 uGelC0; uniform vec3 uGelC1; uniform float uGelH;";
    const FOG_VARS = "float gT = max(0.0, min((uGelMax.y - vGel.y) * uGelInv.y, (uGelMax.x - vGel.x) * uGelInv.x)); float gQ = max(0.0, gT - uGelK.x) * uGelK.y; float gF = 1.0 - exp(-gQ * gQ - gT * uGelK.z); vec3 gC = mix(uGelC1, uGelC0, clamp((vGel.z + gT * uGelInv.z) / uGelH, 0.0, 1.0));";
    /**
     * Patch a three.js material: `fog` embeds it in the gel, `infl` (a uniform) swells a tube about its own axis
     * (attribute aAxis), `glass` (a Vector4 uniform: alpha face-on, alpha at the rim, falloff, gloss) makes a wet
     * see-through wall whose highlights stay bright.
     */
    function patch(mat, { fog = true, infl = null, glass = null, rim = false } = {}) {
      const key = `a3${fog ? "f" : ""}${infl ? "i" : ""}${glass ? "g" : ""}${rim ? "r" : ""}`;
      mat.customProgramCacheKey = () => key;
      mat.onBeforeCompile = (sh) => {
        Object.assign(sh.uniforms, U);
        if (infl) sh.uniforms.uInfl = infl;
        if (glass) sh.uniforms.uGlass = glass;
        let vs = sh.vertexShader.replace("#include <common>", `#include <common>\nuniform mat4 uUnmirror;\nvarying vec3 vGel;${infl ? "\nattribute vec3 aAxis;\nuniform float uInfl;" : ""}`);
        if (infl) vs = vs.replace("#include <begin_vertex>", "#include <begin_vertex>\ntransformed = aAxis + (transformed - aAxis) * uInfl;");
        vs = vs.replace("#include <project_vertex>", "#include <project_vertex>\n{ vec4 gP = vec4(transformed, 1.0);\n#ifdef USE_INSTANCING\ngP = instanceMatrix * gP;\n#endif\nvGel = (uUnmirror * modelMatrix * gP).xyz; }");
        let fs = sh.fragmentShader.replace("#include <common>", `#include <common>\n#define RIM ${night ? "0.9" : "0.7"}\n${FOG_PARS}${glass ? "\nuniform vec4 uGlass;" : ""}`);
        if (glass)
          fs = fs.replace(
            "#include <premultiplied_alpha_fragment>",
            `{ ${FOG_VARS}
              float fr = pow(1.0 - clamp(abs(normal.z), 0.0, 1.0), uGlass.z);
              float ga = mix(uGlass.x, uGlass.y, fr);
              vec3 gs = max(outgoingLight - totalDiffuse, vec3(0.0)) * uGlass.w;
              float ao = clamp(ga + dot(gs, vec3(0.3333)), 0.0, 1.0);
              vec3 co = totalDiffuse * ga * mix(1.0, RIM, fr) + gs;
              ${fog ? "co = mix(co, gC * ao, gF);" : ""}
              gl_FragColor = vec4(co, ao); }`,
          );
        else if (fog) fs = fs.replace("#include <premultiplied_alpha_fragment>", `{ ${FOG_VARS}${rim ? " gl_FragColor.rgb *= mix(1.0, RIM, pow(1.0 - clamp(abs(normal.z), 0.0, 1.0), 1.6));" : ""} gl_FragColor.rgb = mix(gl_FragColor.rgb, gC, gF); }\n#include <premultiplied_alpha_fragment>`);
        sh.vertexShader = vs;
        sh.fragmentShader = fs;
      };
      return keep("mat", mat);
    }
    const phys = (o, p) => patch(new THREE.MeshPhysicalMaterial({ metalness: 0, ...o }), { rim: true, ...p }); // rim: a tube or a cell darkens a little toward its edge, which is what an ink line did for the drawing
    const flat = (o, p) => patch(new THREE.MeshBasicMaterial(o), p);
    const glassOf = (o, a0, a1, pow, gloss, infl) => {
      const glass = { value: new THREE.Vector4(a0, a1, pow, gloss) };
      const m = phys({ transparent: true, premultipliedAlpha: true, depthWrite: false, ...o }, { glass, infl });
      m.userData.glass = glass.value;
      return m;
    };
    const mesh = (geo, mat, { ghost = false, shadow = true, order = 0 } = {}) => {
      const m = new THREE.Mesh(keep("geo", geo), mat);
      m.matrixAutoUpdate = false;
      m.renderOrder = order;
      if (ghost) ctx.ghost(m);
      else {
        m.castShadow = shadow;
        m.receiveShadow = true;
      }
      root.add(m);
      return m;
    };

    // ------------------------------------------------------------ geometry helpers
    function geoOf({ pos, nor, uv, idx, axis, color, extra }) {
      const g = new THREE.BufferGeometry();
      g.setAttribute("position", new THREE.Float32BufferAttribute(pos, 3));
      if (nor) g.setAttribute("normal", new THREE.Float32BufferAttribute(nor, 3));
      if (uv) g.setAttribute("uv", new THREE.Float32BufferAttribute(uv, 2));
      if (axis) g.setAttribute("aAxis", new THREE.Float32BufferAttribute(axis, 3));
      if (color) g.setAttribute("color", new THREE.Float32BufferAttribute(color, 3));
      if (extra) for (const [name, arr, n] of extra) g.setAttribute(name, new THREE.Float32BufferAttribute(arr, n));
      g.setIndex(pos.length / 3 > 65535 ? new THREE.Uint32BufferAttribute(idx, 1) : new THREE.Uint16BufferAttribute(idx, 1));
      if (!nor) g.computeVertexNormals();
      return g;
    }
    const bag = () => ({ pos: [], nor: [], uv: [], idx: [], axis: [], color: [] });
    /** A tube along pts (Vector3[]), radius a number or (u, i) → number, swept with a twist-free frame. Appends to `out`. */
    function tube(out, pts, rad, radial, { color = null, cap = 0 } = {}) {
      const n = pts.length;
      const base = out.pos.length / 3;
      const T = new V3();
      const N = new V3();
      const Bn = new V3();
      const prev = new V3();
      const ax = new V3();
      const q = new THREE.Quaternion();
      let len = 0;
      for (let i = 0; i < n; i++) {
        const p = pts[i];
        T.subVectors(pts[Math.min(n - 1, i + 1)], pts[Math.max(0, i - 1)]).normalize();
        if (i === 0) {
          N.set(0, 0, 1);
          if (Math.abs(T.z) > 0.9) N.set(0, 1, 0);
        } else {
          ax.crossVectors(prev, T);
          const s = ax.length();
          if (s > 1e-7) N.applyQuaternion(q.setFromAxisAngle(ax.multiplyScalar(1 / s), Math.atan2(s, prev.dot(T))));
          len += p.distanceTo(pts[i - 1]);
        }
        N.addScaledVector(T, -N.dot(T)).normalize();
        Bn.crossVectors(T, N);
        prev.copy(T);
        const r = typeof rad === "function" ? rad(i / (n - 1), i) : rad;
        const c = typeof color === "function" ? color(i / (n - 1)) : color;
        for (let j = 0; j <= radial; j++) {
          const a = (j / radial) * TAU;
          const cs = Math.cos(a);
          const sn = Math.sin(a);
          const dx = N.x * cs + Bn.x * sn;
          const dy = N.y * cs + Bn.y * sn;
          const dz = N.z * cs + Bn.z * sn;
          out.pos.push(p.x + dx * r, p.y + dy * r, p.z + dz * r);
          out.nor.push(dx, dy, dz);
          out.axis.push(p.x, p.y, p.z);
          out.uv.push(len, j / radial);
          if (c) out.color.push(c.r, c.g, c.b);
        }
      }
      for (let i = 0; i < n - 1; i++)
        for (let j = 0; j < radial; j++) {
          const a = base + i * (radial + 1) + j;
          const c = a + radial + 1;
          out.idx.push(a, a + 1, c, a + 1, c + 1, c);
        }
      // a flat lid on the last ring (cap = 1) or the first (cap = -1)
      if (cap) {
        const i = cap > 0 ? n - 1 : 0;
        const p = pts[i];
        const t = new V3().subVectors(pts[Math.min(n - 1, i + 1)], pts[Math.max(0, i - 1)]).normalize().multiplyScalar(cap);
        const centre = out.pos.length / 3;
        const c = typeof color === "function" ? color(cap > 0 ? 1 : 0) : color;
        out.pos.push(p.x, p.y, p.z);
        out.nor.push(t.x, t.y, t.z);
        out.axis.push(p.x, p.y, p.z);
        out.uv.push(0, 0);
        if (c) out.color.push(c.r, c.g, c.b);
        const ring = base + i * (radial + 1);
        for (let j = 0; j < radial; j++) {
          const v = out.pos.length / 3;
          for (const jj of [j, j + 1]) {
            const k = (ring + jj) * 3;
            out.pos.push(out.pos[k], out.pos[k + 1], out.pos[k + 2]);
            out.nor.push(t.x, t.y, t.z);
            out.axis.push(p.x, p.y, p.z);
            out.uv.push(0, 0);
            if (c) out.color.push(c.r, c.g, c.b);
          }
          if (cap > 0) out.idx.push(centre, v, v + 1);
          else out.idx.push(centre, v + 1, v);
        }
      }
      return out;
    }
    const done = (b) => geoOf({ pos: b.pos, nor: b.nor, uv: b.uv, idx: b.idx, axis: b.axis, color: b.color.length ? b.color : null });
    const spline = (pts, n) => new THREE.CatmullRomCurve3(pts, false, "centripetal").getSpacedPoints(n);
    /** A flat ribbon between two rows of points, all with the one normal. `rows` come as [a, b] pairs along the run. */
    function sheet(pairs, normal, uvOf) {
      const pos = [];
      const nor = [];
      const uv = [];
      const idx = [];
      pairs.forEach(([a, b], i) => {
        pos.push(a.x, a.y, a.z, b.x, b.y, b.z);
        nor.push(normal.x, normal.y, normal.z, normal.x, normal.y, normal.z);
        if (uvOf) uv.push(...uvOf(a, i), ...uvOf(b, i));
        if (i) {
          const k = i * 2;
          idx.push(k - 2, k - 1, k, k - 1, k + 1, k);
        }
      });
      // which way do those triangles face? turn them to match the normal asked for
      const e1 = new V3().subVectors(pairs[0][1], pairs[0][0]);
      const e2 = new V3().subVectors(pairs[1][0], pairs[0][0]);
      if (e1.cross(e2).dot(normal) < 0) for (let i = 0; i < idx.length; i += 3) [idx[i + 1], idx[i + 2]] = [idx[i + 2], idx[i + 1]];
      return { pos, nor, uv: uvOf ? uv : null, idx };
    }

    // ------------------------------------------------------------ the skin's two profiles, from the drawing's own samples
    const SURF = DATA.surface; // step 2
    const DEJ = DATA.dej; // step 1
    const ridge = B.ridge;
    let surfMin = Infinity;
    let surfMax = -Infinity;
    let crestSx = X0;
    for (let i = 0; i < SURF.length; i++) {
      if (SURF[i][1] < surfMin && SURF[i][0] < X0 + ridge * 1.5) crestSx = SURF[i][0];
      surfMin = Math.min(surfMin, SURF[i][1]);
      surfMax = Math.max(surfMax, SURF[i][1]);
    }
    const sMid = BASE - (surfMin + surfMax) / 2;
    const sAmp = (surfMax - surfMin) / 2;
    const crest0 = crestSx - X0; // x of the first ridge crest
    // ridges are never ruler-straight: they drift a few units sideways toward the back (nil at the cut face)
    const bend = (y) => 11 * Math.sin((1.9 * (D - y)) / D);
    const bendDy = (y) => ((-11 * 1.9) / D) * Math.cos((1.9 * (D - y)) / D);
    const zTop = (x, y) => sMid + sAmp * Math.cos((TAU * (x - bend(y) - crest0)) / ridge);
    const zTopDx = (x, y) => ((-sAmp * TAU) / ridge) * Math.sin((TAU * (x - bend(y) - crest0)) / ridge);
    const dejAt = (i) => DEJ[Math.max(0, Math.min(DEJ.length - 1, i))][1];
    const zDej = (x, y) => {
      let f = x - bend(y);
      const per = ridge / 2;
      while (f > L) f -= per;
      while (f < 0) f += per;
      const i = Math.floor(f);
      const t = f - i;
      const p0 = dejAt(i - 1), p1 = dejAt(i), p2 = dejAt(i + 1), p3 = dejAt(i + 2);
      return BASE - 0.5 * (2 * p1 + (-p0 + p2) * t + (2 * p0 - 5 * p1 + 4 * p2 - p3) * t * t + (-p0 + 3 * p1 - 3 * p2 + p3) * t * t * t);
    };
    let dejTop = 0;
    for (const p of DEJ) dejTop = Math.max(dejTop, BASE - p[1]);
    const epiLo = BASE - Math.max(...DEJ.map((p) => p[1])) - 4; // texture window on the cut faces
    const epiHi = sMid + sAmp + 2;

    // ------------------------------------------------------------ textures (procedural, drawn once)
    const canvas = (w, h) => {
      const c = document.createElement("canvas");
      c.width = w;
      c.height = h;
      return c;
    };
    const texOf = (c, srgb = true) => {
      const t = new THREE.CanvasTexture(c);
      if (srgb) t.colorSpace = THREE.SRGBColorSpace;
      t.anisotropy = 8;
      return keep("tex", t);
    };
    const hexCss = (hex) => `#${hex.toString(16).padStart(6, "0")}`;
    /** A cut through the epidermis: horny layer, the living layers with their cells flattening upward, the basal row. */
    function paintSection(w, h, n, topOf, dejOf, span, seed) {
      const c = canvas(w, h);
      const g = c.getContext("2d");
      const r = lcg(seed);
      const X = (u) => u * w;
      const Y = (z) => ((epiHi - z) / (epiHi - epiLo)) * h;
      const kx = w / span; // px per unit along the cut
      const ky = h / (epiHi - epiLo);
      const top = [];
      const dej = [];
      for (let i = 0; i <= n; i++) {
        top.push(topOf(i / n));
        dej.push(dejOf(i / n));
      }
      const at = (arr, u) => {
        const f = Math.max(0, Math.min(n - 1e-6, u * n));
        const i = Math.floor(f);
        return arr[i] + (arr[i + 1] - arr[i]) * (f - i);
      };
      const trace = (arr, off) => {
        g.beginPath();
        for (let i = 0; i <= n; i++) g[i ? "lineTo" : "moveTo"](X(i / n), Y(arr[i] + off));
      };
      const grad = g.createLinearGradient(0, Y(epiHi), 0, Y(epiLo));
      grad.addColorStop(0, hexCss(PAL.corneum));
      grad.addColorStop(0.3, hexCss(PAL.epi));
      grad.addColorStop(1, hexCss(PAL.furrow));
      g.fillStyle = grad;
      g.fillRect(0, 0, w, h);
      // the living layers: nuclei, round near the basal row, flatter and sparser on the way up
      const cells = Math.round(span * 1.9);
      for (let i = 0; i < cells; i++) {
        const u = r();
        const zt = at(top, u) - 10.5;
        const zb = at(dej, u) + 2.6;
        if (zt <= zb) continue;
        const f = Math.pow(r(), 1.25);
        const z = zb + (zt - zb) * f;
        const rx = (0.95 + 0.75 * f) * (0.8 + 0.4 * r());
        const ry = (1.0 - 0.5 * f) * (0.8 + 0.4 * r());
        g.fillStyle = `rgba(${PAL.epiInk},${(0.2 + 0.2 * (1 - f) * r()).toFixed(3)})`;
        g.beginPath();
        g.ellipse(X(u), Y(z), rx * kx, ry * ky, 0, 0, TAU);
        g.fill();
      }
      // the basal row: a file of darker cells standing on the junction, and the junction's own soft line
      g.lineJoin = "round";
      trace(dej, 0.6);
      g.strokeStyle = `rgba(${PAL.epiInk},0.2)`;
      g.lineWidth = 3.4 * ky;
      g.stroke();
      const steps = Math.round(span / 2.3);
      for (let i = 0; i < steps; i++) {
        const u = (i + 0.5) / steps;
        const slope = ((at(dej, Math.min(1, u + 0.002)) - at(dej, Math.max(0, u - 0.002))) / (0.004 * span)) * (ky / kx);
        g.save();
        g.translate(X(u), Y(at(dej, u) + 1.7));
        g.rotate(-Math.atan(slope));
        g.fillStyle = `rgba(${PAL.epiInk},${(0.34 + 0.16 * r()).toFixed(3)})`;
        g.beginPath();
        g.ellipse(0, 0, 0.75 * kx, 1.25 * ky, 0, 0, TAU);
        g.fill();
        g.restore();
      }
      // the horny layer: a pale band following the surface, with its faint leaves
      g.beginPath();
      for (let i = 0; i <= n; i++) g[i ? "lineTo" : "moveTo"](X(i / n), Y(top[i] + 3));
      for (let i = n; i >= 0; i--) g.lineTo(X(i / n), Y(top[i] - 9));
      g.closePath();
      g.fillStyle = hexCss(PAL.corneum);
      g.fill();
      for (const [off, a] of [[-2.4, 0.16], [-4.6, 0.14], [-6.8, 0.16]]) {
        trace(top, off);
        g.strokeStyle = `rgba(${PAL.epiInk},${a})`;
        g.lineWidth = 0.45 * ky;
        g.stroke();
      }
      trace(top, -9);
      g.strokeStyle = `rgba(${PAL.epiInk},0.3)`;
      g.lineWidth = 0.8 * ky;
      g.stroke();
      return texOf(c);
    }
    // ridge crests and their sweat pores (the two glands' pores are among them)
    const PORES = [];
    for (let n = 0; crest0 + ridge * n < L + 12; n++)
      for (let y = n % 2 ? 27 : 14; y < D - 5; y += 26) PORES.push([crest0 + ridge * n + bend(y), y]);
    function paintTop(w, h) {
      const c = canvas(w, h);
      const g = c.getContext("2d");
      const r = lcg(7);
      g.fillStyle = "#ffffff";
      g.fillRect(0, 0, w, h);
      const kx = w / L;
      const ky = h / D;
      // fine skin grain: short creases across the ridges
      for (let i = 0; i < (coarse ? 1400 : 3200); i++) {
        const x = r() * w;
        const y = r() * h;
        g.strokeStyle = `rgba(${PAL.epiInk},${(0.03 + 0.05 * r()).toFixed(3)})`;
        g.lineWidth = 0.6 + r() * 0.8;
        g.beginPath();
        g.moveTo(x, y);
        g.lineTo(x + (3 + r() * 7) * kx * (r() < 0.5 ? 1 : -1), y + (r() - 0.5) * 3 * ky);
        g.stroke();
      }
      for (const [px, py] of PORES) {
        const cx = px * kx;
        const cy = (1 - py / D) * h;
        const rad = g.createRadialGradient(cx, cy, 0, cx, cy, 2.6 * kx);
        rad.addColorStop(0, `rgba(${PAL.epiInk},0.78)`);
        rad.addColorStop(0.42, `rgba(${PAL.epiInk},0.42)`);
        rad.addColorStop(1, `rgba(${PAL.epiInk},0)`);
        g.fillStyle = rad;
        g.beginPath();
        g.ellipse(cx, cy, 2.6 * kx, 2.6 * ky, 0, 0, TAU);
        g.fill();
      }
      return texOf(c);
    }

    // ------------------------------------------------------------ the epidermis: a ridged slab, opaque, a little waxy
    const flushable = []; // materials that take the flash's flush: [material, base colour]
    let underGeo = null;
    const skinMat = (o) => {
      const m = new THREE.MeshPhysicalMaterial({ metalness: 0, roughness: 0.62, sheen: 0.7, sheenRoughness: 0.5, sheenColor: col(night ? 0xf1d7c8 : 0xfff3ea), clearcoat: 0.1, clearcoatRoughness: 0.5, ...o });
      keep("mat", m);
      flushable.push([m, m.color.clone()]);
      return m;
    };
    {
      // top: the friction ridges, crests pale and furrows a shade deeper
      const nx = coarse ? 185 : 277;
      const ny = coarse ? 12 : 26;
      const pos = [];
      const nor = [];
      const uv = [];
      const color = [];
      const idx = [];
      const cCrest = col(PAL.corneum);
      const cFurrow = col(PAL.furrow);
      const cc = new THREE.Color();
      for (let j = 0; j <= ny; j++)
        for (let i = 0; i <= nx; i++) {
          const x = (L * i) / nx;
          const y = (D * j) / ny;
          const dzdx = zTopDx(x, y);
          const n = new V3(-dzdx, dzdx * bendDy(y), 1).normalize();
          pos.push(x, y, zTop(x, y));
          nor.push(n.x, n.y, n.z);
          uv.push(x / L, y / D);
          cc.lerpColors(cFurrow, cCrest, Math.pow(Math.max(0, Math.min(1, (zTop(x, y) - (sMid - sAmp)) / (2 * sAmp))), 0.8));
          color.push(cc.r, cc.g, cc.b);
        }
      for (let j = 0; j < ny; j++)
        for (let i = 0; i < nx; i++) {
          const a = j * (nx + 1) + i;
          const b = a + nx + 1;
          idx.push(a, a + 1, b, a + 1, b + 1, b);
        }
      const topTex = paintTop(coarse ? 1024 : 2048, coarse ? 256 : 512);
      mesh(geoOf({ pos, nor, uv, idx, color }), skinMat({ color: 0xffffff, vertexColors: true, map: topTex }), { shadow: false });

      // the cut faces: front (y = D) and end (x = L), painted as a section
      const fx = [];
      for (let i = 0; i <= L; i++) fx.push(i);
      const front = sheet(fx.map((x) => [new V3(x, D, zDej(x, D)), new V3(x, D, zTop(x, D))]), new V3(0, 1, 0), (p) => [p.x / L, (p.z - epiLo) / (epiHi - epiLo)]);
      const frontTex = paintSection(coarse ? 2048 : 4096, coarse ? 128 : 256, 552, (u) => zTop(u * L, D), (u) => zDej(u * L, D), L, 5);
      mesh(geoOf(front), skinMat({ color: 0xffffff, map: frontTex, roughness: 0.7 }), { shadow: false });
      const ey = [];
      for (let i = 0; i <= 85; i++) ey.push((D * i) / 85);
      const end = sheet(ey.map((y) => [new V3(L, y, zDej(L, y)), new V3(L, y, zTop(L, y))]), new V3(1, 0, 0), (p) => [p.y / D, (p.z - epiLo) / (epiHi - epiLo)]);
      const endTex = paintSection(coarse ? 512 : 1024, coarse ? 128 : 256, 170, (u) => zTop(L, u * D), (u) => zDej(L, u * D), D, 9);
      mesh(geoOf(end), skinMat({ color: 0xffffff, map: endTex, roughness: 0.7 }), { shadow: false });

      // the underside: the junction with the dermis, seen through the gel as rows of ridges running back
      const ux = 276;
      const uy = coarse ? 6 : 10;
      const up = [];
      const un = [];
      const ui = [];
      for (let j = 0; j <= uy; j++)
        for (let i = 0; i <= ux; i++) {
          const x = (L * i) / ux;
          const y = (D * j) / uy;
          const dzdx = (zDej(x + 0.4, y) - zDej(x - 0.4, y)) / 0.8;
          const n = new V3(dzdx, -dzdx * bendDy(y), -1).normalize();
          up.push(x, y, zDej(x, y));
          un.push(n.x, n.y, n.z);
        }
      for (let j = 0; j < uy; j++)
        for (let i = 0; i < ux; i++) {
          const a = j * (ux + 1) + i;
          const b = a + ux + 1;
          ui.push(a, b, a + 1, a + 1, b, b + 1);
        }
      underGeo = geoOf({ pos: up, nor: un, idx: ui });
    }

    // ------------------------------------------------------------ the dermis: back walls in the gel's own colour, a glossy skin in front
    {
      const wallMat = keep(
        "mat",
        new THREE.ShaderMaterial({
          uniforms: U,
          vertexShader: "varying vec3 vP; void main(){ vP = position; gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0); }",
          fragmentShader:
            "varying vec3 vP; uniform vec3 uGelInv; uniform vec2 uGelMax; uniform vec3 uGelC0; uniform vec3 uGelC1; uniform float uGelH; void main(){ float t = max(0.0, min((uGelMax.y - vP.y) * uGelInv.y, (uGelMax.x - vP.x) * uGelInv.x)); gl_FragColor = vec4(mix(uGelC1, uGelC0, clamp((vP.z + t * uGelInv.z) / uGelH, 0.0, 1.0)), 1.0); }",
        }),
      );
      const zc = dejTop + 0.5;
      // the back and the far end as one wall with a wide cove between them (a square corner would draw a dark seam), and the floor
      const plan = [[L, 0]];
      const cove = 46;
      for (let i = 0; i <= 14; i++) {
        const a = (i / 14) * (Math.PI / 2);
        plan.push([cove - cove * Math.sin(a), cove - cove * Math.cos(a)]);
      }
      plan.push([0, D]);
      const walls = [
        sheet(plan.map(([x, y]) => [new V3(x, y, 0), new V3(x, y, zc)]), new V3(0.5, 0.5, 0)),
        sheet([[new V3(0, 0, 0), new V3(0, D, 0)], [new V3(L, 0, 0), new V3(L, D, 0)]], new V3(0, 0, 1)),
      ];
      for (const w of walls) {
        const m = mesh(geoOf(w), wallMat, { shadow: false });
        m.receiveShadow = false;
      }
      // the junction's underside in the same colour: a papilla then reads as dermis standing up into the epidermis
      mesh(underGeo, wallMat, { ghost: true });
    }
    const shellU = {
      uTint: { value: col(PAL.shell) },
      uEdgeC: { value: col(PAL.edge) },
      uWarmC: { value: WARM },
      uWarm: { value: 0 },
      uShadeC: { value: col(PAL.gel1).multiplyScalar(night ? 0.5 : 0.66) },
      uA: { value: night ? 0.1 : 0.12 },
      uEdge: { value: night ? 0.34 : 0.5 },
      uGloss: { value: night ? 0.035 : 0.07 },
    };
    {
      const shellMat = keep(
        "mat",
        new THREE.ShaderMaterial({
          uniforms: shellU,
          vertexShader: "attribute vec4 aH; varying vec4 vH; varying float vZ; void main(){ vH = aH; vZ = position.z; gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0); }",
          fragmentShader: `varying vec4 vH; varying float vZ; uniform vec3 uTint; uniform vec3 uShadeC; uniform vec3 uEdgeC; uniform vec3 uWarmC; uniform float uWarm; uniform float uA; uniform float uEdge; uniform float uGloss;
            void main(){
              float d = min(min(vH.x, vH.y - vH.x), vZ);
              float edge = smoothstep(2.6, 0.3, d) * uEdge;
              float lift = clamp(vZ / 300.0, 0.0, 1.0);
              float a = uA * vH.z * (0.7 + 0.5 * lift);
              float sh = vH.w * (1.0 - 0.35 * lift);
              float w = uWarm * 0.2 * smoothstep(90.0, 300.0, vZ);
              float g = (vH.x - vZ * 0.55 - 40.0) / 60.0;
              float gloss = (exp(-g * g) + 0.6 * exp(-(g - 3.4) * (g - 3.4) * 4.0)) * uGloss * (1.0 - vH.w * 3.0);
              gl_FragColor = vec4(uShadeC * sh + uTint * a + uWarmC * w + uEdgeC * (edge + gloss), clamp(sh + a + w + edge + gloss, 0.0, 1.0));
            }`,
          transparent: true,
          premultipliedAlpha: true,
          depthWrite: false,
        }),
      );
      // aH = (distance along the face from its outer edge, the face's length, how hazy the face is, how far it is in shade)
      const fx = [];
      for (let i = 0; i <= L; i++) fx.push(i);
      const front = sheet(fx.map((x) => [new V3(x, D, 0), new V3(x, D, zDej(x, D))]), new V3(0, 1, 0));
      front.aH = [];
      for (const x of fx) front.aH.push(x, L, 1, 0.02, x, L, 1, 0.02);
      const ey = [];
      for (let i = 0; i <= 85; i++) ey.push((D * i) / 85);
      const end = sheet(ey.map((y) => [new V3(L, y, 0), new V3(L, y, zDej(L, y))]), new V3(1, 0, 0));
      end.aH = [];
      for (const y of ey) end.aH.push(D - y, D * 4, 1.5, 0.3, D - y, D * 4, 1.5, 0.3); // its far edge is the block's silhouette already
      for (const f of [front, end]) mesh(geoOf({ ...f, extra: [["aH", f.aH, 4]] }), shellMat, { ghost: true, order: 9 });
    }

    // ------------------------------------------------------------ vessels: a flat backdrop of blood, a wet see-through wall in front
    const seg = coarse ? 0.6 : 1;
    const uOne = { value: 1 };
    const uPlex = { value: 1 };
    const uSleeve = { value: 1 };
    const uLumen = { value: 1 };
    const ART_W = col(PAL.artWall), ART_L = col(PAL.artLumen), VEN_W = col(PAL.venWall), VEN_L = col(PAL.venLumen);
    const wet = { roughness: 0.36, clearcoat: 0.45, clearcoatRoughness: 0.22, envMapIntensity: 0.6 };
    const vessel = (bagged, wallHex, lumenHex, infl, a0 = 0.5) => {
      const g = done(bagged);
      const back = flat({ color: lumenHex, side: THREE.BackSide }, { infl });
      const front = glassOf({ color: wallHex, ...wet }, a0, 0.98, 1.4, 0.7, infl);
      mesh(g, back, { ghost: true });
      mesh(g, front, { ghost: true, order: 5 });
      return { back, front };
    };
    // the deep arteriole
    const artPts = LINES.art.map(W3);
    vessel(tube(bag(), artPts, 6.5, coarse ? 12 : 18), PAL.artWall, PAL.artLumen, uOne);
    // the venous plexus: the lane the drawing shows, two more behind it, and the links that make it a net
    const laneOf = (dy, dep) => LINES.plex.map((p) => W3([p[0], p[1] + dy(p[0]), dep(p[0])]));
    const lane0 = LINES.plex.map(W3);
    const lane1 = laneOf((sx) => 1 + 3 * Math.sin(sx / 24 + 1), (sx) => 36 + 6 * Math.sin(sx / 52 + 1));
    const lane2 = laneOf((sx) => -1 + 3 * Math.sin(sx / 29 + 3), (sx) => 62 + 6 * Math.sin(sx / 61 + 4));
    const plexBag = bag();
    tube(plexBag, lane0, 3.5, coarse ? 10 : 14);
    tube(plexBag, lane1, 2.9, coarse ? 8 : 12);
    tube(plexBag, lane2, 2.6, coarse ? 8 : 10);
    const link = (a, b, ia, ib) => {
      const p = a[ia];
      const q = b[ib];
      const mid = new V3().lerpVectors(p, q, 0.5);
      mid.z -= 3;
      tube(plexBag, spline([p, new V3().lerpVectors(p, mid, 0.5).add(new V3(2, 0, -1.5)), mid, new V3().lerpVectors(mid, q, 0.5).add(new V3(-2, 0, -1.5)), q], Math.round(14 * seg)), 2.1, 8);
    };
    for (const [ia, ib] of [[9, 13], [41, 46], [60, 57], [96, 101], [126, 122]]) link(lane0, lane1, ia, ib);
    for (const [ia, ib] of [[24, 28], [52, 49], [78, 83], [112, 109]]) link(lane1, lane2, ia, ib);
    const plexM = vessel(plexBag, PAL.venWall, PAL.venLumen, uPlex);
    // the cut ends on the end face: a ring of wall round a disc of blood
    const capsWall = bag();
    const capsBlood = bag();
    const lid = (out, c, r0, r1) => {
      const base = out.pos.length / 3;
      const n = 20;
      for (let j = 0; j <= n; j++) {
        const a = (j / n) * TAU;
        for (const r of [r0, r1]) {
          out.pos.push(L + 0.35, c.y + Math.cos(a) * r, c.z + Math.sin(a) * r);
          out.nor.push(1, 0, 0);
          out.axis.push(L + 0.35, c.y, c.z);
          out.uv.push(0, 0);
        }
        if (j) {
          const k = base + j * 2;
          out.idx.push(k - 2, k, k - 1, k - 1, k, k + 1);
        }
      }
    };
    const capArtW = bag();
    const capArtB = bag();
    lid(capArtW, artPts[artPts.length - 1], 4.9, 6.5);
    lid(capArtB, artPts[artPts.length - 1], 0, 4.9);
    const capMat = (hex) => phys({ color: hex, roughness: 0.45, clearcoat: 0.4 }, { fog: false, infl: uOne });
    mesh(done(capArtW), capMat(PAL.artWall), { ghost: true });
    mesh(done(capArtB), flat({ color: PAL.artLumen }, { fog: false, infl: uOne }), { ghost: true });
    for (const [lane, r] of [[lane0, 3.5], [lane1, 2.9], [lane2, 2.6]]) {
      lid(capsWall, lane[lane.length - 1], r * 0.68, r);
      lid(capsBlood, lane[lane.length - 1], 0, r * 0.68);
    }
    const capPlexW = phys({ color: PAL.venWall, roughness: 0.45, clearcoat: 0.4 }, { fog: false, infl: uPlex });
    const capPlexB = flat({ color: PAL.venLumen }, { fog: false, infl: uPlex });
    mesh(done(capsWall), capPlexW, { ghost: true });
    mesh(done(capsBlood), capPlexB, { ghost: true });

    // the three shunts: a sleeve of muscle round a lumen that is a thread when squeezed shut
    let sleeveFront = null;
    const sleeveBag = bag();
    const lumenBag = bag();
    const coils = LINES.avas.map((pts) => {
      // the drawn line stops at each vessel's wall; the tube runs on into the arteriole below and the plexus above
      const a = pts[0];
      const b = pts[pts.length - 1];
      return spline([W3([a[0], a[1] + 4, A3D.art(a[0])]), ...pts.map(W3), W3([b[0], b[1] - 5.5, A3D.plex(b[0])])], Math.round(136 * seg));
    });
    for (const c of coils) {
      const taper = (u) => 0.72 + 0.28 * Math.min(1, Math.min(u, 1 - u) * 9);
      tube(sleeveBag, c, (u) => 3.5 * taper(u), coarse ? 10 : 14);
      tube(lumenBag, c, 0.8, coarse ? 8 : 10);
    }
    {
      const g = done(sleeveBag);
      mesh(g, flat({ color: PAL.glomusDeep, side: THREE.BackSide }, { infl: uSleeve }), { ghost: true });
      sleeveFront = glassOf({ color: PAL.glomus, roughness: 0.42, clearcoat: 0.5, clearcoatRoughness: 0.25, sheen: 0.6, sheenColor: col(0xf3ddf8) }, 0.5, 0.97, 1.3, 0.8, uSleeve);
      mesh(g, sleeveFront, { ghost: true, order: 6 });
    }
    const lumenMat = flat({ color: PAL.artLumen, side: THREE.BackSide }, { infl: uLumen });
    mesh(done(lumenBag), lumenMat, { ghost: true });
    const LUMEN_SHUT = col(PAL.venLumen).lerp(col(PAL.artLumen), 0.4);
    const LUMEN_OPEN = col(PAL.artLumen).lerp(col(PAL.artWall), 0.8);
    // glomus cells: beads studding each sleeve, two at a station, winding round it. They sit on the muscle, so they
    // ride out with it as it relaxes (the drawing's fixed 7.5 is where they stand with the shunt open)
    const spots = [];
    let beads = null;
    {
      const T = new V3();
      const N = new V3();
      const Bn = new V3();
      coils.forEach((c, k) => {
        const n = c.length - 1;
        const stations = coarse ? 13 : 17;
        for (let s = 0; s < stations; s++) {
          const i = Math.round(((s + 1.4) / (stations + 1.8)) * n);
          T.subVectors(c[Math.min(n, i + 1)], c[Math.max(0, i - 1)]).normalize();
          N.set(0, 0, 1).addScaledVector(T, -T.z).normalize();
          Bn.crossVectors(T, N);
          for (const half of [0, 1]) {
            const a = s * 1.25 + half * Math.PI + k;
            spots.push([c[i], new V3().addScaledVector(N, Math.cos(a)).addScaledVector(Bn, Math.sin(a)), 2.65 + rnd() * 0.6]);
          }
        }
      });
      beads = new THREE.InstancedMesh(keep("geo", new THREE.SphereGeometry(1, coarse ? 9 : 12, coarse ? 6 : 9)), phys({ color: PAL.glomus, roughness: 0.5, sheen: 0.8, sheenRoughness: 0.45, sheenColor: col(0xf6e4fa), clearcoat: 0.3, clearcoatRoughness: 0.3 }), spots.length);
      const tint = new THREE.Color();
      spots.forEach((_, i) => beads.setColorAt(i, tint.setScalar(0.92 + rnd() * 0.16)));
      beads.frustumCulled = false;
      beads.castShadow = beads.receiveShadow = true;
      root.add(beads);
    }

    // ascending arterioles and the capillary loops: too fine to look into, so they are plain wet tubes
    {
      const fine = bag();
      for (const f of LINES.feeds) tube(fine, spline(f.map(W3), Math.round(40 * seg)), 1.45, 8, { color: ART_W });
      const cA = col(PAL.loopA);
      const cV = col(PAL.loopV);
      const cc = new THREE.Color();
      for (const lp of LINES.loops) tube(fine, spline(lp.map(W3), Math.round(30 * seg)), 1.05, coarse ? 6 : 8, { color: (u) => cc.lerpColors(cA, cV, A3D.ease(Math.max(0, Math.min(1, (u - 0.4) / 0.2)))).clone() });
      mesh(done(fine), phys({ color: 0xffffff, vertexColors: true, roughness: 0.32, clearcoat: 0.6, clearcoatRoughness: 0.2 }), { ghost: true });
    }

    // ------------------------------------------------------------ the nerve: a golden cord with its varicosities, a twig to each shunt
    {
      const nb = bag();
      const inside = LINES.nerve.filter((p) => p[0] >= B.x0 && p[0] <= B.x1); // the drawing clips it at the cut edges
      const trunk = spline(inside.map(W3), Math.round(150 * seg));
      tube(nb, trunk, (u, i) => 1.45 + 0.4 * Math.pow(Math.max(0, Math.sin(i * (coarse ? 1.15 : 0.7))), 6), 8);
      LINES.avas.forEach((pts, k) => {
        const br = DATA.branches[k];
        const tip2 = br[br.length - 1];
        let best = 0;
        let bd = Infinity;
        pts.forEach((p, i) => {
          const d = Math.hypot(p[0] - tip2[0], p[1] - tip2[1]);
          if (d < bd) {
            bd = d;
            best = i;
          }
        });
        const target = W3(pts[best]);
        const a = W3([br[0][0], br[0][1], A3D.nerve(br[0][0])]);
        const b = W3([br[1][0], br[1][1], A3D.nerve(br[1][0]) + 4]);
        const end = target.clone().add(b.clone().sub(target).normalize().multiplyScalar(7.6));
        const twig = spline([a, b, end], Math.round(16 * seg));
        tube(nb, twig, (u) => 1.25 - 0.35 * u, 6);
        // the ending on the muscle
        const s = new THREE.SphereGeometry(1.7, 10, 8);
        s.translate(end.x, end.y, end.z);
        const sp = s.getAttribute("position");
        const sn = s.getAttribute("normal");
        const su = s.getAttribute("uv");
        const base = nb.pos.length / 3;
        for (let i = 0; i < sp.count; i++) {
          nb.pos.push(sp.getX(i), sp.getY(i), sp.getZ(i));
          nb.nor.push(sn.getX(i), sn.getY(i), sn.getZ(i));
          nb.axis.push(end.x, end.y, end.z);
          nb.uv.push(su.getX(i), su.getY(i));
        }
        const si = s.getIndex();
        for (let i = 0; i < si.count; i++) nb.idx.push(base + si.getX(i));
        s.dispose();
      });
      mesh(done(nb), phys({ color: PAL.nerve, roughness: 0.4, clearcoat: 0.5, clearcoatRoughness: 0.25, sheen: 0.3, sheenColor: col(0xfff0c0) }), { shadow: true });
      const trunkEnd = trunk[trunk.length - 1];
      const dot = bag();
      lid(dot, trunkEnd, 0, 1.5);
      mesh(done(dot), phys({ color: PAL.nerve, roughness: 0.5 }, { fog: false, infl: uOne }), { ghost: true });
    }

    // ------------------------------------------------------------ sweat glands: a knotted tubule, a duct climbing to its pore
    {
      const gb = bag();
      B.glands.forEach(([gx, gy, pore], k) => {
        const dep = k ? 65 : 26;
        const c = W3([gx, gy, dep]);
        const knot = [];
        const n = Math.round(230 * seg);
        for (let i = 0; i <= n; i++) {
          const a = (i / n) * TAU * 2;
          const rr = 6.2 + 3.3 * Math.cos((a * 7) / 2 + k);
          knot.push(new V3(c.x + rr * Math.cos(a) * 1.08, c.y + rr * Math.sin(a), c.z + 3.3 * Math.sin((a * 7) / 2 + k) * 0.95 + 0.6 * Math.sin(a * 3)));
        }
        tube(gb, knot, 2.05, coarse ? 7 : 9);
        const px = pore - X0 + bend(D - dep);
        const top = zDej(px, D - dep) + 6;
        const duct = [];
        const z0 = c.z + 4;
        for (let i = 0; i <= 44; i++) {
          const u = i / 44;
          const lean = Math.min(1, u * 1.6);
          duct.push(new V3(c.x + (px - c.x) * A3D.ease(lean) + 2 * Math.sin(u * 14) * (1 - u * 0.3), c.y + 2 * Math.cos(u * 14) - 2, z0 + (top - z0) * u));
        }
        tube(gb, spline(duct, Math.round(60 * seg)), 1.25, 7);
      });
      mesh(done(gb), phys({ color: PAL.gland, roughness: 0.42, clearcoat: 0.5, clearcoatRoughness: 0.25, sheen: 0.5, sheenColor: col(0xe9ecff) }));
    }

    // ------------------------------------------------------------ fat lobules under the dermis, collagen through it
    {
      const spots = [];
      // pressed together into one cobbled layer, row behind row
      const rows = [20, 47, 75, 103, 130, 152];
      rows.forEach((dep, j) => {
        for (let x = 16 + (j % 2) * 15 + rnd() * 4; x < L - 14; x += 28 + rnd() * 7) {
          const r = 16.5 + rnd() * 5;
          spots.push([new V3(Math.min(L - r * 1.1 - 1, Math.max(r * 1.1 + 1, x)), Math.min(D - r - 1, Math.max(r + 1, D - dep + (rnd() - 0.5) * 6)), 12.5 + rnd() * 3), r]);
        }
      });
      const fat = new THREE.InstancedMesh(keep("geo", new THREE.SphereGeometry(1, coarse ? 12 : 18, coarse ? 8 : 12)), phys({ color: PAL.fat, roughness: 0.46, sheen: 0.6, sheenRoughness: 0.5, sheenColor: col(0xfff6d8), clearcoat: 0.45, clearcoatRoughness: 0.3 }), spots.length);
      const m4 = new THREE.Matrix4();
      const q = new THREE.Quaternion();
      const e = new THREE.Euler();
      const tint = new THREE.Color();
      spots.forEach(([p, r], i) => {
        q.setFromEuler(e.set((rnd() - 0.5) * 0.4, (rnd() - 0.5) * 0.4, rnd() * TAU));
        m4.compose(p, q, new V3(r * 1.08, r * (0.94 + rnd() * 0.1), r * (0.6 + rnd() * 0.1)));
        fat.setMatrixAt(i, m4);
        fat.setColorAt(i, tint.setRGB(0.94 + rnd() * 0.1, 0.94 + rnd() * 0.08, 0.9 + rnd() * 0.16));
      });
      fat.castShadow = fat.receiveShadow = true;
      root.add(fat);

      // collagen: short pale strands, each a shallow arc, scattered through the dermis
      const arc = bag();
      const pts = [];
      for (let i = 0; i <= 6; i++) pts.push(new V3(i / 6 - 0.5, 0, 0.16 * Math.sin((i / 6) * Math.PI)));
      tube(arc, pts, (u) => 0.022 * (0.3 + Math.sin(Math.PI * u)), 4);
      const count = coarse ? 60 : 110;
      const strands = new THREE.InstancedMesh(keep("geo", done(arc)), phys({ color: PAL.collagen, roughness: 0.5, clearcoat: 0.2 }), count);
      for (let i = 0; i < count; i++) {
        const len = 16 + rnd() * 20;
        q.setFromEuler(e.set((rnd() - 0.5) * 0.9, (rnd() - 0.5) * 0.7 + (rnd() < 0.5 ? Math.PI : 0), (rnd() - 0.5) * 1.1));
        m4.compose(new V3(14 + rnd() * (L - 28), 14 + rnd() * (D - 22), 46 + rnd() * 190), q, new V3(len, len, len));
        strands.setMatrixAt(i, m4);
      }
      ctx.ghost(strands);
      root.add(strands);
    }

    // ------------------------------------------------------------ blood cells and nerve impulses: instances the model moves
    const CAP = 640;
    const redGeo = (() => {
      const prof = [];
      const n = coarse ? 7 : 9;
      for (let i = 0; i <= n; i++) {
        const a = -Math.PI / 2 + (i / n) * Math.PI;
        const r = Math.cos(a);
        prof.push(new THREE.Vector2(Math.max(1e-4, r), Math.sin(a) * (0.13 + 0.34 * r * r) * (1 + 0.25 * r * r)));
      }
      return keep("geo", new THREE.LatheGeometry(prof, coarse ? 8 : 11));
    })();
    const cellMat = phys({ color: 0xffffff, roughness: 0.34, clearcoat: 0.7, clearcoatRoughness: 0.18, sheen: 0.4, sheenColor: col(0xffc9bd) });
    const cells = new THREE.InstancedMesh(redGeo, cellMat, CAP);
    cells.instanceMatrix.setUsage(THREE.DynamicDrawUsage);
    cells.frustumCulled = false;
    cells.count = 0;
    const CELL_A = col(PAL.cellA);
    const CELL_V = col(PAL.cellV);
    for (let i = 0; i < CAP; i++) cells.setColorAt(i, CELL_A);
    cells.instanceColor.setUsage(THREE.DynamicDrawUsage);
    ctx.ghost(cells);
    root.add(cells);

    const SPIKES = 96;
    const spikeGeo = keep("geo", new THREE.SphereGeometry(1, 12, 10));
    const spikeCore = new THREE.InstancedMesh(spikeGeo, flat({ color: col(PAL.spike).multiplyScalar(night ? 1.5 : 1.25) }), SPIKES);
    const spikeHalo = new THREE.InstancedMesh(
      spikeGeo,
      keep(
        "mat",
        new THREE.ShaderMaterial({
          uniforms: { uC: { value: col(PAL.spikeHalo) }, uA: { value: night ? 0.75 : 0.85 } },
          vertexShader: "varying float vF; void main(){ vec3 n = normalize(normalMatrix * mat3(instanceMatrix) * normal); vF = clamp(n.z, 0.0, 1.0); gl_Position = projectionMatrix * modelViewMatrix * instanceMatrix * vec4(position, 1.0); }",
          fragmentShader: "varying float vF; uniform vec3 uC; uniform float uA; void main(){ float a = pow(max(vF, 0.0), 2.2) * uA; gl_FragColor = vec4(uC * a, a); }",
          transparent: true,
          premultipliedAlpha: true,
          depthWrite: false,
        }),
      ),
      SPIKES,
    );
    for (const m of [spikeCore, spikeHalo]) {
      m.instanceMatrix.setUsage(THREE.DynamicDrawUsage);
      m.frustumCulled = false;
      m.count = 0;
      ctx.ghost(m);
      root.add(m);
    }
    spikeHalo.renderOrder = 7;

    // ------------------------------------------------------------ heat leaving the surface: soft ribbons that waver as they rise
    const heatU = { uTime: { value: 0 }, uWarm: { value: 0 }, uRight: { value: right }, uC: { value: col(PAL.heat) }, uA: { value: night ? 1 : 0.78 }, uCover: { value: night ? 0.5 : 1 }, uMinW: { value: 0 } }; // on Forest night the wisps glow (mostly added light); on Cream they are ink
    {
      const pos = [];
      const av = [];
      const idx = [];
      const S = coarse ? 14 : 22;
      const rows = [[150, 0], [98, 31], [46, 12]];
      let k = 0;
      for (const [y, off] of rows)
        for (let i = 0; i < 9; i++) {
          const x = 26 + off + i * 62 - (off ? 20 : 0);
          if (x < 8 || x > L - 8) continue;
          const z = zTop(x, y) + 5;
          const base = pos.length / 3;
          for (let s = 0; s <= S; s++)
            for (const side of [-1, 1]) {
              pos.push(x, y, z);
              av.push(s / S, side, i + k * 2.3);
            }
          for (let s = 0; s < S; s++) {
            const a = base + s * 2;
            idx.push(a, a + 1, a + 2, a + 1, a + 3, a + 2);
          }
          k++;
        }
      const heat = mesh(
        geoOf({ pos, nor: pos.map((_, i) => (i % 3 === 2 ? 1 : 0)), idx, extra: [["aV", av, 3]] }),
        keep(
          "mat",
          new THREE.ShaderMaterial({
            uniforms: heatU,
            vertexShader: `attribute vec3 aV; uniform float uTime; uniform float uMinW; uniform vec3 uRight; varying vec2 vV;
              void main(){
                float h = aV.x * 64.0;
                float sway = 5.0 * sin(-h * 0.12 + uTime + aV.z) * smoothstep(0.0, 0.2, aV.x);
                float w = max(uMinW, 1.25 * (0.45 + 0.55 * sin(3.14159 * aV.x)));
                vec3 p = position + vec3(0.0, 0.0, h) + uRight * (sway + aV.y * w);
                vV = aV.xy;
                gl_Position = projectionMatrix * modelViewMatrix * vec4(p, 1.0);
              }`,
            fragmentShader: "varying vec2 vV; uniform vec3 uC; uniform float uWarm; uniform float uA; uniform float uCover; void main(){ float a = uA * uWarm * pow(max(sin(3.14159 * clamp(vV.x, 0.0, 1.0)), 0.0), 0.75) * (1.0 - vV.y * vV.y * 0.8); gl_FragColor = vec4(uC * a, a * uCover); }",
            transparent: true,
            premultipliedAlpha: true,
            depthWrite: false,
            side: THREE.DoubleSide,
          }),
        ),
        { ghost: true, order: 8 },
      );
      heat.frustumCulled = false;
    }

    // ------------------------------------------------------------ the model's state, every frame
    const m4 = new THREE.Matrix4();
    const q = new THREE.Quaternion();
    const e = new THREE.Euler();
    const pos = new V3();
    const scl = new V3();
    const tint = new THREE.Color();
    const fract = (v) => v - Math.floor(v);
    const R = 2.9;
    let lastOpen = -1;
    let lastWarm = -1;
    return {
      update(st) {
        const o = st.open;
        const w = st.warm;
        if (o !== lastOpen) {
          lastOpen = o;
          // the same widths the drawing gives its vessels
          uPlex.value = (7 + 7 * o) / 7;
          uSleeve.value = (7 + 6 * o) / 7;
          uLumen.value = (1.6 + 7.4 * o) / 1.6;
          const red = 0.15 + 0.6 * o;
          plexM.front.color.lerpColors(VEN_W, ART_W, red);
          plexM.back.color.lerpColors(VEN_L, ART_L, red);
          capPlexW.color.copy(plexM.front.color);
          capPlexB.color.copy(plexM.back.color);
          lumenMat.color.lerpColors(LUMEN_SHUT, LUMEN_OPEN, o);
          sleeveFront.userData.glass.x = 0.5 - 0.36 * o; // the relaxed wall is stretched thin: the open lumen shows through
          const off = 5.5 + 2 * o;
          for (let i = 0; i < spots.length; i++) {
            const [c0, dir, r] = spots[i];
            m4.makeScale(r, r, r).setPosition(c0.x + dir.x * off, c0.y + dir.y * off, c0.z + dir.z * off);
            beads.setMatrixAt(i, m4);
          }
          beads.instanceMatrix.needsUpdate = true;
        }
        if (w !== lastWarm) {
          lastWarm = w;
          U.uGelC0.value.lerpColors(GEL0, WARM, 0.27 * w);
          U.uGelC1.value.lerpColors(GEL1, WARM, 0.06 * w);
          shellU.uWarm.value = w;
          heatU.uWarm.value = w;
          for (const [m, base] of flushable) m.color.setRGB(base.r * (1 + (PAL.flush[0] - 1) * w), base.g * (1 + (PAL.flush[1] - 1) * w), base.b * (1 + (PAL.flush[2] - 1) * w));
        }
        heatU.uTime.value = (st.now / 260) % (TAU * 1000);
        heatU.uMinW.value = 0.8 * (st.unit || 0); // at least a pixel and a half wide, whatever the screen
        // blood cells: [sx, sy, depth, tx, ty, kind, jitter, run] each. kinds: 0 artery, 1 feed, 2 capillary, 3 plexus (venous), 4 shunt, 5 plexus (arterial)
        const c = st.cells;
        const n = Math.min(st.n, CAP);
        for (let i = 0; i < n; i++) {
          const k = i * 8;
          const kind = Math.floor(c[k + 5]);
          const along = c[k + 5] - kind; // how far through this stretch of its route
          const j = c[k + 6];
          const run = c[k + 7];
          const h1 = fract(j * 12.9898 + 0.37);
          const h2 = fract(j * 78.233 + 0.11);
          let size = 1;
          let spread = 1;
          let plump = 1;
          if (kind === 1) { size = 0.72; spread = 0.12; plump = 2.1; }
          else if (kind === 2) { size = 0.58; spread = 0.1; plump = 2.3; }
          else if (kind === 3 || kind === 5) { size = 0.74 + 0.26 * o; spread = 0.3 + 0.7 * o; }
          else if (kind === 4) { size = Math.max(0.3, Math.min(1, (0.8 + 3.7 * o) / 3.4)); spread = 0.2 + 0.7 * o; }
          const sx = c[k] - c[k + 4] * j * spread;
          const sy = c[k + 1] + c[k + 3] * j * spread;
          pos.set(sx - X0, D - (c[k + 2] + (h2 - 0.5) * 3 * spread), BASE - sy);
          q.setFromEuler(e.set(h1 * TAU + run * 0.021, h2 * TAU + run * 0.013, h1 * 4));
          m4.compose(pos, q, scl.set(R * size, R * size * plump, R * size));
          cells.setMatrixAt(i, m4);
          cells.setColorAt(i, kind === 3 ? CELL_V : kind === 2 ? tint.lerpColors(CELL_A, CELL_V, A3D.ease(Math.max(0, Math.min(1, (along - 0.3) / 0.4)))) : CELL_A);
        }
        cells.count = n;
        cells.instanceMatrix.needsUpdate = true;
        cells.instanceColor.needsUpdate = true;
        // impulses running along the nerve while it holds the shunts shut: [sx, sy, depth] each
        const s = st.spikes;
        const ns = Math.min(st.ns, SPIKES);
        for (let i = 0; i < ns; i++) {
          pos.set(s[i * 3] - X0, D - s[i * 3 + 2], BASE - s[i * 3 + 1]);
          const show = pos.x > 3 && pos.x < L - 3 ? 1 : 0; // the nerve is cut at the block's ends
          m4.makeScale(2.5 * show, 2.5 * show, 2.5 * show).setPosition(pos);
          spikeCore.setMatrixAt(i, m4);
          m4.makeScale(4.6 * show, 4.6 * show, 4.6 * show).setPosition(pos);
          spikeHalo.setMatrixAt(i, m4);
        }
        spikeCore.count = spikeHalo.count = ns;
        spikeCore.instanceMatrix.needsUpdate = true;
        spikeHalo.instanceMatrix.needsUpdate = true;
      },
      dispose() {
        for (const m of owned.mat) m.dispose();
        for (const t of owned.tex) t.dispose();
      },
    };
  };
}
