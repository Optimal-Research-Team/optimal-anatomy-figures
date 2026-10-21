// A2 3-D layer: the simulation behind the real-time hypothalamus (gl/).
//
// Ported from the Ongoing Care deck's <hypo-3d> (menopause-foundation-presentation
// graduation-ongoing-care/src/hypo3d-model.js @ 971c31b), which was itself a port of this figure's
// live.js. In this repo the numbers are not copied: they are imported from A2's own model.mjs, so
// the SVG and the 3-D layer can never disagree. Sources: reference/truth-pack.md §1 and "A2".
// Magnitudes marked ILLUSTRATIVE in model.mjs stay illustrative; nothing new is sourced here.
import { KNDY, kndyOf, meanDrive, wanderAt } from "../model.mjs";
export { KNDY, kndyOf, meanDrive, wanderAt };

// ---------------------------------------------------------------- the four states (A2 live.js setState)
// target e per state: [1, 0, KNDY.therapy, 0]; the receptor blocker only in state 3. The readouts
// (estrogen, cell size, hot flashes) stay in live.js, which owns the card.
export const STAGES = [
  { e: 1, blocked: false }, //            before menopause
  { e: 0, blocked: false }, //            after menopause
  { e: KNDY.therapy, blocked: false }, // hormone therapy
  { e: 0, blocked: true }, //             non-hormonal (neurokinin-receptor blocker)
];

// ---------------------------------------------------------------- seeded randomness (deterministic stills)
export function makeRng(seed = 1) {
  let a = seed >>> 0;
  return () => {
    a = (a + 0x6d2b79f5) >>> 0;
    let t = a;
    t = Math.imul(t ^ (t >>> 15), t | 1);
    t ^= t + Math.imul(t ^ (t >>> 7), t | 61);
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

// ---------------------------------------------------------------- the live simulation (A2 live.js step())
/**
 * Paths are A2's 2-D section polylines (packets travel them at A2's speeds, so arrival timing and
 * therefore the drive are identical); each also carries a z per vertex for the 3-D draw.
 */
export function measure(pts, zs) {
  const acc = [0];
  for (let i = 1; i < pts.length; i++) acc.push(acc[i - 1] + Math.hypot(pts[i][0] - pts[i - 1][0], pts[i][1] - pts[i - 1][1]));
  return { pts, zs, acc, L: acc[acc.length - 1] };
}
/** Point at arc length s along a measured path, as [x, y, z] (z interpolated the same way). */
export function along(m, s, out = [0, 0, 0]) {
  let i = 1;
  while (i < m.acc.length - 1 && m.acc[i] < s) i++;
  const t = Math.max(0, Math.min(1, (s - m.acc[i - 1]) / (m.acc[i] - m.acc[i - 1] || 1)));
  out[0] = m.pts[i - 1][0] + (m.pts[i][0] - m.pts[i - 1][0]) * t;
  out[1] = m.pts[i - 1][1] + (m.pts[i][1] - m.pts[i - 1][1]) * t;
  out[2] = m.zs ? m.zs[i - 1] + (m.zs[i] - m.zs[i - 1]) * t : 0;
  return out;
}

export class Sim {
  /**
   * @param {object} A anatomy: { kndy:[[x,y,z]], axons:[measured], down:[measured], out: measured, vessels:[[[x,y,z]...]] }
   */
  constructor(A, seed = 7) {
    this.A = A;
    this.seed = seed;
    this.onFlash = null; // (on:boolean) => void
    this.reset(1, false);
  }
  reset(target, block) {
    this.rnd01 = makeRng(this.seed);
    this.target = target;
    this.block = block;
    this.e = target;
    this.clock = 0;
    this.sinceBurst = 0;
    this.drive = 0.2;
    this.flash = -1; // seconds into the current flash, −1 when none
    this.refractory = 0;
    this.outClock = 0;
    this.packets = [];
    this.pulses = [];
    this.estro = [];
    this.glow = 0; // A2 fills every KNDy glow with 1 on a burst and decays them together
  }
  rnd(a, b) {
    return a + this.rnd01() * (b - a);
  }
  setTarget(target, block) {
    this.target = target;
    this.block = block;
  }
  burst(s) {
    this.glow = 1;
    this.A.axons.forEach((m, j) => {
      for (let p = 0; p < s.packets; p++) this.packets.push({ m, s: -p * 14 - j * 3, mn: true });
    });
    this.A.down.forEach((m) => this.packets.push({ m, s: 0, mn: false }));
  }
  spawnEstro() {
    const VS = this.A.vessels;
    const v = VS[Math.floor(this.rnd01() * VS.length)];
    const p = v[Math.floor(this.rnd01() * v.length)];
    return { x: p[0], y: p[1], z: p[2], vx: this.rnd(-14, 14), vy: this.rnd(-14, 14), vz: this.rnd(-6, 6), age: 0, life: this.rnd(6, 10), dock: -1, dt: 0, ox: 0, oy: 0, spin: this.rnd(0, 6.283), spinV: this.rnd(-0.8, 0.8) };
  }
  step(dt) {
    const A = this.A;
    this.clock += dt;
    this.e += (this.target - this.e) * (1 - Math.exp(-dt * 1.4));
    const s = kndyOf(this.e);
    // bursts
    this.sinceBurst += dt;
    if (this.sinceBurst >= s.burst) {
      this.sinceBurst = 0;
      this.burst(s);
    }
    this.glow *= Math.exp(-dt / 0.28);
    // packets travel; arrivals at the heat-loss centre add drive
    for (let i = this.packets.length - 1; i >= 0; i--) {
      const p = this.packets[i];
      p.s += dt * 150;
      if (p.s >= p.m.L) {
        if (p.mn) this.drive += KNDY.k * (this.block ? KNDY.blocked : 1);
        this.packets.splice(i, 1);
      }
    }
    this.drive *= Math.exp(-dt / KNDY.tau);
    const total = this.drive + wanderAt(this.clock);
    this.refractory -= dt;
    if (this.flash < 0 && this.refractory <= 0 && total >= 1) {
      this.flash = 0;
      this.refractory = KNDY.refractory;
      if (this.onFlash) this.onFlash(true);
    }
    if (this.flash >= 0) {
      this.flash += dt;
      this.outClock += dt;
      if (this.flash < 2.6 && this.outClock > 0.11) {
        this.outClock = 0;
        this.pulses.push({ s: 0 });
      }
      if (this.flash > 3.6) {
        this.flash = -1;
        if (this.onFlash) this.onFlash(false);
      }
    }
    for (let i = this.pulses.length - 1; i >= 0; i--) {
      this.pulses[i].s += dt * 230;
      if (this.pulses[i].s > A.out.L) this.pulses.splice(i, 1);
    }
    // estrogen: as many molecules as the level, leaving the vessels, docking on KNDy cells
    const want = Math.round(30 * this.e);
    const estro = this.estro;
    if (estro.length < want && this.rnd01() < dt * 8) estro.push(this.spawnEstro());
    const sc = s.scale;
    for (let i = estro.length - 1; i >= 0; i--) {
      const m = estro[i];
      m.age += dt;
      m.spin += m.spinV * dt;
      if (m.dock >= 0) {
        m.dt -= dt;
        // A2 logic unchanged: on release the molecule drifts on from where it was caught (the
        // renderer eases the drawn position, so there is no visible jump)
        if (m.dt <= 0) m.dock = -1;
      } else {
        m.vx += this.rnd(-40, 40) * dt;
        m.vy += this.rnd(-40, 40) * dt;
        m.vz += this.rnd(-14, 14) * dt;
        m.vx *= 1 - 0.6 * dt;
        m.vy *= 1 - 0.6 * dt;
        m.vz *= 1 - 0.9 * dt;
        m.x += m.vx * dt;
        m.y += m.vy * dt;
        m.z += m.vz * dt;
        // stay within the tissue depth near the hypothalamus (cosmetic, 3-D only)
        if (m.z > 4) m.vz -= 30 * dt;
        if (m.z < -60) m.vz += 30 * dt;
        for (let k = 0; k < A.kndy.length; k++) {
          const [kx, ky, kz] = A.kndy[k];
          // A2's docking test, in the section plane (x, y), unchanged
          if (m.dock < 0 && Math.hypot(m.x - kx, m.y - ky) < 10 * sc + 3 && this.rnd01() < 0.5) {
            m.dock = k;
            m.dt = this.rnd(1.2, 2.4);
            const a = Math.atan2(m.y - ky, m.x - kx);
            // A2's docking offset (the renderer seats it on the 3-D soma's viewer-facing side)
            m.ox = Math.cos(a) * (8.5 * sc + 2.5);
            m.oy = Math.sin(a) * (7.2 * sc + 2.5);
          }
        }
      }
      if (m.age > m.life || (estro.length > want + 2 && m.dock < 0 && this.rnd01() < dt * 2)) estro.splice(i, 1);
    }
  }
  /** Heat-loss centre's drive + wander, clipped as A2 draws it. */
  total() {
    return Math.min(1.2, this.drive + wanderAt(this.clock));
  }
  /** A2's heat glow opacity h during a flash. */
  heat() {
    const f = this.flash;
    return f < 0 ? 0 : Math.min(1, f / 0.5) * (1 - Math.max(0, (f - 2.4) / 1.2));
  }
  /** A2 toggles the 'hot' look for flash ∈ [0, 3). */
  hot() {
    return this.flash >= 0 && this.flash < 3;
  }
  /**
   * A2 renderStill(): after menopause, mid-flash with signal on the axons; before, a burst just sent.
   * Other states run the full 40 s (as A2 does).
   */
  still() {
    const target = this.target;
    const block = this.block;
    this.reset(target, block);
    for (let i = 0; i < 2400; i++) {
      this.step(1 / 60);
      if (target === 0 && this.flash > 1.0 && this.packets.length) break;
      if (target === 1 && i > 900 && this.sinceBurst > 0.45 && this.sinceBurst < 0.5) break;
    }
  }
  /** Deterministic: reset to the current target and run t seconds at 60 Hz (or start from `from`). */
  seek(t, from) {
    const target = this.target;
    const block = this.block;
    this.reset(target, block);
    if (from !== undefined) this.e = from;
    const n = Math.round(t * 60);
    for (let i = 0; i < n; i++) this.step(1 / 60);
  }
}
