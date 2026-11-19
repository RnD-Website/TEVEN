<script setup lang="ts">
/**
 * Masked-line title. Each entry in `lines` becomes a masked line whose inner
 * span is animated by revealLines(). Words wrapped in *asterisks* render as
 * the small inline words used by the reference ("COFFEE that AWAKENS").
 */
const props = withDefaults(defineProps<{
  lines: string[]
  tag?: string
  size?: 'title-1' | 'title-2' | 'title-3' | 'serif-xl' | 'serif-l' | 'serif-m'
}>(), { tag: 'h2', size: 'title-2' })

const parsed = computed(() =>
  props.lines.map((line) =>
    line.split(/(\*[^*]+\*)/g).filter(Boolean).map((part) =>
      part.startsWith('*') ? { text: part.slice(1, -1), small: true } : { text: part, small: false }
    )
  )
)
const label = computed(() => props.lines.join(' ').replace(/\*/g, ''))
</script>

<template>
  <component :is="tag" class="split-title" :class="`t-${size}`" :aria-label="label">
    <span v-for="(line, i) in parsed" :key="i" class="line" aria-hidden="true">
      <span class="line-inner">
        <template v-for="(part, j) in line" :key="j">
          <em v-if="part.small">{{ part.text }}</em>
          <template v-else>{{ part.text }}</template>
        </template>
      </span>
    </span>
  </component>
</template>
