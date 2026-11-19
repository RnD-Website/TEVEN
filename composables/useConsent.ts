/**
 * Cookie consent state (Cookie Control pattern).
 * Non-essential scripts (analytics / marketing) are only injected after the
 * visitor opts in — see plugins/03.analytics.client.ts.
 */
export interface ConsentState {
  decided: boolean
  necessary: true
  analytics: boolean
  marketing: boolean
  updatedAt?: string
}

const KEY = 'teven-consent-v1'

export function useConsent() {
  const state = useState<ConsentState>('consent', () => ({ decided: false, necessary: true, analytics: false, marketing: false }))

  function load() {
    if (import.meta.server) return
    try {
      const raw = localStorage.getItem(KEY)
      if (raw) state.value = { ...state.value, ...JSON.parse(raw), necessary: true }
    } catch { /* storage unavailable */ }
  }

  function save(next: Partial<ConsentState>) {
    state.value = { ...state.value, ...next, necessary: true, decided: true, updatedAt: new Date().toISOString() }
    try { localStorage.setItem(KEY, JSON.stringify(state.value)) } catch { /* ignore */ }
  }

  const acceptAll = () => save({ analytics: true, marketing: true })
  const rejectAll = () => save({ analytics: false, marketing: false })

  return { state, load, save, acceptAll, rejectAll }
}
