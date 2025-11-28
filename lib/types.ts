import type { RootState, AppDispatch, AppStore } from './store'

// Re-export store types for convenience
export type { RootState, AppDispatch, AppStore }

// Add any additional global types here
export interface AppThunkConfig {
  state: RootState
  dispatch: AppDispatch
  extra?: unknown
  rejectValue?: unknown
}

