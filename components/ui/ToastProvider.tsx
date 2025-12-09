'use client'

import { createContext, useCallback, useContext, useMemo, useRef, useState } from 'react'

type ToastVariant = 'success' | 'error' | 'info'

export interface ToastPayload {
  title: string
  description?: string
  variant?: ToastVariant
  duration?: number
}

interface Toast extends ToastPayload {
  id: string
  createdAt: number
  variant: ToastVariant
  duration: number
}

interface ToastContextValue {
  showToast: (toast: ToastPayload) => void
  dismissToast: (id: string) => void
}

const ToastContext = createContext<ToastContextValue | undefined>(undefined)

const generateId = () => `${Date.now()}-${Math.random().toString(36).slice(2, 7)}`

export function ToastProvider({ children }: { children: React.ReactNode }) {
  const [toasts, setToasts] = useState<Toast[]>([])
  const timersRef = useRef<Record<string, ReturnType<typeof setTimeout>>>({})

  const dismissToast = useCallback((id: string) => {
    setToasts((prev) => prev.filter((toast) => toast.id !== id))
    if (timersRef.current[id]) {
      clearTimeout(timersRef.current[id])
      delete timersRef.current[id]
    }
  }, [])

  const showToast = useCallback(
    (toast: ToastPayload) => {
      const id = generateId()
      const duration = toast.duration ?? 4000
      const toastEntry: Toast = {
        id,
        createdAt: Date.now(),
        title: toast.title,
        description: toast.description,
        variant: toast.variant ?? 'info',
        duration,
      }
      setToasts((prev) => [...prev, toastEntry])

      if (duration !== Infinity) {
        timersRef.current[id] = setTimeout(() => {
          dismissToast(id)
        }, duration)
      }
    },
    [dismissToast],
  )

  const value = useMemo(
    () => ({
      showToast,
      dismissToast,
    }),
    [showToast, dismissToast],
  )

  return (
    <ToastContext.Provider value={value}>
      {children}
      <div className="fixed bottom-4 right-4 z-50 flex w-full max-w-sm flex-col gap-3">
        {toasts.map((toast) => (
          <div
            key={toast.id}
            className={`rounded-lg border px-4 py-3 shadow-lg backdrop-blur-sm transition-all ${
              toast.variant === 'success'
                ? 'border-green-200 bg-white/95 text-green-900'
                : toast.variant === 'error'
                  ? 'border-red-200 bg-white/95 text-red-900'
                  : 'border-gray-200 bg-white/95 text-gray-900'
            }`}
          >
            <div className="flex items-start justify-between gap-3">
              <div>
                <p className="text-sm font-semibold">{toast.title}</p>
                {toast.description && (
                  <p className="mt-1 text-sm text-gray-600">{toast.description}</p>
                )}
              </div>
              <button
                className="text-xs text-gray-500 transition-colors hover:text-gray-800"
                onClick={() => dismissToast(toast.id)}
                aria-label="Close notification"
              >
                ×
              </button>
            </div>
          </div>
        ))}
      </div>
    </ToastContext.Provider>
  )
}

export function useToastContext() {
  const ctx = useContext(ToastContext)
  if (!ctx) {
    throw new Error('useToastContext must be used within ToastProvider')
  }
  return ctx
}
