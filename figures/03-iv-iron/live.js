// Fig 3 live code: drives the yard from the hourly model.
const DATA = __DATA__;

function mount(fig) {
  const P = DATA.P;
  const stage = fig.querySelector(".iso-stage");
  const svg = stage.querySelector("svg");
  const q = (s) => svg.querySelector(s);
  const still = matchMedia("(prefers-reduced-motion: reduce)");
  const out = Object.fromEntries([...fig.querySelectorAll("[data-r]")].map((n) => [n.dataset.r, n]));
  const status = fig.querySelector("[data-status]");
  const buttons = [...fig.querySelectorAll('[data-control="mode"] .opt-seg-btn')];
  const range = fig.querySelector(".fe-range");
  const play = fig.querySelector("[data-play]");
  const weekLabel = fig.querySelector("[data-week]");
  const nodes = { booms: q('[data-part="booms"]'), carts: q('[data-part="carts"]'), pill: q('[data-part="pill"]'), needle: q('[data-part="needle"]'), rider: q('[data-part="rider"]'), level: q('[data-part="level"]'), hb: q('[data-part="hb"]'), discs: q('[data-part="discs"]'), dosemarks: q('[data-part="dosemarks"]') };
  const ram = [...svg.querySelectorAll('[data-move="ram"]')];
  const tanker = [...svg.querySelectorAll('[data-move="tanker"]')];
  const HOURS = DAYS * 24;
  const BV = PARAMS.bw * PARAMS.bvLPerKg;

  // ---------------------------------------------------------------- the model, all three routes, hour by hour
  const SIM = {};
  for (const mode of MODES) {
    const s = simulate(mode);
    // iron arriving per day (rolling 24 h), and a transferrin-saturation proxy for how loaded the carts are:
    // normal recycling (~25 mg/day) ↔ TSAT ≈ 30 %, scaled by today's supply (recycling + new iron).
    const supplyDay = new Float32Array(s.hb.length);
    let acc = 0;
    for (let h = 0; h < s.hb.length; h++) {
      acc += s.supply[h] - (h >= 24 ? s.supply[h - 24] : 0);
      supplyDay[h] = acc;
    }
    const tsat = new Float32Array(s.hb.length);
    for (let h = 0; h < s.hb.length; h++) {
      const recycle = (s.hb[h] * BV * PARAMS.feMgPerGHb) / 120;
      tsat[h] = Math.min(0.6, Math.max(0.04, (0.3 * (recycle + supplyDay[h])) / 24.7));
    }
    let takeMax = 0;
    for (const v of s.take) takeMax = Math.max(takeMax, v);
    SIM[mode] = { ...s, tsat, takeMax };
  }
  const sample = (arr, t) => {
    const i = Math.min(arr.length - 2, Math.max(0, Math.floor(t)));
    const f = Math.min(1, Math.max(0, t - i));
    return arr[i] + (arr[i + 1] - arr[i]) * f;
  };

  // ---------------------------------------------------------------- geometry helpers (same kit as the build)
  const loopPoint = (() => {
    // centreline of the rounded-rectangle loop, by fraction u of its length (counter-clockwise from above)
    const ring = ringOf(DATA.loop, 16);
    const lens = [0];
    for (let i = 1; i <= ring.length; i++) lens.push(lens[i - 1] + Math.hypot(ring[i % ring.length][0] - ring[i - 1][0], ring[i % ring.length][1] - ring[i - 1][1]));
    const total = lens[lens.length - 1];
    return (u) => {
      const d = (((u % 1) + 1) % 1) * total;
      let i = 1;
      while (lens[i] < d) i++;
      const a = ring[i - 1];
      const b = ring[i % ring.length];
      const f = (d - lens[i - 1]) / (lens[i] - lens[i - 1]);
      const len = Math.hypot(b[0] - a[0], b[1] - a[1]);
      return { x: a[0] + (b[0] - a[0]) * f, y: a[1] + (b[1] - a[1]) * f, tx: (b[0] - a[0]) / len, ty: (b[1] - a[1]) / len };
    };
  })();
  const rect = (c, t, along, across) => {
    const [tx, ty] = t;
    const [nx, ny] = [-ty, tx];
    return [
      [c[0] - tx * along - nx * across, c[1] - ty * along - ny * across],
      [c[0] + tx * along - nx * across, c[1] + ty * along - ny * across],
      [c[0] + tx * along + nx * across, c[1] + ty * along + ny * across],
      [c[0] - tx * along + nx * across, c[1] - ty * along + ny * across],
    ];
  };
  const CARTS = 6;
  const hash = (a, b) => {
    const x = Math.sin(a * 127.1 + b * 311.7) * 43758.5453;
    return x - Math.floor(x);
  };
  function cartsSvg(phase, p, laps) {
    const list = [];
    for (let i = 0; i < CARTS; i++) {
      const u = phase + i / CARTS;
      const lap = Math.floor(u);
      const at = loopPoint(u);
      const t = [at.tx, at.ty];
      const c = [at.x, at.y];
      // ingots: each of the two cradles is filled with probability p (redrawn each lap at the dock)
      const n = (hash(i, lap + laps) < p ? 1 : 0) + (hash(i + 17, lap + laps) < p ? 1 : 0);
      list.push({ depth: depthOf([c[0], c[1], 0], P), c, t, n });
    }
    list.sort((a, b) => a.depth - b.depth);
    return list
      .map(({ c, t, n }) => {
        let svgc = solidSvg(extrude(rect(c, t, 5.2, 3.2), 1.6, 2.4, P, { bevel: 0.3 }), { tone: "mid" });
        for (const k of [-1, 1]) {
          const cc = [c[0] + t[0] * 2.4 * k, c[1] + t[1] * 2.4 * k];
          svgc += solidSvg(extrude(rect(cc, t, 1.9, 2.3), 4, 0.7, P), { tone: "lo", crease: "none" });
          if ((k < 0 && n >= 1) || (k > 0 && n >= 2)) svgc += solidSvg(extrude(rect(cc, t, 1.6, 1.5), 4.7, 1.6, P, { bevel: 0.2 }), { tone: "hi", lit: true });
        }
        return svgc;
      })
      .join("");
  }
  const boomSvg = (b, open) => {
    const a = (open * 78 * Math.PI) / 180;
    const F = G.frameOf([b.x, b.y, b.z], [-Math.cos(a), 0, Math.sin(a)], [0, 1, 0], [Math.sin(a), 0, Math.cos(a)]);
    return solidSvg(G.prismOf(F, [[-0.8, -0.7], [0.8, -0.7], [0.8, 0.7], [-0.8, 0.7]], 1.2, DATA.booms.len, P), { tone: "hi", crease: "lo" });
  };
  const dialNeedle = (H) => {
    const { x, y, r } = DATA.dial;
    const ang = -0.75 * Math.PI + Math.min(1, H / 2) * 1.5 * Math.PI;
    return lineOnTop([x - Math.sin(ang) * 1.6, y + Math.cos(ang) * 1.6], [x + Math.sin(ang) * (r - 1.8), y - Math.cos(ang) * (r - 1.8)], 10.1, P);
  };
  const levelPath = (f) => {
    const { F0, ang, SG, r } = DATA.silo;
    const Fr = G.frameOf([F0[0], F0[1], 0], [0, 0, 1], [1, 0, 0], [0, 1, 0]);
    const z = SG.z0 + 1 + f * (SG.z1 - SG.z0 - 2);
    const pts = [G.pointOf(Fr, SG.z0 + 1, r + 0.08, ang - SG.half * 0.7), G.pointOf(Fr, SG.z0 + 1, r + 0.08, ang + SG.half * 0.7), G.pointOf(Fr, z, r + 0.08, ang + SG.half * 0.7), G.pointOf(Fr, z, r + 0.08, ang - SG.half * 0.7)];
    return pathOf(pts.map((p) => iso(p, P)), true);
  };
  const riderSvg = (day) => {
    const x = DATA.ruler.x + day * DATA.ruler.perDay;
    const plan = { x: x - 1.6, y: DATA.ruler.y - 2.4, w: 3.2, d: DATA.ruler.d + 4.8, r: 0.8 };
    return solidSvg(slabOf(plan, 0.8, 1.6, P, 2, 0.2), { tone: "hi", lit: true }) + lineSvg(lineOnTop([x, plan.y + 0.6], [x, plan.y + plan.d - 0.6], 2.4, P), { tone: "lit" });
  };
  const discsSvg = (n) => {
    const t = DATA.tray;
    let s = "";
    for (let i = 0; i < n; i++) {
      const cx = t.x + 3.6 + (i % 3) * 4.4;
      const cy = t.y + 4.5;
      const z = t.z + Math.floor(i / 3) * 1.1;
      s += solidSvg(cylinder(cx, cy, 1.9, z, 1, P, 20), { tone: "hi", className: "fe-red" });
    }
    return s;
  };
  const doseMarks = (mode) => {
    const r = DATA.ruler;
    if (mode === "iv") return `<g class="fe-mark">${solidSvg(cylinder(r.x, r.y + r.d - 1.2, 1.4, 0.8, 0.6, P, 16), { tone: "hi", lit: true })}</g>`;
    const pts = [];
    for (let d = 0; d < DAYS; d += mode === "daily" ? 1 : 2) pts.push(iso([r.x + (d + 8 / 24) * r.perDay, r.y + r.d - 1.4, 0.8], P));
    return dotsSvg(pts, { size: 0.55, tone: "hi" });
  };

  // ---------------------------------------------------------------- state
  let mode = "daily";
  let t = 0; // model hours
  let playing = !still.matches;
  let touring = !still.matches;
  let phase = 0;
  let laps = 0;
  let pillAt = -1e9;
  let lastDoseHour = -1;
  let visible = false;
  let frame = 0;
  let last = 0;
  let idle = 0;
  let pauseUntil = 0;
  let clock = 0;
  let ramPhase = 0;
  const speed = (h) => (h < 72 ? 10 : 90); // model hours per second: slow for the first three days, then fast

  function draw() {
    const s = SIM[mode];
    const g = sample(s.gate, t);
    const H = 1 / g - 1;
    const day = t / 24;
    const hb = sample(s.hb, t);
    const fer = sample(s.ferritin, t);
    nodes.booms.innerHTML = boomSvg(DATA.booms.dock, g) + boomSvg(DATA.booms.silo, g);
    nodes.needle.setAttribute("d", dialNeedle(H));
    nodes.level.setAttribute("d", levelPath(Math.min(1, fer / 500)));
    nodes.hb.textContent = String(Math.round(hb));
    nodes.discs.innerHTML = discsSvg(Math.max(0, Math.min(12, Math.round((hb - PARAMS.hb0) / 2.2))));
    nodes.rider.innerHTML = riderSvg(day);
    nodes.carts.innerHTML = cartsSvg(phase, sample(s.tsat, t), laps);
    // the tanker: drives in over the first 10 h, unloads, leaves by hour 60
    let away = 1;
    if (mode === "iv") away = t < 10 ? 1 - t / 10 : t < 40 ? 0 : Math.min(1, (t - 40) / 20);
    const ease = away * away * (3 - 2 * away);
    const tr = translateAlong(P, [0, -DATA.tanker.travel * ease, 0]);
    tanker.forEach((n) => {
      n.setAttribute("transform", tr);
      n.style.opacity = String(Math.max(0, 1 - Math.max(0, ease - 0.7) / 0.3));
    });
    // the press runs as fast as the marrow is taking iron
    const ramZ = -DATA.ram.travel * (0.5 - 0.5 * Math.cos(ramPhase));
    const rt = translateAlong(P, [0, 0, ramZ]);
    const rd = axisVector(P, [0, 0, ramZ]);
    ram.forEach((n) => {
      n.setAttribute("transform", rt);
      if (n.querySelector("[data-hold]")) holdStill(n, rd);
    });
    // a pill drops into the hopper at each dose
    const age = clock - pillAt;
    if (age >= 0 && age < 0.9) {
      const [hx, hy, hz] = DATA.hopper;
      const z = hz + 14 - 14 * Math.min(1, age / 0.6) ** 2;
      nodes.pill.innerHTML = solidSvg(G.prismOf(G.frameOf([hx - 2, hy, z], [1, 0, 0], [0, 1, 0], [0, 0, 1]), [[-1.1, -1.1], [1.1, -1.1], [1.1, 1.1], [-1.1, 1.1]], 0, 4, P), { tone: "hi" });
      nodes.pill.style.opacity = String(1 - Math.max(0, age - 0.6) / 0.3);
    } else nodes.pill.innerHTML = "";
    const gatePct = Math.round(g * 100);
    out.day.textContent = day < 3 ? day.toFixed(1) : String(Math.floor(day));
    out.gate.textContent = `${gatePct}% open`;
    out.fer.textContent = `${Math.round(fer)} µg/L`;
    out.hb.textContent = `${Math.round(hb)} g/L`;
    weekLabel.textContent = `Week ${Math.floor(day / 7)}`;
    if (Math.abs(Number(range.value) - day) > 0.24) range.value = String(Math.round(day * 4) / 4);
    stage.setAttribute("aria-valuenow", String(Math.round(day)));
  }
  const describe = () => {
    const s = SIM[mode];
    const name = mode === "daily" ? "Daily pills" : mode === "alternate" ? "Pills every other day" : "One IV infusion";
    const day = Math.floor(t / 24);
    stage.setAttribute("aria-valuetext", `${name}, day ${day}: gut gate ${Math.round(sample(s.gate, t) * 100)}% open, ferritin ${Math.round(sample(s.ferritin, t))}, hemoglobin ${Math.round(sample(s.hb, t))} grams per litre`);
  };

  function tick(now) {
    const dt = last ? Math.min((now - last) / 1000, 1 / 30) : 1 / 60;
    last = now;
    clock += dt;
    phase += dt * 0.045;
    if (phase > 1) {
      phase -= 1;
      laps++;
    }
    const s = SIM[mode];
    ramPhase += dt * Math.PI * 2 * (0.15 + 1.4 * (sample(s.take, t) / s.takeMax));
    if (playing && clock >= pauseUntil) {
      t += dt * speed(t);
      const hNow = Math.floor(t);
      for (let h = lastDoseHour + 1; h <= Math.min(hNow, HOURS); h++) if (s.pill[h]) pillAt = clock;
      lastDoseHour = Math.min(hNow, HOURS);
      if (t >= HOURS) {
        t = HOURS;
        if (touring) {
          const next = MODES[(MODES.indexOf(mode) + 1) % MODES.length];
          pauseUntil = clock + 1.6;
          setTimeout(() => touring && setMode(next, false, true), 1600);
        } else {
          playing = false;
          syncPlay();
        }
      }
    }
    draw();
    frame = visible && !still.matches ? requestAnimationFrame(tick) : 0;
  }
  const run = () => {
    if (!frame && visible && !still.matches) {
      last = 0;
      frame = requestAnimationFrame(tick);
    }
  };
  const syncPlay = () => {
    play.textContent = playing ? "Pause" : "Play";
    play.setAttribute("aria-label", playing ? "Pause" : "Play");
  };
  function stillFrame() {
    t = mode === "iv" ? 7 * 24 : 24 + 12;
    phase = 0.13;
    ramPhase = 1.2;
    draw();
    describe();
  }
  function setMode(next, byHand = true, restart = false) {
    mode = next;
    buttons.forEach((b) => {
      const on = b.dataset.value === mode;
      b.setAttribute("aria-checked", on ? "true" : "false");
      b.tabIndex = on ? 0 : -1;
    });
    nodes.dosemarks.innerHTML = doseMarks(mode);
    if (restart || byHand) {
      t = 0;
      lastDoseHour = -1;
    }
    if (byHand) takeOver(true);
    if (still.matches) stillFrame();
    else {
      describe();
      run();
    }
  }
  function takeOver(keepPlaying = false) {
    touring = false;
    playing = keepPlaying && !still.matches;
    syncPlay();
    clearTimeout(idle);
    idle = setTimeout(() => {
      if (still.matches) return;
      touring = true;
      playing = true;
      syncPlay();
      run();
    }, 9000);
  }
  function seek(day) {
    t = Math.max(0, Math.min(HOURS, day * 24));
    lastDoseHour = Math.floor(t);
    takeOver(false);
    if (still.matches) {
      draw();
    }
    describe();
    run();
  }

  buttons.forEach((b) => b.addEventListener("click", () => setMode(b.dataset.value)));
  fig.querySelector('[data-control="mode"]').addEventListener("keydown", (e) => {
    const i = buttons.indexOf(e.target);
    const n = e.key === "ArrowRight" || e.key === "ArrowDown" ? i + 1 : e.key === "ArrowLeft" || e.key === "ArrowUp" ? i - 1 : null;
    if (n === null || i < 0) return;
    e.preventDefault();
    const b = buttons[(n + buttons.length) % buttons.length];
    b.focus();
    b.click();
  });
  range.addEventListener("input", () => seek(Number(range.value)));
  play.addEventListener("click", () => {
    if (t >= HOURS) seek(0);
    touring = false;
    playing = !playing && !still.matches;
    syncPlay();
    clearTimeout(idle);
    run();
  });
  stage.addEventListener("keydown", (e) => {
    const day = t / 24;
    if (e.key === "ArrowRight") seek(Math.floor(day) + 1);
    else if (e.key === "ArrowLeft") seek(Math.ceil(day) - 1);
    else if (e.key === "PageUp") seek(day + 7);
    else if (e.key === "PageDown") seek(day - 7);
    else if (e.key === "Home") seek(0);
    else if (e.key === "End") seek(DAYS);
    else if (e.key === " ") play.click();
    else return;
    e.preventDefault();
  });
  stage.addEventListener("focus", () => (status.textContent = stage.getAttribute("aria-valuetext")));
  still.addEventListener?.("change", () => {
    if (still.matches) stillFrame();
    else run();
  });
  new IntersectionObserver(
    (entries) => {
      visible = entries[entries.length - 1].isIntersecting;
      if (visible) run();
    },
    { rootMargin: "120px 0px" },
  ).observe(stage);

  syncPlay();
  setMode("daily", false, true);
  if (still.matches) {
    setMode("iv", false, true);
  } else draw();
}
