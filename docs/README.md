# Hellers Kaffees Brew Guides — Project Overview

**Last Updated:** November 2025

This repository contains the static website for the Hellers Kaffees brew guides. It mirrors the experience of the Greater Goods Roasting reference site while localising the content for Berlin and adding custom interactive widgets.

## Quick Start
- `npm install` to pull Eleventy, Vite, Playwright, and supporting tooling.
- `npm run dev` spins up Eleventy with Vite middleware for local development (serves `src/index.njk` and the legacy pages copied into `src/`).
- `npm run build` emits the static site into `dist/`; Eleventy outputs detail pages inside subdirectories (e.g., `dist/events/index.html`).
- `npm test` and `npm run baseline` rebuild before running Playwright so checks run against compiled output.
- Playwright MCP commands (`browser_navigate`, `browser_take_screenshot`, `browser_console_messages`) remain available for quick spot checks—point them at files inside `dist/` for parity with production.

## Site Map
- `index.html` — Landing page with hero, brew method cards, storytelling sections, visit CTA, and footer.
- Recipe detail pages (`*.html`): `french-press`, `aeropress`, `chemex`, `origami-dripper`, `v60`, `drip`, `cold-brew`, `kalita-wave`, `home-espresso` — each includes calculator, timer, specs, and instructions.
- `events.html` — Workshop listing with registration modal.
- `menu.html` — Café menu with coffee, seasonal drinks, and pastry sections.

## Feature Highlights
- Fixed global header with dark-mode toggle and mobile navigation.
- Hero parallax treatment that respects `prefers-reduced-motion`.
- Recipe calculator (metric/imperial), brew timer with step cues, and scroll progress indicator on guide pages.
- Scroll-triggered animations, storytelling sections, visit CTA, and events registration modal.
- Dark mode palette, responsive layouts down to 320px, print stylesheet, and accessibility affordances (skip links, ARIA labels, focus traps).

## Tech Stack
- Eleventy 3.x with `@11ty/eleventy-plugin-vite` for the build pipeline.
- Vite handles bundling (currently pass-through for legacy assets until JS modularisation lands).
- Global CSS in `src/styles/styles.css` and JavaScript in `src/scripts/main.js` (still plain scripts; warnings about missing `type="module"` are pending resolution).
- External assets (recipe photography, fonts) remain on the reference CDN for now; favicon stored locally as `src/favicon.svg`.

## Documentation Map
- `architecture.md` — Code structure, styling system, and interaction modules.
- `process.md` — Development workflow, testing guidance, and documentation maintenance rules.
- `backlog.md` — Curated, prioritised list of pending work.
- `changelog.md` — Milestone log covering previous phases.
- `setup/emailjs.md` — Newsletter integration instructions.
- `archive/` — Legacy research and historical documents retained for reference.

Update only the relevant document when behaviour changes, and cross-link where appropriate instead of duplicating text.
