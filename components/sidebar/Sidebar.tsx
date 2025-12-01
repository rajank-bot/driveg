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
        {SIDEBAR_ITEMS.map((item) => (
          <div key={item.path}>
            <NavItem
              icon={item.icon}
              label={item.label}
              path={item.path}
              expandable={item.expandable}
              expanded={expandedItems.has(item.label)}
              onToggleExpand={() => toggleExpand(item.label)}
            />
            {/* Render sub-items when expanded */}
            {item.expandable &&
              expandedItems.has(item.label) &&
              item.children &&
              item.children.length > 0 && (
                <div className="ml-4 mt-1 flex flex-col gap-1">
                  {item.children.map((child) => (
                    <NavItem
                      key={child.path}
                      icon={child.icon}
                      label={child.label}
                      path={child.path}
                    />
                  ))}
                </div>
              )}
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
