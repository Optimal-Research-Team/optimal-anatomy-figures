// Fig 1 model: the thermoneutral zone and one hot flash.
//
// Pure functions, no DOM. The build imports it for geometry, and the page inlines
// the same source (exports stripped) for every motion and readout, so nothing on
// screen is tuned by eye. Citation keys refer to reference/truth-pack.md §1.
//
// Temperatures are changes from the woman's own resting core temperature, not
// absolute °C: published thresholds differ by protocol and measuring site
// (≈37.2 °C in [Freedman 1999], ≈38.0 °C in [Freedman & Blacker 2002]), so the
// figure only shows what is comparable: the zone's width and the size of the rise.
//
// e is the estrogen state the knob sets: 1 = pre-menopause (zone like that of
// women without hot flashes), 0 = post-menopause in a woman who has hot flashes.

export const TRUTH = {
  zonePre: 0.4, //            °C  interthreshold zone, women without hot flashes [Freedman 1999]
  zonePost: 0.0, //           °C  measured in women with hot flashes, "virtually nonexistent" [Freedman 1999]
  zoneFloor: 0.04, //         °C  drawn gap at the post end so the finger fits; shown as 0.0 (one decimal, the precision measured)
  sweatShare: 0.3 / 0.4, //       share of the narrowing from the sweating threshold falling: 37.5 → 37.2 °C [Freedman 1999 via Gombert-Labedens 2025]
  swing: 0.04, //             °C  a small natural rise in core temperature, the classic trigger "~0.03–0.05 °C" [Jones 2019]
  flashMin: 3.4, //           min duration of one flash, 3.4 ± 1.4 [Low 2008]
  hrRise: 10, //              bpm heart-rate rise during a flash, +9 ± 2 / +10 ± 1 [Low 2008]
  skinRise: 2.7, //           °C  finger skin-temperature rise, mean 2.7 ± 0.2 (range 1–7) [Meldrum 1979; Kronenberg 1994]
  skinPeakMin: 1, //          min sharp rise at onset [Molnar 1975]; time to peak taken as about 1 min (assumption)
  skinElevatedMin: 31, //     min finger temperature stays raised about 31 min [Meldrum 1979]
  chill: 0.05, //             °C  after-chill depth: direction sourced [Kronenberg 1984], size ILLUSTRATIVE (not measured)
  chillMin: [2, 6, 14], //    min dip begins, bottoms, recovers: ILLUSTRATIVE timing
  ratePost: 1.1, //           per hour, interval 54 ± 10 min in highly symptomatic women [Meldrum 1979]; lab 0.7–1.3 [Freedman 1998; Low 2008]
  swingRiseMin: 9, //         min the pre-flash rise is measured over 20 min [Jones 2019]; half of it to the peak
};

// What the figure draws: the scale board's range, the column's travel.
export const SCALE = { low: -0.25, high: 0.35 };
export const RANGE = { low: -0.07, high: 0.06 };

export const clamp = (v, lo, hi) => Math.min(hi, Math.max(lo, v));
export const lerp = (a, b, t) => a + (b - a) * t;
export const smooth = (a, b, x) => {
  const t = clamp((x - a) / (b - a), 0, 1);
  return t * t * (3 - 2 * t);
};

/** Zone at estrogen state e, relative to resting core temperature. */
export function zoneOf(e) {
  const width = lerp(TRUTH.zoneFloor, TRUTH.zonePre, e);
  // The post zone is centred on rest; widening comes 75 % from the sweat side.
  const sweat = TRUTH.zoneFloor / 2 + (width - TRUTH.zoneFloor) * TRUTH.sweatShare;
  const shiver = sweat - width;
  const shown = lerp(TRUTH.zonePost, TRUTH.zonePre, e); // 0.0 → 0.4, as measured
  return { sweat, shiver, width, shown };
}

/**
 * Flashes per hour at state e. Core temperature wanders by about σ = swing; the
 * rate at which a wandering (Gaussian) signal crosses a level u above its mean
 * falls as exp(−u²/2σ²) (Rice's formula). Anchored to the symptomatic rate.
 */
export function rateOf(e) {
  const s = zoneOf(e).sweat;
  const s0 = zoneOf(0).sweat;
  const sigma = TRUTH.swing;
  return TRUTH.ratePost * Math.exp(-(s * s - s0 * s0) / (2 * sigma * sigma));
}

/** The response to one flash, t minutes after onset. Each part 0..1 or in its unit. */
export function flashAt(t) {
  if (t < 0) return { on: 0, hr: 0, skin: 0, louvre: 0, chill: 0 };
  const D = TRUTH.flashMin;
  // Vasodilation (louvres) and heart rate: on for the flash, eased in and out.
  const on = smooth(0, 0.35, t) * (1 - smooth(D - 0.5, D + 0.4, t));
  // Finger skin: sharp rise, slow fall, back near baseline by ~31 min.
  const tau = TRUTH.skinElevatedMin / 3;
  const rise = smooth(0, TRUTH.skinPeakMin, t);
  const fall = t > TRUTH.skinPeakMin ? Math.exp(-(t - TRUTH.skinPeakMin) / tau) : 1;
  const skin = TRUTH.skinRise * rise * fall;
  // After-chill: core falls below rest after the heat is let out, then recovers.
  const [c0, c1, c2] = TRUTH.chillMin;
  const chill = -TRUTH.chill * (smooth(c0, c1, t) - smooth(c1, c2, t));
  return { on, hr: TRUTH.hrRise * on, skin, louvre: on, chill };
}

/** A natural swing of core temperature, s minutes into it (0 → peak → 0 over 2·swingRiseMin). */
export function swingAt(s) {
  const T = TRUTH.swingRiseMin;
  return TRUTH.swing * (smooth(0, T, s) - smooth(T, 2 * T, s));
}

/** Knob angle (radians, 0 = −y, clockwise from above) for state e. */
export const KNOB = { from: -0.75 * Math.PI, span: 1.5 * Math.PI };
export const knobAngle = (e) => KNOB.from + (1 - e) * KNOB.span;

/** The two dials: their scales and where the needle points for a value. */
export const DIALS = {
  skin: { unit: "°C", from: -0.75 * Math.PI, span: 1.5 * Math.PI, max: 6, count: 12, every: 2, base: 0 },
  hr: { unit: "bpm", from: -0.75 * Math.PI, span: 1.5 * Math.PI, max: 30, count: 12, every: 2, base: 0 },
};
for (const dial of Object.values(DIALS)) dial.angleOf = (v) => dial.from + clamp(v / dial.max, 0, 1) * dial.span;
