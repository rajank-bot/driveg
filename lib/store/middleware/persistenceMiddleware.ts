import { Middleware } from "@reduxjs/toolkit";
import type { RootState } from "../index";
import { formatDateForStorage, isValidDate } from "../../utils/dateUtils";

const STORAGE_KEY = "drivegData";

// State to persist
interface PersistedState {
  drive: {
    currentFolderId: string | null;
    selectedItems: string[];
    viewMode: "grid" | "list";
    sortBy: "name" | "modified" | "size" | "type";
    sortOrder: "asc" | "desc";
    searchQuery: string;
    breadcrumbs: Array<{ id: string; name: string }>;
  };
  user: {
    isAuthenticated: boolean;
    currentUser: {
      id: string;
      name: string;
      email: string;
      avatar?: string;
      storageUsed: number;
      storageLimit: number;
      plan: "free" | "basic" | "premium";
    } | null;
  };
  navigation: {
    activeItem: string;
    expandedItems: string[];
    sidebarCollapsed: boolean;
    currentWorkspaceId: string | null;
    currentSharedDriveId: string | null;
  };
  search: {
    query: string;
    filters: {
      type?: "file" | "folder" | "all";
      owner?: string;
      modifiedAfter?: string;
      modifiedBefore?: string;
      sizeMin?: number;
      sizeMax?: number;
      mimeType?: string;
      starred?: boolean;
      trashed?: boolean;
      shared?: boolean;
    };
    recentSearches: string[];
    showFilters: boolean;
  };
}

export const persistenceMiddleware: Middleware<{}, RootState> =
  (store) => (next) => (action: any) => {
    const result = next(action);

    // Only run in browser environment
    if (typeof window === "undefined") {
      return result;
    }

    // Actions that trigger persistence
    const persistActions = [
      "drive/setCurrentFolder",
      "drive/setSelectedItems",
      "drive/toggleItemSelection",
      "drive/clearSelection",
      "drive/setViewMode",
      "drive/setSortBy",
      "drive/setSortOrder",
      "drive/setSearchQuery",
      "drive/setBreadcrumbs",
      "drive/toggleStar",
      "user/setUser",
      "user/updateUser",
      "user/updateStorage",
      "navigation/setActiveItem",
      "navigation/toggleExpandedItem",
      "navigation/setExpandedItems",
      "navigation/toggleSidebar",
      "navigation/setSidebarCollapsed",
      "navigation/setCurrentWorkspace",
      "navigation/setCurrentSharedDrive",
      "search/setQuery",
      "search/setFilters",
      "search/addRecentSearch",
      "search/setShowFilters",
      "search/toggleFilters",
    ];

    // Actions that clear persistence
    const clearActions = [
      "user/logout",
      "drive/clearSelection",
      "search/clearSearch",
      "search/clearFilters",
      "search/clearRecentSearches",
    ];

    if (persistActions.some((type) => action.type.includes(type))) {
      // @ts-expect-error - RootState type inference issue
      const driveState = store.getState().drive;
      // @ts-expect-error - RootState type inference issue
      const userState = store.getState().user;
      // @ts-expect-error - RootState type inference issue
      const navigationState = store.getState().navigation;
      // @ts-expect-error - RootState type inference issue
      const searchState = store.getState().search;

      const toPersist: PersistedState = {
        drive: {
          currentFolderId: driveState.currentFolderId,
          selectedItems: driveState.selectedItems,
          viewMode: driveState.viewMode,
          sortBy: driveState.sortBy,
          sortOrder: driveState.sortOrder,
          searchQuery: driveState.searchQuery,
          breadcrumbs: driveState.breadcrumbs,
        },
        user: {
          isAuthenticated: userState.isAuthenticated,
          currentUser: userState.currentUser
            ? {
                id: userState.currentUser.id,
                name: userState.currentUser.name,
                email: userState.currentUser.email,
                avatar: userState.currentUser.avatar,
                storageUsed: userState.currentUser.storageUsed,
                storageLimit: userState.currentUser.storageLimit,
                plan: userState.currentUser.plan,
              }
            : null,
        },
        navigation: {
          activeItem: navigationState.activeItem,
          expandedItems: navigationState.expandedItems,
          sidebarCollapsed: navigationState.sidebarCollapsed,
          currentWorkspaceId: navigationState.currentWorkspaceId,
          currentSharedDriveId: navigationState.currentSharedDriveId,
        },
        search: {
          query: searchState.query,
          filters: {
            ...searchState.filters,
            // Format dates properly to avoid timezone issues
            modifiedAfter: searchState.filters.modifiedAfter
              ? (() => {
                  try {
                    const date = new Date(searchState.filters.modifiedAfter);
                    return isValidDate(date)
                      ? formatDateForStorage(date)
                      : undefined;
                  } catch {
                    return undefined;
                  }
                })()
              : undefined,
            modifiedBefore: searchState.filters.modifiedBefore
              ? (() => {
                  try {
                    const date = new Date(searchState.filters.modifiedBefore);
                    return isValidDate(date)
                      ? formatDateForStorage(date)
                      : undefined;
                  } catch {
                    return undefined;
                  }
                })()
              : undefined,
          },
          recentSearches: searchState.recentSearches,
          showFilters: searchState.showFilters,
        },
      };

      try {
        localStorage.setItem(STORAGE_KEY, JSON.stringify(toPersist));
      } catch (error) {
        console.error("Failed to persist state:", error);
      }
    }

    // Clear on logout or explicit clear
    if (clearActions.some((type) => action.type.includes(type))) {
      try {
        // Only clear user-related data on logout, keep other preferences
        if (action.type.includes("user/logout")) {
          const currentData = loadPersistedState();
          if (currentData && currentData.drive && currentData.navigation && currentData.search) {
            const clearedData: PersistedState = {
              drive: currentData.drive,
              navigation: currentData.navigation,
              search: currentData.search,
              user: {
                isAuthenticated: false,
                currentUser: null,
              },
            };
            localStorage.setItem(STORAGE_KEY, JSON.stringify(clearedData));
          } else {
            localStorage.removeItem(STORAGE_KEY);
          }
        } else {
          // For other clear actions, just update the specific part
          const currentData = loadPersistedState();
          if (currentData) {
            const updatedData: PersistedState = {
              drive: currentData.drive || {
                currentFolderId: null,
                selectedItems: [],
                viewMode: "grid",
                sortBy: "modified",
                sortOrder: "desc",
                searchQuery: "",
                breadcrumbs: [],
              },
              navigation: currentData.navigation || {
                activeItem: "home",
                expandedItems: [],
                sidebarCollapsed: false,
                currentWorkspaceId: null,
                currentSharedDriveId: null,
              },
              search: currentData.search || {
                query: "",
                filters: {},
                recentSearches: [],
                showFilters: false,
              },
              user: currentData.user || {
                isAuthenticated: false,
                currentUser: null,
              },
            };

            if (action.type.includes("search/clearSearch")) {
              updatedData.search = {
                query: "",
                filters: {},
                recentSearches: updatedData.search.recentSearches,
                showFilters: updatedData.search.showFilters,
              };
            } else if (action.type.includes("search/clearFilters")) {
              updatedData.search.filters = {};
            } else if (action.type.includes("search/clearRecentSearches")) {
              updatedData.search.recentSearches = [];
            } else if (action.type.includes("drive/clearSelection")) {
              updatedData.drive.selectedItems = [];
            }
            localStorage.setItem(STORAGE_KEY, JSON.stringify(updatedData));
          }
        }
      } catch (error) {
        console.error("Failed to clear persisted state:", error);
      }
    }

    return result;
  };

// Helper to load persisted state
export const loadPersistedState = (): Partial<PersistedState> | undefined => {
  // Only run in browser environment
  if (typeof window === "undefined") {
    return undefined;
  }

  try {
    const serialized = localStorage.getItem(STORAGE_KEY);
    if (serialized === null) return undefined;

    return JSON.parse(serialized);
  } catch (error) {
    console.error("Failed to load persisted state:", error);
    return undefined;
  }
};
