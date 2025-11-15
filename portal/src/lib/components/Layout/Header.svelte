<script lang="ts">
  import { uiStore } from '$lib/stores/ui';
  import { lastUpdated } from '$lib/stores/content';

  function formatLastUpdated(timestamp: string): string {
    if (!timestamp) return '';

    try {
      const date = new Date(timestamp);
      return date.toLocaleString('de-DE', {
        day: '2-digit',
        month: '2-digit',
        year: 'numeric',
        hour: '2-digit',
        minute: '2-digit'
      });
    } catch {
      return '';
    }
  }
</script>

<header class="bg-surface border-b border-gray-200 px-8 py-4">
  <div class="flex items-center justify-between">
    <div>
      <h1 class="text-2xl font-semibold text-primary">
        Hellers Kaffees Content Portal
      </h1>
      {#if $lastUpdated}
        <p class="text-sm text-primary-light mt-1">
          Zuletzt gespeichert: {formatLastUpdated($lastUpdated)}
        </p>
      {/if}
    </div>

    <div class="flex items-center gap-4">
      <button
        onclick={() => uiStore.openExportModal()}
        class="btn btn-secondary flex items-center gap-2"
      >
        <svg
          class="w-5 h-5"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            stroke-linecap="round"
            stroke-linejoin="round"
            stroke-width="2"
            d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4"
          />
        </svg>
        <span>Exportieren</span>
      </button>

      <button
        onclick={() => uiStore.showDashboard()}
        class="btn btn-primary flex items-center gap-2"
      >
        <svg
          class="w-5 h-5"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            stroke-linecap="round"
            stroke-linejoin="round"
            stroke-width="2"
            d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6"
          />
        </svg>
        <span>Dashboard</span>
      </button>
    </div>
  </div>
</header>
