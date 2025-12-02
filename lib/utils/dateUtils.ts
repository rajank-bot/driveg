/**
 * Date utility functions for storage and formatting
 */

/**
 * Check if a date is valid
 */
export const isValidDate = (date: Date): boolean => {
  return date instanceof Date && !isNaN(date.getTime());
};

/**
 * Format date for storage to avoid timezone issues
 * Stores as ISO string but ensures consistency
 */
export const formatDateForStorage = (date: Date): string => {
  if (!isValidDate(date)) {
    throw new Error("Invalid date provided");
  }
  return date.toISOString();
};

/**
 * Parse date from storage
 */
export const parseDateFromStorage = (dateString: string | undefined): Date | undefined => {
  if (!dateString) {
    return undefined;
  }
  try {
    const date = new Date(dateString);
    return isValidDate(date) ? date : undefined;
  } catch {
    return undefined;
  }
};

