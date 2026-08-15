import { motion } from 'framer-motion'
import MI from '../ui/MI'
import Slide from '../ui/Slide'
import { staggerV, fadeV, scaleV, TEXTO } from '../../data/constants'

export default function PromessasSlide() {
  const t = TEXTO.promessas
  return (
    <Slide id="promessas" bg="slide-bg-teal" center={false}>
      {(inView) => (
        <motion.div variants={staggerV} initial="hidden" animate={inView ? 'show' : 'hidden'}
          className="flex flex-col gap-4 w-full max-w-sm lg:max-w-xl mx-auto"
        >
          <div className="text-center">
            <MI v={fadeV} className="chapter-label">{t.label}</MI>
            <MI v={scaleV} className="text-4xl mt-2" style={{ animation: 'pulseSoft 3s ease-in-out infinite' }}>🤍</MI>
            <MI className="mt-2">
              <h2 className="font-display text-2xl sm:text-3xl font-semibold text-rose-50">{t.titulo}</h2>
            </MI>
            <MI v={fadeV}><p className="text-rose-300/65 text-sm mt-1">{t.subtitulo}</p></MI>
          </div>
          <div className="space-y-2 w-full">
            {t.items.map(([icon, text]) => (
              <MI key={text}>
                <div className="flex items-center gap-3 px-3 py-2.5 rounded-2xl bg-white/[0.05] border border-emerald-400/12">
                  <span className="text-xl shrink-0">{icon}</span>
                  <span className="text-rose-100/90 text-sm font-medium leading-snug">{text}</span>
                </div>
              </MI>
            ))}
          </div>
          <MI v={fadeV}><p className="text-center text-rose-300/55 text-xs italic">{t.pie}</p></MI>
        </motion.div>
      )}
    </Slide>
  )
}
