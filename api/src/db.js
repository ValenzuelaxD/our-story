import mysql from 'mysql2/promise'

/** @type {import('mysql2/promise').Pool | null} */
let pool = null

/**
 * Crea el pool de conexiones para MySQL 5.7.
 * Devuelve null si las variables obligatorias no están definidas
 * (modo "solo e-mail", sin persistencia).
 *
 * @param {NodeJS.ProcessEnv} env
 * @returns {import('mysql2/promise').Pool | null}
 */
export function createPool(env) {
  const host = env.DB_HOST
  const user = env.DB_USER
  const database = env.DB_NAME

  if (!host || !user || !database) return null

  pool = mysql.createPool({
    host,
    port: parseInt(env.DB_PORT || '3306', 10),
    user,
    password: env.DB_PASSWORD ?? '',
    database,
    charset: 'utf8mb4',
    multipleStatements: false,
    connectTimeout: 10_000,
    waitForConnections: true,
    connectionLimit: 5,
    queueLimit: 0,
  })

  return pool
}

/**
 * Crea la tabla `recados` si aún no existe.
 * Compatible con MySQL 5.7 (utf8mb4_unicode_ci, sin columnas JSON).
 *
 * @param {import('mysql2/promise').Pool} [p]
 */
export async function initDb(p = pool) {
  if (!p) return

  await p.execute(`
    CREATE TABLE IF NOT EXISTS recados (
      id          INT UNSIGNED     NOT NULL AUTO_INCREMENT,
      name        VARCHAR(120)     NOT NULL,
      email       VARCHAR(254)     NOT NULL,
      message     TEXT             NOT NULL,
      ip_hash     VARCHAR(64)      NOT NULL DEFAULT '',
      visible     TINYINT(1)       NOT NULL DEFAULT 1,
      created_at  DATETIME         NOT NULL DEFAULT CURRENT_TIMESTAMP,
      PRIMARY KEY (id),
      INDEX idx_visible_created (visible, created_at)
    ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci
  `)

  // Tabla de contenido editable (Fase 3): una sola fila (id=1) con el JSON completo.
  // MEDIUMTEXT porque MySQL 5.7 no soporta columnas JSON nativas.
  await p.execute(`
    CREATE TABLE IF NOT EXISTS contenido (
      id          TINYINT(1)   NOT NULL DEFAULT 1,
      body        MEDIUMTEXT   NOT NULL,
      updated_at  DATETIME     NOT NULL DEFAULT CURRENT_TIMESTAMP
                               ON UPDATE CURRENT_TIMESTAMP,
      PRIMARY KEY (id)
    ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci
  `)

  // Diagnóstico de arranque: confirma qué base de datos y cuántos recados visibles hay
  try {
    const [[info]] = await p.query(
      'SELECT DATABASE() AS db, (SELECT COUNT(*) FROM recados WHERE visible = 1) AS cnt',
    )
    console.log(`[DB] conectado a "${info.db}" | recados visibles: ${info.cnt}`)
  } catch (e) {
    console.error('[DB] error en el diagnóstico de arranque:', e instanceof Error ? e.message : e)
  }
}

/**
 * Devuelve el contenido editable guardado (objeto parseado) o null si la
 * tabla está vacía (el sitio usa entonces el JSON del repo como seed/fallback).
 *
 * @param {import('mysql2/promise').Pool} [p]
 * @returns {Promise<{ content: unknown, updated_at: string } | null>}
 */
export async function getContenido(p = pool) {
  if (!p) return null

  const [rows] = await p.query(
    'SELECT body, DATE_FORMAT(updated_at, \'%Y-%m-%dT%H:%i:%sZ\') AS updated_at FROM contenido WHERE id = 1',
  )
  const row = /** @type {any[]} */ (rows)[0]
  if (!row) return null

  try {
    return { content: JSON.parse(row.body), updated_at: row.updated_at }
  } catch (e) {
    console.error('[DB:getContenido] JSON inválido en la tabla:', e instanceof Error ? e.message : e)
    return null
  }
}

/**
 * Guarda (o reemplaza) el contenido completo como JSON en la fila id=1.
 *
 * @param {unknown} body objeto de contenido a persistir
 * @param {import('mysql2/promise').Pool} [p]
 * @returns {Promise<boolean>} true si se guardó
 */
export async function saveContenido(body, p = pool) {
  if (!p) return false
  await p.execute(
    'INSERT INTO contenido (id, body) VALUES (1, ?) ON DUPLICATE KEY UPDATE body = VALUES(body)',
    [JSON.stringify(body)],
  )
  return true
}

/**
 * Persiste un recado ya sanitizado.
 * El e-mail se almacena para moderación/respuesta interna,
 * pero nunca se expone en el endpoint público GET.
 *
 * @param {{ name: string, email: string, message: string, ipHash?: string }} payload
 * @param {import('mysql2/promise').Pool} [p]
 * @returns {Promise<number|null>} id insertado, o null si el DB no está configurado
 */
export async function saveRecado({ name, email, message, ipHash = '' }, p = pool) {
  if (!p) return null

  // visible=0: el recado queda pendiente hasta la aprobación vía enlace en el e-mail
  const [result] = await p.execute(
    'INSERT INTO recados (name, email, message, ip_hash, visible) VALUES (?, ?, ?, ?, 0)',
    [name, email, message, ipHash],
  )

  return /** @type {import('mysql2').ResultSetHeader} */ (result).insertId
}

/**
 * Vuelve visible públicamente un recado (aprobación vía enlace en el e-mail).
 *
 * @param {number} id
 * @param {import('mysql2/promise').Pool} [p]
 */
export async function approveRecado(id, p = pool) {
  if (!p) return
  await p.execute('UPDATE recados SET visible = 1 WHERE id = ?', [id])
}

/**
 * Devuelve los recados visibles en orden cronológico inverso.
 * El campo `email` se omite intencionalmente (privacidad).
 *
 * @param {{ limit?: number, offset?: number }} [opts]
 * @param {import('mysql2/promise').Pool} [p]
 * @returns {Promise<Array<{ id: number, name: string, message: string, created_at: string }>>}
 */
export async function getRecados({ limit = 50, offset = 0 } = {}, p = pool) {
  if (!p) return []

  const safeLimit = Math.min(Math.max(1, parseInt(String(limit), 10) || 50), 100)
  const safeOffset = Math.max(0, parseInt(String(offset), 10) || 0)

  // query() en lugar de execute() para evitar el problema de MySQL 5.7
  // con prepared statements binarios en LIMIT/OFFSET.
  // safeLimit y safeOffset son enteros garantizados: sin riesgo de inyección.
  const [rows] = await p.query(
    `SELECT id, name, message,
            DATE_FORMAT(created_at, '%Y-%m-%dT%H:%i:%sZ') AS created_at
     FROM recados
     WHERE visible = 1
     ORDER BY created_at DESC
     LIMIT ${safeLimit} OFFSET ${safeOffset}`,
  )

  console.log(`[DB:getRecados] limit=${safeLimit} offset=${safeOffset} → ${/** @type {any[]} */(rows).length} filas`)
  return /** @type {any[]} */ (rows)
}

/**
 * Cuenta el total de recados visibles (para paginación en el frontend).
 *
 * @param {import('mysql2/promise').Pool} [p]
 * @returns {Promise<number>}
 */
export async function countRecados(p = pool) {
  if (!p) return 0
  const [rows] = await p.query(
    'SELECT COUNT(*) AS total FROM recados WHERE visible = 1',
  )
  const total = Number(/** @type {any[]} */ (rows)[0]?.total ?? 0)
  console.log(`[DB:countRecados] → ${total}`)
  return total
}
