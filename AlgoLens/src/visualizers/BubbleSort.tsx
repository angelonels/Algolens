import { motion, AnimatePresence } from 'framer-motion'
import { SPRING, EASE_OUT } from '../utils/animationConfig'
import {
  SpeedControl, StepCounter, StatusMessage, ControlButton, Legend,
  CodeBlock, PageContainer, ExplanationBox, VisualizationContainer,
  ControlsRow, SplitLayout, SplitLeft, SplitRight
} from '../components/ui/shared'
import { BUBBLE_SORT_CODE } from '../data/algorithmCodes'
import { computeBubbleSortSteps, type BubbleSortStep } from '../algorithms/bubbleSort'
import { useAlgorithmPlayback } from '../hooks/useAlgorithmPlayback'


const INIT = [64, 34, 25, 12, 22, 11, 90, 45]

export default function BubbleSortVisualizer() {
  const [{ steps, currentStep, isRunning, isPaused, speed, isFinalStep }, { start, reset, togglePause, setSpeed }] = useAlgorithmPlayback<BubbleSortStep>()

  const startSort = () => start(computeBubbleSortSteps(INIT))

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

  return (
    <PageContainer title="Bubble Sort">
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
          <CodeBlock codes={BUBBLE_SORT_CODE} />
        </SplitLeft>
        <SplitRight>
          <VisualizationContainer>
            {isRunning && (
              <div className="font-mono text-xs font-semibold uppercase tracking-wider text-[var(--fg-muted)] mb-4 px-3 py-1.5 bg-[var(--surface)] border border-[var(--border)] inline-block">
                Pass {step.pass} / {INIT.length}
              </div>
            )}
            <AnimatePresence mode="wait">
              {currentStep >= 0 && step.message && (
                <StatusMessage key={currentStep} message={step.message} type={step.swap ? 'swap' : step.swapping ? 'warning' : isFinalStep ? 'success' : 'compare'} />
              )}
            </AnimatePresence>

            <div className="flex justify-center items-end gap-1.5 h-[280px] py-5">
              {step.array.map((v, i) => (
                <motion.div
                  key={i} layout
                  animate={{ height: (v / maxVal) * 200 + 40, backgroundColor: getColor(i), scale: step.compare.includes(i) ? 1.04 : 1, y: step.swapping && step.compare.includes(i) ? -10 : 0 }}
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
              { color: 'var(--color-sorted)', label: 'Sorted' },
            ]} />

            <ControlsRow>
              <SpeedControl speed={speed} onSpeedChange={setSpeed} />
              {isRunning && <StepCounter current={currentStep + 1} total={steps.length} />}
              <ControlButton onClick={startSort} disabled={isRunning && !isPaused}>{isRunning ? 'Sorting…' : 'Start Sort'}</ControlButton>
              {isRunning && <ControlButton onClick={togglePause} variant="success">{isPaused ? 'Resume' : 'Pause'}</ControlButton>}
              <ControlButton onClick={reset} variant="danger">Reset</ControlButton>
            </ControlsRow>

            <AnimatePresence>
              {isFinalStep && (
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
