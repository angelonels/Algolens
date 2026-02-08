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
                    message: `Comparing ${arr[j]} with pivot ${pivot}${willSwap ? ' → swap!' : ''}`
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
                message: `Pivot ${arr[i + 1]} placed at final position ${i + 1}`
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
            message: '🎉 Array is sorted!'
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

    const depthColors = ['#3b82f6', '#8b5cf6', '#ec4899', '#f97316']

    const legendItems = [
        { color: COLORS.pivot, label: 'Pivot' },
        { color: COLORS.comparing, label: 'Comparing' },
        { color: COLORS.swapping, label: 'Swapping' },
        { color: '#a5b4fc', label: 'Partition Range' },
        { color: COLORS.sorted, label: 'Sorted' }
    ]

    const isFinalStep = currentStep === steps.length - 1 && !sorting

    return (
        <PageContainer title="⚡ Quick Sort Visualizer">
            <ExplanationBox>
                <h3 style={{ marginBottom: 12, color: '#1e293b' }}>What is Quick Sort?</h3>
                <p>
                    Quick Sort is an efficient divide-and-conquer algorithm. It selects a "pivot" element,
                    partitions the array so smaller elements are left and larger are right, then recursively sorts.
                </p>
                <h4 style={{ margin: '16px 0 8px', color: '#475569' }}>How It Works</h4>
                <ol style={{ paddingLeft: 20, margin: 0 }}>
                    <li>Choose a pivot (typically last element)</li>
                    <li>Partition: elements ≤ pivot go left</li>
                    <li>Place pivot in its final sorted position</li>
                    <li>Recursively sort left and right partitions</li>
                </ol>
                <p style={{ marginTop: 12 }}>
                    <strong>Time Complexity:</strong> O(n log n) average, O(n²) worst case
                </p>
            </ExplanationBox>

            <CodeBlock code={quickSortPythonCode} onCopy={() => { }} />

            <VisualizationContainer>
                {/* Current Pivot Display */}
                <AnimatePresence>
                    {step.pivotValue !== undefined && step.phase !== 'done' && (
                        <motion.div
                            initial={{ opacity: 0, y: -20 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0 }}
                            style={{
                                marginBottom: 16,
                                padding: '10px 20px',
                                background: 'linear-gradient(135deg, #8b5cf6 0%, #6d28d9 100%)',
                                borderRadius: 10,
                                color: 'white',
                                fontWeight: 600,
                                display: 'inline-block',
                                boxShadow: '0 4px 15px rgba(139, 92, 246, 0.4)'
                            }}
                        >
                            🎯 Pivot: {step.pivotValue} | Depth: {step.depth}
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

                {/* Array Visualization */}
                <div style={{
                    display: 'flex',
                    justifyContent: 'center',
                    alignItems: 'flex-end',
                    gap: 6,
                    height: 280,
                    padding: '20px 0'
                }}>
                    {step.array.map((v, i) => {
                        const state = getElementState(i)
                        const maxVal = Math.max(...array)
                        const height = (v / maxVal) * 200 + 40

                        const colors = {
                            default: '#e2e8f0',
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
                                    scale: state === 'pivot' || state === 'swapping' ? 1.1 : 1,
                                    y: state === 'swapping' ? -15 : state === 'pivot' ? -8 : 0
                                }}
                                transition={{
                                    ...SPRING.bouncy,
                                    layout: { type: 'spring', stiffness: 300, damping: 30 }
                                }}
                                style={{
                                    width: 50,
                                    borderRadius: '10px 10px 4px 4px',
                                    display: 'flex',
                                    flexDirection: 'column',
                                    alignItems: 'center',
                                    justifyContent: 'flex-end',
                                    paddingBottom: 8,
                                    fontWeight: 700,
                                    fontSize: 15,
                                    color: state === 'swapping' || state === 'pivot' ? 'white' : '#1e293b',
                                    boxShadow: state === 'pivot' || state === 'swapping'
                                        ? '0 8px 25px rgba(0,0,0,0.25)'
                                        : '0 2px 8px rgba(0,0,0,0.1)',
                                    border: state === 'pivot' ? '3px solid #7c3aed' : 'none'
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
                        marginTop: 8
                    }}>
                        <div style={{
                            display: 'flex',
                            gap: 6
                        }}>
                            {step.array.map((_, i) => (
                                <div
                                    key={i}
                                    style={{
                                        width: 50,
                                        height: 4,
                                        borderRadius: 2,
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
                        {sorting ? '⚡ Sorting...' : '▶️ Start Sort'}
                    </ControlButton>

                    {sorting && (
                        <ControlButton onClick={togglePause} variant="success">
                            {isPaused ? '▶️ Resume' : '⏸️ Pause'}
                        </ControlButton>
                    )}

                    <ControlButton onClick={reset} variant="danger">
                        🔄 Reset
                    </ControlButton>
                </ControlsRow>

                {/* Final Result */}
                <AnimatePresence>
                    {isFinalStep && (
                        <motion.div
                            initial={{ opacity: 0, scale: 0.8, y: 20 }}
                            animate={{ opacity: 1, scale: 1, y: 0 }}
                            exit={{ opacity: 0 }}
                            transition={SPRING.bouncy}
                            style={{
                                marginTop: 24,
                                padding: '16px 24px',
                                background: 'linear-gradient(135deg, #11998e 0%, #38ef7d 100%)',
                                borderRadius: 12,
                                color: 'white',
                                fontWeight: 600,
                                fontSize: 18,
                                display: 'inline-block',
                                boxShadow: '0 4px 15px rgba(0,0,0,0.2)'
                            }}
                        >
                            🎉 Array sorted with Quick Sort!
                        </motion.div>
                    )}
                </AnimatePresence>
            </VisualizationContainer>
        </PageContainer>
    )
}
