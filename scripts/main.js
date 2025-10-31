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
})();

