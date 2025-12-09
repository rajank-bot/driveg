import { sampleFiles } from "@/data/intialData";
import { createSlice, PayloadAction } from "@reduxjs/toolkit";

export interface FileItem {
  id: string;
  name: string;
  type: "file" | "folder";
  mimeType?: string;
  size?: number;
  parentId: string | null;
  createdAt: string;
  modifiedAt: string;
  createdBy: string;
  modifiedBy: string;
  starred?: boolean;
  isTrashed?: boolean;
  trashedAt?: string | null;
  shared?: boolean;
  permissions?: {
    canView: boolean;
    canEdit: boolean;
    canDelete: boolean;
    canShare: boolean;
  };
  thumbnailUrl?: string;
  downloadUrl?: string;
}

export interface DriveState {
  files: FileItem[];
  currentFolderId: string | null;
  selectedItems: string[];
  viewMode: "grid" | "list";
  sortBy: "name" | "modified" | "size" | "type";
  sortOrder: "asc" | "desc";
  isLoading: boolean;
  error: string | null;
  searchQuery: string;
  breadcrumbs: Array<{ id: string; name: string }>;
}

const initialState: DriveState = {
  files: sampleFiles,
  currentFolderId: null,
  selectedItems: [],
  viewMode: "grid",
  sortBy: "modified",
  sortOrder: "desc",
  isLoading: false,
  error: null,
  searchQuery: "",
  breadcrumbs: [],
};

export const driveSlice = createSlice({
  name: "drive",
  initialState,
  reducers: {
    setFiles: (state, action: PayloadAction<FileItem[]>) => {
      state.files = action.payload;
    },
    addFile: (state, action: PayloadAction<FileItem>) => {
      state.files.push(action.payload);
    },
    updateFile: (state, action: PayloadAction<Partial<FileItem> & { id: string }>) => {
      const index = state.files.findIndex((f) => f.id === action.payload.id);
      if (index !== -1) {
        state.files[index] = { ...state.files[index], ...action.payload };
      }
    },
    deleteDriveFile: (state, action: PayloadAction<string>) => {
      state.files = state.files.filter((f) => f.id !== action.payload);
      state.selectedItems = state.selectedItems.filter((id) => id !== action.payload);
    },
    moveToTrash: (state, action: PayloadAction<string[]>) => {
      action.payload.forEach((id) => {
        const file = state.files.find((f) => f.id === id);
        if (file) {
          file.isTrashed = true;
          file.trashedAt = new Date().toISOString();
        }
      });
      state.selectedItems = [];
    },
    restoreFromTrash: (state, action: PayloadAction<string[]>) => {
      action.payload.forEach((id) => {
        const file = state.files.find((f) => f.id === id);
        if (file) {
          file.isTrashed = false;
          file.trashedAt = null;
        }
      });
    },
    setCurrentFolder: (state, action: PayloadAction<string | null>) => {
      state.currentFolderId = action.payload;
    },
    setSelectedItems: (state, action: PayloadAction<string[]>) => {
      state.selectedItems = action.payload;
    },
    toggleItemSelection: (state, action: PayloadAction<string>) => {
      const index = state.selectedItems.indexOf(action.payload);
      if (index === -1) {
        state.selectedItems.push(action.payload);
      } else {
        state.selectedItems.splice(index, 1);
      }
    },
    clearSelection: (state) => {
      state.selectedItems = [];
    },
    setViewMode: (state, action: PayloadAction<"grid" | "list">) => {
      state.viewMode = action.payload;
    },
    setSortBy: (state, action: PayloadAction<"name" | "modified" | "size" | "type">) => {
      state.sortBy = action.payload;
    },
    setSortOrder: (state, action: PayloadAction<"asc" | "desc">) => {
      state.sortOrder = action.payload;
    },
    setLoading: (state, action: PayloadAction<boolean>) => {
      state.isLoading = action.payload;
    },
    setError: (state, action: PayloadAction<string | null>) => {
      state.error = action.payload;
    },
    setSearchQuery: (state, action: PayloadAction<string>) => {
      state.searchQuery = action.payload;
    },
    setBreadcrumbs: (state, action: PayloadAction<Array<{ id: string; name: string }>>) => {
      state.breadcrumbs = action.payload;
    },
    toggleStar: (state, action: PayloadAction<string>) => {
      const file = state.files.find((f) => f.id === action.payload);
      if (file) {
        file.starred = !file.starred;
      }
    },
  },
});

export const {
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
  setLoading,
  setError,
  setSearchQuery,
  setBreadcrumbs,
  toggleStar,
} = driveSlice.actions;

export default driveSlice.reducer;

