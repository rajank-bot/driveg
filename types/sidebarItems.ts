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
  icon: React.ComponentType<{ className?: string }>
  active?: boolean
  expandable?: boolean
}

export const SIDEBAR_ITEMS: SidebarItem[] = [
  { label: 'Home', icon: HomeIcon, active: true },
  { label: 'Activity', icon: BellIcon },
  { label: 'Workspaces', icon: CpuChipIcon },
  { label: 'My Drive', icon: FolderIcon, expandable: true },
  { label: 'Shared drives', icon: UsersIcon, expandable: true },
  { label: 'Shared with me', icon: UsersIcon },
  { label: 'Recent', icon: ClockIcon },
  { label: 'Starred', icon: StarIcon },
  { label: 'Spam', icon: ShieldExclamationIcon },
  { label: 'Trash', icon: TrashIcon },
  { label: 'Storage', icon: FolderIcon },
]

