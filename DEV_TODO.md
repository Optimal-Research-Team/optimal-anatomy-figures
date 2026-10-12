# DEV_TODO: anatomy figures on beoptimal.ca

In order. Sizes are rough, for one engineer who knows the site repo. See `ENGINEERING_HANDOFF.md` for the why and where.

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
