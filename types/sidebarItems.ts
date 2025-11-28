import {
  HomeIcon,
  ClockIcon,
  StarIcon,
  FolderIcon,
  UsersIcon,
  TrashIcon,
  ShieldExclamationIcon,
  CpuChipIcon,
  BellIcon,
} from '@heroicons/react/24/outline'

export interface SidebarItem {
  label: string
  path: string
  icon: React.ComponentType<{ className?: string }>
  expandable?: boolean
  children?: SidebarItem[] // Future: sub-items for expandable items
}

export const SIDEBAR_ITEMS: SidebarItem[] = [
  { label: 'Home', path: '/drive/home', icon: HomeIcon },
  { label: 'Activity', path: '/drive/activity', icon: BellIcon },
  { label: 'Workspaces', path: '/drive/workspaces', icon: CpuChipIcon },
  { label: 'My Drive', path: '/drive/my-drive', icon: FolderIcon, expandable: true },
  { label: 'Shared drives', path: '/drive/shared-drives', icon: UsersIcon, expandable: true },
  { label: 'Shared with me', path: '/drive/shared-with-me', icon: UsersIcon },
  { label: 'Recent', path: '/drive/recent', icon: ClockIcon },
  { label: 'Starred', path: '/drive/starred', icon: StarIcon },
  { label: 'Spam', path: '/drive/spam', icon: ShieldExclamationIcon },
  { label: 'Trash', path: '/drive/trash', icon: TrashIcon },
  { label: 'Storage', path: '/drive/storage', icon: FolderIcon },
]

