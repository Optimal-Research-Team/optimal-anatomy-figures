# Fig 2 · Five cylinders on a bridge

**Size:** Figure (upper end): 46 recorded solids, 1 cable, 56 painted items, ≈ 120 parts counting electrodes, keys, ticks and seams. SVG, with the shared 3-D layer (`shared/gl3`) under it where it can run; `?gl=off` (or `gl="off"` on the embed) is the drawing alone, unchanged.

**Mapping in one sentence:** a glass body of five cylinders (thin arms, a wide short trunk, legs) stands on the InBody 580 holding its grips; the measuring current is a stream of dots that threads round the long cells at 5 kHz and increasingly through them at higher frequencies, and a bridge of five panel meters (laid out like the result sheet) reads each segment's ohms: the arms several times higher than the trunk.

## Files

`model.mjs` (Cole model per segment, current share through membranes, ECW/TBW), `build.mjs` (geometry, recorder, card, embed, the 3-D layer's scene), `live.js` (dots, meters, switch, screen, tour, input, the layer's glass and glow), `figure.css`, `embed/` (the embed script and the layer's chunk `optimal-gl3.js`), `shots/`.

## Parts

- **Bench:** plate with seam, 4 feet, groove, 4 screws, label plate.
- **InBody 580:** footplate base and deck (seam, inset groove) on 4 feet; 2 sole and 2 heel electrode pads with border and grooves; column with 2 seams and a front trim strip; 2 shoulder docks; neck and ball joint; tilted tablet with bezel, live screen (frequency and four-step bar) and 10 keys; 2 grip rods; 2 grips with palm and thumb electrode bands (4 band lines each); a stud and the cable to the bridge.
- **Glass body:** 2 soles; 2 legs, trunk and 2 arms, each a glass tube drawn as back wall, mid-plane section (fluid, staggered long cells, current lanes), front glass with shine, and metal end caps with a seam; pelvis block with seam; shoulder bar and 2 shoulder balls.
- **Bridge:** console with a sloped face, 5 panel meters (face, frame, arc, 11 ticks, needle, hub, 2 screws each) in the result-sheet layout (right arm, trunk, left arm / right leg, left leg), a 4-detent frequency switch, 2 screws, a terminal stud.

## Numbers

All in `reference/truth-pack.md` §2, "How Fig 2 uses these numbers". Headline: arm 388 Ω and trunk 82 Ω at 50 kHz (Zhuang 2022 / Bracco 1996 via a Cole model), ECW/TBW 0.380 (normal 0.360–0.390), phase angle 4.7° (InBody 770 women), current through membranes 2 → 24 % from 5 to 500 kHz (Fricke circuit).

## Decisions

- **Four frequencies, not three.** The brief assumed the 570's set; the 580 uses 5, 50, 250 and 500 kHz (20 readings).
- **Glass tubes with a section on the mid-plane, not half-cylinders.** A cut that faces the viewer read as a flat board; glass with a back wall, shine and metal caps reads as a cylinder you can see into.
- **Only the measured path carries current.** "Body" lights the right arm, trunk and right leg (InBody's whole-body value matches RA + TR + RL). The left limbs stand behind the trunk at this angle; their meters still read.
- **Ohms are example values** for an adult woman (the arm anchor is InBody 770 data in women aged 18–55). The caption says so. Absolute trunk ohms on a real InBody sheet may differ with its electrode geometry; the ratio (arms and legs ≫ trunk) is the message.
- **ECW/TBW and phase angle are constant** here because the figure shows one healthy body. A round-2 option is a scenario switch ("more fluid outside cells" / "fewer cells") that moves both and shows that a high ratio doesn't say why (the scenarios are already in the truth pack).
- **AC drawn as a stream.** The caption says the current alternates thousands of times a second.

## Interaction

Frequency buttons (5 / 50 / 250 / 500 kHz) and segment buttons (Arm / Trunk / Leg / Body), 44 px. Tap a cylinder to select its segment; tap elsewhere to step the frequency. Keys: ← → frequency, ↑ ↓ segment, Home / End. Idle tour steps through the frequencies, segment by segment. Reduced motion: one still frame at 50 kHz, "Body", dots placed at that frequency's share. The loop stops offscreen.

## 3-D layer (shared/gl3, 2026-11-10)

**Withdrawn, 2026-11-12 (Peter).** The 3-D version of this figure is off: `GL3_LIVE = false` in `build.mjs`, so the page carries no scene, never loads the 3-D chunk, and the drawing (approved Oct 12) is the figure again. Everything below describes the scene as it was built; it stays in the source and comes back by flipping that flag.

The same solids, rendered under the SVG; the SVG is the ink on top (cells, dots, ticks, needles, screen, switch). Read `shared/gl3/README.md` first.

- **Colourway (the brand's, not InBody's):** warm white shells (column, docks, deck, head, pelvis, console); a forest bench, forest caps and soles on the glass body, a forest trim strip on the column; graphite base under the deck, graphite grips and neck; rubber feet and cable; satin nickel electrodes (foot pads, and two bands on each grip), shoulder balls and bar, switch knob; aluminium grip rods and label plate; brass terminal studs.
- **The five tubes** are drawn with the kit directly (`record(A.disc…)` + `put`), so the helpers record nothing. `segment()` notes two solids each: `body.<name>.core`, the back half as a prism whose flat face is the section the SVG draws on (kept `shell`, lit, so the ink reads and the caps shade it), and `body.<name>`, the glass. The glass is the figure's own material (`glGlass` in `live.js`, through the layer's `build` hook): the layer's `glass` preset is a faint film on an upright tube in this studio, so the figure swaps in a small shader (a hair of tint, edges that thicken to the silhouette, long highlights). The drawn shine is `data-gl3-hide`.
- **Paper under colour:** the head's bezel and screen get a `paper` panel (`head.screen`); each meter face gets a paper card of its own outline (`meter.<name>`), flat on the sloped face. Cards, panel and the grip bands carry `shadow: false`: they are too thin for the shadow map and would only add an occlusion fringe.
- **Meter bezels are ink.** A rendered bezel this thin (0.7 cm) breaks into dots on a phone-sized canvas, so the drawn frame (`.ib-frame`) is restyled while the layer is on (`figure.css`): a dark band 0.75 cm wide in the face's own plane (`vector-effect: none`), crisp at any pixel ratio. With the layer off it is the same 1 px line as before.
- **Glow:** the measured segment's core glows a little (`gl.set(core, { emissive, intensity })`, eased; the others reset): right arm, trunk or right leg, or all three for "Body". It follows the same `lit` list that lights the needles. The ink is still the truth.
- **Drawn on change only.** Nothing solid moves here (dots, needles and the switch are ink), so `live.js` calls `gl.render()` when the layer arrives and while a glow eases, not every frame.
- **The far shoulder stands above the viewBox** (28 units; the SVG shows it because its overflow is visible) and the layer's canvas only covers the SVG's box. While the layer is on, `live.js` sets the viewBox to `0 -36 600 636`, takes the extra height back with a negative top margin (the stage becomes `flow-root` so its own box stays put) and calls `gl.view(…)`. Layout is identical to the layer-off page (checked: plate, stage and SVG rectangles at 390 and 900 px). If the layer is lost, all three are put back.
- **Layer off = the old figure:** the built SVG is byte-identical to the build before the layer, apart from five inert `data-gl3-hide` attributes (the shines) and the class `ib-frame` on the five meter frames (no rule touches it with the layer off); the page CSS is the old CSS plus that one `[data-gl3="on"]` rule and `gl3.css`.
- **Not rendered, left as ink on purpose:** seams, grooves, screws, the bench's inset line (they read on the pale parts and fade on the forest and graphite ones).

## Verification (2026-10-11)

- `node build.mjs --light --audit` → `audit passed`. One pair is excused after an 8× look: the arm tubes end with their rim on the shoulder balls, leaving a 4 px² sliver at the rim.
- `lines.mjs` → `line ends: 0`, both themes, normal and reduced motion. The needle tips are marked free, as the skill allows for pointer tips.
- No console errors; no sideways scroll at 390, 360 or 320.
- 2026-11-10, with the 3-D layer: `node scripts/verify.mjs 02-inbody-580` → `verify: passed` (line ends 0 on both themes with `?gl=off`; 390 / 360 / 320, reduced motion and desktop in both themes with the layer on, console clean). `node build.mjs --light --audit` → `audit passed`. The embed (`embed/test.html`) ends at `data-gl3="on"`.

## Embed

```html
<link rel="stylesheet" href="https://fonts.googleapis.com/css2?family=Castoro:ital@0;1&family=Public+Sans:wght@400;500;600;700&display=swap">
<script src="https://optimal-research-team.github.io/optimal-anatomy-figures/02-inbody-580/embed/optimal-fig-inbody-580.js" defer></script>
<optimal-fig-inbody-580 theme="light"></optimal-fig-inbody-580>
```

## Open issues

1. **Result sheet (checked 2026-10-12 against InBodyCanada's interpretation guide):** no segmental reactance readout; reactance appears only in the optional whole-body BIVA graph, so Fig 2 rightly prints none. Still to verify against the manual: the exact trunk ohms it reports, and the manual's wording on implanted devices before any copy mentions safety.
2. **Optional scenario switch** for ECW/TBW (see Decisions).
3. **Left limbs** are mostly hidden behind the trunk from this angle. If Peter wants all five visible, the body can be turned toward the viewer, at the cost of a less true InBody stance.
