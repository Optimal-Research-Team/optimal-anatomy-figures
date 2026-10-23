# DEV_TODO: anatomy figures on beoptimal.ca

In order. Sizes are rough, for one engineer who knows the site repo. See `ENGINEERING_HANDOFF.md` for the why and where.

## Changed since the handoff

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
   - Copy `embeds/` from the `handoff-2026-10-21b` release into `public/figures/` (15 scripts plus `hypothalamus-3d.js`), or run `scripts/export-embeds.mjs`.
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

## Equipment films (approved Oct 19)

1. **`EquipmentFilm` component** (S): a lazy, muted, looping `<video>` that picks the 16:9 or 9:16 web encode by viewport. It shows the poster under `prefers-reduced-motion` and reserves its aspect ratio.
2. **Place E1, E2 and E3** on their service pages (S). Copy `figures/e*/assets/*-web-*.mp4` and the posters to `public/figures/reveals/`, and put a "Take it apart →" link to the page under each film.
3. **E4 on the Longevity Protocol page**, §1.3 (S, optional).
4. **Fix "32-inch" on the Creator 600 page** (XS). It's a 50″ display.

## Blocked

11. **IV iron page:** Fig 3 hero, A1 under it, A6 in "After your infusion", when the page is built.

## Housekeeping found on the way (pre-existing, optional)

12. Restore `yarn lint`: migrate to `eslint.config.js` (ESLint 9) or pin ESLint 8.
13. Run `prettier --write` on the 21 unformatted files on `main`, in its own PR.
14. Find the CSS that triggers `Unexpected "{"` in the minify step.
