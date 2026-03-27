/**
 * Pure algorithm logic for Merge Sort visualization.
 */

import { AlgorithmComplexity } from './types'

export const mergeSortComplexity: AlgorithmComplexity = {
  best: 'O(n log n)',
  average: 'O(n log n)',
  worst: 'O(n log n)',
  space: 'O(n)',
  stable: true,
  inPlace: false,
}

export interface MergeSortStep {
  snapshot: number[]
  phase: string
  range: [number, number] | null
  leftRange?: [number, number] | null
  rightRange?: [number, number] | null
  splitPoint?: number
  depth: number
  message: string
}

export function computeMergeSortSteps(init: number[]): MergeSortStep[] {
  const arr = [...init]; const s: MergeSortStep[] = []; const aux = arr.slice()

  const merge = (l: number, m: number, r: number, depth: number) => {
    s.push({ snapshot: arr.slice(), phase: 'merge-start', range: [l, r], leftRange: [l, m], rightRange: [m + 1, r], depth, message: `Merging [${l}–${m}] and [${m + 1}–${r}]` })
    let i = l, j = m + 1, k = l
    while (i <= m && j <= r) { if (aux[i] <= aux[j]) arr[k++] = aux[i++]; else arr[k++] = aux[j++] }
    while (i <= m) arr[k++] = aux[i++]
    while (j <= r) arr[k++] = aux[j++]
    for (let x = l; x <= r; x++) aux[x] = arr[x]
    s.push({ snapshot: arr.slice(), phase: 'merge-done', range: [l, r], leftRange: null, rightRange: null, depth, message: `Merged: [${arr.slice(l, r + 1).join(', ')}]` })
  }

  const sort = (l: number, r: number, depth = 0) => {
    if (l >= r) return
    const m = Math.floor((l + r) / 2)
    s.push({ snapshot: arr.slice(), phase: 'split', range: [l, r], splitPoint: m, depth, message: `Splitting [${l}–${r}] at mid=${m}` })
    sort(l, m, depth + 1); sort(m + 1, r, depth + 1); merge(l, m, r, depth)
  }

  sort(0, arr.length - 1)
  s.push({ snapshot: arr.slice(), phase: 'done', range: null, depth: 0, message: 'Array is sorted' })
  return s
}
