# Truth pack

Every number a figure shows, animates or prints comes from this file, with a source and a confidence. Format per figure: **Mechanism in 3 sentences** · **Model numbers** (quantity | value | units | source | confidence) · **Equations / curves** · **Misconceptions to avoid** · **Sources**.

> **Verification status (2026-10-11).** This cloud session's network policy blocked direct access to PubMed/PMC, Europe PMC, Crossref, Health Canada's drug database and manufacturer sites, so values were checked against the abstracts and extracts that web search returns, not against full text. Confidence levels reflect that. Before public launch, a reviewer with normal web access should open the sources marked MEDIUM or LOW. To let a future session open them itself, allow `pubmed.ncbi.nlm.nih.gov`, `pmc.ncbi.nlm.nih.gov`, `www.ebi.ac.uk`, `api.crossref.org`, `health-products.canada.ca` and `dhpp.hpfb-dgpsa.ca` in the environment's network settings.
>
> Unreviewed research for Figs 2–5 is in `research/truth-<n>-draft.md` until each figure is built.

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
