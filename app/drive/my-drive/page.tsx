'use client'

import { FileViewToggle, FileGrid, FileList, useViewMode } from '@/components/FileViewToggle'
import type { FileItem as UIFileItem } from '@/components/FileViewToggle'
import { useEffect, useState, useMemo } from 'react'
import { useAppSelector } from '@/lib/hooks'
import { selectFilesInCurrentFolder, selectCurrentUser } from '@/lib/selectors'
import type { FileItem as ReduxFileItem } from '@/lib/store/slices/driveSlice'
import { FolderIcon } from '@heroicons/react/24/outline'

export default function MyDrivePage() {
  const [viewMode, setViewMode] = useViewMode('list')
  const [isHydrated, setIsHydrated] = useState(false)
  const reduxFiles = useAppSelector(selectFilesInCurrentFolder)
  const currentUser = useAppSelector(selectCurrentUser)

  useEffect(() => {
    setIsHydrated(true)
  }, [])

  // Transform Redux FileItem to UI FileItem format
  const files: UIFileItem[] = useMemo(() => {
    return reduxFiles.map((file: ReduxFileItem): UIFileItem => {
      return {
        id: file.id,
        name: file.name,
        type: file.type === 'folder' ? 'folder' : 'file',
        mimeType: file.mimeType,
        icon: file.type === 'folder' ? FolderIcon : undefined,
        owner: {
          name: 'me', // Display name is always "me" for own files
          avatar: currentUser?.avatar,
          initial: currentUser?.name?.charAt(0).toUpperCase() || 'M', // Use logged-in user's initial
        },
        modifiedTime: file.modifiedAt,
        createdTime: file.createdAt,
        size: file.size ? `${(file.size / 1024).toFixed(1)} KB` : file.type === 'folder' ? '-' : undefined,
        location: 'My Drive',
        starred: file.starred,
        shared: file.shared,
      }
    })
  }, [reduxFiles, currentUser])

  // Show nothing during hydration to prevent mismatch
  if (!isHydrated) {
    return null
  }

  const handleFileClick = (file: UIFileItem) => {
    console.log('File clicked:', file.name)
  }

  const handleFileAction = (file: UIFileItem, action: string) => {
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
            }}
          />
        )
      ) : (
        <p className="text-gray-600">Your files and folders will appear here</p>
      )}
    </div>
  )
}

