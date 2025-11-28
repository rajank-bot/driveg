'use client'

import { useEffect, useRef } from 'react'
import NewMenuGroup from './NewMenuGroup'
import { NEW_MENU_GROUPS } from '@/types/newMenuItems'

interface NewMenuProps {
  isOpen: boolean
  onClose: () => void
  buttonRef: React.RefObject<HTMLButtonElement>
}

export default function NewMenu({ isOpen, onClose, buttonRef }: NewMenuProps) {
  const menuRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        menuRef.current &&
        !menuRef.current.contains(event.target as Node) &&
        buttonRef.current &&
        !buttonRef.current.contains(event.target as Node)
      ) {
        onClose()
      }
    }

    const handleEscape = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        onClose()
      }
    }

    const handleVisibilityChange = () => {
      if (document.hidden) {
        onClose()
      }
    }

    if (isOpen) {
      document.addEventListener('mousedown', handleClickOutside)
      document.addEventListener('keydown', handleEscape)
      document.addEventListener('visibilitychange', handleVisibilityChange)
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside)
      document.removeEventListener('keydown', handleEscape)
      document.removeEventListener('visibilitychange', handleVisibilityChange)
    }
  }, [isOpen, onClose, buttonRef])

  if (!isOpen) return null

  // Calculate position relative to button - cover the button
  const getMenuPosition = () => {
    if (!buttonRef.current) return {}
    const rect = buttonRef.current.getBoundingClientRect()
    return {
      top: `${rect.top}px`,
      left: `${rect.left}px`,
    }
  }

  return (
    <>
      {/* Backdrop */}
      <div
        className="fixed inset-0 z-40"
        onClick={onClose}
        aria-hidden="true"
      />
      
      {/* Menu */}
      <div
        ref={menuRef}
        className="fixed z-50 bg-white rounded-lg shadow-lg border border-gray-200 min-w-[280px] py-1"
        style={{
          ...getMenuPosition(),
          boxShadow: '0 2px 6px 2px rgba(60,64,67,.15), 0 0 1px rgba(60,64,67,.3)',
          zIndex: 1000,
        }}
        role="menu"
        aria-orientation="vertical"
      >
        {NEW_MENU_GROUPS.map((group) => (
          <NewMenuGroup key={group.id} group={group} />
        ))}
      </div>
    </>
  )
}

