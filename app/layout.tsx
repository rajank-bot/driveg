import type { Metadata } from 'next'
import './globals.css'
import { StoreProvider } from '@/lib';

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
    
      <body className="antialiased min-h-screen bg-gray-50"><StoreProvider>{children}</StoreProvider></body>
    </html>
  )
}

