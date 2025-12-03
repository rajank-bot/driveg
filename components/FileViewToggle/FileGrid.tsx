'use client'

import React from 'react'
import { DocumentIcon, FolderIcon, EllipsisVerticalIcon } from '@heroicons/react/24/outline'
import type { FileGridProps, FileItem } from '@/types/fileViewToggle'

export default function FileGrid({
  files,
  onFileClick,
  onFileAction,
  className = '',
  groupedFiles,
}: FileGridProps) {
  const getFileIcon = (file: FileItem) => {
    if (file.icon) {
      const Icon = file.icon
      // Determine color based on mimeType
      const iconColor = getIconColor(file.mimeType)
      return <Icon className={`h-12 w-12 ${iconColor}`} />
    }
    return file.type === 'folder' ? (
      <FolderIcon className="h-12 w-12 text-blue-500" />
    ) : (
      <DocumentIcon className="h-12 w-12 text-blue-500" />
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

  const renderFileCard = (file: FileItem) => (
    <div
      key={file.id}
      className="group relative flex flex-col rounded-lg border-2 border-gray-300 bg-slate-100 p-3 transition-all hover:border-gray-300 hover:bg-gray-200 cursor-pointer"
      onClick={() => handleFileClick(file)}
    >
      {/* File Name - Top with padding for three dot icon (in gray area) */}
      <div className="w-full text-center mb-2 pr-8">
        <p className="truncate text-sm font-medium text-gray-900">{file.name}</p>
      </div>

      {/* Three dots icon - always visible */}
      <div className="absolute right-2 top-2 z-10">
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

      {/* Content area with inner border - white background inside */}
      <div className="relative border-2 border-gray-300 rounded-lg bg-white p-2">
        {/* Logo/Icon/Preview - Center */}
        <div className="flex h-24 w-full items-center justify-center rounded">
          {file.thumbnail ? (
            <img
              src={file.thumbnail}
              alt={file.name}
              className="h-full w-full rounded object-cover"
            />
          ) : (
            getFileIcon(file)
          )}
        </div>

        {/* File Sensitivity Tag - Below Icon */}
        {file.fileSensitivity && (
          <div className="mt-2 flex items-center justify-center">
            <div className="flex items-center gap-1 rounded px-2 py-0.5 text-xs text-gray-600">
              <span>File sensitivity</span>
            </div>
          </div>
        )}
      </div>

      {/* Reason - Below Content Area (in gray area) */}
      {file.reasonSuggested && (
        <div className="w-full text-center mt-2">
          <p className="truncate text-xs text-gray-500">{file.reasonSuggested}</p>
        </div>
      )}
    </div>
  )

  return (
    <div className={className}>
      {groupedFiles ? (
        Object.entries(groupedFiles).map(([groupName, groupFiles]) => (
          <div key={groupName} className="mb-6">
            {/* Group Header */}
            <h2 className="text-sm font-semibold text-gray-700 mb-3">{groupName}</h2>
            {/* Grid for this group */}
            <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6">
              {groupFiles.map((file) => renderFileCard(file))}
            </div>
          </div>
        ))
      ) : (
        <div className={`grid grid-cols-2 gap-4 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 ${className}`}>
          {files.map((file) => renderFileCard(file))}
        </div>
      )}
    </div>
  )
}
