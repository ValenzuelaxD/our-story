import { useState, useMemo } from 'react'
import { motion } from 'framer-motion'
import MI from '../ui/MI'
import Slide from '../ui/Slide'
import { staggerV, fadeV, FOTOS } from '../../data/constants'
import { useLightbox } from '../../context/LightboxContext'

const INITIAL = 16

function seedRot(i) {
  const v = Math.sin(i * 7.13 + 3.33) * 43758.5453
  return ((v - Math.floor(v)) - 0.5) * 8 // -4° a +4°
}

// Convierte el nombre de la carpeta en un pie legible: "pedido_namoro" → "Pedido de namoro"
function folderLabel(src) {
  const folder = src.split('/').at(-2) ?? ''
  return folder
    .replace(/^\d+x?[_-]?/, '')   // quita prefijos "1x_", "2_"
    .replace(/[_-]/g, ' ')
    .trim()
    .replace(/^\w/, c => c.toUpperCase())
}

export default function MomentosSlide() {
  const { abrir } = useLightbox()
  const [verTudo, setVerTudo] = useState(false)

  const items = useMemo(
    () => FOTOS.map((src, idx) => ({ src, idx, r: seedRot(idx), label: folderLabel(src) })),
    [],
  )

  const visiveis = verTudo ? items : items.slice(0, INITIAL)
  const restantes = FOTOS.length - INITIAL

  return (
    <Slide id="momentos" bg="slide-bg-dark" center={false}>
      {(inView) => (
        <motion.div
          variants={staggerV}
          initial="hidden"
          animate={inView ? 'show' : 'hidden'}
          className="flex flex-col items-center gap-5 w-full"
        >
          {/* Encabezado */}
          <div className="text-center w-full">
            <MI v={fadeV} className="chapter-label">Nuestros recuerdos</MI>
            <MI className="mt-2">
              <h2 className="font-display text-2xl sm:text-3xl font-semibold text-rose-50">
                Momentos 📸
              </h2>
            </MI>
            <MI v={fadeV}>
              <p className="text-rose-300/50 text-xs mt-1">
                {FOTOS.length} fotos en orden cronológico · toca para ampliar
              </p>
            </MI>
          </div>

          {/* Mural de polaroids */}
          <MI v={fadeV} className="w-full">
            {/*
              Sin restricción de altura en el contenedor — CSS columns + overflow:auto = espacios en blanco y layout roto.
              El botón "Ver más" ya controla el tamaño inicial; expandido, el slide crece de forma natural.
            */}
            <div className="columns-2 sm:columns-3 lg:columns-5 xl:columns-6 gap-2.5 px-1 pb-4">
              {visiveis.map(({ src, idx, r, label }) => (
                <div
                  key={src}
                  className={`polaroid-wall-item break-inside-avoid mb-3 ${verTudo && idx >= INITIAL ? 'polaroid-new' : ''}`}
                  style={{ '--r': `${r}deg`, '--delay': `${Math.min((idx - INITIAL) * 0.03, 0.7)}s` }}
                  onClick={() => abrir(FOTOS, idx)}
                  role="button"
                  tabIndex={0}
                  onKeyDown={(e) => e.key === 'Enter' && abrir(FOTOS, idx)}
                  aria-label={`${label} – foto ${idx + 1}`}
                >
                  <div className="polaroid-wall-frame">
                    <img
                      src={src}
                      alt={label}
                      loading="lazy"
                      decoding="async"
                      className="w-full h-auto block"
                    />
                    <p className="polaroid-wall-caption">{label}</p>
                  </div>
                </div>
              ))}
            </div>
          </MI>

          {/* Botón Ver más */}
          {!verTudo && (
            <MI v={fadeV}>
              <button
                onClick={() => setVerTudo(true)}
                className="btn-primary rounded-full px-7 py-3 text-sm font-medium tracking-wide"
              >
                📷 Ver más {restantes} fotos
              </button>
            </MI>
          )}
        </motion.div>
      )}
    </Slide>
  )
}
