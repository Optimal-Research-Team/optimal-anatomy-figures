// Hydraulic hand dynamometer (Jamar-style clinical grip meter), built part by part.
//
// Frame: x is the object's right, y its front (the dial faces +y), z up. As in the template, the code
// is written in viewer coordinates X (positive = the viewer's right when looking at the dial) and
// converted with vx(X) = -X. Units are millimetres.
//
// Layout (front view, dial facing you): the gauge sits on top; under it a C-shaped aluminium body
// (the stationary handle, holding the sealed hydraulic channel) on the left; the adjustable handle on
// the right, hung on two posts (pistons) by notched forks that pass in front of and behind the body.
// Squeezing pulls the handle toward the body: the forks push both posts into their bores, the fluid
// pressure reaches the Bourdon tube in the gauge, and the needle turns. A peak-hold needle rides on a
// pin through the crystal and keeps the highest reading until the chrome knob turns it back to zero.
import * as G from "../kit/lathe.mjs";
const TAU = Math.PI * 2;
const unit = G.unit3;
export const frame = (o, a, u) => {
  const A = unit(a);
  const U = unit(G.sub3(u, G.mul3(A, G.dot3(u, A))));
  return { o, a: A, u: U, v: G.cross3(A, U) };
};
const AX = { x: [1, 0, 0], y: [0, 1, 0], z: [0, 0, 1] };
const NX = [-1, 0, 0];
const NY = [0, -1, 0];
const NZ = [0, 0, -1];
const vx = (X) => -X;
const RIGHTWARD = NX; // +X, the viewer's right in the front view
const LEFTWARD = AX.x;

export const SANS = "'Public Sans', 'Helvetica Neue', Arial, sans-serif";
export const SERIF = "Castoro, Georgia, serif";

// Real numbers (see REPORT.md): five handle positions 1-3/8 to 3-3/8 in, in 1/2 in steps; dial 0-90 kg / 0-200 lb.
export const POSITIONS_MM = [1.375, 1.875, 2.375, 2.875, 3.375].map((inch) => +(inch * 25.4).toFixed(1));
export const STEP_MM = 12.7;
export const LB_FULL = 200;
export const KG_FULL = 90.7185; // 200 lb in kg: both scales share one linear sweep
export const SWEEP = 324; // degrees of dial from 0 to 200 lb (drawn; unverified)
export const SQUEEZE_PER_KG = 2.5 / 42; // drawn handle travel (the real instrument is near-isometric)

// Body (stationary handle) in viewer X / z, y depth.
const B = { L: -46, Li: -42, CR: -14, CRi: -18, R: 10, z0: 0, zb: 4, zf: 18, zF: 22, zH: 96, zh: 100, zt: 114, zT: 118, yR: -11, yr: -7, yw: 7, yf: 7.2, yF: 11.2 };
// Gauge.
const GA = { X: 0, z: 170, R: 50, rIn: 44.5, back: -13, front: 11 };
// Posts (pistons): axis heights, the cross pin the forks rest on.
const POST = { top: 107, bot: 11, X: 17, r: 4, pinR: 3, pinY: 11.6, rod0: -18, rod1: 13.7 };
const SLEEVE = { X0: -24, cap: -21.5, X1: 10, bore: 5, y: 6.8, h: 6.8 };
// Adjustable handle, built at position 1 (gap 34.9 mm) and slid to the others.
const HANDLE = { w: 16, d: 12, z0: 10, z1: 117, prong: 60, py: [12, 14.5], top: [110.2, 117], bot: [14.2, 21] };
const XB = B.CR + POSITIONS_MM[0];

const f2 = (n) => (Math.abs(n) < 5e-4 ? "0" : n.toFixed(3).replace(/\.?0+$/, ""));
const ring = (r, steps = 72, cx = 0, cy = 0) =>
  Array.from({ length: steps }, (_, j) => {
    const a = (TAU * j) / steps;
    return `${j ? "L" : "M"}${f2(cx + r * Math.cos(a))} ${f2(cy + r * Math.sin(a))}`;
  }).join("") + "Z";
const arcPath = (r, a0, a1, steps = 24) =>
  Array.from({ length: steps + 1 }, (_, j) => {
    const a = a0 + ((a1 - a0) * j) / steps;
    return `${j ? "L" : "M"}${f2(r * Math.sin(a))} ${f2(-r * Math.cos(a))}`;
  }).join("");
const text = (x, y, s, size, { tone = "hi", anchor = "middle", weight = 400, family = SANS, spacing = ".02em", style = "" } = {}) =>
  `<text class="iso-face-text" data-tone="${tone}" font-size="${size}" text-anchor="${anchor}"${weight !== 400 ? ` font-weight="${weight}"` : ""} style="font-family:${family.replace(/"/g, "'")};letter-spacing:${spacing};${style}" transform="translate(${f2(x)} ${f2(y)})">${s}</text>`;
const line = (d, tone = "lo") => `<path class="iso-line" data-tone="${tone}" d="${d}"/>`;
const fill = (d, tone = "hi", opacity = 1) => `<path class="iso-face-text" data-tone="${tone}" style="opacity:${opacity}" d="${d}"/>`;

// Polygons in viewer (X, z).
function roundRectXZ(X0, X1, z0, z1, { bl = 0, br = 0, tr = 0, tl = 0 } = {}, steps = 8) {
  const out = [];
  const corner = (cx, cz, r, a0) => {
    for (let j = 0; j <= steps; j++) {
      const a = a0 + (j / steps) * (Math.PI / 2);
      out.push([cx + r * Math.cos(a), cz + r * Math.sin(a)]);
    }
  };
  if (bl) corner(X0 + bl, z0 + bl, bl, Math.PI);
  else out.push([X0, z0]);
  if (br) corner(X1 - br, z0 + br, br, 1.5 * Math.PI);
  else out.push([X1, z0]);
  if (tr) corner(X1 - tr, z1 - tr, tr, 0);
  else out.push([X1, z1]);
  if (tl) corner(X0 + tl, z1 - tl, tl, 0.5 * Math.PI);
  else out.push([X0, z1]);
  return out;
}
const rectXZ = (X0, X1, z0, z1) => [[X0, z0], [X1, z0], [X1, z1], [X0, z1]];
// Keep the side a*X + b*z <= c.
function clip(poly, a, b, c) {
  const out = [];
  for (let i = 0; i < poly.length; i++) {
    const P = poly[i];
    const Q = poly[(i + 1) % poly.length];
    const fp = a * P[0] + b * P[1] - c;
    const fq = a * Q[0] + b * Q[1] - c;
    if (fp <= 1e-9) out.push(P);
    if ((fp < -1e-9 && fq > 1e-9) || (fp > 1e-9 && fq < -1e-9)) {
      const t = fp / (fp - fq);
      out.push([P[0] + (Q[0] - P[0]) * t, P[1] + (Q[1] - P[1]) * t]);
    }
  }
  return out.filter((p, i, list) => Math.hypot(p[0] - list[(i + 1) % list.length][0], p[1] - list[(i + 1) % list.length][1]) > 1e-6);
}
// A ring segment around (cX, cz): arc outside, chord inside (convex).
function ringSeg(cX, cz, rIn, rOut, a0, a1, steps = 6) {
  const out = [];
  for (let j = 0; j <= steps; j++) {
    const a = a0 + ((a1 - a0) * j) / steps;
    out.push([cX + rOut * Math.cos(a), cz + rOut * Math.sin(a)]);
  }
  out.push([cX + rIn * Math.cos(a1), cz + rIn * Math.sin(a1)]);
  out.push([cX + rIn * Math.cos(a0), cz + rIn * Math.sin(a0)]);
  return out;
}
const rad = (d) => (d * Math.PI) / 180;

export function buildObject(T, { layer }) {
  const parts = {};
  const groups = {};
  const explode = [];
  const anchors = {};
  const features = [];
  const L = layer;
  const root = T.group("root", { free: { origin: [0, 2, 100] } });
  groups.root = root;
  const assembly = (name, dir, travel, delay = 0, parent = root) => {
    const g = T.group(name, { parent, slide: { direction: unit(dir), travel } });
    groups[name] = g;
    explode.push({ name, travel, delay });
    return g;
  };
  const slide = (name, parent, dir, travel) => {
    const g = T.group(name, { parent, slide: { direction: unit(dir), travel } });
    groups[name] = g;
    return g;
  };
  const hinge = (name, parent, point, axis, range) => {
    const g = T.group(name, { parent, hinge: { point, axis, range } });
    groups[name] = g;
    return g;
  };
  const part = (p) => (parts[p.name] = p);
  // Debug only: SKIP=<regex> leaves matching parts out of the build (used to bisect paint-order cycles).
  const SKIP = typeof process !== "undefined" && process.env && process.env.SKIP ? new RegExp(process.env.SKIP) : null;
  const prismOn =
    (axis, u) =>
    (name, group, poly, s0, s1, o = {}) =>
      SKIP && SKIP.test(name) ? { name, planes: [] } : part(
        T.prism({
          name,
          group,
          layer: L,
          F: frame([0, 0, 0], axis, u),
          polygon: poly,
          s0,
          s1,
          steps: 5,
          tone: o.tone ?? "hi",
          crease: o.crease ?? "lo",
          bevel: o.bevel ?? 0,
          material: o.material,
          lit: o.lit,
          details: o.details,
        }),
      );
  const prismX = prismOn(AX.x, AX.y); // polygon [y, z], s = object x
  const prismY = prismOn(AX.y, AX.z); // polygon [z, x], s = y
  const prismZ = prismOn(AX.z, AX.x); // polygon [x, y], s = z
  const round = (name, group, F, s0, s1, r, o = {}) =>
    SKIP && SKIP.test(name) ? { name, planes: [] } : part(T.round({ name, group, layer: L, F, s0, s1, r, ends: o.ends, tone: o.tone ?? "hi", crease: o.crease ?? "lo", material: o.material, lit: o.lit, details: o.details }));
  const plane = (p, o, u, v, svg, normal, fade = [0.04, 0.3]) => (p.id === undefined ? p : T.plane({ part: p, o, u, v, svg, normal, fade }));
  // A slab in the X-z plane, extruded along y.
  const slabY = (name, group, ptsXZ, y0, y1, o) => prismY(name, group, ptsXZ.map(([X, z]) => [z, vx(X)]), y0, y1, o);
  // A box from viewer ranges.
  const boxY = (name, group, [X0, X1], [y0, y1], [z0, z1], o) => slabY(name, group, rectXZ(X0, X1, z0, z1), y0, y1, o);
  const FRONT = { u: [-1, 0, 0], v: [0, 0, -1] };
  const BACK = { u: [1, 0, 0], v: [0, 0, -1] };
  const SIDE_R = { u: [0, -1, 0], v: [0, 0, -1] }; // face normal +X (viewer right)
  const SIDE_L = { u: [0, 1, 0], v: [0, 0, -1] }; // face normal -X
  const TOPF = { u: [-1, 0, 0], v: [0, 1, 0] };
  const alongY = (X, z) => frame([vx(X), 0, z], AX.y, AX.z); // s = y
  const alongX = (y, z) => frame([0, y, z], RIGHTWARD, AX.z); // s = X
  const alongZ = (X, y) => frame([vx(X), y, 0], AX.z, AX.x); // s = z

  // ------------------------------------------------------------------ body: the stationary handle
  const core = assembly("core", AX.z, 0, 0);
  const cover = assembly("cover", AX.y, 40, 0.42);
  const HEAD = roundRectXZ(B.L, B.R, B.zH, B.zT, { tr: 4, tl: 10 });
  const COL = rectXZ(B.L, B.CR, B.zF, B.zH);
  const FOOT = roundRectXZ(B.L, B.R, B.z0, B.zF, { bl: 10, br: 4 });
  const TALL = roundRectXZ(B.L, B.R, B.z0, B.zT, { bl: 10, tl: 10 });
  const ALLOY = { material: "alloy", tone: "hi", crease: "faint", bevel: 0.6 };
  const rear = [slabY("body.rear.head", core, HEAD, B.yR, B.yr, ALLOY), slabY("body.rear.column", core, COL, B.yR, B.yr, ALLOY), slabY("body.rear.foot", core, FOOT, B.yR, B.yr, ALLOY)];
  const front = [slabY("cover.head", cover, HEAD, B.yf, B.yF, ALLOY), slabY("cover.column", cover, COL, B.yf, B.yF, ALLOY), slabY("cover.foot", cover, FOOT, B.yf, B.yF, ALLOY)];
  const WALL = { material: "alloy", tone: "hi", crease: "faint" };
  const wallLeft = slabY("body.wall.left", core, clip(TALL, 1, 0, B.Li), B.yr, B.yw, WALL);
  slabY("body.wall.top.a", core, clip(clip(clip(HEAD, -1, 0, -B.Li), 0, -1, -B.zt), 1, 0, -5), B.yr, B.yw, WALL);
  const wallTopB = slabY("body.wall.top.b", core, clip(clip(HEAD, 0, -1, -B.zt), -1, 0, -5), B.yr, B.yw, WALL);
  slabY("body.wall.bottom", core, clip(clip(FOOT, -1, 0, -B.Li), 0, 1, B.zb), B.yr, B.yw, WALL);
  const wallCol = boxY("body.wall.column", core, [B.CRi, B.CR], [B.yr, B.yw], [B.zf, B.zh], WALL);
  boxY("body.wall.under", core, [B.CR, B.R], [B.yr, B.yw], [B.zH, B.zh], WALL);
  boxY("body.wall.foot", core, [B.CR, B.R], [B.yr, B.yw], [B.zf, B.zF], WALL);
  const boss = boxY("body.port", core, [-5, 5], [B.yr, B.yw], [B.zt, B.zT], { material: "satin", tone: "hi", crease: "faint" });
  plane(boss, [0, 0, B.zT + 0.02], TOPF.u, TOPF.v, line(ring(4.2, 36), "mid"), AX.z);

  // Hammer-tone texture and screws on the casting faces (drawn, not modelled).
  const stipple = (X0, X1, z0, z1, seed, step = 3.3) => {
    let d = "";
    let s = seed;
    const rnd = () => ((s = (s * 16807) % 2147483647) / 2147483647);
    for (let z = z0 + step / 2; z < z1; z += step)
      for (let X = X0 + step / 2; X < X1; X += step) d += `M${f2(X + (rnd() - 0.5) * step * 0.8)} ${f2(-z + (rnd() - 0.5) * step * 0.8)}h.01`;
    return `<path class="iso-line" data-tone="faint" style="stroke-width:1.1px" d="${d}"/>`;
  };
  const screw = (X, z, r = 1.9) => `<circle cx="${f2(X)}" cy="${f2(-z)}" r="${r}" class="iso-face-text" data-tone="faint"/><path class="iso-line" data-tone="mid" d="${ring(r, 24, X, -z)}M${f2(X - r * 0.7)} ${f2(-z)}H${f2(X + r * 0.7)}"/>`;
  {
    const [h, c, f] = front;
    plane(h, [0, B.yF + 0.02, 0], FRONT.u, FRONT.v, stipple(B.L + 2, B.R - 2, B.zH + 2, B.zT - 2, 11) + screw(-38, 108) + screw(2, 104), AX.y);
    plane(c, [0, B.yF + 0.02, 0], FRONT.u, FRONT.v, stipple(B.L + 2, B.CR - 2, B.zF + 1, B.zH - 1, 23) + line(`M${B.L + 6} ${-B.zF - 6}V${-B.zH + 6}M${B.CR - 6} ${-B.zF - 6}V${-B.zH + 6}`, "faint"), AX.y);
    plane(f, [0, B.yF + 0.02, 0], FRONT.u, FRONT.v, stipple(B.L + 2, B.R - 2, B.z0 + 2, B.zF - 2, 37) + screw(-38, 11) + screw(2, 11), AX.y);
    const [rh, rc, rf] = rear;
    const back = `${stipple(-B.R + 2, -B.L - 2, B.zH + 2, B.zT - 2, 41)}`;
    plane(rh, [0, B.yR - 0.02, 0], BACK.u, BACK.v, back + `<path class="iso-line" data-tone="mid" d="${ring(3.2, 30, 34, -107)}M31.6 -107H36.4"/>` + screw(-2, 104) + screw(38, 108), NY);
    plane(rc, [0, B.yR - 0.02, 0], BACK.u, BACK.v, stipple(-B.CR + 2, -B.L - 2, B.zF + 1, B.zH - 1, 53) + `<path class="iso-line" data-tone="mid" d="M18 -76h20v18h-20z"/>` + line("M21 -71h14M21 -67h10M21 -63h12", "faint"), NY);
    plane(rf, [0, B.yR - 0.02, 0], BACK.u, BACK.v, stipple(-B.R + 2, -B.L - 2, B.z0 + 2, B.zF - 2, 67) + screw(-2, 11) + screw(38, 11), NY);
    plane(wallLeft, [vx(B.L) + 0.02, 0, 60], SIDE_L.u, SIDE_L.v, line("M-5 -48V44M5 -48V44", "faint"), AX.x);
    plane(wallCol, [vx(B.CR) - 0.02, 0, 60], SIDE_R.u, SIDE_R.v, line("M-5 -36V36M5 -36V36", "faint"), NX);
    plane(wallTopB, [0, 0, B.zT + 0.02], TOPF.u, TOPF.v, line("M6.5 -5.5V5.5", "faint"), AX.z);
  }

  // ------------------------------------------------------------------ hydraulics inside the body
  const SLAB = { material: "alloy", tone: "mid", crease: "faint" };
  const sleeve = (name, z0, delay) => {
    const g = assembly(name, AX.y, 26, delay);
    const { cap, X1, bore, y, h } = SLEEVE;
    boxY(`${name}.top`, g, [cap, X1], [-y, y], [z0 + bore, z0 + h], SLAB);
    boxY(`${name}.bottom`, g, [cap, X1], [-y, y], [z0 - h, z0 - bore], SLAB);
    const fr = boxY(`${name}.front`, g, [cap, X1], [bore, y], [z0 - bore, z0 + bore], SLAB);
    boxY(`${name}.back`, g, [cap, X1], [-y, -bore], [z0 - bore, z0 + bore], SLAB);
    const end = boxY(`${name}.end`, g, [SLEEVE.X0, cap], [-y, y], [z0 - h, z0 + h], SLAB);
    plane(fr, [0, y + 0.02, z0], FRONT.u, FRONT.v, line(`M${cap + 2} -1.2H${X1 - 2}M${cap + 2} 1.2H${X1 - 2}`, "faint"), AX.y);
    plane(end, [vx(cap) - 0.02, 0, z0], SIDE_R.u, SIDE_R.v, `<circle r="3.4" class="iso-face-text" data-tone="faint"/>` + line(ring(3.4, 30), "mid"), NX);
    return g;
  };
  sleeve("sleeve.top", POST.top, 0.6);
  sleeve("sleeve.bottom", POST.bot, 0.62);
  const gallery = assembly("gallery", AX.y, 14, 0.66);
  boxY("gallery.manifold.top", gallery, [-38, -24.2], [-6.8, 6], [B.zh + 0.2, B.zt - 0.2], { material: "alloy", tone: "mid", crease: "faint" });
  boxY("gallery.manifold.bottom", gallery, [-38, -24.2], [-6.8, 6], [B.zb + 0.2, B.zf - 0.2], { material: "alloy", tone: "mid", crease: "faint" });
  round("gallery.channel", gallery, alongZ(-31, -0.5), B.zf - 0.2, B.zh + 0.2, 3.5, { material: "leaf", tone: "hi", details: { seams: [30, 84] } });

  // ------------------------------------------------------------------ squeeze: posts and the handle
  const squeeze = slide("squeeze", root, LEFTWARD, 4);
  const post = (name, z0, delay) => {
    const g = assembly(name, RIGHTWARD, 46, delay, squeeze);
    round(`${name}.rod`, g, alongX(0, z0), POST.rod0, POST.rod1, POST.r, { material: "satin", tone: "hi", details: { seams: [-15, -12.5] } });
    round(`${name}.pin`, g, alongY(POST.X, z0), -POST.pinY, POST.pinY, POST.pinR, { material: "satin", tone: "hi" });
    anchors[name] = [vx(POST.X), 0, z0];
    return g;
  };
  post("post.top", POST.top, 0.1);
  const postBot = post("post.bottom", POST.bot, 0.1);
  {
    // The handle clip sits on the lower post (Lafayette manual). Its exact form is not published: drawn as a
    // spring retainer plate hooked under the lower post's pin.
    const z0 = POST.bot - POST.pinR;
    const clip = boxY("clip", postBot, [POST.X - 2.8, POST.X + 3.6], [-9, 9], [z0 - 1.6, z0 - 0.2], { material: "satin", tone: "hi", bevel: 0.2 });
    plane(clip, [0, 9.02, 0], FRONT.u, FRONT.v, line(`M${f2(POST.X - 1.6)} ${f2(-(z0 - 0.9))}H${f2(POST.X + 2.4)}`, "mid"), AX.y);
    anchors.clip = [vx(POST.X), 9, z0 - 1];
  }
  const handlePos = slide("handle.pos", squeeze, RIGHTWARD, POSITIONS_MM[4] - POSITIONS_MM[0]);
  const handleG = assembly("handle", RIGHTWARD, 80, 0, handlePos);
  {
    const { w, d, z0, z1, prong, py, top, bot } = HANDLE;
    const r = 5;
    const poly = [];
    // rounded cross-section of the grip bar (object x, y)
    for (const [cx, cy, a0] of [
      [vx(XB + w) + r, -d + r, Math.PI],
      [vx(XB) - r, -d + r, 1.5 * Math.PI],
      [vx(XB) - r, d - r, 0],
      [vx(XB + w) + r, d - r, 0.5 * Math.PI],
    ])
      for (let j = 0; j <= 6; j++) {
        const a = a0 + (j / 6) * (Math.PI / 2);
        poly.push([cx + r * Math.cos(a), cy + r * Math.sin(a)]);
      }
    const bar = prismZ("handle.bar", handleG, poly, z0, z1, { material: "satin", tone: "hi", crease: "faint" });
    let grooves = "";
    for (let z = 30; z <= 96; z += 6) grooves += `M-4 ${f2(-(z - 63))}H4`;
    plane(bar, [vx(XB + w) - 0.02, 0, 63], SIDE_R.u, SIDE_R.v, line(grooves, "faint"), NX);
    // Forks: two notched plates each at the top and the bottom, in front of and behind the body.
    const forkPlate = (name, [z0p, z1p], y0, y1, showFront) => {
      const outline = roundRectXZ(XB - prong, XB + w, z0p, z1p, { bl: 2.5, tl: 2.5 });
      const PLATE = { material: "satin", tone: "hi", crease: "faint", bevel: 0.3 };
      if (showFront) {
        const p = slabY(name, handleG, outline, y0, y1, PLATE);
        // Positions are stamped 1-5 along the fork; the notch for position i lies over the pin when set to i.
        let svg = "";
        POSITIONS_MM.forEach((gap, i) => {
          const Xn = POST.X - (gap - POSITIONS_MM[0]);
          svg += `<path class="iso-line" data-tone="hi" d="M${f2(Xn - 3.3)} ${f2(-z0p)}A3.3 3.3 0 0 1 ${f2(Xn + 3.3)} ${f2(-z0p)}"/>`;
          svg += text(Xn, -(z0p + 3.9), String(i + 1), 2.7, { tone: "mid", weight: 600 });
        });
        svg += line(`M${f2(XB - prong + 3)} ${f2(-(z0p + z1p) / 2 + 0.2)}H${f2(XB - 2)}`, "faint");
        plane(p, [0, y1 + 0.02, 0], FRONT.u, FRONT.v, svg, AX.y);
        return p;
      }
      // The back plate runs behind the body: built in two pieces so the paint order never cycles.
      const cut = XB - 24;
      const a = slabY(`${name}.a`, handleG, clip(outline, 1, 0, cut), y0, y1, PLATE);
      const b = slabY(`${name}.b`, handleG, clip(outline, -1, 0, -cut), y0, y1, PLATE);
      for (const p of [a, b]) {
        let svg = "";
        POSITIONS_MM.forEach((gap) => {
          const Xn = POST.X - (gap - POSITIONS_MM[0]);
          if ((p === a) === Xn < cut) svg += `<path class="iso-line" data-tone="mid" d="M${f2(-Xn - 3.3)} ${f2(-z0p)}A3.3 3.3 0 0 1 ${f2(-Xn + 3.3)} ${f2(-z0p)}"/>`;
        });
        if (svg) plane(p, [0, y0 - 0.02, 0], BACK.u, BACK.v, svg, NY);
      }
      return b;
    };
    forkPlate("handle.fork.top.front", top, py[0], py[1], true);
    forkPlate("handle.fork.top.back", top, -py[1], -py[0], false);
    forkPlate("handle.fork.bottom.front", bot, py[0], py[1], true);
    forkPlate("handle.fork.bottom.back", bot, -py[1], -py[0], false);
    anchors.handle = [vx(XB + w / 2 + STEP_MM), d, 64];
    anchors.forks = [vx(POST.X - STEP_MM * 1.5), py[1], (top[0] + top[1]) / 2];
    anchors.squeeze = [vx(14), 10, 132];
  }

  // ------------------------------------------------------------------ gauge
  const gaugeG = assembly("gauge", AX.z, 50, 0.04);
  const GF = () => frame([vx(GA.X), 0, GA.z], AX.y, AX.z);
  {
    // Stem and wrench hex: the gauge's threaded socket into the body's port.
    const hex = [];
    for (let j = 0; j < 6; j++) {
      const a = (j / 6) * TAU + Math.PI / 6;
      hex.push([vx(GA.X) + 6 * Math.cos(a), -6.1 + 6 * Math.sin(a)]);
    }
    prismZ("gauge.hex", gaugeG, hex, B.zT + 0.2, 124, { material: "satin", tone: "hi" });
    round("gauge.stem", gaugeG, alongZ(GA.X, -6.1), 124, 134.2, 3.8, { material: "satin", tone: "hi", details: { seams: [127, 130] } });
  }
  // Rubber cap: a shock-resistant ring around the gauge (cut out at the bottom for the stem).
  const capG = assembly("gauge.cap", NY, 30, 0.1, gaugeG);
  // Arcs drawn on a ring segment's face so the ring reads round (the segment edges stay faint).
  const ringArcs = (rIn, rOut, a0, a1, tone = "hi", back = false) => {
    const arc = (r) =>
      Array.from({ length: 13 }, (_, j) => {
        const a = a0 + ((a1 - a0) * j) / 12;
        const X = r * Math.cos(a);
        return `${j ? "L" : "M"}${f2(back ? -X : X)} ${f2(-r * Math.sin(a))}`;
      }).join("");
    return line(arc(rIn) + arc(rOut), tone);
  };
  for (let k = 0; k < 13; k++) {
    // k = 0 and 12 are the two halves of the bottom segment, either side of a slot for the stem.
    const c = -90 + 30 * (k % 12);
    const a0 = rad(c - 15);
    const a1 = rad(c + 15);
    let poly = ringSeg(GA.X, GA.z, GA.rIn, GA.R, a0, a1, 6);
    if (k === 0) poly = clip(poly, 1, 0, GA.X - 6);
    if (k === 12) poly = clip(poly, -1, 0, -(GA.X + 6));
    const p = slabY(`gauge.cap.${k}`, capG, poly, GA.back, GA.front, { material: "forest", tone: "faint", crease: "faint" });
    plane(p, [vx(GA.X), GA.front + 0.02, GA.z], FRONT.u, FRONT.v, ringArcs(GA.rIn + 0.2, GA.R - 0.25, a0, a1, "hi"), AX.y, [0.02, 0.2]);
    plane(p, [vx(GA.X), GA.back - 0.02, GA.z], BACK.u, BACK.v, ringArcs(GA.rIn + 0.2, GA.R - 0.25, a0, a1, "hi", true), NY, [0.02, 0.2]);
  }
  const caseG = assembly("gauge.case", NY, 56, 0.06, gaugeG);
  const caseBack = round("gauge.case", caseG, GF(), GA.back - 1.6, GA.back - 0.2, 46, { material: "satin", tone: "hi", details: { seams: [GA.back - 1.0] } });
  plane(caseBack, [vx(GA.X), GA.back - 1.62, GA.z], BACK.u, BACK.v, line(ring(36, 72) + ring(30, 72), "faint") + [0, 1, 2, 3].map((i) => screw(-27 * Math.cos(rad(45 + 90 * i)), -27 * Math.sin(rad(45 + 90 * i)), 1.6)).join(""), NY);
  const mplate = round("gauge.movement.plate", gaugeG, GF(), -10, -9, 27, { material: "alloy", tone: "mid" });
  {
    // Hairspring and pillar screws, drawn on the movement plate.
    let d = "";
    for (let j = 0; j <= 180; j++) {
      const a = (j / 180) * TAU * 4.5;
      const r = 1.6 + (j / 180) * 5.4;
      d += `${j ? "L" : "M"}${f2(r * Math.cos(a))} ${f2(r * Math.sin(a))}`;
    }
    plane(mplate, [vx(GA.X), -8.98, GA.z], FRONT.u, FRONT.v, line(d, "mid") + [0, 1, 2].map((i) => screw(20 * Math.cos(rad(90 + 120 * i)), 20 * Math.sin(rad(90 + 120 * i)), 1.4)).join(""), AX.y);
  }
  // Bourdon tube: a C-shaped tube, sealed at its tip, fed from the stem at the bottom.
  const tubeG = assembly("gauge.tube", AX.y, 22, 0.14, gaugeG);
  {
    const yt = [-5.6, 3.6];
    const TUBE = { rIn: 29.5, rOut: 34, a0: -100, span: 270, n: 9 };
    slabY("gauge.tube.socket", tubeG, ringSeg(GA.X, GA.z, 28, 35.5, rad(-100), rad(-80), 2), -9.5, 4.0, { material: "satin", tone: "hi" });
    for (let i = 0; i < TUBE.n; i++) {
      const a0 = TUBE.a0 - (TUBE.span * i) / TUBE.n;
      const a1 = TUBE.a0 - (TUBE.span * (i + 1)) / TUBE.n;
      slabY(`gauge.tube.${i}`, tubeG, ringSeg(GA.X, GA.z, TUBE.rIn, TUBE.rOut, rad(a1), rad(a0), 5), yt[0], yt[1], { material: "leaf", tone: "hi", crease: "faint" });
    }
    const aEnd = TUBE.a0 - TUBE.span;
    slabY("gauge.tube.tip", tubeG, ringSeg(GA.X, GA.z, 29, 34.5, rad(aEnd - 7), rad(aEnd), 2), -6.0, 3.8, { material: "satin", tone: "hi" });
    anchors.tube = [vx(GA.X - 31), 3.6, GA.z];
  }
  // Movement: link, toothed sector and pinion turn the tube's small motion into needle rotation.
  const movementG = assembly("gauge.movement", AX.y, 38, 0.12, gaugeG);
  {
    const P = [10, GA.z - 20];
    const toPin = [GA.X - P[0], GA.z - P[1]];
    const dist = Math.hypot(...toPin);
    const dir = Math.atan2(toPin[1], toPin[0]);
    const rT = dist - 2.6 - 0.3;
    const fan = [];
    for (let j = 0; j <= 6; j++) {
      const a = dir - rad(14) + (j / 6) * rad(28);
      fan.push([P[0] + rT * Math.cos(a), P[1] + rT * Math.sin(a)]);
    }
    const tail = [P[0] - 9 * Math.cos(dir), P[1] - 9 * Math.sin(dir)];
    const perp = [-Math.sin(dir), Math.cos(dir)];
    const sectorPoly = [...fan, [P[0] + 3.2 * perp[0], P[1] + 3.2 * perp[1]], [tail[0] + 2.2 * perp[0], tail[1] + 2.2 * perp[1]], [tail[0] - 2.2 * perp[0], tail[1] - 2.2 * perp[1]], [P[0] - 3.2 * perp[0], P[1] - 3.2 * perp[1]]];
    const sector = slabY("gauge.sector", movementG, sectorPoly, 6.4, 7.2, { material: "satin", tone: "hi" });
    let teeth = "";
    for (let j = 0; j <= 24; j++) {
      const a = dir - rad(13) + (j / 24) * rad(26);
      teeth += `M${f2(P[0] + (rT - 1.4) * Math.cos(a))} ${f2(-(P[1] + (rT - 1.4) * Math.sin(a)))}L${f2(P[0] + rT * Math.cos(a))} ${f2(-(P[1] + rT * Math.sin(a)))}`;
    }
    plane(sector, [0, 7.22, 0], FRONT.u, FRONT.v, line(teeth, "mid") + line(ring(1.6, 20, P[0], -P[1]), "hi") + line(ring(1, 16, tail[0], -tail[1]), "mid"), AX.y);
    const tip = [GA.X + 31.75 * Math.cos(rad(-366.5)), GA.z + 31.75 * Math.sin(rad(-366.5))];
    const dx = tail[0] - tip[0];
    const dz = tail[1] - tip[1];
    const len = Math.hypot(dx, dz);
    const n = [(-dz / len) * 1.2, (dx / len) * 1.2];
    slabY("gauge.link", movementG, [[tip[0] + n[0], tip[1] + n[1]], [tail[0] + n[0], tail[1] + n[1]], [tail[0] - n[0], tail[1] - n[1]], [tip[0] - n[0], tip[1] - n[1]]], 5.4, 6.2, { material: "satin", tone: "hi" });
    round("gauge.pinion", movementG, GF(), 6.4, 9.0, 2.6, { material: "satin", tone: "hi", details: { ribs: { s0: 6.5, s1: 8.9, count: 12, tone: "lo" } } });
    anchors.movement = [vx(P[0]), 7.2, P[1]];
  }
  // Dial: dual scale, kilograms outside (0-90, 2 kg ticks), pounds inside (0-200, 5 lb ticks).
  const dialG = assembly("gauge.dial", AX.y, 54, 0.1, gaugeG);
  {
    const dial = round("gauge.dial", dialG, GF(), 9.2, 10.2, 42.4, { material: "dial", tone: "hi" });
    const pt = (a, r) => [r * Math.sin(a), -r * Math.cos(a)];
    const seg = (a, r0, r1) => {
      const [x0, y0] = pt(a, r0);
      const [x1, y1] = pt(a, r1);
      return `M${f2(x0)} ${f2(y0)}L${f2(x1)} ${f2(y1)}`;
    };
    let kgMinor = "";
    let kgMajor = "";
    let nums = "";
    for (let kg = 0; kg <= 90; kg += 2) {
      const a = rad((kg / KG_FULL) * SWEEP);
      if (kg % 10 === 0) {
        kgMajor += seg(a, 34.6, 39.4);
        const [tx, ty] = pt(a, 30.4);
        nums += text(tx, ty + 1.65, String(kg), 4.6, { tone: "hi", weight: 600, spacing: "0" });
      } else kgMinor += seg(a, 37.0, 39.4);
    }
    let lbMinor = "";
    let lbMajor = "";
    for (let lb = 0; lb <= 200; lb += 5) {
      const a = rad((lb / LB_FULL) * SWEEP);
      if (lb % 20 === 0) {
        lbMajor += seg(a, 23.2, 26.6);
        if (lb) {
          const [tx, ty] = pt(a, 19.6);
          nums += text(tx, ty + 1.1, String(lb), 2.9, { tone: "mid", weight: 500, spacing: "0" });
        }
      } else lbMinor += seg(a, 24.8, 26.6);
    }
    const gapA = rad(SWEEP + (360 - SWEEP) / 2);
    const [kx, ky] = pt(gapA, 33.6);
    const [lx, ly] = pt(gapA, 22.6);
    const svg =
      line(ring(39.4, 96) + ring(26.6, 96), "lo") +
      `<path class="iso-line" data-tone="mid" style="stroke-width:.5px" d="${kgMinor}"/>` +
      `<path class="iso-line" data-tone="hi" style="stroke-width:.9px" d="${kgMajor}"/>` +
      `<path class="iso-line" data-tone="lo" style="stroke-width:.45px" d="${lbMinor}"/>` +
      `<path class="iso-line" data-tone="mid" style="stroke-width:.7px" d="${lbMajor}"/>` +
      nums +
      text(kx, ky + 1.3, "kg", 3.6, { tone: "hi", weight: 600, spacing: ".04em" }) +
      text(lx, ly + 1, "lb", 2.8, { tone: "mid", weight: 500, spacing: ".04em" }) +
      text(0, 12.6, "PEAK HOLD", 2.1, { tone: "mid", weight: 600, spacing: ".22em" }) +
      `<circle r="3.6" class="iso-face-text" data-tone="faint"/>`;
    plane(dial, [vx(GA.X), 10.22, GA.z], FRONT.u, FRONT.v, svg, AX.y, [0.02, 0.2]);
    anchors.dial = [vx(GA.X - 16), 10.2, GA.z + 18];
    anchors.dialLow = [vx(GA.X + 18), 10.2, GA.z - 14];
  }
  // Main needle (forest), on the pinion's shaft through the dial.
  const needleLift = assembly("gauge.needle", AX.y, 70, 0.08, gaugeG);
  const needle = hinge("needle", needleLift, [vx(GA.X), 0, GA.z], NY, [-5, 340]);
  {
    const pts = [
      [-8, -1.9],
      [-8, 1.9],
      [37.5, 0.32],
      [37.5, -0.32],
    ].map(([along, side]) => [GA.z + along, vx(GA.X + side)]);
    round("gauge.needle.hub", needle, GF(), 10.3, 10.8, 3.4, { material: "ink", tone: "hi" });
    prismY("gauge.needle", needle, pts, 10.8, 11.25, { material: "ink", tone: "hi" });
  }
  // Bezel: the stainless screw ring that holds the crystal.
  const bezelG = assembly("gauge.bezel", AX.y, 86, 0.04, gaugeG);
  for (let k = 0; k < 12; k++) {
    const c = -90 + 30 * k;
    const a0 = rad(c - 15);
    const a1 = rad(c + 15);
    const p = slabY(`gauge.bezel.${k}`, bezelG, ringSeg(GA.X, GA.z, 42.6, 46.6, a0, a1, 5), GA.front + 0.2, GA.front + 2.4, { material: "satin", tone: "faint", crease: "faint", bevel: 0.2 });
    plane(p, [vx(GA.X), GA.front + 2.42, GA.z], FRONT.u, FRONT.v, ringArcs(42.75, 46.4, a0, a1, "hi") + ringArcs(44.6, 44.6, a0, a1, "faint"), AX.y, [0.02, 0.2]);
  }
  // Crystal, peak-hold needle on its pin, and the chrome reset knob outside the crystal.
  const peakLift = assembly("gauge.peak", AX.y, 104, 0.02, gaugeG);
  const crystal = round("gauge.crystal", peakLift, GF(), 11.95, 13.8, 40.6, { material: "pane", tone: "mid", crease: "faint" });
  {
    let glare = `<path d="${arcPath(34, rad(-62), rad(-28), 16)}" style="fill:none;stroke:#ffffff;stroke-width:1.6;stroke-linecap:round;opacity:.75"/>`;
    glare += `<path d="${arcPath(30.5, rad(-56), rad(-44), 8)}" style="fill:none;stroke:#ffffff;stroke-width:.8;stroke-linecap:round;opacity:.6"/>`;
    // A small counter-clockwise arrow around the knob: the reset direction.
    const a0 = rad(150);
    const a1 = rad(250);
    const r = 10.2;
    const [ex, ey] = [r * Math.sin(a0), -r * Math.cos(a0)];
    const head = `M${f2(ex)} ${f2(ey)}l1.5 -1.5M${f2(ex)} ${f2(ey)}l-2 -.4`;
    plane(crystal, [vx(GA.X), 13.82, GA.z], FRONT.u, FRONT.v, glare + line(arcPath(r, a1, a0, 18) + head, "mid"), AX.y, [0.02, 0.2]);
  }
  const peak = hinge("peak.hold", peakLift, [vx(GA.X), 0, GA.z], NY, [-5, 340]);
  {
    const pts = [
      [-6.5, -1.3],
      [-6.5, 1.3],
      [35.5, 0.38],
      [35.5, -0.38],
    ].map(([along, side]) => [GA.z + along, vx(GA.X + side)]);
    prismY("gauge.peak.needle", peak, pts, 11.35, 11.8, { material: "leaf", tone: "hi" });
    round("gauge.peak.pin", peak, GF(), 11.8, 11.9, 1.1, { material: "satin", tone: "mid" });
    const knob = round("gauge.knob", peak, GF(), 13.9, 19.6, 6.4, {
      material: "satin",
      tone: "hi",
      details: { ribs: { s0: 14.5, s1: 19.1, count: 40, fade: [0.08, 0.55], seams: true, tone: "lo" } },
    });
    plane(knob, [vx(GA.X), 19.62, GA.z], FRONT.u, FRONT.v, line(ring(4.4, 40), "mid") + `<path class="iso-line" data-tone="hi" style="stroke-width:1.2px" d="M0 -1.4V-5.4"/>`, AX.y);
    anchors.knob = [vx(GA.X), 19.6, GA.z];
  }
  anchors.gauge = [vx(GA.X), 14, GA.z];

  // ------------------------------------------------------------------ wrist strap
  const strapG = assembly("strap", NZ, 44, 0.05);
  {
    // A flat webbing loop through an eyelet under the foot (drawn shorter than a real wrist loop).
    const SX = [-36, -22];
    const anchor = boxY("strap.eyelet", strapG, SX, [-6, 6], [-3, -0.2], { material: "satin", tone: "hi" });
    plane(anchor, [0, 6.02, 0], FRONT.u, FRONT.v, `<path class="iso-line" data-tone="mid" d="M-33 1.6H-25"/>`, AX.y);
    const C = { X: -29, z: -27.4, aX: 10, az: 23.2 };
    const n = 12;
    const d0 = rad(90 + 17);
    const d1 = rad(90 + 343);
    const at = (a, off) => {
      const nX = Math.cos(a) / C.aX;
      const nz = Math.sin(a) / C.az;
      const l = Math.hypot(nX, nz);
      return [C.X + C.aX * Math.cos(a) + (off * nX) / l, C.z + C.az * Math.sin(a) + (off * nz) / l];
    };
    for (let i = 0; i < n; i++) {
      const a0 = d0 + ((d1 - d0) * i) / n;
      const a1 = d0 + ((d1 - d0) * (i + 1)) / n;
      const p = slabY(`strap.${i}`, strapG, [at(a0, 0.85), at(a1, 0.85), at(a1, -0.85), at(a0, -0.85)], -5, 5, { material: "strap", tone: "hi", crease: "faint" });
      // Stitching on the outer face of the webbing.
      const P0 = at(a0, 0.85);
      const P1 = at(a1, 0.85);
      const dX = P1[0] - P0[0];
      const dz = P1[1] - P0[1];
      const len = Math.hypot(dX, dz);
      const mid = [(P0[0] + P1[0]) / 2, (P0[1] + P1[1]) / 2];
      const out = [dz / len, -dX / len];
      const sgn = (mid[0] - C.X) * out[0] + (mid[1] - C.z) * out[1] > 0 ? 1 : -1;
      plane(
        p,
        [vx(mid[0]), 0, mid[1]],
        [vx(dX / len), 0, dz / len],
        [0, -1, 0],
        `<path class="iso-line" data-tone="lo" style="stroke-dasharray:1.1 .9" d="M${f2(-len / 2)} 3.4H${f2(len / 2)}M${f2(-len / 2)} -3.4H${f2(len / 2)}"/>`,
        [vx(out[0] * sgn), 0, out[1] * sgn],
      );
    }
    anchors.strap = [vx(C.X), 0, -28];
  }

  anchors.body = [0, 0, 110];
  anchors.hydraulics = [vx(-24), 7, 60];
  anchors.posts = [vx(10), 0, 60];
  // Feature states the build proves the paint order in.
  for (let i = 0; i <= 6; i++) features.push({ needle: i * 50, "peak.hold": i * 50, squeeze: (i / 6) * 4 });
  for (let i = 0; i <= 4; i++) features.push({ "handle.pos": i * STEP_MM, squeeze: 2.5 });
  return { parts, groups, explode, root, anchors, features, counts: { positions: 5 } };
}
export function explodeValues(explode, apart, { stretch = 0.55 } = {}) {
  const out = {};
  for (const { name, travel, delay } of explode) {
    const t = Math.max(0, Math.min(1, (apart - delay * stretch) / (1 - stretch)));
    out[name] = travel * t * t * (3 - 2 * t);
  }
  return out;
}
