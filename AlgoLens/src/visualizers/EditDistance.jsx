import React, { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { SPEED_PRESETS, COLORS, SPRING } from '../utils/animationConfig'
import {
    SpeedControl, StepCounter, StatusMessage, ControlButton, Legend,
    CodeBlock, PageContainer, ExplanationBox, VisualizationContainer, ControlsRow,
    SplitLayout, SplitLeft, SplitRight
} from '../components/ui/AnimationComponents'

const editDistPythonCode = `def edit_distance(word1, word2):
    m, n = len(word1), len(word2)
    dp = [[0] * (n + 1) for _ in range(m + 1)]
    
    for i in range(m + 1):
        dp[i][0] = i  # delete all chars
    for j in range(n + 1):
        dp[0][j] = j  # insert all chars
    
    for i in range(1, m + 1):
        for j in range(1, n + 1):
            if word1[i-1] == word2[j-1]:
                dp[i][j] = dp[i-1][j-1]  # match
            else:
                dp[i][j] = 1 + min(
                    dp[i-1][j],    # delete
                    dp[i][j-1],    # insert
                    dp[i-1][j-1]   # replace
                )
    return dp[m][n]`

function computeEditDistSteps(word1, word2) {
    const m = word1.length, n = word2.length
    const dp = Array.from({ length: m + 1 }, () => new Array(n + 1).fill(0))
    const ops = Array.from({ length: m + 1 }, () => new Array(n + 1).fill(''))
    const steps = []

    // Base cases
    for (let i = 0; i <= m; i++) {
        dp[i][0] = i
        ops[i][0] = i > 0 ? 'delete' : 'base'
    }
    for (let j = 0; j <= n; j++) {
        dp[0][j] = j
        ops[0][j] = j > 0 ? 'insert' : 'base'
    }

    steps.push({
        dp: dp.map(r => [...r]),
        ops: ops.map(r => [...r]),
        current: null,
        filledCells: new Set(
            [...Array(m + 1)].flatMap((_, i) =>
                [...Array(n + 1)].map((_, j) => (i === 0 || j === 0) ? `${i}-${j}` : null).filter(Boolean)
            )
        ),
        phase: 'init',
        message: `Initialized base cases: first row (inserts) and first column (deletes)`
    })

    const filledCells = new Set(steps[0].filledCells)

    for (let i = 1; i <= m; i++) {
        for (let j = 1; j <= n; j++) {
            const charsMatch = word1[i - 1] === word2[j - 1]

            if (charsMatch) {
                dp[i][j] = dp[i - 1][j - 1]
                ops[i][j] = 'match'
            } else {
                const del = dp[i - 1][j]
                const ins = dp[i][j - 1]
                const rep = dp[i - 1][j - 1]
                const minVal = Math.min(del, ins, rep)
                dp[i][j] = 1 + minVal

                if (minVal === rep) ops[i][j] = 'replace'
                else if (minVal === del) ops[i][j] = 'delete'
                else ops[i][j] = 'insert'
            }

            filledCells.add(`${i}-${j}`)

            const opLabel = charsMatch
                ? `'${word1[i - 1]}' = '${word2[j - 1]}' → match (cost ${dp[i][j]})`
                : `'${word1[i - 1]}' ≠ '${word2[j - 1]}' → ${ops[i][j]} (cost ${dp[i][j]})`

            steps.push({
                dp: dp.map(r => [...r]),
                ops: ops.map(r => [...r]),
                current: [i, j],
                filledCells: new Set(filledCells),
                phase: 'fill',
                comparing: charsMatch ? [[i - 1, j - 1]] : [[i - 1, j], [i, j - 1], [i - 1, j - 1]],
                operation: ops[i][j],
                message: `dp[${i}][${j}]: ${opLabel}`
            })
        }
    }

    // Backtrack to find the optimal edit path
    const editPath = []
    let ci = m, cj = n
    while (ci > 0 || cj > 0) {
        editPath.push([ci, cj])
        const op = ops[ci][cj]
        if (op === 'match' || op === 'replace') { ci--; cj-- }
        else if (op === 'delete') { ci-- }
        else if (op === 'insert') { cj-- }
        else break
    }
    editPath.push([0, 0])

    steps.push({
        dp: dp.map(r => [...r]),
        ops: ops.map(r => [...r]),
        current: [m, n],
        filledCells: new Set(filledCells),
        editPath: new Set(editPath.map(([r, c]) => `${r}-${c}`)),
        phase: 'done',
        message: `✓ Edit distance = ${dp[m][n]} — minimum operations to transform "${word1}" → "${word2}"`
    })

    return steps
}

const PRESETS = [
    { word1: 'horse', word2: 'ros' },
    { word1: 'kitten', word2: 'sitting' },
    { word1: 'sunday', word2: 'saturday' },
    { word1: 'abcdef', word2: 'azced' }
]

export default function EditDistanceVisualizer() {
    const [word1, setWord1] = useState('horse')
    const [word2, setWord2] = useState('ros')
    const [steps, setSteps] = useState([])
    const [currentStep, setCurrentStep] = useState(-1)
    const [running, setRunning] = useState(false)
    const [speed, setSpeed] = useState(SPEED_PRESETS.normal)
    const [isPaused, setIsPaused] = useState(false)

    const startDP = () => {
        if (!word1 || !word2) return
        const s = computeEditDistSteps(word1, word2)
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

    const togglePause = () => setIsPaused(!isPaused)

    useEffect(() => {
        if (running && !isPaused && currentStep >= 0 && currentStep < steps.length - 1) {
            const t = setTimeout(() => setCurrentStep(cs => cs + 1), speed)
            return () => clearTimeout(t)
        } else if (running && currentStep >= steps.length - 1) {
            setRunning(false)
        }
    }, [running, currentStep, steps, speed, isPaused])

    const step = steps[currentStep] || null

    const isFinalStep = currentStep === steps.length - 1 && !running

    const m = word1.length, n = word2.length

    const labelStyle = {
        fontFamily: "'JetBrains Mono', monospace",
        fontWeight: 600,
        fontSize: '12px',
        textTransform: 'uppercase',
        letterSpacing: '0.05em',
        color: COLORS.fgMuted
    }

    const inputStyle = {
        fontFamily: "'JetBrains Mono', monospace",
        fontSize: 14,
        padding: '6px 10px',
        border: `1px solid ${COLORS.border}`,
        borderRadius: '0px',
        background: COLORS.surface,
        color: COLORS.fg,
        width: 120
    }

    const getCellStyle = (i, j) => {
        if (!step) return {}
        const k = `${i}-${j}`
        const isCurrent = step.current && step.current[0] === i && step.current[1] === j
        const isComparing = step.comparing && step.comparing.some(([r, c]) => r === i && c === j)
        const isOnEditPath = step.editPath && step.editPath.has(k)
        const isFilled = step.filledCells?.has(k)

        if (isCurrent) return { background: COLORS.active, color: '#fff', fontWeight: 800 }
        if (isOnEditPath) return { background: COLORS.active, color: '#fff', fontWeight: 800 }
        if (isComparing) return { background: COLORS.comparing, color: '#fff', fontWeight: 700 }
        if (isFilled) {
            const op = step.ops?.[i]?.[j]
            if (op === 'match') return { background: '#d1fae5', color: COLORS.fg }
            if (op === 'replace') return { background: '#fef3c7', color: COLORS.fg }
            if (op === 'delete') return { background: '#fee2e2', color: COLORS.fg }
            if (op === 'insert') return { background: '#dbeafe', color: COLORS.fg }
            return { background: '#f3f4f6', color: COLORS.fg }
        }
        return { background: COLORS.surface, color: '#ccc' }
    }

    const opColors = [
        { color: '#d1fae5', label: 'Match' },
        { color: '#fef3c7', label: 'Replace' },
        { color: '#fee2e2', label: 'Delete' },
        { color: '#dbeafe', label: 'Insert' },
        { color: COLORS.active, label: 'Current / Path' }
    ]

    // Dynamic cell size based on table dimensions
    const maxDim = Math.max(m, n)
    const cellSize = maxDim <= 5 ? 44 : maxDim <= 7 ? 38 : maxDim <= 9 ? 32 : 28

    return (
        <PageContainer title="Edit Distance (DP)">
            <SplitLayout>
                <SplitLeft>
                    <ExplanationBox>
                        <h3 style={{ marginBottom: 12, color: COLORS.fg }}>What is Edit Distance?</h3>
                        <p>
                            Edit Distance (also known as <strong>Levenshtein Distance</strong>) measures the minimum
                            number of single-character operations required to transform one string into another.
                            It's a classic <strong>dynamic programming</strong> problem
                            (<a href="https://leetcode.com/problems/edit-distance/" target="_blank" rel="noopener noreferrer"
                                style={{ color: COLORS.accent }}>LeetCode #72</a>).
                        </p>
                        <p style={{ marginTop: 8 }}>
                            The three allowed operations are: <strong>Insert</strong> a character,
                            <strong> Delete</strong> a character, or <strong>Replace</strong> a character.
                            The DP table builds up solutions to larger subproblems from smaller ones — each cell
                            dp[i][j] represents the edit distance between the first i characters of word1 and
                            the first j characters of word2.
                        </p>
                        <h4 style={{ margin: '16px 0 8px' }}>The Recurrence</h4>
                        <ul style={{ paddingLeft: 20, margin: 0 }}>
                            <li>If characters match: <strong>dp[i][j] = dp[i−1][j−1]</strong> (no cost)</li>
                            <li>Otherwise: <strong>dp[i][j] = 1 + min(</strong></li>
                            <li style={{ marginLeft: 20 }}>dp[i−1][j] → <strong>Delete</strong> from word1</li>
                            <li style={{ marginLeft: 20 }}>dp[i][j−1] → <strong>Insert</strong> into word1</li>
                            <li style={{ marginLeft: 20 }}>dp[i−1][j−1] → <strong>Replace</strong> in word1<strong>)</strong></li>
                        </ul>
                        <h4 style={{ margin: '16px 0 8px' }}>Key Characteristics</h4>
                        <ul style={{ paddingLeft: 20, margin: 0 }}>
                            <li><strong>Optimal Substructure:</strong> Optimal solution builds on optimal sub-solutions</li>
                            <li><strong>Overlapping Subproblems:</strong> Same subproblems recur, making DP efficient</li>
                            <li><strong>Bottom-up DP:</strong> Fill table row by row, avoiding recursion overhead</li>
                        </ul>
                        <p style={{ marginTop: 12 }}>
                            <strong>Time Complexity:</strong> O(m × n) where m, n are the string lengths
                        </p>
                        <p style={{ marginTop: 4 }}>
                            <strong>Space Complexity:</strong> O(m × n) for the DP table (optimizable to O(min(m,n)))
                        </p>
                        <p style={{ marginTop: 12, color: COLORS.fgMuted, fontSize: '0.9em' }}>
                            <strong>Real-world uses:</strong> Spell checkers, DNA sequence alignment, diff tools (git diff),
                            fuzzy string matching, autocorrect, and natural language processing.
                        </p>
                    </ExplanationBox>

                    <CodeBlock code={editDistPythonCode} onCopy={() => { }} />
                </SplitLeft>
                <SplitRight>
                    <VisualizationContainer>
                        {/* Inputs */}
                        <div style={{ display: 'flex', gap: 16, marginBottom: 16, flexWrap: 'wrap', alignItems: 'center' }}>
                            <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                                <label style={labelStyle}>Word 1</label>
                                <input
                                    value={word1}
                                    onChange={e => { setWord1(e.target.value.toLowerCase().replace(/[^a-z]/g, '').slice(0, 10)); reset() }}
                                    disabled={running}
                                    maxLength={10}
                                    style={inputStyle}
                                />
                            </div>
                            <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                                <label style={labelStyle}>Word 2</label>
                                <input
                                    value={word2}
                                    onChange={e => { setWord2(e.target.value.toLowerCase().replace(/[^a-z]/g, '').slice(0, 10)); reset() }}
                                    disabled={running}
                                    maxLength={10}
                                    style={inputStyle}
                                />
                            </div>
                        </div>

                        {/* Presets */}
                        <div style={{ display: 'flex', gap: 8, marginBottom: 16, flexWrap: 'wrap' }}>
                            {PRESETS.map((p, idx) => (
                                <button
                                    key={idx}
                                    onClick={() => { setWord1(p.word1); setWord2(p.word2); reset() }}
                                    disabled={running}
                                    style={{
                                        fontFamily: "'JetBrains Mono', monospace",
                                        fontSize: 10,
                                        padding: '4px 8px',
                                        border: `1px solid ${COLORS.border}`,
                                        borderRadius: '0px',
                                        background: (word1 === p.word1 && word2 === p.word2) ? COLORS.fg : COLORS.surface,
                                        color: (word1 === p.word1 && word2 === p.word2) ? '#fff' : COLORS.fgMuted,
                                        cursor: 'pointer'
                                    }}
                                >
                                    {p.word1} → {p.word2}
                                </button>
                            ))}
                        </div>

                        {/* Status Message */}
                        <AnimatePresence mode="wait">
                            {currentStep >= 0 && step && step.message && (
                                <StatusMessage
                                    key={currentStep}
                                    message={step.message}
                                    type={step.phase === 'done' ? 'success' : step.operation === 'match' ? 'info' : 'compare'}
                                />
                            )}
                        </AnimatePresence>

                        {/* DP Table */}
                        <div style={{
                            overflowX: 'auto',
                            margin: '16px 0',
                            display: 'flex',
                            justifyContent: 'center'
                        }}>
                            <table style={{
                                borderCollapse: 'collapse',
                                fontFamily: "'JetBrains Mono', monospace"
                            }}>
                                <thead>
                                    <tr>
                                        <th style={{ width: cellSize, height: cellSize }} />
                                        <th style={{
                                            width: cellSize, height: cellSize,
                                            fontSize: 11, fontWeight: 600, color: COLORS.fgMuted,
                                            textAlign: 'center'
                                        }}>ε</th>
                                        {word2.split('').map((ch, j) => (
                                            <th key={j} style={{
                                                width: cellSize, height: cellSize,
                                                fontSize: 13, fontWeight: 700, color: COLORS.accent,
                                                textAlign: 'center'
                                            }}>{ch}</th>
                                        ))}
                                    </tr>
                                </thead>
                                <tbody>
                                    {Array.from({ length: m + 1 }, (_, i) => (
                                        <tr key={i}>
                                            <th style={{
                                                width: cellSize, height: cellSize,
                                                fontSize: i === 0 ? 11 : 13,
                                                fontWeight: i === 0 ? 600 : 700,
                                                color: i === 0 ? COLORS.fgMuted : COLORS.accent,
                                                textAlign: 'center'
                                            }}>
                                                {i === 0 ? 'ε' : word1[i - 1]}
                                            </th>
                                            {Array.from({ length: n + 1 }, (_, j) => {
                                                const cellStyle = getCellStyle(i, j)
                                                const val = step ? step.dp[i][j] : (i === 0 ? j : j === 0 ? i : '')
                                                const isFilled = step ? step.filledCells?.has(`${i}-${j}`) : (i === 0 || j === 0)

                                                return (
                                                    <td key={j} style={{
                                                        width: cellSize,
                                                        height: cellSize,
                                                        textAlign: 'center',
                                                        fontSize: 13,
                                                        fontWeight: 600,
                                                        border: `1px solid ${COLORS.border}`,
                                                        transition: 'all 0.2s ease',
                                                        ...cellStyle
                                                    }}>
                                                        {isFilled ? val : ''}
                                                    </td>
                                                )
                                            })}
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>

                        {/* Legend */}
                        <div style={{
                            display: 'flex',
                            flexWrap: 'wrap',
                            gap: 12,
                            justifyContent: 'center',
                            padding: '12px 0',
                            borderTop: `1px solid ${COLORS.border}`,
                            marginBottom: 8
                        }}>
                            {opColors.map(({ color, label }) => (
                                <div key={label} style={{
                                    display: 'flex',
                                    alignItems: 'center',
                                    gap: 5,
                                    fontFamily: "'JetBrains Mono', monospace",
                                    fontSize: 10,
                                    fontWeight: 600,
                                    textTransform: 'uppercase',
                                    letterSpacing: '0.04em',
                                    color: COLORS.fgMuted
                                }}>
                                    <div style={{
                                        width: 12, height: 12,
                                        backgroundColor: color,
                                        border: `1px solid ${COLORS.border}`
                                    }} />
                                    {label}
                                </div>
                            ))}
                        </div>

                        {/* Controls */}
                        <ControlsRow>
                            <SpeedControl speed={speed} onSpeedChange={setSpeed} disabled={false} />

                            {running && <StepCounter current={currentStep + 1} total={steps.length} />}

                            <ControlButton
                                onClick={startDP}
                                disabled={(running && !isPaused) || !word1 || !word2}
                                variant="primary"
                            >
                                {running ? 'Computing…' : 'Start DP'}
                            </ControlButton>

                            {running && (
                                <ControlButton onClick={togglePause} variant="success">
                                    {isPaused ? 'Resume' : 'Pause'}
                                </ControlButton>
                            )}

                            <ControlButton onClick={reset} variant="danger">
                                Reset
                            </ControlButton>
                        </ControlsRow>

                        {/* Final Result */}
                        <AnimatePresence>
                            {isFinalStep && step && (
                                <motion.div
                                    initial={{ opacity: 0, y: 8 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    exit={{ opacity: 0 }}
                                    transition={{ duration: 0.2, ease: [0.16, 1, 0.3, 1] }}
                                    style={{
                                        marginTop: 24,
                                        padding: '12px 20px',
                                        background: COLORS.surface,
                                        border: `1px solid ${COLORS.sorted}`,
                                        borderLeft: `3px solid ${COLORS.sorted}`,
                                        borderRadius: '0px',
                                        fontFamily: "'JetBrains Mono', monospace",
                                        fontWeight: 600,
                                        fontSize: 15,
                                        color: COLORS.fg,
                                        display: 'inline-block'
                                    }}
                                >
                                    ✓ Edit distance("{word1}", "{word2}") = {step.dp[m][n]}
                                </motion.div>
                            )}
                        </AnimatePresence>
                    </VisualizationContainer>
                </SplitRight>
            </SplitLayout>
        </PageContainer>
    )
}
