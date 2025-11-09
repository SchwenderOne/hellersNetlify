# Backlog & Priorities

## Ready Next (High Impact)
1. **Finish Eleventy template migration** — Convert the copied HTML pages in `src/` into reusable Nunjucks templates that share the new layout/partials. Replace inline head/header/footer markup with data-driven includes.
2. **Open Graph coverage** — After the Eleventy migration, centralise OG/Twitter metadata via data files so all recipe/detail pages generate correct tags.
3. **Newsletter integration** — Configure EmailJS (or alternate provider) and update the placeholder keys in `scripts/main.js:814`. Follow `docs/setup/emailjs.md` for the required IDs.

## Near-Term Enhancements
- **Recipe filtering/search** — Client-side filtering by difficulty, brew time, and equipment. Requires UI affordances on `index.html` plus filtering logic in `scripts/main.js`.
- **Analytics instrumentation** — Add GA4, Plausible, or similar to track recipe popularity, event modal conversions, and newsletter submissions.
- **Events workflow** — Connect the registration modal to a backend endpoint or third-party booking tool and surface submission status.
- **Vite build warnings** — Resolve the `type="module"` warnings by converting `scripts/main.js` to ES modules during Phase 4.

## Future Ideas
- Brew method blog or storytelling articles linked from the landing page.
- Multi-language support (EN/DE toggle) once copywriting resources are available.
- Service worker for offline access to recipe instructions and timers.

Review this backlog at the start of each session, promote items as priorities shift, and remove completed or obsolete work to avoid bloat.
