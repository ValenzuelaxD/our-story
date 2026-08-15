import nodemailer from 'nodemailer'

function escapeHtml(s) {
  return String(s)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#39;')
}

function asciiSafeSubjectSnippet(s, max = 80) {
  return String(s)
    .replace(/[\r\n]/g, ' ')
    .replace(/[^\x20-\x7E]/g, '?')
    .slice(0, max)
}

/** Primer origen del CORS (sitio público), sin barra final. */
export function firstSiteOriginFromEnv(env) {
  const raw = env.ALLOWED_ORIGINS || ''
  const o = raw.split(',')[0]?.trim().replace(/\/$/, '')
  return o || ''
}

/**
 * @param {{ name: string, email: string, message: string }} payload
 * @param {string} siteOrigin URL base del sitio (p. ej.: https://ejemplo.com)
 * @param {string} [approvalUrl] Enlace de aprobación (generado con HMAC en el servidor)
 */
function buildRecadoHtml({ name, email, message }, siteOrigin, approvalUrl) {
  const coverSrc = siteOrigin ? `${siteOrigin}/imgs/og-share.jpg` : ''
  const nameH = escapeHtml(name)
  const emailH = escapeHtml(email)
  const messageH = escapeHtml(message).replace(/\r\n/g, '\n').replace(/\n/g, '<br />')
  const approvalUrlH = approvalUrl ? escapeHtml(approvalUrl) : ''

  const hero = coverSrc
    ? `<img src="${escapeHtml(coverSrc)}" alt="" width="560" style="display:block;width:100%;max-width:560px;height:auto;border:0;line-height:0;" />`
    : ''

  const approvalBlock = approvalUrlH ? `
          <tr>
            <td style="padding:20px 26px 8px;text-align:center;">
              <div style="height:1px;background:linear-gradient(90deg,transparent,rgba(251,191,36,0.35),transparent);margin:0 0 20px;"></div>
              <p style="margin:0 0 12px;color:#f9a8d4;font-size:11px;font-weight:600;text-transform:uppercase;letter-spacing:0.12em;">Aprobar publicación en el sitio</p>
              <a href="${approvalUrlH}" style="display:inline-block;padding:13px 32px;background:linear-gradient(135deg,#9d174d,#be185d);color:#fff;text-decoration:none;border-radius:14px;font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',Roboto,sans-serif;font-size:14px;font-weight:600;letter-spacing:0.01em;box-shadow:0 4px 16px rgba(190,24,93,0.35);">
                💕 Publicar el mensaje en el sitio
              </a>
              <p style="margin:10px 0 0;color:#8b5a6b;font-size:11px;line-height:1.5;">Al hacer clic, el mensaje aparecerá en el tablero del sitio para que todos lo vean.</p>
            </td>
          </tr>` : ''

  return `<!DOCTYPE html>
<html lang="es">
<head>
  <meta charset="utf-8" />
  <meta name="color-scheme" content="dark light" />
  <meta name="supported-color-schemes" content="dark light" />
  <title>Un mensajito para nosotros</title>
</head>
<body style="margin:0;padding:0;background:linear-gradient(180deg,#1f0f18 0%,#3d1624 45%,#1a0d14 100%);-webkit-text-size-adjust:100%;">
  <table role="presentation" width="100%" cellspacing="0" cellpadding="0" style="background:transparent;">
    <tr>
      <td align="center" style="padding:28px 14px 36px;">
        <!-- tarjeta principal -->
        <table role="presentation" cellspacing="0" cellpadding="0" style="max-width:560px;width:100%;border-radius:24px;overflow:hidden;background:linear-gradient(165deg,#3d1624 0%,#2a121c 50%,#221018 100%);border:1px solid rgba(253,164,175,0.35);box-shadow:0 4px 32px rgba(251,113,133,0.12),0 24px 48px rgba(0,0,0,0.3);">
          <tr>
            <td style="padding:0;line-height:0;overflow:hidden;">
              ${hero}
            </td>
          </tr>
          <tr>
            <td style="padding:26px 26px 6px;text-align:center;font-family:Georgia,'Times New Roman',serif;">
              <p style="margin:0;color:#fecdd3;font-size:13px;letter-spacing:0.02em;">✨ 💌 ✨</p>
              <p style="margin:10px 0 0;color:#fda4af;font-size:11px;letter-spacing:0.18em;text-transform:uppercase;opacity:0.95;">Un rinconcito de nuestro sitio</p>
              <h1 style="margin:12px 0 0;color:#fff5f5;font-size:26px;font-weight:400;line-height:1.35;">Llegó un cariño para nosotros 💕</h1>
              <p style="margin:14px 0 0;color:#fbcfe8;font-size:15px;line-height:1.65;font-style:italic;">Alguien leyó nuestra historia con el corazón y quiso dejar un pedacito de cariño aquí.<br />Guárdalo con cariño: cada palabra es sobre nuestra pareja.</p>
            </td>
          </tr>
          <tr>
            <td style="padding:8px 26px 14px;text-align:center;">
              <span style="display:inline-block;font-size:18px;letter-spacing:0.35em;line-height:1;">🌹 💕 🌹</span>
            </td>
          </tr>
          <tr>
            <td style="padding:0 26px 10px;">
              <div style="height:1px;background:linear-gradient(90deg,transparent,rgba(251,191,36,0.45),rgba(252,211,77,0.35),rgba(251,191,36,0.45),transparent);"></div>
            </td>
          </tr>
          <tr>
            <td style="padding:10px 26px 6px;font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',Roboto,sans-serif;">
              <p style="margin:0 0 8px;color:#f9a8d4;font-size:11px;font-weight:600;text-transform:uppercase;letter-spacing:0.12em;">Quién lo envió con cariño</p>
              <p style="margin:0 0 22px;color:#ffe4e6;font-size:17px;line-height:1.45;font-weight:500;">${nameH}</p>
              <p style="margin:0 0 8px;color:#f9a8d4;font-size:11px;font-weight:600;text-transform:uppercase;letter-spacing:0.12em;">Para responder</p>
              <p style="margin:0 0 22px;">
                <a href="mailto:${emailH}" style="color:#fde68a;text-decoration:none;font-size:15px;border-bottom:1px solid rgba(253,230,138,0.5);">${emailH}</a>
              </p>
              <p style="margin:0 0 10px;color:#f9a8d4;font-size:11px;font-weight:600;text-transform:uppercase;letter-spacing:0.12em;">Lo que esta persona quiso decir</p>
              <div style="margin:0;padding:20px 22px;background:rgba(255,228,230,0.06);border-radius:16px;border:1px solid rgba(251,113,133,0.22);color:#fce7f3;font-size:15px;line-height:1.72;box-shadow:inset 0 1px 0 rgba(255,255,255,0.04);">${messageH}</div>
            </td>
          </tr>
          <tr>
            <td style="padding:22px 26px 26px;text-align:center;">
              <div style="height:1px;background:linear-gradient(90deg,transparent,rgba(251,191,36,0.3),transparent);margin:0 0 18px;"></div>
              <p style="margin:0 0 8px;color:#e9b4c0;font-size:14px;line-height:1.55;font-family:Georgia,'Times New Roman',serif;font-style:italic;">Si quieres agradecer, solo responde a este e-mail: el mensaje vuelve directo a quien lo envió.</p>
              <p style="margin:16px 0 0;color:#fda4af;font-size:13px;line-height:1.5;font-family:Georgia,'Times New Roman',serif;">Con todo mi amor,<br /><span style="color:#fff7f7;">Davi</span> <span style="font-size:11px;opacity:0.85;">💕</span></p>
            </td>
          </tr>
          ${approvalBlock}
        </table>
        <p style="margin:22px 20px 0;max-width:520px;color:#8b5a6b;font-size:11px;line-height:1.55;font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',Roboto,sans-serif;text-align:center;">Este e-mail fue generado con cariño por el formulario de nuestro sitio. Es solo entre nosotros: trata el mensaje y los datos de quien lo escribió con delicadeza.</p>
      </td>
    </tr>
  </table>
</body>
</html>`
}

/**
 * @param {import('nodemailer').Transporter} transporter
 * @param {{ name: string, email: string, message: string }} payload
 * @param {{ from: string, to: string }} cfg
 * @param {{ siteOrigin?: string, approvalUrl?: string }} opts
 */
export async function sendRecadoMail(transporter, { name, email, message }, { from, to }, opts = {}) {
  const siteOrigin = opts.siteOrigin || ''
  const approvalUrl = opts.approvalUrl || ''
  const subject = `💌 Mensajito para nuestro rinconcito · ${asciiSafeSubjectSnippet(name)}`
  const approvalLine = approvalUrl ? `\n\n── Aprobar publicación en el sitio ──\n${approvalUrl}\n` : ''
  const text = `Hola, amores: llegó un mensajito a nuestro sitio.\n\nDe: ${name}\nE-mail (para responder): ${email}\n\n---\n\n${message}\n\n---${approvalLine}\nCon amor,\n(el sitio que Davi hizo con cariño para nosotros)\n`
  const html = buildRecadoHtml({ name, email, message }, siteOrigin, approvalUrl)

  await transporter.sendMail({
    from,
    to,
    replyTo: email,
    subject,
    text,
    html,
  })
}

/**
 * Crea un transporte SMTP con TLS mínimo 1.2.
 * @param {NodeJS.ProcessEnv} env
 */
export function createMailTransport(env) {
  const host = env.MAIL_SERVER
  const port = parseInt(env.MAIL_PORT || '587', 10)
  const user = env.MAIL_USERNAME
  const pass = env.MAIL_PASSWORD

  if (!host || !user || pass === undefined || pass === '') {
    return null
  }

  return nodemailer.createTransport({
    host,
    port,
    secure: port === 465,
    auth: { user, pass },
    tls: { minVersion: 'TLSv1.2' },
  })
}
