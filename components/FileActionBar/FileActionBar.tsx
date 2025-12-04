"use client";

import {
  XMarkIcon,
  UserPlusIcon,
  ArrowDownTrayIcon,
  FolderArrowDownIcon,
  TrashIcon,
  LinkIcon,
  EllipsisVerticalIcon,
  PencilIcon,
} from "@heroicons/react/24/outline";
import * as DropdownMenu from "@radix-ui/react-dropdown-menu";

interface FileActionBarProps {
  selectedCount: number;
  onClearSelection: () => void;
  onAction: (action: string) => void;
}

export default function FileActionBar({
  selectedCount,
  onClearSelection,
  onAction,
}: FileActionBarProps) {
  if (selectedCount === 0) {
    return null;
  }

  return (
    <div className="flex items-center justify-between bg-gray-50 border-b border-gray-300 px-4 py-2 mb-4">
      <div className="flex items-center gap-4">
        <button
          onClick={onClearSelection}
          className="flex items-center gap-2 text-gray-700 hover:text-gray-900 transition-colors"
          aria-label="Clear selection"
        >
          <XMarkIcon className="h-5 w-5" />
          <span className="text-sm font-medium">{selectedCount} selected</span>
        </button>
      </div>

      <div className="flex items-center gap-1">
        {/* Add person (Share) */}
        <button
          onClick={() => onAction("share")}
          className="rounded-full p-2 transition-colors hover:bg-gray-200"
          aria-label="Share"
        >
          <UserPlusIcon className="h-5 w-5 text-gray-700" />
        </button>

        {/* Download */}
        <button
          onClick={() => onAction("download")}
          className="rounded-full p-2 transition-colors hover:bg-gray-200"
          aria-label="Download"
        >
          <ArrowDownTrayIcon className="h-5 w-5 text-gray-700" />
        </button>

        {/* Move to */}
        <button
          onClick={() => onAction("move")}
          className="rounded-full p-2 transition-colors hover:bg-gray-200"
          aria-label="Move to"
        >
          <FolderArrowDownIcon className="h-5 w-5 text-gray-700" />
        </button>

        {/* Delete */}
        <button
          onClick={() => onAction("delete")}
          className="rounded-full p-2 transition-colors hover:bg-gray-200"
          aria-label="Delete"
        >
          <TrashIcon className="h-5 w-5 text-gray-700" />
        </button>

        {/* Get link */}
        <button
          onClick={() => onAction("getLink")}
          className="rounded-full p-2 transition-colors hover:bg-gray-200"
          aria-label="Get link"
        >
          <LinkIcon className="h-5 w-5 text-gray-700" />
        </button>

        {/* More options */}
        <DropdownMenu.Root>
          <DropdownMenu.Trigger asChild>
            <button
              className="rounded-full p-2 transition-colors hover:bg-gray-200"
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
            >
              <DropdownMenu.Item
                className="flex items-center gap-3 px-3 py-2 text-sm text-gray-700 rounded-md cursor-pointer hover:bg-gray-100 focus:outline-none focus:bg-gray-100"
                onSelect={(e) => {
                  e.preventDefault();
                  onAction("download");
                }}
              >
                <ArrowDownTrayIcon className="h-4 w-4" />
                <span>Download</span>
              </DropdownMenu.Item>
              <DropdownMenu.Item
                className="flex items-center justify-between gap-3 px-3 py-2 text-sm text-gray-700 rounded-md cursor-pointer hover:bg-gray-100 focus:outline-none focus:bg-gray-100"
                onSelect={() => {
                  setTimeout(() => {
                    onAction("rename");
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
                  onAction("share");
                }}
              >
                <div className="flex items-center gap-3">
                  <UserPlusIcon className="h-4 w-4" />
                  <span>Share</span>
                </div>
                <span className="text-gray-400">›</span>
              </DropdownMenu.Item>
              <DropdownMenu.Item
                className="flex items-center justify-between gap-3 px-3 py-2 text-sm text-gray-700 rounded-md cursor-pointer hover:bg-gray-100 focus:outline-none focus:bg-gray-100"
                onSelect={(e) => {
                  e.preventDefault();
                  onAction("organize");
                }}
              >
                <div className="flex items-center gap-3">
                  <FolderArrowDownIcon className="h-4 w-4" />
                  <span>Organize</span>
                </div>
                <span className="text-gray-400">›</span>
              </DropdownMenu.Item>
              <DropdownMenu.Item
                className="flex items-center justify-between gap-3 px-3 py-2 text-sm text-gray-700 rounded-md cursor-pointer hover:bg-gray-100 focus:outline-none focus:bg-gray-100"
                onSelect={(e) => {
                  e.preventDefault();
                  onAction("folder-info");
                }}
              >
                <div className="flex items-center gap-3">
                  <span>Folder information</span>
                </div>
                <span className="text-gray-400">›</span>
              </DropdownMenu.Item>
              <DropdownMenu.Separator className="h-px bg-gray-200 my-1" />
              <DropdownMenu.Item
                className="flex items-center justify-between gap-3 px-3 py-2 text-sm text-gray-700 rounded-md cursor-pointer hover:bg-gray-100 focus:outline-none focus:bg-gray-100"
                onSelect={(e) => {
                  e.preventDefault();
                  onAction("delete");
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
      </div>
    </div>
  );
}
