/**
 * Pure algorithm logic for Linear Regression (gradient descent) visualization.
 */

import { AlgorithmComplexity } from './types'

export const linearRegressionComplexity: AlgorithmComplexity = {
  best: 'O(n × epochs)',
  average: 'O(n × epochs)',
  worst: 'O(n × epochs)',
  space: 'O(n)',
}

export interface LinearRegressionStep {
  m: number
  b: number
  cost: number
  epoch: number
  dm: number
  db: number
  phase: string
  message: string
}

export interface DataPoint {
  x: number
  y: number
}

export function generateLinearData(n = 30): DataPoint[] {
  const trueM = 1.5 + (Math.random() - 0.5) * 2
  const trueB = 0.5 + (Math.random() - 0.5) * 1
  const points: DataPoint[] = []
  for (let i = 0; i < n; i++) {
    const x = Math.random() * 4 + 0.5
    const noise = (Math.random() - 0.5) * 2.5
    const y = trueM * x + trueB + noise
    points.push({ x, y })
  }
  return points
}

export function computeLinearRegressionSteps(points: DataPoint[], lr = 0.05, maxEpochs = 60): LinearRegressionStep[] {
  let m = 0, b = 0
  const n = points.length
  const steps: LinearRegressionStep[] = []

  steps.push({
    m, b,
    cost: points.reduce((s, p) => s + (p.y - (m * p.x + b)) ** 2, 0) / n,
    epoch: 0,
    dm: 0, db: 0,
    phase: 'init',
    message: 'Initial state: m=0, b=0 — flat line'
  })

  for (let epoch = 1; epoch <= maxEpochs; epoch++) {
    const predictions = points.map(p => m * p.x + b)
    const dm = (-2 / n) * points.reduce((s, p, i) => s + p.x * (p.y - predictions[i]), 0)
    const db = (-2 / n) * points.reduce((s, p, i) => s + (p.y - predictions[i]), 0)

    m -= lr * dm
    b -= lr * db

    const newCost = points.reduce((s, p) => s + (p.y - (m * p.x + b)) ** 2, 0) / n

    steps.push({
      m, b, cost: newCost,
      epoch, dm, db,
      phase: newCost < 0.5 ? 'converging' : 'training',
      message: `Epoch ${epoch}: m=${m.toFixed(3)}, b=${b.toFixed(3)}, cost=${newCost.toFixed(4)}`
    })

    if (Math.abs(dm) < 0.001 && Math.abs(db) < 0.001) {
      steps[steps.length - 1].phase = 'converged'
      steps[steps.length - 1].message = `✓ Converged at epoch ${epoch}: y = ${m.toFixed(3)}x + ${b.toFixed(3)}`
      break
    }
  }

  if (steps[steps.length - 1].phase !== 'converged') {
    steps[steps.length - 1].phase = 'converged'
    steps[steps.length - 1].message = `✓ Training complete: y = ${m.toFixed(3)}x + ${b.toFixed(3)}, cost=${steps[steps.length - 1].cost.toFixed(4)}`
  }

  return steps
}
