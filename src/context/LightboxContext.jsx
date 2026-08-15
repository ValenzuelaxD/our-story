import { createContext, useContext, useState, useCallback } from 'react'

const Ctx = createContext(null)

export function LightboxProvider({ children }) {
  const [state, setState] = useState({ aberto: false, fotos: [], idx: 0 })

  const abrir = useCallback((fotos, idx = 0) => {
    setState({ aberto: true, fotos, idx })
  }, [])

  const fechar = useCallback(() => {
    setState(s => ({ ...s, aberto: false }))
  }, [])

  const avancar = useCallback(() => {
    setState(s => ({ ...s, idx: (s.idx + 1) % s.fotos.length }))
  }, [])

  const voltar = useCallback(() => {
    setState(s => ({ ...s, idx: (s.idx - 1 + s.fotos.length) % s.fotos.length }))
  }, [])

  const irPara = useCallback((idx) => {
    setState(s => ({ ...s, idx }))
  }, [])

  return (
    <Ctx.Provider value={{ ...state, abrir, fechar, avancar, voltar, irPara }}>
      {children}
    </Ctx.Provider>
  )
}

export const useLightbox = () => useContext(Ctx)
