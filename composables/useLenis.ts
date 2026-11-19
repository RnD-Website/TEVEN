import type Lenis from 'lenis'

/** Access the shared Lenis instance (client only). */
export function useLenis(): Lenis | null {
  if (import.meta.server) return null
  const { $lenis } = useNuxtApp()
  return ($lenis as Lenis) ?? null
}

/** Lock / unlock page scroll (menus, modals). */
export function useScrollLock() {
  const lock = () => {
    useLenis()?.stop()
    document.body.classList.add('is-locked')
  }
  const unlock = () => {
    useLenis()?.start()
    document.body.classList.remove('is-locked')
  }
  return { lock, unlock }
}
