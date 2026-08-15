#!/usr/bin/env bash
# Aprovisiona un VPS Ubuntu limpio para el sitio + API "Our Story".
#
# Uso (una sola vez, como root):
#   bash setup-vps.sh [IP_O_DOMINIO]
#
# Opcional: VITE_TURNSTILE_SITE_KEY y VITE_GA_MEASUREMENT_ID se pasan como
# 2º y 3º argumento, o se editan después en /opt/our-story/.env
set -euo pipefail

IP="${1:-66.179.211.195}"
BASE="http://$IP"
REPO_DIR="/opt/our-story"
WEB_ROOT="/var/www/our-story"
export DEBIAN_FRONTEND=noninteractive

echo "==> [1/8] Actualizando el sistema..."
apt-get update -y
apt-get upgrade -y -o Dpkg::Options::="--force-confold"

echo "==> [2/8] Instalando dependencias base (git, curl, nginx)..."
apt-get install -y git curl ca-certificates nginx

echo "==> [3/8] Instalando Node.js 22 (nvm)..."
export NVM_DIR="$HOME/.nvm"
if [ ! -d "$NVM_DIR" ]; then
  curl -fsSL https://raw.githubusercontent.com/nvm-sh/nvm/v0.40.1/install.sh | bash
fi
. "$NVM_DIR/nvm.sh"
nvm install 22
nvm use 22
nvm alias default 22

echo "==> [4/8] Instalando Docker..."
if ! command -v docker >/dev/null 2>&1; then
  curl -fsSL https://get.docker.com | sh
fi
systemctl enable --now docker

echo "==> [5/8] Abriendo puertos en ufw (si está activo)..."
if command -v ufw >/dev/null 2>&1; then
  ufw allow 22/tcp
  ufw allow 80/tcp
  ufw allow 443/tcp
  echo "==> ufw: puertos 22/80/443 permitidos."
fi

echo "==> [6/8] Clonando el repositorio..."
if [ ! -d "$REPO_DIR/.git" ]; then
  git clone https://github.com/ValenzuelaxD/our-story.git "$REPO_DIR"
else
  git -C "$REPO_DIR" pull --ff-only
fi

echo "==> [7/8] Creando .env del front y compilando..."
cat > "$REPO_DIR/.env" <<EOF
SITE_URL=$BASE
VITE_RECADOS_API_URL=$BASE/api/recados
VITE_TURNSTILE_SITE_KEY=${2:-}
VITE_GA_MEASUREMENT_ID=${3:-}
EOF
cd "$REPO_DIR"
npm ci
npm run build
mkdir -p "$WEB_ROOT"
cp -r dist/. "$WEB_ROOT/"

echo "==> [8/8] Configurando Nginx y levantando la API (Docker)..."
cp deploy/nginx.conf /etc/nginx/sites-available/our-story
ln -sf /etc/nginx/sites-available/our-story /etc/nginx/sites-enabled/our-story
rm -f /etc/nginx/sites-enabled/default
nginx -t
systemctl reload nginx

if [ ! -f "$REPO_DIR/api/.env" ]; then
  umask 077
  cat > "$REPO_DIR/api/.env" <<EOF
NODE_ENV=production
PORT=7000
TRUST_PROXY=1
ALLOWED_ORIGINS=$BASE
EOF
fi
cd "$REPO_DIR"
docker compose -f deploy/docker-compose.yml up -d --build

echo
echo "==> Listo. Sitio: $BASE"
echo "    Health: $BASE/health"
echo "    Recados (GET): $BASE/api/recados"
echo
echo "Pendientes:"
echo "  1. Completa /opt/our-story/api/.env con TURNSTILE_SECRET_KEY y MAIL_* (o déjalos en los secrets de GitHub)."
echo "  2. Si usas Turnstile, rellena VITE_TURNSTILE_SITE_KEY en /opt/our-story/.env y vuelve a ejecutar deploy/update.sh."