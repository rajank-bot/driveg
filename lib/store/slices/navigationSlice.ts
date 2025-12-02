import { createSlice, PayloadAction } from "@reduxjs/toolkit";

export type NavigationItem =
  | "home"
  | "activity"
  | "workspaces"
  | "my-drive"
  | "shared-drives"
  | "shared-with-me"
  | "recent"
  | "starred"
  | "spam"
  | "trash"
  | "storage";

export interface NavigationState {
  activeItem: NavigationItem;
  expandedItems: string[];
  sidebarCollapsed: boolean;
  currentWorkspaceId: string | null;
  currentSharedDriveId: string | null;
}

const initialState: NavigationState = {
  activeItem: "home",
  expandedItems: ["my-drive"],
  sidebarCollapsed: false,
  currentWorkspaceId: null,
  currentSharedDriveId: null,
};

export const navigationSlice = createSlice({
  name: "navigation",
  initialState,
  reducers: {
    setActiveItem: (state, action: PayloadAction<NavigationItem>) => {
      state.activeItem = action.payload;
    },
    toggleExpandedItem: (state, action: PayloadAction<string>) => {
      const index = state.expandedItems.indexOf(action.payload);
      if (index === -1) {
        state.expandedItems.push(action.payload);
      } else {
        state.expandedItems.splice(index, 1);
      }
    },
    setExpandedItems: (state, action: PayloadAction<string[]>) => {
      state.expandedItems = action.payload;
    },
    toggleSidebar: (state) => {
      state.sidebarCollapsed = !state.sidebarCollapsed;
    },
    setSidebarCollapsed: (state, action: PayloadAction<boolean>) => {
      state.sidebarCollapsed = action.payload;
    },
    setCurrentWorkspace: (state, action: PayloadAction<string | null>) => {
      state.currentWorkspaceId = action.payload;
    },
    setCurrentSharedDrive: (state, action: PayloadAction<string | null>) => {
      state.currentSharedDriveId = action.payload;
    },
  },
});

export const {
  setActiveItem,
  toggleExpandedItem,
  setExpandedItems,
  toggleSidebar,
  setSidebarCollapsed,
  setCurrentWorkspace,
  setCurrentSharedDrive,
} = navigationSlice.actions;

export default navigationSlice.reducer;

