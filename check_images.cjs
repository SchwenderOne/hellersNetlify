const https = require('https');

const slugs = [
  'hendra-maulizar',
  'garcia-family',
  'inmaculada-geisha-signature',
  'james-gonzales',
  'alfonso-pineda', // For Roberto Martinez substitute
  'finca-deborah-geisha-vivid', // Guessing URL
  'finca-deborah-vivid', // Guessing URL
  'ivan-villaquira',
  'getuya-aa',
  'bishan-wate',
  'javier-quintero'
];

async function checkUrl(slug) {
  const url = `https://rozalicoffee.de/collections/all/products/${slug}`;
  const options = {
    headers: {
      'User-Agent': 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36'
    }
  };

  return new Promise((resolve) => {
    https.get(url, options, (res) => {
      let data = '';
      // handle redirects if necessary (Shopify sometimes redirects to /products/handle)
      if (res.statusCode === 301 || res.statusCode === 302) {
        resolve({ slug, count: 0, status: res.statusCode, location: res.headers.location });
        // Could follow redirect recursively but for now just knowing it's a redirect is useful info to fix slug
        return;
      }

      res.on('data', chunk => data += chunk);
      res.on('end', () => {
        if (res.statusCode !== 200) {
          resolve({ slug, count: 0, status: res.statusCode });
          return;
        }

        // Simple regex to find product images
        // Look for typical Shopify product image patterns
        const matches = data.match(/https:\/\/[^"]*cdn\/shop\/files\/[^"]*\.jpg\?v=\d+/g) || [];
        const unique = [...new Set(matches)];

        // Filter for "product" or "retail" in name which usually indicates main images, not icons
        const productImages = unique.filter(u => u.includes('product') || u.includes('retail') || u.includes('front') || u.includes('bag'));

        // If no "product" keywords found, just take large images?
        // Let's return verification
        resolve({ slug, count: unique.length, productCount: productImages.length, status: 200 });
      });
    }).on('error', (e) => {
      resolve({ slug, count: 0, status: 'error: ' + e.message });
    });
  });
}

(async () => {
  console.log('Checking images...');
  const results = await Promise.all(slugs.map(checkUrl));
  console.table(results);
})();
