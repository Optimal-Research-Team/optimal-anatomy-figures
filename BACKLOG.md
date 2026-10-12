# Backlog: after the five figures

Added 2026-10-11 at Peter's request. These come after HANDOFF §1's five figures. Same house rules as `CLAUDE.md`: truth first, a model drives every motion and number, phone first, both themes, medical accuracy, and no promised outcomes.

## Anatomical series

These are organic drawings, not machines. The Anatomy skill's machine tooling (audit, lathe, tube) only partly applies, so they're **hand-authored SVG**: Bézier outlines, layered fills in the figure's own inks, accurate topology and proportion, and lightly shaded editorial style (not photoreal). Each still follows the house rule that **the motion is the idea**, with a small pure `model.mjs`, a framed card, a caption and a legend.

**Step 0: style test (~1 h). Done 2026-10-11: `figures/a1-gut-cell/` (A1), waiting on Peter's call on the look.** Build the gut-cell inset first, as a one-screen sample. Peter approves the look (line weight, shading, how organic forms sit next to the isometric machines) before the rest are built. Decide then whether insets live inside a figure's card or as standalone cards.

| # | Piece | Page | Motion = idea | Truth needed | Size | Estimate |
|---|---|---|---|---|---|---|
| A1 | **Gut lining cell** (duodenal enterocyte), inset for Fig 3 | IV iron | Iron enters at the brush border (DMT1) and leaves through ferroportin at the base; hepcidin docks, and ferroportin is pulled in and broken down | Nemeth 2004; Aschemeyer 2018; Billesbølle 2020 (already in truth pack §3) | small | 1–1.5 h |
| A2 | **Hypothalamus slice**, inset for Fig 1 (built 2026-10-11, `figures/a2-hypothalamus/`) | Menopause | KNDy neurons in the arcuate nucleus fire neurokinin B into the median preoptic heat-loss centre; lower estrogen and they enlarge and fire faster | Rance & Young 1991; Rometo 2007; Jayasena 2015 (truth pack §1) | small | 1–1.5 h |
| A3 | **Finger skin in section** (built 2026-10-12, `figures/a3-finger-skin/`) | Menopause | Arteriovenous shunts open and blood floods the skin: the +2.7 °C finger rise of a flash, from the inside | Meldrum 1979; skin AVA anatomy (to source) | small | 1–1.5 h |
| A4 | **Beating heart, cut open** (built 2026-10-11, `figures/a4-heart/`) | VO2max, Performance | Four chambers and valves through real cycle timing; a heart-rate slider shows cardiac output = HR × stroke volume rising toward max (the Fick equation from Fig 5) | Cardiac cycle timing, stroke volume at rest vs max (truth pack §5 has Fick, LOW: verify) | large | 2–3 h |
| A5 | **Alveolus and capillary** (built 2026-10-11, `figures/a5-alveolus/`) | VO2max | Red cells stream past an air sac; O₂ diffuses in and CO₂ out, faster with exercise (why breath-by-breath gas analysis reads oxygen use) | Alveolar–capillary transit time, diffusion distances (to source) | medium | 1.5–2 h |
| A6 | **Red-cell life cycle** (built 2026-10-11, `figures/a6-red-cell-cycle/`) | IV iron | Marrow → 120 days in circulation → spleen macrophage recycles the iron (~20–25 mg/day), showing why ferritin and Hb move on different clocks | Franco 2012; Hentze 2010 (truth pack §3) | medium | 1.5–2 h |
| A7 | **Knee in side section** | Creator 600 | Patella glides in its groove as the knee bends; cartilage loads more at a straight-knee landing; patellofemoral force from the Fig 4 model | Lenhart 2014; Heiderscheit 2011 (truth pack §4 draft) | medium | 2 h |
| A8 | **Muscle fibre to sarcomere** (built 2026-10-12 as "water in and around the fibres", `figures/a8-muscle-water/`; sarcomere sliding left for a later piece) | InBody 580, strength | Actin and myosin slide; water inside and outside the cells ties InBody's ECW/ICW to real tissue | Sarcomere lengths, ICW/ECW shares (to source) | medium | 1.5–2 h |
| A9 | **Bone remodelling with estrogen** (built 2026-10-12, `figures/a9-bone-remodelling/`) | Menopause | Osteoclasts dig and osteoblasts fill; lower estrogen and digging outpaces filling (typical pattern, no fracture-risk promises) | Remodelling cycle durations, estrogen effect (to source); must match the Menopause Protocol | medium | 1.5–2 h |

**Total for the series:** ~15–19 h including the style test, before design rounds (expect +30–50 %).

Each piece is done when it meets the same bar as HANDOFF §2, adapted:
- both themes;
- phone 390/360/320 captures;
- the line-end check at 0 (the kit's `lines.mjs` still applies to hand-drawn lines);
- reduced-motion still;
- a medical accuracy pass;
- NOTES.md;
- in the gallery.

## Round-2 options already raised

- Fig 1: treatment switch (hormone therapy / neurokinin-receptor blocker, class names only), if Peter answers HANDOFF §7 Q2 yes. Optional WebGL heat shimmer over the radiator.
- Fig 2: an ECW/TBW scenario switch ("more fluid outside cells" / "fewer cells") showing that a high ratio doesn't say why. Option to turn the body so all five cylinders show.
- Fig 3: decide whether the readout shows "gut gate % open" (current) or a relative hepcidin number.
