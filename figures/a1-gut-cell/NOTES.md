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

## Verification (2026-10-12, 3-D, local)

- `node scripts/verify.mjs a1-gut-cell`: passed.
- No console errors, and no sideways scroll at 390, 360 or 320 in either theme.
- `lines.mjs`: 0.
- Reduced motion draws one settled still.
- Captures:
  - `shots/phone-{390,360,320}-{dark,light}.png`, `shots/desktop-{dark,light}.png` and `shots/reduced-390-*.png` (Iron-hungry);
  - `shots/desktop-full-{dark,light}.png` (Stores full, with a channel pulled in).

## Embed

```html
<script src="https://optimal-research-team.github.io/optimal-anatomy-figures/a1-gut-cell/embed/optimal-fig-gut-cell.js" defer></script>
<optimal-fig-gut-cell theme="light"></optimal-fig-gut-cell>
```

## Open for Peter

1. ~~**The look**~~: resolved. Peter approved the isometric block look (A3b), and A1 is now a block.
2. **Placement:** an inset inside Fig 3's card, or a standalone card on the IV iron page?
