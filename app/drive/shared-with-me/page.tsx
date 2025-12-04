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
  TableCellsIcon,
} from '@heroicons/react/24/outline'
import { useEffect, useState, useMemo } from 'react'

export default function SharedWithMePage() {
  const [viewMode, setViewMode] = useViewMode('list')
  const [isHydrated, setIsHydrated] = useState(false)
  const [sortPanelOpen, setSortPanelOpen] = useState(false)
  const files: FileItem[] = [
    {
      id: '1',
      name: '[Turing][RLGYMS] Internal Project Docs',
      type: 'folder',
      mimeType: 'folder',
      icon: FolderIcon,
      sharedBy: {
        name: 'jain.ayush',
      },
      dateShared: '2024-10-16T10:00:00Z', // Oct 16 (oldest)
      modifiedTime: '2024-10-15T14:30:00Z',
      createdTime: '2024-10-10T09:00:00Z',
      dateModifiedByMe: '2024-10-17T11:20:00Z',
      dateOpenedByMe: '2024-10-18T09:15:00Z',
      size: '-',
      location: 'Shared with me',
      fileSensitivity: 'File sensitivity',
      shared: true,
    },
    {
      id: '2',
      name: 'Daily Sync- Open Table - 2025/12/02 19:27 GMT+05:30 - Notes by Gemini',
      type: 'document',
      mimeType: 'application/vnd.google-apps.document',
      icon: DocumentIcon,
      sharedBy: {
        name: 'Gunjan Madan',
      },
      dateShared: '2024-12-02T19:27:00Z', // Dec 2 (newest)
      modifiedTime: '2024-12-02T18:00:00Z',
      createdTime: '2024-12-02T17:30:00Z',
      dateModifiedByMe: '2024-12-02T20:00:00Z',
      dateOpenedByMe: '2024-12-03T08:30:00Z', // Dec 3 (newest)
      size: '125 KB',
      location: 'Shared with me',
      fileSensitivity: 'File sensitivity',
      shared: true,
    },
    {
      id: '3',
      name: 'Daily Sync- Open Table - 2025/12/01 19:28 GMT+05:30 - Notes by Gemini',
      type: 'document',
      mimeType: 'application/vnd.google-apps.document',
      icon: DocumentIcon,
      sharedBy: {
        name: 'Gunjan Madan',
      },
      dateShared: '2024-12-01T19:28:00Z', // Dec 1
      modifiedTime: '2024-12-01T18:00:00Z',
      createdTime: '2024-12-01T17:30:00Z',
      dateModifiedByMe: '2024-12-01T20:15:00Z',
      dateOpenedByMe: '2024-12-02T10:20:00Z', // Dec 2
      size: '118 KB',
      location: 'Shared with me',
      fileSensitivity: 'File sensitivity',
      shared: true,
    },
    {
      id: '4',
      name: 'Team Photo.jpg',
      type: 'image',
      mimeType: 'image/jpeg',
      icon: PhotoIcon,
      sharedBy: {
        name: 'arun.h@turing.com',
      },
      dateShared: '2024-11-24T14:00:00Z', // Nov 24
      modifiedTime: '2024-11-24T13:30:00Z',
      createdTime: '2024-11-24T12:00:00Z',
      dateModifiedByMe: '2024-11-25T09:00:00Z',
      dateOpenedByMe: '2024-11-25T11:45:00Z', // Nov 25
      size: '2.8 MB',
      location: 'Shared with me',
      fileSensitivity: 'File sensitivity',
      shared: true,
    },
    {
      id: '5',
      name: 'Product Demo Video.mp4',
      type: 'video',
      mimeType: 'video/mp4',
      icon: VideoCameraIcon,
      sharedBy: {
        name: 'karan.g1@turing.com',
      },
      dateShared: '2024-11-18T16:30:00Z', // Nov 18
      modifiedTime: '2024-11-18T16:00:00Z',
      createdTime: '2024-11-18T15:00:00Z',
      dateModifiedByMe: '2024-11-19T10:00:00Z',
      dateOpenedByMe: '2024-11-20T14:30:00Z', // Nov 20 (oldest)
      size: '156.5 MB',
      location: 'Shared with me',
      fileSensitivity: 'File sensitivity',
      shared: true,
    },
    {
      id: '6',
      name: '[RLGYM][OpenTable] Task Split Sheet',
      type: 'spreadsheet',
      mimeType: 'application/vnd.google-apps.spreadsheet',
      icon: TableCellsIcon,
      sharedBy: {
        name: 'Gunjan Madan',
      },
      dateShared: '2024-11-11T10:00:00Z', // Nov 11
      modifiedTime: '2024-11-11T09:30:00Z',
      createdTime: '2024-11-10T08:00:00Z',
      dateModifiedByMe: '2024-11-12T15:20:00Z',
      dateOpenedByMe: '2024-11-13T09:00:00Z', // Nov 13
      size: '18 KB',
      location: 'Shared with me',
      fileSensitivity: 'File sensitivity',
      shared: true,
    },
  ]

  // Get sort settings for "shared-with-me" view (INDEPENDENT from other views!)
  const {
    sortBy,
    sortDirection,
    foldersPosition,
    setSortBy,
    setSortDirection,
    setFoldersPosition,
  } = useSortSettings('shared-with-me')

  // Available sort options for Shared with me
  // Note: "dateShared" is ONLY available in this view!
  const sortByOptions = [
    { value: 'dateShared' as const, label: 'Date shared' },
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
      case 'dateShared':
        return {
          showColumns: { dateShared: true },
          columnHeader: 'Date shared',
        }
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
        // Default to Date shared when sorting by name
        return {
          showColumns: { dateShared: true },
          columnHeader: 'Date shared',
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
        <h1 className="text-2xl font-semibold text-gray-900">Shared with me</h1>
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
              sharedBy: true,
              ...dateColumnConfig.showColumns,
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
        <p className="text-gray-600">Files shared with you will appear here</p>
      )}
    </div>
  )
}

