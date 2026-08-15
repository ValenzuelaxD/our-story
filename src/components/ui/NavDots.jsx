import { SLIDE_IDS } from '../../data/constants'

export default function NavDots({ active }) {
  const navigate = (id) => document.getElementById(id)?.scrollIntoView({ behavior: 'smooth' })
  return (
    <nav className="slide-nav" aria-label="Navegación">
      {SLIDE_IDS.map((id, i) => (
        <button
          key={id}
          onClick={() => navigate(id)}
          className={`slide-nav-dot ${active === i ? 'active' : ''}`}
          aria-label={`Slide ${i + 1}`}
        />
      ))}
    </nav>
  )
}