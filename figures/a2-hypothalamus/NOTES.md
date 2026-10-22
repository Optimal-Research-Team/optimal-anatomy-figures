# A2 · The hot-flash switch

**What it is:** a midline slice through the hypothalamus, with the front of the head on the left. It is the inside view of Fig 1's thermostat. Hand-drawn organic SVG in the A1/A4/A5 style. Forest night reads as a fluorescence slide; Cream reads as a stained section.

**Mapping in one sentence:** switch between pre- and post-menopause. Estrogen molecules leaving the vessels thin out. The KNDy cells at the base swell to 194 % of their area and burst twice as often, sending more neurokinin B up their axons. The heat-loss centre's drive (the green glow) then sits near its tipping point, and the drawn natural wander tips it into a hot flash: it turns orange and fires a heat-loss train toward the brainstem.

**Round 2 (2026-10-12, Peter: "can include treatments on screen"):** two states are added, by drug class only and framed as the Menopause Protocol frames them:
- **Hormone therapy:** estrogen comes back, the KNDy cells shrink and quieten, and the heat-loss centre moves off its edge.
- **Non-hormonal:** a neurokinin-receptor blocker. The cells keep signalling, but the heat-loss centre's receptors are greyed and receive only a fifth of it, so it never tips.

The caption adds: "Neither is for everyone… safety review… not treating is always an option" and "the drawing shows the mechanism, not an expected result". Both magnitudes are ILLUSTRATIVE (truth pack, "A2").

## Parts

- **Slice:** grey-matter slab with glial speckle; the anterior commissure; the fornix arching down to the mammillary body; the lamina terminalis; the optic chiasm and nerve stump; the hypothalamic sulcus with the thalamus above it and its adhesion; small vessels.
- **Base:** median eminence with its portal capillary loops, the pituitary stalk, the anterior and posterior lobes, and the bony cup (sella).
- **KNDy cluster:** eight neurons in the arcuate (infundibular) nucleus, each with soma, nucleus, nucleolus and dendrites; a burst glow. Four beaded axons run to the heat-loss centre and three short ones to the median eminence.
- **Heat-loss centre (MnPO):** six neurons with NK3 receptor dots and a drive glow. On a flash they turn orange, a heat glow spreads, and pulses run out along the output axon.
- **Estrogen:** amber hexagons leaving the vessels and docking on KNDy cells, as many as the estrogen level.
- **Locator:** a small sagittal brain with the hypothalamus boxed.

## Numbers (truth pack §1, rows 60–64, and "A2")

| | Pre-menopause (e = 1) | Post-menopause (e = 0) |
|---|---|---|
| KNDy soma area | 100 % | 194 % (diameter × 1.39) |
| Drawn bursts | every 3.4 s | every 1.7 s |
| Packets per axon per burst | 2 | 4 |
| Mean drive on the heat-loss centre (1 = tipping point) | 0.20 | 0.80 |
| Drive + wander (0–0.22) | never tips | tips about every 10–20 s on screen |
| Readout: hot flashes | Rare (Fig 1 `rateOf(1)` ≈ 0) | ≈ 1.1 an hour (Fig 1 `rateOf(0)`, symptomatic) |

## Decisions

- **Only the area is sourced** (Rance & Young 1991, % LOW). Burst timing, packet counts, drive and wander are drawn, and the caption says so: "Firing rates are drawn, not measured."
- **Time is compressed,** and the caption says so: flashes about an hour apart in life, seconds apart on screen.
- **No treatments shown.** The NK3-blocker state waits on HANDOFF §7 Q2 (Peter's regulatory call); it's ready to add as a third button (receptor dots dimmed, packets arrive without effect).
- **"A typical pattern in women who have hot flashes; many women have few or none."** Same framing as Fig 1.
- **The median-eminence axons** stand for the KNDy cells' other job (timing reproductive-hormone pulses), mentioned in one clause of the caption.
- **The heat-loss output path** is drawn as one axon heading back toward the brainstem. The real route (via the dorsomedial hypothalamus and the medullary raphe) is simplified.

## Interaction

- **Two buttons** (radiogroup, arrow keys, 44 px).
- **Idle tour:** alternates the two states every 12 s, and resumes 9 s after the last input.
- **Offscreen:** rendering stops out of view.
- **Reduced motion:** post-menopause shows one still mid-flash; pre-menopause shows a still just after a burst.

## Verification (2026-10-11)

- No console errors.
- No sideways scroll at 390, 360 or 320, in both themes.
- `lines.mjs`: 0 (no kit lines; all hand-drawn).
- Captures: `shots/phone-{390,360,320}-{dark,light}.png`, `shots/desktop-{dark,light}.png`, `shots/desktop-post-{dark,light}.png` (mid-flash), `shots/reduced-390-*.png`, `shots/embed.png`.

## Embed

```html
<script src="https://optimal-research-team.github.io/optimal-anatomy-figures/a2-hypothalamus/embed/optimal-fig-hypothalamus.js" defer></script>
<optimal-fig-hypothalamus theme="light"></optimal-fig-hypothalamus>
```

Since round 4 the embed has a second file, `hypothalamus-3d.js`, which it loads by itself from **the same folder as the embed script** (resolved from the script's own URL). Serve both together. The host API (`stage`, `tour`, `size-readout`, `gl`, `gl-src`, the `stagechange` event) is in "Round 4" below.

## Open for Peter

1. **Inset or standalone?** It's built as its own card. It can sit under Fig 1 as "what's happening inside the thermostat".
2. **Treatment buttons:** done (round 2). Drug names are deliberately left off.
3. **The 194 %** comes from a secondary listing of Rance & Young 1991. Check it against the paper before quoting the number on a page; the readout could say "larger" instead.

## Round 3 (2026-10-12): a block of brain, the hanging parts cut in half

Peter's decision: every A-piece goes 3-D, done the A7 way (an organ cut open, with what's round kept round). The piece shown is tissue cut out around the hypothalamus. Its natural 3-D form is a **block of brain**: the top and end are flat cuts, as in a neuroanatomy specimen. The structures hanging under the brain stay round.
- **Front face:** the midline slice, placed with `planeMatrix` in the series camera (azimuth 62°, elevation 24°).
  - Squared off at the block's cuts: top y = 150, ends x = 74 and 520. The brain's base keeps its own outline.
  - `live.js` is unchanged here: KNDy cells, neurokinin B, estrogen, the MnPO and the heat pulse all draw in section coordinates.
  - One tissue gradient spans the whole face (`a2-tissue-front`, user space), so the old outline leaves no seam.
- **Top: a horizontal cut at the thalamus, 160 deep (to the side of the brain).**
  - The thalamus sits behind the genu.
  - The internal capsule is drawn as its true V (anterior limb, genu, posterior limb).
  - The caudate head is in front, and the lens-shaped lentiform nucleus is outside.
  - The fornix shows in cross-section where it leaves the front face.
  - Glial speckle and small vessels throughout.
- **Right end:** a cut across behind the mammillary bodies: thalamus, a white-matter band (capsule into peduncle), the optic tract and speckle, shaded.
- **Hanging parts, cut in half (drawn once at mount, `shared/round-back.js`):**
  - the bony cup (sella), the pituitary's two lobes, the stalk, the chiasm and the mammillary body each keep a round back half;
  - the optic nerve is a half-tube.
- **Locator:** stays flat, now bottom right.
- **Anatomy check:** these are textbook-level ([K]) and carry no numbers.
  - horizontal section at thalamic level: caudate, anterior limb, genu, posterior limb, thalamus medial, lentiform lateral;
  - the pituitary sits in the sella turcica on its stalk;
  - the chiasm is in front of the stalk, the mammillary bodies behind it.
- **Phone fix (all figures):** at 320 px the "Before" button label was clipped. This was already the case before round 3. The shared theme now keeps each button at least as wide as its longest word, with tighter padding at ≤ 350 px.

## Verification (2026-10-12, round 3, local)

- `node scripts/verify.mjs a2-hypothalamus`: passed.
- No console errors, and no sideways scroll at 390, 360 or 320 in either theme.
- `lines.mjs`: 0.
- Reduced motion draws a still.
- Captures: `shots/phone-{390,360,320}-{dark,light}.png`, `shots/desktop-{dark,light}.png` and `shots/reduced-390-*.png` (Before), plus `shots/desktop-post-{dark,light}.png` (After).

## Round 4 (2026-10-21): the real-time 3-D specimen, from slide 3 of the Ongoing Care deck

Peter: "for slide 3 update the clinic visualizer system anatomy page + handoff". The real-time 3-D hypothalamus built for slide 3 of the Ongoing Care deck (`<hypo-3d>`, menopause-foundation-presentation `graduation-ongoing-care`, commit `971c31b`) now runs inside A2 as its **one WebGL layer**. Everything else about the card is unchanged: the four buttons, the readouts, the scene line, the caption and legend (compliance-reviewed wording, not a word changed), the idle tour and the numbers.

**What you see.** A block of cleared hypothalamic tissue, cut just across the midline, lit as a translucent volume. Structures sit at their real depths and fade the deeper they lie: the KNDy cluster at the base, the heat-loss centre (MnPO) by the lamina terminalis, beaded axons, neurokinin-B packets, estrogen docking, the fornix, the anterior commissure, vessels; under the block the chiasm and nerve stump, the stalk with its portal loops, the pituitary lobes in a bony cup, and a contact shadow. A sideways drag turns it (±30°); it eases back.

**How it fits the figure.**
- `gl/` holds the source, copied from the deck and adapted: `hypo3d-scene.js` (renderer), `hypo3d-geo.js`, `hypo3d-anatomy.js` (A2's section paths lifted into 3-D), `hypo3d-model.js` (the simulation) and `a2-layer.js` (the entry `live.js` drives). `gl/build-gl.sh` bundles them with three.js r186.1 into one classic script, `gl/hypothalamus-3d.js` (committed, with `gl/chunk.json`); `build.mjs` copies it into `embed/`.
- **One source of numbers.** The 3-D simulation imports `KNDY`, `kndyOf` and `wanderAt` from this folder's `model.mjs` (the deck had a copy). `build.mjs` refuses to build if the 3-D layer's section paths (KNDy positions, axons, median-eminence axons, the output path, vessels) drift from the SVG's, or if `gl/hypothalamus-3d.js` is older than its sources (`gl/stamp.mjs`). So bursts, packets, drive and every flash land at the same moments in both.
- `live.js` keeps the card and the tour; with the 3-D layer up, the SVG's own loop only keeps the tour clock.
- **First paint and fallback: the SVG.** The canvas sits under the drawing and covers the stage exactly (nothing moves when it arrives). After its first frame the drawing's specimen fades out over 0.9 s and the canvas fades in; the locator stays on top. The SVG stays the figure with no WebGL 2 (or only a software renderer: `failIfMajorPerformanceCaveat`), without float render targets, on Save-Data or 2G, with `deviceMemory` < 3 GB or fewer than 4 cores, if the chunk can't load, if a shader fails to link, if frames stay slower than ~22 fps after the resolution governor has done what it can, and with `gl="off"` on the element (`?gl=off` on the pages). A lost WebGL context hands the figure back to the SVG and returns to 3-D when the context is restored. `stage.dataset.gl` says which: `on`, or `svg:<reason>`.
- **Reduced motion** follows the repo convention (A4): one still frame, here A2's own still in 3-D (after: mid-flash; before: just after a burst), no fade and no sway. A drag still turns it, drawn on demand.
- **Lazy.** Nothing 3-D downloads until the figure is within 600 px of the viewport, then only once the page is idle (`requestIdleCallback`, 1.5 s timeout). The scene builds in short steps, every shader compiles in parallel against the target it really renders into (`compileAsync`), and three's per-shader error logs are off (they made the first frame wait on the GPU); `linked()` checks every program once instead.
- **Phones.** Coarse pointers get a lighter build (one icosphere step less, ~60 % of the tube segments: 74 k triangles instead of 215 k, same shapes), a 1024 shadow map, and a pixel ratio capped at 1.5 (2 elsewhere; never more than 1.8 M canvas pixels). The adaptive governor from the deck stays: it renders 15 % fewer pixels when frames average under 50 fps, stops adapting if that didn't help (a 30 Hz low-power cap), gives pixels back with headroom, and gives up (back to the SVG) below ~22 fps at the floor. Nothing renders off screen, in a hidden tab, or while the host has taken the element off the page.
- **Drag on phones:** the stage keeps `touch-action: pan-y`, so up-and-down swipes still scroll the page. The hint gains "· Drag to turn" at mount (before the layer arrives, so the footer never changes height).

**Forest night is new.** The deck was tuned on cream only; its Cream look is kept exactly (`uSigma 0.0090`, `uOnset 85`, same lights and colours). Forest night reads as a dark-field specimen, like A2's own dark theme (a fluorescence slide): smoky plum tissue (`#3b2f48` → `#271d31`) on a dark backing so the forest plate never shows through thin tissue as grey-green, lavender cut faces and rim lines, a cool lavender rim light, a forest-green bounce from below, cells with brighter cores and stronger glows (KNDy magenta, MnPO mint, flash orange), muted bone, a quieter specular sheen, and a near-black contact shadow. Colours only: every size and motion is the model's.

**Fixed on the way (deck bug, worth porting back):** `physMat` added its `USE_SSS`/`USE_CORE`/`USE_NBUMP` defines inside `onBeforeCompile`, which changed each material's program key after its first compile, so every physical material compiled twice and the second, synchronous compile landed on the first frame (≈0.5 s blocked on an M4). The defines now go on the material up front.

**Numbers.** Nothing new is shown or sourced. The model, its sources and its ILLUSTRATIVE flags are unchanged (see "Numbers" above). Drawn, not sourced, as in the deck: the depths of structures in the block, the drawn cell radii (KNDy 9.2, MnPO 8.0 section units; size *changes* come only from `kndyOf`), the tissue haze, glows, colours and the camera.

**Host API** (for the clinic TV; the site needs none of it):

| Attribute / property | Does |
|---|---|
| `stage="before\|after\|therapy\|nonhormonal"` | Shows that state now (readouts, scene line, 3-D). The tour, if any, carries on from it after a full 12 s. Setting it again restarts that 12 s. |
| `tour="before,after"` / `tour="none"` | Which states the idle tour visits, in that order (default: all four). `none` (or one state) means the host drives it. |
| `size-readout="word"` | The KNDy-size readout reads Small / Larger / Smaller / Larger instead of 100 % / 194 % / Smaller / 194 % (the 194 % rests on a LOW source). Stable selector: `[data-r="size"]` (and `[data-stat="size"]`). |
| `gl="off"` | Keep the SVG drawing (never download the 3-D chunk). |
| `gl-src="<url>"` | Load the 3-D chunk from somewhere other than next to the embed script. Element attribute only: the standalone pages ignore `?gl-src=` in the URL, because it loads a script (a crafted link could otherwise run code on the shared github.io origin). |
| `.stage` (property) | The state shown now (`"before"`…); setting it sets the attribute. |
| `stagechange` event | `detail: { stage, source: "tour" \| "user" \| "host" }`, bubbles, composed. |

Taken off the page, the element stops (no animation frames, no listeners on the document); put back, it carries on with the same WebGL context, so a host that re-attaches one cached element never creates a second context, and a host that drops it lets it be collected. The standalone pages read the same names from the URL (`?stage=after&tour=none&size-readout=word&gl=off`), except `gl-src`.

**Sizes.** `optimal-fig-hypothalamus.js` 256,119 bytes (75,090 gzip; +11.7 KB raw over round 3 for the loader and the host API); `hypothalamus-3d.js` 633,678 bytes (169,253 gzip), loaded only where the 3-D runs. Kept as a separate file so a page pays nothing for three.js until the figure is near and the device can run it; inlining it would make every A2 page load ~3.5× more script up front, including the phones that end up on the SVG. Cards are the same height as round 3 (re-measured at 358 and 760 px, desktop and touch at 3×: 1281 / 1306 px; reserves 1311 / 1306 unchanged).

**Measured headless** (Chrome, Apple M4 GPU via ANGLE Metal; not a phone; frame rates are vsync-bound):
- 390 px phone emulation (touch, 3×, lite build, 74 k triangles, pixel ratio 1.5): 60 fps; 3-D on 0.9 s after navigation; per-frame main-thread cost 1.4 ms median (2.9 ms at 4× CPU throttle, 4.6 ms at 6×). Longest task the 3-D adds: ~160 ms at 4× throttle (evaluating the chunk); first frame 25 ms (42 ms at 4×). CLS 0.
- 1280 desktop (215 k triangles, pixel ratio 1.88 under the 1.8 M-pixel cap): ~59 fps, 1.8 ms per frame on the main thread.
- TV mock, 1100 px, Forest night: 60 fps; 20 detach/re-attach cycles: one context, zero animation frames while detached.
- Real phones are unmeasured: check a mid-range Android and an older iPhone (DEV_TODO).

**Verification (2026-10-21).**
- `node scripts/verify.mjs a2-hypothalamus`: passed. Line ends 0 on both themes, no sideways scroll at 390/360/320 in either theme, console clean everywhere, reduced motion still.
- Captures (all with the 3-D layer up): `shots/phone-{390,360,320}-{light,dark}.png`, `shots/desktop-{light,dark}.png`, `shots/reduced-390-{light,dark}.png` (Before); `shots/desktop-{post,therapy,blocker}-{light,dark}.png` and `shots/phone-390-{post,therapy,blocker}-{light,dark}.png` (After mid-flash, hormone therapy, non-hormonal; phone shots as a touch phone at 3×); `shots/svg-fallback-390-{light,dark}.png` (`gl=off`); `shots/tv-1100-{before,post}-dark.png` (the TV's own CSS, `tour="before,after"`, `size-readout="word"`).
- Fallbacks checked headless: no WebGL, `gl=off`, Save-Data (all stay SVG and never fetch the chunk), context loss and restore, chunk missing (`svg:load`), reduced motion.
- `handoff/qa/check-embeds.mjs` now checks that the 3-D layer comes up on the page and that the SVG fallback works without WebGL.

**Open for Peter.**
1. **Is this the A2 you want on the site and the TV?** Until you say so, the round 3 SVG is the approved version; `gl="off"` (or not copying `hypothalamus-3d.js`) ships exactly that.
2. **Real phones:** the frame rate and heat on a mid-range Android and an older iPhone are unmeasured. The governor and the give-up should keep it smooth or fall back, but it needs a hand-held check.
3. **Cream:** kept exactly as the deck. The left third of the block reads lighter because rays leave through its left end (thinner tissue); say if you'd like it denser on the cream page.
4. **A2's flash cadence:** the deck's notes point out that `live.js` tips every ~6.5–8.6 s once settled, while round 1's notes say 10–20 s. The code (and so the 3-D) follows the code; a slower cadence is a change to `refractory` in `model.mjs`.
