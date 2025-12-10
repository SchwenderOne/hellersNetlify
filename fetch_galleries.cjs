const https = require('https');

const products = [
    { slug: 'getuya-aa', name: 'Getuya AA' },
    { slug: 'bishan-wate', name: 'Bishan Wate' },
    { slug: 'alfonso-pineda', name: 'Alfonso Pineda' } // For Roberto Martinez
];

async function getGallery(product) {
    const url = `https://rozalicoffee.de/products/${product.slug}`;
    const options = {
        headers: {
            'User-Agent': 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36'
        }
    };

    return new Promise((resolve) => {
        https.get(url, options, (res) => {
            let data = '';
            res.on('data', chunk => data += chunk);
            res.on('end', () => {
                // Find all product images (usually distinct by query params or filenames)
                // Adjust regex to capture full URLs including queries till some end char
                // Shopify often puts images in a list or JSON. Let's try broad regex first.
                const matches = data.match(/https:\/\/[^"]*cdn\/shop\/files\/[^"]*\.jpg\?v=\d+/g) || [];
                const unique = [...new Set(matches)];

                // Filter mainly for high res or product shots if possible, but uniqueness usually good enough
                // filter out small icons if any (usually different path)
                const gallery = unique.filter(u => !u.includes('_small') && !u.includes('_thumb') && !u.includes('giftcard'));

                resolve({ slug: product.slug, gallery });
            });
        }).on('error', (e) => resolve({ slug: product.slug, error: e.message }));
    });
}

(async () => {
    console.log('Fetching galleries...');
    const results = await Promise.all(products.map(getGallery));
    console.log(JSON.stringify(results, null, 2));
})();
