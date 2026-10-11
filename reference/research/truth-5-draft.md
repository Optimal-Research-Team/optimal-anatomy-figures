> **DRAFT, not yet reviewed.** Research notes for Fig 5, gathered 2026-10-11 from web-search extracts (the session's network policy blocked PubMed/PMC, Crossref, Health Canada and manufacturer sites, so no source was opened directly). Reviewed values move into `../truth-pack.md` when the figure is built.

## 5. VO2max ramp on a bike ergometer

> **Research status (read first).** Values were checked against abstracts, indexed full-text snippets and secondary reproductions returned by web search. WebFetch failed on every domain (DNS error) and shell network access is blocked by policy, so **no PDF or full-text table was opened directly**. The shared web-search budget then ran out before items 4–6 and 9–10 of the brief were searched. Everything marked **LOW** is standard textbook physiology that has **not** been verified against a source in this session. Do not show a LOW value as a figure number until someone checks it.
>
> **Blocker for the fitness slider:** the full FRIEND cycle percentile table (Kaminsky 2017 Table 2, or Kaminsky 2022 Table 3, cycle rows) **was not retrieved**. Only the 50th percentile at 20–29 and at 70–79 is verified (abstract). Someone with journal access needs to pull the table before the percentile readout ships. A labelled placeholder method is given below.

**Mechanism in 3 sentences.**
After 3 min of rest and 3 min of unloaded pedalling, the ergometer's brake raises resistance smoothly (a few watts every 1–2 s, e.g. 20 W/min) while the rider holds cadence. Each extra watt costs about 10 ml O₂/min, so oxygen uptake climbs in a straight line, running a few tens of seconds behind the power. Breath by breath, the metabolic cart multiplies flow by the O₂ and CO₂ fractions to get VO₂ and VCO₂. The heart and blood supply that oxygen (Fick: VO₂ = cardiac output × arterio-venous O₂ difference). When delivery and extraction reach their ceiling, VO₂ either flattens (a plateau, i.e. VO₂max) or the rider stops first (VO₂peak). Near the top, CO₂ output and ventilation pull ahead of O₂ (VT1, RER passing 1.0, then VT2/RCP).

### Model numbers

Ref numbers in [brackets] point to **Sources** below.

#### Ramp design
| Quantity | Value | Units | Source | Confidence |
|---|---|---|---|---|
| Target duration of incremental phase (fatigue-limited) | 8–12 | min | [3] ATS/ACCP 2003; [4] AHA 2010; [5] ERS 2019 | HIGH |
| Buchfuhrer: VO₂max higher when test lasted 8–17 min; recommend increment that reaches tolerance in ≈10 min; AT independent of duration (12 healthy men, cycle + treadmill) | ≈10 | min | [1] | HIGH |
| Resting phase before exercise | 3 (ERS: ≥3) | min | [3], [5] | HIGH |
| Unloaded pedalling ("0 W") warm-up; start the ramp from unloaded pedalling, not from rest, because gas exchange lags work rate | 3 | min | [3], [5] | HIGH |
| Ramp increment, clinical range | 5–25 | W/min | [3] | HIGH |
| Ramp update on computer-controlled ergometers | every 1–2 | s | [3] (via [4] snippet) | MEDIUM |
| Recovery phase | ≥2–3 | min | [5] | HIGH |
| Cadence | 55–70 (60 is a common single target) | rpm | [6] citing ERS 2019 | MEDIUM |
| Pedal rate 40–70 rpm doesn't change work rate on an electromagnetically braked ergometer | 40–70 | rpm | [3] (snippet) | MEDIUM |
| Wasserman ramp-rate formula | (predicted VO₂peak − VO₂unloaded) / 100 | W/min | [9] (Brazilian validation study quoting Wasserman; equations descend from [2]) | MEDIUM |
| Wasserman predicted VO₂peak, cycle, men | (height cm − age y) × 20 | ml/min | [9] (extracted text garbled; minus sign inferred) | MEDIUM |
| Same, women | (height − age) × 14 | ml/min | not verified (memory of Wasserman textbook) | LOW |
| [9] also found the Wasserman prediction **agreed poorly** with measured values (sedentary and CAD Brazilian men) | — | — | [9] | HIGH |
| Ramp rates tested by Hansen 1988 (healthy men) | 15, 30, 60 | W/min | [8] | HIGH |
| Example ramp, average 45-y man (178 cm, 80 kg) | ≈20 | W/min | derived from formula above | MEDIUM (derived) |
| Example ramp, fit 35-y man (75 kg, VO₂max 55 ml/kg/min) | ≈30–35 | W/min | derived | MEDIUM (derived) |
| Example ramp, 50-y woman (165 cm, 65 kg) | ≈10–15 | W/min | derived from LOW women's formula | LOW |

#### Oxygen cost of work
| Quantity | Value | Units | Source | Confidence |
|---|---|---|---|---|
| ΔVO₂/ΔWR, normal men (n = 54, 15–30 W/min ramps, 6–14 min tests), roughly constant with age | **10.29 ± 1.01** | ml/min/W | [7] Hansen 1987 | HIGH |
| ΔVO₂/ΔWR, men with circulatory disorders | 8.29 ± 1.17 | ml/min/W | [7] | HIGH (context only) |
| ΔVO₂/ΔWR depends on ramp rate: 15 / 30 / 60 W/min | 11.2 / 10.2 / 8.8 (±0.15–0.16) | ml/min/W | [8] Hansen 1988 | HIGH |
| Upper half of the same tests (steeper slope in slow ramps) | 12.4 / 10.5 / 8.7 | ml/min/W | [8] | HIGH |
| VO₂ during unloaded pedalling | 150 + 6 × body mass (kg) | ml/min | [9] quoting Wasserman | MEDIUM |
| 1 MET (resting VO₂ convention) | 3.5 | ml/kg/min | [21] McMaster textbook; ACSM [20] | HIGH (as a convention) |
| ACSM leg-cycling equation | VO₂ = 1.8 × WR / BM + 3.5 + 3.5 (WR in kg·m/min; 1 W ≈ 6 kg·m/min) ≡ 10.8 × W / BM + 7 | ml/kg/min | [20] (formula confirmed via several secondary sources; ACSM table not opened) | MEDIUM-HIGH |
| ACSM equation validity range | 300–1200 kg·m/min (≈50–200 W), 50–60 rpm | — | [20] (secondary) | MEDIUM |
| "VO₂ = 10.1 × W + 5.8 × BM + 151" | **not found in any source** | — | — | **Do not use** |
| VO₂ lags a ramp by a near-constant delay (first-order response; τ ≈ 30–45 s in healthy adults) | 30–45 | s | not verified | LOW |

#### Maximal-effort criteria
| Quantity | Value | Units | Source | Confidence |
|---|---|---|---|---|
| Taylor plateau criterion: VO₂ rise below ≈150 ml/min (≈2.1 ml/kg/min) despite a 2.5 % grade step, in a **discontinuous** treadmill protocol | <150 (≈2.1) | ml/min (ml/kg/min) | [10] (criterion as described by secondary sources; original not opened) | MEDIUM |
| Taylor: plateau seen in 108 of 115 tests | 94 | % | [10] via [13] | MEDIUM |
| Modern continuous tests: share of people who plateau (treadmill study) | 42 | % | [13] Edvardsen 2014 | MEDIUM |
| Secondary criterion: RER | ≥1.10 (some use ≥1.15) | — | [11] Howley 1995; [12] Poole 2008; [13] | HIGH (as convention) |
| Secondary criterion: HR | within 10 bpm of age-predicted max | bpm | [11], [12] | HIGH (as convention) |
| Secondary criterion: post-exercise blood lactate | ≥8 (often written >8) | mmol/L | [11], [12], [13] | HIGH (as convention) |
| Secondary criterion: RPE | ≥17 on 6–20 Borg (some use ≥18–19) | — | secondary sources only | MEDIUM |
| Accepting RER 1.10 or 1.15 as "max" let tests through that **under-measured** VO₂max by 27 % (2.97 vs 4.03 L/min) or 16 % (3.41 L/min) (n = 8, ramp) | 27 / 16 | % | [12] Poole 2008 | HIGH |
| HR and lactate criteria wrongly rejected 3/8 and 6/8 subjects, most of whom had plateaued | — | — | [12] | HIGH |
| Recommended fix: short constant-work-rate verification bout above the ramp's peak WR; Poole & Jones: VO₂peak not acceptable as VO₂max except in experienced, motivated subjects | — | — | [14] Midgley 2007; [15] Poole & Jones 2017 | HIGH (as recommendation; debated) |
| Age-predicted HRmax (meta-analysis: 351 studies, 18,712 subjects, r = −0.90; lab check of 514 subjects gave 209 − 0.7 × age; same for men and women and activity levels) | **208 − 0.7 × age** | bpm | [16] Tanaka 2001 | HIGH |
| 220 − age underestimates HRmax in older adults | — | — | [16] | HIGH |

#### Thresholds and RER
| Quantity | Value | Units | Source | Confidence |
|---|---|---|---|---|
| V-slope: GET = breakpoint where VCO₂ rises faster than VO₂, caused by bicarbonate buffering of lactic acid | 22 ml CO₂ per mEq lactic acid buffered | — | [17] Beaver 1986 | HIGH |
| RCP sits consistently above AT (n = 10): VO₂ at RCP vs AT | 2.51 ± 0.42 vs 1.83 ± 0.30 | L/min | [17] | HIGH |
| VT1/GET as % VO₂max, untrained adults | ≈50–60 | % | not verified | LOW |
| VT1, endurance-trained | ≈65–80 | % | not verified | LOW |
| VT2/RCP as % VO₂max | ≈70–90 | % | not verified | LOW |
| RER at rest | ≈0.75–0.85 (model 0.80) | — | not verified | LOW |
| RER crosses 1.0 | between VT1 and RCP (model ≈75–85 % VO₂max) | — | not verified | LOW |
| RER at true max, healthy adults | ≈1.10–1.25 (model 1.15) | — | criterion ≥1.10 is HIGH [11]; range LOW | LOW |

#### Fick, heart and breathing (none verified this session)
| Quantity | Value | Units | Source | Confidence |
|---|---|---|---|---|
| Fick at rest: Q ≈ 5 L/min × a-vO₂ diff ≈ 5 ml/100 ml | ≈250 | ml/min | not verified (consensus physiology) | LOW |
| Fick at max, untrained man: Q ≈ 20 L/min × a-vO₂ diff ≈ 15 ml/100 ml | ≈3.0 | L/min | not verified | LOW |
| Q max, endurance athletes | 25–35+ | L/min | not verified | LOW |
| a-vO₂ diff at max | ≈15–17 | ml O₂/100 ml | not verified | LOW |
| CaO₂ = 1.34 × Hb × SaO₂ + 0.003 × PaO₂ ≈ 20 ml/100 ml at Hb 15 g/dl | ≈20 | ml/100 ml | not verified | LOW |
| HR rest (adult typical) | 60–80 | bpm | not verified | LOW |
| SV rest / max (untrained man) | ≈70 / ≈100–120 | ml | not verified | LOW |
| Breathing rate rest / max | 12–16 / 40–60 | breaths/min | not verified | LOW |
| Tidal volume rest / max | ≈0.5 / ≈2–3 | L | not verified | LOW |
| VE rest / max (healthy men; women lower) | ≈6–8 / ≈100–150 | L/min | not verified | LOW |
| Breath period for the vapour pulse (derived from rate) | ≈4–5 s rest → ≈1.0–1.5 s at max | s | derived from LOW rates | LOW |

#### Metabolic cart (generic; none verified this session)
| Part | How it works | Confidence |
|---|---|---|
| Flow sensor: bidirectional digital turbine | Light vane spins in a helical housing; optical sensor counts revolutions, which are proportional to volume. Common in portable carts. | LOW |
| Flow sensor: pneumotachograph (Fleisch/Lilly screen) | Pressure drop across a known small resistance is proportional to flow. Lab carts. | LOW |
| Flow sensor: pitot / differential-pressure tube | Dynamic pressure from flow past opposing ports gives velocity, hence flow. | LOW |
| O₂ analyser: paramagnetic | O₂ is strongly paramagnetic; magnetic force on sample gas gives fraction. Fast, lab carts. | LOW |
| O₂ analyser: galvanic fuel cell (electrochemical) | O₂ reduction at the cathode produces a current proportional to PO₂. Slower, consumable. | LOW |
| O₂ analyser: zirconia | Heated ZrO₂ solid electrolyte; O₂-ion conduction gives a Nernst voltage. Fast. | LOW |
| CO₂ analyser: non-dispersive infrared (NDIR) | CO₂ absorbs IR near 4.26 µm; absorption gives the fraction. | LOW |
| Breath-by-breath vs mixing chamber | B×B samples continuously at the mouth and time-aligns gas fractions to flow, correcting for transport delay along the sample line. Mixing chamber averages expired gas in a baffled chamber and reads mean fractions. | LOW |
| Sample line | Thin tube, often Nafion, that equilibrates water vapour with room air before the analysers. | LOW |
| Haldane transformation | N₂ is neither used nor produced, so V̇I = V̇E × (1 − FEO₂ − FECO₂)/(1 − FIO₂ − FICO₂); then VO₂ = V̇I·FIO₂ − V̇E·FEO₂ and VCO₂ = V̇E·FECO₂ − V̇I·FICO₂ (STPD). | HIGH as algebra; source not opened |
| Ambient air | FIO₂ 0.2093; FICO₂ ≈ 0.0004 | LOW |
| Calibration | 3-L syringe for flow/volume; reference gas ≈16 % O₂ / 4–5 % CO₂ (balance N₂) plus room air for the analysers | LOW |

#### Mortality link (observational: always "associated with")
| Quantity | Value | Units | Source | Confidence |
|---|---|---|---|---|
| Mandsager cohort: consecutive adults having **symptom-limited treadmill** tests, Cleveland Clinic, 1991–2014 | 122,007 (mean age 53.4 ± 12.6; 59.2 % male) | people | [18] | HIGH |
| Deaths; observation | 13,637; 1.1 million person-years; median follow-up 8.4 y | — | [18] | HIGH |
| "Elite" definition | ≥97.7th percentile for age and sex | — | [18] | HIGH |
| Other groups: low <25th, below average 25–49th, above average 50–74th, high 75–97.6th percentile | — | — | [18] (from memory; not seen in snippets) | LOW |
| Low vs elite, adjusted HR (all-cause mortality) | **5.04 (95 % CI 4.10–6.20)** | — | [18] | HIGH |
| Elite vs low (same comparison inverted) | 0.20 (0.16–0.24) | — | [18] via secondary summary | MEDIUM |
| Elite vs high | 0.77 (0.63–0.95) | — | [18] via secondary summary | MEDIUM |
| Below average vs above average | 1.41 (1.34–1.49) | — | [18] via Healio | MEDIUM |
| Comparators in the same model: CAD / smoking / diabetes adjusted HR | 1.29 / 1.41 / 1.40 | — | [18] | HIGH (point estimates) |
| Paper's own words: low fitness is "comparable to or greater than" traditional risk factors | — | — | [18] | HIGH |
| Fitness in [18] is treadmill performance (age- and sex-specific percentile, METs), **not** cart-measured VO₂ | — | — | [18] (treadmill confirmed; "estimated METs" not confirmed) | MEDIUM |
| Kokkinos cohort: US veterans aged 30–95 (mean 61.3 ± 9.8), standardised exercise treadmill test, peak METs | 750,302 (705,163 men; 45,139 women) | people | [19] | HIGH |
| Median follow-up; person-years; died | 10.2 y; 7,803,861; 23 % | — | [19] | HIGH |
| Least fit (≤20th pct) vs extremely fit (≥98th pct), adjusted HR | **4.09** (CI printed 3.90–4.20 in indexed abstract; an upper bound of ≈4.29 would make it log-symmetric, so check the PDF) | — | [19] | HIGH (HR) / MEDIUM (CI) |
| Per 1-MET higher capacity, adjusted HR | 0.86 (0.85–0.87) | — | [19] via secondary news coverage | MEDIUM |
| Extremely fit group | n = 29,741; 14.3 ± 2.1 METs | — | [19] | HIGH |
| Highly fit group | n = 91,680; 12.1 ± 1.8 METs | — | [19] | HIGH |
| No higher risk seen at extreme fitness (no "too fit" upturn) | — | — | [18], [19] | HIGH |

### FRIEND cycle percentiles

**Verified anchors (abstract of [22]).** 4,494 maximal cycle tests (RER ≥1.1) in men and women aged 20–79, by decade.

| 50th percentile, cycle (ml/kg/min) | 20–29 | 70–79 |
|---|---|---|
| Men | **41.9** | **19.5** |
| Women | **31.0** | **14.8** |
| Confidence | HIGH | HIGH |

**Unverified candidate table: do not ship without checking.** A secondary website listed these values, which look like the **2022 FRIEND cycle** rows [23]. Its column labels were read as 25th/50th/75th/95th, and it gave no 90th, no 20–29 and no 60–79. Its medians are close to a straight-line interpolation of the verified anchors, which makes them plausible. Confidence: **LOW**.

| Sex | Age | 25th | 50th | 75th | 95th |
|---|---|---|---|---|---|
| Men | 30–39 | 31.3 | 38.6 | 46.5 | 57.9 |
| Men | 40–49 | 28.4 | 34.8 | 41.8 | 53.2 |
| Men | 50–59 | 23.9 | 29.4 | 35.5 | 46.8 |
| Women | 30–39 | 23.1 | 28.3 | 34.5 | 45.5 |
| Women | 40–49 | 21.3 | 25.9 | 30.9 | 40.7 |
| Women | 50–59 | 19.5 | 23.1 | 27.3 | 35.3 |

**Placeholder model until the real table arrives.** These are model numbers, not data. Medians use straight-line interpolation between the verified 2017 anchors:

| 50th (interpolated, ml/kg/min) | 20–29 | 30–39 | 40–49 | 50–59 | 60–69 | 70–79 |
|---|---|---|---|---|---|---|
| Men | 41.9 | 37.4 | 32.9 | 28.5 | 24.0 | 19.5 |
| Women | 31.0 | 27.8 | 24.5 | 21.3 | 18.0 | 14.8 |

Spread multipliers on the median: P10 ≈ 0.69×, P25 ≈ 0.83×, P75 ≈ 1.18×, P90 ≈ 1.31×. These come from the FRIEND **treadmill** 2015 rows below (MEDIUM) and the candidate cycle rows above (LOW). Overall confidence: LOW.

**FRIEND treadmill (2015) for comparison** [24]. The 20–29 and 70–79 medians are verified from the abstract (HIGH). The other cells come from secondary reproductions [25] (MEDIUM).

| Treadmill 2015 (ml/kg/min) | 10th | 25th | 50th | 75th | 90th |
|---|---|---|---|---|---|
| Men 20–29 | 32.1 | 40.1 | **48.0** | 55.2 | 61.8 |
| Men 30–39 | 30.2 | 35.9 | 42.4 | 49.2 | 56.5 |
| Men 40–49 | — | — | 37.8 | — | — |
| Men 60–69 | — | — | 28.2 | — | — |
| Men 70–79 | — | — | **24.4** | — | — |
| Women 20–29 | — | 30.5 | **37.6** | 44.7 | — |
| Women 40–49 | — | — | 26.7 | — | — |
| Women 60–69 | — | — | 20.0 | — | — |
| Women 70–79 | — | — | **18.3** | — | — |

**Cycle vs treadmill.**
- FRIEND 2022 [26] reported 22,379 tests: 16,278 treadmill and 6,101 cycle (men: 9,564 TM / 2,439 cycle; women: 6,714 TM / 3,662 cycle), apparently healthy, ages 20–89, 1968–2021. The inclusion rule was RER ≥1.0. HIGH.
- Treadmill VO₂max was on average **22 % higher (4.5 ml/kg/min)** than cycle, per Wikipedia citing Kaminsky 2022. Men were about 26 % higher than women on the treadmill and 37.9 % higher on the cycle. MEDIUM.
- Ratios from the verified FRIEND medians (cycle ÷ treadmill; different cohorts): men 20–29 0.87, women 20–29 0.82, men 70–79 0.80, women 70–79 0.81. So cycle runs about **13–20 % lower**, not the 10–15 % in the brief. HIGH as arithmetic, MEDIUM as interpretation.
- The 2017 paper also reports that measured cycle values were well below the old shortcut of "treadmill norm − 15 %", especially in the middle decades. MEDIUM (snippet).

### Equations / curves

Symbols: BM = body mass (kg), W = work rate (W), R = ramp rate (W/min), t in min from ramp start, x = VO₂/VO₂max.

1. **Work rate.** W = 0 during the 3-min unloaded warm-up, then W(t) = R·t. Pick R = (VO₂peak_pred − VO₂₀)/100 so the ramp lasts about 10 min [1, 3, 9]. The 100 is about 10 min × 10 ml/min/W.

2. **VO₂ on the ramp.**
   - Baseline: VO₂₀ = 150 + 6·BM ml/min [9]. Rest: VO₂rest = 3.5·BM ml/min [21].
   - Steady-state line: VO₂lin(W) = VO₂₀ + S·W, with S = 10.3 ml/min/W [7]. Optional ramp-rate dependence from [8]: S ≈ 11.9 − 0.052·R, which gives 11.1 at 15, 10.3 at 30 and 8.8 at 60 W/min (fit to [8]'s three means; MEDIUM).
   - Lag: model the cart reading as a first-order response to the ramp. VO₂(t) = VO₂₀ + S·R·[t − τ(1 − e^(−t/τ))], with τ ≈ 0.6 min (LOW). Late in the ramp it runs parallel to VO₂lin, τ behind.
   - Cross-check with ACSM [20]: VO₂ (ml/kg/min) = 10.8·W/BM + 7. That is 10.8 ml/min/W and 7 ml/kg/min at 0 W, which matches S and VO₂₀ within about 10 %.

3. **Plateau near the ceiling.** Use a smooth minimum: VO₂obs = −k·ln(e^(−VO₂(t)/k) + e^(−VO₂max/k)), with k ≈ 40–60 ml/min (LOW, shape only). The plateau criterion is met when the rise over the last ~1 min is < 150 ml/min [10]. For a **"no plateau" (VO₂peak) person**, end the test at volitional stop while VO₂(t) is still about 1–2·k below VO₂max. Per [13], more than half of people don't plateau, so this should be a selectable outcome and not an error.

4. **Heart rate.** HRmax = 208 − 0.7·age [16]. Linear in VO₂: HR = HRrest + (HRmax − HRrest)·(VO₂ − VO₂rest)/(VO₂max − VO₂rest), with HRrest ≈ 65 (LOW). The linearity is standard but was not verified here (LOW). Show HRmax as "typical for age". Individuals commonly differ by ±10 bpm or more (LOW).

5. **RER vs x** (shape LOW; end-point criterion HIGH). Rest 0.80 → unloaded about 0.83.
   - For x ≤ xVT1 (default 0.55): RER = 0.83 + 0.07·(x/xVT1), reaching about 0.90 at VT1.
   - For x > xVT1: RER = 0.90 + (RERmax − 0.90)·((x − xVT1)/(1 − xVT1))^1.6, with RERmax = 1.15.
   - With these defaults RER crosses 1.0 at x ≈ 0.80. VCO₂ = RER·VO₂. VT1 is the V-slope kink in VCO₂ vs VO₂ [17].

6. **Ventilation and breaths** (LOW).
   - Up to RCP (default x ≈ 0.85): VE ≈ 27·VCO₂ (L/min from L/min).
   - Above RCP: slope rises to about 35–40, so VE reaches about 100–110 L/min at max for a ~3 L/min man (about 71 L/min at RCP).
   - Breathing rate f(x) = 14 + 36·x² breaths/min (14 → 50).
   - Tidal volume = VE/f, capped near 2.5 L.
   - Vapour pulse period = 60/f s.

7. **Fick split** (LOW). VO₂ = HR·SV·(a−vO₂ diff)/100, with SV in L and a−vO₂ in ml/100 ml.
   - SV rises from 0.07 L at rest to about 0.11 L by x ≈ 0.5, then flat.
   - a−vO₂ goes from 5 to 15 ml/100 ml, solved as VO₂ ÷ (HR·SV) so the three factors multiply exactly to the modelled VO₂. For the default rider below this gives ≈6 ml/100 ml at rest (65 bpm × 70 ml) and ≈14 ml/100 ml at max (177 bpm × 110 ml ≈ 19.5 L/min).

8. **Worked default rider** (derived; for testing the model).
   - Rider: 45-y man, 178 cm, 80 kg.
   - VO₂rest 280 ml/min; VO₂₀ 630 ml/min (7.9 ml/kg/min).
   - Predicted VO₂peak (178 − 45)·20 = 2660 ml/min, so R ≈ 20 W/min.
   - If VO₂max = 2800 ml/min (35 ml/kg/min, about the 50th percentile for 40–49 on cycle norms, per the placeholder/candidate tables), the line hits the ceiling at (2800 − 630)/10.3 ≈ 211 W. With the lag, peak power is about 220–225 W at ~11 min.
   - HRmax ≈ 177 bpm.

### Misconceptions to avoid
- **"VO₂max is your lung capacity."** VO₂ is O₂ *used*: cardiac output × extraction (Fick). In healthy people the ceiling is mostly set by delivery and extraction, not by how much air the lungs can move. (Physiology consensus; LOW in this pack.)
- **A fitter person has a steeper O₂ line.** The slope (≈10 ml/min/W) is about the same across healthy people and roughly constant with age [7]. Fitness moves the **ceiling** and the watts reached, not the slope. A *low* slope (≈8 ml/min/W) is a clinical red flag [7].
- **Every test ends in a plateau.** Fewer than half of people plateau in continuous tests (42 % in [13]). Without a plateau the honest label is VO₂peak [14, 15].
- **RER ≥1.10 / 220 − age prove a max.** These secondary criteria can pass tests that under-measure VO₂max by 16–27 % and reject valid ones [12]. Age-predicted HRmax is a population average; 220 − age runs low in older adults [16].
- **The "anaerobic threshold" is where aerobic metabolism switches off.** VT1 marks the extra CO₂ released when bicarbonate buffers lactic acid [17]. Aerobic metabolism keeps rising all the way to VO₂max.
- **RER above 1.0 means you burn only carbohydrate.** Above VT1, part of the CO₂ comes from buffering and hyperventilation, not fuel. High-intensity RER is not a clean fuel readout.
- **Comparing a bike result to treadmill norms.** Cycle values run about 13–22 % lower in FRIEND [22, 24, 26], so use cycle norms for a bike test.
- **Watch "VO₂max" is the same number.** Wearables estimate; a metabolic cart measures gas exchange. (Not sourced here; wording only.)
- **Being fit causes a 5× longer life.** Mandsager [18] and Kokkinos [19] are observational, in patients referred for treadmill testing and in mostly male veterans, using treadmill-*estimated* fitness. Say "low fitness was **associated with** about 4–5× the death rate of the fittest group over ~8–10 years", not "improving fitness will cut your risk 5×". Avoid the press line "unfit is worse than smoking". The paper says "comparable to or greater than" [18].
- **Ramp rate changes VO₂max.** Within an 8–12 min window, VO₂max is similar; the peak *watts* depend strongly on ramp rate [1, 8]. Don't present peak watts as the fitness number.

### Sources
1. Buchfuhrer MJ, Hansen JE, Robinson TE, Sue DY, Wasserman K, Whipp BJ. Optimizing the exercise protocol for cardiopulmonary assessment. *J Appl Physiol* 1983;55(5):1558–1564. doi:10.1152/jappl.1983.55.5.1558. https://journals.physiology.org/doi/10.1152/jappl.1983.55.5.1558
2. Hansen JE, Sue DY, Wasserman K. Predicted values for clinical exercise testing. *Am Rev Respir Dis* 1984;129(2 Pt 2):S49–S55. PMID 6421218. https://pubmed.ncbi.nlm.nih.gov/6421218/ . This is the origin of the Wasserman–Hansen predicted-value equations. The abstract seen covers breathing reserve and blood gases; the exact equations were not opened.
3. American Thoracic Society / American College of Chest Physicians. ATS/ACCP Statement on Cardiopulmonary Exercise Testing. *Am J Respir Crit Care Med* 2003;167(2):211–277 (erratum 167:1451–1452). doi:10.1164/rccm.167.2.211. https://www.atsjournals.org/doi/10.1164/rccm.167.2.211
4. Balady GJ, Arena R, Sietsema K, et al. Clinician's Guide to Cardiopulmonary Exercise Testing in Adults: a scientific statement from the American Heart Association. *Circulation* 2010;122(2):191–225. doi:10.1161/CIR.0b013e3181e52e69. https://www.ahajournals.org/doi/10.1161/cir.0b013e3181e52e69
5. Radtke T, Crook S, Kaltsakas G, et al. ERS statement on standardisation of cardiopulmonary exercise testing in chronic lung diseases. *Eur Respir Rev* 2019;28(154):180101. doi:10.1183/16000617.0101-2018. https://publications.ersnet.org/content/errev/28/154/180101
6. Glaab T, Taube C. Practical guide to cardiopulmonary exercise testing in adults. *Respir Res* 2022;23:9. doi:10.1186/s12931-021-01895-6. https://link.springer.com/article/10.1186/s12931-021-01895-6
7. Hansen JE, Sue DY, Oren A, Wasserman K. Relation of oxygen uptake to work rate in normal men and men with circulatory disorders. *Am J Cardiol* 1987;59:669–674 (volume/pages from memory; PMID verified). PMID 3825911. https://pubmed.ncbi.nlm.nih.gov/3825911/
8. Hansen JE, Casaburi R, Cooper DM, Wasserman K. Oxygen uptake as related to work rate increment during cycle ergometer exercise. *Eur J Appl Physiol* 1988;57:140–145. doi:10.1007/BF00640653. PMID 3349978. https://escholarship.org/uc/item/1gr152nj
9. Use of the Wasserman equation in optimization of the duration of the power ramp in a cardiopulmonary exercise test: a study of Brazilian men. *Braz J Med Biol Res* (c. 2015; year and authors not confirmed). PMC4661031. https://www.ncbi.nlm.nih.gov/pmc/articles/PMC4661031/ ; https://www.scielo.br/j/bjmbr/a/7mr4HcG6rwhWqWTgCDF3ywL/?lang=en
10. Taylor HL, Buskirk E, Henschel A. Maximal oxygen intake as an objective measure of cardio-respiratory performance. *J Appl Physiol* 1955;8(1):73–80. doi:10.1152/jappl.1955.8.1.73. (The 150 ml/min / 2.1 ml/kg/min criterion is as described in secondary sources, e.g. https://exrx.net/Testing/PeakVsMaxVO2 and the Whipp note https://cpxinternational.com/wp-content/uploads/2014/05/028_BJW-Vo2-Peak-vs-Max-final-2.pdf)
11. Howley ET, Bassett DR Jr, Welch HG. Criteria for maximal oxygen uptake: review and commentary. *Med Sci Sports Exerc* 1995;27(9):1292–1301. https://www.bisp-surf.de/Record/PU199601105138
12. Poole DC, Wilkerson DP, Jones AM. Validity of criteria for establishing maximal O₂ uptake during ramp exercise tests. *Eur J Appl Physiol* 2008;102(4):403–410 (issue/pages from memory). https://www.researchgate.net/publication/5876906_Validity_of_criteria_for_establishing_maximal_O2_uptake_during_ramp_exercise_test
13. Edvardsen E, Hem E, Anderssen SA. End criteria for reaching maximal oxygen uptake must be strict and adjusted to sex and age: a cross-sectional study. *PLoS One* 2014;9(1):e85276. doi:10.1371/journal.pone.0085276. https://journals.plos.org/plosone/article?id=10.1371/journal.pone.0085276
14. Midgley AW, McNaughton LR, Polman R, Marchant D. Criteria for determination of maximal oxygen uptake: a brief critique and recommendations for future research. *Sports Med* 2007;37(12):1019–1028 (author list from memory). https://vuir.vu.edu.au/8018/
15. Poole DC, Jones AM. Measurement of the maximum oxygen uptake V̇O₂max: V̇O₂peak is no longer acceptable. *J Appl Physiol* 2017;122(4):997–1002 (issue/pages from memory). doi:10.1152/japplphysiol.01063.2016. https://journals.physiology.org/doi/full/10.1152/japplphysiol.01063.2016
16. Tanaka H, Monahan KD, Seals DR. Age-predicted maximal heart rate revisited. *J Am Coll Cardiol* 2001;37(1):153–156. PMID 11153730. https://pubmed.ncbi.nlm.nih.gov/11153730/
17. Beaver WL, Wasserman K, Whipp BJ. A new method for detecting anaerobic threshold by gas exchange. *J Appl Physiol* 1986;60(6):2020–2027. doi:10.1152/jappl.1986.60.6.2020. PMID 3087938. https://pubmed.ncbi.nlm.nih.gov/3087938/
18. Mandsager K, Harb S, Cremer P, Phelan D, Nissen SE, Jaber W. Association of cardiorespiratory fitness with long-term mortality among adults undergoing exercise treadmill testing. *JAMA Netw Open* 2018;1(6):e183605. doi:10.1001/jamanetworkopen.2018.3605. PMC6324439. https://jamanetwork.com/journals/jamanetworkopen/fullarticle/2707428 (secondary: https://www.healio.com/news/cardiology/20181019/better-cardiorespiratory-fitness-reduces-allcause-mortality-risk ; https://www.obgproject.com/2018/10/26/is-there-such-a-thing-as-too-much-cardiorespiratory-fitness-when-it-comes-to-mortality/)
19. Kokkinos P, Faselis C, Samuel IBH, et al. Cardiorespiratory fitness and mortality risk across the spectra of age, race, and sex. *J Am Coll Cardiol* 2022;80(6):598–609. doi:10.1016/j.jacc.2022.05.031. https://hsrc.himmelfarb.gwu.edu/gwhpubs/1500/ (per-MET HR via https://www.medscape.com/viewarticle/978854 coverage)
20. American College of Sports Medicine. *ACSM's Guidelines for Exercise Testing and Prescription*, 11th ed. Wolters Kluwer, 2021, metabolic equations (leg cycling). Formula confirmed via secondary sources, e.g. https://open-exam-prep.com/study-guides/acsm-cep/exercise-physiology/metabolic-calculations ; the ACSM table was not opened.
21. McMaster Textbook of Internal Medicine, Table 20.2-1 (Bruce protocol; 1 MET = 3.5 ml/kg/min). https://empendium.com/mcmtextbook/table/031_8367
22. Kaminsky LA, Imboden MT, Arena R, Myers J. Reference standards for cardiorespiratory fitness measured with cardiopulmonary exercise testing using cycle ergometry: data from the Fitness Registry and the Importance of Exercise National Database (FRIEND) Registry. *Mayo Clin Proc* 2017;92(2):228–233. doi:10.1016/j.mayocp.2016.10.003. PMID 27938891. https://www.mayoclinicproceedings.org/article/S0025-6196(16)30624-3/abstract
23. Unverified secondary chart listing apparent FRIEND 2022 cycle values (surfaced by web search; exact page not identified; candidates were sensai.fit / catalystperformance.sg / fitnessnorms.com). **Not a citable source.** Replace with [26] Table 3.
24. Kaminsky LA, Arena R, Myers J. Reference standards for cardiorespiratory fitness measured with cardiopulmonary exercise testing: data from the Fitness Registry and the Importance of Exercise National Database. *Mayo Clin Proc* 2015;90(11):1515–1523 (volume/pages from memory). PMID 26455884. https://pubmed.ncbi.nlm.nih.gov/26455884/
25. Secondary reproductions of FRIEND 2015 treadmill percentiles: PLOS ONE 2019 Brazilian CPET reference paper (table reproducing FRIEND), https://journals.plos.org/plosone/article?id=10.1371/journal.pone.0209897 ; plus a FRIEND-citing calculator page for the women's and other-decade medians (page not identified; MEDIUM).
26. Kaminsky LA, Arena R, Myers J, et al. Updated reference standards for cardiorespiratory fitness measured with cardiopulmonary exercise testing: data from the Fitness Registry and the Importance of Exercise National Database (FRIEND). *Mayo Clin Proc* 2022;97(2):285–293. doi:10.1016/j.mayocp.2021.08.020. PMID 34809986. https://www.mayoclinicproceedings.org/article/S0025-6196(21)00645-5/fulltext . The 22 % / 4.5 ml/kg/min treadmill–cycle difference and the sex gaps are via https://en.wikipedia.org/wiki/VO2_max citing this paper.

**Leads to verify next session (not used as sources above):**
- Macfarlane DJ, "Automated metabolic gas analysis systems: a review," *Sports Med* 2001, for cart components and calibration.
- Wasserman K et al., *Principles of Exercise Testing and Interpretation* (5th ed.), for normal VT1 %, RER, VE, f, the women's VO₂peak formula and the VO₂ time constant on ramps.
- Whipp BJ et al. 1981 (*J Appl Physiol* 50:217), for the ramp τ.
- Bassett & Howley 2000 (*Med Sci Sports Exerc*), for limiting factors.
- Swain & Leutholtz 1997, for %HRR ≈ %VO₂R.
- de Souza e Silva CG et al., FRIEND reference equation for treadmill and cycle, *Eur J Prev Cardiol* 2018;25(7):742–750, PMID 29517365. Exists; it includes a mode term; coefficients not verified.
