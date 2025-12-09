'use client'

import { FileViewToggle, FileGrid, FileList, useViewMode } from '@/components/FileViewToggle'
import type { FileItem as UIFileItem } from '@/components/FileViewToggle'
import {
  DocumentTextIcon,
  TableCellsIcon,
  PresentationChartBarIcon,
  VideoCameraIcon,
  FolderIcon,
} from '@heroicons/react/24/outline'
import { useEffect, useMemo, useState } from 'react'
import Image from 'next/image'
import { useAppSelector } from '@/lib/hooks'
import { selectAllFiles, selectCurrentUser } from '@/lib/selectors'
import type { FileItem as DriveFile } from '@/lib/store/slices/driveSlice'
import { useFileTrashActions } from '@/lib/hooks/useFileTrashActions'

const formatSize = (size?: number) => {
  if (!size) return undefined
  if (size < 1024) return `${size} B`
  if (size < 1024 * 1024) return `${(size / 1024).toFixed(1)} KB`
  if (size < 1024 * 1024 * 1024) return `${(size / (1024 * 1024)).toFixed(1)} MB`
  return `${(size / (1024 * 1024 * 1024)).toFixed(1)} GB`
}

const resolveIcon = (file: DriveFile) => {
  if (file.type === 'folder') return FolderIcon
  const mime = file.mimeType || ''
  if (mime.includes('presentation')) return PresentationChartBarIcon
  if (mime.includes('spreadsheet') || mime.includes('excel')) return TableCellsIcon
  if (mime.includes('video')) return VideoCameraIcon
  if (mime.includes('document') || mime.includes('word')) return DocumentTextIcon
  return DocumentTextIcon
}

export default function HomePage() {
  const [viewMode, setViewMode] = useViewMode('list')
  const [isHydrated, setIsHydrated] = useState(false)
  const reduxFiles = useAppSelector(selectAllFiles)
  const currentUser = useAppSelector(selectCurrentUser)
  const { moveToTrash } = useFileTrashActions()

  useEffect(() => {
    setIsHydrated(true)
  }, [])

  const suggestedFiles = useMemo<UIFileItem[]>(() => {
    return reduxFiles
      .filter((file) => !file.isTrashed)
      .slice(0, 12)
      .map((file) => ({
        id: file.id,
        name: file.name,
        type: file.type === 'folder' ? 'folder' : 'file',
        mimeType: file.mimeType,
        icon: resolveIcon(file),
        owner: {
          name: currentUser?.name || file.createdBy,
        },
        modifiedTime: file.modifiedAt,
        createdTime: file.createdAt,
        size: file.type === 'folder' ? '-' : formatSize(file.size),
        location: file.parentId ? 'Folder' : 'My Drive',
        reasonSuggested: file.modifiedBy
          ? `${file.modifiedBy} updated • ${new Date(file.modifiedAt).toLocaleDateString('en-US', {
              month: 'short',
              day: 'numeric',
            })}`
          : undefined,
        fileSensitivity: 'Standard',
      }))
  }, [reduxFiles, currentUser])

  const handleFileClick = (file: UIFileItem) => {
    console.log('File clicked:', file.name)
  }

  const handleFileAction = (file: UIFileItem, action: string) => {
    if (action === 'remove') {
      void moveToTrash(file.id)
      return
    }
    console.log('File action:', action, file.name)
  }

  // Show nothing during hydration to prevent mismatch
  if (!isHydrated) {
    return null
  }

  return (
    <>
      {suggestedFiles.length > 0 ? (
        <div className="p-8">
          <div className="mb-6 flex items-center justify-between">
            <h1 className="text-2xl font-semibold text-gray-900">Suggested files</h1>
            <FileViewToggle viewMode={viewMode} onViewModeChange={setViewMode} />
          </div>
          {viewMode === 'grid' ? (
            <FileGrid
              files={suggestedFiles}
              onFileClick={handleFileClick}
              onFileAction={handleFileAction}
              actionConfig={{ remove: true }}
            />
          ) : (
            <FileList
              files={suggestedFiles}
              onFileClick={handleFileClick}
              onFileAction={handleFileAction}
              actionConfig={{ remove: true }}
              showColumns={{
                name: true,
                reason: true,
                owner: true,
                location: true,
                modified: true,
                size: true,
              }}
            />
          )}
        </div>
      ) : (
        <div className="min-h-full p-6 flex flex-col">
          <h1 className="text-2xl font-normal text-gray-900 mb-6">Welcome to DriveG</h1>

          <div className="flex-1 flex flex-col items-center mt-20 text-center gap-3">
            <Image
              src="/upload-file/upload-image-2.svg"
              alt="Upload File"
              width={100}
              height={100}
              className="w-48 h-48 object-contain"
            />
            <p className="text-gray-600 text-base font-normal">
              Drag your files and folders here or use the &apos;New&apos; button to upload files
            </p>
          </div>
        </div>
      )}
    </>
  )
}

