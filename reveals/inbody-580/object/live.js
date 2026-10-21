const DATA = __DATA__;
__HELPERS__;
__FILM__;
const stage = document.querySelector(".ar-stage");
const readout = document.querySelector("[data-readout]");
const still = matchMedia("(prefers-reduced-motion: reduce)");
const START = FIGURE.start ?? { yaw: -35, pitch: 12 };
const target = { yaw: START.yaw, pitch: START.pitch, apart: 0, ...FEATURE_DEFAULTS };
const drawn = { ...target };
const EASES = { yaw: 0.22, pitch: 0.22, apart: 0.32 };
for (const f of FEATURE_KEYS) EASES[f.channel] = f.ease ?? 0.25;
let touring = !still.matches;
let tourClock = 0;
let idle = 0;
let frame = 0;
let last = 0;
let visible = false;
let drag = null;
let hovering = false;
const ctl = TURN.mount(stage, DATA.turn, { onHold: () => hold() });
window.TURN = TURN;
function hold() {
  touring = false;
  clearTimeout(idle);
  idle = setTimeout(() => {
    if (hovering || drag) return hold();
    touring = !still.matches;
    run();
  }, 4200);
}
const follow = (from, to, dt, seconds) => to + (from - to) * Math.exp(-dt / seconds);
const svgs = [...stage.querySelectorAll("svg")];
const live = svgs[svgs.length - 1];
const halo = svgs[0].querySelector(".iso-halo");
const VB = svgs[0].getAttribute("viewBox").split(" ").map(Number);
const view = { zoom: 1.4, cx: VB[2] / 2, cy: VB[3] / 2, y1: VB[3] * 0.7, w: VB[2] * 0.4 };
function frameView(dt) {
  const b = live.getBBox();
  if (!b.width) return;
  const goal = {
    zoom: Math.min(1.9, (VB[2] * 0.8) / b.width, (VB[3] * 0.78) / b.height),
    cx: b.x + b.width / 2,
    cy: b.y + b.height / 2,
    y1: b.y + b.height,
    w: b.width,
  };
  for (const key in goal) view[key] = dt ? follow(view[key], goal[key], dt, 0.28) : goal[key];
  const w = VB[2] / view.zoom;
  const h = VB[3] / view.zoom;
  const vb = `${(view.cx - w / 2).toFixed(2)} ${(view.cy - h / 2).toFixed(2)} ${w.toFixed(2)} ${h.toFixed(2)}`;
  for (const svg of svgs) svg.setAttribute("viewBox", vb);
  halo.setAttribute("cx", view.cx.toFixed(2));
  halo.setAttribute("cy", (view.y1 + 10 / view.zoom + 6).toFixed(2));
  halo.setAttribute("rx", (view.w * 0.34).toFixed(2));
  halo.setAttribute("ry", (view.w * 0.034 + 2).toFixed(2));
}
function paint(dt = 0) {
  ctl.set({ root: { R: orient(drawn.yaw, drawn.pitch, 0) }, ...featureValues(drawn, explodeValues(drawn.apart)) });
  const vars = cssVars(drawn);
  for (const key in vars) stage.style.setProperty(key, vars[key]);
  frameView(dt);
  const state = drawn.apart > 0.02 ? `apart ${Math.round(drawn.apart * 100)}% · ${DATA.parts} parts` : status(drawn);
  const text = `${state} · ${(((drawn.yaw % 360) + 360) % 360).toFixed(0)}°`;
  if (readout.textContent !== text) readout.textContent = text;
  stage.setAttribute("aria-valuetext", text);
}
function tick(now) {
  const dt = Math.min(0.05, last ? (now - last) / 1e3 : 0.016);
  last = now;
  if (touring) {
    tourClock += dt;
    target.yaw = START.yaw + tourClock * 14;
    target.pitch = START.pitch + 8 * Math.sin(tourClock * 0.4);
    const lap = (tourClock % 26) / 26;
    target.apart = lap > 0.42 && lap < 0.64 ? 1 : 0;
    for (const f of FEATURE_KEYS) {
      if (!f.tour || !f.values) continue;
      const on = lap > f.tour[0] && lap < f.tour[1];
      if (f.run) {
        if (on && target[f.channel] === 0) target[f.channel] = 1;
        if (!on && target[f.channel] === 1) target[f.channel] = drawn[f.channel] = 0;
      } else target[f.channel] = on ? f.values[1] : f.values[0];
    }
  }
  for (const key in target) {
    const run = FEATURE_KEYS.find((f) => f.channel === key && f.run);
    if (run) drawn[key] = target[key] > drawn[key] ? Math.min(target[key], drawn[key] + dt / run.run) : target[key];
    else drawn[key] = follow(drawn[key], target[key], dt, (key === "yaw" || key === "pitch") && drag ? 0.06 : EASES[key]);
  }
  paint(dt);
  sync();
  // eased channels settle within 0.01; a running measurement must reach its end exactly
  const moving = touring || drag || Object.keys(target).some((k) => Math.abs(drawn[k] - target[k]) > (FEATURE_BY_ACT[k] && FEATURE_BY_ACT[k].run ? 0 : 0.01));
  frame = visible && moving ? requestAnimationFrame(tick) : 0;
  if (!frame) last = 0;
}
function run() {
  if (!frame && visible) frame = requestAnimationFrame(tick);
}
new IntersectionObserver((entries) => {
  visible = entries[0].isIntersecting;
  run();
}).observe(stage);
// explicit choices (tap, key, button) pin the state: hover no longer takes it apart and the tour stays off
let pinned = false;
function choose() {
  pinned = true;
  touring = false;
  clearTimeout(idle);
}
const controls = document.querySelector(".ar-controls");
const button = (act) => controls && controls.querySelector(`[data-act="${act}"]`);
const FEATURE_BY_ACT = Object.fromEntries(FEATURE_KEYS.map((f) => [f.channel, f]));
function act(name) {
  choose();
  if (name === "apart") target.apart = target.apart ? 0 : 1;
  else {
    const f = FEATURE_BY_ACT[name];
    if (!f) return;
    if (f.run) {
      // a measurement needs the grips held and the screen on
      target.grip = 1;
      target.screen = 1;
      drawn[f.channel] = 0;
      target[f.channel] = 1;
    } else target[f.channel] = target[f.channel] === f.values[1] ? f.values[0] : f.values[1];
  }
  sync();
  run();
}
let synced = "";
function sync() {
  if (!controls) return;
  const running = drawn.scan > 0 && drawn.scan < 1 && target.scan === 1;
  const key = `${target.apart}|${target.grip}|${target.screen}|${running}`;
  if (key === synced) return;
  synced = key;
  const apart = button("apart");
  if (apart) {
    apart.textContent = target.apart ? "Put together" : "Take apart";
    apart.setAttribute("aria-pressed", target.apart ? "true" : "false");
  }
  for (const f of FEATURE_KEYS) {
    const b = button(f.channel);
    if (!b) continue;
    if (f.run) {
      b.textContent = running ? "Measuring…" : f.button;
      b.setAttribute("aria-disabled", running ? "true" : "false");
    } else b.setAttribute("aria-pressed", target[f.channel] === f.values[1] ? "true" : "false");
  }
}
if (controls)
  controls.addEventListener("click", (e) => {
    const b = e.target.closest("button[data-act]");
    if (!b || b.getAttribute("aria-disabled") === "true") return;
    act(b.dataset.act);
  });
stage.addEventListener("pointerenter", (e) => {
  if (e.pointerType !== "mouse") return;
  hovering = true;
  if (pinned) return;
  hold();
  target.apart = 1;
  run();
});
stage.addEventListener("pointerleave", (e) => {
  if (e.pointerType !== "mouse") return;
  hovering = false;
  if (pinned) return;
  if (!drag) target.apart = 0;
  run();
});
stage.addEventListener("pointerdown", (e) => {
  if (!pinned) hold();
  else touring = false;
  drag = { x: e.clientX, y: e.clientY, t: performance.now(), yaw: target.yaw, pitch: target.pitch, id: e.pointerId };
  stage.setPointerCapture(e.pointerId);
  run();
});
stage.addEventListener("pointermove", (e) => {
  if (!drag) return;
  const w = stage.getBoundingClientRect().width;
  target.yaw = drag.yaw + ((e.clientX - drag.x) / w) * 300;
  target.pitch = Math.max(-60, Math.min(80, drag.pitch - ((e.clientY - drag.y) / w) * 200));
  run();
});
stage.addEventListener("pointerup", (e) => {
  // a short touch tap (< 8 px, < 300 ms) takes it apart or puts it together; a drag only turns it
  if (drag && e.pointerType !== "mouse" && Math.hypot(e.clientX - drag.x, e.clientY - drag.y) < 8 && performance.now() - drag.t < 300) {
    target.yaw = drag.yaw;
    target.pitch = drag.pitch;
    drag = null;
    act("apart");
    return;
  }
  drag = null;
  run();
});
stage.addEventListener("pointercancel", () => {
  drag = null;
  run();
});
stage.addEventListener("keydown", (e) => {
  const key = e.key.toLowerCase();
  const feature = FEATURE_KEYS.find((f) => f.key === key);
  if (key === "arrowleft") target.yaw -= 15;
  else if (key === "arrowright") target.yaw += 15;
  else if (key === "arrowup") target.pitch = Math.min(80, target.pitch + 10);
  else if (key === "arrowdown") target.pitch = Math.max(-60, target.pitch - 10);
  else if (key === "a" || key === " ") {
    e.preventDefault();
    return act("apart");
  } else if (feature) {
    e.preventDefault();
    return act(feature.channel);
  } else return;
  e.preventDefault();
  hold();
  run();
});
window.__anatomy = {
  target,
  drawn,
  paint,
  set: (v) => {
    Object.assign(target, v);
    Object.assign(drawn, v);
    touring = false;
    paint();
sync();
    sync();
  },
  act,
  get pinned() {
    return pinned;
  },
  explodeValues,
  orient,
};
paint();
sync();
