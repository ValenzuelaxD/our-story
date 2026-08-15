/**
 * Validación del contrato de contenido (src/data/contenido.json).
 * Uso: node scripts/check.mjs  (npm run check)
 */
import { existsSync, readFileSync } from 'node:fs'
import { join, dirname } from 'node:path'
import { fileURLToPath, pathToFileURL } from 'node:url'

const __dirname = dirname(fileURLToPath(import.meta.url))
const root = join(__dirname, '..')
const errores = []
const avisos = []

// 1. JSON válido + importar loader (valida conversión ISO → Date)
let c
try {
  c = JSON.parse(readFileSync(join(root, 'src', 'data', 'contenido.json'), 'utf8'))
} catch (e) {
  errores.push(`contenido.json no es JSON válido: ${e.message}`)
  process.exit(1)
}

try {
  await import(pathToFileURL(join(root, 'src', 'data', 'contenido.js')).href)
} catch (e) {
  errores.push(`contenido.js no carga (fechas ISO inválidas o estructura rota): ${e.message}`)
}

const id = c.identidad
const slides = c.slides

// 2. Identidad
for (const k of ['nombreEl', 'nombreElla', 'nombreElCompleto', 'nombreEllaCompleto', 'inicioNamoro', 'siteOrigin']) {
  if (!id[k]) errores.push(`identidad.${k} vacío`)
}

// 3. Slides en sincronía
if (!Array.isArray(slides.ids) || slides.ids.length === 0) {
  errores.push('slides.ids vacío')
} else {
  if (!Array.isArray(slides.ambience) || slides.ambience.length !== slides.ids.length) {
    errores.push(`slides.ambience (${slides.ambience?.length}) no coincide con slides.ids (${slides.ids.length})`)
  }
  for (const s of slides.ids) {
    if (!slides.labels?.[s]) avisos.push(`slide "${s}" sin etiqueta en slides.labels`)
  }
}

// 4. Secciones de texto requeridas
const seccionesTexto = ['landing', 'intro', 'timer', 'musica', 'carta', 'tags', 'versiculo', 'momentos', 'historia', 'mapa', 'promessas', 'motivos', 'futuro', 'recado', 'creditos', 'cartas', 'bucket', 'conquistas', 'final', 'ui']
for (const s of seccionesTexto) {
  if (!c.texto?.[s]) errores.push(`texto.${s} ausente`)
}

// 5. Fechas del timeline en el formato del parser (mes completo en español, admite rangos)
const fechaTimeline = /^\d{1,2}(?:–\d{1,2})? de \w+ de \d{4}$/
for (const item of c.timeline || []) {
  if (typeof item.data === 'string' && !fechaTimeline.test(item.data)) {
    errores.push(`timeline.data inválida: "${item.data}" (formato: '09 de marzo de 2026' o '13–15 de febrero de 2026')`)
  }
}
const fechaConquista = / de \w{3} de \d{4}$/
for (const cq of c.conquistasLista || []) {
  if (typeof cq.data === 'string' && !fechaConquista.test(cq.data)) {
    errores.push(`conquista "${cq.id}" con data inválida: "${cq.data}" (formato: '09 de feb de 2026')`)
  }
}

// 6. Fotos existen en public/ (URL-decode: los nombres pueden llevar %20)
function existe(path) {
  return existsSync(join(publicDir, decodeURIComponent(path).replace(/^\/+/, '')))
}
const publicDir = join(root, 'public')
for (const foto of c.fotos || []) {
  if (!existe(foto)) errores.push(`foto no existe en public: ${foto}`)
}
for (const foto of (c.flores?.itens || [])) {
  for (const img of [...(foto.imagens || []), foto.imagem].filter(Boolean)) {
    if (!existe(img)) errores.push(`foto de flores no existe en public: ${img}`)
  }
}
for (const lugar of c.lugares || []) {
  if (lugar.foto && !existe(lugar.foto)) {
    errores.push(`foto del lugar "${lugar.id}" no existe en public: ${lugar.foto}`)
  }
}
if (!existe(c.texto?.intro?.foto || '')) {
  errores.push(`texto.intro.foto no existe: ${c.texto?.intro?.foto}`)
}

// 7. Build previo: og-cover y favicon son fuente del prebuild
if (!existsSync(join(publicDir, 'imgs', 'og-cover.jpg'))) {
  avisos.push('public/imgs/og-cover.jpg no existe (el prebuild de og-share fallará)')
}

// 8. index.html generado sin placeholders
const idx = readFileSync(join(root, 'index.html'), 'utf8')
if (idx.includes('{{')) {
  errores.push('index.html tiene placeholders sin reemplazar — corre node scripts/generate-index.mjs')
}

if (errores.length) {
  console.error('✗ CHECK FALLIDO:')
  for (const e of errores) console.error(`  - ${e}`)
  process.exit(1)
}
for (const a of avisos) console.warn(`  ⚠ ${a}`)
console.log(`✓ check OK (${c.fotos.length} fotos, ${c.timeline.length} hitos, ${c.conquistasLista.length} conquistas)`)