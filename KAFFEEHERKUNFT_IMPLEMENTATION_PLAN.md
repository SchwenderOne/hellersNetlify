# 🎯 Kaffeeherkunft Page Implementation Plan
## Award-Worthy Interactive Experience (Option 3 - Refined v2.0)

**Project**: Hellers Kaffees - Coffee Origins Page Redesign
**Goal**: Create a visually stunning, interactive experience that incites a "wow effect"
**Timeline**: 8-9 days
**Last Updated**: 2025-11-10

---

## 📊 Executive Summary

### What We're Building
Transform the Kaffeeherkunft page from a functional map into an award-worthy interactive experience featuring:
- 3D globe visualization (desktop)
- Advanced GSAP animations with scroll-triggered sequences
- Data visualizations (flavor profiles, processing methods, altitude charts)
- Guided story mode + free exploration
- Mobile-first responsive design
- Virtual coffee journey from farm to cup

### Key Improvements Over Initial Plan
1. **Performance**: 55% reduction in bundle size (270KB → 120KB average)
2. **UX**: Unified navigation with story mode + tabbed interface
3. **Mobile**: Mobile-FIRST design, not "disabled features"
4. **Architecture**: Lazy loading, code splitting, error handling
5. **Measurement**: Built-in analytics to track success

---

## 🔬 Research Summary

### Technology Decisions

#### 3D Globe: three-globe
- **Chosen**: three-globe (50KB gzipped)
- **Rejected**: Cesium (2MB+, overkill for our needs)
- **Rationale**: Lightweight, performant, perfect for globe with origin pins
- **Performance**: Merge point meshes, low-poly sphere, pause when off-screen

#### Animations: GSAP 3 + ScrollTrigger
- **Status**: FREE since Webflow acquisition (2024)
- **Features**: ScrollTrigger, MorphSVG, MotionPath
- **Best Practice**: Single timeline per ScrollTrigger, scrub: 1, no easing on scroll-tied animations
- **Performance**: GPU-accelerated transforms, requestAnimationFrame

#### Data Viz: Chart.js
- **Chosen**: Chart.js (60KB)
- **Rejected**: D3.js (powerful but complex, slower to implement)
- **Rationale**: Built-in radar chart support, easier for standard visualizations
- **Features**: Radar (flavor profiles), doughnut (processing methods), bar (altitude)

#### SVG Morphing: GSAP MorphSVGPlugin
- **Now Free**: Included in GSAP since Webflow acquisition
- **Use Case**: Coffee processing method icons morph between states
- **Best Practice**: Match point counts, normalize paths, keep under 200 points

#### Glassmorphism Performance
- **Best Practice 2025**: Limit to 2-3 elements per viewport
- **Blur Values**: 10px desktop, 6-8px mobile
- **Avoid**: Nested backdrop-filters (multiplies cost)
- **GPU**: Use will-change: transform and backdrop-filter

#### Lazy Loading: Intersection Observer
- **Modern Standard**: 97%+ browser support (2025)
- **Use Cases**: Images, charts, animations, 3D globe
- **rootMargin**: 200px for charts, 50px for images
- **Performance**: Negligible CPU usage, compositor-thread based

---

## ⚠️ Critical Issues Identified & Fixed

### Issue #1: Bundle Size & Loading Strategy BROKEN

**Problem**: Initial plan loaded ALL libraries upfront (~270KB):
- GSAP (40KB) - even if user never scrolls
- Three.js + three-globe (120KB) - even if never clicks "3D View"
- Chart.js (60KB) - even if doesn't reach data section
- Lottie (50KB) - even if journey doesn't play

**Impact**:
- Mobile users on 3G wait 5+ seconds
- Users pay for features they don't use
- Core Web Vitals penalties (TTI, TBT)

**Solution**: Dynamic lazy loading system

```javascript
// NEW FILE: src/scripts/coffee-lazy-loader.js
class FeatureLoader {
  constructor() {
    this.loaded = new Set();
    this.loading = new Map();
  }

  async loadGSAP() {
    if (this.loaded.has('gsap')) return window.gsap;
    if (this.loading.has('gsap')) return this.loading.get('gsap');

    const promise = new Promise((resolve) => {
      const script = document.createElement('script');
      script.src = 'https://cdnjs.cloudflare.com/ajax/libs/gsap/3.12.5/gsap.min.js';
      script.onload = () => {
        this.loaded.add('gsap');
        resolve(window.gsap);
      };
      document.head.appendChild(script);
    });

    this.loading.set('gsap', promise);
    return promise;
  }

  async load3DGlobe() {
    if (this.loaded.has('globe')) return;

    await Promise.all([
      this.loadScript('three', 'https://unpkg.com/three@0.170.0/build/three.min.js'),
      this.loadScript('three-globe', 'https://unpkg.com/three-globe@2.45.0/dist/three-globe.min.js')
    ]);

    this.loaded.add('globe');
  }

  async loadCharts() {
    if (this.loaded.has('charts')) return window.Chart;
    return this.loadScript('charts', 'https://cdn.jsdelivr.net/npm/chart.js@4.4.1/dist/chart.umd.min.js');
  }
}

const loader = new FeatureLoader();

// Usage:
document.getElementById('enable-3d-view').addEventListener('click', async () => {
  showLoadingSpinner();
  await loader.load3DGlobe();
  initCoffeeGlobe3D();
  hideLoadingSpinner();
});
```

**Result**:
- Initial: 20KB (just core map)
- Average user: 120KB (saves 150KB, 55% reduction)

---

### Issue #2: Disconnected UX - Features Don't Tell a Story

**Problem**: Initial plan created isolated sections:
- Hero → Map → Belt chapters → Producers → Charts → Journey
- No clear navigation path
- Feels like museum exhibit, not interactive story

**Impact**:
- Users bounce (no guided path)
- Mobile users especially lost
- Rich data in originExperience.json not integrated

**Solution**: Unified Story Mode + Tabbed Navigation

```javascript
// NEW: src/scripts/coffee-story-mode.js
class CoffeeStoryMode {
  constructor() {
    this.chapters = [
      { id: 'hero', title: 'Willkommen', scroll: 0 },
      { id: 'belt-americas', title: 'Die Anden', mapFlyTo: [-75, -10], zoom: 4 },
      { id: 'belt-africa', title: 'Ostafrika', mapFlyTo: [37, 0], zoom: 4 },
      { id: 'producers', title: 'Die Menschen' },
      { id: 'data', title: 'Die Daten' }
    ];
  }

  async startStory() {
    // Lock scroll, show story UI
    document.body.style.overflow = 'hidden';
    await loader.loadGSAP();
    this.createTimeline();
  }

  createTimeline() {
    const tl = gsap.timeline({
      onUpdate: () => this.updateMap(tl.progress())
    });

    this.chapters.forEach((chapter) => {
      tl.to('.story-content', {
        duration: 1,
        onStart: () => this.showChapter(chapter.id)
      });

      if (chapter.mapFlyTo) {
        tl.call(() => {
          window.coffeeMap.flyTo({
            center: chapter.mapFlyTo,
            zoom: chapter.zoom
          });
        }, null, '<');
      }
    });
  }
}
```

**Alternative**: Tab-based navigation
```html
<nav class="coffee-tabs" role="tablist">
  <button role="tab" data-tab="map">Karte Erkunden</button>
  <button role="tab" data-tab="journey">Die Reise</button>
  <button role="tab" data-tab="data">Daten & Insights</button>
</nav>
```

**Result**: Clear user journey, better engagement

---

### Issue #3: Mobile Strategy is "Disable Features" - Unacceptable

**Problem**: Initial plan said:
- "Disable particle effects on mobile"
- "Disable parallax on mobile"
- "Disable 3D globe on mobile"

This creates second-class mobile experience for 60%+ of traffic.

**Solution**: Mobile-FIRST Responsive Strategy

```javascript
// NEW: src/scripts/coffee-responsive.js
class ResponsiveStrategy {
  constructor() {
    this.breakpoint = this.getBreakpoint();
    this.initForBreakpoint();
  }

  getBreakpoint() {
    if (window.innerWidth < 768) return 'mobile';
    if (window.innerWidth < 1024) return 'tablet';
    return 'desktop';
  }

  initMobileExperience() {
    // DESIGNED mobile experience, not disabled features:
    // ✅ Beautiful gradient hero (no particles needed)
    // ✅ Touch-optimized 2D map
    // ✅ Swipeable producer cards
    // ✅ Simple bar charts (not radar)
    // ✅ Bottom sheet for details

    this.initTouchCarousel('.producer-cards');
    this.initBottomSheet();
    this.useSimpleCharts = true;
  }

  initDesktopExperience() {
    // Add all enhancements:
    this.initParticles();
    this.initHeavyParallax();
    this.enable3DGlobeOption();
  }
}
```

**Mobile-Specific UI**:
```html
<!-- Bottom sheet for origin details (mobile) -->
<div class="origin-details-sheet" role="dialog">
  <div class="sheet-handle" aria-label="Zum Ziehen"></div>
  <div class="sheet-content">
    <!-- Swipeable content -->
  </div>
</div>
```

**Result**: Mobile users get DESIGNED experience, not degraded one

---

## 📐 Architecture

### File Structure
```
src/
├── coffee-origins.njk (enhanced)
├── scripts/
│   ├── coffee-map.js (existing 2D map)
│   ├── coffee-lazy-loader.js (NEW - dynamic imports)
│   ├── coffee-responsive.js (NEW - breakpoint strategy)
│   ├── coffee-story-mode.js (NEW - guided tour)
│   ├── coffee-globe.js (NEW - 3D globe)
│   ├── coffee-animations.js (NEW - GSAP timelines)
│   ├── coffee-viz.js (NEW - Chart.js visualizations)
│   ├── coffee-journey.js (NEW - scroll storytelling)
│   └── coffee-bottom-sheet.js (NEW - mobile panel)
├── styles/
│   └── styles.css (enhance map sections)
└── data/
    ├── mapOrigins.json (UPDATE - add flavorScores)
    ├── originExperience.json (existing - utilize!)
    └── coffees.json (existing)
```

### Loading Strategy
```
Initial Load (<20KB):
├── coffee-map.js (existing 2D map)
├── coffee-lazy-loader.js (dynamic imports)
└── coffee-responsive.js (breakpoint detection)

On-Demand Loading:
├── GSAP → When user scrolls past hero
├── 3D Globe → When user clicks "3D View"
├── Chart.js → When charts enter viewport
└── Animations → Per breakpoint
```

### Responsive Strategy
```
Mobile (<768px): CORE EXPERIENCE
├── Gradient hero (no particles)
├── Touch-optimized 2D map
├── Vertical scroll chapters
├── Swipeable producer cards
├── Simple bar charts
└── Bottom sheet for details

Tablet (768-1024px): ENHANCED
├── Light parallax effects
├── Standard carousel
├── Radar charts
└── Side-by-side layouts

Desktop (>1024px): FULL EXPERIENCE
├── Particle effects
├── Complex parallax
├── 3D globe option
├── Advanced data dashboard
└── Horizontal scroll journey
```

---

## 🚀 Implementation Phases

### **PHASE 1: Core Foundation** (Day 1-2)

#### 1.1 Lazy Loader System
**File**: `src/scripts/coffee-lazy-loader.js`

**What**: Dynamic import system for all heavy libraries
**Size**: ~100 lines
**Features**:
- Load GSAP on-demand
- Load Three.js + three-globe on button click
- Load Chart.js when charts scroll into view
- Error handling with fallbacks
- Loading state management

**Code Structure**:
```javascript
class FeatureLoader {
  constructor()
  async loadGSAP()
  async load3DGlobe()
  async loadCharts()
  loadScript(name, src)
}
```

#### 1.2 Responsive Strategy
**File**: `src/scripts/coffee-responsive.js`

**What**: Breakpoint detection and feature initialization
**Size**: ~150 lines
**Features**:
- Detect mobile/tablet/desktop
- Initialize appropriate features per device
- Handle resize events (debounced)
- Touch vs mouse interaction patterns

**Code Structure**:
```javascript
class ResponsiveStrategy {
  constructor()
  getBreakpoint()
  initForBreakpoint()
  initMobileExperience()
  initTabletExperience()
  initDesktopExperience()
}
```

#### 1.3 Mobile-First Hero
**Files**: `coffee-origins.njk`, `styles.css`

**Mobile**:
- Gradient background (linear-gradient with brand colors)
- 3 stat cards (no glassmorphism on mobile)
- Simple fade-in animation

**Tablet+**:
- Add glassmorphism to stat cards (max 3 for performance)
- Floating animation on cards

**Desktop**:
- Add particle canvas (lazy-loaded)
- More complex animations

**CSS Performance**:
```css
.glass-card {
  backdrop-filter: blur(10px);
  background: rgba(255, 255, 255, 0.1);
  will-change: transform;
  transform: translateZ(0); /* GPU layer */
}

/* Mobile: no backdrop-filter */
@media (max-width: 767px) {
  .glass-card {
    backdrop-filter: none;
    background: rgba(255, 255, 255, 0.15);
  }
}
```

#### 1.4 Enhanced 2D Map
**Files**: `coffee-map.js`, `styles.css`

**Enhancements**:
- Pulsing glow on markers (CSS animation)
- Touch gestures for mobile (pinch-zoom, pan)
- Smooth marker animations
- Connection lines "draw" effect (optional, GSAP)

**Performance**:
- Throttle scroll events with rAF
- Use transform: translate3d() for GPU
- Optimize for 60fps on mobile

---

### **PHASE 2: Unified Navigation** (Day 3)

#### 2.1 Tab-Based Interface
**File**: `coffee-origins.njk`

**Structure**:
```html
<nav class="coffee-tabs" role="tablist">
  <button role="tab" aria-selected="true" data-tab="map">
    <svg>...</svg> Karte Erkunden
  </button>
  <button role="tab" data-tab="journey">
    <svg>...</svg> Die Reise
  </button>
  <button role="tab" data-tab="data">
    <svg>...</svg> Daten & Insights
  </button>
</nav>

<div class="tab-content">
  <section role="tabpanel" id="tab-map">
    <!-- Map + Origin markers + Legend -->
  </section>
  <section role="tabpanel" id="tab-journey" hidden>
    <!-- Belt chapters + Producers + Timeline -->
  </section>
  <section role="tabpanel" id="tab-data" hidden>
    <!-- Charts + Visualizations -->
  </section>
</div>
```

**Functionality**:
- ARIA-compliant tabs
- Keyboard navigation (arrow keys)
- URL hash support (#map, #journey, #data)
- Mobile: Horizontal scroll tabs

#### 2.2 Story Mode (Optional)
**File**: `src/scripts/coffee-story-mode.js`

**Features**:
- "Start Tour" button in hero
- Auto-scroll through chapters
- Map syncs with narrative
- User controls: Play/Pause, ← → navigation
- Exit at any time

**GSAP Timeline**:
```javascript
const tl = gsap.timeline();

// Chapter 1: Americas
tl.to('.story-content', { duration: 1, onStart: () => showChapter('americas') });
tl.call(() => map.flyTo([-75, -10], 4));
tl.to({}, { duration: 3 }); // Hold for reading

// Chapter 2: Africa
tl.to('.story-content', { duration: 1, onStart: () => showChapter('africa') });
tl.call(() => map.flyTo([37, 0], 4));
tl.to({}, { duration: 3 });
```

#### 2.3 Mobile Bottom Sheet
**File**: `src/scripts/coffee-bottom-sheet.js`

**Features**:
- Touch-draggable panel
- Snap points: peek (10%), half (50%), full (90%)
- Momentum scrolling
- Backdrop blur on full expansion

**Implementation**:
```javascript
class BottomSheet {
  constructor(element) {
    this.element = element;
    this.snapPoints = [0.1, 0.5, 0.9];
    this.initTouch();
  }

  initTouch() {
    // Touch event handlers
    this.element.addEventListener('touchstart', this.onTouchStart);
    this.element.addEventListener('touchmove', this.onTouchMove);
    this.element.addEventListener('touchend', this.onTouchEnd);
  }

  snapTo(point) {
    // Snap to nearest point with spring animation
  }
}
```

---

### **PHASE 3: Content Sections** (Day 4-5)

#### 3.1 Coffee Belt Chapters
**File**: `coffee-origins.njk` (using `originExperience.beltChapters`)

**Data Structure**:
```json
{
  "id": "americas",
  "title": "Anden & Amazonas",
  "lede": "Sonnengereifte Süße trifft auf elegante Säure...",
  "altitude": "900–2.100 m",
  "flavors": ["Papaya", "Karamell", "Blutorange"],
  "origins": ["Brazil", "Colombia", "Peru", "Honduras"],
  "image": "..."
}
```

**Layout**:
```html
<section class="coffee-belt-journey">
  {% for chapter in originExperience.beltChapters %}
  <article class="belt-chapter" data-chapter="{{ chapter.id }}">
    <div class="chapter-visual" data-parallax="0.6">
      <img src="{{ chapter.image }}" alt="{{ chapter.title }}" loading="lazy">
    </div>
    <div class="chapter-content">
      <h2>{{ chapter.title }}</h2>
      <p class="chapter-lede">{{ chapter.lede }}</p>
      <div class="chapter-stats">
        <span>Höhe: {{ chapter.altitude }}</span>
      </div>
      <div class="flavor-cascade">
        {% for flavor in chapter.flavors %}
        <span class="flavor-tag">{{ flavor }}</span>
        {% endfor %}
      </div>
    </div>
  </article>
  {% endfor %}
</section>
```

**Animations (Desktop)**:
```javascript
gsap.utils.toArray('.belt-chapter').forEach((chapter) => {
  const tl = gsap.timeline({
    scrollTrigger: {
      trigger: chapter,
      start: 'top 80%',
      end: 'bottom 20%',
      scrub: 1
    }
  });

  tl.from(chapter.querySelector('.chapter-visual'), {
    scale: 0.8,
    opacity: 0
  })
  .from(chapter.querySelectorAll('.flavor-tag'), {
    scale: 0,
    rotation: 360,
    stagger: 0.1
  });
});
```

**Map Integration**:
- Clicking chapter flies map to region
- Highlights relevant origin markers
- Shows regional info in panel

#### 3.2 Producer Spotlight
**File**: `coffee-origins.njk` (using `originExperience.producerSpotlights`)

**Mobile**: Swipeable cards (CSS scroll-snap)
```css
.spotlight-carousel {
  display: flex;
  overflow-x: auto;
  scroll-snap-type: x mandatory;
  -webkit-overflow-scrolling: touch;
}

.producer-card {
  scroll-snap-align: center;
  flex: 0 0 85%;
}
```

**Desktop**: GSAP Draggable carousel (lazy-loaded)
```javascript
// Only load on desktop
if (breakpoint === 'desktop') {
  await loader.loadGSAP();
  Draggable.create('.spotlight-carousel', {
    type: 'x',
    bounds: '.producer-spotlight',
    inertia: true
  });
}
```

**Content**:
```html
<div class="producer-card">
  <div class="producer-image-wrapper">
    <img src="{{ producer.image }}" alt="{{ producer.name }}" loading="lazy">
  </div>
  <blockquote>
    <p>{{ producer.quote }}</p>
    <cite>— {{ producer.name }}, {{ producer.origin }}</cite>
  </blockquote>
  <a href="{{ producer.link }}" class="producer-link">Mehr erfahren</a>
</div>
```

#### 3.3 Harvest Season Timeline
**File**: `coffee-origins.njk` (using `originExperience.metrics.harvestSeasons`)

**Visualization**:
```html
<section class="harvest-timeline">
  <h2>Erntesaisons Weltweit</h2>
  <div class="timeline-track">
    {% for season in originExperience.metrics.harvestSeasons %}
    <div class="season-block" data-window="{{ season.window }}">
      <span class="season-label">{{ season.window }}</span>
      <span class="season-region">{{ season.region }}</span>
      <span class="season-notes">{{ season.notes }}</span>
    </div>
    {% endfor %}
  </div>
  <div class="timeline-progress" aria-hidden="true"></div>
</section>
```

**Animation**: Progress bar fills as user scrolls
```javascript
ScrollTrigger.create({
  trigger: '.harvest-timeline',
  start: 'top center',
  end: 'bottom center',
  scrub: 1,
  onUpdate: (self) => {
    document.querySelector('.timeline-progress').style.width =
      `${self.progress * 100}%`;
  }
});
```

---

### **PHASE 4: Data Visualizations** (Day 6)

#### 4.1 Update Data Structure
**File**: `src/data/mapOrigins.json`

**Add flavorScores** (0-10 scale):
```json
{
  "country": "Brazil",
  "displayName": "Brasilien",
  "flavorScores": {
    "acidity": 4,
    "body": 8,
    "sweetness": 9,
    "bitterness": 3,
    "fruitiness": 6
  }
}
```

#### 4.2 Chart.js Implementation
**File**: `src/scripts/coffee-viz.js`

**Lazy Loading**:
```javascript
const chartObserver = new IntersectionObserver((entries) => {
  entries.forEach(async (entry) => {
    if (entry.isIntersecting && !entry.target.dataset.loaded) {
      await loader.loadCharts();
      initChart(entry.target);
      entry.target.dataset.loaded = 'true';
      chartObserver.unobserve(entry.target);
    }
  });
}, { rootMargin: '200px' });

document.querySelectorAll('.chart-container').forEach(el => {
  chartObserver.observe(el);
});
```

**Radar Chart (Flavor Profile)**:
```javascript
function createFlavorRadar(origin) {
  const ctx = document.getElementById(`radar-${origin.country}`);

  new Chart(ctx, {
    type: 'radar',
    data: {
      labels: ['Säure', 'Körper', 'Süße', 'Bitterkeit', 'Fruchtigkeit'],
      datasets: [{
        label: origin.displayName,
        data: [
          origin.flavorScores.acidity,
          origin.flavorScores.body,
          origin.flavorScores.sweetness,
          origin.flavorScores.bitterness,
          origin.flavorScores.fruitiness
        ],
        backgroundColor: 'rgba(217, 117, 91, 0.2)',
        borderColor: '#D9755B',
        pointBackgroundColor: '#D9755B'
      }]
    },
    options: {
      scales: {
        r: {
          beginAtZero: true,
          max: 10,
          ticks: { stepSize: 2 }
        }
      },
      animation: {
        duration: 2000,
        easing: 'easeOutQuart'
      }
    }
  });
}
```

**Doughnut Chart (Processing Methods)**:
```javascript
// Calculate from actual coffee data
const processingCounts = coffees.reduce((acc, coffee) => {
  acc[coffee.processingMethod] = (acc[coffee.processingMethod] || 0) + 1;
  return acc;
}, {});

new Chart(ctx, {
  type: 'doughnut',
  data: {
    labels: Object.keys(processingCounts),
    datasets: [{
      data: Object.values(processingCounts),
      backgroundColor: ['#7e9c87', '#D9755B', '#C97A5C', '#e6dccf']
    }]
  },
  options: {
    plugins: {
      legend: { position: 'bottom' }
    }
  }
});
```

**Bar Chart (Altitude)**:
```javascript
new Chart(ctx, {
  type: 'bar',
  data: {
    labels: origins.map(o => o.displayName),
    datasets: [{
      label: 'Höhe (m)',
      data: origins.map(o => {
        // Parse "1.100–1.600 m" → average
        const match = o.elevation.match(/(\d+).*?(\d+)/);
        return match ? (parseInt(match[1]) + parseInt(match[2])) / 2 : 0;
      }),
      backgroundColor: '#D9755B'
    }]
  },
  options: {
    indexAxis: 'y', // Horizontal bars
    scales: {
      x: { beginAtZero: true }
    }
  }
});
```

**Mobile**: Simple bar charts only (radar too complex)
```javascript
if (breakpoint === 'mobile') {
  // Use bar chart instead of radar for flavor profile
  createFlavorBar(origin); // Simpler to read on small screen
} else {
  createFlavorRadar(origin);
}
```

#### 4.3 Error Handling
**Fallback for Chart Load Failure**:
```javascript
async function safeInitChart(container) {
  try {
    await loader.loadCharts();
    initChart(container);
  } catch (error) {
    console.error('Chart.js failed to load:', error);
    // Show static table as fallback
    showStaticDataTable(container);
  }
}

function showStaticDataTable(container) {
  container.innerHTML = `
    <table class="data-fallback">
      <tr>
        <th>Merkmal</th>
        <th>Wert</th>
      </tr>
      <!-- Static data rows -->
    </table>
  `;
}
```

---

### **PHASE 5: Advanced Features** (Day 7)

#### 5.1 3D Globe (Desktop Only)
**File**: `src/scripts/coffee-globe.js`

**UI**: Button to enable
```html
<button id="enable-3d-view" class="globe-toggle">
  <svg>...</svg>
  3D-Ansicht aktivieren
</button>

<div id="globe-container" style="display: none;">
  <canvas id="globe-canvas"></canvas>
</div>
```

**Dynamic Load**:
```javascript
document.getElementById('enable-3d-view').addEventListener('click', async () => {
  const btn = event.target;
  btn.disabled = true;
  btn.textContent = 'Wird geladen...';

  try {
    await loader.load3DGlobe();

    // Hide 2D map
    document.getElementById('coffee-map').style.display = 'none';

    // Show 3D globe
    const container = document.getElementById('globe-container');
    container.style.display = 'block';

    // Initialize
    const globe = new CoffeeGlobe3D(container, mapOrigins);

    btn.textContent = '2D-Ansicht aktivieren';
    btn.onclick = () => toggleTo2D();

  } catch (error) {
    console.error('3D Globe failed:', error);
    btn.textContent = '3D nicht verfügbar';
    alert('3D-Ansicht konnte nicht geladen werden. Bitte verwenden Sie die 2D-Karte.');
  }
});
```

**Implementation**:
```javascript
import ThreeGlobe from 'three-globe';
import * as THREE from 'three';

class CoffeeGlobe3D {
  constructor(container, data) {
    this.container = container;
    this.data = data;

    // Create globe
    this.globe = new ThreeGlobe()
      .globeImageUrl('//unpkg.com/three-globe/example/img/earth-night.jpg')
      .bumpImageUrl('//unpkg.com/three-globe/example/img/earth-topology.png')
      .pointsData(data.origins)
      .pointLat(d => d.coordinates[1])
      .pointLng(d => d.coordinates[0])
      .pointAltitude(0.05)
      .pointColor(() => '#D9755B')
      .pointRadius(0.3)
      .pointsMerge(true) // Performance: merge meshes
      .atmosphereColor('#7e9c87')
      .atmosphereAltitude(0.15)
      .onPointClick(point => this.onOriginClick(point));

    this.setupScene();
    this.setupLights();
    this.setupControls();
    this.animate();
    this.setupIntersectionObserver();
  }

  setupScene() {
    const canvas = this.container.querySelector('canvas');

    this.scene = new THREE.Scene();

    this.camera = new THREE.PerspectiveCamera(
      50,
      canvas.clientWidth / canvas.clientHeight,
      0.1,
      1000
    );
    this.camera.position.z = 300;

    this.renderer = new THREE.WebGLRenderer({
      canvas,
      antialias: true,
      alpha: true
    });
    this.renderer.setSize(canvas.clientWidth, canvas.clientHeight);
    this.renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));

    this.scene.add(this.globe);
  }

  setupLights() {
    const ambientLight = new THREE.AmbientLight(0xffffff, 0.6);
    this.scene.add(ambientLight);

    const directionalLight = new THREE.DirectionalLight(0xffffff, 0.6);
    directionalLight.position.set(1, 1, 1);
    this.scene.add(directionalLight);
  }

  setupControls() {
    // Auto-rotate
    this.controls = {
      autoRotate: true,
      rotationSpeed: 0.5
    };

    // Mouse interaction (future: OrbitControls)
  }

  animate() {
    if (!this.isVisible) return; // Pause when off-screen

    this.animationId = requestAnimationFrame(() => this.animate());

    if (this.controls.autoRotate) {
      this.globe.rotation.y += this.controls.rotationSpeed * 0.001;
    }

    this.renderer.render(this.scene, this.camera);
  }

  setupIntersectionObserver() {
    // Pause animation when off-screen
    const observer = new IntersectionObserver((entries) => {
      this.isVisible = entries[0].isIntersecting;
      if (this.isVisible) {
        this.animate();
      } else {
        cancelAnimationFrame(this.animationId);
      }
    });

    observer.observe(this.container);
  }

  flyToOrigin(countryCode) {
    const origin = this.data.origins.find(o => o.country === countryCode);
    if (!origin) return;

    // Animate camera to origin
    const [lng, lat] = origin.coordinates;
    const targetRotation = {
      y: -lng * Math.PI / 180,
      x: lat * Math.PI / 180
    };

    gsap.to(this.globe.rotation, {
      y: targetRotation.y,
      x: targetRotation.x,
      duration: 2,
      ease: 'power2.inOut'
    });
  }

  onOriginClick(point) {
    // Show origin details
    window.coffeeMap.showOriginDetails(point);
  }
}
```

**Performance Optimizations**:
- Low-poly sphere (32 segments, not 64)
- Merge point meshes
- Pause when off-screen (Intersection Observer)
- Max 2x pixel ratio (retina displays)
- Desktop-only feature

#### 5.2 Advanced GSAP Animations
**File**: `src/scripts/coffee-animations.js`

**Loading Sequence**:
```javascript
// Master timeline for page load
const masterTimeline = gsap.timeline({ delay: 0.3 });

// 1. Hero reveal
masterTimeline.from('.coffee-origins-hero', {
  clipPath: 'circle(0% at 50% 50%)',
  duration: 1.5,
  ease: 'expo.out'
});

// 2. Stats cascade
masterTimeline.from('.stat-card', {
  scale: 0,
  rotation: 720,
  stagger: 0.2,
  ease: 'back.out(1.7)',
  duration: 1
}, '-=1');

// 3. Map fade-in
masterTimeline.from('.map-container', {
  opacity: 0,
  y: 50,
  duration: 1,
  ease: 'power2.out'
}, '-=0.5');
```

**Scroll-Triggered Marker Animation**:
```javascript
ScrollTrigger.create({
  trigger: '.map-container',
  start: 'top 70%',
  onEnter: () => {
    gsap.from('.coffee-marker', {
      y: -200,
      opacity: 0,
      stagger: 0.1,
      ease: 'bounce.out',
      duration: 1.2
    });
  },
  once: true
});
```

**Connection Lines Draw Animation**:
```javascript
// Animate connection lines "drawing"
gsap.fromTo('.connection-lines-layer path',
  { strokeDashoffset: 1000 },
  {
    strokeDashoffset: 0,
    duration: 2,
    stagger: 0.2,
    ease: 'power2.inOut',
    scrollTrigger: {
      trigger: '.map-container',
      start: 'top 60%',
      once: true
    }
  }
);
```

**SVG Morphing (Processing Icons)**:
```javascript
// Coffee bean morphs between processing methods
const processingIcons = {
  washed: '#icon-washed-path',
  natural: '#icon-natural-path',
  honey: '#icon-honey-path'
};

function animateProcessingMethod(from, to) {
  gsap.to(processingIcons[from], {
    morphSVG: processingIcons[to],
    duration: 1,
    ease: 'power2.inOut'
  });
}
```

#### 5.3 Virtual Coffee Journey
**File**: `src/scripts/coffee-journey.js`

**Structure**:
```html
<section class="coffee-journey-narrative">
  <div class="journey-progress">
    <div class="progress-bar"></div>
  </div>

  <div class="journey-steps">
    <article class="journey-step" data-step="farm">
      <div class="step-visual">
        <!-- SVG illustration -->
        <svg>...</svg>
      </div>
      <div class="step-content">
        <h3>1. Anbau & Ernte</h3>
        <p>Handgepflückte Kirschen aus Höhenlagen...</p>
      </div>
    </article>

    <article class="journey-step" data-step="processing">
      <div class="step-visual">
        <svg>...</svg>
      </div>
      <div class="step-content">
        <h3>2. Aufbereitung</h3>
        <p>Washed, Natural oder Honey Process...</p>
      </div>
    </article>

    <!-- More steps: drying, milling, roasting, cupping, brewing -->
  </div>
</section>
```

**Desktop: Horizontal Scroll**:
```javascript
gsap.to('.journey-steps', {
  x: () => -(document.querySelector('.journey-steps').scrollWidth - window.innerWidth),
  ease: 'none',
  scrollTrigger: {
    trigger: '.coffee-journey-narrative',
    pin: true,
    scrub: 1,
    end: () => `+=${document.querySelector('.journey-steps').scrollWidth}`,
    onUpdate: (self) => {
      // Update progress bar
      document.querySelector('.progress-bar').style.width =
        `${self.progress * 100}%`;
    }
  }
});
```

**Mobile: Vertical Cards**:
```javascript
if (breakpoint === 'mobile') {
  // No horizontal scroll, just vertical stack
  document.querySelector('.journey-steps').classList.add('vertical');
}
```

**SVG Illustrations**:
- Inline SVG (not external files)
- Animated on scroll into view
- Simple, clean iconography

---

### **PHASE 6: Polish & Accessibility** (Day 8)

#### 6.1 Error Boundaries
**Wrap all async imports**:
```javascript
async function safeInit() {
  try {
    await loader.loadGSAP();
    initAnimations();
  } catch (error) {
    console.error('GSAP failed to load:', error);
    // Continue without animations
  }

  try {
    await loader.loadCharts();
    initCharts();
  } catch (error) {
    console.error('Charts failed to load:', error);
    showStaticFallback();
  }
}
```

**User-Friendly Messages**:
```javascript
function showErrorMessage(feature, error) {
  const toast = document.createElement('div');
  toast.className = 'error-toast';
  toast.textContent = `${feature} konnte nicht geladen werden. Die Seite funktioniert weiterhin.`;
  toast.setAttribute('role', 'alert');
  document.body.appendChild(toast);

  setTimeout(() => toast.remove(), 5000);
}
```

#### 6.2 Reduced Motion
**CSS**:
```css
@media (prefers-reduced-motion: reduce) {
  *,
  *::before,
  *::after {
    animation-duration: 0.01ms !important;
    animation-iteration-count: 1 !important;
    transition-duration: 0.01ms !important;
    scroll-behavior: auto !important;
  }

  /* But keep visual beauty */
  .glass-card {
    /* Still has glassmorphism */
    /* Just no floating animation */
  }

  .coffee-marker {
    /* Still has glow */
    /* Just no pulse */
  }
}
```

**JavaScript**:
```javascript
const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

if (prefersReducedMotion) {
  gsap.globalTimeline.timeScale(0); // Disable GSAP
  // Don't load 3D globe
  // Disable parallax
  // Show instant transitions instead
}
```

#### 6.3 Loading States
**Skeleton Screens for Charts**:
```html
<div class="chart-skeleton">
  <div class="skeleton-line"></div>
  <div class="skeleton-line"></div>
  <div class="skeleton-line"></div>
</div>
```

**Spinner for 3D Globe**:
```html
<div class="globe-loading">
  <div class="spinner"></div>
  <p>3D-Ansicht wird geladen...</p>
</div>
```

**Progressive Image Loading**:
```html
<img
  src="low-res.jpg"
  data-src="high-res.jpg"
  loading="lazy"
  class="progressive-image"
>
```

#### 6.4 Analytics
**File**: `src/scripts/coffee-analytics.js`

```javascript
const analytics = {
  track(event, data) {
    // Send to GA4, Plausible, or your analytics
    if (window.gtag) {
      gtag('event', event, data);
    }
    console.log('[Analytics]', event, data);
  }
};

// Track interactions
document.getElementById('enable-3d-view').addEventListener('click', () => {
  analytics.track('3d_globe_enabled', { source: 'button_click' });
});

// Track scroll depth
let maxScroll = 0;
window.addEventListener('scroll', debounce(() => {
  const scrollPercent = (window.scrollY / (document.body.scrollHeight - window.innerHeight)) * 100;
  if (scrollPercent > maxScroll) {
    maxScroll = Math.floor(scrollPercent / 25) * 25;
    analytics.track('scroll_depth', { percent: maxScroll });
  }
}, 500));

// Track tab switches
document.querySelectorAll('[role="tab"]').forEach(tab => {
  tab.addEventListener('click', () => {
    analytics.track('tab_switch', { tab: tab.dataset.tab });
  });
});

// Track origin interactions
window.coffeeMap.on('origin_selected', (origin) => {
  analytics.track('origin_selected', {
    country: origin.country,
    source: 'map_click'
  });
});
```

---

### **PHASE 7: Testing & Optimization** (Day 9)

#### 7.1 Performance Testing
**Lighthouse**:
```bash
# Test mobile
npx lighthouse https://hellerskaffees.com/coffee-origins/ \
  --only-categories=performance \
  --preset=mobile \
  --output=html \
  --output-path=./lighthouse-mobile.html

# Test desktop
npx lighthouse https://hellerskaffees.com/coffee-origins/ \
  --only-categories=performance \
  --preset=desktop \
  --output=html \
  --output-path=./lighthouse-desktop.html
```

**Targets**:
- Mobile Performance: 90+
- Desktop Performance: 95+
- FCP: < 1.5s
- LCP: < 2.5s
- TTI: < 3.5s

**Bundle Analysis**:
```bash
# Check bundle sizes
npm run build
du -sh dist/scripts/*.js

# Target: < 150KB initial load
```

**Optimizations**:
- Enable gzip/brotli compression
- Minify CSS/JS
- Optimize images (WebP format)
- Lazy load everything possible

#### 7.2 Cross-Browser Testing
**Browsers**:
- Chrome (latest)
- Firefox (latest)
- Safari (latest)
- Edge (latest)
- iOS Safari (14+)
- Android Chrome (latest)

**Features to Test**:
- 2D map interactions
- 3D globe (if supported)
- Animations (GSAP)
- Charts (Chart.js)
- Touch gestures
- Lazy loading

**Polyfills** (if needed):
```html
<!-- Intersection Observer for older browsers -->
<script src="https://polyfill.io/v3/polyfill.min.js?features=IntersectionObserver"></script>
```

#### 7.3 Device Testing
**Physical Devices**:
- iPhone 12/13/14 (iOS Safari)
- Samsung Galaxy S21/S22 (Android Chrome)
- iPad Pro (Safari)
- Desktop (1920x1080, 2560x1440)

**Emulators**:
- Chrome DevTools device emulation
- BrowserStack for real device testing

**Test Cases**:
- Map panning/zooming
- Marker interactions
- Bottom sheet (mobile)
- Tab navigation
- Story mode
- Charts rendering
- 3D globe (desktop)
- Performance (FPS, load time)

#### 7.4 Accessibility Audit
**Tools**:
- axe DevTools
- Lighthouse Accessibility
- NVDA (Windows)
- VoiceOver (Mac/iOS)

**Checklist**:
- [ ] Keyboard navigation works for all features
- [ ] Focus indicators visible
- [ ] ARIA labels on interactive elements
- [ ] Screen reader announces all content
- [ ] Color contrast meets WCAG AA
- [ ] Alternative text for images
- [ ] No keyboard traps
- [ ] Skip links work
- [ ] Reduced motion respected

**WCAG 2.1 AA Compliance**:
- Perceivable: Alternative text, color contrast
- Operable: Keyboard navigation, skip links
- Understandable: Clear labels, error messages
- Robust: Valid HTML, ARIA

---

## 📊 Success Metrics

### Performance Targets
| Metric | Mobile | Desktop |
|--------|--------|---------|
| FCP | < 1.5s | < 1.0s |
| LCP | < 2.5s | < 2.0s |
| TTI | < 3.5s | < 2.5s |
| Lighthouse | 90+ | 95+ |

### Bundle Size Targets
| Load Stage | Size | Notes |
|------------|------|-------|
| Initial | < 20KB | Core map only |
| + GSAP | +40KB | If user scrolls |
| + Charts | +60KB | If user reaches data |
| + 3D Globe | +120KB | If user clicks button |
| **Average** | **120KB** | 55% reduction vs initial plan |

### Engagement Targets
- **Time on Page**: > 2 minutes (vs < 1min baseline)
- **Scroll Depth**: 75%+ reach data section
- **Interaction Rate**: 40%+ click on markers
- **3D Globe Adoption**: 20%+ on desktop
- **Story Mode Usage**: 10%+ start tour

### Accessibility Targets
- **axe Violations**: 0
- **WCAG Compliance**: AA minimum
- **Keyboard Navigation**: 100% features accessible
- **Screen Reader**: All content announced

---

## 🎨 Design Specifications

### Color Palette
```css
:root {
  --bg: #f7f5f4;
  --surface: #ffffff;
  --text: #111d3d;
  --text-muted: #5c6785;
  --accent-beige: #e6dccf;
  --accent-terracotta: #c97a5c;
  --accent-sage: #7e9c87;
  --accent-ink: #0e1a3a;
}
```

### Typography
- **Headings**: p22-mackinac-pro (serif)
- **Body**: GTAmerica (sans-serif)
- **Scale**: Fluid type with clamp()

### Spacing
- **Base**: 8px grid
- **Sections**: 80px vertical spacing
- **Components**: 16px, 24px, 32px

### Border Radius
- **Cards**: 12px
- **Buttons**: 8px
- **Pills**: 50px

### Shadows
```css
--shadow-soft: 0 16px 34px rgba(14, 26, 58, 0.12);
--shadow-medium: 0 8px 16px rgba(14, 26, 58, 0.16);
--shadow-hard: 0 4px 8px rgba(14, 26, 58, 0.24);
```

---

## 🔒 Risk Mitigation

### Risk: CDN Failure
**Mitigation**:
- Fallback to local copies
- Error boundaries
- Graceful degradation

### Risk: 3D Globe Performance Issues
**Mitigation**:
- Desktop-only
- Lazy-loaded
- Low-poly mesh
- Pause when off-screen
- Optional feature (button to enable)

### Risk: Complex Animations Hurt Performance
**Mitigation**:
- Mobile-first approach
- Reduced motion support
- FPS monitoring
- Disable on low-end devices

### Risk: Too Much Complexity
**Mitigation**:
- Phased rollout
- Analytics to measure
- Feature flags
- Ability to disable

### Risk: Browser Compatibility
**Mitigation**:
- Progressive enhancement
- Polyfills for older browsers
- Fallback experiences
- Extensive testing

---

## 📦 Dependencies

### Initial Load (base.njk)
```html
<!-- Existing -->
<link rel="stylesheet" href="https://unpkg.com/maplibre-gl@4.7.1/dist/maplibre-gl.css">
<script src="https://unpkg.com/maplibre-gl@4.7.1/dist/maplibre-gl.js"></script>

<!-- NEW: Core utilities -->
<script src="/scripts/coffee-lazy-loader.js" defer></script>
<script src="/scripts/coffee-responsive.js" defer></script>
<script src="/scripts/coffee-map.js" defer></script>
```

### Lazy-Loaded (via coffee-lazy-loader.js)
```javascript
{
  gsap: 'https://cdnjs.cloudflare.com/ajax/libs/gsap/3.12.5/gsap.min.js',
  scrollTrigger: 'https://cdnjs.cloudflare.com/ajax/libs/gsap/3.12.5/ScrollTrigger.min.js',
  morphSVG: 'https://cdn.jsdelivr.net/npm/@gsap/shockingly@latest/dist/MorphSVGPlugin.min.js',
  three: 'https://unpkg.com/three@0.170.0/build/three.min.js',
  threeGlobe: 'https://unpkg.com/three-globe@2.45.0/dist/three-globe.min.js',
  chartJS: 'https://cdn.jsdelivr.net/npm/chart.js@4.4.1/dist/chart.umd.min.js'
}
```

### Version Lock
- **GSAP**: 3.12.5 (free since 2024)
- **Three.js**: 0.170.0
- **three-globe**: 2.45.0
- **Chart.js**: 4.4.1
- **MapLibre GL**: 4.7.1 (existing)

---

## 🚀 Deployment Checklist

### Pre-Deploy
- [ ] All phases completed
- [ ] Tests passing (Playwright)
- [ ] Lighthouse scores meet targets
- [ ] Cross-browser tested
- [ ] Accessibility audit passed
- [ ] Analytics configured
- [ ] Error handling tested
- [ ] Reduced motion tested

### Deploy
- [ ] Build production bundle
- [ ] Enable gzip/brotli compression
- [ ] Configure CDN caching
- [ ] Test on staging
- [ ] Deploy to production
- [ ] Monitor errors (Sentry, etc.)
- [ ] Check analytics data

### Post-Deploy
- [ ] Verify all features work
- [ ] Check performance metrics
- [ ] Monitor user behavior
- [ ] Gather feedback
- [ ] A/B test story mode
- [ ] Iterate based on data

---

## 📚 Resources & References

### Documentation
- [GSAP ScrollTrigger](https://gsap.com/docs/v3/Plugins/ScrollTrigger/)
- [three-globe](https://github.com/vasturiano/three-globe)
- [Chart.js](https://www.chartjs.org/docs/latest/)
- [MapLibre GL JS](https://maplibre.org/maplibre-gl-js/docs/)
- [Intersection Observer API](https://developer.mozilla.org/en-US/docs/Web/API/Intersection_Observer_API)

### Inspiration
- [Awwwards - Coffee Websites](https://www.awwwards.com/30-coffee-websites.html)
- [Blue Bottle Coffee](https://bluebottlecoffee.com/) - Clean design
- [La Colombe](https://www.lacolombe.com/) - Rich visuals
- [Ceremony Coffee](https://ceremonycoffee.com/) - Interactive elements

### Performance
- [Web.dev - Performance](https://web.dev/performance/)
- [Core Web Vitals](https://web.dev/vitals/)
- [Three.js Performance Tips](https://discoverthreejs.com/tips-and-tricks/)

---

## 🎯 Next Steps

Ready to start implementation! Choose one:

**A) Start with Phase 1** (Core Foundation - Days 1-2)
- Lazy loader system
- Responsive strategy
- Mobile-first hero
- Enhanced 2D map

**B) Prototype a Specific Feature** (1-2 hours)
- Story mode
- 3D globe
- Belt chapters
- Bottom sheet (mobile)

**C) Quick Win** (1 day)
- Just glassmorphism hero + enhanced markers
- Get immediate visual improvement
- Then iterate

**What's your preference?** 🚀
