# Hellers Kaffees Brew Guides — Project Documentation

This document is the single source of truth for the Hellers Kaffees brew guides project. It captures the current implementation, design system, content decisions, testing workflow, and the agreed roadmap for future enhancements. Use it as the reference point when continuing development in a new session.

**Last Updated:** November 2025 (Phase 4 & 5 completed)

---

## 1. Project Overview
- **Objective:** Recreate the brewing guides experience from greatergoodsroasting.com as a branded site for *Hellers Kaffees* with localized (German) content and authentic footer info.
- **Tech Stack:** Static **HTML** and **CSS** with JavaScript for interactivity. Browser-based validation and screenshots handled via the Playwright MCP integration.
- **Current Scope:** Landing page with hero + 9 brew guide cards (`index.html`), complete recipe pages for all 9 brew methods with calculator widget, events page (`events.html`) with functional registration modal, menu page (`menu.html`) with coffee and pastries, global sticky navigation header, and comprehensive footer. All recipe cards linked to their respective pages.
- **Localization:** Entire site content and UI strings are in **German**. Maintain German copy in future additions unless explicitly instructed otherwise.

---

## 2. Repository Structure
| File | Purpose |
| ---- | ------- |
| `index.html` | Landing page with hero card + 9 brew method cards, storytelling sections, visit section, and footer. All recipe cards linked to their respective pages. |
| `french-press.html` | Full recipe detail page for the French Press method with progress indicator and recipe calculator widget. |
| `aeropress.html` | Full recipe detail page for the AeroPress method with recipe calculator widget. |
| `chemex.html` | Full recipe detail page for the Chemex method with recipe calculator widget. |
| `origami-dripper.html` | Full recipe detail page for the Origami Dripper method. |
| `v60.html` | Full recipe detail page for the V60 method. |
| `drip.html` | Full recipe detail page for the Drip method. |
| `cold-brew.html` | Full recipe detail page for the Cold Brew method. |
| `kalita-wave.html` | Full recipe detail page for the Kalita Wave method. |
| `home-espresso.html` | Full recipe detail page for the Home Espresso method. |
| `events.html` | Events and workshops page with event cards, dates, registration buttons, and functional registration modal. |
| `menu.html` | Menu page with coffee and pastry offerings, featuring item cards with images, descriptions, prices, and tags. Responsive 2-column grid layout. |
| `styles.css` | Global and page-specific styles for all HTML files, including dark mode support, recipe calculator, menu items, modal styles, and header navigation. |
| `scripts/main.js` | Globally deferred script managing motion preferences, parallax, scroll animations, progress indicator, dark mode toggle, header navigation, recipe calculator, recipe timer widgets, event registration modal, and newsletter form (EmailJS). |
| `favicon.svg` | Coffee-themed SVG favicon for the website. |
| `assets/` | Placeholder directory for icons, SVGs, and future static assets. |
| `BREW_GUIDES_ANALYSIS.md` | Original deep-dive analysis of the reference site. |
| `ANALYSIS_SUMMARY.md` | Condensed summary of the initial analysis. |
| `DEVELOPMENT_PLAN.md` | Detailed multi-phase development plan for roadmap implementation. |
| `WEBSITE_ANALYSIS.md` | Comprehensive website analysis with improvement recommendations. |
| `IMPROVEMENT_ROADMAP.md` | Detailed improvement roadmap with prioritized enhancement suggestions. |
| `AUDIT_RESPONSE_AND_PLAN.md` | Comprehensive audit response and development plan based on UX/feature audit (November 2025). |
| `EMAILJS_SETUP_GUIDE.md` | Step-by-step guide for configuring EmailJS newsletter integration. |
| `PHASE4_PROGRESS.md` | Phase 4 progress tracking and status updates. |
| `PROJECT_DOCUMENTATION.md` | **This document.** |

No build tooling is required; open the HTML files directly or via a lightweight static server.

---

## 3. Current Implementation Snapshot
- **Hero card (landing):** Full viewport width hero section with subtle parallax scroll effect (disabled on mobile ≤768px and for `prefers-reduced-motion`). Hero card uses viewport width (`100vw`) with precise CSS variable-based positioning to align exactly with viewport edges (no left/right gaps). Hero image is 200px wider than viewport (100px on mobile) and centered with negative margins to prevent white space during parallax scrolling. Overlay includes uppercase label (`.label`), heading, description, and CTA button ("Menü") that links to `menu.html`. JavaScript handles smooth scrolling for anchor links (`#`) and allows normal navigation for page links. Parallax initialized after page load with proper position tracking.
- **Brew cards:** 9 cards with hover effects (`translateY(-8px) scale(1.02)` with shadow), difficulty badges (Einfach/Mittel/Fortgeschritten with color coding: sage green, terracotta, dark navy), time badges (brew duration in minutes/hours), and inline SVG icons (star icon for difficulty, clock icon for time). Badges positioned absolutely in top-left corner with backdrop blur. Cards have smooth transitions respecting `prefers-reduced-motion`. All 9 cards are linked to their respective recipe pages. All cards have transparent backgrounds to prevent white boxes on hover. Cards have rounded corners (`border-radius: var(--radius-lg)`) that remain rounded during hover animations. Card titles positioned with 4px right margin for visual alignment. Cards animate on scroll using Intersection Observer.
- **Storytelling Sections:** Two new sections added below the brew cards:
  - **Brew Basics Infographic:** Three-column grid (responsive: 3→2→1 columns) displaying grind sizes, coffee-to-water ratios, and water temperature with visual representations. Each item has hover effects and animates on scroll.
  - **Farm-to-Cup Timeline:** Horizontal timeline (vertical on mobile) showing the coffee journey: Anbau (Farming) → Rösten (Roasting) → Brühen (Brewing). Each step includes an icon, heading, and description. Timeline items animate individually with staggered delays.
- **Visit Section:** "Besuchen Sie uns" section with address information, "In Google Maps öffnen" button, and embedded Google Maps iframe. Responsive layout with map showing first on mobile/tablet. Grid layout: info panel + map (1fr / 1.5fr).
- **Recipe Pages:** Complete recipe pages for all 9 brew methods (French Press, AeroPress, Chemex, Origami Dripper, V60, Drip, Cold Brew, Kalita Wave, Home Espresso). Each page includes intro, specifications, step-by-step instructions, and navigation back to the landing page; all content localized in German. All pages include scroll progress indicator at top (3px fixed bar, gradient terracotta to sage) and recipe timer widget with step-by-step notifications. Recipe calculator widget available on selected pages.
- **Recipe Calculator Widget:** Interactive calculator allowing users to adjust recipe amounts based on desired servings. Features: adjustable servings input (1-20), metric/imperial unit toggle, real-time calculation of coffee and water amounts, displays in grams/tablespoons and milliliters/cups. Responsive design with dark mode support. ✅ **Implemented on all 9 recipe pages** with method-specific ratios (French Press 1:14, AeroPress 1:15, Chemex 1:17, V60 1:16, Drip 1:12, Kalita Wave 1:16, Origami Dripper 1:16, Cold Brew 1:8, Home Espresso 1:2).
- **Events page:** `events.html` page featuring 6 event/workshop cards with images, dates, durations, descriptions, participant limits, pricing, and skill levels. Includes functional "Jetzt anmelden" buttons that open registration modal. Responsive 2-column grid (1 column on mobile). Linked from footer navigation.
- **Menu page:** `menu.html` page featuring coffee and pastry offerings organized in two sections. Coffee section includes 8 items (Espresso, Cappuccino, Latte Macchiato, Flat White, Filterkaffee, Cold Brew, Cortado, Americano). Pastries section includes 6 items (Butter-Croissant, Schokoladen-Croissant, Muffin, Kuchenstück, Zimtschnecke, Schokoladen-Brownie). Each item card includes image, title, price, description, and tags. Responsive 2-column grid layout (1 column on mobile/tablet ≤1024px). Images from Unsplash with proper alt text. All content in German. Linked from hero button on homepage.
- **Event Registration Modal:** Fully functional modal dialog for event registration. Features include: form with name, email, phone, message, and newsletter opt-in fields; client-side validation; focus trapping for keyboard navigation; ESC key and overlay click to close; success/error messages; accessible with proper ARIA attributes; dark mode support; responsive design. Ready for backend integration (commented API call code included).
- **Footer:** Branded for Hellers Kaffees with address, hours, placeholder phone (`nicht angegeben`), newsletter sign-up (disabled with "Bald verfügbar" message), and new events link. Uses updated accent colors for buttons and improved typography hierarchy. Footer grid expanded to 5 columns (3 on tablet, 1 on mobile).
- **Global Navigation Header:** ✅ **Phase 5** - Sticky header navigation across all pages with logo, main navigation links (Zubereitungsmethoden, Menü, Veranstaltungen, Kontakt), dark mode toggle, and mobile hamburger menu. Header remains sticky throughout entire page scroll. Mobile menu slides in from left with overlay. Active link detection and smooth scrolling for anchor links. Responsive design with breakpoint at 768px.
- **Dark Mode Toggle:** ✅ **Phase 5** - Moved from floating action button (FAB) to header navigation. Uses same design as previous FAB (pill-shaped button with border, hover effects). Shows icon and label for the mode you'll switch TO (moon with "Dunkel" in light mode, sun with "Hell" in dark mode). Toggles between light and dark themes. Preference persisted via `localStorage`. System preference detection on first visit. Dark mode uses grey-based palette (not blue). All components styled for dark mode with proper contrast. ✅ **Phase 4** - Fixed contrast issues in dark mode (card titles, Basics section, Journey section, infographic labels).
- **Scroll Animations:** Sections animate on scroll using Intersection Observer API. Fade + slide effect (opacity 0→1, translateY 30px→0). Staggered animations for grid children. Completely disabled when `prefers-reduced-motion` is active.
- **Skript-Funktionalität:** `scripts/main.js` verwaltet `no-js`-Klasse, `prefers-reduced-motion`-Tracking, Parallax-Effekt für Hero-Bild, Hero-CTA-Button (erkennt Anchor-Links für Smooth-Scroll und erlaubt normale Navigation für Seitenlinks), Scroll-Animationen via Intersection Observer, Progress-Indikator für Rezeptseiten, Header Navigation (mobile menu toggle, scroll detection, active link highlighting, smooth scrolling), Dark-Mode-Toggle mit localStorage-Persistenz und System-Präferenz-Erkennung (sowohl Header- als auch Footer-Toggle unterstützt), Recipe Calculator Widget (servings adjustment, unit conversion), Recipe Timer Widget (countdown, step notifications, sound alerts, pause/resume), Event Registration Modal (form handling, validation, focus trapping), Newsletter Form (EmailJS integration), und `window.hellers.env` Namespace.

All typography currently relies on Adobe Typekit (`p22-mackinac-pro`) and `GTAmerica` (with fallbacks) via CSS. Google Fonts includes Poppins for general sans-serif fallback.

---

## 4. Design System (Current)
- **Colors & Tokens (Light Mode):**
  - Background (`--bg`): `#f7f5f4`
  - Surface (`--surface`): `#ffffff`
  - Primary text (`--text`): `#111d3d`
  - Muted text (`--text-muted`): `#5c6785`
  - Accent beige (`--accent-beige`): `#e6dccf`
  - Accent terrakotta (`--accent-terracotta`): `#c97a5c` (Hero-Label, Buttons)
  - Accent Salbei (`--accent-sage`): `#7e9c87` (Sekundäre Labels)
  - Accent Ink (`--accent-ink`): `#0e1a3a` (Footer-Hintergrund)
- **Colors & Tokens (Dark Mode):**
  - Background (`--bg-dark`): `#1a1a1a` (dark grey)
  - Surface (`--surface-dark`): `#2a2a2a` (medium grey)
  - Primary text (`--text-dark`): `#f5f5f5` (light grey/off-white)
  - Muted text (`--text-muted-dark`): `#b0b0b0` (medium grey)
  - Accent terrakotta (`--accent-terracotta-dark`): `#e09a7a` (brighter variant)
  - Accent Salbei (`--accent-sage-dark`): `#94c2a8` (brighter variant)
  - Accent Ink (`--accent-ink`): `#1f1f1f` (footer in dark mode)
  - Dark mode uses grey-based palette (not blue) for better readability and modern aesthetic. All components have dark mode overrides for proper contrast and visual hierarchy.
- **Typography & Scale:**
  - Serif: `--font-serif` → `p22-mackinac-pro`
  - Sans: `--font-sans` → `GTAmerica` mit Poppins/System-Fallback
  - Type-Scale via `clamp()` Variablen (`--font-size-display`, `--font-size-h1` … `--font-size-label`), Körpertext `--font-size-body` (18px) und Metadaten `--font-size-small` (15px).
  - `.label` und `h4` nutzen nun die Sans-Serif in Versalien mit `letter-spacing` für Sektionstitel.
  - Metadaten und Spezifikationen verwenden `--text-muted` für klarere Hierarchie.
- **Layout:**
  - Wrapper width: 1450px max with 50px horizontal padding (24px on tablet ≤768px, 20px on mobile ≤640px). CSS variable `--wrapper-padding` used for consistent spacing.
  - Hero card uses `100vw` width with `left: calc(-1 * var(--wrapper-padding))` to break out to viewport edges. Image container uses `overflow: hidden` to clip larger image (200px wider on desktop, 100px on mobile).
  - Cards grid uses flexbox with responsive breakpoints at 1024px (2 columns) and 640px (single column). Cards have no padding/margin/background to prevent white boxes on hover. Cards have `border-radius: var(--radius-lg)` with `overflow: hidden` to maintain rounded corners during hover animations.
  - Card titles: 4px right margin (`margin: 12px 0 0 4px`) for visual alignment.
  - Brew Basics Infographic: 3-column grid (2 columns at ≤1024px, 1 column at ≤640px).
  - Farm-to-Cup Timeline: Horizontal layout (flex-row) on desktop, vertical (flex-column) at ≤1024px.
  - Visit Section: Grid layout (1fr / 1.5fr) with map and info panel. Stacks vertically at ≤1024px, map shows first on mobile/tablet.
  - Events Grid: 2-column grid on desktop (1 column at ≤640px).
  - Menu Grid: 2-column grid on desktop (1 column at ≤1024px). Menu items use card layout with image, content, and tags.
  - Footer Grid: 5 columns on desktop (3 columns at ≤1024px, 1 column at ≤640px).
  - Recipe pages use a 1fr / 1.5fr CSS grid (specifications + instructions) that stacks on tablet/mobile. Recipe calculator and timer widgets are positioned between secondary image and specifications section.
  - Header Navigation: Sticky header with flexbox layout, responsive mobile menu at ≤768px breakpoint.

---

## 5. Assets & External Data
- **Image Sources:** 
  - Hero and brew method card images: Hosted on `greatergoodsroasting.com`. CDN URLs from the original site.
  - Menu page images: Unsplash CDN URLs with proper sizing parameters (`w=800&h=600&fit=crop`). All images include descriptive alt text and lazy loading.
- **Location Data:** `Sybelstraße 19, 10629 Berlin`. Hours localized to German abbreviations (Mo/Di/Mi/etc.). Phone currently `nicht angegeben`; update if the real number becomes available.
- **Map Embed:** ✅ Google Maps embed implemented in "Besuchen Sie uns" section with responsive iframe. Includes address info panel and "In Google Maps öffnen" button linking to Google Maps search.

If new assets are required (e.g., icons, illustrations), store links here and ensure licensing compatibility.

---

## 6. Testing & Tooling
- **Local Preview:** Open `index.html` or `french-press.html` directly in the browser or use a static server (`python -m http.server`), noting instructions to prefer absolute paths for tool commands.
- **Playwright MCP:** Use `browser_navigate` to open local files (`file:///Users/schwenderone/Documents/brewtest/index.html`) and `browser_take_screenshot` for documentation. Monitor console via `browser_console_messages` before delivery. Verified with Playwright: hero alignment (viewport edges), image coverage during scrolling (no white space), parallax behavior, badge positioning, and responsive breakpoints.
- **Responsive Checks:** Use browser dev tools or Playwright evaluation to ensure breakpoints behave as expected. Verified breakpoints: 1024px (2 columns), 640px (single column), hero positioning adjusts for mobile padding (20px). No automated tests exist yet.

---

## 7. Roadmap — Approved Enhancements
The user selected the following features for the next development phase. Treat this list as prioritized backlog items. Each bullet includes key requirements and notes.

### 7.1 Hero Enhancements ✅ **COMPLETED**
- **Parallax Header:** ✅ Implemented subtle parallax effect (0.15 speed, max 50px offset) with proper initialization after page load. Disabled on mobile (≤768px) and respects `prefers-reduced-motion`. Image is 200px wider than viewport (100px on mobile) with negative margins to prevent white space during scrolling.
- **Hero CTA Panel:** ✅ Added "Menü" button with terracotta accent styling, links to `menu.html` page. JavaScript handles both anchor links (smooth scroll) and page links (normal navigation). Proper ARIA labels and focus states. Button includes hover effects respecting reduced motion.

### 7.2 Brew Card Interactions ✅ **COMPLETED**
All three interaction upgrades implemented:
1. **Hover Interactions:** ✅ Smooth transitions (`translateY(-8px) scale(1.02)` with enhanced shadow), fully respects `prefers-reduced-motion` (transform disabled, shadow-only on reduced motion).
2. **Tag Badges:** ✅ Badge system with difficulty taxonomy (Einfach=sage, Mittel=terracotta, Fortgeschritten=navy) and time badges (brew duration). All labels in German, positioned consistently in top-left with backdrop blur.
3. **Illustrative Icons:** ✅ Inline SVG icons (star for difficulty, clock for time) with proper sizing and color inheritance. Icons integrated into badges.

### 7.3 Storytelling Sections (Landing Page) ✅ **COMPLETED**
- **Brew Basics Infographic:** ✅ Implemented responsive three-column grid (3→2→1 columns) with visual representations of grind sizes (Fein/Mittel/Grob), coffee-to-water ratios (1:12/1:16/1:18), and water temperature scale (85°C/93-96°C/100°C+). Each infographic item includes SVG icon, heading, visual content, and description. All content in German. Hover effects and scroll animations implemented.
- **Farm-to-Cup Timeline:** ✅ Created horizontal timeline (vertical on mobile ≤1024px) with three steps: Anbau (Farming), Rösten (Roasting), Brühen (Brewing). Each item includes SVG icon, heading, and description. Decorative dashed connectors between steps. Icons animate on hover. Scroll animations with staggered delays.

### 7.4 Visual Refresh ✅ **COMPLETED**
- **Accent Color Palette:** ✅ Extended with terracotta (`--accent-terracotta: #c97a5c`) and sage (`--accent-sage: #7e9c87`), plus ink (`--accent-ink: #0e1a3a`) for footer. All colors applied to buttons, badges, labels. Dark mode palette variables defined for Phase 8.
- **Font Hierarchy:** ✅ Refined typography system with `clamp()`-based responsive type scale, `.label` class for uppercase section labels (sans-serif with letter-spacing), clear distinction between serif headings and sans body text. Consistent usage across all pages.

### 7.5 Contact/Location ✅ **COMPLETED**
- **Map Embed:** ✅ Implemented "Besuchen Sie uns" section with responsive Google Maps iframe embed, address information panel with location icon, and "In Google Maps öffnen" button. Map container uses aspect-ratio technique (75% padding-bottom) for responsive sizing. Section uses grid layout (1fr / 1.5fr) with map showing first on mobile/tablet. All content in German.

### 7.6 New Content Page ✅ **COMPLETED**
- **Events/Workshops Page:** ✅ Created `events.html` with 6 event/workshop cards featuring:
  - Event images with status badges (Bald/Regelmäßig)
  - Date/time information with calendar icon
  - Duration with clock icon
  - Event titles and descriptions
  - Participant limits, pricing, and skill levels
  - "Jetzt anmelden" buttons (or "Mehr erfahren" for recurring events)
  - Footer contact section
  - Navigation back to homepage
  - All content in German with placeholder event data
  - Responsive 2-column grid (1 column on mobile)
  - Linked from footer navigation section

### 7.7 Motion & Interaction Enhancements ✅ **COMPLETED**
Both motion upgrades implemented:
1. **Scroll-triggered Animations:** ✅ Implemented using Intersection Observer API. Sections (storytelling sections, infographic items, timeline items, visit section, event cards) fade and slide into view (opacity 0→1, translateY 30px→0) with 600ms transitions. Staggered delays for child elements in grids (100ms increments). Completely disabled when `prefers-reduced-motion` is active. Elements unobserved after animation for performance.
2. **Progress Indicator:** ✅ Fixed 3px progress bar at top of recipe pages (e.g., `french-press.html`). Gradient background (terracotta to sage). Updates based on scroll position using throttled `requestAnimationFrame`. Includes ARIA attributes (`role="progressbar"`, `aria-valuenow`). Hidden when `prefers-reduced-motion` is active.

### 7.8 Accessibility & Polish ✅ **COMPLETED**
All three polishing items implemented:
1. **Dark Mode Toggle:** ✅ Fixed toggle button in bottom-right corner with sun/moon icon and "Dunkelmodus" label (hidden on mobile). Toggles between light and dark themes. Preference persisted via `localStorage` with defensive error handling. Dark mode uses grey-based palette:
   - Background: `#1a1a1a` (dark grey)
   - Surface: `#2a2a2a` (medium grey)
   - Text: `#f5f5f5` (light grey)
   - All components have dark mode overrides for proper contrast. Button includes proper ARIA attributes (`aria-label`, `aria-pressed`).
2. **Microcopy Localization:** ✅ Reviewed and verified all alt texts, button labels, ARIA labels, placeholders, and UI strings are in German. Consistent terminology throughout.
3. **Responsive Enhancements:** ✅ Added 768px breakpoint for tablet optimizations. Fine-tuned spacing, typography, and stacking order across all breakpoints. Improved section padding on tablet. Enhanced footer grid responsiveness (5→3→1 columns).

Document any additional decisions or assets added during implementation back into this file.

---

## 8. Technical Implementation Notes

### Hero Section Positioning
The hero card uses a viewport-based positioning strategy to achieve full-width display while breaking out of the wrapper constraints:
- **Width:** `100vw` to match viewport width exactly
- **Height:** `100vh` to match viewport height exactly (fills screen on page load)
- **Positioning:** `left: calc(-1 * var(--wrapper-padding))` to break out of wrapper padding (50px desktop, 20px mobile)
- **Margin:** `margin-right: calc(-1 * var(--wrapper-padding) - 50vw + 100%)` to extend to viewport right edge
- **Image Container:** `height: 100vh` with `object-fit: cover` to fill viewport
- **Overlay Card:** Centered both horizontally and vertically using `top: 50%; transform: translate(-50%, -50%)`
- **Result:** Hero aligns perfectly with viewport edges (0px) and fills entire viewport height

### Parallax Implementation
- **Speed:** 0.15 multiplier for subtle effect (max 50px offset)
- **Initialization:** Waits for page load and image load before calculating position
- **Performance:** Uses `requestAnimationFrame` with throttling, disabled on mobile (≤768px)
- **Image Coverage:** Hero image is 200px wider than viewport (100px mobile) with `margin-left: -100px` (-50px mobile) to center the larger image, preventing white space during parallax movement
- **Reduced Motion:** Parallax completely disabled when `prefers-reduced-motion: reduce` is detected

### Badge System
- **Position:** Absolute positioning in top-left corner of image container (`top: 12px, left: 12px`)
- **Styling:** Backdrop blur with semi-transparent backgrounds, uppercase text with letter-spacing
- **Taxonomy:** Difficulty (Einfach/Mittel/Fortgeschritten) with color coding, Time (brew duration in German format)
- **Icons:** Inline SVG (14x14px) using `currentColor` for theming

### Card Hover Effects
- **Transform:** `translateY(-8px) scale(1.02)` with enhanced shadow
- **Image Zoom:** Image scales to 1.05 on card hover
- **Accessibility:** All transforms disabled when `prefers-reduced-motion` is active, shadow-only hover effect maintained

### Scroll-Triggered Animations
- **Implementation:** Intersection Observer API with `rootMargin: '0px 0px -50px 0px'` and `threshold: 0.1`
- **Animation:** Opacity 0→1 and translateY 30px→0 over 600ms ease-out
- **Stagger:** Child elements in grids have 100ms delay increments (up to 500ms for 6th child)
- **Performance:** Elements unobserved after animation. Observer only runs when `prefers-reduced-motion` is false
- **Affected Elements:** `.storytelling-section`, `.visit-section`, `.infographic-item`, `.timeline-item`, `.event-card`, `.menu-item`, `.recipe-calculator`

### Hero CTA Button
- **Implementation:** `initHeroCTA()` function in `scripts/main.js` (lines 141-169)
- **Behavior:** Smart link handling that distinguishes between anchor links and page links
  - Anchor links (starting with `#`): Prevents default behavior and uses smooth scroll to target element
  - Page links (e.g., `menu.html`): Allows default browser navigation
- **Current Configuration:** Button text "Menü" links to `menu.html` page
- **Styling:** Terracotta accent color with hover effects, respects `prefers-reduced-motion`
- **Accessibility:** Proper ARIA labels and focus states

### Progress Indicator
- **Position:** Fixed at top of viewport (3px height, full width)
- **Calculation:** Based on scroll position relative to document height (rounded to nearest percent)
- **Update:** Throttled via `requestAnimationFrame` on scroll events
- **Styling:** Gradient from terracotta to sage with subtle shadow
- **Accessibility:** Full ARIA support (`role="progressbar"`, `aria-valuenow`, `aria-label`)
- **Visibility:** Hidden when `prefers-reduced-motion` is active

### Header Navigation (Phase 5)
- **Location:** Sticky header at top of all pages (`<header class="site-header">`)
- **Components:**
  - Logo: "Hellers Kaffees" linking to homepage
  - Main Navigation: Zubereitungsmethoden, Menü, Veranstaltungen, Kontakt
  - Dark Mode Toggle: Pill-shaped button matching old FAB design
  - Mobile Menu Toggle: Hamburger icon (visible at ≤768px)
- **Features:**
  - Sticky positioning throughout entire page (`position: sticky; top: 0`)
  - Scroll detection adds shadow when scrolled (`is-scrolled` class)
  - Active link highlighting based on current page/hash
  - Smooth scrolling for anchor links with header offset (80px)
  - Mobile menu slides in from left with overlay backdrop
  - Menu closes on link click, ESC key, or overlay click
  - Focus trapping in mobile menu
  - Responsive breakpoint at 768px
- **JavaScript:** `initHeaderNavigation()` function in `scripts/main.js` (lines 388-509)
- **CSS:** Header styles in `styles.css` (lines 101-373)
- **Accessibility:** Proper ARIA labels, keyboard navigation, focus management

### Dark Mode Implementation (Phase 4 & 5)
- **Toggle Location:** ✅ **Phase 5** - Moved from floating action button to header navigation
- **Toggle Design:** Pill-shaped button with 2px terracotta border, matching old FAB design
- **Icon:** Clean SVG icons that show what mode you'll switch TO (not current mode):
  - Light mode: Moon icon with "Dunkel" label (switches to dark)
  - Dark mode: Sun icon with "Hell" label (switches to light)
- **Persistence:** `localStorage` key `hellers-theme` stores 'light' or 'dark' preference
- **Initialization:** Reads saved preference on page load, or system preference if no saved preference exists
- **System Preference:** Automatically detects `prefers-color-scheme: dark` on first visit and respects OS theme setting
- **CSS Variables:** Dark mode variables switch via `[data-theme="dark"]` selector on root element
- **Color Palette:** Grey-based (not blue) - `#1a1a1a` background, `#2a2a2a` surface, `#f5f5f5` text
- **Component Overrides:** All cards, badges, overlays, inputs, calculator widget, timer widget, modal, and borders have dark mode specific styling for proper contrast
- **Contrast Fixes (Phase 4):** ✅ Fixed contrast issues:
  - Card titles: Added text-shadow for visibility in dark mode
  - Basics section: Improved background opacity and text contrast
  - Journey section: Enhanced text colors for readability
  - Infographic labels: Better contrast for ratio and temperature displays

### Recipe Calculator Widget (Phase 4)
- **Location:** Embedded in recipe pages between secondary image and specifications section
- **Status:** ✅ **Implemented on all 9 recipe pages** with method-specific configurations
- **Inputs:** Servings number (1-20), unit selector (metric/imperial)
- **Outputs:** Coffee amount (grams + tablespoons), Water amount (milliliters + cups or ounces)
- **Calculation:** Based on base amounts per serving, scales proportionally using `data-ratio` attribute
- **Method-Specific Ratios:**
  - French Press: 1:14 (2 servings default)
  - AeroPress: 1:15 (1 serving default)
  - Chemex: 1:17 (4 servings default)
  - V60: 1:16 (2 servings default)
  - Drip: 1:12 (4 servings default)
  - Kalita Wave: 1:16 (2 servings default)
  - Origami Dripper: 1:16 (2 servings default)
  - Cold Brew: 1:8 (4 servings default, with note about concentrate)
  - Home Espresso: 1:2 (1 shot default, with special note about extraction time)
- **Initialization:** Reads from `.recipe-calculator` element with `data-ratio` and `data-servings` attributes
- **Styling:** Centered card with form inputs, real-time updates on input change, dark mode support

### Recipe Timer Widget
- **Location:** Embedded in recipe pages between secondary image and specifications section (after calculator if present)
- **Implementation:** All 9 recipe pages include timer widgets with recipe-specific step times
- **Features:**
  - Countdown timer with visual display (MM:SS format)
  - Start/Pause/Reset controls with SVG icons
  - Step-by-step notifications with visual highlighting (active/completed/next states)
  - Optional sound alerts (toggle checkbox, muted by default)
  - Step notifications appear in status display with auto-hide
  - Works offline (no server required)
- **Timer Data:** Uses `data-brew-time` attribute (in minutes) to set countdown duration
- **Step Configuration:** Each timer includes 3-4 steps with `data-step-time` (in seconds) for notifications
- **Initialization:** Reads from `.recipe-timer` element, supports one timer per page
- **Styling:** Centered card matching calculator widget design, dark mode support, responsive layout
- **Accessibility:** Proper ARIA labels, keyboard navigation support, respects `prefers-reduced-motion`

### Menu Page Implementation
- **Location:** `menu.html` page with two main sections (Coffee and Pastries)
- **Layout:** Card-based grid layout matching events page design pattern
- **Coffee Section:** 8 items with images, titles, prices, descriptions, and tags
- **Pastries Section:** 6 items with images, titles, prices, descriptions, and tags
- **Styling:** Uses `.menu-item`, `.menu-item-image`, `.menu-item-content`, `.menu-item-header`, `.menu-item-price`, `.menu-item-tag` classes
- **Responsive:** 2-column grid on desktop, 1 column at ≤1024px breakpoint
- **Images:** Unsplash CDN URLs with proper alt text and lazy loading
- **Dark Mode:** Full support with proper contrast and styling
- **Navigation:** Linked from hero button on homepage, includes back link to homepage

### Event Registration Modal (Phase 4)
- **Status:** ✅ **Tested and working** - Modal opens correctly, ESC key closes, focus management works
- **Trigger:** All "Jetzt anmelden" buttons on events page with `data-event-name` and `data-event-date` attributes
- **Form Fields:** Name (required), email (required), phone (optional), message (optional), newsletter checkbox
- **Validation:** Client-side validation for required fields and email format
- **Accessibility:** Focus trapping, ESC key to close, ARIA labels, proper dialog role
- **Close Methods:** Close button (X), Cancel button, ESC key, click outside modal
- **Success Handling:** Shows success message on submission (ready for backend integration)
- **Body Scroll Lock:** Prevents background scrolling when modal is open
- **JavaScript:** `initEventModal()` function in `scripts/main.js` (lines 436-563)

### Schema.org Structured Data
- **Recipe Schema:** JSON-LD markup on all 9 recipe pages with complete recipe information (ingredients, instructions, times, yields, images)
- **Organization Schema:** Business information on homepage including address, contact, and opening hours
- **Event Schema:** Event listings on events page with dates, prices, locations, and organizers
- **Location:** All schema markup in `<script type="application/ld+json">` blocks in `<head>` section
- **Validation:** All schema follows Schema.org specifications and validates correctly

### Print Styles
- **Location:** `@media print` section in `styles.css` (lines 3506+)
- **Features:** Hides non-essential elements (header, navigation, footer, dark mode toggle, calculators, badges, links), optimizes typography, formats tables, handles page breaks
- **Optimizations:** Large readable fonts, proper spacing, clean black-and-white output

### Newsletter Form Integration (Phase 4)
- **Service:** ✅ **EmailJS** (free alternative: 200 emails/month) - Replaced Mailchimp
- **Implementation:** `initNewsletter()` function in `scripts/main.js` (lines 636-786)
- **Features:**
  - Automatically enables forms on page load (removes disabled state)
  - Hides "Bald verfügbar" message dynamically
  - Client-side email validation
  - Loading state ("Wird gesendet...") during submission
  - Success/error message display with auto-hide for success (5 seconds)
  - Accessible with ARIA attributes (`role="alert"`, `aria-live="polite"`)
  - Dark mode support for messages
  - Error handling with user-friendly messages
  - EmailJS SDK loaded on all pages via CDN
- **Configuration:** Update `EMAILJS_CONFIG` object in `scripts/main.js` (line 649)
  - Requires: Public Key, Service ID, Template ID
  - Setup guide: See `EMAILJS_SETUP_GUIDE.md` for detailed instructions
  - Get credentials from: https://www.emailjs.com/
- **CSS Classes:** `.newsletter-message`, `.newsletter-message.success`, `.newsletter-message.error`, `.newsletter-message.is-visible`
- **Form Fields:** `input[name="EMAIL"]` (required, email type)

---

## 9.1 Phase 1 Implementation Status (November 2025)

**Phase 1: Foundation** - Progress: 4 of 4 tasks completed ✅

---

## 9.2 Phase 2 Implementation Status (November 2025)

**Phase 2: Enhancement** - Progress: 6 of 6 tasks completed (100%) ✅

### ✅ Completed Tasks:

1. **Skip-to-Content Link (Accessibility):** ✅ **COMPLETE**
   - Added skip link to all 12 HTML pages
   - Hidden by default, visible on keyboard focus
   - Links to main content sections (`#brew-methods`, `#guide-content`, `#events-content`, `#menu-content`)
   - Styled with brand colors (terracotta background, sage outline on focus)
   - Dark mode support included
   - CSS: `.skip-to-content` class in `styles.css` (lines 71-101)
   - Fully WCAG compliant

2. **System Preference Detection for Dark Mode:** ✅ **COMPLETE**
   - Enhanced `initDarkMode()` function to detect `prefers-color-scheme: dark`
   - Uses system preference on first visit if no manual preference is saved
   - Respects manual toggle (doesn't auto-update after user sets preference)
   - Listens for system preference changes when no manual preference exists
   - JavaScript: Updated in `scripts/main.js` (lines 253-336)
   - Provides better UX by respecting user's OS-level theme preference

3. **Open Graph Meta Tags (Social Sharing):** ✅ **COMPLETE** (Partial - 3 pages)
   - Added to `index.html`, `french-press.html`, and `events.html`
   - Includes Facebook/Open Graph and Twitter Card tags
   - Page-specific descriptions and images
   - Meta descriptions for SEO
   - Ready for social media sharing with proper previews
   - **Note:** Remaining recipe pages (8) can be updated with OG tags following the same pattern

4. **Schema.org Markup for Recipes:** ✅ **COMPLETE**
   - Added JSON-LD structured data to all 9 recipe pages
   - Recipe schema includes: cooking time (`prepTime`, `cookTime`, `totalTime`), ingredients list, step-by-step instructions (`HowToStep`), recipe yield, category, and images
   - Organization schema added to `index.html` with business information, address, contact details, and opening hours
   - Event schema added to `events.html` with 3 events (Barista Grundkurs, Latte Art Workshop, Kaffeeverkostung) including dates, prices, locations, and organizers
   - All schema markup follows Schema.org specifications and is validated
   - Files modified: All 9 recipe pages, `index.html`, `events.html`

5. **Print Styles for Recipe Pages:** ✅ **COMPLETE**
   - Added comprehensive `@media print` CSS rules in `styles.css` (lines 2580-2778)
   - Hides non-essential elements: navigation, footer, dark mode toggle, calculators, badges, links, etc.
   - Optimizes typography for printing: large readable fonts (12pt body, 24pt h1), proper line heights
   - Formats specifications tables for print with clear borders
   - Handles page breaks appropriately (prevents breaking inside instructions)
   - Removes backgrounds, shadows, and colors for clean black-and-white printing
   - Recipe-specific optimizations: hides secondary images, formats guide headers and instructions clearly

6. **Sitemap.xml Generation:** ✅ **COMPLETE**
   - Created `sitemap.xml` file in root directory
   - Includes all 11 pages: homepage, 9 recipe pages, events page
   - Set priorities: Homepage (1.0), Recipe pages (0.8), Events (0.7)
   - Set change frequencies: weekly for homepage/events, monthly for recipes
   - Includes last modified dates (2025-11-03)
   - Follows XML sitemap protocol standards

### Additional Updates Made:

- **Hero Section Improvements:**
  - Hero overlay card now centered both horizontally and vertically
  - Hero section set to exactly `100vh` (viewport height)
  - Image container uses `height: 100vh` with `object-fit: cover`
  - Hero card fills screen on page load
  - Mobile responsive with same viewport height behavior

### ✅ Completed Tasks:

1. **Complete Recipe Pages:** All 6 remaining recipe pages created:
   - `origami-dripper.html` - Origami Dripper method
   - `v60.html` - V60 Pour-Over method
   - `drip.html` - Drip Coffee method
   - `cold-brew.html` - Cold Brew method (12-24 hour extraction)
   - `kalita-wave.html` - Kalita Wave method
   - `home-espresso.html` - Home Espresso method (advanced)
   - All pages follow the same structure as `french-press.html` with German content
   - All recipe cards on `index.html` now link to their respective pages

2. **Recipe Calculator Widget:** ✅ **Phase 4 - COMPLETE**
   - ✅ **Implemented on all 9 recipe pages** with method-specific ratios
   - Features: adjustable servings (1-20), metric/imperial toggle, real-time calculation
   - Displays coffee in grams/tablespoons and water in milliliters/cups
   - Responsive design with dark mode support
   - JavaScript: `initRecipeCalculator()` function in `scripts/main.js`
   - CSS: Complete styling in `styles.css` (`.recipe-calculator`, `.calculator-controls`, etc.)
   - Method-specific ratios configured: French Press (1:14), AeroPress (1:15), Chemex (1:17), V60 (1:16), Drip (1:12), Kalita Wave (1:16), Origami Dripper (1:16), Cold Brew (1:8), Home Espresso (1:2)

3. **Event Registration Modal:**
   - Full modal implementation in `events.html`
   - All 5 "Jetzt anmelden" buttons connected with event data attributes
   - Form validation (required fields, email format)
   - Focus trapping for keyboard navigation
   - Multiple close methods (button, ESC, overlay click)
   - Success/error message display
   - Ready for backend integration (commented API code included)
   - JavaScript: `initEventModal()` function in `scripts/main.js`
   - CSS: Complete modal styling in `styles.css` (`.modal-overlay`, `.modal-container`, etc.)

### ✅ Completed Tasks:

4. **Newsletter Integration (Phase 4):** ✅ **COMPLETE**
   - ✅ **EmailJS integration** implemented (free alternative: 200 emails/month)
   - Replaced Mailchimp with EmailJS for better free tier
   - All newsletter forms enabled across all pages
   - EmailJS SDK added to all 12 HTML pages
   - Client-side validation (email format, required fields)
   - Success/error message display with auto-hide
   - Forms automatically enabled on page load via JavaScript
   - Proper ARIA attributes and accessibility support
   - Dark mode styling for messages
   - **Setup Required:** Follow `EMAILJS_SETUP_GUIDE.md` to configure EmailJS account
     - Update `EMAILJS_CONFIG` in `scripts/main.js` (line 649) with Public Key, Service ID, and Template ID
     - Get credentials from: https://www.emailjs.com/

---

## 9.3 Phase 4 Implementation Status (November 2025)

**Phase 4: Critical Fixes** - Progress: 4 of 4 tasks completed (100%) ✅

### ✅ Completed Tasks:

1. **Event Registration Modal:** ✅ **COMPLETE**
   - Modal tested and verified working in browser
   - Opens correctly on button click
   - ESC key closes modal
   - Focus management works properly
   - Form validation functional
   - Ready for backend integration

2. **Newsletter Form — EmailJS Integration:** ✅ **COMPLETE**
   - Replaced Mailchimp with EmailJS (free: 200 emails/month)
   - EmailJS SDK added to all 12 HTML pages
   - Complete implementation in `scripts/main.js`
   - Setup guide created (`EMAILJS_SETUP_GUIDE.md`)
   - Code complete, awaiting EmailJS account configuration

3. **Dark Mode Contrast Fixes:** ✅ **COMPLETE**
   - Card titles: Added text-shadow for visibility
   - Basics section: Improved background opacity and text contrast
   - Journey section: Enhanced text colors
   - Infographic labels: Better contrast for ratio and temperature displays
   - All fixes maintain WCAG AA compliance

4. **Recipe Calculator Consistency:** ✅ **COMPLETE**
   - Added calculators to all 9 recipe pages
   - Method-specific ratios configured correctly
   - Cold Brew includes note about concentrate
   - Home Espresso includes special note about extraction time
   - All calculators work in dark mode

---

## 9.4 Phase 5 Implementation Status (November 2025)

**Phase 5: Navigation & UX Improvements** - Progress: 1 of 5 tasks completed (20%) ✅

### ✅ Completed Tasks:

1. **Global Navigation Menu:** ✅ **COMPLETE**
   - Sticky header navigation across all 12 pages
   - Logo, navigation links, dark mode toggle, mobile menu
   - Header remains sticky throughout entire page
   - Mobile hamburger menu with overlay
   - Active link detection
   - Smooth scrolling for anchor links
   - Scroll detection for header shadow
   - Responsive design (mobile menu at ≤768px)

2. **Dark Mode Toggle Placement:** ✅ **COMPLETE**
   - Moved from floating action button (FAB) to header
   - Uses same design as old FAB (pill-shaped with border)
   - Old FAB removed from all pages
   - Header toggle works throughout site

### ⏳ Pending Tasks:

3. **Search/Filter for Brew Methods:** ⏳ **PENDING**
   - Add filter bar above brew cards
   - Filter by difficulty, brew time, equipment type
   - Search bar for method names
   - URL hash support for shareable filtered views

4. **Meta Descriptions:** ⏳ **PENDING**
   - Add unique meta descriptions to all pages
   - Currently only 3 pages have descriptions

5. **Complete Open Graph Tags:** ⏳ **PENDING**
   - Add OG tags to remaining 8 recipe pages
   - Currently only 3 pages have complete OG tags

---

## 9. Open Questions / Future Considerations
- **Asset Ownership:** Determine whether to replace CDN images with self-hosted versions for long-term stability.
- **Newsletter Integration:** ✅ **RESOLVED (Phase 4)** - EmailJS integration implemented. Forms are functional and ready to use once EmailJS credentials are configured. See `EMAILJS_SETUP_GUIDE.md` for setup instructions.
- **Additional Recipes:** ✅ **RESOLVED** - All 9 brew methods now have complete recipe pages with calculators. Structure replicated from French Press template with localized German content.
- **Favicon:** ✅ **RESOLVED** - SVG favicon (`favicon.svg`) created and added to all HTML pages.
- **Navigation:** ✅ **RESOLVED (Phase 5)** - Global sticky header navigation implemented. All pages now have consistent navigation with mobile menu support.
- **Dark Mode Toggle:** ✅ **RESOLVED (Phase 5)** - Moved to header navigation. Old FAB removed. Design matches previous FAB style.

---

## 10. Handover Checklist
Before ending any development session:
1. Confirm `read_lints` is clean for edited files.
2. Capture updated screenshots via Playwright if visuals change.
3. Update this documentation with new sections, colors, typography changes, or resolved questions.
4. Summarize changes referencing relevant file paths in the final response to the user.

Maintaining this documentation ensures continuity across sessions and developers. Update it as the project evolves. Good luck with the next build!
