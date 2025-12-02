export type ViewMode = 'list' | 'grid'

export interface FileItem {
  id: string
  name: string
  type: 'file' | 'folder' | 'image' | 'video' | 'audio' | 'document' | 'spreadsheet' | 'presentation' | 'pdf' | 'google-apps'
  mimeType?: string
  icon?: React.ComponentType<{ className?: string }>
  thumbnail?: string
  owner?: {
    name: string
    avatar?: string
  }
  modifiedTime?: string
  createdTime?: string
  size?: string
  location?: string
  reasonSuggested?: string
  fileSensitivity?: string
  starred?: boolean
  shared?: boolean
  activity?: string
  sharedBy?: {
    name: string
    avatar?: string
  }
  dateShared?: string
  dateTrashed?: string
  originalLocation?: string
}

export interface FileViewToggleProps {
  viewMode: ViewMode
  onViewModeChange: (mode: ViewMode) => void
  className?: string
}

export interface FileGridProps {
  files: FileItem[]
  onFileClick?: (file: FileItem) => void
  onFileAction?: (file: FileItem, action: string) => void
  className?: string
  groupedFiles?: { [key: string]: FileItem[] }
}

export interface FileListProps {
  files: FileItem[]
  onFileClick?: (file: FileItem) => void
  onFileAction?: (file: FileItem, action: string) => void
  className?: string
  showColumns?: {
    name?: boolean
    owner?: boolean
    modified?: boolean
    size?: boolean
    location?: boolean
    reason?: boolean
    activity?: boolean
    sharedBy?: boolean
    dateShared?: boolean
    dateTrashed?: boolean
    originalLocation?: boolean
  }
  groupedFiles?: { [key: string]: FileItem[] }
  customColumnHeaders?: {
    reason?: string
    activity?: string
    modified?: string
    [key: string]: string | undefined
  }
}

