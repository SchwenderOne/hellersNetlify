<script lang="ts">
  import Header from '$lib/components/Layout/Header.svelte';
  import Sidebar from '$lib/components/Layout/Sidebar.svelte';
  import MainContent from '$lib/components/Layout/MainContent.svelte';
  import Dashboard from '$lib/components/Dashboard.svelte';
  import { uiStore } from '$lib/stores/ui';
</script>

<div class="h-screen flex flex-col">
  <Header />

  <div class="flex-1 flex overflow-hidden">
    <Sidebar />

    <MainContent>
      {#if $uiStore.currentView === 'dashboard'}
        <Dashboard />
      {:else if $uiStore.currentView === 'list'}
        <div class="card">
          <h2 class="text-2xl font-semibold mb-4">
            {$uiStore.currentContentType} - List View
          </h2>
          <p class="text-primary-light">
            List view will be implemented in Phase 2
          </p>
        </div>
      {:else if $uiStore.currentView === 'create'}
        <div class="card">
          <h2 class="text-2xl font-semibold mb-4">
            Create {$uiStore.currentContentType}
          </h2>
          <p class="text-primary-light">
            Create form will be implemented in Phase 2
          </p>
        </div>
      {:else if $uiStore.currentView === 'edit'}
        <div class="card">
          <h2 class="text-2xl font-semibold mb-4">
            Edit {$uiStore.currentContentType}
          </h2>
          <p class="text-primary-light">
            Edit form will be implemented in Phase 2
          </p>
        </div>
      {/if}
    </MainContent>
  </div>
</div>
