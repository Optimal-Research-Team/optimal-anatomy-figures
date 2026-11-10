// The take-apart pages (reveals/<slug>), rendered by the shared 3-D layer (shared/gl3).
//
// The kit's turn runtime already holds every part as true geometry (prisms, turned bodies, tubes along routes,
// balls) in its group's own coordinates, and hands out each group's pose (world = R·p + t) every frame. This turns
// that into a scene for the layer and keeps the two in step: the layer renders the bodies, and the runtime's SVG
// stays on top as the ink pass (decals, slots, labels), exactly as on the other figures. Inlined by each
// reveals/<slug>/object/build.mjs; the same file for all four.
//
//   const gl = gl3Turn(stage, DATA.turn, { materials: { ink: "moss", frame: "sage" }, rules: [[/^crank\./, "alu"]] });
//   …every paint, after ctl.set(...) and the viewBox: gl.sync(ctl, viewBox)
function gl3TurnScene(T, { materials = {}, rules = [], look = {}, reach = 1 } = {}) {
  const parts = [];
  const matOf = (q) => {
    for (const [re, m] of rules) if (re.test(q.name)) return m;
    return materials[q.mat] || materials.default || "shell";
  };
  let far = 0;
  const seen = (F, r) => {
    const o = F.o || F;
    far = Math.max(far, Math.hypot(o[0], o[1], o[2]) + r);
  };
  for (const q of T.parts) {
    const s = q.spec;
    const base = { n: q.name, m: matOf(q), p: `g${q.group}` };
    if (q.kind === "prism") {
      const poly = [];
      for (let i = 0; i < s.ring.length; i += 2) poly.push([s.ring[i], s.ring[i + 1]]);
      parts.push({ ...base, k: "p", F: s.F, poly, s0: s.s0, s1: s.s1, bevel: s.bevel > 0 ? s.bevel : 1.4 });
      seen(s.F, Math.max(...poly.map((v) => Math.hypot(v[0], v[1]))) + Math.abs(s.s1));
    } else if (q.kind === "round") {
      const prof = [[s.s0, s.r0], [s.s1, s.r1]];
      const dome = (at, r, dir) => {
        const pts = [];
        for (let i = 1; i <= 6; i++) {
          const a = (i / 6) * (Math.PI / 2);
          pts.push([at + dir * Math.sin(a) * r * 0.55, Math.cos(a) * r, 1]);
        }
        return pts;
      };
      if (s.ends && s.ends[1] === "dome") prof.push(...dome(s.s1, s.r1, 1));
      if (s.ends && s.ends[0] === "dome") prof.unshift(...dome(s.s0, s.r0, -1).reverse());
      parts.push({ ...base, k: "l", F: s.F, prof, bevel: 1.4 });
      seen(s.F, Math.max(s.r0, s.r1) + Math.abs(s.s1));
    } else if (q.kind === "tube") {
      const route = T.routes[s.route];
      const n = route.points.length / 3;
      const i0 = Math.max(0, Math.min(n - 1, Math.round(s.from / route.spacing)));
      const i1 = Math.max(0, Math.min(n - 1, Math.round(s.to / route.spacing)));
      const step = Math.max(1, Math.floor((i1 - i0) / 22));
      const pts = [];
      for (let i = i0; i <= i1; i += step) pts.push([route.points[i * 3], route.points[i * 3 + 1], route.points[i * 3 + 2]]);
      const last = [route.points[i1 * 3], route.points[i1 * 3 + 1], route.points[i1 * 3 + 2]];
      if (pts.length && Math.hypot(pts[pts.length - 1][0] - last[0], pts[pts.length - 1][1] - last[1], pts[pts.length - 1][2] - last[2]) > 1e-3) pts.push(last);
      if (pts.length >= 2) parts.push({ ...base, k: "t", pts, r: route.r });
      for (const v of pts) seen(v, route.r);
    } else if (q.kind === "ball") {
      parts.push({ ...base, k: "b", c: s.c, r: s.r });
      seen(s.c, s.r);
    }
    // "fixed" parts are drawn art (a screen's picture): the SVG keeps them
  }
  // the object turns about its root and its groups travel when it comes apart: light a ball that holds all of it
  const o = T.groups[0].origin;
  const R = far * reach;
  return {
    parts,
    bounds: [[o[0] - R, o[1] - R, o[2] - R], [o[0] + R, o[1] + R, o[2] + R]],
    // built in millimetres; an object in space has no floor (the page keeps its soft drawn shadow)
    look: { unit: 10, cast: 0, contact: 0, ...look },
  };
}
// One colourway for the series (the brand's, not any maker's): each page's material names → the layer's presets,
// then rules by part name (first match wins). `keep`: materials whose faces carry a drawn picture (a screen, a dial);
// they render paper-white and the SVG keeps its own fill and artwork there.
const GL3_TURN_LOOKS = {
  "kickr-bike": {
    materials: { ink: "moss", frame: "sage", tape: "rubber", leaf: "leaf" },
    rules: [
      [/^(arm\.|claw\.|disc\.|pulley\.|flywheel\.hub|saddle\.rail|seatpost|steer\.tube|bar\.(centre|taper|top|clamp))/, "alu"],
      [/^(belt\.|saddle\.(tail|waist|nose)|hood\.|foot\..*\.pad|leg\..*\.cap|bar\.plug|knob\.)/, "rubber"],
      [/^(lever\.[RL]|paddle\.|cage\.|.*\.qr$|foot\..*\.stem|saddle\.(clamp|cradle)|brake\.stator)/, "steel"],
      [/^flywheel$/, "alu"],
    ],
  },
  "inbody-580": {
    materials: { ink: "moss", polish: "steel", alu: "alu", electrode: "steel", shell: "shell", pcb: "green", screen: "paper" },
    keep: ["screen"],
  },
  "creator-600": {
    materials: { mist: "satin", graphite: "graphite", sage: "sage", iron: "slate", pcb: "green", alloy: "alu", screen: "paper", ivory: "bone", leaf: "leaf" },
    keep: ["screen"],
  },
  "grip-dynamometer": {
    materials: { alloy: "alu", satin: "satin", leaf: "leaf", forest: "forest", dial: "paper", ink: "graphite", pane: "glass", strap: "rubber" },
    keep: ["dial"],
  },
};
function gl3Turn(stage, T, { slug, materials, rules, keep, look, reach, file, v, redraw } = {}) {
  const preset = GL3_TURN_LOOKS[slug] || {};
  materials = materials || preset.materials;
  rules = rules || preset.rules;
  keep = keep || preset.keep || [];
  look = look || preset.look;
  for (const mat of keep) for (const node of stage.querySelectorAll(`.iso-solid[data-mat="${mat}"]`)) node.setAttribute("data-gl3-keep", "");
  const fig = stage.parentElement;
  const first = stage.querySelector("svg");
  const vb = first.getAttribute("viewBox").split(" ").map(Number);
  const gl = gl3Attach(fig, { scene: gl3TurnScene(T, { materials, rules, look, reach }), P: T.P, W: vb[2], H: vb[3], file, v, redraw });
  const count = T.groups.length;
  return {
    gl,
    /** After the runtime has posed the object (ctl.set) and the page has set the viewBox [x, y, w, h]. */
    sync(ctl, view) {
      if (!gl.on) return;
      const cams = ctl.cams();
      if (!cams) return;
      for (let i = 0; i < count; i++) gl.pose(`g${i}`, cams[i].R, cams[i].t);
      if (view) gl.view(view[0], view[1], view[2], view[3]);
      gl.render();
    },
  };
}
