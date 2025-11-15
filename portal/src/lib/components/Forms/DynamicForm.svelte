<script lang="ts">
  import { onMount } from 'svelte';
  import { contentTypes } from '$lib/schemas/contentTypes';
  import { contentStore } from '$lib/stores/content';
  import { uiStore } from '$lib/stores/ui';
  import { generateSlug, debounce } from '$lib/utils/helpers';
  import FieldText from './FieldText.svelte';
  import FieldTextarea from './FieldTextarea.svelte';
  import FieldNumber from './FieldNumber.svelte';
  import FieldSelect from './FieldSelect.svelte';
  import FieldDate from './FieldDate.svelte';
  import FieldTags from './FieldTags.svelte';
  import FieldImage from './FieldImage.svelte';
  import FieldRepeater from './FieldRepeater.svelte';

  interface Props {
    contentType: string;
    entryId?: string;
    onSave: () => void;
    onCancel: () => void;
  }

  let { contentType, entryId, onSave, onCancel }: Props = $props();

  const typeConfig = contentTypes[contentType];
  const isEditMode = !!entryId;

  // Form data
  let formData = $state<Record<string, any>>({});
  let errors = $state<Record<string, string>>({});
  let hasChanges = $state(false);

  // Load existing entry for edit mode
  onMount(() => {
    if (isEditMode && entryId) {
      const entries = contentStore.getEntriesByType(contentType);
      const entry = entries.find(e => e.id === entryId);
      if (entry) {
        formData = { ...entry.data };
      }
    } else {
      // Initialize with defaults for create mode
      initializeDefaults();
    }
  });

  function initializeDefaults() {
    formData = {};

    // Set default values based on content type
    if (contentType === 'brewingGuide') {
      formData.defaultServings = 2;
      formData.ingredients = [];
      formData.steps = [];
    } else if (contentType === 'menuItemPastry') {
      formData.allergens = [];
    } else if (contentType === 'retailCoffee') {
      formData.flavourProfile = [];
      formData.soldOut = false;
      formData.isNew = false;
    } else if (contentType === 'businessInfo') {
      formData.businessName = 'Hellers Kaffees';
      formData.openingHours = [];
    }
  }

  // Auto-generate slug from title/name
  function handleTitleChange(value: string, slugField: string) {
    formData.title = value;
    if (!isEditMode || !formData[slugField]) {
      formData[slugField] = generateSlug(value);
    }
    hasChanges = true;
  }

  function handleNameChange(value: string, slugField: string) {
    formData.name = value;
    if (!isEditMode || !formData[slugField]) {
      formData[slugField] = generateSlug(value);
    }
    hasChanges = true;
  }

  function handleFieldChange(fieldName: string, value: any) {
    formData[fieldName] = value;
    hasChanges = true;
    validateField(fieldName);
  }

  function validateField(fieldName: string) {
    // Clear previous error
    delete errors[fieldName];

    // Basic validation will be done on submit
    // Real-time validation can be added here
  }

  function validate(): boolean {
    errors = {};

    try {
      typeConfig.schema.parse(formData);
      return true;
    } catch (error: any) {
      // Parse Zod errors
      if (error.errors) {
        error.errors.forEach((err: any) => {
          const field = err.path.join('.');
          errors[field] = err.message;
        });
      }
      return false;
    }
  }

  function handleSubmit() {
    if (!validate()) {
      uiStore.notify('error', 'Bitte korrigieren Sie die Fehler im Formular.');
      return;
    }

    if (isEditMode && entryId) {
      contentStore.updateEntry(contentType, entryId, formData);
      uiStore.notify('success', 'Eintrag erfolgreich aktualisiert.');
    } else {
      contentStore.createEntry(contentType, formData);
      uiStore.notify('success', 'Eintrag erfolgreich erstellt.');
    }

    hasChanges = false;
    onSave();
  }

  function handleCancel() {
    if (hasChanges) {
      if (confirm('Möchten Sie wirklich abbrechen? Ungespeicherte Änderungen gehen verloren.')) {
        onCancel();
      }
    } else {
      onCancel();
    }
  }
</script>

<div class="card max-w-4xl">
  <div class="mb-6">
    <h2 class="text-2xl font-semibold text-primary mb-2">
      {isEditMode ? 'Bearbeiten' : 'Erstellen'}: {typeConfig.label}
    </h2>
    <p class="text-primary-light">{typeConfig.description}</p>
  </div>

  <form onsubmit={(e) => { e.preventDefault(); handleSubmit(); }}>
    <!-- Brewing Guide Fields -->
    {#if contentType === 'brewingGuide'}
      <FieldText
        label="Titel"
        value={formData.title || ''}
        onchange={(val) => handleTitleChange(val, 'slug')}
        required
        error={errors.title}
        placeholder="z.B. French Press"
      />

      <FieldText
        label="URL-Slug"
        value={formData.slug || ''}
        onchange={(val) => handleFieldChange('slug', val)}
        required
        error={errors.slug}
        placeholder="french-press"
      />

      <FieldSelect
        label="Schwierigkeit"
        value={formData.difficulty || ''}
        options={['Einfach', 'Mittel', 'Fortgeschritten']}
        onchange={(val) => handleFieldChange('difficulty', val)}
        required
        error={errors.difficulty}
      />

      <FieldText
        label="Brühzeit"
        value={formData.brewTime || ''}
        onchange={(val) => handleFieldChange('brewTime', val)}
        placeholder="z.B. 5 Minuten"
      />

      <FieldImage
        label="Hero-Bild"
        value={formData.heroImage || ''}
        onchange={(val) => handleFieldChange('heroImage', val)}
        required
        dimensions="1200x800"
        error={errors.heroImage}
      />

      <FieldTextarea
        label="Beschreibung"
        value={formData.description || ''}
        onchange={(val) => handleFieldChange('description', val)}
        required
        maxLength={200}
        error={errors.description}
      />

      <FieldNumber
        label="Standard-Portionen"
        value={formData.defaultServings || 2}
        onchange={(val) => handleFieldChange('defaultServings', val)}
        min={1}
      />

      <FieldRepeater
        label="Zutaten"
        value={formData.ingredients || []}
        onchange={(val) => handleFieldChange('ingredients', val)}
        subFields={[
          { name: 'amount', label: 'Menge', type: 'text', placeholder: 'z.B. 30g' },
          { name: 'ingredient', label: 'Zutat', type: 'text', placeholder: 'z.B. Kaffeepulver' }
        ]}
        itemLabel="Zutat"
      />

      <FieldRepeater
        label="Zubereitungsschritte"
        value={formData.steps || []}
        onchange={(val) => handleFieldChange('steps', val)}
        subFields={[
          { name: 'time', label: 'Zeit', type: 'text', placeholder: 'z.B. 0:00' },
          { name: 'instruction', label: 'Anleitung', type: 'textarea', placeholder: 'Beschreiben Sie den Schritt...' }
        ]}
        itemLabel="Schritt"
      />

      <FieldTextarea
        label="Tipps & Hinweise"
        value={formData.tips || ''}
        onchange={(val) => handleFieldChange('tips', val)}
        maxLength={500}
        rows={3}
      />

      <FieldImage
        label="Open Graph Bild (Optional)"
        value={formData.ogImage || ''}
        onchange={(val) => handleFieldChange('ogImage', val)}
        dimensions="1200x630"
      />
    {/if}

    <!-- Menu Item (Coffee) Fields -->
    {#if contentType === 'menuItemCoffee'}
      <FieldText
        label="Name"
        value={formData.name || ''}
        onchange={(val) => handleFieldChange('name', val)}
        required
        error={errors.name}
        placeholder="z.B. Espresso"
      />

      <FieldNumber
        label="Preis (€)"
        value={formData.price || 0}
        onchange={(val) => handleFieldChange('price', val)}
        required
        min={0}
        step={0.1}
        error={errors.price}
      />

      <FieldTextarea
        label="Beschreibung"
        value={formData.description || ''}
        onchange={(val) => handleFieldChange('description', val)}
        required
        maxLength={150}
        error={errors.description}
      />

      <FieldSelect
        label="Kategorie"
        value={formData.tag || ''}
        options={['Kurz', 'Milch', 'Filter', 'Kalt', 'Schwarz']}
        onchange={(val) => handleFieldChange('tag', val)}
      />

      <FieldImage
        label="Bild"
        value={formData.image || ''}
        onchange={(val) => handleFieldChange('image', val)}
        required
        dimensions="800x600"
        error={errors.image}
      />
    {/if}

    <!-- Menu Item (Pastry) Fields -->
    {#if contentType === 'menuItemPastry'}
      <FieldText
        label="Name"
        value={formData.name || ''}
        onchange={(val) => handleFieldChange('name', val)}
        required
        error={errors.name}
        placeholder="z.B. Croissant"
      />

      <FieldNumber
        label="Preis (€)"
        value={formData.price || 0}
        onchange={(val) => handleFieldChange('price', val)}
        required
        min={0}
        step={0.1}
        error={errors.price}
      />

      <FieldTextarea
        label="Beschreibung"
        value={formData.description || ''}
        onchange={(val) => handleFieldChange('description', val)}
        required
        maxLength={150}
        error={errors.description}
      />

      <FieldText
        label="Tag"
        value={formData.tag || ''}
        onchange={(val) => handleFieldChange('tag', val)}
        placeholder="z.B. Vegan verfügbar"
      />

      <FieldImage
        label="Bild"
        value={formData.image || ''}
        onchange={(val) => handleFieldChange('image', val)}
        required
        dimensions="800x600"
        error={errors.image}
      />

      <FieldTags
        label="Allergene"
        value={formData.allergens || []}
        onchange={(val) => handleFieldChange('allergens', val)}
        placeholder="Allergen hinzufügen..."
      />
    {/if}

    <!-- Event/Workshop Fields -->
    {#if contentType === 'event'}
      <FieldText
        label="Name"
        value={formData.name || ''}
        onchange={(val) => handleFieldChange('name', val)}
        required
        error={errors.name}
      />

      <FieldDate
        label="Datum"
        value={formData.date || ''}
        onchange={(val) => handleFieldChange('date', val)}
        required
        error={errors.date}
      />

      <FieldText
        label="Uhrzeit"
        value={formData.time || ''}
        onchange={(val) => handleFieldChange('time', val)}
        required
        placeholder="z.B. 10:00-13:00"
        error={errors.time}
      />

      <FieldText
        label="Dauer"
        value={formData.duration || ''}
        onchange={(val) => handleFieldChange('duration', val)}
        placeholder="z.B. 3 Stunden"
      />

      <FieldTextarea
        label="Beschreibung"
        value={formData.description || ''}
        onchange={(val) => handleFieldChange('description', val)}
        required
        maxLength={300}
        error={errors.description}
      />

      <FieldNumber
        label="Maximale Teilnehmerzahl"
        value={formData.maxParticipants || 0}
        onchange={(val) => handleFieldChange('maxParticipants', val)}
        required
        min={1}
        error={errors.maxParticipants}
      />

      <FieldNumber
        label="Preis (€)"
        value={formData.price || 0}
        onchange={(val) => handleFieldChange('price', val)}
        required
        min={0}
        step={0.1}
        error={errors.price}
      />

      <FieldSelect
        label="Niveau"
        value={formData.level || ''}
        options={['Anfänger', 'Fortgeschritten', 'Alle Niveaus']}
        onchange={(val) => handleFieldChange('level', val)}
        required
        error={errors.level}
      />

      <FieldImage
        label="Bild"
        value={formData.image || ''}
        onchange={(val) => handleFieldChange('image', val)}
        required
        dimensions="800x800"
        error={errors.image}
      />
    {/if}

    <!-- Retail Coffee Fields -->
    {#if contentType === 'retailCoffee'}
      <FieldText
        label="Name"
        value={formData.name || ''}
        onchange={(val) => handleNameChange(val, 'slug')}
        required
        error={errors.name}
      />

      <FieldText
        label="URL-Slug"
        value={formData.slug || ''}
        onchange={(val) => handleFieldChange('slug', val)}
        required
        error={errors.slug}
      />

      <FieldText
        label="Herkunft"
        value={formData.origin || ''}
        onchange={(val) => handleFieldChange('origin', val)}
        required
        placeholder="z.B. Äthiopien"
        error={errors.origin}
      />

      <FieldText
        label="Preis"
        value={formData.price || ''}
        onchange={(val) => handleFieldChange('price', val)}
        required
        placeholder="z.B. €19,00"
        error={errors.price}
      />

      <FieldText
        label="Preis pro kg"
        value={formData.pricePerKg || ''}
        onchange={(val) => handleFieldChange('pricePerKg', val)}
        placeholder="z.B. €95,00/kg"
      />

      <FieldImage
        label="Produktbild"
        value={formData.image || ''}
        onchange={(val) => handleFieldChange('image', val)}
        required
        dimensions="1800x1800"
        error={errors.image}
      />

      <FieldTextarea
        label="Beschreibung"
        value={formData.description || ''}
        onchange={(val) => handleFieldChange('description', val)}
        required
        maxLength={200}
        error={errors.description}
      />

      <FieldTags
        label="Geschmacksprofil"
        value={formData.flavourProfile || []}
        onchange={(val) => handleFieldChange('flavourProfile', val)}
        required
        error={errors.flavourProfile}
      />

      <FieldSelect
        label="Röstgrad"
        value={formData.roastLevel || ''}
        options={['Light', 'Medium', 'Dark']}
        onchange={(val) => handleFieldChange('roastLevel', val)}
        required
        error={errors.roastLevel}
      />

      <FieldSelect
        label="Geschmackstyp"
        value={formData.flavourType || ''}
        options={['Fruity & lively', 'Sweet & chocolaty', 'Floral & light']}
        onchange={(val) => handleFieldChange('flavourType', val)}
      />

      <FieldSelect
        label="Säure"
        value={formData.acidity || ''}
        options={['Low', 'Medium', 'High']}
        onchange={(val) => handleFieldChange('acidity', val)}
      />

      <FieldSelect
        label="Aufbereitungsmethode"
        value={formData.processingMethod || ''}
        options={['Washed', 'Natural', 'Honey']}
        onchange={(val) => handleFieldChange('processingMethod', val)}
      />

      <FieldSelect
        label="Kategorie"
        value={formData.category || ''}
        options={['Micro Lot', 'Limited', 'Exotic']}
        onchange={(val) => handleFieldChange('category', val)}
      />

      <FieldTextarea
        label="Produzenten-Geschichte"
        value={formData.producerStory || ''}
        onchange={(val) => handleFieldChange('producerStory', val)}
        maxLength={1000}
        rows={6}
      />

      <div class="flex gap-4 mb-4">
        <label class="flex items-center gap-2 cursor-pointer">
          <input
            type="checkbox"
            checked={formData.soldOut || false}
            onchange={(e) => handleFieldChange('soldOut', (e.target as HTMLInputElement).checked)}
            class="w-4 h-4 rounded border-gray-300 text-accent focus:ring-accent"
          />
          <span class="text-sm text-primary">Ausverkauft</span>
        </label>

        <label class="flex items-center gap-2 cursor-pointer">
          <input
            type="checkbox"
            checked={formData.isNew || false}
            onchange={(e) => handleFieldChange('isNew', (e.target as HTMLInputElement).checked)}
            class="w-4 h-4 rounded border-gray-300 text-accent focus:ring-accent"
          />
          <span class="text-sm text-primary">Neu</span>
        </label>
      </div>
    {/if}

    <!-- Business Information Fields -->
    {#if contentType === 'businessInfo'}
      <FieldText
        label="Geschäftsname"
        value={formData.businessName || 'Hellers Kaffees'}
        onchange={(val) => handleFieldChange('businessName', val)}
        placeholder="Hellers Kaffees"
      />

      <FieldText
        label="Straße"
        value={formData.street || ''}
        onchange={(val) => handleFieldChange('street', val)}
        required
        error={errors.street}
        placeholder="z.B. Musterstraße 123"
      />

      <div class="grid grid-cols-2 gap-4">
        <FieldText
          label="Postleitzahl"
          value={formData.postalCode || ''}
          onchange={(val) => handleFieldChange('postalCode', val)}
          required
          error={errors.postalCode}
          placeholder="z.B. 10115"
        />

        <FieldText
          label="Stadt"
          value={formData.city || ''}
          onchange={(val) => handleFieldChange('city', val)}
          required
          error={errors.city}
          placeholder="z.B. Berlin"
        />
      </div>

      <div class="grid grid-cols-2 gap-4">
        <FieldText
          label="Telefon"
          value={formData.phone || ''}
          onchange={(val) => handleFieldChange('phone', val)}
          placeholder="+49 30 ..."
        />

        <FieldText
          label="E-Mail"
          value={formData.email || ''}
          onchange={(val) => handleFieldChange('email', val)}
          required
          error={errors.email}
          placeholder="info@hellerskaffees.de"
        />
      </div>

      <FieldRepeater
        label="Öffnungszeiten"
        value={formData.openingHours || []}
        onchange={(val) => handleFieldChange('openingHours', val)}
        subFields={[
          { name: 'day', label: 'Tag', type: 'text', placeholder: 'z.B. Mo' },
          { name: 'hours', label: 'Uhrzeiten', type: 'text', placeholder: 'z.B. 08:00-17:00 oder Geschlossen' }
        ]}
        itemLabel="Öffnungszeit"
      />

      <div class="grid grid-cols-2 gap-4">
        <FieldText
          label="Instagram"
          value={formData.instagram || ''}
          onchange={(val) => handleFieldChange('instagram', val)}
          placeholder="@hellerskaffees"
        />

        <FieldText
          label="Facebook"
          value={formData.facebook || ''}
          onchange={(val) => handleFieldChange('facebook', val)}
          placeholder="HellersKaffees"
        />
      </div>

      <FieldTextarea
        label="Über uns Text"
        value={formData.aboutText || ''}
        onchange={(val) => handleFieldChange('aboutText', val)}
        maxLength={500}
        rows={4}
        placeholder="Beschreiben Sie Ihr Café..."
      />
    {/if}

    <!-- Media & Branding Fields -->
    {#if contentType === 'mediaBranding'}
      <FieldSelect
        label="Typ"
        value={formData.type || ''}
        options={['Hero Image', 'Logo', 'Favicon', 'OG Image']}
        onchange={(val) => handleFieldChange('type', val)}
        required
        error={errors.type}
      />

      <FieldText
        label="Verwendungszweck"
        value={formData.purpose || ''}
        onchange={(val) => handleFieldChange('purpose', val)}
        placeholder="z.B. Homepage Hero, Events OG Image"
      />

      <FieldImage
        label="Datei"
        value={formData.file || ''}
        onchange={(val) => handleFieldChange('file', val)}
        required
        error={errors.file}
      />

      <FieldText
        label="Alt-Text"
        value={formData.altText || ''}
        onchange={(val) => handleFieldChange('altText', val)}
        placeholder="Beschreibung für Barrierefreiheit"
      />
    {/if}

    <!-- Form Actions -->
    <div class="flex items-center justify-between pt-6 border-t border-gray-200">
      <button
        type="button"
        onclick={handleCancel}
        class="btn btn-secondary"
      >
        Abbrechen
      </button>

      <button
        type="submit"
        class="btn btn-primary"
      >
        {isEditMode ? 'Speichern' : 'Erstellen'}
      </button>
    </div>
  </form>
</div>
