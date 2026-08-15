# AGENTS.md

Página romántica de una sola página (historia de Davi & Maysa) — React 19 + Vite 8 + Tailwind 4 + Framer Motion.

**Idioma:** todo lo que se escriba de aquí en adelante (comentarios, mensajes de commit, prompts, contenido) va en **español**. El contenido visible del sitio está traducido al español (no en portugués). No hay tests/lint/typecheck — verificar con `npm run build`.

## Comandos

- `npm run dev` — servidor Vite (raíz)
- `npm run build` — ejecuta `prebuild` primero (`fetch-contenido` → `generate-fotos` → `generate-index` → íconos PWA → og-share → sitemap → `check`) y luego `vite build`. Requiere `public/imgs/og-cover.jpg` como fuente.
- `npm run check` — valida `src/data/contenido.json` (fechas, fotos, sincronía de slides) y `index.html`.
- `npm run generate-fotos` — escanea `public/imgs/photos/` y añade fotos nuevas a `fotos` en el JSON.
- `npm run fetch-contenido` — sincroniza el contenido desde la API (`API_CONTEUDO_URL`); no-op sin env.
- `npm run preview` — sirve `dist/`
- API (app separada en `api/`): `cd api && npm install && cp .env.example .env && npm run dev` (Node 20+; dev = `node --env-file=.env --watch`). Producción: `npm run start`.

## Arquitectura

- El sitio es **data-driven por contrato único**: todo el contenido visible vive en `src/data/contenido.json`. `contenido.js` lo carga (convierte fechas ISO a `Date` y expone `fill()` para variables `{el}`/`{ella}`/etc. desde `identidad`) y `constants.js` es el hub que re-exporta `animations.js` + todo lo de `contenido.js` (`TEXTO`, `SLIDE_IDS`, `SLIDE_AMBIENCE`, `LABELS`, `SITE_ORIGIN`, `INICIO_NAMORO`, `DATA_CASAMENTO`, `TIMELINE`, `FOTOS`, `CONQUISTAS`, `MAPA_LUGARES`, etc.).
- Los slides son `src/components/slides/*.jsx`, montados en orden en `src/App.jsx`; `Slide` agrega `id` + `data-slide` y el slide activo se detecta por orden de DOM vía IntersectionObserver. El orden de render = orden de navegación.
- Para agregar un slide: crear componente (los textos salen de `TEXTO`, nunca hardcodeados), montarlo en `App.jsx` (el orden importa), y registrar id/emoji+glow/etiqueta/textos en `slides.ids` / `slides.ambience` / `slides.labels` / `texto.<seccion>` de `contenido.json`.
- Slides pesados (Historia, Mapa, Conquistas) son lazy-loaded con `Suspense` + `SlideSkeleton`; MapaSlide está dentro de `ErrorBoundary`.
- UI reutilizable: `Slide` (wrapper de sección), `MI` (motion item), variantes `staggerV/fadeV/scaleV` de `data/animations.js`. Clases CSS custom (`.today-pill`, `.conquista-*`) en `src/index.css`; tema Tailwind (fuentes/keyframes) en `tailwind.config.js`.

## Convenciones de datos (fáciles de romper)

- Fechas en `contenido.json` **están acopladas a sus parsers** — si cambias el formato, cambia TODOS juntos:
  - `timeline`: `data` en formato `'09 de marzo de 2026'` (mes completo en español) o rangos `'13–15 de febrero de 2026'` — lo parsea `todayInHistory.js` (array `MESES_PT` en español) y `HistoriaSlide.jsx` lo compara por **igualdad de string** con `historiaDataCorte`.
  - `conquistasLista`: `data` en formato `'09 de feb de 2026'` (mes abreviado en español) — lo parsea `getConquistaTime` en `ConquistasSlide.jsx` (map `MESES_PT` = ene, feb, mar, abr, may, jun, jul, ago, sep, oct, nov, dic); admite prefijos como `'Desde 04 de mar de 2026'`.
  - `mesesversarios` y `identidad.inicioNamoro`/`dataCasamento` en ISO local `YYYY-MM-DDTHH:mm:ss` (sin Z) — `contenido.js` los convierte a `Date`. `dataOrdem` queda ISO (`2026-03-04`).
  - `lugares` / `cartasLacradasLista` `data`/`dataTexto` son solo display.
- Rutas de fotos y nombres propios (Davi, Maysa, lugares) NO se traducen. Fotos: colocar archivos en `public/imgs/photos/<evento>/`; `generate-fotos` los añade a `fotos` (FOTOS también alimenta el sitemap de imágenes en el build). Archivos con espacios literales en disco usan `%20` en el JSON.
- `conquistasLista`: `desbloqueada: true|false`. Desbloquear una conquista nueva notifica a visitantes recurrentes vía `ConquistaUnlock`/`useNovasConquistas` (diff en localStorage; la primera visita es silenciosa).
- `useTempoJuntos` cuenta desde `INICIO_NAMORO` (identidad) y pausa su intervalo cuando la pestaña está oculta. Locales usados en el sitio: `es`.

## API (`api/`) — Recados + Contenido

- Endpoints recados: `GET /health`, `GET /api/recados` (lista pública), `POST /api/recados` (requiere `turnstileToken`), `GET /api/recados/approve` (link firmado con HMAC del e-mail).
- Endpoints contenido (Fase 3): `GET /api/contenido` (público; devuelve `{ ok, content, updated_at }`, `content: null` si la tabla está vacía) y `PUT /api/contenido` (auth `Authorization: Bearer ADMIN_TOKEN`; guarda en MySQL y dispara rebuild vía `workflow_dispatch` del workflow `deploy.yml` con `GITHUB_TOKEN`/`GITHUB_REPO`). Panel web estático en `/admin` servido por la propia API.
- Flujo contenido: `PUT` → MySQL (tabla `contenido`, fila única id=1) → workflow `deploy.yml` → `update.sh` con `API_CONTEUDO_URL=http://127.0.0.1:7000/api/contenido` → `fetch-contenido` sobreescribe `contenido.json` → build. Sin DB/API responde, el build usa el JSON del repo como seed/fallback.
- Flujo recados requiere env: TURNSTILE_SECRET_KEY + SMTP; MySQL es opcional (degradación elegante a solo e-mail). CORS solo permite `ALLOWED_ORIGINS`.
- Usa `app.listen()` — se despliega con Docker/VPS (servicio `mysql` incluido en `deploy/docker-compose.yml`), **no** es compatible con Vercel/serverless tal cual.

## Deploy y secretos

- Repo público: nunca commitear `.env` reales (raíz o api) — gitignored; solo `.env.example` está versionado. Los `.env` de producción viven en el VPS (`/opt/our-story/.env` y `/opt/our-story/api/.env`).
- Despliegue = GitHub Actions en `main` sobre el VPS propio (`66.179.211.195`): `deploy.yml` (sitio: SSH → `deploy/update.sh` → build + Nginx) y `api-ci-cd.yml` (API: SSH → escribe `api/.env` desde secrets → `deploy/update-api.sh` → Docker compose con MySQL). Requieren los secrets del repo (`SSH_HOST`/`SSH_USER`/`SSH_KEY`/`SSH_PORT` + recados + `ADMIN_TOKEN`, `PAT_WORKFLOW`, `REPO_SLUG`, `DB_*`, `MYSQL_*`, `MAIL_NOME_ELE`). Guía de aprovisionamiento en `deploy/README.md`.
- PWA + og-share.jpg se regeneran desde `public/imgs/og-cover.jpg` en el build; `index.html` se genera desde `index.html.tpl` + `identidad`. Las URLs canónicas/OG vienen de `identidad.siteOrigin` (contenido.json) e `index.html`. Hoy el sitio corre en **HTTP por IP** (`http://66.179.211.195`); al comprar dominio actualizar `identidad.siteOrigin`, `index.html.tpl`, `public/robots.txt`, `package.json`, el fallback de `api/src/index.js`, los defaults de los workflows y los `.env` del servidor, y activar HTTPS (certbot).