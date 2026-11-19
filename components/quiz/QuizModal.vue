<script setup lang="ts">
/**
 * SECTION 11 — Functional tea discovery quiz.
 * Four questions (flavour, intensity, caffeine, occasion) score every tea;
 * the highest score becomes the personalised recommendation.
 */
import { gsap } from 'gsap'
import { quizQuestions, products } from '~/data/site'
import { hasProductPhoto } from '~/data/mockups'

const open = useQuizOpen()
const { lock, unlock } = useScrollLock()
const root = ref<HTMLElement | null>(null)
const step = ref(0)
const answers = ref<number[]>([])

const total = quizQuestions.length
const done = computed(() => step.value >= total)
const question = computed(() => quizQuestions[Math.min(step.value, total - 1)])
const percent = computed(() => Math.round((Math.min(step.value, total) / total) * 100))

const result = computed(() => {
  const scores: Record<string, number> = {}
  answers.value.forEach((optIdx, qIdx) => {
    const opt = quizQuestions[qIdx]?.options[optIdx]
    if (!opt) return
    Object.entries(opt.scores).forEach(([slug, v]) => { scores[slug] = (scores[slug] ?? 0) + (v ?? 0) })
  })
  const ranked = Object.entries(scores).sort((a, b) => b[1] - a[1])
  const best = products.find((p) => p.slug === ranked[0]?.[0]) ?? products[0]
  const second = products.find((p) => p.slug === ranked[1]?.[0])
  return { best, second }
})

function animateIn() {
  nextTick(() => {
    const el = root.value?.querySelector('.quiz__panel')
    if (el) gsap.fromTo(el.querySelectorAll('[data-q]'), { y: 30, autoAlpha: 0 }, { y: 0, autoAlpha: 1, duration: 0.9, stagger: 0.06, ease: 'expo.out' })
  })
}

function choose(i: number) {
  answers.value[step.value] = i
  step.value++
  animateIn()
}
function back() {
  if (step.value > 0) { step.value--; animateIn() }
}
function restart() {
  answers.value = []
  step.value = 0
  animateIn()
}
function close() { open.value = false }

watch(open, (v) => {
  if (v) {
    lock()
    restart()
    nextTick(() => {
      gsap.fromTo(root.value, { clipPath: 'inset(100% 0 0 0)' }, { clipPath: 'inset(0% 0 0 0)', duration: 1, ease: 'expo.inOut' })
      root.value?.querySelector<HTMLElement>('.quiz__close')?.focus()
    })
  } else {
    unlock()
  }
})

// /quiz deep link opens the modal on top of the homepage
const route = useRoute()
onMounted(() => { if (route.query.quiz === '1') open.value = true })

function onKey(e: KeyboardEvent) { if (e.key === 'Escape' && open.value) close() }
onMounted(() => window.addEventListener('keydown', onKey))
onBeforeUnmount(() => window.removeEventListener('keydown', onKey))
</script>

<template>
  <div v-if="open" ref="root" class="quiz" role="dialog" aria-modal="true" aria-labelledby="quiz-heading">
    <div class="quiz__top">
      <span class="t-label">TEVEN Quiz</span>
      <div class="quiz__progress">
        <ElProgress :percentage="percent" :show-text="false" :stroke-width="4" color="#12201a" />
        <span class="t-small t-num">{{ Math.min(step + 1, total) }} / {{ total }}</span>
      </div>
      <button type="button" class="quiz__close t-label" @click="close">Close <TIcon name="close" /></button>
    </div>

    <div class="quiz__panel">
      <template v-if="!done">
        <p class="t-label quiz__eyebrow" data-q>Question {{ step + 1 }}</p>
        <h2 id="quiz-heading" class="t-serif-l quiz__q" data-q>{{ question.question }}</h2>
        <ul class="quiz__options" role="list">
          <li v-for="(o, i) in question.options" :key="o.label" data-q>
            <button type="button" class="opt" :class="{ 'is-picked': answers[step] === i }" @click="choose(i)">
              <span class="opt__label">{{ o.label }}</span>
              <span class="opt__hint">{{ o.hint }}</span>
              <span class="opt__arrow"><TIcon name="arrow-right" /></span>
            </button>
          </li>
        </ul>
        <button v-if="step > 0" type="button" class="quiz__back t-small" data-q @click="back">
          <TIcon name="arrow-left" /> Previous question
        </button>
      </template>

      <template v-else>
        <div class="result">
          <div v-if="hasProductPhoto(result.best.slug)" class="result__photo" data-q>
            <ProductPhoto :slug="result.best.slug" :alt="`TEVEN ${result.best.name}`" sizes="40vw" priority />
          </div>
          <div v-else class="result__pouch" data-q>
            <TeaPack :slug="result.best.slug" :name="result.best.name" :sub="result.best.origin" :color="result.best.color" :accent="result.best.accent" :ink="result.best.ink" priority />
          </div>
          <div class="result__body">
            <p class="t-label quiz__eyebrow" data-q>Your perfect cup</p>
            <h2 id="quiz-heading" class="t-title-2 result__name" data-q>{{ result.best.name }}</h2>
            <p class="t-label result__notes" data-q>{{ result.best.origin }} · {{ result.best.notes }}</p>
            <p class="t-headline-6 result__desc" data-q>{{ result.best.description }}</p>
            <div class="result__actions" data-q>
              <PillButton :label="`Discover ${result.best.name}`" :to="`/products/${result.best.slug}`" tone="dark" @click="close" />
              <button type="button" class="quiz__back t-small" @click="restart">Retake the quiz</button>
            </div>
            <p v-if="result.second" class="t-small result__alt" data-q>
              You may also enjoy
              <NuxtLink :to="`/products/${result.second.slug}`" @click="close">{{ result.second.name }}</NuxtLink>.
            </p>
          </div>
        </div>
      </template>
    </div>
  </div>
</template>

<style scoped>
.quiz {
  position: fixed;
  inset: 0;
  z-index: var(--z-modal);
  display: grid;
  grid-template-rows: auto 1fr;
  background: var(--paper);
  color: var(--ink);
  overflow-y: auto;
}
.quiz__top {
  display: grid;
  grid-template-columns: 1fr minmax(0, 40rem) 1fr;
  align-items: center;
  gap: 2rem;
  padding: 2rem var(--page-pad);
}
.quiz__progress { display: flex; align-items: center; gap: 1.2rem; }
.quiz__progress :deep(.el-progress) { flex: 1; }
.quiz__progress :deep(.el-progress-bar__outer) { background: var(--line-light); }
.quiz__close {
  justify-self: end;
  display: inline-flex;
  align-items: center;
  gap: 0.8rem;
  height: 4.4rem;
  padding-inline: 2rem;
  border-radius: var(--r-pill);
  background: var(--c-forest-800);
  color: var(--c-ivory-50);
}
.quiz__panel {
  width: min(100% - var(--page-pad) * 2, 96rem);
  margin: 0 auto;
  padding: 4vh 0 8vh;
  display: grid;
  align-content: center;
  gap: 2.4rem;
}
.quiz__eyebrow { color: var(--c-sage-500); }
.quiz__q { max-width: 22ch; }
.quiz__options { display: grid; grid-template-columns: repeat(2, minmax(0, 1fr)); gap: 1.2rem; margin-top: 1.6rem; }
.opt {
  position: relative;
  display: grid;
  gap: 0.4rem;
  width: 100%;
  padding: 2.4rem 6.4rem 2.4rem 2.4rem;
  border-radius: var(--r-m);
  border: 1px solid var(--line-light);
  background: rgba(255, 255, 255, 0.5);
  text-align: left;
  transition: background 0.4s, color 0.4s, border-color 0.4s, transform 0.6s var(--ease-out);
}
.opt:hover, .opt.is-picked { background: var(--c-forest-800); border-color: var(--c-forest-800); color: var(--c-ivory-50); transform: translateY(-0.3rem); }
.opt__label { font-family: var(--ff-serif); font-size: clamp(2rem, 1.8vw, 2.6rem); font-weight: 300; letter-spacing: -0.02em; }
.opt__hint { font-size: 1.4rem; opacity: 0.7; }
.opt__arrow { position: absolute; right: 2.4rem; top: 50%; transform: translateY(-50%); font-size: 1.8rem; }
.quiz__back { display: inline-flex; align-items: center; gap: 0.8rem; justify-self: start; color: var(--ink-muted); text-decoration: underline; text-underline-offset: 0.4rem; }

.result { display: grid; grid-template-columns: minmax(0, 0.7fr) 1fr; gap: 4rem; align-items: center; }
.result__pouch { width: min(100%, 30rem); justify-self: center; }
.result__photo { position: relative; width: 100%; aspect-ratio: 1.05; border-radius: var(--r-l); overflow: hidden; }
.result__body { display: grid; gap: 1.8rem; justify-items: start; }
.result__name { color: var(--c-forest-800); }
.result__notes { color: var(--c-sage-500); }
.result__desc { color: var(--ink-muted); max-width: 48rem; }
.result__actions { display: flex; flex-wrap: wrap; align-items: center; gap: 2rem; }
.result__alt a { text-decoration: underline; }

@media (max-width: 767px) {
  .quiz__top { grid-template-columns: 1fr auto; }
  .quiz__progress { grid-column: 1 / -1; grid-row: 2; }
  .quiz__options { grid-template-columns: 1fr; }
  .result { grid-template-columns: 1fr; }
  .result__pouch { width: 50vw; }
}
</style>
