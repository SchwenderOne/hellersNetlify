<script lang="ts">
  interface Props {
    label: string;
    value: string;
    options: string[] | { value: string; label: string }[];
    onchange: (value: string) => void;
    required?: boolean;
    error?: string;
    placeholder?: string;
    disabled?: boolean;
  }

  let {
    label,
    value = $bindable(''),
    options,
    onchange,
    required = false,
    error,
    placeholder = 'Bitte wählen...',
    disabled = false
  }: Props = $props();

  // Normalize options to array of objects
  const normalizedOptions = $derived(
    options.map(opt =>
      typeof opt === 'string' ? { value: opt, label: opt } : opt
    )
  );

  function handleChange(event: Event) {
    const target = event.target as HTMLSelectElement;
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

  <select
    {value}
    onchange={handleChange}
    {disabled}
    class="input-field"
    class:border-error={error}
  >
    {#if placeholder}
      <option value="" disabled selected={!value}>
        {placeholder}
      </option>
    {/if}

    {#each normalizedOptions as option}
      <option value={option.value}>
        {option.label}
      </option>
    {/each}
  </select>

  {#if error}
    <p class="text-error text-sm mt-1">{error}</p>
  {/if}
</div>
