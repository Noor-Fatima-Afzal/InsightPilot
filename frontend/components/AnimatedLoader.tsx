'use client'

import { motion } from 'framer-motion'
import { Loader2 } from 'lucide-react'

interface AnimatedLoaderProps {
  message?: string
  agents?: string[]
}

export function AnimatedLoader({ message, agents }: AnimatedLoaderProps) {
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.2,
      },
    },
  }

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.5 },
    },
  }

  return (
    <motion.div
      className="flex flex-col items-center justify-center py-12 gap-6"
      variants={containerVariants}
      initial="hidden"
      animate="visible"
    >
      <motion.div variants={itemVariants}>
        <div className="relative w-16 h-16">
          <motion.div
            className="absolute inset-0 bg-gradient-to-r from-blue-600 via-purple-600 to-pink-600 rounded-full"
            animate={{ rotate: 360 }}
            transition={{ duration: 2, repeat: Infinity, ease: 'linear' }}
            style={{ opacity: 0.3 }}
          />
          <Loader2 className="absolute inset-0 w-full h-full text-blue-600 animate-spin" />
        </div>
      </motion.div>

      {message && (
        <motion.p
          variants={itemVariants}
          className="text-lg font-semibold text-center text-gray-700 dark:text-gray-200"
        >
          {message}
        </motion.p>
      )}

      {agents && agents.length > 0 && (
        <motion.div
          variants={itemVariants}
          className="flex flex-wrap gap-2 justify-center"
        >
          {agents.map((agent, i) => (
            <motion.div
              key={agent}
              className="px-3 py-1 text-sm rounded-full bg-blue-100 dark:bg-blue-900 text-blue-700 dark:text-blue-100"
              animate={{ scale: [1, 1.05, 1] }}
              transition={{
                duration: 2,
                repeat: Infinity,
                delay: i * 0.3,
              }}
            >
              {agent}
            </motion.div>
          ))}
        </motion.div>
      )}
    </motion.div>
  )
}
