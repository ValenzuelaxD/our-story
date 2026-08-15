/**
 * Curva de níveis: começa fácil (pouco XP por nível), cada nível exige mais.
 * thresholds[i] = XP acumulado mínimo para estar no nível i + 1
 */
export function buildLevelThresholds(maxXp) {
  const thresholds = [0]
  let increment = 100
  let cumulative = 0

  while (cumulative < maxXp) {
    cumulative += increment
    thresholds.push(Math.min(cumulative, maxXp))
    if (cumulative >= maxXp) break
    increment = Math.round(increment * 1.14 + 20)
  }

  return thresholds
}

export function getNivelInfo(xp, maxXp) {
  const thresholds = buildLevelThresholds(maxXp)
  const maxNivel = thresholds.length

  let nivel = 1
  for (let i = maxNivel - 1; i >= 0; i--) {
    if (xp >= thresholds[i]) {
      nivel = i + 1
      break
    }
  }

  const piso = thresholds[nivel - 1]
  const teto = nivel < maxNivel ? thresholds[nivel] : maxXp
  const span = teto - piso || 1
  const xpNoNivel = xp - piso
  const pct = Math.min(100, (xpNoNivel / span) * 100)
  const noMaximo = nivel >= maxNivel && xp >= maxXp

  return {
    nivel,
    maxNivel,
    xpAtual: xp,
    xpNoNivel,
    xpSpan: span,
    xpProximoNivel: noMaximo ? 0 : teto - xp,
    pct,
    noMaximo,
  }
}

const TITULOS = [
  'Início da jornada',
  'Primeiro capítulo',
  'Conversando de coração',
  'Primeiros passos juntos',
  'Crescendo juntos',
  'Companheiros de caminho',
  'História bonita de contar',
  'Aliança em construção',
  'Corações conectados',
  'Parceiros de vida',
  'Amor que amadurece',
  'Construindo o futuro',
  'Companheiros de alma',
  'História épica',
  'Quase lá',
  'Lenda do amor',
]

export function getTituloNivel(nivel) {
  if (nivel <= TITULOS.length) return TITULOS[nivel - 1]
  return `Nível ${nivel}`
}
