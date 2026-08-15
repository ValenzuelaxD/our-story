import fs from 'fs'
import path from 'path'
import { fileURLToPath } from 'url'

const __dirname = path.dirname(fileURLToPath(import.meta.url))
const photosDir = path.join(__dirname, '..', 'public', 'imgs', 'photos')
const outputPath = path.join(photosDir, 'list.json')

const extensions = /\.(jpg|jpeg|png|gif|webp|avif)$/i

try {
  if (!fs.existsSync(photosDir)) {
    fs.mkdirSync(photosDir, { recursive: true })
  }
  const files = fs.readdirSync(photosDir)
    .filter((f) => extensions.test(f))
    .sort()
  const urls = files.map((f) => `/imgs/photos/${f}`)
  fs.writeFileSync(outputPath, JSON.stringify(urls))
  console.log(`✓ ${urls.length} foto(s) encontrada(s) em public/imgs/photos`)
} catch (err) {
  console.error('Erro ao gerar lista de fotos:', err.message)
  fs.writeFileSync(outputPath, '[]')
}
