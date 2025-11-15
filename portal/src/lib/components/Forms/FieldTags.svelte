<script lang="ts">
  interface Props {
    label: string;
    value: string[];
    onchange: (value: string[]) => void;
    required?: boolean;
    error?: string;
    placeholder?: string;
    disabled?: boolean;
  }

  let {
    label,
    value = $bindable([]),
    onchange,
    required = false,
    error,
    placeholder = 'Tag hinzufügen und Enter drücken...',
    disabled = false
  }: Props = $props();

  let inputValue = $state('');

  function addTag() {
    const trimmedValue = inputValue.trim();

    if (trimmedValue && !value.includes(trimmedValue)) {
      value = [...value, trimmedValue];
      onchange(value);
      inputValue = '';
    }
  }

  function removeTag(index: number) {
    value = value.filter((_, i) => i !== index);
    onchange(value);
  }

  function handleKeydown(event: KeyboardEvent) {
    if (event.key === 'Enter') {
      event.preventDefault();
      addTag();
    } else if (event.key === 'Backspace' && inputValue === '' && value.length > 0) {
      removeTag(value.length - 1);
    }
  }
</script>

<div class="mb-4">
  <label class="block text-sm font-medium text-primary mb-2">
    {label}
    {#if required}
      <span class="text-error">*</span>
    {/if}
  </label>

  <div class="border rounded-lg p-2 bg-surface" class:border-error={error}>
    <div class="flex flex-wrap gap-2 mb-2">
      {#each value as tag, index (tag)}
        <span
          class="inline-flex items-center gap-1 px-3 py-1 bg-accent text-white rounded-full text-sm"
        >
          {tag}
          {#if !disabled}
            <button
              type="button"
              onclick={() => removeTag(index)}
              class="hover:text-error transition-colors"
              aria-label="Tag entfernen"
            >
              <svg class="w-3 h-3" fill="currentColor" viewBox="0 0 20 20">
                <path
                  fill-rule="evenodd"
                  d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z"
                  clip-rule="evenodd"
                />
              </svg>
            </button>
          {/if}
        </span>
      {/each}
    </div>

    {#if !disabled}
      <input
        type="text"
        bind:value={inputValue}
        onkeydown={handleKeydown}
        {placeholder}
        class="w-full px-2 py-1 border-0 focus:outline-none focus:ring-0"
      />
    {/if}
  </div>

  {#if error}
    <p class="text-error text-sm mt-1">{error}</p>
  {/if}
</div>
