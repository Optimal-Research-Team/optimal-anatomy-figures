// A4 live code: the heart cut open, beating at the chosen rate. Everything is redrawn from the
// beat model each frame through one deformation field: the chambers squeeze toward their middles,
// the walls thicken, and the valve plane is pulled down toward the apex as the ventricles empty.
const DATA = __DATA__;

function mount(fig) {
  const svg = fig.querySelector("svg");
  const q = (s) => svg.querySelector(s);
  const still = matchMedia("(prefers-reduced-motion: reduce)");
  const out = Object.fromEntries([...fig.querySelectorAll("[data-r]")].map((n) => [n.dataset.r, n]));
  const status = fig.querySelector("[data-status]");
  const line = fig.querySelector("[data-scene]");
  const buttons = [...fig.querySelectorAll('[data-control="rate"] .opt-seg-btn')];
  const slowBtn = fig.querySelector("[data-slow]");
  const G = DATA.geo;
  const set = (sel, d) => q(sel).setAttribute("d", d);
  const f1 = (v) => v.toFixed(1);

  // ---------------------------------------------------------------- shapes
  function smooth(points, closed = true, k = 1) {
    const n = points.length;
    const at = (i) => points[closed ? (i + n) % n : Math.max(0, Math.min(n - 1, i))];
    let d = `M${f1(points[0][0])} ${f1(points[0][1])}`;
    for (let i = 0; i < (closed ? n : n - 1); i++) {
      const p0 = at(i - 1), p1 = at(i), p2 = at(i + 1), p3 = at(i + 2);
      d += `C${f1(p1[0] + ((p2[0] - p0[0]) / 6) * k)} ${f1(p1[1] + ((p2[1] - p0[1]) / 6) * k)} ${f1(p2[0] - ((p3[0] - p1[0]) / 6) * k)} ${f1(p2[1] - ((p3[1] - p1[1]) / 6) * k)} ${f1(p2[0])} ${f1(p2[1])}`;
    }
    return d + (closed ? "Z" : "");
  }
  function curve(points, samples = 10) {
    // sampled Catmull-Rom centreline
    const out2 = [];
    const n = points.length;
    for (let i = 0; i < n - 1; i++) {
      const p0 = points[Math.max(0, i - 1)], p1 = points[i], p2 = points[i + 1], p3 = points[Math.min(n - 1, i + 2)];
      for (let s = 0; s < samples; s++) {
        const t = s / samples, t2 = t * t, t3 = t2 * t;
        out2.push([0, 1].map((c) => 0.5 * (2 * p1[c] + (-p0[c] + p2[c]) * t + (2 * p0[c] - 5 * p1[c] + 4 * p2[c] - p3[c]) * t2 + (-p0[c] + 3 * p1[c] - 3 * p2[c] + p3[c]) * t3)));
      }
    }
    out2.push(points[n - 1]);
    return out2;
  }
  function tube(points, w0, w1 = w0) {
    // a closed vessel outline round a centreline, tapering w0 → w1
    const c = curve(points);
    const L = [];
    const R = [];
    c.forEach((p, i) => {
      const a = c[Math.max(0, i - 1)];
      const b = c[Math.min(c.length - 1, i + 1)];
      let nx = -(b[1] - a[1]);
      let ny = b[0] - a[0];
      const l = Math.hypot(nx, ny) || 1;
      nx /= l;
      ny /= l;
      const w = (w0 + (w1 - w0) * (i / (c.length - 1))) / 2;
      L.push([p[0] + nx * w, p[1] + ny * w]);
      R.push([p[0] - nx * w, p[1] - ny * w]);
    });
    const pts = [...L, ...R.reverse()];
    return `M${pts.map((p) => `${f1(p[0])} ${f1(p[1])}`).join("L")}Z`;
  }
  /** A vessel: tube, a sheen on the side facing the light (upper left), and cut ends showing the lumen. */
  function vessel(name, list, cls) {
    let h = "";
    for (const [pts, w0, w1, capA, capB] of list) {
      const c = curve(pts);
      const wAt = (i) => w0 + (w1 - w0) * (i / (c.length - 1));
      const nAt = (i) => {
        const a = c[Math.max(0, i - 1)];
        const b = c[Math.min(c.length - 1, i + 1)];
        const l = Math.hypot(b[0] - a[0], b[1] - a[1]) || 1;
        return [-(b[1] - a[1]) / l, (b[0] - a[0]) / l];
      };
      let side = 0;
      c.forEach((_, i) => {
        const n = nAt(i);
        side += -n[0] - n[1];
      });
      side = side >= 0 ? 1 : -1;
      const i0 = Math.floor(c.length * 0.06);
      const i1 = Math.ceil(c.length * 0.94);
      let sh = "";
      for (let i = i0; i < i1; i++) {
        const n = nAt(i);
        const o = side * wAt(i) * 0.24;
        sh += `${sh ? "L" : "M"}${f1(c[i][0] + n[0] * o)} ${f1(c[i][1] + n[1] * o)}`;
      }
      h += `<path class="a4-${cls} a4-vessel" d="${tube(pts, w0, w1)}"/><path class="a4-sheen" d="${sh}" style="stroke-width:${f1(Math.min(w0, w1) * 0.2)}px"/>`;
      for (const [on, i, w] of [[capA, 0, w0], [capB, c.length - 1, w1]]) {
        if (!on) continue;
        const n = nAt(i);
        const ang = ((Math.atan2(n[1], n[0]) * 180) / Math.PI).toFixed(0);
        const e = (k) => {
          const a = (w / 2) * k;
          const b = a * 0.36;
          return `M${f1(c[i][0] - n[0] * a)} ${f1(c[i][1] - n[1] * a)}A${f1(a)} ${f1(b)} ${ang} 1 0 ${f1(c[i][0] + n[0] * a)} ${f1(c[i][1] + n[1] * a)}A${f1(a)} ${f1(b)} ${ang} 1 0 ${f1(c[i][0] - n[0] * a)} ${f1(c[i][1] - n[1] * a)}Z`;
        };
        h += `<path class="a4-cap a4-cap-${cls}" d="${e(1)}"/><path class="a4-lumen a4-lumen-${cls}" d="${e(0.68)}"/>`;
      }
    }
    q(`[data-v="${name}"]`).innerHTML = h;
  }
  const centroid = (pts) => pts.reduce((a, p) => [a[0] + p[0] / pts.length, a[1] + p[1] / pts.length], [0, 0]);
  const C = { RA: centroid(G.RA), LA: centroid(G.LA), RV: centroid(G.RV), LV: centroid(G.LV), V: [320, 392] };
  const FIB = { lv: G.LV.filter((p) => p[1] > G.AVY + 16), rv: G.RV.slice(0, 6) };

  // ---------------------------------------------------------------- the deformation field
  let def = { d: 0, sV: 1, sA: 1, sO: 1 };
  const wOf = (y) => (y <= G.AVY ? 1 : y >= G.APEXY ? 0 : (G.APEXY - y) / (G.APEXY - G.AVY));
  const shift = (p) => [p[0], p[1] + def.d * wOf(p[1])];
  const scaleAbout = (p, c, s) => [c[0] + (p[0] - c[0]) * s, c[1] + (p[1] - c[1]) * s];
  const cav = (pts, c, s) => pts.map((p) => shift(scaleAbout(p, c, s)));
  const outer = () =>
    G.OUT.map((p) => {
      if (p[1] > G.AVY - 4) return shift(scaleAbout(p, C.V, def.sO));
      const c = p[0] < 300 ? C.RA : C.LA;
      return shift(scaleAbout(p, c, 0.94 + 0.06 * def.sA));
    });

  // ---------------------------------------------------------------- valves
  function leaflet(h, ang, L, w = 6) {
    const a = (ang * Math.PI) / 180;
    const ux = Math.cos(a), uy = Math.sin(a);
    const nx = -uy, ny = ux;
    const t = [h[0] + ux * L, h[1] + uy * L];
    const m = [h[0] + ux * L * 0.55, h[1] + uy * L * 0.55];
    return smooth([[h[0] + nx * w * 0.5, h[1] + ny * w * 0.5], [m[0] + nx * w * 0.42, m[1] + ny * w * 0.42], t, [m[0] - nx * w * 0.42, m[1] - ny * w * 0.42], [h[0] - nx * w * 0.5, h[1] - ny * w * 0.5]], true, 0.8);
  }
  const lerp = (a, b, t) => a + (b - a) * t;
  function valves(b) {
    let d = "";
    const tips = [];
    // AV valves hang into the ventricle when open, meet across the ring when shut (bulging a little toward the atrium)
    for (const [l, r, L] of [[G.TRI[0], G.TRI[1], 27], [G.MIT[0], G.MIT[1], 31]]) {
      const hl = shift(l);
      const hr = shift(r);
      const al = lerp(-8, 72, b.av);
      const ar = lerp(188, 108, b.av);
      d += leaflet(hl, al, L) + leaflet(hr, ar, L);
      tips.push([hl[0] + Math.cos((al * Math.PI) / 180) * L, hl[1] + Math.sin((al * Math.PI) / 180) * L], [hr[0] + Math.cos((ar * Math.PI) / 180) * L, hr[1] + Math.sin((ar * Math.PI) / 180) * L]);
    }
    // semilunar valves: cusps meet in a V when shut, pressed up against the wall when open
    for (const [l, r] of [G.PUL, G.AOR]) {
      const hl = shift(l);
      const hr = shift(r);
      const L = (r[0] - l[0]) * 0.58;
      d += leaflet(hl, lerp(28, -78, b.semi), L, 5) + leaflet(hr, lerp(152, -102, b.semi), L, 5);
    }
    return { d, tips };
  }

  // ---------------------------------------------------------------- blood: right side blue, left side red
  const rnd = (a, b) => a + Math.random() * (b - a);
  const cells = [];
  let spawnR = 0;
  let spawnL = 0;
  function spawn(side) {
    if (side === "R") {
      const fromTop = Math.random() < 0.55;
      cells.push({ side, stage: 0, p: fromTop ? [rnd(165, 188), -6] : [rnd(78, 98), 372], path: fromTop ? [[176, 120]] : [[132, 288]], wait: G.RAin, j: [rnd(-16, 16), rnd(-16, 16)] });
    } else cells.push({ side, stage: 0, p: [560, Math.random() < 0.5 ? 168 : 214], path: [[470, 196]], wait: G.LAin, j: [rnd(-16, 16), rnd(-14, 14)] });
  }
  function moveTo(c, t, v, dt) {
    const dx = t[0] - c.p[0], dy = t[1] - c.p[1];
    const d = Math.hypot(dx, dy);
    if (d <= v * dt) {
      c.p = [t[0], t[1]];
      return true;
    }
    c.p = [c.p[0] + (dx / d) * v * dt, c.p[1] + (dy / d) * v * dt];
    return false;
  }
  function stepCells(b, dt, hr) {
    const v = 70 * (hr / 60);
    for (const c of cells) {
      if (c.a === undefined) (c.a = Math.random() * Math.PI), (c.spin = (Math.random() - 0.5) * 3);
      c.a += c.spin * dt;
    }
    spawnR += dt * 6 * (hr / 60);
    spawnL += dt * 6 * (hr / 60);
    while (spawnR > 1) (spawnR -= 1), spawn("R");
    while (spawnL > 1) (spawnL -= 1), spawn("L");
    for (let i = cells.length - 1; i >= 0; i--) {
      const c = cells[i];
      const R = c.side === "R";
      const atrium = R ? C.RA : C.LA;
      const vent = R ? C.RV : C.LV;
      const ring = R ? G.TRIc : G.MITc;
      const exitV = R ? G.PULc : G.AORc;
      if (c.stage === 0) {
        // vein → atrium
        if (moveTo(c, c.path[0], v * 0.9, dt)) c.stage = 1;
      } else if (c.stage === 1) {
        moveTo(c, shift([atrium[0] + c.j[0], atrium[1] + c.j[1]]), v * 0.5, dt);
        if (b.av > 0.5) c.stage = 2;
      } else if (c.stage === 2) {
        // through the open AV valve into the ventricle
        if (moveTo(c, shift(ring), v * 1.3, dt)) c.stage = 3;
      } else if (c.stage === 3) {
        moveTo(c, shift([vent[0] + c.j[0] * 1.6, vent[1] + c.j[1] * 2.2]), v * 0.9, dt);
        if (b.semi > 0.5) c.stage = 4;
      } else if (c.stage === 4) {
        if (moveTo(c, shift(exitV), v * 2.2, dt)) {
          c.stage = 5;
          c.out = (R ? G.PULout : G.AORout)[Math.floor(Math.random() * (R ? G.PULout : G.AORout).length)];
        }
      } else if (c.stage === 5) {
        const way = c.out;
        if (moveTo(c, way[c.k ?? 0], v * 1.8, dt)) {
          c.k = (c.k ?? 0) + 1;
          if (c.k >= way.length) cells.splice(i, 1);
        }
      }
    }
  }

  // ---------------------------------------------------------------- the ECG strip
  const ECG = DATA.ecg;
  const trace = [];
  function ecgDraw(clock, u, hr) {
    trace.push([clock, ecgAt(hr, u)]);
    while (trace.length && clock - trace[0][0] > ECG.span) trace.shift();
    let d = "";
    for (const [t, v] of trace) d += `${d ? "L" : "M"}${f1(ECG.x0 + ((t - clock + ECG.span) / ECG.span) * ECG.w)} ${f1(ECG.y - v * ECG.h)}`;
    set('[data-part="ecg"]', d);
    const last = trace[trace.length - 1];
    const dot = q('[data-part="ecgdot"]');
    dot.setAttribute("cx", f1(ECG.x0 + ECG.w));
    dot.setAttribute("cy", f1(ECG.y - last[1] * ECG.h));
  }

  // ---------------------------------------------------------------- one frame
  function draw(b, hr) {
    const sV = Math.sqrt(b.V / 140);
    const contr = Math.min(1, Math.max(0, (b.edv - b.V) / (b.edv - b.esv)));
    def = { d: 15 * contr, sV, sA: b.A, sO: 1 - 0.22 * (1 - sV) };
    const sA = 0.78 + 0.22 * b.A;
    set('[data-part="outer"]', smooth(outer()));
    set('[data-part="ra"]', smooth(cav(G.RA, C.RA, sA)));
    set('[data-part="la"]', smooth(cav(G.LA, C.LA, sA)));
    set('[data-part="rv"]', smooth(cav(G.RV, C.RV, sV)));
    set('[data-part="lv"]', smooth(cav(G.LV, C.LV, sV)));
    // vessels: tops fixed, roots ride the valve plane; open ends are cut, showing the lumen
    vessel("svc", [[[[158, -12], [166, 60], [176, 120], shift([180, 176])], 38, 46, false, false]], "ven");
    vessel("ivc", [[[[84, 384], [108, 330], shift([142, 276])], 40, 38, true, false]], "ven");
    vessel("desc", [[[[470, 110], [480, 170], [486, 260], [492, 380], [494, 470]], 34, 32, false, true]], "art");
    vessel("aorta", [[[shift(G.AORc), shift([342, 196]), [338, 120], [356, 72], [410, 52], [452, 70], [470, 112]], 40, 36, false, false]], "art");
    vessel("branches", [[[[376, 60], [372, 14]], 16, 14, false, true], [[[408, 52], [412, 8]], 16, 14, false, true], [[[440, 62], [456, 18]], 16, 14, false, true]], "art");
    vessel("pt", [[[shift(G.PULc), shift([276, 186]), [284, 140], [318, 126], [362, 120], [404, 128]], 36, 26, false, true]], "ven");
    vessel("rpa", [[[[284, 142], [244, 124], [196, 116], [150, 120]], 26, 22, false, true]], "ven");
    vessel("pv", [[[[566, 168], [520, 168], shift([466, 176])], 18, 18, true, false], [[[566, 214], [520, 214], shift([464, 212])], 18, 18, true, false]], "art");
    // muscle fibres wrap the ventricles and squeeze with them
    const fib = (seed, c, k, s) => smooth(seed.map((p) => shift(scaleAbout(p, c, k * s))), false, 1);
    const sMid = (sV + def.sO) / 2;
    set('[data-part="fibres"]', [1.12, 1.27, 1.42].map((k) => fib(FIB.lv, C.LV, k, sMid)).join("") + [1.1, 1.22].map((k) => fib(FIB.rv, C.RV, k, sMid)).join(""));
    set('[data-part="outerClip"]', smooth(outer()));
    // papillary muscles ride the ventricle walls; chordae run from the leaflet tips down to them
    const pap = [cav([G.PAPR], C.RV, 0.82 + 0.18 * sV)[0], cav([G.PAPL[0]], C.LV, 0.82 + 0.18 * sV)[0], cav([G.PAPL[1]], C.LV, 0.82 + 0.18 * sV)[0]];
    set('[data-part="pap"]', pap.map((p, i) => smooth([[p[0] - 7, p[1] + 10], [p[0] - 5, p[1] - 8], [p[0], p[1] - 13], [p[0] + 5, p[1] - 8], [p[0] + 7, p[1] + 10], [p[0], p[1] + 16]], true, 0.9)).join(""));
    const v = valves(b);
    set('[data-part="valves"]', v.d);
    const ch = [[v.tips[0], pap[0]], [v.tips[1], pap[0]], [v.tips[2], pap[1]], [v.tips[3], pap[2]]];
    set('[data-part="chordae"]', ch.map(([a, p]) => [-3, 0, 3].map((o) => `M${f1(a[0])} ${f1(a[1])}L${f1(p[0] + o)} ${f1(p[1] - 11)}`).join("")).join(""));
    // blood cells
    const disc = (c, rx, ry) => {
      const ux = Math.cos(c.a);
      const uy = Math.sin(c.a);
      const ang = ((c.a * 180) / Math.PI).toFixed(0);
      return `M${f1(c.p[0] - ux * rx)} ${f1(c.p[1] - uy * rx)}A${rx} ${ry} ${ang} 1 0 ${f1(c.p[0] + ux * rx)} ${f1(c.p[1] + uy * rx)}A${rx} ${ry} ${ang} 1 0 ${f1(c.p[0] - ux * rx)} ${f1(c.p[1] - uy * rx)}Z`;
    };
    for (const side of ["R", "L"]) {
      const list = cells.filter((c) => c.side === side);
      set(`[data-part="cells${side}"]`, list.map((c) => disc(c, 4, 2.7)).join(""));
      set(`[data-part="pal${side}"]`, list.map((c) => disc(c, 1.8, 1.1)).join(""));
    }
    // a soft glow as the ventricles squeeze
    q('[data-part="glow"]').setAttribute("opacity", (0.15 + 0.5 * contr).toFixed(2));
  }

  // ---------------------------------------------------------------- state, input, tour
  let rateAt = 0;
  let hr = HEART.rates[0];
  let hrShown = hr;
  let t = 0.6;
  let clock = 0;
  let speed = 1;
  function setRate(i, quiet) {
    rateAt = i;
    hr = HEART.rates[i];
    const v = volumesOf(hr);
    out.hr.textContent = `${hr} bpm`;
    out.sv.textContent = `${Math.round(v.sv)} ml`;
    out.co.textContent = `${v.co.toFixed(1)} L/min`;
    line.textContent = DATA.lines[i];
    buttons.forEach((b, j) => {
      b.setAttribute("aria-checked", j === i ? "true" : "false");
      b.tabIndex = j === i ? 0 : -1;
    });
    if (!quiet) status.textContent = `${hr} beats a minute: each beat pushes out about ${Math.round(v.sv)} millilitres, ${v.co.toFixed(1)} litres a minute.`;
  }
  const takeOver = () => {
    touring = false;
    idle = performance.now();
  };
  buttons.forEach((b, i) =>
    b.addEventListener("click", () => {
      takeOver();
      setRate(i);
      if (still.matches) renderStill();
    }),
  );
  fig.querySelector('[data-control="rate"]').addEventListener("keydown", (e) => {
    const i = buttons.indexOf(document.activeElement);
    if (i < 0) return;
    const j = e.key === "ArrowRight" || e.key === "ArrowDown" ? i + 1 : e.key === "ArrowLeft" || e.key === "ArrowUp" ? i - 1 : null;
    if (j === null) return;
    e.preventDefault();
    const b = buttons[(j + buttons.length) % buttons.length];
    b.focus();
    b.click();
  });
  slowBtn.addEventListener("click", () => {
    speed = speed === 1 ? 0.25 : 1;
    slowBtn.setAttribute("aria-pressed", speed < 1 ? "true" : "false");
    slowBtn.textContent = speed < 1 ? "Real time" : "Slow";
  });
  function renderStill() {
    // mid-ejection: aortic and pulmonary valves open, the base pulled down, the ECG just past its spike
    hrShown = hr;
    const T = timingOf(hr);
    const u = T.ta + HEART.ivc + T.ts * 0.35;
    trace.length = 0;
    for (let i = 0; i <= 120; i++) {
      const tt = -2.2 + (i / 120) * 2.2;
      trace.push([tt, ecgAt(hr, (((u + tt) % T.T) + T.T) % T.T)]);
    }
    const b = beatAt(hr, u);
    cells.length = 0;
    for (let i = 0; i < 26; i++) spawn(i % 2 ? "R" : "L");
    for (let i = 0; i < 90; i++) stepCells(beatAt(hr, u - 0.9 + i * 0.01), 0.012, hr);
    draw(b, hr);
    ecgDraw(0, u, hr);
  }
  let touring = true;
  let idle = -1e9;
  let tourClock = 0;
  let raf = 0;
  let last = 0;
  let visible = true;
  function tick(now) {
    raf = 0;
    if (!visible || still.matches) return;
    const dt = Math.min(0.05, last ? (now - last) / 1000 : 0.016) * speed;
    last = now;
    if (!touring && now - idle > 9000) touring = true;
    if (touring && (tourClock += dt / speed) > 7) {
      tourClock = 0;
      setRate((rateAt + 1) % HEART.rates.length, true);
    }
    // the rate eases to its new value over a beat or two (phase kept continuous)
    const T0 = 60 / hrShown;
    const phase = (t % T0) / T0;
    hrShown += (hr - hrShown) * (1 - Math.exp(-dt * 2.5));
    const T1 = 60 / hrShown;
    t = phase * T1 + dt;
    clock += dt;
    const b = beatAt(hrShown, t);
    stepCells(b, dt, hrShown);
    draw(b, hrShown);
    ecgDraw(clock, b.u, hrShown);
    raf = requestAnimationFrame(tick);
  }
  const start = () => {
    if (!raf && visible && !still.matches) {
      last = 0;
      raf = requestAnimationFrame(tick);
    }
  };
  new IntersectionObserver((entries) => {
    visible = entries.some((e) => e.isIntersecting);
    if (visible) start();
  }).observe(svg);
  still.addEventListener("change", () => (still.matches ? renderStill() : start()));
  for (const b of buttons) b.addEventListener("pointerdown", takeOver);
  setRate(0, true);
  if (still.matches) renderStill();
  else {
    for (let i = 0; i < 160; i++) {
      t += 1 / 60;
      stepCells(beatAt(hr, t), 1 / 60, hr);
    }
    draw(beatAt(hr, t), hr);
    start();
  }
}
