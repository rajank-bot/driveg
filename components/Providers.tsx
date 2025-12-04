'use client'

import { ReactNode } from 'react'
import { StoreProvider } from '@/lib'
import { NewFolderDialogProvider } from '@/components/NewFolderDialog'

export function Providers({ children }: { children: ReactNode }) {
  return (
    <StoreProvider>
      <NewFolderDialogProvider>
        {children}
      </NewFolderDialogProvider>
    </StoreProvider>
  )
}

