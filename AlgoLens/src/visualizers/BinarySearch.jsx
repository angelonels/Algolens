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

const binarySearchPythonCode = `def binary_search(arr, target):
    low, high = 0, len(arr) - 1
    while low <= high:
        mid = (low + high) // 2
        if arr[mid] == target:
            return mid
        elif arr[mid] < target:
            low = mid + 1
        else:
            high = mid - 1
    return -1`

export default function BinarySearchVisualizer() {
  const [array] = useState(Array.from({ length: 16 }, (_, i) => i + 1))
  const [target, setTarget] = useState(11)
  const [steps, setSteps] = useState([])
  const [currentStep, setCurrentStep] = useState(-1)
  const [searching, setSearching] = useState(false)
  const [result, setResult] = useState(null)
  const [speed, setSpeed] = useState(SPEED_PRESETS.normal)
  const [isPaused, setIsPaused] = useState(false)

  const computeSteps = () => {
    let low = 0, high = array.length - 1
    const s = []
    while (low <= high) {
      const mid = Math.floor((low + high) / 2)
      const found = array[mid] === target
      s.push({
        low,
        mid,
        high,
        found,
        message: found
          ? `Found ${target} at index ${mid}`
          : array[mid] < target
            ? `${array[mid]} < ${target} → search right (${mid + 1}..${high})`
            : `${array[mid]} > ${target} → search left (${low}..${mid - 1})`
      })
      if (found) break
      array[mid] < target ? (low = mid + 1) : (high = mid - 1)
    }
    if (s.length === 0 || !s[s.length - 1].found) {
      s.push({ low: -1, mid: -1, high: -1, found: false, message: `${target} not found in array` })
    }
    return s
  }

  const startSearch = () => {
    setResult(null)
    const s = computeSteps()
    setSteps(s)
    setCurrentStep(0)
    setSearching(true)
    setIsPaused(false)
  }

  const reset = () => {
    setSteps([])
    setCurrentStep(-1)
    setSearching(false)
    setResult(null)
    setIsPaused(false)
  }

  const togglePause = () => setIsPaused(!isPaused)

  useEffect(() => {
    if (searching && !isPaused && currentStep >= 0) {
      if (currentStep < steps.length - 1) {
        const t = setTimeout(() => setCurrentStep(cs => cs + 1), speed)
        return () => clearTimeout(t)
      } else {
        setSearching(false)
        const lastStep = steps[currentStep]
        setResult(lastStep.found ? lastStep.mid : -1)
      }
    }
  }, [currentStep, searching, steps, speed, isPaused])

  const onChangeTarget = e => {
    const val = Number(e.target.value)
    setTarget(val)
    reset()
  }

  const step = steps[currentStep] || { low: 0, mid: -1, high: array.length - 1, found: false, message: '' }

  const getElementState = (index) => {
    if (result === index) return 'found'
    if (step.mid === index) return 'current'
    if (index >= step.low && index <= step.high && step.low >= 0) return 'active'
    return 'eliminated'
  }

  const legendItems = [
    { color: COLORS.current, label: 'Mid' },
    { color: COLORS.active, label: 'Search Range' },
    { color: COLORS.eliminated, label: 'Eliminated' },
    { color: COLORS.found, label: 'Found' }
  ]

  return (
    <PageContainer title="Binary Search Visualizer">
      <ExplanationBox>
        <h3 style={{ marginBottom: 12, color: COLORS.fg }}>What is Binary Search?</h3>
        <p>
          Binary Search is a highly efficient search algorithm that finds the position of a target value
          within a <strong>sorted array</strong>. Rather than checking every element one by one (as in linear search),
          it repeatedly divides the search space in half — comparing the target to the middle element and
          eliminating the half where the target cannot exist.
        </p>
        <p style={{ marginTop: 8 }}>
          Think of it like looking up a word in a dictionary: you open to the middle, decide if your word
          comes before or after, and then repeat the process on the relevant half. Each step cuts the
          remaining possibilities in half, achieving a time complexity of <strong>O(log n)</strong> — meaning
          even an array of 1 billion elements can be searched in at most ~30 comparisons.
        </p>
        <h4 style={{ margin: '16px 0 8px' }}>How It Works</h4>
        <ol style={{ paddingLeft: 20, margin: 0 }}>
          <li>Initialize two pointers: <code>low = 0</code> and <code>high = length - 1</code></li>
          <li>Compute the middle index: <code>mid = (low + high) / 2</code></li>
          <li>If <code>arr[mid] === target</code>, the element is found — return the index</li>
          <li>If the target is greater than <code>arr[mid]</code>, discard the left half by setting <code>low = mid + 1</code></li>
          <li>If the target is smaller than <code>arr[mid]</code>, discard the right half by setting <code>high = mid - 1</code></li>
          <li>Repeat until the element is found or the search range becomes empty (<code>low &gt; high</code>)</li>
        </ol>
        <h4 style={{ margin: '16px 0 8px' }}>Key Characteristics</h4>
        <ul style={{ paddingLeft: 20, margin: 0 }}>
          <li><strong>Prerequisite:</strong> The array must be sorted beforehand</li>
          <li><strong>Divide and conquer:</strong> Halves the search space at each step</li>
          <li><strong>Iterative or recursive:</strong> Can be implemented either way with equivalent performance</li>
          <li><strong>Variants:</strong> Lower bound, upper bound, and finding the first/last occurrence of a value</li>
        </ul>
        <p style={{ marginTop: 12 }}>
          <strong>Time Complexity:</strong> O(log n) — logarithmic in all cases
        </p>
        <p style={{ marginTop: 4 }}>
          <strong>Space Complexity:</strong> O(1) iterative | O(log n) recursive (due to call stack)
        </p>
        <p style={{ marginTop: 12, color: COLORS.fgMuted, fontSize: '0.9em' }}>
          <strong>When to use:</strong> Ideal for searching in sorted arrays, databases, and any scenario where data
          is ordered. Commonly used in standard library functions like Python's <code>bisect</code> module
          and C++'s <code>std::lower_bound</code>.
        </p>
      </ExplanationBox>

      <CodeBlock code={binarySearchPythonCode} onCopy={() => { }} />

      <VisualizationContainer>
        {/* Target Input */}
        <div style={{ marginBottom: 20 }}>
          <label style={{
            marginRight: 12,
            fontFamily: "'JetBrains Mono', monospace",
            fontSize: '12px',
            fontWeight: 600,
            textTransform: 'uppercase',
            letterSpacing: '0.05em',
            color: COLORS.fgMuted
          }}>Target</label>
          <input
            type="number"
            value={target}
            onChange={onChangeTarget}
            min={1}
            max={20}
            disabled={searching}
            style={{
              width: 80,
              padding: '8px 12px',
              fontSize: 14,
              fontFamily: "'JetBrains Mono', monospace",
              fontWeight: 600,
              textAlign: 'center',
              border: `1px solid ${COLORS.border}`,
              borderRadius: '0px',
              background: COLORS.surface
            }}
          />
        </div>

        {/* Status Message */}
        <AnimatePresence mode="wait">
          {currentStep >= 0 && step.message && (
            <StatusMessage
              key={currentStep}
              message={step.message}
              type={step.found ? 'success' : 'info'}
            />
          )}
        </AnimatePresence>

        {/* Pointer Indicators */}
        <div style={{
          display: 'flex',
          justifyContent: 'center',
          marginBottom: 4,
          height: 24
        }}>
          {array.map((_, i) => {
            const isLow = step.low === i && step.low >= 0
            const isMid = step.mid === i
            const isHigh = step.high === i && step.high >= 0

            return (
              <div
                key={i}
                style={{
                  width: 48,
                  margin: '0 2px',
                  textAlign: 'center',
                  fontFamily: "'JetBrains Mono', monospace",
                  fontSize: 10,
                  fontWeight: 700,
                  textTransform: 'uppercase',
                  letterSpacing: '0.04em',
                  color: isMid ? COLORS.current : COLORS.fgMuted
                }}
              >
                {isMid && '▼ mid'}
                {isLow && !isMid && 'L'}
                {isHigh && !isMid && 'H'}
              </div>
            )
          })}
        </div>

        {/* Array Visualization */}
        <div style={{ display: 'flex', justifyContent: 'center', flexWrap: 'wrap', gap: 4 }}>
          {array.map((v, i) => {
            const state = getElementState(i)
            const colors = {
              found: COLORS.found,
              current: COLORS.current,
              active: COLORS.active,
              eliminated: COLORS.eliminated
            }

            return (
              <motion.div
                key={i}
                layout
                animate={{
                  scale: state === 'current' ? 1.08 : state === 'found' ? 1.1 : 1,
                  backgroundColor: colors[state],
                  opacity: state === 'eliminated' ? 0.35 : 1
                }}
                transition={{ type: 'spring', stiffness: 500, damping: 30 }}
                style={{
                  width: 48,
                  height: 48,
                  display: 'flex',
                  flexDirection: 'column',
                  alignItems: 'center',
                  justifyContent: 'center',
                  borderRadius: '2px',
                  fontFamily: "'JetBrains Mono', monospace",
                  fontWeight: 700,
                  fontSize: 16,
                  color: (state === 'eliminated' || state === 'current' || state === 'found')
                    ? '#fff' : COLORS.fg,
                  border: `1px solid rgba(0,0,0,0.1)`
                }}
              >
                {v}
                <span style={{
                  fontFamily: "'JetBrains Mono', monospace",
                  fontSize: 9,
                  opacity: 0.6
                }}>{i}</span>
              </motion.div>
            )
          })}
        </div>

        <Legend items={legendItems} />

        {/* Controls */}
        <ControlsRow>
          <SpeedControl speed={speed} onSpeedChange={setSpeed} disabled={false} />

          {searching && (
            <StepCounter current={currentStep + 1} total={steps.length} />
          )}

          <ControlButton
            onClick={startSearch}
            disabled={searching && !isPaused}
            variant="primary"
          >
            {searching ? 'Searching…' : 'Start Search'}
          </ControlButton>

          {searching && (
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
          {result !== null && !searching && (
            <motion.div
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.2, ease: [0.16, 1, 0.3, 1] }}
              style={{
                marginTop: 24,
                padding: '12px 20px',
                background: COLORS.surface,
                border: `1px solid ${result >= 0 ? COLORS.sorted : COLORS.accent}`,
                borderLeft: `3px solid ${result >= 0 ? COLORS.sorted : COLORS.accent}`,
                borderRadius: '0px',
                fontFamily: "'JetBrains Mono', monospace",
                fontWeight: 600,
                fontSize: 15,
                color: COLORS.fg,
                display: 'inline-block'
              }}
            >
              {result >= 0
                ? `✓ Target ${target} found at index ${result}`
                : `✗ Target ${target} not found in array`}
            </motion.div>
          )}
        </AnimatePresence>
      </VisualizationContainer>
    </PageContainer>
  )
}
