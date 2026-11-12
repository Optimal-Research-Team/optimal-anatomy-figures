# Fig 1 · The narrowing thermostat

**Size:** Figure (one mechanism; 75 recorded solids, 3 cables, 96 painted items). One WebGL layer, the shared `shared/gl3` (since Nov 10): it renders the same solids under the SVG, and the SVG is the whole figure wherever the layer can't run (`?gl=off` shows it).

**Mapping in one sentence:** a capsule pushes a lit column up and down between two contact jaws on a lead screw: the gap between the jaws is the thermoneutral zone, the estrogen knob closes the jaws, and when a small natural rise brings the column's finger onto the upper jaw, the circuit opens the radiator's louvres (skin vasodilation), swings the skin and heart-rate dials, and the column then dips below rest (the after-chill), which on a narrow zone can touch the lower jaw too.

## Files

| File | What it is |
|---|---|
| `model.mjs` | Pure model: `zoneOf(e)`, `rateOf(e)`, `flashAt(t)`, `swingAt(s)`, knob and dial scales. Imported by the build and inlined in the page |
| `build.mjs` | Geometry, audit recorder, card, page, embed. `--light` for Cream, `--audit` to prove the geometry. Its own `box` / `cyl` / `turned` / `pin` / `cable` helpers also note each solid for the 3-D layer |
| `live.js` | Motion, tour, input, readout. Every value comes from `model.mjs`. Mirrors every mover into the 3-D layer |
| `figure.css` | Heat wash, lamp colours, the lit column's green wash |
| `embed/optimal-fig-menopause-thermostat.js` | Self-contained custom element (built with `--light`) |
| `embed/optimal-gl3.js` | The shared 3-D chunk, copied by the build; the embed loads it lazily from beside itself |
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
- **Still no treatment switch (2026-10-12), on purpose.** Peter cleared treatments on screen, but this model is the wrong place for them. The flash rate comes from the Rice-formula threshold model, so even a modest sourced shift of the threshold (+0.16 °C) drives the rate to zero: the figure would show flashes stopping entirely, which overstates the evidence. A2 carries both mechanisms instead (hormone therapy refills the estrogen brake; a neurokinin-receptor blocker mutes the signal) with "fewer, typically" wording.
- **Phone first.** The tower was shortened and the radiator narrowed so the drawing is width-limited (scale 2.06 vs 1.77 at first), and the controls are two 44 px buttons. The readout wraps to a 4-column row above the hint on phones.
- **Time.** About one model minute per second, quiet spells between rises cut; the caption says so.
- **Colour.** Only heat: the radiator core's warm wash and the flash lamp (`--opt-heat-ink`), and the chill lamp (`--opt-cold-ink`). The lit part is the forest-green column.

## The 3-D layer (shared/gl3, 2026-11-10)

**Withdrawn, 2026-11-12 (Peter).** The 3-D version of this figure is off: `GL3_LIVE = false` in `build.mjs`, so the page carries no scene, never loads the 3-D chunk, and the drawing (approved Oct 12) is the figure again. Everything below describes the scene as it was built; it stays in the source and comes back by flipping that flag.

This figure does not use `shared/figkit.mjs`, so `build.mjs` keeps its own `GL` list: every local helper pushes one descriptor (`glPart.prism | lathe | tube`) with the frame, outline and extents the kit call gets, and the piece name for movers. Solids drawn by a direct kit call are noted by hand: base plate, feet, label plate, capsule body, rod, lead screw, lamp domes, slats, linkage bar. 80 rendered parts. `gl3SceneOf(GL, …)` gives each a material by name.

**Colourway.** Warm white enamel (`shell`) for the plate and every housing, the scale board, knob plate and dial faces (ink reads on them). `graphite` for the feet, the capsule's flange, the scale's foot, the solenoid's plinth, terminal bosses, and the radiator's sill and core. `rubber` for foot pads and cables. Metal for what is turned or ground: `steel` rails, screw and contacts, `alu` knob, jaws, linkage bar, solenoid can and label plate, `nickel` bezels, bushings, bearings, gland, pins and studs. `satin` louvres. **Green is only the lit column** (rod, collar, finger, index) in `forest`, so the legend's "lit" swatch still means one thing. The only warm colour is the flash: the core glows and the flash lamp lights; the chill lamp is the only blue.

**Movers** (each mirrored in `live.js` inside the same `set(…)` call that moves the SVG, so the two never disagree):

| SVG | Layer |
|---|---|
| `[data-move=rod]` translate | `gl.move("rod", [0, 0, dz])` |
| `[data-move=jawU]`, `[data-move=jawL]` | `gl.move("jawU" / "jawL", [0, 0, dz])` |
| slats redrawn each frame | `gl.set("slat.i", { F })`, the blade's frame turned about the same pivot |
| linkage bar translate | `gl.move("bar", [0, 0, lift])` |
| heat wash opacity = louvre | `gl.set("rad.core", { emissive, intensity ∝ louvre })` |
| lamp `data-on` (300 ms fill transition) | `gl.set("lamp.warm" / "lamp.cool", { color, emissive, intensity })`, eased over the same 300 ms |
| thread rings, knob pointer, dial needles, crank pins, ticks | ink only; nothing to render |

When the layer arrives (or is lost) `redraw` forgets what was drawn and draws once, so every mover is pushed again. `gl.render()` runs only on frames where something changed.

**Where the render departs from the drawing, on purpose** (the drawing with the layer off is byte-for-byte the old one; the build's SVG was diffed against the previous commit's):

- **Shingled louvres.** The blades are 15.4 wide on a 13 pitch, so shut and flat (as drawn) they are one coplanar sheet and the render showed a blank panel. The rendered blades rest at 8° (the least that clears the 1.4 thickness is 6.2°) and reach the drawing's own 60° at full open: `8 + deg × (1 − 8/60)`. The blades' ends are let 0.6 into the posts.
- **Seats.** The renderer rounds both ends of every solid; a rounded foot standing on a face leaves a hairline undercut that reads as grit at phone size. Seated parts are let into what they stand on by 0.4 to 1.2 (`gl: { seat }`; boxes on the plate by default). Nothing visible moves.
- **One capsule shell.** Body and cap are one turned solid in the render (same 16 wall), so there is no groove at the joint.
- **Rod and bar run on inside.** The rendered rod reaches down into the capsule and the rendered bar into the solenoid, so neither shows a foot at full stroke (the SVG does this with clip paths).
- **Dials.** The bezel is a nickel ring with the face let in 0.5 behind it (`dial.*.face`, `shell`); the ink ring at R − 1.8 is the bezel's inner edge.
- **Night finish.** Forest night dims the studio's floor and upright metal mirrors the floor, so steel rails and a steel screw went black and lost the thread. Rails, screw, linkage bar and solenoid can carry a second finish (`mn: "satin"`) that `live.js` swaps in when the theme is dark. This belongs in the shared studio (a brighter floor bounce at night); it is done here because `shared/` was out of bounds.
- **Look.** `look: { aoRadius: 9, ao: 0.55 }`: at the phone quality level (half-resolution occlusion) the default radius (12 for this span) and full strength left blotchy patches on the upright and beside the radiator posts; a radius of 7 speckled the jaw under the bridge. The key light's shadows and the floor shadow are untouched.

**Known limits.** At the phone quality level (half-resolution occlusion) a faint comb can show where a jaw meets the back plate; it is the shared occlusion pass, not this figure. The floor shadow is the shared one.

## Interaction

- **Buttons:** Pre-menopause / Post-menopause (radio group, arrow keys move between them).
- **Stage:** drag sideways to turn the knob; tap for a small rise. Keys: ← → (Shift for bigger steps), Home / End, Space or Enter for a small rise.
- **Idle tour** (54 s loop): a rise with the zone wide (nothing), the knob turns to post, the same rise trips a flash and the after-chill, the knob turns back. Pauses on input and resumes 3.6 s after the last one.
- **Reduced motion:** one still frame at the post end with a flash at its height (finger on the upper jaw, louvres open, dials up); the buttons still switch between the two states.
- **Offscreen:** the loop stops (IntersectionObserver).

## Verification (2026-11-10, with the 3-D layer)

- `node scripts/verify.mjs 01-menopause-thermostat`: see the table it prints (phones 390 / 360 / 320 in both themes, reduced motion, desktop, line ends with `?gl=off`). The stage ends at `data-gl3="on"` with a clean console.
- `node build.mjs --audit` → `audit passed` (unchanged: 75 solids, 96 items, 15 depth states).
- The SVG and the plate markup of both pages and the embed are identical to the previous commit's build (string compare).
- The embed was tested in both themes on a plain host page: the layer mounts in the shadow root and loads the chunk from beside the embed script.

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
3. **WebGL heat shimmer:** optional per HANDOFF; not built. With the 3-D layer on, the core now glows during a flash (emissive, in step with the wash); there is still no shimmer.
4. **Medical sign-off:** HANDOFF §7 Q4.
