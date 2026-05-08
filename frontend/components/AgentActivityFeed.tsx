'use client'

import { motion, AnimatePresence } from 'framer-motion'
import { CheckCircle2, Zap, TrendingUp, FileText } from 'lucide-react'

interface ActivityItem {
  id: string
  agent: string
  action: string
  timestamp: string
  type: 'start' | 'data' | 'insight' | 'complete'
}

interface AgentActivityFeedProps {
  activities: ActivityItem[]
  isRunning: boolean
}

const agentIcons = {
  Research: Zap,
  Competitor: TrendingUp,
  Strategy: TrendingUp,
  Report: FileText,
}

const getActionDescription = (agent: string, action: string) => {
  const descriptions: { [key: string]: string } = {
    research_start: '🔍 Starting market research via Tavily API...',
    research_complete: '✅ Market research complete',
    competitor_start: '🏢 Analyzing competitive landscape...',
    competitor_found: '📊 Found competitor',
    competitor_complete: '✅ Competitor analysis done',
    strategy_start: '🎯 Formulating strategic insights...',
    strategy_complete: '✅ Strategy complete',
    report_start: '📄 Generating executive report...',
    report_complete: '✅ Executive report ready',
  }
  return descriptions[action] || action
}

export function AgentActivityFeed({
  activities,
  isRunning,
}: AgentActivityFeedProps) {
  return (
    <div className="space-y-3 max-h-96 overflow-y-auto pr-4">
      <AnimatePresence>
        {activities.map((activity, index) => {
          const IconComponent = agentIcons[activity.agent as keyof typeof agentIcons] || Zap
          
          return (
            <motion.div
              key={activity.id}
              initial={{ opacity: 0, y: 10, x: -20 }}
              animate={{ opacity: 1, y: 0, x: 0 }}
              exit={{ opacity: 0, x: 20 }}
              transition={{ delay: index * 0.05 }}
              className="flex gap-3 items-start p-3 rounded-lg border border-white/10 bg-white/5 hover:bg-white/10 transition-all"
            >
              <div className="flex-shrink-0 mt-1">
                {activity.type === 'complete' ? (
                  <motion.div
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    transition={{ type: 'spring' }}
                  >
                    <CheckCircle2 className="w-4 h-4 text-green-500" />
                  </motion.div>
                ) : (
                  <motion.div
                    animate={{ rotate: 360 }}
                    transition={{ duration: 2, repeat: Infinity }}
                  >
                    <IconComponent className="w-4 h-4 text-blue-400" />
                  </motion.div>
                )}
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium text-gray-200">
                  {getActionDescription(activity.agent, activity.action)}
                </p>
                <p className="text-xs text-gray-500 mt-0.5">
                  {new Date(activity.timestamp).toLocaleTimeString()}
                </p>
              </div>
            </motion.div>
          )
        })}
      </AnimatePresence>

      {isRunning && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="flex items-center gap-2 text-xs text-blue-400 p-3"
        >
          <motion.div
            animate={{ scale: [1, 1.2, 1] }}
            transition={{ duration: 1, repeat: Infinity }}
            className="w-2 h-2 bg-blue-400 rounded-full"
          />
          <span>Processing...</span>
        </motion.div>
      )}
    </div>
  )
}
