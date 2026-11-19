<script setup lang="ts">
/**
 * SECTION 14 — Final featured story.
 * Reference: full-bleed cinematic image (sticky), small label, huge
 * condensed headline with inline small words, CTA — then the footer slides
 * over it as a blurred panel (see AppFooter overlay mode).
 */
import { gsap } from 'gsap'
import { finalFeature } from '~/data/site'

const root = ref<HTMLElement | null>(null)

useGsapContext(root, () => {
  gsap.fromTo('.final__media', { clipPath: 'inset(8% 6% 0% 6% round 2.4rem)' }, {
    clipPath: 'inset(0% 0% 0% 0% round 0rem)',
    ease: 'none',
    scrollTrigger: { trigger: root.value, start: 'top bottom', end: 'top top', scrub: true }
  })
  gsap.fromTo('.final__media img', { scale: 1.25 }, {
    scale: 1,
    ease: 'none',
    scrollTrigger: { trigger: root.value, start: 'top bottom', end: 'bottom bottom', scrub: true }
  })
  revealLines('.final__title .line-inner', { trigger: root.value!, start: 'top 40%' })
  riseIn('.final__fade', { trigger: root.value!, start: 'top 35%' })
})
</script>

<template>
  <section ref="root" class="final" aria-labelledby="final-title">
    <div class="final__sticky">
      <div class="final__media">
        <TImg :src="finalFeature.image" :width="2400" alt="Tea plantation landscape" cover />
        <div class="final__shade" />
      </div>
      <div class="final__content">
        <p class="t-label final__fade">{{ finalFeature.label }}</p>
        <SplitTitle id="final-title" :lines="finalFeature.titleLines" size="title-1" class="final__title t-center" />
        <div class="final__fade"><PillButton :label="finalFeature.cta.label" :to="finalFeature.cta.to" /></div>
      </div>
    </div>
  </section>
</template>

<style scoped>
.final { position: relative; height: 165svh; background: var(--c-forest-900); }
.final__sticky {
  position: sticky;
  top: 0;
  height: 100svh;
  display: grid;
  place-items: center;
  overflow: hidden;
}
.final__media { position: absolute; inset: 0; overflow: hidden; }
.final__shade { position: absolute; inset: 0; background: radial-gradient(70% 60% at 50% 45%, rgba(13, 23, 18, 0.15), rgba(13, 23, 18, 0.6)); }
.final__content { position: relative; display: grid; justify-items: center; gap: 2.8rem; padding-inline: var(--page-pad); margin-top: -16svh; text-align: center; }
.final__title { color: var(--c-ivory-50); }
@media (max-width: 1023px) {
  .final { height: 150svh; }
  .final__content { margin-top: -10svh; }
}
</style>
