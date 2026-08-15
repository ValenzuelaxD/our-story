import { useState, useEffect, useMemo } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { TIMELINE, MESESVERSARIOS } from '../../data/constants'
import { buscarHojeNaHistoria } from '../../utils/todayInHistory'

const DELAY_MS = 2200

export default function TodayPill() {
  const evento = useMemo(() => buscarHojeNaHistoria(TIMELINE, MESESVERSARIOS), [])
  const [visivel,  setVisivel]  = useState(false)
  const [fechado,  setFechado]  = useState(false)

  useEffect(() => {
    if (!evento) return
    const t = setTimeout(() => setVisivel(true), DELAY_MS)
    return () => clearTimeout(t)
  }, [evento])

  if (!evento) return null

  return (
    <AnimatePresence>
      {visivel && !fechado && (
        <motion.div
          className="today-pill"
          role="status"
          aria-live="polite"
          initial={{ opacity: 0, y: 28, scale: 0.93 }}
          animate={{ opacity: 1, y: 0,  scale: 1    }}
          exit={{    opacity: 0, y: 18, scale: 0.95  }}
          transition={{ type: 'spring', stiffness: 260, damping: 22 }}
        >
          {/* Línea superior: ícono + etiqueta + cerrar */}
          <div className="today-pill__header">
            <span className="today-pill__icon">{evento.icon}</span>
            <span className="today-pill__label">{evento.label}</span>
            <button
              className="today-pill__close"
              onClick={() => setFechado(true)}
              aria-label="Cerrar"
            >✕</button>
          </div>

          {/* Título del evento */}
          <p className="today-pill__titulo">{evento.titulo}</p>

          {/* Tiempo atrás o insignia de mesversario */}
          {evento.tempo && (
            <span className="today-pill__tempo">{evento.tempo}</span>
          )}
        </motion.div>
      )}
    </AnimatePresence>
  )
}
