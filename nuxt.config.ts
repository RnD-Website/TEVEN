// TEVEN — Nuxt configuration
// Static-site generation (nuxi generate) deployed on Vercel.
export default defineNuxtConfig({
  compatibilityDate: '2024-11-01',
  devtools: { enabled: false },
  ssr: true,

  modules: ['@element-plus/nuxt', '@vite-pwa/nuxt'],

  css: ['lenis/dist/lenis.css', '~/assets/css/main.css'],

  components: [
    { path: '~/components', pathPrefix: false }
  ],

  app: {
    head: {
      htmlAttrs: { lang: 'en' },
      charset: 'utf-8',
      viewport: 'width=device-width, initial-scale=1, viewport-fit=cover',
      titleTemplate: '%s | TEVEN — The art of tea',
      meta: [
        { name: 'theme-color', content: '#12201a' },
        { name: 'format-detection', content: 'telephone=no' }
      ],
      link: [
        { rel: 'icon', type: 'image/svg+xml', href: '/favicon.svg' },
        { rel: 'apple-touch-icon', href: '/icons/icon-192.png' },
        { rel: 'preconnect', href: 'https://fonts.googleapis.com' },
        { rel: 'preconnect', href: 'https://fonts.gstatic.com', crossorigin: '' },
        { rel: 'preconnect', href: 'https://images.unsplash.com' },
        {
          rel: 'stylesheet',
          href: 'https://fonts.googleapis.com/css2?family=Barlow+Condensed:wght@500;600;700&family=Fraunces:ital,opsz,wght@0,9..144,300;0,9..144,400;1,9..144,300;1,9..144,400&family=Manrope:wght@400;500;600;700&display=swap'
        }
      ]
    }
  },

  runtimeConfig: {
    public: {
      siteUrl: process.env.NUXT_PUBLIC_SITE_URL || 'https://teven.vercel.app',
      // Analytics — leave empty to disable. Never commit real IDs; set them in Vercel env vars.
      gtmId: process.env.NUXT_PUBLIC_GTM_ID || '',
      ga4Id: process.env.NUXT_PUBLIC_GA4_ID || '',
      hotjarId: process.env.NUXT_PUBLIC_HOTJAR_ID || '',
      umamiId: process.env.NUXT_PUBLIC_UMAMI_ID || '',
      umamiSrc: process.env.NUXT_PUBLIC_UMAMI_SRC || 'https://cloud.umami.is/script.js',
      // Consent — if a Cookiebot ID is set, Cookiebot replaces the built-in Cookie Control banner.
      cookiebotId: process.env.NUXT_PUBLIC_COOKIEBOT_ID || '',
      // Sanity CMS — if no project ID is set, the site uses the bundled content in /data.
      sanityProjectId: process.env.NUXT_PUBLIC_SANITY_PROJECT_ID || '',
      sanityDataset: process.env.NUXT_PUBLIC_SANITY_DATASET || 'production',
      sanityApiVersion: process.env.NUXT_PUBLIC_SANITY_API_VERSION || '2024-10-01'
    }
  },

  elementPlus: {
    importStyle: 'css',
    themes: []
  },

  pwa: {
    registerType: 'autoUpdate',
    manifest: {
      name: 'TEVEN — The art of tea',
      short_name: 'TEVEN',
      description: 'Premium tea, origins, craft and tea culture.',
      theme_color: '#12201a',
      background_color: '#12201a',
      display: 'standalone',
      start_url: '/',
      icons: [
        { src: '/icons/icon-192.png', sizes: '192x192', type: 'image/png' },
        { src: '/icons/icon-512.png', sizes: '512x512', type: 'image/png' },
        { src: '/icons/icon-512.png', sizes: '512x512', type: 'image/png', purpose: 'maskable' }
      ]
    },
    workbox: {
      navigateFallback: '/',
      globPatterns: ['**/*.{js,css,html,svg,png,ico,webmanifest}'],
      runtimeCaching: [
        {
          urlPattern: /^https:\/\/images\.unsplash\.com\/.*/i,
          handler: 'CacheFirst',
          options: { cacheName: 'teven-images', expiration: { maxEntries: 120, maxAgeSeconds: 60 * 60 * 24 * 30 } }
        }
      ]
    },
    client: { installPrompt: false },
    devOptions: { enabled: false }
  },

  nitro: {
    prerender: {
      crawlLinks: true,
      routes: ['/'],
      failOnError: false
    }
  },

  experimental: {
    payloadExtraction: true
  }
})
