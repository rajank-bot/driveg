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
    initial?: string // Custom initial for display (e.g., "S" for "me")
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
  dateModifiedByMe?: string
  dateOpenedByMe?: string
}

export interface FileActionConfig {
  share?: boolean
  download?: boolean
  rename?: boolean
  star?: boolean
  remove?: boolean
  restore?: boolean
  deleteForever?: boolean
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
  // Sort props for sort indicator tab with dropdown
  sortBy?: 'name' | 'dateModified' | 'dateModifiedByMe' | 'dateOpenedByMe' | 'dateShared' | 'dateTrashed'
  sortDirection?: 'aToZ' | 'zToA' | 'newToOld' | 'oldToNew'
  foldersPosition?: 'onTop' | 'mixedWithFiles'
  sortByOptions?: Array<{ value: 'name' | 'dateModified' | 'dateModifiedByMe' | 'dateOpenedByMe' | 'dateShared' | 'dateTrashed'; label: string }>
  onSortByChange?: (sortBy: 'name' | 'dateModified' | 'dateModifiedByMe' | 'dateOpenedByMe' | 'dateShared' | 'dateTrashed') => void
  onSortDirectionChange?: (direction: 'aToZ' | 'zToA' | 'newToOld' | 'oldToNew') => void
  onFoldersPositionChange?: (position: 'onTop' | 'mixedWithFiles') => void
  showFoldersSection?: boolean
  sortPanelOpen?: boolean
  onSortPanelOpenChange?: (open: boolean) => void
  actionConfig?: FileActionConfig
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
    dateModifiedByMe?: boolean
    dateOpenedByMe?: boolean
  }
  groupedFiles?: { [key: string]: FileItem[] }
  customColumnHeaders?: {
    reason?: string
    activity?: string
    modified?: string
    dateColumn?: string
    [key: string]: string | undefined
  }
  // Sort props for interactive sorting
  sortBy?: 'name' | 'dateModified' | 'dateModifiedByMe' | 'dateOpenedByMe' | 'dateShared' | 'dateTrashed'
  sortDirection?: 'aToZ' | 'zToA' | 'newToOld' | 'oldToNew'
  foldersPosition?: 'onTop' | 'mixedWithFiles'
  sortByOptions?: Array<{ value: 'name' | 'dateModified' | 'dateModifiedByMe' | 'dateOpenedByMe' | 'dateShared' | 'dateTrashed'; label: string }>
  onSortByChange?: (sortBy: 'name' | 'dateModified' | 'dateModifiedByMe' | 'dateOpenedByMe' | 'dateShared' | 'dateTrashed') => void
  onSortDirectionChange?: (direction: 'aToZ' | 'zToA' | 'newToOld' | 'oldToNew') => void
  onFoldersPositionChange?: (position: 'onTop' | 'mixedWithFiles') => void
  showFoldersSection?: boolean
  sortPanelOpen?: boolean
  onSortPanelOpenChange?: (open: boolean) => void
  actionConfig?: FileActionConfig
}

