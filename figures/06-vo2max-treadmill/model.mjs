// Fig 6 model: a treadmill VO₂max ramp on the Creator 600. The gait is Fig 4's, run at the
// speed of the moment (cadence and contact time follow speed); the test is a speed ramp at a
// 1 % grade with oxygen cost from the ACSM running equation.
//
// Pure functions, no DOM. [n] keys refer to reference/truth-pack.md §4.
// Load changes are group averages from healthy recreational runners on a lab
// treadmill, not a prediction for one runner.

export const TRUTH = {
  speedKmh: 10, //            fixed pace, ≈ recreational average 9.9 km/h [17]
  cadence0: 165, //           spm preferred at that pace, 164 ± 9 [17]
  vo0: 7.7, //                cm vertical oscillation at preferred cadence, 77 ± 12 mm [17]
  voExp: 1.84, //             VO ∝ cadence^−k, fitted to 8.7 → 7.3 cm at +10 % [10 via 30, LOW]; spring-mass gives ≈ 2
  pf: [[-10, 1.15], [0, 1.0], [10, 0.86]], // peak patellofemoral force vs step-rate change [12] Lenhart 2014; linear between
  duty: 0.39, //              stance ÷ stride time, 39 ± 4 % [17]
  landing0: 24, //            cm, heel ahead of the centre of mass at contact at preferred cadence: DERIVED estimate (0.2–0.3 m), drawn only, never printed
  range: [-10, 10], //        % step-rate change shown: the range the studies tested
};

export const clamp = (v, lo, hi) => Math.min(hi, Math.max(lo, v));
export const pctOf = (cadence) => (cadence / TRUTH.cadence0 - 1) * 100;
export const cadenceOf = (pct) => TRUTH.cadence0 * (1 + pct / 100);
/** Belt speed in cm/s. */
export const beltOf = () => (TRUTH.speedKmh * 100) / 3.6;

/** Step length (m): one footfall to the next, at the fixed pace. */
export const stepOf = (cadence) => TRUTH.speedKmh / 3.6 / (cadence / 60);
/** Vertical oscillation of the centre of mass, cm peak to peak. */
export const voOf = (cadence) => TRUTH.vo0 * (cadence / TRUTH.cadence0) ** -TRUTH.voExp;
/** Vertical ratio (%): oscillation ÷ step length, as Garmin and the Creator define it. */
export const ratioOf = (cadence) => (voOf(cadence) / (stepOf(cadence) * 100)) * 100;
/** Peak patellofemoral force relative to preferred cadence (Lenhart 2014), linear between the tested rates. */
export function kneeOf(cadence) {
  const p = clamp(pctOf(cadence), TRUTH.range[0], TRUTH.range[1]);
  const [[x0, y0], [x1, y1], [x2, y2]] = TRUTH.pf;
  return p <= 0 ? y0 + ((y1 - y0) * (p - x0)) / (x1 - x0) : y1 + ((y2 - y1) * (p - x1)) / (x2 - x1);
}
/** How far ahead of the centre of mass the heel lands (cm), scaled with step length. Drawn, not printed. */
export const landingOf = (cadence) => (TRUTH.landing0 * stepOf(cadence)) / stepOf(TRUTH.cadence0);

// ---------------------------------------------------------------- the gait cycle (animation geometry)
// Stride phase φ ∈ [0, 1): right heel contact at 0, left at ½. One foot is on the
// belt for `duty` of the stride; while it is, it moves back with the belt at the
// true belt speed, so the feet never slide. The body's centre of mass (from
// standard segment masses) bounces by the true oscillation, lowest at mid-stance;
// the pelvis is placed under it, and both knees are solved from where the hip
// and the foot are (inverse kinematics), so knee bend follows from bounce,
// landing and belt speed rather than being drawn in. The swing foot follows a
// textbook running path [24][26]. None of the angles is printed: they are
// LOW as numbers and only pose the mannequin.
export const GAIT = {
  kneeIC: 18, //   ° knee bend at contact at preferred cadence (textbook 15–20 [24]); sets the pelvis height
  kneeTO: 20, //   ° knee bend at toe-off (textbook ≈ 20 [24]); sets how far the heel rolls up
  footIC: 10, //   ° sole angle at contact (toe up), scaled with step: foot inclination falls with step rate [10]
  flat: 0.14, //   share of stance from heel strike to a flat foot
  heel: 0.55, //   share of stance when the heel starts to lift
  trunk: 7, //     ° forward lean of the trunk
  arm: 24, //      ° upper-arm swing either side of 4° forward, at preferred cadence
  elbow: 88, //    ° elbow bend
  // swing: the ankle's path relative to the hip, [share of swing, forward (× step ratio), height above the belt]
  swing: [[0.1, -43, 19.5], [0.2, -46, 26], [0.4, -38, 40], [0.6, -4, 27], [0.78, 19, 14]],
};
// Segment masses (share of body mass) and centre-of-mass positions along each
// segment from its proximal joint: Winter 2009, Table 4.1 (after Dempster 1955).
export const MASS = {
  trunk: [0.578, 0.66], // trunk, head and neck: hip line → shoulder line
  thigh: [0.1, 0.433],
  shank: [0.0465, 0.433],
  foot: [0.0145, 0.5],
  upper: [0.028, 0.436],
  fore: [0.016, 0.43],
  hand: [0.006, 0.506],
};

const RAD = Math.PI / 180;
const ease = (u) => (1 - Math.cos(Math.PI * clamp(u, 0, 1))) / 2;
const rot2 = ([x, z], a) => [x * Math.cos(a) - z * Math.sin(a), x * Math.sin(a) + z * Math.cos(a)];
const wrap = (x) => ((x % 1) + 1) % 1;

/** Centre-of-mass height offset (cm) from its height at heel contact, through one step (two per stride). */
export function bounceAt(phi, cadence) {
  const s = wrap(phi * 2); // share of the step since contact
  const shape = (u) => -Math.cos(2 * Math.PI * (u - TRUTH.duty));
  return (voOf(cadence) / 2) * (shape(s) - shape(0));
}

/** The foot on the belt, τ = share of stance: pivot, pivot's place on the foot, sole angle (rad). x is relative to the pelvis. */
function stanceFoot(tau, cadence, B, footTO) {
  const scale = stepOf(cadence) / stepOf(TRUTH.cadence0);
  const tc = (TRUTH.duty * 120) / cadence;
  const travel = beltOf() * tc * tau;
  const L = landingOf(cadence);
  if (tau < GAIT.heel) {
    const a = GAIT.footIC * scale * RAD * (1 - ease(tau / GAIT.flat));
    return { pivot: [L - travel, 0], local: [0, 0], angle: a };
  }
  const a = -footTO * RAD * ease((tau - GAIT.heel) / (1 - GAIT.heel));
  return { pivot: [L + B.ball - travel, 0], local: [B.ball, 0], angle: a };
}
/** A point of the foot (foot frame: heel at 0, x toward the toe, z up) placed by a foot pose. */
const footPoint = (pose, p) => {
  const r = rot2([p[0] - pose.local[0], p[1] - pose.local[1]], pose.angle);
  return [pose.pivot[0] + r[0], pose.pivot[1] + r[1]];
};

/** Two-link leg: knee position (forward of the hip–ankle line) and knee bend in degrees. */
function solveKnee(hip, ankle, B) {
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
  const knee = [hip[0] + ux * a - uz * h, hip[1] + uz * a + ux * h];
  const cosK = (B.thigh * B.thigh + B.shank * B.shank - d * d) / (2 * B.thigh * B.shank);
  return { knee, ankle: [hip[0] + dx, hip[1] + dz], bend: 180 - Math.acos(clamp(cosK, -1, 1)) / RAD };
}
const reachAt = (B, bend) => Math.sqrt(B.thigh ** 2 + B.shank ** 2 + 2 * B.thigh * B.shank * Math.cos(bend * RAD));

/** Hip height above the belt at heel contact: the leg bent `kneeIC` reaching the preferred landing. */
export function pelvisOf(B) {
  const pose = stanceFoot(0, TRUTH.cadence0, B, 0);
  const ankle = footPoint(pose, [B.ankleX, B.ankleZ]);
  const d = reachAt(B, GAIT.kneeIC);
  return ankle[1] + Math.sqrt(d * d - ankle[0] * ankle[0]);
}

// monotone cubic through [x, y] keys (Fritsch–Carlson): no overshoot between keyframes
function monotone(keys, x) {
  const n = keys.length;
  if (x <= keys[0][0]) return keys[0][1];
  if (x >= keys[n - 1][0]) return keys[n - 1][1];
  const dx = [];
  const m = [];
  for (let i = 0; i < n - 1; i++) {
    dx.push(keys[i + 1][0] - keys[i][0]);
    m.push((keys[i + 1][1] - keys[i][1]) / dx[i]);
  }
  const t = [m[0]];
  for (let i = 1; i < n - 1; i++) t.push(m[i - 1] * m[i] <= 0 ? 0 : (3 * (dx[i - 1] + dx[i])) / ((2 * dx[i] + dx[i - 1]) / m[i - 1] + (dx[i] + 2 * dx[i - 1]) / m[i]));
  t.push(m[n - 2]);
  let i = 0;
  while (x > keys[i + 1][0]) i++;
  const h = dx[i];
  const u = (x - keys[i][0]) / h;
  const u2 = u * u;
  const u3 = u2 * u;
  return (2 * u3 - 3 * u2 + 1) * keys[i][1] + (u3 - 2 * u2 + u) * h * t[i] + (-2 * u3 + 3 * u2) * keys[i + 1][1] + (u3 - u2) * h * t[i + 1];
}

/** Per-cadence constants: how far the heel rolls up at toe-off, and the contact and toe-off foot poses. */
const CACHE = new Map();
function cycleOf(cadence, B) {
  const key = `${Math.round(cadence * 20)}|${B.pelvis}|${TRUTH.speedKmh.toFixed(2)}`;
  if (CACHE.has(key)) return CACHE.get(key);
  // roll the heel up until the knee at toe-off is bent `kneeTO` (or the leg can just reach)
  const hipTO = B.pelvis + bounceAt(TRUTH.duty, cadence);
  const bendAt = (deg) => {
    const ankle = footPoint(stanceFoot(1, cadence, B, deg), [B.ankleX, B.ankleZ]);
    return { ankle, d: Math.hypot(ankle[0], ankle[1] - hipTO) };
  };
  const want = reachAt(B, GAIT.kneeTO);
  let lo = 15;
  let hi = 80;
  for (let i = 0; i < 24; i++) {
    const mid = (lo + hi) / 2;
    if (bendAt(mid).d > want) lo = mid;
    else hi = mid;
  }
  const footTO = (lo + hi) / 2;
  const on = stanceFoot(0, cadence, B, footTO);
  const off = stanceFoot(1, cadence, B, footTO);
  const out = {
    footTO,
    on: { ankle: footPoint(on, [B.ankleX, B.ankleZ]), sole: on.angle },
    off: { ankle: footPoint(off, [B.ankleX, B.ankleZ]), sole: off.angle },
  };
  if (CACHE.size > 400) CACHE.clear();
  CACHE.set(key, out);
  return out;
}

/** Sagittal leg at its own phase p (0 = this foot's heel contact), hip at `hip`. */
function legAt(p, cadence, B, hip) {
  const D = TRUTH.duty;
  const cyc = cycleOf(cadence, B);
  if (p < D) {
    const tau = p / D;
    const pose = stanceFoot(tau, cadence, B, cyc.footTO);
    const s = solveKnee(hip, footPoint(pose, [B.ankleX, B.ankleZ]), B);
    // the toes stay flat on the belt while the heel rolls up over the ball
    return { stance: true, tau, hip, knee: s.knee, ankle: s.ankle, sole: pose.angle, toe: tau < GAIT.heel ? pose.angle : 0, bend: s.bend };
  }
  // swing: the ankle follows a running path from toe-off to the next contact; the knee is solved
  const sigma = (p - D) / (1 - D);
  const k = stepOf(cadence) / stepOf(TRUTH.cadence0);
  const keysX = [[0, cyc.off.ankle[0]], ...GAIT.swing.map(([u, x]) => [u, x * k]), [0.9, cyc.on.ankle[0] + 3 * k], [1, cyc.on.ankle[0]]];
  const keysZ = [[0, cyc.off.ankle[1]], ...GAIT.swing.map(([u, , z]) => [u, z]), [0.9, cyc.on.ankle[1] + 2.5], [1, cyc.on.ankle[1]]];
  const target = [hip[0] + monotone(keysX, sigma), monotone(keysZ, sigma)];
  const s = solveKnee(hip, target, B);
  // sole: from toe-off, through a foot hanging at right angles to the shank, to the contact angle
  const shank = Math.atan2(s.ankle[0] - s.knee[0], s.knee[1] - s.ankle[1]);
  const shankOf = (ankle) => {
    const e = solveKnee(hip, ankle, B);
    return Math.atan2(e.ankle[0] - e.knee[0], e.knee[1] - e.ankle[1]);
  };
  const plantar = monotone([[0, shankOf(cyc.off.ankle) - cyc.off.sole], [0.3, 22 * RAD], [0.7, 0], [1, shankOf(cyc.on.ankle) - cyc.on.sole]], sigma);
  const sole = shank - plantar;
  // the toes peel off the belt last: they stay down until the ball of the foot has lifted clear
  const ballZ = s.ankle[1] - (Math.sin(sole) * B.ankleX + Math.cos(sole) * B.ankleZ) + Math.sin(sole) * B.ball;
  const toe = Math.max(sole, -Math.asin(clamp(ballZ / (B.foot - B.ball), -1, 1)));
  return { stance: false, tau: sigma, hip, knee: s.knee, ankle: s.ankle, sole, toe, bend: s.bend };
}

/** Sagittal centre-of-mass height of a pose (cm above the belt), from the segment masses above. */
function comOf(pose, B) {
  let z = 0;
  const lean = pose.trunk * RAD;
  const shoulderZ = pose.pelvis + B.trunk * Math.cos(lean);
  z += MASS.trunk[0] * (pose.pelvis + MASS.trunk[1] * B.trunk * Math.cos(lean));
  for (const leg of [pose.right, pose.left]) {
    z += MASS.thigh[0] * (leg.hip[1] + MASS.thigh[1] * (leg.knee[1] - leg.hip[1]));
    z += MASS.shank[0] * (leg.knee[1] + MASS.shank[1] * (leg.ankle[1] - leg.knee[1]));
    z += MASS.foot[0] * (leg.ankle[1] - B.ankleZ * 0.5 + Math.sin(leg.sole) * (B.foot * 0.5 - B.ankleX));
  }
  for (const a of [pose.armR, pose.armL]) {
    const a1 = a * RAD;
    const a2 = (a + pose.elbow) * RAD;
    const elbow = shoulderZ - Math.cos(a1) * B.upperArm;
    const wrist = elbow - Math.cos(a2) * B.forearm;
    z += MASS.upper[0] * (shoulderZ - MASS.upper[1] * Math.cos(a1) * B.upperArm);
    z += MASS.fore[0] * (elbow - MASS.fore[1] * Math.cos(a2) * B.forearm);
    z += MASS.hand[0] * (wrist - MASS.hand[1] * Math.cos(a2) * B.hand * 0.55);
  }
  return z;
}

function rawPose(phi, cadence, B, z) {
  const hip = [0, z];
  const legs = [0, 0.5].map((o) => legAt(wrap(phi - o), cadence, B, hip));
  const swing = GAIT.arm * Math.sqrt(stepOf(cadence) / stepOf(TRUTH.cadence0));
  const c = Math.cos(2 * Math.PI * phi);
  return {
    pelvis: z,
    right: legs[0],
    left: legs[1],
    // upper-arm angle from vertical (+ forward): each arm swings with the opposite leg
    armR: 4 - swing * c,
    armL: 4 + swing * c,
    elbow: GAIT.elbow,
    trunk: GAIT.trunk,
  };
}

/**
 * The whole pose at stride phase φ: pelvis height, both legs (sagittal [forward, up] relative to
 * the point on the belt under the pelvis), arm swing, trunk lean and the centre of mass.
 * B is the mannequin's proportions (shared/mannequin.mjs) with `pelvis` set by pelvisOf(B).
 */
export function poseAt(phi, cadence, B) {
  const com0 = comOf(rawPose(0, cadence, B, B.pelvis), B);
  const target = com0 + bounceAt(phi, cadence);
  let z = B.pelvis + bounceAt(phi, cadence);
  let pose = rawPose(phi, cadence, B, z);
  for (let i = 0; i < 4; i++) {
    z += target - comOf(pose, B);
    pose = rawPose(phi, cadence, B, z);
  }
  pose.com = target;
  return pose;
}

/** Patellofemoral force through one foot's stance, relative to the preferred-cadence peak: zero in swing. */
export function kneeLoadAt(leg, cadence) {
  if (!leg.stance) return 0;
  // a smooth single hump over stance, peaking near peak knee bend (≈ 44 % of stance)
  const shape = Math.sin(Math.PI * leg.tau ** 0.85) ** 2;
  return kneeOf(cadence) * shape;
}

// ---------------------------------------------------------------- speed sets cadence and contact time
// Cadence rose 169 → 178 spm from 2.68 → 3.83 m/s on a treadmill [18] HIGH (straight line between).
// Duty factor falls as speed rises: 0.39 at 2.75 m/s [17]; −0.06 per m/s is a LOW shape, kept 0.30–0.46.
export const cadenceAt = (kmh) => 169 + ((178 - 169) / (3.83 - 2.68)) * (kmh / 3.6 - 2.68);
export function setSpeed(kmh) {
  TRUTH.speedKmh = kmh;
  TRUTH.duty = clamp(0.39 - 0.06 * (kmh / 3.6 - 2.75), 0.3, 0.46);
  TRUTH.cadence0 = cadenceAt(kmh);
}

// ---------------------------------------------------------------- the treadmill ramp test
export const RUN = {
  bm: 75, age: 45,
  grade: 0.01, //          1 % incline, a common treadmill setting
  acsm: [0.2, 0.9, 3.5], // VO₂ = 0.2 S + 0.9 S G + 3.5 mL/kg/min, S in m/min [20] MEDIUM-HIGH
  startShare: 0.65, //     warm-up and ramp start where the cost is ≈ 65 % of the ceiling (model choice)
  rampMin: 10, //          ramp sized to reach the ceiling in about 10 min [1][3]
  tau: 0.6, tauOff: 1.0, // min, LOW shape only
  hrRest: 65, hrMax: [208, 0.7], // [16] HIGH for the maximum
  phases: { warm: 3, recovery: 3 },
  plateau: 0.6, hold: 1.0, // mL/kg/min softness of the ceiling; minutes on it before stopping
  breath: { f0: 14, f1: 36, exhale: 0.55 }, // LOW, drives the analyser light only
  ceilings: [35, 45, 55],
};
const softMin = (a, b, k) => -k * Math.log(Math.exp(-a / k) + Math.exp(-b / k));
/** Oxygen cost of running at km/h on the test grade (mL/kg/min). */
export const costOf = (kmh) => RUN.acsm[0] * (kmh * 1000 / 60) + RUN.acsm[1] * (kmh * 1000 / 60) * RUN.grade + RUN.acsm[2];
export const speedFor = (cost) => (cost - RUN.acsm[2]) / (RUN.acsm[0] + RUN.acsm[1] * RUN.grade) * 60 / 1000;
export function runTestOf(ceiling) {
  const s0 = speedFor(RUN.startShare * ceiling);
  const s1 = speedFor(ceiling);
  const R = (s1 - s0) / RUN.rampMin; // km/h per min
  const t0 = RUN.phases.warm;
  const tCross = t0 + RUN.rampMin + RUN.tau;
  const tEnd = tCross + RUN.hold;
  const total = tEnd + RUN.phases.recovery;
  const dt = 0.01;
  const n = Math.ceil(total / dt) + 1;
  const T = { t: new Float32Array(n), v: new Float32Array(n), vo2: new Float32Array(n), hr: new Float32Array(n), f: new Float32Array(n) };
  const hrMax = RUN.hrMax[0] - RUN.hrMax[1] * RUN.age;
  const rest = 3.5;
  let y = costOf(s0) * 0.6;
  for (let i = 0; i < n; i++) {
    const t = i * dt;
    const v = t < t0 ? s0 : t < tEnd ? s0 + R * (t - t0) : s0;
    const target = softMin(costOf(v), ceiling, RUN.plateau);
    if (i) y += ((target - y) * dt) / (t >= tEnd ? RUN.tauOff : RUN.tau);
    const x = clamp((y - rest) / (ceiling - rest), 0, 1);
    T.t[i] = t;
    T.v[i] = v;
    T.vo2[i] = y;
    T.hr[i] = RUN.hrRest + (hrMax - RUN.hrRest) * x;
    T.f[i] = RUN.breath.f0 + RUN.breath.f1 * (y / ceiling) ** 2;
  }
  let peak = 0;
  for (const v of T.v) peak = Math.max(peak, v);
  return { ...T, n, dt, ceiling, s0, s1, R, t0, tCross, tEnd, total, peak };
}
export function runSampleAt(T, t) {
  const u = clamp(t, 0, T.total) / T.dt;
  const i = Math.min(T.n - 2, Math.floor(u));
  const f = u - i;
  const lerp = (a) => a[i] + (a[i + 1] - a[i]) * f;
  const phase = t < T.t0 ? "warm" : t < T.tEnd ? "ramp" : "recovery";
  return { t, phase, v: lerp(T.v), vo2: lerp(T.vo2), hr: lerp(T.hr), f: lerp(T.f) };
}
