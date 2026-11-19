<script setup lang="ts">
/**
 * TEVEN premium stand-up pouch, drawn in SVG so every tea gets consistent,
 * on-brand packaging (replaces the reference's product pack shots).
 */
const props = withDefaults(defineProps<{
  name: string
  sub?: string
  color: string
  accent?: string
  ink?: string
}>(), { sub: '', accent: '#e8d8bf', ink: '#f6f0e4' })

// Deterministic id from the props: identical on server and client (no hydration
// mismatch), and identical pouches safely share identical <defs>.
const uid = computed(() => {
  const key = `${props.name}|${props.sub}|${props.color}|${props.accent}`
  let h = 0
  for (let i = 0; i < key.length; i++) h = (h * 31 + key.charCodeAt(i)) >>> 0
  return `p${h.toString(36)}`
})
const words = computed(() => {
  const parts = props.name.toUpperCase().split(' ')
  if (parts.length <= 1) return [parts[0]]
  const mid = Math.ceil(parts.length / 2)
  return [parts.slice(0, mid).join(' '), parts.slice(mid).join(' ')]
})
</script>

<template>
  <svg class="pouch" viewBox="0 0 200 280" role="img" :aria-label="`TEVEN ${name} pouch`">
    <defs>
      <linearGradient :id="`sheen-${uid}`" x1="0" x2="1" y1="0" y2="0">
        <stop offset="0" stop-color="#000" stop-opacity="0.28" />
        <stop offset="0.18" stop-color="#fff" stop-opacity="0.10" />
        <stop offset="0.5" stop-color="#fff" stop-opacity="0" />
        <stop offset="0.82" stop-color="#000" stop-opacity="0.06" />
        <stop offset="1" stop-color="#000" stop-opacity="0.32" />
      </linearGradient>
      <linearGradient :id="`shade-${uid}`" x1="0" x2="0" y1="0" y2="1">
        <stop offset="0" stop-color="#fff" stop-opacity="0.12" />
        <stop offset="0.7" stop-color="#000" stop-opacity="0" />
        <stop offset="1" stop-color="#000" stop-opacity="0.25" />
      </linearGradient>
      <clipPath :id="`clip-${uid}`">
        <path d="M22 18h156c4 0 6 2 6 6v12c0 6 6 10 6 18v196c0 12-8 20-20 20H30c-12 0-20-8-20-20V54c0-8 6-12 6-18V24c0-4 2-6 6-6Z" />
      </clipPath>
    </defs>

    <!-- shadow -->
    <ellipse cx="100" cy="272" rx="78" ry="6" fill="#000" opacity="0.22" />

    <g :clip-path="`url(#clip-${uid})`">
      <rect x="0" y="0" width="200" height="280" :fill="color" />
      <!-- top seal -->
      <rect x="0" y="18" width="200" height="22" fill="#000" opacity="0.14" />
      <g :stroke="accent" stroke-opacity="0.35" stroke-width="1">
        <path v-for="i in 18" :key="i" :d="`M${10 + i * 10} 20v18`" />
      </g>
      <!-- zip line -->
      <path d="M10 50h180" :stroke="accent" stroke-opacity="0.45" stroke-dasharray="3 3" />
      <!-- botanical pattern -->
      <g fill="none" :stroke="accent" stroke-opacity="0.32" stroke-width="1.2">
        <path d="M-6 250c30-30 60-30 90 0M60 262c30-34 70-34 100 0M120 248c26-26 56-26 86 0" />
        <path d="M30 226c6-14 18-20 30-18-4 12-16 20-30 18ZM150 214c-6-14-18-20-30-18 4 12 16 20 30 18Z" />
        <path d="M100 236c-4-16 0-28 10-34 4 12 0 26-10 34Z" />
      </g>
      <!-- label panel -->
      <rect x="30" y="74" width="140" height="136" rx="6" :fill="accent" opacity="0.96" />
      <!-- leaf mark -->
      <path
        d="M100 86s14 9 14 22c0 8-6 14-14 14s-14-6-14-14c0-13 14-22 14-22Z"
        :fill="color"
      />
      <path d="M100 94v20M100 104l-5-4M100 104l5-4" :stroke="accent" stroke-width="1.4" fill="none" stroke-linecap="round" />
      <text x="100" y="138" text-anchor="middle" class="brand" :fill="color">TEVEN</text>
      <path d="M78 145h44" :stroke="color" stroke-opacity="0.4" />
      <text
        v-for="(w, i) in words"
        :key="w"
        x="100"
        :y="words.length > 1 ? 168 + i * 19 : 177"
        text-anchor="middle"
        class="name"
        :fill="color"
      >{{ w }}</text>
      <text v-if="sub" x="100" y="226" text-anchor="middle" class="sub" :fill="ink">{{ sub.toUpperCase() }}</text>
      <!-- sheen -->
      <rect x="0" y="0" width="200" height="280" :fill="`url(#sheen-${uid})`" />
      <rect x="0" y="0" width="200" height="280" :fill="`url(#shade-${uid})`" />
    </g>
  </svg>
</template>

<style scoped>
.pouch { width: 100%; height: auto; overflow: visible; }
.brand { font-family: var(--ff-display); font-weight: 700; font-size: 15px; letter-spacing: 3px; }
.name { font-family: var(--ff-display); font-weight: 700; font-size: 20px; letter-spacing: 0.5px; }
.sub { font-family: var(--ff-sans); font-weight: 700; font-size: 7.5px; letter-spacing: 1.6px; }
</style>
