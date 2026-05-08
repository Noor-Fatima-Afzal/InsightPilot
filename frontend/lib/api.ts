import axios from 'axios'

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000'

const api = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json',
  },
})

export interface ResearchQuery {
  business_idea: string
  company_name: string
  niche: string
  analysis_mode?: 'research' | 'company_audit'
  additional_context?: string
}

export interface ResearchResponse {
  session_id: string
  status: string
  analysis_mode: string
  business_idea: string
  company_name: string
  niche: string
  report?: ExecutiveReport
  agents_activity: any[]
  error?: string
  created_at: string
  updated_at: string
}

export interface ExecutiveReport {
  analysis_mode: string
  executive_summary: string
  market_overview: string
  competitors: any[]
  market_trends: any[]
  strategic_insights: any[]
  positioning_gaps?: string[]
  ideal_customer_profile?: string[]
  go_to_market?: string[]
  source_signals?: string[]
  recommendations: string[]
  next_steps: string[]
  generated_at: string
}

export const researchAPI = {
  startResearch: async (query: ResearchQuery) => {
    const response = await api.post('/api/research/analyze', query)
    return response.data
  },

  getStatus: async (sessionId: string) => {
    const response = await api.get(`/api/research/status/${sessionId}`)
    return response.data
  },

  getReport: async (sessionId: string) => {
    const response = await api.get(`/api/research/report/${sessionId}`)
    return response.data
  },

  getActivity: async (sessionId: string) => {
    const response = await api.get(`/api/research/activity/${sessionId}`)
    return response.data
  },

  streamResearch: async (sessionId: string) => {
    return fetch(`${API_URL}/api/research/stream/${sessionId}`)
  },
}
