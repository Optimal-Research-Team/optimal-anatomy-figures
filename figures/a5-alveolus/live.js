// A5 live code: red cells in single file past an air sac. Each cell's oxygen comes from the
// model (po2At, satOf) by its own time in the capillary; the cells move at the speed that gives
// the chosen effort's transit time. Oxygen dots in the air are drawn into cells as they load,
// carbon dioxide drifts out, the sac swells a little with each breath, and the monitor plots the
// traced cell.
const DATA = __DATA__;

function mount(fig) {
  const svg = fig.querySelector("svg");
  const q = (s) => svg.querySelector(s);
  const still = matchMedia("(prefers-reduced-motion: reduce)");
  const out = Object.fromEntries([...fig.querySelectorAll("[data-r]")].map((n) => [n.dataset.r, n]));
  const status = fig.querySelector("[data-status]");
  const line = fig.querySelector("[data-scene]");
  const buttons = [...fig.querySelectorAll('[data-control="effort"] .opt-seg-btn')];
  const slowBtn = fig.querySelector("[data-slow]");
  const f1 = (v) => v.toFixed(1);
  const { C, R, path: P, i0, i1, plot: PL } = DATA;
  const N = P.length - 1;
  const rnd = (a, b) => a + Math.random() * (b - a);

  // ---------------------------------------------------------------- colours from the theme
  const css = getComputedStyle(fig);
  const hex = (name, fb) => {
    const v = (css.getPropertyValue(name) || fb).trim();
    const m = /^#?([0-9a-f]{6})$/i.exec(v) || /^#?([0-9a-f]{6})$/i.exec(fb);
    return [0, 2, 4].map((i) => parseInt(m[1].slice(i, i + 2), 16));
  };
  const VEN = hex("--a5-cell-ven", "#4b52a8");
  const ART = hex("--a5-cell-art", "#d8382b");
  const mix = (t, k = 1) => `rgb(${[0, 1, 2].map((i) => Math.round((VEN[i] + (ART[i] - VEN[i]) * t) * k)).join(",")})`;

  // ---------------------------------------------------------------- the path the cells follow
  const seg = P.map((p, i) => (i < N ? Math.hypot(P[i + 1][0] - p[0], P[i + 1][1] - p[1]) : 0));
  function at(u) {
    const i = Math.max(0, Math.min(N - 1, Math.floor(u)));
    const t = Math.max(0, Math.min(1, u - i));
    const a = P[i];
    const b = P[i + 1];
    const ang = (Math.atan2(b[1] - a[1], b[0] - a[0]) * 180) / Math.PI;
    return { x: a[0] + (b[0] - a[0]) * t, y: a[1] + (b[1] - a[1]) * t, ang, sf: Math.max(0.42, Math.min(1.15, seg[i] / DATA.step)) };
  }

  // ---------------------------------------------------------------- state
  const S = LUNG.states;
  const FULL = satOf(LUNG.PA);
  let effort = 0;
  const shown = { tr: transitOf(S[0].co), pv: S[0].pv, f: S[0].f, tv: S[0].tv };
  let speed = 0.125;
  const cells = [];
  let nextId = 1;
  let tracked = null;
  const air = [];
  const fly = [];
  const co2 = [];
  const duct = Array.from({ length: 18 }, () => ({ s: Math.random(), o: rnd(-0.75, 0.75) }));
  let breath = 0;
  const inAir = (x, y, m = 16) => Math.hypot(x - C[0], y - C[1]) < R - m;
  function newAir(fromMouth) {
    if (fromMouth) return { x: DATA.top[0] + rnd(-22, 22), y: DATA.top[1] + rnd(4, 14), vx: rnd(-26, 26), vy: rnd(40, 70) };
    for (;;) {
      const x = rnd(C[0] - R, C[0] + R);
      const y = rnd(C[1] - R, C[1] + R);
      if (inAir(x, y, 20)) return { x, y, vx: rnd(-12, 12), vy: rnd(-12, 12) };
    }
  }
  for (let i = 0; i < 46; i++) air.push(newAir(false));

  const GAP = 21 / DATA.step; // cells about 21 px apart
  function stepSim(dt, wall) {
    // dt: model seconds; wall: seconds on the viewer's clock (for the air's wander)
    const rate = (i1 - i0) / shown.tr; // path points per model second
    if (!cells.length || cells[cells.length - 1].u >= GAP) cells.push({ id: nextId++, u: 0, tc: 0, sat: satOf(shown.pv), debt: 0 });
    for (let k = cells.length - 1; k >= 0; k--) {
      const c = cells[k];
      c.u += rate * dt;
      if (c.u >= N) {
        cells.splice(k, 1);
        continue;
      }
      if (c.u < i0) c.sat = satOf(shown.pv);
      else if (c.u <= i1) {
        c.tc += dt;
        const s = satOf(po2At(c.tc, shown.pv));
        c.debt += Math.max(0, s - c.sat);
        c.sat = s;
        while (c.debt >= 0.07) {
          c.debt -= 0.07;
          launch(c);
        }
      }
    }
    // the traced cell: the next one about to reach the sac
    if (!tracked || tracked.u > i1 + 24 || !cells.includes(tracked)) {
      let best = null;
      for (const c of cells) if (c.u < i0 - 2 && (!best || c.u > best.u)) best = c;
      tracked = best;
    }
    // oxygen: wander in the air, then fly into a loading cell
    for (const a of air) {
      a.vx += rnd(-60, 60) * wall;
      a.vy += rnd(-60, 60) * wall;
      a.vx *= 1 - 1.2 * wall;
      a.vy *= 1 - 1.2 * wall;
      a.x += a.vx * wall;
      a.y += a.vy * wall;
      if (!inAir(a.x, a.y)) {
        const dx = a.x - C[0];
        const dy = a.y - C[1];
        const d = Math.hypot(dx, dy);
        a.x = C[0] + (dx / d) * (R - 17);
        a.y = C[1] + (dy / d) * (R - 17);
        a.vx = -a.vx * 0.5;
        a.vy = -a.vy * 0.5;
      }
    }
    for (let k = fly.length - 1; k >= 0; k--) {
      const d = fly[k];
      d.t += dt;
      if (d.t >= d.dur || !cells.includes(d.c)) {
        fly.splice(k, 1);
        if (air.length < 46) air.push(newAir(true));
      }
    }
    for (let k = co2.length - 1; k >= 0; k--) {
      const g = co2[k];
      g.age += wall;
      g.x += g.vx * wall;
      g.y += g.vy * wall;
      g.vx *= 1 - 0.8 * wall;
      g.vy *= 1 - 0.8 * wall;
      if (g.age > g.life) co2.splice(k, 1);
    }
    // breathing: in for 40% of the cycle, out for 60%
    breath = (breath + (dt * shown.f) / 60) % 1;
    const flow = breath < 0.4 ? Math.sin((Math.PI * breath) / 0.4) : -Math.sin((Math.PI * (breath - 0.4)) / 0.6) * 0.67;
    for (const p of duct) p.s = (((p.s + flow * dt * (0.9 + shown.tv * 0.5) * 2.2) % 1) + 1) % 1;
  }
  function launch(c) {
    const p = at(c.u);
    let best = -1;
    let bd = 150;
    air.forEach((a, i) => {
      const d = Math.hypot(a.x - p.x, a.y - p.y);
      if (d < bd) (bd = d), (best = i);
    });
    let from;
    if (best >= 0) from = air.splice(best, 1)[0];
    else {
      const ux = (C[0] - p.x) / Math.hypot(C[0] - p.x, C[1] - p.y);
      const uy = (C[1] - p.y) / Math.hypot(C[0] - p.x, C[1] - p.y);
      const m = rnd(30, 80);
      from = { x: p.x + ux * m + rnd(-20, 20), y: p.y + uy * m + rnd(-12, 12) };
    }
    fly.push({ x0: from.x, y0: from.y, c, t: 0, dur: rnd(0.08, 0.14) });
    if (Math.random() < 0.8 && co2.length < 90) co2.push({ x: p.x, y: p.y - 3, vx: (C[0] - p.x) * rnd(0.2, 0.5) + rnd(-15, 15), vy: (C[1] - p.y) * rnd(0.3, 0.6) - 18, age: 0, life: rnd(1.1, 1.8) });
  }

  // ---------------------------------------------------------------- drawing
  const dots = (list, r) => list.map((p) => `M${f1(p[0] - r)} ${f1(p[1])}a${r} ${r} 0 1 0 ${2 * r} 0a${r} ${r} 0 1 0 ${-2 * r} 0`).join("");
  const xOf = (t) => PL.x0 + (Math.min(t, PL.tMax) / PL.tMax) * (PL.x1 - PL.x0);
  const yOf = (s) => PL.y0 - s * (PL.y0 - PL.y1);
  // how far across the traced capillary a cell is after t seconds in it (0 at the arteriole end, 1 at the venule end)
  const fracOf = (t) => (P[Math.round(i0 + (i1 - i0) * Math.min(1, t / shown.tr))][0] - DATA.a0x) / (DATA.a1x - DATA.a0x);
  const ductAt = (s, o) => {
    const d = DATA.duct;
    const u = s * (d.length - 1);
    const i = Math.min(d.length - 2, Math.floor(u));
    const t = u - i;
    return [d[i][0] + (d[i + 1][0] - d[i][0]) * t + o * 24, d[i][1] + (d[i + 1][1] - d[i][1]) * t];
  };
  const set = (sel, a, v) => q(sel).setAttribute(a, v);
  function cellSvg(c) {
    const p = at(c.u);
    const satIn = satOf(shown.pv);
    const k = Math.max(0, Math.min(1, (c.sat - satIn) / (FULL - satIn)));
    const t = c.u < i0 ? 0 : k;
    const rx = 6.8 * p.sf;
    return `<g transform="translate(${f1(p.x)} ${f1(p.y)}) rotate(${f1(p.ang)})"><ellipse class="a5-cell" rx="${f1(rx)}" ry="4.7" fill="${mix(t)}"/><ellipse rx="${f1(rx * 0.42)}" ry="1.9" fill="${mix(t, 0.62)}"/></g>`;
  }
  function draw() {
    // the tissue breathes (the whole block swells about its centre)
    const vol = breath < 0.4 ? (1 - Math.cos((Math.PI * breath) / 0.4)) / 2 : (1 + Math.cos((Math.PI * (breath - 0.4)) / 0.6)) / 2;
    const s = 1 + (0.012 + 0.011 * shown.tv) * vol;
    const [px, py] = DATA.pivot || C;
    set('[data-part="sac"]', "transform", `translate(${px} ${py}) scale(${s.toFixed(4)}) translate(${-px} ${-py})`);
    // cells
    let back = "";
    let front = "";
    for (const c of cells) {
      const sv = cellSvg(c);
      if (c.u >= i0 && c.u <= i1) front += sv;
      else back += sv;
    }
    q('[data-part="cellsBack"]').innerHTML = back;
    q('[data-part="cellsFront"]').innerHTML = front;
    // oxygen and carbon dioxide
    set('[data-part="air"]', "d", dots(air.map((a) => [a.x, a.y]), 3));
    set(
      '[data-part="fly"]',
      "d",
      dots(
        fly.map((d) => {
          const p = at(d.c.u);
          const e = Math.min(1, d.t / d.dur) ** 1.6;
          return [d.x0 + (p.x - d.x0) * e, d.y0 + (p.y - d.y0) * e];
        }),
        3,
      ),
    );
    const buckets = [[], [], []];
    for (const g of co2) buckets[Math.min(2, Math.floor((g.age / g.life) * 3))].push([g.x, g.y]);
    buckets.forEach((b, i) => set(`[data-part="co2${i}"]`, "d", dots(b, 2.6)));
    set('[data-part="ductair"]', "d", dots(duct.map((p) => ductAt(p.s, p.o)), 2.6));
    // the traced cell's ring
    const tr = tracked && cells.includes(tracked) ? at(tracked.u) : null;
    set('[data-part="track"]', "cx", tr ? f1(tr.x) : -60);
    set('[data-part="track"]', "cy", tr ? f1(tr.y) : -60);
    // the net turns red where the traced capillary does
    set('[data-part="netA"]', "offset", Math.max(0, fracOf(0.02)).toFixed(3));
    set('[data-part="netB"]', "offset", Math.min(1, fracOf(0.14) + 0.02).toFixed(3));
    // the monitor
    const satIn = satOf(shown.pv);
    let d = "";
    let g = "";
    for (let i = 0; i <= 80; i++) {
      const t = (i / 80) * PL.tMax;
      const pt = `${f1(xOf(t))} ${f1(yOf(satOf(po2At(t, shown.pv))))}`;
      if (t <= shown.tr) d += `${d ? "L" : "M"}${pt}`;
      else g += `${g ? "L" : `M${f1(xOf(shown.tr))} ${f1(yOf(satOf(po2At(shown.tr, shown.pv))))}L`}${pt}`;
    }
    if (shown.tr < PL.tMax) d += `L${f1(xOf(shown.tr))} ${f1(yOf(satOf(po2At(shown.tr, shown.pv))))}`;
    set('[data-part="curve"]', "d", d);
    set('[data-part="ghost"]', "d", g);
    const xs = xOf(LUNG.equil);
    const xe = xOf(shown.tr);
    set('[data-part="spare"]', "x", f1(xs));
    set('[data-part="spare"]', "width", f1(Math.max(0, xe - xs)));
    set('[data-part="sparetxt"]', "x", f1((xs + xe) / 2));
    set('[data-part="sparetxt"]', "opacity", xe - xs > 90 ? 1 : 0);
    set('[data-part="exit"]', "transform", `translate(${f1(xe)} 0)`);
    set('[data-part="start"]', "cx", f1(PL.x0));
    set('[data-part="start"]', "cy", f1(yOf(satIn)));
    const dot = q('[data-part="dot"]');
    if (tracked && cells.includes(tracked)) {
      const tt = Math.min(tracked.tc, shown.tr);
      dot.setAttribute("cx", f1(xOf(tt)));
      dot.setAttribute("cy", f1(yOf(tracked.u < i0 ? satIn : tracked.sat)));
      dot.setAttribute("opacity", 1);
    } else dot.setAttribute("opacity", 0);
  }

  // ---------------------------------------------------------------- input, tour, loop
  function setEffort(i, quiet) {
    effort = i;
    const st = S[i];
    const tr = transitOf(st.co);
    out.time.textContent = `${tr.toFixed(2)} s`;
    out.in.textContent = `${Math.round(100 * satOf(st.pv))}% full`;
    out.out.textContent = `${Math.round(100 * satOf(po2At(tr, st.pv)))}% full`;
    line.textContent = DATA.lines[i];
    buttons.forEach((b, j) => {
      b.setAttribute("aria-checked", j === i ? "true" : "false");
      b.tabIndex = j === i ? 0 : -1;
    });
    if (!quiet) status.textContent = `${st.label}: each red cell spends about ${tr.toFixed(2)} seconds in the capillary, arrives ${Math.round(100 * satOf(st.pv))}% full and leaves ${Math.round(100 * satOf(po2At(tr, st.pv)))}% full.`;
  }
  let touring = true;
  let idle = -1e9;
  const takeOver = () => {
    touring = false;
    idle = performance.now();
  };
  buttons.forEach((b, i) =>
    b.addEventListener("click", () => {
      takeOver();
      setEffort(i);
      if (still.matches) renderStill();
    }),
  );
  fig.querySelector('[data-control="effort"]').addEventListener("keydown", (e) => {
    const i = buttons.indexOf(document.activeElement);
    if (i < 0) return;
    const j = e.key === "ArrowRight" || e.key === "ArrowDown" ? i + 1 : e.key === "ArrowLeft" || e.key === "ArrowUp" ? i - 1 : null;
    if (j === null) return;
    e.preventDefault();
    const b = buttons[(j + buttons.length) % buttons.length];
    b.focus();
    b.click();
  });
  for (const b of buttons) b.addEventListener("pointerdown", takeOver);
  slowBtn.addEventListener("click", () => {
    speed = speed < 1 ? 1 : 0.125;
    slowBtn.setAttribute("aria-pressed", speed < 1 ? "true" : "false");
  });
  const snap = () => {
    const st = S[effort];
    Object.assign(shown, { tr: transitOf(st.co), pv: st.pv, f: st.f, tv: st.tv });
  };
  function renderStill() {
    // the traced cell a little way in, half loaded: the moment the picture is about
    snap();
    cells.length = 0;
    fly.length = 0;
    co2.length = 0;
    tracked = null;
    for (let i = 0; i < 4000; i++) {
      stepSim(1 / 240, 1 / 60);
      if (i > 600 && tracked && tracked.tc > 0.05) break;
    }
    breath = 0.35;
    draw();
  }
  let tourClock = 0;
  let raf = 0;
  let last = 0;
  let visible = true;
  function tick(now) {
    raf = 0;
    if (!visible || still.matches) return;
    const wall = Math.min(0.05, last ? (now - last) / 1000 : 0.016);
    last = now;
    if (!touring && now - idle > 9000) touring = true;
    if (touring && (tourClock += wall) > 8) {
      tourClock = 0;
      setEffort((effort + 1) % S.length, true);
    }
    const st = S[effort];
    const e = 1 - Math.exp(-wall * 2.5);
    shown.tr += (transitOf(st.co) - shown.tr) * e;
    shown.pv += (st.pv - shown.pv) * e;
    shown.f += (st.f - shown.f) * e;
    shown.tv += (st.tv - shown.tv) * e;
    stepSim(wall * speed, wall);
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
  setEffort(0, true);
  if (still.matches) renderStill();
  else {
    for (let i = 0; i < 240; i++) stepSim(1 / 240, 1 / 60);
    draw();
    start();
  }
}
