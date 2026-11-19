/**
 * Draggable horizontal track with inertia, wheel (horizontal) support,
 * prev/next stepping and progress — used by the product and journal
 * carousels (reference: drag + custom scrollbar behaviour).
 */
import type { Ref } from 'vue'
import { gsap } from 'gsap'

export function useDragTrack(viewport: Ref<HTMLElement | null>, track: Ref<HTMLElement | null>) {
  const progress = ref(0)
  const atStart = ref(true)
  const atEnd = ref(false)
  const thumbRatio = ref(0.3)
  let x = 0
  let max = 0
  let dragging = false
  let moved = 0
  let startX = 0
  let startPos = 0
  let lastX = 0
  let lastT = 0
  let velocity = 0
  let setX: ((v: number) => void) | null = null

  function measure() {
    if (!viewport.value || !track.value) return
    max = Math.max(0, track.value.scrollWidth - viewport.value.clientWidth)
    thumbRatio.value = Math.min(1, viewport.value.clientWidth / Math.max(1, track.value.scrollWidth))
    clampTo(x, false)
  }

  function update() {
    progress.value = max ? -x / max : 0
    atStart.value = x >= -1
    atEnd.value = x <= -max + 1
  }

  function clampTo(target: number, animate = true, duration = 1) {
    x = gsap.utils.clamp(-max, 0, target)
    if (!track.value) return
    if (animate) gsap.to(track.value, { x, duration, ease: 'expo.out', overwrite: true })
    else setX?.(x)
    update()
  }

  function step(dir: 1 | -1) {
    const item = track.value?.firstElementChild as HTMLElement | null
    const gap = track.value ? parseFloat(getComputedStyle(track.value).columnGap || '0') : 0
    const w = item ? item.offsetWidth + gap : 300
    clampTo(x - dir * w, true, 1.1)
  }

  function scrollToProgress(p: number) {
    clampTo(-max * p, true, 0.8)
  }

  function onDown(e: PointerEvent) {
    if (e.pointerType === 'mouse' && e.button !== 0) return
    dragging = true
    moved = 0
    startX = e.clientX
    startPos = x
    lastX = e.clientX
    lastT = performance.now()
    velocity = 0
    gsap.killTweensOf(track.value)
    viewport.value?.classList.add('is-dragging')
  }
  function onMove(e: PointerEvent) {
    if (!dragging) return
    const dx = e.clientX - startX
    moved = Math.max(moved, Math.abs(dx))
    let next = startPos + dx
    if (next > 0) next *= 0.35
    if (next < -max) next = -max + (next + max) * 0.35
    x = next
    setX?.(x)
    const now = performance.now()
    velocity = (e.clientX - lastX) / Math.max(1, now - lastT)
    lastX = e.clientX
    lastT = now
    update()
  }
  function onUp() {
    if (!dragging) return
    dragging = false
    viewport.value?.classList.remove('is-dragging')
    clampTo(x + velocity * 380, true, 1.2)
  }
  function onClickCapture(e: MouseEvent) {
    if (moved > 6) { e.preventDefault(); e.stopPropagation() }
  }
  function onWheel(e: WheelEvent) {
    if (Math.abs(e.deltaX) <= Math.abs(e.deltaY)) return
    e.preventDefault()
    clampTo(x - e.deltaX * 1.2, true, 0.6)
  }

  let ro: ResizeObserver | null = null
  onMounted(() => {
    if (!viewport.value || !track.value) return
    setX = gsap.quickSetter(track.value, 'x', 'px') as (v: number) => void
    const vp = viewport.value
    vp.addEventListener('pointerdown', onDown)
    window.addEventListener('pointermove', onMove, { passive: true })
    window.addEventListener('pointerup', onUp)
    window.addEventListener('pointercancel', onUp)
    vp.addEventListener('click', onClickCapture, true)
    vp.addEventListener('wheel', onWheel, { passive: false })
    ro = new ResizeObserver(measure)
    ro.observe(vp)
    ro.observe(track.value)
    measure()
  })
  onBeforeUnmount(() => {
    const vp = viewport.value
    vp?.removeEventListener('pointerdown', onDown)
    window.removeEventListener('pointermove', onMove)
    window.removeEventListener('pointerup', onUp)
    window.removeEventListener('pointercancel', onUp)
    vp?.removeEventListener('click', onClickCapture, true)
    vp?.removeEventListener('wheel', onWheel)
    ro?.disconnect()
  })

  return { progress, atStart, atEnd, thumbRatio, step, scrollToProgress, measure, reset: () => clampTo(0) }
}
