"use client";

import { useRef, useEffect } from "react";
import { Provider } from "react-redux";
import { makeStore, AppStore } from "./store/index";
import { initializeWindowSync } from "./store/middleware/windowSyncMiddleware";

export default function StoreProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  const storeRef = useRef<AppStore>();
  if (!storeRef.current) {
    storeRef.current = makeStore();
  }

  useEffect(() => {
    // Initialize window sync on client side
    if (typeof window !== "undefined" && storeRef.current) {
      initializeWindowSync(storeRef.current);
    }
  }, []);

  return <Provider store={storeRef.current}>{children}</Provider>;
}
