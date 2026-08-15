import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import MI from '../ui/MI'
import Slide from '../ui/Slide'
import { staggerV, fadeV, scaleV, BUCKET_LIST } from '../../data/constants'

const LS_KEY = 'our-story-bucketlist'

function loadFeitos() {
  // Los ítems marcados en constants.js como hecho:true siempre prevalecen
  const defaults = Object.fromEntries(
    BUCKET_LIST.filter(i => i.feito).map(i => [i.id, true])
  )
  try {
    const raw = localStorage.getItem(LS_KEY)
    const saved = raw ? JSON.parse(raw) : {}
    return { ...saved, ...defaults }
  } catch {
    return defaults
  }
}

function CheckIcon() {
  return (
    <svg viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth={2.5}
      strokeLinecap="round" strokeLinejoin="round" className="w-3.5 h-3.5">
      <path d="M2.5 8.5l3.5 3.5 7-7" />
    </svg>
  )
}

export default function BucketListSlide() {
  const [feitos, setFeitos] = useState({})
  const [celebrando, setCelebrando] = useState(null)

  useEffect(() => {
    setFeitos(loadFeitos())
  }, [])

  const total = BUCKET_LIST.length
  const qtdFeitos = Object.values(feitos).filter(Boolean).length

  const toggle = (id) => {
    const novoValor = !feitos[id]
    const novo = { ...feitos, [id]: novoValor }
    setFeitos(novo)
    try { localStorage.setItem(LS_KEY, JSON.stringify(novo)) } catch {}
    if (novoValor) {
      setCelebrando(id)
      setTimeout(() => setCelebrando(null), 800)
    }
  }

  return (
    <Slide id="bucketlist" bg="slide-bg-story" center={false}>
      {(inView) => (
        <motion.div
          variants={staggerV}
          initial="hidden"
          animate={inView ? 'show' : 'hidden'}
          className="flex flex-col gap-6 w-full max-w-md lg:max-w-2xl mx-auto pb-14"
        >
          <div className="text-center pt-2">
            <MI v={fadeV} className="chapter-label">Nuestros sueños</MI>
            <MI className="mt-2">
              <h2 className="font-display text-2xl sm:text-3xl font-semibold text-rose-50">
                Lista de cosas para vivir juntos 🌿
              </h2>
            </MI>
            <MI v={fadeV}>
              <p className="text-rose-200/50 text-xs mt-2 max-w-[300px] mx-auto leading-relaxed">
                Marca mientras vayan cumpliéndolas - queda guardado aquí para nosotros dos 🤍
              </p>
            </MI>
          </div>

          {/* Barra de progreso */}
          <MI v={scaleV}>
            <div className="card-glass card-gold-border px-4 py-4 space-y-3">
              <div className="flex items-center justify-between">
                <p className="text-[11px] uppercase tracking-[0.18em] text-rose-200/55">Progreso de los sueños</p>
                <span className="font-mono text-xs tabular-nums text-amber-200/85">
                  {qtdFeitos}/{total}
                </span>
              </div>
              <div className="progress-track h-3">
                <motion.div
                  className="progress-fill-green"
                  initial={{ width: 0 }}
                  animate={{ width: `${(qtdFeitos / total) * 100}%` }}
                  transition={{ duration: 0.7, ease: 'easeOut' }}
                />
              </div>
              <div className="flex items-center justify-between text-xs">
                <span className="text-rose-200/55">
                  {Math.round((qtdFeitos / total) * 100)}% cumplidos
                </span>
                <span className="text-amber-100/65">
                  {total - qtdFeitos > 0
                    ? `${total - qtdFeitos} aún por vivir ✨`
                    : '¡Todo cumplido! 🥹'}
                </span>
              </div>
            </div>
          </MI>

          {/* Lista */}
          <div className="space-y-2.5">
            {BUCKET_LIST.map((item) => {
              const feito = !!feitos[item.id]
              const emProgresso = !!item.progresso && !feito
              const comemorando = celebrando === item.id

              const bgColor = feito
                ? 'rgba(52,211,153,0.08)'
                : emProgresso
                  ? 'rgba(212,175,55,0.07)'
                  : 'rgba(255,255,255,0.04)'
              const borderColor = feito
                ? 'rgba(52,211,153,0.25)'
                : emProgresso
                  ? 'rgba(212,175,55,0.28)'
                  : 'rgba(255,255,255,0.08)'

              return (
                <MI key={item.id}>
                  <motion.button
                    onClick={() => toggle(item.id)}
                    className="w-full flex items-center gap-3.5 px-4 py-3.5 rounded-2xl text-left transition-all duration-200 active:scale-[0.98]"
                    style={{
                      background: bgColor,
                      border: `1px solid ${borderColor}`,
                      boxShadow: comemorando ? '0 0 20px rgba(52,211,153,0.3)' : 'none',
                    }}
                    animate={comemorando ? { scale: [1, 1.02, 1] } : {}}
                    transition={{ duration: 0.3 }}
                  >
                    {/* Checkbox / icono de estado */}
                    <div
                      className="flex-shrink-0 w-6 h-6 rounded-full flex items-center justify-center transition-all duration-200"
                      style={{
                        background: feito
                          ? 'rgba(52,211,153,0.9)'
                          : emProgresso
                            ? 'rgba(212,175,55,0.2)'
                            : 'transparent',
                        border: `2px solid ${
                          feito
                            ? 'rgba(52,211,153,0.9)'
                            : emProgresso
                              ? 'rgba(212,175,55,0.7)'
                              : 'rgba(255,255,255,0.2)'
                        }`,
                      }}
                    >
                      {feito && (
                        <motion.span initial={{ scale: 0 }} animate={{ scale: 1 }} className="text-white">
                          <CheckIcon />
                        </motion.span>
                      )}
                      {emProgresso && (
                        <span className="text-[10px]">⏳</span>
                      )}
                    </div>

                    {/* Texto + badge "en progreso" */}
                    <div className="flex-1 min-w-0">
                      <span
                        className="text-sm sm:text-base leading-snug transition-all duration-200"
                        style={{
                          color: feito
                            ? 'rgba(255,255,255,0.45)'
                            : emProgresso
                              ? 'rgba(253,230,138,0.85)'
                              : 'rgba(255,228,230,0.85)',
                          textDecorationLine: feito ? 'line-through' : 'none',
                          textDecorationColor: 'rgba(52,211,153,0.5)',
                        }}
                      >
                        {item.texto}
                      </span>
                      {emProgresso && (
                        <span className="block text-[10px] uppercase tracking-[0.16em] text-amber-300/55 mt-0.5">
                          en progreso
                        </span>
                      )}
                    </div>

                    {feito && (
                      <span className="ml-auto flex-shrink-0 text-base">🤍</span>
                    )}
                  </motion.button>
                </MI>
              )
            })}
          </div>

          {qtdFeitos === total && (
            <MI v={fadeV}>
              <div className="text-center py-2">
                <p className="text-emerald-300/80 text-sm font-medium">
                  ¡Cumplieron todo! Qué historia linda de contar 🥹
                </p>
              </div>
            </MI>
          )}
        </motion.div>
      )}
    </Slide>
  )
}
