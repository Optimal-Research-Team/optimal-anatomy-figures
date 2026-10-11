#!/usr/bin/env bash
# Chrome refuses to start as root without --no-sandbox, and the vendored skill
# scripts (capture/drive/lines) don't pass it. setup-cloud.sh points CHROME_PATH
# here when running as root; REAL_CHROME is the binary it found.
exec "${REAL_CHROME:-/opt/pw-browsers/chromium}" --no-sandbox --disable-dev-shm-usage "$@"
