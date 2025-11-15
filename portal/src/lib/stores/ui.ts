import { writable } from 'svelte/store';

// ========================================
// UI STATE STORE
// ========================================
interface UIState {
  currentView: 'dashboard' | 'list' | 'create' | 'edit' | 'export';
  currentContentType: string | null;
  currentEntryId: string | null;
  sidebarCollapsed: boolean;
  showExportModal: boolean;
  showDeleteConfirm: boolean;
  notifications: Notification[];
}

interface Notification {
  id: string;
  type: 'success' | 'error' | 'warning' | 'info';
  message: string;
  duration?: number;
}

const initialState: UIState = {
  currentView: 'dashboard',
  currentContentType: null,
  currentEntryId: null,
  sidebarCollapsed: false,
  showExportModal: false,
  showDeleteConfirm: false,
  notifications: [],
};

function createUIStore() {
  const { subscribe, set, update } = writable<UIState>(initialState);

  return {
    subscribe,

    /**
     * Navigate to dashboard
     */
    showDashboard: () => {
      update(state => ({
        ...state,
        currentView: 'dashboard',
        currentContentType: null,
        currentEntryId: null,
      }));
    },

    /**
     * Navigate to content type list
     */
    showList: (contentType: string) => {
      update(state => ({
        ...state,
        currentView: 'list',
        currentContentType: contentType,
        currentEntryId: null,
      }));
    },

    /**
     * Navigate to create form
     */
    showCreate: (contentType: string) => {
      update(state => ({
        ...state,
        currentView: 'create',
        currentContentType: contentType,
        currentEntryId: null,
      }));
    },

    /**
     * Navigate to edit form
     */
    showEdit: (contentType: string, entryId: string) => {
      update(state => ({
        ...state,
        currentView: 'edit',
        currentContentType: contentType,
        currentEntryId: entryId,
      }));
    },

    /**
     * Toggle sidebar
     */
    toggleSidebar: () => {
      update(state => ({
        ...state,
        sidebarCollapsed: !state.sidebarCollapsed,
      }));
    },

    /**
     * Show export modal
     */
    openExportModal: () => {
      update(state => ({
        ...state,
        showExportModal: true,
      }));
    },

    /**
     * Close export modal
     */
    closeExportModal: () => {
      update(state => ({
        ...state,
        showExportModal: false,
      }));
    },

    /**
     * Add a notification
     */
    notify: (type: Notification['type'], message: string, duration = 5000) => {
      const id = Date.now().toString();
      const notification: Notification = { id, type, message, duration };

      update(state => ({
        ...state,
        notifications: [...state.notifications, notification],
      }));

      // Auto-remove notification after duration
      if (duration > 0) {
        setTimeout(() => {
          update(state => ({
            ...state,
            notifications: state.notifications.filter(n => n.id !== id),
          }));
        }, duration);
      }
    },

    /**
     * Remove a notification
     */
    removeNotification: (id: string) => {
      update(state => ({
        ...state,
        notifications: state.notifications.filter(n => n.id !== id),
      }));
    },

    /**
     * Reset to initial state
     */
    reset: () => {
      set(initialState);
    },
  };
}

export const uiStore = createUIStore();
