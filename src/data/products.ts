import { Product, CustomerReview, MLForecastData, RFMCustomerSegment, DynamicPricingInsight } from '../types';

export const CATEGORIES = [
  {
    id: 'Cars',
    name: 'Cars',
    icon: 'Car',
    description: 'Battery operated sports & off-road cars',
    bannerImg: 'https://images.unsplash.com/photo-1596461404969-9ae70f2830c1?auto=format&fit=crop&w=400&q=80',
    itemCount: 8,
  },
  {
    id: 'EV',
    name: 'EV',
    icon: 'Zap',
    description: 'Electric jeeps, bikes & luxury ride-ons',
    bannerImg: 'https://images.unsplash.com/photo-1533473359331-0135ef1b58bf?auto=format&fit=crop&w=400&q=80',
    itemCount: 12,
  },
  {
    id: 'Ride Ons',
    name: 'Ride Ons',
    icon: 'Smile',
    description: 'Swing cars, foot-to-floor & push cars',
    bannerImg: 'https://images.unsplash.com/photo-1515488042361-ee00e0ddd4e4?auto=format&fit=crop&w=400&q=80',
    itemCount: 10,
  },
  {
    id: 'Scooters',
    name: 'Scooters',
    icon: 'Wind',
    description: 'LED-wheel kick & 3-wheel tilt scooters',
    bannerImg: 'https://images.unsplash.com/photo-1544620347-c4fd4a3d5957?auto=format&fit=crop&w=400&q=80',
    itemCount: 7,
  },
  {
    id: 'Trikes',
    name: 'Trikes',
    icon: 'Compass',
    description: 'Tricycles with parental push bars & canopy',
    bannerImg: 'https://images.unsplash.com/photo-1572635196237-14b3f281503f?auto=format&fit=crop&w=400&q=80',
    itemCount: 9,
  },
  {
    id: 'Walkers',
    name: 'Walkers',
    icon: 'Baby',
    description: 'Anti-rollover musical baby learning walkers',
    bannerImg: 'https://images.unsplash.com/photo-1519689680058-324335c77eba?auto=format&fit=crop&w=400&q=80',
    itemCount: 6,
  },
] as const;

export const PRODUCTS: Product[] = [
  // 1. DUCATTI (Best Seller 1 & Spotlight)
  {
    id: 'ducatti-01',
    name: 'DUCATTI',
    category: 'EV',
    price: 5630,
    originalPrice: 6625,
    discountPercent: 15,
    rating: 4.9,
    reviewCount: 142,
    ageRange: '3 - 8 Years',
    batterySpec: '12V 7Ah Rechargeable, Dual 35W Motors',
    maxWeightKg: 35,
    colors: ['Crimson Red', 'Speed Blue', 'Shadow Black'],
    inStock: true,
    stockCount: 18,
    isBestSeller: true,
    isTrending: true,
    isSpotlight: true,
    description: 'Unleash your little one\'s inner racer with the ultimate electric ride-on. Built for safety, designed for style, and ready for every backyard adventure.',
    features: [
      'Dual 35W heavy-duty electric motors for smooth acceleration',
      'Removable wide stabilizer training wheels for beginner balance',
      'Realistic throttle handle acceleration with handbrake',
      'USB/Bluetooth music console with built-in racing sounds',
      'Soft-grip anti-slip handlebars and spring shock absorption',
      'BIS safety standard IS 9873 certified non-toxic virgin ABS plastic'
    ],
    dimensions: '102 x 51 x 64 cm',
    image: 'https://images.unsplash.com/photo-1558981806-ec527fa84c39?auto=format&fit=crop&w=800&q=80',
    gallery: [
      'https://images.unsplash.com/photo-1558981806-ec527fa84c39?auto=format&fit=crop&w=800&q=80',
      'https://images.unsplash.com/photo-1568772585407-9361f9bf3a87?auto=format&fit=crop&w=800&q=80',
      'https://images.unsplash.com/photo-1558981403-c5f9899a28bc?auto=format&fit=crop&w=800&q=80'
    ],
    tags: ['electric bike', 'ducati', 'rechargeable', '12v', 'bestseller', 'fast', 'red'],
    safetyCertifications: ['ISO 9001:2015', 'BIS IS 9873 Part 1-3', 'CE Safe Kids'],
    material: 'High-Impact Virgin Polypropylene & Steel Frame',
    bisCode: 'CM/L-8400192408',
    salesVelocityPerMonth: 95,
    predictedDemandNextMonth: 120,
    sentimentSummary: {
      positiveRatio: 0.94,
      topPraises: ['Sturdy build quality', 'Long battery backup (90 mins)', 'Easy assembly'],
      topConcerns: ['Charging time takes 6-8 hrs', 'Large packaging box']
    }
  },

  // 2. HUMR EV (Best Seller 2 & Trending)
  {
    id: 'humr-ev-02',
    name: 'HUMR EV',
    category: 'EV',
    price: 3965,
    originalPrice: 4665,
    discountPercent: 15,
    rating: 4.8,
    reviewCount: 98,
    ageRange: '2 - 7 Years',
    batterySpec: '12V 4.5Ah Battery with Parental 2.4G Remote',
    maxWeightKg: 40,
    colors: ['Royal Blue', 'Cyber Yellow', 'Army Green'],
    inStock: true,
    stockCount: 14,
    isBestSeller: true,
    isTrending: true,
    isSpotlight: false,
    description: 'Rugged all-terrain heavy electric jeep equipped with double doors, off-road knobby wheels, bright LED searchlights, and dual control mode (kids pedal or parents 2.4G remote).',
    features: [
      'Dual Driving Mode: Manual pedal + 2.4GHz remote override for parents',
      'High ground clearance with four-wheel suspension',
      'Safety seatbelt and magnetic openable doors',
      'Dashboard with battery voltage meter, AUX input & horn'
    ],
    dimensions: '110 x 68 x 60 cm',
    image: 'https://images.unsplash.com/photo-1533473359331-0135ef1b58bf?auto=format&fit=crop&w=800&q=80',
    tags: ['jeep', 'hummer', 'ev', 'remote control', 'blue', '4x4'],
    safetyCertifications: ['ISO 9001:2015', 'BIS IS 9873'],
    material: 'Reinforced Virgin Polymer & Alloy Axles',
    bisCode: 'CM/L-8400192409',
    salesVelocityPerMonth: 80,
    predictedDemandNextMonth: 105,
    sentimentSummary: {
      positiveRatio: 0.92,
      topPraises: ['Parent remote gives great peace of mind', 'Strong wheels on grass and gravel'],
      topConcerns: ['Takes 20 minutes initial assembly']
    }
  },

  // 3. BUNNY (Best Seller 3)
  {
    id: 'bunny-03',
    name: 'BUNNY',
    category: 'Ride Ons',
    price: 2365,
    originalPrice: 2780,
    discountPercent: 15,
    rating: 4.9,
    reviewCount: 215,
    ageRange: '1.5 - 5 Years',
    maxWeightKg: 65,
    colors: ['Mint Aqua', 'Pastel Pink', 'Mango Yellow'],
    inStock: true,
    stockCount: 32,
    isBestSeller: true,
    isTrending: false,
    isSpotlight: false,
    description: 'No batteries, gears, or pedals required! Just wiggle the cute bunny steering wheel left and right and let centrifugal force glide your kid smoothly. Tested up to 65kg payload.',
    features: [
      'Polyurethane (PU) quiet glowing LED wheels that do not scratch indoor tiles',
      'Butterfly ergonomic steering wheel with soft animal face',
      'Anti-tip 5-wheel safety design preventing backward flips',
      'Wide contoured seat for ultimate seating stability'
    ],
    dimensions: '78 x 35 x 42 cm',
    image: 'https://images.unsplash.com/photo-1515488042361-ee00e0ddd4e4?auto=format&fit=crop&w=800&q=80',
    tags: ['swing car', 'twist car', 'bunny', 'no battery', 'magic car', 'safe'],
    safetyCertifications: ['BIS IS 9873 Certified', 'EN71 Approved'],
    material: 'BPA-Free High Density Polypropylene (PP)',
    bisCode: 'CM/L-8400192410',
    salesVelocityPerMonth: 140,
    predictedDemandNextMonth: 165,
    sentimentSummary: {
      positiveRatio: 0.97,
      topPraises: ['Super smooth on marble and hardwood', 'Kids ride it for hours', 'Indestructible'],
      topConcerns: ['Best on flat surfaces, slows down on thick rugs']
    }
  },

  // 4. SMART (Best Seller 4)
  {
    id: 'smart-04',
    name: 'SMART',
    category: 'Ride Ons',
    price: 2655,
    originalPrice: 3125,
    discountPercent: 15,
    rating: 4.7,
    reviewCount: 76,
    ageRange: '1 - 4 Years',
    maxWeightKg: 25,
    colors: ['Jet Black', 'Pearl White', 'Ruby Red'],
    inStock: true,
    stockCount: 22,
    isBestSeller: true,
    isTrending: false,
    isSpotlight: false,
    description: 'Versatile 3-in-1 growth vehicle: Stage 1 Stroller with parent push handle & safety armrest; Stage 2 Walker with high backrest; Stage 3 Independent foot-powered sports car with under-seat storage.',
    features: [
      '360° Removable protective safety guardrails',
      'Height-adjustable parental steering push bar',
      'Secret storage trunk beneath the seat for toys & snacks',
      'Multi-song musical steering horn'
    ],
    dimensions: '84 x 43 x 88 cm',
    image: 'https://images.unsplash.com/photo-1596461404969-9ae70f2830c1?auto=format&fit=crop&w=800&q=80',
    tags: ['push car', 'stroller', '3 in 1', 'smart', 'storage'],
    safetyCertifications: ['BIS Certified', 'ISO 9001'],
    material: 'Non-Toxic Food-Grade Plastic',
    bisCode: 'CM/L-8400192411',
    salesVelocityPerMonth: 65,
    predictedDemandNextMonth: 75,
    sentimentSummary: {
      positiveRatio: 0.91,
      topPraises: ['Great transition from stroller to ride-on', 'Push bar makes evening park walks easy'],
      topConcerns: ['Plastic wheels can be noisy on tarmac']
    }
  },

  // 5. NODDY (Best Seller 5 & Trending)
  {
    id: 'noddy-05',
    name: 'NODDY',
    category: 'Scooters',
    price: 2275,
    originalPrice: 2999,
    discountPercent: 24,
    rating: 4.8,
    reviewCount: 110,
    ageRange: '3 - 7 Years',
    maxWeightKg: 50,
    colors: ['Neon Orange', 'Sky Cyan', 'Candy Pink'],
    inStock: true,
    stockCount: 28,
    isBestSeller: true,
    isTrending: true,
    isSpotlight: false,
    description: 'Lightweight, ultra-portable kick scooter featuring battery-free flashing LED magnetic power wheels and a 1-second quick push button folding mechanism for easy storage.',
    features: [
      '3-Level adjustable T-bar height (62cm, 70cm, 78cm)',
      'Extra-wide anti-slip deck with reinforced nylon base',
      'Lean-to-steer intuitive balance mechanism',
      'Wide rear stainless steel foot brake for instant stopping'
    ],
    dimensions: '58 x 26 x 78 cm',
    image: 'https://images.unsplash.com/photo-1544620347-c4fd4a3d5957?auto=format&fit=crop&w=800&q=80',
    tags: ['scooter', 'kick scooter', 'noddy', 'led wheels', 'foldable', '24% off'],
    safetyCertifications: ['BIS IS 9873', 'EN71'],
    material: 'Aircraft Grade Aluminum & Fiber Composite',
    bisCode: 'CM/L-8400192412',
    salesVelocityPerMonth: 110,
    predictedDemandNextMonth: 135,
    sentimentSummary: {
      positiveRatio: 0.95,
      topPraises: ['Folds in a flash', 'LED wheels are very bright in the evening', 'Easy to carry'],
      topConcerns: ['Handle grips need occasional wiping']
    }
  },

  // 6. RANGER (Best Seller 6 & Trending)
  {
    id: 'ranger-06',
    name: 'RANGER',
    category: 'Scooters',
    price: 3038,
    originalPrice: 3999,
    discountPercent: 24,
    rating: 4.9,
    reviewCount: 88,
    ageRange: '5 - 12 Years',
    maxWeightKg: 75,
    colors: ['Stealth Matte Black', 'Gunmetal Grey', 'Electric Orange'],
    inStock: true,
    stockCount: 16,
    isBestSeller: true,
    isTrending: true,
    isSpotlight: false,
    description: 'Heavy-duty urban stunt and commute scooter built with 200mm high-rebound PU oversized wheels, dual suspension shock springs, and handlebar disc brake.',
    features: [
      'Dual suspension (front fork & rear deck spring)',
      'Handlebar cable disc brake + rear fender foot brake',
      'Aerospace aluminum alloy chassis rated up to 75kg',
      'Side kickstand & quick-release folding clamp'
    ],
    dimensions: '94 x 38 x 104 cm',
    image: 'https://images.unsplash.com/photo-1517649763962-0c623266ddc0?auto=format&fit=crop&w=800&q=80',
    tags: ['ranger', 'urban scooter', 'disc brake', 'adult and kids', 'suspension'],
    safetyCertifications: ['BIS Certified', 'CE EN14619'],
    material: 'Forged 6061 Aluminum Alloy',
    bisCode: 'CM/L-8400192413',
    salesVelocityPerMonth: 75,
    predictedDemandNextMonth: 90,
    sentimentSummary: {
      positiveRatio: 0.96,
      topPraises: ['Glides incredibly far on one kick', 'Disc brake feels very responsive'],
      topConcerns: ['Slightly heavier than standard plastic scooters']
    }
  },

  // 7. VICTOR (Best Seller 7)
  {
    id: 'victor-07',
    name: 'VICTOR',
    category: 'Trikes',
    price: 2595,
    originalPrice: 3050,
    discountPercent: 15,
    rating: 4.8,
    reviewCount: 64,
    ageRange: '1 - 4 Years',
    maxWeightKg: 30,
    colors: ['Peach Beige', 'Sky Blue', 'Pastel Coral'],
    inStock: true,
    stockCount: 19,
    isBestSeller: true,
    isTrending: false,
    isSpotlight: false,
    description: 'Premium baby tricycle with parent push handle, padded wrap-around safety barrier, foldable footrests, and front & rear storage baskets.',
    features: [
      'Parental steering control push rod with foam grip',
      'Removable cushioned seat cover with 3-point harness',
      'Dual storage: Front animal basket and deep rear toy carrier',
      'Wide EVA non-flat silent puncture-proof tires'
    ],
    dimensions: '75 x 46 x 95 cm',
    image: 'https://images.unsplash.com/photo-1572635196237-14b3f281503f?auto=format&fit=crop&w=800&q=80',
    tags: ['trike', 'victor', 'tricycle', 'push handle', 'canopy'],
    safetyCertifications: ['BIS IS 9873', 'ISO 9001'],
    material: 'Tubular Steel Frame & Non-Toxic PP Body',
    bisCode: 'CM/L-8400192414',
    salesVelocityPerMonth: 55,
    predictedDemandNextMonth: 65,
    sentimentSummary: {
      positiveRatio: 0.93,
      topPraises: ['Very easy for parents to push and steer', 'Comfortable seat for toddlers'],
      topConcerns: ['Basket holds small toys, not large bags']
    }
  },

  // 8. APACHE (Best Seller 8)
  {
    id: 'apache-08',
    name: 'APACHE',
    category: 'Trikes',
    price: 2210,
    originalPrice: 2600,
    discountPercent: 15,
    rating: 4.7,
    reviewCount: 52,
    ageRange: '1.5 - 5 Years',
    maxWeightKg: 35,
    colors: ['Camo Green', 'Desert Tan', 'Combat Grey'],
    inStock: true,
    stockCount: 24,
    isBestSeller: true,
    isTrending: false,
    isSpotlight: false,
    description: 'Tough military-styled adventure tricycle equipped with functional rear tipping dump bucket for hauling sandbox toys, rugged wide-tread wheels, and front splash mudguard.',
    features: [
      'Interactive dump bucket with handle release mechanism',
      'Ergonomic bucket seat with high back support',
      'Anti-skid pedals with textured safety grip',
      'Heavy-gauge powder-coated steel backbone frame'
    ],
    dimensions: '70 x 48 x 56 cm',
    image: 'https://images.unsplash.com/photo-1516627145497-ae6968895b74?auto=format&fit=crop&w=800&q=80',
    tags: ['apache', 'trike', 'camo', 'dump bucket', 'rugged'],
    safetyCertifications: ['BIS Certified IS 9873'],
    material: 'Heavy Gauge Structural Steel & Impact Copolymer',
    bisCode: 'CM/L-8400192415',
    salesVelocityPerMonth: 60,
    predictedDemandNextMonth: 70,
    sentimentSummary: {
      positiveRatio: 0.90,
      topPraises: ['Dump bucket is a huge hit at sandbox play', 'Virtually unbreakable frame'],
      topConcerns: ['Requires basic spanner for pedal assembly']
    }
  },

  // 9. GT EV (Trending EV Collection)
  {
    id: 'gt-ev-09',
    name: 'GT EV',
    category: 'EV',
    price: 3810,
    originalPrice: 4480,
    discountPercent: 15,
    rating: 4.9,
    reviewCount: 67,
    ageRange: '2 - 6 Years',
    batterySpec: '12V 4.5Ah Rechargeable with Parental Remote',
    maxWeightKg: 35,
    colors: ['Bronze Gold', 'Sonic Red', 'Diamond White'],
    inStock: true,
    stockCount: 12,
    isBestSeller: false,
    isTrending: true,
    isSpotlight: false,
    description: 'Sleek luxury sports supercar ride-on with upward butterfly scissor doors, LED dashboard lights, smooth start system, and built-in music player.',
    features: [
      'Hydraulic upward opening butterfly scissor doors',
      '2.4G Bluetooth parental remote control with emergency stop',
      'Four-wheel independent shock springs for smooth ride',
      'Integrated Bluetooth & USB stereo system'
    ],
    dimensions: '108 x 62 x 48 cm',
    image: 'https://images.unsplash.com/photo-1503376780353-7e6692767b70?auto=format&fit=crop&w=800&q=80',
    tags: ['gt ev', 'sports car', 'scissor doors', 'electric car', 'luxury'],
    safetyCertifications: ['BIS IS 9873', 'ISO 9001:2015'],
    material: 'High-Gloss Metallic Finish ABS Polymer',
    bisCode: 'CM/L-8400192416',
    salesVelocityPerMonth: 48,
    predictedDemandNextMonth: 65,
    sentimentSummary: {
      positiveRatio: 0.96,
      topPraises: ['Scissor doors look stunning', 'Great acceleration control'],
      topConcerns: ['Keep on paved paths for best speed']
    }
  },

  // 10. JEEP EV (Trending EV Collection)
  {
    id: 'jeep-ev-10',
    name: 'JEEP EV',
    category: 'EV',
    price: 3990,
    originalPrice: 4690,
    discountPercent: 15,
    rating: 4.8,
    reviewCount: 84,
    ageRange: '3 - 8 Years',
    batterySpec: '12V 7Ah Dual Motor 4x4 with Remote',
    maxWeightKg: 45,
    colors: ['Sahara Red', 'Off-road Yellow', 'Midnight Black'],
    inStock: true,
    stockCount: 15,
    isBestSeller: false,
    isTrending: true,
    isSpotlight: false,
    description: 'Heavy duty safari Jeep 4x4 with functioning overhead spotlight bar, working suspension, openable tailgate, and dual high-torque motors.',
    features: [
      'Dual 45W high-torque electric motors',
      'Working overhead roll-bar LED searchlights',
      'Rocking horse cradle simulation mode',
      'All-terrain knobby tires with deep treads'
    ],
    dimensions: '115 x 72 x 76 cm',
    image: 'https://images.unsplash.com/photo-1533473359331-0135ef1b58bf?auto=format&fit=crop&w=800&q=80',
    tags: ['jeep ev', '4x4', 'offroad', 'electric jeep', 'red'],
    safetyCertifications: ['BIS Certified', 'ISO 9001'],
    material: 'Heavy-Duty Reinforced Polymer',
    bisCode: 'CM/L-8400192417',
    salesVelocityPerMonth: 70,
    predictedDemandNextMonth: 85,
    sentimentSummary: {
      positiveRatio: 0.94,
      topPraises: ['Climbs small slopes easily', 'Overhead lights look realistic at dusk'],
      topConcerns: ['Assembly takes 25 minutes']
    }
  }
];

export const MOCK_REVIEWS: CustomerReview[] = [
  {
    id: 'rev-01',
    productId: 'ducatti-01',
    userName: 'Rohit Sharma (Bengaluru)',
    rating: 5,
    date: '12 Feb 2026',
    title: 'Best birthday gift for my 4-year-old!',
    comment: 'The quality of the DUCATTI bike is exceptional. The training wheels provide great stability, and the throttle handle feels very authentic. Battery easily lasts 90+ minutes of continuous riding around our society garden.',
    verifiedPurchase: true,
    sentimentScore: 0.96,
    aspects: {
      battery: 'positive',
      assembly: 'positive',
      durability: 'positive',
      safety: 'positive'
    }
  },
  {
    id: 'rev-02',
    productId: 'ducatti-01',
    userName: 'Priya Mehra (Delhi NCR)',
    rating: 5,
    date: '28 Jan 2026',
    title: 'Safe, stylish and very sturdy',
    comment: 'Very happy with the build material. No sharp edges, BIS mark is clearly stamped, and the LED lights are very bright in the evening.',
    verifiedPurchase: true,
    sentimentScore: 0.94,
    aspects: {
      battery: 'positive',
      assembly: 'positive',
      durability: 'positive',
      safety: 'positive'
    }
  },
  {
    id: 'rev-03',
    productId: 'humr-ev-02',
    userName: 'Amitav Sen (Kolkata)',
    rating: 5,
    date: '02 Feb 2026',
    title: 'Parent remote control is a lifesaver!',
    comment: 'The 2.4G remote has great range and instant emergency stop button. Wheels tackle our lawn grass easily without getting stuck.',
    verifiedPurchase: true,
    sentimentScore: 0.92,
    aspects: {
      battery: 'positive',
      assembly: 'neutral',
      durability: 'positive',
      safety: 'positive'
    }
  }
];

export const MOCK_FORECASTS: MLForecastData[] = [
  {
    sku: 'SKU-DUC-01',
    productName: 'DUCATTI Superbike',
    historicalMonthly: [
      { month: 'Sep', units: 410 },
      { month: 'Oct', units: 890 },
      { month: 'Nov', units: 620 },
      { month: 'Dec', units: 780 },
      { month: 'Jan', units: 450 },
      { month: 'Feb', units: 520 }
    ],
    predictedNext3Months: [
      { month: 'Mar', predictedUnits: 580, lowerBound: 520, upperBound: 640 },
      { month: 'Apr', predictedUnits: 710, lowerBound: 630, upperBound: 790 },
      { month: 'May', predictedUnits: 840, lowerBound: 760, upperBound: 920 }
    ],
    seasonalFactor: 'High Summer Holiday Surge',
    reorderAlert: false,
    recommendedSafetyStock: 85
  },
  {
    sku: 'SKU-HUMR-02',
    productName: 'HUMR EV 4x4 Off-Roader',
    historicalMonthly: [
      { month: 'Sep', units: 320 },
      { month: 'Oct', units: 640 },
      { month: 'Nov', units: 450 },
      { month: 'Dec', units: 510 },
      { month: 'Jan', units: 380 },
      { month: 'Feb', units: 420 }
    ],
    predictedNext3Months: [
      { month: 'Mar', predictedUnits: 460, lowerBound: 400, upperBound: 520 },
      { month: 'Apr', predictedUnits: 530, lowerBound: 470, upperBound: 590 },
      { month: 'May', predictedUnits: 620, lowerBound: 540, upperBound: 700 }
    ],
    seasonalFactor: 'Moderate Q2 Outdoor Growth',
    reorderAlert: true,
    recommendedSafetyStock: 60
  }
];

export const MOCK_RFM_SEGMENTS: RFMCustomerSegment[] = [
  {
    segmentName: 'Champions',
    description: 'High frequency & highest lifetime value toy buyers across Delhi, Mumbai & Bengaluru.',
    customerPercentage: 22,
    averageOrderValue: 7450,
    recommendedAction: 'VIP early access to new 2026 EV models & complimentary birthday packaging',
    suggestedPromotion: 'Flat ₹500 off on 12V Superbike range'
  },
  {
    segmentName: 'Loyal Customers',
    description: 'Repeat parents upgrading from baby walkers to kick scooters and tricycles.',
    customerPercentage: 35,
    averageOrderValue: 4200,
    recommendedAction: 'Bundle discounts (Trike + Protective Gear Set)',
    suggestedPromotion: '15% off cart on 2+ products'
  },
  {
    segmentName: 'Potential Loyalists',
    description: 'Recent first-time buyers with positive review sentiment.',
    customerPercentage: 28,
    averageOrderValue: 2600,
    recommendedAction: 'Automated 14-day warranty registration & review prompt',
    suggestedPromotion: '₹250 reward credit towards next purchase'
  },
  {
    segmentName: 'At Risk',
    description: 'Dormant accounts with no purchases in the last 180 days.',
    customerPercentage: 15,
    averageOrderValue: 3100,
    recommendedAction: 'Targeted seasonal festive WhatsApp & SMS campaign',
    suggestedPromotion: 'Free shipping + 10% instant rebate'
  }
];

export const MOCK_PRICING_INSIGHTS: DynamicPricingInsight[] = [
  {
    sku: 'SKU-DUC-01',
    productName: 'DUCATTI Superbike Ride-on',
    currentPrice: 5630,
    costPrice: 3800,
    currentInventory: 18,
    daysOfInventory: 14,
    elasticityCoefficient: -0.82,
    recommendedDiscount: 15,
    projectedRevenueLiftPercent: 12.4,
    rationale: 'High search volume with low return rate. Inelastic demand supports current ₹5,630 pricing.'
  }
];
