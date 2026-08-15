# Despliegue en tu VPS (Ubuntu)

Sitio estático (Nginx) + API de recados (Docker). Todo en un solo servidor.

## Aprovisionamiento (una sola vez)

1. Accede por SSH a tu VPS.
2. Desde tu máquina local, copia y ejecuta el script de provisión:

   ```bash
   scp deploy/setup-vps.sh root@66.179.211.195:/tmp/
   ssh root@66.179.211.195 "bash /tmp/setup-vps.sh 66.179.211.195"
   ```

   Instala Node (nvm), Docker y Nginx, clona el repo, compila el sitio y levanta la API.
3. Completa los secrets en el servidor:
   - Front: `/opt/our-story/.env` (`VITE_TURNSTILE_SITE_KEY`, `VITE_GA_MEASUREMENT_ID`).
   - API: `/opt/our-story/api/.env` (`TURNSTILE_SECRET_KEY`, `MAIL_*`, `APPROVE_SECRET`, `API_BASE_URL`, `ALLOWED_ORIGINS`).

## Actualización

- **Automática**: push a `main` → GitHub Actions hace SSH y ejecuta
  `deploy/update.sh` (sitio) y `deploy/update-api.sh` (API).
- **Manual**: `ssh root@66.179.211.195 "cd /opt/our-story && bash deploy/update.sh"`.

## Secrets de GitHub (Settings → Secrets and variables → Actions)

- `SSH_HOST`, `SSH_USER`, `SSH_KEY`, `SSH_PORT` — acceso al VPS (llave privada ed25519).
- `TURNSTILE_SECRET_KEY` — secret del widget Cloudflare Turnstile.
- `MAIL_SERVER`, `MAIL_PORT`, `MAIL_USERNAME`, `MAIL_PASSWORD`, `MAIL_FROM`, `MAIL_TO` — SMTP.
- `APPROVE_SECRET` — firma HMAC de los links de aprobación (`openssl rand -hex 32`).
- `API_BASE_URL`, `ALLOWED_ORIGINS` — p. ej. `http://66.179.211.195`.
- `MAIL_NOME_ELE` — nombre que firma los e-mails (por defecto "Davi").

## Fase 3 — Contenido editable (MySQL + panel `/admin`)

- Secrets nuevos: `ADMIN_TOKEN` (`openssl rand -hex 32`), `DB_HOST` (`mysql`), `DB_PORT`
  (`3306`), `DB_USER`/`DB_NAME` (`ourstory`), `DB_PASSWORD` (= `MYSQL_PASSWORD`),
  `MYSQL_ROOT_PASSWORD`, `MYSQL_DATABASE`/`MYSQL_USER`, `REPO_SLUG` (`owner/repo`).
  **`DB_PASSWORD` y `MYSQL_PASSWORD` deben ser el MISMO valor** (el API se autentica
  contra el usuario que crea el contenedor MySQL).
- `GITHUB_PAT`: fine-grained PAT con permiso **"workflow"** solo para el repo, para que
  la API dispare el rebuild (`workflow_dispatch` de `deploy.yml`) tras un `PUT`.
- Flujo: `PUT http://IP:7000/api/contenido` (Bearer `ADMIN_TOKEN`) → MySQL → dispatch
  rebuild → `update.sh` corre `fetch-contenido` (pull desde la API) → build → Nginx.
  Panel web en `http://IP/admin` (mismo `ADMIN_TOKEN`).
- MySQL corre en Docker (`deploy/docker-compose.yml`, imagen `mysql:5.7`); el volumen
  persiste los datos. Si cambias las contraseñas, borra el volumen viejo para reiniciarlo.

## HTTPS (cuando tengas dominio)

1. Compra un dominio y apunta un registro A a la IP del VPS.
2. Cambia `http://66.179.211.195` por `https://tudominio.com` en:
   `src/data/constants.js` (SITE_ORIGIN), `index.html`, `public/robots.txt`,
   `package.json`, fallback de `api/src/index.js`, defaults de los workflows y los `.env` del servidor.
3. En el VPS: `apt install -y certbot python3-certbot-nginx && certbot --nginx -d tudominio.com -d www.tudominio.com`.
4. Actualiza `VITE_RECADOS_API_URL`, `API_BASE_URL` y `ALLOWED_ORIGINS` con la URL https.