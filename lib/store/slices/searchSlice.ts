import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import type { FileItem } from "./driveSlice";

export interface SearchFilter {
  type?: "file" | "folder" | "all";
  owner?: string;
  modifiedAfter?: string;
  modifiedBefore?: string;
  sizeMin?: number;
  sizeMax?: number;
  mimeType?: string;
  starred?: boolean;
  isTrashed?: boolean;
  shared?: boolean;
}

export interface SearchState {
  query: string;
  filters: SearchFilter;
  results: FileItem[];
  isLoading: boolean;
  error: string | null;
  recentSearches: string[];
  suggestions: string[];
  showFilters: boolean;
}

const initialState: SearchState = {
  query: "",
  filters: {},
  results: [],
  isLoading: false,
  error: null,
  recentSearches: [],
  suggestions: [],
  showFilters: false,
};

export const searchSlice = createSlice({
  name: "search",
  initialState,
  reducers: {
    setQuery: (state, action: PayloadAction<string>) => {
      state.query = action.payload;
    },
    setFilters: (state, action: PayloadAction<SearchFilter>) => {
      state.filters = { ...state.filters, ...action.payload };
    },
    clearFilters: (state) => {
      state.filters = {};
    },
    setResults: (state, action: PayloadAction<FileItem[]>) => {
      state.results = action.payload;
    },
    addRecentSearch: (state, action: PayloadAction<string>) => {
      const query = action.payload.trim().toLowerCase();
      if (query && !state.recentSearches.includes(query)) {
        state.recentSearches.unshift(query);
        if (state.recentSearches.length > 10) {
          state.recentSearches.pop();
        }
      }
    },
    clearRecentSearches: (state) => {
      state.recentSearches = [];
    },
    setSuggestions: (state, action: PayloadAction<string[]>) => {
      state.suggestions = action.payload;
    },
    toggleFilters: (state) => {
      state.showFilters = !state.showFilters;
    },
    setShowFilters: (state, action: PayloadAction<boolean>) => {
      state.showFilters = action.payload;
    },
    setLoading: (state, action: PayloadAction<boolean>) => {
      state.isLoading = action.payload;
    },
    setError: (state, action: PayloadAction<string | null>) => {
      state.error = action.payload;
    },
    clearSearch: (state) => {
      state.query = "";
      state.results = [];
      state.filters = {};
    },
  },
});

export const {
  setQuery,
  setFilters,
  clearFilters,
  setResults,
  addRecentSearch,
  clearRecentSearches,
  setSuggestions,
  toggleFilters,
  setShowFilters,
  setLoading,
  setError,
  clearSearch,
} = searchSlice.actions;

export default searchSlice.reducer;

