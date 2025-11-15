<script lang="ts">
  import { formatDateForInput } from '$lib/utils/helpers';

  interface Props {
    label: string;
    value: string;
    onchange: (value: string) => void;
    required?: boolean;
    error?: string;
    min?: string;
    max?: string;
    disabled?: boolean;
  }

  let {
    label,
    value = $bindable(''),
    onchange,
    required = false,
    error,
    min,
    max,
    disabled = false
  }: Props = $props();

  // Format value for input if it's an ISO date
  const formattedValue = $derived(value ? formatDateForInput(value) : '');

  function handleChange(event: Event) {
    const target = event.target as HTMLInputElement;
    value = target.value;
    onchange(value);
  }
</script>

<div class="mb-4">
  <label class="block text-sm font-medium text-primary mb-2">
    {label}
    {#if required}
      <span class="text-error">*</span>
    {/if}
  </label>

  <input
    type="date"
    value={formattedValue}
    onchange={handleChange}
    {disabled}
    {min}
    {max}
    class="input-field"
    class:border-error={error}
  />

  {#if error}
    <p class="text-error text-sm mt-1">{error}</p>
  {/if}
</div>
