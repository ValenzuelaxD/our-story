import { motion } from 'framer-motion'
import MI from '../ui/MI'
import Slide from '../ui/Slide'
import { staggerV, fadeV, scaleV } from '../../data/constants'

export default function CartaSlide() {
  return (
    <Slide id="carta" bg="slide-bg-amber">
      {(inView) => (
        <motion.div variants={staggerV} initial="hidden" animate={inView ? 'show' : 'hidden'}
          className="flex flex-col items-center gap-6 text-center w-full max-w-sm lg:max-w-xl mx-auto"
        >
          <MI v={fadeV} className="chapter-label">Una carta para ti</MI>

          <MI v={scaleV} className="text-4xl" style={{ animation: 'pulseSoft 3s ease-in-out infinite' }}>
            💌
          </MI>

          {/* Carta con apariencia de papel */}
          <MI className="w-full allow-select">
            <div className="paper-card p-6 sm:p-8 rounded-2xl text-left space-y-4">

              {/* Saludo */}
              <p className="font-display text-2xl sm:text-3xl italic text-rose-100/95">
                Maysa,
              </p>

              {/* Línea separadora decorativa */}
              <div className="h-px bg-gradient-to-r from-transparent via-amber-200/25 to-transparent" />

              <p className="font-body text-base sm:text-lg leading-[1.9] italic text-rose-200/90">
                hablar de ti nunca es simple para mí. no es solo sobre gustar, no es solo sobre estar juntos… es algo mucho más profundo de lo que puedo poner en palabras.
              </p>
              <p className="font-body text-base sm:text-lg leading-[1.9] italic text-rose-200/90">
                desde que entraste en mi vida, algo cambió dentro de mí. es como si Dios, con todo su cuidado, te hubiera puesto exactamente en mi camino. veo a Cristo en ti - en tu manera, en tu corazón, en tu pureza - y eso es una de las cosas que más me encanta.
              </p>
              <p className="font-body text-base sm:text-lg leading-[1.9] italic text-rose-200/90">
                no tienes idea de cuánto bien me haces. con solo pensar en ti, ya me siento mejor. tu sonrisa tiene un poder increíble para cambiar mi día, y tu presencia… es un lugar donde siento paz.
              </p>
              <p className="font-body text-base sm:text-lg leading-[1.9] italic text-rose-200/90">
                me acercas a Dios. me inspiras a ser mejor, más firme, más parecido a lo que Él espera de mí. y quiero cuidarte - protegerte, estar a tu lado en todos los momentos… y construir una vida entera contigo.
              </p>
              <p className="font-body text-base sm:text-lg leading-[1.9] italic text-rose-200/90">
                soy profundamente agradecido a Dios por ti. todos los días.
              </p>
              <p className="font-body text-base sm:text-lg leading-[1.9] italic text-rose-200/90">
                y con todo mi corazón… te amo más de lo que puedo explicar.
              </p>

              {/* Firma */}
              <div className="pt-4">
                <div className="h-px bg-gradient-to-r from-transparent via-amber-200/22 to-transparent mb-5" />
                <div className="text-right space-y-1">
                  <p className="font-display text-xl italic text-rose-100/80">Con amor,</p>
                  <p className="font-display text-3xl sm:text-4xl text-rose-50">Davi</p>
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
