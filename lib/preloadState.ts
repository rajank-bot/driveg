import type { RootState } from "./store";

/**
 * Preloads initial state from localStorage or other sources
 * This is useful for SSR or initial client-side hydration
 */
export const preloadState = (): Partial<RootState> | undefined => {
  if (typeof window === "undefined") {
    return undefined;
  }

  try {
    const savedState = localStorage.getItem("redux-state");
    if (savedState) {
      return JSON.parse(savedState) as Partial<RootState>;
    }
  } catch (error) {
    console.error("Error preloading state:", error);
  }

  return undefined;
};
