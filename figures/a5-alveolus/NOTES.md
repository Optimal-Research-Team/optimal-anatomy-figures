# A5 · The air sac and the red cell

**What it is:** one air sac (alveolus) in a small bunch of neighbours, seen from a little above and wrapped in its capillary net. Hand-drawn organic SVG in the A1/A4 style. The sphere, lining and nets are projected once at build time; the page moves the cells, the gas and the breath.

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

## Verification (2026-10-11)

- No console errors.
- No sideways scroll at 390, 360 or 320, in both themes.
- `lines.mjs`: 0 (no kit lines; all hand-drawn).
- Captures: `shots/phone-{390,360,320}-{dark,light}.png`, `shots/desktop-{dark,light}.png`, `shots/desktop-max-dark.png` (all out), `shots/reduced-390-*.png`, `shots/embed.png`.

## Embed

```html
<script src="https://optimal-research-team.github.io/optimal-anatomy-figures/a5-alveolus/embed/optimal-fig-alveolus.js" defer></script>
<optimal-fig-alveolus theme="light"></optimal-fig-alveolus>
```

## Open for Peter

1. **Placement:** VO₂max page next to A4 (delivery: heart, then lung), or the Performance package.
2. **Sources to firm up with full access:** the exercise transit figure is from study-aid material (LOW). West's or Nunn's textbook figure would make it MEDIUM or HIGH.
3. **An "altitude" or "lung disease" toggle** would show the cell running out of time. It's deliberately left out (no diagnosis), but it's easy to add as a teaching state if wanted.
