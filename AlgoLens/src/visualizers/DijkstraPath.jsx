import React, { useState, useEffect, useRef } from 'react'
import { motion } from 'framer-motion'

const dijkstraPythonCode = `
import heapq

def dijkstra(graph, start):
    """
    Find shortest paths from start to all vertices.
    graph: dict of {node: [(neighbor, weight), ...]}
    Returns: dict of {node: shortest_distance}
    """
    distances = {node: float('inf') for node in graph}
    distances[start] = 0
    pq = [(0, start)]  # (distance, node)
    visited = set()
    
    while pq:
        curr_dist, curr_node = heapq.heappop(pq)
        
        if curr_node in visited:
            continue
        visited.add(curr_node)
        
        for neighbor, weight in graph[curr_node]:
            distance = curr_dist + weight
            if distance < distances[neighbor]:
                distances[neighbor] = distance
                heapq.heappush(pq, (distance, neighbor))
    
    return distances
`

// Initial graph structure with nodes and edges
const initialGraph = {
    nodes: [
        { id: 'A', x: 100, y: 150 },
        { id: 'B', x: 250, y: 50 },
        { id: 'C', x: 250, y: 250 },
        { id: 'D', x: 400, y: 150 },
        { id: 'E', x: 550, y: 50 },
        { id: 'F', x: 550, y: 250 }
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

// Build adjacency list from edges
function buildAdjacencyList(edges) {
    const adj = {}
    edges.forEach(({ from, to, weight }) => {
        if (!adj[from]) adj[from] = []
        if (!adj[to]) adj[to] = []
        adj[from].push({ node: to, weight })
        adj[to].push({ node: from, weight }) // Undirected graph
    })
    return adj
}

// Dijkstra algorithm that returns steps for visualization
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

    // Initial step
    steps.push({
        type: 'init',
        distances: { ...distances },
        visited: new Set(visited),
        current: null,
        processing: null,
        message: `Initialized. Start node: ${startId} with distance 0. All others: ∞`
    })

    while (pq.length > 0) {
        // Sort to get min distance node (simple priority queue)
        pq.sort((a, b) => a.dist - b.dist)
        const { node: current, dist: currDist } = pq.shift()

        if (visited.has(current)) continue

        steps.push({
            type: 'visit',
            distances: { ...distances },
            visited: new Set(visited),
            current,
            processing: null,
            message: `Visiting node ${current} with distance ${currDist}`
        })

        visited.add(current)

        // Process neighbors
        const neighbors = adj[current] || []
        for (const { node: neighbor, weight } of neighbors) {
            if (visited.has(neighbor)) continue

            const newDist = currDist + weight

            steps.push({
                type: 'explore',
                distances: { ...distances },
                visited: new Set(visited),
                current,
                processing: neighbor,
                edge: { from: current, to: neighbor },
                message: `Exploring edge ${current} → ${neighbor} (weight: ${weight}). Current distance to ${neighbor}: ${distances[neighbor] === Infinity ? '∞' : distances[neighbor]}, New potential: ${newDist}`
            })

            if (newDist < distances[neighbor]) {
                distances[neighbor] = newDist
                previous[neighbor] = current
                pq.push({ node: neighbor, dist: newDist })

                steps.push({
                    type: 'update',
                    distances: { ...distances },
                    visited: new Set(visited),
                    current,
                    processing: neighbor,
                    edge: { from: current, to: neighbor },
                    message: `Updated distance to ${neighbor}: ${newDist} (via ${current})`
                })
            }
        }
    }

    steps.push({
        type: 'complete',
        distances: { ...distances },
        visited: new Set(visited),
        current: null,
        processing: null,
        message: 'Algorithm complete! All shortest paths found.'
    })

    return { steps, distances, previous }
}

export default function DijkstraVisualizer() {
    const [graph] = useState(initialGraph)
    const [startNode, setStartNode] = useState('A')
    const [steps, setSteps] = useState([])
    const [currentStep, setCurrentStep] = useState(-1)
    const [running, setRunning] = useState(false)
    const [speed, setSpeed] = useState(1000)
    const [finalDistances, setFinalDistances] = useState(null)

    const svgRef = useRef(null)

    const startAlgorithm = () => {
        const { steps: newSteps, distances } = dijkstraWithSteps(graph.nodes, graph.edges, startNode)
        setSteps(newSteps)
        setCurrentStep(0)
        setRunning(true)
        setFinalDistances(distances)
    }

    const resetVisualization = () => {
        setSteps([])
        setCurrentStep(-1)
        setRunning(false)
        setFinalDistances(null)
    }

    useEffect(() => {
        if (running && currentStep >= 0 && currentStep < steps.length - 1) {
            const timer = setTimeout(() => {
                setCurrentStep(prev => prev + 1)
            }, speed)
            return () => clearTimeout(timer)
        } else if (currentStep >= steps.length - 1) {
            setRunning(false)
        }
    }, [running, currentStep, steps.length, speed])

    const copyToClipboard = () => {
        navigator.clipboard.writeText(dijkstraPythonCode)
        alert('Python code copied!')
    }

    const currentState = steps[currentStep] || {
        distances: {},
        visited: new Set(),
        current: null,
        processing: null,
        edge: null
    }

    // Get node color based on state
    const getNodeColor = (nodeId) => {
        if (currentState.current === nodeId) return '#ff6b6b' // Current node being processed
        if (currentState.processing === nodeId) return '#feca57' // Neighbor being explored
        if (currentState.visited?.has(nodeId)) return '#48dbfb' // Already visited
        return '#dfe6e9' // Unvisited
    }

    // Get edge color based on state
    const getEdgeColor = (edge) => {
        if (currentState.edge &&
            ((currentState.edge.from === edge.from && currentState.edge.to === edge.to) ||
                (currentState.edge.from === edge.to && currentState.edge.to === edge.from))) {
            return '#ff6b6b'
        }
        return '#b2bec3'
    }

    // Get edge stroke width
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

    const explanation = (
        <div style={{
            maxWidth: 800,
            margin: '20px auto',
            textAlign: 'left',
            color: '#333',
            fontSize: 16,
            lineHeight: 1.6
        }}>
            <h3 style={{ marginBottom: 8 }}>What is Dijkstra's Algorithm?</h3>
            <p>
                Dijkstra's algorithm finds the <strong>shortest path</strong> from a source node to all other nodes
                in a weighted graph with <strong>non-negative edge weights</strong>. It's widely used in
                GPS navigation, network routing, and many other applications.
            </p>
            <h4 style={{ margin: '16px 0 8px' }}>How It Works</h4>
            <ol style={{ paddingLeft: 20 }}>
                <li>Initialize distances: source = 0, all others = ∞</li>
                <li>Use a priority queue to always process the node with smallest known distance</li>
                <li>For each neighbor, calculate potential new distance through current node</li>
                <li>If new distance is shorter, update it and add to queue</li>
                <li>Mark current node as visited (won't revisit)</li>
                <li>Repeat until all nodes are visited</li>
            </ol>
            <h4 style={{ margin: '16px 0 8px' }}>Time Complexity</h4>
            <p>
                <strong>O((V + E) log V)</strong> with a binary heap, where V is number of vertices and E is number of edges.
            </p>
            <h4 style={{ margin: '16px 0 8px' }}>Legend</h4>
            <div style={{ display: 'flex', gap: 20, flexWrap: 'wrap' }}>
                <span><span style={{ display: 'inline-block', width: 16, height: 16, background: '#dfe6e9', borderRadius: '50%', marginRight: 6 }}></span>Unvisited</span>
                <span><span style={{ display: 'inline-block', width: 16, height: 16, background: '#ff6b6b', borderRadius: '50%', marginRight: 6 }}></span>Current</span>
                <span><span style={{ display: 'inline-block', width: 16, height: 16, background: '#feca57', borderRadius: '50%', marginRight: 6 }}></span>Exploring</span>
                <span><span style={{ display: 'inline-block', width: 16, height: 16, background: '#48dbfb', borderRadius: '50%', marginRight: 6 }}></span>Visited</span>
            </div>
        </div>
    )

    return (
        <div style={{ textAlign: 'center', padding: 20 }}>
            <h2>Dijkstra's Shortest Path Visualizer</h2>
            {explanation}

            {/* Python Code Block */}
            <div style={{
                background: '#2d3436',
                padding: 15,
                borderRadius: 8,
                fontFamily: 'monospace',
                textAlign: 'left',
                maxWidth: 800,
                margin: '0 auto',
                color: '#dfe6e9'
            }}>
                <pre style={{ margin: 0, overflowX: 'auto' }}>{dijkstraPythonCode}</pre>
                <button
                    onClick={copyToClipboard}
                    style={{
                        marginTop: 10,
                        padding: '8px 12px',
                        background: '#00b894',
                        color: 'white',
                        border: 'none',
                        borderRadius: 4,
                        cursor: 'pointer'
                    }}
                >Copy Code</button>
            </div>

            {/* Controls */}
            <div style={{ marginTop: 20, display: 'flex', justifyContent: 'center', gap: 15, flexWrap: 'wrap', alignItems: 'center' }}>
                <div>
                    <label style={{ marginRight: 8 }}>Start Node:</label>
                    <select
                        value={startNode}
                        onChange={(e) => { setStartNode(e.target.value); resetVisualization() }}
                        style={{ padding: '6px 12px', fontSize: 16, borderRadius: 4 }}
                    >
                        {graph.nodes.map(n => (
                            <option key={n.id} value={n.id}>{n.id}</option>
                        ))}
                    </select>
                </div>

                <div>
                    <label style={{ marginRight: 8 }}>Speed:</label>
                    <select
                        value={speed}
                        onChange={(e) => setSpeed(Number(e.target.value))}
                        style={{ padding: '6px 12px', fontSize: 16, borderRadius: 4 }}
                    >
                        <option value={2000}>Slow</option>
                        <option value={1000}>Normal</option>
                        <option value={500}>Fast</option>
                    </select>
                </div>

                <button
                    onClick={startAlgorithm}
                    disabled={running}
                    style={{
                        padding: '10px 20px',
                        background: running ? '#b2bec3' : '#00b894',
                        color: 'white',
                        border: 'none',
                        borderRadius: 4,
                        cursor: running ? 'not-allowed' : 'pointer',
                        fontSize: 16
                    }}
                >
                    {running ? 'Running...' : 'Start Algorithm'}
                </button>

                <button
                    onClick={resetVisualization}
                    style={{
                        padding: '10px 20px',
                        background: '#e17055',
                        color: 'white',
                        border: 'none',
                        borderRadius: 4,
                        cursor: 'pointer',
                        fontSize: 16
                    }}
                >
                    Reset
                </button>
            </div>

            {/* Status Message */}
            {currentStep >= 0 && steps[currentStep] && (
                <motion.div
                    key={currentStep}
                    initial={{ opacity: 0, y: -10 }}
                    animate={{ opacity: 1, y: 0 }}
                    style={{
                        marginTop: 20,
                        padding: '12px 20px',
                        background: '#74b9ff',
                        borderRadius: 8,
                        maxWidth: 800,
                        margin: '20px auto',
                        color: '#2d3436',
                        fontWeight: 500
                    }}
                >
                    Step {currentStep + 1}/{steps.length}: {steps[currentStep].message}
                </motion.div>
            )}

            {/* Graph Visualization */}
            <div style={{
                marginTop: 20,
                display: 'flex',
                justifyContent: 'center',
                background: '#f8f9fa',
                borderRadius: 12,
                padding: 20,
                maxWidth: 700,
                margin: '20px auto'
            }}>
                <svg ref={svgRef} width={650} height={300} style={{ overflow: 'visible' }}>
                    {/* Draw edges first */}
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
                                    initial={false}
                                    animate={{
                                        stroke: getEdgeColor(edge),
                                        strokeWidth: getEdgeWidth(edge)
                                    }}
                                    transition={{ duration: 0.3 }}
                                />
                                {/* Edge weight label */}
                                <rect
                                    x={midX - 12}
                                    y={midY - 10}
                                    width={24}
                                    height={20}
                                    fill="white"
                                    rx={4}
                                />
                                <text
                                    x={midX}
                                    y={midY + 5}
                                    textAnchor="middle"
                                    fontSize={14}
                                    fill="#636e72"
                                    fontWeight="bold"
                                >
                                    {edge.weight}
                                </text>
                            </g>
                        )
                    })}

                    {/* Draw nodes */}
                    {graph.nodes.map(node => (
                        <g key={node.id}>
                            <motion.circle
                                cx={node.x}
                                cy={node.y}
                                r={28}
                                fill={getNodeColor(node.id)}
                                stroke="#2d3436"
                                strokeWidth={2}
                                initial={false}
                                animate={{
                                    fill: getNodeColor(node.id),
                                    scale: currentState.current === node.id ? 1.1 : 1
                                }}
                                transition={{ duration: 0.3 }}
                            />
                            <text
                                x={node.x}
                                y={node.y - 5}
                                textAnchor="middle"
                                fontSize={18}
                                fontWeight="bold"
                                fill="#2d3436"
                            >
                                {node.id}
                            </text>
                            {/* Distance label */}
                            <text
                                x={node.x}
                                y={node.y + 12}
                                textAnchor="middle"
                                fontSize={12}
                                fill="#636e72"
                            >
                                {currentState.distances[node.id] === Infinity
                                    ? '∞'
                                    : currentState.distances[node.id] ?? '-'}
                            </text>
                        </g>
                    ))}
                </svg>
            </div>

            {/* Final Results Table */}
            {finalDistances && currentStep >= steps.length - 1 && (
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    style={{
                        marginTop: 30,
                        maxWidth: 600,
                        margin: '30px auto'
                    }}
                >
                    <h3>🎉 Shortest Distances from Node {startNode}</h3>
                    <table style={{
                        width: '100%',
                        borderCollapse: 'collapse',
                        marginTop: 15,
                        background: 'white',
                        borderRadius: 8,
                        overflow: 'hidden',
                        boxShadow: '0 2px 10px rgba(0,0,0,0.1)'
                    }}>
                        <thead>
                            <tr style={{ background: '#00b894', color: 'white' }}>
                                <th style={{ padding: 12 }}>Node</th>
                                <th style={{ padding: 12 }}>Shortest Distance</th>
                            </tr>
                        </thead>
                        <tbody>
                            {graph.nodes.map(node => (
                                <tr key={node.id} style={{ borderBottom: '1px solid #eee' }}>
                                    <td style={{ padding: 12, fontWeight: 'bold' }}>{node.id}</td>
                                    <td style={{ padding: 12 }}>
                                        {finalDistances[node.id] === Infinity ? '∞ (unreachable)' : finalDistances[node.id]}
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </motion.div>
            )}
        </div>
    )
}
