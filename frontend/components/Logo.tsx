'use client'

import { motion } from 'framer-motion'

export function Logo() {
  return (
    <motion.div
      className="flex items-center gap-2"
      initial={{ opacity: 0, x: -10 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ duration: 0.5 }}
    >
      <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-gradient-to-r from-blue-600 via-purple-600 to-pink-600">
        <span className="text-sm font-bold text-white">⚡</span>
      </div>
      <span className="text-xl font-bold bg-gradient-to-r from-blue-600 via-purple-600 to-pink-600 bg-clip-text text-transparent">
        AI Strategy
      </span>
    </motion.div>
  )
}
