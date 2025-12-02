import { Middleware } from "@reduxjs/toolkit";

export const localStorageSync: Middleware =
  (store) => (next) => (action: any) => {
    // Load state from localStorage on initialization
    if (typeof window !== "undefined" && action.type === "@@INIT") {
      try {
        const savedState = localStorage.getItem("redux-state");
        if (savedState) {
          const parsedState = JSON.parse(savedState);
          // Merge saved state with current state
          Object.keys(parsedState).forEach((key) => {
            if (parsedState[key]) {
              store.dispatch({
                type: `localStorage/REHYDRATE_${key}`,
                payload: parsedState[key],
              });
            }
          });
        }
      } catch (error) {
        console.error("Error loading state from localStorage:", error);
      }
    }
    
    return next(action);
  };

