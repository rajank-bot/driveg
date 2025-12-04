"use client";

import { useRef, useEffect } from "react";
import { Provider } from "react-redux";
import { makeStore, AppStore } from "./store/index";
import { initializeWindowSync } from "./store/middleware/windowSyncMiddleware";
import { setUser } from "./store/slices/userSlice";
import { loadPersistedState } from "./store/middleware/localStorageSync";
import { setFiles } from "./store/slices/driveSlice";
import type { FileItem } from "./store/slices/driveSlice";

export default function StoreProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  const storeRef = useRef<AppStore>();
  
  if (!storeRef.current) {
    storeRef.current = makeStore();
    
    // Initialize default user if not already set (matches header: "TURING" with initial "S")
    const state = storeRef.current.getState() as any;
    if (!state.user.currentUser) {
      storeRef.current.dispatch(setUser({
        id: 'user-1',
        name: 'S Turing', // Name starts with "S" to match the initial in header
        email: 'turing@example.com',
        avatar: undefined,
        storageUsed: 0,
        storageLimit: 15000000000, // 15 GB
        plan: 'free',
      }));
    }
  }

  // Hydration component: Ensures state is restored even if preloadedState doesn't cover everything
  useEffect(() => {
    if (storeRef.current && typeof window !== "undefined") {
      try {
        // Load persisted state from localStorage
        const persistedState = loadPersistedState();
        
        if (persistedState?.drive?.files && Array.isArray(persistedState.drive.files)) {
          const currentState = storeRef.current.getState() as any;
          const currentFiles = currentState.drive.files || [];
          
          // Only restore if current state is empty (preloadState might have failed)
          if (currentFiles.length === 0 && persistedState.drive.files.length > 0) {
            console.log("[StoreProvider] Hydrating: Restoring", persistedState.drive.files.length, "files");
            storeRef.current.dispatch(setFiles(persistedState.drive.files as FileItem[]));
          }
        }
      } catch (error) {
        console.error("[StoreProvider] Failed to hydrate state:", error);
      }
      
      // Initialize window sync on client side
      initializeWindowSync(storeRef.current);
    }
  }, []);

  return <Provider store={storeRef.current}>{children}</Provider>;
}
