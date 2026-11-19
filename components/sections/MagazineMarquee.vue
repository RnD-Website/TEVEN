<script setup lang="ts">
/**
 * SECTION 08 — TEVEN Tea Journal (editorial showcase).
 * Reference ("D de Delta"): two endless photo rows moving in opposite
 * directions, accelerated by scroll velocity, around a centred title,
 * description and CTA.
 */
import { gsap } from 'gsap'
import { magazine } from '~/data/site'

const root = ref<HTMLElement | null>(null)
const rowA = ref<HTMLElement | null>(null)
const rowB = ref<HTMLElement | null>(null)

let tick: (() => void) | null = null
let io: IntersectionObserver | null = null

onMounted(() => {
  const lenis = useLenis()
  const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches
  const rows = [
    { el: rowA.value!, x: 0, dir: -1 },
    { el: rowB.value!, x: 0, dir: 1 }
  ]
  let boost = 0
  let visible = false
  io = new IntersectionObserver(([e]) => { visible = e.isIntersecting }, { rootMargin: '200px' })
  if (root.value) io.observe(root.value)

  tick = () => {
    if (!visible || reduced) return
    const v = lenis?.velocity ?? 0
    boost += (Math.abs(v) * 0.6 - boost) * 0.08
    const sign = (lenis?.direction ?? 1) >= 0 ? 1 : -1
    rows.forEach((r) => {
      const half = r.el.scrollWidth / 2
      r.x += (0.45 + boost) * r.dir * sign
      r.x = gsap.utils.wrap(-half, 0, r.x)
      r.el.style.transform = `translate3d(${r.x}px,0,0)`
    })
  }
  rows[1].x = -(rows[1].el.scrollWidth / 2) * 0.5
  gsap.ticker.add(tick)
})
onBeforeUnmount(() => {
  if (tick) gsap.ticker.remove(tick)
  io?.disconnect()
})

useGsapContext(root, () => {
  revealLines('.mag__head .line-inner', { trigger: '.mag__head' })
  riseIn('.mag__fade', { trigger: '.mag__head', start: 'top 75%' })
  gsap.from('.mag__row', { autoAlpha: 0, y: 60, duration: 1.4, stagger: 0.15, ease: 'expo.out', scrollTrigger: { trigger: root.value, start: 'top 80%', once: true } })
})
</script>

<template>
  <section ref="root" class="mag" aria-labelledby="mag-title">
    <div class="mag__row">
      <ul ref="rowA" class="mag__track">
        <li v-for="(item, i) in [...magazine.rowA, ...magazine.rowA]" :key="`a${i}`" class="mag__item" :aria-hidden="i >= magazine.rowA.length">
          <NuxtLink to="/journal" class="mag__link" :tabindex="i >= magazine.rowA.length ? -1 : 0">
            <TImg :src="item.image" :width="420" sizes="12vw" :alt="item.caption" cover />
            <span class="mag__cap t-small">{{ item.caption }}</span>
          </NuxtLink>
        </li>
      </ul>
    </div>

    <div class="mag__head g-row is-center">
      <div class="g-center-20 mag__col">
        <SplitTitle id="mag-title" :lines="magazine.titleLines" size="title-2" class="t-center" />
        <p class="t-headline-6 mag__text mag__fade">{{ magazine.text }}</p>
        <div class="mag__fade"><PillButton :label="magazine.cta.label" :to="magazine.cta.to" icon="arrow-top-right" /></div>
      </div>
    </div>

    <div class="mag__row">
      <ul ref="rowB" class="mag__track">
        <li v-for="(item, i) in [...magazine.rowB, ...magazine.rowB]" :key="`b${i}`" class="mag__item" :aria-hidden="i >= magazine.rowB.length">
          <NuxtLink to="/journal" class="mag__link" :tabindex="i >= magazine.rowB.length ? -1 : 0">
            <TImg :src="item.image" :width="420" sizes="12vw" :alt="item.caption" cover />
            <span class="mag__cap t-small">{{ item.caption }}</span>
          </NuxtLink>
        </li>
      </ul>
    </div>
  </section>
</template>

<style scoped>
.mag { position: relative; padding-block: 2.4rem clamp(6rem, 6vw, 10rem); background: var(--bg); overflow: hidden; }
.mag__row { overflow: hidden; }
.mag__track { display: flex; gap: var(--gutter); width: max-content; will-change: transform; }
.mag__item { width: clamp(12rem, 12.4vw, 20rem); flex: none; }
.mag__link {
  position: relative;
  display: block;
  aspect-ratio: 0.7;
  border-radius: var(--r-xs);
  overflow: hidden;
}
.mag__link :deep(img) { transition: transform 1.2s var(--ease-out), filter 0.6s; }
.mag__cap {
  position: absolute;
  left: 0.8rem;
  right: 0.8rem;
  bottom: 0.8rem;
  padding: 0.6rem 1rem;
  border-radius: var(--r-pill);
  background: rgba(13, 23, 18, 0.72);
  backdrop-filter: blur(8px);
  text-align: center;
  opacity: 0;
  transform: translateY(0.8rem);
  transition: opacity 0.5s var(--ease-out), transform 0.6s var(--ease-out);
}
@media (hover: hover) {
  .mag__link:hover :deep(img) { transform: scale(1.08); }
  .mag__link:hover .mag__cap { opacity: 1; transform: none; }
}
.mag__head { padding-block: clamp(6rem, 7vw, 11rem); }
.mag__col { display: grid; justify-items: center; gap: 2.8rem; text-align: center; }
.mag__text { color: var(--fg-muted); max-width: 60rem; }

@media (max-width: 767px) {
  .mag__item { width: 30vw; }
}
</style>
