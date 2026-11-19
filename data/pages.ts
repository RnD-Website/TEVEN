/**
 * Inner-page content map. Every navigation/footer link resolves to an
 * entry here (or to a product / origin / article), so all links work.
 */
import type { ImageKey } from './images'
import { products, origins, articles } from './site'
import { hasProductPhoto } from './mockups'

export interface PageEntry {
  title: string
  eyebrow: string
  intro: string
  image: ImageKey | string
  body: string[]
  grid?: { title: string; text: string; to: string; image?: ImageKey | string; pouch?: { slug: string; color: string; accent: string; ink: string; sub: string } }[]
  cta?: { label: string; to: string }
  quiz?: boolean
}

const staticPages: Record<string, PageEntry> = {
  'our-heritage': {
    eyebrow: 'Our Heritage',
    title: 'Every leaf tells a story',
    intro: 'TEVEN brings together generations of tea-growing traditions, carefully selected ingredients, and a passion for creating exceptional tea experiences.',
    image: 'harvestBaskets',
    body: [
      'Our story begins in the gardens — with the growers, pickers and tea masters whose knowledge is passed from one generation to the next.',
      'We work directly with family estates and cooperatives across ten origins, from Shizuoka to Sreemangal, choosing leaves for character rather than volume, and paying for the care that goes into every harvest.',
      'From carefully selected tea gardens to the perfect cup, TEVEN celebrates the people, places, and traditions that make every tea experience special.'
    ],
    cta: { label: 'Tea Origins', to: '/origins' }
  },
  about: {
    eyebrow: 'About TEVEN',
    title: 'Rooted in nature. Crafted with care.',
    intro: 'TEVEN is a premium tea company celebrating the art of tea, natural ingredients, tea origins, traditional craftsmanship, and modern tea culture.',
    image: 'woodenBowlLeaves',
    body: [
      'We believe great tea is quiet luxury: honest ingredients, patient craft and a ritual worth slowing down for.',
      'Every TEVEN tea is selected by our tasting team, blended in small batches and packed to protect its freshness and aroma.',
      'Premium, authentic, natural, sophisticated, cultural, contemporary and timeless — these are the values that guide every cup.'
    ],
    cta: { label: 'Discover our teas', to: '/products' }
  },
  'tea-journey': {
    eyebrow: 'Tea Culture',
    title: 'The journey of tea',
    intro: 'Tea begins at its origin, is picked by hand, shaped by craft and finds its fullest expression in the cup.',
    image: 'harvestWorker2',
    body: [
      'Origins — Every exceptional tea begins with its origin. Discover the gardens, climates, and landscapes that shape every leaf.',
      'Harvest — Carefully selected leaves are harvested at the right moment to preserve their natural character.',
      'Craft — Through traditional expertise and thoughtful processing, every tea develops its own unique personality.',
      'Tasting — From delicate floral notes to rich, earthy flavors, discover the art of experiencing tea.'
    ],
    cta: { label: 'Tea Discovery Centre', to: '/tea-discovery-centre' }
  },
  'tea-discovery-centre': {
    eyebrow: 'Tea Culture',
    title: 'Tea Discovery Centre',
    intro: 'Explore the origins, varieties, ingredients, and traditions behind premium tea.',
    image: 'teaSetWindow',
    body: [
      'An immersive space where the universe of tea is revealed through tastings, botanical exhibits and interactive stations.',
      'Follow the leaf from garden to cup, compare six tea families side by side, and meet the growers through film and photography.',
      'Guided visits run daily; private sessions are available for groups and schools.'
    ],
    cta: { label: 'Tea Craft Academy', to: '/tea-craft-academy' }
  },
  'tea-craft-academy': {
    eyebrow: 'Tea Culture',
    title: 'Tea Craft Academy',
    intro: 'Discover the art of tea preparation, brewing techniques, tasting, and professional tea craftsmanship.',
    image: 'pourHotWater',
    body: [
      'Our specialists teach everything from the fundamentals of water, time and temperature to gongfu brewing and professional cupping.',
      'Courses are offered for enthusiasts, hospitality teams and aspiring tea sommeliers.',
      'Every class begins with the leaf and ends with the cup — and a deeper understanding of both.'
    ],
    cta: { label: 'Discover your perfect cup', to: '/quiz' }
  },
  sustainability: {
    eyebrow: 'Sustainability',
    title: 'Better choices. A more sustainable future.',
    intro: 'From responsible sourcing to thoughtful production, TEVEN believes exceptional tea should respect the people and places behind every leaf.',
    image: 'teaRows',
    body: [
      'Sustainable tea farming — we partner with gardens that protect soil health, biodiversity and water.',
      'Responsible sourcing — fair, long-term contracts and full traceability back to each estate.',
      'Environmental awareness — measuring and reducing the footprint of every step from garden to cup.',
      'Packaging responsibility — plant-based pouches and recycled tins, fully compostable by 2027.',
      'Tea-growing communities — investing in education, healthcare and fair pay where our tea is grown.'
    ],
    cta: { label: 'Read the journal', to: '/journal' }
  },
  contact: {
    eyebrow: 'Contact',
    title: 'Let’s talk tea',
    intro: 'Questions about an order, wholesale or the Academy? We would love to hear from you.',
    image: 'traditionalShop',
    body: ['Email: hello@teven.tea', 'Customer care: +44 20 0000 0000 (Mon–Fri, 9:00–17:00)', 'Press & partnerships: press@teven.tea']
  },
  'privacy-policy': {
    eyebrow: 'Legal',
    title: 'Privacy Policy',
    intro: 'How TEVEN collects, uses and protects your personal data.',
    image: 'leafCluster',
    body: ['This placeholder policy should be replaced with your legally reviewed privacy policy before launch.', 'It should describe the data controller, data collected, purposes, legal bases, retention, international transfers and your rights.']
  },
  'terms-and-conditions': {
    eyebrow: 'Legal',
    title: 'Terms & Conditions',
    intro: 'The terms that apply when you use this website.',
    image: 'leafCluster',
    body: ['This placeholder should be replaced with your legally reviewed terms and conditions before launch.']
  },
  'cookie-policy': {
    eyebrow: 'Legal',
    title: 'Cookie Policy',
    intro: 'Which cookies we use and how you can control them.',
    image: 'leafCluster',
    body: [
      'Necessary cookies keep the site working and remember your consent choice.',
      'Analytics cookies (Google Analytics 4, Google Tag Manager, Hotjar, Umami) are only set after you accept them.',
      'Marketing cookies are only set after you accept them. You can change your choice at any time via “Cookie settings” in the footer.'
    ]
  },
  quiz: {
    eyebrow: 'TEVEN Quiz',
    title: 'Discover your perfect cup.',
    intro: 'From delicate and floral to bold and full-bodied, discover the tea that matches your taste.',
    image: 'cupsAndLeaves',
    body: ['Four quick questions about flavour, intensity, caffeine and occasion — and a personalised recommendation from our collection.'],
    quiz: true
  }
}

export function resolvePage(slug: string[]): PageEntry | null {
  const [first, second] = slug
  if (!first) return null

  if (first === 'products' && !second) {
    return {
      eyebrow: 'Products',
      title: 'The TEVEN collection',
      intro: 'Ten teas, each chosen for character — from bold morning blends to delicate whites and caffeine-free infusions.',
      image: '/images/products/collection.jpg',
      body: [],
      grid: products.map((p) => ({ title: p.name, text: `${p.origin} · ${p.notes}`, to: `/products/${p.slug}`, pouch: { slug: p.slug, color: p.color, accent: p.accent, ink: p.ink, sub: p.origin } }))
    }
  }
  if (first === 'products' && second) {
    const p = products.find((x) => x.slug === second)
    if (!p) return null
    return {
      eyebrow: p.origin,
      title: p.name,
      intro: p.description,
      image: hasProductPhoto(p.slug) ? `/images/products/${p.slug}.jpg` : p.image,
      body: [`Tasting notes: ${p.notes}.`, `Caffeine: ${p.caffeine === 'none' ? 'caffeine free' : p.caffeine}.`, 'Brew with freshly drawn water; steep, taste, and adjust to your liking.'],
      grid: products.filter((x) => x.slug !== p.slug).slice(0, 3).map((x) => ({ title: x.name, text: x.notes, to: `/products/${x.slug}`, pouch: { slug: x.slug, color: x.color, accent: x.accent, ink: x.ink, sub: x.origin } })),
      cta: { label: 'Find your perfect cup', to: '/quiz' }
    }
  }
  if (first === 'origins' && !second) {
    return {
      eyebrow: 'Tea Origins',
      title: 'Ten origins, one ritual',
      intro: 'Japan, China, India, Sri Lanka, Nepal, Bangladesh, Morocco, Taiwan, Kenya and Vietnam — every garden shapes the leaf it grows.',
      image: 'sriLankaSlope',
      body: [],
      grid: origins.map((o) => ({ title: o.country, text: o.tea, to: `/origins/${o.slug}`, image: o.image }))
    }
  }
  if (first === 'origins' && second) {
    const o = origins.find((x) => x.slug === second)
    if (!o) return null
    return {
      eyebrow: 'Tea Origins',
      title: o.country,
      intro: `Home of our ${o.tea}. Discover the climate, altitude and people that give this origin its character.`,
      image: o.image,
      body: ['Each origin page can be managed in Sanity (teaOrigin documents) with its own story, map and photography.'],
      cta: { label: 'All origins', to: '/origins' }
    }
  }
  if (first === 'journal' && !second) {
    return {
      eyebrow: 'Journal',
      title: 'Explore the world of tea.',
      intro: 'Tea Stories, Origins & Gardens, Brewing Guides, Tea Culture and Sustainability.',
      image: 'cupsAndLeaves',
      body: [],
      grid: articles.map((a) => ({ title: a.title, text: `${a.category} — ${a.date}`, to: `/journal/${a.slug}`, image: a.image }))
    }
  }
  if (first === 'journal' && second) {
    const a = articles.find((x) => x.slug === second)
    if (!a) return null
    return {
      eyebrow: `${a.category} — ${a.date}`,
      title: a.title,
      intro: a.excerpt,
      image: a.image,
      body: ['Full article content is managed in Sanity (journalArticle documents). This page renders the bundled preview until the CMS is connected.'],
      cta: { label: 'Back to the journal', to: '/journal' }
    }
  }
  if (second) return null
  return staticPages[first] ?? null
}
