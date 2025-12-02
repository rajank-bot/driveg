import { createSlice, PayloadAction } from "@reduxjs/toolkit";

export interface Workspace {
  id: string;
  name: string;
  description?: string;
  color?: string;
  icon?: string;
  memberCount: number;
  fileCount: number;
  createdAt: string;
  createdBy: string;
  members: Array<{
    userId: string;
    role: "owner" | "admin" | "member";
    joinedAt: string;
  }>;
}

export interface WorkspaceState {
  workspaces: Workspace[];
  currentWorkspace: Workspace | null;
  isLoading: boolean;
  error: string | null;
}

const initialState: WorkspaceState = {
  workspaces: [],
  currentWorkspace: null,
  isLoading: false,
  error: null,
};

export const workspaceSlice = createSlice({
  name: "workspace",
  initialState,
  reducers: {
    setWorkspaces: (state, action: PayloadAction<Workspace[]>) => {
      state.workspaces = action.payload;
    },
    addWorkspace: (state, action: PayloadAction<Workspace>) => {
      state.workspaces.push(action.payload);
    },
    updateWorkspace: (state, action: PayloadAction<Partial<Workspace> & { id: string }>) => {
      const index = state.workspaces.findIndex((w) => w.id === action.payload.id);
      if (index !== -1) {
        state.workspaces[index] = { ...state.workspaces[index], ...action.payload };
        if (state.currentWorkspace?.id === action.payload.id) {
          state.currentWorkspace = { ...state.currentWorkspace, ...action.payload };
        }
      }
    },
    deleteWorkspace: (state, action: PayloadAction<string>) => {
      state.workspaces = state.workspaces.filter((w) => w.id !== action.payload);
      if (state.currentWorkspace?.id === action.payload) {
        state.currentWorkspace = null;
      }
    },
    setCurrentWorkspace: (state, action: PayloadAction<Workspace | null>) => {
      state.currentWorkspace = action.payload;
    },
    addWorkspaceMember: (
      state,
      action: PayloadAction<{ workspaceId: string; member: Workspace["members"][0] }>
    ) => {
      const workspace = state.workspaces.find((w) => w.id === action.payload.workspaceId);
      if (workspace) {
        workspace.members.push(action.payload.member);
        workspace.memberCount += 1;
      }
    },
    removeWorkspaceMember: (
      state,
      action: PayloadAction<{ workspaceId: string; userId: string }>
    ) => {
      const workspace = state.workspaces.find((w) => w.id === action.payload.workspaceId);
      if (workspace) {
        workspace.members = workspace.members.filter(
          (m) => m.userId !== action.payload.userId
        );
        workspace.memberCount -= 1;
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
  setWorkspaces,
  addWorkspace,
  updateWorkspace,
  deleteWorkspace,
  setCurrentWorkspace,
  addWorkspaceMember,
  removeWorkspaceMember,
  setLoading,
  setError,
} = workspaceSlice.actions;

export default workspaceSlice.reducer;

