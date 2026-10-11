#!/usr/bin/env bash
# Prepare a fresh (cloud) session for Anatomy figure work.
# - checks Node
# - finds or installs a headless Chrome for the skill's capture/drive/lines scripts
# - writes `.env.chrome` (export CHROME_PATH=...) and smoke-tests a capture
set -uo pipefail
cd "$(dirname "$0")/.."

echo "node  $(node -v 2>/dev/null || echo 'MISSING — install Node 20+')"
echo "npm   $(npm -v 2>/dev/null || echo MISSING)"

find_chrome() {
  local p
  for p in "${REAL_CHROME:-}" /usr/bin/google-chrome /usr/bin/google-chrome-stable /usr/bin/chromium /usr/bin/chromium-browser \
           /opt/pw-browsers/chromium "${PLAYWRIGHT_BROWSERS_PATH:-/opt/pw-browsers}"/chromium-*/chrome-linux*/chrome \
           "/Applications/Google Chrome.app/Contents/MacOS/Google Chrome"; do
    [ -n "$p" ] && [ -x "$p" ] && { echo "$p"; return 0; }
  done
  for p in "$HOME"/.cache/ms-playwright/chromium-*/chrome-linux*/chrome \
           "$HOME"/.cache/puppeteer/chrome/*/chrome-linux64/chrome \
           "$HOME"/.cache/ms-playwright/chromium_headless_shell-*/chrome-linux*/headless_shell; do
    [ -x "$p" ] && { echo "$p"; return 0; }
  done
  return 1
}

CH="$(find_chrome)" || {
  echo "No Chrome found. Trying Playwright Chromium…"
  if [ "$(id -u)" = "0" ]; then npx -y playwright@latest install --with-deps chromium >/dev/null 2>&1; else npx -y playwright@latest install chromium >/dev/null 2>&1; fi
  CH="$(find_chrome)" || {
    echo "Trying @puppeteer/browsers…"
    npx -y @puppeteer/browsers install chrome@stable --path "$HOME/.cache/puppeteer" >/dev/null 2>&1
    CH="$(find_chrome)" || true
  }
}

if [ -z "${CH:-}" ]; then
  echo
  echo "!! No headless Chrome available (network policy may block the download)."
  echo "   You can still build and run --audit. Screenshot checks need Chrome:"
  echo "   allow the Chrome/Playwright download host in the environment's network settings, or ask Peter."
  exit 0
fi

if [ "$(id -u)" = "0" ]; then
  # Root (cloud containers): Chrome needs --no-sandbox, so go through the wrapper.
  printf 'export REAL_CHROME="%s"\nexport CHROME_PATH="%s"\n' "$CH" "$PWD/scripts/chrome-root.sh" > .env.chrome
  export REAL_CHROME="$CH" CHROME_PATH="$PWD/scripts/chrome-root.sh"
else
  echo "export CHROME_PATH=\"$CH\"" > .env.chrome
  export CHROME_PATH="$CH"
fi
echo "chrome $CH"
echo "→ run: source .env.chrome"

# Smoke test: build the smallest example and capture it.
SKILL=.claude/skills/anatomy
OUT="${TMPDIR:-/tmp}/anatomy-smoke"
mkdir -p "$OUT"
node "$SKILL/examples/dial-indicator/build.mjs" >/dev/null 2>&1 \
  && node "$SKILL/scripts/capture.mjs" "$SKILL/examples/dial-indicator/dial-indicator.html" --out "$OUT/dial.png" >/dev/null 2>&1 \
  && echo "smoke  ok → $OUT/dial.png (Read it to confirm the toolchain renders)" \
  || echo "smoke  capture failed; run capture.mjs by hand to see the error"
git checkout -- "$SKILL/examples" 2>/dev/null || true
