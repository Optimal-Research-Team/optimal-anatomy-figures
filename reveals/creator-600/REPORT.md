# Creator 600: anatomy figure and reveal film

This is the Visbody Creator 600 running gait analysis treadmill (Visbody-A600 / VA600), built with the anatomy-reveal skill from 100 convex parts measured in real millimetres.

- **Look:** Optimal's palette, with Castoro and Public Sans embedded.
- **What's left out:** photos, AI imagery, people and manufacturer marks. The only figure is the joint skeleton drawn on the machine's own screen.

## Deliverables
| What | Path |
|---|---|
| Figure page, Forest night (dark) | `object/figure.html` |
| Figure page, Cream (light) | `object/figure-light.html` |
| Film 16:9 (TV, 1920 × 1080) | `out/creator-600-16x9.mp4` |
| Film 9:16 (Reels, 1080 × 1920) | `out/creator-600-9x16.mp4` |
| Contact sheets | `out/sheet-16x9.jpg`, `out/sheet-9x16.jpg` |

**Films:**
- 12.000 s, 30 fps, 360 frames, H.264 yuv420p, silent, with adaptive motion blur.
- Each ratio is its own build (`motion/motion-9x16.html`, `motion/motion-16x9.html`), kept so the checks can be re-run.
- The contact sheets show 8 frames from the encoded MP4s, at 0.5, 2.8, 4.2, 5.2, 6.4, 7.6, 9.2 and 11.9 s.

**Shot order:**
1. The machine tumbles in.
2. Close-up of the depth camera; its status light comes on.
3. The handrail console; the + key presses.
4. The 13.3″ touch console.
5. The belt runs at 8 km/h while the screen locks on and tracks a skeleton joint by joint; the camera pushes into the screen.
6. The machine comes apart and goes back together.
7. Hero shot, with the belt still running.

## Series spec conformance
**Plate:** CSS identical to the InBody and dynamometer films.
- **16:9:** hairline frame at 26/24 px; corner labels at the top; caption bottom-left inside the frame; close-ups weighted right.
- **9:16:** a header block inside the Reels safe area. The labels, then the caption, start at y = 280 px, with the machine below.

**Type and fades:**
- Captions are a Castoro sentence-case title over one spaced-caps sub-line, with no dash.
- Captions fade in after a whip lands and are gone before the next one.
- Labels fade out over 0.3 s for close-ups and return for the wide shots.

**QA:** `motion/qa.mjs` renders the machine alone on a transparent background at 60 samples a second, which covers the blur shutter. It measures in film pixels and has a framing-search mode, which was used to choose every shot.

| Check | 9:16 | 16:9 |
|---|---|---|
| Samples (60/s) | 721/721 pass | 721/721 pass |
| Caption clearance (needs 40 px) | closest 45 px | closest 48 px |
| Corner-label clearance (needs 24 px while visible) | over 100 px | 48 px |
| Hero room, first and last shots (needs 24 px) | 32 px; below the header and above y = 1248 | 78 px |
| Text inside the Reels safe area (x 65–1015, y 269–1248) | pass | n/a |

The paint-order scan was clean on every frame in both ratios. The five-view explode sweep found 0 forced picks and no parts passing through each other.

## Figure page: touch parity
- **Tap** (under 8 px and 300 ms) toggles the explode. **Drag** turns the machine and never toggles it.
- **Control row:** real 44 px buttons in both themes.
  - "Take apart" / "Put together" (`aria-pressed`)
  - "Run belt" / "Stop belt" (`aria-pressed`)
  - "Press speed key" (momentary)
- **Touch hint:** "Drag to turn · tap to take apart".
- **Verified** with touch emulation at 390, 360 and 320 px in both themes:
  - no horizontal scroll and no console errors;
  - tap toggles both ways;
  - a drag turns the machine 108–136° without exploding it;
  - every button works.

## Spec and sources
- **[P]** Visbody product page: https://visbody.com/visbody-creator600/
- **[B]** Visbody brochure, via the Greek distributor Antisel: https://www.antisel-physio.gr/wp-content/uploads/2025/05/Creator600-Brochure.pdf
- **[G]** Visbody blog: https://visbody.com/de/blog/visbody-creator600-the-ultimate-ai-gait-analysis-treadmill/
- **[R]** Visbody renders
- **[C]** The clinic's `creator600-*` photos, `creator600-overview.mp4`, and Fig 4's `NOTES.md`

| Item | Value | Source |
|---|---|---|
| Overall size | 2564.2 × 1024 × 2289.9 mm (read as L × W × H); 360 kg | [P] |
| Running area | 580 × 1620 mm; 2.2 mm belt; 25 mm board | [P] [B] |
| Drive | 6.8 HP; 0.5–20 km/h; electric incline 0–18 %; 180 kg max user | [P] [B] |
| Display | LG 50″ 4K, portrait | [B] [G] [R] |
| Camera | Intel depth vision sensor, in a portrait window under the screen | [B] [G] |
| Touch console | 13.3″ 1080p | [B] |
| Handrails | Speed and incline keys, heart-rate grips, safety switch, fans, Hi-Fi audio, storage | [B] |
| Compute | Intel i5, 8 GB, 256 GB SSD | [B] |
| Power | 220 V | [P] [B] |

The display is 50″, confirmed by Visbody's brochure and Peter's note of 2026-10-12. The clinic website's "32-inch" is wrong and still needs fixing.

## Assumptions
**Estimated proportions.** These come from the published size, the 580 mm belt and the person in the video:
- **Deck:** step top at 252 mm.
- **Handrails:** top at 1075 mm; pods to 1160 mm.
- **Side panels:** 800 × 670 mm, leaning about 21°.
- **Pedestal:** 690 × 222 mm.
- **Screen:** spans 1150–2257 mm, drawn as a 622.6 × 1106.8 mm panel stood on end.
- **Camera plate:** 96 × 220 mm, centred about 1.0 m up.

**Touch console** sits on a post off the right pod, where three renders put it.

**Internals are simplified and plausible, not taken from a teardown:**
- AC motor with flywheel, an inverter, and an incline lift motor
- Rollers, and the running board on six dampers
- LCD module and camera board (RGB, two IR, projector)
- Two chin speakers
- PC and power supply in the pedestal

**Deliberate departures from the real machine:**
- It's black with orange-red strips; here it's sage and grey with the strips in leaf.
- The "A" graphic and the AIGYM mark are left off.
- The start key's running-man icon is drawn as ▶.
- The screen is a simplified redraw with no logos. The skeleton is a textbook gait model, and its readouts (8.0 km/h, 165 spm) are illustrative.

**Captions** state device facts only, with no health claims. The top-right label is `CREATOR 600 · RUNNING GAIT ANALYSIS`.

## Counts
**100 parts in 68 explode assemblies, 64 of which move:**

| Assembly | Parts |
|---|---|
| Tower | 14 |
| Display and camera | 14 |
| Deck and drive | 37 |
| Handrails | 20 |
| Handlebar | 12 |
| Touch console | 3 |

## Not verified
- **Estimated from renders and the video:** deck, handrail and camera heights, the camera's aim, the chin and pedestal proportions, and the panel lean.
- **The clinic's own unit:** there's no photo of it.
- **Touch console position:** three renders put it on the right pod; one source puts it front centre.
- **Assumed fittings:**
  - right-pod keys mirror the left;
  - the orange block is the safety switch;
  - fans sit behind the pod grilles;
  - the band under the screen is a vent with an LED line.
- **Depth sensor:** type, model and aperture layout are not published.
- **Internals:** illustrative only.
- **Figure pages:** checked only in headless Chrome with touch emulation, not on a real phone.

Regenerable intermediates (blur sub-frames, check frames, stills, logs) were deleted after delivery.
