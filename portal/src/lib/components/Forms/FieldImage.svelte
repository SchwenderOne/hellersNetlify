<script lang="ts">
  import imageCompression from 'browser-image-compression';

  interface Props {
    label: string;
    value: string;
    onchange: (value: string) => void;
    required?: boolean;
    error?: string;
    dimensions?: string; // e.g., "1200x800"
    disabled?: boolean;
  }

  let {
    label,
    value = $bindable(''),
    onchange,
    required = false,
    error,
    dimensions,
    disabled = false
  }: Props = $props();

  let uploading = $state(false);
  let dragActive = $state(false);
  let fileInput: HTMLInputElement;

  async function handleFile(file: File) {
    if (!file.type.startsWith('image/')) {
      alert('Bitte wählen Sie eine Bilddatei aus.');
      return;
    }

    uploading = true;

    try {
      // Compression options
      const options = {
        maxSizeMB: 1,
        maxWidthOrHeight: 1920,
        useWebWorker: true,
      };

      // Compress image
      const compressedFile = await imageCompression(file, options);

      // Convert to base64
      const reader = new FileReader();
      reader.onload = (e) => {
        value = e.target?.result as string;
        onchange(value);
        uploading = false;
      };
      reader.onerror = () => {
        alert('Fehler beim Lesen der Datei.');
        uploading = false;
      };
      reader.readAsDataURL(compressedFile);
    } catch (error) {
      console.error('Image compression error:', error);
      alert('Fehler beim Komprimieren des Bildes.');
      uploading = false;
    }
  }

  function handleFileInput(event: Event) {
    const target = event.target as HTMLInputElement;
    const file = target.files?.[0];
    if (file) {
      handleFile(file);
    }
  }

  function handleDrop(event: DragEvent) {
    event.preventDefault();
    dragActive = false;

    const file = event.dataTransfer?.files[0];
    if (file) {
      handleFile(file);
    }
  }

  function handleDragOver(event: DragEvent) {
    event.preventDefault();
    dragActive = true;
  }

  function handleDragLeave() {
    dragActive = false;
  }

  function removeImage() {
    value = '';
    onchange('');
    if (fileInput) {
      fileInput.value = '';
    }
  }
</script>

<div class="mb-4">
  <label class="block text-sm font-medium text-primary mb-2">
    {label}
    {#if required}
      <span class="text-error">*</span>
    {/if}
    {#if dimensions}
      <span class="text-xs text-primary-light ml-2">
        Empfohlene Größe: {dimensions}px
      </span>
    {/if}
  </label>

  {#if value}
    <!-- Image Preview -->
    <div class="relative inline-block">
      <img
        src={value}
        alt="Preview"
        class="max-w-full h-auto rounded-lg border-2 border-gray-200 max-h-64"
      />
      {#if !disabled}
        <button
          type="button"
          onclick={removeImage}
          class="absolute top-2 right-2 bg-error text-white rounded-full p-2 hover:bg-red-600 transition-colors shadow-lg"
          aria-label="Bild entfernen"
        >
          <svg class="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
            <path
              fill-rule="evenodd"
              d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z"
              clip-rule="evenodd"
            />
          </svg>
        </button>
      {/if}
    </div>
  {:else if !disabled}
    <!-- Upload Area -->
    <div
      class="border-2 border-dashed rounded-lg p-8 text-center transition-colors"
      class:border-accent={dragActive}
      class:bg-blue-50={dragActive}
      class:border-gray-300={!dragActive}
      class:border-error={error}
      ondrop={handleDrop}
      ondragover={handleDragOver}
      ondragleave={handleDragLeave}
    >
      {#if uploading}
        <div class="text-primary-light">
          <svg
            class="animate-spin h-8 w-8 mx-auto mb-2 text-accent"
            fill="none"
            viewBox="0 0 24 24"
          >
            <circle
              class="opacity-25"
              cx="12"
              cy="12"
              r="10"
              stroke="currentColor"
              stroke-width="4"
            />
            <path
              class="opacity-75"
              fill="currentColor"
              d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
            />
          </svg>
          <p class="text-sm">Bild wird komprimiert...</p>
        </div>
      {:else}
        <svg
          class="mx-auto h-12 w-12 text-gray-400 mb-3"
          stroke="currentColor"
          fill="none"
          viewBox="0 0 48 48"
        >
          <path
            d="M28 8H12a4 4 0 00-4 4v20m32-12v8m0 0v8a4 4 0 01-4 4H12a4 4 0 01-4-4v-4m32-4l-3.172-3.172a4 4 0 00-5.656 0L28 28M8 32l9.172-9.172a4 4 0 015.656 0L28 28m0 0l4 4m4-24h8m-4-4v8m-12 4h.02"
            stroke-width="2"
            stroke-linecap="round"
            stroke-linejoin="round"
          />
        </svg>
        <p class="text-sm text-primary mb-2">
          Ziehen Sie ein Bild hierher oder
        </p>
        <button
          type="button"
          onclick={() => fileInput.click()}
          class="btn btn-secondary inline-flex items-center"
        >
          Datei auswählen
        </button>
        <input
          bind:this={fileInput}
          type="file"
          accept="image/*"
          onchange={handleFileInput}
          class="hidden"
        />
      {/if}
    </div>
  {/if}

  {#if error}
    <p class="text-error text-sm mt-1">{error}</p>
  {/if}
</div>
