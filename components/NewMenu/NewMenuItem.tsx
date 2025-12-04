'use client'

import * as DropdownMenu from '@radix-ui/react-dropdown-menu'
import { ChevronRightIcon } from '@heroicons/react/24/outline'
import { useRef } from 'react'

interface NewMenuItemProps {
  icon: React.ComponentType<{ className?: string }>
  label: string
  shortcut?: string
  hasChevron?: boolean
  onClick?: () => void
  shouldCloseMenu?: boolean
}

export default function NewMenuItem({
  icon: Icon,
  label,
  shortcut,
  hasChevron,
  onClick,
  shouldCloseMenu = false,
}: NewMenuItemProps) {
  const wasClickedRef = useRef(false)

  const handlePointerDown = () => {
    // Mark that this item was clicked
    wasClickedRef.current = true
  }

  const handleSelect = (e: Event) => {
    // Only call onClick if the item was actually clicked (not just focused)
    if (onClick && wasClickedRef.current) {
      // For items that should close the menu (like 'new-folder'), let it close naturally
      // For other items, prevent default to keep menu open
      if (!shouldCloseMenu) {
        e.preventDefault()
      }
      // Call onClick only when item is actually clicked
      onClick()
      // Reset the flag
      wasClickedRef.current = false
    } else {
      // No onClick handler or wasn't clicked - prevent default to keep menu open
      e.preventDefault()
      wasClickedRef.current = false
    }
  }

  return (
    <DropdownMenu.Item
      onPointerDown={handlePointerDown}
      onSelect={handleSelect}
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
