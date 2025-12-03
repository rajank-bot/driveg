'use client'

import { FileViewToggle, FileGrid, FileList, useViewMode } from '@/components/FileViewToggle'
import type { FileItem } from '@/components/FileViewToggle'
import { useEffect, useState, useCallback } from 'react'
import { ChevronDownIcon } from "@heroicons/react/24/outline"
import Image from "next/image"
import NewMenu from '@/components/NewMenu/NewMenu'

const filters = ["Type", "People", "Modified", "Source"]

export default function MyDrivePage() {
  const [viewMode, setViewMode] = useViewMode('list')
  const [isHydrated, setIsHydrated] = useState(false)
  const [contextMenuOpen, setContextMenuOpen] = useState(false)
  const [contextPosition, setContextPosition] = useState<{ x: number; y: number } | null>(null)
  const files: FileItem[] = []

  useEffect(() => {
    setIsHydrated(true)
  }, [])

  const handleContextMenu = useCallback((event: React.MouseEvent) => {
    event.preventDefault()
    setContextPosition({ x: event.clientX, y: event.clientY })
    setContextMenuOpen(true)
  }, [])

  const handleContextMenuOpenChange = useCallback((nextOpen: boolean) => {
    setContextMenuOpen(nextOpen)
    if (!nextOpen) {
      setContextPosition(null)
    }
  }, [])

  // Show nothing during hydration to prevent mismatch
  if (!isHydrated) {
    return null
  }

  const handleFileClick = (file: FileItem) => {
    console.log('File clicked:', file.name)
  }

  const handleFileAction = (file: FileItem, action: string) => {
    console.log('File action:', action, file.name)
  }

  return (
    <div className="h-full" onContextMenu={handleContextMenu}>
      {files.length > 0 ? (
        <div className="p-8">
          <div className="mb-6 flex items-center justify-between">
            <h1 className="text-2xl font-semibold text-gray-900">My Drive</h1>
            <FileViewToggle viewMode={viewMode} onViewModeChange={setViewMode} />
          </div>
          {viewMode === 'grid' ? (
            <FileGrid
              files={files}
              onFileClick={handleFileClick}
              onFileAction={handleFileAction}
            />
          ) : (
            <FileList
              files={files}
              onFileClick={handleFileClick}
              onFileAction={handleFileAction}
            />
          )}
        </div>
      ) : (
        <div className="min-h-full py-3 px-6 flex flex-col gap-3">
          <div className="flex flex-wrap items-center gap-2 hover:bg-gray-100 -ml-3 py-2 px-3 rounded-full max-w-fit cursor-pointer">
            <h1 className="text-2xl font-normal text-gray-900">My Drive</h1>
            <ChevronDownIcon className="h-5 w-5 text-gray-900 mt-2" aria-hidden="true" />
          </div>

          <div className="flex flex-wrap gap-3">
            {filters.map((filter) => (
              <button
                key={filter}
                className="flex items-center gap-3 rounded-lg border border-gray-400 px-3 py-1 text-sm font-medium text-gray-700 shadow-sm transition hover:border-gray-300 hover:bg-gray-100"
                type="button"
              >
                {filter}
                <ChevronDownIcon className="h-3 w-3 text-gray-900" aria-hidden="true" />
              </button>
            ))}
          </div>

          <div className="flex-1 flex flex-col items-center mt-20 text-center gap-3">
            <Image
              src="/upload-file/upload-image-1.svg"
              alt="My Drive"
              width={100}
              height={100}
              className="w-48 h-48 object-contain"
            />
            <h1 className="text-gray-600 text-2xl font-normal">
              A place for all of your files
            </h1>
            <p className="text-gray-600 text-base font-normal">
              Drag your files and folders here or use the 'New' button to upload files
            </p>
          </div>
        </div>
      )}

      <NewMenu
        open={contextMenuOpen}
        onOpenChange={handleContextMenuOpenChange}
        anchorPosition={contextPosition}
      />
    </div>
  )
}

