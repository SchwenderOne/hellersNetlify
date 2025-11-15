<script lang="ts">
  import Header from '$lib/components/Layout/Header.svelte';
  import Sidebar from '$lib/components/Layout/Sidebar.svelte';
  import MainContent from '$lib/components/Layout/MainContent.svelte';
  import Dashboard from '$lib/components/Dashboard.svelte';
  import EntryList from '$lib/components/EntryList.svelte';
  import DynamicForm from '$lib/components/Forms/DynamicForm.svelte';
  import { uiStore } from '$lib/stores/ui';

  function handleFormSave() {
    // After saving, show the list view
    if ($uiStore.currentContentType) {
      uiStore.showList($uiStore.currentContentType);
    }
  }

  function handleFormCancel() {
    // On cancel, go back to list view
    if ($uiStore.currentContentType) {
      uiStore.showList($uiStore.currentContentType);
    }
  }
</script>

<div class="h-screen flex flex-col">
  <Header />

  <div class="flex-1 flex overflow-hidden">
    <Sidebar />

    <MainContent>
      {#if $uiStore.currentView === 'dashboard'}
        <Dashboard />
      {:else if $uiStore.currentView === 'list' && $uiStore.currentContentType}
        <EntryList contentType={$uiStore.currentContentType} />
      {:else if $uiStore.currentView === 'create' && $uiStore.currentContentType}
        <DynamicForm
          contentType={$uiStore.currentContentType}
          onSave={handleFormSave}
          onCancel={handleFormCancel}
        />
      {:else if $uiStore.currentView === 'edit' && $uiStore.currentContentType && $uiStore.currentEntryId}
        <DynamicForm
          contentType={$uiStore.currentContentType}
          entryId={$uiStore.currentEntryId}
          onSave={handleFormSave}
          onCancel={handleFormCancel}
        />
      {/if}
    </MainContent>
  </div>
</div>
