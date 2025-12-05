'use client'

import { useState, useEffect } from 'react'
import * as DropdownMenu from '@radix-ui/react-dropdown-menu'
import { CheckIcon } from '@heroicons/react/24/solid'
import type {
  SortByOption,
  SortDirection,
  FoldersPosition,
} from '@/lib/store/slices/sortSlice'

interface SortOption {
  value: SortByOption
  label: string
}

interface SortPanelProps {
  sortBy: SortByOption
  sortDirection: SortDirection
  foldersPosition: FoldersPosition
  sortByOptions: SortOption[]
  onSortByChange: (value: SortByOption) => void
  onSortDirectionChange: (value: SortDirection) => void
  onFoldersPositionChange: (value: FoldersPosition) => void
  showFoldersSection?: boolean // Whether to show folders section (default: true)
  open?: boolean // Controlled open state
  onOpenChange?: (open: boolean) => void // Callback when open state changes
  align?: 'start' | 'end' // Alignment of dropdown (default: 'end' for list view, 'start' for grid view)
  children: React.ReactNode
}

export default function SortPanel({
  sortBy,
  sortDirection,
  foldersPosition,
  sortByOptions,
  onSortByChange,
  onSortDirectionChange,
  onFoldersPositionChange,
  showFoldersSection = true, // Default to true for backward compatibility
  open: controlledOpen,
  onOpenChange,
  align = 'end', // Default to 'end' for list view
  children,
}: SortPanelProps) {
  const [internalOpen, setInternalOpen] = useState(false)
  const open = controlledOpen !== undefined ? controlledOpen : internalOpen
  const setOpen = onOpenChange || setInternalOpen

  useEffect(() => {
    const handleVisibilityChange = () => {
      if (document.hidden) {
        setOpen(false)
      }
    }

    document.addEventListener('visibilitychange', handleVisibilityChange)

    return () => {
      document.removeEventListener('visibilitychange', handleVisibilityChange)
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []) // setOpen is stable (either useState setter or prop callback)

  // Determine sort direction options based on sortBy
  const sortDirectionOptions: Array<{ value: SortDirection; label: string }> =
    sortBy === 'name'
      ? [
          { value: 'aToZ', label: 'A to Z' },
          { value: 'zToA', label: 'Z to A' },
        ]
      : [
          { value: 'newToOld', label: 'New to old' },
          { value: 'oldToNew', label: 'Old to new' },
        ]

  return (
    <DropdownMenu.Root open={open} onOpenChange={setOpen}>
      <DropdownMenu.Trigger asChild>{children}</DropdownMenu.Trigger>

      <DropdownMenu.Portal>
        <DropdownMenu.Content
          className="bg-white rounded-lg shadow-lg border border-gray-200 min-w-[280px] py-1 z-50"
          style={{
            boxShadow:
              '0 2px 6px 2px rgba(60,64,67,.15), 0 0 1px rgba(60,64,67,.3)',
            zIndex: 1000,
          }}
          sideOffset={5}
          align={align}
          side="bottom"
        >
          {/* Sort by section */}
          <div className="px-2 py-1.5">
            <div className="px-2 py-1 text-xs font-medium text-gray-500 uppercase">
              Sort by
            </div>
            {sortByOptions.map((option) => (
              <DropdownMenu.Item
                key={option.value}
                onSelect={(e) => {
                  e.preventDefault()
                  // If same option is selected, toggle direction instead of resetting
                  if (sortBy === option.value) {
                    if (option.value === 'name') {
                      onSortDirectionChange(sortDirection === 'aToZ' ? 'zToA' : 'aToZ')
                    } else {
                      onSortDirectionChange(sortDirection === 'newToOld' ? 'oldToNew' : 'newToOld')
                    }
                  } else {
                    // New option selected - set default direction
                    onSortByChange(option.value)
                    if (option.value === 'name') {
                      onSortDirectionChange('aToZ')
                    } else {
                      // All date fields default to newToOld
                      onSortDirectionChange('newToOld')
                    }
                  }
                  // Close dropdown after selection
                  setOpen(false)
                }}
                className={`w-full flex items-center justify-between px-4 py-2.5 hover:bg-gray-50 active:bg-gray-100 focus:bg-gray-50 outline-none cursor-pointer text-left ${
                  sortBy === option.value ? 'bg-gray-50' : ''
                }`}
              >
                <span className="text-sm text-gray-700">{option.label}</span>
                {sortBy === option.value && (
                  <CheckIcon className="h-4 w-4 text-blue-600" />
                )}
              </DropdownMenu.Item>
            ))}
          </div>

          <DropdownMenu.Separator className="h-px bg-gray-200 my-1" />

          {/* Sort direction section */}
          <div className="px-2 py-1.5">
            <div className="px-2 py-1 text-xs font-medium text-gray-500 uppercase">
              Sort direction
            </div>
            {sortDirectionOptions.map((option) => (
              <DropdownMenu.Item
                key={option.value}
                onSelect={(e) => {
                  e.preventDefault()
                  onSortDirectionChange(option.value)
                  // Close dropdown after selection
                  setOpen(false)
                }}
                className={`w-full flex items-center justify-between px-4 py-2.5 hover:bg-gray-50 active:bg-gray-100 focus:bg-gray-50 outline-none cursor-pointer text-left ${
                  sortDirection === option.value ? 'bg-gray-50' : ''
                }`}
              >
                <span className="text-sm text-gray-700">{option.label}</span>
                {sortDirection === option.value && (
                  <CheckIcon className="h-4 w-4 text-blue-600" />
                )}
              </DropdownMenu.Item>
            ))}
          </div>

          {/* Only show folders section if showFoldersSection is true */}
          {showFoldersSection && (
            <>
              <DropdownMenu.Separator className="h-px bg-gray-200 my-1" />

              {/* Folders position section */}
              <div className="px-2 py-1.5">
                <div className="px-2 py-1 text-xs font-medium text-gray-500 uppercase">
                  Folders
                </div>
                <DropdownMenu.Item
                  onSelect={(e) => {
                    e.preventDefault()
                    onFoldersPositionChange('onTop')
                    // Close dropdown after selection
                    setOpen(false)
                  }}
                  className={`w-full flex items-center justify-between px-4 py-2.5 hover:bg-gray-50 active:bg-gray-100 focus:bg-gray-50 outline-none cursor-pointer text-left ${
                    foldersPosition === 'onTop' ? 'bg-gray-50' : ''
                  }`}
                >
                  <span className="text-sm text-gray-700">On top</span>
                  {foldersPosition === 'onTop' && (
                    <CheckIcon className="h-4 w-4 text-blue-600" />
                  )}
                </DropdownMenu.Item>
                <DropdownMenu.Item
                  onSelect={(e) => {
                    e.preventDefault()
                    onFoldersPositionChange('mixedWithFiles')
                    // Close dropdown after selection
                    setOpen(false)
                  }}
                  className={`w-full flex items-center justify-between px-4 py-2.5 hover:bg-gray-50 active:bg-gray-100 focus:bg-gray-50 outline-none cursor-pointer text-left ${
                    foldersPosition === 'mixedWithFiles' ? 'bg-gray-50' : ''
                  }`}
                >
                  <span className="text-sm text-gray-700">Mixed with files</span>
                  {foldersPosition === 'mixedWithFiles' && (
                    <CheckIcon className="h-4 w-4 text-blue-600" />
                  )}
                </DropdownMenu.Item>
              </div>
            </>
          )}
        </DropdownMenu.Content>
      </DropdownMenu.Portal>
    </DropdownMenu.Root>
  )
}

