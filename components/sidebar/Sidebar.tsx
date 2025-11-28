'use client'

import { useState } from 'react'
import SidebarSection from './SidebarSection'
import NavItem from './NavItem'
import StorageBar from './StorageBar'
import { SIDEBAR_ITEMS } from '@/types/sidebarItems'

export default function Sidebar() {
  const [expandedItems, setExpandedItems] = useState<Set<string>>(new Set())

  const toggleExpand = (label: string) => {
    setExpandedItems((prev) => {
      const newSet = new Set(prev)
      if (newSet.has(label)) {
        newSet.delete(label)
      } else {
        newSet.add(label)
      }
      return newSet
    })
  }

  return (
    <aside
      className="h-screen border-r flex flex-col"
      style={{ backgroundColor: '#f8fafd', width: '256px' }}
    >
      <SidebarSection />

      <nav className="flex-1 overflow-y-auto flex flex-col gap-1 px-3 py-2">
        {SIDEBAR_ITEMS.map((item, index) => (
          <div key={item.label}>
            <NavItem
              icon={item.icon}
              label={item.label}
              active={item.active}
              expandable={item.expandable}
              expanded={expandedItems.has(item.label)}
              onClick={() => item.expandable && toggleExpand(item.label)}
            />
            {item.label === 'Storage' && (
              <div className="mt-2">
                <StorageBar />
              </div>
            )}
          </div>
        ))}
      </nav>
    </aside>
  )
}
