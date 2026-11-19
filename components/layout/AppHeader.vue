<script setup lang="ts">
import { gsap } from 'gsap'
import { navLeft, navRight, type NavGroup } from '~/data/site'

const menuOpen = useMenuOpen()
const active = ref<number | null>(null)
const panel = ref<HTMLElement | null>(null)
const nav = ref<HTMLElement | null>(null)
const route = useRoute()
let closeTimer: ReturnType<typeof setTimeout> | undefined

const groups = computed<NavGroup[]>(() => navLeft.filter((g) => g.children))
const activeGroup = computed(() => (active.value === null ? null : navLeft[active.value]))

let openedAt = 0
function openGroup(i: number) {
  clearTimeout(closeTimer)
  if (!navLeft[i]?.children) return close()
  if (active.value !== i) openedAt = Date.now()
  active.value = i
}
function toggleGroup(i: number) {
  // A click right after hover-open should keep the panel open
  if (active.value === i && Date.now() - openedAt > 450) close()
  else openGroup(i)
}
function cancelClose() {
  clearTimeout(closeTimer)
}
function close() {
  active.value = null
}
function scheduleClose() {
  clearTimeout(closeTimer)
  closeTimer = setTimeout(close, 220)
}

watch(active, async (val, old) => {
  await nextTick()
  if (!panel.value) return
  if (val !== null) {
    gsap.to(panel.value, { height: 'auto', autoAlpha: 1, duration: 0.7, ease: 'expo.out' })
    gsap.fromTo(panel.value.querySelectorAll('[data-drop-item]'),
      { y: 24, autoAlpha: 0 },
      { y: 0, autoAlpha: 1, duration: 0.8, stagger: 0.05, ease: 'expo.out', delay: old === null ? 0.1 : 0 })
  } else {
    gsap.to(panel.value, { height: 0, autoAlpha: 0, duration: 0.5, ease: 'expo.inOut' })
  }
})

watch(() => route.fullPath, close)

function onKey(e: KeyboardEvent) { if (e.key === 'Escape') close() }
onMounted(() => window.addEventListener('keydown', onKey))
onBeforeUnmount(() => window.removeEventListener('keydown', onKey))
</script>

<template>
  <header class="header">
    <!-- Desktop: menu trigger -->
    <button class="header__menu-btn is-desktop" type="button" aria-label="Open menu" :aria-expanded="menuOpen" @click="menuOpen = true">
      <TIcon name="menu" />
    </button>

    <!-- Mobile: language on the left -->
    <LangSelector class="header__lang is-mobile is-left" />

    <!-- Centre pill navigation with hanging badge -->
    <nav ref="nav" class="header__nav" aria-label="Main navigation" @mouseleave="scheduleClose" @mouseenter="cancelClose">
      <div class="nav-bar is-desktop">
        <ul class="nav-list">
          <li v-for="(item, i) in navLeft" :key="item.label">
            <button
              v-if="item.children"
              type="button"
              class="nav-link t-label"
              :class="{ 'is-active': active === i }"
              :aria-expanded="active === i"
              @click="toggleGroup(i)"
              @mouseenter="openGroup(i)"
            >
              {{ item.label }} <TIcon name="chevron-down" class="nav-chev" />
            </button>
            <NuxtLink v-else :to="item.to" class="nav-link t-label" @mouseenter="close">{{ item.label }}</NuxtLink>
          </li>
        </ul>
        <span class="nav-logo-gap" aria-hidden="true" />
        <ul class="nav-list">
          <li v-for="item in navRight" :key="item.label">
            <NuxtLink :to="item.to" class="nav-link t-label" @mouseenter="close">{{ item.label }}</NuxtLink>
          </li>
        </ul>
      </div>

      <NuxtLink to="/" class="header__logo" aria-label="TEVEN home">
        <TevenLogo />
      </NuxtLink>

      <!-- Mega dropdown panel -->
      <div ref="panel" class="drop is-desktop" :aria-hidden="active === null">
        <div v-if="activeGroup" class="drop__inner">
          <div class="drop__links">
            <p class="t-label drop__eyebrow" data-drop-item>{{ activeGroup.label }}</p>
            <NuxtLink v-for="c in activeGroup.children" :key="c.to" :to="c.to" class="drop__link t-serif-m" data-drop-item>
              {{ c.label }}
            </NuxtLink>
          </div>
          <div class="drop__cards">
            <NuxtLink v-for="card in activeGroup.cards" :key="card.title" :to="card.to" class="drop__card" data-drop-item>
              <div class="drop__card-img"><TImg :src="card.image" :width="700" sizes="20vw" :alt="card.title" cover /></div>
              <div class="drop__card-body">
                <span class="t-small">{{ card.title }}</span>
                <span class="drop__card-text">{{ card.text }}</span>
              </div>
              <RoundButton label="Open" size="s" class="drop__card-arrow" tabindex="-1" />
            </NuxtLink>
          </div>
        </div>
      </div>
    </nav>

    <!-- Desktop: language on the right -->
    <LangSelector class="header__lang is-desktop" />

    <!-- Mobile: MENU pill -->
    <button class="header__menu-pill is-mobile t-label" type="button" :aria-expanded="menuOpen" @click="menuOpen = true">Menu</button>
  </header>
</template>

<style scoped>
.header {
  position: fixed;
  inset: 0 0 auto 0;
  z-index: var(--z-header);
  display: flex;
  align-items: flex-start;
  justify-content: space-between;
  padding: 2rem var(--page-pad) 0;
  pointer-events: none;
}
.header > * { pointer-events: auto; }

.header__menu-btn {
  display: grid;
  place-items: center;
  width: 4.4rem;
  height: 4.4rem;
  border-radius: 50%;
  background: var(--glass);
  backdrop-filter: blur(14px);
  -webkit-backdrop-filter: blur(14px);
  color: var(--c-ivory-50);
  font-size: 2.2rem;
  transition: background 0.4s var(--ease-out), transform 0.4s var(--ease-out);
}
.header__menu-btn:hover { background: var(--c-beige-200); color: var(--ink); }

.header__nav {
  position: absolute;
  left: 50%;
  top: 2rem;
  transform: translateX(-50%);
  width: min(74vw, 106rem);
}
.nav-bar {
  display: flex;
  align-items: center;
  justify-content: space-between;
  height: 4.4rem;
  padding-inline: 1.2rem;
  border-radius: var(--r-pill);
  background: var(--glass);
  backdrop-filter: blur(14px);
  -webkit-backdrop-filter: blur(14px);
}
.nav-list { display: flex; gap: 0.4rem; }
.nav-logo-gap { width: 9rem; flex: none; }
.nav-link {
  display: inline-flex;
  align-items: center;
  gap: 0.4rem;
  height: 3.2rem;
  padding-inline: 1.2rem;
  border-radius: var(--r-pill);
  font-size: 1.15rem;
  color: var(--c-ivory-50);
  transition: background 0.35s var(--ease-out), color 0.35s var(--ease-out);
}
.nav-link:hover, .nav-link.is-active, .nav-link.router-link-active { background: rgba(246, 240, 228, 0.1); }
.nav-chev { font-size: 1rem; transition: transform 0.4s var(--ease-out); }
.nav-link.is-active .nav-chev { transform: rotate(180deg); }

.header__logo {
  position: absolute;
  left: 50%;
  top: -2rem;
  width: 7.2rem;
  transform: translateX(-50%);
  filter: drop-shadow(0 0.8rem 1.6rem rgba(0, 0, 0, 0.28));
  transition: transform 0.6s var(--ease-out);
}
.header__logo:hover { transform: translateX(-50%) translateY(0.3rem); }

/* Mega dropdown */
.drop {
  height: 0;
  margin-top: 0.8rem;
  overflow: hidden;
  visibility: hidden;
  opacity: 0;
  border-radius: var(--r-l);
  background: rgba(18, 32, 26, 0.94);
  backdrop-filter: blur(18px);
  -webkit-backdrop-filter: blur(18px);
  box-shadow: 0 3rem 6rem rgba(0, 0, 0, 0.3);
}
.drop__inner {
  display: grid;
  grid-template-columns: 1fr 1.6fr;
  gap: 3.2rem;
  padding: 3.2rem;
}
.drop__eyebrow { color: var(--fg-muted); margin-bottom: 1.6rem; }
.drop__links { display: flex; flex-direction: column; gap: 0.6rem; }
.drop__link { color: var(--c-ivory-50); transition: color 0.3s, transform 0.5s var(--ease-out); width: fit-content; }
.drop__link:hover { color: var(--c-beige-200); transform: translateX(0.8rem); }
.drop__cards { display: grid; grid-template-columns: 1fr 1fr; gap: 1.2rem; }
.drop__card {
  position: relative;
  display: flex;
  flex-direction: column;
  border-radius: var(--r-m);
  overflow: hidden;
  background: rgba(246, 240, 228, 0.06);
}
.drop__card-img { position: relative; aspect-ratio: 16 / 10; overflow: hidden; }
.drop__card-img :deep(img) { transition: transform 1.2s var(--ease-out); }
.drop__card:hover .drop__card-img :deep(img) { transform: scale(1.06); }
.drop__card-body { display: flex; flex-direction: column; gap: 0.4rem; padding: 1.4rem 6rem 1.6rem 1.6rem; }
.drop__card-text { font-size: 1.3rem; color: var(--fg-muted); }
.drop__card-arrow { position: absolute; right: 1.2rem; bottom: 1.4rem; }

.header__menu-pill {
  height: 4.4rem;
  padding-inline: 2rem;
  border-radius: var(--r-pill);
  background: var(--glass);
  backdrop-filter: blur(14px);
  -webkit-backdrop-filter: blur(14px);
  color: var(--c-ivory-50);
}

.is-mobile { display: none; }

@media (max-width: 1180px) {
  .header__nav { width: 84vw; }
  .nav-link { padding-inline: 0.8rem; font-size: 1.05rem; }
}

@media (max-width: 1023px) {
  .is-desktop { display: none !important; }
  .is-mobile { display: inline-flex; }
  .header { padding-top: 1.6rem; align-items: center; }
  .header__nav { top: 0; width: auto; }
  .header__logo { top: 0; width: 5.6rem; }
}
</style>
