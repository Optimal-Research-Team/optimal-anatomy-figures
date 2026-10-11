# A4 · The beating heart

**What it is:** the heart cut open from the front, beating. Hand-drawn organic SVG in A1's style, redrawn every frame from a small beat model through one deformation field:
- the chambers squeeze toward their middles;
- the walls thicken;
- the valve plane is pulled toward the apex as the ventricles empty;
- valves snap open and shut;
- blood moves only through open valves;
- an ECG strip runs underneath, timed to the beat.

**Mapping in one sentence:** pick a heart rate, and the beat shortens mostly by losing filling time while each beat empties more fully. The readout multiplies the two: output per minute = beats × millilitres per beat, from 4.2 L/min at rest to about 20 L/min all out (the delivery side of VO₂max, Fig 5).

## Parts

- **Chambers:** right atrium and ventricle (blue pools), left atrium and the thick-walled left ventricle (red pools), and the septum between them.
- **Valves and supports:** tricuspid and mitral leaflets with chordae to three papillary muscles; pulmonary and aortic cusps.
- **Vessels:** superior and inferior venae cavae, pulmonary trunk with both pulmonary arteries, aorta with its arch and three branches, descending aorta behind, two pulmonary veins.
- **Moving parts:** blood cells, a soft beat glow, and the ECG strip.

## Numbers (truth pack, "A4: the heart")

| | Rest 60 | Walk 100 | Run 140 | All out 176 |
|---|---|---|---|---|
| Beat (s) | 1.00 | 0.60 | 0.43 | 0.34 |
| Squeeze (s) | 0.34 | 0.26 | 0.22 | 0.20 |
| Per beat (ml) | 70 | 92 | 113 | 113 |
| Per minute (L) | 4.2 | 9.2 | 15.8 | 19.9 |

## Decisions

- **Squeeze time** = 0.3 s × √(beat ÷ 0.8 s): 0.3 s at 75 bpm (sourced), shortening much less than filling time does (sourced as a direction). The square-root shape itself is a modelling choice.
- **Per-beat volume** rises from 70 to 113 ml by about 140 bpm, inside the sourced "toward 120 ml in strenuous exercise", then holds.
- **Top rate** 176 = 208 − 0.7 × 45 (Tanaka), the same modelled person as Figs 5 and 6.
- **Textbook colours,** and the caption says venous blood is really dark red.
- **The valve plane moving toward the apex** is real long-axis motion, and the reason the atria fill while the ventricles empty. It's drawn as 15 px at full emptying.
- **Visual choices:** a rose muscle gradient, a soft glow with each squeeze, a Slow button (¼ speed) for watching the valves.

## Verification (2026-10-11)

- No console errors.
- No sideways scroll at 390, 360 or 320, in both themes.
- Reduced motion shows one still at mid-ejection: outflow valves open, inflow valves shut.

## Open for Peter

1. **Placement:** VO₂max page (next to Fig 5), the Performance package, or both?
2. **Rhythm:** add a "trained athlete" option (resting rate 45–50, a bigger beat)? It would need a source for athletes' stroke volume.
