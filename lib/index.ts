// Store exports
export { makeStore } from "./store/index";
export type { AppStore, RootState, AppDispatch } from "./store/index";

// Hooks
export { useAppDispatch, useAppSelector, useAppStore } from "./hooks";

// Selectors
export * from "./selectors";

// Types
export * from "./types";

// Utilities
export { preloadState } from "./preloadState";
export { initLanguage, setLanguage, DEFAULT_LANGUAGE } from "./initLanguage";
export type { SupportedLanguage } from "./initLanguage";

// Store Provider
export { default as StoreProvider } from "./StoreProvider";

// Thunks (async actions)
export * from "./store/thunks";

// Slice exports (for direct action access if needed)
export * from "./store/slices/driveSlice";
export * from "./store/slices/userSlice";
export * from "./store/slices/uploadSlice";
export * from "./store/slices/sharingSlice";
export * from "./store/slices/navigationSlice";
export * from "./store/slices/activitySlice";
export * from "./store/slices/workspaceSlice";
export * from "./store/slices/sharedDriveSlice";
export * from "./store/slices/searchSlice";
export * from "./store/slices/suggestionsSlice";

