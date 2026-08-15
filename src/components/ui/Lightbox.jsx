import { useEffect, useRef } from 'react'
import { AnimatePresence, motion } from 'framer-motion'
import { createPortal } from 'react-dom'
import { useLightbox } from '../../context/LightboxContext'

export default function Lightbox() {
  const { aberto, fotos, idx, fechar, avancar, voltar, irPara } = useLightbox()
  const touchStartX = useRef(0)
  const touchStartY = useRef(0)
  const touchMoved = useRef(false)

  // Bloquea el scroll del body cuando está abierto
  useEffect(() => {
    document.body.style.overflow = aberto ? 'hidden' : ''
    return () => { document.body.style.overflow = '' }
  }, [aberto])

  // Teclado: ← → Esc
  useEffect(() => {
    if (!aberto) return
    const handle = (e) => {
      if (e.key === 'ArrowRight') avancar()
      if (e.key === 'ArrowLeft')  voltar()
      if (e.key === 'Escape')     fechar()
    }
    window.addEventListener('keydown', handle)
    return () => window.removeEventListener('keydown', handle)
  }, [aberto, avancar, voltar, fechar])

  const onTouchStart = (e) => {
    touchStartX.current = e.touches[0].clientX
    touchStartY.current = e.touches[0].clientY
    touchMoved.current = false
  }

  const onTouchEnd = (e) => {
    const dx = touchStartX.current - e.changedTouches[0].clientX
    const dy = Math.abs(touchStartY.current - e.changedTouches[0].clientY)
    if (Math.abs(dx) > 48 && Math.abs(dx) > dy) {
      touchMoved.current = true
      dx > 0 ? avancar() : voltar()
    }
  }

  if (typeof document === 'undefined') return null

  return createPortal(
    <AnimatePresence>
      {aberto && (
        <motion.div
          key="lightbox-overlay"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.22 }}
          className="fixed inset-0 z-[500] flex flex-col select-none"
          style={{ background: 'rgba(6,2,6,0.97)' }}
          onTouchStart={onTouchStart}
          onTouchEnd={onTouchEnd}
        >
          {/* Barra superior: contador + cerrar */}
          <div className="flex items-center justify-between px-4 pt-safe-top py-3 flex-shrink-0">
            <span className="text-white/35 text-xs tabular-nums tracking-wider">
              {fotos.length > 1 ? `${idx + 1} / ${fotos.length}` : ''}
            </span>
            <button
              onClick={fechar}
              className="w-9 h-9 rounded-full flex items-center justify-center text-white/50 hover:text-white hover:bg-white/10 active:bg-white/20 transition-colors"
              aria-label="Cerrar"
            >
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2.2} className="w-5 h-5">
                <path strokeLinecap="round" d="M6 6l12 12M6 18L18 6" />
              </svg>
            </button>
          </div>

          {/* Imagen central */}
          <div className="flex-1 flex items-center justify-center min-h-0 px-3">
            <AnimatePresence mode="wait">
              <motion.img
                key={`lb-${idx}`}
                src={fotos[idx]}
                alt=""
                initial={{ opacity: 0, scale: 0.96 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.96 }}
                transition={{ duration: 0.18 }}
                className="max-w-full w-auto h-auto object-contain rounded-xl pointer-events-none"
                style={{ maxHeight: 'calc(100dvh - 130px)' }}
                draggable={false}
              />
            </AnimatePresence>
          </div>

          {/* Controles inferiores */}
          <div className="flex items-center justify-between px-4 pt-3 pb-6 flex-shrink-0" style={{ minHeight: '72px' }}>
            {fotos.length > 1 ? (
              <>
                {/* Flecha izquierda - esquina inferior izquierda */}
                <button
                  onClick={voltar}
                  className="w-12 h-12 rounded-full flex items-center justify-center bg-white/10 border border-white/15 text-white/70 hover:bg-white/20 hover:text-white active:scale-95 transition-all"
                  aria-label="Anterior"
                >
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M15 19l-7-7 7-7" />
                  </svg>
                </button>

                {/* Indicador central - dots si ≤ 8, si no nada (el contador ya está arriba) */}
                {fotos.length <= 8 ? (
                  <div className="flex gap-1.5 items-center">
                    {fotos.map((_, i) => (
                      <button
                        key={i}
                        onClick={() => irPara(i)}
                        className={`rounded-full transition-all duration-200 ${
                          i === idx ? 'bg-amber-400 w-4 h-1.5' : 'bg-white/25 w-1.5 h-1.5'
                        }`}
                      />
                    ))}
                  </div>
                ) : (
                  <div />
                )}

                {/* Flecha derecha - esquina inferior derecha */}
                <button
                  onClick={avancar}
                  className="w-12 h-12 rounded-full flex items-center justify-center bg-white/10 border border-white/15 text-white/70 hover:bg-white/20 hover:text-white active:scale-95 transition-all"
                  aria-label="Siguiente"
                >
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M9 5l7 7-7 7" />
                  </svg>
                </button>
              </>
            ) : (
              /* Foto única: botón cerrar centrado */
              <div className="w-full flex justify-center">
                <button
                  onClick={fechar}
                  className="text-white/30 text-xs uppercase tracking-widest hover:text-white/60 transition-colors"
                >
cerrar
                </button>
              </div>
            )}
          </div>
        </motion.div>
      )}
    </AnimatePresence>,
    document.body
  )
}
