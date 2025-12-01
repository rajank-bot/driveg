'use client'

import Link from 'next/link'
import { usePathname, useRouter } from 'next/navigation'
import { ChevronRightIcon } from '@heroicons/react/24/outline'

interface NavItemProps {
  icon: React.ComponentType<{ className?: string }>
  label: string
  path: string
  expandable?: boolean
  expanded?: boolean
  onToggleExpand?: () => void
}

export default function NavItem({
  icon: Icon,
  label,
  path,
  expandable,
  expanded,
  onToggleExpand,
}: NavItemProps) {
  const pathname = usePathname()
  const router = useRouter()
  const isActive = pathname === path

  const handleClick = (e: React.MouseEvent) => {
    if (expandable && onToggleExpand) {
      e.preventDefault()
      onToggleExpand()
      // Navigate after toggling expand
      router.push(path)
    }
  }

  const content = (
    <>
      {expandable && (
        <div
          className={`w-4 h-4 transition-transform ${
            expanded ? 'rotate-90' : ''
          }`}
          style={isActive ? { color: '#004a77' } : { color: '#111827' }}
        >
          <ChevronRightIcon className="w-full h-full" />
        </div>
      )}
      <div style={isActive ? { color: '#004a77' } : { color: '#111827' }}>
        <Icon className="w-5 h-5" />
      </div>
      <span
        style={
          isActive
            ? { color: '#004a77', fontWeight: 500 }
            : { color: '#111827', fontWeight: 400 }
        }
      >
        {label}
      </span>
    </>
  )

  return (
    <Link
      href={path}
      onClick={handleClick}
      className={`flex items-center gap-3 px-3 py-2 rounded-full cursor-pointer transition-colors w-full text-left ${
        isActive ? '' : 'hover:bg-gray-200'
      }`}
      style={
        isActive
          ? {
              backgroundColor: '#c2e7ff',
              color: '#004a77',
            }
          : {}
      }
    >
      {content}
    </Link>
  )
}
