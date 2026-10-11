# Optimal × Anatomy figures

Interactive isometric explainer figures for **Optimal Health** (Barrie, ON) service pages. Each figure is a real, carefully built machine whose motion *is* the medical idea, driven by a small model that uses real numbers.

**Gallery:** https://optimal-research-team.github.io/optimal-anatomy-figures/

| # | Figure | Idea | Size | Status |
|---|---|---|---|---|
| 1 | The narrowing thermostat | Hot flashes and the thermoneutral zone | Figure | Round 1 · for review |
| 2 | Five cylinders on a bridge | InBody 580 bioimpedance: ECW vs total water, segments | Figure | Round 1 · for review |
| 3 | The depot with a gate | Hepcidin, oral vs IV iron | Figure | Planned |
| 4 | The runner rig | Creator 600 gait: cadence, foot strike, joint load | Hero | Planned |
| 5 | The ramp and the cart | VO2max ramp test on a bike with a metabolic cart | Hero + WebGL | Planned |

## Handing this to a Claude cloud session

Everything the session needs is in the repo. The **Anatomy** skill is vendored at `.claude/skills/anatomy/`, so nothing needs installing.

1. Start a Claude Code session on the web on this repo.
2. Paste the kickoff prompt from **[HANDOFF.md §8](HANDOFF.md#8-kickoff-prompt-paste-into-the-cloud-session)**.
3. Review each figure from the gallery link it sends back, on your phone first.

| File | Purpose |
|---|---|
| [`HANDOFF.md`](HANDOFF.md) | The brief: order, per-figure concepts, definition of done, open questions |
| [`CLAUDE.md`](CLAUDE.md) | House rules every session loads automatically |
| [`reference/truth-pack.md`](reference/truth-pack.md) | Sourced numbers for every model and readout |
| [`reference/site-copy.md`](reference/site-copy.md) | What beoptimal.ca already says (figures must agree) |
| [`reference/brand.md`](reference/brand.md) · [`shared/optimal-theme.css`](shared/optimal-theme.css) | Brand values and the kit token map (Cream and Forest night) |
| [`reference/equipment/`](reference/equipment/) | Creator 600 and InBody 580 photos and report screens |

## Build locally

```bash
bash scripts/setup-cloud.sh        # Node + headless Chrome check
node scripts/build-all.mjs         # builds every figure into dist/ with the gallery
```

Pushing to `main` deploys `dist/` through GitHub Actions to Pages.

## Credits

Figures are built with [Anatomy](https://github.com/wheresryan22/anatomy) by Ryan (@wheresryan22), MIT. It's vendored unchanged; see `.claude/skills/anatomy/LICENSE` and `VENDORED_FROM`. Equipment photos © their manufacturers and Optimal Health, used as internal reference only.

*Explainers only, not medical advice.*
