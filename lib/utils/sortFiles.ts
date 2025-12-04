import type { FileItem } from '@/types/fileViewToggle'
import type {
  SortByOption,
  SortDirection,
  FoldersPosition,
} from '@/lib/store/slices/sortSlice'

/**
 * Safely parses a date string and returns timestamp, or null if invalid
 * @param dateString - Date string to parse
 * @returns Timestamp in milliseconds or null if invalid
 */
function parseDate(dateString: string): number | null {
  if (!dateString) return null
  try {
    const date = new Date(dateString)
    const timestamp = date.getTime()
    // Check if date is valid (not NaN)
    return isNaN(timestamp) ? null : timestamp
  } catch {
    return null
  }
}

/**
 * Sorts files based on sort settings
 * @param files - Array of files to sort
 * @param sortBy - What to sort by
 * @param sortDirection - Sort direction
 * @param foldersPosition - Where to place folders
 * @returns Sorted array of files
 */
export function sortFiles(
  files: FileItem[],
  sortBy: SortByOption,
  sortDirection: SortDirection,
  foldersPosition: FoldersPosition
): FileItem[] {
  // Separate folders and files if folders should be on top
  const folders = files.filter((f) => f.type === 'folder')
  const fileItems = files.filter((f) => f.type !== 'folder') // Include all non-folder types (file, image, video, etc.)

  // Sort function
  const sortItems = (items: FileItem[]): FileItem[] => {
    return [...items].sort((a, b) => {
      let comparison = 0

      switch (sortBy) {
        case 'name':
          comparison = a.name.localeCompare(b.name, undefined, {
            sensitivity: 'base',
            numeric: true,
          })
          return sortDirection === 'aToZ' ? comparison : -comparison

        case 'dateModified':
          const aModified = a.modifiedTime
            ? parseDate(a.modifiedTime) || 0
            : 0
          const bModified = b.modifiedTime
            ? parseDate(b.modifiedTime) || 0
            : 0
          comparison = aModified - bModified
          return sortDirection === 'newToOld' ? -comparison : comparison

        case 'dateModifiedByMe':
          // Use dateModifiedByMe if available, otherwise fallback to modifiedTime
          const aModifiedByMe = a.dateModifiedByMe
            ? parseDate(a.dateModifiedByMe) || (a.modifiedTime ? parseDate(a.modifiedTime) || 0 : 0)
            : a.modifiedTime
            ? parseDate(a.modifiedTime) || 0
            : 0
          const bModifiedByMe = b.dateModifiedByMe
            ? parseDate(b.dateModifiedByMe) || (b.modifiedTime ? parseDate(b.modifiedTime) || 0 : 0)
            : b.modifiedTime
            ? parseDate(b.modifiedTime) || 0
            : 0
          comparison = aModifiedByMe - bModifiedByMe
          return sortDirection === 'newToOld' ? -comparison : comparison

        case 'dateOpenedByMe':
          // Use dateOpenedByMe if available, otherwise fallback to createdTime
          const aOpened = a.dateOpenedByMe
            ? parseDate(a.dateOpenedByMe) || (a.createdTime ? parseDate(a.createdTime) || 0 : 0)
            : a.createdTime
            ? parseDate(a.createdTime) || 0
            : 0
          const bOpened = b.dateOpenedByMe
            ? parseDate(b.dateOpenedByMe) || (b.createdTime ? parseDate(b.createdTime) || 0 : 0)
            : b.createdTime
            ? parseDate(b.createdTime) || 0
            : 0
          comparison = aOpened - bOpened
          return sortDirection === 'newToOld' ? -comparison : comparison

        case 'dateShared':
          // Use dateShared if available, otherwise fallback to createdTime
          const aShared = a.dateShared
            ? parseDate(a.dateShared) || (a.createdTime ? parseDate(a.createdTime) || 0 : 0)
            : a.createdTime
            ? parseDate(a.createdTime) || 0
            : 0
          const bShared = b.dateShared
            ? parseDate(b.dateShared) || (b.createdTime ? parseDate(b.createdTime) || 0 : 0)
            : b.createdTime
            ? parseDate(b.createdTime) || 0
            : 0
          comparison = aShared - bShared
          return sortDirection === 'newToOld' ? -comparison : comparison

        case 'dateTrashed':
          // Use dateTrashed if available, otherwise fallback to createdTime
          const aTrashed = a.dateTrashed
            ? parseDate(a.dateTrashed) || (a.createdTime ? parseDate(a.createdTime) || 0 : 0)
            : a.createdTime
            ? parseDate(a.createdTime) || 0
            : 0
          const bTrashed = b.dateTrashed
            ? parseDate(b.dateTrashed) || (b.createdTime ? parseDate(b.createdTime) || 0 : 0)
            : b.createdTime
            ? parseDate(b.createdTime) || 0
            : 0
          comparison = aTrashed - bTrashed
          return sortDirection === 'newToOld' ? -comparison : comparison

        default:
          return 0
      }
    })
  }

  // Sort folders and files separately
  const sortedFolders = sortItems(folders)
  const sortedFiles = sortItems(fileItems)

  // Combine based on folders position
  if (foldersPosition === 'onTop') {
    return [...sortedFolders, ...sortedFiles]
  } else {
    // Mixed: sort all together
    return sortItems([...folders, ...fileItems])
  }
}

