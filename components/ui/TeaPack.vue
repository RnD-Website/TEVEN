<script setup lang="ts">
/**
 * Product pack visual.
 * Shows the cut-out tin (public/images/pouches/<slug>.webp + .png,
 * transparent background) for every slug listed in data/mockups.ts,
 * and the drawn SVG pouch for the rest. Listing avoids 404 requests.
 */
import { mockups } from '~/data/mockups'

const props = withDefaults(defineProps<{
  slug: string
  name: string
  sub?: string
  color: string
  accent?: string
  ink?: string
  priority?: boolean
}>(), { sub: '', accent: '#e8d8bf', ink: '#f6f0e4', priority: false })

const hasMockup = computed(() => mockups.includes(props.slug))
</script>

<template>
  <picture v-if="hasMockup" class="tea-pack">
    <source :srcset="`/images/pouches/${slug}.webp`" type="image/webp">
    <img
      :src="`/images/pouches/${slug}.png`"
      :alt="`TEVEN ${name} tin`"
      :loading="priority ? 'eager' : 'lazy'"
      decoding="async"
      draggable="false"
    >
  </picture>
  <TeaPouch v-else :name="name" :sub="sub" :color="color" :accent="accent" :ink="ink" />
</template>

<style scoped>
.tea-pack { display: block; width: 100%; }
.tea-pack img {
  display: block;
  width: 100%;
  height: auto;
  filter: drop-shadow(0 1.6rem 2rem rgba(0, 0, 0, 0.28));
}
</style>
