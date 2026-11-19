<script setup lang="ts">
/** Inline icon set (stroke icons, 24px grid). */
const props = defineProps<{ name: string }>()

const paths: Record<string, string> = {
  'arrow-right': '<path d="M4 12h15M13 6l6 6-6 6"/>',
  'arrow-left': '<path d="M20 12H5M11 6l-6 6 6 6"/>',
  'arrow-top-right': '<path d="M7 17 17 7M8 7h9v9"/>',
  'chevron-down': '<path d="m6 9 6 6 6-6"/>',
  close: '<path d="M6 6l12 12M18 6 6 18"/>',
  globe: '<circle cx="12" cy="12" r="9"/><path d="M3 12h18M12 3c2.6 2.6 3.8 5.6 3.8 9s-1.2 6.4-3.8 9c-2.6-2.6-3.8-5.6-3.8-9S9.4 5.6 12 3Z"/>',
  menu: '<path d="M4 9c2.7-2 5.3-2 8 0s5.3 2 8 0M4 15c2.7-2 5.3-2 8 0s5.3 2 8 0"/>',
  plus: '<path d="M12 5v14M5 12h14"/>',
  instagram: '<rect x="3.5" y="3.5" width="17" height="17" rx="5"/><circle cx="12" cy="12" r="4"/><circle cx="17.2" cy="6.8" r="0.6" fill="currentColor"/>',
  facebook: '<path d="M14 8.5h2.5V5H14a3.5 3.5 0 0 0-3.5 3.5V11H8v3.5h2.5V21H14v-6.5h2.5L17 11h-3V9a.5.5 0 0 1 .5-.5Z"/>',
  youtube: '<rect x="2.5" y="5.5" width="19" height="13" rx="4"/><path d="m10 9 5 3-5 3Z" fill="currentColor"/>',
  linkedin: '<path d="M6.5 10v8M6.5 6.5v.01M10.5 18v-8M10.5 13.5a3.5 3.5 0 0 1 7 0V18"/>',
  // Journey stage icons
  origins: '<path d="M12 21s-6.5-5.6-6.5-11a6.5 6.5 0 0 1 13 0c0 5.4-6.5 11-6.5 11Z"/><path d="M12 6.5c-1.8 1.2-2.6 2.6-2.6 4.2 0 1.4 1.2 2.4 2.6 2.4s2.6-1 2.6-2.4c0-1.6-.8-3-2.6-4.2Z"/>',
  harvest: '<path d="M5 11h14l-1.6 8.2a1.5 1.5 0 0 1-1.5 1.3H8.1a1.5 1.5 0 0 1-1.5-1.3Z"/><path d="M8 11c0-3 1.8-5 4-5s4 2 4 5M12 6V3.5M12 3.5c1.6-.8 3-.6 4 .4-1.2 1-2.6 1.1-4 .4Z"/>',
  craft: '<path d="M4 16c3-1 5-4 8-4s5 3 8 4"/><path d="M4 20c3-1 5-4 8-4s5 3 8 4"/><path d="M12 4c-2 2-2 4 0 6 2-2 2-4 0-6Z"/>',
  tasting: '<path d="M4 10h13v3a6 6 0 0 1-6 6h-1a6 6 0 0 1-6-6Z"/><path d="M17 11h1.5a2.5 2.5 0 0 1 0 5H16M9 3.5c-.8 1 .8 2 0 3M12.5 3.5c-.8 1 .8 2 0 3"/>'
}

const svg = computed(() => paths[props.name] ?? '')
</script>

<template>
  <svg
    class="t-icon"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    stroke-width="1.6"
    stroke-linecap="round"
    stroke-linejoin="round"
    aria-hidden="true"
    v-html="svg"
  />
</template>

<style scoped>
.t-icon { width: 1em; height: 1em; flex: none; }
</style>
