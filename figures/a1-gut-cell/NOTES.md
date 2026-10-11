# A1 · The gut cell's gate (anatomical style test)

**What it is:** the first of the anatomical series (`BACKLOG.md`), built as the style test. It's a hand-drawn organic SVG: Catmull-Rom outlines turned into Béziers, soft fills in the figure's own inks, and one membrane line weight. No isometric kit geometry; the card, controls, readout and both themes are the same as the other figures. Peter approves the look before A2–A9 are built.

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

## Verification (2026-10-11)

- No console errors.
- No sideways scroll at 390, 360 or 320, in either theme.
- `lines.mjs` → 0 floating ends: every shape is closed.
- Reduced motion shows one settled still per moment.

## Open for Peter

1. **The look:** line weight, fills, how organic forms sit beside the isometric machines. Approve or redirect before A2–A9.
2. **Placement:** an inset inside Fig 3's card, or a standalone card on the IV iron page?
