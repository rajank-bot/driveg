'use client'

import { ReactNode } from 'react'
import { StoreProvider } from '@/lib'
import { NewFolderDialogProvider } from '@/components/NewFolderDialog'
import { ToastProvider } from '@/components/ui/ToastProvider'

export function Providers({ children }: { children: ReactNode }) {
  return (
    <StoreProvider>
      <ToastProvider>
        <NewFolderDialogProvider>
          {children}
        </NewFolderDialogProvider>
      </ToastProvider>
    </StoreProvider>
  )
}

