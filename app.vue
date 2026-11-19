<script setup lang="ts">
import { gsap } from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'

const route = useRoute()
const config = useRuntimeConfig().public
const curtain = ref<HTMLElement | null>(null)

useSeoMeta({
  description: 'TEVEN celebrates the art of tea — natural ingredients, tea origins, traditional craftsmanship and modern tea culture.',
  ogSiteName: 'TEVEN',
  ogType: 'website',
  ogTitle: 'TEVEN — The art of tea',
  ogDescription: 'Every leaf carries a story. Discover the origins, craftsmanship, and rituals behind exceptional tea.',
  ogImage: 'https://images.unsplash.com/photo-1491497895121-1334fc14d8c9?auto=format&fit=crop&w=1200&h=630&q=80',
  twitterCard: 'summary_large_image'
})
useHead({ link: [{ rel: 'canonical', href: computed(() => `${config.siteUrl}${route.path}`) }] })

/* Page transition: forest curtain wipes up, page swaps, curtain wipes away */
const transition = {
  name: 'page',
  mode: 'out-in' as const,
  css: false,
  onLeave(_el: Element, done: () => void) {
    if (!curtain.value) return done()
    gsap.fromTo(curtain.value,
      { yPercent: 100, borderRadius: '50% 50% 0 0 / 12% 12% 0 0' },
      { yPercent: 0, borderRadius: '0% 0% 0 0 / 0% 0% 0 0', duration: 0.8, ease: 'expo.inOut', onComplete: done })
  },
  onEnter(_el: Element, done: () => void) {
    const lenis = useLenis()
    lenis?.scrollTo(0, { immediate: true, force: true })
    window.scrollTo(0, 0)
    ScrollTrigger.refresh()
    if (!curtain.value) return done()
    gsap.to(curtain.value, {
      yPercent: -100,
      borderRadius: '0 0 50% 50% / 0 0 12% 12%',
      duration: 0.9,
      ease: 'expo.inOut',
      delay: 0.1,
      onComplete: () => { gsap.set(curtain.value, { yPercent: 100 }); done() }
    })
  }
}
</script>

<template>
  <div class="app">
    <a class="skip-link" href="#main">Skip to content</a>
    <AppPreloader />
    <AppHeader />
    <MenuOverlay />
    <main id="main">
      <NuxtPage :transition="transition" />
    </main>
    <AppFooter :overlay="route.path === '/'" />
    <QuizModal />
    <CookieConsent />
    <div ref="curtain" class="curtain" aria-hidden="true">
      <div class="curtain__mark"><TevenLogo variant="outline" /></div>
    </div>
  </div>
</template>

<style>
.curtain {
  position: fixed;
  inset: 0;
  z-index: 95;
  display: grid;
  place-items: center;
  background: var(--c-forest-700);
  transform: translateY(100%);
  pointer-events: none;
}
.curtain__mark { width: 6.4rem; opacity: 0.8; }
</style>
