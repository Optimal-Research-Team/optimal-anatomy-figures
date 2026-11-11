// A7 · the kneecap's load: the figure's own 3-D scene for the shared layer (shared/gl3, "a figure with its own
// 3-D scene"). build.mjs inlines this file; live.js hands a7Scene to gl3Attach as `build` and pushes the stride's
// state into `update` every frame.
//
// The leg cut in half lengthwise, as a sculpted model: the far half keeps its round skin (a real half-tube swept
// round the same chords the drawing uses), the thigh is cut straight across the top, and the cut face carries the
// section in low relief. Every piece is the drawing's own outline (same control points, same Catmull-Rom), raised
// a few units off the soft tissue with a rounded edge, in the drawing's own paint order (what was painted later
// stands a little higher): muscle, bone with its spongy cut face and marrow canal, cartilage as a wet bead on all
// three bones, the menisci, both cruciates and the hamstring tendon as cords, the fat pad, the quadriceps and
// patellar tendons as fibrous bands, and the kneecap on top.
//
// World = the kit's own: x = section x, y = toward the viewer, z = up (−section y). Nothing here sets a pose: the
// tibia's swing, the kneecap's glide, the tendons, fat pad, ligaments, calf, skin and the glow under the kneecap all
// come from the state live.js computed for the SVG (bendAt, pfAt, the fixed-length patellar tendon).
function a7Scene(ctx, DATA) {
  const T = ctx.THREE;
  const { root, ghost, night, coarse } = ctx;
  const G = DATA.geo;
  const CF = DATA.CF;
  const RC = DATA.RC;
  const RAD = Math.PI / 180;
  const RP = RC + 20; // kneecap centre's distance from the condyle centre (as live.js)
  const Y0 = G.dep; // the soft tissue's cut face: the drawing's own plane
  // A piece raised h toward the viewer is slid this far across the cut face, so its face still lands exactly where
  // the drawing has it in this (fixed) camera: the picture keeps every outline and joint line of the reviewed
  // drawing, and the relief shows as walls and shadow on the sides the camera and the light see.
  const SLIDE = [1 / Math.tan(DATA.P.azimuth * RAD), -Math.tan(DATA.P.elevation * RAD) / Math.sin(DATA.P.azimuth * RAD)];
  const YC = G.topc.y; // the thigh's cut across the top (section y)
  const RES = coarse ? 4.5 : 3; // outline sampling (section units)
  const PPU = coarse ? 2.5 : 4; // painted faces: texture pixels per section unit
  const junk = [];
  const own = (x) => (junk.push(x), x);

  // ---------------------------------------------------------------- palette (the drawing's own colours, as surfaces)
  const C = {
    skin: "#eec6b1", dermis: "#d09a86", soft: "#f5e0cf",
    muscle: "#d98c86", muscleLine: "#a04c46", fascia: "#f0c6be",
    bone: "#f7eeda", boneWarm: "#ead6aa", pore: "#c9976a", marrow: "#f5dd9f", marrowEdge: "#b98a45",
    cart: "#a4cff2", men: "#7fb2dc",
    lig: "#dcc05c", fat: "#f2d56c", tendon: "#f9f2e3", fibre: "#9a8456",
    glow: night ? "#ffb347" : "#f08a14", cut: "#b04a3c",
    capFat: "#f6deaa", art: "#c9483a", vein: "#5f66b4", nerve: "#d9b24a",
  };
  // heights above the soft tissue's cut face, in the drawing's paint order
  const HT = { ham: 4.0, quad: 4.0, gastro: 4.6, calf: 5.2, hamt: 3.6, tibia: 9.0, femur: 9.8, tcart: 10.6, men: 10.9, fcart: 11.3, lig: 10.4, fat: 11.5, glow: 11.9, tendon: 12.4, pcart: 12.8, pat: 13.2 };

  // ---------------------------------------------------------------- outlines
  /** The drawing's smooth(): Catmull-Rom through the points as cubic Béziers, sampled. `steps` fixes the count per span. */
  function crSample(points, closed, k, steps = 0) {
    const n = points.length;
    const at = (i) => points[closed ? (i + n) % n : Math.max(0, Math.min(n - 1, i))];
    const out = [];
    for (let i = 0; i < (closed ? n : n - 1); i++) {
      const p0 = at(i - 1), p1 = at(i), p2 = at(i + 1), p3 = at(i + 2);
      const c1x = p1[0] + ((p2[0] - p0[0]) / 6) * k, c1y = p1[1] + ((p2[1] - p0[1]) / 6) * k;
      const c2x = p2[0] - ((p3[0] - p1[0]) / 6) * k, c2y = p2[1] - ((p3[1] - p1[1]) / 6) * k;
      const m = steps || Math.max(1, Math.ceil(Math.hypot(p2[0] - p1[0], p2[1] - p1[1]) / RES));
      for (let s = 0; s < m; s++) {
        const t = s / m, u = 1 - t;
        out.push([u * u * u * p1[0] + 3 * u * u * t * c1x + 3 * u * t * t * c2x + t * t * t * p2[0], u * u * u * p1[1] + 3 * u * u * t * c1y + 3 * u * t * t * c2y + t * t * t * p2[1]]);
      }
    }
    if (!closed) out.push([points[n - 1][0], points[n - 1][1]]);
    return out;
  }
  /** Keep the part of an outline below the thigh's cut (section y ≥ yc). */
  function clipTop(poly, yc) {
    const out = [];
    for (let i = 0; i < poly.length; i++) {
      const a = poly[i], b = poly[(i + 1) % poly.length];
      const ia = a[1] >= yc, ib = b[1] >= yc;
      if (ia) out.push(a);
      if (ia !== ib) {
        const t = (yc - a[1]) / (b[1] - a[1]);
        out.push([a[0] + (b[0] - a[0]) * t, yc]);
      }
    }
    return out.filter((p, i, a) => {
      const q = a[(i + a.length - 1) % a.length];
      return Math.hypot(p[0] - q[0], p[1] - q[1]) > 1e-4;
    });
  }
  const onCut = (p) => Math.abs(p[1] - YC) < 1e-6;
  const quadPts = (a, c, b, n) => {
    const out = [];
    for (let i = 0; i <= n; i++) {
      const t = i / n, u = 1 - t;
      out.push([u * u * a[0] + 2 * u * t * c[0] + t * t * b[0], u * u * a[1] + 2 * u * t * c[1] + t * t * b[1]]);
    }
    return out;
  };
  /** A stroked line as an outline (round or butt ends). */
  function strokePoly(pts, w, round = true) {
    const L = [], R = [];
    const tan = (i) => {
      const u = pts[Math.max(0, i - 1)], v = pts[Math.min(pts.length - 1, i + 1)];
      const l = Math.hypot(v[0] - u[0], v[1] - u[1]) || 1;
      return [(v[0] - u[0]) / l, (v[1] - u[1]) / l];
    };
    pts.forEach((p, i) => {
      const t = tan(i);
      L.push([p[0] - t[1] * w / 2, p[1] + t[0] * w / 2]);
      R.push([p[0] + t[1] * w / 2, p[1] - t[0] * w / 2]);
    });
    const cap = (p, t, sign) => {
      const out = [];
      if (!round) return out;
      for (let q = 1; q < 6; q++) {
        const a = (q / 6) * Math.PI;
        out.push([p[0] + (w / 2) * sign * (Math.cos(a) * -t[1] + Math.sin(a) * t[0]), p[1] + (w / 2) * sign * (Math.cos(a) * t[0] + Math.sin(a) * t[1])]);
      }
      return out;
    };
    const e = pts.length - 1;
    return [...L, ...cap(pts[e], tan(e), 1), ...R.reverse(), ...cap(pts[0], tan(0), -1)];
  }
  const boxOf = (poly, pad = 0) => {
    let x0 = 1e9, y0 = 1e9, x1 = -1e9, y1 = -1e9;
    for (const p of poly) {
      x0 = Math.min(x0, p[0]); y0 = Math.min(y0, p[1]); x1 = Math.max(x1, p[0]); y1 = Math.max(y1, p[1]);
    }
    return [x0 - pad, y0 - pad, x1 - x0 + 2 * pad, y1 - y0 + 2 * pad];
  };
  const inside = (poly, x, y) => {
    let c = false;
    for (let i = 0, j = poly.length - 1; i < poly.length; j = i++) {
      const a = poly[i], b = poly[j];
      if (a[1] > y !== b[1] > y && x < ((b[0] - a[0]) * (y - a[1])) / (b[1] - a[1]) + a[0]) c = !c;
    }
    return c;
  };
  const edgeDist = (poly, x, y) => {
    let d = 1e9;
    for (let i = 0, j = poly.length - 1; i < poly.length; j = i++) {
      const a = poly[j], b = poly[i];
      const vx = b[0] - a[0], vy = b[1] - a[1];
      const t = Math.max(0, Math.min(1, ((x - a[0]) * vx + (y - a[1]) * vy) / (vx * vx + vy * vy || 1)));
      d = Math.min(d, Math.hypot(x - a[0] - vx * t, y - a[1] - vy * t));
    }
    return d;
  };
  const rngOf = (seed) => () => ((seed = (seed * 16807) % 2147483647) - 1) / 2147483646;

  // ---------------------------------------------------------------- geometry builders (fixed topology; update() rewrites the buffers)
  const up = (attr) => (attr.needsUpdate = true);
  const noCull = (mesh) => ((mesh.frustumCulled = false), mesh);
  /**
   * A flat piece in relief: the outline as a wall, a quarter-round edge, and a flat lid facing the viewer.
   * relief(N, { H, b, base, box | tile }).update(poly, sharp?) — poly: N points [section x, section y].
   * `sharp(p)` marks points on the thigh's cut: their edge rounds only sideways, so the piece ends square there.
   * `hole` (an outline inside the piece) is cut through the lid with its own wall down to `floor`: a marrow canal.
   */
  function relief(N, o) {
    const n = o.arc ?? 3;
    const rings = n + 2; // the wall's foot, then the quarter round (n + 1 rings, the first is the wall's top)
    const E0 = N * (rings + 1); // + the lid's own ring, whose normals face straight out of the cut
    const HV = E0 + (o.cut ? rings * 4 : 0); // + the piece's square ends on the thigh's cut, facing up (two at most)
    const NH = o.hole ? o.hole.length : 0;
    const V = HV + NH * 3; // + the hole's wall (top and foot) and its own ring on the lid
    const pos = new Float32Array(V * 3), nor = new Float32Array(V * 3), uv = new Float32Array(V * 2);
    const idx = new Uint16Array(N * (rings - 1) * 6 + (N - 2 + (NH ? NH + 2 : 0)) * 3 + NH * 6);
    const wall0 = idx.length - NH * 6;
    const hflat = Array.from({ length: NH }, () => new T.Vector2());
    let w = 0;
    for (let j = 0; j < rings - 1; j++)
      for (let i = 0; i < N; i++) {
        const a = j * N + i, b = j * N + ((i + 1) % N), c = (j + 1) * N + ((i + 1) % N), d = (j + 1) * N + i;
        idx[w++] = a; idx[w++] = b; idx[w++] = d; idx[w++] = b; idx[w++] = c; idx[w++] = d;
      }
    const lid0 = w, lidV = rings * N;
    const geo = own(new T.BufferGeometry());
    geo.setAttribute("position", new T.BufferAttribute(pos, 3));
    geo.setAttribute("normal", new T.BufferAttribute(nor, 3));
    geo.setAttribute("uv", new T.BufferAttribute(uv, 2));
    geo.setIndex(new T.BufferAttribute(idx, 1));
    const flat = Array.from({ length: N }, () => new T.Vector2());
    const px = new Float32Array(N), py = new Float32Array(N), nx = new Float32Array(N), ny = new Float32Array(N), mi = new Float32Array(N);
    const H = o.H, base = o.base ?? -0.6, b0 = Math.min(o.b, H - base);
    const ox = o.pivot || o.slid ? 0 : SLIDE[0] * H, oy = o.pivot || o.slid ? 0 : SLIDE[1] * H;
    const ux = o.slid ? SLIDE[0] * H : 0, uy = o.slid ? SLIDE[1] * H : 0;
    function update(poly, sharp) {
      let area = 0, around = 0;
      for (let i = 0; i < N; i++) {
        const a = poly[i], c = poly[(i + 1) % N];
        area += a[0] * c[1] - c[0] * a[1];
        around += Math.hypot(c[0] - a[0], c[1] - a[1]);
      }
      const rev = area < 0; // read it counter-clockwise either way
      // a piece that thins out (the fat pad in a deep bend) rounds its edge less: area / perimeter is its half-width
      const b = o.adapt ? Math.min(b0, (0.7 * Math.abs(area)) / 2 / (around || 1)) : b0;
      for (let i = 0; i < N; i++) {
        const p = poly[rev ? N - 1 - i : i];
        px[i] = p[0]; py[i] = p[1];
      }
      for (let i = 0; i < N; i++) {
        const h = (i + N - 1) % N, j = (i + 1) % N;
        let ax = py[i] - py[h], ay = -(px[i] - px[h]), bx = py[j] - py[i], by = -(px[j] - px[i]);
        const la = Math.hypot(ax, ay) || 1, lb = Math.hypot(bx, by) || 1;
        ax /= la; ay /= la; bx /= lb; by /= lb;
        if (sharp && sharp([px[i], py[i]])) {
          // on the thigh's cut: round over sideways only (use the side wall's normal, laid along the cut)
          const sx = Math.abs(ay) < Math.abs(by) ? ax : bx;
          nx[i] = sx < 0 ? -1 : 1; ny[i] = 0; mi[i] = 1;
          continue;
        }
        let sx = ax + bx, sy = ay + by;
        const l = Math.hypot(sx, sy) || 1;
        sx /= l; sy /= l;
        nx[i] = sx; ny[i] = sy;
        mi[i] = 1 / Math.max(0.55, Math.sqrt(Math.max(0, (1 + ax * bx + ay * by) / 2)));
      }
      if (o.inset)
        for (let i = 0; i < N; i++) {
          px[i] -= nx[i] * o.inset * mi[i];
          py[i] -= ny[i] * o.inset * mi[i];
        }
      const put = (v, x, y, h, a, c, e) => {
        pos[v * 3] = x + ox; pos[v * 3 + 1] = Y0 + h; pos[v * 3 + 2] = -(y + oy);
        nor[v * 3] = a; nor[v * 3 + 1] = c; nor[v * 3 + 2] = e;
        if (o.box) { uv[v * 2] = (x - ux - o.box[0]) / o.box[2]; uv[v * 2 + 1] = (y - uy - o.box[1]) / o.box[3]; }
        else { const s = o.tile || 0.05; uv[v * 2] = (x - (o.at ? o.at[0] : 0)) * s; uv[v * 2 + 1] = (y - (o.at ? o.at[1] : 0)) * s; }
      };
      for (let i = 0; i < N; i++) {
        put(i, px[i], py[i], base, nx[i], 0, -ny[i]);
        for (let s = 0; s <= n; s++) {
          const t = (s / n) * (Math.PI / 2);
          const ins = b * (1 - Math.cos(t)) * mi[i];
          const x = px[i] - nx[i] * ins, y = py[i] - ny[i] * ins;
          const h = H - b + b * Math.sin(t);
          put((s + 1) * N + i, x, y, h, nx[i] * Math.cos(t), Math.sin(t), -ny[i] * Math.cos(t));
          if (s === n) {
            put(lidV + i, x, y, h, 0, 1, 0);
            flat[i].set(x, y);
          }
        }
      }
      if (NH) {
        // the hole: its wall faces into it, from the lid down to the floor
        const hp = o.hole;
        let ha = 0;
        for (let i = 0; i < NH; i++) ha += hp[i][0] * hp[(i + 1) % NH][1] - hp[(i + 1) % NH][0] * hp[i][1];
        const at = (i) => hp[ha < 0 ? NH - 1 - i : i];
        for (let i = 0; i < NH; i++) {
          const p0 = at((i + NH - 1) % NH), p1 = at(i), p2 = at((i + 1) % NH);
          let ex = p2[1] - p0[1], ey = -(p2[0] - p0[0]);
          const l = Math.hypot(ex, ey) || 1;
          ex /= l; ey /= l;
          put(HV + i, p1[0], p1[1], H, -ex, 0, ey);
          put(HV + NH + i, p1[0], p1[1], o.floor, -ex, 0, ey);
          put(HV + 2 * NH + i, p1[0], p1[1], H, 0, 1, 0);
          hflat[i].set(p1[0], p1[1]);
          const j = (i + 1) % NH, a = HV + NH + i, c2 = HV + NH + j, c = HV + j, d = HV + i, k = wall0 + i * 6;
          idx[k] = a; idx[k + 1] = d; idx[k + 2] = c2; idx[k + 3] = c2; idx[k + 4] = d; idx[k + 5] = c;
        }
      }
      const tris = T.ShapeUtils.triangulateShape(flat.slice(), NH ? [hflat.slice()] : []);
      const lidAt = (i) => (i < N ? flat[i] : hflat[i - N]);
      const lidIx = (i) => (i < N ? lidV + i : HV + 2 * NH + i - N);
      let q = lid0;
      for (const t of tris) {
        if (q + 3 > wall0) break;
        const A = lidAt(t[0]), B = lidAt(t[1]), Cc = lidAt(t[2]);
        const ccw = (B.x - A.x) * (Cc.y - A.y) - (Cc.x - A.x) * (B.y - A.y) > 0;
        idx[q++] = lidIx(t[0]); idx[q++] = lidIx(ccw ? t[1] : t[2]); idx[q++] = lidIx(ccw ? t[2] : t[1]);
      }
      while (q < wall0) idx[q++] = lidV;
      if (o.cut && sharp) {
        // the edge that lies on the thigh's cut: its wall is the piece's own cross-section, flat and facing up
        let ends = 0;
        for (let i = 0; i < N && ends < 2; i++) {
          const j = (i + 1) % N;
          if (!sharp([px[i], py[i]]) || !sharp([px[j], py[j]])) continue;
          const F0 = E0 + ends * rings * 2;
          ends++;
          for (let r = 0; r < rings; r++)
            for (const [e, src] of [[F0 + r * 2, r * N + i], [F0 + r * 2 + 1, r * N + j]]) {
              pos.copyWithin(e * 3, src * 3, src * 3 + 3);
              uv.copyWithin(e * 2, src * 2, src * 2 + 2);
              nor[e * 3] = 0; nor[e * 3 + 1] = 0; nor[e * 3 + 2] = 1;
            }
          for (let r = 0; r < rings - 1; r++) {
            const a = F0 + r * 2, c2 = a + 1, d = a + 2, c = a + 3, at = (r * N + i) * 6;
            idx[at] = a; idx[at + 1] = c2; idx[at + 2] = d; idx[at + 3] = c2; idx[at + 4] = c; idx[at + 5] = d;
          }
        }
      }
      up(geo.attributes.position); up(geo.attributes.normal); up(geo.attributes.uv); up(geo.index);
    }
    return { geo, update };
  }
  /** Flip a geometry's winding if `wrong()` says its normals came out inside-out (checked once, after the first update). */
  function settle(geo, wrong) {
    geo.computeVertexNormals();
    if (!wrong(geo.attributes.normal.array)) return;
    const a = geo.index.array;
    for (let i = 0; i < a.length; i += 3) {
      const t = a[i + 1];
      a[i + 1] = a[i + 2];
      a[i + 2] = t;
    }
    up(geo.index);
    geo.computeVertexNormals();
  }
  /**
   * A band along a centre line (a tendon): rounded across (a flattened dome), a wall at each end.
   * ribbon(M, K, { H, base, p }).update(pts, w0, w1) — M points, width running from w0 to w1 (as live.js band()).
   */
  function ribbon(M, KD, o) {
    const R = M + 2;
    const K = KD + 2; // + a wall's foot each side
    const pos = new Float32Array(R * K * 3), uv = new Float32Array(R * K * 2);
    const idx = new Uint16Array((R - 1) * (K - 1) * 6);
    let w = 0;
    for (let r = 0; r < R - 1; r++)
      for (let k = 0; k < K - 1; k++) {
        const a = r * K + k, b = a + 1, d = a + K, c = d + 1;
        idx[w++] = a; idx[w++] = d; idx[w++] = b; idx[w++] = b; idx[w++] = d; idx[w++] = c;
      }
    const geo = own(new T.BufferGeometry());
    geo.setAttribute("position", new T.BufferAttribute(pos, 3));
    geo.setAttribute("normal", new T.BufferAttribute(new Float32Array(R * K * 3), 3));
    geo.setAttribute("uv", new T.BufferAttribute(uv, 2));
    geo.setIndex(new T.BufferAttribute(idx, 1));
    const S = [], PH = [];
    const p = o.p ?? 2.6;
    for (let k = 0; k < K; k++) {
      const kk = Math.max(0, Math.min(KD - 1, k - 1));
      const s = -Math.cos((Math.PI * kk) / (KD - 1));
      S.push(s);
      PH.push(k === 0 || k === K - 1 ? -1 : Math.pow(Math.max(0, 1 - Math.pow(Math.abs(s), p)), 1 / p));
    }
    const base = o.base ?? -0.6, dome = o.dome ?? 3;
    const ox = SLIDE[0] * (o.H - dome * 0.4), oy = SLIDE[1] * (o.H - dome * 0.4);
    let first = true;
    function update(pts, w0, w1) {
      let len = 0;
      for (let r = 0; r < R; r++) {
        const i = Math.max(0, Math.min(M - 1, r - 1));
        const P = pts[i], u = pts[Math.max(0, i - 1)], v = pts[Math.min(M - 1, i + 1)];
        const l = Math.hypot(v[0] - u[0], v[1] - u[1]) || 1;
        const n0 = -(v[1] - u[1]) / l, n1 = (v[0] - u[0]) / l;
        const hw = (w0 + (w1 - w0) * (i / (M - 1))) / 2;
        if (r > 1 && r < R - 1) len += Math.hypot(P[0] - pts[i - 1][0], P[1] - pts[i - 1][1]);
        const wall = r === 0 || r === R - 1;
        for (let k = 0; k < K; k++) {
          const v3 = (r * K + k) * 3;
          pos[v3] = P[0] + n0 * hw * S[k] + ox;
          pos[v3 + 1] = Y0 + (wall || PH[k] < 0 ? base : o.H - dome + dome * PH[k]);
          pos[v3 + 2] = -(P[1] + n1 * hw * S[k] + oy);
          uv[(r * K + k) * 2] = Math.max(0, Math.min(1, (k - 1) / (KD - 1)));
          uv[(r * K + k) * 2 + 1] = len / (o.tile || 40);
        }
      }
      up(geo.attributes.position); up(geo.attributes.uv);
      if (first) {
        first = false;
        settle(geo, (nr) => nr[(Math.floor(R / 2) * K + (K >> 1)) * 3 + 1] < 0);
      } else geo.computeVertexNormals();
    }
    return { geo, update };
  }
  /**
   * A cord along a quadratic curve (a ligament, the hamstring tendon): a flattened tube with rounded ends that
   * reach half a width past the end points, like the drawing's round line caps.
   */
  function cord(M, o) {
    const RS = o.radial || 10;
    const R = M + 6;
    const pos = new Float32Array(R * RS * 3);
    const idx = new Uint16Array((R - 1) * RS * 6);
    let w = 0;
    for (let r = 0; r < R - 1; r++)
      for (let k = 0; k < RS; k++) {
        const a = r * RS + k, b = r * RS + ((k + 1) % RS), d = a + RS, c = b + RS;
        idx[w++] = a; idx[w++] = b; idx[w++] = d; idx[w++] = b; idx[w++] = c; idx[w++] = d;
      }
    const geo = own(new T.BufferGeometry());
    geo.setAttribute("position", new T.BufferAttribute(pos, 3));
    geo.setAttribute("normal", new T.BufferAttribute(new Float32Array(R * RS * 3), 3));
    geo.setIndex(new T.BufferAttribute(idx, 1));
    let first = true;
    const ox = SLIDE[0] * (o.h + o.ry * 0.6), oy = SLIDE[1] * (o.h + o.ry * 0.6);
    function update(a, c, b) {
      for (let r = 0; r < R; r++) {
        // rows 0..2 and R-3..R-1 are the rounded ends
        const q = r < 3 ? r : r >= R - 3 ? R - 1 - r : 3;
        const i = Math.max(0, Math.min(M - 1, r - 3));
        const t = i / (M - 1), u = 1 - t;
        let x = u * u * a[0] + 2 * u * t * c[0] + t * t * b[0];
        let y = u * u * a[1] + 2 * u * t * c[1] + t * t * b[1];
        let tx = 2 * u * (c[0] - a[0]) + 2 * t * (b[0] - c[0]);
        let ty = 2 * u * (c[1] - a[1]) + 2 * t * (b[1] - c[1]);
        const l = Math.hypot(tx, ty) || 1;
        tx /= l; ty /= l;
        let s = 1;
        if (q < 3) {
          const ang = (q / 3) * (Math.PI / 2);
          s = Math.sin(ang);
          const out = o.rx * Math.cos(ang) * (r < 3 ? -1 : 1);
          x += tx * out; y += ty * out;
        }
        for (let k = 0; k < RS; k++) {
          const ph = (k / RS) * Math.PI * 2;
          const v3 = (r * RS + k) * 3;
          pos[v3] = x - ty * o.rx * s * Math.cos(ph) + ox;
          pos[v3 + 1] = Y0 + o.h + o.ry * s * Math.sin(ph);
          pos[v3 + 2] = -(y + tx * o.rx * s * Math.cos(ph) + oy);
        }
      }
      up(geo.attributes.position);
      if (first) {
        first = false;
        settle(geo, (nr) => nr[(Math.floor(R / 2) * RS + Math.round(RS / 4)) * 3 + 1] < 0);
      } else geo.computeVertexNormals();
    }
    return { geo, update };
  }

  // ---------------------------------------------------------------- painted faces (canvas → albedo + relief)
  function canvasPair(box, ppu = PPU) {
    const mk = () => {
      const c = document.createElement("canvas");
      c.width = Math.max(8, Math.ceil(box[2] * ppu));
      c.height = Math.max(8, Math.ceil(box[3] * ppu));
      const g = c.getContext("2d");
      g.setTransform(c.width / box[2], 0, 0, c.height / box[3], (-box[0] * c.width) / box[2], (-box[1] * c.height) / box[3]);
      return [c, g];
    };
    const [ca, ga] = mk();
    const [cb, gb] = mk();
    const tex = (c, srgb) => {
      const t = own(new T.CanvasTexture(c));
      t.flipY = false;
      t.anisotropy = 4;
      if (srgb) t.colorSpace = T.SRGBColorSpace;
      return t;
    };
    return { ga, gb, ppu, kx: ca.width / box[2], done: () => ({ map: tex(ca, true), bump: tex(cb, false) }) };
  }
  const trace = (g, poly) => {
    g.beginPath();
    poly.forEach((p, i) => (i ? g.lineTo(p[0], p[1]) : g.moveTo(p[0], p[1])));
    g.closePath();
  };
  const grey = (v, a = 1) => `rgba(${v},${v},${v},${a})`;
  /**
   * A bone's cut face: compact bone at the rim and round the canal, spongy bone where `spongy(x, y)` says (0..1),
   * its pores drawn along `grain(x, y)` (an angle), and the marrow canal sunk into it.
   */
  function boneFace(box, outline, { canal = null, sunk = false, spongy, grain, seed = 5, rim = 2.2, wash = null }) {
    const { ga, gb, ppu, done } = canvasPair(box);
    const all = (g, fill) => {
      g.fillStyle = fill;
      g.fillRect(box[0] - 1, box[1] - 1, box[2] + 2, box[3] + 2);
    };
    all(ga, C.bone);
    all(gb, grey(205));
    for (const g of [ga, gb]) {
      g.save();
      trace(g, outline);
      g.clip();
    }
    if (wash) {
      // the drawing's own gradient across the bone: ivory to a warmer tan
      const gr = ga.createLinearGradient(wash[0], 0, wash[1], 0);
      gr.addColorStop(0, "rgba(234,214,170,0)");
      gr.addColorStop(1, "rgba(234,214,170,0.55)");
      all(ga, gr);
    }
    const rnd = rngOf(seed);
    const step = coarse ? 3.5 : 2.8;
    for (let y = box[1]; y < box[1] + box[3]; y += step)
      for (let x = box[0]; x < box[0] + box[2]; x += step) {
        const jx = x + (rnd() - 0.5) * step * 1.1, jy = y + (rnd() - 0.5) * step * 1.1;
        const r1 = rnd(), r2 = rnd(), r3 = rnd(), r4 = rnd();
        const dens = spongy(jx, jy);
        if (dens <= 0 || !inside(outline, jx, jy)) continue;
        if (r4 < 0.3) {
          // a warm wash under the spongy bone (marrow showing through), built from soft overlapping blots
          ga.fillStyle = `rgba(232,196,150,${(0.09 * dens).toFixed(3)})`;
          ga.beginPath(); ga.arc(jx, jy, 7, 0, 7); ga.fill();
        }
        if (r1 > dens * 0.9 || edgeDist(outline, jx, jy) < rim + 1.5) continue;
        if (canal && (inside(canal, jx, jy) || edgeDist(canal, jx, jy) < 2.2)) continue;
        const a = grain(jx, jy) + (r2 - 0.5) * 0.8;
        const rx = step * (0.26 + r3 * 0.15), ry = step * (0.18 + r2 * 0.09);
        ga.fillStyle = "rgba(190,140,102,0.44)";
        ga.beginPath(); ga.ellipse(jx, jy, rx, ry, a, 0, 7); ga.fill();
        ga.fillStyle = "rgba(150,96,70,0.3)"; // deeper toward its shaded side
        ga.beginPath(); ga.ellipse(jx - 0.18, jy - 0.22, rx * 0.62, ry * 0.6, a, 0, 7); ga.fill();
        gb.fillStyle = grey(84, 0.9);
        gb.beginPath(); gb.ellipse(jx, jy, rx, ry, a, 0, 7); gb.fill();
      }
    if (canal && sunk) {
      // the canal itself is cut through the piece (see `hole`): only its compact lining shows on this face
      ga.strokeStyle = "#fbf4e4"; ga.lineWidth = 3.6;
      trace(ga, canal); ga.stroke();
      gb.strokeStyle = grey(232); gb.lineWidth = 3.6;
      trace(gb, canal); gb.stroke();
    } else if (canal) {
      const cb = boxOf(canal);
      const gr = ga.createLinearGradient(cb[0], 0, cb[0] + cb[2], 0);
      gr.addColorStop(0, "#f8e4ac");
      gr.addColorStop(1, C.marrow);
      ga.fillStyle = gr;
      trace(ga, canal); ga.fill();
      gb.fillStyle = grey(96);
      trace(gb, canal); gb.fill();
      {
        // yellow marrow is fat: a faint cell pattern
        const rm = rngOf(seed + 3);
        ga.save(); gb.save();
        trace(ga, canal); ga.clip();
        trace(gb, canal); gb.clip();
        for (let y = cb[1]; y < cb[1] + cb[3]; y += 3.2)
          for (let x = cb[0]; x < cb[0] + cb[2]; x += 3.2) {
            const jx = x + (rm() - 0.5) * 3, jy = y + (rm() - 0.5) * 3, rr = 1 + rm() * 0.7;
            ga.fillStyle = `rgba(255,244,206,${(0.16 + rm() * 0.16).toFixed(3)})`;
            ga.beginPath(); ga.arc(jx, jy, rr, 0, 7); ga.fill();
            gb.fillStyle = grey(130, 0.7);
            gb.beginPath(); gb.arc(jx, jy, rr, 0, 7); gb.fill();
          }
        ga.restore(); gb.restore();
      }
      for (const [g, col, sh] of [[ga, "rgba(170,120,60,0.55)", "rgba(120,78,30,0.75)"], [gb, grey(150, 0.6), grey(30, 0.9)]]) {
        g.save();
        trace(g, canal); g.clip();
        g.shadowColor = sh; g.shadowBlur = 3.2 * ppu; g.shadowOffsetX = 0.9 * ppu; g.shadowOffsetY = 1.6 * ppu;
        g.strokeStyle = col; g.lineWidth = 1.1;
        trace(g, canal); g.stroke();
        g.restore();
      }
    }
    ga.restore(); gb.restore();
    // compact bone at the rim (drawn past the outline too, so the walls take one clean colour)
    ga.strokeStyle = "#fbf4e4"; ga.lineWidth = rim * 2;
    trace(ga, outline); ga.stroke();
    gb.strokeStyle = grey(232); gb.lineWidth = rim * 2;
    trace(gb, outline); gb.stroke();
    return done();
  }
  /** Yellow marrow in a canal: fat, so a faint cell pattern. */
  function marrowFace(box, seed) {
    const { ga, gb, done } = canvasPair(box);
    const gr = ga.createLinearGradient(box[0], 0, box[0] + box[2], 0);
    gr.addColorStop(0, "#f8e4ac");
    gr.addColorStop(1, C.marrow);
    ga.fillStyle = gr;
    ga.fillRect(box[0] - 1, box[1] - 1, box[2] + 2, box[3] + 2);
    gb.fillStyle = grey(110);
    gb.fillRect(box[0] - 1, box[1] - 1, box[2] + 2, box[3] + 2);
    const rm = rngOf(seed);
    for (let y = box[1]; y < box[1] + box[3]; y += 3.2)
      for (let x = box[0]; x < box[0] + box[2]; x += 3.2) {
        const jx = x + (rm() - 0.5) * 3, jy = y + (rm() - 0.5) * 3, rr = 1 + rm() * 0.7;
        ga.fillStyle = `rgba(255,244,206,${(0.16 + rm() * 0.16).toFixed(3)})`;
        ga.beginPath(); ga.arc(jx, jy, rr, 0, 7); ga.fill();
        gb.fillStyle = grey(170, 0.7);
        gb.beginPath(); gb.arc(jx, jy, rr, 0, 7); gb.fill();
      }
    return done();
  }
  /** A muscle's cut face: the drawing's fascicle lines (and two finer ones between each pair) as grooves along the belly. */
  function muscleFace(box, outline, fib) {
    const { ga, gb, kx, done } = canvasPair(box);
    ga.fillStyle = C.muscle;
    ga.fillRect(box[0] - 1, box[1] - 1, box[2] + 2, box[3] + 2);
    // relief: the cut belly swells a little inside its sheath. A blurred copy of the outline is the height (the
    // shape is drawn off the canvas and only its soft shadow lands on it), and the fascicles are grooves in it.
    gb.fillStyle = grey(90);
    gb.fillRect(box[0] - 1, box[1] - 1, box[2] + 2, box[3] + 2);
    gb.save();
    gb.shadowColor = "#ffffff"; gb.shadowBlur = 11 * kx; gb.shadowOffsetX = 8192;
    gb.translate(-8192 / kx, 0);
    gb.fillStyle = "#ffffff";
    trace(gb, outline); gb.fill();
    gb.restore();
    for (const g of [ga, gb]) {
      g.save();
      trace(g, outline);
      g.clip();
      g.lineCap = "round";
    }
    if (fib) {
      const [from, to, n, bow] = fib;
      const fine = n * 3;
      for (let i = 0; i <= fine; i++) {
        const t = i / fine;
        const a = [from[0][0] + (from[1][0] - from[0][0]) * t, from[0][1] + (from[1][1] - from[0][1]) * t];
        const b = [to[0][0] + (to[1][0] - to[0][0]) * t, to[0][1] + (to[1][1] - to[0][1]) * t];
        const cx = (a[0] + b[0]) / 2 + bow * Math.sin(Math.PI * t), cy = (a[1] + b[1]) / 2;
        const main = i % 3 === 0;
        for (const [g, col, lw] of [[ga, `rgba(160,76,70,${main ? 0.42 : 0.2})`, main ? 1 : 0.7], [gb, grey(0, main ? 0.2 : 0.1), main ? 1.7 : 1.1]]) {
          g.strokeStyle = col; g.lineWidth = lw;
          g.beginPath(); g.moveTo(a[0], a[1]); g.quadraticCurveTo(cx, cy, b[0], b[1]); g.stroke();
        }
      }
    }
    ga.restore(); gb.restore();
    // the muscle's own sheath at its edge (drawn past the outline too, so the wall takes one clean colour)
    ga.strokeStyle = "rgb(238,190,182)"; ga.lineWidth = 2.6;
    trace(ga, outline); ga.stroke();
    return done();
  }
  /** Fibres along a band or cord: `lines` soft ridges across u, repeating along v. */
  function fibreTex(lines, alpha) {
    const c = document.createElement("canvas");
    c.width = 256; c.height = 16;
    const g = c.getContext("2d");
    const rnd = rngOf(11 + lines);
    g.fillStyle = alpha ? "#000" : grey(150);
    g.fillRect(0, 0, 256, 16);
    for (let i = 0; i < lines; i++) {
      const x = ((i + 0.5) / lines) * 256 + (rnd() - 0.5) * (120 / lines);
      const wd = (256 / lines) * (alpha ? 0.16 : 0.42);
      const gr = g.createLinearGradient(x - wd, 0, x + wd, 0);
      const hi = alpha ? "rgba(255,255,255,0.95)" : grey(40, 0.85);
      gr.addColorStop(0, alpha ? "rgba(255,255,255,0)" : grey(40, 0));
      gr.addColorStop(0.5, hi);
      gr.addColorStop(1, alpha ? "rgba(255,255,255,0)" : grey(40, 0));
      g.fillStyle = gr;
      g.fillRect(x - wd, 0, wd * 2, 16);
    }
    const t = own(new T.CanvasTexture(c));
    t.wrapT = T.RepeatWrapping;
    t.anisotropy = 4;
    return t;
  }

  /** Fat lobules: soft rounded cells, as a repeating relief. */
  function lobuleTex() {
    const c = document.createElement("canvas");
    c.width = c.height = 128;
    const g = c.getContext("2d");
    g.fillStyle = grey(120);
    g.fillRect(0, 0, 128, 128);
    const rnd = rngOf(77);
    for (let i = 0; i < 90; i++) {
      const x = rnd() * 128, y = rnd() * 128, r = 7 + rnd() * 9;
      for (const dx of [-128, 0, 128])
        for (const dy of [-128, 0, 128]) {
          const gr = g.createRadialGradient(x + dx, y + dy, 0, x + dx, y + dy, r);
          gr.addColorStop(0, grey(235, 0.9));
          gr.addColorStop(0.7, grey(190, 0.55));
          gr.addColorStop(1, grey(120, 0));
          g.fillStyle = gr;
          g.beginPath(); g.arc(x + dx, y + dy, r, 0, 7); g.fill();
        }
    }
    const t = own(new T.CanvasTexture(c));
    t.wrapS = t.wrapT = T.RepeatWrapping;
    t.anisotropy = 4;
    return t;
  }

  // ---------------------------------------------------------------- materials
  const phys = (o) => own(new T.MeshPhysicalMaterial({ metalness: 0, ...o }));
  const solid = (geo, mat, parent = root) => {
    const m = new T.Mesh(geo, mat);
    m.castShadow = m.receiveShadow = true;
    parent.add(m);
    return m;
  };
  const M = {
    skin: phys({ color: C.skin, roughness: 0.56, sheen: 0.75, sheenRoughness: 0.5, sheenColor: "#ffe2d4", clearcoat: 0.1, clearcoatRoughness: 0.5 }),
    dermis: phys({ color: C.dermis, roughness: 0.55, sheen: 0.4, sheenRoughness: 0.5, sheenColor: "#ffe2d4" }),
    soft: phys({ color: C.soft, roughness: 0.5, sheen: 0.5, sheenRoughness: 0.5, sheenColor: "#fff0e6", clearcoat: 0.22, clearcoatRoughness: 0.4 }),
    cart: phys({ color: C.cart, roughness: 0.22, clearcoat: 0.9, clearcoatRoughness: 0.14, sheen: 0.4, sheenRoughness: 0.4, sheenColor: "#ffffff" }),
    men: phys({ color: C.men, roughness: 0.34, clearcoat: 0.6, clearcoatRoughness: 0.25 }),
    lig: phys({ color: C.lig, roughness: 0.42, clearcoat: 0.35, clearcoatRoughness: 0.3, sheen: 0.4, sheenRoughness: 0.45, sheenColor: "#fff6cf" }),
    fat: phys({ color: C.fat, roughness: 0.36, clearcoat: 0.55, clearcoatRoughness: 0.25, sheen: 0.4, sheenRoughness: 0.5, sheenColor: "#fff5c8", bumpMap: lobuleTex(), bumpScale: 0.55 }),
    tendon: phys({ color: C.tendon, roughness: 0.4, clearcoat: 0.3, clearcoatRoughness: 0.3, sheen: 0.5, sheenRoughness: 0.4, sheenColor: "#ffffff", bumpMap: fibreTex(7, false), bumpScale: 0.45 }),
    cut: phys({ color: C.cut, roughness: 0.5, clearcoat: 0.3 }),
    muscle: (t) => phys({ color: "#ffffff", map: t.map, bumpMap: t.bump, bumpScale: 3, roughness: 0.5, sheen: 0.6, sheenRoughness: 0.5, sheenColor: "#f6c4ba", clearcoat: 0.28, clearcoatRoughness: 0.32 }),
    marrow: (t) => phys({ color: "#ffffff", map: t.map, bumpMap: t.bump, bumpScale: 0.5, roughness: 0.36, clearcoat: 0.5, clearcoatRoughness: 0.25, sheen: 0.3, sheenRoughness: 0.5, sheenColor: "#fff5c8" }),
    bone: (t) => phys({ color: "#ffffff", map: t.map, bumpMap: t.bump, bumpScale: 1.1, roughness: 0.6, sheen: 0.25, sheenRoughness: 0.6, sheenColor: "#fff6e0", clearcoat: 0.12, clearcoatRoughness: 0.5 }),
  };

  // ---------------------------------------------------------------- the thigh side (fixed in view)
  // A thigh-side piece is slid for its height first and cut at the thigh's top after, so its end stays in the plane
  // of the cut across the top (its square end then shows from above, as the top of a raised piece should).
  const slideOf = (poly, H) => poly.map((p) => [p[0] + SLIDE[0] * H, p[1] + SLIDE[1] * H]);
  const fixed = (outline, H, b, mat, more = {}) => {
    const poly = more.ready || clipTop(slideOf(outline, H), YC);
    const r = relief(poly.length, { H, b, box: mat.userData.box, cut: true, slid: true, ...more });
    r.update(poly, onCut);
    return solid(r.geo, mat);
  };
  const SINK = 2.8; // how far the marrow lies below the bone's cut face
  const boxed = (mat, box) => ((mat.userData.box = box), mat);
  // muscles: quadriceps in front, hamstrings behind, both cut square at the thigh's top
  for (const [name, H] of [["ham", HT.ham], ["quad", HT.quad]]) {
    const whole = crSample(G[name], true, 1);
    const poly = clipTop(whole, YC);
    const box = boxOf(poly);
    fixed(whole, H, 1.5, boxed(M.muscle(muscleFace(box, poly, G.fib[name])), box));
  }
  // femur: shaft with its marrow canal, spongy bone fanning into the condyle
  {
    const whole = crSample(G.femur, true, 0.7);
    const femurPoly = clipTop(whole, YC);
    const box = boxOf(femurPoly);
    const canalWhole = crSample(G.canalF, true, 0.9);
    const canal = clipTop(canalWhole, YC);
    const face = boneFace(box, femurPoly, {
      canal,
      sunk: true,
      seed: 5,
      wash: [box[0], box[0] + box[2]],
      spongy: (x, y) => Math.max(0, Math.min(1, (y - 96) / 44)),
      grain: (x, y) => (y > CF[1] - 40 ? Math.atan2(y - (CF[1] - 60), x - CF[0]) : Math.PI / 2),
    });
    // The canal runs out of the thigh's cut, so it is a channel in the bone's outline, not a hole in it: the
    // outline's edge along the cut is replaced by the canal's wall. The marrow lies in it, SINK below the face.
    const bone = clipTop(slideOf(whole, HT.femur), YC), chan = clipTop(slideOf(canalWhole, HT.femur), YC);
    const top = bone.findIndex((p, i) => onCut(p) && onCut(bone[(i + 1) % bone.length]));
    const mouth = chan.findIndex((p, i) => onCut(p) && onCut(chan[(i + 1) % chan.length]));
    let ready = null;
    if (top >= 0 && mouth >= 0) {
      const path = chan.map((_, i) => chan[(mouth + 1 + i) % chan.length]); // from one lip of the mouth round to the other
      if (Math.abs(path[0][0] - bone[top][0]) > Math.abs(path[path.length - 1][0] - bone[top][0])) path.reverse();
      ready = [...bone.slice(0, top + 1), ...path, ...bone.slice(top + 1)];
    }
    fixed(whole, HT.femur, 1.5, boxed(M.bone(face), box), ready ? { ready } : {});
    if (ready) {
      const mbox = boxOf(canal, 2);
      fixed(canalWhole, HT.femur - SINK, 0.4, boxed(M.marrow(marrowFace(mbox, 31)), mbox), { inset: -1, arc: 1 });
    }
  }
  // cartilage on the condyle: the drawing's arc (−50° … 200°), a rounded bead
  {
    const pts = [];
    for (let a = -50; a <= 200.01; a += coarse ? 5 : 3) pts.push([CF[0] + (RC - 2.8) * Math.cos(a * RAD), CF[1] + (RC - 2.8) * Math.sin(a * RAD)]);
    const poly = strokePoly(pts, 6.4);
    const r = relief(poly.length, { H: HT.fcart, b: 2.3, arc: 4 });
    r.update(poly);
    solid(r.geo, M.cart);
  }

  // ---------------------------------------------------------------- the shin side (swings about the condyle)
  // each piece turns about the condyle centre (its own slide is in its geometry, so the pivot is the drawing's)
  const shin = [];
  const inShin = (poly, H, b, mat, arc, more = {}) => {
    const r = relief(poly.length, { H, b, box: mat.userData.box, arc, pivot: true, ...more });
    r.update(poly);
    const m = solid(r.geo, mat);
    m.userData.H = H;
    shin.push(m);
    return m;
  };
  {
    const calf = crSample(G.calf, true, 1);
    const cbox = boxOf(calf);
    inShin(calf, HT.calf, 1.5, boxed(M.muscle(muscleFace(cbox, calf, G.fib.calf)), cbox));
    const tibia = crSample(G.tibia, true, 0.8);
    const tbox = boxOf(tibia);
    const canalT = crSample(G.canalT, true, 0.9);
    const face = boneFace(tbox, tibia, {
      canal: canalT,
      sunk: true,
      seed: 17,
      wash: [tbox[0], tbox[0] + tbox[2]],
      spongy: (x, y) => Math.max(0, Math.min(1, (y - 70) / 8)) * Math.max(0, Math.min(1, (214 - y) / 40)),
      grain: (x, y) => Math.PI / 2 + (x / 60) * 0.5 * Math.max(0, 1 - (y - 70) / 60),
    });
    inShin(tibia, HT.tibia, 1.5, boxed(M.bone(face), tbox), 3, { hole: canalT, floor: HT.tibia - SINK - 1 });
    const mbox = boxOf(canalT, 2);
    inShin(canalT, HT.tibia - SINK, 0.4, boxed(M.marrow(marrowFace(mbox, 37)), mbox), 1, { inset: -1 });
    inShin(strokePoly(quadPts([-54, 69], [0, 63], [52, 69], 12), 6.2), HT.tcart, 2.2, M.cart, 4);
    inShin([[56, 72], [30, 68], [56, 58]], HT.men, 0.7, M.men, 2);
    inShin([[-60, 72], [-34, 68], [-60, 56]], HT.men, 0.7, M.men, 2);
    inShin(strokePoly(quadPts([36, 252], [0, 258], [-36, 252], 8), 3, false), HT.tibia + 0.5, 0.8, M.cut, 2); // the shaft's cut end
  }

  // ---------------------------------------------------------------- the kneecap (glides on the groove)
  const knee = [];
  const inKnee = (r, H, mat) => {
    const m = solid(r.geo, mat);
    m.userData.H = H;
    knee.push(m);
  };
  {
    const ell = (cx, rx, ry, n) => Array.from({ length: n }, (_, i) => [cx + rx * Math.cos((i / n) * 2 * Math.PI), ry * Math.sin((i / n) * 2 * Math.PI)]);
    const bone = ell(5, 15, 31, coarse ? 36 : 56);
    const box = boxOf(bone);
    const face = boneFace(box, bone, { seed: 23, rim: 2, spongy: () => 0.9, grain: (x, y) => Math.atan2(y, x - 5) + Math.PI / 2 });
    const rb = relief(bone.length, { H: HT.pat, b: 2.6, arc: 4, box, pivot: true });
    rb.update(bone);
    inKnee(rb, HT.pat, M.bone(face));
    // its cartilage: the drawing's ellipse (cx −5, 12 × 27) where the bone's own ellipse leaves it showing
    const inBone = (x, y) => ((x - 5) / 14.6) ** 2 + (y / 30.6) ** 2 < 1;
    const cres = [];
    const n = coarse ? 40 : 64;
    for (let i = 0; i < n; i++) {
      const a = (i / n) * 2 * Math.PI;
      const p = [-5 + 12 * Math.cos(a), 27 * Math.sin(a)];
      if (!inBone(p[0], p[1])) cres.push(p);
    }
    // close it along the bone's edge (the part of the bone's ellipse that lies inside the cartilage's)
    const back = [];
    for (let i = 0; i < n; i++) {
      const a = (i / n) * 2 * Math.PI;
      const p = [5 + 14.6 * Math.cos(a), 30.6 * Math.sin(a)];
      if (((p[0] + 5) / 12) ** 2 + (p[1] / 27) ** 2 < 1) back.push(p);
    }
    // both runs go round with the angle; start the first where it leaves the bone, and reverse the second
    const cut = cres.findIndex((p, i) => i > 0 && Math.hypot(p[0] - cres[i - 1][0], p[1] - cres[i - 1][1]) > 6);
    const run = cut > 0 ? [...cres.slice(cut), ...cres.slice(0, cut)] : cres;
    const poly = [...run, ...back.reverse()];
    const rc = relief(poly.length, { H: HT.pcart, b: 1.9, arc: 4, pivot: true });
    rc.update(poly);
    inKnee(rc, HT.pcart, M.cart);
  }

  // ---------------------------------------------------------------- the force under the kneecap
  // The drawing's amber stroke along the groove (RC + 2, ±17° about the kneecap), as a strip that lights up and a
  // small lamp that warms the bone and cartilage round it. Both follow pfAt through `load`; the SVG keeps the halo.
  const hot = new T.Group();
  hot.position.set(CF[0] + SLIDE[0] * HT.glow, 0, -(CF[1] + SLIDE[1] * HT.glow));
  root.add(hot);
  const glowMat = phys({ color: C.glow, emissive: C.glow, emissiveIntensity: 0, roughness: 0.35, clearcoat: 0.5, clearcoatRoughness: 0.2, transparent: true, opacity: 0, depthWrite: false });
  {
    const pts = [];
    for (let a = -17; a <= 17.01; a += 2) pts.push([(RC + 2) * Math.cos(a * RAD), (RC + 2) * Math.sin(a * RAD)]);
    const poly = strokePoly(pts, 9);
    const r = relief(poly.length, { H: HT.glow, b: 3.2, arc: 5, base: HT.fcart - 1.5, pivot: true });
    r.update(poly);
    const m = new T.Mesh(r.geo, glowMat);
    m.renderOrder = 3;
    hot.add(ghost(m));
  }
  const lamp = new T.PointLight(new T.Color(C.glow), 0, 0, 2);
  lamp.position.set(RC + 5, Y0 + HT.pat + 12, 0);
  hot.add(lamp);

  // ---------------------------------------------------------------- the pieces that change shape with the stride
  const live = (geo, mat) => noCull(solid(geo, mat));
  const NS = coarse ? 5 : 8; // samples per span on the changing outlines
  const gastro = relief(6 * NS, { H: HT.gastro, b: 1.6, tile: 0.02, adapt: true });
  live(gastro.geo, phys({ color: C.muscle, roughness: 0.5, sheen: 0.6, sheenRoughness: 0.5, sheenColor: "#f6c4ba", clearcoat: 0.28, clearcoatRoughness: 0.32 }));
  const fatAt = [0, 0]; // its lobules ride with the pad
  const fatpad = relief(5 * NS, { H: HT.fat, b: 2.2, arc: 4, tile: 0.06, at: fatAt, adapt: true });
  live(fatpad.geo, M.fat);
  const TM = 17; // live.js band(): 17 points
  const qt = ribbon(TM, coarse ? 9 : 13, { H: HT.tendon, dome: 3.2, p: 2.4, tile: 60 });
  const pt = ribbon(TM, coarse ? 9 : 13, { H: HT.tendon, dome: 3.2, p: 2.4, tile: 60 });
  live(qt.geo, M.tendon);
  live(pt.geo, M.tendon);
  // the drawing's fibre lines, which show more as the tendons load
  const fibreMat = own(new T.MeshStandardMaterial({ color: C.fibre, roughness: 0.6, alphaMap: fibreTex(7, true), transparent: true, opacity: 0.3, depthWrite: false, polygonOffset: true, polygonOffsetFactor: -2, polygonOffsetUnits: -2 }));
  for (const r of [qt, pt]) {
    const m = noCull(new T.Mesh(r.geo, fibreMat));
    m.renderOrder = 2;
    root.add(ghost(m));
  }
  const CM = coarse ? 10 : 16;
  const acl = cord(CM, { rx: 3.5, ry: 2.4, h: HT.lig, radial: coarse ? 8 : 12 });
  const pcl = cord(CM, { rx: 3.5, ry: 2.4, h: HT.lig, radial: coarse ? 8 : 12 });
  const hamt = cord(CM, { rx: 3.5, ry: 2.6, h: HT.hamt, radial: coarse ? 8 : 12 });
  live(acl.geo, M.lig);
  live(pcl.geo, M.lig);
  live(hamt.geo, M.tendon);

  // ---------------------------------------------------------------- the leg itself: round skin behind the cut, soft tissue on it
  const NL0 = 46; // live.js pairs the skin's two edges into 46 chords; one more is put between each pair here
  const NL = NL0 * 2 - 1;
  const NPH = coarse ? 18 : 30;
  const fine = (E) => {
    const out = [];
    for (let i = 0; i < NL0; i++) {
      out.push(E[i]);
      if (i === NL0 - 1) break;
      const p0 = E[Math.max(0, i - 1)], p1 = E[i], p2 = E[i + 1], p3 = E[Math.min(NL0 - 1, i + 2)];
      out.push([(-p0[0] + 9 * p1[0] + 9 * p2[0] - p3[0]) / 16, (-p0[1] + 9 * p1[1] + 9 * p2[1] - p3[1]) / 16]);
    }
    return out;
  };
  const shell = own(new T.BufferGeometry());
  {
    const idx = new Uint16Array((NL - 1) * NPH * 6);
    let w = 0;
    for (let i = 0; i < NL - 1; i++)
      for (let j = 0; j < NPH; j++) {
        const a = i * (NPH + 1) + j, b = a + 1, d = a + NPH + 1, c = d + 1;
        idx[w++] = a; idx[w++] = b; idx[w++] = d; idx[w++] = b; idx[w++] = c; idx[w++] = d;
      }
    shell.setAttribute("position", new T.BufferAttribute(new Float32Array(NL * (NPH + 1) * 3), 3));
    shell.setAttribute("normal", new T.BufferAttribute(new Float32Array(NL * (NPH + 1) * 3), 3));
    shell.setIndex(new T.BufferAttribute(idx, 1));
  }
  live(shell, M.skin);
  // the cut face inside the skin's outline: the skin's own thickness at the edge, soft tissue within
  const SK = 2.8; // skin's thickness on the cut
  const NO = NL * 2;
  const rimSkin = relief(NO, { H: 0.3, b: 0.25, arc: 1, base: -2, pivot: true });
  const softFace = relief(NO, { H: 0.55, b: 0.3, arc: 2, base: -1, inset: SK, pivot: true, tile: 0.03 });
  live(rimSkin.geo, M.dermis);
  live(softFace.geo, M.soft);
  const outline = Array.from({ length: NO }, () => [0, 0]);
  let faceSet = false;
  function leg(A0, B0) {
    const A = fine(A0), B = fine(B0);
    const sp = shell.attributes.position.array;
    for (let i = 0; i < NL; i++) {
      const a = A[i], b = B[i];
      const mx = (a[0] + b[0]) / 2, my = (a[1] + b[1]) / 2, hx = (b[0] - a[0]) / 2, hy = (b[1] - a[1]) / 2;
      const r = Math.hypot(hx, hy) || 1;
      for (let j = 0; j <= NPH; j++) {
        const ph = (j / NPH) * Math.PI;
        const v = (i * (NPH + 1) + j) * 3;
        sp[v] = mx + Math.cos(ph) * hx;
        sp[v + 1] = Y0 + 0.3 - Math.sin(ph) * r * G.round;
        sp[v + 2] = -(my + Math.cos(ph) * hy);
      }
      outline[i][0] = b[0]; outline[i][1] = b[1];
      outline[NO - 1 - i][0] = a[0]; outline[NO - 1 - i][1] = a[1];
    }
    up(shell.attributes.position);
    rimSkin.update(outline, onCut);
    softFace.update(outline, onCut);
    if (!faceSet) {
      faceSet = true;
      settle(shell, (nr) => nr[(Math.floor(NL / 2) * (NPH + 1) + (NPH >> 1)) * 3 + 1] > 0); // the round back faces away from the viewer
    } else shell.computeVertexNormals();
  }

  // ---------------------------------------------------------------- the thigh cut straight across (the drawing's cross-section, painted flat)
  {
    const TC = G.topc, RD = G.rd, FEM = G.fem;
    const box = [TC.x - TC.r, 0, 2 * TC.r, RD];
    const { ga, gb, done } = canvasPair(box);
    const half = (g, r, rd = r * G.round, cx = TC.x) => {
      g.beginPath();
      for (let q = 0; q <= 48; q++) {
        const t = (q / 48) * Math.PI;
        g.lineTo(cx + r * Math.cos(t), rd * Math.sin(t));
      }
      g.closePath();
    };
    const fillHalf = (g, col, r, rd, cx) => { half(g, r, rd, cx); g.fillStyle = col; g.fill(); };
    const ell = (g, e, grow = 0) => { g.beginPath(); g.ellipse(e[0][0], e[0][1], e[1] + grow, e[2] + grow, ((e[3] || 0) * Math.PI) / 180, 0, 7); };
    ga.fillStyle = C.dermis; ga.fillRect(box[0], -1, box[2], box[3] + 2);
    gb.fillStyle = grey(190); gb.fillRect(box[0], -1, box[2], box[3] + 2);
    fillHalf(ga, C.capFat, TC.r - 4, RD - 4); fillHalf(gb, grey(160), TC.r - 4, RD - 4);
    fillHalf(ga, C.muscle, TC.r - 15, RD - 15); fillHalf(gb, grey(190), TC.r - 15, RD - 15);
    // fascicles cut across: a fine pebbling over the muscle, and the drawing's own dots
    ga.save(); gb.save();
    half(ga, TC.r - 15, RD - 15); ga.clip();
    half(gb, TC.r - 15, RD - 15); gb.clip();
    const rnd = rngOf(41);
    for (let y = 0; y < RD; y += 3.4)
      for (let x = box[0]; x < box[0] + box[2]; x += 3.4) {
        const jx = x + (rnd() - 0.5) * 3, jy = y + (rnd() - 0.5) * 3, rr = 1.1 + rnd() * 0.7;
        ga.fillStyle = `rgba(160,76,70,${(0.07 + rnd() * 0.08).toFixed(3)})`;
        ga.beginPath(); ga.ellipse(jx, jy, rr, rr * 0.85, 0, 0, 7); ga.fill();
        gb.fillStyle = grey(235, 0.5);
        gb.beginPath(); gb.ellipse(jx, jy, rr * 0.9, rr * 0.75, 0, 0, 7); gb.fill();
      }
    ga.fillStyle = "rgba(154,74,68,0.45)";
    for (const d of G.cap.dots) { ga.beginPath(); ga.ellipse(d[0], d[1], 1.1, 0.9, 0, 0, 7); ga.fill(); }
    ga.strokeStyle = "rgba(154,74,68,0.6)"; ga.lineWidth = 0.9;
    gb.strokeStyle = grey(90, 0.8); gb.lineWidth = 1.2;
    for (const e of G.cap.mus) { ell(ga, e); ga.stroke(); ell(gb, e); gb.stroke(); }
    ga.strokeStyle = C.capFat; ga.lineWidth = 2.2; ga.lineCap = "round";
    gb.strokeStyle = grey(120); gb.lineWidth = 2.2; gb.lineCap = "round";
    for (const s of G.cap.septa)
      for (const g of [ga, gb]) { g.beginPath(); g.moveTo(s[0][0], s[0][1]); g.quadraticCurveTo(s[1][0], s[1][1], s[2][0], s[2][1]); g.stroke(); }
    ga.restore(); gb.restore();
    fillHalf(ga, C.bone, FEM.r, FEM.r * G.round, FEM.x); fillHalf(gb, grey(240), FEM.r, FEM.r * G.round, FEM.x);
    fillHalf(ga, C.marrow, FEM.r - 8, (FEM.r - 8) * G.round, FEM.x); fillHalf(gb, grey(110), FEM.r - 8, (FEM.r - 8) * G.round, FEM.x);
    for (const [list, col] of [[G.cap.art, C.art], [G.cap.vein, C.vein], [G.cap.nerve, C.nerve]])
      for (const e of list) {
        ell(ga, e); ga.fillStyle = col; ga.fill();
        ell(gb, e, 0.6); gb.fillStyle = grey(250); gb.fill();
        if (col !== C.nerve) { ell(gb, e, -1.2); gb.fillStyle = grey(120); gb.fill(); }
      }
    const t = done();
    const n = coarse ? 32 : 56;
    const pos = [], uv = [], idx = [];
    const zc = -YC + 0.06; // a hair over the pieces' own square ends, which lie in the same plane
    pos.push(TC.x, Y0 + 0.55, zc); uv.push(0.5, 0);
    for (let q = 0; q <= n; q++) {
      const a = (q / n) * Math.PI;
      const x = TC.x + TC.r * Math.cos(a), d = RD * Math.sin(a);
      pos.push(x, Y0 + 0.55 - d * (1 + 0.25 / RD), zc);
      uv.push((x - box[0]) / box[2], d / RD);
      if (q) idx.push(0, q, q + 1);
    }
    const geo = own(new T.BufferGeometry());
    geo.setAttribute("position", new T.Float32BufferAttribute(pos, 3));
    geo.setAttribute("uv", new T.Float32BufferAttribute(uv, 2));
    geo.setIndex(idx);
    settle(geo, (nr) => nr[2] < 0); // faces up
    solid(geo, phys({ color: "#ffffff", map: t.map, bumpMap: t.bump, bumpScale: 0.8, roughness: 0.48, sheen: 0.5, sheenRoughness: 0.5, sheenColor: "#fff0e6", clearcoat: 0.3, clearcoatRoughness: 0.35 }));
  }

  // ---------------------------------------------------------------- a soft lamp in front of the knee
  // The layer's key light rakes the cut face from above (good for the relief) and its studio lights a flat face
  // evenly. One small lamp in front of the joint adds a gentle falloff toward the thigh's top and the shin's end, so
  // the eye goes to the knee, and gives the wet edges something to catch.
  {
    const fill = new T.PointLight(new T.Color("#fff1e2"), night ? 62000 : 70000, 0, 2);
    fill.position.set(CF[0] + 30, Y0 + 300, -(CF[1] - 40));
    root.add(fill);
  }

  // ---------------------------------------------------------------- the stride
  const patLocal = (alpha, p) => {
    const c = Math.cos(alpha * RAD), s = Math.sin(alpha * RAD);
    return [CF[0] + RP * c + p[0] * c - p[1] * s, CF[1] + RP * s + p[0] * s + p[1] * c];
  };
  // The layer's shadow map is sized for a whole machine (about one texel per unit here); this relief is a few units
  // deep, so its own shadows need a tighter, finer map. The layer has no knob for that yet, so the key light is found
  // on the root's parent and retuned once (if the layer's structure ever changes this is skipped and its default stays).
  let tuned = false;
  function tuneShadow() {
    tuned = true;
    const key = root.parent && root.parent.children.find((o) => o.isDirectionalLight && o.castShadow);
    if (!key || !key.shadow || !key.shadow.camera) return;
    const sh = key.shadow, cam = sh.camera;
    const reach = 345; // the leg over a whole stride, seen from the light
    cam.left = -reach; cam.right = reach; cam.top = reach; cam.bottom = -reach;
    const far = key.position.distanceTo(key.target.position); // the light stands this far from the leg's middle
    cam.near = Math.max(1, far - reach); cam.far = far + reach; // a short depth range: the map's depth is only 16 bits
    cam.updateProjectionMatrix();
    sh.mapSize.set(coarse ? 1024 : 2048, coarse ? 1024 : 2048);
    sh.radius = coarse ? 5 : 8;
    sh.normalBias = 0.35;
    if (sh.map) { sh.map.dispose(); sh.map = null; }
    if (sh.mapPass) { sh.mapPass.dispose(); sh.mapPass = null; }
  }
  function update(s) {
    if (!s) return;
    if (!tuned) tuneShadow();
    for (const m of shin) {
      m.position.set(CF[0] + SLIDE[0] * m.userData.H, 0, -(CF[1] + SLIDE[1] * m.userData.H));
      m.rotation.y = s.theta * RAD;
    }
    const P = patLocal(s.alpha, [0, 0]);
    for (const m of knee) {
      m.position.set(P[0] + SLIDE[0] * m.userData.H, 0, -(P[1] + SLIDE[1] * m.userData.H));
      m.rotation.y = s.alpha * RAD;
    }
    hot.rotation.y = s.alpha * RAD;
    const k = Math.min(1, s.load / 1.15);
    glowMat.opacity = Math.min(1, k * 1.25);
    glowMat.emissiveIntensity = (night ? 1.5 : 1.9) * k;
    lamp.intensity = (night ? 520 : 620) * k;
    fibreMat.opacity = 0.3 + 0.6 * Math.min(1, s.load);
    qt.update(s.qt, 20, 26);
    pt.update(s.pt, 15, 13);
    fatAt[0] = s.fat[0][0]; fatAt[1] = s.fat[0][1];
    fatpad.update(crSample(s.fat, true, 1, NS));
    gastro.update(crSample(s.gastro, true, 1, NS));
    acl.update(s.acl[0], s.acl[1], s.acl[2]);
    pcl.update(s.pcl[0], s.pcl[1], s.pcl[2]);
    hamt.update(s.hamt[0], s.hamt[1], s.hamt[2]);
    leg(s.back, s.front);
  }
  return {
    update,
    dispose() {
      for (const x of junk) x.dispose();
    },
  };
}
