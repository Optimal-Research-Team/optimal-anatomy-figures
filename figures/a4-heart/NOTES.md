# A4 · The beating heart

**What it is:** the heart cut open front to back and seen in isometric 3-D (round 3, 2026-10-12), beating. Hand-drawn organic SVG in A1's style, redrawn every frame from a small beat model through one deformation field:
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

## Round 2 (2026-10-11, Peter: "do the heart after")

This brings the finish up to A2/A5/A6. The model, timing and numbers are unchanged.
- **Vessels:** every vessel gets a sheen on the side facing the light, and its open ends are cut, showing the lumen (inferior vena cava, both pulmonary arteries, the arch's three branches, the pulmonary veins, the descending aorta). The square-cut ends are gone.
- **Venae cavae and descending aorta:** the superior vena cava now runs behind the heart muscle and opens into the right atrium, instead of sitting on top of it. The descending aorta is drawn live behind the heart, down to a cut end.
- **Muscle fibres:** three rings wrap the left ventricle and two the right ventricle's free wall. They squeeze with the beat through the same deformation field, clipped to the moving outline.
- **Cells:** tumbling biconcave discs with a pale centre, instead of dots.
- **Kept:** the textbook convention of the pulmonary trunk crossing in front of the ascending aorta (a schematic layout, as in most teaching diagrams).

## Verification (2026-10-11)

- No console errors.
- No sideways scroll at 390, 360 or 320, in both themes.
- Reduced motion shows one still at mid-ejection: outflow valves open, inflow valves shut.
- Round 2 recaptured: `shots/desktop-{dark,light}.png`, `shots/phone-{390,360,320}-{dark,light}.png`, `shots/reduced-390-*.png`, `shots/embed.png`, all with no sideways scroll and a clean console.

## Open for Peter

1. **Placement:** VO₂max page (next to Fig 5), the Performance package, or both?
2. **Rhythm:** add a "trained athlete" option (resting rate 45–50, a bigger beat)? It would need a source for athletes' stroke volume.

## Round 3 (2026-10-12): cut in half, back half round (the A7 approach)

Peter's decision: every A-piece goes 3-D. Peter approved the A7 approach ("this is way better, just do it like this"): the organ cut in half, with the far half kept round.
- **Cut face:** the original front section, placed with `planeMatrix` in the series camera (azimuth 62°, elevation 24°). The chambers, valves, chordae, cells and glow all still draw in section coordinates.
- **Back half (live, `drawBack()` with `shared/round-back.js`):**
  - **Heart wall:** each frame, the heart's beating outline is rolled back over a quarter-round of 0.9 × its distance from the centre, so a round outline becomes a hemisphere. Facing facets are shaded between the muscle tones, so the back wall beats with the cut face.
  - **Great vessels:** each becomes a half-tube behind its cut.
  - **Cut ends** (venae cavae, pulmonary vessels, arch branches, descending aorta) show as half-rings: the wall, with the blood inside.
- **Vessels on the cut face are now cut open:** a pale wall band each side and blood down the middle, in the chamber pools' colours. The round-1 sheen and the flat end ellipses are gone, because they showed whole tubes.
- **Frame:** fitted to the heart and its vessels plus the back half's reach. The ECG sits flat underneath, and the view is 600 × 666.
- **Cost:** facets are merged per object and per tone (21 tones), so a frame is about 100 paths.

**Peter: "the heart animation looks not great."** Frame-by-frame review found three faults, all fixed:
1. **The ascending aorta was drawn across the left atrium.** Once everything is cut open in one plane, that read as a tube lying on top of the chamber. The left atrium now sits clear (x ≥ 372), and the aorta rises from the left ventricle in front of it, between the atria.
2. **The aortic arch had a hard seam where it meets the descending aorta.** Vessels are now filled without a line across their ends, and only their two side edges are stroked, so the arch runs into the descending aorta as one tube.
3. **The back half followed every notch of the cut outline,** which put a lump beside the left atrium. It now follows the outline averaged over ±3 samples. (A convex hull was tried first, but it filled the notch between the great vessels with a flat flap.)

Checked for flicker: the back half is stable frame to frame (slowed contact sheet).

## Verification (2026-10-12, round 3, local)

- `node scripts/verify.mjs a4-heart`: passed.
- No console errors, and no sideways scroll at 390, 360 or 320 in either theme.
- `lines.mjs`: 0.
- Reduced motion draws one still mid-ejection.
- Captures: `shots/phone-{390,360,320}-{dark,light}.png`, `shots/desktop-{dark,light}.png` and `shots/reduced-390-*.png` (Rest), plus `shots/desktop-max-{dark,light}.png` (All out).
