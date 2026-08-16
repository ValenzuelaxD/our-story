#!/usr/bin/env bash
# Actualiza la API (Docker) en el VPS (lo invoca GitHub Actions o manualmente).
set -euo pipefail
umask 022

REPO_DIR="/opt/our-story"
LOCK_FILE="/tmp/our-story-deploy.lock"
cd "$REPO_DIR"

# Serializa TODO el deploy de la API con el del sitio (mismo lock): evita que
# npm install + vite build + docker build corran a la vez y maten de OOM el VPS.
exec 9>"$LOCK_FILE"
flock -x 9

flock "$LOCK_FILE" git fetch origin main
flock "$LOCK_FILE" git reset --hard origin/main

docker compose -f deploy/docker-compose.yml up -d --build
echo "API actualizada."
echo "--- estado contenedores ---"
docker compose -f deploy/docker-compose.yml ps -a || true
echo "--- logs our-story-api ---"
docker logs --tail 60 our-story-api 2>&1 || true
echo "--- logs our-story-mysql ---"
docker logs --tail 30 our-story-mysql 2>&1 || true