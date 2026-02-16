import React, { useState, useEffect, useCallback } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { SPEED_PRESETS, COLORS, SPRING } from '../utils/animationConfig'
import {
    SpeedControl, StepCounter, StatusMessage, ControlButton, Legend,
    CodeBlock, PageContainer, ExplanationBox, VisualizationContainer, ControlsRow,
    SplitLayout, SplitLeft, SplitRight
} from '../components/ui/AnimationComponents'

const dfsPythonCode = `def dfs(grid, start, end):
    rows, cols = len(grid), len(grid[0])
    stack = [(start, [start])]
    visited = set()
    
    while stack:
        (r, c), path = stack.pop()
        if (r, c) in visited:
            continue
        visited.add((r, c))
        if (r, c) == end:
            return path
        for dr, dc in [(0,1),(1,0),(0,-1),(-1,0)]:
            nr, nc = r + dr, c + dc
            if (0 <= nr < rows and 0 <= nc < cols
                and (nr, nc) not in visited
                and grid[nr][nc] != 1):
                stack.append(((nr, nc), path + [(nr, nc)]))
    return None  # no path found`

const ROWS = 15
const COLS = 15
const START = [0, 0]
const END = [ROWS - 1, COLS - 1]

const key = (r, c) => `${r}-${c}`

function dfsWithSteps(walls, start, end) {
    const wallSet = new Set(walls.map(([r, c]) => key(r, c)))
    const visited = new Set()
    const parent = {}
    const stack = [[start[0], start[1]]]

    const steps = []
    const dirs = [[0, 1], [1, 0], [0, -1], [-1, 0]]

    steps.push({
        stack: [[start[0], start[1]]],
        visited: new Set(),
        current: null,
        phase: 'init',
        message: `Starting DFS from (${start[0]}, ${start[1]})`
    })

    while (stack.length > 0) {
        const [r, c] = stack.pop()
        const k = key(r, c)

        if (visited.has(k)) continue
        visited.add(k)

        steps.push({
            stack: stack.map(s => [s[0], s[1]]),
            visited: new Set(visited),
            current: [r, c],
            phase: 'explore',
            message: `Exploring (${r}, ${c}) — stack depth: ${stack.length}`
        })

        if (r === end[0] && c === end[1]) {
            const path = []
            let cur = k
            while (cur) {
                const [pr, pc] = cur.split('-').map(Number)
                path.unshift([pr, pc])
                cur = parent[cur]
            }

            steps.push({
                stack: [],
                visited: new Set(visited),
                current: [r, c],
                path,
                phase: 'found',
                message: `Path found — ${path.length} steps`
            })
            return steps
        }

        // Push in reverse so we explore in consistent order
        for (let i = dirs.length - 1; i >= 0; i--) {
            const [dr, dc] = dirs[i]
            const nr = r + dr, nc = c + dc
            const nk = key(nr, nc)
            if (nr >= 0 && nr < ROWS && nc >= 0 && nc < COLS && !visited.has(nk) && !wallSet.has(nk)) {
                parent[nk] = k
                stack.push([nr, nc])
            }
        }
    }

    steps.push({
        stack: [],
        visited: new Set(visited),
        current: null,
        phase: 'no-path',
        message: 'No path exists — end node is unreachable'
    })

    return steps
}

export default function DFSGridVisualizer() {
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

    const startDFS = () => {
        const s = dfsWithSteps(walls, START, END)
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
        stack: [], visited: new Set(), current: null, phase: 'idle', message: ''
    }

    const wallSet = new Set(walls.map(([r, c]) => key(r, c)))

    const getCellState = (r, c) => {
        const k = key(r, c)
        if (r === START[0] && c === START[1]) return 'start'
        if (r === END[0] && c === END[1]) return 'end'
        if (wallSet.has(k)) return 'wall'
        if (step.path && step.path.some(([pr, pc]) => pr === r && pc === c)) return 'path'
        if (step.current && step.current[0] === r && step.current[1] === c) return 'current'
        if (step.stack && step.stack.some(([sr, sc]) => sr === r && sc === c)) return 'inStack'
        if (step.visited?.has(k)) return 'visited'
        return 'empty'
    }

    const cellColors = {
        empty: COLORS.surface,
        wall: COLORS.fg,
        start: COLORS.accent,
        end: COLORS.sorted,
        current: COLORS.active,
        inStack: COLORS.swapping,
        visited: '#c7d2fe',
        path: COLORS.active
    }

    const legendItems = [
        { color: COLORS.accent, label: 'Start' },
        { color: COLORS.sorted, label: 'End' },
        { color: COLORS.fg, label: 'Wall' },
        { color: COLORS.swapping, label: 'In Stack' },
        { color: '#c7d2fe', label: 'Visited' },
        { color: COLORS.active, label: 'Path' }
    ]

    const isFinalStep = currentStep === steps.length - 1 && !running

    return (
        <PageContainer title="DFS Grid Search">
            <SplitLayout>
                <SplitLeft>
                    <ExplanationBox>
                        <h3 style={{ marginBottom: 12, color: COLORS.fg }}>What is Depth-First Search?</h3>
                        <p>
                            Depth-First Search (DFS) is a fundamental graph traversal algorithm that explores
                            as <strong>far as possible</strong> along each branch before backtracking. It uses a
                            <strong> stack (LIFO)</strong> data structure — either explicitly or via recursion — to
                            track which node to visit next.
                        </p>
                        <p style={{ marginTop: 8 }}>
                            Unlike BFS which expands level by level, DFS dives deep into one direction first. This
                            means it <strong>does not guarantee the shortest path</strong>, but it often uses
                            significantly less memory than BFS on wide graphs. DFS is the backbone of many advanced
                            algorithms including topological sorting, cycle detection, and strongly connected components.
                        </p>
                        <h4 style={{ margin: '16px 0 8px' }}>How It Works</h4>
                        <ol style={{ paddingLeft: 20, margin: 0 }}>
                            <li>Push the start node onto a stack and mark it as visited</li>
                            <li>Pop the top node from the stack</li>
                            <li>If it's the target, stop and reconstruct the path</li>
                            <li>Otherwise, push all unvisited neighbors onto the stack</li>
                            <li>Repeat steps 2–4 until the target is found or the stack is empty</li>
                            <li>If the stack empties without finding the target, no path exists</li>
                        </ol>
                        <h4 style={{ margin: '16px 0 8px' }}>DFS vs BFS</h4>
                        <ul style={{ paddingLeft: 20, margin: 0 }}>
                            <li><strong>DFS</strong> uses a stack, explores depth-first, and may find longer paths</li>
                            <li><strong>BFS</strong> uses a queue, explores breadth-first, and guarantees shortest paths</li>
                            <li>DFS uses <strong>O(depth)</strong> memory vs BFS's <strong>O(branching factor^depth)</strong></li>
                            <li>DFS is preferred for maze generation, topological sort, and connectivity checks</li>
                        </ul>
                        <h4 style={{ margin: '16px 0 8px' }}>Key Characteristics</h4>
                        <ul style={{ paddingLeft: 20, margin: 0 }}>
                            <li><strong>Complete:</strong> Yes, for finite graphs (will find a path if one exists)</li>
                            <li><strong>Optimal:</strong> No — does not guarantee the shortest path</li>
                            <li><strong>Memory-efficient:</strong> Uses less memory than BFS on deep/wide graphs</li>
                            <li><strong>Backtracking:</strong> Naturally backtracks when hitting dead ends</li>
                        </ul>
                        <p style={{ marginTop: 12 }}>
                            <strong>Time Complexity:</strong> O(V + E) where V = vertices and E = edges
                        </p>
                        <p style={{ marginTop: 4 }}>
                            <strong>Space Complexity:</strong> O(V) in the worst case for the stack and visited set
                        </p>
                        <p style={{ marginTop: 12, color: COLORS.fgMuted, fontSize: '0.9em' }}>
                            <strong>Real-world uses:</strong> Maze generation, puzzle solving (Sudoku backtracking),
                            topological ordering of build dependencies, detecting cycles in graphs, and finding
                            connected components in networks.
                        </p>
                    </ExplanationBox>

                    <CodeBlock code={dfsPythonCode} onCopy={() => { }} />
                </SplitLeft>
                <SplitRight>
                    <VisualizationContainer>
                        {/* Instructions */}
                        {!running && currentStep < 0 && (
                            <div style={{
                                marginBottom: 16,
                                padding: '8px 14px',
                                background: COLORS.surface,
                                border: `1px solid ${COLORS.border}`,
                                borderLeft: `3px solid ${COLORS.swapping}`,
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

                            <ControlButton onClick={startDFS} disabled={running && !isPaused} variant="primary">
                                {running ? 'Searching…' : 'Start DFS'}
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
                                        ? `✓ Path found: ${step.path.length} steps — ${step.visited.size} cells explored`
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
