import { createAsyncThunk } from "@reduxjs/toolkit";
import type { AppDispatch, RootState } from "../index";
import {
  addPermission,
  updatePermission,
  removePermission,
  addShareLink,
  updateShareLink,
  removeShareLink,
  setLoading,
  setError,
} from "../slices/sharingSlice";
import type { SharePermission, ShareLink } from "../slices/sharingSlice";

// Share file with user
export const shareFileWithUser = createAsyncThunk<
  SharePermission,
  {
    fileId: string;
    userEmail: string;
    userName: string;
    userId: string;
    role: "viewer" | "commenter" | "editor";
  },
  { dispatch: AppDispatch; state: RootState }
>(
  "sharing/shareFileWithUser",
  async (
    { fileId, userEmail, userName, userId, role },
    { dispatch, rejectWithValue }
  ) => {
    try {
      dispatch(setLoading(true));
      dispatch(setError(null));

      // Simulate API call
      await new Promise((resolve) => setTimeout(resolve, 300));

      const permission: SharePermission = {
        id: `permission-${Date.now()}`,
        fileId,
        userId,
        userEmail,
        userName,
        role,
        createdAt: new Date().toISOString(),
      };

      dispatch(addPermission(permission));
      dispatch(setLoading(false));
      return permission;
    } catch (error: any) {
      dispatch(setLoading(false));
      dispatch(setError(error.message || "Failed to share file"));
      return rejectWithValue(error.message || "Failed to share file");
    }
  }
);

// Update share permission
export const updateSharePermission = createAsyncThunk<
  SharePermission,
  { permissionId: string; role: "viewer" | "commenter" | "editor" },
  { dispatch: AppDispatch; state: RootState }
>(
  "sharing/updatePermission",
  async ({ permissionId, role }, { dispatch, getState, rejectWithValue }) => {
    try {
      dispatch(setLoading(true));
      dispatch(setError(null));

      // Simulate API call
      await new Promise((resolve) => setTimeout(resolve, 300));

      // Get the current permission first to merge with updates
      const state = getState();
      const currentPermission = state.sharing.permissions.find(
        (p: SharePermission) => p.id === permissionId
      );

      if (!currentPermission) {
        dispatch(setLoading(false));
        return rejectWithValue("Permission not found");
      }

      // Update with new role
      const updatedPermission: SharePermission = {
        ...currentPermission,
        role,
      };

      dispatch(updatePermission({ id: permissionId, role }));
      dispatch(setLoading(false));

      return updatedPermission;
    } catch (error: any) {
      dispatch(setLoading(false));
      dispatch(setError(error.message || "Failed to update permission"));
      return rejectWithValue(error.message || "Failed to update permission");
    }
  }
);

// Remove share permission
export const removeSharePermission = createAsyncThunk<
  string,
  string,
  { dispatch: AppDispatch; state: RootState }
>(
  "sharing/removePermission",
  async (permissionId, { dispatch, rejectWithValue }) => {
    try {
      dispatch(setLoading(true));
      dispatch(setError(null));

      // Simulate API call
      await new Promise((resolve) => setTimeout(resolve, 300));

      dispatch(removePermission(permissionId));
      dispatch(setLoading(false));
      return permissionId;
    } catch (error: any) {
      dispatch(setLoading(false));
      dispatch(setError(error.message || "Failed to remove permission"));
      return rejectWithValue(error.message || "Failed to remove permission");
    }
  }
);

// Create share link
export const createShareLink = createAsyncThunk<
  ShareLink,
  {
    fileId: string;
    accessLevel: "viewer" | "commenter" | "editor";
    allowDownload?: boolean;
    expiresAt?: string;
  },
  { dispatch: AppDispatch; state: RootState }
>(
  "sharing/createShareLink",
  async (
    { fileId, accessLevel, allowDownload = true, expiresAt },
    { dispatch, rejectWithValue }
  ) => {
    try {
      dispatch(setLoading(true));
      dispatch(setError(null));

      // Simulate API call
      await new Promise((resolve) => setTimeout(resolve, 300));

      const shareLink: ShareLink = {
        id: `link-${Date.now()}`,
        fileId,
        link: `https://driveg.example.com/share/${Date.now()}`,
        accessLevel,
        allowDownload,
        expiresAt,
        createdAt: new Date().toISOString(),
      };

      dispatch(addShareLink(shareLink));
      dispatch(setLoading(false));
      return shareLink;
    } catch (error: any) {
      dispatch(setLoading(false));
      dispatch(setError(error.message || "Failed to create share link"));
      return rejectWithValue(error.message || "Failed to create share link");
    }
  }
);

// Update share link
export const updateShareLinkThunk = createAsyncThunk<
  ShareLink,
  Partial<ShareLink> & { id: string },
  { dispatch: AppDispatch; state: RootState }
>(
  "sharing/updateShareLink",
  async (linkData, { dispatch, getState, rejectWithValue }) => {
    try {
      dispatch(setLoading(true));
      dispatch(setError(null));

      // Simulate API call
      await new Promise((resolve) => setTimeout(resolve, 300));

      // Get the current share link first to merge with updates
      const state = getState() as RootState;
      // @ts-ignore - getState() returns unknown but we know it's RootState
      const currentLink = state.sharing.shareLinks.find(
        (l: ShareLink) => l.id === linkData.id
      );

      if (!currentLink) {
        dispatch(setLoading(false));
        return rejectWithValue("Share link not found");
      }

      // Update with new data
      const updatedLink: ShareLink = {
        ...currentLink,
        ...linkData,
      };

      dispatch(updateShareLink(linkData));
      dispatch(setLoading(false));

      return updatedLink;
    } catch (error: any) {
      dispatch(setLoading(false));
      dispatch(setError(error.message || "Failed to update share link"));
      return rejectWithValue(error.message || "Failed to update share link");
    }
  }
);

// Remove share link
export const removeShareLinkThunk = createAsyncThunk<
  string,
  string,
  { dispatch: AppDispatch; state: RootState }
>("sharing/removeShareLink", async (linkId, { dispatch, rejectWithValue }) => {
  try {
    dispatch(setLoading(true));
    dispatch(setError(null));

    // Simulate API call
    await new Promise((resolve) => setTimeout(resolve, 300));

    dispatch(removeShareLink(linkId));
    dispatch(setLoading(false));
    return linkId;
  } catch (error: any) {
    dispatch(setLoading(false));
    dispatch(setError(error.message || "Failed to remove share link"));
    return rejectWithValue(error.message || "Failed to remove share link");
  }
});
