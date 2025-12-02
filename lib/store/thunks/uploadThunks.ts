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

// Upload file
export const uploadFile = createAsyncThunk<
  { uploadId: string; fileId: string },
  { file: File; parentId?: string | null },
  { dispatch: AppDispatch; state: RootState }
>(
  "upload/uploadFile",
  async ({ file, parentId = null }, { dispatch, rejectWithValue }) => {
    try {
      const uploadId = `upload-${Date.now()}-${Math.random()}`;

      const uploadItem: UploadItem = {
        id: uploadId,
        file,
        name: file.name,
        size: file.size,
        progress: 0,
        status: "pending",
        parentId,
      };

      dispatch(addUpload(uploadItem));

      // Simulate file upload with progress
      return new Promise<{ uploadId: string; fileId: string }>(
        (resolve, reject) => {
          // Simulate potential error (5% chance) - check at start
          if (Math.random() < 0.05) {
            dispatch(failUpload({ id: uploadId, error: "Upload failed" }));
            reject(new Error("Upload failed"));
            return;
          }

          // Simulate upload progress
          let progress = 0;
          const interval = setInterval(() => {
            progress += 10;
            dispatch(updateUploadProgress({ id: uploadId, progress }));

            if (progress >= 100) {
              clearInterval(interval);

              // Create file item after upload completes
              const fileItem: FileItem = {
                id: `file-${Date.now()}`,
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

              dispatch(addFile(fileItem));
              dispatch(completeUpload({ id: uploadId, fileId: fileItem.id }));

              resolve({ uploadId, fileId: fileItem.id });
            }
          }, 200);
        }
      );
    } catch (error: any) {
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
