import { ALGORITHMS } from './algorithmRegistry'

export interface ComplexityInfo {
  name: string
  path: string
  tag: string
  best: string
  average: string
  worst: string
  space: string
  stable?: boolean
  inPlace?: boolean
  difficulty: string
  useCase: string
  notes: string
}

export const COMPLEXITY_DATA: ComplexityInfo[] = ALGORITHMS.map((algorithm) => ({
  name: algorithm.name === 'Edit Distance (DP)' ? 'Edit Distance' : algorithm.name,
  path: algorithm.path,
  tag: algorithm.tag,
  best: algorithm.complexity.best,
  average: algorithm.complexity.average,
  worst: algorithm.complexity.worst,
  space: algorithm.complexity.space,
  stable: algorithm.stable,
  inPlace: algorithm.inPlace,
  difficulty: algorithm.difficulty,
  useCase: algorithm.useCase,
  notes: algorithm.learnMore,
}))
