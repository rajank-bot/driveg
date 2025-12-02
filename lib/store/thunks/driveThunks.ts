import { createAsyncThunk } from "@reduxjs/toolkit";
import type { AppDispatch, RootState } from "../index";
import type { FileItem } from "../slices/driveSlice";
import {
  setFiles,
  addFile,
  updateFile,
  deleteFile,
  setLoading,
  setError,
  moveToTrash,
  restoreFromTrash,
} from "../slices/driveSlice";
import { deleteFile as deleteStoredFile } from "../../utils/fileStorage";

// Fetch files
export const fetchFiles = createAsyncThunk<
  FileItem[],
  { folderId?: string | null; includeTrashed?: boolean },
  { dispatch: AppDispatch; state: RootState }
>("drive/fetchFiles", async (params, { dispatch, rejectWithValue }) => {
  try {
    dispatch(setLoading(true));
    dispatch(setError(null));

    // Simulate API call - replace with actual API call
    await new Promise((resolve) => setTimeout(resolve, 500));

    // In real implementation, this would be an API call
    // const response = await api.getFiles(params);
    // return response.data;

    // For now, return empty array
    dispatch(setLoading(false));
    return [];
  } catch (error: any) {
    dispatch(setLoading(false));
    dispatch(setError(error.message || "Failed to fetch files"));
    return rejectWithValue(error.message || "Failed to fetch files");
  }
});

// Create file/folder
export const createFile = createAsyncThunk<
  FileItem,
  Partial<FileItem>,
  { dispatch: AppDispatch; state: RootState }
>("drive/createFile", async (fileData, { dispatch, rejectWithValue }) => {
  try {
    dispatch(setLoading(true));
    dispatch(setError(null));

    // Simulate API call
    await new Promise((resolve) => setTimeout(resolve, 300));

    const newFile: FileItem = {
      id: `file-${Date.now()}`,
      name: fileData.name || "Untitled",
      type: fileData.type || "file",
      parentId: fileData.parentId || null,
      createdAt: new Date().toISOString(),
      modifiedAt: new Date().toISOString(),
      createdBy: fileData.createdBy || "current-user",
      modifiedBy: fileData.modifiedBy || "current-user",
      starred: false,
      trashed: false,
      shared: false,
      ...fileData,
    };

    dispatch(addFile(newFile));
    dispatch(setLoading(false));
    return newFile;
  } catch (error: any) {
    dispatch(setLoading(false));
    dispatch(setError(error.message || "Failed to create file"));
    return rejectWithValue(error.message || "Failed to create file");
  }
});

// Update file
export const updateFileThunk = createAsyncThunk<
  FileItem,
  { id: string; updates: Partial<FileItem> },
  { dispatch: AppDispatch; state: RootState }
>("drive/updateFile", async ({ id, updates }, { dispatch, rejectWithValue }) => {
  try {
    dispatch(setLoading(true));
    dispatch(setError(null));

    // Simulate API call
    await new Promise((resolve) => setTimeout(resolve, 300));

    const updatedFile = {
      id,
      ...updates,
      modifiedAt: new Date().toISOString(),
    };

    dispatch(updateFile(updatedFile));
    dispatch(setLoading(false));
    return updatedFile as FileItem;
  } catch (error: any) {
    dispatch(setLoading(false));
    dispatch(setError(error.message || "Failed to update file"));
    return rejectWithValue(error.message || "Failed to update file");
  }
});

// Delete file permanently
export const deleteFileThunk = createAsyncThunk<
  string,
  string,
  { dispatch: AppDispatch; state: RootState }
>("drive/deleteFile", async (fileId, { dispatch, rejectWithValue }) => {
  try {
    dispatch(setLoading(true));
    dispatch(setError(null));

    // Delete from IndexedDB storage
    try {
      await deleteStoredFile(fileId);
    } catch (storageError: any) {
      console.warn("Failed to delete file from storage:", storageError);
      // Continue with deletion even if storage cleanup fails
    }

    // Delete from Redux state
    dispatch(deleteFile(fileId));
    dispatch(setLoading(false));
    return fileId;
  } catch (error: any) {
    dispatch(setLoading(false));
    dispatch(setError(error.message || "Failed to delete file"));
    return rejectWithValue(error.message || "Failed to delete file");
  }
});

// Move to trash
export const moveToTrashThunk = createAsyncThunk<
  string[],
  string[],
  { dispatch: AppDispatch; state: RootState }
>("drive/moveToTrash", async (fileIds, { dispatch, rejectWithValue }) => {
  try {
    dispatch(setLoading(true));
    dispatch(setError(null));

    // Simulate API call
    await new Promise((resolve) => setTimeout(resolve, 300));

    dispatch(moveToTrash(fileIds));
    dispatch(setLoading(false));
    return fileIds;
  } catch (error: any) {
    dispatch(setLoading(false));
    dispatch(setError(error.message || "Failed to move to trash"));
    return rejectWithValue(error.message || "Failed to move to trash");
  }
});

// Restore from trash
export const restoreFromTrashThunk = createAsyncThunk<
  string[],
  string[],
  { dispatch: AppDispatch; state: RootState }
>("drive/restoreFromTrash", async (fileIds, { dispatch, rejectWithValue }) => {
  try {
    dispatch(setLoading(true));
    dispatch(setError(null));

    // Simulate API call
    await new Promise((resolve) => setTimeout(resolve, 300));

    dispatch(restoreFromTrash(fileIds));
    dispatch(setLoading(false));
    return fileIds;
  } catch (error: any) {
    dispatch(setLoading(false));
    dispatch(setError(error.message || "Failed to restore from trash"));
    return rejectWithValue(error.message || "Failed to restore from trash");
  }
});

// Move files
export const moveFiles = createAsyncThunk<
  { fileIds: string[]; newParentId: string | null },
  { fileIds: string[]; newParentId: string | null },
  { dispatch: AppDispatch; state: RootState }
>("drive/moveFiles", async ({ fileIds, newParentId }, { dispatch, rejectWithValue }) => {
  try {
    dispatch(setLoading(true));
    dispatch(setError(null));

    // Simulate API call
    await new Promise((resolve) => setTimeout(resolve, 300));

    fileIds.forEach((fileId) => {
      dispatch(updateFile({ id: fileId, parentId: newParentId }));
    });

    dispatch(setLoading(false));
    return { fileIds, newParentId };
  } catch (error: any) {
    dispatch(setLoading(false));
    dispatch(setError(error.message || "Failed to move files"));
    return rejectWithValue(error.message || "Failed to move files");
  }
});

// Copy files
export const copyFiles = createAsyncThunk<
  FileItem[],
  { fileIds: string[]; newParentId: string | null },
  { dispatch: AppDispatch; state: RootState }
>("drive/copyFiles", async ({ fileIds, newParentId }, { dispatch, getState, rejectWithValue }) => {
  try {
    dispatch(setLoading(true));
    dispatch(setError(null));

    // Simulate API call
    await new Promise((resolve) => setTimeout(resolve, 500));

    const state = getState();
    const files = state.drive.files;
    const copiedFiles: FileItem[] = [];

    fileIds.forEach((fileId) => {
      const originalFile = files.find((f) => f.id === fileId);
      if (originalFile) {
        const copiedFile: FileItem = {
          ...originalFile,
          id: `file-${Date.now()}-${Math.random()}`,
          name: `${originalFile.name} (Copy)`,
          parentId: newParentId,
          createdAt: new Date().toISOString(),
          modifiedAt: new Date().toISOString(),
        };
        dispatch(addFile(copiedFile));
        copiedFiles.push(copiedFile);
      }
    });

    dispatch(setLoading(false));
    return copiedFiles;
  } catch (error: any) {
    dispatch(setLoading(false));
    dispatch(setError(error.message || "Failed to copy files"));
    return rejectWithValue(error.message || "Failed to copy files");
  }
});

