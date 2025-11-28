import type { RootState } from "./store/index";

// Counter selectors
export const selectCounterValue = (state: RootState) => state.counter.value;

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

