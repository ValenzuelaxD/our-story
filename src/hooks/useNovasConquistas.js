import { useState, useEffect } from 'react'
import { CONQUISTAS } from '../data/constants'

const LS_KEY = 'conquistas-vistas-v1'

/**
 * Detecta conquistas desbloqueadas que el usuario aún no ha visto.
 * Compara CONQUISTAS con la lista guardada en localStorage.
 * Devuelve la próxima de la fila y una función para marcarla como vista.
 */
export function useNovasConquistas() {
  const [fila, setFila] = useState([])

  useEffect(() => {
    // Pequeño retraso para no competir con la animación de la LandingPage
    const t = setTimeout(() => {
      const raw = localStorage.getItem(LS_KEY)

      // Primera visita: marca todas las conquistas desbloqueadas como ya vistas
      // silenciosamente — las notificaciones solo aparecen para conquistas añadidas después.
      if (raw === null) {
        const todas = CONQUISTAS.filter(c => c.desbloqueada).map(c => c.id)
        localStorage.setItem(LS_KEY, JSON.stringify(todas))
        return
      }

      const vistas = JSON.parse(raw)
      const novas = CONQUISTAS.filter(c => c.desbloqueada && !vistas.includes(c.id))
      setFila(novas)
    }, 800)
    return () => clearTimeout(t)
  }, [])

  function marcarVista(id) {
    const vistas = JSON.parse(localStorage.getItem(LS_KEY) ?? '[]')
    if (!vistas.includes(id)) {
      localStorage.setItem(LS_KEY, JSON.stringify([...vistas, id]))
    }
    setFila(prev => prev.filter(c => c.id !== id))
  }

  return {
    proxima: fila[0] ?? null,
    restantes: Math.max(0, fila.length - 1),
    marcarVista,
  }
}
