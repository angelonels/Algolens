import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { SPEED_PRESETS, SPRING, EASE_OUT, type SpeedKey } from '../utils/animationConfig'
import {
    SpeedControl, StepCounter, StatusMessage, ControlButton, Legend,
    CodeBlock, PageContainer, ExplanationBox, VisualizationContainer,
    ControlsRow, SplitLayout, SplitLeft, SplitRight
} from '../components/ui/shared'
import { RADIX_SORT_CODE } from '../data/algorithmCodes'


// Bucket colors — ten distinct hues for digits 0–9
const BUCKET_COLORS = [
    '#2563eb', '#e63312', '#16a34a', '#d97706', '#7c3aed',
    '#0891b2', '#ea580c', '#db2777', '#65a30d', '#6366f1',
]

interface Step {
    array: number[]
    buckets: number[][]    // 10 buckets holding values
    digitPlace: number     // 1, 10, 100…
    digitLabel: string     // "ones", "tens", "hundreds"
    highlightIdx: number   // array index being processed
    highlightDigit: number // which digit (0–9)
    phase: 'distribute' | 'collect' | 'done'
    message: string
}

const INIT = [170, 45, 75, 90, 802, 24, 2, 66]

function getDigitLabel(exp: number): string {
    if (exp === 1) return 'ones'
    if (exp === 10) return 'tens'
    if (exp === 100) return 'hundreds'
    if (exp === 1000) return 'thousands'
    return `10^${Math.log10(exp)}`
}

export default function RadixSortVisualizer() {
    const [steps, setSteps] = useState<Step[]>([])
    const [currentStep, setCurrentStep] = useState(-1)
    const [sorting, setSorting] = useState(false)
    const [speed, setSpeed] = useState<SpeedKey>('1x')
    const [isPaused, setIsPaused] = useState(false)

    const computeSteps = (): Step[] => {
        const arr = [...INIT]
        const s: Step[] = []
        const maxVal = Math.max(...arr)

        s.push({
            array: [...arr], buckets: Array.from({ length: 10 }, () => []),
            digitPlace: 1, digitLabel: 'ones', highlightIdx: -1, highlightDigit: -1,
            phase: 'distribute',
            message: `Starting Radix Sort — max value is ${maxVal} (${String(maxVal).length} digits)`
        })

        let exp = 1
        while (Math.floor(maxVal / exp) > 0) {
            const buckets: number[][] = Array.from({ length: 10 }, () => [])
            const label = getDigitLabel(exp)

            // Distribute into buckets
            for (let i = 0; i < arr.length; i++) {
                const digit = Math.floor(arr[i] / exp) % 10
                buckets[digit].push(arr[i])
                s.push({
                    array: [...arr], buckets: buckets.map(b => [...b]),
                    digitPlace: exp, digitLabel: label,
                    highlightIdx: i, highlightDigit: digit,
                    phase: 'distribute',
                    message: `${arr[i]} → ${label} digit is ${digit} → bucket ${digit}`
                })
            }

            // Collect from buckets
            let idx = 0
            for (let d = 0; d < 10; d++) {
                for (const val of buckets[d]) {
                    arr[idx] = val
                    idx++
                }
            }

            s.push({
                array: [...arr], buckets: buckets.map(b => [...b]),
                digitPlace: exp, digitLabel: label,
                highlightIdx: -1, highlightDigit: -1,
                phase: 'collect',
                message: `Collected from buckets by ${label} digit → [${arr.join(', ')}]`
            })

            exp *= 10
        }

        s.push({
            array: [...arr], buckets: Array.from({ length: 10 }, () => []),
            digitPlace: 0, digitLabel: '', highlightIdx: -1, highlightDigit: -1,
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
        array: INIT, buckets: Array.from({ length: 10 }, () => []) as number[][],
        digitPlace: 0, digitLabel: '', highlightIdx: -1, highlightDigit: -1,
        phase: 'done' as const, message: ''
    }

    const maxVal = Math.max(...INIT)
    const isFinal = steps.length > 0 && currentStep === steps.length - 1 && !sorting

    return (
        <PageContainer title="Radix Sort">
            <SplitLayout>
                <SplitLeft>
                    <ExplanationBox>
                        <h3 className="font-mono text-base font-bold text-[var(--fg)] mb-3">What is Radix Sort?</h3>
                        <p className="text-[var(--fg-muted)] text-sm leading-relaxed">
                            Radix Sort processes digits from least significant to most significant.
                            At each digit place, it distributes values into 10 buckets (0–9), then collects them back in order.
                        </p>
                        <h4 className="font-mono text-sm font-bold text-[var(--fg)] mt-4 mb-2">How It Works</h4>
                        <ol className="pl-5 text-sm text-[var(--fg-muted)] leading-relaxed space-y-1">
                            <li>Start with the least significant digit (ones place)</li>
                            <li>Place each element into a bucket based on its current digit</li>
                            <li>Collect elements from buckets 0 through 9</li>
                            <li>Repeat for the next digit place until all digits are processed</li>
                        </ol>
                        <div className="mt-4 pt-3 border-t border-[var(--border)] text-xs text-[var(--fg-muted)] space-y-0.5">
                            <p><strong>Time:</strong> O(d × (n + k)) where d = digits, k = base</p>
                            <p><strong>Space:</strong> O(n + k) | <strong>Stable:</strong> Yes</p>
                            <p><strong>Note:</strong> Non-comparison sort, works with integers</p>
                        </div>
                    </ExplanationBox>
                    <CodeBlock codes={RADIX_SORT_CODE} />
                </SplitLeft>
                <SplitRight>
                    <VisualizationContainer>
                        {sorting && step.digitLabel && (
                            <div className="font-mono text-xs font-semibold uppercase tracking-wider text-[var(--fg-muted)] mb-4 px-3 py-1.5 bg-[var(--surface)] border border-[var(--border)] inline-block">
                                Digit Place: {step.digitLabel}
                            </div>
                        )}
                        <AnimatePresence mode="wait">
                            {currentStep >= 0 && step.message && (
                                <StatusMessage
                                    key={currentStep}
                                    message={step.message}
                                    type={step.phase === 'done' ? 'success' : step.phase === 'collect' ? 'swap' : 'compare'}
                                />
                            )}
                        </AnimatePresence>

                        {/* Current Array */}
                        <div className="mb-2">
                            <span className="font-mono text-[10px] font-bold uppercase tracking-widest text-[var(--fg-muted)]">Array</span>
                        </div>
                        <div className="flex justify-center items-end gap-1.5 h-[160px] pb-2">
                            {step.array.map((v, i) => {
                                const digit = step.digitPlace > 0 ? Math.floor(v / step.digitPlace) % 10 : -1
                                const isHighlight = i === step.highlightIdx
                                return (
                                    <motion.div
                                        key={`arr-${i}`} layout
                                        animate={{
                                            height: (v / maxVal) * 110 + 30,
                                            backgroundColor: isHighlight ? BUCKET_COLORS[digit] ?? 'var(--color-comparing)' : step.phase === 'done' ? 'var(--color-sorted)' : 'var(--el-default)',
                                            scale: isHighlight ? 1.06 : 1,
                                        }}
                                        transition={SPRING.bouncy}
                                        className="w-[48px] rounded-t-sm flex flex-col items-center justify-end pb-1.5 font-mono font-bold text-[13px] border border-[var(--border-subtle)]"
                                        style={{ color: isHighlight || step.phase === 'done' ? '#fff' : 'var(--fg)' }}
                                    >
                                        {v}
                                    </motion.div>
                                )
                            })}
                        </div>

                        {/* Buckets */}
                        {step.buckets.some(b => b.length > 0) && (
                            <>
                                <div className="mb-2 mt-4">
                                    <span className="font-mono text-[10px] font-bold uppercase tracking-widest text-[var(--fg-muted)]">Buckets (0–9)</span>
                                </div>
                                <div className="flex justify-center gap-1 flex-wrap">
                                    {step.buckets.map((bucket, d) => (
                                        <div
                                            key={`bucket-${d}`}
                                            className="flex flex-col items-center min-w-[44px]"
                                        >
                                            <div
                                                className="w-full min-h-[32px] border border-[var(--border)] rounded-sm px-1 py-1 flex flex-col items-center gap-0.5 transition-colors"
                                                style={{
                                                    borderColor: d === step.highlightDigit ? BUCKET_COLORS[d] : 'var(--border)',
                                                    backgroundColor: d === step.highlightDigit ? `${BUCKET_COLORS[d]}15` : 'var(--surface)',
                                                }}
                                            >
                                                {bucket.map((v, bi) => (
                                                    <motion.span
                                                        key={`b${d}-${bi}`}
                                                        initial={{ opacity: 0, scale: 0.8 }}
                                                        animate={{ opacity: 1, scale: 1 }}
                                                        className="font-mono text-[11px] font-bold px-1"
                                                        style={{ color: BUCKET_COLORS[d] }}
                                                    >
                                                        {v}
                                                    </motion.span>
                                                ))}
                                            </div>
                                            <span className="font-mono text-[10px] font-bold mt-1" style={{ color: BUCKET_COLORS[d] }}>{d}</span>
                                        </div>
                                    ))}
                                </div>
                            </>
                        )}

                        <div className="mt-4">
                            <Legend items={[
                                { color: 'var(--color-comparing)', label: 'Processing' },
                                { color: 'var(--color-sorted)', label: 'Sorted' },
                            ]} />
                        </div>

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
                                    Done — sorted digit by digit in O(d × n) time!
                                </motion.div>
                            )}
                        </AnimatePresence>
                    </VisualizationContainer>
                </SplitRight>
            </SplitLayout>
        </PageContainer>
    )
}
