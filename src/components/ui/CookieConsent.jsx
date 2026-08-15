import { useEffect, useState } from 'react'

const STORAGE_KEY = 'ourstory-analytics-consent'

function loadGtag(measurementId) {
  if (typeof window === 'undefined' || window.gtag) return
  window.dataLayer = window.dataLayer || []
  window.gtag = function gtag() {
    window.dataLayer.push(arguments)
  }
  window.gtag('js', new Date())
  window.gtag('config', measurementId)

  const script = document.createElement('script')
  script.async = true
  script.src = `https://www.googletagmanager.com/gtag/js?id=${measurementId}`
  document.head.appendChild(script)
}

/**
 * Solo renderiza si `VITE_GA_MEASUREMENT_ID` está definido.
 * El script de medición solo carga después de que el visitante acepte.
 */
export default function CookieConsent() {
  const gaId = import.meta.env.VITE_GA_MEASUREMENT_ID
  const [show, setShow] = useState(() => {
    if (!gaId) return false
    try {
      return localStorage.getItem(STORAGE_KEY) !== 'granted'
    } catch {
      return true
    }
  })

  useEffect(() => {
    if (!gaId) return
    try {
      if (localStorage.getItem(STORAGE_KEY) === 'granted') {
        loadGtag(gaId)
      }
    } catch {
      /* almacenamiento no disponible */
    }
  }, [gaId])

  if (!gaId || !show) return null

  const accept = () => {
    try {
      localStorage.setItem(STORAGE_KEY, 'granted')
    } catch {
      /* ignorar */
    }
    loadGtag(gaId)
    setShow(false)
  }

  return (
    <div
      className="fixed bottom-0 left-0 right-0 z-[120] px-4 pb-[max(1rem,env(safe-area-inset-bottom))] pt-2 pointer-events-none"
      role="dialog"
      aria-labelledby="cookie-consent-title"
      aria-live="polite"
    >
      <div className="pointer-events-auto mx-auto max-w-lg rounded-2xl border border-white/15 bg-[#2a1520]/95 px-4 py-3 shadow-lg shadow-black/40 backdrop-blur-md">
        <p id="cookie-consent-title" className="text-[13px] leading-snug text-rose-100/90">
          Usamos cookies de terceros para medir visitas de forma agregada y mejorar el sitio. Al aceptar,
          aceptas este uso.{' '}
          <a
            href="https://policies.google.com/privacy"
            target="_blank"
            rel="noopener noreferrer"
            className="text-amber-300/90 underline underline-offset-2 hover:text-amber-200"
          >
            Privacidad
          </a>
        </p>
        <div className="mt-3 flex justify-end">
          <button
            type="button"
            onClick={accept}
            className="rounded-xl bg-rose-500/90 px-4 py-2 text-sm font-medium text-white shadow-sm transition hover:bg-rose-400/90 focus:outline-none focus:ring-2 focus:ring-amber-400/60"
          >
            Aceptar
          </button>
        </div>
      </div>
    </div>
  )
}
