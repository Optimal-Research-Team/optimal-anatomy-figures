# A5 · The air sac and the red cell

**What it is (round 2, 2026-10-12):** a cut-away block of lung tissue in isometric 3-D. The front face opens one air sac (alveolus), and we look into its bowl. Round 1 drew the sac as a sphere in a grape bunch; the parts, the model and the motion are carried over (see "Round 2" below). The geometry is projected once at build time; the page moves the cells, the gas and the breath.

**Mapping in one sentence:** pick an effort and the red cells in the traced capillary speed up to that effort's transit time. Each cell's colour is its own oxygen saturation, computed from its time beside the air (`po2At`, `satOf`). The monitor plots the traced cell against time and marks when it leaves. The shaded "to spare" band (transit − 0.25 s) shrinks from half a second at rest to a few hundredths all out.

## Parts

- **Air sac:** a glassy rose sphere with a pale specular highlight, faint pavement (type I) cells with nuclei, three type II cells with surfactant granules, one alveolar macrophage, and the mouth to the alveolar duct.
- **Duct:** a ringed alveolar duct from above; its air dots flow in and out with each breath.
- **Neighbours:** four dimmer sacs with their own nets.
- **Capillary net:** latitude rings with tortuous links, coloured blue to red. The colour change moves with the effort: it is placed where the traced capillary's cells finish loading.
- **Traced capillary:** an arteriole (left, blue) feeds one capillary across the front, which drains to a venule (right, red). Red cells move in single file, foreshortened as they round the sphere, with a dashed ring on the traced cell.
- **Gas:** oxygen as aqua dots wandering in the air (topped up through the mouth). Loading cells draw them in. Carbon dioxide as grey dots drifting out and fading.
- **Breath:** the bunch swells by 1.8–4 % with each breath, at 14 to 50 breaths a minute.
- **Monitor:** saturation against time in the capillary (0–0.8 s), with the venous start, the live traced-cell dot, the exit marker and the "to spare" band. After the exit the curve continues as a dashed ghost.

## Numbers (truth pack, "A5. The lung")

| | Rest | Walk | Run | All out |
|---|---|---|---|---|
| Cardiac output (L/min, from A4) | 4.2 | 9.2 | 15.8 | 19.9 |
| Time in capillary (s) | 0.75 | 0.47 | 0.34 | 0.29 |
| Arrives (% full) | 75 | 62 | 45 | 31 |
| Leaves (% full) | 97 | 97 | 97 | 97 |
| Time to spare (s) | 0.50 | 0.22 | 0.09 | 0.04 |

## Decisions

- **Saturation, not PO₂, on the monitor:** "% full" reads for a lay visitor. The 0.25 s loading time is sourced as a PO₂ statement; saturation reaches ≈ 97 % by then too.
- **Transit exponent 0.6** (not 1) stands for capillary recruitment. It's a modelling choice that lands all-out at 0.29 s, near the sourced ≈ 0.25 s.
- **Colours change early, honestly.** The oxygen curve is steep, so a cell is mostly red within about 0.05 s even all out. The visible change between efforts is the shrinking spare time and the redder-later net, not a dramatic colour shift. That's why the hint says to watch the time to spare.
- **8× slower by default,** with the button showing that state (`aria-pressed`). At real speed a resting cell crosses in 0.75 s and an all-out one in 0.29 s.
- **CO₂ dots** come at 0.8 per oxygen dot. That's illustrative (a resting exchange ratio) and the page claims no measured value.
- **The caption keeps limits in view:** a typical healthy adult at sea level, drawn far larger than life. Disease, altitude and some very fit athletes at their peak can leave blood short of full (not shown). And the lungs are rarely what limits VO₂max; the heart's output usually is.

## Interaction

- **Effort buttons** (44 px, radiogroup with arrow keys) and the **8× slower** toggle.
- **Idle tour:** cycles the four efforts every 8 s, and resumes 9 s after the last input.
- **Offscreen:** rendering stops out of view.
- **Reduced motion:** one still with the traced cell partway through loading. Each effort button redraws it.

## Round 2 (2026-10-12): 3-D block of lung

Peter's decision: retire flat anatomy, and A5 goes 3-D. Same camera as A1, A3, A8 and A9 (azimuth 62°, elevation 24°). The block is 560 × 180 deep × 340 tall in section px.
- **The foam:** 186 seeds packed in 3-D (Poisson-disc, at least 78 apart) give a Voronoi foam of air sacs.
  - The front, top and end faces are exact plane sections of the same foam: each sac's section is its Voronoi cell clipped by half-planes.
  - The air spaces therefore meet correctly across every edge of the block.
  - Each wall is 2 × 4.6 units; an oblique wall reads thicker, as in real sections.
  - Corners are rounded, so walls thicken where they meet.
  - Capillaries are drawn as red cells cut across, spaced along each wall's middle line (one in four is darker, venous).
- **The opened sac:** a sphere centred on the front face, so the cut is through its middle.
  - **Bowl:** the inner wall seen through the opening, projected exactly with the kit camera and clipped to the opening. That clip is exact for a concave hemisphere: any ray through the opening meets the bowl once.
  - **On the bowl:** the capillary net (blue to red; the turning point moves with effort), pavement-cell outlines, a surfactant cell, a macrophage and two pores to neighbouring sacs (pores of Kohn).
  - **Its wall in section:** mostly the traced capillary, with flattened lining nuclei and a surfactant cell bulging in.
- **The airway:** an alveolar duct rises from the sac's mouth to the top of the block, as a half-pipe cut lengthwise, with the smooth-muscle knobs of the entrance rings. It shows on the top face as a half-disc shaft.
- **Vessels:** the pulmonary arteriole (left) and venule (right) run in connective-tissue sheaths. The venule leaves through the right end, where it shows cut across.
- **Breathing:** the whole block swells about its centre (live.js now takes `DATA.pivot`).
- **live.js changes:** the net's red/blue boundary now follows the traced cell along the path (`fracOf` is path-based, not sphere-based), and fresh air enters a little faster. Everything else is unchanged: cells, oxygen, carbon dioxide, the duct air and the monitor all still draw in section coordinates on the front face.
- **Caption:** adds "packed like foam". No new numbers.
- **Anatomy check:** these are textbook-level ([K]) and carry no numbers.
  - lung parenchyma is a foam of polyhedral alveoli with septa mostly occupied by capillaries;
  - alveolar ducts carry smooth-muscle knobs at the alveolar entrances;
  - pores of Kohn link neighbouring alveoli;
  - pulmonary arterioles and venules run in connective tissue.

## Verification (2026-10-12, 3-D, local)

- `node scripts/verify.mjs a5-alveolus`: passed.
- No console errors, and no sideways scroll at 390, 360 or 320 in either theme.
- `lines.mjs`: 0.
- Reduced motion draws one still with the traced cell partway through loading.
- Captures: `shots/phone-{390,360,320}-{dark,light}.png`, `shots/desktop-{dark,light}.png` and `shots/reduced-390-*.png` (Rest), plus `shots/desktop-max-{dark,light}.png` (All out).

## Embed

```html
<script src="https://optimal-research-team.github.io/optimal-anatomy-figures/a5-alveolus/embed/optimal-fig-alveolus.js" defer></script>
<optimal-fig-alveolus theme="light"></optimal-fig-alveolus>
```

## Open for Peter

1. **Placement:** VO₂max page next to A4 (delivery: heart, then lung), or the Performance package.
2. **Sources to firm up with full access:** the exercise transit figure is from study-aid material (LOW). West's or Nunn's textbook figure would make it MEDIUM or HIGH.
3. **An "altitude" or "lung disease" toggle** would show the cell running out of time. It's deliberately left out (no diagnosis), but it's easy to add as a teaching state if wanted.
