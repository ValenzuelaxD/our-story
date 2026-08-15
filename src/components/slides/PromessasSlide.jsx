import { motion } from 'framer-motion'
import MI from '../ui/MI'
import Slide from '../ui/Slide'
import { staggerV, fadeV, scaleV } from '../../data/constants'

export default function PromessasSlide() {
  return (
    <Slide id="promessas" bg="slide-bg-teal" center={false}>
      {(inView) => (
        <motion.div variants={staggerV} initial="hidden" animate={inView ? 'show' : 'hidden'}
          className="flex flex-col gap-4 w-full max-w-sm lg:max-w-xl mx-auto"
        >
          <div className="text-center">
            <MI v={fadeV} className="chapter-label">Mi compromiso</MI>
            <MI v={scaleV} className="text-4xl mt-2" style={{ animation: 'pulseSoft 3s ease-in-out infinite' }}>🤍</MI>
            <MI className="mt-2">
              <h2 className="font-display text-2xl sm:text-3xl font-semibold text-rose-50">Mis promesas para ti</h2>
            </MI>
            <MI v={fadeV}><p className="text-rose-300/65 text-sm mt-1">Con Cristo en el centro, te prometo:</p></MI>
          </div>
          <div className="space-y-2 w-full">
            {[
              ['🌱', 'Ser paciente contigo siempre'],
              ['🤍', 'Ser amoroso y gentil en cada momento'],
              ['🛡️', 'Cuidarte con atención y cariño'],
              ['✝️', 'Acercarte a Cristo todos los días'],
              ['🙏', 'Guiar todo con temor a Dios'],
              ['🕊️', 'Vivir santidad en nuestro noviazgo, honrando a Dios en cada elección'],
              ['⏳', 'No apresurar etapas - tu tiempo es sagrado'],
              ['🧱', 'Demostrar con actitudes, no solo palabras'],
              ['🌊', 'Mantener constancia emocional a tu lado'],
              ['🏔️', 'Construir una base firme con Cristo en el centro'],
              ['🔝', 'Dar siempre lo mejor de mí por nosotros'],
              ['💬', 'Expresarme contigo - siempre, incluso cuando sea difícil'],
              ['👁️', 'Ser transparente, de verdad, en todo'],
              ['🕊️', 'Nunca alzar la voz: siempre conversar con calma, entenderte y exponer mi punto con amor'],
              ['💛', 'Ser comprensivo en tus momentos difíciles'],
              ['🌸', 'Hacerte al menos un poquito feliz todos los días'],
              ['🩹', 'Ayudar a sanar, con amor y paciencia, todo el mal que alguna vez te hicieron'],
              ['🧷', 'Nunca rendirme con nosotros'],
              ['💍', 'Serte totalmente fiel'],
              ['🔒', 'Nunca romper tu confianza'],
              ['🤣', 'No huir cuando te vea toda despeinada (después del matrimonio jaja)'],
              ['🏃‍♂️‍➡️', 'Cuidar de mi salud y de la tuya, para vivir bien cada etapa'],
              ['🤲', 'Nunca vas a cargar nada sola: siempre lo llevaremos juntos'],
              ['⚔️', 'Independientemente de los problemas, seguiré eligiéndote y entregándome por nosotros, como Cristo amó a la Iglesia'],
              ['🏡', 'Cuando tengamos nuestro hogar, no será solo vivir juntos, sino vivir juntos de verdad'],
            ].map(([icon, text]) => (
              <MI key={text}>
                <div className="flex items-center gap-3 px-3 py-2.5 rounded-2xl bg-white/[0.05] border border-emerald-400/12">
                  <span className="text-xl shrink-0">{icon}</span>
                  <span className="text-rose-100/90 text-sm font-medium leading-snug">{text}</span>
                </div>
              </MI>
            ))}
          </div>
          <MI v={fadeV}><p className="text-center text-rose-300/55 text-xs italic">Cada una viene del corazón. ❤️</p></MI>
        </motion.div>
      )}
    </Slide>
  )
}
