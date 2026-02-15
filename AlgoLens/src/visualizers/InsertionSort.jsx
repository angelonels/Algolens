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
  ControlsRow,
  SplitLayout,
  SplitLeft,
  SplitRight
} from '../components/ui/AnimationComponents'

const insertionSortPythonCode = `def insertion_sort(arr):
    for i in range(1, len(arr)):
        key = arr[i]
        j = i - 1
        while j >= 0 and arr[j] > key:
            arr[j + 1] = arr[j]
            j -= 1
        arr[j + 1] = key
    return arr`

export default function InsertionSortVisualizer() {
  const init = [64, 25, 12, 22, 11, 45, 34]
  const [array] = useState(init)
  const [steps, setSteps] = useState([])
  const [currentStep, setCurrentStep] = useState(-1)
  const [sorting, setSorting] = useState(false)
  const [speed, setSpeed] = useState(SPEED_PRESETS.normal)
  const [isPaused, setIsPaused] = useState(false)

  const computeSteps = () => {
    const arr = [...array]
    const s = []

    for (let i = 1; i < arr.length; i++) {
      const key = arr[i]
      let j = i - 1

      s.push({
        snapshot: [...arr],
        keyIndex: i,
        keyValue: key,
        phase: 'extract',
        insertedIndex: -1,
        comparingIndex: -1,
        sortedCount: i,
        message: `Extracting key: ${key} from index ${i}`
      })

      while (j >= 0 && arr[j] > key) {
        s.push({
          snapshot: [...arr],
          keyIndex: i,
          keyValue: key,
          phase: 'compare',
          insertedIndex: -1,
          comparingIndex: j,
          shiftIndex: j + 1,
          sortedCount: i,
          message: `${arr[j]} > ${key} → shifting ${arr[j]} right`
        })

        arr[j + 1] = arr[j]
        j--

        s.push({
          snapshot: [...arr],
          keyIndex: i,
          keyValue: key,
          phase: 'shift',
          insertedIndex: -1,
          comparingIndex: j,
          sortedCount: i,
          message: `Shifted. Looking at position ${j >= 0 ? j : 'start'}`
        })
      }

      arr[j + 1] = key
      s.push({
        snapshot: [...arr],
        keyIndex: -1,
        keyValue: key,
        phase: 'insert',
        insertedIndex: j + 1,
        comparingIndex: -1,
        sortedCount: i + 1,
        message: `Inserted ${key} at position ${j + 1}`
      })
    }

    s.push({
      snapshot: [...arr],
      keyIndex: -1,
      keyValue: null,
      phase: 'done',
      insertedIndex: -1,
      comparingIndex: -1,
      sortedCount: arr.length,
      message: '✓ Array is sorted'
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
    snapshot: array,
    keyIndex: -1,
    keyValue: null,
    phase: 'idle',
    insertedIndex: -1,
    comparingIndex: -1,
    sortedCount: 0,
    message: ''
  }

  const getElementState = (index) => {
    if (step.phase === 'done') return 'sorted'
    if (step.insertedIndex === index) return 'inserted'
    if (step.keyIndex === index) return 'key'
    if (step.comparingIndex === index) return 'comparing'
    if (step.shiftIndex === index) return 'shifting'
    if (index < step.sortedCount) return 'sorted-partial'
    return 'default'
  }

  const legendItems = [
    { color: COLORS.active, label: 'Key' },
    { color: COLORS.comparing, label: 'Comparing' },
    { color: COLORS.pivot, label: 'Shifting' },
    { color: COLORS.found, label: 'Inserted' },
    { color: COLORS.sorted, label: 'Sorted' }
  ]

  const isFinalStep = currentStep === steps.length - 1 && !sorting

  return (
    <PageContainer title="Insertion Sort Visualizer">
      <SplitLayout>
        <SplitLeft>
          <ExplanationBox>
            <h3 style={{ marginBottom: 12, color: COLORS.fg }}>What is Insertion Sort?</h3>
            <p>
              Insertion Sort is an intuitive sorting algorithm that builds the final sorted array one element
              at a time. It works the same way you might sort playing cards in your hand — you pick up each
              new card and slide it into the correct position among the cards you've already sorted.
            </p>
            <p style={{ marginTop: 8 }}>
              At each iteration, the algorithm takes the next unsorted element (called the "key"), compares
              it with the sorted portion from right to left, shifts all larger elements one position to the
              right, and inserts the key into its correct position. Despite its O(n²) worst-case complexity,
              Insertion Sort is remarkably efficient for small or nearly sorted datasets.
            </p>
            <h4 style={{ margin: '16px 0 8px' }}>How It Works</h4>
            <ol style={{ paddingLeft: 20, margin: 0 }}>
              <li>Start from the second element (index 1) — the first element is trivially "sorted"</li>
              <li>"Extract" the current element as the <strong>key</strong></li>
              <li>Compare the key with each element in the sorted portion, moving right to left</li>
              <li>Shift each element that is larger than the key one position to the right to make room</li>
              <li>Insert the key into the gap — this is now its correct sorted position</li>
              <li>Repeat for all remaining elements until the entire array is sorted</li>
            </ol>
            <h4 style={{ margin: '16px 0 8px' }}>Key Characteristics</h4>
            <ul style={{ paddingLeft: 20, margin: 0 }}>
              <li><strong>Stable:</strong> Equal elements preserve their original relative order</li>
              <li><strong>In-place:</strong> Requires only O(1) additional memory</li>
              <li><strong>Adaptive:</strong> Runs in O(n) time on nearly sorted input — very efficient when data arrives in order</li>
              <li><strong>Online:</strong> Can sort a list as it receives new elements, making it suitable for streaming data</li>
            </ul>
            <p style={{ marginTop: 12 }}>
              <strong>Time Complexity:</strong> O(n²) worst and average case | O(n) best case (already sorted)
            </p>
            <p style={{ marginTop: 4 }}>
              <strong>Space Complexity:</strong> O(1) — sorts in place with constant extra memory
            </p>
            <p style={{ marginTop: 12, color: COLORS.fgMuted, fontSize: '0.9em' }}>
              <strong>When to use:</strong> Excellent for small arrays (typically n &lt; 20–50), nearly sorted data,
              or as the base case inside more complex algorithms. Python's Timsort and Java's Arrays.sort()
              both use Insertion Sort for small sub-arrays during their divide-and-conquer phases.
            </p>
          </ExplanationBox>

          <CodeBlock code={insertionSortPythonCode} onCopy={() => { }} />
        </SplitLeft>
        <SplitRight>
          <VisualizationContainer>
            {/* Key Display */}
            <AnimatePresence>
              {step.keyValue !== null && step.phase !== 'done' && (
                <motion.div
                  initial={{ opacity: 0, y: -12 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -12 }}
                  style={{
                    marginBottom: 16,
                    padding: '8px 16px',
                    background: COLORS.surface,
                    border: `1px solid ${COLORS.active}`,
                    borderLeft: `3px solid ${COLORS.active}`,
                    borderRadius: '0px',
                    fontFamily: "'JetBrains Mono', monospace",
                    fontWeight: 700,
                    fontSize: 14,
                    color: COLORS.fg,
                    display: 'inline-block'
                  }}
                >
                  Key: {step.keyValue}
                </motion.div>
              )}
            </AnimatePresence>

            {/* Status Message */}
            <AnimatePresence mode="wait">
              {currentStep >= 0 && step.message && (
                <StatusMessage
                  key={currentStep}
                  message={step.message}
                  type={step.phase === 'insert' ? 'success' : step.phase === 'shift' ? 'warning' : 'info'}
                />
              )}
            </AnimatePresence>

            {/* Array Bar Chart */}
            <div style={{
              display: 'flex',
              justifyContent: 'center',
              alignItems: 'flex-end',
              gap: 6,
              height: 280,
              padding: '20px 0'
            }}>
              {step.snapshot.map((v, i) => {
                const state = getElementState(i)
                const maxVal = Math.max(...array)
                const height = (v / maxVal) * 200 + 40

                const colors = {
                  default: COLORS.default,
                  key: COLORS.active,
                  comparing: COLORS.comparing,
                  shifting: COLORS.pivot,
                  inserted: COLORS.found,
                  sorted: COLORS.sorted,
                  'sorted-partial': '#86efac'
                }

                return (
                  <motion.div
                    key={i}
                    layout
                    animate={{
                      height,
                      backgroundColor: colors[state] || colors.default,
                      scale: state === 'key' || state === 'inserted' ? 1.06 : 1,
                      y: state === 'key' ? -24 : state === 'shifting' ? -8 : 0
                    }}
                    transition={{
                      ...SPRING.bouncy,
                      layout: { type: 'spring', stiffness: 500, damping: 30 }
                    }}
                    style={{
                      width: 56,
                      borderRadius: '2px 2px 0 0',
                      display: 'flex',
                      flexDirection: 'column',
                      alignItems: 'center',
                      justifyContent: 'flex-end',
                      paddingBottom: 8,
                      fontFamily: "'JetBrains Mono', monospace",
                      fontWeight: 700,
                      fontSize: 16,
                      color: (state === 'key' || state === 'comparing' || state === 'shifting') ? '#fff' : COLORS.fg,
                      border: '1px solid rgba(0,0,0,0.08)'
                    }}
                  >
                    {v}
                    <span style={{ fontSize: 9, opacity: 0.5, marginTop: 2, fontFamily: "'JetBrains Mono', monospace" }}>{i}</span>
                  </motion.div>
                )
              })}
            </div>

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
                {sorting ? 'Sorting…' : 'Start Sort'}
              </ControlButton>

              {sorting && (
                <ControlButton onClick={togglePause} variant="success">
                  {isPaused ? 'Resume' : 'Pause'}
                </ControlButton>
              )}

              <ControlButton onClick={reset} variant="danger">
                Reset
              </ControlButton>
            </ControlsRow>

            {/* Final Result */}
            <AnimatePresence>
              {isFinalStep && (
                <motion.div
                  initial={{ opacity: 0, y: 8 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0 }}
                  transition={{ duration: 0.2, ease: [0.16, 1, 0.3, 1] }}
                  style={{
                    marginTop: 24,
                    padding: '12px 20px',
                    background: COLORS.surface,
                    border: `1px solid ${COLORS.sorted}`,
                    borderLeft: `3px solid ${COLORS.sorted}`,
                    borderRadius: '0px',
                    fontFamily: "'JetBrains Mono', monospace",
                    fontWeight: 600,
                    fontSize: 15,
                    color: COLORS.fg,
                    display: 'inline-block'
                  }}
                >
                  ✓ Array sorted successfully
                </motion.div>
              )}
            </AnimatePresence>
          </VisualizationContainer>
        </SplitRight>
      </SplitLayout>
    </PageContainer>
  )
}
