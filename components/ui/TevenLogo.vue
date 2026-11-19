<script setup lang="ts">
/**
 * TEVEN badge — a pointed tea-leaf emblem carrying the wordmark.
 * Plays the same role as the reference's hanging triangle badge.
 */
withDefaults(defineProps<{ variant?: 'badge' | 'outline' | 'mark' }>(), { variant: 'badge' })
</script>

<template>
  <svg
    class="teven-logo"
    :class="`is-${variant}`"
    viewBox="0 0 120 132"
    role="img"
    aria-label="TEVEN"
  >
    <title>TEVEN</title>
    <!-- leaf body -->
    <path
      class="leaf"
      d="M60 2C60 2 108 34 108 78c0 28-21.5 50-48 50S12 106 12 78C12 34 60 2 60 2Z"
    />
    <!-- midrib + veins -->
    <g class="veins" fill="none" stroke-linecap="round">
      <path d="M60 18v46" />
      <path d="M60 40l-14-10M60 40l14-10M60 54l-18-12M60 54l18-12" />
    </g>
    <text class="word" x="60" y="94" text-anchor="middle">TEVEN</text>
    <path class="rule" d="M38 104h44" fill="none" />
  </svg>
</template>

<style scoped>
.teven-logo { width: 100%; height: auto; overflow: visible; }
.leaf { fill: var(--c-beige-200); }
.veins { stroke: var(--c-forest-800); stroke-width: 2.2; opacity: 0.55; }
.word {
  font-family: var(--ff-display);
  font-weight: 700;
  font-size: 20px;
  letter-spacing: 2.4px;
  fill: var(--c-forest-800);
}
.rule { stroke: var(--c-forest-800); stroke-width: 1.4; opacity: 0.5; }

.is-outline .leaf { fill: none; stroke: var(--c-beige-200); stroke-width: 2.4; }
.is-outline .veins { stroke: var(--c-beige-200); opacity: 0.8; }
.is-outline .word { fill: var(--c-beige-200); }
.is-outline .rule { stroke: var(--c-beige-200); }

.is-mark .word, .is-mark .rule { display: none; }
</style>
