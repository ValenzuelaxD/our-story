import { useState } from 'react'
import { SLIDE_IDS } from '../../data/constants'

const LABELS = {
  intro:         '🌹 Inicio',
  timer:         '⏳ Días juntos',
  antesdepois:   '🌗 Antes y después',
  musica:        '🎵 Nuestras canciones',
  carta:         '💌 Carta',
  tags:          '✨ Sobre ti',
  versiculo:     '✝️ Versículos',
  momentos:      '📸 Momentos',
  historia:      '📖 Nuestra historia',
  mapa:          '🗺️ Mapa de la historia',
  presentefotos: '💐 Flores',
  promessas:     '🌿 Promesas',
  motivos:       '🦋 100 motivos',
  futuro:        '🌅 Futuro',
  recado:        '💬 Mensajes',
  creditos:      '🎬 Créditos',
  cartas:        '📜 Cartas guardadas',
  bucketlist:    '✅ Lista de sueños',
  conquistas:    '🏆 Conquistas',
  final:         '💝 Capítulo I',
}

export default function CerimoniaBtn({ activeSlide, setActiveSlide }) {
  const [aberto, setAberto] = useState(false)

  const irPara = (idx) => {
    const id = SLIDE_IDS[idx]
    if (id) {
      document.getElementById(id)?.scrollIntoView({ behavior: 'smooth' })
      setActiveSlide(idx)
    }
    setAberto(false)
  }

  return (
    <>
      {/* Botón flotante */}
      <button
        onClick={() => setAberto(v => !v)}
        className="fixed bottom-6 left-4 z-[300] w-9 h-9 rounded-full flex items-center justify-center text-sm font-semibold transition-all duration-300"
        style={{
          background: aberto ? 'rgba(212,175,55,0.85)' : 'rgba(20,8,16,0.72)',
          border: `1px solid ${aberto ? 'rgba(212,175,55,0.9)' : 'rgba(255,228,230,0.12)'}`,
          color: aberto ? '#1a0a10' : 'rgba(212,175,55,0.8)',
          opacity: aberto ? 1 : 0.5,
          backdropFilter: 'blur(10px)',
          boxShadow: aberto ? '0 0 16px rgba(212,175,55,0.35)' : 'none',
          fontSize: '1rem',
          letterSpacing: 0,
        }}
        title="Navegar entre slides"
        onMouseEnter={e => (e.currentTarget.style.opacity = '1')}
        onMouseLeave={e => { if (!aberto) e.currentTarget.style.opacity = '0.5' }}
      >
        ✦
      </button>

      {/* Overlay + panel */}
      {aberto && (
        <div
          className="fixed inset-0 z-[295]"
          onClick={(e) => { if (e.target === e.currentTarget) setAberto(false) }}
        >
          <div
            className="absolute bottom-16 left-4 w-64 rounded-2xl overflow-hidden flex flex-col"
            style={{
              background: 'rgba(16,6,12,0.97)',
              border: '1px solid rgba(212,175,55,0.22)',
              boxShadow: '0 12px 48px rgba(0,0,0,0.7), 0 0 24px rgba(212,175,55,0.08)',
              backdropFilter: 'blur(20px)',
            }}
          >
            {/* Cabecera */}
            <div className="flex items-center justify-between px-4 py-3 border-b border-white/[0.06]">
              <p className="text-[10px] uppercase tracking-[0.22em] text-amber-200/60">
                Navegar
              </p>
              <button
                onClick={() => setAberto(false)}
                className="text-rose-200/35 hover:text-rose-200/80 transition-colors text-sm"
              >
                ✕
              </button>
            </div>

            {/* Lista de slides */}
            <div className="overflow-y-auto py-1" style={{ maxHeight: '18rem' }}>
              {SLIDE_IDS.map((id, idx) => (
                <button
                  key={id}
                  onClick={() => irPara(idx)}
                  className="w-full text-left px-4 py-2 text-sm transition-colors duration-150"
                  style={{
                    color: activeSlide === idx ? 'rgba(253,230,138,0.95)' : 'rgba(255,228,230,0.55)',
                    background: activeSlide === idx ? 'rgba(212,175,55,0.1)' : 'transparent',
                  }}
                  onMouseEnter={e => { if (activeSlide !== idx) e.currentTarget.style.background = 'rgba(255,255,255,0.04)' }}
                  onMouseLeave={e => { if (activeSlide !== idx) e.currentTarget.style.background = 'transparent' }}
                >
                  {LABELS[id] || id}
                </button>
              ))}
            </div>
          </div>
        </div>
      )}
    </>
  )
}
