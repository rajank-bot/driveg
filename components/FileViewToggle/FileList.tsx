"use client";

import React, { useMemo } from "react";
import {
  DocumentIcon,
  FolderIcon,
  EllipsisVerticalIcon,
  ShareIcon,
  ArrowDownTrayIcon,
  PencilIcon,
  StarIcon,
  ArrowRightIcon,
  InformationCircleIcon,
  TrashIcon,
} from "@heroicons/react/24/outline";
import { StarIcon as StarIconSolid } from "@heroicons/react/24/solid";
import * as DropdownMenu from "@radix-ui/react-dropdown-menu";
import type { FileListProps, FileItem } from "@/types/fileViewToggle";

export default function FileList({
  files,
  onFileClick,
  onFileAction,
  selectedItems = [],
  onSelectionChange,
  className = "",
  showColumns = {
    name: true,
    owner: true,
    modified: true,
    size: true,
    location: true,
    reason: true,
  },
  groupedFiles,
  customColumnHeaders,
}: FileListProps) {
  const [openMenuId, setOpenMenuId] = React.useState<string | null>(null);
  const hasSelection = (selectedItems || []).length > 0;
  const getFileIcon = (file: FileItem) => {
    if (file.icon) {
      const Icon = file.icon;
      // Determine color based on mimeType
      const iconColor = getIconColor(file.mimeType);
      return <Icon className={`h-5 w-5 ${iconColor}`} />;
    }
    return file.type === "folder" ? (
      <FolderIcon className="h-5 w-5 text-blue-500" />
    ) : (
      <DocumentIcon className="h-5 w-5 text-blue-500" />
    );
  };

  const getIconColor = (mimeType?: string) => {
    if (!mimeType) return "text-blue-500";

    if (mimeType.includes("spreadsheet") || mimeType.includes("excel")) {
      return "text-green-600";
    }
    if (mimeType.includes("document") || mimeType.includes("word")) {
      return "text-blue-600";
    }
    if (mimeType.includes("presentation") || mimeType.includes("powerpoint")) {
      return "text-orange-500";
    }
    if (mimeType.includes("video")) {
      return "text-purple-600";
    }
    if (mimeType.includes("image")) {
      return "text-pink-500";
    }
    if (mimeType.includes("pdf")) {
      return "text-red-600";
    }
    if (mimeType.includes("google-apps")) {
      if (mimeType.includes("spreadsheet")) return "text-green-600";
      if (mimeType.includes("document")) return "text-blue-600";
      if (mimeType.includes("presentation")) return "text-orange-500";
      return "text-blue-500";
    }

    return "text-blue-500";
  };

  const handleFileClick = (file: FileItem) => {
    onFileClick?.(file);
  };

  const formatDate = (dateString?: string) => {
    if (!dateString) return "";
    try {
      const date = new Date(dateString);
      const now = new Date();
      const isToday = date.toDateString() === now.toDateString();

      if (isToday) {
        // Show time for today's files (e.g., "6:59 PM")
        return date.toLocaleTimeString("en-US", {
          hour: "numeric",
          minute: "2-digit",
          hour12: true,
        });
      }

      // Show date for older files
      return date.toLocaleDateString("en-US", {
        month: "short",
        day: "numeric",
        year: date.getFullYear() !== now.getFullYear() ? "numeric" : undefined,
      });
    } catch {
      return dateString;
    }
  };

  const renderFileRow = (file: FileItem) => {
    const isSelected = (selectedItems || []).includes(file.id);
    const isMenuOpen = openMenuId === file.id;
    let rowClassName =
      "group border-b border-gray-300 transition-colors cursor-pointer";
    if (isSelected) {
      rowClassName += " bg-blue-100";
    } else {
      rowClassName += " hover:bg-gray-200";
    }
    return (
      <tr
        key={file.id}
        className={rowClassName}
        onClick={() => handleFileClick(file)}
      >
        {/* Checkbox column */}
        <td className="px-4 py-1 w-12">
          <input
            type="checkbox"
            checked={isSelected}
            onChange={(e) => {
              e.stopPropagation();
              onSelectionChange?.(file.id, e.target.checked);
            }}
            onClick={(e) => e.stopPropagation()}
            className="h-4 w-4 text-blue-600 rounded focus:ring-blue-500"
          />
        </td>

        {showColumns.name && (
          <td className="px-4 py-1 min-w-0">
            <div className="flex items-center gap-3 min-w-0">
              <div className="flex-shrink-0">{getFileIcon(file)}</div>
              <div className="flex flex-col min-w-0">
                <span
                  className={`text-sm font-medium truncate ${
                    isSelected ? "text-blue-600" : "text-gray-900"
                  }`}
                >
                  {file.name}
                </span>
                {file.fileSensitivity && (
                  <span className="mt-0 inline-flex items-center gap-1 text-xs text-gray-500">
                    File sensitivity
                  </span>
                )}
              </div>
            </div>
          </td>
        )}
        {showColumns.reason && (
          <td className="px-4 py-1 text-sm text-gray-600 min-w-0">
            <span className="truncate block">
              {file.reasonSuggested || "-"}
            </span>
          </td>
        )}
        {showColumns.activity && (
          <td className="px-4 py-1 text-sm text-gray-600 min-w-0">
            <span className="truncate block">{file.activity || "-"}</span>
          </td>
        )}
        {showColumns.owner && (
          <td className="px-4 py-1">
            {file.owner ? (
              <div className="flex items-center gap-2">
                {file.owner.avatar ? (
                  <img
                    src={file.owner.avatar}
                    alt={file.owner.name}
                    className="h-6 w-6 rounded-full"
                  />
                ) : (
                  <div className="flex h-6 w-6 items-center justify-center rounded-full bg-gray-200 text-xs text-gray-600">
                    {file.owner.initial ||
                      file.owner.name.charAt(0).toUpperCase()}
                  </div>
                )}
                <span className="text-sm text-gray-600">{file.owner.name}</span>
              </div>
            ) : (
              <span className="text-sm text-gray-400">-</span>
            )}
          </td>
        )}
        {showColumns.sharedBy && (
          <td className="px-4 py-1">
            {file.sharedBy ? (
              <div className="flex items-center gap-2">
                {file.sharedBy.avatar ? (
                  <img
                    src={file.sharedBy.avatar}
                    alt={file.sharedBy.name}
                    className="h-6 w-6 rounded-full"
                  />
                ) : (
                  <div className="flex h-6 w-6 items-center justify-center rounded-full bg-gray-200 text-xs text-gray-600">
                    {file.sharedBy.name.charAt(0).toUpperCase()}
                  </div>
                )}
                <span className="text-sm text-gray-600">
                  {file.sharedBy.name}
                </span>
              </div>
            ) : (
              <span className="text-sm text-gray-400">-</span>
            )}
          </td>
        )}
        {showColumns.location && (
          <td className="px-4 py-1 text-sm text-gray-600 min-w-0">
            <span className="truncate block">{file.location || "-"}</span>
          </td>
        )}
        {showColumns.originalLocation && (
          <td className="px-4 py-1 text-sm text-gray-600 min-w-0">
            <span className="truncate block">
              {file.originalLocation || "-"}
            </span>
          </td>
        )}
        {showColumns.modified && (
          <td
            className={`px-4 py-1 text-sm ${
              isSelected ? "text-blue-600" : "text-gray-600"
            }`}
          >
            {formatDate(file.modifiedTime || file.createdTime)}
          </td>
        )}
        {showColumns.dateShared && (
          <td className="px-4 py-1 text-sm text-gray-600">
            {formatDate(file.dateShared)}
          </td>
        )}
        {showColumns.dateTrashed && (
          <td className="px-4 py-1 text-sm text-gray-600">
            {formatDate(file.dateTrashed)}
          </td>
        )}
        {showColumns.size && (
          <td className="px-4 py-1 text-sm text-gray-600">
            {file.size || "-"}
          </td>
        )}
        <td className="px-4 py-1">
          <div className="flex items-center gap-1 justify-end">
            {/* Three dots icon - always visible, but hidden when items are selected */}
            {!hasSelection && (
              <DropdownMenu.Root
                open={isMenuOpen}
                onOpenChange={(open) => {
                  setOpenMenuId(open ? file.id : null);
                }}
              >
                <DropdownMenu.Trigger asChild>
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                    }}
                    className="rounded-full p-1.5 transition-colors hover:bg-gray-200"
                    aria-label="More options"
                  >
                    <EllipsisVerticalIcon className="h-5 w-5 text-gray-700" />
                  </button>
                </DropdownMenu.Trigger>
                <DropdownMenu.Portal>
                  <DropdownMenu.Content
                    className="min-w-[220px] bg-white rounded-lg shadow-lg border border-gray-200 p-1 z-50"
                    sideOffset={5}
                    align="end"
                    onClick={(e) => {
                      e.stopPropagation();
                    }}
                  >
                    <DropdownMenu.Item
                      className="flex items-center gap-3 px-3 py-2 text-sm text-gray-700 rounded-md cursor-pointer hover:bg-gray-100 focus:outline-none focus:bg-gray-100"
                      onSelect={(e) => {
                        e.preventDefault();
                        onFileAction?.(file, "download");
                      }}
                    >
                      <ArrowDownTrayIcon className="h-4 w-4" />
                      <span>Download</span>
                    </DropdownMenu.Item>
                    <DropdownMenu.Item
                      className="flex items-center justify-between gap-3 px-3 py-2 text-sm text-gray-700 rounded-md cursor-pointer hover:bg-gray-100 focus:outline-none focus:bg-gray-100"
                      onSelect={() => {
                        // Let menu close naturally (don't prevent default)
                        // Trigger rename action after a brief delay to ensure menu closes first
                        setTimeout(() => {
                          onFileAction?.(file, "rename");
                        }, 100);
                      }}
                    >
                      <div className="flex items-center gap-3">
                        <PencilIcon className="h-4 w-4" />
                        <span>Rename</span>
                      </div>
                      <span className="text-xs text-gray-500">Ctrl+Alt+E</span>
                    </DropdownMenu.Item>
                    <DropdownMenu.Separator className="h-px bg-gray-200 my-1" />
                    <DropdownMenu.Item
                      className="flex items-center justify-between gap-3 px-3 py-2 text-sm text-gray-700 rounded-md cursor-pointer hover:bg-gray-100 focus:outline-none focus:bg-gray-100"
                      onSelect={(e) => {
                        e.preventDefault();
                        onFileAction?.(file, "share");
                      }}
                    >
                      <div className="flex items-center gap-3">
                        <ShareIcon className="h-4 w-4" />
                        <span>Share</span>
                      </div>
                      <span className="text-gray-400">›</span>
                    </DropdownMenu.Item>
                    <DropdownMenu.Item
                      className="flex items-center justify-between gap-3 px-3 py-2 text-sm text-gray-700 rounded-md cursor-pointer hover:bg-gray-100 focus:outline-none focus:bg-gray-100"
                      onSelect={(e) => {
                        e.preventDefault();
                        onFileAction?.(file, "organize");
                      }}
                    >
                      <div className="flex items-center gap-3">
                        <FolderIcon className="h-4 w-4" />
                        <span>Organize</span>
                      </div>
                      <span className="text-gray-400">›</span>
                    </DropdownMenu.Item>
                    <DropdownMenu.Item
                      className="flex items-center justify-between gap-3 px-3 py-2 text-sm text-gray-700 rounded-md cursor-pointer hover:bg-gray-100 focus:outline-none focus:bg-gray-100"
                      onSelect={(e) => {
                        e.preventDefault();
                        onFileAction?.(file, "folder-info");
                      }}
                    >
                      <div className="flex items-center gap-3">
                        <InformationCircleIcon className="h-4 w-4" />
                        <span>Folder information</span>
                      </div>
                      <span className="text-gray-400">›</span>
                    </DropdownMenu.Item>
                    <DropdownMenu.Separator className="h-px bg-gray-200 my-1" />
                    <DropdownMenu.Item
                      className="flex items-center justify-between gap-3 px-3 py-2 text-sm text-gray-700 rounded-md cursor-pointer hover:bg-gray-100 focus:outline-none focus:bg-gray-100"
                      onSelect={(e) => {
                        e.preventDefault();
                        onFileAction?.(file, "delete");
                      }}
                    >
                      <div className="flex items-center gap-3">
                        <TrashIcon className="h-4 w-4" />
                        <span>Move to trash</span>
                      </div>
                      <span className="text-xs text-gray-500">Delete</span>
                    </DropdownMenu.Item>
                  </DropdownMenu.Content>
                </DropdownMenu.Portal>
              </DropdownMenu.Root>
            )}
          </div>
        </td>
      </tr>
    );
  };

  return (
    <div className={className}>
      <table className="w-full border-collapse">
        <thead>
          <tr className="border-b border-gray-300">
            {showColumns.name && (
              <th className="px-4 py-1.5 text-left text-sm font-medium text-gray-700">
                Name
              </th>
            )}
            {showColumns.reason && (
              <th className="px-4 py-1.5 text-left text-sm font-medium text-gray-700">
                {customColumnHeaders?.reason !== ""
                  ? customColumnHeaders?.reason || "Reason suggested"
                  : ""}
              </th>
            )}
            {showColumns.activity && (
              <th className="px-4 py-1.5 text-left text-sm font-medium text-gray-700">
                Activity
              </th>
            )}
            {showColumns.owner && (
              <th className="px-4 py-1.5 text-left text-sm font-medium text-gray-700">
                Owner
              </th>
            )}
            {showColumns.sharedBy && (
              <th className="px-4 py-1.5 text-left text-sm font-medium text-gray-700">
                Shared by
              </th>
            )}
            {showColumns.location && (
              <th className="px-4 py-1.5 text-left text-sm font-medium text-gray-700">
                Location
              </th>
            )}
            {showColumns.originalLocation && (
              <th className="px-4 py-1.5 text-left text-sm font-medium text-gray-700">
                Original location
              </th>
            )}
            {showColumns.modified && (
              <th className="px-4 py-1.5 text-left text-sm font-medium text-gray-700">
                Date modified
              </th>
            )}
            {showColumns.dateShared && (
              <th className="px-4 py-1.5 text-left text-sm font-medium text-gray-700">
                Date shared
              </th>
            )}
            {showColumns.dateTrashed && (
              <th className="px-4 py-1.5 text-left text-sm font-medium text-gray-700">
                Date trashed
              </th>
            )}
            {showColumns.size && (
              <th className="px-4 py-1.5 text-left text-sm font-medium text-gray-700">
                File size
              </th>
            )}
            <th className="px-4 py-1.5 w-20"></th>
          </tr>
        </thead>
        <tbody>
          {groupedFiles
            ? Object.entries(groupedFiles).map(([groupName, groupFiles]) => (
                <React.Fragment key={groupName}>
                  {groupFiles.map((file, index) => (
                    <React.Fragment key={file.id}>
                      {index === 0 && (
                        <tr>
                          <td
                            colSpan={
                              (showColumns.name ? 1 : 0) +
                              (showColumns.reason ? 1 : 0) +
                              (showColumns.activity ? 1 : 0) +
                              (showColumns.owner ? 1 : 0) +
                              (showColumns.sharedBy ? 1 : 0) +
                              (showColumns.location ? 1 : 0) +
                              (showColumns.originalLocation ? 1 : 0) +
                              (showColumns.modified ? 1 : 0) +
                              (showColumns.dateShared ? 1 : 0) +
                              (showColumns.dateTrashed ? 1 : 0) +
                              (showColumns.size ? 1 : 0) +
                              1 // Actions column
                            }
                            className="px-4 py-2 bg-gray-50"
                          >
                            <span className="text-sm font-semibold text-gray-700">
                              {groupName}
                            </span>
                          </td>
                        </tr>
                      )}
                      {renderFileRow(file)}
                    </React.Fragment>
                  ))}
                </React.Fragment>
              ))
            : files.map((file) => renderFileRow(file))}
        </tbody>
      </table>
    </div>
  );
}
