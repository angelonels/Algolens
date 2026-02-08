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
          ? `🎯 Found ${target} at index ${mid}!`
          : array[mid] < target
            ? `${array[mid]} < ${target}, searching right half (${mid + 1} to ${high})`
            : `${array[mid]} > ${target}, searching left half (${low} to ${mid - 1})`
      })
      if (found) break
      array[mid] < target ? (low = mid + 1) : (high = mid - 1)
    }
    if (s.length === 0 || !s[s.length - 1].found) {
      s.push({ low: -1, mid: -1, high: -1, found: false, message: `❌ ${target} not found in array` })
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
    { color: '#94a3b8', label: 'Eliminated' },
    { color: COLORS.found, label: 'Found' }
  ]

  return (
    <PageContainer title="🔍 Binary Search Visualizer">
      <ExplanationBox>
        <h3 style={{ marginBottom: 12, color: '#1e293b' }}>What is Binary Search?</h3>
        <p>
          Binary Search efficiently locates a target value within a <strong>sorted array</strong>.
          By comparing the target to the middle element, it halves the search space on each step,
          achieving a time complexity of <strong>O(log n)</strong>.
        </p>
        <h4 style={{ margin: '16px 0 8px', color: '#475569' }}>How It Works</h4>
        <ol style={{ paddingLeft: 20, margin: 0 }}>
          <li>Compute <code style={{ background: '#f1f5f9', padding: '2px 6px', borderRadius: 4 }}>mid = (low + high) / 2</code></li>
          <li>If <code style={{ background: '#f1f5f9', padding: '2px 6px', borderRadius: 4 }}>arr[mid] === target</code>, we're done</li>
          <li>If target is larger, search right half</li>
          <li>If target is smaller, search left half</li>
          <li>Repeat until found or range is empty</li>
        </ol>
      </ExplanationBox>

      <CodeBlock code={binarySearchPythonCode} onCopy={() => { }} />

      <VisualizationContainer>
        {/* Target Input */}
        <div style={{ marginBottom: 20 }}>
          <label style={{ marginRight: 12, fontSize: 16, fontWeight: 500 }}>Target:</label>
          <input
            type="number"
            value={target}
            onChange={onChangeTarget}
            min={1}
            max={20}
            disabled={searching}
            style={{
              width: 80,
              padding: '10px 14px',
              fontSize: 16,
              borderRadius: 8,
              border: '2px solid #e2e8f0',
              fontWeight: 600,
              textAlign: 'center'
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
          marginBottom: 8,
          height: 30
        }}>
          {array.map((_, i) => {
            const isLow = step.low === i && step.low >= 0
            const isMid = step.mid === i
            const isHigh = step.high === i && step.high >= 0

            return (
              <div
                key={i}
                style={{
                  width: 50,
                  margin: '0 3px',
                  textAlign: 'center',
                  fontSize: 11,
                  fontWeight: 700,
                  color: isMid ? COLORS.current : '#64748b'
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
        <div style={{ display: 'flex', justifyContent: 'center', flexWrap: 'wrap', gap: 6 }}>
          {array.map((v, i) => {
            const state = getElementState(i)
            const colors = {
              found: COLORS.found,
              current: COLORS.current,
              active: COLORS.comparing,
              eliminated: '#94a3b8'
            }

            return (
              <motion.div
                key={i}
                layout
                animate={{
                  scale: state === 'current' ? 1.15 : state === 'found' ? 1.2 : 1,
                  backgroundColor: colors[state],
                  opacity: state === 'eliminated' ? 0.4 : 1
                }}
                transition={SPRING.bouncy}
                style={{
                  width: 50,
                  height: 50,
                  display: 'flex',
                  flexDirection: 'column',
                  alignItems: 'center',
                  justifyContent: 'center',
                  borderRadius: 10,
                  fontWeight: 700,
                  fontSize: 18,
                  color: state === 'eliminated' ? '#fff' : '#1e293b',
                  boxShadow: state === 'current' || state === 'found'
                    ? '0 8px 20px rgba(0,0,0,0.2)'
                    : '0 2px 4px rgba(0,0,0,0.1)'
                }}
              >
                {v}
                <span style={{ fontSize: 10, opacity: 0.7 }}>{i}</span>
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
            {searching ? '🔍 Searching...' : '▶️ Start Search'}
          </ControlButton>

          {searching && (
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
          {result !== null && !searching && (
            <motion.div
              initial={{ opacity: 0, scale: 0.8, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0 }}
              transition={SPRING.bouncy}
              style={{
                marginTop: 24,
                padding: '16px 24px',
                background: result >= 0
                  ? 'linear-gradient(135deg, #11998e 0%, #38ef7d 100%)'
                  : 'linear-gradient(135deg, #ff6b6b 0%, #ee5a24 100%)',
                borderRadius: 12,
                color: 'white',
                fontWeight: 600,
                fontSize: 18,
                display: 'inline-block',
                boxShadow: '0 4px 15px rgba(0,0,0,0.2)'
              }}
            >
              {result >= 0
                ? `🎉 Target ${target} found at index ${result}!`
                : `❌ Target ${target} not found in array`}
            </motion.div>
          )}
        </AnimatePresence>
      </VisualizationContainer>
    </PageContainer>
  )
}
