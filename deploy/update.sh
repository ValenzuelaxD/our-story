#!/usr/bin/env bash
# Actualiza el sitio en el VPS (lo invoca GitHub Actions o manualmente).
set -euo pipefail
export NVM_DIR="$HOME/.nvm"
[ -s "$NVM_DIR/nvm.sh" ] && . "$NVM_DIR/nvm.sh"

REPO_DIR="/opt/our-story"
WEB_ROOT="/var/www/our-story"

cd "$REPO_DIR"
git pull --ff-only
npm install --no-audit --no-fund --package-lock=false
npm run build
mkdir -p "$WEB_ROOT"
cp -r dist/. "$WEB_ROOT/"
nginx -t && systemctl reload nginx
echo "Sitio actualizado."