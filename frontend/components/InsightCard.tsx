'use client'

import { motion } from 'framer-motion'
import { Lightbulb, AlertTriangle, TrendingUp } from 'lucide-react'

interface InsightCardProps {
  title: string
  insight: string
  recommendation: string
  priority: 'HIGH' | 'MEDIUM' | 'LOW'
  delay?: number
}

export function InsightCard({
  title,
  insight,
  recommendation,
  priority,
  delay = 0,
}: InsightCardProps) {
  const priorityColors = {
    HIGH: 'border-rose-400/20 bg-rose-500/8',
    MEDIUM: 'border-amber-400/20 bg-amber-500/8',
    LOW: 'border-emerald-400/20 bg-emerald-500/8',
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay, duration: 0.4 }}
      className={`rounded-2xl border p-6 ${priorityColors[priority]} bg-slate-950/55 backdrop-blur-md shadow-lg shadow-slate-950/20`}
    >
      <div className="flex items-start gap-3 mb-3">
        <Lightbulb className="w-5 h-5 text-sky-300 flex-shrink-0 mt-0.5" />
        <div className="flex-1">
          <h4 className="font-semibold text-slate-50">{title}</h4>
          <span className="text-xs font-medium text-slate-400 mt-1 inline-block">
            Priority: {priority}
          </span>
        </div>
      </div>

      <p className="mb-3 text-sm leading-6 text-slate-300">{insight}</p>

      <div className="flex gap-2 items-start">
        <TrendingUp className="w-4 h-4 text-emerald-300 flex-shrink-0 mt-0.5" />
        <p className="text-sm leading-6 text-slate-400">{recommendation}</p>
      </div>
    </motion.div>
  )
}
