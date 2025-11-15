<script lang="ts">
  interface Props {
    label: string;
    value: string;
    onchange: (value: string) => void;
    required?: boolean;
    error?: string;
    placeholder?: string;
    maxLength?: number;
    rows?: number;
    disabled?: boolean;
  }

  let {
    label,
    value = $bindable(''),
    onchange,
    required = false,
    error,
    placeholder = '',
    maxLength,
    rows = 4,
    disabled = false
  }: Props = $props();

  function handleInput(event: Event) {
    const target = event.target as HTMLTextAreaElement;
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
    {#if maxLength}
      <span class="text-xs text-primary-light ml-2">
        ({value.length}/{maxLength})
      </span>
    {/if}
  </label>

  <textarea
    {value}
    oninput={handleInput}
    {placeholder}
    {disabled}
    {rows}
    maxlength={maxLength}
    class="input-field resize-y"
    class:border-error={error}
  ></textarea>

  {#if error}
    <p class="text-error text-sm mt-1">{error}</p>
  {/if}
</div>
