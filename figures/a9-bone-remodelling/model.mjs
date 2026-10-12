// A9 model: remodelling on the top surface of one trabecula (a strut of spongy bone). Each
// remodelling site (BMU) digs a cavity, pauses, then refills it. Keys refer to
// reference/truth-pack.md "A9". e is the estrogen state, as in Fig 1 and A2: 1 = before
// menopause, 0 = the years around and after the final period.
export const BONE = {
  resorb: 21, //   days digging [BRP-W: ≈ 2 weeks; BRP-F: ≈ 22 days]
  reverse: 10, //  days of reversal [BRP-W: ≈ 2 weeks; BRP-F: ≈ 8 days]
  form: 90, //     days refilling [BRP-W: ≈ 13 weeks; BRP-F: ≈ 65 days]
  sitesPerYear: [9, 3.6], // new sites a year on the drawn surface, post → pre: ILLUSTRATIVE (direction: activation rises with low estrogen [Est-R])
  fill: [0.9, 1.0], //        share of each cavity refilled, post → pre: ILLUSTRATIVE (direction: formation lags resorption [Est-R]); premenopausal bone mass is about stable
  depth: 34, width: 84, //    drawn cavity, px
  years: 3, //                shown (SWAN: ≈ 6–7 % lost over the 3 years around the final period [SWAN-3])
  pace: 30, //                days per second on screen
};
const lerp = (a, b, t) => a + (b - a) * t;
/** Remodelling at estrogen state e. */
export const remodelOf = (e) => ({ perYear: lerp(BONE.sitesPerYear[0], BONE.sitesPerYear[1], e), fill: lerp(BONE.fill[0], BONE.fill[1], e) });
/** Cavity shape across a site, u ∈ [0, 1] → 0…1 (a scalloped Howship's lacuna). */
export const scoop = (u) => (u <= 0 || u >= 1 ? 0 : Math.sin(Math.PI * u) ** 1.4);
/** One site's depth (0…1 of the full cavity) `age` days after it starts, with refill share `fill`. */
export function depthAt(age, fill) {
  const { resorb, reverse, form } = BONE;
  if (age < 0) return 0;
  if (age < resorb) return age / resorb; // digging deeper
  if (age < resorb + reverse) return 1;
  const f = Math.min(1, (age - resorb - reverse) / form);
  return 1 - fill * (1 - (1 - f) ** 1.6); // refills fast at first, then slows as it mineralises
}
export const cycleDays = () => BONE.resorb + BONE.reverse + BONE.form;
