# Architecture & Implementation Details

## Repository Layout
- `src/` — Eleventy source directory introduced in the refactor.
  - `index.njk` — landing page converted to Eleventy with shared layout.
  - Legacy HTML pages (recipe detail, events, menu) copied in with front‑matter headers; templates still match legacy HTML but now build through Eleventy.
  - `layouts/base.njk` and `partials/` — header/footer/head templates used by `index.njk` (other pages will adopt these in later phases).
  - `styles/`, `scripts/`, `assets/` — direct copies of the legacy global files for now (Eleventy passes them through unchanged).
- `legacy-static/` — frozen snapshot of the pre-refactor site kept for reference.
- `dist/` — Eleventy build output (pages rendered into subdirectories such as `dist/events/index.html`).
- Root commands and docs remain in place (`docs/`, `package.json`, etc.).

## Shared Page Structure
- Every page loads the same global header (`.site-header`) and footer (`.site-footer`). Header markup lives near the top of each HTML file and is styled in `styles.css:103`. The header contains the logo, primary navigation, dark-mode toggle, and mobile menu trigger. JavaScript enhances it with sticky behaviour and menu toggling (`scripts/main.js:392`).
- A skip link is present immediately after `<body>` on each page to satisfy keyboard navigation best practices (`styles.css:71`).
- Footer content includes contact, hours, newsletter form, and copyright notice (`styles.css:900`+).

## Landing Page (`index.html`)
1. **Hero Card (`.card-hero`)** — Full-viewport recipe hero with parallax background and glassmorphism overlay. Layout and overflow rules reside at `styles.css:612-700`. Parallax scrolling is handled by `initParallax()` (`scripts/main.js:20`).
2. **Brew Method Grid** — Nine recipe cards in a responsive flex layout (`styles.css:560`). Cards include difficulty/time badges and hover interactions. Each card links to its respective recipe page.
3. **Storytelling Sections** — “Brew Basics” infographic and “Farm-to-Cup” timeline using `.storytelling-section`, `.infographic-item`, and `.timeline-item` classes (`styles.css:1240-1580`). Intersection Observer reveals them on scroll (`scripts/main.js:172`).
4. **Visit CTA** — Map placeholder and café details at the bottom of the landing page (`styles.css:3080`).

## Recipe Pages (`*.html`)
- Use `.brew-guide-page` to toggle recipe-specific layout styles (`styles.css:1040`).
- Contain three key widgets:
  1. **Calculator (`.recipe-calculator`)** — Metric/imperial conversions powered by `initRecipeCalculator()` (`scripts/main.js:515`).
  2. **Timer (`.recipe-timer`)** — Countdown with step cues, pause/reset, and optional sound (`scripts/main.js:938`). Styles at `styles.css:1360`.
  3. **Progress Indicator** — Fixed top progress bar created dynamically by `initProgressIndicator()` (`scripts/main.js:214`) and styled in `styles.css:2217`.
- Recipe instructions share common markup (specs, steps, tips). Each page has a back link via `.guide-navigation` to reduce dead ends.

## Events Page (`events.html`)
- Displays `.event-card` grid, styled around `styles.css:2440`.
- Buttons use `data-event-name` attributes to open the registration modal.
- `initEventModal()` (`scripts/main.js:586`) handles focus trapping, validation, and success messaging. Modal styles sit at `styles.css:2600`.

## Menu Page (`menu.html`)
- Two-column responsive menu (`styles.css:2840`) with coffee and pastry cards. Uses `.menu-grid`, `.menu-item`, and `.menu-tags` classes. Touch-specific interactions defined in the micro-interactions section (`styles.css:3200`).

## Styling System Highlights
- **Design tokens:** Root CSS variables define colors, typography, spacing, and shared constants such as `--header-height` (`styles.css:2-53`). Theme switches by toggling `data-theme` on `<html>`; dark-mode variants reuse the same tokens.
- **Layout primitives:** `.wrapper` provides consistent max-width and responsive padding. `.cards-grid` manages the brew-card layout.
- **Component sections:** Styles are grouped by major components (header, cards, modals, timers, events, menu, visit section). Each block is clearly labelled with `/* ... */` comments to speed navigation.
- **Responsiveness & accessibility:** Media queries target 1024px, 768px, 640px breakpoints. Reduced-motion support is handled via `[data-reduced-motion="true"]` selectors and is toggled in JS.
- **Print stylesheet:** `@media print` block at the end of `styles.css` (line ~3480) hides interactive UI for printable recipes.

## JavaScript Modules (`scripts/main.js`)
- `initParallax` — Subtle hero image translate respecting reduced motion.
- `initHeroCTA` — Smooth scrolling for hero CTA anchor links.
- `initScrollAnimations` — Intersection Observer reveals storytelling and event cards with staggered animations.
- `initProgressIndicator` — Global recipe progress bar.
- `initDarkMode` — System preference detection, persisted toggle, and header icon sync.
- `initHeaderNavigation` — Sticky header shadow, mobile menu behaviour, smooth anchor scrolling, and active-link tracking.
- `initRecipeCalculator` — Servings-to-ingredients conversions with metric/imperial switch.
- `initEventModal` — Accessible modal handling registration flows.
- `initNewsletter` — EmailJS integration scaffold; enables inputs and surfaces configuration errors.
- `initRecipeTimer` — Countdown timer with step highlights and optional chime.
- All modules run on `DOMContentLoaded` (or immediately if the DOM is already ready) to keep pages interactive without build tooling (`scripts/main.js:1016`). Current Eleventy build serves the same script without bundling; Vite warns that the script lacks `type="module"`. Resolving this warning is part of the Phase 4 JavaScript modularisation.

## Accessibility & UX Considerations
- Skip links, ARIA roles/labels, and focus management for modals (`events.html:462`+).
- Motion reduction respects `prefers-reduced-motion` and toggles CSS selectors and parallax/animation logic.
- Keyboard navigation supported across menus, modal, and timer widgets.
- Dark-mode toggle updates accessible labels and persists choice.

## Assets & External Dependencies
- Fonts load from Google Fonts and Adobe Typekit as referenced in each HTML head.
- Recipe and hero images currently load from the Greater Goods Roasting CDN (see `index.html:108`). Consider self-hosting before launch.
- EmailJS SDK included via CDN (`french-press.html:31`; replicated across recipe pages) for future newsletter integration.
- Eleventy passthrough copies existing assets as-is; responsive image optimisation remains outstanding.

This document should be amended when new components are introduced or existing structures change. Include file paths and line anchors (using `nl -ba`) when referencing code adjustments. When Eleventy templates replace the remaining static HTML pages, update the relevant sections to reflect reusable partial usage and data-driven generation.
