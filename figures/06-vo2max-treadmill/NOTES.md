# Fig 6 · The treadmill ramp

**Asked by Peter (2026-10-11):** the same VO₂max setup as Fig 5 (a wireless mask, an assessor standing with a tablet) on Optimal's Creator 600 treadmill.

**Size:** Figure (upper end).
- 25 recorded solids: Fig 4's deck, display, uprights, handrails and side touch panel, without Fig 4's gait instruments.
- The page-drawn runner: Fig 4's mannequin and gait, run at the speed of the moment, plus the mask and analyser.
- The assessor, drawn once by `shared/assessor.mjs`.
- SVG only.

**Mapping in one sentence:** the belt speeds up a little every few seconds while the mannequin runs in a mask whose wireless analyser blinks each breath. The assessor's tablet plots oxygen uptake against speed: a straight line at about 3.5 ml/kg/min per km/h (at a 1 % incline) that flattens at the ceiling. The display still draws the live skeleton, and the side panel shows the belt speed.

**Round 2 (2026-10-12, Peter: "simple mockup is good, whatever is visually cleaner"):** the Creator screen is now a clean live dashboard:
- a "Live" dot pulsing with the stride, and the test clock;
- the belt speed as the hero number;
- the tracked skeleton standing on a floor line;
- three tiles: cadence (the model's `cadenceAt(speed)`, sourced, §4 [18]), step length (speed ÷ cadence) and grade (1 %).

It's a generic UI, not a copy of the Creator software. Audit passed and `lines.mjs` reports 0; all captures are retaken.

## Numbers

All in `reference/truth-pack.md` §5, under "How Fig 6 uses these numbers".

| Ceiling (ml/kg/min) | Warm-up and recovery jog | Ramp | Speed at the ceiling | Peak speed |
|---|---|---|---|---|
| 35 | 5.5 km/h | 0.35 km/h per min | 9.0 km/h | 9.6 km/h |
| 45 | 7.4 km/h | 0.45 km/h per min | 11.9 km/h | 12.6 km/h |
| 55 | 9.3 km/h | 0.55 km/h per min | 14.8 km/h | 15.7 km/h |

Oxygen cost of running comes from the ACSM running equation: VO₂ = 0.2 S + 0.9 S G + 3.5, with S in m/min and G = 0.01.

## Decisions

- **Speed ramp at a fixed 1 % incline.** A common treadmill setting, and the belt visibly speeds up. A grade ramp would mean tilting the drawn deck every frame.
- **Gait follows speed.**
  - Cadence comes from Leacox 2025 (169 → 178 spm from 2.68 → 3.83 m/s), extended in a straight line.
  - Contact time shortens with speed (duty factor −0.06 per m/s, LOW).
  - Everything else is Fig 4's gait model.
  - At the fastest speeds the leg runs out of reach at toe-off and lifts a fraction early. That shows only at 55.
- **Ceilings 35 / 45 / 55,** sized so the ramp lasts about 10 min from a jog that costs about 65 % of the ceiling. 25 would mean walking, which this gait model doesn't draw.
- **No RER, no percentile** (same reasons as Fig 5). The caption gives FRIEND's treadmill-vs-bike gap (about 22 %) and says to compare with treadmill norms.
- **The runner faces away from us,** so the mask is mostly hidden; Fig 5 shows the mask from the front.
- **The assessor stands behind the treadmill,** turned so the tablet shows past their shoulder.

## Verification (2026-10-11)

- `node build.mjs --audit` and `--light --audit` → `audit passed`.
- `lines.mjs` → `line ends: 0` in both themes.
- No console errors. No sideways scroll at 390, 360 or 320.
- Captures, taken on the ramp at about 12.5 min: `shots/phone-*`, `shots/desktop-*`, `shots/reduced-390-*`.

## Embed

```html
<script src="https://optimal-research-team.github.io/optimal-anatomy-figures/06-vo2max-treadmill/embed/optimal-fig-vo2max-treadmill.js" defer></script>
<optimal-fig-vo2max-treadmill theme="light"></optimal-fig-vo2max-treadmill>
```

## Open issues for Peter

1. **Protocol.** Resolved: Peter confirmed a speed ramp, which is what the figure runs. The 1 % incline and the start speeds are assumptions.
2. **Creator 600 screen size.** Resolved 2026-10-12: about a 50″ display stood vertically (Peter; Visbody lists a 50″ LG 4K vertical display). The treadmill here shares Fig 4's 50″ proportions. The site copy's "32″" still needs fixing on the site.
3. **Creator 600 screen during a test.** Resolved: Peter asked for a simple, clean mockup, so it shows speed, the skeleton, cadence, step and grade.
4. **To verify with full web access:** the ACSM running equation's validity range (it's meant for speeds above about 8 km/h; the 35 ceiling's warm-up jog is 5.5 km/h), and FRIEND's 22 % treadmill-vs-bike figure (Kaminsky 2022).
