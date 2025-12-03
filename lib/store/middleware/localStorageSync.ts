import { Middleware } from "@reduxjs/toolkit";
import type { RootState } from "../index";
import type { FileItem } from "../slices/driveSlice";
import type { UploadItem } from "../slices/uploadSlice";
import { formatDateForStorage, isValidDate } from "../../utils/dateUtils";

let isClientSide = false;
let isHydrated = false;

if (typeof window !== "undefined") {
  isClientSide = true;
  const checkHydration = () => {
    if (document.readyState === "complete") {
      isHydrated = true;
    }
  };

  if (document.readyState === "complete") {
    isHydrated = true;
  } else {
    window.addEventListener("load", checkHydration);
  }
}

export const localStorageSync: Middleware<{}, RootState> =
  (store) => (next) => (action: any) => {
    const result = next(action);

    // Only run on client side and after hydration
    if (isClientSide && isHydrated) {
      try {
        const state = store.getState() as RootState;

        const drivegData = {
          drive: {
            // @ts-expect-error - RootState type inference issue
            files: state.drive.files.map((file: FileItem) => ({
              ...file,
              // Format dates properly to avoid timezone issues
              createdAt: file.createdAt
                ? (() => {
                    try {
                      const date = new Date(file.createdAt);
                      return isValidDate(date)
                        ? formatDateForStorage(date)
                        : file.createdAt;
                    } catch {
                      return file.createdAt;
                    }
                  })()
                : file.createdAt,
              modifiedAt: file.modifiedAt
                ? (() => {
                    try {
                      const date = new Date(file.modifiedAt);
                      return isValidDate(date)
                        ? formatDateForStorage(date)
                        : file.modifiedAt;
                    } catch {
                      return file.modifiedAt;
                    }
                  })()
                : file.modifiedAt,
            })),
            // @ts-expect-error - RootState type inference issue
            currentFolderId: state.drive.currentFolderId,
            // @ts-expect-error - RootState type inference issue
            selectedItems: state.drive.selectedItems,
            // @ts-expect-error - RootState type inference issue
            viewMode: state.drive.viewMode,
            // @ts-expect-error - RootState type inference issue
            sortBy: state.drive.sortBy,
            // @ts-expect-error - RootState type inference issue
            sortOrder: state.drive.sortOrder,
            // @ts-expect-error - RootState type inference issue
            searchQuery: state.drive.searchQuery,
            // @ts-expect-error - RootState type inference issue
            breadcrumbs: state.drive.breadcrumbs,
          },
          user: {
            // @ts-expect-error - RootState type inference issue
            currentUser: state.user.currentUser
              ? {
                  // @ts-expect-error - RootState type inference issue
                  ...state.user.currentUser,
                  // Format dates if they exist
                  // @ts-expect-error - RootState type inference issue
                  createdAt: (state.user.currentUser as any).createdAt
                    ? (() => {
                        try {
                          const date = new Date(
                            // @ts-expect-error - RootState type inference issue
                            (state.user.currentUser as any).createdAt
                          );
                          return isValidDate(date)
                            ? formatDateForStorage(date)
                            : // @ts-expect-error - RootState type inference issue
                              (state.user.currentUser as any).createdAt;
                        } catch {
                          // @ts-expect-error - RootState type inference issue
                          return (state.user.currentUser as any).createdAt;
                        }
                      })()
                    : undefined,
                }
              : null,
            // @ts-expect-error - RootState type inference issue
            isAuthenticated: state.user.isAuthenticated,
          },
          navigation: {
            // @ts-expect-error - RootState type inference issue
            activeItem: state.navigation.activeItem,
            // @ts-expect-error - RootState type inference issue
            expandedItems: state.navigation.expandedItems,
            // @ts-expect-error - RootState type inference issue
            sidebarCollapsed: state.navigation.sidebarCollapsed,
            // @ts-expect-error - RootState type inference issue
            currentWorkspaceId: state.navigation.currentWorkspaceId,
            // @ts-expect-error - RootState type inference issue
            currentSharedDriveId: state.navigation.currentSharedDriveId,
          },
          search: {
            // @ts-expect-error - RootState type inference issue
            query: state.search.query,
            // @ts-expect-error - RootState type inference issue
            filters: state.search.filters,
            // @ts-expect-error - RootState type inference issue
            recentSearches: state.search.recentSearches,
            // @ts-expect-error - RootState type inference issue
            showFilters: state.search.showFilters,
          },
          upload: {
            // Only sync upload metadata, not File objects
            // @ts-expect-error - RootState type inference issue
            uploads: state.upload.uploads.map((upload: UploadItem) => ({
              id: upload.id,
              name: upload.name,
              size: upload.size,
              progress: upload.progress,
              status: upload.status,
              error: upload.error,
              parentId: upload.parentId,
              uploadedFileId: upload.uploadedFileId,
              mimeType: upload.mimeType,
              // Exclude file object
            })),
            // @ts-expect-error - RootState type inference issue
            isUploading: state.upload.isUploading,
          },
        };

        localStorage.setItem("drivegData", JSON.stringify(drivegData));
      } catch (error) {
        console.warn(
          "[LocalStorageSync] Failed to save to localStorage:",
          error
        );
      }
    }

    return result;
  };
