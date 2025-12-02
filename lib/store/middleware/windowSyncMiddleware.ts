import { Middleware } from "@reduxjs/toolkit";

export const windowSyncMiddleware: Middleware =
  (store) => (next) => (action: any) => {
    const result = next(action);
    
    // Sync state across browser tabs/windows using BroadcastChannel
    if (typeof window !== "undefined" && "BroadcastChannel" in window) {
      try {
        const channel = new BroadcastChannel("redux-sync");
        const state = store.getState();
        
        // Only sync non-internal actions
        if (action.type && !action.type.startsWith("@@")) {
          channel.postMessage({
            type: "SYNC_STATE",
            state,
            action: action.type,
          });
        }
        
        // Listen for state updates from other tabs
        channel.onmessage = (event) => {
          if (event.data.type === "SYNC_STATE" && event.data.action !== action.type) {
            // Handle state sync from other tabs if needed
            // This is a basic implementation - you may want to enhance it
          }
        };
      } catch (error) {
        console.error("Error syncing state across windows:", error);
      }
    }
    
    return result;
  };

