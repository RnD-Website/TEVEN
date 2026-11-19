<script setup lang="ts">
/** Styled product scene photo (webp with jpg fallback). */
withDefaults(defineProps<{ slug: string; alt: string; sizes?: string; priority?: boolean }>(), { sizes: '25vw', priority: false })
</script>

<template>
  <picture class="product-photo">
    <source :srcset="`/images/products/${slug}.webp`" type="image/webp">
    <img
      :src="`/images/products/${slug}.jpg`"
      :alt="alt"
      width="1200"
      height="1147"
      :loading="priority ? 'eager' : 'lazy'"
      :fetchpriority="priority ? 'high' : 'auto'"
      decoding="async"
      draggable="false"
    >
  </picture>
</template>

<style scoped>
.product-photo, .product-photo img {
  position: absolute;
  inset: 0;
  width: 100%;
  height: 100%;
}
.product-photo img { object-fit: cover; object-position: 50% 60%; }
</style>
