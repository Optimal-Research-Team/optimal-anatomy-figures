"""Reads caption-check.mjs output. Reports, per frame, object pixels inside each label box grown by MARGIN css px
(40 output px at 2x), and, for frames in HERO ranges, object pixels outside the hairline frame shrunk by ROOM css px.
usage: python3 scripts/caption-check.py <dir> [hero ranges like 0-1.82,10.42-12]"""
import json, os, sys
import numpy as np
from PIL import Image
MARGIN, CORNER, ROOM, ALPHA = 20, 24, 16, 20  # css px at 2x output: captions 40 px, corner labels 48 px, frame room 32 px
d = sys.argv[1]
heroes = [tuple(map(float, r.split("-"))) for r in sys.argv[2].split(",")] if len(sys.argv) > 2 and sys.argv[2] else []
info = json.load(open(os.path.join(d, "meta.json")))
bad = 0
for m in info["meta"]:
    a = np.asarray(Image.open(os.path.join(d, m["name"] + ".png")).convert("RGBA"))[:, :, 3] > ALPHA
    H, W = a.shape
    hits = []
    for key in ("fig", "title", "hint", "readout", "dot"):
        b = m.get(key)
        if not b:
            continue
        g = CORNER if key in ("fig", "title") else MARGIN
        x0, y0, x1, y1 = [int(round(v)) for v in (b[0] - g, b[1] - g, b[2] + g, b[3] + g)]
        n = int(a[max(0, y0):max(0, y1), max(0, x0):max(0, x1)].sum())
        if n:
            hits.append(f"{key}:{n}")
    t = m.get("t")
    if t is not None and any(lo - 1e-6 <= t <= hi + 1e-6 for lo, hi in heroes):
        fx0, fy0, fx1, fy1 = [int(round(v)) for v in m["frame"]]
        inner = np.zeros_like(a)
        inner[fy0 + ROOM:fy1 - ROOM, fx0 + ROOM:fx1 - ROOM] = True
        n = int((a & ~inner).sum())
        if n:
            hits.append(f"FRAME:{n}")
    if info["size"].get("ratio") == "9:16":
        # Reels safe area in css px (1080 x 1920 output: top 269, bottom 672, sides 65 px clear)
        for key in ("fig", "title", "hint", "readout"):
            b = m.get(key)
            if b and (b[0] < 32.5 or b[2] > 507.5 or b[1] < 134.5 or b[3] > 624):
                hits.append(f"SAFE-{key}")
        if t is not None and any(lo - 1e-6 <= t <= hi + 1e-6 for lo, hi in heroes):
            n = int(a[624 - 12:, :].sum())  # the whole object above y = 1248 output px, with 24 px to spare
            if n:
                hits.append(f"BELOW1248:{n}")
    if hits:
        bad += 1
        print(f"{m['name']} t={t if t is not None else '-'}: " + " ".join(hits))
print(f"{bad} of {len(info['meta'])} frames with object pixels in a protected zone")

# Optional review sheet: object-only frames composited on paper with the protected zones drawn.
if len(sys.argv) > 3:
    from PIL import ImageDraw
    names = [m for m in info["meta"]]
    cols = int(sys.argv[4]) if len(sys.argv) > 4 else 4
    W, H = info["size"]["W"], info["size"]["H"]
    s = 0.5 if W > 600 else 0.6
    tw, th = int(W * s), int(H * s)
    rows = (len(names) + cols - 1) // cols
    sheet = Image.new("RGB", (cols * (tw + 8) + 8, rows * (th + 22) + 8), (255, 255, 255))
    dr = ImageDraw.Draw(sheet)
    for i, m in enumerate(names):
        im = Image.open(os.path.join(d, m["name"] + ".png")).convert("RGBA")
        bg = Image.new("RGBA", im.size, (251, 247, 239, 255))
        bg.alpha_composite(im)
        g = ImageDraw.Draw(bg)
        for key in ("fig", "title", "hint", "readout", "dot"):
            b = m.get(key)
            if b:
                mg = CORNER if key in ("fig", "title") else MARGIN
                g.rectangle([b[0] - mg, b[1] - mg, b[2] + mg, b[3] + mg], outline=(220, 60, 50, 255), width=2)
        f = m["frame"]
        g.rectangle(f, outline=(44, 78, 37, 255), width=1)
        g.rectangle([f[0] + ROOM, f[1] + ROOM, f[2] - ROOM, f[3] - ROOM], outline=(120, 160, 220, 255), width=1)
        x, y = 8 + (i % cols) * (tw + 8), 8 + (i // cols) * (th + 22)
        dr.text((x, y), m["name"] + (f" t={m['t']:.2f}" if m.get("t") is not None else ""), fill=(0, 0, 0))
        sheet.paste(bg.convert("RGB").resize((tw, th)), (x, y + 14))
    sheet.save(sys.argv[3], quality=88)
    print("sheet", sys.argv[3])
