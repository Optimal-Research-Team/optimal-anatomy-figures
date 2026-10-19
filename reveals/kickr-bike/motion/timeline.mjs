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
export const BASE_DURATION = 10;
// Every hold is framed by motion/frame-search.mjs so that nothing crosses the caption block (+40 px at
// 1080p) or the corner labels, and the first and last shots sit inside the hairline frame.
const BASE_KEYS = [
  { t: 0, yaw: 120, pitch: 24, roll: -26, zoom: 1.41, focus: "body", panX: 0, panY: 0, apart: 0, cadence: 180, cover: 0, saddle: 0, shift: 0, glow: [0.8, 1.0, 0.62], tall: { zoom: 1.06, panX: 0, panY: 0 } },
  { t: 0.6, yaw: 80, pitch: 20, roll: -16, zoom: 1.46, ease: "si", tall: { zoom: 0.97, panY: 10 } },
  { t: 1.2, yaw: -10, pitch: 14, roll: -5, zoom: 1.52, ease: "lin", tall: { zoom: 1.1, panY: 20 } },
  { t: 1.62, yaw: -60, pitch: 13, roll: 0, zoom: 1.58, panX: -20, panY: 0, ease: "so", tall: { zoom: 1.14, panX: 0, panY: 0 }, glow: [0.5, 0.52, 0.66] },
  { t: 1.72, yaw: -62, pitch: 13, roll: 0, zoom: 1.56, focus: "body", panX: -20, panY: 0, ease: "lin", tall: { zoom: 1.14, panX: 0, panY: 0 } },
  // the left crank's claw, sliding across to its five-bolt disc
  { t: 1.96, yaw: -70, pitch: -6, roll: 0, zoom: 5.0, focus: "claw.L", panX: 0, panY: -60, ease: "whip", tall: { panX: -80, panY: 0 }, glow: [0.6, 0.5, 0.6] },
  { t: 2.76, yaw: -90, pitch: -2, roll: -6, zoom: 5.4, focus: "disc.L", panX: 0, panY: -60, ease: "lin", tall: { yaw: -76, pitch: -5, roll: -2, zoom: 5.3, focus: "claw.L", panX: -80, panY: 0 } },
  // fit: the saddle rises on its numbered post
  { t: 3.0, yaw: -150, pitch: 12, roll: 0, zoom: 3.5, focus: "seatpost", panX: -30, panY: 0, saddle: 0, ease: "whip", tall: { yaw: -165, pitch: 14, roll: 8, zoom: 3.4, panX: -120, panY: 0 } },
  { t: 3.12, saddle: 0, ease: "lin" },
  { t: 3.82, saddle: 1, ease: "io" },
  { t: 4.0, yaw: -160, pitch: 12, roll: 0, zoom: 3.6, focus: "seatpost", panX: 0, panY: 0, saddle: 1, ease: "lin", tall: { yaw: -168, pitch: 14, roll: 8, zoom: 3.5, panX: -120, panY: 0 } },
  // virtual shifting: the right paddle clicks twice
  { t: 4.24, yaw: -210, pitch: 18, roll: 0, zoom: 5.4, focus: "paddle", panX: 90, panY: 90, shift: 0, ease: "whip", tall: { panX: 0, panY: 0 } },
  { t: 4.36, shift: 0, ease: "lin" },
  { t: 4.46, shift: 1, ease: "o" },
  { t: 4.6, shift: 0, ease: "io" },
  { t: 4.7, shift: 1, ease: "o" },
  { t: 4.84, shift: 0, ease: "io" },
  { t: 4.92, yaw: -210, pitch: 19, roll: 0, zoom: 5.6, focus: "paddle", panX: 60, panY: 100, cadence: 180, cover: 0, ease: "lin", tall: { panX: 0, panY: 0 } },
  // the feature: the cover lifts off and the cranks turn the flywheel through the belt
  { t: 5.16, yaw: -130, pitch: 14, roll: -4, zoom: 2.4, focus: "flywheel", panX: 0, panY: 0, cadence: 180, cover: 0, ease: "whip", tall: { zoom: 1.75, roll: 2, panX: 20, panY: -60 }, glow: [0.55, 0.5, 0.62] },
  { t: 5.45, cover: 1, ease: "o" },
  { t: 5.5, cadence: 180, ease: "lin" },
  { t: 6.4, yaw: -120, pitch: 14, roll: -2, zoom: 2.5, focus: "flywheel", panX: -40, panY: 20, cadence: 810, cover: 1, ease: "io", tall: { zoom: 1.8, roll: -4, panX: 20, panY: -72 } },
  { t: 6.85, yaw: -164, pitch: 24, roll: 0, zoom: 1.46, focus: "body", panX: 0, panY: 0, cover: 0, ease: "io", glow: [0.52, 0.5, 0.72] },
  { t: 6.93, apart: 0, ease: "lin" },
  { t: 7.33, yaw: -194, pitch: 26, roll: -2, zoom: 1.36, apart: 1, panY: -6, ease: "o", tall: { panY: 10 } },
  { t: 8.25, yaw: -216, pitch: 24, roll: -3, zoom: 1.32, apart: 1, panY: -6, saddle: 1, ease: "lin", tall: { panX: -10, panY: 0 } },
  { t: 8.9, yaw: -298, pitch: 11, roll: 0, zoom: 1.54, apart: 0, panX: 0, panY: 10, saddle: 0, cadence: 1080, ease: "io", tall: { zoom: 1.26, panX: 0, panY: 5 }, glow: [0.52, 0.48, 0.75] },
  { t: 10, yaw: -302, pitch: 10, roll: 0, zoom: 1.58, panX: 0, panY: 10, cadence: 1440, ease: "o", tall: { zoom: 1.3, panX: 0, panY: 10 } },
];
const BASE_LABELS = [
  { t: 0, hint: "Smart indoor bike", readout: "belt drive · electronic brake" },
  { t: 1.85, hint: "Crank length", readout: "165–175 mm · five pedal holes" },
  { t: 2.9, hint: "Five-point fit", readout: "saddle · stack · reach · setback · frame" },
  { t: 4.15, hint: "Virtual shifting", readout: "Shimano, SRAM or Campagnolo modes" },
  { t: 5.08, hint: "Belt drive · electronic brake", readout: "up to 2,200 W · ±1% power accuracy" },
  { t: 6.8, hint: "Taken apart", readout: "{parts} parts · {assemblies} assemblies" },
  { t: 8.7, hint: "KICKR BIKE SHIFT", readout: "up to 20% simulated grade" },
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
// keys may carry overrides for a portrait frame (Reels), where a macro needs a different pan
const TALL = typeof DATA !== "undefined" && DATA.H > DATA.W * 1.5;
export const DURATION = RETIME(BASE_DURATION);
export const KEYS = BASE_KEYS.map(({ tall, ...k }) => ({ ...k, ...(TALL && tall ? tall : {}), t: RETIME(k.t) }));
export const LABELS = BASE_LABELS.map((l) => ({ ...l, t: RETIME(l.t) }));
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
// the bike is wider than it is tall, so a landscape frame keeps nearly the portrait zoom
const WIDE_FIT = FRAME[0] > FRAME[1] ? 1 : Math.min(1, FRAME[0] / 540, FRAME[1] / 760);
// Reels: lift the picture into the space between the app's top bar and its caption block
const PAN_BIAS = FRAME[1] > FRAME[0] * 1.5 ? 40 : 0;
function fitZoom(z) {
  const x = Math.max(0, Math.min(1, (z - 2.6) / 2));
  return z * Math.pow(WIDE_FIT, 1 - x * x * (3 - 2 * x));
}
// the caption block is set after each cut: it fades out across every whip and every label change
// "cuts": whips, any move to a new subject (focus change) and the explode and implode themselves
const WHIPS = [];
{
  let focus = KEYS[0].focus;
  let apart = KEYS[0].apart ?? 0;
  for (let i = 1; i < KEYS.length; i++) {
    const k = KEYS[i];
    const newFocus = k.focus !== undefined && k.focus !== focus;
    const newApart = k.apart !== undefined && k.apart !== apart;
    if (k.ease === "whip" || (newFocus && k.ease !== "lin") || newApart) {
      const last = WHIPS[WHIPS.length - 1];
      if (last && KEYS[i - 1].t - last[1] < 0.35) last[1] = k.t;
      else WHIPS.push([KEYS[i - 1].t, k.t]);
    }
    if (k.focus !== undefined) focus = k.focus;
    if (k.apart !== undefined) apart = k.apart;
  }
}
// label changes that fall inside a whip are covered by the whip's fade; the others fade out over 0.6 s
const CHANGES = LABELS.slice(1).map((l) => l.t).filter((c) => !WHIPS.some(([a0, a1]) => c >= a0 && c <= a1));
function captionAlpha(t) {
  const ss = (x) => {
    x = Math.max(0, Math.min(1, x));
    return x * x * (3 - 2 * x);
  };
  let a = 1;
  for (const [a0, a1] of WHIPS) {
    if (t >= a0 - 0.08 && t <= a1 + 0.2) a = Math.min(a, ss(t < a0 ? (a0 - t) / 0.08 : t > a1 ? (t - a1) / 0.2 : 0));
  }
  for (const c of CHANGES) a = Math.min(a, ss(t < c ? (c - 0.12 - t) / 0.5 : (t - c - 0.05) / 0.25));
  return a;
}
// the corner labels show on the wide shots only (the tumble-in and the hero): they fade out over 0.3 s before
// the first close-up whip and back in once the bike is whole again, so no part ever runs under them
const CORNER_OFF = WHIPS.find((w) => KEYS.some((k) => k.t === w[1] && k.ease === "whip"))[0];
// back on as the hero settles: the key where the bike is whole again after the explode
const CORNER_ON = (() => {
  const k = KEYS.findIndex((x, i) => i > 0 && x.apart === 0 && (KEYS.slice(0, i).reverse().find((y) => y.apart !== undefined)?.apart ?? 0) === 1);
  return KEYS[k].t;
})();
function cornerAlpha(t) {
  const ss = (x) => {
    x = Math.max(0, Math.min(1, x));
    return x * x * (3 - 2 * x);
  };
  if (t <= CORNER_OFF - 0.3) return 1;
  if (t < CORNER_OFF) return ss((CORNER_OFF - t) / 0.3);
  if (t < CORNER_ON) return 0;
  return ss((t - CORNER_ON) / 0.3);
}
export function at(t) {
  const out = {};
  for (const c of CHANNELS) {
    const { a, b, e } = sample(TRACKS[c], t);
    out[c] = c === "zoom" ? Math.exp(mix(Math.log(a), Math.log(b), e)) : mix(a, b, e);
  }
  out.zoom = fitZoom(out.zoom);
  // a landscape frame is short: give the taken-apart bike more room top to bottom
  if (FRAME[0] > FRAME[1]) out.zoom *= 1 - 0.15 * out.apart;

  const f = sample(FOCUS, t);
  out.focus = { a: f.a, b: f.b, e: f.e };
  const g = sample(GLOW, t);
  out.glow = g.a.map((v, i) => mix(v, g.b[i], g.e));
  let label = LABELS[0];
  for (const l of LABELS) if (t >= l.t) label = l;
  out.label = label;
  out.cap = captionAlpha(t);
  out.corner = cornerAlpha(t);
  return out;
}
