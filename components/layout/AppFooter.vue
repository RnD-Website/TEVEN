<script setup lang="ts">
import { footer } from '~/data/site'

const props = withDefaults(defineProps<{ overlay?: boolean }>(), { overlay: false })
const cookiePanel = useCookiePanel()
const quizOpen = useQuizOpen()
const root = ref<HTMLElement | null>(null)

function onMainClick(e: MouseEvent, to: string) {
  if (to === '/quiz') {
    e.preventDefault()
    quizOpen.value = true
  }
}

function onSummary(e: MouseEvent) {
  if (window.innerWidth >= 1024) e.preventDefault()
}

// Columns are accordions on mobile (closed by default), open lists on desktop
onMounted(() => {
  if (window.innerWidth < 1024) root.value?.querySelectorAll('details').forEach((d) => d.removeAttribute('open'))
})

useGsapContext(root, () => {
  riseIn('.footer__reveal', { trigger: root.value!, start: 'top 90%', stagger: 0.06, y: 30 })
})
</script>

<template>
  <footer ref="root" class="footer" :class="{ 'is-overlay': props.overlay }">
    <div class="footer__panel">
      <div class="footer__top footer__reveal">
        <NuxtLink to="/" class="footer__logo" aria-label="TEVEN home"><TevenLogo variant="outline" /></NuxtLink>
        <ul class="footer__social">
          <li v-for="s in footer.social" :key="s.label">
            <a :href="s.href" target="_blank" rel="noopener" :aria-label="s.label"><TIcon :name="s.icon" /></a>
          </li>
        </ul>
      </div>

      <div class="footer__grid">
        <details v-for="col in footer.columns" :key="col.title" class="footer__col footer__reveal" open>
          <summary class="footer__title t-label" @click="onSummary">{{ col.title }} <TIcon name="chevron-down" class="footer__chev" /></summary>
          <ul class="footer__links">
            <li v-for="l in col.links" :key="l.to"><NuxtLink :to="l.to" class="footer__link">{{ l.label }}</NuxtLink></li>
          </ul>
        </details>

        <ul class="footer__main footer__reveal">
          <li v-for="l in footer.main" :key="l.to">
            <NuxtLink :to="l.to" class="footer__main-link t-label" @click="onMainClick($event, l.to)">{{ l.label }}</NuxtLink>
          </li>
        </ul>

        <div class="footer__extra footer__reveal">
          <ul class="footer__links">
            <li v-for="l in footer.extra" :key="l.to"><NuxtLink :to="l.to" class="footer__link">{{ l.label }}</NuxtLink></li>
            <li><button type="button" class="footer__link" @click="cookiePanel = true">Cookie settings</button></li>
          </ul>
          <dl class="footer__contact">
            <div v-for="c in footer.contact" :key="c.label">
              <dt class="t-label">{{ c.label }}</dt>
              <dd><a :href="c.href" class="footer__link">{{ c.value }}</a></dd>
            </div>
          </dl>
        </div>
      </div>

      <div class="footer__bottom footer__reveal">
        <span class="t-small">{{ footer.copyright }}</span>
        <span class="t-small footer__muted">Premium tea · Origins · Craft</span>
      </div>
    </div>
  </footer>
</template>

<style scoped>
.footer {
  position: relative;
  z-index: 2;
  padding: 0 var(--page-pad) var(--page-pad);
  background: var(--c-forest-800);
}
.footer.is-overlay {
  margin-top: -62svh;
  background: transparent;
}
.footer__panel {
  padding: 4rem clamp(2rem, 3vw, 4.8rem) 2.4rem;
  border-radius: var(--r-l);
  background: rgba(13, 23, 18, 0.62);
  backdrop-filter: blur(28px) saturate(1.1);
  -webkit-backdrop-filter: blur(28px) saturate(1.1);
  color: var(--c-ivory-50);
}
.footer:not(.is-overlay) .footer__panel { background: var(--c-forest-700); }

.footer__top { display: flex; justify-content: space-between; align-items: center; padding-bottom: 4rem; }
.footer__logo { width: 5.6rem; }
.footer__social { display: flex; gap: 0.8rem; }
.footer__social a {
  display: grid; place-items: center;
  width: 4rem; height: 4rem;
  border-radius: 50%;
  background: var(--c-ivory-50);
  color: var(--ink);
  font-size: 1.8rem;
  transition: transform 0.5s var(--ease-out), background 0.3s;
}
.footer__social a:hover { transform: translateY(-0.3rem); background: var(--c-beige-200); }

.footer__grid {
  display: grid;
  grid-template-columns: 1fr 1fr 1.2fr 1.3fr;
  gap: 3.2rem;
  padding-block: 4rem;
  border-top: 1px solid var(--line-dark);
  border-bottom: 1px solid var(--line-dark);
}
.footer__title {
  display: flex;
  justify-content: space-between;
  align-items: center;
  list-style: none;
  cursor: default;
  margin-bottom: 1.8rem;
}
.footer__title::-webkit-details-marker { display: none; }
.footer__chev { display: none; }
.footer__links { display: flex; flex-direction: column; gap: 1rem; }
.footer__link {
  font-size: 1.4rem;
  color: var(--fg-muted);
  text-align: left;
  transition: color 0.3s;
}
.footer__link:hover { color: var(--c-ivory-50); }
.footer__main { display: flex; flex-direction: column; gap: 1.6rem; }
.footer__main-link { font-size: 1.4rem; transition: color 0.3s; }
.footer__main-link:hover { color: var(--c-beige-200); }
.footer__extra { display: grid; gap: 2.4rem; }
.footer__contact { display: grid; gap: 1.2rem; margin: 0; }
.footer__contact dt { color: var(--fg-muted); margin-bottom: 0.4rem; font-size: 1.05rem; }
.footer__contact dd { margin: 0; }
.footer__contact .footer__link { color: var(--c-ivory-50); font-size: 1.6rem; }

.footer__bottom { display: flex; justify-content: space-between; gap: 1.6rem; padding-top: 2.4rem; }
.footer__muted { color: var(--fg-muted); }

@media (max-width: 1023px) {
  .footer.is-overlay { margin-top: -40svh; }
  .footer__grid { grid-template-columns: 1fr; gap: 0; padding-block: 0; }
  .footer__col { border-bottom: 1px solid var(--line-dark); }
  .footer__title { margin: 0; padding-block: 2rem; cursor: pointer; }
  .footer__chev { display: block; font-size: 1.4rem; transition: transform 0.4s var(--ease-out); }
  .footer__col[open] .footer__chev { transform: rotate(180deg); }
  .footer__col .footer__links { padding-bottom: 2rem; }
  .footer__main { padding-block: 2.4rem; border-bottom: 1px solid var(--line-dark); }
  .footer__extra { padding-block: 2.4rem; }
  .footer__bottom { flex-direction: column; }
}
</style>
