# Optimal figures: engineering handoff, Oct 23 2026 (replaces the Oct 21 (b), Oct 21 and Oct 12 packages)

**For:** Jeremy, and anyone integrating the anatomy figures into `BeOptimal/beoptimal-landing`.

**Source of truth:** https://github.com/Optimal-Research-Team/optimal-anatomy-figures. The live gallery is https://optimal-research-team.github.io/optimal-anatomy-figures/.

Start with `ENGINEERING_HANDOFF.md` (where everything goes and how to embed it) and `DEV_TODO.md` (the task list, newest changes first).

## What changed since the Oct 21 (b) package (`handoff-2026-10-21b`)

1. **Peter approved A4 (the heart, round 6) and A2 (round 4, with its real-time 3-D layer) for the site on Oct 23.** Nothing is held back now: ship `hypothalamus-3d.js` with the embeds, and keep the heart where the patch puts it.
2. **One embed changed: `optimal-fig-hypothalamus.js` (Oct 22, security).** A2 now reads its 3-D file only from the element's own `gl-src` attribute, never from a link's query string. On the shared `optimal-research-team.github.io` origin, a crafted gallery link could otherwise have loaded someone else's script. The site never sets `gl-src`, so this is defensive only. The other 14 embeds and `hypothalamus-3d.js` are byte-identical to `handoff-2026-10-21b`.
3. No site code changes: placements, `FIGURE_RESERVE` and the private patch are unchanged.

## What changed in the Oct 21 (b) package (vs `handoff-2026-10-21`)

1. **A2 (the hot-flash switch) has a real-time 3-D layer**, the 3-D hypothalamus from slide 3 of the Ongoing Care deck. See `ENGINEERING_HANDOFF.md`, "Added Oct 21 (b)".
   - **One more file to ship:** `hypothalamus-3d.js` (634 KB, 169 KB gzip) goes in `public/figures/` next to `optimal-fig-hypothalamus.js`, which loads it lazily from its own folder. It's in this release's `embeds/`, and `scripts/export-embeds.mjs` copies it.
   - `optimal-fig-hypothalamus.js` is new (256 KB, 75 KB gzip). **The other 14 embed scripts are byte-identical to the `handoff-2026-10-21` ones.**
   - No site code changes: placements, `FIGURE_RESERVE` (re-measured, still 1311 / 1306) and the private patch are unchanged.
   - The SVG drawing (approved Oct 12) is still the first paint and the fallback; `gl="off"` on the element, or leaving out `hypothalamus-3d.js`, ships just that. (Approved by Peter on Oct 23; see above.)
2. **QA:** `handoff/qa/check-embeds.mjs` now checks that A2's 3-D layer comes up and, in a second pass with WebGL off, that its SVG fallback works. New `--route /path` option for spot checks.
3. **For the clinic TV** (not the site): A2 takes `stage`, `tour` and `size-readout` attributes and pauses while detached (A2 `NOTES.md`, "Round 4").

## What changed between the Oct 12 and Oct 21 packages

1. **All 15 embed scripts are new.** Use `embeds/` from the latest release (now `handoff-2026-10-21b`), or re-run `scripts/export-embeds.mjs`. Don't use the Oct 12 copies.
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
3. **A4 heart:** round 6 (approved by Peter on Oct 23).
4. **Copy fix on the Creator 600 page:** the site still says "32-inch". The display is 50″.

## Where everything is

| What | Where |
|---|---|
| Docs | `ENGINEERING_HANDOFF.md` (where everything goes, how to embed) and `DEV_TODO.md` (the task list, newest first), at the repo root |
| Slot reserves and the site component | `handoff/site/`: `optimalFigures.ts`, `OptimalFigure.tsx`, `optimal-figures.css` |
| Placements | `handoff/placements.json`: every figure's route, anchor, size and priority |
| QA | `handoff/qa/check-embeds.mjs`, the end-to-end QA against any running site |
| Embed scripts | The **`handoff-2026-10-21b` release** (`embeds/`: the 15 scripts, `hypothalamus-3d.js` and `manifest.json`), or re-run `node scripts/export-embeds.mjs --out <site>/public/figures`. Live copies: `https://optimal-research-team.github.io/optimal-anatomy-figures/<fig>/embed/optimal-fig-<slug>.js` (and `a2-hypothalamus/embed/hypothalamus-3d.js`) |
| Equipment films E1–E4 | `figures/e*/assets/` here, or the release zip's `equipment/` |
| **The site integration patch** | **Private:** [Optimal-Research-Team/optimal-anatomy-figures-site-patch](https://github.com/Optimal-Research-Team/optimal-anatomy-figures-site-patch). It's code from the private site repo, so it stays out of this public one. Ask Peter for access. It applies cleanly to `beoptimal-landing` `0f36c00` and `main` `0c0473c` (checked Oct 21), and hasn't been applied yet. |

## Apply

1. In `beoptimal-landing`, create a branch from `main` and apply the patch from the private repo.
2. Copy the 15 embed scripts **and `hypothalamus-3d.js`** into `public/figures/`.
3. Run `yarn test`, `yarn build` and `yarn preview`.
4. QA with `node handoff/qa/check-embeds.mjs <preview URL>` from this repo. It must report "all pages passed".

## How this package is made

`node scripts/package-handoff.mjs --tag handoff-2026-10-21b` builds every figure, exports the embeds, and assembles the folder and zip (docs, `site/`, `placements.json`, the QA script, `export-embeds.mjs`, `embeds/`, `equipment/`) in `handoff/package/` (git-ignored). The zip goes on the GitHub release; the site patch never does (it lives in the private repo).

