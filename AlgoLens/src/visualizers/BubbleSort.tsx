import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { SPEED_PRESETS, SPRING, EASE_OUT, type SpeedKey } from '../utils/animationConfig'
import {
  SpeedControl, StepCounter, StatusMessage, ControlButton, Legend,
  CodeBlock, PageContainer, ExplanationBox, VisualizationContainer,
  ControlsRow, SplitLayout, SplitLeft, SplitRight
} from '../components/ui/shared'

const CODE = `def bubble_sort(arr):
    n = len(arr)
    for i in range(n):
        for j in range(0, n - i - 1):
            if arr[j] > arr[j + 1]:
                arr[j], arr[j + 1] = arr[j + 1], arr[j]
    return arr`

interface Step {
  array: number[]
  compare: number[]
  swap: boolean
  swapping: boolean
  sortedCount: number
  pass: number
  message: string
}

const INIT = [64, 34, 25, 12, 22, 11, 90, 45]

export default function BubbleSortVisualizer() {
  const [steps, setSteps] = useState<Step[]>([])
  const [currentStep, setCurrentStep] = useState(-1)
  const [sorting, setSorting] = useState(false)
  const [speed, setSpeed] = useState<SpeedKey>('1x')
  const [isPaused, setIsPaused] = useState(false)

  const computeSteps = (): Step[] => {
    const arr = [...INIT]
    const s: Step[] = []
    const n = arr.length

    for (let i = 0; i < n; i++) {
      for (let j = 0; j < n - i - 1; j++) {
        const isSwap = arr[j] > arr[j + 1]
        s.push({ array: [...arr], compare: [j, j + 1], swap: false, swapping: isSwap, sortedCount: i, pass: i + 1, message: `Comparing ${arr[j]} and ${arr[j + 1]}${isSwap ? ' → swap' : ' → no swap'}` })
        if (isSwap) {
          [arr[j], arr[j + 1]] = [arr[j + 1], arr[j]]
          s.push({ array: [...arr], compare: [j, j + 1], swap: true, swapping: false, sortedCount: i, pass: i + 1, message: `Swapped ${arr[j + 1]} ↔ ${arr[j]}` })
        }
      }
    }
    s.push({ array: [...arr], compare: [], swap: false, swapping: false, sortedCount: n, pass: n, message: 'Array is sorted' })
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

  const step = steps[currentStep] ?? { array: INIT, compare: [] as number[], swap: false, swapping: false, sortedCount: 0, pass: 0, message: '' }
  const maxVal = Math.max(...INIT)

  const getColor = (i: number) => {
    const isSorted = i >= step.array.length - step.sortedCount
    if (isSorted) return 'var(--color-sorted)'
    if (step.compare.includes(i)) {
      if (step.swap) return 'var(--color-active)'
      if (step.swapping) return 'var(--color-swapping)'
      return 'var(--color-comparing)'
    }
    return 'var(--el-default)'
  }

  const isFinal = currentStep === steps.length - 1 && !sorting

  return (
    <PageContainer>
      <SplitLayout>
        <SplitLeft>
          <ExplanationBox>
            <h3 className="font-mono text-base font-bold text-[var(--fg)] mb-3">What is Bubble Sort?</h3>
            <p className="text-[var(--fg-muted)] text-sm leading-relaxed">
              Bubble Sort repeatedly steps through the list, compares adjacent pairs, and swaps them if needed.
              Smaller elements "bubble" to the front, larger ones sink to the end.
            </p>
            <h4 className="font-mono text-sm font-bold text-[var(--fg)] mt-4 mb-2">How It Works</h4>
            <ol className="pl-5 text-sm text-[var(--fg-muted)] leading-relaxed space-y-1">
              <li>Compare each pair of adjacent elements</li>
              <li>Swap if left is greater than right</li>
              <li>Repeat — each pass places the next largest element in position</li>
              <li>Stop when a full pass completes with no swaps</li>
            </ol>
            <div className="mt-4 pt-3 border-t border-[var(--border)] text-xs text-[var(--fg-muted)] space-y-0.5">
              <p><strong>Time:</strong> O(n²) average/worst | O(n) best</p>
              <p><strong>Space:</strong> O(1) | <strong>Stable:</strong> Yes</p>
            </div>
          </ExplanationBox>
          <CodeBlock code={CODE} />
        </SplitLeft>
        <SplitRight>
          <VisualizationContainer>
            {sorting && (
              <div className="font-mono text-xs font-semibold uppercase tracking-wider text-[var(--fg-muted)] mb-4 px-3 py-1.5 bg-[var(--surface)] border border-[var(--border)] inline-block">
                Pass {step.pass} / {INIT.length}
              </div>
            )}
            <AnimatePresence mode="wait">
              {currentStep >= 0 && step.message && (
                <StatusMessage key={currentStep} message={step.message} type={step.swap ? 'swap' : step.swapping ? 'warning' : isFinal ? 'success' : 'compare'} />
              )}
            </AnimatePresence>

            <div className="flex justify-center items-end gap-1.5 h-[280px] py-5">
              {step.array.map((v, i) => (
                <motion.div
                  key={i} layout
                  animate={{ height: (v / maxVal) * 200 + 40, backgroundColor: getColor(i), scale: step.compare.includes(i) ? 1.04 : 1, y: step.swapping && step.compare.includes(i) ? -10 : 0 }}
                  transition={{ ...SPRING.bouncy, layout: { type: 'spring', stiffness: 500, damping: 30 } }}
                  className="w-[52px] rounded-t-sm flex flex-col items-center justify-end pb-2 font-mono font-bold text-[15px] border border-black/10"
                  style={{ color: step.compare.includes(i) ? '#fff' : 'var(--fg)' }}
                >
                  {v}
                </motion.div>
              ))}
            </div>

            <Legend items={[
              { color: 'var(--color-comparing)', label: 'Comparing' },
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
                  Done — sorted in {step.pass} passes
                </motion.div>
              )}
            </AnimatePresence>
          </VisualizationContainer>
        </SplitRight>
      </SplitLayout>
    </PageContainer>
  )
}
