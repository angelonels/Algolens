/**
 * Standardized semantic color tokens for visualizer node states.
 * Ensures that different algorithms use consistent colors.
 */
export const AlgorithmColors = {
  DEFAULT: '#e2e8f0', // slate-200
  COMPARE: '#fbbf24', // amber-400
  SWAP: '#f87171',    // red-400
  SORTED: '#34d399',  // emerald-400
  PIVOT: '#a78bfa',   // violet-400
  PATH: '#60a5fa',    // blue-400
  VISITED: '#d8b4fe', // purple-300
} as const;

export type SemanticColorName = keyof typeof AlgorithmColors;
