'use client'

import { useState, useEffect, useRef, useCallback } from 'react'
import * as DropdownMenu from '@radix-ui/react-dropdown-menu'
import NewMenuGroup from './NewMenuGroup'
import { NEW_MENU_GROUPS } from '@/types/newMenuItems'
import UploadFileModal from '@/components/modals/uploadFileModal'

interface NewMenuProps {
  children?: React.ReactNode
  open?: boolean
  onOpenChange?: (open: boolean) => void
  anchorPosition?: { x: number; y: number } | null
}

export default function NewMenu({
  children,
  open,
  onOpenChange,
  anchorPosition,
}: NewMenuProps) {
  const [internalOpen, setInternalOpen] = useState(false)
  const fileInputRef = useRef<HTMLInputElement | null>(null)
  const [uploadModalOpen, setUploadModalOpen] = useState(false)
  const [pendingFiles, setPendingFiles] = useState<File[]>([])
  const isControlled = open !== undefined
  const menuOpen = isControlled ? (open as boolean) : internalOpen
  const fallbackTriggerStyle = anchorPosition
    ? {
        position: 'fixed' as const,
        left: anchorPosition.x,
        top: anchorPosition.y,
      }
    : {
        position: 'absolute' as const,
        left: -9999,
        top: -9999,
      }

  const setMenuOpen = useCallback(
    (nextOpen: boolean) => {
      if (!isControlled) {
        setInternalOpen(nextOpen)
      }
      onOpenChange?.(nextOpen)
    },
    [isControlled, onOpenChange],
  )
  
  console.log("pendingFiles", pendingFiles);

  const openUploadPanel = useCallback((fileList: FileList | null) => {
    if (!fileList || !fileList.length) return
    const selectedFiles = Array.from(fileList)
    setPendingFiles(selectedFiles)
    setUploadModalOpen(true)
    setMenuOpen(false)
  }, [setMenuOpen])

  const handleUploadPanelClose = useCallback(() => {
    setUploadModalOpen(false)
    setPendingFiles([])
  }, [])

  const triggerFileDialog = useCallback(() => {
    fileInputRef.current?.click()
  }, [])

  const handleFileSelection = useCallback(
    (event: React.ChangeEvent<HTMLInputElement>) => {
      const files = event.target.files
      openUploadPanel(files)
      event.target.value = ''
    },
    [openUploadPanel],
  )

  useEffect(() => {
    const handleVisibilityChange = () => {
      if (document.hidden) {
        setMenuOpen(false)
      }
    }

    document.addEventListener('visibilitychange', handleVisibilityChange)

    return () => {
      document.removeEventListener('visibilitychange', handleVisibilityChange)
    }
  }, [setMenuOpen])

  return (
    <>
      <DropdownMenu.Root open={menuOpen} onOpenChange={setMenuOpen}>
        <DropdownMenu.Trigger asChild>
          {children ?? (
            <button
              type="button"
              tabIndex={-1}
              aria-hidden="true"
              style={{
                width: 0,
                height: 0,
                pointerEvents: 'none',
                opacity: 0,
                ...fallbackTriggerStyle,
              }}
              data-new-menu-trigger="context"
            />
          )}
        </DropdownMenu.Trigger>

        <input
          ref={fileInputRef}
          type="file"
          className="hidden"
          multiple
          onChange={handleFileSelection}
        />

        <DropdownMenu.Portal>
          <DropdownMenu.Content
            className="bg-white rounded-lg shadow-lg border border-gray-200 min-w-[280px] py-1 z-50"
            style={{
              boxShadow:
                '0 2px 6px 2px rgba(60,64,67,.15), 0 0 1px rgba(60,64,67,.3)',
              zIndex: 1000,
            }}
            side={anchorPosition ? 'right' : 'bottom'}
            align="start"
            sideOffset={anchorPosition ? 4 : -56}
          >
            {NEW_MENU_GROUPS.map((group) => (
              <NewMenuGroup
                key={group.id}
                group={{
                  ...group,
                  items: group.items.map((item) => {
                    if (item.id === 'file-upload') {
                      return { ...item, onClick: triggerFileDialog }
                    }
                    return item
                  }),
                }}
              />
            ))}
          </DropdownMenu.Content>
        </DropdownMenu.Portal>
      </DropdownMenu.Root>

      <UploadFileModal
        isOpen={uploadModalOpen}
        files={pendingFiles}
        onClose={handleUploadPanelClose}
      />
    </>
  )
}
