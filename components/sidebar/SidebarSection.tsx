'use client'

import NewMenu from '@/components/NewMenu/NewMenu'

export default function SidebarSection() {
  return (
    <div
      className="px-4 py-4 relative"
      style={{ backgroundColor: '#f8fafd' }}
    >
      <NewMenu>
        <button
          type="button"
          className="select-none inline-flex items-center bg-white border-0 cursor-pointer transition-shadow duration-75 ease-linear focus:outline-none"
          style={{
            borderRadius: '0.8rem',
            boxShadow:
              '0 1px 2px 0 rgba(60,64,67,.3), 0 1px 3px 1px rgba(60,64,67,.15)',
            color: 'rgb(60,64,67)',
            gap: '0.75rem',
            height: '3.5rem',
            minWidth: '6.25rem',
            padding: '1.125rem 1.25rem 1.125rem 1rem',
            placeContent: 'center start',
            userSelect: 'none',
            outline: 'none',
          }}
          onMouseEnter={(e) => {
            e.currentTarget.style.boxShadow =
              '0 1px 3px 0 rgba(60,64,67,.3), 0 4px 8px 3px rgba(60,64,67,.15)'
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.boxShadow =
              '0 1px 2px 0 rgba(60,64,67,.3), 0 1px 3px 1px rgba(60,64,67,.15)'
          }}
          onMouseDown={(e) => {
            e.currentTarget.style.boxShadow =
              '0 1px 2px 0 rgba(60,64,67,.4), 0 2px 6px 2px rgba(60,64,67,.15)'
          }}
          onMouseUp={(e) => {
            e.currentTarget.style.boxShadow =
              '0 1px 3px 0 rgba(60,64,67,.3), 0 4px 8px 3px rgba(60,64,67,.15)'
          }}
        >
          <span className="flex items-center">
            <svg
              className="w-6 h-6"
              width="24"
              height="24"
              viewBox="0 0 24 24"
              focusable="false"
            >
              <path d="M20 13h-7v7h-2v-7H4v-2h7V4h2v7h7v2z" fill="currentColor" />
            </svg>
          </span>
          <span className="text-sm font-normal">New</span>
        </button>
      </NewMenu>
    </div>
  )
}

