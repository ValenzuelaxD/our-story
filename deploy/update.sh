#!/usr/bin/env bash
# Actualiza el sitio en el VPS (lo invoca GitHub Actions o manualmente).
set -euo pipefail
export NVM_DIR="$HOME/.nvm"
[ -s "$NVM_DIR/nvm.sh" ] && . "$NVM_DIR/nvm.sh"

REPO_DIR="/opt/our-story"
WEB_ROOT="/var/www/our-story"
LOCK_FILE="/tmp/our-story-deploy.lock"

cd "$REPO_DIR"

# Serializa el sync con el deploy de la API (ambos workflows corren en paralelo)
# para evitar que dos `git fetch` concurrentes compitan por las refs.
flock "$LOCK_FILE" git fetch origin main
flock "$LOCK_FILE" git reset --hard origin/main

npm install --no-audit --no-fund --package-lock=false

# Fase 3: sincroniza el contenido editado vía API (si responde) antes de compilar.
# fetch-contenido degrada elegantemente al JSON del repo si la API no está.
export API_CONTEUDO_URL="${API_CONTEUDO_URL:-http://127.0.0.1:7000/api/contenido}"

npm run build
mkdir -p "$WEB_ROOT"
cp -r dist/. "$WEB_ROOT/"
nginx -t && systemctl reload nginx
echo "Sitio actualizado."