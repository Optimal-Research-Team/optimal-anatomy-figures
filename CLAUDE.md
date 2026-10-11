# CLAUDE.md: optimal-anatomy-figures

Interactive isometric explainer figures for Optimal Health (Barrie, ON), built with the **Anatomy** skill vendored at `.claude/skills/anatomy/` (MIT, upstream `wheresryan22/anatomy`, commit in `VENDORED_FROM`). The task brief is **`HANDOFF.md`**. Read it first.

## Working style
- Act autonomously: build, commit, push and deploy without asking. Stop only when truly blocked, and say what's blocking.
- Peter iterates on design in 3–5 rounds. Round 1 should already look finished and crafted, not like a sketch.
- Report progress with a gallery link and screenshots, not descriptions.

## Non-negotiables
1. **The object is the explanation.** Follow the skill: a real, dense machine whose motion *is* the idea. No boxes, arrows or floating labels.
2. **Truth first.** Every number shown or animated comes from `reference/truth-pack.md` with a source. Add sources for anything new. A model module (`model.mjs`) drives everything.
3. **Medical accuracy.** No diagnosis, no promised outcomes, typical patterns labelled as typical. Stay consistent with the compliance-reviewed Menopause Protocol. Peter owns the regulatory call on explainers. Your job is to make them *correct*.
4. **Phone first.** About 80% of visitors are on phones. Verify at 390 / 360 / 320 px before desktop, with ≥44 px tap targets and no hover-only behaviour. When phone and desktop fixes conflict, phone wins.
5. **Both themes ship:** Cream (`data-theme="light"`, primary) and Forest night (default), using `shared/optimal-theme.css` with `class="iso optimal"`.
6. **No 3D mode** on these figures (it's beta and they go on public phone pages). At most one WebGL layer per Figure-size piece, and the SVG must read without it.
7. Never copy a reference photo or another brand's design. Take finish and proportion only. The VO2 images in `reference/equipment/*-STOCK.*` are stock photos, not Optimal's equipment.

## Layout
```
.claude/skills/anatomy/   vendored skill: SKILL.md, kit/, examples/, references/, scripts/
figures/<nn-slug>/        build.mjs, model.mjs, geometry/art modules, NOTES.md, shots/
shared/                   optimal-theme.css, mannequin.mjs (built in Fig 4)
reference/                truth-pack.md, site-copy.md, brand.md, equipment/ photos
scripts/                  setup-cloud.sh, build-all.mjs
dist/                     build output (gitignored), published by GitHub Pages
```
Import the kit by relative path from a figure, e.g. `../../.claude/skills/anatomy/kit/iso-kit.mjs`, and inline it with `.claude/skills/anatomy/scripts/inline-kit.mjs`. Don't fork or edit the vendored kit. If it truly needs a fix, note it in the figure's NOTES.md and patch in `shared/`.

## Commands
```bash
bash scripts/setup-cloud.sh                     # Node + headless Chrome check, prints CHROME_PATH
node figures/01-menopause-thermostat/build.mjs  # dark; add --light, --audit
node scripts/build-all.mjs                      # all figures -> dist/ + gallery index
node .claude/skills/anatomy/scripts/capture.mjs <page.html> --out shots/x.png   # see references/verify.md
```

## Git
- Descriptive multi-line commit messages ending with `Co-Authored-By: Claude <noreply@anthropic.com>`.
- Pushing to `main` deploys the gallery to https://optimal-research-team.github.io/optimal-anatomy-figures/
- No patient data, secrets or real clinic financials ever go in this repo. It's public.
