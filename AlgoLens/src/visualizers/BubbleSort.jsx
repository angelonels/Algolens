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

const bubbleSortPythonCode = `def bubble_sort(arr):
    n = len(arr)
    for i in range(n):
        for j in range(0, n - i - 1):
            if arr[j] > arr[j + 1]:
                arr[j], arr[j + 1] = arr[j + 1], arr[j]
    return arr`

export default function BubbleSortVisualizer() {
  const init = [64, 34, 25, 12, 22, 11, 90, 45]
  const [array] = useState(init)
  const [steps, setSteps] = useState([])
  const [currentStep, setCurrentStep] = useState(-1)
  const [sorting, setSorting] = useState(false)
  const [speed, setSpeed] = useState(SPEED_PRESETS.normal)
  const [isPaused, setIsPaused] = useState(false)

  const computeSteps = () => {
    const arr = [...array]
    const s = []
    const n = arr.length

    for (let i = 0; i < n; i++) {
      for (let j = 0; j < n - i - 1; j++) {
        const isSwap = arr[j] > arr[j + 1]

        // Compare step
        s.push({
          array: [...arr],
          compare: [j, j + 1],
          swap: false,
          swapping: isSwap,
          sortedCount: i,
          pass: i + 1,
          message: `Comparing ${arr[j]} and ${arr[j + 1]}${isSwap ? ' → Will swap!' : ' → No swap needed'}`
        })

        if (isSwap) {
          [arr[j], arr[j + 1]] = [arr[j + 1], arr[j]]
          // Swap step
          s.push({
            array: [...arr],
            compare: [j, j + 1],
            swap: true,
            swapping: false,
            sortedCount: i,
            pass: i + 1,
            message: `Swapped! ${arr[j + 1]} ↔ ${arr[j]}`
          })
        }
      }
    }

    s.push({
      array: [...arr],
      compare: [],
      swap: false,
      swapping: false,
      sortedCount: n,
      pass: n,
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
    array,
    compare: [],
    swap: false,
    swapping: false,
    sortedCount: 0,
    pass: 0,
    message: ''
  }

  const getElementState = (index) => {
    const isSorted = index >= step.array.length - step.sortedCount
    if (isSorted) return 'sorted'
    if (step.compare.includes(index)) {
      if (step.swap) return 'swapped'
      if (step.swapping) return 'swapping'
      return 'comparing'
    }
    return 'default'
  }

  const legendItems = [
    { color: COLORS.comparing, label: 'Comparing' },
    { color: COLORS.swapping, label: 'Swapping' },
    { color: COLORS.sorted, label: 'Sorted' }
  ]

  const isFinalStep = currentStep === steps.length - 1 && !sorting

  return (
    <PageContainer title="🫧 Bubble Sort Visualizer">
      <ExplanationBox>
        <h3 style={{ marginBottom: 12, color: '#1e293b' }}>What is Bubble Sort?</h3>
        <p>
          Bubble Sort is a simple comparison-based sorting algorithm. It repeatedly steps through the list,
          compares adjacent pairs, and swaps them if they are in the wrong order. Each pass "bubbles" the
          largest unsorted element to its correct position.
        </p>
        <h4 style={{ margin: '16px 0 8px', color: '#475569' }}>How It Works</h4>
        <ol style={{ paddingLeft: 20, margin: 0 }}>
          <li>Compare each pair of adjacent elements</li>
          <li>If left &gt; right, swap them</li>
          <li>Continue to the end — largest element bubbles up</li>
          <li>Repeat for remaining unsorted elements</li>
        </ol>
        <p style={{ marginTop: 12 }}>
          <strong>Time Complexity:</strong> O(n²) average/worst, O(n) best case
        </p>
      </ExplanationBox>

      <CodeBlock code={bubbleSortPythonCode} onCopy={() => { }} />

      <VisualizationContainer>
        {/* Status Bar */}
        <div style={{
          display: 'flex',
          justifyContent: 'center',
          gap: 24,
          marginBottom: 20,
          flexWrap: 'wrap'
        }}>
          {sorting && (
            <div style={{
              padding: '8px 16px',
              background: '#f1f5f9',
              borderRadius: 8,
              fontWeight: 600,
              color: '#475569'
            }}>
              Pass: {step.pass} / {array.length}
            </div>
          )}
        </div>

        {/* Status Message */}
        <AnimatePresence mode="wait">
          {currentStep >= 0 && step.message && (
            <StatusMessage
              key={currentStep}
              message={step.message}
              type={step.swap ? 'swap' : step.swapping ? 'warning' : isFinalStep ? 'success' : 'compare'}
            />
          )}
        </AnimatePresence>

        {/* Array Visualization with Bar Chart Style */}
        <div style={{
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'flex-end',
          gap: 8,
          height: 280,
          padding: '20px 0'
        }}>
          {step.array.map((v, i) => {
            const state = getElementState(i)
            const maxVal = Math.max(...array)
            const height = (v / maxVal) * 200 + 40

            const colors = {
              default: '#cbd5e1',
              comparing: COLORS.comparing,
              swapping: COLORS.swapping,
              swapped: COLORS.active,
              sorted: COLORS.sorted
            }

            return (
              <motion.div
                key={i}
                layout
                animate={{
                  height,
                  backgroundColor: colors[state],
                  scale: state === 'comparing' || state === 'swapping' ? 1.05 : 1,
                  y: state === 'swapping' ? -15 : 0
                }}
                transition={{
                  ...SPRING.bouncy,
                  layout: { type: 'spring', stiffness: 300, damping: 30 }
                }}
                style={{
                  width: 55,
                  borderRadius: '10px 10px 4px 4px',
                  display: 'flex',
                  flexDirection: 'column',
                  alignItems: 'center',
                  justifyContent: 'flex-end',
                  paddingBottom: 8,
                  fontWeight: 700,
                  fontSize: 16,
                  color: state === 'swapping' ? 'white' : '#1e293b',
                  boxShadow: state === 'comparing' || state === 'swapping'
                    ? '0 8px 25px rgba(0,0,0,0.25)'
                    : '0 2px 8px rgba(0,0,0,0.1)'
                }}
              >
                {v}
                {state === 'swapping' && (
                  <motion.span
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    style={{ fontSize: 12, marginTop: 4 }}
                  >
                    ↕️
                  </motion.span>
                )}
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
            {sorting ? '🫧 Sorting...' : '▶️ Start Sort'}
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
              🎉 Array sorted in {step.pass} passes!
            </motion.div>
          )}
        </AnimatePresence>
      </VisualizationContainer>
    </PageContainer>
  )
}
