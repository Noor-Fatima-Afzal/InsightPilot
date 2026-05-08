'use client'

import React, { useState } from 'react'
import { motion } from 'framer-motion'
import { useRouter } from 'next/navigation'
import { Logo } from '@/components/Logo'
import { GradientText } from '@/components/UI'
import { researchAPI, type ResearchQuery } from '@/lib/api'
import { useResearchStore } from '@/lib/store'
import { ChevronRight, Sparkles, Brain, TrendingUp, Zap, Target, BarChart3, Clock, Globe, Search } from 'lucide-react'

export default function Home() {
  const router = useRouter()
  const [businessIdea, setBusinessIdea] = useState('')
  const [companyName, setCompanyName] = useState('')
  const [niche, setNiche] = useState('')
  const [analysisMode, setAnalysisMode] = useState<'research' | 'company_audit'>('research')
  const [auditSubject, setAuditSubject] = useState('')
  const [auditFocus, setAuditFocus] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [navOpen, setNavOpen] = useState(false)

  const { setSessionId } = useResearchStore()

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError(null)
    setIsLoading(true)

    try {
      if (analysisMode === 'research' && (!businessIdea.trim() || !companyName.trim() || !niche.trim())) {
        setError('Please fill in all fields')
        setIsLoading(false)
        return
      }

      if (analysisMode === 'company_audit' && (!auditSubject.trim() || !niche.trim())) {
        setError('Please add a website or company name and target market')
        setIsLoading(false)
        return
      }

      const query: ResearchQuery = analysisMode === 'company_audit'
        ? {
          business_idea: `Company audit for ${auditSubject}`,
          company_name: auditSubject,
          niche: niche || auditFocus || 'general market',
          analysis_mode: analysisMode,
          additional_context: [
            `focus=${auditFocus || niche || 'client-ready strategy brief'}`,
            `subject=${auditSubject}`,
            'goal=source-backed company audit with competitor map, positioning gaps, ICP, GTM ideas, and shareable summary',
          ].join(' | '),
        }
        : {
          business_idea: businessIdea,
          company_name: companyName,
          niche: niche,
          analysis_mode: analysisMode,
        }

      const response = await researchAPI.startResearch(query)
      setSessionId(response.session_id)
      router.push(`/research/${response.session_id}`)
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to start research')
      setIsLoading(false)
    }
  }

  const features = [
    {
      icon: Brain,
      title: 'Autonomous Research',
      description: 'AI agents autonomously gather web intelligence and market data in real-time',
    },
    {
      icon: TrendingUp,
      title: 'Competitive Analysis',
      description: 'Deep market analysis with competitor mapping and positioning insights',
    },
    {
      icon: BarChart3,
      title: 'Strategic Insights',
      description: 'AI-driven strategic recommendations based on comprehensive market analysis',
    },
    {
      icon: Zap,
      title: 'Lightning Fast',
      description: 'Get results in minutes instead of weeks with autonomous agents',
    },
    {
      icon: Target,
      title: 'Actionable Recommendations',
      description: 'Ready-to-execute strategies for product-market fit and growth',
    },
    {
      icon: Sparkles,
      title: 'Executive Reports',
      description: 'Professional reports ready for investors and stakeholders',
    },
  ]

  const useCases = [
    {
      title: 'Startup Founders',
      description: 'Validate ideas and understand competitive landscape before launch',
      icon: Zap,
    },
    {
      title: 'Product Managers',
      description: 'Make data-driven decisions about features and market positioning',
      icon: Target,
    },
    {
      title: 'Investors',
      description: 'Due diligence on market opportunities and competitive dynamics',
      icon: TrendingUp,
    },
    {
      title: 'Business Development',
      description: 'Identify partnership opportunities and market expansion strategies',
      icon: Brain,
    },
  ]

  const workflowSteps = [
    {
      number: 1,
      title: 'Submit Your Idea',
      description: 'Enter your business concept, company name, and target niche',
    },
    {
      number: 2,
      title: 'Research Phase',
      description: 'Autonomous agents search the web for market data and trends',
    },
    {
      number: 3,
      title: 'Analyze Competition',
      description: 'Deep analysis of competitors, strengths, weaknesses & positioning',
    },
    {
      number: 4,
      title: 'Strategic Insights',
      description: 'AI generates strategic recommendations and market opportunities',
    },
    {
      number: 5,
      title: 'Generate Report',
      description: 'Professional executive report with actionable insights',
    },
    {
      number: 6,
      title: 'Download Results',
      description: 'Export report and continue your strategic planning',
    },
  ]

  const navItems = [
    { label: 'Services', href: '#services' },
    { label: 'How It Works', href: '#how-it-works' },
    { label: 'Features', href: '#features' },
    { label: 'Use Cases', href: '#use-cases' },
    { label: 'Docs', href: '#' },
  ]

  const isAuditMode = analysisMode === 'company_audit'

  const handleServiceSelect = (mode: 'research' | 'company_audit') => {
    setAnalysisMode(mode)
    setTimeout(() => {
      document.getElementById('input')?.scrollIntoView({ behavior: 'smooth' })
    }, 100)
  }

  return (
    <div className="min-h-screen overflow-hidden">
      {/* Animated background */}
      <div className="fixed inset-0 opacity-20 pointer-events-none">
        <motion.div
          className="absolute top-0 left-1/4 w-96 h-96 bg-blue-600 rounded-full blur-3xl"
          animate={{ y: [0, 50, 0], x: [0, 30, 0] }}
          transition={{ duration: 8, repeat: Infinity }}
        />
        <motion.div
          className="absolute top-1/3 right-1/4 w-96 h-96 bg-purple-600 rounded-full blur-3xl"
          animate={{ y: [50, 0, 50], x: [-30, 0, -30] }}
          transition={{ duration: 10, repeat: Infinity }}
        />
        <motion.div
          className="absolute bottom-0 left-1/2 w-96 h-96 bg-pink-600 rounded-full blur-3xl"
          animate={{ y: [0, -50, 0], x: [30, 0, 30] }}
          transition={{ duration: 12, repeat: Infinity }}
        />
      </div>

      {/* Content */}
      <div className="relative z-10">
        {/* Header/Navbar */}
        <motion.header
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="border-b border-white/10 backdrop-blur-md sticky top-0 z-40"
        >
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 flex items-center justify-between">
            <Logo />
            <nav className="hidden md:flex gap-8 text-sm items-center">
              {navItems.map((item) => (
                <motion.a
                  key={item.label}
                  href={item.href}
                  whileHover={{ color: '#60a5fa' }}
                  className="text-gray-300 hover:text-blue-400 transition-colors"
                >
                  {item.label}
                </motion.a>
              ))}
              <motion.a
                href="#input"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="px-6 py-2 bg-gradient-to-r from-blue-600 to-purple-600 rounded-lg font-semibold hover:shadow-lg hover:shadow-purple-500/30 transition-all"
              >
                Get Started
              </motion.a>
            </nav>
            <button
              className="md:hidden text-white"
              onClick={() => setNavOpen(!navOpen)}
            >
              ☰
            </button>
          </div>
        </motion.header>

        {/* Hero Section */}
        <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-24">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="text-center"
          >
            <motion.h1
              suppressHydrationWarning
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1, duration: 0.8 }}
              className="text-5xl md:text-6xl font-bold mb-6 leading-tight"
            >
              <GradientText>Enterprise AI Intelligence</GradientText>
            </motion.h1>

            <motion.p
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2, duration: 0.8 }}
              className="text-xl text-gray-300 mb-8 leading-relaxed max-w-3xl mx-auto"
            >
              Two powerful AI services for business intelligence. Validate your startup ideas with comprehensive market research, or audit any company with source-backed competitive analysis.
            </motion.p>

            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3, duration: 0.8 }}
              className="flex gap-4 flex-wrap justify-center"
            >
              <motion.a
                href="#services"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="px-8 py-4 bg-gradient-to-r from-blue-600 via-purple-600 to-pink-600 rounded-lg font-semibold hover:shadow-lg hover:shadow-purple-500/50 transition-all"
              >
                Explore Services
              </motion.a>
              <motion.a
                href="#how-it-works"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="px-8 py-4 border border-white/30 rounded-lg font-semibold hover:border-white/60 transition-all"
              >
                Learn More
              </motion.a>
            </motion.div>

            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.5 }}
              className="flex gap-8 mt-12 text-sm justify-center"
            >
              <div>
                <p className="text-blue-400 font-bold text-2xl">2</p>
                <p className="text-gray-400">Services</p>
              </div>
              <div>
                <p className="text-purple-400 font-bold text-2xl">500+</p>
                <p className="text-gray-400">Analyses run</p>
              </div>
              <div>
                <p className="text-pink-400 font-bold text-2xl">99%</p>
                <p className="text-gray-400">Accuracy rate</p>
              </div>
            </motion.div>
          </motion.div>
        </section>

        {/* Services Section */}
        <section id="services" className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-24 border-t border-white/10">
          <motion.div
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <h2 className="text-4xl font-bold mb-4">Our Services</h2>
            <p className="text-gray-300 text-lg max-w-2xl mx-auto">
              Choose the service that fits your needs. Both powered by advanced AI agents and real-time web research.
            </p>
          </motion.div>

          <div className="grid md:grid-cols-2 gap-8 mb-8">
            {/* Strategy Research Service */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.1 }}
              onClick={() => handleServiceSelect('research')}
              className="p-8 rounded-2xl border border-blue-500/30 bg-gradient-to-br from-blue-600/10 to-purple-600/10 backdrop-blur-md hover:border-blue-500/60 transition-all cursor-pointer hover:shadow-lg hover:shadow-blue-600/20"
            >
              <div className="flex items-start justify-between mb-4">
                <div className="w-14 h-14 rounded-lg bg-gradient-to-br from-blue-600 to-purple-600 flex items-center justify-center">
                  <Brain className="w-7 h-7 text-white" />
                </div>
                <span className="px-3 py-1 rounded-full bg-blue-500/20 text-blue-200 text-xs font-semibold">Most Popular</span>
              </div>
              <h3 className="text-2xl font-bold mb-3">Strategy Research</h3>
              <p className="text-gray-300 mb-6">Validate your startup idea with comprehensive market research, competitive analysis, and strategic recommendations.</p>
              <ul className="space-y-3 mb-8">
                <li className="flex items-center gap-3 text-gray-200">
                  <span className="w-2 h-2 rounded-full bg-blue-400" />
                  Market opportunity assessment
                </li>
                <li className="flex items-center gap-3 text-gray-200">
                  <span className="w-2 h-2 rounded-full bg-blue-400" />
                  Competitor landscape analysis
                </li>
                <li className="flex items-center gap-3 text-gray-200">
                  <span className="w-2 h-2 rounded-full bg-blue-400" />
                  Investor-ready reports
                </li>
                <li className="flex items-center gap-3 text-gray-200">
                  <span className="w-2 h-2 rounded-full bg-blue-400" />
                  Go-to-market strategy
                </li>
              </ul>
              <button className="w-full py-3 bg-blue-600 hover:bg-blue-700 rounded-lg font-semibold transition-colors">
                Get Started →
              </button>
            </motion.div>

            {/* Company Audit Service */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.2 }}
              onClick={() => handleServiceSelect('company_audit')}
              className="p-8 rounded-2xl border border-sky-500/30 bg-gradient-to-br from-sky-600/10 to-cyan-600/10 backdrop-blur-md hover:border-sky-500/60 transition-all cursor-pointer hover:shadow-lg hover:shadow-sky-600/20"
            >
              <div className="flex items-start justify-between mb-4">
                <div className="w-14 h-14 rounded-lg bg-gradient-to-br from-sky-600 to-cyan-600 flex items-center justify-center">
                  <Globe className="w-7 h-7 text-white" />
                </div>
                <span className="px-3 py-1 rounded-full bg-sky-500/20 text-sky-200 text-xs font-semibold">For Agencies</span>
              </div>
              <h3 className="text-2xl font-bold mb-3">Company Audit</h3>
              <p className="text-gray-300 mb-6">Paste any website or company name and get a source-backed audit brief with positioning gaps, ICP, and GTM ideas.</p>
              <ul className="space-y-3 mb-8">
                <li className="flex items-center gap-3 text-gray-200">
                  <span className="w-2 h-2 rounded-full bg-sky-400" />
                  One-click company audits
                </li>
                <li className="flex items-center gap-3 text-gray-200">
                  <span className="w-2 h-2 rounded-full bg-sky-400" />
                  Positioning gap analysis
                </li>
                <li className="flex items-center gap-3 text-gray-200">
                  <span className="w-2 h-2 rounded-full bg-sky-400" />
                  Client-ready briefs
                </li>
                <li className="flex items-center gap-3 text-gray-200">
                  <span className="w-2 h-2 rounded-full bg-sky-400" />
                  Shareable report links
                </li>
              </ul>
              <button className="w-full py-3 bg-sky-600 hover:bg-sky-700 rounded-lg font-semibold transition-colors">
                Get Started →
              </button>
            </motion.div>
          </div>
        </section>

        {/* How It Works */}
        <section id="how-it-works" className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-24">
          <motion.div
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <h2 className="text-4xl font-bold mb-4">How It Works</h2>
            <p className="text-gray-300 text-lg">
              {analysisMode === 'research' ? 'Strategy Research Workflow' : 'Company Audit Process'}
            </p>
          </motion.div>

          <div className={`grid gap-8 ${analysisMode === 'research' ? 'md:grid-cols-3' : 'md:grid-cols-2'}`}>
            {workflowSteps.map((step, i) => {
              // Show all 6 steps for research mode
              if (analysisMode === 'research') {
                return (
                  <motion.div
                    key={step.number}
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ delay: i * 0.1 }}
                    className="relative p-6 rounded-lg border border-white/10 bg-white/5 backdrop-blur-md hover:bg-white/10 transition-all"
                  >
                    <div className="absolute -top-4 -left-4 w-12 h-12 rounded-full bg-gradient-to-r from-blue-600 to-purple-600 flex items-center justify-center text-lg font-bold">
                      {step.number}
                    </div>
                    <h3 className="text-xl font-bold mb-3 pt-2">{step.title}</h3>
                    <p className="text-gray-400">{step.description}</p>
                  </motion.div>
                )
              }
              // Show only first 3 steps for audit mode with different titles
              if (i >= 3) return null
              
              const auditSteps = [
                { title: 'Paste Website or Company', description: 'Enter any website URL or company name' },
                { title: 'Run Instant Audit', description: 'Our AI agents gather competitive intelligence and analyze positioning' },
                { title: 'Get Client-Ready Brief', description: 'Download source-backed report with gaps, ICP, and GTM ideas' },
              ]
              
              const auditStep = auditSteps[i]
              return (
                <motion.div
                  key={step.number}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: i * 0.1 }}
                  className="relative p-6 rounded-lg border border-white/10 bg-white/5 backdrop-blur-md hover:bg-white/10 transition-all"
                >
                  <div className="absolute -top-4 -left-4 w-12 h-12 rounded-full bg-gradient-to-r from-sky-600 to-cyan-600 flex items-center justify-center text-lg font-bold">
                    {i + 1}
                  </div>
                  <h3 className="text-xl font-bold mb-3 pt-2">{auditStep.title}</h3>
                  <p className="text-gray-400">{auditStep.description}</p>
                </motion.div>
              )
            })}
          </div>
        </section>

        {/* Features */}
        <section id="features" className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-24">
          <motion.div
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <h2 className="text-4xl font-bold mb-4">
              Powered by <GradientText as="span">Autonomous AI Agents</GradientText>
            </h2>
            <p className="text-gray-300 text-lg">
              Enterprise-grade AI for business intelligence
            </p>
          </motion.div>

          <div className="grid md:grid-cols-3 gap-8">
            {features.map((feature, i) => (
              <motion.div
                key={feature.title}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1 }}
                className="p-6 rounded-lg border border-white/10 bg-white/5 backdrop-blur-md hover:bg-white/10 transition-all group"
              >
                <motion.div
                  whileHover={{ scale: 1.1 }}
                  className="mb-4"
                >
                  <feature.icon className="w-12 h-12 text-blue-400 group-hover:text-purple-400 transition-colors" />
                </motion.div>
                <h3 className="text-xl font-bold mb-2">{feature.title}</h3>
                <p className="text-gray-400">{feature.description}</p>
              </motion.div>
            ))}
          </div>
        </section>

        {/* Use Cases */}
        <section id="use-cases" className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-24">
          <motion.div
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <h2 className="text-4xl font-bold mb-4">Built for Different Roles</h2>
            <p className="text-gray-300 text-lg">
              From founders to investors, everyone benefits from intelligent market insights
            </p>
          </motion.div>

          <div className="grid md:grid-cols-4 gap-6">
            {useCases.map((useCase, i) => (
              <motion.div
                key={useCase.title}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1 }}
                className="p-6 rounded-lg border border-white/10 bg-gradient-to-br from-white/10 to-white/5 backdrop-blur-md hover:border-white/30 transition-all cursor-pointer"
              >
                <useCase.icon className="w-8 h-8 text-blue-400 mb-3" />
                <h3 className="font-bold mb-2">{useCase.title}</h3>
                <p className="text-sm text-gray-400">{useCase.description}</p>
              </motion.div>
            ))}
          </div>
        </section>

        {/* Input Form */}
        <section id="input" className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-24">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="p-8 rounded-2xl border border-white/10 bg-gradient-to-br from-white/10 to-white/5 backdrop-blur-md"
          >
            <div className="mb-8">
              {analysisMode === 'research' ? (
                <>
                  <div className="inline-flex items-center gap-2 rounded-full border border-blue-500/20 bg-blue-500/10 px-4 py-2 mb-4">
                    <Brain className="w-4 h-4 text-blue-400" />
                    <span className="text-sm font-semibold text-blue-200">Strategy Research</span>
                  </div>
                  <h2 className="text-3xl font-bold mb-2">Validate Your Startup Idea</h2>
                  <p className="text-gray-400 text-lg">
                    Enter your business concept and we'll analyze the market, competition, and create a comprehensive strategy
                  </p>
                </>
              ) : (
                <>
                  <div className="inline-flex items-center gap-2 rounded-full border border-sky-500/20 bg-sky-500/10 px-4 py-2 mb-4">
                    <Globe className="w-4 h-4 text-sky-400" />
                    <span className="text-sm font-semibold text-sky-200">Company Audit</span>
                  </div>
                  <h2 className="text-3xl font-bold mb-2">Audit Any Company</h2>
                  <p className="text-gray-400 text-lg">
                    Paste a website or company name to get a source-backed competitive intelligence brief
                  </p>
                </>
              )}
            </div>

            <form onSubmit={handleSubmit} className="space-y-6">
              {isAuditMode ? (
                <>
                  <div>
                    <label className="block text-sm font-semibold mb-2">
                      Website or Company Name
                    </label>
                    <input
                      type="text"
                      value={auditSubject}
                      onChange={(e) => setAuditSubject(e.target.value)}
                      placeholder="e.g., https://company.com or Notion"
                      className="w-full px-4 py-3 rounded-lg bg-white/10 border border-white/20 placeholder-gray-500 focus:border-sky-500 focus:outline-none transition-colors"
                    />
                  </div>

                  <div className="grid md:grid-cols-2 gap-6">
                    <div>
                      <label className="block text-sm font-semibold mb-2">
                        Target Market
                      </label>
                      <input
                        type="text"
                        value={niche}
                        onChange={(e) => setNiche(e.target.value)}
                        placeholder="e.g., B2B SaaS, ecommerce, fintech"
                        className="w-full px-4 py-3 rounded-lg bg-white/10 border border-white/20 placeholder-gray-500 focus:border-sky-500 focus:outline-none transition-colors"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-semibold mb-2">
                        Audit Focus
                      </label>
                      <input
                        type="text"
                        value={auditFocus}
                        onChange={(e) => setAuditFocus(e.target.value)}
                        placeholder="e.g., positioning and go-to-market"
                        className="w-full px-4 py-3 rounded-lg bg-white/10 border border-white/20 placeholder-gray-500 focus:border-sky-500 focus:outline-none transition-colors"
                      />
                    </div>
                  </div>
                </>
              ) : (
                <>
                  <div>
                    <label className="block text-sm font-semibold mb-2">
                      Business Idea
                    </label>
                    <input
                      type="text"
                      value={businessIdea}
                      onChange={(e) => setBusinessIdea(e.target.value)}
                      placeholder="e.g., An AI-powered customer support platform"
                      className="w-full px-4 py-3 rounded-lg bg-white/10 border border-white/20 placeholder-gray-500 focus:border-blue-500 focus:outline-none transition-colors"
                    />
                  </div>

                  <div className="grid md:grid-cols-2 gap-6">
                    <div>
                      <label className="block text-sm font-semibold mb-2">
                        Company Name
                      </label>
                      <input
                        type="text"
                        value={companyName}
                        onChange={(e) => setCompanyName(e.target.value)}
                        placeholder="e.g., SupportAI"
                        className="w-full px-4 py-3 rounded-lg bg-white/10 border border-white/20 placeholder-gray-500 focus:border-blue-500 focus:outline-none transition-colors"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-semibold mb-2">
                        Target Niche
                      </label>
                      <input
                        type="text"
                        value={niche}
                        onChange={(e) => setNiche(e.target.value)}
                        placeholder="e.g., B2B SaaS"
                        className="w-full px-4 py-3 rounded-lg bg-white/10 border border-white/20 placeholder-gray-500 focus:border-blue-500 focus:outline-none transition-colors"
                      />
                    </div>
                  </div>
                </>
              )}

              <div className="rounded-xl border border-white/10 bg-white/5 p-4 text-sm text-slate-300">
                {isAuditMode ? (
                  <p className="flex items-start gap-2"><Search className="mt-0.5 h-4 w-4 text-sky-300 flex-shrink-0" />Paste a company or website and get a source-backed audit brief with competitor mapping, positioning gaps, ICP, and GTM ideas.</p>
                ) : (
                  <p className="flex items-start gap-2"><Sparkles className="mt-0.5 h-4 w-4 text-blue-300 flex-shrink-0" />Enter your startup idea to get comprehensive market analysis, competitor research, and investor-ready strategy.</p>
                )}
              </div>

              <div className="mt-6 flex items-center gap-2">
                <motion.button
                  type="button"
                  onClick={() => handleServiceSelect(analysisMode === 'research' ? 'company_audit' : 'research')}
                  whileHover={{ scale: 1.02 }}
                  className="px-4 py-2 text-sm border border-white/20 rounded-lg hover:border-white/40 transition-colors text-gray-300"
                >
                  Switch to {analysisMode === 'research' ? 'Company Audit' : 'Strategy Research'}
                </motion.button>
              </div>

              {error && (
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  className="p-4 rounded-lg bg-red-500/10 border border-red-500/50 text-red-200"
                >
                  {error}
                </motion.div>
              )}

              <motion.button
                type="submit"
                disabled={isLoading}
                whileHover={!isLoading ? { scale: 1.02 } : {}}
                whileTap={!isLoading ? { scale: 0.98 } : {}}
                className="w-full py-4 bg-gradient-to-r from-blue-600 via-purple-600 to-pink-600 rounded-lg font-semibold hover:shadow-lg hover:shadow-purple-500/50 transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2 text-lg"
              >
                {isLoading ? (
                  <>
                    <motion.div
                      animate={{ rotate: 360 }}
                      transition={{ duration: 1, repeat: Infinity }}
                      className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full"
                    />
                    Analyzing...
                  </>
                ) : (
                  <>
                    <Sparkles className="w-5 h-5" />
                    Launch Analysis
                  </>
                )}
              </motion.button>
            </form>
          </motion.div>
        </section>

        {/* Footer */}
        <motion.footer
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          className="border-t border-white/10 py-12 mt-24"
        >
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="grid md:grid-cols-4 gap-8 mb-8">
              <div>
                <h3 className="font-bold mb-4">Product</h3>
                <ul className="space-y-2 text-sm text-gray-400">
                  <li><a href="#" className="hover:text-white transition">Features</a></li>
                  <li><a href="#" className="hover:text-white transition">Pricing</a></li>
                  <li><a href="#" className="hover:text-white transition">Security</a></li>
                </ul>
              </div>
              <div>
                <h3 className="font-bold mb-4">Developers</h3>
                <ul className="space-y-2 text-sm text-gray-400">
                  <li><a href="#" className="hover:text-white transition">Documentation</a></li>
                  <li><a href="#" className="hover:text-white transition">API Reference</a></li>
                  <li><a href="#" className="hover:text-white transition">GitHub</a></li>
                </ul>
              </div>
              <div>
                <h3 className="font-bold mb-4">Company</h3>
                <ul className="space-y-2 text-sm text-gray-400">
                  <li><a href="#" className="hover:text-white transition">About</a></li>
                  <li><a href="#" className="hover:text-white transition">Blog</a></li>
                  <li><a href="#" className="hover:text-white transition">Contact</a></li>
                </ul>
              </div>
              <div>
                <h3 className="font-bold mb-4">Legal</h3>
                <ul className="space-y-2 text-sm text-gray-400">
                  <li><a href="#" className="hover:text-white transition">Privacy</a></li>
                  <li><a href="#" className="hover:text-white transition">Terms</a></li>
                  <li><a href="#" className="hover:text-white transition">Cookies</a></li>
                </ul>
              </div>
            </div>
            <div className="border-t border-white/10 pt-8 text-center text-gray-400">
              <p>
                © 2025 InsightPilot AI. Powered by Groq, Tavily, and LangGraph.
              </p>
              <p className="text-sm mt-2">
                Built for the future of AI consulting.
              </p>
            </div>
          </div>
        </motion.footer>
      </div>
    </div>
  )
}
