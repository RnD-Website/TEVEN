/**
 * Motion system bootstrap.
 * - Lenis 1.3.1 for smooth vertical scrolling with inertia
 * - GSAP + ScrollTrigger, driven by the same RAF as Lenis so pinned
 *   sections and scrubbed timelines never drift from the scroll position.
 */
import Lenis from 'lenis'
import { gsap } from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'

export default defineNuxtPlugin((nuxtApp) => {
  gsap.registerPlugin(ScrollTrigger)

  const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches

  const lenis = new Lenis({
    duration: 1.15,
    easing: (t: number) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
    smoothWheel: !reduced,
    wheelMultiplier: 1,
    touchMultiplier: 1.3,
    autoRaf: false
  })

  // Keep ScrollTrigger in sync with Lenis
  lenis.on('scroll', ScrollTrigger.update)
  gsap.ticker.add((time) => lenis.raf(time * 1000))
  gsap.ticker.lagSmoothing(0)

  ScrollTrigger.config({ ignoreMobileResize: true })
  gsap.defaults({ ease: 'expo.out', duration: 1.1 })

  // Refresh once fonts + images are in to avoid wrong trigger positions
  const refresh = () => ScrollTrigger.refresh()
  if (document.fonts?.ready) document.fonts.ready.then(refresh)
  window.addEventListener('load', refresh, { once: true })

  nuxtApp.hook('page:finish', () => {
    requestAnimationFrame(() => ScrollTrigger.refresh())
  })

  return {
    provide: { lenis, gsap, ScrollTrigger, reducedMotion: reduced }
  }
})
