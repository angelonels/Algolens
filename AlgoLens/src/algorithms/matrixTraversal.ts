/**
 * Pure algorithm logic for Spiral Matrix Traversal visualization.
 */

import { AlgorithmComplexity } from './types'

export const matrixTraversalComplexity: AlgorithmComplexity = {
  best: 'O(m × n)',
  average: 'O(m × n)',
  worst: 'O(m × n)',
  space: 'O(m × n)',
}

export interface MatrixStep {
  row: number
  col: number
  direction: string
  layer: number
}

export function computeSpiralSteps(N: number): MatrixStep[] {
  const res: MatrixStep[] = []
  const dirs = ['→ Right', '↓ Down', '← Left', '↑ Up']
  let top = 0, bottom = N - 1, left = 0, right = N - 1
  while (top <= bottom && left <= right) {
    for (let j = left; j <= right; j++)
      res.push({ row: top, col: j, direction: dirs[0], layer: Math.min(top, left) })
    top++
    for (let i = top; i <= bottom; i++)
      res.push({ row: i, col: right, direction: dirs[1], layer: Math.min(top - 1, N - 1 - right) })
    right--
    if (top <= bottom) {
      for (let j = right; j >= left; j--)
        res.push({ row: bottom, col: j, direction: dirs[2], layer: Math.min(N - 1 - bottom, left) })
      bottom--
    }
    if (left <= right) {
      for (let i = bottom; i >= top; i--)
        res.push({ row: i, col: left, direction: dirs[3], layer: Math.min(top, left) })
      left++
    }
  }
  return res
}
