import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import MI from '../ui/MI'
import Slide from '../ui/Slide'
import { staggerV, fadeV, scaleV, PASSAGENS_BIBLICAS } from '../../data/constants'

const VISIVEIS = 2
const PASSAGENS_PREVIEW = PASSAGENS_BIBLICAS.slice(0, VISIVEIS)
const PASSAGENS_OCULTAS = PASSAGENS_BIBLICAS.slice(VISIVEIS)

const corpo = { color: 'rgb(255, 232, 234)' }
const numVersiculo = { color: 'rgb(253, 214, 140)' }
const notaRodape = { color: 'rgb(233, 213, 255)' }
const rotulo = { color: 'rgb(199, 210, 254)' }

function PassagemCard({ passagem }) {
  if (passagem.principal) {
    return (
      <div className="relative rounded-2xl overflow-hidden border border-amber-300/50 bg-gradient-to-br from-amber-200/10 via-indigo-900/40 to-transparent px-5 py-5 shadow-[0_0_32px_rgba(212,175,55,0.22)]">
        <div className="absolute -top-12 left-1/2 h-28 w-28 -translate-x-1/2 rounded-full bg-amber-300/20 blur-3xl" />
        <div className="relative">
          <div className="flex items-center justify-center gap-2 mb-3">
            <div className="h-px flex-1 bg-gradient-to-r from-transparent to-amber-300/50" />
            <p className="text-[9px] uppercase tracking-[0.26em] text-amber-200/85 whitespace-nowrap">✦ Nuestro versículo ✦</p>
            <div className="h-px flex-1 bg-gradient-to-l from-transparent to-amber-300/50" />
          </div>
          <h3 className="font-display text-xl font-semibold text-center leading-snug mb-4 text-amber-100">
            {passagem.titulo}
          </h3>
          <div className="space-y-3 text-sm sm:text-[15px] leading-[1.85] text-left font-body" style={corpo}>
            {passagem.versiculos.map(({ n, texto }) => (
              <p key={n} style={corpo}>
                <span className="font-bold mr-1.5" style={numVersiculo}>{n}</span>
                {texto}
              </p>
            ))}
          </div>
          {passagem.nota && (
            <div className="mt-4 pt-3 border-t border-amber-300/20">
              <p className="text-xs italic text-center" style={{ color: 'rgb(253, 230, 180)' }}>
                {passagem.nota}
              </p>
            </div>
          )}
        </div>
      </div>
    )
  }

  if (passagem.tipo === 'destaque') {
    return (
      <div className="rounded-2xl border border-amber-400/22 bg-white/[0.06] px-4 py-4 shadow-sm shadow-indigo-950/30">
        <p className="text-[10px] uppercase tracking-[0.2em] text-center mb-2" style={rotulo}>
          Palabra
        </p>
        <h3 className="font-display text-lg font-semibold text-center leading-snug" style={corpo}>
          {passagem.titulo}
        </h3>
        <p
          className="mt-3 text-sm sm:text-[15px] leading-relaxed text-center italic font-body"
          style={corpo}
        >
          “{passagem.citacao}”
        </p>
        {passagem.reflexao && (
          <p
            className="mt-3 text-xs text-center leading-relaxed border-t border-white/10 pt-3"
            style={{ color: 'rgb(216, 201, 255)' }}
          >
            {passagem.reflexao}
          </p>
        )}
      </div>
    )
  }

  return (
    <div className="rounded-2xl border border-indigo-300/20 bg-white/[0.045] px-4 py-4 shadow-sm shadow-indigo-950/25">
      <p className="text-[10px] uppercase tracking-[0.2em] text-center mb-2" style={rotulo}>
        Pasaje
      </p>
      <h3 className="font-display text-lg font-semibold text-center leading-snug mb-3" style={corpo}>
        {passagem.titulo}
      </h3>
      <div
        className="verse-card space-y-2.5 text-sm sm:text-[15px] leading-[1.75] text-left font-body"
        style={corpo}
      >
        {passagem.versiculos.map(({ n, texto }) => (
          <p key={n} style={corpo}>
            <span className="font-semibold mr-1.5" style={numVersiculo}>
              {n}
            </span>
            {texto}
          </p>
        ))}
      </div>
      {passagem.nota && (
        <p
          className="text-xs italic text-center mt-3 pt-3 border-t border-white/10"
          style={notaRodape}
        >
          {passagem.nota}
        </p>
      )}
    </div>
  )
}

export default function VersiculoSlide() {
  const [expandido, setExpandido] = useState(false)

  return (
    <Slide id="versiculo" bg="slide-bg-indigo" center={false}>
      {(inView) => (
        <motion.div
          variants={staggerV}
          initial="hidden"
          animate={inView ? 'show' : 'hidden'}
          className="flex flex-col gap-6 w-full max-w-md lg:max-w-2xl mx-auto allow-select pb-14"
        >
          <div className="text-center pt-2">
            <MI v={fadeV} className="chapter-label">Una palabra para nosotros</MI>
            <MI v={scaleV} className="text-4xl mt-2" style={{ animation: 'pulseSoft 3s ease-in-out infinite' }}>
              ✝️
            </MI>
            <MI className="mt-2">
              <h2 className="font-display text-2xl sm:text-3xl font-semibold text-rose-50">Versículos</h2>
            </MI>
            <MI v={fadeV}>
              <p className="text-rose-200/55 text-xs mt-1.5 max-w-[280px] mx-auto">
                Pasajes que sostienen nuestra historia - fe y amor juntos
              </p>
            </MI>
          </div>

          <div className="flex flex-col gap-4 w-full">
            {PASSAGENS_PREVIEW.map((p, idx) => (
              <MI key={p.id}>
                <div className="relative">
                  {idx > 0 && (
                    <div
                      className="absolute -top-2 left-1/2 -translate-x-1/2 w-12 h-px bg-gradient-to-r from-transparent via-amber-400/35 to-transparent"
                      aria-hidden
                    />
                  )}
                  <PassagemCard passagem={p} />
                </div>
              </MI>
            ))}

            <AnimatePresence>
              {expandido && PASSAGENS_OCULTAS.map((p, i) => (
                <motion.div
                  key={p.id}
                  initial={{ opacity: 0, y: 18 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.38, delay: i * 0.07, ease: [0.25, 0.1, 0.25, 1] }}
                >
                  <div className="relative">
                    <div
                      className="absolute -top-2 left-1/2 -translate-x-1/2 w-12 h-px bg-gradient-to-r from-transparent via-amber-400/35 to-transparent"
                      aria-hidden
                    />
                    <PassagemCard passagem={p} />
                  </div>
                </motion.div>
              ))}
            </AnimatePresence>

            {PASSAGENS_OCULTAS.length > 0 && (
              <div className="flex justify-center pt-1 pb-4">
                <button
                  type="button"
                  onClick={() => setExpandido(v => !v)}
                  className="flex items-center gap-2 px-6 py-3 rounded-2xl bg-amber-400/10 border border-amber-400/25 text-amber-200 font-sans text-sm font-medium tracking-wide hover:bg-amber-400/18 active:scale-95 transition-all duration-200"
                >
                  <span>✦</span>
                  <span>{expandido ? 'Mostrar menos' : 'Ver más'}</span>
                  <span
                    className="text-xs transition-transform duration-300"
                    style={{ transform: expandido ? 'rotate(180deg)' : 'rotate(0deg)' }}
                  >
                    ▾
                  </span>
                </button>
              </div>
            )}
          </div>
        </motion.div>
      )}
    </Slide>
  )
}
