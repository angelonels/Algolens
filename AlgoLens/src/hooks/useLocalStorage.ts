import { useState, useCallback } from 'react'

/**
 * Generic hook for state backed by localStorage.
 *
 * Handles serialization, deserialization, and error recovery so that
 * individual feature hooks (favorites, preferences, etc.) don't need
 * to duplicate boilerplate.
 *
 * @param key      localStorage key
 * @param fallback default value when nothing is stored or parsing fails
 */
export function useLocalStorage<T>(key: string, fallback: T) {
  const [value, setValue] = useState<T>(() => {
    try {
      const stored = localStorage.getItem(key)
      return stored !== null ? (JSON.parse(stored) as T) : fallback
    } catch {
      return fallback
    }
  })

  /** Update both React state and localStorage in one call. */
  const set = useCallback(
    (updater: T | ((prev: T) => T)) => {
      setValue(prev => {
        const next = typeof updater === 'function'
          ? (updater as (prev: T) => T)(prev)
          : updater
        try {
          localStorage.setItem(key, JSON.stringify(next))
        } catch {
          /* quota exceeded — state still updates in-memory */
        }
        return next
      })
    },
    [key],
  )

  /** Remove the entry from localStorage and reset to fallback. */
  const remove = useCallback(() => {
    localStorage.removeItem(key)
    setValue(fallback)
  }, [key, fallback])

  return [value, set, remove] as const
}
