'use client'

import { useState, useEffect } from 'react'
import * as DropdownMenu from '@radix-ui/react-dropdown-menu'
import NewMenuGroup from './NewMenuGroup'
import { NEW_MENU_GROUPS } from '@/types/newMenuItems'

interface NewMenuProps {
  children: React.ReactNode
}

export default function NewMenu({ children }: NewMenuProps) {
  const [open, setOpen] = useState(false)

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
  }, [])

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
          sideOffset={-56}
          align="start"
          side="bottom"
        >
          {NEW_MENU_GROUPS.map((group) => (
            <NewMenuGroup key={group.id} group={group} />
          ))}
        </DropdownMenu.Content>
      </DropdownMenu.Portal>
    </DropdownMenu.Root>
  )
}
