<script setup lang="ts">
/** Custom scrollbar pill (reference journal/carousel indicator). Draggable. */
const props = defineProps<{ progress: number; ratio: number; tone?: 'light' | 'dark' }>()
const emit = defineEmits<{ seek: [number] }>()
const bar = ref<HTMLElement | null>(null)
let drag = false

function seekFrom(e: PointerEvent) {
  if (!bar.value) return
  const r = bar.value.getBoundingClientRect()
  const thumbW = r.width * props.ratio
  const p = (e.clientX - r.left - thumbW / 2) / (r.width - thumbW)
  emit('seek', Math.min(1, Math.max(0, p)))
}
function down(e: PointerEvent) { drag = true; (e.target as HTMLElement).setPointerCapture?.(e.pointerId); seekFrom(e) }
function move(e: PointerEvent) { if (drag) seekFrom(e) }
function up() { drag = false }
function key(e: KeyboardEvent) {
  if (e.key === 'ArrowRight') emit('seek', Math.min(1, props.progress + 0.1))
  if (e.key === 'ArrowLeft') emit('seek', Math.max(0, props.progress - 0.1))
}
</script>

<template>
  <div
    ref="bar"
    class="tsb"
    :class="`is-${tone ?? 'dark'}`"
    role="scrollbar"
    tabindex="0"
    aria-orientation="horizontal"
    :aria-valuenow="Math.round(progress * 100)"
    aria-valuemin="0"
    aria-valuemax="100"
    @pointerdown="down"
    @pointermove="move"
    @pointerup="up"
    @keydown="key"
  >
    <span class="tsb__rail"><span class="tsb__thumb" :style="{ width: `${ratio * 100}%`, left: `${progress * (1 - ratio) * 100}%` }" /></span>
  </div>
</template>

<style scoped>
.tsb {
  position: relative;
  width: 12rem;
  height: 3rem;
  padding: 1.2rem 1.4rem;
  border-radius: var(--r-pill);
  cursor: grab;
  touch-action: none;
}
.tsb__rail { position: absolute; inset: 1.2rem 1.4rem; border-radius: 4px; }
.tsb__rail::before { content: ''; position: absolute; inset: 0.15rem 0; border-radius: 4px; background: currentColor; opacity: 0.2; }
.is-dark { background: rgba(18, 32, 26, 0.1); color: var(--ink); }
.is-light { background: rgba(246, 240, 228, 0.12); color: var(--c-ivory-50); }
.tsb__thumb {
  position: absolute;
  top: 0;
  height: 100%;
  border-radius: 4px;
  background: currentColor;
  transform: scaleX(0.999);
  transition: left 0.15s linear;
}
</style>
