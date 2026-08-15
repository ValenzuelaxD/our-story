/** Fallback ligero mientras un slide lazy carga — mismo fondo del slide objetivo. */
export default function SlideSkeleton({ bg = 'slide-bg-rose' }) {
  return (
    <section className={`snap-slide ${bg}`} aria-hidden>
      <div className="flex flex-col items-center justify-center min-h-[100dvh] w-full px-5 py-12">
        <div className="flex flex-col items-center gap-4 w-full max-w-sm animate-pulse">
          <div className="h-2.5 w-28 rounded-full bg-amber-200/15" />
          <div className="h-8 w-52 rounded-lg bg-rose-100/10" />
          <div className="h-2.5 w-40 rounded-full bg-rose-200/10" />
          <div className="mt-3 w-full space-y-3">
            <div className="h-28 rounded-2xl bg-white/[0.04] border border-amber-400/10" />
            <div className="h-28 rounded-2xl bg-white/[0.04] border border-amber-400/10" />
            <div className="h-20 rounded-2xl bg-white/[0.03] border border-white/[0.05]" />
          </div>
        </div>
      </div>
    </section>
  )
}
