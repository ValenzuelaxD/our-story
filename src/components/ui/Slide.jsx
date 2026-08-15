import { useRef } from 'react'
import { useInView } from 'framer-motion'

export default function Slide({ id, bg, children, center = true }) {
  const ref = useRef(null)
  const inView = useInView(ref, { once: true, amount: 'some' })
  return (
    <section id={id} data-slide ref={ref} className={`snap-slide ${bg}`}>
      <div
        className={`flex flex-col ${center ? 'items-center justify-center min-h-[100dvh]' : 'items-start justify-start'} w-full px-5 sm:px-8 lg:px-14 xl:px-20 py-10 sm:py-12 lg:py-16`}
        style={{ paddingTop: center ? undefined : 'max(2.5rem, env(safe-area-inset-top, 2.5rem))' }}
      >
        {children(inView)}
      </div>
    </section>
  )
}