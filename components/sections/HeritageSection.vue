<script setup lang="ts">
/**
 * SECTION 06 (+03) — Brand heritage.
 * Reference: centred condensed headline with small inline words, CTA,
 * paragraph, then a pinned "camera" where archival photos orbit a central
 * image along faint concentric rings as you scroll. Clicking a photo brings
 * it to the centre with its caption.
 */
import { gsap } from 'gsap'
import { heritage } from '~/data/site'

const root = ref<HTMLElement | null>(null)
const camera = ref<HTMLElement | null>(null)
const selected = ref<number | null>(null)
const centerImage = computed(() => (selected.value === null ? heritage.center : heritage.orbit[selected.value]))

// Orbit layout: [ring index, base angle (deg), size scale, tilt]
const layout = [
  [1, -112, 1, -4], [1, -50, 0.9, 5], [1, 8, 1.05, -3], [1, 70, 0.92, 4],
  [0, -150, 0.8, 3], [0, 150, 0.85, -5], [1, 128, 0.95, 6], [1, 188, 0.88, -2]
] as const

const rotation = { value: 0 }

function place() {
  const el = camera.value
  if (!el) return
  const w = el.clientWidth
  const h = el.clientHeight
  const mobile = w < 768
  const radii = mobile ? [w * 0.36, w * 0.46] : [Math.min(w, h * 1.6) * 0.26, Math.min(w, h * 1.6) * 0.4]
  const squash = mobile ? 1.25 : 0.82
  el.querySelectorAll<HTMLElement>('.orbit__item').forEach((item, i) => {
    const [ring, base] = layout[i]
    const a = ((base + rotation.value * (ring ? 1 : -1.3)) * Math.PI) / 180
    const r = radii[ring]
    gsap.set(item, { x: Math.cos(a) * r, y: Math.sin(a) * r * squash })
  })
}

function select(i: number) {
  selected.value = selected.value === i ? null : i
  const c = root.value?.querySelector('.orbit__center')
  if (c) gsap.fromTo(c, { scale: 0.92, rotate: -3 }, { scale: 1, rotate: 0, duration: 1, ease: 'expo.out' })
}

useGsapContext(root, () => {
  revealLines('.heritage__head .line-inner', { trigger: '.heritage__head' })
  riseIn('.heritage__fade', { trigger: '.heritage__head', start: 'top 70%', stagger: 0.1 })

  place()
  gsap.from('.orbit__item', { scale: 0, autoAlpha: 0, duration: 1.4, stagger: 0.06, ease: 'expo.out', scrollTrigger: { trigger: camera.value, start: 'top 70%', once: true } })
  gsap.from('.orbit__center', { scale: 0.7, autoAlpha: 0, duration: 1.6, ease: 'expo.out', scrollTrigger: { trigger: camera.value, start: 'top 70%', once: true } })
  gsap.from('.orbit__ring', { scale: 0.4, autoAlpha: 0, duration: 2, stagger: 0.1, ease: 'expo.out', scrollTrigger: { trigger: camera.value, start: 'top 75%', once: true } })

  // Pinned scroll — orbit rotation + subtle camera zoom
  gsap.timeline({
    scrollTrigger: {
      trigger: camera.value,
      start: 'top top',
      end: '+=120%',
      pin: true,
      scrub: 1,
      onUpdate: place
    }
  })
    .to(rotation, { value: 70, ease: 'none', onUpdate: place }, 0)
    .fromTo('.orbit__rings', { scale: 0.9 }, { scale: 1.08, ease: 'none' }, 0)
    .fromTo('.orbit__center', { scale: 0.92 }, { scale: 1.06, ease: 'none' }, 0)

  window.addEventListener('resize', place)
  return () => window.removeEventListener('resize', place)
})
</script>

<template>
  <section ref="root" class="heritage" aria-labelledby="heritage-title">
    <div class="heritage__head g-row is-center">
      <div class="g-center-16 heritage__col">
        <SplitTitle id="heritage-title" :lines="heritage.titleLines" size="title-2" class="t-center" />
        <div class="heritage__fade"><PillButton :label="heritage.cta.label" :to="heritage.cta.to" /></div>
        <p class="heritage__text t-headline-6 heritage__fade">{{ heritage.text }}</p>
      </div>
    </div>

    <div ref="camera" class="orbit">
      <div class="orbit__rings" aria-hidden="true">
        <span class="orbit__ring is-1" />
        <span class="orbit__ring is-2" />
        <span class="orbit__ring is-3" />
      </div>

      <button
        v-for="(item, i) in heritage.orbit"
        :key="i"
        type="button"
        class="orbit__item"
        :class="{ 'is-selected': selected === i }"
        :style="{ '--s': layout[i][2], '--tilt': `${layout[i][3]}deg` }"
        :aria-label="item.caption"
        :aria-pressed="selected === i"
        @click="select(i)"
      >
        <span class="orbit__photo"><TImg :src="item.image" :width="500" sizes="18vw" :alt="item.caption" /></span>
      </button>

      <figure class="orbit__center">
        <div class="orbit__center-photo">
          <Transition name="swap" mode="out-in">
            <TImg :key="centerImage.image" :src="centerImage.image" :width="900" sizes="30vw" :alt="centerImage.caption" />
          </Transition>
        </div>
        <Transition name="swap" mode="out-in">
          <figcaption :key="centerImage.caption" class="orbit__caption t-small">{{ centerImage.caption }}</figcaption>
        </Transition>
      </figure>
    </div>
  </section>
</template>

<style scoped>
.heritage { position: relative; padding-top: clamp(8rem, 9vw, 14rem); background: var(--bg); }
.heritage__col { display: grid; justify-items: center; gap: 3.2rem; text-align: center; }
.heritage__text { max-width: 58rem; color: var(--fg-muted); }

.orbit {
  position: relative;
  height: 100svh;
  min-height: 60rem;
  overflow: hidden;
  display: grid;
  place-items: center;
}
.orbit__rings { position: absolute; inset: 0; display: grid; place-items: center; pointer-events: none; }
.orbit__ring {
  position: absolute;
  aspect-ratio: 1 / 0.82;
  border: 1px solid rgba(232, 216, 191, 0.12);
  border-radius: 50%;
}
.orbit__ring.is-1 { width: 34vw; }
.orbit__ring.is-2 { width: 54vw; }
.orbit__ring.is-3 { width: 80vw; border-style: dashed; border-color: rgba(232, 216, 191, 0.07); }

.orbit__item {
  position: absolute;
  left: 50%;
  top: 50%;
  width: calc(clamp(12rem, 12.5vw, 20rem) * var(--s));
  margin: calc(clamp(12rem, 12.5vw, 20rem) * var(--s) * -0.4) 0 0 calc(clamp(12rem, 12.5vw, 20rem) * var(--s) * -0.5);
  z-index: 2;
  will-change: transform;
}
.orbit__photo {
  display: block;
  position: relative;
  padding: 0.5rem;
  background: #f4ecdc;
  border-radius: 0.4rem;
  box-shadow: 0 1.6rem 3rem rgba(0, 0, 0, 0.35);
  transform: rotate(var(--tilt));
  transition: transform 0.8s var(--ease-out), box-shadow 0.6s;
}
/* Full, uncropped, full-colour photos: the frame follows each image's own shape */
.orbit__photo :deep(img) { display: block; width: 100%; height: auto; border-radius: 0.2rem; }
.orbit__item:hover .orbit__photo, .orbit__item.is-selected .orbit__photo { transform: rotate(0deg) scale(1.08); box-shadow: 0 2.4rem 4rem rgba(0, 0, 0, 0.45); }
.orbit__item.is-selected .orbit__photo { outline: 2px solid var(--c-beige-200); outline-offset: 3px; }

.orbit__center { position: relative; z-index: 1; display: grid; justify-items: center; gap: 1.6rem; width: clamp(26rem, 27vw, 44rem); }
.orbit__center-photo {
  position: relative;
  width: 100%;
  border-radius: 0.4rem;
  overflow: hidden;
  box-shadow: 0 3rem 6rem rgba(0, 0, 0, 0.45);
}
.orbit__center-photo :deep(img) { display: block; width: 100%; height: auto; }
.orbit__caption { max-width: 26rem; text-align: center; color: var(--fg-muted); min-height: 3em; }
.swap-enter-active, .swap-leave-active { transition: opacity 0.45s var(--ease-out); }
.swap-enter-from, .swap-leave-to { opacity: 0; }

@media (max-width: 767px) {
  .orbit__ring.is-1 { width: 72vw; }
  .orbit__ring.is-2 { width: 96vw; }
  .orbit__ring.is-3 { width: 130vw; }
  .orbit__item { width: calc(8.4rem * var(--s)); margin: calc(8.4rem * var(--s) * -0.4) 0 0 calc(8.4rem * var(--s) * -0.5); }
  .orbit__center { width: 56vw; }
}
</style>
