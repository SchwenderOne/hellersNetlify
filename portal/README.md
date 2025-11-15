# Hellers Kaffees Content Portal

A flexible content creation portal built with SvelteKit that allows the Hellers Kaffees cafe owner to create and manage content entries for their website.

## Phase 1 - Foundation ✅ COMPLETE

### What's Implemented

#### 🎨 Design System (Windsurf-Inspired)
- **Colors**: Warm beige background (#F5F3EF), coffee-tone accent (#D4A574)
- **Typography**: System font stack with 1.6 line height for readability
- **Components**: Card-based UI with subtle shadows and smooth transitions
- **Responsive**: Mobile-first design using Tailwind CSS v4

#### 📋 Content Types (All 7 Defined)
1. **Brewing Guide** (☕) - Coffee brewing methods with steps and ingredients
2. **Menu Item (Coffee)** (☕) - Coffee menu items with prices
3. **Menu Item (Pastry)** (🥐) - Pastries and baked goods
4. **Event / Workshop** (📅) - Events, workshops, and classes
5. **Retail Coffee** (🌱) - Retail coffee beans and products
6. **Business Information** (🏪) - Contact details and opening hours
7. **Media & Branding** (🎨) - Brand assets and images

Each content type has:
- Complete Zod validation schemas
- TypeScript type definitions
- Field specifications matching the specification document

#### 🗄️ Data Persistence
- **LocalStorage** implementation for browser-based storage
- **Auto-save** functionality (saves every 30 seconds)
- **Version control** for data migration
- **CRUD operations** for all content types
- **Import/Export** utilities

#### 🏗️ Component Architecture
```
src/lib/
├── components/
│   ├── Layout/
│   │   ├── Header.svelte        - App header with export button
│   │   ├── Sidebar.svelte       - Content type navigation
│   │   └── MainContent.svelte   - Main content area with notifications
│   ├── ContentType/
│   │   └── ContentTypeCard.svelte  - Content type card with count
│   └── Dashboard.svelte         - Overview dashboard
├── stores/
│   ├── content.ts              - Content management store
│   └── ui.ts                   - UI state management
├── schemas/
│   └── contentTypes.ts         - All Zod schemas and type definitions
└── utils/
    └── storage.ts              - LocalStorage utilities
```

#### 🎯 Features
- ✅ **Dashboard View** - Overview of all content with statistics
- ✅ **Sidebar Navigation** - Quick access to all content types with entry counts
- ✅ **Reactive UI** - Real-time updates using Svelte stores
- ✅ **Notification System** - Toast notifications for user feedback
- ✅ **Last Saved Indicator** - Shows when data was last persisted
- ✅ **Type Safety** - Full TypeScript support throughout

### Tech Stack
- **SvelteKit** - Latest version with Svelte 5 syntax
- **Tailwind CSS v4** - Using @tailwindcss/postcss
- **TypeScript** - Full type safety
- **Zod** - Runtime validation
- **UUID** - Unique ID generation

## Getting Started

### Installation
```bash
cd portal
npm install
```

### Development
```bash
npm run dev
```
Visit http://localhost:5173 to see the portal.

### Build
```bash
npm run build
```

### Preview Production Build
```bash
npm run preview
```

## Phase 2 - Dynamic Forms ✅ COMPLETE

### What's Implemented

#### 📝 Field Components (All Types)
- **FieldText** - Text input with character counter and max length
- **FieldTextarea** - Multi-line text with rows and character limit
- **FieldNumber** - Numeric input with min/max/step controls
- **FieldSelect** - Dropdown selection with placeholder support
- **FieldDate** - Date picker with German formatting
- **FieldTags** - Tag input with add/remove (Enter key, Backspace support)
- **FieldImage** - Image upload with:
  - Drag & drop support
  - Client-side compression (max 1MB, 1920px)
  - Base64 encoding for storage
  - Preview with remove button
  - Loading spinner during compression
- **FieldRepeater** - Nested repeating fields with:
  - Expandable/collapsible items
  - Add/remove items
  - Visual numbering
  - Item preview when collapsed

#### 🎯 DynamicForm Component
- **Schema-based rendering** - Automatically generates forms from Zod schemas
- **5 Content types implemented**:
  - ✅ Brewing Guide (full implementation with repeaters)
  - ✅ Menu Item (Coffee)
  - ✅ Menu Item (Pastry) with allergen tags
  - ✅ Event / Workshop
  - ✅ Retail Coffee (complete with all 15+ fields)
- **Auto-slug generation** - SEO-friendly URLs from titles/names
- **Real-time validation** - Zod schema validation with error messages
- **Create & Edit modes** - Same component handles both flows
- **German language UI** - All labels and messages in German

#### 📋 Entry Management
- **EntryList component**:
  - Card-based grid layout
  - Image thumbnails
  - Entry metadata (price, date, created)
  - Search/filter functionality
  - Edit and delete actions
  - Empty state with create button
- **Delete confirmation modal**
- **Success/error notifications**

#### 🛠️ Utilities
- **Slug generation** with German character support (ä→ae, ö→oe, ü→ue, ß→ss)
- **Date formatting** (German locale)
- **Debounce** for performance optimization
- **Text truncation** for previews

#### 🎨 CRUD Flow
1. **Dashboard** → Click content type card
2. **Entry List** → View all entries with search
3. **Create/Edit Form** → Fill fields with real-time validation
4. **Save** → Success notification + navigate to list
5. **Delete** → Confirmation modal → Remove entry

### Features Working
- ✅ Create new content entries
- ✅ Edit existing entries
- ✅ Delete entries with confirmation
- ✅ List view with image cards
- ✅ Search entries by name/description
- ✅ Image upload with compression
- ✅ Tag management (add/remove)
- ✅ Repeater fields for ingredients/steps
- ✅ Form validation with error display
- ✅ Auto-slug generation
- ✅ German date formatting
- ✅ Responsive design

## Next Steps - Phase 3

Phase 3 will implement:
- Business Info and Media & Branding forms
- Template save/load functionality
- Duplicate entry feature
- CSV import for bulk data
- Enhanced repeater with drag-to-reorder

## Data Storage

All data is stored in the browser's LocalStorage under the key `hellers_portal_content`:

```json
{
  "version": "1.0",
  "lastUpdated": "2025-11-15T00:00:00Z",
  "entries": {
    "brewingGuide": [...],
    "menuItemCoffee": [...],
    // ... other content types
  }
}
```

## Design Philosophy

- **Flexible**: No fixed structure - create as many entries as needed
- **Simple**: Focus on content creation, not complexity
- **Efficient**: Auto-save, templates, and bulk operations
- **User-Friendly**: Clear navigation and immediate feedback

## License

Private project for Hellers Kaffees.
