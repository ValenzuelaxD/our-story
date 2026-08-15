/**
 * Genera public/sitemap.xml con la extensión de imágenes de Google.
 * Base de la URL: SITE_URL (env) o variables en .env / SITE_ORIGIN en constants.js.
 * @see https://developers.google.com/search/docs/crawling-indexing/sitemaps/image-sitemaps
 */
import { existsSync, readFileSync, writeFileSync } from 'node:fs'
import { dirname, join } from 'node:path'
import { fileURLToPath } from 'node:url'
import { FOTOS, SITE_ORIGIN } from '../src/data/constants.js'

const __dirname = dirname(fileURLToPath(import.meta.url))
const outPath = join(__dirname, '../public/sitemap.xml')

/** Carga SITE_URL / VITE_SITE_URL desde .env y luego .env.local (este sobrescribe). */
function loadSiteUrlFromEnvFiles() {
  const root = join(__dirname, '..')
  for (const name of ['.env', '.env.local']) {
    const p = join(root, name)
    if (!existsSync(p)) continue
    const text = readFileSync(p, 'utf8')
    for (const line of text.split('\n')) {
      const t = line.trim()
      if (!t || t.startsWith('#')) continue
      const eq = t.indexOf('=')
      if (eq === -1) continue
      const key = t.slice(0, eq).trim()
      if (key !== 'SITE_URL' && key !== 'VITE_SITE_URL') continue
      let val = t.slice(eq + 1).trim()
      if (
        (val.startsWith('"') && val.endsWith('"')) ||
        (val.startsWith("'") && val.endsWith("'"))
      ) {
        val = val.slice(1, -1)
      }
      if (val) process.env.SITE_URL = val
    }
  }
}

function siteUrlFromPackageJson() {
  try {
    const pkg = JSON.parse(readFileSync(join(__dirname, '../package.json'), 'utf8'))
    const h = typeof pkg.homepage === 'string' ? pkg.homepage.trim() : ''
    if (h && /^https?:\/\//i.test(h)) return h.replace(/\/$/, '')
  } catch {
    /* ignorar */
  }
  return ''
}

loadSiteUrlFromEnvFiles()

const raw =
  process.env.SITE_URL?.trim() ||
  (typeof SITE_ORIGIN === 'string' ? SITE_ORIGIN.trim() : '') ||
  siteUrlFromPackageJson()
const base = raw ? raw.replace(/\/$/, '') : ''

function escapeXml(s) {
  return s
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
}

const title = 'Foto - Nuestra historia'

let imageBlocks = ''
if (base) {
  for (const rel of FOTOS) {
    const path = rel.startsWith('/') ? rel : `/${rel}`
    const loc = `${base}${path}`
    imageBlocks += `
    <image:image>
      <image:loc>${escapeXml(loc)}</image:loc>
      <image:title>${escapeXml(title)}</image:title>
    </image:image>`
  }
} else {
  console.warn(
    '[generate-sitemap] Sin base de URL: define SITE_URL en .env, el secret SITE_URL en CI, ' +
      'o SITE_ORIGIN en src/data/constants.js - de lo contrario el sitemap quedará sin <image:image>.'
  )
}

const locHome = base ? `${base}/` : '/'

const xml = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9"
        xmlns:image="http://www.google.com/schemas/sitemap-image/1.1">
  <url>
    <loc>${escapeXml(locHome)}</loc>
    <changefreq>monthly</changefreq>
    <priority>1.0</priority>${imageBlocks}
  </url>
</urlset>
`

writeFileSync(outPath, xml.trim() + '\n', 'utf8')
if (base) {
  console.log(`[generate-sitemap] ${outPath} (${FOTOS.length} imágenes, base ${base})`)
} else {
  console.log(`[generate-sitemap] ${outPath} (solo inicio)`)
}
