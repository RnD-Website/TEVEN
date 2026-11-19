<script setup lang="ts">
import { languages } from '~/data/site'

const lang = useLanguage()
const open = ref(false)
const root = ref<HTMLElement | null>(null)

useHead({ htmlAttrs: { lang } })

function choose(code: string) {
  lang.value = code
  open.value = false
}

function onDoc(e: MouseEvent) {
  if (root.value && !root.value.contains(e.target as Node)) open.value = false
}
onMounted(() => document.addEventListener('click', onDoc))
onBeforeUnmount(() => document.removeEventListener('click', onDoc))
</script>

<template>
  <div ref="root" class="lang" :class="{ 'is-open': open }" @keydown.esc="open = false">
    <button
      class="lang__btn"
      type="button"
      :aria-expanded="open"
      aria-haspopup="listbox"
      aria-label="Select language"
      @click="open = !open"
    >
      <TIcon name="globe" class="lang__globe" />
      <span class="t-label">{{ lang.toUpperCase() }}</span>
      <TIcon name="chevron-down" class="lang__chev" />
    </button>
    <Transition name="lang-drop">
      <ul v-if="open" class="lang__list" role="listbox" :aria-activedescendant="`lang-${lang}`">
        <li v-for="l in languages" :id="`lang-${l.code}`" :key="l.code" role="option" :aria-selected="l.code === lang">
          <button type="button" class="lang__item" :class="{ 'is-active': l.code === lang }" @click="choose(l.code)">
            <span class="t-label">{{ l.code.toUpperCase() }}</span>
            <span>{{ l.label }}</span>
          </button>
        </li>
      </ul>
    </Transition>
  </div>
</template>

<style scoped>
.lang { position: relative; }
.lang__btn {
  display: inline-flex;
  align-items: center;
  gap: 0.8rem;
  height: 4.4rem;
  padding: 0 1.4rem 0 1rem;
  border-radius: var(--r-pill);
  background: var(--glass);
  backdrop-filter: blur(14px);
  -webkit-backdrop-filter: blur(14px);
  color: var(--c-ivory-50);
  transition: background 0.4s var(--ease-out);
}
.lang__btn:hover { background: rgba(38, 57, 46, 0.85); }
.lang__globe { font-size: 2rem; }
.lang__chev { font-size: 1.2rem; transition: transform 0.4s var(--ease-out); }
.is-open .lang__chev { transform: rotate(180deg); }
.lang__list {
  position: absolute;
  top: calc(100% + 0.8rem);
  right: 0;
  min-width: 18rem;
  padding: 0.6rem;
  border-radius: var(--r-m);
  background: rgba(18, 32, 26, 0.94);
  backdrop-filter: blur(16px);
  -webkit-backdrop-filter: blur(16px);
  box-shadow: 0 2rem 4rem rgba(0, 0, 0, 0.3);
}
.lang__item {
  display: flex;
  gap: 1.2rem;
  align-items: center;
  width: 100%;
  padding: 1rem 1.2rem;
  border-radius: var(--r-s);
  font-size: 1.4rem;
  color: var(--fg-muted);
  transition: background 0.3s, color 0.3s;
}
.lang__item:hover, .lang__item.is-active { background: rgba(246, 240, 228, 0.08); color: var(--c-ivory-50); }
.lang-drop-enter-active, .lang-drop-leave-active { transition: opacity 0.35s var(--ease-out), transform 0.45s var(--ease-out); }
.lang-drop-enter-from, .lang-drop-leave-to { opacity: 0; transform: translateY(-0.8rem) scale(0.98); }
:global(.lang.is-left) .lang__list { left: 0; right: auto; }
</style>
