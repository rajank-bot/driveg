'use client'

import React, { useEffect, useMemo, useRef, useState } from 'react'
import { CheckCircle2, ChevronDown, CircleX, FileText, Folder, Loader2, X } from 'lucide-react'
import { cn } from '@/lib/utils'
import { useAppDispatch, useAppSelector } from '@/lib'
import type { UploadItem as UploadItemType } from '@/lib/store/slices/uploadSlice'
import { clearAllUploads, clearCompletedUploads } from '@/lib/store/slices/uploadSlice'
import { cancelUpload, uploadFiles } from '@/lib/store/thunks/uploadThunks'

interface UploadFileModalProps {
  isOpen: boolean
  files?: File[]
  onClose: () => void
}

type UploadStatus = UploadItemType['status']

const formatFileSize = (size: number) => {
  if (!size) return '0 B'
  const units = ['B', 'KB', 'MB', 'GB', 'TB']
  const exponent = Math.min(Math.floor(Math.log(size) / Math.log(1024)), units.length - 1)
  const value = size / Math.pow(1024, exponent)
  return `${value >= 10 ? value.toFixed(0) : value.toFixed(1)} ${units[exponent]}`
}

const UploadFileModal = ({ isOpen, files = [], onClose }: UploadFileModalProps) => {
  const [collapsed, setCollapsed] = useState(false)
  const dispatch = useAppDispatch()
  const uploadItems: UploadItemType[] = useAppSelector(
    (state: any) => (state as any).upload.uploads,
  )
  const processedBatchRef = useRef<string | null>(null)

  useEffect(() => {
    if (!isOpen) {
      setCollapsed(false)
      processedBatchRef.current = null
      return
    }

    if (!files.length) return

    const batchKey = files
      .map((file) => `${file.name}-${file.size}-${file.lastModified ?? ''}`)
      .join('|')

    if (processedBatchRef.current === batchKey) return

    processedBatchRef.current = batchKey
    void dispatch(uploadFiles({ files, parentId: null }) as any)
  }, [dispatch, files, isOpen])

  const stats = useMemo(() => {
    const initial: Record<UploadStatus, number> = {
      pending: 0,
      uploading: 0,
      completed: 0,
      error: 0,
    }

    return uploadItems.reduce((acc, item) => {
      acc[item.status] += 1
      return acc
    }, initial)
  }, [uploadItems])

  const activeUploads = stats.pending + stats.uploading

  const summary = useMemo(() => {
    if (activeUploads > 0) {
      return {
        title: `Uploading ${activeUploads} item${activeUploads > 1 ? 's' : ''}`,
        caption: stats.pending > 0 ? 'Preparing files…' : 'Transferring files…',
      }
    }

    if (stats.completed > 0 && stats.error === 0) {
      return {
        title: `${stats.completed} upload${stats.completed > 1 ? 's' : ''} complete`,
        caption: 'Files added to My Drive',
      }
    }

    if (stats.error > 0) {
      return {
        title: `${stats.error} upload${stats.error > 1 ? 's' : ''} failed`,
        caption: 'Some files could not be uploaded',
      }
    }

    return {
      title: 'Ready to upload',
      caption: 'Select files to start uploading',
    }
  }, [activeUploads, stats.completed, stats.error, stats.pending])

  const handleCancelUpload = (uploadId: string) => {
    void dispatch(cancelUpload(uploadId) as any)
  }

  const handleClose = () => {
    dispatch(clearAllUploads() as any)
    dispatch(clearCompletedUploads() as any)
    onClose()
  }

  if (!isOpen) return null

  return (
    <div className="fixed inset-0 z-50 flex items-end justify-end pointer-events-none">
      <div className="pointer-events-auto w-full max-w-sm px-4 pb-4 sm:px-8 sm:pb-6">
        <div
          className="rounded-2xl border border-gray-200 bg-white shadow-[0_2px_6px_rgba(60,64,67,0.15),0_8px_18px_rgba(60,64,67,0.2)] overflow-hidden"
          role="dialog"
          aria-live="polite"
          aria-label="File upload status"
        >
          <div className="flex items-start justify-between gap-3 border-b border-gray-100 px-4 py-3">
            <div>
              <p className="text-sm font-semibold text-gray-900">{summary.title}</p>
              <p className="text-xs text-gray-500">{summary.caption}</p>
            </div>
            <div className="flex items-center gap-1">
              <button
                type="button"
                aria-label={collapsed ? 'Expand upload list' : 'Collapse upload list'}
                onClick={() => setCollapsed((prev) => !prev)}
                className="rounded-full p-1 text-gray-500 hover:bg-gray-100 transition-colors"
              >
                <ChevronDown
                  className={cn(
                    'h-4 w-4 transition-transform duration-200',
                    !collapsed && 'rotate-180',
                  )}
                />
              </button>
              <button
                type="button"
                aria-label="Close upload status"
                onClick={handleClose}
                className="rounded-full p-1 text-gray-500 hover:bg-gray-100 transition-colors"
              >
                <X className="h-4 w-4" />
              </button>
            </div>
          </div>

          {!collapsed && (
            <div className="max-h-80 overflow-y-auto divide-y divide-gray-100">
              {uploadItems.length === 0 ? (
                <div className="px-4 py-6 text-center text-sm text-gray-500">
                  No uploads in progress
                </div>
              ) : (
                uploadItems.map((item) => {
                  const isActive = item.status === 'pending' || item.status === 'uploading'
                  const isCompleted = item.status === 'completed'
                  const isError = item.status === 'error'

                  return (
                    <div
                      key={item.id}
                      className="group flex items-start gap-3 px-4 py-3 cursor-pointer hover:bg-[#f2f2f2]"
                    >
                      <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-[#e8f0fe] text-[#1a73e8]">
                        <FileText className="h-5 w-5" />
                      </div>
                      <div className="min-w-0 flex-1">
                        <p className="truncate text-sm font-medium text-gray-900">{item.name}</p>
                        <p className="text-xs text-gray-500">{formatFileSize(item.size)}</p>

                        {isActive && (
                          <>
                            <div className="mt-2 h-1.5 rounded-full bg-gray-200">
                              <div
                                className="h-full rounded-full bg-[#1a73e8] transition-all duration-300"
                                style={{ width: `${item.progress}%` }}
                              />
                            </div>
                            <p className="mt-1 text-xs text-gray-500">
                              {item.status === 'pending' ? 'Waiting to start…' : 'Uploading…'}
                            </p>
                          </>
                        )}

                        {isCompleted && (
                          <p className="mt-1 text-xs text-gray-500">Uploaded to My Drive</p>
                        )}

                        {isError && (
                          <p className="mt-1 text-xs text-red-500">
                            {item.error ?? 'Upload failed'}
                          </p>
                        )}
                      </div>

                      <div className="flex flex-col items-end gap-2">
                        {isActive && (
                          <>
                            <Loader2 className="h-5 w-5 animate-spin text-[#1a73e8]" />
                            <button
                              type="button"
                              className="text-xs font-medium text-[#1a73e8] hover:underline"
                              onClick={() => handleCancelUpload(item.id)}
                            >
                              Cancel
                            </button>
                          </>
                        )}
                        {isCompleted && (
                          <div className="h-5 w-5">
                            <CheckCircle2 className="h-5 w-5 text-green-500 group-hover:hidden" />
                            <Folder className="hidden h-5 w-5 text-[#1a73e8] group-hover:block" />
                          </div>
                        )}
                        {isError && <CircleX className="h-5 w-5 text-red-500" />}
                      </div>
                    </div>
                  )
                })
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

export default UploadFileModal