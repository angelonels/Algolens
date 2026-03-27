/**
 * Pure algorithm logic for Decision Tree visualization.
 */

import { AlgorithmComplexity } from './types'

export const decisionTreeComplexity: AlgorithmComplexity = {
  best: 'O(n × m × log n)',
  average: 'O(n × m × log n)',
  worst: 'O(n² × m)',
  space: 'O(n)',
}

export interface TreeNode {
  id: number
  depth: number
  parentId: number | null
  side: 'left' | 'right' | null
  leaf: boolean
  prediction?: number
  feature?: string
  featureIdx?: number
  value?: number
  gini?: number
  count: number
  bounds: Bounds
}

export interface Bounds {
  xMin: number
  xMax: number
  yMin: number
  yMax: number
}

export interface SplitLine {
  feature: string
  value: number
  bounds: Bounds
  depth: number
}

export interface DecisionTreeStep {
  tree: Record<number, TreeNode>
  splits: SplitLine[]
  activeNode: number | null
  phase: string
  depth: number
  message: string
}

export interface DataPoint {
  x: number
  y: number
  label: number
}

export function generateDecisionTreeData(nPerClass = 25): DataPoint[] {
  const points: DataPoint[] = []
  const configs = [
    { cx: 1.5, cy: 1.5, label: 0 },
    { cx: 3.5, cy: 3.5, label: 1 },
    { cx: 3.5, cy: 1.0, label: 2 }
  ]
  configs.forEach(({ cx, cy, label }) => {
    for (let i = 0; i < nPerClass; i++) {
      points.push({
        x: cx + (Math.random() - 0.5) * 2.5,
        y: cy + (Math.random() - 0.5) * 2.5,
        label
      })
    }
  })
  return points.sort(() => Math.random() - 0.5)
}

function gini(groups: DataPoint[][], classes: number[]): number {
  const total = groups.reduce((s, g) => s + g.length, 0)
  if (total === 0) return 0
  let score = 0
  groups.forEach(group => {
    if (group.length === 0) return
    let s = 0
    classes.forEach(c => {
      const p = group.filter(r => r.label === c).length / group.length
      s += p * p
    })
    score += (1 - s) * (group.length / total)
  })
  return score
}

function findBestSplit(data: DataPoint[], classes: number[]) {
  let best: { gini: number; feature: string | null; featureIdx?: number; value: number | null; left?: DataPoint[]; right?: DataPoint[] } = { gini: 1, feature: null, value: null }
  const features: ('x' | 'y')[] = ['x', 'y']

  features.forEach((feat, fi) => {
    const vals = [...new Set(data.map(p => p[feat]))].sort((a, b) => a - b)
    for (let i = 0; i < vals.length - 1; i++) {
      const threshold = (vals[i] + vals[i + 1]) / 2
      const left = data.filter(p => p[feat] < threshold)
      const right = data.filter(p => p[feat] >= threshold)
      const g = gini([left, right], classes)
      if (g < best.gini) {
        best = { gini: g, feature: feat, featureIdx: fi, value: threshold, left, right }
      }
    }
  })
  return best
}

export function buildTreeSteps(data: DataPoint[], maxDepth = 4): { steps: DecisionTreeStep[]; bounds: Bounds } {
  const classes = [...new Set(data.map(p => p.label))]
  const steps: DecisionTreeStep[] = []
  let nodeId = 0

  const tree: Record<number, TreeNode> = {}
  const splits: SplitLine[] = []

  steps.push({
    tree: {},
    splits: [],
    activeNode: null,
    phase: 'init',
    depth: 0,
    message: `Starting with ${data.length} data points, ${classes.length} classes`
  })

  function recurse(nodeData: DataPoint[], depth: number, parentId: number | null, side: 'left' | 'right' | null, bounds: Bounds) {
    const id = nodeId++
    const majorityClass = classes.reduce((best, c) => {
      const count = nodeData.filter(p => p.label === c).length
      return count > best.count ? { class: c, count } : best
    }, { class: 0, count: 0 }).class

    const pure = nodeData.every(p => p.label === majorityClass)

    if (pure || depth >= maxDepth || nodeData.length <= 2) {
      tree[id] = {
        id, depth, parentId, side, leaf: true,
        prediction: majorityClass,
        count: nodeData.length,
        bounds
      }

      steps.push({
        tree: JSON.parse(JSON.stringify(tree)),
        splits: [...splits],
        activeNode: id,
        phase: 'leaf',
        depth,
        message: pure
          ? `Leaf node: all ${nodeData.length} points are class ${majorityClass} (pure)`
          : `Leaf node: majority class ${majorityClass} (${nodeData.filter(p => p.label === majorityClass).length}/${nodeData.length}), max depth reached`
      })
      return
    }

    const best = findBestSplit(nodeData, classes)

    if (!best.feature) {
      tree[id] = { id, depth, parentId, side, leaf: true, prediction: majorityClass, count: nodeData.length, bounds }
      steps.push({
        tree: JSON.parse(JSON.stringify(tree)),
        splits: [...splits],
        activeNode: id,
        phase: 'leaf',
        depth,
        message: `Leaf node: no valid split found`
      })
      return
    }

    tree[id] = {
      id, depth, parentId, side, leaf: false,
      feature: best.feature, value: best.value!,
      gini: best.gini, count: nodeData.length,
      bounds
    }

    const splitLine: SplitLine = {
      feature: best.feature,
      value: best.value!,
      bounds: { ...bounds },
      depth
    }
    splits.push(splitLine)

    steps.push({
      tree: JSON.parse(JSON.stringify(tree)),
      splits: [...splits],
      activeNode: id,
      phase: 'split',
      depth,
      message: `Split on ${best.feature} < ${best.value!.toFixed(2)} (gini=${best.gini.toFixed(3)}) → ${best.left!.length} left, ${best.right!.length} right`
    })

    const leftBounds = { ...bounds }
    const rightBounds = { ...bounds }
    if (best.feature === 'x') {
      leftBounds.xMax = best.value!
      rightBounds.xMin = best.value!
    } else {
      leftBounds.yMax = best.value!
      rightBounds.yMin = best.value!
    }

    recurse(best.left!, depth + 1, id, 'left', leftBounds)
    recurse(best.right!, depth + 1, id, 'right', rightBounds)
  }

  const xMin = Math.min(...data.map(p => p.x)) - 0.5
  const xMax = Math.max(...data.map(p => p.x)) + 0.5
  const yMin = Math.min(...data.map(p => p.y)) - 0.5
  const yMax = Math.max(...data.map(p => p.y)) + 0.5

  recurse(data, 0, null, null, { xMin, xMax, yMin, yMax })

  steps.push({
    tree: JSON.parse(JSON.stringify(tree)),
    splits: [...splits],
    activeNode: null,
    phase: 'done',
    depth: 0,
    message: `✓ Tree complete — ${Object.keys(tree).length} nodes, ${Object.values(tree).filter(n => n.leaf).length} leaves`
  })

  return { steps, bounds: { xMin, xMax, yMin, yMax } }
}
