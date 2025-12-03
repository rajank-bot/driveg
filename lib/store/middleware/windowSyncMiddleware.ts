import { Middleware } from "@reduxjs/toolkit";
import type { RootState } from "../index";

// Extend Window interface
declare global {
  interface Window {
    drivegData?: {
      drive: {
        files: any[];
        currentFolderId: string | null;
        selectedItems: string[];
        viewMode: "grid" | "list";
        sortBy: "name" | "modified" | "size" | "type";
        sortOrder: "asc" | "desc";
        searchQuery: string;
        breadcrumbs: Array<{ id: string; name: string }>;
        isLoading: boolean;
        error: string | null;
      };
      user: {
        currentUser: any;
        isAuthenticated: boolean;
        isLoading: boolean;
        error: string | null;
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
        filters: any;
        results: any[];
        recentSearches: string[];
        suggestions: string[];
        showFilters: boolean;
        isLoading: boolean;
        error: string | null;
      };
      upload: {
        uploads: any[];
        isUploading: boolean;
      };
      _getAllState: () => RootState;
      _getDriveState: () => any;
      _getUserState: () => any;
      _getNavigationState: () => any;
      _getSearchState: () => any;
      _getUploadState: () => any;
      _clearSelection: () => void;
      _clearSearch: () => void;
      _clearFilters: () => void;
      _toggleSidebar: () => void;
      _setViewMode: (mode: "grid" | "list") => void;
      _setSortBy: (sortBy: "name" | "modified" | "size" | "type") => void;
    };
  }
}

export const windowSyncMiddleware: Middleware<{}, RootState> =
  (store) => (next) => (action: any) => {
    const result = next(action);

    // Only sync in browser environment
    if (typeof window !== "undefined") {
      const state = store.getState() as RootState;

      // Update window.drivegData with current state
      window.drivegData = {
        drive: {
          // @ts-expect-error - RootState type inference issue
          files: state.drive.files,
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
          // @ts-expect-error - RootState type inference issue
          isLoading: state.drive.isLoading,
          // @ts-expect-error - RootState type inference issue
          error: state.drive.error,
        },
        user: {
          // @ts-expect-error - RootState type inference issue
          currentUser: state.user.currentUser,
          // @ts-expect-error - RootState type inference issue
          isAuthenticated: state.user.isAuthenticated,
          // @ts-expect-error - RootState type inference issue
          isLoading: state.user.isLoading,
          // @ts-expect-error - RootState type inference issue
          error: state.user.error,
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
          results: state.search.results,
          // @ts-expect-error - RootState type inference issue
          recentSearches: state.search.recentSearches,
          // @ts-expect-error - RootState type inference issue
          suggestions: state.search.suggestions,
          // @ts-expect-error - RootState type inference issue
          showFilters: state.search.showFilters,
          // @ts-expect-error - RootState type inference issue
          isLoading: state.search.isLoading,
          // @ts-expect-error - RootState type inference issue
          error: state.search.error,
        },
        upload: {
          // @ts-expect-error - RootState type inference issue
          uploads: state.upload.uploads.map((upload: any) => ({
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
        // Helper methods for console debugging
        _getAllState: () => {
          const currentState = store.getState() as RootState;
          return currentState;
        },
        _getDriveState: () => {
          const currentState = store.getState() as RootState;
          // @ts-expect-error - RootState type inference issue
          return currentState.drive;
        },
        _getUserState: () => {
          const currentState = store.getState() as RootState;
          // @ts-expect-error - RootState type inference issue
          return currentState.user;
        },
        _getNavigationState: () => {
          const currentState = store.getState() as RootState;
          // @ts-expect-error - RootState type inference issue
          return currentState.navigation;
        },
        _getSearchState: () => {
          const currentState = store.getState() as RootState;
          // @ts-expect-error - RootState type inference issue
          return currentState.search;
        },
        _getUploadState: () => {
          const currentState = store.getState() as RootState;
          // @ts-expect-error - RootState type inference issue
          return currentState.upload;
        },
        _clearSelection: () => {
          // Dispatch clear selection action
          store.dispatch({ type: "drive/clearSelection" });
        },
        _clearSearch: () => {
          // Dispatch clear search action
          store.dispatch({ type: "search/clearSearch" });
        },
        _clearFilters: () => {
          // Dispatch clear filters action
          store.dispatch({ type: "search/clearFilters" });
        },
        _toggleSidebar: () => {
          // Dispatch toggle sidebar action
          store.dispatch({ type: "navigation/toggleSidebar" });
        },
        _setViewMode: (mode: "grid" | "list") => {
          // Dispatch set view mode action
          store.dispatch({ type: "drive/setViewMode", payload: mode });
        },
        _setSortBy: (sortBy: "name" | "modified" | "size" | "type") => {
          // Dispatch set sort by action
          store.dispatch({ type: "drive/setSortBy", payload: sortBy });
        },
      };
    }

    return result;
  };

// Initialize window.drivegData on first load
export const initializeWindowSync = (store: any) => {
  if (typeof window !== "undefined") {
    const state = store.getState() as RootState;

    window.drivegData = {
      drive: {
        // @ts-expect-error - RootState type inference issue
        files: state.drive.files,
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
        // @ts-expect-error - RootState type inference issue
        isLoading: state.drive.isLoading,
        // @ts-expect-error - RootState type inference issue
        error: state.drive.error,
      },
      user: {
        // @ts-expect-error - RootState type inference issue
        currentUser: state.user.currentUser,
        // @ts-expect-error - RootState type inference issue
        isAuthenticated: state.user.isAuthenticated,
        // @ts-expect-error - RootState type inference issue
        isLoading: state.user.isLoading,
        // @ts-expect-error - RootState type inference issue
        error: state.user.error,
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
        results: state.search.results,
        // @ts-expect-error - RootState type inference issue
        recentSearches: state.search.recentSearches,
        // @ts-expect-error - RootState type inference issue
        suggestions: state.search.suggestions,
        // @ts-expect-error - RootState type inference issue
        showFilters: state.search.showFilters,
        // @ts-expect-error - RootState type inference issue
        isLoading: state.search.isLoading,
        // @ts-expect-error - RootState type inference issue
        error: state.search.error,
      },
      upload: {
        // @ts-expect-error - RootState type inference issue
        uploads: state.upload.uploads.map((upload: any) => ({
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
      _getAllState: () => {
        const currentState = store.getState() as RootState;
        return currentState;
      },
      _getDriveState: () => {
        const currentState = store.getState() as RootState;
        // @ts-expect-error - RootState type inference issue
        return currentState.drive;
      },
      _getUserState: () => {
        const currentState = store.getState() as RootState;
        // @ts-expect-error - RootState type inference issue
        return currentState.user;
      },
      _getNavigationState: () => {
        const currentState = store.getState() as RootState;
        // @ts-expect-error - RootState type inference issue
        return currentState.navigation;
      },
      _getSearchState: () => {
        const currentState = store.getState() as RootState;
        // @ts-expect-error - RootState type inference issue
        return currentState.search;
      },
      _getUploadState: () => {
        const currentState = store.getState() as RootState;
        // @ts-expect-error - RootState type inference issue
        return currentState.upload;
      },
      _clearSelection: () => {
        store.dispatch({ type: "drive/clearSelection" });
      },
      _clearSearch: () => {
        store.dispatch({ type: "search/clearSearch" });
      },
      _clearFilters: () => {
        store.dispatch({ type: "search/clearFilters" });
      },
      _toggleSidebar: () => {
        store.dispatch({ type: "navigation/toggleSidebar" });
      },
      _setViewMode: (mode: "grid" | "list") => {
        store.dispatch({ type: "drive/setViewMode", payload: mode });
      },
      _setSortBy: (sortBy: "name" | "modified" | "size" | "type") => {
        store.dispatch({ type: "drive/setSortBy", payload: sortBy });
      },
    };

    // Log initial state to console
    console.log("🔷 DriveG Redux State initialized");
    console.log("Access via: window.drivegData");
    console.log("Helper methods:");
    console.log("  - window.drivegData._getAllState()");
    console.log("  - window.drivegData._getDriveState()");
    console.log("  - window.drivegData._getUserState()");
    console.log("  - window.drivegData._getNavigationState()");
    console.log("  - window.drivegData._getSearchState()");
    console.log("  - window.drivegData._getUploadState()");
    console.log("  - window.drivegData._clearSelection()");
    console.log("  - window.drivegData._clearSearch()");
    console.log("  - window.drivegData._clearFilters()");
    console.log("  - window.drivegData._toggleSidebar()");
    console.log("  - window.drivegData._setViewMode('grid' | 'list')");
    console.log(
      "  - window.drivegData._setSortBy('name' | 'modified' | 'size' | 'type')"
    );
  }
};
