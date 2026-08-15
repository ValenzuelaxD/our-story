import express from 'express'
import helmet from 'helmet'
import cors from 'cors'
import rateLimit from 'express-rate-limit'
import { createHash, createHmac, timingSafeEqual } from 'node:crypto'
import { dirname, join } from 'node:path'
import { fileURLToPath } from 'node:url'

import { validateRecado } from './validate.js'
import { verifyTurnstile } from './turnstile.js'
import { createMailTransport, sendRecadoMail, firstSiteOriginFromEnv } from './mail.js'
import { sanitizeText, sanitizeLine } from './sanitize.js'
import { createPool, initDb, saveRecado, approveRecado, getRecados, countRecados, getContenido, saveContenido } from './db.js'

const __dirname = dirname(fileURLToPath(import.meta.url))
const PUBLIC_DIR = join(__dirname, '..', 'public')

/**
 * Genera un hash del IP para almacenamiento: nunca almacena el IP crudo.
 * Con IP_HASH_SECRET usa HMAC-SHA256 (irreversible incluso con rainbow tables).
 */
function hashIp(ip, secret) {
  if (!ip) return ''
  return secret
    ? createHmac('sha256', secret).update(ip).digest('hex')
    : createHash('sha256').update(ip).digest('hex')
}

/**
 * Genera un token de aprobación único por recado: HMAC-SHA256(secret, id) → hex de 64 caracteres.
 * Aunque alguien intercepte el enlace de un recado, no puede aprobar otro.
 */
function approvalToken(id, secret) {
  return createHmac('sha256', secret).update(String(id)).digest('hex')
}

/** Comparación timing-safe para evitar ataques de temporización en la validación del token. */
function tokenEqual(a, b) {
  try {
    const ba = Buffer.from(String(a))
    const bb = Buffer.from(String(b))
    if (ba.length !== bb.length) return false
    return timingSafeEqual(ba, bb)
  } catch {
    return false
  }
}

/**
 * Valida el header Authorization tipo "Bearer <token>" contra ADMIN_TOKEN.
 * Comparación timing-safe: sin leak por temporización.
 */
function bearerOk(authHeader, adminToken) {
  if (!adminToken) return false
  const m = /^Bearer\s+(.+)$/.exec(String(authHeader || '').trim())
  if (!m) return false
  return tokenEqual(m[1], adminToken)
}

/**
 * Dispara el rebuild del sitio tras un PUT de contenido: llama al workflow
 * deploy.yml del repo vía GitHub Actions API (workflow_dispatch).
 * Requiere GITHUB_TOKEN (PAT con scope "workflow") y GITHUB_REPO ("owner/repo").
 */
async function dispatchRebuild(env) {
  const token = env.GITHUB_TOKEN
  const repo = env.GITHUB_REPO
  if (!token || !repo) {
    console.warn('[contenido:rebuild] sin GITHUB_TOKEN/GITHUB_REPO: el sitio se actualizará en el próximo deploy')
    return false
  }

  const url = `https://api.github.com/repos/${repo}/actions/workflows/deploy.yml/dispatches`
  try {
    const r = await fetch(url, {
      method: 'POST',
      headers: {
        authorization: `Bearer ${token}`,
        'content-type': 'application/json',
        'user-agent': 'our-story-api',
      },
      body: JSON.stringify({ ref: 'main' }),
      signal: AbortSignal.timeout(15_000),
    })
    if (!r.ok) {
      console.warn(`[contenido:rebuild] GitHub respondió ${r.status} ${r.statusText}`)
      return false
    }
    console.log('[contenido:rebuild] workflow deploy.yml disparado')
    return true
  } catch (e) {
    console.warn('[contenido:rebuild] fallo al disparar:', e instanceof Error ? e.message : 'unknown')
    return false
  }
}

/** Construye la URL completa del endpoint de aprobación. */
function buildApprovalUrl(id, secret, apiBase) {
  if (!id || !secret || !apiBase) return ''
  const token = approvalToken(id, secret)
  return `${apiBase.replace(/\/$/, '')}/api/recados/approve?id=${id}&token=${token}`
}

/** Página HTML de respuesta al hacer clic en el enlace de aprobación. */
function approvePageHtml(state, siteOrigin) {
  const site = siteOrigin || 'http://66.179.211.195'
  const content = {
    success: { icon: '💕', title: '¡Recado publicado!', msg: 'Ya está visible en el tablero del sitio.' },
    invalid: { icon: '🚫', title: 'Enlace inválido', msg: 'Este enlace de aprobación es inválido o ya fue utilizado.' },
    error:   { icon: '⚠️', title: 'Algo salió mal', msg: 'No fue posible publicar ahora. Inténtalo de nuevo.' },
  }[state] ?? { icon: '⚠️', title: 'Error', msg: '' }

  const metaRefresh = state === 'success'
    ? `<meta http-equiv="refresh" content="5;url=${site}">`
    : ''
  const footer = state === 'success'
    ? `<p class="sub">Redirigiendo al sitio en 5 segundos…<br><a href="${site}">Ir ahora</a></p>`
    : `<p class="sub"><a href="${site}">Volver al sitio</a></p>`

  return `<!DOCTYPE html>
<html lang="es">
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width,initial-scale=1">
  ${metaRefresh}
  <title>${content.title} · Nuestra Historia</title>
  <style>
    *{box-sizing:border-box;margin:0;padding:0}
    body{min-height:100dvh;display:flex;align-items:center;justify-content:center;
         background:linear-gradient(155deg,#3e0e2e 0%,#5c1645 50%,#2a0820 100%);
         font-family:system-ui,-apple-system,sans-serif;padding:1.25rem}
    .card{text-align:center;padding:2.75rem 2rem 2.25rem;max-width:360px;width:100%;
          background:rgba(55,25,42,0.90);border-radius:22px;
          border:1px solid rgba(212,175,55,0.28);
          box-shadow:0 8px 40px rgba(0,0,0,0.45)}
    .icon{font-size:3rem;line-height:1;margin-bottom:.85rem}
    h1{color:#fff5f5;font-size:1.3rem;font-weight:500;margin-bottom:.6rem}
    p{color:#fbcfe8;font-size:.9rem;line-height:1.65}
    .sub{margin-top:1.6rem;font-size:.78rem;color:#fda4af;opacity:.7}
    a{color:#fde68a;text-underline-offset:3px}
  </style>
</head>
<body>
  <div class="card">
    <div class="icon">${content.icon}</div>
    <h1>${content.title}</h1>
    <p>${content.msg}</p>
    ${footer}
  </div>
</body>
</html>`
}

const PORT = parseInt(process.env.PORT || '7000', 10)
const IS_PROD = process.env.NODE_ENV === 'production'

function parseOrigins(raw) {
  if (!raw || typeof raw !== 'string') return []
  return raw
    .split(',')
    .map((o) => o.trim().replace(/\/$/, ''))
    .filter(Boolean)
}

function requiredEnv(name) {
  const v = process.env[name]
  if (v === undefined || v === '') return null
  return v
}

function assertConfigOrExit() {
  if (!IS_PROD) return

  const missing = []
  if (!requiredEnv('TURNSTILE_SECRET_KEY')) missing.push('TURNSTILE_SECRET_KEY')
  if (!requiredEnv('MAIL_SERVER')) missing.push('MAIL_SERVER')
  if (!requiredEnv('MAIL_USERNAME')) missing.push('MAIL_USERNAME')
  if (requiredEnv('MAIL_PASSWORD') === null) missing.push('MAIL_PASSWORD')
  if (parseOrigins(process.env.ALLOWED_ORIGINS || '').length === 0) {
    missing.push('ALLOWED_ORIGINS')
  }

  if (missing.length) {
    console.error('[FATAL] Variables obligatorias en producción:', missing.join(', '))
    process.exit(1)
  }
}

assertConfigOrExit()

// -- DB (opcional: degradación elegante si no está configurado) --
const dbPool = createPool(process.env)
if (!dbPool) {
  console.warn('[DB] Variables DB_HOST / DB_USER / DB_NAME ausentes: persistencia desactivada.')
}

const app = express()

if (process.env.TRUST_PROXY === '1') {
  app.set('trust proxy', 1)
}

app.disable('x-powered-by')
app.use(helmet())

const jsonLimit = process.env.JSON_BODY_LIMIT || '2mb'
app.use(express.json({ limit: jsonLimit }))

const allowedOrigins = parseOrigins(process.env.ALLOWED_ORIGINS || '')

app.use(
  cors({
    origin(origin, callback) {
      if (!origin) {
        if (IS_PROD) return callback(null, false)
        return callback(null, true)
      }
      if (allowedOrigins.length === 0 && !IS_PROD) {
        return callback(null, true)
      }
      if (allowedOrigins.includes(origin)) return callback(null, true)
      return callback(null, false)
    },
    methods: ['GET', 'POST', 'PUT', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization'],
    maxAge: 86400,
  }),
)

const recadosLimiter = rateLimit({
  windowMs: 60 * 60 * 1000,
  max: IS_PROD ? 15 : 100,
  message: { error: 'rate_limited' },
  standardHeaders: true,
  legacyHeaders: false,
  ...(process.env.TRUST_PROXY === '1' ? { validate: { trustProxy: true } } : {}),
})

const listLimiter = rateLimit({
  windowMs: 60 * 1000,
  max: IS_PROD ? 60 : 300,
  message: { error: 'rate_limited' },
  standardHeaders: true,
  legacyHeaders: false,
  ...(process.env.TRUST_PROXY === '1' ? { validate: { trustProxy: true } } : {}),
})

const mailTransport = createMailTransport(process.env)
const mailFrom = requiredEnv('MAIL_FROM') || requiredEnv('MAIL_USERNAME') || ''
const mailTo = requiredEnv('MAIL_TO') || requiredEnv('MAIL_USERNAME') || ''

app.get('/health', (_req, res) => {
  res.status(200).json({ ok: true, ts: Date.now() })
})

// Diagnóstico temporal: eliminar tras confirmar la causa raíz
app.get('/health/db', async (_req, res) => {
  if (!dbPool) return res.json({ pool: null })
  try {
    const [[info]] = await dbPool.query('SELECT DATABASE() AS db, VERSION() AS ver')
    const [[allRows]] = await dbPool.query('SELECT COUNT(*) AS n FROM recados')
    const [[visRows]] = await dbPool.query('SELECT COUNT(*) AS n FROM recados WHERE visible = 1')
    return res.json({ db: info.db, ver: info.ver, total: Number(allRows.n), visible: Number(visRows.n) })
  } catch (e) {
    return res.json({ error: e instanceof Error ? e.message : String(e) })
  }
})

/**
 * Los errores de servidor (5xx) nunca exponen detalles internos.
 * El motivo real queda solo en los logs del proceso.
 */
function serverErr(res, status, logMsg) {
  if (logMsg) console.error(logMsg)
  return res.status(status).json({ error: 'service_unavailable' })
}

// GET /api/recados - lista pública de recados (sin e-mail)
app.get('/api/recados', listLimiter, async (req, res) => {
  // Si la base de datos no está configurada, devuelve una lista vacía sin revelar el motivo
  if (!dbPool) {
    return res.status(200).json({ ok: true, recados: [], total: 0, limit: 50, offset: 0 })
  }

  const limit = Math.min(Math.max(1, parseInt(String(req.query.limit || '50'), 10) || 50), 100)
  const offset = Math.max(0, parseInt(String(req.query.offset || '0'), 10) || 0)

  try {
    const [recados, total] = await Promise.all([
      getRecados({ limit, offset }, dbPool),
      countRecados(dbPool),
    ])
    res.set('Cache-Control', 'no-store')
    return res.status(200).json({ ok: true, recados, total, limit, offset })
  } catch (e) {
    return serverErr(res, 500, `[recados:list] ${e instanceof Error ? e.message : 'unknown'}`)
  }
})

// GET /api/recados/approve - aprobación vía enlace del e-mail (devuelve HTML, no JSON)
app.get('/api/recados/approve', async (req, res) => {
  const siteOrigin = firstSiteOriginFromEnv(process.env)
  const secret = process.env.APPROVE_SECRET

  if (!secret || !dbPool) {
    return res.status(503).set('Content-Type', 'text/html; charset=utf-8').send(approvePageHtml('error', siteOrigin))
  }

  const rawId = req.query.id
  const rawToken = req.query.token

  if (!rawId || !rawToken) {
    return res.status(400).set('Content-Type', 'text/html; charset=utf-8').send(approvePageHtml('invalid', siteOrigin))
  }

  const id = parseInt(String(rawId), 10)
  if (!id || id <= 0) {
    return res.status(400).set('Content-Type', 'text/html; charset=utf-8').send(approvePageHtml('invalid', siteOrigin))
  }

  const expected = approvalToken(id, secret)
  if (!tokenEqual(String(rawToken), expected)) {
    return res.status(403).set('Content-Type', 'text/html; charset=utf-8').send(approvePageHtml('invalid', siteOrigin))
  }

  try {
    await approveRecado(id, dbPool)
    return res.set('Content-Type', 'text/html; charset=utf-8').send(approvePageHtml('success', siteOrigin))
  } catch (e) {
    console.error(`[approve] fallo al publicar id=${id}:`, e instanceof Error ? e.message : 'unknown')
    return res.status(500).set('Content-Type', 'text/html; charset=utf-8').send(approvePageHtml('error', siteOrigin))
  }
})

// GET /api/contenido - contenido editable guardado (lo consume fetch-contenido.mjs en el build).
// Si la tabla está vacía devuelve content:null y el build usa el JSON del repo como seed/fallback.
app.get('/api/contenido', async (_req, res) => {
  if (!dbPool) return res.status(200).json({ ok: true, content: null })

  try {
    const data = await getContenido(dbPool)
    res.set('Cache-Control', 'no-store')
    return res.status(200).json({
      ok: true,
      content: data?.content ?? null,
      updated_at: data?.updated_at ?? null,
    })
  } catch (e) {
    return serverErr(res, 500, `[contenido:get] ${e instanceof Error ? e.message : 'unknown'}`)
  }
})

// PUT /api/contenido - guarda el contenido completo (auth Bearer ADMIN_TOKEN)
// y dispara el rebuild del sitio vía workflow_dispatch.
app.put('/api/contenido', async (req, res) => {
  const adminToken = process.env.ADMIN_TOKEN
  if (!adminToken) {
    return serverErr(res, 503, '[contenido:put] ADMIN_TOKEN ausente')
  }
  if (!dbPool) {
    return serverErr(res, 503, '[contenido:put] DB no configurada')
  }
  if (!bearerOk(req.get('authorization'), adminToken)) {
    return res.status(401).json({ error: 'unauthorized' })
  }

  const body = req.body
  if (!body || typeof body !== 'object' || Array.isArray(body)) {
    return res.status(400).json({ error: 'invalid_body' })
  }
  if (!body.texto && !body.identidad) {
    return res.status(400).json({ error: 'invalid_body' })
  }

  try {
    await saveContenido(body, dbPool)
  } catch (e) {
    return serverErr(res, 500, `[contenido:put] ${e instanceof Error ? e.message : 'unknown'}`)
  }

  const dispatched = await dispatchRebuild(process.env)
  return res.status(200).json({ ok: true, rebuild_dispatched: dispatched })
})

// POST /api/recados - envío de recado (guarda en DB → envía e-mail con enlace de aprobación)
app.post('/api/recados', recadosLimiter, async (req, res) => {
  const secret = process.env.TURNSTILE_SECRET_KEY

  if (!secret) {
    return serverErr(res, 503, '[recados:post] TURNSTILE_SECRET_KEY ausente')
  }

  if (!mailTransport || !mailFrom || !mailTo) {
    return serverErr(res, 503, '[recados:post] transporte de correo no configurado')
  }

  const v = validateRecado(req.body)
  if (!v.ok) {
    return res.status(400).json({ error: v.code })
  }

  // Sanitización anti-XSS: ejecutada tras la validación de tamaño/formato
  const name = sanitizeLine(v.name)
  const email = sanitizeLine(v.email)
  const message = sanitizeText(v.message)

  // Revalida tras la sanitización (las tags eliminadas pueden vaciar el campo)
  if (!name) return res.status(400).json({ error: 'invalid_name' })
  if (!message) return res.status(400).json({ error: 'invalid_message' })

  const ip =
    req.ip ||
    req.headers['x-forwarded-for']?.toString().split(',')[0]?.trim() ||
    req.socket?.remoteAddress ||
    ''

  let captchaOk
  try {
    captchaOk = await verifyTurnstile(v.turnstileToken, secret, ip)
  } catch (e) {
    return serverErr(res, 502, `[recados:captcha] verificación falló: ${e instanceof Error ? e.message : 'unknown'}`)
  }

  if (!captchaOk) {
    return res.status(400).json({ error: 'captcha_failed' })
  }

  // 1. Guarda en la base de datos primero (visible=0) para obtener el ID y generar el enlace de aprobación
  let insertedId = null
  if (dbPool) {
    try {
      const ipHash = hashIp(ip, process.env.IP_HASH_SECRET || '')
      insertedId = await saveRecado({ name, email, message, ipHash }, dbPool)
    } catch (e) {
      console.error(`[recados:db] fallo al guardar: ${e instanceof Error ? e.message : 'unknown'}`)
      // Continúa: el e-mail se envía incluso sin persistencia
    }
  }

  // 2. Construye el enlace de aprobación (solo si hay ID + secrets configurados)
  const approvalUrl = buildApprovalUrl(
    insertedId,
    process.env.APPROVE_SECRET || '',
    process.env.API_BASE_URL || '',
  )

  // 3. Envía el e-mail con el botón de aprobación
  try {
    await sendRecadoMail(
      mailTransport,
      { name, email, message },
      { from: mailFrom, to: mailTo },
      { siteOrigin: firstSiteOriginFromEnv(process.env), approvalUrl },
    )
  } catch (e) {
    return serverErr(res, 502, `[recados:mail] envío falló: ${e instanceof Error ? e.message : 'unknown'}`)
  }

  return res.status(200).json({ ok: true })
})

// Panel de administración (Fase 3): estático servido por la propia API en /admin.
// La CSP de helmet por defecto bloquea los scripts y fuerza HTTPS (upgrade-insecure-requests);
// aquí se sobrescribe para el panel: permisiva solo con lo que el panel necesita.
const ADMIN_CSP = [
  "default-src 'self'",
  "base-uri 'self'",
  "font-src 'self' https: data:",
  "form-action 'self'",
  "frame-ancestors 'self'",
  "img-src 'self' data:",
  "object-src 'none'",
  "script-src 'self'",
  "script-src-attr 'none'",
  "style-src 'self' https: 'unsafe-inline'",
  "connect-src 'self' https://raw.githubusercontent.com",
].join('; ')
app.use('/admin', (_req, res, next) => {
  res.setHeader('Content-Security-Policy', ADMIN_CSP)
  next()
})
app.use('/admin', express.static(PUBLIC_DIR, { index: 'admin.html' }))

app.use((_req, res) => {
  res.status(404).end()
})

app.use((err, _req, res, _next) => {
  console.error('[unhandled]', err)
  res.status(500).json({ error: 'service_unavailable' })
})

app.listen(PORT, '0.0.0.0', async () => {
  if (dbPool) {
    try {
      await initDb(dbPool)
      console.log('[DB] Tablas recados y contenido listas.')
    } catch (e) {
      console.error('[DB] Fallo al inicializar las tablas:', e instanceof Error ? e.message : 'unknown')
    }
  }
  console.log(`our-story-api listening on :${PORT}`)
})
