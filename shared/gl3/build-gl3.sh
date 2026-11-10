#!/usr/bin/env bash
# Build the shared 3-D layer: shared/gl3/optimal-gl3.js, ONE classic script (an IIFE that sets window.OptimalGL3)
# with three.js tree-shaken in. Each figure's build copies it next to its embed, and shared/gl3/host.js loads it
# lazily. A classic script, not an ES module, so it also loads from file:// pages and any static host.
#
#   bash shared/gl3/build-gl3.sh                    # fetches three with npm pack
#   THREE_PKG=/path/to/extracted/package bash …     # reuse an extracted three package
#
# Then audits the bundle (no storage or network APIs; the three.js MIT notice kept) and writes chunk.json.
set -euo pipefail
HERE="$(cd "$(dirname "$0")" && pwd)"
cd "$HERE"
export PATH="$HOME/.nvm/versions/node/v22.23.4/bin:$PATH"

THREE_VERSION="0.186.1"
ESBUILD_VERSION="0.25.10"
OUT="optimal-gl3.js"

if [[ -n "${THREE_PKG:-}" ]]; then
  PKG="$THREE_PKG"
else
  TMP="$(mktemp -d)"
  trap 'rm -rf "$TMP"' EXIT
  (cd "$TMP" && npm pack "three@${THREE_VERSION}" --silent >/dev/null && tar -xzf "three-${THREE_VERSION}.tgz")
  PKG="$TMP/package"
fi
got="$(node -p "require('$PKG/package.json').version")"
[[ "$got" == "$THREE_VERSION" ]] || { echo "three package is $got, expected $THREE_VERSION" >&2; exit 1; }

npx --yes "esbuild@${ESBUILD_VERSION}" src/gl3.js \
  --bundle --minify --format=iife --global-name=OptimalGL3 --target=es2020 --legal-comments=eof \
  --alias:three="$PKG/build/three.module.js" --alias:three-addons="$PKG/examples/jsm" \
  --banner:js="/* optimal-gl3.js: the real-time 3-D layer shared by Optimal's figures. Loaded by each optimal-fig-*.js; serve it from the same folder. Built from shared/gl3 with three.js r${THREE_VERSION} (MIT, notice at the end). Generated; do not edit. */" \
  --outfile="$OUT" --log-level=warning

if grep -nE "localStorage|sessionStorage|indexedDB|document\.cookie|serviceWorker|CacheStorage|fetch\(|XMLHttpRequest|sendBeacon|action=" "$OUT"; then
  echo "AUDIT FAILED: forbidden API string in $OUT" >&2; exit 1
fi
if grep -oE "https?://[a-z][^\"' )]*" "$OUT" | grep -vE "threejs\.org|github\.com/mrdoob|opensource\.org|www\.w3\.org/(1999|2000)|jcgt\.org|khronos\.org|modelviewer\.dev|github\.com/google"; then
  echo "AUDIT NOTE: absolute URLs above (review: none may be fetched)" >&2
fi
if ! grep -q "Three.js Authors" "$OUT" || ! grep -q "SPDX-License-Identifier: MIT" "$OUT"; then
  echo "AUDIT FAILED: three.js licence notice missing" >&2; exit 1
fi
node --input-type=module -e "
import { readFileSync, writeFileSync } from 'node:fs';
import { gzipSync } from 'node:zlib';
import { createHash } from 'node:crypto';
const body = readFileSync('$OUT');
const src = createHash('sha256').update(readFileSync('src/gl3.js')).digest('hex').slice(0, 16);
const info = { file: '$OUT', three: '$THREE_VERSION', esbuild: '$ESBUILD_VERSION', format: 'iife', global: 'OptimalGL3', bytes: body.length, gzipBytes: gzipSync(body, { level: 9 }).length, sha256: createHash('sha256').update(body).digest('hex').slice(0, 16), sources: src, built: new Date().toISOString() };
writeFileSync('chunk.json', JSON.stringify(info, null, 2) + '\n');
console.log('built $OUT: ' + info.bytes + ' bytes, ' + info.gzipBytes + ' gzip; sources ' + info.sources);
"
echo "audit: clean (no storage/network APIs; three.js MIT notice retained)"
