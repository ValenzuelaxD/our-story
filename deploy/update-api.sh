#!/usr/bin/env bash
# Actualiza la API (Docker) en el VPS (lo invoca GitHub Actions o manualmente).
set -euo pipefail

REPO_DIR="/opt/our-story"
cd "$REPO_DIR"
git pull --ff-only
docker compose -f deploy/docker-compose.yml up -d --build
echo "API actualizada."