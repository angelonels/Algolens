/**
 * Pure algorithm logic for Euclidean GCD visualization.
 */

import { AlgorithmComplexity } from './types'

export const euclideanGCDComplexity: AlgorithmComplexity = {
  best: 'O(1)',
  average: 'O(log(min(a, b)))',
  worst: 'O(log(min(a, b)))',
  space: 'O(1)',
}

export interface GCDStep {
  x: number
  y: number
  r: number | null
  phase: string
  message: string
  oldX?: number
  oldY?: number
}

export function computeGCDSteps(a: number, b: number): GCDStep[] {
  let x = a, y = b
  const s: GCDStep[] = []

  s.push({
    x, y, r: null,
    phase: 'start',
    message: `Starting with gcd(${x}, ${y})`
  })

  while (y !== 0) {
    const r = x % y
    s.push({
      x, y, r,
      phase: 'compute',
      message: `${x} % ${y} = ${r}`
    })

    const oldX = x, oldY = y
    x = y
    y = r

    s.push({
      x, y, r: null,
      phase: 'update',
      oldX, oldY,
      message: `gcd(${oldX}, ${oldY}) → gcd(${x}, ${y})`
    })
  }

  s.push({
    x, y: 0, r: null,
    phase: 'done',
    message: `GCD = ${x}`
  })

  return s
}
