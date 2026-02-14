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
  ControlsRow
} from '../components/ui/AnimationComponents'

const mergeSortPythonCode = `def merge_sort(arr):
    if len(arr) <= 1:
        return arr
    mid = len(arr) // 2
    left = merge_sort(arr[:mid])
    right = merge_sort(arr[mid:])
    return merge(left, right)

def merge(left, right):
    result = []
    i = j = 0
    while i < len(left) and j < len(right):
        if left[i] <= right[j]:
            result.append(left[i])
            i += 1
        else:
            result.append(right[j])
            j += 1
    result.extend(left[i:])
    result.extend(right[j:])
    return result`

export default function MergeSortVisualizer() {
  const init = [38, 27, 43, 3, 9, 82, 10, 45]
  const [array] = useState(init)
  const [steps, setSteps] = useState([])
  const [currentStep, setCurrentStep] = useState(-1)
  const [sorting, setSorting] = useState(false)
  const [speed, setSpeed] = useState(SPEED_PRESETS.normal)
  const [isPaused, setIsPaused] = useState(false)

  const computeSteps = () => {
    const arr = [...array]
    const s = []
    const aux = arr.slice()

    const merge = (l, m, r, depth) => {
      s.push({
        snapshot: arr.slice(),
        phase: 'merge-start',
        range: [l, r],
        leftRange: [l, m],
        rightRange: [m + 1, r],
        depth,
        message: `Merging [${l}–${m}] and [${m + 1}–${r}]`
      })

      let i = l, j = m + 1, k = l
      while (i <= m && j <= r) {
        if (aux[i] <= aux[j]) {
          arr[k++] = aux[i++]
        } else {
          arr[k++] = aux[j++]
        }
      }
      while (i <= m) arr[k++] = aux[i++]
      while (j <= r) arr[k++] = aux[j++]

      for (let x = l; x <= r; x++) aux[x] = arr[x]

      s.push({
        snapshot: arr.slice(),
        phase: 'merge-done',
        range: [l, r],
        leftRange: null,
        rightRange: null,
        depth,
        message: `Merged: [${arr.slice(l, r + 1).join(', ')}]`
      })
    }

    const mergeSort = (l, r, depth = 0) => {
      if (l >= r) return

      const m = Math.floor((l + r) / 2)

      s.push({
        snapshot: arr.slice(),
        phase: 'split',
        range: [l, r],
        splitPoint: m,
        depth,
        message: `Splitting [${l}–${r}] at mid=${m}`
      })

      mergeSort(l, m, depth + 1)
      mergeSort(m + 1, r, depth + 1)
      merge(l, m, r, depth)
    }

    mergeSort(0, arr.length - 1)

    s.push({
      snapshot: arr.slice(),
      phase: 'done',
      range: null,
      depth: 0,
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
    phase: 'idle',
    range: null,
    depth: 0,
    message: ''
  }

  const getElementState = (index) => {
    if (step.phase === 'done') return 'sorted'
    if (!step.range) return 'default'

    const [l, r] = step.range
    if (index >= l && index <= r) {
      if (step.phase === 'split') return 'splitting'
      if (step.phase === 'merge-start') {
        if (step.leftRange && index >= step.leftRange[0] && index <= step.leftRange[1]) return 'left'
        if (step.rightRange && index >= step.rightRange[0] && index <= step.rightRange[1]) return 'right'
      }
      if (step.phase === 'merge-done') return 'merged'
    }
    return 'default'
  }

  const depthColors = [COLORS.comparing, COLORS.pivot, '#ec4899', COLORS.exploring, COLORS.sorted]

  const legendItems = [
    { color: COLORS.comparing, label: 'Left Half' },
    { color: '#ec4899', label: 'Right Half' },
    { color: COLORS.active, label: 'Merging' },
    { color: COLORS.sorted, label: 'Sorted' }
  ]

  const isFinalStep = currentStep === steps.length - 1 && !sorting

  return (
    <PageContainer title="Merge Sort Visualizer">
      <ExplanationBox>
        <h3 style={{ marginBottom: 12, color: COLORS.fg }}>What is Merge Sort?</h3>
        <p>
          Merge Sort is a classic divide-and-conquer sorting algorithm invented by John von Neumann in 1945.
          It works by recursively splitting the array into two halves, sorting each half independently,
          and then merging the two sorted halves back together into a single sorted array. Unlike simpler
          algorithms like Bubble Sort, Merge Sort guarantees <strong>O(n log n)</strong> performance in all cases —
          best, average, and worst.
        </p>
        <p style={{ marginTop: 8 }}>
          The key insight is that merging two already-sorted arrays is a linear O(n) operation. By
          recursively breaking the problem down until each sub-array has just one element (which is trivially
          sorted), the algorithm builds up the final sorted array through a series of efficient merge steps.
        </p>
        <h4 style={{ margin: '16px 0 8px' }}>How It Works</h4>
        <ol style={{ paddingLeft: 20, margin: 0 }}>
          <li><strong>Divide:</strong> Split the array into two halves at the midpoint</li>
          <li><strong>Conquer:</strong> Recursively sort the left half and the right half</li>
          <li><strong>Merge:</strong> Combine the two sorted halves by comparing elements one by one, always picking the smaller element first</li>
          <li>Continue merging until all elements are back in a single sorted array</li>
          <li>Base case: a sub-array of size 0 or 1 is already sorted</li>
        </ol>
        <h4 style={{ margin: '16px 0 8px' }}>Key Characteristics</h4>
        <ul style={{ paddingLeft: 20, margin: 0 }}>
          <li><strong>Stable:</strong> Equal elements preserve their original relative order</li>
          <li><strong>Not in-place:</strong> Requires O(n) additional memory for the temporary merge arrays</li>
          <li><strong>Predictable:</strong> Always O(n log n) regardless of input — no worst-case degradation</li>
          <li><strong>Parallelizable:</strong> The independent sub-problems make it well-suited for parallel or distributed processing</li>
        </ul>
        <p style={{ marginTop: 12 }}>
          <strong>Time Complexity:</strong> O(n log n) in all cases (best, average, worst)
        </p>
        <p style={{ marginTop: 4 }}>
          <strong>Space Complexity:</strong> O(n) — requires auxiliary space proportional to the input size
        </p>
        <p style={{ marginTop: 12, color: COLORS.fgMuted, fontSize: '0.9em' }}>
          <strong>When to use:</strong> Preferred when stable sorting is required or when predictable performance
          matters (e.g., sorting linked lists, external sorting of large files). It's the default sorting algorithm
          in many languages — Python's <code>sorted()</code> uses Timsort, which is a hybrid of Merge Sort and Insertion Sort.
        </p>
      </ExplanationBox>

      <CodeBlock code={mergeSortPythonCode} onCopy={() => { }} />

      <VisualizationContainer>
        {/* Depth Indicator */}
        {sorting && step.depth !== undefined && (
          <div style={{
            marginBottom: 12,
            padding: '6px 12px',
            background: COLORS.surface,
            border: `1px solid ${depthColors[step.depth % depthColors.length]}`,
            borderLeft: `3px solid ${depthColors[step.depth % depthColors.length]}`,
            borderRadius: '0px',
            fontFamily: "'JetBrains Mono', monospace",
            fontWeight: 600,
            fontSize: '12px',
            textTransform: 'uppercase',
            letterSpacing: '0.04em',
            color: COLORS.fg,
            display: 'inline-block'
          }}>
            Depth: {step.depth}
          </div>
        )}

        {/* Status Message */}
        <AnimatePresence mode="wait">
          {currentStep >= 0 && step.message && (
            <StatusMessage
              key={currentStep}
              message={step.message}
              type={step.phase === 'merge-done' ? 'success' : 'info'}
            />
          )}
        </AnimatePresence>

        {/* Array Bar Chart */}
        <div style={{
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'flex-end',
          gap: 4,
          height: 280,
          padding: '20px 0'
        }}>
          {step.snapshot.map((v, i) => {
            const state = getElementState(i)
            const maxVal = Math.max(...array)
            const height = (v / maxVal) * 200 + 40

            const colors = {
              default: COLORS.default,
              splitting: COLORS.comparing,
              left: COLORS.comparing,
              right: '#ec4899',
              merged: COLORS.active,
              sorted: COLORS.sorted
            }

            return (
              <motion.div
                key={i}
                layout
                animate={{
                  height,
                  backgroundColor: colors[state] || colors.default,
                  scale: state === 'merged' ? 1.04 : 1,
                  y: state === 'splitting' ? -8 : 0
                }}
                transition={{
                  ...SPRING.bouncy,
                  layout: { type: 'spring', stiffness: 500, damping: 30 }
                }}
                style={{
                  width: 52,
                  borderRadius: '2px 2px 0 0',
                  display: 'flex',
                  flexDirection: 'column',
                  alignItems: 'center',
                  justifyContent: 'flex-end',
                  paddingBottom: 8,
                  fontFamily: "'JetBrains Mono', monospace",
                  fontWeight: 700,
                  fontSize: 15,
                  color: (state === 'left' || state === 'right' || state === 'comparing')
                    ? '#fff' : COLORS.fg,
                  border: '1px solid rgba(0,0,0,0.08)'
                }}
              >
                {v}
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
              ✓ Array sorted with Merge Sort
            </motion.div>
          )}
        </AnimatePresence>
      </VisualizationContainer>
    </PageContainer>
  )
}
