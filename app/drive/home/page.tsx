'use client'

import { FileViewToggle, FileGrid, FileList, useViewMode } from '@/components/FileViewToggle'
import type { FileItem } from '@/components/FileViewToggle'
import {
  DocumentTextIcon,
  TableCellsIcon,
  PresentationChartBarIcon,
  VideoCameraIcon,
  FolderIcon,
} from '@heroicons/react/24/outline'
import { useEffect, useState } from 'react'
import Image from "next/image";

// Sample data for testing
const sampleFiles: FileItem[] = [
  {
    id: '1',
    name: '[RLGYM][DriveG] Task Split Sheet.xlsx',
    type: 'file',
    mimeType: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
    icon: TableCellsIcon,
    owner: {
      name: 'Raghavendar Gunda',
    },
    createdTime: new Date().toISOString(),
    modifiedTime: new Date().toISOString(),
    size: '125 KB',
    location: 'driveG',
    reasonSuggested: 'Raghavendar Gunda created • 10:23 AM',
    fileSensitivity: 'Standard',
  },
  {
    id: '2',
    name: 'google_drive_ui_components.xlsx',
    type: 'file',
    mimeType: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
    icon: TableCellsIcon,
    owner: {
      name: 'Raghavendar Gunda',
    },
    modifiedTime: new Date(Date.now() - 2 * 60 * 60 * 1000).toISOString(),
    size: '89 KB',
    location: 'driveG',
    reasonSuggested: 'You opened • 9:48 AM',
    fileSensitivity: 'Standard',
  },
  {
    id: '3',
    name: 'open table scenarios.mp4',
    type: 'file',
    mimeType: 'video/mp4',
    icon: VideoCameraIcon,
    owner: {
      name: 'Raghavendar Gunda',
    },
    modifiedTime: new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString(),
    size: '15.2 MB',
    location: 'opentable',
    reasonSuggested: 'You opened • Nov 27, 2025',
    fileSensitivity: 'Standard',
  },
  {
    id: '4',
    name: 'G_Drive_Modules_Final.xlsx',
    type: 'file',
    mimeType: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
    icon: TableCellsIcon,
    owner: {
      name: 'Raghavendar Gunda',
    },
    modifiedTime: new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString(),
    size: '234 KB',
    location: 'driveG',
    reasonSuggested: 'Raghavendar Gunda edited • Nov 27, 2025',
    fileSensitivity: 'Standard',
  },
  {
    id: '5',
    name: '[Turing RLGY] Woocommerce Task Split',
    type: 'file',
    mimeType: 'application/vnd.google-apps.document',
    icon: DocumentTextIcon,
    owner: {
      name: 'Amante Diriba',
    },
    modifiedTime: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000).toISOString(),
    size: '45 KB',
    location: 'woocommerce',
    reasonSuggested: 'Based on past activity',
    fileSensitivity: 'Standard',
  },
  {
    id: '6',
    name: '[RLGYM][OpenTable] Task Split Sheet',
    type: 'file',
    mimeType: 'application/vnd.google-apps.spreadsheet',
    icon: TableCellsIcon,
    owner: {
      name: 'Amante Diriba',
    },
    modifiedTime: new Date(Date.now() - 2 * 60 * 60 * 1000).toISOString(),
    size: '112 KB',
    location: 'opentable',
    reasonSuggested: 'You opened • 9:47 AM',
    fileSensitivity: 'Standard',
  },
  {
    id: '7',
    name: 'Daily Sync- Open Table - 2025/11/26 19:44 GMT+05:30 - No...',
    type: 'file',
    mimeType: 'application/vnd.google-apps.document',
    icon: DocumentTextIcon,
    owner: {
      name: 'Gunjan Madan',
    },
    modifiedTime: new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString(),
    size: '78 KB',
    location: 'Shared with me',
    reasonSuggested: 'Gunjan Madan shared with you • Nov 26, 2025',
    fileSensitivity: 'Standard',
  },
  {
    id: '8',
    name: 'Google_Drive_Module_sample.xlsx',
    type: 'file',
    mimeType: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
    icon: TableCellsIcon,
    owner: {
      name: 'Raghavendar Gunda',
    },
    modifiedTime: new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString(),
    size: '156 KB',
    location: 'driveG',
    reasonSuggested: 'Raghavendar Gunda edited • Nov 26, 2025',
    fileSensitivity: 'Standard',
  },
  {
    id: '9',
    name: 'Project Presentation',
    type: 'file',
    mimeType: 'application/vnd.google-apps.presentation',
    icon: PresentationChartBarIcon,
    owner: {
      name: 'Gunjan Madan',
    },
    modifiedTime: new Date(Date.now() - 12 * 60 * 60 * 1000).toISOString(),
    size: '2.3 MB',
    location: 'Shared with me',
    reasonSuggested: 'Gunjan Madan shared with you • Nov 27, 2025',
    fileSensitivity: 'Standard',
  },
  {
    id: '10',
    name: 'Design Assets',
    type: 'folder',
    icon: FolderIcon,
    owner: {
      name: 'me',
    },
    modifiedTime: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000).toISOString(),
    location: 'My Drive',
    reasonSuggested: 'You opened • Nov 24, 2025',
    fileSensitivity: 'Standard',
  },
]

export default function HomePage() {
  const [viewMode, setViewMode] = useViewMode('list')
  const [isHydrated, setIsHydrated] = useState(false)

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
    <>
      {sampleFiles.length > 0 ? (
        <div className="p-8">
          <div className="mb-6 flex items-center justify-between">
            <h1 className="text-2xl font-semibold text-gray-900">Suggested files</h1>
            <FileViewToggle viewMode={viewMode} onViewModeChange={setViewMode} />
          </div>
          {viewMode === 'grid' ? (
            <FileGrid
              files={sampleFiles}
              onFileClick={handleFileClick}
              onFileAction={handleFileAction}
            />
          ) : (
            <FileList
              files={sampleFiles}
              onFileClick={handleFileClick}
              onFileAction={handleFileAction}
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
              Drag your files and folders here or use the 'New' button to upload files
            </p>
          </div>
        </div>
      )}
    </>
  )
}

