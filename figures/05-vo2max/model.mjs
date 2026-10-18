// Fig 5 model: a ramp test on a bike ergometer → power, oxygen uptake, heart rate, RER, breathing,
// and the pedalling pose that draws it.
//
// Pure functions, no DOM. [n] keys refer to reference/truth-pack.md §5.
// One modelled person (45 years, 75 kg): a typical pattern, not a prediction.

export const TRUTH = {
  bm: 75, //              kg, the modelled rider
  age: 45, //             years
  slope: 10.3, //         mL O₂/min per W on a ramp, 10.29 ± 1.01 in healthy men [7] HIGH
  rest: 3.5, //           mL/kg/min seated at rest, 1 MET [21] (convention) HIGH
  base: [150, 6], //      unloaded pedalling VO₂ = 150 + 6 × body mass, mL/min [9] MEDIUM
  rampMin: 10, //         ramp sized to reach the ceiling in about 10 min [1][3] HIGH
  tau: 0.6, //            min, VO₂ lags the ramp as a first-order response (30–45 s) LOW: shape only
  tauOff: 1.0, //         min, recovery fall-off LOW: shape only
  hrRest: 65, //          bpm, typical adult at rest LOW
  hrMax: [208, 0.7], //   HRmax = 208 − 0.7 × age [16] HIGH (a population average, ±10 bpm or more)
  rer: { rest: 0.8, vt1: 0.9, xVT1: 0.55, max: 1.15, bend: 1.6 }, // LOW shape; RER ≥ 1.10 at max is the usual criterion [11] HIGH
  cadence: 60, //         rpm, the usual target (55–70) [6] MEDIUM
  phases: { rest: 3, unloaded: 3, recovery: 3 }, // min [3][5] HIGH
  plateau: 45, //         mL/min softness of the ceiling (shape only)
  hold: 1.0, //           min the plateau runs before the test stops
  breath: { f0: 14, f1: 36, ve: 27, veTop: 10, xRCP: 0.85, exhale: 0.55 }, // breathing, LOW: drives the turbine and the hose only
  hoseArea: 9.6, //       cm², a 35 mm breathing hose
  ceilings: [25, 35, 45, 55], // mL/kg/min offered by the fitness control (model values, not norms)
};

export const clamp = (v, lo, hi) => Math.min(hi, Math.max(lo, v));
export const hrMaxOf = (age = TRUTH.age) => TRUTH.hrMax[0] - TRUTH.hrMax[1] * age;
export const baseOf = (bm = TRUTH.bm) => TRUTH.base[0] + TRUTH.base[1] * bm;
const softMin = (a, b, k) => -k * Math.log(Math.exp(-a / k) + Math.exp(-b / k));

/** RER for a share x of VO₂max (LOW shape, crosses 1.0 near 80 %). */
export function rerOf(x) {
  const r = TRUTH.rer;
  if (x <= r.xVT1) return r.rest + (r.vt1 - r.rest) * clamp(x / r.xVT1, 0, 1);
  return r.vt1 + (r.max - r.vt1) * Math.pow(clamp((x - r.xVT1) / (1 - r.xVT1), 0, 1), r.bend);
}

/**
 * The whole test for one ceiling (mL/kg/min): arrays sampled every 0.01 min.
 * Ramp rate is chosen, as a lab would, so the line reaches the ceiling in about 10 minutes.
 */
export function testOf(ceilingPerKg) {
  const bm = TRUTH.bm;
  const max = ceilingPerKg * bm;
  const rest = TRUTH.rest * bm;
  const base = baseOf(bm);
  const R = (max - base) / (TRUTH.slope * TRUTH.rampMin); // W/min
  const p = TRUTH.phases;
  const t0 = p.rest + p.unloaded; // ramp start
  const tCross = t0 + (max - base) / (TRUTH.slope * R) + TRUTH.tau; // the lagging line meets the ceiling
  const tEnd = tCross + TRUTH.hold; // the plateau has held: stop
  const total = tEnd + p.recovery;
  const dt = 0.01;
  const n = Math.ceil(total / dt) + 1;
  const T = { t: new Float32Array(n), W: new Float32Array(n), vo2: new Float32Array(n), hr: new Float32Array(n), rer: new Float32Array(n), f: new Float32Array(n), ve: new Float32Array(n), pedal: new Uint8Array(n) };
  let y = rest;
  const hrMax = hrMaxOf();
  for (let i = 0; i < n; i++) {
    const t = i * dt;
    const ramping = t >= t0 && t < tEnd;
    const W = ramping ? R * (t - t0) : 0;
    const pedal = t >= p.rest ? 1 : 0;
    const target = t < p.rest ? rest : softMin(base + TRUTH.slope * W, max, TRUTH.plateau);
    const tau = t >= tEnd ? TRUTH.tauOff : TRUTH.tau;
    if (i) y += ((target - y) * dt) / tau;
    const x = clamp((y - rest) / (max - rest), 0, 1);
    const xr = y / max;
    const rer = rerOf(xr);
    const b = TRUTH.breath;
    const f = b.f0 + b.f1 * xr * xr;
    const vco2 = (rer * y) / 1000; // L/min
    const ve = vco2 * (b.ve + b.veTop * clamp((xr - b.xRCP) / (1 - b.xRCP), 0, 1));
    T.t[i] = t;
    T.W[i] = W;
    T.vo2[i] = y;
    T.hr[i] = TRUTH.hrRest + (hrMax - TRUTH.hrRest) * x;
    T.rer[i] = rer;
    T.f[i] = f;
    T.ve[i] = ve;
    T.pedal[i] = pedal;
  }
  let peakW = 0;
  for (const w of T.W) peakW = Math.max(peakW, w);
  return { ...T, n, dt, ceiling: ceilingPerKg, max, rest, base, R, t0, tCross, tEnd, total, peakW };
}

/** State of a test at minute t (linear between samples). */
export function sampleAt(T, t) {
  const u = clamp(t, 0, T.total) / T.dt;
  const i = Math.min(T.n - 2, Math.floor(u));
  const f = u - i;
  const lerp = (a) => a[i] + (a[i + 1] - a[i]) * f;
  const phase = t < TRUTH.phases.rest ? "rest" : t < T.t0 ? "unloaded" : t < T.tEnd ? "ramp" : "recovery";
  const vo2 = lerp(T.vo2);
  const f2 = lerp(T.f);
  const ve = lerp(T.ve);
  return { t, phase, W: lerp(T.W), vo2, perKg: vo2 / TRUTH.bm, hr: lerp(T.hr), rer: lerp(T.rer), f: f2, ve, tv: ve / f2, pedal: T.pedal[Math.round(u)] === 1 };
}

// ---------------------------------------------------------------- the rider on the bike (animation geometry)
// Sagittal [forward, up] points relative to the floor under the bottom bracket. A
// standard bike fit: knee bent about 30° at the bottom of the stroke, ball of the
// foot over the pedal axle, trunk leaning 35° forward. LOW as numbers; never printed.
export const BIKE = {
  bb: [0, 32], //       bottom bracket
  crank: 17.2, //       cm (172.5 mm)
  hip: [-20, 0], //     hip x; height set by the knee-at-bottom fit below
  kneeBottom: 30, //    ° knee bend at the bottom of the stroke
  sole: -14, //         ° sole angle (toe down) with a little ankling through the stroke
  ankling: 8,
  grip: [46, 106, 22], // handlebar grip: forward, up, half-width
  trunk: 35, //         ° forward lean
};
const RAD = Math.PI / 180;
const rot2 = ([x, z], a) => [x * Math.cos(a) - z * Math.sin(a), x * Math.sin(a) + z * Math.cos(a)];

function knee2(hip, ankle, B) {
  const reach = B.thigh + B.shank - 0.05;
  let dx = ankle[0] - hip[0];
  let dz = ankle[1] - hip[1];
  let d = Math.hypot(dx, dz);
  if (d > reach) {
    dx *= reach / d;
    dz *= reach / d;
    d = reach;
  }
  const a = (B.thigh * B.thigh - B.shank * B.shank + d * d) / (2 * d);
  const h = Math.sqrt(Math.max(0, B.thigh * B.thigh - a * a));
  const ux = dx / d;
  const uz = dz / d;
  return { knee: [hip[0] + ux * a - uz * h, hip[1] + uz * a + ux * h], ankle: [hip[0] + dx, hip[1] + dz] };
}
const footAnkle = (pedal, sole, B) => {
  const r = rot2([B.ankleX - B.ball, B.ankleZ], sole);
  return [pedal[0] + r[0], pedal[1] + r[1]];
};
/** Hip height that gives `kneeBottom` at the bottom of the stroke. */
export function saddleOf(B) {
  const pedal = [BIKE.bb[0], BIKE.bb[1] - BIKE.crank];
  const ankle = footAnkle(pedal, (BIKE.sole - BIKE.ankling) * RAD, B); // sole at the bottom of the stroke (sin = −1)
  const d = Math.sqrt(B.thigh ** 2 + B.shank ** 2 + 2 * B.thigh * B.shank * Math.cos(BIKE.kneeBottom * RAD));
  const dx = BIKE.hip[0] - ankle[0];
  return ankle[1] + Math.sqrt(d * d - dx * dx);
}
/** Pedal axle position for crank angle θ (rad, 0 = forward, π/2 = top), right crank; the left is opposite. */
export const pedalAt = (theta) => [BIKE.bb[0] + BIKE.crank * Math.cos(theta), BIKE.bb[1] + BIKE.crank * Math.sin(theta)];

/** Both legs and both arms for crank angle θ. B = mannequin body with `hipZ` from saddleOf. */
export function riderAt(theta, B) {
  const hip = [BIKE.hip[0], B.hipZ];
  const legs = {};
  for (const [k, off] of [["R", 0], ["L", Math.PI]]) {
    const th = theta + off;
    const pedal = pedalAt(th);
    // ankling: toe drops most on the down-stroke's back half, flattens over the top
    const sole = (BIKE.sole + BIKE.ankling * Math.sin(th)) * RAD;
    const s = knee2(hip, footAnkle(pedal, sole, B), B);
    legs[k] = { hip, knee: s.knee, ankle: s.ankle, sole, toe: sole, pedal };
  }
  // arms: reach from the shoulder to the grips (two-link, elbows bent down and back)
  const lean = BIKE.trunk * RAD;
  const shoulder = [hip[0] + Math.sin(lean) * (B.trunk - 1.5), hip[1] + Math.cos(lean) * (B.trunk - 1.5)];
  const fore = B.forearm + 0.3 * B.hand; // wrist to the middle of the fist
  const dx = BIKE.grip[0] - shoulder[0];
  const dz = BIKE.grip[1] - shoulder[1];
  const d = Math.min(Math.hypot(dx, dz), B.upperArm + fore - 0.1);
  const line = Math.atan2(dx, -dz); // from straight down, + forward
  const alpha = Math.acos(clamp((B.upperArm ** 2 + d * d - fore ** 2) / (2 * B.upperArm * d), -1, 1));
  const bend = Math.PI - Math.acos(clamp((B.upperArm ** 2 + fore ** 2 - d * d) / (2 * B.upperArm * fore), -1, 1));
  const arm = { shoulder: (line - alpha) / RAD, elbow: bend / RAD };
  return { legs, arms: { R: arm, L: arm }, trunk: BIKE.trunk, pelvis: B.hipZ };
}
