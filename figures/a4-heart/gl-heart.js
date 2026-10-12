// A4 · the heart as a solid, ray-marched in the figure's own camera (kit/gl.mjs), so it can turn.
//
// The heart is a signed-distance model in the section frame the SVG uses: x right (the person's left), y down,
// d back from the cut plane. A window is cut into its front, so the four chambers, the valves, the cords and the
// papillary muscles show inside a whole, round organ with its great vessels. Everything moves with the same
// beat model as the SVG: the valve plane is pulled toward the apex, the cavities shrink while the walls
// thicken, the atria squeeze, the leaflets swing, and blood cells move at their own depths.
// The SVG heart stays as the fallback (no WebGL, or a shader that fails to compile).
//
//   const H = heartGL({ fig, canvas, data });   // null without WebGL
//   H.draw({ beat, cells, yaw });
function heartGL({ fig, canvas, data, onError }) {
  if (typeof glLayer !== "function") return null;
  const D = data;
  const f = (v) => (Math.abs(v) < 1e-6 ? "0." : Number.isInteger(v) ? `${v}.` : `${+v.toFixed(4)}`);
  const v3 = (p) => `vec3(${f(p[0])},${f(p[1])},${f(p[2])})`;
  const sub = (a, b) => a.map((v, i) => v - b[i]);
  const add = (a, b) => a.map((v, i) => v + b[i]);
  const mul = (a, s) => a.map((v) => v * s);
  const dot = (a, b) => a[0] * b[0] + a[1] * b[1] + a[2] * b[2];
  const len = (a) => Math.hypot(a[0], a[1], a[2]);
  const nrm = (a) => mul(a, 1 / (len(a) || 1));
  const cross = (a, b) => [a[1] * b[2] - a[2] * b[1], a[2] * b[0] - a[0] * b[2], a[0] * b[1] - a[1] * b[0]];
  /** An orthonormal frame with `u` as its second axis and the first as close to `toward` as it can be. */
  const frame = (u, toward = [1, 0, 0]) => {
    u = nrm(u);
    const a = nrm(sub(toward, mul(u, dot(toward, u))));
    return [a, u, cross(a, u)];
  };

  // ---------------------------------------------------------------- the model (section frame, end of filling)
  const AVY = 262;
  const APEX = 522;
  const FLOOR = D.floorY;
  // ventricles and atria (centres, frames, radii)
  // The outer body is the figure's own outline (geo.OUT, as the SVG draws it) puffed into a rounded solid: a
  // star-shaped spheroid about C2 whose radius in each direction is the outline's, and whose depth is DK of it.
  // Its widest section (the "equator") lies DC behind the cut, so the cut face sits inside a rim of round outer wall.
  const C2 = [318, 336];
  const DC = 30;
  const DK = 0.74;
  const RAD = (() => {
    // the outline's radius from C2, by direction, as a Fourier series (12 terms)
    const P = [];
    const O = D.out;
    for (let i = 0; i < O.length; i++) {
      const p0 = O[(i - 1 + O.length) % O.length], p1 = O[i], p2 = O[(i + 1) % O.length], p3 = O[(i + 2) % O.length];
      for (let k = 0; k < 12; k++) {
        const t = k / 12, t2 = t * t, t3 = t2 * t;
        P.push([0, 1].map((c) => 0.5 * (2 * p1[c] + (-p0[c] + p2[c]) * t + (2 * p0[c] - 5 * p1[c] + 4 * p2[c] - p3[c]) * t2 + (-p0[c] + 3 * p1[c] - 3 * p2[c] + p3[c]) * t3)));
      }
    }
    const N = 256;
    const R = [];
    for (let j = 0; j < N; j++) {
      const th = (j / N) * 2 * Math.PI;
      const u = [Math.cos(th), Math.sin(th)];
      let best = 0;
      for (let i = 0; i < P.length; i++) {
        const a = P[i], b = P[(i + 1) % P.length];
        const e = [b[0] - a[0], b[1] - a[1]];
        const w = [a[0] - C2[0], a[1] - C2[1]];
        const den = u[0] * e[1] - u[1] * e[0];
        if (Math.abs(den) < 1e-9) continue;
        const t = (w[0] * e[1] - w[1] * e[0]) / den;
        const sgm = (w[0] * u[1] - w[1] * u[0]) / den;
        if (t > 0 && sgm >= 0 && sgm <= 1) best = Math.max(best, t);
      }
      R.push(best);
    }
    const K = 12;
    const a = [R.reduce((x, y) => x + y, 0) / N];
    const b = [0];
    for (let k = 1; k <= K; k++) {
      let ak = 0, bk = 0;
      R.forEach((r, j) => {
        const th = (j / N) * 2 * Math.PI;
        ak += r * Math.cos(k * th);
        bk += r * Math.sin(k * th);
      });
      a.push((2 * ak) / N);
      b.push((2 * bk) / N);
    }
    return { a, b, K, at: (th) => a[0] + a.slice(1).reduce((s, ak, i) => s + ak * Math.cos((i + 1) * th) + b[i + 1] * Math.sin((i + 1) * th), 0) };
  })();
  const LVf = frame([-16, 264, -28]);
  const RVf = frame([70, 230, 0]);
  // Proportions (scale ≈ 34 units per cm, from the ventricles' ~9 cm width): left ventricle ~4 cm across with a
  // ~0.75 cm wall, septum ~0.9 cm, right ventricle wall ~0.4 cm, atria meeting at a thin (~0.6 cm) septum,
  // atrial walls ~0.2 cm, apex ~0.7 cm. Typical adult values; individual hearts differ.
  const LVc = { c: [382, 378, 22], f: LVf, r: [67, 114, 64] };
  const RVc = { c: [234, 368, 8], f: RVf, r: [51, 88, 58] };
  const RAc = { c: [208, 218, 20], r: [80, 58, 64] };
  const LAc = { c: [394, 210, 24], r: [84, 52, 62] };
  const RA_C = [184, 214, 30];
  const LA_C = [424, 194, 50];
  const CV = [330, 380, 30]; // the ventricles squeeze about here
  // valves: centre, axis (into the downstream chamber or vessel), annulus radius, leaflet length, leaflets, thickness
  const VALVES = {
    tri: { c: [236, 284, 6], ax: [0.1, 1, 0.02], ra: 42, len: 52, n: 3, th: 2.4 },
    mit: { c: [382, 264, 8], ax: [-0.04, 1, 0.02], ra: 45, len: 60, n: 2, th: 2.6 },
  };
  for (const v of Object.values(VALVES)) {
    v.ax = nrm(v.ax);
    // commissures toward the back (+d), so the window cuts each valve across its leaflets, as in the textbook view
    const e1 = nrm(sub([0, 0, 1], mul(v.ax, dot([0, 0, 1], v.ax))));
    v.e1 = e1;
    v.e2 = cross(v.ax, e1);
  }
  // papillary muscles: base in the wall, tip toward its valve (rest positions; they scale with their ventricle)
  const PAPS = [
    { base: [228, 442, 30], tip: [232, 378, 20], r: [10, 4.2], cav: RVc, valve: "tri", phis: [Math.PI / 3, Math.PI * 0.8, Math.PI * 1.2, (5 * Math.PI) / 3] },
    { base: [352, 456, 36], tip: [358, 386, 22], r: [13, 5], cav: LVc, valve: "mit", phis: [Math.PI / 2 + 0.3, Math.PI / 2 + 0.7, (3 * Math.PI) / 2 - 0.5] },
    { base: [418, 450, 42], tip: [410, 382, 28], r: [13, 5], cav: LVc, valve: "mit", phis: [Math.PI / 2 - 0.3, Math.PI / 2 - 0.7, (3 * Math.PI) / 2 + 0.5] },
  ];
  // the great vessels: [x, y, d, r]; `art` red (oxygen-rich) or blue; open ends show their lumen
  const VES = [
    { name: "ao", art: 1, open: [0, 1], pts: [[372, 330, -24, 15], [326, 262, -18, 17], [306, 206, -10, 19], [298, 154, 2, 20], [306, 108, 24, 19.5], [340, 76, 52, 19], [412, 64, 92, 18], [452, 86, 118, 17.5], [474, 128, 138, 17], [484, 210, 152, 16.5], [490, 320, 158, 16], [494, 470, 160, 16]] },
    { name: "bca", art: 1, open: [0, 1], pts: [[346, 80, 54, 8], [344, 40, 54, 7.5], [342, 4, 54, 7]] },
    { name: "lcc", art: 1, open: [0, 1], pts: [[392, 68, 84, 7], [394, 32, 84, 6.5], [396, -2, 84, 6.5]] },
    { name: "lsc", art: 1, open: [0, 1], pts: [[432, 76, 106, 7], [440, 42, 106, 6.5], [448, 6, 106, 6.5]] },
    { name: "pt", art: 0, open: [0, 0], pts: [[262, 330, -40, 15], [316, 236, -50, 16.5], [344, 186, -44, 18], [364, 148, -22, 18], [372, 126, 6, 16], [374, 118, 26, 14]] },
    { name: "lpa", art: 0, open: [0, 1], pts: [[374, 118, 24, 13], [410, 114, 40, 12], [446, 118, 56, 11.5], [476, 126, 66, 11]] },
    { name: "rpa", art: 0, open: [0, 1], pts: [[374, 118, 28, 13], [340, 116, 62, 12.5], [296, 116, 76, 12], [240, 116, 84, 11.5], [176, 120, 92, 11], [140, 124, 96, 11]] },
    { name: "svc", art: 0, open: [1, 0], pts: [[160, -14, 34, 19], [164, 50, 36, 20], [172, 120, 40, 21], [180, 186, 30, 21]] },
    { name: "ivc", art: 0, open: [1, 0], pts: [[82, 392, 50, 20], [104, 338, 46, 20], [140, 282, 34, 19]] },
    { name: "pv1", art: 1, open: [1, 0], pts: [[570, 168, 76, 9.5], [522, 170, 70, 9.5], [468, 180, 62, 9]] },
    { name: "pv2", art: 1, open: [1, 0], pts: [[570, 216, 78, 9.5], [522, 216, 70, 9.5], [466, 212, 62, 9]] },
  ];
  // coronary arteries (red) and veins (blue) on the outer wall's right side, the side that faces the viewer.
  // A point on the body: direction th from C2 in the cut plane, rolled back by phi over the round profile.
  const onBody = (th, phi, lift) => {
    const R = RAD.at(th);
    const u = [Math.cos(th), Math.sin(th)];
    const p = [C2[0] + u[0] * R * Math.cos(phi), C2[1] + u[1] * R * Math.cos(phi), DC + DK * R * Math.sin(phi)];
    const n = nrm([u[0] * Math.cos(phi), u[1] * Math.cos(phi), Math.sin(phi) / DK]);
    return add(p, mul(n, lift));
  };
  const along = (a, b, n, r0, r1, lift, wob = 0.05) => Array.from({ length: n }, (_, i) => {
    const t = i / (n - 1);
    const w = wob * Math.sin(t * 9.4 + a[0] * 7) * Math.sin(Math.PI * t);
    return [...onBody(a[0] + (b[0] - a[0]) * t + w, a[1] + (b[1] - a[1]) * t, lift), r0 + (r1 - r0) * t];
  });
  const COR = [
    // circumflex artery round the left atrioventricular groove, and the great cardiac vein beside it
    { art: 1, pts: along([-0.47, -0.12], [-0.62, 1.15], 7, 3.8, 3.2, -1.2) },
    { art: 0, pts: along([-0.53, -0.1], [-0.7, 1.1], 7, 3.4, 3, -1.4) },
    // an obtuse marginal branch down the lateral wall toward the apex, and its vein
    { art: 1, pts: along([-0.45, 0.16], [0.4, 0.36], 9, 3, 1.6, -0.9, 0.07) },
    { art: 0, pts: along([-0.52, 0.48], [0.28, 0.7], 9, 2.8, 1.6, -1, 0.06) },
    // a second marginal branch further back, and a twig off the first
    { art: 1, pts: along([-0.57, 0.74], [0.14, 1.02], 8, 2.4, 1.4, -0.9, 0.08) },
    { art: 1, pts: along([-0.12, 0.24], [0.1, 0.58], 5, 1.7, 1.1, -0.7, 0.04) },
  ];
  // soft shadow casters for the floor (spheres)
  const CASTERS = [[340, 400, 50, 100], [250, 350, 40, 86], [392, 456, 40, 62], [196, 218, 40, 66], [420, 200, 50, 60], [490, 330, 158, 16], [494, 440, 160, 16], [100, 360, 48, 20]];

  // ---------------------------------------------------------------- code generation for the tubes
  function dense(pts) {
    // Catmull-Rom through the control points, a sample every ~26 units
    const out = [];
    const n = pts.length;
    for (let i = 0; i < n - 1; i++) {
      const p0 = pts[Math.max(0, i - 1)], p1 = pts[i], p2 = pts[i + 1], p3 = pts[Math.min(n - 1, i + 2)];
      const steps = Math.max(1, Math.round(len(sub(p2.slice(0, 3), p1.slice(0, 3))) / 26));
      for (let s = 0; s < steps; s++) {
        const t = s / steps, t2 = t * t, t3 = t2 * t;
        out.push([0, 1, 2, 3].map((c) => 0.5 * (2 * p1[c] + (-p0[c] + p2[c]) * t + (2 * p0[c] - 5 * p1[c] + 4 * p2[c] - p3[c]) * t2 + (-p0[c] + 3 * p1[c] - 3 * p2[c] + p3[c]) * t3)));
      }
    }
    out.push(pts[n - 1]);
    return out;
  }
  // a tube as chunks of up to 4 round-cone segments, each with its own bounding sphere; k scales the radius
  // (1 for the outer wall, less for the lumen). An open end's lumen runs a little past the end, so it shows a ring.
  function tubeFn(name, pts, open) {
    const P = dense(pts);
    const segs = [];
    for (let i = 0; i < P.length - 1; i++) segs.push([P[i], P[i + 1], false]);
    [0, 1].forEach((e) => {
      if (!open[e]) return;
      const a = e ? P[P.length - 1] : P[0];
      const b = e ? P[P.length - 2] : P[1];
      const dir = nrm(sub(a.slice(0, 3), b.slice(0, 3)));
      segs.push([a, [...add(a.slice(0, 3), mul(dir, a[3] * 0.8)), a[3]], true]);
    });
    const chunks = [];
    for (let i = 0; i < segs.length; i += 4) chunks.push(segs.slice(i, i + 4));
    let code = "";
    chunks.forEach((ch, j) => {
      const pts3 = ch.flatMap(([a, b]) => [a, b]);
      const c = pts3.reduce((sum, p) => add(sum, p.slice(0, 3)), [0, 0, 0]).map((v) => v / pts3.length);
      const R = Math.max(...pts3.map((p) => len(sub(p.slice(0, 3), c)) + p[3])) + 2;
      const body = ch.map(([a, b, ext]) => `${ext ? "if(k<1.)" : ""}d=min(d,sdRC(q,${v3(a)},${v3(b)},${f(a[3])}*k,${f(b[3])}*k));`).join("");
      code += `{float bb=length(q-${v3(c)})-${f(R)};if(bb<6.){${body}}else d=min(d,bb);}`;
    });
    const c = P.reduce((sum, p) => add(sum, p.slice(0, 3)), [0, 0, 0]).map((v) => v / P.length);
    const R = Math.max(...P.map((p) => len(sub(p.slice(0, 3), c)) + p[3])) + 10;
    return { code: `float ${name}(vec3 q,float k){float d=1e5;${code}return d;}\n`, c, R };
  }
  const tubes = VES.map((v) => ({ ...v, ...tubeFn(`ves_${v.name}`, v.pts, v.open) }));
  const cors = COR.map((v, i) => ({ ...v, ...tubeFn(`cor_${i}`, v.pts, [0, 0]) }));
  const tubeCode = tubes.map((t) => t.code).join("") + cors.map((t) => t.code).join("");
  // vessel calls inside map(): exact near a vessel, its bounding sphere's distance (a lower bound) elsewhere
  const vesselCalls = tubes
    .map(
      (t, i) =>
        `{float b=length(q-${v3(t.c)})-${f(t.R)};if(b<8.){float o=ves_${t.name}(q,1.);float l=o<5.?ves_${t.name}(q,${f(Math.min(0.74, 1 - 2.4 / t.pts[0][3]))}):o;${t.art ? "vA=min(vA,o);" : "vV=min(vV,o);"}lum=min(lum,l);}else{${t.art ? "vA=min(vA,b);" : "vV=min(vV,b);"}lum=min(lum,b);}}`,
    )
    .join("\n");
  const corCalls = cors.map((t, i) => `{float b=length(qv-${v3(t.c)})-${f(t.R)};if(b<12.){float o=cor_${i}(qv,1.)*sO;${t.art ? "cA=min(cA,o);" : "cV=min(cV,o);"}}else{${t.art ? "cA=min(cA,b*sO);" : "cV=min(cV,b*sO);"}}}`).join("\n");
  const radCode = RAD.a.slice(1).map((ak, i) => `c=vec2(c.x*u.x-c.y*u.y,c.y*u.x+c.x*u.y);r+=${f(ak)}*c.x+${f(RAD.b[i + 1])}*c.y;`).join("");
  const ell = (name, E) => {
    const [a, u, b] = E.f;
    return `vec3 ${name}(vec3 q){vec3 p=q-${v3(E.c)};return vec3(dot(p,${v3(a)}),dot(p,${v3(u)}),dot(p,${v3(b)}));}\n`;
  };
  const valveConsts = Object.entries(VALVES)
    .map(([k, v]) => `const vec3 ${k.toUpperCase()}_C=${v3(v.c)};const vec3 ${k.toUpperCase()}_AX=${v3(v.ax)};const vec3 ${k.toUpperCase()}_E1=${v3(v.e1)};const vec3 ${k.toUpperCase()}_E2=${v3(v.e2)};`)
    .join("\n");
  const casterCode = CASTERS.map((c) => `occ+=sphOcc(p,${v3(c)},${f(c[3])});sh=min(sh,sphShadow(p,L,${v3(c)},${f(c[3])}));`).join("");

  // palette from the theme's tokens
  const style = getComputedStyle(fig);
  const hex = (name, fb) => {
    const v = (style.getPropertyValue(name) || "").trim();
    const m = /^#?([0-9a-f]{6})$/i.exec(v) || /^#?([0-9a-f]{6})$/i.exec(fb);
    return [0, 2, 4].map((i) => parseInt(m[1].slice(i, i + 2), 16) / 255);
  };
  const mix = (a, b, t) => a.map((v, i) => v + (b[i] - v) * t);
  const m1 = hex("--a4-gl-muscle", "#c46a5a");
  const cut = hex("--a4-gl-cut", "#e9a493");
  const ven = hex("--a4-ven", "#8892cc");
  const art = hex("--a4-art", "#dc6656");
  const PAL = [
    m1, // 0 outer muscle
    cut, // 1 cut muscle
    mix(mix(m1, ven, 0.55), [0, 0, 0], 0.08), // 2 right chambers' inner wall
    mix(m1, art, 0.45), // 3 left chambers' inner wall
    art, // 4 arteries
    ven, // 5 veins
    hex("--a4-gl-valve", "#f3e2cc"), // 6 leaflets
    hex("--a4-gl-chord", "#efe0cf"), // 7 cords
    hex("--a4-gl-fat", "#ecd39a"), // 8 fat
    hex("--a4-lumen-art", "#7d2219"), // 9 artery lumen / cut wall
    hex("--a4-lumen-ven", "#3a427f"), // 10 vein lumen
    hex("--a4-gl-shadow", "#5a2a20"), // 11 floor shadow ink
    hex("--a4-art-cell", "#8f261c"), // 12 oxygen-rich cell
    hex("--a4-ven-cell", "#3f4a96"), // 13 oxygen-poor cell
    [0, 0, 0],
    [0, 0, 0],
  ];
  const palCode = PAL.map((c, i) => `const vec3 PAL_${i}=vec3(${c.map((v) => f(v)).join(",")});`).join("\n");
  const NCH = PAPS.reduce((s, p) => s + p.phis.length, 0);
  const FRAG = `
uniform vec4 uBeat;   // x valve-plane descent, y cavity scale across, z cavity scale along, w atrial cavity scale
uniform vec4 uBeat2;  // x ventricles' outer scale, y atria's outer scale, z AV valves open, w outflow valves open
uniform vec4 uTurn;   // x cos yaw, y sin yaw, z quality (0..1), w monitor top (viewBox y)
uniform vec4 uPap[3]; // papillary tips this frame (xyz)
uniform vec4 uPapB[3];// papillary bases this frame (xyz)
uniform vec4 uCell[24];
uniform float uLight;
${palCode}
const float DEP=${f(D.dep)};
const float AVY=${f(AVY)};
const float APEX=${f(APEX)};
const float FLOOR=${f(FLOOR)};
const vec3 PIVOT=vec3(330.,0.,40.);
const vec3 CV=${v3(CV)};
${valveConsts}
float smin(float a,float b,float k){float h=max(k-abs(a-b),0.)/k;return min(a,b)-h*h*k*.25;}
float smax(float a,float b,float k){float h=max(k-abs(a-b),0.)/k;return max(a,b)+h*h*k*.25;}
float sdE(vec3 p,vec3 r){float k0=length(p/r);float k1=length(p/(r*r));return k0*(k0-1.)/max(k1,1e-5);}
float sdE2(vec2 p,vec2 r){float k0=length(p/r);float k1=length(p/(r*r));return k0*(k0-1.)/max(k1,1e-5);}
float sdRC(vec3 p,vec3 a,vec3 b,float r1,float r2){
  vec3 ba=b-a;float l2=dot(ba,ba);float rr=r1-r2;float a2=l2-rr*rr;float il2=1./l2;
  vec3 pa=p-a;float y=dot(pa,ba);float z=y-l2;vec3 xv=pa*l2-ba*y;float x2=dot(xv,xv);float y2=y*y*l2;float z2=z*z*l2;
  float k=sign(rr)*rr*rr*x2;
  if(sign(z)*a2*z2>k)return sqrt(x2+z2)*il2-r2;
  if(sign(y)*a2*y2<k)return sqrt(x2+y2)*il2-r1;
  return (sqrt(x2*a2*il2)+y*rr)*il2-r1;}
float sdCap(vec3 p,vec3 a,vec3 b,float r){vec3 pa=p-a,ba=b-a;float h=clamp(dot(pa,ba)/dot(ba,ba),0.,1.);return length(pa-ba*h)-r;}
${ell("inLVc", LVc)}${ell("inRVc", RVc)}
const vec2 C2=vec2(${f(C2[0])},${f(C2[1])});
const float DC=${f(DC)};
const float DK=${f(DK)};
const vec3 RA_C=${v3(RA_C)};
const vec3 LA_C=${v3(LA_C)};
// the outline's radius in the direction u (a unit vector in the cut plane)
float radOf(vec2 u){float r=${f(RAD.a[0])};vec2 c=vec2(1.,0.);${radCode}return r;}
// the outer body: the outline puffed into a rounded solid, with the atrioventricular groove pressed in at the back
float bodyOf(vec3 p){
  vec2 v=p.xy-C2;float r=length(v);vec2 u=v/max(r,1e-3);float R=radOf(u);
  float e=sdE2(vec2(r,p.z-DC),vec2(R,DK*R));
  e+=5.5*exp(-pow((p.y-AVY+4.)/12.,2.))*smoothstep(0.,40.,p.z-DC);
  return e*.92;}
${tubeCode}
// the valve plane is pulled toward the apex while the apex stays put; the atria stretch, the vessels above stay
float wDesc(float y){return y<AVY?smoothstep(AVY-170.,AVY,y):clamp((APEX-y)/(APEX-AVY),0.,1.);}
// the window in the front wall (negative inside); removed: in front of the cut plane and inside the window
float cutOf(vec3 q){vec2 v=q.xy-C2;float r=length(v);return max(q.z,r-radOf(v/max(r,1e-3))-2.);}
// one leaflet set: sheets from the annulus (radius ra) toward B=(r,h) in the valve's own (radius, along-axis) plane,
// split at n commissures that open toward the free edge
float segT(vec2 p,vec2 a,vec2 b,out float t){vec2 pa=p-a,ba=b-a;t=clamp(dot(pa,ba)/dot(ba,ba),0.,1.);return length(pa-ba*t);}
float valveOf(vec3 q,vec3 c,vec3 ax,vec3 e1,vec3 e2,float ra,vec2 A,vec2 B,float n,float th,float gapOpen,float belly){
  vec3 p=q-c;float h=dot(p,ax);vec3 rv=p-ax*h;float r=length(rv);
  float b0=length(p)-ra-max(abs(B.y),abs(A.y))-8.;if(b0>8.)return b0;
  float ph=atan(dot(rv,e2),dot(rv,e1));
  float sg=abs(sin(n*ph*.5));
  vec2 b=A+(B-A)*(.68+.32*sg);
  vec2 dir=b-A;vec2 nn=normalize(vec2(-dir.y,dir.x));
  vec2 m=A+dir*.5+nn*belly*length(dir);
  float t1,t2;float d1=segT(vec2(r,h),A,m,t1);float d2=segT(vec2(r,h),m,b,t2);
  float t=d1<d2?t1*.5:.5+t2*.5;
  float d=min(d1,d2)-th*(1.-.45*t);
  return max(d,(.35+2.6*t)*gapOpen-r*sg);}
vec2 AVb,AVa,SLb,SLa;float gapAV,gapSL,AVbelly;
vec3 chA[${NCH}];vec3 chB[${NCH}];
// per-frame shapes, worked out once per pixel
void setup(){
  float o=smoothstep(0.,1.,uBeat2.z);
  AVa=vec2(1.,0.);
  // open: a funnel narrowing into the ventricle, bowed a little toward the wall; shut: the leaflets meet just below the
  // annulus plane, their bodies level with it (normal coaptation, no billowing into the atrium)
  AVb=mix(vec2(.06,.12),vec2(.74,.94),o);
  AVbelly=mix(.1,-.06,o);
  gapAV=o;
  float s=smoothstep(0.,1.,uBeat2.w);
  SLa=vec2(1.,.55);
  SLb=mix(vec2(.03,0.),vec2(.92,1.2),s);
  gapSL=s;
  // chordae: from each papillary tip to the free edges of the leaflets it holds
  ${PAPS.map((pm, i) =>
    pm.phis
      .map((phi, j) => {
        const v = VALVES[pm.valve];
        const k = PAPS.slice(0, i).reduce((s, p) => s + p.phis.length, 0) + j;
        const V = pm.valve.toUpperCase();
        return `{float sg=abs(sin(${f(v.n)}*${f(phi)}*.5));vec2 b=AVa+(AVb-AVa)*(.68+.32*sg);chA[${k}]=${V}_C+${V}_AX*(b.y*${f(v.len)})+(${V}_E1*${f(Math.cos(phi))}+${V}_E2*${f(Math.sin(phi))})*(b.x*${f(v.ra)});chA[${k}].y+=uBeat.x;chB[${k}]=uPap[${i}].xyz;}`;
      })
      .join(""),
  ).join("")}
}
// material bookkeeping for the hit point
float gBody,gCav,gCavSide,gVA,gVV,gLum,gValve,gChord,gPap,gCut,gCorA,gCorV;
float map(vec3 q0,bool keep){
  vec3 q=q0;q.y-=uBeat.x*wDesc(q0.y);
  // the cut: everything in front of the cut plane, inside the outline, is taken away; deep in that space,
  // the cut plane is all there is
  float cut=cutOf(q);
  if(cut<-5.&&!keep)return -cut;
  // ventricles scale (walls thicken as the cavities shrink), the atria about their own centres
  float wv=smoothstep(AVY-26.,AVY+18.,q.y);
  vec3 ca=mix(RA_C,LA_C,smoothstep(270.,350.,q.x));
  float sO=mix(uBeat2.y,uBeat2.x,wv);
  vec3 cc=mix(ca,CV,wv);
  vec3 qv=cc+(q-cc)/sO;
  float body=bodyOf(qv)*sO;
  // vessels
  float vA=1e5,vV=1e5,lum=1e5;
${vesselCalls}
  float ves=min(vA,vV);
  float solid=smin(body,ves,10.);
  // outside the outer wall there are no chambers, cords or valves (coronaries stand at most 5 proud of it)
  if(body>7.&&!keep)return smax(max(min(solid,body-5.),-lum),-cut,1.5);
  // coronaries on the outer wall (they ride the ventricles' squeeze)
  float cA=1e5,cV=1e5;
  if(body<26.){
${corCalls}
  }
  solid=smin(solid,min(cA,cV),2.5);
  // cavities: atria, ventricles (ridged), the two inflow channels, and the lumens
  float sc=uBeat.w;
  float rac=sdE((q-${v3(RAc.c)})/sc,${v3(RAc.r)})*sc;
  float lac=sdE((q-${v3(LAc.c)})/sc,${v3(LAc.r)})*sc;
  vec3 sv=vec3(uBeat.y,uBeat.z,uBeat.y);
  float lvc=sdE(inLVc(q)/sv,${v3(LVc.r)})*min(sv.x,sv.y);
  float rvc=sdE(inRVc(q)/sv,${v3(RVc.r)})*min(sv.x,sv.y);
  if(min(lvc,rvc)<8.&&q.y>AVY+18.){
    float tr=noise3(q*vec3(.07,.022,.07));
    float ridge=smoothstep(.52,.8,tr)*smoothstep(AVY+18.,AVY+70.,q.y);
    lvc+=3.2*ridge;rvc+=2.6*ridge;
  }
  if(rac<6.){rac+=1.8*pow(abs(sin(q.x*.17+q.y*.06)),10.)*step(q.x,200.);}
  float tric=sdRC(q,vec3(226.,246.,12.),vec3(238.,300.,6.),40.,40.);
  float mitc=sdRC(q,vec3(384.,234.,14.),vec3(382.,286.,8.),43.,43.);
  float cavR=min(min(rac,rvc),tric);
  float cavL=min(min(lac,lvc),mitc);
  float cav=min(min(cavR,cavL),lum);
  solid=smax(solid,-min(cavR,cavL),4.);
  solid=max(solid,-lum);
  // papillary muscles and their cords, valves
  float pap=1e5;
  for(int i=0;i<3;i++){pap=smin(pap,sdRC(q0,uPapB[i].xyz,uPap[i].xyz,uPapB[i].w,uPap[i].w),2.);}
  float chord=1e5;
  vec3 cb=abs(q0-vec3(318.,320.,26.))-vec3(118.,90.,44.);if(max(cb.x,max(cb.y,cb.z))<2.){for(int i=0;i<${NCH};i++){chord=min(chord,sdCap(q0,chA[i],chB[i],.85));}}
  float valve=(
    min(valveOf(q,TRI_C,TRI_AX,TRI_E1,TRI_E2,${f(VALVES.tri.ra)},AVa*vec2(${f(VALVES.tri.ra)},${f(VALVES.tri.len)}),AVb*vec2(${f(VALVES.tri.ra)},${f(VALVES.tri.len)}),3.,${f(VALVES.tri.th)},gapAV,AVbelly),
        valveOf(q,MIT_C,MIT_AX,MIT_E1,MIT_E2,${f(VALVES.mit.ra)},AVa*vec2(${f(VALVES.mit.ra)},${f(VALVES.mit.len)}),AVb*vec2(${f(VALVES.mit.ra)},${f(VALVES.mit.len)}),2.,${f(VALVES.mit.th)},gapAV,AVbelly)));
  float inner=min(min(smin(pap,solid,6.),chord),valve);
  float d=smax(inner,-cut,1.5);
  if(keep){gBody=body;gCav=cav;gCavSide=cavR<cavL?0.:1.;gVA=vA;gVV=vV;gLum=lum;gValve=valve;gChord=chord;gPap=pap;gCut=cut;gCorA=cA;gCorV=cV;}
  return d;
}
vec3 normalOf(vec3 p){const vec2 e=vec2(.3,-.3);return normalize(e.xyy*map(p+e.xyy,false)+e.yyx*map(p+e.yyx,false)+e.yxy*map(p+e.yxy,false)+e.xxx*map(p+e.xxx,false));}
float aoOf(vec3 p,vec3 n){float o=0.;float s=1.;for(int i=1;i<=4;i++){float h=float(i*i)*3.2;o+=(h-map(p+n*h,false))*s;s*=.62;}return clamp(1.-o*.011,0.,1.);}
// light blocked toward the lamp: two wide samples along the light, smooth by construction
float shadowOf(vec3 p,vec3 L){return clamp(.45+map(p+L*12.,false)/22.,0.,1.)*clamp(.5+map(p+L*34.,false)/60.,0.,1.);}
float sphOcc(vec3 p,vec3 c,float r){vec3 d=c-p;float l=length(d);return r*r/(l*l)*max(-d.y/l,0.);}
float sphShadow(vec3 p,vec3 L,vec3 c,float r){vec3 oc=p-c;float b=dot(oc,L);float h=dot(oc,oc)-b*b;float dd=sqrt(max(h,0.))-r;float t=-b;return t<0.?1.:smoothstep(0.,1.,clamp(dd/(t*.35+6.),0.,1.));}
vec3 toModel(vec3 w){vec3 s=vec3(w.x,-w.z,DEP-w.y);vec2 r=s.xz-PIVOT.xz;r=vec2(r.x*uTurn.x+r.y*uTurn.y,-r.x*uTurn.y+r.y*uTurn.x);return vec3(PIVOT.x+r.x,s.y,PIVOT.z+r.y);}
vec3 dirToModel(vec3 v){vec3 s=vec3(v.x,-v.z,-v.y);return vec3(s.x*uTurn.x+s.z*uTurn.y,s.y,-s.x*uTurn.y+s.z*uTurn.x);}
vec2 boxHit(vec3 ro,vec3 rd,vec3 lo,vec3 hi){vec3 ir=1./rd;vec3 t0=(lo-ro)*ir;vec3 t1=(hi-ro)*ir;vec3 a=min(t0,t1);vec3 b=max(t0,t1);return vec2(max(max(a.x,a.y),a.z),min(min(b.x,b.y),b.z));}
vec3 lin(vec3 c){return pow(c,vec3(2.2));}
vec3 gCellC;float gCellK;
float cellHit(vec3 ro,vec3 rd,float tMax){
  float best=tMax;
  for(int i=0;i<24;i++){vec4 c=uCell[i];if(c.w==0.)continue;
    vec3 oc=ro-c.xyz;float b=dot(oc,rd);float r=abs(c.w);float h=b*b-dot(oc,oc)+r*r;if(h<0.)continue;float t=-b-sqrt(h);
    if(t>0.&&t<best){best=t;gCellC=c.xyz;gCellK=c.w;}}
  return best;}
void main(){
  vec2 vb=viewOf(gl_FragCoord.xy);
  vec3 V=towardViewer();
  vec3 roW=rayOf(vb)+V*1600.;
  vec3 ro=toModel(roW);
  vec3 rd=dirToModel(-V);
  vec3 L=dirToModel(normalize(vec3(-.42,.5,.9)));
  setup();
  float px=pixelOf();
  vec4 outc=vec4(0.);
  float monFade=1.-smoothstep(uTurn.w-26.,uTurn.w-6.,vb.y);
  // the floor: a soft contact shadow and the heart's cast shadow, both fading out well inside the canvas
  float tf=(FLOOR-ro.y)/rd.y;
  if(tf>0.){
    vec3 p=ro+rd*tf;
    float occ=0.;float sh=1.;
    ${casterCode}
    float reach=1.-smoothstep(150.,260.,length(p.xz-vec2(330.,60.)));
    float a=clamp(occ*.55+(1.-sh)*.32,0.,.62)*reach*monFade;
    vec3 ink=mix(vec3(.02,.03,.02),PAL_11,uLight);
    a*=mix(1.,.55,uLight);
    outc=vec4(ink*a,a);
  }
  vec2 tb=boxHit(ro,rd,vec3(60.,-40.,-120.),vec3(592.,532.,190.));
  if(tb.x<tb.y&&tb.y>0.){
    float t=max(tb.x,0.);float dmin=1e5;float tmin=t;bool hit=false;float eps=max(.15,.3*px);
    for(int i=0;i<150;i++){
      vec3 p=ro+rd*t;float d=map(p,false);
      if(d<dmin){dmin=d;tmin=t;}
      if(d<eps){hit=true;break;}
      t+=d*.9;if(t>tb.y)break;
    }
    float cover=hit?1.:1.-smoothstep(.15*px,1.1*px,dmin);
    float tH=hit?t:tmin;
    if(cover>0.){
      float tc=hit?cellHit(ro,rd,tH):1e9;
      vec3 col;float alpha=cover;
      if(tc<tH){
        // a red cell, a little dished
        vec3 p=ro+rd*tc;vec3 n=normalize(p-gCellC);
        vec3 alb=lin(gCellK>0.?PAL_12:PAL_13);
        float dif=clamp(dot(n,L)*.5+.6,0.,1.);
        float dish=1.-.35*smoothstep(.6,1.,dot(n,-rd));
        col=alb*(.35+.75*dif)*dish+pow(max(dot(n,normalize(L-rd)),0.),30.)*.25;
        alpha=1.;
      }else{
        vec3 p=ro+rd*tH;
        map(p,true);
        vec3 n=normalOf(p);
        // materials
        vec3 alb;float gloss=.35;float rough=40.;
        float onCut=1.-smoothstep(.3,1.6,abs(gCut));
        vec3 muscle=lin(PAL_0);
        if(gValve<.8){alb=lin(PAL_6);gloss=.45;rough=30.;}
        else if(gChord<.6){alb=lin(PAL_7);gloss=.3;}
        else if(onCut>.5){
          bool inVes=min(gVA,gVV)<gBody-1.;
          alb=inVes?lin(mix(gVA<gVV?PAL_4:PAL_5,vec3(1.),.28)):lin(PAL_1);
          if(!inVes){
            // cut muscle: fibres wrap the left ventricle, finer grain elsewhere
            vec2 lc=(p.xy-vec2(394.,372.))/vec2(1.,1.7);
            float fib=.5+.5*sin(length(lc)*.36+noise2(p.xy*.05)*3.);
            alb*=.965+.035*fib+.05*(noise2(p.xy*.3)-.5);
          }
          gloss=.18;rough=18.;
        }
        else if(gPap<.8){alb=lin(mix(PAL_0,PAL_1,.35));gloss=.3;}
        else if(gCav<1.2&&gLum>gCav-.5&&gLum>1.){alb=lin(gCavSide<.5?PAL_2:PAL_3);gloss=.4;}
        else if(gLum<1.2){alb=lin(gVA<gVV?PAL_9:PAL_10);gloss=.3;}
        else if(min(gCorA,gCorV)<.8){alb=lin(gCorA<gCorV?PAL_4:PAL_5)*.85;gloss=.6;rough=60.;}
        else if(min(gVA,gVV)<gBody-1.){alb=lin(gVA<gVV?PAL_4:PAL_5);gloss=.55;rough=50.;}
        else{
          // the outer wall, with fat in the grooves
          float groove=1.-smoothstep(4.,16.,abs(p.y-uBeat.x*wDesc(p.y)-AVY+4.));
          float fat=clamp(groove*(.35+.7*noise2(p.xz*.09))+smoothstep(8.,2.5,min(gCorA,gCorV))*.4,0.,1.);
          alb=mix(muscle*(.95+.08*fbm2(p.xy*.025+p.z*.012)),lin(PAL_8),fat*.8);
          gloss=mix(.45,.25,fat);rough=mix(46.,20.,fat);
        }
        float occl=aoOf(p,n);
        float sh=uTurn.z>.5?mix(1.,shadowOf(p+n*1.5,L),.75):1.;
        vec3 Vd=-rd;vec3 H=normalize(L+Vd);
        float dif=clamp((dot(n,L)+.25)/1.25,0.,1.);
        float sky=.5+.5*(-n.y);
        float spec=pow(max(dot(n,H),0.),rough)*gloss*(.4+.6*sh);
        float fres=pow(1.-max(dot(n,Vd),0.),3.);
        col=alb*(.30*occl*(.6+.4*sky)+.92*dif*sh*(.35+.65*occl))+alb*alb*.22*(1.-dif)*occl+spec*vec3(1.,.96,.93)*(.5+.5*occl)+fres*.06*occl*alb;
      }
      col=pow(max(col,0.),vec3(1./2.2));
      col=min(col,vec3(1.));
      col*=monFade;alpha*=monFade;
      outc=vec4(col*alpha,alpha)+outc*(1.-alpha);
    }
  }
  float dn=(hash12(gl_FragCoord.xy+fract(uTime*.61)*91.)-.5)/255.;
  outc.rgb=clamp(outc.rgb+dn*step(.004,outc.a),vec3(0.),vec3(outc.a));
  gl_FragColor=outc;
}`;
  const LIGHT = (fig.closest("[data-theme]")?.getAttribute("data-theme") || document.body.dataset.theme) === "light" ? 1 : 0;
  const coarse = matchMedia("(pointer: coarse)").matches;
  let ratio = coarse ? 1.25 : 1.5;
  let quality = coarse ? 0 : 1;
  const uniforms = ["uBeat", "uBeat2", "uTurn", "uPap", "uPapB", "uCell"];
  const make = () =>
    glLayer({ canvas, fragment: FRAG, view: D.view, camera: D.camera, uniforms, fixed: { uLight: LIGHT }, maxRatio: ratio, onError: onError || ((m) => console.error(m)) });
  let layer = make();
  if (!layer) return null;

  // ---------------------------------------------------------------- per frame
  const cellBuf = new Float32Array(24 * 4);
  const papT = new Float32Array(12);
  const papB = new Float32Array(12);
  // cavities a cell can be in (rest shapes; scaled with the beat below)
  const ROOMS = { RA: RAc, LA: LAc, RV: RVc, LV: LVc };
  const inFrame = (E, q) => (E.f ? E.f.map((ax) => dot(sub(q, E.c), ax)) : sub(q, E.c));
  const outFrame = (E, l) => (E.f ? add(E.c, add(add(mul(E.f[0], l[0]), mul(E.f[1], l[1])), mul(E.f[2], l[2]))) : add(E.c, l));
  const keepIn = (room, q, s) => {
    // pull a cell inside its cavity (at 0.8 of the way to the wall)
    const E = ROOMS[room];
    const l = inFrame(E, q);
    const r = E.r.map((v, i) => v * s[i]);
    const k = Math.hypot(l[0] / r[0], l[1] / r[1], l[2] / r[2]);
    return k > 0.8 ? outFrame(E, mul(l, 0.8 / k)) : q;
  };
  let times = [];
  let lastNow = 0;
  return {
    get ratio() {
      return ratio;
    },
    draw({ def, sV, sLong, sAt, sO, sAo, av, semi, yaw, cells, monTop, time }) {
      const sc = [sV, sLong, sV];
      PAPS.forEach((pm, i) => {
        // papillary muscles shorten and move in with their ventricle
        const E = pm.cav;
        const base = outFrame(E, inFrame(E, pm.base).map((v, j) => v * [sV, sLong, sV][j]));
        const tip = outFrame(E, inFrame(E, pm.tip).map((v, j) => v * [sV, 0.94 + 0.06 * sLong, sV][j]));
        const w = (y) => (y < AVY ? 1 : Math.max(0, Math.min(1, (APEX - y) / (APEX - AVY))));
        base[1] += def * w(base[1]);
        tip[1] += def * w(tip[1]);
        papB.set([...base, pm.r[0] * (0.9 + 0.1 / sV)], i * 4);
        papT.set([...tip, pm.r[1] * (0.9 + 0.1 / sV)], i * 4);
      });
      cellBuf.fill(0);
      let k = 0;
      for (const c of cells) {
        if (k >= 24) break;
        if (c.stage < 1 || c.stage > 4) continue;
        // every cell in the heart is kept inside its chamber: atrium until it passes the valve plane, then ventricle
        const ring = VALVES[c.side === "R" ? "tri" : "mit"].c[1] + def;
        const inAtrium = c.stage === 1 || (c.stage === 2 && c.p[1] < ring);
        const room = c.side === "R" ? (inAtrium ? "RA" : "RV") : inAtrium ? "LA" : "LV";
        let q = [c.p[0], c.p[1], Math.max(9, c.d + 9)];
        q = keepIn(room, q, room[1] === "A" ? [sAt, sAt, sAt] : sc);
        cellBuf.set([q[0], q[1], q[2], (c.side === "L" ? 1 : -1) * 4.2], k * 4);
        k++;
      }
      const t0 = performance.now();
      layer.draw(
        {
          uBeat: [def, sV, sLong, sAt],
          uBeat2: [sO, sAo, av, semi],
          uTurn: [Math.cos(yaw), Math.sin(yaw), quality, monTop],
          uPap: papT,
          uPapB: papB,
          uCell: cellBuf,
        },
        time,
      );
      // a light governor: if frames run long, render fewer pixels (then drop the soft shadows)
      if (lastNow) times.push(t0 - lastNow);
      lastNow = t0;
      if (times.length >= 40) {
        times.sort((a, b) => a - b);
        const med = times[20];
        times = [];
        if (med > 26 && (ratio > 0.75 || quality > 0)) {
          if (quality > 0) quality = 0;
          else {
            ratio = Math.max(0.75, ratio - 0.25);
            layer = make() || layer;
          }
        }
      }
    },
    resetClock() {
      lastNow = 0;
      times = [];
    },
  };
}
