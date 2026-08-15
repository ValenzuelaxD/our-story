# AGENTS.md

Página romántica de una sola página (historia de Davi & Maysa) — React 19 + Vite 8 + Tailwind 4 + Framer Motion.

**Idioma:** todo lo que se escriba de aquí en adelante (comentarios, mensajes de commit, prompts, contenido) va en **español**. El contenido visible del sitio está traducido al español (no en portugués). No hay tests/lint/typecheck — verificar con `npm run build`.

## Comandos

- `npm run dev` — servidor Vite (raíz)
- `npm run build` — ejecuta `prebuild` primero (íconos PWA, og-share, sitemap) y luego `vite build`. Requiere `public/imgs/og-cover.jpg` como fuente.
- `npm run preview` — sirve `dist/`
- `npm run generate-sitemap` — usa `SITE_URL` o cae a `SITE_ORIGIN` en `src/data/constants.js`
- API (app separada en `api/`): `cd api && npm install && cp .env.example .env && npm run dev` (Node 20+; dev = `node --env-file=.env --watch`). Producción: `npm run start`.

## Arquitectura

- El sitio es **data-driven**: casi todo el texto vive en `src/data/`. `constants.js` es el hub que re-exporta `animations.js`, `timeline.js`, `fotos.js`, `cartas.js`, `conquistas.js`, `mapa.js`, además de MOTIVOS_TE_AMO, CREDITOS, ANTES_DEPOIS, PASSAGENS_BIBLICAS, SPOTIFY_URLS, SLIDE_IDS, SLIDE_AMBIENCE, SITE_ORIGIN, INICIO_NAMORO.
- Los slides son `src/components/slides/*.jsx`, montados en orden en `src/App.jsx`; `Slide` agrega `id` + `data-slide` y el slide activo se detecta por orden de DOM vía IntersectionObserver. El orden de render = orden de navegación.
- Para agregar un slide: crear componente, montarlo en `App.jsx` (el orden importa), agregar su id a `SLIDE_IDS` y emoji/glow a `SLIDE_AMBIENCE` (constants.js), y añadir etiqueta a `LABELS` en `src/components/ui/CerimoniaBtn.jsx`.
- Slides pesados (Historia, Mapa, Conquistas) son lazy-loaded con `Suspense` + `SlideSkeleton`; MapaSlide está dentro de `ErrorBoundary`.
- UI reutilizable: `Slide` (wrapper de sección), `MI` (motion item), variantes `staggerV/fadeV/scaleV` de `data/animations.js`. Clases CSS custom (`.today-pill`, `.conquista-*`) en `src/index.css`; tema Tailwind (fuentes/keyframes) en `tailwind.config.js`.

## Convenciones de datos (fáciles de romper)

- Fechas `data` de `timeline.js` y `conquistas.js` **están acopladas a sus parsers** — si cambias el formato, cambia TODOS juntos:
  - `timeline.js`: `data` en formato `'09 de marzo de 2026'` (mes completo en español) — lo parsea `todayInHistory.js` (array `MESES_PT` en español) y `HistoriaSlide.jsx` lo compara por **igualdad de string** con `HISTORIA_DATA_CORTE` (`'08 de marzo de 2026'`).
  - `conquistas.js`: `data` en formato `'09 de feb de 2026'` (mes abreviado en español) — lo parsea `getConquistaTime` en `ConquistasSlide.jsx` (map `MESES_PT` = ene, feb, mar, abr, may, jun, jul, ago, sep, oct, nov, dic).
  - `MESESVERSARIOS` usa objetos `Date` (no se parsean). `dataOrdem` queda ISO (`2026-03-04`).
  - `mapa.js` / `cartas.js` `data`/`dataTexto` son solo display.
- Rutas de fotos y nombres propios (Davi, Maysa, lugares) NO se traducen. Fotos: colocar archivos en `public/imgs/photos/<evento>/` y referenciarlos en `src/data/fotos.js` (FOTOS también alimenta el sitemap de imágenes en el build).
- `CONQUISTAS`: `desbloqueada: true|false`. Desbloquear una conquista nueva notifica a visitantes recurrentes vía `ConquistaUnlock`/`useNovasConquistas` (diff en localStorage; la primera visita es silenciosa).
- `useTempoJuntos` cuenta desde `INICIO_NAMORO` (2026-03-04) y pausa su intervalo cuando la pestaña está oculta. Locales usados en el sitio: `es`.

## API (`api/`) — formulario de Recados

- Endpoints: `GET /health`, `GET /api/recados` (lista pública), `POST /api/recados` (requiere `turnstileToken`), `GET /api/recados/approve` (link firmado con HMAC del e-mail).
- Flujo completo requiere env: TURNSTILE_SECRET_KEY + SMTP; MySQL es opcional (degradación elegante a solo e-mail). CORS solo permite `ALLOWED_ORIGINS`.
- Usa `app.listen()` — se despliega con Docker/VPS, **no** es compatible con Vercel/serverless tal cual.

## Deploy y secretos

- Repo público: nunca commitear `.env` reales (raíz o api) — gitignored; solo `.env.example` está versionado. Los `.env` de producción viven en el VPS (`/opt/our-story/.env` y `/opt/our-story/api/.env`).
- Despliegue = GitHub Actions en `main` sobre el VPS propio (`66.179.211.195`): `deploy.yml` (sitio: SSH → `deploy/update.sh` → build + Nginx) y `api-ci-cd.yml` (API: SSH → escribe `api/.env` desde secrets → `deploy/update-api.sh` → Docker compose). Requieren los secrets del repo (`SSH_HOST`/`SSH_USER`/`SSH_KEY`/`SSH_PORT` + los de la API). Guía de aprovisionamiento en `deploy/README.md`.
- PWA + og-share.jpg se regeneran desde `public/imgs/og-cover.jpg` en el build; las URLs canónicas/OG vienen de `SITE_ORIGIN` (constants.js) e `index.html`. Hoy el sitio corre en **HTTP por IP** (`http://66.179.211.195`); al comprar dominio actualizar `SITE_ORIGIN`, `index.html`, `public/robots.txt`, `package.json`, el fallback de `api/src/index.js`, los defaults de los workflows y los `.env` del servidor, y activar HTTPS (certbot).