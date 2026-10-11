// Fig 3 model: oral vs IV iron through the hepcidin gate, over 8 weeks.
//
// A compartment model in mg of iron, stepped hourly. Pure functions, no DOM;
// the build imports it and the page inlines it. [n] keys refer to
// reference/truth-pack.md §3. Parameters are marked SOURCED, TUNED (fitted so
// the model reproduces a published number) or ASSUMPTION.
//
// The curves are a typical pattern for one modelled woman (65 kg, Hb 105 g/L,
// ferritin 8 µg/L), not a prediction for any person.

export const PARAMS = {
  bw: 65, //                 kg, model woman (ASSUMPTION)
  bvLPerKg: 0.065, //        L/kg blood volume (textbook, MEDIUM)
  feMgPerGHb: 3.47, //       mg Fe per g Hb (stoichiometry, SOURCED)
  hb0: 105, //               g/L start (brief)
  hbSet: 132, //             g/L the marrow heads for when iron isn't limiting (ASSUMPTION, mid-normal for women)
  ferritin0: 8, //           µg/L start (brief)
  mgPerFerritin: 8, //       mg storage iron per µg/L ferritin [30]; not valid just after IV iron
  marrowK: 1 / 18, //        /day of the Hb gap closed when iron isn't limiting (TUNED: FERWON-IDA ≈ +25 g/L by week 8 [6])
  lagD: 4, //                days from marrow uptake to circulating Hb (TUNED, red-cell maturation)
  pillMg: 60, //             mg elemental iron per tablet (Stoffel 2017 [2]; ferrous sulfate 300 mg ≈ 60 mg)
  doseHour: 8, //            08:00, fasting (Moretti 2015 [1], Stoffel 2017 [2])
  fiaMax: 0.23, //           hepcidin-free fractional absorption of 60 mg (TUNED: 14 alternate-day doses → 173 mg vs 175 mg [2])
  doseExp: 0.554, //         absorbed ∝ dose^0.554 (Moretti 2015: 6× dose → 2.7× absorbed [1])
  hepTauH: 8, //             h, hepcidin pulse time constant: raised at 24 h, near baseline by 48 h (TUNED [1][4])
  hepPerMgAbs: 0.115, //     pulse per mg absorbed (TUNED: next-day absorption −38 %, Moretti −35 to −45 % [1])
  storeRefMg: 400, //        stores at which baseline hepcidin halves absorption (ASSUMPTION)
  erfeMax: 0.8, //           max suppression of baseline hepcidin by the hungry marrow (ASSUMPTION, erythroferrone [27])
  ivMg: 1000, //             Monoferric single dose for 50–<70 kg with Hb ≥ 100 g/L (product information table [12][14])
  ivClearT12H: 27, //        h, plasma half-life of ferric derisomaltose (US PI via [17])
  resT12D: 21, //            d, macrophages process the IV complex (TUNED: ferritin < 250 µg/L after week 5 [18])
  ferritinPerMgRes: 0.55, // µg/L ferritin per mg unprocessed macrophage iron (TUNED: peak ≈ 470 near day 7 [17][18])
  sFloorMg: 64, //           stores below this aren't mobilised (ferritin 8 × 8 mg)
  sMobilPerD: 0.02, //       /day mobilisation of stores when the marrow is short (ASSUMPTION)
  netLossMgPerD: 0.5, //     mg/day blood iron lost beyond diet, heavier periods (ASSUMPTION)
  labileToStorePerH: 0.01, // /h new iron the marrow doesn't take drifts to stores (TUNED)
};

export const MODES = ["daily", "alternate", "iv"];
export const DAYS = 56;
export const RECHECK = [42, 56]; // days: the clinic's 6–8 week bloodwork

/**
 * Hourly simulation over 56 days. Returns per-hour arrays:
 * hb (g/L), ferritin (µg/L), gate (0–1, share of the gut gate open = 1/(1 + hepcidin)),
 * take (mg/h to marrow), supply (mg/h of new iron arriving), plasmaIv (mg of IV complex
 * in plasma), dose (mg absorbed at this hour, if a pill), and day-level checkpoints.
 */
export function simulate(mode, p = PARAMS, days = DAYS) {
  const bv = p.bw * p.bvLPerKg;
  const eOf = (hb) => hb * bv * p.feMgPerGHb;
  const e0 = eOf(p.hb0);
  const eSet = eOf(p.hbSet);
  let S = p.ferritin0 * p.mgPerFerritin;
  let C = 0;
  let R = 0;
  let eCommitted = e0;
  const pipe = new Array(p.lagD * 24).fill(0);
  let eCirc = e0;
  let L = 0;
  const doses = [];
  const kC = Math.LN2 / p.ivClearT12H;
  const kR = Math.LN2 / (p.resT12D * 24);
  const n = days * 24 + 1;
  const out = { hb: new Float32Array(n), ferritin: new Float32Array(n), gate: new Float32Array(n), take: new Float32Array(n), supply: new Float32Array(n), plasmaIv: new Float32Array(n), dose: new Float32Array(n), pill: new Uint8Array(n) };
  for (let h = 0; h < n; h++) {
    const day = Math.floor(h / 24);
    const hod = h % 24;
    const gapFrac = Math.max(0, (eSet - eCommitted) / (eSet - e0));
    const hBase = ((S + R) / p.storeRefMg) * (1 - p.erfeMax * Math.min(1, gapFrac));
    let pulse = 0;
    for (const [t0, a] of doses) {
      const x = (h - t0) / p.hepTauH;
      if (x > 0 && x < 12) pulse += p.hepPerMgAbs * a * x * Math.exp(1 - x);
    }
    const H = hBase + pulse;
    const gate = 1 / (1 + H);
    let labile = 0;
    const doseDay = mode === "daily" ? true : mode === "alternate" ? day % 2 === 0 : false;
    if (doseDay && hod === p.doseHour && day < days) {
      const absorbed = p.fiaMax * p.pillMg * Math.pow(p.pillMg / 60, p.doseExp - 1) * gate;
      doses.push([h, absorbed]);
      labile += absorbed;
      out.dose[h] = absorbed;
      out.pill[h] = 1;
    }
    if (mode === "iv" && h === 10) C += p.ivMg;
    const cToR = C * kC;
    C -= cToR;
    R += cToR;
    const rOut = R * kR;
    R -= rOut;
    labile += rOut;
    const want = Math.max(0, (p.marrowK / 24) * (eSet - eCommitted));
    L += labile;
    let take = Math.min(want, L);
    L -= take;
    if (take < want && S > p.sFloorMg) {
      const s = Math.min(want - take, ((S - p.sFloorMg) * p.sMobilPerD) / 24);
      S -= s;
      take += s;
    }
    eCommitted += take;
    const toStore = L * p.labileToStorePerH;
    L -= toStore;
    S += toStore;
    pipe.push(take);
    eCirc += pipe.shift();
    const loss = p.netLossMgPerD / 24;
    eCirc -= loss;
    eCommitted -= loss;
    out.hb[h] = eCirc / (bv * p.feMgPerGHb);
    out.ferritin[h] = S / p.mgPerFerritin + p.ferritinPerMgRes * R;
    out.gate[h] = gate;
    out.take[h] = take;
    out.supply[h] = labile;
    out.plasmaIv[h] = C;
  }
  return out;
}

/** Daily checkpoints (midnight) for tables and the caption. */
export function daily(mode) {
  const s = simulate(mode);
  return Array.from({ length: DAYS + 1 }, (_, d) => ({ day: d, hb: s.hb[d * 24], ferritin: s.ferritin[d * 24], gate: s.gate[d * 24] }));
}
