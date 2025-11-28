import type { Metadata } from 'next'
import './globals.css'
import StoreProvider from '@/lib/StoreProvider'

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
      <body>
        <StoreProvider>{children}</StoreProvider>
      </body>
    </html>
  )
}

