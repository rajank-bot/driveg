'use client'

import { forwardRef } from 'react'
import { Bars3Icon } from '@heroicons/react/24/outline'

interface SortButtonProps {
  className?: string
}

const SortButton = forwardRef<HTMLButtonElement, SortButtonProps>(
  ({ className = '', ...props }, ref) => {
    return (
      <button
        ref={ref}
        className={`flex items-center gap-2 px-3 py-2 border border-gray-300 rounded hover:bg-gray-50 transition-colors ${className}`}
        aria-label="Sort"
        {...props}
      >
        <Bars3Icon className="h-4 w-4 text-gray-600" />
        <span className="text-sm text-gray-700">Sort</span>
      </button>
    )
  }
)

SortButton.displayName = 'SortButton'

export default SortButton

