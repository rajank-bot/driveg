import { createSlice, PayloadAction } from "@reduxjs/toolkit";

// View types that have sorting
export type SortableView =
  | "my-drive"
  | "shared-with-me"
  | "starred"
  | "trash";

// Sort by options matching the UI
// Different views have different available options
export type SortByOption =
  | "dateShared" // Available in "shared-with-me"
  | "dateTrashed" // Available in "trash"
  | "name"
  | "dateModified"
  | "dateModifiedByMe"
  | "dateOpenedByMe";

// Sort direction options
// For name: "aToZ" | "zToA"
// For dates: "newToOld" | "oldToNew"
export type SortDirection = "aToZ" | "zToA" | "newToOld" | "oldToNew";

// Folders position options
export type FoldersPosition = "onTop" | "mixedWithFiles";

// Sort settings for a single view
export interface ViewSortSettings {
  sortBy: SortByOption;
  sortDirection: SortDirection;
  foldersPosition: FoldersPosition;
}

// Sort state - stores settings per view
export interface SortState {
  // Each view has its own independent sort settings
  views: Record<SortableView, ViewSortSettings>;
}

// Default sort settings for each view
const getDefaultSortSettings = (view: SortableView): ViewSortSettings => {
  switch (view) {
    case "my-drive":
      return {
        sortBy: "name",
        sortDirection: "aToZ", // Default: A to Z for name
        foldersPosition: "onTop",
      };
    case "shared-with-me":
      return {
        sortBy: "dateShared",
        sortDirection: "newToOld", // Default: New to old for dates
        foldersPosition: "onTop",
      };
    case "starred":
      return {
        sortBy: "name",
        sortDirection: "aToZ", // Default: A to Z for name
        foldersPosition: "onTop",
      };
    case "trash":
      return {
        sortBy: "dateTrashed",
        sortDirection: "newToOld", // Default: New to old for dates
        foldersPosition: "mixedWithFiles",
      };
  }
};

const initialState: SortState = {
  views: {
    "my-drive": getDefaultSortSettings("my-drive"),
    "shared-with-me": getDefaultSortSettings("shared-with-me"),
    starred: getDefaultSortSettings("starred"),
    trash: getDefaultSortSettings("trash"),
  },
};

export const sortSlice = createSlice({
  name: "sort",
  initialState,
  reducers: {
    // Set sort by for a specific view
    setSortBy: (
      state,
      action: PayloadAction<{ view: SortableView; sortBy: SortByOption }>
    ) => {
      if (state.views[action.payload.view]) {
        state.views[action.payload.view].sortBy = action.payload.sortBy;
      }
    },
    // Set sort direction for a specific view
    setSortDirection: (
      state,
      action: PayloadAction<{ view: SortableView; sortDirection: SortDirection }>
    ) => {
      if (state.views[action.payload.view]) {
        state.views[action.payload.view].sortDirection = action.payload.sortDirection;
      }
    },
    // Set folders position for a specific view
    setFoldersPosition: (
      state,
      action: PayloadAction<{ view: SortableView; foldersPosition: FoldersPosition }>
    ) => {
      if (state.views[action.payload.view]) {
        state.views[action.payload.view].foldersPosition = action.payload.foldersPosition;
      }
    },
    // Combined action to set all sort options for a specific view at once
    setSortOptions: (
      state,
      action: PayloadAction<{
        view: SortableView;
        options: Partial<ViewSortSettings>;
      }>
    ) => {
      const viewSettings = state.views[action.payload.view];
      if (viewSettings) {
        if (action.payload.options.sortBy !== undefined) {
          viewSettings.sortBy = action.payload.options.sortBy;
        }
        if (action.payload.options.sortDirection !== undefined) {
          viewSettings.sortDirection = action.payload.options.sortDirection;
        }
        if (action.payload.options.foldersPosition !== undefined) {
          viewSettings.foldersPosition = action.payload.options.foldersPosition;
        }
      }
    },
    // Reset sort for a specific view to defaults
    resetSort: (state, action: PayloadAction<SortableView>) => {
      state.views[action.payload] = getDefaultSortSettings(action.payload);
    },
    // Reset all views to defaults
    resetAllSorts: (state) => {
      Object.keys(state.views).forEach((view) => {
        state.views[view as SortableView] = getDefaultSortSettings(
          view as SortableView
        );
      });
    },
  },
});

export const {
  setSortBy,
  setSortDirection,
  setFoldersPosition,
  setSortOptions,
  resetSort,
  resetAllSorts,
} = sortSlice.actions;

export default sortSlice.reducer;

