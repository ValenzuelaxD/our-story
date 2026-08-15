import { motion } from 'framer-motion'
import MI from '../ui/MI'
import Slide from '../ui/Slide'
import { staggerV, fadeV, scaleV, CREDITOS } from '../../data/constants'

export default function CreditosSlide() {
  return (
    <Slide id="creditos" bg="slide-bg-dark" center={false}>
      {(inView) => (
        <motion.div
          variants={staggerV}
          initial="hidden"
          animate={inView ? 'show' : 'hidden'}
          className="flex flex-col gap-8 w-full max-w-md lg:max-w-2xl mx-auto allow-select pb-14"
        >
          <div className="text-center pt-2">
            <MI v={fadeV} className="chapter-label">Nuestra historia</MI>
            <MI v={scaleV} className="text-4xl mt-2" style={{ animation: 'pulseSoft 3s ease-in-out infinite' }}>
              🎬
            </MI>
            <MI className="mt-2">
              <h2 className="font-display text-2xl sm:text-3xl font-semibold text-rose-50">Créditos</h2>
            </MI>
            <MI v={fadeV}>
              <p className="text-rose-200/45 text-xs mt-1.5 max-w-[280px] mx-auto italic">
                Toda buena historia tiene personas que fueron parte de ella
              </p>
            </MI>
          </div>

          <div className="flex flex-col gap-6 w-full">
            {CREDITOS.map((secao, si) => (
              <MI key={si}>
                <div className="space-y-4">
                  <div className="flex items-center gap-3">
                    <div className="h-px flex-1 bg-gradient-to-r from-transparent to-amber-400/30" />
                    <p className="text-[9px] uppercase tracking-[0.26em] text-amber-200/55 whitespace-nowrap">
                      {secao.categoria}
                    </p>
                    <div className="h-px flex-1 bg-gradient-to-l from-transparent to-amber-400/30" />
                  </div>

                  <div className="space-y-3">
                    {secao.itens.map((item, ii) => (
                      <div
                        key={ii}
                        className="rounded-2xl border border-white/[0.06] bg-white/[0.03] px-5 py-4 text-center space-y-1"
                      >
                        <p className="text-[10px] uppercase tracking-[0.18em] text-rose-200/45">
                          {item.papel}
                        </p>
                        <p className="font-display text-xl sm:text-2xl font-semibold text-rose-50 leading-snug">
                          {item.nome}
                        </p>
                        {item.nota && (
                          <p className="text-rose-200/60 text-xs sm:text-sm leading-relaxed italic mt-1">
                            "{item.nota}"
                          </p>
                        )}
                      </div>
                    ))}
                  </div>
                </div>
              </MI>
            ))}

            <MI v={fadeV}>
              <div className="flex items-center gap-3 pt-2">
                <div className="h-px flex-1 bg-gradient-to-r from-transparent to-rose-400/20" />
                <p className="text-rose-300/30 text-[10px] uppercase tracking-widest whitespace-nowrap">fin</p>
                <div className="h-px flex-1 bg-gradient-to-l from-transparent to-rose-400/20" />
              </div>
            </MI>
          </div>
        </motion.div>
      )}
    </Slide>
  )
}
