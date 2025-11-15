# Hellers Kaffees Content Portal - Complete Specification

**Version:** 1.0
**Date:** November 15, 2025
**Status:** Ready for Implementation

---

## Executive Summary

A flexible content creation portal that allows the Hellers Kaffees cafe owner to create unlimited entries for various content types (brewing guides, menu items, events, retail coffee, etc.) and export them for integration into the main website.

**Key Principle:** No fixed structure. Owner decides what to create and how many entries to make.

---

## 1. CORE CONCEPT

### Purpose
The main Hellers Kaffees website is fully functional but populated with sample data. This portal enables the cafe owner to:
- Select a content type (e.g., "Brewing Guide", "Menu Item")
- Create as many entries as needed
- Fill in all content (text, images, prices, etc.)
- Export everything for developer integration

### Design Philosophy
- **Flexible**: No required item counts or rigid structure
- **Reusable**: Can be used multiple times for updates
- **Simple**: Focus on content creation, not website mirroring
- **Efficient**: Templates, duplication, and bulk import for speed

---

## 2. CONTENT TYPES & SCHEMAS

### 2.1 Brewing Guide
**Label:** "Brewing Guide"
**Icon:** ☕

**Fields:**
- `title` (text, required) - Method name, e.g., "French Press"
- `slug` (text, required, auto-generated) - URL slug
- `difficulty` (select, required) - Options: Einfach, Mittel, Fortgeschritten
- `brewTime` (text) - e.g., "5 Minuten"
- `heroImage` (image, required) - Dimensions: 1200x800px
- `description` (textarea, required, max 200 chars) - Short description
- `defaultServings` (number, default: 2)
- `ingredients` (repeater) - Sub-fields:
  - `amount` (text)
  - `ingredient` (text)
- `steps` (repeater) - Sub-fields:
  - `time` (text) - Time mark
  - `instruction` (textarea)
- `tips` (textarea, max 500 chars) - Tips & notes
- `ogImage` (image) - Social share image, 1200x630px

### 2.2 Menu Item (Coffee)
**Label:** "Menu Item (Coffee)"
**Icon:** ☕

**Fields:**
- `name` (text, required)
- `price` (number, required) - In euros
- `description` (textarea, required, max 150 chars)
- `tag` (select) - Options: Kurz, Milch, Filter, Kalt, Schwarz
- `image` (image, required) - Dimensions: 800x600px

### 2.3 Menu Item (Pastry)
**Label:** "Menu Item (Pastry)"
**Icon:** 🥐

**Fields:**
- `name` (text, required)
- `price` (number, required) - In euros
- `description` (textarea, required, max 150 chars)
- `tag` (text) - e.g., "Vegan verfügbar"
- `image` (image, required) - Dimensions: 800x600px
- `allergens` (tags, optional) - Allergen information

### 2.4 Event / Workshop
**Label:** "Event / Workshop"
**Icon:** 📅

**Fields:**
- `name` (text, required)
- `date` (date, required)
- `time` (text, required) - e.g., "10:00-13:00"
- `duration` (text) - e.g., "3 Stunden"
- `description` (textarea, required, max 300 chars)
- `maxParticipants` (number, required)
- `price` (number, required) - In euros
- `level` (select, required) - Options: Anfänger, Fortgeschritten, Alle Niveaus
- `image` (image, required) - Dimensions: 800x800px (square)

### 2.5 Retail Coffee
**Label:** "Retail Coffee"
**Icon:** 🌱

**Fields:**
- `name` (text, required)
- `slug` (text, required, auto-generated)
- `origin` (text, required) - Origin country
- `price` (text, required) - e.g., "€19,00"
- `pricePerKg` (text) - e.g., "€95,00/kg"
- `image` (image, required) - Dimensions: 1800x1800px
- `description` (textarea, required, max 200 chars)
- `flavourProfile` (tags, required) - e.g., Chocolate, Caramel
- `roastLevel` (select, required) - Options: Light, Medium, Dark
- `flavourType` (select) - Options: Fruity & lively, Sweet & chocolaty, Floral & light
- `acidity` (select) - Options: Low, Medium, High
- `processingMethod` (select) - Options: Washed, Natural, Honey
- `category` (select) - Options: Micro Lot, Limited, Exotic
- `producerStory` (richtext, max 1000 chars)
- `soldOut` (checkbox)
- `isNew` (checkbox)

### 2.6 Business Information
**Label:** "Business Information"
**Icon:** 🏪

**Fields:**
- `businessName` (text, default: "Hellers Kaffees")
- `street` (text, required)
- `postalCode` (text, required)
- `city` (text, required)
- `phone` (tel) - e.g., "+49 30 ..."
- `email` (email, required)
- `openingHours` (repeater) - Sub-fields:
  - `day` (select) - Mo, Di, Mi, Do, Fr, Sa, So
  - `hours` (text) - e.g., "08:00-17:00" or "Geschlossen"
- `instagram` (text) - e.g., "@hellerskaffees"
- `facebook` (text)
- `aboutText` (textarea, max 500 chars)

### 2.7 Media & Branding
**Label:** "Media & Branding"
**Icon:** 🎨

**Fields:**
- `type` (select, required) - Options: Hero Image, Logo, Favicon, OG Image
- `purpose` (text) - e.g., "Homepage Hero", "Events OG Image"
- `file` (image, required)
- `altText` (text) - Accessibility description

---

## 3. VISUAL DESIGN (Windsurf-Inspired)

### Color Palette
- **Background:** `#F5F3EF` (sand/beige)
- **Surface/Cards:** `#FFFFFF` with subtle shadows
- **Text Primary:** `#1A1A1A` (near black)
- **Text Secondary:** `#666666`
- **Accent:** `#D4A574` (warm coffee tone - Hellers brand)
- **Success:** `#10B981`
- **Error:** `#EF4444`

### Typography
- **Font stack:** `-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif`
- **Headings:** 600 weight
- **Body:** 400 weight
- **Line height:** 1.6 for readability

### Spacing & Components
- **Base unit:** 8px
- **Padding:** Generous (24px, 32px, 48px)
- **Borders:** Rounded corners (8px standard, 12px for cards)
- **Shadows:** Subtle box-shadows on cards
- **Transitions:** Smooth hover and focus states

### Layout Structure
```
┌─────────────────────────────────────────────────────────┐
│  HEADER                                                 │
│  Hellers Kaffees Content Portal          [Export All]  │
└─────────────────────────────────────────────────────────┘
┌──────────────────┬──────────────────────────────────────┐
│  SIDEBAR (20%)   │  MAIN CONTENT (80%)                  │
│                  │                                      │
│  Content Types   │  [Current View]                     │
│  ┌────────────┐  │  - Dashboard (default)              │
│  │ ☕ Brewing │  │  - Content Type List                │
│  │   Guides   │  │  - Create/Edit Form                 │
│  │   (3)      │  │                                     │
│  └────────────┘  │                                     │
│  ┌────────────┐  │                                     │
│  │ ☕ Coffee  │  │                                     │
│  │   Menu     │  │                                     │
│  │   (8)      │  │                                     │
│  └────────────┘  │                                     │
└──────────────────┴──────────────────────────────────────┘
```

---

## 4. TECH STACK

### Frontend Framework
**SvelteKit**

**Rationale:**
- Minimal boilerplate, excellent DX
- Compiles to vanilla JS (tiny bundle)
- Built-in reactivity
- SSG support, file-based routing
- Easy Netlify deployment

### Form Handling
**Zod + Svelte Stores**

**Features:**
- Runtime validation
- TypeScript-first
- Natural integration with Svelte

### Styling
**Tailwind CSS**

**Features:**
- Utility-first rapid development
- Customizable design system
- Mobile-first responsive
- PurgeCSS for small bundle

### Image Handling
**browser-image-compression + custom component**

**Features:**
- Client-side compression
- Drag & drop upload
- Preview before save
- Dimension validation
- Base64 encoding or ZIP export

### Additional Libraries
- **uuid** - Generate unique entry IDs
- **date-fns** - Date formatting/validation
- **jszip** - Create ZIP archives
- **file-saver** - Trigger downloads
- **sortablejs** - Drag-to-reorder in repeater fields
- **lucide-svelte** - Icon system

### Deployment
**Netlify** (static hosting on subdomain)

---

## 5. COMPONENT ARCHITECTURE

```
src/
├── lib/
│   ├── components/
│   │   ├── Layout/
│   │   │   ├── Header.svelte
│   │   │   ├── Sidebar.svelte
│   │   │   └── MainContent.svelte
│   │   ├── ContentType/
│   │   │   ├── ContentTypeCard.svelte
│   │   │   └── ContentTypeGrid.svelte
│   │   ├── Forms/
│   │   │   ├── DynamicForm.svelte        (renders from schema)
│   │   │   ├── FieldText.svelte
│   │   │   ├── FieldTextarea.svelte
│   │   │   ├── FieldNumber.svelte
│   │   │   ├── FieldSelect.svelte
│   │   │   ├── FieldImage.svelte
│   │   │   ├── FieldDate.svelte
│   │   │   ├── FieldTags.svelte
│   │   │   ├── FieldRepeater.svelte      (with drag-to-reorder)
│   │   │   ├── RepeaterItem.svelte       (expandable/collapsible)
│   │   │   └── FieldRichtext.svelte
│   │   ├── EntryCard.svelte
│   │   ├── ExportModal.svelte
│   │   ├── PreviewPanel.svelte           (live website preview)
│   │   ├── TemplateSelector.svelte
│   │   └── Dashboard.svelte
│   ├── stores/
│   │   ├── content.js                    (content entries)
│   │   ├── ui.js                         (UI state)
│   │   └── export.js                     (export logic)
│   ├── schemas/
│   │   └── contentTypes.js               (all type definitions)
│   ├── utils/
│   │   ├── storage.js                    (LocalStorage helpers)
│   │   ├── validation.js                 (Zod validators)
│   │   ├── export.js                     (JSON/CSV/ZIP)
│   │   └── imageCompression.js
│   └── types/
│       └── index.ts                      (TypeScript types)
├── routes/
│   ├── +page.svelte                      (Dashboard)
│   ├── [contentType]/
│   │   ├── +page.svelte                  (List view)
│   │   ├── create/+page.svelte           (Create form)
│   │   └── [id]/+page.svelte             (Edit form)
│   └── export/+page.svelte
└── app.html
```

---

## 6. KEY FEATURES

### Core Features
✅ **Dynamic form generation** from schemas
✅ **Auto-save** to LocalStorage every 30 seconds
✅ **Image upload** with compression
✅ **Validation** with real-time feedback
✅ **Export** to JSON/CSV/ZIP

### Enhanced Features
✅ **Advanced Repeater UI** - Drag-to-reorder, expand/collapse items
✅ **Live Website Preview** - Side-by-side editor/preview
✅ **Template System** - Save entries as reusable templates
✅ **Duplicate Entry** - One-click copy
✅ **CSV Import** - Bulk import menu items
✅ **Batch Operations** - Select multiple, delete/export

### Advanced Repeater Component

**Features:**
- Drag handle for reordering
- Expandable/collapsible items
- Auto-numbering (Step 1, Step 2, etc.)
- Visual feedback
- Smooth animations

**UI:**
```
┌──────────────────────────────────────────┐
│ Brewing Steps               [+ Add Step] │
├──────────────────────────────────────────┤
│ ⋮⋮ Step 1                    [▼] [×]    │
│   └─ Time: 0:00                          │
│      Instruction: Pour water and stir... │
├──────────────────────────────────────────┤
│ ⋮⋮ Step 2                    [▼] [×]    │
│   └─ Time: 2:00                          │
│      Instruction: Let steep...           │
└──────────────────────────────────────────┘
```

### Live Preview Panel

**Features:**
- Import actual website CSS
- Side-by-side editor/preview
- Desktop/mobile toggle
- Real-time updates

**Layout:**
```
┌────────────────┬────────────────┐
│   EDITOR       │   PREVIEW      │
│                │                │
│  [Form fields] │  [Website      │
│                │   mockup with  │
│                │   live data]   │
│                │                │
│                │  [Desktop|📱]  │
└────────────────┴────────────────┘
```

### Template & Bulk Features

**Templates:**
- Save any entry as template
- Load template when creating new entry
- Pre-fills all fields for quick variations

**Duplicate:**
- One-click copy of existing entry
- Appends "(Copy)" to title
- All fields duplicated

**CSV Import:**
- Download CSV template
- Fill in spreadsheet
- Upload and auto-create entries
- Manual image assignment after import

---

## 7. EXPORT FORMATS

### 7.1 JSON Export

```json
{
  "exportDate": "2025-11-15T14:30:00Z",
  "version": "1.0",
  "metadata": {
    "totalEntries": 23,
    "contentTypes": ["brewingGuide", "menuItemCoffee", "event"]
  },
  "content": {
    "brewingGuide": [
      {
        "id": "uuid-1",
        "createdAt": "2025-11-15",
        "data": {
          "title": "French Press",
          "slug": "french-press",
          "difficulty": "Einfach",
          "heroImage": "images/french-press-hero.jpg"
          // ... all fields
        }
      }
    ],
    "menuItemCoffee": [...],
    "event": [...]
  },
  "images": {
    "manifest": [
      {
        "id": "img-uuid-1",
        "originalName": "my-photo.jpg",
        "exportName": "french-press-hero.jpg",
        "contentType": "brewingGuide",
        "entryId": "uuid-1",
        "fieldName": "heroImage",
        "size": 245600,
        "dimensions": "1200x800"
      }
    ]
  }
}
```

### 7.2 CSV Export

Separate CSV per content type:
- `brewing-guides.csv`
- `menu-coffee.csv`
- `menu-pastries.csv`
- `events.csv`
- `retail-coffee.csv`

### 7.3 ZIP Archive

```
hellers-content-export-2025-11-15/
├── README.txt
├── content.json
├── csvs/
│   ├── brewing-guides.csv
│   ├── menu-coffee.csv
│   └── events.csv
└── images/
    ├── brewing/
    ├── menu/
    └── events/
```

---

## 8. IMPLEMENTATION ROADMAP

### Phase 1: Foundation (Week 1)
- ✅ Set up SvelteKit + Tailwind
- ✅ Create basic layout (Header, Sidebar, MainContent)
- ✅ Implement LocalStorage persistence
- ✅ Define all content type schemas
- ✅ Build sidebar navigation
- ✅ Create dashboard view

### Phase 2: Dynamic Forms (Week 2)
- ✅ Build DynamicForm component
- ✅ Create all field components
- ✅ Implement Zod validation
- ✅ Add auto-save functionality
- ✅ Build image upload with compression

### Phase 3: CRUD Operations (Week 3)
- ✅ Content type list view
- ✅ Create/edit flows
- ✅ Delete with confirmation
- ✅ EntryCard component
- ✅ Search/filter within types
- ✅ Template save/load
- ✅ Duplicate entry

### Phase 4: Advanced Features (Week 4)
- ✅ Enhanced Repeater with drag-to-reorder
- ✅ Tags input component
- ✅ Rich text editor
- ✅ Date picker
- ✅ Auto-slug generation
- ✅ Live preview panel
- ✅ CSV import

### Phase 5: Export & Polish (Week 5)
- ✅ JSON export
- ✅ CSV export
- ✅ ZIP export with images
- ✅ Export modal with options
- ✅ Import functionality
- ✅ Animations and transitions
- ✅ Responsive design polish

### Phase 6: Deployment & Documentation (Week 6)
- ✅ Deploy to Netlify
- ✅ User guide for cafe owner
- ✅ Developer integration guide
- ✅ Testing with real content
- ✅ Handoff and training

**Total Timeline:** 6 weeks

---

## 9. INTEGRATION WORKFLOW

### After Owner Completes Portal:

**Developer receives:**
- JSON data file
- ZIP with organized images
- CSV files (optional)

**Integration steps:**
1. Copy images to `/src/assets/images/`
2. Update HTML pages with real data OR
3. Migrate to Eleventy templates using JSON data
4. Replace OG images and hero images
5. Test and deploy

**Estimated integration time:** 4-6 hours

---

## 10. FUTURE ENHANCEMENTS

### Post-Launch CMS Options

**Option A: Decap CMS**
- Git-based, no database
- Owner can update directly
- Free and open-source

**Option B: Headless CMS (Sanity/Strapi)**
- Robust admin interface
- Real-time preview
- Better image management
- $0-20/month

**Option C: Keep Portal**
- Owner re-uses portal for updates
- Developer integrates manually
- Simple but requires dev involvement

---

## 11. CRITICAL DECISIONS MADE

### Issue 1: Repeater Field UX
**Solution:** Advanced component with drag-to-reorder, expand/collapse, visual numbering, smooth animations

### Issue 2: Live Preview
**Solution:** Side-by-side editor/preview panel with actual website CSS, desktop/mobile toggle

### Issue 3: Bulk Operations
**Solution:** Templates, duplicate functionality, CSV import for efficient bulk data entry

---

## 12. NEXT STEPS

1. **Review and approve** this specification
2. **Start Phase 1** - Set up project foundation
3. **Iterative development** - Build and test each phase
4. **Deploy and train** - Launch portal and onboard cafe owner

---

## References

- **Main website repository:** `/home/user/hellersNetlify`
- **Existing data structure:** `/home/user/hellersNetlify/src/data/coffees.json`
- **Design inspiration:** https://windsurf.com/profile
- **Deployment:** Netlify subdomain (TBD)

---

**Document Status:** ✅ Ready for Implementation
**Last Updated:** November 15, 2025
