#!/bin/bash
# usage: tools/check-mp4.sh <name e.g. 16x9> <cols-for-sheet> <tile-width>
# 1. extracts every frame of out/inbody-580-<name>.mp4 (the skill's check), 2. a 12-frame check sheet,
# 3. the 8-frame contact sheet out/sheet-<name>.jpg
set -e
export PATH="$HOME/.local/bin:$PATH"
cd "$(dirname "$0")/.."
name="$1"; cols="$2"; tw="$3"
mp4="out/inbody-580-$name.mp4"
dir="out/check-$name"
rm -rf "$dir"; mkdir -p "$dir"
ffprobe -v error -show_entries stream=width,height,r_frame_rate,nb_frames,codec_name,pix_fmt -show_entries format=duration -of default=nw=1 "$mp4"
ffmpeg -v error -i "$mp4" -vsync 0 "$dir/f_%03d.png"
n=$(ls "$dir"/f_*.png | wc -l | tr -d ' ')
echo "extracted $n frames"
pick() { for t in "$@"; do printf '%s/f_%03d.png ' "$dir" $(( $(printf '%.0f' "$(echo "$t * 30" | bc)") + 1 )); done; }
tools/sheet.sh "$dir/check12.jpg" "$cols" "$tw" $(pick 0.3 1.2 2.1 2.7 3.7 4.5 5.4 6.0 6.6 7.6 9.4 11.9)
tools/sheet.sh "out/sheet-$name.jpg" 4 "$tw" $(pick 1.8 2.8 3.8 5.6 6.7 7.8 9.5 11.9)
