# Handoff: continuing locally

The cloud session ends here; its credits are nearly spent. This file is the full state of the project for a local Claude Code session on the Mac, which runs on the Max plan's limits, not cloud credits. **Last updated:** 2026-10-12, end of cloud work. `main` and the cloud branch `claude/wonderful-mayer-ga12kl` are identical. Work on `main`, or on a new branch merged to `main`.

**First prompt for the local session:**
> Read CLAUDE.md, HANDOFF.md, HANDOFF-LOCAL.md and BACKLOG.md. Then continue from "Next steps" in HANDOFF-LOCAL.md.

## 1. Set up on a Mac (about 5 minutes)

```bash
git clone https://github.com/Optimal-Research-Team/optimal-anatomy-figures.git
cd optimal-anatomy-figures
node -v                               # needs Node 20+ (brew install node)
bash scripts/setup-cloud.sh           # finds Chrome, writes .env.chrome, smoke-tests a capture
source .env.chrome                    # every capture/drive/lines command needs CHROME_PATH
node scripts/build-all.mjs            # builds all 16 figures + gallery into dist/
open dist/index.html
claude                                # Claude Code reads CLAUDE.md on start
```
- There's no npm install. The Anatomy kit is vendored in `.claude/skills/anatomy/`; never edit it, and patch in `shared/` instead.
- `scripts/chrome-root.sh` (Chrome with `--no-sandbox`) is only for cloud containers that run as root. On the Mac, `setup-cloud.sh` should find `/Applications/Google Chrome.app`. If it doesn't, set `CHROME_PATH` in `.env.chrome` by hand.
- Live gallery: https://optimal-research-team.github.io/optimal-anatomy-figures/. Pushing `main` deploys it via `.github/workflows/pages.yml` in about a minute.

## 2. Status (16 figures, all in the gallery)

| # | Figure | State | Folder |
|---|---|---|---|
| 1 | Menopause thermostat | Round 1 done. No treatment switch, on purpose (see NOTES "Decisions") | `01-menopause-thermostat` |
| 2 | InBody 580 | Round 1 done. Checked against InBody's result-sheet guide: no segmental reactance printed, which is correct | `02-inbody-580` |
| 3 | IV iron | Round 1 done | `03-iv-iron` |
| 4 | Creator 600 | Round 1 done; built `shared/mannequin.*` | `04-creator-600` |
| 5 | VO₂max on a bike | **Round 3**: smart bike at KICKR BIKE SHIFT proportions (no logo or copied design), power arc on the flywheel cover, wireless mask, assessor with tablet | `05-vo2max` |
| 6 | VO₂max on the Creator 600 | **Round 2**: dashboard mockup on the treadmill screen (speed, cadence, step, grade, live runner trace) | `06-vo2max-treadmill` |
| A1 | Gut cell's gate | **Round 2 · 3-D block** (2026-10-12): brush border of 272 microvilli on top, cells cut on the right end, capillary half-tube | `a1-gut-cell` |
| A2 | Hot-flash switch (hypothalamus) | Built; **treatment states added**: Hormone therapy / Non-hormonal (class names only) | `a2-hypothalamus` |
| A3 | Finger's heat valves · 3-D | **Approved look** ("a3b is great"). The A3b block build folded into A3 on 2026-10-12; flat A3 and `a3b-skin-block` retired | `a3-finger-skin` |
| A4 | Beating heart | Built, round 2 (flat, organ) | `a4-heart` |
| A5 | Air sac and red cell | Built flat. **Next for 3-D** | `a5-alveolus` |
| A6 | Red cell's 120 days | Built (flat, a loop diagram) | `a6-red-cell-cycle` |
| A7 | Kneecap's load | Built (flat, side section) | `a7-knee` |
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

## 4. Open questions for Peter

- ~~Creator 600 screen size~~, ~~A3 vs A3b~~, ~~A1 look~~: answered 2026-10-12, see §3 items 9–11.
- **Network:** with `beoptimal.ca`, `bici.cc` and `inbodycanada.ca` allowed (or locally), re-read the site pages directly instead of PDFs.

## 5. Next steps (priority order)

1. **Convert A1 (gut cell) and A5 (alveolus) to 3-D**, using the recipe in §6. A1 suits a block (a strip of gut lining: villi on top, cells on the front face). A5 suits a cut sphere or a block of lung tissue with the air sac opened.
2. **Organ pieces (A2, A4, A6, A7):** these don't fit a block. Options, cheapest first:
   - a short, deep slab under the flat drawing, giving a "specimen on a plate" look;
   - shading the existing outlines with gradients and rim light to make them read as volumes;
   - a true isometric rebuild (most work).

   Ask Peter which he wants before doing more than one.
3. **Re-run the full verification on A8 and A9** at 390 and 360 px; only 320 was captured after the 3-D change. Then refresh `review/contact-sheet.png`.
4. **Truth pass with the network open:** re-check the MEDIUM/LOW rows in `reference/truth-pack.md`.
5. **Round-2 options still open** (BACKLOG.md):
   - Fig 2: an ECW/TBW scenario switch, partly covered by A8 now;
   - Fig 3: readout wording;
   - Fig 1: optional WebGL heat shimmer (at most one WebGL layer, and the SVG must read without it).
6. **Embedding:** each figure ships `embed/optimal-fig-<slug>.js`; NOTES.md has the snippet. Give Peter the snippets for the pages he names.

## 6. The 3-D recipe (A3b, A8, A9)

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
