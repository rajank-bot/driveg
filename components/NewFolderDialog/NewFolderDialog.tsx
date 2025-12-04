'use client'

import { useEffect, useRef, useState } from 'react'
import * as Dialog from '@radix-ui/react-dialog'
import { useAppDispatch, useAppSelector } from '@/lib/hooks'
import { createFile } from '@/lib/store/thunks/driveThunks'

interface NewFolderDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  parentId?: string | null
}

export default function NewFolderDialog({
  open,
  onOpenChange,
  parentId = null,
}: NewFolderDialogProps) {
  const dispatch = useAppDispatch()
  const isLoading = useAppSelector((state: any) => state.drive.isLoading)
  const [folderName, setFolderName] = useState('Untitled folder')
  const inputRef = useRef<HTMLInputElement>(null)

  // Select all text when dialog opens
  useEffect(() => {
    if (open && inputRef.current) {
      // Use requestAnimationFrame to ensure the dialog is fully rendered
      requestAnimationFrame(() => {
        // Focus the input first, then select all text
        inputRef.current?.focus()
        // Small delay to ensure focus is complete before selecting
        setTimeout(() => {
          inputRef.current?.select()
        }, 10)
      })
    } else if (!open) {
      // Reset folder name when dialog closes
      setFolderName('Untitled folder')
    }
  }, [open])

  const handleCreate = async () => {
    const name = folderName.trim() || 'Untitled folder'
    
    try {
      const result = await dispatch(
        createFile({
          name,
          type: 'folder',
          parentId,
        }) as any
      )
      if (createFile.fulfilled.match(result)) {
        onOpenChange(false)
        setFolderName('Untitled folder')
      }
    } catch (error) {
      console.error('Failed to create folder:', error)
    }
  }

  const handleCancel = () => {
    onOpenChange(false)
    setFolderName('Untitled folder')
  }

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      handleCreate()
    } else if (e.key === 'Escape') {
      handleCancel()
    }
  }

  // Don't render anything if dialog is closed
  if (!open) {
    return null
  }

  return (
    <Dialog.Root open={open} onOpenChange={onOpenChange}>
      <Dialog.Portal>
        <Dialog.Overlay className="fixed inset-0 bg-black/50 z-[100]" />
        <Dialog.Content
          className="fixed top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 bg-white rounded-lg shadow-xl z-[100] w-[90vw] max-w-md p-6 focus:outline-none"
          onOpenAutoFocus={(e) => {
            // Prevent default focus, we'll handle it manually
            e.preventDefault()
            // Focus and select the input after a brief delay
            setTimeout(() => {
              inputRef.current?.focus()
              inputRef.current?.select()
            }, 0)
          }}
          onEscapeKeyDown={handleCancel}
        >
          <Dialog.Title className="text-xl font-medium text-gray-900 mb-4">
            New folder
          </Dialog.Title>

          <div className="mb-6">
            <input
              ref={inputRef}
              type="text"
              value={folderName}
              onChange={(e) => setFolderName(e.target.value)}
              onKeyDown={handleKeyDown}
              className="w-full px-3 py-2 border border-blue-500 rounded focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 text-base"
              placeholder="Untitled folder"
              disabled={isLoading}
              autoFocus
            />
          </div>

          <div className="flex justify-end gap-3">
            <button
              type="button"
              onClick={handleCancel}
              disabled={isLoading}
              className="px-4 py-2 text-sm font-medium text-blue-600 hover:bg-blue-50 rounded disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
            >
              Cancel
            </button>
            <button
              type="button"
              onClick={handleCreate}
              disabled={isLoading || !folderName.trim()}
              className="px-4 py-2 text-sm font-medium text-blue-600 hover:bg-blue-50 rounded disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
            >
              Create
            </button>
          </div>
        </Dialog.Content>
      </Dialog.Portal>
    </Dialog.Root>
  )
}

