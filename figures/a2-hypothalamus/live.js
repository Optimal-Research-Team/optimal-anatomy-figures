// A2 live code: the KNDy cluster bursts, neurokinin B travels to the heat-loss centre, and the
// centre's drive (a leaky sum of what arrives, plus a small natural wander) tips into a hot flash
// when it reaches 1. Estrogen from the vessels docks on the KNDy cells; its level, the cells'
// size, how often they burst and how much they send all come from kndyOf(e).
const DATA = __DATA__;

function mount(fig) {
  const svg = fig.querySelector("svg");
  const q = (s) => svg.querySelector(s);
  const still = matchMedia("(prefers-reduced-motion: reduce)");
  const out = Object.fromEntries([...fig.querySelectorAll("[data-r]")].map((n) => [n.dataset.r, n]));
  const status = fig.querySelector("[data-status]");
  const line = fig.querySelector("[data-scene]");
  const buttons = [...fig.querySelectorAll('[data-control="state"] .opt-seg-btn')];
  const f1 = (v) => v.toFixed(1);
  const rnd = (a, b) => a + Math.random() * (b - a);
  const kGroups = [...svg.querySelectorAll(".a2-kndy")];
  const kGlows = kGroups.map((g) => g.querySelector(".a2-kglow"));

  // ---------------------------------------------------------------- the hanging parts' back halves (static: drawn once)
  // The optic nerve and chiasm, the stalk, the pituitary lobes, the mammillary body and the bony cup
  // are cut in half by the midline cut; behind it each keeps its round back half (shared/round-back.js).
  {
    const RB = roundBack(DATA.far);
    const mixc = (c, to, t) => c.map((v, i) => Math.round(v + (to[i] - v) * t));
    const tonesOf = (name) => {
      const c = RB.rgbOf(fig, name, "#c0a0a8");
      return [mixc(c, [0, 0, 0], 0.32), mixc(c, [255, 255, 255], 0.22)];
    };
    const objects = DATA.far.parts.map((part) => {
      const closed = RB.sampleClosed(part.pts, part.k, 6);
      const ring = RB.byLength([...closed, closed[0]], 49).slice(0, -1);
      const cx = ring.reduce((a, p) => a + p[0], 0) / ring.length;
      const cy = ring.reduce((a, p) => a + p[1], 0) / ring.length;
      return RB.rim(ring, { rho: (p) => part.rho * Math.hypot(p[0] - cx, p[1] - cy), nphi: 8, tones: tonesOf(part.tone) });
    });
    const c = RB.byLength(DATA.far.nerve, 14);
    const Ae = [];
    const Be = [];
    c.forEach((p, i) => {
      const a = c[Math.max(0, i - 1)];
      const b = c[Math.min(c.length - 1, i + 1)];
      const l = Math.hypot(b[0] - a[0], b[1] - a[1]) || 1;
      const n = [-(b[1] - a[1]) / l, (b[0] - a[0]) / l];
      const w = (DATA.far.nerveW[0] + (DATA.far.nerveW[1] - DATA.far.nerveW[0]) * (i / (c.length - 1))) / 2;
      Ae.push([p[0] + n[0] * w, p[1] + n[1] * w]);
      Be.push([p[0] - n[0] * w, p[1] - n[1] * w]);
    });
    objects.push(RB.chords(Ae, Be, { round: 1, nphi: 12, tones: tonesOf("--a2-white") }));
    q('[data-part="far"]').innerHTML = RB.paintObjects(objects);
  }

  // ---------------------------------------------------------------- paths with lengths
  const measure = (pts) => {
    const acc = [0];
    for (let i = 1; i < pts.length; i++) acc.push(acc[i - 1] + Math.hypot(pts[i][0] - pts[i - 1][0], pts[i][1] - pts[i - 1][1]));
    return { pts, acc, L: acc[acc.length - 1] };
  };
  const along = (m, s) => {
    let i = 1;
    while (i < m.acc.length - 1 && m.acc[i] < s) i++;
    const t = Math.max(0, Math.min(1, (s - m.acc[i - 1]) / (m.acc[i] - m.acc[i - 1] || 1)));
    return [m.pts[i - 1][0] + (m.pts[i][0] - m.pts[i - 1][0]) * t, m.pts[i - 1][1] + (m.pts[i][1] - m.pts[i - 1][1]) * t];
  };
  const AX = DATA.axons.map(measure);
  const DN = DATA.down.map(measure);
  const OUTP = measure(DATA.out);
  const VS = DATA.vessels;

  // ---------------------------------------------------------------- state
  let target = 1;
  let block = false; // a neurokinin-receptor blocker: the signal arrives but isn't received
  let e = 1;
  let clock = 0;
  let sinceBurst = 0;
  let drive = 0.2;
  let flash = -1; // seconds into the current flash, −1 when none
  let refractory = 0;
  let outClock = 0;
  const packets = [];
  const pulses = [];
  const estro = [];
  const glow = DATA.kndy.map(() => 0);

  function burst(s) {
    glow.fill(1);
    AX.forEach((m, j) => {
      for (let p = 0; p < s.packets; p++) packets.push({ m, s: -p * 14 - j * 3, mn: true });
    });
    DN.forEach((m) => packets.push({ m, s: 0, mn: false }));
  }
  function spawnEstro() {
    const v = VS[Math.floor(Math.random() * VS.length)];
    const p = v[Math.floor(Math.random() * v.length)];
    return { x: p[0], y: p[1], vx: rnd(-14, 14), vy: rnd(-14, 14), age: 0, life: rnd(6, 10), dock: -1, dt: 0 };
  }
  function step(dt) {
    clock += dt;
    e += (target - e) * (1 - Math.exp(-dt * 1.4));
    const s = kndyOf(e);
    // bursts
    sinceBurst += dt;
    if (sinceBurst >= s.burst) {
      sinceBurst = 0;
      burst(s);
    }
    for (let i = 0; i < glow.length; i++) glow[i] *= Math.exp(-dt / 0.28);
    // packets travel; arrivals at the heat-loss centre add drive
    for (let i = packets.length - 1; i >= 0; i--) {
      const p = packets[i];
      p.s += dt * 150;
      if (p.s >= p.m.L) {
        if (p.mn) drive += KNDY.k * (block ? KNDY.blocked : 1);
        packets.splice(i, 1);
      }
    }
    drive *= Math.exp(-dt / KNDY.tau);
    const total = drive + wanderAt(clock);
    refractory -= dt;
    if (flash < 0 && refractory <= 0 && total >= 1) {
      flash = 0;
      refractory = KNDY.refractory;
    }
    if (flash >= 0) {
      flash += dt;
      outClock += dt;
      if (flash < 2.6 && outClock > 0.11) {
        outClock = 0;
        pulses.push({ s: 0 });
      }
      if (flash > 3.6) flash = -1;
    }
    for (let i = pulses.length - 1; i >= 0; i--) {
      pulses[i].s += dt * 230;
      if (pulses[i].s > OUTP.L) pulses.splice(i, 1);
    }
    // estrogen: as many molecules as the level, leaving the vessels, docking on KNDy cells
    const want = Math.round(30 * e);
    if (estro.length < want && Math.random() < dt * 8) estro.push(spawnEstro());
    const sc = s.scale;
    for (let i = estro.length - 1; i >= 0; i--) {
      const m = estro[i];
      m.age += dt;
      if (m.dock >= 0) {
        m.dt -= dt;
        if (m.dt <= 0) m.dock = -1;
      } else {
        m.vx += rnd(-40, 40) * dt;
        m.vy += rnd(-40, 40) * dt;
        m.vx *= 1 - 0.6 * dt;
        m.vy *= 1 - 0.6 * dt;
        m.x += m.vx * dt;
        m.y += m.vy * dt;
        DATA.kndy.forEach(([kx, ky], k) => {
          if (m.dock < 0 && Math.hypot(m.x - kx, m.y - ky) < 10 * sc + 3 && Math.random() < 0.5) {
            m.dock = k;
            m.dt = rnd(1.2, 2.4);
            const a = Math.atan2(m.y - ky, m.x - kx);
            m.ox = Math.cos(a) * (8.5 * sc + 2.5);
            m.oy = Math.sin(a) * (7.2 * sc + 2.5);
          }
        });
      }
      if (m.age > m.life || (estro.length > want + 2 && m.dock < 0 && Math.random() < dt * 2)) estro.splice(i, 1);
    }
  }

  // ---------------------------------------------------------------- drawing
  const dot = (x, y, r) => `M${f1(x - r)} ${f1(y)}a${r} ${r} 0 1 0 ${2 * r} 0a${r} ${r} 0 1 0 ${-2 * r} 0`;
  const hexD = (x, y, r) => {
    let d = "";
    for (let k = 0; k < 6; k++) {
      const a = (k / 6) * 2 * Math.PI + Math.PI / 6;
      d += `${k ? "L" : "M"}${f1(x + Math.cos(a) * r)} ${f1(y + Math.sin(a) * r)}`;
    }
    return d + "Z";
  };
  function draw() {
    const s = kndyOf(e);
    kGroups.forEach((g, i) => {
      const [x, y] = DATA.kndy[i];
      g.setAttribute("transform", `translate(${x} ${y}) scale(${s.scale.toFixed(3)})`);
      kGlows[i].setAttribute("opacity", (0.18 + 0.82 * glow[i]).toFixed(2));
    });
    q('[data-part="nkb"]').setAttribute(
      "d",
      packets
        .filter((p) => p.s >= 0)
        .map((p) => {
          const [x, y] = along(p.m, p.s);
          return dot(x, y, p.mn ? 2.8 : 2.2);
        })
        .join(""),
    );
    q('[data-part="estro"]').setAttribute(
      "d",
      estro
        .map((m) => {
          const fade = Math.min(1, m.age / 0.6, (m.life - m.age) / 0.6);
          if (fade <= 0.05) return "";
          const r = 3.2 * Math.max(0.4, fade);
          if (m.dock >= 0) {
            const [kx, ky] = DATA.kndy[m.dock];
            return hexD(kx + m.ox, ky + m.oy, r);
          }
          return hexD(m.x, m.y, r);
        })
        .join(""),
    );
    const total = Math.min(1.2, drive + wanderAt(clock));
    q('[data-part="mglow"]').setAttribute("opacity", (0.12 + 0.7 * Math.min(1, total)).toFixed(2));
    const h = flash < 0 ? 0 : Math.min(1, flash / 0.5) * (1 - Math.max(0, (flash - 2.4) / 1.2));
    q('[data-part="heat"]').setAttribute("opacity", h.toFixed(2));
    svg.classList.toggle("a2-hot", flash >= 0 && flash < 3);
    q('[data-part="outpulse"]').setAttribute("d", pulses.map((p) => {
      const [x, y] = along(OUTP, p.s);
      return dot(x, y, 3.2);
    }).join(""));
  }

  // ---------------------------------------------------------------- input, tour, loop
  function setState(i, quiet) {
    // 0 before, 1 after, 2 hormone therapy (estrogen replaced), 3 non-hormonal blocker
    target = [1, 0, KNDY.therapy, 0][i];
    block = i === 3;
    svg.classList.toggle("a2-blocked", block);
    const s = kndyOf(target);
    out.estro.textContent = ["Cycling", "Low", "Replaced", "Low"][i];
    out.size.textContent = i === 2 ? "Smaller" : `${Math.round(100 * s.area)}%`;
    out.rate.textContent = i < 2 ? (DATA.rate[i] < 0.05 ? "Rare" : `≈ ${DATA.rate[i].toFixed(1)} an hour`) : "Fewer, typically";
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
  let stateAt = 0;
  const takeOver = () => {
    touring = false;
    idle = performance.now();
  };
  buttons.forEach((b, i) =>
    b.addEventListener("click", () => {
      takeOver();
      stateAt = i;
      setState(i);
      if (still.matches) renderStill();
    }),
  );
  for (const b of buttons) b.addEventListener("pointerdown", takeOver);
  fig.querySelector('[data-control="state"]').addEventListener("keydown", (ev) => {
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
    // after menopause: mid-flash, with signal on the axons; before: a burst just sent
    e = target;
    packets.length = 0;
    pulses.length = 0;
    estro.length = 0;
    flash = -1;
    refractory = 0;
    for (let i = 0; i < 2400; i++) {
      step(1 / 60);
      if (target === 0 && flash > 1.0 && packets.length) break;
      if (target === 1 && i > 900 && sinceBurst > 0.45 && sinceBurst < 0.5) break;
    }
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
    if (touring && (tourClock += dt) > 12) {
      tourClock = 0;
      stateAt = (stateAt + 1) % 4;
      setState(stateAt, true);
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
  setState(0, true);
  if (still.matches) renderStill();
  else {
    for (let i = 0; i < 300; i++) step(1 / 60);
    draw();
    start();
  }
}
