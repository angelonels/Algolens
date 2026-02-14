import React, { useState, useEffect } from 'react'
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

const quickSortPythonCode = `def quick_sort(arr, low, high):
    if low < high:
        pivot_index = partition(arr, low, high)
        quick_sort(arr, low, pivot_index - 1)
        quick_sort(arr, pivot_index + 1, high)

def partition(arr, low, high):
    pivot = arr[high]
    i = low - 1
    for j in range(low, high):
        if arr[j] <= pivot:
            i += 1
            arr[i], arr[j] = arr[j], arr[i]
    arr[i + 1], arr[high] = arr[high], arr[i + 1]
    return i + 1`

export default function QuickSortVisualizer() {
    const init = [64, 34, 25, 12, 22, 11, 90, 45, 33]
    const [array] = useState(init)
    const [steps, setSteps] = useState([])
    const [currentStep, setCurrentStep] = useState(-1)
    const [sorting, setSorting] = useState(false)
    const [speed, setSpeed] = useState(SPEED_PRESETS.normal)
    const [isPaused, setIsPaused] = useState(false)

    const computeSteps = () => {
        const arr = [...array]
        const s = []
        const sortedIndices = new Set()

        const partition = (low, high, depth) => {
            const pivot = arr[high]
            let i = low - 1

            s.push({
                array: [...arr],
                pivot: high,
                pivotValue: pivot,
                compare: [],
                phase: 'select-pivot',
                range: [low, high],
                depth,
                sortedIndices: new Set(sortedIndices),
                message: `Pivot selected: ${pivot} (index ${high})`
            })

            for (let j = low; j < high; j++) {
                const willSwap = arr[j] <= pivot

                s.push({
                    array: [...arr],
                    pivot: high,
                    pivotValue: pivot,
                    compare: [j],
                    comparing: j,
                    phase: 'compare',
                    range: [low, high],
                    depth,
                    sortedIndices: new Set(sortedIndices),
                    message: `Comparing ${arr[j]} with pivot ${pivot}${willSwap ? ' → swap' : ''}`
                })

                if (willSwap) {
                    i++
                    if (i !== j) {
                        [arr[i], arr[j]] = [arr[j], arr[i]]
                        s.push({
                            array: [...arr],
                            pivot: high,
                            pivotValue: pivot,
                            compare: [i, j],
                            phase: 'swap',
                            range: [low, high],
                            depth,
                            sortedIndices: new Set(sortedIndices),
                            message: `Swapped ${arr[j]} ↔ ${arr[i]}`
                        })
                    }
                }
            }

            if (i + 1 !== high) {
                [arr[i + 1], arr[high]] = [arr[high], arr[i + 1]]
            }

            sortedIndices.add(i + 1)

            s.push({
                array: [...arr],
                pivot: i + 1,
                pivotValue: arr[i + 1],
                compare: [],
                phase: 'pivot-placed',
                range: [low, high],
                depth,
                sortedIndices: new Set(sortedIndices),
                message: `Pivot ${arr[i + 1]} placed at position ${i + 1}`
            })

            return i + 1
        }

        const quickSort = (low, high, depth = 0) => {
            if (low < high) {
                const pivotIndex = partition(low, high, depth)
                quickSort(low, pivotIndex - 1, depth + 1)
                quickSort(pivotIndex + 1, high, depth + 1)
            } else if (low === high) {
                sortedIndices.add(low)
            }
        }

        quickSort(0, arr.length - 1)

        s.push({
            array: [...arr],
            pivot: -1,
            compare: [],
            phase: 'done',
            range: null,
            depth: 0,
            sortedIndices: new Set(Array.from({ length: arr.length }, (_, i) => i)),
            message: '✓ Array is sorted'
        })

        return s
    }

    const startSort = () => {
        const s = computeSteps()
        setSteps(s)
        setCurrentStep(0)
        setSorting(true)
        setIsPaused(false)
    }

    const reset = () => {
        setSteps([])
        setCurrentStep(-1)
        setSorting(false)
        setIsPaused(false)
    }

    const togglePause = () => setIsPaused(!isPaused)

    useEffect(() => {
        if (sorting && !isPaused && currentStep >= 0 && currentStep < steps.length - 1) {
            const t = setTimeout(() => setCurrentStep(cs => cs + 1), speed)
            return () => clearTimeout(t)
        } else if (sorting && currentStep === steps.length - 1) {
            setSorting(false)
        }
    }, [currentStep, sorting, steps, speed, isPaused])

    const step = steps[currentStep] || {
        array,
        pivot: -1,
        compare: [],
        phase: 'idle',
        range: null,
        depth: 0,
        sortedIndices: new Set(),
        message: ''
    }

    const getElementState = (index) => {
        if (step.phase === 'done') return 'sorted'
        if (step.sortedIndices?.has(index)) return 'sorted'
        if (step.pivot === index) return 'pivot'
        if (step.compare?.includes(index)) {
            return step.phase === 'swap' ? 'swapping' : 'comparing'
        }
        if (step.range && index >= step.range[0] && index <= step.range[1]) {
            return 'in-range'
        }
        return 'default'
    }

    const depthColors = [COLORS.comparing, COLORS.pivot, '#ec4899', COLORS.exploring]

    const legendItems = [
        { color: COLORS.pivot, label: 'Pivot' },
        { color: COLORS.comparing, label: 'Comparing' },
        { color: COLORS.swapping, label: 'Swapping' },
        { color: '#a5b4fc', label: 'Partition Range' },
        { color: COLORS.sorted, label: 'Sorted' }
    ]

    const isFinalStep = currentStep === steps.length - 1 && !sorting

    return (
        <PageContainer title="Quick Sort Visualizer">
            <ExplanationBox>
                <h3 style={{ marginBottom: 12, color: COLORS.fg }}>What is Quick Sort?</h3>
                <p>
                    Quick Sort is one of the most efficient and widely used sorting algorithms. Like Merge Sort,
                    it follows the divide-and-conquer paradigm, but instead of splitting at the midpoint, it
                    partitions the array around a chosen "pivot" element. All elements smaller than the pivot
                    are moved to its left, and all elements larger are moved to its right — placing the pivot
                    in its final sorted position.
                </p>
                <p style={{ marginTop: 8 }}>
                    Developed by Tony Hoare in 1959, Quick Sort is often faster in practice than other O(n log n)
                    algorithms because of its excellent cache performance and low overhead. It sorts in-place
                    (unlike Merge Sort), though its worst-case O(n²) can occur when the pivot selection is poor
                    (e.g., always picking the smallest or largest element in an already sorted array).
                </p>
                <h4 style={{ margin: '16px 0 8px' }}>How It Works</h4>
                <ol style={{ paddingLeft: 20, margin: 0 }}>
                    <li><strong>Choose a pivot:</strong> Select an element as the pivot (here, the last element is used)</li>
                    <li><strong>Partition:</strong> Rearrange the array so elements ≤ pivot go to the left and elements &gt; pivot go to the right</li>
                    <li><strong>Place pivot:</strong> Swap the pivot into its correct final position between the two groups</li>
                    <li><strong>Recurse:</strong> Recursively apply the same process to the left and right sub-arrays</li>
                    <li><strong>Base case:</strong> Sub-arrays of size 0 or 1 are already sorted</li>
                </ol>
                <h4 style={{ margin: '16px 0 8px' }}>Pivot Selection Strategies</h4>
                <ul style={{ paddingLeft: 20, margin: 0 }}>
                    <li><strong>Last element:</strong> Simple but can degrade to O(n²) on sorted input</li>
                    <li><strong>Random element:</strong> Avoids worst-case on any specific input pattern</li>
                    <li><strong>Median-of-three:</strong> Picks the median of first, middle, and last elements — good practical choice</li>
                </ul>
                <h4 style={{ margin: '16px 0 8px' }}>Key Characteristics</h4>
                <ul style={{ paddingLeft: 20, margin: 0 }}>
                    <li><strong>Not stable:</strong> Equal elements may change their relative order during partitioning</li>
                    <li><strong>In-place:</strong> Requires only O(log n) stack space for recursion — no auxiliary arrays needed</li>
                    <li><strong>Cache-friendly:</strong> Sequential memory access patterns make it very fast in practice</li>
                    <li><strong>Comparison to Merge Sort:</strong> Faster in practice due to lower constant factors, but lacks stability and has worse worst-case</li>
                </ul>
                <p style={{ marginTop: 12 }}>
                    <strong>Time Complexity:</strong> O(n log n) average | O(n²) worst case (rare with good pivot selection)
                </p>
                <p style={{ marginTop: 4 }}>
                    <strong>Space Complexity:</strong> O(log n) average (recursion stack) | O(n) worst case
                </p>
                <p style={{ marginTop: 12, color: COLORS.fgMuted, fontSize: '0.9em' }}>
                    <strong>When to use:</strong> The go-to general-purpose sorting algorithm when stability isn't required.
                    Used as the default sort in C's <code>qsort()</code>, and many implementations of <code>Array.prototype.sort()</code>
                    in JavaScript engines use Quick Sort or its variants (like Introsort).
                </p>
            </ExplanationBox>

            <CodeBlock code={quickSortPythonCode} onCopy={() => { }} />

            <VisualizationContainer>
                {/* Current Pivot Display */}
                <AnimatePresence>
                    {step.pivotValue !== undefined && step.phase !== 'done' && (
                        <motion.div
                            initial={{ opacity: 0, y: -8 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0 }}
                            style={{
                                marginBottom: 12,
                                padding: '6px 14px',
                                background: COLORS.surface,
                                border: `1px solid ${COLORS.pivot}`,
                                borderLeft: `3px solid ${COLORS.pivot}`,
                                borderRadius: '0px',
                                fontFamily: "'JetBrains Mono', monospace",
                                fontWeight: 600,
                                fontSize: '12px',
                                textTransform: 'uppercase',
                                letterSpacing: '0.04em',
                                color: COLORS.fg,
                                display: 'inline-block'
                            }}
                        >
                            Pivot: {step.pivotValue} · Depth: {step.depth}
                        </motion.div>
                    )}
                </AnimatePresence>

                {/* Status Message */}
                <AnimatePresence mode="wait">
                    {currentStep >= 0 && step.message && (
                        <StatusMessage
                            key={currentStep}
                            message={step.message}
                            type={step.phase === 'swap' ? 'swap' : step.phase === 'pivot-placed' ? 'success' : 'info'}
                        />
                    )}
                </AnimatePresence>

                {/* Array Bar Chart */}
                <div style={{
                    display: 'flex',
                    justifyContent: 'center',
                    alignItems: 'flex-end',
                    gap: 4,
                    height: 280,
                    padding: '20px 0'
                }}>
                    {step.array.map((v, i) => {
                        const state = getElementState(i)
                        const maxVal = Math.max(...array)
                        const height = (v / maxVal) * 200 + 40

                        const colors = {
                            default: COLORS.default,
                            pivot: COLORS.pivot,
                            comparing: COLORS.comparing,
                            swapping: COLORS.swapping,
                            'in-range': '#a5b4fc',
                            sorted: COLORS.sorted
                        }

                        return (
                            <motion.div
                                key={i}
                                layout
                                animate={{
                                    height,
                                    backgroundColor: colors[state] || colors.default,
                                    scale: state === 'pivot' || state === 'swapping' ? 1.06 : 1,
                                    y: state === 'swapping' ? -10 : state === 'pivot' ? -6 : 0
                                }}
                                transition={{
                                    ...SPRING.bouncy,
                                    layout: { type: 'spring', stiffness: 500, damping: 30 }
                                }}
                                style={{
                                    width: 48,
                                    borderRadius: '2px 2px 0 0',
                                    display: 'flex',
                                    flexDirection: 'column',
                                    alignItems: 'center',
                                    justifyContent: 'flex-end',
                                    paddingBottom: 8,
                                    fontFamily: "'JetBrains Mono', monospace",
                                    fontWeight: 700,
                                    fontSize: 14,
                                    color: (state === 'swapping' || state === 'pivot' || state === 'comparing')
                                        ? '#fff' : COLORS.fg,
                                    border: state === 'pivot'
                                        ? `2px solid ${COLORS.pivot}`
                                        : '1px solid rgba(0,0,0,0.08)'
                                }}
                            >
                                {v}
                            </motion.div>
                        )
                    })}
                </div>

                {/* Partition Range Indicator */}
                {step.range && (
                    <div style={{
                        display: 'flex',
                        justifyContent: 'center',
                        marginTop: 4
                    }}>
                        <div style={{ display: 'flex', gap: 4 }}>
                            {step.array.map((_, i) => (
                                <div
                                    key={i}
                                    style={{
                                        width: 48,
                                        height: 3,
                                        background: i >= step.range[0] && i <= step.range[1]
                                            ? depthColors[step.depth % depthColors.length]
                                            : 'transparent'
                                    }}
                                />
                            ))}
                        </div>
                    </div>
                )}

                <Legend items={legendItems} />

                {/* Controls */}
                <ControlsRow>
                    <SpeedControl speed={speed} onSpeedChange={setSpeed} disabled={false} />

                    {sorting && (
                        <StepCounter current={currentStep + 1} total={steps.length} />
                    )}

                    <ControlButton
                        onClick={startSort}
                        disabled={sorting && !isPaused}
                        variant="primary"
                    >
                        {sorting ? 'Sorting…' : 'Start Sort'}
                    </ControlButton>

                    {sorting && (
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
                            ✓ Array sorted with Quick Sort
                        </motion.div>
                    )}
                </AnimatePresence>
            </VisualizationContainer>
        </PageContainer>
    )
}
