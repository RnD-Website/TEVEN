<script setup lang="ts">
/** Small circular arrow button (carousel arrows, card arrows). */
const props = withDefaults(defineProps<{
  icon?: string
  label: string
  to?: string
  size?: 's' | 'm'
  tone?: 'glass' | 'light' | 'dark'
  disabled?: boolean
}>(), { icon: 'arrow-right', size: 'm', tone: 'glass', disabled: false })

defineEmits<{ click: [MouseEvent] }>()
const tag = computed(() => (props.to ? resolveComponent('NuxtLink') : 'button'))
</script>

<template>
  <component
    :is="tag"
    :to="to"
    :type="to ? undefined : 'button'"
    class="round"
    :class="[`is-${size}`, `is-${tone}`]"
    :aria-label="label"
    :disabled="disabled || undefined"
    @click="$emit('click', $event)"
  >
    <span class="round__a"><TIcon :name="icon" /></span>
    <span class="round__a is-ghost"><TIcon :name="icon" /></span>
  </component>
</template>

<style scoped>
.round {
  position: relative;
  display: inline-grid;
  place-items: center;
  flex: none;
  width: 4.8rem;
  height: 4.8rem;
  border-radius: 50%;
  overflow: hidden;
  font-size: 1.6rem;
  transition: background 0.5s var(--ease-out), color 0.5s var(--ease-out), opacity 0.3s;
}
.is-s { width: 3.6rem; height: 3.6rem; font-size: 1.3rem; }
.is-glass { background: rgba(246, 240, 228, 0.14); color: var(--c-ivory-50); }
.is-light { background: var(--c-beige-200); color: var(--c-forest-800); }
.is-dark { background: var(--c-forest-800); color: var(--c-ivory-50); }
.round[disabled] { opacity: 0.35; pointer-events: none; }
.round__a { position: absolute; inset: 0; display: grid; place-items: center; transition: transform 0.55s var(--ease-out); }
.round__a.is-ghost { transform: translateX(-120%); }
@media (hover: hover) {
  .round:hover .round__a:not(.is-ghost) { transform: translateX(120%); }
  .round:hover .round__a.is-ghost { transform: none; }
  .round.is-glass:hover { background: var(--c-beige-200); color: var(--c-forest-800); }
}
</style>
