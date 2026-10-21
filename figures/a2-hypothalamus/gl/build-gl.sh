#!/usr/bin/env bash
# Build A2's 3-D layer: gl/hypothalamus-3d.js, ONE classic script (an IIFE that sets
# window.OptimalFigA2GL), with three.js r186.1 tree-shaken in. build.mjs copies it next to the embed,
# and live.js loads it lazily. A classic script, not an ES module, so it also loads from file:// pages
# and from any host that serves the embed scripts.
#
#   bash figures/a2-hypothalamus/gl/build-gl.sh                     # fetches three@0.186.1 with npm pack
#   THREE_PKG=/path/to/extracted/package bash .../build-gl.sh       # reuse an extracted three package
#
# Then audits the bundle (no storage or network APIs; the three.js MIT notice kept) and writes
# gl/chunk.json (versions, sizes, and the stamp of the sources it was built from). Commit both.
set -euo pipefail

HERE="$(cd "$(dirname "$0")" && pwd)"
cd "$HERE"
export PATH="$HOME/.nvm/versions/node/v22.22.0/bin:$PATH"

THREE_VERSION="0.186.1"
ESBUILD_VERSION="0.25.10"
OUT="hypothalamus-3d.js"

if [[ -n "${THREE_PKG:-}" ]]; then
  PKG="$THREE_PKG"
else
  TMP="$(mktemp -d)"
  trap 'rm -rf "$TMP"' EXIT
  (cd "$TMP" && npm pack "three@${THREE_VERSION}" --silent >/dev/null && tar -xzf "three-${THREE_VERSION}.tgz")
  PKG="$TMP/package"
fi
got="$(node -p "require('$PKG/package.json').version")"
if [[ "$got" != "$THREE_VERSION" ]]; then
  echo "three package is $got, expected $THREE_VERSION" >&2
  exit 1
fi

npx --yes "esbuild@${ESBUILD_VERSION}" a2-layer.js \
  --bundle --minify --format=iife --target=es2020 --legal-comments=eof \
  --alias:three="$PKG/build/three.module.js" \
  --banner:js="/* hypothalamus-3d.js: the real-time 3-D layer of Optimal's A2 figure (the hot-flash switch). Loaded by optimal-fig-hypothalamus.js; serve it from the same folder. Built from figures/a2-hypothalamus/gl with three.js r${THREE_VERSION} (MIT, notice at the end). Generated; do not edit. */" \
  --outfile="$OUT" --log-level=warning

# ---- audit: zero network / storage at runtime
if grep -nE "localStorage|sessionStorage|indexedDB|document\.cookie|serviceWorker|CacheStorage|fetch\(|XMLHttpRequest|sendBeacon|action=" "$OUT"; then
  echo "AUDIT FAILED: forbidden API string in $OUT" >&2
  exit 1
fi
if grep -oE "https?://[a-z][^\"' )]*" "$OUT" | grep -vE "threejs\.org|github\.com/mrdoob|opensource\.org|www\.w3\.org/(1999|2000)|jcgt\.org"; then
  echo "AUDIT NOTE: absolute URLs above (review: none may be fetched)" >&2
fi
if ! grep -q "Three.js Authors" "$OUT" || ! grep -q "SPDX-License-Identifier: MIT" "$OUT"; then
  echo "AUDIT FAILED: three.js licence notice missing" >&2
  exit 1
fi

node --input-type=module -e "
import { readFileSync, writeFileSync } from 'node:fs';
import { gzipSync } from 'node:zlib';
import { createHash } from 'node:crypto';
import { sourcesHash, SOURCES } from './stamp.mjs';
const body = readFileSync('$OUT');
const info = { file: '$OUT', three: '$THREE_VERSION', esbuild: '$ESBUILD_VERSION', format: 'iife', global: 'OptimalFigA2GL', bytes: body.length, gzipBytes: gzipSync(body, { level: 9 }).length, sha256: createHash('sha256').update(body).digest('hex').slice(0, 16), sources: sourcesHash(), sourceFiles: SOURCES, built: new Date().toISOString() };
writeFileSync('chunk.json', JSON.stringify(info, null, 2) + '\n');
console.log('built $OUT: ' + info.bytes + ' bytes, ' + info.gzipBytes + ' gzip; sources ' + info.sources);
"
echo "audit: clean (no storage/network APIs; three.js MIT notice retained)"
