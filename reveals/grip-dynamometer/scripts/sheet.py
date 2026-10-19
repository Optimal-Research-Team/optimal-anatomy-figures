"""Contact sheet of frames pulled from an MP4 (the frames were extracted with ffmpeg -vsync 0).
usage: python3 scripts/sheet.py <frames dir> <out.jpg> <cols> <thumb width> t1,t2,...   (times in seconds, 30 fps)"""
import os, sys
from PIL import Image, ImageDraw, ImageFont
src, out, cols, tw, times = sys.argv[1], sys.argv[2], int(sys.argv[3]), int(sys.argv[4]), [float(t) for t in sys.argv[5].split(",")]
frames = sorted(f for f in os.listdir(src) if f.endswith(".png"))
picks = [(t, frames[min(len(frames) - 1, int(round(t * 30)))]) for t in times]
ims = [Image.open(os.path.join(src, f)).convert("RGB") for _, f in picks]
w, h = ims[0].size
th = round(h * tw / w)
gap, lab = 10, 26
rows = (len(ims) + cols - 1) // cols
sheet = Image.new("RGB", (cols * tw + (cols + 1) * gap, rows * (th + lab) + (rows + 1) * gap), (255, 252, 247))
d = ImageDraw.Draw(sheet)
try:
    font = ImageFont.truetype("/System/Library/Fonts/Supplemental/Arial.ttf", 15)
except OSError:
    font = ImageFont.load_default()
for i, ((t, f), im) in enumerate(zip(picks, ims)):
    x = gap + (i % cols) * (tw + gap)
    y = gap + (i // cols) * (th + lab + gap)
    d.text((x, y + 4), f"t = {t:.1f} s · {f}", fill=(44, 78, 37), font=font)
    sheet.paste(im.resize((tw, th), Image.LANCZOS), (x, y + lab))
sheet.save(out, quality=90)
print(out, sheet.size, [f for _, f in picks])
