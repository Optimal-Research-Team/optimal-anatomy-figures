# A9 · Digging and filling (bone remodelling and estrogen)

**What it is:** one strut of spongy bone (a trabecula) lying in marrow, cut lengthwise. Hand-drawn organic SVG in the A-series style:
- inside the bone: lamellae, osteocytes in lacunae with canaliculi, and the scalloped cement lines of old repairs;
- flat lining cells on both surfaces;
- the marrow: fat cells, blood-forming cells and a sinusoid.

It completes the Menopause set: A2 (brain switch) → Fig 1 (thermostat) → A3 (finger valves) → A9 (bone).

**Mapping in one sentence:** remodelling sites start along the top surface at random, at `remodelOf(e).perYear`. Each follows `depthAt(age, fill)`:
1. a multinucleated osteoclast with a ruffled border digs a scooped cavity (21 days);
2. reversal cells (10 days);
3. a row of osteoblasts lays pale osteoid that refills it (90 days).

Whatever isn't refilled stays as a permanent dip, and the cavity floor stays as a new cement line. The readout is the strut's bone area against the start.

## Numbers (truth pack, "A9")

| | Pre-menopause (e = 1) | Post-menopause (e = 0) |
|---|---|---|
| New sites a year (drawn surface) | 3.6 | 9 |
| Share of each cavity refilled | 100 % | 90 % |
| Sites open at once (average) | ≈ 1.2 | ≈ 3.0 |
| Model loss | ≈ 0 %/yr | ≈ 1.7 %/yr, plus the open remodelling space |
| After 3 years | ≈ 100 % | ≈ 92–95 % (sites start at random, so each run differs) |

Calibration targets are SWAN's ≈ 2–2.5 %/yr at the spine (1.8 % at the femoral neck) in the fastest window, and ≈ 6–7 % over the 3 years around the final period. The phase lengths are sourced. Site counts and the refill shortfall are ILLUSTRATIVE, chosen to land on those rates; their directions are sourced (activation frequency up, formation lagging resorption).

## Decisions

- **No fracture-risk numbers, no treatment.** The caption says density is one factor among several in fracture risk and that the figure shows mechanism only (BACKLOG: "no fracture-risk promises").
- **"Loss slows after that"** is stated without a number. SWAN's slower post-transition rates weren't pulled into this pack.
- **Estrogen** is drawn as amber hexagons in the marrow, as in A2, scaling with e.
- **Only the top surface remodels.** The bottom surface is lined but held still, to keep one moving front to watch.

## Interaction

- **Pre-menopause / Post-menopause** (radiogroup, arrow keys, 44 px). Each run covers 3 years at 30 days a second (about 37 s) and holds 2.5 s. The idle tour alternates the two states each run.
- **Offscreen:** rendering stops out of view.
- **Reduced motion:** one still two years in.

## Verification (2026-10-12)

- No console errors.
- No sideways scroll at 390, 360 or 320, in both themes.
- `lines.mjs`: 0 (no kit lines).
- Captures: `shots/phone-{390,360,320}-{dark,light}.png` (post-menopause, about year 0.8), `shots/desktop-{dark,light}.png` (pre), `shots/desktop-post-{dark,light}.png` (post, about year 2.8), `shots/reduced-390-*.png` (post, year 2), `shots/embed.png`.

## Embed

```html
<script src="https://optimal-research-team.github.io/optimal-anatomy-figures/a9-bone-remodelling/embed/optimal-fig-bone-remodelling.js" defer></script>
<optimal-fig-bone-remodelling theme="light"></optimal-fig-bone-remodelling>
```

## Open for Peter

1. **Must match the Menopause Protocol** (BACKLOG). The protocol text isn't in this repo; please check the caption against it, especially "Loss slows after that" and the SWAN numbers.
2. **A hormone-therapy state** (estrogen back, sites fewer) would show the mechanism of protection. It's held back for the same Q2 regulatory call as Fig 1's treatment switch.
