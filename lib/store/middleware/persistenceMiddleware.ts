import { Middleware } from "@reduxjs/toolkit";

export const persistenceMiddleware: Middleware =
  (store) => (next) => (action) => {
    const result = next(action);
    
    // Persist state to localStorage after each action
    if (typeof window !== "undefined") {
      const state = store.getState();
      try {
        // Create a serializable copy of state, excluding File objects
        const serializableState = {
          ...state,
          upload: {
            ...state.upload,
            uploads: state.upload.uploads.map((upload: any) => ({
              ...upload,
              file: null, // Exclude File objects from serialization
            })),
          },
        };
        localStorage.setItem("redux-state", JSON.stringify(serializableState));
      } catch (error) {
        console.error("Error persisting state to localStorage:", error);
      }
    }
    
    return result;
  };

