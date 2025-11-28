import { configureStore } from "@reduxjs/toolkit";
import counterReducer from "./slices/counterSlice";
import driveReducer from "./slices/driveSlice";
import userReducer from "./slices/userSlice";
import uploadReducer from "./slices/uploadSlice";
import sharingReducer from "./slices/sharingSlice";
import { persistenceMiddleware } from "./middleware/persistenceMiddleware";
import { localStorageSync } from "./middleware/localStorageSync";
import { windowSyncMiddleware } from "./middleware/windowSyncMiddleware";

export const makeStore = () => {
  return configureStore({
    reducer: {
      counter: counterReducer,
      drive: driveReducer,
      user: userReducer,
      upload: uploadReducer,
      sharing: sharingReducer,
    },
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
export type RootState = ReturnType<AppStore["getState"]>;
export type AppDispatch = AppStore["dispatch"];

