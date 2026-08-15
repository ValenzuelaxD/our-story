// Framer Motion variants compartilhados por todos os slides
// ─── Framer Motion variants ────────────────────────────────
export const staggerV = {
  hidden: {},
  show: { transition: { staggerChildren: 0.12 } },
}
export const upV = {
  hidden: { opacity: 0, y: 38 },
  show: { opacity: 1, y: 0, transition: { duration: 0.52, ease: [0.25, 0.1, 0.25, 1] } },
}
export const scaleV = {
  hidden: { opacity: 0, scale: 0.80 },
  show: { opacity: 1, scale: 1, transition: { duration: 0.52, ease: [0.34, 1.56, 0.64, 1] } },
}
export const fadeV = {
  hidden: { opacity: 0 },
  show: { opacity: 1, transition: { duration: 0.5 } },
}

