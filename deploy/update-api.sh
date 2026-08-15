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
echo "--- estado contenedores ---"
docker compose -f deploy/docker-compose.yml ps -a || true
echo "--- inspect our-story-api ---"
docker inspect our-story-api --format 'status={{.State.Status}} exit={{.State.ExitCode}} err={{.State.Error}} restarts={{.RestartCount}} oomkilled={{.State.OOMKilled}}' || true
echo "--- stats ---"
docker stats --no-stream --format '{{.Name}} mem={{.MemUsage}} cpu={{.CPUPerc}}' || true
sleep 8
echo "--- logs our-story-api ---"
docker logs --tail 100 our-story-api 2>&1 || true
echo "--- logs our-story-mysql ---"
docker logs --tail 30 our-story-mysql 2>&1 || true