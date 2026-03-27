/**
 * Pure algorithm logic for Quick Sort visualization.
 */

import { AlgorithmComplexity } from './types'

export const quickSortComplexity: AlgorithmComplexity = {
  best: 'O(n log n)',
  average: 'O(n log n)',
  worst: 'O(n²)',
  space: 'O(log n)',
  stable: false,
  inPlace: true,
}

export interface QuickSortStep {
  array: number[]
  pivot: number
  pivotValue?: number
  compare: number[]
  phase: string
  range: [number, number] | null
  depth: number
  sortedIndices: Set<number>
  message: string
}

export function computeQuickSortSteps(init: number[]): QuickSortStep[] {
  const arr = [...init]; const s: QuickSortStep[] = []; const sorted = new Set<number>()

  const partition = (low: number, high: number, depth: number): number => {
    const pivot = arr[high]; let i = low - 1
    s.push({ array: [...arr], pivot: high, pivotValue: pivot, compare: [], phase: 'select-pivot', range: [low, high], depth, sortedIndices: new Set(sorted), message: `Pivot selected: ${pivot} (index ${high})` })

    for (let j = low; j < high; j++) {
      const willSwap = arr[j] <= pivot
      s.push({ array: [...arr], pivot: high, pivotValue: pivot, compare: [j], phase: 'compare', range: [low, high], depth, sortedIndices: new Set(sorted), message: `Comparing ${arr[j]} with pivot ${pivot}${willSwap ? ' → swap' : ''}` })
      if (willSwap) {
        i++
        if (i !== j) {
          [arr[i], arr[j]] = [arr[j], arr[i]]
          s.push({ array: [...arr], pivot: high, pivotValue: pivot, compare: [i, j], phase: 'swap', range: [low, high], depth, sortedIndices: new Set(sorted), message: `Swapped ${arr[j]} ↔ ${arr[i]}` })
        }
      }
    }
    if (i + 1 !== high) [arr[i + 1], arr[high]] = [arr[high], arr[i + 1]]
    sorted.add(i + 1)
    s.push({ array: [...arr], pivot: i + 1, pivotValue: arr[i + 1], compare: [], phase: 'pivot-placed', range: [low, high], depth, sortedIndices: new Set(sorted), message: `Pivot ${arr[i + 1]} placed at position ${i + 1}` })
    return i + 1
  }

  const qs = (low: number, high: number, depth = 0) => {
    if (low < high) { const pi = partition(low, high, depth); qs(low, pi - 1, depth + 1); qs(pi + 1, high, depth + 1) }
    else if (low === high) sorted.add(low)
  }

  qs(0, arr.length - 1)
  s.push({ array: [...arr], pivot: -1, compare: [], phase: 'done', range: null, depth: 0, sortedIndices: new Set(Array.from({ length: arr.length }, (_, i) => i)), message: 'Array is sorted' })
  return s
}
