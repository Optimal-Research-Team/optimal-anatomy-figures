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
    return s && s.src ? s.src : new URL("embed/", document.baseURI).href;
  } catch (_) {
    return "";
  }
})();
const GL3_VERSION = 2; // must equal `version` in shared/gl3/src/gl3.js
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
function gl3Attach(fig, { scene, P, W, H, file = "optimal-gl3.js", v = "1", redraw } = {}) {
  const stage = fig.querySelector(".iso-stage");
  const svg = stage && stage.querySelector("svg.iso-svg, svg");
  const host = fig.getRootNode() && fig.getRootNode().host;
  let L = null;
  // Frame pacing: while the figure animates it renders once a frame. If those frames run long for a second or so,
  // the layer steps its quality down a level (lighter occlusion, then none and a lower pixel ratio). It never steps up.
  let last = 0;
  let slow = 0;
  let run = 0;
  const pace = () => {
    const now = performance.now();
    const dt = now - last;
    last = now;
    if (dt > 120) { slow = 0; run = 0; return; } // not a running animation
    run++;
    if (dt > 30) slow++;
    if (run >= 45) {
      if (slow > 18 && L.quality() > 0) L.quality(L.quality() - 1);
      slow = 0;
      run = 0;
    }
  };
  const ctl = {
    on: false,
    figure(key, parts, materialOf) { if (L) L.figure(key, parts, materialOf); },
    move(piece, vec) { if (L) L.move(piece, vec); },
    set(name, what) { return L ? L.set(name, what) : false; },
    add(desc) { return L ? L.add(desc) : false; },
    render() { if (L) { L.render(); pace(); } },
    stats: () => (L ? L.stats() : null),
  };
  if (!stage || !svg || !scene) return ctl;
  const off = (why) => {
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
    L = api.create({ canvas, P, W, H, scene, theme, clear: null, coarse: matchMedia("(pointer: coarse)").matches, debug: new URLSearchParams(location.search).get("gl3debug") || "", onLost: () => off("lost") });
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
    if (theme !== "light") { stage.classList.add("iso", "optimal"); stage.setAttribute("data-theme", "light"); stage.dataset.gl3Theme = "1"; }
    stage.__gl3 = L; // QA reads stats and stills through this
    if (redraw) redraw(); // the figure pushes its current state and renders
    L.render();
    stage.dataset.gl3 = "on";
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
