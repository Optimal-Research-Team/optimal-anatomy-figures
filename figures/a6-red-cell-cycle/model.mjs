// A6 model: the red cell's 120-day loop, driven by Fig 3's iron model (the build runs
// simulate("iv") and passes the series in). Pure functions; the page inlines this file.
//
// Red cells live about 120 days [Franco 2012]; macrophages recycle the iron of the cells
// that die (≈ 13 mg/day for the model woman at Hb 105 g/L, 20–25 mg/day in a typical adult)
// [Hentze 2010]. The iron built into new cells each day is the recycled iron plus the net rise
// in circulating red-cell iron that Fig 3's model computes after IV iron.
export const LOOP = {
  life: 120, //  days in circulation [Franco 2012]
  pace: 2, //    days per second on screen
  before: 4, //  days shown before the dose
  after: 56, //  last day shown (Fig 3's 8 weeks)
};
const clamp = (v, a, b) => Math.min(b, Math.max(a, v));
/** Value of a series sampled every S.step days from day 0, at `day` (held outside the range). */
export function seriesAt(S, key, day) {
  const a = S[key];
  const u = clamp(day / S.step, 0, a.length - 1);
  const i = Math.min(a.length - 2, Math.floor(u));
  return a[i] + (a[i + 1] - a[i]) * (u - i);
}
/** Iron going into new red cells (mg/day) on `day`. Before the dose (or untreated) it's c0. */
export const cohortAt = (S, day, treated) => (!treated || day < 0 ? S.c0 : S.c0 + Math.max(0, seriesAt(S, "rise", day)));
/** Cumulative production in units of one drawn cell (one cell = a normal day's iron, cNorm). */
export const madeBy = (S, day, treated) => (S.c0 * day + (treated && day > 0 ? seriesAt(S, "cum", day) : 0)) / S.cNorm;
/** Ferritin granules drawn in the spleen macrophage: 5 at ferritin 8 µg/L, 40 near the IV peak. */
export const granulesOf = (ferritin) => Math.round(5 + 35 * clamp(Math.log(ferritin / 8) / Math.log(470 / 8), 0, 1.1));
