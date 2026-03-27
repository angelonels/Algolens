/**
 * Pure algorithm logic for Heap Sort visualization.
 */

import { AlgorithmComplexity } from './types'

export const heapSortComplexity: AlgorithmComplexity = {
  best: 'O(n log n)',
  average: 'O(n log n)',
  worst: 'O(n log n)',
  space: 'O(1)',
  stable: false,
  inPlace: true,
}

export interface HeapSortStep {
  array: number[]
  compare: number[]
  swap: boolean
  sortedCount: number
  phase: 'build' | 'extract' | 'done'
  message: string
}

export function computeHeapSortSteps(init: number[]): HeapSortStep[] {
  const arr = [...init]
  const s: HeapSortStep[] = []
  const n = arr.length

  const heapify = (size: number, i: number, phase: 'build' | 'extract') => {
    let largest = i
    const left = 2 * i + 1
    const right = 2 * i + 2

    if (left < size) {
      s.push({
        array: [...arr], compare: [largest, left], swap: false,
        sortedCount: n - size, phase,
        message: `Comparing ${arr[largest]} with left child ${arr[left]}`
      })
      if (arr[left] > arr[largest]) largest = left
    }
    if (right < size) {
      s.push({
        array: [...arr], compare: [largest, right], swap: false,
        sortedCount: n - size, phase,
        message: `Comparing ${arr[largest]} with right child ${arr[right]}`
      })
      if (arr[right] > arr[largest]) largest = right
    }

    if (largest !== i) {
      s.push({
        array: [...arr], compare: [i, largest], swap: true,
        sortedCount: n - size, phase,
        message: `Swapping ${arr[i]} ↔ ${arr[largest]}`
      });
      [arr[i], arr[largest]] = [arr[largest], arr[i]]
      s.push({
        array: [...arr], compare: [i, largest], swap: true,
        sortedCount: n - size, phase,
        message: `Swapped — continuing heapify`
      })
      heapify(size, largest, phase)
    }
  }

  // Build max heap
  s.push({
    array: [...arr], compare: [], swap: false,
    sortedCount: 0, phase: 'build',
    message: 'Building max heap from the array…'
  })
  for (let i = Math.floor(n / 2) - 1; i >= 0; i--) {
    heapify(n, i, 'build')
  }
  s.push({
    array: [...arr], compare: [], swap: false,
    sortedCount: 0, phase: 'build',
    message: `Max heap built — root is ${arr[0]}`
  })

  // Extract elements
  for (let i = n - 1; i > 0; i--) {
    s.push({
      array: [...arr], compare: [0, i], swap: true,
      sortedCount: n - 1 - i, phase: 'extract',
      message: `Moving max ${arr[0]} to position ${i}`
    });
    [arr[0], arr[i]] = [arr[i], arr[0]]
    s.push({
      array: [...arr], compare: [0, i], swap: true,
      sortedCount: n - i, phase: 'extract',
      message: `${arr[i]} placed — re-heapifying remaining ${i} elements`
    })
    heapify(i, 0, 'extract')
  }

  s.push({
    array: [...arr], compare: [], swap: false,
    sortedCount: n, phase: 'done',
    message: 'Array is sorted!'
  })
  return s
}
