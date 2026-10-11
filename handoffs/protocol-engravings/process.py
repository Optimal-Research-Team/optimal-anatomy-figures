#!/usr/bin/env python3
"""Rebuild the protocol engravings from their Higgsfield masters.

You only need this to re-cut sizes or make print files. The finished web
files are already in the zip linked from HANDOFF.md.

    python3 -m pip install pillow numpy
    python3 process.py                 # web WebPs -> ./web/
    python3 process.py --print         # also 2000px JPEGs for print/PDF -> ./print/
    python3 process.py --only bone-spine-hip --print

Each master is a sage-ink engraving on white. The steps:
  1. luminance -> ink coverage (0 = paper, 1 = full ink), against one house ink
  2. trim to the ink plus a 2.5% margin
  3. redraw in the single house ink on pure white (so every plate matches)
  4. Lanczos resize to two widths, WebP q76 (large) and q74 (small)
"""
import argparse, io, json, os, sys, urllib.request
import numpy as np
from PIL import Image

HERE = os.path.dirname(os.path.abspath(__file__))
INK = np.array([55, 71, 40], np.float32)          # house ink (median of the darkest strokes)
L_INK = 0.2126 * INK[0] + 0.7152 * INK[1] + 0.0722 * INK[2]
SIZES = {"w": [1040, 640], "h": [960, 560], "m": [720, 440]}  # by width, by height, by longest side


def load_master(item, cache):
    os.makedirs(cache, exist_ok=True)
    path = os.path.join(cache, item["id"] + ".png")
    if not os.path.exists(path):
        print("  downloading", item["master"]["url"])
        with urllib.request.urlopen(item["master"]["url"]) as r, open(path, "wb") as f:
            f.write(r.read())
    return Image.open(path).convert("RGB")


def flatten(img):
    a = np.asarray(img).astype(np.float32)
    lum = 0.2126 * a[..., 0] + 0.7152 * a[..., 1] + 0.0722 * a[..., 2]
    cov = np.clip((255 - lum) / (255 - L_INK), 0, 1)
    cov[cov < 0.03] = 0                                # paper noise
    ys, xs = np.where(cov > 0.06)
    pad = int(0.025 * max(a.shape[:2]))
    y0, x0 = max(0, ys.min() - pad), max(0, xs.min() - pad)
    y1, x1 = min(a.shape[0], ys.max() + pad), min(a.shape[1], xs.max() + pad)
    cov = cov[y0:y1, x0:x1, None]
    return Image.fromarray((INK * cov + 255 * (1 - cov) + 0.5).astype(np.uint8))


def fit(img, mode, px):
    w, h = img.size
    s = px / w if mode == "w" else px / h if mode == "h" else px / max(w, h)
    return img.resize((round(w * s), round(h * s)), Image.LANCZOS)


def main():
    ap = argparse.ArgumentParser()
    ap.add_argument("--only", help="one item id from manifest.json")
    ap.add_argument("--print", action="store_true", help="also write 2000px JPEGs for print")
    ap.add_argument("--out", default=HERE)
    args = ap.parse_args()
    items = json.load(open(os.path.join(HERE, "manifest.json")))["items"]
    if args.only:
        items = [i for i in items if i["id"] == args.only] or sys.exit("no item " + args.only)
    for item in items:
        print(item["id"])
        flat = flatten(load_master(item, os.path.join(args.out, ".masters")))
        mode = item["fit"]["mode"]
        os.makedirs(os.path.join(args.out, "web"), exist_ok=True)
        for i, px in enumerate(SIZES[mode]):
            im = fit(flat, mode, px)
            name = f"engraving-{item['id']}-{im.size[0]}w.webp"
            im.save(os.path.join(args.out, "web", name), "WEBP", quality=76 if i == 0 else 74, method=6)
            print("  web/" + name, im.size)
        if args.print:
            os.makedirs(os.path.join(args.out, "print"), exist_ok=True)
            im = fit(flat, "m", 2000)
            name = f"engraving-{item['id']}-print.jpg"
            im.save(os.path.join(args.out, "print", name), "JPEG", quality=88, optimize=True, subsampling=0)
            print("  print/" + name, im.size)


if __name__ == "__main__":
    main()
