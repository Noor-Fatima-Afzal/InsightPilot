'use client'

import { motion } from 'framer-motion'

interface GradientTextProps {
  children: string
  as?: 'h1' | 'h2' | 'h3' | 'p' | 'span'
  className?: string
}

export function GradientText({
  children,
  as: Component = 'h1',
  className = '',
}: GradientTextProps) {
  return (
    <Component
      className={`bg-gradient-to-r from-blue-600 via-purple-600 to-pink-600 bg-clip-text text-transparent ${className}`}
    >
      {children}
    </Component>
  )
}

interface CardProps {
  children: React.ReactNode
  className?: string
  delay?: number
  hover?: boolean
}

export function Card({ children, className = '', delay = 0, hover = true }: CardProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay, duration: 0.5 }}
      className={`relative rounded-lg border border-white/10 bg-white/5 backdrop-blur-md p-6 ${
        hover ? 'hover:bg-white/10 hover:border-white/20 transition-all' : ''
      } ${className}`}
    >
      {children}
    </motion.div>
  )
}

interface GlassProps {
  children: React.ReactNode
  className?: string
}

export function Glass({ children, className = '' }: GlassProps) {
  return (
    <div
      className={`rounded-lg border border-white/10 bg-white/5 backdrop-blur-xl ${className}`}
    >
      {children}
    </div>
  )
}
