import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { SPEED_PRESETS, SPRING, EASE_OUT, type SpeedKey } from '../utils/animationConfig'
import {
    SpeedControl, StepCounter, StatusMessage, ControlButton, Legend,
    CodeBlock, PageContainer, ExplanationBox, VisualizationContainer,
    ControlsRow, SplitLayout, SplitLeft, SplitRight
} from '../components/ui/shared'
import { HEAP_SORT_CODE } from '../data/algorithmCodes'
import { computeHeapSortSteps, type HeapSortStep } from '../algorithms/heapSort'


const INIT = [64, 34, 25, 12, 22, 11, 90, 45]

export default function HeapSortVisualizer() {
    const [steps, setSteps] = useState<HeapSortStep[]>([])
    const [currentStep, setCurrentStep] = useState(-1)
    const [sorting, setSorting] = useState(false)
    const [speed, setSpeed] = useState<SpeedKey>('1x')
    const [isPaused, setIsPaused] = useState(false)

    const startSort = () => { setSteps(computeHeapSortSteps(INIT)); setCurrentStep(0); setSorting(true); setIsPaused(false) }
    const reset = () => { setSteps([]); setCurrentStep(-1); setSorting(false); setIsPaused(false) }

    useEffect(() => {
        if (sorting && !isPaused && currentStep >= 0 && currentStep < steps.length - 1) {
            const t = setTimeout(() => setCurrentStep(c => c + 1), SPEED_PRESETS[speed])
            return () => clearTimeout(t)
        } else if (sorting && currentStep === steps.length - 1) setSorting(false)
    }, [currentStep, sorting, steps, speed, isPaused])

    const step = steps[currentStep] ?? {
        array: INIT, compare: [] as number[], swap: false,
        sortedCount: 0, phase: 'done' as const, message: ''
    }
    const maxVal = Math.max(...INIT)

    const getColor = (i: number) => {
        if (i >= step.array.length - step.sortedCount) return 'var(--color-sorted)'
        if (step.compare.includes(i)) {
            return step.swap ? 'var(--color-swapping)' : 'var(--color-comparing)'
        }
        if (step.phase === 'done') return 'var(--color-sorted)'
        if (i === 0 && step.phase === 'build') return 'var(--color-pivot)'
        return 'var(--el-default)'
    }

    const isFinal = steps.length > 0 && currentStep === steps.length - 1 && !sorting

    return (
        <PageContainer title="Heap Sort">
            <SplitLayout>
                <SplitLeft>
                    <ExplanationBox>
                        <h3 className="font-mono text-base font-bold text-[var(--fg)] mb-3">What is Heap Sort?</h3>
                        <p className="text-[var(--fg-muted)] text-sm leading-relaxed">
                            Heap Sort uses a binary heap data structure to sort elements. It first builds a max heap,
                            then repeatedly extracts the maximum element and places it at the end.
                        </p>
                        <h4 className="font-mono text-sm font-bold text-[var(--fg)] mt-4 mb-2">How It Works</h4>
                        <ol className="pl-5 text-sm text-[var(--fg-muted)] leading-relaxed space-y-1">
                            <li>Build a max heap from the unsorted array</li>
                            <li>Swap the root (maximum) with the last unsorted element</li>
                            <li>Reduce the heap size by one and heapify the root</li>
                            <li>Repeat until entire array is sorted</li>
                        </ol>
                        <div className="mt-4 pt-3 border-t border-[var(--border)] text-xs text-[var(--fg-muted)] space-y-0.5">
                            <p><strong>Time:</strong> O(n log n) average/worst/best</p>
                            <p><strong>Space:</strong> O(1) | <strong>Stable:</strong> No</p>
                        </div>
                    </ExplanationBox>
                    <CodeBlock codes={HEAP_SORT_CODE} />
                </SplitLeft>
                <SplitRight>
                    <VisualizationContainer>
                        {sorting && (
                            <div className="font-mono text-xs font-semibold uppercase tracking-wider text-[var(--fg-muted)] mb-4 px-3 py-1.5 bg-[var(--surface)] border border-[var(--border)] inline-block">
                                Phase: {step.phase === 'build' ? 'Building Heap' : step.phase === 'extract' ? 'Extracting Max' : 'Done'}
                            </div>
                        )}
                        <AnimatePresence mode="wait">
                            {currentStep >= 0 && step.message && (
                                <StatusMessage
                                    key={currentStep}
                                    message={step.message}
                                    type={step.swap ? 'swap' : step.phase === 'done' ? 'success' : 'compare'}
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
                                        scale: step.compare.includes(i) ? 1.04 : 1,
                                        y: step.swap && step.compare.includes(i) ? -10 : 0,
                                    }}
                                    transition={{ ...SPRING.bouncy, layout: { type: 'spring', stiffness: 500, damping: 30 } }}
                                    className="w-[52px] rounded-t-sm flex flex-col items-center justify-end pb-2 font-mono font-bold text-[15px] border border-[var(--border-subtle)]"
                                    style={{ color: step.compare.includes(i) ? '#fff' : 'var(--fg)' }}
                                >
                                    {v}
                                </motion.div>
                            ))}
                        </div>

                        <Legend items={[
                            { color: 'var(--color-comparing)', label: 'Comparing' },
                            { color: 'var(--color-swapping)', label: 'Swapping' },
                            { color: 'var(--color-pivot)', label: 'Heap Root' },
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
                                    Done — sorted with O(n log n) guaranteed performance
                                </motion.div>
                            )}
                        </AnimatePresence>
                    </VisualizationContainer>
                </SplitRight>
            </SplitLayout>
        </PageContainer>
    )
}
