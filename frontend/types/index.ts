import type { ResearchQuery, ResearchResponse, ExecutiveReport } from './api'

export type {
  ResearchQuery,
  ResearchResponse,
  ExecutiveReport,
}

export interface StreamingMessage {
  type: string
  agent?: string
  message?: string
  content?: string
  data?: Record<string, any>
  timestamp?: string
}

export interface AgentActivity {
  agent: string
  step: string
  details: Record<string, any>
}

export interface CompetitorData {
  name: string
  url?: string
  strengths: string[]
  weaknesses: string[]
  market_position: string
  key_features: string[]
}

export interface StrategicInsight {
  category: string
  insight: string
  recommendation: string
  priority: 'HIGH' | 'MEDIUM' | 'LOW'
}
