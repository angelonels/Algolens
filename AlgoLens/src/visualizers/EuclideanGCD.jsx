import React, { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { SPEED_PRESETS, COLORS, SPRING } from '../utils/animationConfig'
import {
  SpeedControl,
  StepCounter,
  StatusMessage,
  ControlButton,
  CodeBlock,
  PageContainer,
  ExplanationBox,
  VisualizationContainer,
  ControlsRow
} from '../components/ui/AnimationComponents'

const gcdPythonCode = `def gcd(a, b):
    while b != 0:
        a, b = b, a % b
    return a`

export default function GCDVisualizer() {
  const [a, setA] = useState(252)
  const [b, setB] = useState(105)
  const [steps, setSteps] = useState([])
  const [currentStep, setCurrentStep] = useState(-1)
  const [running, setRunning] = useState(false)
  const [speed, setSpeed] = useState(SPEED_PRESETS.normal)
  const [isPaused, setIsPaused] = useState(false)
  const [result, setResult] = useState(null)

  const computeSteps = () => {
    let x = a, y = b
    const s = []

    s.push({
      x, y, r: null,
      phase: 'start',
      message: `Starting with gcd(${x}, ${y})`
    })

    while (y !== 0) {
      const r = x % y
      s.push({
        x, y, r,
        phase: 'compute',
        message: `${x} % ${y} = ${r}`
      })

      const oldX = x, oldY = y
      x = y
      y = r

      s.push({
        x, y, r: null,
        phase: 'update',
        oldX, oldY,
        message: `gcd(${oldX}, ${oldY}) → gcd(${x}, ${y})`
      })
    }

    s.push({
      x, y: 0, r: null,
      phase: 'done',
      message: `🎉 GCD = ${x}`
    })

    return s
  }

  const start = () => {
    setResult(null)
    const s = computeSteps()
    setSteps(s)
    setCurrentStep(0)
    setRunning(true)
    setIsPaused(false)
  }

  const reset = () => {
    setSteps([])
    setCurrentStep(-1)
    setRunning(false)
    setResult(null)
    setIsPaused(false)
  }

  const togglePause = () => setIsPaused(!isPaused)

  useEffect(() => {
    if (running && !isPaused && currentStep >= 0) {
      if (currentStep < steps.length - 1) {
        const t = setTimeout(() => setCurrentStep(cs => cs + 1), speed)
        return () => clearTimeout(t)
      } else {
        setRunning(false)
        setResult(steps[currentStep].x)
      }
    }
  }, [running, currentStep, steps, speed, isPaused])

  const step = steps[currentStep] || { x: a, y: b, phase: 'idle', message: '' }

  const isFinalStep = currentStep === steps.length - 1 && !running

  return (
    <PageContainer title="➗ Euclidean GCD Visualizer">
      <ExplanationBox>
        <h3 style={{ marginBottom: 12, color: '#1e293b' }}>What is the Euclidean Algorithm?</h3>
        <p>
          The Euclidean algorithm finds the <strong>Greatest Common Divisor (GCD)</strong> of two integers.
          It repeatedly replaces (a, b) with (b, a % b) until b becomes zero — then a is the GCD.
        </p>
        <h4 style={{ margin: '16px 0 8px', color: '#475569' }}>How It Works</h4>
        <ol style={{ paddingLeft: 20, margin: 0 }}>
          <li>Compute r = a % b</li>
          <li>Set a ← b, b ← r</li>
          <li>Repeat until b = 0</li>
          <li>When b = 0, a is the GCD</li>
        </ol>
        <p style={{ marginTop: 12 }}>
          <strong>Time Complexity:</strong> O(log min(a, b))
        </p>
      </ExplanationBox>

      <CodeBlock code={gcdPythonCode} onCopy={() => { }} />

      <VisualizationContainer>
        {/* Inputs */}
        <div style={{
          display: 'flex',
          justifyContent: 'center',
          gap: 24,
          marginBottom: 24,
          flexWrap: 'wrap'
        }}>
          <div>
            <label style={{ marginRight: 8, fontWeight: 600, color: '#475569' }}>a:</label>
            <input
              type="number"
              value={a}
              onChange={e => { setA(+e.target.value); reset() }}
              disabled={running}
              style={{
                width: 100,
                padding: '10px 14px',
                fontSize: 16,
                borderRadius: 8,
                border: '2px solid #e2e8f0',
                fontWeight: 600,
                textAlign: 'center'
              }}
            />
          </div>
          <div>
            <label style={{ marginRight: 8, fontWeight: 600, color: '#475569' }}>b:</label>
            <input
              type="number"
              value={b}
              onChange={e => { setB(+e.target.value); reset() }}
              disabled={running}
              style={{
                width: 100,
                padding: '10px 14px',
                fontSize: 16,
                borderRadius: 8,
                border: '2px solid #e2e8f0',
                fontWeight: 600,
                textAlign: 'center'
              }}
            />
          </div>
        </div>

        {/* Current Values Display */}
        <AnimatePresence mode="wait">
          {currentStep >= 0 && (
            <motion.div
              key={currentStep}
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0 }}
              style={{
                display: 'flex',
                justifyContent: 'center',
                gap: 20,
                marginBottom: 24
              }}
            >
              <motion.div
                animate={{ scale: step.phase === 'compute' ? 1.1 : 1 }}
                style={{
                  padding: '20px 30px',
                  background: 'linear-gradient(135deg, #3b82f6 0%, #1d4ed8 100%)',
                  borderRadius: 16,
                  color: 'white',
                  textAlign: 'center',
                  boxShadow: '0 8px 20px rgba(59, 130, 246, 0.3)'
                }}
              >
                <div style={{ fontSize: 14, opacity: 0.8, marginBottom: 4 }}>a</div>
                <motion.div
                  key={step.x}
                  initial={{ scale: 1.3 }}
                  animate={{ scale: 1 }}
                  style={{ fontSize: 32, fontWeight: 700 }}
                >
                  {step.x}
                </motion.div>
              </motion.div>

              <motion.div
                animate={{ rotate: step.phase === 'compute' ? 360 : 0 }}
                transition={{ duration: 0.5 }}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  fontSize: 24,
                  color: '#64748b'
                }}
              >
                %
              </motion.div>

              <motion.div
                animate={{ scale: step.phase === 'compute' ? 1.1 : 1 }}
                style={{
                  padding: '20px 30px',
                  background: 'linear-gradient(135deg, #8b5cf6 0%, #6d28d9 100%)',
                  borderRadius: 16,
                  color: 'white',
                  textAlign: 'center',
                  boxShadow: '0 8px 20px rgba(139, 92, 246, 0.3)'
                }}
              >
                <div style={{ fontSize: 14, opacity: 0.8, marginBottom: 4 }}>b</div>
                <motion.div
                  key={step.y}
                  initial={{ scale: 1.3 }}
                  animate={{ scale: 1 }}
                  style={{ fontSize: 32, fontWeight: 700 }}
                >
                  {step.y}
                </motion.div>
              </motion.div>

              {step.r !== null && (
                <>
                  <div style={{ display: 'flex', alignItems: 'center', fontSize: 24, color: '#64748b' }}>
                    =
                  </div>
                  <motion.div
                    initial={{ scale: 0, opacity: 0 }}
                    animate={{ scale: 1, opacity: 1 }}
                    style={{
                      padding: '20px 30px',
                      background: 'linear-gradient(135deg, #f59e0b 0%, #d97706 100%)',
                      borderRadius: 16,
                      color: 'white',
                      textAlign: 'center',
                      boxShadow: '0 8px 20px rgba(245, 158, 11, 0.3)'
                    }}
                  >
                    <div style={{ fontSize: 14, opacity: 0.8, marginBottom: 4 }}>remainder</div>
                    <div style={{ fontSize: 32, fontWeight: 700 }}>{step.r}</div>
                  </motion.div>
                </>
              )}
            </motion.div>
          )}
        </AnimatePresence>

        {/* Status Message */}
        <AnimatePresence mode="wait">
          {currentStep >= 0 && step.message && (
            <StatusMessage
              key={currentStep}
              message={step.message}
              type={step.phase === 'done' ? 'success' : 'info'}
            />
          )}
        </AnimatePresence>

        {/* Steps History */}
        <div style={{ marginTop: 24, maxHeight: 200, overflowY: 'auto' }}>
          {steps.slice(0, currentStep + 1).filter(s => s.phase === 'update' || s.phase === 'done').map((st, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: i * 0.1 }}
              style={{
                background: st.phase === 'done'
                  ? 'linear-gradient(135deg, #11998e 0%, #38ef7d 100%)'
                  : '#f1f5f9',
                padding: '12px 20px',
                margin: '8px auto',
                borderRadius: 10,
                maxWidth: 400,
                fontSize: 15,
                fontWeight: 600,
                color: st.phase === 'done' ? 'white' : '#475569',
                boxShadow: '0 2px 8px rgba(0,0,0,0.08)'
              }}
            >
              {st.message}
            </motion.div>
          ))}
        </div>

        {/* Controls */}
        <ControlsRow>
          <SpeedControl speed={speed} onSpeedChange={setSpeed} disabled={false} />

          {running && (
            <StepCounter current={currentStep + 1} total={steps.length} />
          )}

          <ControlButton
            onClick={start}
            disabled={running && !isPaused}
            variant="primary"
          >
            {running ? '⚙️ Computing...' : '▶️ Start'}
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
          {isFinalStep && result !== null && (
            <motion.div
              initial={{ opacity: 0, scale: 0.8, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0 }}
              transition={SPRING.bouncy}
              style={{
                marginTop: 24,
                padding: '20px 32px',
                background: 'linear-gradient(135deg, #11998e 0%, #38ef7d 100%)',
                borderRadius: 16,
                color: 'white',
                fontWeight: 700,
                fontSize: 24,
                display: 'inline-block',
                boxShadow: '0 8px 25px rgba(17, 153, 142, 0.4)'
              }}
            >
              🎉 GCD({a}, {b}) = {result}
            </motion.div>
          )}
        </AnimatePresence>
      </VisualizationContainer>
    </PageContainer>
  )
}
