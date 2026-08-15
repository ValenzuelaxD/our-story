import { useEffect, useRef, useState } from 'react'
import { motion, useInView, AnimatePresence } from 'framer-motion'
import MI from '../ui/MI'
import Slide from '../ui/Slide'
import { staggerV, fadeV, scaleV, MESESVERSARIOS } from '../../data/constants'
import { useTempoJuntos, useCountUp } from '../../hooks'

const SAUDADE_DUR_MS = 3800
const SAUDADE_PAUSA_NO_100_MS = 5000

function easeSaudade(t) {
  const p = Math.min(Math.max(t, 0), 1)
  return p < 0.7 ? p * 1.2 : 0.84 + (p - 0.7) * (0.16 / 0.3)
}

export default function TimerSlide() {
  const tempo = useTempoJuntos()
  const countRef = useRef(null)
  const timerInView = useInView(countRef, { once: true, amount: 'some' })
  const totalDiasAnimado = useCountUp(tempo.totalDias, 900, timerInView)
  const [saudadePct, setSaudadePct] = useState(0)
  const [maisAberto, setMaisAberto] = useState(false)

  // Se dispara al abrir "Ver más" — useInView se rompía con el overflow:hidden del panel
  useEffect(() => {
    if (!maisAberto) {
      setSaudadePct(0)
      return
    }
    let rafId = 0
    let timeoutId = 0
    let cancelled = false

    function subir() {
      const t0 = performance.now()
      function frame(now) {
        if (cancelled) return
        const u = (now - t0) / SAUDADE_DUR_MS
        if (u < 1) {
          setSaudadePct(Math.min(99, Math.floor(easeSaudade(u) * 100)))
          rafId = requestAnimationFrame(frame)
        } else {
          setSaudadePct(100)
          timeoutId = window.setTimeout(() => {
            if (cancelled) return
            setSaudadePct(0)
            subir()
          }, SAUDADE_PAUSA_NO_100_MS)
        }
      }
      rafId = requestAnimationFrame(frame)
    }

    subir()
    return () => {
      cancelled = true
      cancelAnimationFrame(rafId)
      clearTimeout(timeoutId)
    }
  }, [maisAberto])
  const mesversariosVividos = MESESVERSARIOS.filter((m) => new Date() >= m.data)

  const proximoMarcoDias = Math.max(50, Math.ceil((tempo.totalDias + 1) / 50) * 50)
  const marcoPct = Math.min(100, Math.round((tempo.totalDias / proximoMarcoDias) * 100))
  const diasParaMarco = Math.max(0, proximoMarcoDias - tempo.totalDias)

  const fraseSaudade =
    saudadePct < 30
      ? 'Empezó suave...'
      : saudadePct < 60
        ? 'Ya está pegando fuerte 💗'
        : saudadePct < 90
          ? 'Casi al límite...'
          : saudadePct < 100
            ? '¡Socorro, cuánto te extraño! 😭'
            : '100%: Verte es obligatorio ❤️'

  return (
    <Slide id="timer" bg="slide-bg-maroon">
      {(inView) => (
        <motion.div ref={countRef} variants={staggerV} initial="hidden" animate={inView ? 'show' : 'hidden'}
          className="flex flex-col items-center gap-5 text-center w-full max-w-sm lg:max-w-xl mx-auto"
        >
            <MI v={fadeV} className="chapter-label">Ya pasó</MI>
            <MI v={scaleV}>
              <p className="text-jumbo font-display font-bold text-rose-50 tabular-nums">{totalDiasAnimado}</p>
            </MI>
            <MI className="space-y-1">
              <p className="font-display text-2xl sm:text-3xl font-light text-rose-200/90">días juntos</p>
              <p className="text-rose-300/60 text-sm italic">y cada uno de ellos valió mucho ❤️</p>
            </MI>
            <MI>
              <div className="flex items-center justify-center gap-3">
                {[
                  { val: tempo.horas, label: 'horas' },
                  { val: tempo.minutos, label: 'min' },
                  { val: tempo.segundos, label: 'seg', gold: true },
                ].map(({ val, label, gold }, i) => (
                  <div key={label} className="flex items-center gap-3">
                    {i > 0 && <span className="text-rose-300/30 text-lg font-light">:</span>}
                    <div className="flex flex-col items-center">
                      <span className={`font-mono tabular-nums text-xl font-semibold ${gold ? 'text-amber-300' : 'text-rose-200/80'}`}>
                        {val}
                      </span>
                      <span className="text-rose-300/45 text-[10px] tracking-widest uppercase mt-0.5">{label}</span>
                    </div>
                  </div>
                ))}
              </div>
            </MI>
            <MI v={fadeV}>
              <span className="badge-pill">🌹 {tempo.meses} {tempo.meses === 1 ? 'mes' : 'meses'} y {tempo.dias} días</span>
            </MI>

            <MI v={fadeV} className="w-full">
              <div className="card-glass card-gold-border px-4 py-4 space-y-3">
                <div className="flex items-center justify-between">
                  <p className="text-[10px] uppercase tracking-[0.2em] text-amber-100/70">Próximo hito</p>
                  <span className="font-mono text-xs tabular-nums text-amber-200/90">{marcoPct}%</span>
                </div>
                <div className="progress-track h-3">
                  <motion.div
                    className="progress-fill-rose"
                    initial={{ width: 0 }}
                    animate={{ width: `${marcoPct}%` }}
                    transition={{ duration: 1.1, ease: [0.25, 0.1, 0.25, 1] }}
                  />
                </div>
                <div className="flex items-end justify-between gap-4">
                  <div className="text-left">
                    <p className="font-display text-xl text-rose-50 tabular-nums">{tempo.totalDias} días ❤️</p>
                    <p className="text-xs text-rose-200/55 mt-0.5">
                      Faltan {diasParaMarco} {diasParaMarco === 1 ? 'día' : 'días'} para el próximo hito
                    </p>
                  </div>
                  <div className="rounded-xl border border-amber-300/22 bg-amber-200/10 px-3 py-2 text-right shrink-0">
                    <p className="text-[9px] uppercase tracking-widest text-amber-100/55">Hito</p>
                    <p className="font-display text-lg text-amber-100 tabular-nums">{proximoMarcoDias} días</p>
                  </div>
                </div>
              </div>
            </MI>

            <MI v={fadeV}>
              <button
                type="button"
                onClick={() => setMaisAberto(v => !v)}
                className="flex items-center gap-2 px-5 py-2.5 rounded-2xl bg-amber-400/10 border border-amber-400/25 text-amber-200 font-sans text-sm font-medium tracking-wide hover:bg-amber-400/18 active:scale-95 transition-all duration-200"
              >
                <span>✦</span>
                <span>{maisAberto ? 'Mostrar menos' : 'Ver más'}</span>
                <span
                  className="text-xs transition-transform duration-300"
                  style={{ transform: maisAberto ? 'rotate(180deg)' : 'rotate(0deg)' }}
                >
                  ▾
                </span>
              </button>
            </MI>

            <AnimatePresence initial={false}>
              {maisAberto && (
                <motion.div
                  key="timer-extra"
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: 'auto' }}
                  exit={{ opacity: 0, height: 0 }}
                  transition={{ duration: 0.32, ease: [0.25, 0.1, 0.25, 1] }}
                  className="w-full overflow-hidden"
                >
                  <div className="flex flex-col items-center gap-5 w-full pt-1">
                    <div className="card-glass rounded-2xl border border-rose-300/25 px-4 py-3.5 space-y-2 w-full">
                      <p className="text-[10px] uppercase tracking-[0.18em] text-rose-200/65 text-left">
                        Nivel de extrañarte
                      </p>
                      <div className="progress-track h-2.5">
                        <div
                          className="progress-fill-rose"
                          style={{ width: `${saudadePct}%` }}
                        />
                      </div>
                      <div className="flex items-center justify-between gap-3">
                        <p className="text-xs text-rose-100/90 text-left">{fraseSaudade}</p>
                        <span className="font-mono text-sm tabular-nums text-amber-200">{saudadePct}%</span>
                      </div>
                    </div>

                    {mesversariosVividos.length > 0 && (
                      <div className="w-full space-y-3 text-left">
                        <p className="text-center text-[10px] uppercase tracking-[0.18em] text-rose-200/50">Ya ocurrió en los mesversarios</p>
                        {mesversariosVividos.map((m) => (
                          <div
                            key={m.id}
                            className="mesversario-memoria card-glass rounded-2xl border border-amber-400/22 px-4 py-3.5"
                          >
                            <p className="font-display text-sm text-amber-200 font-medium text-center sm:text-left">
                              {m.titulo}
                            </p>
                            <p className="text-[11px] text-amber-100/55 text-center sm:text-left mt-0.5 mb-2">
                              {m.data.toLocaleDateString('es', { day: 'numeric', month: 'long', year: 'numeric' })}
                            </p>
                            {m.resumo.map((par, i) => (
                              <p
                                key={i}
                                className="font-body text-[13px] sm:text-sm leading-relaxed text-left mt-2 first:mt-0 allow-select"
                                style={{ color: 'rgb(255, 232, 234)' }}
                              >
                                {par}
                              </p>
                            ))}
                          </div>
                        ))}
                      </div>
                    )}

                    <div className="w-full space-y-3 text-left">
                      <p className="text-center text-rose-300/55 text-xs">
                        {tempo.meses < 12
                          ? 'Primer año - cada mesversario al mismo ritmo de los stories ✨'
                          : `${Math.floor(tempo.meses / 12)} ${Math.floor(tempo.meses / 12) === 1 ? 'año' : 'años'} juntos - y seguimos sumando capítulos`}
                      </p>
                      {tempo.mesversarioEhAniversario ? (
                        <div className="card-glass rounded-2xl border border-amber-400/25 px-4 py-4 space-y-1">
                          <p className="text-[10px] uppercase tracking-[0.18em] text-amber-200/75">Próximo hito</p>
                          <p className="font-display text-lg text-rose-50 font-medium">
                            Faltan{' '}
                            <span className="tabular-nums text-amber-200">{tempo.diasAteMesversario}</span>{' '}
                            {tempo.diasAteMesversario === 1 ? 'día' : 'días'}
                            {tempo.diasAteMesversario === 0 && tempo.horasAteMesversario > 0 && (
                              <span className="text-base font-normal text-rose-200/90">
                                {' '}y {tempo.horasAteMesversario}h
                              </span>
                            )}
                          </p>
                          <p className="text-rose-300/70 text-sm">Mesversario y aniversario de noviazgo · {tempo.dataMesversarioFmt}</p>
                        </div>
                      ) : (
                        <>
                          <div className="card-glass rounded-2xl border border-rose-400/20 px-4 py-3.5 space-y-1">
                            <p className="text-[10px] uppercase tracking-[0.18em] text-rose-200/65">Próximo mesversario</p>
                            <p className="font-display text-base text-rose-50">
                              <span className="tabular-nums font-semibold text-amber-200/95">{tempo.diasAteMesversario}</span>
                              {tempo.diasAteMesversario === 1 ? ' día' : ' días'}
                              {tempo.diasAteMesversario === 0 && tempo.horasAteMesversario > 0 && (
                                <span className="text-rose-200/85 font-normal"> y {tempo.horasAteMesversario}h</span>
                              )}
                              <span className="text-rose-300/75 font-normal text-sm block sm:inline sm:ml-1">
                                hasta {tempo.dataMesversarioFmt}
                              </span>
                            </p>
                          </div>
                          <div className="card-glass rounded-2xl border border-amber-400/22 px-4 py-3.5 space-y-1">
                            <p className="text-[10px] uppercase tracking-[0.18em] text-amber-200/70">Próximo aniversario de noviazgo</p>
                            <p className="font-display text-base text-rose-50">
                              <span className="tabular-nums font-semibold text-amber-200/95">{tempo.diasAteAniversario}</span>
                              {tempo.diasAteAniversario === 1 ? ' día' : ' días'}
                              {tempo.diasAteAniversario === 0 && tempo.horasAteAniversario > 0 && (
                                <span className="text-rose-200/85 font-normal"> y {tempo.horasAteAniversario}h</span>
                              )}
                              <span className="text-rose-300/75 font-normal text-sm block sm:inline sm:ml-1">
                                hasta {tempo.dataAniversarioFmt}
                              </span>
                            </p>
                          </div>
                        </>
                      )}
                    </div>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </motion.div>
      )}
    </Slide>
  )
}
