import { useCallback, useMemo } from 'react'
import { useLocalStorage } from './useLocalStorage'

/**
 * Manage a set of favorited algorithm paths, persisted via localStorage.
 *
 * Refactored to delegate persistence to the generic `useLocalStorage` hook
 * so this hook only contains favorites-specific logic.
 */
export function useFavorites() {
  const [list, setList] = useLocalStorage<string[]>('algolens-favorites', [])

  const favSet = useMemo(() => new Set(list), [list])

  const toggleFavorite = useCallback((path: string) => {
    setList(prev => {
      const set = new Set(prev)
      if (set.has(path)) {
        set.delete(path)
      } else {
        set.add(path)
      }
      return [...set]
    })
  }, [setList])

  const isFavorite = useCallback((path: string) => favSet.has(path), [favSet])

  return { favorites: favSet, toggleFavorite, isFavorite, count: favSet.size }
}
