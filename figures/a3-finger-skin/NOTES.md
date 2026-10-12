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

## Verification (2026-10-12, 3-D, local)

- `node scripts/verify.mjs a3-finger-skin`: passed.
- No console errors, and no sideways scroll at 390, 360 or 320 in either theme.
- `lines.mjs`: 0.
- Captures (about minute 0.8, in the flash): `shots/phone-{390,360,320}-{dark,light}.png`, `shots/desktop-{dark,light}.png` and `shots/reduced-390-*.png` (the still at minute 1, the peak).

## Embed

```html
<script src="https://optimal-research-team.github.io/optimal-anatomy-figures/a3-finger-skin/embed/optimal-fig-finger-skin.js" defer></script>
<optimal-fig-finger-skin theme="light"></optimal-fig-finger-skin>
```

## Open for Peter

1. **Placement:** on the Menopause page with Fig 1 and A2. They read as one story: brain switch (A2) → thermostat (Fig 1) → finger valves (A3).
2. **A source for the shunt anatomy** (e.g. a physiology review of glabrous-skin AVAs) would move it from textbook to cited.
