export default function Divider({ char = '✦' }) {
  return (
    <div className="flex items-center gap-3 w-full opacity-40 my-1">
      <div className="flex-1 h-px bg-gradient-to-r from-transparent via-amber-300/60 to-transparent" />
      <span className="text-amber-300/80 text-xs tracking-widest">{char}</span>
      <div className="flex-1 h-px bg-gradient-to-r from-transparent via-amber-300/60 to-transparent" />
    </div>
  )
}