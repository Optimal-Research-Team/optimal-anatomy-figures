export const FILM = {
  fig: "Optimal Health · Barrie",
  title: "KICKR BIKE SHIFT",
  corner: "KICKR BIKE · VO<sub>2</sub> max testing",
  radius: 880,
  label:
    "A Wahoo KICKR BIKE SHIFT smart indoor bike, drawn in ink on cream paper, turning into view, seen close on its five-hole crank claw, a shift paddle clicking on the right hood and the saddle rising on its seatpost. The cover comes off the flywheel and the cranks turn it through the belt drive. Then it comes apart into its base legs, frame, belt drive, flywheel and brake, handlebars and saddle, and goes back together.",
  bounds: [
    [-420, 420],
    [-690, 740],
    [0, 1010],
  ],
};

export const FIGURE = {
  title: "KICKR BIKE SHIFT · anatomy",
  start: { yaw: 58, pitch: 14 },
  label:
    "A Wahoo KICKR BIKE SHIFT smart bike built from {parts} solid parts: a base of a bolted front leg and two splayed rear stabiliser legs on levelling feet, a bottom-bracket housing carrying a belt drive to a covered flywheel and its electronic brake, five-bolt crank discs and crank arms with a five-hole claw for 165 to 175 mm, an upright and top beam with setback and reach sliders and quick-release levers, a square seat tube, numbered seatpost and saddle, a head tube, steer tube, stem with status lights, drop handlebars with hoods, brake-style levers, shift paddles and steering buttons, and a bottle cage. Apart, it opens into {assemblies} assemblies.",
  keys: [
    { mark: "raised", label: "Frame: base legs, upright, beam, sliders, seat and head tubes" },
    { mark: "lit", label: "Drive: crank discs and arms, belt, pulleys, flywheel, brake" },
    { mark: "edge", label: "Contact points: saddle, handlebars, hoods, paddles" },
  ],
  caption:
    "{parts} convex parts in real millimetres, scaled from Wahoo's manual (footprint about 140 × 79 cm). C turns the cranks and the belt-driven flywheel, O takes the cover off the flywheel, S raises the saddle 60 mm, P clicks the right shift paddle. The SHIFT has no tilting frame: it simulates grade with its electronic brake alone. Pedals are not supplied with the bike, so none are drawn.",
};

export const FEATURE_DEFAULTS = { cadence: 0, cover: 0, saddle: 0, shift: 0 };

export const FEATURE_KEYS = [
  { key: "c", channel: "cadence", name: "cranks", unit: "°", step: 360, ease: 0.9, verb: "turns the cranks and the flywheel" },
  { key: "o", channel: "cover", name: "cover", unit: "", values: [0, 1], ease: 0.3, verb: "takes the flywheel cover off" },
  { key: "s", channel: "saddle", name: "saddle", unit: "", values: [0, 1], ease: 0.3, verb: "raises the saddle" },
  { key: "p", channel: "shift", name: "paddle", unit: "", values: [0, 1], ease: 0.12, verb: "clicks the shift paddle" },
];

const DRIVE_RATIO = 105 / 32;

export function featureValues(s, values) {
  return {
    ...values,
    // pedalling forward turns the right crank clockwise seen from the right: negative about +x
    crank: -s.cadence,
    fly: -s.cadence * DRIVE_RATIO,
    "fly.cover": 480 * s.cover,
    "seat.fit": 60 * s.saddle,
    "shift.R": 18 * s.shift,
  };
}

export function featureTravel(a, b) {
  return Math.max(
    (Math.abs(b.cadence - a.cadence) * Math.PI * 175) / 180,
    (Math.abs(b.cadence - a.cadence) * DRIVE_RATIO * Math.PI * 150) / 180,
    Math.abs(b.cover - a.cover) * 480,
    Math.abs(b.saddle - a.saddle) * 60,
    Math.abs(b.shift - a.shift) * 20,
  );
}
