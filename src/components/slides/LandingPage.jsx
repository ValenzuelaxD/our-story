import { createPortal } from 'react-dom'
import { motion } from 'framer-motion'
import HeartsRain from '../animations/HeartsRain'

export default function LandingPage({ onReveal }) {
  return (
    <>
      {typeof document !== 'undefined' && createPortal(<HeartsRain />, document.body)}
      <div className="min-h-screen min-h-[100dvh] flex flex-col items-center justify-center page-bg-landing text-rose-100 px-6 relative overflow-hidden">
        <div className="w-full max-w-xs flex flex-col items-center gap-6 relative z-10">
          <motion.div
            className="text-6xl"
            initial={{ opacity: 0, scale: 0.6 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.6, ease: [0.34, 1.56, 0.64, 1] }}
          >💕</motion.div>
          <motion.div
            className="text-center space-y-1"
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2, duration: 0.5 }}
          >
            <p className="font-display text-2xl font-light tracking-wide text-rose-100/95">Una sorpresa especial</p>
            <p className="font-display text-2xl font-light tracking-wide text-rose-100/95">
              te espera <span className="float-emoji inline-block text-xl" style={{ animationDelay: '0.5s' }}>🦋</span>
            </p>
          </motion.div>
          <motion.div
            className="flex items-center gap-3 w-full"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.35, duration: 0.5 }}
          >
            <div className="flex-1 h-px bg-gradient-to-r from-transparent via-amber-300/40 to-transparent" />
            <span className="text-amber-300/60 text-xs tracking-widest">❀ ❀ ❀</span>
            <div className="flex-1 h-px bg-gradient-to-r from-transparent via-amber-300/40 to-transparent" />
          </motion.div>
          <motion.button
            onClick={() => onReveal(true)}
            className="btn-primary w-full rounded-2xl font-sans text-base font-medium flex items-center justify-center gap-2 px-6"
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.45, duration: 0.5 }}
          >
            <span>💕</span> Haz clic aquí, mi amor <span>💕</span>
          </motion.button>
          <motion.p
            className="text-sm text-rose-300/50 flex items-center gap-1.5"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.6 }}
          >
            <span>✨</span> Toca para revelar <span>✨</span>
          </motion.p>
        </div>
      </div>
    </>
  )
}
