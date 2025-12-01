import type { Metadata } from 'next'
import './globals.css'

export const metadata: Metadata = {
  title: 'DriveG',
  description: 'A Next.js application',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body className="antialiased min-h-screen bg-gray-50">{children}</body>
    </html>
  )
}

