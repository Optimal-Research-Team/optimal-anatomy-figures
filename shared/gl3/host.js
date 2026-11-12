// Page side of the shared 3-D layer (shared/gl3). Inlined into a figure's page and embed, after the kit.
//
// gl3Attach(fig, { scene, P, W, H, file, v, redraw }) returns a small controller right away. The figure calls
// `gl.figure(...)`, `gl.move(...)`, `gl.set(...)` and `gl.render()` every frame without caring whether the layer has
// arrived: until it has, they do nothing and the SVG is the whole figure. When the chunk has loaded and drawn its
// first frame the stage flips to `data-gl3="on"` (shared/gl3/gl3.css): the canvas shows under the SVG and the SVG
// becomes the ink pass. The SVG stays the figure with no WebGL 2, a software renderer, Save-Data, a low-memory or
// few-core device, a lost context, or gl="off" on the element.
const GL3_BASE = (() => {
  try {
    const s = document.currentScript;
    // a page may say where the chunk is (window.OPTIMAL_GL3_BASE, relative to the page); an embed script's own URL
    // is the base otherwise, and a standalone figure page keeps the chunk in embed/
    if (window.OPTIMAL_GL3_BASE) return new URL(window.OPTIMAL_GL3_BASE, document.baseURI).href;
    return s && s.src ? s.src : new URL("embed/", document.baseURI).href;
  } catch (_) {
    return "";
  }
})();
const GL3_VERSION = 3; // must equal `version` in shared/gl3/src/gl3.js
function gl3Skip(want) {
  if (want === "off") return "off";
  if (typeof WebGL2RenderingContext === "undefined" || typeof IntersectionObserver === "undefined") return "no-webgl2";
  const c = navigator.connection;
  if (c && (c.saveData || /(^|-)2g$/.test(c.effectiveType || ""))) return "save-data";
  if (navigator.deviceMemory && navigator.deviceMemory < 3) return "low-memory";
  if (navigator.hardwareConcurrency && navigator.hardwareConcurrency < 4) return "few-cores";
  return "";
}
function gl3Probe() {
  let g = null;
  try {
    g = document.createElement("canvas").getContext("webgl2", { failIfMajorPerformanceCaveat: true });
  } catch (_) {}
  if (!g) return "no-webgl2";
  const big = g.getParameter(g.MAX_TEXTURE_SIZE) >= 2048;
  const lose = g.getExtension("WEBGL_lose_context");
  if (lose) lose.loseContext();
  return big ? "" : "small-textures";
}
function gl3Load(src) {
  const w = window;
  if (w.OptimalGL3) return Promise.resolve(w.OptimalGL3);
  if (w.__optimalGL3Loading) return w.__optimalGL3Loading;
  w.__optimalGL3Loading = new Promise((resolve, reject) => {
    const el = document.createElement("script");
    el.src = src;
    el.async = true;
    el.onload = () => (w.OptimalGL3 ? resolve(w.OptimalGL3) : reject(new Error("no layer")));
    el.onerror = () => {
      w.__optimalGL3Loading = null;
      reject(new Error("load"));
    };
    document.head.appendChild(el);
  });
  return w.__optimalGL3Loading;
}
// Drag to turn (the machines). The object spins on its turntable under the same lights, and the camera can rise or
// drop. The drawing (labels, screens, flows: everything the SVG adds) was made for one view, so it steps aside
// while the object is turned (gl3.css, data-gl3-turn). Let go: the object coasts, rests a moment, then swings back
// to the drawing's view, and the ink returns. `turn: true` lets a drag anywhere on the stage turn it;
// `turn: { stage: false }` leaves the stage's own gestures to the figure and turns by the corner handle only.
// A touch drag on the stage turns only sideways, so the page still scrolls under a thumb.
function gl3TurnControl(fig, stage, P, layer, lively, opts) {
  const still = matchMedia("(prefers-reduced-motion: reduce)");
  const anywhere = opts.stage !== false;
  const lo = ((6 - P.elevation) * Math.PI) / 180;
  const hi = ((72 - P.elevation) * Math.PI) / 180;
  const clamp = (x, a, b) => Math.max(a, Math.min(b, x));
  const wrap = (a) => a - Math.PI * 2 * Math.round(a / (Math.PI * 2));
  const handle = document.createElement("button");
  handle.type = "button";
  handle.className = "gl3-turn";
  handle.dataset.at = opts.at || "tl";
  handle.setAttribute("aria-label", "Turn the model. Drag, or use the left and right arrow keys. It swings back by itself.");
  handle.title = "Drag to turn";
  handle.innerHTML = '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M18.1 8.94A9.5 4 0 1 1 8.75 8.24"/><path d="M6.06 6.91 8.75 8.24 6.58 10.31"/><circle cx="12" cy="12" r="2" fill="currentColor" stroke="none"/></svg>';
  handle.style.color = getComputedStyle(fig).color; // the page's ink: the stage itself may be a Cream island
  stage.appendChild(handle);
  stage.dataset.gl3Turnable = anywhere ? "stage" : "handle";
  // the handle shows once a pointer is about (so never on a wall screen), or at once where there is no hover
  const show = () => {
    handle.dataset.shown = "1";
    fig.removeEventListener("pointermove", show);
  };
  if (matchMedia("(hover: none)").matches) show();
  else fig.addEventListener("pointermove", show, { passive: true });

  let yaw = 0;
  let tilt = 0;
  let vy = 0;
  let vt = 0;
  let mode = "idle"; // drag → coast → dwell → home → idle
  let rest = 900;
  let until = 0;
  let raf = 0;
  let last = 0;
  let grab = null;
  let swallow = false;
  const push = () => {
    const L = layer();
    if (!L) return;
    L.turn(yaw, tilt);
    if (!lively()) L.render(); // the figure's own loop draws it otherwise
  };
  const tick = (now) => {
    raf = 0;
    const dt = Math.min(0.05, Math.max(0.001, (now - last) / 1000));
    last = now;
    if (mode === "coast") {
      yaw += vy * dt;
      vy *= Math.exp(-dt * 3.4);
      if (Math.abs(vy) < 0.12) {
        mode = "dwell";
        until = now + rest;
      }
    } else if (mode === "dwell") {
      if (now >= until) {
        mode = "home";
        yaw = wrap(yaw);
        vy = vt = 0;
        if (still.matches) yaw = tilt = 0;
      }
    } else if (mode === "home") {
      const w = 6.5; // a critically damped swing back
      vy += (-2 * w * vy - w * w * yaw) * dt;
      yaw += vy * dt;
      vt += (-2 * w * vt - w * w * tilt) * dt;
      tilt += vt * dt;
      if (Math.abs(yaw) < 0.003 && Math.abs(tilt) < 0.003 && Math.abs(vy) < 0.03) {
        yaw = tilt = 0;
        mode = "idle";
      }
    }
    push();
    if (mode === "idle") {
      delete stage.dataset.gl3Turn; // the ink returns
      return;
    }
    raf = requestAnimationFrame(tick);
  };
  const run = () => {
    stage.dataset.gl3Turn = "1";
    if (!raf) {
      last = performance.now();
      raf = requestAnimationFrame(tick);
    }
  };
  const start = (e, via) => {
    if (!layer() || (e.pointerType === "mouse" && e.button !== 0)) return;
    grab = { id: e.pointerId, x: e.clientX, y: e.clientY, yaw, tilt, live: false, touch: e.pointerType === "touch", via, lx: e.clientX, lt: performance.now(), v: 0 };
  };
  const move = (e) => {
    if (!grab || e.pointerId !== grab.id) return;
    let dx = e.clientX - grab.x;
    let dy = e.clientY - grab.y;
    if (!grab.live) {
      if (Math.hypot(dx, dy) < 6) return;
      if (grab.touch && !grab.via && Math.abs(dx) < Math.abs(dy) * 1.2) { grab = null; return; } // a scroll
      grab.live = true;
      grab.x = e.clientX;
      grab.y = e.clientY;
      dx = dy = 0;
      grab.yaw = yaw = wrap(yaw); // pick it up where it stands
      grab.tilt = tilt;
      if (!grab.via) try { stage.setPointerCapture(e.pointerId); } catch (_) {}
      mode = "drag";
      stage.dataset.gl3Grab = "1";
      run();
    }
    const box = stage.getBoundingClientRect();
    const span = Math.max(240, box.width);
    yaw = grab.yaw + (dx / span) * 3.3; // a drag across the stage is a little over half a turn
    if (!grab.touch || grab.via) tilt = clamp(grab.tilt + (dy / Math.max(240, box.height)) * 1.1, lo, hi);
    const now = performance.now();
    if (now - grab.lt > 12) {
      grab.v = grab.v * 0.4 + ((((e.clientX - grab.lx) / span) * 3.3) / ((now - grab.lt) / 1000)) * 0.6;
      grab.lx = e.clientX;
      grab.lt = now;
    }
    if (e.cancelable) e.preventDefault();
  };
  const end = (e) => {
    if (!grab || e.pointerId !== grab.id) return;
    const g = grab;
    grab = null;
    delete stage.dataset.gl3Grab;
    if (!g.live) return;
    swallow = true; // the click that follows a drag is not a click on the figure
    setTimeout(() => (swallow = false), 60);
    vy = !still.matches && performance.now() - g.lt < 90 ? clamp(g.v, -9, 9) : 0;
    vt = 0;
    rest = 900;
    mode = "coast";
    run();
  };
  const nudge = (dir) => {
    if (!layer()) return;
    rest = 1600;
    if (still.matches) {
      yaw += dir * 0.6;
      mode = "dwell";
      until = performance.now() + rest;
    } else {
      vy = dir * 2.6;
      mode = "coast";
    }
    run();
  };
  const onDown = (e) => {
    if (e.target.closest && e.target.closest("button, a, input, select, textarea, [data-gl3-noturn]")) return;
    start(e, false);
  };
  const onHandleDown = (e) => {
    e.stopPropagation(); // not one of the stage's own gestures
    start(e, true);
    try { handle.setPointerCapture(e.pointerId); } catch (_) {}
  };
  const onClick = (e) => {
    if (!swallow) return;
    swallow = false;
    e.stopImmediatePropagation();
    e.preventDefault();
  };
  const onHandleClick = (e) => {
    e.stopPropagation();
    if (!swallow) nudge(1); // a tap or Enter: a short look round
  };
  const onKey = (e) => {
    const dir = e.key === "ArrowLeft" ? -1 : e.key === "ArrowRight" ? 1 : 0;
    const back = e.key === "Escape" || e.key === "Home";
    if (!dir && !back) return;
    e.stopPropagation(); // the stage may have arrow keys of its own
    e.preventDefault();
    if (dir) nudge(dir);
    else if (mode !== "idle") { until = 0; mode = "dwell"; run(); }
  };
  if (anywhere) stage.addEventListener("pointerdown", onDown);
  handle.addEventListener("pointerdown", onHandleDown);
  handle.addEventListener("click", onHandleClick);
  handle.addEventListener("keydown", onKey);
  stage.addEventListener("pointermove", move);
  stage.addEventListener("pointerup", end);
  stage.addEventListener("pointercancel", end);
  stage.addEventListener("click", onClick, true);
  return {
    /** For QA and scripted views: hold a pose (no swing back) until home() or the next drag. */
    hold(y, t = 0) {
      yaw = y;
      tilt = t;
      mode = y || t ? "held" : "idle";
      if (y || t) stage.dataset.gl3Turn = "1";
      else delete stage.dataset.gl3Turn;
      push();
    },
    remove() {
      if (raf) cancelAnimationFrame(raf);
      if (anywhere) stage.removeEventListener("pointerdown", onDown);
      stage.removeEventListener("pointermove", move);
      stage.removeEventListener("pointerup", end);
      stage.removeEventListener("pointercancel", end);
      stage.removeEventListener("click", onClick, true);
      fig.removeEventListener("pointermove", show);
      handle.remove();
      delete stage.dataset.gl3Turn;
      delete stage.dataset.gl3Grab;
      delete stage.dataset.gl3Turnable;
    },
  };
}
function gl3Attach(fig, { scene, P, W, H, file = "optimal-gl3.js", v = "1", redraw, build = null, island = true, turn = null } = {}) {
  const stage = fig.querySelector(".iso-stage");
  const svg = stage && stage.querySelector("svg.iso-svg, svg");
  const host = fig.getRootNode() && fig.getRootNode().host;
  let L = null;
  let turner = null;
  let liveAt = 0; // when the figure's own loop last rendered
  // Frame pacing: while the figure animates it renders once a frame. If those frames run long for a second or so,
  // the layer steps its quality down a level (lighter occlusion, then none and a lower pixel ratio). It never steps up.
  let last = 0;
  let slow = 0;
  let run = 0;
  let strikes = 0;
  const paced = new URLSearchParams(location.search).get("gl3pace") !== "off"; // QA can hold full quality
  const pace = () => {
    if (!paced) return;
    const now = performance.now();
    const dt = now - last;
    last = now;
    if (dt > 120) { slow = 0; run = 0; return; } // not a running animation
    run++;
    if (dt > 30) slow++;
    if (run >= 45) {
      // two slow stretches in a row, so one hiccup (a tab waking, another page loading) costs nothing
      strikes = slow > 20 ? strikes + 1 : 0;
      if (strikes >= 2 && L.quality() > 0) { L.quality(L.quality() - 1); strikes = 0; }
      slow = 0;
      run = 0;
    }
  };
  const ctl = {
    on: false,
    figure(key, parts, materialOf) { if (L) L.figure(key, parts, materialOf); },
    move(piece, vec) { if (L) L.move(piece, vec); },
    pose(piece, R, t) { if (L) L.pose(piece, R, t); },
    set(name, what) { return L ? L.set(name, what) : false; },
    add(desc) { return L ? L.add(desc) : false; },
    update(state) { if (L) L.update(state); },
    view(x, y, w, h) { if (L) L.view(x, y, w, h); },
    render() { if (L) { liveAt = performance.now(); L.render(); pace(); } },
    /** Hold a turned pose (yaw, tilt in radians); hold(0, 0) is the drawing's own view. Figures with `turn` only. */
    hold(y, t) { if (turner) turner.hold(y, t); },
    stats: () => (L ? L.stats() : null),
  };
  if (!stage || !svg || !scene) return ctl;
  const off = (why) => {
    if (turner) turner.remove();
    turner = null;
    if (L) L.dispose();
    L = null;
    ctl.on = false;
    stage.dataset.gl3 = `svg:${why}`;
    stage.classList.remove("iso", "optimal");
    if (stage.dataset.gl3Theme) { stage.removeAttribute("data-theme"); delete stage.dataset.gl3Theme; }
    if (redraw) redraw();
  };
  const why = gl3Skip(host ? host.getAttribute("gl") : new URLSearchParams(location.search).get("gl"));
  if (why) { stage.dataset.gl3 = `svg:${why}`; return ctl; }
  stage.dataset.gl3 = "waiting";
  const begin = async () => {
    const probe = GL3_BASE ? gl3Probe() : "no-src";
    if (probe) return off(probe);
    stage.dataset.gl3 = "loading";
    let api;
    try {
      api = await gl3Load(new URL(`${file}?v=${v}`, GL3_BASE).href);
    } catch (_) {
      return off("load");
    }
    if (api.version !== GL3_VERSION) return off("version");
    const themed = fig.closest("[data-theme]");
    const theme = themed && themed.getAttribute("data-theme") === "light" ? "light" : "dark";
    const canvas = document.createElement("canvas");
    canvas.className = "gl3-canvas";
    canvas.setAttribute("aria-hidden", "true");
    stage.insertBefore(canvas, stage.firstChild);
    L = api.create({ canvas, P, W, H, scene, theme, clear: null, coarse: matchMedia("(pointer: coarse)").matches, debug: new URLSearchParams(location.search).get("gl3debug") || "", build, onLost: () => off("lost") });
    if (!L) { canvas.remove(); return off("init"); }
    const fit = () => {
      const s = svg.getBoundingClientRect();
      const t = stage.getBoundingClientRect();
      const k = stage.offsetWidth ? t.width / stage.offsetWidth : 1; // a scaled ancestor (the TV's stage)
      canvas.style.left = `${((s.left - t.left) / k).toFixed(2)}px`;
      canvas.style.top = `${((s.top - t.top) / k).toFixed(2)}px`;
      canvas.style.width = `${(s.width / k).toFixed(2)}px`;
      canvas.style.height = `${(s.height / k).toFixed(2)}px`;
      L.resize(Math.round(s.width / k), Math.round(s.height / k));
    };
    fit();
    if (typeof ResizeObserver !== "undefined") new ResizeObserver(() => { if (L) { fit(); L.render(); } }).observe(svg);
    ctl.on = true;
    // the stage becomes a Cream island: the SVG is now ink on rendered solids, whatever the page's theme
    // (island: false keeps the page's own theme on the stage: for figures whose SVG is labels over their own 3-D scene)
    if (island && theme !== "light") { stage.classList.add("iso", "optimal"); stage.setAttribute("data-theme", "light"); stage.dataset.gl3Theme = "1"; }
    stage.__gl3 = L; // QA reads stats and stills through this
    if (redraw) redraw(); // the figure pushes its current state and renders
    L.render();
    stage.dataset.gl3 = "on";
    const want = host ? host.getAttribute("turn") : new URLSearchParams(location.search).get("turn");
    if (turn && want !== "off" && L.turn) {
      turner = gl3TurnControl(fig, stage, P, () => L, () => performance.now() - liveAt < 100, turn === true ? {} : turn);
      stage.__gl3Turn = turner; // QA holds poses through this
    }
  };
  const whenIdle = () => (window.requestIdleCallback ? requestIdleCallback(() => begin(), { timeout: 1200 }) : setTimeout(begin, 120));
  const near = new IntersectionObserver(
    (entries) => {
      if (!entries.some((en) => en.isIntersecting)) return;
      near.disconnect();
      whenIdle();
    },
    { rootMargin: "600px 0px" },
  );
  near.observe(stage);
  return ctl;
}
