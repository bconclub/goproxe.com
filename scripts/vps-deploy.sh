#!/usr/bin/env bash
#
# Runs ON the VPS, shipped by .github/workflows/deploy.yml over SSH.
#
# Lives in the repo rather than inline in the workflow so the deploy step and
# its one retry run byte-identical steps, and so changing the deploy is a normal
# reviewable diff.
set -euo pipefail

APP_DIR=/var/www/goproxe
LOCK=/tmp/goproxe-deploy.lock

# Cancelling a GitHub workflow does not kill the command already running here,
# so a fast follow-up push can arrive while the previous build is still going
# and `git reset --hard` under a running build corrupts .next. flock serialises
# deploys on the box itself. Waits rather than failing: the second deploy is
# usually the one we actually want, and it is cheap to wait out the first.
exec 9>"$LOCK"
if ! flock -w 900 9; then
  echo "[deploy] another deploy held the lock for 15m, giving up"
  exit 1
fi

cd "$APP_DIR"

# Force-sync to origin/main. reset --hard never fails on a dirty tree or a stray
# untracked file, and it leaves untracked .env.local intact.
git fetch origin
git reset --hard origin/main

npm ci --production=false

rm -rf .next
export NODE_OPTIONS="--max-old-space-size=2048"
npm run build

pm2 restart goproxe || pm2 start npm --name goproxe -- start
pm2 save

# Confirm the app is actually serving before declaring success. A green deploy
# that leaves the site down is worse than a red one, because nobody looks.
for i in $(seq 1 20); do
  if curl -fsS -o /dev/null http://127.0.0.1:3002/; then
    echo "[deploy] up after ${i} check(s)"
    exit 0
  fi
  sleep 3
done

echo "[deploy] app did not answer on :3002 within 60s"
pm2 logs goproxe --lines 40 --nostream || true
exit 1
