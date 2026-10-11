# Continuing locally (or in a new session)

Kept current by the cloud session at every milestone, so the work can move to a laptop or a fresh session at any point. **Last updated:** 2026-10-11, after Fig 3.

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
| 4 | Creator 600 | Research drafted, not built | `reference/research/truth-4-draft.md` |
| 5 | VO2max | Research drafted, not built; FRIEND cycle percentile table incomplete | `reference/research/truth-5-draft.md` |
| A1–A9 | Anatomical series (beating heart, gut cell, hypothalamus, …) | Planned after Fig 5; style test first | **`BACKLOG.md`** |

## Time remaining (estimate, 2026-10-11 ~19:50 UTC)

| Work | Estimate |
|---|---|
| Fig 4 Creator 600 (Hero, builds `shared/mannequin.mjs`) | 3.5–4.5 h |
| Fig 5 VO2max (Hero + WebGL, reuses the mannequin) | 3.5–4.5 h |
| Design rounds on Figs 1–5 (+30–50 %) | 4–6 h |
| Anatomical series A1–A9 incl. style test (`BACKLOG.md`) | 15–19 h, + rounds |
| **Total** | **~27–35 h** |

## How a figure is built (the pattern Fig 1 set)

- `model.mjs`: a pure model, the only source of numbers. Imported by the build, inlined in the page.
- `build.mjs`: geometry with the kit, every solid and cable recorded into `A.recorder`, `A.settle` for painter's order, and the card via `shared/page.mjs`. `--light` for Cream, `--audit` to prove the geometry.
- `live.js`: defines `mount(figure)`; motion, tour, input and readout.
- `figure.json` feeds the gallery; `NOTES.md` records mapping, parts, numbers, decisions and embed snippet.
- `shared/figkit.mjs` has the drawing helpers (box, cyl, turned, prism, ball, stud, cable, bench) that draw and record in one call.
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
