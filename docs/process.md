# Development & Documentation Process

## Working on the Project
1. Use the Eleventy dev server for local previews: `npm run dev` spins up Eleventy with the Vite middleware on port 8080 by default.
2. Run `npm run build` to generate the static output in `dist/`. Production assets are served from the subdirectories Eleventy creates (e.g., `dist/events/index.html`).
3. When modifying shared structures (header, footer, calculator, timer), update the canonical Nunjucks partials in `src/partials/` (`header.njk`, `footer.njk`, etc.) and then migrate remaining pages to reuse them.
4. Keep `styles.css` and `scripts/main.js` modular by extending existing sections rather than scattering duplicate rules. During the refactor, these files are still passed through unchanged; plan to break them into modules once the Eleventy foundation stabilises.
5. Respect localisation: all visible copy remains German unless the brief changes.

## Testing Checklist
- **Visual pass:** Desktop ≥1280px, tablet (~768px), and mobile (~375px). Ensure hero overflow, cards, and header remain aligned.
- **Interactive widgets:**
  - Dark-mode toggle switches themes and persists reload.
  - Calculator and timer operate on at least one recipe page.
  - Event modal opens from each workshop card, validates required fields, and traps focus.
- **Accessibility:** Verify skip link, keyboard-only navigation, focus states, and reduced-motion mode (`window.matchMedia`).
- **Playwright CLI workflow:**
  - `npm test` now runs `npm run build` first and then executes the smoke suite against the `dist/` output served via `http-server`.
  - `npm run baseline` rebuilds and captures screenshots for index/events/french-press (light & dark) into `docs/baseline/`.
- **Manual MCP usage:** When taking ad-hoc screenshots via Playwright MCP, point to files inside `dist/` to match production paths.
- **Regression smoke tests:** Watch console output for EmailJS placeholder warnings. Pending work: resolve Vite warnings about `scripts/main.js` lacking `type="module"` once the JS modularisation phase begins.

## Documentation Maintenance
- Update `docs/architecture.md` whenever structure, styling sections, or JS modules change meaningfully. Include file paths/line references to speed cross-session onboarding.
- Record behavioural or content changes in `docs/changelog.md` (add newest entries to the top).
- Keep `docs/backlog.md` focused on actionable work. Archive completed items or remove them rather than keeping long checklists.
- When introducing new subsystems (e.g., analytics, filtering), add a dedicated subsection to the architecture doc and link to any setup notes.
- Avoid duplicating information across documents. Link to the authoritative section instead of copy/pasting text.
- Large exploratory research or deprecated plans should be moved into `docs/archive/` with a short pointer rather than left in active docs.

By following these guidelines the documentation remains concise, accurate, and easy to maintain across sessions.
