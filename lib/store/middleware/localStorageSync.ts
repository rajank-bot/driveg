import { Middleware } from "@reduxjs/toolkit";
import type { RootState } from "../index";
import type { FileItem } from "../slices/driveSlice";
import type { UploadItem } from "../slices/uploadSlice";
import { formatDateForStorage, isValidDate } from "../../utils/dateUtils";

const STORAGE_KEY = "drivegData";

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

/**
 * localStorage sync middleware that saves entire relevant state after every action
 * Only runs on client side and after page hydration
 */
export const localStorageSync: Middleware<{}, RootState> =
  (store) => (next) => (action: any) => {
    const result = next(action);

    // Only run on client side and after hydration
    if (isClientSide && isHydrated) {
      try {
        const state = store.getState() as RootState;

        // Save entire relevant state to localStorage
        const drivegData = {
          drive: {
            // @ts-expect-error - RootState type inference issue
            files: ((state.drive as any).files || []).map((file: FileItem) => ({
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
            filters: {
              // @ts-expect-error - RootState type inference issue
              ...state.search.filters,
              // Format dates properly
              // @ts-expect-error - RootState type inference issue
              modifiedAfter: state.search.filters.modifiedAfter
                ? (() => {
                    try {
                      // @ts-expect-error - RootState type inference issue
                      const date = new Date(state.search.filters.modifiedAfter);
                      return isValidDate(date)
                        ? formatDateForStorage(date)
                        : undefined;
                    } catch {
                      return undefined;
                    }
                  })()
                : undefined,
              // @ts-expect-error - RootState type inference issue
              modifiedBefore: state.search.filters.modifiedBefore
                ? (() => {
                    try {
                      // @ts-expect-error - RootState type inference issue
                      const date = new Date(state.search.filters.modifiedBefore);
                      return isValidDate(date)
                        ? formatDateForStorage(date)
                        : undefined;
                    } catch {
                      return undefined;
                    }
                  })()
                : undefined,
            },
            // @ts-expect-error - RootState type inference issue
            recentSearches: state.search.recentSearches,
            // @ts-expect-error - RootState type inference issue
            showFilters: state.search.showFilters,
          },
          upload: {
            // Only sync upload metadata, not File objects
            // @ts-expect-error - RootState type inference issue
            uploads: ((state.upload as any).uploads || []).map((upload: UploadItem) => ({
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

        localStorage.setItem(STORAGE_KEY, JSON.stringify(drivegData));
      } catch (error) {
        console.warn(
          "[LocalStorageSync] Failed to save to localStorage:",
          error
        );
      }
    }

    return result;
  };

/**
 * Load persisted state from localStorage
 * Only runs on client side
 */
export const loadPersistedState = (): any => {
  if (typeof window === "undefined") {
    return undefined;
  }

  try {
    const serialized = localStorage.getItem(STORAGE_KEY);
    if (serialized === null) return undefined;

    return JSON.parse(serialized);
  } catch (error) {
    console.error("Failed to load persisted state:", error);
    // Clear corrupted data
    try {
      localStorage.removeItem(STORAGE_KEY);
    } catch {
      // Ignore errors when clearing
    }
    return undefined;
  }
};
