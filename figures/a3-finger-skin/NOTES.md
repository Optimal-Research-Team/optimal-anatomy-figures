# A3 · The finger's heat valves

**What it is:** a cut-away block of fingertip skin, seen in isometric 3-D: the inside view of Fig 1's "+2.7 °C at the finger". The section is hand-drawn organic SVG on the block's front face; the ridged top and the cut end show depth. It is driven by **Fig 1's `flashAt(t)`**, whose source is inlined, so the shunts, the warmth, the monitor and the readouts can't disagree with Fig 1.

**Mapping in one sentence:** in a hot flash, `flashAt(t).louvre` (Fig 1's vasodilation) opens three coiled arteriovenous shunts. Their glomus muscle relaxes, the lumen widens, the sympathetic nerve stops firing, and arterial blood takes the shortcut into the venous plexus under the epidermis. The plexus swells and turns arterial red, the dermis warms by `skin / 2.7`, and heat rises off the surface. The monitor plots Fig 1's finger temperature.

## Parts

- **Surface and epidermis:** friction ridges and the horny layer; keratinocyte speckle; dermal papillae pointing up, each with a capillary loop (arterial up, venous down).
- **Dermis:**
  - the venous (subpapillary) plexus;
  - four ascending arterioles feeding the loops;
  - a deep arteriole;
  - three coiled shunts, beaded with glomus cells;
  - a sympathetic nerve branching to each shunt;
  - collagen strands;
  - two eccrine sweat glands with ducts spiralling up to pores on the ridge crests.
- **Below:** subcutaneous fat lobules; cut edges at both sides.
- **Blood:** cells flow through the arteriole. A few take the slow road up a feed, round a capillary loop and into the plexus (darkened, venous). In a flash many take the shunts straight into the plexus and stay oxygen-red.
- **Monitor:** finger skin temperature from −1 to 30 minutes, with the "shunts open" band, the +2.7° line and a live dot.

## Numbers (truth pack §1, Fig 1's model)

| Minute | Shunts (louvre) | Finger skin | Heart rate |
|---|---|---|---|
| before | 0 | +0.0 °C | +0 |
| 0.3 | 0.94 | +0.6 °C | +9 |
| 1 | 1 | +2.7 °C | +10 |
| 3.4 | 0.42 | +2.1 °C | +4 |
| 7 | 0 | +1.5 °C | 0 |
| 15 | 0 | +0.7 °C | 0 |
| 30 | 0 | +0.2 °C | 0 |

## Decisions

- **Shunt anatomy is qualitative** (truth pack "A3", LOW–MEDIUM). Coiled arteriovenous anastomoses wrapped in glomus cells, under sympathetic vasoconstrictor tone, found in glabrous skin (fingertips, palms, soles). No shunt sizes or flow numbers are shown.
- **"The brain's heat-loss centre releases that squeeze"** links to A2. Withdrawal of sympathetic tone is the main way these shunts open; the caption says no more than that.
- **No sweat drawn.** Flash sweating is mostly on the upper body, so the finger's glands are drawn but stay idle.
- **Time compression:** 0.35 min/s for the first 8 minutes, then 2.5 min/s to minute 30. The hint says "time speeds up after minute 7".
- **The caption gives the 1–7 °C range** (Kronenberg 1994 via §1) so +2.7 reads as typical, not universal.

## Interaction

- **A hot flash** (loops −1 → 30 min, about 34 s) / **Between flashes** (held before onset): a radiogroup with arrow keys, 44 px.
- **Offscreen:** rendering stops out of view.
- **Reduced motion:** one still at minute 1 (peak), or the between-flash state.

## 3-D block (round 2; A3b folded in 2026-10-12)

**History:** Peter's round-2 note asked for the anatomy to be "more beautiful" and isometric 3-D. The 3-D version was prototyped as A3b (`a3b-skin-block`) and approved ("a3b is great"). **Peter's decision, 2026-10-12: retire flat A3, and flat anatomy figures in general.** The A3b build now lives here as A3, with slug `finger-skin`, so the embed stays `optimal-fig-finger-skin`. `figures/a3b-skin-block` is deleted and A3b is gone from the gallery.

- **Projection:** kit `fitProjection`, azimuth 62°, elevation 24°. At 30° the front section was too foreshortened to read on a phone. At 62° the section stays almost face-on while the top and the end still show depth.
- **Front face:** the section SVG, placed with `planeMatrix` on the block's y = D plane, so every vessel, shunt and blood cell animates in place. `live.js` draws in section coordinates, as before.
- **Top:** the friction-ridge profile extruded back along y, with alternating lit and shaded strips, sweat pores on the crests and the heat wisps rising off it.
- **End face:** the same layers as flat bands, cut at the right edge of the section so the layer depths match: horny layer, epidermis, venous plexus, dermis, deep arteriole and fat.
- **Warmth:** in a flash `live.js` also flushes the top and end faces (`data-part="topwarm"` / `"sidewarm"`).
- **Block depth:** 170 units, with a shadow under the block. Block styles are in `block.css`.

## Real-time 3-D block (2026-11-11, `shared/gl3`)

With the shared 3-D layer on, the block is a modelled scene (`gl-scene.js`, inlined by `build.mjs`) rendered under the SVG in the block's own projection and units. The drawn block carries `data-gl3-hide`; the monitor stays SVG on top. Wherever the layer can't run (`?gl=off`, no WebGL 2, Save-Data, small devices, a lost context) the drawing above is the figure, unchanged.

- **Same anatomy, same positions, given depth.** World units are the section's px (x along the cut, y into the block, z up; the cut face is y = 170). What the drawing lays flat on the cut face runs at a depth behind it, set in one place (`A3D` in `gl-scene.js`) and used by both the tubes and `live.js`'s blood routes, so cells ride inside the vessels:
  - deep arteriole about 38 units in; the drawn plexus lane about 10 in, with two more lanes behind it and cross-links (the plexus is a net, as the caption's "network of veins" says);
  - each shunt is a helix (the drawn zigzag is its front view), from the arteriole forward and up to the plexus;
  - capillary loops lean toward the cut face so each top stands just behind the cut in its papilla (deeper in, the epidermis round the papilla would hide it from this camera). The loops are also 15% narrower and 2 units lower than drawn, for the same reason;
  - the four ascending arterioles run on to the loop they feed (the drawing stops them under the plexus; the route already continued);
  - nerve about 6 units in, in front of the shunts as drawn, with a twig ending on each; the two glands 26 and 65 units in, each duct climbing to a pore on a ridge crest.
- **Epidermis:** a solid slab. Ridged top with pores along the crests (ridges drift up to 11 units sideways toward the back; nil at the cut face). The cut faces are painted sections (horny layer, cells flattening upward, basal row). Dermal papillae run back as ridges under it.
- **Dermis:** see-through. Everything inside mixes toward the dermis colour by the length of tissue between it and the viewer (closed form: the camera is fixed), clear for the first stretch, then hazing. Fat lobules are a cobbled bed across the whole floor.
- **Vessels you look into** (arteriole, plexus, shunts): a flat backdrop of blood, the model's cells, then a wet see-through wall. Fine vessels (ascending arterioles, loops) are plain tubes and a passing cell shows as a bead.
- **Driven by the same state** (`draw3` in `live.js` → `update` in `gl-scene.js`):
  - `open` (Fig 1's louvre): plexus radius ×(7+7·open)/7 and venous → arterial colour by 0.15+0.6·open; shunt sleeve ×(7+6·open)/7; lumen ×(1.6+7.4·open)/1.6 and its colour by 0.4+0.6·open, the drawing's own widths and mixes. The sleeve's wall also thins to the eye as it relaxes.
  - every blood cell of the model, at its place on its route; every nerve impulse;
  - `warm` (skin / 2.7): the dermis and the epidermis flush, heat wisps rise off the whole top.
- **Three small departures from the drawing's motion, on purpose:**
  1. Glomus cells ride out with the sleeve as it relaxes (5.5 → 7.5 units from the centre line; the drawing's fixed 7.5 is where they stand open). Fixed, they floated clear of a shut shunt in 3-D.
  2. A cell turns from arterial to venous colour as it passes through its loop (the drawing switches at the loop's foot).
  3. Cells are scaled to the vessel they are in (the drawing draws one size).
- **Reduced motion:** as before, one still (minute 1, or between flashes), rendered once.
- **Cost:** 30 draw calls in the main pass. Desktop about 182k triangles plus about 200 per live cell (≈230k at the peak of a flash); touch devices about 89k plus 112 per cell (≈117k).
- **Shared-layer notes:** the layer's `stats()` reports the last pass only (1 call), so the numbers above are counted from the scene. A bump map on the ridged top produced a single NaN pixel at phone size under the layer's MSAA; the top uses an albedo map only.

### For review (anatomy, not changed here)
- The drawing puts a dermal papilla directly under each ridge crest, so each sweat duct enters the epidermis through a papilla tip. Textbook fingertip skin has an epidermal (glandular) ridge under the crest, with the duct entering there and papillae either side. The 3-D model follows the drawing; worth a look if the figure gets a clinical read.

## Verification (2026-10-12, 3-D, local)

- `node scripts/verify.mjs a3-finger-skin`: passed.
- No console errors, and no sideways scroll at 390, 360 or 320 in either theme.
- `lines.mjs`: 0.
- 2026-11-11, with the 3-D layer: `node scripts/verify.mjs a3-finger-skin` passed (the stage ends at `data-gl3="on"` on every run, console clean; the line check runs on the drawing with `?gl=off`: 0). The embed test page runs the layer too. The shots below now show the rendered block.
- Captures (about minute 0.8, in the flash): `shots/phone-{390,360,320}-{dark,light}.png`, `shots/desktop-{dark,light}.png` and `shots/reduced-390-*.png` (the still at minute 1, the peak).

## Embed

```html
<script src="https://optimal-research-team.github.io/optimal-anatomy-figures/a3-finger-skin/embed/optimal-fig-finger-skin.js" defer></script>
<optimal-fig-finger-skin theme="light"></optimal-fig-finger-skin>
```

## Open for Peter

1. **Placement:** on the Menopause page with Fig 1 and A2. They read as one story: brain switch (A2) → thermostat (Fig 1) → finger valves (A3).
2. **A source for the shunt anatomy** (e.g. a physiology review of glabrous-skin AVAs) would move it from textbook to cited.
