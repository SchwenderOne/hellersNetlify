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
      const targetId = ctaButton.getAttribute('href');
      
      // Only handle anchor links (starting with #) for smooth scrolling
      // For external/page links, allow default navigation
      if (targetId && targetId.startsWith('#')) {
        e.preventDefault();
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
      // For non-anchor links (like menu.html), allow default navigation
    });
  };

  // Scroll-triggered animations using Intersection Observer (Phase 7)
  const initScrollAnimations = () => {
    if (window.hellers.env.hasReducedMotion()) {
      return;
    }

    // Check if Intersection Observer is supported
    if (!('IntersectionObserver' in window)) {
      return;
    }

    // Animate parent sections and individual items
    const animatedElements = document.querySelectorAll(
      '.storytelling-section, .visit-section, .infographic-item, .timeline-item, .event-card'
    );

    if (animatedElements.length === 0) {
      return;
    }

    const observerOptions = {
      root: null,
      rootMargin: '0px 0px -50px 0px',
      threshold: 0.1,
    };

    const observer = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting && !entry.target.classList.contains('is-visible')) {
          entry.target.classList.add('is-visible');
          // Optionally unobserve after animation to improve performance
          observer.unobserve(entry.target);
        }
      });
    }, observerOptions);

    animatedElements.forEach((element) => {
      element.classList.add('scroll-animate');
      observer.observe(element);
    });
  };

  // Progress indicator for recipe pages (Phase 7)
  const initProgressIndicator = () => {
    const guidePage = document.querySelector('.brew-guide-page');
    if (!guidePage || window.hellers.env.hasReducedMotion()) {
      return;
    }

    // Create progress bar element
    const progressBar = document.createElement('div');
    progressBar.className = 'progress-indicator';
    progressBar.setAttribute('role', 'progressbar');
    progressBar.setAttribute('aria-label', 'Lese-Fortschritt');
    progressBar.setAttribute('aria-valuemin', '0');
    progressBar.setAttribute('aria-valuemax', '100');
    progressBar.setAttribute('aria-valuenow', '0');
    document.body.appendChild(progressBar);

    const updateProgress = () => {
      const windowHeight = window.innerHeight;
      const documentHeight = document.documentElement.scrollHeight - windowHeight;
      const scrollTop = window.pageYOffset || document.documentElement.scrollTop;
      const scrollProgress = Math.min(100, Math.round((scrollTop / documentHeight) * 100));
      
      progressBar.style.width = `${scrollProgress}%`;
      progressBar.setAttribute('aria-valuenow', scrollProgress);
    };

    // Throttle scroll events
    let ticking = false;
    const requestTick = () => {
      if (!ticking) {
        requestAnimationFrame(() => {
          updateProgress();
          ticking = false;
        });
        ticking = true;
      }
    };

    window.addEventListener('scroll', requestTick, { passive: true });
    updateProgress(); // Initial calculation
  };

  // Dark Mode Toggle (Phase 8) - Enhanced with System Preference Detection (Phase 2)
  const initDarkMode = () => {
    const root = document.documentElement;
    const toggleButton = document.createElement('button');
    toggleButton.className = 'dark-mode-toggle';
    toggleButton.setAttribute('aria-label', 'Dunkelmodus umschalten');
    toggleButton.setAttribute('aria-pressed', 'false');
    // Function to update icon based on theme
    // Show what mode you'll switch TO, not current mode
    const updateIcon = (isDark) => {
      if (isDark) {
        // Currently in dark mode, so show sun icon to switch TO light
        toggleButton.innerHTML = `
          <svg class="dark-mode-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
            <circle cx="12" cy="12" r="5"/>
            <line x1="12" y1="1" x2="12" y2="3"/>
            <line x1="12" y1="21" x2="12" y2="23"/>
            <line x1="4.22" y1="4.22" x2="5.64" y2="5.64"/>
            <line x1="18.36" y1="18.36" x2="19.78" y2="19.78"/>
            <line x1="1" y1="12" x2="3" y2="12"/>
            <line x1="21" y1="12" x2="23" y2="12"/>
            <line x1="4.22" y1="19.78" x2="5.64" y2="18.36"/>
            <line x1="18.36" y1="5.64" x2="19.78" y2="4.22"/>
          </svg>
          <span class="dark-mode-label">Hell</span>
        `;
      } else {
        // Currently in light mode, so show moon icon to switch TO dark
        toggleButton.innerHTML = `
          <svg class="dark-mode-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
            <path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z"/>
          </svg>
          <span class="dark-mode-label">Dunkel</span>
        `;
      }
    };

    // Check system preference
    const getSystemPreference = () => {
      if (window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches) {
        return 'dark';
      }
      return 'light';
    };

    // Get saved preference, or fall back to system preference, or default to light
    const getSavedTheme = () => {
      try {
        const saved = localStorage.getItem('hellers-theme');
        // If user has explicitly set a preference, use it
        if (saved === 'light' || saved === 'dark') {
          return saved;
        }
        // Otherwise, respect system preference on first visit
        return getSystemPreference();
      } catch (e) {
        // Fallback to system preference if localStorage is unavailable
        return getSystemPreference();
      }
    };

    const setTheme = (theme) => {
      root.dataset.theme = theme;
      toggleButton.setAttribute('aria-pressed', theme === 'dark' ? 'true' : 'false');
      updateIcon(theme === 'dark');
      try {
        localStorage.setItem('hellers-theme', theme);
      } catch (e) {
        // Ignore localStorage errors (private browsing, etc.)
      }
    };

    const toggleTheme = () => {
      const currentTheme = root.dataset.theme || getSavedTheme();
      const newTheme = currentTheme === 'dark' ? 'light' : 'dark';
      setTheme(newTheme);
    };

    // Initialize theme from saved preference or system preference
    const initialTheme = getSavedTheme();
    setTheme(initialTheme);

    // Listen for system preference changes (if user hasn't set a manual preference)
    const colorSchemeQuery = window.matchMedia('(prefers-color-scheme: dark)');
    colorSchemeQuery.addEventListener('change', (e) => {
      try {
        const saved = localStorage.getItem('hellers-theme');
        // Only auto-update if user hasn't manually set a preference
        // We check if the saved value is actually 'light' or 'dark' (not just system default)
        if (!saved || saved === 'light' || saved === 'dark') {
          // User has set a preference, don't auto-update
          return;
        }
        // User hasn't set a preference, update based on system change
        const newTheme = e.matches ? 'dark' : 'light';
        setTheme(newTheme);
      } catch (error) {
        // If localStorage check fails, still update based on system
        const newTheme = e.matches ? 'dark' : 'light';
        setTheme(newTheme);
      }
    });

    // Old FAB toggle removed - using header toggle instead
    // Only create footer toggle if header toggle doesn't exist
    const headerToggle = document.getElementById('header-dark-mode-toggle');
    const darkModeLabel = document.getElementById('dark-mode-label');
    
    if (!headerToggle) {
      // Fallback: create footer toggle if header doesn't exist
      toggleButton.addEventListener('click', toggleTheme);
      document.body.appendChild(toggleButton);
    }
    
    if (headerToggle) {
      const headerIcon = document.getElementById('dark-mode-icon');
      const updateHeaderIcon = (isDark) => {
        if (darkModeLabel) {
          darkModeLabel.textContent = isDark ? 'Hell' : 'Dunkel';
        }
        if (headerIcon) {
          // Show what mode you'll switch TO, not current mode
          if (isDark) {
            // Currently in dark mode, so show sun icon to switch TO light
            headerIcon.innerHTML = `
              <circle cx="12" cy="12" r="4" stroke="currentColor" stroke-width="2" fill="none" stroke-linecap="round" stroke-linejoin="round"/>
              <line x1="12" y1="1" x2="12" y2="3" stroke="currentColor" stroke-width="2" stroke-linecap="round"/>
              <line x1="12" y1="21" x2="12" y2="23" stroke="currentColor" stroke-width="2" stroke-linecap="round"/>
              <line x1="4.22" y1="4.22" x2="5.64" y2="5.64" stroke="currentColor" stroke-width="2" stroke-linecap="round"/>
              <line x1="18.36" y1="18.36" x2="19.78" y2="19.78" stroke="currentColor" stroke-width="2" stroke-linecap="round"/>
              <line x1="1" y1="12" x2="3" y2="12" stroke="currentColor" stroke-width="2" stroke-linecap="round"/>
              <line x1="21" y1="12" x2="23" y2="12" stroke="currentColor" stroke-width="2" stroke-linecap="round"/>
              <line x1="4.22" y1="19.78" x2="5.64" y2="18.36" stroke="currentColor" stroke-width="2" stroke-linecap="round"/>
              <line x1="18.36" y1="5.64" x2="19.78" y2="4.22" stroke="currentColor" stroke-width="2" stroke-linecap="round"/>
            `;
          } else {
            // Currently in light mode, so show moon icon to switch TO dark
            headerIcon.innerHTML = `
              <path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z" stroke="currentColor" stroke-width="2" fill="none" stroke-linecap="round" stroke-linejoin="round"/>
            `;
          }
        }
      };
      
      // Update header icon on theme change
      const observer = new MutationObserver(() => {
        const currentTheme = root.dataset.theme || 'light';
        updateHeaderIcon(currentTheme === 'dark');
      });
      observer.observe(root, { attributes: true, attributeFilter: ['data-theme'] });
      
      // Initial update
      updateHeaderIcon(initialTheme === 'dark');
      
      headerToggle.addEventListener('click', toggleTheme);
    }
  };

  // Header Navigation (Phase 5)
  const initHeaderNavigation = () => {
    const header = document.getElementById('site-header');
    const mobileToggle = document.getElementById('mobile-menu-toggle');
    const navigation = document.getElementById('main-navigation');
    const overlay = document.getElementById('mobile-menu-overlay');
    
    if (!header) return;

    // Scroll detection for header shadow
    const handleScroll = () => {
      const currentScroll = window.pageYOffset || document.documentElement.scrollTop;
      if (currentScroll > 20) {
        header.classList.add('is-scrolled');
      } else {
        header.classList.remove('is-scrolled');
      }
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    handleScroll(); // Initial check

    // Mobile menu toggle
    if (mobileToggle && navigation && overlay) {
      const openMenu = () => {
        navigation.classList.add('is-open');
        overlay.classList.add('is-visible');
        mobileToggle.setAttribute('aria-expanded', 'true');
        document.body.style.overflow = 'hidden';
      };

      const closeMenu = () => {
        navigation.classList.remove('is-open');
        overlay.classList.remove('is-visible');
        mobileToggle.setAttribute('aria-expanded', 'false');
        document.body.style.overflow = '';
      };

      mobileToggle.addEventListener('click', () => {
        if (navigation.classList.contains('is-open')) {
          closeMenu();
        } else {
          openMenu();
        }
      });

      overlay.addEventListener('click', closeMenu);

      // Close menu when clicking a nav link
      const navLinks = navigation.querySelectorAll('.nav-link');
      navLinks.forEach(link => {
        link.addEventListener('click', () => {
          closeMenu();
        });
      });

      // Close menu on ESC key
      document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape' && navigation.classList.contains('is-open')) {
          closeMenu();
        }
      });
    }

    // Active link detection
    const updateActiveLink = () => {
      const navLinks = navigation?.querySelectorAll('.nav-link');
      if (!navLinks) return;

      const currentPath = window.location.pathname;
      const currentHash = window.location.hash;

      navLinks.forEach(link => {
        link.classList.remove('active');
        try {
          // Use link.href which is always absolute, or construct URL with current origin
          const linkUrl = link.href ? new URL(link.href, window.location.origin) : null;
          if (!linkUrl) return;
          
          const linkPath = linkUrl.pathname;
          const linkHash = linkUrl.hash;

          // Check if link matches current page
          if (linkPath === currentPath || (linkPath.endsWith('index.html') && (currentPath.endsWith('/') || currentPath.endsWith('index.html')))) {
            // For anchor links, check if hash matches
            if (linkHash && currentHash === linkHash) {
              link.classList.add('active');
            } else if (!linkHash && !currentHash) {
              link.classList.add('active');
            }
          }
        } catch (e) {
          // If URL parsing fails, skip this link
          console.warn('Failed to parse link URL:', link.href, e);
        }
      });
    };

    updateActiveLink();
    window.addEventListener('hashchange', updateActiveLink);

    // Smooth scroll for anchor links in navigation
    const navLinks = navigation?.querySelectorAll('.nav-link[href*="#"]');
    if (navLinks) {
      navLinks.forEach(link => {
        link.addEventListener('click', (e) => {
          const href = link.getAttribute('href');
          const hashIndex = href.indexOf('#');
          if (hashIndex !== -1) {
            const targetId = href.substring(hashIndex + 1);
            const targetElement = document.getElementById(targetId);
            
            if (targetElement) {
              e.preventDefault();
              const headerOffset = 80; // Account for sticky header
              const elementPosition = targetElement.getBoundingClientRect().top;
              const offsetPosition = elementPosition + window.pageYOffset - headerOffset;

              window.scrollTo({
                top: offsetPosition,
                behavior: 'smooth',
              });
              
              // Update URL
              history.pushState(null, null, '#' + targetId);
            }
          }
        });
      });
    }
  };

  // Recipe Calculator Widget (Phase 1)
  const initRecipeCalculator = () => {
    const calculators = document.querySelectorAll('.recipe-calculator');
    if (calculators.length === 0) {
      return;
    }

    calculators.forEach((calculator) => {
      const ratio = parseFloat(calculator.dataset.ratio) || 14;
      const defaultServings = parseFloat(calculator.dataset.servings) || 2;
      
      const servingsInput = calculator.querySelector('input[type="number"]');
      const unitSelect = calculator.querySelector('select');
      const coffeeResult = calculator.querySelector('#calc-coffee');
      const waterResult = calculator.querySelector('#calc-water');

      if (!servingsInput || !unitSelect || !coffeeResult || !waterResult) {
        return;
      }

      // Parse base amounts from the recipe page or use defaults
      // For French Press: 35g coffee, 500ml water = 2 servings
      const baseCoffee = 35; // grams (default, will be overridden by data attributes if present)
      const baseWater = 500; // ml (default)
      
      // Calculate base per serving
      const baseCoffeePerServing = baseCoffee / defaultServings;
      const baseWaterPerServing = baseWater / defaultServings;

      const calculate = () => {
        const servings = parseFloat(servingsInput.value) || 1;
        const isMetric = unitSelect.value === 'metric';

        // Calculate amounts based on servings
        const coffeeGrams = Math.round(baseCoffeePerServing * servings);
        const waterMl = Math.round(baseWaterPerServing * servings);

        // Convert to tablespoons (approximately 6g per tablespoon)
        const coffeeTbsp = Math.round((coffeeGrams / 6) * 10) / 10;

        // Format results
        if (isMetric) {
          // Metric: grams and milliliters
          const coffeeText = `${coffeeGrams}g`;
          const coffeeTextWithTbsp = coffeeTbsp > 0 ? `${coffeeText} / ${coffeeTbsp.toFixed(1)} EL` : coffeeText;
          coffeeResult.textContent = coffeeTextWithTbsp;

          const waterText = `${waterMl}ml`;
          const cups = Math.round((waterMl / 250) * 10) / 10;
          const waterTextWithCups = cups > 0 ? `${waterText} / ${cups} ${cups === 1 ? 'Tasse' : 'Tassen'}` : waterText;
          waterResult.textContent = waterTextWithCups;
        } else {
          // Imperial: ounces
          const coffeeOz = Math.round((coffeeGrams / 28.35) * 10) / 10;
          coffeeResult.textContent = `${coffeeOz} oz`;

          const waterOz = Math.round((waterMl / 29.57) * 10) / 10;
          waterResult.textContent = `${waterOz} oz`;
        }
      };

      // Update on input change
      servingsInput.addEventListener('input', calculate);
      servingsInput.addEventListener('change', calculate);
      unitSelect.addEventListener('change', calculate);

      // Initial calculation
      calculate();
    });
  };

  // Event Registration Modal (Phase 1)
  const initEventModal = () => {
    const modal = document.getElementById('event-registration-modal');
    if (!modal) {
      return;
    }

    const modalClose = modal.querySelector('.modal-close');
    const modalCancel = modal.querySelector('.modal-cancel');
    const form = document.getElementById('event-registration-form');
    const eventButtons = document.querySelectorAll('.event-button[data-event-name]');
    const eventNameInput = document.getElementById('modal-event-name');
    const modalTitle = document.getElementById('modal-title');
    const formMessage = document.getElementById('form-message');

    let previousFocus = null;

    const openModal = (eventName, eventDate) => {
      previousFocus = document.activeElement;
      modal.setAttribute('aria-hidden', 'false');
      modal.classList.add('is-open');
      document.body.style.overflow = 'hidden'; // Prevent body scroll

      // Set event information
      if (eventNameInput) {
        eventNameInput.value = eventName || '';
      }
      if (modalTitle && eventName) {
        modalTitle.textContent = `${eventName} anmelden`;
      }

      // Focus first input
      const firstInput = form?.querySelector('input[type="text"]');
      if (firstInput) {
        setTimeout(() => firstInput.focus(), 100);
      }

      // Trap focus inside modal
      trapFocus(modal);
    };

    const closeModal = () => {
      modal.setAttribute('aria-hidden', 'true');
      modal.classList.remove('is-open');
      document.body.style.overflow = ''; // Restore body scroll

      // Reset form
      if (form) {
        form.reset();
      }
      if (formMessage) {
        formMessage.classList.remove('is-visible', 'success', 'error');
        formMessage.textContent = '';
      }

      // Return focus to previous element
      if (previousFocus) {
        previousFocus.focus();
      }
    };

    // Focus trap function
    const trapFocus = (container) => {
      const focusableElements = container.querySelectorAll(
        'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])'
      );
      const firstElement = focusableElements[0];
      const lastElement = focusableElements[focusableElements.length - 1];

      const handleTabKey = (e) => {
        if (e.key !== 'Tab') return;

        if (e.shiftKey) {
          if (document.activeElement === firstElement) {
            e.preventDefault();
            lastElement.focus();
          }
        } else {
          if (document.activeElement === lastElement) {
            e.preventDefault();
            firstElement.focus();
          }
        }
      };

      container.addEventListener('keydown', handleTabKey);

      // Clean up on modal close
      const observer = new MutationObserver((mutations) => {
        if (modal.classList.contains('is-open')) return;
        container.removeEventListener('keydown', handleTabKey);
        observer.disconnect();
      });
      observer.observe(modal, { attributes: true, attributeFilter: ['class'] });
    };

    // Open modal on button click
    eventButtons.forEach((button) => {
      button.addEventListener('click', (e) => {
        e.preventDefault();
        const eventName = button.dataset.eventName;
        const eventDate = button.dataset.eventDate || '';
        openModal(eventName, eventDate);
      });
    });

    // Close modal handlers
    if (modalClose) {
      modalClose.addEventListener('click', closeModal);
    }

    if (modalCancel) {
      modalCancel.addEventListener('click', closeModal);
    }

    // Close on overlay click
    modal.addEventListener('click', (e) => {
      if (e.target === modal) {
        closeModal();
      }
    });

    // Close on ESC key
    document.addEventListener('keydown', (e) => {
      if (e.key === 'Escape' && modal.classList.contains('is-open')) {
        closeModal();
      }
    });

    // Handle form submission
    if (form) {
      form.addEventListener('submit', (e) => {
        e.preventDefault();

        // Get form data
        const formData = new FormData(form);
        const name = formData.get('name');
        const email = formData.get('email');
        const phone = formData.get('phone');
        const message = formData.get('message');
        const newsletter = formData.get('newsletter');

        // Basic validation
        if (!name || !email) {
          if (formMessage) {
            formMessage.textContent = 'Bitte füllen Sie alle Pflichtfelder aus.';
            formMessage.className = 'form-message is-visible error';
          }
          return;
        }

        // Email validation
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(email)) {
          if (formMessage) {
            formMessage.textContent = 'Bitte geben Sie eine gültige E-Mail-Adresse ein.';
            formMessage.className = 'form-message is-visible error';
          }
          return;
        }

        // Simulate form submission (replace with actual API call later)
        // For now, just show success message
        if (formMessage) {
          formMessage.textContent = `Vielen Dank, ${name}! Ihre Anmeldung wurde erfolgreich übermittelt. Wir melden uns in Kürze bei Ihnen.`;
          formMessage.className = 'form-message is-visible success';
        }

        // Scroll to message
        formMessage.scrollIntoView({ behavior: 'smooth', block: 'nearest' });

        // Optional: Send data to backend
        // fetch('/api/events/register', {
        //   method: 'POST',
        //   headers: { 'Content-Type': 'application/json' },
        //   body: JSON.stringify({
        //     event: formData.get('event-name'),
        //     name,
        //     email,
        //     phone,
        //     message,
        //     newsletter: newsletter === 'yes'
        //   })
        // })
        // .then(response => response.json())
        // .then(data => {
        //   // Handle success
        // })
        // .catch(error => {
        //   // Handle error
        // });

        // Auto-close after 3 seconds (optional)
        // setTimeout(() => {
        //   closeModal();
        // }, 3000);
      });
    }
  };

  // Newsletter Form Handler (Phase 4) - Using EmailJS (Free alternative)
  const initNewsletter = () => {
    const newsletterForms = document.querySelectorAll('.newsletter');
    if (newsletterForms.length === 0) {
      return;
    }

    // EmailJS Configuration
    // Get these from: https://www.emailjs.com/
    // 1. Sign up for free account (200 emails/month free)
    // 2. Create an email service (Gmail, Outlook, etc.)
    // 3. Create an email template
    // 4. Get your Public Key, Service ID, and Template ID
    const EMAILJS_CONFIG = {
      publicKey: 'YOUR_PUBLIC_KEY', // Replace with your EmailJS Public Key
      serviceId: 'YOUR_SERVICE_ID', // Replace with your EmailJS Service ID
      templateId: 'YOUR_TEMPLATE_ID' // Replace with your EmailJS Template ID
    };

    newsletterForms.forEach((form) => {
      const emailInput = form.querySelector('input[type="email"]');
      const submitButton = form.querySelector('button[type="submit"]');
      const comingSoonMessage = form.parentElement?.querySelector('.newsletter-coming-soon');
      
      if (!emailInput || !submitButton) {
        return;
      }

      // Enable form fields
      emailInput.disabled = false;
      submitButton.disabled = false;
      
      // Hide "Bald verfügbar" message
      if (comingSoonMessage) {
        comingSoonMessage.style.display = 'none';
      }

      // Create message element for success/error feedback
      let messageElement = form.parentElement?.querySelector('.newsletter-message');
      if (!messageElement) {
        messageElement = document.createElement('p');
        messageElement.className = 'newsletter-message';
        messageElement.setAttribute('role', 'alert');
        messageElement.setAttribute('aria-live', 'polite');
        form.parentElement?.appendChild(messageElement);
      }

      const showMessage = (text, isSuccess = true) => {
        messageElement.textContent = text;
        messageElement.className = `newsletter-message ${isSuccess ? 'success' : 'error'} is-visible`;
        messageElement.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
        
        // Auto-hide success message after 5 seconds
        if (isSuccess) {
          setTimeout(() => {
            messageElement.classList.remove('is-visible');
          }, 5000);
        }
      };

      const hideMessage = () => {
        messageElement.classList.remove('is-visible');
      };

      form.addEventListener('submit', async (e) => {
        e.preventDefault();
        hideMessage();

        const email = emailInput.value.trim();
        
        // Validation
        if (!email) {
          showMessage('Bitte geben Sie eine E-Mail-Adresse ein.', false);
          emailInput.focus();
          return;
        }

        // Email format validation
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(email)) {
          showMessage('Bitte geben Sie eine gültige E-Mail-Adresse ein.', false);
          emailInput.focus();
          return;
        }

        // Disable form during submission
        emailInput.disabled = true;
        submitButton.disabled = true;
        const originalButtonText = submitButton.textContent;
        submitButton.textContent = 'Wird gesendet...';

        try {
          // Check if EmailJS is loaded
          if (typeof emailjs === 'undefined') {
            throw new Error('EmailJS SDK nicht geladen. Bitte überprüfen Sie die Konfiguration.');
          }

          // Check if configuration is set
          if (EMAILJS_CONFIG.publicKey === 'YOUR_PUBLIC_KEY' || 
              EMAILJS_CONFIG.serviceId === 'YOUR_SERVICE_ID' || 
              EMAILJS_CONFIG.templateId === 'YOUR_TEMPLATE_ID') {
            showMessage('Newsletter-Service ist noch nicht konfiguriert. Bitte kontaktieren Sie uns direkt unter hello@hellerskaffees.com', false);
            emailInput.disabled = false;
            submitButton.disabled = false;
            submitButton.textContent = originalButtonText;
            return;
          }

          // Initialize EmailJS with public key
          emailjs.init(EMAILJS_CONFIG.publicKey);

          // Send email using EmailJS
          const templateParams = {
            to_email: 'hello@hellerskaffees.com', // Your email address
            from_email: email,
            subject: 'Newsletter-Anmeldung - Hellers Kaffees',
            message: `Neue Newsletter-Anmeldung von: ${email}`,
            email: email
          };

          await emailjs.send(
            EMAILJS_CONFIG.serviceId,
            EMAILJS_CONFIG.templateId,
            templateParams
          );

          // Success
          emailInput.disabled = false;
          submitButton.disabled = false;
          submitButton.textContent = originalButtonText;
          showMessage('Vielen Dank! Sie haben sich erfolgreich für unseren Newsletter angemeldet.', true);
          form.reset();

        } catch (error) {
          // Re-enable form
          emailInput.disabled = false;
          submitButton.disabled = false;
          submitButton.textContent = originalButtonText;
          
          // User-friendly error message
          let errorMessage = 'Es ist ein Fehler aufgetreten. Bitte versuchen Sie es später erneut.';
          if (error.text) {
            errorMessage = `Fehler: ${error.text}`;
          }
          
          showMessage(errorMessage, false);
          console.error('Newsletter submission error:', error);
        }
      });
    });
  };

  // Recipe Timer Widget (Phase 3)
  const initRecipeTimer = () => {
    const timerContainer = document.querySelector('.recipe-timer');
    if (!timerContainer) {
      return;
    }

    const brewTime = parseInt(timerContainer.dataset.brewTime, 10) || 5; // minutes
    const totalSeconds = brewTime * 60;
    
    let currentSeconds = totalSeconds;
    let timerInterval = null;
    let isPaused = false;
    let isRunning = false;

    const timeDisplay = document.getElementById('timer-time');
    const statusDisplay = document.getElementById('timer-status');
    const startBtn = document.getElementById('timer-start');
    const pauseBtn = document.getElementById('timer-pause');
    const resetBtn = document.getElementById('timer-reset');
    const soundToggle = document.getElementById('timer-sound');
    const stepsContainer = document.getElementById('timer-steps');
    const steps = stepsContainer?.querySelectorAll('.timer-step') || [];

    // Format time as MM:SS
    const formatTime = (seconds) => {
      const mins = Math.floor(seconds / 60);
      const secs = seconds % 60;
      return `${mins}:${String(secs).padStart(2, '0')}`;
    };

    // Play sound notification (if enabled)
    const playSound = () => {
      if (soundToggle && !soundToggle.checked) {
        return;
      }
      
      // Create audio context for beep sound
      try {
        const audioContext = new (window.AudioContext || window.webkitAudioContext)();
        const oscillator = audioContext.createOscillator();
        const gainNode = audioContext.createGain();
        
        oscillator.connect(gainNode);
        gainNode.connect(audioContext.destination);
        
        oscillator.frequency.value = 800; // 800 Hz beep
        oscillator.type = 'sine';
        
        gainNode.gain.setValueAtTime(0.3, audioContext.currentTime);
        gainNode.gain.exponentialRampToValueAtTime(0.01, audioContext.currentTime + 0.2);
        
        oscillator.start(audioContext.currentTime);
        oscillator.stop(audioContext.currentTime + 0.2);
      } catch (e) {
        // Fallback: silent notification (works even if audio fails)
        console.log('Sound notification');
      }
    };

    // Update step highlighting
    const updateSteps = (elapsedSeconds) => {
      let activeStepIndex = -1;
      
      // Find the current active step
      steps.forEach((step, index) => {
        const stepTime = parseInt(step.dataset.stepTime, 10);
        if (elapsedSeconds >= stepTime) {
          activeStepIndex = index;
        }
      });
      
      steps.forEach((step, index) => {
        step.classList.remove('active', 'completed', 'next');
        
        if (index < activeStepIndex) {
          // Past steps
          step.classList.add('completed');
        } else if (index === activeStepIndex) {
          // Current active step
          step.classList.add('active');
        } else if (index === activeStepIndex + 1) {
          // Next upcoming step
          step.classList.add('next');
        }
      });
    };

    // Check for step notifications
    const checkSteps = (elapsedSeconds) => {
      steps.forEach((step) => {
        const stepTime = parseInt(step.dataset.stepTime, 10);
        const stepKey = `step-${stepTime}-notified`;
        
        // Only notify once per step
        if (elapsedSeconds >= stepTime && !step.dataset.notified) {
          step.dataset.notified = 'true';
          playSound();
          
          // Show notification
          const stepText = step.querySelector('.step-text')?.textContent || '';
          if (stepText && statusDisplay) {
            statusDisplay.textContent = stepText;
            statusDisplay.classList.add('notify');
            setTimeout(() => {
              statusDisplay.classList.remove('notify');
            }, 3000);
          }
        }
      });
    };

    // Update display
    const updateDisplay = () => {
      if (timeDisplay) {
        timeDisplay.textContent = formatTime(currentSeconds);
      }
      
      const elapsedSeconds = totalSeconds - currentSeconds;
      updateSteps(elapsedSeconds);
      checkSteps(elapsedSeconds);
    };

    // Start timer
    const startTimer = () => {
      if (isRunning && !isPaused) {
        return;
      }

      isRunning = true;
      isPaused = false;
      
      if (startBtn) startBtn.style.display = 'none';
      if (pauseBtn) pauseBtn.style.display = 'inline-flex';
      
      if (statusDisplay) {
        statusDisplay.textContent = 'Läuft...';
      }

      // Reset step notifications if starting fresh
      if (currentSeconds === totalSeconds) {
        steps.forEach((step) => {
          delete step.dataset.notified;
        });
      }

      timerInterval = setInterval(() => {
        if (currentSeconds > 0) {
          currentSeconds--;
          updateDisplay();
        } else {
          // Timer finished
          stopTimer();
          playSound();
          if (statusDisplay) {
            statusDisplay.textContent = 'Fertig! Genießen Sie Ihren Kaffee.';
            statusDisplay.classList.add('finished');
          }
        }
      }, 1000);
    };

    // Pause timer
    const pauseTimer = () => {
      if (!isRunning) {
        return;
      }

      isPaused = true;
      isRunning = false;
      
      if (timerInterval) {
        clearInterval(timerInterval);
        timerInterval = null;
      }
      
      if (startBtn) startBtn.style.display = 'inline-flex';
      if (pauseBtn) pauseBtn.style.display = 'none';
      
      if (statusDisplay) {
        statusDisplay.textContent = 'Pausiert';
      }
    };

    // Reset timer
    const resetTimer = () => {
      stopTimer();
      currentSeconds = totalSeconds;
      updateDisplay();
      
      if (statusDisplay) {
        statusDisplay.textContent = 'Bereit';
        statusDisplay.classList.remove('finished', 'notify');
      }
      
      // Reset step notifications
      steps.forEach((step) => {
        delete step.dataset.notified;
        step.classList.remove('active', 'completed', 'next');
      });
    };

    // Stop timer
    const stopTimer = () => {
      isRunning = false;
      isPaused = false;
      
      if (timerInterval) {
        clearInterval(timerInterval);
        timerInterval = null;
      }
      
      if (startBtn) startBtn.style.display = 'inline-flex';
      if (pauseBtn) pauseBtn.style.display = 'none';
    };

    // Event listeners
    if (startBtn) {
      startBtn.addEventListener('click', startTimer);
    }
    
    if (pauseBtn) {
      pauseBtn.addEventListener('click', pauseTimer);
    }
    
    if (resetBtn) {
      resetBtn.addEventListener('click', resetTimer);
    }

    // Initial display
    updateDisplay();
  };

  // Initialize on DOM ready
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', () => {
      initParallax();
      initHeroCTA();
      initScrollAnimations();
      initProgressIndicator();
      initDarkMode();
      initHeaderNavigation();
      initRecipeCalculator();
      initEventModal();
      initNewsletter();
      initRecipeTimer();
    });
  } else {
    initParallax();
    initHeroCTA();
    initScrollAnimations();
    initProgressIndicator();
    initDarkMode();
    initHeaderNavigation();
    initRecipeCalculator();
    initEventModal();
    initNewsletter();
    initRecipeTimer();
  }
})();

