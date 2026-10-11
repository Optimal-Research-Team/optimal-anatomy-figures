# Continuing locally (or in a new session)

Kept current by the cloud session at every milestone, so the work can move to a laptop or a fresh session at any point. **Last updated:** 2026-10-11, after Fig 6 (Peter's VO₂ rework). Shared: `shared/assessor.mjs` (standing assessor with a tablet), `shared/vo2-plot.js` (the tablet's live plot).

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
| 5 | VO2max on a bike | **Round 2 done** (Peter: wireless VO2 Master mask, assessor with a tablet; no hose, cart or WebGL; no RER since the mask doesn't measure CO₂) | `figures/05-vo2max/` |
| 6 | VO2max on the Creator 600 | **Round 1 done**: same mask and assessor; speed ramp at 1 %; audit passed, line ends 0, phone checked | `figures/06-vo2max-treadmill/` |
| A1 | Gut cell's gate (style test) | **Built**: hand-drawn organic SVG, both themes, phones checked; waiting on Peter's call on the look | `figures/a1-gut-cell/` |
| A4 | The beating heart | **Built**: four chambers, valves, chordae, great vessels, ECG; rate buttons and Slow | `figures/a4-heart/` |
| A5 | The air sac and the red cell | **Built**: alveolus in its capillary net, cells loading by the model, O₂/CO₂ dots, breathing, transit monitor | `figures/a5-alveolus/` |
| A2 | The hot-flash switch | **Built**: hypothalamus slice, KNDy cells swell and signal, MnPO tips into a flash; pre/post buttons | `figures/a2-hypothalamus/` |
| A6 | The red cell's 120 days | **Built**: marrow → 120-day arc → spleen macrophage → transferrin; untreated vs IV iron from Fig 3's model | `figures/a6-red-cell-cycle/` |
| A3, A7–A9 | Rest of the anatomical series | Planned; follow the A-series style | **`BACKLOG.md`** |

## Time remaining (estimate, 2026-10-11 evening)

| Work | Estimate |
|---|---|
| Design rounds on Figs 1–6 and A1 (+30–50 %), as Peter's feedback comes in | 4–6 h |
| Anatomical series A3, A7–A9 (`BACKLOG.md`) | 6–8 h, + rounds |
| **Total** | **~14–20 h** |

**Where to run it.** The cloud credits are nearly used. Run the rest locally (Claude Code on the Mac uses the Max plan's limits, not cloud credits): set up as above, then pick up from `BACKLOG.md`. A1 (`figures/a1-gut-cell/`) is the pattern for the anatomical pieces: hand-drawn organic SVG through `smooth()` (Catmull-Rom to Bézier), the shared card, CSS tokens per theme, a tiny `model.mjs`, and a particle `live.js`.

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
