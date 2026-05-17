import type { Metadata } from 'next'
import { Manrope } from 'next/font/google'
import './globals.css'

const manrope = Manrope({ subsets: ['latin'] })

export const metadata: Metadata = {
  title: 'SimplifIQ | Automated Lead Intelligence Platform',
  description: 'Enterprise-grade lead enrichment, report generation, and automated follow-up for high-intent inbound prospects.',
  keywords: 'lead enrichment, business audit, workflow automation, enterprise AI, prospect intelligence',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={manrope.className} suppressHydrationWarning>
        {children}
      </body>
    </html>
  )
}
