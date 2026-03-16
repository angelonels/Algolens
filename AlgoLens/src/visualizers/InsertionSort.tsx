import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { SPEED_PRESETS, SPRING, EASE_OUT, type SpeedKey } from '../utils/animationConfig'
import {
  SpeedControl, StepCounter, StatusMessage, ControlButton, Legend,
  CodeBlock, PageContainer, ExplanationBox, VisualizationContainer,
  ControlsRow, SplitLayout, SplitLeft, SplitRight
} from '../components/ui/shared'
import { INSERTION_SORT_CODE } from '../data/algorithmCodes'


interface Step {
  snapshot: number[]
  keyIndex: number
  keyValue: number | null
  phase: string
  insertedIndex: number
  comparingIndex: number
  shiftIndex?: number
  sortedCount: number
  message: string
}

const INIT = [64, 25, 12, 22, 11, 45, 34]

export default function InsertionSortVisualizer() {
  const [steps, setSteps] = useState<Step[]>([])
  const [currentStep, setCurrentStep] = useState(-1)
  const [sorting, setSorting] = useState(false)
  const [speed, setSpeed] = useState<SpeedKey>('1x')
  const [isPaused, setIsPaused] = useState(false)

  const computeSteps = (): Step[] => {
    const arr = [...INIT]; const s: Step[] = []
    for (let i = 1; i < arr.length; i++) {
      const key = arr[i]; let j = i - 1
      s.push({ snapshot: [...arr], keyIndex: i, keyValue: key, phase: 'extract', insertedIndex: -1, comparingIndex: -1, sortedCount: i, message: `Extracting key: ${key} from index ${i}` })
      while (j >= 0 && arr[j] > key) {
        s.push({ snapshot: [...arr], keyIndex: i, keyValue: key, phase: 'compare', insertedIndex: -1, comparingIndex: j, shiftIndex: j + 1, sortedCount: i, message: `${arr[j]} > ${key} → shifting right` })
        arr[j + 1] = arr[j]; j--
        s.push({ snapshot: [...arr], keyIndex: i, keyValue: key, phase: 'shift', insertedIndex: -1, comparingIndex: j, sortedCount: i, message: `Shifted. Looking at position ${j >= 0 ? j : 'start'}` })
      }
      arr[j + 1] = key
      s.push({ snapshot: [...arr], keyIndex: -1, keyValue: key, phase: 'insert', insertedIndex: j + 1, comparingIndex: -1, sortedCount: i + 1, message: `Inserted ${key} at position ${j + 1}` })
    }
    s.push({ snapshot: [...arr], keyIndex: -1, keyValue: null, phase: 'done', insertedIndex: -1, comparingIndex: -1, sortedCount: arr.length, message: 'Array is sorted' })
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

  const step = steps[currentStep] ?? { snapshot: INIT, keyIndex: -1, keyValue: null, phase: 'idle', insertedIndex: -1, comparingIndex: -1, sortedCount: 0, message: '' } as Step
  const maxVal = Math.max(...INIT)

  const getColor = (i: number) => {
    if (step.phase === 'done') return 'var(--color-sorted)'
    if (step.insertedIndex === i) return 'var(--color-found)'
    if (step.keyIndex === i) return 'var(--color-active)'
    if (step.comparingIndex === i) return 'var(--color-comparing)'
    if (step.shiftIndex === i) return 'var(--color-pivot)'
    if (i < step.sortedCount) return '#86efac'
    return 'var(--el-default)'
  }

  const getScale = (i: number) => (step.keyIndex === i || step.insertedIndex === i) ? 1.06 : 1
  const getY = (i: number) => step.keyIndex === i ? -24 : step.shiftIndex === i ? -8 : 0
  const isFinal = steps.length > 0 && currentStep === steps.length - 1 && !sorting

  return (
    <PageContainer>
      <SplitLayout>
        <SplitLeft>
          <ExplanationBox>
            <h3 className="font-mono text-base font-bold text-[var(--fg)] mb-3">What is Insertion Sort?</h3>
            <p className="text-[var(--fg-muted)] text-sm leading-relaxed">
              Insertion Sort builds the sorted array one element at a time — like sorting playing cards in your hand.
              Extract each element, slide it left until it finds its correct position.
            </p>
            <h4 className="font-mono text-sm font-bold text-[var(--fg)] mt-4 mb-2">How It Works</h4>
            <ol className="pl-5 text-sm text-[var(--fg-muted)] leading-relaxed space-y-1">
              <li>Take the next unsorted element as the "key"</li>
              <li>Compare with sorted elements right to left</li>
              <li>Shift larger elements right to make room</li>
              <li>Insert the key in the correct position</li>
            </ol>
            <div className="mt-4 pt-3 border-t border-[var(--border)] text-xs text-[var(--fg-muted)] space-y-0.5">
              <p><strong>Time:</strong> O(n²) average/worst | O(n) best</p>
              <p><strong>Space:</strong> O(1) | <strong>Stable:</strong> Yes | <strong>Adaptive:</strong> Yes</p>
            </div>
          </ExplanationBox>
          <CodeBlock codes={INSERTION_SORT_CODE} />
        </SplitLeft>
        <SplitRight>
          <VisualizationContainer>
            <AnimatePresence>
              {step.keyValue != null && step.phase !== 'done' && (
                <motion.div initial={{ opacity: 0, y: -12 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -12 }}
                  className="mb-4 px-4 py-2 bg-[var(--surface)] border border-[var(--color-active)] border-l-[3px] font-mono font-bold text-sm text-[var(--fg)] inline-block"
                >
                  Key: {step.keyValue}
                </motion.div>
              )}
            </AnimatePresence>

            <AnimatePresence mode="wait">
              {currentStep >= 0 && step.message && (
                <StatusMessage key={currentStep} message={step.message} type={step.phase === 'insert' ? 'success' : step.phase === 'shift' ? 'warning' : 'info'} />
              )}
            </AnimatePresence>

            <div className="flex justify-center items-end gap-1.5 h-[280px] py-5">
              {step.snapshot.map((v, i) => (
                <motion.div
                  key={i} layout
                  animate={{ height: (v / maxVal) * 200 + 40, backgroundColor: getColor(i), scale: getScale(i), y: getY(i) }}
                  transition={{ ...SPRING.bouncy, layout: { type: 'spring', stiffness: 500, damping: 30 } }}
                  className="w-14 rounded-t-sm flex flex-col items-center justify-end pb-2 font-mono font-bold text-base border border-[var(--border-subtle)]"
                  style={{ color: [step.keyIndex, step.comparingIndex, step.shiftIndex].includes(i) ? '#fff' : 'var(--fg)' }}
                >
                  {v}
                  <span className="text-[9px] opacity-50 mt-0.5">{i}</span>
                </motion.div>
              ))}
            </div>

            <Legend items={[
              { color: 'var(--color-active)', label: 'Key' },
              { color: 'var(--color-comparing)', label: 'Comparing' },
              { color: 'var(--color-pivot)', label: 'Shifting' },
              { color: 'var(--color-found)', label: 'Inserted' },
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
                  Done — array sorted successfully
                </motion.div>
              )}
            </AnimatePresence>
          </VisualizationContainer>
        </SplitRight>
      </SplitLayout>
    </PageContainer>
  )
}
