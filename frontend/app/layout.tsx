import type React from 'react'
import '../styles/globals.css'

export const metadata = {
  title: 'InsightPilot AI',
  description: 'Multi-agent strategy research and company audit platform for founders, consultants, and analysts',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <head>
        <meta charSet="utf-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <link
          href="https://fonts.googleapis.com/css2?family=Inter:wght@100;200;300;400;500;600;700;800;900&display=swap"
          rel="stylesheet"
        />
      </head>
      <body className="bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 text-white">
        <div className="min-h-screen">
          {children}
        </div>
      </body>
    </html>
  )
}
