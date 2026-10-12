# Fig 2 · Five cylinders on a bridge

**Size:** Figure (upper end): 46 recorded solids, 1 cable, 56 painted items, ≈ 120 parts counting electrodes, keys, ticks and seams. SVG only.

**Mapping in one sentence:** a glass body of five cylinders (thin arms, a wide short trunk, legs) stands on the InBody 580 holding its grips; the measuring current is a stream of dots that threads round the long cells at 5 kHz and increasingly through them at higher frequencies, and a bridge of five panel meters (laid out like the result sheet) reads each segment's ohms: the arms several times higher than the trunk.

## Files

`model.mjs` (Cole model per segment, current share through membranes, ECW/TBW), `build.mjs` (geometry, recorder, card, embed), `live.js` (dots, meters, switch, screen, tour, input), `figure.css`, `embed/`, `shots/`.

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

## Verification (2026-10-11)

- `node build.mjs --light --audit` → `audit passed`. One pair is excused after an 8× look: the arm tubes end with their rim on the shoulder balls, leaving a 4 px² sliver at the rim.
- `lines.mjs` → `line ends: 0`, both themes, normal and reduced motion. The needle tips are marked free, as the skill allows for pointer tips.
- No console errors; no sideways scroll at 390, 360 or 320.

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
