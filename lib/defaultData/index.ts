/**
 * Default data constants and initial values for DriveG
 */

// Re-export all default data
export { defaultUsers, getDefaultUser } from "./userData";
export { default as fileTypes } from "./fileTypes.json";
export { default as storagePlans } from "./storagePlans.json";
export { default as viewModes } from "./viewModes.json";
export { default as sortOptions } from "./sortOptions.json";
export { default as permissions } from "./permissions.json";
export { default as sampleFiles } from "./sampleFiles.json";

// Default constants
export const DEFAULT_STORAGE_LIMIT = 15728640; // 15 GB in bytes
export const DEFAULT_VIEW_MODE = "grid";
export const DEFAULT_SORT_BY = "modified";
export const DEFAULT_SORT_ORDER = "desc";
