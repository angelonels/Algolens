import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { SPEED_PRESETS, SPRING, EASE_OUT, type SpeedKey } from '../utils/animationConfig'
import {
    SpeedControl, StepCounter, StatusMessage, ControlButton, Legend,
    CodeBlock, PageContainer, ExplanationBox, VisualizationContainer,
    ControlsRow, SplitLayout, SplitLeft, SplitRight
} from '../components/ui/shared'

const CODE = `def selection_sort(arr):
    n = len(arr)
    for i in range(n):
        min_idx = i
        for j in range(i + 1, n):
            if arr[j] < arr[min_idx]:
                min_idx = j
        arr[i], arr[min_idx] = arr[min_idx], arr[i]
    return arr`

interface Step {
    array: number[]
    current: number        // position being filled (i)
    scanning: number       // element being compared (j)
    minIdx: number         // current minimum index
    swapIndices: number[]  // the two indices being swapped (empty if no swap this step)
    sortedCount: number
    pass: number
    phase: 'scan' | 'swap' | 'done'
    message: string
}

const INIT = [64, 25, 12, 22, 11, 90, 34, 45]

export default function SelectionSortVisualizer() {
    const [steps, setSteps] = useState<Step[]>([])
    const [currentStep, setCurrentStep] = useState(-1)
    const [sorting, setSorting] = useState(false)
    const [speed, setSpeed] = useState<SpeedKey>('1x')
    const [isPaused, setIsPaused] = useState(false)

    const computeSteps = (): Step[] => {
        const arr = [...INIT]
        const s: Step[] = []
        const n = arr.length

        for (let i = 0; i < n - 1; i++) {
            let minIdx = i

            // Show the start of the pass — selecting position i
            s.push({
                array: [...arr], current: i, scanning: i, minIdx: i,
                swapIndices: [], sortedCount: i, pass: i + 1, phase: 'scan',
                message: `Pass ${i + 1}: Finding minimum from index ${i}`
            })

            for (let j = i + 1; j < n; j++) {
                const isNewMin = arr[j] < arr[minIdx]
                if (isNewMin) {
                    minIdx = j
                }
                s.push({
                    array: [...arr], current: i, scanning: j, minIdx,
                    swapIndices: [], sortedCount: i, pass: i + 1, phase: 'scan',
                    message: isNewMin
                        ? `${arr[j]} < ${arr[minIdx === j ? i : minIdx]} → new minimum found at index ${j}`
                        : `${arr[j]} ≥ ${arr[minIdx]} → minimum unchanged`
                })
            }

            // Swap step
            if (minIdx !== i) {
                s.push({
                    array: [...arr], current: i, scanning: -1, minIdx,
                    swapIndices: [i, minIdx], sortedCount: i, pass: i + 1, phase: 'swap',
                    message: `Swapping ${arr[i]} ↔ ${arr[minIdx]} (placing minimum at index ${i})`
                });
                [arr[i], arr[minIdx]] = [arr[minIdx], arr[i]]
                s.push({
                    array: [...arr], current: i, scanning: -1, minIdx: i,
                    swapIndices: [i, minIdx], sortedCount: i + 1, pass: i + 1, phase: 'swap',
                    message: `Swapped — ${arr[i]} is now in position ${i}`
                })
            } else {
                s.push({
                    array: [...arr], current: i, scanning: -1, minIdx: i,
                    swapIndices: [], sortedCount: i + 1, pass: i + 1, phase: 'scan',
                    message: `${arr[i]} is already in the correct position`
                })
            }
        }

        s.push({
            array: [...arr], current: -1, scanning: -1, minIdx: -1,
            swapIndices: [], sortedCount: n, pass: n - 1, phase: 'done',
            message: 'Array is sorted!'
        })
        return s
    }

    const startSort = () => { setSteps(computeSteps()); setCurrentStep(0); setSorting(true); setIsPaused(false) }
    const reset = () => { setSteps([]); setCurrentStep(-1); setSorting(false); setIsPaused(false) }

    useEffect(() => {
        if (sorting && !isPaused && currentStep >= 0 && currentStep < steps.length - 1) {
            const t = setTimeout(() => setCurrentStep(c => c + 1), SPEED_PRESETS[speed])
            return () => clearTimeout(t)
        } else if (sorting && currentStep === steps.length - 1) setSorting(false)
    }, [currentStep, sorting, steps, speed, isPaused])

    const step = steps[currentStep] ?? {
        array: INIT, current: -1, scanning: -1, minIdx: -1,
        swapIndices: [] as number[], sortedCount: 0, pass: 0, phase: 'done' as const, message: ''
    }
    const maxVal = Math.max(...INIT)

    const getColor = (i: number) => {
        // Already sorted
        if (i < step.sortedCount) return 'var(--color-sorted)'
        // Being swapped
        if (step.swapIndices.includes(i)) return 'var(--color-swapping)'
        // Current minimum
        if (i === step.minIdx && step.phase === 'scan') return 'var(--color-active)'
        // Currently being scanned
        if (i === step.scanning) return 'var(--color-comparing)'
        // Position being filled
        if (i === step.current) return 'var(--color-current)'
        // Final — all sorted
        if (step.phase === 'done') return 'var(--color-sorted)'
        return 'var(--el-default)'
    }

    const isFinal = steps.length > 0 && currentStep === steps.length - 1 && !sorting

    return (
        <PageContainer>
            <SplitLayout>
                <SplitLeft>
                    <ExplanationBox>
                        <h3 className="font-mono text-base font-bold text-[var(--fg)] mb-3">What is Selection Sort?</h3>
                        <p className="text-[var(--fg-muted)] text-sm leading-relaxed">
                            Selection Sort divides the array into a sorted and unsorted region. It repeatedly
                            finds the minimum element from the unsorted region and places it at the beginning.
                        </p>
                        <h4 className="font-mono text-sm font-bold text-[var(--fg)] mt-4 mb-2">How It Works</h4>
                        <ol className="pl-5 text-sm text-[var(--fg-muted)] leading-relaxed space-y-1">
                            <li>Start from the first unsorted position</li>
                            <li>Scan the remaining array to find the minimum element</li>
                            <li>Swap the minimum with the element at the current position</li>
                            <li>Move to the next position and repeat</li>
                        </ol>
                        <div className="mt-4 pt-3 border-t border-[var(--border)] text-xs text-[var(--fg-muted)] space-y-0.5">
                            <p><strong>Time:</strong> O(n²) average/worst/best</p>
                            <p><strong>Space:</strong> O(1) | <strong>Stable:</strong> No</p>
                        </div>
                    </ExplanationBox>
                    <CodeBlock code={CODE} />
                </SplitLeft>
                <SplitRight>
                    <VisualizationContainer>
                        {sorting && (
                            <div className="font-mono text-xs font-semibold uppercase tracking-wider text-[var(--fg-muted)] mb-4 px-3 py-1.5 bg-[var(--surface)] border border-[var(--border)] inline-block">
                                Pass {step.pass} / {INIT.length - 1}
                            </div>
                        )}
                        <AnimatePresence mode="wait">
                            {currentStep >= 0 && step.message && (
                                <StatusMessage
                                    key={currentStep}
                                    message={step.message}
                                    type={
                                        step.phase === 'swap' ? 'swap'
                                            : step.phase === 'done' ? 'success'
                                                : step.minIdx === step.scanning ? 'warning'
                                                    : 'compare'
                                    }
                                />
                            )}
                        </AnimatePresence>

                        <div className="flex justify-center items-end gap-1.5 h-[280px] py-5">
                            {step.array.map((v, i) => (
                                <motion.div
                                    key={i} layout
                                    animate={{
                                        height: (v / maxVal) * 200 + 40,
                                        backgroundColor: getColor(i),
                                        scale: (step.swapIndices.includes(i) || i === step.scanning || i === step.minIdx) ? 1.04 : 1,
                                        y: step.swapIndices.includes(i) ? -10 : 0,
                                    }}
                                    transition={{ ...SPRING.bouncy, layout: { type: 'spring', stiffness: 500, damping: 30 } }}
                                    className="w-[52px] rounded-t-sm flex flex-col items-center justify-end pb-2 font-mono font-bold text-[15px] border border-[var(--border-subtle)]"
                                    style={{ color: (step.swapIndices.includes(i) || i === step.scanning || i === step.minIdx) ? '#fff' : 'var(--fg)' }}
                                >
                                    {v}
                                </motion.div>
                            ))}
                        </div>

                        <Legend items={[
                            { color: 'var(--color-comparing)', label: 'Scanning' },
                            { color: 'var(--color-active)', label: 'Minimum' },
                            { color: 'var(--color-current)', label: 'Current Position' },
                            { color: 'var(--color-swapping)', label: 'Swapping' },
                            { color: 'var(--color-sorted)', label: 'Sorted' },
                        ]} />

                        <ControlsRow>
                            <SpeedControl speed={speed} onSpeedChange={setSpeed} />
                            {sorting && <StepCounter current={currentStep + 1} total={steps.length} />}
                            <ControlButton onClick={startSort} disabled={sorting && !isPaused}>{sorting ? 'Sorting…' : 'Start Sort'}</ControlButton>
                            {sorting && <ControlButton onClick={() => setIsPaused(!isPaused)} variant="success">{isPaused ? 'Resume' : 'Pause'}</ControlButton>}
                            <ControlButton onClick={reset} variant="danger">Reset</ControlButton>
                        </ControlsRow>

                        <AnimatePresence>
                            {isFinal && (
                                <motion.div initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }} transition={{ duration: 0.2, ease: EASE_OUT }}
                                    className="mt-6 px-5 py-3 bg-[var(--surface)] border border-[var(--color-sorted)] border-l-[3px] font-mono font-semibold text-[15px] text-[var(--fg)] inline-block"
                                >
                                    Done — sorted in {step.pass} passes with O(n²) comparisons
                                </motion.div>
                            )}
                        </AnimatePresence>
                    </VisualizationContainer>
                </SplitRight>
            </SplitLayout>
        </PageContainer>
    )
}
