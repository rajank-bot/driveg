'use client'

import { FileViewToggle, FileGrid, FileList, useViewMode } from '@/components/FileViewToggle'
import type { FileItem } from '@/components/FileViewToggle'
import { useSortSettings } from '@/lib/hooks/useSortSettings'
import { sortFiles } from '@/lib/utils/sortFiles'
import { 
  DocumentIcon, 
  FolderIcon,
  PhotoIcon,
  VideoCameraIcon,
  MusicalNoteIcon,
} from '@heroicons/react/24/outline'
import { useEffect, useState, useMemo } from 'react'

export default function MyDrivePage() {
  const [viewMode, setViewMode] = useViewMode('list')
  const [isHydrated, setIsHydrated] = useState(false)
  const [sortPanelOpen, setSortPanelOpen] = useState(false)
  const files: FileItem[] = [
    {
      id: '1',
      name: 'Screenshot 2025-11-19 122956.png',
      type: 'image',
      mimeType: 'image/png',
      icon: PhotoIcon,
      owner: {
        name: 'me',
      },
      modifiedTime: '2024-11-19T12:29:56Z', // Nov 19
      createdTime: '2024-11-19T12:00:00Z',
      dateModifiedByMe: '2024-11-19T12:30:00Z',
      dateOpenedByMe: '2024-12-02T10:15:00Z', // Dec 2 (newest)
      size: '1.2 MB',
      location: 'My Drive',
      fileSensitivity: 'File sensitivity',
    },
    {
      id: '2',
      name: 'Project Report.docx',
      type: 'document',
      mimeType: 'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
      icon: DocumentIcon,
      owner: {
        name: 'John Doe',
      },
      modifiedTime: '2024-11-25T14:30:00Z', // Nov 25
      createdTime: '2024-11-20T09:00:00Z',
      dateModifiedByMe: '2024-11-26T10:20:00Z', // Nov 26
      dateOpenedByMe: '2024-12-01T08:45:00Z', // Dec 1
      size: '850 KB',
      location: 'My Drive/Projects',
      fileSensitivity: 'File sensitivity',
    },
    {
      id: '3',
      name: 'Meeting Recording.mp4',
      type: 'video',
      mimeType: 'video/mp4',
      icon: VideoCameraIcon,
      owner: {
        name: 'Jane Smith',
      },
      modifiedTime: '2024-11-28T16:00:00Z', // Nov 28
      createdTime: '2024-11-28T15:30:00Z',
      dateModifiedByMe: '2024-11-29T11:00:00Z', // Nov 29
      dateOpenedByMe: '2024-11-30T14:20:00Z', // Nov 30
      size: '45.2 MB',
      location: 'My Drive/Meetings',
      fileSensitivity: 'File sensitivity',
    },
    {
      id: '4',
      name: 'Audio Notes.mp3',
      type: 'audio',
      mimeType: 'audio/mpeg',
      icon: MusicalNoteIcon,
      owner: {
        name: 'me',
      },
      modifiedTime: '2024-11-30T09:15:00Z', // Nov 30
      createdTime: '2024-11-30T09:00:00Z',
      dateModifiedByMe: '2024-12-01T15:30:00Z', // Dec 1 (newest)
      dateOpenedByMe: '2024-12-01T16:00:00Z', // Dec 1
      size: '3.5 MB',
      location: 'My Drive',
      fileSensitivity: 'File sensitivity',
    },
    {
      id: '5',
      name: 'Documents Folder',
      type: 'folder',
      mimeType: 'folder',
      icon: FolderIcon,
      owner: {
        name: 'me',
      },
      modifiedTime: '2024-11-27T10:00:00Z', // Nov 27
      createdTime: '2024-11-15T08:00:00Z',
      dateModifiedByMe: '2024-11-27T10:00:00Z',
      dateOpenedByMe: '2024-11-28T09:30:00Z', // Nov 28 (oldest)
      size: '-',
      location: 'My Drive',
    },
    {
      id: '6',
      name: 'Budget Spreadsheet.xlsx',
      type: 'spreadsheet',
      mimeType: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
      icon: DocumentIcon,
      owner: {
        name: 'me',
      },
      modifiedTime: '2024-12-01T11:45:00Z', // Dec 1 (newest)
      createdTime: '2024-11-22T10:00:00Z',
      dateModifiedByMe: '2024-11-28T13:20:00Z', // Nov 28 (oldest)
      dateOpenedByMe: '2024-11-29T12:10:00Z', // Nov 29
      size: '2.1 MB',
      location: 'My Drive/Finance',
      fileSensitivity: 'File sensitivity',
    },
  ]

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

