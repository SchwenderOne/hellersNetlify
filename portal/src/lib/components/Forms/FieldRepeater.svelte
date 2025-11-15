<script lang="ts">
  import FieldText from './FieldText.svelte';
  import FieldTextarea from './FieldTextarea.svelte';

  interface SubField {
    name: string;
    label: string;
    type: 'text' | 'textarea';
    placeholder?: string;
  }

  interface Props {
    label: string;
    value: Record<string, any>[];
    onchange: (value: Record<string, any>[]) => void;
    subFields: SubField[];
    itemLabel?: string; // e.g., "Step", "Ingredient"
    required?: boolean;
    error?: string;
    disabled?: boolean;
  }

  let {
    label,
    value = $bindable([]),
    onchange,
    subFields,
    itemLabel = 'Item',
    required = false,
    error,
    disabled = false
  }: Props = $props();

  let expandedItems = $state<Set<number>>(new Set([0]));

  function addItem() {
    const newItem: Record<string, any> = {};
    subFields.forEach(field => {
      newItem[field.name] = '';
    });

    value = [...value, newItem];
    expandedItems.add(value.length - 1);
    onchange(value);
  }

  function removeItem(index: number) {
    value = value.filter((_, i) => i !== index);
    expandedItems.delete(index);
    onchange(value);
  }

  function updateItemField(index: number, fieldName: string, fieldValue: any) {
    value = value.map((item, i) =>
      i === index ? { ...item, [fieldName]: fieldValue } : item
    );
    onchange(value);
  }

  function toggleExpand(index: number) {
    if (expandedItems.has(index)) {
      expandedItems.delete(index);
    } else {
      expandedItems.add(index);
    }
    expandedItems = new Set(expandedItems);
  }

  function getItemPreview(item: Record<string, any>): string {
    const firstField = subFields[0];
    const value = item[firstField.name];
    return value ? String(value).substring(0, 50) : 'Leer';
  }
</script>

<div class="mb-4">
  <div class="flex items-center justify-between mb-3">
    <label class="block text-sm font-medium text-primary">
      {label}
      {#if required}
        <span class="text-error">*</span>
      {/if}
    </label>

    {#if !disabled}
      <button
        type="button"
        onclick={addItem}
        class="btn btn-primary text-sm py-1 px-3"
      >
        + {itemLabel} hinzufügen
      </button>
    {/if}
  </div>

  <div class="space-y-2">
    {#each value as item, index (index)}
      <div class="border border-gray-300 rounded-lg bg-surface">
        <!-- Item Header -->
        <div
          class="flex items-center justify-between p-3 cursor-pointer hover:bg-gray-50"
          onclick={() => toggleExpand(index)}
        >
          <div class="flex items-center gap-3 flex-1">
            <span class="text-gray-400">
              <svg class="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                <path d="M10 6a2 2 0 110-4 2 2 0 010 4zM10 12a2 2 0 110-4 2 2 0 010 4zM10 18a2 2 0 110-4 2 2 0 010 4z" />
              </svg>
            </span>
            <span class="font-medium text-primary">
              {itemLabel} {index + 1}
            </span>
            {#if !expandedItems.has(index)}
              <span class="text-sm text-primary-light truncate">
                - {getItemPreview(item)}
              </span>
            {/if}
          </div>

          <div class="flex items-center gap-2">
            {#if !disabled}
              <button
                type="button"
                onclick={(e) => {
                  e.stopPropagation();
                  removeItem(index);
                }}
                class="text-error hover:text-red-700 p-1"
                aria-label={`${itemLabel} entfernen`}
              >
                <svg class="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                  <path
                    fill-rule="evenodd"
                    d="M9 2a1 1 0 00-.894.553L7.382 4H4a1 1 0 000 2v10a2 2 0 002 2h8a2 2 0 002-2V6a1 1 0 100-2h-3.382l-.724-1.447A1 1 0 0011 2H9zM7 8a1 1 0 012 0v6a1 1 0 11-2 0V8zm5-1a1 1 0 00-1 1v6a1 1 0 102 0V8a1 1 0 00-1-1z"
                    clip-rule="evenodd"
                  />
                </svg>
              </button>
            {/if}

            <svg
              class="w-5 h-5 text-primary-light transition-transform"
              class:rotate-180={expandedItems.has(index)}
              fill="currentColor"
              viewBox="0 0 20 20"
            >
              <path
                fill-rule="evenodd"
                d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z"
                clip-rule="evenodd"
              />
            </svg>
          </div>
        </div>

        <!-- Item Content -->
        {#if expandedItems.has(index)}
          <div class="px-4 pb-4 border-t border-gray-200">
            {#each subFields as field}
              {#if field.type === 'text'}
                <FieldText
                  label={field.label}
                  value={item[field.name] || ''}
                  onchange={(val) => updateItemField(index, field.name, val)}
                  placeholder={field.placeholder}
                  disabled={disabled}
                />
              {:else if field.type === 'textarea'}
                <FieldTextarea
                  label={field.label}
                  value={item[field.name] || ''}
                  onchange={(val) => updateItemField(index, field.name, val)}
                  placeholder={field.placeholder}
                  disabled={disabled}
                />
              {/if}
            {/each}
          </div>
        {/if}
      </div>
    {/each}
  </div>

  {#if value.length === 0}
    <div class="text-center py-8 border-2 border-dashed border-gray-300 rounded-lg">
      <p class="text-primary-light mb-3">Noch keine {label} hinzugefügt</p>
      {#if !disabled}
        <button
          type="button"
          onclick={addItem}
          class="btn btn-secondary"
        >
          Ersten {itemLabel} hinzufügen
        </button>
      {/if}
    </div>
  {/if}

  {#if error}
    <p class="text-error text-sm mt-1">{error}</p>
  {/if}
</div>

<style>
  .rotate-180 {
    transform: rotate(180deg);
  }
</style>
