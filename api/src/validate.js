const MAX_NAME = 120
const MAX_EMAIL = 254
const MAX_MESSAGE = 4000
const MAX_TOKEN = 2048

/**
 * @param {unknown} body
 * @returns {{ ok: true, name: string, email: string, message: string, turnstileToken: string } | { ok: false, code: string }}
 */
export function validateRecado(body) {
  if (!body || typeof body !== 'object') return { ok: false, code: 'invalid_json' }

  const name = typeof body.name === 'string' ? body.name.trim() : ''
  const email = typeof body.email === 'string' ? body.email.trim() : ''
  const message = typeof body.message === 'string' ? body.message.trim() : ''
  const turnstileToken =
    typeof body.turnstileToken === 'string' ? body.turnstileToken.trim() : ''

  if (!name || name.length > MAX_NAME) return { ok: false, code: 'invalid_name' }
  if (!email || email.length > MAX_EMAIL) return { ok: false, code: 'invalid_email' }
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) return { ok: false, code: 'invalid_email' }
  if (!message || message.length > MAX_MESSAGE) return { ok: false, code: 'invalid_message' }
  if (!turnstileToken || turnstileToken.length > MAX_TOKEN) return { ok: false, code: 'captcha_required' }

  return { ok: true, name, email, message, turnstileToken }
}
