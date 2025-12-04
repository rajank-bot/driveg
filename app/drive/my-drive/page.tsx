"use client";

import {
  FileViewToggle,
  FileGrid,
  FileList,
  useViewMode,
} from "@/components/FileViewToggle";
import type { FileItem as UIFileItem } from "@/components/FileViewToggle";
import { useEffect, useState, useMemo } from "react";
import { useAppSelector, useAppDispatch } from "@/lib/hooks";
import {
  selectFilesInCurrentFolder,
  selectCurrentUser,
  selectSelectedItems,
} from "@/lib/selectors";
import type { FileItem as ReduxFileItem } from "@/lib/store/slices/driveSlice";
import { updateFileThunk } from "@/lib/store/thunks/driveThunks";
import {
  toggleItemSelection,
  clearSelection,
} from "@/lib/store/slices/driveSlice";
import { FolderIcon } from "@heroicons/react/24/outline";
import { RenameDialog } from "@/components/RenameDialog";
import { FileActionBar } from "@/components/FileActionBar";

export default function MyDrivePage() {
  const [viewMode, setViewMode] = useViewMode("list");
  const [isHydrated, setIsHydrated] = useState(false);
  const reduxFiles = useAppSelector(selectFilesInCurrentFolder);
  const currentUser = useAppSelector(selectCurrentUser);
  const selectedItems = useAppSelector(selectSelectedItems);
  const dispatch = useAppDispatch();
  const [renameDialogOpen, setRenameDialogOpen] = useState(false);
  const [fileToRename, setFileToRename] = useState<UIFileItem | null>(null);

  useEffect(() => {
    setIsHydrated(true);
  }, []);

  // Transform Redux FileItem to UI FileItem format
  const files: UIFileItem[] = useMemo(() => {
    return reduxFiles.map((file: ReduxFileItem): UIFileItem => {
      return {
        id: file.id,
        name: file.name,
        type: file.type === "folder" ? "folder" : "file",
        mimeType: file.mimeType,
        icon: file.type === "folder" ? FolderIcon : undefined,
        owner: {
          name: "me", // Display name is always "me" for own files
          avatar: currentUser?.avatar,
          initial: currentUser?.name?.charAt(0).toUpperCase() || "M", // Use logged-in user's initial
        },
        modifiedTime: file.modifiedAt,
        createdTime: file.createdAt,
        size: file.size
          ? `${(file.size / 1024).toFixed(1)} KB`
          : file.type === "folder"
          ? "-"
          : undefined,
        location: "My Drive",
        starred: file.starred,
        shared: file.shared,
      };
    });
  }, [reduxFiles, currentUser]);

  // Show nothing during hydration to prevent mismatch
  if (!isHydrated) {
    return null;
  }

  const handleFileClick = (file: UIFileItem) => {
    // Toggle selection when clicking on a file/folder
    dispatch(toggleItemSelection(file.id));
  };

  const handleSelectionChange = (fileId: string, isSelected: boolean) => {
    dispatch(toggleItemSelection(fileId));
  };

  const handleClearSelection = () => {
    dispatch(clearSelection());
  };

  const handleBulkAction = (action: string) => {
    console.log("Bulk action:", action, "on", selectedItems.length, "items");

    if (action === "rename") {
      // For rename, we only work with the first selected item
      if (selectedItems.length > 0) {
        const selectedFileId = selectedItems[0];
        const selectedFile = files.find((f) => f.id === selectedFileId);
        if (selectedFile) {
          setFileToRename(selectedFile);
          setRenameDialogOpen(true);
        }
      }
    }
    // Handle other bulk actions here (share, download, delete, etc.)
  };

  const handleFileAction = async (file: UIFileItem, action: string) => {
    console.log("File action:", action, file.name);

    if (action === "rename") {
      setFileToRename(file);
      setRenameDialogOpen(true);
    }
  };

  const handleRename = async (newName: string) => {
    if (!fileToRename) return;

    try {
      const result = await dispatch(
        updateFileThunk({
          id: fileToRename.id,
          updates: { name: newName },
        }) as any
      );

      if (updateFileThunk.fulfilled.match(result)) {
        console.log("File renamed successfully:", newName);
      } else {
        console.error("Failed to rename file:", result.error);
        throw new Error("Failed to rename file");
      }
    } catch (error) {
      console.error("Error renaming file:", error);
      throw error;
    }
  };

  return (
    <div className="p-8">
      <div className="mb-6 flex items-center justify-between">
        <h1 className="text-2xl font-semibold text-gray-900">My Drive</h1>
        <FileViewToggle viewMode={viewMode} onViewModeChange={setViewMode} />
      </div>

      <FileActionBar
        selectedCount={selectedItems.length}
        onClearSelection={handleClearSelection}
        onAction={handleBulkAction}
      />

      {files.length > 0 ? (
        viewMode === "grid" ? (
          <FileGrid
            files={files}
            onFileClick={handleFileClick}
            onFileAction={handleFileAction}
          />
        ) : (
          <FileList
            files={files}
            onFileClick={handleFileClick}
            onFileAction={handleFileAction}
            selectedItems={selectedItems}
            onSelectionChange={handleSelectionChange}
            showColumns={{
              name: true,
              owner: true,
              modified: true,
              size: true,
            }}
          />
        )
      ) : (
        <p className="text-gray-600">Your files and folders will appear here</p>
      )}

      {fileToRename && (
        <RenameDialog
          open={renameDialogOpen}
          onOpenChange={(open) => {
            setRenameDialogOpen(open);
            if (!open) {
              setFileToRename(null);
            }
          }}
          currentName={fileToRename.name}
          isFolder={fileToRename.type === "folder"}
          onRename={handleRename}
        />
      )}
    </div>
  );
}
