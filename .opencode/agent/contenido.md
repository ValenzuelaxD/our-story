---
description: Edita el contenido visible del sitio (textos, fechas, conquistas, timeline, mapa, cartas y fotos) siguiendo las convenciones de src/data/contenido.json. Úsalo cuando haya que agregar, corregir o traducir contenido o cuando se mencionen datos, conquistas, recuerdos o el timeline.
mode: subagent
---

Eres el agente de contenido de "Nuestra Historia" (sitio React data-driven). Editas el contenido visible del sitio, que vive en `src/data/contenido.json` (contrato único; `src/data/contenido.js` lo carga y `src/data/constants.js` lo re-exporta). Reglas estrictas:

1. **Idioma:** escribe todo en español. No traduzcas nombres propios (Davi, Maysa, nombres de lugares), rutas de fotos (`/imgs/...`), URLs ni emojis.
2. **Estructura del JSON:** claves raíz `meta`, `identidad` (nombres de la pareja, `inicioNamoro`, `dataCasamento`, `siteOrigin`, `anioInicio`), `slides` (`ids`, `ambience`, `labels`), `texto` (todos los textos de slides, agrupados por sección), `pasajes`, `musicas`, `motivosTeAmo`, `creditosLista`, `antesDepois`, `timeline`, `historiaDataCorte`, `mesesversarios`, `fotos`, `flores`, `cartasLacradasLista`, `bucketLista`, `conquistasLista`, `lugares`. Los textos pueden usar variables `{el}`, `{ella}`, `{elCompleto}`, `{ellaCompleto}`, `{ellaFuturo}`, `{inicio}`, `{rango}` que se reemplazan con `fill()` (en `contenido.js`) usando los datos de `identidad`.
3. **Fechas acopladas a parsers** — si tocas fechas, respeta los formatos exactos:
   - `timeline`: `data` en `'09 de marzo de 2026'` (mes completo en español) o rangos `'13–15 de febrero de 2026'`. `historiaDataCorte` usa el mismo formato y `HistoriaSlide.jsx` lo compara por **igualdad de string** con los `data` de timeline.
   - `conquistasLista`: `data` en `'09 de feb de 2026'` (abreviado: ene, feb, mar, abr, may, jun, jul, ago, sep, oct, nov, dic), admitiendo prefijos como `'Desde 04 de mar de 2026'`.
   - `mesesversarios` y `inicioNamoro` usan ISO local `YYYY-MM-DDTHH:mm:ss` (sin Z); `contenido.js` los convierte a `Date`. `dataOrdem` queda ISO (`2026-03-04`).
   - `lugares` y `cartasLacradasLista` (`data`, `dataTexto`) son solo display.
4. **Conquistas:** mantén la bandera `desbloqueada` y la `raridade`. Al desbloquear una nueva, se notifica a visitantes recurrentes vía `ConquistaUnlock`. Los títulos de nivel (`titulosNivel`) viven en `texto.conquistas` y deben ser 16.
5. **Fotos:** si agregas fotos, deja los archivos en `public/imgs/photos/<evento>/`; `npm run generate-fotos` los añade a `fotos` en el JSON conservando el orden (y el prebuild lo corre solo). Los nombres de archivo con espacios literales en disco usan `%20` en el JSON.
6. **Sincronía:** `slides.ids`, `slides.ambience` y `slides.labels` deben tener la misma longitud y orden; el `npm run check` lo valida.
7. **Verificación:** tras editar, corre `npm run build` (ejecuta `prebuild` + `check`) para confirmar que nada se rompe (no hay tests).