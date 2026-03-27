/**
 * Pure algorithm logic for Radix Sort visualization.
 */

import { AlgorithmComplexity } from './types'

export const radixSortComplexity: AlgorithmComplexity = {
  best: 'O(d × n)',
  average: 'O(d × n)',
  worst: 'O(d × n)',
  space: 'O(n + k)',
  stable: true,
  inPlace: false,
}

export interface RadixSortStep {
  array: number[]
  buckets: number[][]
  digitPlace: number
  digitLabel: string
  highlightIdx: number
  highlightDigit: number
  phase: 'distribute' | 'collect' | 'done'
  message: string
}

export function getDigitLabel(exp: number): string {
  if (exp === 1) return 'ones'
  if (exp === 10) return 'tens'
  if (exp === 100) return 'hundreds'
  if (exp === 1000) return 'thousands'
  return `10^${Math.log10(exp)}`
}

export function computeRadixSortSteps(init: number[]): RadixSortStep[] {
  const arr = [...init]
  const s: RadixSortStep[] = []
  const maxVal = Math.max(...arr)

  s.push({
    array: [...arr], buckets: Array.from({ length: 10 }, () => []),
    digitPlace: 1, digitLabel: 'ones', highlightIdx: -1, highlightDigit: -1,
    phase: 'distribute',
    message: `Starting Radix Sort — max value is ${maxVal} (${String(maxVal).length} digits)`
  })

  let exp = 1
  while (Math.floor(maxVal / exp) > 0) {
    const buckets: number[][] = Array.from({ length: 10 }, () => [])
    const label = getDigitLabel(exp)

    for (let i = 0; i < arr.length; i++) {
      const digit = Math.floor(arr[i] / exp) % 10
      buckets[digit].push(arr[i])
      s.push({
        array: [...arr], buckets: buckets.map(b => [...b]),
        digitPlace: exp, digitLabel: label,
        highlightIdx: i, highlightDigit: digit,
        phase: 'distribute',
        message: `${arr[i]} → ${label} digit is ${digit} → bucket ${digit}`
      })
    }

    let idx = 0
    for (let d = 0; d < 10; d++) {
      for (const val of buckets[d]) {
        arr[idx] = val
        idx++
      }
    }

    s.push({
      array: [...arr], buckets: buckets.map(b => [...b]),
      digitPlace: exp, digitLabel: label,
      highlightIdx: -1, highlightDigit: -1,
      phase: 'collect',
      message: `Collected from buckets by ${label} digit → [${arr.join(', ')}]`
    })

    exp *= 10
  }

  s.push({
    array: [...arr], buckets: Array.from({ length: 10 }, () => []),
    digitPlace: 0, digitLabel: '', highlightIdx: -1, highlightDigit: -1,
    phase: 'done',
    message: 'Array is sorted!'
  })
  return s
}
