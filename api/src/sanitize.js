/**
 * Protección contra XSS antes de persistir en la base de datos.
 *
 * Todas las entradas de usuario se tratan como texto puro:
 *  - Las tags HTML y los scripts se eliminan por completo
 *  - Los bytes nulos se descartan
 *  - Los saltos de línea se normalizan
 *  - Los espacios excesivos en nombre/e-mail se colapsan
 *
 * El retorno es siempre texto simple: nunca HTML.
 * En la API (JSON), el cliente es responsable de renderizar con
 * textContent (nunca innerHTML) para garantizar la seguridad de extremo a extremo.
 */

const TAGS_RE = /<[^>]*>/g
const NUL_RE = /\0/g
const CRLF_RE = /\r\n?/g
// javascript: / vbscript: / data: incluso fuera de las tags (por seguridad extra)
const DANGEROUS_PROTO_RE = /(?:javascript|vbscript|data)\s*:/gi

/**
 * Elimina todas las tags HTML, bytes nulos y protocolos peligrosos de una string.
 * Preserva los saltos de línea simples (útil para mensajes multilínea).
 *
 * @param {string} s
 * @returns {string}
 */
export function sanitizeText(s) {
  return String(s)
    .replace(NUL_RE, '')
    .replace(TAGS_RE, '')
    .replace(DANGEROUS_PROTO_RE, '')
    .replace(CRLF_RE, '\n')
    .trim()
}

/**
 * Variante para campos de una sola línea (nombre, e-mail):
 * además de la sanitización base, colapsa espacios y elimina saltos de línea.
 *
 * @param {string} s
 * @returns {string}
 */
export function sanitizeLine(s) {
  return sanitizeText(s)
    .replace(/[\n\t]+/g, ' ')
    .replace(/\s{2,}/g, ' ')
    .trim()
}
