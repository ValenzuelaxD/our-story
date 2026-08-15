import { motion } from 'framer-motion'
import MI from '../ui/MI'
import Slide from '../ui/Slide'
import Divider from '../ui/Divider'
import { staggerV, fadeV, scaleV, TEXTO, fill } from '../../data/constants'

export default function FuturoSlide() {
  const t = TEXTO.futuro
  return (
    <Slide id="futuro" bg="slide-bg-blue" center={false}>
      {(inView) => (
        <motion.div variants={staggerV} initial="hidden" animate={inView ? 'show' : 'hidden'}
          className="flex flex-col gap-4 w-full max-w-sm lg:max-w-xl mx-auto"
        >
          <div className="text-center">
            <MI v={fadeV} className="chapter-label">{t.label}</MI>
            <MI v={scaleV} className="text-4xl mt-2" style={{ animation: 'softFloat 5s ease-in-out infinite' }}>🌅</MI>
            <MI className="mt-2">
              <h2 className="font-display text-2xl sm:text-3xl font-semibold text-rose-50">{t.titulo}</h2>
            </MI>
          </div>
          <div className="space-y-2 w-full">
            {t.items.map(({ icon, text }) => (
              <MI key={text}>
                <div className="future-item">
                  <span className="text-2xl shrink-0">{icon}</span>
                  <span className="text-rose-100/90 text-sm sm:text-base font-medium">{text}</span>
                </div>
              </MI>
            ))}
          </div>
          <MI v={fadeV}>
            <div className="mt-1 px-4 py-5 rounded-2xl bg-gradient-to-b from-white/[0.08] to-white/[0.02] border border-amber-200/20 shadow-lg shadow-rose-950/25 ring-1 ring-white/[0.04]">
              <p className="text-center text-xs sm:text-sm text-amber-200/90 mb-2 font-medium leading-snug px-1">
                {t.broma.titulo}
              </p>
              <p className="text-center text-[11px] sm:text-xs text-rose-200/80 mb-3 leading-relaxed px-1">
                {t.broma.cuerpo}{' '}
                <span className="inline-flex items-center gap-10 whitespace-nowrap" aria-hidden>
                  <span>{t.broma.emojiIzq}</span>
                  <span>{t.broma.emojiDer}</span>
                </span>
              </p>
              <p
                className="font-display text-center font-medium text-rose-50 leading-snug px-1"
                style={{ fontSize: 'clamp(15px, 3.9vw, 20px)' }}
              >
                {fill(t.broma.nombre)}
              </p>
              <p className="text-center text-rose-300/55 text-xs mt-3 italic">{t.broma.nota}</p>
            </div>
          </MI>
          <MI v={fadeV}>
            <p className="text-center text-rose-200/70 text-xs sm:text-sm italic">{t.ipe}</p>
          </MI>
          <MI v={fadeV}><Divider char="✦ ✧ ✦" /></MI>
          <MI v={fadeV}><p className="text-center text-rose-200/80 text-sm font-medium">{t.tusSueños}</p></MI>
          <div className="space-y-2 w-full">
            {t.tusSueñosItems.map(({ icon, text, note }) => (
              <MI key={text}>
                <div className="flex items-start gap-3 px-3 py-3 rounded-2xl bg-white/[0.05] border border-blue-400/12">
                  <span className="text-xl shrink-0 mt-0.5">{icon}</span>
                  <div>
                    <p className="text-rose-100/90 text-sm font-medium leading-snug">{text}</p>
                    <p className="text-amber-300/55 text-xs italic mt-0.5">{note}</p>
                  </div>
                </div>
              </MI>
            ))}
          </div>
        </motion.div>
      )}
    </Slide>
  )
}
