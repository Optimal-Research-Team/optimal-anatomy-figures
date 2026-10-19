export const FILM = {
  fig: "Optimal Health · Barrie",
  title: "InBody 580 · Body composition",
  radius: 900,
  label:
    "An InBody 580 body-composition analyser, turning: close views of its tilted touchscreen and keypad, the thumb and palm electrodes of a hand grip and the heel and forefoot electrodes on the footplate. The hand electrodes swing up off their rest, the screen comes on and the measurement path lights through the grips and the footplate at 5, 50, 250 and 500 kHz. It then comes apart into its footplate, load cells, column, measurement board and head, and goes back together.",
  bounds: [
    [-251, 251],
    [-446, 446],
    [0, 1124],
  ],
};

export const FIGURE = {
  title: "InBody 580 · anatomy",
  start: { yaw: -38, pitch: 16 },
  label:
    "An InBody 580 body-composition analyser built from {parts} solid parts: a footplate on four levelling feet with a quad load cell set under its cover and four foot electrodes (heel and forefoot, left and right), a white column with a rear connector panel, a cable bundle and a measurement board inside, a smart-reader window between two light guides, shoulders carrying two hand electrodes on cables (a thumb electrode and a palm electrode each), and a head tilted 58 degrees with a 10.1-inch touchscreen and keypad over an LCD module and main board. Apart, it opens into {assemblies} assemblies.",
  keys: [
    { mark: "lit", label: "8-point tactile electrodes: thumb + palm on each grip, heel + forefoot each side" },
    { mark: "raised", label: "Shell: footplate, column, shoulders, head" },
    { mark: "edge", label: "Inside (simplified): load cells, harness, cable bundle, boards" },
  ],
  caption:
    "{parts} convex parts, re-projected and re-shaded every frame and painted in an order solved from separating planes. Outer size from the InBody 580 manual: 501.9 × 892.4 × 1124.4 mm. The internals are not published, so the load cells, harness, cable bundle and boards are drawn as plausible, simplified parts.",
};

// grip: hand electrodes swing up off their rest · screen: display on · scan: one measurement (0 → 1)
export const FEATURE_DEFAULTS = { grip: 0, screen: 0, scan: 0 };

export const FEATURE_KEYS = [
  { key: "h", channel: "grip", name: "grips", unit: "", values: [0, 1], ease: 0.35, verb: "lifts the hand electrodes", button: "Lift grips", tour: [0.04, 0.38] },
  { key: "s", channel: "screen", name: "screen", unit: "", values: [0, 1], ease: 0.2, verb: "turns the screen on", button: "Screen on", tour: [0.08, 0.38] },
  { key: "m", channel: "scan", name: "measure", unit: "", values: [0, 1], run: 3.2, verb: "runs a measurement", button: "Measure", tour: [0.12, 0.38] },
];

const clamp01 = (x) => Math.max(0, Math.min(1, x));
const SWING = 80;

export function featureValues(s, values) {
  return {
    ...values,
    "swing.R": SWING * clamp01(s.grip),
    "swing.L": SWING * clamp01(s.grip),
  };
}

export function featureTravel(a, b) {
  return (Math.abs(b.grip - a.grip) * SWING * Math.PI * 370) / 180;
}

// CSS custom properties that light the current path and the screen; set on the page's root every frame.
// scan: 0–.18 current flows out from the column down the grip cables · .12–.3 palm + forefoot (current) light
//       .22–.4 thumb + heel (voltage) light · .3–1 the four frequencies step through; cells fill (20 readings)
export function cssVars(s) {
  const k = clamp01(s.scan);
  const live = k > 0 && k < 1 ? Math.min(1, k / 0.04, (1 - k) / 0.06) : 0;
  const ramp = (a, b) => clamp01((k - a) / (b - a));
  const meas = ramp(0.3, 0.96);
  const fi = meas * 4;
  const out = {
    "--screen": Math.max(clamp01(s.screen), live).toFixed(3),
    "--flow": (ramp(0, 0.2) * live).toFixed(3),
    "--live": live.toFixed(3),
    "--g-inject": (ramp(0.12, 0.26) * live).toFixed(3),
    "--g-sense": (ramp(0.22, 0.36) * live).toFixed(3),
    "--meas": meas.toFixed(3),
  };
  const done = ramp(0.95, 1);
  out["--done"] = done.toFixed(3);
  for (let j = 0; j < 4; j++) out[`--f${j}`] = Math.max(done, k >= 0.3 ? clamp01(1 - Math.abs(fi - j - 0.5) * 1.6) : 0).toFixed(3);
  return out;
}

// the figure page's readout line
export function status(s) {
  const k = clamp01(s.scan);
  const step = Math.min(3, Math.floor(clamp01((k - 0.3) / 0.66) * 4));
  const freq = ["5", "50", "250", "500"][step];
  const grips = s.grip > 0.5 ? "grips held" : "grips at rest";
  const screen = s.screen > 0.5 || (k > 0 && k < 1) ? "screen on" : "screen off";
  const meas = k <= 0.02 ? "" : k < 0.3 ? " · current on" : k < 0.96 ? ` · ${freq} kHz` : " · 20 readings";
  return `${grips} · ${screen}${meas}`;
}
