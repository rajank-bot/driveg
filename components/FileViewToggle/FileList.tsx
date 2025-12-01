'use client'

import { DocumentIcon, FolderIcon, EllipsisVerticalIcon } from '@heroicons/react/24/outline'
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
      return date.toLocaleDateString('en-US', {
        month: 'short',
        day: 'numeric',
        year: date.getFullYear() !== new Date().getFullYear() ? 'numeric' : undefined,
      })
    } catch {
      return dateString
    }
  }

  return (
    <div className={`overflow-x-auto ${className}`}>
      <table className="w-full border-collapse">
        <thead>
          <tr className="border-b border-gray-200">
            {showColumns.name && (
              <th className="px-4 py-2 text-left text-sm font-medium text-gray-700">Name</th>
            )}
            {showColumns.reason && (
              <th className="px-4 py-2 text-left text-sm font-medium text-gray-700">
                Reason suggested
              </th>
            )}
            {showColumns.owner && (
              <th className="px-4 py-2 text-left text-sm font-medium text-gray-700">Owner</th>
            )}
            {showColumns.location && (
              <th className="px-4 py-2 text-left text-sm font-medium text-gray-700">Location</th>
            )}
            {showColumns.modified && (
              <th className="px-4 py-2 text-left text-sm font-medium text-gray-700">Modified</th>
            )}
            {showColumns.size && (
              <th className="px-4 py-2 text-left text-sm font-medium text-gray-700">File size</th>
            )}
            <th className="w-12 px-4 py-2"></th>
          </tr>
        </thead>
        <tbody>
          {files.map((file) => (
            <tr
              key={file.id}
              className="group border-b border-gray-100 transition-colors hover:bg-gray-50 cursor-pointer"
              onClick={() => handleFileClick(file)}
            >
              {showColumns.name && (
                <td className="px-4 py-3">
                  <div className="flex items-center gap-3">
                    <div className="flex-shrink-0">{getFileIcon(file)}</div>
                    <div className="flex flex-col">
                      <span className="text-sm font-medium text-gray-900">{file.name}</span>
                      {file.fileSensitivity && (
                        <span className="mt-1 inline-flex items-center gap-1 text-xs text-gray-500">
                          File sensitivity
                        </span>
                      )}
                    </div>
                  </div>
                </td>
              )}
              {showColumns.reason && (
                <td className="px-4 py-3 text-sm text-gray-600">{file.reasonSuggested || '-'}</td>
              )}
              {showColumns.owner && (
                <td className="px-4 py-3">
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
                          {file.owner.name.charAt(0).toUpperCase()}
                        </div>
                      )}
                      <span className="text-sm text-gray-600">{file.owner.name}</span>
                    </div>
                  ) : (
                    <span className="text-sm text-gray-400">-</span>
                  )}
                </td>
              )}
              {showColumns.location && (
                <td className="px-4 py-3 text-sm text-gray-600">{file.location || '-'}</td>
              )}
              {showColumns.modified && (
                <td className="px-4 py-3 text-sm text-gray-600">
                  {formatDate(file.modifiedTime || file.createdTime)}
                </td>
              )}
              {showColumns.size && (
                <td className="px-4 py-3 text-sm text-gray-600">{file.size || '-'}</td>
              )}
              <td className="px-4 py-3">
                <button
                  onClick={(e) => {
                    e.stopPropagation()
                    onFileAction?.(file, 'more')
                  }}
                  className="rounded-full p-1 opacity-0 transition-opacity hover:bg-gray-200 group-hover:opacity-100"
                  aria-label="More options"
                >
                  <EllipsisVerticalIcon className="h-5 w-5 text-blue-600" />
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}

