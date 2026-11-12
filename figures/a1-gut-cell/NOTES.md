# A1 · The gut cell's gate

**What it is:** a cut-away block of gut lining in isometric 3-D (round 2, 2026-10-12). Its front face is the hand-drawn cell section from the style test: Catmull-Rom outlines turned into Béziers, soft fills in the figure's own inks, and one membrane line weight. The card, controls, readout and both themes are the same as the other figures.

**Mapping in one sentence:** one duodenal lining cell in section. Iron enters at the brush border through DMT1 channels and is either held in ferritin cages or leaves at the base through ferroportin into the capillary, where transferrin (two iron sites) carries it away. Hepcidin from the blood docks on a ferroportin, and the cell pulls the channel in as a vesicle and breaks it down, so fewer ways out remain.

## Parts

- Gut lumen with arriving iron, and microvilli across three cells; the two neighbours are dimmed.
- Five DMT1 channels on the main cell's villus tips; a terminal web and tight junctions.
- The cell: four mitochondria, the nucleus and nucleolus, three ferritin cages (24 subunits round an iron core that fills).
- Five ferroportin places on the base, the basement lamina, and the capillary with its endothelium, red cells and transferrin.

## Numbers

- **Gate share** for the three moments comes from Fig 3's model (`figures/03-iv-iron/model.mjs`, gate = 1 / (1 + hepcidin)):
  - iron-hungry: 97 % at day 0;
  - daily pills: 50 % just before day 7's dose;
  - stores full: 45 % at day 14 after IV.
- **Working channels** = round(5 × gate): 5, 3 and 2 drawn.
- Every other count (iron dots, cages, cells) is a drawing, and time is sped up. The caption says so.
- **Mechanism sources:** truth pack §3 (Nemeth 2004; Hentze 2010; DMT1 Gunshin 1997; enterocyte turnover). These are marked [K], since they were not re-opened this session.

## Decisions

- **Readout in the same terms as Fig 3** ("Gut gate % open"), so the two figures agree on the page.
- **Hepcidin drawn as a small hairpin** in the heat accent, iron in rust, ferroportin in the lit accent (forest in Cream, cream in Forest night). Red only for red cells, as in Fig 3.
- **Dcytb and hephaestin left out** (the enzymes that change iron's charge on the way in and out), to keep one idea per figure. They're a caption-level detail if wanted.

## Round 2 (2026-10-12): 3-D block

Peter's decision: retire flat anatomy, and A1 goes 3-D. Same recipe as A3, A8 and A9 (HANDOFF-LOCAL §6): azimuth 62°, elevation 24°, depth 210. World units are section px.
- **Front face:** the original section, placed with `planeMatrix` on the y = D plane. `live.js` is unchanged: iron, hepcidin, ferroportin, vesicles and blood all still draw in section coordinates. The lumen backdrop is gone, so iron arriving from food drifts down in open space above the block. A lateral-space fill sits behind the cells, and the neighbour cells run past the cut edges, so the block is solid and the cuts are flush.
- **Top: the brush border from above.** 272 microvilli stand on the apical surface as shaded capsules, drawn back to front by depth. The apical surfaces form a loose honeycomb: the front row's borders meet the section's cell borders (x = 147 and 453), and the back row sits half a cell over. Microvilli stop 12.5 units short of every border, so the tight-junction belts read as grooves. The main cell's patch is a shade warmer, and its microvilli carry DMT1 caps (every third), matching the section.
- **Right end:** the cells cut along their length, with two cells split by a lateral membrane exactly where the honeycomb border crosses x = X1. Also on this face:
  - nuclei near the base and mitochondria;
  - the basement lamina;
  - connective tissue with collagen strands and spindle fibroblasts;
  - the capillary as a half-tube where it meets the front face, with a red cell cut across.
- **Neighbours:** muted by tone, not opacity, so nothing shows through.
- **Painter's order:** shadow → top texture (clipped to the face) → back edges → microvilli → end face → edges → front group.
- **Caption:** "Drawn far larger than life and simplified: a real lining cell carries many more, much finer microvilli". No number added.
- **Anatomy check:**
  - enterocytes are polygonal in apical view;
  - the brush border is interrupted at the junctional complexes;
  - capillaries of the lamina propria lie just under the basement membrane;
  - fibroblasts and collagen sit in the lamina propria.

  All textbook-level ([K]), and no numbers ride on them.

## Round 3 (2026-11-10 to 11): a real-time 3-D scene on the shared layer

With the shared WebGL layer on (`shared/gl3`), the block is rendered as a 3-D model (`gl-scene.js`, inlined by `build.mjs`). The SVG drawing is unchanged and is still the figure wherever the layer can't run (`?gl=off`, no WebGL 2, Save-Data, a small device, a lost context): with the layer off the page is pixel-for-pixel what it was. No number, word, control or model rule changed.

- **Same place, same camera.** The scene is built in the block's own world units, in the drawing's projection (`PB`). Every part sits where the drawing has it. What floats inside a cell is pushed back from the cut along the line of sight (`lift()`), so it still projects onto its drawn position: a ferroportin gate in the render lands within a pixel or two of the drawn one.
- **The cells are cups of gel.** Each of the five honeycomb cells is a thin-walled cup, open where the block is cut. What shows through a cut is veiled by how far the line of sight ran inside the cell (one term in the materials: no see-through sorting, no extra pass). The traced cell is clear, its neighbours milky, so the neighbours stay muted by tone as before. A gloss-only pass puts the studio's strip light on each cut face.
- **Inside the traced cell:** nucleus (the nucleolus shows through its envelope where the drawing has it), four mitochondria, three ferritin cages with 24 subunits on the cage's real 4-3-2 form and a core that fills, the terminal web as a layer under the brush border.
- **On top:** one capsule per drawn microvillus (the drawn front row stands just behind the cut), DMT1 as a pair of small channels in each tip the drawing marks.
- **Underneath:** lamina, lamina propria with the drawing's own collagen strokes and fibroblasts in low relief, the capillary cut along its length, biconcave red cells, two-lobed transferrin.
- **Motion:** `live.js` hands its state (`irons`, `heps`, `slots`, `fill`, `tf`, `rbc`) to the scene every frame. The scene keeps no clock and decides nothing. Iron keeps its drawn position at every stage and only changes depth (in front of the microvillus on the way in, into the gel in the cytoplasm, forward again at the gate). A gate that hepcidin has docked on is pulled in inside a vesicle and fades, exactly on the drawing's timings; an empty seat is left in the membrane.
- **Shading:** the shadow and occlusion passes see one plain block where the cells are (the cups themselves and the small movers stay out of them), so a cut face is flat and clean and the gates are still seated on it. On phones the layer's occlusion is coarse, and small moving parts would shimmer in it.
- **Colours** are read from the figure's own CSS inks at run time, so both themes follow `figure.css` and `block.css`.

**Where the render differs from the drawing** (all forced by it being one consistent solid):

1. On the right end, the border between the two cut cells sits where the honeycomb on top actually reaches the end (y ≈ 73 of 210), not at the drawn end face's mid-line (u = 102). The back-row cell's nucleus moves back with it.
2. The neighbours' nuclei are real bodies inside milky cells, so the right neighbour's (drawn on the end face) and the left neighbour's also show faintly through the front. The terminal web is a layer in every cut cell, not only the traced one.
3. The nucleus of the traced cell is whole, behind the cut, instead of cut through.
4. Red cells that reach the right end are cut by it as they pass; the drawing has one fixed cut red cell there.

**Cost:** 28 meshes (about 23 drawn at a time), about 150 k triangles on desktop and about 70 k on touch devices (fewer segments, same parts). Nothing is rebuilt per frame: instances and a few uniforms move.

**Shared layer, worked round in the figure:**

- its floor-shadow passes draw an instanced mesh once, at the mesh's own origin (their shaders have no instancing), so every instanced mesh here hangs from a point inside the block;
- its `stats()` reports the last pass only (1 call, 1 triangle), so the counts above were taken in the scene;
- there is no clipping-plane switch, so parts that leave the block's ends are cut in their own shader.

### Round 3b (2026-11-12): Cream with presence

Review: on Cream the block was pale cream gel on a cream page and lost the drawing's definition. Cream only: Forest night, the model, numbers, words and controls are untouched (every Cream value sits behind `night ? … : …` in `gl-scene.js`, Forest night's mesh and shaders are the ones it shipped with, and `look` is picked by theme in `live.js` because one embed script serves both).

- **The gel is the block's mid tone.** It moves from the cell ink toward the drawing's own deeper inks (top, lateral, membrane): honey for the traced cell, a greyer tan for its neighbours. It deepens toward the base, where the line of sight runs far, and on the end face (the drawing shades that side too). The inner walls are deeper still and veil more slowly, so every cut face has a soft deeper edge under a firmer membrane line.
- **What floats in it is lit against something deeper**, as in Forest night: an ivory nucleus with a darker nucleolus, golden banded mitochondria, grey-brown ferritin cages round rust cores, rust iron beads that veil less, the forest gates. Two small terms in the material give them form the bright Cream studio doesn't: surfaces facing down and away from the key are darkened (the drawing shades its microvilli the same way, light on the left).
- **Brush border:** each microvillus has a toned shaft, a light tip and a shaded side, over a deeper apical surface, so the carpet reads as separate microvilli with light on them. The neighbours' are a little cooler.
- **Under the block:** a firmer floor shadow (`lookCream`: cast 2.3, contact 1.45, occlusion 1.2).
- The capillary, red cells, transferrin, hepcidin and gates keep their colours.

**Cost now** (`stage.__gl3.stats()` counts all of the layer's passes since the Nov 11 chunk): about 100 draw calls and about 505 k triangles a frame on Cream desktop (628 k in Forest night, whose microvilli keep the heavier mesh they shipped with), of which roughly 150 k are the picture itself.

## Verification (2026-11-12, 3-D layer, local)

- `node scripts/verify.mjs a1-gut-cell`: passed after round 3b (line check on the drawing with `?gl=off`: 0).
- Layer off against the page before this round: identical pixels in both themes (moving parts hidden for the comparison).
- Embed (`embed/test.html`): the layer loads from beside the embed script.

## Verification (2026-10-12, 3-D, local)

- `node scripts/verify.mjs a1-gut-cell`: passed.
- No console errors, and no sideways scroll at 390, 360 or 320 in either theme.
- `lines.mjs`: 0.
- Reduced motion draws one settled still.
- Captures:
  - `shots/phone-{390,360,320}-{dark,light}.png`, `shots/desktop-{dark,light}.png` and `shots/reduced-390-*.png` (Iron-hungry);
  - `shots/desktop-full-{dark,light}.png` (Stores full, with a channel pulled in).

## Embed

`embed/optimal-gl3.js` (the shared 3-D layer) travels beside the embed script and is loaded lazily from the same folder.

```html
<script src="https://optimal-research-team.github.io/optimal-anatomy-figures/a1-gut-cell/embed/optimal-fig-gut-cell.js" defer></script>
<optimal-fig-gut-cell theme="light"></optimal-fig-gut-cell>
```

## Open for Peter

1. ~~**The look**~~: resolved. Peter approved the isometric block look (A3b), and A1 is now a block.
2. **Placement:** an inset inside Fig 3's card, or a standalone card on the IV iron page?
