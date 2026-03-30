import { useState, useEffect } from 'react'

/**
 * Detects the user's `prefers-reduced-motion` OS/browser setting.
 *
 * Returns `true` when the user prefers reduced motion, allowing
 * components to conditionally simplify or disable animations.
 *
 * The hook listens for runtime changes (e.g. the user toggles the
 * setting in System Preferences while the app is open).
 *
 * @example
 * const prefersReduced = useReducedMotion()
 * const transition = prefersReduced
 *   ? { duration: 0 }
 *   : { type: 'spring', stiffness: 300 }
 */
export function useReducedMotion(): boolean {
  const [prefersReduced, setPrefersReduced] = useState(() => {
    if (typeof window === 'undefined') return false
    return window.matchMedia?.('(prefers-reduced-motion: reduce)').matches ?? false
  })

  useEffect(() => {
    const mql = window.matchMedia('(prefers-reduced-motion: reduce)')

    const handler = (e: MediaQueryListEvent) => {
      setPrefersReduced(e.matches)
    }

    // Modern browsers support addEventListener on MediaQueryList
    mql.addEventListener('change', handler)
    return () => mql.removeEventListener('change', handler)
  }, [])

  return prefersReduced
}
