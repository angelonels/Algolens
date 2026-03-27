/**
 * Pure algorithm logic for Binary Search visualization.
 */

import { AlgorithmComplexity } from './types'

export const binarySearchComplexity: AlgorithmComplexity = {
  best: 'O(1)',
  average: 'O(log n)',
  worst: 'O(log n)',
  space: 'O(1)',
}

export interface BinarySearchStep {
  low: number
  mid: number
  high: number
  found: boolean
  message: string
}

export function computeBinarySearchSteps(array: number[], target: number): BinarySearchStep[] {
  let low = 0, high = array.length - 1
  const s: BinarySearchStep[] = []
  while (low <= high) {
    const mid = Math.floor((low + high) / 2)
    const found = array[mid] === target
    s.push({
      low,
      mid,
      high,
      found,
      message: found
        ? `Found ${target} at index ${mid}`
        : array[mid] < target
          ? `${array[mid]} < ${target} → search right (${mid + 1}..${high})`
          : `${array[mid]} > ${target} → search left (${low}..${mid - 1})`
    })
    if (found) break
    if (array[mid] < target) { low = mid + 1 } else { high = mid - 1 }
  }
  if (s.length === 0 || !s[s.length - 1].found) {
    s.push({ low: -1, mid: -1, high: -1, found: false, message: `${target} not found in array` })
  }
  return s
}
