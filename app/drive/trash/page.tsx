'use client'

import { FileViewToggle, FileGrid, FileList, useViewMode } from '@/components/FileViewToggle'
import type { FileItem as UIFileItem } from '@/components/FileViewToggle'
import { useSortSettings } from '@/lib/hooks/useSortSettings'
import { sortFiles } from '@/lib/utils/sortFiles'
import { useEffect, useState, useMemo, useCallback } from 'react'
import { useAppSelector } from '@/lib/hooks'
import { selectTrashedFiles } from '@/lib/selectors'
import type { FileItem as DriveFile } from '@/lib/store/slices/driveSlice'
import { FolderIcon } from '@heroicons/react/24/outline'
import { useFileTrashActions } from '@/lib/hooks/useFileTrashActions'

const formatFileSize = (size?: number) => {
  if (!size) return '-'
  const kb = 1024
  const mb = kb * 1024
  const gb = mb * 1024

  if (size < kb) return `${size} B`
  if (size < mb) return `${(size / kb).toFixed(1)} KB`
  if (size < gb) return `${(size / mb).toFixed(1)} MB`
  return `${(size / gb).toFixed(1)} GB`
}

export default function TrashPage() {
  const [viewMode, setViewMode] = useViewMode('list')
  const [isHydrated, setIsHydrated] = useState(false)
  const [sortPanelOpen, setSortPanelOpen] = useState(false)
  const trashedFiles = useAppSelector(selectTrashedFiles)
  const { restoreFromTrash, deleteForever } = useFileTrashActions()

  const {
    sortBy,
    sortDirection,
    foldersPosition,
    setSortBy,
    setSortDirection,
    setFoldersPosition,
  } = useSortSettings('trash')

  useEffect(() => {
    setIsHydrated(true)
  }, [])

  const files: UIFileItem[] = useMemo(() => {
    return trashedFiles.map((file: DriveFile): UIFileItem => ({
      id: file.id,
      name: file.name,
      type: file.type === 'folder' ? 'folder' : 'file',
      mimeType: file.mimeType,
      icon: file.type === 'folder' ? FolderIcon : undefined,
      owner: {
        name: file.modifiedBy || 'me',
      },
      modifiedTime: file.modifiedAt,
      createdTime: file.createdAt,
      size: file.size ? formatFileSize(file.size) : file.type === 'folder' ? '-' : undefined,
      originalLocation: file.parentId ? 'Folder' : 'My Drive',
      dateTrashed: file.trashedAt || file.modifiedAt,
      dateModifiedByMe: file.modifiedAt,
      dateOpenedByMe: file.createdAt,
    }))
  }, [trashedFiles])

  const sortedFiles = useMemo(() => {
    if (files.length === 0) return files
    return sortFiles(files, sortBy, sortDirection, foldersPosition)
  }, [files, sortBy, sortDirection, foldersPosition])

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
      default:
        return {
          showColumns: { dateTrashed: true },
          columnHeader: 'Date trashed',
        }
    }
  }

  const dateColumnConfig = getDateColumnConfig()

  if (!isHydrated) {
    return null
  }

  const handleFileClick = (file: UIFileItem) => {
    console.log('File clicked:', file.name)
  }

  const handleFileAction = useCallback((file: UIFileItem, action: string) => {
    if (action === 'restore') {
      void restoreFromTrash(file.id)
      return
    }
    if (action === 'deleteForever') {
      void deleteForever(file.id)
      return
    }
    console.log('File action:', action, file.name)
  }, [restoreFromTrash, deleteForever])

  const sortByOptions = [
    { value: 'name' as const, label: 'Name' },
    { value: 'dateModified' as const, label: 'Date modified' },
    { value: 'dateModifiedByMe' as const, label: 'Date modified by me' },
    { value: 'dateOpenedByMe' as const, label: 'Date opened by me' },
    { value: 'dateTrashed' as const, label: 'Date trashed' },
  ]

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
            actionConfig={{ share: false, download: false, rename: false, star: false, restore: true, deleteForever: true }}
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
            actionConfig={{ share: false, download: false, rename: false, star: false, restore: true, deleteForever: true }}
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
