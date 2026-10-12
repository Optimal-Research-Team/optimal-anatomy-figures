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
