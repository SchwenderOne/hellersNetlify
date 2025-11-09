# Entwicklungsplan – Hellers Kaffees Brew Guides Roadmap 7.x

Dieser Plan strukturiert die Umsetzung aller in `PROJECT_DOCUMENTATION.md` Abschnitt 7 aufgeführten Roadmap-Punkte. Er basiert auf einer Analyse des aktuellen Codebestands (`index.html`, `french-press.html`, `styles.css`) sowie ergänzender Recherche zu best practices für Parallax-Effekte, Intersection Observer und Barrierefreiheit.

## Forschung & Quellen
- Parallax-Effekte mit Rücksicht auf `prefers-reduced-motion` und sanfte Umsetzung: [Parallax effects without JavaScript](https://the-sustainable.dev/parallax-effects-without-javascript/) (the-sustainable.dev), [C39 Technique für reduzierte Bewegung](https://www.w3.org/WAI/WCAG22/Techniques/css/C39) (W3C).
- Intersection Observer API für Scroll-Animationen und Progress-Indikatoren: [MDN Intersection Observer API](https://github.com/mdn/content/blob/main/files/en-us/web/api/intersection_observer_api/index.md).

## Gesamtstrategie
1. **Vorbereitung & Struktur:** Gemeinsame Assets, Skripte und Dokumentation vorbereiten.
2. **Design-Grundlagen erneuern (Farben/Typografie),** damit spätere Module auf konsistente Variablen zugreifen.
3. **Hero & Kartenerweiterungen** implementieren.
4. **Storytelling-Sektionen** ergänzen.
5. **Kontakt- und neue Inhaltsbereiche** integrieren (Map + Events).
6. **Interaktionslogik & Barrierefreiheit** ausbauen (Scroll-Animationen, Dark Mode, Mikrocopy, Responsive Finetuning).
7. **Test- & Dokumentationsschleife** nach jedem Block.

Jede Phase führt zu funktionsfähigen Zwischenständen, sodass bei Bedarf nach jeder Auslieferung ein Review möglich ist.

## Phase 0 – Fundament & Infrastruktur (Vorbereitung)
- **Ziele:** Ordnerstruktur für Assets/Skripte schaffen, Grundskript einbinden, Arbeitsdokumentation vorbereiten.
- **Aufgaben:**
  - `assets/`-Verzeichnis für Icons, SVGs, Farbmuster anlegen.
  - Neues gemeinsames Skript (`scripts/main.js`) erstellen und in beiden HTML-Dateien einbinden (Defer-Attribut, Fallback für No-JS).
  - Hilfsfunktionen (Breakpoint-Konstanten, Feature Detection) vorbereiten.
  - `PROJECT_DOCUMENTATION.md` Abschnitt „Design System“ um Platzhalter für neue Variablen erweitern.
- **Abhängigkeiten:** Keine; Voraussetzung für alle späteren JS-Funktionen.
- **Tests:** Validierung, dass Dateien weiterhin laden (lokale Vorschau), Lighthouse/Console auf Fehler prüfen.

## Phase 1 – Visuelles Refresh (Roadmap 7.4)
- **Ziele:** Neues Farb- und Typografiesystem definieren.
- **Aufgaben:**
  - Zwei zusätzliche Akzentfarben (z. B. Terrakotta, Salbei) auswählen, Variablen `--accent-terracotta`, `--accent-sage` etc. in `:root` ergänzen.
  - Dunkelmodus-Variablen gleichzeitig definieren (`--bg-dark`, `--text-dark` …) zur späteren Verwendung.
  - Typografische Hierarchie überarbeiten: Überschrift-Stufen, Sektionstitel in Versalien mit Sans-Serif, Fließtextgrößen überprüfen.
  - Anwendung der neuen Variablen in bestehenden Komponenten (Buttons, Newsletter, Footer).
  - Dokumentation in `PROJECT_DOCUMENTATION.md` aktualisieren (Farben, Schriftstil).
- **Abhängigkeiten:** Ermöglicht konsistentes Styling in allen folgenden Phasen.
- **Tests:** Visuelle Regression (Desktop/Tablet/Mobil), Farbkontrastprüfung (WCAG), Font-Fallback-Test.
- **Risiken & Mitigation:** Neue Farben könnten Kontrast verringern → vorab mit Kontrastchecker prüfen.

## Phase 2 – Hero-Verbesserungen (Roadmap 7.1)
- **Ziele:** Parallax-Scrollen + CTA.
- **Aufgaben:**
  - Hero-Container strukturieren (Wrapper für Bild & Overlay).
  - Parallax-Effekt via CSS `background-position` + JS Scroll-Listener oder `scroll-timeline` implementieren; bei `prefers-reduced-motion: reduce` deaktivieren.
  - CTA-Panel gestalten (`Jetzt entdecken`), optional Anker zu Kartensektion oder `events.html` (Phase 6).
  - Fokus- und Tastatur-Navigation sicherstellen, ARIA-Beschriftung für CTA.
  - Sanfte Einblendung/Shadow-Anpassung im neuen Farbschema.
- **Abhängigkeiten:** Phase 1 (Farb-/Typo-Vars). CTA-Verlinkung ggf. zu neuem Abschnitt (Phasen 3/6).
- **Tests:** Scrollverhalten auf Desktop/Mobil, `prefers-reduced-motion`-Simulation, Tastaturfokus.
- **Risiken:** Parallax kann Leistung beeinflussen → Bildgrößen prüfen, Fallbacks definieren.

## Phase 3 – Karteninteraktionen (Roadmap 7.2)
- **Ziele:** Hover-Effekte, Badges, Icons.
- **Aufgaben:**
  - Taxonomie festlegen (z. B. Schwierigkeit „Einfach“, „Mittel“, Zeitangabe). Deutsche Begriffe abstimmen.
  - Badges positionieren (oben links/rechts), Farbvarianten aus Phase 1 nutzen.
  - Hover-Effekt mit `transform` + `box-shadow`; via `prefers-reduced-motion` abschaltbar.
  - Einfache Linien-Icons erstellen (Inline-SVG) oder recherchierte lizenzfreie Icons vektorisieren, in `assets/icons/` speichern.
  - Mobile Darstellung (Badges stacken, Icons skalieren).
- **Abhängigkeiten:** Phase 1 Farbvariationen; Phase 0 (Assets).
- **Tests:** Desktop/Tablet Hover/Focus, Screenreader (Badges als textliche Infos verfügbar), Performance-Check.
- **Risiken:** Icons müssen konsistent sein → ggf. Styleguide definieren.

## Phase 4 – Storytelling-Sektionen (Roadmap 7.3) ✅ **ABGESCHLOSSEN**
- **Ziele:** „Brew Basics"-Infografik und „Farm-to-Cup"-Timeline. ✅
- **Aufgaben:**
  - ✅ Infografik als responsive 3-Spalten-Grid umgesetzt (Grindgrößen, Verhältnis, Temperatur). Alle Texte in Deutsch, screenreader-freundlich.
  - ✅ Timeline-Komponente (3 Schritte) erstellt; Desktop horizontal, Mobil vertikal. Icons und Beschreibungen integriert.
  - ✅ Icons/Farben aus Phase 1/3 verwendet.
  - ✅ Scroll-Animationen implementiert.
- **Ergebnis:** Beide Sektionen vollständig implementiert mit Hover-Effekten, responsivem Layout und Scroll-Animationen.

## Phase 5 – Kontakt & Standort (Roadmap 7.5) ✅ **ABGESCHLOSSEN**
- **Ziele:** Google-Maps-Einbettung. ✅
- **Aufgaben:**
  - ✅ Inline-`iframe` mit responsive Aspect-Ratio-Technik implementiert.
  - ✅ Abschnitt „Besuchen Sie uns" gestaltet mit Info-Panel und Map. Responsive Layout (Grid: 1fr / 1.5fr, Stack auf Mobil).
  - ✅ "In Google Maps öffnen" Button hinzugefügt.
- **Ergebnis:** Vollständige "Besuchen Sie uns" Sektion mit Google Maps Embed, Adressinformationen und responsivem Layout.

## Phase 6 – Neue Inhaltsseite `events.html` (Roadmap 7.6) ✅ **ABGESCHLOSSEN**
- **Ziele:** Events/Workshops präsentieren. ✅
- **Aufgaben:**
  - ✅ Neue HTML-Seite `events.html` mit Event-Karten-Layout erstellt.
  - ✅ 6 Beispielveranstaltungen mit deutschem Microcopy (Datumsformat TT.MM.JJJJ, Zeiten, Preise).
  - ✅ Navigation: Verlinkung aus Footer implementiert.
  - ✅ Gemeinsame Styles wiederverwendet, neue Event-Card-Komponenten modular in CSS strukturiert.
- **Ergebnis:** Vollständige Events-Seite mit 6 Event-Karten, Responsive 2-Spalten-Grid, Scroll-Animationen, und Footer-Verlinkung.

## Phase 7 – Motion & Interaktion (Roadmap 7.7) ✅ **ABGESCHLOSSEN**
- **Ziele:** Scroll-Animationen & Fortschrittsanzeige. ✅
- **Aufgaben:**
  - Intersection Observer (siehe MDN) implementieren, um Karten/Story-Sektionen beim Eintritt zu animieren (Fade/Slide). Bei `prefers-reduced-motion` Animationen deaktivieren.
  - Fortschrittsanzeige für lange Rezeptseiten (z. B. oben fixe Fortschrittsleiste, basiert auf Scroll-Position). Code in `scripts/main.js`, wiederverwendbar.
  - Performance optimieren (Observer entkoppeln, passive Listener).
- **Abhängigkeiten:** Gemeinsames Skript (Phase 0), Layout-Sektionen (Phasen 3–4).
- **Tests:** Scroll-Verhalten, Reduced-Motion, Rezeptseite `french-press.html` sowie künftige Guides.
- **Risiken:** Observer kann bei vielen Elementen kosten → Batch-Registrierung prüfen.

## Phase 8 – Accessibility & Polish (Roadmap 7.8) ✅ **ABGESCHLOSSEN**
- **Ziele:** Dark Mode Toggle, Microcopy, responsive Feinschliff. ✅
- **Aufgaben:**
  - ✅ Dark-Mode-Toggle implementiert (Fixierter Button unten rechts, `aria-pressed`, `localStorage`-Speicherung). Grey-basierte Farbpalette (nicht blau): `#1a1a1a` Hintergrund, `#2a2a2a` Oberfläche, `#f5f5f5` Text.
  - ✅ Alt-Texte, Buttons, Badges geprüft und konsistent germanisiert.
  - ✅ Responsive Tweaks: 768px Breakpoint hinzugefügt, Abstände/Schriftgrößen optimiert, Footer-Grid verbessert (5→3→1 Spalten).
  - ✅ Dokumentation in `PROJECT_DOCUMENTATION.md` aktualisiert.
- **Ergebnis:** Vollständiger Dark Mode mit Grey-Palette, alle Microcopy auf Deutsch, responsive Optimierungen, vollständige Komponenten-Styling für Dark Mode.

## Phase 9.1 – Foundation Phase (Phase 1 from IMPROVEMENT_ROADMAP.md) ✅ **ABGESCHLOSSEN**

## Phase 9.2 – Enhancement Phase (Phase 2 from IMPROVEMENT_ROADMAP.md) ✅ **ABGESCHLOSSEN**
- **Ziele:** SEO-Verbesserungen, Barrierefreiheit, Social Sharing, Print-Optimierung.
- **Aufgaben:**
  - ✅ **ABGESCHLOSSEN:** Skip-to-Content Link für Barrierefreiheit. Auf allen 11 HTML-Seiten implementiert. WCAG-konform, Dark Mode Support.
  - ✅ **ABGESCHLOSSEN:** System-Präferenz-Erkennung für Dark Mode. `initDarkMode()` erweitert um `prefers-color-scheme` Unterstützung. Respektiert OS-Theme-Einstellung beim ersten Besuch.
  - ✅ **ABGESCHLOSSEN:** Open Graph Meta-Tags für Social Sharing. Implementiert auf `index.html`, `french-press.html`, `events.html`. Facebook/Open Graph und Twitter Card Tags. **Hinweis:** Verbleibende 8 Rezeptseiten können mit gleichem Muster aktualisiert werden.
  - ✅ **ABGESCHLOSSEN:** Schema.org Markup für Rezepte (JSON-LD). Recipe Schema auf allen 9 Rezeptseiten, Organization Schema auf `index.html`, Event Schema auf `events.html`. Vollständig validiert und SEO-optimiert.
  - ✅ **ABGESCHLOSSEN:** Print-Styles für Rezeptseiten. `@media print` CSS-Regeln in `styles.css` (Zeilen 2580-2778), optimierte Typografie für Druck, versteckt nicht-essenzielle Elemente, formatiert Tabellen.
  - ✅ **ABGESCHLOSSEN:** Sitemap.xml Generierung. XML-Sitemap erstellt mit allen 11 Seiten, Prioritäten (Homepage 1.0, Rezepte 0.8, Events 0.7), Change-Frequenzen gesetzt.
- **Zusätzliche Updates:**
  - ✅ Hero-Sektion auf 100vh gesetzt (genau Viewport-Höhe)
  - ✅ Hero-Overlay-Karte zentriert (horizontal und vertikal)
- **Ergebnis:** 6 von 6 Aufgaben abgeschlossen (100%). Phase 2 vollständig abgeschlossen. SEO, Barrierefreiheit, Print-Optimierung und Social Sharing implementiert.

## Phase 9.3 – Polish Phase (Phase 3 from IMPROVEMENT_ROADMAP.md) ✅ **ABGESCHLOSSEN**
- **Ziele:** Recipe Timer Integration, Micro-Interactions, Mobile Improvements.
- **Aufgaben:**
  - ✅ **ABGESCHLOSSEN:** Recipe Timer Widget auf allen 9 Rezeptseiten implementiert. Features: Countdown, Start/Pause/Reset, Schritt-für-Schritt Benachrichtigungen, optionale Sound-Alerts, visuelle Schritt-Hervorhebung (active/completed/next).
  - ✅ **ABGESCHLOSSEN:** Micro-Interactions: Button Ripple-Effekte, Success-Animationen für Formulare, Skeleton-Loader Styles.
  - ✅ **ABGESCHLOSSEN:** Mobile Verbesserungen: Verbesserte `:active` States für Touch-Geräte, besseres Touch-Feedback.
  - ✅ **ABGESCHLOSSEN:** Dark Mode Toggle Icon verbessert: Saubere neue Icons (Mond/Sonne), zeigt Ziel-Modus an (nicht aktuellen Modus).
  - ✅ **ABGESCHLOSSEN:** Card Corner Rounding Fix: Alle Ecken (oben und unten) bleiben während Hover-Animationen abgerundet.
  - ✅ **ABGESCHLOSSEN:** Card Title Positioning: 4px rechts-Versatz für bessere visuelle Ausrichtung.
- **Ergebnis:** Alle Phase 3 Aufgaben abgeschlossen. Timer-Widgets auf allen 9 Rezeptseiten, verbesserte Interaktionen und Mobile-Experience.

## Phase 9 – Qualitätssicherung & Übergabe
- **Aufgaben:**
  - Playwright/Browser-Tests: Screenshots der Landingpage (Desktop/Tablet/Mobil) und Rezeptseiten.
  - `read_lints` für geänderte Dateien, HTML/CSS-Validatoren nutzen.
  - `PROJECT_DOCUMENTATION.md` und `DEVELOPMENT_PLAN.md` auf finalen Stand bringen.
  - Newsletter-Integration abschließen.
- **Lieferobjekte:** Aktualisierte Dokumente, Screenshots, Liste bekannter offener Punkte.

## Querschnittsthemen & Abhängigkeiten
- **Versionierung:** Größere Meilensteine als separate Commits (oder Tags) kennzeichnen.
- **Internationalisierung:** Neue Texte konsequent auf Deutsch verfassen, ggf. Glossar pflegen.
- **Performance:** Bilder komprimieren, Lazy-Loading beibehalten, Map ggf. erst on-demand.
- **Barrierefreiheit:** Jede Phase auf WCAG-Konformität prüfen; Motion-Features immer mit `prefers-reduced-motion` absichern.
- **Dokumentation:** Nach jeder Phase `PROJECT_DOCUMENTATION.md` unter Kapitel 7/Design System aktualisieren; Ergebnisse hier im Plan abhaken.

## Nächste Schritte
1. Phase 0 starten: Ordner/Skripte vorbereiten, Farbsystem placeholders ergänzen.
2. Iteratives Arbeiten Phase 1 → Phase 8, dabei nach jeder Phase kurzes Review & Test.
3. Nach Abschluss Phase 8 Phase 9 (QA/Handover) durchführen und Plan/Dokumentation aktualisieren.

Mit dieser Struktur bleibt die Entwicklung eng am Roadmap-Fokus, ermöglicht Zwischenreviews und stellt sicher, dass Design, Interaktion und Zugänglichkeit konsistent wachsen.

