// A4 model: one heartbeat at a chosen heart rate → phase, valve states, chamber volumes,
// stroke volume and cardiac output. Typical adult values, not a prediction.
//
// At 75 bpm a beat lasts 0.8 s: about 0.3 s of ventricular systole and 0.5 s of diastole;
// as the rate rises, diastole shortens much more than systole [A4-1][A4-2]. Left ventricle
// 120 ml at the end of filling, 50 ml at the end of ejection (stroke volume 70 ml, EF ≈ 58 %)
// [A4-1]; in hard exercise stroke volume rises toward ≈ 120 ml as filling rises and emptying
// deepens [A4-2]. Maximum heart rate for a 45-year-old: 208 − 0.7 × 45 ≈ 176 bpm [16].
export const HEART = {
  rates: [60, 100, 140, 176],
  rest: { edv: 120, esv: 50 },
  hard: { edv: 135, esv: 22 }, // SV 113 ml at full effort (LOW: inside the "toward 120" range)
  systole75: 0.3, // s at 75 bpm [A4-1]
  atrial75: 0.1, //  s, atrial contraction just before ventricular systole (LOW: textbook)
  ivc: 0.05, //      s, isovolumic contraction (LOW)
  ivr: 0.07, //      s, isovolumic relaxation (LOW)
  kick: 0.18, //     share of filling from the atria's own squeeze (LOW, 15–25 %)
};
const clamp = (v, lo, hi) => Math.min(hi, Math.max(lo, v));
const smooth = (t) => (t <= 0 ? 0 : t >= 1 ? 1 : t * t * (3 - 2 * t));
/** Effort share 0..1 from heart rate (60 → 0, ≥140 → 1). */
export const effortOf = (hr) => smooth((hr - 60) / 80);
export function volumesOf(hr) {
  const e = effortOf(hr);
  const edv = HEART.rest.edv + (HEART.hard.edv - HEART.rest.edv) * e;
  const esv = HEART.rest.esv + (HEART.hard.esv - HEART.rest.esv) * e;
  return { edv, esv, sv: edv - esv, co: (hr * (edv - esv)) / 1000 };
}
/** Durations of one beat at a heart rate (s). Systole shortens with the square root of the cycle. */
export function timingOf(hr) {
  const T = 60 / hr;
  const ts = HEART.systole75 * Math.sqrt(T / 0.8);
  const ta = HEART.atrial75 * Math.sqrt(T / 0.8);
  return { T, ta, ts, td: T - ts };
}
/**
 * State at time t (s) into the beat, beat starting with the atria's squeeze (the P wave).
 * Returns the left-ventricle volume (right side drawn alike), atrial volume share, valve openness
 * (0..1) and the phase name.
 */
export function beatAt(hr, t) {
  const { T, ta, ts } = timingOf(hr);
  const { edv, esv } = volumesOf(hr);
  const u = ((t % T) + T) % T;
  const pre = edv - HEART.kick * (edv - esv); // volume before the atria squeeze
  const sOn = ta; //             ventricular systole begins (QRS just before)
  const ejectOn = sOn + HEART.ivc;
  const sOff = sOn + ts; //      aortic valve closes
  const fillOn = sOff + HEART.ivr;
  let V;
  let phase;
  if (u < sOn) {
    V = pre + (edv - pre) * smooth(u / ta);
    phase = "atria squeeze";
  } else if (u < ejectOn) {
    V = edv;
    phase = "valves shut, pressure builds";
  } else if (u < sOff) {
    const x = (u - ejectOn) / (sOff - ejectOn);
    V = edv - (edv - esv) * (1 - (1 - x) ** 2.2);
    phase = "ejection";
  } else if (u < fillOn) {
    V = esv;
    phase = "valves shut, muscle relaxes";
  } else {
    const x = (u - fillOn) / Math.max(0.02, T - fillOn);
    V = esv + (pre - esv) * (1 - Math.exp(-4.5 * x)) / (1 - Math.exp(-4.5));
    phase = "filling";
  }
  // atria: squeeze during their systole, fill as reservoirs while the AV valves are shut, empty into the ventricles
  let A;
  if (u < sOn) A = 1 - 0.45 * smooth(u / ta);
  else if (u < fillOn) A = 0.55 + 0.45 * smooth((u - sOn) / (fillOn - sOn));
  else A = 1 - 0.3 * smooth((u - fillOn) / Math.max(0.02, (T - fillOn) * 0.5)) + 0.3 * smooth((u - fillOn - (T - fillOn) * 0.5) / Math.max(0.02, (T - fillOn) * 0.5));
  const ramp = (a, b, w = 0.03) => clamp(Math.min((u - a) / w, (b - u) / w), 0, 1);
  const av = u < sOn ? 1 : u > fillOn ? clamp((u - fillOn) / 0.03, 0, 1) : clamp((sOn - u) / 0.03 + 1, 0, 1) * 0;
  return { u, T, V, A: clamp(A, 0.5, 1), av: u < sOn ? 1 : av, semi: ramp(ejectOn, sOff), phase, edv, esv, sOn, ejectOn, sOff, fillOn };
}
/** A drawn ECG (mV-ish) at time u into the beat: P with the atria, QRS as systole starts, T near its end. */
export function ecgAt(hr, u) {
  const { ta, ts } = timingOf(hr);
  const g = (x, m, s, a) => a * Math.exp(-(((x - m) / s) ** 2));
  return g(u, ta * 0.45, 0.025, 0.15) - g(u, ta - 0.012, 0.007, 0.12) + g(u, ta, 0.009, 1) - g(u, ta + 0.016, 0.008, 0.25) + g(u, ta + ts * 0.8, 0.045, 0.3);
}
