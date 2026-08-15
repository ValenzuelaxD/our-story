import { useRef, useState } from 'react'
import { Turnstile } from '@marsidev/react-turnstile'

const apiUrl = import.meta.env.VITE_RECADOS_API_URL
const siteKey = import.meta.env.VITE_TURNSTILE_SITE_KEY

export default function RecadoForm({ onSuccess }) {
  const turnstileRef = useRef(null)
  const [token, setToken] = useState(null)
  const [name, setName] = useState('')
  const [email, setEmail] = useState('')
  const [message, setMessage] = useState('')
  const [status, setStatus] = useState('idle')
  const [feedback, setFeedback] = useState(null)

  const configured = Boolean(apiUrl && siteKey)

  async function handleSubmit(e) {
    e.preventDefault()
    if (!configured || status === 'sending') return
    setFeedback(null)

    if (!token) {
      setFeedback({ type: 'err', text: 'Confirma el captcha antes de enviar.' })
      return
    }

    setStatus('sending')
    try {
      const res = await fetch(apiUrl, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: name.trim(),
          email: email.trim(),
          message: message.trim(),
          turnstileToken: token,
        }),
      })
      const data = await res.json().catch(() => ({}))

      if (!res.ok) {
        const map = {
          captcha_failed: 'Captcha inválido. Inténtalo de nuevo.',
          rate_limited: 'Demasiados intentos. Espera un poco e inténtalo de nuevo.',
          invalid_name: 'Verifica el nombre.',
          invalid_email: 'Verifica el e-mail.',
          invalid_message: 'Escribe un mensaje (no muy largo).',
          service_unavailable: 'Servicio temporalmente no disponible. Inténtalo más tarde.',
        }
        setFeedback({
          type: 'err',
          text: map[data.error] || 'Algo salió mal. Inténtalo de nuevo.',
        })
        turnstileRef.current?.reset()
        setToken(null)
        setStatus('idle')
        return
      }

      setFeedback({ type: 'ok', text: 'Recibimos tu mensaje. ¡Gracias por el cariño!' })
      setName('')
      setEmail('')
      setMessage('')
      turnstileRef.current?.reset()
      setToken(null)
      setStatus('idle')
      onSuccess?.()
    } catch {
      setFeedback({ type: 'err', text: 'Sin conexión o servidor fuera de línea. Inténtalo de nuevo.' })
      turnstileRef.current?.reset()
      setToken(null)
      setStatus('idle')
    }
  }

  if (!configured) {
    return (
      <p className="text-rose-200/70 text-sm text-center max-w-md mx-auto">
        El formulario de mensajes se activará pronto. (Configura{' '}
        <code className="text-rose-300/90 text-xs">VITE_RECADOS_API_URL</code> y{' '}
        <code className="text-rose-300/90 text-xs">VITE_TURNSTILE_SITE_KEY</code> en el entorno de build.)
      </p>
    )
  }

  return (
    <form onSubmit={handleSubmit} className="w-full max-w-md mx-auto space-y-4 text-left">
      <div>
        <label htmlFor="recado-nome" className="block text-rose-200/90 text-sm font-medium mb-1">
          Nombre
        </label>
        <input
          id="recado-nome"
          name="name"
          type="text"
          autoComplete="name"
          maxLength={120}
          required
          value={name}
          onChange={(e) => setName(e.target.value)}
          className="w-full rounded-lg border border-rose-400/25 bg-rose-950/40 px-3 py-2 text-rose-50 placeholder:text-rose-400/40 focus:outline-none focus:ring-2 focus:ring-amber-400/40"
          placeholder="¿Cómo podemos llamarte?"
        />
      </div>
      <div>
        <label htmlFor="recado-email" className="block text-rose-200/90 text-sm font-medium mb-1">
          E-mail
        </label>
        <input
          id="recado-email"
          name="email"
          type="email"
          autoComplete="email"
          maxLength={254}
          required
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          className="w-full rounded-lg border border-rose-400/25 bg-rose-950/40 px-3 py-2 text-rose-50 placeholder:text-rose-400/40 focus:outline-none focus:ring-2 focus:ring-amber-400/40"
          placeholder="para poder responderte"
        />
      </div>
      <div>
        <label htmlFor="recado-msg" className="block text-rose-200/90 text-sm font-medium mb-1">
          Mensaje
        </label>
        <textarea
          id="recado-msg"
          name="message"
          required
          rows={5}
          maxLength={4000}
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          className="w-full rounded-lg border border-rose-400/25 bg-rose-950/40 px-3 py-2 text-rose-50 placeholder:text-rose-400/40 focus:outline-none focus:ring-2 focus:ring-amber-400/40 resize-y min-h-[120px]"
          placeholder="Un mensaje, un deseo de felicidades…"
        />
      </div>

      <div className="flex justify-center py-1">
        <Turnstile
          ref={turnstileRef}
          siteKey={siteKey}
          onSuccess={setToken}
          onExpire={() => setToken(null)}
          onError={() => setToken(null)}
          options={{ theme: 'dark' }}
        />
      </div>

      {feedback && (
        <p
          role="alert"
          className={
            feedback.type === 'ok'
              ? 'text-emerald-300/90 text-sm text-center'
              : 'text-amber-200 text-sm text-center'
          }
        >
          {feedback.text}
        </p>
      )}

      <button
        type="submit"
        disabled={status === 'sending'}
        className="w-full rounded-xl bg-gradient-to-r from-rose-600/90 to-amber-700/80 text-rose-50 font-semibold py-3 px-4 shadow-lg shadow-rose-900/30 hover:from-rose-500/90 hover:to-amber-600/80 disabled:opacity-50 disabled:pointer-events-none transition-all"
      >
        {status === 'sending' ? 'Enviando…' : 'Enviar mensaje'}
      </button>

      <p className="text-rose-400/50 text-[11px] text-center leading-relaxed">
        Tu nombre y mensaje quedan visibles en el tablero de arriba. El e-mail es privado y nunca se muestra. Protegido por Cloudflare Turnstile.
      </p>
    </form>
  )
}
