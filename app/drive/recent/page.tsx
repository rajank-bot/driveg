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
import { ImageIcon } from 'lucide-react'
import { useEffect, useState, useMemo } from 'react'

// Helper function to get time period group name
const getTimePeriodGroup = (date: Date): string => {
  const now = new Date()
  const diffTime = now.getTime() - date.getTime()
  const diffDays = Math.floor(diffTime / (1000 * 60 * 60 * 24))
  const diffMonths = Math.floor(diffDays / 30)
  const diffYears = Math.floor(diffDays / 365)

  if (diffDays === 0) {
    return 'Today'
  } else if (diffDays <= 7) {
    return 'Last week'
  } else if (diffDays <= 30) {
    return 'Last month'
  } else if (diffYears === 0) {
    return 'Earlier this year'
  } else {
    return 'Never'
  }
}

// Helper function to format time for reasonSuggested
const formatTimeForReason = (date: Date, action: string = 'opened'): string => {
  const now = new Date()
  const diffTime = now.getTime() - date.getTime()
  const diffHours = Math.floor(diffTime / (1000 * 60 * 60))
  const diffDays = Math.floor(diffTime / (1000 * 60 * 60 * 24))

  if (diffHours < 1) {
    const minutes = Math.floor(diffTime / (1000 * 60))
    return `You ${action} • ${minutes} min ago`
  } else if (diffDays === 0) {
    const hours = date.getHours()
    const minutes = date.getMinutes()
    const ampm = hours >= 12 ? 'PM' : 'AM'
    const displayHours = hours % 12 || 12
    const displayMinutes = minutes.toString().padStart(2, '0')
    return `You ${action} • ${displayHours}:${displayMinutes} ${ampm}`
  } else if (diffDays <= 7) {
    return `You ${action} • ${date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}`
  } else {
    return `You ${action} • ${date.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}`
  }
}

export default function RecentPage() {
  const [viewMode, setViewMode] = useViewMode('list')
  const [isHydrated, setIsHydrated] = useState(false)

  // Generate files with different time periods
  const files: FileItem[] = useMemo(() => {
    const now = new Date()
    
    return [
      // Today
      {
        id: '1',
        name: 'Screenshot 2025-11-19 122956.png',
        type: 'image',
        mimeType: 'image/png',
        icon: ImageIcon,
        owner: { name: 'me' },
        modifiedTime: new Date(now.getTime() - 2 * 60 * 60 * 1000).toISOString(), // 2 hours ago
        size: '1.2 MB',
        location: 'My Drive',
        reasonSuggested: formatTimeForReason(new Date(now.getTime() - 2 * 60 * 60 * 1000), 'uploaded'),
        fileSensitivity: 'Standard',
      },
      {
        id: '2',
        name: '[RLGYM][OpenTable] Task Split Sheet',
        type: 'spreadsheet',
        mimeType: 'application/vnd.google-apps.spreadsheet',
        icon: TableCellsIcon,
        owner: { name: 'Amante Diriba' },
        modifiedTime: new Date(now.getTime() - 3 * 60 * 60 * 1000).toISOString(), // 3 hours ago
        size: '18 KB',
        location: 'opentable',
        reasonSuggested: formatTimeForReason(new Date(now.getTime() - 3 * 60 * 60 * 1000)),
        fileSensitivity: 'Standard',
        shared: true,
      },
      {
        id: '3',
        name: 'Daily Sync- Open Table - 2025/12/01 19:28 GMT+05:30 - Notes by Gemini',
        type: 'document',
        mimeType: 'application/vnd.google-apps.document',
        icon: DocumentTextIcon,
        owner: { name: 'Gunjan Madan' },
        modifiedTime: new Date(now.getTime() - 4 * 60 * 60 * 1000).toISOString(), // 4 hours ago
        size: '14 KB',
        location: 'Shared with me',
        reasonSuggested: formatTimeForReason(new Date(now.getTime() - 4 * 60 * 60 * 1000)),
        fileSensitivity: 'Standard',
        shared: true,
      },
      {
        id: '4',
        name: '[RLGYM][DriveG] Task Split Sheet.xlsx',
        type: 'spreadsheet',
        mimeType: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
        icon: TableCellsIcon,
        owner: { name: 'Raghavendar Gunda' },
        modifiedTime: new Date(now.getTime() - 5 * 60 * 60 * 1000).toISOString(), // 5 hours ago
        size: '43 KB',
        location: 'driveG',
        reasonSuggested: formatTimeForReason(new Date(now.getTime() - 5 * 60 * 60 * 1000)),
        fileSensitivity: 'Standard',
        starred: true,
        shared: true,
      },
      {
        id: '5',
        name: 'google_drive_ui_components.xlsx',
        type: 'spreadsheet',
        mimeType: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
        icon: TableCellsIcon,
        owner: { name: 'Raghavendar Gunda' },
        modifiedTime: new Date(now.getTime() - 6 * 60 * 60 * 1000).toISOString(), // 6 hours ago
        size: '9 KB',
        location: 'driveG',
        reasonSuggested: formatTimeForReason(new Date(now.getTime() - 6 * 60 * 60 * 1000)),
        fileSensitivity: 'Standard',
      },
      // Last week
      {
        id: '6',
        name: 'Daily Sync- Open Table - 2025/11/27 19:28 GMT+05:30 - Notes by Gemini',
        type: 'document',
        mimeType: 'application/vnd.google-apps.document',
        icon: DocumentTextIcon,
        owner: { name: 'Gunjan Madan' },
        modifiedTime: new Date(now.getTime() - 4 * 24 * 60 * 60 * 1000).toISOString(), // 4 days ago
        size: '12 KB',
        location: 'Shared with me',
        reasonSuggested: formatTimeForReason(new Date(now.getTime() - 4 * 24 * 60 * 60 * 1000)),
        fileSensitivity: 'Standard',
        shared: true,
      },
      {
        id: '7',
        name: 'Daily Sync- Open Table - 2025/11/26 19:44 GMT+05:30 - Notes by Gemini',
        type: 'document',
        mimeType: 'application/vnd.google-apps.document',
        icon: DocumentTextIcon,
        owner: { name: 'Gunjan Madan' },
        modifiedTime: new Date(now.getTime() - 5 * 24 * 60 * 60 * 1000).toISOString(), // 5 days ago
        size: '5 KB',
        location: 'Shared with me',
        reasonSuggested: formatTimeForReason(new Date(now.getTime() - 5 * 24 * 60 * 60 * 1000)),
        fileSensitivity: 'Standard',
        shared: true,
      },
      {
        id: '8',
        name: 'open table scenarios.mp4',
        type: 'video',
        mimeType: 'video/mp4',
        icon: VideoCameraIcon,
        owner: { name: 'Raghavendar Gunda' },
        modifiedTime: new Date(now.getTime() - 5 * 24 * 60 * 60 * 1000).toISOString(), // 5 days ago
        size: '489.3 MB',
        location: 'opentable',
        reasonSuggested: formatTimeForReason(new Date(now.getTime() - 5 * 24 * 60 * 60 * 1000)),
        fileSensitivity: 'Standard',
        shared: true,
      },
      {
        id: '9',
        name: 'Daily Sync- Open Table - 2025/11/26 19:28 GMT+05:30 - Notes by Gemini',
        type: 'document',
        mimeType: 'application/vnd.google-apps.document',
        icon: DocumentTextIcon,
        owner: { name: 'Gunjan Madan' },
        modifiedTime: new Date(now.getTime() - 5 * 24 * 60 * 60 * 1000).toISOString(), // 5 days ago
        size: '10 KB',
        location: 'Shared with me',
        reasonSuggested: formatTimeForReason(new Date(now.getTime() - 5 * 24 * 60 * 60 * 1000)),
        fileSensitivity: 'Standard',
        shared: true,
      },
      {
        id: '10',
        name: 'Daily Sync- Open Table - 2025/11/24 19:28 GMT+05:30 - Notes by Gemini',
        type: 'document',
        mimeType: 'application/vnd.google-apps.document',
        icon: DocumentTextIcon,
        owner: { name: 'Gunjan Madan' },
        modifiedTime: new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000).toISOString(), // 7 days ago
        size: '6 KB',
        location: 'Shared with me',
        reasonSuggested: formatTimeForReason(new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000)),
        fileSensitivity: 'Standard',
        shared: true,
      },
      {
        id: '11',
        name: 'Draft of api on demo platform',
        type: 'document',
        mimeType: 'application/vnd.google-apps.document',
        icon: DocumentTextIcon,
        owner: { name: 'arun.h@turing.com' },
        modifiedTime: new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000).toISOString(), // 7 days ago
        size: '626 KB',
        location: 'Shared with me',
        reasonSuggested: formatTimeForReason(new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000)),
        fileSensitivity: 'Standard',
        shared: true,
      },
      // Last month
      {
        id: '12',
        name: 'Daily Sync- Open Table - 2025/11/20 19:23 GMT+05:30 - Notes by Gemini',
        type: 'document',
        mimeType: 'application/vnd.google-apps.document',
        icon: DocumentTextIcon,
        owner: { name: 'Gunjan Madan' },
        modifiedTime: new Date(now.getTime() - 12 * 24 * 60 * 60 * 1000).toISOString(), // 12 days ago
        size: '20 KB',
        location: 'Shared with me',
        reasonSuggested: formatTimeForReason(new Date(now.getTime() - 12 * 24 * 60 * 60 * 1000)),
        fileSensitivity: 'Standard',
        shared: true,
      },
      {
        id: '13',
        name: 'LinkedIn Sales Navigator Scenarios',
        type: 'document',
        mimeType: 'application/vnd.google-apps.document',
        icon: DocumentTextIcon,
        owner: { name: 'Gunjan Madan' },
        modifiedTime: new Date(now.getTime() - 18 * 24 * 60 * 60 * 1000).toISOString(), // 18 days ago
        size: '19 KB',
        location: 'Shared with me',
        reasonSuggested: formatTimeForReason(new Date(now.getTime() - 18 * 24 * 60 * 60 * 1000)),
        fileSensitivity: 'Standard',
        shared: true,
      },
      {
        id: '14',
        name: 'Daily Sync- Open Table - 2025/11/17 19:28 GMT+05:30 - Notes by Gemini',
        type: 'document',
        mimeType: 'application/vnd.google-apps.document',
        icon: DocumentTextIcon,
        owner: { name: 'Gunjan Madan' },
        modifiedTime: new Date(now.getTime() - 15 * 24 * 60 * 60 * 1000).toISOString(), // 15 days ago
        size: '5 KB',
        location: 'Shared with me',
        reasonSuggested: formatTimeForReason(new Date(now.getTime() - 15 * 24 * 60 * 60 * 1000)),
        fileSensitivity: 'Standard',
        shared: true,
      },
      {
        id: '15',
        name: 'Daily Sync- Open Table - 2025/11/12 19:28 GMT+05:30 - Notes by Gemini',
        type: 'document',
        mimeType: 'application/vnd.google-apps.document',
        icon: DocumentTextIcon,
        owner: { name: 'Gunjan Madan' },
        modifiedTime: new Date(now.getTime() - 20 * 24 * 60 * 60 * 1000).toISOString(), // 20 days ago
        size: '8 KB',
        location: 'Shared with me',
        reasonSuggested: formatTimeForReason(new Date(now.getTime() - 20 * 24 * 60 * 60 * 1000)),
        fileSensitivity: 'Standard',
        shared: true,
      },
      // Earlier this year
      {
        id: '16',
        name: 'RLGYM New Joiners October 2025 Onboarding',
        type: 'document',
        mimeType: 'application/vnd.google-apps.document',
        icon: DocumentTextIcon,
        owner: { name: 'Gunjan Madan' },
        modifiedTime: new Date(now.getTime() - 45 * 24 * 60 * 60 * 1000).toISOString(), // 45 days ago
        size: '15 KB',
        location: 'Shared with me',
        reasonSuggested: formatTimeForReason(new Date(now.getTime() - 45 * 24 * 60 * 60 * 1000), 'modified'),
        fileSensitivity: 'Standard',
        shared: true,
      },
      // Never (older than 1 year or never accessed)
      {
        id: '17',
        name: 'Zendesk Intro',
        type: 'document',
        mimeType: 'application/vnd.google-apps.document',
        icon: DocumentTextIcon,
        owner: { name: 'karan.g1@turing.com' },
        modifiedTime: new Date(now.getTime() - 400 * 24 * 60 * 60 * 1000).toISOString(), // ~13 months ago
        size: '10 KB',
        location: 'Shared with me',
        reasonSuggested: '',
        fileSensitivity: 'Standard',
        shared: true,
      },
      {
        id: '18',
        name: 'anthropic_runner...',
        type: 'document',
        mimeType: 'application/vnd.google-apps.document',
        icon: DocumentTextIcon,
        owner: { name: 'jain.ayush@turing.com' },
        modifiedTime: new Date(now.getTime() - 450 * 24 * 60 * 60 * 1000).toISOString(), // ~15 months ago
        size: '5 KB',
        location: 'Anthropic',
        reasonSuggested: '',
        fileSensitivity: 'Standard',
      },
      {
        id: '19',
        name: 'Settings_main_page.html',
        type: 'document',
        mimeType: 'text/html',
        icon: DocumentTextIcon,
        owner: { name: 'jain.ayush@turing.com' },
        modifiedTime: new Date(now.getTime() - 500 * 24 * 60 * 60 * 1000).toISOString(), // ~16 months ago
        size: '8 KB',
        location: 'workflow 7',
        reasonSuggested: '',
        fileSensitivity: 'Standard',
      },
      {
        id: '20',
        name: 'Sales JSON Data',
        type: 'document',
        mimeType: 'application/json',
        icon: DocumentTextIcon,
        owner: { name: 'jain.ayush@turing.com' },
        modifiedTime: new Date(now.getTime() - 600 * 24 * 60 * 60 * 1000).toISOString(), // ~20 months ago
        size: '249.5 MB',
        location: 'salesforce',
        reasonSuggested: '',
        fileSensitivity: 'Standard',
      },
      {
        id: '21',
        name: 'Drive G New Joiners October 2025 Onboarding',
        type: 'document',
        mimeType: 'application/vnd.google-apps.document',
        icon: DocumentTextIcon,
        owner: { name: 'Gunjan Madan' },
        modifiedTime: new Date(now.getTime() - 40 * 24 * 60 * 60 * 1000).toISOString(), // 40 days ago
        size: '15 KB',
        location: 'Shared with me',
        reasonSuggested: formatTimeForReason(new Date(now.getTime() - 40 * 24 * 60 * 60 * 1000), 'modified'),
        fileSensitivity: 'Standard',
        shared: true,
      },
    ]
  }, [])

  // Group files by time period
  const groupedFiles = useMemo(() => {
    const groups: { [key: string]: FileItem[] } = {
      'Today': [],
      'Last week': [],
      'Last month': [],
      'Earlier this year': [],
      'Never': [],
    }

    files.forEach((file) => {
      const accessTime = file.modifiedTime || file.createdTime
      if (accessTime) {
        const groupName = getTimePeriodGroup(new Date(accessTime))
        if (groups[groupName]) {
          groups[groupName].push(file)
        } else {
          groups['Never'].push(file)
        }
      } else {
        groups['Never'].push(file)
      }
    })

    // Remove empty groups
    Object.keys(groups).forEach((key) => {
      if (groups[key].length === 0) {
        delete groups[key]
      }
    })

    return groups
  }, [files])

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
        <h1 className="text-2xl font-semibold text-gray-900">Recent</h1>
        <FileViewToggle viewMode={viewMode} onViewModeChange={setViewMode} />
      </div>

      {files.length > 0 ? (
        viewMode === 'grid' ? (
          <FileGrid
            files={files}
            onFileClick={handleFileClick}
            onFileAction={handleFileAction}
            groupedFiles={groupedFiles}
          />
        ) : (
          <FileList
            files={files}
            onFileClick={handleFileClick}
            onFileAction={handleFileAction}
            showColumns={{
              name: true,
              reason: true,
              owner: true,
              size: true,
              location: true,
            }}
            groupedFiles={groupedFiles}
            customColumnHeaders={{
              reason: '',
            }}
          />
        )
      ) : (
        <p className="text-gray-600">Your recently accessed files will appear here</p>
      )}
    </div>
  )
}

