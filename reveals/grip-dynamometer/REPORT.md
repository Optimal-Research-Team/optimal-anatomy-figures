# Hand dynamometer: anatomy figure and reveal film

Optimal Health, Barrie · `anatomy-reveal` skill · October 2026 · conforms to `../SERIES-SPEC.md`

## 1. Brand assumption (please confirm)

**Nobody has confirmed which dynamometer the clinic uses.** This is built as the clinical-standard **Jamar-style hydraulic hand dynamometer** (Lafayette Instrument / Sammons Preston / Performance Health, model J00105 / 5030J1 family): sealed hydraulic system, five-position adjustable handle, analog dual-scale gauge (0–90 kg / 0–200 lb), and a peak-hold needle with a reset knob on the crystal.

If the clinic uses something else, name it and the parts that differ get rebuilt:
- **Jamar clone** (Baseline, Saehan and similar): nearly identical.
- **Digital Jamar** (Jamar Plus or Smart): an LCD instead of a peak needle, and a different handle latch.
- **Spring dynamometer** (Takei, Camry and similar): a different body altogether.

There are no logos or wordmarks. The dial reads only "kg", "lb" and "PEAK HOLD". "Jamar" appears in this report only, never in the pages or films.

## 2. Spec, with sources

| Item | Value used | Source |
|---|---|---|
| Range | 0–90 kg / 0–200 lb, dual-scale analog dial | Lafayette J00105 user manual; NIHR Southampton BRC procedure |
| Scale layout | kg outer scale, lb inner scale | Southampton procedure |
| kg ticks | Every 2 kg, numbered every 10 | MrOS manual reads "to the nearest 2 kilograms"; the tick spacing is inferred from that |
| lb ticks | Every 5 lb, numbered every 20 | Assumption; no source found |
| Peak-hold needle | Holds the highest reading until reset; turned counter-clockwise back to 0 | Lafayette manual |
| Reset knob | Chrome knob outside the crystal. A brass pin through the crystal centre carries the peak needle, which sits in a slot. The crystal unscrews. | Lafayette manual; MrOS; Southampton |
| Handle positions | Five, 1⅜ to 3⅜ in, in ½ in steps (34.9 / 47.6 / 60.3 / 73.0 / 85.7 mm) | Lafayette manual (Southampton gives 35–87 mm in 13 mm steps) |
| Handle mounting | The forks rest on two posts, touching each at about its midpoint. The handle clip is on the lower post, the one furthest from the gauge. | Lafayette manual |
| Hydraulics | Sealed. With the handle removed, pushing one post moves both about ⅛ in, in opposite directions. | Lafayette manual (service tips) |
| Pistons and channel | "Dual pistons" joined by "a single hydraulic channel" | US 5,945,590 |
| Gauge | Bourdon-tube gauge. Jamar-type units are described with bronze bellows and stainless tubing. | Baseline manual, seen only as a search summary (direct access refused) |
| Isometric | "Almost no perceptible motion of the handles" | Lafayette manual |
| Protection | Shock-resistant rubber cap on a stainless gauge; wrist strap | Retail listings; Lafayette manual |
| Calibration | Calibrated at the factory; check yearly | Lafayette manual |
| Overall size | Drawn at about 220 mm tall (268 mm with strap); gauge Ø100 mm; about 100 mm wide at position 2; about 36 mm deep | Estimated. One calibration-service page lists 8.5 × 4.5 × 1.75 in and 2.5 lb (unconfirmed); other listings give boxed sizes. |
| Clinic use | Hand dynamometer, best of either hand, in kg; measured in clinic and tracked quarterly | `optimal-reception-tv/content/protocols/longevity-protocol.txt` §1.3 |

Source links:
- Lafayette J00105 manual: https://www.limef.com/downloads/jamarhanddynamometer.pdf
- MrOS grip chapter: https://agingresearchbiobank.nia.nih.gov/studies/mros/documents/download/Protocols/Baseline/Grip.pdf/
- NIHR Southampton BRC procedure: https://www.uhs.nhs.uk/Media/Southampton-Clinical-Research/Procedures/BRCProcedures/Procedure-for-measuring-gripstrength-using-the-JAMAR-dynamometer.pdf
- US 5,945,590: https://patents.google.com/patent/US5945590
- Size listing (unverified): https://microprecision.com/calibration/sammons-preston-jamar/
- Retail: https://www.physioparts.co.uk/hand-dynamometer-hydraulic-jamar and https://mdmaxx.com/products/jamar-5030j1-hydraulic-hand-dynamometer

## 3. Other assumptions

1. **Proportions** are estimated, scaled from the five handle positions and the 216 × 114 × 44 mm listing.
2. **Layout, seen from the dial:** gauge on top, the C-shaped aluminium body (the fixed handle) on the left, the adjustable handle on the right.
3. **The squeeze:** the handle pulls toward the body, and its forks push both posts (the pistons) into their bores. Fluid carries the pressure up the stem into a C-shaped Bourdon tube, and a link, toothed sector and pinion turn the needle.
4. **Internals are simplified.** The real body is a sealed casting. Here it gets a removable front cover so the channel and bores can come apart. The pistons are round rods in square bores. A bellows capsule, if the real unit has one, isn't drawn.
5. **Fork engagement is assumed:** notched plates in front of and behind the body, stamped 1–5, resting on cross pins at the post ends. The pins stop just short of the plates. That's a drawing constraint and invisible at film scale.
6. **Handle clip** is drawn as a retainer plate under the lower post's pin. The manual only says where the clip is, not what it looks like.
7. **Squeeze travel is exaggerated** to 2.5 mm at 42 kg so it shows on film. The real instrument barely moves.
8. **Dial layout is drawn, not measured:** zero at 12 o'clock, and both scales on one clockwise 324° sweep to 200 lb (90.7 kg).
9. **Peak needle colour:** it's red on the real instrument but drawn in the leaf accent here. Changing it back to red is one line.
10. **Demo reading:** 42 kg is arbitrary. It isn't a target from the grip table and isn't a claim.
11. **Handle position:** set to position 2, the usual protocol setting.
12. **Strap:** drawn as a short flat loop.
13. **Colours** are Optimal's palette, not literal finishes: cream paper #FFFCF7, forest ink #2C4E25, leaf accent #A9D49C, greys #C9CDBF / #8E9884.

## 4. Parts and assemblies

**102 convex parts in 18 explode assemblies**, plus 4 moving feature groups: squeeze, handle position, main needle, and peak-hold needle with its knob.

| Group | Parts |
|---|---|
| Body (rear plates 3, walls 7, gauge port 1) | 11 |
| Front cover | 3 |
| Bores (2 × top, bottom, front, back, end) | 10 |
| Hydraulic channel and manifolds | 3 |
| Posts (rods 2, cross pins 2) | 4 |
| Handle clip | 1 |
| Adjustable handle (grip bar and notched fork plates) | 7 |
| Gauge (hex, stem, case back, movement plate; rubber cap ×13; Bourdon tube with socket, 9 segments and tip; sector, link, pinion; dial; main needle ×2; bezel ×12; crystal; peak needle and pin; reset knob) | 50 |
| Wrist strap (eyelet and 12 segments) | 13 |

The explode runs in this order:
1. The handle slides off the posts.
2. The posts withdraw from their bores.
3. The gauge lifts and fans forward: crystal (with knob and peak needle), bezel, main needle, dial, movement, Bourdon tube. The case back and rubber cap go backward.
4. The front cover opens.
5. The bores and the leaf-green channel come out.
6. The strap drops.

## 5. Deliverables

| What | Path |
|---|---|
| Figure page, dark | `object/figure.html` |
| Figure page, light | `object/figure-light.html` |
| Film, 16:9 TV (1920 × 1080, 30 fps, 360 frames, 12.0 s, H.264 yuv420p, 10.4 MB) | `out/grip-dynamometer-16x9.mp4` |
| Film, 9:16 Reels (1080 × 1920, 30 fps, 360 frames, 12.0 s, H.264 yuv420p, 12.1 MB) | `out/grip-dynamometer-9x16.mp4` |
| Contact sheets: 8 frames from each MP4, at 0.6, 2.6, 3.7, 5.0, 5.9, 7.0, 9.3 and 11.9 s | `out/sheet-16x9.jpg`, `out/sheet-9x16.jpg` |

On the figure pages (phone-first, nothing hover-only):
- Drag to turn the object; tap it to take it apart or put it back. A touch under 8 px and 300 ms counts as a tap.
- A control row under the figure on every device, all real `<button>`s, at least 44 px tall:
  - **Take apart / Put together** (toggles, `aria-pressed`);
  - **Squeeze** (toggles, `aria-pressed`);
  - **Reset peak**;
  - **Handle position** (steps 1–5).
- On devices that can hover, hovering previews the take-apart. The keys still work: A, G, R, H and the arrows.
- Touch devices (`hover: none`) read "Drag to turn · tap to take apart" on the hint line.
- Checked with `npm run page-check`: touch emulation at 390, 360 and 320 px, plus desktop at 1280 px in both themes. No horizontal scroll; tap, drag and every button work. Screenshots are in `out/page-shots/`.

### The film (12 s, silent)

| t (s) | Beat | Caption (title · sub-line), on screen |
|---|---|---|
| 0–1.82 | Tumbles in from behind and rights itself to three-quarter | Hand dynamometer · Grip strength · hydraulic (0–1.78) |
| 1.82–2.06 | Whip to the dial | none |
| 2.06–2.96 | Dial; slow drift | Dual scale · 0–90 kg outside · 0–200 lb inside (2.06–2.92) |
| 2.96–3.20 | Whip to the forks | none |
| 3.20–4.06 | Notched forks under the gauge (medium close-up) | Five handle positions · 35 to 86 mm · ½-inch steps (3.20–4.02) |
| 4.06–4.30 | Whip to gauge and handle | none |
| 4.30–5.46 | The handle squeezes in; both needles sweep to 42 kg | Sealed hydraulic system · Handle squeezes in · needle sweeps up (4.30–5.42) |
| 5.46–6.16 | Grip released: the main needle returns, the peak needle holds | Peak-hold needle · Keeps the highest reading (5.48–6.12) |
| 6.16–6.40 | Whip to the knob | none |
| 6.40–7.36 | The knob turns and the peak needle returns to zero | Reset knob · Turns the peak needle back to zero (6.40–7.40) |
| 7.36–10.42 | Pull out, explode, drift apart, then come back together | Taken apart · 102 parts · 18 assemblies (7.94–8.90); Bourdon tube · two pistons · The sealed hydraulic path (8.96–9.70) |
| 10.42–12 | Hero at three-quarter front, easing to stillness | Hand dynamometer · Measured in clinic · best of either hand (10.42–12) |

Each caption fades in over 0.16 s once its shot lands (0.4 s for the first), rising 5 px, and is gone 0.1 s before the next whip, as in the InBody film.

Other details:
- **Corner labels:** both in Public Sans spaced caps (the TV kit's eyebrow style): `OPTIMAL HEALTH · BARRIE` and `HAND DYNAMOMETER · GRIP STRENGTH`. No Castoro italic, no leading dashes. The object never crosses them, so they stay on for the whole film.
- **Type:** Castoro and Public Sans, embedded from local woff2.
- **Captions:** a Castoro title line in sentence case over one Public Sans spaced-caps sub-line. Factual features only, no health claims, no halos.
- **16:9 layout:** the frame, label insets and caption type match the InBody film (frame inset 26 / 24 px; labels at 15 / 16 px; caption bottom-left). Close-ups are weighted right so the caption is on clear paper.
- **9:16 layout:** the series' header block. It starts at y 276 (output px) inside the Reels safe area (1080 × 1920: top 269, bottom 672, sides 65 px clear): the two label lines, then the caption. The object always stays below it. In the tumble-in and hero shots the whole object sits above y = 1248, inside the frame with room. That makes the 9:16 hero smaller than in the first delivery, as the spec requires.

## 6. Checks

**Explode and paint order:**
- Five-view explode sweeps (−35/15, 0/5, 140/20, 90/−20, −20/70; 201 steps each): no forced picks, no pairs passing through each other.
- Per-frame paint-order scan, at 60 samples a second on both films: every frame clean.

**Framing QA** (`scripts/caption-check.mjs` + `.py`), per `SERIES-SPEC.md`. Each sample renders the object alone on a transparent background and measures every visible label box from the page. A label counts only while its opacity is above 0.01.

| Rule | Margin | Result |
|---|---|---|
| Caption clearance: no object pixel near the caption title or sub-line | 40 px | Pass |
| Corner-label clearance: no object pixel near either corner label | 48 px (spec: 24) | Pass |
| Hero in frame: tumble-in (0–1.82 s) and hero (10.42–12 s) inside the hairline frame | at least 32 px inside (spec: 24) | Pass |
| 9:16 only: every visible label and caption inside the Reels safe area | top 269, bottom 672, sides 65 px | Pass |
| 9:16 only: tumble-in and hero above y = 1248 | 24 px to spare | Pass |

There were 0 failures in 720 samples per film (60 a second, which also covers the motion-blur shutter). The corner labels are never crossed, so no label fades are needed.

History:
- **First renders:** failed the clearance rules. Every shot was reframed and both films re-rendered.
- **Series-spec pass:** restyled the labels, added the caption fades, and lowered the 9:16 hero. Then QA was re-run and both films re-rendered, one at a time.

**MP4 frames:** every frame of both encoded films was extracted. A dozen from each film were viewed, and frames were inspected at full resolution.

## 7. Not verified

- The clinic's actual brand and model.
- The real dimensions, weight and gauge diameter; no manufacturer spec sheet was found.
- The dial's zero position, sweep, lb tick spacing and any extra printing.
- The real internals: piston vs bellows, the channel route, and how the stem meets the body. The Bourdon movement follows generic pressure-gauge practice.
- How the fork notches seat on the posts, and the clip's shape.
- Whether a 2.5 mm squeeze is realistic; it's illustrative only.
- How the films look on the reception TV or in the Instagram app. The safe zone was checked against the clinic's numbers, not on a device.

## 8. Rebuild

```sh
export PATH="$HOME/.nvm/versions/node/v22.22.0/bin:$HOME/.local/bin:$PATH"
cd "../../optimal-equipment-reveals/grip-dynamometer"
npm run materials && npm run test-page && npm run figure && npm run film
npm run check && npm run qa
npm run render:16x9 && npm run encode:16x9   # one film at a time
npm run render:9x16 && npm run encode:9x16
```

Changes made to the skill template for this project only:
- `kit/turn.mjs`: 8 Optimal materials, plus 2 debug hooks for tracing paint-order cycles.
- `object/optimal.css`: the see-through crystal.
- `object/figure.css`: the page themes.
- `scripts/fonts.mjs` and `assets/fonts/`.
- `motion/look.css`:
  - the cream and forest recolour;
  - the series-spec plate (InBody insets and type);
  - the 9:16 header block;
  - caption and label fades on `--cap-o` / `--corner-o`.
- `motion/build.mjs`: added `--out`, `data-ratio`, `window.fitZoom` and the fade variables.
- `motion/timeline.mjs`: a 12 s base, 9:16 base values and 16:9 overrides; caption windows (`t` to `until`).
- `scripts/caption-check.mjs` + `.py`: the framing QA, including the 9:16 safe-area and y = 1248 checks.
- `scripts/sheet.py`: the contact sheets.
- `object/geometry.mjs`: a debug-only `SKIP=<regex>`.

Regenerable intermediates (sub-frames, check frames, logs) were deleted after delivery.
