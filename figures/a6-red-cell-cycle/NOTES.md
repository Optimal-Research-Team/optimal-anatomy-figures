# A6 · The red cell's 120 days

**What it is:** the red cell's whole life as one loop, as an inset for Fig 3. Bone marrow on the left, the spleen on the right, and an arc across the top that *is* the cell's life: position = age, 0 to 120 days, with ticks at 30, 60, 90 and 120. Iron comes back underneath on transferrin. Hand-drawn organic SVG in the A-series style, driven by **Fig 3's model** (`simulate("iv")`), so its ferritin and haemoglobin match Fig 3 exactly.

**Mapping in one sentence:** every drawn cell is one normal day's output (16.1 mg of iron at Hb 132), placed on the arc by its age. Untreated, the marrow makes 0.8 of that (12.8 mg/day recycled at Hb 105), so the arc holds sparser, smaller, paler cells. After IV iron, the macrophage's ferritin granules fill within days, while fuller cells crowd onto the arc from the marrow end at exactly the rate the model's haemoglobin rises: two clocks.

## Parts

- **Marrow:** cortical bone shell, trabecular lattice, fat cells, two erythroblastic islands (a nurse macrophage ringed by erythroblasts from early blue to late red), and a sinusoid that carries reticulocytes out.
- **Arc:** a vessel band with age ticks. Cells sit in three lanes:
  - reticulocytes (under 2 days): purple-tinted, with reticulum dots;
  - cells made short of iron: pale, smaller, wide central pallor;
  - cells made with enough iron: full red;
  - old cells (over 108 days): darker and rounder.
  Cells past 120 days slide into the macrophage's phagosome.
- **Spleen:** capsule, red-pulp cords, white-pulp nodules with central arterioles, and a large macrophage (nucleus, phagosome, ferritin granules: 5 at ferritin 8 µg/L, 40 near the IV peak).
- **Return:** transferrin dots under the arc, about one per 1.5 mg of iron heading to the marrow.
- **IV dose:** a cannula appears at day 0. Amber IV complex circulates and disappears as macrophages take it up (Fig 3's 27 h plasma half-life).
- **Monitor:** ferritin (0–500 µg/L) and haemoglobin (100–135 g/L) strips over dose → 8 weeks, with a cursor. The traces are drawn up to the cursor, with dashed ghosts beyond.

## Numbers

| | Untreated | IV, day 7 | IV, day 22 | IV, day 56 |
|---|---|---|---|---|
| Ferritin (µg/L, Fig 3) | 8 | ≈ 467 (peak ≈ 475, day 5.5) | ≈ 310 | ≈ 152 |
| Haemoglobin (g/L, Fig 3) | 105 | ≈ 108 | ≈ 121 | ≈ 130 |
| Iron into new cells (mg/day) | 12.8 | rising | ≈ 23 | ≈ 15 |

## Decisions

- **Cohort iron = recycled iron (c0 = Hb₀ iron ÷ 120) + the model's net rise in circulating red-cell iron + the model's 0.5 mg/day loss.** So the arc's contents and the Hb readout can't disagree.
- **"Pale" is a drawing threshold:** cells made at under 0.9 of normal iron. Iron-deficient cells are smaller and paler (microcytic, hypochromic); the threshold itself isn't a lab cut-off.
- **"Two million a second"** (caption) is a textbook figure, marked LOW in the truth pack until checked.
- **The arc is an age axis, not a route.** Real cells circulate every minute. The caption says so, and that one drawn cell stands for a day's output.
- **The ferritin caveat after IV iron** (not a reliable store measure for weeks) is in the caption, matching Fig 3.

## Interaction

- **Untreated / IV iron** (radiogroup, arrow keys, 44 px). IV runs from 4 days before the dose to day 56 at two days a second, holds 3 s, then repeats.
- **Idle tour:** 8 s untreated, then one IV run, and so on.
- **Offscreen:** rendering stops out of view.
- **Reduced motion:** untreated shows a steady still; IV shows day 21.

## Verification (2026-10-11)

- No console errors.
- No sideways scroll at 390, 360 or 320, in both themes.
- `lines.mjs`: 0 (no kit lines; all hand-drawn).
- Captures: `shots/phone-{390,360,320}-{dark,light}.png` (IV, about day 14), `shots/desktop-{dark,light}.png` (untreated), `shots/desktop-iv-{dark,light}.png` (about day 22), `shots/reduced-390-*.png` (IV day 21), `shots/embed.png`.

## Embed

```html
<script src="https://optimal-research-team.github.io/optimal-anatomy-figures/a6-red-cell-cycle/embed/optimal-fig-red-cell-cycle.js" defer></script>
<optimal-fig-red-cell-cycle theme="light"></optimal-fig-red-cell-cycle>
```

## Open for Peter

1. **Placement:** under Fig 3, as "why your ferritin is high but your haemoglobin is still climbing".
2. **Add "Daily pills"?** Fig 3's model has it. Iron would come in from the gut onto transferrin instead of through the macrophage, and the arc would fill more slowly.
3. **Liver macrophages** take up much of an IV dose too; only the spleen is drawn. The caption says "spleen and liver".

## Round 3 (2026-10-12): everything cut in half, back halves round (the A7 approach)

Peter's decision: every A-piece goes 3-D, done the A7 way. The whole loop lies in one cut plane, placed with `planeMatrix` in the series camera (azimuth 62°, elevation 24°). Behind the cut, everything keeps its round back half (drawn once at mount, `shared/round-back.js`):
- **The bone** is cut lengthwise to show its marrow, with the islands, trabeculae and sinusoid on the cut face. Its back half is rounded cortical bone.
- **The spleen** is cut open on the macrophage, with a rounded back half.
- **The vessel arc** (the 120 days) and **the transferrin return** are half-pipes. Their insides on the cut face are now solid (`--a6-arc-in`, `--a6-ret-in`) rather than see-through, because you look into an open half-pipe, not through it.
- **The IV line** is shorter (it only shows around the dose), so the frame isn't padded for it.
- **The monitor** sits flat underneath, placed after the camera fit. The view is 600 × 650.
- `live.js` is unchanged apart from the static back halves. Cells, ferritin granules, transferrin and the monitor all draw in section coordinates.

## Verification (2026-10-12, round 3, local)

- `node scripts/verify.mjs a6-red-cell-cycle`: passed.
- No console errors, and no sideways scroll at 390, 360 or 320 in either theme.
- `lines.mjs`: 0.
- Reduced motion draws a still.
- Captures: `shots/phone-{390,360,320}-{dark,light}.png`, `shots/desktop-{dark,light}.png` and `shots/reduced-390-*.png` (Untreated), plus `shots/desktop-iv-{dark,light}.png` (IV iron, about day 5).
