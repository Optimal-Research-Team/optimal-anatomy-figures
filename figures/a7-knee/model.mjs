// A7 model: the knee's bend through one running stride, and the kneecap (patellofemoral) force.
// The force comes from Fig 4's kneeOf(cadence) (Lenhart 2014: −14 % at +10 % step rate), inlined
// alongside. Knee angles are LOW keyframes from truth pack §4 and only pose the drawing; they're
// never printed.
export const KNEE = {
  ic: 17, //        ° knee bend at foot contact, preferred cadence (implied baseline ≈ 17°; LOW)
  icPer10: 1.8, //  ° more bend at contact per +10 % step rate (LOW)
  peak: 46.3, //    ° peak stance bend, preferred (46.3 → 42.8 at +10 %; LOW)
  peakPer10: -3.5,
  off: 20, //       ° at toe-off (drawn)
  swing: 105, //    ° peak swing bend (drawn, not sourced)
  duty: 0.39, //    stance share of the stride [Fig 4: 39 ± 4 %]
  slow: 4, //       shown this many times slower than life
};
const cr = (k, t) => {
  // Catmull-Rom through keyframes [[t, v], …]
  let i = 0;
  while (i < k.length - 2 && t > k[i + 1][0]) i++;
  const [t1, p1] = k[i];
  const [t2, p2] = k[i + 1];
  const p0 = (k[i - 1] ?? k[i])[1];
  const p3 = (k[i + 2] ?? k[i + 1])[1];
  const u = Math.max(0, Math.min(1, (t - t1) / (t2 - t1)));
  return 0.5 * (2 * p1 + (-p0 + p2) * u + (2 * p0 - 5 * p1 + 4 * p2 - p3) * u * u + (-p0 + 3 * p1 - 3 * p2 + p3) * u * u * u);
};
/** Knee bend (°) at stride phase φ ∈ [0, 1) for a step-rate change of pct %. Foot contact at φ = 0. */
export function bendAt(phi, pct) {
  const ic = KNEE.ic + (KNEE.icPer10 * pct) / 10;
  const pk = KNEE.peak + (KNEE.peakPer10 * pct) / 10;
  const d = KNEE.duty;
  return cr([[0, ic], [d * 0.44, pk], [d, KNEE.off], [d + (1 - d) * 0.45, KNEE.swing], [0.97, ic - 2], [1, ic]], phi);
}
/** Kneecap force at phase φ, relative to the preferred-cadence peak: a hump over stance, zero in swing. */
export function pfAt(phi, cadence) {
  if (phi >= KNEE.duty) return 0;
  const tau = phi / KNEE.duty;
  return kneeOf(cadence) * Math.sin(Math.PI * tau ** 0.85) ** 2;
}
