// A7 live code: one running stride, slowed. The tibia swings about the condyle by bendAt(φ);
// the kneecap is placed on its groove where the patellar tendon (fixed length) reaches the
// tibial tuberosity; tendons, fat pad, ligaments, calf and skin follow, and the far half of the leg
// keeps its round skin behind the cut. While the foot is down,
// the kneecap's contact glows with pfAt(φ) from Fig 4's kneeOf.
const DATA = __DATA__;

function mount(fig) {
  const svg = fig.querySelector("svg");
  const q = (s) => svg.querySelector(s);
  const still = matchMedia("(prefers-reduced-motion: reduce)");
  const out = Object.fromEntries([...fig.querySelectorAll("[data-r]")].map((n) => [n.dataset.r, n]));
  const status = fig.querySelector("[data-status]");
  const line = fig.querySelector("[data-scene]");
  const buttons = [...fig.querySelectorAll('[data-control="rate"] .opt-seg-btn')];
  const f1 = (v) => v.toFixed(1);
  const set = (part, attr, v) => q(`[data-part="${part}"]`).setAttribute(attr, v);
  const { CF, RC, PCTS, mon: MON } = DATA;
  const RAD = Math.PI / 180;
  const RP = RC + 20; // kneecap centre's distance from the condyle centre

  function smoothP(points, closed = true, k = 1) {
    const n = points.length;
    const at = (i) => points[closed ? (i + n) % n : Math.max(0, Math.min(n - 1, i))];
    let d = `M${f1(points[0][0])} ${f1(points[0][1])}`;
    for (let i = 0; i < (closed ? n : n - 1); i++) {
      const p0 = at(i - 1), p1 = at(i), p2 = at(i + 1), p3 = at(i + 2);
      d += `C${f1(p1[0] + ((p2[0] - p0[0]) / 6) * k)} ${f1(p1[1] + ((p2[1] - p0[1]) / 6) * k)} ${f1(p2[0] - ((p3[0] - p1[0]) / 6) * k)} ${f1(p2[1] - ((p3[1] - p1[1]) / 6) * k)} ${f1(p2[0])} ${f1(p2[1])}`;
    }
    return d + (closed ? "Z" : "");
  }
  function band(a, ctrl, b, w0, w1) {
    // a tapered band along a quadratic curve
    const pts = [];
    for (let i = 0; i <= 16; i++) {
      const t = i / 16;
      pts.push([(1 - t) ** 2 * a[0] + 2 * (1 - t) * t * ctrl[0] + t * t * b[0], (1 - t) ** 2 * a[1] + 2 * (1 - t) * t * ctrl[1] + t * t * b[1]]);
    }
    const L = [];
    const R = [];
    pts.forEach((p, i) => {
      const u = pts[Math.max(0, i - 1)];
      const v = pts[Math.min(pts.length - 1, i + 1)];
      const l = Math.hypot(v[0] - u[0], v[1] - u[1]) || 1;
      const n = [-(v[1] - u[1]) / l, (v[0] - u[0]) / l];
      const w = (w0 + (w1 - w0) * (i / 16)) / 2;
      L.push([p[0] + n[0] * w, p[1] + n[1] * w]);
      R.push([p[0] - n[0] * w, p[1] - n[1] * w]);
    });
    return { d: `M${[...L, ...R.reverse()].map((p) => `${f1(p[0])} ${f1(p[1])}`).join("L")}Z`, pts };
  }

  // ---------------------------------------------------------------- the far half of the leg (round skin behind the cut)
  // The skin's back and front edges are paired into chords along the leg; each chord is swept round
  // as a half-circle behind the cut (depth = half its length × FAR.round). Facets facing away are
  // culled, the rest shaded by facing and painted back to front.
  const FAR = DATA.far;
  const sA = Math.sin(FAR.A * RAD), cA = Math.cos(FAR.A * RAD), sE = Math.sin(FAR.E * RAD), cE = Math.cos(FAR.E * RAD);
  const VIEW = [cA * cE, sA * cE, sE];
  const LIGHT = (() => {
    const l = [-0.35, 0.55, 0.76];
    const m = Math.hypot(...l);
    return l.map((v) => v / m);
  })();
  const css = getComputedStyle(fig);
  const rgbOf = (name, fb) => {
    const m = /^#?([0-9a-f]{6})$/i.exec((css.getPropertyValue(name) || fb).trim()) || /^#?([0-9a-f]{6})$/i.exec(fb);
    return [0, 2, 4].map((i) => parseInt(m[1].slice(i, i + 2), 16));
  };
  const SKIN_HI = rgbOf("--a7-w0", "#f0d3c2");
  const SKIN_LO = rgbOf("--a7-w1", "#d5a691");
  const tone = (t) => `rgb(${SKIN_LO.map((lo, i) => Math.round(lo + (SKIN_HI[i] - lo) * t)).join(",")})`;
  function sampleCR(points, k = 0.9, steps = 8) {
    const n = points.length;
    const at = (i) => points[Math.max(0, Math.min(n - 1, i))];
    const out = [points[0]];
    for (let i = 0; i < n - 1; i++) {
      const p0 = at(i - 1), p1 = at(i), p2 = at(i + 1), p3 = at(i + 2);
      const c1 = [p1[0] + ((p2[0] - p0[0]) / 6) * k, p1[1] + ((p2[1] - p0[1]) / 6) * k];
      const c2 = [p2[0] - ((p3[0] - p1[0]) / 6) * k, p2[1] - ((p3[1] - p1[1]) / 6) * k];
      for (let s = 1; s <= steps; s++) {
        const t = s / steps;
        const u = 1 - t;
        out.push([0, 1].map((c) => u * u * u * p1[c] + 3 * u * u * t * c1[c] + 3 * u * t * t * c2[c] + t * t * t * p2[c]));
      }
    }
    return out;
  }
  function byLength(pts, n) {
    const acc = [0];
    for (let i = 1; i < pts.length; i++) acc.push(acc[i - 1] + Math.hypot(pts[i][0] - pts[i - 1][0], pts[i][1] - pts[i - 1][1]));
    const L = acc[acc.length - 1];
    const out = [];
    let j = 0;
    for (let q = 0; q < n; q++) {
      const want = (L * q) / (n - 1);
      while (j < acc.length - 2 && acc[j + 1] < want) j++;
      const t = (want - acc[j]) / (acc[j + 1] - acc[j] || 1);
      out.push([pts[j][0] + (pts[j + 1][0] - pts[j][0]) * t, pts[j][1] + (pts[j + 1][1] - pts[j][1]) * t]);
    }
    return out;
  }
  const NL = 46;
  const NPHI = 36;
  function drawFar(back, front) {
    const A = byLength(sampleCR(back), NL);
    const B = byLength(sampleCR(front), NL);
    const lv = A.map((a, i) => {
      const b = B[i];
      const h = [(b[0] - a[0]) / 2, (b[1] - a[1]) / 2];
      const r = Math.hypot(h[0], h[1]);
      return { m: [(a[0] + b[0]) / 2, (a[1] + b[1]) / 2], h, r, u: [h[0] / r, h[1] / r] };
    });
    const pt = (l, ph) => {
      const d = Math.sin(ph) * l.r * FAR.round;
      return [l.m[0] + Math.cos(ph) * l.h[0] + d * FAR.w[0], l.m[1] + Math.cos(ph) * l.h[1] + d * FAR.w[1]];
    };
    const quads = [];
    for (let i = 0; i < NL - 1; i++) {
      const l0 = lv[i];
      const l1 = lv[i + 1];
      const ux = l0.u[0] + l1.u[0];
      const uy = l0.u[1] + l1.u[1];
      const um = Math.hypot(ux, uy) || 1;
      for (let j = 0; j < NPHI; j++) {
        const p0 = (j / NPHI) * Math.PI;
        const p1 = ((j + 1) / NPHI) * Math.PI;
        const pm = (p0 + p1) / 2;
        // outward normal in world (x right, y toward the viewer, z up)
        const n = [(Math.cos(pm) * ux) / um, -Math.sin(pm), (-Math.cos(pm) * uy) / um];
        const facing = n[0] * VIEW[0] + n[1] * VIEW[1] + n[2] * VIEW[2];
        if (facing <= 0.01) continue;
        const lit = Math.max(0, n[0] * LIGHT[0] + n[1] * LIGHT[1] + n[2] * LIGHT[2]);
        const c = [(l0.m[0] + l1.m[0]) / 2 + Math.cos(pm) * (l0.h[0] + l1.h[0]) / 2, (l0.m[1] + l1.m[1]) / 2 + Math.cos(pm) * (l0.h[1] + l1.h[1]) / 2];
        const d = Math.sin(pm) * ((l0.r + l1.r) / 2) * FAR.round;
        const key = (c[0] * cA + (FAR.dep - d) * sA) * cE - c[1] * sE;
        const q = [pt(l0, p0), pt(l1, p0), pt(l1, p1), pt(l0, p1)];
        quads.push({ key, d: `M${q.map((v) => `${f1(v[0])} ${f1(v[1])}`).join("L")}Z`, fill: tone(Math.min(1, 0.18 + 0.95 * lit)) });
      }
    }
    quads.sort((a, b) => a.key - b.key);
    q('[data-part="far"]').innerHTML = quads.map((v) => `<path d="${v.d}" fill="${v.fill}" stroke="${v.fill}" stroke-width="0.7" stroke-linejoin="round"/>`).join("");
  }

  // ---------------------------------------------------------------- kinematics
  let theta = 0;
  const W = (p) => {
    // tibia frame → page
    const c = Math.cos(theta * RAD);
    const s = Math.sin(theta * RAD);
    return [CF[0] + p[0] * c - p[1] * s, CF[1] + p[0] * s + p[1] * c];
  };
  const patLocal = (alpha, p) => {
    const c = Math.cos(alpha * RAD);
    const s = Math.sin(alpha * RAD);
    const P = [CF[0] + RP * c, CF[1] + RP * s];
    return [P[0] + p[0] * c - p[1] * s, P[1] + p[0] * s + p[1] * c];
  };
  const TUB = [60, 118];
  const INF = [2, 31];
  const SUP = [2, -31];
  theta = 0;
  const LPT = Math.hypot(...patLocal(-26, INF).map((v, i) => v - W(TUB)[i]));
  function solveAlpha() {
    const tub = W(TUB);
    let lo = -70;
    let hi = 90;
    for (let i = 0; i < 30; i++) {
      const mid = (lo + hi) / 2;
      const p = patLocal(mid, INF);
      if (Math.hypot(p[0] - tub[0], p[1] - tub[1]) > LPT) lo = mid;
      else hi = mid;
    }
    // in deep swing the real kneecap stays on the front of the femur's end (the simple hinge
    // would drag it underneath), so its glide is capped there; the tendon is unloaded then
    return Math.min(52, (lo + hi) / 2);
  }

  // ---------------------------------------------------------------- state
  let at = 1;
  let pct = 0;
  let phi = 0.1;
  function draw() {
    theta = bendAt(phi, pct);
    const cad = cadenceOf(pct);
    const load = pfAt(phi, cad);
    set("tibia", "transform", `translate(${CF[0]} ${CF[1]}) rotate(${theta.toFixed(2)})`);
    const alpha = solveAlpha();
    const P = patLocal(alpha, [0, 0]);
    set("patella", "transform", `translate(${f1(P[0])} ${f1(P[1])}) rotate(${alpha.toFixed(2)})`);
    const inf = patLocal(alpha, INF);
    const sup = patLocal(alpha, SUP);
    const tub = W(TUB);
    const qt = band(sup, [sup[0] + 26, sup[1] - 70], [356, 150], 20, 26);
    const pt = band(inf, [(inf[0] + tub[0]) / 2 + 6, (inf[1] + tub[1]) / 2], tub, 15, 13);
    set("qtendon", "d", qt.d);
    set("ptendon", "d", pt.d);
    const fib = (pts) => [-4, 0, 4].map((o) => pts.map((p, i) => `${i ? "L" : "M"}${f1(p[0] + o * 0.7)} ${f1(p[1])}`).join("")).join("");
    set("tfibres", "d", fib(qt.pts) + fib(pt.pts));
    q('[data-part="tfibres"]').style.opacity = (0.3 + 0.6 * Math.min(1, load)).toFixed(2);
    // the contact under the kneecap
    let g = "";
    for (let a = alpha - 17; a <= alpha + 17; a += 2) g += `${g ? "L" : "M"}${f1(CF[0] + (RC + 2) * Math.cos(a * RAD))} ${f1(CF[1] + (RC + 2) * Math.sin(a * RAD))}`;
    set("pfglow", "d", g);
    q('[data-part="pfglow"]').style.opacity = (Math.min(1, load / 1.15)).toFixed(2);
    const gc = [CF[0] + (RC + 6) * Math.cos(alpha * RAD), CF[1] + (RC + 6) * Math.sin(alpha * RAD)];
    set("glow", "cx", f1(gc[0]));
    set("glow", "cy", f1(gc[1]));
    set("glow", "opacity", (0.9 * Math.min(1, load / 1.15)).toFixed(2));
    // soft parts that span both bones
    set("fatpad", "d", smoothP([patLocal(alpha, [-10, 24]), pt.pts[8].map((v, i) => v + (CF[i] - v) * 0.12), W([46, 104]), W([40, 74]), [CF[0] + (RC + 3) * Math.cos((alpha + 40) * RAD), CF[1] + (RC + 3) * Math.sin((alpha + 40) * RAD)]]));
    const acl = [W([16, 66]), [270, CF[1] - 12]];
    const pcl = [W([-40, 68]), [318, CF[1] - 6]];
    set("acl", "d", `M${f1(acl[0][0])} ${f1(acl[0][1])}Q${f1((acl[0][0] + acl[1][0]) / 2 - 4)} ${f1((acl[0][1] + acl[1][1]) / 2)} ${f1(acl[1][0])} ${f1(acl[1][1])}`);
    set("pcl", "d", `M${f1(pcl[0][0])} ${f1(pcl[0][1])}Q${f1((pcl[0][0] + pcl[1][0]) / 2 + 6)} ${f1((pcl[0][1] + pcl[1][1]) / 2)} ${f1(pcl[1][0])} ${f1(pcl[1][1])}`);
    const ho = [CF[0] + RC * Math.cos(195 * RAD), CF[1] + RC * Math.sin(195 * RAD)];
    set("gastro", "d", smoothP([[ho[0] - 2, ho[1] - 12], [ho[0] + 14, ho[1] + 6], W([-44, 112]), W([-62, 170]), W([-86, 168]), W([-72, 112])]));
    set("hamt", "d", `M214 214Q${f1((214 + W([-58, 112])[0]) / 2 - 10)} ${f1((214 + W([-58, 112])[1]) / 2 + 10)} ${f1(W([-58, 112])[0])} ${f1(W([-58, 112])[1])}`);
    const frontEdge = [[414, -14], [418, 110], [404, 200], patLocal(alpha, [32, -14]), patLocal(alpha, [30, 22]), W([84, 128]), W([70, 200]), W([62, 256])];
    const backEdge = [[170, -14], [172, 70], [182, 180], [214, CF[1] + 26], W([-92, 118]), W([-112, 190]), W([-108, 256])];
    set("skin", "d", smoothP([[170, -14], ...frontEdge, ...[...backEdge].reverse().slice(0, -1)], true, 0.9));
    drawFar(backEdge, frontEdge);
    // monitor
    const xOf = (p) => MON.x0 + p * (MON.x1 - MON.x0);
    const yOf = (v) => MON.y0 - (v / MON.max) * (MON.y0 - MON.y1);
    const tr = (c) => {
      let d = "";
      for (let i = 0; i <= 120; i++) d += `${d ? "L" : "M"}${f1(xOf(i / 120))} ${f1(yOf(pfAt(i / 120, c)))}`;
      return d;
    };
    set("curve", "d", tr(cad));
    set("ghost", "d", tr(cadenceOf(0)));
    set("cursor", "transform", `translate(${f1(xOf(phi))} 0)`);
    set("mdot", "cx", f1(xOf(phi)));
    set("mdot", "cy", f1(yOf(load)));
  }

  // ---------------------------------------------------------------- input, tour, loop
  function readout(quiet) {
    const p = PCTS[at];
    const c = cadenceOf(p);
    out.cad.textContent = `${Math.round(c)}/min`;
    out.step.textContent = `${stepOf(c).toFixed(2)} m`;
    out.pf.textContent = `${Math.round(100 * kneeOf(c))}%`;
    line.textContent = DATA.lines[at];
    buttons.forEach((b, j) => {
      b.setAttribute("aria-checked", j === at ? "true" : "false");
      b.tabIndex = j === at ? 0 : -1;
    });
    if (!quiet) status.textContent = `${Math.round(c)} steps a minute: peak force under the kneecap ${Math.round(100 * kneeOf(c))}% of usual.`;
  }
  let touring = true;
  let idle = -1e9;
  let tourClock = 0;
  const takeOver = () => {
    touring = false;
    idle = performance.now();
  };
  buttons.forEach((b, i) =>
    b.addEventListener("click", () => {
      takeOver();
      at = i;
      readout();
      if (still.matches) renderStill();
    }),
  );
  for (const b of buttons) b.addEventListener("pointerdown", takeOver);
  fig.querySelector('[data-control="rate"]').addEventListener("keydown", (ev) => {
    const i = buttons.indexOf(document.activeElement);
    if (i < 0) return;
    const j = ev.key === "ArrowRight" || ev.key === "ArrowDown" ? i + 1 : ev.key === "ArrowLeft" || ev.key === "ArrowUp" ? i - 1 : null;
    if (j === null) return;
    ev.preventDefault();
    const b = buttons[(j + buttons.length) % buttons.length];
    b.focus();
    b.click();
  });
  function renderStill() {
    pct = PCTS[at];
    phi = KNEE.duty * 0.44; // mid-stance: deepest bend, most force
    draw();
  }
  let raf = 0;
  let last = 0;
  let visible = true;
  function tick(now) {
    raf = 0;
    if (!visible || still.matches) return;
    const dt = Math.min(0.05, last ? (now - last) / 1000 : 0.016);
    last = now;
    if (!touring && now - idle > 9000) touring = true;
    if (touring && (tourClock += dt) > 6) {
      tourClock = 0;
      const seq = [1, 3, 0]; // usual → +10 % → −10 %
      at = seq[(seq.indexOf(at) + 1) % seq.length];
      readout(true);
    }
    pct += (PCTS[at] - pct) * (1 - Math.exp(-dt * 3));
    const stride = (120 / cadenceOf(pct)) * KNEE.slow;
    phi = (phi + dt / stride) % 1;
    draw();
    raf = requestAnimationFrame(tick);
  }
  const start = () => {
    if (!raf && visible && !still.matches) {
      last = 0;
      raf = requestAnimationFrame(tick);
    }
  };
  new IntersectionObserver((entries) => {
    visible = entries.some((en) => en.isIntersecting);
    if (visible) start();
  }).observe(svg);
  still.addEventListener("change", () => (still.matches ? renderStill() : start()));
  readout(true);
  if (still.matches) renderStill();
  else {
    draw();
    start();
  }
}
