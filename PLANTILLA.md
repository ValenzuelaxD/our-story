# PLANTILLA.md — Reutilizar "Nuestra Historia" como plantilla

El repo es una **plantilla data-driven**: todo el contenido visible (textos, nombres, fechas, fotos, conquistas, timeline, mapa, etc.) vive en `src/data/contenido.json`. Para crear el sitio de otra pareja no se toca código: se edita ese JSON (a mano, o vía el panel web `/admin` cuando la API y MySQL estén desplegados).

> Lo que NO es data-driven y hay que cambiar en código: identidad visual (colores/fuentes en `tailwind.config.js` y `src/index.css`), la estructura de slides (`src/App.jsx`, `src/components/slides/*`), y el contenido de `public/imgs/` (fotos, og-cover.jpg, íconos PWA).

## Paso 1 — Datos de la pareja (`identidad`)

| Clave | Uso | Ejemplo |
| --- | --- | --- |
| `nombreEl` | Nombre corto de Él (variables `{el}`) | `"Davi"` |
| `nombreElPublico` | Nombre + apellido que se muestra | `"Davi Antonaji"` |
| `nombreElCompleto` | Nombre completo (JSON-LD, boda) | `"Davi de Melo Antonaji"` |
| `nombreElla` | Nombre corto de Ella (`{ella}`) | `"Maysa"` |
| `nombreEllaCompleto` | Nombre completo | `"Maysa Sophia Ferreira da Silva"` |
| `nombreEllaFuturo` | Nombre con el apellido del Él | `"Maysa Sophia Ferreira da Silva Antonaji"` |
| `inicioNamoro` | ISO local `YYYY-MM-DDTHH:mm:ss` (sin Z) | `"2026-03-04T00:00:00"` |
| `dataCasamento` | ISO local; **vacío `""` si no hay fecha** | `""` |
| `siteOrigin` | URL canónica del sitio | `"http://66.179.211.195"` |
| `anioInicio` | Año del inicio (footer, sitemap) | `2026` |

Cambios automáticos tras editar `identidad`: títulos/OG/JSON-LD en `index.html` (se regenera desde `index.html.tpl` en el prebuild), `public/robots.txt`, firma de e-mails (`MAIL_NOME_ELE` en la API, con fallback a "Davi").

## Paso 2 — Variables en los textos (`{...}`)

Los textos de `texto.*` pueden usar `fill()` (en `src/data/contenido.js`), que reemplaza:

- `{el}` / `{elCompleto}` → `nombreEl` / `nombreElCompleto`
- `{ella}` / `{ellaCompleto}` / `{ellaFuturo}` → nombres de Ella
- `{inicio}` / `{rango}` → fechas derivadas de `inicioNamoro` (día de la semana "El día X de MMMM", y rango del mesversario actual)

Si un texto no es válido (fecha vacía, etc.), `fill()` deja la variable literal: busca `{...}` sin reemplazar y corrígelo.

## Paso 3 — Fotos

1. Pon los archivos en `public/imgs/photos/<evento>/`.
2. Corre `npm run generate-fotos` (o el prebuild lo hace solo): escanea y añade las nuevas a `fotos` en el JSON, conservando el orden existente.
3. Archivos con espacios literales en disco ("Rosa 1.jpeg") deben ir con `%20` en el JSON.
4. Regenera la imagen de portada `public/imgs/og-cover.jpg` (1200×630, mínimo) si quieres un OG distinto.

## Paso 4 — Formato de fechas (¡fáciles de romper!)

| Sección | Formato | Ejemplo | Parser |
| --- | --- | --- | --- |
| `timeline[].data` | mes completo en español; permite rangos con `–` | `"09 de marzo de 2026"` o `"13–15 de febrero de 2026"` | `todayInHistory.js`, `HistoriaSlide.jsx` (compara por string con `historiaDataCorte`) |
| `historiaDataCorte` | igual que timeline (igualdad de string) | `"08 de marzo de 2026"` | `HistoriaSlide.jsx` |
| `conquistasLista[].data` | mes abreviado en español (ene…dic); admite prefijo `"Desde "` | `"09 de feb de 2026"`, `"Desde 04 de mar de 2026"` | `getConquistaTime` (`ConquistasSlide.jsx`) |
| `mesesversarios[].fecha` | ISO local | `"2026-04-04T12:00:00"` | `contenido.js` → `Date` |
| `lugares[].data`, `cartasLacradasLista[].data/dataTexto` | solo display, sin parsear | — | — |

`dataOrdem` (orden de timeline/eventos) queda ISO simple `2026-03-04`.

## Paso 5 — Slides (estructura)

- Cada sección tiene: id en `slides.ids`, emoji+glow en `slides.ambience`, etiqueta en `slides.labels`, y sus textos en `texto.<seccion>`. Las tres listas de `slides` deben tener **la misma longitud y orden** (lo valida `npm run check`).
- El orden de render en `src/App.jsx` = orden de navegación. Para añadir/quitar una sección, edita `App.jsx` y las listas de `slides`.
- Textos nuevos: usa variables `{el}`/`{ella}` cuando corresponda, no nombres fijos.
- Secciones pesadas (Historia, Mapa, Conquistas) son lazy-loaded; no las pongas en modo eager sin motivo.

## Paso 6 — Panel web / edición en producción (Fase 3)

Con la API y MySQL desplegados:

- `GET http://IP:7000/api/contenido` → `{ ok, content, updated_at }` (público; `content: null` si la tabla está vacía).
- `PUT http://IP:7000/api/contenido` con header `Authorization: Bearer <ADMIN_TOKEN>` y el JSON completo como body. Guarda en MySQL (tabla `contenido`, fila id=1) y dispara el rebuild del sitio vía GitHub Actions (`workflow_dispatch` en `deploy.yml`, requiere secret `PAT_WORKFLOW` — PAT fine-grained con scopes "Workflow" y "Actions").
- Panel web: `http://IP:7000/admin` — pide el `ADMIN_TOKEN`, edita `identidad` + JSON completo y guarda. El rebuild tarda unos minutos.
- El build en producción corre `fetch-contenido` (con `API_CONTEUDO_URL`) antes de compilar: si la API/DB no responden, usa el JSON del repo (fallback).

## Verificación

1. `npm run check` — valida fechas, fotos y sincronía de slides.
2. `npm run build` — build completo (prebuild + check + vite).
3. Previsualiza con `npm run preview` y revisa: Timer, timeline, conquistas (fechas parseadas), mapa (centro/zoom en `texto.mapa`), cartas, recados y el og-share.