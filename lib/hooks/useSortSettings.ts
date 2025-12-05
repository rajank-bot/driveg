import { useAppSelector, useAppDispatch } from "../hooks";
import {
  setSortBy,
  setSortDirection,
  setFoldersPosition,
  setSortOptions,
  resetSort,
  type SortableView,
  type SortByOption,
  type SortDirection,
  type FoldersPosition,
  type ViewSortSettings,
} from "../store/slices/sortSlice";

/**
 * Custom hook to manage sort settings for a specific view
 * Each view (My Drive, Shared with me, Starred, Trash) has independent sort settings
 * 
 * @param view - The view to get/set sort settings for
 * @returns Object with current sort settings and functions to update them
 * 
 * @example
 * ```tsx
 * function MyDrivePage() {
 *   const { sortBy, sortDirection, foldersPosition, setSortBy, setSortDirection } = useSortSettings('my-drive');
 *   
 *   return (
 *     <SortPanel
 *       sortBy={sortBy}
 *       onSortByChange={(value) => setSortBy(value)}
 *     />
 *   );
 * }
 * ```
 */
export function useSortSettings(view: SortableView) {
  const dispatch = useAppDispatch();

  // Get current sort settings for this view
  const sortSettings = useAppSelector(
    (state: any) => state.sort.views[view]
  ) || {
    sortBy: "name" as SortByOption,
    sortDirection: "zToA" as SortDirection,
    foldersPosition: "mixedWithFiles" as FoldersPosition,
  };

  // Helper functions to update sort settings
  const updateSortBy = (sortBy: SortByOption) => {
    dispatch(setSortBy({ view, sortBy }));
  };

  const updateSortDirection = (sortDirection: SortDirection) => {
    dispatch(setSortDirection({ view, sortDirection }));
  };

  const updateFoldersPosition = (foldersPosition: FoldersPosition) => {
    dispatch(setFoldersPosition({ view, foldersPosition }));
  };

  const updateSortOptions = (options: Partial<ViewSortSettings>) => {
    dispatch(setSortOptions({ view, options }));
  };

  const reset = () => {
    dispatch(resetSort(view));
  };

  return {
    // Current sort settings
    sortBy: sortSettings.sortBy,
    sortDirection: sortSettings.sortDirection,
    foldersPosition: sortSettings.foldersPosition,
    // All settings together
    sortSettings,
    // Update functions
    setSortBy: updateSortBy,
    setSortDirection: updateSortDirection,
    setFoldersPosition: updateFoldersPosition,
    setSortOptions: updateSortOptions,
    resetSort: reset,
  };
}

