/**
 * Loader de src/data/contenido.json — la única fuente de verdad del sitio.
 * Convierte fechas ISO → Date y re-exporta todo lo que los componentes necesitan.
 */
import raw from './contenido.json' with { type: 'json' }

export const CONTENIDO = raw

/** "YYYY-MM-DDTHH:mm:ss" local → Date (misma hora local de origen). */
function fromLocalIso(str) {
  if (!str) return null
  const [d, t = '00:00:00'] = str.split('T')
  const [y, m, dd] = d.split('-').map(Number)
  const [h, mi, s] = t.split(':').map(Number)
  return new Date(y, m - 1, dd, h, mi, s)
}

const identidad = raw.identidad

export const SITE_ORIGIN = identidad.siteOrigin
export const NOME_ELE = identidad.nombreEl
export const NOME_ELE_PUBLICO = identidad.nombreElPublico
export const NOME_ELE_COMPLETO = identidad.nombreElCompleto
export const NOME_ELA = identidad.nombreElla
export const NOME_ELA_COMPLETO = identidad.nombreEllaCompleto
export const NOME_ELA_FUTURO = identidad.nombreEllaFuturo
export const INICIO_NAMORO = fromLocalIso(identidad.inicioNamoro)
export const DATA_CASAMENTO = identidad.dataCasamento || ''
export const ANIO_INICIO = identidad.anioInicio

// ─── Slides ──────────────────────────────────────────────────────────────────
export const SLIDE_IDS = raw.slides.ids
export const SLIDE_AMBIENCE = raw.slides.ambience
export const LABELS = raw.slides.labels

// ─── Textos ──────────────────────────────────────────────────────────────────
export const TEXTO = raw.texto

/** Reemplaza {clave} usando las variables por defecto + extras por llamada. */
const VARS = {
  el: NOME_ELE,
  elCompleto: NOME_ELE_COMPLETO,
  ella: NOME_ELA,
  ellaCompleto: NOME_ELA_COMPLETO,
  ellaFuturo: NOME_ELA_FUTURO,
  inicio: INICIO_NAMORO.toLocaleDateString('es', { day: 'numeric', month: 'long', year: 'numeric' }),
  rango: ANIO_INICIO === new Date().getFullYear()
    ? String(ANIO_INICIO)
    : `${ANIO_INICIO}–${new Date().getFullYear()}`,
}

export function fill(str, extra = {}) {
  if (!str) return str
  return String(str).replace(/\{(\w+)\}/g, (_, k) => {
    if (k in extra && extra[k] != null) return extra[k]
    if (k in VARS && VARS[k] != null) return VARS[k]
    return `{${k}}`
  })
}

// ─── Datos ───────────────────────────────────────────────────────────────────
export const TIMELINE = raw.timeline
export const HISTORIA_DATA_CORTE = raw.historiaDataCorte
export const MESESVERSARIOS = raw.mesesversarios.map((m) => ({
  ...m,
  data: fromLocalIso(m.data),
}))
export const FOTOS = raw.fotos
export const SESSAO_FOTOS_PRESENTE = raw.flores
export const CARTAS_LACRADAS = raw.cartasLacradasLista.map((c) => ({
  ...c,
  dataAbertura: fromLocalIso(c.dataAbertura),
}))
export const BUCKET_LIST = raw.bucketLista
export const CONQUISTAS = raw.conquistasLista
export const MAPA_LUGARES = raw.lugares
export const MOTIVOS_TE_AMO = raw.motivosTeAmo
export const CREDITOS = raw.creditosLista
export const ANTES_DEPOIS = raw.antesDepois
export const PASSAGENS_BIBLICAS = raw.pasajes
export const SPOTIFY_URLS = raw.musicas