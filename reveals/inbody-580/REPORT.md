# InBody 580: anatomy figure and reveal film

The machine is rebuilt part by part from its published dimensions, using the `anatomy-reveal` skill.

- **Palette:** cream paper (#FFFCF7), forest ink (#2C4E25), a leaf accent (#A9D49C), and greys #C9CDBF and #8E9884.
- **Type:** Castoro and Public Sans, embedded as local woff2 files.
- **Left out:** no photos, no web or AI images, no manufacturer logos or wordmarks, and no people.

Nothing has been committed, pushed or published.

## Deliverables
Project folder: `optimal-equipment-reveals/inbody-580/`

| What | Path |
|---|---|
| Figure page, dark (forest night) | `object/figure.html` |
| Figure page, cream | `object/figure-light.html` |
| Film, 16:9 (reception TV) | `out/inbody-580-16x9.mp4` |
| Film, 9:16 (Reels) | `out/inbody-580-9x16.mp4` |
| Contact sheets (8 frames from each MP4) | `out/sheet-16x9.jpg`, `out/sheet-9x16.jpg` |
| Film pages per ratio | `motion/motion-16x9.html`, `motion/motion-9x16.html` |
| Layout check (series QA: captions, corner labels, hero framing, Reels safe area) | `motion/check-frame.mjs` |

**Films:** H.264, yuv420p, 30 fps, 360 frames, exactly 12.000 s, no sound.
- 16:9 is 1920×1080 and 8.4 MB.
- 9:16 is 1080×1920 and 8.3 MB.
- Both were re-rendered for the Oct 19 polish round, then again to conform to the shared `../SERIES-SPEC.md`.

**Figure pages:** each is one self-contained 945 KB file, phone-first for the public anatomy gallery, with no hover-only behaviour.
- **Drag** to turn the machine. On phones a horizontal drag turns it and vertical swipes still scroll the page.
- **Take it apart** with a tap (touch: under 8 px and 300 ms), a hover (mouse), key A, or the button row.
- **Button row under the figure, on every device:** "Take apart" (relabels to "Put together"), "Lift grips" and "Screen on" (both `aria-pressed` toggles), and "Measure".
  - Measure lifts the grips, turns the screen on and runs the measurement. It reads "Measuring…" while it runs.
  - The buttons are real `<button>`s, at least 44 px tall, flat with hairline outlines in Public Sans 14 px, using the page tokens in both themes. They sit four across on desktop and 2×2 on phones.
- **Keyboard:** H, S and M still work.
- **Hint copy follows the device.** `(hover: none)` shows "Drag to turn · tap to take apart" and touch wording in the intro. Hover devices keep the keyboard hint.
- **An explicit choice sticks.** After a tap, key or button, hover no longer overrides the state and the attract tour stays off.
- **QA:** `node tools/qa-figure.mjs` runs 78 checks, all passing:
  - touch emulation at 390, 360 and 320 px (light, plus dark at 390) and desktop in both themes;
  - no horizontal scroll, the touch hint copy, 44 px buttons;
  - a tap toggles take-apart, and a drag turns the machine without toggling;
  - every button works and reports its state;
  - hover, clicks and key A on desktop.
  - Screenshots are in `out/qa-figure/`.

**Film sequence:**
1. The machine tumbles in.
2. Close-up of the touchscreen and keypad, with the screen off.
3. Close-up of the heel and forefoot electrodes.
4. The grips swing up off their rest and the screen comes on. The current path lights in leaf: first the grip cables, then the palm and forefoot electrodes (current), then the thumb and heel electrodes (voltage).
5. Close-up of the lit grips.
6. The screen steps through 5, 50, 250 and 500 kHz while a 20-cell grid fills.
7. The machine comes apart, goes back together, and holds on a hero shot with the screen reading "Complete".

**On-screen labels** are Public Sans spaced caps: "OPTIMAL HEALTH · BARRIE" and "INBODY 580 · BODY COMPOSITION".
- **16:9:** top-left and top-right inside the hairline frame.
- **9:16:** the series header block, the same geometry as the hand-dynamometer film. The two labels sit on their own lines at the top of the Instagram safe area (y ≈ 280 output px), with the caption under them and the machine below.
- **Visibility:** they show only in the wide shots that leave them clear, which are the tumble-in, the grip-lift and measurement shot, and the hero. They fade out over about 0.3 s before each close-up and stay off through the take-apart.

**Captions** are a Castoro title line with a Public Sans spaced-caps sub-line. They sit bottom-left on 16:9 and in the header block on 9:16. They state device facts only, with no health claims:
- "10.1-inch touchscreen and keypad"
- "Heel and forefoot electrodes"
- "8-point tactile electrodes"
- "Thumb and palm electrodes"
- "4 frequencies: 5, 50, 250, 500 kHz"
- "20 impedance readings"
- the dimensions

## Spec used
| Item | Value | Source | Status |
|---|---|---|---|
| Overall size | 501.9 W × 892.4 L × 1124.4 H mm | [1] §9.2, [2], [3] | Verified; 3 sources agree |
| Weight (not drawn) | 24.4 kg | [1][2][3] | Verified |
| Display | 10.1-inch 1280 × 800 colour TFT; "Keypad, Touch Screen" | [1] §9.2, [2] | Verified; drawn at the true 217.5 × 136 mm active area |
| Keypad | Setup, Function, Print, Power, 0–9, decimal point, Male, Female, Enter, Delete | [1] §2.4 | Keys verified; power-key position estimated |
| Electrodes | Tetrapolar 8-point tactile: thumb and palm on each grip; heel and forefoot on each foot | [1] §9.2, [2], truth pack §2 | Verified |
| Electrode roles (sets the glow order) | Current in at palm and forefoot; voltage sensed at thumb and heel | Truth pack §2 (rated MEDIUM there) | Not re-opened this session |
| Hand electrode | "3-way hand electrode" | [2][3] | Wording verified |
| Frequencies and readings | 5, 50, 250, 500 kHz; 20 impedances | [1] §9.2, [2] | Verified |
| Applied current (not shown) | 200 µA ±20 µA | [1] | Verified |
| Footplate | On load cells; foot electrodes, level indicator, hinge cover, level supporters | [1] §2.4 | Verified |
| Load cells | "Quad load cell system" | [4] | Verified; positions assumed |
| Rear panel | 2 × RS-232C, USB host, LAN, power inlet | [1] §2.4 (rear view) | Verified; placement estimated |
| Smart reader | QR reader | [1] §2.4, [2] | Verified; position taken from photos |
| Printer | External laser or inkjet printer over USB | [1] §5.1, §9.2 | Verified; see "Printer slot" under Could not verify |

**Sub-dimensions estimated from the clinic photos**, scaled from the 501.9 mm width and the 10.1-inch screen:
- **Footplate:** the full 892.4 mm length, with a 46 mm chevron front and its top 86 mm off the floor.
- **Foot electrodes:** forefoot 90 × 125 mm and heel 90 × 55 mm, centred ±150 mm.
- **Column:** 170 × 150 mm, faceted to a front crease, with a hinge cover up to 186 mm.
- **Reader band:** 812–840 mm. **Shoulders:** 206 mm wide.
- **Head:** 276 mm wide and 46 mm deep, tilted 58° from vertical. The tilt comes from how the screen foreshortens in two photos.
- **Grips:** about 173 mm long and 34 mm across, on about 200 mm of cable. They hang at rest and swing forward 80° when held, matching InBody's renders.

## Assumptions
**Internals are not published.** These are simplified stand-ins:
- 4 bar load cells with load buttons, on a base tray.
- An electrode harness: terminals, 2 leads and a connector.
- A 6-segment cable bundle up the column.
- A measurement board with generic AFE, MCU and MUX chips.
- In the head: an LCD module, a keypad board, and a main board with generic SoC, RAM, flash and Wi-Fi chips.
- A speaker grille, position assumed.

No internal frame or hinge bracket is modelled; the hinge cover is solid.

**Film simplifications:**
- The measurement is compressed to about 3 s; the real one takes about 30 s.
- The current path is shown as a leaf glow, with no person.
- The on-screen UI is a generic graphic in Optimal's palette, not InBody's interface, and shows no values.
- The reader's light guides are drawn in leaf; on the real machine they are blue.
- The real machine's InBody wordmarks are left out, and no model label is drawn because the machine itself shows only the wordmark.

## Counts
**114 parts in 30 explode assemblies (33 groups):**

| Area | Parts | Includes |
|---|---|---|
| Footplate | 52 | levelling feet 4×3, tray, 5 walls, load cells 4×2, cover, 4 foot electrodes, level indicator 2, harness 19 |
| Column | 19 | plinth, hinge cover, 4 shell panels, 6 bundle segments, measurement board 7 |
| Upper section | 43 | reader band, shoulders, neck, 2 holders ×3, 2 grips ×10, head 14 |

**Checks:**
- Explode sweep from 5 views (−35/15, 0/5, 140/20, 90/−20, −20/70): 0 forced picks and no pairs passing through each other.
- Film scan on every frame of both the 16:9 and 9:16 builds: every frame clean.
- **Layout check (series QA)**, `motion/check-frame.mjs` on both builds: every sample clear.
  - **Sampling covers the blur shutter.** It checks every sub-frame time the renderer averages (`--step 4 --most 40`) plus the middle of each frame's shutter: 2,273 samples on 16:9 and 2,365 on 9:16.
  - **Method.** Each sample is rendered with the paper, vignette and plate hidden on a transparent background, and the opaque scene pixels are counted, so the test is exact rather than a bounding-box estimate.
  - **Units.** Margins are CSS px of the 540-wide page; 1 CSS px = 2 output px.
  - The rules it asserts:
    - **Caption zone:** while a caption is visible, no scene pixel may fall inside the caption box grown by 40 px.
    - **Corner labels:** while a label is visible, no scene pixel may fall inside its box grown by 24 px.
    - **Hero shots** (first and last): the whole machine sits inside the hairline frame, at least 24 output px clear. On 9:16 it must also sit above y = 1248 with the same room. Tightest: 70 output px on 16:9, 28 on 9:16.
    - **Wide shots** (feature, pull-out and explode): inside the hairline frame by at least 16 CSS px. Tightest: 22 on 16:9, 72 on 9:16.
    - **9:16 only:** every visible label and caption sits inside the Instagram safe area. The Reels UI covers the top 269, the bottom 672 and 65 px on each side of the 1080 × 1920 output.

## Series spec (`../SERIES-SPEC.md`)
The four equipment films now share one spec. For InBody that meant:
- **9:16 header block.** The corner labels sit on their own lines, then the caption, inside the Reels safe area from y ≈ 280 output px. The geometry matches the hand-dynamometer film (plate inset 22/20, labels at 118/138, caption at 164/200 CSS px). Nothing readable sits below y = 1248, and the machine sits below the block.
  - This replaces the earlier bottom-left 9:16 captions and the two top-placed exceptions, which were at y ≈ 1700–1800, under the Reels UI.
- **9:16 framing.** Only 9:16 overrides were changed; 16:9 is as before.
  - **Tumble-in and hero** are scaled to fit between the header block and y = 1248 with room. The machine is about 330 px tall in a 960 px-high page.
  - **Feature, pull-out and explode** sit below the header and are kept compact, so the glowing footplate electrodes stay mostly clear of the Reels UI.
  - **Footplate close-up** is now an overhead plan view. Seen at a 3/4 angle, the column always rose into the header.
  - **Screen, grip and frequencies close-ups** are framed below the header.
- **Corner-label rule.** The 0.3 s fade rule above applies in both ratios.

## Polish round (Oct 19)
- **Caption zone kept clear by framing, not halos.** The halo is removed.
  - Captions fade in after each whip lands and are gone before the next whip starts.
  - In 16:9 every shot sits 118 px right of centre, so the caption has its own column at the left. The hand close-up uses a smaller offset to stay balanced.
- **Heroes pulled back** so the whole machine, footplate included, sits inside the hairline frame with room on every side. On 9:16 this was later reframed again for the series spec (above).
- **Corner labels follow the same clearance rule.** On the TV test build, the footplate close-up ran the footplate and column under "INBODY 580 · BODY COMPOSITION", leaving dark text on a dark plate.
  - The labels now have their own opacity channel. They fade in over 0.3 s once a clear wide shot lands and are gone 0.05 s into the next whip, before any close-up arrives.
  - They stay off through the take-apart (pull-out, explode, hold and implode), because the raised head reaches the top-right label there. The check caught this at 8.6 s and at 10.2–10.3 s.
  - They return for the hero.
- **Re-rendered and re-checked after each round.** Both films were rendered one at a time. Every MP4 was frame-extracted, its contact sheets were rebuilt, and every frame on them was reviewed.
- **Intermediates deleted after each round.** The sub-frames (`out/blur-*`), frame extracts (`out/check-*`) and working stills are all regenerable from the build.

## Could not verify
- **Printer slot.** The brief asks for one, but the InBody 580 has none; it prints to an external printer over USB. No slot was invented. The Print key and USB port are drawn instead.
- **Colourway.** One clinic photo shows a black footplate and another a white one; InBody USA also lists "Gunmetal Black". The figure follows the black-footplate product shot. Check it against the clinic's unit.
- **Measurements estimated from photos:**
  - how the 892.4 mm length splits between footplate and head (the footplate is assumed to be full length)
  - the column cross-section, pad sizes and cable length
  - which surfaces of the "3-way" grip are the palm electrode
  - the positions of the power key and rear ports
- **Internals and electrode roles.** The internals are not published, and the electrode roles were not re-checked this session.

## Sources
1. InBody 580 User's Manual EN rev B (2024-01-11), §2.4, §5.1, §9.2: https://inbodycanada.ca/wp-content/uploads/2024/03/InBody580_User_Manual_EN_B_240111.pdf (extract in `research/inbody580-manual-EN-B.txt`)
2. InBody 580 catalog ENG rev C: https://www.inbodysweden.nu/wp-content/uploads/2024/04/580_catalog_eng_C_240320_low.pdf (extract in `research/inbody580-catalog-C.txt`)
3. https://inbody.com/en/inbody/contents/view_580
4. https://inbodycanada.ca/products/inbody-580-body-composition-analyzer/
5. https://inbodyusa.com/products/inbody580/
6. `optimal-anatomy-figures/reference/truth-pack.md` §2
7. Clinic photos `inbody580-*`, used for proportion only (measured crops in `research/crops/`)
