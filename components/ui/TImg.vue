<script setup lang="ts">
import { imgUrl, imgSrcset } from '~/data/images'

const props = withDefaults(defineProps<{
  src: string
  alt?: string
  width?: number
  sizes?: string
  priority?: boolean
  cover?: boolean
}>(), { alt: '', width: 1600, sizes: '100vw', priority: false, cover: false })

const url = computed(() => imgUrl(props.src, props.width))
const srcset = computed(() => imgSrcset(props.src))
</script>

<template>
  <img
    :src="url"
    :srcset="srcset"
    :sizes="srcset ? sizes : undefined"
    :alt="alt"
    :loading="priority ? 'eager' : 'lazy'"
    :fetchpriority="priority ? 'high' : 'auto'"
    decoding="async"
    :class="['timg', { 'media-cover': cover }]"
    draggable="false"
  >
</template>

<style>
.timg { background-color: rgba(138, 154, 123, 0.16); color: transparent; }
</style>
