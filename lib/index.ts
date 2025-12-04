// Store exports
export { makeStore } from "./store/index";
export type { AppStore, RootState, AppDispatch } from "./store/index";

// Hooks
export { useAppDispatch, useAppSelector, useAppStore } from "./hooks";

// Selectors
export * from "./selectors";

// Types
export * from "./types";

// Utilities
export { preloadState } from "./preloadState";
export { initLanguage, setLanguage, DEFAULT_LANGUAGE } from "./initLanguage";
export type { SupportedLanguage } from "./initLanguage";
export { loadPersistedState } from "./store/middleware/localStorageSync";

// File Storage Utilities
export {
  initFileStorage,
  storeFile,
  getFile,
  getFileUrl,
  deleteFile,
  deleteFiles,
  getStorageUsage,
  clearAllFiles,
} from "./utils/fileStorage";

// Date Utilities
export {
  isValidDate,
  formatDateForStorage,
  parseDateFromStorage,
} from "./utils/dateUtils";

// Store Provider
export { default as StoreProvider } from "./StoreProvider";

// Window Sync
export { initializeWindowSync } from "./store/middleware/windowSyncMiddleware";

// Thunks (async actions)
export * from "./store/thunks";

// Slice exports (for direct action access if needed)
// Note: We export types and specific actions to avoid naming conflicts
export type { FileItem, DriveState } from "./store/slices/driveSlice";
export { 
  setFiles, 
  addFile, 
  updateFile, 
  deleteDriveFile, 
  moveToTrash, 
  restoreFromTrash,
  setCurrentFolder,
  setSelectedItems,
  toggleItemSelection,
  clearSelection,
  setViewMode,
  setSortBy,
  setSortOrder,
  toggleStar,
} from "./store/slices/driveSlice";

export type { User, UserState } from "./store/slices/userSlice";
export { setUser, updateUser, updateStorage, logout } from "./store/slices/userSlice";

export type { UploadItem, UploadState } from "./store/slices/uploadSlice";
export {
  addUpload,
  updateUploadProgress,
  completeUpload,
  failUpload,
  removeUpload,
  clearCompletedUploads,
  clearAllUploads,
} from "./store/slices/uploadSlice";

export type { SharePermission, ShareLink, SharingState } from "./store/slices/sharingSlice";
export {
  setPermissions,
  addPermission,
  updatePermission,
  removePermission,
  setShareLinks,
  addShareLink,
  updateShareLink,
  removeShareLink,
} from "./store/slices/sharingSlice";

export type { NavigationItem, NavigationState } from "./store/slices/navigationSlice";
export {
  setActiveItem,
  toggleExpandedItem,
  setExpandedItems,
  toggleSidebar,
  setSidebarCollapsed,
  setCurrentWorkspace,
  setCurrentSharedDrive,
} from "./store/slices/navigationSlice";

export type { ActivityItem, ActivityState } from "./store/slices/activitySlice";
export {
  setActivities,
  addActivity,
  markAsRead,
  markAllAsRead,
  setFilter,
  clearActivities,
} from "./store/slices/activitySlice";

export type { Workspace, WorkspaceState } from "./store/slices/workspaceSlice";
export {
  setWorkspaces,
  addWorkspace,
  updateWorkspace,
  deleteWorkspace,
  addWorkspaceMember,
  removeWorkspaceMember,
} from "./store/slices/workspaceSlice";

export type { SharedDrive, SharedDriveState } from "./store/slices/sharedDriveSlice";
export {
  setSharedDrives,
  addSharedDrive,
  updateSharedDrive,
  deleteSharedDrive,
  addSharedDriveMember,
  removeSharedDriveMember,
  updateSharedDriveStorage,
} from "./store/slices/sharedDriveSlice";

export type { SearchFilter, SearchState } from "./store/slices/searchSlice";
export {
  setQuery,
  setFilters,
  clearFilters,
  setResults,
  addRecentSearch,
  clearRecentSearches,
  setSuggestions,
  toggleFilters,
  setShowFilters,
  clearSearch,
} from "./store/slices/searchSlice";

export type { SuggestedFile, SuggestedFolder, SuggestionsState } from "./store/slices/suggestionsSlice";
export {
  setSuggestedFiles,
  setSuggestedFolders,
  addSuggestedFile,
  removeSuggestedFile,
  addSuggestedFolder,
  removeSuggestedFolder,
  clearSuggestions,
} from "./store/slices/suggestionsSlice";

