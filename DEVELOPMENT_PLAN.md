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

## Phase 4 – Storytelling-Sektionen (Roadmap 7.3)
- **Ziele:** „Brew Basics“-Infografik und „Farm-to-Cup“-Timeline.
- **Aufgaben:**
  - Infografik als responsive SVG oder CSS-Grid mit Pseudoelementen umsetzen (Grindgrößen, Verhältnis, Temperatur). Sicherstellen, dass Text in Deutsch und screenreader-freundlich ist.
  - Timeline-Komponente (3 Schritte) erstellen; Desktop horizontal, Mobil vertikal (CSS Grid/Flex).
  - Icons/Farben aus Phase 1/3 verwenden.
  - Verankerung für CTA (Phase 2) optional in diesen Bereich.
- **Abhängigkeiten:** Icon-Bibliothek (Phase 3), Farb-/Typo-System.
- **Tests:** Responsivität (≥3 Breakpoints), Lesbarkeit, Screenreader linearer Lesefluss.
- **Risiken:** SVG-Text sollte durchdacht sein → alternative Texte bereitstellen.

## Phase 5 – Kontakt & Standort (Roadmap 7.5)
- **Ziele:** Google-Maps-Einbettung oder datenschutzfreundlicher Link.
- **Aufgaben:**
  - Entscheidung: Inline-`iframe` mit Consent-Hinweis oder stylisierter Link. Datenschutz-Hinweis (ggf. Toggle zur Aktivierung).
  - Abschnitt „Besuchen Sie uns“ gestalten, Map responsive machen (`aspect-ratio`, `max-width`).
  - Footer oder neuer Sektion an passender Stelle einfügen.
- **Abhängigkeiten:** Farb-/Typografie (Phase 1).
- **Tests:** Ladezeit (Lazy-Loading der Map), Mobilbedienung, Tastaturfokus.
- **Risiken:** Datenschutz → Option für platzhalterische Karte mit Button „Karte laden“.

## Phase 6 – Neue Inhaltsseite `events.html` (Roadmap 7.6)
- **Ziele:** Events/Workshops präsentieren.
- **Aufgaben:**
  - Neue HTML-Seite mit Layout ähnlich `index.html`, aber Event-Karten oder Zeitstrahl.
  - Beispieltermine mit deutschem Microcopy (Datumsformat TT.MM.JJJJ).
  - Navigation: Verlinkung aus Hero-CTA, Footer, ggf. Timeline.
  - Wiederverwendung gemeinsamer Styles, neue Komponenten in CSS modular strukturieren.
- **Abhängigkeiten:** Typografie/Farben (Phase 1), ggf. CTA (Phase 2).
- **Tests:** Navigationsfluss zwischen Seiten, Responsivität, Link-Konsistenz.
- **Risiken:** Content-Pflege → Platzhalter klar kennzeichnen.

## Phase 7 – Motion & Interaktion (Roadmap 7.7)
- **Ziele:** Scroll-Animationen & Fortschrittsanzeige.
- **Aufgaben:**
  - Intersection Observer (siehe MDN) implementieren, um Karten/Story-Sektionen beim Eintritt zu animieren (Fade/Slide). Bei `prefers-reduced-motion` Animationen deaktivieren.
  - Fortschrittsanzeige für lange Rezeptseiten (z. B. oben fixe Fortschrittsleiste, basiert auf Scroll-Position). Code in `scripts/main.js`, wiederverwendbar.
  - Performance optimieren (Observer entkoppeln, passive Listener).
- **Abhängigkeiten:** Gemeinsames Skript (Phase 0), Layout-Sektionen (Phasen 3–4).
- **Tests:** Scroll-Verhalten, Reduced-Motion, Rezeptseite `french-press.html` sowie künftige Guides.
- **Risiken:** Observer kann bei vielen Elementen kosten → Batch-Registrierung prüfen.

## Phase 8 – Accessibility & Polish (Roadmap 7.8)
- **Ziele:** Dark Mode Toggle, Microcopy, responsive Feinschliff.
- **Aufgaben:**
  - Dark-Mode-Toggle implementieren (Button, `aria-pressed`, Speicherung in `localStorage`, Persistenz auf beiden Seiten). Style-Variablen aus Phase 1 verwenden.
  - Alt-Texte, Buttons, Badges erneut prüfen und konsistent germanisieren.
  - Responsive Tweaks: Abstände, Schriftgrößen, Kartenstacking; ggf. zusätzliche Breakpoints dokumentieren.
  - Dokumentation (Designsystem, JS-Funktionen, neue Komponenten) in `PROJECT_DOCUMENTATION.md` aktualisieren.
- **Abhängigkeiten:** Vorherige Phasen (Variablen, neue Sektionen, JS).
- **Tests:** Accessibility Audit (Screenreader, Tastatur, Farbkontraste), Dark/Light-Mode, Persistenztests.
- **Risiken:** Lokalspeicher in Private Browsing → defensiv programmieren.

## Phase 9 – Qualitätssicherung & Übergabe
- **Aufgaben:**
  - Playwright/Browser-Tests: Screenshots der Landingpage (Desktop/Tablet/Mobil) und `french-press.html`.
  - `read_lints` für geänderte Dateien, HTML/CSS-Validatoren nutzen.
  - `PROJECT_DOCUMENTATION.md` und `DEVELOPMENT_PLAN.md` auf finalen Stand bringen.
  - Offene Fragen (Assets, Newsletter-Integration) erneut bewerten und als „Future Considerations“ dokumentieren.
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

