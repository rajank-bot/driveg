import { Middleware } from "@reduxjs/toolkit";
import type { RootState } from "../index";

export const persistenceMiddleware: Middleware<{}, RootState> =
  (store) => (next) => (action) => {
    const result = next(action);
    
    // Persist state to localStorage after each action
    if (typeof window !== "undefined") {
      const state = store.getState();
      try {
        localStorage.setItem("redux-state", JSON.stringify(state));
      } catch (error) {
        console.error("Error persisting state to localStorage:", error);
      }
    }
    
    return result;
  };

