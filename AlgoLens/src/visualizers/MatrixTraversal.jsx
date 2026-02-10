import React, { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { SPEED_PRESETS, COLORS, SPRING } from '../utils/animationConfig'
import {
  SpeedControl, StepCounter, StatusMessage, ControlButton, Legend,
  CodeBlock, PageContainer, ExplanationBox, VisualizationContainer, ControlsRow
} from '../components/ui/AnimationComponents'

const spiralPythonCode = `def spiral_traverse(matrix):
    result = []
    if not matrix: return result
    top, bottom = 0, len(matrix) - 1
    left, right = 0, len(matrix[0]) - 1
    while top <= bottom and left <= right:
        for j in range(left, right + 1):
            result.append(matrix[top][j])
        top += 1
        for i in range(top, bottom + 1):
            result.append(matrix[i][right])
        right -= 1
        if top <= bottom:
            for j in range(right, left - 1, -1):
                result.append(matrix[bottom][j])
            bottom -= 1
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
      Array.from({ length: N }, (_, j) => i * N + j + 1))
    setMatrix(m)
    reset()
  }, [N])

  const computeSteps = () => {
    const res = []
    const dirs = ['→ Right', '↓ Down', '← Left', '↑ Up']
    let top = 0, bottom = N - 1, left = 0, right = N - 1
    while (top <= bottom && left <= right) {
      for (let j = left; j <= right; j++)
        res.push({ row: top, col: j, direction: dirs[0], layer: Math.min(top, left) })
      top++
      for (let i = top; i <= bottom; i++)
        res.push({ row: i, col: right, direction: dirs[1], layer: Math.min(top - 1, N - 1 - right) })
      right--
      if (top <= bottom) {
        for (let j = right; j >= left; j--)
          res.push({ row: bottom, col: j, direction: dirs[2], layer: Math.min(N - 1 - bottom, left) })
        bottom--
      }
      if (left <= right) {
        for (let i = bottom; i >= top; i--)
          res.push({ row: i, col: left, direction: dirs[3], layer: Math.min(top, left) })
        left++
      }
    }
    return res
  }

  const startTraversal = () => {
    const s = computeSteps()
    setSteps(s); setCurrentStep(0); setRunning(true); setIsPaused(false)
    setResult([]); setVisitedCells(new Set())
  }

  const reset = () => {
    setSteps([]); setCurrentStep(-1); setRunning(false)
    setResult([]); setVisitedCells(new Set()); setIsPaused(false)
  }

  const togglePause = () => setIsPaused(!isPaused)

  useEffect(() => {
    if (running && !isPaused && currentStep >= 0) {
      const step = steps[currentStep]
      if (step) {
        setResult(prev => [...prev, matrix[step.row][step.col]])
        setVisitedCells(prev => new Set([...prev, `${step.row}-${step.col}`]))
      }
      if (currentStep < steps.length - 1) {
        const t = setTimeout(() => setCurrentStep(cs => cs + 1), speed)
        return () => clearTimeout(t)
      } else { setRunning(false) }
    }
  }, [running, currentStep, steps, matrix, speed, isPaused])

  const step = steps[currentStep] || null
  const isFinalStep = currentStep === steps.length - 1 && !running

  const legendItems = [
    { color: COLORS.active, label: 'Current' },
    { color: COLORS.comparing, label: 'Layer 1' },
    { color: COLORS.pivot, label: 'Layer 2' },
    { color: COLORS.sorted, label: 'Visited' }
  ]

  const layerColors = [COLORS.comparing, COLORS.pivot, '#ec4899', COLORS.exploring, COLORS.sorted]
  const labelStyle = { fontFamily: "'JetBrains Mono', monospace", fontWeight: 600, fontSize: '12px', textTransform: 'uppercase', letterSpacing: '0.05em', color: COLORS.fgMuted }

  return (
    <PageContainer title="Spiral Matrix Traversal">
      <ExplanationBox>
        <h3 style={{ marginBottom: 12, color: COLORS.fg }}>What is Spiral Matrix Traversal?</h3>
        <p>Spiral traversal visits all elements of an N×N matrix in clockwise order, layer by layer, starting from the outer edge and moving inward.</p>
        <h4 style={{ margin: '16px 0 8px' }}>How It Works</h4>
        <ol style={{ paddingLeft: 20, margin: 0 }}>
          <li>Traverse top row left → right</li>
          <li>Traverse right column top → bottom</li>
          <li>Traverse bottom row right → left</li>
          <li>Traverse left column bottom → top</li>
          <li>Move inward and repeat</li>
        </ol>
        <p style={{ marginTop: 12 }}><strong>Time Complexity:</strong> O(N²)</p>
      </ExplanationBox>

      <CodeBlock code={spiralPythonCode} onCopy={() => { }} />

      <VisualizationContainer>
        <div style={{ marginBottom: 20 }}>
          <label style={{ ...labelStyle, marginRight: 12 }}>Matrix Size</label>
          <input type="number" min="2" max="8" value={N}
            onChange={e => setN(Math.max(2, Math.min(8, +e.target.value)))}
            disabled={running}
            style={{ width: 60, padding: '8px 12px', fontSize: 14, fontFamily: "'JetBrains Mono', monospace", fontWeight: 600, textAlign: 'center', border: `1px solid ${COLORS.border}`, borderRadius: '0px', background: COLORS.surface }} />
        </div>

        <AnimatePresence mode="wait">
          {step && (
            <motion.div key={currentStep} initial={{ opacity: 0, y: -6 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }}
              style={{ marginBottom: 12, padding: '6px 14px', background: COLORS.surface, border: `1px solid ${layerColors[step.layer % layerColors.length]}`, borderLeft: `3px solid ${layerColors[step.layer % layerColors.length]}`, borderRadius: '0px', ...labelStyle, display: 'inline-block', color: COLORS.fg }}>
              {step.direction} · Layer {step.layer + 1}
            </motion.div>
          )}
        </AnimatePresence>

        <div style={{ display: 'grid', gridTemplateColumns: `repeat(${N}, 50px)`, gap: 3, justifyContent: 'center', marginTop: 16 }}>
          {matrix.map((row, i) => row.map((val, j) => {
            const isCurrent = step && step.row === i && step.col === j
            const isVisited = visitedCells.has(`${i}-${j}`)
            return (
              <motion.div key={`${i}-${j}`}
                animate={{ scale: isCurrent ? 1.1 : 1, backgroundColor: isCurrent ? COLORS.active : isVisited ? COLORS.sorted : COLORS.surface }}
                transition={{ type: 'spring', stiffness: 500, damping: 30 }}
                style={{ width: 50, height: 50, display: 'flex', alignItems: 'center', justifyContent: 'center', borderRadius: '2px', fontFamily: "'JetBrains Mono', monospace", fontSize: 14, fontWeight: 700, color: (isCurrent || isVisited) ? '#fff' : COLORS.fg, border: `1px solid ${isCurrent ? COLORS.active : COLORS.border}` }}>
                {val}
              </motion.div>
            )
          }))}
        </div>

        <Legend items={legendItems} />

        {result.length > 0 && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}
            style={{ marginTop: 24, padding: '14px 20px', background: COLORS.surface, border: `1px solid ${COLORS.border}`, borderRadius: '0px', maxWidth: 600 }}>
            <div style={{ ...labelStyle, marginBottom: 8, fontSize: '11px', letterSpacing: '0.06em' }}>Traversal Order</div>
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: 4 }}>
              {result.map((val, i) => (
                <motion.span key={i} initial={{ scale: 0 }} animate={{ scale: 1 }}
                  style={{ padding: '3px 8px', background: i === result.length - 1 ? COLORS.active : COLORS.sorted, borderRadius: '0px', color: '#fff', fontFamily: "'JetBrains Mono', monospace", fontWeight: 600, fontSize: 12 }}>
                  {val}
                </motion.span>
              ))}
            </div>
          </motion.div>
        )}

        <ControlsRow>
          <SpeedControl speed={speed} onSpeedChange={setSpeed} disabled={false} />
          {running && <StepCounter current={currentStep + 1} total={steps.length} />}
          <ControlButton onClick={startTraversal} disabled={running && !isPaused} variant="primary">
            {running ? 'Traversing…' : 'Start'}
          </ControlButton>
          {running && <ControlButton onClick={togglePause} variant="success">{isPaused ? 'Resume' : 'Pause'}</ControlButton>}
          <ControlButton onClick={reset} variant="danger">Reset</ControlButton>
        </ControlsRow>

        <AnimatePresence>
          {isFinalStep && (
            <motion.div initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }}
              transition={{ duration: 0.2, ease: [0.16, 1, 0.3, 1] }}
              style={{ marginTop: 24, padding: '12px 20px', background: COLORS.surface, border: `1px solid ${COLORS.sorted}`, borderLeft: `3px solid ${COLORS.sorted}`, borderRadius: '0px', fontFamily: "'JetBrains Mono', monospace", fontWeight: 600, fontSize: 15, color: COLORS.fg, display: 'inline-block' }}>
              ✓ Traversal complete — {N * N} elements visited
            </motion.div>
          )}
        </AnimatePresence>
      </VisualizationContainer>
    </PageContainer>
  )
}
