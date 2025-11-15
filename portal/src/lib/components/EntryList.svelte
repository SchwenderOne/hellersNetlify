<script lang="ts">
  import { contentStore } from '$lib/stores/content';
  import { uiStore } from '$lib/stores/ui';
  import { contentTypes } from '$lib/schemas/contentTypes';
  import { formatDate, truncate } from '$lib/utils/helpers';
  import type { ContentEntry } from '$lib/schemas/contentTypes';

  interface Props {
    contentType: string;
  }

  let { contentType }: Props = $props();

  const typeConfig = contentTypes[contentType];
  let entries = $state<ContentEntry[]>([]);
  let searchQuery = $state('');
  let showDeleteConfirm = $state(false);
  let entryToDelete: string | null = null;

  // Load entries
  $effect(() => {
    entries = contentStore.getEntriesByType(contentType);
  });

  // Filtered entries based on search
  const filteredEntries = $derived(
    searchQuery
      ? entries.filter(entry => {
          const data = entry.data;
          const searchLower = searchQuery.toLowerCase();

          // Search in common fields
          const name = (data.name || data.title || '').toLowerCase();
          const description = (data.description || '').toLowerCase();

          return name.includes(searchLower) || description.includes(searchLower);
        })
      : entries
  );

  function handleCreate() {
    uiStore.showCreate(contentType);
  }

  function handleEdit(id: string) {
    uiStore.showEdit(contentType, id);
  }

  function handleDuplicate(id: string) {
    const duplicated = contentStore.duplicateEntry(contentType, id);
    if (duplicated) {
      uiStore.notify('success', 'Eintrag erfolgreich dupliziert.');
      // Reload entries to show the duplicate
      entries = contentStore.getEntriesByType(contentType);
    }
  }

  function confirmDelete(id: string) {
    entryToDelete = id;
    showDeleteConfirm = true;
  }

  function handleDelete() {
    if (entryToDelete) {
      contentStore.deleteEntry(contentType, entryToDelete);
      uiStore.notify('success', 'Eintrag erfolgreich gelöscht.');
      entryToDelete = null;
      showDeleteConfirm = false;

      // Reload entries
      entries = contentStore.getEntriesByType(contentType);
    }
  }

  function cancelDelete() {
    entryToDelete = null;
    showDeleteConfirm = false;
  }

  function getEntryTitle(entry: ContentEntry): string {
    return entry.data.title || entry.data.name || 'Unbenannt';
  }

  function getEntryDescription(entry: ContentEntry): string {
    return truncate(entry.data.description || '', 100);
  }

  function getEntryImage(entry: ContentEntry): string | null {
    return entry.data.image || entry.data.heroImage || entry.data.file || null;
  }
</script>

<div class="max-w-6xl">
  <div class="mb-6 flex items-center justify-between">
    <div>
      <h2 class="text-2xl font-semibold text-primary mb-2 flex items-center gap-3">
        <span class="text-3xl">{typeConfig.icon}</span>
        {typeConfig.label}
      </h2>
      <p class="text-primary-light">
        {filteredEntries.length} {filteredEntries.length === 1 ? 'Eintrag' : 'Einträge'}
      </p>
    </div>

    <button
      onclick={handleCreate}
      class="btn btn-primary flex items-center gap-2"
    >
      <svg class="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
        <path
          fill-rule="evenodd"
          d="M10 5a1 1 0 011 1v3h3a1 1 0 110 2h-3v3a1 1 0 11-2 0v-3H6a1 1 0 110-2h3V6a1 1 0 011-1z"
          clip-rule="evenodd"
        />
      </svg>
      Neu erstellen
    </button>
  </div>

  <!-- Search -->
  {#if entries.length > 0}
    <div class="mb-6">
      <input
        type="search"
        bind:value={searchQuery}
        placeholder="Einträge durchsuchen..."
        class="input-field max-w-md"
      />
    </div>
  {/if}

  <!-- Entry Cards -->
  {#if filteredEntries.length > 0}
    <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {#each filteredEntries as entry (entry.id)}
        <div class="card card-hover">
          {#if getEntryImage(entry)}
            <div class="mb-4 -mx-6 -mt-6">
              <img
                src={getEntryImage(entry)}
                alt={getEntryTitle(entry)}
                class="w-full h-48 object-cover rounded-t-card"
              />
            </div>
          {/if}

          <h3 class="font-semibold text-primary mb-2">
            {getEntryTitle(entry)}
          </h3>

          {#if entry.data.description}
            <p class="text-sm text-primary-light mb-4">
              {getEntryDescription(entry)}
            </p>
          {/if}

          <!-- Entry metadata -->
          <div class="text-xs text-primary-light mb-4 space-y-1">
            {#if entry.data.price}
              <p>Preis: €{entry.data.price}</p>
            {/if}
            {#if entry.data.date}
              <p>Datum: {formatDate(entry.data.date)}</p>
            {/if}
            <p>Erstellt: {formatDate(entry.createdAt)}</p>
          </div>

          <!-- Actions -->
          <div class="flex items-center gap-2 pt-4 border-t border-gray-200">
            <button
              onclick={() => handleEdit(entry.id)}
              class="flex-1 btn btn-secondary text-sm py-2"
            >
              <svg class="w-4 h-4 inline mr-1" fill="currentColor" viewBox="0 0 20 20">
                <path d="M13.586 3.586a2 2 0 112.828 2.828l-.793.793-2.828-2.828.793-.793zM11.379 5.793L3 14.172V17h2.828l8.38-8.379-2.83-2.828z" />
              </svg>
              Bearbeiten
            </button>
            <button
              onclick={() => handleDuplicate(entry.id)}
              class="btn btn-secondary text-sm py-2 px-3"
              aria-label="Duplizieren"
              title="Duplizieren"
            >
              <svg class="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                <path d="M8 3a1 1 0 011-1h2a1 1 0 110 2H9a1 1 0 01-1-1z" />
                <path d="M6 3a2 2 0 00-2 2v11a2 2 0 002 2h8a2 2 0 002-2V5a2 2 0 00-2-2 3 3 0 01-3 3H9a3 3 0 01-3-3z" />
              </svg>
            </button>
            <button
              onclick={() => confirmDelete(entry.id)}
              class="btn text-error hover:bg-red-50 text-sm py-2 px-3"
              aria-label="Löschen"
            >
              <svg class="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                <path
                  fill-rule="evenodd"
                  d="M9 2a1 1 0 00-.894.553L7.382 4H4a1 1 0 000 2v10a2 2 0 002 2h8a2 2 0 002-2V6a1 1 0 100-2h-3.382l-.724-1.447A1 1 0 0011 2H9zM7 8a1 1 0 012 0v6a1 1 0 11-2 0V8zm5-1a1 1 0 00-1 1v6a1 1 0 102 0V8a1 1 0 00-1-1z"
                  clip-rule="evenodd"
                />
              </svg>
            </button>
          </div>
        </div>
      {/each}
    </div>
  {:else if searchQuery}
    <div class="card text-center py-12">
      <p class="text-primary-light">
        Keine Einträge gefunden für "{searchQuery}"
      </p>
    </div>
  {:else}
    <div class="card text-center py-12">
      <p class="text-primary-light mb-4">
        Noch keine {typeConfig.label} erstellt.
      </p>
      <button
        onclick={handleCreate}
        class="btn btn-primary"
      >
        Ersten Eintrag erstellen
      </button>
    </div>
  {/if}
</div>

<!-- Delete Confirmation Modal -->
{#if showDeleteConfirm}
  <div
    class="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50"
    onclick={cancelDelete}
  >
    <div
      class="card max-w-md"
      onclick={(e) => e.stopPropagation()}
    >
      <h3 class="text-xl font-semibold text-primary mb-4">
        Eintrag löschen?
      </h3>
      <p class="text-primary-light mb-6">
        Möchten Sie diesen Eintrag wirklich löschen? Diese Aktion kann nicht rückgängig gemacht werden.
      </p>
      <div class="flex items-center gap-3">
        <button
          onclick={cancelDelete}
          class="flex-1 btn btn-secondary"
        >
          Abbrechen
        </button>
        <button
          onclick={handleDelete}
          class="flex-1 btn bg-error text-white hover:bg-red-600"
        >
          Löschen
        </button>
      </div>
    </div>
  </div>
{/if}
