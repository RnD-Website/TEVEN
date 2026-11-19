<script setup lang="ts">
import { gsap } from 'gsap'

/** Intro loader — "The art ◆ of tea", mirrors the reference "The house ◆ of coffee". */
const ready = useSiteReady()
const root = ref<HTMLElement | null>(null)
const done = ref(false)

onMounted(() => {
  const el = root.value
  if (!el) return
  const { lock, unlock } = useScrollLock()
  lock()
  window.scrollTo(0, 0)
  const q = gsap.utils.selector(el)
  const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches

  const finish = () => {
    unlock()
    done.value = true
  }

  if (reduced) {
    ready.value = true
    gsap.to(el, { autoAlpha: 0, duration: 0.3, onComplete: finish })
    return
  }

  const tl = gsap.timeline({ defaults: { ease: 'expo.out' } })
  tl.from(q('.loader__mark'), { scale: 0.6, autoAlpha: 0, duration: 1.2 })
    .from(q('.loader__word.is-left'), { xPercent: 40, autoAlpha: 0, duration: 1.2 }, 0.25)
    .from(q('.loader__word.is-right'), { xPercent: -40, autoAlpha: 0, duration: 1.2 }, 0.25)
    .to(q('.loader__mark'), { rotate: 360, duration: 1.4, ease: 'expo.inOut' }, 0.7)
    .to(q('.loader__inner'), { yPercent: -40, autoAlpha: 0, duration: 0.9, ease: 'expo.in' }, '+=0.15')
    .add(() => { ready.value = true }, '-=0.2')
    .to(el, { yPercent: -100, duration: 1.1, ease: 'expo.inOut' }, '-=0.3')
    .add(finish)
})
</script>

<template>
  <div v-if="!done" ref="root" class="loader" aria-hidden="true">
    <div class="loader__inner">
      <span class="loader__word is-left">The art</span>
      <span class="loader__mark"><TevenLogo variant="outline" /></span>
      <span class="loader__word is-right">of tea</span>
    </div>
  </div>
</template>

<style scoped>
.loader {
  position: fixed;
  inset: 0;
  z-index: var(--z-loader);
  display: grid;
  place-items: center;
  background: var(--c-forest-800);
}
.loader__inner { display: flex; align-items: center; gap: 2.4rem; }
.loader__word {
  font-family: var(--ff-serif);
  font-weight: 300;
  font-size: clamp(1.8rem, 1.6vw, 2.4rem);
  letter-spacing: -0.02em;
  color: var(--c-beige-200);
}
.loader__mark { width: clamp(5.6rem, 5vw, 7.6rem); display: block; }
</style>
