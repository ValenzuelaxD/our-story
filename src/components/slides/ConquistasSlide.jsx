import { useState, useMemo } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import MI from '../ui/MI'
import Slide from '../ui/Slide'
import { staggerV, fadeV, scaleV, CONQUISTAS } from '../../data/constants'
import { getNivelInfo, getTituloNivel } from '../../utils/niveisXp'

// Raridades en la paleta oro-rosa del sitio (mantiene XP y jerarquía)
const RARITY_CONFIG = {
  comum: {
    label: 'Común',
    color: '#e8b4bc',
    glow: 'rgba(232,180,188,0.20)',
    border: 'rgba(232,180,188,0.28)',
    bg: 'rgba(232,180,188,0.07)',
    xp: 100,
    ring: 'rgba(232,180,188,0.14)',
  },
  especial: {
    label: 'Especial',
    color: '#f0a8b8',
    glow: 'rgba(240,168,184,0.24)',
    border: 'rgba(240,168,184,0.36)',
    bg: 'rgba(240,168,184,0.08)',
    xp: 250,
    ring: 'rgba(240,168,184,0.16)',
  },
  raro: {
    label: 'Raro',
    color: '#e8c4a0',
    glow: 'rgba(232,196,160,0.24)',
    border: 'rgba(232,196,160,0.36)',
    bg: 'rgba(232,196,160,0.08)',
    xp: 300,
    ring: 'rgba(232,196,160,0.16)',
  },
  epico: {
    label: 'Épico',
    color: '#d4a574',
    glow: 'rgba(212,165,116,0.28)',
    border: 'rgba(212,165,116,0.42)',
    bg: 'rgba(212,165,116,0.09)',
    xp: 500,
    ring: 'rgba(212,165,116,0.18)',
  },
  lendario: {
    label: 'Legendario',
    color: '#d4af37',
    glow: 'rgba(212,175,55,0.34)',
    border: 'rgba(212,175,55,0.50)',
    bg: 'rgba(212,175,55,0.10)',
    xp: 1000,
    ring: 'rgba(212,175,55,0.26)',
  },
}

const MESES_PT = {
  ene: 0,
  feb: 1,
  mar: 2,
  abr: 3,
  may: 4,
  jun: 5,
  jul: 6,
  ago: 7,
  sep: 8,
  oct: 9,
  nov: 10,
  dic: 11,
}

function getConquistaTime(conquista, originalIndex) {
  if (conquista.dataOrdem) {
    return new Date(`${conquista.dataOrdem}T00:00:00`).getTime()
  }

  const match = conquista.data?.match(/(\d{1,2}) de ([a-zç]{3}) de (\d{4})/i)
  if (match) {
    const [, dia, mes, ano] = match
    return new Date(Number(ano), MESES_PT[mes.toLowerCase()], Number(dia)).getTime()
  }

  return Number.MAX_SAFE_INTEGER + originalIndex
}

function AchievementCard({ conquista, index }) {
  const [expanded, setExpanded] = useState(false)
  const r = RARITY_CONFIG[conquista.raridade]
  const isLendario = conquista.raridade === 'lendario'
  const isEpico = conquista.raridade === 'epico'

  return (
    <motion.div
      variants={{
        hidden: { opacity: 0, y: 16, scale: 0.97 },
        show: {
          opacity: 1,
          y: 0,
          scale: 1,
          transition: { duration: 0.38, delay: index * 0.055, ease: [0.22, 1, 0.36, 1] },
        },
      }}
    >
      <motion.button
        onClick={() => setExpanded(v => !v)}
        className="w-full text-left relative overflow-hidden rounded-2xl transition-colors duration-150 active:scale-[0.985]"
        style={{
          background: `linear-gradient(135deg, ${r.bg}, rgba(255,255,255,0.025))`,
          border: `1px solid ${r.border}`,
        }}
        animate={
          isLendario
            ? {
                boxShadow: [
                  `0 0 0px ${r.glow}`,
                  `0 0 18px ${r.glow}, inset 0 0 18px ${r.ring}`,
                  `0 0 0px ${r.glow}`,
                ],
              }
            : isEpico
            ? { boxShadow: `0 2px 16px -4px rgba(0,0,0,0.45), 0 0 8px ${r.glow}` }
            : { boxShadow: `0 2px 12px -4px rgba(0,0,0,0.40)` }
        }
        transition={isLendario ? { duration: 2.6, repeat: Infinity, ease: 'easeInOut' } : {}}
        whileHover={{ scale: 1.012 }}
      >
        {isLendario && (
          <motion.div
            className="absolute inset-0 pointer-events-none"
            style={{
              background:
                'linear-gradient(105deg, transparent 30%, rgba(212,175,55,0.16) 50%, transparent 70%)',
              zIndex: 1,
            }}
            animate={{ x: ['-120%', '220%'] }}
            transition={{ duration: 3.8, repeat: Infinity, repeatDelay: 2.2, ease: 'easeInOut' }}
          />
        )}

        <div className="relative z-10 flex items-center gap-3 px-3.5 py-3">
          <div
            className="flex-shrink-0 w-12 h-12 rounded-xl flex items-center justify-center text-2xl"
            style={{
              background: r.bg,
              border: `1.5px solid ${r.border}`,
              boxShadow: `0 0 12px ${r.glow}`,
            }}
          >
            {conquista.icon}
          </div>

          <div className="flex-1 min-w-0">
            <div className="flex items-start justify-between gap-2">
              <p className="font-display text-sm sm:text-base font-semibold text-rose-50 leading-tight">
                {conquista.titulo}
              </p>
              <span
                className="flex-shrink-0 text-[9px] font-semibold uppercase tracking-[0.16em] px-2 py-0.5 rounded-full"
                style={{
                  color: r.color,
                  background: r.bg,
                  border: `1px solid ${r.border}`,
                }}
              >
                {r.label}
              </span>
            </div>
            <p className="text-xs text-rose-200/50 leading-snug mt-0.5 pr-1">
              {conquista.subtitulo}
            </p>
            <div className="flex items-center gap-3 mt-1.5">
              {conquista.data && (
                <span className="text-[10px] text-rose-200/30 font-medium">{conquista.data}</span>
              )}
              <span className="text-[10px] font-semibold tabular-nums" style={{ color: r.color }}>
                +{r.xp.toLocaleString('es')} XP
              </span>
            </div>
          </div>

          <motion.span
            className="flex-shrink-0 text-[10px] text-rose-200/25 ml-0.5"
            animate={{ rotate: expanded ? 180 : 0 }}
            transition={{ duration: 0.22 }}
          >
            ▼
          </motion.span>
        </div>

        <AnimatePresence initial={false}>
          {expanded && conquista.descricao && (
            <motion.div
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: 'auto', opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              transition={{ duration: 0.26, ease: [0.4, 0, 0.2, 1] }}
              className="overflow-hidden relative z-10"
            >
              <div
                className="px-4 pb-4 pt-0"
                style={{ borderTop: `1px solid ${r.border}` }}
              >
                <p className="text-xs sm:text-sm text-rose-100/65 leading-relaxed pt-3 font-body italic">
                  {conquista.descricao}
                </p>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </motion.button>
    </motion.div>
  )
}

function LockedCard({ conquista, index }) {
  const r = RARITY_CONFIG[conquista.raridade]

  return (
    <motion.div
      variants={{
        hidden: { opacity: 0, y: 10 },
        show: {
          opacity: 1,
          y: 0,
          transition: { duration: 0.3, delay: index * 0.045, ease: 'easeOut' },
        },
      }}
    >
      <div
        className="w-full relative overflow-hidden rounded-2xl flex items-center gap-3 px-3.5 py-3"
        style={{
          background: 'rgba(255,255,255,0.02)',
          border: '1px solid rgba(255,255,255,0.07)',
        }}
      >
        <div className="flex-shrink-0 w-12 h-12 rounded-xl flex items-center justify-center bg-white/[0.03] border border-white/[0.06]">
          <span className="text-2xl grayscale opacity-25">{conquista.icon}</span>
        </div>

        <div className="flex-1 min-w-0">
          <div className="flex items-start justify-between gap-2">
            <p className="font-display text-sm font-semibold leading-tight text-rose-100/40">
              {conquista.titulo}
            </p>
            <span
              className="flex-shrink-0 text-[9px] font-semibold uppercase tracking-[0.16em] px-2 py-0.5 rounded-full opacity-30"
              style={{
                color: r.color,
                background: r.bg,
                border: `1px solid ${r.border}`,
              }}
            >
              {r.label}
            </span>
          </div>
          <p className="text-xs mt-1 flex items-center gap-1.5 text-rose-200/45">
            <span aria-hidden className="text-[11px] opacity-80">🔒</span>
            <span>Aún no desbloqueada</span>
          </p>
          <p
            className="text-[10px] font-semibold mt-1.5 tabular-nums"
            style={{ color: r.color, opacity: 0.45 }}
          >
            +{r.xp.toLocaleString('es')} XP
          </p>
        </div>

        <span className="text-base flex-shrink-0 text-rose-200/30" aria-hidden>
          🔒
        </span>
      </div>
    </motion.div>
  )
}

export default function ConquistasSlide() {
  const desbloqueadas = useMemo(
    () => CONQUISTAS
      .map((conquista, originalIndex) => ({ conquista, originalIndex }))
      .filter(({ conquista }) => conquista.desbloqueada)
      .sort((a, b) => {
        const diff = getConquistaTime(a.conquista, a.originalIndex) - getConquistaTime(b.conquista, b.originalIndex)
        return diff || a.originalIndex - b.originalIndex
      })
      .map(({ conquista }) => conquista),
    [],
  )
  const bloqueadas = useMemo(() => CONQUISTAS.filter(c => !c.desbloqueada), [])

  const currentXP = useMemo(
    () => desbloqueadas.reduce((acc, c) => acc + RARITY_CONFIG[c.raridade].xp, 0),
    [desbloqueadas],
  )
  const totalXP = useMemo(
    () => CONQUISTAS.reduce((acc, c) => acc + RARITY_CONFIG[c.raridade].xp, 0),
    [],
  )
  const nivelInfo = useMemo(
    () => getNivelInfo(currentXP, totalXP),
    [currentXP, totalXP],
  )

  const raridadesCount = useMemo(() => {
    const counts = { lendario: 0, epico: 0, raro: 0, especial: 0, comum: 0 }
    desbloqueadas.forEach(c => { counts[c.raridade]++ })
    return counts
  }, [desbloqueadas])

  return (
    <Slide id="conquistas" bg="slide-bg-conquistas" center={false}>
      {inView => (
        <motion.div
          variants={staggerV}
          initial="hidden"
          animate={inView ? 'show' : 'hidden'}
          className="flex flex-col gap-5 w-full max-w-md lg:max-w-2xl mx-auto pb-14"
        >
          <div className="text-center pt-2">
            <MI v={fadeV} className="chapter-label">Marcos de nuestro amor</MI>
            <MI className="mt-2 flex items-center justify-center gap-2">
              <span className="text-2xl" style={{ animation: 'softFloat 5s ease-in-out infinite' }}>🏆</span>
              <h2 className="font-display text-2xl sm:text-3xl font-semibold text-rose-50">
                Conquistas
              </h2>
              <span className="text-2xl" style={{ animation: 'softFloat 5s ease-in-out infinite 0.5s' }}>🤍</span>
            </MI>
            <MI v={fadeV}>
              <p className="text-rose-200/55 text-xs mt-1">
                {desbloqueadas.length} de {CONQUISTAS.length} momentos desbloqueados
              </p>
            </MI>

            <MI v={fadeV} className="flex items-center justify-center gap-2 flex-wrap mt-3">
              {['lendario', 'epico', 'raro', 'especial', 'comum'].map((key) => (
                <span
                  key={key}
                  className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-[10px] font-medium uppercase tracking-[0.14em]"
                  style={{
                    color: RARITY_CONFIG[key].color,
                    background: RARITY_CONFIG[key].bg,
                    border: `1px solid ${RARITY_CONFIG[key].border}`,
                  }}
                >
                  ✦ {raridadesCount[key]}× {RARITY_CONFIG[key].label}
                </span>
              ))}
            </MI>
          </div>

          <MI v={scaleV}>
            <div className="card-glass card-gold-border rounded-2xl px-4 py-4">
              <div className="flex items-center justify-between gap-3 mb-3">
                <div className="flex items-center gap-3">
                  <div
                    className="flex-shrink-0 w-12 h-12 rounded-xl flex items-center justify-center font-display font-semibold text-lg tabular-nums text-amber-100"
                    style={{
                      background: 'linear-gradient(135deg, rgba(212,175,55,0.28), rgba(244,114,182,0.16))',
                      border: '1px solid rgba(212,175,55,0.42)',
                      boxShadow: '0 0 16px rgba(212,175,55,0.22)',
                    }}
                  >
                    {nivelInfo.nivel}
                  </div>
                  <div>
                    <p className="text-[10px] uppercase tracking-[0.2em] text-amber-100/45 font-medium">
                      Nivel {nivelInfo.nivel}
                      {!nivelInfo.noMaximo && (
                        <span className="text-rose-200/30"> / {nivelInfo.maxNivel}</span>
                      )}
                    </p>
                    <p className="font-display text-sm font-semibold text-rose-50 leading-tight mt-0.5">
                      {getTituloNivel(nivelInfo.nivel)}
                    </p>
                  </div>
                </div>
                <span className="text-[10px] font-medium text-amber-200/50 tabular-nums text-right">
                  {currentXP.toLocaleString('es')} XP
                </span>
              </div>

              {nivelInfo.noMaximo ? (
                <p className="text-xs text-center text-amber-200/70 font-medium py-1">
                  Nivel máximo — historia completa 🤍
                </p>
              ) : (
                <>
                  <div
                    className="h-2.5 rounded-full overflow-hidden"
                    style={{ background: 'rgba(255,255,255,0.06)' }}
                  >
                    <motion.div
                      className="h-full rounded-full"
                      style={{
                        background: 'linear-gradient(90deg, rgba(244,114,182,0.75) 0%, #d4af37 55%, #f0d78c 100%)',
                        boxShadow: '0 0 14px rgba(212,175,55,0.40)',
                      }}
                      initial={{ width: 0 }}
                      animate={inView ? { width: `${nivelInfo.pct.toFixed(1)}%` } : { width: 0 }}
                      transition={{ duration: 1.4, delay: 0.5, ease: [0.22, 1, 0.36, 1] }}
                    />
                  </div>
                  <div className="flex justify-between items-center mt-2">
                    <span className="text-[9px] text-rose-200/30 font-medium tabular-nums">
                      {nivelInfo.xpNoNivel.toLocaleString('es')} / {nivelInfo.xpSpan.toLocaleString('es')} XP
                    </span>
<span className="text-[9px] text-amber-200/55 font-medium tabular-nums">
                      faltan {nivelInfo.xpProximoNivel.toLocaleString('es')} XP p/ nv. {nivelInfo.nivel + 1}
                    </span>
                  </div>
                </>
              )}
            </div>
          </MI>

          <div>
            <MI v={fadeV}>
              <div className="flex items-center gap-2 mb-3">
                <div
                  className="h-px flex-1"
                  style={{
                    background: 'linear-gradient(90deg, transparent, rgba(212,175,55,0.40))',
                  }}
                />
                <span className="text-[10px] font-medium uppercase tracking-[0.2em] text-amber-200/65">
                  ✦ Desbloqueadas · {desbloqueadas.length}
                </span>
                <div
                  className="h-px flex-1"
                  style={{
                    background: 'linear-gradient(90deg, rgba(212,175,55,0.40), transparent)',
                  }}
                />
              </div>
            </MI>
            <motion.div
              className="space-y-2"
              variants={staggerV}
              initial="hidden"
              animate={inView ? 'show' : 'hidden'}
            >
              {desbloqueadas.map((c, i) => (
                <AchievementCard key={c.id} conquista={c} index={i} />
              ))}
            </motion.div>
          </div>

          <div>
            <MI v={fadeV}>
              <div className="flex items-center gap-2 mb-3">
                <div
                  className="h-px flex-1"
                  style={{
                    background: 'linear-gradient(90deg, transparent, rgba(244,114,182,0.22))',
                  }}
                />
                <span className="text-[10px] font-medium uppercase tracking-[0.2em] text-rose-200/35">
                  En breve · {bloqueadas.length}
                </span>
                <div
                  className="h-px flex-1"
                  style={{
                    background: 'linear-gradient(90deg, rgba(244,114,182,0.22), transparent)',
                  }}
                />
              </div>
            </MI>
            <motion.div
              className="space-y-2"
              variants={staggerV}
              initial="hidden"
              animate={inView ? 'show' : 'hidden'}
            >
              {bloqueadas.map((c, i) => (
                <LockedCard key={c.id} conquista={c} index={i} />
              ))}
            </motion.div>
          </div>

          <MI v={fadeV}>
            <p className="text-center text-[11px] italic text-rose-200/45">
              Toca una conquista para ver la historia 🤍
            </p>
          </MI>
        </motion.div>
      )}
    </Slide>
  )
}
