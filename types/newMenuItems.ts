import {
  FolderIcon,
  DocumentArrowUpIcon,
  FolderArrowDownIcon,
  DocumentTextIcon,
  TableCellsIcon,
  PresentationChartBarIcon,
  VideoCameraIcon,
  DocumentDuplicateIcon,
  EllipsisHorizontalIcon,
} from '@heroicons/react/24/outline'

export interface NewMenuItem {
  id: string
  label: string
  icon: React.ComponentType<{ className?: string }>
  shortcut?: string
  hasChevron?: boolean
  onClick?: () => void
}

export interface NewMenuGroup {
  id: string
  items: NewMenuItem[]
}

export const NEW_MENU_GROUPS: NewMenuGroup[] = [
  {
    id: 'create-upload',
    items: [
      {
        id: 'new-folder',
        label: 'New folder',
        icon: FolderIcon,
        shortcut: 'Alt+C then F',
      },
      {
        id: 'file-upload',
        label: 'File upload',
        icon: DocumentArrowUpIcon,
        shortcut: 'Alt+C then U',
      },
      {
        id: 'folder-upload',
        label: 'Folder upload',
        icon: FolderArrowDownIcon,
        shortcut: 'Alt+C then I',
      },
    ],
  },
  {
    id: 'google-workspace',
    items: [
      {
        id: 'google-docs',
        label: 'Google Docs',
        icon: DocumentTextIcon,
        hasChevron: true,
      },
      {
        id: 'google-sheets',
        label: 'Google Sheets',
        icon: TableCellsIcon,
        hasChevron: true,
      },
      {
        id: 'google-slides',
        label: 'Google Slides',
        icon: PresentationChartBarIcon,
        hasChevron: true,
      },
      {
        id: 'google-vids',
        label: 'Google Vids',
        icon: VideoCameraIcon,
        hasChevron: true,
      },
      {
        id: 'google-forms',
        label: 'Google Forms',
        icon: DocumentDuplicateIcon,
        hasChevron: true,
      },
      {
        id: 'more',
        label: 'More',
        icon: EllipsisHorizontalIcon,
        hasChevron: true,
      },
    ],
  },
]

