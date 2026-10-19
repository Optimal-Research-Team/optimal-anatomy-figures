const EASE = {
  lin: (x) => x,
  io: (x) => (x < 0.5 ? 4 * x * x * x : 1 - Math.pow(-2 * x + 2, 3) / 2),
  i: (x) => x * x * x,
  o: (x) => 1 - Math.pow(1 - x, 3),
  whip: (x) => (x < 0.5 ? 16 * Math.pow(x, 5) : 1 - Math.pow(-2 * x + 2, 5) / 2),
  so: (x) => 1 - Math.pow(1 - x, 2),
  si: (x) => x * x,
  back: (x) => 1 + 2.2 * Math.pow(x - 1, 3) + 1.2 * Math.pow(x - 1, 2),
};
export const BASE_DURATION = 12;
// keys are written for 9:16; a key may carry per-ratio overrides, e.g. "16:9": { panY: -20 }
const BASE_KEYS = [
  // tumble in: from behind and above, rolled, into a three-quarter front view (inside the hairline frame throughout)
  { t: 0, yaw: 150, pitch: 24, roll: -24, zoom: 2.02, focus: "body", panX: -62, panY: 10, apart: 0, grip: 0, screen: 0, scan: 0, glow: [0.78, 1.04, 0.62], "9:16": { zoom: 1.05, panY: 45 } },
  { t: 0.7, yaw: 112, pitch: 22, roll: -16, zoom: 2.1, panX: -44, ease: "si", "9:16": { zoom: 1.08, panY: 44 } },
  { t: 1.4, yaw: 8, pitch: 15, roll: -4, zoom: 2.24, panX: -14, ease: "lin", panY: 26, "9:16": { zoom: 1.15, panY: 40 } },
  { t: 1.95, yaw: -34, pitch: 14, roll: 0, zoom: 2.36, panX: -10, ease: "so", panY: 34, glow: [0.55, 0.5, 0.62], "9:16": { zoom: 1.22, panY: 37 } },
  { t: 2.05, yaw: -37, pitch: 15, roll: 0, zoom: 2.4, focus: "body", panX: -10, panY: 35, ease: "lin", "9:16": { zoom: 1.24, panY: 36 } },
  // whip 1: the tilted touchscreen (off), slide down to the keypad
  { t: 2.29, yaw: -16, pitch: 36, roll: -3, zoom: 5.4, focus: "screen", panX: 0, panY: -40, ease: "whip", glow: [0.5, 0.42, 0.6], "16:9": { panY: 0 } },
  { t: 3.1, yaw: -4, pitch: 32, roll: -5, zoom: 5.9, focus: "keypad", panX: 0, panY: -40, ease: "lin", "16:9": { panY: 0 } },
  // whip 2: heel and forefoot electrodes on the footplate
  { t: 3.34, yaw: -22, pitch: 44, roll: -3, zoom: 4.2, focus: "pads", panX: 0, panY: 0, ease: "whip", glow: [0.5, 0.55, 0.6], "9:16": { yaw: -6, pitch: 82, roll: -2, zoom: 2.55, focus: "plate", panY: -140 } },
  { t: 4.1, yaw: -8, pitch: 48, roll: -4, zoom: 4.6, focus: "pads", panX: 0, panY: 0, ease: "lin", "9:16": { yaw: 4, pitch: 85, roll: -3, zoom: 2.68, focus: "plate", panY: -140 } },
  // whip 3: the whole machine; the grips swing up, the screen comes on, the current path lights
  { t: 4.34, yaw: -40, pitch: 16, roll: 1, zoom: 2.3, focus: "body", panX: -12, panY: 34, grip: 0, screen: 0, ease: "whip", glow: [0.5, 0.45, 0.66], "9:16": { zoom: 1.8, panY: -34 } },
  { t: 5.0, yaw: -36, pitch: 15, roll: 1, zoom: 2.35, grip: 1, ease: "io", "9:16": { zoom: 1.82, panY: -34 } },
  { t: 5.1, screen: 0, ease: "lin" },
  { t: 5.2, scan: 0, ease: "lin" },
  { t: 5.3, screen: 1, ease: "io" },
  { t: 5.9, yaw: -32, pitch: 14, roll: 0, zoom: 2.39, focus: "body", panX: -12, panY: 36, ease: "lin", "9:16": { zoom: 1.85, panY: -32 } },
  // whip 4: the held grip, thumb and palm electrodes lit
  { t: 6.14, yaw: -62, pitch: 34, roll: -4, zoom: 6.9, focus: "thumb.L.held", panX: 0, panY: 0, ease: "whip", "16:9": { panX: 70, panY: -30 } },
  { t: 7.0, yaw: -48, pitch: 30, roll: -6, zoom: 7.4, focus: "palm.L.held", panX: 0, panY: 0, ease: "lin", "16:9": { panX: 70, panY: -30 } },
  // whip 5: the screen, stepping through the four frequencies
  { t: 7.24, yaw: -8, pitch: 34, roll: 3, zoom: 5.6, focus: "screen", panX: 0, panY: -40, ease: "whip", "16:9": { panY: 0 } },
  { t: 8.0, yaw: 2, pitch: 31, roll: 4, zoom: 6.0, focus: "screen", panX: 0, panY: -40, scan: 1, grip: 1, ease: "lin", "16:9": { panY: 0 } },
  // pull out, grips back to rest, then apart
  { t: 8.5, yaw: -48, pitch: 22, roll: 0, zoom: 2.36, focus: "body", panX: -14, panY: 30, grip: 0, ease: "io", glow: [0.52, 0.5, 0.72], "9:16": { zoom: 1.85, panY: -40 } },
  { t: 8.56, apart: 0, ease: "lin" },
  { t: 8.96, yaw: -56, pitch: 24, roll: -2, zoom: 1.94, apart: 1, panX: -24, panY: 4, ease: "o", "16:9": { panY: -26, zoom: 1.84 }, "9:16": { zoom: 1.56, panY: -75 } },
  { t: 9.9, yaw: -72, pitch: 22, roll: -3, zoom: 1.9, apart: 1, panX: -24, panY: 4, ease: "lin", "16:9": { panY: -26, zoom: 1.8 }, "9:16": { zoom: 1.53, panY: -75 } },
  { t: 10.6, yaw: -24, pitch: 10, roll: 0, zoom: 2.44, apart: 0, panX: -12, panY: 24, ease: "io", glow: [0.52, 0.45, 0.75], "16:9": { panY: -20 }, "9:16": { zoom: 1.28, panY: 35 } },
  { t: 12, yaw: -28, pitch: 8, roll: 0, zoom: 2.52, panX: -12, panY: 38, ease: "o", "16:9": { panY: 2 }, "9:16": { zoom: 1.3, panY: 37 } },
];
// captions fade in after a whip lands and are gone before the next whip starts (until)
const BASE_LABELS = [
  { t: 0, until: 2.05, hint: "InBody 580", readout: "Body composition analyser" },
  { t: 2.29, until: 3.1, hint: "10.1-inch touchscreen and keypad", readout: "1280 × 800 colour display" },
  { t: 3.34, until: 4.1, hint: "Heel and forefoot electrodes", readout: "Left and right, on the footplate" },
  { t: 4.34, until: 5.9, hint: "8-point tactile electrodes", readout: "Two for each hand, two for each foot" },
  { t: 6.14, until: 7.0, hint: "Thumb and palm electrodes", readout: "One grip for each hand" },
  { t: 7.24, until: 8.0, hint: "4 frequencies: 5, 50, 250, 500 kHz", readout: "20 impedance readings" },
  { t: 8.56, until: 9.9, hint: "Taken apart", readout: "{parts} parts · {assemblies} assemblies" },
  { t: 10.6, until: 99, hint: "InBody 580", readout: "501.9 × 892.4 × 1124.4 mm" },
];
// first and last shots (series hero rule: whole object inside the hairline frame; on 9:16 also above y = 1248)
const BASE_HERO = [
  [0, 2.05],
  [10.6, 12],
];
// shots where the whole machine must sit inside the hairline frame (the frame check reads these)
const BASE_WIDE = [
  [0, 2.05],
  [4.34, 5.9],
  [8.5, 12],
];
const REQUESTED = typeof DATA !== "undefined" && DATA.duration ? DATA.duration : BASE_DURATION;
function retimer(keys, duration) {
  const segments = [];
  let fixed = 0;
  for (let i = 1; i < keys.length; i++) {
    const whip = keys[i].ease === "whip";
    segments.push({ a: keys[i - 1].t, b: keys[i].t, whip });
    if (whip) fixed += keys[i].t - keys[i - 1].t;
  }
  const scale = Math.max(0.35, (duration - fixed) / (BASE_DURATION - fixed));
  return (t) => {
    let out = 0;
    for (const s of segments) {
      if (t <= s.a) break;
      const part = Math.min(t, s.b) - s.a;
      out += s.whip ? part : part * scale;
    }
    return out + Math.max(0, t - BASE_DURATION) * scale;
  };
}
const RETIME = retimer(BASE_KEYS, REQUESTED);
const FRAME0 = typeof DATA !== "undefined" && DATA.W ? [DATA.W, DATA.H] : [540, 960];
const RATIO = typeof DATA !== "undefined" && DATA.ratio ? DATA.ratio : "9:16";
// in wide frames the caption sits beside the object: vertical pans shrink and the object moves right of it
const PAN_FIT = FRAME0[1] >= FRAME0[0] ? 1 : 0.3;
const PAN_RIGHT = FRAME0[1] >= FRAME0[0] ? 0 : -118;
const forRatio = (k) => {
  const o = { ...k };
  for (const r of ["9:16", "16:9", "4:5", "1:1"]) delete o[r];
  if (o.panY !== undefined) o.panY *= PAN_FIT;
  return { ...o, ...(k[RATIO] ?? {}) };
};
export const DURATION = RETIME(BASE_DURATION);
export const KEYS = BASE_KEYS.map((k) => ({ ...forRatio(k), t: RETIME(k.t) }));
export const LABELS = BASE_LABELS.map((l) => ({ ...l, t: RETIME(l.t), until: RETIME(Math.min(l.until, BASE_DURATION)) + (l.until > BASE_DURATION ? 1 : 0) }));
export const WIDE = BASE_WIDE.map(([a, b]) => [RETIME(a), RETIME(b)]);
export const HERO = BASE_HERO.map(([a, b]) => [RETIME(a), RETIME(b)]);
// corner labels (top left / top right) show only in the wide shots that leave them clear: the tumble-in, the
// feature and the hero (the exploded head rises into the top-right label, so they stay off through the
// take-apart). They fade in over CORNER_FADE once a shot lands and are gone by CORNER_LEAD into the next whip.
const BASE_CORNERS = [
  [0, 2.05],
  [4.34, 5.9],
  [10.42, 12],
];
const CORNERS = BASE_CORNERS.map(([a, b]) => [RETIME(a), RETIME(b)]);
const CORNER_FADE = 0.3;
const CORNER_LEAD = 0.05;
function cornerOpacity(t) {
  const sm = (x) => { const c = Math.max(0, Math.min(1, x)); return c * c * (3 - 2 * c); };
  let o = 0;
  for (const [a, b] of CORNERS) {
    const fadeIn = a <= 1e-6 ? 1 : sm((t - a) / CORNER_FADE);
    const fadeOut = b >= DURATION - 1e-6 ? 1 : sm((b + CORNER_LEAD - t) / CORNER_FADE);
    o = Math.max(o, Math.min(fadeIn, fadeOut));
  }
  return o;
}
const CHANNELS = ["yaw", "pitch", "roll", "zoom", "panX", "panY", "apart", ...Object.keys(FEATURE_DEFAULTS)];
const DEFAULTS = { yaw: 0, pitch: 0, roll: 0, zoom: 1, panX: 0, panY: 0, apart: 0, ...FEATURE_DEFAULTS };
function track(name) {
  const list = KEYS.filter((k) => k[name] !== void 0).map((k) => ({ t: k.t, v: k[name], ease: k.ease ?? "io" }));
  if (!list.length || list[0].t > 0) list.unshift({ t: 0, v: list.length ? list[0].v : DEFAULTS[name], ease: "lin" });
  return list;
}
const TRACKS = Object.fromEntries(CHANNELS.map((c) => [c, track(c)]));
const FOCUS = KEYS.filter((k) => k.focus !== void 0).map((k) => ({ t: k.t, v: k.focus, ease: k.ease ?? "io" }));
const GLOW = KEYS.filter((k) => k.glow !== void 0).map((k) => ({ t: k.t, v: k.glow, ease: k.ease ?? "io" }));
function sample(list, t, log = false) {
  if (t <= list[0].t) return { a: list[0].v, b: list[0].v, e: 0 };
  for (let i = 1; i < list.length; i++) {
    if (t <= list[i].t) {
      const x = (t - list[i - 1].t) / (list[i].t - list[i - 1].t || 1);
      return { a: list[i - 1].v, b: list[i].v, e: EASE[list[i].ease](x), log };
    }
  }
  const last = list[list.length - 1].v;
  return { a: last, b: last, e: 0 };
}
const mix = (a, b, e) => a + (b - a) * e;
const FRAME = typeof DATA !== "undefined" && DATA.W ? [DATA.W, DATA.H] : [540, 960];
// a tall, narrow object: wide shots are written for 9:16 at ~70% of the height; shorter frames fit by height
const WIDE_FIT = Math.min(1, FRAME[0] / 540, (FRAME[1] / 960) * 1.07);

function fitZoom(z) {
  const x = Math.max(0, Math.min(1, (z - 3.7) / 1.1));
  return z * Math.pow(WIDE_FIT, 1 - x * x * (3 - 2 * x));
}
export function at(t) {
  const out = {};
  for (const c of CHANNELS) {
    const { a, b, e } = sample(TRACKS[c], t);
    out[c] = c === "zoom" ? Math.exp(mix(Math.log(a), Math.log(b), e)) : mix(a, b, e);
  }
  out.zoom = fitZoom(out.zoom);
  out.panX += PAN_RIGHT;
  const f = sample(FOCUS, t);
  out.focus = { a: f.a, b: f.b, e: f.e };
  const g = sample(GLOW, t);
  out.glow = g.a.map((v, i) => mix(v, g.b[i], g.e));
  let li = 0;
  for (let i = 0; i < LABELS.length; i++) if (t >= LABELS[i].t) li = i;
  const label = LABELS[li];
  out.label = label;
  const age = t - label.t;
  const left = label.until - t;
  const sm = (x) => { const c = Math.max(0, Math.min(1, x)); return c * c * (3 - 2 * c); };
  out.capOpacity = Math.min(sm(age / (li === 0 ? 0.4 : 0.16)), sm(left / 0.1));
  out.cornerOpacity = cornerOpacity(t);
  return out;
}
