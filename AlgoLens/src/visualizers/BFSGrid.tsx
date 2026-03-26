import { useState, useEffect, useCallback } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { SPEED_PRESETS, EASE_OUT, type SpeedKey } from '../utils/animationConfig'
import {
    SpeedControl, StepCounter, StatusMessage, ControlButton, Legend,
    CodeBlock, PageContainer, ExplanationBox, VisualizationContainer, ControlsRow,
    SplitLayout, SplitLeft, SplitRight
} from '../components/ui/shared'
import { BFS_CODE } from '../data/algorithmCodes'
import { bfsWithSteps, type BFSStep } from '../algorithms/bfsGrid'



const ROWS = 15
const COLS = 15
const START = [0, 0]
const END = [ROWS - 1, COLS - 1]

const key = (r: number, c: number) => `${r}-${c}`

export default function BFSGridVisualizer() {
    const [walls, setWalls] = useState<number[][]>([])
    const [steps, setSteps] = useState<BFSStep[]>([])
    const [currentStep, setCurrentStep] = useState(-1)
    const [running, setRunning] = useState(false)
    const [speed, setSpeed] = useState<SpeedKey>('2x')
    const [isPaused, setIsPaused] = useState(false)
    const [isDrawing, setIsDrawing] = useState(false)

    const toggleWall = useCallback((r: number, c: number) => {
        if (running) return
        if ((r === START[0] && c === START[1]) || (r === END[0] && c === END[1])) return
        setWalls(prev => {
            const k = key(r, c)
            const exists = prev.some(([wr, wc]) => key(wr, wc) === k)
            return exists ? prev.filter(([wr, wc]) => key(wr, wc) !== k) : [...prev, [r, c]]
        })
    }, [running])

    const startBFS = () => {
        const s = bfsWithSteps(walls, START, END, ROWS, COLS)
        setSteps(s)
        setCurrentStep(0)
        setRunning(true)
        setIsPaused(false)
    }

    const reset = () => {
        setSteps([])
        setCurrentStep(-1)
        setRunning(false)
        setIsPaused(false)
    }

    const clearAll = () => {
        reset()
        setWalls([])
    }

    const generateMaze = () => {
        reset()
        const newWalls: number[][] = []
        for (let r = 0; r < ROWS; r++) {
            for (let c = 0; c < COLS; c++) {
                if ((r === START[0] && c === START[1]) || (r === END[0] && c === END[1])) continue
                if (Math.random() < 0.3) newWalls.push([r, c])
            }
        }
        setWalls(newWalls)
    }

    const togglePause = () => setIsPaused(!isPaused)

    useEffect(() => {
        if (running && !isPaused && currentStep >= 0 && currentStep < steps.length - 1) {
            const t = setTimeout(() => setCurrentStep(cs => cs + 1), SPEED_PRESETS[speed])
            return () => clearTimeout(t)
        } else if (running && currentStep >= steps.length - 1) {
            setRunning(false)
        }
    }, [running, currentStep, steps, speed, isPaused])

    const step = steps[currentStep] || {
        frontier: [], visited: new Set(), current: null, phase: 'idle', message: ''
    }

    const wallSet = new Set(walls.map(([r, c]) => key(r, c)))

    const getCellState = (r: number, c: number) => {
        const k = key(r, c)
        if (r === START[0] && c === START[1]) return 'start'
        if (r === END[0] && c === END[1]) return 'end'
        if (wallSet.has(k)) return 'wall'
        if (step.path && step.path.some(([pr, pc]) => pr === r && pc === c)) return 'path'
        if (step.current && step.current[0] === r && step.current[1] === c) return 'current'
        if (step.frontier && step.frontier.some(([fr, fc]) => fr === r && fc === c)) return 'frontier'
        if (step.visited?.has(k)) return 'visited'
        return 'empty'
    }

    const cellColors = {
        empty: 'var(--surface)',
        wall: 'var(--fg)',
        start: 'var(--accent)',
        end: 'var(--color-sorted)',
        current: 'var(--color-active)',
        frontier: 'var(--color-comparing)',
        visited: '#bfdbfe',
        path: 'var(--color-active)'
    }

    const legendItems = [
        { color: 'var(--accent)', label: 'Start' },
        { color: 'var(--color-sorted)', label: 'End' },
        { color: 'var(--fg)', label: 'Wall' },
        { color: 'var(--color-comparing)', label: 'Frontier' },
        { color: '#bfdbfe', label: 'Visited' },
        { color: 'var(--color-active)', label: 'Path' }
    ]

    const isFinalStep = steps.length > 0 && currentStep === steps.length - 1 && !running

    return (
        <PageContainer title="BFS Grid Search">
            <SplitLayout>
                <SplitLeft>
                    <ExplanationBox>
                        <h3 className="font-mono text-base font-bold text-[var(--fg)] mb-3">What is Breadth-First Search?</h3>
                        <p>
                            Breadth-First Search (BFS) is a fundamental graph traversal algorithm that explores
                            nodes level by level, visiting <strong>all neighbors</strong> at the current depth before
                            moving to nodes at the next depth level. It uses a <strong>queue (FIFO)</strong> data
                            structure to track which node to visit next.
                        </p>
                        <p className="mt-2 text-sm text-[var(--fg-muted)] leading-relaxed">
                            On an unweighted grid or graph, BFS guarantees finding the <strong>shortest path</strong> between
                            two points because it explores all paths of length k before any path of length k+1. This
                            property makes it invaluable for pathfinding problems, network broadcasting, and level-order
                            traversals of trees.
                        </p>
                        <h4 className="font-mono text-sm font-bold text-[var(--fg)] mt-4 mb-2">How It Works</h4>
                        <ol className="pl-5 text-sm text-[var(--fg-muted)] leading-relaxed space-y-1">
                            <li>Start from the source node, mark it as visited, and add it to a queue</li>
                            <li>Dequeue the front node from the queue</li>
                            <li>Explore all unvisited neighbors of the dequeued node</li>
                            <li>Mark each neighbor as visited and add it to the back of the queue (FIFO order)</li>
                            <li>Repeat steps 2–4 until the target is found or the queue is empty</li>
                            <li>If the target is found, reconstruct the path by tracing parent pointers back to the source</li>
                        </ol>
                        <h4 className="font-mono text-sm font-bold text-[var(--fg)] mt-4 mb-2">BFS vs DFS</h4>
                        <ul className="pl-5 text-sm text-[var(--fg-muted)] leading-relaxed space-y-1">
                            <li><strong>BFS</strong> uses a queue, explores level by level, and finds shortest paths in unweighted graphs</li>
                            <li><strong>DFS</strong> uses a stack (or recursion), explores as deep as possible first, and uses less memory on wide graphs</li>
                            <li>For shortest path on unweighted graphs, <strong>BFS is always preferred</strong></li>
                        </ul>
                        <h4 className="font-mono text-sm font-bold text-[var(--fg)] mt-4 mb-2">Key Characteristics</h4>
                        <ul className="pl-5 text-sm text-[var(--fg-muted)] leading-relaxed space-y-1">
                            <li><strong>Complete:</strong> Will always find a solution if one exists (given finite graph)</li>
                            <li><strong>Optimal:</strong> Guarantees shortest path on unweighted graphs</li>
                            <li><strong>Memory-intensive:</strong> Stores all nodes at the current frontier in memory</li>
                            <li><strong>Works on:</strong> Both directed and undirected graphs, trees, grids</li>
                        </ul>
                        <p className="mt-3 text-sm text-[var(--fg-muted)] leading-relaxed">
                            <strong>Time Complexity:</strong> O(V + E) where V = vertices (cells) and E = edges (connections)
                        </p>
                        <p className="mt-1 text-sm text-[var(--fg-muted)] leading-relaxed">
                            <strong>Space Complexity:</strong> O(V) — the queue and visited set can hold up to all vertices
                        </p>
                        <p className="mt-3 text-xs text-[var(--fg-muted)] leading-relaxed">
                            <strong>Real-world uses:</strong> GPS navigation (shortest route), social network friend suggestions
                            (people within k connections), web crawlers, network broadcasting, and puzzle solving (like
                            finding the fewest moves in a maze).
                        </p>
                    </ExplanationBox>

                    <CodeBlock codes={BFS_CODE} />
                </SplitLeft>
                <SplitRight>
                    <VisualizationContainer>
                        {/* Instructions */}
                        {!running && currentStep < 0 && (
                            <div style={{
                                marginBottom: 16,
                                padding: '8px 14px',
                                background: 'var(--surface)',
                                border: `1px solid ${'var(--border)'}`,
                                borderLeft: `3px solid ${'var(--color-comparing)'}`,
                                borderRadius: '0px',
                                fontSize: '12px',
                                color: 'var(--fg-muted)'
                            }}>
                                Click cells to toggle walls, or use "Random Maze" to generate obstacles
                            </div>
                        )}

                        {/* Status Message */}
                        <AnimatePresence mode="wait">
                            {currentStep >= 0 && step.message && (
                                <StatusMessage
                                    key={currentStep}
                                    message={step.message}
                                    type={step.phase === 'found' ? 'success' : step.phase === 'no-path' ? 'error' : 'info'}
                                />
                            )}
                        </AnimatePresence>

                        {/* Grid */}
                        <div
                            style={{
                                display: 'grid',
                                gridTemplateColumns: `repeat(${COLS}, 1fr)`,
                                gap: 1,
                                background: 'var(--border)',
                                border: `1px solid ${'var(--border)'}`,
                                maxWidth: 500,
                                margin: '16px auto',
                                userSelect: 'none'
                            }}
                            onMouseDown={() => setIsDrawing(true)}
                            onMouseUp={() => setIsDrawing(false)}
                            onMouseLeave={() => setIsDrawing(false)}
                        >
                            {Array.from({ length: ROWS }, (_, r) =>
                                Array.from({ length: COLS }, (_, c) => {
                                    const state = getCellState(r, c)
                                    const bg = cellColors[state]

                                    return (
                                        <motion.div
                                            key={key(r, c)}
                                            onClick={() => toggleWall(r, c)}
                                            onMouseEnter={() => {
                                                if (isDrawing && !running) toggleWall(r, c)
                                            }}
                                            animate={{
                                                backgroundColor: bg,
                                                scale: state === 'current' ? 1.15 : state === 'path' ? 1.08 : 1
                                            }}
                                            transition={{ type: 'spring', stiffness: 500, damping: 30 }}
                                            style={{
                                                aspectRatio: '1',
                                                display: 'flex',
                                                alignItems: 'center',
                                                justifyContent: 'center',
                                                cursor: running ? 'default' : 'pointer',
                                                fontSize: 9,
                                                fontWeight: 700,
                                                color: (state === 'wall' || state === 'start' || state === 'end' || state === 'current' || state === 'path')
                                                    ? '#fff' : 'transparent'
                                            }}
                                        >
                                            {state === 'start' && 'S'}
                                            {state === 'end' && 'E'}
                                        </motion.div>
                                    )
                                })
                            )}
                        </div>

                        <Legend items={legendItems} />

                        {/* Controls */}
                        <ControlsRow>
                            <SpeedControl speed={speed} onSpeedChange={setSpeed} disabled={false} />

                            {running && <StepCounter current={currentStep + 1} total={steps.length} />}

                            <ControlButton onClick={startBFS} disabled={running && !isPaused} variant="primary">
                                {running ? 'Searching…' : 'Start BFS'}
                            </ControlButton>

                            {running && (
                                <ControlButton onClick={togglePause} variant="success">
                                    {isPaused ? 'Resume' : 'Pause'}
                                </ControlButton>
                            )}

                            <ControlButton onClick={generateMaze} disabled={running} variant="danger">
                                Random Maze
                            </ControlButton>

                            <ControlButton onClick={clearAll} variant="danger">
                                Clear All
                            </ControlButton>

                            {currentStep >= 0 && (
                                <ControlButton onClick={reset} variant="danger">
                                    Reset
                                </ControlButton>
                            )}
                        </ControlsRow>

                        {/* Final Result */}
                        <AnimatePresence>
                            {isFinalStep && (
                                <motion.div
                                    initial={{ opacity: 0, y: 8 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    exit={{ opacity: 0 }}
                                    transition={{ duration: 0.2, ease: [0.16, 1, 0.3, 1] }}
                                    style={{
                                        marginTop: 24,
                                        padding: '12px 20px',
                                        background: 'var(--surface)',
                                        border: `1px solid ${step.phase === 'found' ? 'var(--color-sorted)' : 'var(--accent)'}`,
                                        borderLeft: `3px solid ${step.phase === 'found' ? 'var(--color-sorted)' : 'var(--accent)'}`,
                                        borderRadius: '0px',
                                        fontWeight: 600,
                                        fontSize: 15,
                                        color: 'var(--fg)',
                                        display: 'inline-block'
                                    }}
                                >
                                    {step.phase === 'found'
                                        ? `✓ Shortest path: ${step.path?.length ?? 0} steps — ${step.visited.size} cells explored`
                                        : '✗ No path exists between start and end'}
                                </motion.div>
                            )}
                        </AnimatePresence>
                    </VisualizationContainer>
                </SplitRight>
            </SplitLayout>
        </PageContainer>
    )
}
