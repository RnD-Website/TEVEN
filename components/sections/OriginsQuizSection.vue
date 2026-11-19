<script setup lang="ts">
/**
 * SECTIONS 10 + 11 — Tea-origin showcase + Tea Discovery Quiz.
 * Reference: a pinned paper-coloured stage where dozens of packs revolve on
 * a 3D cylinder (depth scale, blur and fade), repeated in a steady rhythm,
 * around the centred quiz call-to-action.
 */
import { gsap } from 'gsap'
import { quizIntro } from '~/data/site'

const props = defineProps<{ origins: { slug: string; product?: string; country: string; tea: string; color: string }[] }>()
const quizOpen = useQuizOpen()
const root = ref<HTMLElement | null>(null)
const stage = ref<HTMLElement | null>(null)

// Two laps of the origins (10 origins = 20 packs)
const packs = computed(() => [...props.origins, ...props.origins].map((o, i, all) => ({
  ...o,
  key: `${o.slug}-${i}`,
  angle: (i / all.length) * Math.PI * 2,
  y: [-0.32, 0.02, 0.34, -0.12, 0.22, -0.4][i % 6],
  dup: i >= props.origins.length
})))

const state = { rot: 0, drift: 0 }
let tick: (() => void) | null = null
let io: IntersectionObserver | null = null

function layout() {
  const el = stage.value
  if (!el) return
  const w = el.clientWidth
  const h = el.clientHeight
  const R = Math.min(w * 0.46, 760)
  const items = el.querySelectorAll<HTMLElement>('.pack')
  items.forEach((item, i) => {
    const p = packs.value[i]
    const a = p.angle + state.rot + state.drift
    const x = Math.sin(a) * R
    const z = Math.cos(a) // -1 (back) → 1 (front)
    const depth = (z + 1) / 2
    const scale = 0.5 + depth * 0.62
    item.style.transform = `translate3d(${x}px, ${p.y * h}px, 0) scale(${scale}) rotate(${Math.sin(a) * -8}deg)`
    item.style.zIndex = String(Math.round(depth * 100))
    item.style.opacity = String(0.25 + depth * 0.75)
    item.style.filter = depth < 0.35 ? `blur(${(0.35 - depth) * 10}px)` : 'none'
  })
}

onMounted(() => {
  const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches
  let visible = false
  io = new IntersectionObserver(([e]) => { visible = e.isIntersecting })
  if (root.value) io.observe(root.value)
  tick = () => {
    if (!visible) return
    if (!reduced) state.drift += 0.0016
    layout()
  }
  gsap.ticker.add(tick)
  layout()
})
onBeforeUnmount(() => {
  if (tick) gsap.ticker.remove(tick)
  io?.disconnect()
})

useGsapContext(root, () => {
  gsap.timeline({
    scrollTrigger: { trigger: stage.value, start: 'top top', end: '+=140%', pin: true, scrub: 1 }
  })
    .to(state, { rot: Math.PI * 1.1, ease: 'none' }, 0)
    .fromTo('.oq__content', { scale: 0.94 }, { scale: 1, ease: 'none' }, 0)

  revealLines('.oq__content .line-inner', { trigger: stage.value!, start: 'top 55%' })
  riseIn('.oq__fade', { trigger: stage.value!, start: 'top 50%', stagger: 0.1 })
  gsap.from('.pack', { autoAlpha: 0, yPercent: 40, duration: 1.4, stagger: 0.03, ease: 'expo.out', scrollTrigger: { trigger: root.value, start: 'top 70%', once: true } })
})
</script>

<template>
  <section ref="root" class="oq section-paper" aria-labelledby="oq-title">
    <div ref="stage" class="oq__stage">
      <div class="oq__cylinder" aria-label="Tea origins">
        <NuxtLink
          v-for="p in packs"
          :key="p.key"
          :to="`/origins/${p.slug}`"
          class="pack"
          :aria-hidden="p.dup"
          :tabindex="p.dup ? -1 : 0"
          :aria-label="`${p.country} — ${p.tea}`"
        >
          <TeaPack :slug="p.product ?? p.slug" :name="p.country" :sub="p.tea" :color="p.color" accent="#efe4cf" ink="#f6f0e4" priority />
          <span class="pack__tip t-small">{{ p.country }} · {{ p.tea }}</span>
        </NuxtLink>
      </div>

      <div class="oq__content">
        <p class="t-label oq__fade oq__label">{{ quizIntro.label }}</p>
        <SplitTitle id="oq-title" :lines="['Discover your', 'perfect cup.']" size="serif-l" class="t-center" />
        <p class="t-headline-6 oq__text oq__fade">{{ quizIntro.text }}</p>
        <div class="oq__fade">
          <PillButton :label="quizIntro.cta" tone="white" @click="quizOpen = true" />
        </div>
      </div>
    </div>
  </section>
</template>

<style scoped>
.oq { position: relative; overflow: hidden; }
.oq__stage {
  position: relative;
  height: 100svh;
  min-height: 64rem;
  display: grid;
  place-items: center;
  overflow: hidden;
  background:
    radial-gradient(60% 50% at 50% 50%, rgba(255, 255, 255, 0.6), transparent 70%),
    var(--paper);
}
.oq__cylinder { position: absolute; inset: 0; display: grid; place-items: center; }
.pack {
  position: absolute;
  left: 50%;
  top: 50%;
  width: clamp(8rem, 8.4vw, 13.6rem);
  margin: calc(clamp(8rem, 8.4vw, 13.6rem) * -0.7) 0 0 calc(clamp(8rem, 8.4vw, 13.6rem) * -0.5);
  will-change: transform, opacity;
  transition: filter 0.3s;
}
.pack__tip {
  position: absolute;
  left: 50%;
  top: -3rem;
  padding: 0.5rem 1rem;
  border-radius: var(--r-pill);
  background: var(--c-forest-800);
  color: var(--c-ivory-50);
  white-space: nowrap;
  transform: translate(-50%, 0.6rem);
  opacity: 0;
  pointer-events: none;
  transition: opacity 0.4s, transform 0.5s var(--ease-out);
}
.pack:hover .pack__tip, .pack:focus-visible .pack__tip { opacity: 1; transform: translate(-50%, 0); }

.oq__content {
  position: relative;
  z-index: 200;
  display: grid;
  justify-items: center;
  gap: 2.4rem;
  max-width: 64rem;
  padding: 4rem;
  text-align: center;
  pointer-events: none;
}
.oq__content :deep(a), .oq__content :deep(button) { pointer-events: auto; }
.oq__content::before {
  content: '';
  position: absolute;
  inset: -4rem -10rem;
  z-index: -1;
  background: radial-gradient(closest-side, rgba(241, 232, 216, 0.96), rgba(241, 232, 216, 0.75) 60%, transparent);
}
.oq__label { color: var(--c-sage-500); }
.oq__text { color: var(--ink-muted); max-width: 46rem; }
</style>
