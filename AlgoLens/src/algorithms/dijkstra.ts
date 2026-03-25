/**
 * Pure algorithm logic for Dijkstra's shortest path visualization.
 */

export interface DijkstraNode {
  id: string
  x: number
  y: number
}

export interface DijkstraEdge {
  from: string
  to: string
  weight: number
}

export interface DijkstraStep {
  type: string
  distances: Record<string, number>
  visited: Set<string>
  current: string | null
  exploring: string | null
  edge: { from: string; to: string } | null
  message: string
  path?: string[]
}

export function buildAdjacencyList(edges: DijkstraEdge[]): Record<string, { node: string; weight: number }[]> {
  const adj: Record<string, { node: string; weight: number }[]> = {}
  edges.forEach(({ from, to, weight }) => {
    if (!adj[from]) adj[from] = []
    if (!adj[to]) adj[to] = []
    adj[from].push({ node: to, weight })
    adj[to].push({ node: from, weight })
  })
  return adj
}

export function dijkstraWithSteps(nodes: DijkstraNode[], edges: DijkstraEdge[], startId: string): DijkstraStep[] {
  const adj = buildAdjacencyList(edges)
  const nodeIds = nodes.map(n => n.id)
  const distances: Record<string, number> = {}
  const previous: Record<string, string | null> = {}
  const visited = new Set<string>()
  nodeIds.forEach(id => { distances[id] = Infinity; previous[id] = null })
  distances[startId] = 0
  const steps: DijkstraStep[] = []
  const pq: { node: string; dist: number }[] = [{ node: startId, dist: 0 }]

  steps.push({ type: 'init', distances: { ...distances }, visited: new Set(visited), current: null, exploring: null, edge: null, message: `Starting from ${startId}. All distances = ∞ except ${startId} = 0` })

  while (pq.length > 0) {
    pq.sort((a, b) => a.dist - b.dist)
    const { node: current, dist: currDist } = pq.shift()!
    if (visited.has(current)) continue

    steps.push({ type: 'visit', distances: { ...distances }, visited: new Set(visited), current, exploring: null, edge: null, message: `Visiting ${current} (distance: ${currDist})` })
    visited.add(current)

    for (const { node: neighbor, weight } of (adj[current] || [])) {
      if (visited.has(neighbor)) continue
      const newDist = currDist + weight
      const improved = newDist < distances[neighbor]

      steps.push({ type: 'explore', distances: { ...distances }, visited: new Set(visited), current, exploring: neighbor, edge: { from: current, to: neighbor }, message: `${current} → ${neighbor}: ${currDist} + ${weight} = ${newDist}${improved ? ' ✓' : ' ✗'}` })

      if (improved) {
        distances[neighbor] = newDist
        previous[neighbor] = current
        pq.push({ node: neighbor, dist: newDist })
        steps.push({ type: 'update', distances: { ...distances }, visited: new Set(visited), current, exploring: neighbor, edge: { from: current, to: neighbor }, message: `Updated d(${neighbor}) = ${newDist}` })
      }
    }
  }

  // Reconstruct shortest path tree
  const paths: Record<string, string[]> = {}
  nodeIds.forEach(id => {
    const path: string[] = []
    let cur: string | null = id
    while (cur) { path.unshift(cur); cur = previous[cur] }
    if (path[0] === startId) paths[id] = path
  })

  steps.push({
    type: 'done',
    distances: { ...distances },
    visited: new Set(visited),
    current: null,
    exploring: null,
    edge: null,
    message: `✓ All shortest paths from ${startId} computed`,
    path: Object.keys(paths)
  })

  return steps
}
