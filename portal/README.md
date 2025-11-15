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

## Next Steps - Phase 2

Phase 2 will implement:
- Dynamic form generation from schemas
- All field components (text, select, image, repeater, etc.)
- Create/edit entry flows
- Image upload with compression
- Real-time validation feedback

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
