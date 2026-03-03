import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { SPEED_PRESETS, SPRING, EASE_OUT, type SpeedKey } from '../utils/animationConfig'
import {
    SpeedControl, StepCounter, StatusMessage, ControlButton, Legend,
    CodeBlock, PageContainer, ExplanationBox, VisualizationContainer,
    ControlsRow, SplitLayout, SplitLeft, SplitRight
} from '../components/ui/shared'

const CODE = `def quick_sort(arr, low, high):
    if low < high:
        pi = partition(arr, low, high)
        quick_sort(arr, low, pi - 1)
        quick_sort(arr, pi + 1, high)

def partition(arr, low, high):
    pivot = arr[high]
    i = low - 1
    for j in range(low, high):
        if arr[j] <= pivot:
            i += 1
            arr[i], arr[j] = arr[j], arr[i]
    arr[i + 1], arr[high] = arr[high], arr[i + 1]
    return i + 1`

interface Step {
    array: number[]
    pivot: number
    pivotValue?: number
    compare: number[]
    phase: string
    range: [number, number] | null
    depth: number
    sortedIndices: Set<number>
    message: string
}

const INIT = [64, 34, 25, 12, 22, 11, 90, 45, 33]
const DEPTH_COLORS = ['var(--color-comparing)', 'var(--color-pivot)', '#ec4899', 'var(--color-exploring)']

export default function QuickSortVisualizer() {
    const [steps, setSteps] = useState<Step[]>([])
    const [currentStep, setCurrentStep] = useState(-1)
    const [sorting, setSorting] = useState(false)
    const [speed, setSpeed] = useState<SpeedKey>('1x')
    const [isPaused, setIsPaused] = useState(false)

    const computeSteps = (): Step[] => {
        const arr = [...INIT]; const s: Step[] = []; const sorted = new Set<number>()

        const partition = (low: number, high: number, depth: number): number => {
            const pivot = arr[high]; let i = low - 1
            s.push({ array: [...arr], pivot: high, pivotValue: pivot, compare: [], phase: 'select-pivot', range: [low, high], depth, sortedIndices: new Set(sorted), message: `Pivot selected: ${pivot} (index ${high})` })

            for (let j = low; j < high; j++) {
                const willSwap = arr[j] <= pivot
                s.push({ array: [...arr], pivot: high, pivotValue: pivot, compare: [j], phase: 'compare', range: [low, high], depth, sortedIndices: new Set(sorted), message: `Comparing ${arr[j]} with pivot ${pivot}${willSwap ? ' → swap' : ''}` })
                if (willSwap) {
                    i++
                    if (i !== j) {
                        [arr[i], arr[j]] = [arr[j], arr[i]]
                        s.push({ array: [...arr], pivot: high, pivotValue: pivot, compare: [i, j], phase: 'swap', range: [low, high], depth, sortedIndices: new Set(sorted), message: `Swapped ${arr[j]} ↔ ${arr[i]}` })
                    }
                }
            }
            if (i + 1 !== high) [arr[i + 1], arr[high]] = [arr[high], arr[i + 1]]
            sorted.add(i + 1)
            s.push({ array: [...arr], pivot: i + 1, pivotValue: arr[i + 1], compare: [], phase: 'pivot-placed', range: [low, high], depth, sortedIndices: new Set(sorted), message: `Pivot ${arr[i + 1]} placed at position ${i + 1}` })
            return i + 1
        }

        const qs = (low: number, high: number, depth = 0) => {
            if (low < high) { const pi = partition(low, high, depth); qs(low, pi - 1, depth + 1); qs(pi + 1, high, depth + 1) }
            else if (low === high) sorted.add(low)
        }

        qs(0, arr.length - 1)
        s.push({ array: [...arr], pivot: -1, compare: [], phase: 'done', range: null, depth: 0, sortedIndices: new Set(Array.from({ length: arr.length }, (_, i) => i)), message: 'Array is sorted' })
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

    const step = steps[currentStep] ?? { array: INIT, pivot: -1, compare: [] as number[], phase: 'idle', range: null, depth: 0, sortedIndices: new Set<number>(), message: '' } as Step
    const maxVal = Math.max(...INIT)

    const getColor = (i: number) => {
        if (step.phase === 'done' || step.sortedIndices?.has(i)) return 'var(--color-sorted)'
        if (step.pivot === i) return 'var(--color-pivot)'
        if (step.compare?.includes(i)) return step.phase === 'swap' ? 'var(--color-swapping)' : 'var(--color-comparing)'
        if (step.range && i >= step.range[0] && i <= step.range[1]) return '#a5b4fc'
        return 'var(--el-default)'
    }

    const isFinal = currentStep === steps.length - 1 && !sorting

    return (
        <PageContainer>
            <SplitLayout>
                <SplitLeft>
                    <ExplanationBox>
                        <h3 className="font-mono text-base font-bold text-[var(--fg)] mb-3">What is Quick Sort?</h3>
                        <p className="text-[var(--fg-muted)] text-sm leading-relaxed">
                            Quick Sort partitions the array around a pivot element — all smaller elements go left, larger go right.
                            The pivot lands in its final sorted position, then the process repeats recursively on each partition.
                        </p>
                        <h4 className="font-mono text-sm font-bold text-[var(--fg)] mt-4 mb-2">How It Works</h4>
                        <ol className="pl-5 text-sm text-[var(--fg-muted)] leading-relaxed space-y-1">
                            <li>Choose a pivot (last element)</li>
                            <li>Partition: move elements ≤ pivot left, &gt; pivot right</li>
                            <li>Swap pivot into its final position</li>
                            <li>Recursively sort left and right sub-arrays</li>
                        </ol>
                        <div className="mt-4 pt-3 border-t border-[var(--border)] text-xs text-[var(--fg-muted)] space-y-0.5">
                            <p><strong>Time:</strong> O(n log n) avg | O(n²) worst</p>
                            <p><strong>Space:</strong> O(log n) | <strong>Stable:</strong> No</p>
                        </div>
                    </ExplanationBox>
                    <CodeBlock code={CODE} />
                </SplitLeft>
                <SplitRight>
                    <VisualizationContainer>
                        <AnimatePresence>
                            {step.pivotValue !== undefined && step.phase !== 'done' && (
                                <motion.div initial={{ opacity: 0, y: -8 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }}
                                    className="mb-3 px-3.5 py-1.5 bg-[var(--surface)] border border-[var(--color-pivot)] border-l-[3px] font-mono text-xs font-semibold uppercase tracking-wider text-[var(--fg)] inline-block"
                                >Pivot: {step.pivotValue} · Depth: {step.depth}</motion.div>
                            )}
                        </AnimatePresence>
                        <AnimatePresence mode="wait">
                            {currentStep >= 0 && step.message && (
                                <StatusMessage key={currentStep} message={step.message} type={step.phase === 'swap' ? 'swap' : step.phase === 'pivot-placed' ? 'success' : 'info'} />
                            )}
                        </AnimatePresence>

                        <div className="flex justify-center items-end gap-1 h-[280px] py-5">
                            {step.array.map((v, i) => (
                                <motion.div
                                    key={i} layout
                                    animate={{ height: (v / maxVal) * 200 + 40, backgroundColor: getColor(i), scale: (step.pivot === i || step.phase === 'swap' && step.compare?.includes(i)) ? 1.06 : 1, y: step.phase === 'swap' && step.compare?.includes(i) ? -10 : step.pivot === i ? -6 : 0 }}
                                    transition={{ ...SPRING.bouncy, layout: { type: 'spring', stiffness: 500, damping: 30 } }}
                                    className="w-12 rounded-t-sm flex flex-col items-center justify-end pb-2 font-mono font-bold text-sm border border-black/10"
                                    style={{ color: ['comparing', 'swap', 'select-pivot'].includes(step.phase) && (step.compare?.includes(i) || step.pivot === i) ? '#fff' : 'var(--fg)', borderWidth: step.pivot === i ? 2 : 1, borderColor: step.pivot === i ? 'var(--color-pivot)' : 'rgba(0,0,0,0.08)' }}
                                >{v}</motion.div>
                            ))}
                        </div>

                        {step.range && (
                            <div className="flex justify-center mt-1">
                                <div className="flex gap-1">
                                    {step.array.map((_, i) => (
                                        <div key={i} className="w-12 h-[3px]" style={{ background: step.range && i >= step.range[0] && i <= step.range[1] ? DEPTH_COLORS[step.depth % DEPTH_COLORS.length] : 'transparent' }} />
                                    ))}
                                </div>
                            </div>
                        )}

                        <Legend items={[
                            { color: 'var(--color-pivot)', label: 'Pivot' },
                            { color: 'var(--color-comparing)', label: 'Comparing' },
                            { color: 'var(--color-swapping)', label: 'Swapping' },
                            { color: '#a5b4fc', label: 'Range' },
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
                                >Done — sorted with Quick Sort</motion.div>
                            )}
                        </AnimatePresence>
                    </VisualizationContainer>
                </SplitRight>
            </SplitLayout>
        </PageContainer>
    )
}
