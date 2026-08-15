import { Component } from 'react'

/**
 * Captura erros de renderização dos filhos e exibe um fallback elegante
 * em vez de derrubar o app inteiro.
 */
export default class ErrorBoundary extends Component {
  constructor(props) {
    super(props)
    this.state = { erro: false }
  }

  static getDerivedStateFromError() {
    return { erro: true }
  }

  componentDidCatch(error, info) {
    console.error('[ErrorBoundary]', error, info.componentStack)
  }

  render() {
    if (this.state.erro) {
      return this.props.fallback ?? null
    }
    return this.props.children
  }
}
