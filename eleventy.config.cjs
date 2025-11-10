module.exports = async function(eleventyConfig) {
  const { default: EleventyVitePlugin } = await import('@11ty/eleventy-plugin-vite');

  eleventyConfig.addPlugin(EleventyVitePlugin, {
    viteOptions: {
      appType: 'mpa',
      server: { middlewareMode: true },
      build: {
        outDir: 'dist',
        emptyOutDir: false
      }
    }
  });

  // Add custom Nunjucks filters
  eleventyConfig.addNunjucksFilter('split', function(str, delimiter) {
    if (!str) return [];
    return str.split(delimiter);
  });

  eleventyConfig.addNunjucksFilter('findWhere', function(array, key, value) {
    if (!Array.isArray(array)) return null;
    return array.find(item => item && item[key] === value) || null;
  });

  eleventyConfig.addPassthroughCopy({ 'src/styles': 'styles' });
  eleventyConfig.addPassthroughCopy({ 'src/scripts': 'scripts' });
  eleventyConfig.addPassthroughCopy({ 'src/assets': 'assets' });
  eleventyConfig.addPassthroughCopy({ 'src/favicon.svg': 'favicon.svg' });
  eleventyConfig.addPassthroughCopy({ 'src/sitemap.xml': 'sitemap.xml' });
  eleventyConfig.addPassthroughCopy({ 'src/_redirects': '_redirects' });
  const legacyPages = [
    'aeropress',
    'chemex',
    'cold-brew',
    'drip',
    'events',
    'french-press',
    'home-espresso',
    'kalita-wave',
    'menu',
    'origami-dripper',
    'v60',
  ];
  for (const page of legacyPages) {
    eleventyConfig.addPassthroughCopy({ [`legacy-static/${page}.html`]: `${page}.html` });
  }

  return {
    dir: {
      input: 'src',
      includes: 'partials',
      data: 'data',
      layouts: 'layouts',
      output: 'dist'
    },
    htmlTemplateEngine: 'njk',
    markdownTemplateEngine: 'njk'
  };
};
