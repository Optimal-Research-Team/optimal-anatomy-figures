# Fig 1 · The narrowing thermostat

**Size:** Figure (one mechanism; 75 recorded solids, 3 cables, 96 painted items). SVG only; no WebGL layer.

**Mapping in one sentence:** a capsule pushes a lit column up and down between two contact jaws on a lead screw: the gap between the jaws is the thermoneutral zone, the estrogen knob closes the jaws, and when a small natural rise brings the column's finger onto the upper jaw, the circuit opens the radiator's louvres (skin vasodilation), swings the skin and heart-rate dials, and the column then dips below rest (the after-chill), which on a narrow zone can touch the lower jaw too.

## Files

| File | What it is |
|---|---|
| `model.mjs` | Pure model: `zoneOf(e)`, `rateOf(e)`, `flashAt(t)`, `swingAt(s)`, knob and dial scales. Imported by the build and inlined in the page |
| `build.mjs` | Geometry, audit recorder, card, page, embed. `--light` for Cream, `--audit` to prove the geometry |
| `live.js` | Motion, tour, input, readout. Every value comes from `model.mjs` |
| `figure.css` | Heat wash, lamp colours, the lit column's green wash |
| `embed/optimal-fig-menopause-thermostat.js` | Self-contained custom element (built with `--light`) |
| `shots/` | Phone 390/360/320 and desktop in both themes, 4× close-ups |

## Parts (75 recorded solids, ≈ 110 parts counting screws, ticks and seams)

- **Base:** plate with seam and bevel, 4 feet (flange + foot), groove, 4 corner screws with rings, label plate with 3 rule lines and 2 screws.
- **Scale:** foot block with 2 screws, scale board with a double-rule ruler (0.025 °C minors, 0.05 °C mids, 0.1 °C majors, a bold zero at rest), 2 board screws.
- **Capsule (the core):** bolted flange with a fading bolt circle, knurled body between two seams, chamfered cap, gland with a seal ring, terminal boss and stud.
- **The column (lit):** rod sliding out of the gland (one rod, clipped at the gland), collar with a seam, finger, contact pads above and below, index blade reading the scale.
- **Upright:** base block with seam and screws, back plate, 2 hardened rails, opposed-thread lead screw with foot and head bearings (its thread rings travel as it turns), bridge with seam, 4 screws and the one engraved label (ESTROGEN), knob dial plate with 12 ticks and a faint ring, knurled knob with a pointer.
- **Jaws (×2):** carriage with seam, 2 top screws and 2 front cap screws, 2 bushings on the rails, contact arm, silver contact button.
- **Relay:** box with lid seam and 4 screws, 2 lamp bezels with domes (flash lamp warm, chill lamp cool), 3 terminal studs on bosses.
- **Radiator:** 2 posts, bottom rail, finned core (16 closed fin slots) with the heat wash, header with seam and 4 screws, 7 louvre slats on pins, slotted linkage bar with 7 crank pins, solenoid can on a plinth with a terminal stud.
- **Console:** box with seam and 4 screws, skin-temperature and heart-rate dials (knurled bezel, seam, face ring, 13 ticks, hub, needle), terminal stud on top.
- **Cables (3):** capsule → relay (common), relay → solenoid, relay → console.

## Numbers and where they come from

All in `reference/truth-pack.md` §1 ("How Fig 1 uses these numbers").

| Shown or animated | Value | Source |
|---|---|---|
| Zone, pre-menopause end | 0.4 °C | Freedman & Krell 1999 (women without hot flashes) |
| Zone, post-menopause end | 0.0 °C (drawn gap 0.04 °C) | Freedman & Krell 1999 (women with hot flashes) |
| Upper jaw moves 3× as far as the lower | 75 % of narrowing from the sweating threshold | Freedman 1999 via Gombert-Labedens 2025 |
| A small rise | +0.04 °C | Jones 2019 ("~0.03–0.05 °C") |
| Flash length | 3.4 min | Low 2008 |
| Heart rate | +10 bpm | Low 2008 |
| Finger skin | +2.7 °C, sharp rise, ~31 min elevated | Meldrum 1979; Molnar 1975 |
| Flashes per hour at the post end | 1.1 | Meldrum 1979 (highly symptomatic) |
| Flashes per hour elsewhere | Rice crossing rate with σ = 0.04 °C | model, anchored at 1.1 |
| After-chill | −0.05 °C, 2–14 min after onset; readout says "dipping" | ILLUSTRATIVE, direction from Kronenberg 1984 |

## Decisions

- **Relative temperatures.** Published thresholds differ by protocol (37.2 °C in 1999, 38.0 °C in 2002), so the figure never prints an absolute threshold. Core is shown as a change from the woman's own rest, which also makes the point: the trigger is a few hundredths of a degree.
- **Two stops, not three.** HANDOFF suggested Pre / Post with the knob between. A "Peri" stop has no measured zone, and the model honestly gives ≈ 0 flashes at a half-closed zone, which would mislead about perimenopause (when flashes are common). The knob still turns continuously (drag, arrow keys).
- **"Pre-menopause" uses the asymptomatic group's 0.4 °C.** Freedman's comparison was between postmenopausal women with and without flashes. The caption says not every woman's zone narrows.
- **Leading explanation, not settled fact.** Jones 2019 found a preceding core rise before only ~51 % of spontaneous flashes, so the caption says "in the leading explanation".
- **No treatments yet** (HANDOFF §7 Q2). The relay has room for a treatment relay. If wanted, use class names only ("hormone therapy", "neurokinin-receptor blocker"); fezolinetant (Health Canada, Dec 2024) and elinzanetant (Jul 2025, NK1 + NK3) are both authorized, and the class name fits both.
- **Phone first.** The tower was shortened and the radiator narrowed so the drawing is width-limited (scale 2.06 vs 1.77 at first), and the controls are two 44 px buttons. The readout wraps to a 4-column row above the hint on phones.
- **Time.** About one model minute per second, quiet spells between rises cut; the caption says so.
- **Colour.** Only heat: the radiator core's warm wash and the flash lamp (`--opt-heat-ink`), and the chill lamp (`--opt-cold-ink`). The lit part is the forest-green column.

## Interaction

- **Buttons:** Pre-menopause / Post-menopause (radio group, arrow keys move between them).
- **Stage:** drag sideways to turn the knob; tap for a small rise. Keys: ← → (Shift for bigger steps), Home / End, Space or Enter for a small rise.
- **Idle tour** (54 s loop): a rise with the zone wide (nothing), the knob turns to post, the same rise trips a flash and the after-chill, the knob turns back. Pauses on input and resumes 3.6 s after the last one.
- **Reduced motion:** one still frame at the post end with a flash at its height (finger on the upper jaw, louvres open, dials up); the buttons still switch between the two states.
- **Offscreen:** the loop stops (IntersectionObserver).

## Verification (2026-10-11)

- `node build.mjs --light --audit` → `audit passed` (15 reachable poses: jaws at 5 settings × the column at both jaws and between).
- `lines.mjs` → `line ends: 0` on both themes, at rest, in the reduced-motion still frame and after driving End + Space + a button tap.
- No console errors; no sideways scroll at 390, 360 or 320.
- The embed was tested on a plain host page: it mounts in a shadow root and runs.

## Embed

```html
<!-- once per page: the two brand fonts -->
<link rel="stylesheet" href="https://fonts.googleapis.com/css2?family=Castoro:ital@0;1&family=Public+Sans:wght@400;500;600;700&display=swap">
<script src="https://optimal-research-team.github.io/optimal-anatomy-figures/01-menopause-thermostat/embed/optimal-fig-menopause-thermostat.js" defer></script>

<optimal-fig-menopause-thermostat theme="light"></optimal-fig-menopause-thermostat>
```
`theme="dark"` gives Forest night. In React, render the tag as-is (`<optimal-fig-menopause-thermostat theme="light" />`) and load the script once, e.g. in `index.html`. For production, copy the script into the site's own assets rather than hot-linking Pages.

## Open issues

1. **Treatment switch:** waiting on HANDOFF §7 Q2.
2. **Sources:** values were checked against abstracts and search extracts, not full text (network policy). Freedman 1999's shivering thresholds and the after-chill size are the weakest links; neither is printed.
3. **WebGL heat shimmer:** optional per HANDOFF; not built, because the SVG wash already carries it on phones. Can add if wanted.
4. **Medical sign-off:** HANDOFF §7 Q4.
