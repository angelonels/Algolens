/**
 * Pure algorithm logic for DFS grid search visualization.
 */

import { AlgorithmComplexity } from './types'

export const dfsComplexity: AlgorithmComplexity = {
  best: 'O(V + E)',
  average: 'O(V + E)',
  worst: 'O(V + E)',
  space: 'O(V)',
}

const key = (r: number, c: number) => `${r}-${c}`

export interface DFSStep {
  stack: number[][]
  visited: Set<string>
  current: number[] | null
  path?: number[][]
  phase: 'init' | 'explore' | 'found' | 'no-path'
  message: string
}

export function dfsWithSteps(walls: number[][], start: number[], end: number[], rows: number, cols: number): DFSStep[] {
  const wallSet = new Set(walls.map(([r, c]) => key(r, c)))
  const visited = new Set<string>()
  const parent: Record<string, string> = {}
  const stack: number[][] = [[start[0], start[1]]]

  const steps: DFSStep[] = []
  const dirs = [[0, 1], [1, 0], [0, -1], [-1, 0]]

  steps.push({
    stack: [[start[0], start[1]]],
    visited: new Set(),
    current: null,
    phase: 'init',
    message: `Starting DFS from (${start[0]}, ${start[1]})`
  })

  while (stack.length > 0) {
    const [r, c] = stack.pop()!
    const k = key(r, c)

    if (visited.has(k)) continue
    visited.add(k)

    steps.push({
      stack: stack.map(s => [s[0], s[1]]),
      visited: new Set(visited),
      current: [r, c],
      phase: 'explore',
      message: `Exploring (${r}, ${c}) — stack depth: ${stack.length}`
    })

    if (r === end[0] && c === end[1]) {
      const path: number[][] = []
      let cur: string | undefined = k
      while (cur) {
        const [pr, pc] = cur.split('-').map(Number)
        path.unshift([pr, pc])
        cur = parent[cur]
      }

      steps.push({
        stack: [],
        visited: new Set(visited),
        current: [r, c],
        path,
        phase: 'found',
        message: `Path found — ${path.length} steps`
      })
      return steps
    }

    // Push in reverse so we explore in consistent order
    for (let i = dirs.length - 1; i >= 0; i--) {
      const [dr, dc] = dirs[i]
      const nr = r + dr, nc = c + dc
      const nk = key(nr, nc)
      if (nr >= 0 && nr < rows && nc >= 0 && nc < cols && !visited.has(nk) && !wallSet.has(nk)) {
        parent[nk] = k
        stack.push([nr, nc])
      }
    }
  }

  steps.push({
    stack: [],
    visited: new Set(visited),
    current: null,
    phase: 'no-path',
    message: 'No path exists — end node is unreachable'
  })

  return steps
}
