<script setup lang="ts">
/**
 * TEVEN homepage — section order mirrors the reference homepage:
 *  02/03/04 Hero + featured stories + card cluster
 *  05 Product collection carousel
 *  06 Heritage + orbit gallery
 *  07 Journey of tea
 *  08 Tea Journal editorial marquee
 *  09 Tea culture experiences
 *  10/11 Origins showcase + quiz
 *  12 Journal articles
 *  13 Sustainability
 *  14 Final featured story (+15 footer overlay, rendered in app.vue)
 */
const content = await useSiteContent()

useSeoMeta({
  title: 'TEVEN, the art of tea',
  description: 'Every leaf carries a story. Discover the origins, craftsmanship, and rituals behind exceptional tea.'
})

// Priority hint: the hero video poster is the first thing painted
useHead({
  link: [{ rel: 'preload', as: 'image', fetchpriority: 'high', href: '/videos/hero-poster.jpg' }]
})
</script>

<template>
  <div class="home">
    <HeroSection :slides="content.heroSlides" />
    <ProductCarousel :products="content.products" />
    <HeritageSection />
    <JourneySection />
    <MagazineMarquee />
    <CultureSection />
    <OriginsQuizSection :origins="content.origins" />
    <JournalSection :articles="content.articles" />
    <SustainabilitySection :content="content.sustainability" />
    <FinalFeature />
  </div>
</template>
