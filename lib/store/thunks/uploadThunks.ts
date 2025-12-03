import { createAsyncThunk } from "@reduxjs/toolkit";
import type { AppDispatch, RootState } from "../index";
import {
  addUpload,
  updateUploadProgress,
  completeUpload,
  failUpload,
  removeUpload,
} from "../slices/uploadSlice";
import { addFile } from "../slices/driveSlice";
import type { FileItem } from "../slices/driveSlice";
import type { UploadItem } from "../slices/uploadSlice";
import {
  storeFile,
  deleteFile as deleteStoredFile,
} from "../../utils/fileStorage";

// Upload file
export const uploadFile = createAsyncThunk<
  { uploadId: string; fileId: string },
  { file: File; parentId?: string | null },
  { dispatch: AppDispatch; state: RootState }
>(
  "upload/uploadFile",
  async ({ file, parentId = null }, { dispatch, rejectWithValue }) => {
    const uploadId = `upload-${Date.now()}-${Math.random()}`;
    const fileId = `file-${Date.now()}-${Math.random()}`;

    try {
      const uploadItem: UploadItem = {
        id: uploadId,
        file,
        name: file.name,
        size: file.size,
        progress: 0,
        status: "pending",
        parentId,
        mimeType: file.type,
      };

      dispatch(addUpload(uploadItem));
      dispatch(updateUploadProgress({ id: uploadId, progress: 10 }));

      // Store file to IndexedDB
      try {
        await storeFile(fileId, file, file.type);
        dispatch(updateUploadProgress({ id: uploadId, progress: 50 }));
      } catch (storageError: any) {
        dispatch(
          failUpload({
            id: uploadId,
            error: `Storage failed: ${storageError.message}`,
          })
        );
        return rejectWithValue(
          storageError.message || "Failed to store file"
        );
      }

      // Simulate remaining upload progress (metadata processing, etc.)
      dispatch(updateUploadProgress({ id: uploadId, progress: 75 }));

      // Create file item after upload completes
      const fileItem: FileItem = {
        id: fileId,
        name: file.name,
        type: "file",
        mimeType: file.type,
        size: file.size,
        parentId,
        createdAt: new Date().toISOString(),
        modifiedAt: new Date().toISOString(),
        createdBy: "current-user",
        modifiedBy: "current-user",
        starred: false,
        trashed: false,
        shared: false,
      };

      dispatch(updateUploadProgress({ id: uploadId, progress: 100 }));
      dispatch(addFile(fileItem));
      dispatch(completeUpload({ id: uploadId, fileId: fileItem.id }));

      return { uploadId, fileId: fileItem.id };
    } catch (error: any) {
      // Clean up stored file if upload fails
      try {
        await deleteStoredFile(fileId);
      } catch (cleanupError) {
        console.error("Failed to cleanup file:", cleanupError);
      }

      dispatch(
        failUpload({
          id: uploadId,
          error: error.message || "Upload failed",
        })
      );
      return rejectWithValue(error.message || "Upload failed");
    }
  }
);

// Upload multiple files
export const uploadFiles = createAsyncThunk<
  Array<{ uploadId: string; fileId: string }>,
  { files: File[]; parentId?: string | null },
  { dispatch: AppDispatch; state: RootState }
>(
  "upload/uploadFiles",
  async ({ files, parentId = null }, { dispatch, rejectWithValue }) => {
    try {
      const uploadPromises = files.map(async (file) => {
        try {
          const result = await dispatch(uploadFile({ file, parentId }) as any);
          if (uploadFile.fulfilled.match(result)) {
            return result.payload;
          }
          // If rejected, return null to filter out later
          return null;
        } catch (error) {
          // Individual upload failed, but continue with others
          return null;
        }
      });

      const results = await Promise.all(uploadPromises);
      const successful = results.filter(
        (r): r is { uploadId: string; fileId: string } => r !== null
      );

      return successful;
    } catch (error: any) {
      return rejectWithValue(error.message || "Some uploads failed");
    }
  }
);

// Cancel upload
export const cancelUpload = createAsyncThunk<
  string,
  string,
  { dispatch: AppDispatch; state: RootState }
>("upload/cancelUpload", async (uploadId, { dispatch, rejectWithValue }) => {
  try {
    dispatch(removeUpload(uploadId));
    return uploadId;
  } catch (error: any) {
    return rejectWithValue(error.message || "Failed to cancel upload");
  }
});
