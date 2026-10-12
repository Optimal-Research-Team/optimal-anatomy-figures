// A8 model: water inside and between muscle fibres, and the ECW/TBW ratio InBody reports.
// A teaching model: the body's water is split into skeletal muscle and everything else, and a
// scene changes only the muscle (fibre size, or fluid between the fibres). Keys refer to
// reference/truth-pack.md §2 and "A8".
export const WATER = {
  body: 0.38, //        typical whole-body ECW/TBW on InBody [17]
  muscleShare: 0.5, //  share of body water held in skeletal muscle (≈ 40 % of mass × ≈ 75 % water ÷ 60 % body water; LOW)
  muscleEcw: 0.16, //   ECW share of muscle water (extracellular space ≈ 10–15 % of muscle volume; LOW)
  bands: [[0.39, "Normal"], [0.4, "Slightly over"], [Infinity, "Over"]], // InBody tiers [18]
  scenes: [
    // fibre: fibre diameter (×); spread: how far apart fibres sit (×); gap: fluid between fibres (×)
    { key: "typical", label: "Typical", fibre: 1, spread: 1, gap: 1 },
    { key: "bigger", label: "Bigger", fibre: 1.04, spread: 1.04, gap: 1 },
    { key: "smaller", label: "Smaller", fibre: 0.93, spread: 0.93, gap: 1 },
    { key: "fluid", label: "Extra fluid", fibre: 1, spread: 1.07, gap: 1.7 },
  ],
};
/** Body ECW/TBW for a scene. Fibre water scales with fibre area; gap water with gap × perimeter. */
export function ratioOf(sc) {
  const rest = (1 - WATER.muscleShare) / WATER.muscleShare; // rest-of-body water, in muscle-water units
  const restE = WATER.body * (1 + rest) - WATER.muscleEcw; // its ECW, chosen so "typical" is 0.380
  const E = WATER.muscleEcw * sc.gap * sc.fibre;
  const I = (1 - WATER.muscleEcw) * sc.fibre ** 2;
  return (E + restE) / (E + I + rest);
}
export const bandOf = (r) => WATER.bands.find(([lim]) => r < lim)[1];
