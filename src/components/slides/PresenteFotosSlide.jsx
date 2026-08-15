import { motion } from 'framer-motion'
import MI from '../ui/MI'
import Slide from '../ui/Slide'
import { staggerV, fadeV, SESSAO_FOTOS_PRESENTE } from '../../data/constants'
import { useLightbox } from '../../context/LightboxContext'

const MOSAICO_ALTURA = 'min(62vh, 520px)'

/** Resuelve una o varias URLs por ítem (`imagens` sobrescribe `imagem`). Máximo 4 en el mosaico. */
function urlsDoItem(item) {
  if (Array.isArray(item.imagens) && item.imagens.length > 0) {
    return item.imagens.filter(Boolean).slice(0, 4)
  }
  if (item.imagem) return [item.imagem]
  return []
}

const imgClass = 'w-full h-full min-h-0 object-cover cursor-zoom-in transition-opacity duration-150 hover:opacity-90 active:opacity-75'

function ImgClicavel({ src, width, height, loading, className, onClick }) {
  return (
    <img
      src={src}
      alt=""
      width={width}
      height={height}
      className={className}
      loading={loading}
      decoding="async"
      onClick={onClick}
    />
  )
}

function PresenteFotoMosaico({ urls, blockEager, idPrefix, onImageClick }) {
  const n = urls.length
  if (n === 0) return null

  if (n === 1) {
    return (
      <ImgClicavel
        src={urls[0]}
        width={1200}
        height={1500}
        className={imgClass}
        loading={blockEager ? 'eager' : 'lazy'}
        onClick={() => onImageClick?.(0)}
      />
    )
  }

  if (n === 2) {
    return (
      <div className="grid h-full w-full grid-cols-2 gap-1">
        {urls.map((src, i) => (
          <ImgClicavel
            key={`${idPrefix}-${i}`}
            src={src}
            width={800}
            height={1000}
            className={imgClass}
            loading={blockEager && i === 0 ? 'eager' : 'lazy'}
            onClick={() => onImageClick?.(i)}
          />
        ))}
      </div>
    )
  }

  if (n === 3) {
    return (
      <div className="grid h-full w-full grid-cols-2 grid-rows-2 gap-1">
        <ImgClicavel src={urls[0]} width={800} height={600}
          className={`${imgClass} row-start-1 col-start-1`}
          loading={blockEager ? 'eager' : 'lazy'}
          onClick={() => onImageClick?.(0)} />
        <ImgClicavel src={urls[1]} width={800} height={600}
          className={`${imgClass} row-start-1 col-start-2`}
          loading="lazy"
          onClick={() => onImageClick?.(1)} />
        <ImgClicavel src={urls[2]} width={1200} height={600}
          className={`${imgClass} row-start-2 col-span-2`}
          loading="lazy"
          onClick={() => onImageClick?.(2)} />
      </div>
    )
  }

  return (
    <div className="grid h-full w-full grid-cols-2 grid-rows-2 gap-1">
      {urls.map((src, i) => (
        <ImgClicavel
          key={`${idPrefix}-${i}`}
          src={src}
          width={800}
          height={800}
          className={imgClass}
          loading={blockEager && i === 0 ? 'eager' : 'lazy'}
          onClick={() => onImageClick?.(i)}
        />
      ))}
    </div>
  )
}

export default function PresenteFotosSlide() {
  const { titulo, subtitulo, itens } = SESSAO_FOTOS_PRESENTE
  const { abrir } = useLightbox()

  return (
    <Slide id="presentefotos" bg="slide-bg-dark" center={false}>
      {(inView) => (
        <motion.div
          variants={staggerV}
          initial="hidden"
          animate={inView ? 'show' : 'hidden'}
          className="flex flex-col gap-6 w-full max-w-sm lg:max-w-xl mx-auto allow-select pb-14"
        >
          <div className="text-center pt-2">
            <MI v={fadeV} className="chapter-label">Te di</MI>
            <MI className="mt-2 flex items-center justify-center gap-2">
              <span className="text-2xl" style={{ animation: 'softFloat 5s ease-in-out infinite' }}>💐</span>
              <h2 className="font-display text-2xl sm:text-3xl font-semibold text-rose-50">{titulo}</h2>
            </MI>
            <MI v={fadeV}>
              <p className="text-rose-200/55 text-xs mt-1.5 max-w-[300px] mx-auto leading-relaxed">{subtitulo}</p>
            </MI>
          </div>

          <div className="space-y-6 w-full">
            {itens.map((item, idx) => {
              const urls = urlsDoItem(item)
              const multi = urls.length > 1
              return (
                <MI key={item.id}>
                  <article className="rounded-2xl overflow-hidden border border-white/10 bg-white/[0.04] shadow-sm shadow-black/20">
                    <div
                      className="relative w-full overflow-hidden bg-black/20"
                      style={
                        multi
                          ? { height: MOSAICO_ALTURA }
                          : { aspectRatio: '4 / 5', maxHeight: MOSAICO_ALTURA }
                      }
                    >
                      <div className="absolute inset-0">
                        <PresenteFotoMosaico
                          urls={urls}
                          blockEager={idx === 0}
                          idPrefix={item.id}
                          onImageClick={(imgIdx) => abrir(urls, imgIdx)}
                        />
                      </div>
                    </div>
                    <div className="p-4 border-t border-white/8">
                      {item.data && (
                        <span className="timeline-date-pill">{item.data}</span>
                      )}
                      <h3
                        className={`font-display text-lg font-semibold text-rose-100 leading-snug ${item.data ? 'mt-2' : ''}`}
                      >
                        {item.titulo}
                      </h3>
                      <div className="mt-2 space-y-2">
                        {item.paras.map((p, j) => (
                          <p key={j} className="text-rose-200/80 text-sm leading-[1.75]">
                            {p}
                          </p>
                        ))}
                      </div>
                    </div>
                  </article>
                </MI>
              )
            })}
          </div>
        </motion.div>
      )}
    </Slide>
  )
}
