# Truth pack

Every number a figure shows, animates or prints comes from this file, with a source and a confidence. Format per figure: **Mechanism in 3 sentences** · **Model numbers** (quantity | value | units | source | confidence) · **Equations / curves** · **Misconceptions to avoid** · **Sources**.

> **Verification status (2026-10-11).** This cloud session's network policy blocked direct access to PubMed/PMC, Europe PMC, Crossref, Health Canada's drug database and manufacturer sites, so values were checked against the abstracts and extracts that web search returns, not against full text. Confidence levels reflect that. Before public launch, a reviewer with normal web access should open the sources marked MEDIUM or LOW. To let a future session open them itself, allow `pubmed.ncbi.nlm.nih.gov`, `pmc.ncbi.nlm.nih.gov`, `www.ebi.ac.uk`, `api.crossref.org`, `health-products.canada.ca` and `dhpp.hpfb-dgpsa.ca` in the environment's network settings.
>
> Unreviewed research for Figs 4–5 is in `research/truth-<n>-draft.md` until each figure is built.

## 1. Menopause: the thermoneutral zone

**Mechanism in 3 sentences.** The brain keeps core temperature inside a band between a sweating threshold (above it, the body dumps heat) and a shivering threshold (below it, the body makes heat). In women with hot flashes this band is much narrower than in women without them: about 0.0 °C vs 0.4 °C in Freedman's lab, mostly because the sweating threshold sits lower. In the leading model, estrogen withdrawal makes the KNDy neurons in the arcuate (infundibular) nucleus enlarge and overactive. They send neurokinin-B signals through NK3 receptors to the heat-loss centre in the median preoptic nucleus, and central noradrenaline also narrows the band. Small, everyday core-temperature changes then set off a full heat-dissipation burst (skin vasodilation, sweating, a rise in heart rate), and core temperature dips afterwards. Estrogen therapy and clonidine raise the sweating threshold. NK3 blockers act on the NKB signal itself.

**Model numbers**

| Quantity | Value | Units | Source | Confidence |
|---|---|---|---|---|
| Interthreshold ("null") zone, postmenopausal women **without** hot flashes | 0.4 | °C (rectal) | [Freedman 1999] | HIGH: abstract value, repeated in [Freedman 2001]. Small study (n = 8) |
| Interthreshold zone, postmenopausal women **with** hot flashes | 0.0 ("virtually nonexistent") | °C (rectal) | [Freedman 1999] | HIGH: abstract, P < .005 (n = 12) |
| Core sweating threshold, symptomatic | 37.2 ± 0.09 | °C (ingested telemetry pill) | [Freedman 1999] via [Gombert-Labedens 2025] | MEDIUM: quoted in a 2025 review; original full text not seen |
| Core sweating threshold, asymptomatic | 37.5 ± 0.14 | °C (telemetry pill) | [Freedman 1999] via [Gombert-Labedens 2025] | MEDIUM: same as above |
| Shivering threshold, symptomatic vs asymptomatic | Higher in symptomatic women; no value found | °C | [Freedman 1999] (secondary summaries) | LOW: direction only. Narrowing was "mainly" from the drop in sweating threshold |
| *Derived* shivering threshold for the model | Symptomatic ≈ 37.2 (= sweat threshold, zone 0.0); asymptomatic ≈ 37.1 (37.5 − 0.4) | °C | derived from the rows above | LOW: mixes pill and rectal sites. Use only as model geometry |
| Sweating criterion used for thresholds | Chest sweat rate 40 g·m⁻²·h⁻¹; core temperature adjusted to a mean skin temperature of 34 °C | g·m⁻²·h⁻¹ / °C | [Freedman 2000] | MEDIUM: methods text via search |
| Clonidine (α2 agonist, 2 µg/kg IV): sweating threshold, symptomatic | 37.1 ± 0.07 (placebo) → 37.3 ± 0.09 (clonidine) | °C | [Freedman 2000] | Direction HIGH (abstract). Values LOW–MEDIUM (search-snippet table, ambiguous column labels) |
| Clonidine: sweating threshold, asymptomatic | 37.4 ± 0.05 (placebo) → 37.2 ± 0.03 (clonidine) | °C | [Freedman 2000] | Same as above (it went *down* in asymptomatic women) |
| Yohimbine (α2 antagonist) vs placebo, symptomatic women | 6 vs 0 flushes provoked (n = 9) | count | [Freedman 1990] | MEDIUM: abstract via search summary |
| Clonidine vs placebo during heating | 2 vs 8 flushes, and more heating needed to provoke one | count | [Freedman 1990] | MEDIUM |
| Oral 17β-estradiol 1 mg/day × 90 days: sweating threshold | 37.98 → 38.14 (≈ +0.16) | °C | [Freedman & Blacker 2002] | MEDIUM: values via search. Absolute level differs from the 1999 protocol, so use the **delta**. No change on placebo |
| Same trial: lab hot flashes per session | 1.4 ± 0.5 → 0.6 ± 0.6 (estradiol); no change on placebo | flashes / lab session | [Freedman & Blacker 2002] | MEDIUM |
| Vasodilation threshold, post- vs premenopausal | 37.1 ± 0.2 vs 36.8 ± 0.3 (P = 0.06) | °C | [Jones 2019] | MEDIUM: abstract via search. In this study the sweating threshold was *similar* pre vs post |
| Core temperature at flash onset vs non-flash periods (24 h ambulatory) | 36.82 ± 0.04 vs 36.70 ± 0.005 | °C | [Freedman 1995] | LOW–MEDIUM: secondary (ScienceDirect Topics), not seen in the abstract |
| Flashes preceded by a core rise (8 women) | 24 / 37 ≈ 65% (telemetry pill; rectal showed no rise) | % | [Freedman 1996] | HIGH: abstract counts (% is arithmetic) |
| Flashes preceded by a core rise (lab, 14 women, 29 flashes) | 76% | % | [Freedman 1998] | HIGH: abstract |
| Flashes preceded by a core rise, pooled re-analysis (72 women, 108 flashes) | 51% spontaneous; 76% during mild heating | % | [Jones 2019] | HIGH: abstract |
| Size of the pre-flash core rise (20 min before onset) | 0.03 ± 0.12 | °C | [Jones 2019] | HIGH: abstract. Jones describes the classic model as a "~0.03–0.05 °C" rise |
| Daily timing of flashes | Circadian peak about 18:30, lagging the core-temperature rhythm | clock time | [Freedman 1995] | LOW–MEDIUM: quoted in secondary text |
| Flash duration (objective, sternal sweat onset) | 3.4 ± 1.4 (range 1.3–6.5) | min | [Low 2008] | HIGH: abstract, 23 flashes in 12 women, 26 °C lab |
| Typical felt duration | 1–5 (a few last > 6) | min | [Freedman 2001] (secondary citing) | MEDIUM |
| Heart-rate rise during flash | +9 ± 2 / +10 ± 1 (two subgroups) | bpm | [Low 2008] | HIGH: abstract |
| Heart-rate rise, range across studies | 5–25 | bpm | [J Nutr review] | LOW–MEDIUM: secondary |
| Mean arterial pressure fall (subset only) | −13 ± 2 in 11 flashes in 5 of 12 women | mmHg | [Low 2008] | HIGH, but **not typical**: a subset |
| Skin vascular conductance rise | Forearm +12 to 15; sternum +21 to 24 | % of max CVC | [Low 2008] | HIGH |
| Finger skin-temperature rise, mean | 2.7 ± 0.2 (> 1 °C rise with 69% of felt flashes) | °C | [Meldrum 1979] | HIGH: abstract (n = 7) |
| Finger / toe skin-temperature rise, range | 1–7 | °C | [Kronenberg 1994] | MEDIUM: review |
| Finger-temperature time course | Sharp rise at onset, slower fall. Elevation lasts about 31 min on average (much longer than the felt flash) | min | [Molnar 1975]; [Meldrum 1979] | MEDIUM |
| Objective vasomotor change vs felt onset | Begins about 45 s *after* the felt onset. An "aura" comes seconds before the flash | s | [Tataryn 1980]; [Kronenberg 1984] | MEDIUM |
| Core temperature after the flash ("after-chill") | Falls. Magnitude poorly quantified: "slight" esophageal fall [Kronenberg 1984], "about 0.3 °C" in one unverified secondary text; single-subject lows of 35.6 °C rectal [Molnar 1975] | °C | [Kronenberg 1984]; [Molnar 1975] | LOW: direction HIGH, magnitude LOW. Show a dip with **no number** |
| Catecholamines during flash | Epinephrine up (~+150%), norepinephrine down (~−40%) | % | [Kronenberg 1984] | LOW: search summary only |
| Interval between flashes, highly symptomatic women (finger temperature) | 54 ± 10 (≈ 1.1 per hour) | min | [Meldrum 1979] | MEDIUM |
| Lab flash rate, recruited symptomatic women | 23 / (12 women × 1.5 h) ≈ 1.3 per hour | per hour | derived from [Low 2008] | MEDIUM (derived) |
| Lab flash rate | 29 / (14 × 3 h) ≈ 0.7 per hour | per hour | derived from [Freedman 1998] | MEDIUM (derived) |
| Trial entry criterion (fezolinetant SKYLIGHT 1/2) | ≥ 7 moderate-to-severe VMS per day (≈ ≥ 50 per week), i.e. ≈ 0.3 per hour averaged over 24 h | per day | [SKYLIGHT 1]; [SKYLIGHT 2] | LOW: prior knowledge, **not re-verified** this session (search budget ran out) |
| Median total VMS duration (SWAN) | 7.4 | years | [Avis 2015] | HIGH: abstract |
| VMS persistence after the final menstrual period | 4.5 (n = 881) | years | [Avis 2015] | HIGH |
| Total duration if VMS start pre- or early perimenopause | > 11.8 total; 9.4 after the final period | years | [Avis 2015] | HIGH |
| Median duration by race/ethnicity | African American 10.1; Hispanic 8.9; non-Hispanic White 6.5; Chinese 5.4; Japanese 4.8 | years | [Avis 2015] via secondary review | MEDIUM: not checked against Avis's table |
| SWAN analytic sample | 3302 enrolled; 1449 with frequent VMS (≥ 6 days in the prior 2 weeks) | women | [Avis 2015] | HIGH |
| Share of women with VMS during the menopause transition | "Up to 80%" | % | [Avis 2015] (introduction) | MEDIUM |
| Range by ethnicity (SWAN) | About 50% (Japanese American) to about 80% (African American) | % | [Gold 2006] via [Thurston & Joffe 2011] | MEDIUM: secondary |
| NKB infusion causes flushes (premenopausal women) | 8 / 10 vs 0 / 10 vehicle (P = 0.0007), with HR and skin-temperature rise | count | [Jayasena 2015] | HIGH: abstract |
| KNDy (NKB) neuron hypertrophy after menopause | Enlarged; cross-sectional area about 194% (NKB) and 176% (SP) of premenopausal | % of premenopausal | [Rance & Young 1991] | Direction HIGH; % LOW (secondary listing only) |
| Same in kisspeptin neurons; reproduced by ovariectomy in monkeys, reversed by estrogen | qualitative | – | [Rometo 2007] | MEDIUM |
| MnPO NK3R neurons that are glutamatergic (mouse) | 94% | % | [Krajewski-Hall 2019] | MEDIUM |
| NK3R agonist (senktide) in the MnPO | Lowers core temperature (rat). Needs MnPO NK3R neurons, but those are *not* needed for estrogen's effect on temperature | qualitative | [Dacks 2011]; [Mittelman-Smith 2015] | MEDIUM |
| *NOTES only:* oral estrogen vs placebo | ≈ 75% fewer hot flushes per week (WMD ≈ −17.5 per week) | % | [MacLennan 2004] | MEDIUM: prior knowledge, not re-verified this session |
| *NOTES only:* fezolinetant 45 mg vs placebo, week 12 | ≈ −2.5 moderate-to-severe VMS per day more than placebo (SKYLIGHT 1 ≈ −2.55; SKYLIGHT 2 ≈ −2.53) | per day | [SKYLIGHT 1]; [SKYLIGHT 2] | LOW: from memory, **verify before use** |
| *NOTES only:* elinzanetant 120 mg (OASIS 1/2) | Significant reduction vs placebo at weeks 4 and 12. Exact values not retrieved | per day | [OASIS 1/2] | LOW: not verified |

**How Fig 1 uses these numbers** (`figures/01-menopause-thermostat/model.mjs`)

| Model value | Value | From |
|---|---|---|
| Zone width, pre-menopause end of the knob | 0.4 °C | [Freedman 1999] women without hot flashes. Using it for *pre*-menopause is an assumption: the measured group was postmenopausal and asymptomatic |
| Zone width, post-menopause end | 0.0 °C (shown); drawn gap 0.04 °C so the finger fits | [Freedman 1999] women with hot flashes; readout rounds to one decimal, the precision measured |
| Share of the narrowing on the sweating side | 75 % (sweat 37.5 → 37.2 of a 0.4 °C change) | [Freedman 1999] via [Gombert-Labedens 2025] |
| Temperatures shown | Change from the woman's own resting core temperature, never absolute °C | Absolute thresholds differ by protocol and site (37.2 vs 38.0 °C) |
| A small natural rise (the trigger, and the wander σ) | +0.04 °C | "~0.03–0.05 °C" [Jones 2019] |
| Flash duration | 3.4 min | [Low 2008] |
| Heart-rate rise | +10 bpm | [Low 2008] |
| Finger skin rise; time to peak; elevated for | +2.7 °C; ~1 min (assumed, "sharp rise"); ~31 min (decay τ = 31/3 min) | [Meldrum 1979]; [Molnar 1975]; [Meldrum 1979] |
| After-chill depth and timing | −0.05 °C, from 2 to 14 min after onset | ILLUSTRATIVE: direction from [Kronenberg 1984], size not measured; caption says so |
| Flashes per hour at the post end | 1.1 / h | interval 54 ± 10 min in highly symptomatic women [Meldrum 1979]; caption says "a woman with frequent flashes" |
| Flashes per hour elsewhere on the knob | 1.1 · exp(−(s² − s₀²) / 2σ²), s = distance from rest to the sweating threshold, σ = 0.04 °C | Rice's formula for how often a wandering (Gaussian) signal crosses a level; anchored at the post end. Model output, not a measured curve |
| Playback | about 1 model minute per second, quiet spells between rises cut | stated in the caption |
| Treatments | not shown (HANDOFF §7 Q2 open) | estradiol raised the sweating threshold ≈ +0.16 °C [Freedman & Blacker 2002]; NK-receptor blockers: no threshold data; both NK drugs authorized in Canada (fezolinetant Dec 2024, elinzanetant Jul 2025) |

**Equations / curves**

- **Thresholds as a function of estrogen state.** Let `e` ∈ [0, 1], where 1 = premenopausal/estrogen-replete or no-flash phenotype and 0 = symptomatic estrogen withdrawal.
  `T_sweat(e) = 37.2 + 0.3·e` (37.2 → 37.5 °C, pill values) [Freedman 1999]
  `T_shiver(e) = T_sweat(e) − W(e)`, with `W(e) = 0.4·e` (0.0 → 0.4 °C) [Freedman 1999].
  This makes about 75% of the narrowing come from the sweating threshold falling, matching "narrowing mainly from a lowered sweating threshold".
- **Treatment levers (relative, not promises).** Estradiol: `ΔT_sweat ≈ +0.16 °C` [Freedman & Blacker 2002]. Clonidine (symptomatic): `ΔT_sweat ≈ +0.2 °C` [Freedman 2000]. NK3 blockade: no published threshold measurement was found, so animate it as "quietening the NKB signal" (e.g. raise `e`) without a number.
- **Core temperature.** `Tc(t) = Tc0 + noise(t)`, with `Tc0 ≈ 36.7 °C` [Freedman 1995, non-flash mean]. Noise σ is a few hundredths of a °C per 20 min; the observed pre-flash change is 0.03 ± 0.12 °C [Jones 2019]. A slow circadian term is optional: flashes peak around 18:30 [Freedman 1995]. The amplitude of the core circadian rhythm was **not** sourced here, so leave it out or source it first.
- **Trigger (honest version).** Classic model: a flash fires when `Tc ≥ T_sweat` [Freedman 1999/2014]. To stay true to [Jones 2019], give it a stochastic part: `P(flash in dt) = h0·dt + k·max(0, Tc − T_sweat)·dt`. Tune it so about 50–75% of flashes follow a crossing and the rest are "spontaneous". A refractory period after each flash keeps the rate near 0.5–1.3 per hour for a highly symptomatic lab profile [Meldrum 1979; Low 2008], or ≈ 0.3 per hour for a "7 per day" profile [SKYLIGHT, LOW].
- **Flash time course** (t = 0 at onset, D ≈ 3.4 min, clamp 1.3–6.5 [Low 2008]):
  - Heart rate: `HR(t) = HR0 + 10·g(t)` bpm, where `g` is a fast-rise, fast-decay pulse lasting about D [Low 2008].
  - Finger skin temperature: `Tfinger(t) = T0 + 2.7·(1 − e^{−t/τr})` for t < ~1–2 min, then `·e^{−(t − tp)/τf}` with a slow τf. The elevation lasts about 31 min [Meldrum 1979]; the rise is sharp and the fall slow [Molnar 1975]. Amplitude 1–7 °C range, 2.7 °C typical.
  - Sweat (sternal): a pulse starting at onset that defines the flash; the threshold criterion is 40 g·m⁻²·h⁻¹ [Freedman 2000].
  - Core after-chill: a small dip after the flash (`−δ·pulse`), with δ drawn as visually small and **not** labelled with a number (magnitude LOW).
  - Order of events: felt "aura" (seconds) → felt heat → measurable vasodilation and sweating about 45 s later [Tataryn 1980; Kronenberg 1984].
- **Duration dial (SWAN).** Median 7.4 years. Onset early (pre/early peri) means > 11.8 years. Medians by ethnicity range from 4.8 to 10.1 years [Avis 2015]. Label these as population medians, not a forecast.

**Regulatory status (Canada)**

| Item | Status | Date | Source | Confidence |
|---|---|---|---|---|
| Menopausal hormone therapy (estrogen ± progestogen) | Authorized in Canada. SOGC: "offer MHT as the most effective option" for VMS (strong, high). Safe to start in women without contraindications who are < 60 years or < 10 years past menopause. Individualize | Guideline 2021 | [SOGC 422a] | HIGH |
| Fezolinetant (Veozah, Astellas): NK3 receptor antagonist | Health Canada approved for moderate-to-severe VMS associated with menopause | Approval announced **3 Dec 2024**; in pharmacies **18 Mar 2025**. Exact NOC date not confirmed (Health Canada RDS/SBD exist on the DHPP portal) | [Astellas CA 2024]; [Astellas CA 2025]; [HC RDS Veozah] | HIGH for approval, LOW for the exact NOC day |
| Fezolinetant: US | FDA approval 12 May 2023 (prior knowledge). FDA safety communication **Sep 2024** on rare serious liver injury | 2023 / 2024 | [Drugs.com Veozah history] | MEDIUM: not re-verified. Canadian monograph liver wording not checked |
| Elinzanetant (Lynkuet, Bayer): **dual NK1 + NK3** antagonist | Health Canada market authorization (NOC) for moderate-to-severe VMS associated with menopause, via the Access Consortium | Decision **23 Jul 2025** (RDS); Bayer release 25 Jul 2025 | [HC RDS Lynkuet]; [Bayer CA 2025] | HIGH |
| Elinzanetant: expanded Canadian indication | Moderate-to-severe VMS caused by adjuvant endocrine therapy for breast cancer (OASIS-4) | Bayer release **17 Aug 2026** | [Bayer CA 2026] | MEDIUM: press release via search |
| Elinzanetant: US | FDA-approved for moderate-to-severe menopausal hot flashes. Date believed to be 24 Oct 2025, not confirmed this session | 2025 | [Bayer FDA release] | LOW for the date |

*Is it safe to name a drug?* Both NK-receptor drugs are now authorized in Canada, so naming them is not factually wrong. However:
1. Canada's Food and Drug Regulations (C.01.044) limit public advertising of prescription drugs to name, price and quantity. Pairing a named Rx drug with what it does on a clinic's public marketing page may count as advertising. This is from prior knowledge and was not re-verified this session; Peter or compliance should decide.
2. "NK3 receptor blocker" fits fezolinetant exactly. Elinzanetant blocks NK1 *and* NK3, so "neurokinin-receptor blockers" covers both.

Recommendation: use the generic class name with no brand names. Put the drug names and dates in NOTES only.

**Misconceptions to avoid**

- A hot flash is **not** a fever or a big rise in core temperature. Any trigger rise is a few hundredths of a degree. The skin heats up (finger +2.7 °C typical), and the core then cools slightly.
- Don't say "the thermostat resets lower" as settled fact. The leading model is a **narrowed** zone, mostly from a lower sweating threshold. The idea that a core-temperature rise triggers each flash is **contested**: [Jones 2019] found only about half of spontaneous flashes had a preceding rise, and similar sweating thresholds pre vs post menopause. Present "narrow band + NKB signalling" as the current best explanation.
- Estrogen *level* alone doesn't tell symptomatic and asymptomatic women apart [Freedman 2001]. It's the withdrawal plus how the brain responds (KNDy/NKB).
- The 0.4 vs 0.0 °C zone comes from small lab studies (12 vs 8 women). It shows a typical pattern, not a test or a diagnosis.
- Absolute threshold values depend on the measurement site (rectal vs pill), the protocol and skin temperature (≈ 37.2 °C in 1999 vs ≈ 38.0 °C in 2002). Animate relative positions and don't print absolute thresholds as "your" numbers.
- Not every woman gets them ("up to 80%", varying by ethnicity), and they don't last only "a few months": the SWAN median is 7.4 years, often longer if they start early.
- The heart-rate rise is modest (about +10 bpm). A blood-pressure drop occurred in a subset only.
- The after-chill is real, but its size is poorly measured, so show no number.
- NK3/NK1 blockers are non-hormonal. They don't raise estrogen and don't stand in for estrogen's other effects. Don't imply they widen the zone by a measured amount, because no threshold data were found.
- Hormone therapy is "the most effective option" per SOGC, but it is individualized, has contraindications, and comes with age/time-since-menopause guidance. Don't call it first-line for everyone.
- Efficacy figures (≈ 75% fewer flashes on estrogen; about 2.5 fewer per day vs placebo on fezolinetant) are trial averages for NOTES only, never promises.

**Sources**

*Verification note:* in this session WebFetch could not resolve any host, and direct HTTPS to PubMed, Europe PMC, Crossref and Health Canada was blocked by the environment's network policy. Every value above was checked only through web-search result text (abstract quotes and summaries); **no URL below was opened directly**. The shared web-search budget ran out before I could confirm: Veozah's exact NOC date, the FDA date for Lynkuet, the SKYLIGHT/OASIS numbers, the MacLennan numbers and regulation C.01.044. Those rows are marked LOW/MEDIUM.

1. [Freedman 1999] Freedman RR, Krell W. Reduced thermoregulatory null zone in postmenopausal women with hot flashes. *Am J Obstet Gynecol* 1999;181(1):66–70. PMID 10411797. DOI 10.1016/S0002-9378(99)70437-0. https://pubmed.ncbi.nlm.nih.gov/10411797/
2. [Freedman 2001] Freedman RR. Physiology of hot flashes. *Am J Hum Biol* 2001;13(4):453–464. PMID 11400216. DOI 10.1002/ajhb.1077. https://onlinelibrary.wiley.com/doi/abs/10.1002/ajhb.1077
3. [Freedman 2014] Freedman RR. Menopausal hot flashes: mechanisms, endocrinology, treatment. *J Steroid Biochem Mol Biol* 2014;142:115–120. PMID 24012626. DOI 10.1016/j.jsbmb.2013.08.010. https://pubmed.ncbi.nlm.nih.gov/24012626/
4. [Freedman 1995] Freedman RR, Norton D, Woodward S, Cornélissen G. Core body temperature and circadian rhythm of hot flashes in menopausal women. *J Clin Endocrinol Metab* 1995;80(8):2354–2358. PMID 7629229. DOI 10.1210/jc.80.8.2354. https://pubmed.ncbi.nlm.nih.gov/7629229/
5. [Freedman 1996] Freedman RR, Woodward S. Core body temperature during menopausal hot flushes. *Fertil Steril* 1996;65(6):1141–1144. https://www.sciencedirect.com/science/article/pii/S0015028216583289
6. [Freedman 1998] Freedman RR. Biochemical, metabolic, and vascular mechanisms in menopausal hot flashes. *Fertil Steril* 1998;70(2):332–337. PMID 9696230. https://pubmed.ncbi.nlm.nih.gov/9696230/
7. [Freedman 2000] Freedman RR, Dinsay R. Clonidine raises the sweating threshold in symptomatic but not in asymptomatic postmenopausal women. *Fertil Steril* 2000;74(1):20–23. PMID 10899491. DOI 10.1016/S0015-0282(00)00563-X. https://pubmed.ncbi.nlm.nih.gov/10899491/
8. [Freedman & Blacker 2002] Freedman RR, Blacker CM. Estrogen raises the sweating threshold in postmenopausal women with hot flashes. *Fertil Steril* 2002;77(3):487–490. PMID 11872200. https://www.fertstert.org/article/S0015-0282(01)03009-6/fulltext
9. [Freedman 1990] Freedman RR, Woodward S, Sabharwal SC. α2-Adrenergic mechanism in menopausal hot flushes. *Obstet Gynecol* 1990;76(4):573–578. PMID 2170883. https://journals.lww.com/greenjournal/abstract/1990/10000/_2_adrenergic_mechanism_in_menopausal_hot_flushes.1.aspx
10. [Jones 2019] Jones H, et al. Is core temperature the trigger of a menopausal hot flush? *Menopause* 2019;26(9):1016–1023. PMID 31453964. DOI 10.1097/GME.0000000000001357. https://pubmed.ncbi.nlm.nih.gov/31453964/
11. [Gombert-Labedens 2025] Gombert-Labedens M, et al. Effects of menopause on temperature regulation. *Temperature* 2025;12. DOI 10.1080/23328940.2025.2484499. https://www.tandfonline.com/doi/full/10.1080/23328940.2025.2484499
12. [Low 2008] Low DA, Davis SL, Keller DM, Shibasaki M, Crandall CG. Cutaneous and hemodynamic responses during hot flashes in symptomatic postmenopausal women. *Menopause* 2008. PMID 17700502; PMC2840382. https://pmc.ncbi.nlm.nih.gov/articles/PMC2840382/
13. [Meldrum 1979] Meldrum DR, Shamonki IM, Frumar AM, Tataryn IV, Chang RJ, Judd HL. Elevations in skin temperature of the finger as an objective index of postmenopausal hot flashes: standardization of the technique. *Am J Obstet Gynecol* 1979;135(6):713–717. PMID 495671. https://pubmed.ncbi.nlm.nih.gov/495671/
14. [Molnar 1975] Molnar GW. Body temperatures during menopausal hot flashes. *J Appl Physiol* 1975;38(3):499–503. DOI 10.1152/jappl.1975.38.3.499. https://journals.physiology.org/doi/abs/10.1152/jappl.1975.38.3.499
15. [Tataryn 1980] Tataryn IV, et al. Postmenopausal hot flushes: a disorder of thermoregulation. *Maturitas* 1980. PMID 7207212. DOI 10.1016/0378-5122(80)90043-2. https://www.sciencedirect.com/science/article/abs/pii/0378512280900432
16. [Kronenberg 1984] Kronenberg F, Cote LJ, Linkie DM, Dyrenfurth I, Downey JA. Menopausal hot flashes: thermoregulatory, cardiovascular, and circulating catecholamine and LH changes. *Maturitas* 1984;6(1):31–43. PMID 6472126. DOI 10.1016/0378-5122(84)90063-X. https://pubmed.ncbi.nlm.nih.gov/6472126/
17. [Kronenberg 1990] Kronenberg F. Hot flashes: epidemiology and physiology. *Ann N Y Acad Sci* 1990. DOI 10.1111/j.1749-6632.1990.tb30316.x. https://nyaspubs.onlinelibrary.wiley.com/doi/10.1111/j.1749-6632.1990.tb30316.x (no specific value from it could be confirmed)
18. [Kronenberg 1994] Kronenberg F. Hot flashes: phenomenology, quality of life, and search for treatment options. *Exp Gerontol* 1994;29(3–4):319–336. https://www.sciencedirect.com/science/article/pii/0531556594900124
19. [J Nutr review] Menopausal hot flashes: a review of physiology and biosociocultural perspective on methods of assessment (*J Nutr*, ScienceDirect). https://www.sciencedirect.com/science/article/pii/S0022316622131986 (authors and year not confirmed)
20. [Avis 2015] Avis NE, Crawford SL, Greendale G, et al. Duration of menopausal vasomotor symptoms over the menopause transition. *JAMA Intern Med* 2015;175(4):531–539. PMID 25686030. DOI 10.1001/jamainternmed.2014.8063. https://pubmed.ncbi.nlm.nih.gov/25686030/
21. [Gold 2006] Gold EB, Colvin A, Avis N, et al. Longitudinal analysis of the association between vasomotor symptoms and race/ethnicity across the menopausal transition: SWAN. *Am J Public Health* 2006;96(7):1226–1235.
22. [Thurston & Joffe 2011] Thurston RC, Joffe H. Vasomotor symptoms and menopause: findings from the Study of Women's Health across the Nation. *Obstet Gynecol Clin North Am* 2011;38(3):489–501. PMID 21961716. https://pmc.ncbi.nlm.nih.gov/articles/PMC3185243/
23. [Rance & Young 1991] Rance NE, Young WS 3rd. Hypertrophy and increased gene expression of neurons containing neurokinin-B and substance-P messenger ribonucleic acids in the hypothalami of postmenopausal women. *Endocrinology* 1991;128(5):2239–2247. DOI 10.1210/endo-128-5-2239.
24. [Rometo 2007] Rometo AM, et al. Hypertrophy and increased kisspeptin gene expression in the hypothalamic infundibular nucleus of postmenopausal women and ovariectomized monkeys. *J Clin Endocrinol Metab* 2007;92(7):2744–2750. PMID 17488799. https://pubmed.ncbi.nlm.nih.gov/17488799/
25. [Rance 2013] Rance NE, Dacks PA, Mittelman-Smith MA, Romanovsky AA, Krajewski-Hall SJ. Modulation of body temperature and LH secretion by hypothalamic KNDy neurons: a novel hypothesis on the mechanism of hot flushes. *Front Neuroendocrinol* 2013;34(3):211–227. https://pmc.ncbi.nlm.nih.gov/articles/PMC3833827/
26. [Mittelman-Smith 2012] Mittelman-Smith MA, et al. Role for KNDy neurons in cutaneous vasodilatation and the estrogen modulation of body temperature. *PNAS* 2012. DOI 10.1073/pnas.1211517109. https://www.pnas.org/doi/10.1073/pnas.1211517109
27. [Dacks 2011] Dacks PA, et al. Activation of neurokinin 3 receptors in the median preoptic nucleus decreases core temperature in the rat. *Endocrinology* 2011. https://www.researchgate.net/publication/51746364
28. [Mittelman-Smith 2015] Neurokinin 3 receptor-expressing neurons in the median preoptic nucleus modulate heat-dissipation effectors in the female rat. *Endocrinology* 2015. PMID 25825817. https://pubmed.ncbi.nlm.nih.gov/25825817/
29. [Krajewski-Hall 2019] Glutamatergic neurokinin 3 receptor neurons in the median preoptic nucleus modulate heat-defense pathways in female mice. *Endocrinology* 2019. PMID 30753503. https://pmc.ncbi.nlm.nih.gov/articles/PMC6424091/
30. [Jayasena 2015] Jayasena CN, et al. Neurokinin B administration induces hot flushes in women. *Sci Rep* 2015;5:8466. DOI 10.1038/srep08466. https://www.ncbi.nlm.nih.gov/pmc/articles/PMC4329553/
31. [NRE 2026] Neurokinin receptor antagonists for vasomotor symptoms: from KNDy neurons to clinical translation. *Nat Rev Endocrinol* 2026. https://www.nature.com/articles/s41574-026-01247-8 (background only)
32. [SOGC 422a] Yuksel N, Evaniuk D, Huang L. Guideline No. 422a: Menopause: vasomotor symptoms, prescription therapeutic agents, complementary and alternative medicine, nutrition, and lifestyle. *J Obstet Gynaecol Can* 2021;43(10):1188–1204.e1. https://www.jogc.com/article/S1701-2163(21)00603-4/abstract
33. [Astellas CA 2024] Astellas. VEOZAH (fezolinetant) receives Health Canada approval… 3 Dec 2024. https://newsroom.astellas.com/2024-12-03-VEOZAH-R-fezolinetant-film-coated-tablets-Receives-Health-Canada-Approval-as-First-and-Only-Non-hormonal-Treatment-for-Vasomotor-Symptoms-VMS-Associated-with-Menopause
34. [Astellas CA 2025] Astellas. VEOZAH now available in Canada. 18 Mar 2025. https://newsroom.astellas.com/2025-03-18-VEOZAH-R-fezolinetant-film-coated-tablets-Now-Available-in-Canada,-First-and-Only-Non-hormonal-NK3-Antagonist-Indicated-for-Vasomotor-Symptoms-VMS-Associated-with-Menopause
35. [HC RDS Veozah] Health Canada. Regulatory Decision Summary, Veozah: https://dhpp.hpfb-dgpsa.ca/review-documents/resource/RDS1742493092656 ; Summary Basis of Decision: https://dhpp.hpfb-dgpsa.ca/review-documents/resource/SBD1740491309253
36. [Drugs.com Veozah history] https://www.drugs.com/history/veozah.html
37. [HC RDS Lynkuet] Health Canada. Regulatory Decision Summary, Lynkuet (decision 2025-07-23). https://dhpp.hpfb-dgpsa.ca/review-documents/resource/RDS1774537650545
38. [Bayer CA 2025] Bayer Canada. Health Canada grants Marketing Authorization for Bayer's Lynkuet (elinzanetant). 25 Jul 2025. https://www.bayer.com/en/ca/health-canada-grants-marketing-authorization-for-bayers-lynkuetr
39. [Bayer CA 2026] Bayer Canada. LYNKUET receives expanded market authorization in Canada (AET-related VMS). 17 Aug 2026. https://www.bayer.com/en-ca/canada/media/news/2026/lynkuet-receives-expanded-market-authorization-in-canada
40. [Bayer FDA release] Bayer. Lynkuet (elinzanetant)… receives FDA approval for moderate to severe hot flashes due to menopause. https://www.theglobeandmail.com/investing/markets/stocks/BAYZF/pressreleases/35665150/ (date not confirmed)
41. [MacLennan 2004] MacLennan AH, Broadbent JL, Lester S, Moore V. Oral oestrogen and combined oestrogen/progestogen therapy versus placebo for hot flushes. *Cochrane Database Syst Rev* 2004;(4):CD002978. (not re-verified this session)
42. [SKYLIGHT 1] Lederman S, et al. Fezolinetant for treatment of moderate-to-severe vasomotor symptoms associated with menopause (SKYLIGHT 1): a phase 3 randomised controlled study. *Lancet* 2023;401:1091–1102. (from prior knowledge, not re-verified this session)
43. [SKYLIGHT 2] Johnson KA, et al. Efficacy and safety of fezolinetant in moderate to severe vasomotor symptoms associated with menopause: a phase 3 RCT (SKYLIGHT 2). *J Clin Endocrinol Metab* 2023;108(8):1981–1997. (from prior knowledge, not re-verified this session)
44. [OASIS 1/2] Pinkerton JV, et al. Elinzanetant for the treatment of vasomotor symptoms associated with menopause: OASIS 1 and 2 randomized clinical trials. *JAMA* 2024. (not re-verified this session)

## 2. InBody 580: bioimpedance

> **How this was verified (read first).** In this session the environment's network policy blocked direct page fetches (WebFetch and curl) to inbody.com, inbodyusa.com, inbodycanada.ca, pubmed/pmc and every other source host. Each value below was checked through search-engine extracts of the named page, and several were cross-checked across two or more pages. **No page was opened end-to-end.** Confidence ratings take this into account:
> - **HIGH:** consistent across two or more independent extracts, including a manufacturer document or a paper abstract.
> - **MEDIUM:** a single extract, or an exact citation whose specific passage I did not see.
> - **LOW:** inferred, a vendor's marketing claim, or unverified.
>
> Before shipping, open the InBody 580 user manual's spec table (§9.2) and Zhuang 2022, Table 4, to confirm.

**Mechanism in 3 sentences.**
The InBody 580 sends a tiny alternating current (200 µA) through the body from electrodes under the palms and the front of the feet, and reads the voltage at the thumbs and heels. It does this at four frequencies (5, 50, 250 and 500 kHz) for each of five "cylinders": both arms, the trunk and both legs. Each cell membrane is a thin insulating lipid layer between conductive fluids, so it behaves like a capacitor. At low frequency the membranes block the current, which flows around the cells through extracellular water. As frequency rises, the current increasingly passes through the membranes and also uses intracellular water. Impedance therefore falls with frequency, and the delay the membranes add (reactance, expressed as phase angle at 50 kHz) reflects how much intact cell membrane is in the path. Because resistance follows R = ρL/A, long thin limbs dominate the measured impedance. The trunk holds about half the lean mass but adds only about a tenth of the impedance, which is why the 580 measures each segment directly instead of treating the body as one cylinder.

### Model numbers

**A. InBody 580 device facts**

| Quantity | Value | Units | Source | Confidence |
|---|---|---|---|---|
| Measurement frequencies | **5, 50, 250, 500** (4 frequencies, *not* 3) | kHz | [1][2][3] | HIGH (one regional page, au.inbody.com, lists only 5/50/500 while still saying "20 measurements … 4 frequencies"; treat it as a typo) |
| Impedance measurements | 20 = 4 frequencies × 5 segments (RA, LA, TR, RL, LL) | count | [1][2][3] | HIGH |
| Phase angle measurements | 5 segmental phase angles **at 50 kHz only**, plus whole-body phase angle at 50 kHz | count, ° | [2][4][5] | HIGH for 50 kHz segmental and whole-body. The 580 does not report phase angle at other frequencies. |
| Reactance (Xc) as a printed output | Not confirmed for the 580. The 770 prints segmental Xc; for the 580 I found only impedance (Z) per segment per frequency, plus phase angle. | — | [5][6] | LOW. Don't show "580 reactance readout" without checking. |
| Measurement method | DSM-BIA (direct segmental multi-frequency BIA) + SMF-BIA (simultaneous multi-frequency) | — | [2] | HIGH |
| Electrode system | Tetrapolar 8-point tactile electrodes: palm + thumb on each hand grip, front sole + heel on each foot | — | [2][7] | HIGH |
| Electrode roles | Current enters at the palm and front-sole electrodes. Voltage is sensed at the thumb and heel, so measurement starts at the wrist and ankle whatever the grip. | — | [7] | MEDIUM (InBody's own technology page) |
| Applied current | **200 µA (±20 µA)** | µA | [2][8] | HIGH (manual rev B and rev C plus the Swedish catalog all say 200 µA. Some text copies drop the µ and show "200 A", which is an extraction error.) |
| Compare: InBody 570 | 5, 50, 500 kHz; 15 measurements; 400 µA (±40 µA); about 45–50 s | — | [9][10] | HIGH for frequencies, MEDIUM for current |
| Compare: InBody 770 | 1, 5, 50, 250, 500, 1000 kHz; 30 measurements; 80 µA (±10 µA) | — | [6][10] | HIGH for frequencies, LOW for current (distributor sheet) |
| Test duration | about 30 | s | [1][3] | HIGH |
| Weight range | 5–300 (product page); the manual copy says 2–300 | kg | [1][2] | MEDIUM (sources conflict on the lower limit; the upper limit of 300 kg agrees) |
| Height range | 95–220 | cm | [1][3] | HIGH |
| Age range | 3 years and up | years | [3] | MEDIUM |
| Key outputs | ECW/TBW (whole body and segmental), ICW, ECW, TBW, segmental lean, phase angle (whole body and segmental, 50 kHz), visceral fat (Level and/or Area, varies by region), BIVA graph (optional) | — | [1][4][5] | MEDIUM (output names vary by regional sheet) |

**B. Physiology anchors (published numbers)**

| Quantity | Value | Units | Source | Confidence |
|---|---|---|---|---|
| Arm share of whole-body Z at 50 kHz | 47.6 | % | Bracco 1996 [11] (51 women) | HIGH (abstract) |
| Leg share of whole-body Z at 50 kHz | 43.0 | % | [11] | HIGH |
| **Trunk share of whole-body Z at 50 kHz** | **10.0** | % | [11] | HIGH |
| Trunk share of fat-free mass (DXA) | 48.2 | % | [11] | HIGH |
| Arm / leg share of FFM | 10.6 / 34.8 | % | [11] | HIGH |
| Sum of segments vs measured whole body | 100.5 ± 1.9 | % | [11] | HIGH (so whole body ≈ arm + trunk + leg in series) |
| Right-arm Z, 50 kHz, healthy women 18–55 (InBody 770, n = 127) | 388.61 ± 47.9 | Ω | Zhuang 2022 [12] | MEDIUM-HIGH (screening cutoff 294.73 = mean − 1.96 SD exactly, which cross-checks the extract) |
| Right-arm Z, 250 kHz, same cohort | 354.4 ± 44.56 | Ω | [12] | MEDIUM-HIGH (cutoff 267.07 = mean − 1.96 SD) |
| Right-arm Z, 5 kHz screening cutoff (mean − 1.96 SD) | 325.18 (left arm 328.01) | Ω | [12] | MEDIUM |
| Right-arm Z, 5 kHz, implied mean | ≈ 428–432 | Ω | **derived** from [12], assuming the same coefficient of variation as the 50 and 250 kHz rows (12.3–12.6 %) | LOW (inference) |
| Arm Z, 1 kHz / 5 kHz, healthy women (InBody 720, n = 1,305) | 400.1 ± 48.2 / 391.0 ± 47.8 (dominant arm); 404.9 / 395.7 (non-dominant arm) | Ω | Liu 2021 [13] | MEDIUM (units not shown in the extract; these are impedances). The dominant arm reads about 1.2 % lower. |
| Arm Z drop 50 → 250 kHz (measured) | −8.8 | % | [12] | MEDIUM-HIGH |
| Arm Z drop 1 → 5 kHz (measured) | −2.3 | % | [13] | MEDIUM |
| Characteristic frequency (fc, where Xc peaks) for healthy muscle tissue | ~50 | kHz | Mohamed 2025 review [14] | MEDIUM. It is also why single-frequency BIA uses 50 kHz [14][15]. |
| Phase angle definition | PA = arctan(Xc / R) × 180/π. Conventionally taken at 50 kHz, which is "not a formal definition". | ° | Ward & Brantlov 2023 [15]; Gupta 2009 [16] | HIGH |
| ECW/TBW normal band (InBody) | 0.360–0.390, typical ≈ 0.380 | ratio | InBody result-sheet guides [17][18] | HIGH |
| ECW/TBW tiers (InBody) | < 0.390 "Normal"; 0.390–0.400 "Slightly Over"; > 0.400 "Over" | ratio | InBody research site [18] | MEDIUM-HIGH |
| ECW/TBW "normal fluid balance" cut (research) | < 0.400. The authors warn this does *not* mean "healthy". | ratio | Japanese InBody 770 study [19] | MEDIUM |
| Phase angle, InBody 770, Japanese, ages 10–99 with ECW/TBW < 0.4 (n = 2,562) | men 5.4 ± 0.8; women 4.7 ± 0.5 | ° | [19] | MEDIUM-HIGH |
| Phase angle, InBody 970, Korea KNHANES IX (n = 4,881), men | about 6.2–6.3 in their 20s–30s, about 5.6 at 60–64; peaks in the 30s; women lower | ° | [20] | MEDIUM (women's rows not retrieved) |
| Phase angle sarcopenia cutoffs (KNHANES, older adults) | men 4.65; women 4.25 | ° | [20] | MEDIUM |
| Phase angle, healthy US adults (RJL hand-to-foot, 50 kHz, n = 1,967) | men 7.48 ± 1.10; women 6.53 ± 1.01; lower with age | ° | Barbosa-Silva 2005 [21] | MEDIUM-HIGH. Different device class; **do not mix with InBody values.** |
| Phase angle, German reference (n ≈ 214,732) | Higher in men; falls with age; varies with BMI (values not retrieved) | — | Bosy-Westphal 2006 [22] | MEDIUM for direction, values not verified |
| InBody's own consumer guidance | "normal" about 5–7°; men "good" 5.5–7, women "good" 5–6 | ° | InBody India blog [23] | LOW (vendor blog, no primary citation) |
| How InBody computes whole-body phase angle | Proprietary equation. In practice the device value matched a calculation from **right-side summed segments** (RA + TR + RL) within −0.004°. | ° | Lafontant 2024 [24] | MEDIUM |

**How Fig 2 uses these numbers** (`figures/02-inbody-580/model.mjs`)

| Shown or animated | Value | From |
|---|---|---|
| Frequency buttons, switch detents, screen | 5, 50, 250, 500 kHz | InBody 580 manual and catalog [1–4] |
| Caption: readings, time, current | 20 readings, about 30 s, 200 µA | [1–4]; site copy says "stand still for 30 seconds" |
| Segment impedance (meters, readout) | Cole model, α = 0.70, per-segment Re / Ri / Cm in the table above; arm 428 / 388 / 354 / 346 Ω, trunk 90 / 82 / 74 / 73 Ω, leg 387 / 351 / 320 / 313 Ω | fitted to Zhuang 2022 arm values [12] and Bracco 1996 shares [11]; example values for an adult woman, caption says so |
| "Body" | RA + TR + RL in series: 905 / 821 / 749 / 732 Ω | matches how InBody sums whole body [24] |
| Share of current crossing cell membranes (dots on the "through" lanes) | 2 % / 17 % / 23 % / 24 % at 5 / 50 / 250 / 500 kHz | Fricke circuit with the same Re, Ri, Cm: Re / √((Re + Ri)² + (1/ωCm)²) |
| Dot speed by segment | inversely proportional to the section's lane count (same current through a narrower section) | current continuity; drawn as a steady stream (the caption notes it alternates) |
| ECW/TBW readout | 0.380 | teaching model calibrated to InBody's typical value [17]; normal band 0.360–0.390 |
| Phase angle readout | 4.7° at 50 kHz | model; matches InBody 770 women 4.7 ± 0.5° [19] |
| Cylinder sizes | arm r 4.6, leg r 7, trunk r 15 (world units ≈ cm) | proportion only; the trunk's ~10 % share of impedance comes from the model, not the drawing |

### Equations / curves

**1. Per-segment circuit (Fricke elements fed into a Cole curve).** Each segment has an extracellular path *Re* in parallel with an intracellular path *Ri* in series with membrane capacitance *Cm*:

```
R0   = Re                          (f → 0: current only in ECW)
R∞   = Re·Ri / (Re + Ri)           (f → ∞: membranes shorted, ECW ∥ ICW)
τ    = Cm·(Re + Ri),  fc = 1/(2πτ) (characteristic frequency; Xc is maximal near fc)
Z(f) = R∞ + (R0 − R∞) / (1 + (j·f/fc)^α)      Cole model; α = 1 gives the ideal RC (Fricke) circuit
R = Re{Z},  Xc = −Im{Z},  PA = atan(Xc/R)·180/π
```

Use **α ≈ 0.70**. A pure RC (α = 1) cannot reproduce the published arm data: its dispersion is too sharp, and the best fit left Ri pinned at the search bound with about 2 % error. A Cole fit with α = 0.6–0.8 matches the three arm anchors to within 0.05 %. At α = 0.70, fc comes out at **50.1 kHz** without being forced there, which agrees with [14]. The *Cm* below is an effective pseudo-capacitance that sets τ, not a measured membrane capacitance.

**2. Geometry.** R = ρL/A, so V ≈ ρL²/R. This is the "impedance index" (height²/R) behind FFM prediction [25][26]. Segments add in series: **Z_WB(InBody-style) = Z_RA + Z_TR + Z_RL**, consistent with [11] (sum ≈ 100.5 %) and [24].

**3. Fluid ratio (teaching model, *not* InBody's proprietary equations).** Per segment, ECW ∝ 1/Re and ICW ∝ k/Ri:
`ECW/TBW = (1/Re) / (1/Re + k/Ri)`, with **k = 5.255**, calibrated so the baseline gives 0.380 (InBody's typical value [17]). The ratio is linear in volume, so it responds correctly to "ECW +10 %".

**4. Suggested parameters.** These are model-derived. Arm values are fitted to Zhuang 2022 [12] (Z50, Z250) and the implied Z5. Trunk and leg are scaled by Bracco's 50 kHz fractions [11] (trunk 10.0/47.6, leg 43.0/47.6, with Cm scaled inversely so fc stays put). Left side = right side.

| Segment | Re (Ω) | Ri (Ω) | Cm,eff (nF) | α | fc (kHz) | ECW/TBW |
|---|---|---|---|---|---|---|
| Arm (RA, LA) | 439 | 1414 | 1.72 | 0.70 | 50.1 | 0.380 |
| Trunk (TR) | 92.2 | 297.1 | 8.17 | 0.70 | 50.1 | 0.380 |
| Leg (RL, LL) | 396.6 | 1277.4 | 1.90 | 0.70 | 50.1 | 0.380 |

Resulting impedance at the 580's four frequencies (baseline, |Z| in Ω; R/Xc/PA at 50 kHz):

| Segment | 5 kHz | 50 kHz | 250 kHz | 500 kHz | R50 / Xc50 / PA50 |
|---|---|---|---|---|---|
| Arm | 428 | 388 | 354 | 346 | 387.0 / 31.9 / 4.71° |
| Trunk | 90 | 82 | 75 | 73 | 81.3 / 6.7 / 4.71° |
| Leg | 387 | 351 | 320 | 313 | 349.6 / 28.8 / 4.71° |
| Whole body (RA+TR+RL) | 905 | 821 | 749 | 732 | 818.0 / **67.3** / **4.71°** |

Checks against sources:
- Drop from 5 to 500 kHz is 19.1 %. The 50 to 250 kHz drop is 8.8 %, matching [12].
- Whole-body PA of 4.7° matches InBody 770 women (4.7 ± 0.5°) [19].
- Whole-body Xc at 50 kHz is 67 Ω.
- Segment shares at 50 kHz are 47.3 / 9.9 / 42.7 %, matching [11].
- PA is low at 5 kHz (2.0°), peaks near 50 kHz, and falls again by 500 kHz (2.5°). This is why PA is reported at 50 kHz.

**Scenarios** (same code, for animation states):

| State | Change | Whole-body Z5 / Z50 / Z500 (Ω) | PA50 | ECW/TBW |
|---|---|---|---|---|
| Baseline | — | 905 / 821 / 732 | 4.71° | 0.380 (InBody "Normal") |
| More extracellular fluid (e.g., swelling) | Re ÷ 1.10 (ECW +10 %) | 824 / 754 / 679 | 4.33° | 0.403 ("Over") |
| Less cell mass | Ri ÷ 0.90 (ICW −10 %), Cm × 0.90 | 907 / 830 / 748 | 4.29° | 0.405 ("Over") |

Both states raise ECW/TBW and lower PA, but for different reasons. That is the honest teaching point: **a high ratio does not say *why*.**

**Caveats on absolute ohms.** The arm anchor comes from Chinese women aged 18–55 on an InBody 770, and the segment shares come from a 1996 electrode setup that is not InBody's. Larger bodies and men read lower: more cross-section A means lower R. The model trunk value (~82 Ω at 50 kHz) is set by Bracco's 10 % share. InBody's own printed trunk Z is typically a few tens of Ω because of its electrode geometry, but **I could not verify that number this session** (LOW). Label any on-screen ohms as "example values" and keep the ratios (arm ≈ leg ≫ trunk; Z falls about 15–20 % from 5 to 500 kHz) as the message.

Minimal `model.mjs` core:
```js
const ALPHA = 0.70, K_ICW = 5.255;
export function cole({Re, Ri, Cm}, f) {
  const R0 = Re, Rinf = Re*Ri/(Re+Ri), fc = 1/(2*Math.PI*Cm*(Re+Ri));
  const x = (f/fc)**ALPHA, th = ALPHA*Math.PI/2;
  const dr = 1 + x*Math.cos(th), di = x*Math.sin(th), d = dr*dr + di*di, k = R0 - Rinf;
  const R = Rinf + k*dr/d, Xc = k*di/d;
  return { R, Xc, Z: Math.hypot(R, Xc), pa: Math.atan(Xc/R)*180/Math.PI, fc };
}
export const ecwTbw = ({Re, Ri}) => (1/Re) / (1/Re + K_ICW/Ri);
export const FREQS_580 = [5e3, 50e3, 250e3, 500e3];
```

### Misconceptions to avoid

1. **"The 580 is a 3-frequency device (5/50/500)."** It is not. The 580 uses **5, 50, 250 and 500 kHz** (20 readings). 5/50/500 kHz is the **570**. Don't draw a 1 kHz or 1 MHz channel on the 580; those belong to the 770 and the BWA.
2. **"Low-frequency current cannot enter cells at all; high frequency measures all water."** It is graded, not a switch. At 5 kHz a little current still crosses the membranes (PA ≈ 2° in the model), and even at 500 kHz the membranes are not fully shorted. R∞ is an extrapolation. Say that 5 kHz is mostly extracellular water and that 500 kHz approaches total body water.
3. **"BIA measures fat and muscle."** It measures impedance. Water, lean mass and fat are *estimated* by equations (proprietary for InBody) that also use height, weight, sex and age. Current travels through water- and electrolyte-rich tissue; fat is the poor conductor it largely avoids.
4. **"The trunk is half the body, so it's half the reading."** It is about 48 % of fat-free mass but only about 10 % of impedance [11]. That is why whole-body BIA is insensitive to trunk change and why segmental measurement exists.
5. **"Phase angle is a fixed health score with universal norms."** Values depend on device, electrode geometry, population and age. InBody 770 women in Japan average 4.7° [19]; RJL hand-to-foot data from US adults average 6.5° for women [21]. **Never compare an InBody phase angle to an RJL or Akern reference.** Show "typical patterns": higher in men, highest around the 30s, lower with age. Do not show cut-points as a diagnosis.
6. **"ECW/TBW above 0.390 means edema."** InBody calls it "Slightly Over" or "Over" and says it *may* indicate swelling or excess ECW [17][18]. A falling ICW, as with age-related muscle loss, raises the ratio too [27], and inflammation and other factors shift it as well. No diagnosis.
7. **"Phase angle is measured at every frequency on the 580."** The 580 reports phase angle **at 50 kHz only**, as 5 segmental values plus a whole-body value.
8. **"Impedance and resistance are the same number."** At 50 kHz and PA ≈ 5°, |Z| and R differ by about 0.4 %, so either is fine on screen if labelled. At 5 and 500 kHz the difference is smaller still.
9. **"The characteristic frequency is exactly 50 kHz."** It is about 50 kHz for healthy muscle [14], but it varies by tissue and person. 50 kHz is a convention [15].
10. **"Stronger current = more accurate / it might hurt."** The 580 uses 200 µA, which cannot be felt. Contraindications for implanted electronic devices such as pacemakers appear in InBody manuals generally, but I did **not** verify the 580 wording this session; check §Safety in [2] before any copy mentions it.

### Sources

All URLs were surfaced and quoted through web search. Direct fetches were blocked by the session's network policy, so "opened" means read through search extracts, not a full page view.

1. InBody Co. *InBody580* product page (global). https://inbody.com/en/inbody/contents/view_580. Also the Korean page https://inbody.com/kr/inbody/contents/view_580 and InBody USA https://inbodyusa.com/products/inbody580/
2. InBody Co. *InBody580 User's Manual*, EN rev B (2024-01-11), §9.2 Specifications. https://inbodycanada.ca/wp-content/uploads/2024/03/InBody580_User_Manual_EN_B_240111.pdf. Rev C copy: https://device.report/m/e38edda0d67a95ed2587882e6c8a43fb8b92de2bfac44b644885bd77c6354f04.pdf. InBody USA support: https://inbodyusa.zendesk.com/hc/en-us/articles/26353240142228-InBody-580-User-s-Manual
3. InBody Middle East. *InBody 580*. https://mea.inbody.com/product/InBody-580.php. InBody Canada product page: https://inbodycanada.ca/products/inbody-580-body-composition-analyzer/. Australian page with the 5/50/500 inconsistency: https://au.inbody.com/inbody580/
4. InBody Co. *InBody580 catalog* (ENG rev C, 2024-03-20, via InBody Sweden). https://www.inbodysweden.nu/wp-content/uploads/2024/04/580_catalog_eng_C_240320_low.pdf. MedicalExpo copy: https://pdf.medicalexpo.com/pdf/inbody/inbody580/67849-280564.html
5. InBody Co. *InBody580 result sheet (EN)*. https://fr.inbody.com/wp-content/uploads/2024/04/580-EN.pdf
6. InBody Co. *InBody770* product page and *InBody 770 Training Manual*. https://inbody.com/en/inbody/contents/view_770 ; https://inbodycanada.ca/wp-content/uploads/2020/04/InBody-770-Training-Manual.pdf
7. InBody Canada. *InBody Technology* (8-point tactile electrodes; thumb and heel voltage sensing). https://inbodycanada.ca/how-it-works/inbody-technology/ ; https://mea.inbody.com/learn/technology.php
8. As [2] and [4] for the applied current of 200 µA (±20 µA).
9. InBody Co. *InBody570*. https://inbody.com/en/inbody/contents/view_570 ; *InBody570 User's Manual* (ENG D). https://uk.inbody.com/wp-content/uploads/2019/01/570_manual_ENG_D_150520.pdf
10. Delta Fitness distributor data sheets (InBody 570: 400 µA; InBody 770: 80 µA). https://www.delta-fitness.com/products/body-composition-analyzer-570 ; https://www.delta-fitness.com/products/body-composition-analyzer-770
11. Bracco D, Thiébaud D, Chioléro RL, Landry M, Burckhardt P, Schutz Y. Segmental body composition assessed by bioelectrical impedance analysis and DEXA in humans. *J Appl Physiol* 1996;81(6):2580–2587. https://journals.physiology.org/doi/full/10.1152/jappl.1996.81.6.2580 ; PubMed 9018509: https://pubmed.ncbi.nlm.nih.gov/9018509/
12. Zhuang et al. Bioelectrical impedance analysis for early screening of upper limb subclinical lymphedema: a case–control study. *PLoS ONE* 2022;17(9):e0274570. doi:10.1371/journal.pone.0274570. https://pmc.ncbi.nlm.nih.gov/articles/PMC9484636/
13. Liu et al. Determination of bioelectrical impedance thresholds for early detection of breast cancer-related lymphedema. *Int J Med Sci* 2021;18:2990–. https://www.medsci.org/v18p2990.htm ; https://www.ncbi.nlm.nih.gov/pmc/articles/PMC8241780/
14. Mohamed et al. Bioimpedance spectroscopy: Is a picture worth a thousand words? *Semin Dial* 2025. doi:10.1111/sdi.13084. https://onlinelibrary.wiley.com/doi/10.1111/sdi.13084
15. Ward LC, Brantlov S. Bioimpedance basics and phase angle fundamentals. *Rev Endocr Metab Disord* 2023. https://link.springer.com/article/10.1007/s11154-022-09780-3 (author attribution MEDIUM)
16. Gupta D et al. Bioelectrical impedance phase angle in clinical practice: implications for prognosis in stage IIIB and IV non-small cell lung cancer. *BMC Cancer* 2009;9:37. https://bmccancer.biomedcentral.com/articles/10.1186/1471-2407-9-37
17. InBody. *The Professional's Guide to the InBody Result Sheet*. https://uk.inbody.com/wp-content/uploads/2018/08/The_Professional_s_Guide_to_the_InBody_Result_Sheet.pdf ; *Result Sheet Interpretation*: https://au.inbody.com/result-sheet-interpretation/
18. InBody Research. *Result Sheet Interpretation – parameter keynote* (ECW ratio tiers). https://research.inbody.com/result-sheet-interpretation-parameter-keynote/
19. Phase angle reference values measured using InBody770 in Japanese individuals with normal fluid balance. *Cureus*. https://pmc.ncbi.nlm.nih.gov/articles/PMC13422922/ ; PubMed 42535196
20. Normative reference values of the phase angle for Korean population: an analysis of KNHANES. *Aging Clin Exp Res* 2025. doi:10.1007/s40520-025-03130-4. https://pmc.ncbi.nlm.nih.gov/articles/PMC12276114/
21. Barbosa-Silva MCG, Barros AJD, Wang J, Heymsfield SB, Pierson RN Jr. Bioelectrical impedance analysis: population reference values for phase angle by age and sex. *Am J Clin Nutr* 2005;82(1):49–52. doi:10.1093/ajcn/82.1.49. https://www.sciencedirect.com/science/article/pii/S0002916523295088
22. Bosy-Westphal A, Danielzik S, Dörhöfer RP, et al. Phase angle from bioelectrical impedance analysis: population reference values by age, sex, and body mass index. *JPEN* 2006;30(4):309–316. https://www.researchgate.net/publication/6980836
23. InBody India blog. *Phase angle explained*. https://www.inbody.in/blog/phase-angle-explained-what-is-a-good-phase-angle-and-why-it-matters (vendor content)
24. Lafontant K et al. Comparing device-generated and calculated bioimpedance variables in community-dwelling older adults. *Sensors* 2024;24(17):5626. doi:10.3390/s24175626. https://pmc.ncbi.nlm.nih.gov/articles/PMC11397826/
25. Kyle UG, Bosaeus I, De Lorenzo AD, et al. (ESPEN). Bioelectrical impedance analysis, part I: review of principles and methods. *Clin Nutr* 2004;23(5):1226–1243. doi:10.1016/j.clnu.2004.06.004. https://pubmed.ncbi.nlm.nih.gov/15380917/ ; free PDF: https://espen.org/documents/BIA1.pdf (canonical review for the capacitor/frequency physics and R = ρL/A; the specific passages were not seen this session, so MEDIUM)
26. Organ LW, Bradham GB, Gore DT, Lozier SL. Segmental bioelectrical impedance analysis: theory and application of a new technique. *J Appl Physiol* 1994;77(1):98–112. https://journals.physiology.org/doi/abs/10.1152/jappl.1994.77.1.98 (citation and abstract only; its segment percentages were not retrieved)
27. Relationship between body water distribution and sarcopenia in older adults: a systematic review (2025). https://www.ncbi.nlm.nih.gov/pmc/articles/PMC12922294/

Also consulted, not used for numbers: Khalil SF, Mohktar MS, Ibrahim F. *Sensors* 2014;14(6):10895–10928 (Cole model review), doi:10.3390/s140610895. Jiang et al., *Sensors* 2022;22(7):2681 (estimated vs measured segmental R/Xc/PA), https://www.mdpi.com/1424-8220/22/7/2681. Yang et al., *Life* 2023 (InBody970 vs BWA phase angle interchangeable, ICC 0.993), https://pmc.ncbi.nlm.nih.gov/articles/PMC10220628/. Foster KR, Lukaski HC. *Am J Clin Nutr* 1996;64:388S–396S (citation only).

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

**How Fig 3 uses these numbers** (`figures/03-iv-iron/model.mjs`)

| Shown or animated | Value | From |
|---|---|---|
| Gut gate (dock boom, silo boom, readout "% open") | 1 / (1 + hepcidin), hepcidin in units where 1 halves absorption | model; the 24 h pulse after a pill is tuned to Moretti 2015 (next-day absorption −38 %, published −35 to −45 %) |
| Iron absorbed, daily vs alternate-day (14 doses) | 130 vs 173 mg | Stoffel 2017: 131 vs 175 mg |
| IV dose | 1000 mg once | Monoferric simplified table for 50–<70 kg, Hb ≥ 100 g/L (verify against the Canadian monograph) |
| Ferritin (silo level, readout) | IV: peak ≈ 470 µg/L near day 5–7, ≈ 170 at week 7, ≈ 150 at week 8; daily pills: 8 → 19 | model tuned to label (peak ~7 d) and Kawabata 2022 (< 250 after week 5) |
| Haemoglobin (counter, readout) | IV: 105 → 115 (wk 2) → 130 (wk 8); daily pills: 105 → 128 (wk 8); alternate-day 60 mg: 123 | model tuned to FERWON-IDA (≈ +25 g/L at week 8) |
| Ingots per cart | each cradle filled with probability ≈ 0.3 × (iron arriving per day) / 25 mg; capped 4–60 % | derived proxy for transferrin saturation (normal TSAT ≈ 30 % at ≈ 25 mg/day recycling; < 20 % in iron deficiency); not printed as a number |
| Red discs on the tray | one per ≈ 2.2 g/L of Hb gained | drawing proxy for new red cells |
| Press speed | proportional to the marrow's iron uptake | model |
| Tanker | drives in at hour 0–10, parks to hour 40, leaves by hour 60 | a single visit, compressed; the IV complex's 27 h plasma half-life is in the model, not the tanker |
| Timeline | 56 days; recheck band at weeks 6–8 | clinic's recheck |

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

The model is implemented in `figures/03-iv-iron/model.mjs` (parameters annotated SOURCED / TUNED / ASSUMPTION).

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

---

## Brief: what each figure needs

### 1. Menopause: thermoneutral zone
Core-temperature sweating and shivering thresholds. Zone width in symptomatic vs asymptomatic women (Freedman's work, about 0.4 °C → near 0; verify). What narrows it: estrogen withdrawal, KNDy neurons / neurokinin B / NK3 receptor, central noradrenaline. What widens it: estrogen therapy, NK3 antagonists (check Health Canada status before naming a drug). Hot-flash duration, skin-temperature rise, heart-rate change, frequency, the small core rise that triggers one, and the after-chill. SWAN median duration of vasomotor symptoms.

### 2. InBody 580: bioimpedance
The 580's exact frequencies (verify; don't assume they match the 570), number of impedance readings, the 8-point tactile electrodes, the 5 segments and the test time. ECW/TBW normal range (0.360–0.390). Phase angle at 50 kHz and typical ranges. Why low frequency only reaches extracellular water (membranes act as capacitors) while high frequency passes through cells. Why the trunk is about half the mass but only about 10% of the impedance (R = ρL/A). Typical whole-body and segment impedance in Ω.

### 3. IV iron vs oral iron
Total body iron and how it's split (Hb, ferritin stores, myoglobin, transferrin pool). Daily absorption, macrophage recycling and losses. Hepcidin → ferroportin mechanism. An oral dose raises hepcidin for about 24 h (Moretti 2015, Stoffel 2017 alternate-day dosing: get the numbers). IL-6 / inflammation. Transferrin carries 2 Fe³⁺. Monoferric (ferric derisomaltose) dosing and infusion time, plus iron sucrose for contrast. Timeline of the Hb rise after IV iron. Ferritin and TSAT thresholds (note Canadian cut-offs). Honest side effects.

### 4. Creator 600 + running biomechanics
What the Visbody Creator600 measures and how (cameras/sensors, frame rate, outputs). Typical cadence. The effect of a +5% / +10% step rate on knee and hip energy absorption and patellofemoral force (Heiderscheit 2011, Lenhart 2014). Knee flexion at initial contact and at peak stance. Typical vertical oscillation (cm) and vertical ratio (%). Definition of overstride. Peak vertical GRF (about 2–3× BW).

### 5. VO2max ramp on a bike ergometer
Ramp design (8–12 min, W/min increments). ΔVO2/ΔWR ≈ 10 ml/min/W. Plateau and secondary criteria (RER ≥ 1.10, HR, RPE). VT1 / VT2 and RER crossing 1.0. Metabolic-cart parts (flow turbine vs pneumotach, O₂ and CO₂ analyser types, breath-by-breath vs mixing chamber, Haldane). Fick equation with rest vs max values. Mandsager 2018 / Kokkinos 2022 mortality link. FRIEND cycle-ergometer percentiles (ages 30–69, M/F, 25/50/75/90th). Cycling values run about 10–15% below treadmill.
