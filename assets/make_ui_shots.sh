#!/usr/bin/env bash
#
# Take the README screenshots of the panel.
#
# The pictures used to be drawn by hand in SVG and drifted from the panel
# within days. These are the built panel itself, rendered against the fixed
# readings in assets/preview/data.js, so a picture can only be wrong if the
# panel is.
#
# Needs a Chromium-based browser, which is used headless with a throwaway
# profile - it never touches the one you browse with. Run from the repository
# root after building the frontend:
#
#     npm --prefix frontend run build
#     assets/make_ui_shots.sh
#
set -euo pipefail

cd "$(dirname "$0")/.."

BROWSER="${BROWSER_BIN:-}"
if [ -z "$BROWSER" ]; then
  for candidate in \
    "/Applications/Brave Browser.app/Contents/MacOS/Brave Browser" \
    "/Applications/Google Chrome.app/Contents/MacOS/Google Chrome" \
    "/Applications/Chromium.app/Contents/MacOS/Chromium" \
    "$(command -v google-chrome || true)" \
    "$(command -v chromium || true)"; do
    [ -n "$candidate" ] && [ -x "$candidate" ] && BROWSER="$candidate" && break
  done
fi
if [ -z "$BROWSER" ]; then
  echo "No Chromium-based browser found. Set BROWSER_BIN to one." >&2
  exit 1
fi

if [ ! -f custom_components/marstek_modbus/frontend/marstek-modbus-panel.js ]; then
  echo "Panel bundle missing. Run: npm --prefix frontend run build" >&2
  exit 1
fi

PORT="${PORT:-8899}"
PROFILE="$(mktemp -d)"
python3 -m http.server "$PORT" --bind 127.0.0.1 >/dev/null 2>&1 &
SERVER=$!
trap 'kill $SERVER 2>/dev/null || true; rm -rf "$PROFILE"' EXIT

# Wait for the server rather than guessing at a sleep.
until curl -sf "http://127.0.0.1:$PORT/assets/preview/data.js" >/dev/null; do sleep 0.2; done

shoot() {
  local name=$1 query=$2 height=$3
  "$BROWSER" \
    --headless --disable-gpu --no-sandbox --hide-scrollbars \
    --user-data-dir="$PROFILE" \
    --force-device-scale-factor=2 \
    --window-size=1400,"$height" \
    --virtual-time-budget=8000 \
    --screenshot="assets/$name.png" \
    "http://127.0.0.1:$PORT/assets/preview/?$query" 2>/dev/null
  printf '  %-22s %s\n' "assets/$name.png" "$(du -h "assets/$name.png" | cut -f1)"
}

echo "Shooting the panel:"
shoot ui-overview "tab=core"      880
shoot ui-cells    "tab=cells"     980
shoot ui-packs    "tab=packs"     1080
shoot ui-control  "tab=control"   860
shoot ui-settings "view=settings" 820
