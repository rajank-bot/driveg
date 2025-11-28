import * as DropdownMenu from '@radix-ui/react-dropdown-menu'
import { ChevronRightIcon } from '@heroicons/react/24/outline'

interface NewMenuItemProps {
  icon: React.ComponentType<{ className?: string }>
  label: string
  shortcut?: string
  hasChevron?: boolean
  onClick?: () => void
}

export default function NewMenuItem({
  icon: Icon,
  label,
  shortcut,
  hasChevron,
  onClick,
}: NewMenuItemProps) {
  return (
    <DropdownMenu.Item
      onSelect={(e) => {
        e.preventDefault()
        onClick?.()
      }}
      className="w-full flex items-center justify-between px-4 py-2.5 hover:bg-gray-50 active:bg-gray-100 focus:bg-gray-50 outline-none cursor-pointer text-left group data-[highlighted]:bg-gray-50"
    >
      <div className="flex items-center gap-3 flex-1 min-w-0">
        <Icon className="w-5 h-5 text-gray-600 flex-shrink-0" />
        <span className="text-sm text-gray-700 flex-1">{label}</span>
      </div>
      <div className="flex items-center gap-3 flex-shrink-0">
        {shortcut && (
          <span className="text-xs text-gray-500 font-mono whitespace-nowrap">
            {shortcut}
          </span>
        )}
        {hasChevron && (
          <ChevronRightIcon className="w-4 h-4 text-gray-400 group-hover:text-gray-600 transition-colors" />
        )}
      </div>
    </DropdownMenu.Item>
  )
}
