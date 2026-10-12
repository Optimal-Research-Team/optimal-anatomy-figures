# Where each figure goes on beoptimal.ca

**Scanned:** 2026-10-12, the live site in a browser, plus the site's router (`BeOptimal/beoptimal-landing`, `src/App.tsx` at `0f36c00`). The site is client-rendered, so each page was read as rendered.

**Pages scanned:**
- home;
- `/membership`;
- `/services/menopause-and-perimenopause-care`;
- `/optimal-menopause-protocol` (free protocol);
- `/optimal-longevity-protocol` (free protocol; not in the sitemap);
- `/services/vo2-max-testing`;
- `/services/creator-600`;
- `/services/inbody-580`;
- `/services/hyperbaric-oxygen-therapy`;
- `/journal` and its one post, `/journal/vo2max-and-longevity`.

There is no IV iron page yet.

**Rule of thumb:** at most two figures on a page, each placed right where the copy explains the thing the figure shows. On phones (about 80 % of visitors), each figure is a full-width card between sections, never side by side.

## The map

| Fig | Figure | Primary home | Exact spot | Also good for |
|---|---|---|---|---|
| 1 | The narrowing thermostat | **Menopause Protocol** | Top of **§5 Hot flashes and night sweats, day to day**, before "Evidence at a glance": why a flash happens, then what helps | Menopause care page, "It's not in your head" (under the hot flashes symptom) |
| A3 | The finger's heat valves | **Menopause Protocol** | **§5**, right after Fig 1: the inside view of the same flash | §2 Eight symptom domains, "Temperature" |
| A2 | The hot-flash switch | **Menopause Protocol** | **§14 Options we discuss, side by side**. Its states (Before / After / Hormone therapy / Non-hormonal) match the options table, with the same "not treating is always an option" wording | n/a (keep treatment content off the sales page) |
| A9 | Digging and filling (bone) | **Menopause Protocol** | **§3 Why bone and heart are part of the conversation**, right after the Greendale bone-density chart: the mechanism behind its numbers. The figure quotes the same Greendale 2012 figures | Longevity Protocol §10 Body composition and bone (women) |
| 2 | Five cylinders on a bridge | **InBody 580** | Between **"Beyond the scale"** and **"Your result sheet, decoded"**: how the scan reads you (four frequencies, five segments) | Longevity Protocol §10, in place of the "InBody 580 bioimpedance scan, in clinic" photo |
| A8 | Water in and around the fibres | **InBody 580** | Directly after **"Your result sheet, decoded"**: what the ECW ratio (0.360–0.390) is measuring, and why a high ratio doesn't say why | Longevity Protocol §10, next to the InBody sheet |
| 4 | The runner rig | **Creator 600** | After **"Six measures, one run"**: cadence and foot strike change the hip and knee load the report rates | n/a |
| A7 | The kneecap's load | **Creator 600** | In **"After the run"**, beside report page 01 Dynamic joint load and 02 Knee motion angle: inside the knee on each landing | n/a |
| 6 | The treadmill ramp | **VO₂ max testing** | **01 — The test**, after the four steps: "effort increases at regular increments until your maximal effort", shown on the Creator 600 | n/a |
| 5 | The ramp and the mask (bike) | **VO₂ max testing** | **02 — Equipment**, under the Wahoo KICKR Bike Shift card (or a Treadmill / Bike toggle with Fig 6) | Longevity Protocol §1.2 VO₂ max, in place of the "metabolic mask on a stationary bike" stock photo |
| A4 | The beating heart | **VO₂ max testing** | **Why measure it**, after "the maximum rate your body can take in and use oxygen": the delivery side (output = beats × millilitres per beat) | Journal post (below) |
| A5 | The air sac and the red cell | **Journal: "What is VO2max…"** | After **"What is VO2max and why does it matter…"**, with A4: oxygen loading takes a quarter-second, and the lungs are rarely the limit | VO₂ max FAQ, "How is this different from my watch's estimate?" |
| 3 | The depot with a gate | **IV iron page (when it launches)** | The hero explainer: why pills stall at the gut gate and IV goes around it | n/a |
| A1 | The gut cell's gate | **IV iron page** | Under Fig 3, as the close-up of the gate (hepcidin pulling ferroportin in) | n/a |
| A6 | The red cell's 120 days | **IV iron page** | "After your infusion": ferritin jumps in days, haemoglobin climbs over weeks; matches the 6–8 week recheck | **Now:** Longevity Protocol **§20 Women's nutrition**, next to "check ferritin, not just hemoglobin" |

**No figure:** home (keep the service cards clean; a figure strip could come later), `/membership`, hyperbaric oxygen therapy (no figure fits; A5 shows oxygen carried on red cells, while HBOT works mostly through oxygen dissolved in plasma, so using it there would mislead), privacy and referral.

## Per page, in reading order

- **Menopause Protocol** (the richest page for figures, and compliance-reviewed): §3 → A9; §5 → Fig 1, then A3; §14 → A2.
- **Menopause care** (sales): at most Fig 1 under the symptoms list. The mechanism lives in the Protocol; link "How a hot flash works →" from here.
- **InBody 580:** Fig 2, then A8 after the decoded sheet.
- **Creator 600:** Fig 4 after "Six measures", A7 in "After the run".
- **VO₂ max testing:** A4 in "Why measure it", Fig 6 in "The test", Fig 5 in "Equipment".
- **Longevity Protocol:** §1.2 → Fig 5; §10 → Fig 2 (and A8 or A9); §20 → A6.
- **Journal, VO2max post:** A4 + A5 after the definition.
- **IV iron page (future):** Fig 3, A1, A6.

## How to embed

Each figure is one script that defines a custom element in a shadow root, so the site's Tailwind can't reach it:

```html
<script src="https://optimal-research-team.github.io/optimal-anatomy-figures/<folder>/embed/optimal-fig-<slug>.js" defer></script>
<optimal-fig-<slug> theme="light"></optimal-fig-<slug>>
```

- The host page loads Castoro and Public Sans (the site already uses Public Sans).
- **Lazy-load.** Each script is 95–415 KB (28–91 KB gzipped) because it carries the drawing kit. Inject the `<script>` when the placeholder nears the viewport (IntersectionObserver), and reserve the card's height so nothing jumps.
- Use `theme="light"` (Cream) on the site. `theme="dark"` (Forest night) is for the exam-room TV.
- Every figure's NOTES.md has its exact snippet. For production, copy the scripts into the site's own `public/` rather than hot-linking GitHub Pages.

## Copy fixes the scan turned up

1. **Creator 600:** "32″ upright display" should be **50″** (Peter, 2026-10-12; Visbody lists a 50″ LG 4K vertical display).
2. **Creator 600:** "Steps per minute … against the 180 spm benchmark". The evidence supports a 5–10 % change from your own rate, not a fixed 180 (Fig 4 NOTES, open issue 3). Fig 4's caption says so, and the page will contradict it if both stay.
