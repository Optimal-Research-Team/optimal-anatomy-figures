# Optimal figures: engineering handoff, Nov 12 2026 (c) (replaces the Nov 12 (b), Nov 12, Nov 11, Oct 24, Oct 23, Oct 21 (b), Oct 21 and Oct 12 packages)

**For:** Jeremy, and anyone integrating the anatomy figures into `BeOptimal/beoptimal-landing`.

**Source of truth:** https://github.com/Optimal-Research-Team/optimal-anatomy-figures. The live gallery is https://optimal-research-team.github.io/optimal-anatomy-figures/.

Start with `ENGINEERING_HANDOFF.md` (where everything goes and how to embed it) and `DEV_TODO.md` (the task list, newest changes first).

## What changed since the Nov 12 (b) package (`handoff-2026-11-12b`)

One fix, found by the Nov 12 site check. **Re-copy the 15 embed scripts. No site code changes.**

- **The figures no longer take the page's text spacing.** A shadow root keeps the site's selectors out of a figure, but not what text inherits. The site's `letter-spacing` (-0.32 px on the service pages, -0.17 px on the Menopause Protocol) came down through each `<optimal-fig-…>` element, the captions wrapped in fewer lines than in the gallery, and phone cards came out 14 to 83 px shorter than their reserves, with a few desktop cards short too.
- **The fix is in the embeds.** Each one now sets fourteen inherited text properties back to their initial values, on its own element and again on the card's root inside the shadow root: `letter-spacing`, `word-spacing`, `text-transform`, `text-indent`, `text-align`, `text-align-last`, `white-space`, `text-wrap`, `word-break`, `overflow-wrap`, `hyphens`, `line-break`, `text-anchor` and `text-shadow`. A figure now looks and measures the same whatever section it sits in.
- **All 15 embed scripts changed**, each by the same 506 bytes (one style rule; about 100 bytes gzipped).
- **`optimal-fig-hypothalamus.js` (A2) and `optimal-fig-heart.js` (A4) change for the first time since Oct 24.** Every earlier note that calls them byte-identical to Oct 24 stops here. What changed in them is that one style rule and nothing else; A2's `hypothalamus-3d.js` is still byte-identical.
- **Byte-identical to `handoff-2026-11-12b`:** `optimal-gl3.js` (both copies), `hypothalamus-3d.js`, and the three machine pages in `reveals/`. The handshake between `optimal-gl3.js` and the embeds is still version 3, so this time a partial copy is safe. The machine pages are framed documents, which inherit nothing from the page around them (checked).
- **Card heights, placements, reserves and the private patch are unchanged.** On a plain page every card is exactly as tall as with the Nov 12 (b) embeds (compared at 358 and 760 px, as a desktop browser and as a phone). Under the site's -0.32 px tracking, Fig 2 now measures 1172.3 px at 358 px wide (was 1088.6; reserve 1172) and Fig 4 1187.9 (was 1167.0; reserve 1188).
- **Six phone cards will still read 4 to 21 px under their reserves; that part is not the tracking.** With the site's two fonts loaded and the new embeds, nine of the fifteen phone cards (358 px) match their reserves to within half a pixel. Six still sit under theirs, for reasons older than this round: Fig 5 is 1203 px (reserve 1224) and A2 1290 (1311), because the reserves are measured on a page without Castoro and Public Sans, where those two cards wrap one more line; A3 is 1036 (1040), A5 1181 (1186), A6 1171 (1175) and A9 981 (998), whose reserves are a few px above what the cards measure either way. At 760 px thirteen match; A4 (1605 against 1626) and A9 (1039 against 1060) are one line under for the same font reason. No card is taller than its reserve. Details and an optional tidy-up are in `DEV_TODO.md`, "Found by the Nov 12 site check".
- **If you set `letter-spacing: normal` on the figure elements in the meantime** (the stopgap in the last `DEV_TODO.md`), leave it or remove it; it no longer does anything.
- **New check: `python3 scripts/check-host-type.py`.** It mounts every embed, at 358 and 760 px, on a plain page and then under host pages that set these properties (the site's two trackings; all fourteen from the parent; all fourteen on the element itself) and fails if a card's height or the computed text styles inside it change. It fails on the Nov 12 (b) embeds and passes on these.
- **Not re-run this round:** the check on the site itself (the patch on `beoptimal-landing` with `check-embeds.mjs`). The Nov 12 (b) results stand for everything except card heights, which at 390 px should now match the `plain` heights `scripts/check-host-type.py` prints at 358 px (its page loads the site's two fonts). Desktop cards in columns narrower than 760 px can still be shorter than their reserves; that is the column, not the text spacing (`DEV_TODO.md`, "Found by the Nov 12 site check").

## What changed since the first Nov 12 package (`handoff-2026-11-12`)

A second round on Nov 12 (Peter: "build the bigger ideas"). **Same files, same places, no site code changes. Copy the whole of `embeds/` again, all at once** (see the first point).

- **The 3-D file and the embeds must be updated together.** `optimal-gl3.js` and every embed that uses it now carry version 3 of their handshake. An old embed with the new file (or the other way round) does not break: it shows the drawing and never the 3-D model. A full copy of `embeds/` avoids that.
- **Fig 1 (thermostat) and Fig 2 (InBody, five cylinders) are drawings again.** Peter withdrew their 3-D versions on Nov 12. Their two embed scripts no longer load `optimal-gl3.js` at all. Nothing to do beyond re-copying them.
- **Figs 3 to 6 can be turned.** A drag on the figure spins the model; a small handle sits in the figure's top-left corner (it appears once a pointer moves over the figure) and takes the arrow keys. While the model is turned its labels and screens step aside; let go and it swings back. A touch drag turns only sideways, so the page still scrolls. To switch turning off on a page, put `turn="off"` on the element, e.g. `<optimal-fig-vo2max turn="off">`.
- **Lit parts glow** (Fig 4's lasers and knee load, the pilot lights on Figs 4 and 6, and the lit parts of the tissue figures).
- Fig 3's board is forest green now, not white.
- `optimal-gl3.js` is 655 KB (170 KB gzip). `optimal-fig-hypothalamus.js`, `hypothalamus-3d.js` and `optimal-fig-heart.js` are still byte-identical to Oct 24.
- Card heights, placements, reserves and the private patch are unchanged.
- **Checked on the site (Nov 12):** the patch still applies cleanly to `beoptimal-landing` `main` (`98ff79c`); with this package's `embeds/`, `yarn build` passes and `check-embeds.mjs` passes on every page at 390 and 1280 px, with and without WebGL, consoles clean. Fig 1 and Fig 2 make no request for `optimal-gl3.js`; Figs 4 to 6 turn by drag on their pages and swing back. Two things the check turned up that are older than this round are in `DEV_TODO.md` ("Found by the Nov 12 site check").
- **`qa/check-embeds.mjs` now keeps analytics out:** it starts Chrome with the site's analytics hosts made unresolvable, so a check no longer sends page views to GA4, Clarity or the Meta Pixel (`--allow-analytics` to switch off).

## What changed since the Nov 11 package (`handoff-2026-11-11`)

A polish round on the new 3-D look (Peter, Nov 12). **Same files, same places, no site code changes**: if you took `handoff-2026-11-11`, re-copy `embeds/` from this one.

- `optimal-gl3.js` (both copies), the 13 embeds that use it and the 3 machine pages changed. `optimal-fig-hypothalamus.js`, `hypothalamus-3d.js` and `optimal-fig-heart.js` are still byte-identical to Oct 24.
- What changed is looks only: cleaner white housings, finer shadows between parts, drawing at 1.5x on 1x screens (desktop monitors), more presence for A1 on the cream theme, a finer foam in A5, and Fig 5's bike in the same sage and slate as the treadmill figures.
- Card heights, placements, reserves and the private patch are unchanged.
- Checked: every built page (57: both themes, embed test pages, the framed machine pages) brings the layer up with a clean console. The full site check (patch + embeds on `beoptimal-landing`, `check-embeds.mjs` at 390 and 1280 px) was last run on the Nov 11 embeds; nothing about how the files load has changed since.

## What changed since the Oct 24 package (`handoff-2026-10-24`)

**Every figure now renders as a real-time 3-D model** (Peter, Nov 10: "video game standard"). One new file does it for all of them. No site code changes.

1. **One more file to ship, in two places: `optimal-gl3.js`** (655 KB, 170 KB gzip).
   - `public/figures/optimal-gl3.js`, next to the embed scripts. Thirteen figures load it lazily from their own folder, once per page view, when a figure comes near the viewport.
   - `public/figures/reveals/optimal-gl3.js`, next to the three framed machine pages. Each framed page loads it from its own folder.
   - Both are in this release's `embeds/`, and `scripts/export-embeds.mjs` writes both.
2. **Re-copy 13 embed scripts and the 3 machine pages.** Figs 1–6 and A1, A3, A5, A6, A7, A8, A9 changed (each grew 24–83 KB). `optimal-fig-hypothalamus.js`, `hypothalamus-3d.js` and `optimal-fig-heart.js` are **byte-identical** to the Oct 24 ones: A2 and A4 were already real-time 3-D.
3. **No site code changes.** Placements, `FIGURE_RESERVE`, `REVEAL_RESERVE`, `OptimalFigure.tsx`, `EquipmentReveal.tsx` and the private patch are unchanged. The layer draws under each figure's own drawing, in the same box: every card measures the same height as before (old and new embeds compared at 358 and 760 px, desktop and phone).
4. **The drawing is still the first paint and the fallback.** A figure stays on its approved drawing with no WebGL 2, a software renderer, Save-Data or 2G, under 3 GB of memory, under 4 cores, a lost context, `gl="off"` on the element, or if `optimal-gl3.js` isn't deployed. Nothing breaks if you ship the embeds first and the chunk later.
5. **QA:** `handoff/qa/check-embeds.mjs` now reports the layer on every figure ("3-D on") and, in a second pass with WebGL off, that each falls back to its drawing without downloading the chunk. New: `scripts/measure-reserves.py` re-measures every card against `FIGURE_RESERVE`.
6. **Checked on the site (Nov 11):** the private patch still applies cleanly to `beoptimal-landing` `main` (`98ff79c`); with this release's `embeds/` copied into `public/figures/`, `yarn build` passes and `check-embeds.mjs` reports "all pages passed" at 390 and 1280 px: every figure "3-D on", every machine frame at its usual height (1164 / 825 / 927 px on a phone), the WebGL-off pass on the drawings, consoles clean.
7. **Approval:** the new look is live in the gallery as "Real-time 3-D · awaiting Peter's OK". The Oct 24 package stays valid until he signs off; this one is ready when he does.

See `ENGINEERING_HANDOFF.md`, "Added Nov 11", for how it works and what to check.

## What changed in the Oct 24 package (vs `handoff-2026-10-23`)

1. **The three machines in 3-D are now on the page** (Peter, Oct 24): the InBody 580, the Creator 600 (treadmill) and the KICKR Bike. Each shows inline on its service page, turnable and take-apart-able. See `ENGINEERING_HANDOFF.md`, "Added Oct 24".
   - **Ship `embeds/reveals/`** (three files) into `public/figures/reveals/`.
   - **Apply the updated private patch**: it now has a second commit with `EquipmentReveal.tsx` and the three spots.
   - **QA:** `check-embeds.mjs` checks the machines too.
2. `hypothalamus-3d.js` was rebuilt with an unused option (`power`, for the Ongoing Care deck). Nothing changes on the site.

## What changed in the Oct 23 package (vs `handoff-2026-10-21b`)

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

1. **All 15 embed scripts are new.** Use `embeds/` from the latest release (now `handoff-2026-11-12c`), or re-run `scripts/export-embeds.mjs`. Don't use the Oct 12 copies.
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
| QA | `handoff/qa/check-embeds.mjs`, the end-to-end QA against any running site. In the repo: `scripts/measure-reserves.py` (card heights against the reserves) and `scripts/check-host-type.py` (a host page's text styles stay out of the figures) |
| Embed scripts | The **`handoff-2026-11-12c` release** (`embeds/`: the 15 scripts, `optimal-gl3.js`, `hypothalamus-3d.js`, `reveals/` with the three machines in 3-D and their copy of `optimal-gl3.js`, and `manifest.json`), or re-run `node scripts/export-embeds.mjs --out <site>/public/figures`. Live copies: `https://optimal-research-team.github.io/optimal-anatomy-figures/<fig>/embed/optimal-fig-<slug>.js` (and `a2-hypothalamus/embed/hypothalamus-3d.js`) |
| Equipment films E1–E4 | `figures/e*/assets/` here, or the release zip's `equipment/` |
| **The site integration patch** | **Private:** [Optimal-Research-Team/optimal-anatomy-figures-site-patch](https://github.com/Optimal-Research-Team/optimal-anatomy-figures-site-patch). It's code from the private site repo, so it stays out of this public one. Ask Peter for access. It applies cleanly to `beoptimal-landing` `0f36c00` and `main` `0c0473c` (checked Oct 21), and hasn't been applied yet. |

## Apply

1. In `beoptimal-landing`, create a branch from `main` and apply the patch from the private repo.
2. Copy the 15 embed scripts **and `hypothalamus-3d.js`** into `public/figures/`.
3. Run `yarn test`, `yarn build` and `yarn preview`.
4. QA with `node handoff/qa/check-embeds.mjs <preview URL>` from this repo. It must report "all pages passed".

## How this package is made

`node scripts/package-handoff.mjs --tag handoff-2026-11-12c` builds every figure, exports the embeds, and assembles the folder and zip (docs, `site/`, `placements.json`, the QA script, `export-embeds.mjs`, `embeds/`, `equipment/`) in `handoff/package/` (git-ignored). The zip goes on the GitHub release; the site patch never does (it lives in the private repo).

