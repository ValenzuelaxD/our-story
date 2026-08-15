import { motion } from 'framer-motion'
import MI from '../ui/MI'
import Slide from '../ui/Slide'
import { staggerV, fadeV, TEXTO } from '../../data/constants'

export default function TagsSlide() {
  const t = TEXTO.tags
  return (
    <Slide id="tags" bg="slide-bg-magenta">
      {(inView) => (
        <motion.div variants={staggerV} initial="hidden" animate={inView ? 'show' : 'hidden'}
          className="flex flex-col items-center gap-5 w-full max-w-sm lg:max-w-xl mx-auto"
        >
          <div className="text-center">
            <MI v={fadeV} className="chapter-label">{t.label}</MI>
            <MI className="mt-2">
              <h2 className="font-display text-2xl sm:text-3xl font-semibold text-rose-50">
                {t.titulo}
              </h2>
            </MI>
          </div>
          <div className="grid grid-cols-2 gap-2 w-full">
            {t.items.map(([emoji, text]) => (
              <MI key={text} className="h-full">
                <div className="tag-item h-full">
                  <span className="text-lg shrink-0">{emoji}</span>
                  <span className="text-sm leading-snug">{text}</span>
                </div>
              </MI>
            ))}
          </div>
        </motion.div>
      )}
    </Slide>
  )
}
