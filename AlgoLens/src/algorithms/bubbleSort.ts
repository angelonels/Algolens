/**
 * Pure algorithm logic for Bubble Sort visualization.
 * No React, no DOM, no side effects — only step computation.
 */

import { AlgorithmComplexity } from './types'

export const bubbleSortComplexity: AlgorithmComplexity = {
  best: 'O(n)',
  average: 'O(n²)',
  worst: 'O(n²)',
  space: 'O(1)',
  stable: true,
  inPlace: true,
}

export interface BubbleSortStep {
  array: number[]
  compare: number[]
  swap: boolean
  swapping: boolean
  sortedCount: number
  pass: number
  message: string
}

export function computeBubbleSortSteps(init: number[]): BubbleSortStep[] {
  const arr = [...init]
  const s: BubbleSortStep[] = []
  const n = arr.length

  for (let i = 0; i < n; i++) {
    let swappedThisPass = false
    for (let j = 0; j < n - i - 1; j++) {
      const isSwap = arr[j] > arr[j + 1]
      s.push({ array: [...arr], compare: [j, j + 1], swap: false, swapping: isSwap, sortedCount: i, pass: i + 1, message: `Comparing ${arr[j]} and ${arr[j + 1]}${isSwap ? ' → swap' : ' → no swap'}` })
      if (isSwap) {
        [arr[j], arr[j + 1]] = [arr[j + 1], arr[j]]
        swappedThisPass = true
        s.push({ array: [...arr], compare: [j, j + 1], swap: true, swapping: false, sortedCount: i, pass: i + 1, message: `Swapped ${arr[j + 1]} ↔ ${arr[j]}` })
      }
    }
    if (!swappedThisPass) break
  }
  s.push({ array: [...arr], compare: [], swap: false, swapping: false, sortedCount: n, pass: n, message: 'Array is sorted' })
  return s
}
