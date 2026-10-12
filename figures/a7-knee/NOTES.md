# A7 · The kneecap's load

**What it is:** the leg cut in half lengthwise at the knee, in isometric 3-D (round 2, 2026-10-12). Its cut face is the knee in side section, front to the right, through one running stride shown 4× slower. It is the inside view of Fig 4 (Creator 600). The section is hand-drawn organic SVG in the A-series style:
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

## Round 2 (2026-10-12): the leg cut in half, the approach for the organ pieces

Peter's decision: every A-piece goes 3-D. The organ pieces (A2, A4, A6, A7) don't fit a tissue block, so A7 tries the approach for all four first; **A2, A4 and A6 wait for Peter's OK.**

**Two tries:**
1. **Specimen slab.** The outline was extruded back at constant thickness (stacked `<use>` clones). Peter: "better, but it looks like an unnatural slice of some kind."
2. **The leg cut in half lengthwise (current).** The near half is removed and the far half keeps its round skin. This is how a hemisected limb really looks, and how textbook cut-away illustrations draw one.

**Construction:**
- **Camera:** the series camera (azimuth 62°, elevation 24°).
- **Cut face:** the original section, placed with `planeMatrix` on the cut plane and clipped flat at the thigh's cut (y = −14).
  - Muscle and femur tops run past the cut, so the clip leaves them cut square.
  - New marrow canals in the femur and tibia shafts match the cross-section on top.
  - Soft tissue fills the skin outline, and fascicle lines run along the quadriceps, hamstrings and calf.
- **Far half (live, in `live.js` `drawFar`):**
  - The skin's back and front edges are sampled on the same Catmull-Rom curve as the outline and paired by arc length into 46 chords along the leg.
  - Each chord is swept round behind the cut as a half-circle (depth = half its length × 0.95; thigh and calf are near-round in cross-section).
  - Facets facing away from the viewer are culled. The rest are shaded by facing (Lambert, light from upper left front) between the theme's two skin tones and painted back to front.
  - The knee bend needs no special case, because the chords rotate with the shin.
  - At this camera only the near-edge crescent shows (as it would on a real half-limb), so it reads round without hiding anything.
- **Top: the far half of the thigh cut straight across** (static, `planeMatrix` on the horizontal cut plane):
  - skin and the subcutaneous fat ring;
  - the femur as a half-ring of cortex with its marrow;
  - anterior, medial and posterior compartments split by intermuscular septa, with muscle outlines for the rectus femoris, sartorius, gracilis and hamstrings, and fascicle dots;
  - the femoral artery and vein, the great saphenous vein in the fat, and the sciatic nerve.

  Positions are textbook-level ([K]) and carry no numbers.
- **Shin's cut end:** never visible. Its outward normal faces away for every bend from 0° to 105°.
- **Frame:** fitted to the cut face's real reach over a whole stride, computed from the same control points `live.js` uses, plus the top cross-section. The knee is back to about its round-1 size, and the view is 600 × 812.

**live.js changes:** `drawFar()` (about 90 lines), and the skin outline is now built from its two edges, so the far half and the outline share the same points.

## Verification (2026-10-12, local)

- `node scripts/verify.mjs a7-knee`: passed.
- No console errors, and no sideways scroll at 390, 360 or 320 in either theme.
- `lines.mjs`: 0.
- Reduced motion draws one still at mid-stance.
- Captures:
  - `shots/phone-{390,360,320}-{dark,light}.png` and `shots/desktop-{dark,light}.png` (Usual, at the peak kneecap force);
  - `shots/desktop-swing-{dark,light}.png` (deep swing);
  - `shots/reduced-390-*.png`.
- Round-by-round comparison: `review/a7-rounds-desktop.png`, `review/a7-rounds-phone.png`.

## Embed

```html
<script src="https://optimal-research-team.github.io/optimal-anatomy-figures/a7-knee/embed/optimal-fig-knee.js" defer></script>
<optimal-fig-knee theme="light"></optimal-fig-knee>
```

## Open for Peter

1. **Placement:** under Fig 4 on the Creator 600 page.
2. **Fig 4's mannequin knee bend** (≈ 63° in stance) vs the sourced ≈ 46°: optionally retune Fig 4's gait so both figures bend alike.
