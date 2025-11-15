import { writable, derived } from 'svelte/store';
import { v4 as uuidv4 } from 'uuid';
import type { ContentEntry } from '$lib/schemas/contentTypes';
import { contentTypes } from '$lib/schemas/contentTypes';
import {
  loadFromStorage,
  saveToStorage,
  saveEntry as saveEntryToStorage,
  deleteEntry as deleteEntryFromStorage,
  getEntriesByType,
  type StorageData,
} from '$lib/utils/storage';

// ========================================
// CONTENT STORE
// ========================================
function createContentStore() {
  const initialData = loadFromStorage();
  const { subscribe, set, update } = writable<StorageData>(initialData);

  // Auto-save timer
  let autoSaveTimeout: ReturnType<typeof setTimeout>;

  function scheduleAutoSave(data: StorageData) {
    clearTimeout(autoSaveTimeout);
    autoSaveTimeout = setTimeout(() => {
      saveToStorage(data);
    }, 30000); // Auto-save every 30 seconds
  }

  return {
    subscribe,

    /**
     * Create a new entry
     */
    createEntry: <T>(type: string, data: T): ContentEntry<T> => {
      const entry: ContentEntry<T> = {
        id: uuidv4(),
        type,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
        data,
      };

      update(state => {
        if (!state.entries[type]) {
          state.entries[type] = [];
        }
        state.entries[type].push(entry);
        scheduleAutoSave(state);
        return state;
      });

      // Immediate save for new entries
      saveEntryToStorage(entry);

      return entry;
    },

    /**
     * Update an existing entry
     */
    updateEntry: <T>(type: string, id: string, data: Partial<T>): void => {
      update(state => {
        if (!state.entries[type]) {
          return state;
        }

        const entryIndex = state.entries[type].findIndex(e => e.id === id);
        if (entryIndex >= 0) {
          const existingEntry = state.entries[type][entryIndex];
          state.entries[type][entryIndex] = {
            ...existingEntry,
            data: { ...existingEntry.data, ...data },
            updatedAt: new Date().toISOString(),
          };

          scheduleAutoSave(state);
        }

        return state;
      });
    },

    /**
     * Delete an entry
     */
    deleteEntry: (type: string, id: string): void => {
      update(state => {
        if (!state.entries[type]) {
          return state;
        }

        state.entries[type] = state.entries[type].filter(e => e.id !== id);
        return state;
      });

      deleteEntryFromStorage(type, id);
    },

    /**
     * Get all entries for a type
     */
    getEntriesByType: (type: string): ContentEntry[] => {
      return getEntriesByType(type);
    },

    /**
     * Reload from storage
     */
    reload: (): void => {
      set(loadFromStorage());
    },

    /**
     * Clear all data
     */
    clear: (): void => {
      const emptyData: StorageData = {
        version: '1.0',
        lastUpdated: new Date().toISOString(),
        entries: {},
      };
      set(emptyData);
      saveToStorage(emptyData);
    },

    /**
     * Force immediate save
     */
    save: (): void => {
      update(state => {
        saveToStorage(state);
        return state;
      });
    },
  };
}

export const contentStore = createContentStore();

// ========================================
// DERIVED STORES
// ========================================

/**
 * Get entry counts for all content types
 */
export const entryCounts = derived(contentStore, $content => {
  const counts: Record<string, number> = {};

  Object.keys(contentTypes).forEach(typeId => {
    counts[typeId] = $content.entries[typeId]?.length || 0;
  });

  return counts;
});

/**
 * Get total entry count across all types
 */
export const totalEntryCount = derived(contentStore, $content => {
  return Object.values($content.entries).reduce((total, entries) => total + entries.length, 0);
});

/**
 * Get last updated timestamp
 */
export const lastUpdated = derived(contentStore, $content => {
  return $content.lastUpdated;
});
