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

## Round 3 (2026-11-10): the same leg as a real-time 3-D model (`shared/gl3`)

The drawing above is unchanged and is still the figure wherever the layer can't run (`?gl=off`, no WebGL 2, Save-Data, small devices, a lost context). With the layer on, `gl-scene.js` builds the same hemisected leg as a lit model under the SVG, in the same camera and world; the drawn leg fades out (`data-gl3-hide`) and the SVG keeps the amber halo and the monitor on top.

**What is modelled (28 meshes, about 27 k triangles; about 18 k on phones; two small lamps):**
- **The far half:** a real half-tube of skin swept round the same 46 chords `live.js` pairs for the drawing (one more is interpolated between each pair), re-posed every frame. The thigh's cut top is the drawing's cross-section painted onto a flat cap (same art, from the same numbers).
- **The cut face, in low relief.** Every piece is the drawing's own outline (same control points, same Catmull-Rom), raised a few units off the soft tissue with a rounded edge, in the drawing's paint order (later = higher): hamstrings and quadriceps 4, gastrocnemius 4.6, calf 5.2, tibia 9, femur 9.8, cartilage 10.6 to 11.3, menisci 10.9, fat pad 11.5, tendons 12.4, kneecap 13.2. The key light rakes the face from above, so the relief shows as lit edges, walls and soft shadows.
- **Each raised piece is slid across the face by its height** (`SLIDE` in `gl-scene.js`), so that in this fixed camera its face lands exactly where the drawing has it. Every outline, joint line and contact of the reviewed drawing is kept to the pixel (checked by overlaying `?gl=off`); the relief only adds what the camera and light see of its sides.
- **Bone:** compact rim and spongy bone as fine pores (denser toward the joint, drawn along the load lines), painted at build time into a colour and a relief texture per bone; nothing is fetched. The **marrow canals are real**: a channel in the femur that runs out of the thigh's cut, a pocket through the tibia's face, with the yellow marrow lying 2.8 units below the bone's face, so their walls take light and shadow correctly at every bend.
- **Muscle:** the drawing's fascicle lines (plus two finer between each pair) as grooves, the belly swelling slightly inside its sheath.
- **Cartilage** as a wet bead on femur, tibia and kneecap; **menisci** as wedges; **cruciates and the hamstring tendon** as cords with rounded ends; **quadriceps and patellar tendons** as fibrous bands; the **fat pad** with lobules.

**What moves, and from what:** nothing in the scene has a pose of its own. `draw()` in `live.js` hands over the very points it used for the SVG: `theta` (tibia, `bendAt`), `alpha` (the kneecap on its fixed-length tendon), both tendon centre lines, the fat pad's, calf's and ligaments' control points, the skin chords, and `load` (`pfAt`). The contact under the kneecap is a bead that glows with `load / 1.15` (the drawing's own scale) plus a small lamp that warms the bone round it; the tendons' fibre lines show at `0.3 + 0.6 × load`, as in the drawing. Reduced motion: one still, swapped in without a fade.

**Differences from the drawing (deliberate, small):**
- The skin's edge on the cut face follows the far half's chords, so the leg is one solid. The drawing's closed outline overshoots those chords at the thigh's top corners and rounds the shin's end; in 3-D both ends are cut square. No structure is lost.
- Pieces at the thigh's top end square in the plane of the cut, so the top few units of femur, quadriceps and hamstrings show their end from above instead of their face.
- No ground shadow: the leg floats as in the drawing (a floor shadow would be cut off by the monitor).

**Needed from the shared layer (worked around here, worth adding there):**
- A way to size the key light's shadow for a small scene. The default map is about one texel per unit, far too coarse for relief a few units deep, and its 16-bit depth over the default range made the soft shadows grainy. `tuneShadow()` finds the key light on the root's parent and gives it a tighter frustum and depth range and a 2048 map (1024 on phones). If the layer changes shape this is skipped and its default stays.
- `stats()` reports only the last pass (1 call, 1 triangle), so the counts above come from walking the scene.

**Tried and dropped:** a floor shadow under the leg (`look.cast`). It fell as one wide grey slab between the leg and the monitor and ran into the canvas edge; the leg floats, as in the drawing.

**Verification (2026-11-11):** `node scripts/verify.mjs a7-knee` passed (390 / 360 / 320, both themes, reduced, desktop, lines). With `?gl=off` the live SVG is the previous build's, node for node, in every step-rate state and both themes (the only difference is the two `<g data-gl3-hide>` wrappers; compared after lifting them), and the plate's text is identical. The render was overlaid on the drawing at mid-stance: bones, cartilage, tendons, ligaments, fat pad and kneecap coincide.

## Embed

```html
<script src="https://optimal-research-team.github.io/optimal-anatomy-figures/a7-knee/embed/optimal-fig-knee.js" defer></script>
<optimal-fig-knee theme="light"></optimal-fig-knee>
```

## Open for Peter

1. **Placement:** under Fig 4 on the Creator 600 page.
2. **Fig 4's mannequin knee bend** (≈ 63° in stance) vs the sourced ≈ 46°: optionally retune Fig 4's gait so both figures bend alike.
