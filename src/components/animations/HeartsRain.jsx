export default function HeartsRain() {
  const items = [
    { e: '❤️', l: '5%', d: '-4.5s', dur: 5 }, { e: '🦋', l: '12%', d: '-2s', dur: 7 },
    { e: '💕', l: '22%', d: '-3.2s', dur: 5.5 }, { e: '💗', l: '32%', d: '-1.8s', dur: 4.5 },
    { e: '🦋', l: '42%', d: '-5s', dur: 8 }, { e: '💖', l: '52%', d: '-2.5s', dur: 5.2 },
    { e: '❤️', l: '62%', d: '-0.5s', dur: 4.8 }, { e: '🦋', l: '72%', d: '-3.5s', dur: 9 },
    { e: '💕', l: '82%', d: '-4.8s', dur: 5.8 }, { e: '💝', l: '92%', d: '-2.8s', dur: 4.5 },
  ]
  return (
    <div className="hearts-rain fixed inset-0 pointer-events-none z-[1]" aria-hidden style={{ overflow: 'hidden' }}>
      {items.map((h, i) => (
        <span key={i} style={{ left: h.l, top: '-20px', fontSize: '1.4rem', animationDelay: h.d, animationDuration: `${h.dur}s` }}>{h.e}</span>
      ))}
    </div>
  )
}