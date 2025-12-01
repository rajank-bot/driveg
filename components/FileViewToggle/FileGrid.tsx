'use client'

import { DocumentIcon, FolderIcon } from '@heroicons/react/24/outline'
import type { FileGridProps, FileItem } from '@/types/fileViewToggle'

export default function FileGrid({
  files,
  onFileClick,
  onFileAction,
  className = '',
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

  return (
    <div
      className={`grid grid-cols-2 gap-4 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 ${className}`}
    >
      {files.map((file) => (
        <div
          key={file.id}
          className="group relative flex flex-col items-center rounded-lg border border-transparent p-3 transition-all hover:border-gray-200 hover:bg-gray-50 cursor-pointer"
          onClick={() => handleFileClick(file)}
        >
          {/* Thumbnail or Icon */}
          <div className="mb-2 flex h-24 w-full items-center justify-center rounded bg-gray-50">
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

          {/* File Name */}
          <div className="w-full text-center">
            <p className="truncate text-sm font-medium text-gray-900">{file.name}</p>
            {file.reasonSuggested && (
              <p className="mt-1 truncate text-xs text-gray-500">{file.reasonSuggested}</p>
            )}
          </div>

          {/* File Sensitivity Tag */}
          {file.fileSensitivity && (
            <div className="mt-1 flex items-center gap-1 rounded px-2 py-0.5 text-xs text-gray-600">
              <span>File sensitivity</span>
            </div>
          )}

          {/* Hover Actions */}
          <div className="absolute right-2 top-2 opacity-0 transition-opacity group-hover:opacity-100">
            <button
              onClick={(e) => {
                e.stopPropagation()
                onFileAction?.(file, 'more')
              }}
              className="rounded-full p-1 hover:bg-gray-200"
              aria-label="More options"
            >
              <svg
                className="h-5 w-5 text-blue-600"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M12 5v.01M12 12v.01M12 19v.01M12 6a1 1 0 110-2 1 1 0 010 2zm0 7a1 1 0 110-2 1 1 0 010 2zm0 7a1 1 0 110-2 1 1 0 010 2z"
                />
              </svg>
            </button>
          </div>
        </div>
      ))}
    </div>
  )
}

