<script setup lang="ts">
/**
 * SECTION 13 — Sustainability.
 * Reference: deep-green block with a symmetrical botanical line illustration
 * that draws itself, a light-lime condensed headline with small inline words,
 * a pill CTA and two photographs drifting at the edges.
 */
import { gsap } from 'gsap'

const props = defineProps<{ content: { label: string; titleLines: string[]; text: string; cta: { label: string; to: string }; pillars: string[]; imageLeft: string; imageRight: string } }>()
const root = ref<HTMLElement | null>(null)

// Mirrored leaf sprig generator for the line illustration
function sprig(x: number, y: number, dir: 1 | -1, len = 120) {
  const stem = `M${x} ${y} q ${dir * len * 0.3} ${-len * 0.5} ${dir * len * 0.1} ${-len}`
  const leaves: string[] = []
  for (let i = 1; i <= 4; i++) {
    const t = i / 5
    const lx = x + dir * len * 0.18 * Math.sin(t * Math.PI)
    const ly = y - len * t
    leaves.push(`M${lx} ${ly} c ${dir * 18} -6 ${dir * 34} -2 ${dir * 42} 10 c ${dir * -14} 8 ${dir * -32} 4 ${dir * -42} -10 Z`)
    leaves.push(`M${lx} ${ly} c ${dir * -14} -10 ${dir * -26} -10 ${dir * -34} -2 c ${dir * 10} 10 ${dir * 24} 10 ${dir * 34} 2 Z`)
  }
  return [stem, ...leaves]
}

const art = computed(() => {
  const p: string[] = []
  // Central arch + sun
  p.push('M300 760 V420 a300 300 0 0 1 600 0 V760')
  p.push('M360 760 V430 a240 240 0 0 1 480 0 V760')
  p.push('M600 250 m-60 0 a60 60 0 1 0 120 0 a60 60 0 1 0 -120 0')
  for (let i = 0; i < 12; i++) {
    const a = (i / 12) * Math.PI * 2
    p.push(`M${600 + Math.cos(a) * 78} ${250 + Math.sin(a) * 78} L${600 + Math.cos(a) * 104} ${250 + Math.sin(a) * 104}`)
  }
  // Teapot in the arch
  p.push('M520 640 c0 -60 40 -96 80 -96 s80 36 80 96 z')
  p.push('M560 544 c0 -20 80 -20 80 0')
  p.push('M600 524 v-14')
  p.push('M680 600 c40 -10 60 -40 70 -70')
  p.push('M520 588 c-30 0 -40 30 -20 50')
  // Tea rows (terraces)
  for (let r = 0; r < 4; r++) {
    const y = 700 + r * 26
    p.push(`M380 ${y} q 55 -22 110 0 t 110 0 t 110 0 t 110 0`)
  }
  // Mirrored sprigs left & right
  ;[[180, 760, 1, 220], [120, 560, 1, 160], [240, 420, 1, 140], [1020, 760, -1, 220], [1080, 560, -1, 160], [960, 420, -1, 140]].forEach(([x, y, d, l]) => p.push(...sprig(x, y, d as 1 | -1, l)))
  // Border frieze
  p.push('M60 820 H1140')
  p.push('M60 836 H1140')
  for (let i = 0; i < 22; i++) p.push(`M${90 + i * 50} 828 l 12 -8 l 12 8 l -12 8 z`)
  return p
})

useGsapContext(root, () => {
  gsap.fromTo('.sus__art path', { strokeDashoffset: 1 }, {
    strokeDashoffset: 0,
    ease: 'none',
    stagger: { each: 0.01, from: 'center' },
    scrollTrigger: { trigger: root.value, start: 'top 75%', end: 'center 40%', scrub: 1 }
  })
  revealLines('.sus__title .line-inner', { trigger: '.sus__content', start: 'top 70%' })
  riseIn('.sus__fade', { trigger: '.sus__content', start: 'top 65%', stagger: 0.1 })
  parallax('.sus__photo.is-left', 25, root.value!)
  parallax('.sus__photo.is-right', -25, root.value!)
  gsap.from('.sus__photo', { clipPath: 'inset(0 0 100% 0)', duration: 1.6, ease: 'expo.inOut', stagger: 0.2, scrollTrigger: { trigger: root.value, start: 'top 60%', once: true } })
})
</script>

<template>
  <section ref="root" class="sus" aria-labelledby="sus-title">
    <svg class="sus__art" viewBox="0 0 1200 900" preserveAspectRatio="xMidYMid slice" aria-hidden="true">
      <path v-for="(d, i) in art" :key="i" :d="d" pathLength="1" />
    </svg>

    <div class="sus__photo is-left"><TImg :src="content.imageLeft" :width="700" sizes="18vw" alt="Tea-growing community" cover /></div>
    <div class="sus__photo is-right"><TImg :src="content.imageRight" :width="700" sizes="18vw" alt="Sustainably farmed tea rows" cover /></div>

    <div class="sus__content">
      <p class="t-label sus__fade">{{ content.label }}</p>
      <SplitTitle id="sus-title" :lines="content.titleLines" size="title-2" class="sus__title t-center" />
      <p class="t-headline-6 sus__text sus__fade">{{ content.text }}</p>
      <div class="sus__fade"><PillButton :label="content.cta.label" :to="content.cta.to" tone="lime" /></div>
      <ul class="sus__pillars sus__fade" aria-label="Our commitments">
        <li v-for="(pl, i) in content.pillars" :key="pl"><span class="t-num">{{ String(i + 1).padStart(2, '0') }}</span>{{ pl }}</li>
      </ul>
    </div>
  </section>
</template>

<style scoped>
.sus {
  position: relative;
  min-height: 130svh;
  display: grid;
  place-items: center;
  padding: clamp(10rem, 12vw, 18rem) var(--page-pad);
  background: var(--c-forest-900);
  color: var(--c-lime-100);
  overflow: hidden;
}
.sus__art { position: absolute; inset: 0; width: 100%; height: 100%; }
.sus__art path { fill: none; stroke: var(--c-sage-500); stroke-opacity: 0.38; stroke-width: 1.2; stroke-dasharray: 1; stroke-dashoffset: 1; vector-effect: non-scaling-stroke; }

.sus__content {
  position: relative;
  z-index: 2;
  display: grid;
  justify-items: center;
  gap: 2.8rem;
  max-width: 96rem;
  text-align: center;
}
.sus__content::before {
  content: '';
  position: absolute;
  inset: -8rem -12rem;
  z-index: -1;
  background: radial-gradient(closest-side, rgba(13, 23, 18, 0.95), rgba(13, 23, 18, 0.7) 60%, transparent);
}
.sus__title { color: var(--c-lime-100); }
.sus__text { color: rgba(230, 236, 196, 0.78); max-width: 58rem; }
.sus__pillars { display: flex; flex-wrap: wrap; justify-content: center; gap: 0.8rem; margin-top: 1.6rem; }
.sus__pillars li {
  display: inline-flex;
  gap: 0.8rem;
  padding: 0.8rem 1.4rem;
  border-radius: var(--r-pill);
  border: 1px solid rgba(230, 236, 196, 0.22);
  font-size: 1.3rem;
  font-weight: 600;
}
.sus__pillars .t-num { opacity: 0.55; }

.sus__photo {
  position: absolute;
  z-index: 1;
  width: clamp(14rem, 14vw, 22rem);
  aspect-ratio: 0.82;
  border-radius: var(--r-xs);
  overflow: hidden;
  box-shadow: 0 2rem 4rem rgba(0, 0, 0, 0.4);
}
.sus__photo.is-left { left: 0; top: 34%; }
.sus__photo.is-right { right: 0; top: 58%; aspect-ratio: 1.4; width: clamp(16rem, 17vw, 26rem); }

@media (max-width: 767px) {
  .sus__photo { width: 30vw; }
  .sus__photo.is-left { top: 6%; }
  .sus__photo.is-right { top: auto; bottom: 4%; width: 38vw; }
}
</style>
