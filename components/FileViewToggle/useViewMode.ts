'use client'
import { useState, useEffect } from 'react'
import type { ViewMode } from '@/types/fileViewToggle'

export function useViewMode(defaultMode: ViewMode = 'list'): [ViewMode, (mode: ViewMode) => void] {
  const [viewMode, setViewMode] = useState<ViewMode>(defaultMode)
  const [isHydrated, setIsHydrated] = useState(false)

  // Load from localStorage ONLY after client hydration
  useEffect(() => {
    if (typeof window !== 'undefined') {
      try {
        const saved = localStorage.getItem('fileViewMode') as ViewMode
        if (saved) {
          setViewMode(saved)
        }
      } catch {
        // Ignore localStorage errors
      } finally {
        setIsHydrated(true)
      }
    }
  }, [])

  // Persist to localStorage when viewMode changes (client-only)
  useEffect(() => {
    if (typeof window !== 'undefined' && isHydrated) {
      try {
        localStorage.setItem('fileViewMode', viewMode)
      } catch {
        // Ignore errors
      }
    }
  }, [viewMode, isHydrated])

  return [viewMode, setViewMode]
}
