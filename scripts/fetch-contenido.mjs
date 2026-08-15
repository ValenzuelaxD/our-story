/**
 * Descarga el contenido editado vía API (Fase 3) y lo aplica sobre
 * src/data/contenido.json antes del build. Si la API no responde o no hay
 * URL configurada, deja el archivo como está (fallback al JSON del repo).
 *
 * Uso: API_CONTEUDO_URL=http://127.0.0.1:7000/api/contenido node scripts/fetch-contenido.mjs
 */
import { readFileSync, writeFileSync } from 'node:fs'
import { join, dirname } from 'node:path'
import { fileURLToPath } from 'node:url'

const __dirname = dirname(fileURLToPath(import.meta.url))
const jsonPath = join(__dirname, '..', 'src', 'data', 'contenido.json')

const url = process.env.API_CONTEUDO_URL
if (!url) {
  console.log('fetch-contenido: sin API_CONTEUDO_URL, se mantiene el contenido del repo')
  process.exit(0)
}

try {
  const res = await fetch(url, {
    headers: { 'content-type': 'application/json' },
    signal: AbortSignal.timeout(8000),
  })
  if (!res.ok) throw new Error(`HTTP ${res.status}`)
  const data = await res.json()

  // Envelope de la API: { ok, content, updated_at }. Si la tabla está vacía,
  // content es null y se conserva el JSON del repo (seed/fallback).
  const contenido = data?.content
  if (!contenido || typeof contenido !== 'object' || Array.isArray(contenido)) {
    throw new Error('la API respondió sin contenido')
  }

  const previo = JSON.parse(readFileSync(jsonPath, 'utf8'))
  const nuevo = {
    ...previo,
    ...contenido,
    meta: previo.meta,
    fotos: Array.isArray(contenido.fotos) && contenido.fotos.length ? contenido.fotos : previo.fotos,
  }
  writeFileSync(jsonPath, JSON.stringify(nuevo, null, 2) + '\n', 'utf8')
  console.log(`✓ fetch-contenido: contenido sincronizado desde la API (${url})`)
} catch (e) {
  console.warn(`fetch-contenido: no se pudo sincronizar (${e.message}); se usa el contenido del repo`)
  process.exit(0)
}