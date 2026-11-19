<script setup lang="ts">
/**
 * SECTION 02 — Full-screen hero: one looping brand film behind a single
 * masked headline, lead text and CTA, with the floating card cluster on the right.
 */
import { gsap } from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import { heroCards, products } from '~/data/site'
import { hasProductPhoto } from '~/data/mockups'

const props = defineProps<{ slides: any[] }>()
const ready = useSiteReady()
const quizOpen = useQuizOpen()
const root = ref<HTMLElement | null>(null)
const video = ref<HTMLVideoElement | null>(null)
const product = computed(() => products.find((p) => hasProductPhoto(p.slug)) ?? products.find((p) => p.slug === heroCards.product.slug) ?? products[0])

const story = computed(() => props.slides[0])

let ctx: gsap.Context | null = null

// Start the film from clip 01 the moment the preloader lifts,
// so the sequence is always 01 → 02 → 04 → 05 → loop.
function startFilm() {
  const v = video.value
  if (!v || reducedMotion) return
  try { v.currentTime = 0 } catch {}
  v.play().catch(() => {})
}

function intro() {
  startFilm()
  if (!root.value) return
  ctx?.add(() => {
    const tl = gsap.timeline({ defaults: { ease: 'expo.out' } })
    tl.fromTo('.hero__video', { scale: 1.2 }, { scale: 1, duration: 2.4 }, 0)
      .fromTo('.hero__text.is-first .line-inner', { yPercent: 115 }, { yPercent: 0, duration: 1.4, stagger: 0.1 }, 0.2)
      .fromTo('.hero__text.is-first .hero__fade', { y: 30, autoAlpha: 0 }, { y: 0, autoAlpha: 1, duration: 1.2, stagger: 0.08 }, 0.5)
      .fromTo('.hero__card', { y: 40, scale: 0.94, autoAlpha: 0 }, { y: 0, scale: 1, autoAlpha: 1, duration: 1.3, stagger: 0.08 }, 0.55)
  })
}

let reducedMotion = false

onMounted(() => {
  // Pick the right file for the screen; respect reduced motion (poster only)
  reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches
  const v = video.value
  if (v) {
    const small = window.matchMedia('(max-width: 1023px)').matches || (navigator as any).connection?.saveData
    // Versioned names so browsers never replay an older cached cut
    v.src = small ? '/videos/hero-v2-720.mp4' : '/videos/hero-v2.mp4'
    v.load()
  }

  ctx = gsap.context(() => {
    gsap.set('.hero__text.is-first .line-inner', { yPercent: 115 })
    gsap.set('.hero__text.is-first .hero__fade, .hero__card', { autoAlpha: 0 })

    // Scroll: media drifts, content lifts away (reference parallax exit)
    gsap.to('.hero__media', {
      yPercent: 18, ease: 'none',
      scrollTrigger: { trigger: root.value, start: 'top top', end: 'bottom top', scrub: true }
    })
    gsap.to('.hero__inner', {
      yPercent: -12, autoAlpha: 0.2, ease: 'none',
      scrollTrigger: { trigger: root.value, start: 'center center', end: 'bottom top', scrub: true }
    })
    ScrollTrigger.create({
      trigger: root.value,
      start: 'top top',
      end: 'bottom top',
      onToggle: (self) => {
        if (video.value && !reducedMotion && ready.value) self.isActive ? video.value.play().catch(() => {}) : video.value.pause()
      }
    })
  }, root.value!)

  if (ready.value) intro()
  else watch(ready, (v) => v && intro(), { once: true })
})

onBeforeUnmount(() => {
  ctx?.revert()
})
</script>

<template>
  <section ref="root" class="hero" aria-label="TEVEN, the art of tea">
    <div class="hero__media">
      <!-- One seamless looping film (clips 01, 02, 04, 05 in order, 1s crossfades) -->
      <video
        ref="video"
        class="hero__video"
        poster="/videos/hero-poster.jpg"
        muted
        loop
        playsinline
        preload="auto"
        aria-hidden="true"
        disablepictureinpicture
      />
      <div class="hero__shade" />
    </div>

    <div class="hero__inner">
      <div class="hero__texts">
        <div v-if="story" class="hero__text is-first">
          <SplitTitle :lines="story.title" tag="h1" size="serif-xl" class="hero__title" />
          <p class="hero__lead t-headline-6 hero__fade">{{ story.text }}</p>
          <div class="hero__fade">
            <PillButton :label="story.cta.label" :to="story.cta.to" />
          </div>
        </div>
      </div>

      <!-- Card cluster (Section 03 storytelling card included) -->
      <aside class="hero__cards" aria-label="Highlights">
        <div class="hero__col">
          <NuxtLink to="/products" class="hero__card hero__card--label">
            <span class="t-small">{{ heroCards.productsLabel }}</span>
            <TIcon name="arrow-right" />
          </NuxtLink>
          <NuxtLink :to="`/products/${product.slug}`" class="hero__card hero__card--product" :class="{ 'has-photo': hasProductPhoto(product.slug) }">
            <ProductPhoto v-if="hasProductPhoto(product.slug)" :slug="product.slug" :alt="`TEVEN ${product.name}`" sizes="14vw" priority />
            <div v-else class="hero__pouch"><TeaPack :slug="product.slug" :name="product.name" :sub="product.origin" :color="product.color" :accent="product.accent" :ink="product.ink" priority /></div>
            <span class="t-small hero__product-name">{{ product.name }}</span>
          </NuxtLink>
        </div>
        <NuxtLink :to="heroCards.feature.to" class="hero__card hero__card--feature">
          <TImg :src="heroCards.feature.image" :width="600" sizes="16vw" alt="" cover />
          <span class="hero__card-cap t-small">{{ heroCards.feature.title }}</span>
        </NuxtLink>
        <NuxtLink :to="heroCards.story.to" class="hero__card hero__card--story">
          <div class="hero__story-img"><TImg :src="heroCards.story.image" :width="500" sizes="12vw" alt="" cover /></div>
          <div class="hero__story-body">
            <span class="t-small">{{ heroCards.story.title }}</span>
            <span class="hero__story-text">{{ heroCards.story.text }}</span>
          </div>
          <TIcon name="arrow-right" class="hero__story-arrow" />
        </NuxtLink>
        <button type="button" class="hero__card hero__card--quiz" @click="quizOpen = true">
          <span class="t-small">Discover your perfect cup</span>
          <TIcon name="arrow-right" />
        </button>
      </aside>

    </div>
  </section>
</template>

<style scoped>
.hero {
  position: relative;
  height: 100svh;
  min-height: 64rem;
  overflow: hidden;
  background: var(--c-forest-900);
}
.hero__media { position: absolute; inset: 0; will-change: transform; }
.hero__video { position: absolute; inset: 0; width: 100%; height: 100%; object-fit: cover; will-change: transform; }
.hero__shade {
  position: absolute;
  inset: 0;
  z-index: 3;
  background:
    linear-gradient(180deg, rgba(13, 23, 18, 0.5) 0%, rgba(13, 23, 18, 0) 24%),
    linear-gradient(0deg, rgba(13, 23, 18, 0.88) 0%, rgba(13, 23, 18, 0.35) 45%, rgba(13, 23, 18, 0.05) 72%),
    linear-gradient(90deg, rgba(13, 23, 18, 0.6) 0%, rgba(13, 23, 18, 0.2) 40%, rgba(13, 23, 18, 0) 62%);
}

.hero__inner {
  position: relative;
  z-index: 4;
  height: 100%;
  display: grid;
  grid-template-columns: 1fr auto;
  grid-template-rows: 1fr;
  column-gap: 4rem;
  padding: 0 var(--page-pad) 2.4rem;
}
.hero__texts { position: relative; grid-column: 1; grid-row: 1; align-self: end; min-height: 34rem; }
.hero__text {
  position: absolute;
  left: 0;
  bottom: 3.2rem;
  display: grid;
  gap: 2.4rem;
  justify-items: start;
  max-width: 64rem;
}
.hero__title { color: var(--c-ivory-50); text-shadow: 0 0.2rem 2.4rem rgba(13, 23, 18, 0.35); }
.hero__lead { max-width: 42rem; color: rgba(246, 240, 228, 0.82); }

/* Card cluster */
.hero__cards {
  grid-column: 2;
  grid-row: 1;
  align-self: end;
  margin-bottom: 3.2rem;
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 0.8rem;
  width: clamp(36rem, 29vw, 44rem);
}
.hero__col { display: grid; gap: 0.8rem; grid-template-rows: auto 1fr; }
.hero__card {
  position: relative;
  display: flex;
  border-radius: var(--r-m);
  overflow: hidden;
  background: rgba(13, 23, 18, 0.66);
  backdrop-filter: blur(16px);
  -webkit-backdrop-filter: blur(16px);
  color: var(--c-ivory-50);
  transition: transform 0.7s var(--ease-out), background 0.4s;
}
.hero__card:hover { transform: translateY(-0.4rem); background: rgba(27, 44, 35, 0.8); }
.hero__card--label { align-items: center; justify-content: space-between; height: 4.4rem; padding-inline: 1.6rem; border-radius: var(--r-pill); }
.hero__card--product { flex-direction: column; justify-content: space-between; padding: 1.6rem; min-height: 16rem; }
.hero__pouch { width: 42%; margin: 0 auto 1.2rem; transition: transform 0.8s var(--ease-out); }
.hero__card--product.has-photo { justify-content: flex-end; }
.hero__card--product.has-photo :deep(img) { transition: transform 1.2s var(--ease-out); }
.hero__card--product.has-photo:hover :deep(img) { transform: scale(1.06); }
.hero__card--product.has-photo .hero__product-name { position: relative; margin: -1.6rem; padding: 1.4rem 1.6rem; background: linear-gradient(0deg, rgba(13, 23, 18, 0.85), transparent); }
.hero__card--product:hover .hero__pouch { transform: translateY(-0.6rem) rotate(-4deg); }
.hero__card--feature { min-height: 20rem; align-items: flex-end; }
.hero__card--feature :deep(img) { transition: transform 1.2s var(--ease-out); }
.hero__card--feature:hover :deep(img) { transform: scale(1.06); }
.hero__card-cap {
  position: relative;
  padding: 1.4rem;
  width: 100%;
  background: linear-gradient(0deg, rgba(13, 23, 18, 0.8), transparent);
}
.hero__card--story { grid-column: 1 / -1; gap: 1.4rem; padding: 1.2rem 4.4rem 1.2rem 1.2rem; align-items: center; }
.hero__story-img { position: relative; flex: none; width: 9.6rem; aspect-ratio: 1; border-radius: var(--r-s); overflow: hidden; }
.hero__story-body { display: grid; gap: 0.4rem; }
.hero__story-text { font-size: 1.2rem; line-height: 1.4; color: var(--fg-muted); display: -webkit-box; -webkit-line-clamp: 3; -webkit-box-orient: vertical; overflow: hidden; }
.hero__story-arrow { position: absolute; top: 1.4rem; right: 1.4rem; font-size: 1.6rem; }
.hero__card--quiz { grid-column: 1 / -1; align-items: center; justify-content: space-between; height: 4.4rem; padding-inline: 1.6rem; border-radius: var(--r-pill); }

@media (max-width: 1023px) {
  .hero__inner { grid-template-columns: 1fr; padding-bottom: 2rem; }
  .hero__cards { display: none; }
  .hero__texts { min-height: 40rem; }
  .hero__text { bottom: 2.4rem; }
}
</style>
