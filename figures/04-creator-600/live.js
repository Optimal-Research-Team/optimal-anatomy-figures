// Fig 4 live code: the mannequin runs on the belt at 10 km/h; cadence comes from the slider.
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
  const buttons = [...fig.querySelectorAll('[data-control="preset"] .opt-seg-btn')];
  const range = fig.querySelector(".cr-range");
  const slow = fig.querySelector("[data-slow]");
  const nodes = { runner: q('[data-part="runner"]'), slats: q('[data-part="slats"]'), marks: q('[data-part="marks"]'), gauge: q('[data-part="gauge"]'), rider: q('[data-part="rider"]'), screen: q('[data-part="screen-body"]'), cadence: q('[data-part="cadence"]') };
  const NS = "http://www.w3.org/2000/svg";
  const el = (tag, attrs, parent) => {
    const n = document.createElementNS(NS, tag);
    for (const [key, value] of Object.entries(attrs || {})) n.setAttribute(key, value);
    if (parent) parent.appendChild(n);
    return n;
  };
  const view = mannequinView(nodes.runner, P, { between: ["plumb"] });
  const Z = DATA.beltZ;
  const base = [DATA.runX, 0, Z];
  const V = beltOf(); // cm/s
  const lo = cadenceOf(TRUTH.range[0]);
  const hi = cadenceOf(TRUTH.range[1]);

  // ---------------------------------------------------------------- state
  let target = TRUTH.cadence0;
  let cadence = TRUTH.cadence0;
  let phi = 0.62;
  let beltAt = 0; // cm of belt travelled
  let clock = 0; // s of figure time
  let speed = 1; // 1 = real time, 0.25 = slow
  let wasStance = { R: false, L: false };
  const marks = []; // { x0, y, t }
  let rider = DATA.runX + landingOf(cadence);
  let riderTo = rider;
  const trace = { R: [], L: [] }; // [t, bend]
  const comLog = []; // [t, z]
  const peak = { R: 0, L: 0, holdR: 0, holdL: 0 };

  // ---------------------------------------------------------------- the plumb laser: an emitter under the pelvis and its beam to the belt
  function plumbParts(J) {
    const top = [J.pelvis[0], 0, J.pelvis[2] - 6.2];
    const F = MANNEQUIN.frameAlong(top, [0, 0, -1]);
    return [
      { name: "emitter", group: "plumb", kind: "lathe", F, profile: [[0, 1.9], [2.6, 1.9], [3.4, 1.2], [4.2, 1.2]], centre: [top[0], 0, top[2] - 2], bias: 0 },
      { name: "beam", group: "plumb", kind: "line", points: [[top[0], 0, top[2] - 4.2], [top[0], 0, Z + 0.05]], centre: [top[0], 0, (top[2] + Z) / 2], className: "cr-beam" },
    ];
  }

  // ---------------------------------------------------------------- decorations on the mannequin: tracking dots, knee glow, centre-of-mass marker
  const DOTS = new Set(["hipR", "hipL", "kneeR", "kneeL", "ankleR", "ankleL", "shoulderR", "shoulderL", "elbowR", "elbowL", "wristR", "wristL", "head"]);
  let frame = null; // { pose, J, loads }
  function decorate(part, g, st) {
    if (!frame) return;
    if (part.name === "kneeR" || part.name === "kneeL") {
      const side = part.name.slice(-1);
      if (!st.glow) {
        // under the ball: first in the part's own group
        const host = g.parentNode;
        st.ring = el("circle", { class: "mq-glow-ring" });
        st.glow = el("circle", { class: "mq-glow" });
        host.insertBefore(st.ring, host.firstChild);
        host.insertBefore(st.glow, host.firstChild);
      }
      const load = frame.loads[side];
      const c = iso(part.c, P);
      const k = P.scale;
      const r = (part.r + 1.6 + 5.5 * load) * k;
      st.glow.setAttribute("cx", c[0].toFixed(1));
      st.glow.setAttribute("cy", c[1].toFixed(1));
      st.glow.setAttribute("r", r.toFixed(2));
      st.glow.setAttribute("fill-opacity", (0.7 * Math.min(1, load)).toFixed(3));
      st.ring.setAttribute("cx", c[0].toFixed(1));
      st.ring.setAttribute("cy", c[1].toFixed(1));
      st.ring.setAttribute("r", r.toFixed(2));
      st.ring.setAttribute("stroke-opacity", (load > 0.02 ? 0.9 : 0).toFixed(2));
    }
    if (DOTS.has(part.name)) {
      if (!st.dot) st.dot = el("circle", { class: "mq-dot", r: (1.35 * P.scale).toFixed(2) }, g);
      const c = iso(part.c ?? part.centre, P);
      st.dot.setAttribute("cx", c[0].toFixed(1));
      st.dot.setAttribute("cy", c[1].toFixed(1));
    }
    if (part.name === "pelvis") {
      // the centre-of-mass marker on the pelvis's near side, at the true COM height
      if (!st.com) {
        st.ring = el("circle", { class: "cr-com-ring", r: (2.6 * P.scale).toFixed(2) }, g);
        st.com = el("circle", { class: "mq-dot", r: (1.35 * P.scale).toFixed(2) }, g);
      }
      const side = frame.near === "L" ? 1 : -1;
      const c = iso([frame.J.pelvis[0], side * 11.6, Z + frame.pose.com], P);
      for (const n of [st.com, st.ring]) {
        n.setAttribute("cx", c[0].toFixed(1));
        n.setAttribute("cy", c[1].toFixed(1));
      }
    }
  }

  // ---------------------------------------------------------------- belt slats, landing marks and the plumb spot
  function beltSvg() {
    const gap = 12;
    const off = ((beltAt % gap) + gap) % gap;
    let d = "";
    for (let x = DATA.belt.x1 - off; x > DATA.belt.x + 0.5; x -= gap) d += lineOnTop([x, -DATA.belt.half + 0.6], [x, DATA.belt.half - 0.6], Z + 0.02, P);
    nodes.slats.setAttribute("d", d);
    let m = "";
    for (const mk of marks) {
      const x = mk.x0 - (beltAt - mk.at);
      const age = clock - mk.t;
      if (x < DATA.belt.x + 2) continue;
      const a = Math.max(0, 1 - age / 1.2);
      m += `<path class="cr-mark" stroke-opacity="${a.toFixed(2)}" d="${lineOnTop([x, mk.y - 4.6], [x, mk.y + 4.6], Z + 0.04, P)}"/>`;
    }
    // the plumb laser draws a line across the belt straight below the centre of mass, zero on the rail ruler
    const px = frame.J.pelvis[0];
    m += `<path class="cr-laser" data-free="" d="${lineOnTop([px, -DATA.belt.half + 0.4], [px, DATA.belt.half - 0.4], Z + 0.05, P)}"/>`;
    const spot = iso([px, 0, Z + 0.05], P);
    m += `<circle class="mq-dot" cx="${spot[0].toFixed(1)}" cy="${spot[1].toFixed(1)}" r="${(0.9 * P.scale).toFixed(2)}"/>`;
    nodes.marks.innerHTML = m;
  }
  function riderSvg() {
    const y = DATA.ruler.y;
    const plan = { x: rider - 1.8, y: y - 0.8, w: 3.6, d: DATA.ruler.d + 1.6, r: 0.6 };
    nodes.rider.innerHTML = solidSvg(slabOf(plan, DATA.railZ + 0.3, 2, P, 2, 0.25), { tone: "mid", className: "cr-rider" }) + `<path class="cr-rider-mark" d="${lineOnTop([rider, y - 0.2], [rider, y + DATA.ruler.d + 0.2], DATA.railZ + 2.3, P)}"/>`;
  }
  function gaugeSvg(com) {
    const g = DATA.gauge;
    const z = Z + com;
    const y = g.plateY;
    // carriage on the post, a laser from it to the runner's side, hold marks for the last stride's top and bottom
    const car = { x: g.x - 2.6, y: g.y - 2.6, w: 5.2, d: 5.2, r: 0.8 };
    let s = solidSvg(slabOf(car, z - 1.6, 3.2, P, 2, 0.3), { tone: "hi", className: "cr-carriage" });
    s += lineSvg(pathOf([iso([g.x + 2.7, g.y + 1, z], P), iso([DATA.runX - 2, -6, z], P)]), { tone: "lit", className: "cr-beam", free: true });
    const window = 120 / cadence;
    let top = -Infinity;
    let bot = Infinity;
    for (const [t, v] of comLog) if (clock - t <= window) {
      top = Math.max(top, v);
      bot = Math.min(bot, v);
    }
    if (Number.isFinite(top)) for (const v of [top, bot]) s += `<path class="cr-hold" d="${pathOf([iso([g.x - 4.4, y + 0.05, Z + v], P), iso([g.x + 4.4, y + 0.05, Z + v], P)])}"/>`;
    nodes.gauge.innerHTML = s;
  }

  // ---------------------------------------------------------------- the display: live skeleton (front view), knee load per step, knee-angle trace
  const SC = DATA.screen;
  const SW = SC.y1 - SC.y0;
  const toScreen = (p) => [SW / 2 + p[1] * 0.46, 4 + (Z + B.H + 6 - p[2]) * 0.46];
  const screenParts = (() => {
    const g = nodes.screen;
    const bones = el("path", { class: "cr-bones" }, g);
    const joints = el("g", { class: "cr-joints" }, g);
    const kneeDots = { R: el("circle", { class: "cr-kneedot", r: 1.5 }, g), L: el("circle", { class: "cr-kneedot", r: 1.5 }, g) };
    const panel = el("g", {}, g);
    // knee load: two bars (L, R) against a reference at the usual cadence's peak
    const barY0 = 107;
    const barH = 19;
    el("path", { class: "cr-ref", d: `M3 ${barY0 - barH / 1.3}H27` }, panel);
    const bars = { L: el("rect", { class: "cr-bar", x: 5, width: 9, y: barY0, height: 0, rx: 0.6 }, panel), R: el("rect", { class: "cr-bar", x: 16, width: 9, y: barY0, height: 0, rx: 0.6 }, panel) };
    for (const x of [5, 16]) el("rect", { class: "cr-well", x, width: 9, y: barY0 - barH, height: barH, rx: 0.6 }, panel).parentNode.insertBefore(panel.lastChild, panel.firstChild);
    const holds = { L: el("path", { class: "cr-holdbar" }, panel), R: el("path", { class: "cr-holdbar" }, panel) };
    el("path", { class: "cr-axis", d: `M3 ${barY0}H27` }, panel);
    // knee-angle trace
    const traceBox = { x: 32, y: 88, w: 27, h: 19 };
    el("path", { class: "cr-axis", d: `M${traceBox.x} ${traceBox.y + traceBox.h}H${traceBox.x + traceBox.w}` }, panel);
    const lines = { L: el("path", { class: "cr-trace", "data-side": "L" }, panel), R: el("path", { class: "cr-trace", "data-side": "R" }, panel) };
    return { bones, joints, kneeDots, bars, holds, lines, barY0, barH, traceBox, jointDots: [] };
  })();
  function screenDraw(J, loads) {
    const s = screenParts;
    const seg = (a, b) => {
      const p = toScreen(a);
      const r = toScreen(b);
      return `M${p[0].toFixed(1)} ${p[1].toFixed(1)}L${r[0].toFixed(1)} ${r[1].toFixed(1)}`;
    };
    const mid = (a, b) => [(a[0] + b[0]) / 2, (a[1] + b[1]) / 2, (a[2] + b[2]) / 2];
    let d = seg(J.hipR, J.hipL) + seg(J.shoulderR, J.shoulderL) + seg(mid(J.hipR, J.hipL), mid(J.shoulderR, J.shoulderL)) + seg(mid(J.shoulderR, J.shoulderL), J.head);
    for (const k of ["R", "L"]) d += seg(J[`hip${k}`], J[`knee${k}`]) + seg(J[`knee${k}`], J[`ankle${k}`]) + seg(J[`shoulder${k}`], J[`elbow${k}`]) + seg(J[`elbow${k}`], J[`wrist${k}`]);
    s.bones.setAttribute("d", d);
    const pts = ["head", "shoulderR", "shoulderL", "elbowR", "elbowL", "wristR", "wristL", "hipR", "hipL", "ankleR", "ankleL"].map((n) => toScreen(J[n]));
    while (s.jointDots.length < pts.length) s.jointDots.push(el("circle", { r: 1.1 }, s.joints));
    pts.forEach((p, i) => {
      s.jointDots[i].setAttribute("cx", p[0].toFixed(1));
      s.jointDots[i].setAttribute("cy", p[1].toFixed(1));
    });
    for (const k of ["R", "L"]) {
      const p = toScreen(J[`knee${k}`]);
      s.kneeDots[k].setAttribute("cx", p[0].toFixed(1));
      s.kneeDots[k].setAttribute("cy", p[1].toFixed(1));
      s.kneeDots[k].setAttribute("r", (1.3 + 1.4 * loads[k]).toFixed(2));
      // bars: live load, and the last landing's peak held as a line
      const h = (s.barH / 1.3) * loads[k];
      s.bars[k].setAttribute("y", (s.barY0 - h).toFixed(2));
      s.bars[k].setAttribute("height", h.toFixed(2));
      const hy = s.barY0 - (s.barH / 1.3) * peak[`hold${k}`];
      const x0 = k === "L" ? 5 : 16;
      s.holds[k].setAttribute("d", peak[`hold${k}`] > 0 ? `M${x0 - 0.6} ${hy.toFixed(2)}H${x0 + 9.6}` : "");
      // trace: knee bend over the last 1.6 s, 0–120°
      const tb = s.traceBox;
      const list = trace[k];
      let path = "";
      for (const [t, v] of list) {
        const x = tb.x + tb.w - ((clock - t) / 1.6) * tb.w;
        if (x < tb.x) continue;
        const y = tb.y + tb.h - (Math.min(120, v) / 120) * tb.h;
        path += `${path ? "L" : "M"}${x.toFixed(1)} ${y.toFixed(1)}`;
      }
      s.lines[k].setAttribute("d", path);
    }
  }

  // ---------------------------------------------------------------- one frame
  function render() {
    const pose = poseAt(phi, cadence, B);
    const legs = {};
    for (const [k, leg] of [["R", pose.right], ["L", pose.left]]) legs[k] = { hip: leg.hip, knee: leg.knee, ankle: leg.ankle, sole: leg.sole, toe: leg.toe };
    const J = MANNEQUIN.skeletonOf({ base, pelvis: pose.pelvis, trunk: pose.trunk, legs, arms: { R: { shoulder: pose.armR, elbow: pose.elbow }, L: { shoulder: pose.armL, elbow: pose.elbow } } });
    const loads = { R: kneeLoadAt(pose.right, cadence), L: kneeLoadAt(pose.left, cadence) };
    const near = depthOf(J.hipL, P) >= depthOf(J.hipR, P) ? "L" : "R";
    frame = { pose, J, loads, near };
    const { parts } = MANNEQUIN.partsOf(J);
    view.draw([...parts, ...plumbParts(J)], J, decorate);
    beltSvg();
    riderSvg();
    gaugeSvg(pose.com);
    screenDraw(J, loads);
    if (nodes.cadence) nodes.cadence.textContent = String(Math.round(cadence));
    return pose;
  }

  // ---------------------------------------------------------------- readout
  let lastText = "";
  function readout() {
    const c = Math.round(cadence * 2) / 2;
    out.spm.textContent = `${Math.round(c)}/min`;
    out.step.textContent = `${stepOf(c).toFixed(2)} m`;
    out.ratio.textContent = `${ratioOf(c).toFixed(1)}%`;
    out.knee.textContent = `${Math.round(kneeOf(c) * 100)}%`;
    stage.setAttribute("aria-valuenow", String(Math.round(c)));
    stage.setAttribute("aria-valuetext", `${Math.round(c)} steps per minute`);
    const pct = Math.round(pctOf(c));
    const text = `${Math.round(c)} steps per minute (${pct > 0 ? "+" : ""}${pct}%): step ${stepOf(c).toFixed(2)} metres, vertical ratio ${ratioOf(c).toFixed(1)}%, kneecap force ${Math.round(kneeOf(c) * 100)}% of usual per step.`;
    if (text !== lastText && Math.abs(cadence - target) < 0.3) {
      status.textContent = text;
      lastText = text;
    }
    if (document.activeElement !== range) range.value = String(Math.round(cadence * 2) / 2);
    for (const b of buttons) {
      const on = Math.abs(cadenceOf(+b.dataset.value) - target) < 0.4;
      b.setAttribute("aria-checked", on ? "true" : "false");
      b.tabIndex = on ? 0 : -1;
    }
  }

  // ---------------------------------------------------------------- time
  function step(dt) {
    cadence += (target - cadence) * (1 - Math.exp(-dt * 3.2));
    const t = dt * speed;
    clock += t;
    beltAt += V * t;
    phi = (phi + (t * cadence) / 120) % 1;
    const pose = render();
    // landings: a mark on the belt under the heel, and the ruler's rider moves to it
    for (const [k, leg] of [["R", pose.right], ["L", pose.left]]) {
      if (leg.stance && !wasStance[k]) {
        const heelX = DATA.runX + leg.ankle[0] - Math.cos(leg.sole) * B.ankleX + Math.sin(leg.sole) * B.ankleZ;
        marks.push({ x0: heelX, at: beltAt, t: clock, y: (k === "L" ? 1 : -1) * B.ankleHalf });
        if (marks.length > 8) marks.shift();
        riderTo = heelX;
        peak[k] = 0;
      }
      if (leg.stance) peak[k] = Math.max(peak[k], kneeLoadAt(leg, cadence));
      if (!leg.stance && wasStance[k]) peak[`hold${k}`] = peak[k];
      wasStance[k] = leg.stance;
      trace[k].push([clock, leg.bend]);
      while (trace[k].length && clock - trace[k][0][0] > 1.8) trace[k].shift();
    }
    comLog.push([clock, pose.com]);
    while (comLog.length && clock - comLog[0][0] > 1.2) comLog.shift();
    rider += (riderTo - rider) * (1 - Math.exp(-dt * 18));
    readout();
  }

  // ---------------------------------------------------------------- input, idle tour, offscreen pause, reduced motion
  const TOUR = [0, 10, 0, -10, 5];
  let tourAt = 0;
  let tourClock = 0;
  let idleSince = -1e9;
  let touring = true;
  const setTarget = (c) => {
    target = clamp(c, lo, hi);
  };
  const takeOver = () => {
    touring = false;
    idleSince = performance.now();
  };
  range.addEventListener("input", () => {
    takeOver();
    setTarget(+range.value);
    if (still.matches) {
      cadence = target;
      renderStill();
    }
  });
  for (const b of buttons)
    b.addEventListener("click", () => {
      takeOver();
      setTarget(cadenceOf(+b.dataset.value));
      if (still.matches) {
        cadence = target;
        renderStill();
      }
    });
  fig.querySelector('[data-control="preset"]').addEventListener("keydown", (e) => {
    const i = buttons.indexOf(document.activeElement);
    if (i < 0) return;
    const j = e.key === "ArrowRight" || e.key === "ArrowDown" ? i + 1 : e.key === "ArrowLeft" || e.key === "ArrowUp" ? i - 1 : null;
    if (j === null) return;
    e.preventDefault();
    const b = buttons[(j + buttons.length) % buttons.length];
    b.focus();
    b.click();
  });
  stage.addEventListener("keydown", (e) => {
    const map = { ArrowRight: 1, ArrowUp: 1, ArrowLeft: -1, ArrowDown: -1, PageUp: 5, PageDown: -5 };
    if (e.key in map) setTarget(Math.round(target) + map[e.key]);
    else if (e.key === "Home") setTarget(lo);
    else if (e.key === "End") setTarget(hi);
    else return;
    e.preventDefault();
    takeOver();
    if (still.matches) {
      cadence = target;
      renderStill();
    }
  });
  slow.addEventListener("click", () => {
    speed = speed === 1 ? 0.25 : 1;
    slow.setAttribute("aria-pressed", speed < 1 ? "true" : "false");
    slow.textContent = speed < 1 ? "Real time" : "Slow";
  });

  function renderStill() {
    // one frame that explains it: the right heel just landed, its mark and the rider at the landing, a full stride of history
    clock = 0;
    marks.length = 0;
    for (const k of ["R", "L"]) trace[k].length = 0;
    comLog.length = 0;
    const T = 120 / cadence;
    for (let i = 0; i <= 60; i++) {
      const p = (0.04 - 1.6 / T + (i / 60) * (1.6 / T) + 2) % 1;
      const ps = poseAt(p, cadence, B);
      const t = -1.6 + (i / 60) * 1.6;
      trace.R.push([t, ps.right.bend]);
      trace.L.push([t, ps.left.bend]);
      comLog.push([t * (1.2 / 1.6), ps.com]);
    }
    phi = 0.04;
    const contact = poseAt(0, cadence, B).right;
    const heelX = DATA.runX + contact.ankle[0] - Math.cos(contact.sole) * B.ankleX + Math.sin(contact.sole) * B.ankleZ;
    beltAt = 0;
    marks.push({ x0: heelX, at: -V * (0.04 * T), t: 0, y: -B.ankleHalf });
    rider = riderTo = heelX;
    peak.holdR = peak.holdL = kneeOf(cadence);
    render();
    readout();
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
      tourClock = 0;
    }
    if (touring) {
      tourClock += dt;
      if (tourClock > 6) {
        tourClock = 0;
        tourAt = (tourAt + 1) % TOUR.length;
      }
      setTarget(cadenceOf(TOUR[tourAt]));
    }
    step(dt);
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
  }).observe(stage);
  still.addEventListener("change", () => (still.matches ? renderStill() : start()));
  for (const n of [range, stage, ...buttons]) n.addEventListener("pointerdown", takeOver);
  if (still.matches) renderStill();
  else {
    step(0);
    start();
  }
}
