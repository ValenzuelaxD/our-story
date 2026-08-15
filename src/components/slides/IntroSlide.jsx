import { useCallback, useRef } from 'react'
import { motion, useMotionValue, useSpring, useTransform } from 'framer-motion'
import MI from '../ui/MI'
import Slide from '../ui/Slide'
import { staggerV, fadeV, scaleV, TEXTO, fill } from '../../data/constants'

export default function IntroSlide() {
  const containerRef = useRef(null)
  const t = TEXTO.intro

  // Valores del ratón suavizados
  const rawX = useMotionValue(0)
  const rawY = useMotionValue(0)
  const mx = useSpring(rawX, { stiffness: 40, damping: 20, mass: 0.6 })
  const my = useSpring(rawY, { stiffness: 40, damping: 20, mass: 0.6 })

  // La capa de la foto se mueve ligeramente contra el ratón (parallax)
  const photoX = useTransform(mx, [-1, 1], [5, -5])
  const photoY = useTransform(my, [-1, 1], [4, -4])

  // Los orbes se mueven junto con el ratón
  const orb1X = useTransform(mx, [-1, 1], [-14, 14])
  const orb1Y = useTransform(my, [-1, 1], [-10, 10])
  const orb2X = useTransform(mx, [-1, 1], [10, -10])
  const orb2Y = useTransform(my, [-1, 1], [8, -8])

  const handlePointerMove = useCallback((e) => {
    const el = containerRef.current
    if (!el) return
    const rect = el.getBoundingClientRect()
    rawX.set(((e.clientX - rect.left) / rect.width  - 0.5) * 2)
    rawY.set(((e.clientY - rect.top)  / rect.height - 0.5) * 2)
  }, [rawX, rawY])

  const handlePointerLeave = useCallback(() => {
    rawX.set(0)
    rawY.set(0)
  }, [rawX, rawY])

  return (
    <Slide id="intro" bg="slide-bg-rose">
      {(inView) => (
        <motion.div
          ref={containerRef}
          variants={staggerV}
          initial="hidden"
          animate={inView ? 'show' : 'hidden'}
          onPointerMove={handlePointerMove}
          onPointerLeave={handlePointerLeave}
          className="relative flex flex-col items-center gap-5 text-center w-full max-w-sm lg:max-w-xl mx-auto"
        >
          {/* Orbes de profundidad – quedan detrás de todo */}
          <motion.div
            className="glow-orb w-48 h-48 bg-rose-300/18 blur-3xl -z-10"
            style={{ x: orb1X, y: orb1Y, top: '-5%', left: '-18%' }}
          />
          <motion.div
            className="glow-orb w-36 h-36 bg-amber-200/14 blur-2xl -z-10"
            style={{ x: orb2X, y: orb2Y, top: '30%', right: '-12%' }}
          />
          <motion.div
            className="glow-orb w-28 h-28 bg-purple-300/12 blur-2xl -z-10"
            style={{ x: orb1X, bottom: '10%', left: '5%' }}
          />

          <MI v={fadeV} className="chapter-label">{t.label}</MI>

          <MI v={scaleV} className="flex gap-3 text-4xl">
            <span style={{ animation: 'heartBeat 1.5s ease-in-out infinite' }}>❤️</span>
            <span style={{ animation: 'heartBeat 1.5s ease-in-out infinite 0.3s' }}>❤️</span>
            <span style={{ animation: 'heartBeat 1.5s ease-in-out infinite 0.6s' }}>❤️</span>
          </MI>

          {/* Foto estilo Polaroid con parallax */}
          <MI className="relative">
            {/* Resplandor detrás de la foto */}
            <motion.div
              className="absolute inset-0 rounded-full bg-rose-300/28 blur-3xl scale-110 -z-10"
              style={{ x: orb2X, y: orb2Y }}
            />
            <motion.div
              className="polaroid"
              style={{ x: photoX, y: photoY, rotate: -2 }}
              whileHover={{ rotate: -1, scale: 1.02 }}
              transition={{ type: 'spring', stiffness: 200, damping: 22 }}
            >
              <div className="polaroid-img w-[180px] sm:w-[210px] aspect-[3/4]">
                <img
                  src={t.foto}
                  alt={t.caption}
                  width={600}
                  height={800}
                  className="w-full h-full object-cover"
                  loading="eager"
                  decoding="async"
                  fetchPriority="high"
                />
              </div>
              <p className="polaroid-caption">{t.caption}</p>
            </motion.div>
          </MI>

          <MI className="space-y-1">
            <h1 className="text-hero font-display font-semibold text-rose-50">
              {fill(t.titulo)} <span className="inline-block animate-heartBeat">❤️</span>
            </h1>
            <p className="font-display text-xl text-rose-200/85">{t.subtitulo}</p>
          </MI>

          <MI>
            <span className="badge-pill">{fill(t.badge)}</span>
          </MI>

          <MI v={fadeV} className="flex items-center gap-2 text-xl mt-1">
            <span className="float-emoji opacity-80" style={{ animationDelay: '0s' }}>✨</span>
            <span className="float-emoji opacity-70" style={{ animationDelay: '0.5s' }}>🦋</span>
            <span className="float-emoji opacity-90" style={{ animationDelay: '0.2s' }}>🌹</span>
            <span className="float-emoji opacity-80" style={{ animationDelay: '0.7s' }}>✨</span>
          </MI>
        </motion.div>
      )}
    </Slide>
  )
}
