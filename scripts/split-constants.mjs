/**
 * Divide src/data/constants.js en sub-archivos por dominio.
 * Ejecuta una sola vez: node scripts/split-constants.mjs
 */
import { readFileSync, writeFileSync } from 'fs'
import { fileURLToPath } from 'url'
import { dirname, join } from 'path'

const __dirname = dirname(fileURLToPath(import.meta.url))
const root      = join(__dirname, '..')
const srcFile   = join(root, 'src/data/constants.js')

const src   = readFileSync(srcFile, 'utf8')
const lines = src.split('\n')

/** Extrai linhas [start, end] (1-indexed, inclusivo). */
function take(start, end) {
  return lines.slice(start - 1, end).join('\n')
}

// ─── animations.js ─────────────────────────────────────────────────────────
writeFileSync(
  join(root, 'src/data/animations.js'),
  '// Framer Motion variants compartidos por todos los slides\n' +
  take(1833, 1850) + '\n',
)

// ─── timeline.js ───────────────────────────────────────────────────────────
writeFileSync(
  join(root, 'src/data/timeline.js'),
  take(19, 56)   + '\n\n' +
  take(1440, 1830) + '\n',
)

// ─── fotos.js ──────────────────────────────────────────────────────────────
writeFileSync(
  join(root, 'src/data/fotos.js'),
  take(153, 237) + '\n\n' +
  take(239, 345) + '\n',
)

// ─── cartas.js ─────────────────────────────────────────────────────────────
writeFileSync(
  join(root, 'src/data/cartas.js'),
  take(462, 641) + '\n',
)

// ─── conquistas.js ─────────────────────────────────────────────────────────
writeFileSync(
  join(root, 'src/data/conquistas.js'),
  take(643, 1153) + '\n',
)

// ─── mapa.js ───────────────────────────────────────────────────────────────
writeFileSync(
  join(root, 'src/data/mapa.js'),
  take(1252, 1438) + '\n',
)

// ─── constants.js reescrito ─────────────────────────────────────────────────
const newConstants = [
  '// src/data/constants.js — hub central. Los datos pesados quedan en los sub-módulos abajo.',
  "export * from './animations'",
  "export * from './timeline'",
  "export * from './fotos'",
  "export * from './cartas'",
  "export * from './conquistas'",
  "export * from './mapa'",
  '',
  take(1,  17),   // SITE_ORIGIN, NOME_ELA_*, INICIO_NAMORO
  '',
  take(58, 152),  // PASSAGENS_BIBLICAS, SPOTIFY_URLS
  '',
  take(347, 460), // SLIDE_IDS, MOTIVOS_TE_AMO
  '',
  take(1155, 1256), // CREDITOS, ANTES_DEPOIS, SLIDE_AMBIENCE
].join('\n')

writeFileSync(srcFile, newConstants + '\n')

console.log('✓ constants.js dividido en 6 sub-módulos.')
console.log('  src/data/animations.js')
console.log('  src/data/timeline.js')
console.log('  src/data/fotos.js')
console.log('  src/data/cartas.js')
console.log('  src/data/conquistas.js')
console.log('  src/data/mapa.js')
