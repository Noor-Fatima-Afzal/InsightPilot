'use client'

import { motion } from 'framer-motion'
import { Clock } from 'lucide-react'
import { useEffect, useState } from 'react'

interface AnalysisTimerProps {
  isRunning: boolean
  maxDuration?: number // in seconds
}

export function AnalysisTimer({ isRunning, maxDuration = 90 }: AnalysisTimerProps) {
  const [elapsed, setElapsed] = useState(0)
  const [percentage, setPercentage] = useState(0)

  useEffect(() => {
    if (!isRunning) {
      setElapsed(0)
      return
    }

    const interval = setInterval(() => {
      setElapsed((prev) => {
        const next = prev + 1
        if (next >= maxDuration) {
          return maxDuration
        }
        setPercentage((next / maxDuration) * 100)
        return next
      })
    }, 1000)

    return () => clearInterval(interval)
  }, [isRunning, maxDuration])

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60)
    const secs = seconds % 60
    return `${mins}:${secs.toString().padStart(2, '0')}`
  }

  const remaining = maxDuration - elapsed
  const isWarning = remaining <= 10 && isRunning

  return (
    <div className="flex items-center gap-4 p-4 rounded-lg border border-white/10 bg-white/5 backdrop-blur-md">
      <div className="flex-1">
        <div className="flex items-center justify-between mb-2">
          <div className="flex items-center gap-2">
            <motion.div
              animate={{ rotate: isRunning ? 360 : 0 }}
              transition={{ duration: 2, repeat: Infinity }}
            >
              <Clock className={`w-5 h-5 ${isWarning ? 'text-red-500' : 'text-blue-400'}`} />
            </motion.div>
            <span className="text-sm font-semibold">
              {isRunning ? 'Analysis Running' : 'Analysis Complete'}
            </span>
          </div>
          <motion.span
            className={`text-xl font-bold ${
              isWarning ? 'text-red-500' : 'text-blue-400'
            }`}
            animate={isWarning ? { scale: [1, 1.1, 1] } : {}}
            transition={{ duration: 0.5, repeat: isWarning ? Infinity : 0 }}
          >
            {formatTime(elapsed)}
          </motion.span>
        </div>

        <div className="w-full h-2 bg-white/10 rounded-full overflow-hidden border border-white/20">
          <motion.div
            className={`h-full ${
              isWarning
                ? 'bg-gradient-to-r from-red-600 to-orange-600'
                : 'bg-gradient-to-r from-blue-600 via-purple-600 to-pink-600'
            }`}
            initial={{ width: 0 }}
            animate={{ width: `${percentage}%` }}
            transition={{ duration: 0.5 }}
          />
        </div>

        <div className="flex justify-between mt-2 text-xs text-gray-400">
          <span>Elapsed: {formatTime(elapsed)}</span>
          <span>Target: ~90 seconds</span>
        </div>
      </div>
    </div>
  )
}
