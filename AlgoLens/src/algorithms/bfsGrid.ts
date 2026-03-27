/**
 * Pure algorithm logic for BFS grid search visualization.
 */

import { AlgorithmComplexity } from './types'

export const bfsComplexity: AlgorithmComplexity = {
  best: 'O(V + E)',
  average: 'O(V + E)',
  worst: 'O(V + E)',
  space: 'O(V)',
}

const key = (r: number, c: number) => `${r}-${c}`

export interface BFSStep {
  frontier: number[][]
  visited: Set<string>
  current: number[] | null
  path?: number[][]
  phase: 'init' | 'explore' | 'found' | 'no-path'
  message: string
}

export function bfsWithSteps(walls: number[][], start: number[], end: number[], rows: number, cols: number): BFSStep[] {
  const wallSet = new Set(walls.map(([r, c]) => key(r, c)))
  const visited = new Set<string>()
  const parent: Record<string, string> = {}
  const queue: number[][] = [[start[0], start[1]]]
  visited.add(key(start[0], start[1]))

  const steps: BFSStep[] = []
  const dirs = [[0, 1], [1, 0], [0, -1], [-1, 0]]

  steps.push({
    frontier: [[start[0], start[1]]],
    visited: new Set(visited),
    current: null,
    phase: 'init',
    message: `Starting BFS from (${start[0]}, ${start[1]})`
  })

  while (queue.length > 0) {
    const [r, c] = queue.shift()!

    steps.push({
      frontier: queue.map(q => [q[0], q[1]]),
      visited: new Set(visited),
      current: [r, c],
      phase: 'explore',
      message: `Exploring (${r}, ${c}) — queue size: ${queue.length}`
    })

    if (r === end[0] && c === end[1]) {
      const path: number[][] = []
      let cur: string | undefined = key(r, c)
      while (cur) {
        const [pr, pc] = cur.split('-').map(Number)
        path.unshift([pr, pc])
        cur = parent[cur]
      }

      steps.push({
        frontier: [],
        visited: new Set(visited),
        current: [r, c],
        path,
        phase: 'found',
        message: `Path found — ${path.length} steps`
      })
      return steps
    }

    for (const [dr, dc] of dirs) {
      const nr = r + dr, nc = c + dc
      const nk = key(nr, nc)
      if (nr >= 0 && nr < rows && nc >= 0 && nc < cols && !visited.has(nk) && !wallSet.has(nk)) {
        visited.add(nk)
        parent[nk] = key(r, c)
        queue.push([nr, nc])
      }
    }
  }

  steps.push({
    frontier: [],
    visited: new Set(visited),
    current: null,
    phase: 'no-path',
    message: 'No path exists — end node is unreachable'
  })

  return steps
}
