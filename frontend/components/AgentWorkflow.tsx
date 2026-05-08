'use client'

import { motion } from 'framer-motion'
import { CheckCircle2, Clock, AlertCircle } from 'lucide-react'

interface AgentWorkflowProps {
  agents: Array<{
    name: string
    status: 'pending' | 'running' | 'completed' | 'error'
    message?: string
  }>
  currentAgent?: string
}

export function AgentWorkflow({ agents, currentAgent }: AgentWorkflowProps) {
  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'completed':
        return <CheckCircle2 className="w-5 h-5 text-green-500" />
      case 'running':
        return <Clock className="w-5 h-5 text-blue-500 animate-spin" />
      case 'error':
        return <AlertCircle className="w-5 h-5 text-red-500" />
      default:
        return <Clock className="w-5 h-5 text-gray-400" />
    }
  }

  return (
    <div className="space-y-4">
      {agents.map((agent, i) => (
        <motion.div
          key={agent.name}
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: i * 0.1 }}
          className={`flex items-center gap-4 p-4 rounded-lg border transition-all ${
            currentAgent === agent.name
              ? 'border-blue-500/50 bg-blue-500/5'
              : 'border-white/10 bg-white/5'
          }`}
        >
          {getStatusIcon(agent.status)}
          <div className="flex-1">
            <h4 className="font-semibold text-gray-900 dark:text-gray-100">
              {agent.name}
            </h4>
            {agent.message && (
              <p className="text-sm text-gray-600 dark:text-gray-400">
                {agent.message}
              </p>
            )}
          </div>
        </motion.div>
      ))}
    </div>
  )
}
