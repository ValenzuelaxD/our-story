import { motion } from 'framer-motion'
import MI from '../ui/MI'
import Slide from '../ui/Slide'
import { staggerV, fadeV, ANTES_DEPOIS } from '../../data/constants'

function Coluna({ titulo, itens, accent, icon, side }) {
  return (
    <div className="card-glass p-5 sm:p-6 h-full relative overflow-hidden">
      {/* Brillo de esquina */}
      <div
        className="absolute -top-8 w-24 h-24 rounded-full blur-2xl pointer-events-none opacity-60"
        style={{
          background: side === 'antes' ? 'rgba(251,113,133,0.18)' : 'rgba(212,175,55,0.20)',
          [side === 'antes' ? 'left' : 'right']: '-1rem',
        }}
      />

      <div className="relative flex items-center gap-3 mb-4">
        <span
          className="flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl text-2xl"
          style={{
            background: side === 'antes'
              ? 'rgba(251,113,133,0.12)'
              : 'rgba(212,175,55,0.14)',
            border: `1px solid ${side === 'antes' ? 'rgba(251,113,133,0.22)' : 'rgba(212,175,55,0.26)'}`,
          }}
        >
          {icon}
        </span>
        <h3 className={`font-display text-lg sm:text-xl font-semibold leading-snug ${accent}`}>
          {titulo}
        </h3>
      </div>

      <ul className="space-y-3 text-[13px] sm:text-sm text-rose-200/85 leading-relaxed">
        {itens.map((texto) => (
          <li key={texto} className="flex gap-2.5 items-start">
            <span
              className="mt-[5px] h-1.5 w-1.5 rounded-full shrink-0"
              style={{
                background: side === 'antes' ? 'rgba(251,113,133,0.7)' : 'rgba(212,175,55,0.75)',
                boxShadow: side === 'antes'
                  ? '0 0 8px rgba(251,113,133,0.5)'
                  : '0 0 8px rgba(212,175,55,0.55)',
              }}
              aria-hidden
            />
            <span>{texto}</span>
          </li>
        ))}
      </ul>
    </div>
  )
}

export default function AntesDepoisSlide() {
  const d = ANTES_DEPOIS
  return (
    <Slide id="antesdepois" bg="slide-bg-forest" center={false}>
      {(inView) => (
        <motion.div
          variants={staggerV}
          initial="hidden"
          animate={inView ? 'show' : 'hidden'}
          className="flex flex-col gap-6 w-full max-w-2xl mx-auto allow-select pb-14"
        >
          <div className="text-center">
            <MI v={fadeV} className="chapter-label">Yo &amp; nosotros</MI>
            <MI className="mt-2">
              <h2 className="font-display text-2xl sm:text-3xl font-semibold text-rose-50">
                Antes &amp; después
              </h2>
            </MI>
            <MI v={fadeV}>
              <p className="text-rose-200/55 text-sm mt-2 max-w-md mx-auto leading-relaxed">
                De lo automático al propósito - contigo en el camino
              </p>
            </MI>
          </div>

          <div className="relative grid grid-cols-1 md:grid-cols-2 gap-5 md:gap-6 w-full">
            {/* Divisor central – solo en escritorio */}
            <div className="hidden md:flex absolute left-1/2 top-0 bottom-0 -translate-x-1/2 flex-col items-center gap-0 z-10 pointer-events-none">
              <div className="flex-1 w-px bg-gradient-to-b from-transparent via-amber-200/35 to-transparent" />
              <div
                className="h-10 w-10 rounded-full flex items-center justify-center text-lg"
                style={{
                  background: 'rgba(20,10,16,0.90)',
                  border: '1px solid rgba(212,175,55,0.30)',
                  boxShadow: '0 0 20px rgba(212,175,55,0.18)',
                  backdropFilter: 'blur(12px)',
                }}
              >
                →
              </div>
              <div className="flex-1 w-px bg-gradient-to-b from-transparent via-amber-200/35 to-transparent" />
            </div>

            <MI>
              <Coluna
                titulo={d.antesTitulo}
                itens={d.antes}
                accent="text-rose-200/95"
                icon="🌙"
                side="antes"
              />
            </MI>
            <MI>
              <Coluna
                titulo={d.depoisTitulo}
                itens={d.depois}
                accent="text-amber-200/95"
                icon="✨"
                side="depois"
              />
            </MI>
          </div>
        </motion.div>
      )}
    </Slide>
  )
}
