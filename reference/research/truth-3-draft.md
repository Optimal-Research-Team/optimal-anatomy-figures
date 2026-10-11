> **DRAFT, not yet reviewed.** Research notes for Fig 3, gathered 2026-10-11 from web-search extracts (the session's network policy blocked PubMed/PMC, Crossref, Health Canada and manufacturer sites, so no source was opened directly). Reviewed values move into `../truth-pack.md` when the figure is built.

## 3. IV iron vs oral iron

> **How this was checked (read first).** In this session WebFetch could not resolve any host, and the egress proxy blocked PubMed, PMC, Europe PMC, ASH and `pdf.hres.ca`. So **no full text was opened.** Values marked **[S]** were checked against search-engine extracts of the primary paper, label or abstract, and where possible two independent extracts agreed. Values marked **[K]** come from well-established domain knowledge whose source I'm confident exists, but I did **not** re-open the source in this session. They're capped at MEDIUM, or LOW if the exact number is uncertain. The web-search budget ran out before every [K] item could be upgraded. Before publishing, open the Health Canada Monoferric monograph (source 12) and FERWON-IDA (source 6) and confirm the rows flagged ⚑.

**Mechanism in 3 sentences.**
Hepcidin, a liver hormone that rises when iron stores fill or inflammation (IL-6) flares and falls when the marrow is iron-hungry, binds the iron exporter ferroportin, plugging it and making the cell internalise and destroy it, so iron export stops both from gut cells and from the macrophages that recycle old red cells. Each oral dose of about 60 mg or more raises hepcidin for roughly a day, so the next morning's pill is absorbed about 35–45% less well, which is why alternate-day dosing (gate reopened) absorbs more per pill. IV ferric derisomaltose skips the gut: liver and spleen macrophages take up the iron–carbohydrate complex within days and feed it out to transferrin (two Fe³⁺ per molecule) and on to the marrow, so serum ferritin jumps within a week while haemoglobin climbs over the next 4–8 weeks.

### Model numbers

**A. Body iron and daily flows**

| Quantity | Value | Units | Source | Confidence |
|---|---|---|---|---|
| Total body iron, adult man | ~3.5–4 (≈50 mg/kg) | g | [K] Andrews 1999 (28); Camaschella 2015 (29) | MEDIUM |
| Total body iron, adult woman | ~2.5 (≈35–40 mg/kg), lower when iron-deficient | g | [K] Andrews 1999 (28); Bothwell classic texts | MEDIUM |
| Haemoglobin (circulating RBC) iron | ~1.8–2.5 g, ≈65–70% of body iron | g | [K] Andrews 1999, Fig 1 (RBC ~1800 mg) (28) | MEDIUM |
| Iron per gram of Hb | 3.47 (4 Fe × 55.85 / ~64,500 g/mol) | mg/g | Stoichiometry (derived) | HIGH |
| Iron per mL packed RBC | ≈1.1 (MCHC ~330 g/L × 3.47) | mg/mL | Derived | HIGH |
| Iron per mL whole blood at Hb 105 g/L | 0.36 | mg/mL | Derived (0.105 g/mL × 3.47) | HIGH |
| Model woman (65 kg, 65 mL/kg, Hb 105): Hb iron | 1.54 (rises to 1.94 at Hb 132) | g | Derived; blood volume 65 mL/kg [K] textbook | MEDIUM |
| Storage iron (ferritin + haemosiderin), men | ~1 (liver ~1000 mg, RE macrophages ~600 mg in Andrews' figure) | g | [K] Andrews 1999 (28) | MEDIUM |
| Storage iron, women | ~0.3–0.5 g; near zero when ferritin <15 | g | [K] Bothwell/Finch; Walters 1973 (30) | MEDIUM |
| Storage iron per 1 µg/L serum ferritin | ≈8 (some sources 8–10). **Not valid after IV iron or with inflammation** | mg | [K] Walters, Miller & Worwood 1973 (30) | MEDIUM |
| Myoglobin + enzymes | ~0.3 | g | [K] Andrews 1999 (muscle 300 mg) (28) | MEDIUM |
| Transferrin-bound plasma pool | ~3 (≈2.6 L plasma × ~1 mg/L serum iron); <1 mg in IDA | mg | [K] Andrews 1999; derived check | MEDIUM |
| Plasma pool turnover | ~25–30 mg/day through a 3 mg pool, so it turns over ≈8–10×/day | — | Derived from recycling + absorption | MEDIUM |
| Fe³⁺ per transferrin molecule | 2 (one per N- and C-lobe, each with a synergistic carbonate) | atoms | [K] Gkouvatsos et al. 2012 (44) | HIGH (fact) / MEDIUM (citation) |
| Normal TSAT | ~20–45%; in IDA usually <20% and often <10% | % | [K] Camaschella 2015 (29) | MEDIUM |
| Daily dietary absorption | ~1–2 | mg/day | [K] Andrews 1999 (28) | MEDIUM |
| Daily basal loss (gut, skin, urine) | ~1–2 | mg/day | [K] Andrews 1999 (28) | MEDIUM |
| Menstrual loss | average ~30–40 mL blood/cycle ≈ 0.4–0.5 mg Fe/day; >80 mL/cycle = heavy menstrual bleeding (≥1 mg/day extra) | — | [K] Hallberg 1966 (42); iron per mL derived above | MEDIUM |
| Macrophage recycling of senescent RBC iron | ~20–25 (check: 150 g/L × 5 L × 3.47 / 120 d ≈ 22). Model woman ≈13 mg/day at Hb 105 | mg/day | [K] Hentze 2010 (47); Camaschella 2015 (29); derived | HIGH (derived) |
| Red-cell lifespan | ~120 | days | [K] Franco 2012 (45) | HIGH (fact) / MEDIUM (citation) |

**B. Hepcidin–ferroportin gate**

| Quantity | Value | Units | Source | Confidence |
|---|---|---|---|---|
| Hepcidin binds ferroportin, which is internalised and degraded, so cellular iron export stops | mechanism | — | [K] Nemeth et al., Science 2004 (24) | HIGH (fact) / MEDIUM (citation) |
| Hepcidin also occludes the ferroportin channel directly, a second mechanism alongside endocytosis | mechanism | — | [K] Aschemeyer et al., Blood 2018 (26); Billesbølle et al., Nature 2020 (48) | MEDIUM |
| Ferroportin sites gated: duodenal enterocyte (basolateral), macrophages (spleen, liver Kupffer cells), hepatocytes | — | — | [K] Nemeth 2004 (24); Hentze 2010 (47) | HIGH (fact) |
| Inducers: iron (BMP6–SMAD) and inflammation (IL-6 → STAT3) | — | — | [K] Nemeth et al., JCI 2004 (IL-6) (25) | HIGH (fact) / MEDIUM (citation) |
| Suppressors: iron deficiency, active erythropoiesis (erythroferrone, ERFE), hypoxia | — | — | [K] Kautz et al., Nat Genet 2014 (27) | MEDIUM |
| Hepcidin is often near-undetectable in IDA, so the gut gate is wide open | qualitative | — | [K] general literature (29) | MEDIUM |

**C. Oral iron: absorption and the 24 h hepcidin echo**

| Quantity | Value | Units | Source | Confidence |
|---|---|---|---|---|
| Moretti 2015 population | 54 non-anaemic young women, plasma ferritin ≤20 µg/L; labelled FeSO₄ at 8:00 fasting | — | [S] Moretti 2015 abstract (1) | HIGH |
| Doses tested | 40, 60, 80, 160, 240 | mg Fe | [S] (1) | HIGH |
| Effect 24 h after a dose ≥60 mg | serum hepcidin ↑; fractional absorption of the next dose ↓ **35–45%** (P<.01) | — | [S] (1) | HIGH |
| Dose vs amount absorbed | 6× dose (40→240 mg) → only ~2.7× absorbed (**6.7→18.1 mg**), i.e. FIA ≈16.8% → 7.5% | mg | [S] (1); % derived | HIGH |
| Twice-daily / split dosing | 3 doses within 24 h (2 mornings + 1 afternoon) absorbed no more than 2 morning doses; twice-daily raised hepcidin more | — | [S] (1); Stoffel 2017 study 2 (2) | HIGH |
| Hepcidin back to baseline | by ~48 h after the dose | h | [S] Haematologica 2024 review summarising Moretti (4) | MEDIUM |
| Stoffel 2017 study 1 design | 40 iron-depleted women, 60 mg Fe (FeSO₄) at 8:00 ± 1 h: 14 consecutive days (n=21) vs 14 doses on alternate days over 28 days (n=19) | — | [S] Stoffel 2017 (2), via 2 summaries | HIGH |
| Cumulative fractional absorption (14 doses) | **16.3% consecutive vs 21.8% alternate** (P=0.0013) | % | [S] (2) | HIGH |
| Cumulative iron absorbed (14 doses) | **131.0 mg consecutive vs 175.3 mg alternate** (P=0.0010) | mg | [S] (2) | HIGH |
| Same numbers per calendar day | consecutive 131 mg / 14 d ≈ 9.4 mg/d; alternate 175 mg / 28 d ≈ 6.3 mg/d | mg/day | Derived from (2) | HIGH |
| Stoffel 2017 study 2 | 120 mg once vs 60 mg twice daily (n=20, crossover): absorption no different; hepcidin higher with split dosing (P=0.013) | — | [S] (2) | HIGH |
| Stoffel 2020 (women **with IDA**, n=19, mean ferritin ~10 µg/L) | 100 or 200 mg FeSO₄ at 8:00; FIA **40–50% higher** on the first day and on alternate days than on the second consecutive day. 200 mg alternate-day absorbed ≈ **2×** 100 mg consecutive-day; FIA from 200 mg < from 100 mg. More nausea/epigastric pain at 200 mg | — | [S] Stoffel 2020 (3) | HIGH |
| Typical Canadian tablet | ferrous sulfate 300 mg ≈ 60 mg elemental; ferrous gluconate 300 mg ≈ 35 mg; ferrous fumarate 300 mg ≈ 100 mg | mg Fe | [K] standard pharmacology | MEDIUM ⚑ check product labels |
| Oral responder definition | Hb ≥10 g/L rise by day 14; ~73% of 738 oral-arm subjects in 5 RCTs; predicts sustained response (sens 90.1%, spec 79.3%, PPV 92.9%) | g/L | [S] Okam, Koch & Tran 2016 (5) | MEDIUM |
| Day-14 response by cause | postpartum **95.5%** vs heavy uterine bleeding **56.3%** | % | [S] (5) | MEDIUM |
| Alternate-day vs daily outcomes | absorption per dose is higher with alternate-day dosing. Hb outcomes are mixed: an RCT found no difference in clinically meaningful Hb rise (21); a 2025 meta-analysis reports daily gave greater haematological improvement (23); alternate-day had fewer GI effects in iron-depleted women (22) | — | [S] titles/abstracts (21–23) | MEDIUM |
| Oral iron needs time after Hb normalises to refill stores | continue ~3 months after Hb normalises | months | [K] BSG guideline, Snook 2021 (40) | MEDIUM |

**D. IV iron: Monoferric (ferric derisomaltose, FDI) and iron sucrose**

| Quantity | Value | Units | Source | Confidence |
|---|---|---|---|---|
| Canadian monograph version | Monoferric PM revised **29 Jan 2025** (initial authorisation 22 Jun 2018); Pfizer Canada ULC (importer), Pharmacosmos (manufacturer) | — | [S] PM metadata (12) | MEDIUM ⚑ |
| **Canadian indication** | IDA in **adults who are intolerant of, or unresponsive to, oral iron** (anaemia, not iron deficiency without anaemia) | — | [S] PM (12), two extracts agree | MEDIUM-HIGH ⚑ |
| Max single dose | **≤20 mg Fe/kg** per infusion; single doses **>1500 mg not recommended** | mg | [S] PM (12); Transfusion Ontario (15); CHEO manual (16) | MEDIUM ⚑ |
| Total dose: simplified table (Monofer/Monoferric label family) | Hb ≥100 g/L: 50–<70 kg **1000 mg**, ≥70 kg 1500 mg. Hb <100 g/L: 50–<70 kg 1500 mg, ≥70 kg 2000 mg. <50 kg: weight-based (20 mg/kg). Doses above the single-dose cap are split ≥7 days apart | mg | [S] AU/NZ PI and Canadian hospital monographs (14, 16) | MEDIUM ⚑ confirm Canadian table |
| Total dose: Ganzoni alternative | deficit (mg) = weight (kg) × (target Hb − actual Hb) (g/dL) × 2.4 + stores (500 mg if ≥35 kg). The model woman (65 kg, 10.5 → 13.0 g/dL) ≈ **890 mg**; with target 15 g/dL ≈ 1200 mg | mg | [K] Ganzoni 1970 (31); the label permits it [S] (14) | MEDIUM |
| **Model dose** | **1000 mg once** (65 kg, Hb 105 g/L: simplified-table cell; 15.4 mg/kg, under the 20 mg/kg cap) | mg | Derived from rows above | MEDIUM |
| US label (contrast) | ≥50 kg: 1000 mg single IV infusion over **≥20 min**; <50 kg: 20 mg/kg | — | [S] FDA PI (13) | HIGH |
| Canadian infusion time | ≥**20 min** for ≤1000 mg; ≥**30 min** for >1000 mg (older PM wording) | min | [S] PM extract (12) | MEDIUM ⚑ |
| Post-dose observation | BP and pulse during infusion and for **≥30 min after** each administration; resuscitation equipment and trained staff available | min | [S] PM extract (12); [K] EMA 2013 class recommendation (43) | MEDIUM ⚑ |
| Visit length check | IV start + ≥20 min infusion + ≥30 min observation ≈ **60–90 min**, consistent with the site copy | min | Derived | MEDIUM |
| Plasma half-life of FDI | ~**27 h** (cleared to the reticuloendothelial system within days) | h | [S] Davis Drug Guide citing US PI (17) | MEDIUM |
| Uptake route | taken up by RES cells (liver, spleen); iron released slowly, bound to ferritin/haemosiderin or exported to transferrin | — | [S] TGA PI (14) | HIGH |
| Serum ferritin peak after FDI | ≈**7 days** after a single dose; back to "stable" ~4 weeks | days | [S] label-derived drug summaries (14, 17) | MEDIUM |
| Ferritin magnitude after FDI | max mean **~517 ng/mL at week 2**, falling to **<250 after week 5** (Japanese GI-IDA cohort) | µg/L | [S] Kawabata et al., Int J Hematol 2022 (18), one extract only | LOW-MEDIUM ⚑ |
| Ferritin peak timing, older IV iron | iron dextran: peak **7–9 days**, then steady decline | days | [S] Ann Clin Biochem 1981 (19) | MEDIUM |
| Hb rise after FDI 1000 mg | FERWON-IDA (n=1512, 2:1 FDI 1000 mg vs iron sucrose): mean ΔHb at week 8 ≈ **+2.49 g/dL (+24.9 g/L)**; FDI faster in weeks 1–2; no difference by week 4 | g/L | [S] FERWON-IDA (6); ΔHb from a trade-press summary | MEDIUM ⚑ |
| FDI vs oral iron (CKD, oral 200 mg/day × 8 wk) | FDI non-inferior at week 4; **superior Hb from week 3 to week 8** | — | [S] Kalra 2016 (11) | HIGH (direction) |
| FCM vs oral in heavy uterine bleeding | Hb ≥20 g/L rise **82% vs 62%** (FCM, a different IV iron; oral 325 mg FeSO₄ TID) | % | [S] secondary citation of Van Wyck 2009 (20) | LOW-MEDIUM |
| Iron sucrose (contrast) | **200 mg per injection, up to 5 visits in 2 weeks** to reach ~1000 mg | mg | [S] FERWON-IDA comparator arm (6) | HIGH |
| Assay caveat | iron indices are unreliable in the first ~24 h (serum iron) and ferritin within ~4 weeks after IV iron | — | [S] (14, 18); [K] US PI | MEDIUM |

**E. Thresholds**

| Quantity | Value | Units | Source | Confidence |
|---|---|---|---|---|
| WHO anaemia cut-offs, non-pregnant women 15–65 y | Hb **<120** | g/L | [K] WHO 2024 Hb guideline (33) | HIGH (value) / MEDIUM (citation) |
| WHO anaemia cut-offs, men 15–65 y | Hb **<130** | g/L | [K] WHO 2024 (33) | HIGH / MEDIUM |
| WHO ferritin cut-off, apparently healthy adults | **<15** µg/L = iron deficiency; **<70** with infection/inflammation | µg/L | [K] WHO 2020 ferritin guideline (32) | HIGH / MEDIUM |
| Commonly used clinical cut-off | ferritin **<30** µg/L (sensitivity ~92%, specificity ~98% for absent marrow iron) | µg/L | [K] Mast et al. 1998 (38) | MEDIUM |
| AGA (US GI) guideline, anaemic patients | ferritin **<45** ng/mL | µg/L | [K] Ko et al. 2020 (39) | MEDIUM |
| TSAT threshold | **<20%** supports iron deficiency | % | [K] Camaschella 2015 (29) | MEDIUM |
| Canadian lab lower limits | many Canadian lab ferritin reference intervals put the lower limit well below 30 (often ~5–15 µg/L). A Toronto-led systematic review found these limits rest on weak derivations and argues for higher thresholds | µg/L | [K] Truong et al., Lancet Haematol 2024 (41) | LOW ⚑ verify before quoting |
| Ontario/Canadian lab threshold changes 2023–25 | **not verified this session**; don't cite in the figure | — | — | UNVERIFIED |

**F. Side effects (honest framing)**

| Quantity | Value | Units | Source | Confidence |
|---|---|---|---|---|
| Oral ferrous sulfate GI side effects | OR **2.32** (95% CI 1.74–3.08) vs placebo; OR **3.05** (2.07–4.48) vs IV iron | OR | [K] Tolkien et al., PLoS One 2015 (34) | MEDIUM |
| Higher oral dose → more GI effects | nausea/epigastric pain 12 cases in 8 women at 200 mg vs 5 in 5 at 100 mg | — | [S] Stoffel 2020 (3) | HIGH |
| Serious or severe hypersensitivity, FDI | **0.3%** (95% CI 0.06–0.88) vs iron sucrose 0.4% (0.05–1.45) | % | [S] FERWON-IDA (6, 7) | HIGH |
| Minor infusion reaction ("Fishbane"): flushing, chest/back tightness, myalgia, with no hypotension, wheeze or stridor; self-limiting; antihistamine premedication not advised | qualitative | — | [K] Fishbane 1996 (36); Rampton et al. 2014 (35) | MEDIUM |
| Hypophosphataemia (<2.0 mg/dL) within 35 d | **FDI 8.0% vs ferric carboxymaltose 74.4%** (pooled PHOSPHARE-IDA); still present at day 35: 0.9% vs 43.0% | % | [S] Wolf et al., JAMA 2020 (8), via 2 extracts (10) | HIGH (pooled) |
| Per-trial PHOSPHARE-IDA | 7.9% vs 75.0% (trial A); 8.1% vs 73.7% (trial B) | % | [K] (8) | MEDIUM |
| PHOSPHARE-IBD | FDI 8.3% vs FCM 51.0% | % | [S] Zoller et al. (9) | HIGH |
| Skin staining | brown discolouration after leakage at the IV site; can be long-lasting. The PM's 2025 revision updated skin warnings | — | [S] PM revision list (12); [K] class labelling | MEDIUM |
| Delayed post-infusion symptoms (arthralgia, myalgia, fever, "flu-like"), usually within 1–2 days and self-limiting | qualitative | — | [K] class labelling (13, 14) | LOW-MEDIUM ⚑ |

**G. Prevalence (for page copy only; the figure doesn't need it)**

| Quantity | Value | Units | Source | Confidence |
|---|---|---|---|---|
| Canadian iron status (CHMS 2009–2011) | most Canadians iron-sufficient at ferritin ≥15; deficiency concentrated in teenage girls and women of reproductive age (roughly 1 in 10 at the <15 cut-off) | % | [K] Cooper et al., Health Reports 2012 (37) | LOW ⚑ |
| US females 12–21 y (NHANES 2003–2020) | iron deficiency (ferritin <25) **~39%**; IDA ~6% | % | [K] Weyand et al., JAMA 2023 (46) | LOW-MEDIUM |
| Site claim "about 1 in 4 women of reproductive age have low iron" | **No Canadian source verified.** It's plausible only with a ferritin cut-off around 30 µg/L. Peter should supply the source or soften the wording | — | — | UNVERIFIED ⚑ |

### Equations / curves

**Compartments** (mg of iron). The figure's parts map onto them: gut dock = A, transport carts = L/transferrin, warehouse = S + R, IV tanker = C, press/counter = E.

```
 oral dose ──(FIA·gate)──► L (labile / transferrin-delivered new iron)
 IV dose ──► C (FDI in plasma) ──k_C──► R (RES macrophage, unprocessed) ──k_R──► L
 L ──(marrow demand)──► E (Hb iron; 4-day maturation delay) ──1/120 d──► macrophages ──► marrow   (recycling, net 0)
 L ──(leftover)──► S (storage ferritin)          E ──(ongoing blood loss)──► out
```

**Equations** (hourly Euler steps, t in hours):

- Hb iron: `E = Hb[g/L] × BV[L] × 3.47`, with `BV = 0.065 L/kg × 65 kg = 4.2 L`. So **1 g/L of Hb = 14.7 mg Fe** in the model woman.
- Marrow demand (iron not limiting): `dE*/dt = k_m · (E_set − E*)`, with `k_m = 1/18 d⁻¹` and `E_set` at Hb 132 g/L. Actual uptake = `min(demand, L available)`; circulating E = committed E* delayed 4 days.
- Oral absorption at 08:00: `abs = FIA_max · dose · (dose/60)^(0.554−1) · gate(t)`, `gate = 1/(1 + H)`.
- Hepcidin (relative units; **H = 1 halves absorption**):
  `H(t) = H_base + Σ_i a·abs_i·x_i·e^(1−x_i)`, where `x_i = (t − t_i)/8 h`. Each pulse peaks ~8 h after a dose, is still ~41% of peak at 24 h and ~4% at 48 h.
  `H_base = ((S + R)/400 mg) · (1 − 0.8·gap)`. Stores push it up; marrow hunger (ERFE), via `gap` = the fraction of the Hb deficit still open, holds it down.
- IV: `dC/dt = −k_C·C` (t½ 27 h). `dR/dt = k_C·C − k_R·R` (t½ 21 d). k_R output → L.
- Ferritin read-out: `Ferritin = S/8 + 0.55·R` µg/L. The `0.55·R` term is the ferritin overshoot from freshly iron-loaded macrophages. It explains why ferritin after IV iron reads far above what the "8 mg per µg/L" rule implies, and why it falls back over weeks.
- Ongoing loss: 0.5 mg/day drawn from E (a woman with heavier periods; set to 0 for balanced intake).

**Parameters and why**

| Param | Value | Justification |
|---|---|---|
| FIA_max (hepcidin-free, 60 mg) | 0.23 | **Tuned** so that 14 alternate-day doses absorb 173 mg (20.6%), against Stoffel 2017's 175 mg (21.8%) |
| dose exponent | 0.554 | Moretti 2015: 6× dose → 18.1/6.7 = 2.70× absorbed → ln2.70/ln6 |
| hepcidin pulse a, τ | 0.115 per mg absorbed, 8 h | **Tuned**: the next-day dose is absorbed **38% less** (Moretti 35–45%), 14 daily doses absorb **130 mg (15.5%)** (Stoffel 131 mg, 16.3%), and the gate is back to ~94% open at 48 h (baseline by 48 h, source 4) |
| k_m, lag | 1/18 d⁻¹, 4 d | **Tuned** so IV gives ≈ +10 g/L at 2 wk and ≈ +25 g/L at 8 wk (FERWON-IDA +24.9 g/L at wk 8, with faster gains in wk 1–2) |
| IV t½ in plasma | 27 h | US PI via (17) |
| RES processing t½ | 21 d | **Tuned** to ferritin peak ~day 5–7 (label ~7 d) and **<250 µg/L after week 5** (18) |
| ferritin per mg RES iron | 0.55 µg/L/mg | **Tuned**: peak ≈475 µg/L (source 18 reports ~517 at wk 2) |
| store→hepcidin reference | 400 mg (≈ ferritin 50) | **Assumption** (qualitative physiology [K]); controls how far the gut gate closes after IV iron |
| Hb set point | 132 g/L | **Assumption**: mid-normal for women; gives a total Hb-iron need of ~400 mg, matching the Ganzoni scale |

**Calibration checks** (model with no ongoing loss): next-day absorption −38% (target −35 to −45%). 14 daily doses: 130 mg; 14 alternate-day doses: 173 mg (targets 131 / 175 mg). Share of absorbed oral iron reaching red cells: 74–92% over 8 weeks; isotope studies typically assume ~80–90% [K].

**Model output** (default: 65 kg woman, Hb 105 g/L, ferritin 8 µg/L, 0.5 mg/day net loss. Hb g/L / ferritin µg/L)

| Day | No treatment | Daily 60 mg | Alt-day 60 mg | IV FDI 1000 mg |
|---|---|---|---|---|
| 0 | 105 / 8 | 105 / 8 | 105 / 8 | 105 / 8 |
| 3 | 104.9 / 8 | 104.9 / 8 | 104.9 / 8 | 104.9 / 427 |
| 7 | 104.8 / 8 | 106.8 / 8 | 106.4 / 8 | 107.5 / 467 |
| 14 | 104.5 / 8 | 110.7 / 9 | 108.6 / 9 | 115.2 / 388 |
| 21 | 104.3 / 8 | 114.5 / 9 | 111.5 / 9 | 120.4 / 321 |
| 28 | 104.0 / 8 | 118.2 / 10 | 113.6 / 9 | 123.9 / 269 |
| 35 | 103.8 / 8 | 121.7 / 11 | 116.3 / 10 | 126.2 / 229 |
| 42 | 103.6 / 8 | 124.7 / 12 | 118.5 / 10 | 127.9 / 197 |
| 49 | 103.3 / 8 | 126.8 / 15 | 120.9 / 11 | 129.0 / 172 |
| 56 | 103.1 / 8 | 128.3 / 19 | 123.0 / 11 | 129.7 / 152 |

Iron absorbed by day 56: daily 489 mg, alternate-day 337 mg. Alternate-day at **120 mg** reaches Hb 127.6 / ferritin 18 at day 56. Sensitivity to ongoing loss (0 / 0.5 / 1.5 mg/day), day-56 Hb: daily 129.1 / 128.3 / 126.4; IV 130.4 / 129.7 / 128.3.

**Hepcidin and the gut gate, first 3 days (hours from day 0, dose at 08:00):**

| h | 8 (dose 1) | 16 | 32 (24 h later) | 56 (48 h) |
|---|---|---|---|---|
| Daily: H / gate open | 0.03 / 97% | 1.57 / 39% (peak) | 0.66 / 60% → dose 2 absorbed −38% | 0.49 / 67% |
| Alternate: H / gate open | 0.03 / 97% | 1.57 / 39% | 0.66 / 60% (no dose) | 0.18 / 85% at 48 h → dose 2 near full |
| IV: H / gate open on days 0, 7, 14, 28, 56 | 0.03/97%, 0.95/51%, 1.22/45%, 1.43/41%, 1.53/40% (gut gate partly closes **because the warehouse is now full**, which is normal) | | | |

**What the curves say (the figure's message):**

1. **IV:** ferritin jumps within days (~450–500 µg/L by day 5–7) and settles to ~150–200 at the 6–8 week recheck. Hb rises from week 1 and is near normal by week 6–8. One visit.
2. **Daily pills (if tolerated and taken):** Hb climbs steadily (~+5 g/L at 2 wk, ~+13 at 4 wk, ~+23 at 8 wk) because the marrow takes the iron first. **Ferritin barely moves for 6 weeks** (8 → ~19 at 8 wk). Stores fill only after Hb recovers, so pills are a months-long route to full stores.
3. **Alternate-day:** each pill absorbs ~1.3× better and is easier on the stomach. At the same tablet, the iron delivered per week is lower, so Hb rises somewhat more slowly. Doubling to 120 mg on alternate days roughly matches daily 60 mg.
4. **Untreated with heavy periods:** a slow drift down.

Reference implementation (JS, ~70 lines; drop into `figures/03-iv-iron/model.mjs` and adapt):

```js
// Reference compartment model for Fig 3 (IV vs oral iron). Hourly Euler step, 56 days.
// All "tuned" parameters are marked; everything else is sourced in truth-3.md.
export const P = {
  bw: 65,                // kg, typical adult woman (assumption)
  bvLPerKg: 0.065,       // L/kg blood volume, adult women (textbook, MEDIUM)
  feMgPerGHb: 3.47,      // mg Fe per g Hb (stoichiometry)
  hb0: 105,              // g/L start (brief)
  hbSet: 132,            // g/L Hb the marrow heads for once iron is not limiting (assumption; women's normal ~120-155)
  ferritin0: 8,          // ug/L start (brief)
  mgPerFerritin: 8,      // mg storage Fe per ug/L ferritin (Walters 1973)
  marrowK: 1 / 18,       // /day: fraction of the Hb gap closed per day when iron is not limiting  [TUNED to FERWON-IDA ~+25 g/L by wk 8]
  lagD: 4,               // days from marrow iron uptake to circulating Hb (reticulocyte maturation) [TUNED]
  pillMg: 60,            // mg elemental Fe per dose (ferrous sulfate, Stoffel 2017)
  doseHour: 8,           // 8 am fasting dose
  fiaMax: 0.23,          // hepcidin-free fractional absorption of a 60 mg dose, iron-depleted women [TUNED to Stoffel 2017 alt-day 21.8%]
  doseExp: 0.554,        // absorbed = f(dose^0.554) (Moretti 2015: 6x dose -> 2.7x absorbed)
  hepTauH: 8,            // h, gamma-kernel time constant: ~41% of peak at 24 h, ~4% at 48 h (Moretti 2015: raised at 24 h, baseline by 48 h) [TUNED]
  hepPerMgAbs: 0.115,    // pulse peak (in K units) per mg absorbed [TUNED: next-day FIA down ~38% (Moretti 35-45%)]
  storeRefMg: 400,       // stores (S+R) at which baseline hepcidin halves absorption (~ferritin 50) [ASSUMPTION]
  erfeMax: 0.8,          // max suppression of baseline hepcidin by erythroid drive (ERFE) [ASSUMPTION]
  ivMg: 1000,            // Monoferric single dose for 50-<70 kg, Hb >=100 g/L (PM simplified table)
  ivClearT12H: 27,       // h, plasma half-life of FDI (US PI)
  resT12D: 21,           // d, half-time for RES to process IV iron into exportable/stable iron [TUNED to ferritin <250 by wk5]
  ferritinPerMgRes: 0.55,// ug/L serum ferritin per mg unprocessed RES iron (macrophage ferritin secretion) [TUNED: peak ~450-500 near d7-10]
  sFloorMg: 64,          // stores below this are not mobilised (ferritin 8 * 8 mg)
  sMobilPerD: 0.02,      // /day mobilisation of stores above floor when marrow still short [ASSUMPTION]
  netLossMgPerD: 0.5,    // mg/day blood-iron loss not covered by diet (heavier periods) [ASSUMPTION; 0 = balanced]
  labileToStorePerH: 0.01, // /h: new iron not taken by marrow drifts to stores [TUNED so most absorbed iron reaches RBCs in IDA]
};

export function simulate(mode, p = P, days = 56) {
  const bv = p.bw * p.bvLPerKg;
  const eOf = hb => hb * bv * p.feMgPerGHb;           // mg Fe in circulating Hb
  const e0 = eOf(p.hb0), eSet = eOf(p.hbSet);
  let S = p.ferritin0 * p.mgPerFerritin;              // storage iron, mg
  let C = 0, R = 0;                                   // IV complex in plasma; unprocessed RES iron
  let eCommitted = e0;                                // Hb iron committed in marrow (leads circulating by lag)
  const pipe = new Array(p.lagD * 24).fill(0);        // hourly delay line for new Hb iron
  let eCirc = e0;
  let L = 0;                                          // labile/transferrin-delivered new iron awaiting marrow uptake, mg
  const doses = [];                                   // [hour, absorbedMg]
  const kC = Math.LN2 / p.ivClearT12H, kR = Math.LN2 / (p.resT12D * 24);
  const out = []; let absCum = 0, ivUsedHb = 0;
  for (let h = 0; h <= days * 24; h++) {
    const day = Math.floor(h / 24), hod = h % 24;
    const gapFrac = Math.max(0, (eSet - eCommitted) / (eSet - e0));
    const hBase = ((S + R) / p.storeRefMg) * (1 - p.erfeMax * Math.min(1, gapFrac));
    let pulse = 0;
    for (const [t0, a] of doses) { const x = (h - t0) / p.hepTauH; if (x > 0 && x < 12) pulse += p.hepPerMgAbs * a * x * Math.exp(1 - x); }
    const H = hBase + pulse, gate = 1 / (1 + H);
    let labile = 0; // new iron arriving this hour
    // oral dosing at 8 am
    const doseDay = mode === 'daily' ? true : mode === 'alternate' ? day % 2 === 0 : false;
    if (doseDay && hod === p.doseHour && day < days) {
      const absorbed = p.fiaMax * p.pillMg * Math.pow(p.pillMg / 60, p.doseExp - 1) * gate;
      doses.push([h, absorbed]); absCum += absorbed; labile += absorbed;
    }
    // IV infusion at day 0, 10 am
    if (mode === 'iv' && h === 10) C += p.ivMg;
    const cToR = C * kC; C -= cToR; R += cToR;
    const rOut = R * kR; R -= rOut; labile += rOut;
    // marrow: closes the Hb gap at marrowK/day, limited by new iron
    const want = Math.max(0, (p.marrowK / 24) * (eSet - eCommitted));
    L += labile;
    let take = Math.min(want, L); L -= take;
    if (take < want && S > p.sFloorMg) { const s = Math.min(want - take, (S - p.sFloorMg) * p.sMobilPerD / 24); S -= s; take += s; }
    eCommitted += take; if (mode === 'iv') ivUsedHb += take;
    const toStore = L * p.labileToStorePerH; L -= toStore; S += toStore; // what the marrow doesn't take is stored
    pipe.push(take); eCirc += pipe.shift();
    const loss = p.netLossMgPerD / 24; eCirc -= loss; eCommitted -= loss;   // ongoing (menstrual) loss comes out of circulating Hb
    if (hod === 0) {
      const hb = eCirc / (bv * p.feMgPerGHb);
      out.push({ day, hb: +hb.toFixed(1), ferritin: +(S / p.mgPerFerritin + p.ferritinPerMgRes * R).toFixed(0),
        hepcidin: +H.toFixed(2), gatePct: +(gate * 100).toFixed(0), absorbedCum: +absCum.toFixed(1), toHbCum: +(eCommitted - e0 + p.netLossMgPerD * day).toFixed(1),
        storesMg: +(S + R + C + L).toFixed(0), recycleMgPerDay: +(eCirc / 120).toFixed(1) });
    }
  }
  return out;
}
```

### Misconceptions to avoid

- **"IV iron goes straight into your blood and is used immediately."** It enters the blood, but macrophages in the liver and spleen take up the iron–carbohydrate complex within about a day (t½ ~27 h) and release it over weeks. So the "IV tanker" should unload at the **warehouse**, not at the marrow.
- **"Ferritin 500 after IV means 4 g of stored iron."** The 8 mg per µg/L rule doesn't apply in the weeks after IV iron. Ferritin overshoots and comes back down, so check it at 4 weeks or later. The clinic's 6–8 week recheck fits this.
- **"Hepcidin is bad / oral iron doesn't work."** Hepcidin is the normal brake against iron overload. Oral iron works for many people and is the right first step. The 24 h echo only lowers *the next day's* absorption by ~35–45%. Don't animate the gate slamming fully shut after a pill.
- **"Alternate-day pills raise Hb faster."** They raise absorption *per dose* (21.8% vs 16.3%). At the same tablet strength, iron absorbed *per week* is lower (175 mg in 28 d vs 131 mg in 14 d). Clinical trials are mixed. Say "more efficient and gentler per pill", not "faster".
- **"Twice-daily pills double the iron."** They don't: absorption from a split dose is no greater than from one morning dose, and hepcidin rises more.
- **"More mg per pill is proportionally better."** 6× the dose gives ~2.7× absorbed, with more GI upset.
- **"One visit fixes everyone."** One 1000 mg dose covers the typical deficit (simplified table: 50–<70 kg with Hb ≥100 g/L). Lower Hb, larger bodies, or 20 mg/kg limits can need **two infusions ≥7 days apart**, and ongoing losses such as heavy periods can drain stores again. Keep "for most adults" and the recheck.
- **Monoferric's Canadian indication** is IDA in adults **intolerant of or unresponsive to oral iron**. Don't imply it's on-label as first-line for everyone, or for iron deficiency *without* anaemia (the site's athlete line "long before anaemia shows up"). That's Peter's regulatory call; the figure should simply not overstate it.
- **Transferrin carts:** each carries at most **two** Fe³⁺. In IDA (TSAT <20%, often <10%), most carts run **empty**. If iron is assumed to bind sites at random, TSAT 30% means ~49% empty, ~42% one ingot and ~9% two ingots (binomial) [derived, LOW: in vivo distribution not purely random].
- **Hypophosphataemia is a class issue but not equal across products:** FDI ~8% vs FCM ~74% in head-to-head trials. Don't say "no risk".
- **Serious allergic reactions** are rare (0.3% serious/severe in FERWON-IDA), not zero. Monitoring for ≥30 min is required. Minor flushing reactions are more common and usually settle without treatment.
- **Hb rise is not instant.** Red cells take days to mature, and both routes show little Hb change in week 1. The "energy in 1–2 weeks" copy is a subjective claim with **no verified number here**, so don't put it on an axis.
- **Normal ferritin ≠ adequate iron in inflammation.** Ferritin is an acute-phase protein (WHO: <70 µg/L may mean deficiency with infection or inflammation).

### Sources

[S] = verified this session via search extract. [K] = known source, not re-opened this session. URLs as surfaced by search where marked [S].

1. [S] Moretti D, Goede JS, Zeder C, et al. Oral iron supplements increase hepcidin and decrease iron absorption from daily or twice-daily doses in iron-depleted young women. *Blood* 2015;126(17):1981–1989. doi:10.1182/blood-2015-05-642223. https://pubmed.ncbi.nlm.nih.gov/26289639/
2. [S] Stoffel NU, Cercamondi CI, Brittenham G, et al. Iron absorption from oral iron supplements given on consecutive versus alternate days and as single morning doses versus twice-daily split dosing in iron-depleted women: two open-label, randomised controlled trials. *Lancet Haematol* 2017;4(11):e524–e533. doi:10.1016/S2352-3026(17)30182-5. PMID 29032957. https://www.researchgate.net/publication/320367972 ; summary: https://www.pharmacytoday.org/article/S1042-0991(17)31948-5/fulltext
3. [S] Stoffel NU, Zeder C, Brittenham GM, Moretti D, Zimmermann MB. Iron absorption from supplements is greater with alternate day than with consecutive day dosing in iron-deficient anemic women. *Haematologica* 2020;105(5):1232–1239. PMID 31413088, PMC7193469. https://haematologica.org/article/view/9379
4. [S] Oral iron supplementation: new formulations, old questions (review). *Haematologica* 2024. https://haematologica.org/article/view/haematol.2024.284967 (authors not captured)
5. [S] Okam MM, Koch TA, Tran MH. Iron deficiency anemia treatment response to oral iron therapy: a pooled analysis of five randomized controlled trials. *Haematologica* 2016;101(1):e6–e7. doi:10.3324/haematol.2015.129114. https://haematologica.org/article/view/7622
6. [S] Auerbach M, Henry D, Derman RJ, Achebe MM, Thomsen LL, Glaspy J. A prospective, multi-center, randomized comparison of iron isomaltoside 1000 versus iron sucrose in patients with iron deficiency anemia; the FERWON-IDA trial. *Am J Hematol* 2019;94(9):1007–1014. doi:10.1002/ajh.25564. https://www.ncbi.nlm.nih.gov/pmc/articles/PMC6772897/
7. [S] Safety of ferric derisomaltose and iron sucrose in patients with iron deficiency anemia: the FERWON-IDA/NEPHRO trials. *Am J Hematol* 2021. https://www.ncbi.nlm.nih.gov/pmc/articles/PMC7756775/ (PMID 33027541)
8. [S] Wolf M, Rubin J, Achebe M, et al. Effects of iron isomaltoside vs ferric carboxymaltose on hypophosphatemia in iron-deficiency anemia: two randomized clinical trials (PHOSPHARE-IDA). *JAMA* 2020;323(5):432–443. doi:10.1001/jama.2019.22450. https://jamanetwork.com/journals/jama/fullarticle/2760391
9. [S] Zoller H, Wolf M, Blumenstein I, et al. Hypophosphataemia following ferric derisomaltose and ferric carboxymaltose in patients with iron deficiency anaemia due to inflammatory bowel disease (PHOSPHARE-IBD): a randomised clinical trial. *Gut* 2023. https://pmc.ncbi.nlm.nih.gov/articles/PMC10086283/
10. [S] A 6 month extension trial evaluating safety and efficacy of ferric derisomaltose in patients with iron deficiency anemia: the FERWON-EXT trial. *Am J Hematol* 2020. https://www.ncbi.nlm.nih.gov/pmc/articles/PMC7539947/
11. [S] Kalra PA, Bhandari S, Saxena S, et al. A randomized trial of iron isomaltoside 1000 versus oral iron in non-dialysis-dependent chronic kidney disease patients with anaemia. *Nephrol Dial Transplant* 2016;31(4):646–655. PMID 26250435. https://www.ncbi.nlm.nih.gov/pmc/articles/PMC4805129/
12. [S] Pfizer Canada ULC / Pharmacosmos A/S. MONOFERRIC (ferric derisomaltose for injection) Product Monograph, revised 29 Jan 2025. Health Canada DPD. https://pdf.hres.ca/dpd_pm/00078460.PDF (earlier version: https://pdf.hres.ca/dpd_pm/00062976.PDF). ⚑ Open and confirm §4 dosing, infusion time, monitoring.
13. [S] MONOFERRIC (ferric derisomaltose) injection, US Prescribing Information. FDA, 2024. https://www.accessdata.fda.gov/drugsatfda_docs/label/2024/208171s003lbl.pdf
14. [S] Monofer (ferric derisomaltose) Australian Product Information (AusPAR). TGA. https://www.tga.gov.au/sites/default/files/auspar-ferric_derisomaltose-181105-pi.pdf ; NZ data sheet: https://www.medsafe.govt.nz/Profs/Datasheet/m/monoferinj.pdf
15. [S] Ontario Regional Blood Coordinating Network (Transfusion Ontario). Spotlight on Ferric Derisomaltose. March 2023. https://transfusionontario.org/en/march-2023/
16. [S] CHEO Parenteral Manual: Ferric derisomaltose. https://outreach.cheo.on.ca/manual/2309-0
17. [S] Davis's Drug Guide: ferric derisomaltose (half-life 27 h; ferritin peak ~7 d). https://www.unboundmedicine.com/washingtonmanual/view/Davis-Drug-Guide/110771/all/ferric_derisomaltose
18. [S] Kawabata H, et al. Intravenous ferric derisomaltose for iron-deficiency anemia associated with gastrointestinal diseases: a single-arm, open-label study. *Int J Hematol* 2022. doi:10.1007/s12185-022-03420-x. https://pmc.ncbi.nlm.nih.gov/articles/PMC9668782/
19. [S] Changes in serum ferritin levels after intravenous iron. *Ann Clin Biochem* 1981;18(4). doi:10.1177/000456328101800405. https://journals.sagepub.com/doi/pdf/10.1177/000456328101800405
20. [S] Van Wyck DB, Mangione A, Morrison J, Hadley PE, Jehle JA, Goodnough LT. Large-dose intravenous ferric carboxymaltose injection for iron deficiency anemia in heavy uterine bleeding: a randomized, controlled trial. *Transfusion* 2009;49(12):2719–2728. doi:10.1111/j.1537-2995.2009.02327.x
21. [S] Pasupathy E, et al. Alternate day versus daily oral iron for treatment of iron deficiency anemia: a randomized controlled trial. *Sci Rep* 2023. https://www.nature.com/articles/s41598-023-29034-9
22. [S] von Siebenthal HK, et al. Alternate day versus consecutive day oral iron supplementation in iron-depleted women: a randomized double-blind placebo-controlled study. *eClinicalMedicine* 2023. https://www.thelancet.com/journals/eclinm/article/PIIS2589-5370(23)00463-7/fulltext
23. [S] Daily oral iron supplementation produced greater improvements in hematological parameters than alternate day doses. *Clin Nutr* 2025. https://www.sciencedirect.com/science/article/pii/S0261561425003024 (authors not captured)
24. [K] Nemeth E, Tuttle MS, Powelson J, et al. Hepcidin regulates cellular iron efflux by binding to ferroportin and inducing its internalization. *Science* 2004;306:2090–2093.
25. [K] Nemeth E, Rivera S, Gabayan V, et al. IL-6 mediates hypoferremia of inflammation by inducing the synthesis of the iron regulatory hormone hepcidin. *J Clin Invest* 2004;113:1271–1276.
26. [K] Aschemeyer S, Qiao B, Stefanova D, et al. Structure-function analysis of ferroportin defines the binding site and an alternative mechanism of action of hepcidin. *Blood* 2018;131(8):899–910.
27. [K] Kautz L, Jung G, Valore EV, et al. Identification of erythroferrone as an erythroid regulator of iron metabolism. *Nat Genet* 2014;46:678–684.
28. [K] Andrews NC. Disorders of iron metabolism. *N Engl J Med* 1999;341:1986–1995.
29. [K] Camaschella C. Iron-deficiency anemia. *N Engl J Med* 2015;372:1832–1843.
30. [K] Walters GO, Miller FM, Worwood M. Serum ferritin concentration and iron stores in normal subjects. *J Clin Pathol* 1973;26:770–772.
31. [K] Ganzoni AM. Intravenous iron-dextran: therapeutic and experimental possibilities. *Schweiz Med Wochenschr* 1970;100:301–303.
32. [K] WHO guideline on use of ferritin concentrations to assess iron status in individuals and populations. Geneva: WHO; 2020.
33. [K] Guideline on haemoglobin cutoffs to define anaemia in individuals and populations. Geneva: WHO; 2024.
34. [K] Tolkien Z, Stecher L, Mander AP, Pereira DIA, Powell JJ. Ferrous sulfate supplementation causes significant gastrointestinal side-effects in adults: a systematic review and meta-analysis. *PLoS One* 2015;10(2):e0117383.
35. [K] Rampton D, Folkersen J, Fishbane S, et al. Hypersensitivity reactions to intravenous iron: guidance for risk minimization and management. *Haematologica* 2014;99(11):1671–1676.
36. [K] Fishbane S, Ungureanu VD, Maesaka JK, et al. The safety of intravenous iron dextran in hemodialysis patients. *Am J Kidney Dis* 1996;28(4):529–534.
37. [K] Cooper M, Greene-Finestone L, Lowell H, Levesque J, Robinson S. Iron sufficiency of Canadians. *Health Reports* (Statistics Canada 82-003-X) 2012;23(4):41–48. ⚑ numbers not verified
38. [K] Mast AE, Blinder MA, Gronowski AM, Chumley C, Scott MG. Clinical utility of the soluble transferrin receptor and comparison with serum ferritin in several populations. *Clin Chem* 1998;44(1):45–51.
39. [K] Ko CW, Siddique SM, Patel A, et al. AGA clinical practice guidelines on the gastrointestinal evaluation of iron deficiency anemia. *Gastroenterology* 2020;159(3):1085–1094.
40. [K] Snook J, Bhala N, Beales ILP, et al. British Society of Gastroenterology guidelines for the management of iron deficiency anaemia in adults. *Gut* 2021;70(11):2030–2051.
41. [K, LOW] Truong J, et al. The origin of ferritin reference intervals: a systematic review. *Lancet Haematol* 2024. ⚑ verify authors and details
42. [K] Hallberg L, Högdahl AM, Nilsson L, Rybo G. Menstrual blood loss: a population study. *Acta Obstet Gynecol Scand* 1966;45:320–351.
43. [K] European Medicines Agency. New recommendations to manage risk of allergic reactions with intravenous iron-containing medicines. 2013 (Article 31 referral).
44. [K] Gkouvatsos K, Papanikolaou G, Pantopoulos K. Regulation of iron transport and the role of transferrin. *Biochim Biophys Acta* 2012;1820(3):188–202.
45. [K] Franco RS. Measurement of red cell lifespan and aging. *Transfus Med Hemother* 2012;39(5):302–307.
46. [K] Weyand AC, Chaitoff A, Freed GL, Sholzberg M, Choi SW, McGann PT. Prevalence of iron deficiency and iron-deficiency anemia in US females aged 12–21 years, 2003–2020. *JAMA* 2023;329(24):2191–2193.
47. [K] Hentze MW, Muckenthaler MU, Galy B, Camaschella C. Two to tango: regulation of mammalian iron metabolism. *Cell* 2010;142(1):24–38.
48. [K] Billesbølle CB, Azumaya CM, Kretsch RC, et al. Structure of hepcidin-bound ferroportin reveals iron homeostatic mechanisms. *Nature* 2020;586:807–811.
