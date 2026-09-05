#!/bin/bash
# goproxe.com: pull-based deploy safety net.
#
# The GitHub Action deploys by SSHing into the box. On 5 Sep 2026 that SSH
# dial timed out from the runner ("dial tcp :22: i/o timeout") and commit
# 9e1ec17 sat on main for two hours with the site one release behind. Nothing
# on the box knew. This poller closes that hole: every two minutes cron asks
# GitHub what main is, compares it with the release that is live, and if they
# differ it runs the same deploy.sh the Action runs. Push to main and the site
# follows, whether or not GitHub can reach the box.
#
# Installed by hand once:
#   cp /var/www/goproxe/scripts/deploy-poll.sh /var/www/goproxe/deploy-poll.sh
#   chmod +x /var/www/goproxe/deploy-poll.sh
#   crontab: */2 * * * * /var/www/goproxe/deploy-poll.sh >> /var/log/goproxe-deploy-poll.log 2>&1
#
# Safe by construction:
#   - flock -n: if a deploy (Action or manual) holds the lock, skip this tick.
#   - one attempt per sha per 30 minutes: a build that fails its smoke test
#     is not retried every two minutes.
#   - silent when there is nothing to do; the log only grows on action.
set -uo pipefail

REPO=/var/www/goproxe
CURRENT=/var/www/goproxe-current
LOCK=/tmp/goproxe-deploy.lock
LAST=/var/tmp/goproxe-deploy-poll.last
RETRY_AFTER=1800

cd "$REPO" || exit 1
git fetch -q origin main 2>/dev/null || exit 0
want=$(git rev-parse --short origin/main 2>/dev/null) || exit 0
live=$(basename "$(readlink -f "$CURRENT" 2>/dev/null)" | sed -E 's/^[0-9]{8}-[0-9]{6}-//')
[ -n "$want" ] || exit 0
[ "$want" = "$live" ] && exit 0

# Same sha attempted recently: leave it alone (a failing build should not loop).
if [ -f "$LAST" ]; then
  read -r last_sha last_at <"$LAST"
  now=$(date +%s)
  if [ "$last_sha" = "$want" ] && [ $((now - last_at)) -lt $RETRY_AFTER ]; then exit 0; fi
fi

# A deploy already running (Action, manual): it will land this sha or the next.
exec 9>"$LOCK"
if ! flock -n 9; then exit 0; fi
flock -u 9

echo "$want $(date +%s)" >"$LAST"
echo "[$(date -u +%FT%TZ)] live=$live main=$want -> deploying"
git checkout -q main && git pull -q --ff-only origin main || { echo "pull failed"; exit 1; }
cp scripts/deploy-vps.sh deploy.sh && chmod +x deploy.sh
bash deploy.sh
echo "[$(date -u +%FT%TZ)] deploy.sh exit $?"
