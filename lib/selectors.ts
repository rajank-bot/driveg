import type { RootState } from "./store/index";

// Drive selectors
export const selectAllFiles = (state: RootState) => state.drive.files;
export const selectCurrentFolder = (state: RootState) => state.drive.currentFolderId;
export const selectFilesInCurrentFolder = (state: RootState) => {
  const currentFolderId = state.drive.currentFolderId;
  return state.drive.files.filter(
    (file) => file.parentId === currentFolderId && !file.trashed
  );
};
export const selectSelectedItems = (state: RootState) => state.drive.selectedItems;
export const selectViewMode = (state: RootState) => state.drive.viewMode;
export const selectSortBy = (state: RootState) => state.drive.sortBy;
export const selectSortOrder = (state: RootState) => state.drive.sortOrder;
export const selectSearchQuery = (state: RootState) => state.drive.searchQuery;
export const selectBreadcrumbs = (state: RootState) => state.drive.breadcrumbs;
export const selectStarredFiles = (state: RootState) =>
  state.drive.files.filter((file) => file.starred && !file.trashed);
export const selectTrashedFiles = (state: RootState) =>
  state.drive.files.filter((file) => file.trashed);
export const selectSharedFiles = (state: RootState) =>
  state.drive.files.filter((file) => file.shared && !file.trashed);

// User selectors
export const selectCurrentUser = (state: RootState) => state.user.currentUser;
export const selectIsAuthenticated = (state: RootState) => state.user.isAuthenticated;
export const selectStorageInfo = (state: RootState) => {
  const user = state.user.currentUser;
  if (!user) return null;
  return {
    used: user.storageUsed,
    limit: user.storageLimit,
    percentage: (user.storageUsed / user.storageLimit) * 100,
    remaining: user.storageLimit - user.storageUsed,
  };
};

// Upload selectors
export const selectAllUploads = (state: RootState) => state.upload.uploads;
export const selectActiveUploads = (state: RootState) =>
  state.upload.uploads.filter((u) => u.status === "uploading" || u.status === "pending");
export const selectIsUploading = (state: RootState) => state.upload.isUploading;
export const selectUploadProgress = (state: RootState) => {
  const uploads = state.upload.uploads.filter((u) => u.status === "uploading");
  if (uploads.length === 0) return 0;
  const totalProgress = uploads.reduce((sum, u) => sum + u.progress, 0);
  return totalProgress / uploads.length;
};

// Sharing selectors
export const selectFilePermissions = (fileId: string) => (state: RootState) =>
  state.sharing.permissions.filter((p) => p.fileId === fileId);
export const selectFileShareLinks = (fileId: string) => (state: RootState) =>
  state.sharing.shareLinks.filter((l) => l.fileId === fileId);

// Navigation selectors
export const selectActiveNavigationItem = (state: RootState) => state.navigation.activeItem;
export const selectExpandedNavigationItems = (state: RootState) => state.navigation.expandedItems;
export const selectSidebarCollapsed = (state: RootState) => state.navigation.sidebarCollapsed;
export const selectCurrentWorkspaceId = (state: RootState) => state.navigation.currentWorkspaceId;
export const selectCurrentSharedDriveId = (state: RootState) =>
  state.navigation.currentSharedDriveId;

// Activity selectors
export const selectAllActivities = (state: RootState) => state.activity.activities;
export const selectActivityFilter = (state: RootState) => state.activity.filter;
export const selectUnreadActivityCount = (state: RootState) => state.activity.unreadCount;
export const selectFilteredActivities = (state: RootState) => {
  const { activities, filter } = state.activity;
  if (filter === "all") return activities;
  // Add more filtering logic as needed
  return activities;
};

// Workspace selectors
export const selectAllWorkspaces = (state: RootState) => state.workspace.workspaces;
export const selectCurrentWorkspace = (state: RootState) => state.workspace.currentWorkspace;
export const selectWorkspaceById = (workspaceId: string) => (state: RootState) =>
  state.workspace.workspaces.find((w) => w.id === workspaceId);

// Shared Drive selectors
export const selectAllSharedDrives = (state: RootState) => state.sharedDrive.sharedDrives;
export const selectCurrentSharedDrive = (state: RootState) => state.sharedDrive.currentSharedDrive;
export const selectSharedDriveById = (driveId: string) => (state: RootState) =>
  state.sharedDrive.sharedDrives.find((d) => d.id === driveId);

// Search selectors
export const selectSearchQuery = (state: RootState) => state.search.query;
export const selectSearchFilters = (state: RootState) => state.search.filters;
export const selectSearchResults = (state: RootState) => state.search.results;
export const selectRecentSearches = (state: RootState) => state.search.recentSearches;
export const selectSearchSuggestions = (state: RootState) => state.search.suggestions;
export const selectShowSearchFilters = (state: RootState) => state.search.showFilters;
export const selectIsSearching = (state: RootState) => state.search.isLoading;

// Suggestions selectors
export const selectSuggestedFiles = (state: RootState) => state.suggestions.suggestedFiles;
export const selectSuggestedFolders = (state: RootState) => state.suggestions.suggestedFolders;

