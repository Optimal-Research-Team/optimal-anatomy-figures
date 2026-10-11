// Reference compartment model for Fig 3 (IV vs oral iron). Hourly Euler step, 56 days.
// All "tuned" parameters are marked; everything else is sourced in truth-3.md.
export const P = {
  bw: 65,                // kg, typical adult woman (assumption)
  bvLPerKg: 0.065,       // L/kg blood volume, adult women (textbook, MEDIUM)
  feMgPerGHb: 3.47,      // mg Fe per g Hb (stoichiometry)
  hb0: 105,              // g/L start (brief)
  hbSet: 132,            // g/L Hb the marrow heads for once iron is not limiting (assumption; women's normal ~120-155)
  ferritin0: 8,          // ug/L start (brief)
  mgPerFerritin: 8,      // mg storage Fe per ug/L ferritin (Walters 1973)
  marrowK: 1 / 18,       // /day: fraction of the Hb gap closed per day when iron is not limiting  [TUNED to FERWON-IDA ~+25 g/L by wk 8]
  lagD: 4,               // days from marrow iron uptake to circulating Hb (reticulocyte maturation) [TUNED]
  pillMg: 60,            // mg elemental Fe per dose (ferrous sulfate, Stoffel 2017)
  doseHour: 8,           // 8 am fasting dose
  fiaMax: 0.23,          // hepcidin-free fractional absorption of a 60 mg dose, iron-depleted women [TUNED to Stoffel 2017 alt-day 21.8%]
  doseExp: 0.554,        // absorbed = f(dose^0.554) (Moretti 2015: 6x dose -> 2.7x absorbed)
  hepTauH: 8,            // h, gamma-kernel time constant: ~41% of peak at 24 h, ~4% at 48 h (Moretti 2015: raised at 24 h, baseline by 48 h) [TUNED]
  hepPerMgAbs: 0.115,    // pulse peak (in K units) per mg absorbed [TUNED: next-day FIA down ~38% (Moretti 35-45%)]
  storeRefMg: 400,       // stores (S+R) at which baseline hepcidin halves absorption (~ferritin 50) [ASSUMPTION]
  erfeMax: 0.8,          // max suppression of baseline hepcidin by erythroid drive (ERFE) [ASSUMPTION]
  ivMg: 1000,            // Monoferric single dose for 50-<70 kg, Hb >=100 g/L (PM simplified table)
  ivClearT12H: 27,       // h, plasma half-life of FDI (US PI)
  resT12D: 21,           // d, half-time for RES to process IV iron into exportable/stable iron [TUNED to ferritin <250 by wk5]
  ferritinPerMgRes: 0.55,// ug/L serum ferritin per mg unprocessed RES iron (macrophage ferritin secretion) [TUNED: peak ~450-500 near d7-10]
  sFloorMg: 64,          // stores below this are not mobilised (ferritin 8 * 8 mg)
  sMobilPerD: 0.02,      // /day mobilisation of stores above floor when marrow still short [ASSUMPTION]
  netLossMgPerD: 0.5,    // mg/day blood-iron loss not covered by diet (heavier periods) [ASSUMPTION; 0 = balanced]
  labileToStorePerH: 0.01, // /h: new iron not taken by marrow drifts to stores [TUNED so most absorbed iron reaches RBCs in IDA]
};

export function simulate(mode, p = P, days = 56) {
  const bv = p.bw * p.bvLPerKg;
  const eOf = hb => hb * bv * p.feMgPerGHb;           // mg Fe in circulating Hb
  const e0 = eOf(p.hb0), eSet = eOf(p.hbSet);
  let S = p.ferritin0 * p.mgPerFerritin;              // storage iron, mg
  let C = 0, R = 0;                                   // IV complex in plasma; unprocessed RES iron
  let eCommitted = e0;                                // Hb iron committed in marrow (leads circulating by lag)
  const pipe = new Array(p.lagD * 24).fill(0);        // hourly delay line for new Hb iron
  let eCirc = e0;
  let L = 0;                                          // labile/transferrin-delivered new iron awaiting marrow uptake, mg
  const doses = [];                                   // [hour, absorbedMg]
  const kC = Math.LN2 / p.ivClearT12H, kR = Math.LN2 / (p.resT12D * 24);
  const out = []; let absCum = 0, ivUsedHb = 0;
  for (let h = 0; h <= days * 24; h++) {
    const day = Math.floor(h / 24), hod = h % 24;
    const gapFrac = Math.max(0, (eSet - eCommitted) / (eSet - e0));
    const hBase = ((S + R) / p.storeRefMg) * (1 - p.erfeMax * Math.min(1, gapFrac));
    let pulse = 0;
    for (const [t0, a] of doses) { const x = (h - t0) / p.hepTauH; if (x > 0 && x < 12) pulse += p.hepPerMgAbs * a * x * Math.exp(1 - x); }
    const H = hBase + pulse, gate = 1 / (1 + H);
    let labile = 0; // new iron arriving this hour
    // oral dosing at 8 am
    const doseDay = mode === 'daily' ? true : mode === 'alternate' ? day % 2 === 0 : false;
    if (doseDay && hod === p.doseHour && day < days) {
      const absorbed = p.fiaMax * p.pillMg * Math.pow(p.pillMg / 60, p.doseExp - 1) * gate;
      doses.push([h, absorbed]); absCum += absorbed; labile += absorbed;
    }
    // IV infusion at day 0, 10 am
    if (mode === 'iv' && h === 10) C += p.ivMg;
    const cToR = C * kC; C -= cToR; R += cToR;
    const rOut = R * kR; R -= rOut; labile += rOut;
    // marrow: closes the Hb gap at marrowK/day, limited by new iron
    const want = Math.max(0, (p.marrowK / 24) * (eSet - eCommitted));
    L += labile;
    let take = Math.min(want, L); L -= take;
    if (take < want && S > p.sFloorMg) { const s = Math.min(want - take, (S - p.sFloorMg) * p.sMobilPerD / 24); S -= s; take += s; }
    eCommitted += take; if (mode === 'iv') ivUsedHb += take;
    const toStore = L * p.labileToStorePerH; L -= toStore; S += toStore; // what the marrow doesn't take is stored
    pipe.push(take); eCirc += pipe.shift();
    const loss = p.netLossMgPerD / 24; eCirc -= loss; eCommitted -= loss;   // ongoing (menstrual) loss comes out of circulating Hb
    if (hod === 0) {
      const hb = eCirc / (bv * p.feMgPerGHb);
      out.push({ day, hb: +hb.toFixed(1), ferritin: +(S / p.mgPerFerritin + p.ferritinPerMgRes * R).toFixed(0),
        hepcidin: +H.toFixed(2), gatePct: +(gate * 100).toFixed(0), absorbedCum: +absCum.toFixed(1), toHbCum: +(eCommitted - e0 + p.netLossMgPerD * day).toFixed(1),
        storesMg: +(S + R + C + L).toFixed(0), recycleMgPerDay: +(eCirc / 120).toFixed(1) });
    }
  }
  return out;
}
