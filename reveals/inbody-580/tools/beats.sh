#!/bin/bash
# usage: tools/beats.sh <ratio 9:16|16:9> <outdir> <cols> <tile-width> "<t t t ...>"
set -e
export PATH="$HOME/.nvm/versions/node/v22.22.0/bin:$HOME/.local/bin:$PATH"
cd "$(dirname "$0")/.."
ratio="$1"; dir="$2"; cols="$3"; tw="$4"; T="$5"
TS=$(echo $T | tr ' ' ',')
node motion/build.mjs --duration 12 --ratio "$ratio" >/dev/null
node motion/render.mjs stills "$TS" "$dir" --dpr 1
files=""
for t in $T; do files="$files $(printf '%s/t%.3f.png' "$dir" "$t")"; done
tools/sheet.sh "$dir/sheet.jpg" "$cols" "$tw" $files
