import { useState, useRef, useEffect } from 'react'
import { useInView, motion, AnimatePresence } from 'framer-motion'
import { MapContainer, TileLayer, Marker, useMap } from 'react-leaflet'
import L from 'leaflet'
import 'leaflet/dist/leaflet.css'
import { MAPA_LUGARES, TEXTO } from '../../data/constants'

function criarIcone(selecionado) {
  const cor = selecionado ? '#fbbf24' : '#fb7185'
  const size = selecionado ? 20 : 14
  const border = selecionado ? '3px solid rgba(255,255,255,0.95)' : '2px solid rgba(255,255,255,0.75)'
  const shadow = selecionado
    ? '0 0 0 4px rgba(251,191,36,0.3), 0 3px 10px rgba(0,0,0,0.5)'
    : '0 2px 6px rgba(0,0,0,0.45)'
  return L.divIcon({
    html: `<div style="
      width:${size}px;height:${size}px;
      background:${cor};border:${border};border-radius:50%;
      box-shadow:${shadow};
      transition:all 0.2s;
    "></div>`,
    className: '',
    iconSize: [size, size],
    iconAnchor: [size / 2, size / 2],
  })
}

function FitAll({ places }) {
  const map = useMap()
  useEffect(() => {
    if (!places.length) return
    const bounds = L.latLngBounds(places.map(p => p.coords))
    map.fitBounds(bounds, { padding: [48, 48], maxZoom: 15 })
  }, []) // eslint-disable-line
  return null
}

function PanTo({ coords }) {
  const map = useMap()
  useEffect(() => {
    if (coords) map.panTo(coords, { animate: true, duration: 0.6 })
  }, [coords]) // eslint-disable-line
  return null
}

export default function MapaSlide() {
  const [selecionado, setSelecionado] = useState(null)
  const ref = useRef(null)
  const inView = useInView(ref, { once: true, amount: 'some' })
  const t = TEXTO.mapa

  return (
    <section id="mapa" ref={ref} className="snap-slide slide-bg-story relative overflow-hidden">
      {/* El mapa ocupa todo */}
      <div className="absolute inset-0">
        <MapContainer
          center={t.centro}
          zoom={t.zoom}
          zoomControl={false}
          attributionControl={false}
          className="w-full h-full"
          style={{ background: '#0f0a14' }}
        >
          <TileLayer
            url="https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png"
            attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OSM</a> &copy; <a href="https://carto.com/attributions">CARTO</a>'
          />
          <FitAll places={MAPA_LUGARES} />
          {selecionado && <PanTo coords={selecionado.coords} />}

          {MAPA_LUGARES.map((lugar) => (
            <Marker
              key={lugar.id}
              position={lugar.coords}
              icon={criarIcone(selecionado?.id === lugar.id)}
              eventHandlers={{
                click: () => setSelecionado(prev => prev?.id === lugar.id ? null : lugar),
              }}
            />
          ))}
        </MapContainer>
      </div>

      {/* Degradado superior */}
      <div
        className="absolute top-0 left-0 right-0 z-[800] pointer-events-none"
        style={{ height: '180px', background: 'linear-gradient(to bottom, rgba(8,2,12,0.92) 0%, rgba(8,2,12,0) 100%)' }}
      />

      {/* Encabezado flotante */}
      <motion.div
        initial={{ opacity: 0, y: -16 }}
        animate={inView ? { opacity: 1, y: 0 } : { opacity: 0, y: -16 }}
        transition={{ duration: 0.55, ease: [0.25, 0.1, 0.25, 1] }}
        className="absolute top-0 left-0 right-0 z-[900] px-5 sm:px-8"
        style={{ paddingTop: 'max(2.5rem, env(safe-area-inset-top, 2.5rem))' }}
      >
        <p className="chapter-label">{t.label}</p>
        <h2 className="font-display text-2xl sm:text-3xl font-semibold text-rose-50 mt-1">
          {t.titulo}
        </h2>
        <p className="text-rose-200/50 text-xs mt-1.5">
          {t.subtitulo.replace('{n}', MAPA_LUGARES.length)}
        </p>
      </motion.div>

      {/* Leyenda de lugares - chips horizontales */}
      <AnimatePresence>
        {!selecionado && (
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 16 }}
            transition={{ duration: 0.3 }}
            className="absolute bottom-6 left-0 right-0 z-[900] px-4"
          >
            <div className="flex gap-2 overflow-x-auto pb-1 scrollbar-hide"
              style={{ scrollbarWidth: 'none' }}>
              {MAPA_LUGARES.map(lugar => (
                <button
                  key={lugar.id}
                  onClick={() => setSelecionado(lugar)}
                  className="flex-shrink-0 flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-medium transition-all duration-150 active:scale-95"
                  style={{
                    background: 'rgba(8,2,12,0.82)',
                    border: '1px solid rgba(255,228,230,0.15)',
                    color: 'rgba(255,228,230,0.80)',
                    backdropFilter: 'blur(8px)',
                  }}
                >
                  <span>{lugar.icon}</span>
                  <span>{lugar.nome}</span>
                </button>
              ))}
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Panel deslizante del lugar seleccionado */}
      <AnimatePresence>
        {selecionado && (
          <motion.div
            key={selecionado.id}
            initial={{ y: '100%' }}
            animate={{ y: 0 }}
            exit={{ y: '100%' }}
            transition={{ type: 'spring', damping: 28, stiffness: 320 }}
            className="absolute bottom-0 left-0 right-0 z-[900] overflow-hidden"
            style={{
              background: 'rgba(8,2,12,0.97)',
              borderTop: '1px solid rgba(255,228,230,0.12)',
              borderRadius: '20px 20px 0 0',
              boxShadow: '0 -8px 48px rgba(0,0,0,0.65)',
            }}
          >
            {/* Mango + cerrar */}
            <div className="flex items-center justify-between px-5 pt-3 pb-1">
              <div className="w-10 h-1 rounded-full bg-white/20 mx-auto" />
            </div>

            <div className="flex gap-4 px-5 pb-6 pt-1">
              {/* Foto o marcador de posición */}
              <div className="flex-shrink-0 w-24 h-24 sm:w-28 sm:h-28 rounded-2xl overflow-hidden"
                style={{ border: '1px solid rgba(255,228,230,0.12)' }}>
                {selecionado.foto ? (
                  <img
                    src={selecionado.foto}
                    alt={selecionado.nome}
                    className="w-full h-full object-cover"
                    loading="lazy"
                  />
                ) : (
                  <div className="w-full h-full flex flex-col items-center justify-center gap-1"
                    style={{ background: 'rgba(255,228,230,0.05)' }}>
                    <span className="text-2xl opacity-40">{selecionado.icon}</span>
                    <span className="text-[9px] text-rose-200/30 text-center leading-tight px-1">{t.fotoProximamente}</span>
                  </div>
                )}
              </div>

              {/* Info */}
              <div className="flex-1 min-w-0 flex flex-col justify-between">
                <div>
                  <div className="flex items-start justify-between gap-2">
                    <div>
                      <p className="text-[9px] uppercase tracking-[0.22em] text-rose-300/50 mb-0.5">
                        {selecionado.categoria}
                      </p>
                      <h3 className="font-display text-lg font-semibold text-rose-50 leading-tight">
                        {selecionado.icon} {selecionado.nome}
                      </h3>
                    </div>
                    <button
                      onClick={() => setSelecionado(null)}
                      className="flex-shrink-0 w-7 h-7 rounded-full flex items-center justify-center text-rose-200/40 hover:text-rose-200/80 transition-colors mt-0.5"
                      style={{ background: 'rgba(255,255,255,0.06)' }}
                    >
                      ✕
                    </button>
                  </div>
                  <p className="text-[10px] text-amber-200/60 mt-1 mb-2">{selecionado.data}</p>
                  <p className="text-rose-100/80 text-xs leading-relaxed line-clamp-3">
                    {selecionado.descricao}
                  </p>
                </div>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </section>
  )
}
