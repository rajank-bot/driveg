import { createSlice, PayloadAction } from "@reduxjs/toolkit";

export interface ActivityItem {
  id: string;
  type: "created" | "edited" | "shared" | "deleted" | "moved" | "renamed" | "viewed";
  fileId: string;
  fileName: string;
  userId: string;
  userName: string;
  userAvatar?: string;
  timestamp: string;
  details?: string;
}

export interface ActivityState {
  activities: ActivityItem[];
  isLoading: boolean;
  error: string | null;
  filter: "all" | "my-activity" | "file-updates" | "sharing";
  unreadCount: number;
}

const initialState: ActivityState = {
  activities: [],
  isLoading: false,
  error: null,
  filter: "all",
  unreadCount: 0,
};

export const activitySlice = createSlice({
  name: "activity",
  initialState,
  reducers: {
    setActivities: (state, action: PayloadAction<ActivityItem[]>) => {
      state.activities = action.payload;
      state.unreadCount = action.payload.filter((a) => !a.timestamp).length;
    },
    addActivity: (state, action: PayloadAction<ActivityItem>) => {
      state.activities.unshift(action.payload);
      state.unreadCount += 1;
    },
    markAsRead: (state, action: PayloadAction<string>) => {
      const activity = state.activities.find((a) => a.id === action.payload);
      if (activity && state.unreadCount > 0) {
        state.unreadCount -= 1;
      }
    },
    markAllAsRead: (state) => {
      state.unreadCount = 0;
    },
    setFilter: (state, action: PayloadAction<"all" | "my-activity" | "file-updates" | "sharing">) => {
      state.filter = action.payload;
    },
    setLoading: (state, action: PayloadAction<boolean>) => {
      state.isLoading = action.payload;
    },
    setError: (state, action: PayloadAction<string | null>) => {
      state.error = action.payload;
    },
    clearActivities: (state) => {
      state.activities = [];
      state.unreadCount = 0;
    },
  },
});

export const {
  setActivities,
  addActivity,
  markAsRead,
  markAllAsRead,
  setFilter,
  setLoading,
  setError,
  clearActivities,
} = activitySlice.actions;

export default activitySlice.reducer;

