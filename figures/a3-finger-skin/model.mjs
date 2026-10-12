// A3 model: the clock for one hot flash seen in the finger's skin. The response itself comes from
// Fig 1's flashAt(t) (inlined alongside): vasodilation `on` (0–1) opens the arteriovenous shunts,
// and `skin` is the finger skin-temperature rise (+2.7 °C peak, raised ≈ 31 min) [Meldrum 1979;
// Kronenberg 1994; Low 2008], truth pack §1.
export const CLOCK = {
  start: -1, //    minutes shown before the flash
  slowUntil: 7, // minutes played slowly (the flash itself)
  slow: 0.35, //   minutes per second while it happens
  fast: 2.5, //    minutes per second for the long cool-down
  end: 30, //      last minute shown
  hold: 2, //      seconds held at the end before it repeats
};
/** Minutes into the flash after s seconds of playback. */
export function minuteAt(s) {
  const s1 = (CLOCK.slowUntil - CLOCK.start) / CLOCK.slow;
  if (s <= s1) return CLOCK.start + s * CLOCK.slow;
  return Math.min(CLOCK.end, CLOCK.slowUntil + (s - s1) * CLOCK.fast);
}
/** Seconds of playback for one loop, including the hold. */
export const loopSeconds = () => (CLOCK.slowUntil - CLOCK.start) / CLOCK.slow + (CLOCK.end - CLOCK.slowUntil) / CLOCK.fast + CLOCK.hold;
