#!/bin/bash
# goproxe.com deploy: immutable releases, one at a time, live only after proof.
#
# 4 Sep 2026: two deploys overlapped. The second one's `npm ci` wiped
# node_modules out from under the first one's build and the running server;
# the swap logic then moved a half-built .next over the live one and the
# public site rendered with no CSS, then went down. Root causes, both fixed
# here: (1) nothing prevented two deploys at once, (2) the deploy mutated the
# directory the live server was running from.
#
# Now:
#   - flock: a second deploy exits immediately while one is running.
#   - every deploy builds in its OWN directory under /var/www/goproxe-releases,
#     with its own node_modules and .next. The live release is never touched.
#   - the new build is started on a spare port and must answer / and a
#     stylesheet with 200 before it is allowed near production.
#   - go-live is one symlink flip (/var/www/goproxe-current) + pm2 restart.
#     If the post-flip check fails, the symlink flips straight back.
#   - the last 3 releases stay on disk; rollback = flip the symlink, no build.
#
# Shared, persistent things live in the repo checkout and are linked into
# each release: .env.local, blog-audio-cache, .npm-cache.
#
# Usage on the box:  bash /var/www/goproxe/deploy.sh        (this file)
# Rollback:          bash /var/www/goproxe/deploy.sh --rollback
set -euo pipefail

REPO=/var/www/goproxe
RELEASES=/var/www/goproxe-releases
CURRENT=/var/www/goproxe-current
APP=goproxe
PORT=3002
SMOKE_PORT=3007
KEEP=3

exec 9>/tmp/goproxe-deploy.lock
if ! flock -w 1800 9; then echo "another deploy held the lock for 30 minutes; giving up"; exit 1; fi
echo "lock acquired"

mkdir -p "$RELEASES"

rollback() {
  local prev
  prev=$(ls -1dt "$RELEASES"/*/ 2>/dev/null | grep -v "$(readlink -f "$CURRENT" 2>/dev/null || echo NONE)" | head -1)
  [ -n "$prev" ] || { echo "no previous release to roll back to"; exit 1; }
  ln -sfn "${prev%/}" "$CURRENT"
  pm2 restart "$APP" --update-env >/dev/null
  echo "rolled back to ${prev%/}"
}
if [ "${1:-}" = "--rollback" ]; then rollback; exit 0; fi

echo "Pulling..."
cd "$REPO"
git pull --ff-only origin main
SHA=$(git rev-parse --short HEAD)
REL="$RELEASES/$(date +%Y%m%d-%H%M%S)-$SHA"
mkdir -p "$REL"
# A release that dies before it goes live (npm ci, build, smoke) is removed;
# only the flip step below disarms this.
cleanup_failed_release() { [ -d "$REL" ] && [ "$(readlink -f "$CURRENT" 2>/dev/null)" != "$REL" ] && rm -rf "$REL" && echo "removed failed release $REL"; }
trap cleanup_failed_release EXIT

echo "Exporting clean source to $REL ..."
git archive HEAD | tar -x -C "$REL"
ln -s "$REPO/.env.local" "$REL/.env.local"
mkdir -p "$REPO/blog-audio-cache" "$REPO/.npm-cache"
ln -s "$REPO/blog-audio-cache" "$REL/blog-audio-cache"

cd "$REL"
echo "Installing (isolated node_modules)..."
npm ci --no-audit --no-fund --cache "$REPO/.npm-cache"

echo "Narrating blog posts (cached; never blocks the deploy)..."
node scripts/gen-blog-audio.mjs || echo "blog audio step failed, existing narrations kept"

echo "Building..."
NODE_OPTIONS="--max-old-space-size=6144" npm run build
test -f .next/BUILD_ID

echo "Smoke test on :$SMOKE_PORT ..."
( npx next start -p $SMOKE_PORT >/tmp/goproxe-smoke.log 2>&1 & echo $! >/tmp/goproxe-smoke.pid )
ok=0
for i in $(seq 1 30); do
  sleep 2
  if curl -sf -o /tmp/goproxe-smoke.html "http://localhost:$SMOKE_PORT/"; then
    css=$(grep -oE 'href="/_next/static/css/[^"]+' /tmp/goproxe-smoke.html | head -1 | sed 's/href="//')
    if [ -n "$css" ] && curl -sf -o /dev/null "http://localhost:$SMOKE_PORT$css"; then ok=1; break; fi
  fi
done
kill "$(cat /tmp/goproxe-smoke.pid)" 2>/dev/null || true
sleep 1
if [ "$ok" != 1 ]; then
  echo "SMOKE TEST FAILED - the new build never served / with its CSS. Live site untouched."
  tail -20 /tmp/goproxe-smoke.log
  rm -rf "$REL"
  exit 1
fi

trap - EXIT
echo "Going live..."
PREV=$(readlink -f "$CURRENT" 2>/dev/null || true)
ln -sfn "$REL" "$CURRENT"
# The pm2 app must run FROM the symlink, not from the repo checkout (its
# old home). If it still points elsewhere, re-create it once; from then on a
# restart re-resolves the symlink to the new release.
cwd_now=$(pm2 describe "$APP" 2>/dev/null | grep -E 'exec cwd' | awk -F'│' '{gsub(/ /,"",$3); print $3}' || true)
if [ "$cwd_now" = "$CURRENT" ]; then
  pm2 restart "$APP" --update-env >/dev/null
else
  pm2 delete "$APP" >/dev/null 2>&1 || true
  pm2 start npm --name "$APP" --cwd "$CURRENT" -- start >/dev/null
fi
pm2 save >/dev/null

sleep 5
if curl -sf -o /tmp/goproxe-live.html "http://localhost:$PORT/" \
   && css=$(grep -oE 'href="/_next/static/css/[^"]+' /tmp/goproxe-live.html | head -1 | sed 's/href="//') \
   && [ -n "$css" ] && curl -sf -o /dev/null "http://localhost:$PORT$css"; then
  echo "DEPLOY OK $(cat "$REL/.next/BUILD_ID") ($SHA) -> $REL"
else
  echo "LIVE CHECK FAILED after flip - rolling back"
  if [ -n "$PREV" ] && [ -d "$PREV" ]; then ln -sfn "$PREV" "$CURRENT"; pm2 restart "$APP" --update-env >/dev/null; fi
  exit 1
fi

echo "Pruning old releases (keeping $KEEP)..."
ls -1dt "$RELEASES"/*/ | tail -n +$((KEEP + 1)) | while read -r old; do
  [ "$(readlink -f "${old%/}")" = "$(readlink -f "$CURRENT")" ] && continue
  rm -rf "$old"
done
echo "done"
