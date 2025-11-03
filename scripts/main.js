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
    const heroCard = document.querySelector('.card-hero');
    const heroImageContainer = document.querySelector('.card-hero .image-container');
    if (!heroCard || !heroImageContainer || window.hellers.env.hasReducedMotion()) {
      return;
    }

    const heroImage = heroImageContainer.querySelector('img');
    if (!heroImage) {
      return;
    }

    let ticking = false;
    const parallaxSpeed = 0.15; // More subtle effect to prevent layout issues
    
    // Store initial values - will be set after page load
    let heroCardOffsetTop = null;
    let isInitialized = false;
    
    // Ensure image starts with no transform
    heroImage.style.transform = '';
    
    const updateParallax = () => {
      if (window.hellers.env.hasReducedMotion()) {
        heroImage.style.transform = '';
        return;
      }

      // Wait for initialization before applying parallax
      if (!isInitialized || heroCardOffsetTop === null) {
        return;
      }

      const rect = heroCard.getBoundingClientRect();
      const scrollY = window.scrollY || window.pageYOffset;
      const windowHeight = window.innerHeight;
      
      // Only apply parallax when hero is in or near viewport
      if (rect.bottom > 0 && rect.top < windowHeight * 1.5) {
        // Calculate scroll progress from initial position
        const scrollProgress = Math.max(0, scrollY - heroCardOffsetTop);
        const parallaxOffset = scrollProgress * parallaxSpeed;
        
        // Limit parallax to prevent excessive movement
        const maxOffset = 50;
        const clampedOffset = Math.min(maxOffset, Math.max(0, parallaxOffset));
        
        if (clampedOffset > 0) {
          heroImage.style.transform = `translate3d(0, ${clampedOffset}px, 0)`;
        } else {
          // Reset to no transform when at top
          heroImage.style.transform = '';
        }
      } else {
        // Reset transform when scrolled past
        heroImage.style.transform = '';
      }
      
      ticking = false;
    };

    const requestTick = () => {
      if (!ticking) {
        requestAnimationFrame(updateParallax);
        ticking = true;
      }
    };

    // Initialize hero card position
    const initPosition = () => {
      const rect = heroCard.getBoundingClientRect();
      heroCardOffsetTop = rect.top + (window.scrollY || window.pageYOffset);
      isInitialized = true;
      // Reset transform on initialization
      heroImage.style.transform = '';
    };

    // Disable parallax on mobile for performance
    const isMobile = window.matchMedia('(max-width: 768px)').matches;
    if (!isMobile) {
      // Initialize after page is fully loaded and layout is stable
      const initializeParallax = () => {
        // Use requestAnimationFrame to ensure layout is calculated
        requestAnimationFrame(() => {
          requestAnimationFrame(() => {
            initPosition();
            updateParallax();
          });
        });
      };
      
      // Wait for images to load before calculating position
      if (heroImage.complete && document.readyState === 'complete') {
        initializeParallax();
      } else {
        if (!heroImage.complete) {
          heroImage.addEventListener('load', initializeParallax, { once: true });
        }
        if (document.readyState !== 'complete') {
          window.addEventListener('load', initializeParallax, { once: true });
        }
        // Fallback: initialize after a delay if load event doesn't fire
        setTimeout(initializeParallax, 500);
      }
      
      window.addEventListener('scroll', requestTick, { passive: true });
      window.addEventListener('resize', () => {
        if (isInitialized) {
          initPosition();
          updateParallax();
        }
      }, { passive: true });
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

