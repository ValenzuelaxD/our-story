import { motion } from 'framer-motion'
import MI from '../ui/MI'
import Slide from '../ui/Slide'
import { staggerV, fadeV, scaleV, TEXTO, fill } from '../../data/constants'

export default function CartaSlide() {
  const t = TEXTO.carta
  return (
    <Slide id="carta" bg="slide-bg-amber">
      {(inView) => (
        <motion.div variants={staggerV} initial="hidden" animate={inView ? 'show' : 'hidden'}
          className="flex flex-col items-center gap-6 text-center w-full max-w-sm lg:max-w-xl mx-auto"
        >
          <MI v={fadeV} className="chapter-label">{t.label}</MI>

          <MI v={scaleV} className="text-4xl" style={{ animation: 'pulseSoft 3s ease-in-out infinite' }}>
            💌
          </MI>

          {/* Carta con apariencia de papel */}
          <MI className="w-full allow-select">
            <div className="paper-card p-6 sm:p-8 rounded-2xl text-left space-y-4">

              {/* Saludo */}
              <p className="font-display text-2xl sm:text-3xl italic text-rose-100/95">
                {fill(t.saludo)}
              </p>

              {/* Línea separadora decorativa */}
              <div className="h-px bg-gradient-to-r from-transparent via-amber-200/25 to-transparent" />

              {t.paras.map((para) => (
                <p key={para.slice(0, 24)} className="font-body text-base sm:text-lg leading-[1.9] italic text-rose-200/90">
                  {para}
                </p>
              ))}

              {/* Firma */}
              <div className="pt-4">
                <div className="h-px bg-gradient-to-r from-transparent via-amber-200/22 to-transparent mb-5" />
                <div className="text-right space-y-1">
                  <p className="font-display text-xl italic text-rose-100/80">{t.despedida}</p>
                  <p className="font-display text-3xl sm:text-4xl text-rose-50">{fill(t.firma)}</p>
                </div>
              </div>
            </div>
          </MI>

          <MI v={fadeV} className="text-2xl" style={{ animation: 'pulseSoft 3s ease-in-out infinite 0.5s' }}>
            💕
          </MI>
        </motion.div>
      )}
    </Slide>
  )
}
