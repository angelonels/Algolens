import { useCallback, useMemo } from 'react'
import { ALGO_ROUTES, getAlgorithmByPath } from '../data/algorithmRegistry'
import { useLocalStorage } from './useLocalStorage'

const MAX_RECENT = 6

export function useRecentAlgorithms() {
  const [recentPaths, setRecentPaths, clearRecentPaths] = useLocalStorage<string[]>(
    'algolens-recent-algorithms',
    [],
  )

  const recentAlgorithms = useMemo(() => {
    return recentPaths
      .map((path) => getAlgorithmByPath(path))
      .filter((algorithm): algorithm is NonNullable<typeof algorithm> => Boolean(algorithm))
  }, [recentPaths])

  const addRecentAlgorithm = useCallback(
    (path: string) => {
      if (!ALGO_ROUTES.includes(path)) return
      setRecentPaths((previous) => [path, ...previous.filter((item) => item !== path)].slice(0, MAX_RECENT))
    },
    [setRecentPaths],
  )

  return {
    recentAlgorithms,
    addRecentAlgorithm,
    clearRecentAlgorithms: clearRecentPaths,
  }
}
