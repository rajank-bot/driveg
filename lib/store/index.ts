import { configureStore } from "@reduxjs/toolkit";
import driveReducer from "./slices/driveSlice";
import userReducer from "./slices/userSlice";
import uploadReducer from "./slices/uploadSlice";
import sharingReducer from "./slices/sharingSlice";
import navigationReducer from "./slices/navigationSlice";
import activityReducer from "./slices/activitySlice";
import workspaceReducer from "./slices/workspaceSlice";
import sharedDriveReducer from "./slices/sharedDriveSlice";
import searchReducer from "./slices/searchSlice";
import suggestionsReducer from "./slices/suggestionsSlice";
import sortReducer from "./slices/sortSlice";
import { persistenceMiddleware } from "./middleware/persistenceMiddleware";
import { localStorageSync } from "./middleware/localStorageSync";
import { windowSyncMiddleware } from "./middleware/windowSyncMiddleware";

const rootReducer = {
  drive: driveReducer,
  user: userReducer,
  upload: uploadReducer,
  sharing: sharingReducer,
  navigation: navigationReducer,
  activity: activityReducer,
  workspace: workspaceReducer,
  sharedDrive: sharedDriveReducer,
  search: searchReducer,
  suggestions: suggestionsReducer,
  sort: sortReducer,
};

export const makeStore = (): ReturnType<typeof configureStore> => {
  return configureStore({
    reducer: rootReducer,
    middleware: (getDefaultMiddleware) =>
      getDefaultMiddleware({
        serializableCheck: {
          ignoredActions: ["persist/PERSIST", "persist/REHYDRATE"],
        },
      }).concat(persistenceMiddleware, localStorageSync, windowSyncMiddleware),
  });
};

// Infer the type of makeStore
export type AppStore = ReturnType<typeof makeStore>;
// Infer the `RootState` and `AppDispatch` types from the store itself
// Using a helper to avoid circular reference issues
type StoreState = ReturnType<ReturnType<typeof makeStore>["getState"]>;
export type RootState = StoreState;
export type AppDispatch = ReturnType<typeof makeStore>["dispatch"];
