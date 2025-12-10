const fs = require('fs');

const coffeesPath = 'src/data/coffees.json';
const coffees = JSON.parse(fs.readFileSync(coffeesPath, 'utf8'));

// Official images we found (keeping it simple with best resolution)
const updates = {
    'bishan-wate': [
        'https://rozalicoffee.de/cdn/shop/files/product_bishan-wate_retail_2025.jpg?v=1765115085'
    ],
    'roberto-martinez': [
        'https://rozalicoffee.de/cdn/shop/files/product_alfonso-pineda_200g_2025.jpg?v=1764944125'
    ],
    'getuya-aa': [
        // Keep existing if no better one found, or use a high res generic from earlier if available
        // For now, we'll just use the existing one in loop below if not in this map, 
        // BUT we want to replace the Unsplash one if possible. 
        // Since I failed to fetch an official one, I will NOT put it here, 
        // so it falls back to the existing Unsplash one.
    ]
};

const updatedCoffees = coffees.map(coffee => {
    let gallery = [];

    // Check if we have an update map for this slug
    if (updates[coffee.slug] && updates[coffee.slug].length > 0) {
        gallery = updates[coffee.slug];
        // Update main image to the first one in gallery for consistency
        coffee.image = gallery[0];
    } else {
        // Fallback: use existing image
        if (coffee.image) {
            gallery = [coffee.image];
        }
    }

    // Ensure gallery is attached
    coffee.gallery = gallery;

    return coffee;
});

fs.writeFileSync(coffeesPath, JSON.stringify(updatedCoffees, null, 2));
console.log('Updated coffees.json with gallery fields.');
