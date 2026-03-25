/**
 * Pure algorithm logic for K-Means clustering visualization.
 */

export interface KMeansStep {
  points: number[][]
  centroids: number[][]
  assignments: number[]
  phase: 'init' | 'assign' | 'update' | 'converged'
  iteration: number
  message: string
}

function dist(a: number[], b: number[]): number {
  return Math.sqrt((a[0] - b[0]) ** 2 + (a[1] - b[1]) ** 2)
}

export function generatePoints(n = 60): number[][] {
  const points: number[][] = []
  const centers = [
    [0.25, 0.3], [0.75, 0.25], [0.5, 0.75], [0.2, 0.7], [0.8, 0.7]
  ]
  for (let i = 0; i < n; i++) {
    const ci = Math.floor(Math.random() * centers.length)
    const [cx, cy] = centers[ci]
    points.push([
      Math.max(0.05, Math.min(0.95, cx + (Math.random() - 0.5) * 0.35)),
      Math.max(0.05, Math.min(0.95, cy + (Math.random() - 0.5) * 0.35))
    ])
  }
  return points
}

export function computeKMeansSteps(points: number[][], k: number, maxIter = 20): KMeansStep[] {
  const steps: KMeansStep[] = []
  const shuffled = [...points].sort(() => Math.random() - 0.5)
  let centroids = shuffled.slice(0, k).map(p => [...p])

  steps.push({
    points,
    centroids: centroids.map(c => [...c]),
    assignments: new Array(points.length).fill(-1),
    phase: 'init',
    iteration: 0,
    message: `Initialized ${k} random centroids`
  })

  for (let iter = 1; iter <= maxIter; iter++) {
    const assignments = points.map(p => {
      let minD = Infinity, closest = 0
      centroids.forEach((c, ci) => {
        const d = dist(p, c)
        if (d < minD) { minD = d; closest = ci }
      })
      return closest
    })

    steps.push({
      points,
      centroids: centroids.map(c => [...c]),
      assignments: [...assignments],
      phase: 'assign',
      iteration: iter,
      message: `Iteration ${iter}: assigned ${points.length} points to ${k} clusters`
    })

    const newCentroids = centroids.map((_, ci) => {
      const cluster = points.filter((_, pi) => assignments[pi] === ci)
      if (cluster.length === 0) return centroids[ci]
      return [
        cluster.reduce((s, p) => s + p[0], 0) / cluster.length,
        cluster.reduce((s, p) => s + p[1], 0) / cluster.length
      ]
    })

    const moved = centroids.some((c, i) => dist(c, newCentroids[i]) > 0.001)
    centroids = newCentroids

    steps.push({
      points,
      centroids: centroids.map(c => [...c]),
      assignments: [...assignments],
      phase: moved ? 'update' : 'converged',
      iteration: iter,
      message: moved
        ? `Updated centroids — shifts detected`
        : `✓ Converged at iteration ${iter} — centroids stable`
    })

    if (!moved) break
  }

  if (steps[steps.length - 1].phase !== 'converged') {
    const last = steps[steps.length - 1]
    last.phase = 'converged'
    last.message = `✓ Max iterations reached — ${k} clusters formed`
  }

  return steps
}
