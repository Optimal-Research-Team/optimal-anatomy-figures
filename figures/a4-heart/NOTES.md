# A4 · The beating heart

**What it is:** the heart cut open front to back and seen in isometric 3-D (round 3, 2026-10-12), beating. Hand-drawn organic SVG in A1's style, redrawn every frame from a small beat model through one deformation field:
- the chambers squeeze toward their middles;
- the walls thicken;
- the valve plane is pulled toward the apex as the ventricles empty;
- valves snap open and shut;
- blood moves only through open valves;
- an ECG strip runs underneath, timed to the beat.

**Mapping in one sentence:** pick a heart rate, and the beat shortens mostly by losing filling time while each beat empties more fully. The readout multiplies the two: output per minute = beats × millilitres per beat, from 4.2 L/min at rest to about 20 L/min all out (the delivery side of VO₂max, Fig 5).

## Parts

- **Chambers:** right atrium and ventricle (blue pools), left atrium and the thick-walled left ventricle (red pools), and the septum between them.
- **Valves and supports:** tricuspid and mitral leaflets with chordae to three papillary muscles; pulmonary and aortic cusps.
- **Vessels:** superior and inferior venae cavae, pulmonary trunk with both pulmonary arteries, aorta with its arch and three branches, descending aorta behind, two pulmonary veins.
- **Moving parts:** blood cells, a soft beat glow, and the ECG strip.

## Numbers (truth pack, "A4: the heart")

| | Rest 60 | Walk 100 | Run 140 | All out 176 |
|---|---|---|---|---|
| Beat (s) | 1.00 | 0.60 | 0.43 | 0.34 |
| Squeeze (s) | 0.34 | 0.26 | 0.22 | 0.20 |
| Per beat (ml) | 70 | 92 | 113 | 113 |
| Per minute (L) | 4.2 | 9.2 | 15.8 | 19.9 |

## Decisions

- **Squeeze time** = 0.3 s × √(beat ÷ 0.8 s): 0.3 s at 75 bpm (sourced), shortening much less than filling time does (sourced as a direction). The square-root shape itself is a modelling choice.
- **Per-beat volume** rises from 70 to 113 ml by about 140 bpm, inside the sourced "toward 120 ml in strenuous exercise", then holds.
- **Top rate** 176 = 208 − 0.7 × 45 (Tanaka), the same modelled person as Figs 5 and 6.
- **Textbook colours,** and the caption says venous blood is really dark red.
- **The valve plane moving toward the apex** is real long-axis motion, and the reason the atria fill while the ventricles empty. It's drawn as 15 px at full emptying.
- **Visual choices:** a rose muscle gradient, a soft glow with each squeeze, a Slow button (¼ speed) for watching the valves.

## Round 2 (2026-10-11, Peter: "do the heart after")

This brings the finish up to A2/A5/A6. The model, timing and numbers are unchanged.
- **Vessels:** every vessel gets a sheen on the side facing the light, and its open ends are cut, showing the lumen (inferior vena cava, both pulmonary arteries, the arch's three branches, the pulmonary veins, the descending aorta). The square-cut ends are gone.
- **Venae cavae and descending aorta:** the superior vena cava now runs behind the heart muscle and opens into the right atrium, instead of sitting on top of it. The descending aorta is drawn live behind the heart, down to a cut end.
- **Muscle fibres:** three rings wrap the left ventricle and two the right ventricle's free wall. They squeeze with the beat through the same deformation field, clipped to the moving outline.
- **Cells:** tumbling biconcave discs with a pale centre, instead of dots.
- **Kept:** the textbook convention of the pulmonary trunk crossing in front of the ascending aorta (a schematic layout, as in most teaching diagrams).

## Verification (2026-10-11)

- No console errors.
- No sideways scroll at 390, 360 or 320, in both themes.
- Reduced motion shows one still at mid-ejection: outflow valves open, inflow valves shut.
- Round 2 recaptured: `shots/desktop-{dark,light}.png`, `shots/phone-{390,360,320}-{dark,light}.png`, `shots/reduced-390-*.png`, `shots/embed.png`, all with no sideways scroll and a clean console.

## Open for Peter

1. **Placement:** VO₂max page (next to Fig 5), the Performance package, or both?
2. **Rhythm:** add a "trained athlete" option (resting rate 45–50, a bigger beat)? It would need a source for athletes' stroke volume.

## Round 3 (2026-10-12): cut in half, back half round (the A7 approach)

Peter's decision: every A-piece goes 3-D. Peter approved the A7 approach ("this is way better, just do it like this"): the organ cut in half, with the far half kept round.
- **Cut face:** the original front section, placed with `planeMatrix` in the series camera (azimuth 62°, elevation 24°). The chambers, valves, chordae, cells and glow all still draw in section coordinates.
- **Back half (live, `drawBack()` with `shared/round-back.js`):**
  - **Heart wall:** each frame, the heart's beating outline is rolled back over a quarter-round of 0.9 × its distance from the centre, so a round outline becomes a hemisphere. Facing facets are shaded between the muscle tones, so the back wall beats with the cut face.
  - **Great vessels:** each becomes a half-tube behind its cut.
  - **Cut ends** (venae cavae, pulmonary vessels, arch branches, descending aorta) show as half-rings: the wall, with the blood inside.
- **Vessels on the cut face are now cut open:** a pale wall band each side and blood down the middle, in the chamber pools' colours. The round-1 sheen and the flat end ellipses are gone, because they showed whole tubes.
- **Frame:** fitted to the heart and its vessels plus the back half's reach. The ECG sits flat underneath, and the view is 600 × 666.
- **Cost:** facets are merged per object and per tone (21 tones), so a frame is about 100 paths.

**Peter: "the heart animation looks not great."** Frame-by-frame review found three faults, all fixed:
1. **The ascending aorta was drawn across the left atrium.** Once everything is cut open in one plane, that read as a tube lying on top of the chamber. The left atrium now sits clear (x ≥ 372), and the aorta rises from the left ventricle in front of it, between the atria.
2. **The aortic arch had a hard seam where it meets the descending aorta.** Vessels are now filled without a line across their ends, and only their two side edges are stroked, so the arch runs into the descending aorta as one tube.
3. **The back half followed every notch of the cut outline,** which put a lump beside the left atrium. It now follows the outline averaged over ±3 samples. (A convex hull was tried first, but it filled the notch between the great vessels with a flat flap.)

Checked for flicker: the back half is stable frame to frame (slowed contact sheet).

## Verification (2026-10-12, round 3, local)

- `node scripts/verify.mjs a4-heart`: passed.
- No console errors, and no sideways scroll at 390, 360 or 320 in either theme.
- `lines.mjs`: 0.
- Reduced motion draws one still mid-ejection.
- Captures: `shots/phone-{390,360,320}-{dark,light}.png`, `shots/desktop-{dark,light}.png` and `shots/reduced-390-*.png` (Rest), plus `shots/desktop-max-{dark,light}.png` (All out).

## Round 4 (2026-10-12): a heart in real 3-D

Peter: "the only thing that needs to be re-done is the heart. Can you make that much more three-dimensional, and therefore I guess the animation needs more complexity."

The section is still the cut face (series camera, azimuth 62°, elevation 24°), and the beat model, timing and numbers are unchanged. Everything behind the cut is now built and lit in true depth, every frame, in `live.js`:
- **Chambers are cavities.**
  - Each opening on the cut face leads into a half-ellipsoid behind it (depth 0.5–0.82 × the chamber's mean radius; the right ventricle shallowest, since most of it lies in front of the cut).
  - The inner walls are shaded by facing in 64 tones, tinted by the blood in each chamber.
  - Muscle ridges run on the inner walls: trabeculae in both ventricles, pectinate muscles in the right atrium; the left atrium is smooth, as it is.
  - Through an opening every point of the wall is seen once, so the facets merge by tone, clipped to the opening.
- **Papillary muscles** are tapered 3-D columns standing up from the ventricle floors: one in the right ventricle, two in the left.
- **Chordae tendineae** run in 3-D from each column's tip to the free edges of the leaflets.
- **AV valves (tricuspid, mitral) in 3-D.**
  - The annulus crosses the cut at its two ends and continues behind it as a half-ring.
  - Two leaflets hang from it: open, their free edges drop along the ventricle wall; shut, they meet in the middle with a belly toward the atrium.
  - They swing with the model's valve state, and the scalloped free edge is outlined.
  - The orifice behind them is shaded in its chamber's own tone.
- **Cut muscle:** a separate cut-surface gradient, distinct from the round outer wall, with fibre lines and rim lines round every opening. Cut fibrous rings mark the annulus ends.
- **Back half:**
  - the round outer wall (0.92 × the distance from the centre, 9 bands);
  - epicardial fat in the left AV groove, with a marginal artery and its vein on the visible left border;
  - the great vessels' half-tubes behind them.
  - The descending aorta now runs **behind** the heart, under its back half: it is posterior. On the cut plane it had hidden the heart's round right side.
- **Vessels on the cut:** wall bands, blood, and the lit far wall of each half-pipe.
- **Motion** (more going on, all from the beat model):
  - the base drops toward the apex;
  - the walls thicken and the cavities shrink in depth as well as across;
  - the atria squeeze and refill;
  - leaflets swing open and dome shut;
  - the papillary muscles shorten with the ventricles;
  - blood cells move **at their own depths** inside the cavities, so they shift against each other with parallax and fade with depth;
  - filling **swirls** in each ventricle (inflow curls down the free wall and back along the septum; drawn, not measured), then streams to the outflow valve.
  - Cells now leave through the vessels' cut ends rather than past them.
- **Monitor (a simplified Wiggers diagram):** the ECG, the left ventricle's volume (the model's `V`, with the current value in ml), and bars showing when the filling valves (mitral, tricuspid) and outflow valves (aortic, pulmonary) are open, all scrolling together. No new numbers.
- **Caption:** adds the chordae ("so the valves hold shut instead of blowing back"), the monitor, and "the chambers' depth, the muscle ridges and the swirl … are drawn, not measured".
- **Performance:** 60 fps in headless Chrome at 390 px.

### Verification (round 4)

- `node scripts/verify.mjs a4-heart`: passed.
- No console errors, and no sideways scroll at 390, 360 or 320 in either theme.
- `lines.mjs`: 0.
- Reduced motion draws one still mid-ejection, with the traces filled in.
- Captures: `shots/phone-{390,360,320}-{dark,light}.png`, `shots/desktop-{dark,light}.png`, `shots/desktop-max-{dark,light}.png` and `shots/reduced-390-*.png`.
- One beat, slowed, frame by frame: `review/a4-beat-sheet.png`.

## Round 5 (2026-10-12): more three-dimensional

Peter on round 4: "the heart needs to be MORE three dimensional please". The beat model, timing, numbers and caption facts are unchanged. What changed:
- **Camera:** azimuth 40°, elevation 26°, where the series uses 62° / 24°. This deliberately breaks from the series: the heart turns further toward the viewer, so its round right side and the vessels' depth show. The cut face is still the same section.
- **Great vessels are whole 3-D tubes** (`tube3` in `live.js`), not half-pipes on the cut. Each is swept along a 3-D centre line with parallel-transport frames (16 sides), shaded by facing with a specular highlight, and capped where it's cut with a wall ring and a dark lumen.
  - The aortic arch carries its three branches (brachiocephalic, left common carotid, left subclavian) and becomes the descending aorta, which runs behind the heart.
  - The pulmonary trunk splits into left and right pulmonary arteries.
  - The SVC and IVC run into the right atrium.
  - Two pulmonary veins come out of the left atrium.
- **Back half:**
  - smoother (96 points round, 14 bands) with a specular sheen, so it reads as a shining round muscle rather than a band;
  - a coronary artery and its vein, with branches, running along the visible back wall;
  - a soft floor shadow under the heart ties it to the ground.
  - The flat epicardial-fat patch from round 4 is gone, because it read as a sticker.
- **Depth inside:** blood cells are clipped to their own chamber's opening, and the leaflets, chordae and papillary muscles to the openings, so nothing deep in a cavity draws over the cut muscle.
- **Fix:** the plate bounds now take each outline's winding into account (`OUT_SIGN`), so the outward normals are right and the gap under the heart is gone. The monitor sits just under the heart.
- **Performance:** 60 fps in headless Chrome at 390 px.

### Verification (round 5)

- `node scripts/verify.mjs a4-heart`: passed. Phones 390/360/320 fit in both themes, reduced motion is still, `lines.mjs` reports 0, and the console is clean.
- Captures: `shots/phone-{390,360,320}-{dark,light}.png`, `shots/desktop-{dark,light}.png` and `shots/desktop-max-{dark,light}.png` (All out).
- One beat, slowed: `review/a4-heart-beat.gif`.

## Round 6 (2026-10-12): a solid heart in WebGL that turns

Peter on round 5: "directionally better but it could be better … THINK IN THREE DIMENSIONS". The SVG had reached its limit: a flat cut face with 3-D parts stuck behind it. So, where WebGL runs, the heart is now a lit 3-D solid, ray-marched in the figure's own camera through the kit's WebGL layer (`kit/gl.mjs`, one canvas over the drawing). The round-5 SVG heart stays underneath as the fallback.

**The model** (`gl-heart.js`) is a signed-distance model in the section frame the SVG uses (x right, y down, d back from the cut):
- **Outer body:** the figure's own outline (`geo.OUT`), puffed into a rounded solid. In each direction its radius is the outline's (a 12-term Fourier series about C2), and its depth is 0.74 of that. The atrioventricular groove is pressed in at the back. The widest section lies 30 behind the cut, so the cut face sits inside a rim of round outer wall, the way a sliced fruit reads as solid.
- **Cut:** everything in front of the cut plane and inside the outline is taken away. Vessels outside the outline stay whole.
- **Chambers:**
  - four ellipsoid cavities, ridged inside: trabeculae in the ventricles, pectinate muscles in the right atrium;
  - the tricuspid and mitral channels;
  - the vessels' lumens, joined to the cavities they drain.
- **Valves:** the tricuspid (3 leaflets) and mitral (2) are curved sheets hung from the annulus, with scalloped free edges and commissures that open toward the free edge. The cut halves them, as in the textbook view. Open, they hang into the ventricle; shut, they dome toward the atrium.
- **Papillary muscles and chordae:** three papillary muscles, with chordae running from their tips to the leaflets' free edges, computed each frame.
- **Great vessels:** hollow tubes with open ends that show their lumen:
  - the aorta, with its arch and three branches, running into the descending aorta behind the heart;
  - the pulmonary trunk crossing to its split, with the left and right pulmonary arteries;
  - the superior and inferior venae cavae;
  - two pulmonary veins.
- **Surface:** coronary arteries and veins (the circumflex in the left atrioventricular groove, and marginal branches) on the side that faces the viewer, with fat along the groove and the vessels.

**Proportions** (Peter asked whether the walls were too thick; partly they were). The scale is about 34 units per cm, from the ventricles' ~9 cm width at the cut. Fixed against typical adult values:
- The left ventricle was ~3.6 cm across and is now ~4 cm (normal at end-diastole is ~4.2–5.8 cm), with a ~0.75 cm free wall (normal ≤ 1.1 cm).
- The septum is ~0.9 cm, the right-ventricle wall ~0.4 cm (normal < 0.5 cm), and the atrial walls ~0.2 cm.
- The atria were ~3.3 cm apart. They now meet at a thin (~0.6 cm) interatrial septum.
- The AV valve rings were ~1.4–1.6 cm and are now ~2.5–2.7 cm (normal ~2.7–3.5 cm). The leaflets are ~1.5–1.8 cm.
- The tricuspid sits slightly nearer the apex than the mitral (~0.6 cm), as normal.
- The apical wall is ~0.7 cm.
- The great arteries now cross as they do in the body. The pulmonary trunk rises in front of the aortic root and to the person's left of it, then splits under the arch. The ascending aorta rises behind it toward the person's right, then arches back and left.
- **The SVG fallback still has the older schematic layout** (pulmonary trunk to the viewer's left of the aorta, smaller chambers). See Open.
- Closed AV leaflets meet just below the annulus plane, level with it. They don't billow into the atrium, which would look like prolapse.

**Motion:** the same beat model drives it.
- The valve plane is pulled toward the apex.
- The cavities shrink across (volume ratio^0.4) and a little along (^0.15), so their volume tracks the model's 120 → 50 ml at rest, while the walls thicken (outer scale 1 − 0.16 × the across shrink).
- The atria squeeze.
- The leaflets swing, and the papillary muscles shorten with their ventricle.
- Blood cells come from the SVG's simulation, kept inside their chamber (atrium until they pass the valve plane, then ventricle), and are drawn as small spheres at their depth.

**Light:** Lambert wrap, Blinn highlight, ambient occlusion, a cheap occlusion term toward the light, and a contact and cast shadow on the floor, in linear light. Colours come from theme tokens (`--a4-gl-*` plus the existing `--a4-*`), so both themes work.

**Turning:**
- The heart sways slowly (±23° over 15 s). The sway slows with Slow, so the valves are easy to watch.
- A horizontal drag turns it. `touch-action: pan-y`, so vertical swipes still scroll the page on phones.
- The hint gains "· Drag to turn" only when WebGL is running.

**Fallback:** without WebGL, or if the shader fails, `glLayer` returns null and the round-5 SVG heart draws exactly as before. When WebGL runs, the SVG heart group (`.a4-heart-svg`) is hidden, and its per-frame drawing is skipped.

**Reduced motion:** one still mid-ejection. A drag or a resize redraws it.

**Deviation from the skill:** `references/webgl.md` keeps solids in SVG and uses shaders only for light, fluids and glow. This figure breaks that on purpose, at Peter's request for more 3-D. It stays inside the repo rule: one WebGL layer, and an SVG that reads on its own.

**Performance:**
- In headless Chrome on an Apple M4 (ANGLE Metal): 60 fps at 390 px and 60 fps at 1280 px.
- Tubes are evaluated in bounded chunks. Points deep in the cut-away space or outside the outer wall skip the chambers, cords and valves. Cords are boxed.
- A governor drops the light-occlusion term, then the pixel ratio (1.5 → 0.75), if the median frame runs past 26 ms.
- Phones start at ratio 1.25 without it.
- **Real-phone frame rates are not measured yet.**

**Caption:** "The heart's 3-D shape … drawn from textbook anatomy, not measured."

### Open (round 6)

- The SVG fallback (no WebGL) keeps the round-5 schematic: its great arteries don't cross, and its chambers are smaller. Bring it to the GL proportions if the fallback matters. The SVG is drawn from `geo` in `build.mjs`.
- Real-phone frame rates are unmeasured. Check on a mid-range Android and an older iPhone. The governor in `gl-heart.js` lowers the pixel ratio if frames run long.

### Verification (round 6)

- `node scripts/verify.mjs a4-heart`: passed. Phones 390/360/320 fit in both themes, reduced motion is still, `lines.mjs` reports 0, and the console is clean.
- `drive.mjs --no-webgl`: `data-gl` is absent and the SVG heart draws.
- A beat with the sway: `review/a4-heart-beat.gif`.

