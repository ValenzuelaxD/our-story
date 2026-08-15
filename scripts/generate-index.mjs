/**
 * Genera index.html a partir de index.html.tpl usando la identidad de
 * src/data/contenido.json. Uso: node scripts/generate-index.mjs
 */
import { readFileSync, writeFileSync } from 'node:fs'
import { join, dirname } from 'node:path'
import { fileURLToPath } from 'node:url'

const __dirname = dirname(fileURLToPath(import.meta.url))
const root = join(__dirname, '..')
const tpl = readFileSync(join(root, 'index.html.tpl'), 'utf8')
const c = JSON.parse(readFileSync(join(root, 'src', 'data', 'contenido.json'), 'utf8'))

const id = c.identidad
const SITE = id.siteOrigin
const elPublico = id.nombreElPublico || id.nombreEl
const TITULO = `${elPublico} & ${id.nombreEllaCompleto} - Nuestra Historia`
const DESCRIPCION = `Nuestra historia: ${elPublico} y ${id.nombreEllaCompleto}. Momentos, promesas, versículo y todo lo que construye nuestro amor.`
const SITE_NOMBRE = `Nuestra Historia - ${id.nombreEl} & ${id.nombreElla}`
const ALT_IMG = `${elPublico} y ${id.nombreEllaCompleto} - Nuestra Historia`
const LD_NOMBRE = `${elPublico} y ${id.nombreEllaCompleto} - Nuestra Historia`
const FOTO_PRELOAD = c.texto.intro.foto

const out = tpl
  .replaceAll('{{TITULO}}', TITULO)
  .replaceAll('{{DESCRIPCION}}', DESCRIPCION)
  .replaceAll('{{SITE_NOMBRE}}', SITE_NOMBRE)
  .replaceAll('{{SITE}}', SITE)
  .replaceAll('{{ALT_IMG}}', ALT_IMG)
  .replaceAll('{{LD_NOMBRE}}', LD_NOMBRE)
  .replaceAll('{{FOTO_PRELOAD}}', FOTO_PRELOAD)

if (out.includes('{{')) {
  console.error('✗ quedaron placeholders sin reemplazar en index.html')
  process.exit(1)
}

writeFileSync(join(root, 'index.html'), out, 'utf8')
console.log(`✓ index.html generado (${TITULO})`)