import React, { useState, useEffect, useRef } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { SPEED_PRESETS, COLORS, SPRING } from '../utils/animationConfig'
import {
    SpeedControl, StepCounter, StatusMessage, ControlButton,
    CodeBlock, PageContainer, ExplanationBox, VisualizationContainer, ControlsRow,
    SplitLayout, SplitLeft, SplitRight
} from '../components/ui/AnimationComponents'

const lrPythonCode = `import numpy as np

def linear_regression_gd(X, y, lr=0.01, epochs=100):
    m, b = 0.0, 0.0
    n = len(X)
    history = []
    
    for epoch in range(epochs):
        y_pred = m * X + b
        cost = (1/n) * np.sum((y - y_pred) ** 2)
        dm = (-2/n) * np.sum(X * (y - y_pred))
        db = (-2/n) * np.sum(y - y_pred)
        m -= lr * dm
        b -= lr * db
        history.append((m, b, cost))
    
    return m, b, history`

// ── Data Generation ──
function generateData(n = 30) {
    const trueM = 1.5 + (Math.random() - 0.5) * 2
    const trueB = 0.5 + (Math.random() - 0.5) * 1
    const points = []
    for (let i = 0; i < n; i++) {
        const x = Math.random() * 4 + 0.5
        const noise = (Math.random() - 0.5) * 2.5
        const y = trueM * x + trueB + noise
        points.push({ x, y })
    }
    return points
}

// ── Gradient Descent Steps ──
function computeGDSteps(points, lr = 0.05, maxEpochs = 60) {
    let m = 0, b = 0
    const n = points.length
    const steps = []

    steps.push({
        m, b,
        cost: points.reduce((s, p) => s + (p.y - (m * p.x + b)) ** 2, 0) / n,
        epoch: 0,
        dm: 0, db: 0,
        phase: 'init',
        message: 'Initial state: m=0, b=0 — flat line'
    })

    for (let epoch = 1; epoch <= maxEpochs; epoch++) {
        const predictions = points.map(p => m * p.x + b)
        const cost = points.reduce((s, p, i) => s + (p.y - predictions[i]) ** 2, 0) / n
        const dm = (-2 / n) * points.reduce((s, p, i) => s + p.x * (p.y - predictions[i]), 0)
        const db = (-2 / n) * points.reduce((s, p, i) => s + (p.y - predictions[i]), 0)

        m -= lr * dm
        b -= lr * db

        const newCost = points.reduce((s, p) => s + (p.y - (m * p.x + b)) ** 2, 0) / n

        steps.push({
            m, b, cost: newCost,
            epoch, dm, db,
            phase: newCost < 0.5 ? 'converging' : 'training',
            message: `Epoch ${epoch}: m=${m.toFixed(3)}, b=${b.toFixed(3)}, cost=${newCost.toFixed(4)}`
        })

        if (Math.abs(dm) < 0.001 && Math.abs(db) < 0.001) {
            steps[steps.length - 1].phase = 'converged'
            steps[steps.length - 1].message = `✓ Converged at epoch ${epoch}: y = ${m.toFixed(3)}x + ${b.toFixed(3)}`
            break
        }
    }

    if (steps[steps.length - 1].phase !== 'converged') {
        steps[steps.length - 1].phase = 'converged'
        steps[steps.length - 1].message = `✓ Training complete: y = ${m.toFixed(3)}x + ${b.toFixed(3)}, cost=${steps[steps.length - 1].cost.toFixed(4)}`
    }

    return steps
}

// ── Canvas Constants ──
const W = 460, H = 320, PAD = 40
const COST_W = 460, COST_H = 120

export default function LinearRegressionVisualizer() {
    const [points, setPoints] = useState(() => generateData())
    const [steps, setSteps] = useState([])
    const [currentStep, setCurrentStep] = useState(-1)
    const [running, setRunning] = useState(false)
    const [speed, setSpeed] = useState(SPEED_PRESETS.fast)
    const [isPaused, setIsPaused] = useState(false)
    const [showResiduals, setShowResiduals] = useState(true)
    const canvasRef = useRef(null)
    const costCanvasRef = useRef(null)

    // Data bounds
    const xMin = Math.min(...points.map(p => p.x)) - 0.5
    const xMax = Math.max(...points.map(p => p.x)) + 0.5
    const yMin = Math.min(...points.map(p => p.y)) - 1
    const yMax = Math.max(...points.map(p => p.y)) + 1

    const toCanvasX = x => PAD + ((x - xMin) / (xMax - xMin)) * (W - 2 * PAD)
    const toCanvasY = y => H - PAD - ((y - yMin) / (yMax - yMin)) * (H - 2 * PAD)

    const startGD = () => {
        const s = computeGDSteps(points)
        setSteps(s)
        setCurrentStep(0)
        setRunning(true)
        setIsPaused(false)
    }

    const reset = () => {
        setSteps([])
        setCurrentStep(-1)
        setRunning(false)
        setIsPaused(false)
    }

    const regenerate = () => {
        reset()
        setPoints(generateData())
    }

    const togglePause = () => setIsPaused(!isPaused)

    useEffect(() => {
        if (running && !isPaused && currentStep >= 0 && currentStep < steps.length - 1) {
            const t = setTimeout(() => setCurrentStep(cs => cs + 1), speed)
            return () => clearTimeout(t)
        } else if (running && currentStep >= steps.length - 1) {
            setRunning(false)
        }
    }, [running, currentStep, steps, speed, isPaused])

    const step = steps[currentStep] || { m: 0, b: 0, cost: 0, epoch: 0, phase: 'idle', message: '' }

    // ── Render main scatter + regression line ──
    useEffect(() => {
        const canvas = canvasRef.current
        if (!canvas) return
        const ctx = canvas.getContext('2d')
        const dpr = window.devicePixelRatio || 1
        canvas.width = W * dpr
        canvas.height = H * dpr
        ctx.scale(dpr, dpr)
        ctx.clearRect(0, 0, W, H)

        // Background
        ctx.fillStyle = '#fafaf8'
        ctx.fillRect(0, 0, W, H)

        // Grid lines
        ctx.strokeStyle = '#e8e4dc'
        ctx.lineWidth = 0.5
        for (let i = 0; i <= 5; i++) {
            const gx = PAD + (i / 5) * (W - 2 * PAD)
            ctx.beginPath(); ctx.moveTo(gx, PAD); ctx.lineTo(gx, H - PAD); ctx.stroke()
            const gy = PAD + (i / 5) * (H - 2 * PAD)
            ctx.beginPath(); ctx.moveTo(PAD, gy); ctx.lineTo(W - PAD, gy); ctx.stroke()
        }

        // Axes
        ctx.strokeStyle = '#0a0a0a'
        ctx.lineWidth = 1.5
        ctx.beginPath(); ctx.moveTo(PAD, H - PAD); ctx.lineTo(W - PAD, H - PAD); ctx.stroke()
        ctx.beginPath(); ctx.moveTo(PAD, PAD); ctx.lineTo(PAD, H - PAD); ctx.stroke()

        // Axis labels
        ctx.fillStyle = '#666'
        ctx.font = '10px JetBrains Mono'
        ctx.textAlign = 'center'
        for (let i = 0; i <= 4; i++) {
            const val = xMin + (i / 4) * (xMax - xMin)
            ctx.fillText(val.toFixed(1), PAD + (i / 4) * (W - 2 * PAD), H - PAD + 16)
        }
        ctx.textAlign = 'right'
        for (let i = 0; i <= 4; i++) {
            const val = yMin + (i / 4) * (yMax - yMin)
            ctx.fillText(val.toFixed(1), PAD - 6, H - PAD - (i / 4) * (H - 2 * PAD) + 4)
        }

        // Residual lines (animated opacity)
        if (showResiduals && currentStep >= 0) {
            const residualOpacity = Math.min(0.6, 0.1 + (step.epoch / 20) * 0.5)
            points.forEach(p => {
                const predicted = step.m * p.x + step.b
                const px = toCanvasX(p.x)
                const py1 = toCanvasY(p.y)
                const py2 = toCanvasY(predicted)
                ctx.strokeStyle = `rgba(230, 51, 18, ${residualOpacity})`
                ctx.lineWidth = 1.5
                ctx.setLineDash([3, 3])
                ctx.beginPath(); ctx.moveTo(px, py1); ctx.lineTo(px, py2); ctx.stroke()
                ctx.setLineDash([])
            })
        }

        // Data points with glow
        points.forEach((p, i) => {
            const px = toCanvasX(p.x)
            const py = toCanvasY(p.y)

            // Glow
            const gradient = ctx.createRadialGradient(px, py, 0, px, py, 12)
            gradient.addColorStop(0, 'rgba(37, 99, 235, 0.15)')
            gradient.addColorStop(1, 'rgba(37, 99, 235, 0)')
            ctx.fillStyle = gradient
            ctx.beginPath(); ctx.arc(px, py, 12, 0, Math.PI * 2); ctx.fill()

            // Point
            ctx.fillStyle = '#2563eb'
            ctx.beginPath(); ctx.arc(px, py, 4.5, 0, Math.PI * 2); ctx.fill()

            // White ring
            ctx.strokeStyle = '#fff'
            ctx.lineWidth = 1.5
            ctx.beginPath(); ctx.arc(px, py, 4.5, 0, Math.PI * 2); ctx.stroke()
        })

        // Regression line
        if (currentStep >= 0) {
            const lx1 = xMin - 1
            const lx2 = xMax + 1
            const ly1 = step.m * lx1 + step.b
            const ly2 = step.m * lx2 + step.b

            // Line glow
            ctx.strokeStyle = 'rgba(230, 51, 18, 0.15)'
            ctx.lineWidth = 8
            ctx.beginPath()
            ctx.moveTo(toCanvasX(lx1), toCanvasY(ly1))
            ctx.lineTo(toCanvasX(lx2), toCanvasY(ly2))
            ctx.stroke()

            // Main line
            ctx.strokeStyle = '#e63312'
            ctx.lineWidth = 2.5
            ctx.beginPath()
            ctx.moveTo(toCanvasX(lx1), toCanvasY(ly1))
            ctx.lineTo(toCanvasX(lx2), toCanvasY(ly2))
            ctx.stroke()

            // Equation label
            ctx.fillStyle = '#e63312'
            ctx.font = 'bold 11px JetBrains Mono'
            ctx.textAlign = 'left'
            ctx.fillText(
                `y = ${step.m.toFixed(2)}x + ${step.b.toFixed(2)}`,
                PAD + 8, PAD + 16
            )
        }
    }, [currentStep, points, step, showResiduals])

    // ── Render cost curve ──
    useEffect(() => {
        const canvas = costCanvasRef.current
        if (!canvas || currentStep < 0) return
        const ctx = canvas.getContext('2d')
        const dpr = window.devicePixelRatio || 1
        canvas.width = COST_W * dpr
        canvas.height = COST_H * dpr
        ctx.scale(dpr, dpr)
        ctx.clearRect(0, 0, COST_W, COST_H)

        ctx.fillStyle = '#fafaf8'
        ctx.fillRect(0, 0, COST_W, COST_H)

        const costs = steps.slice(0, currentStep + 1).map(s => s.cost)
        if (costs.length < 2) return

        const maxCost = Math.max(...steps.map(s => s.cost)) * 1.1
        const cPad = 30

        // Label
        ctx.fillStyle = '#666'
        ctx.font = 'bold 9px JetBrains Mono'
        ctx.textAlign = 'left'
        ctx.fillText('COST (MSE)', cPad, 14)

        // Axes
        ctx.strokeStyle = '#d4d0c8'
        ctx.lineWidth = 1
        ctx.beginPath(); ctx.moveTo(cPad, 20); ctx.lineTo(cPad, COST_H - 15); ctx.stroke()
        ctx.beginPath(); ctx.moveTo(cPad, COST_H - 15); ctx.lineTo(COST_W - 10, COST_H - 15); ctx.stroke()

        // Cost curve with gradient fill
        const plotW = COST_W - cPad - 10
        const plotH = COST_H - 35

        ctx.beginPath()
        costs.forEach((c, i) => {
            const x = cPad + (i / (steps.length - 1)) * plotW
            const y = 20 + (1 - c / maxCost) * plotH
            if (i === 0) ctx.moveTo(x, y)
            else ctx.lineTo(x, y)
        })

        // Fill under curve
        const lastX = cPad + ((costs.length - 1) / (steps.length - 1)) * plotW
        ctx.lineTo(lastX, COST_H - 15)
        ctx.lineTo(cPad, COST_H - 15)
        ctx.closePath()
        const grad = ctx.createLinearGradient(0, 20, 0, COST_H - 15)
        grad.addColorStop(0, 'rgba(230, 51, 18, 0.15)')
        grad.addColorStop(1, 'rgba(230, 51, 18, 0.01)')
        ctx.fillStyle = grad
        ctx.fill()

        // Line
        ctx.beginPath()
        costs.forEach((c, i) => {
            const x = cPad + (i / (steps.length - 1)) * plotW
            const y = 20 + (1 - c / maxCost) * plotH
            if (i === 0) ctx.moveTo(x, y)
            else ctx.lineTo(x, y)
        })
        ctx.strokeStyle = '#e63312'
        ctx.lineWidth = 2
        ctx.stroke()

        // Current point
        const cx = cPad + ((costs.length - 1) / (steps.length - 1)) * plotW
        const cy = 20 + (1 - costs[costs.length - 1] / maxCost) * plotH
        ctx.fillStyle = '#e63312'
        ctx.beginPath(); ctx.arc(cx, cy, 4, 0, Math.PI * 2); ctx.fill()
        ctx.strokeStyle = '#fff'
        ctx.lineWidth = 1.5
        ctx.beginPath(); ctx.arc(cx, cy, 4, 0, Math.PI * 2); ctx.stroke()

        // Cost value
        ctx.fillStyle = '#0a0a0a'
        ctx.font = 'bold 10px JetBrains Mono'
        ctx.textAlign = 'right'
        ctx.fillText(costs[costs.length - 1].toFixed(4), COST_W - 12, 14)
    }, [currentStep, steps])

    const isFinalStep = currentStep === steps.length - 1 && !running

    return (
        <PageContainer title="Linear Regression">
            <SplitLayout>
                <SplitLeft>
                    <ExplanationBox>
                        <h3 style={{ marginBottom: 12, color: COLORS.fg }}>What is Linear Regression?</h3>
                        <p>
                            Linear Regression is a foundational <strong>supervised learning</strong> algorithm that
                            models the relationship between a dependent variable y and one or more independent
                            variables X by fitting a <strong>straight line</strong> (y = mx + b) that minimizes
                            the sum of squared errors between predicted and actual values.
                        </p>
                        <p style={{ marginTop: 8 }}>
                            This visualization uses <strong>gradient descent</strong> to iteratively adjust the
                            slope (m) and intercept (b) to minimize the <strong>Mean Squared Error (MSE)</strong>.
                            Watch the regression line rotate and shift into position as the cost function decreases,
                            and observe the <strong>residual lines</strong> (prediction errors) shrink with each epoch.
                        </p>
                        <h4 style={{ margin: '16px 0 8px' }}>How Gradient Descent Works</h4>
                        <ol style={{ paddingLeft: 20, margin: 0 }}>
                            <li>Initialize slope and intercept to zero</li>
                            <li>Compute predictions ŷ = mx + b for all points</li>
                            <li>Calculate the cost (MSE) and its gradients ∂C/∂m and ∂C/∂b</li>
                            <li>Update parameters: m ← m − α·∂C/∂m, b ← b − α·∂C/∂b</li>
                            <li>Repeat until convergence (gradients ≈ 0)</li>
                        </ol>
                        <h4 style={{ margin: '16px 0 8px' }}>Key Characteristics</h4>
                        <ul style={{ paddingLeft: 20, margin: 0 }}>
                            <li><strong>Parametric:</strong> Assumes a linear relationship between X and y</li>
                            <li><strong>Closed-form solution:</strong> Also solvable via Normal Equation (X<sup>T</sup>X)<sup>−1</sup>X<sup>T</sup>y</li>
                            <li><strong>Learning rate α:</strong> Controls step size — too large diverges, too small is slow</li>
                            <li><strong>Cost landscape:</strong> MSE is convex, so gradient descent finds the global minimum</li>
                        </ul>
                        <p style={{ marginTop: 12 }}>
                            <strong>Time Complexity:</strong> O(n · epochs) for gradient descent
                        </p>
                        <p style={{ marginTop: 4 }}>
                            <strong>Space Complexity:</strong> O(n) to store the dataset
                        </p>
                        <p style={{ marginTop: 12, color: COLORS.fgMuted, fontSize: '0.9em' }}>
                            <strong>Real-world uses:</strong> House price prediction, stock forecasting, trend analysis,
                            scientific modeling, and as a building block for more complex models like neural networks.
                        </p>
                    </ExplanationBox>

                    <CodeBlock code={lrPythonCode} onCopy={() => { }} />
                </SplitLeft>
                <SplitRight>
                    <VisualizationContainer>
                        {/* Status Message */}
                        <AnimatePresence mode="wait">
                            {currentStep >= 0 && step.message && (
                                <StatusMessage
                                    key={currentStep}
                                    message={step.message}
                                    type={step.phase === 'converged' ? 'success' : 'info'}
                                />
                            )}
                        </AnimatePresence>

                        {/* Main scatter plot */}
                        <div style={{
                            margin: '12px auto',
                            border: `1px solid ${COLORS.border}`,
                            borderRadius: '2px',
                            overflow: 'hidden',
                            width: W
                        }}>
                            <canvas
                                ref={canvasRef}
                                style={{ width: W, height: H, display: 'block' }}
                            />
                        </div>

                        {/* Stats bar */}
                        {currentStep >= 0 && (
                            <motion.div
                                initial={{ opacity: 0, y: 6 }}
                                animate={{ opacity: 1, y: 0 }}
                                style={{
                                    display: 'flex',
                                    gap: 12,
                                    justifyContent: 'center',
                                    flexWrap: 'wrap',
                                    margin: '8px 0'
                                }}
                            >
                                {[
                                    { label: 'EPOCH', val: step.epoch },
                                    { label: 'SLOPE', val: step.m.toFixed(3) },
                                    { label: 'INTERCEPT', val: step.b.toFixed(3) },
                                    { label: 'COST', val: step.cost.toFixed(4) }
                                ].map(({ label, val }) => (
                                    <div key={label} style={{
                                        padding: '4px 10px',
                                        background: COLORS.surface,
                                        border: `1px solid ${COLORS.border}`,
                                        fontFamily: "'JetBrains Mono', monospace",
                                        fontSize: 10,
                                        fontWeight: 600,
                                        textTransform: 'uppercase',
                                        letterSpacing: '0.04em',
                                        color: COLORS.fgMuted
                                    }}>
                                        <span style={{ color: COLORS.fg }}>{val}</span> {label}
                                    </div>
                                ))}
                            </motion.div>
                        )}

                        {/* Cost curve */}
                        {currentStep >= 0 && (
                            <motion.div
                                initial={{ opacity: 0, height: 0 }}
                                animate={{ opacity: 1, height: COST_H }}
                                transition={{ duration: 0.3, ease: [0.16, 1, 0.3, 1] }}
                                style={{
                                    margin: '8px auto',
                                    border: `1px solid ${COLORS.border}`,
                                    borderRadius: '2px',
                                    overflow: 'hidden',
                                    width: COST_W
                                }}
                            >
                                <canvas
                                    ref={costCanvasRef}
                                    style={{ width: COST_W, height: COST_H, display: 'block' }}
                                />
                            </motion.div>
                        )}

                        {/* Toggle */}
                        <div style={{
                            display: 'flex', gap: 12, justifyContent: 'center', margin: '8px 0',
                            fontFamily: "'JetBrains Mono', monospace", fontSize: 11, color: COLORS.fgMuted
                        }}>
                            <label style={{ display: 'flex', alignItems: 'center', gap: 6, cursor: 'pointer' }}>
                                <input
                                    type="checkbox"
                                    checked={showResiduals}
                                    onChange={e => setShowResiduals(e.target.checked)}
                                    style={{ accentColor: '#e63312' }}
                                />
                                Show residuals
                            </label>
                        </div>

                        {/* Controls */}
                        <ControlsRow>
                            <SpeedControl speed={speed} onSpeedChange={setSpeed} disabled={false} />

                            {running && <StepCounter current={currentStep + 1} total={steps.length} />}

                            <ControlButton onClick={startGD} disabled={running && !isPaused} variant="primary">
                                {running ? 'Training…' : 'Start Training'}
                            </ControlButton>

                            {running && (
                                <ControlButton onClick={togglePause} variant="success">
                                    {isPaused ? 'Resume' : 'Pause'}
                                </ControlButton>
                            )}

                            <ControlButton onClick={regenerate} disabled={running} variant="danger">
                                New Data
                            </ControlButton>

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
                                        marginTop: 20,
                                        padding: '12px 20px',
                                        background: COLORS.surface,
                                        border: `1px solid ${COLORS.sorted}`,
                                        borderLeft: `3px solid ${COLORS.sorted}`,
                                        borderRadius: '0px',
                                        fontFamily: "'JetBrains Mono', monospace",
                                        fontWeight: 600,
                                        fontSize: 14,
                                        color: COLORS.fg,
                                        display: 'inline-block'
                                    }}
                                >
                                    ✓ y = {step.m.toFixed(3)}x + {step.b.toFixed(3)} — {step.epoch} epochs, cost={step.cost.toFixed(4)}
                                </motion.div>
                            )}
                        </AnimatePresence>
                    </VisualizationContainer>
                </SplitRight>
            </SplitLayout>
        </PageContainer>
    )
}
