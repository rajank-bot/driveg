'use client'

import { useEffect, useRef, useState } from 'react'
import * as Dialog from '@radix-ui/react-dialog'

interface RenameDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  currentName: string
  isFolder: boolean
  onRename: (newName: string) => Promise<void>
}

export default function RenameDialog({
  open,
  onOpenChange,
  currentName,
  isFolder,
  onRename,
}: RenameDialogProps) {
  const [newName, setNewName] = useState('')
  const inputRef = useRef<HTMLInputElement>(null)
  const [isLoading, setIsLoading] = useState(false)

  // Extract name without extension for files
  const nameWithoutExt = isFolder
    ? currentName
    : currentName.substring(0, currentName.lastIndexOf('.')) || currentName
  const ext = isFolder
    ? ''
    : currentName.substring(currentName.lastIndexOf('.')) || ''

  // Initialize name when dialog opens
  useEffect(() => {
    if (open) {
      setNewName(nameWithoutExt)
      // Focus and select text when dialog opens
      if (inputRef.current) {
        requestAnimationFrame(() => {
          inputRef.current?.focus()
          setTimeout(() => {
            inputRef.current?.select()
          }, 10)
        })
      }
    } else {
      // Reset when dialog closes
      setNewName('')
    }
  }, [open, nameWithoutExt])

  const handleRename = async () => {
    const trimmedName = newName.trim()
    if (!trimmedName) {
      return
    }

    const finalName = isFolder ? trimmedName : trimmedName + ext

    // Don't rename if name hasn't changed
    if (finalName === currentName) {
      onOpenChange(false)
      return
    }

    setIsLoading(true)
    try {
      await onRename(finalName)
      onOpenChange(false)
    } catch (error) {
      console.error('Failed to rename:', error)
      alert('Failed to rename. Please try again.')
    } finally {
      setIsLoading(false)
    }
  }

  const handleCancel = () => {
    onOpenChange(false)
    setNewName(nameWithoutExt)
  }

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      handleRename()
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
            e.preventDefault()
            setTimeout(() => {
              inputRef.current?.focus()
              inputRef.current?.select()
            }, 0)
          }}
          onEscapeKeyDown={handleCancel}
        >
          <Dialog.Title className="text-xl font-medium text-gray-900 mb-4">
            Rename
          </Dialog.Title>

          <div className="mb-6">
            <input
              ref={inputRef}
              type="text"
              value={newName}
              onChange={(e) => setNewName(e.target.value)}
              onKeyDown={handleKeyDown}
              className="w-full px-3 py-2 border border-blue-500 rounded focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 text-base"
              placeholder={nameWithoutExt}
              disabled={isLoading}
              autoFocus
            />
          </div>

          <div className="flex justify-end gap-3">
            <button
              onClick={handleCancel}
              disabled={isLoading}
              className="px-4 py-2 text-sm font-medium text-blue-600 bg-white border border-gray-300 rounded hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              Cancel
            </button>
            <button
              onClick={handleRename}
              disabled={isLoading || !newName.trim()}
              className="px-4 py-2 text-sm font-medium text-white bg-blue-600 rounded hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              OK
            </button>
          </div>

          <Dialog.Close asChild>
            <button
              className="absolute top-4 right-4 text-gray-400 hover:text-gray-600 focus:outline-none focus:ring-2 focus:ring-blue-500 rounded"
              aria-label="Close"
              onClick={handleCancel}
            >
              <svg
                className="w-5 h-5"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M6 18L18 6M6 6l12 12"
                />
              </svg>
            </button>
          </Dialog.Close>
        </Dialog.Content>
      </Dialog.Portal>
    </Dialog.Root>
  )
}

