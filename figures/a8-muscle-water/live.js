// A8 live code: the fibres ease between scenes (size, spacing, fluid between them), and the
// current twinkles as ⊙ marks: in the gaps always, inside the fibres in the share Fig 2's model
// gives for the chosen frequency.
const DATA = __DATA__;

function mount(fig) {
  const svg = fig.querySelector("svg");
  const q = (s) => svg.querySelector(s);
  const still = matchMedia("(prefers-reduced-motion: reduce)");
  const out = Object.fromEntries([...fig.querySelectorAll("[data-r]")].map((n) => [n.dataset.r, n]));
  const status = fig.querySelector("[data-status]");
  const line = fig.querySelector("[data-scene]");
  const sceneBtns = [...fig.querySelectorAll('[data-control="scene"] .opt-seg-btn')];
  const freqBtns = [...fig.querySelectorAll('[data-control="freq"] .opt-seg-btn')];
  const f1 = (v) => v.toFixed(1);
  const { C } = DATA;
  const set = (part, attr, v) => q(`[data-part="${part}"]`).setAttribute(attr, v);
  const S = WATER.scenes;
  const BASE = 0.88; // drawn fibre = 88 % of its cell, leaving the gap

  function smooth(points, k = 0.9) {
    const n = points.length;
    const at = (i) => points[(i + n) % n];
    let d = `M${f1(points[0][0])} ${f1(points[0][1])}`;
    for (let i = 0; i < n; i++) {
      const p0 = at(i - 1), p1 = at(i), p2 = at(i + 1), p3 = at(i + 2);
      d += `C${f1(p1[0] + ((p2[0] - p0[0]) / 6) * k)} ${f1(p1[1] + ((p2[1] - p0[1]) / 6) * k)} ${f1(p2[0] - ((p3[0] - p1[0]) / 6) * k)} ${f1(p2[1] - ((p3[1] - p1[1]) / 6) * k)} ${f1(p2[0])} ${f1(p2[1])}`;
    }
    return d + "Z";
  }
  const dot = (x, y, r) => `M${f1(x - r)} ${f1(y)}a${r} ${r} 0 1 0 ${2 * r} 0a${r} ${r} 0 1 0 ${-2 * r} 0`;

  // ---------------------------------------------------------------- state
  let scene = 0;
  let freq = 1;
  const g = { fibre: 1, spread: 1 };
  let dirty = true;
  const cur = [];
  const spreadPt = (p) => [C[0] + (p[0] - C[0]) * g.spread, C[1] + (p[1] - C[1]) * g.spread];
  const fibrePt = (cell, v, r = 1) => {
    const c = spreadPt(cell.c);
    return [c[0] + (v[0] - cell.c[0]) * BASE * g.fibre * r, c[1] + (v[1] - cell.c[1]) * BASE * g.fibre * r];
  };
  function drawTissue() {
    let f1d = "";
    let f2d = "";
    let myo = "";
    let nuc = "";
    DATA.cells.forEach((cell, i) => {
      const F = DATA.fibres[i];
      const d = smooth(cell.poly.map((v) => fibrePt(cell, v)));
      if (F.type === 1) f1d += d;
      else f2d += d;
      const c = spreadPt(cell.c);
      for (const [dx, dy] of F.dots) myo += dot(c[0] + dx * BASE * g.fibre, c[1] + dy * BASE * g.fibre, 1.2);
      for (const k of F.nuclei) {
        const v = cell.poly[k];
        const w = cell.poly[(k + 1) % cell.poly.length];
        const m = [(v[0] + w[0]) / 2, (v[1] + w[1]) / 2];
        const p = fibrePt(cell, m, 0.86);
        const ang = (Math.atan2(w[1] - v[1], w[0] - v[0]) * 180) / Math.PI;
        const ux = Math.cos((ang * Math.PI) / 180);
        const uy = Math.sin((ang * Math.PI) / 180);
        nuc += `M${f1(p[0] - ux * 5)} ${f1(p[1] - uy * 5)}A5 2.4 ${ang.toFixed(0)} 1 0 ${f1(p[0] + ux * 5)} ${f1(p[1] + uy * 5)}A5 2.4 ${ang.toFixed(0)} 1 0 ${f1(p[0] - ux * 5)} ${f1(p[1] - uy * 5)}Z`;
      }
    });
    set("fib1", "d", f1d);
    set("fib2", "d", f2d);
    set("myo", "d", myo);
    set("nuc", "d", nuc);
    set("caps", "d", DATA.caps.map((p) => dot(...spreadPt(p), 5.2)).join(""));
    set("capl", "d", DATA.caps.map((p) => dot(...spreadPt(p), 2.6)).join(""));
    for (const part of ["ecw", "peri"]) {
      const pad = part === "peri" ? 9 : 0;
      set(part, "rx", f1(DATA.RX * g.spread + pad));
      set(part, "ry", f1(DATA.RY * g.spread + pad));
    }
    drawBody();
  }
  // the 3-D bundle behind the slice: sheath, fluid, the outer fibres running back with their
  // cross-striations, capillaries in the grooves, a cylinder shade
  const B = DATA.body;
  function drawBody() {
    if (!B) return;
    const P = (sx, y, sy) => [B.o[0] + sx * B.ex[0] + y * B.ey[0] + (B.H - sy) * B.ez[0], B.o[1] + sx * B.ex[1] + y * B.ey[1] + (B.H - sy) * B.ez[1]];
    const R = (t, pad, y) => P(C[0] + Math.cos(t) * (DATA.RX * g.spread + pad), y, C[1] + Math.sin(t) * (DATA.RY * g.spread + pad));
    const L = (p, c = "L") => `${c}${f1(p[0])} ${f1(p[1])}`;
    const steps = (t0, t1) => {
      const n = Math.max(1, Math.ceil((t1 - t0) / 0.05));
      return Array.from({ length: n + 1 }, (_, i) => t0 + ((t1 - t0) * i) / n);
    };
    const band = (t0, t1, pad) => {
      const ts = steps(t0, t1);
      return ts.map((t, i) => L(R(t, pad, B.D), i ? "L" : "M")).join("") + [...ts].reverse().map((t) => L(R(t, pad, 0))).join("") + "Z";
    };
    const clampT = (t) => Math.max(B.ta, Math.min(B.tb, t < B.ta - 1 ? t + 2 * Math.PI : t));
    const all = band(B.ta, B.tb, 9);
    set("bodySheath", "d", all);
    set("bodyVeil", "d", all);
    set("bodyShade", "d", all);
    set("bodyGap", "d", band(B.ta, B.tb, 0));
    let f1d = "", f2d = "", stri = "", cap = "";
    for (const s of B.spans) {
      const m = (s.a0 + s.a1) / 2;
      const h = ((s.a1 - s.a0) / 2) * BASE * g.fibre / g.spread; // fibre share of its cell, as on the face
      const t0 = clampT(m - h);
      const t1 = clampT(m + h);
      if (t1 - t0 < 0.01) continue;
      const d = band(t0, t1, -0.5);
      if (s.type === 1) f1d += d;
      else f2d += d;
      for (let y = 5; y < B.D; y += 8) stri += steps(t0, t1).map((t, i) => L(R(t, -0.5, y), i ? "L" : "M")).join("");
      const tc = clampT(s.a1);
      if (tc > B.ta + 0.04 && tc < B.tb - 0.04) cap += L(R(tc, 0.6, B.D - 2), "M") + L(R(tc, 0.6, 2));
    }
    set("bodyF1", "d", f1d);
    set("bodyF2", "d", f2d);
    set("bodyStri", "d", stri);
    set("bodyCap", "d", cap);
    set("bodyEdge", "d", L(R(B.ta, 9, B.D), "M") + steps(B.ta, B.tb).map((t) => L(R(t, 9, 0))).join("") + L(R(B.tb, 9, B.D)));
    // the shade runs across the body, square to its axis
    const n = [-B.ey[1], B.ey[0]];
    const len = Math.hypot(...n);
    const u = [n[0] / len, n[1] / len];
    const pts = steps(B.ta, B.tb).flatMap((t) => [R(t, 9, 0), R(t, 9, B.D)]);
    const dots = pts.map((p) => p[0] * u[0] + p[1] * u[1]);
    const lo = pts[dots.indexOf(Math.min(...dots))];
    const span = Math.max(...dots) - Math.min(...dots);
    const grad = svg.querySelector("#a8-cyl");
    grad.setAttribute("x1", f1(lo[0]));
    grad.setAttribute("y1", f1(lo[1]));
    grad.setAttribute("x2", f1(lo[0] + u[0] * span));
    grad.setAttribute("y2", f1(lo[1] + u[1] * span));
  }
  function spawn(inside) {
    if (inside) {
      const i = Math.floor(Math.random() * DATA.cells.length);
      const cell = DATA.cells[i];
      const v = cell.poly[Math.floor(Math.random() * cell.poly.length)];
      return { inside, i, v, r: Math.sqrt(Math.random()) * 0.7, age: Math.random() * 0.6, life: 0.7 + Math.random() * 0.6 };
    }
    return { inside, p: DATA.gaps[Math.floor(Math.random() * DATA.gaps.length)], age: Math.random() * 0.6, life: 0.7 + Math.random() * 0.6 };
  }
  const N = 96;
  function stepCurrent(dt) {
    const want = Math.round(N * DATA.share[freq]);
    let inside = cur.filter((c) => c.inside).length;
    for (let k = cur.length - 1; k >= 0; k--) {
      const c = cur[k];
      c.age += dt;
      if (c.age > c.life) {
        cur.splice(k, 1);
        if (c.inside) inside--;
      }
    }
    while (cur.length < N) {
      const inn = inside < want;
      cur.push(spawn(inn));
      if (inn) inside++;
    }
  }
  function drawCurrent() {
    let ring = "";
    let dots = "";
    for (const c of cur) {
      const a = Math.sin(Math.PI * Math.min(1, c.age / c.life));
      if (a < 0.15) continue;
      const p = c.inside ? fibrePt(DATA.cells[c.i], c.v, c.r) : spreadPt(c.p);
      const rr = 2.2 + 2.4 * a;
      ring += dot(p[0], p[1], rr);
      dots += dot(p[0], p[1], 1.1);
    }
    set("curRing", "d", ring);
    set("curDot", "d", dots);
  }

  // ---------------------------------------------------------------- input, tour, loop
  function readout(quiet) {
    const sc = S[scene];
    const r = ratioOf(sc);
    out.ratio.textContent = r.toFixed(3);
    out.band.textContent = bandOf(r);
    out.through.textContent = `${Math.round(DATA.share[freq] * 100)}%`;
    line.textContent = DATA.lines[scene];
    sceneBtns.forEach((b, j) => {
      b.setAttribute("aria-checked", j === scene ? "true" : "false");
      b.tabIndex = j === scene ? 0 : -1;
    });
    freqBtns.forEach((b, j) => {
      b.setAttribute("aria-checked", j === freq ? "true" : "false");
      b.tabIndex = j === freq ? 0 : -1;
    });
    if (!quiet) status.textContent = `${sc.label}: ECW/TBW ${r.toFixed(3)}, ${bandOf(r)}. At ${DATA.freqs[freq]} kHz about ${Math.round(DATA.share[freq] * 100)}% of the current passes through the fibres.`;
  }
  let touring = true;
  let idle = -1e9;
  let tourClock = 0;
  const takeOver = () => {
    touring = false;
    idle = performance.now();
  };
  const wire = (btns, name, apply) => {
    btns.forEach((b, i) =>
      b.addEventListener("click", () => {
        takeOver();
        apply(i);
        readout();
        if (still.matches) renderStill();
      }),
    );
    for (const b of btns) b.addEventListener("pointerdown", takeOver);
    fig.querySelector(`[data-control="${name}"]`).addEventListener("keydown", (ev) => {
      const i = btns.indexOf(document.activeElement);
      if (i < 0) return;
      const j = ev.key === "ArrowRight" || ev.key === "ArrowDown" ? i + 1 : ev.key === "ArrowLeft" || ev.key === "ArrowUp" ? i - 1 : null;
      if (j === null) return;
      ev.preventDefault();
      const b = btns[(j + btns.length) % btns.length];
      b.focus();
      b.click();
    });
  };
  wire(sceneBtns, "scene", (i) => (scene = i));
  wire(freqBtns, "freq", (i) => (freq = i));
  function renderStill() {
    g.fibre = S[scene].fibre;
    g.spread = S[scene].spread;
    cur.length = 0;
    stepCurrent(0);
    drawTissue();
    drawCurrent();
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
    if (touring && (tourClock += dt) > 4.5) {
      // tour: walk the frequencies on the typical tissue, then the scenes at 50 kHz
      tourClock = 0;
      const steps = [[0, 0], [0, 1], [0, 3], [1, 1], [2, 1], [3, 1]];
      const at = steps.findIndex(([s, f]) => s === scene && f === freq);
      [scene, freq] = steps[(at + 1) % steps.length];
      readout(true);
    }
    const sc = S[scene];
    const e = 1 - Math.exp(-dt * 3);
    const before = g.fibre + g.spread;
    g.fibre += (sc.fibre - g.fibre) * e;
    g.spread += (sc.spread - g.spread) * e;
    if (Math.abs(g.fibre + g.spread - before) > 1e-5 || dirty) {
      drawTissue();
      dirty = false;
    }
    stepCurrent(dt);
    drawCurrent();
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
  renderStill();
  if (!still.matches) start();
}
