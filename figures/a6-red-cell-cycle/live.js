// A6 live code: every drawn red cell is one normal day's output, placed on the arc by its age.
// Birth days come from inverting madeBy() (cumulative production from Fig 3's model), so after
// IV iron the cells crowd closer and fuller from the marrow end at exactly the pace the model's
// haemoglobin rises. The spleen macrophage's ferritin granules follow the model's ferritin.
const DATA = __DATA__;

function mount(fig) {
  const svg = fig.querySelector("svg");
  const q = (s) => svg.querySelector(s);
  const still = matchMedia("(prefers-reduced-motion: reduce)");
  const out = Object.fromEntries([...fig.querySelectorAll("[data-r]")].map((n) => [n.dataset.r, n]));
  const status = fig.querySelector("[data-status]");
  const line = fig.querySelector("[data-scene]");
  const buttons = [...fig.querySelectorAll('[data-control="mode"] .opt-seg-btn')];
  const f1 = (v) => v.toFixed(1);
  const { S, mac: MAC, mon: MON } = DATA;
  const set = (part, d) => q(`[data-part="${part}"]`).setAttribute("d", d);

  // ---------------------------------------------------------------- back halves (static: drawn once)
  // Everything is cut in half by the plane of the drawing: the bone (lengthwise, showing its marrow),
  // the spleen, the vessel arc and the transferrin return. Behind the cut each keeps its round back half.
  {
    const RB = roundBack(DATA.far);
    const mixc = (c, to, t) => c.map((v, i) => Math.round(v + (to[i] - v) * t));
    const tonesOf = (name, fb, dark = 0.34, light = 0.22) => {
      const c = RB.rgbOf(fig, name, fb);
      return [mixc(c, [0, 0, 0], dark), mixc(c, [255, 255, 255], light)];
    };
    const blob = (pts, tones) => {
      const closed = RB.sampleClosed(pts, 1, 6);
      const ring = RB.byLength([...closed, closed[0]], 65).slice(0, -1);
      const cx = ring.reduce((a, p) => a + p[0], 0) / ring.length;
      const cy = ring.reduce((a, p) => a + p[1], 0) / ring.length;
      return RB.rim(ring, { rho: (p) => 0.9 * Math.hypot(p[0] - cx, p[1] - cy), nphi: 8, tones });
    };
    const halfTube = (centre, w0, w1, n, tones) => {
      const c = RB.byLength(centre, n);
      const Ae = [];
      const Be = [];
      c.forEach((p, i) => {
        const a = c[Math.max(0, i - 1)];
        const b = c[Math.min(c.length - 1, i + 1)];
        const l = Math.hypot(b[0] - a[0], b[1] - a[1]) || 1;
        const nn = [-(b[1] - a[1]) / l, (b[0] - a[0]) / l];
        const w = (w0 + (w1 - w0) * (i / (c.length - 1))) / 2;
        Ae.push([p[0] + nn[0] * w, p[1] + nn[1] * w]);
        Be.push([p[0] - nn[0] * w, p[1] - nn[1] * w]);
      });
      return RB.chords(Ae, Be, { round: 1, nphi: 12, tones });
    };
    q('[data-part="far"]').innerHTML = RB.paintObjects([
      blob(DATA.far.bone, tonesOf("--a6-cortex", "#f4ead4", 0.3, 0.1)),
      blob(DATA.far.spleen, tonesOf("--a6-sp0", "#b2464a")),
      halfTube(DATA.ret, 14, 12, 26, tonesOf("--a6-ret-edge", "#a8925a")),
      halfTube(DATA.arc, 34, 30, 36, tonesOf("--a6-arc-edge", "#a8574c")),
    ]);
  }

  // ---------------------------------------------------------------- paths
  const measure = (pts) => {
    const acc = [0];
    for (let i = 1; i < pts.length; i++) acc.push(acc[i - 1] + Math.hypot(pts[i][0] - pts[i - 1][0], pts[i][1] - pts[i - 1][1]));
    return { pts, acc, L: acc[acc.length - 1] };
  };
  const along = (m, u) => {
    const s = Math.max(0, Math.min(1, u)) * m.L;
    let lo = 1;
    let hi = m.acc.length - 1;
    while (lo < hi) {
      const mid = (lo + hi) >> 1;
      if (m.acc[mid] < s) lo = mid + 1;
      else hi = mid;
    }
    const a = m.pts[lo - 1];
    const b = m.pts[lo];
    const t = (s - m.acc[lo - 1]) / (m.acc[lo] - m.acc[lo - 1] || 1);
    const l = Math.hypot(b[0] - a[0], b[1] - a[1]) || 1;
    return { x: a[0] + (b[0] - a[0]) * t, y: a[1] + (b[1] - a[1]) * t, tx: (b[0] - a[0]) / l, ty: (b[1] - a[1]) / l };
  };
  const ARC = measure(DATA.arc);
  const RET = measure(DATA.ret);
  const SIN = measure(DATA.sinus);
  const hash = (n) => {
    const x = Math.sin(n * 127.1 + 311.7) * 43758.5453;
    return x - Math.floor(x);
  };
  const ell = (x, y, rx, ry, tx, ty) => {
    const ang = ((Math.atan2(ty, tx) * 180) / Math.PI).toFixed(0);
    const ax = tx * rx;
    const ay = ty * rx;
    return `M${f1(x - ax)} ${f1(y - ay)}A${f1(rx)} ${f1(ry)} ${ang} 1 0 ${f1(x + ax)} ${f1(y + ay)}A${f1(rx)} ${f1(ry)} ${ang} 1 0 ${f1(x - ax)} ${f1(y - ay)}Z`;
  };
  const dot = (x, y, r) => `M${f1(x - r)} ${f1(y)}a${r} ${r} 0 1 0 ${2 * r} 0a${r} ${r} 0 1 0 ${-2 * r} 0`;

  // ---------------------------------------------------------------- state
  let treated = false;
  let t = 0;
  let hold = 0;
  const tf = [];
  let tfDebt = 0;
  const ferOf = (d) => (treated && d >= 0 ? seriesAt(S, "fer", d) : S.fer0);
  const hbOf = (d) => (treated && d >= 0 ? seriesAt(S, "hb", d) : S.hb0);

  function cells(tNow) {
    // birth days of every drawn cell aged −0.8 … 121.5 days, by inverting madeBy on a grid
    const d0 = tNow - 121.5;
    const d1 = tNow + 0.8;
    const grid = [];
    for (let d = d0; d <= d1 + 0.25; d += 0.25) grid.push([d, madeBy(S, d, treated)]);
    const list = [];
    let g = 1;
    for (let n = Math.ceil(grid[0][1]); n <= grid[grid.length - 1][1]; n++) {
      while (g < grid.length - 1 && grid[g][1] < n) g++;
      const [da, ma] = grid[g - 1];
      const [db, mb] = grid[g];
      const born = da + ((n - ma) / (mb - ma || 1)) * (db - da);
      list.push({ n, born, age: tNow - born });
    }
    return list;
  }
  function draw() {
    const paths = { cPale: "", cFull: "", cYoung: "", cOld: "", pPale: "", pFull: "", pOld: "", retic: "" };
    const phago = [MAC.c[0] - 14, MAC.c[1] - 12];
    for (const c of cells(t)) {
      const h = hash(c.n);
      const lane = (Math.floor(h * 3) - 1) * 8.5 + (hash(c.n + 0.5) - 0.5) * 3;
      let x, y, tx, ty, k = 1;
      if (c.age < 0) {
        const p = along(SIN, (c.age + 0.8) / 0.8);
        x = p.x + (h - 0.5) * 6;
        y = p.y;
        tx = p.tx;
        ty = p.ty;
      } else if (c.age <= 120) {
        const p = along(ARC, c.age / 120);
        x = p.x - p.ty * lane;
        y = p.y + p.tx * lane;
        tx = p.tx;
        ty = p.ty;
      } else {
        // into the spleen and the macrophage's phagosome
        const e = Math.min(1, (c.age - 120) / 1.5);
        const end = along(ARC, 1);
        x = end.x + (phago[0] - end.x) * e;
        y = end.y + (phago[1] - end.y) * e;
        tx = end.tx;
        ty = end.ty;
        k = 1 - 0.55 * e;
        if (e >= 1) continue;
      }
      const made = cohortAt(S, c.born, treated);
      const young = c.age < 2;
      const old = c.age > 108;
      const pale = made < 0.9 * S.cNorm;
      if (young) {
        paths.cYoung += ell(x, y, 5.9 * k, 3.9 * k, tx, ty);
        paths.retic += dot(x - tx * 1.5, y - ty * 1.5, 0.8) + dot(x + tx * 2, y + ty * 2 + 0.6, 0.7);
      } else if (old) {
        paths.cOld += ell(x, y, 4.6 * k, 3.5 * k, tx, ty);
        paths.pOld += ell(x, y, 1.6 * k, 1.2 * k, tx, ty);
      } else if (pale) {
        paths.cPale += ell(x, y, 5.0, 3.3, tx, ty);
        paths.pPale += ell(x, y, 2.9, 1.9, tx, ty);
      } else {
        paths.cFull += ell(x, y, 5.8, 3.7, tx, ty);
        paths.pFull += ell(x, y, 2.0, 1.25, tx, ty);
      }
    }
    for (const [k2, d] of Object.entries(paths)) set(k2, d);
    // ferritin granules
    const fer = ferOf(t);
    const n = granulesOf(fer);
    set("gran", DATA.gran.slice(0, n).map(([gx, gy]) => dot(gx, gy, 2.7)).join(""));
    // transferrin back to the marrow
    set("tf", tf.map((p) => {
      const a = along(RET, p.u);
      return dot(a.x - a.ty * p.o, a.y + a.tx * p.o, 3);
    }).join(""));
    // the IV complex circulating until the macrophages take it up
    const ivMg = treated && t >= 0 ? seriesAt(S, "iv", t) : 0;
    const nIv = Math.round((60 * ivMg) / 1000);
    let ivd = "";
    for (let i = 0; i < nIv; i++) {
      const u = (hash(i + 0.3) + t * 0.45) % 1;
      const a = along(ARC, u);
      const o = (hash(i + 0.7) - 0.5) * 22;
      ivd += dot(a.x - a.ty * o, a.y + a.tx * o, 2.3);
    }
    set("ivp", ivd);
    q('[data-part="iv"]').style.opacity = treated && t > -3 && t < 2 ? "1" : "0";
    // the monitor
    const xOf = (d) => MON.x0 + ((d - MON.d0) / (MON.d1 - MON.d0)) * (MON.x1 - MON.x0);
    const yF = (v) => MON.fer.y0 - (Math.min(v, MON.fer.max) / MON.fer.max) * (MON.fer.y0 - MON.fer.y1);
    const yH = (v) => MON.hb.y0 - ((v - MON.hb.lo) / (MON.hb.hi - MON.hb.lo)) * (MON.hb.y0 - MON.hb.y1);
    const trace = (fn, y, upTo) => {
      let d = "";
      for (let day = MON.d0; day <= Math.min(upTo, MON.d1) + 1e-9; day += 0.5) d += `${d ? "L" : "M"}${f1(xOf(day))} ${f1(y(fn(day)))}`;
      return d;
    };
    const tEnd = treated ? t : MON.d1;
    set("ferLine", trace(ferOf, yF, tEnd));
    set("hbLine", trace(hbOf, yH, tEnd));
    set("ferGhost", treated ? trace(ferOf, yF, MON.d1) : "");
    set("hbGhost", treated ? trace(hbOf, yH, MON.d1) : "");
    const cx = xOf(Math.max(MON.d0, Math.min(MON.d1, t)));
    q('[data-part="cursor"]').setAttribute("transform", `translate(${f1(cx)} 0)`);
    q('[data-part="cursor"]').style.opacity = treated ? "1" : "0";
    for (const [part, y] of [["ferDot", yF(fer)], ["hbDot", yH(hbOf(t))]]) {
      const el = q(`[data-part="${part}"]`);
      el.setAttribute("cx", f1(treated ? cx : xOf(MON.d1)));
      el.setAttribute("cy", f1(y));
    }
    out.day.textContent = treated ? (t < 0 ? `${Math.floor(t)} (before)` : `${Math.floor(t)}`) : "—";
    out.fer.textContent = `${Math.round(fer)} µg/L`;
    out.hb.textContent = `${Math.round(hbOf(t))} g/L`;
  }
  function step(dt) {
    // dt in seconds on the viewer's clock
    const dd = dt * LOOP.pace;
    if (treated) {
      if (t < LOOP.after) t = Math.min(LOOP.after, t + dd);
      else if ((hold += dt) > 3) {
        hold = 0;
        t = -LOOP.before;
        tf.length = 0;
      }
    } else t += dd;
    // transferrin: about one carrier drawn per 1.5 mg of iron heading to the marrow
    tfDebt += (cohortAt(S, t, treated) / 1.5) * dd;
    while (tfDebt >= 1) {
      tfDebt -= 1;
      tf.push({ u: Math.random() * 0.04, o: (Math.random() - 0.5) * 6 });
    }
    for (let i = tf.length - 1; i >= 0; i--) {
      tf[i].u += (dt * 150) / RET.L;
      if (tf[i].u >= 1) tf.splice(i, 1);
    }
  }

  // ---------------------------------------------------------------- input, tour, loop
  let modeAt = 0;
  function setMode(i, quiet) {
    modeAt = i;
    treated = i === 1;
    t = treated ? -LOOP.before : 0;
    hold = 0;
    tf.length = 0;
    line.textContent = DATA.lines[i];
    buttons.forEach((b, j) => {
      b.setAttribute("aria-checked", j === i ? "true" : "false");
      b.tabIndex = j === i ? 0 : -1;
    });
    if (!quiet) status.textContent = DATA.lines[i];
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
      setMode(i);
      if (still.matches) renderStill();
    }),
  );
  for (const b of buttons) b.addEventListener("pointerdown", takeOver);
  fig.querySelector('[data-control="mode"]').addEventListener("keydown", (ev) => {
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
    // IV: three weeks in (stores full, the first fuller cells a third of the way round); untreated: steady
    if (treated) t = 21;
    tf.length = 0;
    for (let i = 0; i < 200; i++) {
      tfDebt += cohortAt(S, t, treated) / 1.5 / 60;
      while (tfDebt >= 1) (tfDebt -= 1), tf.push({ u: Math.random(), o: (Math.random() - 0.5) * 6 });
    }
    tf.splice(40);
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
    if (touring) {
      tourClock += dt;
      if ((modeAt === 0 && tourClock > 8) || (modeAt === 1 && t >= LOOP.after && hold > 2.5)) {
        tourClock = 0;
        setMode(1 - modeAt, true);
      }
    }
    step(dt);
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
  setMode(0, true);
  if (still.matches) renderStill();
  else {
    for (let i = 0; i < 120; i++) step(1 / 60);
    draw();
    start();
  }
}
