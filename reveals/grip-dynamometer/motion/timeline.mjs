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
// Written on a 12 s base: the brief's length. `wide` overrides a key in 16:9 (the TV cut).
export const BASE_DURATION = 12;
const RATIO_NOW = typeof DATA !== "undefined" && DATA.ratio ? DATA.ratio : "9:16";
const BASE_KEYS = [
  // Framing rules (QA): no part of the object within 40 output px of any label, and the tumble and hero shots sit
  // wholly inside the hairline frame. 9:16 values are the base (labels form a header block at the top-left);
  // `wide` overrides them for 16:9 (labels in the corners, caption bottom-left, so close-ups are weighted right).
  // Tumble in from behind and above, righting into a three-quarter front view.
  { t: 0, yaw: 152, pitch: 26, roll: -28, zoom: 1.32, focus: "body", panX: 0, panY: 78, apart: 0, grip: 0, peak: 0, position: 2, glow: [0.8, 1.02, 0.62], wide: { zoom: 1.95, panX: -40, panY: -10 } },
  { t: 0.62, yaw: 110, pitch: 22, roll: -18, zoom: 1.36, panX: 0, panY: 78, ease: "si", wide: { zoom: 2.05, panX: -40, panY: -10 } },
  { t: 1.26, yaw: 2, pitch: 14, roll: -5, zoom: 1.4, panX: 0, panY: 78, ease: "lin", wide: { zoom: 2.2, panX: -40, panY: -6 } },
  { t: 1.72, yaw: -32, pitch: 13, roll: 0, zoom: 1.44, panX: 0, panY: 78, ease: "so", glow: [0.55, 0.44, 0.62], wide: { zoom: 2.3, panX: -40, panY: 0 } },
  { t: 1.82, yaw: -35, pitch: 13.5, roll: 0, zoom: 1.45, focus: "body", panX: 0, panY: 78, ease: "lin", wide: { zoom: 2.33, panX: -40, panY: 0 } },
  // Whip 1: the dual-scale dial, a slow drift across the numerals.
  { t: 2.06, yaw: -12, pitch: 5, roll: 3, zoom: 5.4, focus: "gauge", panX: 0, panY: -45, ease: "whip", glow: [0.5, 0.42, 0.6], wide: { zoom: 4.6, panX: -170, panY: -62 } },
  { t: 2.96, yaw: -24, pitch: 10, roll: 1, zoom: 5.8, focus: "gauge", panX: 0, panY: -78, ease: "lin", wide: { zoom: 4.8, panX: -150, panY: -72 } },
  // Whip 2: the notched forks under the gauge, positions 1-5.
  { t: 3.2, yaw: -25, pitch: 10, roll: -3, zoom: 4.4, focus: "forks", panX: 0, panY: -200, ease: "whip", wide: { zoom: 4.1, panX: -150, panY: -200 } },
  { t: 4.06, yaw: -17, pitch: 7, roll: -1, zoom: 4.6, focus: "forks", panX: 0, panY: -212, ease: "lin", wide: { zoom: 4.3, panX: -140, panY: -212 } },
  // Whip 3: gauge and handle together; the handle squeezes in, both needles sweep up, the grip releases.
  { t: 4.3, yaw: -22, pitch: 9, roll: 0, zoom: 3.3, focus: "squeeze", panX: 0, panY: -90, grip: 0, peak: 0, ease: "whip", wide: { zoom: 3.4, panX: -150, panY: -62 } },
  { t: 4.46, grip: 0, peak: 0, ease: "lin" },
  { t: 5.46, yaw: -19, pitch: 8, zoom: 3.55, focus: "squeeze", panX: 0, panY: -100, grip: 42, peak: 42, ease: "io", wide: { zoom: 3.65, panX: -150, panY: -66 } },
  { t: 6.16, yaw: -15, pitch: 6, zoom: 4.3, focus: "gauge", panX: 0, panY: -40, grip: 0, peak: 42, ease: "io", wide: { zoom: 4.2, panX: -170, panY: -30 } },
  // Whip 4: the reset knob on the crystal turns the peak needle back to zero.
  { t: 6.4, yaw: -38, pitch: 14, roll: -4, zoom: 6.4, focus: "knob", panX: 0, panY: -110, peak: 42, ease: "whip", wide: { zoom: 4.6, panX: -160, panY: -48 } },
  { t: 6.52, peak: 42, ease: "lin" },
  { t: 7.36, yaw: -31, pitch: 11, roll: -3, zoom: 6.8, focus: "knob", panX: 0, panY: -120, peak: 0, ease: "io", wide: { zoom: 4.9, panX: -170, panY: -62 } },
  // Pull out, explode, drift apart, implode while turning to face, hero.
  { t: 7.86, yaw: -40, pitch: 20, roll: 0, zoom: 2.1, focus: "body", panX: 0, panY: -70, ease: "io", glow: [0.52, 0.5, 0.72], wide: { zoom: 2.3, panX: -40, panY: 0 } },
  { t: 7.94, apart: 0, ease: "lin" },
  { t: 8.38, yaw: -35, pitch: 20, roll: -2, zoom: 1.75, panX: 0, panY: -80, apart: 1, ease: "o", wide: { zoom: 1.95, panX: -40, panY: -10 } },
  { t: 9.7, yaw: -48, pitch: 22, roll: -3, zoom: 1.7, panX: 0, panY: -80, apart: 1, ease: "lin", wide: { zoom: 1.88, panX: -40, panY: -10 } },
  { t: 10.42, yaw: -24, pitch: 10, roll: 0, zoom: 1.42, panX: 0, panY: 78, apart: 0, ease: "io", glow: [0.52, 0.45, 0.75], wide: { zoom: 2.2, panX: -40, panY: 2 } },
  { t: 12, yaw: -28, pitch: 8, roll: 0, zoom: 1.46, panX: 0, panY: 78, ease: "o", wide: { zoom: 2.25, panX: -40, panY: 2 } },
].map((k) => ({ ...k, ...(RATIO_NOW === "16:9" && k.wide ? k.wide : {}), wide: undefined }));
// Captions fade in after a whip lands and are gone before the next whip starts (until), as in the series spec.
const BASE_LABELS = [
  { t: 0, until: 1.78, hint: "Hand dynamometer", readout: "Grip strength · hydraulic" },
  { t: 2.06, until: 2.92, hint: "Dual scale", readout: "0–90 kg outside · 0–200 lb inside" },
  { t: 3.2, until: 4.02, hint: "Five handle positions", readout: "35 to 86 mm · ½-inch steps" },
  { t: 4.3, until: 5.42, hint: "Sealed hydraulic system", readout: "Handle squeezes in · needle sweeps up" },
  { t: 5.48, until: 6.12, hint: "Peak-hold needle", readout: "Keeps the highest reading" },
  { t: 6.4, until: 7.4, hint: "Reset knob", readout: "Turns the peak needle back to zero" },
  { t: 7.94, until: 8.9, hint: "Taken apart", readout: "{parts} parts · {assemblies} assemblies" },
  { t: 8.96, until: 9.7, hint: "Bourdon tube · two pistons", readout: "The sealed hydraulic path" },
  { t: 10.42, until: 99, hint: "Hand dynamometer", readout: "Measured in clinic · best of either hand" },
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
export const LABELS = BASE_LABELS.map((l) => ({ ...l, t: RETIME(l.t), until: l.until > BASE_DURATION ? 1e9 : RETIME(l.until) }));
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
const WIDE_FIT = Math.min(1, FRAME[0] / 540, FRAME[1] / 760);
// Reels: lift the subject into the safe band (the app's caption and buttons cover the bottom third).
const RISE = 0;
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
  out.panY += RISE;
  const f = sample(FOCUS, t);
  out.focus = { a: f.a, b: f.b, e: f.e };
  const g = sample(GLOW, t);
  out.glow = g.a.map((v, i) => mix(v, g.b[i], g.e));
  let li = 0;
  for (let i = 0; i < LABELS.length; i++) if (t >= LABELS[i].t) li = i;
  const label = LABELS[li];
  out.label = label;
  const sm = (x) => { const c = Math.max(0, Math.min(1, x)); return c * c * (3 - 2 * c); };
  out.capOpacity = Math.min(sm((t - label.t) / (li === 0 ? 0.4 : 0.16)), sm((label.until - t) / 0.1));
  // The corner labels are never crossed by the object (checked per frame), so they stay on for the whole film.
  out.cornerOpacity = 1;
  return out;
}
