/**
 * Verifica el token en el servidor (el secret nunca va al front).
 * @param {string} token
 * @param {string} secret
 * @param {string} [remoteip]
 */
export async function verifyTurnstile(token, secret, remoteip) {
  const body = new URLSearchParams()
  body.set('secret', secret)
  body.set('response', token)
  if (remoteip) body.set('remoteip', remoteip)

  const res = await fetch('https://challenges.cloudflare.com/turnstile/v0/siteverify', {
    method: 'POST',
    headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
    body,
    signal: AbortSignal.timeout(10_000),
  })

  if (!res.ok) return false
  const data = await res.json()
  return data.success === true
}
