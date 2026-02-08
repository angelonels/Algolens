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

      // Show key extraction
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

      // Show comparisons and shifts
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
          message: `${arr[j]} > ${key}, shifting ${arr[j]} right`
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
          message: `Shifted! Looking at position ${j >= 0 ? j : 'start'}`
        })
      }

      // Insert key
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
      message: '🎉 Array is sorted!'
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
    const isSorted = index < step.sortedCount && step.phase === 'done'
    if (step.phase === 'done') return 'sorted'
    if (step.insertedIndex === index) return 'inserted'
    if (step.keyIndex === index) return 'key'
    if (step.comparingIndex === index) return 'comparing'
    if (step.shiftIndex === index) return 'shifting'
    if (index < step.sortedCount) return 'sorted-partial'
    return 'default'
  }

  const legendItems = [
    { color: COLORS.active, label: 'Key (extracted)' },
    { color: COLORS.comparing, label: 'Comparing' },
    { color: '#a78bfa', label: 'Shifting' },
    { color: COLORS.found, label: 'Inserted' },
    { color: COLORS.sorted, label: 'Sorted' }
  ]

  const isFinalStep = currentStep === steps.length - 1 && !sorting

  return (
    <PageContainer title="📥 Insertion Sort Visualizer">
      <ExplanationBox>
        <h3 style={{ marginBottom: 12, color: '#1e293b' }}>What is Insertion Sort?</h3>
        <p>
          Insertion Sort builds a sorted array one element at a time. At each pass, it takes the next
          element (key) and inserts it into its correct position among the previously sorted elements.
        </p>
        <h4 style={{ margin: '16px 0 8px', color: '#475569' }}>How It Works</h4>
        <ol style={{ paddingLeft: 20, margin: 0 }}>
          <li>"Extract" the element at current position as key</li>
          <li>Compare key with sorted elements from right to left</li>
          <li>Shift larger elements right to make room</li>
          <li>Insert key into correct position</li>
          <li>Repeat for all elements</li>
        </ol>
        <p style={{ marginTop: 12 }}>
          <strong>Time Complexity:</strong> O(n²) worst/average, O(n) best case (already sorted)
        </p>
      </ExplanationBox>

      <CodeBlock code={insertionSortPythonCode} onCopy={() => { }} />

      <VisualizationContainer>
        {/* Key Display */}
        <AnimatePresence>
          {step.keyValue !== null && step.phase !== 'done' && (
            <motion.div
              initial={{ opacity: 0, y: -20, scale: 0.8 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: -20 }}
              style={{
                marginBottom: 20,
                padding: '12px 24px',
                background: 'linear-gradient(135deg, #f59e0b 0%, #f97316 100%)',
                borderRadius: 12,
                color: 'white',
                fontWeight: 700,
                fontSize: 18,
                display: 'inline-block',
                boxShadow: '0 4px 15px rgba(245, 158, 11, 0.4)'
              }}
            >
              🔑 Key: {step.keyValue}
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

        {/* Array Visualization */}
        <div style={{
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'flex-end',
          gap: 8,
          height: 280,
          padding: '20px 0'
        }}>
          {step.snapshot.map((v, i) => {
            const state = getElementState(i)
            const maxVal = Math.max(...array)
            const height = (v / maxVal) * 200 + 40

            const colors = {
              default: '#e2e8f0',
              key: COLORS.active,
              comparing: COLORS.comparing,
              shifting: '#a78bfa',
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
                  scale: state === 'key' || state === 'inserted' ? 1.1 : 1,
                  y: state === 'key' ? -30 : state === 'shifting' ? -10 : 0
                }}
                transition={{
                  ...SPRING.bouncy,
                  layout: { type: 'spring', stiffness: 300, damping: 30 }
                }}
                style={{
                  width: 60,
                  borderRadius: '10px 10px 4px 4px',
                  display: 'flex',
                  flexDirection: 'column',
                  alignItems: 'center',
                  justifyContent: 'flex-end',
                  paddingBottom: 8,
                  fontWeight: 700,
                  fontSize: 18,
                  color: '#1e293b',
                  boxShadow: state === 'key' || state === 'inserted'
                    ? '0 8px 25px rgba(0,0,0,0.25)'
                    : '0 2px 8px rgba(0,0,0,0.1)'
                }}
              >
                {v}
                <span style={{ fontSize: 10, opacity: 0.6, marginTop: 2 }}>{i}</span>
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
            {sorting ? '📥 Sorting...' : '▶️ Start Sort'}
          </ControlButton>

          {sorting && (
            <ControlButton onClick={togglePause} variant="success">
              {isPaused ? '▶️ Resume' : '⏸️ Pause'}
            </ControlButton>
          )}

          <ControlButton onClick={reset} variant="danger">
            🔄 Reset
          </ControlButton>
        </ControlsRow>

        {/* Final Result */}
        <AnimatePresence>
          {isFinalStep && (
            <motion.div
              initial={{ opacity: 0, scale: 0.8, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0 }}
              transition={SPRING.bouncy}
              style={{
                marginTop: 24,
                padding: '16px 24px',
                background: 'linear-gradient(135deg, #11998e 0%, #38ef7d 100%)',
                borderRadius: 12,
                color: 'white',
                fontWeight: 600,
                fontSize: 18,
                display: 'inline-block',
                boxShadow: '0 4px 15px rgba(0,0,0,0.2)'
              }}
            >
              🎉 Array sorted successfully!
            </motion.div>
          )}
        </AnimatePresence>
      </VisualizationContainer>
    </PageContainer>
  )
}
