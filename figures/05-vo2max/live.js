// Fig 5 live code: a ramp test you can play and scrub; the rider pedals and breathes in real time.
const DATA = __DATA__;

function mount(fig) {
  const P = DATA.P;
  const B = { ...DATA.B };
  const stage = fig.querySelector(".iso-stage");
  const svg = stage.querySelector("svg");
  const q = (s) => svg.querySelector(s);
  const still = matchMedia("(prefers-reduced-motion: reduce)");
  const out = Object.fromEntries([...fig.querySelectorAll("[data-r]")].map((n) => [n.dataset.r, n]));
  const status = fig.querySelector("[data-status]");
  const buttons = [...fig.querySelectorAll('[data-control="ceiling"] .opt-seg-btn')];
  const range = fig.querySelector(".vo-range");
  const play = fig.querySelector("[data-play]");
  const clockEl = fig.querySelector("[data-clock]");
  const nodes = { runner: q('[data-part="runner"]'), brake: q('[data-part="brake"]'), fly: q('[data-part="flyspin"]'), tablet: q('[data-part="tablet"]') };
  const NS = "http://www.w3.org/2000/svg";
  const el = (tag, attrs, parent) => {
    const n = document.createElementNS(NS, tag);
    for (const [key, value] of Object.entries(attrs || {})) n.setAttribute(key, value);
    if (parent) parent.appendChild(n);
    return n;
  };
  const KS = P.scale * Math.sqrt(1.6);
  const view = mannequinView(nodes.runner, P, {});
  const base = [DATA.bike.hipX, 0, 0];
  const fmt = (min) => {
    const s = Math.max(0, Math.round(min * 60));
    return `${Math.floor(s / 60)}:${String(s % 60).padStart(2, "0")}`;
  };

  // ---------------------------------------------------------------- state
  let ceiling = 35;
  let T = testOf(ceiling);
  let t = 0; // test minute
  let playing = false;
  let theta = 0.6; // crank angle (rad)
  let flyAngle = 0;
  let breath = 0; // breath phase 0..1 (breath out first)
  const MIN_PER_S = 0.75; // test minutes per second of playback (the rider still pedals and breathes in real time)

  // ---------------------------------------------------------------- the mask and its analyser, crank arms and pedals
  const WIDTH = { hip: B.hipHalf, knee: 8.6, ankle: 9 };
  function riderParts(pose) {
    const parts = [];
    const m = DATA.mask;
    const Fm = MANNEQUIN.frameAlong(m.base, m.face);
    parts.push({ name: "mask", group: "trunk", rigid: true, kind: "lathe", F: Fm, profile: [[0, 6.0], [2.6, 6.0, 1], [4.6, 4.4, 1], [6.0, 3.2]], centre: G.pointOf(Fm, 5, 0, 0), bias: 2 });
    // the wireless analyser: a capsule on the mask's front with a flow tube through it (generic, not any one brand)
    parts.push({ name: "analyser", group: "trunk", rigid: true, kind: "lathe", F: Fm, profile: [[5.6, 3.0], [6.4, 4.6, 1], [8.6, 5.0, 1], [11.0, 4.6, 1], [12.0, 3.0]], centre: G.pointOf(Fm, 9, 0, 0), bias: 2.5 });
    const bb = DATA.bike.bb;
    for (const [k, off] of [["R", 0], ["L", Math.PI]]) {
      const th = theta + off;
      const side = k === "L" ? 1 : -1;
      const u = [Math.cos(th), 0, Math.sin(th)];
      const v = [-Math.sin(th), 0, Math.cos(th)];
      const a = [0, side, 0];
      parts.push({ name: `crank${k}`, group: `leg${k}`, kind: "prism", F: { o: [bb[0], side * 13, bb[2]], a, u, v }, poly: [[-2.4, -1.8], [DATA.bike.crank + 1.8, -1.3], [DATA.bike.crank + 1.8, 1.3], [-2.4, 1.8]], s0: 0, s1: 1.6, centre: [bb[0] + u[0] * 9, side * 14, bb[2] + u[2] * 9], bias: 1 });
      const pedal = pose.legs[k].pedal;
      const sole = pose.legs[k].sole;
      parts.push({ name: `pedal${k}`, group: `leg${k}`, kind: "prism", F: { o: [pedal[0], side * 5, pedal[1]], a, u: [Math.cos(sole), 0, Math.sin(sole)], v: [-Math.sin(sole), 0, Math.cos(sole)] }, poly: [[-5, -2.4], [5, -2.4], [5, -0.2], [-5, -0.2]], s0: 0, s1: 8, centre: [pedal[0], side * 9, pedal[1] - 1.2], bias: -1 });
    }
    return parts;
  }
  let strapDone = false;
  let led = null;
  function decorate(part, g, st) {
    if (part.name === "chest" && !strapDone) {
      const L = part.profile[part.profile.length - 1][0];
      g.innerHTML = lineSvg(G.arcOf(part.F, 0.6 * L - 1.2, 12.25, P) + G.arcOf(part.F, 0.6 * L + 1.2, 12.25, P), { tone: "mid", className: "vo-strap" });
      strapDone = true;
    }
    if (part.name === "analyser" && !st.led) {
      // a status light on top of the analyser: it blinks with each breath it records
      const top = G.pointOf(part.F, 8.6, 5.0, Math.PI / 2);
      const up = iso(G.pointOf(part.F, 8.6, 5.1, Math.atan2(1, 0)), P);
      const c = iso(top, P);
      st.led = el("circle", { class: "vo-led", cx: c[0].toFixed(1), cy: c[1].toFixed(1), r: (0.9 * KS).toFixed(2) }, g);
      led = st.led;
      void up;
    }
    if (part.kind === "ball" && /^(hip|knee|ankle|shoulder|elbow|wrist)/.test(part.name)) {
      if (!st.dot) st.dot = el("circle", { class: "mq-dot", r: (1.2 * KS).toFixed(2) }, g);
      const c = iso(part.c, P);
      st.dot.setAttribute("cx", c[0].toFixed(1));
      st.dot.setAttribute("cy", c[1].toFixed(1));
    }
  }

  // ---------------------------------------------------------------- the brake magnets and flywheel marks
  const FLY = DATA.bike.fly;
  function brakeSvg(W) {
    const x = FLY.x - 13;
    const rimZ = FLY.z + Math.sqrt(FLY.r ** 2 - 13 ** 2);
    const over = 5.5 * Math.min(1, W / 420);
    const z0 = rimZ + 2.4 - over;
    const yN = FLY.y + FLY.t / 2 + 0.3;
    const rod = solidSvg(cylinder(x, FLY.y, 0.9, z0 + 5, FLY.z + FLY.r + 9 - 1.2 - (z0 + 5), P, 12), { tone: "lo" });
    const bridge = solidSvg(slabOf({ x: x - 4, y: FLY.y - FLY.t / 2 - 2.2, w: 8, d: FLY.t + 4.4, r: 0.6 }, z0 + 4, 1.8, P, 2, 0.2), { tone: "mid" });
    const magnet = solidSvg(slabOf({ x: x - 4, y: yN, w: 8, d: 1.9, r: 0.5 }, z0, 5.8, P, 2, 0.2), { tone: "hi", className: "vo-magnet" });
    return rod + bridge + magnet;
  }
  function flySvg() {
    return [0, 1, 2, 3, 4]
      .map((i) => {
        const a = flyAngle + (i * 2 * Math.PI) / 5;
        const p = iso([FLY.x + 11 * Math.cos(a), FLY.y + FLY.t / 2 + 0.02, FLY.z + 11 * Math.sin(a)], P);
        return `<circle class="vo-hole" cx="${p[0].toFixed(1)}" cy="${p[1].toFixed(1)}" r="${(1.6 * KS).toFixed(2)}"/>`;
      })
      .join("");
  }

  // ---------------------------------------------------------------- the tablet: VO₂ against watts
  const b0 = baseOf() / TRUTH.bm;
  const plot = vo2Plot(nodes.tablet, DATA.screen, { xMax: 420, xTicks: [100, 200, 300, 400], xLabel: "watts", guide: [[0, b0], [420, b0 + (TRUTH.slope * 420) / TRUTH.bm]] });
  function plotDraw(now, pulse) {
    const pts = [];
    const step = Math.max(1, Math.round(0.1 / T.dt));
    const last = Math.min(T.n - 1, Math.round(now / T.dt));
    for (let i = 0; i <= last; i += step) pts.push([T.W[i], T.vo2[i] / TRUTH.bm]);
    const s = sampleAt(T, now);
    pts.push([s.W, s.perKg]);
    plot.draw(pts, [s.W, s.perKg], T.ceiling, Math.min(1, Math.max(0, (now - T.tCross) / 0.5)), pulse);
  }

  // ---------------------------------------------------------------- one frame
  function render(dtReal) {
    const s = sampleAt(T, t);
    if (s.pedal) {
      theta -= dtReal * ((TRUTH.cadence / 60) * 2 * Math.PI);
      flyAngle -= dtReal * ((TRUTH.cadence / 60) * 2 * Math.PI) * 2.6;
    }
    const period = 60 / s.f;
    breath = (breath + dtReal / period) % 1;
    const pulse = breath < TRUTH.breath.exhale ? Math.sin((Math.PI * breath) / TRUTH.breath.exhale) : 0;
    const pose = riderAt(theta, B);
    const legs = {};
    for (const k of ["R", "L"]) {
      const L = pose.legs[k];
      legs[k] = { hip: [L.hip[0] - DATA.bike.hipX, L.hip[1]], knee: [L.knee[0] - DATA.bike.hipX, L.knee[1]], ankle: [L.ankle[0] - DATA.bike.hipX, L.ankle[1]], sole: L.sole, toe: L.toe, width: WIDTH };
    }
    const J = MANNEQUIN.skeletonOf({ base, pelvis: pose.pelvis, trunk: pose.trunk, legs, arms: pose.arms });
    const { parts } = MANNEQUIN.partsOf(J);
    view.draw([...parts, ...riderParts(pose)], J, decorate);
    if (led) led.setAttribute("fill-opacity", (0.3 + 0.7 * pulse).toFixed(2));
    nodes.brake.innerHTML = brakeSvg(s.W);
    nodes.fly.innerHTML = flySvg();
    plotDraw(t, pulse);
    readout(s);
  }

  // ---------------------------------------------------------------- readout
  let lastPhase = "";
  function readout(s) {
    out.w.textContent = `${Math.round(s.W)} W`;
    out.hr.textContent = `${Math.round(s.hr)} bpm`;
    out.vo2.textContent = `${s.perKg.toFixed(1)} ml/kg/min`;
    clockEl.textContent = fmt(t);
    const phaseText = { rest: "at rest", unloaded: "pedalling, no load", ramp: s.t > T.tCross ? "at the ceiling" : "on the ramp", recovery: "recovery" }[s.phase];
    stage.setAttribute("aria-valuenow", t.toFixed(1));
    stage.setAttribute("aria-valuetext", `${fmt(t)}, ${phaseText}`);
    if (phaseText !== lastPhase) {
      status.textContent = `${fmt(t)}, ${phaseText}: ${Math.round(s.W)} watts, oxygen uptake ${s.perKg.toFixed(1)} millilitres per kilogram per minute, heart rate ${Math.round(s.hr)}.`;
      lastPhase = phaseText;
    }
    if (document.activeElement !== range) range.value = String(t);
  }

  // ---------------------------------------------------------------- input, idle tour, offscreen pause, reduced motion
  const setCeiling = (c) => {
    ceiling = c;
    T = testOf(c);
    range.max = T.total.toFixed(2);
    stage.setAttribute("aria-valuemax", T.total.toFixed(1));
    t = Math.min(t, T.total);
    for (const b of buttons) {
      const on = +b.dataset.value === c;
      b.setAttribute("aria-checked", on ? "true" : "false");
      b.tabIndex = on ? 0 : -1;
    }
  };
  const setPlaying = (on) => {
    playing = on;
    play.textContent = on ? "Pause" : "Play";
    play.setAttribute("aria-label", on ? "Pause" : "Play");
  };
  let touring = true;
  let idleSince = -1e9;
  const TOUR = [35, 45, 25, 55];
  let tourAt = 0;
  const takeOver = () => {
    touring = false;
    idleSince = performance.now();
  };
  for (const b of buttons)
    b.addEventListener("click", () => {
      takeOver();
      setCeiling(+b.dataset.value);
      if (still.matches) renderStill();
    });
  fig.querySelector('[data-control="ceiling"]').addEventListener("keydown", (e) => {
    const i = buttons.indexOf(document.activeElement);
    if (i < 0) return;
    const j = e.key === "ArrowRight" || e.key === "ArrowDown" ? i + 1 : e.key === "ArrowLeft" || e.key === "ArrowUp" ? i - 1 : null;
    if (j === null) return;
    e.preventDefault();
    const b = buttons[(j + buttons.length) % buttons.length];
    b.focus();
    b.click();
  });
  range.addEventListener("input", () => {
    takeOver();
    setPlaying(false);
    t = +range.value;
    if (still.matches) render(0);
  });
  play.addEventListener("click", () => {
    takeOver();
    if (!playing && t >= T.total - 0.01) t = 0;
    setPlaying(!playing);
    start();
  });
  stage.addEventListener("keydown", (e) => {
    const map = { ArrowRight: 0.25, ArrowUp: 0.25, ArrowLeft: -0.25, ArrowDown: -0.25, PageUp: 1, PageDown: -1 };
    if (e.key in map) t = Math.min(T.total, Math.max(0, t + map[e.key]));
    else if (e.key === "Home") t = 0;
    else if (e.key === "End") t = T.total;
    else if (e.key === " ") {
      if (!playing && t >= T.total - 0.01) t = 0;
      setPlaying(!playing);
    } else return;
    e.preventDefault();
    takeOver();
    if (e.key !== " ") setPlaying(false);
    if (still.matches) render(0);
    start();
  });

  function renderStill() {
    t = T.tCross + 0.6;
    breath = 0.25;
    theta = 0.6;
    render(0);
  }

  let raf = 0;
  let last = 0;
  let visible = true;
  function tick(now) {
    raf = 0;
    if (!visible || still.matches) return;
    const dt = Math.min(0.05, last ? (now - last) / 1000 : 0.016);
    last = now;
    if (!touring && now - idleSince > 9000) {
      touring = true;
      setPlaying(true);
    }
    if (touring && !playing) setPlaying(true);
    if (playing) {
      t += dt * MIN_PER_S;
      if (t >= T.total) {
        if (touring) {
          tourAt = (tourAt + 1) % TOUR.length;
          setCeiling(TOUR[tourAt]);
          t = 0;
        } else {
          t = T.total;
          setPlaying(false);
        }
      }
    }
    render(dt);
    raf = requestAnimationFrame(tick);
  }
  function start() {
    if (!raf && visible && !still.matches) {
      last = 0;
      raf = requestAnimationFrame(tick);
    }
  }
  new IntersectionObserver((entries) => {
    visible = entries.some((e) => e.isIntersecting);
    if (visible) start();
  }).observe(stage);
  still.addEventListener("change", () => (still.matches ? renderStill() : start()));
  for (const n of [range, stage, play, ...buttons]) n.addEventListener("pointerdown", takeOver);
  setCeiling(ceiling);
  if (still.matches) renderStill();
  else {
    render(0);
    start();
  }
}
