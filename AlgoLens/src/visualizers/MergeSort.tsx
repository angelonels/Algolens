import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { SPEED_PRESETS, SPRING, EASE_OUT, type SpeedKey } from '../utils/animationConfig'
import {
  SpeedControl, StepCounter, StatusMessage, ControlButton, Legend,
  CodeBlock, PageContainer, ExplanationBox, VisualizationContainer,
  ControlsRow, SplitLayout, SplitLeft, SplitRight
} from '../components/ui/shared'

const CODE = `def merge_sort(arr):
    if len(arr) <= 1: return arr
    mid = len(arr) // 2
    left = merge_sort(arr[:mid])
    right = merge_sort(arr[mid:])
    return merge(left, right)

def merge(left, right):
    result, i, j = [], 0, 0
    while i < len(left) and j < len(right):
        if left[i] <= right[j]:
            result.append(left[i]); i += 1
        else:
            result.append(right[j]); j += 1
    result.extend(left[i:])
    result.extend(right[j:])
    return result`

interface Step {
  snapshot: number[]
  phase: string
  range: [number, number] | null
  leftRange?: [number, number] | null
  rightRange?: [number, number] | null
  splitPoint?: number
  depth: number
  message: string
}

const INIT = [38, 27, 43, 3, 9, 82, 10, 45]

export default function MergeSortVisualizer() {
  const [steps, setSteps] = useState<Step[]>([])
  const [currentStep, setCurrentStep] = useState(-1)
  const [sorting, setSorting] = useState(false)
  const [speed, setSpeed] = useState<SpeedKey>('1x')
  const [isPaused, setIsPaused] = useState(false)

  const computeSteps = (): Step[] => {
    const arr = [...INIT]; const s: Step[] = []; const aux = arr.slice()

    const merge = (l: number, m: number, r: number, depth: number) => {
      s.push({ snapshot: arr.slice(), phase: 'merge-start', range: [l, r], leftRange: [l, m], rightRange: [m + 1, r], depth, message: `Merging [${l}–${m}] and [${m + 1}–${r}]` })
      let i = l, j = m + 1, k = l
      while (i <= m && j <= r) { if (aux[i] <= aux[j]) arr[k++] = aux[i++]; else arr[k++] = aux[j++] }
      while (i <= m) arr[k++] = aux[i++]
      while (j <= r) arr[k++] = aux[j++]
      for (let x = l; x <= r; x++) aux[x] = arr[x]
      s.push({ snapshot: arr.slice(), phase: 'merge-done', range: [l, r], leftRange: null, rightRange: null, depth, message: `Merged: [${arr.slice(l, r + 1).join(', ')}]` })
    }

    const sort = (l: number, r: number, depth = 0) => {
      if (l >= r) return
      const m = Math.floor((l + r) / 2)
      s.push({ snapshot: arr.slice(), phase: 'split', range: [l, r], splitPoint: m, depth, message: `Splitting [${l}–${r}] at mid=${m}` })
      sort(l, m, depth + 1); sort(m + 1, r, depth + 1); merge(l, m, r, depth)
    }

    sort(0, arr.length - 1)
    s.push({ snapshot: arr.slice(), phase: 'done', range: null, depth: 0, message: 'Array is sorted' })
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

  const step = steps[currentStep] ?? { snapshot: INIT, phase: 'idle', range: null, depth: 0, message: '' } as Step
  const maxVal = Math.max(...INIT)

  const getColor = (i: number) => {
    if (step.phase === 'done') return 'var(--color-sorted)'
    if (!step.range) return 'var(--el-default)'
    const [l, r] = step.range
    if (i >= l && i <= r) {
      if (step.phase === 'split') return 'var(--color-comparing)'
      if (step.phase === 'merge-start') {
        if (step.leftRange && i >= step.leftRange[0] && i <= step.leftRange[1]) return 'var(--color-comparing)'
        if (step.rightRange && i >= step.rightRange[0] && i <= step.rightRange[1]) return '#ec4899'
      }
      if (step.phase === 'merge-done') return 'var(--color-active)'
    }
    return 'var(--el-default)'
  }

  const isFinal = currentStep === steps.length - 1 && !sorting

  return (
    <PageContainer>
      <SplitLayout>
        <SplitLeft>
          <ExplanationBox>
            <h3 className="font-mono text-base font-bold text-[var(--fg)] mb-3">What is Merge Sort?</h3>
            <p className="text-[var(--fg-muted)] text-sm leading-relaxed">
              A divide-and-conquer algorithm that recursively splits the array in half, sorts each half, then merges them. Guarantees O(n log n) in all cases.
            </p>
            <h4 className="font-mono text-sm font-bold text-[var(--fg)] mt-4 mb-2">How It Works</h4>
            <ol className="pl-5 text-sm text-[var(--fg-muted)] leading-relaxed space-y-1">
              <li><strong>Divide:</strong> Split at the midpoint</li>
              <li><strong>Conquer:</strong> Recursively sort each half</li>
              <li><strong>Merge:</strong> Combine sorted halves by comparing elements</li>
            </ol>
            <div className="mt-4 pt-3 border-t border-[var(--border)] text-xs text-[var(--fg-muted)] space-y-0.5">
              <p><strong>Time:</strong> O(n log n) all cases</p>
              <p><strong>Space:</strong> O(n) | <strong>Stable:</strong> Yes</p>
            </div>
          </ExplanationBox>
          <CodeBlock code={CODE} />
        </SplitLeft>
        <SplitRight>
          <VisualizationContainer>
            {sorting && step.depth !== undefined && (
              <div className="mb-3 px-3 py-1.5 bg-[var(--surface)] border border-[var(--border)] font-mono text-xs font-semibold uppercase tracking-wider text-[var(--fg)] inline-block">
                Depth: {step.depth}
              </div>
            )}
            <AnimatePresence mode="wait">
              {currentStep >= 0 && step.message && (
                <StatusMessage key={currentStep} message={step.message} type={step.phase === 'merge-done' ? 'success' : 'info'} />
              )}
            </AnimatePresence>

            <div className="flex justify-center items-end gap-1 h-[280px] py-5">
              {step.snapshot.map((v, i) => (
                <motion.div
                  key={i} layout
                  animate={{ height: (v / maxVal) * 200 + 40, backgroundColor: getColor(i), scale: step.phase === 'merge-done' && step.range && i >= step.range[0] && i <= step.range[1] ? 1.04 : 1 }}
                  transition={{ ...SPRING.bouncy, layout: { type: 'spring', stiffness: 500, damping: 30 } }}
                  className="w-[52px] rounded-t-sm flex flex-col items-center justify-end pb-2 font-mono font-bold text-[15px] border border-black/10"
                  style={{ color: getColor(i) !== 'var(--el-default)' && step.phase !== 'done' ? '#fff' : 'var(--fg)' }}
                >{v}</motion.div>
              ))}
            </div>

            <Legend items={[
              { color: 'var(--color-comparing)', label: 'Left Half' },
              { color: '#ec4899', label: 'Right Half' },
              { color: 'var(--color-active)', label: 'Merging' },
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
                >Done — sorted with Merge Sort</motion.div>
              )}
            </AnimatePresence>
          </VisualizationContainer>
        </SplitRight>
      </SplitLayout>
    </PageContainer>
  )
}
