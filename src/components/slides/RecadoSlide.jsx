import { useState } from 'react'
import { motion } from 'framer-motion'
import MI from '../ui/MI'
import Slide from '../ui/Slide'
import RecadoForm from '../recados/RecadoForm'
import RecadoBoard from '../recados/RecadoBoard'
import { fadeV, staggerV, upV, TEXTO } from '../../data/constants'

export default function RecadoSlide() {
  const [boardKey, setBoardKey] = useState(0)
  const t = TEXTO.recado

  return (
    <Slide id="recado" bg="slide-bg-magenta">
      {(inView) => (
        <motion.div
          variants={staggerV}
          initial="hidden"
          animate={inView ? 'show' : 'hidden'}
          className="flex flex-col items-center gap-6 text-center w-full max-w-2xl mx-auto"
        >
          {/* Cabecera */}
          <MI v={fadeV} className="chapter-label">
            {t.label}
          </MI>
          <MI v={upV} className="space-y-2">
            <h2 className="font-display text-2xl sm:text-3xl text-rose-50 leading-tight">
              {t.titulo}
            </h2>
            <p className="text-rose-200/75 text-sm sm:text-base max-w-md mx-auto">
              {t.cuerpo}
            </p>
          </MI>

          {/* Tablero de post-its - se recarga con boardKey tras un nuevo envío */}
          <MI v={fadeV} className="w-full">
            <RecadoBoard fetchKey={boardKey} />
          </MI>

          {/* Formulario */}
          <MI v={upV} className="w-full card-surface p-5 sm:p-6 card-gold-border">
            <RecadoForm onSuccess={() => setBoardKey((k) => k + 1)} />
          </MI>
        </motion.div>
      )}
    </Slide>
  )
}
