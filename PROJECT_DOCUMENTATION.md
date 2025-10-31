# Hellers Kaffees Brew Guides — Project Documentation

This document is the single source of truth for the Hellers Kaffees brew guides project. It captures the current implementation, design system, content decisions, testing workflow, and the agreed roadmap for future enhancements. Use it as the reference point when continuing development in a new session.

---

## 1. Project Overview
- **Objective:** Recreate the brewing guides experience from greatergoodsroasting.com as a branded site for *Hellers Kaffees* with localized (German) content and authentic footer info.
- **Tech Stack:** Static **HTML** and **CSS**. Browser-based validation and screenshots handled via the Playwright MCP integration.
- **Current Scope:** Landing page with hero + brew guide cards (`index.html`) and a detailed French Press recipe page (`french-press.html`).
- **Localization:** Entire site content and UI strings are in **German**. Maintain German copy in future additions unless explicitly instructed otherwise.

---

## 2. Repository Structure
| File | Purpose |
| ---- | ------- |
| `index.html` | Landing page with hero card + 9 brew method cards and footer. |
| `french-press.html` | Full recipe detail page for the French Press method. |
| `styles.css` | Global and page-specific styles for both HTML files. |
| `scripts/main.js` | Globally deferred script for shared enhancements (motion prefs, upcoming interactivity). |
| `assets/` | Placeholder directory for icons, SVGs, and future static assets. |
| `BREW_GUIDES_ANALYSIS.md` | Original deep-dive analysis of the reference site. |
| `ANALYSIS_SUMMARY.md` | Condensed summary of the initial analysis. |
| `PROJECT_DOCUMENTATION.md` | **This document.** |

No build tooling is required; open the HTML files directly or via a lightweight static server.

---

## 3. Current Implementation Snapshot
- **Hero card (landing):** Static background image with overlay text (`card-hero`) including a new uppercase label (`.label`). The CTA will be added in the roadmap.
- **Brew cards:** 9 cards with original product images, titles in English (will stay until localized asset names are available), and overlay links (only French Press wired up now).
- **French Press page:** Hero image, intro, specifications, instructions, and navigation back to the landing page; all content localized in German.
- **Footer:** Branded for Hellers Kaffees with address, hours, placeholder phone (`nicht angegeben`), and newsletter sign-up (non-functional).
- **Grundlegendes Skript:** `scripts/main.js` entfernt die `no-js`-Klasse, kennzeichnet `prefers-reduced-motion` im Root-Element und stellt einen Namespace für kommende Interaktionen bereit.

All typography currently relies on Adobe Typekit (`p22-mackinac-pro`) and `GTAmerica` (with fallbacks) via CSS. Google Fonts includes Poppins for general sans-serif fallback.

---

## 4. Design System (Current)
- **Colors & Tokens:**
  - Background (`--bg`): `#f7f5f4`
  - Surface (`--surface`): `#ffffff`
  - Primary text (`--text`): `#111d3d`
  - Muted text (`--text-muted`): `#5c6785`
  - Accent beige (`--accent-beige`): `#e6dccf`
  - Accent terrakotta (`--accent-terracotta`): `#c97a5c` (Hero-Label, Buttons)
  - Accent Salbei (`--accent-sage`): `#7e9c87` (Sekundäre Labels)
  - Accent Ink (`--accent-ink`): `#0e1a3a` (Footer-Hintergrund)
  - Dark-Mode-Platzhalter: `--bg-dark`, `--surface-dark`, `--text-dark`, `--text-muted-dark`, `--accent-terracotta-dark`, `--accent-sage-dark` – vorgesehen für Phase 8 Toggle.
- **Typography & Scale:**
  - Serif: `--font-serif` → `p22-mackinac-pro`
  - Sans: `--font-sans` → `GTAmerica` mit Poppins/System-Fallback
  - Type-Scale via `clamp()` Variablen (`--font-size-display`, `--font-size-h1` … `--font-size-label`), Körpertext `--font-size-body` (18px) und Metadaten `--font-size-small` (15px).
  - `.label` und `h4` nutzen nun die Sans-Serif in Versalien mit `letter-spacing` für Sektionstitel.
  - Metadaten und Spezifikationen verwenden `--text-muted` für klarere Hierarchie.
- **Layout:**
  - Wrapper width: 1450px max with 50px horizontal padding (20px on mobile).
  - Cards grid uses flexbox with responsive breakpoints at 1024px (2 columns) and 640px (single column).
  - French Press page uses a 1fr / 1.5fr CSS grid that stacks on tablet/mobile.

---

## 5. Assets & External Data
- **Image Sources:** Hosted on `greatergoodsroasting.com`. Hero and card images reference exact CDN URLs from the original site.
- **Location Data:** `Sybelstraße 19, 10629 Berlin`. Hours localized to German abbreviations (Mo/Di/Mi/etc.). Phone currently `nicht angegeben`; update if the real number becomes available.
- **Future Map Embed:** Use Google Maps embed for Hellers Kaffees (URL provided earlier in the session: `https://www.google.com/maps/place/Heller+Kaffees/...`).

If new assets are required (e.g., icons, illustrations), store links here and ensure licensing compatibility.

---

## 6. Testing & Tooling
- **Local Preview:** Open `index.html` or `french-press.html` directly in the browser or use a static server (`python -m http.server`), noting instructions to prefer absolute paths for tool commands.
- **Playwright MCP:** Use `browser_navigate` to open local files (`file:///Users/schwenderone/Documents/brewtest/index.html`) and `browser_take_screenshot` for documentation. Monitor console via `browser_console_messages` before delivery.
- **Responsive Checks:** Use browser dev tools or Playwright evaluation to ensure breakpoints behave as expected. No automated tests exist yet.

---

## 7. Roadmap — Approved Enhancements
The user selected the following features for the next development phase. Treat this list as prioritized backlog items. Each bullet includes key requirements and notes.

### 7.1 Hero Enhancements
- **Parallax Header:** Implement a scrolling parallax effect for the hero image on `index.html`. Keep it subtle to avoid motion sickness. Ensure it degrades gracefully on mobile (either disable or simplify).
- **Hero CTA Panel:** Add a prominent call-to-action overlay (e.g., "Jetzt entdecken" button) inside the hero overlay. Maintain accessibility (ARIA labels, contrast) and connect to relevant content (e.g., scroll to brew cards or anchor).

### 7.2 Brew Card Interactions
Implement all three interaction upgrades across the brew cards:
1. **Hover Interactions:** Add smooth transitions (scale, shadow, maybe slight tilt) with reduced motion respect (use `prefers-reduced-motion`).
2. **Tag Badges:** Introduce small badges (e.g., "Einfach", flavor notes) positioned consistently. Determine taxonomy (difficulty, flavor, brew time) and translate into German.
3. **Illustrative Icons:** Design or source simple line icons representing each brewing method. Icons should harmonize with the color palette and appear either beside titles or within badges.

### 7.3 Storytelling Sections (Landing Page)
- **Brew Basics Infographic:** Add a new section (below cards) depicting grind sizes, ratios, and water temperature. Use responsive SVG or CSS to render a horizontal infographic. Provide concise German labels.
- **Farm-to-Cup Timeline:** Create a timeline component showcasing the coffee journey (Farm → Rösten → Brühen). Use icons/illustrations and short descriptions. Consider using a horizontal layout on desktop and vertical on mobile.

### 7.4 Visual Refresh
- **Accent Color Palette:** Extend the color system with at least two new accent colors (e.g., muted terracotta, sage). Update CSS variables (`:root`) and apply to buttons, badges, headings, etc. Document the new palette in this file when ready.
- **Font Hierarchy:** Adjust typography to introduce clearer hierarchy (section labels in uppercase sans-serif, refined pairing between serif and sans). Update `styles.css` accordingly and ensure consistent usage across pages.

### 7.5 Contact/Location
- **Map Embed:** Embed an interactive Google Map highlighting Hellers Kaffees in the footer or a new "Besuchen Sie uns" section. Ensure the embed is responsive and respects privacy (consider link vs inline iframe depending on policy).

### 7.6 New Content Page
- **Events/Workshops Page:** Create a new HTML page (e.g., `events.html`) listing upcoming events/workshops. Include card or timeline layout with German copy, placeholder data if needed, and link it from the footer or hero CTA.

### 7.7 Motion & Interaction Enhancements
Implement both requested motion upgrades:
1. **Scroll-triggered Animations:** Sections (infographic, timeline, cards) should fade/slide into view using intersection observers. Provide fallback for `prefers-reduced-motion`.
2. **Progress Indicator:** For long recipe pages, add a progress bar or steps indicator that highlights the current section while scrolling.

### 7.8 Accessibility & Polish
Implement all three polishing items:
1. **Dark Mode Toggle:** Provide a toggle (persisting via `localStorage`) that switches to a darker palette. Update CSS variables for dark mode.
2. **Microcopy Localization:** Review alt text, button labels, error messages, placeholders, etc., ensuring consistent and polished German phrasing.
3. **Responsive Enhancements:** Fine-tune tablet and mobile layouts (spacing, typography, stacking order). Document any new breakpoints or layout adjustments here.

Document any additional decisions or assets added during implementation back into this file.

---

## 8. Open Questions / Future Considerations
- **Asset Ownership:** Determine whether to replace CDN images with self-hosted versions for long-term stability.
- **Newsletter Integration:** Decide on real email capture or integrate with an ESP (currently static).
- **Additional Recipes:** Decide if each brew method will receive its own page like the French Press. If so, replicate the structure and localize content.

---

## 9. Handover Checklist
Before ending any development session:
1. Confirm `read_lints` is clean for edited files.
2. Capture updated screenshots via Playwright if visuals change.
3. Update this documentation with new sections, colors, typography changes, or resolved questions.
4. Summarize changes referencing relevant file paths in the final response to the user.

Maintaining this documentation ensures continuity across sessions and developers. Update it as the project evolves. Good luck with the next build!
