# Truth pack

Every number a figure shows, animates or prints comes from this file, with a source and a confidence. Format per figure: **Mechanism in 3 sentences** · **Model numbers** (quantity | value | units | source | confidence) · **Equations / curves** · **Misconceptions to avoid** · **Sources**.

> **Verification status (2026-10-11).** This cloud session's network policy blocked direct access to PubMed/PMC, Europe PMC, Crossref, Health Canada's drug database and manufacturer sites, so values were checked against the abstracts and extracts that web search returns, not against full text. Confidence levels reflect that. Before public launch, a reviewer with normal web access should open the sources marked MEDIUM or LOW. To let a future session open them itself, allow `pubmed.ncbi.nlm.nih.gov`, `pmc.ncbi.nlm.nih.gov`, `www.ebi.ac.uk`, `api.crossref.org`, `health-products.canada.ca` and `dhpp.hpfb-dgpsa.ca` in the environment's network settings.
>
> The Fig 4 and Fig 5 research drafts moved into §4 and §5 below when the figures were built.

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
| A1: DMT1 (divalent metal transporter 1) brings Fe²⁺ into the gut cell at the brush border; dietary Fe³⁺ is first reduced (Dcytb) | mechanism | — | [K] Gunshin H et al., Nature 1997;388:482–488; McKie AT et al., Science 2001;291:1755–1759 | HIGH (fact) / MEDIUM (citation) |
| A1: ferroportin is the only known cellular iron exporter in mammals; hephaestin oxidises exported iron for transferrin | mechanism | — | [K] Donovan A et al., Cell Metab 2005;1:191–200; Vulpe CD et al., Nat Genet 1999;21:195–199 | HIGH (fact) / MEDIUM (citation) |
| A1: gut lining cells are shed from the villus tips within a few days, taking unexported (ferritin) iron with them | ≈ 3–5 | days | [K] textbook (Hentze 2010, 47) | MEDIUM |
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

## 4. Creator 600 and running biomechanics

> **How this section was researched (read first).** In this session WebFetch and curl could not reach any host (DNS failure for WebFetch; egress proxy 403 for curl), and the shared web-search budget ran out partway through. Every value below comes from search-engine extracts of the cited pages (abstracts, PMC/author-manuscript text, manufacturer manuals) or from Optimal's own Creator600 screenshots in `reference/equipment/`. **HIGH** = seen in the primary source's own text (abstract, table extract, manual). **MEDIUM** = from a primary source but only partly seen, or consistent across several secondary sources. **LOW** = a single secondary source, an inference from photos or screenshots, or a textbook value not re-checked this session. LOW values must not appear as on-screen numbers until someone checks them against the full text (PMC links are below).

### Mechanism in 3 sentences

At each landing the hip and knee extensors work eccentrically to absorb the body's downward and braking momentum, and how much they absorb depends on how far ahead of the centre of mass (COM) the foot lands and how far the COM drops. At a fixed speed, step length = speed ÷ cadence, so raising cadence by 5–10% shortens each step, brings the foot strike closer under the COM, and reduces COM vertical excursion, braking impulse and peak stance knee flexion. In healthy recreational runners these changes lower knee energy absorption (at +5% and +10%), hip energy absorption (at +10% only) and modelled peak patellofemoral force (−14% at +10%); all of these are group averages. The Creator600 tracks the runner markerlessly with a vision/depth sensor under its upright display. From the estimated joint positions it reports cadence, stride, vertical oscillation and vertical ratio, how far ahead of the centre of gravity the foot lands, knee angle, knee valgus/varus, and a proprietary low/medium/high joint-load rating.

### Model numbers

**A. Visbody Creator600 (manufacturer and distributor claims; no independent validation study found)**

| Quantity | Value | Units | Source | Confidence |
|---|---|---|---|---|
| Speed range | 0.5–20 | km/h | [1][3] | MEDIUM (vendor) |
| Incline range | 0–18 | % | [1][6] ("gradient 0–18"; reseller lists "electric incline 0–18%") | MEDIUM |
| Running surface | 580 × 1620 | mm | [3][6] | MEDIUM |
| Max user weight / machine weight | 180 / 360 | kg | [3] | MEDIUM |
| Assembled size | 2564 × 1024 × 2290 | mm (L × W × H) | [6] | LOW (reseller) |
| Motor | 6.8 | HP | [6] | LOW (one reseller, no official spec) |
| **Upright display** | **50″ 4K vertical** (one reseller: "original imported LG" panel) | in | [1][5][6] | MEDIUM. **Conflicts with Optimal's site copy and HANDOFF ("32″ upright display").** See Misconceptions §9. |
| Sensor | "Intel vision sensor" + "ViScan™"; also described as a "4D depth camera"; reseller: "Intel autonomous-driving specialised visual sensors", CPU > 3.6 GHz | none | [2][8][5] | MEDIUM for "Intel vision/depth sensor". No source names the model (e.g. RealSense). |
| Number of cameras | Not published. Photos show **one sensor module centred below the display, facing the runner.** | count | `creator600-hw-display.jpg`, `creator600-hw-side.jpg` | LOW (photo inference) |
| 3D output | Live screen lists per-joint coordinate triples, e.g. "Right hip (122.952, −53.179, 1078)". The third value runs about 1000–1900, which fits a depth distance in mm from a front-facing depth camera. | mm (inferred) | `creator600-display.png` | LOW (inference) |
| Joints named on the live screen | head, L/R shoulder, L/R elbow, L/R wrist, L/R hip (knees and ankles are drawn on the skeleton overlay) | none | `creator600-display.png` | MEDIUM (screenshot). Total keypoint count not published. |
| Frame rate / keypoints | "17+ skeletal points at 30 fps" (third-party guide, not Visbody) | fps | [33] | LOW. Do not display. |
| Analysis throughput | "39,800 posture analyses per minute" (distributor/listing); "thousands of posture analyses every minute" (Visbody) | /min | [4][5][2] | LOW (marketing, not a frame rate) |
| Real-time form analyses | "23 AI real-time running form analyses" (attributed to the A600/VA600 on Visbody pages) | count | [8] | LOW (may be a different model) |
| Outputs in Optimal's report screenshots | Dynamic joint load (L/R hip, L/R knee: low/medium/high); knee motion-angle curves L/R; knee valgus/varus L/R; left–right tilt; forward–backward tilt; landing centre-of-gravity deviation (cm, axis 0–30); vertical amplitude (cm), stride length (m), vertical ratio (%); cadence max/avg; running-form score; step count, average stride, speed, HR, kcal | none | `creator600-report-*.png`, `creator600-display.png`; [7] | HIGH (that these outputs exist) |
| Vertical-ratio formula used by the device | vertical amplitude ÷ "stride length" (report sample: 10 cm ÷ 0.6 m = **16.7 %**) | % | `creator600-report-t3-030.png` | HIGH |
| Vertical-ratio gauge ticks | 0 · 6.1 · 8.6 · 10.1 %. Identical to Garmin's chest-strap vertical-ratio band edges [19]. | % | `creator600-report-t3-030.png`; [19] | HIGH (ticks); MEDIUM (that they were borrowed from Garmin) |
| Visbody's "stride" = one step | Sample report: 10 km and 8750 steps → 1.14 m per step ≈ "average stride 110 cm" | m | `creator600-report-t3-035.png` | MEDIUM (inference) |
| Knee valgus/varus "risk zone" | valgus > 8–10°, varus > 7–8° | ° | [4] | LOW (unsourced distributor PDF; do not display) |
| Joint-load method | Not published. Optimal's copy: "estimated from tracked joint positions and how fast they change". No units, no validation. | none | site-copy.md; [7] | HIGH that it is proprietary/relative |

**B. Step-rate manipulation (the published percentages)**

| Quantity | Value | Units | Source | Confidence |
|---|---|---|---|---|
| Heiderscheit 2011: participants | 45 healthy recreational runners (25 M, 20 F), treadmill, constant speed | n | [10] | HIGH |
| Heiderscheit: preferred speed | 2.9 ± 0.5 | m/s | [10] (author manuscript), [11] | HIGH |
| Heiderscheit: preferred step rate | 172.6 ± 8.8 | steps/min | [10][11] | HIGH |
| Heiderscheit: conditions | preferred, ±5 %, ±10 % (metronome, randomised order, 15 s recorded each) | % | [10][11] | HIGH |
| Heiderscheit: definition of energy absorption | negative joint work over loading response (foot contact → peak knee flexion) | J/kg | [10] | HIGH |
| Knee energy absorption, +5 % | significantly lower (P < 0.01); **≈ −20 %** | % vs preferred | [10] direction; [30] magnitude | Direction HIGH; magnitude MEDIUM (widely quoted, not seen in the paper's table) |
| Knee energy absorption, +10 % | significantly lower (P < 0.01); **≈ −34 %** | % vs preferred | [10]; [30] | Direction HIGH; magnitude MEDIUM |
| Hip energy absorption, +5 % | no significant change | — | [10] | HIGH |
| Hip energy absorption, +10 % | significantly lower (P < 0.01). The paper says the hip showed the largest *percentage* change and the knee the largest *absolute* change. Magnitude not retrieved. | — | [10] | HIGH (direction); magnitude unknown |
| All joints, −10 % | "substantially" more energy absorption (P < 0.01) | — | [10] | HIGH (magnitude not retrieved) |
| Also lower with higher step rate | step length, COM vertical excursion, braking impulse, peak knee flexion, heel-to-COM horizontal distance at IC, foot inclination at IC; peak hip adduction angle and hip adduction/internal-rotation moments at +10 % | — | [10] | HIGH (direction) |
| COM vertical excursion, preferred → +10 % | 8.7 → 7.3 | cm | [30] (getfitcraft summary of [10]) | LOW |
| Peak stance knee flexion, preferred → +10 % | 46.3 → 42.8 | ° | [30] | LOW |
| Knee flexion at initial contact, 100 → 110 % | +1.8° (+10.6 %), implying a baseline of ≈17° | ° | search extract attributing it to a patellofemoral step-rate study (likely [12]) | LOW (source attribution unconfirmed) |
| Lenhart 2014: participants / conditions | 30 healthy adults; instrumented treadmill; 90 / 100 / 110 % of preferred step rate; 3-D musculoskeletal model | — | [12] | HIGH |
| **Peak patellofemoral (PF) joint force, 110 %** | **−14 %** vs preferred | % | [12] | HIGH |
| Peak PF joint force, 90 % | **+15 %** vs preferred | % | [12] (full-text extract) | HIGH |
| Strongest predictor of the PF-force drop | the reduction in peak stance knee flexion | — | [12] | HIGH |
| Muscle forces at higher step rate | hip, knee and ankle extensor and hip abductor forces lower in mid-stance; rectus femoris (early swing) and hamstring (late swing) loads higher | — | [12][13] | HIGH |
| Lenhart cohort speed / step rate (JOSPT companion) | 2.81 ± 0.38 m/s (2.4–3.8); 174 ± 9 spm (156–192); n = 30 | m/s, spm | [13] | HIGH |
| Meta-analysis, +10 %: moderate evidence | shorter step length (SMD 0.93, 0.49–1.37), lower peak hip adduction (0.40, 0.11–0.69), lower peak knee-extensor moment (0.50, 0.18–0.81) | SMD (95 % CI) | [15] | HIGH |
| Meta-analysis, +10 %: limited evidence | less negative hip work (0.55, 0.20–0.91) and knee work (0.84, 0.48–1.20) | SMD | [15] | HIGH |
| Meta-analysis, +10 %: peak vertical GRF | 0.24 (−0.11 to 0.59), **not significant** | SMD | [15] | MEDIUM (from a PMC table extract) |
| Meta-analysis, +10 %: average vertical loading rate | 0.24 (−0.23 to 0.70), not significant | SMD | [15] | MEDIUM |
| Meta-analysis: injury and performance | insufficient evidence to determine effects; higher RPE at +10 % | — | [15] | HIGH |
| Systematic review (10 studies) | higher stride rate → lower COM vertical excursion, GRF, shock attenuation, and energy absorbed at hip, knee and ankle | — | [14] | HIGH |
| Foot-strike change at +10 % | only 7/40 heel strikers (17.5 %) switched to a non-heel strike | n | [28] | HIGH (numbers); MEDIUM (author list) |
| Runners with patellofemoral pain, +10 % (one session; uncontrolled; n = 12) | at 4 wk / 3 mo: peak contralateral pelvic drop −3.12°, hip adduction −3.99°, knee flexion −4.09° (95 % CI 0.04–8.15); pain and function improved | ° | [16] | HIGH (abstract); weak design |

**C. Normative running values (cadence, oscillation, timing)**

| Quantity | Value | Units | Source | Confidence |
|---|---|---|---|---|
| Recreational runners at preferred speed (n = 860, 19–65 y, 38.5 % women): speed | 9.9 ± 1.5 (men 10.5 ± 1.3, women 9.0 ± 1.1) | km/h | [17] Table 1 | HIGH |
| … step cadence | **164 ± 9** | steps/min | [17] | HIGH |
| … step length | ≈ 1.0 ± 0.14 | m | [17] | MEDIUM (extract read "1 ± 0.14") |
| … contact time | 289 ± 35 (men 283, women 299) | ms | [17] | HIGH |
| … duty factor (stance ÷ stride time) | **39 ± 4** (women 41 ± 4) | % | [17] | HIGH |
| … vertical oscillation | **77 ± 12** (women 73 ± 11) | mm | [17] | HIGH |
| … peak vertical GRF | 2.23 ± 0.23 | BW | [17] | MEDIUM |
| Internal check on [17] | 2.75 m/s ÷ (164/60) = 1.01 m ✓; 289 ms ÷ (2 × 60/164 s) = 39.5 % ✓ | — | computed | HIGH |
| Cadence vs speed (experienced runners, treadmill) | ≈ 169 → 178 (2.68 → 3.83 m/s); stance and step time fell, all GRF variables rose | spm | [18] | HIGH |
| Garmin cadence colour bands (percentiles of Garmin's runner data) | red < 153 (< 5th pct) · orange 153–163 (5–29th) · green 164–173 (30–69th) · blue 174–183 (70–95th) · purple > 183 (> 95th). Newer manuals use 151/163/174/185. Garmin: "taller runners typically have slightly slower cadences". | spm | [19] | HIGH |
| "180 spm" origin | Jack Daniels' informal step counts of elite distance runners at the 1984 Olympics, at race pace. No peer-reviewed study. | spm | [29] (secondary accounts) | MEDIUM |
| Garmin vertical oscillation bands (735XT) | purple < 6.4 · blue 6.4–8.1 · green 8.2–9.7 · orange 9.8–11.5 · red > 11.5 (epix: 6.7/8.3/10.0/11.8; differ by chest vs waist sensor) | cm | [19] | HIGH |
| Garmin vertical ratio definition | vertical oscillation ÷ stride length (Garmin's "stride" = one footfall to the next, i.e. one step) | % | [19] | HIGH (definition); MEDIUM ("stride" wording) |
| Garmin vertical ratio bands (chest strap) | purple < 6.1 · blue 6.1–7.4 · **green 7.5–8.6** · orange 8.7–10.1 · red > 10.1. Waist pod: purple < 6.5, green 8.4–10.0. | % | [19] | HIGH |
| Vertical ratio implied by [17] | 77 mm ÷ 1.0 m ≈ 7.7 | % | computed from [17] | HIGH (arithmetic) |
| Running vs walking | Running = no double support, two "double float" phases per cycle. As speed rises, stance time and cycle time fall and swing and float increase. | — | [24] | HIGH |
| Toe-off in the running cycle | ≈ 40 % of the gait cycle (speed-dependent) | % cycle | [32][25] | MEDIUM |

**D. Ground reaction force**

| Quantity | Value | Units | Source | Confidence |
|---|---|---|---|---|
| Peak vertical GRF across running speeds 1.5–6.0 m/s | ≈ 2.0 → 2.9 (walking 1.0 → 1.5) | BW | [20] | HIGH |
| Cavanagh & Lafortune, 17 runners at 4.5 m/s: mean peak-to-peak force | vertical ≈ 3, antero-posterior ≈ 1, medio-lateral ≈ 0.3 | BW | [21] | HIGH |
| Rearfoot strikers at 3 m/s: impact peak / active peak | ≈ 1.6 / ≈ 2.5 | BW | [22] | MEDIUM |
| Recreational runners at ~9.9 km/h | 2.23 ± 0.23 | BW | [17] | MEDIUM |
| Effect of +10 % step rate on peak vGRF | small. Pooled change not significant [15]; one n = 20 study found a significant decrease at +5/+10 % [23]. | — | [15][23] | HIGH (that it's small and inconsistent) |

**How Fig 4 uses these numbers** (`figures/04-creator-600/model.mjs`; preferred = 165 spm; values at −10 % / preferred / +10 %)

| Shown or animated | Value | From |
|---|---|---|
| Pace (belt slats, stance foot travel) | 10 km/h fixed = 2.78 m/s | [17] recreational average 9.9 km/h |
| Cadence (slider, console counter, readout) | 148.5–181.5 spm, i.e. ±10 % of 165 | [17] 164 ± 9 spm; ±10 % is the range [10][12] tested |
| Step (readout) | speed ÷ cadence: 1.12 / 1.01 / 0.92 m | exact (equation 1) |
| Centre-of-mass bounce (gauge carriage and hold marks) | 7.7 cm × (cadence / 165)^−1.84: 9.35 / 7.70 / 6.46 cm peak to peak | VO₀ [17] HIGH; exponent fitted to [10 via 30] LOW, agrees with spring-mass ≈ 2 |
| Vertical ratio (readout) | bounce ÷ step: 8.3 / 7.6 / 7.0 % | equation 5; the preferred value is HIGH arithmetic from [17] |
| Kneecap load (readout, knee glow, display bars) | peak patellofemoral force 1.15 / 1.00 / 0.86, linear between | [12] HIGH |
| Stance and flight | duty factor 0.39: each foot on the belt for 39 % of the stride | [17] |
| Landing distance (belt marks, rail ruler, rider) | 24 cm × step ratio: 26.7 / 24 / 21.8 cm, drawn only, never printed | derived estimate (equation 8), LOW |
| Mannequin pose and the display's knee-angle trace | knee 18° at contact and 20° at toe-off at preferred; stance knee solved from hip and foot positions (peak ≈ 67° / 63° / 61°); swing path from textbook curves | [24][26] LOW; angles never printed |
| Centre of mass (marker, plumb laser) | from segment masses and their centre-of-mass positions | [34] |
| Mannequin proportions | segment lengths as fractions of a 170 cm height | [35] |

### Equations / curves

**1. Step and stride (exact).**
`f_s = cadence / 60` (steps/s) · `L_step = v / f_s` · `L_stride = 2 · L_step` · `t_step = 1 / f_s` · `t_stride = 2 / f_s`.
At 10 km/h (2.778 m/s) and 165 spm: f_s = 2.75 /s, **L_step = 1.010 m**, L_stride = 2.020 m, t_step = 0.364 s.
At a fixed speed, a k % cadence change scales step length by 1/(1 + k/100), so +5 % gives ×0.952 and +10 % gives ×0.909.
Naming: cadence counts both feet (steps/min). Garmin's and Visbody's "stride length" is really one step.

**2. Timing within a stride** (phase φ = 0–100 % of one stride; right IC at 0).
Duty factor DF = 0.39 [17]. Right toe-off is at φ ≈ 39 %, left IC at 50 %, left toe-off at ≈ 89 %. The double-float (flight) phases run from 39 to 50 % and from 89 to 100 %.
Within one *step*, contact takes `DF × 2 ≈ 0.78` of the step and flight ≈ 0.22.
Keep DF constant across the cadence slider (modelling assumption). Contact time does change with speed [18], but no step-rate value was retrieved.

**3. Sagittal joint-angle keyframes for the mannequin** (flexion positive). **All LOW: textbook running shape (≈ 3 m/s), not re-checked this session.** Verify against Novacheck 1998 Fig. kinematics [24] or the open Fukuchi 2017 dataset [26] before any angle appears as a number. They are fine to use as animation geometry.

| Event (φ) | IC (0 %) | Peak stance knee flexion / mid-stance (≈ 15–20 %) | Toe-off (≈ 39 %) | Mid-swing (≈ 70 %) | Late swing (≈ 90–95 %) |
|---|---|---|---|---|---|
| Knee flexion (°) | ≈ 17 (15–20) | ≈ 45 (40–46) | ≈ 20 | ≈ 90 peak (80–100 at jogging; more when faster) | ≈ 10 (near extension), then flexes to IC |
| Hip flexion (°) | ≈ 32 (30–35) | ≈ 10 | ≈ −10 (peak extension, around or just after toe-off) | ≈ 30 and rising | ≈ 40–45 peak, then a slight extension into IC |

Use smooth periodic splines (e.g. Catmull-Rom on the keyframes, wrapped at 100 %). The left leg is the same curve shifted by 50 %.
Cadence modulation of the knee (LOW magnitudes, HIGH directions): peak stance flexion `45° − 0.35°/(% step-rate change)` (from 46.3 → 42.8 at +10 %). IC flexion `17° + 0.18°/%` (from +1.8° at +10 %).

**4. COM vertical displacement.** There are two oscillations per stride (one per step). The low point is at mid-stance (≈ 39 % of each step after IC), the high point at mid-flight (≈ 89 % of the step).
Simple model: `y(s) = −(VO/2) · cos(2π (s − 0.39))`, where s = fraction of the step since IC and VO = peak-to-peak oscillation.
More physical version: a half-sine dip during contact and a ballistic parabola in flight. Flight rise alone is only `g · t_flight² / 8 ≈ 0.7 cm` at t_flight ≈ 77 ms, so most of the excursion comes from leg compression in stance.

**5. Cadence → oscillation (model).**
`VO(f) = VO₀ · (f / f₀)^(−k)`. k = 1.84 fits the LOW Heiderscheit pair (8.7 → 7.3 cm at +10 %). A simple spring-mass/ballistic argument gives k ≈ 2, so the two agree.
VO₀ = 7.7 cm at preferred cadence (HIGH, [17]). Vertical ratio `VR = VO / L_step`.

**6. Cadence → joint load (condition means; linearly interpolate between them).**

| Step-rate change vs preferred | −10 % | −5 % | 0 | +5 % | +10 % | Source / confidence |
|---|---|---|---|---|---|---|
| Step length (relative) | 1.111 | 1.053 | 1.000 | 0.952 | 0.909 | exact |
| Peak PF joint force (relative) | **1.15** | 1.075* | 1.00 | 0.93* | **0.86** | [12] HIGH; *linear interpolation (assumption; Lenhart tested only 90/100/110 %) |
| Knee energy absorption (relative) | > 1 (sig., magnitude n/r) | n/r | 1.00 | **0.80** | **0.66** | [10] direction HIGH; [30] values MEDIUM |
| Hip energy absorption (relative) | > 1 (sig.) | n/r | 1.00 | ≈ 1.00 (n.s.) | < 1 (sig., magnitude n/r; largest % change of any joint) | [10] HIGH direction |
| COM vertical excursion (cm, Heiderscheit) | ↑ | – | 8.7 | – | 7.3 | LOW values; HIGH direction |
| Peak stance knee flexion (°) | ↑ | – | 46.3 | – | 42.8 | LOW values; HIGH direction |
| Heel-to-COM distance at IC, braking impulse, foot inclination at IC | ↑ | – | ref | – | ↓ | [10] HIGH direction; magnitudes not retrieved |
| Peak vertical GRF | ~ | ~ | 1.00 | ~ | small, n.s. change | [15] |

(n/r = not retrieved; n.s. = not significant; sig. = significant.)

**Recommended drivers for the figure:**
- **Knee load lamp / "knee load (relative)" readout:** use Lenhart's PF force. It is the only knee-load measure with HIGH-confidence values in both directions. Caption it as "modelled kneecap-joint force, group average".
- If the energy-absorption figures are shown, show them only at +5 % and +10 % (≈ −20 %, ≈ −34 %) and only after the paper's table has been checked.
- **Hip lamp:** flat until about +5 %, then one step lower at +10 %. Higher above preferred.

**7. Worked table at 10 km/h with preferred = 165 spm** (the slider range of ±10 % keeps every value inside the studied range; 150 → 185 spm would run to −9 / +12 %, so clamp effects at +10 %).

| Cadence (spm) | Change | Step length (m) | Stride (m) | VO (cm, model §5) | Vertical ratio (%) | PF force (rel.) | Knee energy abs. (rel.) |
|---|---|---|---|---|---|---|---|
| 148.5 | −10 % | 1.122 | 2.245 | 9.35 | 8.3 | 1.15 | ↑ (n/r) |
| 156.8 | −5 % | 1.063 | 2.127 | 8.46 | 8.0 | 1.075* | n/r |
| 165 | 0 | 1.010 | 2.020 | 7.70 | 7.6 | 1.00 | 1.00 |
| 173.3 | +5 % | 0.962 | 1.924 | 7.04 | 7.3 | 0.93* | 0.80 |
| 181.5 | +10 % | 0.918 | 1.837 | 6.46 | 7.0 | 0.86 | 0.66 |

**8. Overstride geometry (model).** Overstride = horizontal distance from the COM (plumb line) to the heel or ankle at initial contact (this is how [10] measures it).
No absolute heel-to-COM values were retrieved. As a rough physical estimate: COM travel during contact is ≈ v · t_c ≈ 2.75 × 0.289 ≈ 0.80 m, and the COM passes over the centre of pressure around mid-stance, so a heel lands roughly 0.2–0.3 m ahead of the COM at preferred cadence. **LOW, derived, do not display.**
Placeholder scaling: `d_IC(f) = d₀ · L_step(f) / L_step(f₀)`. This is conservative; the true reduction is probably larger, so replace it with Heiderscheit's table values once checked.
The Creator600 "landing centre-of-gravity deviation" axis runs 0–30 cm (sample value 10 cm). Its landmark definition is unpublished, so don't equate the two.

### Misconceptions to avoid

1. **180 spm is not a universal target.** It comes from Daniels' informal counts of Olympic distance runners at race pace [29]. Cadence rises with speed (≈169 → 178 spm from 2.68 → 3.83 m/s [18]) and is lower in taller runners [19]. Recreational runners average about 164 spm at about 10 km/h [17]. The evidence supports a **relative** +5–10 % change from the runner's own preferred rate [10][12][15]. Visbody's own report text says "approaching or reaching 180 steps/minute", and the figure should not repeat that.
2. **Overstriding is about where the foot lands relative to the COM, not heel striking itself.** A heel strike close under the COM is not an overstride. A +10 % cadence change switched only 17.5 % of heel strikers to another strike pattern [28].
3. **Joint-load changes are group averages** from healthy recreational runners on a lab treadmill (n = 45 [10], n = 30 [12]). Individuals vary. Lenhart's PF force is model-estimated, not measured. Label every load change as "typical, on average".
4. **Lower load per step is not lower load per kilometre.** +10 % cadence means 10 % more steps per km, which partly offsets the −14 % per-step PF force. Do not imply that total knee load falls by 14 %.
5. **"Impact" barely changes.** Peak vertical GRF change at +10 % is small and not significant in the meta-analysis [15]. Don't animate a big drop in ground force. Show the change in joint absorption and posture instead.
6. **No promised outcomes.** Evidence that cadence changes prevent injury or improve performance is insufficient [15]. The patellofemoral-pain evidence is a single uncontrolled n = 12 series [16]. Higher cadence also raises perceived effort (RPE) [15].
7. **Peak knee flexion falls while flexion at contact slightly rises** with higher cadence. Both fit the device's advice to "land with the knee slightly bent". Don't animate "more bend everywhere".
8. **The Creator600 is not a force plate.** "Dynamic joint load" is a proprietary low/medium/high rating derived from markerless pose estimation. No published method or validation was found. Its "knee motion angle" chart (values ≈ 30–85 over 0–100 s) is a time series with an unknown angle convention, so don't map lab joint-angle values onto it.
9. **Display size conflict.** Visbody and its resellers list a **50″ 4K vertical display** [1][5][6]; Optimal's site copy and HANDOFF say **32″**. Peter should measure the clinic's unit before either number is drawn or published. The hardware render also carries an "AICTM" logo (likely the OEM).
10. **Vertical-ratio bands are population percentiles, not efficiency grades,** and they shift with sensor position [19]. The site line "efficient runners typically sit under a 10 % vertical ratio" corresponds to Garmin's red cut-off (bottom ~5 %). Safer wording: "most runners sit under about 10 %; typical is about 7.5–8.6 %".
11. **Vendor sample screens are placeholder data. Don't reuse them.**
    - The live-screen mock shows 10 cm ÷ 0.6 m labelled as "5 %" (it should be 16.7 %).
    - The sample report's 10 km at 9′15″/km doesn't match its 01:23:30 duration, and 8750 steps over that time is ≈105 spm.
    - The site's demo pairing "7.5 km/h · 180 spm" implies a 0.69 m step, which is atypically short for that pace.
12. **Step vs stride.** Research "stride" = 2 steps. Garmin and Visbody use "stride length" for one step. The figure's "stride m" readout must say which one it shows.

### Sources

1. Visbody. Visbody Creator600: AI Treadmill for Fitness & Rehab Training. https://visbody.com/visbody-creator600/
2. Visbody. Visbody Creator600: The Ultimate AI Gait Analysis Treadmill (blog). https://visbody.com/blog/visbody-creator600-the-ultimate-ai-gait-analysis-treadmill/
3. Visbody Europe. Visbody Creator600 (specifications). https://www.visbodyeurope.eu/en/visbody-creator600
4. Antisel Physiotherapy. Visbody Creator600: Running Gait Analysis and Advantages (PDF, 11 Mar 2025); product page. https://www.antisel-physio.gr/wp-content/uploads/2025/05/Visbody-Creator600-Running-Gait-Analysis-and-Advantages.pdf · https://www.antisel-physio.gr/en/visbody-creator-600/
5. Made-in-China listing: Visbody Creator600 New Tech 3D Intelligent Running Evaluation Treadmill. https://meiawards.en.made-in-china.com/product/mOXtFyoAXlfa/China-Visbody-Creator600-New-Tech-3D-Intelligent-Running-Evaluation-Treadmill.html
6. GWEPTY. Visbody Creator600 – 3D Intelligent AI Treadmill (reseller listing). https://gwepty.com/products/visbody-creator600-3d-intelligent-ai-treadmill
7. Visbody. Enhancing Running Form and Preventing Knee Osteoarthritis with Creator600 (blog). https://visbody.com/blog/enhancing-running-form-and-preventing-knee-osteoarthritis-with-a600/
8. Visbody. VA600: Pioneering Fitness Technology in 3D Running Evaluation (blog). https://visbody.com/blog/va600-pioneering-fitness-technology-in-3d-running-evaluation/
9. Optimal Health. Creator600 screenshots and photos in this repo: `reference/equipment/creator600-display.png`, `creator600-report-*.png`, `creator600-hw-*.jpg`; `reference/site-copy.md`.
10. Heiderscheit BC, Chumanov ES, Michalski MP, Wille CM, Ryan MB. Effects of step rate manipulation on joint mechanics during running. *Med Sci Sports Exerc.* 2011;43(2):296–302. doi:10.1249/MSS.0b013e3181ebedf4. PMID 20581720; PMCID PMC3022995. https://pmc.ncbi.nlm.nih.gov/articles/PMC3022995/ · author manuscript: https://uwnmbl.engr.wisc.edu/pubs/acsm10.pdf
11. Chumanov ES, Wille CM, Michalski MP, Heiderscheit BC. Changes in muscle activation patterns when running step rate is increased. *Gait Posture.* 2012;36(2):231–235. PMC3387288. https://pmc.ncbi.nlm.nih.gov/articles/PMC3387288/
12. Lenhart RL, Thelen DG, Wille CM, Chumanov ES, Heiderscheit BC. Increasing running step rate reduces patellofemoral joint forces. *Med Sci Sports Exerc.* 2014;46(3):557–564. doi:10.1249/MSS.0b013e3182a78c3a. PMID 23917470; PMC3925193. https://pmc.ncbi.nlm.nih.gov/articles/PMC3925193/ (author list after Lenhart and Thelen is from memory; verify)
13. Lenhart R, Thelen D, Heiderscheit B. Hip muscle loads during running at various step rates. *J Orthop Sports Phys Ther.* 2014;44(10):766–774. doi:10.2519/jospt.2014.5575. https://www.jospt.org/doi/full/10.2519/jospt.2014.5575 (volume and pages from memory; verify)
14. Schubert AG, Kempf J, Heiderscheit BC. Influence of stride frequency and length on running mechanics: a systematic review. *Sports Health.* 2014;6(3):210–217. PMID 24790690; PMC4000471. https://pmc.ncbi.nlm.nih.gov/articles/PMC4000471/
15. Anderson LM, Martin JF, Barton CJ, Bonanno DR. What is the effect of changing running step rate on injury, performance and biomechanics? A systematic review and meta-analysis. *Sports Med Open.* 2022;8:112. doi:10.1186/s40798-022-00504-0. PMC9441414. https://pmc.ncbi.nlm.nih.gov/articles/PMC9441414/ (first, second and last authors seen; full author list from memory)
16. Bramah C, Preece SJ, Gill N, Herrington L. A 10% increase in step rate improves running kinematics and clinical outcomes in runners with patellofemoral pain at 4 weeks and 3 months. *Am J Sports Med.* 2019;47(14):3406–3413. doi:10.1177/0363546519879693. PMC6883353. https://pmc.ncbi.nlm.nih.gov/articles/PMC6883353/
17. Malisoux L, Napier C, Gette P, Delattre N, Theisen D. Reference values and determinants of spatiotemporal and kinetic variables in recreational runners. *Orthop J Sports Med.* 2023;11(10):23259671231204629. doi:10.1177/23259671231204629. PMID 37868213; PMC10588426. https://pmc.ncbi.nlm.nih.gov/articles/PMC10588426/
18. Leacox A, Fashingbauer L, Ferguson T, Zajakowski A, Baum B, Reinking M. The effect of running speed on cadence and running kinetics. *Int J Sports Phys Ther.* 2025;20(7):957–963. doi:10.26603/001c.140544. PMC12222555. https://pmc.ncbi.nlm.nih.gov/articles/PMC12222555/
19. Garmin owner's manuals, "Color Gauges and Running Dynamics Data" / "Vertical Oscillation and Vertical Ratio Data": Forerunner 735XT https://www8.garmin.com/manuals/webhelp/forerunner735/EN-US/GUID-2C73735B-C792-412D-AA92-706A8647DD77.html · Forerunner 620 https://www8.garmin.com/manuals/webhelp/forerunner620/EN-US/GUID-2C73735B-C792-412D-AA92-706A8647DD77.html · epix (Gen 2) https://www8.garmin.com/manuals/webhelp/GUID-E5C62F3F-DCE3-4197-8CA5-E419B2A55D12/EN-US/GUID-E2728EFE-C7BC-418E-A31D-D44FD12D1A4C.html · Forerunner 955 https://www8.garmin.com/manuals/webhelp/GUID-9D99A9D4-467A-4F1A-A0EA-023184FEA3DD/EN-US/GUID-62A09512-518A-424A-8491-FE2B80CD2091.html
20. Nilsson J, Thorstensson A. Ground reaction forces at different speeds of human walking and running. *Acta Physiol Scand.* 1989;136(2):217–227. doi:10.1111/j.1748-1716.1989.tb08655.x. https://onlinelibrary.wiley.com/doi/10.1111/j.1748-1716.1989.tb08655.x
21. Cavanagh PR, Lafortune MA. Ground reaction forces in distance running. *J Biomech.* 1980;13(5):397–406. doi:10.1016/0021-9290(80)90033-0.
22. Gottschall JS, Kram R. Ground reaction forces during downhill and uphill running. *J Biomech.* 2005;38(3):445–452. https://www.sciencedirect.com/science/article/abs/pii/S0021929004002283 (authors and pages from memory; verify)
23. Farina KA, Hahn ME. Increasing step rate affects rearfoot kinematics and ground reaction forces during running. *Biology (Basel).* 2022;11(1):8. doi:10.3390/biology11010008. PMC8772793.
24. Novacheck TF. The biomechanics of running. *Gait Posture.* 1998;7(1):77–95. doi:10.1016/S0966-6362(97)00038-6. PMID 10200378. Copy: https://www.niccostiff.co.uk/wp-content/uploads/2020/02/Biomechanics-of-running-gait.pdf
25. Hamner SR, Seth A, Delp SL. Muscle contributions to propulsion and support during running. *J Biomech.* 2010;43(14):2709–2716. https://nmbl.stanford.edu/publications/pdf/Hamner2010.pdf
26. Fukuchi RK, Fukuchi CA, Duarte M. A public dataset of running biomechanics and the effects of running speed on lower extremity kinematics and kinetics. *PeerJ.* 2017;5:e3298. doi:10.7717/peerj.3298. Data: http://pesquisa.ufabc.edu.br/bmclab/datasets/rbds/
27. Souza RB. An evidence-based videotaped running biomechanics analysis. *Phys Med Rehabil Clin N Am.* 2016;27(1):217–236. doi:10.1016/j.pmr.2015.08.006. https://escholarship.org/content/qt5v48m34m/qt5v48m34m.pdf
28. Allen DJ, Heisler H, Mooney J, Kring R. The effect of step rate manipulation on foot strike pattern of long distance runners. *Int J Sports Phys Ther.* 2016;11(1):54–63. PMID 26900500. https://pubmed.ncbi.nlm.nih.gov/26900500/ (author list from memory; verify)
29. Daniels J. *Daniels' Running Formula* (Human Kinetics). Secondary accounts of the 1984 observation: https://www.precisionpt.org/post/myth-busting-monday-is-180-steps-per-minute-the-ideal-cadence · https://marathonhandbook.com/running-cadence-demystified-why-180-isnt-magic-and-what-actually-matters/
30. Secondary summaries of [10] (the source of the −20 % / −34 %, 8.7 → 7.3 cm and 46.3° → 42.8° values): E3 Rehab, "Running Cadence" https://e3rehab.com/running-cadence/ · GetFitCraft, "Running Cadence Research" https://getfitcraft.com/science/running-cadence-research
31. Individual optimal step frequency during outdoor running. *Eur J Sport Sci.* doi:10.1080/17461391.2019.1626911. Experienced runners chose a step frequency slightly below the energy-optimal one. (Authors not verified.)
32. Physiopedia. Running Biomechanics (toe-off ≈ 40 % of the cycle). https://www.physio-pedia.com/Running_Biomechanics
33. optimalhealth.co, "Complete Guide to Gait Analysis Technology 2025" (third-party; **not Optimal Health Barrie**). Source of the "17+ skeletal points at 30 fps" claim. https://optimalhealth.co/resources/gait-analysis/complete-guide-gait-analysis
34. Winter DA. *Biomechanics and Motor Control of Human Movement*, 4th ed. Wiley, 2009. Table 4.1: segment mass fractions and centre-of-mass positions (after Dempster 1955). Values used: trunk-head-neck 0.578 (COM 0.66 from hip line), thigh 0.100 (0.433), leg 0.0465 (0.433), foot 0.0145 (0.50), upper arm 0.028 (0.436), forearm 0.016 (0.430), hand 0.006 (0.506). [K] standard textbook table, not re-opened this session; MEDIUM.
35. Drillis R, Contini R. *Body Segment Parameters*. Technical report 1166-03, New York University School of Engineering and Science, 1966; as drawn in Winter 2009, Fig. 4.1. Segment lengths as fractions of height H: thigh 0.245, leg 0.246, ankle height 0.039, foot 0.152, upper arm 0.186, forearm 0.146, hand 0.108, hip height 0.530, shoulder height 0.818, chin 0.870. [K] MEDIUM; used only to proportion the mannequin.


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

#### The wireless mask analyser (Optimal uses VO2 Master; Peter, 2026-10-11)
| Quantity | Value | Source | Confidence |
|---|---|---|---|
| What it measures | Breath-by-breath flow (ventilation) and expired O₂ on the mask; VO₂ computed per breath | [27][28] | MEDIUM (manufacturer FAQ and manual via search) |
| CO₂ | Not measured by the standard unit: VCO₂ assumes an average RQ of 0.85 (relevant to resting metabolic rate); a CO₂ sensor is described as an addition | [27] | MEDIUM. So the figures print no RER. |
| Link | Bluetooth to the company's free iOS and Android app (phone or tablet) | [27][29] | MEDIUM |
| Sensor accuracy | O₂ ±1 %; flow ±2 % with syringe calibration (±4 % without) | [27] | MEDIUM (manufacturer) |
| Weight, battery, range | 320 g with mask; AA battery, 8 h; Bluetooth 10–15 m | [30] | LOW (distributor listing, model MW-1200; may not be the Pro) |

**How Fig 5 uses these numbers** (`figures/05-vo2max/model.mjs`; one modelled person, 45 years, 75 kg)

| Shown or animated | Value | From |
|---|---|---|
| Test phases (timeline) | 3 min seated rest, 3 min unloaded pedalling, ramp to the ceiling (≈10 min) plus 1 min of plateau, 3 min recovery | [1][3][5] |
| Power (readout, brake magnets, tablet plot x) | ramp rate = (VO₂max − unloaded VO₂) / (10.3 × 10): 12.4 / 19.7 / 26.9 / 34.2 W/min for ceilings 25 / 35 / 45 / 55; peak 143 / 227 / 311 / 395 W | equation 1 [1][3][9] |
| VO₂ (readout, tablet number and plot y) | rest 3.5 ml/kg/min; unloaded 150 + 6 × 75 = 600 ml/min (8.0 ml/kg/min); +10.3 ml/min per W; first-order lag τ = 0.6 min; smooth ceiling | [21]; [9] MEDIUM; [7] HIGH; τ LOW (shape only) |
| Ceiling choices | 25 / 35 / 45 / 55 ml/kg/min | model values, not norms; no percentile shown (see the FRIEND blocker above) |
| Heart rate (readout) | 65 bpm at rest, rising in line with VO₂ to 208 − 0.7 × 45 = 176.5 at the ceiling | [16] HIGH for the maximum; resting value and linearity LOW |
| Breathing (the analyser's light and the tablet's breath marker) | rate 14 + 36x² breaths/min | LOW; motion only, never printed |
| No RER | the mask unit doesn't measure CO₂ [27] | — |
| Cadence (pedalling) | 60 rpm | [6] MEDIUM |
| Caption: mortality | 122,007 adults; low vs elite (≥ 97.7th percentile) adjusted HR 5.04; median follow-up 8.4 y | [18] HIGH |
| Caption: bike vs treadmill | bike about 13–22 % lower | [22][24][26] |
| Caption: FRIEND bike medians | men 41.9 (20s) and 19.5 (70s); women 31.0 and 14.8 | [22] HIGH |

**How Fig 6 uses these numbers** (`figures/06-vo2max-treadmill/model.mjs`; the same modelled person on the Creator 600)

| Shown or animated | Value | From |
|---|---|---|
| Oxygen cost of running (tablet guide, VO₂ target) | VO₂ = 0.2 S + 0.9 S G + 3.5 ml/kg/min (S m/min, G = 0.01): about 3.5 ml/kg/min per km/h | [20] ACSM running equation, MEDIUM-HIGH |
| Speed (readout, belt, side panel) | jog at the speed costing 65 % of the ceiling for 3 min, ramp to the ceiling in about 10 min, 1 min plateau, 3 min recovery jog: 5.5 → 9.6, 7.4 → 12.6, 9.3 → 15.7 km/h for 35 / 45 / 55 | model, from [1][3] (≈10 min ramps) |
| Cadence (running gait) | 169 + 7.83 × (speed in m/s − 2.68) spm | [18] Leacox 2025, two points, HIGH |
| Contact time (duty factor) | 0.39 at 2.75 m/s [17], −0.06 per m/s, kept 0.30–0.46 | LOW shape |
| Heart rate, the lag, the ceiling | as Fig 5 | as Fig 5 |
| Caption: treadmill vs bike | treadmill about 22 % above bike | [26] via secondary, MEDIUM |

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
27. VO2 Master. FAQ and manual (Rev 1.0.9, Aug 2025). https://vo2master.com/manual ; product page https://vo2master.com/vmpro/ (seen via search extracts, 2026-10-11)
28. VO2 Master. "The Drive with Peter Attia Q&A: You asked, VO2 Master answered." https://vo2master.com/blog/the-drive-with-peter-attia-qa/
29. UBC. "Venture profile: VO2 Master." https://star.ubc.ca/?p=2027
30. Q'sfix distributor listing (model MW-1200). https://pr.www.ipros.com/en/qsfix/product/detail/2001195310 (LOW; may not be the Pro)

**Leads to verify next session (not used as sources above):**
- Macfarlane DJ, "Automated metabolic gas analysis systems: a review," *Sports Med* 2001, for cart components and calibration.
- Wasserman K et al., *Principles of Exercise Testing and Interpretation* (5th ed.), for normal VT1 %, RER, VE, f, the women's VO₂peak formula and the VO₂ time constant on ramps.
- Whipp BJ et al. 1981 (*J Appl Physiol* 50:217), for the ramp τ.
- Bassett & Howley 2000 (*Med Sci Sports Exerc*), for limiting factors.
- Swain & Leutholtz 1997, for %HRR ≈ %VO₂R.
- de Souza e Silva CG et al., FRIEND reference equation for treadmill and cycle, *Eur J Prev Cardiol* 2018;25(7):742–750, PMID 29517365. Exists; it includes a mode term; coefficients not verified.

## A4. The heart (anatomical series)

| Quantity | Value | Source | Confidence |
|---|---|---|---|
| One beat at 75 bpm | 0.8 s: ventricular systole ≈ 0.3 s, diastole ≈ 0.5 s (another source gives 0.35 / 0.55 s at 67 bpm) | [A4-1][A4-2] | MEDIUM (educational sources) |
| As heart rate rises | diastole shortens much more than systole | [A4-3] | MEDIUM |
| Left ventricle at rest | ≈ 120 ml at the end of filling, ≈ 50 ml at the end of ejection: stroke volume 70 ml, ejection fraction ≈ 58 % | [A4-1] | MEDIUM |
| Stroke volume in strenuous exercise (untrained) | rises from ≈ 70 toward ≈ 120 ml; end-diastolic volume up, end-systolic volume down | [A4-3] | MEDIUM |
| Atrial squeeze ≈ 0.1 s, its share of filling ≈ 15–25 %, isovolumic phases ≈ 0.05–0.07 s | textbook | not found this session | LOW (drawing only) |
| Maximum heart rate, 45 years | 208 − 0.7 × age ≈ 176 bpm | §5 [16] Tanaka 2001 | HIGH |

Sources: [A4-1] BYU-Idaho, *Cardiac Measurements and Pressure Volume Loops*, https://books.byui.edu/docx/4415 · [A4-2] CCEA, *The Cardiovascular System* fact file, https://www.ccea.org.uk/downloads/docs/Support/A2%202%20Support/2019/A2%202%20The%20Cardiovascular%20System%20%28Fact%20file%29.pdf · [A4-3] RRCA, *Sport* (cardiac cycle at rest and exercise), https://www.rrca.org.uk/Portals/0/adam/Content/53819xob00qwej4ZRNARkg/Link/Sport.pdf (all seen via search extracts, 2026-10-11).

---

## A2. The hypothalamus (anatomical series)

Uses §1 rows 60–64 and sources 23–30 (Rance & Young 1991; Rometo 2007; Rance 2013; Mittelman-Smith 2012; Dacks 2011; Mittelman-Smith 2015; Krajewski-Hall 2019; Jayasena 2015). Nothing new is sourced.

### How A2 uses these numbers

- **KNDy soma area:** 194 % of premenopausal after menopause [Rance & Young 1991] (direction HIGH, % LOW), drawn as diameter × √1.94.
- **More NKB signalling after menopause** (gene expression up, hypertrophy) [Rance & Young 1991][Rometo 2007] is drawn as twice the burst rate and twice the packets. ILLUSTRATIVE: no human firing rates exist.
- **NKB → NK3R in the MnPO drives heat loss** [Rance 2013][Mittelman-Smith 2012][Dacks 2011]; NKB infusion causes flushes in women [Jayasena 2015]. These are drawn as the drive that tips the heat-loss centre.
- **Hot-flash rate readout** comes from Fig 1's `rateOf(e)`: ≈ 1.1 an hour symptomatic [Meldrum 1979; Freedman 1998; Low 2008].

---

## A9. Bone remodelling and estrogen (anatomical series)

| Quantity | Value | Source | Confidence |
|---|---|---|---|
| Remodelling phases, human | resorption ≈ 2 weeks, reversal ≈ 2 weeks, formation ≈ 13 weeks (≈ 17 weeks total) | [BRP-W] | MEDIUM (secondary) |
| Same, simulation study | resorption ≈ 22 d, reversal ≈ 8 d, formation ≈ 65 d, then quiescence 560–600 d | [BRP-F] | MEDIUM |
| Low estrogen raises the number of remodelling sites (activation frequency), mainly via more osteoclast formation; formation rises but lags resorption | qualitative | [Est-R] | MEDIUM-HIGH (review) |
| Estrogen promotes osteoclast apoptosis and inhibits their differentiation | qualitative | [Est-R] | MEDIUM |
| SWAN: fastest BMD loss from 1 year before to 2 years after the final menstrual period | ≈ 2.5 %/yr lumbar spine, ≈ 1.8 %/yr femoral neck | [SWAN-R] | MEDIUM-HIGH |
| SWAN: average loss over the 3 years around the final period | ≈ 6 % femoral neck, ≈ 7 % lumbar spine | [SWAN-3] | MEDIUM-HIGH |
| Lower body weight → faster loss (lowest vs highest tertile 35–55 % faster) | — | [SWAN-3] | MEDIUM (not shown) |

### How A9 uses these numbers

- **Phases:** 21 / 10 / 90 days (between the two timing sources).
- **Sites per year:** 3.6 → 9, and refill 100 % → 90 %. Both are ILLUSTRATIVE, chosen so the drawn strut loses ≈ 1.7 %/yr plus the open remodelling space, landing near SWAN's ≈ 6–7 % over 3 years. The directions are [Est-R].

Sources: [BRP-W] Wikipedia, *Bone remodeling period*, https://en.wikipedia.org/wiki/Bone_remodeling_period · [BRP-F] *Spatio-temporal simulations of bone remodelling using a bone cell population model based on cell availability*, Front Bioeng Biotechnol 2023, https://www.frontiersin.org/journals/bioengineering-and-biotechnology/articles/10.3389/fbioe.2023.1060158/pdf · [Est-R] review of estrogen deficiency and bone turnover, https://pmc.ncbi.nlm.nih.gov/articles/PMC1451218 · [SWAN-R] review citing SWAN rates, https://pmc.ncbi.nlm.nih.gov/articles/PMC8208668 · [SWAN-3] SWAN BMD across the menopause transition, https://pmc.ncbi.nlm.nih.gov/articles/PMC2266953/ (all seen via search extracts, 2026-10-12).

---

## A3. The finger's heat valves (anatomical series)

Uses §1 and Fig 1's `flashAt(t)`: finger skin rise +2.7 ± 0.2 °C (range 1–7) [Meldrum 1979; Kronenberg 1994], raised about 31 min [Meldrum 1979], heart rate +9 to +10 bpm [Low 2008], flash about 3.4 min [Low 2008].

| Quantity | Value | Source | Confidence |
|---|---|---|---|
| Arteriovenous anastomoses (AVAs) sit in glabrous skin (fingertips, palms, soles) and link arterioles straight to the venous plexus | qualitative | [K] textbook physiology | MEDIUM |
| AVAs are coiled and wrapped in glomus (modified smooth-muscle) cells; sympathetic vasoconstrictor nerves hold them shut, and withdrawing that tone opens them | qualitative | [K] textbook physiology | MEDIUM |
| Hot-flash sweating is mostly on the upper body (face, neck, chest), so A3 draws the finger's sweat glands idle | qualitative | [K] clinical description | LOW-MEDIUM |

### How A3 uses these numbers

- **Shunt lumen** = 1.6 + 7.4 × louvre px, and the wall thickens with it. The plexus is 7 + 7 × louvre px wide, and its colour mixes toward arterial by 0.6 × louvre. Dermal warmth opacity = 0.6 × skin ÷ 2.7. These are drawing proxies.
- **Blood flow per route:** through the arteriole 5/s; capillary loops 1.1/s each; shunts 9 × louvre² per second each. These are drawing proxies with no physiological flow numbers.

---

## A8. Water in and around muscle fibres (anatomical series)

Uses §2: ECW/TBW typical ≈ 0.380 and the InBody bands (< 0.390 normal, 0.390–0.400 slightly over, > 0.400 over) [17][18]; Fig 2's Fricke model for the share of current crossing membranes (2 / 17 / 23 / 24 % at 5 / 50 / 250 / 500 kHz).

| Quantity | Value | Source | Confidence |
|---|---|---|---|
| Skeletal muscle share of body mass | ≈ 40 % | [K] textbook | LOW-MEDIUM |
| Water content of skeletal muscle | ≈ 75 % | [K] textbook | MEDIUM |
| Muscle's share of total body water (derived: 0.40 × 0.75 ÷ 0.60) | ≈ 0.5 | derived | LOW |
| Extracellular space in skeletal muscle | ≈ 10–15 % of volume, taken as 16 % of muscle water | [K] textbook | LOW |
| Hypertrophy adds myofibrils in parallel (fibres widen); atrophy narrows them | qualitative | [K] textbook | HIGH (direction) |

### How A8 uses these numbers

- **Body ECW/TBW** = (E_muscle + E_rest) ÷ (water_muscle + water_rest). E_rest is chosen so "typical" = 0.380. E_muscle = 0.16 × gap × fibre, I_muscle = 0.84 × fibre². Scenes give 0.380 / 0.369 / 0.399 / 0.413. These are ILLUSTRATIVE magnitudes; the directions are sourced.

---

## A6. The red cell's 120 days (anatomical series)

Uses §3: red-cell lifespan ≈ 120 days [Franco 2012]; macrophage recycling ≈ 20–25 mg/day (model woman ≈ 13 mg/day at Hb 105) [Hentze 2010]; absorption 1–2 mg/day [Andrews 1999]; IV ferric derisomaltose taken up by liver and spleen macrophages [TGA PI]; the ferritin assay caveat after IV iron. All curves come from Fig 3's model.

| Quantity | Value | Source | Confidence |
|---|---|---|---|
| Red cells made per second, adult | ≈ 2 million (≈ 2 × 10¹¹ a day) | [K] textbook figure; consistent with ≈ 25 × 10¹² cells ÷ 120 days | LOW-MEDIUM (verify before quoting on a page) |
| Iron-deficient red cells are smaller and paler (microcytic, hypochromic) | qualitative | [K] textbook | HIGH (fact) |

### How A6 uses these numbers

- **Iron into new cells per day** = c0 + the net rise in circulating red-cell iron + 0.5 mg/day loss, where c0 = Hb₀ iron ÷ 120 = 12.8 mg/day (Fig 3's model woman). One drawn cell = cNorm = 16.1 mg (Hb 132 iron ÷ 120).
- **Ferritin and Hb** come straight from Fig 3's `simulate("iv")`. Granules = 5 + 35 × log(ferritin ÷ 8) ÷ log(470 ÷ 8). Transferrin dots: one per 1.5 mg. Both are drawing proxies.

---

## A5. The lung: air sac and capillary (anatomical series)

| Quantity | Value | Source | Confidence |
|---|---|---|---|
| Red cell transit through a pulmonary capillary, at rest | ≈ 0.75 s (another textbook gives ≈ 0.8 s, with estimates from 0.1 to 3 s) | [A5-1][A5-2] | MEDIUM |
| Transit in exercise | falls toward ≈ 0.25 s; flow can roughly triple | [A5-3] | LOW (study-aid source) |
| Where loading stops keeping up | below ≈ 0.25 s an appreciable alveolar to end-capillary PO₂ gap opens | [A5-2] | MEDIUM |
| Why transit falls less than flow rises | capillary recruitment; diffusing capacity can double in exercise | [A5-4] | MEDIUM |
| Healthy lungs reach equilibrium | except possibly in strenuous exercise, at altitude or in disease | [A5-5] | MEDIUM (animal study) |
| Alveolar PO₂ ≈ 100 mmHg; mixed venous PO₂ ≈ 40 mmHg at rest | textbook | [A5-2] context; standard values | MEDIUM |
| Venous PO₂ in exercise (32 / 25 / 20 mmHg) | falls as muscles extract more | modelling choice | LOW (drawing only) |
| Haemoglobin curve | Hill fit, P50 26.8 mmHg, n 2.7 | standard adult values | LOW (not re-sourced) |
| Cardiac output by effort (4.2 / 9.2 / 15.8 / 19.9 L/min) | from A4's model | A4 | as A4 |

### How A5 uses these numbers

- **Transit** = 0.75 s × (4.2 ÷ output)^0.6: 0.75 / 0.47 / 0.34 / 0.29 s. The exponent below 1 stands for recruitment ([A5-4]); its value is a modelling choice that lands all-out near the sourced ≈ 0.25 s.
- **Loading:** cell PO₂ closes the gap to 100 mmHg exponentially, to within 1 mmHg by 0.25 s ([A5-2]'s threshold). Saturation comes from the Hill curve.
- **Result:** arriving 75 / 62 / 45 / 31 % full, leaving 97 % in every state. "Time to spare" on the monitor is transit − 0.25 s.
- **Oxygen and CO₂ dots:** one O₂ dot per 7 % of saturation gained; about 0.8 CO₂ dots per O₂ dot (a resting exchange ratio, illustrative only, not a measured RER).

Sources: [A5-1] BioNumbers 101731, *Typical transit time for erythrocyte in pulmonary capillary* (from Nunn, *Applied Respiratory Physiology*), https://bionumbers.hms.harvard.edu/bionumber.aspx?id=101731 · [A5-2] Nunn's *Applied Respiratory Physiology*, excerpt on capillary transit time, https://www.dxy.cn/bbs/newweb/pc/post/47108686 · [A5-3] Brainscape, *Pulmonary Diffusion and Pulmonary Circulation* flashcards, https://brainscape.com/flashcards/pulmonary-diffusion-and-pulmonary-circul-1627439/packs/2929478 · [A5-4] University of Turku, refereed article on diffusing capacity in exercise, https://research.utu.fi/converis/portal/detail/Publication/2556592?lang=en_GB · [A5-5] University at Buffalo, *Distribution of pulmonary capillary transit times*, https://researchconnect.buffalo.edu/en/publications/distribution-of-pulmonary-capillary-transit-times/ (all seen via search extracts, 2026-10-11).

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
