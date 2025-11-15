<script lang="ts">
  import type { ContentTypeConfig } from '$lib/schemas/contentTypes';

  interface Props {
    contentType: ContentTypeConfig;
    count: number;
    onclick?: () => void;
  }

  let { contentType, count, onclick }: Props = $props();
</script>

<button
  onclick={onclick}
  class="card card-hover w-full text-left transition-all duration-200 cursor-pointer border-2 border-transparent hover:border-accent"
>
  <div class="flex items-start justify-between">
    <div class="flex-1">
      <div class="flex items-center gap-3 mb-2">
        <span class="text-2xl" aria-hidden="true">{contentType.icon}</span>
        <h3 class="font-semibold text-primary">{contentType.label}</h3>
      </div>
      <p class="text-xs text-primary-light mb-3">
        {contentType.description}
      </p>
      <div class="flex items-center gap-2">
        <span class="inline-flex items-center justify-center px-3 py-1 rounded-full text-xs font-medium bg-accent text-white">
          {count} {count === 1 ? 'Eintrag' : 'Einträge'}
        </span>
      </div>
    </div>
  </div>
</button>
