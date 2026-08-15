import { motion } from 'framer-motion'
import MI from '../ui/MI'
import Slide from '../ui/Slide'
import { staggerV, fadeV, scaleV, MOTIVOS_TE_AMO } from '../../data/constants'

export default function MotivosSlide() {
  const ultimo = MOTIVOS_TE_AMO.length - 1

  return (
    <Slide id="motivos" bg="slide-bg-magenta" center={false}>
      {(inView) => (
        <motion.div
          variants={staggerV}
          initial="hidden"
          animate={inView ? 'show' : 'hidden'}
          className="flex flex-col gap-6 w-full max-w-md lg:max-w-2xl mx-auto pb-14"
        >
          {/* Encabezado */}
          <div className="text-center pt-2">
            <MI v={fadeV} className="chapter-label">Para que sepas</MI>
            <MI v={scaleV} className="text-4xl mt-2" style={{ animation: 'pulseSoft 3s ease-in-out infinite' }}>
              🦋
            </MI>
            <MI className="mt-2">
              <h2 className="font-display text-2xl sm:text-3xl font-semibold text-rose-50">
                100 motivos por los que te amo
              </h2>
            </MI>
            <MI v={fadeV}>
              <p className="text-rose-200/50 text-xs mt-2 max-w-[280px] mx-auto leading-relaxed">
                Podría escribir mil, pero aquí van los primeros cien. 🤍
              </p>
            </MI>
          </div>

          {/* Lista */}
          <div className="space-y-2 w-full">
            {MOTIVOS_TE_AMO.map((motivo, i) => {
              const isUltimo = i === ultimo
              const num = String(i + 1).padStart(2, '0')

              if (isUltimo) {
                return (
                  <MI key={i}>
                    <div
                      className="flex items-start gap-3 px-4 py-4 rounded-2xl"
                      style={{
                        background: 'linear-gradient(135deg, rgba(212,175,55,0.14) 0%, rgba(255,100,130,0.10) 100%)',
                        border: '1px solid rgba(212,175,55,0.35)',
                        boxShadow: '0 0 24px rgba(212,175,55,0.12)',
                      }}
                    >
                      <span
                        className="font-display font-bold text-sm shrink-0 pt-0.5 tabular-nums"
                        style={{ color: 'rgba(212,175,55,0.9)', minWidth: '1.8rem' }}
                      >
                        {num}
                      </span>
                      <span className="text-sm sm:text-base leading-snug font-medium"
                        style={{ color: 'rgba(253,230,138,0.95)' }}>
                        {motivo}
                      </span>
                    </div>
                  </MI>
                )
              }

              return (
                <MI key={i}>
                  <div
                    className="flex items-start gap-3 px-4 py-3 rounded-2xl"
                    style={{
                      background: 'rgba(255,255,255,0.04)',
                      border: '1px solid rgba(255,228,230,0.08)',
                    }}
                  >
                    <span
                      className="font-display font-semibold text-xs shrink-0 pt-0.5 tabular-nums"
                      style={{ color: 'rgba(212,175,55,0.55)', minWidth: '1.8rem' }}
                    >
                      {num}
                    </span>
                    <span className="text-sm leading-snug" style={{ color: 'rgba(255,228,230,0.82)' }}>
                      {motivo}
                    </span>
                  </div>
                </MI>
              )
            })}
          </div>

          {/* Pie de página */}
          <MI v={fadeV}>
            <p className="text-center text-rose-300/45 text-xs italic">
              Y cada día que pasa, la lista crece. ❤️
            </p>
          </MI>
        </motion.div>
      )}
    </Slide>
  )
}
