/**
 * Regenera las rutas de fotos en src/data/contenido.json escaneando
 * public/imgs/photos/<evento>/. Conserva el orden existente y añade al final
 * las carpetas nuevas. Uso: node scripts/generate-fotos.mjs
 */
import { readdirSync, existsSync, readFileSync, writeFileSync } from 'node:fs'
import { join, dirname } from 'node:path'
import { fileURLToPath } from 'node:url'

const __dirname = dirname(fileURLToPath(import.meta.url))
const photosDir = join(__dirname, '..', 'public', 'imgs', 'photos')
const jsonPath = join(__dirname, '..', 'src', 'data', 'contenido.json')

const IMG_EXT = /\.(jpe?g|png|gif|webp|avif)$/i

function walk(dir, base = '') {
  if (!existsSync(dir)) return []
  const out = []
  for (const entry of readdirSync(dir, { withFileTypes: true })) {
    if (entry.isDirectory()) {
      out.push(...walk(join(dir, entry.name), `${base}${entry.name}/`))
    } else if (IMG_EXT.test(entry.name)) {
      out.push(`/imgs/photos/${base}${entry.name}`)
    }
  }
  return out
}

const enDisco = walk(photosDir).sort((a, b) => a.localeCompare(b, 'es'))

const contenido = JSON.parse(readFileSync(jsonPath, 'utf8'))
const previas = contenido.fotos || []

// Conserva el orden previo; añade solo las nuevas (en el orden de escaneo).
const set = new Set(previas)
const nuevas = enDisco.filter((p) => !set.has(p))
const fotos = [...previas, ...nuevas]

contenido.fotos = fotos
writeFileSync(jsonPath, JSON.stringify(contenido, null, 2) + '\n', 'utf8')

console.log(`✓ fotos: ${previas.length} previas + ${nuevas.length} nuevas = ${fotos.length}`)
if (nuevas.length) console.log('  nuevas:', nuevas.join(', '))