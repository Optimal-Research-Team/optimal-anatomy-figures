> **DRAFT, not yet reviewed.** Research notes for Fig 4, gathered 2026-10-11 from web-search extracts (the session's network policy blocked PubMed/PMC, Crossref, Health Canada and manufacturer sites, so no source was opened directly). Reviewed values move into `../truth-pack.md` when the figure is built.

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
