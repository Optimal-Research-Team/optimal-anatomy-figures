// A2 · the hot-flash switch in real-time 3-D: the figure's one WebGL layer.
//
// gl/build-gl.sh bundles this file (with three r186.1, tree-shaken) into one classic script,
// gl/hypothalamus-3d.js, which build.mjs copies next to the embed. live.js loads it only
// when the figure nears the screen and the device can run it; until then, and whenever it can't, the
// SVG drawing is the figure.
//
// live.js owns the card: the four state buttons, the readouts, the scene line, the caption, the idle
// tour, and the SVG. This layer draws the specimen in its canvas and nothing else. It runs the same
// simulation the SVG runs (hypo3d-model.js, numbers from ../model.mjs), so bursts, packets, the
// heat-loss centre's drive and every flash land at the same moments.
//
//   const L = OptimalFigA2GL.create({ canvas, theme, coarse, box, onLost, onRestored, onGiveUp, onInteract });
//   L.setStage(i)      0 before, 1 after, 2 hormone therapy, 3 non-hormonal (eases as A2 does)
//   await L.ready      true once the first frame is on the canvas (false if it couldn't start)
//   L.detach()         the host took the figure off the page: stop, and leave no listener on the document
//   L.attach()         it's back: carry on with the same context
//   L.dispose()        stop, free the GPU and lose the context
//   L.stats()          draw calls, triangles, frame time, pixel ratio (QA)
//   L.renderAt(i, t)   QA: a deterministic still t seconds into stage i (no sway); L.resume() restarts
//
// Reduced motion: no loop and no sway; each stage shows A2's still (after: mid-flash; before: just
// after a burst). A drag still turns it, drawn on demand. Off screen or in a hidden tab, nothing renders.
// No network, no storage: everything is generated in code.
import { HypoScene } from "./hypo3d-scene.js";
import { Sim, STAGES } from "./hypo3d-model.js";
import { SIM_ANATOMY } from "./hypo3d-anatomy.js";

const DEG = Math.PI / 180;
const VIEW = { yaw: 21 * DEG, pitch: 21 * DEG }; // the deck's 3/4 view: cut face, top and back end all show
const SWAY = { yaw: 7 * DEG, pitch: 2.5 * DEG, period: 14 }; // the idle sway
const DRAG = { yaw: 30 * DEG, pitch: 10 * DEG }; // how far a drag turns it (it eases back on release)
const DPR_CAP = { coarse: 1.5, fine: 2 }; // phones: 1.5× is sharp at this size and saves ~45 % of the pixels
const MAX_PIXELS = 1.8e6; // never render more than this many canvas pixels, whatever the screen

function create({ canvas, theme = "light", coarse = false, box = null, onLost, onRestored, onGiveUp, onInteract } = {}) {
  let scene;
  try {
    scene = new HypoScene(canvas, { theme, lite: coarse });
  } catch (_) {
    return null;
  }
  const reduceMQ = matchMedia("(prefers-reduced-motion: reduce)");
  const sim = new Sim(SIM_ANATOMY);
  let stage = 0;
  sim.reset(STAGES[0].e, STAGES[0].blocked);
  for (let i = 0; i < 300; i++) sim.step(1 / 60); // A2 warms up 5 s before its first frame

  let raf = 0;
  let last = 0;
  let sway = 0;
  let visible = true;
  let frozen = false; // a QA still (renderAt) holds the frame until resume()
  let lost = false;
  let dead = false;
  let parked = false; // detached from the page by the host
  const sized = []; // resolvers waiting for the canvas to have a size
  let w = 0, h = 0, dpr = 1;
  let q = 1; // adaptive resolution (1 = the full capped pixel ratio)
  const drag = { yaw: 0, pitch: 0, on: false, id: -1, x: 0, y: 0, y0: 0, p0: 0, mouse: false };
  const gov = { n: 0, sum: 0, check: 0, locked: false, good: 0, slow: 0, skip: 1, ms: 0 };

  // ---------------------------------------------------------------- size
  const topDpr = () => Math.min(coarse ? DPR_CAP.coarse : DPR_CAP.fine, window.devicePixelRatio || 1);
  function resize() {
    if (dead || !scene.ready) return; // init() sizes it once the scene exists
    const cw = canvas.clientWidth, ch = canvas.clientHeight;
    if (!cw || !ch) return;
    let d = Math.max(1, topDpr() * q);
    if (cw * ch * d * d > MAX_PIXELS) d = Math.max(1, Math.sqrt(MAX_PIXELS / (cw * ch)));
    if (cw === w && ch === h && Math.abs(d - dpr) < 0.01) return;
    const reframe = cw !== w || ch !== h;
    w = cw;
    h = ch;
    dpr = d;
    while (sized.length) sized.pop()();
    scene.setSize(w, h, dpr);
    if (reframe) scene.fit(box, VIEW.yaw, VIEW.pitch);
    // a resize clears the canvas: redraw now if no loop will
    if (!raf) render(0);
  }

  // ---------------------------------------------------------------- drawing
  function view() {
    const sw = reduceMQ.matches || frozen ? 0 : 1;
    const ph = (2 * Math.PI * sway) / SWAY.period;
    return { yaw: VIEW.yaw + sw * SWAY.yaw * Math.sin(ph) + drag.yaw, pitch: VIEW.pitch + sw * SWAY.pitch * Math.sin(ph + Math.PI / 2) + drag.pitch };
  }
  function render(dt) {
    if (dead || lost || !w || !scene.ready) return;
    const v = view();
    scene.setView(v.yaw, v.pitch);
    scene.update(sim, dt);
    scene.render();
  }
  const running = () => !dead && !lost && !parked && !frozen && visible && !document.hidden && !reduceMQ.matches;
  function kick() {
    if (raf || !running()) return;
    last = 0;
    gov.skip = 1; // the first second after a (re)start carries compile and upload hiccups
    raf = requestAnimationFrame(tick);
  }
  function halt() {
    if (raf) cancelAnimationFrame(raf);
    raf = 0;
  }
  function tick(now) {
    raf = 0;
    if (!running()) return;
    const raw = last ? Math.min(0.25, (now - last) / 1000) : 1 / 60;
    const dt = Math.min(0.05, raw);
    last = now;
    govern(raw);
    if (dead) return;
    sim.step(dt);
    sway += dt;
    if (!drag.on) {
      const k = 1 - Math.exp(-dt / 0.55);
      drag.yaw -= drag.yaw * k;
      drag.pitch -= drag.pitch * k;
    }
    render(dt);
    raf = requestAnimationFrame(tick);
  }
  function still() {
    sim.still();
    sway = 0;
    render(0);
  }

  // ---------------------------------------------------------------- the governor
  // Every 60 frames: if frames average slower than 50 fps, render 15 % fewer pixels per side; if a step
  // down didn't help (a 30 Hz low-power cap, not the GPU), undo it and stop adapting; give pixels back
  // after four windows of headroom. If frames still run slower than about 22 fps at the floor for three
  // windows in a row, the device can't carry it: hand the figure back to the SVG (onGiveUp).
  function govern(raw) {
    gov.n++;
    gov.sum += raw;
    if (gov.n < 60) return;
    const avg = gov.sum / gov.n;
    gov.ms = avg * 1000;
    gov.n = 0;
    gov.sum = 0;
    if (gov.skip > 0) {
      gov.skip--;
      return;
    }
    const floor = 1 / topDpr();
    if (gov.check) {
      if (avg > gov.check * 0.88) {
        q = Math.min(1, q + 0.15);
        gov.locked = true;
        resize();
      }
      gov.check = 0;
    } else if (!gov.locked && avg > 1 / 50 && dpr > 1.01 && q > floor + 0.01) {
      gov.check = avg;
      q = Math.max(floor, q - 0.15);
      gov.good = 0;
      resize();
    } else if (avg < 1 / 58 && q < 1) {
      if (++gov.good >= 4) {
        q = Math.min(1, q + 0.1);
        gov.good = 0;
        resize();
      }
    } else gov.good = 0;
    const atFloor = gov.locked || dpr <= 1.01 || q <= floor + 0.01;
    gov.slow = avg > 1 / 22 && atFloor ? gov.slow + 1 : 0;
    if (gov.slow >= 3 && onGiveUp) {
      onGiveUp("slow");
    }
  }

  // ---------------------------------------------------------------- drag to turn
  // A sideways drag turns the specimen and it eases back on release. On touch, the stage keeps
  // touch-action: pan-y, so an up-and-down swipe still scrolls the page; a mouse can also tilt it.
  function onDown(e) {
    if (e.button !== undefined && e.button !== 0) return;
    drag.on = true;
    drag.id = e.pointerId;
    drag.x = e.clientX;
    drag.y = e.clientY;
    drag.y0 = drag.yaw;
    drag.p0 = drag.pitch;
    drag.mouse = e.pointerType === "mouse";
    try {
      canvas.setPointerCapture(e.pointerId);
    } catch (_) {}
    canvas.classList.add("is-dragging");
    if (onInteract) onInteract();
  }
  function onMove(e) {
    if (!drag.on || e.pointerId !== drag.id) return;
    const span = Math.max(220, canvas.clientWidth * 0.5);
    drag.yaw = Math.max(-DRAG.yaw, Math.min(DRAG.yaw, drag.y0 - ((e.clientX - drag.x) / span) * DRAG.yaw));
    if (drag.mouse) drag.pitch = Math.max(-DRAG.pitch, Math.min(DRAG.pitch, drag.p0 + ((e.clientY - drag.y) / span) * DRAG.pitch * 1.4));
    if (onInteract) onInteract();
    if (!raf) requestAnimationFrame(() => !raf && render(0)); // not looping (reduced motion, a still): draw on demand
  }
  function onUp(e) {
    if (!drag.on || e.pointerId !== drag.id) return;
    drag.on = false;
    canvas.classList.remove("is-dragging");
    try {
      canvas.releasePointerCapture(e.pointerId);
    } catch (_) {}
  }

  // ---------------------------------------------------------------- context loss, visibility, motion
  function onLostCtx(e) {
    e.preventDefault(); // ask for the context back
    if (dead) return;
    lost = true;
    halt();
    if (onLost) onLost();
  }
  function onRestoredCtx() {
    if (dead) return;
    lost = false;
    scene.restore();
    w = h = 0;
    resize();
    if (reduceMQ.matches) still();
    else render(0);
    kick();
    if (onRestored) onRestored();
  }
  const onVis = () => (document.hidden ? halt() : kick());
  const onReduce = () => {
    if (reduceMQ.matches) {
      halt();
      still();
    } else kick();
  };
  const io = new IntersectionObserver((entries) => {
    visible = entries.some((en) => en.isIntersecting);
    if (visible) kick();
    else halt();
  });
  const ro = new ResizeObserver(() => resize());
  canvas.addEventListener("webglcontextlost", onLostCtx);
  canvas.addEventListener("webglcontextrestored", onRestoredCtx);
  canvas.addEventListener("pointerdown", onDown);
  canvas.addEventListener("pointermove", onMove);
  canvas.addEventListener("pointerup", onUp);
  canvas.addEventListener("pointercancel", onUp);
  document.addEventListener("visibilitychange", onVis);
  reduceMQ.addEventListener("change", onReduce);
  io.observe(canvas);
  ro.observe(canvas);
  resize();

  // ---------------------------------------------------------------- the first frame
  const ready = (async () => {
    try {
      await scene.init();
    } catch (_) {
      return false;
    }
    if (dead) return false;
    await scene.compile();
    if (dead) return false;
    resize();
    if (!w) await new Promise((r) => sized.push(r)); // created while off the page: wait until it has a size
    if (dead) return false;
    if (reduceMQ.matches) still();
    else render(0);
    // a shader that failed to compile or link would leave the specimen blank: check them all
    if (!scene.linked()) return false;
    kick();
    return true;
  })();

  return {
    ready,
    setStage(i) {
      if (dead || !STAGES[i]) return;
      stage = i;
      sim.setTarget(STAGES[i].e, STAGES[i].blocked);
      if (frozen) frozen = false;
      if (reduceMQ.matches) still();
      else kick();
    },
    resume() {
      frozen = false;
      if (reduceMQ.matches) still();
      kick();
    },
    renderAt(i, t, { yaw = 0, pitch = 0 } = {}) {
      if (dead || !STAGES[i]) return;
      frozen = true;
      halt();
      stage = i;
      sim.setTarget(STAGES[i].e, STAGES[i].blocked);
      sim.seek(t);
      drag.yaw = yaw * DEG;
      drag.pitch = pitch * DEG;
      sway = 0;
      render(0);
    },
    get stage() {
      return stage;
    },
    detach() {
      if (dead || parked) return;
      parked = true;
      halt();
      document.removeEventListener("visibilitychange", onVis);
      reduceMQ.removeEventListener("change", onReduce);
    },
    attach() {
      if (dead || !parked) return;
      parked = false;
      document.addEventListener("visibilitychange", onVis);
      reduceMQ.addEventListener("change", onReduce);
      resize();
      if (reduceMQ.matches) still();
      else {
        if (!raf) render(0);
        kick();
      }
    },
    get flash() {
      return sim.flash;
    },
    get scene() {
      return scene; // QA and tuning only
    },
    stats() {
      return { ...scene.stats(), frameMs: +gov.ms.toFixed(1), width: w, height: h, dpr: +dpr.toFixed(2), q: +q.toFixed(2), lite: coarse, theme, running: !!raf };
    },
    dispose() {
      if (dead) return;
      dead = true;
      halt();
      io.disconnect();
      ro.disconnect();
      canvas.removeEventListener("pointerdown", onDown);
      canvas.removeEventListener("pointermove", onMove);
      canvas.removeEventListener("pointerup", onUp);
      canvas.removeEventListener("pointercancel", onUp);
      if (!parked) {
        document.removeEventListener("visibilitychange", onVis);
        reduceMQ.removeEventListener("change", onReduce);
      }
      try {
        scene.dispose();
        scene.renderer.forceContextLoss();
      } catch (_) {}
      canvas.removeEventListener("webglcontextlost", onLostCtx);
      canvas.removeEventListener("webglcontextrestored", onRestoredCtx);
    },
  };
}

globalThis.OptimalFigA2GL = { version: 1, create };
