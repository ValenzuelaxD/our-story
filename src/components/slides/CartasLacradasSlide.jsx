import { motion } from 'framer-motion'
import MI from '../ui/MI'
import Slide from '../ui/Slide'
import { staggerV, fadeV, scaleV, CARTAS_LACRADAS, TEXTO } from '../../data/constants'

const tCartas = TEXTO.cartas

function diasRestantes(dataAlvo) {
  if (!dataAlvo) return null
  const hoje = new Date()
  hoje.setHours(0, 0, 0, 0)
  const alvo = new Date(dataAlvo)
  alvo.setHours(0, 0, 0, 0)
  return Math.ceil((alvo - hoje) / (1000 * 60 * 60 * 24))
}

function CartaCard({ carta }) {
  const dias = diasRestantes(carta.dataAbertura)
  const desbloqueada = dias !== null && dias <= 0
  const semData = carta.dataAbertura === null

  if (desbloqueada) {
    return (
      <div className="rounded-2xl border border-amber-300/40 bg-gradient-to-br from-amber-200/10 to-rose-200/5 p-5 space-y-3 shadow-[0_0_28px_rgba(212,175,55,0.18)]">
        <div className="flex items-center gap-3">
          <span className="text-3xl">{carta.icon}</span>
          <div className="text-left flex-1">
            <p className="text-[9px] uppercase tracking-[0.22em] text-amber-200/70">{tCartas.cartaAbierta}</p>
            <h3 className="font-display text-lg font-semibold text-rose-50 leading-snug">{carta.titulo}</h3>
          </div>
        </div>
        <div className="h-px bg-gradient-to-r from-transparent via-amber-300/40 to-transparent" />
        <div className="space-y-2.5">
          {carta.conteudo.map((p, i) => (
            <p key={i} className="text-rose-100/90 text-sm leading-[1.85] text-left font-body">{p}</p>
          ))}
        </div>
      </div>
    )
  }

  return (
    <div className="rounded-2xl border border-rose-300/15 bg-white/[0.04] p-5 space-y-3">
      <div className="flex items-center gap-3">
        <span className="text-3xl opacity-50">{carta.icon}</span>
        <div className="text-left flex-1">
          <p className="text-[9px] uppercase tracking-[0.22em] text-rose-200/45">
            {semData ? tCartas.fechaProximamente : tCartas.seAbreEl.replace('{fecha}', carta.dataTexto)}
          </p>
          <h3 className="font-display text-lg font-semibold text-rose-100/75 leading-snug">{carta.titulo}</h3>
        </div>
        <span className="text-2xl opacity-40 flex-shrink-0">🔒</span>
      </div>

      {!semData && dias !== null && dias > 0 && (
        <div className="flex items-center justify-center gap-1.5 rounded-xl bg-amber-200/8 border border-amber-200/15 px-3 py-2">
          <span className="text-amber-200/60 text-xs">{tCartas.faltan}</span>
          <span className="font-display font-semibold text-amber-100/90 text-sm">{dias.toLocaleString('es')}</span>
          <span className="text-amber-200/60 text-xs">{dias === 1 ? tCartas.dia : tCartas.dias}</span>
        </div>
      )}

      <p className="text-rose-200/50 text-xs leading-relaxed text-left italic">{carta.descricao}</p>
    </div>
  )
}

export default function CartasLacradasSlide() {
  return (
    <Slide id="cartas" bg="slide-bg-final" center={false}>
      {(inView) => (
        <motion.div
          variants={staggerV}
          initial="hidden"
          animate={inView ? 'show' : 'hidden'}
          className="flex flex-col gap-6 w-full max-w-md lg:max-w-2xl mx-auto allow-select pb-14"
        >
          <div className="text-center pt-2">
            <MI v={fadeV} className="chapter-label">{tCartas.label}</MI>
            <MI v={scaleV} className="text-4xl mt-2" style={{ animation: 'pulseSoft 3s ease-in-out infinite' }}>
              📜
            </MI>
            <MI className="mt-2">
              <h2 className="font-display text-2xl sm:text-3xl font-semibold text-rose-50">{tCartas.titulo}</h2>
            </MI>
            <MI v={fadeV}>
              <p className="text-rose-200/55 text-xs mt-1.5 max-w-[260px] mx-auto">
                {tCartas.subtitulo}
              </p>
            </MI>
          </div>

          <div className="flex flex-col gap-4 w-full">
            {CARTAS_LACRADAS.map((carta) => (
              <MI key={carta.id}>
                <CartaCard carta={carta} />
              </MI>
            ))}
          </div>
        </motion.div>
      )}
    </Slide>
  )
}
