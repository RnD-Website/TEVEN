<script setup lang="ts">
import { gsap } from 'gsap'
import { navLeft, navRight, footer } from '~/data/site'
import type { ImageKey } from '~/data/images'

const open = useMenuOpen()
const route = useRoute()
const { lock, unlock } = useScrollLock()
const root = ref<HTMLElement | null>(null)
const expanded = ref<string | null>(null)
const hovered = ref(0)

const items = computed(() => {
  const imgs: ImageKey[] = ['harvestBaskets', 'teaSetWindow', 'spoonsLooseLeaf', 'teaRows', 'cupsAndLeaves', 'amberBowl']
  return [...navLeft, ...navRight].map((g, i) => ({ ...g, image: imgs[i % imgs.length] }))
})

let tl: gsap.core.Timeline | null = null

function build() {
  if (!root.value) return
  const q = gsap.utils.selector(root.value)
  tl = gsap.timeline({ paused: true, defaults: { ease: 'expo.out' } })
    .set(root.value, { autoAlpha: 1 })
    .fromTo(q('.menu__bg'), { clipPath: 'circle(0% at 4% 4%)' }, { clipPath: 'circle(150% at 4% 4%)', duration: 1.1, ease: 'expo.inOut' })
    .fromTo(q('.menu__item-inner'), { yPercent: 110 }, { yPercent: 0, duration: 1.1, stagger: 0.05 }, 0.45)
    .fromTo(q('.menu__fade'), { autoAlpha: 0, y: 20 }, { autoAlpha: 1, y: 0, duration: 0.9, stagger: 0.06 }, 0.65)
    .fromTo(q('.menu__visual'), { clipPath: 'inset(100% 0 0 0 round 2.4rem)' }, { clipPath: 'inset(0% 0 0 0 round 2.4rem)', duration: 1.2, ease: 'expo.inOut' }, 0.35)
}

watch(open, (v) => {
  if (!tl) build()
  if (v) {
    lock()
    tl?.timeScale(1).play(0)
    nextTick(() => root.value?.querySelector<HTMLElement>('.menu__close')?.focus())
  } else {
    unlock()
    tl?.timeScale(1.6).reverse()
  }
})

watch(() => route.fullPath, () => { open.value = false })

function onKey(e: KeyboardEvent) { if (e.key === 'Escape' && open.value) open.value = false }
onMounted(() => {
  gsap.set(root.value, { autoAlpha: 0 })
  window.addEventListener('keydown', onKey)
})
onBeforeUnmount(() => window.removeEventListener('keydown', onKey))
</script>

<template>
  <div ref="root" class="menu" role="dialog" aria-modal="true" aria-label="Site menu" :aria-hidden="!open" :inert="!open || undefined">
    <div class="menu__bg" />
    <div class="menu__wrap">
      <div class="menu__top">
        <NuxtLink to="/" class="menu__logo menu__fade" aria-label="TEVEN home"><TevenLogo /></NuxtLink>
        <button class="menu__close menu__fade t-label" type="button" @click="open = false">
          Close <TIcon name="close" />
        </button>
      </div>

      <div class="menu__body">
        <ul class="menu__list">
          <li v-for="(item, i) in items" :key="item.label" class="menu__item" :class="{ 'is-dim': hovered !== i }" @mouseenter="hovered = i">
            <div class="line">
              <div class="menu__item-inner">
                <button
                  v-if="item.children"
                  type="button"
                  class="menu__link t-title-3"
                  :aria-expanded="expanded === item.label"
                  @click="expanded = expanded === item.label ? null : item.label"
                >
                  {{ item.label }} <TIcon name="plus" class="menu__plus" :class="{ 'is-open': expanded === item.label }" />
                </button>
                <NuxtLink v-else :to="item.to" class="menu__link t-title-3">{{ item.label }}</NuxtLink>
              </div>
            </div>
            <Transition name="sub">
              <ul v-if="item.children && expanded === item.label" class="menu__sub">
                <li v-for="c in item.children" :key="c.to">
                  <NuxtLink :to="c.to" class="menu__sub-link">{{ c.label }}</NuxtLink>
                </li>
              </ul>
            </Transition>
          </li>
        </ul>

        <div class="menu__visual is-desktop-only">
          <TransitionGroup name="vis">
            <TImg
              v-for="(item, i) in items"
              v-show="hovered === i"
              :key="item.label"
              :src="item.image"
              :width="1000"
              sizes="36vw"
              :alt="item.label"
              cover
            />
          </TransitionGroup>
          <div class="menu__visual-caption menu__fade">
            <span class="t-label">{{ items[hovered]?.label }}</span>
          </div>
        </div>
      </div>

      <div class="menu__bottom menu__fade">
        <ul class="menu__social">
          <li v-for="s in footer.social" :key="s.label">
            <a :href="s.href" target="_blank" rel="noopener" :aria-label="s.label"><TIcon :name="s.icon" /></a>
          </li>
        </ul>
        <span class="t-small menu__copy">{{ footer.copyright }}</span>
      </div>
    </div>
  </div>
</template>

<style scoped>
.menu {
  position: fixed;
  inset: 0;
  z-index: var(--z-menu);
  visibility: hidden;
}
.menu__bg {
  position: absolute;
  inset: 0;
  background: var(--c-forest-800);
  background-image: radial-gradient(120% 80% at 80% 10%, rgba(138, 154, 123, 0.16), transparent 60%);
}
.menu__wrap {
  position: relative;
  display: flex;
  flex-direction: column;
  height: 100%;
  padding: 2rem var(--page-pad) 2.4rem;
  overflow-y: auto;
  overscroll-behavior: contain;
}
.menu__top { display: flex; justify-content: space-between; align-items: flex-start; }
.menu__logo { width: 6.4rem; margin-top: -2rem; }
.menu__close {
  display: inline-flex;
  align-items: center;
  gap: 0.8rem;
  height: 4.4rem;
  padding-inline: 2rem;
  border-radius: var(--r-pill);
  background: var(--c-beige-200);
  color: var(--ink);
}
.menu__close :deep(svg) { font-size: 1.6rem; }

.menu__body {
  flex: 1;
  display: grid;
  grid-template-columns: 1.2fr 1fr;
  gap: 4rem;
  align-items: center;
  padding-block: 4rem;
}
.menu__item { transition: opacity 0.5s var(--ease-out); }
.menu__list:hover .menu__item.is-dim { opacity: 0.35; }
.menu__link {
  display: inline-flex;
  align-items: center;
  gap: 1.6rem;
  color: var(--c-beige-200);
  line-height: 0.95;
}
.menu__plus { font-size: 0.4em; transition: transform 0.5s var(--ease-out); }
.menu__plus.is-open { transform: rotate(45deg); }
.menu__sub { display: flex; flex-wrap: wrap; gap: 0.8rem 2.4rem; padding: 1.2rem 0 2rem; }
.menu__sub-link { font-size: 1.6rem; color: var(--fg-muted); transition: color 0.3s; }
.menu__sub-link:hover { color: var(--c-ivory-50); }
.sub-enter-active, .sub-leave-active { transition: opacity 0.4s var(--ease-out), transform 0.5s var(--ease-out); }
.sub-enter-from, .sub-leave-to { opacity: 0; transform: translateY(-1rem); }

.menu__visual {
  position: relative;
  aspect-ratio: 4 / 5;
  max-height: 68vh;
  justify-self: end;
  width: 100%;
  max-width: 52rem;
  border-radius: var(--r-l);
  overflow: hidden;
}
.menu__visual :deep(img) { transition: opacity 0.8s var(--ease-out), transform 1.4s var(--ease-out); }
.vis-enter-from { opacity: 0; transform: scale(1.08); }
.vis-leave-to { opacity: 0; }
.menu__visual-caption {
  position: absolute;
  left: 1.6rem;
  bottom: 1.6rem;
  padding: 1rem 1.6rem;
  border-radius: var(--r-pill);
  background: var(--glass);
  backdrop-filter: blur(12px);
}

.menu__bottom { display: flex; justify-content: space-between; align-items: center; gap: 2rem; }
.menu__social { display: flex; gap: 0.8rem; }
.menu__social a {
  display: grid;
  place-items: center;
  width: 4rem;
  height: 4rem;
  border-radius: 50%;
  background: rgba(246, 240, 228, 0.1);
  font-size: 1.8rem;
  transition: background 0.3s, color 0.3s;
}
.menu__social a:hover { background: var(--c-beige-200); color: var(--ink); }
.menu__copy { color: var(--fg-muted); }

@media (max-width: 1023px) {
  .menu__body { grid-template-columns: 1fr; align-items: start; }
  .is-desktop-only { display: none; }
  .menu__logo { margin-top: -1.6rem; width: 5.2rem; }
  .menu__link { font-size: clamp(3.6rem, 11vw, 6.4rem); }
}
</style>
