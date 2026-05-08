'use client'

import { motion } from 'framer-motion'
import { Trophy, TrendingUp, Zap } from 'lucide-react'

interface CompetitorCardProps {
  name: string
  strengths: string[]
  weaknesses: string[]
  position: string
  keyFeatures?: string[]
  tone?: 'slate' | 'blue' | 'emerald' | 'amber' | 'violet'
  delay?: number
}

export function CompetitorCard({
  name,
  strengths,
  weaknesses,
  position,
  keyFeatures = [],
  tone = 'blue',
  delay = 0,
}: CompetitorCardProps) {
  const toneStyles = {
    slate: {
      card: 'border-slate-500/20 bg-slate-950/60',
      header: 'text-slate-50',
      badge: 'bg-slate-500/15 text-slate-200 border-slate-400/20',
      icon: 'text-slate-300',
    },
    blue: {
      card: 'border-sky-500/20 bg-slate-950/60',
      header: 'text-slate-50',
      badge: 'bg-sky-500/15 text-sky-100 border-sky-400/20',
      icon: 'text-sky-300',
    },
    emerald: {
      card: 'border-emerald-500/20 bg-slate-950/60',
      header: 'text-slate-50',
      badge: 'bg-emerald-500/15 text-emerald-100 border-emerald-400/20',
      icon: 'text-emerald-300',
    },
    amber: {
      card: 'border-amber-500/20 bg-slate-950/60',
      header: 'text-slate-50',
      badge: 'bg-amber-500/15 text-amber-100 border-amber-400/20',
      icon: 'text-amber-300',
    },
    violet: {
      card: 'border-violet-500/20 bg-slate-950/60',
      header: 'text-slate-50',
      badge: 'bg-violet-500/15 text-violet-100 border-violet-400/20',
      icon: 'text-violet-300',
    },
  }

  const styles = toneStyles[tone]

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ delay, duration: 0.4 }}
      className={`p-6 rounded-2xl border backdrop-blur-md shadow-[0_20px_60px_rgba(2,6,23,0.35)] transition-all hover:-translate-y-0.5 hover:shadow-[0_24px_70px_rgba(2,6,23,0.45)] ${styles.card}`}
    >
      <div className="flex items-center gap-2 mb-4">
        <Trophy className={`w-5 h-5 ${styles.icon}`} />
        <h3 className={`font-semibold text-lg ${styles.header}`}>
          {name}
        </h3>
      </div>

      <div className={`inline-flex rounded-full border px-3 py-1 text-xs font-medium ${styles.badge} mb-4`}>
        {position || 'Market player'}
      </div>

      {keyFeatures.length > 0 && (
        <div className="mb-4 flex flex-wrap gap-2">
          {keyFeatures.slice(0, 3).map((feature, i) => (
            <span
              key={i}
              className="inline-flex items-center rounded-full border border-white/10 bg-white/5 px-3 py-1 text-xs text-slate-300"
            >
              {feature}
            </span>
          ))}
        </div>
      )}

      <div className="space-y-4">
        <div>
          <div className="flex items-center gap-2 mb-2">
            <TrendingUp className="w-4 h-4 text-emerald-400" />
            <p className="text-sm font-semibold text-slate-100">
              Strengths
            </p>
          </div>
          <ul className="space-y-1 text-sm text-slate-300">
            {strengths.slice(0, 3).map((strength, i) => (
              <li key={i} className="flex gap-2">
                <span className="text-emerald-400">•</span>
                <span>{strength}</span>
              </li>
            ))}
          </ul>
        </div>

        <div>
          <div className="flex items-center gap-2 mb-2">
            <Zap className="w-4 h-4 text-amber-400" />
            <p className="text-sm font-semibold text-slate-100">
              Weaknesses
            </p>
          </div>
          <ul className="space-y-1 text-sm text-slate-300">
            {weaknesses.slice(0, 3).map((weakness, i) => (
              <li key={i} className="flex gap-2">
                <span className="text-amber-400">•</span>
                <span>{weakness}</span>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </motion.div>
  )
}
