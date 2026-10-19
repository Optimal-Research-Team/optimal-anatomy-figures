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
// Keys are framed for 9:16 (Reels: header block at the top, the object below it); a key's "w" block gives the 16:9
// framing (TV: labels at the top, caption bottom-left, close-ups weighted right). Every framing was chosen with
// motion/qa.mjs --search and the whole film is checked frame by frame with motion/qa.mjs.
const RATIO = typeof DATA !== "undefined" && DATA.ratio ? DATA.ratio : "9:16";
const RAW_KEYS = [
  // tumble in: from behind the tower, rolled, round to a three-quarter view of the deck and the screen
  { t: 0, yaw: 152, pitch: 26, roll: -24, zoom: 1.12, focus: "hero", panX: 0, panY: 30, apart: 0, corner: 1, run: 0, belt: 0, track: 0, press: 0, cam: 0, glow: [0.8, 1.06, 0.62], w: { zoom: 1.25, panY: 0 } },
  { t: 0.7, yaw: 112, pitch: 22, roll: -14, zoom: 1.2, ease: "si", w: { zoom: 1.33 } },
  { t: 1.4, yaw: -12, pitch: 12, roll: -3, zoom: 1.36, ease: "lin", panY: 30, w: { yaw: -20, zoom: 1.5, panY: 0 } },
  { t: 1.9, yaw: -40, pitch: 9, roll: 0, zoom: 1.44, ease: "so", panY: 30, glow: [0.55, 0.5, 0.62], w: { yaw: -48, zoom: 1.62, panY: 0 } },
  { t: 2.02, yaw: -42, pitch: 9, roll: 0, zoom: 1.46, focus: "hero", panX: 0, panY: 30, ease: "lin", w: { yaw: -50, zoom: 1.64, panY: 0 } },
  // labels step aside for the close-ups
  { t: 1.84, corner: 1, ease: "lin" },
  { t: 2.14, corner: 0, ease: "io" },
  // whip 1: the depth camera under the screen; its light comes on
  { t: 2.26, yaw: -11, pitch: 8, roll: 0, zoom: 7.5, focus: "camera", panX: -190, panY: -60, cam: 0, ease: "whip", glow: [0.6, 0.45, 0.6], w: { yaw: 10, pitch: 8, zoom: 9, panX: -240, panY: -30 } },
  { t: 2.6, cam: 0, ease: "lin" },
  { t: 2.95, cam: 1, ease: "io" },
  { t: 3.3, yaw: -8, pitch: 9.5, roll: 0, zoom: 7.9, focus: "camera", panX: -200, panY: -60, ease: "lin", w: { yaw: 16, pitch: 9, zoom: 9.4, panX: -240, panY: -30 } },
  // whip 2: the left console pod; the speed key goes down and back
  { t: 3.54, yaw: 60, pitch: 36, roll: -2, zoom: 12, focus: "button.L", panX: -150, panY: -60, press: 0, ease: "whip", w: { yaw: 30, pitch: 30, zoom: 11, panX: -240, panY: 0 } },
  { t: 3.8, press: 0, ease: "lin" },
  { t: 3.93, press: 1, ease: "io" },
  { t: 4.16, press: 0, ease: "io" },
  { t: 4.5, yaw: 65, pitch: 34, roll: -3, zoom: 12.5, focus: "button.L", panX: -150, panY: -60, ease: "lin", w: { yaw: 28, pitch: 29, zoom: 11.6, panX: -260, panY: 0 } },
  // whip 3: the touch console on its post
  { t: 4.74, yaw: -42, pitch: 22, roll: 2, zoom: 9, focus: "tablet", panX: -170, panY: -60, ease: "whip", w: { yaw: -55, pitch: 10, zoom: 8, panX: -300, panY: -60 } },
  { t: 5.5, yaw: -40, pitch: 20, roll: 1, zoom: 9.4, focus: "tablet", panX: -170, panY: -60, ease: "lin", w: { yaw: -57, pitch: 10, zoom: 8.4, panX: -320, panY: -60 } },
  // whip 4: the feature. the belt starts, the camera locks on joint by joint, and we push into the screen
  { t: 5.74, yaw: -44, pitch: 12, roll: 0, zoom: 1.5, focus: "hero", panX: -20, panY: 30, belt: 0, track: 0, ease: "whip", glow: [0.5, 0.5, 0.7], w: { yaw: 20, pitch: 12, zoom: 2.1, panX: -140, panY: 20 } },
  { t: 5.74, corner: 0, ease: "lin" },
  { t: 6.04, corner: 1, ease: "io" },
  { t: 6.3, belt: 320, ease: "si" },
  { t: 6.05, track: 0, ease: "lin" },
  { t: 7.0, track: 1, ease: "io" },
  { t: 6.55, yaw: -40, pitch: 12, roll: 0, zoom: 1.55, focus: "hero", panX: -20, panY: 30, ease: "lin", w: { yaw: 24, pitch: 12, zoom: 2.2, panX: -150, panY: 20 } },
  { t: 6.6, corner: 1, ease: "lin" },
  { t: 6.9, corner: 0, ease: "io" },
  { t: 7.6, yaw: 15, pitch: 6, roll: 0, zoom: 6, focus: "screenSkel", panX: -110, panY: -110, ease: "io", w: { yaw: 15, pitch: 4, zoom: 6, panX: -240, panY: -30 } },
  // pull out, come apart, drift, back together
  { t: 8.1, yaw: -44, pitch: 14, roll: 0, zoom: 1.45, focus: "hero", panX: 0, panY: 30, ease: "io", glow: [0.52, 0.5, 0.72], w: { yaw: -46, pitch: 14, zoom: 1.62, panX: 0, panY: 0 } },
  { t: 8.0, corner: 0, ease: "lin" },
  { t: 8.3, corner: 1, ease: "io" },
  { t: 8.18, apart: 0, ease: "lin" },
  { t: 8.62, yaw: -40, pitch: 22, roll: -2, zoom: 1.1, apart: 1, panX: 0, panY: 30, ease: "o", w: { yaw: -40, pitch: 20, zoom: 1.4, panX: 40, panY: -10 } },
  { t: 9.7, yaw: -54, pitch: 20, roll: -3, zoom: 1.06, apart: 1, panX: 0, panY: 30, ease: "lin", w: { yaw: -52, pitch: 20, zoom: 1.4, panX: 40, panY: -10 } },
  // hero: three-quarter from the deck, belt still running, the screen tracking
  { t: 10.45, yaw: -40, pitch: 9, roll: 0, zoom: 1.42, focus: "hero", apart: 0, panX: 0, panY: 30, ease: "io", glow: [0.52, 0.45, 0.75], w: { yaw: -46, pitch: 9, zoom: 1.62, panX: 0, panY: -10 } },
  { t: 12, yaw: -44, pitch: 8, roll: 0, zoom: 1.5, focus: "hero", panX: 0, panY: 30, ease: "o", w: { yaw: -50, pitch: 8, zoom: 1.72, panX: 0, panY: -12 } },
  { t: 12, belt: 320 + (12 - 6.3) * 2222, ease: "lin" },
];
const BASE_KEYS = RAW_KEYS.map(({ w, ...k }) => (RATIO === "16:9" && w ? { ...k, ...w } : k)).sort((a, b) => a.t - b.t);
// Captions: a Castoro title line in sentence case and one spaced-caps sub-line, device facts only.
const BASE_LABELS = [
  { t: 0, hint: "Creator 600", readout: "2564 × 1024 × 2290 mm" },
  { t: 2.14, hint: "Depth camera", readout: "under the 50″ display" },
  { t: 3.42, hint: "Handrail console", readout: "speed and incline keys" },
  { t: 4.62, hint: "13.3″ touch console", readout: "1080p touchscreen" },
  { t: 5.62, hint: "Belt running", readout: "camera tracking · 0.5–20 km/h" },
  { t: 7.1, hint: "50″ portrait display", readout: "live skeleton, joint by joint" },
  { t: 7.92, hint: "Taken apart", readout: "{parts} parts · {assemblies} assemblies" },
  { t: 10.3, hint: "Creator 600", readout: "50″ display · depth camera" },
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
export const DURATION = RETIME(BASE_DURATION);
export const KEYS = BASE_KEYS.map((k) => ({ ...k, t: RETIME(k.t) }));
export const LABELS = BASE_LABELS.map((l) => ({ ...l, t: RETIME(l.t) }));
const CHANNELS = ["yaw", "pitch", "roll", "zoom", "panX", "panY", "apart", "corner", ...Object.keys(FEATURE_DEFAULTS)];
const DEFAULTS = { yaw: 0, pitch: 0, roll: 0, zoom: 1, panX: 0, panY: 0, apart: 0, corner: 1, ...FEATURE_DEFAULTS };
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
const QUIET = (() => {
  const spans = [];
  const yawKeys = TRACKS.yaw;
  for (let i = 1; i < yawKeys.length; i++) if (yawKeys[i].ease === "whip") spans.push([yawKeys[i - 1].t, yawKeys[i].t]);
  for (const l of LABELS.slice(1)) if (!spans.some(([a, b]) => l.t >= a && l.t <= b)) spans.push([l.t - 0.12, l.t + 0.12]);
  return spans;
})();
function captionOpacity(t) {
  let d = Infinity;
  for (const [a, b] of QUIET) d = Math.min(d, t < a ? a - t : t > b ? t - b : 0);
  const x = Math.max(0, Math.min(1, d / 0.14));
  return x * x * (3 - 2 * x);
}
const FRAME = typeof DATA !== "undefined" && DATA.W ? [DATA.W, DATA.H] : [540, 960];
const WIDE_FIT = 1; // every ratio is framed explicitly (see RAW_KEYS), so no automatic fit
function fitZoom(z) {
  const x = Math.max(0, Math.min(1, (z - 2.6) / 2));
  return z * Math.pow(WIDE_FIT, 1 - x * x * (3 - 2 * x));
}
export function at(t) {
  const out = {};
  for (const c of CHANNELS) {
    const { a, b, e } = sample(TRACKS[c], t);
    out[c] = c === "zoom" ? Math.exp(mix(Math.log(a), Math.log(b), e)) : mix(a, b, e);
  }
  out.zoom = fitZoom(out.zoom);
  const f = sample(FOCUS, t);
  out.focus = { a: f.a, b: f.b, e: f.e };
  const g = sample(GLOW, t);
  out.glow = g.a.map((v, i) => mix(v, g.b[i], g.e));
  // the caption block fades out across every whip and every caption change, so a moving subject never sweeps through it
  out.cap = captionOpacity(t);
  // captions switch on whole frames, so a motion-blurred frame never mixes two captions
  const tf = Math.floor(t * 30 + 1e-6) / 30 + 1e-6;
  let label = LABELS[0];
  for (const l of LABELS) if (tf >= l.t) label = l;
  out.label = label;
  return out;
}
