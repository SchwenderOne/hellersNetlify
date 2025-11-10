// Interactive Tasting Wheel
document.addEventListener('DOMContentLoaded', function() {
  const flavorSegments = document.querySelectorAll('.flavor-segment');
  const flavorName = document.getElementById('flavor-name');
  const flavorDescription = document.getElementById('flavor-description');
  const matchingCoffeesDiv = document.getElementById('matching-coffees');

  // Coffee data with flavor profiles
  const coffees = [
    { name: 'Hendra Maulizar', slug: 'hendra-maulizar', flavors: ['Blackcurrant', 'White Peach', 'Green Apple', 'White Flowers'] },
    { name: 'Garcia Family', slug: 'garcia-family', flavors: ['Chocolate', 'Caramel', 'Nuts'] },
    { name: 'Inmaculada Geisha Signature', slug: 'inmaculada-geisha-signature', flavors: ['Jasmine', 'Bergamot', 'Peach', 'Honey'] },
    { name: 'James Gonzales', slug: 'james-gonzales', flavors: ['Citrus', 'Orange', 'Honey', 'Caramel'] },
    { name: 'Roberto Martínez', slug: 'roberto-martinez', flavors: ['Chocolate', 'Red Fruits', 'Spice', 'Caramel'] },
    { name: 'Finca Deborah Geisha Vivid', slug: 'finca-deborah-vivid', flavors: ['Jasmine', 'Bergamot', 'Mango', 'Passion Fruit'] },
    { name: 'Ivan Villaquira', slug: 'ivan-villaquira', flavors: ['Red Berries', 'Wine', 'Floral', 'Caramel'] },
    { name: 'Getuya AA', slug: 'getuya-aa', flavors: ['Blackcurrant', 'Grapefruit', 'Lemon', 'Black Tea'] },
    { name: 'Bishan Wate', slug: 'bishan-wate', flavors: ['Jasmine', 'Bergamot', 'Lemon', 'Tea'] },
    { name: 'Javier Quintero', slug: 'javier-quintero', flavors: ['Red Apple', 'Honey', 'Caramel', 'Floral'] }
  ];

  const categoryDescriptions = {
    fruity: {
      title: 'Fruchtig',
      description: 'Kaffees mit fruchtigen Noten bieten eine lebendige, helle Tasse mit Geschmacksnoten von Beeren, Zitrusfrüchten und tropischen Früchten. Diese Profile sind oft mit helleren Röstungen verbunden.'
    },
    floral: {
      title: 'Blumig',
      description: 'Blumige Kaffees präsentieren zarte, duftende Noten von Jasmin, Bergamotte und anderen Blumen. Diese eleganten Profile sind charakteristisch für hochwertige äthiopische und kolumbianische Kaffees.'
    },
    sweet: {
      title: 'Süß',
      description: 'Süße Kaffees haben eine angenehme Süße mit Noten von Honig, Karamell, Schokolade und Nüssen. Diese Profile sind ausgewogen und zugänglich, perfekt für jeden Tag.'
    },
    complex: {
      title: 'Komplex',
      description: 'Komplexe Kaffees bieten vielschichtige Aromen mit Noten von Wein, Gewürzen und Tee. Diese raffinierten Profile entwickeln sich beim Abkühlen und offenbaren neue Geschmacksdimensionen.'
    }
  };

  flavorSegments.forEach(segment => {
    segment.addEventListener('click', function() {
      const category = this.dataset.category;
      const flavorsString = this.querySelector('.segment').dataset.flavors;
      const flavors = flavorsString.split(',');

      // Update flavor details
      const categoryInfo = categoryDescriptions[category];
      flavorName.textContent = categoryInfo.title;
      flavorDescription.innerHTML = `<p>${categoryInfo.description}</p>`;

      // Find matching coffees
      const matchingCoffees = coffees.filter(coffee => {
        return coffee.flavors.some(flavor => flavors.includes(flavor));
      });

      // Display matching coffees
      if (matchingCoffees.length > 0) {
        matchingCoffeesDiv.innerHTML = `
          <h4>Passende Kaffees (${matchingCoffees.length})</h4>
          <ul>
            ${matchingCoffees.map(coffee => `
              <li><a href="/${coffee.slug}/">${coffee.name}</a></li>
            `).join('')}
          </ul>
        `;
      } else {
        matchingCoffeesDiv.innerHTML = '';
      }
    });
  });
});

// Interactive Coffee Origins Map
document.addEventListener('DOMContentLoaded', function() {
  const originMarkers = document.querySelectorAll('.origin-marker');
  const originCountryName = document.getElementById('origin-country-name');
  const originDetails = document.getElementById('origin-details');

  // Origin data
  const originData = {
    Indonesia: {
      region: 'Aceh, Gayo Highlands',
      altitude: '1,100-1,600m',
      characteristics: 'Vollmundig, erdige Untertöne mit kräutigem und würzigem Charakter. Cremige Textur durch vulkanischen Boden.',
      coffees: [{ name: 'Hendra Maulizar', slug: 'hendra-maulizar', process: 'Washed' }]
    },
    Brazil: {
      region: 'Minas Gerais, Cerrado',
      altitude: '500-1,200m',
      characteristics: 'Ausgewogen und süß mit Noten von Schokolade, Karamell und Nüssen. Niedrige Säure, ideal für Espresso.',
      coffees: [{ name: 'Garcia Family', slug: 'garcia-family', process: 'Natural' }]
    },
    Colombia: {
      region: 'Andes Highlands, Huila',
      altitude: '1,200-2,000m',
      characteristics: 'Ausgewogen mit heller Säure, blumigen Noten und fruchtiger Komplexität. Vielseitig und konsistent.',
      coffees: [
        { name: 'Inmaculada Geisha Signature', slug: 'inmaculada-geisha-signature', process: 'Washed' },
        { name: 'Ivan Villaquira', slug: 'ivan-villaquira', process: 'Washed' },
        { name: 'Javier Quintero', slug: 'javier-quintero', process: 'Washed' }
      ]
    },
    Peru: {
      region: 'Andes Mountains',
      altitude: '1,200-2,000m',
      characteristics: 'Hell und sauber mit Zitrustönen. Sanfter Abgang mit honigartiger Süße.',
      coffees: [{ name: 'James Gonzales', slug: 'james-gonzales', process: 'Washed' }]
    },
    Honduras: {
      region: 'Mountain Regions',
      altitude: '1,000-1,700m',
      characteristics: 'Ausgewogen mit Schokoladennoten, roten Früchten und einem Hauch Gewürz. Mittlere Säure.',
      coffees: [{ name: 'Roberto Martínez', slug: 'roberto-martinez', process: 'Washed' }]
    },
    Panama: {
      region: 'Boquete, Chiriquí',
      altitude: '1,400-1,900m',
      characteristics: 'Exquisite Geisha-Varietät mit lebendigen floralen Noten und tropischer Fruchtkomplexität.',
      coffees: [{ name: 'Finca Deborah Geisha Vivid', slug: 'finca-deborah-vivid', process: 'Washed' }]
    },
    Kenya: {
      region: 'Mount Kenya Foothills',
      altitude: '1,500-2,100m',
      characteristics: 'Helle Säure mit schwarzen Johannisbeeren, Grapefruit und sauberer Abgang. Kraftvoll und lebendig.',
      coffees: [{ name: 'Getuya AA', slug: 'getuya-aa', process: 'Washed' }]
    },
    Ethiopia: {
      region: 'Ethiopian Highlands, Sidamo',
      altitude: '1,200-2,100m',
      characteristics: 'Klassisch äthiopisch mit floralen Noten, Bergamotte und teeähnlichem Körper. Die Geburtsstätte des Kaffees.',
      coffees: [{ name: 'Bishan Wate', slug: 'bishan-wate', process: 'Washed' }]
    }
  };

  originMarkers.forEach(marker => {
    marker.addEventListener('click', function() {
      const country = this.dataset.country;
      const data = originData[country];

      if (data) {
        originCountryName.textContent = country;
        originDetails.innerHTML = `
          <div class="origin-info-content">
            <p><strong>Region:</strong> ${data.region}</p>
            <p class="origin-altitude-info">${data.altitude}</p>
            <p>${data.characteristics}</p>
            <div class="origin-coffees-list">
              <h4>Unsere Kaffees aus ${country}</h4>
              <ul>
                ${data.coffees.map(coffee => `
                  <li>
                    <a href="/${coffee.slug}/">${coffee.name}</a>
                    <span style="font-size: 0.85em; opacity: 0.7;">(${coffee.process})</span>
                  </li>
                `).join('')}
              </ul>
            </div>
          </div>
        `;
      }
    });
  });
});
