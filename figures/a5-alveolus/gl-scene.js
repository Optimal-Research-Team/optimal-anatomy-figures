// A5 3-D scene: the drawing's block of lung, modelled for the shared real-time layer (shared/gl3, `build`).
//
// Everything is built in the page from the drawing's own geometry (DATA.g3: the block, the sac, the duct, the vessels'
// path, every noted knob, nucleus and granule), in the block's world units (x along, y back into the lung, z up), so the
// render lands on the drawing to the pixel and the traced-cell ring and the monitor stay in the SVG on top.
//
//   foam      air sacs packed for the three faces we see (centres just under a face, sizes varied, thin walls). Each
//             is its cell among its neighbours, shrunk by half a wall and rounded (a p-norm of its planes): a real
//             hollow behind every opening. The cut faces are meshed from the same field (marching squares), so
//             openings and hollows agree across the block's edges, and every edge of an opening is rolled over.
//   the sac   one half-turned surface: the bowl, the mouth and the duct with its entrance rings. The capillary net
//             is tubes on the bowl; its blue-to-red change is a 2-texel ramp the model slides.
//   vessels   the arteriole, the traced capillary and the venule are one open gutter in the front face.
//   movers    red cells, oxygen, carbon dioxide and the duct's air are instances placed from the model's state each
//             frame; gas keeps its place on screen and takes its depth along the line of sight, inside the sac.
function a5Scene(ctx, G, opt) {
  const T = ctx.THREE;
  const coarse = !!ctx.coarse;
  const night = !!ctx.night;
  const RAD = Math.PI / 180;
  const { L, D, HF, R, RING, RHO } = G;
  const CX = G.C[0] - G.X0; // the opened sac's centre on the front face (y = D)
  const CZ = G.YB - G.C[1];
  const P = ctx.P;
  const cam = { sA: Math.sin(P.azimuth * RAD), cA: Math.cos(P.azimuth * RAD), sE: Math.sin(P.elevation * RAD), cE: Math.cos(P.elevation * RAD), k: P.scale * Math.sqrt(1.6) };
  const DV = [cam.cA * cam.cE, cam.sA * cam.cE, cam.sE]; // toward the viewer
  const screenX = (x, y) => P.origin[0] + (x * cam.sA - y * cam.cA) * cam.k;
  const clamp = (v, a, b) => Math.max(a, Math.min(b, v));
  const sstep = (a, b, v) => {
    const t = clamp((v - a) / (b - a), 0, 1);
    return t * t * (3 - 2 * t);
  };
  let seed = 11;
  const rnd = () => ((seed = (seed * 16807) % 2147483647) - 1) / 2147483646;

  // ---------------------------------------------------------------- palette (the drawing's own, figure.css + block.css)
  const PAL = night
    ? {
        tissue: "#9d5c5b", rim: "#532629", sheath: "#a86866", lip: "#7c4647", deep: "#3a1c20", pit: "#2a1216", warm: "#7a4634", cool: "#5a3350", web: "#b5524f",
        bowl: "#8a5050", bowlDeep: "#43232a", duct: "#8f5656", ductDeep: "#4c282b", capA: "#e2402f", capV: "#7a62a8", knob: "#b46e63",
        ven: "#5d63b8", art: "#d84c3f", venTube: "#4a4d8a", artTube: "#8a3a36", plasma: "#e7c4b8",
        o2: "#8ff0e6", co2: "#b3b0aa", t2: "#a8645a", gran: "#ffe3c4", mac: "#8c5a63", macNuc: "#d7a3ad", pore: "#241012", pave: "#3a1c1c",
      }
    : {
        tissue: "#e4a9a5", rim: "#b0645f", sheath: "#d08a84", lip: "#fff1ee", deep: "#f0c1bd", pit: "#d79a9b", warm: "#f8cdb4", cool: "#e6bfd0", web: "#e2817b",
        bowl: "#fbe6e2", bowlDeep: "#e0aaa3", duct: "#fbebe8", ductDeep: "#e7b9b2", capA: "#d4382a", capV: "#6f62b0", knob: "#b8695c",
        ven: "#7880cc", art: "#da5a4c", venTube: "#c3c6ea", artTube: "#f0b8ae", plasma: "#fff4ef",
        o2: "#0f8a8f", co2: "#8c877e", t2: "#eab3a3", gran: "#8a4a3e", mac: "#cf9aa6", macNuc: "#7a3d4a", pore: "#b98374", pave: "#9a5245",
      };
  const lin = (hex) => {
    const c = new T.Color(hex);
    return [c.r, c.g, c.b];
  };
  const C = Object.fromEntries(Object.entries(PAL).map(([k2, v]) => [k2, lin(v)]));
  const mix3 = (a, b, t) => [a[0] + (b[0] - a[0]) * t, a[1] + (b[1] - a[1]) * t, a[2] + (b[2] - a[2]) * t];

  // ---------------------------------------------------------------- detail
  const HGRID = coarse ? 2.5 : 2; //   cut-face mesh step (divides 560, 340 and 180): fine enough for the thin walls
  const ICO = coarse ? 2 : 3; //       air-sac hollows: icosphere detail (one less for the small sacs on desktop)
  const INFL = [0, 0, 1.035, 1.012]; // by detail: hollows a hair larger than their openings, so no edge shows a gap
  const LIP = 1.0; //                  how far an opening's edge rolls back from the cut face
  const LW = 3.2; //                   over what distance
  const OVER = 0.45;

  // ---------------------------------------------------------------- mesh builder
  const mk = () => ({ pos: [], nor: [], col: [], uv: null, idx: [], n: 0 });
  const vtx = (B, x, y, z, nx, ny, nz, c) => {
    B.pos.push(x, y, z);
    B.nor.push(nx, ny, nz);
    B.col.push(c[0], c[1], c[2]);
    return B.n++;
  };
  /** Triangles are turned to agree with their normals, so nothing below depends on winding. */
  function finish(B) {
    const { pos, nor, idx } = B;
    for (let i = 0; i < idx.length; i += 3) {
      const a = idx[i] * 3;
      const b = idx[i + 1] * 3;
      const c = idx[i + 2] * 3;
      const ux = pos[b] - pos[a], uy = pos[b + 1] - pos[a + 1], uz = pos[b + 2] - pos[a + 2];
      const vx = pos[c] - pos[a], vy = pos[c + 1] - pos[a + 1], vz = pos[c + 2] - pos[a + 2];
      const d = (uy * vz - uz * vy) * (nor[a] + nor[b] + nor[c]) + (uz * vx - ux * vz) * (nor[a + 1] + nor[b + 1] + nor[c + 1]) + (ux * vy - uy * vx) * (nor[a + 2] + nor[b + 2] + nor[c + 2]);
      if (d < 0) {
        const t = idx[i + 1];
        idx[i + 1] = idx[i + 2];
        idx[i + 2] = t;
      }
    }
    const g = new T.BufferGeometry();
    g.setAttribute("position", new T.Float32BufferAttribute(pos, 3));
    g.setAttribute("normal", new T.Float32BufferAttribute(nor, 3));
    g.setAttribute("color", new T.Float32BufferAttribute(B.col, 3));
    if (B.uv) g.setAttribute("uv", new T.Float32BufferAttribute(B.uv, 2));
    g.setIndex(idx);
    return g;
  }
  /** Smooth normals from the faces, turned to the side `toward(x, y, z)` says (returns a direction). */
  function autoNormals(B, toward) {
    const { pos, nor, idx } = B;
    nor.fill(0);
    for (let i = 0; i < idx.length; i += 3) {
      const a = idx[i] * 3, b = idx[i + 1] * 3, c = idx[i + 2] * 3;
      const ux = pos[b] - pos[a], uy = pos[b + 1] - pos[a + 1], uz = pos[b + 2] - pos[a + 2];
      const vx = pos[c] - pos[a], vy = pos[c + 1] - pos[a + 1], vz = pos[c + 2] - pos[a + 2];
      let nx = uy * vz - uz * vy, ny = uz * vx - ux * vz, nz = ux * vy - uy * vx;
      const w = toward((pos[a] + pos[b] + pos[c]) / 3, (pos[a + 1] + pos[b + 1] + pos[c + 1]) / 3, (pos[a + 2] + pos[b + 2] + pos[c + 2]) / 3);
      if (nx * w[0] + ny * w[1] + nz * w[2] < 0) (nx = -nx), (ny = -ny), (nz = -nz);
      for (const q of [a, b, c]) (nor[q] += nx), (nor[q + 1] += ny), (nor[q + 2] += nz);
    }
    for (let q = 0; q < nor.length; q += 3) {
      const l = Math.hypot(nor[q], nor[q + 1], nor[q + 2]) || 1;
      (nor[q] /= l), (nor[q + 1] /= l), (nor[q + 2] /= l);
    }
  }

  // ---------------------------------------------------------------- the vessels' path on the front face (world x, z)
  const PW = opt.path.map((p) => [p[0] - G.X0, G.YB - p[1]]);
  const NP = PW.length;
  const { i0, i1 } = opt;
  const VS = G.vessel;
  const lumR = new Float32Array(NP); // half the lumen's width along the path
  const shR = new Float32Array(NP); //  half the sheath's width (0 along the capillary)
  for (let u = 0; u < NP; u++) {
    const cap = VS.cap / 2;
    if (u <= i0) {
      const f = u / i0;
      const w = sstep(i0 - 16, i0, u);
      lumR[u] = ((VS.in[0] + (VS.in[1] - VS.in[0]) * f) / 2) * (1 - w) + cap * w;
      shR[u] = ((VS.in[2] + (VS.in[3] - VS.in[2]) * f) / 2) * (1 - sstep(i0 - 30, i0 - 6, u));
    } else if (u >= i1) {
      const f = (u - i1) / (NP - 1 - i1);
      const w = 1 - sstep(i1, i1 + 16, u);
      lumR[u] = ((VS.out[0] + (VS.out[1] - VS.out[0]) * f) / 2) * (1 - w) + cap * w;
      shR[u] = ((VS.out[2] + (VS.out[3] - VS.out[2]) * f) / 2) * sstep(i1 + 6, i1 + 30, u);
    } else lumR[u] = cap;
  }
  const pathBox = PW.reduce((b, p) => [Math.min(b[0], p[1]), Math.max(b[1], p[1])], [1e9, -1e9]);
  /** Nearest path point to (x, z) on the front face: [distance, index]. */
  const nearOut = [0, 0];
  function nearPath(x, z) {
    let best = 1e12;
    let bi = 0;
    for (let u = 0; u < NP; u++) {
      const dx = PW[u][0] - x;
      const dz = PW[u][1] - z;
      const d = dx * dx + dz * dz;
      if (d < best) (best = d), (bi = u);
    }
    nearOut[0] = Math.sqrt(best);
    nearOut[1] = bi;
    return nearOut;
  }

  // ---------------------------------------------------------------- the sac and its duct: one profile, turned half way
  // (r, z) from the sac's centre: the sphere up to the mouth, a small rolled lip, the duct with its entrance rings
  const LD_MOUTH = 72;
  const DUCT_R = G.duct.r;
  const KNOB_Z = G.duct.knobs.map((sy) => G.YB - sy - CZ);
  const ductR = (z) => DUCT_R - KNOB_Z.reduce((s, kz) => s + 1.5 * Math.exp(-(((z - kz) / 4.2) ** 2)), 0);
  const PROF = []; // [r, z, v]
  for (let Ld = -90; Ld <= LD_MOUTH; Ld++) PROF.push([R * Math.cos(Ld * RAD), R * Math.sin(Ld * RAD), ((Ld + 90) / 180) * 1]);
  const zTop = HF - CZ - LIP;
  {
    const S = [R * Math.cos(LD_MOUTH * RAD), R * Math.sin(LD_MOUTH * RAD)];
    const tS = [-Math.sin(LD_MOUTH * RAD), Math.cos(LD_MOUTH * RAD)];
    const zE = S[1] + 9;
    const E = [ductR(zE), zE];
    const c1 = [S[0] + tS[0] * 4, S[1] + tS[1] * 4];
    const c2 = [E[0], E[1] - 4.5];
    for (let q = 1; q <= 8; q++) {
      const t = q / 8;
      const b = [0, 1].map((c) => (1 - t) ** 3 * S[c] + 3 * (1 - t) ** 2 * t * c1[c] + 3 * (1 - t) * t * t * c2[c] + t ** 3 * E[c]);
      PROF.push([b[0], b[1], 0.9 + 0.01 * q]);
    }
    const n = coarse ? 30 : 48;
    for (let q = 1; q <= n; q++) {
      const z = zE + ((zTop - zE) * q) / n;
      PROF.push([ductR(z), z, 0.98]);
    }
  }
  const Z_MOUTH = PROF[LD_MOUTH + 90][1];
  /** The profile's radius at a height above the mouth (the duct's slot on the front face). */
  function profR(z) {
    let a = LD_MOUTH + 90;
    while (a < PROF.length - 2 && PROF[a + 1][1] < z) a++;
    const A = PROF[a];
    const B2 = PROF[a + 1];
    const t = clamp((z - A[1]) / (B2[1] - A[1] || 1), 0, 1);
    return A[0] + (B2[0] - A[0]) * t;
  }

  // ---------------------------------------------------------------- the foam: one rounded hollow per air sac
  // The block's air sacs are packed for the three faces we see. Their centres sit just under a face, so each face cuts
  // its sacs near their widest: every opening is a full, rounded hollow with a thin wall to its neighbours, and none is
  // a pin-hole, a slit or a shallow dish (what a random cut through the drawing's own packing gives, and what reads as
  // dirt once it has depth). Sizes vary; big sacs are placed first and smaller ones fill between them. Solid tissue is
  // left only where the anatomy has it: round the vessels in their sheaths, the opened sac's wall and the duct.
  const SEPT = 3.1; // half a wall between two sacs
  const SKIN = 2 * HGRID; // the block's unseen sides are closed by a skin: a hollow stops short of them
  const EDGE = 2 * SEPT; //  and a sac under one face stops a wall short of the other two, so the block keeps its three edges
  // what the hollows keep clear of: the sac and its wall, the duct's sleeve, the vessels in their sheaths
  const keepAlv = [[CX, D, CZ, R + RING + 1.5]];
  const keepDuct = [];
  for (let z = CZ + 100; z <= HF + 40; z += 14) keepDuct.push([CX, D, z, DUCT_R + G.duct.sleeve + 1.5]);
  const keepIn = [];
  const keepOut = [];
  for (let u = 0; u <= i0; u += 5) keepIn.push([PW[u][0], D, PW[u][1], Math.max(shR[u], lumR[u] + 6) + 1.5]);
  for (let u = i1; u < NP; u += 5) keepOut.push([PW[u][0], D, PW[u][1], Math.max(shR[u], lumR[u] + 6) + 1.5]);
  const KEEP = [keepAlv, keepDuct, keepIn, keepOut];
  const SEEDS = []; // x, y, z, radius, the face it lies under (0 front, 1 top, 2 right end)
  {
    // along a face: from the skin of an unseen side to a wall's width short of the next face we see (EDGE below)
    const span = (r, len, t) => SKIN + 0.8 * r + t * (len - EDGE - 1.6 * r - SKIN);
    // [area, where a sac of radius r sits at depth d: (a, b) in 0..1 across the face]
    const FACES = [
      [L * HF, (r, d, a, b) => [span(r, L, a), D - d, span(r, HF, b)]], // front
      [L * D, (r, d, a, b) => [span(r, L, a), span(r, D, b), HF - d]], // top
      [D * HF, (r, d, a, b) => [L - d, span(r, D, a), span(r, HF, b)]], // right end
    ];
    const tryAt = (f, r, q) => {
      for (let k = 0; k < SEEDS.length; k++) {
        const o = SEEDS[k];
        // sacs under two different faces may crowd each other along the edge the faces share (their common wall then
        // runs slantwise in from the edge), so neither face is left with a blank band behind that edge
        const lim = (r + o[3]) * (o[4] === f ? 1 : 0.62);
        const dx = o[0] - q[0], dy = o[1] - q[1], dz = o[2] - q[2];
        if (dx * dx + dy * dy + dz * dz < lim * lim) return;
      }
      for (const g of KEEP)
        for (const bk of g) {
          const lim = bk[3] + 0.8 * r;
          const dx = bk[0] - q[0], dy = bk[1] - q[1], dz = bk[2] - q[2];
          if (dx * dx + dy * dy + dz * dz < lim * lim) return;
        }
      SEEDS.push([q[0], q[1], q[2], r, f]);
    };
    const area = FACES.reduce((t, f) => t + f[0], 0);
    const scatter = (r0, r1, tries) => {
      for (let t = 0; t < tries; t++) {
        const r = r0 + (r1 - r0) * rnd();
        let pick = rnd() * area;
        let f = 0;
        while (f < 2 && pick > FACES[f][0]) pick -= FACES[f++][0];
        tryAt(f, r, FACES[f][1](r, 2 + rnd() * 0.42 * r, rnd(), rnd()));
      }
    };
    // First a row of sacs along each of the three edges we see, on both faces that meet there, of mixed sizes (a sac
    // placed later, a little way in from an edge, would leave the other face blank behind that edge).
    // [face, which of its two coordinates runs to the edge]
    for (let t = 0; t < 9000; t++) {
      const [f, side] = [[0, 1], [1, 1], [0, 0], [2, 0], [1, 0], [2, 1]][t % 6];
      const r = t < 1500 ? 25 + 8 * rnd() : 17 + 10 * rnd() ** 1.4;
      const a = side === 0 ? 1 - 0.014 * rnd() : rnd();
      const b2 = side === 1 ? 1 - 0.014 * rnd() : rnd();
      tryAt(f, r, FACES[f][1](r, 2 + 2.5 * rnd(), a, b2));
    }
    // then the faces: big sacs first, smaller and smaller ones between them
    for (const [r0, r1, tries] of [[32, 38, 1100], [28, 33, 2600], [25, 30, 5200], [21.5, 26, 9000], [18.5, 22, 9000], [16, 19, 9000]]) scatter(r0, r1, tries);
  }
  function cavityOf(i) {
    const s = SEEDS[i];
    const pl = []; // planes about the seed: unit normal, distance. Each wall lies between two sacs in proportion to their sizes
    for (let j = 0; j < SEEDS.length; j++) {
      if (j === i) continue;
      const q = SEEDS[j];
      const dx = q[0] - s[0], dy = q[1] - s[1], dz = q[2] - s[2];
      const d = Math.hypot(dx, dy, dz);
      if (d < 2.6 * (s[3] + q[3])) pl.push([dx / d, dy / d, dz / d, (d * s[3]) / (s[3] + q[3]) - SEPT]);
    }
    pl.push([-1, 0, 0, s[0] - SKIN], [0, -1, 0, s[1] - SKIN], [0, 0, -1, s[2] - SKIN]);
    if (s[4] !== 0) pl.push([0, 1, 0, D - EDGE - s[1]]);
    if (s[4] !== 1) pl.push([0, 0, 1, HF - EDGE - s[2]]);
    if (s[4] !== 2) pl.push([1, 0, 0, L - EDGE - s[0]]);
    const groups = KEEP.map((g) => g.filter((bk) => Math.hypot(bk[0] - s[0], bk[1] - s[1], bk[2] - s[2]) - bk[3] < 80));
    const cv = settle(s, pl, groups, [s[0], s[1], s[2]]);
    if (!cv) return [];
    // where no neighbour bounds it (into the block, and in a gap of the packing) the sac is round
    cv.cap = (1 / (1.32 * s[3])) ** 8;
    cv.tint = rnd() * 2 - 1;
    cv.r = s[3];
    return [cv];
  }
  function settle(s, pl, groups, c) {
    // a centre that sits in something the hollow must keep clear of moves out of it
    for (let it = 0; it < 60; it++) {
      let moved = false;
      for (const g of groups)
        for (const b of g) {
          const dx = c[0] - b[0], dy = c[1] - b[1], dz = c[2] - b[2];
          const d = Math.hypot(dx, dy, dz);
          const want = b[3] + 12;
          if (d < want) {
            const k2 = ((want - d) * 0.5) / Math.max(d, 1e-3);
            c[0] += (d > 1e-3 ? dx : 0) * k2;
            c[1] += (d > 1e-3 ? dy : -1) * k2;
            c[2] += (d > 1e-3 ? dz : 0) * k2;
            moved = true;
          }
        }
      for (const p of pl) {
        const h = p[3] - (p[0] * (c[0] - s[0]) + p[1] * (c[1] - s[1]) + p[2] * (c[2] - s[2]));
        if (h < 11) {
          const k2 = (11 - h) * 0.5;
          c[0] -= p[0] * k2;
          c[1] -= p[1] * k2;
          c[2] -= p[2] * k2;
          moved = true;
        }
      }
      if (!moved) break;
    }
    const planes = [];
    let slack = 1e9;
    for (const p of pl) {
      const h = p[3] - (p[0] * (c[0] - s[0]) + p[1] * (c[1] - s[1]) + p[2] * (c[2] - s[2]));
      slack = Math.min(slack, h);
      if (h < 150) planes.push(p[0], p[1], p[2], 1 / h);
    }
    const sets = groups.map((g) => {
      const out = [];
      for (const b of g) {
        const dx = b[0] - c[0], dy = b[1] - c[1], dz = b[2] - c[2];
        const d = Math.hypot(dx, dy, dz);
        slack = Math.min(slack, d - b[3]);
        if (d - b[3] < 110) out.push(dx / d, dy / d, dz / d, 1 / Math.max(1e-3, d - b[3]));
      }
      return out;
    });
    if (slack < 9.5) return null; // a sliver: leave it solid
    return { c, planes, sets: sets.filter((q) => q.length), tmax: 0, cuts: 0, cap: 0, tint: 0, r: 0 };
  }
  /** How far the hollow reaches from its centre along a unit direction. */
  function reach(cv, ux, uy, uz) {
    let sum = cv.cap;
    const p = cv.planes;
    for (let q = 0; q < p.length; q += 4) {
      const a = (p[q] * ux + p[q + 1] * uy + p[q + 2] * uz) * p[q + 3];
      if (a > 0) {
        const a2 = a * a;
        const a4 = a2 * a2;
        sum += a4 * a4;
      }
    }
    for (const g of cv.sets) {
      let m = 0;
      for (let q = 0; q < g.length; q += 4) {
        const a = (g[q] * ux + g[q + 1] * uy + g[q + 2] * uz) * g[q + 3];
        if (a > m) m = a;
      }
      if (m > 0) {
        const a2 = m * m;
        const a4 = a2 * a2;
        sum += a4 * a4;
      }
    }
    return 1 / Math.sqrt(Math.sqrt(Math.sqrt(sum)));
  }
  function icosphere(detail) {
    const t = (1 + Math.sqrt(5)) / 2;
    const v = [[-1, t, 0], [1, t, 0], [-1, -t, 0], [1, -t, 0], [0, -1, t], [0, 1, t], [0, -1, -t], [0, 1, -t], [t, 0, -1], [t, 0, 1], [-t, 0, -1], [-t, 0, 1]].map((p) => {
      const l = Math.hypot(p[0], p[1], p[2]);
      return [p[0] / l, p[1] / l, p[2] / l];
    });
    let f = [[0, 11, 5], [0, 5, 1], [0, 1, 7], [0, 7, 10], [0, 10, 11], [1, 5, 9], [5, 11, 4], [11, 10, 2], [10, 7, 6], [7, 1, 8], [3, 9, 4], [3, 4, 2], [3, 2, 6], [3, 6, 8], [3, 8, 9], [4, 9, 5], [2, 4, 11], [6, 2, 10], [8, 6, 7], [9, 8, 1]];
    for (let d = 0; d < detail; d++) {
      const cache = new Map();
      const mid = (a, b) => {
        const key = a < b ? a * 65536 + b : b * 65536 + a;
        let m = cache.get(key);
        if (m === undefined) {
          const p = [v[a][0] + v[b][0], v[a][1] + v[b][1], v[a][2] + v[b][2]];
          const l = Math.hypot(p[0], p[1], p[2]);
          m = v.push([p[0] / l, p[1] / l, p[2] / l]) - 1;
          cache.set(key, m);
        }
        return m;
      };
      const nf = [];
      for (const [a, b, c] of f) {
        const ab = mid(a, b), bc = mid(b, c), ca = mid(c, a);
        nf.push([a, ab, ca], [b, bc, ab], [c, ca, bc], [ab, bc, ca]);
      }
      f = nf;
    }
    return { v, f };
  }
  const BALLS = [null, null, icosphere(2), coarse ? null : icosphere(3)];
  const cavities = [];
  for (const cv of SEEDS.flatMap((_, i) => cavityOf(i))) {
    // its surface, sampled on the icosphere
    cv.ball = BALLS[cv.r < 23 ? 2 : ICO];
    const BALL = cv.ball;
    const infl = INFL[cv.r < 23 ? 2 : ICO];
    const n = BALL.v.length;
    const pts = new Float32Array(n * 3);
    let tmax = 0;
    let cuts = 0;
    for (let q = 0; q < n; q++) {
      const u = BALL.v[q];
      const t = reach(cv, u[0], u[1], u[2]);
      if (t > tmax) tmax = t;
      const x = cv.c[0] + u[0] * t * infl, y = cv.c[1] + u[1] * t * infl, z = cv.c[2] + u[2] * t * infl;
      pts[q * 3] = x;
      pts[q * 3 + 1] = y;
      pts[q * 3 + 2] = z;
      const inX = x > -4 && x < L + 4, inY = y > -4 && y < D + 4, inZ = z > -4 && z < HF + 4;
      if (y > D && inX && inZ) cuts |= 1; // opened by the front face
      if (z > HF && inX && inY) cuts |= 2; // the top
      if (x > L && inY && inZ) cuts |= 4; // the right end
    }
    cv.tmax = tmax;
    cv.cuts = cuts;
    cv.pts = pts;
    if (cv.c[0] - tmax < L && cv.c[0] + tmax > 0 && cv.c[1] - tmax < D && cv.c[1] + tmax > 0 && cv.c[2] - tmax < HF && cv.c[2] + tmax > 0) cavities.push(cv);
  }

  // the hollows themselves: seen from inside, clipped to the block
  // A hollow's tone: bright where the open air reaches (its rim, and the part of its wall that faces up to the light),
  // deeper and rosier further in and under its roof; each sac a little its own tint, as living tissue is.
  // The studio's key light, as shared/gl3 places it (above, a little left of the camera and toward it).
  const KEY = (() => {
    const v = [-0.5 * cam.sA + 0.42 * DV[0], 0.5 * cam.cA + 0.42 * DV[1], 0.42 * DV[2] + 1.45];
    const l = Math.hypot(v[0], v[1], v[2]);
    return [v[0] / l, v[1] / l, v[2] / l];
  })();
  /** How much of the key light reaches a point of a hollow's wall: 1 where the way to the light leaves by its opening. */
  const litOf = (cv, x, y, z) => {
    let lit = 0;
    for (const [bit, axis, at] of [[1, 1, D], [2, 2, HF], [4, 0, L]]) {
      if (!(cv.cuts & bit) || KEY[axis] <= 0.02) continue;
      const t = (at - (axis === 0 ? x : axis === 1 ? y : z)) / KEY[axis];
      const vx = x + KEY[0] * t - cv.c[0], vy = y + KEY[1] * t - cv.c[1], vz = z + KEY[2] * t - cv.c[2];
      const rho = Math.hypot(vx, vy, vz) || 1e-6;
      lit = Math.max(lit, 1 - sstep(-9, 4, rho - reach(cv, vx / rho, vy / rho, vz / rho)));
    }
    return lit;
  };
  // A hollow's tone: bright where the open air and the light reach (its rim, the part of its wall the key light finds
  // through the opening), deeper and rosier further in and under its roof; each sac a little its own tint.
  const SHADE = night ? [0.9, 0.86, 0.88] : [0.8, 0.7, 0.73];
  const bowlColor = (cv, x, y, z, nz) => {
    let depth = 1e9;
    if (cv.cuts & 1) depth = Math.min(depth, D - y);
    if (cv.cuts & 2) depth = Math.min(depth, HF - z);
    if (cv.cuts & 4) depth = Math.min(depth, L - x);
    let c = mix3(mix3(C.lip, C.deep, sstep(0, 26, depth)), C.pit, 0.85 * sstep(20, 58, depth));
    c = mix3(c, cv.tint > 0 ? C.warm : C.cool, 0.2 * Math.abs(cv.tint));
    const lit = litOf(cv, x, y, z);
    const k2 = 1 + (nz > 0 ? 0.08 * nz : 0.12 * nz) * sstep(2, 20, depth);
    return [c[0] * k2 * (SHADE[0] + (1 - SHADE[0]) * lit), c[1] * k2 * (SHADE[1] + (1 - SHADE[1]) * lit), c[2] * k2 * (SHADE[2] + (1 - SHADE[2]) * lit)];
  };
  const BW = mk();
  {
    const e = LIP * 0.8;
    const lim = [[0, 1, 0], [1, 1, 0], [2, 1, 0], [0, -1, L - e], [1, -1, D - e], [2, -1, HF - e]]; // axis, sign, bound
    const inside = (p, pl) => (pl[1] > 0 ? p[pl[0]] >= pl[2] : p[pl[0]] <= pl[2]);
    for (const cv of cavities) {
      if (!cv.cuts) continue;
      const BALL = cv.ball;
      const n = BALL.v.length;
      const pts = cv.pts;
      const nrm = new Float32Array(n * 3);
      for (const [a, b, c] of BALL.f) {
        const ux = pts[b * 3] - pts[a * 3], uy = pts[b * 3 + 1] - pts[a * 3 + 1], uz = pts[b * 3 + 2] - pts[a * 3 + 2];
        const vx = pts[c * 3] - pts[a * 3], vy = pts[c * 3 + 1] - pts[a * 3 + 1], vz = pts[c * 3 + 2] - pts[a * 3 + 2];
        const nx = uy * vz - uz * vy, ny = uz * vx - ux * vz, nz = ux * vy - uy * vx;
        for (const q of [a, b, c]) (nrm[q * 3] += nx), (nrm[q * 3 + 1] += ny), (nrm[q * 3 + 2] += nz);
      }
      const code = new Uint8Array(n);
      for (let q = 0; q < n; q++) {
        const l = -(Math.hypot(nrm[q * 3], nrm[q * 3 + 1], nrm[q * 3 + 2]) || 1); // inward: we look at the inside
        (nrm[q * 3] /= l), (nrm[q * 3 + 1] /= l), (nrm[q * 3 + 2] /= l);
        const p = [pts[q * 3], pts[q * 3 + 1], pts[q * 3 + 2]];
        let m = 0;
        lim.forEach((pl, w) => {
          if (!inside(p, pl)) m |= 1 << w;
        });
        code[q] = m;
      }
      const map = new Int32Array(n).fill(-1);
      const use = (q) => {
        if (map[q] < 0) map[q] = vtx(BW, pts[q * 3], pts[q * 3 + 1], pts[q * 3 + 2], nrm[q * 3], nrm[q * 3 + 1], nrm[q * 3 + 2], bowlColor(cv, pts[q * 3], pts[q * 3 + 1], pts[q * 3 + 2], nrm[q * 3 + 2]));
        return map[q];
      };
      for (const [a, b, c] of BALL.f) {
        if (code[a] & code[b] & code[c]) continue; // wholly outside one side
        if (!(code[a] | code[b] | code[c])) {
          BW.idx.push(use(a), use(b), use(c));
          continue;
        }
        let poly = [a, b, c].map((q) => [pts[q * 3], pts[q * 3 + 1], pts[q * 3 + 2], nrm[q * 3], nrm[q * 3 + 1], nrm[q * 3 + 2]]);
        for (const pl of lim) {
          const next = [];
          for (let q = 0; q < poly.length; q++) {
            const A = poly[q];
            const B2 = poly[(q + 1) % poly.length];
            const ia = inside(A, pl);
            const ib = inside(B2, pl);
            if (ia) next.push(A);
            if (ia !== ib) {
              const t = (pl[2] - A[pl[0]]) / (B2[pl[0]] - A[pl[0]]);
              next.push(A.map((v, w) => v + (B2[w] - v) * t));
            }
          }
          poly = next;
          if (poly.length < 3) break;
        }
        if (poly.length < 3) continue;
        const ids = poly.map((p) => vtx(BW, p[0], p[1], p[2], p[3], p[4], p[5], bowlColor(cv, p[0], p[1], p[2], p[5])));
        for (let q = 1; q < ids.length - 1; q++) BW.idx.push(ids[0], ids[q], ids[q + 1]);
      }
    }
  }

  // ---------------------------------------------------------------- the cut faces (marching squares on the same field)
  /**
   * A face on a grid: pos(i, j) in world units, V ≥ 0 where there is tissue, Hh the distance to the nearest opening
   * (whose edge rolls back), tint(a, b, t, h) the colour at a grid point (b < 0) or between two (a → b at t).
   */
  function marchFace(B, { nu, nv, pos, V, Hh, N, tint }) {
    const W1 = nu + 1;
    const NV = W1 * (nv + 1);
    const PX = new Float32Array(NV * 3);
    const GR = new Float32Array(NV * 3);
    const tmp = [0, 0, 0];
    for (let j = 0; j <= nv; j++)
      for (let i = 0; i <= nu; i++) {
        pos(i, j, tmp);
        PX.set(tmp, (j * W1 + i) * 3);
      }
    for (let j = 0; j <= nv; j++)
      for (let i = 0; i <= nu; i++) {
        const id = j * W1 + i;
        if (Hh[id] > LW + HGRID * 2) continue;
        let gx = 0, gy = 0, gz = 0;
        for (const [a, b] of [[j * W1 + Math.max(0, i - 1), j * W1 + Math.min(nu, i + 1)], [Math.max(0, j - 1) * W1 + i, Math.min(nv, j + 1) * W1 + i]]) {
          const ex = PX[b * 3] - PX[a * 3], ey = PX[b * 3 + 1] - PX[a * 3 + 1], ez = PX[b * 3 + 2] - PX[a * 3 + 2];
          const l2 = ex * ex + ey * ey + ez * ez;
          if (l2 < 1e-9) continue;
          const g = (Math.min(Hh[b], 9) - Math.min(Hh[a], 9)) / l2;
          (gx += ex * g), (gy += ey * g), (gz += ez * g);
        }
        GR[id * 3] = gx;
        GR[id * 3 + 1] = gy;
        GR[id * 3 + 2] = gz;
      }
    const emit = (x, y, z, h, gx, gy, gz, c) => {
      const w = h < LW ? 1 - Math.max(0, h) / LW : 0;
      const push = LIP * w * w;
      const slope = (2 * LIP * w) / LW;
      const gl = Math.hypot(gx, gy, gz) || 1;
      let nx = N[0] - (slope * gx) / gl, ny = N[1] - (slope * gy) / gl, nz = N[2] - (slope * gz) / gl;
      const nl = Math.hypot(nx, ny, nz);
      return vtx(B, x - N[0] * push, y - N[1] * push, z - N[2] * push, nx / nl, ny / nl, nz / nl, c);
    };
    const corner = new Int32Array(NV).fill(-1);
    const eh = new Int32Array(nu * (nv + 1)).fill(-1);
    const ev = new Int32Array(W1 * nv).fill(-1);
    const cornerOf = (id) => {
      if (corner[id] < 0) corner[id] = emit(PX[id * 3], PX[id * 3 + 1], PX[id * 3 + 2], Hh[id], GR[id * 3], GR[id * 3 + 1], GR[id * 3 + 2], tint(id, -1, 0, Hh[id]));
      return corner[id];
    };
    const cross = (store, key, a, b) => {
      if (store[key] < 0) {
        const t = V[a] / (V[a] - V[b]);
        const m = (q) => PX[a * 3 + q] + (PX[b * 3 + q] - PX[a * 3 + q]) * t;
        const g = (q) => GR[a * 3 + q] + (GR[b * 3 + q] - GR[a * 3 + q]) * t;
        const h = Math.max(0, Math.min(Hh[a], 9) + (Math.min(Hh[b], 9) - Math.min(Hh[a], 9)) * t);
        store[key] = emit(m(0), m(1), m(2), h, g(0), g(1), g(2), tint(a, b, t, h));
      }
      return store[key];
    };
    const poly = [];
    for (let j = 0; j < nv; j++)
      for (let i = 0; i < nu; i++) {
        const a = j * W1 + i, b = a + 1, c = b + W1, d = a + W1;
        const ia = V[a] >= 0, ib = V[b] >= 0, ic = V[c] >= 0, id = V[d] >= 0;
        if (!(ia || ib || ic || id)) continue;
        if (ia && ib && ic && id) {
          const qa = cornerOf(a), qb = cornerOf(b), qc = cornerOf(c), qd = cornerOf(d);
          B.idx.push(qa, qb, qc, qa, qc, qd);
          continue;
        }
        const eab = () => cross(eh, j * nu + i, a, b);
        const ebc = () => cross(ev, j * W1 + i + 1, b, c);
        const edc = () => cross(eh, (j + 1) * nu + i, d, c);
        const ead = () => cross(ev, j * W1 + i, a, d);
        const split = ia === ic && ib === id && ia !== ib && V[a] + V[b] + V[c] + V[d] < 0;
        if (split) {
          if (ia) B.idx.push(cornerOf(a), eab(), ead(), cornerOf(c), edc(), ebc());
          else B.idx.push(cornerOf(b), ebc(), eab(), cornerOf(d), ead(), edc());
          continue;
        }
        poly.length = 0;
        if (ia) poly.push(cornerOf(a));
        if (ia !== ib) poly.push(eab());
        if (ib) poly.push(cornerOf(b));
        if (ib !== ic) poly.push(ebc());
        if (ic) poly.push(cornerOf(c));
        if (ic !== id) poly.push(edc());
        if (id) poly.push(cornerOf(d));
        if (id !== ia) poly.push(ead());
        for (let q = 1; q < poly.length - 1; q++) B.idx.push(poly[0], poly[q], poly[q + 1]);
      }
  }
  /** The hollows' part of a flat face's field. axis: the face's normal axis, at: its position; ia, ib: the grid's axes. */
  function cavityField(V, Hh, nu, nv, axis, at, ia, ib) {
    const W1 = nu + 1;
    const p = [0, 0, 0];
    p[axis] = at;
    for (const cv of cavities) {
      const off = Math.abs(cv.c[axis] - at);
      if (off >= cv.tmax) continue;
      // a hollow that only dips a little way under this face would be a shallow dish: leave the face closed over it
      let low = 1e9;
      for (let q = axis; q < cv.pts.length; q += 3) if (cv.pts[q] < low) low = cv.pts[q];
      if (at - low < 12) continue;
      const rr = Math.sqrt(cv.tmax * cv.tmax - off * off) + 1;
      const iA = Math.max(0, Math.floor((cv.c[ia] - rr) / HGRID)), iB = Math.min(nu, Math.ceil((cv.c[ia] + rr) / HGRID));
      const jA = Math.max(0, Math.floor((cv.c[ib] - rr) / HGRID)), jB = Math.min(nv, Math.ceil((cv.c[ib] + rr) / HGRID));
      if (iB < iA || jB < jA) continue;
      const hits = [];
      const gw = iB - iA + 1;
      let mask = new Uint8Array(gw * (jB - jA + 1));
      let open = 0;
      for (let j = jA; j <= jB; j++)
        for (let i = iA; i <= iB; i++) {
          p[ia] = i * HGRID;
          p[ib] = j * HGRID;
          const vx = p[0] - cv.c[0], vy = p[1] - cv.c[1], vz = p[2] - cv.c[2];
          const rho = Math.hypot(vx, vy, vz);
          if (rho > cv.tmax + 2) continue;
          const val = rho < 1e-6 ? -cv.tmax : rho - reach(cv, vx / rho, vy / rho, vz / rho) + OVER;
          if (val < 0) {
            open++;
            mask[(j - jA) * gw + (i - iA)] = 1;
          }
          hits.push(j * W1 + i, val);
        }
      // a small or a slit-like opening stays closed (the drawing drops small sections too): no pin-holes or slits in a
      // face. Slit-like: nothing is left of it after wearing its edge back by about 4 units. (The packing above leaves very few of these.)
      if (open * HGRID * HGRID < 110) continue;
      for (let step = Math.ceil(4 / HGRID); step > 0 && open > 0; step--) {
        const next = new Uint8Array(mask.length);
        open = 0;
        for (let j = 1; j < jB - jA; j++)
          for (let i = 1; i < gw - 1; i++) {
            const q = j * gw + i;
            if (mask[q] && mask[q - 1] && mask[q + 1] && mask[q - gw] && mask[q + gw]) {
              next[q] = 1;
              open++;
            }
          }
        mask = next;
      }
      if (!open) continue;
      for (let q = 0; q < hits.length; q += 2) {
        const id = hits[q];
        const val = hits[q + 1];
        if (val < V[id]) V[id] = val;
        if (val < Hh[id]) Hh[id] = val;
      }
    }
  }
  const FACE = mk();
  const grain = (id) => 0.965 + 0.07 * (((id * 2654435761) >>> 0) / 4294967296);
  const faceTint = (Hh, sheath) => (a, b, t, h) => {
    const g = b < 0 ? grain(a) : grain(a) + (grain(b) - grain(a)) * t;
    let c = C.tissue;
    if (sheath) {
      const s = b < 0 ? sheath[a] : sheath[a] + (sheath[b] - sheath[a]) * t;
      if (s > 0) c = mix3(c, C.sheath, s);
    }
    const w = clamp(1 - h / 2.4, 0, 1);
    c = mix3(c, C.rim, 0.5 * w * w);
    return [c[0] * g, c[1] * g, c[2] * g];
  };
  const RSEAM = R + RING; // inside this radius the front face is the sac's own wall, meshed on a polar grid below
  let frontField = null;
  {
    // front face: i along x, j along z
    const nu = Math.round(L / HGRID), nv = Math.round(HF / HGRID), W1 = nu + 1;
    const V = new Float32Array(W1 * (nv + 1)).fill(99);
    const Hh = new Float32Array(W1 * (nv + 1)).fill(99);
    const sheath = new Float32Array(W1 * (nv + 1));
    cavityField(V, Hh, nu, nv, 1, D, 0, 2);
    const Vc = V.slice();
    for (let j = 0; j <= nv; j++)
      for (let i = 0; i <= nu; i++) {
        const id = j * W1 + i;
        const x = i * HGRID, z = j * HGRID;
        const rho = Math.hypot(x - CX, z - CZ);
        V[id] = Math.min(V[id], rho - RSEAM);
        if (z - CZ > Z_MOUTH) {
          const v = Math.abs(x - CX) - profR(z - CZ);
          if (v < V[id]) V[id] = v;
          if (v < Hh[id]) Hh[id] = v;
        }
        if (z > pathBox[0] - 30 && z < pathBox[1] + 30) {
          const [d, u] = nearPath(x, z);
          const v = d - lumR[u];
          if (v < V[id]) V[id] = v;
          if (v < Hh[id]) Hh[id] = v;
          if (shR[u] > 0) sheath[id] = 1 - sstep(shR[u] - 1.5, shR[u] + 1.5, d);
        }
      }
    marchFace(FACE, { nu, nv, V, Hh, N: [0, 1, 0], tint: faceTint(Hh, sheath), pos: (i, j, o) => ((o[0] = i * HGRID), (o[1] = D), (o[2] = j * HGRID)) });
    frontField = { nu, nv, V, Vc };
  }
  let topField = null;
  {
    // top face: i along x, j along y
    const nu = Math.round(L / HGRID), nv = Math.round(D / HGRID), W1 = nu + 1;
    const V = new Float32Array(W1 * (nv + 1)).fill(99);
    const Hh = new Float32Array(W1 * (nv + 1)).fill(99);
    cavityField(V, Hh, nu, nv, 2, HF, 0, 1);
    const Vc = V.slice();
    const rTop = profR(HF - CZ);
    for (let j = 0; j <= nv; j++)
      for (let i = 0; i <= nu; i++) {
        const id = j * W1 + i;
        const v = Math.hypot(i * HGRID - CX, j * HGRID - D) - rTop;
        if (v < V[id]) V[id] = v;
        if (v < Hh[id]) Hh[id] = v;
      }
    marchFace(FACE, { nu, nv, V, Hh, N: [0, 0, 1], tint: faceTint(Hh, null), pos: (i, j, o) => ((o[0] = i * HGRID), (o[1] = j * HGRID), (o[2] = HF)) });
    topField = { nu, nv, V, Vc };
  }
  // where the venule leaves through the right end
  let uEnd = NP - 1;
  for (let u = i1; u < NP; u++)
    if (PW[u][0] >= L) {
      uEnd = u;
      break;
    }
  let uStart = 0;
  for (let u = i0; u >= 0; u--)
    if (PW[u][0] <= 0) {
      uStart = u;
      break;
    }
  let endField = null;
  {
    // right end: i along y, j along z
    const nu = Math.round(D / HGRID), nv = Math.round(HF / HGRID), W1 = nu + 1;
    const V = new Float32Array(W1 * (nv + 1)).fill(99);
    const Hh = new Float32Array(W1 * (nv + 1)).fill(99);
    cavityField(V, Hh, nu, nv, 0, L, 1, 2);
    const Vc = V.slice();
    for (let j = 0; j <= nv; j++)
      for (let i = 0; i <= nu; i++) {
        const id = j * W1 + i;
        const v = Math.hypot(i * HGRID - D, j * HGRID - PW[uEnd][1]) - lumR[uEnd];
        if (v < V[id]) V[id] = v;
        if (v < Hh[id]) Hh[id] = v;
      }
    marchFace(FACE, { nu, nv, V, Hh, N: [1, 0, 0], tint: faceTint(Hh, null), pos: (i, j, o) => ((o[0] = L), (o[1] = i * HGRID), (o[2] = j * HGRID)) });
    endField = { nu, nv, V, Vc };
  }
  {
    // the sac's own wall on the front face, on a polar grid: its rows fall on the sac's rim and on the capillary's two
    // edges, so the thin wall between blood and air is exact
    const rows = [R, RHO - VS.cap / 2, R + 4, R + 6.5, R + 9, R + 11.5, RHO + VS.cap / 2, RSEAM, RSEAM + 1.6];
    const nu = 360, nv = rows.length - 1, W1 = nu + 1;
    const V = new Float32Array(W1 * (nv + 1)).fill(99);
    const Hh = new Float32Array(W1 * (nv + 1)).fill(99);
    const sheath = new Float32Array(W1 * (nv + 1));
    for (let j = 0; j <= nv; j++)
      for (let i = 0; i <= nu; i++) {
        const id = j * W1 + i;
        const al = (i - 180) * RAD;
        const x = CX + rows[j] * Math.cos(al), z = CZ + rows[j] * Math.sin(al);
        let v = rows[j] - R;
        const [d, u] = nearPath(x, z);
        // on the capillary itself the rows are its edges exactly
        const onArc = u > i0 && u < i1;
        v = Math.min(v, onArc ? Math.abs(rows[j] - RHO) - lumR[u] : d - lumR[u]);
        if (shR[u] > 0) sheath[id] = 1 - sstep(shR[u] - 1.5, shR[u] + 1.5, d);
        if (z - CZ > Z_MOUTH) v = Math.min(v, Math.abs(x - CX) - profR(z - CZ));
        V[id] = Hh[id] = Math.abs(v) < 1e-4 ? 0 : v;
      }
    marchFace(FACE, {
      nu, nv, V, Hh, N: [0, 1, 0], tint: faceTint(Hh, sheath),
      pos: (i, j, o) => {
        const al = (i - 180) * RAD;
        o[0] = CX + rows[j] * Math.cos(al);
        o[1] = j === nv ? D - 0.2 : D;
        o[2] = CZ + rows[j] * Math.sin(al);
      },
    });
  }
  {
    // the three sides nobody sees: plain walls, there for the shadow
    const quad = (pts, n) => {
      const ids = pts.map((p) => vtx(FACE, p[0], p[1], p[2], n[0], n[1], n[2], C.tissue));
      FACE.idx.push(ids[0], ids[1], ids[2], ids[0], ids[2], ids[3]);
    };
    quad([[0, 0, 0], [0, D, 0], [0, D, HF], [0, 0, HF]], [-1, 0, 0]);
    quad([[0, 0, 0], [L, 0, 0], [L, 0, HF], [0, 0, HF]], [0, -1, 0]);
    quad([[0, 0, 0], [L, 0, 0], [L, D, 0], [0, D, 0]], [0, 0, -1]);
  }
  // and their inner sides, so that nothing could ever show the page through the block. A mesh of their own, kept out of
  // the occlusion pass: that pass does not see the hollows, and would draw these walls' corners through the openings.
  const LINER = mk();
  {
    const quad = (pts, n) => {
      const ids = pts.map((p) => vtx(LINER, p[0], p[1], p[2], n[0], n[1], n[2], C.deep));
      LINER.idx.push(ids[0], ids[1], ids[2], ids[0], ids[2], ids[3]);
    };
    const e = 0.3;
    quad([[e, 0, 0], [e, D, 0], [e, D, HF], [e, 0, HF]], [1, 0, 0]);
    quad([[0, e, 0], [L, e, 0], [L, e, HF], [0, e, HF]], [0, 1, 0]);
    quad([[0, 0, e], [L, 0, e], [L, D, e], [0, D, e]], [0, 0, 1]);
  }

  // ---------------------------------------------------------------- the sac's bowl and the duct (inside faces)
  const NLAM = coarse ? 36 : 56;
  const SAC = mk();
  SAC.uv = [];
  {
    const np = PROF.length;
    const zS = PROF[LD_MOUTH + 90][1];
    const nrmOf = (q) => {
      const A = PROF[Math.max(0, q - 1)];
      const B2 = PROF[Math.min(np - 1, q + 1)];
      const dr = B2[0] - A[0], dz = B2[1] - A[1];
      const l = Math.hypot(dr, dz) || 1;
      return [-dz / l, dr / l]; // toward the axis
    };
    const cols = NLAM + 3; // a flange, the half turn, a flange
    for (let q = 0; q <= np; q++) {
      const top = q === np; // the top flange, just under the top face
      const [r, z, v] = PROF[Math.min(q, np - 1)];
      const [nr, nz] = nrmOf(Math.min(q, np - 1));
      const w = sstep(zS - 4, zS + 10, z);
      for (let m = 0; m < cols; m++) {
        const flange = m === 0 || m === cols - 1;
        const lam = (-90 + (180 * clamp(m - 1, 0, NLAM)) / NLAM) * RAD;
        const rr = r + (flange || top ? 2.2 : 0);
        const edge = m === 1 || m === NLAM + 1;
        const y = flange ? D - LIP - 0.3 : edge ? D - LIP : D - Math.max(LIP, rr * Math.cos(lam));
        const zz = CZ + z - (top ? 0.3 : 0);
        // less of the open air reaches the back of the bowl, its roof, and the depth of the duct: deeper there
        const back = (D - y) / R;
        const kb = clamp(0.62 * back + 0.5 * back * sstep(-R, R, z) , 0, 1);
        const kd = clamp(0.35 + ((D - y) / DUCT_R) * 0.45 + sstep(zTop, zTop - 70, z) * 0.3, 0, 1);
        const c = mix3(mix3(C.bowl, C.bowlDeep, kb), mix3(C.duct, C.ductDeep, kd), w);
        if (flange) vtx(SAC, CX + rr * Math.sin(lam), y, zz, 0, 1, 0, c);
        else if (top) vtx(SAC, CX + rr * Math.sin(lam), y, zz, 0, 0, 1, c);
        else vtx(SAC, CX + rr * Math.sin(lam), y, zz, nr * Math.sin(lam), -nr * Math.cos(lam), nz, c);
        SAC.uv.push(clamp(m - 1, 0, NLAM) / NLAM, v);
      }
    }
    for (let q = 0; q < np; q++)
      for (let m = 0; m < cols - 1; m++) {
        const a = q * cols + m;
        SAC.idx.push(a, a + 1, a + cols + 1, a, a + cols + 1, a + cols);
      }
  }

  // ---------------------------------------------------------------- the vessels: one open gutter along the path
  const GUT = mk();
  {
    const SEG = coarse ? 8 : 12;
    const stations = [];
    for (let u = uStart; u <= uEnd; u++) if (u === uStart || u === uEnd || (u >= i0 && u <= i1) || u % 2 === 0) stations.push(u);
    const venC = C.venTube, artC = C.artTube, plC = C.plasma;
    let prev = -1;
    const rings = [];
    for (const u of stations) {
      const A = PW[Math.max(0, u - 1)];
      const B2 = PW[Math.min(NP - 1, u + 1)];
      let tx = B2[0] - A[0], tz = B2[1] - A[1];
      const tl = Math.hypot(tx, tz) || 1;
      tx /= tl;
      tz /= tl;
      let px = PW[u][0];
      const pz = PW[u][1];
      // the two ends stop a hair inside the block
      if (u === uStart) px = Math.max(px, 0.02);
      if (u === uEnd) px = Math.min(px, L - LIP);
      const r = lumR[u];
      const c = u <= i0 ? mix3(venC, plC, sstep(i0 - 22, i0 - 2, u)) : u >= i1 ? mix3(plC, artC, sstep(i1 + 2, i1 + 22, u)) : plC;
      const ring = [];
      // across the gutter: flange, rim, the half round, rim, flange (n = in-plane normal of the path)
      const nx = -tz, nz = tx;
      for (let m = -1; m <= SEG + 1; m++) {
        const flange = m < 0 || m > SEG;
        const ph = (Math.PI * clamp(m, 0, SEG)) / SEG;
        const off = (flange ? r + 2 : r) * Math.cos(ph);
        const y = flange ? D - LIP - 0.35 : D - LIP - (r - LIP) * Math.sin(ph);
        if (flange) ring.push(vtx(GUT, px + nx * off, y, pz + nz * off, 0, 1, 0, c));
        else ring.push(vtx(GUT, px + nx * off, y, pz + nz * off, -nx * Math.cos(ph), Math.sin(ph), -nz * Math.cos(ph), c));
      }
      if (prev >= 0) {
        const last = rings[rings.length - 1];
        for (let m = 0; m < ring.length - 1; m++) GUT.idx.push(last[m], last[m + 1], ring[m + 1], last[m], ring[m + 1], ring[m]);
      }
      rings.push(ring);
      prev = u;
    }
    // the arteriole's cut end at the block's unseen left side: closed, so nothing shows through
    const first = rings[0];
    const u = uStart;
    const mid = vtx(GUT, 0.02, D - LIP, PW[u][1], 1, 0, 0, mix3(venC, lin(PAL.ven), 0.4));
    const cap = first.slice(1, -1).map((id) => vtx(GUT, GUT.pos[id * 3], GUT.pos[id * 3 + 1], GUT.pos[id * 3 + 2], 1, 0, 0, mix3(venC, lin(PAL.ven), 0.4)));
    for (let m = 0; m < cap.length - 1; m++) GUT.idx.push(mid, cap[m], cap[m + 1]);
  }

  // ---------------------------------------------------------------- materials
  const phys = (o) => new T.MeshPhysicalMaterial({ metalness: 0, ...o });
  const tissueMat = phys({ color: 0xffffff, vertexColors: true, roughness: 0.78, sheen: 0.25, sheenRoughness: 0.6, sheenColor: night ? 0x7a4040 : 0xffdcd6, clearcoat: 0.06, clearcoatRoughness: 0.5 });
  const hollowMat = phys({ color: 0xffffff, vertexColors: true, roughness: night ? 0.72 : 0.6, sheen: 0.3, sheenRoughness: 0.5, sheenColor: night ? 0x8a4a4a : 0xffeceb, clearcoat: night ? 0.08 : 0.25, clearcoatRoughness: 0.4 });
  const sacMat = phys({ color: 0xffffff, vertexColors: true, roughness: 0.4, sheen: 0.5, sheenRoughness: 0.4, sheenColor: night ? 0x9a5a5a : 0xfff3ee, clearcoat: night ? 0.35 : 0.55, clearcoatRoughness: 0.34 });
  const gutMat = phys({ color: 0xffffff, vertexColors: true, roughness: 0.3, clearcoat: 0.6, clearcoatRoughness: 0.2 });
  if (!coarse) {
    // cut tissue is not one flat tone: a soft mottle, and a scatter of small darker specks (cell nuclei), in the block's
    // own space so it holds still on the faces as the block breathes
    tissueMat.onBeforeCompile = (sh) => {
      sh.vertexShader = sh.vertexShader.replace("#include <common>", "#include <common>\nvarying vec3 vA5;").replace("#include <begin_vertex>", "#include <begin_vertex>\nvA5 = position;");
      sh.fragmentShader = sh.fragmentShader
        .replace(
          "#include <common>",
          `#include <common>
          varying vec3 vA5;
          float a5n(vec3 p){ return fract(sin(dot(p, vec3(127.1, 311.7, 74.7))) * 43758.5453); }
          float a5v(vec3 x){
            vec3 i = floor(x); vec3 f = fract(x); f = f * f * (3.0 - 2.0 * f);
            return mix(mix(mix(a5n(i), a5n(i + vec3(1, 0, 0)), f.x), mix(a5n(i + vec3(0, 1, 0)), a5n(i + vec3(1, 1, 0)), f.x), f.y),
                       mix(mix(a5n(i + vec3(0, 0, 1)), a5n(i + vec3(1, 0, 1)), f.x), mix(a5n(i + vec3(0, 1, 1)), a5n(i + vec3(1, 1, 1)), f.x), f.y), f.z);
          }`,
        )
        .replace(
          "#include <color_fragment>",
          `#include <color_fragment>
          {
            float m = 0.6 * a5v(vA5 * 0.045) + 0.4 * a5v(vA5 * 0.16 + 7.3);
            diffuseColor.rgb *= 0.94 + 0.12 * m;
            vec3 q = vA5 * 0.21; vec3 c = floor(q); vec3 o = vec3(a5n(c), a5n(c + 3.1), a5n(c + 6.7));
            float d = length(fract(q) - 0.25 - 0.5 * o);
            float w = fwidth(d);
            diffuseColor.rgb *= 1.0 - ${night ? "0.16" : "0.1"} * step(0.62, a5n(c + 9.2)) * (1.0 - smoothstep(0.1 - w, 0.16 + w, d)) / (1.0 + 6.0 * w);
          }`,
        );
    };
    // every air sac's wall is a mesh of capillaries: a faint net on the hollows (the walls of a 3-D cell pattern, where
    // they meet the surface). Desktop only; it fades out by itself where it would be finer than a pixel.
    hollowMat.onBeforeCompile = (sh) => {
      sh.uniforms.uWeb = { value: new T.Color(PAL.web) };
      sh.vertexShader = sh.vertexShader.replace("#include <common>", "#include <common>\nvarying vec3 vA5;").replace("#include <begin_vertex>", "#include <begin_vertex>\nvA5 = position;");
      sh.fragmentShader = sh.fragmentShader
        .replace(
          "#include <common>",
          `#include <common>
          varying vec3 vA5;
          uniform vec3 uWeb;
          vec3 a5h(vec3 p){ p = vec3(dot(p, vec3(127.1, 311.7, 74.7)), dot(p, vec3(269.5, 183.3, 246.1)), dot(p, vec3(113.5, 271.9, 124.6))); return fract(sin(p) * 43758.5453); }
          float a5web(vec3 x){
            x *= 0.075;
            vec3 n = floor(x); vec3 f = fract(x);
            float d1 = 8.0; float d2 = 8.0;
            for (int k = -1; k <= 1; k++) for (int j = -1; j <= 1; j++) for (int i = -1; i <= 1; i++) {
              vec3 g = vec3(float(i), float(j), float(k));
              vec3 r = g + a5h(n + g) - f;
              float d = dot(r, r);
              if (d < d1) { d2 = d1; d1 = d; } else if (d < d2) { d2 = d; }
            }
            float e = sqrt(d2) - sqrt(d1);
            float w = fwidth(e);
            return (1.0 - smoothstep(0.035 - w, 0.1 + w, e)) / (1.0 + 14.0 * w);
          }`,
        )
        .replace("#include <color_fragment>", `#include <color_fragment>\ndiffuseColor.rgb = mix(diffuseColor.rgb, uWeb, ${night ? "0.24" : "0.42"} * a5web(vA5));`);
    };
  }
  // the bowl's lining: a pavement of thin flat cells, drawn once to a small canvas and laid on by longitude and latitude
  {
    const cw = coarse ? 512 : 1024, ch = cw / 2;
    const cv = document.createElement("canvas");
    cv.width = cw;
    cv.height = ch;
    const g = cv.getContext("2d");
    g.fillStyle = "#fff";
    g.fillRect(0, 0, cw, ch);
    g.lineJoin = "round";
    const NF = 150;
    const cells2 = [];
    for (let i = 0; i < NF; i++) {
      const y = 1 - (2 * (i + 0.5)) / NF;
      const Ld = Math.asin(y) / RAD;
      const lam = ((i * 137.508) % 180) - 90;
      if (Ld > 64 || Math.abs(lam) > 84) continue;
      const o = [Math.cos(Ld * RAD) * Math.sin(lam * RAD), -Math.cos(Ld * RAD) * Math.cos(lam * RAD), Math.sin(Ld * RAD)];
      const e = [Math.cos(lam * RAD), Math.sin(lam * RAD), 0];
      const n = [-Math.sin(Ld * RAD) * Math.sin(lam * RAD), Math.sin(Ld * RAD) * Math.cos(lam * RAD), Math.cos(Ld * RAD)];
      const pts = [];
      for (let q = 0; q < 7; q++) {
        const a = (q / 7) * 2 * Math.PI + rnd() * 0.5;
        const m = (13.5 * (0.82 + rnd() * 0.3)) / R;
        const d = [0, 1, 2].map((w) => o[w] + e[w] * Math.cos(a) * m + n[w] * Math.sin(a) * m);
        const dl = Math.hypot(d[0], d[1], d[2]);
        pts.push([((Math.atan2(d[0], -d[1]) / RAD + 90) / 180) * cw, (1 - (Math.asin(d[2] / dl) / RAD + 90) / 180) * ch]);
      }
      cells2.push(pts);
    }
    for (const [width, alpha] of night ? [[6, 0.05], [3, 0.1], [1.6, 0.2]] : [[7, 0.035], [4, 0.06], [1.8, 0.17]]) {
      g.strokeStyle = PAL.pave;
      g.globalAlpha = alpha;
      g.lineWidth = (width * cw) / 1024;
      for (const pts of cells2) {
        g.beginPath();
        const np2 = pts.length;
        const mid = (a, b) => [(a[0] + b[0]) / 2, (a[1] + b[1]) / 2];
        const m0 = mid(pts[np2 - 1], pts[0]);
        g.moveTo(m0[0], m0[1]);
        for (let q = 0; q < np2; q++) {
          const m1 = mid(pts[q], pts[(q + 1) % np2]);
          g.quadraticCurveTo(pts[q][0], pts[q][1], m1[0], m1[1]);
        }
        g.closePath();
        g.stroke();
      }
    }
    const tex = new T.CanvasTexture(cv);
    tex.colorSpace = T.SRGBColorSpace;
    tex.anisotropy = 4;
    sacMat.map = tex;
    sacMat.bumpMap = tex;
    sacMat.bumpScale = 0.5;
    sacMat.userData.tex = tex;
  }

  const block = new T.Group(); // everything that breathes
  ctx.root.add(block);
  // a soft fill from the front right, low: the end face and the inside of the sac stay rose, not brown
  const fill = new T.PointLight(night ? 0xffd9cf : 0xfff1ee, night ? 0.5 : 0.75, 0, 0);
  fill.position.set(L + 500, D + 700, HF * 0.35);
  ctx.root.add(fill);
  const solid = (geo, mat, cast = true) => {
    const m = new T.Mesh(geo, mat);
    m.castShadow = cast;
    m.receiveShadow = true;
    block.add(m);
    return m;
  };
  solid(finish(FACE), tissueMat);
  ctx.ghost(solid(finish(LINER), tissueMat, false));
  // the hollows stay out of the occlusion pass (in the narrow wedge under an opening's rolled edge it reads as soot);
  // their depth is in their own tone, the key light's shadow and the net on their walls
  hollowMat.shadowSide = T.DoubleSide; // a hollow's roof stops the light as well as its floor: light enters by the opening only
  const hollows = solid(finish(BW), hollowMat);
  ctx.ghost(hollows);
  hollows.castShadow = true;
  solid(finish(SAC), sacMat);
  solid(finish(GUT), gutMat);

  // ---------------------------------------------------------------- the capillary net on the bowl: tubes, coloured by a ramp
  const onBowl = (Ld, lam, r) => [CX + r * Math.cos(Ld * RAD) * Math.sin(lam * RAD), D - r * Math.cos(Ld * RAD) * Math.cos(lam * RAD), CZ + r * Math.sin(Ld * RAD)];
  const ramp = new T.DataTexture(new Uint8Array([...new T.Color(PAL.ven).convertLinearToSRGB().toArray().map((v) => Math.round(v * 255)), 255, ...new T.Color(PAL.art).convertLinearToSRGB().toArray().map((v) => Math.round(v * 255)), 255]), 2, 1, T.RGBAFormat, T.UnsignedByteType);
  ramp.colorSpace = T.SRGBColorSpace;
  ramp.magFilter = ramp.minFilter = T.LinearFilter;
  ramp.wrapS = ramp.wrapT = T.ClampToEdgeWrapping;
  ramp.needsUpdate = true;
  {
    const NET = mk();
    NET.uv = [];
    const RT = 1.9;
    const RADIAL = coarse ? 5 : 7;
    const tube = (pts) => {
      const curve = new T.CatmullRomCurve3(pts.map((p) => new T.Vector3(p[0], p[1], p[2])), false, "centripetal", 0.5);
      const g = new T.TubeGeometry(curve, Math.max(4, Math.round((pts.length - 1) * (coarse ? 1 : 1.5))), RT, RADIAL, false);
      const p = g.attributes.position, nn = g.attributes.normal;
      const base = NET.n;
      for (let q = 0; q < p.count; q++) {
        vtx(NET, p.getX(q), p.getY(q), p.getZ(q), nn.getX(q), nn.getY(q), nn.getZ(q), [1, 1, 1]);
        NET.uv.push((screenX(p.getX(q), p.getY(q)) - G.net.x0) / (G.net.x1 - G.net.x0), 0.5);
      }
      const ix = g.index.array;
      for (let q = 0; q < ix.length; q++) NET.idx.push(base + ix[q]);
      g.dispose();
    };
    const { lats, lons } = G.net;
    const RN = R - 0.5;
    for (const Ld of lats) {
      const s = [];
      for (let lam = -87; lam <= 87; lam += 3) s.push(onBowl(Ld + 2.2 * Math.sin((lam * 5 + Ld * 7) * RAD), lam, RN));
      tube(s);
    }
    for (let i = 0; i < lats.length - 1; i++)
      lons.forEach((lam, j) => {
        if ((i + j) % 2) return;
        const s = [];
        for (let q = 0; q <= 10; q++) s.push(onBowl(lats[i] + ((lats[i + 1] - lats[i]) * q) / 10, lam + 3 * Math.sin((q / 10) * 2 * Math.PI + i + j), RN));
        tube(s);
      });
    const g = finish(NET);
    g.deleteAttribute("color");
    solid(g, phys({ color: 0xffffff, map: ramp, roughness: 0.34, clearcoat: 0.7, clearcoatRoughness: 0.18 }));
  }

  // ---------------------------------------------------------------- small fixed parts (instances)
  const unit = new T.SphereGeometry(1, coarse ? 10 : 14, coarse ? 7 : 10);
  const M4 = new T.Matrix4();
  const colr = new T.Color();
  const unitLow = new T.SphereGeometry(1, coarse ? 7 : 9, coarse ? 4 : 5);
  const placed = (count, mat, geo = unit) => {
    const m = new T.InstancedMesh(geo, mat, count);
    m.castShadow = false;
    m.receiveShadow = true;
    m.frustumCulled = false;
    block.add(m);
    let n = 0;
    m.put = (o, ax, ay, az, hex) => {
      // o: centre; ax, ay, az: the ellipsoid's three half-axes as vectors (kept right-handed, so its faces stay outward)
      const det = ax[0] * (ay[1] * az[2] - ay[2] * az[1]) - ax[1] * (ay[0] * az[2] - ay[2] * az[0]) + ax[2] * (ay[0] * az[1] - ay[1] * az[0]);
      if (det < 0) az = [-az[0], -az[1], -az[2]];
      M4.set(ax[0], ay[0], az[0], o[0], ax[1], ay[1], az[1], o[1], ax[2], ay[2], az[2], o[2], 0, 0, 0, 1);
      m.setMatrixAt(n, M4);
      m.setColorAt(n, colr.set(hex));
      n++;
    };
    m.done = () => {
      m.count = n;
      m.instanceMatrix.needsUpdate = true;
      if (m.instanceColor) m.instanceColor.needsUpdate = true;
    };
    return m;
  };
  const scl = (v, s) => [v[0] * s, v[1] * s, v[2] * s];
  const bitMat = phys({ color: 0xffffff, roughness: 0.4, clearcoat: 0.5, clearcoatRoughness: 0.25 });
  {
    // capillaries cut across in the walls of the three faces: a red cell in each (one in four darker, venous), spaced
    // along each wall's middle line (where the distance to the two hollows it parts is greatest), never two in one spot
    const GAP = 15;
    const spots = [];
    const each = (F, ex, ey, n) => {
      const W1 = F.nu + 1;
      const found = [];
      for (let j = 1; j < F.nv; j++)
        for (let i = 1; i < F.nu; i++) {
          const id = j * W1 + i;
          const v = F.Vc[id];
          if (v < 2.2 || v > 8 || F.V[id] < 2.2) continue;
          const a = F.Vc[id - 1], b = F.Vc[id + 1], c = F.Vc[id - W1], d = F.Vc[id + W1];
          if (!((v >= a && v >= b && a < 90 && b < 90) || (v >= c && v >= d && c < 90 && d < 90))) continue;
          found.push([((id * 2654435761) >>> 0) / 4294967296, i * HGRID, j * HGRID]);
        }
      found.sort((p, q) => p[0] - q[0]);
      const kept = [];
      for (const f of found) {
        if (kept.some((k) => Math.abs(k[1] - f[1]) < GAP && Math.abs(k[2] - f[2]) < GAP && Math.hypot(k[1] - f[1], k[2] - f[2]) < GAP)) continue;
        kept.push(f);
        const o = [0, 0, 0];
        for (let w = 0; w < 3; w++) o[w] = ex[w] * f[1] + ey[w] * f[2] + n[w] * (n[3] + 0.1);
        spots.push([o, ex, ey, n]);
      }
    };
    each(frontField, [1, 0, 0], [0, 0, 1], [0, 1, 0, D]);
    each(topField, [1, 0, 0], [0, 1, 0], [0, 0, 1, HF]);
    each(endField, [0, 1, 0], [0, 0, 1], [1, 0, 0, L]);
    const beads = placed(spots.length, bitMat, unitLow);
    spots.forEach(([o, ex, ey, n], q) => {
      const r = 1.95 + ((q * 7) % 5) * 0.09;
      beads.put(o, scl(ex, r), scl(ey, r), scl(n, r * 0.36), q % 4 === 1 ? PAL.capV : PAL.capA);
    });
    beads.done();
  }
  {
    const bits = placed(64, bitMat);
    // smooth-muscle knobs of the duct's entrance rings, cut across on the front and on the top
    for (const sy of G.duct.knobs)
      for (const s of [-1, 1]) bits.put([CX + s * (DUCT_R + 4.5), D + 0.1, G.YB - sy], [3.4, 0, 0], [0, 0, 2.4], [0, 1.3, 0], PAL.knob);
    for (const a of G.duct.topKnobs) {
      const ca = Math.cos(a * RAD), sa = Math.sin(a * RAD);
      bits.put([CX + (DUCT_R + 4.5) * ca, D + (DUCT_R + 4.5) * sa, HF + 0.1], [-sa * 3.4, ca * 3.4, 0], [ca * 2.4, sa * 2.4, 0], [0, 0, 1.3], PAL.knob);
    }
    // flattened lining nuclei in the sac's wall
    for (const th of G.rimNuc) {
      const c = Math.cos(th * RAD), s = Math.sin(th * RAD);
      bits.put([CX + (R + 2.9) * c, D - 0.35, CZ - (R + 2.9) * s], [-s * 6.2, 0, -c * 6.2], [c * 1.8, 0, -s * 1.8], [0, 1.2, 0], PAL.knob);
    }
    // two pores to the neighbouring sacs, and the surfactant cell on the bowl with its granules
    const frame = (Ld, lam) => {
      const o = onBowl(Ld, lam, R);
      const e = [Math.cos(lam * RAD), Math.sin(lam * RAD), 0];
      const n = [-Math.sin(Ld * RAD) * Math.sin(lam * RAD), Math.sin(Ld * RAD) * Math.cos(lam * RAD), Math.cos(Ld * RAD)];
      const inw = [(CX - o[0]) / R, (D - o[1]) / R, (CZ - o[2]) / R];
      return { o, e, n, inw };
    };
    for (const [Ld, lam] of G.pores) {
      const f = frame(Ld, lam);
      bits.put(f.o, scl(f.e, 4.4), scl(f.n, 3.6), scl(f.inw, 0.7), PAL.pore);
    }
    {
      const f = frame(G.t2b.at[0], G.t2b.at[1]);
      bits.put(f.o, scl(f.e, 10), scl(f.n, 8.5), scl(f.inw, 5.2), PAL.t2);
      for (const [a, b] of G.t2b.gran) {
        const h = 5.2 * Math.sqrt(Math.max(0.05, 1 - (a / 10) ** 2 - (b / 8.5) ** 2));
        const o = [0, 1, 2].map((w) => f.o[w] + f.e[w] * a + f.n[w] * b + f.inw[w] * h);
        bits.put(o, scl(f.e, 1.35), scl(f.n, 1.35), scl(f.inw, 0.9), PAL.gran);
      }
    }
    // the surfactant cell in the wall, bulging into the sac: cut by the front face, granules on the cut
    {
      const th = G.t2.th * RAD;
      const o = [CX + (R - 3) * Math.cos(th), D - 5, CZ - (R - 3) * Math.sin(th)];
      bits.put(o, [10.2, 0, 0], [0, 0, 9.6], [0, 6.3, 0], PAL.t2);
      for (const [a, b] of G.t2.gran) bits.put([o[0] + a, o[1] + 6.3 * Math.sqrt(Math.max(0.05, 1 - (a / 10.2) ** 2 - (b / 9.6) ** 2)), o[2] - b], [1.45, 0, 0], [0, 0, 1.45], [0, 0.8, 0], PAL.gran);
    }
    bits.done();
    // the macrophage on the bowl: a lobed cell, a little see-through, its nucleus inside
    {
      const f = frame(G.mac.at[0], G.mac.at[1]);
      const body = G.mac.body;
      const nb = body.length;
      const radOf = (al) => {
        // the drawn outline, as a radius by angle (smooth between its points)
        const u = (((al / (2 * Math.PI)) % 1) + 1) % 1 * nb;
        const q = Math.floor(u), t = u - q;
        const r = (w) => Math.hypot(body[(q + w + nb) % nb][0], body[(q + w + nb) % nb][1]);
        const p0 = r(-1), p1 = r(0), p2 = r(1), p3 = r(2);
        return 0.5 * (2 * p1 + (-p0 + p2) * t + (2 * p0 - 5 * p1 + 4 * p2 - p3) * t * t + (-p0 + 3 * p1 - 3 * p2 + p3) * t * t * t);
      };
      const MB = mk();
      const NA = coarse ? 28 : 44, NS = coarse ? 5 : 8;
      const HM = 6.4;
      for (let q = 0; q <= NS; q++) {
        const s = q / NS;
        for (let m = 0; m < NA; m++) {
          const al = (m / NA) * 2 * Math.PI;
          const rr = radOf(al) * s;
          const a = Math.cos(al) * rr, b = Math.sin(al) * rr;
          const sag = R - Math.sqrt(Math.max(0, R * R - a * a - b * b));
          const h = sag + HM * Math.pow(1 - s * s, 0.55) * (0.55 + 0.45 * Math.min(1, radOf(al) / 14)) - 0.4;
          vtx(MB, f.o[0] + f.e[0] * a + f.n[0] * b + f.inw[0] * h, f.o[1] + f.e[1] * a + f.n[1] * b + f.inw[1] * h, f.o[2] + f.e[2] * a + f.n[2] * b + f.inw[2] * h, 0, 0, 0, C.mac);
        }
      }
      for (let q = 0; q < NS; q++)
        for (let m = 0; m < NA; m++) {
          const a = q * NA + m, b = q * NA + ((m + 1) % NA);
          MB.idx.push(a, b, b + NA, a, b + NA, a + NA);
        }
      autoNormals(MB, () => f.inw);
      const m = new T.Mesh(finish(MB), phys({ color: 0xffffff, vertexColors: true, roughness: 0.28, clearcoat: 0.8, clearcoatRoughness: 0.15, transparent: true, opacity: night ? 0.9 : 0.88, depthWrite: false }));
      m.renderOrder = 3;
      m.receiveShadow = true;
      block.add(ctx.ghost(m));
      const nuc = placed(1, bitMat);
      const o = [0, 1, 2].map((w) => f.o[w] + f.e[w] * 0.4 + f.n[w] * 0.3 + f.inw[w] * 4.2);
      nuc.put(o, scl(f.e, 5), scl(f.n, 3.3), scl(f.inw, 2.6), PAL.macNuc);
      nuc.done();
    }
  }

  // ---------------------------------------------------------------- the movers
  // a red cell: the biconcave disc (Evans and Fung's profile), a little darker in its dimple as the drawing has it
  const RC = 6.0;
  const cellGeo = (() => {
    const B = mk();
    const NR = coarse ? 12 : 18, NPF = coarse ? 5 : 7;
    const half = (x) => 0.5 * Math.sqrt(Math.max(0, 1 - x * x)) * (0.81 + 7.83 * x * x - 4.39 * x ** 4) * (RC / 3.91);
    const prof = [];
    for (let q = 0; q <= NPF; q++) {
      const x = Math.sin((Math.PI / 2) * (q / NPF));
      prof.push([x * RC, -half(x), x]);
    }
    for (let q = NPF - 1; q >= 0; q--) {
      const x = Math.sin((Math.PI / 2) * (q / NPF));
      prof.push([x * RC, half(x), x]);
    }
    for (let q = 0; q < prof.length; q++)
      for (let m = 0; m < NR; m++) {
        const a = (m / NR) * 2 * Math.PI;
        const k2 = 0.6 + 0.4 * sstep(0.25, 0.8, prof[q][2]);
        vtx(B, prof[q][0] * Math.cos(a), prof[q][1], prof[q][0] * Math.sin(a), 0, 0, 0, [k2, k2, k2]);
      }
    for (let q = 0; q < prof.length - 1; q++)
      for (let m = 0; m < NR; m++) {
        const a = q * NR + m, b = q * NR + ((m + 1) % NR);
        B.idx.push(a, b, b + NR, a, b + NR, a + NR);
      }
    autoNormals(B, (x, y, z) => [x * 0.15, y, z * 0.15]);
    return finish(B);
  })();
  const MAXC = 72;
  const cells = new T.InstancedMesh(cellGeo, phys({ color: 0xffffff, vertexColors: true, roughness: 0.36, clearcoat: 0.65, clearcoatRoughness: 0.2, sheen: 0.3, sheenRoughness: 0.5, sheenColor: 0xffd0c8 }), MAXC);
  cells.instanceMatrix.setUsage(T.DynamicDrawUsage);
  cells.castShadow = true;
  cells.receiveShadow = true;
  cells.frustumCulled = false;
  cells.setColorAt(0, colr.set(0xffffff));
  cells.count = 0;
  ctx.ghost(cells); // out of the occlusion pass: around small bright things in a pale gutter it reads as soot
  cells.castShadow = true;
  block.add(cells);

  const dotGeo = new T.IcosahedronGeometry(1, coarse ? 1 : 2);
  const dots = (max, hex, o = {}) => {
    const see = o.opacity !== undefined && o.opacity < 1;
    const mat = new T.MeshStandardMaterial({ color: hex, roughness: 0.35, emissive: hex, emissiveIntensity: o.glow ?? 0, transparent: see, opacity: o.opacity ?? 1, depthWrite: !see });
    const m = new T.InstancedMesh(dotGeo, mat, max);
    m.instanceMatrix.setUsage(T.DynamicDrawUsage);
    m.castShadow = false;
    m.receiveShadow = !see;
    m.frustumCulled = false;
    m.count = 0;
    if (see) m.renderOrder = 4;
    ctx.ghost(m);
    block.add(m);
    return m;
  };
  const o2 = dots(80, PAL.o2, { glow: night ? 0.55 : 0.3 });
  const co2 = [0.85, 0.5, 0.22].map((op) => dots(96, PAL.co2, { opacity: op }));
  const ductAir = dots(24, PAL.o2, { opacity: 0.6, glow: night ? 0.5 : 0.25 });

  /** A gas dot keeps its place on screen and takes its depth along the line of sight, as far as the air goes there. */
  function airDepth(sx, sy, f) {
    const qx = sx - G.C[0];
    const qz = G.C[1] - sy;
    const rho2 = qx * qx + qz * qz;
    if (rho2 < (R - 3) * (R - 3)) {
      const b = qx * DV[0] + qz * DV[2];
      const lam = b + Math.sqrt(b * b + R * R - rho2);
      return 3 + f * Math.max(0, lam - 12) * 0.82;
    }
    if (qz > 0 && Math.abs(qx) < DUCT_R - 3) {
      const h2 = DV[0] * DV[0] + DV[1] * DV[1];
      const rd = DUCT_R - 4;
      const lam = (qx * DV[0] + Math.sqrt(Math.max(0, qx * qx * DV[0] * DV[0] + h2 * (rd * rd - qx * qx)))) / h2;
      return 3 + f * Math.max(0, lam - 6) * 0.8;
    }
    return -3;
  }
  const place = (m, n, sx, sy, lam, r) => {
    M4.makeScale(r, r, r).setPosition(sx - G.X0 - lam * DV[0], D - lam * DV[1], G.YB - sy - lam * DV[2]);
    m.setMatrixAt(n, M4);
  };

  if (opt.debug) {
    let tris = 0, calls = 0;
    block.traverse((o) => {
      if (!o.isMesh) return;
      calls++;
      const g = o.geometry;
      tris += ((g.index ? g.index.count : g.attributes.position.count) / 3) * (o.isInstancedMesh ? o.instanceMatrix.count : 1);
      console.warn("a5", o.isInstancedMesh ? "inst" : "mesh", Math.round((g.index ? g.index.count : g.attributes.position.count) / 3), o.isInstancedMesh ? o.instanceMatrix.count : "");
    });
    const by = [1, 2, 4].map((bit) => cavities.filter((cv) => cv.cuts & bit).length);
    const deep = cavities.filter((cv) => cv.cuts).map((cv) => {
      let low = 1e9;
      const axis = cv.cuts & 1 ? 1 : cv.cuts & 2 ? 2 : 0;
      for (let q = axis; q < cv.pts.length; q += 3) low = Math.min(low, cv.pts[q]);
      return (axis === 1 ? D : axis === 2 ? HF : L) - low;
    });
    console.warn("a5 total", calls, "meshes", Math.round(tris), "triangles (instances at capacity)", cavities.length, "hollows: front/top/end", by.join("/"), "depth", Math.round(Math.min(...deep)), "to", Math.round(Math.max(...deep)));
  }
  const centre = [L / 2, D / 2, HF / 2];
  const vT = new T.Vector3(), vA = new T.Vector3(), vB = new T.Vector3();
  return {
    update(st) {
      // the breath: the whole block swells about its centre
      const s = st.s;
      block.scale.setScalar(s);
      block.position.set(centre[0] * (1 - s), centre[1] * (1 - s), centre[2] * (1 - s));
      // the net turns red where the traced capillary does
      const span = Math.max(0.02, st.netB - st.netA);
      ramp.repeat.set(0.5 / span, 1);
      ramp.offset.set(0.25 - (st.netA * 0.5) / span, 0);
      // red cells
      const n = Math.min(MAXC, st.nCells);
      for (let q = 0; q < n; q++) {
        const o = q * 6;
        const sx = st.cells[o], sy = st.cells[o + 1], ang = st.cells[o + 2] * RAD, sf = st.cells[o + 3], t = st.cells[o + 4], id = st.cells[o + 5];
        // along the path (section y runs down), lying in the gutter, each tipped its own way
        vT.set(Math.cos(ang), 0, -Math.sin(ang));
        const w1 = Math.sin(id * 12.9898) * 0.5, w2 = Math.sin(id * 78.233 + 1.3) * 0.5;
        vA.set(-vT.z * (0.3 + 0.4 * w1) + vT.x * 0.4 * w2, 1, vT.x * (0.3 + 0.4 * w1) + vT.z * 0.4 * w2).normalize();
        vT.addScaledVector(vA, -vT.dot(vA)).normalize();
        vB.crossVectors(vT, vA);
        const lam = 1.6;
        // a cell is in the picture between the block's two ends (the drawing clips it there)
        const wx = sx - G.X0;
        const k3 = Math.max(1e-3, sstep(3, 11, wx) * sstep(L - 3 - LIP, L - 11 - LIP, wx));
        vT.multiplyScalar(k3 * sf);
        vA.multiplyScalar(k3);
        vB.multiplyScalar(k3);
        M4.set(vT.x, vA.x, vB.x, wx - lam * DV[0], vT.y, vA.y, vB.y, D - lam * DV[1], vT.z, vA.z, vB.z, G.YB - sy - lam * DV[2], 0, 0, 0, 1);
        cells.setMatrixAt(q, M4);
        cells.setColorAt(q, colr.setRGB((opt.ven[0] + (opt.art[0] - opt.ven[0]) * t) / 255, (opt.ven[1] + (opt.art[1] - opt.ven[1]) * t) / 255, (opt.ven[2] + (opt.art[2] - opt.ven[2]) * t) / 255, T.SRGBColorSpace));
      }
      cells.count = n;
      cells.instanceMatrix.needsUpdate = true;
      cells.instanceColor.needsUpdate = true;
      // oxygen: the air's dots, and the ones on their way into a cell
      let k2 = 0;
      for (let q = 0; q < st.nAir && k2 < 80; q++) {
        const o = q * 3;
        place(o2, k2++, st.air[o], st.air[o + 1], airDepth(st.air[o], st.air[o + 1], st.air[o + 2]), 3);
      }
      for (let q = 0; q < st.nFly && k2 < 80; q++) {
        const o = q * 3;
        place(o2, k2++, st.fly[o], st.fly[o + 1], airDepth(st.fly[o], st.fly[o + 1], st.fly[o + 2]), 3);
      }
      o2.count = k2;
      o2.instanceMatrix.needsUpdate = true;
      // carbon dioxide, fading in three steps as it drifts off
      const nb = [0, 0, 0];
      for (let q = 0; q < st.nCo2; q++) {
        const o = q * 4;
        const b = st.co2[o + 2] | 0;
        if (nb[b] < 96) place(co2[b], nb[b]++, st.co2[o], st.co2[o + 1], airDepth(st.co2[o], st.co2[o + 1], st.co2[o + 3]), 2.6);
      }
      co2.forEach((m, b) => {
        m.count = nb[b];
        m.instanceMatrix.needsUpdate = true;
      });
      // the breath's air in the duct
      const nd = Math.min(24, st.nDuct);
      for (let q = 0; q < nd; q++) place(ductAir, q, st.duct[q * 2], st.duct[q * 2 + 1], airDepth(st.duct[q * 2], st.duct[q * 2 + 1], ((q * 7) % 10) / 10), 2.6);
      ductAir.count = nd;
      ductAir.instanceMatrix.needsUpdate = true;
    },
    dispose() {
      ramp.dispose();
      sacMat.userData.tex.dispose();
    },
  };
}
