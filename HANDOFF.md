# HANDOFF: Optimal × Anatomy figures

**Owner:** Peter Phua (Optimal Health, Barrie ON) · **Prepared:** 2026-10-11 · **For:** a Claude Code cloud session working in this repo

You are building **five interactive isometric explainer figures** for Optimal's service pages with the **Anatomy** skill, which is bundled in this repo at `.claude/skills/anatomy/`. Each figure is a real, finely made machine whose working **is** the medical idea. A small, honest numeric model drives every moving part and every readout number.

Build them **simplest first**, one at a time, and get each one to "done" (below) before starting the next.

---

## 0. Start here (first 15 minutes)

1. Read `CLAUDE.md` (house rules), then `.claude/skills/anatomy/SKILL.md` in full, then `.claude/skills/anatomy/references/craft.md` and `references/walkthrough.md`.
2. Run `bash scripts/setup-cloud.sh`. It checks Node, finds or installs a headless Chrome for the skill's `capture.mjs` / `drive.mjs` / `lines.mjs`, and prints `CHROME_PATH`. If the Chrome download is blocked by the network policy, say so in your first message and keep building. You can still build and audit, but screenshot verification waits until Chrome is available.
3. Build the smallest example to prove the toolchain: `node .claude/skills/anatomy/examples/dial-indicator/build.mjs` (and `--light`).
4. **Truth first, per figure.** `reference/truth-pack.md` lists what each figure needs. Before writing a figure's model, research those numbers (WebSearch/WebFetch, primary sources) and fill in that figure's section with a source and confidence for every value. **Every number in a readout, caption or motion comes from there.** Budget about 15 minutes of research per Figure and 25 per Hero.
5. Run `date`, then post the plan for Figure 1: the size class, the one-sentence mapping ("what moves, and what that motion means"), and a parts list of at least 40 parts. Then build.

---

## 1. Build order and budget

| Order | Figure | Folder | Anatomy size | Build estimate | Ships on |
|---|---|---|---|---|---|
| **1** | Menopause: the narrowing thermostat | `figures/01-menopause-thermostat/` | Figure | 1–1.5 h | Menopause Protocol page, hormone explainers |
| **2** | InBody 580: five cylinders on a bridge | `figures/02-inbody-580/` | Figure | 1–1.5 h | `/services/inbody-580` |
| **3** | IV iron: the depot with a gate | `figures/03-iv-iron/` | Figure (upper end) | 1.5–2 h | IV iron waitlist page (beoptimal.ca, launching) |
| **4** | Creator 600: the runner rig | `figures/04-creator-600/` | Hero | 3–4 h | `/services/creator-600` |
| **5** | VO2max: the ramp and the cart | `figures/05-vo2max/` | Hero (+1 WebGL layer) | 3–5 h (−1 h reusing the mannequin) | `/services/vo2-max-testing`, Performance package |

Expect Peter to ask for 3–5 design rounds per figure, which adds about 30–50%. Follow the skill's rule: **a working page that opens in the browser within the first hour**, then deepen it. Run `date` at each step. If a step runs past twice its share of the estimate, report where it stands.

**Shared parts you build once:**
- `shared/optimal-theme.css` already exists: the Cream (light) and Forest night (dark) token maps. Every figure uses `class="iso optimal"`.
- `shared/mannequin.mjs`: build it in Figure 4, reuse it in Figure 5. It's a turned-wood/steel artist's mannequin with ball joints. Anatomy draws machines, not organic bodies. The mannequin *is* the patient, and its joints are exactly what the Creator 600 tracks.

---

## 2. Definition of done (every figure)

- [ ] `figures/<nn-slug>/build.mjs` writes `<slug>.html` (Forest night) and, with `--light`, `<slug>-light.html` (Cream), both standalone with the kit inlined.
- [ ] `figures/<nn-slug>/model.mjs`: a pure model module. Every readout and every motion is computed from it, and nothing is tuned by eye.
- [ ] The framed card per the skill: `Fig n` top left, a short title top right, the interaction hint bottom left and the live readout bottom right. A true caption and legend go under the card. No floating labels, arrows or callouts in the drawing.
- [ ] Interactive by pointer **and** keyboard. An idle tour loops when untouched, rendering stops offscreen, and `prefers-reduced-motion` gives one still frame that still explains the idea.
- [ ] `node build.mjs --audit` ends `audit passed` (when the figure has pipes, cables or round parts), and `scripts/lines.mjs` prints `line ends: 0` on both themes.
- [ ] **Phone first.** About 80% of Optimal's visitors are on phones. Capture at **390, 360 and 320 px** wide plus desktop, in both themes. The figure must read at 320. Controls are ≥44 px tap targets and never depend on hover. Captures go in `figures/<nn-slug>/shots/`.
- [ ] 4× close-ups of every junction, in both themes. Read every PNG you make.
- [ ] `figures/<nn-slug>/NOTES.md`: the one-sentence mapping, the parts list, every number with its truth-pack source, decisions made, and open issues.
- [ ] **Medical accuracy pass.** Re-read the caption and readouts against `reference/truth-pack.md`. No diagnosis, no promised outcomes ("typical pattern", "your NP confirms with bloodwork"), and wording consistent with the compliance-reviewed Menopause Protocol.
- [ ] `node scripts/build-all.mjs` copies the outputs into `dist/` and the gallery `dist/index.html` lists the figure. Commit and push. GitHub Pages republishes the gallery (see §6).
- [ ] Report to Peter: the live gallery link, 2–3 screenshots (phone + desktop), what's left, and the questions you need answered.

---

## 3. The five figures

These concepts are a strong starting point, not a cage. The skill's step 3 says to invent the object. If you find a machine whose mechanism maps **more truly** one-to-one onto the idea, propose it in one sentence and go. Never copy a reference photo: take the real thing's finish and proportions, not its likeness.

### Figure 1: Menopause, the narrowing thermostat (simplest; start here)

**The idea in one line:** Hot flashes happen because falling estrogen narrows the brain's thermoneutral zone (the gap between the sweating and shivering thresholds) to almost nothing, so a core-temperature rise too small to notice trips a full cooling response.

**Machine:** a brass bench thermostat or bimetal regulator. A vertical core-temperature column wanders slowly with small natural swings between **two adjustable contact jaws**: the upper jaw is the sweat threshold, the lower jaw is the shiver threshold. Both ride on a lead screw. When the column touches the upper jaw, a circuit closes. Louvres open on a radiator panel (skin vasodilation), a skin-temperature dial swings up, a heart-rate dial ticks up, and core temperature then dips below baseline (the after-chill).

**Controls:** one knob, an engraved estrogen plate, sweeping from *Pre-menopause* (wide gap) to *Post-menopause* (gap near zero). An optional second control is a 3-way switch for *No treatment / Estrogen therapy / NK3 blocker*. Both treatments widen the gap again through different relays. The NK3 path is the KNDy relay in the truth pack. Check Health Canada status before naming a drug.

**Readout:** core °C · zone width °C · flashes per hour (simulated from the model) · skin °C.

**Truth:** truth pack §1 (Freedman's thermoneutral-zone work, KNDy/NKB, SWAN durations).

**WebGL:** optional, at most one layer: heat shimmer over the radiator only while the louvres are open. The SVG must read without it.

**Watch out for:** don't imply that every woman flushes, and don't promise treatment outcomes. The caption explains the mechanism only.

### Figure 2: InBody 580, five cylinders on a bridge

**The idea in one line:** The InBody sends a tiny alternating current through five body segments. Water carries it and fat resists it. Low frequencies can't cross cell membranes, so they read only the water *outside* cells, while high frequencies pass *through* cells and read total water. Thin arms dominate the resistance even though the trunk holds most of the mass.

**Machine:** the real InBody 580 (white column, footplate with heel and toe electrodes, two hand grips on cables, a tilted screen; see `reference/equipment/inbody580-*`). Beside it stands a **cutaway body built from five glass cylinders** (2 arms, trunk, 2 legs) wired in series through the grips and footplate. Inside each cylinder, packed cells sit in fluid. The current shows as a stream of dots. At low frequency the dots flow *around* the cells, and at high frequency they flow *through* them. A small meter on each cylinder shows its impedance in Ω, with the arm meters reading much higher than the trunk's.

**Controls:** a frequency selector knob using the 580's real frequencies (truth pack §2), plus tapping a segment to isolate its reading.

**Readout:** frequency · segment Ω · ECW/TBW ratio (normal 0.360–0.390) · phase angle at 50 kHz.

**Truth:** truth pack §2 and the page copy in `reference/site-copy.md`.

### Figure 3: IV iron, the depot with a gate

**The idea in one line:** Hepcidin is the body's iron gatekeeper. It shuts the export doors (ferroportin) in the gut and in the storage cells. Each oral iron dose raises hepcidin for about a day, so daily pills partly lock their own door. IV iron skips the gut dock and loads the storage depot directly, which then releases iron to the transport carts that feed the bone marrow.

**Machine:** a small isometric rail yard.
- **Gut loading dock:** a turnstile (ferroportin) with a gate arm. A hepcidin gauge sets the arm's position.
- **Transport:** transferrin as rail carts that each carry **two** iron ingots. That's true: transferrin binds 2 Fe³⁺.
- **Storage:** a ferritin warehouse or silo with a fill gauge.
- **Bone marrow:** a stamping press that turns out red discs (red cells), with a haemoglobin counter.
- **IV route:** a tanker that drives straight to the warehouse, because macrophages take up the iron-carbohydrate complex.

**Controls:** a mode selector for *Daily pills / Alternate-day pills / IV infusion*, plus a day scrubber (about day 0 → week 8, matching the clinic's 6–8 week recheck).

**Readout:** day · hepcidin (relative) · ferritin µg/L · Hb g/L.

**Truth:** truth pack §3. Ferritin and Hb curves are a *typical pattern*, and the caption must say the NP confirms with bloodwork. The page sells "one visit restores most adults" and names Monoferric (ferric derisomaltose). Keep the model consistent with that product's dosing.

**Watch out for:** don't trash oral iron. The page itself says pills are "the right first step for many people."

### Figure 4: Creator 600, the runner rig (Hero)

**The idea in one line:** Your hips and knees absorb every landing, and how much they take depends on cadence and where your foot lands relative to your body. The Creator 600 sees you as a set of joints and shows it.

**Machine:** the real Visbody Creator600 (`reference/equipment/creator600-*`): commercial deck and belt with the red side accent, a 32″ upright display on its post, a side touch panel and a handrail console. On the belt runs the **mannequin** (`shared/mannequin.mjs`) with ball joints, each carrying a tracking dot. The upright display shows the live skeleton, drawn in the plane of the screen. Also on the rig:
- Load lamps for L/R hip and L/R knee (low / medium / high)
- A knee-angle trace
- A vertical-oscillation ruler behind the runner
- A plumb line from the centre of mass, with a foot-strike marker showing overstride distance
- A cadence counter

**Controls:** a cadence slider, roughly 150 → 185 spm at a fixed pace. Raising cadence shortens stride, cuts bounce, brings the foot strike under the body and drops the knee and hip load lamps by the published percentages in truth pack §4. That's the page's own coaching message ("a modest cadence increase of 5–10%…").

**Readout:** spm · stride m · vertical ratio % · knee load (relative).

**Model:** a parametric gait cycle (hip and knee angle curves against phase, using the truth-pack values at initial contact and peak stance), with step length = speed ÷ cadence.

**3D mode:** no. Public pages and phones, and the kit's 3D is beta. A WebGL layer isn't needed.

### Figure 5: VO2max, the ramp and the cart (Hero)

**The idea in one line:** In a ramp test, the oxygen you use climbs by about 10 ml/min for every watt until it can't climb any more. That ceiling is your VO2max, one of the strongest predictors of how long you live.

**Machine:** the mannequin (reuse it) on a **bike ergometer**: flywheel with brake magnets, crank and power head. A face mask runs a hose and sample line to an open **metabolic cart**: a flow turbine that spins each breath, O₂ and CO₂ sensor cells, a mixing chamber or breath-by-breath sampler, and a screen showing the live VO2 trace drawn in its plane.

**Controls:** start/scrub the ramp, plus a fitness slider that sets the VO2max ceiling and shows the age/sex percentile (FRIEND cycle norms).

**Readout:** W · HR · VO2 ml/kg/min · RER.

**WebGL:** one layer, breath vapour pulsing down the hose in time with the breaths.

**Truth:** truth pack §5 (ramp design, plateau and RER criteria, Fick, FRIEND percentiles, Mandsager 2018).

**Blocked on:** which metabolic cart, mask and bike Optimal actually uses (see §7). Until Peter answers, draw a **generic lab-grade** cart and ergometer that imitates no brand. The images in `reference/equipment/vo2max-*-STOCK.*` are **stock photos**, not Optimal's gear. Use them only for rough mood (mask shape, how the hose routes).

---

## 4. Design rules specific to Optimal

- **Theme:** Cream (light) is the primary, because the site is cream (`#FFFCF7`). Forest night (dark) is for the exam-room TV. Both ship, and the tokens are in `shared/optimal-theme.css`.
- **Colour:** the world stays cream/bone and ink. The single "lit" part is forest green (`#2C4E25`). Use other colour **only when colour is the subject** (heat in Fig 1, red cells in Fig 3). That's both the kit's rule and the ALE spec's rule.
- **Type:** card titles in **Castoro** and readouts in **Public Sans** with tabular numbers (load both from Google Fonts in the page head). The kit's mono stays for plate corners.
- **Consistent scale** across the set so the five sit together as one family.
- **Bar:** compare your PNG to `examples/test-rig` and `examples/raptor-engine`. At 1× it should read as one clear real object, and at 4× every region should still have something true to find.

## 5. Where these go later (not in scope here)

The real site is `BeOptimal/beoptimal-landing` (Vite + React + Tailwind, yarn), a different repo and org. Integration is a **separate handoff**. In this repo, also emit an embeddable build per figure (either a custom element `<optimal-fig-<slug>>` or a self-mounting script) so it can be dropped into a React page later. Document the embed snippet in each `NOTES.md`.

## 6. Repo, branches, deploy

- Work on `main` or a branch per figure (`fig/01-menopause-thermostat`), whichever your session prefers. Commit at each milestone with a descriptive multi-line message ending `Co-Authored-By: Claude <noreply@anthropic.com>`. When a figure meets §2, merge to `main` so Pages updates.
- **GitHub Pages:** `.github/workflows/pages.yml` runs `node scripts/build-all.mjs` on every push to `main` and publishes `dist/`. The gallery lives at **https://optimal-research-team.github.io/optimal-anatomy-figures/**. If Pages isn't enabled yet, the first workflow run will fail on deploy. Tell Peter so he can enable it under Settings → Pages → Source: GitHub Actions. Don't try to work around it.
- Never commit secrets. These figures carry **no patient data**: synthetic, textbook numbers only.

## 7. Open questions for Peter

1. **VO2 equipment:** what are the metabolic cart, mask and bike ergometer (brand and model, or phone photos of each)? The floor plan shows the "VO2 max machine" on the built-in storage in Exercise Room 8, and the Performance package offers treadmill **or** bike.
2. **Fig 1 control:** should the menopause figure show treatment options (estrogen therapy, NK3 blocker), or the mechanism only?
3. **Fig 3 home:** where does the IV iron page live once it launches, beoptimal.ca or a standalone landing? This decides the embed format.
4. Who signs off medical accuracy before these go public? (The Menopause Protocol is the compliance-reviewed flagship. Stay consistent with it.)

## 8. Kickoff prompt (paste into the cloud session)

> Read HANDOFF.md and CLAUDE.md in this repo, then run `bash scripts/setup-cloud.sh`. Use the Anatomy skill in `.claude/skills/anatomy/`. Build the five figures in the order in HANDOFF §1, starting with Figure 1 (menopause thermostat). Size it, state the one-sentence mapping and parts list, then build until it meets every item in HANDOFF §2. Commit, push, and give me the gallery link with phone and desktop screenshots before moving to Figure 2.
