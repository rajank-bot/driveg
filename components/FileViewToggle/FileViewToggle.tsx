'use client'

import { Squares2X2Icon, Bars3Icon, CheckIcon } from '@heroicons/react/24/outline'
import type { FileViewToggleProps } from '@/types/fileViewToggle'

export default function FileViewToggle({
  viewMode,
  onViewModeChange,
  className = '',
}: FileViewToggleProps) {
  return (
    <div
      className={`inline-flex items-stretch rounded-full border border-gray-300 bg-white overflow-hidden ${className}`}
      role="group"
      aria-label="View mode toggle"
    >
      <button
        onClick={() => onViewModeChange('list')}
        className={`flex items-center gap-1.5 px-4 py-2.5 transition-all flex-1 justify-center ${
          viewMode === 'list'
            ? 'bg-blue-200'
            : 'bg-white hover:bg-gray-50'
        }`}
        aria-label="List view"
        aria-pressed={viewMode === 'list'}
      >
        {viewMode === 'list' && <CheckIcon className="h-4 w-4 text-black" />}
        <Bars3Icon className="h-4 w-4 text-black" />
      </button>
      <button
        onClick={() => onViewModeChange('grid')}
        className={`flex items-center gap-1.5 px-4 py-2.5 transition-all flex-1 justify-center ${
          viewMode === 'grid'
            ? 'bg-blue-200'
            : 'bg-white hover:bg-gray-50'
        }`}
        aria-label="Grid view"
        aria-pressed={viewMode === 'grid'}
      >
        {viewMode === 'grid' && <CheckIcon className="h-4 w-4 text-black" />}
        <Squares2X2Icon className="h-4 w-4 text-black" />
      </button>
    </div>
  )
}

