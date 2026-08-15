/**
 * Genera public/imgs/og-share.jpg a partir de og-cover.jpg.
 * 1200×630 + JPEG compacto: formato esperado por WhatsApp / Open Graph (evita fallo con fotos 4K pesadas).
 */
import sharp from 'sharp'
import fs from 'fs'
import path from 'path'
import { fileURLToPath } from 'url'

const __dirname = path.dirname(fileURLToPath(import.meta.url))
const root = path.join(__dirname, '..')
const src = path.join(root, 'public', 'imgs', 'og-cover.jpg')
const dest = path.join(root, 'public', 'imgs', 'og-share.jpg')

if (!fs.existsSync(src)) {
  console.error('generate-og-share: no encontrado:', src)
  process.exit(1)
}

await sharp(src)
  .resize(1200, 630, { fit: 'cover', position: 'centre' })
  .jpeg({ quality: 82, mozjpeg: true })
  .toFile(dest)

const st = fs.statSync(dest)
const { width, height } = await sharp(dest).metadata()
console.log(`OK og-share.jpg ${width}×${height} (${(st.size / 1024).toFixed(1)} KB)`)
