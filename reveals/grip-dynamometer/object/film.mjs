export const FILM = {
  fig: "Optimal Health · Barrie",
  title: "Hand dynamometer · Grip strength",
  radius: 210,
  label:
    "A hydraulic hand dynamometer, the clinical grip-strength meter, turning, seen close on its dual-scale dial and the five handle positions, the handle squeezing in while the needle sweeps up and the peak-hold needle keeps the reading, the reset knob turning it back to zero, then taken apart into its gauge, Bourdon tube, pistons, body and handle and put back together.",
  bounds: [
    [-140, 52],
    [-52, 140],
    [-96, 274],
  ],
};

export const FIGURE = {
  title: "Hand dynamometer · anatomy",
  pageTitle: "Hand dynamometer · Optimal Health",
  lead: "The clinical grip-strength meter. A sealed hydraulic system turns a squeeze into a reading on a dual kilogram and pound dial, and a peak-hold needle keeps the highest value until it is reset.",
  note: "Drawn as the clinical-standard hydraulic design: five handle positions from 35 to 86 mm, a 0–90 kg / 0–200 lb dial and a peak-hold needle, from the manufacturer's user manual and published clinical protocols. Overall size, the internal layout of the body and the handle clip are estimates; handle travel is shown larger than on the real, near-isometric instrument. Geometry only: no photographs.",
  start: { yaw: -32, pitch: 12 },
  label:
    "A hydraulic hand dynamometer built from {parts} solid parts: a dual-scale gauge (kilograms outside, pounds inside) behind a crystal with a chrome reset knob, a main needle and a peak-hold needle, a Bourdon tube with its link, sector and pinion, a shock-resistant rubber cap, an aluminium body holding a sealed hydraulic channel and two pistons, an adjustable handle with notched forks for five grip positions, the handle clip on the lower post, and a wrist strap. Apart, it opens into {assemblies} assemblies.",
  keys: [
    { mark: "raised", label: "Body: aluminium casting, cover, sealed channel, two bores" },
    { mark: "lit", label: "Hydraulic path: pistons, channel, Bourdon tube (leaf)" },
    { mark: "edge", label: "Gauge: dial, needles, crystal, reset knob, rubber cap" },
  ],
  caption:
    "{parts} convex parts, re-projected and re-shaded every frame. Squeezing pulls the handle toward the body; its forks push the two posts into their bores, and the sealed fluid carries the pressure to a Bourdon tube that turns the needle. The peak-hold needle stays at the highest reading until the knob on the crystal turns it back. G squeezes, R resets the peak, H moves the handle to the next of its five positions.",
};

// grip: kg on the main needle; peak: kg held by the peak needle (it never sits below grip); position: handle setting 1-5.
export const FEATURE_DEFAULTS = { grip: 0, peak: 0, position: 2 };

export const FEATURE_KEYS = [
  { key: "g", channel: "grip", name: "grip", unit: " kg", values: [0, 42], ease: 0.38, verb: "squeezes the handle" },
  { key: "r", channel: "peak", name: "peak", unit: " kg", values: [0, 0], ease: 0.3, verb: "turns the reset knob" },
  { key: "h", channel: "position", name: "position", unit: "", step: 1, wrap: [1, 5], ease: 0.25, verb: "moves the handle to the next position" },
];

// Page-only behaviour: the peak needle never sits below the main needle, and the idle tour squeezes, holds, then resets.
export function LATCH(target, drawn) {
  // The main needle only pushes the peak needle while it rises; a reset during the fall must stick.
  if (target.grip < drawn.grip - 1e-6) return;
  if (drawn.grip > drawn.peak) drawn.peak = drawn.grip;
  if (target.peak < drawn.grip) target.peak = drawn.grip;
}
export function TOUR(lap, target) {
  target.grip = lap > 0.05 && lap < 0.13 ? 42 : 0;
  if (lap > 0.27 && lap < 0.29) target.peak = 0;
}

const DYN = { kgFull: 90.7185, sweep: 324, squeezePerKg: 2.5 / 42, step: 12.7 };
const dialAngle = (kg) => (Math.max(0, kg) / DYN.kgFull) * DYN.sweep;

export function featureValues(s, values) {
  const held = Math.max(s.peak, s.grip);
  return {
    ...values,
    squeeze: Math.min(4, Math.max(0, s.grip) * DYN.squeezePerKg),
    "handle.pos": Math.max(0, Math.min(4, s.position - 1)) * DYN.step,
    needle: dialAngle(s.grip),
    "peak.hold": dialAngle(held),
  };
}

export function featureTravel(a, b) {
  const deg = (kg) => (kg / DYN.kgFull) * DYN.sweep;
  return Math.max(
    (Math.abs(deg(b.grip) - deg(a.grip)) * Math.PI * 37) / 180,
    (Math.abs(deg(Math.max(b.peak, b.grip)) - deg(Math.max(a.peak, a.grip))) * Math.PI * 36) / 180,
    Math.abs(b.grip - a.grip) * DYN.squeezePerKg,
    Math.abs(b.position - a.position) * DYN.step,
  );
}
