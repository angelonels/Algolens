import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { SPEED_PRESETS, SPRING, EASE_OUT, type SpeedKey } from '../utils/animationConfig'
import {
    SpeedControl, StepCounter, StatusMessage, ControlButton, Legend,
    CodeBlock, PageContainer, ExplanationBox, VisualizationContainer,
    ControlsRow, SplitLayout, SplitLeft, SplitRight
} from '../components/ui/shared'

const CODE = `def counting_sort(arr):
    if not arr:
        return arr
    max_val = max(arr)
    count = [0] * (max_val + 1)

    # Count occurrences
    for num in arr:
        count[num] += 1

    # Build sorted array
    sorted_arr = []
    for i in range(len(count)):
        sorted_arr.extend([i] * count[i])
    return sorted_arr`

interface Step {
    inputArray: number[]
    countArray: number[]
    outputArray: number[]
    highlightInput: number   // index in input being counted
    highlightCount: number   // index in count array being incremented
    highlightOutput: number  // index in output being filled
    phase: 'count' | 'build' | 'done'
    message: string
}

const INIT = [4, 2, 7, 1, 3, 7, 2, 5, 1, 6]

export default function CountingSortVisualizer() {
    const [steps, setSteps] = useState<Step[]>([])
    const [currentStep, setCurrentStep] = useState(-1)
    const [sorting, setSorting] = useState(false)
    const [speed, setSpeed] = useState<SpeedKey>('1x')
    const [isPaused, setIsPaused] = useState(false)

    const computeSteps = (): Step[] => {
        const arr = [...INIT]
        const s: Step[] = []
        const maxVal = Math.max(...arr)
        const count = new Array(maxVal + 1).fill(0)
        const output: number[] = []

        // Initial state
        s.push({
            inputArray: [...arr], countArray: [...count], outputArray: [],
            highlightInput: -1, highlightCount: -1, highlightOutput: -1,
            phase: 'count',
            message: `Starting Counting Sort — max value is ${maxVal}, creating count array of size ${maxVal + 1}`
        })

        // Counting phase
        for (let i = 0; i < arr.length; i++) {
            count[arr[i]]++
            s.push({
                inputArray: [...arr], countArray: [...count], outputArray: [],
                highlightInput: i, highlightCount: arr[i], highlightOutput: -1,
                phase: 'count',
                message: `Counting ${arr[i]} → count[${arr[i]}] = ${count[arr[i]]}`
            })
        }

        s.push({
            inputArray: [...arr], countArray: [...count], outputArray: [],
            highlightInput: -1, highlightCount: -1, highlightOutput: -1,
            phase: 'count',
            message: 'Counting complete — now building sorted output'
        })

        // Build phase
        for (let i = 0; i <= maxVal; i++) {
            for (let j = 0; j < count[i]; j++) {
                output.push(i)
                s.push({
                    inputArray: [...arr], countArray: [...count], outputArray: [...output],
                    highlightInput: -1, highlightCount: i, highlightOutput: output.length - 1,
                    phase: 'build',
                    message: `Placing ${i} at output position ${output.length - 1}`
                })
            }
        }

        s.push({
            inputArray: [...arr], countArray: [...count], outputArray: [...output],
            highlightInput: -1, highlightCount: -1, highlightOutput: -1,
            phase: 'done',
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
        inputArray: INIT, countArray: [] as number[], outputArray: [] as number[],
        highlightInput: -1, highlightCount: -1, highlightOutput: -1,
        phase: 'done' as const, message: ''
    }

    const maxInputVal = Math.max(...INIT)
    const maxCountVal = Math.max(1, ...(step.countArray.length ? step.countArray : [1]))
    const isFinal = steps.length > 0 && currentStep === steps.length - 1 && !sorting

    return (
        <PageContainer>
            <SplitLayout>
                <SplitLeft>
                    <ExplanationBox>
                        <h3 className="font-mono text-base font-bold text-[var(--fg)] mb-3">What is Counting Sort?</h3>
                        <p className="text-[var(--fg-muted)] text-sm leading-relaxed">
                            Counting Sort is a <strong>non-comparison</strong> sorting algorithm. Instead of comparing elements,
                            it counts how many times each value appears, then reconstructs the sorted array from the counts.
                        </p>
                        <h4 className="font-mono text-sm font-bold text-[var(--fg)] mt-4 mb-2">How It Works</h4>
                        <ol className="pl-5 text-sm text-[var(--fg-muted)] leading-relaxed space-y-1">
                            <li>Find the maximum value to determine count array size</li>
                            <li>Count occurrences of each value in the input</li>
                            <li>Walk through the count array, placing each value the right number of times</li>
                        </ol>
                        <div className="mt-4 pt-3 border-t border-[var(--border)] text-xs text-[var(--fg-muted)] space-y-0.5">
                            <p><strong>Time:</strong> O(n + k) where k = max value</p>
                            <p><strong>Space:</strong> O(n + k) | <strong>Stable:</strong> Yes</p>
                            <p><strong>Note:</strong> Only works with non-negative integers</p>
                        </div>
                    </ExplanationBox>
                    <CodeBlock code={CODE} />
                </SplitLeft>
                <SplitRight>
                    <VisualizationContainer>
                        {sorting && (
                            <div className="font-mono text-xs font-semibold uppercase tracking-wider text-[var(--fg-muted)] mb-4 px-3 py-1.5 bg-[var(--surface)] border border-[var(--border)] inline-block">
                                Phase: {step.phase === 'count' ? 'Counting' : step.phase === 'build' ? 'Building Output' : 'Done'}
                            </div>
                        )}
                        <AnimatePresence mode="wait">
                            {currentStep >= 0 && step.message && (
                                <StatusMessage
                                    key={currentStep}
                                    message={step.message}
                                    type={step.phase === 'done' ? 'success' : step.phase === 'count' ? 'compare' : 'swap'}
                                />
                            )}
                        </AnimatePresence>

                        {/* Input Array */}
                        <div className="mb-2">
                            <span className="font-mono text-[10px] font-bold uppercase tracking-widest text-[var(--fg-muted)]">Input Array</span>
                        </div>
                        <div className="flex justify-center items-end gap-1 h-[140px] pb-2">
                            {step.inputArray.map((v, i) => (
                                <motion.div
                                    key={`in-${i}`} layout
                                    animate={{
                                        height: (v / maxInputVal) * 90 + 30,
                                        backgroundColor: i === step.highlightInput ? 'var(--color-comparing)' : 'var(--el-default)',
                                        scale: i === step.highlightInput ? 1.06 : 1,
                                    }}
                                    transition={SPRING.bouncy}
                                    className="w-[36px] rounded-t-sm flex flex-col items-center justify-end pb-1.5 font-mono font-bold text-[13px] border border-[var(--border-subtle)]"
                                    style={{ color: i === step.highlightInput ? '#fff' : 'var(--fg)' }}
                                >
                                    {v}
                                </motion.div>
                            ))}
                        </div>

                        {/* Count Array */}
                        {step.countArray.length > 0 && (
                            <>
                                <div className="mb-2 mt-3">
                                    <span className="font-mono text-[10px] font-bold uppercase tracking-widest text-[var(--fg-muted)]">Count Array</span>
                                </div>
                                <div className="flex justify-center items-end gap-1 h-[100px] pb-2">
                                    {step.countArray.map((v, i) => (
                                        <motion.div
                                            key={`cnt-${i}`} layout
                                            animate={{
                                                height: Math.max(28, (v / maxCountVal) * 60 + 28),
                                                backgroundColor: i === step.highlightCount ? 'var(--color-active)' : 'var(--el-default)',
                                                scale: i === step.highlightCount ? 1.06 : 1,
                                            }}
                                            transition={SPRING.bouncy}
                                            className="w-[36px] rounded-t-sm flex flex-col items-center justify-end pb-1 font-mono font-bold text-[12px] border border-[var(--border-subtle)]"
                                            style={{ color: i === step.highlightCount ? '#fff' : 'var(--fg)' }}
                                        >
                                            <span className="text-[11px]">{v}</span>
                                            <span className="text-[9px] opacity-50 mt-0.5">{i}</span>
                                        </motion.div>
                                    ))}
                                </div>
                            </>
                        )}

                        {/* Output Array */}
                        {step.outputArray.length > 0 && (
                            <>
                                <div className="mb-2 mt-3">
                                    <span className="font-mono text-[10px] font-bold uppercase tracking-widest text-[var(--fg-muted)]">Sorted Output</span>
                                </div>
                                <div className="flex justify-center items-end gap-1 h-[140px] pb-2">
                                    {step.outputArray.map((v, i) => (
                                        <motion.div
                                            key={`out-${i}`}
                                            initial={{ opacity: 0, y: 20, scale: 0.8 }}
                                            animate={{
                                                opacity: 1, y: 0, scale: 1,
                                                height: (v / maxInputVal) * 90 + 30,
                                                backgroundColor: i === step.highlightOutput ? 'var(--color-swapping)' : 'var(--color-sorted)',
                                            }}
                                            transition={SPRING.bouncy}
                                            className="w-[36px] rounded-t-sm flex flex-col items-center justify-end pb-1.5 font-mono font-bold text-[13px] border border-[var(--border-subtle)]"
                                            style={{ color: '#fff' }}
                                        >
                                            {v}
                                        </motion.div>
                                    ))}
                                </div>
                            </>
                        )}

                        <Legend items={[
                            { color: 'var(--color-comparing)', label: 'Reading Input' },
                            { color: 'var(--color-active)', label: 'Updating Count' },
                            { color: 'var(--color-swapping)', label: 'Placing Output' },
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
                                    Done — sorted in O(n + k) without any comparisons!
                                </motion.div>
                            )}
                        </AnimatePresence>
                    </VisualizationContainer>
                </SplitRight>
            </SplitLayout>
        </PageContainer>
    )
}
