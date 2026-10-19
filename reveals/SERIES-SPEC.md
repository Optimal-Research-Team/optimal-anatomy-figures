# Equipment reveals: series spec (shared by all four films)

The four films (InBody 580, Creator 600, Wahoo KICKR Bike, hand dynamometer) air as a set on the reception TV and on Instagram, so they must look like one series.

## Look
- **Palette:** cream paper `#FFFCF7`, forest ink `#2C4E25`, leaf accent `#A9D49C`, greys `#C9CDBF` / `#8E9884`.
- **Fonts:** Castoro and Public Sans, embedded from local woff2 files.
- **12.0 s**, 30 fps, silent, H.264 yuv420p.
- **Shot order:** tumble in, close-ups, explode and implode, hero.

## Corner labels (both ratios)
- Two labels, both in Public Sans spaced caps (the TV kit's eyebrow style):
  - top-left: `OPTIMAL HEALTH · BARRIE`
  - top-right: `<DEVICE> · <WHAT IT MEASURES>`
- No Castoro italic in the labels, and no leading dashes.
- **Clearance:** no scene pixel may fall inside a visible label's box plus 24 px. Where an object would cross a label, fade the label out over about 0.3 s and bring it back for the wide shots.

## Captions
- **Format:** a Castoro title line (sentence case) with one Public Sans spaced-caps sub-line under it.
- **Content:** device facts only. No health claims, no halos, no leading dash.
- **Clearance:** no scene pixel may fall inside the caption box plus 40 px. Fix collisions by framing the shot first, not by moving the caption.
- **Timing:** captions fade in after a whip lands and are gone before the next whip starts.

## 16:9 (TV, 1920 × 1080)
- Labels and the hairline frame inset as in the InBody film.
- Caption sits bottom-left, inside the frame.
- Close-ups are weighted right so the caption sits on clear paper.

## 9:16 (Reels, 1080 × 1920): Instagram safe zone
- The Reels UI covers the top 269 px, the bottom 672 px and 65 px on each side.
- **Every label and caption sits inside the safe area.** Use a header block near the top, starting at y ≥ 269: the corner-label line, then the caption under it. This is the layout of the hand-dynamometer film.
- **Nothing that must be read sits below y = 1248.**
- The object sits below the header block. In the tumble-in and hero shots, the whole object stays inside the hairline frame and above y ≈ 1248, with room to breathe.

## Hero shots
In the first and last shots of both ratios, the whole object sits inside the hairline frame, at least 24 px clear of it.

## QA (must pass before delivery)
1. Run a per-frame check at 60 samples a second, covering the blur shutter. Render the object alone on a transparent background and assert:
   - the caption clearance
   - the corner-label clearance
   - the hero-in-frame rule
   - for 9:16 only: no label or caption outside the safe area
2. Run the explode sweep and the paint-order scan; both must be clean.
3. Extract frames from the encoded MP4s and look at them on the 8-frame contact sheets.
4. Render one film at a time, then delete the regenerable intermediates.
