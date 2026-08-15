import { motion } from 'framer-motion'
import MI from '../ui/MI'
import Slide from '../ui/Slide'
import { staggerV, fadeV } from '../../data/constants'

export default function TagsSlide() {
  return (
    <Slide id="tags" bg="slide-bg-magenta">
      {(inView) => (
        <motion.div variants={staggerV} initial="hidden" animate={inView ? 'show' : 'hidden'}
          className="flex flex-col items-center gap-5 w-full max-w-sm lg:max-w-xl mx-auto"
        >
          <div className="text-center">
            <MI v={fadeV} className="chapter-label">Sobre ti</MI>
            <MI className="mt-2">
              <h2 className="font-display text-2xl sm:text-3xl font-semibold text-rose-50">
                Cosas que amo de ti ❤️
              </h2>
            </MI>
          </div>
          <div className="grid grid-cols-2 gap-2 w-full">
            {[
              ['✝️', 'Tu amor por Dios'],
              ['💕', 'La manera en que me cuidas'],
              ['🕊️', 'La paz que siento a tu lado'],
              ['💪', 'Cómo me motivas'],
              ['❤️', 'Tu manera de demostrar amor'],
              ['✨', 'Cómo lo haces todo ligero'],
              ['👀', 'Tu mirada cuando me ves'],
              ['💗', 'Tu corazón bondadoso'],
              ['😊', 'Tu sonrisa y tu risa'],
              ['🌹', 'Tu manera única de ser'],
            ].map(([emoji, text]) => (
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
