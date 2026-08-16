import sharp from 'sharp'
import { fileURLToPath } from 'url'
import path from 'path'
import fs from 'fs'

// VPS pequeño (1.8 GB): un solo worker de libvips evita picos de memoria al
// decodificar og-cover.jpg (12 MP) y que el build muera de OOM.
sharp.concurrency(1)
sharp.cache(false)

const __dirname = path.dirname(fileURLToPath(import.meta.url))
const root = path.join(__dirname, '..')
const src = path.join(root, 'public', 'imgs', 'og-cover.jpg')

if (!fs.existsSync(src)) {
  console.error('generate-pwa-icons: archivo no encontrado:', src)
  process.exit(1)
}

const out = [
  { size: 192, name: 'pwa-192x192.png' },
  { size: 512, name: 'pwa-512x512.png' },
  { size: 180, name: 'apple-touch-icon.png' },
]

for (const { size, name } of out) {
  const dest = path.join(root, 'public', name)
  await sharp(src)
    .resize(size, size, { fit: 'cover', position: 'centre' })
    .png({ compressionLevel: 9 })
    .toFile(dest)
  console.log('OK', name)
}
