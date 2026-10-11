# Continuing locally (or in a new session)

Kept current by the cloud session at every milestone, so the work can move to a laptop or a fresh session at any point. **Last updated:** 2026-10-11, after Fig 5. All five HANDOFF figures are at round 1.

## Set up on a Mac (about 5 minutes)

```bash
git clone https://github.com/Optimal-Research-Team/optimal-anatomy-figures.git
cd optimal-anatomy-figures
node -v                               # needs Node 20+ (brew install node)
bash scripts/setup-cloud.sh           # finds Chrome, writes .env.chrome, smoke-tests a capture
source .env.chrome
node scripts/build-all.mjs            # builds every figure into dist/ with the gallery
open dist/index.html
```
No npm install: the Anatomy kit is vendored in `.claude/skills/anatomy/`. Then start Claude Code in the folder (`claude`). It reads `CLAUDE.md`, and the brief is `HANDOFF.md`.

## Status

| # | Figure | State | Where |
|---|---|---|---|
| 1 | Menopause thermostat | **Round 1 done**: audit passed, line ends 0 both themes, phone 390/360/320 checked, NOTES written | `figures/01-menopause-thermostat/` |
| 2 | InBody 580 | **Round 1 done**: audit passed, line ends 0, phone checked, NOTES written | `figures/02-inbody-580/` |
| 3 | IV iron | **Round 1 done**: audit passed, line ends 0, phone checked, NOTES written | `figures/03-iv-iron/` |
| 4 | Creator 600 | **Round 1 done**: audit passed, line ends 0, phone checked, NOTES written; built `shared/mannequin.mjs` + `mannequin-view.js` for Fig 5 | `figures/04-creator-600/` |
| 5 | VO2max | **Round 1 done**: audit passed, line ends 0, phone checked, NOTES written; one WebGL layer (breath in the hose); no percentile readout until the FRIEND cycle table is verified | `figures/05-vo2max/` |
| A1–A9 | Anatomical series (beating heart, gut cell, hypothalamus, …) | Planned after Fig 5; style test first | **`BACKLOG.md`** |

## Time remaining (estimate, 2026-10-11 ~21:15 UTC)

| Work | Estimate |
|---|---|
| Design rounds on Figs 1–5 (+30–50 %), as Peter's feedback comes in | 4–6 h |
| Anatomical series A1–A9 incl. style test (`BACKLOG.md`) | 15–19 h, + rounds |
| **Total** | **~19–25 h** |

**Where to run it.** Cloud session credits ran at about $20–25 an hour; after Fig 5 roughly $85 is left, enough for a few hours of design rounds but not the anatomical series. Run the anatomical series locally (Claude Code on the Mac uses the Max plan's usage limits, not cloud credits): set up as above, then start with the A1 style test in `BACKLOG.md`.

## How a figure is built (the pattern Fig 1 set)

- `model.mjs`: a pure model, the only source of numbers. Imported by the build, inlined in the page.
- `build.mjs`: geometry with the kit, every solid and cable recorded into `A.recorder`, `A.settle` for painter's order, and the card via `shared/page.mjs`. `--light` for Cream, `--audit` to prove the geometry.
- `live.js`: defines `mount(figure)`; motion, tour, input and readout.
- `figure.json` feeds the gallery; `NOTES.md` records mapping, parts, numbers, decisions and embed snippet.
- `shared/figkit.mjs` has the drawing helpers (box, cyl, turned, prism, ball, stud, cable, bench) that draw and record in one call.
- The mannequin (Fig 4, reuse in Fig 5): `shared/mannequin.mjs` places joints (`skeletonOf`) and lists parts (`partsOf`); `shared/mannequin-view.js` draws them in the page each frame (limbs are cheap cone frusta, the trunk is drawn once and translated, ≈4 ms a frame); `shared/mannequin.css` has the wood palettes. Fig 4's `build.mjs` shows how to inline all three and the lathe.
- `shared/page.mjs` writes the standalone page and the `<optimal-fig-…>` custom element; `shared/optimal-theme.css` has the brand tokens and the phone-first card.

## Verify (definition of done, HANDOFF §2)

```bash
cd figures/<nn-slug>
node build.mjs && node build.mjs --light
node build.mjs --light --audit                      # must end "audit passed"
S=../../.claude/skills/anatomy/scripts
node $S/lines.mjs <slug>.html; node $S/lines.mjs <slug>-light.html            # "line ends: 0"
node $S/lines.mjs <slug>-light.html --reduced
for w in 390 360 320; do node $S/capture.mjs <slug>-light.html --width $w --select .opt-figure --out shots/phone-$w.png; done
```

## Things the next session needs to know

- **Chrome as root:** in cloud containers Chrome needs `--no-sandbox`; `setup-cloud.sh` points `CHROME_PATH` at `scripts/chrome-root.sh`, which adds it. On a Mac this isn't used.
- **Network policy:** the cloud environment blocked PubMed/PMC, Crossref, Health Canada and manufacturer sites, so the research was done from search extracts. Locally, or with those hosts allowed, re-check the MEDIUM/LOW rows in `reference/truth-pack.md`.
- **Deploy:** pushing `main` runs `.github/workflows/pages.yml`. Work happens on a branch and is merged to `main` when a figure meets §2.
- **Open questions for Peter:** HANDOFF §7 (VO2 equipment, Fig 1 treatments, Fig 3 home, medical sign-off), plus the ones in each figure's NOTES.
