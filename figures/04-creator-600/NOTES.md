# Fig 4 · The runner rig

**Size:** Hero. 29 recorded solids for the treadmill and its instruments, plus the page-drawn mannequin (about 40 parts a frame: 18 balls, 8 dowels, the trunk, 4 foot blocks, plumb laser), belt slats, landing marks, gauge carriage and the display's panels. About 140 parts in all. SVG only, no 3D, no WebGL.

**Mapping in one sentence:** an artist's mannequin with ball joints runs on the Creator 600 at a fixed 10 km/h. Each joint carries a tracking dot, and the upright display draws the skeleton the camera under it sees. The cadence slider shortens each step, so the heel lands closer to the plumb laser line under the centre of mass, the bounce gauge's travel shrinks, and the knee's load glow and the display's load bars drop by Lenhart's patellofemoral-force percentages.

## Parts

- **Deck:** housing on six feet, rear end caps with bolts, rear roller, belt with scrolling slats, two step rails with treads.
- **Front:** motor hood with vent slots, display column with grille, the display (50″ proportions, see open issue 1) with its live screen, and the depth camera module (two apertures and a pilot light) under the screen.
- **Frame:** two slanted uprights let into the deck and the handrails, two handrails with end caps, and the side touch panel on a stalk off the far handrail. The touch panel shows the live cadence.
- **Instruments:**
  - a plumb laser under the pelvis, with a line across the belt below the centre of mass;
  - heel marks on the belt at each landing, riding back with the belt;
  - a landing ruler on the near step rail (2 cm ticks, zero at the laser), with a rider that jumps to each landing;
  - a bounce gauge on the far rail: a carriage at centre-of-mass height, a laser to the runner's side, and hold marks for the top and bottom of the last stride.
- **Display panels:** front-view skeleton with joint dots (knees glow with load), L/R kneecap-load bars with a dashed line at the usual-cadence peak and a hold line for the last landing, and a 1.6 s knee-angle trace.
- **Mannequin** (`shared/mannequin.mjs`, reused in Fig 5):
  - turned trunk: pelvis barrel, waist ball, chest, shoulder yoke, neck, egg head;
  - steel ball joints;
  - tapered wooden dowels for the limbs, wooden ball fists;
  - foot blocks with a toe block hinged at the ball of the foot;
  - tracking dots on 13 joints, and a centre-of-mass marker on the pelvis.

## Numbers

All in `reference/truth-pack.md` §4, under "How Fig 4 uses these numbers".

| Cadence | Step | Bounce | Vertical ratio | Kneecap load | Landing (drawn only) |
|---|---|---|---|---|---|
| 148.5 spm (−10 %) | 1.12 m | 9.35 cm | 8.3 % | 115 % | 26.7 cm |
| 165 spm (usual) | 1.01 m | 7.70 cm | 7.6 % | 100 % | 24 cm |
| 181.5 spm (+10 %) | 0.92 m | 6.46 cm | 7.0 % | 86 % | 21.8 cm |

## How the motion is built (no numbers tuned by eye)

- **Feet never slide.** While a foot is down (39 % of the stride), every point of it that touches the belt moves back at exactly the belt speed. Heel strike rolls to a flat foot, then the heel lifts over the ball while the toes stay down and peel off last.
- **The centre of mass bounces by the true amount.** The COM is computed from standard segment masses (Winter 2009). The pelvis is placed each frame so the COM follows the true oscillation, lowest at mid-stance, and both knees are solved from where the hip and the ankle are (inverse kinematics).
- **Pelvis height** is set once, so the knee is bent 18° at contact at the usual cadence. **How far the heel rolls up at toe-off** is solved per cadence, so the knee leaves the belt bent 20°. Both are textbook values.
- **The swing foot** follows a textbook running path relative to the hip, scaled with step length.
- **Knee load** is a smooth hump over each stance, peaking near peak knee bend. Its height is Lenhart's relative peak force. The glow, the display bars and the readout all come from the same `kneeOf`.

## Decisions

- **Kneecap lamps only, no hip lamps.** HANDOFF asked for L/R hip and knee lamps. The only load measure with published magnitudes in both directions is Lenhart's patellofemoral force. Heiderscheit's hip energy absorption has no magnitude retrieved (only "lower at +10 %"). A hip lamp would need an invented number, so the knees carry the load signal. If Peter wants hip lamps, they could show direction only ("about the same / lower").
- **The readout says "Step", not "Stride".** It shows one footfall to the next. Garmin and Visbody call this "stride length"; in research, a stride is two steps.
- **Range ±10 %.** That's what the studies tested. HANDOFF's 150 → 185 spm would run to +12 %.
- **"Your usual" is 165 spm,** the average recreational runner at this pace (Malisoux 2023). Every change is relative to it, as the evidence supports, not to 180.
- **The stance knee bends deeper than textbook** (about 63° peak against ≈45°). The true 7.7 cm bounce, the true 79 cm of belt travel per stance and a 24 cm landing can't all fit a two-segment leg with a 45° knee; real runners use the pelvis and ankle to make up the difference. The direction with cadence is right (peak bend falls 67 → 61°), and no angle is ever printed.
- **No red accent stripe** on the deck (the real machine has one). Red is reserved for state colours, and orange marks the knee load.
- **The camera's view.** The display shows the runner from the front, as the depth camera sees them, with the runner's left on the screen's right.
- **Slow button.** Real time is 2.75 steps a second, hard to read. Slow runs everything at ¼ speed, and the numbers don't change.
- **The touch panel is on the far handrail.** On the real unit it sits at the centre, where it would hide the camera and the screen's panels from this viewpoint.

## Interaction

- **Cadence slider:** range input, 28 px thumb on a 44 px tall track. **Presets:** −10 %, your usual, +5 %, +10 % (44 px buttons). **Slow / Real time** toggle.
- **Keys** on the stage: ← → ±1 spm, Page Up/Down ±5, Home/End the ends. Arrow keys also move between preset buttons.
- **Idle tour:** usual → +10 % → usual → −10 % → +5 %, six seconds each. Taking over pauses it, and it resumes 9 s after the last input.
- **Offscreen:** rendering stops when the figure is out of view (IntersectionObserver).
- **Reduced motion:** one still frame, with the right heel just landed ahead of the laser line, its belt mark and the rider at the landing, the last landing's load held on the display, and 1.6 s of knee trace. Each preset redraws the still.

## Verification (2026-10-11)

- `node build.mjs --audit` and `--light --audit` → `audit passed`.
- `lines.mjs` → `line ends: 0` in both themes.
- No console errors. No sideways scroll at 390, 360 or 320, and at 320 the four readout columns fit.
- Frame time is about 4 ms; headless Chrome holds 60 fps. The first version took 34 ms a frame with smooth-shaded limbs. The limbs are now cone frusta (smooth round their axis, cheap), and the trunk is drawn once and translated.
- Captures: `shots/phone-{390,360,320}-{dark,light}.png`, `shots/desktop-{dark,light}.png`, `shots/reduced-390-*.png`, and the close-up sheets `shots/zoom-sheet-*.png`.

## Embed

```html
<script src="https://optimal-research-team.github.io/optimal-anatomy-figures/04-creator-600/embed/optimal-fig-creator-600.js" defer></script>
<optimal-fig-creator-600 theme="light"></optimal-fig-creator-600>
```
The page also loads the two Google fonts (see Fig 1's NOTES).

## Open issues for Peter

1. **Display size.** Visbody and resellers list a 50″ 4K vertical display; the site and HANDOFF say 32″. The drawing follows the product photos (about 50″ proportions) but prints no size. Please measure the clinic's unit and fix the site copy if it's 50″.
2. **Hip lamps.** Kept off for lack of a published magnitude (see Decisions). Is direction-only acceptable?
3. **Site copy, "Efficient runners typically sit under a 10% vertical ratio".** That's Garmin's red cut-off (the bottom ~5 % of runners), so nearly everyone is under 10 %. Safer: "most runners sit under about 10 %; typical is about 7.5–8.6 %". Also, "against the commonly cited 170–180 spm range": the evidence supports a 5–10 % change from your own rate, not a fixed target. The caption says so.
4. **Joint-load rating.** The Creator's low/medium/high load rating has no published method or validation. The caption calls it "the machine's own estimate from that tracking, not a force measurement". Please confirm that wording is acceptable next to the site's claims.
5. **Sources to open with full web access:** Heiderscheit 2011 Table 2 (heel-to-COM distance, COM excursion and knee-flexion values, which would replace the derived landing estimate), Lenhart 2014 (author list), and Winter 2009 Table 4.1.
