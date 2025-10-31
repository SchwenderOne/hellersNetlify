# Brew Guides Page - Comprehensive Analysis

## Overview
The Greater Goods Roasting brew guides page is a simple, elegant layout featuring a hero section with text content followed by a grid of 9 brewing method cards (with 1 hero card at the top making 10 total).

## Page Structure Analysis

### 1. Hero/Header Section
**Location:** Top of main content area
**Content:**
- Large decorative text: "BREW GUIDES" (uppercase)
- H2 Heading: "How To Make The Perfect Cup"
- Paragraph: "The best way to brew your favorite coffee is with your favorite brew method! Here's how we do what we do. If you need help, recipes, or just wanna chat about coffee, drop us a line at training@ggroasting.com."

**Typography:**
- **H2 Styling:**
  - Font: `p22-mackinac-pro, serif` (custom serif font)
  - Size: `48.9875px` (~49px)
  - Weight: `400`
  - Color: `rgb(17, 29, 61)` (dark blue)
  - Alignment: `center`
  
- **Paragraph Styling:**
  - Font: `GTAmerica` (custom sans-serif)
  - Size: `18.1625px` (~18px)
  - Color: `rgb(17, 29, 61)` (dark blue)
  - Line-height: `27.2437px`

### 2. Cards Grid Section
**Layout:** 10 cards displayed in a grid
**Grid Configuration:**
- Container uses `display: flex` with `flex-wrap: wrap`
- **First card (hero):** Full width (1124px) at top
- **Remaining 9 cards:** 3-column grid layout (each ~315px wide)
- Responsive design with `data-grid` attribute
- Flexbox with automatic distribution

**Cards List:**
1. Hero Image (Kalita Wave - used as main header image)
2. French Press
3. AeroPress
4. Chemex
5. Origami Dripper
6. V60
7. Drip
8. Cold Brew
9. Kalita Wave
10. Home Espresso

**Card Structure:**
Each card contains:
- Image (800x800px to 3744x3744px range)
- H3 heading with brew method name
- Overlay link that makes entire card clickable

**Typography:**
- **H3 Styling:**
  - Font: `p22-mackinac-pro, serif`
  - Size: `32px`
  - Weight: `400`
  - Color: `rgb(17, 29, 61)`

**Images:**
- First card: `KALITA_WAVE_1.jpg` (1814x1210px) - used as hero
- French Press: `French_Press_Square-pichi.jpg` (1440x1440px)
- AeroPress: `Aeropress_Square-pichi.jpg` (1440x1440px)
- Chemex: `Chemex_Square-pichi.jpg` (1440x1440px)
- Origami Dripper: `GG-Origami-Brew_Guide.png` (2917x2917px)
- V60: `V60.jpg` (3744x3744px)
- Drip: `Drip_Square-pichi.jpg` (1440x1440px)
- Cold Brew: `Cold_Brew_Square-pichi.jpg` (1440x1440px)
- Kalita Wave: `KALITA_WAVE_1.jpg` (1814x1210px)
- Espresso: `Espresso_Square-pichi.jpg` (1440x1440px)

### 3. Color Palette
- **Background:** `rgb(247, 245, 244)` (very light beige/gray)
- **Text Primary:** `rgb(17, 29, 61)` (dark navy blue)
- **Text Secondary:** Same as primary
- **Overlay/Links:** Transparent overlays

### 4. Layout Specifications

**Container:**
- Max-width: `1450px`
- Horizontal padding: `50px` left and right
- Centered with automatic margins

**Spacing:**
- Cards have `20px` bottom margin
- Section padding controlled by `--PT` and `--PB` CSS variables
- Default padding: `36px` top and bottom

### 5. Responsive Behavior
The grid uses data attributes for responsive control:
- `data-grid-large`
- `data-grid-medium`
- `data-grid-small`
- CSS variables for column counts at different breakpoints

### 6. Interactive Elements
- All cards are clickable via overlay links
- Links point to blog post detail pages
- Hover effects likely applied (not tested in analysis)

### 7. Font Families Identified
1. **p22-mackinac-pro** - Serif font for headings (from Adobe Typekit)
2. **GTAmerica** - Sans-serif for body text
3. **Tenor Sans** - Loaded from CDN, possibly for accents
4. **Poppins** - Google Font, likely for UI elements

### 8. Missing Elements (As Requested)
- **NOT included:** Navigation header
- **NOT included:** Footer with newsletter signup
- **NOT included:** Carousel at bottom
- **NOT included:** Product recommendations

## Key Design Principles
1. **Minimalist approach** - Clean, uncluttered layout
2. **Visual hierarchy** - Large heading, subheading, then cards
3. **Grid consistency** - Equal-sized cards in responsive grid
4. **Typography contrast** - Serif for headings, sans-serif for body
5. **Color restraint** - Single dominant text color with light background
6. **Image focus** - Large, prominent images for each brewing method

## Technical Implementation Notes
- Uses CSS Grid/Flexbox for layout
- Custom CSS variables for spacing control
- Image optimization with responsive srcsets
- Lazy loading for images
- Accessible markup with semantic HTML

## Development Recommendations

### Tech Stack Options:
1. **React + Tailwind CSS** - Modern, component-based, utility-first CSS
2. **Next.js** - SSR capabilities, great for SEO
3. **HTML + CSS** - Pure implementation for maximum control
4. **Vue.js + Vuetify** - Component library approach

### Key Components Needed:
1. **Hero Section** - Text container with H2 and paragraph
2. **Card Grid** - Responsive grid container
3. **Brew Card** - Image + title overlay component
4. **Typography System** - Font loading and scaling

### CSS Strategy:
- Use Flexbox for card layout (first card full-width, then 3-column)
- Implement responsive breakpoints
- Load custom fonts (Adobe Typekit or similar)
- Create reusable card component styles
- Ensure proper aspect ratios for images

## Development Plan

### Phase 1: Setup & Structure
1. **Create project structure**
   - Choose tech stack (recommend HTML/CSS/JS for simplicity, or React + Tailwind)
   - Set up file structure
   - Install dependencies if needed

2. **Set up asset management**
   - Create assets folder for images
   - Download/optimize images from the website
   - Set up font loading (p22-mackinac-pro, GTAmerica)

### Phase 2: Base Layout
1. **Hero Section**
   - Create centered container (max-width: 1450px, padding: 50px)
   - Add "BREW GUIDES" decorative text (uppercase)
   - Implement H2 with proper typography
   - Add paragraph with GTAmerica font

2. **Card Grid Container**
   - Create flex container with wrap
   - Set up proper spacing and gaps
   - Ensure responsive behavior

### Phase 3: Card Components
1. **Hero Card (First Card)**
   - Full width layout
   - Kalita Wave image
   - Proper aspect ratio maintenance

2. **Standard Cards (Cards 2-10)**
   - Fixed width (~315px) or use flex-basis
   - Maintain square-ish aspect ratio
   - Add image with object-fit: cover
   - Implement overlay link
   - Add H3 heading at bottom

3. **Card Styling**
   - Position overlay link absolutely over entire card
   - Style H3 with proper typography
   - Add hover effects

### Phase 4: Typography & Styling
1. **Font Loading**
   - Load p22-mackinac-pro from Adobe Typekit or use fallback
   - Load GTAmerica or use close alternative
   - Set up font-display strategies

2. **Color System**
   - Implement color variables
   - Background: #F7F5F4
   - Text: #111D3D

3. **Spacing System**
   - Define consistent spacing scale
   - Apply margins and padding appropriately

### Phase 5: Responsive Design
1. **Breakpoints**
   - Mobile (< 768px): 1 column layout
   - Tablet (768px - 1024px): 2 column layout
   - Desktop (> 1024px): 3 column layout with hero full-width

2. **Image Optimization**
   - Implement responsive images with srcset
   - Use appropriate sizes for different viewports
   - Add lazy loading

### Phase 6: Final Touches
1. **Accessibility**
   - Ensure proper semantic HTML
   - Add alt text to images
   - Test keyboard navigation
   - Check color contrast ratios

2. **Cross-browser Testing**
   - Test on Chrome, Firefox, Safari, Edge
   - Verify flexbox support
   - Check font loading

3. **Performance**
   - Optimize images (WebP format if possible)
   - Minimize CSS/JS
   - Test page load speed

## Technical Specifications Summary

### Layout Structure
```
<section class="brew-guides-container">
  <div class="wrapper" style="max-width: 1450px; padding: 50px;">
    <!-- Hero Text Section -->
    <div class="hero-text">
      <div class="decorative">BREW GUIDES</div>
      <h2>How To Make The Perfect Cup</h2>
      <p>...</p>
    </div>
    
    <!-- Cards Grid -->
    <div class="cards-grid" style="display: flex; flex-wrap: wrap;">
      <!-- Hero Card - Full Width -->
      <div class="card hero-card" style="width: 100%;">
        <div class="image-container" style="position: relative;">
          <img src="..." class="card-image" style="width: 100%; object-fit: cover;">
          <a href="#" class="link-overlay" style="position: absolute; inset: 0; z-index: 20;"></a>
          <h3>Brew Method Name</h3>
        </div>
      </div>
      
      <!-- Standard Cards - 3 per row -->
      <div class="card standard-card" style="width: calc(33.333% - gap);">
        <!-- Same structure as hero card -->
      </div>
      <!-- ... 8 more cards -->
    </div>
  </div>
</section>
```

### Key CSS Properties
- Container: `max-width: 1450px`, horizontal padding: `50px`
- Grid: `display: flex`, `flex-wrap: wrap`
- Hero card: `width: 100%`
- Standard cards: `flex-basis: 33.333%` or fixed width
- Image: `width: 100%`, `object-fit: cover`
- Link overlay: `position: absolute`, `inset: 0`
- Background: `#F7F5F4`
- Text color: `#111D3D`

### Typography
- **H2:** p22-mackinac-pro, 49px, weight 400
- **H3:** p22-mackinac-pro, 32px, weight 400
- **Paragraph:** GTAmerica, 18px
- All text centered in hero section

