import type { RootState } from "./store/index";
import { loadPersistedState } from "./store/middleware/localStorageSync";

/**
 * Preloads initial state from localStorage
 * This runs when the Redux store initializes
 * Only runs on client side
 */
export const preloadState = (): Partial<RootState> | undefined => {
  if (typeof window === "undefined") {
    return undefined;
  }

  try {
    const persistedState = loadPersistedState();
    if (!persistedState) {
      return undefined;
    }

    // Map persisted state to RootState structure
    return {
      drive: persistedState.drive
        ? {
            // IMPORTANT: Load files from persisted state
            files: persistedState.drive.files || [],
            currentFolderId: persistedState.drive.currentFolderId ?? null,
            selectedItems: persistedState.drive.selectedItems || [],
            viewMode: persistedState.drive.viewMode || "grid",
            sortBy: persistedState.drive.sortBy || "modified",
            sortOrder: persistedState.drive.sortOrder || "desc",
            isLoading: false,
            error: null,
            searchQuery: persistedState.drive.searchQuery || "",
            breadcrumbs: persistedState.drive.breadcrumbs || [],
          }
        : undefined,
      user: persistedState.user
        ? {
            currentUser: persistedState.user.currentUser || null,
            isAuthenticated: persistedState.user.isAuthenticated || false,
            isLoading: false,
            error: null,
          }
        : undefined,
      navigation: persistedState.navigation
        ? {
            activeItem: persistedState.navigation.activeItem || "home",
            expandedItems: persistedState.navigation.expandedItems || [],
            sidebarCollapsed: persistedState.navigation.sidebarCollapsed || false,
            currentWorkspaceId: persistedState.navigation.currentWorkspaceId || null,
            currentSharedDriveId: persistedState.navigation.currentSharedDriveId || null,
          }
        : undefined,
      search: persistedState.search
        ? {
            query: persistedState.search.query || "",
            filters: persistedState.search.filters || {},
            results: [],
            isLoading: false,
            error: null,
            recentSearches: persistedState.search.recentSearches || [],
            suggestions: [],
            showFilters: persistedState.search.showFilters || false,
          }
        : undefined,
    } as Partial<RootState>;
  } catch (error) {
    console.error("Error preloading state:", error);
    // Clear corrupted data
    try {
      localStorage.removeItem("drivegData");
    } catch {
      // Ignore errors when clearing
    }
    return undefined;
  }
};
