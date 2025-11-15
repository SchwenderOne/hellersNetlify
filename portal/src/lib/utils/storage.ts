import type { ContentEntry } from '$lib/schemas/contentTypes';

const STORAGE_KEY = 'hellers_portal_content';
const STORAGE_VERSION = '1.0';

export interface StorageData {
  version: string;
  lastUpdated: string;
  entries: Record<string, ContentEntry[]>;
}

/**
 * Initialize storage with default structure
 */
function initializeStorage(): StorageData {
  return {
    version: STORAGE_VERSION,
    lastUpdated: new Date().toISOString(),
    entries: {},
  };
}

/**
 * Get all data from LocalStorage
 */
export function loadFromStorage(): StorageData {
  if (typeof window === 'undefined') {
    return initializeStorage();
  }

  try {
    const stored = localStorage.getItem(STORAGE_KEY);
    if (!stored) {
      return initializeStorage();
    }

    const data = JSON.parse(stored) as StorageData;

    // Version check - could implement migration logic here
    if (data.version !== STORAGE_VERSION) {
      console.warn('Storage version mismatch, reinitializing...');
      return initializeStorage();
    }

    return data;
  } catch (error) {
    console.error('Error loading from storage:', error);
    return initializeStorage();
  }
}

/**
 * Save all data to LocalStorage
 */
export function saveToStorage(data: StorageData): void {
  if (typeof window === 'undefined') {
    return;
  }

  try {
    data.lastUpdated = new Date().toISOString();
    localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
  } catch (error) {
    console.error('Error saving to storage:', error);
    // Handle quota exceeded errors
    if (error instanceof DOMException && error.name === 'QuotaExceededError') {
      alert('Storage quota exceeded. Please export your data and clear some entries.');
    }
  }
}

/**
 * Get all entries for a specific content type
 */
export function getEntriesByType(type: string): ContentEntry[] {
  const data = loadFromStorage();
  return data.entries[type] || [];
}

/**
 * Get a single entry by ID and type
 */
export function getEntryById(type: string, id: string): ContentEntry | null {
  const entries = getEntriesByType(type);
  return entries.find(entry => entry.id === id) || null;
}

/**
 * Save a new entry
 */
export function saveEntry(entry: ContentEntry): void {
  const data = loadFromStorage();

  if (!data.entries[entry.type]) {
    data.entries[entry.type] = [];
  }

  // Check if entry already exists (update)
  const existingIndex = data.entries[entry.type].findIndex(e => e.id === entry.id);

  if (existingIndex >= 0) {
    data.entries[entry.type][existingIndex] = entry;
  } else {
    data.entries[entry.type].push(entry);
  }

  saveToStorage(data);
}

/**
 * Delete an entry
 */
export function deleteEntry(type: string, id: string): void {
  const data = loadFromStorage();

  if (!data.entries[type]) {
    return;
  }

  data.entries[type] = data.entries[type].filter(entry => entry.id !== id);
  saveToStorage(data);
}

/**
 * Delete all entries of a specific type
 */
export function deleteEntriesByType(type: string): void {
  const data = loadFromStorage();
  delete data.entries[type];
  saveToStorage(data);
}

/**
 * Clear all data from storage
 */
export function clearStorage(): void {
  if (typeof window === 'undefined') {
    return;
  }

  localStorage.removeItem(STORAGE_KEY);
}

/**
 * Get total entry count across all types
 */
export function getTotalEntryCount(): number {
  const data = loadFromStorage();
  return Object.values(data.entries).reduce((total, entries) => total + entries.length, 0);
}

/**
 * Get entry count for a specific type
 */
export function getEntryCountByType(type: string): number {
  return getEntriesByType(type).length;
}

/**
 * Export all data as JSON
 */
export function exportAsJSON(): string {
  const data = loadFromStorage();
  return JSON.stringify(data, null, 2);
}

/**
 * Import data from JSON
 */
export function importFromJSON(jsonString: string): boolean {
  try {
    const data = JSON.parse(jsonString) as StorageData;

    // Basic validation
    if (!data.version || !data.entries) {
      throw new Error('Invalid data structure');
    }

    saveToStorage(data);
    return true;
  } catch (error) {
    console.error('Error importing data:', error);
    return false;
  }
}
