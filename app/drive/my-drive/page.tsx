'use client'

import { FileViewToggle, FileGrid, FileList, useViewMode } from '@/components/FileViewToggle'
import { useEffect, useState, useCallback, useMemo } from 'react'
import { ChevronDownIcon } from "@heroicons/react/24/outline"
import Image from "next/image"
import NewMenu from '@/components/NewMenu/NewMenu'

const filters = ["Type", "People", "Modified", "Source"]
import type { FileItem as UIFileItem } from '@/components/FileViewToggle'
import { useSortSettings } from '@/lib/hooks/useSortSettings'
import { sortFiles } from '@/lib/utils/sortFiles'
import { 
  FolderIcon,
} from '@heroicons/react/24/outline'
import { useAppSelector } from '@/lib/hooks'
import { selectFilesInCurrentFolder, selectCurrentUser } from '@/lib/selectors'
import type { FileItem as ReduxFileItem } from '@/lib/store/slices/driveSlice'
import { useFileTrashActions } from '@/lib/hooks/useFileTrashActions'

export default function MyDrivePage() {
  const [viewMode, setViewMode] = useViewMode('list')
  const [isHydrated, setIsHydrated] = useState(false)
  const [contextMenuOpen, setContextMenuOpen] = useState(false)
  const [contextPosition, setContextPosition] = useState<{ x: number; y: number } | null>(null)
  const reduxFiles = useAppSelector(selectFilesInCurrentFolder)
  const currentUser = useAppSelector(selectCurrentUser)
  const [sortPanelOpen, setSortPanelOpen] = useState(false)
  const { moveToTrash } = useFileTrashActions()

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

  // Show nothing during hydration to prevent mismatch
  if (!isHydrated) {
    return null
  }

  const handleFileClick = (file: UIFileItem) => {
    console.log('File clicked:', file.name)
  }

  const handleFileAction = useCallback((file: UIFileItem, action: string) => {
    if (action === 'remove') {
      void moveToTrash(file.id)
      return
    }
    console.log('File action:', action, file.name)
  }, [moveToTrash])

  return (
    <div className="h-full" onContextMenu={handleContextMenu}>
      {sortedFiles.length > 0 ? (
        <div className="p-8">
          <div className="mb-6 flex items-center justify-between">
            <h1 className="text-2xl font-semibold text-gray-900">My Drive</h1>
            <div className="flex items-center gap-3">
              <FileViewToggle viewMode={viewMode} onViewModeChange={setViewMode} />
            </div>
          </div>

          {viewMode === 'grid' ? (
            <FileGrid
              files={sortedFiles}
              onFileClick={handleFileClick}
              onFileAction={handleFileAction}
              actionConfig={{ remove: true }}
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
              actionConfig={{ remove: true }}
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
          )}
        </div>
      ) : (
        <div className="p-8">
          <div className="mb-6 flex items-center justify-between">
            <h1 className="text-2xl font-semibold text-gray-900">My Drive</h1>
            <FileViewToggle viewMode={viewMode} onViewModeChange={setViewMode} />
          </div>

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
                Drag your files and folders here or use the &apos;New&apos; button to upload files
              </p>
            </div>
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

