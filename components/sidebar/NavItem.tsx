import React from 'react'
import { ChevronRightIcon } from '@heroicons/react/24/outline'

interface NavItemProps {
  icon: React.ComponentType<{ className?: string }>
  label: string
  active?: boolean
  expandable?: boolean
  expanded?: boolean
  onClick?: () => void
}

export default function NavItem({
  icon: Icon,
  label,
  active,
  expandable,
  expanded,
  onClick,
}: NavItemProps) {
  return (
    <button
      onClick={onClick}
      className={`flex items-center gap-3 px-3 py-2 rounded-full cursor-pointer transition-colors w-full text-left ${
        active ? '' : 'hover:bg-gray-100'
      }`}
      style={
        active
          ? {
              backgroundColor: '#c2e7ff',
              color: '#004a77',
            }
          : {}
      }
    >
      {expandable && (
        <ChevronRightIcon
          className={`w-4 h-4 transition-transform ${
            expanded ? 'rotate-90' : ''
          }`}
          style={active ? { color: '#004a77' } : { color: '#111827' }}
        />
      )}
      <Icon
        className="w-5 h-5"
        style={active ? { color: '#004a77' } : { color: '#111827' }}
      />
      <span
        style={
          active
            ? { color: '#004a77', fontWeight: 500 }
            : { color: '#111827', fontWeight: 400 }
        }
      >
        {label}
      </span>
    </button>
  )
}

