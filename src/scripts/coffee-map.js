// MapLibre GL JS is loaded from CDN as a global variable

class CoffeeMap {
  constructor(containerId, originsData, coffeeData) {
    this.container = containerId;
    this.origins = originsData.origins;
    this.coffeeBelt = originsData.coffeeBelt;
    this.roastery = originsData.roastery;
    this.coffeeData = coffeeData;
    this.markers = new Map();
    this.activeMarker = null;

    this.initMap();
  }

  initMap() {
    this.map = new maplibregl.Map({
      container: this.container,
      style: this.getCustomStyle(),
      center: [20, 10],
      zoom: 2,
      minZoom: 1.5,
      maxZoom: 8,
      attributionControl: false
    });

    // Add attribution control in bottom right
    this.map.addControl(
      new maplibregl.AttributionControl({
        compact: true
      }),
      'bottom-right'
    );

    // Add navigation controls
    this.map.addControl(
      new maplibregl.NavigationControl({
        showCompass: true,
        showZoom: true,
        visualizePitch: false
      }),
      'top-right'
    );

    this.map.on('load', () => {
      this.hideLoading();
      this.addCoffeeBelt();
      this.addConnectionLines();
      this.addRoasteryMarker();
      this.addOriginMarkers();
      this.setupKeyboardNavigation();
    });
  }

  getCustomStyle() {
    return {
      version: 8,
      sources: {
        'osm': {
          type: 'raster',
          tiles: ['https://tile.openstreetmap.org/{z}/{x}/{y}.png'],
          tileSize: 256,
          attribution: '© OpenStreetMap contributors'
        },
        'country-boundaries': {
          type: 'geojson',
          data: 'https://raw.githubusercontent.com/datasets/geo-countries/master/data/countries.geojson'
        }
      },
      layers: [
        {
          id: 'background',
          type: 'background',
          paint: {
            'background-color': '#0e1a3a' // Brand ink color
          }
        },
        {
          id: 'osm-tiles',
          type: 'raster',
          source: 'osm',
          paint: {
            // Dynamic opacity based on zoom level for better readability
            'raster-opacity': [
              'interpolate',
              ['linear'],
              ['zoom'],
              1.5, 0.15,  // Very subtle at world view
              3, 0.25,    // Slightly more visible at regional view
              6, 0.35     // More prominent when zoomed in
            ],
            'raster-brightness-min': 0.05,
            'raster-brightness-max': 0.4,
            'raster-contrast': 0.3,
            'raster-saturation': -0.7,
            // Add warm terracotta tint
            'raster-hue-rotate': 15
          }
        },
        {
          id: 'country-borders',
          type: 'line',
          source: 'country-boundaries',
          paint: {
            'line-color': '#7e9c87', // Brand sage color for borders
            'line-width': [
              'interpolate',
              ['linear'],
              ['zoom'],
              1.5, 0.5,
              5, 1,
              8, 1.5
            ],
            'line-opacity': 0.2,
            'line-blur': 0.5
          }
        }
      ]
    };
  }

  hideLoading() {
    const loadingEl = document.querySelector('.map-loading');
    if (loadingEl) {
      loadingEl.style.opacity = '0';
      setTimeout(() => {
        loadingEl.style.display = 'none';
      }, 300);
    }
  }

  addCoffeeBelt() {
    // Add coffee belt as a highlighted zone
    this.map.addSource('coffee-belt', {
      type: 'geojson',
      data: {
        type: 'Feature',
        geometry: {
          type: 'Polygon',
          coordinates: [[
            [-180, this.coffeeBelt.north],
            [180, this.coffeeBelt.north],
            [180, this.coffeeBelt.south],
            [-180, this.coffeeBelt.south],
            [-180, this.coffeeBelt.north]
          ]]
        }
      }
    });

    // Fill
    this.map.addLayer({
      id: 'coffee-belt-fill',
      type: 'fill',
      source: 'coffee-belt',
      paint: {
        'fill-color': '#D9755B',
        'fill-opacity': 0.08
      }
    });

    // Border lines
    this.map.addLayer({
      id: 'coffee-belt-outline',
      type: 'line',
      source: 'coffee-belt',
      paint: {
        'line-color': '#D9755B',
        'line-width': 1.5,
        'line-opacity': 0.4,
        'line-dasharray': [3, 2]
      }
    });
  }

  addConnectionLines() {
    // Create curved lines from each origin to Berlin
    const lineFeatures = this.origins.map(origin => {
      return {
        type: 'Feature',
        properties: {
          origin: origin.country
        },
        geometry: {
          type: 'LineString',
          coordinates: [origin.coordinates, this.roastery.coordinates]
        }
      };
    });

    this.map.addSource('connection-lines', {
      type: 'geojson',
      data: {
        type: 'FeatureCollection',
        features: lineFeatures
      }
    });

    // Add animated dashed lines
    this.map.addLayer({
      id: 'connection-lines-layer',
      type: 'line',
      source: 'connection-lines',
      paint: {
        'line-color': '#C97A5C', // Terracotta brand color
        'line-width': [
          'interpolate',
          ['linear'],
          ['zoom'],
          1.5, 1,
          5, 1.5,
          8, 2
        ],
        'line-opacity': 0.3,
        'line-dasharray': [2, 4],
        'line-blur': 1
      }
    });
  }

  addRoasteryMarker() {
    // Create Berlin roastery marker
    const el = document.createElement('div');
    el.className = 'roastery-marker';
    el.setAttribute('role', 'img');
    el.setAttribute('aria-label', this.roastery.displayName);

    el.innerHTML = `
      <svg width="45" height="45" viewBox="0 0 45 45" class="roastery-svg">
        <defs>
          <radialGradient id="roastery-gradient" cx="50%" cy="40%">
            <stop offset="0%" style="stop-color:#E6DCCF;stop-opacity:1" />
            <stop offset="100%" style="stop-color:#C97A5C;stop-opacity:1" />
          </radialGradient>
          <filter id="roastery-glow" x="-50%" y="-50%" width="200%" height="200%">
            <feGaussianBlur stdDeviation="3" result="coloredBlur"/>
            <feMerge>
              <feMergeNode in="coloredBlur"/>
              <feMergeNode in="SourceGraphic"/>
            </feMerge>
          </filter>
        </defs>

        <!-- Coffee cup symbol for roastery -->
        <g filter="url(#roastery-glow)">
          <circle cx="22.5" cy="22.5" r="18"
                  fill="url(#roastery-gradient)"
                  stroke="#0E1A3A" stroke-width="2.5"/>

          <!-- Steam lines -->
          <path d="M 15 10 Q 15 5 15 8 Q 15 3 15 6"
                stroke="#C97A5C" stroke-width="2"
                fill="none" stroke-linecap="round" opacity="0.7"/>
          <path d="M 22.5 10 Q 22.5 5 22.5 8 Q 22.5 3 22.5 6"
                stroke="#C97A5C" stroke-width="2"
                fill="none" stroke-linecap="round" opacity="0.7"/>
          <path d="M 30 10 Q 30 5 30 8 Q 30 3 30 6"
                stroke="#C97A5C" stroke-width="2"
                fill="none" stroke-linecap="round" opacity="0.7"/>

          <!-- Coffee cup -->
          <path d="M 15 16 L 14 28 Q 14 31 17 31 L 28 31 Q 31 31 31 28 L 30 16 Z"
                fill="#0E1A3A" opacity="0.8"/>
          <ellipse cx="22.5" cy="16" rx="8" ry="2"
                   fill="#0E1A3A" opacity="0.6"/>
        </g>
      </svg>
      <span class="roastery-label">${this.roastery.city}</span>
    `;

    new maplibregl.Marker({
      element: el,
      anchor: 'center'
    })
      .setLngLat(this.roastery.coordinates)
      .addTo(this.map);
  }

  addOriginMarkers() {
    this.origins.forEach((origin, index) => {
      const el = this.createMarkerElement(origin);

      const marker = new maplibregl.Marker({
        element: el,
        anchor: 'bottom'
      })
        .setLngLat(origin.coordinates)
        .addTo(this.map);

      this.markers.set(origin.country, {
        marker,
        element: el,
        data: origin,
        index
      });

      // Click handler
      el.addEventListener('click', () => this.selectOrigin(origin.country));

      // Hover handlers
      el.addEventListener('mouseenter', () => this.hoverOrigin(origin.country));
      el.addEventListener('mouseleave', () => this.unhoverOrigin(origin.country));
    });
  }

  createMarkerElement(origin) {
    const el = document.createElement('div');
    el.className = 'coffee-marker';
    el.setAttribute('tabindex', '0');
    el.setAttribute('role', 'button');
    el.setAttribute('aria-label', `${origin.displayName} Kaffeeherkunft`);

    el.innerHTML = `
      <svg width="50" height="62" viewBox="0 0 50 62" class="marker-svg">
        <defs>
          <!-- Gradient for coffee bean body -->
          <radialGradient id="bean-gradient-${origin.country}" cx="40%" cy="35%">
            <stop offset="0%" style="stop-color:#D9755B;stop-opacity:1" />
            <stop offset="50%" style="stop-color:#C86A4E;stop-opacity:1" />
            <stop offset="100%" style="stop-color:#A85840;stop-opacity:1" />
          </radialGradient>

          <!-- Glow filter for hover effect -->
          <filter id="glow-${origin.country}" x="-50%" y="-50%" width="200%" height="200%">
            <feGaussianBlur stdDeviation="4" result="coloredBlur"/>
            <feMerge>
              <feMergeNode in="coloredBlur"/>
              <feMergeNode in="SourceGraphic"/>
            </feMerge>
          </filter>

          <!-- Drop shadow for depth -->
          <filter id="shadow-${origin.country}" x="-50%" y="-50%" width="200%" height="200%">
            <feDropShadow dx="0" dy="3" stdDeviation="3" flood-color="#000" flood-opacity="0.4"/>
          </filter>
        </defs>

        <g class="marker-pin" filter="url(#shadow-${origin.country})">
          <!-- Coffee bean body with gradient -->
          <ellipse cx="25" cy="23" rx="15" ry="19"
                   fill="url(#bean-gradient-${origin.country})"
                   stroke="#fff" stroke-width="2.5"
                   class="bean-body"/>

          <!-- Coffee bean center line -->
          <path d="M 25 8 Q 27.5 23 25 38"
                stroke="#fff" stroke-width="2"
                fill="none" opacity="0.9"
                stroke-linecap="round"
                class="bean-line"/>

          <!-- Highlight for 3D effect -->
          <ellipse cx="20" cy="18" rx="4" ry="6"
                   fill="#fff" opacity="0.25"
                   class="bean-highlight"/>

          <!-- Pin stem -->
          <line x1="25" y1="42" x2="25" y2="58"
                stroke="url(#bean-gradient-${origin.country})"
                stroke-width="2.5"
                stroke-linecap="round"
                class="pin-stem"/>

          <!-- Pin point -->
          <circle cx="25" cy="59" r="2.5"
                  fill="#A85840"
                  class="pin-point"/>
        </g>
      </svg>
      <span class="marker-label">${origin.displayName}</span>
    `;

    // Keyboard support
    el.addEventListener('keydown', (e) => {
      if (e.key === 'Enter' || e.key === ' ') {
        e.preventDefault();
        this.selectOrigin(origin.country);
      }
    });

    return el;
  }

  hoverOrigin(countryCode) {
    const { element } = this.markers.get(countryCode);
    element.classList.add('hover');

    // Dim other markers
    this.markers.forEach(({ element: el }, code) => {
      if (code !== countryCode && !el.classList.contains('active')) {
        el.classList.add('dimmed');
      }
    });
  }

  unhoverOrigin(countryCode) {
    const { element } = this.markers.get(countryCode);
    element.classList.remove('hover');

    // Remove dimming from all markers
    this.markers.forEach(({ element: el }) => {
      el.classList.remove('dimmed');
    });
  }

  selectOrigin(countryCode) {
    const { marker, element, data } = this.markers.get(countryCode);

    // Update active states
    this.markers.forEach(({ element: el }) => {
      el.classList.remove('active');
    });
    element.classList.add('active');
    this.activeMarker = countryCode;

    // Pan map to origin
    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    const isMobile = window.innerWidth < 1024;

    this.map.flyTo({
      center: data.coordinates,
      zoom: isMobile ? 4 : 5,
      duration: prefersReducedMotion ? 0 : 1500,
      essential: true
    });

    // Update detail panel
    this.showOriginDetails(data);

    // Announce to screen readers
    this.announceSelection(data.displayName);
  }

  showOriginDetails(origin) {
    const panel = document.getElementById('map-details');
    const coffee = this.coffeeData.find(c => c.slug === origin.coffeeSlug);

    panel.innerHTML = `
      <article class="origin-detail">
        <button class="panel-close" aria-label="Schließen">
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
            <path d="M18 6L6 18M6 6l12 12"/>
          </svg>
        </button>

        <div class="detail-hero">
          <img src="${origin.thumbnail}" alt="${origin.displayName} Kaffee" loading="lazy">
        </div>

        <div class="detail-content">
          <h2>${origin.displayName}</h2>
          <p class="detail-region">${origin.region}</p>

          <dl class="detail-specs">
            <div>
              <dt>Höhenlage</dt>
              <dd>${origin.elevation}</dd>
            </div>
            <div>
              <dt>Aufbereitung</dt>
              <dd>${origin.processing}</dd>
            </div>
          </dl>

          <div class="detail-climate">
            <h3>Klima & Terroir</h3>
            <p>${origin.climate}</p>
          </div>

          <div class="detail-flavors">
            <h3>Geschmacksprofil</h3>
            <div class="flavor-tags">
              ${origin.flavorProfile.map(f => `<span class="tag">${f}</span>`).join('')}
            </div>
          </div>

          ${coffee ? `
            <div class="detail-coffee">
              <h3>Empfohlener Kaffee</h3>
              <a href="/${coffee.slug}/" class="coffee-card-link">
                <div class="coffee-card-mini">
                  <img src="${coffee.image}" alt="${coffee.name}" loading="lazy">
                  <div class="coffee-info">
                    <h4>${coffee.name}</h4>
                    <p class="price">${coffee.price}</p>
                    ${coffee.soldOut ? '<span class="sold-out-badge">Ausverkauft</span>' : ''}
                  </div>
                </div>
              </a>
            </div>
          ` : ''}
        </div>
      </article>
    `;

    panel.classList.add('active');

    // Close button handler
    const closeBtn = panel.querySelector('.panel-close');
    closeBtn.addEventListener('click', () => this.closePanel());
  }

  closePanel() {
    const panel = document.getElementById('map-details');
    panel.classList.remove('active');

    // Reset active marker
    if (this.activeMarker) {
      const { element } = this.markers.get(this.activeMarker);
      element.classList.remove('active');
      this.activeMarker = null;
    }

    // Reset map view
    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    this.map.flyTo({
      center: [20, 10],
      zoom: 2,
      duration: prefersReducedMotion ? 0 : 1500
    });
  }

  setupKeyboardNavigation() {
    const markerArray = Array.from(this.markers.values());

    document.addEventListener('keydown', (e) => {
      if (!this.activeMarker) return;

      const currentIndex = markerArray.findIndex(m => m.data.country === this.activeMarker);
      let nextIndex = currentIndex;

      if (e.key === 'ArrowRight' || e.key === 'ArrowDown') {
        e.preventDefault();
        nextIndex = (currentIndex + 1) % markerArray.length;
      } else if (e.key === 'ArrowLeft' || e.key === 'ArrowUp') {
        e.preventDefault();
        nextIndex = currentIndex - 1 < 0 ? markerArray.length - 1 : currentIndex - 1;
      } else if (e.key === 'Escape') {
        e.preventDefault();
        this.closePanel();
        return;
      }

      if (nextIndex !== currentIndex) {
        const nextMarker = markerArray[nextIndex];
        this.selectOrigin(nextMarker.data.country);
        nextMarker.element.focus();
      }
    });
  }

  announceSelection(countryName) {
    const announcement = document.createElement('div');
    announcement.className = 'sr-only';
    announcement.setAttribute('role', 'status');
    announcement.setAttribute('aria-live', 'polite');
    announcement.textContent = `${countryName} ausgewählt`;
    document.body.appendChild(announcement);

    setTimeout(() => {
      document.body.removeChild(announcement);
    }, 1000);
  }
}

// Initialize when DOM ready
document.addEventListener('DOMContentLoaded', () => {
  const originsDataEl = document.getElementById('map-origins-data');
  const coffeeDataEl = document.getElementById('coffee-data');

  if (originsDataEl && coffeeDataEl) {
    try {
      const originsData = JSON.parse(originsDataEl.textContent);
      const coffeeData = JSON.parse(coffeeDataEl.textContent);

      new CoffeeMap('coffee-map', originsData, coffeeData);
    } catch (error) {
      console.error('Failed to initialize coffee map:', error);

      // Show error message to user
      const mapContainer = document.getElementById('coffee-map');
      if (mapContainer) {
        mapContainer.innerHTML = `
          <div class="map-error">
            <p>Die Karte konnte nicht geladen werden. Bitte laden Sie die Seite neu.</p>
          </div>
        `;
      }
    }
  }
});
