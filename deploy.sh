#!/usr/bin/env bash
#
# Deploy goproxe — Next.js app on the VPS, run by pm2 as "goproxe".
#
# Safe to re-run. Force-syncs the working tree to origin/main so a dirty
# package-lock.json (left behind by a previous `npm install`) can never block
# the deploy with "local changes would be overwritten". Untracked files such as
# .env.local (which holds LEADS_WEBHOOK_URL etc.) are preserved by reset --hard.
#
# Usage on the server:  cd /var/www/goproxe && bash deploy.sh
#
set -euo pipefail

cd /var/www/goproxe

echo "📥  Syncing to origin/main…"
git fetch origin
git reset --hard origin/main

echo "📦  Installing dependencies…"
npm install

echo "🔨  Building…"
npm run build

echo "♻️   Restarting app (pm2: goproxe)…"
pm2 restart goproxe --update-env

echo "✅  Deploy complete — now at $(git rev-parse --short HEAD)"
