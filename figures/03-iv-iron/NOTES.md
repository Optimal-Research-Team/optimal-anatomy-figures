# Fig 3 · The depot with a gate

**Size:** Figure (upper end): 33 recorded solids, 32 painted items, plus page-drawn carts (6 × chassis, 2 cradles, up to 2 ingots), booms, rider, discs, pill. About 110 parts counting sleepers, ticks and screws. SVG only.

**Mapping in one sentence:** a rail yard in which iron is ingots. A hepcidin dial sets two boom gates (ferroportin), at the gut dock and at the ferritin silo. Each pill dropped into the dock's hopper raises hepcidin for about a day, so daily pills half-close their own gate. Transferrin carts carry at most two ingots each to the marrow press, which stamps red discs and counts haemoglobin. The IV tanker skips the dock and fills the silo directly.

## Parts

- **Bench and timeline:** plate, feet, groove and screws; a 56-day ruler strip (daily ticks, weekly majors), with dose marks per route, a recheck band at weeks 6–8, and a sliding rider.
- **Track:** ballast bed, two rails and sleepers on a closed loop.
- **Gut dock:** building with seam, 3 panel lines and 4 screws; hopper; platform with screws; boom post, hub and arm; hepcidin dial (base, pedestal, puck, ring, 11 ticks, hub, needle).
- **Ferritin silo:** foot, body with 3 bands, roof, sight glass with level bar and 11 ticks; apron; boom post, hub and arm.
- **Marrow press:** base with seam and screws, 4 columns, crown with seam, die, ram on a rod sliding out of the crown, chute, tray with red discs, and the Hb counter (window and digits).
- **IV tanker:** road bed, chassis, 4 wheels, cab, tank with 2 bands.
- **Carts (6):** chassis, 2 cradles, ingots.

## Numbers

All in `reference/truth-pack.md` §3, "How Fig 3 uses these numbers".

- The model reproduces the published absorption numbers: Moretti 2015 (next-day absorption −38%) and Stoffel 2017 (130/173 mg).
- IV iron: ferritin peaks ≈ 470 µg/L at day 5–7 and is ≈ 150–170 by weeks 7–8. Hb goes 105 → 130 g/L by week 8.
- Daily pills: Hb reaches ≈ 128 g/L, but ferritin stays ≈ 19.

## Decisions

- **The readout says "Gut gate % open" rather than a relative hepcidin number.** It's the same quantity, 1/(1 + hepcidin), and readable without units. The dial shows hepcidin itself.
- **Fairness to pills.** The caption says pills work and are the right first step for many people. In the model, daily pills raise Hb nearly as far as IV by week 8 (128 vs 130 g/L); the difference is the stores. Alternate-day dosing is described as "why some people take pills every other day", not as faster.
- **Two gates, one hepcidin.** Hepcidin also locks the storage cells' export, so after IV iron the silo boom follows the same dial. The gut gate partly closes after IV because stores are full, which is normal physiology and shown without comment.
- **Carts' load is a proxy, never printed.** It shows that most carts run empty in iron deficiency and fill after IV.
- **Time.** About 10 model hours per second for the first three days, so the daily gate pulse is visible, then about 90 h/s. The scrubber and the day readout make this explicit.

## Interaction

- **Route buttons:** daily pills, alternate days, IV infusion (44 px).
- **Play/Pause and a day scrubber:** a range input with a 28 px thumb and 44 px tall track.
- **Keys:** ← → a day, Page Up/Down a week, Home/End, Space play/pause.
- **Idle tour:** plays each route through 56 days. Taking over pauses it, and it resumes 9 s after the last input.
- **Reduced motion:** a still frame of IV at day 7 (silo nearly full, gut gate half-closed, Hb rising). Each route button shows its own still.

## Verification (2026-10-11)

- `node build.mjs --light --audit` → `audit passed`, including the ram's rod sliding out of the crown, posed at both ends of its stroke.
- `lines.mjs` → `line ends: 0` in both themes, normal and reduced motion.
- No console errors; no sideways scroll at 390, 360 or 320. At 320 the route labels wrap to two lines inside their pills.

## Embed

```html
<script src="https://optimal-research-team.github.io/optimal-anatomy-figures/03-iv-iron/embed/optimal-fig-iv-iron.js" defer></script>
<optimal-fig-iv-iron theme="light"></optimal-fig-iv-iron>
```
The page also loads the two Google fonts (see Fig 1's NOTES). Where the IV iron page lives (HANDOFF §7 Q3) doesn't change the embed: the custom element works in any page.

## Open issues for Peter

1. **Monoferric's Canadian indication** (product monograph, rev. Jan 2025, read via search extracts): iron-deficiency **anaemia** in adults who are intolerant of, or unresponsive to, oral iron. The waitlist page's athlete line ("low iron caps endurance … long before anaemia shows up") goes beyond that. The figure doesn't make that claim, but the page copy should be checked.
2. **"1 in 4 women of reproductive age have low iron"** (site copy): no Canadian source was verified. It's plausible only with a ferritin cut-off around 30 µg/L. Supply the source, or soften the wording.
3. **Dosing table:** confirm the Canadian monograph's simplified dosing table and infusion time (≥ 20 min for ≤ 1000 mg) against the PDF.
4. **"Energy back in 1–2 weeks"** (site copy) has no verified number. The figure doesn't use it.
