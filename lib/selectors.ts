import type { RootState } from "./store/index";
import type { FileItem } from "./store/slices/driveSlice";
import type { UploadItem } from "./store/slices/uploadSlice";
import type { SharePermission, ShareLink } from "./store/slices/sharingSlice";
import type { ActivityItem } from "./store/slices/activitySlice";
import type { Workspace } from "./store/slices/workspaceSlice";
import type { SharedDrive } from "./store/slices/sharedDriveSlice";
import type { SearchFilter } from "./store/slices/searchSlice";
import type {
  SuggestedFile,
  SuggestedFolder,
} from "./store/slices/suggestionsSlice";

// Drive selectors
export const selectAllFiles = (state: RootState): FileItem[] =>
  state.drive.files;
export const selectCurrentFolder = (state: RootState): string | null =>
  state.drive.currentFolderId;
export const selectFilesInCurrentFolder = (state: RootState): FileItem[] => {
  const currentFolderId = state.drive.currentFolderId;
  return state.drive.files.filter(
    (file: FileItem) => file.parentId === currentFolderId && !file.trashed
  );
};
export const selectSelectedItems = (state: RootState): string[] =>
  state.drive.selectedItems;
export const selectViewMode = (state: RootState): "grid" | "list" =>
  state.drive.viewMode;
export const selectSortBy = (
  state: RootState
): "name" | "modified" | "size" | "type" => state.drive.sortBy;
export const selectSortOrder = (state: RootState): "asc" | "desc" =>
  state.drive.sortOrder;
export const selectDriveSearchQuery = (state: RootState): string =>
  state.drive.searchQuery;
export const selectBreadcrumbs = (
  state: RootState
): Array<{ id: string; name: string }> => state.drive.breadcrumbs;
export const selectStarredFiles = (state: RootState): FileItem[] =>
  state.drive.files.filter((file: FileItem) => file.starred && !file.trashed);
export const selectTrashedFiles = (state: RootState): FileItem[] =>
  state.drive.files.filter((file: FileItem) => file.trashed);
export const selectSharedFiles = (state: RootState): FileItem[] =>
  state.drive.files.filter((file: FileItem) => file.shared && !file.trashed);

// User selectors
export const selectCurrentUser = (state: RootState) => state.user.currentUser;
export const selectIsAuthenticated = (state: RootState): boolean =>
  state.user.isAuthenticated;
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
export const selectAllUploads = (state: RootState): UploadItem[] =>
  state.upload.uploads;
export const selectActiveUploads = (state: RootState): UploadItem[] =>
  state.upload.uploads.filter(
    (u: UploadItem) => u.status === "uploading" || u.status === "pending"
  );
export const selectIsUploading = (state: RootState): boolean =>
  state.upload.isUploading;
export const selectUploadProgress = (state: RootState): number => {
  const uploads = state.upload.uploads.filter(
    (u: UploadItem) => u.status === "uploading"
  );
  if (uploads.length === 0) return 0;
  const totalProgress = uploads.reduce(
    (sum: number, u: UploadItem) => sum + u.progress,
    0
  );
  return totalProgress / uploads.length;
};

// Sharing selectors
export const selectFilePermissions =
  (fileId: string) =>
  (state: RootState): SharePermission[] =>
    state.sharing.permissions.filter(
      (p: SharePermission) => p.fileId === fileId
    );
export const selectFileShareLinks =
  (fileId: string) =>
  (state: RootState): ShareLink[] =>
    state.sharing.shareLinks.filter((l: ShareLink) => l.fileId === fileId);

// Navigation selectors
export const selectActiveNavigationItem = (state: RootState) =>
  state.navigation.activeItem;
export const selectExpandedNavigationItems = (state: RootState): string[] =>
  state.navigation.expandedItems;
export const selectSidebarCollapsed = (state: RootState): boolean =>
  state.navigation.sidebarCollapsed;
export const selectCurrentWorkspaceId = (state: RootState): string | null =>
  state.navigation.currentWorkspaceId;
export const selectCurrentSharedDriveId = (state: RootState): string | null =>
  state.navigation.currentSharedDriveId;

// Activity selectors
export const selectAllActivities = (state: RootState): ActivityItem[] =>
  state.activity.activities;
export const selectActivityFilter = (state: RootState) => state.activity.filter;
export const selectUnreadActivityCount = (state: RootState): number =>
  state.activity.unreadCount;
export const selectFilteredActivities = (state: RootState): ActivityItem[] => {
  const { activities, filter } = state.activity;
  if (filter === "all") return activities;
  // Add more filtering logic as needed
  return activities;
};

// Workspace selectors
export const selectAllWorkspaces = (state: RootState): Workspace[] =>
  state.workspace.workspaces;
export const selectCurrentWorkspace = (state: RootState) =>
  state.workspace.currentWorkspace;
export const selectWorkspaceById =
  (workspaceId: string) =>
  (state: RootState): Workspace | undefined =>
    state.workspace.workspaces.find((w: Workspace) => w.id === workspaceId);

// Shared Drive selectors
export const selectAllSharedDrives = (state: RootState): SharedDrive[] =>
  state.sharedDrive.sharedDrives;
export const selectCurrentSharedDrive = (state: RootState) =>
  state.sharedDrive.currentSharedDrive;
export const selectSharedDriveById =
  (driveId: string) =>
  (state: RootState): SharedDrive | undefined =>
    state.sharedDrive.sharedDrives.find((d: SharedDrive) => d.id === driveId);

// Search selectors
export const selectSearchQuery = (state: RootState): string =>
  state.search.query;
export const selectSearchFilters = (state: RootState): SearchFilter =>
  state.search.filters;
export const selectSearchResults = (state: RootState): FileItem[] =>
  state.search.results;
export const selectRecentSearches = (state: RootState): string[] =>
  state.search.recentSearches;
export const selectSearchSuggestions = (state: RootState): string[] =>
  state.search.suggestions;
export const selectShowSearchFilters = (state: RootState): boolean =>
  state.search.showFilters;
export const selectIsSearching = (state: RootState): boolean =>
  state.search.isLoading;

// Suggestions selectors
export const selectSuggestedFiles = (state: RootState): SuggestedFile[] =>
  state.suggestions.suggestedFiles;
export const selectSuggestedFolders = (state: RootState): SuggestedFolder[] =>
  state.suggestions.suggestedFolders;
