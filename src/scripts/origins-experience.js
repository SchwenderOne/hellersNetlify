// Kaffee Origins Experience interactions
(function() {
  document.addEventListener('DOMContentLoaded', () => {
    const experienceDataEl = document.getElementById('origin-experience-data');
    if (!experienceDataEl) return;

    let experienceData = {};
    try {
      experienceData = JSON.parse(experienceDataEl.textContent);
    } catch (error) {
      console.warn('Origin data could not be parsed', error);
    }

    const originMeta = experienceData.origins || [];
    initHeroCounters();
    initScrollButtons();
    initChapters();
    initAtlas(originMeta);
  });

  function initHeroCounters() {
    const stats = document.querySelectorAll('[data-count-to]');
    if (!stats.length) return;

    const observer = new IntersectionObserver(entries => {
      entries.forEach(entry => {
        if (!entry.isIntersecting) return;
        const el = entry.target;
        const target = Number(el.getAttribute('data-count-to')) || 0;
        const valueEl = el.querySelector('.stat-value');
        if (!valueEl || valueEl.dataset.animated) return;
        valueEl.dataset.animated = 'true';
        animateCount(valueEl, target, 1200);
        observer.unobserve(el);
      });
    }, { threshold: 0.4 });

    stats.forEach(stat => observer.observe(stat));
  }

  function animateCount(node, target, duration) {
    const start = performance.now();
    const step = (ts) => {
      const progress = Math.min(1, (ts - start) / duration);
      node.textContent = Math.round(progress * target);
      if (progress < 1) {
        requestAnimationFrame(step);
      }
    };
    requestAnimationFrame(step);
  }

  function initScrollButtons() {
    document.querySelectorAll('[data-scroll-target]').forEach(btn => {
      const target = btn.getAttribute('data-scroll-target');
      btn.addEventListener('click', () => {
        const targetEl = document.querySelector(target);
        if (targetEl) {
          targetEl.scrollIntoView({ behavior: 'smooth' });
        }
      });
    });
  }

  function initChapters() {
    const chapters = document.querySelectorAll('.origin-chapter');
    if (!chapters.length) return;

    const activeLabel = document.querySelector('[data-active-chapter]');
    const indicatorMap = new Map();
    document.querySelectorAll('[data-indicator]').forEach(dot => {
      indicatorMap.set(dot.dataset.indicator, dot);
    });

    const observer = new IntersectionObserver(entries => {
      entries.forEach(entry => {
        if (entry.intersectionRatio >= 0.5) {
          chapters.forEach(chapter => chapter.classList.toggle('is-active', chapter === entry.target));
          const chapterId = entry.target.dataset.chapter;
          if (activeLabel) {
            const heading = entry.target.querySelector('h3');
            activeLabel.textContent = heading ? heading.textContent : chapterId;
          }
          indicatorMap.forEach(dot => dot.classList.toggle('is-active', dot.dataset.indicator === chapterId));
        }
      });
    }, {
      threshold: [0.5, 0.75]
    });

    chapters.forEach(chapter => observer.observe(chapter));
  }

  function initAtlas(originMeta) {
    const atlasCards = Array.from(document.querySelectorAll('[data-origin-card]'));
    const globeContainer = document.getElementById('origins-globe');
    if (!atlasCards.length || !globeContainer) return;

    let globeInstance = null;
    if (typeof Globe === 'function') {
      try {
        globeInstance = Globe()(globeContainer)
          .globeImageUrl('//unpkg.com/three-globe/example/img/earth-dark.jpg')
          .bumpImageUrl('//unpkg.com/three-globe/example/img/earth-topology.png')
          .backgroundColor('rgba(0,0,0,0)')
          .pointRadius(0.4)
          .pointAltitude(0.05)
          .pointColor(() => '#D9755B')
          .pointsData(originMeta.map(origin => ({
            lat: origin.lat,
            lng: origin.lng,
            label: origin.displayName,
            country: origin.country
          })));

        const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
        globeInstance.controls().autoRotate = !reduceMotion;
        globeInstance.controls().autoRotateSpeed = 0.6;

        globeInstance.onPointHover(point => setActiveCard(point?.country, atlasCards, globeInstance, originMeta));
        globeInstance.onPointClick(point => setActiveCard(point?.country, atlasCards, globeInstance, originMeta));
        globeContainer.parentElement.classList.add('globe-ready');
      } catch (error) {
        console.warn('Globe could not be initialised', error);
        globeInstance = null;
      }
    }

    atlasCards.forEach(card => {
      card.addEventListener('mouseenter', () => setActiveCard(card.dataset.originCard, atlasCards, globeInstance, originMeta));
      card.addEventListener('focus', () => setActiveCard(card.dataset.originCard, atlasCards, globeInstance, originMeta));
    });

    const resetBtn = document.querySelector('[data-reset-atlas]');
    if (resetBtn) {
      resetBtn.addEventListener('click', () => {
        const first = atlasCards[0];
        if (first) {
          setActiveCard(first.dataset.originCard, atlasCards, globeInstance, originMeta);
          if (globeInstance && typeof globeInstance.pointOfView === 'function') {
            globeInstance.pointOfView({ lat: 0, lng: 0, altitude: 2 }, 800);
          }
        }
      });
    }

    if (atlasCards[0]) {
      setActiveCard(atlasCards[0].dataset.originCard, atlasCards, globeInstance, originMeta);
    }
  }

  function setActiveCard(country, cards, globeInstance, originMeta) {
    if (!country) return;
    cards.forEach(card => {
      card.classList.toggle('is-active', card.dataset.originCard === country);
    });

    if (globeInstance && typeof globeInstance.pointOfView === 'function') {
      const match = originMeta.find(origin => origin.country === country);
      if (match) {
        globeInstance.pointOfView({ lat: match.lat, lng: match.lng, altitude: 1.5 }, 1000);
      }
    }
  }
})();
