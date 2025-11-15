<script lang="ts">
  import { contentTypes } from '$lib/schemas/contentTypes';
  import { entryCounts, totalEntryCount } from '$lib/stores/content';
  import { uiStore } from '$lib/stores/ui';
  import ContentTypeCard from './ContentType/ContentTypeCard.svelte';

  const contentTypeList = Object.values(contentTypes);
</script>

<div>
  <!-- Welcome Header -->
  <div class="mb-8">
    <h1 class="text-4xl font-semibold text-primary mb-3">
      Willkommen im Content Portal
    </h1>
    <p class="text-lg text-primary-light">
      Erstellen und verwalten Sie Inhalte für die Hellers Kaffees Website. Wählen Sie einen Inhaltstyp aus, um zu beginnen.
    </p>
  </div>

  <!-- Statistics Overview -->
  <div class="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
    <div class="card bg-gradient-to-br from-accent to-accent-dark text-white">
      <div class="flex items-center justify-between">
        <div>
          <p class="text-sm opacity-90 mb-1">Gesamt Einträge</p>
          <p class="text-4xl font-semibold">{$totalEntryCount}</p>
        </div>
        <svg class="w-12 h-12 opacity-80" fill="currentColor" viewBox="0 0 20 20">
          <path d="M9 2a1 1 0 000 2h2a1 1 0 100-2H9z" />
          <path fill-rule="evenodd" d="M4 5a2 2 0 012-2 3 3 0 003 3h2a3 3 0 003-3 2 2 0 012 2v11a2 2 0 01-2 2H6a2 2 0 01-2-2V5zm3 4a1 1 0 000 2h.01a1 1 0 100-2H7zm3 0a1 1 0 000 2h3a1 1 0 100-2h-3zm-3 4a1 1 0 100 2h.01a1 1 0 100-2H7zm3 0a1 1 0 100 2h3a1 1 0 100-2h-3z" clip-rule="evenodd" />
        </svg>
      </div>
    </div>

    <div class="card bg-gradient-to-br from-success to-green-600 text-white">
      <div class="flex items-center justify-between">
        <div>
          <p class="text-sm opacity-90 mb-1">Inhaltstypen</p>
          <p class="text-4xl font-semibold">{Object.keys(contentTypes).length}</p>
        </div>
        <svg class="w-12 h-12 opacity-80" fill="currentColor" viewBox="0 0 20 20">
          <path d="M7 3a1 1 0 000 2h6a1 1 0 100-2H7zM4 7a1 1 0 011-1h10a1 1 0 110 2H5a1 1 0 01-1-1zM2 11a2 2 0 012-2h12a2 2 0 012 2v4a2 2 0 01-2 2H4a2 2 0 01-2-2v-4z" />
        </svg>
      </div>
    </div>

    <div class="card bg-gradient-to-br from-blue-500 to-blue-700 text-white">
      <div class="flex items-center justify-between">
        <div>
          <p class="text-sm opacity-90 mb-1">Bereit zum Export</p>
          <p class="text-4xl font-semibold">{$totalEntryCount > 0 ? 'Ja' : 'Nein'}</p>
        </div>
        <svg class="w-12 h-12 opacity-80" fill="currentColor" viewBox="0 0 20 20">
          <path fill-rule="evenodd" d="M3 17a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zm3.293-7.707a1 1 0 011.414 0L9 10.586V3a1 1 0 112 0v7.586l1.293-1.293a1 1 0 111.414 1.414l-3 3a1 1 0 01-1.414 0l-3-3a1 1 0 010-1.414z" clip-rule="evenodd" />
        </svg>
      </div>
    </div>
  </div>

  <!-- Content Type Grid -->
  <div class="mb-8">
    <h2 class="text-2xl font-semibold text-primary mb-4">Inhaltstypen</h2>
    <p class="text-primary-light mb-6">
      Klicken Sie auf einen Inhaltstyp, um Einträge zu erstellen oder zu bearbeiten.
    </p>
  </div>

  <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
    {#each contentTypeList as contentType (contentType.id)}
      <ContentTypeCard
        {contentType}
        count={$entryCounts[contentType.id] || 0}
        onclick={() => uiStore.showList(contentType.id)}
      />
    {/each}
  </div>

  <!-- Quick Start Guide -->
  {#if $totalEntryCount === 0}
    <div class="mt-12 card bg-blue-50 border-2 border-blue-200">
      <h3 class="text-xl font-semibold text-primary mb-3 flex items-center gap-2">
        <svg class="w-6 h-6 text-blue-500" fill="currentColor" viewBox="0 0 20 20">
          <path fill-rule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clip-rule="evenodd" />
        </svg>
        Erste Schritte
      </h3>
      <ol class="space-y-2 text-primary-light">
        <li class="flex items-start gap-2">
          <span class="font-semibold text-blue-600">1.</span>
          <span>Wählen Sie einen Inhaltstyp aus der Liste oben aus</span>
        </li>
        <li class="flex items-start gap-2">
          <span class="font-semibold text-blue-600">2.</span>
          <span>Erstellen Sie so viele Einträge wie Sie benötigen</span>
        </li>
        <li class="flex items-start gap-2">
          <span class="font-semibold text-blue-600">3.</span>
          <span>Ihre Daten werden automatisch alle 30 Sekunden gespeichert</span>
        </li>
        <li class="flex items-start gap-2">
          <span class="font-semibold text-blue-600">4.</span>
          <span>Exportieren Sie alle Daten über die Schaltfläche "Exportieren" oben rechts</span>
        </li>
      </ol>
    </div>
  {/if}
</div>
