/**
 * TEVEN default content.
 * This is the bundled fallback. When a Sanity project is configured, the
 * same shapes are fetched from the CMS (see composables/useContent.ts and
 * /sanity/schemas) and override these values.
 */
import type { ImageKey } from './images'

export interface NavLink { label: string; to: string }
export interface NavGroup { label: string; to: string; children?: NavLink[]; cards?: { title: string; text: string; to: string; image: ImageKey }[] }

/* ------------------------------------------------------------------ */
/* Navigation                                                          */
/* ------------------------------------------------------------------ */
export const navLeft: NavGroup[] = [
  {
    label: 'Our Heritage',
    to: '/our-heritage',
    children: [
      { label: 'Our Heritage', to: '/our-heritage' },
      { label: 'About TEVEN', to: '/about' },
      { label: 'Tea Origins', to: '/origins' }
    ],
    cards: [
      { title: 'Our Heritage', text: 'Generations of tea-growing tradition.', to: '/our-heritage', image: 'farmerBaskets' },
      { title: 'Tea Origins', text: 'Ten gardens, ten characters.', to: '/origins', image: 'sriLankaSlope' }
    ]
  },
  {
    label: 'Tea Culture',
    to: '/tea-journey',
    children: [
      { label: 'The Journey of Tea', to: '/tea-journey' },
      { label: 'Tea Discovery Centre', to: '/tea-discovery-centre' },
      { label: 'Tea Craft Academy', to: '/tea-craft-academy' }
    ],
    cards: [
      { title: 'Tea Discovery Centre', text: 'Origins, varieties and traditions.', to: '/tea-discovery-centre', image: 'teaSetWindow' },
      { title: 'Tea Craft Academy', text: 'The art of brewing and tasting.', to: '/tea-craft-academy', image: 'pourHotWater' }
    ]
  },
  { label: 'Products', to: '/products' }
]

export const navRight: NavGroup[] = [
  { label: 'Sustainability', to: '/sustainability' },
  { label: 'Journal', to: '/journal' },
  { label: 'Tea Quiz', to: '/quiz' }
]

export const languages = [
  { code: 'en', label: 'English' },
  { code: 'fr', label: 'Français' },
  { code: 'ja', label: '日本語' }
]

/* ------------------------------------------------------------------ */
/* Hero — featured stories carousel (Sections 02 + 04)                 */
/* ------------------------------------------------------------------ */
export const heroSlides = [
  {
    id: 'world',
    thumbTitle: 'The World of TEVEN',
    title: ['TEVEN, the', 'art of tea.'],
    text: 'Every leaf carries a story. Discover the origins, craftsmanship, and rituals behind exceptional tea.',
    cta: { label: 'About TEVEN', to: '/about' },
    image: 'munnarMist' as ImageKey,
    thumb: 'munnarMist' as ImageKey
  },
  {
    id: 'origins',
    thumbTitle: 'The Origins of Exceptional Tea',
    title: ['The origins of', 'exceptional tea.'],
    text: 'From misty Himalayan slopes to Japanese hillsides, every garden shapes the leaf it grows.',
    cta: { label: 'Tea Origins', to: '/origins' },
    image: 'harvestBaskets' as ImageKey,
    thumb: 'harvestBaskets' as ImageKey
  },
  {
    id: 'tradition',
    thumbTitle: 'A Tradition in Every Cup',
    title: ['A tradition', 'in every cup.'],
    text: 'Rituals passed from hand to hand, carried into the modern cup with patience and care.',
    cta: { label: 'Tea Culture', to: '/tea-journey' },
    image: 'glassCeremony' as ImageKey,
    thumb: 'glassCeremony' as ImageKey
  }
]

/* Hero card cluster (Section 03 — brand storytelling lives in the wide card) */
export const heroCards = {
  productsLabel: 'Products',
  product: { title: 'Japanese Sencha', to: '/products/japanese-sencha', slug: 'japanese-sencha' },
  feature: { title: 'TEVEN Tea Journal — stories brewed around the world', to: '/journal', image: 'cupsAndLeaves' as ImageKey },
  story: {
    title: 'Rooted in nature. Crafted with care.',
    text: 'From carefully selected tea gardens to the perfect cup, TEVEN celebrates the people, places, and traditions that make every tea experience special.',
    to: '/our-heritage',
    image: 'woodenBowlLeaves' as ImageKey
  }
}

/* ------------------------------------------------------------------ */
/* Products (Section 05)                                               */
/* ------------------------------------------------------------------ */
export interface Product {
  slug: string
  name: string
  origin: string
  notes: string
  description: string
  color: string
  accent: string
  ink: string
  caffeine: 'high' | 'medium' | 'low' | 'none'
  image: ImageKey
}

export const products: Product[] = [
  { slug: 'sreemangal-estate', name: 'Sreemangal Estate', origin: 'Sreemangal, Bangladesh', notes: 'Bright · Malty · Honeyed', description: 'Hand-plucked two leaves and a bud from the shaded tea gardens of Sreemangal, the tea capital of Bangladesh — a bright, golden black tea with gentle malt and a honeyed finish.', color: '#2f5a46', accent: '#d8e6bf', ink: '#f6f0e4', caffeine: 'high', image: 'sreemangalPicker' },
  { slug: 'english-breakfast', name: 'English Breakfast', origin: 'Assam & Ceylon', notes: 'Malty · Bold · Brisk', description: 'A full-bodied morning blend of Assam and high-grown Ceylon leaves, rich enough to take milk and bright enough to drink without.', color: '#6d3b2a', accent: '#e8c9a0', ink: '#f6f0e4', caffeine: 'high', image: 'teapotPour' },
  { slug: 'earl-grey', name: 'Earl Grey', origin: 'Ceylon & Calabria', notes: 'Bergamot · Citrus · Floral', description: 'Long-leaf Ceylon black tea scented with cold-pressed Calabrian bergamot for a luminous, perfumed cup.', color: '#3b4a63', accent: '#c9d3e3', ink: '#f6f0e4', caffeine: 'high', image: 'teaSetTray' },
  { slug: 'japanese-sencha', name: 'Japanese Sencha', origin: 'Shizuoka, Japan', notes: 'Grassy · Umami · Marine', description: 'First-flush steamed green tea from the slopes of Shizuoka, vivid green with a clean, savoury sweetness.', color: '#4f6b34', accent: '#d9e6b5', ink: '#f6f0e4', caffeine: 'medium', image: 'japanHedges' },
  { slug: 'white-peony', name: 'White Peony', origin: 'Fujian, China', notes: 'Honeyed · Floral · Delicate', description: 'Bai Mu Dan — silver buds and young leaves, gently withered in the sun for a soft, honeyed cup.', color: '#d8c7a8', accent: '#7a6440', ink: '#2a1d15', caffeine: 'low', image: 'glassTeapots' },
  { slug: 'moroccan-mint', name: 'Moroccan Mint', origin: 'Gunpowder & Nana Mint', notes: 'Cooling · Sweet · Fresh', description: 'Chinese gunpowder green tea blended with Moroccan nana spearmint, made for the generous pour.', color: '#2c6656', accent: '#bfe0cf', ink: '#f6f0e4', caffeine: 'medium', image: 'mintGlasses' },
  { slug: 'chamomile-blend', name: 'Chamomile Blend', origin: 'Egypt', notes: 'Golden · Apple · Calm', description: 'Whole Egyptian chamomile flowers with lemon balm and a touch of lavender — a quiet evening cup.', color: '#c39a3a', accent: '#f6e2a8', ink: '#2a1d15', caffeine: 'none', image: 'glassTeapotGarden' },
  { slug: 'himalayan-green', name: 'Himalayan Green', origin: 'Ilam, Nepal', notes: 'Vegetal · Nutty · Crisp', description: 'High-altitude green tea from Nepal\'s eastern hills, crisp and nutty with a long, clean finish.', color: '#3f5a3a', accent: '#c7d8b8', ink: '#f6f0e4', caffeine: 'medium', image: 'sriLankaSlope' },
  { slug: 'signature-herbal', name: 'Signature Herbal', origin: 'TEVEN Botanicals', notes: 'Hibiscus · Rosehip · Spice', description: 'Our house infusion of hibiscus, rosehip, ginger and cinnamon — deep ruby and caffeine free.', color: '#7a3e55', accent: '#efc2d0', ink: '#f6f0e4', caffeine: 'none', image: 'gardenSpices' },
  { slug: 'organic-collection', name: 'Organic Collection', origin: 'Certified Gardens', notes: 'Discovery · Six Teas', description: 'Six certified-organic teas from our partner gardens, curated as a journey across origins.', color: '#8a7150', accent: '#efe0c4', ink: '#f6f0e4', caffeine: 'medium', image: 'spoonsLooseLeaf' }
]

/* ------------------------------------------------------------------ */
/* Heritage (Section 06)                                               */
/* ------------------------------------------------------------------ */
export const heritage = {
  titleLines: ['Every leaf', '*tells a* story'],
  cta: { label: 'Our Heritage', to: '/our-heritage' },
  text: 'TEVEN brings together generations of tea-growing traditions, carefully selected ingredients, and a passion for creating exceptional tea experiences.',
  center: { image: '/images/heritage/center-picker.webp', caption: 'Rooted in nature. Crafted with care.' },
  orbit: [
    { image: '/images/heritage/pickers-baskets.webp', caption: 'Pickers returning from the morning harvest.' },
    { image: '/images/heritage/glass-pour.webp', caption: 'A fresh pour, overlooking the garden it came from.' },
    { image: '/images/heritage/estate-hills.webp', caption: 'Morning mist over the estate hills.' },
    { image: '/images/heritage/clay-teapot.webp', caption: 'Traditional clay for traditional brews.' },
    { image: '/images/heritage/grower.webp', caption: 'Generations of growers behind every leaf.' },
    { image: '/images/heritage/leaf-basket.webp', caption: 'Two leaves and a bud, picked by hand.' },
    { image: '/images/heritage/withering.webp', caption: 'Fresh leaf spread to wither in the TEVEN house.' },
    { image: '/images/heritage/rolling.webp', caption: 'Shaping the leaf, the craft that gives it character.' }
  ]
}

/* ------------------------------------------------------------------ */
/* Journey of tea (Section 07)                                         */
/* ------------------------------------------------------------------ */
export const journey = {
  titleLines: ['The journey', '*of* tea'],
  image: '/images/heritage/journey-field.webp' as ImageKey,
  intro: 'Tea begins at its origin, is picked by hand, shaped by craft and finds its fullest expression in the cup.',
  cta: { label: 'The Tea Journey', to: '/tea-journey' },
  stages: [
    { id: 'origins', num: '01', label: 'Origins', text: 'Every exceptional tea begins with its origin. Discover the gardens, climates, and landscapes that shape every leaf.' },
    { id: 'harvest', num: '02', label: 'Harvest', text: 'Carefully selected leaves are harvested at the right moment to preserve their natural character.' },
    { id: 'craft', num: '03', label: 'Craft', text: 'Through traditional expertise and thoughtful processing, every tea develops its own unique personality.' },
    { id: 'tasting', num: '04', label: 'Tasting', text: 'From delicate floral notes to rich, earthy flavors, discover the art of experiencing tea.' }
  ]
}

/* ------------------------------------------------------------------ */
/* Tea culture magazine marquee (Section 08)                            */
/* ------------------------------------------------------------------ */
export const magazine = {
  titleLines: ['Stories *brewed*', 'around the world'],
  text: 'Explore the people, traditions, ingredients, and places that shape the world of tea.',
  cta: { label: 'TEVEN Tea Journal', to: '/journal' },
  rowA: [
    { image: 'kimonoCeremony', caption: 'Tea ceremonies' },
    { image: 'harvestWomen', caption: 'Growing communities' },
    { image: 'mintGlasses', caption: 'Morocco' },
    { image: 'teaSetWindow', caption: 'Modern rituals' },
    { image: 'sreemangalPicker', caption: 'Sreemangal' },
    { image: 'harvestWorker', caption: 'The harvest' },
    { image: 'ceramicCups', caption: 'Craftsmanship' },
    { image: 'japanTree', caption: 'Shizuoka' },
    { image: 'floralPour', caption: 'Traditional preparation' },
    { image: 'traditionalShop', caption: 'Tea houses' },
    { image: 'leafCluster', caption: 'The leaf' }
  ] as { image: ImageKey; caption: string }[],
  rowB: [
    { image: 'pourHotWater', caption: 'The pour' },
    { image: 'farmerBaskets', caption: 'Growers' },
    { image: 'glassCeremony', caption: 'Gongfu cha' },
    { image: 'sreemangalGarden', caption: 'Bangladesh' },
    { image: 'plantationHills', caption: 'Gardens' },
    { image: 'teapotWindow', caption: 'Slow mornings' },
    { image: 'spoonsLooseLeaf', caption: 'Blending' },
    { image: 'harvestJapan', caption: 'Japan' },
    { image: 'cupGreenLeaves', caption: 'Green tea' },
    { image: 'shopShelves', caption: 'The tea shop' },
    { image: 'woodenBowlLeaves', caption: 'Withering' }
  ] as { image: ImageKey; caption: string }[]
}

/* ------------------------------------------------------------------ */
/* Tea culture experiences (Section 09)                                 */
/* ------------------------------------------------------------------ */
export const culture = {
  title: 'The Culture of Tea',
  text: 'The rituals, traditions, and craft of tea form a living heritage shared by millions around the world. At the Tea Discovery Centre and the Tea Craft Academy, we celebrate, share, and interpret this culture — bringing together botany, emotion, and the art of preparation to safeguard the future of tea.',
  items: [
    { title: 'Tea Discovery Centre', cta: { label: 'Explore', to: '/tea-discovery-centre' }, image: 'teaSetWindow' as ImageKey, text: 'Explore the origins, varieties, ingredients, and traditions behind premium tea. An immersive space where questions find answers and every leaf reveals its story.' },
    { title: 'Tea Craft Academy', cta: { label: 'Explore', to: '/tea-craft-academy' }, image: 'pourHotWater' as ImageKey, text: 'Discover the art of tea preparation, brewing techniques, tasting, and professional tea craftsmanship — taught by our specialists, from first steep to final sip.' }
  ]
}

/* ------------------------------------------------------------------ */
/* Origins (Section 10)                                                 */
/* ------------------------------------------------------------------ */
export const origins = [
  { slug: 'japan', product: 'japanese-sencha', country: 'Japan', tea: 'Sencha', color: '#4f6b34', image: 'japanHedges' as ImageKey },
  { slug: 'china', product: 'white-peony', country: 'China', tea: 'White Peony', color: '#b8a27c', image: 'glassCeremony' as ImageKey },
  { slug: 'india', product: 'english-breakfast', country: 'India', tea: 'Assam', color: '#6d3b2a', image: 'munnarMist' as ImageKey },
  { slug: 'sri-lanka', product: 'earl-grey', country: 'Sri Lanka', tea: 'Ceylon', color: '#3b4a63', image: 'sriLankaSlope' as ImageKey },
  { slug: 'nepal', product: 'himalayan-green', country: 'Nepal', tea: 'Himalayan', color: '#3f5a3a', image: 'plantationHills' as ImageKey },
  { slug: 'morocco', product: 'moroccan-mint', country: 'Morocco', tea: 'Nana Mint', color: '#2c6656', image: 'mintGlasses' as ImageKey },
  { slug: 'taiwan', product: 'organic-collection', country: 'Taiwan', tea: 'Oolong', color: '#7a5a2c', image: 'teapotTable' as ImageKey },
  { slug: 'kenya', product: 'signature-herbal', country: 'Kenya', tea: 'Highland', color: '#8a3f2b', image: 'harvestBaskets' as ImageKey },
  { slug: 'bangladesh', product: 'sreemangal-estate', country: 'Bangladesh', tea: 'Sreemangal', color: '#2f5a46', image: 'sreemangalGarden' as ImageKey },
  { slug: 'vietnam', product: 'chamomile-blend', country: 'Vietnam', tea: 'Lotus', color: '#7a3e55', image: 'harvestWorker' as ImageKey }
]

/* ------------------------------------------------------------------ */
/* Quiz (Section 11)                                                    */
/* ------------------------------------------------------------------ */
export const quizIntro = {
  label: 'TEVEN Quiz',
  title: 'Discover your perfect cup.',
  text: 'From delicate and floral to bold and full-bodied, discover the tea that matches your taste.',
  cta: 'Discover Your Tea'
}

type Scores = Partial<Record<string, number>>
export interface QuizQuestion { id: string; question: string; options: { label: string; hint: string; scores: Scores }[] }

export const quizQuestions: QuizQuestion[] = [
  {
    id: 'flavor',
    question: 'Which flavours draw you in?',
    options: [
      { label: 'Floral & delicate', hint: 'Blossoms, honey, soft sweetness', scores: { 'white-peony': 3, 'earl-grey': 1, 'chamomile-blend': 1 } },
      { label: 'Fresh & grassy', hint: 'Green, vegetal, savoury', scores: { 'japanese-sencha': 3, 'himalayan-green': 2, 'moroccan-mint': 1 } },
      { label: 'Rich & malty', hint: 'Toasty, deep, comforting', scores: { 'sreemangal-estate': 3, 'english-breakfast': 3, 'earl-grey': 1, 'organic-collection': 1 } },
      { label: 'Fruity & spiced', hint: 'Berries, citrus, warm spice', scores: { 'signature-herbal': 3, 'earl-grey': 2 } }
    ]
  },
  {
    id: 'intensity',
    question: 'How intense do you like your cup?',
    options: [
      { label: 'Gentle', hint: 'Light and soothing', scores: { 'white-peony': 2, 'chamomile-blend': 2 } },
      { label: 'Balanced', hint: 'Present but smooth', scores: { 'japanese-sencha': 2, 'himalayan-green': 2, 'moroccan-mint': 1, 'organic-collection': 1 } },
      { label: 'Bold', hint: 'Full-bodied and brisk', scores: { 'sreemangal-estate': 2, 'english-breakfast': 3, 'earl-grey': 2 } }
    ]
  },
  {
    id: 'caffeine',
    question: 'How much caffeine do you want?',
    options: [
      { label: 'A real lift', hint: 'Wake me up', scores: { 'english-breakfast': 2, 'earl-grey': 2 } },
      { label: 'A little', hint: 'Steady focus', scores: { 'japanese-sencha': 2, 'himalayan-green': 2, 'moroccan-mint': 2, 'white-peony': 1, 'organic-collection': 1 } },
      { label: 'None at all', hint: 'Caffeine free', scores: { 'chamomile-blend': 3, 'signature-herbal': 3 } }
    ]
  },
  {
    id: 'occasion',
    question: 'When will you enjoy it most?',
    options: [
      { label: 'Morning ritual', hint: 'To start the day', scores: { 'sreemangal-estate': 2, 'english-breakfast': 2, 'earl-grey': 1, 'japanese-sencha': 1 } },
      { label: 'Afternoon pause', hint: 'A moment to slow down', scores: { 'white-peony': 2, 'earl-grey': 1, 'moroccan-mint': 2 } },
      { label: 'After a meal', hint: 'Fresh and digestive', scores: { 'moroccan-mint': 2, 'himalayan-green': 2, 'japanese-sencha': 1 } },
      { label: 'Evening unwind', hint: 'Calm before rest', scores: { 'chamomile-blend': 3, 'signature-herbal': 2 } }
    ]
  }
]

/* ------------------------------------------------------------------ */
/* Journal (Section 12)                                                 */
/* ------------------------------------------------------------------ */
export const journalCategories = ['Tea Stories', 'Origins & Gardens', 'Brewing Guides', 'Tea Culture', 'Sustainability'] as const
export type JournalCategory = typeof journalCategories[number]

export interface Article { slug: string; title: string; category: JournalCategory; date: string; image: ImageKey; excerpt: string }

export const journalIntro = {
  title: 'Explore the world of tea.',
  subtitle: 'Stories of people, culture, and places through the lens of tea.',
  cta: { label: 'Explore', to: '/journal' }
}

export const articles: Article[] = [
  { slug: 'two-leaves-and-a-bud-in-sreemangal', title: 'Two leaves and a bud: a morning in the tea gardens of Sreemangal', category: 'Origins & Gardens', date: '2026-06-03', image: 'sreemangalPicker', excerpt: 'Shade trees, rolling hills and the pluckers who make Sreemangal the tea capital of Bangladesh.' },
  { slug: 'first-flush-in-shizuoka', title: 'First flush in Shizuoka: the week the hills turn bright green', category: 'Origins & Gardens', date: '2026-05-12', image: 'harvestJapan', excerpt: 'We spent the first harvest week with the growers who supply our Japanese Sencha.' },
  { slug: 'how-to-brew-white-tea', title: 'How to brew white tea: cooler water, longer patience', category: 'Brewing Guides', date: '2026-04-02', image: 'glassTeapots', excerpt: 'Temperature, timing and leaf ratio for a honeyed cup of White Peony.' },
  { slug: 'the-art-of-the-moroccan-pour', title: 'The art of the Moroccan pour, explained', category: 'Tea Culture', date: '2026-03-18', image: 'mintGlasses', excerpt: 'Why mint tea is poured from a height — and three times over.' },
  { slug: 'women-of-the-ilam-hills', title: 'The women of the Ilam hills', category: 'Tea Stories', date: '2026-02-21', image: 'harvestWomen', excerpt: 'Portraits from the Himalayan Green cooperative in eastern Nepal.' },
  { slug: 'compostable-by-2027', title: 'Our packaging promise: fully compostable by 2027', category: 'Sustainability', date: '2026-01-30', image: 'gardenSpices', excerpt: 'Plant-based pouches, recycled tins and what comes next.' },
  { slug: 'a-morning-in-a-ceylon-garden', title: 'A morning in a high-grown Ceylon garden', category: 'Origins & Gardens', date: '2025-12-09', image: 'sriLankaSlope', excerpt: 'Mist, altitude and the bright character of our Earl Grey base.' },
  { slug: 'tea-ceremony-for-beginners', title: 'A tea ceremony for beginners', category: 'Tea Culture', date: '2025-11-14', image: 'kimonoCeremony', excerpt: 'Five gestures that turn a cup into a ritual.' }
]

/* ------------------------------------------------------------------ */
/* Sustainability (Section 13)                                          */
/* ------------------------------------------------------------------ */
export const sustainability = {
  label: 'Sustainability',
  titleLines: ['Better choices.', '*a more* sustainable', 'future'],
  text: 'From responsible sourcing to thoughtful production, TEVEN believes exceptional tea should respect the people and places behind every leaf.',
  cta: { label: 'Sustainability', to: '/sustainability' },
  pillars: ['Sustainable tea farming', 'Responsible sourcing', 'Environmental awareness', 'Packaging responsibility', 'Tea-growing communities'],
  imageLeft: 'harvestWomen' as ImageKey,
  imageRight: 'teaRows' as ImageKey
}

/* ------------------------------------------------------------------ */
/* Final featured story (Section 14)                                    */
/* ------------------------------------------------------------------ */
export const finalFeature = {
  label: 'The World of TEVEN',
  titleLines: ['Discover *the*', 'world *of* TEVEN'],
  cta: { label: 'Explore Our Story', to: '/our-heritage' },
  image: '/images/heritage/world-of-teven.webp' as ImageKey
}

/* ------------------------------------------------------------------ */
/* Footer (Section 15)                                                  */
/* ------------------------------------------------------------------ */
export const footer = {
  columns: [
    { title: 'TEVEN', links: [{ label: 'Our Heritage', to: '/our-heritage' }, { label: 'About TEVEN', to: '/about' }, { label: 'Tea Origins', to: '/origins' }] },
    { title: 'Tea Culture', links: [{ label: 'Tea Journey', to: '/tea-journey' }, { label: 'Tea Discovery Centre', to: '/tea-discovery-centre' }, { label: 'Tea Craft Academy', to: '/tea-craft-academy' }] }
  ],
  main: [
    { label: 'Products', to: '/products' },
    { label: 'Sustainability', to: '/sustainability' },
    { label: 'Journal', to: '/journal' },
    { label: 'Tea Discovery Quiz', to: '/quiz' }
  ],
  extra: [
    { label: 'Contact', to: '/contact' },
    { label: 'Privacy Policy', to: '/privacy-policy' },
    { label: 'Terms & Conditions', to: '/terms-and-conditions' }
  ],
  contact: [
    { label: 'Email', value: 'hello@teven.tea', href: 'mailto:hello@teven.tea' },
    { label: 'Customer care', value: '+44 20 0000 0000', href: 'tel:+442000000000' }
  ],
  social: [
    { label: 'Instagram', href: 'https://instagram.com', icon: 'instagram' },
    { label: 'Facebook', href: 'https://facebook.com', icon: 'facebook' },
    { label: 'YouTube', href: 'https://youtube.com', icon: 'youtube' },
    { label: 'LinkedIn', href: 'https://linkedin.com', icon: 'linkedin' }
  ],
  copyright: '© 2026 TEVEN. All rights reserved.'
}
