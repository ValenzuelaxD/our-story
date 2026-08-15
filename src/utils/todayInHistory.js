/**
 * Descubre si hoy es aniversario de algún evento en la TIMELINE o en los MESESVERSARIOS.
 * Devuelve un objeto con los datos del evento, o null si no hay coincidencia hoy.
 */

const MESES_PT = [
  'enero','febrero','marzo','abril','mayo','junio',
  'julio','agosto','septiembre','octubre','noviembre','diciembre',
]

/** Convierte '09 de febrero de 2026' o '13–15 de febrero de 2026' → Date */
function parseDataTimeline(str) {
  const clean = str.replace(/^(\d+)[–\-]\d+/, '$1').trim()
  const partes = clean.split(' ')
  const dia = parseInt(partes[0], 10)
  const mes = MESES_PT.indexOf(partes[2])
  const ano = parseInt(partes[4], 10)
  if (mes === -1 || isNaN(dia) || isNaN(ano)) return null
  return new Date(ano, mes, dia)
}

/** Convierte diferencia de fechas en texto legible en ES */
function tempoAtras(data) {
  const hoje = new Date()
  const diasTotal = Math.floor((hoje - data) / 86_400_000)
  const anosTotal = hoje.getFullYear() - data.getFullYear()
  const mesesTotal =
    anosTotal * 12 + (hoje.getMonth() - data.getMonth())

  if (diasTotal < 1)  return 'hoy'
  if (diasTotal === 1) return 'hace 1 día'
  if (diasTotal < 30)  return `hace ${diasTotal} días`
  if (mesesTotal === 1) return 'hace 1 mes'
  if (mesesTotal < 12)  return `hace ${mesesTotal} meses`
  if (anosTotal === 1)  return 'hace 1 año'
  return `hace ${anosTotal} años`
}

/**
 * @param {Array} timeline     — array TIMELINE de constants.js
 * @param {Array} mesesversarios — array MESESVERSARIOS de timeline.js
 * @returns {{ tipo, icon, label, titulo, resumo, tempo } | null}
 */
export function buscarHojeNaHistoria(timeline, mesesversarios) {
  const hoje = new Date()
  const m = hoje.getMonth()
  const d = hoje.getDate()

  // Los mesversarios tienen prioridad (ya son fechas conmemorativas especiales)
  for (const mes of mesesversarios) {
    if (mes.data.getMonth() === m && mes.data.getDate() === d) {
      return {
        tipo: 'mesversario',
        icon: '🤍',
        label: '¡Mesversario de ustedes!',
        titulo: mes.titulo,
        resumo: mes.resumo?.[0] ?? '',
        tempo: null,
      }
    }
  }

  // Evento de la TIMELINE en el mismo día y mes (cualquier año)
  for (const item of timeline) {
    const data = parseDataTimeline(item.data)
    if (!data) continue
    if (data.getMonth() === m && data.getDate() === d) {
      return {
        tipo: 'timeline',
        icon: item.icon ?? '📅',
        label: 'Hoy en nuestra historia',
        titulo: item.titulo,
        resumo: item.paras?.[0]?.slice(0, 110) + (item.paras?.[0]?.length > 110 ? '…' : '') ?? '',
        tempo: tempoAtras(data),
      }
    }
  }

  return null
}
