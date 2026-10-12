# A3b · The finger's heat valves · 3-D prototype

**Why it exists:** Peter's round-2 note (Q10): "The anatomy stuff is okay but not great, can you make the design more beautiful? Is there an issue with making these isometric 3-D?" This is the answer in one figure. It is A3's exact section mapped onto the front face of an isometric cut-away tissue block, the textbook skin-block view, so the A-series can match the isometric machines (Figs 1–6).

**What's shared with A3:** everything that moves. The build reads A3's `model.mjs`, `live.js` and `figure.css`, so numbers, animation, monitor and readouts are identical and can't drift. A3's `live.js` gained one optional hook: in a flash it also warms the block's top and side faces (`data-part="topwarm"` / `"sidewarm"`). On the flat A3 those parts don't exist and the hook does nothing.

## Construction
- **Projection:** kit `fitProjection`, azimuth 62°, elevation 24°. At 30° the front section was too foreshortened to read on a phone; at 62° the section stays almost face-on while the top and the end still show depth.
- **Front face:** the A3 section SVG, placed with `planeMatrix` on the block's y = D plane, so every vessel, shunt and blood cell animates in place.
- **Top:** the friction-ridge profile extruded back along y, with alternating lit and shaded strips, sweat pores on the crests and the heat wisps rising off it.
- **End face:** the same layers as flat bands (horny layer, epidermis, venous plexus, dermis, deep arteriole, fat), cut at the right edge of the section, so the layer depths match.
- **Block depth:** 170 units, shadow under the block.

## Verification (2026-10-12)
- Dark and Cream at desktop; Cream at 390 and 320 (no horizontal scroll); reduced motion still. Console clean; line ends 0.
- Shots: `shots/desktop-flash-light.png`, `desktop-flash-dark.png`, `phone-390-light.png`, `phone-320-light.png`, `reduced-390-light.png`.

## Status and next step
Prototype for review. If Peter likes the look, the same treatment suits the other "slab" pieces: muscle (A8), bone (A9), gut lining (A1), alveolus wall (A5). Organ pieces (heart A4, hypothalamus A2) don't fit a block. They'd need hand-drawn shading in 3-D instead, which is more work per piece.
