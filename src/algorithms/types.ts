/**
 * Shared types for algorithm metadata used across all algorithm modules.
 */

export interface AlgorithmComplexity {
  /** Best-case time complexity (Big-Ω) */
  best: string;
  /** Detailed textual explanation of the best-case scenario */
  bestDescription?: string;
  /** Average-case time complexity (Big-Θ) */
  average: string;
  /** Worst-case time complexity (Big-O) */
  worst: string;
  /** Detailed textual explanation of the worst-case scenario */
  worstDescription?: string;
  /** Space complexity */
  space: string;
  /** Detailed textual explanation of the space complexity requirements */
  spaceDescription?: string;
  /** Whether the algorithm is stable (for sorting algorithms) */
  stable?: boolean;
  /** Whether the algorithm operates in-place */
  inPlace?: boolean;
}
