# Refactoring Plan — Hellers Kaffees Brew Guides

**Context:** November 2025 — Objective is to improve maintainability, keep the current look & behaviour, and prepare for a future owner-facing control panel.

**Current Status (Phase 1 in progress):**
- Eleventy + Vite scaffold created with `src/` directory, `layouts/base.njk`, shared partials, and alignment of legacy HTML files inside the build system.
- `npm run build` now emits pages under `dist/` (recipe/detail pages currently output into `/page/index.html` subfolders).
- Playwright smoke tests and baseline scripts build before running, ensuring checks operate on compiled output.
- Next up: refactor copied HTML pages into proper Nunjucks templates and start introducing data files (`/shared-config`).

---

## 1. Current Codebase Assessment

### 1.1 HTML
- 12 standalone HTML files each duplicate the entire `<head>`, header nav, footer, newsletter form, and EmailJS script tag (`index.html`, `french-press.html`, … `menu.html`).
- Navigation updates require touching every file; inconsistent metadata (Open Graph only added to subset).
- Content (brew specs, events, menu items) is hard-coded, making future edits and owner toggles manual.
- Accessibility affordances (skip link, aria) are consistent but repeated.

### 1.2 CSS (`styles.css`, 3,717 lines)
- Single monolithic file mixes base tokens, layout primitives, component styles, responsive overrides, print styles, and animation utilities.
- Media queries and reduced-motion selectors are interwoven, making it hard to isolate component styling.
- Design tokens exist but lack structure for theming beyond light/dark; no mechanism to override palettes without editing the file.
- No build step (Sass/PostCSS), so code reuse (variables, mixins) limited to manual patterns.

### 1.3 JavaScript (`scripts/main.js`, 1,197 lines)
- All behaviour initialised in one IIFE: parallax, hero CTA, scroll animations, progress bar, dark mode, navigation, calculator, modal, newsletter, timer.
- Feature logic is tightly coupled to DOM queries with implicit selectors; hard to toggle features off/on.
- Newsletter integration requires manual EmailJS config but has no environment separation or graceful degradation beyond message copy.
- No module system, type hints, or tests; debugging relies on manual browser inspection.

### 1.4 Assets & External Dependencies
- Images hot-linked from greatergoodsroasting.com; fragile and outside café’s control.
- Fonts loaded from Google Fonts & Adobe Typekit individually in each HTML file (no preloading strategy).
- `favicon.ico` missing (Playwright console shows 404).
- No central `config` or data files; everything embedded directly into markup.

### 1.5 Tooling & Quality
- No package.json, task runner, or formatting/linting pipeline.
- Testing depends on ad-hoc Playwright MCP manual runs; no repeatable scripts or CI.
- Documentation now organised under `docs/`, but implementation mirroring still manual.

**Pain Points:** Duplication across pages, lack of componentisation, large flat CSS/JS files, fragile asset dependencies, and no configuration layer for future owner control.

---

## 2. Refactoring Goals
1. Preserve current visuals and UX behaviour while reducing duplication.
2. Introduce a data-driven architecture to support a future control-panel site (feature toggles, theming, content updates).
3. Improve developer ergonomics with modern tooling, modular CSS/JS, and automated checks.
4. Establish sustainable asset management (self-hosted images, consistent favicons, font handling).

---

## 3. Proposed Architecture

### 3.1 Project Structure
- Adopt a `src/` → `dist/` build pipeline using **Eleventy (11ty)** for static generation in tandem with **Vite** via `@11ty/eleventy-plugin-vite`. Reasons:
  - Works well with Markdown/Nunjucks templates for HTML partials and data files.
  - Keeps output static (compatible with current hosting) while enabling templating.
  - Easy to ingest JSON/YAML data for brew guides, events, menu items, and owner-config toggles.
- Directory sketch:
  ```
  /src
    /layouts          # base.njk, recipe.njk, event.njk
    /partials         # header, footer, newsletter, meta tags
    /data             # brew-guides.json, menu.json, events.json, site-config.json
    /styles           # SCSS modules (tokens, layout, components)
    /scripts          # JS/TS modules per feature (bundled by Vite)
    /shared-config    # JSON schema + default config shared with control panel
    /assets           # images, icons, fonts
  /dist               # generated static site
  ```

### 3.2 Styling
- Migrate `styles.css` to **Sass** (or CSS Modules with PostCSS) to split into partials: base tokens, utilities, components, pages, responsive variants, print.
- Keep CSS custom properties for runtime theming; expose palette sets in `site-config.json` for future toggles.
- Employ PostCSS (Autoprefixer, cssnano) to ensure production CSS matches current behaviour but is minified and scoped.

### 3.3 JavaScript
- Convert to ES modules compiled by **Vite** (integrates nicely with Eleventy). Modules to create:
  - `theme-toggle.js`
  - `parallax.js`
  - `scroll-animations.js`
  - `progress-indicator.js`
  - `header.js`
  - `recipe-calculator.js`
  - `event-modal.js`
  - `newsletter.js`
  - `recipe-timer.js`
- Export initialisers and register them via a small bootstrap that reads feature toggles from `site-config.json` (embedded as JSON at build time).
- Add TypeScript definitions or JSDoc for clarity.

### 3.4 Data & Configuration Layer
- Move brew guide metadata (titles, ratios, difficulty, images) into `brew-guides.json`; Eleventy loops over data to generate cards and detail pages.
- Same approach for events and menu items.
- Introduce a shared `shared-config/site-config.json` with fields like `features: { parallax: true, newsletter: false }`, `theme: { primary, accent }`, `layout: { heroStyle, showStorySections }` alongside a JSON Schema + TypeScript definitions. This folder becomes the contract consumed by both the main site and the forthcoming control panel.
- Generate a `config.js` bundle during build (embedded as `window.__HELLERS_CONFIG__`) so runtime toggles mirror the shared config.

### 3.5 Assets
- Download and optimise hero/recipe images into `src/assets/images/` (use responsive `srcset` via Eleventy shortcodes).
- Create `favicon.ico` alongside existing SVG; include manifest metadata.
- Consolidate font loading into Eleventy layout with preload hints. Audit Adobe Typekit licensing to determine whether fonts can be self-hosted or if we should retain the existing embed script but centralise it.

### 3.6 Tooling & QA
- Initialise `package.json` with scripts: `dev`, `build`, `lint`, `test`, `preview`.
- Add ESLint + Stylelint + Prettier (or Biome) to enforce consistency.
- Set up Playwright tests to smoke-test key pages (hero load, navigation, modal open, calculator output) and run via CLI.
- Add Lighthouse CI or Web Vitals budget.

---

## 4. Refactoring Roadmap

### Phase 0 — Baseline & Safety Nets (1-2 days)
1. Create repo branch; add `package.json` with scripts.
2. Capture baseline screenshots using Playwright MCP for `index.html`, `events.html`, `french-press.html` (light/dark) and store under `/docs/baseline/`.
3. Write Playwright smoke tests covering header navigation, dark-mode toggle, calculator calculation, timer start/stop, and modal open/close.
4. Document migration strategy in `docs/refactoring-plan.md` (this file) and mark TODOs.

### Phase 1 — Build Pipeline & Template Extraction (3-4 days)
1. Set up Eleventy + Vite scaffold with `src/` structure while keeping existing `public/` copies for reference.
2. Configure `@11ty/eleventy-plugin-vite` so the dev server bundles scripts/styles while Eleventy handles templating.
3. Extract global layout, head meta, header, footer into Nunjucks partials. Ensure Eleventy build reproduces `index.html` output.
4. Wire Eleventy passthrough for static assets (images, sitemap, favicon) and keep a `legacy-static/` copy for fallback during rollout.
5. Update Playwright tests to point at Eleventy dev server.

### Phase 2 — Data Modelling & Page Generation (4-5 days)
1. Create data files for brew guides, events, menu items, and general site copy.
2. Define JSON Schema + TypeScript typings in `/shared-config/` and wire automated validation to catch invalid owner input early.
3. Generate landing cards and recipe pages dynamically from data; ensure manual overrides (e.g., hero copy) remain possible.
4. Centralise Schema.org/OG metadata creation per page based on data file values.
5. Validate output parity via diffing original vs generated HTML (allowing for formatting/minification differences).

### Phase 3 — Styling Modularisation (4-5 days)
1. Break `styles.css` into Sass partials (tokens, base, components, utilities, layouts, pages, print) and recompile to a single CSS output.
2. Maintain existing class names to avoid HTML changes; verify computed styles via visual regression.
3. Introduce theme maps in Sass tied to config keys, enabling easy palette swaps.
4. Add cssnano/autoprefixer for production builds.

### Phase 4 — JavaScript Modularisation & Config Hooks (4-5 days)
1. Split `scripts/main.js` into ES modules per feature with clear exports.
2. Build a bootstrap that reads embedded `window.__HELLERS_CONFIG__` generated from `site-config.json` and conditionally initialises modules.
3. Add TypeScript (or JSDoc) to guard against regressions; run via Vite for bundling and minification.
4. Ensure EmailJS integration reads credentials from a config stub (pulled during build or via environment variables).

### Phase 5 — Asset & Performance Polish (2-3 days)
1. Self-host recipe imagery with responsive sizes; update HTML shortcodes to emit `srcset`.
2. Add missing `favicon.ico`, app icons, and manifest.
3. Optimise font loading with `preconnect`, `preload`, and fallback stacks.
4. Run Lighthouse performance/accessibility checks and address regressions.

### Phase 6 — Documentation & Handover (1-2 days)
1. Update `docs/architecture.md` and `docs/process.md` with the new stack, build steps, and config structure.
2. Record final Playwright baseline and test results.
3. Prepare migration notes for the forthcoming control-panel project, outlining how it will edit `site-config.json` and data files.

---

## 5. Risks & Mitigations
- **Regression Risk:** Large refactor could break UI parity. Mitigation: baseline screenshots + Playwright smoke tests + incremental phases.
- **Build Complexity:** Introducing Eleventy/Vite increases tooling. Mitigation: provide detailed scripts, docs, and fallback static builds during transition.
- **Control Panel Integration:** Future dynamic updates require write access to config/data files. Mitigation: design config schema upfront; consider storing in JSON that can be edited via API or CMS later.

---

## 6. Open Questions
1. Hosting environment — will it support Node-based build pipeline for deployment? (Needed for Eleventy/Vite builds.)
2. Control panel persistence — will owner edits trigger rebuilds, or should runtime fetch updates? Clarify to design correct data flow.
3. Newsletter provider — stick with EmailJS or shift to another service? Determine before finalising config abstractions.

---

## 7. Next Actions
1. Align with stakeholders on adopting Eleventy + Vite stack.
2. Approve data schema for brew guides/events/menu.
3. Schedule Phase 0 tasks to create safety net before structural changes.
