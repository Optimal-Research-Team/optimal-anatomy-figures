// Drawing helpers shared by the Optimal figures (first written for Fig 1).
// Every helper draws with the vendored kit AND records the true shape into the
// audit recorder, so `--audit` sees exactly what is drawn.
import * as k from "../.claude/skills/anatomy/kit/iso-kit.mjs";
import * as G from "../.claude/skills/anatomy/kit/lathe.mjs";
import * as A from "../.claude/skills/anatomy/kit/audit.mjs";
import { tubePieces, tubeSvg } from "../.claude/skills/anatomy/kit/tube.mjs";

export { k, G, A, tubePieces, tubeSvg };

export function figkit(P) {
  const R = A.recorder(P);
  const record = R.solid;
  const at = (p) => k.iso(p, P);
  const S = (paths, style) => k.solidSvg(paths, style);
  const Ln = (d, style) => k.lineSvg(d, style);
  const Dots = (points, style) => k.dotsSvg(points, style);
  const path3 = (points, closed = false) => k.pathOf(points.map(at), closed);
  const vframe = (x, y, z = 0) => G.frameOf([x, y, z], [0, 0, 1], [1, 0, 0], [0, 1, 0]);
  const xframe = (x, y, z) => G.frameOf([x, y, z], [1, 0, 0], [0, 1, 0], [0, 0, 1]);
  const yframe = (x, y, z) => G.frameOf([x, y, z], [0, 1, 0], [1, 0, 0], [0, 0, 1]);
  const roundRect = (u0, u1, v0, v1, r, steps = 4) => k.roundedPlan({ x: u0, y: v0, w: u1 - u0, d: v1 - v0, r }, steps);
  const faceY = (Y, ring) => path3(ring.map(([x, z]) => [x, Y, z]), true);
  const faceX = (X, ring) => path3(ring.map(([y, z]) => [X, y, z]), true);
  const byDepth = (points) => [...points].sort((a, b) => k.depthOf([a[0], a[1], 0], P) - k.depthOf([b[0], b[1], 0], P));
  /** SVG matrix mapping local (x, y) onto the plane through o spanned by ex, ey (world vectors per unit). */
  const planeMatrix = (o, ex, ey) => {
    const p0 = at(o);
    const px = at(G.add3(o, ex));
    const py = at(G.add3(o, ey));
    const v = (x) => x.toFixed(4);
    return `matrix(${v(px[0] - p0[0])} ${v(px[1] - p0[1])} ${v(py[0] - p0[0])} ${v(py[1] - p0[1])} ${p0[0].toFixed(2)} ${p0[1].toFixed(2)})`;
  };

  function put(name, ref, svg, shapes = [], { bias = 0, piece = "stand", move, attrs = "" } = {}) {
    return R.put({ name, at: ref, bias, svg, shapes, piece, move, attrs });
  }
  function box(name, plan, z0, h, style = {}, { steps = 3, bevel = 0, inner = "", extra = "", bias = 0, piece, move, ground = false, attrs } = {}) {
    const shape = record(A.slab(plan, z0, h, { name, ground }, steps));
    put(name, [plan.x + plan.w / 2, plan.y + plan.d / 2, z0 + h / 2], S(k.slabOf(plan, z0, h, P, steps, bevel), { tone: "mid", ...style, inner }) + extra, [shape], { bias, piece, move, attrs });
    return shape;
  }
  function cyl(name, cx, cy, r, z0, h, style = {}, { steps = 32, bevel = 0, inner = "", extra = "", bias = 0, piece, move, attrs, meta = {} } = {}) {
    const shape = record(A.cylinder(cx, cy, r, z0, h, { name, ...meta }));
    put(name, [cx, cy, z0 + h / 2], S(k.cylinder(cx, cy, r, z0, h, P, steps, bevel), { tone: "mid", ...style, inner }) + extra, [shape], { bias, piece, move, attrs });
    return shape;
  }
  function turned(name, F, profile, style = {}, { extra = "", inner = "", bias = 0, piece, move, steps, smooth, radius, attrs, before = "", meta = {} } = {}) {
    const opts = { ...(steps ? { steps } : {}), ...(smooth !== undefined ? { smooth } : {}) };
    const paths = G.solidOf(profile, F, P, opts);
    const mid = (profile[0][0] + profile[profile.length - 1][0]) / 2;
    const shape = record(A.solid(F, profile, { name, ...(radius ? { radius } : {}), ...meta }));
    put(name, G.add3(F.o, G.mul3(F.a, mid)), before + S(paths, { tone: "mid", ...style, inner }) + extra, [shape], { bias, piece, move, attrs });
    return shape;
  }
  const pin = (name, F, s0, s1, r, style = {}, opts = {}) => turned(name, F, [[s0, r], [s1, r]], style, opts);
  function prism(name, F, poly, s0, s1, style = {}, { extra = "", inner = "", bias = 0, piece, move, attrs, before = "", ref } = {}) {
    const shape = record(A.prism(F, poly, s0, s1, { name }));
    const cx = poly.reduce((a, p) => a + p[0], 0) / poly.length;
    const cy = poly.reduce((a, p) => a + p[1], 0) / poly.length;
    const centre = ref ?? G.add3(G.add3(G.add3(F.o, G.mul3(F.a, (s0 + s1) / 2)), G.mul3(F.u, cx)), G.mul3(F.v, cy));
    put(name, centre, before + S(G.prismOf(F, poly, s0, s1, P), { tone: "mid", ...style, inner }) + extra, [shape], { bias, piece, move, attrs });
    return shape;
  }
  function ball(name, c, r, style = {}, { bias = 0, extra = "", piece, move, attrs, meta = {} } = {}) {
    const shape = record(A.ball(c, r, { name, ...meta }));
    put(name, c, S(G.sphereOf(c, r, P, { steps: r > 3 ? 72 : 32 }), { tone: "mid", ...style }) + extra, [shape], { bias, piece, move, attrs });
    return shape;
  }
  /** A terminal stud on a boss, pointing along a; returns the stud tip. */
  function stud(name, o, a, { r = 1.5, boss = 2.4 } = {}) {
    const F = G.frameAlong(o, a);
    pin(`${name}.boss`, F, 0, 1.2, boss, { tone: "mid" });
    pin(name, F, 1.2, 2.6, r, { tone: "hi" });
    return G.add3(o, G.mul3(a, 2.6));
  }
  const CABLES = [];
  function cable(name, points, r = 0.9, { tone = "mid", bend = 4, maxLength = 14, bias = 0.05, rings } = {}) {
    const route = G.fillet(points, Math.max(bend, r * 2.6), 10, { P, tube: r });
    R.route(name, route, r, { limp: true, piece: "stand" });
    CABLES.push(name);
    tubePieces(route, r, P, { maxLength, spacing: Math.max(0.6, Math.min(1.6, r)), ...(rings ? { rings } : {}) }).forEach((piece, index) =>
      put(`${name}:${index}`, piece.mid, tubeSvg(piece, { tone }), [A.tube(piece.points, piece.radii)], { bias, attrs: ` data-route="${name}"` }),
    );
    return route;
  }
  /** Bench plate on feet with groove, corner screws and a label plate (drawn in `back`, recorded as ground). */
  function bench(PLATE, { plateH = 10, footH = 5, label } = {}) {
    const back = [];
    back.push(`<path class="iso-halo" d="${k.haloOf(PLATE, -plateH - footH, plateH, P)}"/>`);
    for (const [x, y] of byDepth(k.corners(PLATE, 22))) {
      back.push(S(k.cylinder(x, y, 7, -plateH - footH, 1.6, P, 28), { tone: "lo" }));
      back.push(S(k.cylinder(x, y, 5.4, -plateH - footH + 1.6, footH - 1.6, P, 28), { tone: "mid" }));
    }
    back.push(S(k.slabOf(PLATE, -plateH, plateH, P, 8, 1.6), { tone: "mid", inner: Ln(k.sideSeam(PLATE, -plateH * 0.4, P, 8), { tone: "faint" }) }));
    back.push(Ln(k.planOutline(k.insetPlan(PLATE, 5), 0, P), { tone: "lo" }));
    const screws = k.corners(PLATE, 10);
    back.push(Ln(screws.map(([x, y]) => k.ring(x, y, 2.2, 0, P, 16)).join(""), { tone: "lo" }));
    back.push(Dots(screws.map(([x, y]) => at([x, y, 0])), { size: 0.5 }));
    record(A.slab(PLATE, -plateH, plateH, { name: "stand.plate", ground: true }, 8));
    if (label) {
      back.push(S(k.slabOf(label, 0, 0.8, P, 3), { tone: "lo", crease: "none" }));
      back.push(Ln(k.planOutline(k.insetPlan(label, 1.4), 0.8, P, 3), { tone: "faint" }));
      back.push(Ln([20, 13, 16].map((w, i) => k.lineOnTop([label.x + 3.4, label.y + 3.4 + i * 3], [label.x + 3.4 + w * 0.8, label.y + 3.4 + i * 3], 0.8, P)).join(""), { tone: "lo", free: true }));
      back.push(Dots([at([label.x + label.w - 2.6, label.y + 2.4, 0.8]), at([label.x + label.w - 2.6, label.y + label.d - 2.4, 0.8])], { size: 0.45 }));
    }
    return back;
  }
  function assemble(states) {
    if (states) A.settle(R, P, { states });
    else A.settle(R, P);
    R.items.sort((a, b) => a.key - b.key);
    return R.items.map((item) => `<g class="it" data-name="${item.name}"${item.piece !== "stand" ? ` data-move="${item.piece}"` : ""}${item.attrs ?? ""}>${item.svg}</g>`);
  }

  return { R, record, at, S, Ln, Dots, path3, vframe, xframe, yframe, roundRect, faceY, faceX, byDepth, planeMatrix, put, box, cyl, turned, pin, prism, ball, stud, cable, CABLES, bench, assemble };
}
