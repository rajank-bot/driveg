import type { RootState } from "./store/index";
import { loadPersistedState } from "./store/middleware/persistenceMiddleware";

/**
 * Preloads initial state from localStorage or other sources
 * This is useful for SSR or initial client-side hydration
 */
export const preloadState = (): Partial<RootState> | undefined => {
  if (typeof window === "undefined") {
    return undefined;
  }

  try {
    const persistedState = loadPersistedState();
    if (persistedState) {
      // Map persisted state to RootState structure
      return {
        drive: persistedState.drive
          ? {
              files: [],
              currentFolderId: persistedState.drive.currentFolderId,
              selectedItems: persistedState.drive.selectedItems,
              viewMode: persistedState.drive.viewMode,
              sortBy: persistedState.drive.sortBy,
              sortOrder: persistedState.drive.sortOrder,
              isLoading: false,
              error: null,
              searchQuery: persistedState.drive.searchQuery,
              breadcrumbs: persistedState.drive.breadcrumbs,
            }
          : undefined,
        user: persistedState.user
          ? {
              currentUser: persistedState.user.currentUser,
              isAuthenticated: persistedState.user.isAuthenticated,
              isLoading: false,
              error: null,
            }
          : undefined,
        navigation: persistedState.navigation,
        search: persistedState.search
          ? {
              query: persistedState.search.query,
              filters: persistedState.search.filters,
              results: [],
              isLoading: false,
              error: null,
              recentSearches: persistedState.search.recentSearches,
              suggestions: [],
              showFilters: persistedState.search.showFilters,
            }
          : undefined,
      } as Partial<RootState>;
    }
  } catch (error) {
    console.error("Error preloading state:", error);
  }

  return undefined;
};
