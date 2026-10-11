// Fig 2 model: segmental multi-frequency bioimpedance on the InBody 580.
//
// Pure functions, no DOM; the build imports it and the page inlines it. Keys in
// [brackets] refer to reference/truth-pack.md §2.
//
// Each segment is a Fricke circuit (extracellular water Re in parallel with
// intracellular water Ri behind the membrane capacitance Cm) read through a Cole
// curve with α = 0.70 [model: Zhuang 2022 arm anchors, Bracco 1996 shares].
// Ohms are example values for an adult woman, not a reference range.

export const TRUTH = {
  freqs: [5, 50, 250, 500], //       kHz, the InBody 580's four frequencies [InBody 580 manual, catalog]
  readings: 20, //                   4 frequencies × 5 segments [same]
  currentUA: 200, //                 µA applied current [InBody 580 manual rev B/C]
  testSeconds: 30, //                about 30 s on the platform [product page]
  alpha: 0.7, //                     Cole dispersion [fit to Zhuang 2022]
  kIcw: 5.255, //                    teaching ratio constant: baseline ECW/TBW = 0.380 [InBody typical]
  ecwNormal: [0.36, 0.39], //        InBody normal band [InBody result-sheet guide]
  shares: { arm: 47.6, trunk: 10.0, leg: 43.0 }, // % of whole-body Z at 50 kHz [Bracco 1996]
  trunkFfm: 48.2, //                 % of fat-free mass in the trunk [Bracco 1996]
  seg: {
    arm: { Re: 439, Ri: 1414, Cm: 1.72e-9 },
    trunk: { Re: 92.2, Ri: 297.1, Cm: 8.17e-9 },
    leg: { Re: 396.6, Ri: 1277.4, Cm: 1.9e-9 },
  },
};

export const SEGMENTS = ["arm", "trunk", "leg", "body"];

/** Cole impedance of one segment at f Hz: resistance, reactance, |Z|, phase angle (°). */
export function cole({ Re, Ri, Cm }, f) {
  const a = TRUTH.alpha;
  const R0 = Re;
  const Rinf = (Re * Ri) / (Re + Ri);
  const fc = 1 / (2 * Math.PI * Cm * (Re + Ri));
  const x = (f / fc) ** a;
  const th = (a * Math.PI) / 2;
  const dr = 1 + x * Math.cos(th);
  const di = x * Math.sin(th);
  const d = dr * dr + di * di;
  const R = Rinf + ((R0 - Rinf) * dr) / d;
  const Xc = ((R0 - Rinf) * di) / d;
  return { R, Xc, Z: Math.hypot(R, Xc), pa: (Math.atan(Xc / R) * 180) / Math.PI, fc };
}

/** Impedance of a named segment at f kHz. "body" is RA + TR + RL in series, as InBody sums it. */
export function impedance(name, fk) {
  const f = fk * 1000;
  if (name !== "body") return cole(TRUTH.seg[name], f);
  const parts = ["arm", "trunk", "leg"].map((n) => cole(TRUTH.seg[n], f));
  const R = parts.reduce((s, p) => s + p.R, 0);
  const Xc = parts.reduce((s, p) => s + p.Xc, 0);
  return { R, Xc, Z: Math.hypot(R, Xc), pa: (Math.atan(Xc / R) * 180) / Math.PI };
}

/** Extracellular share of body water (teaching model; InBody's equations are proprietary). */
export function ecwTbw(name = "arm") {
  const { Re, Ri } = TRUTH.seg[name === "body" ? "arm" : name];
  return 1 / Re / (1 / Re + TRUTH.kIcw / Ri);
}

/**
 * Share of the current that crosses the cell membranes at f kHz (Fricke circuit:
 * the intracellular branch Ri + 1/jωCm in parallel with Re). Near 0 at 5 kHz, it
 * levels off near Re/(Re+Ri) as the membranes stop blocking.
 */
export function throughShare(name, fk) {
  const { Re, Ri, Cm } = TRUTH.seg[name === "body" ? "arm" : name];
  const w = 2 * Math.PI * fk * 1000;
  return Re / Math.hypot(Re + Ri, 1 / (w * Cm));
}
