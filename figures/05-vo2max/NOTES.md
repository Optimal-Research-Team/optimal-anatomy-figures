# Fig 5 · The ramp and the mask (round 2)

**Round 2 (Peter, 2026-10-11):** "just a rider with a wireless mask with no tube and an assessor using an iPad"; Optimal's equipment is the VO2 Master (a mask plus an assessor with a tablet). The hose, the cart and the WebGL breath layer are gone, and so is RER: the mask unit doesn't measure CO₂ (truth pack §5, sources 27–30).

**Size:** Figure (upper end). 20 recorded solids for the bike, the page-drawn rider (about 40 parts plus mask, analyser and chest strap), and the assessor (about 34 parts and the tablet, drawn once at build time by `shared/assessor.mjs`). SVG only.

**Mapping in one sentence:** the mannequin pedals a generic lab bike whose magnet brake closes in on the flywheel as the ramp adds watts. A small wireless analyser on its mask blinks with every breath, and the assessor's tablet plots oxygen uptake against watts: a straight line at about 10 ml/min per watt that flattens at the ceiling. The ceiling control moves the ceiling, never the slope.

## Parts

- **Bike** (generic lab-grade, imitating no brand): T-feet and beam, seat column, clamp and saddle, bottom bracket, chainring, crank arms and pedals, the belt to a pulley, a flywheel with spinning holes, a magnet brake that lowers over the rim with power, front column, stem, handlebar, grips and power head.
- **Rider:** pedalling at 60 rpm with a bike fit (knee 30° at the bottom of the stroke, trunk 35°). A face mask with a capsule analyser on the front, whose status light blinks each breath out, a chest strap, and tracking dots on the joints.
- **Assessor:** a standing mannequin turned to read a 13-inch tablet held at both edges. The screen shows the big live VO₂ number, a breath marker, and VO₂ against watts with grid, ticks, the 10.3 ml/min/W guide, the trace, the current point, and a ceiling line once the plateau holds (`shared/vo2-plot.js`).

## Numbers

All in `reference/truth-pack.md` §5, under "How Fig 5 uses these numbers".

| Ceiling (ml/kg/min) | Ramp | Peak power | Heart rate at the top | RER at the top |
|---|---|---|---|---|
| 25 | 12.4 W/min | 143 W | 176 bpm | 1.15 |
| 35 | 19.7 W/min | 227 W | 176 bpm | 1.15 |
| 45 | 26.9 W/min | 311 W | 176 bpm | 1.15 |
| 55 | 34.2 W/min | 395 W | 176 bpm | 1.15 |

The slope measured off the model's ramp is 10.29 ml/min per W (Hansen 1987: 10.29 ± 1.01).

## Decisions

- **No RER.** The mask analyser measures flow and O₂; CO₂ is estimated, not measured. Printing RER would claim a measurement the device doesn't make.
- **No percentile readout** (unchanged): the FRIEND cycle table isn't verified. The caption quotes the four verified medians and says to compare with bike norms.
- **The ramp is sized to the ceiling,** so every test reaches the top in about 10 minutes. Fitness changes the watts and the ceiling, not the slope or the time.
- **A plateau is shown.** The caption says many people stop before one, and that their top value is VO₂peak.
- **Heart rate below the maximum is LOW** (resting 65 and a straight-line rise). HRmax (Tanaka) is HIGH.
- **The tablet's watts** come from the bike. Whether Optimal's app pairs with the bike's power meter is to confirm (open issue 2).
- **Generic analyser.** A rounded capsule with a flow tube and a status light, proportioned like a mask-mounted unit, not a copy of the VO2 Master's design.

## Interaction

- **Play / Pause** and a minute scrubber (range input, 28 px thumb on a 44 px tall track). **Ceiling** buttons: 25, 35, 45, 55 (44 px).
- **Keys** on the stage: ← → 15 s, Page Up/Down 1 min, Home/End, Space play/pause.
- **Idle tour:** plays a whole test at 35, then 45, 25 and 55. Taking over pauses it, and it resumes 9 s after the last input.
- **Offscreen:** rendering stops out of view.
- **Reduced motion:** one still at the ceiling, with the whole line on the tablet. Each ceiling button redraws it.

## Verification (2026-10-11)

- `node build.mjs --audit` and `--light --audit` → `audit passed`.
- `lines.mjs` → `line ends: 0` in both themes.
- No console errors.
- No sideways scroll at 390, 360 or 320.
- Captures, taken on the ramp at about 15 min: `shots/phone-{390,360,320}-{dark,light}.png`, `shots/desktop-{dark,light}.png`, `shots/reduced-390-*.png`.

## Embed

```html
<script src="https://optimal-research-team.github.io/optimal-anatomy-figures/05-vo2max/embed/optimal-fig-vo2max.js" defer></script>
<optimal-fig-vo2max theme="light"></optimal-fig-vo2max>
```

## Open issues for Peter

1. **FRIEND cycle percentiles.** Someone with journal access needs Kaminsky 2017 Table 2 or Kaminsky 2022 Table 3 (cycle rows) before a percentile readout can ship.
2. **The bike.** Resolved: Peter confirmed the app pairs with the bike's power meter, so plotting VO₂ against watts stands. Which bike, to match its look, is still open.
3. **To verify with full web access:** the VO2 Master spec sheet (CO₂, battery, weight); resting heart rate and the shape of the heart-rate rise; the VO₂ time constant (Wasserman).
4. **Site copy.** The Performance one-pager says "breath-by-breath gas analysis". That matches the mask unit. "One of the strongest known predictors of longevity" fits Mandsager and Kokkinos as an association; the caption keeps "association, not a promise".
