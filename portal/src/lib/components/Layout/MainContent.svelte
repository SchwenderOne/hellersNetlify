<script lang="ts">
  import { uiStore } from '$lib/stores/ui';

  let { children } = $props();
</script>

<main class="flex-1 overflow-y-auto bg-background">
  <div class="max-w-7xl mx-auto p-8">
    <!-- Notification Area -->
    {#if $uiStore.notifications.length > 0}
      <div class="fixed top-20 right-8 z-50 space-y-2">
        {#each $uiStore.notifications as notification (notification.id)}
          <div
            class="card shadow-lg max-w-md animate-slide-in"
            class:bg-success={notification.type === 'success'}
            class:bg-error={notification.type === 'error'}
            class:bg-warning={notification.type === 'warning'}
            class:bg-blue-500={notification.type === 'info'}
            class:text-white={notification.type !== 'info'}
          >
            <div class="flex items-start justify-between gap-4">
              <p class="text-sm">{notification.message}</p>
              <button
                onclick={() => uiStore.removeNotification(notification.id)}
                class="text-white hover:text-gray-200"
                aria-label="Close notification"
              >
                <svg class="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                  <path
                    fill-rule="evenodd"
                    d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z"
                    clip-rule="evenodd"
                  />
                </svg>
              </button>
            </div>
          </div>
        {/each}
      </div>
    {/if}

    <!-- Main Content Slot -->
    {@render children()}
  </div>
</main>

<style>
  @keyframes slide-in {
    from {
      transform: translateX(100%);
      opacity: 0;
    }
    to {
      transform: translateX(0);
      opacity: 1;
    }
  }

  .animate-slide-in {
    animation: slide-in 0.3s ease-out;
  }
</style>
