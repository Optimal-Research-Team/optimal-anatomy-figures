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
