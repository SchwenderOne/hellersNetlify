// Interactive Tasting Wheel
document.addEventListener('DOMContentLoaded', function() {
  const flavorCategories = document.querySelectorAll('.flavor-category');
  const categorySegments = document.querySelectorAll('.category-segment');
  const flavorSegments = document.querySelectorAll('.flavor-segment');
  const flavorName = document.getElementById('flavor-name');
  const flavorDescription = document.getElementById('flavor-description');
  const flavorTags = document.getElementById('flavor-tags');
  const matchingCoffeesDiv = document.getElementById('matching-coffees');
  const resetBtn = document.getElementById('reset-wheel-btn');
  const flavorDetails = document.getElementById('flavor-details');

  let activeCategory = null;
  let activeSegment = null;

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
      description: 'Kaffees mit fruchtigen Noten bieten eine lebendige, helle Tasse mit Geschmacksnoten von Beeren, Zitrusfrüchten und tropischen Früchten. Diese Profile sind oft mit helleren Röstungen verbunden.',
      icon: '🍊'
    },
    floral: {
      title: 'Blumig',
      description: 'Blumige Kaffees präsentieren zarte, duftende Noten von Jasmin, Bergamotte und anderen Blumen. Diese eleganten Profile sind charakteristisch für hochwertige äthiopische und kolumbianische Kaffees.',
      icon: '🌸'
    },
    sweet: {
      title: 'Süß',
      description: 'Süße Kaffees haben eine angenehme Süße mit Noten von Honig, Karamell, Schokolade und Nüssen. Diese Profile sind ausgewogen und zugänglich, perfekt für jeden Tag.',
      icon: '🍯'
    },
    complex: {
      title: 'Komplex',
      description: 'Komplexe Kaffees bieten vielschichtige Aromen mit Noten von Wein, Gewürzen und Tee. Diese raffinierten Profile entwickeln sich beim Abkühlen und offenbaren neue Geschmacksdimensionen.',
      icon: '🍷'
    }
  };

  const subcategoryInfo = {
    'Zitrus': { description: 'Helle, lebendige Noten von Zitrone, Orange, Grapefruit und Bergamotte', flavors: ['Citrus', 'Lemon', 'Orange', 'Grapefruit'] },
    'Beeren': { description: 'Süße und säuerliche Beerennoten wie schwarze Johannisbeeren und rote Beeren', flavors: ['Blackcurrant', 'Red Berries'] },
    'Steinobst': { description: 'Saftige Noten von Pfirsichen und Aprikosen', flavors: ['Peach', 'White Peach'] },
    'Tropisch': { description: 'Exotische tropische Früchte wie Mango und Passionsfrucht', flavors: ['Mango', 'Passion Fruit'] },
    'Kernobst': { description: 'Knackige Apfelnoten, grün und rot', flavors: ['Green Apple', 'Red Apple'] },
    'Weiße Blüten': { description: 'Zarte Noten von Jasmin und weißen Blumen', flavors: ['Jasmine', 'White Flowers'] },
    'Aromatisch': { description: 'Aromatische blumige Noten mit Bergamotte', flavors: ['Bergamot', 'Floral'] },
    'Kräuterig': { description: 'Kräuterige und teeähnliche Qualitäten', flavors: ['Tea', 'Black Tea'] },
    'Tee': { description: 'Leichte, teeähnliche Charakteristiken', flavors: ['Tea'] },
    'Zucker': { description: 'Süße Noten von Honig und Karamell', flavors: ['Honey', 'Caramel'] },
    'Schokolade': { description: 'Reichhaltige Schokoladennoten', flavors: ['Chocolate'] },
    'Nussig': { description: 'Nussige Aromen und Textur', flavors: ['Nuts'] },
    'Karamell': { description: 'Süße Karamellnoten', flavors: ['Caramel'] },
    'Weinartig': { description: 'Komplexe weinartige Charakteristiken', flavors: ['Wine'] },
    'Würzig': { description: 'Würzige Noten wie Zimt und Nelken', flavors: ['Spice'] },
    'Fermentiert': { description: 'Komplexe fermentierte Noten', flavors: ['Wine', 'Tea'] },
    'Schwarztee': { description: 'Schwarztee-ähnliche Qualitäten', flavors: ['Black Tea'] }
  };

  // Reset function
  function resetWheel() {
    // Remove active states
    document.querySelectorAll('.active').forEach(el => el.classList.remove('active'));
    activeCategory = null;
    activeSegment = null;

    // Reset details panel
    flavorName.textContent = 'Wählen Sie eine Kategorie';
    flavorDescription.innerHTML = '<p>Bewegen Sie die Maus über einen Bereich des Aromenrads, um mehr über diese Geschmacksrichtung zu erfahren. Klicken Sie für Details.</p>';
    flavorTags.innerHTML = '';
    matchingCoffeesDiv.innerHTML = '';
    flavorDetails.classList.remove('active');
  }

  // Update details panel
  function updateDetails(title, description, flavors, isSubcategory = false) {
    flavorName.textContent = title;
    flavorDescription.innerHTML = `<p>${description}</p>`;

    // Show flavor tags
    if (flavors && flavors.length > 0) {
      flavorTags.innerHTML = flavors.map(flavor =>
        `<span class="flavor-tag">${flavor}</span>`
      ).join('');
    } else {
      flavorTags.innerHTML = '';
    }

    // Find and display matching coffees
    const matchingCoffees = coffees.filter(coffee => {
      return coffee.flavors.some(flavor => flavors.includes(flavor));
    });

    if (matchingCoffees.length > 0) {
      matchingCoffeesDiv.innerHTML = `
        <h4>Passende Kaffees <span class="count">(${matchingCoffees.length})</span></h4>
        <ul class="coffee-list">
          ${matchingCoffees.map(coffee => `
            <li class="coffee-item">
              <a href="/${coffee.slug}/">${coffee.name}</a>
              <svg class="arrow-icon" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M5 12H19M19 12L12 5M19 12L12 19" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
              </svg>
            </li>
          `).join('')}
        </ul>
      `;
    } else {
      matchingCoffeesDiv.innerHTML = '<p class="no-matches">Keine passenden Kaffees gefunden</p>';
    }

    flavorDetails.classList.add('active');
  }

  // Category segment hover
  categorySegments.forEach(segment => {
    const category = segment.closest('.flavor-category');
    const categoryName = category.dataset.category;

    segment.addEventListener('mouseenter', function() {
      if (!activeSegment) {
        category.classList.add('hover');
      }
    });

    segment.addEventListener('mouseleave', function() {
      category.classList.remove('hover');
    });

    segment.addEventListener('click', function(e) {
      e.stopPropagation();

      // Remove previous active states
      document.querySelectorAll('.active').forEach(el => el.classList.remove('active'));

      // Set new active state
      category.classList.add('active');
      activeCategory = category;
      activeSegment = null;

      const flavorsString = segment.dataset.flavors;
      const flavors = flavorsString.split(',');
      const categoryInfo = categoryDescriptions[categoryName];

      updateDetails(categoryInfo.title, categoryInfo.description, flavors);
    });
  });

  // Individual flavor segment hover and click
  flavorSegments.forEach(segment => {
    const subcategory = segment.dataset.subcategory;

    segment.addEventListener('mouseenter', function() {
      segment.classList.add('hover');
    });

    segment.addEventListener('mouseleave', function() {
      segment.classList.remove('hover');
    });

    segment.addEventListener('click', function(e) {
      e.stopPropagation();

      // Remove previous active states
      document.querySelectorAll('.active').forEach(el => el.classList.remove('active'));

      // Set new active state
      segment.classList.add('active');
      const category = segment.closest('.flavor-category');
      category.classList.add('active');
      activeSegment = segment;
      activeCategory = category;

      const subcategoryData = subcategoryInfo[subcategory];
      if (subcategoryData) {
        updateDetails(subcategory, subcategoryData.description, subcategoryData.flavors, true);
      }
    });
  });

  // Reset button
  if (resetBtn) {
    resetBtn.addEventListener('click', resetWheel);
  }

  // Initialize
  resetWheel();
});
