'use client'

import React, { useEffect, useState } from 'react'
import { useParams } from 'next/navigation'
import { motion, AnimatePresence } from 'framer-motion'
import { Logo } from '@/components/Logo'
import { AnalysisTimer } from '@/components/AnalysisTimer'
import { AnimatedLoader } from '@/components/AnimatedLoader'
import { AgentWorkflow } from '@/components/AgentWorkflow'
import { AgentActivityFeed } from '@/components/AgentActivityFeed'
import { CompetitorCard } from '@/components/CompetitorCard'
import { InsightCard } from '@/components/InsightCard'
import { GradientText } from '@/components/UI'
import { useStreamedResponse } from '@/hooks/useStreamedResponse'
import { ArrowLeft, ChevronDown, Download, LayoutGrid, ListFilter, Scale, ShieldAlert, Sparkles, Target, Zap, Link2, Copy, Globe2 } from 'lucide-react'
import Link from 'next/link'

interface ActivityItem {
  id: string
  agent: string
  action: string
  timestamp: string
  type: 'start' | 'data' | 'insight' | 'complete'
}

type ReportSection = 'overview' | 'findings' | 'competitors' | 'insights' | 'recommendations' | 'plan' | 'all'

const reportSections: Array<{
  id: ReportSection
  label: string
  icon: React.ComponentType<{ className?: string }>
}> = [
  { id: 'overview', label: 'Overview', icon: LayoutGrid },
  { id: 'findings', label: 'Findings', icon: Scale },
  { id: 'competitors', label: 'Competitors', icon: Target },
  { id: 'insights', label: 'Insights', icon: Sparkles },
  { id: 'recommendations', label: 'Recommendations', icon: ListFilter },
  { id: 'plan', label: 'Action Plan', icon: ShieldAlert },
  { id: 'all', label: 'All Sections', icon: Zap },
]

export default function ResearchPage() {
  const params = useParams()
  const sessionId = params.session_id as string

  const [report, setReport] = useState<any>(null)
  const [competitors, setCompetitors] = useState<any[]>([])
  const [insights, setInsights] = useState<any[]>([])
  const [agents, setAgents] = useState<any[]>([])
  const [activities, setActivities] = useState<ActivityItem[]>([])
  const [isComplete, setIsComplete] = useState(false)
  const [progress, setProgress] = useState(0)
  const [selectedSection, setSelectedSection] = useState<ReportSection>('all')
  const [selectedCompetitor, setSelectedCompetitor] = useState<number | null>(0)
  const [shareCopied, setShareCopied] = useState(false)
  const [collapsedSections, setCollapsedSections] = useState<Record<string, boolean>>({
    overview: false,
    market: false,
    findings: false,
    competitors: false,
    insights: false,
    recommendations: false,
    plan: false,
    metrics: false,
  })

  const { messages, isStreaming } = useStreamedResponse(sessionId)
  const keyFindings = report?.key_findings || []
  const topOpportunities = report?.top_opportunities || []
  const positioningGaps = report?.positioning_gaps || []
  const idealCustomerProfile = report?.ideal_customer_profile || []
  const goToMarket = report?.go_to_market || []
  const sourceSignals = report?.source_signals || []
  const risks = report?.risks || []
  const successMetrics = report?.success_metrics || []
  const competitorTones = ['blue', 'emerald', 'amber', 'violet', 'slate'] as const
  const displayedCompetitors = (report?.competitors?.length ? report.competitors : competitors) || []

  const toDashboardCompetitor = (item: any) => ({
    name: item?.name || 'Unknown Competitor',
    strengths: item?.strengths || [],
    weaknesses: item?.weaknesses || [],
    position: item?.market_position || item?.position || 'Market Player',
    key_features: item?.key_features || item?.keyFeatures || [],
  })

  const addActivity = (agent: string, action: string, type: 'start' | 'data' | 'insight' | 'complete' = 'data') => {
    const newActivity: ActivityItem = {
      id: `${Date.now()}-${Math.random()}`,
      agent,
      action,
      timestamp: new Date().toISOString(),
      type,
    }
    setActivities((prev) => [newActivity, ...prev])
  }

  useEffect(() => {
    if (messages.length === 0) return

    const latestMessage = messages[messages.length - 1]

    // Update agents workflow
    if (latestMessage.type === 'agent_start') {
      addActivity(latestMessage.agent || 'Agent', `Starting ${latestMessage.agent}...`, 'start')
      setAgents((prev) => {
        const existing = prev.find((a) => a.name === latestMessage.agent)
        if (existing) {
          return prev.map((a) =>
            a.name === latestMessage.agent ? { ...a, status: 'running' } : a
          )
        }
        return [
          ...prev,
          {
            name: latestMessage.agent,
            status: 'running',
            message: latestMessage.message,
          },
        ]
      })
    }

    if (latestMessage.type === 'research_complete') {
      addActivity(latestMessage.agent || 'Research', 'Research complete', 'complete')
      setAgents((prev) =>
        prev.map((a) =>
          a.name === latestMessage.agent ? { ...a, status: 'completed' } : a
        )
      )
      setProgress(25)
    }

    if (latestMessage.type === 'competitor_found') {
      addActivity('Competitor', `Found: ${latestMessage.competitor}`, 'insight')
      setCompetitors((prev) => [
        ...prev,
        {
          name: latestMessage.competitor,
          strengths: latestMessage.strengths,
          weaknesses: latestMessage.weaknesses,
        },
      ])
    }

    if (latestMessage.type === 'insight_generated') {
      addActivity('Strategy', `Insight: ${latestMessage.insight?.substring(0, 50)}...`, 'insight')
      setInsights((prev) => [
        ...prev,
        {
          title: latestMessage.insight,
          recommendation: latestMessage.recommendation,
        },
      ])
      setProgress(Math.min(progress + 5, 75))
    }

    if (latestMessage.type === 'workflow_complete') {
      addActivity('Report', 'Report generated successfully', 'complete')
      const finalReport = latestMessage.report || {}
      setReport(finalReport)

      if (Array.isArray(finalReport.competitors) && finalReport.competitors.length > 0) {
        setCompetitors(finalReport.competitors.map(toDashboardCompetitor))
        addActivity('Competitor', `Loaded ${finalReport.competitors.length} competitors into dashboard`, 'complete')
      }

      if (Array.isArray(finalReport.strategic_insights) && finalReport.strategic_insights.length > 0) {
        setInsights(
          finalReport.strategic_insights.map((insight: any) => ({
            title: insight?.insight || insight?.category || 'Strategic Insight',
            recommendation: insight?.recommendation || 'No recommendation provided',
          }))
        )
      }

      setIsComplete(true)
      setProgress(100)
      setAgents((prev) =>
        prev.map((a) =>
          a.name === latestMessage.agent ? { ...a, status: 'completed' } : a
        )
      )
    }

    if (latestMessage.type === 'error') {
      addActivity(latestMessage.agent || 'Agent', 'Error occurred', 'complete')
      setAgents((prev) =>
        prev.map((a) =>
          a.name === latestMessage.agent ? { ...a, status: 'error' } : a
        )
      )
    }
  }, [messages])

  useEffect(() => {
    if (displayedCompetitors.length > 0) {
      setSelectedCompetitor((current) => (current === null ? 0 : Math.min(current, displayedCompetitors.length - 1)))
    } else {
      setSelectedCompetitor(null)
    }
  }, [displayedCompetitors])

  const handleDownloadReport = () => {
    if (!report) return

    const reportContent = JSON.stringify(report, null, 2)
    const blob = new Blob([reportContent], { type: 'application/json' })
    const url = URL.createObjectURL(blob)
    const link = document.createElement('a')
    link.href = url
    link.download = `research-report-${new Date().toISOString().split('T')[0]}.json`
    document.body.appendChild(link)
    link.click()
    document.body.removeChild(link)
    URL.revokeObjectURL(url)
  }

  const handleCopyShareLink = async () => {
    try {
      await navigator.clipboard.writeText(window.location.href)
      setShareCopied(true)
      window.setTimeout(() => setShareCopied(false), 1800)
    } catch {
      setShareCopied(false)
    }
  }

  const toggleSection = (sectionKey: string) => {
    setCollapsedSections((prev) => ({ ...prev, [sectionKey]: !prev[sectionKey] }))
  }

  return (
    <div className="min-h-screen bg-[radial-gradient(circle_at_top,_rgba(56,189,248,0.12),_transparent_35%),linear-gradient(180deg,_#07111f_0%,_#0b1320_38%,_#0f172a_100%)] text-white">
      {/* Fixed header */}
      <motion.header
        suppressHydrationWarning
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="fixed top-0 w-full border-b border-white/10 backdrop-blur-md z-50"
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 flex items-center justify-between">
          <Link href="/">
            <motion.div whileHover={{ x: -4 }} className="flex items-center gap-2">
              <ArrowLeft className="w-5 h-5" />
              <Logo />
            </motion.div>
          </Link>
          <div className="flex items-center gap-3">
            {report?.analysis_mode === 'company_audit' && (
              <div className="hidden sm:flex items-center gap-2 rounded-full border border-sky-400/20 bg-sky-400/10 px-3 py-2 text-xs text-sky-100">
                <Globe2 className="h-4 w-4" />
                Company Audit Mode
              </div>
            )}
            {isComplete && (
              <>
                <motion.button
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  whileHover={{ scale: 1.05 }}
                  onClick={handleCopyShareLink}
                  className="flex items-center gap-2 px-4 py-2 rounded-lg border border-white/10 bg-white/5 hover:bg-white/10 transition-colors"
                >
                  {shareCopied ? <Copy className="w-4 h-4" /> : <Link2 className="w-4 h-4" />}
                  {shareCopied ? 'Link Copied' : 'Share Link'}
                </motion.button>
                <motion.button
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  whileHover={{ scale: 1.05 }}
                  onClick={handleDownloadReport}
                  className="flex items-center gap-2 px-4 py-2 bg-blue-600 hover:bg-blue-700 rounded-lg transition-colors"
                >
                  <Download className="w-4 h-4" />
                  Download Report
                </motion.button>
              </>
            )}
          </div>
        </div>
      </motion.header>

      {/* Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-24 pb-12">
        <AnimatePresence>
          {!isComplete ? (
            <>
              {/* Timer + Progress */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="mb-8 sticky top-24 z-30"
              >
                <AnalysisTimer isRunning={isStreaming} maxDuration={90} />
              </motion.div>

              {/* Two Column Layout */}
              <div className="grid lg:grid-cols-3 gap-8 mb-12">
                {/* Left Column - Activity Feed */}
                <motion.div
                  key="activity"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="lg:col-span-1 p-6 rounded-lg border border-white/10 bg-white/5 backdrop-blur-md h-fit sticky top-24"
                >
                  <div className="flex items-center gap-2 mb-4">
                    <Zap className="w-5 h-5 text-blue-400" />
                    <h3 className="font-bold text-lg">Real-Time Activity</h3>
                  </div>
                  <AgentActivityFeed activities={activities} isRunning={isStreaming} />
                </motion.div>

                {/* Right Column - Main Content */}
                <div className="lg:col-span-2 space-y-8">
                  {/* Agent Workflow */}
                  <motion.div
                    key="workflow"
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -20 }}
                  >
                    <h2 className="text-xl font-bold mb-4">
                      <GradientText as="span">Agent Status</GradientText>
                    </h2>
                    <AgentWorkflow agents={agents} />
                  </motion.div>

                  {/* Live Updates - Competitors */}
                  {competitors.length > 0 && (
                    <motion.div
                      key="competitors-live"
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                    >
                      <h3 className="text-xl font-bold mb-4">
                        Discovered Competitors ({competitors.length})
                      </h3>
                      <div className="grid gap-4">
                        {competitors.map((comp, i) => (
                          <CompetitorCard
                            key={comp.name}
                            name={comp.name}
                            strengths={comp.strengths || []}
                            weaknesses={comp.weaknesses || []}
                            position={comp.position || 'Market Player'}
                            keyFeatures={comp.key_features || comp.keyFeatures || []}
                            tone={competitorTones[i % competitorTones.length]}
                            delay={i * 0.1}
                          />
                        ))}
                      </div>
                    </motion.div>
                  )}

                  {/* Insights */}
                  {insights.length > 0 && (
                    <motion.div
                      key="insights-live"
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                    >
                      <h3 className="text-xl font-bold mb-4">
                        Strategic Insights ({insights.length})
                      </h3>
                      <div className="space-y-3">
                        {insights.slice(0, 3).map((insight, i) => (
                          <motion.div
                            key={i}
                            initial={{ opacity: 0, x: -20 }}
                            animate={{ opacity: 1, x: 0 }}
                            transition={{ delay: i * 0.05 }}
                            className="p-4 rounded-lg border border-white/10 bg-white/5 hover:bg-white/10 transition-all"
                          >
                            <p className="text-sm text-gray-200">{insight.title}</p>
                          </motion.div>
                        ))}
                      </div>
                    </motion.div>
                  )}

                  {/* Loading Message */}
                  <motion.div
                    key="loading"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    className="py-8 text-center"
                  >
                    <AnimatedLoader
                      message="Generating comprehensive analysis..."
                      agents={agents.map((a) => a.name)}
                    />
                  </motion.div>
                </div>
              </div>
            </>
          ) : (
            /* Report Display */
            <motion.div
              key="report"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="space-y-12"
            >
              {/* Title */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="space-y-4"
              >
                <div className="inline-flex items-center gap-2 rounded-full border border-sky-400/20 bg-sky-400/10 px-4 py-2 text-sm text-sky-100">
                  <Sparkles className="h-4 w-4" />
                  AI Executive Report
                </div>
                <h1 className="text-4xl md:text-5xl font-semibold tracking-tight">
                  <GradientText>Executive Report</GradientText>
                </h1>
                <p className="max-w-3xl text-base md:text-lg leading-7 text-slate-300">
                  Clear, founder-friendly analysis with sections you can expand on demand. Use the navigation below to focus on the data that matters most.
                </p>
              </motion.div>

              {report && (
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.05 }}
                  className="grid gap-4 md:grid-cols-2 xl:grid-cols-4"
                >
                  <div className="rounded-2xl border border-white/10 bg-slate-950/55 p-5 backdrop-blur-md shadow-lg shadow-slate-950/20">
                    <p className="text-xs uppercase tracking-[0.22em] text-slate-400">Market View</p>
                    <p className="mt-2 text-lg font-semibold text-slate-50">{report.market_overview}</p>
                  </div>
                  <div className="rounded-2xl border border-white/10 bg-slate-950/55 p-5 backdrop-blur-md shadow-lg shadow-slate-950/20">
                    <p className="text-xs uppercase tracking-[0.22em] text-slate-400">Competitors</p>
                    <p className="mt-2 text-3xl font-semibold text-sky-100">{report.competitors?.length || 0}</p>
                    <p className="text-sm text-slate-400">Named rivals identified by the agents</p>
                  </div>
                  <div className="rounded-2xl border border-white/10 bg-slate-950/55 p-5 backdrop-blur-md shadow-lg shadow-slate-950/20">
                    <p className="text-xs uppercase tracking-[0.22em] text-slate-400">Top Opportunities</p>
                    <p className="mt-2 text-3xl font-semibold text-emerald-100">{topOpportunities.length}</p>
                    <p className="text-sm text-slate-400">Concrete growth paths surfaced by the agents</p>
                  </div>
                  <div className="rounded-2xl border border-white/10 bg-slate-950/55 p-5 backdrop-blur-md shadow-lg shadow-slate-950/20">
                    <p className="text-xs uppercase tracking-[0.22em] text-slate-400">Success Metrics</p>
                    <p className="mt-2 text-3xl font-semibold text-cyan-100">{successMetrics.length}</p>
                    <p className="text-sm text-slate-400">How to measure traction and learn quickly</p>
                  </div>
                </motion.div>
              )}

              {report?.analysis_mode === 'company_audit' && (
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.07 }}
                  className="grid gap-4 md:grid-cols-3"
                >
                  <div className="rounded-2xl border border-sky-400/15 bg-slate-950/55 p-5 backdrop-blur-md shadow-lg shadow-slate-950/20">
                    <p className="text-xs uppercase tracking-[0.22em] text-slate-400">Positioning Gaps</p>
                    <p className="mt-2 text-2xl font-semibold text-sky-100">{positioningGaps.length}</p>
                    <p className="text-sm text-slate-400">Where the market story is weak or crowded</p>
                  </div>
                  <div className="rounded-2xl border border-emerald-400/15 bg-slate-950/55 p-5 backdrop-blur-md shadow-lg shadow-slate-950/20">
                    <p className="text-xs uppercase tracking-[0.22em] text-slate-400">ICP Signals</p>
                    <p className="mt-2 text-2xl font-semibold text-emerald-100">{idealCustomerProfile.length}</p>
                    <p className="text-sm text-slate-400">The buyers most likely to care now</p>
                  </div>
                  <div className="rounded-2xl border border-amber-400/15 bg-slate-950/55 p-5 backdrop-blur-md shadow-lg shadow-slate-950/20">
                    <p className="text-xs uppercase tracking-[0.22em] text-slate-400">GTM Ideas</p>
                    <p className="mt-2 text-2xl font-semibold text-amber-100">{goToMarket.length}</p>
                    <p className="text-sm text-slate-400">Channels and motions to test first</p>
                  </div>
                </motion.div>
              )}

              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.08 }}
                className="rounded-2xl border border-white/10 bg-slate-950/55 p-3 backdrop-blur-md shadow-lg shadow-slate-950/20"
              >
                <div className="flex flex-wrap gap-2">
                  {reportSections.map((section) => {
                    const Icon = section.icon
                    const active = selectedSection === section.id
                    return (
                      <button
                        key={section.id}
                        type="button"
                        onClick={() => setSelectedSection(section.id)}
                        className={`inline-flex items-center gap-2 rounded-full border px-4 py-2 text-sm font-medium transition-all ${active
                          ? 'border-sky-300/30 bg-sky-400/15 text-sky-50 shadow-sm shadow-sky-950/30'
                          : 'border-white/10 bg-white/5 text-slate-300 hover:border-white/20 hover:bg-white/10'
                          }`}
                      >
                        <Icon className="h-4 w-4" />
                        {section.label}
                      </button>
                    )
                  })}
                </div>
              </motion.div>

              {(selectedSection === 'overview' || selectedSection === 'all') && report?.executive_summary && (
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.1 }}
                  className="rounded-2xl border border-sky-400/15 bg-slate-950/55 p-8 backdrop-blur-md shadow-lg shadow-slate-950/20"
                >
                  <button
                    type="button"
                    onClick={() => toggleSection('overview')}
                    className="mb-4 flex w-full items-center justify-between text-left"
                  >
                    <h2 className="text-2xl font-semibold text-slate-50">Executive Summary</h2>
                    <ChevronDown className={`h-5 w-5 text-slate-300 transition-transform ${collapsedSections.overview ? '-rotate-90' : 'rotate-0'}`} />
                  </button>
                  {!collapsedSections.overview && (
                    <p className="leading-7 text-slate-300">
                      {report.executive_summary}
                    </p>
                  )}
                </motion.div>
              )}

              {(selectedSection === 'overview' || selectedSection === 'findings' || selectedSection === 'all') && report?.market_overview && (
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.2 }}
                  className="rounded-2xl border border-white/10 bg-slate-950/55 p-8 backdrop-blur-md shadow-lg shadow-slate-950/20"
                >
                  <button
                    type="button"
                    onClick={() => toggleSection('market')}
                    className="mb-4 flex w-full items-center justify-between text-left"
                  >
                    <h2 className="text-2xl font-semibold text-slate-50">Market Overview</h2>
                    <ChevronDown className={`h-5 w-5 text-slate-300 transition-transform ${collapsedSections.market ? '-rotate-90' : 'rotate-0'}`} />
                  </button>
                  {!collapsedSections.market && (
                    <p className="leading-7 text-slate-300">
                      {report.market_overview}
                    </p>
                  )}
                </motion.div>
              )}

              {(selectedSection === 'findings' || selectedSection === 'all') && (keyFindings.length > 0 || topOpportunities.length > 0 || risks.length > 0 || successMetrics.length > 0) && (
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.25 }}
                  className="rounded-2xl border border-white/10 bg-slate-950/45 p-5 backdrop-blur-md shadow-lg shadow-slate-950/20"
                >
                  <button
                    type="button"
                    onClick={() => toggleSection('findings')}
                    className="mb-4 flex w-full items-center justify-between text-left"
                  >
                    <h2 className="text-2xl font-semibold text-slate-50">Findings & Signals</h2>
                    <ChevronDown className={`h-5 w-5 text-slate-300 transition-transform ${collapsedSections.findings ? '-rotate-90' : 'rotate-0'}`} />
                  </button>
                  {!collapsedSections.findings && (
                    <div className="grid gap-6 lg:grid-cols-2">
                      {keyFindings.length > 0 && (
                        <div className="rounded-2xl border border-white/10 bg-slate-950/55 p-8 backdrop-blur-md shadow-lg shadow-slate-950/20">
                      <h2 className="text-2xl font-semibold mb-4 text-slate-50">Key Findings</h2>
                      <ul className="space-y-3 text-slate-300">
                        {keyFindings.slice(0, 5).map((finding: string, i: number) => (
                          <li key={i} className="flex gap-3">
                            <span className="mt-1 h-2 w-2 rounded-full bg-sky-400 flex-shrink-0" />
                            <span>{finding}</span>
                          </li>
                        ))}
                      </ul>
                        </div>
                      )}

                      {topOpportunities.length > 0 && (
                        <div className="rounded-2xl border border-emerald-400/20 bg-emerald-500/10 p-8 backdrop-blur-md shadow-lg shadow-slate-950/20">
                      <h2 className="text-2xl font-semibold mb-4 text-slate-50">Top Opportunities</h2>
                      <ul className="space-y-3 text-slate-300">
                        {topOpportunities.slice(0, 5).map((opportunity: string, i: number) => (
                          <li key={i} className="flex gap-3">
                            <span className="mt-1 h-2 w-2 rounded-full bg-emerald-400 flex-shrink-0" />
                            <span>{opportunity}</span>
                          </li>
                        ))}
                      </ul>
                        </div>
                      )}

                      {risks.length > 0 && (
                        <div className="rounded-2xl border border-amber-400/20 bg-amber-500/10 p-8 backdrop-blur-md shadow-lg shadow-slate-950/20">
                      <h2 className="text-2xl font-semibold mb-4 text-slate-50">Key Risks</h2>
                      <ul className="space-y-3 text-slate-300">
                        {risks.slice(0, 5).map((risk: string, i: number) => (
                          <li key={i} className="flex gap-3">
                            <span className="mt-1 h-2 w-2 rounded-full bg-amber-400 flex-shrink-0" />
                            <span>{risk}</span>
                          </li>
                        ))}
                      </ul>
                        </div>
                      )}

                      {successMetrics.length > 0 && (
                        <div className="rounded-2xl border border-cyan-400/20 bg-cyan-500/10 p-8 backdrop-blur-md shadow-lg shadow-slate-950/20">
                      <h2 className="text-2xl font-semibold mb-4 text-slate-50">Success Metrics</h2>
                      <ul className="space-y-3 text-slate-300">
                        {successMetrics.slice(0, 5).map((metric: string, i: number) => (
                          <li key={i} className="flex gap-3">
                            <span className="mt-1 h-2 w-2 rounded-full bg-cyan-400 flex-shrink-0" />
                            <span>{metric}</span>
                          </li>
                        ))}
                      </ul>
                        </div>
                      )}
                    </div>
                  )}
                </motion.div>
              )}

              {report?.analysis_mode === 'company_audit' && (positioningGaps.length > 0 || idealCustomerProfile.length > 0 || goToMarket.length > 0 || sourceSignals.length > 0) && (
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.22 }}
                  className="grid gap-6 lg:grid-cols-2"
                >
                  {positioningGaps.length > 0 && (
                    <div className="rounded-2xl border border-sky-400/15 bg-slate-950/55 p-8 backdrop-blur-md shadow-lg shadow-slate-950/20">
                      <h2 className="text-2xl font-semibold mb-4 text-slate-50">Positioning Gaps</h2>
                      <ul className="space-y-3 text-slate-300">
                        {positioningGaps.slice(0, 5).map((gap: string, i: number) => (
                          <li key={i} className="flex gap-3">
                            <span className="mt-1 h-2 w-2 rounded-full bg-sky-400 flex-shrink-0" />
                            <span>{gap}</span>
                          </li>
                        ))}
                      </ul>
                    </div>
                  )}
                  {idealCustomerProfile.length > 0 && (
                    <div className="rounded-2xl border border-emerald-400/15 bg-slate-950/55 p-8 backdrop-blur-md shadow-lg shadow-slate-950/20">
                      <h2 className="text-2xl font-semibold mb-4 text-slate-50">Ideal Customer Profile</h2>
                      <ul className="space-y-3 text-slate-300">
                        {idealCustomerProfile.slice(0, 5).map((item: string, i: number) => (
                          <li key={i} className="flex gap-3">
                            <span className="mt-1 h-2 w-2 rounded-full bg-emerald-400 flex-shrink-0" />
                            <span>{item}</span>
                          </li>
                        ))}
                      </ul>
                    </div>
                  )}
                  {goToMarket.length > 0 && (
                    <div className="rounded-2xl border border-amber-400/15 bg-slate-950/55 p-8 backdrop-blur-md shadow-lg shadow-slate-950/20">
                      <h2 className="text-2xl font-semibold mb-4 text-slate-50">Go-To-Market Ideas</h2>
                      <ul className="space-y-3 text-slate-300">
                        {goToMarket.slice(0, 5).map((item: string, i: number) => (
                          <li key={i} className="flex gap-3">
                            <span className="mt-1 h-2 w-2 rounded-full bg-amber-400 flex-shrink-0" />
                            <span>{item}</span>
                          </li>
                        ))}
                      </ul>
                    </div>
                  )}
                  {sourceSignals.length > 0 && (
                    <div className="rounded-2xl border border-white/10 bg-slate-950/55 p-8 backdrop-blur-md shadow-lg shadow-slate-950/20">
                      <h2 className="text-2xl font-semibold mb-4 text-slate-50">Source Signals</h2>
                      <ul className="space-y-3 text-slate-300">
                        {sourceSignals.slice(0, 5).map((item: string, i: number) => (
                          <li key={i} className="flex gap-3">
                            <span className="mt-1 h-2 w-2 rounded-full bg-white/70 flex-shrink-0" />
                            <span>{item}</span>
                          </li>
                        ))}
                      </ul>
                    </div>
                  )}
                </motion.div>
              )}

              {(selectedSection === 'competitors' || selectedSection === 'all') && displayedCompetitors.length > 0 && (
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.3 }}
                  className="space-y-6"
                >
                  <div className="flex items-center justify-between gap-4 flex-wrap">
                    <div>
                      <h2 className="text-2xl font-semibold text-slate-50">Competitive Landscape</h2>
                      <p className="mt-1 text-sm text-slate-400">All discovered competitors are shown below. Click any card in the list to inspect it in detail.</p>
                    </div>
                    <div className="rounded-full border border-white/10 bg-white/5 px-3 py-1 text-sm text-slate-300">
                      {displayedCompetitors.length} competitors found
                    </div>
                  </div>

                  <button
                    type="button"
                    onClick={() => toggleSection('competitors')}
                    className="flex w-full items-center justify-between rounded-xl border border-white/10 bg-white/5 px-4 py-3 text-left"
                  >
                    <span className="text-sm font-medium text-slate-300">Expand or collapse competitor list and detail panel</span>
                    <ChevronDown className={`h-5 w-5 text-slate-300 transition-transform ${collapsedSections.competitors ? '-rotate-90' : 'rotate-0'}`} />
                  </button>

                  {!collapsedSections.competitors && (
                    <div className="grid gap-6 xl:grid-cols-[1.1fr_0.9fr]">
                    <div className="space-y-4">
                      {displayedCompetitors.map((comp: any, i: number) => {
                        const isActive = selectedCompetitor === i
                        return (
                          <button
                            key={comp.name}
                            type="button"
                            onClick={() => setSelectedCompetitor(i)}
                            className={`w-full text-left rounded-2xl border p-1 transition-all ${isActive ? 'border-sky-300/30 bg-sky-400/10' : 'border-white/10 bg-white/5 hover:bg-white/10'}`}
                          >
                            <CompetitorCard
                              name={comp.name}
                              strengths={comp.strengths || []}
                              weaknesses={comp.weaknesses || []}
                              position={comp.market_position || ''}
                              keyFeatures={comp.key_features || comp.keyFeatures || []}
                              tone={competitorTones[i % competitorTones.length]}
                              delay={0}
                            />
                          </button>
                        )
                      })}
                    </div>

                    <div className="rounded-2xl border border-white/10 bg-slate-950/55 p-6 backdrop-blur-md shadow-lg shadow-slate-950/20 sticky top-24 h-fit">
                      <h3 className="text-lg font-semibold text-slate-50 mb-4">Competitor Detail</h3>
                      {selectedCompetitor !== null && displayedCompetitors[selectedCompetitor] ? (
                        (() => {
                          const current = displayedCompetitors[selectedCompetitor]
                          return (
                            <div className="space-y-5 text-sm text-slate-300">
                              <div>
                                <p className="text-xs uppercase tracking-[0.22em] text-slate-500">Name</p>
                                <p className="mt-1 text-base font-semibold text-slate-50">{current.name}</p>
                              </div>
                              <div>
                                <p className="text-xs uppercase tracking-[0.22em] text-slate-500">Market Position</p>
                                <p className="mt-1 text-slate-200">{current.market_position || 'Not specified'}</p>
                              </div>
                              <div>
                                <p className="text-xs uppercase tracking-[0.22em] text-slate-500 mb-2">Key Features</p>
                                <div className="flex flex-wrap gap-2">
                                  {(current.key_features || []).map((feature: string, index: number) => (
                                    <span key={index} className="rounded-full border border-white/10 bg-white/5 px-3 py-1 text-xs text-slate-300">
                                      {feature}
                                    </span>
                                  ))}
                                </div>
                              </div>
                              <div>
                                <p className="text-xs uppercase tracking-[0.22em] text-slate-500 mb-2">Strengths</p>
                                <ul className="space-y-2">
                                  {(current.strengths || []).map((item: string, index: number) => (
                                    <li key={index} className="flex gap-2">
                                      <span className="mt-1 h-2 w-2 rounded-full bg-emerald-400 flex-shrink-0" />
                                      <span>{item}</span>
                                    </li>
                                  ))}
                                </ul>
                              </div>
                              <div>
                                <p className="text-xs uppercase tracking-[0.22em] text-slate-500 mb-2">Weaknesses</p>
                                <ul className="space-y-2">
                                  {(current.weaknesses || []).map((item: string, index: number) => (
                                    <li key={index} className="flex gap-2">
                                      <span className="mt-1 h-2 w-2 rounded-full bg-amber-400 flex-shrink-0" />
                                      <span>{item}</span>
                                    </li>
                                  ))}
                                </ul>
                              </div>
                            </div>
                          )
                        })()
                      ) : (
                        <p className="text-slate-400">Select a competitor to view detailed strengths, weaknesses, and positioning.</p>
                      )}
                    </div>
                    </div>
                  )}
                </motion.div>
              )}

              {(selectedSection === 'insights' || selectedSection === 'all') && report?.strategic_insights &&
                report.strategic_insights.length > 0 && (
                  <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.4 }}
                  >
                    <button
                      type="button"
                      onClick={() => toggleSection('insights')}
                      className="mb-6 flex w-full items-center justify-between text-left"
                    >
                      <h2 className="text-2xl font-semibold text-slate-50">Strategic Insights</h2>
                      <ChevronDown className={`h-5 w-5 text-slate-300 transition-transform ${collapsedSections.insights ? '-rotate-90' : 'rotate-0'}`} />
                    </button>
                    {!collapsedSections.insights && (
                      <div className="grid gap-6 md:grid-cols-2">
                      {report.strategic_insights
                        .slice(0, 6)
                        .map((insight: any, i: number) => (
                          <InsightCard
                            key={i}
                            title={insight.category}
                            insight={insight.insight}
                            recommendation={insight.recommendation}
                            priority={insight.priority || 'MEDIUM'}
                            delay={i * 0.1}
                          />
                        ))}
                      </div>
                    )}
                  </motion.div>
                )}

              {(selectedSection === 'recommendations' || selectedSection === 'all') && report?.recommendations &&
                report.recommendations.length > 0 && (
                  <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.5 }}
                    className="rounded-2xl border border-white/10 bg-slate-950/55 p-8 backdrop-blur-md shadow-lg shadow-slate-950/20"
                  >
                    <button
                      type="button"
                      onClick={() => toggleSection('recommendations')}
                      className="mb-6 flex w-full items-center justify-between text-left"
                    >
                      <h2 className="text-2xl font-semibold text-slate-50">Key Recommendations</h2>
                      <ChevronDown className={`h-5 w-5 text-slate-300 transition-transform ${collapsedSections.recommendations ? '-rotate-90' : 'rotate-0'}`} />
                    </button>
                    {!collapsedSections.recommendations && (
                      <ul className="space-y-4">
                      {report.recommendations.map(
                        (rec: string, i: number) => (
                          <motion.li
                            key={i}
                            initial={{ opacity: 0, x: -20 }}
                            animate={{ opacity: 1, x: 0 }}
                            transition={{ delay: 0.5 + i * 0.1 }}
                            className="flex gap-3 text-gray-200"
                          >
                            <span className="text-sky-300 font-semibold">
                              {i + 1}.
                            </span>
                            <span className="text-slate-300">{rec}</span>
                          </motion.li>
                        )
                      )}
                      </ul>
                    )}
                  </motion.div>
                )}

              {(selectedSection === 'plan' || selectedSection === 'all') && report?.next_steps && report.next_steps.length > 0 && (
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.6 }}
                  className="rounded-2xl border border-emerald-400/20 bg-emerald-500/10 p-8 backdrop-blur-md shadow-lg shadow-slate-950/20"
                >
                  <button
                    type="button"
                    onClick={() => toggleSection('plan')}
                    className="mb-6 flex w-full items-center justify-between text-left"
                  >
                    <h2 className="text-2xl font-semibold text-slate-50">Next 90 Days Action Plan</h2>
                    <ChevronDown className={`h-5 w-5 text-slate-300 transition-transform ${collapsedSections.plan ? '-rotate-90' : 'rotate-0'}`} />
                  </button>
                  {!collapsedSections.plan && (
                    <ul className="space-y-4">
                    {report.next_steps.map((step: string, i: number) => (
                      <motion.li
                        key={i}
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: 0.6 + i * 0.1 }}
                        className="flex gap-3 text-slate-300"
                      >
                        <span className="text-emerald-300 font-semibold">
                          {i + 1}.
                        </span>
                        <span>{step}</span>
                      </motion.li>
                    ))}
                    </ul>
                  )}
                </motion.div>
              )}

              {(selectedSection === 'all' || selectedSection === 'overview') && report?.success_metrics && report.success_metrics.length > 0 && (
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.62 }}
                  className="rounded-2xl border border-cyan-400/20 bg-cyan-500/10 p-8 backdrop-blur-md shadow-lg shadow-slate-950/20"
                >
                  <button
                    type="button"
                    onClick={() => toggleSection('metrics')}
                    className="mb-6 flex w-full items-center justify-between text-left"
                  >
                    <h2 className="text-2xl font-semibold text-slate-50">Success Metrics</h2>
                    <ChevronDown className={`h-5 w-5 text-slate-300 transition-transform ${collapsedSections.metrics ? '-rotate-90' : 'rotate-0'}`} />
                  </button>
                  {!collapsedSections.metrics && (
                    <div className="grid gap-3 md:grid-cols-2 xl:grid-cols-3">
                    {report.success_metrics.map((metric: string, i: number) => (
                      <div key={i} className="rounded-xl border border-white/10 bg-slate-950/45 px-4 py-3 text-slate-300">
                        {metric}
                      </div>
                    ))}
                    </div>
                  )}
                </motion.div>
              )}

              {/* CTA */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.7 }}
                className="text-center py-12"
              >
                <Link href="/">
                  <motion.a
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    className="inline-block rounded-full border border-sky-300/20 bg-sky-400/10 px-8 py-4 font-semibold text-sky-50 transition-all hover:bg-sky-400/15 hover:shadow-lg hover:shadow-sky-950/30"
                  >
                    Analyze Another Idea
                  </motion.a>
                </Link>
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  )
}
