// Fig 6 live code: a treadmill ramp test you can play and scrub; the runner runs and breathes in real time.
const DATA = __DATA__;

function mount(fig) {
  const P = DATA.P;
  const B = DATA.B;
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
  const nodes = { runner: q('[data-part="runner"]'), slats: q('[data-part="slats"]'), screen: q('[data-part="screen-body"]'), speed: q('[data-part="speed"]'), tablet: q('[data-part="tablet"]') };
  const NS = "http://www.w3.org/2000/svg";
  const el = (tag, attrs, parent) => {
    const n = document.createElementNS(NS, tag);
    for (const [key, value] of Object.entries(attrs || {})) n.setAttribute(key, value);
    if (parent) parent.appendChild(n);
    return n;
  };
  const KS = P.scale * Math.sqrt(1.6);
  const view = mannequinView(nodes.runner, P, {});
  const Z = DATA.beltZ;
  const base = [DATA.runX, 0, Z];
  const fmt = (min) => {
    const s = Math.max(0, Math.round(min * 60));
    return `${Math.floor(s / 60)}:${String(s % 60).padStart(2, "0")}`;
  };

  // ---------------------------------------------------------------- state
  let ceiling = 45;
  let T = runTestOf(ceiling);
  let t = 0;
  let playing = false;
  let phi = 0.62;
  let beltAt = 0;
  let breath = 0;
  const MIN_PER_S = 0.75;

  // ---------------------------------------------------------------- the mask and its analyser, from the head's own axis
  function maskParts(J) {
    const axis = MANNEQUIN.frameAlong([0, 0, 0], [0, 0, 1]).a;
    void axis;
    const ha = G.frameAlong(J.chin, [J.head[0] - J.chin[0], J.head[1] - J.chin[1], J.head[2] - J.chin[2]]).a;
    const d = ha[0];
    const faceRaw = [1 - ha[0] * d, -ha[1] * d, -ha[2] * d];
    const fl = Math.hypot(...faceRaw);
    const face = faceRaw.map((v) => v / fl);
    const baseM = [J.head[0] + face[0] * 6.4 - ha[0] * 4.6, J.head[1] + face[1] * 6.4 - ha[1] * 4.6, J.head[2] + face[2] * 6.4 - ha[2] * 4.6];
    const Fm = MANNEQUIN.frameAlong(baseM, face);
    return [
      { name: "mask", group: "trunk", rigid: true, kind: "lathe", F: Fm, profile: [[0, 6.0], [2.6, 6.0, 1], [4.6, 4.4, 1], [6.0, 3.2]], centre: G.pointOf(Fm, 5, 0, 0), bias: 2 },
      { name: "analyser", group: "trunk", rigid: true, kind: "lathe", F: Fm, profile: [[5.6, 3.0], [6.4, 4.6, 1], [8.6, 5.0, 1], [11.0, 4.6, 1], [12.0, 3.0]], centre: G.pointOf(Fm, 9, 0, 0), bias: 2.5 },
    ];
  }
  let led = null;
  function decorate(part, g, st) {
    if (part.name === "analyser") {
      if (!st.led) {
        st.led = el("circle", { class: "vo-led", r: (0.9 * KS).toFixed(2) }, g);
        led = st.led;
      }
      const c = iso(G.pointOf(part.F, 8.6, 5.0, Math.PI / 2), P);
      st.led.setAttribute("cx", c[0].toFixed(1));
      st.led.setAttribute("cy", c[1].toFixed(1));
    }
    if (part.kind === "ball" && /^(hip|knee|ankle|shoulder|elbow|wrist)/.test(part.name)) {
      if (!st.dot) st.dot = el("circle", { class: "mq-dot", r: (1.2 * KS).toFixed(2) }, g);
      const c = iso(part.c, P);
      st.dot.setAttribute("cx", c[0].toFixed(1));
      st.dot.setAttribute("cy", c[1].toFixed(1));
    }
  }

  // ---------------------------------------------------------------- belt slats and the display's live skeleton (front view)
  function beltSvg() {
    const gap = 12;
    const off = ((beltAt % gap) + gap) % gap;
    let d = "";
    for (let x = DATA.belt.x1 - off; x > DATA.belt.x + 0.5; x -= gap) d += lineOnTop([x, -DATA.belt.half + 0.6], [x, DATA.belt.half - 0.6], Z + 0.02, P);
    nodes.slats.setAttribute("d", d);
  }
  const SC = DATA.screen;
  const SW = SC.y1 - SC.y0;
  const toScreen = (p) => [SW / 2 + p[1] * 0.5, 8 + (Z + B.H + 6 - p[2]) * 0.5];
  const bones = el("path", { class: "cr-bones" }, nodes.screen);
  const joints = el("g", { class: "cr-joints" }, nodes.screen);
  const jointDots = [];
  function screenDraw(J) {
    const seg = (a, b) => {
      const p = toScreen(a);
      const r = toScreen(b);
      return `M${p[0].toFixed(1)} ${p[1].toFixed(1)}L${r[0].toFixed(1)} ${r[1].toFixed(1)}`;
    };
    const mid = (a, b) => [(a[0] + b[0]) / 2, (a[1] + b[1]) / 2, (a[2] + b[2]) / 2];
    let d = seg(J.hipR, J.hipL) + seg(J.shoulderR, J.shoulderL) + seg(mid(J.hipR, J.hipL), mid(J.shoulderR, J.shoulderL)) + seg(mid(J.shoulderR, J.shoulderL), J.head);
    for (const k of ["R", "L"]) d += seg(J[`hip${k}`], J[`knee${k}`]) + seg(J[`knee${k}`], J[`ankle${k}`]) + seg(J[`shoulder${k}`], J[`elbow${k}`]) + seg(J[`elbow${k}`], J[`wrist${k}`]);
    bones.setAttribute("d", d);
    const pts = ["head", "shoulderR", "shoulderL", "elbowR", "elbowL", "wristR", "wristL", "hipR", "hipL", "kneeR", "kneeL", "ankleR", "ankleL"].map((n) => toScreen(J[n]));
    while (jointDots.length < pts.length) jointDots.push(el("circle", { r: 1.2 }, joints));
    pts.forEach((p, i) => {
      jointDots[i].setAttribute("cx", p[0].toFixed(1));
      jointDots[i].setAttribute("cy", p[1].toFixed(1));
    });
  }

  // ---------------------------------------------------------------- the tablet: VO₂ against speed
  const plot = vo2Plot(nodes.tablet, DATA.tablet, { xMin: 4, xMax: 18, xTicks: [6, 10, 14, 18], xLabel: "km/h", guide: [[4, costOf(4)], [18, costOf(18)]] });
  function plotDraw(now, pulse) {
    const pts = [];
    const step = Math.max(1, Math.round(0.1 / T.dt));
    const last = Math.min(T.n - 1, Math.round(now / T.dt));
    for (let i = 0; i <= last; i += step) pts.push([T.v[i], T.vo2[i]]);
    const s = runSampleAt(T, now);
    pts.push([s.v, s.vo2]);
    plot.draw(pts, [s.v, s.vo2], T.ceiling, Math.min(1, Math.max(0, (now - T.tCross) / 0.5)), pulse);
  }

  // ---------------------------------------------------------------- one frame
  function render(dtReal) {
    const s = runSampleAt(T, t);
    setSpeed(s.v);
    const cadence = TRUTH.cadence0;
    beltAt += beltOf() * dtReal;
    phi = (phi + (dtReal * cadence) / 120) % 1;
    const period = 60 / s.f;
    breath = (breath + dtReal / period) % 1;
    const pulse = breath < RUN.breath.exhale ? Math.sin((Math.PI * breath) / RUN.breath.exhale) : 0;
    const pose = poseAt(phi, cadence, B);
    const legs = {};
    for (const [k, leg] of [["R", pose.right], ["L", pose.left]]) legs[k] = { hip: leg.hip, knee: leg.knee, ankle: leg.ankle, sole: leg.sole, toe: leg.toe };
    const J = MANNEQUIN.skeletonOf({ base, pelvis: pose.pelvis, trunk: pose.trunk, legs, arms: { R: { shoulder: pose.armR, elbow: pose.elbow }, L: { shoulder: pose.armL, elbow: pose.elbow } } });
    const { parts } = MANNEQUIN.partsOf(J);
    view.draw([...parts, ...maskParts(J)], J, decorate);
    if (led) led.setAttribute("fill-opacity", (0.3 + 0.7 * pulse).toFixed(2));
    beltSvg();
    screenDraw(J);
    if (nodes.speed) nodes.speed.textContent = s.v.toFixed(1);
    plotDraw(t, pulse);
    readout(s);
  }

  // ---------------------------------------------------------------- readout
  let lastPhase = "";
  function readout(s) {
    out.v.textContent = `${s.v.toFixed(1)} km/h`;
    out.hr.textContent = `${Math.round(s.hr)} bpm`;
    out.vo2.textContent = `${s.vo2.toFixed(1)} ml/kg/min`;
    clockEl.textContent = fmt(t);
    const phaseText = { warm: "warm-up jog", ramp: s.t > T.tCross ? "at the ceiling" : "on the ramp", recovery: "recovery jog" }[s.phase];
    stage.setAttribute("aria-valuenow", t.toFixed(1));
    stage.setAttribute("aria-valuetext", `${fmt(t)}, ${phaseText}`);
    if (phaseText !== lastPhase) {
      status.textContent = `${fmt(t)}, ${phaseText}: ${s.v.toFixed(1)} kilometres an hour, oxygen uptake ${s.vo2.toFixed(1)} millilitres per kilogram per minute, heart rate ${Math.round(s.hr)}.`;
      lastPhase = phaseText;
    }
    if (document.activeElement !== range) range.value = String(t);
  }

  // ---------------------------------------------------------------- input, idle tour, offscreen pause, reduced motion
  const setCeiling = (c) => {
    ceiling = c;
    T = runTestOf(c);
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
  const TOUR = [45, 55, 35];
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
    phi = 0.04;
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
