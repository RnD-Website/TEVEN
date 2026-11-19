<script setup lang="ts">
/** Generic editorial inner page (products, origins, journal, culture, legal). */
import { gsap } from 'gsap'
import { resolvePage } from '~/data/pages'
import { hasProductPhoto } from '~/data/mockups'

const route = useRoute()
const slug = computed(() => ([] as string[]).concat(route.params.slug as string | string[]).filter(Boolean))
const page = computed(() => resolvePage(slug.value))
const quizOpen = useQuizOpen()

if (!page.value) {
  throw createError({ statusCode: 404, statusMessage: 'Page not found', fatal: true })
}

useSeoMeta({
  title: () => page.value?.title ?? 'TEVEN',
  description: () => page.value?.intro ?? '',
  ogTitle: () => `${page.value?.title} | TEVEN`,
  ogDescription: () => page.value?.intro ?? ''
})

const root = ref<HTMLElement | null>(null)
useGsapContext(root, () => {
  gsap.fromTo('.ip__hero-media img', { scale: 1.2 }, { scale: 1, duration: 2.2, ease: 'expo.out' })
  revealLines('.ip__title .line-inner', { delay: 0.2 })
  riseIn('.ip__fade', { delay: 0.4 })
  gsap.to('.ip__hero-media', { yPercent: 20, ease: 'none', scrollTrigger: { trigger: '.ip__hero', start: 'top top', end: 'bottom top', scrub: true } })
  gsap.utils.toArray<HTMLElement>('.ip__reveal').forEach((el) => riseIn(el, { trigger: el }))
})

function titleLines(t: string) {
  const words = t.split(' ')
  if (words.length <= 2) return [t]
  const mid = Math.ceil(words.length / 2)
  return [words.slice(0, mid).join(' '), words.slice(mid).join(' ')]
}
</script>

<template>
  <article v-if="page" ref="root" class="ip">
    <header class="ip__hero">
      <div class="ip__hero-media"><TImg :src="page.image" :width="2200" :alt="page.title" priority cover /></div>
      <div class="ip__hero-shade" />
      <div class="ip__hero-content">
        <p class="t-label ip__fade">{{ page.eyebrow }}</p>
        <SplitTitle :lines="titleLines(page.title)" tag="h1" size="serif-xl" class="ip__title" />
      </div>
    </header>

    <section class="ip__body g-row">
      <div class="ip__col">
        <p class="t-serif-m ip__intro ip__fade">{{ page.intro }}</p>
        <p v-for="(b, i) in page.body" :key="i" class="t-headline-6 ip__p ip__reveal">{{ b }}</p>
        <div v-if="page.quiz || page.cta" class="ip__cta ip__reveal">
          <PillButton v-if="page.quiz" label="Discover Your Tea" tone="dark" @click="quizOpen = true" />
          <PillButton v-else-if="page.cta" :label="page.cta.label" :to="page.cta.to" tone="dark" />
        </div>
      </div>
    </section>

    <section v-if="page.grid?.length" class="ip__grid-wrap">
      <ul class="ip__grid">
        <li v-for="g in page.grid" :key="g.to" class="ip__reveal">
          <NuxtLink :to="g.to" class="gcard">
            <div class="gcard__media" :style="g.pouch ? { background: g.pouch.color } : undefined">
              <ProductPhoto v-if="g.pouch && hasProductPhoto(g.pouch.slug)" :slug="g.pouch.slug" :alt="`TEVEN ${g.title}`" sizes="(max-width: 767px) 92vw, 30vw" />
              <div v-else-if="g.pouch" class="gcard__pouch"><TeaPack :slug="g.pouch.slug" :name="g.title" :sub="g.pouch.sub" :color="g.pouch.color" :accent="g.pouch.accent" :ink="g.pouch.ink" /></div>
              <TImg v-else-if="g.image" :src="g.image" :width="800" sizes="(max-width: 767px) 92vw, 30vw" :alt="g.title" cover />
            </div>
            <div class="gcard__body">
              <h2 class="t-headline-5">{{ g.title }}</h2>
              <span class="t-small gcard__text">{{ g.text }}</span>
            </div>
          </NuxtLink>
        </li>
      </ul>
    </section>

    <div class="ip__back g-row">
      <PillButton label="Back to home" to="/" tone="dark" icon="arrow-right" />
    </div>
  </article>
</template>

<style scoped>
.ip { background: var(--paper); color: var(--ink); }
.ip__hero { position: relative; height: 82svh; min-height: 52rem; overflow: hidden; display: flex; align-items: flex-end; color: var(--c-ivory-50); }
.ip__hero-media { position: absolute; inset: 0; }
.ip__hero-shade { position: absolute; inset: 0; background: linear-gradient(0deg, rgba(13, 23, 18, 0.8), rgba(13, 23, 18, 0.1) 60%), linear-gradient(180deg, rgba(13, 23, 18, 0.5), transparent 25%); }
.ip__hero-content { position: relative; display: grid; gap: 2rem; padding: 0 var(--page-pad) clamp(4rem, 5vw, 8rem); max-width: 120rem; }
.ip__body { padding-block: clamp(6rem, 8vw, 12rem); }
.ip__col { grid-column: 7 / span 16; display: grid; gap: 2.4rem; }
.ip__intro { margin-bottom: 1.6rem; }
.ip__p { color: var(--ink-muted); }
.ip__cta { margin-top: 1.6rem; }
.ip__grid-wrap { padding: 0 var(--page-pad) clamp(6rem, 8vw, 12rem); }
.ip__grid { display: grid; grid-template-columns: repeat(3, minmax(0, 1fr)); gap: 2.4rem var(--gutter); }
.gcard { display: grid; gap: 1.4rem; }
.gcard__media { position: relative; aspect-ratio: 1.2; border-radius: var(--r-m); overflow: hidden; background: var(--c-beige-200); }
.gcard__media :deep(img) { transition: transform 1.2s var(--ease-out); }
.gcard__pouch { position: absolute; left: 50%; bottom: 8%; width: 42%; transform: translateX(-50%); transition: transform 0.9s var(--ease-out); }
.gcard:hover .gcard__media :deep(img) { transform: scale(1.05); }
.gcard__media :deep(.product-photo img) { transition: transform 1.2s var(--ease-out); }
.gcard:hover .gcard__pouch { transform: translateX(-50%) translateY(-10%) rotate(-4deg); }
.gcard__body { display: grid; gap: 0.4rem; }
.gcard__text { color: var(--ink-muted); }
.ip__back { padding-bottom: clamp(6rem, 8vw, 12rem); }
.ip__back > * { grid-column: 7 / span 10; }
@media (max-width: 1023px) {
  .ip__col, .ip__back > * { grid-column: 1 / -1; }
  .ip__grid { grid-template-columns: 1fr 1fr; }
}
@media (max-width: 599px) {
  .ip__grid { grid-template-columns: 1fr; }
}
</style>
