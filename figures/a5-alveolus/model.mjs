// A5 model: a red cell's trip past an air sac. Time in the capillary, how fast its oxygen
// pressure rises to the alveolar value, and how saturated it leaves. Typical healthy adult.
//
// At rest a red cell spends ≈ 0.75 s in the pulmonary capillary and reaches the alveolar PO₂
// within the first ≈ 0.25–0.3 s; in hard exercise the transit shortens toward ≈ 0.25–0.3 s
// [A5-1][A5-2]. Alveolar PO₂ ≈ 100 mmHg, blood arriving ≈ 40 mmHg at rest [A5-1].
export const LUNG = {
  PA: 100, //          mmHg, alveolar oxygen
  transitRest: 0.75, // s at rest [A5-1]
  equil: 0.25, //      s to reach the alveolar value (within ≈ 1 mmHg) [A5-1][A5-2]
  p50: 26.8, hill: 2.7, // oxygen–hemoglobin curve (standard adult values; LOW in this pack)
  states: [
    // cardiac output from A4; venous PO₂ falls as muscles extract more (LOW, typical)
    { key: "rest", label: "Rest", co: 4.2, pv: 40, f: 14, tv: 0.5 },
    { key: "walk", label: "Walk", co: 9.2, pv: 32, f: 22, tv: 1.2 },
    { key: "run", label: "Run", co: 15.8, pv: 25, f: 36, tv: 2.0 },
    { key: "max", label: "All out", co: 19.9, pv: 20, f: 50, tv: 2.5 },
  ],
};
/** Transit falls less steeply than flow rises, because more capillaries open (LOW shape). */
export const transitOf = (co) => LUNG.transitRest * (LUNG.states[0].co / co) ** 0.6;
const tau = LUNG.equil / Math.log(60); // 60 mmHg gap closed to 1 mmHg by `equil`
/** Oxygen pressure in a red cell t seconds after it reaches the air sac. */
export const po2At = (t, pv) => LUNG.PA - (LUNG.PA - pv) * Math.exp(-Math.max(0, t) / tau);
/** Hemoglobin saturation for an oxygen pressure (Hill curve). */
export const satOf = (p) => p ** LUNG.hill / (p ** LUNG.hill + LUNG.p50 ** LUNG.hill);
