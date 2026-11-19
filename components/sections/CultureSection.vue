<script setup lang="ts">
/**
 * SECTION 09 — Tea culture experiences (Discovery Centre / Craft Academy).
 * Reference: paper background, serif "The Culture of Coffee" intro, then
 * stacked rows — serif title + Explore pill on the left, image + text on the
 * right, offset per row, with a thin vertical rule and image clip reveals.
 */
import { gsap } from 'gsap'
import { culture } from '~/data/site'

const root = ref<HTMLElement | null>(null)

useGsapContext(root, () => {
  revealLines('.culture__intro .line-inner', { trigger: '.culture__intro' })
  riseIn('.culture__intro-text', { trigger: '.culture__intro', start: 'top 75%' })
  gsap.from('.culture__rule', { scaleY: 0, transformOrigin: 'top', duration: 2, ease: 'expo.inOut', scrollTrigger: { trigger: '.culture__rows', start: 'top 80%', once: true } })
  gsap.utils.toArray<HTMLElement>('.crow').forEach((row) => {
    revealLines(row.querySelectorAll('.line-inner'), { trigger: row, start: 'top 78%' })
    riseIn(row.querySelectorAll('.crow__fade'), { trigger: row, start: 'top 75%', stagger: 0.1 })
    const img = row.querySelector('.crow__img')
    if (img) {
      imageReveal(img, { start: 'top 82%' })
      parallax(img.querySelector('img')!, 6, img)
    }
  })
})
</script>

<template>
  <section ref="root" class="culture section-paper" aria-labelledby="culture-title">
    <div class="g-row culture__intro">
      <div class="culture__intro-col">
        <SplitTitle id="culture-title" :lines="[culture.title]" size="serif-l" />
        <p class="t-headline-6 culture__intro-text">{{ culture.text }}</p>
      </div>
    </div>

    <div class="culture__rows">
      <span class="culture__rule" aria-hidden="true" />
      <article v-for="(item, i) in culture.items" :key="item.title" class="crow g-row" :class="`is-${i}`">
        <div class="crow__title-col">
          <SplitTitle :lines="item.title.split(' ').length > 2 ? [item.title.split(' ').slice(0, 2).join(' '), item.title.split(' ').slice(2).join(' ')] : [item.title]" tag="h3" size="serif-m" />
          <div class="crow__fade"><PillButton :label="item.cta.label" :to="item.cta.to" tone="dark" /></div>
        </div>
        <div class="crow__info-col">
          <NuxtLink :to="item.cta.to" class="crow__img" :aria-label="item.title">
            <TImg :src="item.image" :width="1200" sizes="(max-width: 1023px) 92vw, 30vw" :alt="item.title" cover />
          </NuxtLink>
          <p class="crow__text t-text-3 crow__fade">{{ item.text }}</p>
        </div>
      </article>
    </div>
  </section>
</template>

<style scoped>
.culture { position: relative; padding-block: clamp(8rem, 8vw, 13rem) clamp(4rem, 5vw, 8rem); }
.culture__intro-col { grid-column: 2 / span 11; display: grid; gap: 3.2rem; }
.culture__intro-text { color: var(--ink-muted); max-width: 64rem; }

.culture__rows { position: relative; display: grid; gap: clamp(4rem, 5vw, 8rem); padding-top: clamp(6rem, 7vw, 11rem); }
.culture__rule { position: absolute; left: var(--page-pad); top: clamp(6rem, 7vw, 11rem); bottom: 0; width: 1px; background: var(--line-light); }

.crow__title-col { grid-column: 2 / span 7; display: grid; align-content: start; gap: 2.8rem; }
.crow__info-col { grid-column: 10 / span 8; display: grid; gap: 2rem; }
.crow.is-1 .crow__title-col { grid-column: 4 / span 7; }
.crow.is-1 .crow__info-col { grid-column: 12 / span 8; }
.crow__img {
  position: relative;
  display: block;
  aspect-ratio: 1.76;
  border-radius: var(--r-m);
  overflow: hidden;
}
.crow__img :deep(img) { height: 116%; top: -8%; transition: transform 1.4s var(--ease-out); }
.crow__img:hover :deep(img) { transform: scale(1.05); }
.crow__text { color: var(--ink-muted); max-width: 46rem; }

@media (max-width: 1023px) {
  .culture__intro-col,
  .crow__title-col,
  .crow__info-col,
  .crow.is-1 .crow__title-col,
  .crow.is-1 .crow__info-col { grid-column: 2 / -1; }
  .crow { row-gap: 2.4rem; }
}
</style>
