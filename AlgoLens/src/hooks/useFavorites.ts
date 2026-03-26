import { useState, useCallback } from 'react'

const STORAGE_KEY = 'algolens-favorites'

function loadFavorites(): Set<string> {
  try {
    const stored = localStorage.getItem(STORAGE_KEY)
    if (stored) return new Set(JSON.parse(stored) as string[])
  } catch { /* ignore */ }
  return new Set()
}

function saveFavorites(favorites: Set<string>) {
  localStorage.setItem(STORAGE_KEY, JSON.stringify([...favorites]))
}

export function useFavorites() {
  const [favorites, setFavorites] = useState<Set<string>>(() => loadFavorites())

  const toggleFavorite = useCallback((path: string) => {
    setFavorites(prev => {
      const next = new Set(prev)
      if (next.has(path)) {
        next.delete(path)
      } else {
        next.add(path)
      }
      saveFavorites(next)
      return next
    })
  }, [])

  const isFavorite = useCallback((path: string) => favorites.has(path), [favorites])

  return { favorites, toggleFavorite, isFavorite, count: favorites.size }
}
