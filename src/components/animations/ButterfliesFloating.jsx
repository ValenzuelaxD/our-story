export default function ButterfliesFloating({ isMobile }) {
  const all = [
    { l: '5%', d: '-18s', dur: 22 }, { l: '20%', d: '-8s', dur: 18 },
    { l: '38%', d: '-25s', dur: 24 }, { l: '55%', d: '-3s', dur: 20 },
    { l: '72%', d: '-14s', dur: 19 }, { l: '88%', d: '-22s', dur: 23 },
  ]
  const visible = isMobile ? all.slice(0, 3) : all
  return (
    <div className="butterflies-float fixed inset-0 pointer-events-none z-[1]" aria-hidden style={{ overflow: 'hidden' }}>
      {visible.map((b, i) => (
        <span key={i} style={{ left: b.l, top: '-20px', fontSize: i % 2 === 0 ? '1rem' : '1.2rem', animationDelay: b.d, animationDuration: `${b.dur}s` }}>🦋</span>
      ))}
    </div>
  )
}