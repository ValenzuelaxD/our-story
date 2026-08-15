import { motion, AnimatePresence } from 'framer-motion'
import { SLIDE_AMBIENCE } from '../../data/constants'

export default function SlideThemedAmbience({ activeIndex, isMobile }) {
  const cfg = SLIDE_AMBIENCE[activeIndex] ?? SLIDE_AMBIENCE[0]
  const slots = isMobile
    ? [
        { l: '18%', d: '-6s', dur: 36, size: '1.35rem' },
        { l: '82%', d: '-22s', dur: 42, size: '1.2rem' },
      ]
    : [
        { l: '8%', d: '-4s', dur: 34, size: '1.45rem' },
        { l: '38%', d: '-18s', dur: 40, size: '1.25rem' },
        { l: '62%', d: '-10s', dur: 38, size: '1.35rem' },
        { l: '92%', d: '-26s', dur: 44, size: '1.2rem' },
      ]
  return (
    <div
      className="slide-themed-ambience fixed inset-0 pointer-events-none z-[2] overflow-hidden"
      aria-hidden
      style={{ ['--ambience-glow']: cfg.glow }}
    >
      <AnimatePresence mode="sync">
        <motion.div
          key={activeIndex}
          className="absolute inset-0"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.45, ease: [0.25, 0.1, 0.25, 1] }}
        >
          {slots.map((s, i) => (
            <span
              key={`${activeIndex}-${i}`}
              className="slide-themed-ambience-emoji"
              style={{
                left: s.l,
                top: '-24px',
                fontSize: s.size,
                animationDelay: s.d,
                animationDuration: `${s.dur}s`,
              }}
            >
              {cfg.emoji}
            </span>
          ))}
        </motion.div>
      </AnimatePresence>
    </div>
  )
}