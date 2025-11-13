module.exports = function(eleventyConfig) {

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

  // MapLibre GL JS CSS
  eleventyConfig.addPassthroughCopy({ 'node_modules/maplibre-gl/dist/maplibre-gl.css': 'styles/maplibre-gl.css' });

  // NOTE: Legacy static page copies removed (Nov 2025)
  // Pages are now properly templated in src/*.html and output to subdirectories with correct absolute CSS paths.
  // Previously, legacy-static copies were created at root level with relative CSS paths that broke on deployment.

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
