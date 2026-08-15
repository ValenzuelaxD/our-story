import { useEffect, useState } from 'react'
import { motion } from 'framer-motion'

const API_URL = import.meta.env.VITE_RECADOS_API_URL

// Paleta de tonos cálidos para combinar con el tema oscuro romántico del sitio
const COLORS = [
  { bg: '#fef9c3', text: '#78350f', pin: '#b45309' }, // amarillo-miel
  { bg: '#fce7f3', text: '#831843', pin: '#be185d' }, // rosa-suave
  { bg: '#fff1f2', text: '#881337', pin: '#be123c' }, // rosado-claro
  { bg: '#fef3c7', text: '#92400e', pin: '#d97706' }, // ámbar
  { bg: '#fdf2f8', text: '#6b21a8', pin: '#9333ea' }, // lavanda
]

// Rotaciones determinísticas por id - parecen aleatorias pero son estables
const ROTATIONS = [-2.5, 1.5, -1, 2, -1.5, 1, 2.5, -0.5, 1.8, -2.2]

/** Muestra solo el primer y el último nombre. Ej.: "Ana Clara Souza Lima" → "Ana Lima" */
function shortName(full) {
  const parts = String(full).trim().split(/\s+/).filter(Boolean)
  if (parts.length <= 2) return parts.join(' ')
  return `${parts[0]} ${parts[parts.length - 1]}`
}

function formatDate(isoStr) {
  try {
    return new Date(isoStr).toLocaleDateString('es', { day: '2-digit', month: 'short' })
  } catch {
    return ''
  }
}

function PostIt({ recado, index }) {
  const color = COLORS[index % COLORS.length]
  const rotation = ROTATIONS[recado.id % ROTATIONS.length]

  // Garantiza que los saltos de línea aparezcan correctamente, limitando a 8 líneas
  const lines = recado.message.split('\n').filter(Boolean).slice(0, 8)

  return (
    <motion.article
      initial={{ opacity: 0, y: 28, scale: 0.88 }}
      animate={{ opacity: 1, y: 0, scale: 1, rotate: rotation }}
      transition={{
        type: 'spring',
        stiffness: 130,
        damping: 16,
        delay: Math.min(index * 0.07, 0.55),
      }}
      whileHover={{ scale: 1.03, rotate: 0, zIndex: 10, transition: { duration: 0.2 } }}
      className="relative break-inside-avoid mb-3 cursor-default"
      style={{
        backgroundColor: color.bg,
        borderRadius: '2px',
        boxShadow: '4px 5px 16px rgba(0,0,0,0.4), 0 1px 3px rgba(0,0,0,0.25)',
        transformOrigin: 'top center',
      }}
    >
      {/* Chinche */}
      <div
        className="absolute -top-2.5 left-1/2 -translate-x-1/2 w-5 h-5 rounded-full border-[1.5px] border-white/50 shadow-md z-10"
        style={{ backgroundColor: color.pin }}
      />

      {/* Banda superior (efecto papel) */}
      <div
        className="absolute top-0 left-0 right-0 h-[3px] rounded-t-[2px]"
        style={{ backgroundColor: `${color.text}12` }}
      />

      <div className="px-4 pt-5 pb-5">
        {/* Nombre */}
        <p
          className="font-semibold text-[13px] mb-1.5 font-sans allow-select leading-snug"
          style={{ color: color.text }}
        >
          {shortName(recado.name)}
          <span className="ml-1 text-[11px] opacity-70">💕</span>
        </p>

        {/* Divisoria */}
        <div className="mb-2 h-px" style={{ background: `${color.text}18` }} />

        {/* Mensaje */}
        <div
          className="text-[13px] leading-relaxed allow-select"
          style={{ color: color.text, opacity: 0.84 }}
        >
          {lines.map((line, i) => (
            <p key={i} className={i < lines.length - 1 ? 'mb-0.5' : ''}>
              {line}
            </p>
          ))}
        </div>

        {/* Fecha */}
        <p
          className="text-[11px] mt-2.5 text-right select-none"
          style={{ color: color.text, opacity: 0.4 }}
        >
          {formatDate(recado.created_at)}
        </p>
      </div>

      {/* Esquina doblada (efecto post-it) */}
      <div
        className="absolute bottom-0 right-0 w-7 h-7"
        style={{
          background: 'linear-gradient(225deg, rgba(0,0,0,0.1) 50%, transparent 50%)',
        }}
      />
    </motion.article>
  )
}

function SkeletonNote({ index }) {
  return (
    <div
      className="relative break-inside-avoid mb-3 rounded-sm animate-pulse"
      style={{
        backgroundColor: 'rgba(254,249,195,0.06)',
        height: [130, 100, 150, 110][index % 4],
        boxShadow: '2px 4px 10px rgba(0,0,0,0.2)',
      }}
    />
  )
}

/**
 * Tablero de post-its con los mensajes ya enviados.
 * Hace GET /api/recados al montar y cuando `fetchKey` cambia (tras un nuevo envío).
 *
 * @param {{ fetchKey?: number }} props
 */
export default function RecadoBoard({ fetchKey = 0 }) {
  const [recados, setRecados] = useState([])
  const [loading, setLoading] = useState(true)
  const [total, setTotal] = useState(0)
  const [fetchError, setFetchError] = useState(false)

  useEffect(() => {
    if (!API_URL) {
      setLoading(false)
      return
    }

    setLoading(true)
    setFetchError(false)
    fetch(`${API_URL}?limit=20`)
      .then((r) => {
        if (!r.ok) throw new Error(`HTTP ${r.status}`)
        return r.json()
      })
      .then((data) => {
        setRecados(data.recados ?? [])
        setTotal(data.total ?? 0)
      })
      .catch((err) => {
        console.error('[RecadoBoard] fallo al buscar mensajes:', err?.message ?? err)
        setFetchError(true)
      })
      .finally(() => setLoading(false))
  }, [fetchKey])

  // Sin API configurada: no renderiza nada
  if (!API_URL) return null

  // Error de red/CORS/servidor: aviso sutil, no desaparece en silencio
  if (!loading && fetchError) {
    return (
      <p className="text-rose-400/40 text-xs text-center py-2 select-none">
        No fue posible cargar los mensajes ahora.
      </p>
    )
  }

  // Cargó, sin errores, pero realmente vacío: no renderiza el tablero
  if (!loading && !fetchError && recados.length === 0) return null

  return (
    <div className="w-full">
      {/* Cabecera del tablero */}
      <div className="flex items-center gap-3 mb-4">
        <span className="h-px flex-1 bg-rose-400/15" />
        <p className="text-rose-300/45 text-[10px] tracking-[0.18em] uppercase select-none whitespace-nowrap">
          {loading
            ? 'cargando mensajitos…'
            : `${total} mensajito${total !== 1 ? 's' : ''} con cariño`}
        </p>
        <span className="h-px flex-1 bg-rose-400/15" />
      </div>

      {/* El tablero ("corcho") */}
      <div
        className="rounded-2xl p-4 sm:p-5"
        style={{
          background: 'rgba(20, 8, 16, 0.6)',
          border: '1px solid rgba(251,113,133,0.10)',
          boxShadow: 'inset 0 2px 16px rgba(0,0,0,0.3)',
        }}
      >
        {/* Layout masonry via CSS columns */}
        <div className="columns-1 sm:columns-2 gap-3">
          {loading
            ? Array.from({ length: 4 }).map((_, i) => <SkeletonNote key={i} index={i} />)
            : recados.map((r, i) => <PostIt key={r.id} recado={r} index={i} />)}
        </div>
      </div>
    </div>
  )
}
