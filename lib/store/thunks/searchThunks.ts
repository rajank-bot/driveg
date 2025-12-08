import { createAsyncThunk } from "@reduxjs/toolkit";
import type { AppDispatch, RootState } from "../index";
import type { FileItem } from "../slices/driveSlice";
import type { SearchFilter } from "../slices/searchSlice";
import {
  setQuery,
  setResults,
  setLoading,
  setError,
  addRecentSearch,
  setSuggestions,
} from "../slices/searchSlice";

// Search files
export const searchFiles = createAsyncThunk<
  FileItem[],
  { query: string; filters?: SearchFilter },
  { dispatch: AppDispatch; state: RootState }
>("search/searchFiles", async ({ query, filters = {} }, { dispatch, getState, rejectWithValue }) => {
  try {
    dispatch(setQuery(query));
    dispatch(setLoading(true));
    dispatch(setError(null));

    // Simulate API call
    await new Promise((resolve) => setTimeout(resolve, 300));

    const state = getState() as RootState;
    const allFiles = (state as any).drive.files as FileItem[];

    // Simple client-side search - replace with API call in production
    let results = allFiles.filter((file: FileItem) => {
      if (file.isTrashed && !filters.isTrashed) return false;

      // Text search
      if (query) {
        const searchLower = query.toLowerCase();
        if (!file.name.toLowerCase().includes(searchLower)) {
          return false;
        }
      }

      // Type filter
      if (filters.type && filters.type !== "all" && file.type !== filters.type) {
        return false;
      }

      // Owner filter
      if (filters.owner && file.createdBy !== filters.owner) {
        return false;
      }

      // Starred filter
      if (filters.starred !== undefined && file.starred !== filters.starred) {
        return false;
      }

      // Shared filter
      if (filters.shared !== undefined && file.shared !== filters.shared) {
        return false;
      }

      // MIME type filter
      if (filters.mimeType && file.mimeType !== filters.mimeType) {
        return false;
      }

      return true;
    });

    dispatch(setResults(results));
    if (query.trim()) {
      dispatch(addRecentSearch(query));
    }
    dispatch(setLoading(false));
    return results;
  } catch (error: any) {
    dispatch(setLoading(false));
    dispatch(setError(error.message || "Search failed"));
    return rejectWithValue(error.message || "Search failed");
  }
});

// Get search suggestions
export const getSearchSuggestions = createAsyncThunk<
  string[],
  string,
  { dispatch: AppDispatch; state: RootState }
>("search/getSuggestions", async (query, { dispatch, getState, rejectWithValue }) => {
  try {
    if (!query.trim()) {
      dispatch(setSuggestions([]));
      return [];
    }

    const state = getState() as RootState;
    const allFiles = (state as any).drive.files as FileItem[];
    const recentSearches = (state as any).search.recentSearches as string[];

    // Get suggestions from file names and recent searches
    const suggestions: string[] = [];

    // Add matching recent searches
    recentSearches
      .filter((search: string) => search.toLowerCase().includes(query.toLowerCase()))
      .slice(0, 3)
      .forEach((search: string) => suggestions.push(search));

    // Add matching file names
    const fileNames = allFiles
      .map((f: FileItem) => f.name)
      .filter((name: string) => name.toLowerCase().includes(query.toLowerCase()))
      .slice(0, 5);

    fileNames.forEach((name) => {
      if (!suggestions.includes(name)) {
        suggestions.push(name);
      }
    });

    dispatch(setSuggestions(suggestions.slice(0, 8)));
    return suggestions.slice(0, 8);
  } catch (error: any) {
    dispatch(setError(error.message || "Failed to get suggestions"));
    return rejectWithValue(error.message || "Failed to get suggestions");
  }
});

