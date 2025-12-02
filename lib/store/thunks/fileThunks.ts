import { createAsyncThunk } from "@reduxjs/toolkit";
import type { AppDispatch, RootState } from "../index";
import { deleteFile as deleteFileAction } from "../slices/driveSlice";
import { deleteFile as deleteStoredFile, getFile, getFileUrl } from "../../utils/fileStorage";

/**
 * Get file data from storage
 */
export const getFileData = createAsyncThunk<
  Blob,
  string,
  { dispatch: AppDispatch; state: RootState }
>("file/getFileData", async (fileId, { rejectWithValue }) => {
  try {
    const blob = await getFile(fileId);
    if (!blob) {
      return rejectWithValue("File not found");
    }
    return blob;
  } catch (error: any) {
    return rejectWithValue(error.message || "Failed to get file");
  }
});

/**
 * Get file URL for preview/download
 */
export const getFileDataUrl = createAsyncThunk<
  string,
  string,
  { dispatch: AppDispatch; state: RootState }
>("file/getFileDataUrl", async (fileId, { rejectWithValue }) => {
  try {
    const url = await getFileUrl(fileId);
    if (!url) {
      return rejectWithValue("File not found");
    }
    return url;
  } catch (error: any) {
    return rejectWithValue(error.message || "Failed to get file URL");
  }
});

/**
 * Delete file from both Redux state and IndexedDB storage
 */
export const deleteFileWithStorage = createAsyncThunk<
  string,
  string,
  { dispatch: AppDispatch; state: RootState }
>("file/deleteFileWithStorage", async (fileId, { dispatch, rejectWithValue }) => {
  try {
    // Delete from IndexedDB
    await deleteStoredFile(fileId);
    
    // Delete from Redux state
    dispatch(deleteFileAction(fileId));
    
    return fileId;
  } catch (error: any) {
    return rejectWithValue(error.message || "Failed to delete file");
  }
});

/**
 * Delete multiple files from both Redux state and IndexedDB storage
 */
export const deleteFilesWithStorage = createAsyncThunk<
  string[],
  string[],
  { dispatch: AppDispatch; state: RootState }
>("file/deleteFilesWithStorage", async (fileIds, { dispatch, rejectWithValue }) => {
  try {
    // Delete from IndexedDB
    const { deleteFiles } = await import("../../utils/fileStorage");
    await deleteFiles(fileIds);
    
    // Delete from Redux state
    fileIds.forEach((fileId) => {
      dispatch(deleteFileAction(fileId));
    });
    
    return fileIds;
  } catch (error: any) {
    return rejectWithValue(error.message || "Failed to delete files");
  }
});

