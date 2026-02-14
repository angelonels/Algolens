import React, { useState, useEffect, useRef } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { SPEED_PRESETS, COLORS, SPRING } from '../utils/animationConfig'
import {
    SpeedControl, StepCounter, StatusMessage, ControlButton, Legend,
    CodeBlock, PageContainer, ExplanationBox, VisualizationContainer, ControlsRow
} from '../components/ui/AnimationComponents'

const dijkstraPythonCode = `import heapq

def dijkstra(graph, start):
    distances = {node: float('inf') for node in graph}
    distances[start] = 0
    pq = [(0, start)]
    visited = set()
    
    while pq:
        curr_dist, curr = heapq.heappop(pq)
        if curr in visited: continue
        visited.add(curr)
        for neighbor, weight in graph[curr]:
            distance = curr_dist + weight
            if distance < distances[neighbor]:
                distances[neighbor] = distance
                heapq.heappush(pq, (distance, neighbor))
    return distances`

const initialGraph = {
    nodes: [
        { id: 'A', x: 80, y: 140 }, { id: 'B', x: 220, y: 50 },
        { id: 'C', x: 220, y: 230 }, { id: 'D', x: 380, y: 140 },
        { id: 'E', x: 520, y: 50 }, { id: 'F', x: 520, y: 230 }
    ],
    edges: [
        { from: 'A', to: 'B', weight: 4 }, { from: 'A', to: 'C', weight: 2 },
        { from: 'B', to: 'C', weight: 1 }, { from: 'B', to: 'D', weight: 5 },
        { from: 'C', to: 'D', weight: 8 }, { from: 'C', to: 'F', weight: 10 },
        { from: 'D', to: 'E', weight: 2 }, { from: 'D', to: 'F', weight: 6 },
        { from: 'E', to: 'F', weight: 3 }
    ]
}

function buildAdjacencyList(edges) {
    const adj = {}
    edges.forEach(({ from, to, weight }) => {
        if (!adj[from]) adj[from] = []
        if (!adj[to]) adj[to] = []
        adj[from].push({ node: to, weight })
        adj[to].push({ node: from, weight })
    })
    return adj
}

function dijkstraWithSteps(nodes, edges, startId) {
    const adj = buildAdjacencyList(edges)
    const nodeIds = nodes.map(n => n.id)
    const distances = {}, previous = {}
    const visited = new Set()
    nodeIds.forEach(id => { distances[id] = Infinity; previous[id] = null })
    distances[startId] = 0
    const steps = [], pq = [{ node: startId, dist: 0 }]

    steps.push({ type: 'init', distances: { ...distances }, visited: new Set(visited), current: null, exploring: null, edge: null, message: `Starting from ${startId}. All distances = ∞ except ${startId} = 0` })

    while (pq.length > 0) {
        pq.sort((a, b) => a.dist - b.dist)
        const { node: current, dist: currDist } = pq.shift()
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

    steps.push({ type: 'complete', distances: { ...distances }, visited: new Set(visited), current: null, exploring: null, edge: null, message: 'All shortest paths found' })
    return { steps, distances, previous }
}

export default function DijkstraVisualizer() {
    const [graph] = useState(initialGraph)
    const [startNode, setStartNode] = useState('A')
    const [steps, setSteps] = useState([])
    const [currentStep, setCurrentStep] = useState(-1)
    const [running, setRunning] = useState(false)
    const [speed, setSpeed] = useState(SPEED_PRESETS.normal)
    const [isPaused, setIsPaused] = useState(false)
    const [finalDistances, setFinalDistances] = useState(null)
    const svgRef = useRef(null)

    const startAlgorithm = () => {
        const { steps: s, distances } = dijkstraWithSteps(graph.nodes, graph.edges, startNode)
        setSteps(s); setCurrentStep(0); setRunning(true); setIsPaused(false); setFinalDistances(distances)
    }

    const reset = () => { setSteps([]); setCurrentStep(-1); setRunning(false); setFinalDistances(null); setIsPaused(false) }
    const togglePause = () => setIsPaused(!isPaused)

    useEffect(() => {
        if (running && !isPaused && currentStep >= 0 && currentStep < steps.length - 1) {
            const timer = setTimeout(() => setCurrentStep(prev => prev + 1), speed)
            return () => clearTimeout(timer)
        } else if (currentStep >= steps.length - 1) { setRunning(false) }
    }, [running, currentStep, steps.length, speed, isPaused])

    const currentState = steps[currentStep] || { distances: {}, visited: new Set(), current: null, exploring: null, edge: null, message: '' }

    const getNodeColor = (nodeId) => {
        if (currentState.current === nodeId) return COLORS.accent
        if (currentState.exploring === nodeId) return COLORS.active
        if (currentState.visited?.has(nodeId)) return COLORS.sorted
        return COLORS.surface
    }

    const getEdgeColor = (edge) => {
        if (currentState.edge && ((currentState.edge.from === edge.from && currentState.edge.to === edge.to) || (currentState.edge.from === edge.to && currentState.edge.to === edge.from))) {
            return currentState.type === 'update' ? COLORS.sorted : COLORS.active
        }
        return COLORS.border
    }

    const getEdgeWidth = (edge) => {
        if (currentState.edge && ((currentState.edge.from === edge.from && currentState.edge.to === edge.to) || (currentState.edge.from === edge.to && currentState.edge.to === edge.from))) return 3
        return 1.5
    }

    const getNodePosition = (nodeId) => {
        const node = graph.nodes.find(n => n.id === nodeId)
        return node ? { x: node.x, y: node.y } : { x: 0, y: 0 }
    }

    const legendItems = [
        { color: COLORS.accent, label: 'Current' },
        { color: COLORS.active, label: 'Exploring' },
        { color: COLORS.sorted, label: 'Visited' },
        { color: COLORS.surface, label: 'Unvisited' }
    ]

    const isFinalStep = currentStep === steps.length - 1 && !running

    return (
        <PageContainer title="Dijkstra's Shortest Path">
            <ExplanationBox>
                <h3 style={{ marginBottom: 12, color: COLORS.fg }}>What is Dijkstra's Algorithm?</h3>
                <p>
                    Dijkstra's algorithm, conceived by computer scientist Edsger Dijkstra in 1956, is a
                    greedy algorithm that finds the <strong>shortest path</strong> from a single source node to all
                    other nodes in a weighted graph. It is one of the most important algorithms in computer
                    science and is widely used in networking, mapping, and routing applications.
                </p>
                <p style={{ marginTop: 8 }}>
                    The algorithm maintains a set of nodes whose shortest distance from the source is already
                    known. At each step, it selects the unvisited node with the smallest known distance,
                    marks it as visited, and updates the distances to all of its neighbors. This greedy
                    approach — always expanding the closest node — guarantees optimal results as long as all
                    edge weights are <strong>non-negative</strong>.
                </p>
                <h4 style={{ margin: '16px 0 8px' }}>How It Works</h4>
                <ol style={{ paddingLeft: 20, margin: 0 }}>
                    <li>Initialize the source node's distance to 0 and all other nodes to ∞ (infinity)</li>
                    <li>Add all nodes to a priority queue (min-heap) based on their current distance</li>
                    <li>Extract the node with the smallest distance from the priority queue</li>
                    <li>For each unvisited neighbor, calculate the tentative distance through the current node</li>
                    <li>If the new distance is shorter, update the neighbor's distance (this is called "relaxation")</li>
                    <li>Mark the current node as visited and repeat from step 3</li>
                    <li>Continue until all reachable nodes have been visited</li>
                </ol>
                <h4 style={{ margin: '16px 0 8px' }}>Key Characteristics</h4>
                <ul style={{ paddingLeft: 20, margin: 0 }}>
                    <li><strong>Greedy:</strong> Always selects the closest unvisited node — once a node is visited, its shortest distance is finalized</li>
                    <li><strong>Non-negative weights only:</strong> Negative edge weights can cause incorrect results — use Bellman-Ford instead</li>
                    <li><strong>Priority queue-based:</strong> Efficient implementations use a min-heap for O((V + E) log V) performance</li>
                    <li><strong>Single-source:</strong> Computes shortest paths from one source to all other nodes in the graph</li>
                </ul>
                <p style={{ marginTop: 12 }}><strong>Time Complexity:</strong> O((V + E) log V) with a binary heap priority queue</p>
                <p style={{ marginTop: 4 }}><strong>Space Complexity:</strong> O(V) for the distance array and priority queue</p>
                <p style={{ marginTop: 12, color: COLORS.fgMuted, fontSize: '0.9em' }}>
                    <strong>Real-world uses:</strong> Google Maps routing, network packet routing (OSPF protocol),
                    flight booking systems (cheapest route), robot path planning, and any scenario involving
                    weighted shortest paths. For graphs with negative edges, Bellman-Ford is used instead;
                    for all-pairs shortest paths, Floyd-Warshall is preferred.
                </p>
            </ExplanationBox>

            <CodeBlock code={dijkstraPythonCode} onCopy={() => { }} />

            <VisualizationContainer maxWidth={700}>
                <div style={{ marginBottom: 20 }}>
                    <label style={{ marginRight: 12, fontFamily: "'JetBrains Mono', monospace", fontWeight: 600, fontSize: '12px', textTransform: 'uppercase', letterSpacing: '0.05em', color: COLORS.fgMuted }}>Start Node</label>
                    <select value={startNode} onChange={(e) => { setStartNode(e.target.value); reset() }} disabled={running}
                        style={{ padding: '8px 16px', fontSize: 14, fontFamily: "'JetBrains Mono', monospace", fontWeight: 600, borderRadius: '0px', border: `1px solid ${COLORS.border}`, background: COLORS.surface }}>
                        {graph.nodes.map(n => <option key={n.id} value={n.id}>{n.id}</option>)}
                    </select>
                </div>

                <AnimatePresence mode="wait">
                    {currentStep >= 0 && currentState.message && (
                        <StatusMessage key={currentStep} message={currentState.message}
                            type={currentState.type === 'update' || currentState.type === 'complete' ? 'success' : 'info'} />
                    )}
                </AnimatePresence>

                <div style={{ background: COLORS.surface, border: `1px solid ${COLORS.border}`, borderRadius: '2px', padding: 20, marginTop: 20 }}>
                    <svg ref={svgRef} width="100%" height={280} viewBox="0 0 600 280" style={{ overflow: 'visible' }}>
                        {graph.edges.map((edge, i) => {
                            const from = getNodePosition(edge.from), to = getNodePosition(edge.to)
                            const midX = (from.x + to.x) / 2, midY = (from.y + to.y) / 2
                            return (
                                <g key={i}>
                                    <motion.line x1={from.x} y1={from.y} x2={to.x} y2={to.y} stroke={getEdgeColor(edge)} strokeWidth={getEdgeWidth(edge)} animate={{ stroke: getEdgeColor(edge), strokeWidth: getEdgeWidth(edge) }} transition={{ duration: 0.2 }} />
                                    <rect x={midX - 14} y={midY - 12} width={28} height={24} fill={COLORS.bg} stroke={COLORS.border} strokeWidth={1} />
                                    <text x={midX} y={midY + 5} textAnchor="middle" fontSize={13} fill={COLORS.fg} fontWeight="bold" fontFamily="'JetBrains Mono', monospace">{edge.weight}</text>
                                </g>
                            )
                        })}
                        {graph.nodes.map(node => (
                            <g key={node.id}>
                                <motion.circle cx={node.x} cy={node.y} r={30} fill={getNodeColor(node.id)} stroke={currentState.current === node.id ? COLORS.accent : COLORS.fg} strokeWidth={currentState.current === node.id ? 3 : 1.5} animate={{ fill: getNodeColor(node.id), scale: currentState.current === node.id ? 1.08 : 1 }} transition={SPRING.snappy} />
                                <text x={node.x} y={node.y - 4} textAnchor="middle" fontSize={16} fontWeight="bold" fontFamily="'JetBrains Mono', monospace" fill={currentState.visited?.has(node.id) || currentState.current === node.id ? '#fff' : COLORS.fg}>{node.id}</text>
                                <text x={node.x} y={node.y + 12} textAnchor="middle" fontSize={11} fontFamily="'JetBrains Mono', monospace" fill={currentState.visited?.has(node.id) ? 'rgba(255,255,255,0.85)' : COLORS.fgMuted} fontWeight="600">
                                    {currentState.distances[node.id] === Infinity ? '∞' : currentState.distances[node.id] ?? '-'}
                                </text>
                            </g>
                        ))}
                    </svg>
                </div>

                <Legend items={legendItems} />

                <ControlsRow>
                    <SpeedControl speed={speed} onSpeedChange={setSpeed} disabled={false} />
                    {running && <StepCounter current={currentStep + 1} total={steps.length} />}
                    <ControlButton onClick={startAlgorithm} disabled={running && !isPaused} variant="primary">{running ? 'Running…' : 'Start'}</ControlButton>
                    {running && <ControlButton onClick={togglePause} variant="success">{isPaused ? 'Resume' : 'Pause'}</ControlButton>}
                    <ControlButton onClick={reset} variant="danger">Reset</ControlButton>
                </ControlsRow>

                <AnimatePresence>
                    {isFinalStep && finalDistances && (
                        <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} style={{ marginTop: 24 }}>
                            <h3 style={{ marginBottom: 12, fontFamily: "'JetBrains Mono', monospace", fontSize: 14, textTransform: 'uppercase', letterSpacing: '0.05em', color: COLORS.fg }}>Shortest Distances from {startNode}</h3>
                            <div style={{ display: 'flex', justifyContent: 'center', gap: 8, flexWrap: 'wrap' }}>
                                {graph.nodes.map(node => (
                                    <motion.div key={node.id} initial={{ scale: 0 }} animate={{ scale: 1 }} transition={{ delay: graph.nodes.indexOf(node) * 0.08 }}
                                        style={{ padding: '10px 18px', background: COLORS.surface, border: `1px solid ${node.id === startNode ? COLORS.accent : COLORS.sorted}`, borderTop: `3px solid ${node.id === startNode ? COLORS.accent : COLORS.sorted}`, borderRadius: '0px', textAlign: 'center' }}>
                                        <div style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: 11, textTransform: 'uppercase', letterSpacing: '0.06em', color: COLORS.fgMuted }}>To {node.id}</div>
                                        <div style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: 22, fontWeight: 700, color: COLORS.fg }}>{finalDistances[node.id]}</div>
                                    </motion.div>
                                ))}
                            </div>
                        </motion.div>
                    )}
                </AnimatePresence>
            </VisualizationContainer>
        </PageContainer>
    )
}
