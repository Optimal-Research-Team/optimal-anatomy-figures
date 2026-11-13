# DEV_TODO: anatomy figures on beoptimal.ca

In order. Sizes are rough, for one engineer who knows the site repo. See `ENGINEERING_HANDOFF.md` for the why and where.

## Changed since the handoff

- **Nov 12, 2026 (c): the figures no longer take the page's text spacing. Re-copy all 15 embed scripts; use release `handoff-2026-11-12c`.** This is the fix for the short cards the Nov 12 site check found. On the site each figure inherited the site's `letter-spacing` through its shadow root (-0.32 px on the service pages, -0.17 px on the Menopause Protocol), so its captions wrapped in fewer lines than in the gallery, where the reserves were measured, and phone cards came out 14 to 83 px short of their reserves. See ENGINEERING_HANDOFF.md, "Added Nov 12 (c)".
  - **What changed:** each embed now sets fourteen inherited text properties back to their initial values, on its own element (`:host`) and again on the card's root inside the shadow root: `letter-spacing`, `word-spacing`, `text-transform`, `text-indent`, `text-align`, `text-align-last`, `white-space`, `text-wrap`, `word-break`, `overflow-wrap`, `hyphens`, `line-break`, `text-anchor` and `text-shadow`. The list is what was measured to move a box in a card, or a label in its drawing, when a page sets it (all 15 figures), plus `text-shadow`, which only paints. `font-feature-settings` and `line-height` were checked too and do not get in: the card's own `font` rule already resets them.
  - **Files:** all 15 `optimal-fig-*.js` changed, each by the same 506 bytes (one style rule, about 100 bytes gzipped). **`optimal-fig-hypothalamus.js` (A2) and `optimal-fig-heart.js` (A4) change here for the first time since Oct 24**: the same one rule and nothing else. `optimal-gl3.js` (both copies), `hypothalamus-3d.js` and the three machine pages are byte-identical to `handoff-2026-11-12b`, so a mixed copy is safe this time; the machine pages are framed documents and never inherited anything.
  - **Code:** none. Placements, `FIGURE_RESERVE`, `REVEAL_RESERVE` and the private patch stay as they are. On a plain page every card is exactly as tall as before (old and new embeds compared at 358 and 760 px, as a desktop browser and as a phone). Under the site's -0.32 px tracking, Fig 2 now measures 1172.3 px at 358 px wide (was 1088.6; reserve 1172) and Fig 4 1187.9 (was 1167.0; reserve 1188).
  - **If you set `letter-spacing: normal` on the `<optimal-fig-…>` elements in the meantime,** leave it or take it out; it no longer does anything.
  - **Checked on the site, Nov 13** (the private patch on `beoptimal-landing` `main` `e36b4fa`, with this release's `embeds/`): the patch still applies cleanly, `yarn build` passes, and `check-embeds.mjs` passes on every page at 390 and 1280 px, with and without WebGL, consoles clean. The site's tracking no longer reaches the cards. The four phone cards that sit in 358 px slots now land on their reserves: Fig 2 at 1172.3 px (was 1088.6), A8 1136.1 (was 1115.1), Fig 4 1187.9 (was 1167.0), A4 1379.4 (was 1358.5).
  - **Still open after that check: nine phone cards sit in 342 or 362 px columns, and the reserves are measured at 358.** Three of them are now 2 to 4 px taller than their reserves (Fig 1, Fig 5, Fig 6; the tracking used to hide this for Fig 5 and Fig 6), and six are 4 to 21 px shorter. The table and the fix are under "Site check, Nov 13" below.
  - **QA:** new `python3 scripts/check-host-type.py` mounts every embed under host pages that set these properties and fails if a card's height or its text styles change. `scripts/measure-reserves.py` still reports every card as fitting at 358 and 760 px.
- **Nov 12, 2026 (b): turn, glow, and two figures back to drawings. Copy the whole of `embeds/` again, all at once; use release `handoff-2026-11-12b`.** `optimal-gl3.js` and the embeds that use it now share version 3 of their handshake, so they must be updated together (a mixed set shows the drawings, not the 3-D models: safe, but not what you want). Fig 1 and Fig 2 are drawings again (Peter withdrew their 3-D versions); their scripts no longer load `optimal-gl3.js`. Figs 3 to 6 turn by drag (`turn="off"` on the element switches that off). `optimal-gl3.js` is 655 KB, 170 KB gzip. A2 and A4 are still byte-identical to Oct 24. No site code, placement or reserve changes.
- **Nov 12, 2026: polish round on the 3-D look. Same files, same places; use release `handoff-2026-11-12` in place of `handoff-2026-11-11`.** Looks only (whites, shadows, sharpness on 1x screens, A1 and A5 on the cream theme, Fig 5's colours). `optimal-gl3.js` (both copies), the 13 embeds and the 3 machine pages changed; A2 and A4 are still byte-identical to Oct 24. No site code, placement or reserve changes.
- **Nov 11, 2026: every figure renders in real-time 3-D. Ship one more file, `optimal-gl3.js`, in two places, and re-copy the embeds.** See ENGINEERING_HANDOFF.md, "Added Nov 11". Use release `handoff-2026-11-12` (the Nov 12 polish round replaced `handoff-2026-11-11`), or re-run `scripts/export-embeds.mjs`.
  - **Files:** `optimal-gl3.js` (655 KB, 170 KB gzip) goes in `public/figures/` next to the embed scripts **and** in `public/figures/reveals/` next to the three machine pages. Re-copy 13 embed scripts (Figs 1–6, A1, A3, A5–A9) and the 3 machine pages. `optimal-fig-hypothalamus.js`, `hypothalamus-3d.js` and `optimal-fig-heart.js` are byte-identical to `handoff-2026-10-24`.
  - **Code:** none. Placements, `FIGURE_RESERVE`, `REVEAL_RESERVE` and the private patch stay as they are (card heights are unchanged: old and new embeds compared at 358 and 760 px).
  - **Fallback:** each figure still paints its approved drawing first and stays on it without WebGL 2, on Save-Data, on small devices, or if the chunk isn't deployed. `gl="off"` on an element turns the layer off for that figure.
  - **QA:** `check-embeds.mjs` expects `(3-D on)` on every figure and `(SVG fallback)` in its WebGL-off pass.
  - **Checked Nov 11:** the patch applies to `main` (`98ff79c`); with the new `embeds/` in `public/figures/`, `yarn build` passes and `check-embeds.mjs` passes on every page at 390 and 1280 px.
  - **Still to do (S):** one pass on a real mid-range Android phone and an iPhone: the figure comes up in 3-D, scrolling stays smooth, and nothing jumps when the layer arrives.
  - **Approval:** the gallery shows the new look as "Real-time 3-D · awaiting Peter's OK". Ship `handoff-2026-10-24` until he signs off, then this one.
- **Oct 24, 2026: the three machines in 3-D go on the page (Peter).** Inline, on their service pages: the InBody 580 (before "Why"), the Creator 600 (above Fig 4) and the KICKR Bike (VO₂ max "02 — Equipment", above Fig 5). See ENGINEERING_HANDOFF.md, "Added Oct 24".
  - **Files:** copy `embeds/reveals/` (three framed pages) into `public/figures/reveals/`, from release `handoff-2026-10-24` or `scripts/export-embeds.mjs`, which now writes them.
  - **Code:** the private patch has a second commit with `EquipmentReveal.tsx`, `REVEAL_RESERVE` and the three spots. It applies cleanly to `main` (`0c0473c`); tsc, 145/145 tests, the build and `check-embeds.mjs` at 390 and 1280 px all pass.
  - The 15 figure scripts and `hypothalamus-3d.js` are the same as `handoff-2026-10-23`, apart from the optional Oct 24 rebuild below.
- **Oct 24, 2026 (optional): `hypothalamus-3d.js` was rebuilt with one new, unused option (`power`, the WebGL power preference, which the Ongoing Care deck now uses). Nothing changes on the site.** The `handoff-2026-10-23` release is still valid; re-export only if you want byte-identical files with the repo.
- **Oct 23, 2026: Peter approved A4 (the heart, round 6) and A2 (the hot-flash switch, round 4 with its real-time 3-D layer) for the site. Ship both.** Nothing is held back any more: copy `hypothalamus-3d.js` with the embeds, and keep the heart's placements (VO₂ max "Why", and the journal block).
  - Use release `handoff-2026-10-23`, or re-run `scripts/export-embeds.mjs`. One embed changed since `handoff-2026-10-21b`: `optimal-fig-hypothalamus.js` (Oct 22, security). Its 3-D file is now read only from the element's own `gl-src` attribute, never from a link's query string. The site never sets `gl-src`, so nothing else changes. The other 14 embeds and `hypothalamus-3d.js` are byte-identical to `handoff-2026-10-21b`.
  - No site code changes: placements, `FIGURE_RESERVE` and the private patch stay as they are.
- **Oct 21, 2026 (b): A2 gets a real-time 3-D layer. Ship one more file: `hypothalamus-3d.js`, next to `optimal-fig-hypothalamus.js` in `public/figures/`.** (Release `handoff-2026-10-21b`, `embeds/`; or `scripts/export-embeds.mjs`, which now copies it.) See ENGINEERING_HANDOFF.md, "Added Oct 21 (b)".
  - Only `optimal-fig-hypothalamus.js` changed among the 15 embeds; the other 14 are byte-identical to the Oct 21 ones.
  - No site code changes: the placement, `FIGURE_RESERVE.hypothalamus` (1311 / 1306, re-measured) and the private patch stay as they are. Checked: the patch still applies to `main` (`0c0473c`), `yarn build` passes, and `check-embeds.mjs` passes on every page of the patched preview at 390 and 1280 px, with A2's 3-D layer on and, without WebGL, its SVG fallback.
  - The chunk is fetched as `hypothalamus-3d.js?v=<sha>`, so it's cache-busted on every build. Whatever caching you set for `/figures/*` (task 3) covers it.
  - **Approval:** Peter approved round 4 for the site on Oct 23; ship `hypothalamus-3d.js`.
- **Oct 21, 2026: seven card reserves raised; update `FIGURE_RESERVE` from `handoff/site/optimalFigures.ts` (the private patch carries the new values).** I re-measured every card at 358 and 760 px, in a desktop browser and as a phone (touch, 3× pixels). Seven cards came out taller than their reserves, so content below them would jump by 4–29 px when they mount.
  - Raised: Fig 5 1224 / 1315 (also its new pose, below); A2 phone 1311; A3 phone 1040; A4 desktop 1626; A5 phone 1186; A6 phone 1175; A9 998 / 1060.
  - The other eight already fit. `placements.json` matches.
  - **Fig 5:** the assessor turns 14° so the whole tablet shows past the near arm. The arm had hidden where the VO₂ line flattens at the 45 and 55 ceilings.
- **Oct 21, 2026: small polish. Re-export all 15 embeds again.** The light theme's muted and legend grey is now #716e68 (4.97:1 on cream, up from 4.46:1). Fig 1's hint reads "tap for a small rise" and Fig 3's "press Play", in place of "space" on phones. **Fig 6:** the side panel moved 6 cm forward along the far handrail and its speed is right-aligned, so the runner's mask no longer hides the first digit ("15.6" had read "5.6" at points in every stride). Card heights are unchanged.
- **Oct 21, 2026: the equipment films were re-cut and the take-apart pages polished (E1–E4).** The camera now only moves forward, so any change to a wider framing is a hard cut. All 16:9, 9:16 and web encodes in `figures/e*/assets/` are replaced, along with their posters. The pages share one header, corner labels and equal-width button rows, and meet 4.5:1 contrast. Re-copy every `assets/` file you took before Oct 21.
- **Oct 20, 2026: visual-bug sweep. Re-export all 15 embeds** (`scripts/export-embeds.mjs`); every embed script changed. Card heights are unchanged (re-measured at 358 and 760 px), so `FIGURE_RESERVE` and `placements.json` stay as they are.
  - **All figures:** segmented options are at least 44 px wide at 320 px (Fig 2 "Arm"/"Leg", Fig 5 "25"–"55", A4/A5 "Rest"/"Run", A7 "+5%" were 30–43 px). Captions keep a number on the same line as its unit and both ends of a range together (no more "13–22" / "% below"). Words are unchanged.
  - **Fig 4:** the four readout values sit in equal columns on phones. **Fig 6:** the tablet's big VO₂ number moved to the right of its strip, clear of the assessor's arm.
  - **A6:** the monitor's "Hemoglobin" label sits clear of the ferritin dot and line, the day cursor breaks around both labels, and "8 wk" has room from the panel edge.
  - **A4:** a new blood cell gets its angle when it's born. Round 5 drew newborn cells in the veins with no angle and logged `attribute d: Expected number` (the reception TV's console errors). Round 6 doesn't draw those cells, so this is a guard only; nothing visible changes.
  - The equipment pages (E1–E4) now share one header, corner labels, button row and colours. They aren't embeds, so nothing to export for them.

- **Oct 19, 2026: four equipment films and take-apart pages (E1–E4).** InBody 580, Creator 600, KICKR Bike and the hand dynamometer are now in the gallery under "Equipment, taken apart". Peter approved them for the site on Oct 19. See ENGINEERING_HANDOFF.md, "Added Oct 19". The new tasks are under **Equipment films** below.
- **Oct 18, 2026: readout names and units unified with the reception TV.** The clinic TV plays these same figures and had been fixing labels on its own copies. The fixes now live in this repo, so the site and the TV say the same thing. Text only: no numbers, models or drawings changed.
  - **Fig 4 and A7:** "Step rate 165/min" and "Kneecap force 100%" (were "Cadence 165 spm", "Kneecap load" and "Peak kneecap force"). Fig 4's slider, presets, hint, legend and screen-reader text follow.
  - **Fig 3 and A1:** "97% open", with no space before %. Fig 3's "Hb" readout is spelled out as "Hemoglobin". Fig 3 and A6 use the Canadian spelling "hemoglobin" throughout.
  - **A6:** the days before the dose read "−4 (before)", with a true minus sign.
  - **A4, Fig 5 and Fig 6:** millilitres are "mL" ("70 mL", "mL/kg/min"), including the tablet plot.
  - **For step 1:** the Oct 12 zip's `embeds/` predate this change, so run `scripts/export-embeds.mjs` instead of copying them. Fig 4's phone card is 13 px taller, because two readout labels now wrap at 358 px. `FIGURE_RESERVE['creator-600'].phone` is now 1188 in `handoff/site/optimalFigures.ts`; carry that into the site's copy. Sizes in `placements.json` are updated.

## Ship (primary placements, pages that exist today)

1. **Apply the reference integration** (S, about 1 h including review)
   - Apply `beoptimal-landing-anatomy-figures.patch` from the private repo [optimal-anatomy-figures-site-patch](https://github.com/Optimal-Research-Team/optimal-anatomy-figures-site-patch) on a branch from `main` (`git apply`). It was made against `0f36c00`; on Oct 21 it applied cleanly there and to `main` at `0c0473c` (re-checked that afternoon with the A2 3-D embeds: build and QA pass).
   - Copy `embeds/` from the `handoff-2026-11-12c` release into `public/figures/` (15 scripts, `optimal-gl3.js`, `hypothalamus-3d.js`, and `reveals/` with the three machines), or run `scripts/export-embeds.mjs`.
   - `yarn test` (80/80), `yarn build`, `yarn preview`.
2. **Compliance look at the Menopause Protocol** (owner: Peter and the Protocol's reviewer)
   - Four figures go in the reviewed page: A9 in §3, Fig 1 and A3 in §5, A2 in §14.
   - Get a sign-off on the preview before merging.
3. **Caching for `/figures/*`** (XS): add a `headers` entry in `vercel.json`, or version the folder (ENGINEERING_HANDOFF, "Ship the scripts").
4. **Real-device check** (S)
   - **Devices:** iPhone (Safari) and a mid-range Android, at 320 and 390 px.
   - **A4 heart** (WebGL): check the frame rate on the VO₂ max page. It should look smooth; a governor lowers resolution if frames run long.
   - **A2 hot-flash switch** (WebGL since Oct 21): on the Menopause Protocol §14, check it crossfades from the drawing to the 3-D block within a second or two of scrolling near, stays smooth, turns on a sideways drag while vertical swipes still scroll, and that the phone doesn't get warm. If a device can't hold ~22 fps it hands back to the drawing by itself; `data-gl` on its `.a2-stage` (in the shadow root) says why.
   - **Every page:** reduced motion and keyboard only.
5. **Run QA on the Vercel preview** (XS): `node handoff/qa/check-embeds.mjs <preview URL>` from the figures repo. It must say "all pages passed". Attach `handoff/qa/shots/` to the PR.
6. **Copy fixes on the Creator 600 page** (XS, owner: Peter to confirm wording)
   - "32″ upright display" should read 50″.
   - Soften the "180 spm benchmark" line. The evidence supports a 5–10 % change from your own rate.
7. **A4 heart (round 6) and A2 round 4 (3-D): approved by Peter on Oct 23.** Ship them with the rest; nothing is held back.

## Later (secondary placements)

8. **Longevity Protocol:** Fig 5 in place of the stock bike photo (§1.2); Fig 2 / A8 / A9 in §10. Each is a widget slot plus a `page.test.ts` entry.
9. **Menopause care (sales page):** Fig 1 under the symptoms list, with a link to Protocol §5.
10. **VO₂ max FAQ:** A5 inside "How is this different from my watch's estimate?"

## Equipment in 3-D (E1–E3 approved Oct 19; inline since Oct 24)

1. **Ship the three machines in 3-D** (S, done in the patch's second commit): `EquipmentReveal.tsx`, `REVEAL_RESERVE`, and the spots on the InBody 580, Creator 600 and VO₂ max pages. Copy `embeds/reveals/*.html` to `public/figures/reveals/`. Check them on a real iPhone and Android with the rest (task 4): a sideways drag turns the machine, a vertical swipe scrolls the page, and the buttons take it apart.
2. **The films are optional now.** If you want a video somewhere (a hero, a social embed), the recipe is in ENGINEERING_HANDOFF.md, "Added Oct 19". The web encodes and posters are in the release's `equipment/`.
3. **E4 (hand dynamometer)** isn't on the site for now.
4. **Fix "32-inch" on the Creator 600 page** (XS). It's a 50″ display.

## Blocked

11. **IV iron page:** Fig 3 hero, A1 under it, A6 in "After your infusion", when the page is built.

## Site check, Nov 13 (the `handoff-2026-11-12c` embeds on `main` `e36b4fa`): what is still open

The check itself passed (see "Nov 12, 2026 (c)" at the top). What follows is card heights against `FIGURE_RESERVE`, measured on a local `vite preview` of the patched site with analytics blocked. "12b card" is the same build with the previous embeds, for comparison.

**How a mismatch shows:** the slot holds its reserve as a `min-height` until the card mounts, then takes the card's own height. So the content below a figure moves by the difference at the moment it mounts. Cards mount when their slot comes within 800 px of the viewport, so the move is usually off screen.

**At 390 px** (identical as a desktop browser and as a phone with touch):

| Page | Figure | Slot | 12b card | 12c card | Reserve | 12c against reserve |
|---|---|---|---|---|---|---|
| `/optimal-menopause-protocol` | Fig 1 | 362 px | 1065.1 | 1065.1 | 1061 | **+4 (taller)** |
| `/optimal-menopause-protocol` | A2 | 362 px | 1252.5 | 1294.3 | 1311 | -17 |
| `/optimal-menopause-protocol` | A3 | 362 px | 1018.9 | 1018.9 | 1040 | -21 |
| `/optimal-menopause-protocol` | A9 | 362 px | 984.3 | 984.3 | 998 | -14 |
| `/services/inbody-580` | Fig 2 | 358 px | 1088.6 | 1172.3 | 1172 | on it |
| `/services/inbody-580` | A8 | 358 px | 1115.1 | 1136.1 | 1136 | on it |
| `/services/creator-600` | Fig 4 | 358 px | 1167.0 | 1187.9 | 1188 | on it |
| `/services/creator-600` | A7 | 342 px | 1095.6 | 1095.6 | 1117 | -21 |
| `/services/vo2-max-testing` | Fig 5 | 342 px | 1186.5 | 1228.4 | 1224 | **+4 (taller)** |
| `/services/vo2-max-testing` | Fig 6 | 342 px | 1204.3 | 1225.2 | 1223 | **+2 (taller)** |
| `/services/vo2-max-testing` | A4 | 358 px | 1358.5 | 1379.4 | 1379 | on it |
| `/journal/vo2max-and-longevity` | A5 | 342 px | 1140.5 | 1182.3 | 1186 | -4 |
| `/optimal-longevity-protocol` | A6 | 342 px | 1126.6 | 1168.5 | 1175 | -7 |

**At 1280 px:**

| Page | Figure | Slot | 12b card | 12c card | Reserve | 12c against reserve |
|---|---|---|---|---|---|---|
| `/optimal-menopause-protocol` | Fig 1 | 760 px | 1166.3 | 1166.3 | 1166 | on it |
| `/optimal-menopause-protocol` | A2 | 760 px | 1305.9 | 1305.9 | 1306 | on it |
| `/optimal-menopause-protocol` | A3 | 760 px | 1228.5 | 1228.5 | 1228 | on it |
| `/optimal-menopause-protocol` | A9 | 760 px | 1038.6 | 1038.6 | 1060 | -21 |
| `/services/inbody-580` | Fig 2 | 760 px | 1190.1 | 1190.1 | 1190 | on it |
| `/services/inbody-580` | A8 | 760 px | 1118.9 | 1118.9 | 1119 | on it |
| `/services/creator-600` | Fig 4 | 760 px | 1351.2 | 1351.2 | 1351 | on it |
| `/services/creator-600` | A7 | 760 px | 1423.5 | 1423.5 | 1424 | on it |
| `/services/vo2-max-testing` | Fig 5 | 760 px | 1315.2 | 1315.2 | 1315 | on it |
| `/services/vo2-max-testing` | Fig 6 | 760 px | 1378.1 | 1405.1 | 1405 | on it |
| `/services/vo2-max-testing` | A4 | 760 px | 1563.2 | 1605.0 | 1626 | -21 |
| `/journal/vo2max-and-longevity` | A5 | 640 px | 1230.3 | 1251.2 | 1374 | -123 |
| `/optimal-longevity-protocol` | A6 | 752 px | 1284.1 | 1284.1 | 1293 | -9 |

Three causes, none of them the tracking any more:

- **Column width.** The reserves are measured at 358 and 760 px. On the site, figures inside a padded section are 342 px wide on a phone; the Menopause Protocol's column is 362; the journal column is 640 on desktop and the Longevity Protocol's is 752. A narrower card is not always shorter: Fig 5 and Fig 6 are taller at 342 than at 358.
- **Fonts.** `scripts/measure-reserves.py` measures on a page without Castoro and Public Sans, the taller case. With the site's fonts A2 is one caption line shorter on a phone (at 358 px: 1290 against 1311), and A4 and A9 on desktop (21 px each).
- **Stale values.** The phone reserves for A3, A5, A6 and A9 are 4 to 17 px above what `measure-reserves.py` prints today (1036, 1181, 1172, 982).

**To do (S, needs Peter's go-ahead because it changes the patch):** measure each placement at the site's own column width and set the reserves from that, in `handoff/site/optimalFigures.ts`, `handoff/placements.json` and the private patch. Since one figure can sit in columns of different widths, the cleanest form is a reserve per placement. The smallest change that stops the three cards that grow, with the site's fonts loaded, is phone reserves of 1066 for Fig 1, 1229 for Fig 5 and 1226 for Fig 6.

Also from this check:

- `yarn test` gives 196 of 200 on `main` (`e36b4fa`) with or without the patch. The four failures are in `legacyRedirects.test.ts` (two), `siteNavigation.test.ts` and `cycle-hormone-care/content.test.ts`; none touches the figures. On Nov 12 it was 175 of 177 on `98ff79c`.
- An earlier note here said a short card leaves "spare space under the card" and nothing shifts. That was wrong: the slot drops its reserve once the card is in (`.optimal-figure[data-ready] { min-height: 0 }`), as described above.

## Housekeeping found on the way (pre-existing, optional)

12. Restore `yarn lint`: migrate to `eslint.config.js` (ESLint 9) or pin ESLint 8.
13. Run `prettier --write` on the 21 unformatted files on `main`, in its own PR.
14. Find the CSS that triggers `Unexpected "{"` in the minify step.
