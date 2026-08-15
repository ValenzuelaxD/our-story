import { motion } from 'framer-motion'
import { upV } from '../../data/constants'

export default function MI({ children, v = upV, className = '' }) {
  return <motion.div variants={v} className={className}>{children}</motion.div>
}