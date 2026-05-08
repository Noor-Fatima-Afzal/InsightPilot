import { create } from 'zustand'

interface ResearchState {
  sessionId: string | null
  status: string
  businessIdea: string
  companyName: string
  niche: string
  report: any
  agentsActivity: any[]
  currentAgent: string
  isLoading: boolean
  error: string | null

  setSessionId: (id: string) => void
  setStatus: (status: string) => void
  setReport: (report: any) => void
  addAgentActivity: (activity: any) => void
  setCurrentAgent: (agent: string) => void
  setIsLoading: (loading: boolean) => void
  setError: (error: string | null) => void
  reset: () => void
}

export const useResearchStore = create<ResearchState>((set) => ({
  sessionId: null,
  status: 'idle',
  businessIdea: '',
  companyName: '',
  niche: '',
  report: null,
  agentsActivity: [],
  currentAgent: '',
  isLoading: false,
  error: null,

  setSessionId: (id) => set({ sessionId: id }),
  setStatus: (status) => set({ status }),
  setReport: (report) => set({ report }),
  addAgentActivity: (activity) =>
    set((state) => ({
      agentsActivity: [...state.agentsActivity, activity],
    })),
  setCurrentAgent: (agent) => set({ currentAgent: agent }),
  setIsLoading: (loading) => set({ isLoading: loading }),
  setError: (error) => set({ error }),
  reset: () =>
    set({
      sessionId: null,
      status: 'idle',
      businessIdea: '',
      companyName: '',
      niche: '',
      report: null,
      agentsActivity: [],
      currentAgent: '',
      isLoading: false,
      error: null,
    }),
}))
