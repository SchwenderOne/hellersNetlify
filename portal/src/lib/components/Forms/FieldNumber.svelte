<script lang="ts">
  interface Props {
    label: string;
    value: number;
    onchange: (value: number) => void;
    required?: boolean;
    error?: string;
    placeholder?: string;
    min?: number;
    max?: number;
    step?: number;
    disabled?: boolean;
  }

  let {
    label,
    value = $bindable(0),
    onchange,
    required = false,
    error,
    placeholder = '',
    min,
    max,
    step = 1,
    disabled = false
  }: Props = $props();

  function handleInput(event: Event) {
    const target = event.target as HTMLInputElement;
    const numValue = parseFloat(target.value);
    value = isNaN(numValue) ? 0 : numValue;
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
    type="number"
    value={value}
    oninput={handleInput}
    {placeholder}
    {disabled}
    {min}
    {max}
    {step}
    class="input-field"
    class:border-error={error}
  />

  {#if error}
    <p class="text-error text-sm mt-1">{error}</p>
  {/if}
</div>
