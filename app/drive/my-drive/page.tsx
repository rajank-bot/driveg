'use client'

import { FileViewToggle, FileGrid, FileList, useViewMode } from '@/components/FileViewToggle'
import type { FileItem } from '@/components/FileViewToggle'
import { useEffect, useState } from 'react'

export default function MyDrivePage() {
  const [viewMode, setViewMode] = useViewMode('list')
  const [isHydrated, setIsHydrated] = useState(false)
  const files: FileItem[] = []

  useEffect(() => {
    setIsHydrated(true)
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
    <div className="p-8">
      <div className="mb-6 flex items-center justify-between">
        <h1 className="text-2xl font-semibold text-gray-900">My Drive</h1>
        <FileViewToggle viewMode={viewMode} onViewModeChange={setViewMode} />
      </div>

      {files.length > 0 ? (
        viewMode === 'grid' ? (
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
            showColumns={{
              name: true,
              owner: true,
              modified: true,
              size: true,
              location: true,
            }}
          />
        )
      ) : (
        <p className="text-gray-600">Your files and folders will appear here</p>
      )}
    </div>
  )
}

