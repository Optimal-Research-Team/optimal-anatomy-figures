# KICKR BIKE SHIFT · anatomy figure and reveal film

This is an exploded-view figure (two interactive pages) and a 12 s reveal film, in 16:9 for the reception TV and 9:16 for Reels, made for Optimal Health, Barrie. It follows the shared series spec (`../SERIES-SPEC.md`). Everything is drawn geometry in Optimal's palette, with no logos, photos or people.

## Read first: the clinic's bike doesn't tilt
- **The bike is a KICKR BIKE SHIFT (2023).** "KICKR BIKE SHIFT" is printed on the drive case in both clinic photos. Three features also match Wahoo's SHIFT owner's manual: the cantilevered beam with no front column, the three-leg base, and the large covered flywheel.
- **The SHIFT has no physical incline or decline.** Wahoo lists only *simulated* grade (20% up, −15% down), produced by the electronic brake. DC Rainmaker says it "doesn't physically move/tilt the bike up and down". The tilting front belongs to the original KICKR BIKE and the V2.
- **So the film never tilts the frame.** That would show patients a feature this bike doesn't have. The working-feature beat is the flywheel cover lifting off while the cranks turn the flywheel through the belt.
- **Three real SHIFT motions are shown:**
  - the saddle rises 60 mm on its numbered post;
  - the right shift paddle clicks twice;
  - the cranks turn in the hero.
- **The closing caption says "up to 20% simulated grade",** which is Wahoo's own wording.

## Deliverables
| What | Path |
|---|---|
| Film, 16:9 TV (1920 × 1080, 30 fps, 12.000 s, H.264 yuv420p, silent) | `out/kickr-bike-16x9.mp4` |
| Film, 9:16 Reels (1080 × 1920, same) | `out/kickr-bike-9x16.mp4` |
| Contact sheets (8 frames from the MP4s) | `out/sheet-16x9.jpg`, `out/sheet-9x16.jpg` |
| Inspection sheets (12 frames) | `out/check-16x9.jpg`, `out/check-9x16.jpg` |
| Anatomy page, dark (forest-night) | `object/figure.html` |
| Anatomy page, light (cream) | `object/figure-light.html` |
| Page captures (390 px, both themes) | `out/fig/light.png`, `out/fig/dark-apart.png`, `out/fig/touch-pair.png` |
| Object source | `object/geometry.mjs`, `object/film.mjs` |
| Film source | `motion/timeline.mjs`, `motion/look.css`, `motion/motion-16x9.html`, `motion/motion-9x16.html` |
| QA tools | `motion/check-frame.mjs` (per-frame checks), `motion/frame-search.mjs` (framing search) |

The pages are self-contained with fonts embedded.
- **Mouse:** drag to turn, hover to take apart. Keyboard shortcuts are A, C, O, S and P.
- **Touch:** tap to take it apart or put it back, and drag to turn. The hint reads "Drag to turn · tap to take apart".
- **Buttons, shown on every device:** Take apart / Put together, Turn the cranks, Lift the cover, Raise the saddle, Click the paddle. They're real 44 px buttons, and the toggles carry `aria-pressed`.

## Spec, with sources
| Item | Value | Source |
|---|---|---|
| Model | Wahoo KICKR BIKE SHIFT (2023) | Clinic photos; owner's manual [2] |
| Footprint | ≈ 1,400 × 790 mm (model: 1,398 × 788) | Zwift Insider 79 × 135 cm [6]; a DC Rainmaker reader quoting Wahoo, 78 × 140 cm [5]; clinic Fig 5 notes |
| Weight | 36 kg (79 lb), not drawn or captioned | Wahoo [1]; other sources say 40 kg |
| Base | Spine; front leg (4 × 5 mm bolts); 2 rear stabiliser legs (2 bolts each); rear levelling feet; front foot pad | Manual: box contents, parts, setup [2] |
| Resistance | Electronic brake; no motor, no tilt | Wahoo [1]; DC Rainmaker [4]; Zwift Insider [7] |
| Drivetrain | Belt drive | Wahoo [1] |
| Max power and accuracy | 2,200 W, ±1% | Wahoo [1]; DC Rainmaker [4] |
| Simulated grade | Up to 20% up, −15% down | Wahoo [1] |
| Fit | Five points (stack, reach, setback, saddle height, frame height), with quick-release levers and printed rulers | Wahoo [1]; manual [2]; DC Rainmaker [4] |
| Crank length | 165, 167.5, 170, 172.5 or 175 mm, set by one of five pedal holes in the arm's "claw" | Wahoo [1]; manual [2]; DC Rainmaker [3][4] |
| Pedals | Not included, so none are drawn | Wahoo [1]; manual [2] |
| Shifters | Brake-style lever and paddle on each hood, plus 2 inner steering buttons each; Shimano, SRAM or Campagnolo modes | Wahoo [1]; DC Rainmaker [4] |
| Front junction box | Magnetic, below the stem, with Wi-Fi and Bluetooth status lights | DC Rainmaker [3][4]; Zwift Insider [7] |
| Rider range | 152–193 cm, up to 113 kg | Wahoo [1] |

Sources:
1. https://ca.wahoofitness.com/devices/indoor-cycling/smart-bikes/kickr-bike-shift-buy
2. https://www.wahoofitness.com/media/wysiwyg/instructions/Wahoo_KICKR_BIKE_SHIFT_QSG.pdf (pages 5–9 rendered and read)
3. https://www.dcrainmaker.com/2023/09/wahoo-initial-thoughts.html
4. https://dcrainmaker.com/2024/06/wahoo-kickr-bike-shift-in-depth-review.html
5. A reader comment on [3]
6. https://zwiftinsider.com/smart-trainer/wahoo-kickr-bike-shift/
7. https://zwiftinsider.com/wahoo-kickr-bike-shift
8. https://the5krunner.com/specs/wahoo/wahoo-kickr-bike-shift/
9. `optimal-anatomy-figures/figures/05-vo2max/NOTES.md`

## Assumptions
- **Scale** comes from the manual's side elevation, at about 1.2 mm per pixel. Three checks agree:
  - the base measures 1,386–1,400 mm, and about 79 cm wide with the rear legs at 42°;
  - the saddle measures 265 mm;
  - the crank holes fall at 165–175 mm.
- **Key heights:**
  - crank axis: 310 mm;
  - beam: 732–810 mm;
  - saddle top: about 1,010 mm;
  - bar clamp: 926 mm.
- **Flywheel cover:** drawn 440 mm across, from the manual's proportions. Zwift Insider says 48 cm. No size is captioned.
- **Internals are inferred,** because there is no public SHIFT teardown:
  - belt route and pulleys (3.3 : 1 ratio, used only for the animation);
  - flywheel lightening holes;
  - the electronic brake, drawn as a green stator puck;
  - the case wall.
- **Widths:** the bar is 420 mm wide, from a reader comment. The crank span across the arms is about 234 mm and isn't published.
- **Seat tube and post:** the seat tube is square. The seatpost is non-round, per DC Rainmaker, with ruler marks on both sides.
- **Cover lift** is a cutaway device; the real cover is fixed.
- **Colours:**
  - the bike's black is drawn as forest-charcoal ink and its grey as sage;
  - the status lights are leaf and cream;
  - the drive-case label panel is left blank, with no wordmarks.

## Counts
**149 parts, 54 explode assemblies:**

| Group | Parts |
|---|---|
| Handlebars, hoods, levers and paddles | 37 |
| Flywheel, cover and brake | 25 |
| Bottom-bracket housing, cases and belt drive | 16 |
| Upper frame, sliders and levers | 16 |
| Seat tube, post and saddle | 16 |
| Base | 13 |
| Head tube, steer tube, stem and junction box | 9 |
| Bottle cage | 9 |
| Cranks | 8 |

## The film (12 s)
**The camera only moves forward.** Holds, drifts, whips and the hero only keep or tighten the framing. Every change to a wider framing is a hard cut, placed on a frame boundary.

| t (s) | Beat | Move into the shot | Caption |
|---|---|---|---|
| 0–2.10 | Tumbles in from the rear-right to the front-left; corner labels on | opening (zoom only tightens) | Smart indoor bike · BELT DRIVE · ELECTRONIC BRAKE |
| 2.10–3.33 | The left crank's claw, drifting to its five-bolt disc (a slow push in 9:16) | whip in (tighter) | Crank length · 165–175 MM · FIVE PEDAL HOLES |
| 3.33–4.78 | The seatpost from the rear-left; the saddle rises 60 mm | **cut 1: frame 100, 3.333 s** | Five-point fit · SADDLE · STACK · REACH · SETBACK · FRAME |
| 4.78–5.87 | The cockpit from behind; the right paddle clicks twice | whip in (tighter) | Virtual shifting · SHIMANO, SRAM OR CAMPAGNOLO MODES |
| 5.87–7.70 | From the rear-left: the cover lifts off, the cranks turn the flywheel through the belt, and the cover goes back on | **cut 2: frame 176, 5.867 s** | Belt drive · electronic brake · UP TO 2,200 W · ±1% POWER ACCURACY |
| 7.70–10.40 | A wide shot from the rear-right: the bike comes apart while the camera holds and creeps in, then goes back together as the camera pushes in | **cut 3: frame 231, 7.700 s** | Taken apart · 149 PARTS · 54 ASSEMBLIES |
| 10.40–12 | Hero, front-right three-quarter; still pushing in, the cranks make a turn and settle; corner labels return | continuous with the implode | KICKR BIKE SHIFT · UP TO 20% SIMULATED GRADE |

**Cuts:**
- Each cut is a pair of keys: the outgoing shot's last state, 0.1 ms before the boundary, then the new shot exactly on `n / 30`, using a step ease.
- `render.mjs` samples each frame's shutter at `(n + j/subs) / 30`. So every blur sub-frame lands wholly in one shot, and the two framings never average together.
- `speed()` stops measuring at a cut, so the frame before a cut isn't flooded with sub-frames.

The old 7.6–9.9 s pull-out is gone. The cover now closes inside the flywheel shot, and the film then cuts straight to the wide shot.

**Layout, per `SERIES-SPEC.md`:**
- **Corner labels:** "OPTIMAL HEALTH · BARRIE" and "KICKR BIKE · VO₂ MAX TESTING", in Public Sans spaced caps.
- **Captions:** a Castoro title over a spaced-caps sub-line. No italic, no dash, no halo.
- **16:9:** InBody's inset, with the caption bottom-left and close-ups weighted to the right.
- **9:16:** the grip film's header block, starting at y ≥ 269 inside the safe area, with the bike below it.
- **Caption timing:**
  - each caption fades in after its whip or cut lands (0.2 s), and is gone before the next whip or cut (0.15 s);
  - captions are also hidden while the bike comes apart and goes back together;
  - so no caption spans a cut, and the text only changes while it's hidden.
- **Corner label timing:** the labels fade out over 0.3 s before the first close-up and return as the hero settles, so no part ever runs under them.

## Checks
- **Explode sweep**, from five views (front, back, top, below, side): 0 forced picks and no pass-throughs.
- **Camera check**, in `motion/check-frame.mjs`. For both ratios:
  - zoom never decreases between consecutive samples except across a cut;
  - every cut sits on a frame boundary (frames 100, 176, 231);
  - no blur sub-frame, as `render.mjs` schedules it, straddles a cut.
- **Paint-order scan:** clean for both films.
- **Per-frame check:** 60 samples per second, 721 per film, with the bike rendered alone on a transparent background. Zero violations in both ratios for:
  - caption box + 40 px;
  - corner labels + 48 px;
  - opening (0–2.1 s) and hero (10.4–12 s) inside the hairline frame, with at least 32 px clear;
  - 9:16 only: labels and captions inside the safe area, and the bike above y = 1248 in the opening and hero.
- **MP4 frames:** extracted and laid out on the contact sheets.
- **Figure pages:** tested under touch emulation at 390, 360 and 320 px in both themes:
  - no horizontal scroll and no page errors;
  - all buttons work and `aria-pressed` updates;
  - tap toggles, and drag turns.
- **Cleanup:** blur sub-frames, extracted frames and working stills were deleted.

## Not verified
- **Wahoo's own assembled figures:** the footprint and height weren't confirmed, because the support page returned 403.
- **Sub-dimensions:** scaled from a manual illustration, so expect about ±5–10%.
- **Two conflicting specs:**
  - weight: 36 kg (Wahoo) vs 40 kg elsewhere;
  - flywheel: 48 cm (Zwift Insider) vs 44 cm as scaled.
- **Internal layout:** the belt, pulleys, ratio and brake form are all inferred.
- **Small details:** hood-button placement and bar width, case screw positions, and the exact shapes of the cage and saddle.
- **Decline:** Wahoo's selectable range also lists −20%. The film only claims "up to 20%".
- **Label "VO₂ max testing":** this is the clinic's use of the bike, kept from the brief. The bike itself measures power.
- **Known nit:** 2–3 px light slivers at a few bar-tape joints in the 0.8 s cockpit close-up.

## Rebuild
```sh
export PATH="$HOME/.nvm/versions/node/v22.22.0/bin:$HOME/.local/bin:$PATH"
node object/build.mjs && node object/build.mjs --light
node motion/build.mjs --duration 12 --ratio 16:9 && node motion/scan.mjs && node motion/check-frame.mjs --hero 0-2.1,10.4-12
node motion/render.mjs blur out/blur16 --step 4 --most 40 && MAGICK=magick-mean node motion/encode.mjs out/blur16 out/kickr-bike-16x9.mp4
# then the same with --ratio 9:16 → out/kickr-bike-9x16.mp4
```
