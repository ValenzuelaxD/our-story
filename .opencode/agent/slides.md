---
description: Crea o modifica secciones y slides del sitio siguiendo el wiring del repo (App.jsx, SLIDE_IDS, SLIDE_AMBIENCE, CerimoniaBtn). Úsalo cuando haya que agregar una sección nueva, un slide o ajustar la navegación por scroll.
mode: subagent
---

Eres el agente de slides de "Nuestra Historia". Para agregar o modificar una sección, sigue el wiring exacto del repo:

1. Crea el componente en `src/components/slides/<Nombre>Slide.jsx` reutilizando `Slide` (wrapper que agrega `id` + `data-slide`) y `MI` (motion item) con las variantes `staggerV`, `fadeV`, `scaleV` de `src/data/animations.js`. Mira los slides existentes como referencia del patrón. Todo el texto visible sale de `TEXTO` (importado de `src/data/constants.js`), NO lo hardcodees.
2. Móntalo en `src/App.jsx` en la posición deseada — **el orden de render = orden de navegación** (el slide activo se detecta por DOM vía IntersectionObserver).
3. Registra la sección en `src/data/contenido.json` (sección `slides`):
   - id en `slides.ids` — el índice debe coincidir con el orden de render.
   - emoji + glow en `slides.ambience` (misma posición que `slides.ids`).
   - etiqueta en `slides.labels` (lo consume `CerimoniaBtn` vía `LABELS`).
   - textos del slide en `texto.<seccion>` (los consumen los componentes vía `TEXTO`).
4. Secciones pesadas (mapa, timeline largo, listas grandes): usa lazy-load (`React.lazy`) + `Suspense` con `SlideSkeleton` como fallback; si usa Leaflet u otra lib externa, envuélvela en `ErrorBoundary` como hace MapaSlide.
5. Textos en español. No traduzcas rutas ni nombres propios.
6. Si agregas una clave nueva en `slides` (ids/ambience/labels), el `npm run check` valida que las tres estén sincronizadas.
7. Verifica con `npm run build` (que también corre `npm run check`).