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
  const nodes = { runner: q('[data-part="runner"]'), brake: q('[data-part="brake"]'), fly: q('[data-part="flyspin"]'), vane: q('[data-part="vane"]'), o2: q('[data-part="o2"]'), co2: q('[data-part="co2"]'), plot: q('[data-part="plot"]') };
  const NS = "http://www.w3.org/2000/svg";
  const el = (tag, attrs, parent) => {
    const n = document.createElementNS(NS, tag);
    for (const [key, value] of Object.entries(attrs || {})) n.setAttribute(key, value);
    if (parent) parent.appendChild(n);
    return n;
  };
  const KS = DATA.camera.k;
  const view = mannequinView(nodes.runner, P, {});
  const front = stage.querySelector(".vo-front");
  let frontDone = false;
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
  let vaneAngle = 0;
  let breath = 0; // breath phase 0..1 (exhale first)
  let shift = 0; // cm the air in the hose has advanced
  let wall = 0; // real seconds
  const MIN_PER_S = 0.75; // test minutes per second of playback (the rider still pedals and breathes in real time)

  // ---------------------------------------------------------------- the rider and the bike's moving parts
  const WIDTH = { hip: B.hipHalf, knee: 8.6, ankle: 9 };
  function riderParts(J, pose) {
    const parts = [];
    // mask with a one-way valve, from the head's own axis (the hose starts at the valve's tip)
    const m = DATA.mask;
    const Fm = MANNEQUIN.frameAlong(m.base, m.face);
    parts.push({ name: "mask", group: "trunk", rigid: true, kind: "lathe", F: Fm, profile: [[0, 6.0], [2.6, 6.0, 1], [4.6, 4.4, 1], [6.0, 2.6]], centre: G.pointOf(Fm, 5, 0, 0), bias: 2 });
    parts.push({ name: "valve", group: "trunk", rigid: true, kind: "lathe", F: Fm, profile: [[5.8, 2.6], [8.4, 2.6]], centre: G.pointOf(Fm, 7.5, 0, 0), bias: 2.5 });
    // crank arms and pedals (rotate with θ), on each leg's side
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
      parts.push({ name: `pedal${k}`, group: `leg${k}`, kind: "prism", F: { o: [base[0] + pedal[0] - DATA.bike.hipX, side * 5, pedal[1]], a, u: [Math.cos(sole), 0, Math.sin(sole)], v: [-Math.sin(sole), 0, Math.cos(sole)] }, poly: [[-5, -2.4], [5, -2.4], [5, -0.2], [-5, -0.2]], s0: 0, s1: 8, centre: [pedal[0], side * 9, pedal[1] - 1.2], bias: -1 });
    }
    return parts;
  }
  let strapDone = false;
  function decorate(part, g, st) {
    if (part.name === "chest" && !strapDone) {
      // the heart-rate strap: a band round the chest with its sensor pod at the front
      const F0 = part.F;
      const L = part.profile[part.profile.length - 1][0];
      const s = 0.6 * L;
      g.innerHTML = lineSvg(G.arcOf(F0, s - 1.2, 12.25, P) + G.arcOf(F0, s + 1.2, 12.25, P), { tone: "mid", className: "vo-strap" });
      strapDone = true;
    }
    if (part.kind === "ball" && /^(hip|knee|ankle|shoulder|elbow|wrist)/.test(part.name)) {
      if (!st.dot) st.dot = el("circle", { class: "mq-dot", r: (1.2 * KS).toFixed(2) }, g);
      const c = iso(part.c, P);
      st.dot.setAttribute("cx", c[0].toFixed(1));
      st.dot.setAttribute("cy", c[1].toFixed(1));
    }
  }

  // ---------------------------------------------------------------- the brake magnets, flywheel marks, turbine vane, gas cells
  const FLY = DATA.bike.fly;
  function brakeSvg(W) {
    // a magnet carriage hanging from the brake arm; it lowers over the rim as the watts rise
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
    const pts = [0, 1, 2, 3, 4].map((i) => {
      const a = flyAngle + (i * 2 * Math.PI) / 5;
      return iso([FLY.x + 11 * Math.cos(a), FLY.y + FLY.t / 2 + 0.02, FLY.z + 11 * Math.sin(a)], P);
    });
    return pts.map((p) => `<circle class="vo-hole" cx="${p[0].toFixed(1)}" cy="${p[1].toFixed(1)}" r="${(1.6 * KS).toFixed(2)}"/>`).join("");
  }
  function vaneSvg() {
    const tb = DATA.turbine;
    let d = "";
    for (const k of [0, 1]) {
      const a = vaneAngle + k * (Math.PI / 2);
      const x = (tb.x0 + tb.x1) / 2 + (k ? 1.5 : -1.5);
      const r = tb.r - 0.5;
      d += pathOf([iso([x, tb.y + r * Math.cos(a), tb.z + r * Math.sin(a)], P), iso([x, tb.y - r * Math.cos(a), tb.z - r * Math.sin(a)], P)]);
    }
    return `<path class="vo-vane" d="${d}"/>`;
  }
  function cellSvg(frac, lo, hi) {
    const w = 14.6 * Math.min(1, Math.max(0, (frac - lo) / (hi - lo)));
    return `<rect class="vo-level" x="0.6" y="6.6" width="${Math.max(0, w - 1.2).toFixed(2)}" height="3" rx="0.4"/>`;
  }

  // ---------------------------------------------------------------- the monitor: oxygen uptake (ml/kg/min) against power (W)
  const SC = DATA.monitor.screen;
  const PLOT = { x0: 5, y0: SC.h - 4, w: SC.w - 8, h: SC.h - 8, wMax: 420, vMax: 60 };
  const px = (Wt) => PLOT.x0 + (Wt / PLOT.wMax) * PLOT.w;
  const py = (v) => PLOT.y0 - (v / PLOT.vMax) * PLOT.h;
  const plotStatic = (() => {
    let grid = "";
    for (let w = 100; w <= 400; w += 100) grid += `M${px(w).toFixed(2)} ${py(0).toFixed(2)}V${py(PLOT.vMax).toFixed(2)}`;
    for (let v = 10; v <= 60; v += 10) grid += `M${px(0).toFixed(2)} ${py(v).toFixed(2)}H${px(PLOT.wMax).toFixed(2)}`;
    const axes = `M${px(0)} ${py(PLOT.vMax)}V${py(0)}H${px(PLOT.wMax)}`;
    const ticks = [100, 200, 300, 400].map((w) => `<text class="vo-tick" x="${px(w).toFixed(2)}" y="${(py(0) + 2.6).toFixed(2)}" font-size="2" text-anchor="middle">${w}</text>`).join("") + [20, 40, 60].map((v) => `<text class="vo-tick" x="${(px(0) - 0.8).toFixed(2)}" y="${(py(v) + 0.7).toFixed(2)}" font-size="2" text-anchor="end">${v}</text>`).join("");
    // the shared slope: 10.3 ml/min per W above unloaded pedalling, for this body mass
    const b0 = baseOf() / TRUTH.bm;
    const guide = `M${px(0).toFixed(2)} ${py(b0).toFixed(2)}L${px(PLOT.wMax).toFixed(2)} ${py(b0 + (TRUTH.slope * PLOT.wMax) / TRUTH.bm).toFixed(2)}`;
    return `<path class="vo-grid" d="${grid}"/><path class="vo-axis" d="${axes}"/><path class="vo-guide" d="${guide}"/>${ticks}<text class="vo-tick" x="${px(PLOT.wMax).toFixed(2)}" y="${(py(PLOT.vMax) + 2.2).toFixed(2)}" font-size="2.2" text-anchor="end">VO₂ against watts</text>`;
  })();
  const plotNodes = (() => {
    nodes.plot.innerHTML = plotStatic;
    return { ceil: el("path", { class: "vo-ceiling" }, nodes.plot), trace: el("path", { class: "vo-trace" }, nodes.plot), dot: el("circle", { class: "vo-dot", r: 0.9 }, nodes.plot) };
  })();
  function plotDraw(now) {
    let d = "";
    const step = Math.max(1, Math.round(0.1 / T.dt));
    const last = Math.min(T.n - 1, Math.round(now / T.dt));
    for (let i = 0; i <= last; i += step) d += `${d ? "L" : "M"}${px(T.W[i]).toFixed(2)} ${py(T.vo2[i] / TRUTH.bm).toFixed(2)}`;
    const s = sampleAt(T, now);
    d += `L${px(s.W).toFixed(2)} ${py(s.perKg).toFixed(2)}`;
    plotNodes.trace.setAttribute("d", d);
    plotNodes.dot.setAttribute("cx", px(s.W).toFixed(2));
    plotNodes.dot.setAttribute("cy", py(s.perKg).toFixed(2));
    // the ceiling line appears once the plateau holds
    const seen = Math.min(1, Math.max(0, (now - T.tCross) / 0.5));
    plotNodes.ceil.setAttribute("d", `M${px(0).toFixed(2)} ${py(T.ceiling).toFixed(2)}H${px(PLOT.wMax).toFixed(2)}`);
    plotNodes.ceil.setAttribute("stroke-opacity", seen.toFixed(2));
  }

  // ---------------------------------------------------------------- breath in the hose: one WebGL layer (SVG fallback: flowing dashes)
  const LIGHT = fig.closest("[data-theme]")?.getAttribute("data-theme") === "light" ? 1 : 0;
  const hose = DATA.hose;
  const HOSE_LEN = hose[hose.length - 1][2];
  const FRAGMENT = `
uniform float uP[72];
uniform float uShift;
uniform float uAmp;
uniform float uLight;
uniform float uR;
uniform float uLen;
void main(){
  vec2 vb = viewOf(gl_FragCoord.xy);
  float best = 1e9;
  float sb = 0.;
  for (int i = 0; i < 23; i++) {
    vec2 a = vec2(uP[i * 3], uP[i * 3 + 1]);
    vec2 b = vec2(uP[i * 3 + 3], uP[i * 3 + 4]);
    vec2 ab = b - a;
    float h = clamp(dot(vb - a, ab) / max(dot(ab, ab), 1e-6), 0., 1.);
    float d = length(vb - a - ab * h);
    if (d < best) { best = d; sb = mix(uP[i * 3 + 2], uP[i * 3 + 5], h); }
  }
  float r = best / uR;
  float body = 1. - smoothstep(.45, .92, r);
  float ends = window(sb, 2., uLen - 1.5, 2.);
  float u = (sb - uShift) / 26.;
  float bands = .55 + .45 * sin(6.2832 * u);
  float wisp = fbm2(vec2(u * 1.7, r * 2.3 + uShift * .02));
  float a = body * ends * uAmp * clamp(bands * (.55 + .7 * wisp), 0., 1.);
  vec3 dark = tonemap(vec3(.82, .93, 1.) * a * 1.25, 1.1);
  float ad = max(dark.r, max(dark.g, dark.b));
  float al = a * .5;
  vec3 ink = vec3(.34, .48, .58);
  gl_FragColor = mix(vec4(dark, ad), vec4(ink * al, al), uLight);
}`;
  const canvas = stage.querySelector(".vo-gl");
  const flatHose = new Float32Array(72);
  hose.forEach((p, i) => {
    flatHose[i * 3] = p[0];
    flatHose[i * 3 + 1] = p[1];
    flatHose[i * 3 + 2] = p[2];
  });
  const layer = typeof glLayer === "function" ? glLayer({ canvas, fragment: FRAGMENT, view: [DATA.W, DATA.H], camera: DATA.camera, uniforms: ["uShift", "uAmp"], fixed: { uP: flatHose, uLight: LIGHT, uR: DATA.hoseR * 0.9 * KS, uLen: HOSE_LEN } }) : null;
  if (layer) stage.setAttribute("data-gl", "");
  const amp = { x: 0, v: 0 };

  // ---------------------------------------------------------------- one frame
  function render(dtReal) {
    const s = sampleAt(T, t);
    // pedalling at 60 rpm while the test has the rider pedalling
    if (s.pedal) {
      theta -= dtReal * ((TRUTH.cadence / 60) * 2 * Math.PI);
      flyAngle -= dtReal * ((TRUTH.cadence / 60) * 2 * Math.PI) * 2.6;
    }
    // breathing at the modelled rate: breath out for the first `exhale` of each breath; the air in the hose advances by the tidal volume
    const period = 60 / s.f;
    breath = (breath + dtReal / period) % 1;
    const ex = TRUTH.breath.exhale;
    const exhaling = breath < ex;
    const flow = exhaling ? (s.tv * 1000) / (ex * period) : 0; // cm³/s
    shift += (flow / TRUTH.hoseArea) * dtReal;
    vaneAngle += (flow / 900) * dtReal * 2 * Math.PI;
    settle(amp, exhaling ? 0.35 + 0.65 * Math.min(1, s.tv / 2.5) : 0.12, dtReal, exhaling ? 0.12 : 0.35, false);
    const pose = riderAt(theta, B);
    const legs = {};
    for (const k of ["R", "L"]) {
      const L = pose.legs[k];
      legs[k] = { hip: [L.hip[0] - DATA.bike.hipX, L.hip[1]], knee: [L.knee[0] - DATA.bike.hipX, L.knee[1]], ankle: [L.ankle[0] - DATA.bike.hipX, L.ankle[1]], sole: L.sole, toe: L.toe, width: WIDTH };
    }
    const J = MANNEQUIN.skeletonOf({ base, pelvis: pose.pelvis, trunk: pose.trunk, legs, arms: pose.arms });
    const { parts } = MANNEQUIN.partsOf(J);
    view.draw([...parts, ...riderParts(J, pose)], J, decorate);
    if (!frontDone) {
      // the near arm never moves on the bike: copy it once into the front layer, over the hose and its breath
      for (const name of ["shoulderL", "upperL", "elbowL", "foreL", "wristL", "handL"]) {
        const n = view.nodes.get(name);
        if (n) front.appendChild(n.g.cloneNode(true));
      }
      frontDone = true;
    }
    nodes.brake.innerHTML = brakeSvg(s.W);
    nodes.fly.innerHTML = flySvg();
    nodes.vane.innerHTML = vaneSvg();
    // mixed expired gas: O₂ lower and CO₂ higher than room air by the share taken up and given off per litre breathed
    const feo2 = 20.93 - (100 * s.vo2) / 1000 / s.ve;
    const feco2 = (100 * s.rer * s.vo2) / 1000 / s.ve;
    nodes.o2.innerHTML = cellSvg(feo2, 14, 21);
    nodes.co2.innerHTML = cellSvg(feco2, 0, 6);
    plotDraw(t);
    if (layer) layer.draw({ uShift: shift, uAmp: amp.x }, wall);
    readout(s);
  }

  // ---------------------------------------------------------------- readout
  let lastPhase = "";
  function readout(s) {
    out.w.textContent = `${Math.round(s.W)} W`;
    out.hr.textContent = `${Math.round(s.hr)} bpm`;
    out.vo2.textContent = `${s.perKg.toFixed(1)} ml/kg/min`;
    out.rer.textContent = s.rer.toFixed(2);
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
    // one frame that explains it: at the ceiling, the whole line on the monitor, a breath on its way down the hose
    t = T.tCross + 0.6;
    breath = 0.3;
    shift = 30;
    amp.x = 0.8;
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
    wall += dt;
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
