/**
 * Shared types for algorithm metadata used across all algorithm modules.
 */

export interface AlgorithmComplexity {
  /** Best-case time complexity (Big-Ω) */
  best: string
  /** Average-case time complexity (Big-Θ) */
  average: string
  /** Worst-case time complexity (Big-O) */
  worst: string
  /** Space complexity */
  space: string
  /** Whether the algorithm is stable (for sorting algorithms) */
  stable?: boolean
  /** Whether the algorithm operates in-place */
  inPlace?: boolean
}
