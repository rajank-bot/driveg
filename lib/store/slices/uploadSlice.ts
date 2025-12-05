import { createSlice, PayloadAction } from "@reduxjs/toolkit";

export interface UploadItem {
  id: string;
  file?: File;
  name: string;
  size: number;
  progress: number;
  status: "pending" | "uploading" | "completed" | "error";
  error?: string;
  parentId: string | null;
  uploadedFileId?: string;
  mimeType?: string;
}

export interface UploadState {
  uploads: UploadItem[];
  isUploading: boolean;
}

const initialState: UploadState = {
  uploads: [],
  isUploading: false,
};

export const uploadSlice = createSlice({
  name: "upload",
  initialState,
  reducers: {
    addUpload: (state, action: PayloadAction<UploadItem>) => {
      state.uploads.push(action.payload);
      state.isUploading = true;
    },
    updateUploadProgress: (
      state,
      action: PayloadAction<{ id: string; progress: number }>
    ) => {
      const upload = state.uploads.find((u) => u.id === action.payload.id);
      if (upload) {
        upload.progress = action.payload.progress;
        upload.status = "uploading";
      }
    },
    completeUpload: (state, action: PayloadAction<{ id: string; fileId: string }>) => {
      const upload = state.uploads.find((u) => u.id === action.payload.id);
      if (upload) {
        upload.status = "completed";
        upload.progress = 100;
        upload.uploadedFileId = action.payload.fileId;
      }
      state.isUploading = state.uploads.some((u) => u.status === "uploading");
    },
    failUpload: (state, action: PayloadAction<{ id: string; error: string }>) => {
      const upload = state.uploads.find((u) => u.id === action.payload.id);
      if (upload) {
        upload.status = "error";
        upload.error = action.payload.error;
      }
      state.isUploading = state.uploads.some((u) => u.status === "uploading");
    },
    removeUpload: (state, action: PayloadAction<string>) => {
      state.uploads = state.uploads.filter((u) => u.id !== action.payload);
      state.isUploading = state.uploads.some((u) => u.status === "uploading");
    },
    clearCompletedUploads: (state) => {
      state.uploads = state.uploads.filter((u) => u.status !== "completed");
    },
    clearAllUploads: (state) => {
      state.uploads = [];
      state.isUploading = false;
    },
  },
});

export const {
  addUpload,
  updateUploadProgress,
  completeUpload,
  failUpload,
  removeUpload,
  clearCompletedUploads,
  clearAllUploads,
} = uploadSlice.actions;

export default uploadSlice.reducer;

