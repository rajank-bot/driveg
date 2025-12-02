import { createSlice, PayloadAction } from "@reduxjs/toolkit";

export interface SharePermission {
  id: string;
  fileId: string;
  userId: string;
  userEmail: string;
  userName: string;
  role: "viewer" | "commenter" | "editor" | "owner";
  createdAt: string;
}

export interface ShareLink {
  id: string;
  fileId: string;
  link: string;
  accessLevel: "viewer" | "commenter" | "editor";
  allowDownload: boolean;
  expiresAt?: string;
  createdAt: string;
}

export interface SharingState {
  permissions: SharePermission[];
  shareLinks: ShareLink[];
  isLoading: boolean;
  error: string | null;
}

const initialState: SharingState = {
  permissions: [],
  shareLinks: [],
  isLoading: false,
  error: null,
};

export const sharingSlice = createSlice({
  name: "sharing",
  initialState,
  reducers: {
    setPermissions: (state, action: PayloadAction<SharePermission[]>) => {
      state.permissions = action.payload;
    },
    addPermission: (state, action: PayloadAction<SharePermission>) => {
      state.permissions.push(action.payload);
    },
    updatePermission: (
      state,
      action: PayloadAction<Partial<SharePermission> & { id: string }>
    ) => {
      const index = state.permissions.findIndex((p) => p.id === action.payload.id);
      if (index !== -1) {
        state.permissions[index] = { ...state.permissions[index], ...action.payload };
      }
    },
    removePermission: (state, action: PayloadAction<string>) => {
      state.permissions = state.permissions.filter((p) => p.id !== action.payload);
    },
    setShareLinks: (state, action: PayloadAction<ShareLink[]>) => {
      state.shareLinks = action.payload;
    },
    addShareLink: (state, action: PayloadAction<ShareLink>) => {
      state.shareLinks.push(action.payload);
    },
    updateShareLink: (state, action: PayloadAction<Partial<ShareLink> & { id: string }>) => {
      const index = state.shareLinks.findIndex((l) => l.id === action.payload.id);
      if (index !== -1) {
        state.shareLinks[index] = { ...state.shareLinks[index], ...action.payload };
      }
    },
    removeShareLink: (state, action: PayloadAction<string>) => {
      state.shareLinks = state.shareLinks.filter((l) => l.id !== action.payload);
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
  setPermissions,
  addPermission,
  updatePermission,
  removePermission,
  setShareLinks,
  addShareLink,
  updateShareLink,
  removeShareLink,
  setLoading,
  setError,
} = sharingSlice.actions;

export default sharingSlice.reducer;

