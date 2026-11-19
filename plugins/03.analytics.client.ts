/**
 * Consent-gated analytics: Google Tag Manager, Google Analytics 4, Hotjar, Umami.
 * - IDs come from runtime config (env vars) — nothing is hard-coded.
 * - Google Consent Mode v2 defaults to "denied" until the visitor opts in.
 * - If NUXT_PUBLIC_COOKIEBOT_ID is set, Cookiebot is loaded and its consent
 *   events drive the same state; the built-in banner hides itself.
 */
declare global {
  interface Window {
    dataLayer: unknown[]
    gtag?: (...args: unknown[]) => void
    hj?: (...args: unknown[]) => void
    _hjSettings?: { hjid: number; hjsv: number }
    Cookiebot?: { consent: { statistics: boolean; marketing: boolean } }
  }
}

function inject(src: string, attrs: Record<string, string> = {}) {
  const s = document.createElement('script')
  s.async = true
  s.src = src
  Object.entries(attrs).forEach(([k, v]) => s.setAttribute(k, v))
  document.head.appendChild(s)
  return s
}

export default defineNuxtPlugin(() => {
  const config = useRuntimeConfig().public
  const { state, load, save } = useConsent()
  const router = useRouter()
  const loaded = { gtm: false, ga4: false, hotjar: false, umami: false }

  window.dataLayer = window.dataLayer || []
  window.gtag = function gtag() { window.dataLayer.push(arguments) } // eslint-disable-line prefer-rest-params
  window.gtag('consent', 'default', {
    ad_storage: 'denied', ad_user_data: 'denied', ad_personalization: 'denied',
    analytics_storage: 'denied', functionality_storage: 'granted', security_storage: 'granted',
    wait_for_update: 500
  })

  function applyConsent() {
    const { analytics, marketing } = state.value
    window.gtag?.('consent', 'update', {
      analytics_storage: analytics ? 'granted' : 'denied',
      ad_storage: marketing ? 'granted' : 'denied',
      ad_user_data: marketing ? 'granted' : 'denied',
      ad_personalization: marketing ? 'granted' : 'denied'
    })

    if (!analytics) return

    if (config.gtmId && !loaded.gtm) {
      loaded.gtm = true
      window.dataLayer.push({ 'gtm.start': Date.now(), event: 'gtm.js' })
      inject(`https://www.googletagmanager.com/gtm.js?id=${config.gtmId}`)
    }
    if (config.ga4Id && !loaded.ga4) {
      loaded.ga4 = true
      inject(`https://www.googletagmanager.com/gtag/js?id=${config.ga4Id}`)
      window.gtag?.('js', new Date())
      window.gtag?.('config', config.ga4Id, { anonymize_ip: true, send_page_view: true })
    }
    if (config.hotjarId && !loaded.hotjar) {
      loaded.hotjar = true
      window.hj = window.hj || function hj() { ((window.hj as any).q = (window.hj as any).q || []).push(arguments) } // eslint-disable-line prefer-rest-params
      window._hjSettings = { hjid: Number(config.hotjarId), hjsv: 6 }
      inject(`https://static.hotjar.com/c/hotjar-${config.hotjarId}.js?sv=6`)
    }
    if (config.umamiId && !loaded.umami) {
      loaded.umami = true
      inject(config.umamiSrc as string, { 'data-website-id': config.umamiId as string, defer: '' })
    }
  }

  // Cookiebot integration (optional)
  if (config.cookiebotId) {
    inject('https://consent.cookiebot.com/uc.js', { id: 'Cookiebot', 'data-cbid': config.cookiebotId as string, 'data-blockingmode': 'auto' })
    const sync = () => {
      const c = window.Cookiebot?.consent
      if (c) save({ analytics: !!c.statistics, marketing: !!c.marketing })
    }
    window.addEventListener('CookiebotOnAccept', sync)
    window.addEventListener('CookiebotOnDecline', sync)
  }

  load()
  if (state.value.decided) applyConsent()
  watch(() => [state.value.analytics, state.value.marketing, state.value.decided], applyConsent)

  // SPA page views for GA4 (GTM handles its own history triggers)
  router.afterEach((to) => {
    if (state.value.analytics && loaded.ga4) {
      window.gtag?.('event', 'page_view', { page_path: to.fullPath, page_location: window.location.href })
    }
  })
})
