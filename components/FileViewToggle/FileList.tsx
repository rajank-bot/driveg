'use client'

import React from 'react'
import { 
  DocumentIcon, 
  FolderIcon, 
  EllipsisVerticalIcon,
  ShareIcon,
  ArrowDownTrayIcon,
  PencilIcon,
  StarIcon
} from '@heroicons/react/24/outline'
import { StarIcon as StarIconSolid } from '@heroicons/react/24/solid'
import type { FileListProps, FileItem } from '@/types/fileViewToggle'

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
}: FileListProps) {
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
    return (
      <tr
        key={file.id}
        className="group border-b border-gray-300 transition-colors hover:bg-gray-200 cursor-pointer"
        onClick={() => handleFileClick(file)}
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
        {showColumns.size && (
          <td className="px-4 py-1 text-sm text-gray-600">{file.size || '-'}</td>
        )}
        <td className="px-4 py-1">
          <div className="flex items-center gap-1 justify-end">
            {/* Share, Download, Rename, Starred icons - visible on hover */}
            <div className="flex items-center gap-1 opacity-0 transition-opacity group-hover:opacity-100">
              {/* Share Icon */}
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

              {/* Download Icon */}
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

              {/* Rename Icon */}
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

              {/* Starred Icon */}
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
            </div>

            {/* Three dots icon - always visible */}
            <div className="relative group/icon">
              <button
                onClick={(e) => {
                  e.stopPropagation()
                  onFileAction?.(file, 'more')
                }}
                className="rounded-full p-1.5 transition-colors hover:bg-gray-200"
                aria-label="More options"
              >
                <EllipsisVerticalIcon className="h-5 w-5 text-gray-700" />
              </button>
              <span className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 px-2 py-1 text-xs text-white bg-gray-900 rounded whitespace-nowrap opacity-0 pointer-events-none transition-opacity group-hover/icon:opacity-100 z-50">
                More options
              </span>
            </div>
          </div>
        </td>
      </tr>
    )
  }

  return (
    <div className={className}>
      <table className="w-full border-collapse">
        <thead>
          <tr className="border-b border-gray-300">
            {showColumns.name && (
              <th className="px-4 py-1.5 text-left text-sm font-medium text-gray-700">Name</th>
            )}
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
            {showColumns.owner && (
              <th className="px-4 py-1.5 text-left text-sm font-medium text-gray-700">Owner</th>
            )}
            {showColumns.sharedBy && (
              <th className="px-4 py-1.5 text-left text-sm font-medium text-gray-700">Shared by</th>
            )}
            {showColumns.location && (
              <th className="px-4 py-1.5 text-left text-sm font-medium text-gray-700">Location</th>
            )}
            {showColumns.originalLocation && (
              <th className="px-4 py-1.5 text-left text-sm font-medium text-gray-700">Original location</th>
            )}
            {showColumns.modified && (
              <th className="px-4 py-1.5 text-left text-sm font-medium text-gray-700">Date modified</th>
            )}
            {showColumns.dateShared && (
              <th className="px-4 py-1.5 text-left text-sm font-medium text-gray-700">Date shared</th>
            )}
            {showColumns.dateTrashed && (
              <th className="px-4 py-1.5 text-left text-sm font-medium text-gray-700">Date trashed</th>
            )}
            {showColumns.size && (
              <th className="px-4 py-1.5 text-left text-sm font-medium text-gray-700">File size</th>
            )}
            <th className="px-4 py-1.5 w-20"></th>
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
    </div>
  )
}

