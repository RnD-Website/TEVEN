/**
 * Reusable animation utilities.
 * Every section calls useGsapContext() so its tweens and ScrollTriggers are
 * scoped to its root element and fully reverted on unmount (no leaking
 * triggers between page transitions).
 */
import type { Ref } from 'vue'
import { gsap } from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'

export function useGsapContext(scope: Ref<HTMLElement | null>, setup: (self: gsap.Context) => void) {
  let ctx: gsap.Context | null = null
  onMounted(() => {
    if (!scope.value) return
    ctx = gsap.context(setup, scope.value)
  })
  onBeforeUnmount(() => {
    ctx?.revert()
    ctx = null
  })
  return { get ctx() { return ctx } }
}

export function prefersReducedMotion() {
  if (import.meta.server) return false
  return window.matchMedia('(prefers-reduced-motion: reduce)').matches
}

/** Masked line reveal for SplitTitle (.line-inner) */
export function revealLines(target: Element | string, opts: { trigger?: Element | string; start?: string; delay?: number; stagger?: number } = {}) {
  return gsap.from(target, {
    yPercent: 115,
    rotate: 2,
    duration: 1.3,
    ease: 'expo.out',
    stagger: opts.stagger ?? 0.08,
    delay: opts.delay ?? 0,
    scrollTrigger: opts.trigger
      ? { trigger: opts.trigger, start: opts.start ?? 'top 82%', once: true }
      : undefined
  })
}

/** Soft rise for paragraphs / buttons */
export function riseIn(target: Element | string | Element[], opts: { trigger?: Element | string; start?: string; delay?: number; stagger?: number; y?: number } = {}) {
  return gsap.from(target, {
    y: opts.y ?? 40,
    autoAlpha: 0,
    duration: 1.1,
    ease: 'expo.out',
    stagger: opts.stagger ?? 0.08,
    delay: opts.delay ?? 0,
    scrollTrigger: opts.trigger
      ? { trigger: opts.trigger, start: opts.start ?? 'top 85%', once: true }
      : undefined
  })
}

/** Clip-path image reveal (bottom → top) with inner scale settle */
export function imageReveal(wrapper: Element, opts: { start?: string } = {}) {
  const img = wrapper.querySelector('img')
  const tl = gsap.timeline({
    scrollTrigger: { trigger: wrapper, start: opts.start ?? 'top 85%', once: true }
  })
  tl.fromTo(wrapper, { clipPath: 'inset(100% 0% 0% 0% round 1.6rem)' }, { clipPath: 'inset(0% 0% 0% 0% round 1.6rem)', duration: 1.4, ease: 'expo.inOut' })
  if (img) tl.fromTo(img, { scale: 1.3 }, { scale: 1, duration: 1.8, ease: 'expo.out' }, 0.1)
  return tl
}

/** Scrubbed vertical parallax */
export function parallax(target: Element | string, amount = 12, trigger?: Element) {
  return gsap.fromTo(
    target,
    { yPercent: -amount },
    {
      yPercent: amount,
      ease: 'none',
      scrollTrigger: { trigger: trigger ?? (target as Element), start: 'top bottom', end: 'bottom top', scrub: true }
    }
  )
}

export { gsap, ScrollTrigger }
