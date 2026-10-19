# Engineering handoff: anatomy figures on beoptimal.ca

**Date:** 2026-10-12 (equipment films E1–E4 added 2026-10-19)
**From:** Peter Phua (product), built with Claude Code
**For:** the engineers who own `BeOptimal/beoptimal-landing`

## In one paragraph

There are 15 interactive explainer figures: a hot flash, an InBody scan, IV iron, gait, VO₂max, the heart, and more. Each ships as **one JavaScript file** that defines a custom element (`<optimal-fig-heart>`). The element renders its own card in a shadow root, so the site's Tailwind can't touch it. This handoff says **which page and section each figure goes in**, and gives you the components to place them. It also includes a **tested reference integration** (a patch against `beoptimal-landing@0f36c00`). The patch puts all 13 figures whose pages exist today in place: tests 80/80, `tsc` and `vite build` clean, and every figure mounts on its page at phone width in a local production build (QA output below).

**Live gallery (every figure, both themes):** https://optimal-research-team.github.io/optimal-anatomy-figures/

## What's in the package

| Path | What it is |
|---|---|
| `ENGINEERING_HANDOFF.md` | This document. |
| `DEV_TODO.md` | The task list, in order, with owners and sizes. |
| `handoff/placements.json` | Machine-readable map: every figure, its script, size, reserved heights, approval state, and every placement (route, file, anchor, priority). |
| `handoff/site/` | Drop-in files for `src/components/optimal-figures/`: `OptimalFigure.tsx`, `optimalFigures.ts`, `optimal-figures.css`. |
| `scripts/export-embeds.mjs` | Copies the 15 built scripts into a folder (the site's `public/figures/`) with a `manifest.json` (bytes, gzip, sha). |
| `handoff/qa/check-embeds.mjs` | End-to-end QA against any running site (local preview or a Vercel preview URL). |
| **Zip only** (`~/Downloads/optimal-figures-handoff-2026-10-12.zip`) | `patch/beoptimal-landing-anatomy-figures.patch` (the reference integration; it stays out of this public repo because the site repo is private), `embeds/` (the 15 built scripts and manifest), and `qa/shots/` (13 screenshots of the figures in place). |

## Added Oct 19: equipment, taken apart (E1–E4)

The clinic's four testing machines are rebuilt part by part from their published dimensions, using the `anatomy-reveal` skill (MIT). Each machine comes with two things:
- **A 12 s silent film**, in 16:9 for the reception TV and desktop and 9:16 for Reels and phones.
- **An interactive take-apart page**: drag to turn, tap or press a button to take it apart. It's phone-first, with real 44 px buttons and no hover-only behaviour.

These are **round 1, for Peter's review. They are not yet approved for the site.** Peter records approvals on the internal content library page. Build the component now, but ship a machine only once its film is approved.

| Fig | Machine | Film (gallery) | Take-apart page | Goes on | Where |
|---|---|---|---|---|---|
| E1 | InBody 580 | `figures/e1-inbody-580/assets/` | `inbody-580-apart(-light).html` | `/services/inbody-580` | Hero media, or its own block before "Why" |
| E2 | Creator 600 | `figures/e2-creator-600/assets/` | `creator-600-apart(-light).html` | `/services/creator-600` | Hero media, or its own block before Fig 4 |
| E3 | Wahoo KICKR BIKE SHIFT | `figures/e3-kickr-bike/assets/` | `kickr-bike-apart(-light).html` | `/services/vo2-max-testing` | "02 — Equipment", next to Fig 5 |
| E4 | Hand dynamometer | `figures/e4-grip-dynamometer/assets/` | `grip-dynamometer-apart(-light).html` | `/optimal-longevity-protocol` | §1.3 Strength, the grip table (optional; no service page) |

**Files per machine** (in `assets/`):

| File | Size | Use |
|---|---|---|
| `<slug>-web-16x9.mp4` | 1280×720, 1.0–1.4 MB | Desktop |
| `<slug>-web-9x16.mp4` | 720×1280, 1.1–1.6 MB | Phones |
| `<slug>-16x9.jpg`, `<slug>-9x16.jpg` | | Posters, taken from the hero frame |
| `<slug>-16x9.mp4`, `<slug>-9x16.mp4` | 1080p masters, 8–12 MB | TV and Instagram. Don't serve these on the site. |

**Embedding the film.** Copy the four web files into `public/figures/reveals/` and use a plain video. A small component can pick the source with `matchMedia('(max-width: 640px)')`.

```tsx
<video autoPlay muted loop playsInline preload="none" poster="/figures/reveals/inbody-580-16x9.jpg"
       aria-label="The InBody 580, taken apart: a 12-second silent film" style={{ width: '100%', aspectRatio: '16 / 9' }}>
  <source src="/figures/reveals/inbody-580-web-9x16.mp4" media="(max-width: 640px)" type="video/mp4" />
  <source src="/figures/reveals/inbody-580-web-16x9.mp4" type="video/mp4" />
</video>
```

- **Lazy-load** like the figures: set `preload="none"` and start playback when the video is within 800 px of the viewport.
- **Reduced motion:** with `prefers-reduced-motion`, show the poster only.
- **Aspect ratio:** reserve it so the layout doesn't shift.

**The take-apart pages** are full HTML documents (fonts embedded, 0.9–1.2 MB), not custom elements like the 15 figures. Ship them as files and link to them under the film: "Take it apart →" opens the page. Iframing works too, but needs a fixed height per breakpoint, and on a phone the link reads better. If Peter wants them inline later, we'll convert them to `<optimal-fig-*>` elements in this repo.

**Source.** `reveals/<slug>/` holds the source and `REPORT.md` for each machine: spec with sources, assumptions, part counts, checks and how to rebuild. `reveals/SERIES-SPEC.md` holds the shared look and QA rules. The films take about 2 minutes of render per second of film, so they're committed as files, and the gallery build only copies them.

**Open questions on these four** (Peter's or the clinic's to answer, not engineering's):
- Confirm the clinic's dynamometer model. E4 is built as a Jamar-style hydraulic unit.
- Confirm the InBody footplate colour. The photos show both black and white.
- The Creator 600 page still says a "32-inch" display. It's 50″, as already noted above.
- The KICKR BIKE SHIFT doesn't physically tilt. Its grade is simulated by the brake, so don't describe it as tilting anywhere on the site.

## Where each figure goes

Priority key:
- **P** (primary): ship now.
- **S** (secondary): optional, later.
- **Blocked:** the page doesn't exist yet.

Line numbers refer to `beoptimal-landing@0f36c00`.

### VO₂ max testing: `/services/vo2-max-testing` (`src/pages/Vo2MaxTestingPage.tsx`)
| Fig | Element | Where | Pri |
|---|---|---|---|
| A4 The beating heart | `optimal-fig-heart` | Its own block right after `<SectionTracker section="Why">` ("Why measure it"), with gutter: the delivery side of VO₂max | P |
| 6 The treadmill ramp | `optimal-fig-vo2max-treadmill` | Inside "What to expect" ("01 — The test"), after the steps and the stop note | P |
| 5 The ramp and the mask (bike) | `optimal-fig-vo2max` | Inside "Equipment" ("02 — Equipment"), after the equipment cards | P |
| A5 The air sac | `optimal-fig-alveolus` | FAQ answer "How is this different from my watch's estimate?" | S |

### Creator 600: `/services/creator-600` (`src/pages/GaitAnalysisPage.tsx`)
| Fig | Element | Where | Pri |
|---|---|---|---|
| 4 The runner rig | `optimal-fig-creator-600` | Its own block after `<SectionTracker section="Six measures">`, with gutter | P |
| A7 The kneecap's load | `optimal-fig-knee` | Inside "Your report" ("AFTER THE RUN"), after the report preview | P |

Copy fixes on the same page:
- "32″ upright display" should be **50″**.
- The "180 spm benchmark" line contradicts Fig 4's caption. The evidence supports a 5–10 % change from your own rate, not a fixed 180.

### InBody 580: `/services/inbody-580` (`src/pages/InBody580Page.tsx`)
| Fig | Element | Where | Pri |
|---|---|---|---|
| 2 Five cylinders on a bridge | `optimal-fig-inbody-580` | Its own block between "Why" ("BEYOND THE SCALE") and "Result sheet", with gutter | P |
| A8 Water in and around the fibres | `optimal-fig-muscle-water` | Its own block right after "Result sheet", with gutter | P |

### Menopause Protocol (free): `/optimal-menopause-protocol` (`src/content/menopause/page.html`, rendered by `MenopauseProtocolPage.tsx`)

The body is an approved HTML string, so figures go in as slots: `<div data-optimal-fig="<slug>"></div>`. The page calls `mountOptimalFigures(root)` in an effect.

| Fig | Slug | Where | Pri |
|---|---|---|---|
| A9 Digging and filling (bone) | `bone-remodelling` | §3 (`#s3`), right after `figure#fig-6` (the Greendale bone chart). The figure quotes the same Greendale numbers | P |
| 1 The narrowing thermostat | `menopause-thermostat` | Top of §5 (`#s5`), before `figure#fig-7` | P |
| A3 The finger's heat valves | `finger-skin` | Right after Fig 1, also before `figure#fig-7` | P |
| A2 The hot-flash switch | `hypothalamus` | §14 (`#s14`), right after `figure#fig-11` (the options table); its four states mirror the table | P |

⚠️ This page's copy is compliance-reviewed. Have the reviewer see the four figures in place before this goes live (DEV_TODO 2).

### Longevity Protocol (free): `/optimal-longevity-protocol` (`src/content/longevity-protocol/page.html`, `OptimalLongevityProtocolPage.tsx`)

This page already portals Preact widgets into `data-olp-widget` slots. Add a slot, an entry in `WIDGETS`, and the slot in `page.test.ts`.

| Fig | Slot | Where | Pri |
|---|---|---|---|
| A6 The red cell's 120 days | `optimal-fig-red-cell-cycle` | §20 (`#s-20`), after the list ending "check ferritin, not just hemoglobin" | P |
| 5 The ramp and the mask | n/a | §1.2 (`#s-1-2`), in place of the "metabolic mask on a stationary bike" stock photo | S |
| 2 InBody / A8 water / A9 bone | n/a | §10 (`#s-10`), in place of or beside the "InBody 580 bioimpedance scan, in clinic" photo | S |

### Journal: `/journal/vo2max-and-longevity` (`src/content/journal/vo2max-and-longevity.ts`)

Add a block kind `{ kind: 'interactive', slug, title }`:
- in `src/models/JournalPost.ts`;
- rendered in `src/components/journal/JournalBody.tsx`;
- handled in `build/prerender-journal.mjs`, which **fails on unknown kinds**. Crawlers see "Interactive figure: <title>".

| Fig | Where | Pri |
|---|---|---|
| A4 The beating heart, then A5 The air sac | After the paragraph "Cardiorespiratory fitness matters because the fitter you are, the lower your risk of dying." | P (A5), S (A4; its primary home is the VO₂ max page) |

### Menopause care (sales): `/services/menopause-and-perimenopause-care` (`HormoneOptimizationPage.tsx`)
| Fig | Where | Pri |
|---|---|---|
| 1 The narrowing thermostat | Under the symptoms list, with a link "How a hot flash works →" to `/optimal-menopause-protocol#s5`. Keep treatment content (A2) off sales pages | S |

### IV iron: page not built yet
| Fig | Where | Pri |
|---|---|---|
| 3 The depot with a gate | Hero explainer: why pills stall at the gut gate and IV goes around it | Blocked |
| A1 The gut cell's gate | Under Fig 3, as the close-up of the gate | Blocked |
| A6 The red cell's 120 days | "After your infusion": ferritin jumps in days, haemoglobin climbs over weeks | Blocked |

**No figure:** home, `/membership`, hyperbaric oxygen therapy, privacy, referral. On HBOT, A5 would mislead: it shows oxygen carried on red cells, while HBOT works mostly through oxygen dissolved in plasma.

## How the embedding works

```tsx
import OptimalFigure from 'components/optimal-figures/OptimalFigure'

<OptimalFigure slug="heart" gutter />   // its own block between sections
<OptimalFigure slug="knee" />           // inside a section that already pads its content
```

- **Lazy:** the script loads when the slot comes within 800 px of the viewport, once per page view (`loadFigure` dedupes).
- **No layout shift:** each slot reserves the figure's measured height (`FIGURE_RESERVE`: phone at 358 px wide, desktop at 760 px). The reservation drops once the element is in. If you place a figure in a narrower column, measure it and update `FIGURE_RESERVE`.
- **Width:** the figures are designed for up to 760 px, and fill the width on phones. `gutter` adds 16 px each side for slots outside a padded column.
- **Theme:** `light` (Cream) on the site. `dark` (Forest night) is for the exam-room TV.
- **Fonts:** Castoro and Public Sans, which `index.html` already loads.
- **Failure:** if a script 404s, the slot collapses (`data-failed`). Nothing else on the page is affected.
- **HTML-string pages:** use `<div data-optimal-fig="slug"></div>` (optional `data-gutter`, `data-theme`) plus `useEffect(() => mountOptimalFigures(root.current), [])`.

## Ship the scripts

1. In the figures repo: `node scripts/build-all.mjs`, then `node scripts/export-embeds.mjs --out ../beoptimal-landing/public/figures`. Or copy the zip's `embeds/` folder.
2. Total size is about 3.5 MB raw and 0.9 MB gzipped across all 15. A page only loads its own figures (1–4 per page), each 112–424 KB raw (35–94 KB gzipped).
3. Caching: the file names aren't hashed. Either serve `/figures/*` with `Cache-Control: public, max-age=3600, stale-while-revalidate=86400` (a `headers` entry in `vercel.json`), or version the folder (`/figures/2026-10-12/`) and set `FIGURE_BASE`. `manifest.json` has a sha per file, for cache-busting or CI checks.
4. Don't hot-link GitHub Pages in production. It's the review gallery and it changes when we iterate.

## Performance and accessibility

- Every figure pauses when off screen (IntersectionObserver) and respects `prefers-reduced-motion` with a single still frame.
- Controls are real buttons, ≥44 px, keyboard operable. Each card has `role="img"` with a full text description, plus a polite live region for state changes.
- **A4 (heart) uses WebGL:** one canvas, ray-marched. It's 60 fps on desktop-class GPUs, and a governor lowers resolution if frames run long. Without WebGL it falls back automatically to an SVG drawing. **Please check frame rate on a mid-range Android and an older iPhone** (DEV_TODO 4).
- All the other figures are SVG and DOM only.

## QA

```bash
# in the figures repo (needs Chrome; run scripts/setup-cloud.sh once, then source .env.chrome)
node handoff/qa/check-embeds.mjs https://<your-preview>.vercel.app            # primary placements, 390 px
node handoff/qa/check-embeds.mjs https://<your-preview>.vercel.app --only all --width 1280
```

For each page, it checks that:
- every slot exists;
- each element mounted and drew its card;
- nothing scrolls sideways;
- the console is clean.

It also saves a screenshot per figure to `handoff/qa/shots/`.

Result on the reference integration (local `vite preview` of the patched site, 390 px):

```
✓ /optimal-menopause-protocol  menopause-thermostat, hypothalamus, finger-skin, bone-remodelling: ok   console clean
✓ /services/inbody-580         inbody-580, muscle-water: ok                                            console clean
✓ /services/creator-600        creator-600, knee: ok                                                   console clean
✓ /services/vo2-max-testing    vo2max, vo2max-treadmill, heart: ok                                     console clean
✓ /journal/vo2max-and-longevity alveolus: ok                                                           console clean
✓ /optimal-longevity-protocol  red-cell-cycle: ok                                                      console clean
```

Manual pass before launch:
- iPhone Safari and Android Chrome;
- 320 px width;
- keyboard only;
- reduced motion on;
- a slow 3G throttle (the reservation should hold, with no jump).

## Pre-existing issues in the site repo (not caused by this work)

- `yarn lint` can't run: ESLint 9 is installed with a legacy config (no `eslint.config.js`), and `--ext` was removed.
- `yarn pretty` fails on `main`: 21 files aren't Prettier-formatted (the patch leaves those files as they are).
- `vite build` prints a CSS minify warning (`Unexpected "{"`), also on `main`.
- `package.json` asks for Node 24.x. The build works on Node 22.

## Approvals and compliance

- **Approved for the site by Peter (2026-10-12):** every figure except A4. His words: "the only thing that needs to be re-done is the heart".
- **A4 (heart):** round 6 is pending Peter's OK. It can ship behind the others.
- **Medical content:** every number in every figure is sourced in the figures repo (`reference/truth-pack.md`, each figure's `NOTES.md`). Peter owns the regulatory call. The Menopause Protocol is compliance-reviewed copy, so its reviewer should see A9, Fig 1, A3 and A2 in place.
- The figures make no promises and show typical patterns, labelled as typical. Keep them that way: don't edit captions in the site repo. Request changes in the figures repo, and they come back as a rebuilt script.

## Updating a figure later

Change it in `Optimal-Research-Team/optimal-anatomy-figures`, then:
1. run `node scripts/build-all.mjs`;
2. run `node scripts/export-embeds.mjs --out <site>/public/figures`;
3. commit the changed scripts in the site repo;
4. if a figure's height changed, update `FIGURE_RESERVE`.
