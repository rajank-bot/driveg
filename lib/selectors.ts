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

// Type helper to work around RootState inference issues
type State = RootState;

// Drive selectors
export const selectAllFiles = (state: State): FileItem[] =>
  (state as any).drive.files;
export const selectCurrentFolder = (state: State): string | null =>
  (state as any).drive.currentFolderId;
export const selectFilesInCurrentFolder = (state: State): FileItem[] => {
  const currentFolderId = (state as any).drive.currentFolderId;
  return (state as any).drive.files.filter(
    (file: FileItem) => file.parentId === currentFolderId && !file.trashed
  );
};
export const selectSelectedItems = (state: State): string[] =>
  (state as any).drive.selectedItems;
export const selectViewMode = (state: State): "grid" | "list" =>
  (state as any).drive.viewMode;
export const selectSortBy = (
  state: State
): "name" | "modified" | "size" | "type" => (state as any).drive.sortBy;
export const selectSortOrder = (state: State): "asc" | "desc" =>
  (state as any).drive.sortOrder;
export const selectDriveSearchQuery = (state: State): string =>
  (state as any).drive.searchQuery;
export const selectBreadcrumbs = (
  state: State
): Array<{ id: string; name: string }> => (state as any).drive.breadcrumbs;
export const selectStarredFiles = (state: State): FileItem[] =>
  (state as any).drive.files.filter(
    (file: FileItem) => file.starred && !file.trashed
  );
export const selectTrashedFiles = (state: State): FileItem[] =>
  (state as any).drive.files.filter((file: FileItem) => file.trashed);
export const selectSharedFiles = (state: State): FileItem[] =>
  (state as any).drive.files.filter(
    (file: FileItem) => file.shared && !file.trashed
  );

// User selectors
export const selectCurrentUser = (state: State) =>
  (state as any).user.currentUser;
export const selectIsAuthenticated = (state: State): boolean =>
  (state as any).user.isAuthenticated;
export const selectStorageInfo = (state: State) => {
  const user = (state as any).user.currentUser;
  if (!user) return null;
  return {
    used: user.storageUsed,
    limit: user.storageLimit,
    percentage: (user.storageUsed / user.storageLimit) * 100,
    remaining: user.storageLimit - user.storageUsed,
  };
};

// Upload selectors
export const selectAllUploads = (state: State): UploadItem[] =>
  (state as any).upload.uploads;
export const selectActiveUploads = (state: State): UploadItem[] =>
  (state as any).upload.uploads.filter(
    (u: UploadItem) => u.status === "uploading" || u.status === "pending"
  );
export const selectIsUploading = (state: State): boolean =>
  (state as any).upload.isUploading;
export const selectUploadProgress = (state: State): number => {
  const uploads = (state as any).upload.uploads.filter(
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
  (state: State): SharePermission[] =>
    (state as any).sharing.permissions.filter(
      (p: SharePermission) => p.fileId === fileId
    );
export const selectFileShareLinks =
  (fileId: string) =>
  (state: State): ShareLink[] =>
    (state as any).sharing.shareLinks.filter(
      (l: ShareLink) => l.fileId === fileId
    );

// Navigation selectors
export const selectActiveNavigationItem = (state: State) =>
  (state as any).navigation.activeItem;
export const selectExpandedNavigationItems = (state: State): string[] =>
  (state as any).navigation.expandedItems;
export const selectSidebarCollapsed = (state: State): boolean =>
  (state as any).navigation.sidebarCollapsed;
export const selectCurrentWorkspaceId = (state: State): string | null =>
  (state as any).navigation.currentWorkspaceId;
export const selectCurrentSharedDriveId = (state: State): string | null =>
  (state as any).navigation.currentSharedDriveId;

// Activity selectors
export const selectAllActivities = (state: State): ActivityItem[] =>
  (state as any).activity.activities;
export const selectActivityFilter = (state: State) =>
  (state as any).activity.filter;
export const selectUnreadActivityCount = (state: State): number =>
  (state as any).activity.unreadCount;
export const selectFilteredActivities = (state: State): ActivityItem[] => {
  const { activities, filter } = (state as any).activity;
  if (filter === "all") return activities;
  // Add more filtering logic as needed
  return activities;
};

// Workspace selectors
export const selectAllWorkspaces = (state: State): Workspace[] =>
  (state as any).workspace.workspaces;
export const selectCurrentWorkspace = (state: State) =>
  (state as any).workspace.currentWorkspace;
export const selectWorkspaceById =
  (workspaceId: string) =>
  (state: State): Workspace | undefined =>
    (state as any).workspace.workspaces.find(
      (w: Workspace) => w.id === workspaceId
    );

// Shared Drive selectors
export const selectAllSharedDrives = (state: State): SharedDrive[] =>
  (state as any).sharedDrive.sharedDrives;
export const selectCurrentSharedDrive = (state: State) =>
  (state as any).sharedDrive.currentSharedDrive;
export const selectSharedDriveById =
  (driveId: string) =>
  (state: State): SharedDrive | undefined =>
    (state as any).sharedDrive.sharedDrives.find(
      (d: SharedDrive) => d.id === driveId
    );

// Search selectors
export const selectSearchQuery = (state: State): string =>
  (state as any).search.query;
export const selectSearchFilters = (state: State): SearchFilter =>
  (state as any).search.filters;
export const selectSearchResults = (state: State): FileItem[] =>
  (state as any).search.results;
export const selectRecentSearches = (state: State): string[] =>
  (state as any).search.recentSearches;
export const selectSearchSuggestions = (state: State): string[] =>
  (state as any).search.suggestions;
export const selectShowSearchFilters = (state: State): boolean =>
  (state as any).search.showFilters;
export const selectIsSearching = (state: State): boolean =>
  (state as any).search.isLoading;

// Suggestions selectors
export const selectSuggestedFiles = (state: State): SuggestedFile[] =>
  (state as any).suggestions.suggestedFiles;
export const selectSuggestedFolders = (state: State): SuggestedFolder[] =>
  (state as any).suggestions.suggestedFolders;
