import { createSlice, PayloadAction } from "@reduxjs/toolkit";

export interface SharedDrive {
  id: string;
  name: string;
  description?: string;
  color?: string;
  icon?: string;
  memberCount: number;
  fileCount: number;
  storageUsed: number;
  storageLimit: number;
  createdAt: string;
  createdBy: string;
  members: Array<{
    userId: string;
    role: "manager" | "content-manager" | "contributor" | "commenter" | "viewer";
    joinedAt: string;
  }>;
}

export interface SharedDriveState {
  sharedDrives: SharedDrive[];
  currentSharedDrive: SharedDrive | null;
  isLoading: boolean;
  error: string | null;
}

const initialState: SharedDriveState = {
  sharedDrives: [],
  currentSharedDrive: null,
  isLoading: false,
  error: null,
};

export const sharedDriveSlice = createSlice({
  name: "sharedDrive",
  initialState,
  reducers: {
    setSharedDrives: (state, action: PayloadAction<SharedDrive[]>) => {
      state.sharedDrives = action.payload;
    },
    addSharedDrive: (state, action: PayloadAction<SharedDrive>) => {
      state.sharedDrives.push(action.payload);
    },
    updateSharedDrive: (
      state,
      action: PayloadAction<Partial<SharedDrive> & { id: string }>
    ) => {
      const index = state.sharedDrives.findIndex((d) => d.id === action.payload.id);
      if (index !== -1) {
        state.sharedDrives[index] = { ...state.sharedDrives[index], ...action.payload };
        if (state.currentSharedDrive?.id === action.payload.id) {
          state.currentSharedDrive = { ...state.currentSharedDrive, ...action.payload };
        }
      }
    },
    deleteSharedDrive: (state, action: PayloadAction<string>) => {
      state.sharedDrives = state.sharedDrives.filter((d) => d.id !== action.payload);
      if (state.currentSharedDrive?.id === action.payload) {
        state.currentSharedDrive = null;
      }
    },
    setCurrentSharedDrive: (state, action: PayloadAction<SharedDrive | null>) => {
      state.currentSharedDrive = action.payload;
    },
    addSharedDriveMember: (
      state,
      action: PayloadAction<{ driveId: string; member: SharedDrive["members"][0] }>
    ) => {
      const drive = state.sharedDrives.find((d) => d.id === action.payload.driveId);
      if (drive) {
        drive.members.push(action.payload.member);
        drive.memberCount += 1;
      }
    },
    removeSharedDriveMember: (
      state,
      action: PayloadAction<{ driveId: string; userId: string }>
    ) => {
      const drive = state.sharedDrives.find((d) => d.id === action.payload.driveId);
      if (drive) {
        drive.members = drive.members.filter((m) => m.userId !== action.payload.userId);
        drive.memberCount -= 1;
      }
    },
    updateSharedDriveStorage: (
      state,
      action: PayloadAction<{ driveId: string; used: number; limit: number }>
    ) => {
      const drive = state.sharedDrives.find((d) => d.id === action.payload.driveId);
      if (drive) {
        drive.storageUsed = action.payload.used;
        drive.storageLimit = action.payload.limit;
      }
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
  setSharedDrives,
  addSharedDrive,
  updateSharedDrive,
  deleteSharedDrive,
  setCurrentSharedDrive,
  addSharedDriveMember,
  removeSharedDriveMember,
  updateSharedDriveStorage,
  setLoading,
  setError,
} = sharedDriveSlice.actions;

export default sharedDriveSlice.reducer;

