# Coffee Section Implementation Plan

## Overview
Add a new "Our Coffees" section to the Hellers Kaffees website featuring all coffees from Rozali Coffee. The section will be placed directly after the hero section and will include:
- A grid display of all coffee cards
- Individual detail pages for each coffee with complete information
- Design matching the existing Hellers Kaffees aesthetic

## Source Website
**Rozali Coffee Filter Selection**: https://rozalicoffee.de/collections/filter-selection

## Requirements

### 1. Coffee Data Collection
- Extract **ALL** coffees from Rozali Coffee website
- Include both individual coffees and bundles
- Use only the **first image** from each coffee's image gallery
- Collect complete information for detail pages

### 2. Information to Extract

#### For Coffee Cards (Listing):
- Coffee name
- Origin (country)
- Price (from price + per kg price)
- Main product image URL (first image only)
- Status badges (Sold Out, NEW)
- Slug for detail page URL

#### For Detail Pages:
- All card information above
- Full description
- Flavour profile (list of flavours)
- Roast level (Dark/Light)
- Flavour type (Dark chocolate / Fruity / floral)
- Acidity level (Low / High)
- Producer story:
  - Producer name/title
  - Subtitle/location
  - Full narrative content
- Coffee details (if available)
- Processing method (if available)
- How to brew information (if available)

### 3. Display Requirements
- **Grid layout only** - no filters or search functionality
- Display all coffees in a responsive grid
- Match existing card design from brew methods section
- Place section directly after hero section (before brew-methods section)

## Implementation Structure

### File Structure
```
src/
├── data/
│   └── coffees.json          # All coffee data
├── partials/
│   └── coffee-cards.njk      # Coffee grid partial
├── layouts/
│   └── coffee-detail.njk     # Detail page layout
├── index.njk                  # Add coffee section here
└── [coffee-slug].njk          # Individual coffee detail pages
```

### Data Structure (coffees.json)

```json
[
  {
    "name": "Hendra Maulizar",
    "slug": "hendra-maulizar",
    "origin": "Indonesia",
    "price": "€19,00",
    "pricePerKg": "€95,00/kg",
    "image": "https://rozalicoffee.de/cdn/shop/files/hendra-maulizar_product_retail_1800x1800.png?v=1754980110",
    "description": "Sweet and juicy with Kenyan-like currant notes, white peach acidity and elegant white flowers.",
    "flavourProfile": ["Blackcurrant", "White Peach", "Green Apple", "White Flowers"],
    "roastLevel": "Light",
    "flavourType": "Fruity / floral",
    "acidity": "High",
    "producerStory": {
      "title": "Hendra Maulizar",
      "subtitle": "Gayo Avatara",
      "content": "Full producer story paragraph(s)..."
    },
    "soldOut": true,
    "isNew": false,
    "category": "Micro Lot",
    "processingMethod": "Washed",
    "coffeeDetails": {},
    "howToBrew": {}
  }
]
```

## Implementation Steps

### Step 1: Data Collection
1. Visit https://rozalicoffee.de/collections/filter-selection
2. Extract all coffee products from the listing page
3. For each coffee:
   - Click through to detail page
   - Extract main product image URL (first image)
   - Extract all detail information
   - Note status (Sold Out, NEW)
4. Create `src/data/coffees.json` with complete data for all coffees

### Step 2: Coffee Cards Partial
1. Create `src/partials/coffee-cards.njk`
2. Use Eleventy loop to iterate through `coffees.json`
3. Render cards using existing `.card` and `.cards-grid` classes
4. Include:
   - Image with lazy loading
   - Coffee name
   - Origin badge
   - Price display
   - Status badges (Sold Out, NEW)
   - Link to detail page
5. Match styling with existing brew method cards

### Step 3: Add Section to Index
1. Edit `src/index.njk`
2. Add coffee section right after hero card (before brew-methods section)
3. Include section header:
   - Label: "Unsere Kaffees"
   - Heading: "Entdecken Sie unsere Auswahl"
   - Description: "Hochwertige Spezialitätenkaffees aus aller Welt"
4. Include coffee-cards partial

### Step 4: Detail Page Layout
1. Create `src/layouts/coffee-detail.njk`
2. Base layout on existing page structure
3. Include sections:
   - Hero image section
   - Coffee info (name, origin, description, price)
   - Flavour profile visualization
   - Producer story section
   - Additional details (if available)
4. Match design with existing storytelling sections

### Step 5: Individual Coffee Pages
1. Create individual `.njk` files for each coffee in `src/`
2. Use coffee-detail layout
3. Include all information from Rozali Coffee detail pages
4. Ensure proper slug-based URLs

### Step 6: Styling
1. Add CSS for coffee cards (reuse existing card styles)
2. Add CSS for coffee detail pages
3. Ensure dark mode compatibility
4. Ensure responsive design
5. Match existing design language:
   - Colors (accent-terracotta, accent-sage)
   - Typography
   - Spacing and layout
   - Hover effects

### Step 7: Navigation
1. Update navigation if needed (coffee section should be accessible)
2. Ensure proper linking between cards and detail pages
3. Add breadcrumbs or back navigation on detail pages

## Design Specifications

### Coffee Cards
- Use `.cards-grid` layout (same as brew methods)
- Card structure:
  ```html
  <article class="card">
    <div class="image-container">
      <img src="..." alt="...">
      <div class="card-badges">
        <!-- Sold Out or NEW badges -->
      </div>
    </div>
    <h3 class="title">Coffee Name</h3>
    <p class="origin">Origin</p>
    <p class="price">Price</p>
    <a class="link-overlay" href="..."></a>
  </article>
  ```

### Detail Page Sections
1. **Hero Image**: Full-width image at top
2. **Coffee Info**: Name, origin, description, price
3. **Flavour Profile**: Visual representation with flavour notes
4. **Producer Story**: Storytelling section with producer information
5. **Additional Info**: Coffee details, processing, brewing tips

## Coffee List (to extract)

From the listing page, extract these coffees:

1. Hendra Maulizar (Indonesia) - Sold Out
2. Garcia Family (Brazil)
3. Inmaculada Geisha Signature (Colombia) - Sold Out
4. James Gonzales (Peru)
5. Roberto Martínez (Honduras)
6. Finca Deborah Geisha Vivid (Panama) - Sold Out
7. Ivan Villaquira (Colombia)
8. Getuya AA (Kenya)
9. Bishan Wate (Ethiopia)
10. Javier Quintero (Colombia)
11. Filter Discovery Selection (Sample)
12. Los Rodriguez Geisha (Bolivia) - Sold Out
13. Hacienda La Papaya (Ecuador) - NEW
14. Comfort Filter Selection (Bundle)
15. Juicy Filter Selection (Bundle)

**Note**: Visit each product page to get complete details and image URLs.

## Image URLs Pattern

Based on the Hendra Maulizar example:
- Main image: `https://rozalicoffee.de/cdn/shop/files/{slug}_product_retail_1800x1800.{ext}?v={timestamp}`
- Pattern varies by coffee, need to extract actual URLs from each product page

## Technical Notes

1. **Eleventy Configuration**: 
   - Coffees.json will be available as `coffees` collection
   - Use `collections.coffees` to iterate

2. **Image Handling**:
   - Use external URLs from rozalicoffee.de
   - Add proper alt text
   - Use lazy loading
   - Consider responsive images with srcset

3. **URL Structure**:
   - Detail pages: `/coffee/{slug}/` or `/{slug}.html`
   - Match existing URL patterns

4. **Performance**:
   - Lazy load images
   - Optimize image sizes if needed
   - Keep detail pages lightweight

## Testing Checklist

- [ ] All coffees display correctly in grid
- [ ] Coffee cards link to correct detail pages
- [ ] Detail pages show all information
- [ ] Images load correctly
- [ ] Responsive design works on mobile
- [ ] Dark mode works correctly
- [ ] Navigation works properly
- [ ] No broken links
- [ ] Build process completes successfully

## Future Enhancements (Not in Scope)

- Filter/search functionality
- Shopping cart integration
- Coffee comparison feature
- Related coffees section

## References

- Rozali Coffee Filter Selection: https://rozalicoffee.de/collections/filter-selection
- Existing card design: `src/partials/brew-cards.njk`
- Existing page structure: `src/index.njk`
- Existing styles: `src/styles/styles.css`

