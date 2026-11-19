<script setup lang="ts">
/**
 * SECTION 05 — Tea collection carousel.
 * Reference: row of coloured tiles with the pack shot, big condensed name,
 * optional script origin tag and a round arrow — horizontally draggable.
 */
import { gsap } from 'gsap'
import type { Product } from '~/data/site'
import { hasProductPhoto } from '~/data/mockups'

defineProps<{ products: Product[] }>()

const root = ref<HTMLElement | null>(null)
const viewport = ref<HTMLElement | null>(null)
const track = ref<HTMLElement | null>(null)
const { progress, atStart, atEnd, thumbRatio, step, scrollToProgress } = useDragTrack(viewport, track)

useGsapContext(root, () => {
  gsap.from('.tile', {
    y: 80,
    autoAlpha: 0,
    duration: 1.3,
    stagger: 0.07,
    ease: 'expo.out',
    scrollTrigger: { trigger: root.value, start: 'top 92%', once: true }
  })
  gsap.from('.tile__pouch-in', {
    yPercent: -20,
    
    duration: 1.6,
    stagger: 0.07,
    ease: 'expo.out',
    scrollTrigger: { trigger: root.value, start: 'top 92%', once: true }
  })
})
</script>

<template>
  <section ref="root" class="products" aria-labelledby="products-title">
    <h2 id="products-title" class="sr-only">The TEVEN tea collection</h2>
    <div ref="viewport" class="products__viewport">
      <ul ref="track" class="products__track">
        <li v-for="p in products" :key="p.slug" class="tile">
          <NuxtLink :to="`/products/${p.slug}`" class="tile__link" :aria-label="`${p.name} — ${p.origin}`" draggable="false">
            <div class="tile__box" :class="{ 'has-photo': hasProductPhoto(p.slug) }" :style="{ '--tile': p.color, '--tile-accent': p.accent }">
              <div v-if="hasProductPhoto(p.slug)" class="tile__photo">
                <ProductPhoto :slug="p.slug" :alt="`TEVEN ${p.name} tea tin`" sizes="(max-width: 767px) 68vw, 24vw" />
              </div>
              <template v-else>
              <div class="tile__pattern" aria-hidden="true" />
              <span class="tile__glow" aria-hidden="true" />
              <div class="tile__pouch">
                <div class="tile__pouch-in">
                  <TeaPack :slug="p.slug" :name="p.name" :sub="p.origin" :color="p.color" :accent="p.accent" :ink="p.ink" />
                </div>
              </div>
              <span class="tile__shadow" aria-hidden="true" />
              </template>
            </div>
            <div class="tile__meta">
              <span class="tile__origin">{{ p.origin }}</span>
              <h3 class="tile__name t-title-3">{{ p.name }}</h3>
              <span class="tile__notes t-small">{{ p.notes }}</span>
              <span class="tile__arrow" aria-hidden="true"><TIcon name="arrow-right" /></span>
            </div>
          </NuxtLink>
        </li>
      </ul>
    </div>

    <div class="products__controls">
      <RoundButton icon="arrow-left" label="Previous teas" :disabled="atStart" @click="step(-1)" />
      <TrackScrollbar :progress="progress" :ratio="thumbRatio" tone="light" @seek="scrollToProgress" />
      <RoundButton icon="arrow-right" label="Next teas" :disabled="atEnd" @click="step(1)" />
    </div>
  </section>
</template>

<style scoped>
.products {
  position: relative;
  z-index: 2;
  padding: 1.6rem 0 4rem;
  background: var(--bg);
}
.products__viewport {
  overflow: hidden;
  padding-inline: var(--page-pad);
  cursor: grab;
  touch-action: pan-y;
  user-select: none;
}
.products__viewport.is-dragging { cursor: grabbing; }
.products__track { display: flex; column-gap: var(--gutter); width: max-content; will-change: transform; }

.tile { width: clamp(26rem, 23.6vw, 38rem); flex: none; }
.tile__link { display: block; }
.tile__box {
  position: relative;
  aspect-ratio: 1.05;
  border-radius: var(--r-s);
  background: var(--tile);
  overflow: hidden;
  transition: transform 0.8s var(--ease-out), filter 0.6s;
}
.tile__pattern {
  position: absolute;
  inset: 0;
  opacity: 0.18;
  background-image: radial-gradient(circle at 20% 120%, var(--tile-accent) 0 18%, transparent 19%), radial-gradient(circle at 85% -20%, var(--tile-accent) 0 22%, transparent 23%);
}
.tile__photo { position: absolute; inset: 0; transition: transform 1.2s var(--ease-out); }
.tile__glow {
  position: absolute;
  inset: 12% 14% 22%;
  border-radius: 50%;
  background: radial-gradient(closest-side, rgba(255, 255, 255, 0.28), transparent);
  pointer-events: none;
}
.tile__pouch {
  position: absolute;
  left: 50%;
  top: 50%;
  width: 56%;
  transform: translate(-50%, -50%);
  transition: transform 0.9s var(--ease-out);
  z-index: 1;
}
.tile__shadow {
  position: absolute;
  left: 50%;
  bottom: 9%;
  width: 46%;
  height: 5%;
  border-radius: 50%;
  background: rgba(0, 0, 0, 0.32);
  filter: blur(10px);
  transform: translateX(-50%);
  transition: transform 0.9s var(--ease-out), opacity 0.9s;
}
.tile__meta { position: relative; display: grid; justify-items: center; gap: 0.4rem; padding-top: 1.6rem; text-align: center; }
.tile__origin { font-family: var(--ff-serif); font-style: italic; font-weight: 300; font-size: 1.5rem; color: var(--c-sage-300); }
.tile__name { font-size: clamp(2.6rem, 2.3vw, 3.6rem); color: var(--c-ivory-50); line-height: 0.95; }
.tile__notes { color: var(--fg-muted); }
.tile__arrow {
  display: grid;
  place-items: center;
  width: 3.6rem;
  height: 3.6rem;
  margin-top: 0.8rem;
  border-radius: 50%;
  background: rgba(246, 240, 228, 0.12);
  font-size: 1.3rem;
  transition: background 0.4s, color 0.4s, transform 0.6s var(--ease-out);
}
@media (hover: hover) {
  .tile__link:hover .tile__box { transform: translateY(-0.6rem); }
  .tile__link:hover .tile__pouch { transform: translate(-50%, -56%) rotate(-4deg) scale(1.05); }
  .tile__link:hover .tile__photo { transform: scale(1.06); }
  .tile__link:hover .tile__shadow { transform: translateX(-50%) scale(0.85); opacity: 0.7; }
  .tile__link:hover .tile__arrow { background: var(--c-beige-200); color: var(--ink); transform: translateX(0.4rem); }
}

.products__controls { display: flex; align-items: center; justify-content: center; gap: 1.2rem; padding-top: 3.2rem; }

@media (max-width: 767px) {
  .tile { width: 68vw; }
}
</style>
