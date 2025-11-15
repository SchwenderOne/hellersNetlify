<script lang="ts">
  import { contentStore, totalEntryCount } from '$lib/stores/content';
  import { uiStore } from '$lib/stores/ui';
  import { contentTypes } from '$lib/schemas/contentTypes';
  import { loadFromStorage } from '$lib/utils/storage';
  import { exportAsJSON, exportAsCSV, copyJSONToClipboard } from '$lib/utils/export';

  interface Props {
    show: boolean;
    onClose: () => void;
  }

  let { show, onClose }: Props = $props();

  let selectedTypes = $state<Set<string>>(new Set());
  let exportFormat = $state<'json' | 'csv'>('json');

  // Toggle all content types
  function toggleAll() {
    if (selectedTypes.size === Object.keys(contentTypes).length) {
      selectedTypes = new Set();
    } else {
      selectedTypes = new Set(Object.keys(contentTypes));
    }
  }

  // Toggle individual content type
  function toggleType(typeId: string) {
    if (selectedTypes.has(typeId)) {
      selectedTypes.delete(typeId);
    } else {
      selectedTypes.add(typeId);
    }
    selectedTypes = new Set(selectedTypes);
  }

  // Handle export
  function handleExport() {
    const data = loadFromStorage();

    if (exportFormat === 'json') {
      // Filter data to only include selected types
      if (selectedTypes.size > 0 && selectedTypes.size < Object.keys(contentTypes).length) {
        const filteredEntries: Record<string, any> = {};
        selectedTypes.forEach(typeId => {
          if (data.entries[typeId]) {
            filteredEntries[typeId] = data.entries[typeId];
          }
        });
        const filteredData = {
          ...data,
          entries: filteredEntries,
        };
        exportAsJSON(filteredData);
      } else {
        exportAsJSON(data);
      }

      uiStore.notify('success', 'JSON-Export erfolgreich heruntergeladen.');
    } else if (exportFormat === 'csv') {
      // Export each selected type as separate CSV
      let exported = 0;
      selectedTypes.forEach(typeId => {
        const entries = contentStore.getEntriesByType(typeId);
        if (entries.length > 0) {
          exportAsCSV(typeId, entries);
          exported++;
        }
      });

      if (exported > 0) {
        uiStore.notify('success', `${exported} CSV-Datei(en) erfolgreich heruntergeladen.`);
      } else {
        uiStore.notify('warning', 'Keine Einträge zum Exportieren vorhanden.');
      }
    }

    onClose();
  }

  // Copy JSON to clipboard
  async function handleCopyJSON() {
    const data = loadFromStorage();
    const success = await copyJSONToClipboard(data);

    if (success) {
      uiStore.notify('success', 'JSON in Zwischenablage kopiert.');
    } else {
      uiStore.notify('error', 'Fehler beim Kopieren in die Zwischenablage.');
    }
  }
</script>

{#if show}
  <div
    class="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50"
    onclick={onClose}
    role="dialog"
    aria-modal="true"
  >
    <div
      class="card max-w-2xl w-full mx-4 max-h-[90vh] overflow-y-auto"
      onclick={(e) => e.stopPropagation()}
      role="document"
    >
      <div class="flex items-center justify-between mb-6">
        <h2 class="text-2xl font-semibold text-primary">
          Daten exportieren
        </h2>
        <button
          onclick={onClose}
          class="text-primary-light hover:text-primary"
          aria-label="Schließen"
        >
          <svg class="w-6 h-6" fill="currentColor" viewBox="0 0 20 20">
            <path
              fill-rule="evenodd"
              d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z"
              clip-rule="evenodd"
            />
          </svg>
        </button>
      </div>

      <div class="mb-6">
        <p class="text-primary-light mb-4">
          Exportieren Sie Ihre Inhalte zur Sicherung oder Integration in die Website.
        </p>

        <div class="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-4">
          <p class="text-sm text-primary">
            <strong>Gesamt Einträge:</strong> {$totalEntryCount}
          </p>
        </div>
      </div>

      <!-- Export Format -->
      <div class="mb-6">
        <label class="block text-sm font-medium text-primary mb-3">
          Export-Format
        </label>
        <div class="flex gap-4">
          <label class="flex items-center gap-2 cursor-pointer">
            <input
              type="radio"
              bind:group={exportFormat}
              value="json"
              class="w-4 h-4 text-accent focus:ring-accent"
            />
            <span class="text-sm">JSON (Alle Daten)</span>
          </label>
          <label class="flex items-center gap-2 cursor-pointer">
            <input
              type="radio"
              bind:group={exportFormat}
              value="csv"
              class="w-4 h-4 text-accent focus:ring-accent"
            />
            <span class="text-sm">CSV (Separate Dateien)</span>
          </label>
        </div>
      </div>

      <!-- Content Type Selection -->
      <div class="mb-6">
        <div class="flex items-center justify-between mb-3">
          <label class="block text-sm font-medium text-primary">
            Inhaltstypen auswählen
          </label>
          <button
            onclick={toggleAll}
            class="text-sm text-accent hover:text-accent-dark"
          >
            {selectedTypes.size === Object.keys(contentTypes).length ? 'Alle abwählen' : 'Alle auswählen'}
          </button>
        </div>

        <div class="space-y-2 border border-gray-200 rounded-lg p-4 max-h-60 overflow-y-auto">
          {#each Object.values(contentTypes) as type (type.id)}
            {@const entries = contentStore.getEntriesByType(type.id)}
            <label class="flex items-center gap-3 cursor-pointer hover:bg-gray-50 p-2 rounded">
              <input
                type="checkbox"
                checked={selectedTypes.has(type.id)}
                onchange={() => toggleType(type.id)}
                class="w-4 h-4 rounded border-gray-300 text-accent focus:ring-accent"
              />
              <span class="text-2xl">{type.icon}</span>
              <span class="flex-1 text-sm">{type.label}</span>
              <span class="text-xs text-primary-light">
                ({entries.length} {entries.length === 1 ? 'Eintrag' : 'Einträge'})
              </span>
            </label>
          {/each}
        </div>
      </div>

      <!-- Actions -->
      <div class="flex items-center justify-between pt-4 border-t border-gray-200">
        <button
          onclick={handleCopyJSON}
          class="btn btn-secondary text-sm"
        >
          <svg class="w-4 h-4 inline mr-1" fill="currentColor" viewBox="0 0 20 20">
            <path d="M8 3a1 1 0 011-1h2a1 1 0 110 2H9a1 1 0 01-1-1z" />
            <path d="M6 3a2 2 0 00-2 2v11a2 2 0 002 2h8a2 2 0 002-2V5a2 2 0 00-2-2 3 3 0 01-3 3H9a3 3 0 01-3-3z" />
          </svg>
          JSON kopieren
        </button>

        <div class="flex gap-3">
          <button
            onclick={onClose}
            class="btn btn-secondary"
          >
            Abbrechen
          </button>
          <button
            onclick={handleExport}
            class="btn btn-primary"
            disabled={selectedTypes.size === 0}
          >
            <svg class="w-4 h-4 inline mr-1" fill="currentColor" viewBox="0 0 20 20">
              <path
                fill-rule="evenodd"
                d="M3 17a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zm3.293-7.707a1 1 0 011.414 0L9 10.586V3a1 1 0 112 0v7.586l1.293-1.293a1 1 0 111.414 1.414l-3 3a1 1 0 01-1.414 0l-3-3a1 1 0 010-1.414z"
                clip-rule="evenodd"
              />
            </svg>
            Exportieren
          </button>
        </div>
      </div>
    </div>
  </div>
{/if}
