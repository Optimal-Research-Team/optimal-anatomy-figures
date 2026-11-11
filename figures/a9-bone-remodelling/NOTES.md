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

1. **Menopause Protocol match:** checked against the protocol PDF (v1.0, §3 and §7). The caption now uses its wording and numbers from Greendale 2012: fastest from about a year before to about two years after the final period; about 7 % spine and 6 % hip in those three years; about 10 % spine over ten years.
2. **No treatment state, by design.** Peter allowed treatments on screen, but the protocol doesn't present hormone therapy as bone protection: it covers bone as screening and strength training. A9 stays mechanism-only to match.

## Round 2 (2026-10-12): 3-D block
Peter approved the isometric look (A3b). The section is now the front face of a cut-away block of spongy bone and marrow (azimuth 62°, elevation 24°, depth 150), cropped to X0..X1 so the strut is cut at both ends of the block.
- **Top:** marrow seen from above: fat cells, red and white speckle, a light wash.
- **Right end:** marrow above and below the strut, and the strut in cross-section with its lamellae and a few osteocytes, shaded.
- **Drawing:** both faces are flat 2-D textures placed with `planeMatrix`. The live code is untouched and draws in section coordinates inside the front group.
- **Known simplification:** the strut on the end face keeps its starting thickness. Pits never reach the cut ends (sites start inside X0..X1), so the two faces still agree.
- **Verified:** both themes; post state; 320 px no h-scroll; reduced motion; console clean; line ends 0.

## Round 3 (2026-11-10): the block as a real-time 3-D model (shared/gl3)
The drawing above is now the fallback. Where the shared 3-D layer runs, the same block is modelled and lit under the SVG (`gl-scene.js`, the layer's `build` hook), in the same camera and world units (the section's px), fed the live code's own state every frame. The model, the numbers, the words and the control are untouched.

- **Marrow:** a see-through block. Its colour builds up with the depth of marrow a sight line crosses (`1 − exp(−k · length)`), so things deep inside fade into it and the block thins to nothing at its far edges; a hairline along every edge and a faint film on the top and the right end keep it a block. Fat cells are pearls set back from every cut face, blood-forming cells a speckle of rose and violet, the sinusoid a tube on the drawing's own curve a little behind the cut face (cut open at the right end).
- **Strut:** a plate of bone through the block. Its top is a height field. Every remodelling site is a round scoop (`cos(πρ/2)^1.4`, which is the model's `scoop(u)` exactly where the cut face crosses its middle), so the cut face shows the live profile to the digit (row 0 of the mesh is `profile()` itself) and the scoop carries on behind it. Finished sites leave their dips the same way (`scars` in live.js: the same amounts as `dip`, kept site by site).
- **Cut faces:** the drawing's own lamellae, osteocytes, canaliculi and cement lines, painted onto canvases from the SVG's paths (`data-a9` hooks), so they sit where the drawing has them. New cement lines are stroked onto the same canvas when a site finishes. The outline of the strut is a fine drawn edge, as in the drawing.
- **Cells:** the osteoclast is a domed cell cut through by the block's face (its cut side is a true plane, trimmed to the pit by the bone's own face), with the drawing's four nuclei and its ruffled border as a brush of folds on the pit's floor. Reversal cells sit in the empty pit. Osteoblasts are a pavement of plump cells on pale osteoid: the front row is the drawing's row (same positions, same nuclei), the rows behind line the scoop. Lining cells are the drawing's row in profile along the cut edge, and a painted pavement of flat cells over the rest of the surface that clears where a site is working. Estrogen is amber hexagons, drawn 4.3 px across (3 px in the drawing) so they stay legible in a lit scene.
- **Not carried over as drawn:** fat cells and blood-forming cells are no longer sliced on the block's faces (they float inside), and their places are new. Nothing else was dropped.
- **Light:** the strut and the working cells shade each other. Fat cells and the sinusoid deliberately drop no shadow on the bone: in a figure about pits, a blot of shade on the bone's surface reads as a pit. A deep scoop is darkened by its own depth (vertex colour), because the layer's occlusion is too fine-grained for a hollow this wide.
- **Fallback:** everything drawn sits in `<g data-gl3-hide>`; with `?gl=off`, no WebGL 2, Save-Data, a small device or a lost context the drawing is the figure, exactly as before. With the layer on, the SVG is not redrawn (it is hidden); the drawing fades out as the render fades in (`figure.css`).
- **Cost (desktop / touch):** about 65 / 70 draw calls and 330k / 190k triangles a frame over all of the layer's passes, about 150k / 75k of them in the picture itself. Dynamic meshes: the strut's top (281 × 20 vertices; only the columns under a working site are rewritten) and the cut face's outline.
- **Worked around in the figure (for the shared layer's owner):**
  1. A see-through block casts no floor shadow, and `ghost()` hides a mesh from the floor passes as well as the occlusion pass. A stand-in box is drawn in the floor's cast pass only (its `onBeforeRender` sets the draw range to zero unless the override material is the floor's flat shader).
  2. three.js redoes the VSM shadow map before each of the layer's four scene renders a frame (two floor passes, the picture, the occlusion's normals). The scene sets `shadowMap.autoUpdate = false` and asks for one update a frame: roughly half the triangles.
  3. With VSM, three.js draws every shadow *receiver* into the shadow map too, so small meshes passed to `ghost()` still cost a pass unless `receiveShadow` is off (`speck()` in gl-scene.js).
  4. `stats()` reads `renderer.info` after the final full-screen pass, so it always reports 1 call and 1 triangle. The figures above were counted at the WebGL calls.
- **Verified:** `node scripts/verify.mjs a9-bone-remodelling` passed (390 / 360 / 320, both themes, reduced motion, desktop, line ends 0 with `?gl=off`, console clean); the stage ends at `data-gl3="on"` on the pages and in the embed; a touch phone (DPR 3) runs it at 60 fps on the dev machine. Rebuilt and re-verified on the rebuilt shared chunk (`459c2c40`, brighter night studio) on 2026-11-11: passed, both themes re-checked.

### Round 3b (2026-11-11): Cream marrow, denser
Review: on Cream the marrow was a faint haze and the block's edges vanished against the page. Cream only (Forest night, the model, numbers and words are untouched; every value below sits behind `night ? … : …` in `gl-scene.js`):
- **Marrow:** a denser rose with a body of its own. The far walls carry about a third cover themselves and the marrow adds to it with depth (`1 − (1 − wall) · exp(−k · length)`), so the block is the drawing's rose at its thin edges and about 70 % covered through its full depth. The front stays see-through enough for the cells and the sinusoid. The face it stands on is covered more (0.62), so the shadow under the block doesn't grey the lower marrow.
- **Silhouette:** a deeper film on the top and the right end, a firmer outline, a soft deeper rim inside every edge, and a stronger floor shadow (`look.cast` 1.3, `look.contact` 0.9; the floor stand-in now reaches down into the contact layer).
- **Inside:** fat cells keep more of their own shading; the blood-forming specks are a shade deeper so they still read in the rose.
- **Checked:** the strut's contrast against the marrow, and a moment with three osteoclasts and an osteoblast pavement at work, in a Cream capture. `node scripts/verify.mjs a9-bone-remodelling`: passed.
