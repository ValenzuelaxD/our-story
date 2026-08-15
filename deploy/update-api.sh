#!/usr/bin/env bash
# Actualiza la API (Docker) en el VPS (lo invoca GitHub Actions o manualmente).
set -euo pipefail

REPO_DIR="/opt/our-story"
LOCK_FILE="/tmp/our-story-deploy.lock"
cd "$REPO_DIR"

# Serializa el sync con el deploy del sitio (ambos workflows corren en paralelo).
flock "$LOCK_FILE" git fetch origin main
flock "$LOCK_FILE" git reset --hard origin/main

docker compose -f deploy/docker-compose.yml up -d --build
echo "API actualizada."