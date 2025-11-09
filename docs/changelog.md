# Changelog

Entries are reverse-chronological. Use this log to understand what shipped each session.

## 2025-11-Phase1 (In Progress)
- Bootstrapped Eleventy + Vite build pipeline with `src/` structure, base layout, and header/footer partials.
- Copied legacy HTML pages into `src/` with front matter so the new build emits pages under `dist/`.
- Added automation: `npm run build` now generates `dist/`, `npm test` and `npm run baseline` run builds prior to Playwright operations, and baseline screenshots capture light/dark variants from the compiled site.
- Noted outstanding Vite warnings around non-module scripts and the need to refactor pages to use shared partials.

## 2025-11-Phase4 (Current Session)
- Fixed header to remain visible across all pages and added global top padding variable in `styles.css`.
- Expanded hero image bleed to remove edge whitespace and disabled image dragging for stability.
- Introduced the new documentation system (`docs/` folder) and archived legacy research.

## 2025-11-Phase3 — Polish & Interactivity
- Added recipe timer widget with step cues and optional audio alerts across recipe pages.
- Implemented scroll-triggered animations, micro-interactions, and improved hover/touch states.
- Enhanced dark-mode toggle styling and ensured consistent card radii and typography alignment.
- Added print stylesheet for cleaner recipe exports.

## 2025-11-Phase2 — Enhancements & Accessibility
- Added skip-to-content links, system-aware dark mode defaults, and partial Open Graph/Twitter metadata.
- Introduced schema.org markup, sitemap, and broad responsive refinements.
- Strengthened reduced-motion support and refined animations.

## 2025-11-Phase1 — Foundation
- Created all remaining recipe pages based on the French Press template (including calculators and timers).
- Implemented recipe calculator widget, events registration modal, and wired navigation links to detail pages.
- Populated localized German copy, difficulty/time badges, and storytelling sections on the landing page.

Earlier competitive analyses and planning notes are preserved under `docs/archive/` for historical reference.
