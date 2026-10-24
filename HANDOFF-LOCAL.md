# Handoff: continuing locally

This file is the full state of the project. It was written for the hand-off from the cloud session to a local Claude Code session on the Mac (Max plan limits, not cloud credits), and the local session has kept it current since. **Last updated:** 2026-10-21: A2 round 4, the real-time 3-D hypothalamus (one WebGL layer, lazy chunk), and the `handoff-2026-10-21b` release. Work on `main`.

**First prompt for the local session:**
> Read CLAUDE.md, HANDOFF.md, HANDOFF-LOCAL.md and BACKLOG.md. Then continue from "Next steps" in HANDOFF-LOCAL.md.

## 1. Set up on a Mac (about 5 minutes)

```bash
git clone https://github.com/Optimal-Research-Team/optimal-anatomy-figures.git
cd optimal-anatomy-figures
node -v                               # needs Node 20+ (brew install node)
bash scripts/setup-cloud.sh           # finds Chrome, writes .env.chrome, smoke-tests a capture
source .env.chrome                    # every capture/drive/lines command needs CHROME_PATH
node scripts/build-all.mjs            # builds all 15 figures + gallery into dist/ ("15/15 built")
open dist/index.html
claude                                # Claude Code reads CLAUDE.md on start
```
- There's no npm install. The Anatomy kit is vendored in `.claude/skills/anatomy/`; never edit it, and patch in `shared/` instead.
- `scripts/chrome-root.sh` (Chrome with `--no-sandbox`) is only for cloud containers that run as root. On the Mac, `setup-cloud.sh` should find `/Applications/Google Chrome.app`. If it doesn't, set `CHROME_PATH` in `.env.chrome` by hand.
- Live gallery: https://optimal-research-team.github.io/optimal-anatomy-figures/. Pushing `main` deploys it via `.github/workflows/pages.yml` in about a minute.

## 2. Status (15 figures, all in the gallery; every anatomy piece is 3-D)

| # | Figure | State | Folder |
|---|---|---|---|
| 1 | Menopause thermostat | Round 1 done. No treatment switch, on purpose (see NOTES "Decisions") | `01-menopause-thermostat` |
| 2 | InBody 580 | Round 1 done. Checked against InBody's result-sheet guide: no segmental reactance printed, which is correct | `02-inbody-580` |
| 3 | IV iron | Round 1 done | `03-iv-iron` |
| 4 | Creator 600 | Round 1 done; built `shared/mannequin.*` | `04-creator-600` |
| 5 | VO₂max on a bike | **Round 3**: smart bike at KICKR BIKE SHIFT proportions (no logo or copied design), power arc on the flywheel cover, wireless mask, assessor with tablet | `05-vo2max` |
| 6 | VO₂max on the Creator 600 | **Round 2**: dashboard mockup on the treadmill screen (speed, cadence, step, grade, live runner trace) | `06-vo2max-treadmill` |
| A1 | Gut cell's gate | **Round 2 · 3-D block** (2026-10-12): brush border of 272 microvilli on top, cells cut on the right end, capillary half-tube | `a1-gut-cell` |
| A2 | Hot-flash switch (hypothalamus) | **Round 4 · real-time 3-D · approved by Peter 2026-10-23** (built 2026-10-21): the deck's slide-3 `<hypo-3d>` specimen is A2's one WebGL layer (`gl/`, lazy chunk `hypothalamus-3d.js` next to the embed), driven by A2's own model, buttons and tour; new Forest night look; host API for the TV (`stage`, `tour`, `size-readout`). Round 3 (the SVG brain block, approved Oct 12) stays the first paint and the fallback | `a2-hypothalamus` |
| A3 | Finger's heat valves · 3-D | **Approved look** ("a3b is great"). The A3b block build folded into A3 on 2026-10-12; flat A3 and `a3b-skin-block` retired | `a3-finger-skin` |
| A4 | Beating heart | **Round 6 · a solid heart in WebGL · approved by Peter 2026-10-23** (built 2026-10-12, Peter: "THINK IN THREE DIMENSIONS"): ray-marched in the figure's camera (one kit WebGL layer, `gl-heart.js`). It is the outline puffed into a lit solid, cut in front of its widest section, with ridged chambers, curved leaflets, chordae, papillary muscles, hollow great vessels, coronaries and a floor shadow. It sways and turns under a drag. The round-5 SVG heart is the fallback | `a4-heart` |
| A5 | Air sac and red cell | **Round 2 · 3-D block of lung** (2026-10-12): Voronoi foam cut on three faces, one sac opened with its bowl, duct to the top | `a5-alveolus` |
| A6 | Red cell's 120 days | **Round 3 · 3-D, cut in half** (2026-10-12): bone cut lengthwise, spleen cut open, arc and return as half-pipes, all with round backs | `a6-red-cell-cycle` |
| A7 | Kneecap's load | **Round 2 · 3-D, leg cut in half** (2026-10-12): far half stays round (live), thigh cross-section on top. Peter: "way better, just do it like this", so it became the organ-piece approach | `a7-knee` |
| A8 | Water in and around the fibres | **Round 2 · 3-D bundle**: slice on the face of a muscle cylinder; body redrawn live | `a8-muscle-water` |
| A9 | Digging and filling (bone) | **Round 2 · 3-D block**; caption uses the Menopause Protocol's Greendale numbers | `a9-bone-remodelling` |

Every figure folder holds:
- `model.mjs`, `build.mjs`, `live.js`, `figure.css`, `figure.json`;
- `NOTES.md`: mapping, numbers with sources, decisions, verification, embed snippet;
- `shots/`;
- `embed/optimal-fig-<slug>.js`: a one-file custom element for the website.

## 3. Peter's decisions so far (2026-10-12 round)

1. **Treatments may appear on screen.** Use class names only ("hormone therapy", "neurokinin-receptor blocker"), with "not for everyone", "not treating is always an option", and "fewer, typically" wording. Done in A2. Fig 1 deliberately has none: its threshold model would show flashes stopping entirely.
2. **Medical sign-off comes later.** Peter owns the regulatory call; keep making the figures *correct*.
3. **Wording must match the Menopause Protocol** (beoptimal.ca/optimal-menopause-protocol, supplied as a PDF). A9 quotes its Greendale 2012 bone numbers. A9 shows no hormone-therapy state, because the protocol doesn't present HT as bone protection.
4. **The bike** is the Wahoo KICKR BIKE SHIFT (sold by bici.cc). Take proportion and finish only: no logo, no copied design.
5. **Treadmill screen:** a simple mockup is fine. Done.
6. **Each figure is a standalone page**, and each goes somewhere different on the site (landing pages, protocol guide…). Gallery grouping doesn't matter.
7. **Prioritise VO₂ polish:** Figs 5–6 got rounds 3 and 2.
8. **The anatomy should be "more beautiful" and isometric 3-D.** A3b approved, and A8 and A9 are converted.

**2026-10-12, local session (answers to the §4 questions):**

9. **Creator 600 screen: about 50″.** It's about a 50″ TV rotated to stand vertically. Visbody's own Creator600 page lists a 50″ LG 4K vertical display. Figs 4 and 6 keep their 50″ proportions and print no size. Fig 4 NOTES open issue 1 is closed. **The website copy still says 32″ and needs fixing on the site** (`reference/site-copy.md` flags it).
10. **Retire flat A3, and flat anatomy figures in general.** Every A-series piece ends up isometric 3-D. Figs 1–6 are already isometric, so this doesn't touch them.
    - **A3:** the 3-D version *is* A3. The A3b build moved into `figures/a3-finger-skin` with slug `finger-skin`, so the embed stays `optimal-fig-finger-skin`. `figures/a3b-skin-block` is deleted and A3b is gone from the gallery PLAN.
    - **Every other piece** is converted in place, as A8 and A9 were. No flat version stays in the gallery once its 3-D version exists.
11. **A1: yes, convert to 3-D.**
12. **A2, A4, A6 and A7 go 3-D too.** Pick the best approach from §5.2, build it on A7 (knee) first, and send screenshots. Wait for Peter's OK before converting A2, A4 and A6 the same way.
13. **The organ approach is "cut in half, far half round."** A first try on A7, a constant-thickness slab, read as "an unnatural slice of some kind". The leg cut in half lengthwise, with the far half keeping its round skin and the thigh's cross-section on top, got "this is way better man just do it like this". A2 (as a brain block, since it's a piece of tissue cut out), A4 and A6 followed (§6b).
14. **The heart animation "looks not great", then "make that much more three dimensional … the animation needs more complexity".** Round 4 rebuilt everything behind the cut in true 3-D, with more motion and a richer monitor (A4 NOTES, round 4). Peter: "the heart needs to be MORE three dimensional". Round 5 turned the camera to azimuth 40°, elevation 26° (A4 only; it deliberately breaks from the series camera) and made the great vessels whole 3-D tubes, with a shining back half, coronaries and a floor shadow (A4 NOTES, round 5). Peter on round 5: "directionally better … THINK IN THREE DIMENSIONS". Round 6 moved the heart into one WebGL layer as a lit, ray-marched solid that turns, keeping the SVG as the fallback (A4 NOTES, round 6; it deliberately breaks the skill's "no solids in shaders" rule, within the repo's one-WebGL-layer rule). Peter's verdict on round 6 is pending.

## 4. Open questions for Peter

- **A2 round 4 (2026-10-21):** is the real-time 3-D hypothalamus (from slide 3 of the Ongoing Care deck) the A2 you want on the site and the reception TV? Check it on a real phone. Until then the round 3 SVG is the approved one, and `gl="off"` ships exactly that (A2 NOTES, "Round 4").
- **The heart (A4), round 6:** is the WebGL heart the 3-D you wanted? Check on a real phone (frame rate unmeasured on devices; a governor lowers resolution if frames run long). Next options: the outflow valves cut open, ventricular twist, a pressure–volume loop with sourced pressures.
- **Placement:** see `review/site-placement.md` (the beoptimal.ca scan), which proposes a home for every figure.
- **Network:** with `beoptimal.ca`, `bici.cc` and `inbodycanada.ca` allowed (or locally), re-read the site pages directly instead of PDFs.
- ~~Creator 600 screen size~~, ~~A3 vs A3b~~, ~~A1 look~~, ~~organ-piece approach~~: answered 2026-10-12, see §3.

## 5. Next steps (priority order)

0. **Peter's call on A2 round 4** (the real-time 3-D layer), then a real-phone frame-rate check. The engineering side shipped as the `handoff-2026-10-21b` release (ENGINEERING_HANDOFF.md, "Added Oct 21: A2 real-time 3-D"). If you change anything in `figures/a2-hypothalamus/gl/`, rebuild the chunk with `bash figures/a2-hypothalamus/gl/build-gl.sh` and commit `gl/hypothalamus-3d.js` and `gl/chunk.json`: `build.mjs` refuses a stale chunk.
1. **Peter's call on the heart (A4), round 6.** Then any changes, and a real-phone frame-rate check (`gl-heart.js` governor).
2. **Embeds on the site: handed to engineering 2026-10-12.** `ENGINEERING_HANDOFF.md` (where every figure goes, how to embed, QA), `DEV_TODO.md`, `handoff/` (placements.json, Preact components, QA script) and `scripts/export-embeds.mjs`. The tested reference patch for `beoptimal-landing` is in the zip only (`~/Downloads/optimal-figures-handoff-2026-10-12.zip`), because the site repo is private. The older placement map is `review/site-placement.md`. Each figure ships `embed/optimal-fig-<slug>.js`, and NOTES.md has the snippet. The site repo (`BeOptimal/beoptimal-landing`) is a separate handoff.
3. **Site copy fix:** the Creator 600 page says "32″ upright display"; it's about 50″ (§3 item 9).
4. **Truth pass with the network open:** re-check the MEDIUM/LOW rows in `reference/truth-pack.md`.
5. **Round-2 options still open** (BACKLOG.md):
   - Fig 2: an ECW/TBW scenario switch, partly covered by A8 now;
   - Fig 3: readout wording;
   - Fig 1: optional WebGL heat shimmer (at most one WebGL layer, and the SVG must read without it).
6. **Optional tidy-up:** A7's `drawFar()` predates `shared/round-back.js` and could move onto it (`chords()`), as A2, A4 and A6 already have.

## 6. The 3-D recipe

### 6a. Tissue blocks (A1, A3, A5, A8, A9)

- **Projection:** `k.fitProjection(BOUNDS3, 600, H, { pad, azimuth: 62, elevation: 24 })`, then `FB = figkit(PB)`. At azimuth 62° the front section stays almost face-on and still legible on a phone, and the top and right end show depth. At 30° the face is too foreshortened.
- **World coordinates = section pixels:** x along the section, y back into the tissue, z up. A helper `W3(sx, y, sy) = [sx - X0, y, H - sy]` puts any section point on the plane at depth y.
- **Front face:** wrap the existing flat SVG in `<g transform="${FB.planeMatrix(W3(0, D, 0), [1,0,0], [0,0,-1])}">`. Nothing in `live.js` changes, because it keeps drawing in section coordinates. Clip to the block with a `clipPath` in section coordinates.
- **Top and end faces:** draw them as plain 2-D textures (u, v) and place each with `planeMatrix(origin, uDir, vDir)`. Circles become correct ellipses for free. Shade with a black or white overlay rect at low opacity: end face darker, top lighter.
- **Faces that change with the model:** pass the projection basis in DATA (`o`, `ex`, `ey`, `ez`) and redraw in `live.js` (see A8 `drawBody()`). A few `data-part` hooks also work (A3b warms its top and side via optional selectors in A3's `live.js`).
- **Curved bodies (A8):** draw only the half facing the viewer. Get the view vector from the cross product of the projection rows (sign chosen so +y, the front face, is visible). Shade with a `userSpaceOnUse` linear gradient set square to the projected axis.
- **Painter's order:** shadow → top → end → edges → front group. Monitors, legends and locator icons stay flat in 2-D, outside the block.
- **Checks:**
  - `lines.mjs` = 0;
  - 320 px shows no horizontal scroll;
  - reduced motion draws a still;
  - both themes.

  The `--audit` check applies to kit solids only, not to these hand-drawn faces.
- **A1 and A5 add:**
  - real 3-D detail standing on a face: A1's 272 microvilli are capsules sorted by `k.depthOf`;
  - faces that are exact sections of one 3-D structure: A5's Voronoi foam is cut by three planes with half-plane clipping, so air spaces meet across every edge.

### 6b. Organs cut in half (A2, A4, A6, A7)

What Peter approved on A7: the section is the cut face, the near half is gone, and **the far half keeps its round surface**. Do not extrude the outline at constant thickness; that read as "an unnatural slice".
- **Cut face:** as in 6a: `planeMatrix(S3(0, DEP, 0), [1,0,0], [0,0,-1])`, where `S3(sx, y, sy) = [sx, y, -sy]` and the viewer is on the +y side. Clip it flat wherever the organ is cut across (A7's thigh at y = −14, A2's block).
- **Back half: `shared/round-back.js`,** inlined into the page after the model. Build solves one unit of depth in the cut face's own coordinates (`WD1 = M⁻¹ · (iso(depth 1) − iso(origin))`) and passes `far: { w: WD1, A: 62, E: 24, dep: DEP }`.
  - `rim(outline, { rho })`: a closed blob rolls back over a quarter-round, so a circle becomes a hemisphere (heart, spleen, bone, pituitary).
  - `chords(edgeA, edgeB, { caps })`: paired edges become half-circles (a limb, a vessel), with optional half-ring cut ends.
  - Facets facing away are culled, the rest shaded in 21 tones, and `paintObjects()` merges them per object and tone (about 100 paths a frame).
  - Moving organs (A4, and A7 via its own `drawFar`) redraw it every frame. Static ones (A2, A6) draw it once at mount.
- **Cut ends you can see:** draw them as textures on their plane, as real cross-sections (A7's thigh: femur ring and marrow, compartments, femoral vessels, sciatic nerve).
- **Bounds:** fit the camera to what really shows (the outline plus its back half rolled 30° and 60°), not the back pole, or the figure shrinks.
- **A piece that is cut-out tissue** (A2) is a block after all, with flat cut faces. Only what's naturally round (pituitary, stalk, nerve) gets round backs.


## 7. How a figure is built (unchanged)

- `model.mjs` is a pure model and the only source of numbers. It's imported by the build and inlined in the page (with `export` stripped). Reuse across figures:
  - Fig 1 `flashAt`/`rateOf`, used by A2 and A3;
  - Fig 2 `throughShare`, used by A8;
  - Fig 3 `simulate`, used by A6;
  - Fig 4 `kneeOf`/`cadenceOf`/`stepOf`, used by A7.
- `build.mjs` builds the geometry: kit solids recorded through `shared/figkit.mjs` (box, cyl, turned, prism, pin, cable, …) for the machines, and hand-drawn `smooth()` paths for the anatomy. `--light` builds Cream; `--audit` checks the geometry.
- `live.js` defines `mount(fig)`: motion, the idle tour, controls, readouts and an aria-live status.
- `shared/page.mjs` writes the standalone page and the custom element. `shared/optimal-theme.css` holds the brand tokens (`class="iso optimal"`, `data-theme="light"` for Cream).

## 8. Verify (definition of done)

**One command per figure** (local session): builds both themes; checks line ends on both; takes phones at 390/360/320 in both themes (shot plus no-sideways-scroll check), reduced motion and desktop; requires a clean console on every run; prints a table.
```bash
source .env.chrome
node scripts/verify.mjs a7-knee                                   # all checks, shots into figures/a7-knee/shots/
node scripts/verify.mjs a7-knee --pre steps.json --tag swing --only desktop   # a second state (drive.mjs actions first)
python3 scripts/contact-sheet.py                                  # review/contact-sheet.png from the Cream desktop shots
```
`--only 320` re-shoots with default timing. For figures whose curated shots show a particular state (A7 at peak force, A9 post-menopause), pass the same `--pre`.

The manual steps, if you need them:
```bash
cd figures/<folder> && source ../../.env.chrome
node build.mjs && node build.mjs --light
node build.mjs --light --audit                  # machines: must end "audit passed"
S=../../.claude/skills/anatomy/scripts
node $S/lines.mjs <slug>.html                   # "line ends: 0"
node $S/drive.mjs <slug>-light.html '[["wait",4000],["shot","shots/phone-320-light.png",".iso-plate",2],["eval","document.documentElement.scrollWidth > innerWidth"]]' --width 320 --height 900
#   repeat at 390 / 360; eval must print false; console must be clean
node $S/drive.mjs <slug>-light.html '[["wait",1200],["shot","shots/reduced-390-light.png",".iso-plate",2]]' --width 390 --height 900 --reduced
node ../../scripts/build-all.mjs                # gallery
```
Use `drive.mjs` for interaction (`click`, `wait`, `eval`, `shot`). Put anything with quotes in an `--actions file.json`.

- **The 3-D hypothalamus has one master copy:** A2's `gl/` and `model.mjs`. The Ongoing Care deck syncs it with `tools/sync-hypo3d.mjs`, and its build refuses edited copies. The TV gets the built file with `npm run figures`. After changing it, rebuild here, re-sync the TV, and re-sync and rebuild the deck. See A2 NOTES, "The master copy of the 3-D brain".

- **The machines in 3-D on the site (Oct 24):** E1–E3 show inline through `EquipmentReveal` (a sandboxed iframe of `figures/e*/embed/<slug>-apart.html`, which `figures/reveal-build.mjs` writes on the light build). The page posts its height to the parent. For screenshots of them, use `handoff/qa/viewport-shots.mjs`: drive.mjs's beyond-viewport capture leaves cross-origin frames blank.

## 9. Gotchas learned the hard way

- **Audit "support":** grounded parts must be named `stand.*` or carry `meta.ground`.
- **Depth cycles:** split parts that interleave, as in Fig 5's drive case, BB house and seat post.
- **`cable()` routes:** both ends must land square on a mount face, or the terminal check fails. Widen the mount, or add a plug part.
- **Floating line ends:** clip hatching and slats to an exact outline (Fig 5 vent slats).
- **Nested template literals** inside `build.mjs` SVG strings break silently. Build sub-strings in their own `const`.
- **Theme tokens:** small dots and tracer colours need their own token per theme (A5's tracer vanished in Cream).
- **320 px:** monitor labels and legend text clip first. Check every new label at 320.
- **Network (cloud):** PubMed, Crossref, Health Canada, beoptimal.ca, bici.cc and inbodycanada.ca returned 403 under the cloud policy; WebSearch worked. Locally this doesn't apply.
- **The repo is public:** no patient data, no secrets, no real clinic financials. The VO₂ images in `reference/equipment/*-STOCK.*` are stock photos, not Optimal's equipment.
- **planeMatrix's y axis points down the section:** `S3(0, DEP, +1)` is one unit *down*. A flipped sign sent A7's walls the wrong way.
- **objectBoundingBox gradients seam** where two shapes with different boxes meet (A2's square-cut face over the brain outline). Use one `userSpaceOnUse` gradient for the whole face.
- **`max(44px, min-content)` is invalid CSS:** math functions take no intrinsic keywords, so the rule is dropped silently. The theme now uses `min-width: min-content` (padding keeps buttons ≥ 44 px).
- **A convex hull is too much smoothing for a back half:** it bridges notches between vessels with a flat flap. Average the outline instead (A4).
