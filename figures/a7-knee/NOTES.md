# A7 · The kneecap's load

**What it is:** a thick slice of the knee as an anatomical specimen in isometric 3-D (round 2, 2026-10-12). Its cut face is the knee in side section, front to the right, through one running stride shown 4× slower. It is the inside view of Fig 4 (Creator 600). The section is hand-drawn organic SVG in the A-series style:
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

## Round 2 (2026-10-12): the specimen slab, the approach for the organ pieces

Peter's decision: every A-piece goes 3-D. The organ pieces (A2, A4, A6, A7) don't fit a tissue block, so A7 tries the approach for all four first; **A2, A4 and A6 wait for Peter's OK.**

**Approach:** HANDOFF-LOCAL §5.2 option (a), "a deep slab", done in true isometric rather than as a plate under a flat drawing.
- The section becomes the cut face of a thick slice of the organ, in the same camera as the blocks (azimuth 62°, elevation 24°).
- The organ's outline is swept back through the slice's thickness to make its outer surface.
- Where the slice is cut across, the cut end shows its own section.

**Why this over the other two §5.2 options:**
- (b) shading alone keeps the pieces flat, in a different camera from the blocks;
- (c) a true isometric rebuild would mean redrawing and re-solving every moving part.

**Construction (A7):**
- **Cut face:** the original section, unchanged, placed with `planeMatrix` on the slice's front plane (y = DEP). `live.js` still draws everything in section coordinates.
- **Outer surface (skin):** live. One hidden path (`#a7-sil`) carries the skin outline that `live.js` already computes each frame. 50 `<use>` clones of it are translated back through the slice depth (the depth vector expressed in the cut face's own coordinates, `WD` = M⁻¹·v), so the walls follow the swinging shin with no extra geometry.
  - Fill: a vertical gradient.
  - The back clone carries the far edge line.
  - Because a prism's visible surface is exactly its front face plus its swept outline, this is correct in every pose.
- **Top (thigh cut across):** static bands: skin and fat | hamstrings | femur (cortex and cancellous bone) | quadriceps | skin and fat, with fascicle dots in the muscles.
- **Shin cut across:** never visible. Its outward normal points away from the viewer for every bend from 0° to 105°, so it isn't drawn.
- **Cut face, made opaque:** soft tissue fills the skin outline, the muscles are solid, and fascicle lines run along the quadriceps, hamstrings and calf (clipped to each muscle).
- **Slice depth:** 72 units (about 35 mm at the section's scale).
- **Size:** the camera is fitted to the section's reach over a whole stride (straight at foot contact, 105° in swing), so nothing clips in any pose. The monitor sits flat underneath, and the view is 600 × 772.

**live.js change:** one line. `draw()` also writes the skin outline to `#a7-sil`.

## Verification (2026-10-12, slab, local)

- `node scripts/verify.mjs a7-knee`: passed.
- No console errors, and no sideways scroll at 390, 360 or 320 in either theme.
- `lines.mjs`: 0.
- Reduced motion draws one still at mid-stance.
- Captures:
  - `shots/phone-{390,360,320}-{dark,light}.png` and `shots/desktop-{dark,light}.png` (Usual, at the peak kneecap force);
  - `shots/desktop-swing-{dark,light}.png` (deep swing);
  - `shots/reduced-390-*.png`.

## Embed

```html
<script src="https://optimal-research-team.github.io/optimal-anatomy-figures/a7-knee/embed/optimal-fig-knee.js" defer></script>
<optimal-fig-knee theme="light"></optimal-fig-knee>
```

## Open for Peter

1. **Placement:** under Fig 4 on the Creator 600 page.
2. **Fig 4's mannequin knee bend** (≈ 63° in stance) vs the sourced ≈ 46°: optionally retune Fig 4's gait so both figures bend alike.
