# A8 · Water in and around the fibres

**What it is:** a slice across a bundle of muscle fibres from the upper arm: the tissue-level view behind Fig 2 (InBody 580). It is hand-drawn organic SVG: 44 fibres packed by a Lloyd-relaxed Voronoi diagram, with:
- two fibre types in slightly different reds;
- myofibril speckle inside each fibre;
- nuclei pressed to the fibre edge;
- capillaries in the corners between fibres;
- fluid in the gaps;
- a perimysium sheath around the bundle;
- a small arm locator showing where the slice is taken.

**Mapping in one sentence:** InBody's current runs along the arm, so in this slice it flows toward the viewer (⊙). At 5 kHz it appears only in the gaps (extracellular water). At higher frequencies a share of it appears inside the fibres, using Fig 2's `throughShare("arm", f)`: 2 / 17 / 23 / 24 % at 5 / 50 / 250 / 500 kHz. The scene buttons change the fibres or the fluid between them, and the readout gives the whole-body ECW/TBW that change would produce.

## Numbers (truth pack, "A8")

| Scene | Fibres | Spacing | Fluid between | ECW/TBW | InBody band |
|---|---|---|---|---|---|
| Typical | 1 | 1 | 1 | 0.380 | Normal |
| Bigger | ×1.04 | ×1.04 | 1 | 0.369 | Normal |
| Smaller | ×0.93 | ×0.93 | 1 | 0.399 | Slightly over |
| Extra fluid | 1 | ×1.07 | ×1.7 | 0.413 | Over |

**The model:** skeletal muscle holds about half the body's water (LOW). Muscle water is 16 % extracellular (LOW). The rest of the body's ECW share is set so that "typical" reads 0.380 (InBody's typical value [17]). Fibre water scales with fibre area; gap water with gap × fibre perimeter. Only the muscle changes in a scene.

## Decisions

- **Current drawn out of the page.** In a limb the current runs along the fibres, so a cross-section shows *where* it flows, not a sideways path. This avoids the common schematic in which current snakes across cells.
- **The point is the ambiguity:** "Smaller" and "Extra fluid" both read high, so a high ratio says the balance shifted, not why. This is Fig 2's round-2 idea ("a high ratio doesn't say why"), done at tissue level.
- **No diagnosis:** the scenes are typical shifts, not conditions. The caption says it's a teaching model and gives InBody's bands.
- **Dropped from the backlog line:** "actin and myosin slide" was cut to keep one idea per figure. The myofibrils show as speckle inside each fibre. A sarcomere strip could be its own small piece later.

## Interaction

- **Scene** (Typical / Bigger / Smaller / Extra fluid) and **Frequency** (5 / 50 / 250 / 500 kHz): two radiogroups with arrow keys, 44 px. At 320 px, "Extra fluid" wraps onto two lines inside its button.
- **Idle tour:** typical at 5, 50 and 500 kHz, then each scene at 50 kHz, every 4.5 s. It resumes 9 s after the last input.
- **Offscreen:** rendering stops out of view.
- **Reduced motion:** one still with the ⊙ marks placed for the current frequency. Each button redraws it.

## Verification (2026-10-12)

- No console errors.
- No sideways scroll at 390, 360 or 320, in both themes; the control rows fit at 320 (scrollWidth = clientWidth).
- `lines.mjs`: 0 (no kit lines).
- Captures: `shots/phone-{390,360,320}-{dark,light}.png`, `shots/desktop-{dark,light}.png`, `shots/desktop-fluid-{dark,light}.png` (extra fluid, 500 kHz), `shots/reduced-390-*.png` (smaller), `shots/embed.png`.

## Embed

```html
<script src="https://optimal-research-team.github.io/optimal-anatomy-figures/a8-muscle-water/embed/optimal-fig-muscle-water.js" defer></script>
<optimal-fig-muscle-water theme="light"></optimal-fig-muscle-water>
```

## Open for Peter

1. **Placement:** under Fig 2, as "what ECW/TBW is measuring".
2. **The model's two LOW numbers** (muscle ≈ half of body water; muscle water 16 % extracellular) are textbook-level. Worth a source check before the scene values (0.369–0.413) appear on a page; the direction of each shift is solid.
3. **Wording** of the "Extra fluid" scene: deliberately not called oedema or inflammation (no diagnosis).

## Round 2 (2026-10-12): 3-D bundle
Peter approved the isometric look (A3b), so the slice is now the front face of a 3-D fascicle. The bundle is an elliptic cylinder running back into the arm, at the same projection as A3b (azimuth 62°, elevation 24°).
- **Front face:** the original slice, unchanged, placed with `planeMatrix`. All the live drawing (fibres, fluid, capillaries, ⊙ current) still happens in section coordinates.
- **Body:** drawn in the browser by `drawBody()` in live.js, from the projection basis in `DATA.body`, so it swells and shrinks with the scenes (`g.spread`). It shows:
  - the sheath (perimysium);
  - the fluid;
  - the outer fibres running back as bands at the same angles as the face's edge fibres, with fine cross-striations;
  - capillaries in the grooves;
  - a cylinder shade square to the axis.
- **Visibility:** only the half of the cylinder facing the viewer is drawn (`DATA.body.ta`–`tb`, from the view vector). That half doesn't depend on the spread, because RX and RY scale together.
- **Verified:** both themes; 320 px; Extra fluid scene; console clean; line ends 0.

## Round 3 (2026-11-10): the bundle in real-time 3-D (shared/gl3)
The same bundle, modelled and lit, under the SVG. `gl-scene.js` holds the scene (the layer's `build` hook); `build.mjs` inlines it and passes the projection (`DATA.P`, the same `PB` the drawing uses) and `DATA.gl3`. World units are the section's own, so every part sits where the drawing has it (checked by laying the drawing over the render at 50 %: fibres, nuclei, capillaries and sheath coincide in every scene).

- **Fibres:** one prism per fibre (44), cut from the drawing's own outline (the same Catmull-Rom through the cell's corners as `smooth()`), run the length of the bundle, with a rounded shoulder and a slightly pillowed cut face. Myofibril ends stipple the cut face and cross-striations band the sides (both procedural in the fibre's shader; each fades out before it is too fine to resolve, so phones don't shimmer). Two fibre types, two materials, in the drawing's reds.
- **Fluid:** a glossy bed on the cut face that the fibres stand 3.5 units proud of, and a bed along the body that follows the outer fibres just under their outer faces, so it shows as the blue floor of every groove (the drawing's blue between the bands).
- **Sheath:** an opaque cut rim (the drawn 9-unit ring), then a clear wet film along the body, denser toward its outline: the drawing's 14 % veil and edge line.
- **Capillaries:** cut ends in the corners between fibres (pale wall, red lumen; instanced), and fine vessels in the outer grooves, beside the blue, as drawn.
- **Nuclei:** flattened ovals at the edge of each fibre's cut face (instanced), at `fibrePt(cell, mid-edge, 0.86)` as in the drawing.
- **Motion:** `drawTissue()` hands the layer the drawing's own state (`g.fibre`, `g.spread`) and renders one frame. Fibres are moved and scaled, instances re-placed, the sheath and face fluid scaled; only the small groove bed (about 300 vertices) is re-laid. The layer draws only while a scene is easing; at rest it costs nothing.
- **Still in the SVG, on top:** the ⊙ current marks (they are symbols, and stay crisp at phone size) and the arm locator. The drawn tissue carries `data-gl3-hide`; with the layer off (`?gl=off`, no WebGL 2, Save-Data, small devices) the drawing is the figure, pixel for pixel as before (compared against the committed build with the random marks hidden: no difference).
- **Theme:** `island: false`, so Forest night keeps its own ground; the palette for each theme is `figure.css`'s, as lit surfaces.
- **Budget:** 52 draw calls (44 fibres + 8), about 88 k triangles on desktop and 33 k on touch devices (coarser outlines and rings).
- **Arrival:** the drawn tissue fades out as the render fades in (`figure.css`); under reduced motion it switches at once.
- **Not carried over:** nothing dropped. The drawn cylinder shade and edge line are now the light and the film's own rim.
- **Verified:** `node scripts/verify.mjs a8-muscle-water` passes (390 / 360 / 320, both themes, reduced motion, desktop, lines 0, console clean); the embed (`embed/test.html`) runs the layer inside its shadow root.
