/**
 * Pure algorithm logic for Logistic Regression visualization.
 */

export interface LogisticRegressionStep {
  w: number
  b: number
  cost: number
  epoch: number
  accuracy: number
  dw: number
  db: number
  phase: string
  message: string
}

export interface ClassPoint {
  x: number
  y: number
  label: number
  id: string
}

export function sigmoid(z: number): number {
  return 1 / (1 + Math.exp(-Math.max(-500, Math.min(500, z))))
}

export function generateLogisticData(n = 40, noise = 1.5): ClassPoint[] {
  const points: ClassPoint[] = []
  const sep = 2.5 + Math.random() * 1.5
  for (let i = 0; i < n; i++) {
    const label = i < n / 2 ? 0 : 1
    const center = label === 0 ? -sep / 2 : sep / 2
    const x = center + (Math.random() - 0.5) * noise * 2
    const y = (Math.random() - 0.5) * 3
    points.push({ x, y, label, id: `p-${i}-${Math.random().toString(36).slice(2, 6)}` })
  }
  return points.sort(() => Math.random() - 0.5)
}

export function computeLogRegSteps(points: ClassPoint[], lr = 0.3, maxEpochs = 50): LogisticRegressionStep[] {
  let w = 0, b = 0
  const n = points.length
  const steps: LogisticRegressionStep[] = []

  const getAccuracy = (w: number, b: number) =>
    points.filter(p => (sigmoid(w * p.x + b) >= 0.5 ? 1 : 0) === p.label).length / n

  const getCost = (w: number, b: number) =>
    -points.reduce((s, p) => {
      const pred = sigmoid(w * p.x + b)
      return s + p.label * Math.log(pred + 1e-8) + (1 - p.label) * Math.log(1 - pred + 1e-8)
    }, 0) / n

  steps.push({
    w, b,
    cost: getCost(w, b),
    epoch: 0,
    accuracy: getAccuracy(w, b),
    dw: 0, db: 0,
    phase: 'init',
    message: 'Initializing: w=0, b=0 — random guessing'
  })

  for (let epoch = 1; epoch <= maxEpochs; epoch++) {
    let dw = 0, db = 0
    points.forEach(p => {
      const pred = sigmoid(w * p.x + b)
      dw += (pred - p.label) * p.x
      db += (pred - p.label)
    })
    dw /= n
    db /= n

    w -= lr * dw
    b -= lr * db

    const cost = getCost(w, b)
    const accuracy = getAccuracy(w, b)
    const converged = Math.abs(dw) < 0.005 && Math.abs(db) < 0.005

    steps.push({
      w, b, cost, epoch, accuracy, dw, db,
      phase: converged ? 'converged' : 'training',
      message: converged
        ? `✓ Converged at epoch ${epoch} — accuracy ${(accuracy * 100).toFixed(1)}%`
        : `Epoch ${epoch}: w=${w.toFixed(3)}, b=${b.toFixed(3)}, acc=${(accuracy * 100).toFixed(1)}%`
    })

    if (converged) break
  }

  if (steps[steps.length - 1].phase !== 'converged') {
    const last = steps[steps.length - 1]
    last.phase = 'converged'
    last.message = `✓ Complete — accuracy ${(last.accuracy * 100).toFixed(1)}%, boundary x=${last.w !== 0 ? (-last.b / last.w).toFixed(2) : '∞'}`
  }

  return steps
}
