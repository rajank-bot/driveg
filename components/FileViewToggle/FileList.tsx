'use client'

import React, { useEffect, useMemo, useState } from 'react'
import { 
  DocumentIcon, 
  FolderIcon, 
  EllipsisVerticalIcon,
  ShareIcon,
  ArrowDownTrayIcon,
  PencilIcon,
  StarIcon,
  ChevronUpIcon,
  ChevronDownIcon,
  Bars3Icon,
  TrashIcon,
  ArrowUturnLeftIcon,
  XMarkIcon,
} from '@heroicons/react/24/outline'
import { StarIcon as StarIconSolid } from '@heroicons/react/24/solid'
import { SortPanel } from '@/components/SortPanel'
import type { FileListProps, FileItem } from '@/types/fileViewToggle'
import * as DropdownMenu from '@radix-ui/react-dropdown-menu'

export default function FileList({
  files,
  onFileClick,
  onFileAction,
  className = '',
  showColumns = {
    name: true,
    owner: true,
    modified: true,
    size: true,
    location: true,
    reason: true,
  },
  groupedFiles,
  customColumnHeaders,
  sortBy,
  sortDirection,
  foldersPosition,
  sortByOptions,
  onSortByChange,
  onSortDirectionChange,
  onFoldersPositionChange,
  showFoldersSection = true,
  sortPanelOpen,
  onSortPanelOpenChange,
  actionConfig,
}: FileListProps) {
  const resolvedActions = useMemo(() => ({
    share: true,
    download: true,
    rename: true,
    star: true,
    remove: false,
    restore: false,
    deleteForever: false,
    ...(actionConfig || {}),
  }), [actionConfig])

  const hasQuickActions =
    resolvedActions.share ||
    resolvedActions.download ||
    resolvedActions.rename ||
    resolvedActions.star ||
    resolvedActions.remove ||
    resolvedActions.restore ||
    resolvedActions.deleteForever

  const [contextMenuState, setContextMenuState] = useState<{
    file: FileItem
    position: { x: number; y: number }
  } | null>(null)

  useEffect(() => {
    if (!contextMenuState) return
    const handleClick = () => setContextMenuState(null)
    const handleEscape = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        setContextMenuState(null)
      }
    }
    document.addEventListener('click', handleClick)
    document.addEventListener('keydown', handleEscape)
    return () => {
      document.removeEventListener('click', handleClick)
      document.removeEventListener('keydown', handleEscape)
    }
  }, [contextMenuState])

  const contextMenuItems = contextMenuState ? getMenuItems(contextMenuState.file) : []

  const openContextMenu = (event: React.MouseEvent, file: FileItem) => {
    event.preventDefault()
    setContextMenuState({
      file,
      position: { x: event.clientX, y: event.clientY },
    })
  }

  const getMenuItems = (file: FileItem) => {
    const items: Array<{ label: string; action: string; icon: React.ComponentType<{ className?: string }>; tone?: 'danger' | 'default' }> = []
    if (resolvedActions.remove) {
      items.push({ label: 'Move to trash', action: 'remove', icon: TrashIcon })
    }
    if (resolvedActions.restore) {
      items.push({ label: 'Restore', action: 'restore', icon: ArrowUturnLeftIcon })
    }
    if (resolvedActions.deleteForever) {
      items.push({ label: 'Delete forever', action: 'deleteForever', icon: XMarkIcon, tone: 'danger' })
    }
    return items
  }
  const getFileIcon = (file: FileItem) => {
    if (file.icon) {
      const Icon = file.icon
      // Determine color based on mimeType
      const iconColor = getIconColor(file.mimeType)
      return <Icon className={`h-5 w-5 ${iconColor}`} />
    }
    return file.type === 'folder' ? (
      <FolderIcon className="h-5 w-5 text-blue-500" />
    ) : (
      <DocumentIcon className="h-5 w-5 text-blue-500" />
    )
  }

  const getIconColor = (mimeType?: string) => {
    if (!mimeType) return 'text-blue-500'
    
    if (mimeType.includes('spreadsheet') || mimeType.includes('excel')) {
      return 'text-green-600'
    }
    if (mimeType.includes('document') || mimeType.includes('word')) {
      return 'text-blue-600'
    }
    if (mimeType.includes('presentation') || mimeType.includes('powerpoint')) {
      return 'text-orange-500'
    }
    if (mimeType.includes('video')) {
      return 'text-purple-600'
    }
    if (mimeType.includes('image')) {
      return 'text-pink-500'
    }
    if (mimeType.includes('pdf')) {
      return 'text-red-600'
    }
    if (mimeType.includes('google-apps')) {
      if (mimeType.includes('spreadsheet')) return 'text-green-600'
      if (mimeType.includes('document')) return 'text-blue-600'
      if (mimeType.includes('presentation')) return 'text-orange-500'
      return 'text-blue-500'
    }
    
    return 'text-blue-500'
  }

  const handleFileClick = (file: FileItem) => {
    onFileClick?.(file)
  }

  const formatDate = (dateString?: string) => {
    if (!dateString) return ''
    try {
      const date = new Date(dateString)
      const now = new Date()
      const isToday = date.toDateString() === now.toDateString()
      
      if (isToday) {
        // Show time for today's files (e.g., "6:59 PM")
        return date.toLocaleTimeString('en-US', {
          hour: 'numeric',
          minute: '2-digit',
          hour12: true,
        })
      }
      
      // Show date for older files
      return date.toLocaleDateString('en-US', {
        month: 'short',
        day: 'numeric',
        year: date.getFullYear() !== now.getFullYear() ? 'numeric' : undefined,
      })
    } catch {
      return dateString
    }
  }

  const renderFileRow = (file: FileItem) => {
    const menuItems = getMenuItems(file)
    return (
      <tr
        key={file.id}
        className="group border-b border-gray-300 transition-colors hover:bg-gray-200 cursor-pointer"
        onClick={() => handleFileClick(file)}
        onContextMenu={(event) => openContextMenu(event, file)}
      >
        {showColumns.name && (
          <td className="px-4 py-1 min-w-0">
            <div className="flex items-center gap-3 min-w-0">
              <div className="flex-shrink-0">{getFileIcon(file)}</div>
              <div className="flex flex-col min-w-0">
                <span className="text-sm font-medium text-gray-900 truncate">{file.name}</span>
                {file.fileSensitivity && (
                  <span className="mt-0 inline-flex items-center gap-1 text-xs text-gray-500">
                    File sensitivity
                  </span>
                )}
              </div>
            </div>
          </td>
        )}
        {showColumns.reason && (
          <td className="px-4 py-1 text-sm text-gray-600 min-w-0">
            <span className="truncate block">{file.reasonSuggested || '-'}</span>
          </td>
        )}
        {showColumns.activity && (
          <td className="px-4 py-1 text-sm text-gray-600 min-w-0">
            <span className="truncate block">{file.activity || '-'}</span>
          </td>
        )}
        {showColumns.owner && (
          <td className="px-4 py-1">
            {file.owner ? (
              <div className="flex items-center gap-2">
                {file.owner.avatar ? (
                  <img
                    src={file.owner.avatar}
                    alt={file.owner.name}
                    className="h-6 w-6 rounded-full"
                  />
                ) : (
                  <div className="flex h-6 w-6 items-center justify-center rounded-full bg-gray-200 text-xs text-gray-600">
                    {file.owner.initial || file.owner.name.charAt(0).toUpperCase()}
                  </div>
                )}
                <span className="text-sm text-gray-600">{file.owner.name}</span>
              </div>
            ) : (
              <span className="text-sm text-gray-400">-</span>
            )}
          </td>
        )}
        {showColumns.sharedBy && (
          <td className="px-4 py-1">
            {file.sharedBy ? (
              <div className="flex items-center gap-2">
                {file.sharedBy.avatar ? (
                  <img
                    src={file.sharedBy.avatar}
                    alt={file.sharedBy.name}
                    className="h-6 w-6 rounded-full"
                  />
                ) : (
                  <div className="flex h-6 w-6 items-center justify-center rounded-full bg-gray-200 text-xs text-gray-600">
                    {file.sharedBy.name.charAt(0).toUpperCase()}
                  </div>
                )}
                <span className="text-sm text-gray-600">{file.sharedBy.name}</span>
              </div>
            ) : (
              <span className="text-sm text-gray-400">-</span>
            )}
          </td>
        )}
        {showColumns.location && (
          <td className="px-4 py-1 text-sm text-gray-600 min-w-0">
            <span className="truncate block">{file.location || '-'}</span>
          </td>
        )}
        {showColumns.originalLocation && (
          <td className="px-4 py-1 text-sm text-gray-600 min-w-0">
            <span className="truncate block">{file.originalLocation || '-'}</span>
          </td>
        )}
        {showColumns.modified && (
          <td className="px-4 py-1 text-sm text-gray-600">
            {formatDate(file.modifiedTime || file.createdTime)}
          </td>
        )}
        {showColumns.dateShared && (
          <td className="px-4 py-1 text-sm text-gray-600">
            {formatDate(file.dateShared)}
          </td>
        )}
        {showColumns.dateTrashed && (
          <td className="px-4 py-1 text-sm text-gray-600">
            {formatDate(file.dateTrashed)}
          </td>
        )}
        {showColumns.dateModifiedByMe && (
          <td className="px-4 py-1 text-sm text-gray-600">
            {formatDate(file.dateModifiedByMe)}
          </td>
        )}
        {showColumns.dateOpenedByMe && (
          <td className="px-4 py-1 text-sm text-gray-600">
            {formatDate(file.dateOpenedByMe)}
          </td>
        )}
        {showColumns.size && (
          <td className="px-4 py-1 text-sm text-gray-600">{file.size || '-'}</td>
        )}
        <td className="px-4 py-1">
          <div className="flex items-center gap-1 justify-end">
            {/* Quick action icons - visible on hover */}
            {hasQuickActions && (
              <div className="flex items-center gap-1 opacity-0 transition-opacity group-hover:opacity-100">
                {resolvedActions.share && (
                  <div className="relative group/icon">
                    <button
                      onClick={(e) => {
                        e.stopPropagation()
                        onFileAction?.(file, 'share')
                      }}
                      className="rounded-full p-1.5 transition-colors hover:bg-gray-200"
                      aria-label="Share"
                    >
                      <ShareIcon className="h-5 w-5 text-gray-700" />
                    </button>
                    <span className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 px-2 py-1 text-xs text-white bg-gray-900 rounded whitespace-nowrap opacity-0 pointer-events-none transition-opacity group-hover/icon:opacity-100 z-50">
                      Share
                    </span>
                  </div>
                )}

                {resolvedActions.download && (
                  <div className="relative group/icon">
                    <button
                      onClick={(e) => {
                        e.stopPropagation()
                        onFileAction?.(file, 'download')
                      }}
                      className="rounded-full p-1.5 transition-colors hover:bg-gray-200"
                      aria-label="Download"
                    >
                      <ArrowDownTrayIcon className="h-5 w-5 text-gray-700" />
                    </button>
                    <span className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 px-2 py-1 text-xs text-white bg-gray-900 rounded whitespace-nowrap opacity-0 pointer-events-none transition-opacity group-hover/icon:opacity-100 z-50">
                      Download
                    </span>
                  </div>
                )}

                {resolvedActions.rename && (
                  <div className="relative group/icon">
                    <button
                      onClick={(e) => {
                        e.stopPropagation()
                        onFileAction?.(file, 'rename')
                      }}
                      className="rounded-full p-1.5 transition-colors hover:bg-gray-200"
                      aria-label="Rename"
                    >
                      <PencilIcon className="h-5 w-5 text-gray-700" />
                    </button>
                    <span className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 px-2 py-1 text-xs text-white bg-gray-900 rounded whitespace-nowrap opacity-0 pointer-events-none transition-opacity group-hover/icon:opacity-100 z-50">
                      Rename
                    </span>
                  </div>
                )}

                {resolvedActions.star && (
                  <div className="relative group/icon">
                    <button
                      onClick={(e) => {
                        e.stopPropagation()
                        onFileAction?.(file, file.starred ? 'unstar' : 'star')
                      }}
                      className="rounded-full p-1.5 transition-colors hover:bg-gray-200"
                      aria-label={file.starred ? 'Remove from starred' : 'Add to starred'}
                    >
                      {file.starred ? (
                        <StarIconSolid className="h-5 w-5 text-yellow-500" />
                      ) : (
                        <StarIcon className="h-5 w-5 text-gray-700" />
                      )}
                    </button>
                    <span className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 px-2 py-1 text-xs text-white bg-gray-900 rounded whitespace-nowrap opacity-0 pointer-events-none transition-opacity group-hover/icon:opacity-100 z-50">
                      {file.starred ? 'Remove from starred' : 'Add to starred'}
                    </span>
                  </div>
                )}

                {resolvedActions.remove && (
                  <div className="relative group/icon">
                    <button
                      onClick={(e) => {
                        e.stopPropagation()
                        onFileAction?.(file, 'remove')
                      }}
                      className="rounded-full p-1.5 transition-colors hover:bg-gray-200"
                      aria-label="Move to trash"
                    >
                      <TrashIcon className="h-5 w-5 text-gray-700" />
                    </button>
                    <span className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 px-2 py-1 text-xs text-white bg-gray-900 rounded whitespace-nowrap opacity-0 pointer-events-none transition-opacity group-hover/icon:opacity-100 z-50">
                      Move to trash
                    </span>
                  </div>
                )}

                {resolvedActions.restore && (
                  <div className="relative group/icon">
                    <button
                      onClick={(e) => {
                        e.stopPropagation()
                        onFileAction?.(file, 'restore')
                      }}
                      className="rounded-full p-1.5 transition-colors hover:bg-gray-200"
                      aria-label="Restore"
                    >
                      <ArrowUturnLeftIcon className="h-5 w-5 text-gray-700" />
                    </button>
                    <span className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 px-2 py-1 text-xs text-white bg-gray-900 rounded whitespace-nowrap opacity-0 pointer-events-none transition-opacity group-hover/icon:opacity-100 z-50">
                      Restore
                    </span>
                  </div>
                )}

                {resolvedActions.deleteForever && (
                  <div className="relative group/icon">
                    <button
                      onClick={(e) => {
                        e.stopPropagation()
                        onFileAction?.(file, 'deleteForever')
                      }}
                      className="rounded-full p-1.5 transition-colors hover:bg-gray-200"
                      aria-label="Delete forever"
                    >
                      <XMarkIcon className="h-5 w-5 text-red-600" />
                    </button>
                    <span className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 px-2 py-1 text-xs text-white bg-gray-900 rounded whitespace-nowrap opacity-0 pointer-events-none transition-opacity group-hover/icon:opacity-100 z-50">
                      Delete forever
                    </span>
                  </div>
                )}
              </div>
            )}

            {/* Three dots icon with dropdown */}
            <div className="relative group/icon">
              <DropdownMenu.Root>
                <DropdownMenu.Trigger asChild>
                  <button
                    onClick={(e) => {
                      e.stopPropagation()
                    }}
                    className="rounded-full p-1.5 transition-colors hover:bg-gray-200"
                    aria-label="More options"
                  >
                    <EllipsisVerticalIcon className="h-5 w-5 text-gray-700" />
                  </button>
                </DropdownMenu.Trigger>
                <DropdownMenu.Portal>
                  <DropdownMenu.Content
                    className="z-50 min-w-[180px] rounded-md border border-gray-200 bg-white p-1 shadow-lg focus:outline-none"
                    side="bottom"
                    align="end"
                    sideOffset={8}
                  >
                    {menuItems.length > 0 ? (
                      menuItems.map((item) => (
                        <DropdownMenu.Item
                          key={item.action}
                          className={`flex cursor-pointer items-center gap-3 rounded px-3 py-2 text-sm text-gray-700 outline-none data-[highlighted]:bg-gray-100 ${
                            item.tone === 'danger' ? 'text-red-600 data-[highlighted]:bg-red-50' : ''
                          }`}
                          onSelect={(event) => {
                            event.preventDefault()
                            onFileAction?.(file, item.action)
                          }}
                        >
                          <item.icon className={`h-4 w-4 ${item.tone === 'danger' ? 'text-red-600' : 'text-gray-600'}`} />
                          <span>{item.label}</span>
                        </DropdownMenu.Item>
                      ))
                    ) : (
                      <div className="px-3 py-2 text-sm text-gray-400">No actions available</div>
                    )}
                  </DropdownMenu.Content>
                </DropdownMenu.Portal>
              </DropdownMenu.Root>
              <span className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 px-2 py-1 text-xs text-white bg-gray-900 rounded whitespace-nowrap opacity-0 pointer-events-none transition-opacity group-hover/icon:opacity-100 z-50">
                More options
              </span>
            </div>
          </div>
        </td>
      </tr>
    )
  }

  // Helper function to get sort indicator for a column
  const getSortIndicator = (columnSortBy: typeof sortBy) => {
    if (!sortBy || sortBy !== columnSortBy) return null
    
    const isAscending = 
      (sortBy === 'name' && sortDirection === 'aToZ') ||
      (sortBy !== 'name' && sortDirection === 'oldToNew')
    
    return isAscending ? (
      <ChevronUpIcon className="h-5 w-5 text-blue-600" strokeWidth={2.5} />
    ) : (
      <ChevronDownIcon className="h-5 w-5 text-blue-600" strokeWidth={2.5} />
    )
  }

  // Date labels map - memoized to avoid recreation
  const dateLabels = useMemo(() => ({
    dateModified: 'Date modified',
    dateModifiedByMe: 'Date modified by me',
    dateOpenedByMe: 'Date opened by me',
    dateShared: 'Date shared',
    dateTrashed: 'Date trashed',
  } as const), [])

  // Helper function to get tooltip text - memoized based on sortBy and sortDirection
  const getSortTooltip = useMemo(() => {
    return (columnSortBy: NonNullable<typeof sortBy>): string => {
      const isActive = sortBy === columnSortBy
      
      if (isActive) {
        // When column is currently sorted, show what it will convert to
        if (columnSortBy === 'name') {
          return sortDirection === 'aToZ' ? 'Sort to Z-A' : 'Sort to A-Z'
        } else {
          // For date columns
          const dateLabel = dateLabels[columnSortBy as keyof typeof dateLabels] || 'Date'
          return sortDirection === 'newToOld' 
            ? `Sort to Old to new` 
            : `Sort to New to old`
        }
      } else {
        // When column is not sorted, show what clicking will do (default behavior)
        if (columnSortBy === 'name') {
          return 'Sort by Name (A to Z)'
        } else {
          // For date columns
          const dateLabel = dateLabels[columnSortBy as keyof typeof dateLabels] || 'Date'
          return `Sort by ${dateLabel} (New to old)`
        }
      }
    }
  }, [sortBy, sortDirection, dateLabels])

  // Handle column header click
  const handleColumnClick = (columnSortBy: typeof sortBy) => {
    if (!onSortByChange || !onSortDirectionChange || !columnSortBy) return

    if (sortBy === columnSortBy) {
      // Toggle direction if same column
      if (columnSortBy === 'name') {
        onSortDirectionChange(sortDirection === 'aToZ' ? 'zToA' : 'aToZ')
      } else {
        onSortDirectionChange(sortDirection === 'newToOld' ? 'oldToNew' : 'newToOld')
      }
    } else {
      // Set new column with default direction
      onSortByChange(columnSortBy)
      if (columnSortBy === 'name') {
        onSortDirectionChange('aToZ')
      } else {
        onSortDirectionChange('newToOld')
      }
    }
  }

  // Render sortable header
  const renderSortableHeader = (
    label: string,
    columnSortBy: typeof sortBy,
    isClickable: boolean = true
  ) => {
    const isActive = sortBy === columnSortBy
    const tooltip = columnSortBy ? getSortTooltip(columnSortBy) : ''
    
    if (!isClickable) {
      return (
        <th className="px-4 py-1.5 text-left text-sm font-medium text-gray-700">
          {label}
        </th>
      )
    }

    return (
      <th 
        className={`px-4 py-1.5 text-left text-sm font-medium text-gray-700 cursor-pointer hover:bg-gray-50 transition-colors ${
          isActive ? 'bg-gray-50' : ''
        }`}
        onClick={() => handleColumnClick(columnSortBy)}
      >
        <div className="flex items-center gap-1.5 group/header relative">
          <span>{label}</span>
          {isActive && (
            <div className="relative">
              {getSortIndicator(columnSortBy)}
            </div>
          )}
          {/* Tooltip - shows on hover for both active and inactive headers */}
          {tooltip && (
            <span className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 px-2 py-1 text-xs text-white bg-gray-900 rounded whitespace-nowrap opacity-0 pointer-events-none transition-opacity group-hover/header:opacity-100 z-50">
              {tooltip}
            </span>
          )}
        </div>
      </th>
    )
  }

  return (
    <div className={className}>
      <table className="w-full border-collapse">
        <thead>
          <tr className="border-b border-gray-300">
            {showColumns.name && renderSortableHeader('Name', 'name')}
            {showColumns.reason && (
              <th className="px-4 py-1.5 text-left text-sm font-medium text-gray-700">
                {customColumnHeaders?.reason !== '' ? (customColumnHeaders?.reason || 'Reason suggested') : ''}
              </th>
            )}
            {showColumns.activity && (
              <th className="px-4 py-1.5 text-left text-sm font-medium text-gray-700">
                Activity
              </th>
            )}
            {showColumns.owner && renderSortableHeader('Owner', undefined, false)}
            {showColumns.sharedBy && renderSortableHeader('Shared by', undefined, false)}
            {showColumns.location && renderSortableHeader('Location', undefined, false)}
            {showColumns.originalLocation && renderSortableHeader('Original location', undefined, false)}
            {showColumns.modified && renderSortableHeader(
              customColumnHeaders?.dateColumn || customColumnHeaders?.modified || 'Date modified',
              'dateModified'
            )}
            {showColumns.dateShared && renderSortableHeader(
              customColumnHeaders?.dateColumn || 'Date shared',
              'dateShared'
            )}
            {showColumns.dateTrashed && renderSortableHeader(
              customColumnHeaders?.dateColumn || 'Date trashed',
              'dateTrashed'
            )}
            {showColumns.dateModifiedByMe && renderSortableHeader(
              customColumnHeaders?.dateColumn || 'Date modified by me',
              'dateModifiedByMe'
            )}
            {showColumns.dateOpenedByMe && renderSortableHeader(
              customColumnHeaders?.dateColumn || 'Date opened by me',
              'dateOpenedByMe'
            )}
            {showColumns.size && renderSortableHeader('File size', undefined, false)}
            <th className="px-4 py-1.5 w-20">
              {sortBy && sortByOptions && onSortByChange && onSortDirectionChange && (
                <SortPanel
                  sortBy={sortBy}
                  sortDirection={sortDirection || 'aToZ'}
                  foldersPosition={foldersPosition || 'onTop'}
                  sortByOptions={sortByOptions}
                  onSortByChange={onSortByChange}
                  onSortDirectionChange={onSortDirectionChange}
                  onFoldersPositionChange={onFoldersPositionChange || (() => {})}
                  showFoldersSection={showFoldersSection}
                  open={sortPanelOpen}
                  onOpenChange={onSortPanelOpenChange}
                >
                  <button
                    className="flex items-center gap-1.5 px-2 py-1 text-sm text-gray-700 hover:bg-gray-50 transition-colors rounded border-0 focus:outline-none focus:ring-0"
                    aria-label="Sort"
                  >
                    <Bars3Icon className="h-4 w-4" />
                    <span>Sort</span>
                  </button>
                </SortPanel>
              )}
            </th>
          </tr>
        </thead>
        <tbody>
          {groupedFiles ? (
            Object.entries(groupedFiles).map(([groupName, groupFiles]) => (
              <React.Fragment key={groupName}>
                {groupFiles.map((file, index) => (
                  <React.Fragment key={file.id}>
                    {index === 0 && (
                      <tr>
                        <td 
                          colSpan={
                            (showColumns.name ? 1 : 0) +
                            (showColumns.reason ? 1 : 0) +
                            (showColumns.activity ? 1 : 0) +
                            (showColumns.owner ? 1 : 0) +
                            (showColumns.sharedBy ? 1 : 0) +
                            (showColumns.location ? 1 : 0) +
                            (showColumns.originalLocation ? 1 : 0) +
                            (showColumns.modified ? 1 : 0) +
                            (showColumns.dateShared ? 1 : 0) +
                            (showColumns.dateTrashed ? 1 : 0) +
                            (showColumns.dateModifiedByMe ? 1 : 0) +
                            (showColumns.dateOpenedByMe ? 1 : 0) +
                            (showColumns.size ? 1 : 0) +
                            1 // Actions column
                          } 
                          className="px-4 py-2 bg-gray-50"
                        >
                          <span className="text-sm font-semibold text-gray-700">{groupName}</span>
                        </td>
                      </tr>
                    )}
                    {renderFileRow(file)}
                  </React.Fragment>
                ))}
              </React.Fragment>
            ))
          ) : (
            files.map((file) => renderFileRow(file))
          )}
        </tbody>
      </table>
      {contextMenuState && contextMenuItems.length > 0 && (
        <div
          className="fixed z-50 min-w-[200px] rounded-lg border border-gray-200 bg-white py-1 shadow-xl"
          style={{
            left: contextMenuState.position.x,
            top: contextMenuState.position.y,
          }}
          onClick={(event) => event.stopPropagation()}
          onContextMenu={(event) => event.preventDefault()}
        >
          {contextMenuItems.map((item) => (
            <button
              key={item.action}
              className={`flex w-full items-center gap-3 px-4 py-2 text-left text-sm hover:bg-gray-100 ${
                item.tone === 'danger' ? 'text-red-600 hover:bg-red-50' : 'text-gray-700'
              }`}
              onClick={(event) => {
                event.stopPropagation()
                onFileAction?.(contextMenuState.file, item.action)
                setContextMenuState(null)
              }}
            >
              <item.icon className={`h-4 w-4 ${item.tone === 'danger' ? 'text-red-500' : 'text-gray-500'}`} />
              <span>{item.label}</span>
            </button>
          ))}
        </div>
      )}
    </div>
  )
}

