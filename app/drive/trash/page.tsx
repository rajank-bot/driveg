'use client'

import { FileViewToggle, FileGrid, FileList, useViewMode } from '@/components/FileViewToggle'
import type { FileItem } from '@/components/FileViewToggle'
import { useSortSettings } from '@/lib/hooks/useSortSettings'
import { sortFiles } from '@/lib/utils/sortFiles'
import { useEffect, useState, useMemo } from 'react'

export default function TrashPage() {
  const [viewMode, setViewMode] = useViewMode('list')
  const [isHydrated, setIsHydrated] = useState(false)
  const [sortPanelOpen, setSortPanelOpen] = useState(false)
  const files: FileItem[] = [
    {
      id: '1',
      name: 'Project Proposal.docx',
      type: 'file',
      mimeType: 'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
      owner: {
        name: 'John Doe',
        avatar: undefined,
      },
      modifiedTime: '2024-11-15T10:30:00Z',
      createdTime: '2024-11-10T09:00:00Z',
      size: '2.5 MB',
      originalLocation: 'My Drive/Projects',
      fileSensitivity: 'File sensitivity',
      dateTrashed: '2024-11-27T14:20:00Z',
      dateModifiedByMe: '2024-11-20T11:15:00Z',
      dateOpenedByMe: '2024-11-18T16:45:00Z',
    },
    {
      id: '2',
      name: 'Quarterly Report.xlsx',
      type: 'file',
      mimeType: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
      owner: {
        name: 'Jane Smith',
        avatar: undefined,
      },
      modifiedTime: '2024-11-22T08:45:00Z',
      createdTime: '2024-11-01T10:00:00Z',
      size: '1.8 MB',
      originalLocation: 'My Drive/Reports',
      fileSensitivity: 'File sensitivity',
      dateTrashed: '2024-11-26T12:30:00Z',
      dateModifiedByMe: '2024-11-25T09:20:00Z',
      dateOpenedByMe: '2024-11-24T14:10:00Z',
    },
    {
      id: '3',
      name: 'Meeting Notes.pdf',
      type: 'file',
      mimeType: 'application/pdf',
      owner: {
        name: 'Mike Johnson',
        avatar: undefined,
      },
      modifiedTime: '2024-11-18T15:20:00Z',
      createdTime: '2024-11-12T13:30:00Z',
      size: '850 KB',
      originalLocation: 'My Drive/Meetings',
      fileSensitivity: 'File sensitivity',
      dateTrashed: '2024-11-25T10:15:00Z',
      dateModifiedByMe: '2024-11-19T16:00:00Z',
      dateOpenedByMe: '2024-11-17T11:30:00Z',
    },
    {
      id: '4',
      name: 'Design Mockups.pptx',
      type: 'file',
      mimeType: 'application/vnd.openxmlformats-officedocument.presentationml.presentation',
      owner: {
        name: 'Sarah Williams',
        avatar: undefined,
      },
      modifiedTime: '2024-11-20T11:00:00Z',
      createdTime: '2024-11-05T08:00:00Z',
      size: '5.2 MB',
      originalLocation: 'My Drive/Design',
      fileSensitivity: 'File sensitivity',
      dateTrashed: '2024-11-28T09:45:00Z',
      dateModifiedByMe: '2024-11-21T13:25:00Z',
      dateOpenedByMe: '2024-11-19T10:15:00Z',
    },
    {
      id: '5',
      name: 'Budget Analysis.csv',
      type: 'file',
      mimeType: 'text/csv',
      owner: {
        name: 'David Brown',
        avatar: undefined,
      },
      modifiedTime: '2024-11-24T14:30:00Z',
      createdTime: '2024-11-15T12:00:00Z',
      size: '450 KB',
      originalLocation: 'My Drive/Finance',
      fileSensitivity: 'File sensitivity',
      dateTrashed: '2024-11-29T16:00:00Z',
      dateModifiedByMe: '2024-11-26T10:40:00Z',
      dateOpenedByMe: '2024-11-23T15:20:00Z',
    },
  ]

  // Get sort settings for "trash" view (INDEPENDENT from other views!)
  const {
    sortBy,
    sortDirection,
    foldersPosition,
    setSortBy,
    setSortDirection,
    setFoldersPosition,
  } = useSortSettings('trash')

  // Available sort options for Trash
  // Note: "dateTrashed" is ONLY available in this view!
  const sortByOptions = [
    { value: 'name' as const, label: 'Name' },
    { value: 'dateModified' as const, label: 'Date modified' },
    { value: 'dateModifiedByMe' as const, label: 'Date modified by me' },
    { value: 'dateOpenedByMe' as const, label: 'Date opened by me' },
    { value: 'dateTrashed' as const, label: 'Date trashed' },
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
      case 'dateTrashed':
        return {
          showColumns: { dateTrashed: true },
          columnHeader: 'Date trashed',
        }
      default:
        return {
          showColumns: { dateTrashed: true },
          columnHeader: 'Date trashed',
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
        <h1 className="text-2xl font-semibold text-gray-900">Trash</h1>
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
            showFoldersSection={false}
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
              originalLocation: true,
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
            showFoldersSection={false}
            sortPanelOpen={sortPanelOpen}
            onSortPanelOpenChange={setSortPanelOpen}
          />
        )
      ) : (
        <p className="text-gray-600">Deleted files will appear here</p>
      )}
    </div>
  )
}

