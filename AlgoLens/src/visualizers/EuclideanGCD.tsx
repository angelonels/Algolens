import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { SPEED_PRESETS, EASE_OUT, type SpeedKey } from '../utils/animationConfig'
import {
  SpeedControl,
  StepCounter,
  StatusMessage,
  ControlButton,
  CodeBlock,
  PageContainer,
  ExplanationBox,
  VisualizationContainer,
  ControlsRow,
  SplitLayout,
  SplitLeft,
  SplitRight
} from '../components/ui/shared'
import { EUCLIDEAN_GCD_CODE } from '../data/algorithmCodes'


export default function GCDVisualizer() {
  const [a, setA] = useState(252)
  const [b, setB] = useState(105)
  const [steps, setSteps] = useState([])
  const [currentStep, setCurrentStep] = useState(-1)
  const [running, setRunning] = useState(false)
  const [speed, setSpeed] = useState('1x' as SpeedKey)
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
      message: `GCD = ${x}`
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
        const t = setTimeout(() => setCurrentStep(cs => cs + 1), SPEED_PRESETS[speed])
        return () => clearTimeout(t)
      } else {
        setRunning(false)
        setResult(steps[currentStep].x)
      }
    }
  }, [running, currentStep, steps, speed, isPaused])

  const step = steps[currentStep] || { x: a, y: b, phase: 'idle', message: '' }

  const isFinalStep = steps.length > 0 && currentStep === steps.length - 1 && !running

  const inputStyle = {
    width: 100,
    padding: '8px 12px',
    fontSize: 14,
    fontWeight: 600,
    textAlign: 'center',
    border: `1px solid ${'var(--border)'}`,
    borderRadius: '0px',
    background: 'var(--surface)'
  }

  const labelStyle = {
    marginRight: 8,
    fontWeight: 600,
    fontSize: '12px',
    textTransform: 'uppercase',
    letterSpacing: '0.05em',
    color: 'var(--fg-muted)'
  }

  return (
    <PageContainer title="Euclidean GCD Visualizer">
      <SplitLayout>
        <SplitLeft>
          <ExplanationBox>
            <h3 className="font-mono text-base font-bold text-[var(--fg)] mb-3">What is the Euclidean Algorithm?</h3>
            <p>
              The Euclidean algorithm is one of the oldest known algorithms, dating back to around 300 BC
              in Euclid's <em>Elements</em>. It efficiently computes the <strong>Greatest Common Divisor (GCD)</strong> of
              two integers — the largest number that divides both without a remainder. Despite its ancient
              origins, it remains one of the fastest methods for computing GCD and is foundational to modern
              number theory and cryptography.
            </p>
            <p className="mt-2 text-sm text-[var(--fg-muted)] leading-relaxed">
              The algorithm is based on a simple but powerful mathematical property: <strong>gcd(a, b) = gcd(b, a % b)</strong>.
              This means repeatedly replacing the larger number with the remainder of dividing the two numbers
              will eventually produce the GCD when the remainder becomes zero. The number of steps is
              proportional to the number of digits — making it extremely fast even for very large numbers.
            </p>
            <h4 className="font-mono text-sm font-bold text-[var(--fg)] mt-4 mb-2">How It Works</h4>
            <ol className="pl-5 text-sm text-[var(--fg-muted)] leading-relaxed space-y-1">
              <li>Start with two numbers <code>a</code> and <code>b</code> (where a ≥ b)</li>
              <li>Compute the remainder: <code>r = a % b</code></li>
              <li>Replace: set <code>a ← b</code> and <code>b ← r</code></li>
              <li>Repeat steps 2–3 until <code>b = 0</code></li>
              <li>When <code>b = 0</code>, the value of <code>a</code> is the GCD</li>
            </ol>
            <h4 className="font-mono text-sm font-bold text-[var(--fg)] mt-4 mb-2">Why It Works</h4>
            <p>
              If <code>d</code> divides both <code>a</code> and <code>b</code>, then <code>d</code> also
              divides <code>a % b</code> (since <code>a % b = a - k·b</code> for some integer k). This means
              every common divisor of <code>(a, b)</code> is also a common divisor of <code>(b, a % b)</code>,
              preserving the GCD at each step. The process terminates because <code>b</code> strictly decreases
              toward zero.
            </p>
            <h4 className="font-mono text-sm font-bold text-[var(--fg)] mt-4 mb-2">Key Characteristics</h4>
            <ul className="pl-5 text-sm text-[var(--fg-muted)] leading-relaxed space-y-1">
              <li><strong>Extremely efficient:</strong> Number of steps is at most ~5× the number of digits in the smaller number</li>
              <li><strong>Works for any positive integers:</strong> No restrictions on the size or relationship between inputs</li>
              <li><strong>Extended version:</strong> The Extended Euclidean Algorithm also finds integers x, y such that ax + by = gcd(a, b) — essential for modular inverse computation</li>
              <li><strong>Basis for RSA:</strong> The extended form is critical in RSA encryption for computing private keys</li>
            </ul>
            <p className="mt-3 text-sm text-[var(--fg-muted)] leading-relaxed">
              <strong>Time Complexity:</strong> O(log min(a, b)) — logarithmic in the smaller input
            </p>
            <p className="mt-1 text-sm text-[var(--fg-muted)] leading-relaxed">
              <strong>Space Complexity:</strong> O(1) iterative | O(log min(a, b)) recursive
            </p>
            <p className="mt-3 text-xs text-[var(--fg-muted)] leading-relaxed">
              <strong>Real-world uses:</strong> Simplifying fractions, cryptographic key generation (RSA),
              computing least common multiples (LCM = a·b / gcd(a,b)), Bézout's identity, and modular
              arithmetic in competitive programming.
            </p>
          </ExplanationBox>

          <CodeBlock codes={EUCLIDEAN_GCD_CODE} />
        </SplitLeft>
        <SplitRight>
          <VisualizationContainer>
            {/* Inputs */}
            <div style={{
              display: 'flex',
              gap: 20,
              marginBottom: 24,
              flexWrap: 'wrap'
            }}>
              <div>
                <label style={labelStyle}>a</label>
                <input
                  type="number"
                  value={a}
                  onChange={e => { setA(+e.target.value); reset() }}
                  disabled={running}
                  style={inputStyle}
                />
              </div>
              <div>
                <label style={labelStyle}>b</label>
                <input
                  type="number"
                  value={b}
                  onChange={e => { setB(+e.target.value); reset() }}
                  disabled={running}
                  style={inputStyle}
                />
              </div>
            </div>

            {/* Current Values Display */}
            <AnimatePresence mode="wait">
              {currentStep >= 0 && (
                <motion.div
                  key={currentStep}
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  style={{
                    display: 'flex',
                    justifyContent: 'center',
                    gap: 16,
                    marginBottom: 24,
                    alignItems: 'center'
                  }}
                >
                  <motion.div
                    animate={{ scale: step.phase === 'compute' ? 1.04 : 1 }}
                    style={{
                      padding: '16px 24px',
                      background: 'var(--surface)',
                      border: `1px solid ${'var(--color-comparing)'}`,
                      borderTop: `3px solid ${'var(--color-comparing)'}`,
                      borderRadius: '0px',
                      textAlign: 'center'
                    }}
                  >
                    <div style={{
                      fontSize: 11,
                      textTransform: 'uppercase',
                      letterSpacing: '0.08em',
                      color: 'var(--fg-muted)',
                      marginBottom: 4
                    }}>a</div>
                    <motion.div
                      key={step.x}
                      initial={{ scale: 1.2 }}
                      animate={{ scale: 1 }}
                      style={{
                        fontSize: 28,
                        fontWeight: 700,
                        color: 'var(--fg)'
                      }}
                    >
                      {step.x}
                    </motion.div>
                  </motion.div>

                  <div style={{
                    fontSize: 20,
                    color: 'var(--fg-muted)'
                  }}>
                    %
                  </div>

                  <motion.div
                    animate={{ scale: step.phase === 'compute' ? 1.04 : 1 }}
                    style={{
                      padding: '16px 24px',
                      background: 'var(--surface)',
                      border: `1px solid ${'var(--color-pivot)'}`,
                      borderTop: `3px solid ${'var(--color-pivot)'}`,
                      borderRadius: '0px',
                      textAlign: 'center'
                    }}
                  >
                    <div style={{
                      fontSize: 11,
                      textTransform: 'uppercase',
                      letterSpacing: '0.08em',
                      color: 'var(--fg-muted)',
                      marginBottom: 4
                    }}>b</div>
                    <motion.div
                      key={step.y}
                      initial={{ scale: 1.2 }}
                      animate={{ scale: 1 }}
                      style={{
                        fontSize: 28,
                        fontWeight: 700,
                        color: 'var(--fg)'
                      }}
                    >
                      {step.y}
                    </motion.div>
                  </motion.div>

                  {step.r !== null && (
                    <>
                      <div style={{
                        fontSize: 20,
                        color: 'var(--fg-muted)'
                      }}>
                        =
                      </div>
                      <motion.div
                        initial={{ scale: 0, opacity: 0 }}
                        animate={{ scale: 1, opacity: 1 }}
                        style={{
                          padding: '16px 24px',
                          background: 'var(--surface)',
                          border: `1px solid ${'var(--color-active)'}`,
                          borderTop: `3px solid ${'var(--color-active)'}`,
                          borderRadius: '0px',
                          textAlign: 'center'
                        }}
                      >
                        <div style={{
                          fontSize: 11,
                          textTransform: 'uppercase',
                          letterSpacing: '0.08em',
                          color: 'var(--fg-muted)',
                          marginBottom: 4
                        }}>remainder</div>
                        <div style={{
                          fontSize: 28,
                          fontWeight: 700,
                          color: 'var(--fg)'
                        }}>{step.r}</div>
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
                  initial={{ opacity: 0, x: -12 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: i * 0.05 }}
                  style={{
                    background: 'var(--surface)',
                    border: `1px solid ${st.phase === 'done' ? 'var(--color-sorted)' : 'var(--border)'}`,
                    borderLeft: st.phase === 'done' ? `3px solid ${'var(--color-sorted)'}` : `1px solid ${'var(--border)'}`,
                    padding: '10px 16px',
                    margin: '4px 0',
                    borderRadius: '0px',
                    maxWidth: 400,
                    fontSize: 13,
                    fontWeight: 600,
                    color: 'var(--fg)'
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
                {running ? 'Computing…' : 'Start'}
              </ControlButton>

              {running && (
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
              {isFinalStep && result !== null && (
                <motion.div
                  initial={{ opacity: 0, y: 8 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0 }}
                  transition={{ duration: 0.2, ease: [0.16, 1, 0.3, 1] }}
                  style={{
                    marginTop: 24,
                    padding: '14px 24px',
                    background: 'var(--surface)',
                    border: `1px solid ${'var(--color-sorted)'}`,
                    borderLeft: `3px solid ${'var(--color-sorted)'}`,
                    borderRadius: '0px',
                    fontWeight: 700,
                    fontSize: 18,
                    color: 'var(--fg)',
                    display: 'inline-block'
                  }}
                >
                  ✓ GCD({a}, {b}) = {result}
                </motion.div>
              )}
            </AnimatePresence>
          </VisualizationContainer>
        </SplitRight>
      </SplitLayout>
    </PageContainer>
  )
}
