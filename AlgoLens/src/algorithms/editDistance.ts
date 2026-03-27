/**
 * Pure algorithm logic for Edit Distance visualization.
 */

import { AlgorithmComplexity } from './types'

export const editDistanceComplexity: AlgorithmComplexity = {
  best: 'O(m × n)',
  average: 'O(m × n)',
  worst: 'O(m × n)',
  space: 'O(m × n)',
}

export interface EditDistanceStep {
  dp: number[][]
  i: number
  j: number
  phase: string
  op: string
  message: string
}

export function computeEditDistanceSteps(word1: string, word2: string): EditDistanceStep[] {
  const m = word1.length, n = word2.length
  const dp: number[][] = Array.from({ length: m + 1 }, () => Array(n + 1).fill(0))
  const steps: EditDistanceStep[] = []

  // Base cases
  for (let i = 0; i <= m; i++) dp[i][0] = i
  for (let j = 0; j <= n; j++) dp[0][j] = j

  steps.push({
    dp: dp.map(r => [...r]),
    i: -1, j: -1,
    phase: 'init',
    op: '',
    message: `Initialized: converting "${word1}" → "${word2}" (${m}×${n} DP table)`
  })

  for (let i = 1; i <= m; i++) {
    for (let j = 1; j <= n; j++) {
      if (word1[i - 1] === word2[j - 1]) {
        dp[i][j] = dp[i - 1][j - 1]
        steps.push({
          dp: dp.map(r => [...r]),
          i, j,
          phase: 'match',
          op: 'match',
          message: `'${word1[i - 1]}' = '${word2[j - 1]}' → copy diagonal ${dp[i - 1][j - 1]}`
        })
      } else {
        const ins = dp[i][j - 1] + 1
        const del = dp[i - 1][j] + 1
        const rep = dp[i - 1][j - 1] + 1
        dp[i][j] = Math.min(ins, del, rep)
        const op = dp[i][j] === rep ? 'replace' : dp[i][j] === del ? 'delete' : 'insert'
        steps.push({
          dp: dp.map(r => [...r]),
          i, j,
          phase: 'compute',
          op,
          message: `'${word1[i - 1]}' ≠ '${word2[j - 1]}' → ${op} (min of ins=${ins}, del=${del}, rep=${rep}) = ${dp[i][j]}`
        })
      }
    }
  }

  steps.push({
    dp: dp.map(r => [...r]),
    i: m, j: n,
    phase: 'done',
    op: '',
    message: `Edit distance = ${dp[m][n]}`
  })

  return steps
}
