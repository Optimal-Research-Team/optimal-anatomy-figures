// A2 model: KNDy neurons in the arcuate (infundibular) nucleus and the heat-loss centre they
// signal. e is the estrogen state, as in Fig 1: 1 = before menopause, 0 = after menopause in a
// woman who has hot flashes. Keys refer to reference/truth-pack.md §1 and "A2".
//
// Sourced: after menopause these neurons are enlarged (NKB neurons ≈ 194 % of premenopausal
// cross-sectional area [Rance & Young 1991], % LOW) with more NKB and kisspeptin gene
// expression [Rance & Young 1991][Rometo 2007]; NKB acting on NK3 receptors in the median
// preoptic nucleus drives heat loss [Rance 2013][Mittelman-Smith 2012]; NKB given to women
// causes flushes [Jayasena 2015]. Firing and signal sizes below are DRAWN, not measured.
export const KNDY = {
  area: 1.94, //            post ÷ pre soma area [Rance & Young 1991] (direction HIGH, % LOW)
  burst: [3.4, 1.7], //     s between drawn bursts, pre → post: ILLUSTRATIVE (more NKB signalling)
  packets: [2, 4], //       NKB packets per axon per burst, pre → post: ILLUSTRATIVE
  axons: 4, //              drawn KNDy → MnPO axons
  tau: 2.5, //              s, how fast the heat-loss centre's drive fades: ILLUSTRATIVE
  k: 0.034, //              drive added per packet: sets the post mean near 0.8 of the tipping point
  swing: 0.22, //           a small natural wander in core temperature (Fig 1's trigger), as drive
  refractory: 6, //         s after a flash before the next can start (drawn)
};
const lerp = (a, b, t) => a + (b - a) * t;
/** KNDy state at estrogen e: soma scale (diameter), seconds between bursts, packets per axon. */
export const kndyOf = (e) => ({
  scale: Math.sqrt(lerp(KNDY.area, 1, e)),
  area: lerp(KNDY.area, 1, e),
  burst: lerp(KNDY.burst[1], KNDY.burst[0], e),
  packets: Math.round(lerp(KNDY.packets[1], KNDY.packets[0], e)),
});
/** Mean drive on the heat-loss centre (1 = tipping point) at estrogen e. */
export const meanDrive = (e) => {
  const s = kndyOf(e);
  return (KNDY.k * s.packets * KNDY.axons * KNDY.tau) / s.burst;
};
/** The wander: 0 … swing, irregular. */
export const wanderAt = (t) => KNDY.swing * (0.5 + 0.3 * Math.sin((2 * Math.PI * t) / 7.3) + 0.2 * Math.sin((2 * Math.PI * t) / 11.9 + 1.3));
