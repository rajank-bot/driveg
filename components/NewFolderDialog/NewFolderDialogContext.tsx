'use client'

import { createContext, useContext, useState, ReactNode } from 'react'
import { useAppSelector } from '@/lib/hooks'
import NewFolderDialog from './NewFolderDialog'

interface NewFolderDialogContextType {
  openDialog: (parentId?: string | null) => void
  closeDialog: () => void
}

const NewFolderDialogContext = createContext<NewFolderDialogContextType | undefined>(undefined)

export function NewFolderDialogProvider({ children }: { children: ReactNode }) {
  const [open, setOpen] = useState(false)
  const [explicitParentId, setExplicitParentId] = useState<string | null | undefined>(undefined)
  const currentFolderId = useAppSelector((state: any) => state.drive.currentFolderId)

  // Use explicit parentId if provided, otherwise use current folder from Redux
  const parentId = explicitParentId !== undefined ? explicitParentId : currentFolderId

  const openDialog = (id?: string | null) => {
    setExplicitParentId(id)
    setOpen(true)
  }

  const closeDialog = () => {
    setOpen(false)
    setExplicitParentId(undefined)
  }

  return (
    <NewFolderDialogContext.Provider value={{ openDialog, closeDialog }}>
      {children}
      <NewFolderDialog open={open} onOpenChange={setOpen} parentId={parentId} />
    </NewFolderDialogContext.Provider>
  )
}

export function useNewFolderDialog() {
  const context = useContext(NewFolderDialogContext)
  if (context === undefined) {
    throw new Error('useNewFolderDialog must be used within a NewFolderDialogProvider')
  }
  return context
}

