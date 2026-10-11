# Fig 5 · The ramp and the cart

**Size:** Hero plus one WebGL layer.
- 49 recorded solids, plus one cable, for the bike and the cart.
- The page-drawn mannequin (about 40 parts, with mask, valve and chest strap) plus crank arms and pedals.
- The brake magnets, flywheel holes, turbine vane, gas-cell bars and the monitor's plot.
- The breath layer in the hose (WebGL) and a front layer for the near arm.
- About 140 parts in all.

**Mapping in one sentence:** the mannequin pedals a generic lab bike whose magnet brake closes in on the flywheel as the ramp adds watts. Each breath out surges down a clear hose into the cart's mixing chamber and spins the flow turbine, a sample line feeds the O₂ and CO₂ cells, and the monitor plots oxygen uptake against watts: a straight line at about 10 ml/min per watt that flattens at the ceiling. The ceiling control moves the ceiling, never the slope.

## Parts

- **Bike** (generic lab-grade, imitating no brand; HANDOFF §3):
  - two T-feet and a beam;
  - a slanted seat column with clamp and saddle;
  - bottom bracket housing and shell, chainring, crank arms and pedals;
  - the belt to a pulley on the flywheel axle;
  - a flywheel with five holes that spin;
  - the magnet brake: arm, carriage and magnet, lowering over the rim with power;
  - front column, stem, handlebar with grips, and the power head (its screen faces the rider).
- **Rider** (`shared/mannequin.mjs`): pedalling at 60 rpm with the ball of the foot over the pedal axle, a little ankling, the knee bent 30° at the bottom of the stroke, the trunk leaning 35°, hands on the grips. A face mask with a one-way valve, a chest strap with its band drawn round the chest, and tracking dots on the joints.
- **Hose:** clear tubing from the valve to the mixing chamber's cap. The breath inside it is the WebGL layer. Without WebGL, flowing dashes stand in.
- **Cart:**
  - cabinet on four castors;
  - clear mixing chamber with four baffles on two brackets, cap and foot;
  - elbow to the clear flow turbine with its spinning vane and pickup sensor;
  - sample-line ports and line to the O₂ cell;
  - O₂ and CO₂ cells, each with a window and a level bar;
  - calibration gas cylinder with valve and two straps;
  - monitor on a post, plotting VO₂ against watts with grid, ticks, the 10.3 ml/min/W guide, the live trace, the current point, and a ceiling line that appears once the plateau holds.

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

- **No percentile readout.** HANDOFF asked for the FRIEND cycle percentile. Only four cells of that table are verified (the medians at 20–29 and 70–79). Showing a percentile would mean shipping an unverified table, so the ceiling control offers four plain values, and the caption quotes the verified medians and says to compare a bike result with bike norms. This is open issue 1.
- **The ramp is sized to the ceiling,** as a lab sizes it to the predicted value, so every test reaches the top in about 10 minutes. Fitness changes the watts and the ceiling, not the slope or the time. That's the figure's point.
- **A plateau is shown.** The caption says many people stop before one, and that their top value is VO₂peak.
- **Printed numbers with LOW confidence:** heart rate below the maximum (resting 65 and the straight-line rise) and RER (0.80 → 1.15). Both are standard textbook shapes, but neither was checked against a source this session. HRmax (Tanaka) and the RER ≥ 1.10 criterion are HIGH. Breathing values move the turbine and the hose but are never printed. See open issue 3.
- **Time.** Playback runs about 45 test-minutes per minute (0.75 min/s), while the rider pedals and breathes in real time at the modelled rates. The clock beside the scrubber shows test time.
- **WebGL:** one layer, the breath in the hose.
  - The hose's centreline is projected with the figure's own camera and passed to the shader, along with the hose radius in world units × k. The breath sits inside the drawn tube at every zoom.
  - The air advances by the tidal volume ÷ hose area on each breath out, so it surges further when breathing is harder.
  - Screen blending in Forest night, ink on paper in Cream.
  - Every term fades to zero before the hose ends.
- **Front layer.** On a bike the arms don't move, so the near arm is copied once into an SVG above the breath layer. The hose and its breath then pass behind the arm, as they should.

## Interaction

- **Play / Pause** and a minute scrubber (range input, 28 px thumb on a 44 px tall track). **Ceiling** buttons: 25, 35, 45, 55 (44 px).
- **Keys** on the stage: ← → 15 s, Page Up/Down 1 min, Home/End, Space play/pause.
- **Idle tour:** plays a whole test at 35, then 45, 25 and 55. Taking over pauses it, and it resumes 9 s after the last input.
- **Offscreen:** rendering stops out of view.
- **Reduced motion:** one still at the ceiling, with the whole line on the monitor and a breath on its way down the hose. Each ceiling button redraws it.

## Verification (2026-10-11)

- `node build.mjs --audit` and `--light --audit` → `audit passed`.
- `lines.mjs` → `line ends: 0` in both themes.
- WebGL starts in headless Chrome (`data-gl` set). No console errors.
- No sideways scroll at 390, 360 or 320.
- Captures, taken on the ramp at about 15 min: `shots/phone-{390,360,320}-{dark,light}.png`, `shots/desktop-{dark,light}.png`, `shots/reduced-390-*.png`, `shots/zoom-hose-dark.png`.

## Embed

```html
<script src="https://optimal-research-team.github.io/optimal-anatomy-figures/05-vo2max/embed/optimal-fig-vo2max.js" defer></script>
<optimal-fig-vo2max theme="light"></optimal-fig-vo2max>
```

## Open issues for Peter

1. **FRIEND cycle percentiles.** Someone with journal access needs Kaminsky 2017 Table 2 or Kaminsky 2022 Table 3 (cycle rows) before a percentile readout can ship.
2. **Equipment.** Which cart, mask and bike does Optimal use (HANDOFF §7)?
   - The Performance one-pager says breath-by-breath analysis. This figure draws a mixing chamber. If the cart is breath-by-breath, round 2 moves the turbine to the mask, draws the sample line from the mask, and drops the chamber.
   - The bike and cart are generic until photos arrive.
3. **To verify with full web access:** resting heart rate and the shape of the heart-rate rise, the RER curve, the VO₂ time constant, and the ventilation and breathing values (Wasserman, *Principles of Exercise Testing and Interpretation*), plus the Mandsager group definitions.
4. **Site copy.** "One of the strongest known predictors of longevity" fits Mandsager and Kokkinos as an association. The caption keeps the "association, not a promise" wording.
