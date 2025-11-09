const EleventyVitePlugin = require('@11ty/eleventy-plugin-vite').default;
const path = require('path');

module.exports = function(eleventyConfig) {
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

  eleventyConfig.addPassthroughCopy({ 'src/styles': 'styles' });
  eleventyConfig.addPassthroughCopy({ 'src/scripts': 'scripts' });
  eleventyConfig.addPassthroughCopy({ 'src/assets': 'assets' });
  eleventyConfig.addPassthroughCopy({ 'src/favicon.svg': 'favicon.svg' });
  eleventyConfig.addPassthroughCopy({ 'src/sitemap.xml': 'sitemap.xml' });
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
