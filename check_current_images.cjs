const https = require('https');
const fs = require('fs');

const coffees = JSON.parse(fs.readFileSync('src/data/coffees.json', 'utf8'));

async function checkImage(url) {
    if (!url) return 'MISSING';
    if (!url.startsWith('http')) return 'LOCAL'; // Ignore local paths

    return new Promise((resolve) => {
        const req = https.request(url, { method: 'HEAD' }, (res) => {
            resolve(res.statusCode);
        });
        req.on('error', () => resolve('ERROR'));
        req.end();
    });
}

(async () => {
    console.log('Checking current images...');
    const results = [];
    for (const coffee of coffees) {
        const status = await checkImage(coffee.image);
        results.push({ name: coffee.name, status, url: coffee.image });
    }
    console.table(results);
})();
