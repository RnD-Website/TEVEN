<script setup lang="ts">
/**
 * SECTION 12 — TEVEN Journal.
 * Reference ("The Coffee Journal"): serif title, subtitle, Explore pill and
 * a draggable row of article cards (image, title, tag pill — date) with a
 * custom scrollbar. Adds the five TEVEN article categories as filters.
 */
import { gsap } from 'gsap'
import { journalIntro, journalCategories, type Article } from '~/data/site'

const props = defineProps<{ articles: Article[] }>()
const root = ref<HTMLElement | null>(null)
const viewport = ref<HTMLElement | null>(null)
const track = ref<HTMLElement | null>(null)
const filter = ref<string>('All')
const { progress, atStart, atEnd, thumbRatio, step, scrollToProgress, measure, reset } = useDragTrack(viewport, track)

const list = computed(() => (filter.value === 'All' ? props.articles : props.articles.filter((a) => a.category === filter.value)))

function fmt(d: string) {
  return new Date(d).toISOString().slice(0, 10)
}

watch(filter, async () => {
  reset()
  await nextTick()
  measure()
  gsap.fromTo(root.value!.querySelectorAll('.jcard'), { y: 40, autoAlpha: 0 }, { y: 0, autoAlpha: 1, duration: 0.9, stagger: 0.06, ease: 'expo.out' })
})

useGsapContext(root, () => {
  revealLines('.journal__head .line-inner', { trigger: '.journal__head' })
  riseIn('.journal__fade', { trigger: '.journal__head', start: 'top 80%' })
  gsap.from('.jcard', { y: 80, autoAlpha: 0, duration: 1.3, stagger: 0.08, ease: 'expo.out', scrollTrigger: { trigger: viewport.value, start: 'top 88%', once: true } })
})
</script>

<template>
  <section ref="root" class="journal section-paper" aria-labelledby="journal-title">
    <div class="g-row journal__head">
      <div class="journal__head-col">
        <SplitTitle id="journal-title" :lines="[journalIntro.title]" size="serif-l" />
        <p class="t-headline-5 journal__sub journal__fade">{{ journalIntro.subtitle }}</p>
        <div class="journal__fade"><PillButton :label="journalIntro.cta.label" :to="journalIntro.cta.to" tone="dark" /></div>
      </div>
      <div class="journal__filters journal__fade" role="group" aria-label="Filter articles by category">
        <button
          v-for="c in ['All', ...journalCategories]"
          :key="c"
          type="button"
          class="chip"
          :class="{ 'is-active': filter === c }"
          :aria-pressed="filter === c"
          @click="filter = c"
        >{{ c }}</button>
      </div>
    </div>

    <div ref="viewport" class="journal__viewport">
      <ul ref="track" class="journal__track">
        <li v-for="a in list" :key="a.slug" class="jcard">
          <NuxtLink :to="`/journal/${a.slug}`" class="jcard__link" draggable="false">
            <div class="jcard__img"><TImg :src="a.image" :width="800" sizes="(max-width: 767px) 80vw, 24vw" :alt="a.title" cover /></div>
            <h3 class="jcard__title t-headline-5">{{ a.title }}</h3>
            <div class="jcard__meta t-small">
              <span class="jcard__tag">{{ a.category }}</span>
              <span>— {{ fmt(a.date) }}</span>
            </div>
          </NuxtLink>
        </li>
      </ul>
    </div>

    <div class="journal__controls">
      <RoundButton icon="arrow-left" label="Previous articles" tone="dark" size="s" :disabled="atStart" @click="step(-1)" />
      <TrackScrollbar :progress="progress" :ratio="thumbRatio" tone="dark" @seek="scrollToProgress" />
      <RoundButton icon="arrow-right" label="Next articles" tone="dark" size="s" :disabled="atEnd" @click="step(1)" />
    </div>
  </section>
</template>

<style scoped>
.journal { padding-block: clamp(6rem, 7vw, 11rem) clamp(8rem, 8vw, 13rem); }
.journal__head { row-gap: 3.2rem; align-items: end; padding-bottom: 4rem; }
.journal__head-col { grid-column: 1 / span 12; display: grid; gap: 1.6rem; justify-items: start; }
.journal__sub { color: var(--ink-muted); margin-bottom: 0.8rem; }
.journal__filters { grid-column: 15 / -1; display: flex; flex-wrap: wrap; justify-content: flex-end; gap: 0.6rem; }
.chip {
  height: 3.6rem;
  padding-inline: 1.6rem;
  border-radius: var(--r-pill);
  border: 1px solid var(--line-light);
  font-size: 1.3rem;
  font-weight: 600;
  color: var(--ink);
  transition: background 0.35s, color 0.35s, border-color 0.35s;
}
.chip:hover { border-color: var(--ink); }
.chip.is-active { background: var(--c-forest-800); border-color: var(--c-forest-800); color: var(--c-ivory-50); }

.journal__viewport { overflow: hidden; padding-inline: var(--page-pad); cursor: grab; touch-action: pan-y; user-select: none; }
.journal__viewport.is-dragging { cursor: grabbing; }
.journal__track { display: flex; column-gap: var(--gutter); width: max-content; min-height: 40rem; will-change: transform; }
.jcard { width: clamp(28rem, 23vw, 38rem); flex: none; }
.jcard__link { display: grid; gap: 1.6rem; }
.jcard__img { position: relative; aspect-ratio: 0.82; border-radius: var(--r-s); overflow: hidden; }
.jcard__img :deep(img) { transition: transform 1.4s var(--ease-out); }
.jcard__title { color: var(--ink); transition: color 0.3s; }
.jcard__meta { display: flex; align-items: center; gap: 0.8rem; color: var(--ink-muted); }
.jcard__tag { padding: 0.4rem 1rem; border: 1px solid currentColor; border-radius: var(--r-pill); }
@media (hover: hover) {
  .jcard__link:hover .jcard__img :deep(img) { transform: scale(1.06); }
  .jcard__link:hover .jcard__title { color: var(--c-sage-500); }
}
.journal__controls { display: flex; align-items: center; justify-content: center; gap: 1rem; padding-top: 3.2rem; }

@media (max-width: 1023px) {
  .journal__head-col, .journal__filters { grid-column: 1 / -1; justify-content: flex-start; }
  .jcard { width: 74vw; }
}
</style>
