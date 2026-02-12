import React, { useState, useEffect, useCallback } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { SPEED_PRESETS, COLORS, SPRING } from '../utils/animationConfig'
import {
    SpeedControl, StepCounter, StatusMessage, ControlButton, Legend,
    CodeBlock, PageContainer, ExplanationBox, VisualizationContainer, ControlsRow
} from '../components/ui/AnimationComponents'

const bfsPythonCode = `from collections import deque

def bfs(grid, start, end):
    rows, cols = len(grid), len(grid[0])
    queue = deque([(start, [start])])
    visited = {start}
    
    while queue:
        (r, c), path = queue.popleft()
        if (r, c) == end:
            return path
        for dr, dc in [(0,1),(1,0),(0,-1),(-1,0)]:
            nr, nc = r + dr, c + dc
            if (0 <= nr < rows and 0 <= nc < cols
                and (nr, nc) not in visited
                and grid[nr][nc] != 1):
                visited.add((nr, nc))
                queue.append(((nr, nc), path + [(nr, nc)]))
    return None  # no path found`

const ROWS = 15
const COLS = 15
const START = [0, 0]
const END = [ROWS - 1, COLS - 1]

const key = (r, c) => `${r}-${c}`

function bfsWithSteps(walls, start, end) {
    const wallSet = new Set(walls.map(([r, c]) => key(r, c)))
    const visited = new Set()
    const parent = {}
    const queue = [[start[0], start[1]]]
    visited.add(key(start[0], start[1]))

    const steps = []
    const dirs = [[0, 1], [1, 0], [0, -1], [-1, 0]]

    steps.push({
        frontier: [[start[0], start[1]]],
        visited: new Set(visited),
        current: null,
        phase: 'init',
        message: `Starting BFS from (${start[0]}, ${start[1]})`
    })

    while (queue.length > 0) {
        const [r, c] = queue.shift()

        steps.push({
            frontier: queue.map(q => [q[0], q[1]]),
            visited: new Set(visited),
            current: [r, c],
            phase: 'explore',
            message: `Exploring (${r}, ${c}) — queue size: ${queue.length}`
        })

        if (r === end[0] && c === end[1]) {
            // Reconstruct path
            const path = []
            let cur = key(r, c)
            while (cur) {
                const [pr, pc] = cur.split('-').map(Number)
                path.unshift([pr, pc])
                cur = parent[cur]
            }

            steps.push({
                frontier: [],
                visited: new Set(visited),
                current: [r, c],
                path,
                phase: 'found',
                message: `Path found — ${path.length} steps`
            })
            return steps
        }

        for (const [dr, dc] of dirs) {
            const nr = r + dr, nc = c + dc
            const nk = key(nr, nc)
            if (nr >= 0 && nr < ROWS && nc >= 0 && nc < COLS && !visited.has(nk) && !wallSet.has(nk)) {
                visited.add(nk)
                parent[nk] = key(r, c)
                queue.push([nr, nc])
            }
        }
    }

    steps.push({
        frontier: [],
        visited: new Set(visited),
        current: null,
        phase: 'no-path',
        message: 'No path exists — end node is unreachable'
    })

    return steps
}

export default function BFSGridVisualizer() {
    const [walls, setWalls] = useState([])
    const [steps, setSteps] = useState([])
    const [currentStep, setCurrentStep] = useState(-1)
    const [running, setRunning] = useState(false)
    const [speed, setSpeed] = useState(SPEED_PRESETS.fast)
    const [isPaused, setIsPaused] = useState(false)
    const [isDrawing, setIsDrawing] = useState(false)

    const toggleWall = useCallback((r, c) => {
        if (running) return
        if ((r === START[0] && c === START[1]) || (r === END[0] && c === END[1])) return
        setWalls(prev => {
            const k = key(r, c)
            const exists = prev.some(([wr, wc]) => key(wr, wc) === k)
            return exists ? prev.filter(([wr, wc]) => key(wr, wc) !== k) : [...prev, [r, c]]
        })
    }, [running])

    const startBFS = () => {
        const s = bfsWithSteps(walls, START, END)
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
        const newWalls = []
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
            const t = setTimeout(() => setCurrentStep(cs => cs + 1), speed)
            return () => clearTimeout(t)
        } else if (running && currentStep >= steps.length - 1) {
            setRunning(false)
        }
    }, [running, currentStep, steps, speed, isPaused])

    const step = steps[currentStep] || {
        frontier: [], visited: new Set(), current: null, phase: 'idle', message: ''
    }

    const wallSet = new Set(walls.map(([r, c]) => key(r, c)))

    const getCellState = (r, c) => {
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
        empty: COLORS.surface,
        wall: COLORS.fg,
        start: COLORS.accent,
        end: COLORS.sorted,
        current: COLORS.active,
        frontier: COLORS.comparing,
        visited: '#bfdbfe',
        path: COLORS.active
    }

    const legendItems = [
        { color: COLORS.accent, label: 'Start' },
        { color: COLORS.sorted, label: 'End' },
        { color: COLORS.fg, label: 'Wall' },
        { color: COLORS.comparing, label: 'Frontier' },
        { color: '#bfdbfe', label: 'Visited' },
        { color: COLORS.active, label: 'Path' }
    ]

    const isFinalStep = currentStep === steps.length - 1 && !running

    return (
        <PageContainer title="BFS Grid Search">
            <ExplanationBox>
                <h3 style={{ marginBottom: 12, color: COLORS.fg }}>What is Breadth-First Search?</h3>
                <p>
                    BFS explores a graph level by level, visiting all neighbors at the current depth
                    before moving deeper. On an unweighted grid, this guarantees finding the <strong>shortest path</strong> between
                    two points.
                </p>
                <h4 style={{ margin: '16px 0 8px' }}>How It Works</h4>
                <ol style={{ paddingLeft: 20, margin: 0 }}>
                    <li>Start from the source, add it to a queue</li>
                    <li>Dequeue the front node, explore its unvisited neighbors</li>
                    <li>Add each neighbor to the queue (FIFO order)</li>
                    <li>Repeat until the target is found or queue is empty</li>
                </ol>
                <p style={{ marginTop: 12 }}>
                    <strong>Time Complexity:</strong> O(V + E) where V = cells, E = edges
                </p>
            </ExplanationBox>

            <CodeBlock code={bfsPythonCode} onCopy={() => { }} />

            <VisualizationContainer>
                {/* Instructions */}
                {!running && currentStep < 0 && (
                    <div style={{
                        marginBottom: 16,
                        padding: '8px 14px',
                        background: COLORS.surface,
                        border: `1px solid ${COLORS.border}`,
                        borderLeft: `3px solid ${COLORS.comparing}`,
                        borderRadius: '0px',
                        fontFamily: "'JetBrains Mono', monospace",
                        fontSize: '12px',
                        color: COLORS.fgMuted
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
                        background: COLORS.border,
                        border: `1px solid ${COLORS.border}`,
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
                                        fontFamily: "'JetBrains Mono', monospace",
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
                                background: COLORS.surface,
                                border: `1px solid ${step.phase === 'found' ? COLORS.sorted : COLORS.accent}`,
                                borderLeft: `3px solid ${step.phase === 'found' ? COLORS.sorted : COLORS.accent}`,
                                borderRadius: '0px',
                                fontFamily: "'JetBrains Mono', monospace",
                                fontWeight: 600,
                                fontSize: 15,
                                color: COLORS.fg,
                                display: 'inline-block'
                            }}
                        >
                            {step.phase === 'found'
                                ? `✓ Shortest path: ${step.path.length} steps — ${step.visited.size} cells explored`
                                : '✗ No path exists between start and end'}
                        </motion.div>
                    )}
                </AnimatePresence>
            </VisualizationContainer>
        </PageContainer>
    )
}
