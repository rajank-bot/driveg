'use client'

import { FileViewToggle, FileGrid, FileList, useViewMode } from '@/components/FileViewToggle'
import type { FileItem as UIFileItem } from '@/components/FileViewToggle'
import { useSortSettings } from '@/lib/hooks/useSortSettings'
import { sortFiles } from '@/lib/utils/sortFiles'
import { 
  DocumentIcon, 
  FolderIcon,
} from '@heroicons/react/24/outline'
import { useEffect, useState, useMemo } from 'react'
import { useAppSelector } from '@/lib/hooks'
import { selectFilesInCurrentFolder, selectCurrentUser } from '@/lib/selectors'
import type { FileItem as ReduxFileItem } from '@/lib/store/slices/driveSlice'

export default function MyDrivePage() {
  const [viewMode, setViewMode] = useViewMode('list')
  const [isHydrated, setIsHydrated] = useState(false)
  const reduxFiles = useAppSelector(selectFilesInCurrentFolder)
  const currentUser = useAppSelector(selectCurrentUser)
  const [sortPanelOpen, setSortPanelOpen] = useState(false)

  // Get sort settings for "my-drive" view
  const {
    sortBy,
    sortDirection,
    foldersPosition,
    setSortBy,
    setSortDirection,
    setFoldersPosition,
  } = useSortSettings('my-drive')

  // Available sort options for My Drive
  const sortByOptions = [
    { value: 'name' as const, label: 'Name' },
    { value: 'dateModified' as const, label: 'Date modified' },
    { value: 'dateModifiedByMe' as const, label: 'Date modified by me' },
    { value: 'dateOpenedByMe' as const, label: 'Date opened by me' },
  ]

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

  // Sort files based on current sort settings
  const sortedFiles = useMemo(() => {
    if (files.length === 0) return files
    return sortFiles(files, sortBy, sortDirection, foldersPosition)
  }, [files, sortBy, sortDirection, foldersPosition])

  // Determine which date column to show based on sortBy
  const getDateColumnConfig = () => {
    switch (sortBy) {
      case 'dateModified':
        return {
          showColumns: { modified: true },
          columnHeader: 'Date modified',
        }
      case 'dateModifiedByMe':
        return {
          showColumns: { dateModifiedByMe: true },
          columnHeader: 'Date modified by me',
        }
      case 'dateOpenedByMe':
        return {
          showColumns: { dateOpenedByMe: true },
          columnHeader: 'Date opened by me',
        }
      default:
        // Default to Date modified when sorting by name
        return {
          showColumns: { modified: true },
          columnHeader: 'Date modified',
        }
    }
  }

  const dateColumnConfig = getDateColumnConfig()

  useEffect(() => {
    setIsHydrated(true)
  }, [])

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
        <div className="flex items-center gap-3">
        <FileViewToggle viewMode={viewMode} onViewModeChange={setViewMode} />
        </div>
      </div>

      {sortedFiles.length > 0 ? (
        viewMode === 'grid' ? (
          <FileGrid
            files={sortedFiles}
            onFileClick={handleFileClick}
            onFileAction={handleFileAction}
            sortBy={sortBy}
            sortDirection={sortDirection}
            foldersPosition={foldersPosition}
            sortByOptions={sortByOptions}
            onSortByChange={setSortBy}
            onSortDirectionChange={setSortDirection}
            onFoldersPositionChange={setFoldersPosition}
            showFoldersSection={true}
            sortPanelOpen={sortPanelOpen}
            onSortPanelOpenChange={setSortPanelOpen}
          />
        ) : (
          <FileList
            files={sortedFiles}
            onFileClick={handleFileClick}
            onFileAction={handleFileAction}
            showColumns={{
              name: true,
              owner: true,
              ...dateColumnConfig.showColumns,
              size: true,
            }}
            customColumnHeaders={{
              dateColumn: dateColumnConfig.columnHeader,
            }}
            sortBy={sortBy}
            sortDirection={sortDirection}
            foldersPosition={foldersPosition}
            sortByOptions={sortByOptions}
            onSortByChange={setSortBy}
            onSortDirectionChange={setSortDirection}
            onFoldersPositionChange={setFoldersPosition}
            showFoldersSection={true}
            sortPanelOpen={sortPanelOpen}
            onSortPanelOpenChange={setSortPanelOpen}
          />
        )
      ) : (
        <p className="text-gray-600">Your files and folders will appear here</p>
      )}
    </div>
  )
}

