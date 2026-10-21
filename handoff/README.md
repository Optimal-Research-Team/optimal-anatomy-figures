# Optimal figures: engineering handoff, Oct 21 2026 (replaces the Oct 12 zip)

**For:** Jeremy, and anyone integrating the anatomy figures into `BeOptimal/beoptimal-landing`.

**Source of truth:** https://github.com/Optimal-Research-Team/optimal-anatomy-figures. The live gallery is https://optimal-research-team.github.io/optimal-anatomy-figures/.

Start with `ENGINEERING_HANDOFF.md` (where everything goes and how to embed it) and `DEV_TODO.md` (the task list, newest changes first).

## What changed since the Oct 12 package

1. **All 15 embed scripts are new.** Use `embeds/` from the `handoff-2026-10-21` release, or re-run `scripts/export-embeds.mjs`. Don't use the Oct 12 copies.
   - **Oct 18:** readout names and units now match the clinic TV ("Step rate N/min", "Kneecap force", "Hemoglobin", mL).
   - **Oct 20:** a visual-bug sweep.
     - Tap targets are at least 44 px at 320 px wide.
     - A number never wraps away from its unit.
     - Fig 4's readouts sit in equal columns on phones.
     - Fig 6's tablet reading is clear of the arm.
     - A6's labels are clear of the chart.
     - A4 no longer throws console errors (the NaN path).
   - **Oct 21:** the light-theme muted and legend grey passes AA (#716e68). Phone hints no longer mention the Space key. Fig 6's side-panel speed is clear of the runner's mask (it had read "5.6" for "15.6").
   - **Oct 21, Fig 5:** the assessor turns slightly, so the whole tablet shows. The arm had hidden where the VO₂ line flattens.
   - **Seven card reserves went up on Oct 21. Use `handoff/site/optimalFigures.ts`**; the private patch carries the same values.
     - I re-measured every card as a desktop browser and as a phone (touch, 3× pixels). Seven were taller than their reserves, so the page would jump 4–29 px as they mounted: Fig 5, A2, A3, A4, A5, A6 and A9.
     - Fig 4's phone reserve is 1188 (was 1175).
2. **New: the four equipment films and take-apart pages, E1–E4** (InBody 580, Creator 600, KICKR Bike, hand dynamometer). Peter **approved them for the site on Oct 19**.
   - The release zip's `equipment/<fig>/` holds the following (the repo has the same files in `figures/e*/assets/`):
     - the web encodes, about 1–1.6 MB each: `-web-16x9.mp4` for desktop and `-web-9x16.mp4` for phones;
     - posters;
     - the take-apart pages in Cream and Forest night.
   - Placement and the `<video>` recipe are in `ENGINEERING_HANDOFF.md`, under "Added Oct 19".
   - The films were re-cut on Oct 20–21 so the camera only moves forward. If you grabbed any assets before Oct 21, re-copy them.
3. **A4 heart:** still round 6, awaiting Peter's OK. Ship it behind the others, as before.
4. **Copy fix on the Creator 600 page:** the site still says "32-inch". The display is 50″.

## Where everything is

| What | Where |
|---|---|
| Docs | `ENGINEERING_HANDOFF.md` (where everything goes, how to embed) and `DEV_TODO.md` (the task list, newest first), at the repo root |
| Slot reserves and the site component | `handoff/site/`: `optimalFigures.ts`, `OptimalFigure.tsx`, `optimal-figures.css` |
| Placements | `handoff/placements.json`: every figure's route, anchor, size and priority |
| QA | `handoff/qa/check-embeds.mjs`, the end-to-end QA against any running site |
| Embed scripts | The **`handoff-2026-10-21` release** (`embeds/`, exported from `c82b093`), or re-run `node scripts/export-embeds.mjs --out <site>/public/figures`. Live copies: `https://optimal-research-team.github.io/optimal-anatomy-figures/<fig>/embed/optimal-fig-<slug>.js` |
| Equipment films E1–E4 | `figures/e*/assets/` here, or the release zip's `equipment/` |
| **The site integration patch** | **Private:** [Optimal-Research-Team/optimal-anatomy-figures-site-patch](https://github.com/Optimal-Research-Team/optimal-anatomy-figures-site-patch). It's code from the private site repo, so it stays out of this public one. Ask Peter for access. It applies cleanly to `beoptimal-landing` `0f36c00` and `main` `0c0473c` (checked Oct 21), and hasn't been applied yet. |

## Apply

1. In `beoptimal-landing`, create a branch from `main` and apply the patch from the private repo.
2. Copy the 15 embed scripts into `public/figures/`.
3. Run `yarn test`, `yarn build` and `yarn preview`.
4. QA with `node handoff/qa/check-embeds.mjs <preview URL>` from this repo. It must report "all pages passed".
