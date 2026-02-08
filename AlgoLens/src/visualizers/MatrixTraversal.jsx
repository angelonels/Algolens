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

const spiralPythonCode = `def spiral_traverse(matrix):
    result = []
    if not matrix: return result
    top, bottom = 0, len(matrix) - 1
    left, right = 0, len(matrix[0]) - 1
    
    while top <= bottom and left <= right:
        # Right
        for j in range(left, right + 1):
            result.append(matrix[top][j])
        top += 1
        # Down
        for i in range(top, bottom + 1):
            result.append(matrix[i][right])
        right -= 1
        # Left
        if top <= bottom:
            for j in range(right, left - 1, -1):
                result.append(matrix[bottom][j])
            bottom -= 1
        # Up
        if left <= right:
            for i in range(bottom, top - 1, -1):
                result.append(matrix[i][left])
            left += 1
    return result`

export default function SpiralMatrixVisualizer() {
  const [N, setN] = useState(5)
  const [matrix, setMatrix] = useState([])
  const [steps, setSteps] = useState([])
  const [currentStep, setCurrentStep] = useState(-1)
  const [running, setRunning] = useState(false)
  const [speed, setSpeed] = useState(SPEED_PRESETS.fast)
  const [isPaused, setIsPaused] = useState(false)
  const [result, setResult] = useState([])
  const [visitedCells, setVisitedCells] = useState(new Set())

  useEffect(() => {
    const m = Array.from({ length: N }, (_, i) =>
      Array.from({ length: N }, (_, j) => i * N + j + 1)
    )
    setMatrix(m)
    reset()
  }, [N])

  const computeSteps = () => {
    const res = []
    const directions = ['→ Right', '↓ Down', '← Left', '↑ Up']
    let top = 0, bottom = N - 1, left = 0, right = N - 1
    let dirIndex = 0

    while (top <= bottom && left <= right) {
      // Right
      for (let j = left; j <= right; j++) {
        res.push({ row: top, col: j, direction: directions[0], layer: Math.min(top, left) })
      }
      top++
      dirIndex = 1

      // Down
      for (let i = top; i <= bottom; i++) {
        res.push({ row: i, col: right, direction: directions[1], layer: Math.min(top - 1, N - 1 - right) })
      }
      right--
      dirIndex = 2

      // Left
      if (top <= bottom) {
        for (let j = right; j >= left; j--) {
          res.push({ row: bottom, col: j, direction: directions[2], layer: Math.min(N - 1 - bottom, left) })
        }
        bottom--
      }
      dirIndex = 3

      // Up
      if (left <= right) {
        for (let i = bottom; i >= top; i--) {
          res.push({ row: i, col: left, direction: directions[3], layer: Math.min(top, left) })
        }
        left++
      }
    }

    return res
  }

  const startTraversal = () => {
    const s = computeSteps()
    setSteps(s)
    setCurrentStep(0)
    setRunning(true)
    setIsPaused(false)
    setResult([])
    setVisitedCells(new Set())
  }

  const reset = () => {
    setSteps([])
    setCurrentStep(-1)
    setRunning(false)
    setResult([])
    setVisitedCells(new Set())
    setIsPaused(false)
  }

  const togglePause = () => setIsPaused(!isPaused)

  useEffect(() => {
    if (running && !isPaused && currentStep >= 0) {
      const step = steps[currentStep]
      if (step) {
        const val = matrix[step.row][step.col]
        setResult(prev => [...prev, val])
        setVisitedCells(prev => new Set([...prev, `${step.row}-${step.col}`]))
      }

      if (currentStep < steps.length - 1) {
        const t = setTimeout(() => setCurrentStep(cs => cs + 1), speed)
        return () => clearTimeout(t)
      } else {
        setRunning(false)
      }
    }
  }, [running, currentStep, steps, matrix, speed, isPaused])

  const step = steps[currentStep] || null
  const layerColors = ['#3b82f6', '#8b5cf6', '#ec4899', '#f97316', '#22c55e', '#06b6d4']

  const legendItems = [
    { color: COLORS.active, label: 'Current' },
    { color: '#3b82f6', label: 'Layer 1' },
    { color: '#8b5cf6', label: 'Layer 2' },
    { color: '#22c55e', label: 'Visited' }
  ]

  const isFinalStep = currentStep === steps.length - 1 && !running

  return (
    <PageContainer title="🌀 Spiral Matrix Visualizer">
      <ExplanationBox>
        <h3 style={{ marginBottom: 12, color: '#1e293b' }}>What is Spiral Matrix Traversal?</h3>
        <p>
          Spiral traversal visits all elements of an N×N matrix in clockwise order,
          layer by layer, starting from the outer edge and moving inward.
        </p>
        <h4 style={{ margin: '16px 0 8px', color: '#475569' }}>How It Works</h4>
        <ol style={{ paddingLeft: 20, margin: 0 }}>
          <li>Traverse top row left → right</li>
          <li>Traverse right column top → bottom</li>
          <li>Traverse bottom row right → left</li>
          <li>Traverse left column bottom → top</li>
          <li>Move inward and repeat</li>
        </ol>
        <p style={{ marginTop: 12 }}>
          <strong>Time Complexity:</strong> O(N²) — visits each element once
        </p>
      </ExplanationBox>

      <CodeBlock code={spiralPythonCode} onCopy={() => { }} />

      <VisualizationContainer>
        {/* Size Control */}
        <div style={{ marginBottom: 20 }}>
          <label style={{ marginRight: 12, fontWeight: 600, color: '#475569' }}>Matrix Size:</label>
          <input
            type="number"
            min="2"
            max="8"
            value={N}
            onChange={e => setN(Math.max(2, Math.min(8, +e.target.value)))}
            disabled={running}
            style={{
              width: 60,
              padding: '8px 12px',
              fontSize: 16,
              borderRadius: 8,
              border: '2px solid #e2e8f0',
              fontWeight: 600,
              textAlign: 'center'
            }}
          />
        </div>

        {/* Direction Indicator */}
        <AnimatePresence mode="wait">
          {step && (
            <motion.div
              key={currentStep}
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0 }}
              style={{
                marginBottom: 16,
                padding: '10px 20px',
                background: layerColors[step.layer % layerColors.length],
                borderRadius: 10,
                color: 'white',
                fontWeight: 600,
                display: 'inline-block'
              }}
            >
              {step.direction} (Layer {step.layer + 1})
            </motion.div>
          )}
        </AnimatePresence>

        {/* Matrix Grid */}
        <div style={{
          display: 'grid',
          gridTemplateColumns: `repeat(${N}, 55px)`,
          gap: 6,
          justifyContent: 'center',
          marginTop: 20
        }}>
          {matrix.map((row, i) =>
            row.map((val, j) => {
              const isCurrent = step && step.row === i && step.col === j
              const isVisited = visitedCells.has(`${i}-${j}`)
              const layer = Math.min(i, j, N - 1 - i, N - 1 - j)

              return (
                <motion.div
                  key={`${i}-${j}`}
                  animate={{
                    scale: isCurrent ? 1.2 : 1,
                    backgroundColor: isCurrent
                      ? COLORS.active
                      : isVisited
                        ? COLORS.sorted
                        : layerColors[layer % layerColors.length] + '30',
                    boxShadow: isCurrent
                      ? '0 8px 25px rgba(245, 158, 11, 0.5)'
                      : '0 2px 8px rgba(0,0,0,0.1)'
                  }}
                  transition={SPRING.bouncy}
                  style={{
                    width: 55,
                    height: 55,
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    borderRadius: 10,
                    fontSize: 16,
                    fontWeight: 700,
                    color: isCurrent ? 'white' : isVisited ? 'white' : '#1e293b',
                    border: `2px solid ${layerColors[layer % layerColors.length]}40`
                  }}
                >
                  {val}
                </motion.div>
              )
            })
          )}
        </div>

        <Legend items={legendItems} />

        {/* Result Trail */}
        {result.length > 0 && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            style={{
              marginTop: 24,
              padding: '16px 24px',
              background: '#f1f5f9',
              borderRadius: 12,
              maxWidth: 600,
              margin: '24px auto 0'
            }}
          >
            <div style={{ fontWeight: 600, marginBottom: 8, color: '#475569' }}>
              Traversal Order:
            </div>
            <div style={{
              display: 'flex',
              flexWrap: 'wrap',
              gap: 6,
              justifyContent: 'center'
            }}>
              {result.map((val, i) => (
                <motion.span
                  key={i}
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  style={{
                    padding: '4px 10px',
                    background: i === result.length - 1 ? COLORS.active : COLORS.sorted,
                    borderRadius: 6,
                    color: 'white',
                    fontWeight: 600,
                    fontSize: 13
                  }}
                >
                  {val}
                </motion.span>
              ))}
            </div>
          </motion.div>
        )}

        {/* Controls */}
        <ControlsRow>
          <SpeedControl speed={speed} onSpeedChange={setSpeed} disabled={false} />

          {running && (
            <StepCounter current={currentStep + 1} total={steps.length} />
          )}

          <ControlButton
            onClick={startTraversal}
            disabled={running && !isPaused}
            variant="primary"
          >
            {running ? '🌀 Traversing...' : '▶️ Start'}
          </ControlButton>

          {running && (
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
              🎉 Traversal complete! {N * N} elements visited
            </motion.div>
          )}
        </AnimatePresence>
      </VisualizationContainer>
    </PageContainer>
  )
}
