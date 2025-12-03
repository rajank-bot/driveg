/**
 * File Storage Utility for IndexedDB
 * Handles storing and retrieving file data locally
 */

const DB_NAME = "driveg-files";
const DB_VERSION = 1;
const STORE_NAME = "files";

interface FileData {
  id: string;
  file: Blob;
  mimeType: string;
  size: number;
  uploadedAt: string;
}

let db: IDBDatabase | null = null;

/**
 * Initialize IndexedDB database
 */
export const initFileStorage = (): Promise<IDBDatabase> => {
  return new Promise((resolve, reject) => {
    if (typeof window === "undefined" || !window.indexedDB) {
      reject(new Error("IndexedDB is not available"));
      return;
    }

    if (db) {
      resolve(db);
      return;
    }

    const request = indexedDB.open(DB_NAME, DB_VERSION);

    request.onerror = () => {
      reject(new Error("Failed to open IndexedDB"));
    };

    request.onsuccess = () => {
      db = request.result;
      resolve(db);
    };

    request.onupgradeneeded = (event) => {
      const database = (event.target as IDBOpenDBRequest).result;
      if (!database.objectStoreNames.contains(STORE_NAME)) {
        const objectStore = database.createObjectStore(STORE_NAME, {
          keyPath: "id",
        });
        objectStore.createIndex("uploadedAt", "uploadedAt", { unique: false });
      }
    };
  });
};

/**
 * Store a file in IndexedDB
 */
export const storeFile = async (
  fileId: string,
  file: File | Blob,
  mimeType: string
): Promise<void> => {
  const database = await initFileStorage();

  return new Promise((resolve, reject) => {
    const transaction = database.transaction([STORE_NAME], "readwrite");
    const store = transaction.objectStore(STORE_NAME);

    const fileData: FileData = {
      id: fileId,
      file: file instanceof File ? file : file,
      mimeType,
      size: file.size,
      uploadedAt: new Date().toISOString(),
    };

    const request = store.put(fileData);

    request.onsuccess = () => {
      resolve();
    };

    request.onerror = () => {
      reject(new Error("Failed to store file"));
    };
  });
};

/**
 * Retrieve a file from IndexedDB
 */
export const getFile = async (fileId: string): Promise<Blob | null> => {
  const database = await initFileStorage();

  return new Promise((resolve, reject) => {
    const transaction = database.transaction([STORE_NAME], "readonly");
    const store = transaction.objectStore(STORE_NAME);
    const request = store.get(fileId);

    request.onsuccess = () => {
      const result = request.result;
      if (result) {
        resolve(result.file);
      } else {
        resolve(null);
      }
    };

    request.onerror = () => {
      reject(new Error("Failed to retrieve file"));
    };
  });
};

/**
 * Get file as a URL (for preview/download)
 */
export const getFileUrl = async (fileId: string): Promise<string | null> => {
  try {
    const blob = await getFile(fileId);
    if (blob) {
      return URL.createObjectURL(blob);
    }
    return null;
  } catch (error) {
    console.error("Error creating file URL:", error);
    return null;
  }
};

/**
 * Delete a file from IndexedDB
 */
export const deleteFile = async (fileId: string): Promise<void> => {
  const database = await initFileStorage();

  return new Promise((resolve, reject) => {
    const transaction = database.transaction([STORE_NAME], "readwrite");
    const store = transaction.objectStore(STORE_NAME);
    const request = store.delete(fileId);

    request.onsuccess = () => {
      resolve();
    };

    request.onerror = () => {
      reject(new Error("Failed to delete file"));
    };
  });
};

/**
 * Delete multiple files from IndexedDB
 */
export const deleteFiles = async (fileIds: string[]): Promise<void> => {
  const database = await initFileStorage();

  return new Promise((resolve, reject) => {
    const transaction = database.transaction([STORE_NAME], "readwrite");
    const store = transaction.objectStore(STORE_NAME);

    let completed = 0;
    let hasError = false;

    if (fileIds.length === 0) {
      resolve();
      return;
    }

    fileIds.forEach((fileId) => {
      const request = store.delete(fileId);

      request.onsuccess = () => {
        completed++;
        if (completed === fileIds.length && !hasError) {
          resolve();
        }
      };

      request.onerror = () => {
        hasError = true;
        reject(new Error("Failed to delete files"));
      };
    });
  });
};

/**
 * Get storage usage (total size of all stored files)
 */
export const getStorageUsage = async (): Promise<number> => {
  const database = await initFileStorage();

  return new Promise((resolve, reject) => {
    const transaction = database.transaction([STORE_NAME], "readonly");
    const store = transaction.objectStore(STORE_NAME);
    const request = store.getAll();

    request.onsuccess = () => {
      const files = request.result as FileData[];
      const totalSize = files.reduce((sum, file) => sum + file.size, 0);
      resolve(totalSize);
    };

    request.onerror = () => {
      reject(new Error("Failed to get storage usage"));
    };
  });
};

/**
 * Clear all stored files
 */
export const clearAllFiles = async (): Promise<void> => {
  const database = await initFileStorage();

  return new Promise((resolve, reject) => {
    const transaction = database.transaction([STORE_NAME], "readwrite");
    const store = transaction.objectStore(STORE_NAME);
    const request = store.clear();

    request.onsuccess = () => {
      resolve();
    };

    request.onerror = () => {
      reject(new Error("Failed to clear files"));
    };
  });
};

