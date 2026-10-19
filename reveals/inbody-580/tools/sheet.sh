#!/bin/bash
# usage: tools/sheet.sh <out.jpg> <cols> <tile-width> <png...>   (images sorted in the order given)
set -e
export PATH="$HOME/.local/bin:$PATH"
out="$1"; cols="$2"; tw="$3"; shift 3
tmp="$(dirname "$out")/.sheet-$$"
mkdir -p "$tmp"
i=0
for f in "$@"; do cp "$f" "$tmp/$(printf '%03d' $i).png"; i=$((i+1)); done
rows=$(( (i + cols - 1) / cols ))
ffmpeg -v error -y -framerate 1 -i "$tmp/%03d.png" -vf "scale=${tw}:-1,pad=iw+8:ih+8:4:4:color=0xE7E9E0,tile=${cols}x${rows}:color=0xE7E9E0" -frames:v 1 -q:v 3 "$out"
rm -rf "$tmp"
echo "$out ($i frames, ${cols}x${rows})"
