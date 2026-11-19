<script setup lang="ts">
/**
 * Reference CTA: a label pill joined to a round arrow chip.
 * Hover: the pill background stretches over the arrow chip and the arrow
 * slides out while a ghost arrow slides in.
 */
const props = withDefaults(defineProps<{
  label: string
  to?: string
  href?: string
  icon?: 'arrow-right' | 'arrow-top-right'
  tone?: 'light' | 'dark' | 'white' | 'lime'
  type?: 'button' | 'submit'
}>(), { icon: 'arrow-right', tone: 'light', type: 'button' })

defineEmits<{ click: [MouseEvent] }>()

const tag = computed(() => (props.to ? resolveComponent('NuxtLink') : props.href ? 'a' : 'button'))
const attrs = computed(() => {
  if (props.to) return { to: props.to }
  if (props.href) return { href: props.href, target: '_blank', rel: 'noopener' }
  return { type: props.type }
})
</script>

<template>
  <component :is="tag" v-bind="attrs" class="pill" :class="`is-${tone}`" @click="$emit('click', $event)">
    <span class="pill__bg" aria-hidden="true" />
    <span class="pill__label t-small">{{ label }}</span>
    <span class="pill__icon" aria-hidden="true">
      <span class="pill__arrow"><TIcon :name="icon" /></span>
      <span class="pill__arrow is-ghost"><TIcon :name="icon" /></span>
    </span>
  </component>
</template>

<style scoped>
.pill {
  --pill-h: 5.2rem;
  --pill-bg: var(--c-beige-200);
  --pill-fg: var(--c-forest-800);
  --chip-bg: rgba(246, 240, 228, 0.14);
  --chip-fg: var(--c-ivory-50);
  position: relative;
  display: inline-flex;
  align-items: stretch;
  height: var(--pill-h);
  isolation: isolate;
  white-space: nowrap;
}
.is-dark { --pill-bg: #fff; --pill-fg: var(--c-forest-800); --chip-bg: var(--c-forest-800); --chip-fg: var(--c-ivory-50); }
.is-white { --pill-bg: #fff; --pill-fg: var(--c-forest-800); --chip-bg: var(--c-sage-300); --chip-fg: var(--c-forest-800); }
.is-lime { --pill-bg: var(--c-lime-100); --pill-fg: var(--c-forest-900); --chip-bg: rgba(230, 236, 196, 0.16); --chip-fg: var(--c-lime-100); }

.pill__bg {
  position: absolute;
  inset: 0 auto 0 0;
  width: calc(100% - var(--pill-h) - 0.2rem);
  border-radius: var(--r-pill);
  background: var(--pill-bg);
  z-index: -1;
  transition: width 0.6s var(--ease-out);
}
.pill__label {
  display: flex;
  align-items: center;
  padding-inline: 2.4rem;
  color: var(--pill-fg);
  font-size: 1.4rem;
  font-weight: 600;
}
.pill__icon {
  position: relative;
  width: var(--pill-h);
  margin-left: 0.2rem;
  border-radius: 50%;
  background: var(--chip-bg);
  color: var(--chip-fg);
  overflow: hidden;
  transition: background 0.6s var(--ease-out), color 0.6s var(--ease-out);
}
.pill__arrow {
  position: absolute;
  inset: 0;
  display: grid;
  place-items: center;
  font-size: 1.6rem;
  transition: transform 0.6s var(--ease-out);
}
.pill__arrow.is-ghost { transform: translateX(-120%); }

@media (hover: hover) {
  .pill:hover .pill__bg { width: 100%; }
  .pill:hover .pill__icon { background: transparent; color: var(--pill-fg); }
  .pill:hover .pill__arrow:not(.is-ghost) { transform: translateX(120%); }
  .pill:hover .pill__arrow.is-ghost { transform: translateX(0); }
}

@media (max-width: 767px) {
  .pill { --pill-h: 4.6rem; }
  .pill__label { padding-inline: 2rem; }
}
</style>
