export const FILM = {
  fig: "Optimal Health · Barrie",
  title: "Creator 600 · Running gait analysis",
  radius: 2050,
  label:
    "The Creator 600 running gait analysis treadmill, drawn as an exploded figure: it turns in, looks close at the depth camera under the 50-inch portrait display, the handrail console and the touch console, then the belt runs while the screen tracks a skeleton's joints, and the machine comes apart into its tower, display, deck, drive and handrails and goes back together.",
  bounds: [
    [-700, 1000],
    [-1600, 1620],
    [-140, 2900],
  ],
};

export const FIGURE = {
  title: "Creator 600 · anatomy",
  start: { yaw: -38, pitch: 16 },
  label:
    "The Visbody Creator 600 running gait analysis treadmill, built from {parts} solid parts: a tower holding a 50-inch portrait display with a depth camera under the screen, a compute bay and power supply in the pedestal, a 580 by 1620 millimetre running deck with belt, rollers, running board and dampers, the drive motor, flywheel, inverter and incline motor under the front cover, slanted side panels carrying the handrails, two console pods with buttons, trays and fan grilles, a curved handlebar with hand-grip electrodes, and a 13.3-inch touch console. Apart, it opens into {assemblies} assemblies.",
  keys: [
    { mark: "raised", label: "Tower: 50″ portrait display, depth camera, compute bay" },
    { mark: "lit", label: "Deck: belt, rollers, running board, drive motor" },
    { mark: "edge", label: "Handrails: side panels, console pods, handlebar, touch console" },
  ],
  caption:
    "{parts} convex parts, re-projected and re-shaded every frame. Run the belt (the button, or R) and the screen draws the skeleton the camera tracks, joint by joint. Published by Visbody: 2564 × 1024 × 2290 mm, 580 × 1620 mm running area, 0.5–20 km/h, 0–18 % incline. Internals are simplified and placed by estimate.",
};

// run: the figure page's belt switch · belt: belt travel in mm · track: the screen's skeleton lock (0…1) · press: the "+" key · cam: the camera's status light
export const FEATURE_DEFAULTS = { run: 0, belt: 0, track: 1, press: 0, cam: 1 };

export const FEATURE_KEYS = [
  { key: "r", channel: "run", name: "belt", unit: "", values: [0, 1], ease: 0.6, verb: "runs the belt", tour: [0.08, 0.38], button: "Run belt", buttonOn: "Stop belt" },
  { key: "p", channel: "press", name: "speed key", unit: "", values: [0, 1], ease: 0.08, verb: "presses the speed key", button: "Press speed key", momentary: 0.22 },
];

const clamp01 = (x) => Math.max(0, Math.min(1, x));
const BELT_SPEED = 2222; // mm/s at 8 km/h
const STRIDE = 1616; // mm of belt per stride at 165 steps/min and 8 km/h

export function featureValues(s, values) {
  return { ...values, "press.L": 2.5 * clamp01(s.press) };
}

// how far the picture moves in a frame because of the features (for motion blur); the belt texture is fine, so it counts in part
export function featureTravel(a, b) {
  return Math.max(Math.abs(b.belt - a.belt) * 1.3, Math.abs(b.press - a.press) * 2.5);
}

// figure page readout
export function featureReadout(d) {
  if (d.apart > 0.02) return null;
  return d.run > 0.05 ? `belt running · ${(8 * d.run).toFixed(1)} km/h · tracking` : "belt stopped";
}

// figure page: the belt runs while "run" is on
export function featureTick(target, drawn, dt) {
  const v = drawn.run * BELT_SPEED * dt;
  drawn.belt += v;
  target.belt = drawn.belt;
  return drawn.run > 0.002;
}

// ---------------------------------------------------------------- a runner's joints as the depth camera sees them (no figure is drawn; only joints and bones)
function gaitJoints(phase) {
  const T = Math.PI * 2;
  const bump = (p, c, w) => {
    let d = (((p - c) % 1) + 1.5) % 1 - 0.5;
    return Math.exp(-(d / w) * (d / w));
  };
  const zP = 0.95 - 0.04 * Math.cos(2 * T * (phase - 0.18));
  const sway = -0.016 * Math.cos(T * (phase - 0.18));
  const J = {};
  J.pelvis = [sway, 0, zP];
  for (const [side, off, sx] of [["R", 0, -1], ["L", 0.5, 1]]) {
    const p = (phase + off) % 1;
    const th = ((12 + 27 * Math.cos(T * (p - 0.84))) * Math.PI) / 180;
    const tk = ((16 + 24 * bump(p, 0.17, 0.11) + 88 * bump(p, 0.62, 0.16)) * Math.PI) / 180;
    const hip = [sway + sx * 0.09, 0, zP];
    const knee = [hip[0] * 0.92, hip[1] + 0.44 * Math.sin(th), hip[2] - 0.44 * Math.cos(th)];
    const ankle = [hip[0] * 0.6, knee[1] + 0.43 * Math.sin(th - tk), knee[2] - 0.43 * Math.cos(th - tk)];
    const pa = (p + 0.5) % 1; // arm swings with the opposite leg
    const al = ((32 * Math.cos(T * (pa - 0.84))) * Math.PI) / 180;
    const sh = [sway * 0.5 + sx * 0.19, 0.01, zP + 0.52];
    const el = [sx * 0.21, sh[1] + 0.3 * Math.sin(al), sh[2] - 0.3 * Math.cos(al)];
    const fa = al + (82 * Math.PI) / 180;
    const wr = [sx * 0.12, el[1] + 0.26 * Math.sin(fa), el[2] - 0.26 * Math.cos(fa)];
    Object.assign(J, { [`hip${side}`]: hip, [`knee${side}`]: knee, [`ankle${side}`]: ankle, [`sh${side}`]: sh, [`el${side}`]: el, [`wr${side}`]: wr });
  }
  J.neck = [sway * 0.4, 0.02, zP + 0.55];
  J.head = [sway * 0.3, 0.03, zP + 0.72];
  return J;
}
const JOINTS = ["head", "neck", "shL", "shR", "elL", "elR", "wrL", "wrR", "pelvis", "hipL", "hipR", "kneeL", "kneeR", "ankleL", "ankleR"];
const BONES = [["head", "neck"], ["shL", "shR"], ["shL", "elL", "wrL"], ["shR", "elR", "wrR"], ["neck", "pelvis"], ["hipL", "hipR"], ["hipL", "kneeL", "ankleL"], ["hipR", "kneeR", "ankleR"]];
// camera 2.3 m ahead of the runner at 1.06 m; the runner's left is the screen's right
const project = ([x, y, z]) => {
  const d = 2.3 / (2.3 - y);
  return [x * 168 * d, -(z - 0.92) * 168 * d];
};

export function featureDom(root, s) {
  let C = root.__c6;
  if (!C) {
    const q = (k) => [...root.querySelectorAll(`[data-c6="${k}"]`)];
    C = root.__c6 = { tex: q("tex"), seam: q("seam"), skel: q("skel"), bones: q("bones"), scan: q("scan"), timer: q("timer"), led: q("led"), camled: q("camled"), trace: q("trace"), land: q("land"), landdot: q("landdot"), m2: q("m2"), joints: JOINTS.map((_, j) => q(`j${j}`)), xyz: [0, 1, 2, 3, 4, 5].map((i) => q(`xyz${i}`)), bars: [0, 1, 2, 3].map((i) => q(`bar${i}`)), tilt: [0, 1].map((i) => q(`tilt${i}`)), knee: [0, 1].map((i) => q(`knee${i}`)), last: {} };
  }
  const set = (list, attr, value) => {
    for (const el of list) if (el.getAttribute(attr) !== value) el.setAttribute(attr, value);
  };
  const text = (list, value) => {
    for (const el of list) if (el.textContent !== value) el.textContent = value;
  };
  const belt = s.belt ?? 0;
  const track = clamp01(s.track ?? 1);
  // belt surface scrolls toward the rear (the drawing's -x)
  set(C.tex, "transform", `translate(${(-(belt % 32)).toFixed(2)} 0)`);
  // two belt seams, 1720 mm apart round the loop; each is shown only while it is on the top run
  C.seam.forEach((el, i) => {
    const x = ((((i * 1720 - belt) % 3440) + 3440) % 3440) - 1720;
    const v = Math.abs(x) < 831 ? `translate(${x.toFixed(1)} 0)` : "translate(0 0) scale(0)";
    if (el.getAttribute("transform") !== v) el.setAttribute("transform", v);
  });
  // the screen
  const phase = (((belt / STRIDE) % 1) + 1) % 1;
  const J = gaitJoints(phase);
  const P = Object.fromEntries(JOINTS.map((k) => [k, project(J[k])]));
  const ease = (x) => x * x * (3 - 2 * x);
  set(C.skel, "style", `opacity:${ease(clamp01(track * 3)).toFixed(3)}`);
  let d = "";
  const bone = ease(clamp01((track - 0.45) / 0.45));
  if (bone > 0)
    for (const chain of BONES) {
      chain.forEach((k, i) => {
        let [x, y] = P[k];
        if (i) {
          const [px, py] = P[chain[i - 1]];
          x = px + (x - px) * bone;
          y = py + (y - py) * bone;
        }
        d += `${i ? "L" : "M"}${x.toFixed(1)} ${y.toFixed(1)}`;
      });
    }
  set(C.bones, "d", d);
  JOINTS.forEach((k, j) => {
    const on = ease(clamp01(track * 2.2 - j * 0.07));
    const [x, y] = P[k];
    set(C.joints[j], "transform", `translate(${x.toFixed(1)} ${y.toFixed(1)}) scale(${(0.4 + 0.6 * on).toFixed(3)})`);
    set(C.joints[j], "opacity", on.toFixed(3));
  });
  const scanY = -120 + ((belt * 0.08 + (1 - track) * 300) % 330);
  set(C.scan, "y", scanY.toFixed(1));
  set(C.scan, "style", `fill:#a9d49c;opacity:${(0.35 * (1 - track)).toFixed(3)}`);
  const secs = Math.floor(belt / BELT_SPEED);
  text(C.timer, `00:${String(secs % 60).padStart(2, "0")}`);
  text(C.m2, (belt / 1e6).toFixed(2));
  // camera light and the LED strip under the screen come on with the tracking
  const cam = Math.max(clamp01(s.cam ?? 1), track);
  set(C.camled, "style", `fill:#a9d49c;opacity:${(0.22 + 0.78 * cam).toFixed(3)}`);
  set(C.led, "style", `stroke:#a9d49c;stroke-width:2.2;stroke-linecap:round;opacity:${(0.25 + 0.75 * track).toFixed(3)}`);
  // panels
  const mm = (v) => String(Math.round(v * 1000)).padStart(5, " ");
  ["hipL", "hipR", "kneeL", "kneeR", "ankleL", "ankleR"].forEach((k, i) => {
    const [x, y, z] = J[k];
    text(C.xyz[i], track > 0.5 ? `(${mm(x)},${mm(2.3 - y)},${mm(z)} )` : "( —, —, — )");
  });
  const loadOf = (p) => {
    const d = ((((p - 0.17) % 1) + 1.5) % 1 - 0.5) / 0.12;
    return 0.3 + 0.55 * Math.exp(-d * d);
  };
  [loadOf(phase + 0.5), loadOf(phase), loadOf(phase + 0.5) * 0.9, loadOf(phase) * 0.9].forEach((v, i) => set(C.bars[i], "width", (170 * v * track).toFixed(1)));
  const tl = 8 * Math.sin(Math.PI * 2 * (phase - 0.18)) * track;
  const tf = (5 + 2 * Math.cos(Math.PI * 4 * (phase - 0.18))) * track;
  C.tilt.forEach((list, i) => {
    for (const el of list) {
      const box = el.__home ?? (el.__home = el.getAttribute("d").match(/M([-\d.]+) ([-\d.]+)/).slice(1).map(Number));
      const v = `rotate(${(i ? tf : tl).toFixed(2)} ${box[0]} ${box[1]})`;
      if (el.getAttribute("transform") !== v) el.setAttribute("transform", v);
    }
  });
  C.knee.forEach((list, i) => {
    const j = J[i ? "kneeR" : "kneeL"];
    for (const el of list) {
      const home = el.__home ?? (el.__home = [Number(el.getAttribute("cx")), Number(el.getAttribute("cy"))]);
      const dx = Math.max(-9, Math.min(9, (j[0] - (i ? -0.083 : 0.083)) * 700));
      const dy = Math.max(-58, Math.min(58, -(j[2] - 0.6) * 260));
      el.setAttribute("cx", (home[0] + dx * track).toFixed(1));
      el.setAttribute("cy", (home[1] + dy * track).toFixed(1));
    }
  });
  // vertical motion trace: the pelvis height over the last 1.6 strides
  let tr = "";
  for (let i = 0; i <= 48; i++) {
    const p = phase - (48 - i) / 30;
    const z = 0.95 - 0.04 * Math.cos(4 * Math.PI * (p - 0.18));
    tr += `${i ? "L" : "M"}${((i / 48) * 255).toFixed(1)} ${(70 - (z - 0.95) * 1400 * track).toFixed(1)}`;
  }
  set(C.trace, "d", tr);
  const land = 0.35 + 0.08 * Math.sin(Math.PI * 2 * phase);
  for (const el of C.land) {
    const x0 = Number(el.__x0 ?? (el.__x0 = el.getAttribute("d").match(/M([-\d.]+)/)[1]));
    el.setAttribute("d", `M${x0} ${el.getAttribute("d").split(" ")[1].split("H")[0]}H${(x0 + 260 * land * track).toFixed(1)}`);
  }
  for (const el of C.landdot) {
    const x0 = Number(el.__x0 ?? (el.__x0 = Number(el.getAttribute("cx")) - 84));
    el.setAttribute("cx", (x0 + 260 * land * track).toFixed(1));
  }
}
