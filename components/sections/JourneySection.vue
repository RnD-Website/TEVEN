<script setup lang="ts">
/**
 * SECTION 07 — The Journey of Tea.
 * Reference: full-bleed moving background, centred condensed title, a
 * flowing line that links four circular stage icons, stage labels, centred
 * description and CTA. Pinned + scrubbed: the line draws as you scroll and
 * each stage lights up in turn; stage buttons jump to their step.
 */
import { gsap } from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import { journey } from '~/data/site'

const root = ref<HTMLElement | null>(null)
const stage = ref<HTMLElement | null>(null)
const path = ref<SVGPathElement | null>(null)
const active = ref(0)
let st: ScrollTrigger | null = null

const nodes = [
  { x: 180, y: 330 },
  { x: 420, y: 150 },
  { x: 700, y: 320 },
  { x: 980, y: 140 }
]
const icons = ['origins', 'harvest', 'craft', 'tasting']

function goTo(i: number) {
  const lenis = useLenis()
  if (!st) { active.value = i; return }
  const target = st.start + (st.end - st.start) * ((i + 0.55) / journey.stages.length)
  lenis ? lenis.scrollTo(target, { duration: 1.4 }) : window.scrollTo({ top: target, behavior: 'smooth' })
}

useGsapContext(root, () => {
  revealLines('.journey__title .line-inner', { trigger: root.value!, start: 'top 60%' })

  // Background slow zoom / parallax (replaces the reference's video loop)
  gsap.fromTo('.journey__bg img', { scale: 1.25, yPercent: -6 }, {
    scale: 1, yPercent: 6, ease: 'none',
    scrollTrigger: { trigger: root.value, start: 'top bottom', end: 'bottom top', scrub: true }
  })

  const len = path.value?.getTotalLength() ?? 2000
  gsap.set(path.value, { strokeDasharray: len, strokeDashoffset: len })

  const tl = gsap.timeline({
    scrollTrigger: {
      trigger: stage.value,
      start: 'top top',
      end: '+=200%',
      pin: true,
      scrub: 0.8,
      onUpdate: (self) => {
        const i = Math.min(journey.stages.length - 1, Math.floor(self.progress * journey.stages.length * 0.999))
        if (i !== active.value) active.value = i
      }
    }
  })
  st = tl.scrollTrigger ?? null
  tl.to(path.value, { strokeDashoffset: 0, ease: 'none', duration: 1 }, 0)
    .fromTo('.jnode', { scale: 0.6, autoAlpha: 0.25 }, { scale: 1, autoAlpha: 1, stagger: 0.25, duration: 0.18, ease: 'power2.out' }, 0)
})

watch(active, async () => {
  await nextTick()
  const el = root.value?.querySelector('.journey__desc-text')
  if (el) gsap.fromTo(el, { y: 24, autoAlpha: 0 }, { y: 0, autoAlpha: 1, duration: 0.9, ease: 'expo.out' })
})
</script>

<template>
  <section ref="root" class="journey" aria-labelledby="journey-title">
    <div ref="stage" class="journey__stage">
      <div class="journey__bg" aria-hidden="true">
        <TImg :src="journey.image" :width="2200" alt="" cover />
        <div class="journey__shade" />
      </div>

      <SplitTitle id="journey-title" :lines="journey.titleLines" size="title-2" class="journey__title t-center" />

      <div class="journey__map">
        <svg class="journey__svg" viewBox="0 0 1200 500" preserveAspectRatio="none" aria-hidden="true">
          <path class="journey__path-ghost" d="M -20 440 C 80 440, 120 330, 180 330 C 260 330, 300 150, 420 150 C 540 150, 560 320, 700 320 C 840 320, 860 140, 980 140 C 1080 140, 1120 260, 1220 260" />
          <path ref="path" class="journey__path" d="M -20 440 C 80 440, 120 330, 180 330 C 260 330, 300 150, 420 150 C 540 150, 560 320, 700 320 C 840 320, 860 140, 980 140 C 1080 140, 1120 260, 1220 260" />
        </svg>

        <button
          v-for="(s, i) in journey.stages"
          :key="s.id"
          type="button"
          class="jnode"
          :class="{ 'is-active': active === i, 'is-past': i < active }"
          :style="{ left: `${(nodes[i].x / 1200) * 100}%`, top: `${(nodes[i].y / 500) * 100}%` }"
          :aria-label="`${s.num} ${s.label}`"
          :aria-current="active === i ? 'step' : undefined"
          @click="goTo(i)"
        >
          <span class="jnode__circle"><TIcon :name="icons[i]" /></span>
          <span class="jnode__label">{{ s.label }}</span>
        </button>
      </div>

      <div class="journey__desc">
        <div class="journey__tabs" role="tablist" aria-label="Stages of the tea journey">
          <button
            v-for="(s, i) in journey.stages"
            :key="s.id"
            type="button"
            role="tab"
            class="journey__tab t-label"
            :class="{ 'is-active': active === i }"
            :aria-selected="active === i"
            @click="goTo(i)"
          >
            <span class="t-num">{{ s.num }}</span> {{ s.label }}
          </button>
        </div>
        <p class="journey__desc-text t-headline-6" aria-live="polite">{{ journey.stages[active].text }}</p>
        <PillButton :label="journey.cta.label" :to="journey.cta.to" />
      </div>
    </div>
  </section>
</template>

<style scoped>
.journey { position: relative; background: var(--c-forest-900); }
.journey__stage {
  position: relative;
  height: 100svh;
  min-height: 52rem;
  display: grid;
  grid-template-rows: auto minmax(0, 1fr) auto;
  justify-items: center;
  align-items: center;
  row-gap: clamp(1.2rem, 2vh, 2.4rem);
  padding: calc(var(--header-h) + 1.2rem) var(--page-pad) clamp(2rem, 4vh, 4rem);
  overflow: hidden;
}
.journey__bg { position: absolute; inset: 0; overflow: hidden; }
.journey__shade {
  position: absolute;
  inset: 0;
  background: linear-gradient(180deg, rgba(13, 23, 18, 0.75) 0%, rgba(13, 23, 18, 0.35) 40%, rgba(13, 23, 18, 0.55) 70%, rgba(13, 23, 18, 0.9) 100%);
}
.journey__title { position: relative; color: var(--c-beige-200); font-size: min(var(--fs-title-2), 12vh); }

.journey__map {
  position: relative;
  align-self: center;
  /* fills the height left between title and description, never taller */
  width: min(100%, 120rem);
  height: 100%;
  max-height: 50rem;
  min-height: 18rem;
}
.journey__svg { position: absolute; inset: 0; width: 100%; height: 100%; overflow: visible; }
.journey__path, .journey__path-ghost { fill: none; stroke-width: 1.6; stroke-linecap: round; }
.journey__path-ghost { stroke: rgba(230, 236, 196, 0.18); stroke-dasharray: 4 8; }
.journey__path { stroke: var(--c-lime-100); }

.jnode {
  position: absolute;
  display: grid;
  justify-items: center;
  gap: 1.2rem;
  transform: translate(-50%, -50%);
  color: var(--c-ivory-50);
}
.jnode__circle {
  display: grid;
  place-items: center;
  width: clamp(5.6rem, min(9vw, 14vh), 13rem);
  aspect-ratio: 1;
  border-radius: 50%;
  border: 1.6px solid rgba(230, 236, 196, 0.55);
  background: rgba(13, 23, 18, 0.25);
  backdrop-filter: blur(4px);
  font-size: clamp(2.6rem, 3vw, 4.4rem);
  color: var(--c-lime-100);
  transition: background 0.6s var(--ease-out), color 0.6s, transform 0.8s var(--ease-out), border-color 0.6s;
}
.jnode:hover .jnode__circle { transform: scale(1.05); }
.jnode.is-active .jnode__circle { background: var(--c-lime-100); color: var(--c-forest-900); border-color: var(--c-lime-100); transform: scale(1.08); }
.jnode__label { font-family: var(--ff-sans); font-size: 1.4rem; font-weight: 600; }
.jnode:nth-child(odd of .jnode) .jnode__label { order: -1; }

.journey__desc { position: relative; display: grid; justify-items: center; gap: clamp(1.2rem, 2.2vh, 2.4rem); max-width: 62rem; text-align: center; }
.journey__tabs { display: flex; gap: 0.4rem; padding: 0.4rem; border-radius: var(--r-pill); background: rgba(13, 23, 18, 0.5); backdrop-filter: blur(10px); }
.journey__tab { padding: 0.9rem 1.4rem; border-radius: var(--r-pill); font-size: 1.1rem; color: var(--fg-muted); transition: background 0.4s, color 0.4s; }
.journey__tab.is-active { background: var(--c-ivory-50); color: var(--ink); }
.journey__desc-text { color: var(--c-ivory-50); min-height: 2.9em; }

@media (max-width: 767px) {
  .journey__map { width: 140%; max-width: none; margin-inline: -20%; }
  .jnode__label { font-size: 1.1rem; }
  .journey__tab { padding: 0.8rem 1rem; font-size: 1rem; }
  .journey__tab .t-num { display: none; }
}
</style>
