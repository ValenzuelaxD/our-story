import { motion, AnimatePresence } from 'framer-motion'
import { useNovasConquistas } from '../../hooks/useNovasConquistas'

const RARIDADE_META = {
  comum:    { label: 'Comum',    cor: '#e8b4bc', glow: 'rgba(232,180,188,0.50)' },
  especial: { label: 'Especial', cor: '#f0a8b8', glow: 'rgba(240,168,184,0.55)' },
  raro:     { label: 'Raro',     cor: '#e8c4a0', glow: 'rgba(232,196,160,0.55)' },
  epico:    { label: 'Épico',    cor: '#d4a574', glow: 'rgba(212,165,116,0.60)' },
  lendario: { label: 'Legendario', cor: '#d4af37', glow: 'rgba(212,175,55,0.70)'  },
}

const PARTICULAS = Array.from({ length: 8 }, (_, i) => i)

export default function ConquistaUnlock() {
  const { proxima, restantes, marcarVista } = useNovasConquistas()

  if (!proxima) return null

  const meta = RARIDADE_META[proxima.raridade] ?? RARIDADE_META.comum

  return (
    <AnimatePresence mode="wait">
      <motion.div
        key={proxima.id}
        className="conquista-overlay"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        transition={{ duration: 0.28 }}
        onClick={(e) => e.target === e.currentTarget && marcarVista(proxima.id)}
      >
        <motion.div
          className="conquista-modal"
          style={{ '--rarity-cor': meta.cor, '--rarity-glow': meta.glow }}
          initial={{ opacity: 0, y: 52, scale: 0.88 }}
          animate={{ opacity: 1, y: 0,  scale: 1    }}
          exit={{    opacity: 0, y: 28, scale: 0.94  }}
          transition={{ type: 'spring', stiffness: 240, damping: 22, delay: 0.06 }}
        >
          {/* Parte superior */}
          <p className="conquista-modal__topo">✦ Conquista Desbloqueada ✦</p>

          {/* Ícono con partículas */}
          <div className="conquista-modal__icon-wrap">
            {PARTICULAS.map(i => (
              <span
                key={i}
                className="conquista-modal__particula"
                style={{ '--i': i }}
              />
            ))}
            <motion.span
              className="conquista-modal__icon"
              initial={{ scale: 0.4, rotate: -15 }}
              animate={{ scale: 1,   rotate: 0   }}
              transition={{ type: 'spring', stiffness: 320, damping: 16, delay: 0.22 }}
            >
              {proxima.icon}
            </motion.span>
          </div>

          {/* Rareza */}
          <span className="conquista-modal__raridade">
            ✦ {meta.label} ✦
          </span>

          {/* Título */}
          <h2 className="conquista-modal__titulo">{proxima.titulo}</h2>

          {/* Subtítulo */}
          {proxima.subtitulo && (
            <p className="conquista-modal__subtitulo">{proxima.subtitulo}</p>
          )}

          {/* Fecha */}
          {proxima.data && (
            <p className="conquista-modal__data">{proxima.data}</p>
          )}

          {/* Botón */}
          <motion.button
            className="conquista-modal__btn"
            onClick={() => marcarVista(proxima.id)}
            whileTap={{ scale: 0.96 }}
          >
            🏆 ¡Increíble!
          </motion.button>

          {/* Contador si hay cola */}
          {restantes > 0 && (
            <p className="conquista-modal__fila">
              +{restantes} nueva{restantes > 1 ? 's' : ''} conquista{restantes > 1 ? 's' : ''} esperando por ti
            </p>
          )}
        </motion.div>
      </motion.div>
    </AnimatePresence>
  )
}
