# Protocol engravings: handoff for engineering

**From:** Peter Phua, Optimal Health · **Prepared:** 2026-10-11 · **Pages:** [The Optimal Longevity Protocol](https://www.beoptimal.ca/optimal-longevity-protocol) and [The Optimal Menopause Protocol](https://www.beoptimal.ca/optimal-menopause-protocol)
**Status:** the images are final. The captions and alt text still need Peter's sign-off (§6) before anything goes live.

This handoff adds nine sage-green steel engravings to the two protocol pages, in the same house style as the IV iron page:

- **Longevity Protocol: six.** Two replace off-brand images, three show the strength tests, one is optional.
- **Menopause Protocol: three.**

Each engraving ships as a WebP at two widths. One zip holds all 18 files.

| Get | Link |
|---|---|
| All web files (18 WebP + `sizes.json`, 1.3 MB) | [protocol-engravings-web.zip](https://d2ol7oe51mr4n9.cloudfront.net/user_3CmFrrNWoOzFjjZZ8CweOy0bSBM/515c92dd-50a4-48ec-a941-b3b82ce3784f.zip) |
| Placement, captions, alt text, prompts, masters | [`manifest.json`](manifest.json) |
| Re-cut sizes or make print files from the masters | [`process.py`](process.py) (reproduces the zip byte for byte) |

---

## 1. What changes, in priority order

| # | Priority | Page and section | Today | Change | Asset |
|---|---|---|---|---|---|
| 1 | **P1** | Longevity §8 *Cardiovascular risk: lipids, apoB and Lp(a)* | NIH atherosclerosis illustration: red and pink clinical art, the only off-palette image on the page | **Replace** with a healthy artery beside one narrowed by plaque | `artery-plaque` |
| 2 | **P1** | Longevity §1.2 *VO2 max: peak aerobic capacity* | Stock photo of a man on a bike in a mask: the same image as the home page's VO₂ tile, and not Optimal's equipment | **Replace** with a VO₂ max test: bike, mask, hose, metabolic cart. No brand implied. | `vo2max-test` |
| 3 | **P1** | Longevity §1.3 *Strength: retirement savings for the body* | Text and a benchmarks table that name a farmer's carry and a dead hang without showing them | **Add** a three-up plate above the benchmarks table showing grip, carry and hang | `grip-dynamometer`, `farmers-carry`, `dead-hang` |
| 4 | **P2** | Menopause §3 *Why bone and heart are part of the conversation* | Numbers for spine and hip loss, then a chart | **Add** the spine and hip, cut open, between the *Bone.* paragraph and the chart | `bone-spine-hip` |
| 5 | **P2** | Menopause §6 *Sleep, when nights are broken* | A text list: fan, layered bedding, spare top and towel | **Add** the bedside still life just above that list | `bedside-night` |
| 6 | **P2** | Menopause §7 *Strength, bone and protein* | All text and tables before *Your week, as a dose* | **Add** a woman in her fifties doing a goblet squat, before that figure | `goblet-squat` |
| 7 | P3 (optional) | Longevity §3 *Heat: the sauna protocol* | Dials only | **Add** a traditional sauna, which backs up "traditional, ≥ 80 °C, not infrared" | `finnish-sauna` |
| 8 | P3 (optional) | Longevity §12 AHE panel card · Menopause §12 *Lab day, at a glance* | — | **Reuse** the blood-tube engraving from the IV iron page as a small decorative corner plate | iron page `c7803519…jpg` |

Deliberately **not** illustrated:

- **The hot-flash mechanism.** It is better served by the interactive thermostat figure in this repo (`figures/01-menopause-thermostat`), once Peter approves it.
- **The lake bands on the Menopause page, and the InBody photo on the Longevity page.** Both stay. The InBody shot is real clinic equipment.
- **The oral-health, stress and environment sections.** An image there would only decorate.

## 2. Previews

<table>
<tr>
<td width="50%"><img src="https://d2ol7oe51mr4n9.cloudfront.net/user_3CmFrrNWoOzFjjZZ8CweOy0bSBM/2794faa7-25c3-469f-89ac-6e5dfd302deb.webp" alt="artery-plaque"><br><b>1 · artery-plaque</b> · Longevity §8</td>
<td width="50%"><img src="https://d2ol7oe51mr4n9.cloudfront.net/user_3CmFrrNWoOzFjjZZ8CweOy0bSBM/3fe51c79-1b39-4368-9ac6-f83e547bf90a.webp" alt="vo2max-test"><br><b>2 · vo2max-test</b> · Longevity §1.2</td>
</tr>
<tr>
<td colspan="2" align="center">
<img height="220" src="https://d2ol7oe51mr4n9.cloudfront.net/user_3CmFrrNWoOzFjjZZ8CweOy0bSBM/4e64699c-babf-451d-91ed-fdf541878e2f.webp" alt="grip-dynamometer">
<img height="220" src="https://d2ol7oe51mr4n9.cloudfront.net/user_3CmFrrNWoOzFjjZZ8CweOy0bSBM/bcec91a0-4cb0-4eca-abc0-681e9a3aa90c.webp" alt="farmers-carry">
<img height="220" src="https://d2ol7oe51mr4n9.cloudfront.net/user_3CmFrrNWoOzFjjZZ8CweOy0bSBM/91af04d5-34a5-4ae2-b156-15c78a58d2da.webp" alt="dead-hang"><br><b>3 · grip-dynamometer, farmers-carry, dead-hang</b> · Longevity §1.3</td>
</tr>
<tr>
<td><img src="https://d2ol7oe51mr4n9.cloudfront.net/user_3CmFrrNWoOzFjjZZ8CweOy0bSBM/404947c3-a0cd-447b-97fb-5cd13db72b40.webp" alt="bone-spine-hip"><br><b>4 · bone-spine-hip</b> · Menopause §3</td>
<td><img src="https://d2ol7oe51mr4n9.cloudfront.net/user_3CmFrrNWoOzFjjZZ8CweOy0bSBM/b09ba52a-1f7a-492d-8341-4a0bfdfe9fae.webp" alt="bedside-night"><br><b>5 · bedside-night</b> · Menopause §6</td>
</tr>
<tr>
<td align="center"><img height="300" src="https://d2ol7oe51mr4n9.cloudfront.net/user_3CmFrrNWoOzFjjZZ8CweOy0bSBM/d782b461-1580-4ef7-957e-1d4156676ff2.webp" alt="goblet-squat"><br><b>6 · goblet-squat</b> · Menopause §7</td>
<td><img src="https://d2ol7oe51mr4n9.cloudfront.net/user_3CmFrrNWoOzFjjZZ8CweOy0bSBM/2a21191d-6ddd-4dce-ad10-7a6c41db8d5d.webp" alt="finnish-sauna"><br><b>7 · finnish-sauna</b> (optional) · Longevity §3</td>
</tr>
</table>

## 3. Placement, captions and alt text

The captions and alt text below are **proposed copy** and need sign-off (§6). Every caption restates only what its page already says; none adds a claim.

| # | Exactly where | Layout | Caption (proposed) | Alt (proposed) |
|---|---|---|---|---|
| 1 | Longevity §8: in the existing figure slot under the apoB paragraph, replacing the NIH image and its credit | wide | How atherosclerosis develops: apoB-carrying particles lodge in the artery wall and build plaque over decades. Left, a healthy artery; right, plaque inside the wall narrowing the channel. | Engraving of two cut sections of an artery: on the left a healthy artery with a wide open channel; on the right a fatty plaque inside the wall narrowing the channel. |
| 2 | Longevity §1.2: in the existing photo slot after the Mandsager paragraph | wide | A VO₂ max test on a stationary bike: the mask sends every breath to a metabolic cart, which measures how much oxygen you use. | Engraving of a woman pedalling a stationary bike in a face mask, with a breathing tube running to a metabolic cart and monitor. |
| 3 | Longevity §1.3: after "Practice standards at age 40, relaxed slightly each decade after:", **above** the carry/hang table. Card title *The three tests, drawn*, meta *Grip · carry · hang* | trio | **Grip.** Squeeze a hand dynamometer; best of either hand. · **Farmer's carry.** Walk tall with a weight in each hand for one minute. · **Dead hang.** Hang from a bar with straight arms, timed. | Engraving of a hand squeezing a grip dynamometer with a dial gauge. · Engraving of a woman walking tall with a heavy dumbbell in each hand. · Engraving of a man hanging from a pull-up bar with straight arms. |
| 4 | Menopause §3: after the paragraph starting "**Bone.** Bone loss speeds up…", before the *Bone density around the final period* chart | wide | The spine and the hip, where bone density is measured, cut open to show the lattice of bone inside. | Engraving of a lumbar vertebra and the top of a thigh bone, each cut open to show the sponge-like bone inside. |
| 5 | Menopause §6: directly before the list "A cool, dark, quiet room… / Layered bedding… / A spare top and a towel by the bed". Keep the list and the "aren't proven to reduce night sweats" sentence together, after the image. | wide | Within reach of the bed: a fan, cold water, a spare top and a towel. | Engraving of a bedside table with a small fan, a glass of water and a folded towel and t-shirt, next to a bed with the duvet folded back. |
| 6 | Menopause §7: after the NICE / Osteoporosis Canada paragraph, before the *Your week, as a dose* figure (which carries the osteoporosis caution) | figure | A goblet squat, one simple strength exercise. | Engraving of a woman in her fifties doing a squat while holding a kettlebell at her chest. |
| 7 | Longevity §3: directly before the *The dose the Finnish studies used* card | wide | A traditional Finnish sauna. The Finnish studies used saunas like this, at 80–100 °C; infrared cabins typically run cooler, at 45–65 °C. | Engraving of the inside of a traditional wooden sauna: tiered benches, a stove heaped with stones, a bucket and ladle. |
| 8 | Inside the existing card, top right, 88–100 px, like the IV iron page | corner | none | `alt=""` (decorative) |

## 4. Build it

### 4.1 Files

| Asset | Large (2×) | Small | Use `sizes` |
|---|---|---|---|
| artery-plaque | `engraving-artery-plaque-1040w.webp` 1040×520, 121 KB | `…-640w.webp` 640×320, 43 KB | `(max-width: 760px) calc(100vw - 60px), 560px` |
| vo2max-test | `engraving-vo2max-test-1040w.webp` 1040×871, 133 KB | `…-640w.webp` 640×536, 41 KB | same |
| finnish-sauna | `engraving-finnish-sauna-1040w.webp` 1040×777, 207 KB | `…-640w.webp` 640×478, 61 KB | same |
| bone-spine-hip | `engraving-bone-spine-hip-1040w.webp` 1040×734, 111 KB | `…-640w.webp` 640×452, 39 KB | same |
| bedside-night | `engraving-bedside-night-1040w.webp` 1040×776, 173 KB | `…-640w.webp` 640×478, 51 KB | same |
| grip-dynamometer | `engraving-grip-dynamometer-649w.webp` 649×720, 67 KB | `…-396w.webp` 396×440, 21 KB | `(max-width: 560px) 84px, 200px` |
| farmers-carry | `engraving-farmers-carry-571w.webp` 571×960, 48 KB | `…-333w.webp` 333×560, 14 KB | `(max-width: 560px) 84px, 140px` |
| dead-hang | `engraving-dead-hang-542w.webp` 542×960, 36 KB | `…-316w.webp` 316×560, 10 KB | `(max-width: 560px) 84px, 140px` |
| goblet-squat | `engraving-goblet-squat-547w.webp` 547×960, 76 KB | `…-319w.webp` 319×560, 20 KB | `(max-width: 560px) 120px, 200px` |

All images are a single sage ink, RGB 55/71/40, on **pure white**. Inside a white figure card they need nothing extra. Set straight on the cream page (`#FFFCF7`), add `mix-blend-mode: multiply` so the white drops out, which is what the IV iron page does. They are not for the dark-green panels.

### 4.2 Plate CSS (works inside the `op-*` protocol shell)

```css
/* Engraving plates: a figure card holding one engraving, or a row of three */
.op-plate { margin: 16px 0 22px; padding: 22px; background: #fff; border: 1px solid #DFD7CA; border-radius: 10px; break-inside: avoid; }
.op-plate__head { display: flex; justify-content: space-between; align-items: baseline; gap: 12px; flex-wrap: wrap; margin: 0 0 14px; }
.op-plate__title { margin: 0; font: 400 22px/1.2 Castoro, serif; letter-spacing: -.03em; color: #2C4E25; }
.op-plate__meta { font: 12px/1.4 "Public Sans", sans-serif; color: #76736D; }
.op-plate img { display: block; height: auto; margin: 0 auto; border: 0; border-radius: 0; }
.op-plate figcaption, .op-plate__cap { margin-top: 14px; font: 13px/1.5 "Public Sans", sans-serif; color: #76736D; }
.op-plate--wide img { width: 100%; max-width: 560px; }
.op-plate--figure { display: grid; grid-template-columns: minmax(0, 200px) 1fr; gap: 22px; align-items: center; }  /* one figure, caption beside it */
.op-plate--figure img { width: 100%; max-width: 200px; }
.op-plate--figure figcaption { margin-top: 0; }
.op-plate .op-plate__row { display: grid; grid-template-columns: repeat(3, minmax(0, 1fr)); gap: 18px; margin: 0; padding: 0; list-style: none; }  /* beats the shell's .op-page ul */
.op-plate__row li { display: flex; flex-direction: column; align-items: center; text-align: center; margin: 0; }
.op-plate__row img { width: auto; max-width: 100%; max-height: 220px; }
.op-plate__row .op-plate__cap { margin-top: 10px; }
@media (max-width: 560px) {               /* phones: a list of rows, picture left, words right */
  .op-plate { padding: 14px; }
  .op-plate .op-plate__row { grid-template-columns: 1fr; gap: 12px; }
  .op-plate__row li { flex-direction: row; align-items: center; gap: 14px; text-align: left; }
  .op-plate__row img { width: 84px; max-height: none; flex: none; }
  .op-plate__row .op-plate__cap { margin-top: 0; }
  .op-plate--figure { grid-template-columns: 120px 1fr; gap: 14px; }
}
.op-plate--bare { padding: 0; background: none; border: 0; }   /* straight on cream */
.op-plate--bare img { mix-blend-mode: multiply; }
```

The rules copy the shell's own figure card (`.op-fig`): 22 px padding, a 1 px `#DFD7CA` border, radius 10, a Castoro 22 px forest title and a 13 px `#76736D` caption. Writing `class="op-fig op-plate …"` works too. The title is a `div`, not a `p`, because the shell's `.op-page p` margin rule would beat it. On phones the trio becomes three rows, so nothing shrinks below legibility at 320 px. The CSS was checked inside the shell's scope reset at 320, 390 and 1280 px, with no horizontal scroll (§5 has the screenshots).

### 4.3 Markup

Wide (items 1, 2, 4, 5, 7):

```html
<figure class="op-plate op-plate--wide">
  <img src="/images/protocols/engraving-artery-plaque-1040w.webp"
       srcset="/images/protocols/engraving-artery-plaque-640w.webp 640w, /images/protocols/engraving-artery-plaque-1040w.webp 1040w"
       sizes="(max-width: 760px) calc(100vw - 60px), 560px"
       width="1040" height="520" loading="lazy" decoding="async"
       alt="Engraving of two cut sections of an artery: on the left a healthy artery with a wide open channel; on the right a fatty plaque inside the wall narrowing the channel.">
  <figcaption>How atherosclerosis develops: apoB-carrying particles lodge in the artery wall and build plaque over decades. Left, a healthy artery; right, plaque inside the wall narrowing the channel.</figcaption>
</figure>
```

Trio (item 3):

```html
<figure class="op-plate op-plate--trio" aria-label="The three strength tests">
  <div class="op-plate__head"><div class="op-plate__title">The three tests, drawn</div><span class="op-plate__meta">Grip · carry · hang</span></div>
  <ul class="op-plate__row">
    <li><img src="/images/protocols/engraving-grip-dynamometer-396w.webp"
             srcset="/images/protocols/engraving-grip-dynamometer-396w.webp 396w, /images/protocols/engraving-grip-dynamometer-649w.webp 649w"
             sizes="(max-width: 560px) 84px, 200px" width="649" height="720" loading="lazy" decoding="async"
             alt="Engraving of a hand squeezing a grip dynamometer with a dial gauge.">
        <span class="op-plate__cap"><strong>Grip.</strong> Squeeze a hand dynamometer; best of either hand.</span></li>
    <li><img src="/images/protocols/engraving-farmers-carry-333w.webp"
             srcset="/images/protocols/engraving-farmers-carry-333w.webp 333w, /images/protocols/engraving-farmers-carry-571w.webp 571w"
             sizes="(max-width: 560px) 84px, 140px" width="571" height="960" loading="lazy" decoding="async"
             alt="Engraving of a woman walking tall with a heavy dumbbell in each hand.">
        <span class="op-plate__cap"><strong>Farmer's carry.</strong> Walk tall with a weight in each hand for one minute.</span></li>
    <li><img src="/images/protocols/engraving-dead-hang-316w.webp"
             srcset="/images/protocols/engraving-dead-hang-316w.webp 316w, /images/protocols/engraving-dead-hang-542w.webp 542w"
             sizes="(max-width: 560px) 84px, 140px" width="542" height="960" loading="lazy" decoding="async"
             alt="Engraving of a man hanging from a pull-up bar with straight arms.">
        <span class="op-plate__cap"><strong>Dead hang.</strong> Hang from a bar with straight arms, timed.</span></li>
  </ul>
</figure>
```

Figure (item 6) is the wide markup with `op-plate--figure`, the 319w and 547w files, `sizes="(max-width: 560px) 120px, 200px"` and `width="547" height="960"`. The caption sits beside the figure, not under it.

### 4.4 Longevity Protocol page

The page source isn't in any repo this handoff could see, so the paths are suggestions:

1. Copy the files for items 1–3 (and 7 if approved) from the zip into the site's public images, e.g. `public/images/protocols/`.
2. Add the §4.2 CSS once, beside the protocol shell stylesheet. If the page uses `src/styles/protocol/op-shell.css` from the Menopause handoff, put it there so both pages share it.
3. **§8:** swap the NIH `<img>` and its credit line for the item 1 markup. The Wikimedia/NIH credit goes, because the image does.
4. **§1.2:** swap the stock photo for item 2. Delete the stock file from the bundle if nothing else uses it.
5. **§1.3:** insert the item 3 trio above the carry/hang table.

### 4.5 Menopause Protocol page (`Optimal-Research-Team/optimal-menopause-protocol`)

The renderer already supports image blocks: `{ "t": "image", "photo": "<asset key>", "alt": "…", "caption": "…" }` in `src/render/blocks.mjs`. Images flow through `scripts/lib/assets.mjs`, and `npm run handoff` copies them into the site.

1. **Sources.** Run `python3 process.py --print --only bone-spine-hip` (and the same for `bedside-night` and `goblet-squat`). Put the three `print/engraving-*-print.jpg` files (2000 px) in `src/assets/engravings/`.
2. **Recipes.** In `scripts/lib/assets.mjs`, add web recipes. Use the file's own aspect ratio so nothing is cropped:
   ```js
   { key: 'engr-bone',    src: 'engravings/engraving-bone-spine-hip-print.jpg', name: 'engraving-bone-spine-hip', aspect: 1040 / 734, widths: [640, 1040], q: 76 },
   { key: 'engr-bedside', src: 'engravings/engraving-bedside-night-print.jpg',  name: 'engraving-bedside-night',  aspect: 1040 / 776, widths: [640, 1040], q: 76 },
   { key: 'engr-squat',   src: 'engravings/engraving-goblet-squat-print.jpg',   name: 'engraving-goblet-squat',   aspect: 547 / 960,  widths: [319, 547],  q: 76 },
   ```
   Also add print recipes at the same aspects: `w: 1420` for the two wide plates and `w: 700` for the squat, JPEG `q: 84`. The engravings are line art, so the PDF wants these sharper than the photos.
3. **Renderer.** The image block today renders `op-img mp-img`, which has a border, radius 8 and full-column `sizes`. Let a block opt into plates:
   ```js
   image: (b, ctx) => {
     const a = ctx.asset(b.photo);
     if (!a) return '';
     const plate = b.variant === 'plate' || b.variant === 'plate-figure';
     const cls = plate ? `op-plate ${b.variant === 'plate-figure' ? 'op-plate--figure' : 'op-plate--wide'}` : 'op-img mp-img';
     const sizes = !plate ? '(max-width: 760px) 100vw, 800px' : b.variant === 'plate-figure' ? '(max-width: 560px) 120px, 200px' : '(max-width: 760px) calc(100vw - 60px), 560px';
     return `<figure class="${cls}">${img(a, { alt: ctx.plain(b.alt || b.caption || ''), sizes })}${b.caption ? `<figcaption>${ctx.inline(b.caption)}</figcaption>` : ''}</figure>`;
   },
   ```
   Add the §4.2 CSS to `src/styles/mp.css` (the wide and figure rules; the trio isn't used here).
4. **Copy.** The three blocks are a copy change, and the README says copy is changed upstream, then copied into `content/protocol.json`. Add them where §3 says, with `"variant": "plate"` (`"plate-figure"` for the squat). The new captions and alt text join the review ledger like any other copy.
5. **Check:** `npm run build && npm run check && npm run sections && npm run pdf && npm run handoff -- --allow-open`. Look at the §3, §6 and §7 section shots at 390 and 1440, and at those pages in the PDF proof (`npm run proof`). Then copy `handoff/files/` to the site as usual.

### 4.6 Blood-tube reuse (optional)

The IV iron page's blood-tube engraving is at `Optimal-Research-Team/iron-infusions-waitlist/img/c7803519e98e06b201fa3d46059035cf.jpg` (1000×1000, white background). Place it top right in the card at 88–100 px with `mix-blend-mode: multiply`, `alt=""` and `aria-hidden="true"`, and hide it under 400 px.

## 5. QA before merge

The plate CSS from §4.2 was rendered inside the shell's scope reset with headless Chromium. `scrollWidth` matched the viewport at 320, 390 and 1280 px, so there is no horizontal scroll.

<table><tr>
<td width="34%" valign="top"><img src="https://d2ol7oe51mr4n9.cloudfront.net/user_3CmFrrNWoOzFjjZZ8CweOy0bSBM/3de3e8ed-0508-4c20-8c0e-ea07d5389ed1.jpg" alt="Mock at 390 px"><br>390 px</td>
<td width="66%" valign="top"><img src="https://d2ol7oe51mr4n9.cloudfront.net/user_3CmFrrNWoOzFjjZZ8CweOy0bSBM/27676c7a-2898-463c-b8b5-2ba6347cff00.jpg" alt="Mock at 1280 px"><br>1280 px</td>
</tr></table>

Then on the real pages:

- [ ] Phone first: 390, 360 and 320 px, then desktop. The trio reads as three rows on a phone, and no plate causes horizontal scroll.
- [ ] No layout shift: every `<img>` carries `width` and `height`, and images below the fold use `loading="lazy"`.
- [ ] The phone loads the 640 / 3xx files. Check the network panel at 390 px with DPR 3.
- [ ] Cream-page placements use `multiply`, so no white boxes show.
- [ ] Alt text is present and matches §3. Decorative corner plates use `alt=""`.
- [ ] Print (Cmd+P) and, for Menopause, the PDF: plates aren't split across pages, and the ink prints as mid-green rather than grey mush.
- [ ] Longevity: the NIH image, its credit and the stock VO₂ photo are gone from the page and from the bundle.
- [ ] Captions are the signed-off versions (§6), not the drafts.

## 6. Sign-off needed from Peter before launch

1. **Captions and alt text** (§3). On the Menopause page they are copy on the compliance-reviewed page, so they go through the same review route as the rest of its copy. I checked each one against what its section already says, and none adds a claim, a number or a promise.
2. **Generated images.** These are generated illustrations, and none claims to show a real person, place or Optimal's equipment. That fits the reasoning already recorded in the Menopause `REVIEW.md` for the generated hero and lake bands: "the hero claims nothing". The Menopause asset brief's rule "real photography only" was written for photographs. Please record that drawn illustrations are allowed when they claim nothing about a real place or person.
3. **Which route is live for the Menopause page.** The build repo targets `beoptimal.ca/menopause`; this handoff was asked for `/optimal-menopause-protocol`.
4. **Optional items:** the sauna plate (item 7) and the blood-tube reuse (item 8). Include them or skip them.
5. **VO₂ max figure.** I drew a woman of about 45 to balance the page; the stock photo shows a man. Tell me if you'd rather match.

## 7. Provenance

- **Model:** GPT Image 2.5 on Higgsfield, quality high, 2k, made under Peter's account on 2026-10-11. It took 10 generations: nine, plus a retry of the sauna after a rate limit.
- **Style references:** the same four plates as the IV iron engravings (liver, pine branch, heart, red cells; media ids in `manifest.json`).
- **Medical accuracy check (done visually on each master):**
  - The plaque sits inside the artery wall under a cap, and the channel is narrowed off-centre.
  - The vertebral body and the femoral head and neck show cortex around trabecular bone.
  - The squat has heels flat, knees over toes and a neutral back.
  - The dead hang uses an overhand grip with straight arms.
  - The dynamometer is the standard dial type.
  - No text or numbers appear in any image.
- **Prompts, job ids and master URLs** are in `manifest.json`. `process.py` turns the masters into the web files: one house ink, trimmed to the ink with a 2.5% margin, WebP q76/q74.

## 8. What was reviewed

The two live pages couldn't be fetched from the build environment (beoptimal.ca is blocked there), so they were reviewed from their sources:

- **Longevity Protocol:** the v1.0 reference capture (Sep 14, 2026). That is 38 full-page screenshots plus the reverse-engineered design spec in `optimal-menopause-protocol/work/reference/`.
- **Menopause Protocol:** `content/protocol.json`, the compliance-reviewed copy of Sep 28, 2026.

Before placing anything, check that the anchors in §3 still match the live pages.
