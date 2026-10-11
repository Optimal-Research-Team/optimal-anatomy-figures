> **DRAFT, not yet reviewed.** Research notes for Fig 2, gathered 2026-10-11 from web-search extracts (the session's network policy blocked PubMed/PMC, Crossref, Health Canada and manufacturer sites, so no source was opened directly). Reviewed values move into `../truth-pack.md` when the figure is built.

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
