import React, { useState, useEffect, useRef } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { SPEED_PRESETS, COLORS, SPRING } from '../utils/animationConfig'
import {
    SpeedControl,
    StepCounter,
    StatusMessage,
    ControlButton,
    Legend,
    CodeBlock,
    PageContainer,
    ExplanationBox,
    VisualizationContainer,
    ControlsRow
} from '../components/ui/AnimationComponents'

const dijkstraPythonCode = `import heapq

def dijkstra(graph, start):
    distances = {node: float('inf') for node in graph}
    distances[start] = 0
    pq = [(0, start)]
    visited = set()
    
    while pq:
        curr_dist, curr = heapq.heappop(pq)
        if curr in visited:
            continue
        visited.add(curr)
        
        for neighbor, weight in graph[curr]:
            distance = curr_dist + weight
            if distance < distances[neighbor]:
                distances[neighbor] = distance
                heapq.heappush(pq, (distance, neighbor))
    
    return distances`

const initialGraph = {
    nodes: [
        { id: 'A', x: 80, y: 140 },
        { id: 'B', x: 220, y: 50 },
        { id: 'C', x: 220, y: 230 },
        { id: 'D', x: 380, y: 140 },
        { id: 'E', x: 520, y: 50 },
        { id: 'F', x: 520, y: 230 }
    ],
    edges: [
        { from: 'A', to: 'B', weight: 4 },
        { from: 'A', to: 'C', weight: 2 },
        { from: 'B', to: 'C', weight: 1 },
        { from: 'B', to: 'D', weight: 5 },
        { from: 'C', to: 'D', weight: 8 },
        { from: 'C', to: 'F', weight: 10 },
        { from: 'D', to: 'E', weight: 2 },
        { from: 'D', to: 'F', weight: 6 },
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

    const distances = {}
    const previous = {}
    const visited = new Set()

    nodeIds.forEach(id => {
        distances[id] = Infinity
        previous[id] = null
    })
    distances[startId] = 0

    const steps = []
    const pq = [{ node: startId, dist: 0 }]

    steps.push({
        type: 'init',
        distances: { ...distances },
        visited: new Set(visited),
        current: null,
        exploring: null,
        edge: null,
        message: `Starting from ${startId}. All distances set to ∞ except ${startId} = 0`
    })

    while (pq.length > 0) {
        pq.sort((a, b) => a.dist - b.dist)
        const { node: current, dist: currDist } = pq.shift()

        if (visited.has(current)) continue

        steps.push({
            type: 'visit',
            distances: { ...distances },
            visited: new Set(visited),
            current,
            exploring: null,
            edge: null,
            message: `Visiting ${current} (distance: ${currDist})`
        })

        visited.add(current)

        const neighbors = adj[current] || []
        for (const { node: neighbor, weight } of neighbors) {
            if (visited.has(neighbor)) continue

            const newDist = currDist + weight
            const improved = newDist < distances[neighbor]

            steps.push({
                type: 'explore',
                distances: { ...distances },
                visited: new Set(visited),
                current,
                exploring: neighbor,
                edge: { from: current, to: neighbor },
                message: `${current} → ${neighbor} (weight ${weight}): ${currDist} + ${weight} = ${newDist}${improved ? ' ✓ Better!' : ' ✗ No improvement'}`
            })

            if (improved) {
                distances[neighbor] = newDist
                previous[neighbor] = current
                pq.push({ node: neighbor, dist: newDist })

                steps.push({
                    type: 'update',
                    distances: { ...distances },
                    visited: new Set(visited),
                    current,
                    exploring: neighbor,
                    edge: { from: current, to: neighbor },
                    message: `Updated distance to ${neighbor}: ${newDist}`
                })
            }
        }
    }

    steps.push({
        type: 'complete',
        distances: { ...distances },
        visited: new Set(visited),
        current: null,
        exploring: null,
        edge: null,
        message: '🎉 All shortest paths found!'
    })

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
        const { steps: newSteps, distances } = dijkstraWithSteps(graph.nodes, graph.edges, startNode)
        setSteps(newSteps)
        setCurrentStep(0)
        setRunning(true)
        setIsPaused(false)
        setFinalDistances(distances)
    }

    const reset = () => {
        setSteps([])
        setCurrentStep(-1)
        setRunning(false)
        setFinalDistances(null)
        setIsPaused(false)
    }

    const togglePause = () => setIsPaused(!isPaused)

    useEffect(() => {
        if (running && !isPaused && currentStep >= 0 && currentStep < steps.length - 1) {
            const timer = setTimeout(() => setCurrentStep(prev => prev + 1), speed)
            return () => clearTimeout(timer)
        } else if (currentStep >= steps.length - 1) {
            setRunning(false)
        }
    }, [running, currentStep, steps.length, speed, isPaused])

    const currentState = steps[currentStep] || {
        distances: {},
        visited: new Set(),
        current: null,
        exploring: null,
        edge: null,
        message: ''
    }

    const getNodeColor = (nodeId) => {
        if (currentState.current === nodeId) return '#ef4444'
        if (currentState.exploring === nodeId) return '#f59e0b'
        if (currentState.visited?.has(nodeId)) return '#22c55e'
        return '#e2e8f0'
    }

    const getEdgeColor = (edge) => {
        if (currentState.edge &&
            ((currentState.edge.from === edge.from && currentState.edge.to === edge.to) ||
                (currentState.edge.from === edge.to && currentState.edge.to === edge.from))) {
            return currentState.type === 'update' ? '#22c55e' : '#f59e0b'
        }
        return '#94a3b8'
    }

    const getEdgeWidth = (edge) => {
        if (currentState.edge &&
            ((currentState.edge.from === edge.from && currentState.edge.to === edge.to) ||
                (currentState.edge.from === edge.to && currentState.edge.to === edge.from))) {
            return 4
        }
        return 2
    }

    const getNodePosition = (nodeId) => {
        const node = graph.nodes.find(n => n.id === nodeId)
        return node ? { x: node.x, y: node.y } : { x: 0, y: 0 }
    }

    const legendItems = [
        { color: '#ef4444', label: 'Current' },
        { color: '#f59e0b', label: 'Exploring' },
        { color: '#22c55e', label: 'Visited' },
        { color: '#e2e8f0', label: 'Unvisited' }
    ]

    const isFinalStep = currentStep === steps.length - 1 && !running

    return (
        <PageContainer title="🛤️ Dijkstra's Shortest Path">
            <ExplanationBox>
                <h3 style={{ marginBottom: 12, color: '#1e293b' }}>What is Dijkstra's Algorithm?</h3>
                <p>
                    Dijkstra's algorithm finds the <strong>shortest path</strong> from a source node to all other nodes
                    in a weighted graph with non-negative edge weights.
                </p>
                <h4 style={{ margin: '16px 0 8px', color: '#475569' }}>How It Works</h4>
                <ol style={{ paddingLeft: 20, margin: 0 }}>
                    <li>Initialize: source = 0, all others = ∞</li>
                    <li>Visit node with smallest known distance</li>
                    <li>Update distances to unvisited neighbors</li>
                    <li>Mark current node as visited</li>
                    <li>Repeat until all nodes visited</li>
                </ol>
                <p style={{ marginTop: 12 }}>
                    <strong>Time Complexity:</strong> O((V + E) log V) with priority queue
                </p>
            </ExplanationBox>

            <CodeBlock code={dijkstraPythonCode} onCopy={() => { }} />

            <VisualizationContainer maxWidth={700}>
                {/* Start Node Selector */}
                <div style={{ marginBottom: 20 }}>
                    <label style={{ marginRight: 12, fontWeight: 600, color: '#475569' }}>Start Node:</label>
                    <select
                        value={startNode}
                        onChange={(e) => { setStartNode(e.target.value); reset() }}
                        disabled={running}
                        style={{
                            padding: '8px 16px',
                            fontSize: 16,
                            borderRadius: 8,
                            border: '2px solid #e2e8f0',
                            fontWeight: 600
                        }}
                    >
                        {graph.nodes.map(n => (
                            <option key={n.id} value={n.id}>{n.id}</option>
                        ))}
                    </select>
                </div>

                {/* Status Message */}
                <AnimatePresence mode="wait">
                    {currentStep >= 0 && currentState.message && (
                        <StatusMessage
                            key={currentStep}
                            message={currentState.message}
                            type={currentState.type === 'update' ? 'success' : currentState.type === 'complete' ? 'success' : 'info'}
                        />
                    )}
                </AnimatePresence>

                {/* Graph Visualization */}
                <div style={{
                    background: 'linear-gradient(135deg, #f8fafc 0%, #f1f5f9 100%)',
                    borderRadius: 16,
                    padding: 20,
                    marginTop: 20
                }}>
                    <svg ref={svgRef} width="100%" height={280} viewBox="0 0 600 280" style={{ overflow: 'visible' }}>
                        {/* Edges */}
                        {graph.edges.map((edge, i) => {
                            const from = getNodePosition(edge.from)
                            const to = getNodePosition(edge.to)
                            const midX = (from.x + to.x) / 2
                            const midY = (from.y + to.y) / 2

                            return (
                                <g key={i}>
                                    <motion.line
                                        x1={from.x}
                                        y1={from.y}
                                        x2={to.x}
                                        y2={to.y}
                                        stroke={getEdgeColor(edge)}
                                        strokeWidth={getEdgeWidth(edge)}
                                        animate={{
                                            stroke: getEdgeColor(edge),
                                            strokeWidth: getEdgeWidth(edge)
                                        }}
                                        transition={{ duration: 0.3 }}
                                    />
                                    <rect
                                        x={midX - 14}
                                        y={midY - 12}
                                        width={28}
                                        height={24}
                                        fill="white"
                                        rx={6}
                                        style={{ filter: 'drop-shadow(0 2px 4px rgba(0,0,0,0.1))' }}
                                    />
                                    <text
                                        x={midX}
                                        y={midY + 5}
                                        textAnchor="middle"
                                        fontSize={14}
                                        fill="#475569"
                                        fontWeight="bold"
                                    >
                                        {edge.weight}
                                    </text>
                                </g>
                            )
                        })}

                        {/* Nodes */}
                        {graph.nodes.map(node => (
                            <g key={node.id}>
                                <motion.circle
                                    cx={node.x}
                                    cy={node.y}
                                    r={32}
                                    fill={getNodeColor(node.id)}
                                    stroke={currentState.current === node.id ? '#dc2626' : '#475569'}
                                    strokeWidth={currentState.current === node.id ? 4 : 2}
                                    animate={{
                                        fill: getNodeColor(node.id),
                                        scale: currentState.current === node.id ? 1.1 : 1
                                    }}
                                    transition={SPRING.bouncy}
                                    style={{ filter: currentState.current === node.id ? 'drop-shadow(0 4px 8px rgba(239, 68, 68, 0.4))' : 'drop-shadow(0 2px 4px rgba(0,0,0,0.1))' }}
                                />
                                <text
                                    x={node.x}
                                    y={node.y - 5}
                                    textAnchor="middle"
                                    fontSize={18}
                                    fontWeight="bold"
                                    fill={currentState.visited?.has(node.id) ? 'white' : '#1e293b'}
                                >
                                    {node.id}
                                </text>
                                <text
                                    x={node.x}
                                    y={node.y + 12}
                                    textAnchor="middle"
                                    fontSize={12}
                                    fill={currentState.visited?.has(node.id) ? 'rgba(255,255,255,0.9)' : '#64748b'}
                                    fontWeight="600"
                                >
                                    {currentState.distances[node.id] === Infinity
                                        ? '∞'
                                        : currentState.distances[node.id] ?? '-'}
                                </text>
                            </g>
                        ))}
                    </svg>
                </div>

                <Legend items={legendItems} />

                {/* Controls */}
                <ControlsRow>
                    <SpeedControl speed={speed} onSpeedChange={setSpeed} disabled={false} />

                    {running && (
                        <StepCounter current={currentStep + 1} total={steps.length} />
                    )}

                    <ControlButton
                        onClick={startAlgorithm}
                        disabled={running && !isPaused}
                        variant="primary"
                    >
                        {running ? '🛤️ Running...' : '▶️ Start'}
                    </ControlButton>

                    {running && (
                        <ControlButton onClick={togglePause} variant="success">
                            {isPaused ? '▶️ Resume' : '⏸️ Pause'}
                        </ControlButton>
                    )}

                    <ControlButton onClick={reset} variant="danger">
                        🔄 Reset
                    </ControlButton>
                </ControlsRow>

                {/* Final Results Table */}
                <AnimatePresence>
                    {isFinalStep && finalDistances && (
                        <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            style={{ marginTop: 24 }}
                        >
                            <h3 style={{ marginBottom: 16, color: '#1e293b' }}>
                                🎉 Shortest Distances from {startNode}
                            </h3>
                            <div style={{
                                display: 'flex',
                                justifyContent: 'center',
                                gap: 12,
                                flexWrap: 'wrap'
                            }}>
                                {graph.nodes.map(node => (
                                    <motion.div
                                        key={node.id}
                                        initial={{ scale: 0 }}
                                        animate={{ scale: 1 }}
                                        transition={{ delay: graph.nodes.indexOf(node) * 0.1 }}
                                        style={{
                                            padding: '12px 20px',
                                            background: node.id === startNode
                                                ? 'linear-gradient(135deg, #8b5cf6 0%, #6d28d9 100%)'
                                                : 'linear-gradient(135deg, #22c55e 0%, #16a34a 100%)',
                                            borderRadius: 12,
                                            color: 'white',
                                            textAlign: 'center',
                                            boxShadow: '0 4px 12px rgba(0,0,0,0.15)'
                                        }}
                                    >
                                        <div style={{ fontSize: 14, opacity: 0.9 }}>To {node.id}</div>
                                        <div style={{ fontSize: 24, fontWeight: 700 }}>
                                            {finalDistances[node.id]}
                                        </div>
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
