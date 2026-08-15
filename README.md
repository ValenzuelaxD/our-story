# Our Story ❤️

![Deploy](https://img.shields.io/badge/deploy-live-brightgreen?style=flat-square)
![Vite](https://img.shields.io/badge/Vite-6-646CFF?style=flat-square&logo=vite&logoColor=white)
![React](https://img.shields.io/badge/React-19-61DAFB?style=flat-square&logo=react&logoColor=black)
![License](https://img.shields.io/badge/feito%20com-amor-ff69b4?style=flat-square)

> *"Desde el primer día sentí que algo en ti era diferente."*

Este repositorio no es solo código — es amor compilado, commit a commit.

Aquí vive una página que hice especialmente para la **Maysa**, el amor de mi vida. Cada línea fue escrita pensando en ella, en cada momento que vivimos juntos, en cada sonrisa que me hizo bien.

Si estás leyendo esto y no eres ella... bienvenido al repositorio de un tipo completamente enamorado. 🥹

---

## Lo que hay aquí dentro 💌

Cada sección de la página fue pensada con cariño:

| Sección | Contenido |
|---------|-----------|
| 🌹 **Intro** | Lo primero que ella ve al abrir |
| ⏳ **Timer** | Conteo en tiempo real - días, horas, minutos y segundos juntos |
| 🌗 **Antes & después** | "Antes de ti" × "Después de ti" - en dos columnas |
| 🎵 **Músicas** | Las bandas sonoras de nuestro amor - 11 pistas vía Spotify |
| 💌 **Carta** | Una carta escrita del corazón, para leerse con calma |
| ✨ **Sobre ella** | Las cosas que más amo de ella |
| ✝️ **Versículo** | 1 Corintios 13 - la base de todo |
| 📸 **Momentos** | Un carrusel con nuestras fotos juntos |
| 📖 **Nuestra historia** | Cada momento marcante desde el comienzo |
| 🗺️ **Mapa** | Mapa interactivo con los lugares de nuestra historia - cada punto abre foto e historia |
| 🌸 **Flores** | Las flores que ya te di, cada una con su significado |
| 🤍 **Promesas** | Compromisos reales, hechos para durar |
| 💛 **Motivos** | Todo lo que me hace amarte |
| 🌅 **Futuro** | Los sueños que quiero construir a su lado |
| 💬 **Recado** | Formulario para que amigos y familia dejen un mensaje (Turnstile + API) |
| 🎬 **Créditos** | Cierre estilo cine con los personajes de nuestra historia |
| 📩 **Cartas lacradas** | Cartas con fecha de apertura futura - para abrir en el momento justo |
| 🌿 **Bucket list** | Lista de cosas para vivir juntos - progreso guardado en el navegador |
| 💝 **Final** | El cierre - con una sorpresa para quien llegue hasta ahí |

---

## Recados (formulario + API)

Quien llega hasta el final de la historia puede enviar **nombre, e-mail y mensaje**. El envío lo maneja una **API en Node** en la carpeta `api/`: validación, **Cloudflare Turnstile** en el servidor, CORS cerrado, rate limit y e-mail en **HTML** (con visual alineado al sitio e imagen de portada servida desde el propio sitio). El modo texto plano sigue enviándose junto para clientes que no renderizan HTML.

**Front (Vite):** variables en `.env` en la raíz - ver [.env.example](.env.example) (`VITE_RECADOS_API_URL`, `VITE_TURNSTILE_SITE_KEY`).

**API:** variables en `api/.env` - ver [api/.env.example](api/.env.example). Resumen técnico en [api/README.md](api/README.md).

**CI:** el deploy se hace por **SSH** al VPS propio desde GitHub Actions; el front se compila en el servidor (`deploy/update.sh`) y la API se reconstruye con Docker (`deploy/update-api.sh`). Secretos y URLs reales no quedan documentados aquí (repo público). Guía completa en [deploy/README.md](deploy/README.md).

---

## Deploy (GitHub Actions → SSH al VPS)

El sitio y la API corren en el propio VPS (Nginx para el sitio estático + Docker para la API). En el push a `main`:

1. **`deploy.yml`** (cambios que no tocan `api/`): SSH → `git pull` → `deploy/update.sh` (`npm ci` → build → copia `dist/` a `/var/www/our-story` → reload de Nginx).
2. **`api-ci-cd.yml`** (cambios en `api/`): SSH → `git pull` → escribe `api/.env` desde los secrets → `deploy/update-api.sh` (Docker compose rebuild).

El build del front (Vite) toma las variables `VITE_*` de `/opt/our-story/.env` del servidor.

### Secrets del repositorio (Actions)

| Secret | Uso |
|--------|-----|
| `SSH_HOST` | IP del VPS (ej.: `66.179.211.195`) |
| `SSH_USER` / `SSH_PORT` | Usuario y puerto SSH (ej.: `root` / `22`) |
| `SSH_KEY` | Llave privada (ed25519) para autenticarse |
| `TURNSTILE_SECRET_KEY` | Secret del Turnstile (validación en la API) |
| `MAIL_SERVER`, `MAIL_PORT`, `MAIL_USERNAME`, `MAIL_PASSWORD` | SMTP del envío de recados |
| `MAIL_FROM` / `MAIL_TO` | Remitente / destinatario (por defecto = `MAIL_USERNAME`) |
| `APPROVE_SECRET` | HMAC de los links de aprobación (`openssl rand -hex 32`) |
| `API_BASE_URL` / `ALLOWED_ORIGINS` | Ej.: `http://66.179.211.195` |

Variables locales: copia [.env.example](.env.example) a `.env` en la raíz y [api/.env.example](api/.env.example) a `api/.env`.

### Preview de link (WhatsApp, iMessage, etc.)

- El HTML apunta `og:image` a **`/imgs/og-share.jpg`** (generada en el build). No uses la `og-cover.jpg` original en las meta tags: los archivos muy grandes suelen hacer que WhatsApp **no muestre** la miniatura.
- Después de publicar, el caché de las apps puede tardar. Para forzar re-scrape: [Herramienta de depuración de Facebook](https://developers.facebook.com/tools/debug/) (pega la URL y usa **Buscar de nuevo**).

---

## Tecnologías

Porque hasta la stack fue elegida con amor:

- ⚛️ **React + Vite** - rápido como mi corazón cuando ella aparece
- 🎨 **Tailwind CSS** - estiloso como ella
- 🎞️ **Framer Motion** - con animaciones tan suaves como su manera de ser
- 🗺️ **Leaflet + react-leaflet** - mapa interactivo de los lugares de nuestra historia
- 💬 **Cloudflare Turnstile** - captcha en el formulario de recados
- 📧 **Node (Express) + Nodemailer** - API de recados y e-mail formateado

---

## Estructura del Proyecto

```
src/
├── App.jsx                        # Orquestador principal
├── data/
│   └── constants.js               # Constantes, textos y variantes de animación
├── hooks/
│   └── index.js                   # useTempoJuntos, useCountUp, useIsMobile
└── components/
    ├── animations/
    │   ├── HeartsRain.jsx
    │   ├── ButterfliesFloating.jsx
    │   └── SlideThemedAmbience.jsx
    ├── ui/
    │   ├── MI.jsx                 # Motion Item - wrapper de animación
    │   ├── Slide.jsx              # Wrapper de sección con InView
    │   ├── Divider.jsx
    │   ├── NavDots.jsx
    │   └── CookieConsent.jsx      # Cookies / medición (solo si VITE_GA_MEASUREMENT_ID)
    ├── recados/
    │   └── RecadoForm.jsx         # Formulario + Turnstile
    └── slides/
        ├── LandingPage.jsx
        ├── IntroSlide.jsx
        ├── TimerSlide.jsx
        ├── AntesDepoisSlide.jsx
        ├── MusicaSlide.jsx
        ├── CartaSlide.jsx
        ├── TagsSlide.jsx
        ├── VersiculoSlide.jsx
        ├── MomentosSlide.jsx
        ├── HistoriaSlide.jsx
        ├── MapaSlide.jsx          # Mapa interactivo (Leaflet) con lugares de la historia
        ├── PresenteFotosSlide.jsx
        ├── PromessasSlide.jsx
        ├── MotivosSlide.jsx
        ├── FuturoSlide.jsx
        ├── RecadoSlide.jsx
        ├── CreditosSlide.jsx
        ├── CartasLacradasSlide.jsx
        ├── BucketListSlide.jsx
        └── FinalSlide.jsx
```

```
scripts/
├── generate-sitemap.mjs
├── generate-pwa-icons.mjs
└── generate-og-share.mjs      # og-share.jpg 1200×630 a partir de og-cover.jpg
```

```
api/                         # Servicio HTTP de los recados (opcional en dev)
├── src/
│   ├── index.js
│   ├── mail.js              # Template HTML + SMTP
│   ├── turnstile.js
│   └── validate.js
└── Dockerfile
```

---

## Cómo ejecutar localmente

```bash
npm install
npm run dev
```

Para probar el flujo completo de los recados en dev, levanta también la API (`cd api`, copia `api/.env.example` a `api/.env`, `npm install` y `npm run dev`) y apunta `VITE_RECADOS_API_URL` a `http://localhost:7000/api/recados` en el `.env` de la raíz.

## Build para producción

```bash
npm run build
```

El `prebuild` corre automáticamente: íconos PWA, **`og-share.jpg`** (preview social) y sitemap. Exige `public/imgs/og-cover.jpg` como fuente.

Se recomienda definir antes las variables `VITE_*` del `.env` (o equivalente en el CI) para el formulario de recados (y analytics, si se usa) en el build publicado.

---

<div align="center">

Hecho con mucho ☕, algunas noches sin dormir, y un amor enorme

por **Davi Antonaji** - para la **Maysa**, que hizo todo esto real 🌹

*Juntos desde 04 de marzo de 2026*

❤️

</div>