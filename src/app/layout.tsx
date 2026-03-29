import type { Metadata } from 'next'
import '@/styles/globals.css'
import { geistMono, geistSans } from '@/lib/font'

export const metadata: Metadata = {
  title: 'DevInsight - AI Repo Analyzer',
  description: 'Understand GitHub repos instantly',
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        {children}
      </body>
    </html>
  )
}
