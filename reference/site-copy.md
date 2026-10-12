# Site copy: what Optimal already tells patients

The figures must agree with this copy. It's excerpted from the live beoptimal.ca service pages (source repo `BeOptimal/beoptimal-landing`, `src/pages/*`), the Performance package one-pager and the IV iron waitlist page design, as of 2026-10-11.

---

## Creator 600 (`/services/creator-600`, GaitAnalysisPage.tsx)

**Hero:** "See how you *really* run." A standalone running gait assessment on the Visbody Creator600 AI treadmill. Twenty minutes on the belt, a full 3D report of your joints, cadence and balance, and a plan to run with less pain and fewer injuries.

**Hardware**
- *The full machine:* commercial deck and belt, upright display and touch panel in one unit. Run at your own pace, from an easy jog to a full sprint.
- *32″ upright display:* shows your live skeletal tracking while you run. A second touch panel runs the session.
  - **⚠ Wrong on the site (2026-10-12):** the clinic's display is about 50″, stood vertically (Peter; Visbody lists a 50″ LG 4K vertical display). The site copy should say 50″. Figs 4 and 6 already draw 50″ proportions.
- *Handrail console:* speed and incline at your fingertips, with safety monitoring on throughout.

**Visit:** about 45 min. Short intake, a 5-minute warm-up, a **5-minute recorded run at normal training pace**, then a guided review. Fitted clothing helps the camera track joints. The report comes on the day by QR code.

**Example on-screen stats (design copy):** speed 7.5 km/h · cadence 180 spm · HR 72 bpm · knee angle 68° · incline 15%.

**Measures in the report**

| Measure | Short | Why it matters (site copy) |
|---|---|---|
| Dynamic joint load | Load on each hip and knee, rated low to high, left vs right. Estimated from tracked joint positions and how fast they change. | Sustained high load on one knee or hip is a common precursor to runner's knee, IT band pain and hip flexor strain. |
| Knee motion angle | Flexion/extension of each knee through the gait cycle, L and R curves. | Landing with the knee too straight sends impact up the leg. A slightly bent knee at contact reduces joint stress. |
| Knee valgus / varus | Knee drifting inward (valgus) or outward (varus) relative to hip and ankle, on each landing. | Inward collapse is linked to patellofemoral pain and ACL stress, usually from weak hip stabilisers. |
| Vertical oscillation | cm of centre-of-mass rise and fall per step. Vertical ratio = oscillation ÷ stride length. | Excess bounce is wasted energy and impact. Efficient runners typically sit under a 10% vertical ratio. |
| Centre of gravity | Trunk lean L–R and F–B, and how far in front of the centre of gravity each foot lands. | Overstriding acts like a brake and increases braking forces through shin and knee. Target: a small forward lean, foot landing under you. |
| Cadence | Steps/min across the run, max and average, against the commonly cited 170–180 spm range. | A modest **5–10%** cadence increase shortens stride, reduces overstriding and lowers knee and hip load. |

Report screenshots: `reference/equipment/creator600-report-*.png` and `creator600-display.png` (the live display layout).

---

## InBody 580 (`/services/inbody-580`, InBody580Page.tsx)

**Description:** measures muscle mass, body fat percentage, visceral fat and segmental composition in **under 60 seconds**. Steps on the page: arrive prepared → step on barefoot → **stand still for 30 seconds** → printed and digital report. Prep: keep it normal, empty stomach, bare feet, empty pockets.

| Metric | Site copy |
|---|---|
| Weight | Total mass against the expected range for height. The two bars beneath show what it's made of. |
| Skeletal muscle mass | Muscle attached to bones. A muscle bar that reaches past the fat bar is the target pattern. |
| Body fat mass | kg of fat. Re-scanned every 8–12 weeks. |
| Lean mass by segment | Lean mass in each arm, each leg and the trunk, in kg and % of expected. Shows side-to-side imbalance. |
| Visceral fat level | Rated 1–20. **Under 10 is considered healthy.** |
| ECW ratio | Share of total body water outside cells. **Normal 0.360–0.390.** Above range can point to inflammation, swelling or fluid retention. |
| Phase angle | A direct electrical measure of cell-membrane integrity, whole body and per segment. **Measured at 50 kHz.** Higher generally means healthier cells. |
| BMR | Calories at rest, calculated from lean mass. |

Sample values used on the page (synthetic): weight 78.4 kg · SMM 36.2 kg · BFM 14.9 kg · segment lean RA 3.4 / LA 3.3 / trunk 28.6 / RL 9.8 / LL 9.6 kg · VFL 6 · ECW ratio 0.378 · phase angle 6.4° · BMR 1742 kcal.

---

## VO2max (`/services/vo2-max-testing`, Vo2MaxTestingPage.tsx: a thin page today)

"VO2 max is one of the strongest known predictors of longevity and cardiometabolic fitness. Most people only guess at their aerobic capacity. With a **metabolic cart**, we measure it directly — giving you a precise number to train against, track over time, and improve. A service rarely available outside of sports performance labs."

**Performance package one-pager (endurance athletes):** two lab-grade VO2max tests, "on a **treadmill or bike ergometer**, your choice", "**breath-by-breath gas analysis**, no finger-pricks", heart-rate training zones (by HR + power on the bike, HR + pace on the treadmill), and "a fixed-effort check that shows fatigue early". Test #2 runs 6–8 weeks before the key race on the same machine. Come rested (no hard session for 48 h) with running shoes or bike pedals.

**Equipment:** unknown. See HANDOFF §7. The floor plan places a "VO2 MAX MACHINE" on the built-in wall storage in Exercise Room 8 (3.40 × 4.47 m), alongside a treadmill, an air bike, a Power Plate, a mobile workstation and a wall-mounted TV.

---

## IV iron (waitlist landing page, Claude Design canvas, launching)

- "Exhausted by low iron? Restore it in **one visit**." Simcoe County's first dedicated IV iron program, NP-led and medically supervised. No referral needed.
- About **1 in 4 women of reproductive age** have low iron. Many are told bloodwork is "fine" while iron sits at the bottom of the range.
- **Why pills fail:** pills are "the right first step for many people", but slow, poorly absorbed and hard on the stomach. Heavy periods, gut conditions or perimenopause can lose iron faster than pills replace it.
- "IV iron skips the gut and goes straight into your bloodstream. For most adults, one 60–90 minute visit fully restores iron stores. Many people feel their energy coming back within one to two weeks."
- The page has a chart: "Iron stores (ferritin) after one infusion vs daily pills. Typical pattern — your NP confirms yours with bloodwork." **Figure 3 can carry this message much better than the chart does.**
- "This isn't a wellness drip. It's a medical treatment, for a measured deficiency, with bloodwork before and after."
- Flow: consult → bloodwork → prescription (e.g. **Monoferric**) filled at a pharmacy → 60–90 min monitored infusion → **recheck at 6–8 weeks**.
- Who it's for: heavy periods and perimenopause (#1 cause in women), postpartum, athletes ("low iron caps endurance and recovery long before anemia shows up"), gut conditions (celiac, IBD, bariatric surgery).

---

## Menopause

The compliance-reviewed flagship is the **Optimal Menopause Protocol** (beoptimal.ca/menopause, repo `optimal-menopause-protocol`, private). Figure 1 explains the mechanism behind vasomotor symptoms. It must not contradict the Protocol's treatment framing, so keep treatment mentions generic unless Peter answers HANDOFF §7 Q2.
