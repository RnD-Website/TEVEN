<script setup lang="ts">
/**
 * Built-in Cookie Control banner + preferences dialog.
 * Hidden automatically when Cookiebot is configured.
 * Uses Element Plus switches for the category toggles.
 */
const config = useRuntimeConfig().public
const { state, save, acceptAll, rejectAll } = useConsent()
const panel = useCookiePanel()
const mounted = ref(false)
const prefs = reactive({ analytics: false, marketing: false })

const showBanner = computed(() => mounted.value && !config.cookiebotId && !state.value.decided && !panel.value)

watch(panel, (v) => {
  if (v) {
    prefs.analytics = state.value.analytics
    prefs.marketing = state.value.marketing
  }
})

function savePrefs() {
  save({ ...prefs })
  panel.value = false
}
function accept() { acceptAll(); panel.value = false }
function reject() { rejectAll(); panel.value = false }

onMounted(() => {
  // let the intro loader finish first
  setTimeout(() => { mounted.value = true }, 2600)
})
</script>

<template>
  <ClientOnly>
    <Transition name="cookie">
      <section v-if="showBanner" class="cookie" role="region" aria-label="Cookie consent">
        <div class="cookie__text">
          <p class="t-label">Cookies at TEVEN</p>
          <p class="cookie__copy">
            We use essential cookies to run this site. With your permission we’d also use analytics and marketing cookies to understand how it’s used.
            <NuxtLink to="/cookie-policy" class="cookie__link">Cookie Policy</NuxtLink>
          </p>
        </div>
        <div class="cookie__actions">
          <button type="button" class="cookie__btn is-ghost" @click="panel = true">Preferences</button>
          <button type="button" class="cookie__btn is-ghost" @click="reject">Reject all</button>
          <button type="button" class="cookie__btn is-solid" @click="accept">Accept all</button>
        </div>
      </section>
    </Transition>

    <Transition name="cookie">
      <div v-if="panel" class="cookie-modal" role="dialog" aria-modal="true" aria-labelledby="cookie-title" @keydown.esc="panel = false">
        <div class="cookie-modal__backdrop" @click="panel = false" />
        <div class="cookie-modal__card">
          <h2 id="cookie-title" class="t-serif-m">Cookie preferences</h2>
          <p class="cookie__copy">Choose which cookies you allow. You can change this any time from “Cookie settings” in the footer.</p>
          <ul class="cookie-modal__list">
            <li>
              <div><strong>Necessary</strong><span>Required for the site to work. Always on.</span></div>
              <ElSwitch :model-value="true" disabled aria-label="Necessary cookies (always on)" />
            </li>
            <li>
              <div><strong>Analytics</strong><span>Google Analytics 4, Tag Manager, Hotjar and Umami.</span></div>
              <ElSwitch v-model="prefs.analytics" aria-label="Analytics cookies" />
            </li>
            <li>
              <div><strong>Marketing</strong><span>Personalised content and advertising measurement.</span></div>
              <ElSwitch v-model="prefs.marketing" aria-label="Marketing cookies" />
            </li>
          </ul>
          <div class="cookie__actions">
            <button type="button" class="cookie__btn is-ghost-dark" @click="reject">Reject all</button>
            <button type="button" class="cookie__btn is-ghost-dark" @click="savePrefs">Save choices</button>
            <button type="button" class="cookie__btn is-dark" @click="accept">Accept all</button>
          </div>
        </div>
      </div>
    </Transition>
  </ClientOnly>
</template>

<style scoped>
.cookie {
  position: fixed;
  left: var(--page-pad);
  right: var(--page-pad);
  bottom: var(--page-pad);
  z-index: var(--z-cookie);
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 2.4rem;
  max-width: 108rem;
  margin-inline: auto;
  padding: 2rem 2.4rem;
  border-radius: var(--r-l);
  background: rgba(18, 32, 26, 0.94);
  backdrop-filter: blur(18px);
  -webkit-backdrop-filter: blur(18px);
  box-shadow: 0 2rem 5rem rgba(0, 0, 0, 0.35);
  color: var(--c-ivory-50);
}
.cookie__text { display: grid; gap: 0.6rem; max-width: 60rem; }
.cookie__copy { font-size: 1.4rem; color: var(--fg-muted); }
.cookie-modal .cookie__copy { color: var(--ink-muted); }
.cookie__link { text-decoration: underline; text-underline-offset: 0.3rem; }
.cookie__actions { display: flex; flex-wrap: wrap; gap: 0.8rem; }
.cookie__btn {
  height: 4.4rem;
  padding-inline: 2rem;
  border-radius: var(--r-pill);
  font-size: 1.3rem;
  font-weight: 600;
  transition: background 0.3s, color 0.3s, border-color 0.3s;
}
.is-ghost { border: 1px solid rgba(246, 240, 228, 0.3); }
.is-ghost:hover { border-color: var(--c-ivory-50); }
.is-solid { background: var(--c-beige-200); color: var(--ink); }
.is-solid:hover { background: var(--c-ivory-50); }
.is-ghost-dark { border: 1px solid var(--line-light); color: var(--ink); }
.is-ghost-dark:hover { border-color: var(--ink); }
.is-dark { background: var(--c-forest-800); color: var(--c-ivory-50); }

.cookie-modal { position: fixed; inset: 0; z-index: var(--z-cookie); display: grid; place-items: center; padding: var(--page-pad); }
.cookie-modal__backdrop { position: absolute; inset: 0; background: rgba(13, 23, 18, 0.6); backdrop-filter: blur(6px); }
.cookie-modal__card {
  position: relative;
  display: grid;
  gap: 2rem;
  width: min(100%, 56rem);
  padding: 3.2rem;
  border-radius: var(--r-l);
  background: var(--paper);
  color: var(--ink);
}
.cookie-modal__list { display: grid; gap: 0; border-top: 1px solid var(--line-light); }
.cookie-modal__list li {
  display: flex;
  justify-content: space-between;
  align-items: center;
  gap: 2rem;
  padding-block: 1.6rem;
  border-bottom: 1px solid var(--line-light);
}
.cookie-modal__list div { display: grid; gap: 0.2rem; font-size: 1.4rem; }
.cookie-modal__list span { color: var(--ink-muted); font-size: 1.3rem; }
.cookie-modal :deep(.el-switch.is-checked .el-switch__core) { background-color: var(--c-forest-800); border-color: var(--c-forest-800); }

.cookie-enter-active, .cookie-leave-active { transition: opacity 0.5s var(--ease-out), transform 0.7s var(--ease-out); }
.cookie-enter-from, .cookie-leave-to { opacity: 0; transform: translateY(2rem); }

@media (max-width: 767px) {
  .cookie { flex-direction: column; align-items: stretch; }
  .cookie__btn { flex: 1; }
}
</style>
