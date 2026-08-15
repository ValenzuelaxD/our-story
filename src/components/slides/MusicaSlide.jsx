import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import MI from '../ui/MI'
import Slide from '../ui/Slide'
import { staggerV, fadeV, scaleV, SPOTIFY_URLS } from '../../data/constants'

const VISIVEIS = 3
const URLS_PREVIEW = SPOTIFY_URLS.slice(0, VISIVEIS)
const URLS_OCULTAS = SPOTIFY_URLS.slice(VISIVEIS)

function SpotifyCard({ url, idx }) {
  return (
    <div className="w-full rounded-2xl overflow-hidden card-surface">
      <div className="relative w-full" style={{ paddingBottom: '80%' }}>
        <iframe
          className="absolute inset-0 w-full h-full"
          style={{ minHeight: 260 }}
          src={url}
          frameBorder="0"
          allow="autoplay; clipboard-write; encrypted-media; fullscreen; picture-in-picture"
          loading="lazy"
          title={`Nuestra música ${idx + 1}`}
        />
      </div>
    </div>
  )
}

export default function MusicaSlide() {
  const [musicaRevelada, setMusicaRevelada] = useState(false)
  const [expandido, setExpandido] = useState(false)

  return (
    <Slide id="musica" bg="slide-bg-purple">
      {(inView) => (
        <motion.div variants={staggerV} initial="hidden" animate={inView ? 'show' : 'hidden'}
          className="flex flex-col items-center gap-5 text-center w-full max-w-sm lg:max-w-xl mx-auto"
        >
          <MI v={fadeV} className="chapter-label">Nuestra banda sonora</MI>
          <MI v={scaleV} className="text-5xl sm:text-6xl">🎵</MI>
          <MI className="space-y-1">
            <h2 className="font-display text-2xl sm:text-3xl font-semibold text-rose-50">Nuestras Músicas</h2>
            <p className="text-rose-200/65 text-sm">La banda sonora de nuestro amor 💕</p>
          </MI>
          <MI className="w-full">
            {!musicaRevelada ? (
              <button
                onClick={() => setMusicaRevelada(true)}
                className="w-full flex flex-col items-center gap-3 py-6 px-4 rounded-2xl card-surface border border-amber-400/20"
              >
                <span className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-white/10 border border-amber-400/40 text-rose-100 text-sm font-medium">
                  <span>▶</span> Escuchar nuestras músicas
                </span>
              </button>
            ) : (
              <div className="w-full flex flex-col gap-4">
                {URLS_PREVIEW.map((url, i) => (
                  <SpotifyCard key={i} url={url} idx={i} />
                ))}

                <AnimatePresence>
                  {expandido && URLS_OCULTAS.map((url, i) => (
                    <motion.div
                      key={VISIVEIS + i}
                      initial={{ opacity: 0, y: 18 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ duration: 0.38, delay: i * 0.08, ease: [0.25, 0.1, 0.25, 1] }}
                    >
                      <SpotifyCard url={url} idx={VISIVEIS + i} />
                    </motion.div>
                  ))}
                </AnimatePresence>

                {URLS_OCULTAS.length > 0 && (
                  <div className="flex justify-center pt-1">
                    <button
                      type="button"
                      onClick={() => setExpandido(v => !v)}
                      className="flex items-center gap-2 px-6 py-3 rounded-2xl bg-amber-400/10 border border-amber-400/25 text-amber-200 font-sans text-sm font-medium tracking-wide hover:bg-amber-400/18 active:scale-95 transition-all duration-200"
                    >
                      <span>✦</span>
                      <span>{expandido ? 'Mostrar menos' : `Ver más ${URLS_OCULTAS.length} músicas`}</span>
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
            )}
          </MI>
        </motion.div>
      )}
    </Slide>
  )
}
