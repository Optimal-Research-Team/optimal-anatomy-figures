// The assessor: a standing mannequin holding a tablet, drawn once at build time (Figs 5 and 6).
//
// Uses the same mannequin as the rider (shared/mannequin.mjs) and the kit's lathe.
// Returns the SVG for the figure body plus a `screen` group (data-part) placed in
// the tablet's plane, which the page fills with the live plot.
import * as k from "../.claude/skills/anatomy/kit/iso-kit.mjs";
import * as G from "../.claude/skills/anatomy/kit/lathe.mjs";
import { MANNEQUIN } from "./mannequin.mjs";

const RAD = Math.PI / 180;

function knee2(hip, ankle, B) {
  const dx = ankle[0] - hip[0];
  const dz = ankle[1] - hip[1];
  const d = Math.min(Math.hypot(dx, dz), B.thigh + B.shank - 0.05);
  const a = (B.thigh * B.thigh - B.shank * B.shank + d * d) / (2 * d);
  const h = Math.sqrt(Math.max(0, B.thigh * B.thigh - a * a));
  const ux = dx / Math.hypot(dx, dz);
  const uz = dz / Math.hypot(dx, dz);
  return [hip[0] + ux * a - uz * h, hip[1] + uz * a + ux * h];
}

/**
 * at: [x, y] floor point under the pelvis; heading: ° the assessor faces (0 = +x, toward +y positive).
 * Returns { svg, screen: { transform, w, h }, J }.
 */
export function assessorSvg(P, { at, heading, tilt = 32, part = "tablet", extraGroups = {} }) {
  const B = MANNEQUIN.BODY;
  const pelvis = 88.6;
  const legs = {};
  for (const [kk, fwd] of [["R", 1.5], ["L", -1.5]]) {
    const hip = [0, pelvis];
    const ankle = [fwd, B.ankleZ];
    legs[kk] = { hip, knee: knee2(hip, ankle, B), ankle, sole: 0, toe: 0, width: { hip: B.hipHalf, knee: 9.2, ankle: 10.5 } };
  }
  const arms = { R: { shoulder: 4, elbow: 104 }, L: { shoulder: 4, elbow: 104 } };
  const J = MANNEQUIN.skeletonOf({ base: [at[0], at[1], 0], heading, pelvis, trunk: 3, legs, arms });
  const { parts } = MANNEQUIN.partsOf(J);
  // the tablet: gripped at its side edges by both fists, tilted back toward the face
  const fist = (s) => G.lerp3(J[`wrist${s}`], J[`hand${s}`], 0.55);
  const fr = fist("R");
  const fl = fist("L");
  const across = G.unit3(G.sub3(fl, fr)); // toward the assessor's left
  const centre = G.add3(G.lerp3(fr, fl, 0.5), G.mul3(J.fwd, 1.2));
  const vdir = G.unit3(G.add3(G.mul3([0, 0, 1], Math.cos(tilt * RAD)), G.mul3(J.fwd, Math.sin(tilt * RAD)))); // up the screen
  const n = G.unit3(G.cross3(across, vdir)); // check it faces the person (against fwd)
  const normal = G.dot3(n, J.fwd) < 0 ? n : G.mul3(n, -1);
  const w = Math.max(24, G.len3(G.sub3(fl, fr)) - 3.2);
  const h = w * (215 / 281); // a 13-inch tablet's proportions
  const Ft = G.frameOf(G.add3(centre, G.mul3(normal, -0.8)), normal, across, vdir);
  parts.push({ name: "tablet", group: "tablet", kind: "prism", F: Ft, poly: [[-w / 2, -h / 2], [w / 2, -h / 2], [w / 2, h / 2], [-w / 2, h / 2]], s0: 0, s1: 0.8, centre });
  // order: the tablet (in front of the assessor, away from us), far arm, far leg, trunk, near leg, near arm
  const near = k.depthOf(J.hipL, P) >= k.depthOf(J.hipR, P) ? "L" : "R";
  const far = near === "L" ? "R" : "L";
  const facingAway = G.dot3(G.viewOf(P), J.fwd) < 0;
  const order = facingAway ? ["tablet", `arm${far}`, `leg${far}`, "trunk", `leg${near}`, `arm${near}`] : [`arm${far}`, `leg${far}`, "trunk", `leg${near}`, `arm${near}`, "tablet"];
  const rank = Object.fromEntries(order.map((g, i) => [g, i]));
  const list = parts.map((p) => ({ p, key: (rank[p.group] ?? 3) * 1e6 + k.depthOf(p.centre, P) + (p.kind === "ball" ? 3 : 0) }));
  list.sort((a, b) => a.key - b.key);
  const draw = (p) => {
    const paths = p.kind === "ball" ? G.sphereOf(p.c, p.r, P, { steps: 40 }) : p.kind === "prism" ? G.prismOf(p.F, p.poly, p.s0, p.s1, P) : G.solidOf(p.profile, p.F, P);
    const cls = p.name === "tablet" ? "as-tablet" : p.wood ? "mq-wood" : p.kind === "ball" ? "mq-joint" : "mq-part";
    return `<g class="${cls}" data-name="as.${p.name}">${k.solidSvg(paths, { tone: "mid" })}${extraGroups[p.name] ?? ""}</g>`;
  };
  // the screen: on the tablet's face toward the assessor, text reading left to right for a viewer behind them
  const face = G.add3(centre, G.mul3(normal, 0.02));
  const inset = 1.2;
  const sw = w - 2 * inset;
  const sh = h - 2 * inset;
  let ex = G.mul3(across, -1);
  const ey = G.mul3(vdir, -1);
  if (G.dot3(G.cross3(ex, ey), normal) < 0) ex = across; // non-mirrored in the kit's projection
  const corner = G.add3(G.add3(face, G.mul3(ex, -sw / 2)), G.mul3(ey, -sh / 2));
  const p0 = k.iso(corner, P);
  const px = k.iso(G.add3(corner, ex), P);
  const py = k.iso(G.add3(corner, ey), P);
  const transform = `matrix(${(px[0] - p0[0]).toFixed(4)} ${(px[1] - p0[1]).toFixed(4)} ${(py[0] - p0[0]).toFixed(4)} ${(py[1] - p0[1]).toFixed(4)} ${p0[0].toFixed(2)} ${p0[1].toFixed(2)})`;
  const screenSvg = `<g transform="${transform}"><rect class="as-screen" x="0" y="0" width="${sw.toFixed(2)}" height="${sh.toFixed(2)}" rx="0.9"/><g data-part="${part}"></g><rect class="iso-line" data-tone="mid" fill="none" x="0" y="0" width="${sw.toFixed(2)}" height="${sh.toFixed(2)}" rx="0.9"/></g>`;
  const halo = `<path class="iso-halo" d="${k.haloOf({ x: at[0] - 16, y: at[1] - 16, w: 32, d: 32, r: 16 }, 0, 0.1, P)}"/>`;
  const svg = halo + list.map(({ p }) => (p.name === "tablet" ? draw(p).replace("</g>", `${screenSvg}</g>`) : draw(p))).join("");
  return { svg, screen: { w: sw, h: sh }, J, facingAway };
}
