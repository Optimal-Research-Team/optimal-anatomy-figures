# Rebuild review/contact-sheet.png: every figure's Cream desktop capture, cropped to its art, in a 5-column
# grid with its number, title and status (from figure.json). Run after scripts/verify.mjs has refreshed the
# shots:  python3 scripts/contact-sheet.py   (needs Pillow: pip install pillow)
import json
import os
from PIL import Image, ImageDraw, ImageFont

ROOT = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
# folder, the capture that best shows the idea (first that exists)
ORDER = [
    ("01-menopause-thermostat", ["desktop-light-flash.png", "desktop-light.png"]),
    ("02-inbody-580", ["desktop-light.png"]),
    ("03-iv-iron", ["desktop-light-iv-day7.png", "desktop-light.png"]),
    ("04-creator-600", ["desktop-light.png"]),
    ("05-vo2max", ["desktop-light.png"]),
    ("06-vo2max-treadmill", ["desktop-light.png"]),
    ("a1-gut-cell", ["desktop-full-light.png", "desktop-light.png"]),
    ("a2-hypothalamus", ["desktop-post-light.png", "desktop-light.png"]),
    ("a3-finger-skin", ["desktop-light.png"]),
    ("a4-heart", ["desktop-light.png"]),
    ("a5-alveolus", ["desktop-light.png"]),
    ("a6-red-cell-cycle", ["desktop-iv-light.png", "desktop-light.png"]),
    ("a7-knee", ["desktop-light.png"]),
    ("a8-muscle-water", ["desktop-light.png"]),
    ("a9-bone-remodelling", ["desktop-post-light.png", "desktop-light.png"]),
]
CW, CH, COLS, PAD, LABEL = 360, 480, 5, 20, 64


def font(size, bold=True):
    for f in ["/System/Library/Fonts/Supplemental/Arial Bold.ttf" if bold else "/System/Library/Fonts/Supplemental/Arial.ttf", "/usr/share/fonts/truetype/dejavu/DejaVuSans-Bold.ttf"]:
        try:
            return ImageFont.truetype(f, size)
        except OSError:
            pass
    return ImageFont.load_default()


cards = []
for folder, names in ORDER:
    base = os.path.join(ROOT, "figures", folder)
    path = next((os.path.join(base, "shots", n) for n in names if os.path.exists(os.path.join(base, "shots", n))), None)
    if not path:
        continue
    meta = json.load(open(os.path.join(base, "figure.json"))) if os.path.exists(os.path.join(base, "figure.json")) else {}
    im = Image.open(path).convert("RGB")
    im = im.resize((CW, round(im.height * CW / im.width)), Image.LANCZOS)
    card = Image.new("RGB", (CW, CH), (255, 252, 247))  # captures shorter than the crop sit on cream, not black
    card.paste(im.crop((0, 0, CW, min(CH, im.height))), (0, 0))
    im = card
    n = str(meta.get("n", ""))
    cards.append((im, f"{n if n.startswith('A') else n} · {meta.get('title', folder)}", meta.get("status", "")))

rows = (len(cards) + COLS - 1) // COLS
sheet = Image.new("RGB", (PAD + COLS * (CW + PAD), PAD + rows * (CH + LABEL + PAD)), (254, 248, 241))
d = ImageDraw.Draw(sheet)
for i, (im, title, status) in enumerate(cards):
    x = PAD + (i % COLS) * (CW + PAD)
    y = PAD + (i // COLS) * (CH + LABEL + PAD)
    sheet.paste(im, (x, y))
    t = title if d.textlength(title, font=font(21)) <= CW else title[: max(4, int(len(title) * CW / d.textlength(title, font=font(21))) - 2)] + "…"
    d.text((x, y + CH + 8), t, fill=(44, 78, 37), font=font(21))
    d.text((x, y + CH + 36), status, fill=(118, 115, 109), font=font(17, False))
out = os.path.join(ROOT, "review", "contact-sheet.png")
sheet.save(out)
print("wrote", os.path.relpath(out, ROOT), sheet.size, f"{len(cards)} figures")
