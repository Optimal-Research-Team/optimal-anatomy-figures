# DEV_TODO: anatomy figures on beoptimal.ca

In order. Sizes are rough, for one engineer who knows the site repo. See `ENGINEERING_HANDOFF.md` for the why and where.

## Changed since the handoff

- **Oct 18, 2026: readout names and units unified with the reception TV.** The clinic TV plays these same figures and had been fixing labels on its own copies. The fixes now live in this repo, so the site and the TV say the same thing. Text only: no numbers, models or drawings changed.
  - **Fig 4 and A7:** "Step rate 165/min" and "Kneecap force 100%" (were "Cadence 165 spm", "Kneecap load" and "Peak kneecap force"). Fig 4's slider, presets, hint, legend and screen-reader text follow.
  - **Fig 3 and A1:** "97% open", with no space before %. Fig 3's "Hb" readout is spelled out as "Hemoglobin". Fig 3 and A6 use the Canadian spelling "hemoglobin" throughout.
  - **A6:** the days before the dose read "−4 (before)", with a true minus sign.
  - **A4, Fig 5 and Fig 6:** millilitres are "mL" ("70 mL", "mL/kg/min"), including the tablet plot.
  - **For step 1:** the zip's `embeds/` predate this change, so run `scripts/export-embeds.mjs` instead of copying them. Fig 4's phone card is 13 px taller, because two readout labels now wrap at 358 px. `FIGURE_RESERVE['creator-600'].phone` is now 1188 in `handoff/site/optimalFigures.ts`; carry that into the site's copy. Sizes in `placements.json` are updated.

## Ship (primary placements, pages that exist today)

1. **Apply the reference integration** (S, about 1 h including review)
   - Apply the zip's `patch/beoptimal-landing-anatomy-figures.patch` on a branch from `main` (`git am`). It was made against `0f36c00` and applies cleanly there.
   - Copy the zip's `embeds/` into `public/figures/`, or run `scripts/export-embeds.mjs`.
   - `yarn test` (80/80), `yarn build`, `yarn preview`.
2. **Compliance look at the Menopause Protocol** (owner: Peter and the Protocol's reviewer)
   - Four figures go in the reviewed page: A9 in §3, Fig 1 and A3 in §5, A2 in §14.
   - Get a sign-off on the preview before merging.
3. **Caching for `/figures/*`** (XS): add a `headers` entry in `vercel.json`, or version the folder (ENGINEERING_HANDOFF, "Ship the scripts").
4. **Real-device check** (S)
   - **Devices:** iPhone (Safari) and a mid-range Android, at 320 and 390 px.
   - **A4 heart** (WebGL): check the frame rate on the VO₂ max page. It should look smooth; a governor lowers resolution if frames run long.
   - **Every page:** reduced motion and keyboard only.
5. **Run QA on the Vercel preview** (XS): `node handoff/qa/check-embeds.mjs <preview URL>` from the figures repo. It must say "all pages passed". Attach `handoff/qa/shots/` to the PR.
6. **Copy fixes on the Creator 600 page** (XS, owner: Peter to confirm wording)
   - "32″ upright display" should read 50″.
   - Soften the "180 spm benchmark" line. The evidence supports a 5–10 % change from your own rate.
7. **A4 heart: wait for Peter's OK on round 6.** It can merge with the rest and be held back by removing the one `<OptimalFigure slug="heart" gutter />`, and the journal block, if needed.

## Later (secondary placements)

8. **Longevity Protocol:** Fig 5 in place of the stock bike photo (§1.2); Fig 2 / A8 / A9 in §10. Each is a widget slot plus a `page.test.ts` entry.
9. **Menopause care (sales page):** Fig 1 under the symptoms list, with a link to Protocol §5.
10. **VO₂ max FAQ:** A5 inside "How is this different from my watch's estimate?"

## Blocked

11. **IV iron page:** Fig 3 hero, A1 under it, A6 in "After your infusion", when the page is built.

## Housekeeping found on the way (pre-existing, optional)

12. Restore `yarn lint`: migrate to `eslint.config.js` (ESLint 9) or pin ESLint 8.
13. Run `prettier --write` on the 21 unformatted files on `main`, in its own PR.
14. Find the CSS that triggers `Unexpected "{"` in the minify step.
