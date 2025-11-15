<script lang="ts">
  import { contentTypes } from '$lib/schemas/contentTypes';
  import { entryCounts } from '$lib/stores/content';
  import { uiStore } from '$lib/stores/ui';
  import ContentTypeCard from '../ContentType/ContentTypeCard.svelte';

  const contentTypeList = Object.values(contentTypes);
</script>

<aside class="bg-surface border-r border-gray-200 w-80 p-6 overflow-y-auto">
  <div class="mb-6">
    <h2 class="text-lg font-semibold text-primary mb-2">Inhaltstypen</h2>
    <p class="text-sm text-primary-light">
      Wählen Sie einen Inhaltstyp aus, um Einträge zu verwalten.
    </p>
  </div>

  <div class="space-y-3">
    {#each contentTypeList as contentType (contentType.id)}
      <ContentTypeCard
        {contentType}
        count={$entryCounts[contentType.id] || 0}
        onclick={() => uiStore.showList(contentType.id)}
      />
    {/each}
  </div>

  <div class="mt-8 p-4 bg-background rounded-lg">
    <h3 class="text-sm font-semibold text-primary mb-2">Hilfe</h3>
    <p class="text-xs text-primary-light">
      Erstellen Sie beliebig viele Einträge für jeden Inhaltstyp. Ihre Daten werden automatisch alle 30 Sekunden gespeichert.
    </p>
  </div>
</aside>
