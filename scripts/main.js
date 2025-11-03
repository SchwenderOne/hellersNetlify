(() => {
  const root = document.documentElement;

  // Mark JS availability for progressive enhancement hooks.
  root.classList.remove('no-js');
  root.classList.add('js');

  // Cache media query results for reduced motion preference.
  const reducedMotionQuery = window.matchMedia('(prefers-reduced-motion: reduce)');

  const setMotionDataset = (event) => {
    const isReduced = event?.matches ?? reducedMotionQuery.matches;
    root.dataset.reducedMotion = isReduced ? 'true' : 'false';
  };

  setMotionDataset(reducedMotionQuery);
  reducedMotionQuery.addEventListener('change', setMotionDataset);

  // Namespaces for future enhancements (parallax, observers, theme toggles).
  window.hellers = window.hellers || {};
  window.hellers.env = {
    hasReducedMotion: () => root.dataset.reducedMotion === 'true',
  };

  // Parallax effect for hero image (Phase 2)
  const initParallax = () => {
    const heroImageContainer = document.querySelector('.card-hero .image-container');
    if (!heroImageContainer || window.hellers.env.hasReducedMotion()) {
      return;
    }

    const heroImage = heroImageContainer.querySelector('img');
    if (!heroImage) {
      return;
    }

    let ticking = false;
    const parallaxSpeed = 0.3; // Subtle effect

    const updateParallax = () => {
      if (window.hellers.env.hasReducedMotion()) {
        heroImage.style.transform = 'none';
        return;
      }

      const rect = heroImageContainer.getBoundingClientRect();
      const scrollY = window.scrollY || window.pageYOffset;
      const elementTop = rect.top + scrollY;
      const windowHeight = window.innerHeight;
      
      // Only apply parallax when hero is in viewport
      if (rect.bottom > 0 && rect.top < windowHeight) {
        const scrolled = scrollY - (elementTop - windowHeight);
        const parallaxOffset = scrolled * parallaxSpeed;
        
        // Limit parallax to prevent excessive movement
        const maxOffset = 100;
        const clampedOffset = Math.max(-maxOffset, Math.min(maxOffset, parallaxOffset));
        
        heroImage.style.transform = `translate3d(0, ${clampedOffset}px, 0)`;
      }
      
      ticking = false;
    };

    const requestTick = () => {
      if (!ticking) {
        requestAnimationFrame(updateParallax);
        ticking = true;
      }
    };

    // Disable parallax on mobile for performance
    const isMobile = window.matchMedia('(max-width: 768px)').matches;
    if (!isMobile) {
      window.addEventListener('scroll', requestTick, { passive: true });
      updateParallax(); // Initial call
    }
  };

  // Smooth scroll for CTA button (Phase 2)
  const initHeroCTA = () => {
    const ctaButton = document.querySelector('.hero-cta-button');
    if (!ctaButton) {
      return;
    }

    ctaButton.addEventListener('click', (e) => {
      e.preventDefault();
      const targetId = ctaButton.getAttribute('href');
      
      if (targetId && targetId.startsWith('#')) {
        const targetElement = document.querySelector(targetId);
        if (targetElement) {
          const headerOffset = 20;
          const elementPosition = targetElement.getBoundingClientRect().top;
          const offsetPosition = elementPosition + window.pageYOffset - headerOffset;

          window.scrollTo({
            top: offsetPosition,
            behavior: 'smooth',
          });
        }
      }
    });
  };

  // Initialize on DOM ready
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', () => {
      initParallax();
      initHeroCTA();
    });
  } else {
    initParallax();
    initHeroCTA();
  }
})();

