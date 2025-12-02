import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import type { FileItem } from "./driveSlice";

export interface SuggestedFile extends FileItem {
  reason: string;
  reasonType: "opened" | "created" | "edited" | "shared" | "activity" | "recent";
  reasonTimestamp?: string;
  location: string;
  locationId: string;
}

export interface SuggestedFolder {
  id: string;
  name: string;
  parentId: string | null;
  reason: string;
  reasonType: "shared" | "recent" | "activity";
  shared: boolean;
  memberCount?: number;
}

export interface SuggestionsState {
  suggestedFiles: SuggestedFile[];
  suggestedFolders: SuggestedFolder[];
  isLoading: boolean;
  error: string | null;
}

const initialState: SuggestionsState = {
  suggestedFiles: [],
  suggestedFolders: [],
  isLoading: false,
  error: null,
};

export const suggestionsSlice = createSlice({
  name: "suggestions",
  initialState,
  reducers: {
    setSuggestedFiles: (state, action: PayloadAction<SuggestedFile[]>) => {
      state.suggestedFiles = action.payload;
    },
    setSuggestedFolders: (state, action: PayloadAction<SuggestedFolder[]>) => {
      state.suggestedFolders = action.payload;
    },
    addSuggestedFile: (state, action: PayloadAction<SuggestedFile>) => {
      state.suggestedFiles.push(action.payload);
    },
    removeSuggestedFile: (state, action: PayloadAction<string>) => {
      state.suggestedFiles = state.suggestedFiles.filter((f) => f.id !== action.payload);
    },
    addSuggestedFolder: (state, action: PayloadAction<SuggestedFolder>) => {
      state.suggestedFolders.push(action.payload);
    },
    removeSuggestedFolder: (state, action: PayloadAction<string>) => {
      state.suggestedFolders = state.suggestedFolders.filter((f) => f.id !== action.payload);
    },
    clearSuggestions: (state) => {
      state.suggestedFiles = [];
      state.suggestedFolders = [];
    },
    setLoading: (state, action: PayloadAction<boolean>) => {
      state.isLoading = action.payload;
    },
    setError: (state, action: PayloadAction<string | null>) => {
      state.error = action.payload;
    },
  },
});

export const {
  setSuggestedFiles,
  setSuggestedFolders,
  addSuggestedFile,
  removeSuggestedFile,
  addSuggestedFolder,
  removeSuggestedFolder,
  clearSuggestions,
  setLoading,
  setError,
} = suggestionsSlice.actions;

export default suggestionsSlice.reducer;

