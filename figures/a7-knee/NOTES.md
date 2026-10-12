# A7 · The kneecap's load

**What it is:** the knee in side section, front to the right, through one running stride shown 4× slower. It is the inside view of Fig 4 (Creator 600). Hand-drawn organic SVG in the A-series style:
- the femur, fixed in view, with a trabecular texture and a cut end;
- the tibia swinging about the condyle;
- the kneecap gliding in its groove on a fixed-length patellar tendon;
- cartilage on all three bones, menisci, both cruciate ligaments and the fat pad;
- the quadriceps, hamstrings (with tendon) and calf;
- a soft skin silhouette.

**Mapping in one sentence:** the step-rate buttons set Fig 4's cadence at the same pace. The knee bends by `bendAt(φ, pct)` (sourced keyframes, LOW, never printed). While the foot is down, the contact under the kneecap glows with `pfAt(φ, cadence)` = Fig 4's `kneeOf(cadence)` × a stance hump: 115 / 100 / 93 / 86 % of usual at −10 / 0 / +5 / +10 % (Lenhart 2014: −14 % at +10 %). The tendon fibres brighten with it, and a monitor plots the force over the stride against the usual.

## Numbers

| Step rate | spm (Fig 4) | Step length | Peak kneecap force | Peak stance bend (drawn, LOW) |
|---|---|---|---|---|
| −10 % | 149 | 1.12 m | 115 % | ≈ 50° |
| Usual | 165 | 1.01 m | 100 % | ≈ 46° |
| +5 % | 173 | 0.96 m | 93 % | ≈ 45° |
| +10 % | 182 | 0.92 m | 86 % | ≈ 43° |

## Decisions

- **Angles from the truth pack, not Fig 4's mannequin.** Fig 4's inverse kinematics peaks near 63° in stance, an artefact of the mannequin's proportions (its angles are never printed either). A7 uses the sourced 46.3 → 42.8° keyframes. Worth a Fig 4 round-2 tweak if Peter wants the two to match exactly.
- **The kneecap's glide is solved from a fixed-length patellar tendon.** That is physically right through stance, where the force is. In deep swing a simple hinge would drag the kneecap under the femur, so its glide is capped at the front of the femur's end; the tendon is unloaded then.
- **−10 % uses Lenhart's 90 % step-rate condition (115 %)**, the range the study tested. The caption says "not a treatment for knee pain" and "group averages".
- **The swing peak bend (105°) and the toe-off bend (20°) are drawn, not sourced.** Only stance carries the force.

## Interaction

- **−10 % / Usual / +5 % / +10 %** (radiogroup, arrow keys, 44 px). Changes ease in; the idle tour cycles usual → +10 % → −10 % every 6 s.
- **Offscreen:** rendering stops out of view.
- **Reduced motion:** one still at mid-stance, the deepest bend and most force.

## Verification (2026-10-12)

- No console errors.
- No sideways scroll at 390, 360 or 320, in both themes.
- `lines.mjs`: 0 (no kit lines).
- Captures: `shots/phone-{390,360,320}-{dark,light}.png`, `shots/desktop-{dark,light}.png` (mid-stance), `shots/desktop-swing-{dark,light}.png` (deep swing), `shots/reduced-390-*.png`, `shots/embed.png`.

## Embed

```html
<script src="https://optimal-research-team.github.io/optimal-anatomy-figures/a7-knee/embed/optimal-fig-knee.js" defer></script>
<optimal-fig-knee theme="light"></optimal-fig-knee>
```

## Open for Peter

1. **Placement:** under Fig 4 on the Creator 600 page.
2. **Fig 4's mannequin knee bend** (≈ 63° in stance) vs the sourced ≈ 46°: optionally retune Fig 4's gait so both figures bend alike.
